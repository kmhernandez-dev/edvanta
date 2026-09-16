/**
 * Arnés de pruebas del aula: PostgreSQL real (PGlite) con el esquema del
 * aula, la API montada en un puerto libre, un disco temporal y clientes
 * HTTP que guardan su propia cookie de sesión.
 */
import { PGlite } from '@electric-sql/pglite';
import express from 'express';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromPglite } from '../lib/aula/db.js';
import { cleanMigrationSql } from '../lib/sql-text.js';
import { hashPassword } from '../lib/aula/security.js';
import { createDiskStorage } from '../lib/aula/storage.js';
import { createAulaRouter } from '../routes/aula/index.js';

const MIGRATIONS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

export async function createTestDb() {
  const pglite = new PGlite();
  const files = (await readdir(MIGRATIONS)).filter((f) => /^\d+_aula_.*\.sql$/.test(f)).sort();
  for (const file of files) {
    await pglite.exec(cleanMigrationSql(await readFile(path.join(MIGRATIONS, file), 'utf8')));
  }
  return { pglite, db: fromPglite(pglite) };
}

export async function startTestApp({ now } = {}) {
  const { pglite, db } = await createTestDb();
  const dir = await mkdtemp(path.join(tmpdir(), 'aula-test-'));
  const storage = createDiskStorage(dir);
  await storage.init();
  const mails = [];
  const clock = { current: null };
  const app = express();
  app.use('/api/aula', createAulaRouter({
    db,
    storage,
    siteUrl: 'https://aula.test',
    secureCookies: false,
    mailer: { send: async (msg) => { mails.push(msg); return true; } },
    now: now || (() => clock.current || new Date()),
  }));
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}/api/aula`;
  return {
    db,
    pglite,
    storage,
    mails,
    baseUrl,
    clock,
    client: () => createClient(baseUrl),
    async close() {
      await new Promise((resolve) => server.close(resolve));
      await pglite.close();
      await rm(dir, { recursive: true, force: true });
    },
  };
}

export function createClient(baseUrl) {
  let cookie = null;

  async function request(method, pathname, { body, headers = {}, raw = false, aulaHeader = true } = {}) {
    const init = { method, headers: { ...headers } };
    if (aulaHeader) init.headers['X-Aula-Request'] = '1';
    if (cookie) init.headers.Cookie = cookie;
    if (body !== undefined) {
      if (Buffer.isBuffer(body)) {
        init.body = body;
        init.headers['Content-Type'] = init.headers['Content-Type'] || 'application/octet-stream';
      } else {
        init.body = JSON.stringify(body);
        init.headers['Content-Type'] = 'application/json';
      }
    }
    const res = await fetch(`${baseUrl}${pathname}`, init);
    for (const line of res.headers.getSetCookie()) {
      const [pair] = line.split(';');
      const [name, value] = pair.split('=');
      if (name === 'aula_session') cookie = value ? `aula_session=${value}` : null;
    }
    if (raw) return res;
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    return { status: res.status, data, headers: res.headers };
  }

  return {
    get cookie() { return cookie; },
    set cookie(value) { cookie = value; },
    get: (p, o) => request('GET', p, o),
    post: (p, body, o) => request('POST', p, { ...o, body }),
    put: (p, body, o) => request('PUT', p, { ...o, body }),
    patch: (p, body, o) => request('PATCH', p, { ...o, body }),
    del: (p, o) => request('DELETE', p, o),
    raw: (method, p, o) => request(method, p, { ...o, raw: true }),
    async login(email, password) {
      const res = await request('POST', '/auth/login', { body: { email, password } });
      if (res.status !== 200) throw new Error(`login ${email} → ${res.status} ${JSON.stringify(res.data)}`);
      return res.data.user;
    },
  };
}

let seq = 0;
export async function seedUser(db, {
  email, firstName = 'Persona', lastName = 'Prueba', role = 'participant', status = 'active',
  password = 'clave-segura-123', companyId = null, isDemo = false,
} = {}) {
  seq += 1;
  const mail = email || `persona${seq}@prueba.co`;
  const { rows } = await db.query(
    `INSERT INTO aula_users (email, first_name, last_name, role, status, password_hash, company_id, is_demo)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [mail, firstName, lastName, role, status, password ? await hashPassword(password) : null, companyId, isDemo],
  );
  return { ...rows[0], password };
}

/** Un PDF mínimo válido (empieza con %PDF-). */
export function pdfBytes(size = 3000) {
  const head = Buffer.from('%PDF-1.4\n% aula de prueba\n', 'latin1');
  return Buffer.concat([head, Buffer.alloc(Math.max(0, size - head.length), 0x20)]);
}

export function pngBytes(size = 200) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([sig, Buffer.alloc(Math.max(0, size - sig.length), 1)]);
}

/** Sube un archivo completo en partes del tamaño indicado. */
export async function uploadFile(client, { purpose, filename, bytes, partSize = 1024, extra = {} }) {
  const init = await client.post('/uploads', { purpose, filename, size: bytes.length, ...extra });
  if (init.status !== 201) return { init };
  for (let offset = 0; offset < bytes.length; offset += partSize) {
    const part = bytes.subarray(offset, offset + partSize);
    const res = await client.put(`/uploads/${init.data.id}/chunk`, part, { headers: { 'X-Chunk-Offset': String(offset) } });
    if (res.status !== 200) return { init, failed: res };
  }
  const done = await client.post(`/uploads/${init.data.id}/complete`, {});
  return { init, done, id: init.data.id };
}

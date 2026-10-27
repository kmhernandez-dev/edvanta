import { PGlite } from '@electric-sql/pglite';
import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cleanMigrationSql } from '../lib/sql-text.js';
import { createAcademiaAuthRouter } from '../routes/academia-auth.js';

const MIGRATIONS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
const ACADEMIA_MIGRATIONS = [
  '003_academia.sql',
  '007_academia_autocuidado.sql',
  '008_academia_learning_path.sql',
  '052_academia_identidad_supabase.sql',
];

async function startApi() {
  const pglite = new PGlite();
  for (const file of ACADEMIA_MIGRATIONS) {
    const sql = await readFile(path.join(MIGRATIONS, file), 'utf8');
    await pglite.exec(cleanMigrationSql(sql));
  }

  const identities = new Map();
  const googleClient = {
    verifyIdToken: async ({ idToken }) => ({
      getPayload: () => JSON.parse(idToken),
    }),
  };

  const app = express();
  app.use(express.json());
  app.use('/api/academia/auth', createAcademiaAuthRouter({
    db: pglite,
    googleClientId: 'cliente-de-prueba',
    googleClient,
    verifySupabase: async token => identities.get(token) || null,
  }));

  const server = await new Promise(resolve => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}/api/academia/auth`;

  async function call(pathname, body, options = {}) {
    const res = await fetch(`${base}${pathname}`, {
      method: options.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }

  return {
    pglite,
    identities,
    call,
    async close() {
      await new Promise(resolve => server.close(resolve));
      await pglite.close();
    },
    async seed({ email, password = 'clave-segura-123', googleSub = null, supabaseId = null }) {
      const hash = password ? await bcrypt.hash(password, 4) : null;
      const { rows: [user] } = await pglite.query(
        `INSERT INTO academia_users (name, email, password_hash, google_sub, supabase_user_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        ['Persona de prueba', email, hash, googleSub, supabaseId],
      );
      return user;
    },
  };
}

const googleCredential = (overrides = {}) => JSON.stringify({
  sub: 'google-sub-1',
  email: 'persona@example.com',
  email_verified: true,
  name: 'Persona de prueba',
  picture: null,
  ...overrides,
});

const supabaseIdentity = (overrides = {}) => ({
  id: 'supabase-user-1',
  email: 'persona@example.com',
  name: 'Persona de prueba',
  avatarUrl: null,
  provider: 'google',
  googleSub: 'google-sub-1',
  ...overrides,
});

describe('academia · identidad Supabase y vinculación segura', () => {
  let t;
  beforeAll(async () => { t = await startApi(); });
  afterAll(async () => { await t.close(); });

  it('emite un JWT de Academia que /me puede verificar', async () => {
    const created = await t.call('/register', {
      name: 'Registro de prueba',
      email: 'registro@example.com',
      password: 'clave-registro-2026',
      privacy_accepted: true,
    });
    expect(created.status).toBe(201);
    expect(created.data.token).toBeTruthy();

    const me = await t.call('/me', undefined, { method: 'GET', token: created.data.token });
    expect(me.status).toBe(200);
    expect(me.data.user.email).toBe('registro@example.com');
  });

  it('crea la cuenta de Academia para una persona nueva de Supabase', async () => {
    t.identities.set('token-nueva', supabaseIdentity({
      id: 'supabase-nueva',
      email: 'nueva@example.com',
      name: 'Persona Nueva',
      googleSub: 'google-nueva',
    }));

    const res = await t.call('/supabase', { accessToken: 'token-nueva' });
    expect(res.status).toBe(200);
    expect(res.data.user.email).toBe('nueva@example.com');
    expect(res.data.user.auth_provider).toBe('google');
    expect(res.data.token).toBeTruthy();

    const { rows } = await t.pglite.query(
      'SELECT supabase_user_id, google_sub, password_hash FROM academia_users WHERE lower(email) = $1',
      ['nueva@example.com'],
    );
    expect(rows[0].supabase_user_id).toBe('supabase-nueva');
    expect(rows[0].google_sub).toBe('google-nueva');
    expect(rows[0].password_hash).toBeNull();
  });

  it('no une por coincidencia de correo: exige la contraseña y conserva el mismo usuario', async () => {
    const ana = await t.seed({ email: 'ana@example.com', password: 'clave-ana-2026' });
    t.identities.set('token-ana', supabaseIdentity({
      id: 'supabase-ana',
      email: 'ana@example.com',
      name: 'Ana',
      googleSub: 'google-ana',
    }));

    const conflict = await t.call('/supabase', { accessToken: 'token-ana' });
    expect(conflict.status).toBe(409);
    expect(conflict.data.code).toBe('ACADEMIA_LINK_REQUIRED');
    expect(conflict.data.email).toBe('ana@example.com');

    let { rows } = await t.pglite.query('SELECT supabase_user_id FROM academia_users WHERE id = $1', [ana.id]);
    expect(rows[0].supabase_user_id).toBeNull();

    const wrong = await t.call('/supabase/link', {
      accessToken: 'token-ana',
      password: 'no-es-esta-clave',
    });
    expect(wrong.status).toBe(401);

    ({ rows } = await t.pglite.query('SELECT supabase_user_id FROM academia_users WHERE id = $1', [ana.id]));
    expect(rows[0].supabase_user_id).toBeNull();

    const ok = await t.call('/supabase/link', {
      accessToken: 'token-ana',
      password: 'clave-ana-2026',
    });
    expect(ok.status).toBe(200);
    expect(String(ok.data.user.id)).toBe(String(ana.id));
    expect(ok.data.user.email).toBe('ana@example.com');

    ({ rows } = await t.pglite.query('SELECT supabase_user_id, google_sub FROM academia_users WHERE id = $1', [ana.id]));
    expect(rows[0].supabase_user_id).toBe('supabase-ana');
    expect(rows[0].google_sub).toBe('google-ana');

    // Una segunda entrada ya entra por el id de Supabase, sin volver a pedir nada.
    const again = await t.call('/supabase', { accessToken: 'token-ana' });
    expect(again.status).toBe(200);
    expect(String(again.data.user.id)).toBe(String(ana.id));
  });

  it('reconoce al mismo Google ya vinculado sin pedir contraseña', async () => {
    const bea = await t.seed({
      email: 'bea@example.com',
      password: null,
      googleSub: 'google-bea',
    });
    t.identities.set('token-bea', supabaseIdentity({
      id: 'supabase-bea',
      email: 'bea@example.com',
      name: 'Bea',
      googleSub: 'google-bea',
    }));

    const res = await t.call('/supabase', { accessToken: 'token-bea' });
    expect(res.status).toBe(200);
    expect(String(res.data.user.id)).toBe(String(bea.id));

    const { rows } = await t.pglite.query('SELECT supabase_user_id FROM academia_users WHERE id = $1', [bea.id]);
    expect(rows[0].supabase_user_id).toBe('supabase-bea');
  });

  it('el acceso antiguo con Google no vincula por correo y ofrece la vinculación explícita', async () => {
    const carla = await t.seed({ email: 'carla@example.com', password: 'clave-carla-2026' });
    const credential = googleCredential({
      sub: 'google-carla',
      email: 'carla@example.com',
      name: 'Carla',
    });

    const conflict = await t.call('/google', {
      credential,
      mode: 'register',
      privacy_accepted: true,
    });
    expect(conflict.status).toBe(409);
    expect(conflict.data.code).toBe('ACADEMIA_LINK_REQUIRED');

    let { rows } = await t.pglite.query('SELECT google_sub FROM academia_users WHERE id = $1', [carla.id]);
    expect(rows[0].google_sub).toBeNull();

    const wrong = await t.call('/google/link', {
      credential,
      password: 'otra-clave',
    });
    expect(wrong.status).toBe(401);

    const ok = await t.call('/google/link', {
      credential,
      password: 'clave-carla-2026',
      privacy_accepted: true,
    });
    expect(ok.status).toBe(200);
    expect(String(ok.data.user.id)).toBe(String(carla.id));

    ({ rows } = await t.pglite.query('SELECT google_sub, auth_provider FROM academia_users WHERE id = $1', [carla.id]));
    expect(rows[0].google_sub).toBe('google-carla');
    expect(rows[0].auth_provider).toBe('email_google');

    const again = await t.call('/google', { credential, mode: 'login' });
    expect(again.status).toBe(200);
    expect(String(again.data.user.id)).toBe(String(carla.id));
  });

  it('registra una cuenta nueva con Google sin crear duplicados', async () => {
    const credential = googleCredential({
      sub: 'google-dani',
      email: 'dani@example.com',
      name: 'Dani',
    });

    const created = await t.call('/google', {
      credential,
      mode: 'register',
      privacy_accepted: true,
    });
    expect(created.status).toBe(201);
    expect(created.data.user.email).toBe('dani@example.com');

    const duplicated = await t.call('/google', {
      credential,
      mode: 'register',
      privacy_accepted: true,
    });
    expect(duplicated.status).toBe(200);
    expect(String(duplicated.data.user.id)).toBe(String(created.data.user.id));

    const { rows } = await t.pglite.query(
      'SELECT count(*)::int AS n FROM academia_users WHERE lower(email) = $1',
      ['dani@example.com'],
    );
    expect(rows[0].n).toBe(1);
  });

  it('no cambia el Google de una cuenta que ya está vinculada', async () => {
    const elena = await t.seed({
      email: 'elena@example.com',
      password: 'clave-elena-2026',
      googleSub: 'google-elena',
      supabaseId: 'supabase-elena',
    });

    t.identities.set('token-elena', supabaseIdentity({
      id: 'supabase-elena',
      email: 'elena@example.com',
      name: 'Elena',
      // La misma identidad de Supabase con otro Google no puede reemplazar
      // en silencio el vínculo que ya existía.
      googleSub: 'google-distinto',
    }));

    const res = await t.call('/supabase', { accessToken: 'token-elena' });
    expect(res.status).toBe(409);
    expect(res.data.code).toBe('GOOGLE_ALREADY_LINKED');

    const { rows } = await t.pglite.query('SELECT google_sub FROM academia_users WHERE id = $1', [elena.id]);
    expect(rows[0].google_sub).toBe('google-elena');
  });
});

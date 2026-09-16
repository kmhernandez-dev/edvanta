/**
 * Servidor local del aula para desarrollo, sin PostgreSQL instalado.
 *
 *   node api/scripts/aula-dev.js [--port 3000] [--reset]
 *
 * - Base de datos: PGlite persistente en api/.data/aula-dev/db
 * - Archivos:      api/.data/aula-dev/files
 * - Correos:       se guardan como HTML en api/.data/aula-dev/mails
 * - Administrador: admin@aula.local / Admin-aula-2026
 *
 * Vite ya envía /api a 127.0.0.1:3000, así que con `npm run dev` en la
 * raíz el aula queda disponible en http://localhost:5173/aula.
 */
import { PGlite } from '@electric-sql/pglite';
import express from 'express';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureBootstrapAdmins } from '../lib/aula/accounts.js';
import { fromPglite } from '../lib/aula/db.js';
import { cleanMigrationSql } from '../lib/sql-text.js';
import { hashPassword } from '../lib/aula/security.js';
import { createDiskStorage } from '../lib/aula/storage.js';
import { createAulaRouter, startAula } from '../routes/aula/index.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.join(here, '..');
const baseDir = path.join(apiDir, '.data', 'aula-dev');
const args = process.argv.slice(2);
const port = Number(args[args.indexOf('--port') + 1]) || 3000;

const ADMIN_EMAIL = 'admin@aula.local';
const ADMIN_PASSWORD = 'Admin-aula-2026';

if (args.includes('--reset')) {
  await rm(baseDir, { recursive: true, force: true });
  console.log('Datos locales del aula borrados.');
}
await mkdir(path.join(baseDir, 'mails'), { recursive: true });

const pglite = new PGlite(path.join(baseDir, 'db'));
const db = fromPglite(pglite);

// Migraciones del aula con su propio registro.
await pglite.exec('CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, run_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
const done = new Set((await pglite.query('SELECT name FROM _migrations')).rows.map((r) => r.name));
const migrationsDir = path.join(apiDir, 'migrations');
for (const file of (await readdir(migrationsDir)).filter((f) => /^\d+_aula_.*\.sql$/.test(f)).sort()) {
  if (done.has(file)) continue;
  await pglite.exec(cleanMigrationSql(await readFile(path.join(migrationsDir, file), 'utf8')));
  await pglite.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
  console.log(`Migración aplicada: ${file}`);
}

const storage = createDiskStorage(path.join(baseDir, 'files'));
let mailCount = 0;
const mailer = {
  async send({ to, subject, html }) {
    mailCount += 1;
    const file = path.join(baseDir, 'mails', `${Date.now()}-${mailCount}.html`);
    await writeFile(file, html);
    const link = /href="([^"]+#token=[^"]+)"/.exec(html)?.[1]?.replace(/&amp;/g, '&');
    console.log(`\n✉  Correo para ${to}: ${subject}\n   ${link || file}\n`);
    return true;
  },
};

await startAula({ db, storage, adminEmails: [ADMIN_EMAIL], log: (e) => console.log('[aula]', e.msg) });
// En local el administrador entra directo con una contraseña conocida.
await db.query(
  "UPDATE aula_users SET password_hash = $2, status = 'active' WHERE email = $1 AND password_hash IS NULL",
  [ADMIN_EMAIL, await hashPassword(ADMIN_PASSWORD)],
);
await ensureBootstrapAdmins(db, [ADMIN_EMAIL]);

const app = express();
app.use('/api/aula', createAulaRouter({
  db,
  storage,
  mailer,
  siteUrl: 'http://localhost:5173',
  secureCookies: false,
}));
app.use((_req, res) => res.status(404).json({ error: 'Solo el aula corre en este servidor local.' }));

app.listen(port, '127.0.0.1', () => {
  console.log(`\nAula local en http://127.0.0.1:${port}/api/aula`);
  console.log(`Administrador: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}\n`);
});

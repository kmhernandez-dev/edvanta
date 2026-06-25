/**
 * ============================================================
 *  lib/migrate.js — Corre las migraciones SQL al arrancar
 *
 *  Busca archivos en api/migrations/*.sql ordenados alfabéticamente
 *  y los ejecuta si no se han corrido antes.
 *
 *  Lleva registro en la tabla `_migrations`.
 *
 *  Importante: si una migración falla, el error se PROPAGA.
 *  El caller (server.js) lo captura y NO mata el proceso: el health
 *  endpoint reportará unhealthy y Coolify puede decidir qué hacer.
 * ============================================================
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from '../db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, msg, ns: 'migrate', ...extra }));

export async function runMigrations() {
  let files;
  try {
    files = readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();
  } catch (e) {
    log('warn', 'No se encontró carpeta migrations, saltando', { path: MIGRATIONS_DIR });
    return;
  }

  if (files.length === 0) {
    log('info', 'No hay migraciones para correr');
    return;
  }

  log('info', 'Asegurando tabla de control _migrations');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name        TEXT PRIMARY KEY,
      run_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const { rows: done } = await pool.query('SELECT name FROM _migrations');
  const doneSet = new Set(done.map(r => r.name));

  const pending = files.filter(f => !doneSet.has(f));
  if (pending.length === 0) {
    log('info', 'Migraciones ya aplicadas', { total: files.length });
    return;
  }

  log('info', 'Aplicando migraciones pendientes', {
    pending: pending.length,
    of_total: files.length,
    list: pending,
  });

  for (const file of pending) {
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    log('info', `Corriendo ${file}`);
    try {
      await pool.query('BEGIN');
      await pool.query(sql);
      await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      await pool.query('COMMIT');
      log('info', `OK ${file}`);
    } catch (e) {
      await pool.query('ROLLBACK');
      log('error', `ERROR en ${file}`, { error: e.message, code: e.code });
      throw e;
    }
  }

  log('info', 'Migraciones completas', { total: files.length });
}

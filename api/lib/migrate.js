/**
 * ============================================================
 *  lib/migrate.js — Corre las migraciones SQL al arrancar
 *  Busca archivos en api/migrations/*.sql ordenados
 *  alfabéticamente y los ejecuta si no se han corrido antes.
 *
 *  Lleva registro en la tabla `_migrations`.
 * ============================================================
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

export async function runMigrations() {
  let files;
  try {
    files = readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();
  } catch (e) {
    console.log('[migrate] No se encontró carpeta migrations, saltando.');
    return;
  }

  if (files.length === 0) {
    console.log('[migrate] No hay migraciones para correr.');
    return;
  }

  // Asegurar tabla de control.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name        TEXT PRIMARY KEY,
      run_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const { rows: done } = await pool.query('SELECT name FROM _migrations');
  const doneSet = new Set(done.map(r => r.name));

  for (const file of files) {
    if (doneSet.has(file)) continue;
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    console.log(`[migrate] Corriendo ${file}...`);
    try {
      await pool.query('BEGIN');
      await pool.query(sql);
      await pool.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      await pool.query('COMMIT');
      console.log(`[migrate] OK ${file}`);
    } catch (e) {
      await pool.query('ROLLBACK');
      console.error(`[migrate] ERROR en ${file}:`, e.message);
      throw e;
    }
  }

  console.log('[migrate] Migraciones completas.');
}

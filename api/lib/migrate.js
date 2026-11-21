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
import { cleanMigrationSql } from './sql-text.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

const log = (level, msg, extra = {}) =>
  console.log(JSON.stringify({ level, msg, ns: 'migrate', ...extra }));

/**
 * `conexion`: un cliente dedicado (pool.connect()). Las migraciones
 * DEBEN ir por una sola conexión: con pool.query, el BEGIN, la migración
 * y el COMMIT podían caer en conexiones distintas del pool, y entonces la
 * migración no quedaba dentro de su transacción. Sin conexión dada, se
 * toma una y se devuelve al terminar.
 */
export async function runMigrations(conexion = null) {
  if (!conexion) {
    const client = await pool.connect();
    try {
      return await runMigrations(client);
    } finally {
      client.release();
    }
  }
  const db = conexion;
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
  await db.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name        TEXT PRIMARY KEY,
      run_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const { rows: done } = await db.query('SELECT name FROM _migrations');
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
    const sql = cleanMigrationSql(readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'));
    log('info', `Corriendo ${file}`);
    try {
      await db.query('BEGIN');
      // Las migraciones de contenido (cursos sembrados) son largas: sin
      // límite de tiempo SOLO dentro de esta transacción (LOCAL).
      await db.query('SET LOCAL statement_timeout = 0');
      await db.query(sql);
      await db.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
      await db.query('COMMIT');
      log('info', `OK ${file}`);
    } catch (e) {
      await db.query('ROLLBACK').catch(() => {});
      log('error', `ERROR en ${file}`, { error: e.message, code: e.code });
      throw e;
    }
  }

  log('info', 'Migraciones completas', { total: files.length });
}

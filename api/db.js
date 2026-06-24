/**
 * ============================================================
 *  db.js — Pool de conexiones a PostgreSQL
 *  Usa la variable DATABASE_URL inyectada por Coolify.
 *
 *  Formato típico en Coolify:
 *    postgresql://postgres:password@host:5432/database
 *
 *  Si no hay DATABASE_URL, las queries fallan con error claro
 *  para que sea fácil detectar el problema en logs.
 * ============================================================
 */
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    '[db] DATABASE_URL no está configurada. Las rutas que consulten ' +
    'la base de datos van a fallar. Configúrala en Coolify → ' +
    'Environment variables de este servicio.'
  );
}

export const pool = new Pool({
  connectionString,
  // Coolify Postgres comparte host entre contenedores en la misma red.
  // Si en producción necesitas SSL, agrega: ssl: { rejectUnauthorized: false }
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('[db] Error inesperado en el pool:', err);
});

/**
 * Helper: ejecuta una query y devuelve las filas.
 */
export async function query(text, params) {
  return pool.query(text, params);
}

/**
 * ============================================================
 *  db.js — Pool de conexiones a PostgreSQL
 *  Usa DATABASE_URL inyectada por Coolify.
 *
 *  Formato típico:
 *    postgresql://user:password@host:5432/database
 *
 *  Si no hay DATABASE_URL, el pool se crea igual pero todas las
 *  queries fallarán con error claro. Las rutas que consultan DB
 *  devuelven 503 vía /api/health/db.
 * ============================================================
 */
import pg from 'pg';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!connectionString) {
  console.error(JSON.stringify({
    level: 'error',
    msg: 'DATABASE_URL no está configurada. Las rutas que consulten DB van a fallar.',
    hint: 'Configúrala en Coolify → Environment variables del servicio api.',
  }));
}

// Ocultar credenciales al loguear el connectionString.
function safeUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.password) u.password = '***';
    return u.toString();
  } catch {
    return '(invalid URL)';
  }
}

if (connectionString) {
  console.log(JSON.stringify({
    level: 'info',
    msg: 'Pool de PostgreSQL inicializado',
    url: safeUrl(connectionString),
  }));
}

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  // statement_timeout previene queries colgadas que llenen el pool.
  statement_timeout: 10_000,
});

pool.on('error', (err) => {
  // Errores async del pool (cliente pierde conexión, etc.).
  console.error(JSON.stringify({
    level: 'error',
    msg: 'Error en pool de PostgreSQL',
    error: err.message,
    code: err.code,
  }));
});

/**
 * Helper: ejecuta una query y devuelve las filas.
 * Loguea queries lentas (>2s) para diagnóstico.
 */
export async function query(text, params) {
  const t0 = Date.now();
  try {
    const result = await pool.query(text, params);
    const ms = Date.now() - t0;
    if (ms > 2000) {
      console.warn(JSON.stringify({
        level: 'warn',
        msg: 'Query lenta',
        ms,
        sql_preview: text.slice(0, 80),
      }));
    }
    return result;
  } catch (e) {
    console.error(JSON.stringify({
      level: 'error',
      msg: 'Query fallida',
      error: e.message,
      code: e.code,
      sql_preview: text.slice(0, 80),
    }));
    throw e;
  }
}

/**
 * Acceso a datos del aula.
 *
 * La lógica del aula recibe un objeto `db` con `query(text, params)` y
 * `tx(fn)`, y no sabe si detrás hay el pool de `pg` (producción) o PGlite
 * (pruebas). Ambos adaptadores devuelven BIGINT y NUMERIC como números,
 * cosa que `pg` no hace por defecto, y DATE como texto AAAA-MM-DD: una
 * fecha de calendario no tiene zona horaria, y convertirla a Date la corre
 * un día según el huso del servidor o del navegador. El ajuste solo aplica
 * a las consultas del aula para no alterar el resto de la API.
 */
import pg from 'pg';

const INT8 = 20;
const NUMERIC = 1700;
const DATE = 1082;

const toNumber = (value) => (value === null ? null : Number(value));
const asText = (value) => value;

const pgTypes = {
  getTypeParser(oid, format) {
    if (oid === INT8 || oid === NUMERIC) return toNumber;
    if (oid === DATE) return asText;
    return pg.types.getTypeParser(oid, format);
  },
};

const pgliteParsers = { [INT8]: toNumber, [NUMERIC]: toNumber, [DATE]: asText };

// Dentro de una transacción, `tx` reutiliza la misma conexión.
function scoped(queryFn) {
  const db = {
    query: queryFn,
    tx: (fn) => fn(db),
    inTransaction: true,
  };
  return db;
}

export function fromPgPool(pool) {
  const run = (client) => (text, params = []) => client.query({ text, values: params, types: pgTypes });
  return {
    query: run(pool),
    inTransaction: false,
    async tx(fn) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await fn(scoped(run(client)));
        await client.query('COMMIT');
        return result;
      } catch (err) {
        try { await client.query('ROLLBACK'); } catch { /* la conexión ya no sirve */ }
        throw err;
      } finally {
        client.release();
      }
    },
  };
}

export function fromPglite(pglite) {
  const run = (target) => (text, params = []) => target.query(text, params, { parsers: pgliteParsers });
  return {
    query: run(pglite),
    inTransaction: false,
    tx: (fn) => pglite.transaction((tx) => fn(scoped(run(tx)))),
  };
}

/** Primera fila o null. */
export async function one(db, text, params) {
  const { rows } = await db.query(text, params);
  return rows[0] || null;
}

/** Todas las filas. */
export async function many(db, text, params) {
  const { rows } = await db.query(text, params);
  return rows;
}

/**
 * Arma un WHERE con parámetros numerados. `param` devuelve el marcador
 * ($n) para poder usar el mismo valor en varias condiciones.
 */
export function whereBuilder(initial = []) {
  const params = [];
  const clauses = [...initial];
  return {
    params,
    param(value) {
      params.push(value);
      return `$${params.length}`;
    },
    and(clause) {
      clauses.push(clause);
    },
    get sql() {
      return clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    },
  };
}

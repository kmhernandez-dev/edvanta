/**
 * Los dos adaptadores de datos entregan los mismos tipos: `pg` (el driver
 * de producción, conectado a PGlite por un socket local) y PGlite (el de
 * las pruebas). Si divergen, algo que pasa en pruebas falla en producción.
 */
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';
import pg from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { fromPglite, fromPgPool } from '../lib/aula/db.js';

const SAMPLE = `SELECT 9007199254740::int8 AS big, 87.5::numeric AS score, DATE '2026-10-15' AS day,
  TIMESTAMPTZ '2026-10-15 00:00:00+00' AS at, NULL::date AS nothing, NULL::int8 AS no_count`;

describe('aula · adaptadores de datos', () => {
  let pglite;
  let server;
  let pool;

  beforeAll(async () => {
    pglite = new PGlite();
    server = new PGLiteSocketServer({ db: pglite, host: '127.0.0.1', port: 0 });
    await server.start();
    const [host, port] = server.getServerConn().split(':');
    pool = new pg.Pool({ host, port: Number(port), user: 'postgres', database: 'postgres', max: 1 });
    await pglite.exec('CREATE TABLE tx_probe (n int)');
  });

  afterAll(async () => {
    await pool?.end();
    await server?.stop();
    await pglite?.close();
  });

  it.each([
    ['pg', () => fromPgPool(pool)],
    ['PGlite', () => fromPglite(pglite)],
  ])('%s: números como números y fechas de calendario como texto', async (_name, make) => {
    const { rows: [row] } = await make().query(SAMPLE);
    expect(row.big).toBe(9007199254740);
    expect(row.score).toBe(87.5);
    expect(row.day).toBe('2026-10-15');
    expect(row.at).toBeInstanceOf(Date);
    expect(row.at.toISOString()).toBe('2026-10-15T00:00:00.000Z');
    expect(row.nothing).toBeNull();
    expect(row.no_count).toBeNull();
  });

  it('el ajuste de tipos no cambia las consultas del resto de la API', async () => {
    const { rows: [row] } = await pool.query("SELECT 5::int8 AS big, DATE '2026-10-15' AS day");
    expect(row.big).toBe('5');
    expect(row.day).toBeInstanceOf(Date);
  });

  it('pg: las transacciones confirman o deshacen todo', async () => {
    const db = fromPgPool(pool);
    await db.tx(async (tx) => {
      await tx.query('INSERT INTO tx_probe VALUES (1)');
      // Una transacción anidada reutiliza la conexión de la externa.
      await tx.tx((inner) => inner.query('INSERT INTO tx_probe VALUES (2)'));
    });
    await expect(db.tx(async (tx) => {
      await tx.query('INSERT INTO tx_probe VALUES (3)');
      throw new Error('falla a propósito');
    })).rejects.toThrow('falla a propósito');
    const { rows } = await db.query('SELECT n FROM tx_probe ORDER BY n');
    expect(rows.map((r) => r.n)).toEqual([1, 2]);
  });
});

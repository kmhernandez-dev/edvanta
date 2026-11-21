/**
 * ============================================================
 *  candado.js — Un solo proceso a la vez para las tareas únicas
 *
 *  Con 100.000 visitas al día la API corre en varios procesos
 *  (API_PROCESOS) o en varias réplicas. Hay trabajo que debe hacer
 *  UNO solo:
 *
 *   · las migraciones al arrancar (dos a la vez chocan o se duplican);
 *   · los correos programados del embudo (dos a la vez mandan doble);
 *   · la limpieza de subidas abandonadas.
 *
 *  Para eso se usa un candado consultivo de PostgreSQL
 *  (pg_advisory_lock): vive en la base, así que vale entre procesos,
 *  contenedores y servidores. Se toma con una conexión dedicada y se
 *  suelta en la misma; si el proceso muere, PostgreSQL lo suelta solo
 *  al cerrarse la conexión.
 * ============================================================
 */

/** Claves fijas: una por tarea. Números arbitrarios, solo deben ser distintos. */
export const CANDADOS = Object.freeze({
  ARRANQUE: 7_420_001,       // migraciones + direcciones + arranque del aula
  EMBUDO: 7_420_002,         // correos programados del embudo
  LIMPIEZA_SUBIDAS: 7_420_003,
});

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Corre `tarea(client)` con el candado tomado.
 *
 *  - esperar = false: si otro proceso lo tiene, NO corre y devuelve
 *    { corrio: false }. Es lo que quieren las tareas periódicas: si otro
 *    ya está mandando los correos de esta hora, este no hace nada.
 *  - esperar = true: reintenta hasta `maxEsperaMs` y luego corre. Es lo
 *    que quiere el arranque: el segundo proceso espera a que el primero
 *    termine las migraciones y después las encuentra ya hechas.
 *
 *  Se reintenta con pg_try_advisory_lock y no con pg_advisory_lock porque
 *  el pool tiene statement_timeout: una espera bloqueante larga se
 *  cancelaría a los 10 s.
 */
export async function conCandado(pool, clave, tarea, { esperar = false, maxEsperaMs = 10 * 60_000, cadaMs = 1000 } = {}) {
  const client = await pool.connect();
  let tomado = false;
  try {
    const limite = Date.now() + maxEsperaMs;
    for (;;) {
      const { rows } = await client.query('SELECT pg_try_advisory_lock($1) AS ok', [clave]);
      tomado = rows[0]?.ok === true;
      if (tomado || !esperar) break;
      if (Date.now() > limite) {
        throw new Error(`No se obtuvo el candado ${clave} en ${Math.round(maxEsperaMs / 1000)} s`);
      }
      await espera(cadaMs);
    }
    if (!tomado) return { corrio: false };
    const resultado = await tarea(client);
    return { corrio: true, resultado };
  } finally {
    if (tomado) {
      await client.query('SELECT pg_advisory_unlock($1)', [clave]).catch(() => {});
    }
    client.release();
  }
}

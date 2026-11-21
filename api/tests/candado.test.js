/**
 * Candado entre procesos (lib/candado.js) y reparto de topes (lib/procesos.js).
 *
 * Con varios procesos de la API, una tarea única (migraciones, correos
 * programados) debe correr en UNO solo. Aquí se simula PostgreSQL con un
 * registro de candados compartido entre «conexiones».
 */
import { describe, expect, it } from 'vitest';
import { conCandado } from '../lib/candado.js';
import { procesosDeLaApi, topePorProceso } from '../lib/procesos.js';

function poolFalso() {
  const dueños = new Map(); // clave → conexión que lo tiene
  let siguiente = 0;
  const liberadas = [];
  return {
    liberadas,
    async connect() {
      const yo = ++siguiente;
      return {
        async query(sql, [clave]) {
          if (sql.includes('pg_try_advisory_lock')) {
            if (!dueños.has(clave) || dueños.get(clave) === yo) { dueños.set(clave, yo); return { rows: [{ ok: true }] }; }
            return { rows: [{ ok: false }] };
          }
          if (sql.includes('pg_advisory_unlock')) { if (dueños.get(clave) === yo) dueños.delete(clave); return { rows: [{}] }; }
          throw new Error(`consulta inesperada: ${sql}`);
        },
        release() { liberadas.push(yo); },
      };
    },
  };
}

describe('conCandado', () => {
  it('si otro proceso tiene el candado, la tarea periódica no corre', async () => {
    const pool = poolFalso();
    let corridas = 0;
    let soltar;
    const primera = conCandado(pool, 1, () => new Promise((r) => { corridas += 1; soltar = r; }));
    await new Promise((r) => setTimeout(r, 5));
    const segunda = await conCandado(pool, 1, async () => { corridas += 1; });
    expect(segunda).toEqual({ corrio: false });
    soltar('listo');
    expect(await primera).toEqual({ corrio: true, resultado: 'listo' });
    expect(corridas).toBe(1);
    expect(pool.liberadas).toHaveLength(2); // las dos conexiones vuelven al pool
  });

  it('el arranque espera su turno y luego corre', async () => {
    const pool = poolFalso();
    const orden = [];
    let soltar;
    const primera = conCandado(pool, 7, () => new Promise((r) => { orden.push('primera'); soltar = r; }), { esperar: true });
    await new Promise((r) => setTimeout(r, 5));
    const segunda = conCandado(pool, 7, async () => { orden.push('segunda'); }, { esperar: true, cadaMs: 5 });
    await new Promise((r) => setTimeout(r, 20));
    expect(orden).toEqual(['primera']);
    soltar();
    await primera;
    await segunda;
    expect(orden).toEqual(['primera', 'segunda']);
  });

  it('suelta el candado aunque la tarea falle', async () => {
    const pool = poolFalso();
    await expect(conCandado(pool, 3, async () => { throw new Error('falló'); })).rejects.toThrow('falló');
    expect(await conCandado(pool, 3, async () => 'otra vez')).toEqual({ corrio: true, resultado: 'otra vez' });
  });
});

describe('procesos y topes', () => {
  it('lee API_PROCESOS con límites sensatos', () => {
    expect(procesosDeLaApi(undefined)).toBe(1);
    expect(procesosDeLaApi('4')).toBe(4);
    expect(procesosDeLaApi('0')).toBe(1);
    expect(procesosDeLaApi('99')).toBe(16);
    expect(procesosDeLaApi('nada')).toBe(1);
    expect(procesosDeLaApi('auto')).toBeGreaterThanOrEqual(1);
  });

  it('reparte un tope diario entre procesos sin pasarse del total', () => {
    expect(topePorProceso(400, 1)).toBe(400);
    expect(topePorProceso(400, 4)).toBe(100);
    expect(topePorProceso(400, 3)).toBe(133); // 3 × 133 = 399 ≤ 400
    expect(topePorProceso(2, 4)).toBe(1);
    expect(topePorProceso(0, 4)).toBe(0);
  });
});

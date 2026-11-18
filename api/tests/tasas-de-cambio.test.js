/** Equivalente en moneda local: solo con tasas reales, nunca inventadas. */
import { describe, expect, it } from 'vitest';
import { equivalenteLocal, obtenerTasas } from '../lib/tasas-de-cambio.js';

const datos = { tasas: { MXN: 0.0045, USD: 0.00025, CLP: 0.24 }, fecha: '2026-11-18T00:02:31.000Z' };

describe('equivalenteLocal', () => {
  it('convierte con la tasa del día y redondea según la moneda', () => {
    expect(equivalenteLocal(65000, 'MX', datos)).toEqual({ moneda: 'MXN', valor: 293, fecha: datos.fecha });
    expect(equivalenteLocal(65000, 'EC', datos)).toMatchObject({ moneda: 'USD', valor: 16.25 });
    expect(equivalenteLocal(65000, 'CL', datos)).toMatchObject({ moneda: 'CLP', valor: 15600 });
  });

  it('sin tasa, sin país conocido o sin datos no hay equivalente', () => {
    expect(equivalenteLocal(65000, 'PE', datos)).toBeNull();
    expect(equivalenteLocal(65000, 'ZZ', datos)).toBeNull();
    expect(equivalenteLocal(65000, 'MX', null)).toBeNull();
  });

  it('si la consulta falla no inventa tasas', async () => {
    const r = await obtenerTasas({ fetchFn: async () => { throw new Error('sin red'); }, ahora: 1 });
    expect(r).toBeNull();
  });
});

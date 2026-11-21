/**
 * Equivalente aproximado del precio en la moneda del país de quien mira.
 *
 * Mercado Pago cobra siempre en pesos colombianos; esto es solo una
 * referencia («≈ MXN 290») para que la persona entienda el monto. Las
 * tasas vienen de open.er-api.com (ExchangeRate-API, base COP, se
 * actualiza una vez al día) y se guardan 12 horas en memoria. Si la
 * consulta falla, no se muestra equivalente: nunca una tasa inventada.
 */

/** Moneda local de cada país donde Edvanta tiene público. */
export const MONEDA_DEL_PAIS = {
  AR: 'ARS', BO: 'BOB', BR: 'BRL', CL: 'CLP', CR: 'CRC', CU: 'CUP', DO: 'DOP', EC: 'USD',
  SV: 'USD', ES: 'EUR', US: 'USD', GT: 'GTQ', HN: 'HNL', MX: 'MXN', NI: 'NIO', PA: 'USD',
  PY: 'PYG', PE: 'PEN', PR: 'USD', UY: 'UYU', VE: 'USD', CA: 'CAD', GB: 'GBP',
  FR: 'EUR', IT: 'EUR', DE: 'EUR', PT: 'EUR', NL: 'EUR', BE: 'EUR', IE: 'EUR', AT: 'EUR',
};

const DOCE_HORAS = 12 * 60 * 60 * 1000;
let cache = null; // { tasas, fecha, hasta }

export async function obtenerTasas({ fetchFn = globalThis.fetch, ahora = Date.now() } = {}) {
  if (cache && cache.hasta > ahora) return cache;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetchFn('https://open.er-api.com/v6/latest/COP', { signal: ctrl.signal });
    clearTimeout(t);
    const d = await res.json();
    if (d?.result !== 'success' || !d.rates) return cache;
    cache = { tasas: d.rates, fecha: new Date(d.time_last_update_unix * 1000).toISOString(), hasta: ahora + DOCE_HORAS };
    return cache;
  } catch {
    return cache;
  }
}

/** Redondeo legible: sin decimales salvo en monedas fuertes. */
function redondear(valor, moneda) {
  if (['USD', 'EUR', 'GBP', 'CAD'].includes(moneda)) return Math.round(valor * 100) / 100;
  if (valor >= 1000) return Math.round(valor / 10) * 10;
  return Math.round(valor);
}

/** { moneda, valor, fecha } o null si no aplica (Colombia, país sin moneda o sin tasas). */
export function equivalenteLocal(precioCop, pais, datos) {
  const moneda = pais ? MONEDA_DEL_PAIS[pais] : null;
  const tasa = moneda && datos?.tasas?.[moneda];
  if (!moneda || !(tasa > 0) || !(precioCop > 0)) return null;
  return { moneda, valor: redondear(precioCop * tasa, moneda), fecha: datos.fecha };
}

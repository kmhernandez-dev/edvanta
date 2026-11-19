/**
 * metricas.mjs — Ventas reales desde el tablero del sitio
 *
 * GET https://edvanta.co/api/admin/agente/tablero?dias=N con la cabecera
 * x-admin-token. El token se lee de EDVANTA_ADMIN_TOKEN (o ADMIN_TOKEN):
 * nunca se escribe en archivos ni en el reporte.
 */
import { SITIO } from './rastreo.mjs';

export async function leerTablero({ dias = 7, sitio = SITIO, token = process.env.EDVANTA_ADMIN_TOKEN || process.env.ADMIN_TOKEN } = {}) {
  if (!token) {
    return { ok: false, motivo: 'Falta EDVANTA_ADMIN_TOKEN: sin él, el agente no ve las ventas reales.' };
  }
  try {
    const r = await fetch(`${sitio}/api/admin/agente/tablero?dias=${dias}`, {
      headers: { 'x-admin-token': token, accept: 'application/json' },
      signal: AbortSignal.timeout(30000),
    });
    if (r.status === 404) return { ok: false, motivo: 'El tablero aún no está desplegado (404).' };
    if (r.status === 403) return { ok: false, motivo: 'El token no coincide con ADMIN_TOKEN de producción (403).' };
    if (!r.ok) return { ok: false, motivo: `El tablero respondió ${r.status}.` };
    return { ok: true, datos: await r.json() };
  } catch (err) {
    return { ok: false, motivo: `No se pudo leer el tablero: ${err.message}` };
  }
}

/** Tasas reales del tablero, solo si hay volumen suficiente para creerlas. */
export function tasasReales(tablero, { minimo = 30 } = {}) {
  const c = tablero?.certificados;
  if (!c) return {};
  const out = {};
  if ((c.totales?.inscripcionesPropias || 0) >= minimo && c.conversion?.inscripcionAPago != null) {
    out.inscripcionAPago = c.conversion.inscripcionAPago / 100;
  }
  // Hotmart: clics de compra registrados frente a ventas del webhook.
  const porGuia = tablero?.guias?.hotmart?.porGuia || [];
  const clics = porGuia.reduce((s, g) => s + (g.clics || 0), 0);
  const ventas = porGuia.reduce((s, g) => s + (g.ventas || 0), 0);
  if (tablero?.guias?.hotmartConVentas && clics >= minimo * 3 && ventas > 0) {
    out.clicACompra = ventas / clics;
  }
  return out;
}

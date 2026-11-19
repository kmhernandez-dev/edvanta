/**
 * ============================================================
 *  ventas.js — Las tres ventas de Edvanta, medidas en un lugar
 *
 *   · Certificados  aula_certificate_payments (Mercado Pago o manual).
 *   · Guías         ventas_guias, que llena el webhook de Hotmart.
 *   · Servicios     ventas_servicios, que se registran en Assist.
 *
 *  Y la meta diaria de cada una (ventas_metas), contra la que se mide
 *  el día en hora de Colombia.
 * ============================================================
 */
import { many, one } from './aula/db.js';

/* ── Hotmart (webhook 2.0.0) ─────────────────────────────────── */

/** Evento de Hotmart → estado de la venta. Lo demás se ignora. */
export const ESTADO_DE_EVENTO = Object.freeze({
  PURCHASE_APPROVED: 'aprobada',
  PURCHASE_COMPLETE: 'aprobada',
  PURCHASE_BILLET_PRINTED: 'pendiente',
  PURCHASE_DELAYED: 'pendiente',
  PURCHASE_PROTEST: 'pendiente',
  PURCHASE_CANCELED: 'cancelada',
  PURCHASE_EXPIRED: 'cancelada',
  PURCHASE_REFUNDED: 'reembolsada',
  PURCHASE_CHARGEBACK: 'contracargo',
  PURCHASE_OUT_OF_SHOPPING_CART: 'carrito_abandonado',
});

const texto = (v, max = 300) => {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s ? s.slice(0, max) : null;
};
const correoDe = (v) => {
  const s = texto(v, 254)?.toLowerCase();
  return s && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : null;
};
/** Hotmart manda fechas en milisegundos (número) o ISO. */
const fechaDe = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const d = typeof v === 'number' || /^\d+$/.test(String(v)) ? new Date(Number(v)) : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};
const numero = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * Lee el cuerpo del webhook 2.0.0 de Hotmart. Devuelve null si no es un
 * evento de compra que nos interese (o si no trae lo mínimo).
 */
export function leerEventoHotmart(body) {
  const evento = texto(body?.event, 60);
  const estado = evento && ESTADO_DE_EVENTO[evento];
  if (!estado) return null;
  const d = body.data || {};
  const compra = d.purchase || {};
  const comprador = d.buyer || {};
  const carrito = estado === 'carrito_abandonado';
  const transaccion = carrito
    ? (texto(body.id, 120) ? `carrito:${texto(body.id, 120)}` : null)
    : texto(compra.transaction, 120);
  if (!transaccion) return null;
  const precio = compra.price || compra.full_price || {};
  return {
    transaccion,
    evento,
    estado,
    productoId: texto(d.product?.id ?? d.product?.ucode, 80),
    producto: texto(d.product?.name, 200),
    oferta: texto(compra.offer?.code ?? d.offer?.code, 80),
    correo: correoDe(comprador.email),
    nombre: texto(comprador.name, 160),
    telefono: texto(comprador.checkout_phone ?? comprador.phone, 40),
    pais: texto(compra.checkout_country?.iso ?? d.checkout_country?.iso, 4),
    valor: carrito ? null : numero(precio.value),
    moneda: carrito ? null : texto(precio.currency_value, 8),
    src: texto(compra.origin?.src, 120),
    sck: texto(compra.origin?.sck ?? compra.sckPaymentLink, 120),
    compradaEl: fechaDe(compra.order_date ?? body.creation_date),
    aprobadaEl: estado === 'aprobada' ? (fechaDe(compra.approved_date) || fechaDe(body.creation_date) || new Date()) : null,
  };
}

/**
 * Guarda o actualiza la venta. Una transacción aprobada que luego se
 * reembolsa queda «reembolsada» (no cuenta) para siempre; un aviso viejo
 * que llega tarde (p. ej. «pendiente» después de «aprobada», o una
 * aprobación reintentada después del reembolso) no la cambia.
 */
export async function registrarVentaHotmart(db, e, payload = null) {
  return one(
    db,
    `INSERT INTO ventas_guias
       (transaccion, evento, estado, producto_id, producto, oferta, comprador_correo, comprador_nombre,
        telefono, pais, valor, moneda, origen_src, origen_sck, comprada_el, aprobada_el, payload)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
     ON CONFLICT (transaccion) DO UPDATE SET
       evento = EXCLUDED.evento,
       estado = CASE
         -- Reembolso y contracargo son finales: un reintento viejo no revive la venta.
         WHEN ventas_guias.estado IN ('reembolsada', 'contracargo') THEN ventas_guias.estado
         WHEN ventas_guias.estado = 'aprobada' AND EXCLUDED.estado IN ('pendiente', 'carrito_abandonado') THEN ventas_guias.estado
         ELSE EXCLUDED.estado END,
       valor = COALESCE(EXCLUDED.valor, ventas_guias.valor),
       moneda = COALESCE(EXCLUDED.moneda, ventas_guias.moneda),
       origen_src = COALESCE(ventas_guias.origen_src, EXCLUDED.origen_src),
       origen_sck = COALESCE(ventas_guias.origen_sck, EXCLUDED.origen_sck),
       aprobada_el = COALESCE(ventas_guias.aprobada_el, EXCLUDED.aprobada_el),
       payload = EXCLUDED.payload,
       updated_at = NOW()
     RETURNING id, estado`,
    [e.transaccion, e.evento, e.estado, e.productoId, e.producto, e.oferta, e.correo, e.nombre,
      e.telefono, e.pais, e.valor, e.moneda, e.src, e.sck, e.compradaEl, e.aprobadaEl,
      payload === null ? null : JSON.stringify(payload)],
  );
}

/* ── Servicios ───────────────────────────────────────────────── */

export const SERVICIOS_SUGERIDOS = Object.freeze([
  'Asesoría farmacéutica',
  'Seguimiento farmacoterapéutico',
  'Paquete institucional',
  'Curso en vivo',
  'Capacitación a la medida',
]);

export async function registrarVentaServicio(db, { correo, nombre = null, servicio, valor, moneda = 'COP', nota = null, vendidaEl = null, actor = null }) {
  return one(
    db,
    `INSERT INTO ventas_servicios (correo, nombre, servicio, valor, moneda, nota, vendida_el, registrada_por)
     VALUES (lower(btrim($1)), $2, btrim($3), $4, $5, $6, COALESCE($7, NOW()), $8)
     RETURNING id, correo, servicio, valor, moneda, nota, vendida_el`,
    [correo, nombre, servicio, valor, moneda, nota, vendidaEl, actor?.id ?? null],
  );
}

export async function anularVentaServicio(db, id, now = new Date()) {
  return one(
    db,
    'UPDATE ventas_servicios SET anulada_el = $2 WHERE id = $1 AND anulada_el IS NULL RETURNING id, correo, servicio',
    [id, now],
  );
}

/* ── Metas ───────────────────────────────────────────────────── */

export async function metasDiarias(db) {
  const filas = await many(db, 'SELECT clave, meta_diaria FROM ventas_metas');
  const metas = { certificados: 100, guias: 100, servicios: 100 };
  for (const f of filas) metas[f.clave] = f.meta_diaria;
  return metas;
}

export async function guardarMetas(db, metas, actor = null) {
  for (const clave of ['certificados', 'guias', 'servicios']) {
    if (metas[clave] === undefined) continue;
    await db.query(
      `INSERT INTO ventas_metas (clave, meta_diaria, updated_by) VALUES ($1, $2, $3)
       ON CONFLICT (clave) DO UPDATE SET meta_diaria = EXCLUDED.meta_diaria, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
      [clave, metas[clave], actor?.id ?? null],
    );
  }
  return metasDiarias(db);
}

/* ── El día de hoy (Colombia) ────────────────────────────────── */

/** Inicio del día de `now` en Bogotá (UTC−5, sin horario de verano). */
export function inicioDelDiaBogota(now = new Date()) {
  const ymd = new Date(now.getTime() - 5 * 3600e3).toISOString().slice(0, 10);
  return new Date(`${ymd}T00:00:00-05:00`);
}

/**
 * Lo vendido hoy contra la meta, y el ritmo: cuánto se esperaría a esta
 * hora si las ventas se repartieran entre las 6:00 y las 24:00.
 */
export async function ventasDeHoy(db, { now = new Date() } = {}) {
  const desde = inicioDelDiaBogota(now);
  const r = await one(
    db,
    `SELECT
       (SELECT count(*)::int FROM aula_certificate_payments WHERE status = 'aprobado' AND approved_at >= $1 AND approved_at <= $2) AS certificados,
       (SELECT COALESCE(sum(amount), 0)::float FROM aula_certificate_payments WHERE status = 'aprobado' AND currency_id = 'COP' AND approved_at >= $1 AND approved_at <= $2) AS certificados_cop,
       (SELECT count(*)::int FROM ventas_guias WHERE estado = 'aprobada' AND aprobada_el >= $1 AND aprobada_el <= $2) AS guias,
       (SELECT COALESCE(sum(valor), 0)::float FROM ventas_guias WHERE estado = 'aprobada' AND moneda = 'COP' AND aprobada_el >= $1 AND aprobada_el <= $2) AS guias_cop,
       (SELECT count(*)::int FROM ventas_servicios WHERE anulada_el IS NULL AND vendida_el >= $1 AND vendida_el <= $2) AS servicios,
       (SELECT COALESCE(sum(valor), 0)::float FROM ventas_servicios WHERE anulada_el IS NULL AND moneda = 'COP' AND vendida_el >= $1 AND vendida_el <= $2) AS servicios_cop`,
    [desde, now],
  );
  const metas = await metasDiarias(db);
  const horasActivas = Math.min(18, Math.max(0, (now - desde) / 3600e3 - 6));
  const fraccion = horasActivas / 18;
  const linea = (clave) => ({
    vendidas: r[clave],
    meta: metas[clave],
    cop: r[`${clave}_cop`],
    pct: metas[clave] > 0 ? Math.round((r[clave] / metas[clave]) * 100) : null,
    esperadoAEstaHora: Math.round(metas[clave] * fraccion),
  });
  return {
    desde: desde.toISOString(),
    certificados: linea('certificados'),
    guias: linea('guias'),
    servicios: linea('servicios'),
    ingresosCop: r.certificados_cop + r.guias_cop + r.servicios_cop,
  };
}

/**
 * ============================================================
 *  routes/hotmart-webhook.js — Ventas de guías y ebooks en Hotmart
 *
 *  POST /api/hotmart-webhook
 *
 *  Hotmart avisa aquí cada compra (Webhook 2.0). Cada venta aprobada
 *  queda en `lead_events` como `hotmart_purchase`, una sola vez por
 *  transacción. Así el tablero del Agente de Crecimiento
 *  (lib/agente-tablero.js) puede contar las guías vendidas al día.
 *  Sin esto, la meta de 100 guías diarias no se puede medir: las ventas
 *  de Hotmart solo existían dentro de Hotmart.
 *
 *  Seguridad: Hotmart manda el «hottok» de la cuenta en la cabecera
 *  `X-HOTMART-HOTTOK` (versiones viejas: en el cuerpo, `hottok`). Se
 *  compara en tiempo constante con HOTMART_HOTTOK. Sin esa variable el
 *  endpoint responde 503 y no guarda nada.
 *
 *  Configuración (la hace la dueña en Hotmart):
 *    Herramientas › Webhook (API y notificaciones) › Nueva configuración
 *    URL: https://edvanta.co/api/hotmart-webhook · versión 2.0.0
 *    Eventos: Compra aprobada y Compra completa.
 *    Copiar el hottok a HOTMART_HOTTOK en Coolify (servicio api).
 * ============================================================
 */
import { timingSafeEqual } from 'node:crypto';

/** Eventos que cuentan como venta. Los demás se aceptan y se ignoran. */
export const EVENTOS_DE_VENTA = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']);

const recorta = (v, max) => (v == null ? '' : String(v).trim().slice(0, max));
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function mismoSecreto(recibido, esperado) {
  const a = Buffer.from(String(recibido || ''));
  const b = Buffer.from(String(esperado || ''));
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

/** Botones de compra de /guia/… (src/pages/GuiaVenta.jsx, `conOrigen`). */
const ORIGENES = ['barra-movil', 'oferta', 'hero'];

/**
 * La guía de Edvanta que originó la venta, desde el `src` que la página
 * agrega al enlace de pago: `edv-<slug>-<origen>`, recortado a 60. Si vino
 * recortado o de otro sitio, no se adivina: null.
 */
export function guiaDesdeSrc(src) {
  const s = String(src || '').trim().toLowerCase();
  if (!s.startsWith('edv-') || s.length >= 60) return null;
  const resto = s.slice(4);
  const origen = ORIGENES.find((o) => resto.endsWith(`-${o}`));
  const slug = origen ? resto.slice(0, -(origen.length + 1)) : '';
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null;
}

/** Datos de la venta, normalizados, desde el cuerpo de Hotmart. */
export function ventaDeHotmart(body = {}) {
  const data = body?.data || {};
  const compra = data.purchase || {};
  const producto = data.product || {};
  const correo = recorta(data.buyer?.email, 255).toLowerCase();
  const fecha = Number(compra.approved_date || body.creation_date);
  return {
    evento: recorta(body.event, 60).toUpperCase(),
    transaccion: recorta(compra.transaction, 80),
    correo: CORREO.test(correo) ? correo : '',
    productoId: recorta(producto.id ?? producto.ucode, 120),
    producto: recorta(producto.name, 160),
    precio: Number.isFinite(Number(compra.price?.value)) ? Number(compra.price.value) : null,
    moneda: recorta(compra.price?.currency_value, 10).toUpperCase() || null,
    oferta: recorta(compra.offer?.code, 60) || null,
    sck: recorta(compra.origin?.sck, 120) || null,
    src: recorta(compra.origin?.src, 120) || null,
    guia: guiaDesdeSrc(compra.origin?.src),
    aprobadaEl: Number.isFinite(fecha) && fecha > 0 ? new Date(fecha).toISOString() : null,
  };
}

/**
 * @param {{db: {query: Function}, hottok: () => string|undefined}} deps
 */
export function crearWebhookHotmart({ db, hottok }) {
  return async function webhookHotmart(req, res) {
    const esperado = typeof hottok === 'function' ? hottok() : hottok;
    if (!esperado) return res.status(503).json({ ok: false, error: 'webhook_no_configurado' });

    const recibido = req.headers['x-hotmart-hottok'] || req.body?.hottok;
    if (!mismoSecreto(recibido, esperado)) return res.status(401).json({ ok: false, error: 'hottok_invalido' });

    const venta = ventaDeHotmart(req.body);
    if (!EVENTOS_DE_VENTA.has(venta.evento)) return res.status(200).json({ ok: true, ignorado: venta.evento || 'sin_evento' });
    if (!venta.transaccion) return res.status(400).json({ ok: false, error: 'sin_transaccion' });

    try {
      const { rows } = await db.query(
        `INSERT INTO lead_events (email, event_type, resource_slug, resource_name, product_id, metadata)
         SELECT $1, 'hotmart_purchase', $6, $2, $3, $4::jsonb
          WHERE NOT EXISTS (
            SELECT 1 FROM lead_events
             WHERE event_type = 'hotmart_purchase' AND metadata->>'transaccion' = $5)
         RETURNING id`,
        [
          venta.correo,
          venta.producto || null,
          venta.productoId || null,
          JSON.stringify({
            source: 'hotmart_webhook',
            transaccion: venta.transaccion,
            evento: venta.evento,
            precio: venta.precio,
            moneda: venta.moneda,
            oferta: venta.oferta,
            sck: venta.sck,
            src: venta.src,
            aprobadaEl: venta.aprobadaEl,
          }),
          venta.transaccion,
          venta.guia,
        ],
      );
      return res.status(200).json({ ok: true, registrada: rows.length > 0 });
    } catch (err) {
      console.error(JSON.stringify({ level: 'error', msg: 'hotmart webhook', error: err.message }));
      // 500 para que Hotmart reintente.
      return res.status(500).json({ ok: false, error: 'no_se_pudo_registrar' });
    }
  };
}

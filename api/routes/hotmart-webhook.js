/**
 * ============================================================
 *  routes/hotmart-webhook.js — POST /api/hotmart/webhook
 *
 *  Hotmart avisa aquí cada compra, reembolso y carrito abandonado de
 *  las guías (webhook versión 2.0.0). Así las ventas de guías cuentan
 *  en Edvanta Assist junto a los certificados y los servicios, con el
 *  «src» del enlace: qué página y qué botón vendió.
 *
 *  Seguridad: Hotmart manda el «hottok» de la cuenta en la cabecera
 *  X-HOTMART-HOTTOK. Se compara con HOTMART_HOTTOK (variable de entorno
 *  en Coolify). Sin la variable, el webhook responde 503 y no guarda nada.
 *
 *  Configurar en Hotmart: Herramientas → Webhook (API y notificaciones)
 *  → URL https://edvanta.co/api/hotmart/webhook, versión 2.0.0, eventos
 *  de compra y «Abandono de carrito».
 * ============================================================
 */
import { timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import { leerEventoHotmart, registrarVentaHotmart } from '../lib/ventas.js';

function mismoToken(a, b) {
  const x = Buffer.from(String(a || ''));
  const y = Buffer.from(String(b || ''));
  return x.length > 0 && x.length === y.length && timingSafeEqual(x, y);
}

export function crearWebhookHotmart({ db, hottok = () => process.env.HOTMART_HOTTOK, log = console } = {}) {
  const router = Router();

  router.post('/', async (req, res) => {
    const esperado = typeof hottok === 'function' ? hottok() : hottok;
    if (!esperado) {
      log.error(JSON.stringify({ level: 'error', msg: 'Webhook de Hotmart sin HOTMART_HOTTOK configurado' }));
      return res.status(503).json({ ok: false, error: 'webhook_no_configurado' });
    }
    const recibido = req.headers['x-hotmart-hottok'] || req.body?.hottok;
    if (!mismoToken(recibido, esperado)) return res.status(401).json({ ok: false, error: 'hottok_invalido' });

    const evento = leerEventoHotmart(req.body);
    // Un evento que no es de compra (suscripciones, cambios de cuenta…)
    // se acepta para que Hotmart no lo reintente, pero no se guarda.
    if (!evento) return res.json({ ok: true, guardado: false });
    try {
      // El cuerpo se guarda sin el hottok.
      const { hottok: _omitido, ...payload } = req.body || {};
      const fila = await registrarVentaHotmart(db, evento, payload);
      log.log(JSON.stringify({ level: 'info', msg: 'Venta de Hotmart', evento: evento.evento, estado: fila.estado, producto: evento.producto, src: evento.src }));
      return res.json({ ok: true, guardado: true, estado: fila.estado });
    } catch (e) {
      log.error(JSON.stringify({ level: 'error', msg: 'No se guardó la venta de Hotmart', error: e.message }));
      // 500: Hotmart reintenta más tarde.
      return res.status(500).json({ ok: false, error: 'error_interno' });
    }
  });

  return router;
}

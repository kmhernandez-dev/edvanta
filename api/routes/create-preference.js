/**
 * ============================================================
 *  POST /api/create-preference
 *
 *  Crea una preferencia de Mercado Pago. SEGURIDAD: los precios
 *  SIEMPRE se leen del catálogo server-side (lib/catalog.js).
 *  El precio que envíe el navegador es IGNORADO. Si un id no
 *  existe en el catálogo, la preferencia se rechaza.
 * ============================================================
 */
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { randomUUID } from 'node:crypto';
import { query } from '../db.js';
import { getServerProduct } from '../lib/catalog.js';

const DOWNLOADS_PLACEHOLDER = 'PEGA_AQUI_EL_LINK';

const DOWNLOADS = {
  'atencion-farmaceutica':   { name: 'Pack Atención Farmacéutica Pro',                 url: DOWNLOADS_PLACEHOLDER },
  'calidad-farmaceutica':    { name: 'Pack Calidad Farmacéutica 360',                  url: DOWNLOADS_PLACEHOLDER },
  'calidad-auditoria':       { name: 'Pack Calidad, Auditoría y Mejora Continua Pro',  url: DOWNLOADS_PLACEHOLDER },
  'calidad-clinica':         { name: 'Pack Calidad Clínica y Seguridad del Paciente',  url: DOWNLOADS_PLACEHOLDER },
  'indicadores-dashboards':  { name: 'Pack Indicadores, Dashboards y Gestión Pro',     url: DOWNLOADS_PLACEHOLDER },
  'empleabilidad-farmasalud':{ name: 'Kit Empleabilidad FarmaSalud',                   url: DOWNLOADS_PLACEHOLDER },
  'fst-coleccion-sana':        { name: 'Colección SANA TU TIROIDES desde 0',           url: DOWNLOADS_PLACEHOLDER },
  'fst-comer-hipotiroidismo':  { name: 'Aprende a Comer con Hipotiroidismo',           url: DOWNLOADS_PLACEHOLDER },
  'fst-dieta-antiinflamatoria':{ name: 'Dieta Antiinflamatoria y Sana tu Tiroides',    url: DOWNLOADS_PLACEHOLDER },
  'fst-comer-hipertiroidismo': { name: 'Aprende a Comer para el Hipertiroidismo',      url: DOWNLOADS_PLACEHOLDER },
  'fst-guia-ayunos':           { name: 'Guía completa de Ayunos',                      url: DOWNLOADS_PLACEHOLDER },
  'fst-yodoterapia':           { name: 'Guía práctica para la Yodoterapia I-131',      url: DOWNLOADS_PLACEHOLDER },
  'fst-diario-hipotiroidismo': { name: 'Diario de las Emociones para el Hipotiroidismo', url: DOWNLOADS_PLACEHOLDER },
  'fst-diario-hipertiroidismo':{ name: 'Diario de Manejo de Emociones en Hipertiroidismo', url: DOWNLOADS_PLACEHOLDER },
  'fst-producto-pendiente':    { name: 'Nuevo recurso para tu tiroides',               url: DOWNLOADS_PLACEHOLDER },
};

export function getDownload(id) {
  return DOWNLOADS[id] || null;
}

export async function createPreferenceRoute(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(503).json({
      error: 'Mercado Pago no está configurado. Falta MP_ACCESS_TOKEN.',
    });
  }

  const requested = Array.isArray(req.body?.items) ? req.body.items : [];
  if (requested.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  // Resolver cada item contra el catálogo server-side.
  const items = [];
  const productIds = [];
  for (const raw of requested) {
    const id = raw?.id != null ? String(raw.id) : null;
    const serverProduct = getServerProduct(id);
    if (!serverProduct) {
      return res.status(400).json({
        error: `Producto no disponible: ${id || '(sin id)'}`,
      });
    }
    const qty = Math.max(1, parseInt(raw?.qty, 10) || 1);
    items.push({
      id: serverProduct.id,
      title: serverProduct.name,
      quantity: qty,
      unit_price: serverProduct.price,
      currency_id: serverProduct.currency_id,
    });
    for (let i = 0; i < qty; i++) productIds.push(serverProduct.id);
  }

  // URL del sitio. Coolify la inyecta automáticamente; fallback al dominio.
  const siteUrl = process.env.SITE_URL || 'https://edvanta.co';
  // En la arquitectura actual, nginx publica /api/* en el mismo dominio.
  // Si API_URL no está definido, usamos SITE_URL para que el webhook apunte a:
  // https://edvanta.co/api/mp-webhook
  const apiUrl = process.env.API_URL || siteUrl;

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);
    const externalReference = randomUUID();
    const total = items.reduce((s, i) => s + i.unit_price * i.quantity, 0);
    const currencyId = items[0]?.currency_id || 'COP';

    const result = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${siteUrl}/?pago=exitoso`,
          failure: `${siteUrl}/?pago=fallido`,
          pending: `${siteUrl}/?pago=pendiente`,
        },
        auto_return: 'approved',
        external_reference: externalReference,
        statement_descriptor: 'BIBLIOTECA KH',
        metadata: { product_ids: productIds, external_reference: externalReference },
        notification_url: `${apiUrl}/api/mp-webhook`,
      },
    });

    try {
      await query(`
        INSERT INTO orders (
          preference_id, external_reference, status, status_detail,
          items, transaction_amount, currency_id, date_created, logged_at
        ) VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,NOW(),NOW())
        ON CONFLICT (external_reference) DO UPDATE SET
          preference_id       = COALESCE(EXCLUDED.preference_id, orders.preference_id),
          status              = EXCLUDED.status,
          status_detail       = EXCLUDED.status_detail,
          items               = EXCLUDED.items,
          transaction_amount  = EXCLUDED.transaction_amount,
          currency_id         = EXCLUDED.currency_id,
          updated_at          = NOW()
      `, [
        result.id || null,
        externalReference,
        'pending_checkout',
        'preference_created',
        JSON.stringify(items),
        total,
        currencyId,
      ]);
    } catch (e) {
      console.error('[create-preference] Error guardando intento:', e.message);
    }

    return res.json({
      init_point: result.init_point,
      id: result.id,
      external_reference: externalReference,
      total,
      items,
    });
  } catch (err) {
    console.error('[create-preference] Error:', err);
    return res.status(502).json({
      error: 'No se pudo crear el pago. Revisa el Access Token de Mercado Pago.',
    });
  }
}

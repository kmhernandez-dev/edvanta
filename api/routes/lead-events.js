import { pool } from '../db.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_EVENTS = new Set([
  'lead_created',
  'free_guide_requested',
  'guide_viewed',
  'hotmart_clicked',
  'academy_viewed',
  'academy_lead_created',
  'community_clicked',
  'pharmaceutical_service_clicked',
  'account_signup_started',
  'account_created',
  'nutrifst_opened',
  'vida360_opened',
  'retos_viewed',
  'hotmart_purchase',
]);

function clean(value, max = 160) {
  return (value || '').toString().trim().slice(0, max);
}

/**
 * POST /api/lead-events
 * Registra un evento comercial/educativo de Feliz Sin Tiroides.
 * No almacena datos clínicos. El email es opcional: si no viene,
 * el evento se guarda con email vacío (anónimo) para no perder
 * la señal de conversión.
 */
export async function leadEventsRoute(req, res) {
  const eventType = clean(req.body?.eventType, 80);
  const email = clean(req.body?.email, 255).toLowerCase();
  const resourceSlug = clean(req.body?.resourceSlug, 120);
  const resourceName = clean(req.body?.resourceName, 160);
  const productId = clean(req.body?.productId, 120);
  const metadata = req.body?.metadata && typeof req.body.metadata === 'object' ? req.body.metadata : {};

  if (!ALLOWED_EVENTS.has(eventType)) {
    return res.status(400).json({ ok: false, error: 'Tipo de evento no permitido.' });
  }
  if (email && !emailPattern.test(email)) {
    return res.status(400).json({ ok: false, error: 'Correo inválido.' });
  }
  if (!process.env.DATABASE_URL) {
    return res.json({ ok: true, stored: false });
  }

  const safeMetadata = {
    source: clean(metadata.source, 80) || null,
    utm_source: clean(metadata.utm_source, 160) || null,
    utm_medium: clean(metadata.utm_medium, 160) || null,
    utm_campaign: clean(metadata.utm_campaign, 160) || null,
    utm_content: clean(metadata.utm_content, 160) || null,
    utm_term: clean(metadata.utm_term, 160) || null,
    landing_path: clean(metadata.landing_path, 255) || null,
    source_page: clean(metadata.source_page, 1000) || null,
  };

  try {
    await pool.query(
      `INSERT INTO lead_events (email, event_type, resource_slug, resource_name, product_id, metadata)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [email, eventType, resourceSlug || null, resourceName || null, productId || null, JSON.stringify(safeMetadata)],
    );
    return res.json({ ok: true, stored: true });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'No se pudo guardar el evento', error: error.message }));
    return res.status(500).json({ ok: false, error: 'No se pudo guardar el evento.' });
  }
}

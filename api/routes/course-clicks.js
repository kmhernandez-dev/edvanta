/**
 * ============================================================
 *  routes/course-clicks.js — Registro de clics de afiliado
 *
 *  POST /api/course-clicks
 *    Body: { course_id, provider, destination_url, page_path, referrer, utm_source, utm_medium, utm_campaign }
 *
 *  No almacena información personal sensible.
 * ============================================================
 */
import { pool } from '../db.js';

export async function trackClickRoute(req, res) {
  try {
    const {
      course_id,
      provider,
      destination_url,
      page_path,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
    } = req.body || {};

    if (!destination_url) {
      return res.status(400).json({ ok: false, error: 'destination_url requerido' });
    }

    // Validar que la URL sea razonable
    if (typeof destination_url !== 'string' || destination_url.length > 2048) {
      return res.status(400).json({ ok: false, error: 'URL inválida' });
    }

    const result = await pool.query(
      `INSERT INTO course_clicks (course_id, provider, destination_url, page_path, clicked_at, referrer, utm_source, utm_medium, utm_campaign)
       VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7, $8)
       RETURNING id`,
      [
        course_id || null,
        provider || null,
        destination_url,
        page_path?.slice(0, 500) || null,
        referrer?.slice(0, 500) || null,
        utm_source?.slice(0, 100) || null,
        utm_medium?.slice(0, 100) || null,
        utm_campaign?.slice(0, 100) || null,
      ]
    );

    return res.json({ ok: true, id: result.rows[0].id });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error registrando clic', error: e.message }));
    // No devolvemos error al cliente para no bloquear la navegación
    return res.json({ ok: false, error: 'No se pudo registrar el clic' });
  }
}

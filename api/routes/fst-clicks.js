/**
 * ============================================================
 *  routes/fst-clicks.js — Registro de clics de Feliz Sin Tiroides
 *
 *  POST /api/fst-clicks
 *    Body: { section, element, label, destination, source_page, referrer, utm_source, utm_medium, utm_campaign }
 *
 *  No almacena información personal sensible.
 * ============================================================
 */
import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

function clean(value, max = 500) {
  return (value || '').toString().trim().slice(0, max);
}

router.post('/', async (req, res) => {
  try {
    const {
      section, element, label, destination, source_page, referrer,
      utm_source, utm_medium, utm_campaign,
    } = req.body || {};

    const dest = clean(destination, 500);
    if (!dest && !section && !element) {
      return res.status(400).json({ ok: false, error: 'Faltan datos del clic.' });
    }

    const result = await pool.query(
      `INSERT INTO fst_clicks
         (section, element, label, destination, source_page, referrer,
          utm_source, utm_medium, utm_campaign)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        clean(section, 80) || null,
        clean(element, 120) || null,
        clean(label, 200) || null,
        dest || null,
        clean(source_page, 500) || null,
        clean(referrer, 500) || null,
        clean(utm_source, 160) || null,
        clean(utm_medium, 160) || null,
        clean(utm_campaign, 160) || null,
      ]
    );

    return res.json({ ok: true, id: result.rows[0].id });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error registrando clic FST', error: e.message }));
    // No devolvemos error al cliente para no bloquear la navegación
    return res.json({ ok: false, error: 'No se pudo registrar el clic' });
  }
});

export default router;

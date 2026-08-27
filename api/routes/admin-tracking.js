/**
 * ============================================================
 *  routes/admin-tracking.js — Panel de seguimiento unificado
 *
 *  Todos los datos operativos de la plataforma en un solo panel:
 *  guías/leads, eventos, órdenes, academia, retos y clics.
 *
 *  AUTENTICACIÓN: adminMiddleware (ADMIN_TOKEN)
 *  ============================================================
 */
import { Router } from 'express';
import { pool } from '../db.js';
import { adminMiddleware } from '../lib/auth.js';

const router = Router();
router.use(adminMiddleware);

const ALLOWED_EVENTS = [
  'lead_created', 'free_guide_requested', 'guide_viewed', 'hotmart_clicked',
  'academy_viewed', 'academy_lead_created', 'community_clicked',
  'pharmaceutical_service_clicked', 'account_signup_started', 'account_created',
  'nutrifst_opened', 'vida360_opened', 'retos_viewed', 'hotmart_purchase',
];

function cleanDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

// GET /api/admin/tracking/summary — KPIs globales
router.get('/summary', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM leads) AS leads_total,
        (SELECT COUNT(*)::int FROM leads WHERE created_at >= NOW() - INTERVAL '30 days') AS leads_30d,
        (SELECT COUNT(*)::int FROM lead_events) AS events_total,
        (SELECT COUNT(*)::int FROM lead_events WHERE created_at >= NOW() - INTERVAL '30 days') AS events_30d,
        (SELECT COUNT(*)::int FROM orders WHERE status = 'approved') AS orders_approved,
        (SELECT COUNT(*)::int FROM orders WHERE status = 'approved' AND date_approved >= NOW() - INTERVAL '30 days') AS orders_30d,
        (SELECT COALESCE(SUM(transaction_amount), 0) FROM orders WHERE status = 'approved') AS revenue_total,
        (SELECT COALESCE(SUM(transaction_amount), 0) FROM orders WHERE status = 'approved' AND date_approved >= NOW() - INTERVAL '30 days') AS revenue_30d,
        (SELECT COUNT(*)::int FROM academia_users) AS academy_users,
        (SELECT COUNT(*)::int FROM academia_enrollments) AS academy_enrollments,
        (SELECT COUNT(*)::int FROM fst_user_challenges) AS retos_joined,
        (SELECT COUNT(*)::int FROM fst_user_challenges WHERE status = 'completed') AS retos_completed,
        (SELECT COUNT(*)::int FROM fst_challenge_checkins WHERE exercise_completed = true) AS retos_checkins,
        (SELECT COUNT(*)::int FROM course_clicks) AS clicks_total,
        (SELECT COUNT(*)::int FROM course_clicks WHERE clicked_at >= NOW() - INTERVAL '30 days') AS clicks_30d,
        (SELECT COUNT(*)::int FROM fst_clicks) AS fstclicks_total,
        (SELECT COUNT(*)::int FROM fst_clicks WHERE created_at >= NOW() - INTERVAL '30 days') AS fstclicks_30d
    `);
    res.json({ data: rows[0] });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'tracking summary', error: e.message }));
    res.status(500).json({ error: 'No fue posible cargar el resumen de seguimiento.' });
  }
});

// GET /api/admin/tracking/leads?limit=&search=&days=
router.get('/leads', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 500);
    const search = String(req.query.search || '').trim();
    const days = Number.parseInt(req.query.days, 10);
    const params = [];
    const clauses = [];
    if (search) {
      params.push(`%${search}%`);
      clauses.push(`(email ILIKE $${params.length} OR name ILIKE $${params.length} OR country ILIKE $${params.length})`);
    }
    if (Number.isFinite(days) && days > 0) {
      params.push(`NOW() - INTERVAL '${Math.min(days, 365)} days'`);
      clauses.push(`created_at >= $${params.length}`);
    }
    params.push(limit);
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT id, email, name, country, interest, whatsapp, consent, resource, recommendation,
              utm_source, utm_medium, utm_campaign, source_page, landing_path,
              email_delivered, created_at, updated_at
       FROM leads ${where} ORDER BY created_at DESC LIMIT $${params.length}`,
      params,
    );
    res.json({ data: rows });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'tracking leads', error: e.message }));
    res.status(500).json({ error: 'No fue posible cargar los leads.' });
  }
});

// GET /api/admin/tracking/events?limit=&search=&type=&days=
router.get('/events', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 500);
    const search = String(req.query.search || '').trim();
    const type = String(req.query.type || '').trim();
    const days = Number.parseInt(req.query.days, 10);
    const params = [];
    const clauses = [];
    if (search) {
      params.push(`%${search}%`);
      clauses.push(`(email ILIKE $${params.length} OR resource_name ILIKE $${params.length})`);
    }
    if (type && ALLOWED_EVENTS.includes(type)) {
      params.push(type);
      clauses.push(`event_type = $${params.length}`);
    }
    if (Number.isFinite(days) && days > 0) {
      params.push(`NOW() - INTERVAL '${Math.min(days, 365)} days'`);
      clauses.push(`created_at >= $${params.length}`);
    }
    params.push(limit);
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT id, email, event_type, resource_slug, resource_name, product_id, metadata, created_at
       FROM lead_events ${where} ORDER BY created_at DESC LIMIT $${params.length}`,
      params,
    );
    res.json({ data: rows });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'tracking events', error: e.message }));
    res.status(500).json({ error: 'No fue posible cargar los eventos.' });
  }
});

// GET /api/admin/tracking/orders?limit=&search=&status=&days=
router.get('/orders', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 500);
    const search = String(req.query.search || '').trim();
    const status = String(req.query.status || '').trim();
    const days = Number.parseInt(req.query.days, 10);
    const params = [];
    const clauses = [];
    if (search) {
      params.push(`%${search}%`);
      clauses.push(`(email ILIKE $${params.length} OR items::text ILIKE $${params.length} OR payment_id::text ILIKE $${params.length})`);
    }
    if (status) {
      params.push(status);
      clauses.push(`status = $${params.length}`);
    }
    if (Number.isFinite(days) && days > 0) {
      params.push(`NOW() - INTERVAL '${Math.min(days, 365)} days'`);
      clauses.push(`COALESCE(date_approved, logged_at) >= $${params.length}`);
    }
    params.push(limit);
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT payment_id, status, status_detail, email, payer_id, items, transaction_amount,
              currency_id, payment_method, payment_type, date_approved, date_created, logged_at, email_sent_at
       FROM orders ${where} ORDER BY COALESCE(date_approved, logged_at) DESC LIMIT $${params.length}`,
      params,
    );
    res.json({ data: rows });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'tracking orders', error: e.message }));
    res.status(500).json({ error: 'No fue posible cargar las órdenes.' });
  }
});

// GET /api/admin/tracking/academy?limit=&search=&days=
router.get('/academy', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 500);
    const search = String(req.query.search || '').trim();
    const days = Number.parseInt(req.query.days, 10);
    const params = [];
    const clauses = [];
    if (search) {
      params.push(`%${search}%`);
      clauses.push(`(u.email ILIKE $${params.length} OR u.name ILIKE $${params.length})`);
    }
    if (Number.isFinite(days) && days > 0) {
      params.push(`NOW() - INTERVAL '${Math.min(days, 365)} days'`);
      clauses.push(`u.created_at >= $${params.length}`);
    }
    params.push(limit);
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT u.id, u.name, u.email, u.created_at,
              (SELECT COUNT(*)::int FROM academia_enrollments e WHERE e.user_id = u.id) AS enrollments,
              (SELECT COUNT(*)::int FROM academia_progress p WHERE p.user_id = u.id) AS lessons_done,
              (SELECT COUNT(*)::int FROM fst_user_challenges uc WHERE uc.user_id = u.id) AS retos_joined,
              (SELECT COUNT(*)::int FROM fst_challenge_checkins k WHERE k.user_id = u.id AND k.exercise_completed = true) AS retos_days_done
       FROM academia_users u ${where} ORDER BY u.created_at DESC LIMIT $${params.length}`,
      params,
    );
    res.json({ data: rows });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'tracking academy', error: e.message }));
    res.status(500).json({ error: 'No fue posible cargar la academia.' });
  }
});

// GET /api/admin/tracking/retos?limit=&search=&status=&days=
router.get('/retos', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 500);
    const search = String(req.query.search || '').trim();
    const status = String(req.query.status || '').trim();
    const days = Number.parseInt(req.query.days, 10);
    const params = [];
    const clauses = [];
    if (search) {
      params.push(`%${search}%`);
      clauses.push(`(c.title ILIKE $${params.length} OR u.email ILIKE $${params.length})`);
    }
    if (status === 'active' || status === 'completed') {
      params.push(status);
      clauses.push(`uc.status = $${params.length}`);
    }
    if (Number.isFinite(days) && days > 0) {
      params.push(`NOW() - INTERVAL '${Math.min(days, 365)} days'`);
      clauses.push(`uc.joined_at >= $${params.length}`);
    }
    params.push(limit);
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT uc.id, uc.user_id, uc.status, uc.selected_goal, uc.joined_at, uc.completed_at,
              u.name AS user_name, u.email AS user_email,
              c.title AS challenge_title, c.slug AS challenge_slug,
              (SELECT COUNT(*)::int FROM fst_challenge_checkins k
                WHERE k.challenge_id = uc.challenge_id AND k.user_id = uc.user_id AND k.exercise_completed = true) AS days_done
       FROM fst_user_challenges uc
       JOIN academia_users u ON u.id = uc.user_id
       JOIN fst_challenges c ON c.id = uc.challenge_id
       ${where} ORDER BY uc.joined_at DESC LIMIT $${params.length}`,
      params,
    );
    res.json({ data: rows });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'tracking retos', error: e.message }));
    res.status(500).json({ error: 'No fue posible cargar los retos.' });
  }
});

// GET /api/admin/tracking/clicks?limit=&search=&provider=&days=
router.get('/clicks', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 500);
    const search = String(req.query.search || '').trim();
    const provider = String(req.query.provider || '').trim();
    const days = Number.parseInt(req.query.days, 10);
    const params = [];
    const clauses = [];
    if (search) {
      params.push(`%${search}%`);
      clauses.push(`(destination_url ILIKE $${params.length} OR course_id::text ILIKE $${params.length} OR page_path ILIKE $${params.length})`);
    }
    if (provider) {
      params.push(provider);
      clauses.push(`provider = $${params.length}`);
    }
    if (Number.isFinite(days) && days > 0) {
      params.push(`NOW() - INTERVAL '${Math.min(days, 365)} days'`);
      clauses.push(`clicked_at >= $${params.length}`);
    }
    params.push(limit);
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT id, course_id, provider, destination_url, page_path, referrer,
              utm_source, utm_medium, utm_campaign, clicked_at
       FROM course_clicks ${where} ORDER BY clicked_at DESC LIMIT $${params.length}`,
      params,
    );
    res.json({ data: rows });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'tracking clicks', error: e.message }));
    res.status(500).json({ error: 'No fue posible cargar los clics.' });
  }
});

// GET /api/admin/tracking/fstclicks?limit=&search=&section=&days=
router.get('/fstclicks', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 500);
    const search = String(req.query.search || '').trim();
    const section = String(req.query.section || '').trim();
    const days = Number.parseInt(req.query.days, 10);
    const params = [];
    const clauses = [];
    if (search) {
      params.push(`%${search}%`);
      clauses.push(`(label ILIKE $${params.length} OR element ILIKE $${params.length} OR destination ILIKE $${params.length} OR source_page ILIKE $${params.length})`);
    }
    if (section) {
      params.push(section);
      clauses.push(`section = $${params.length}`);
    }
    if (Number.isFinite(days) && days > 0) {
      params.push(`NOW() - INTERVAL '${Math.min(days, 365)} days'`);
      clauses.push(`created_at >= $${params.length}`);
    }
    params.push(limit);
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT id, section, element, label, destination, source_page, referrer,
              utm_source, utm_medium, utm_campaign, created_at
       FROM fst_clicks ${where} ORDER BY created_at DESC LIMIT $${params.length}`,
      params,
    );
    res.json({ data: rows });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'tracking fstclicks', error: e.message }));
    res.status(500).json({ error: 'No fue posible cargar los clics FST.' });
  }
});

// GET /api/admin/tracking/analytics — análisis del embudo y atribución de compras
router.get('/analytics', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      WITH funnel AS (
        SELECT
          (SELECT COUNT(*)::int FROM leads) AS leads_total,
          (SELECT COUNT(*)::int FROM lead_events) AS events_total,
          (SELECT COUNT(*)::int FROM lead_events WHERE event_type IN ('hotmart_clicked','hotmart_purchase')) AS hotmart_clicks,
          (SELECT COUNT(*)::int FROM orders WHERE status = 'approved') AS orders_approved,
          (SELECT COALESCE(SUM(transaction_amount), 0) FROM orders WHERE status = 'approved') AS revenue_total
      ),
      daily AS (
        SELECT to_char(d.d, 'YYYY-MM-DD') AS day, d.d AS date
        FROM generate_series(NOW() - INTERVAL '29 days', NOW(), INTERVAL '1 day') AS d(d)
      ),
      leads_daily AS (
        SELECT date_trunc('day', created_at) AS day, COUNT(*)::int AS n FROM leads
        WHERE created_at >= NOW() - INTERVAL '30 days' GROUP BY 1
      ),
      events_daily AS (
        SELECT date_trunc('day', created_at) AS day, COUNT(*)::int AS n FROM lead_events
        WHERE created_at >= NOW() - INTERVAL '30 days' GROUP BY 1
      ),
      orders_daily AS (
        SELECT date_trunc('day', COALESCE(date_approved, logged_at)) AS day, COUNT(*)::int AS n,
               COALESCE(SUM(transaction_amount), 0) AS revenue
        FROM orders WHERE status = 'approved' AND COALESCE(date_approved, logged_at) >= NOW() - INTERVAL '30 days'
        GROUP BY 1
      ),
      order_attribution AS (
        SELECT
          o.payment_id,
          o.transaction_amount,
          o.email,
          le.metadata->>'utm_source' AS utm_source,
          le.metadata->>'utm_campaign' AS utm_campaign,
          le.metadata->>'landing_path' AS landing_path
        FROM orders o
        LEFT JOIN LATERAL (
          SELECT metadata FROM lead_events le
          WHERE le.email = o.email
            AND le.metadata ? 'utm_source'
            AND le.created_at <= COALESCE(o.date_approved, o.logged_at)
          ORDER BY le.created_at DESC
          LIMIT 1
        ) le ON true
        WHERE o.status = 'approved' AND o.email IS NOT NULL
      )
      SELECT
        (SELECT row_to_json(f) FROM funnel f) AS funnel,
        (SELECT COALESCE(json_agg(json_build_object(
                'day', d.day, 'leads', COALESCE(l.n, 0), 'events', COALESCE(e.n, 0),
                'orders', COALESCE(o.n, 0), 'revenue', COALESCE(o.revenue, 0))
              ORDER BY d.date), '[]'::json)
         FROM daily d
         LEFT JOIN leads_daily l  ON l.day = d.date
         LEFT JOIN events_daily e ON e.day = d.date
         LEFT JOIN orders_daily o ON o.day = d.date) AS daily,
        (SELECT COALESCE(json_agg(json_build_object('utm_source', utm_source,
                 'utm_campaign', utm_campaign, 'landing_path', landing_path,
                 'orders', cnt, 'revenue', revenue) ORDER BY cnt DESC), '[]'::json)
         FROM (
           SELECT COALESCE(NULLIF(utm_source, ''), 'directo') AS utm_source,
                  COALESCE(NULLIF(utm_campaign, ''), 'sin campaña') AS utm_campaign,
                  COALESCE(NULLIF(landing_path, ''), '/') AS landing_path,
                  COUNT(*)::int AS cnt, SUM(transaction_amount) AS revenue
           FROM order_attribution
           GROUP BY 1, 2, 3
         ) a) AS sources,
        (SELECT COALESCE(json_agg(json_build_object('event_type', event_type, 'n', n) ORDER BY n DESC), '[]'::json)
         FROM (
           SELECT event_type, COUNT(*)::int AS n FROM lead_events
           WHERE created_at >= NOW() - INTERVAL '30 days' GROUP BY 1
         ) e) AS top_events
    `);
    res.json({ data: rows[0] });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'tracking analytics', error: e.message }));
    res.status(500).json({ error: 'No fue posible generar el análisis.' });
  }
});

// GET /api/admin/tracking/export?entity=leads|events|orders|academy|retos|clicks|fstclicks — CSV
router.get('/export', async (req, res) => {
  const entity = String(req.query.entity || '').trim();
  const queries = {
    leads: `SELECT email, name, country, interest, whatsapp, consent, resource, recommendation,
                   COALESCE(utm_source,'') AS utm_source, COALESCE(utm_medium,'') AS utm_medium,
                   COALESCE(utm_campaign,'') AS utm_campaign, email_delivered, created_at
            FROM leads ORDER BY created_at DESC`,
    events: `SELECT email, event_type, COALESCE(resource_slug,'') AS resource_slug,
                    COALESCE(resource_name,'') AS resource_name, COALESCE(product_id,'') AS product_id, created_at
             FROM lead_events ORDER BY created_at DESC`,
    orders: `SELECT payment_id, status, status_detail, email, transaction_amount, currency_id,
                    payment_method, payment_type, date_approved, email_sent_at
             FROM orders ORDER BY COALESCE(date_approved, logged_at) DESC`,
    academy: `SELECT u.id, u.name, u.email, u.created_at,
                     (SELECT COUNT(*)::int FROM academia_enrollments e WHERE e.user_id = u.id) AS enrollments,
                     (SELECT COUNT(*)::int FROM academia_progress p WHERE p.user_id = u.id) AS lessons_done
              FROM academia_users u ORDER BY u.created_at DESC`,
    retos: `SELECT uc.user_id, u.name, u.email, c.title AS challenge, uc.status, uc.selected_goal, uc.joined_at, uc.completed_at
            FROM fst_user_challenges uc
            JOIN academia_users u ON u.id = uc.user_id
            JOIN fst_challenges c ON c.id = uc.challenge_id
            ORDER BY uc.joined_at DESC`,
    clicks: `SELECT id, COALESCE(course_id,'') AS course_id, COALESCE(provider,'') AS provider,
                    destination_url, COALESCE(page_path,'') AS page_path, clicked_at
             FROM course_clicks ORDER BY clicked_at DESC`,
    fstclicks: `SELECT section, element, label, destination, source_page, referrer,
                       COALESCE(utm_source,'') AS utm_source, COALESCE(utm_campaign,'') AS utm_campaign, created_at
                FROM fst_clicks ORDER BY created_at DESC`,
  };
  const sql = queries[entity];
  if (!sql) return res.status(400).json({ error: 'Entidad no válida para exportar.' });

  try {
    const { rows } = await pool.query(sql);
    const columns = rows.length ? Object.keys(rows[0]) : [];
    const escape = value => {
      const text = value === null || value === undefined ? '' : String(value);
      return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
    };
    const lines = [columns.join(',')];
    for (const row of rows) lines.push(columns.map(column => escape(row[column])).join(','));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="tracking-${entity}-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send('\uFEFF' + lines.join('\n'));
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'tracking export', error: e.message }));
    res.status(500).json({ error: 'No fue posible exportar los datos.' });
  }
});

export default router;

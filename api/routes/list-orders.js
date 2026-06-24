/**
 * ============================================================
 *  GET /api/list-orders  —  Endpoint admin (protegido)
 *
 *  Devuelve las órdenes guardadas en Postgres. Pensado para
 *  uso interno de Karla (consulta manual, export, panel futuro).
 *
 *  AUTENTICACIÓN:
 *    Header:  x-admin-token: <ADMIN_TOKEN>
 *    O query: ?token=<ADMIN_TOKEN>
 *    Configurar ADMIN_TOKEN en Coolify → Environment variables.
 *
 *  PARÁMETROS:
 *    ?limit=50              (máx. 200, default 50)
 *    ?payment_id=123456     (devuelve una sola orden)
 *
 *  RESPUESTA:
 *    { count, limit, orders: [...] }
 *    o { order: {...} } si se busca por id
 * ============================================================
 */
import { query } from '../db.js';

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

export async function listOrdersRoute(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido. Usa GET.' });
  }

  // ── Autenticación ──────────────────────────────────────────
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    return res.status(503).json({
      error: 'ADMIN_TOKEN no está configurado en este servicio.',
    });
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const headerToken = req.headers['x-admin-token'];
  const queryToken  = url.searchParams.get('token');
  const provided = headerToken || queryToken;

  if (!provided || !safeEqual(String(provided), String(expected))) {
    return res.status(401).json({ error: 'No autorizado.' });
  }

  // ── Búsqueda por payment_id ────────────────────────────────
  const paymentId = url.searchParams.get('payment_id');
  if (paymentId) {
    const pid = Number(paymentId);
    if (!Number.isFinite(pid)) {
      return res.status(400).json({ error: 'payment_id inválido' });
    }
    const { rows } = await query(
      'SELECT * FROM orders WHERE payment_id = $1',
      [pid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada.' });
    }
    return res.json({ order: rows[0] });
  }

  // ── Listado general ────────────────────────────────────────
  const limitRaw = parseInt(url.searchParams.get('limit'), 10);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number.isFinite(limitRaw) ? limitRaw : DEFAULT_LIMIT)
  );

  const { rows: orders } = await query(
    `SELECT * FROM orders
     ORDER BY COALESCE(date_approved, logged_at) DESC
     LIMIT $1`,
    [limit]
  );

  return res.json({
    count: orders.length,
    limit,
    orders,
  });
}

// Comparación de strings en tiempo constante (evita timing attacks).
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

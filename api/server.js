/**
 * ============================================================
 *  server.js — Express app para Biblioteca Profesional KH
 *
 *  Rutas:
 *    GET  /health                    healthcheck simple
 *    POST /api/create-preference     Mercado Pago: crear preferencia
 *    POST /api/mp-webhook            Mercado Pago: webhook
 *    POST /api/lead-capture          Captación de leads
 *    GET  /api/list-orders           Admin: listar/buscar órdenes
 *
 *  Despliega con:
 *    - CORS habilitado SOLO para los orígenes autorizados
 *    - Migraciones automáticas al arrancar
 *    - Logs estructurados en JSON
 * ============================================================
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { runMigrations } from './lib/migrate.js';
import { createPreferenceRoute } from './routes/create-preference.js';
import { mpWebhookRoute } from './routes/mp-webhook.js';
import { leadCaptureRoute } from './routes/lead-capture.js';
import { listOrdersRoute } from './routes/list-orders.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

// Orígenes CORS autorizados. Si no se configura, usa defaults sensatos.
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'https://edvanta.co,https://www.edvanta.co')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const app = express();

// ── Middlewares ──────────────────────────────────────────────
app.use(express.json({ limit: '128kb' }));
app.use(cors({
  origin(origin, callback) {
    // Permitir requests sin Origin (server-to-server, curl, MP webhooks)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    return callback(new Error(`Origen no permitido: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
}));

// Logger mínimo
app.use((req, _res, next) => {
  console.log(JSON.stringify({
    at: new Date().toISOString(),
    method: req.method,
    path: req.path,
    ip: req.ip,
  }));
  next();
});

// ── Health ───────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

// ── Rutas de negocio ─────────────────────────────────────────
app.post('/api/create-preference', createPreferenceRoute);
app.post('/api/mp-webhook',         mpWebhookRoute);
app.post('/api/lead-capture',       leadCaptureRoute);
app.get('/api/list-orders',         listOrdersRoute);

// ── 404 + manejo de errores ──────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(500).json({ error: err.message || 'Error interno' });
});

// ── Arranque ─────────────────────────────────────────────────
async function start() {
  if (process.env.DATABASE_URL) {
    try {
      await runMigrations();
    } catch (e) {
      console.error('[start] Migraciones fallaron:', e.message);
      // No matamos el proceso; las rutas que consulten DB fallarán
      // con error claro y Coolify reiniciará si es necesario.
    }
  } else {
    console.warn('[start] Sin DATABASE_URL, omitiendo migraciones.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[start] API escuchando en 0.0.0.0:${PORT}`);
    console.log(`[start] CORS origins: ${ALLOWED_ORIGINS.join(', ')}`);
  });
}

start();

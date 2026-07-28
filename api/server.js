/**
 * ============================================================
 *  server.js — Express app para Biblioteca Profesional KH
 *
 *  Rutas:
 *    GET  /health                    healthcheck simple (liveness)
 *    GET  /api/health                healthcheck con info de servicio
 *    GET  /api/health/db             healthcheck que valida DB
 *    POST /api/create-preference     Mercado Pago: crear preferencia
 *    POST /api/mp-webhook            Mercado Pago: webhook
 *    POST /api/lead-capture          Captación de leads
 *    GET  /api/list-orders           Admin: listar/buscar órdenes
 *
 *  Características:
 *    - CORS restringido a orígenes autorizados
 *    - Migraciones automáticas al arrancar (best-effort)
 *    - Logs estructurados en JSON para fácil parseo en Coolify
 *    - Nunca expone stack traces al cliente en producción
 * ============================================================
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { runMigrations } from './lib/migrate.js';
import { pool } from './db.js';
import { createPreferenceRoute } from './routes/create-preference.js';
import { mpWebhookRoute } from './routes/mp-webhook.js';
import { leadCaptureRoute } from './routes/lead-capture.js';
import { listOrdersRoute } from './routes/list-orders.js';
import { listCoursesRoute, getCourseBySlugRoute, getFilterOptionsRoute } from './routes/courses.js';
import { trackClickRoute } from './routes/course-clicks.js';
import { importCourses } from './lib/import-courses.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import academiaAuthRoutes from './routes/academia-auth.js';
import academiaRoutes from './routes/academia.js';
import adminAcademiaRoutes from './routes/admin-academia.js';
import articleCommentsRoutes from './routes/article-comments.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PROD = NODE_ENV === 'production';

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS || 'https://edvanta.co,https://www.edvanta.co')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const VERSION = '1.0.0';
const STARTED_AT = new Date().toISOString();

const app = express();
app.disable('x-powered-by');

// ── Middlewares ──────────────────────────────────────────────
app.use(express.json({ limit: '128kb' }));

app.use(cors({
  origin(origin, callback) {
    // Permitir requests sin Origin (server-to-server, curl, MP webhooks)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    console.warn(JSON.stringify({ level: 'warn', msg: 'CORS bloqueado', origin }));
    return callback(new Error(`Origen no permitido: ${origin}`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
}));

// Logger mínimo estructurado
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
// Liveness: ¿el proceso está vivo? No consulta dependencias externas.
// Usado por Docker / Coolify para decidir si reiniciar el contenedor.
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'edvanta-api',
    version: VERSION,
    uptime_sec: Math.floor(process.uptime()),
  });
});

// Health con info del servicio
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'edvanta-api',
    version: VERSION,
    started_at: STARTED_AT,
    uptime_sec: Math.floor(process.uptime()),
    env: NODE_ENV,
    database: process.env.DATABASE_URL ? 'configured' : 'missing',
    mercado_pago: process.env.MP_ACCESS_TOKEN ? 'configured' : 'missing',
    resend: process.env.RESEND_API_KEY ? 'configured' : 'missing',
  });
});

// Readiness: ¿la API puede servir tráfico real? Valida DB.
app.get('/api/health/db', async (_req, res) => {
  const t0 = Date.now();
  try {
    const r = await pool.query('SELECT 1 AS ok, NOW() AS now, current_database() AS db, version() AS v');
    return res.json({
      ok: true,
      latency_ms: Date.now() - t0,
      db: r.rows[0].db,
      server_version: r.rows[0].v.split(' ').slice(0, 2).join(' '),
      server_time: r.rows[0].now,
    });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'DB health check failed', error: e.message, code: e.code }));
    return res.status(503).json({
      ok: false,
      latency_ms: Date.now() - t0,
      error: 'database_unreachable',
      detail: IS_PROD ? undefined : e.message,
    });
  }
});

// ── Rutas de negocio ─────────────────────────────────────────
app.post('/api/create-preference', createPreferenceRoute);
app.post('/api/mp-webhook',         mpWebhookRoute);
app.post('/api/lead-capture',       leadCaptureRoute);
app.get('/api/list-orders',         listOrdersRoute);

// Catálogo multi-plataforma de cursos
app.get('/api/courses',              listCoursesRoute);
app.get('/api/courses/filters/options', getFilterOptionsRoute);
app.get('/api/courses/:slug',        getCourseBySlugRoute);
app.post('/api/course-clicks',       trackClickRoute);

// Admin: importar cursos desde el JSON incluido en el repo
app.post('/api/admin/import-courses', async (req, res) => {
  try {
    const token = req.headers['x-admin-token'];
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, 'data', 'coursera-udemy-courses.json');
    const raw = JSON.parse(readFileSync(filePath, 'utf8'));

    const report = await importCourses(raw, { dryRun: false, updateExisting: true });
    res.json({ ok: true, report });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error importando cursos', error: e.message }));
    res.status(500).json({ error: 'Error al importar cursos' });
  }
});

// Academia FST
app.use('/api/academia/auth',  academiaAuthRoutes);
app.use('/api/academia',       academiaRoutes);
app.use('/api/admin/academia', adminAcademiaRoutes);

// Comentarios en artículos
app.use('/api/article-comments', articleCommentsRoutes);

// ── 404 + manejo de errores (no expone stack traces) ─────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, _req, res, _next) => {
  console.error(JSON.stringify({
    level: 'error',
    msg: err.message,
    code: err.code,
    stack: IS_PROD ? undefined : err.stack,
  }));
  // Mensaje genérico al cliente. CORS bloqueado aquí cae como 500.
  if (/Origen no permitido/i.test(err.message)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  res.status(500).json({
    error: IS_PROD ? 'Error interno' : err.message,
  });
});

// ── Arranque ─────────────────────────────────────────────────
async function start() {
  console.log(JSON.stringify({
    level: 'info',
    msg: 'API arrancando',
    node: process.version,
    env: NODE_ENV,
    port: PORT,
    pid: process.pid,
    started_at: STARTED_AT,
  }));
  console.log(JSON.stringify({
    level: 'info',
    msg: 'Configuración',
    cors_origins: ALLOWED_ORIGINS,
    has_database_url: !!process.env.DATABASE_URL,
    has_mp_token: !!process.env.MP_ACCESS_TOKEN,
    has_resend_key: !!process.env.RESEND_API_KEY,
    site_url: process.env.SITE_URL || '(not set)',
    api_url: process.env.API_URL || '(not set)',
  }));

  if (process.env.DATABASE_URL) {
    try {
      console.log(JSON.stringify({ level: 'info', msg: 'Probando conexión a base de datos...' }));
      await pool.query('SELECT 1');
      console.log(JSON.stringify({ level: 'info', msg: 'Conexión a base de datos OK' }));
      await runMigrations();
    } catch (e) {
      // NO matamos el proceso: el healthcheck reporta unhealthy pero
      // el contenedor sigue vivo y Coolify puede observar.
      console.error(JSON.stringify({
        level: 'error',
        msg: 'Base de datos no disponible al arrancar',
        error: e.message,
        code: e.code,
        hint: 'Verifica que DATABASE_URL sea correcto y la DB accesible.',
      }));
    }
  } else {
    console.warn(JSON.stringify({
      level: 'warn',
      msg: 'DATABASE_URL no configurada. Las rutas que consulten DB fallarán.',
    }));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(JSON.stringify({
      level: 'info',
      msg: `API escuchando en 0.0.0.0:${PORT}`,
      routes: ['/health', '/api/health', '/api/health/db', '/api/create-preference', '/api/mp-webhook', '/api/lead-capture', '/api/list-orders'],
    }));
  });
}

// Capturar errores no manejados a nivel proceso (no matar la API).
process.on('unhandledRejection', (reason) => {
  console.error(JSON.stringify({ level: 'error', msg: 'Unhandled rejection', reason: String(reason) }));
});
process.on('uncaughtException', (err) => {
  console.error(JSON.stringify({ level: 'error', msg: 'Uncaught exception', error: err.message, stack: err.stack }));
});

start();

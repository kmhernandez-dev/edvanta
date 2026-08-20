/**
 * ============================================================
 *  routes/community.js — Banco comunitario de empleo + talento
 *
 *  GET  /api/community/jobs?q=
 *  POST /api/community/jobs          (público, queda en pending)
 *  GET  /api/community/talent?area=&q=
 *  POST /api/community/talent        (público, queda en pending)
 *
 *  Moderación (ADMIN_TOKEN, X-Admin-Token):
 *  GET    /api/community/admin/pending
 *  POST   /api/community/admin/:type/:id/approve|reject|archive|restore
 *  DELETE /api/community/admin/:type/:id
 *  GET    /api/community/admin/logs
 *
 *  Seguridad: rate limit por IP (max 3 publicaciones / 30 min),
 *  validación de entrada estricta, sin SQL dinámico.
 * ============================================================
 */
import { Router } from 'express';
import { pool, query } from '../db.js';
import { adminMiddleware } from '../lib/auth.js';

const router = Router();

const clean = (value, max = 200) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const MODALIDADES = new Set(['onsite', 'hybrid', 'remote']);
const AREAS = new Set(['calidad', 'regulatorio', 'farmacovigilancia', 'clinico', 'produccion', 'laboratorio', 'datos', 'comercial']);

// Rate limit: máx. 3 publicaciones por IP cada 5 minutos.
const POST_LIMIT = 3;
const POST_WINDOW_MS = 5 * 60 * 1000;

async function enforceRateLimit(ip) {
  const now = new Date();
  const windowStart = new Date(now.getTime() - POST_WINDOW_MS);
  const { rows } = await query(
    `SELECT count, blocked_until FROM community_limits WHERE ip = $1 AND scope = 'post'`,
    [ip],
  );
  const row = rows[0];

  if (row?.blocked_until && new Date(row.blocked_until) > now) {
    const seconds = Math.ceil((new Date(row.blocked_until) - now) / 1000);
    return { limited: true, retryAfter: seconds };
  }

  if (row && new Date(row.window_start) >= windowStart && row.count >= POST_LIMIT) {
    await query(
      `UPDATE community_limits SET blocked_until = $2, count = $3 WHERE ip = $1 AND scope = 'post'`,
      [ip, new Date(now.getTime() + POST_WINDOW_MS), POST_LIMIT],
    );
    return { limited: true, retryAfter: 300 };
  }

  await query(
    `INSERT INTO community_limits (ip, scope, window_start, count)
     VALUES ($1, 'post', $2, 1)
     ON CONFLICT (ip, scope)
     DO UPDATE SET
       window_start = CASE WHEN community_limits.window_start >= $2 THEN community_limits.window_start ELSE $2 END,
       count = CASE WHEN community_limits.window_start >= $2 THEN community_limits.count + 1 ELSE 1 END,
       blocked_until = NULL`,
    [ip, windowStart],
  );
  return { limited: false };
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim().slice(0, 45);
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';
}

function fail(res, message, error) {
  console.error(JSON.stringify({ level: 'error', msg: message, error: error?.message, code: error?.code }));
  return res.status(500).json({ ok: false, error: message });
}

// ─── Empleo ─────────────────────────────────────────────────
router.get('/jobs', async (req, res) => {
  try {
    const q = clean(req.query.q);
    const conditions = ["status = 'published'"];
    const params = [];
    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(cargo ILIKE $${params.length} OR empresa ILIKE $${params.length} OR requisitos ILIKE $${params.length})`);
    }
    const result = await pool.query(`
      SELECT id, slug, cargo, empresa, ciudad, modalidad, requisitos, contacto, fuente, published_at
      FROM community_jobs
      WHERE ${conditions.join(' AND ')}
      ORDER BY published_at DESC NULLS LAST, created_at DESC
      LIMIT 100
    `, params);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible cargar el banco de empleo', error);
  }
});

router.post('/jobs', async (req, res) => {
  try {
    const ip = clientIp(req);
    const rate = await enforceRateLimit(ip);
    if (rate.limited) {
      return res.status(429).json({ ok: false, error: `Has alcanzado el límite de publicaciones. Intenta de nuevo en ${rate.retryAfter} segundos.` });
    }

    const cargo = clean(req.body?.cargo, 120);
    const empresa = clean(req.body?.empresa, 120);
    const ciudad = clean(req.body?.ciudad, 80);
    let modalidad = clean(req.body?.modalidad, 20);
    const requisitos = clean(req.body?.requisitos, 1000);
    const contacto = clean(req.body?.contacto, 300);

    if (!cargo) return res.status(400).json({ ok: false, error: 'El cargo es obligatorio.' });
    if (!contacto) return res.status(400).json({ ok: false, error: 'El correo o enlace de contacto es obligatorio.' });
    if (!MODALIDADES.has(modalidad)) modalidad = 'onsite';

    const slug = `${slugify(cargo)}-${Date.now().toString(36)}`;

    const result = await pool.query(`
      INSERT INTO community_jobs (slug, cargo, empresa, ciudad, modalidad, requisitos, contacto, fuente, ip_address, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
      RETURNING id, slug, cargo, empresa, ciudad, modalidad, requisitos, contacto, fuente, status, created_at
    `, [slug, cargo, empresa || 'Empresa de la comunidad', ciudad || 'Colombia', modalidad, requisitos, contacto, 'Comunidad Edvanta', ip]);

    return res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return fail(res, 'No fue posible publicar la oferta', error);
  }
});

// ─── Talento ─────────────────────────────────────────────────
router.get('/talent', async (req, res) => {
  try {
    const q = clean(req.query.q);
    const area = clean(req.query.area, 30);
    const conditions = ["status = 'published'"];
    const params = [];
    if (area) {
      if (!AREAS.has(area)) return res.status(400).json({ ok: false, error: 'Área no válida' });
      params.push(area); conditions.push(`area = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(display_name ILIKE $${params.length} OR title ILIKE $${params.length} OR habilidades::text ILIKE $${params.length})`);
    }
    const result = await pool.query(`
      SELECT id, slug, display_name, area, title, habilidades, proyectos, articulos, linkedin, contacto, disponibilidad, published_at
      FROM talent_profiles
      WHERE ${conditions.join(' AND ')}
      ORDER BY published_at DESC NULLS LAST, created_at DESC
      LIMIT 100
    `, params);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible cargar el directorio de talento', error);
  }
});

router.post('/talent', async (req, res) => {
  try {
    const ip = clientIp(req);
    const rate = await enforceRateLimit(ip);
    if (rate.limited) {
      return res.status(429).json({ ok: false, error: `Has alcanzado el límite de publicaciones. Intenta de nuevo en ${rate.retryAfter} segundos.` });
    }

    const display_name = clean(req.body?.display_name, 120);
    const area = clean(req.body?.area, 30);
    const title = clean(req.body?.title, 200);
    const linkedin = clean(req.body?.linkedin, 300);
    const contacto = clean(req.body?.contacto, 300);
    const disponibilidad = clean(req.body?.disponibilidad, 120);

    if (!display_name) return res.status(400).json({ ok: false, error: 'El nombre es obligatorio.' });
    if (!AREAS.has(area)) return res.status(400).json({ ok: false, error: 'El área no es válida.' });
    if (!title) return res.status(400).json({ ok: false, error: 'El título profesional es obligatorio.' });

    const habilidades = Array.isArray(req.body?.habilidades)
      ? req.body.habilidades.filter(h => typeof h === 'string' && h.trim()).map(h => h.trim().slice(0, 60)).slice(0, 12)
      : [];
    const proyectos = Array.isArray(req.body?.proyectos)
      ? req.body.proyectos.filter(p => typeof p === 'string' && p.trim()).map(p => p.trim().slice(0, 160)).slice(0, 8)
      : [];
    const articulos = Array.isArray(req.body?.articulos)
      ? req.body.articulos.filter(a => typeof a === 'string' && a.trim()).map(a => a.trim().slice(0, 200)).slice(0, 8)
      : [];

    const slug = `${slugify(display_name)}-${Date.now().toString(36)}`;

    const result = await pool.query(`
      INSERT INTO talent_profiles (slug, display_name, area, title, habilidades, proyectos, articulos, linkedin, contacto, disponibilidad, status)
      VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8, $9, $10, 'pending')
      RETURNING id, slug, display_name, area, title, habilidades, proyectos, articulos, linkedin, contacto, disponibilidad, status, created_at
    `, [slug, display_name, area, title, JSON.stringify(habilidades), JSON.stringify(proyectos), JSON.stringify(articulos), linkedin || null, contacto || null, disponibilidad || null]);

    return res.status(201).json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return fail(res, 'No fue posible publicar el perfil de talento', error);
  }
});

// ─── Moderación (admin) ───────────────────────────────────────
const MODERATION_TYPES = {
  jobs: { table: 'community_jobs', resourceType: 'community_job', label: 'cargo' },
  talent: { table: 'talent_profiles', resourceType: 'talent_profile', label: 'display_name' },
};

router.use('/admin', adminMiddleware);

const JOBS_SELECT = `id, slug, cargo, empresa, ciudad, modalidad, requisitos, contacto, fuente, ip_address, status, moderation_note, published_at, created_at`;
const TALENT_SELECT = `id, slug, display_name, area, title, habilidades, proyectos, articulos, linkedin, contacto, disponibilidad, status, moderation_note, published_at, created_at`;

// Listado completo para administración: pendientes, publicadas y archivadas
router.get('/admin/list', async (req, res) => {
  try {
    const status = clean(req.query.status, 20);
    const q = clean(req.query.q);
    const validStatus = new Set(['pending', 'published', 'rejected', 'archived']);
    if (status && !validStatus.has(status)) return res.status(400).json({ ok: false, error: 'Estado no válido' });

    const jobsParams = [];
    let jobsWhere = 'TRUE';
    if (status) { jobsParams.push(status); jobsWhere = `status = $${jobsParams.length}`; }
    if (q) {
      jobsParams.push(`%${q}%`);
      jobsWhere += ` AND (cargo ILIKE $${jobsParams.length} OR empresa ILIKE $${jobsParams.length} OR ciudad ILIKE $${jobsParams.length})`;
    }
    const talentParams = [];
    let talentWhere = 'TRUE';
    if (status) { talentParams.push(status); talentWhere = `status = $${talentParams.length}`; }
    if (q) {
      talentParams.push(`%${q}%`);
      talentWhere += ` AND (display_name ILIKE $${talentParams.length} OR title ILIKE $${talentParams.length})`;
    }

    const [jobsResult, talentResult] = await Promise.all([
      pool.query(`SELECT ${JOBS_SELECT} FROM community_jobs WHERE ${jobsWhere} ORDER BY created_at DESC LIMIT 200`, jobsParams),
      pool.query(`SELECT ${TALENT_SELECT} FROM talent_profiles WHERE ${talentWhere} ORDER BY created_at DESC LIMIT 200`, talentParams),
    ]);
    return res.json({ ok: true, data: { jobs: jobsResult.rows, talent: talentResult.rows } });
  } catch (error) {
    return fail(res, 'No fue posible cargar el listado administrativo', error);
  }
});

router.get('/admin/pending', async (req, res) => {
  try {
    const [jobsResult, talentResult] = await Promise.all([
      pool.query(`SELECT ${JOBS_SELECT} FROM community_jobs WHERE status = 'pending' ORDER BY created_at DESC LIMIT 100`),
      pool.query(`SELECT ${TALENT_SELECT} FROM talent_profiles WHERE status = 'pending' ORDER BY created_at DESC LIMIT 100`),
    ]);
    return res.json({
      ok: true,
      data: {
        jobs: jobsResult.rows,
        talent: talentResult.rows,
      },
    });
  } catch (error) {
    return fail(res, 'No fue posible cargar la bandeja de moderación', error);
  }
});

router.post('/admin/:type/:id/:action', async (req, res) => {
  const config = MODERATION_TYPES[req.params.type];
  if (!config) return res.status(404).json({ ok: false, error: 'Tipo no válido' });

  const action = req.params.action;
  const VALID_ACTIONS = new Set(['approve', 'reject', 'archive', 'restore']);
  if (!VALID_ACTIONS.has(action)) return res.status(400).json({ ok: false, error: 'Acción no válida' });

  const note = clean(req.body?.note, 500);
  const statusMap = { approve: 'published', reject: 'rejected', archive: 'archived', restore: 'published' };
  const nextStatus = statusMap[action];

  try {
    const idResult = await pool.query(`SELECT id, slug FROM ${config.table} WHERE id = $1`, [req.params.id]);
    if (!idResult.rows[0]) return res.status(404).json({ ok: false, error: 'Registro no encontrado' });

    const result = await pool.query(
      `UPDATE ${config.table} SET status = $1, published_at = CASE WHEN $1 = 'published' THEN COALESCE(published_at, NOW()) ELSE published_at END, moderation_note = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [nextStatus, note || null, req.params.id],
    );

    await pool.query(
      `INSERT INTO moderation_logs (moderator, resource_type, resource_id, action, note, meta)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)`,
      ['admin', config.resourceType, req.params.id, action, note || null, JSON.stringify({ label: result.rows[0][config.label] || '', ip: result.rows[0].ip_address || null })],
    );

    return res.json({ ok: true, data: result.rows[0] });
  } catch (error) {
    return fail(res, 'No fue posible aplicar la acción de moderación', error);
  }
});

router.delete('/admin/:type/:id', async (req, res) => {
  const config = MODERATION_TYPES[req.params.type];
  if (!config) return res.status(404).json({ ok: false, error: 'Tipo no válido' });

  try {
    const idResult = await pool.query(`SELECT ${config.label} AS label FROM ${config.table} WHERE id = $1`, [req.params.id]);
    if (!idResult.rows[0]) return res.status(404).json({ ok: false, error: 'Registro no encontrado' });

    await pool.query(`DELETE FROM ${config.table} WHERE id = $1`, [req.params.id]);
    await pool.query(
      `INSERT INTO moderation_logs (moderator, resource_type, resource_id, action, meta)
       VALUES ($1, $2, $3, 'hard_delete', $4::jsonb)`,
      ['ADMIN', config.resourceType, req.params.id, JSON.stringify({ label: idResult.rows[0].label || '' })],
    );
    return res.json({ ok: true, deleted: true });
  } catch (error) {
    return fail(res, 'No fue posible eliminar el registro', error);
  }
});

router.get('/admin/logs', async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 50, 1), 200);
    const result = await pool.query(
      `SELECT id, moderator, resource_type, resource_id, action, note, meta, created_at
       FROM moderation_logs ORDER BY created_at DESC LIMIT $1`,
      [limit],
    );
    return res.json({ ok: true, data: result.rows });
  } catch (error) {
    return fail(res, 'No fue posible cargar el registro de auditoría', error);
  }
});

export default router;

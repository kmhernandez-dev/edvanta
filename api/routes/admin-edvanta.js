import { Router } from 'express';
import { pool } from '../db.js';
import { adminMiddleware } from '../lib/auth.js';

const router = Router();

router.use(adminMiddleware);

const entityConfig = {
  careers: {
    table: 'careers',
    columns: ['id', 'family_id', 'slug', 'name', 'headline', 'summary', 'what_it_is', 'recommended_profile', 'entry_guidance', 'responsibilities', 'workplaces', 'status', 'featured', 'coming_soon', 'sort_order', 'seo_title', 'seo_description', 'published_at', 'verified_at', 'updated_at'],
    writable: ['family_id', 'slug', 'name', 'headline', 'summary', 'what_it_is', 'recommended_profile', 'entry_guidance', 'responsibilities', 'workplaces', 'status', 'featured', 'coming_soon', 'sort_order', 'seo_title', 'seo_description', 'published_at', 'verified_at'],
    required: ['slug', 'name', 'summary'],
    search: ['slug', 'name', 'headline', 'summary'],
    order: 'sort_order ASC, name ASC',
  },
  skills: {
    table: 'skills',
    columns: ['id', 'parent_skill_id', 'slug', 'name', 'skill_type', 'description', 'status', 'updated_at'],
    writable: ['parent_skill_id', 'slug', 'name', 'skill_type', 'description', 'status'],
    required: ['slug', 'name'],
    search: ['slug', 'name', 'description'],
    order: 'name ASC',
  },
  courses: {
    table: 'courses',
    columns: ['id', 'title', 'slug', 'short_description', 'provider', 'original_url', 'affiliate_url', 'category', 'professional_area', 'language', 'level', 'price_type', 'certificate_available', 'certificate_included', 'duration', 'image_url', 'featured', 'trending', 'active', 'updated_at'],
    writable: ['title', 'slug', 'short_description', 'full_description', 'provider', 'provider_course_id', 'original_url', 'affiliate_url', 'category', 'subcategory', 'professional_area', 'language', 'level', 'modality', 'price_type', 'current_price', 'original_price', 'currency', 'discount_percentage', 'certificate_available', 'certificate_included', 'duration', 'image_url', 'instructor', 'institution', 'skills', 'learning_outcomes', 'requirements', 'featured', 'trending', 'active', 'published_at'],
    required: ['title', 'slug', 'provider'],
    search: ['slug', 'title', 'provider', 'category'],
    order: 'updated_at DESC, title ASC',
  },
  'learning-paths': {
    table: 'learning_paths',
    columns: ['id', 'career_id', 'slug', 'name', 'summary', 'audience', 'status', 'icon', 'outcomes', 'estimated_duration', 'level', 'featured', 'seo_title', 'seo_description', 'updated_at'],
    writable: ['career_id', 'slug', 'name', 'summary', 'audience', 'status', 'icon', 'outcomes', 'estimated_duration', 'level', 'featured', 'seo_title', 'seo_description'],
    required: ['slug', 'name'],
    search: ['slug', 'name', 'summary'],
    order: 'featured DESC, name ASC',
  },
  'learning-path-steps': {
    table: 'learning_path_steps',
    columns: ['id', 'learning_path_id', 'course_id', 'skill_id', 'title', 'description', 'step_order', 'step_type', 'is_optional', 'course_ids', 'resource_ids', 'project_id'],
    writable: ['learning_path_id', 'course_id', 'skill_id', 'title', 'description', 'step_order', 'step_type', 'is_optional', 'course_ids', 'resource_ids', 'project_id'],
    required: ['learning_path_id', 'title', 'step_order'],
    search: ['title', 'description'],
    order: 'learning_path_id, step_order ASC',
    touchUpdatedAt: false,
  },
  'affiliate-links': {
    table: 'affiliate_links',
    columns: ['id', 'course_id', 'provider', 'original_url', 'affiliate_url', 'campaign', 'sub_id', 'source_path', 'source_type', 'status', 'first_seen_at', 'last_verified_at', 'updated_at'],
    writable: ['course_id', 'provider', 'original_url', 'affiliate_url', 'campaign', 'sub_id', 'source_path', 'source_type', 'status', 'last_verified_at'],
    required: ['course_id', 'provider', 'affiliate_url'],
    search: ['provider', 'affiliate_url', 'source_path'],
    order: 'updated_at DESC',
  },
};

const relationConfig = {
  'career-skill': {
    table: 'career_skills',
    keys: ['career_id', 'skill_id'],
    writable: ['career_id', 'skill_id', 'importance', 'required_level', 'is_core', 'sort_order', 'editorial_note'],
    update: ['importance', 'required_level', 'is_core', 'sort_order', 'editorial_note'],
  },
  'course-skill': {
    table: 'course_skills',
    keys: ['course_id', 'skill_id'],
    writable: ['course_id', 'skill_id', 'coverage', 'relevance', 'primary_skill', 'review_status', 'source'],
    update: ['coverage', 'relevance', 'primary_skill', 'review_status', 'source'],
  },
  'career-course': {
    table: 'career_course_recommendations',
    keys: ['career_id', 'course_id'],
    writable: ['career_id', 'course_id', 'priority', 'reason', 'status'],
    update: ['priority', 'reason', 'status'],
  },
};

function cleanPayload(body, allowed) {
  return Object.fromEntries(
    Object.entries(body || {}).filter(([key, value]) => allowed.includes(key) && value !== undefined),
  );
}

function getEntity(entity) {
  return entityConfig[entity] || null;
}

router.get('/summary', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM careers) AS careers,
        (SELECT COUNT(*)::int FROM skills) AS skills,
        (SELECT COUNT(*)::int FROM courses) AS courses,
        (SELECT COUNT(*)::int FROM learning_paths) AS learning_paths,
        (SELECT COUNT(*)::int FROM affiliate_links WHERE status = 'active') AS active_affiliate_links,
        (SELECT COUNT(*)::int FROM career_skills) AS career_skill_relations,
        (SELECT COUNT(*)::int FROM course_skills) AS course_skill_relations
    `);
    res.json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'No fue posible cargar el resumen editorial.' });
  }
});

router.get('/relationships/:relation', async (req, res) => {
  const config = relationConfig[req.params.relation];
  if (!config) return res.status(404).json({ error: 'Relación no disponible.' });
  try {
    const { rows } = await pool.query(`SELECT * FROM ${config.table} ORDER BY ${config.keys.join(', ')} LIMIT 500`);
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'No fue posible cargar las relaciones.' });
  }
});

router.put('/relationships/:relation', async (req, res) => {
  const config = relationConfig[req.params.relation];
  if (!config) return res.status(404).json({ error: 'Relación no disponible.' });
  const payload = cleanPayload(req.body, config.writable);
  const missing = config.keys.filter(key => payload[key] === undefined || payload[key] === null || payload[key] === '');
  if (missing.length) return res.status(400).json({ error: `Faltan campos: ${missing.join(', ')}` });

  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, index) => `$${index + 1}`);
  const updates = config.update.filter(column => columns.includes(column));
  const conflictAction = updates.length
    ? `DO UPDATE SET ${updates.map(column => `${column} = EXCLUDED.${column}`).join(', ')}`
    : 'DO NOTHING';
  try {
    const { rows } = await pool.query(
      `INSERT INTO ${config.table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) ON CONFLICT (${config.keys.join(', ')}) ${conflictAction} RETURNING *`,
      values,
    );
    res.json({ data: rows[0] || payload });
  } catch (error) {
    res.status(400).json({ error: 'No fue posible guardar la relación.' });
  }
});

router.get('/:entity', async (req, res) => {
  const config = getEntity(req.params.entity);
  if (!config) return res.status(404).json({ error: 'Entidad no disponible.' });

  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 500);
  const search = String(req.query.search || '').trim();
  const params = [];
  const clauses = [];
  if (search && config.search.length) {
    params.push(`%${search}%`);
    clauses.push(`(${config.search.map(column => `COALESCE(${column}::text, '') ILIKE $1`).join(' OR ')})`);
  }
  params.push(limit);
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  try {
    const { rows } = await pool.query(
      `SELECT ${config.columns.join(', ')} FROM ${config.table} ${where} ORDER BY ${config.order} LIMIT $${params.length}`,
      params,
    );
    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({ error: 'No fue posible cargar el contenido editorial.' });
  }
});

router.post('/:entity', async (req, res) => {
  const config = getEntity(req.params.entity);
  if (!config) return res.status(404).json({ error: 'Entidad no disponible.' });
  const payload = cleanPayload(req.body, config.writable);
  const missing = config.required.filter(key => payload[key] === undefined || payload[key] === null || payload[key] === '');
  if (missing.length) return res.status(400).json({ error: `Faltan campos: ${missing.join(', ')}` });
  const columns = Object.keys(payload);
  const values = Object.values(payload);
  const placeholders = columns.map((_, index) => `$${index + 1}`);
  try {
    const { rows } = await pool.query(
      `INSERT INTO ${config.table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING ${config.columns.join(', ')}`,
      values,
    );
    res.status(201).json({ data: rows[0] });
  } catch (error) {
    res.status(400).json({ error: 'No fue posible crear el registro. Revisa los campos y valores únicos.' });
  }
});

router.patch('/:entity/:id', async (req, res) => {
  const config = getEntity(req.params.entity);
  if (!config) return res.status(404).json({ error: 'Entidad no disponible.' });
  const payload = cleanPayload(req.body, config.writable);
  const columns = Object.keys(payload);
  if (!columns.length) return res.status(400).json({ error: 'No hay cambios permitidos.' });
  const values = Object.values(payload);
  const assignments = columns.map((column, index) => `${column} = $${index + 1}`);
  const touchUpdatedAt = config.touchUpdatedAt === false ? '' : ', updated_at = NOW()';
  values.push(req.params.id);
  try {
    const { rows } = await pool.query(
      `UPDATE ${config.table} SET ${assignments.join(', ')}${touchUpdatedAt} WHERE id = $${values.length} RETURNING ${config.columns.join(', ')}`,
      values,
    );
    if (!rows[0]) return res.status(404).json({ error: 'Registro no encontrado.' });
    res.json({ data: rows[0] });
  } catch (error) {
    res.status(400).json({ error: 'No fue posible actualizar el registro.' });
  }
});

export default router;

/**
 * ============================================================
 *  routes/courses.js — API pública de cursos multi-plataforma
 *
 *  GET /api/courses
 *    Query params:
 *      q          texto de búsqueda
 *      provider   edutin | coursera | udemy
 *      category   categoría
 *      professional_area
 *      career     slug de carrera
 *      skill      slug de competencia
 *      language
 *      level
 *      price_type
 *      certificate_available  true | false
 *      featured    true | false
 *      trending    true | false
 *      page        número (default 1)
 *      limit       resultados por página (default 20, max 100)
 *
 *  GET /api/courses/:slug
 *    Devuelve un curso individual con cursos relacionados.
 *
 *  GET /api/courses/filters/options
 *    Devuelve las opciones disponibles para cada filtro.
 * ============================================================
 */
import { pool } from '../db.js';

const ALLOWED_PROVIDERS = ['edutin', 'coursera', 'udemy'];
const ALLOWED_PRICE_TYPES = ['free', 'free_audit', 'paid', 'subscription', 'financial_aid', 'unknown'];
const ALLOWED_LEVELS = ['beginner', 'intermediate', 'advanced', 'mixed', 'unknown'];
const validSlug = value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '');

function sanitizeText(val) {
  if (!val || typeof val !== 'string') return '';
  return val.trim().slice(0, 200);
}

function parseBool(val) {
  if (val === 'true' || val === '1') return true;
  if (val === 'false' || val === '0') return false;
  return undefined;
}

export async function listCoursesRoute(req, res) {
  try {
    const q = sanitizeText(req.query.q);
    const provider = req.query.provider;
    const category = sanitizeText(req.query.category);
    const professionalArea = sanitizeText(req.query.professional_area);
    const career = sanitizeText(req.query.career);
    const skill = sanitizeText(req.query.skill);
    const language = sanitizeText(req.query.language);
    const level = req.query.level;
    const priceType = req.query.price_type;
    const certificateAvailable = parseBool(req.query.certificate_available);
    const featured = parseBool(req.query.featured);
    const trending = parseBool(req.query.trending);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const conditions = ['c.active = true'];
    const params = [];
    let paramIdx = 1;

    if (q) {
      conditions.push(`(
        c.title ILIKE $${paramIdx}
        OR c.short_description ILIKE $${paramIdx}
        OR c.category ILIKE $${paramIdx}
        OR c.subcategory ILIKE $${paramIdx}
        OR c.instructor ILIKE $${paramIdx}
        OR c.institution ILIKE $${paramIdx}
        OR EXISTS (SELECT 1 FROM unnest(c.skills) skill WHERE skill ILIKE $${paramIdx})
      )`);
      params.push(`%${q}%`);
      paramIdx++;
    }

    if (provider && ALLOWED_PROVIDERS.includes(provider)) {
      conditions.push(`c.provider = $${paramIdx}`);
      params.push(provider);
      paramIdx++;
    }

    if (category) {
      conditions.push(`c.category = $${paramIdx}`);
      params.push(category);
      paramIdx++;
    }

    if (professionalArea) {
      conditions.push(`c.professional_area = $${paramIdx}`);
      params.push(professionalArea);
      paramIdx++;
    }

    if (career) {
      if (!validSlug(career)) return res.status(400).json({ ok: false, error: 'Carrera no valida' });
      conditions.push(`(
        EXISTS (
          SELECT 1
          FROM career_course_recommendations editorial
          JOIN careers selected_career ON selected_career.id = editorial.career_id
          WHERE editorial.course_id = c.id
            AND editorial.status = 'published'
            AND selected_career.slug = $${paramIdx}
        )
        OR EXISTS (
          SELECT 1
          FROM course_skills taught
          JOIN career_skills required ON required.skill_id = taught.skill_id
          JOIN careers selected_career ON selected_career.id = required.career_id
          WHERE taught.course_id = c.id
            AND taught.review_status = 'verified'
            AND selected_career.slug = $${paramIdx}
        )
      )`);
      params.push(career);
      paramIdx++;
    }

    if (skill) {
      if (!validSlug(skill)) return res.status(400).json({ ok: false, error: 'Competencia no valida' });
      conditions.push(`EXISTS (
        SELECT 1
        FROM course_skills taught
        JOIN skills selected_skill ON selected_skill.id = taught.skill_id
        WHERE taught.course_id = c.id
          AND taught.review_status IN ('verified', 'pending')
          AND selected_skill.slug = $${paramIdx}
      )`);
      params.push(skill);
      paramIdx++;
    }

    if (language) {
      conditions.push(`c.language ILIKE $${paramIdx}`);
      params.push(`%${language}%`);
      paramIdx++;
    }

    if (level && ALLOWED_LEVELS.includes(level)) {
      conditions.push(`c.level = $${paramIdx}`);
      params.push(level);
      paramIdx++;
    }

    if (priceType && ALLOWED_PRICE_TYPES.includes(priceType)) {
      conditions.push(`c.price_type = $${paramIdx}`);
      params.push(priceType);
      paramIdx++;
    }

    if (certificateAvailable !== undefined) {
      conditions.push(`c.certificate_available = $${paramIdx}`);
      params.push(certificateAvailable);
      paramIdx++;
    }

    if (featured !== undefined) {
      conditions.push(`c.featured = $${paramIdx}`);
      params.push(featured);
      paramIdx++;
    }

    if (trending !== undefined) {
      conditions.push(`c.trending = $${paramIdx}`);
      params.push(trending);
      paramIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*)::int AS total FROM courses c ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = countResult.rows[0].total;

    const dataQuery = `
      SELECT
        c.id, c.title, c.slug, c.short_description, c.provider,
        c.provider_course_id, c.original_url, c.affiliate_url,
        c.category, c.subcategory, c.professional_area,
        c.language, c.level, c.modality, c.price_type,
        c.current_price, c.original_price, c.currency, c.discount_percentage,
        c.certificate_available, c.certificate_included,
        c.duration, c.rating, c.review_count, c.student_count,
        c.image_url, c.instructor, c.institution,
        c.skills, c.featured, c.trending,
        c.published_at, c.created_at
      FROM courses c
      ${whereClause}
      ORDER BY c.featured DESC, c.trending DESC, c.created_at DESC
      LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
    `;
    params.push(limit, offset);

    const dataResult = await pool.query(dataQuery, params);

    return res.json({
      ok: true,
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error listando cursos', error: e.message, code: e.code }));
    return res.status(500).json({ ok: false, error: 'Error interno al listar cursos' });
  }
}

export async function getCourseBySlugRoute(req, res) {
  try {
    const { slug } = req.params;
    if (!slug) return res.status(400).json({ ok: false, error: 'Slug requerido' });

    const result = await pool.query(
      `SELECT * FROM courses WHERE slug = $1 AND active = true`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'Curso no encontrado' });
    }

    const course = result.rows[0];

    // Cursos relacionados: misma categoría o misma área profesional
    const related = await pool.query(
      `SELECT id, title, slug, short_description, provider, category, level, price_type,
              image_url, institution, instructor, rating, duration, featured
       FROM courses
       WHERE active = true
         AND id != $1
         AND (category = $2 OR professional_area = $3)
       ORDER BY featured DESC, rating DESC NULLS LAST
       LIMIT 6`,
      [course.id, course.category, course.professional_area]
    );

    return res.json({
      ok: true,
      data: course,
      related: related.rows,
    });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error obteniendo curso', error: e.message, code: e.code }));
    return res.status(500).json({ ok: false, error: 'Error interno al obtener curso' });
  }
}

export async function getFilterOptionsRoute(_req, res) {
  try {
    const [providers, categories, areas, languages, levels, priceTypes, careers, skills] = await Promise.all([
      pool.query(`SELECT DISTINCT provider FROM courses WHERE active = true ORDER BY provider`),
      pool.query(`SELECT DISTINCT category FROM courses WHERE active = true AND category IS NOT NULL ORDER BY category`),
      pool.query(`SELECT DISTINCT professional_area FROM courses WHERE active = true AND professional_area IS NOT NULL ORDER BY professional_area`),
      pool.query(`SELECT DISTINCT language FROM courses WHERE active = true AND language IS NOT NULL ORDER BY language`),
      pool.query(`SELECT DISTINCT level FROM courses WHERE active = true AND level IS NOT NULL ORDER BY level`),
      pool.query(`SELECT DISTINCT price_type FROM courses WHERE active = true AND price_type IS NOT NULL ORDER BY price_type`),
      pool.query(`SELECT slug, name FROM careers WHERE status = 'published' ORDER BY sort_order, name`),
      pool.query(`
        SELECT DISTINCT skill.slug, skill.name
        FROM skills skill
        JOIN course_skills mapped ON mapped.skill_id = skill.id
        JOIN courses course ON course.id = mapped.course_id AND course.active = TRUE
        WHERE skill.status = 'published'
        ORDER BY skill.name
      `),
    ]);

    return res.json({
      ok: true,
      data: {
        providers: providers.rows.map(r => r.provider),
        categories: categories.rows.map(r => r.category),
        professional_areas: areas.rows.map(r => r.professional_area),
        languages: languages.rows.map(r => r.language),
        levels: levels.rows.map(r => r.level),
        price_types: priceTypes.rows.map(r => r.price_type),
        careers: careers.rows,
        skills: skills.rows,
      },
    });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error obteniendo opciones de filtros', error: e.message }));
    return res.status(500).json({ ok: false, error: 'Error interno' });
  }
}

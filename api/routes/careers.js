/**
 * API publica del explorador profesional de Edvanta.
 * Las escrituras quedan reservadas para una futura capa administrativa.
 */
import { pool } from '../db.js';

const cleanText = value => typeof value === 'string' ? value.trim().slice(0, 120) : '';
const validSlug = value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '');

const careerSelect = `
  c.id,
  c.slug,
  c.name,
  c.headline,
  c.summary,
  c.what_it_is,
  c.recommended_profile,
  c.entry_guidance,
  c.responsibilities,
  c.workplaces,
  c.featured,
  c.coming_soon,
  c.sort_order,
  c.seo_title,
  c.seo_description,
  c.published_at,
  c.verified_at,
  jsonb_build_object(
    'slug', f.slug,
    'name', f.name,
    'description', f.description
  ) AS family,
  COALESCE(skill_data.items, '[]'::jsonb) AS skills
`;

const skillsLateral = `
  LEFT JOIN LATERAL (
    SELECT jsonb_agg(
      jsonb_build_object(
        'slug', s.slug,
        'name', s.name,
        'type', s.skill_type,
        'description', s.description,
        'importance', cs.importance,
        'required_level', cs.required_level,
        'is_core', cs.is_core
      ) ORDER BY cs.sort_order, s.name
    ) AS items
    FROM career_skills cs
    JOIN skills s ON s.id = cs.skill_id AND s.status = 'published'
    WHERE cs.career_id = c.id
  ) skill_data ON TRUE
`;

export async function listCareersRoute(req, res) {
  try {
    const q = cleanText(req.query.q);
    const family = cleanText(req.query.family);
    const conditions = ["c.status = 'published'", "f.status = 'published'"];
    const params = [];

    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(
        c.name ILIKE $${params.length}
        OR c.headline ILIKE $${params.length}
        OR c.summary ILIKE $${params.length}
        OR f.name ILIKE $${params.length}
        OR EXISTS (
          SELECT 1
          FROM career_skills search_cs
          JOIN skills search_s ON search_s.id = search_cs.skill_id
          WHERE search_cs.career_id = c.id AND search_s.name ILIKE $${params.length}
        )
      )`);
    }

    if (family) {
      if (!validSlug(family)) return res.status(400).json({ ok: false, error: 'Familia no valida' });
      params.push(family);
      conditions.push(`f.slug = $${params.length}`);
    }

    const result = await pool.query(`
      SELECT ${careerSelect}
      FROM careers c
      JOIN career_families f ON f.id = c.family_id
      ${skillsLateral}
      WHERE ${conditions.join(' AND ')}
      ORDER BY c.featured DESC, c.sort_order, c.name
    `, params);

    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error listando carreras', error: error.message, code: error.code }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar las carreras' });
  }
}

export async function getCareerFiltersRoute(_req, res) {
  try {
    const result = await pool.query(`
      SELECT
        f.slug,
        f.name,
        f.description,
        COUNT(c.id)::int AS career_count
      FROM career_families f
      LEFT JOIN careers c ON c.family_id = f.id AND c.status = 'published'
      WHERE f.status = 'published'
      GROUP BY f.id
      ORDER BY f.sort_order, f.name
    `);
    return res.json({ ok: true, data: result.rows });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error listando familias de carrera', error: error.message, code: error.code }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar las categorias' });
  }
}

export async function getCareerBySlugRoute(req, res) {
  try {
    const { slug } = req.params;
    if (!validSlug(slug)) return res.status(400).json({ ok: false, error: 'Slug no valido' });

    const result = await pool.query(`
      SELECT ${careerSelect}
      FROM careers c
      JOIN career_families f ON f.id = c.family_id
      ${skillsLateral}
      WHERE c.slug = $1 AND c.status = 'published' AND f.status = 'published'
      LIMIT 1
    `, [slug]);

    if (!result.rowCount) {
      return res.status(404).json({ ok: false, error: 'Carrera no encontrada' });
    }

    const career = result.rows[0];
    const [courseResult, pathResult] = await Promise.all([
      pool.query(`
        WITH candidates AS (
          SELECT
            course.id, course.slug, course.title, course.short_description,
            course.provider, course.image_url, course.level, course.duration,
            course.featured, TRUE AS editorial, recommendation.priority,
            0::int AS matching_skills
          FROM career_course_recommendations recommendation
          JOIN courses course ON course.id = recommendation.course_id AND course.active = TRUE
          WHERE recommendation.career_id = $1 AND recommendation.status = 'published'

          UNION ALL

          SELECT
            course.id, course.slug, course.title, course.short_description,
            course.provider, course.image_url, course.level, course.duration,
            course.featured, FALSE AS editorial, 0::smallint AS priority,
            COUNT(DISTINCT mapped.skill_id)::int AS matching_skills
          FROM course_skills mapped
          JOIN career_skills needed ON needed.skill_id = mapped.skill_id AND needed.career_id = $1
          JOIN courses course ON course.id = mapped.course_id AND course.active = TRUE
          WHERE mapped.review_status = 'verified'
          GROUP BY course.id
        )
        SELECT
          id, slug, title, short_description, provider, image_url, level, duration,
          BOOL_OR(editorial) AS editorial,
          MAX(priority)::int AS editorial_priority,
          MAX(matching_skills)::int AS matching_skills
        FROM candidates
        GROUP BY id, slug, title, short_description, provider, image_url, level, duration, featured
        ORDER BY BOOL_OR(editorial) DESC, MAX(priority) DESC, MAX(matching_skills) DESC, featured DESC, title
        LIMIT 6
      `, [career.id]),
      pool.query(`
        SELECT id, slug, name, summary, audience
        FROM learning_paths
        WHERE career_id = $1 AND status = 'published'
        ORDER BY created_at DESC
      `, [career.id]),
    ]);

    return res.json({
      ok: true,
      data: career,
      recommended_courses: courseResult.rows,
      learning_paths: pathResult.rows,
    });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error obteniendo carrera', error: error.message, code: error.code }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar la carrera' });
  }
}

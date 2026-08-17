import { pool } from '../db.js';

const validSlug = value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '');

export async function listLearningPathsRoute(req, res) {
  try {
    const career = typeof req.query.career === 'string' ? req.query.career.trim() : '';
    if (career && !validSlug(career)) {
      return res.status(400).json({ ok: false, error: 'Carrera no valida' });
    }

    const params = [];
    const conditions = ["path.status = 'published'", "career.status = 'published'"];
    if (career) {
      params.push(career);
      conditions.push(`career.slug = $${params.length}`);
    }

    const result = await pool.query(`
      SELECT
        path.id,
        path.slug,
        path.name,
        path.summary,
        path.audience,
        path.icon,
        path.outcomes,
        path.estimated_duration,
        path.level,
        path.featured,
        path.seo_title,
        path.seo_description,
        jsonb_build_object(
          'slug', career.slug,
          'name', career.name,
          'family', family.name
        ) AS career,
        COUNT(step.id)::int AS step_count
      FROM learning_paths path
      JOIN careers career ON career.id = path.career_id
      JOIN career_families family ON family.id = career.family_id
      LEFT JOIN learning_path_steps step ON step.learning_path_id = path.id
      WHERE ${conditions.join(' AND ')}
      GROUP BY path.id, career.id, family.name
      ORDER BY path.featured DESC, career.sort_order, path.name
    `, params);

    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error listando rutas', error: error.message, code: error.code }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar las rutas' });
  }
}

export async function getLearningPathBySlugRoute(req, res) {
  try {
    const { slug } = req.params;
    if (!validSlug(slug)) return res.status(400).json({ ok: false, error: 'Slug no valido' });

    const pathResult = await pool.query(`
      SELECT
        path.*,
        jsonb_build_object(
          'slug', career.slug,
          'name', career.name,
          'headline', career.headline,
          'family', family.name
        ) AS career
      FROM learning_paths path
      JOIN careers career ON career.id = path.career_id AND career.status = 'published'
      JOIN career_families family ON family.id = career.family_id
      WHERE path.slug = $1 AND path.status = 'published'
      LIMIT 1
    `, [slug]);

    if (!pathResult.rowCount) {
      return res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
    }

    const path = pathResult.rows[0];
    const stepResult = await pool.query(`
      SELECT
        step.id,
        step.step_order,
        step.title,
        step.description,
        step.step_type,
        step.is_optional,
        CASE WHEN skill.id IS NULL THEN NULL ELSE jsonb_build_object(
          'slug', skill.slug,
          'name', skill.name,
          'type', skill.skill_type,
          'description', skill.description
        ) END AS skill,
        COALESCE(course_data.items, '[]'::jsonb) AS courses
      FROM learning_path_steps step
      LEFT JOIN skills skill ON skill.id = step.skill_id
      LEFT JOIN LATERAL (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', course.id,
            'slug', course.slug,
            'title', course.title,
            'short_description', course.short_description,
            'provider', course.provider,
            'image_url', course.image_url,
            'duration', course.duration,
            'price_type', course.price_type,
            'certificate_available', course.certificate_available,
            'original_url', course.original_url,
            'affiliate_url', course.affiliate_url
          ) ORDER BY array_position(step.course_ids, course.id)
        ) AS items
        FROM courses course
        WHERE course.active = TRUE
          AND (
            course.id = step.course_id
            OR course.id = ANY(step.course_ids)
          )
      ) course_data ON TRUE
      WHERE step.learning_path_id = $1
      ORDER BY step.step_order
    `, [path.id]);

    return res.json({
      ok: true,
      data: { ...path, steps: stepResult.rows },
    });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error obteniendo ruta', error: error.message, code: error.code }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar la ruta' });
  }
}

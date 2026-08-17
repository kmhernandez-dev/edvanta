import { pool } from '../db.js';

const cleanText = value => typeof value === 'string' ? value.trim().slice(0, 120) : '';
const validSlug = value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || '');
const validTypes = new Set(['technical', 'digital', 'business', 'human']);

export async function listSkillsRoute(req, res) {
  try {
    const q = cleanText(req.query.q);
    const type = cleanText(req.query.type);
    const career = cleanText(req.query.career);
    const conditions = ["skill.status = 'published'"];
    const params = [];

    if (q) {
      params.push(`%${q}%`);
      conditions.push(`(skill.name ILIKE $${params.length} OR skill.description ILIKE $${params.length})`);
    }
    if (type) {
      if (!validTypes.has(type)) return res.status(400).json({ ok: false, error: 'Tipo no valido' });
      params.push(type);
      conditions.push(`skill.skill_type = $${params.length}`);
    }
    if (career) {
      if (!validSlug(career)) return res.status(400).json({ ok: false, error: 'Carrera no valida' });
      params.push(career);
      conditions.push(`EXISTS (
        SELECT 1
        FROM career_skills required
        JOIN careers selected_career ON selected_career.id = required.career_id
        WHERE required.skill_id = skill.id AND selected_career.slug = $${params.length}
      )`);
    }

    const result = await pool.query(`
      SELECT
        skill.id,
        skill.slug,
        skill.name,
        skill.skill_type,
        skill.description,
        COUNT(DISTINCT required.career_id)::int AS career_count,
        COUNT(DISTINCT taught.course_id) FILTER (
          WHERE taught.review_status = 'verified' AND course.active = TRUE
        )::int AS verified_course_count
      FROM skills skill
      LEFT JOIN career_skills required ON required.skill_id = skill.id
      LEFT JOIN course_skills taught ON taught.skill_id = skill.id
      LEFT JOIN courses course ON course.id = taught.course_id
      WHERE ${conditions.join(' AND ')}
      GROUP BY skill.id
      ORDER BY career_count DESC, verified_course_count DESC, skill.name
    `, params);

    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error listando competencias', error: error.message, code: error.code }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar las competencias' });
  }
}

export async function getSkillBySlugRoute(req, res) {
  try {
    const { slug } = req.params;
    if (!validSlug(slug)) return res.status(400).json({ ok: false, error: 'Slug no valido' });

    const skillResult = await pool.query(`
      SELECT id, slug, name, skill_type, description
      FROM skills
      WHERE slug = $1 AND status = 'published'
      LIMIT 1
    `, [slug]);
    if (!skillResult.rowCount) return res.status(404).json({ ok: false, error: 'Competencia no encontrada' });

    const skill = skillResult.rows[0];
    const [careerResult, courseResult, pathResult] = await Promise.all([
      pool.query(`
        SELECT
          career.slug, career.name, career.headline, family.name AS family,
          required.importance, required.required_level, required.is_core
        FROM career_skills required
        JOIN careers career ON career.id = required.career_id AND career.status = 'published'
        JOIN career_families family ON family.id = career.family_id
        WHERE required.skill_id = $1
        ORDER BY required.importance DESC, required.is_core DESC, career.sort_order
      `, [skill.id]),
      pool.query(`
        SELECT
          course.id, course.slug, course.title, course.short_description,
          course.provider, course.image_url, course.duration, course.level,
          course.price_type, course.certificate_available,
          mapped.coverage, mapped.relevance, mapped.primary_skill
        FROM course_skills mapped
        JOIN courses course ON course.id = mapped.course_id AND course.active = TRUE
        WHERE mapped.skill_id = $1 AND mapped.review_status = 'verified'
        ORDER BY mapped.primary_skill DESC, mapped.relevance DESC, course.featured DESC, course.title
        LIMIT 12
      `, [skill.id]),
      pool.query(`
        SELECT DISTINCT path.slug, path.name, path.summary, path.estimated_duration, step.step_order
        FROM learning_path_steps step
        JOIN learning_paths path ON path.id = step.learning_path_id AND path.status = 'published'
        WHERE step.skill_id = $1
        ORDER BY path.name, step.step_order
      `, [skill.id]),
    ]);

    return res.json({
      ok: true,
      data: skill,
      careers: careerResult.rows,
      courses: courseResult.rows,
      learning_paths: pathResult.rows,
    });
  } catch (error) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error obteniendo competencia', error: error.message, code: error.code }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar la competencia' });
  }
}

import { pool } from '../db.js';

const clean = (value, max = 100) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const opportunityTypes = new Set(['job', 'internship', 'trainee', 'scholarship', 'research', 'project', 'event', 'volunteer', 'freelance', 'challenge']);
const remoteTypes = new Set(['onsite', 'hybrid', 'remote', 'unspecified']);

function fail(res, message, error) {
  console.error(JSON.stringify({ level: 'error', msg: message, error: error.message, code: error.code }));
  return res.status(500).json({ ok: false, error: message });
}

export async function listOpportunitiesRoute(req, res) {
  try {
    const type = clean(req.query.type);
    const country = clean(req.query.country);
    const remote = clean(req.query.remote);
    const career = clean(req.query.career);
    const skill = clean(req.query.skill);
    const conditions = ["opportunity.status = 'published'", 'opportunity.verified_at IS NOT NULL', '(opportunity.deadline IS NULL OR opportunity.deadline >= NOW())'];
    const params = [];

    if (type) {
      if (!opportunityTypes.has(type)) return res.status(400).json({ ok: false, error: 'Tipo de oportunidad no válido' });
      params.push(type); conditions.push(`opportunity.opportunity_type = $${params.length}`);
    }
    if (country) {
      if (!/^[A-Za-z]{2}$/.test(country)) return res.status(400).json({ ok: false, error: 'País no válido' });
      params.push(country.toUpperCase()); conditions.push(`country.iso_code = $${params.length}`);
    }
    if (remote) {
      if (!remoteTypes.has(remote)) return res.status(400).json({ ok: false, error: 'Modalidad no válida' });
      params.push(remote); conditions.push(`opportunity.remote_type = $${params.length}`);
    }
    if (career) {
      if (!slugPattern.test(career)) return res.status(400).json({ ok: false, error: 'Carrera no válida' });
      params.push(career); conditions.push(`EXISTS (SELECT 1 FROM opportunity_careers oc JOIN careers c ON c.id = oc.career_id WHERE oc.opportunity_id = opportunity.id AND c.slug = $${params.length})`);
    }
    if (skill) {
      if (!slugPattern.test(skill)) return res.status(400).json({ ok: false, error: 'Competencia no válida' });
      params.push(skill); conditions.push(`EXISTS (SELECT 1 FROM opportunity_skills os JOIN skills s ON s.id = os.skill_id WHERE os.opportunity_id = opportunity.id AND s.slug = $${params.length})`);
    }

    const result = await pool.query(`
      SELECT opportunity.id, opportunity.slug, opportunity.opportunity_type, opportunity.title,
             opportunity.organization_name, opportunity.description, opportunity.city,
             opportunity.remote_type, opportunity.experience_level, opportunity.application_url,
             opportunity.deadline, opportunity.source_name, opportunity.source_url,
             opportunity.featured, opportunity.verified_at, opportunity.published_at,
             jsonb_build_object('slug', company.slug, 'name', company.name, 'logo_url', company.logo_url) AS company,
             jsonb_build_object('code', country.iso_code, 'name', country.name) AS country
      FROM opportunities opportunity
      LEFT JOIN companies company ON company.id = opportunity.company_id
      LEFT JOIN countries country ON country.id = opportunity.country_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY opportunity.featured DESC, opportunity.published_at DESC, opportunity.deadline NULLS LAST
      LIMIT 100
    `, params);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible cargar las oportunidades', error);
  }
}

export async function listCompaniesRoute(req, res) {
  try {
    const q = clean(req.query.q);
    const country = clean(req.query.country);
    const conditions = ["company.status = 'published'", 'company.verified = TRUE', 'company.verified_at IS NOT NULL'];
    const params = [];
    if (q) { params.push(`%${q}%`); conditions.push(`(company.name ILIKE $${params.length} OR company.description ILIKE $${params.length})`); }
    if (country) { params.push(country.toUpperCase()); conditions.push(`country.iso_code = $${params.length}`); }
    const result = await pool.query(`
      SELECT company.id, company.slug, company.name, company.logo_url, company.website_url,
             company.description, company.size_range, company.verified_at,
             jsonb_build_object('slug', sector.slug, 'name', sector.name) AS industry,
             jsonb_build_object('code', country.iso_code, 'name', country.name) AS country
      FROM companies company
      LEFT JOIN industry_sectors sector ON sector.id = company.industry_sector_id
      LEFT JOIN countries country ON country.id = company.country_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY company.name
      LIMIT 100
    `, params);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible cargar las empresas', error);
  }
}

export async function listProjectsRoute(req, res) {
  try {
    const type = clean(req.query.type);
    const params = [];
    const conditions = ["project.status IN ('published', 'active')", 'project.verified_at IS NOT NULL'];
    if (type) { params.push(type); conditions.push(`project.project_type = $${params.length}`); }
    const result = await pool.query(`
      SELECT project.id, project.slug, project.title, project.description, project.project_type,
             project.difficulty, project.participants_limit, project.remote,
             project.educational_disclosure, project.application_url, project.status,
             project.verified_at, company.name AS company_name,
             jsonb_build_object('code', country.iso_code, 'name', country.name) AS country
      FROM projects project
      LEFT JOIN companies company ON company.id = project.company_id
      LEFT JOIN countries country ON country.id = project.country_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY project.status = 'active' DESC, project.verified_at DESC
      LIMIT 100
    `, params);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible cargar los proyectos', error);
  }
}

export async function listGroupsRoute(req, res) {
  try {
    const type = clean(req.query.type);
    const params = [];
    const conditions = ["group_item.status = 'published'", 'group_item.verified_at IS NOT NULL'];
    if (type) { params.push(type); conditions.push(`group_item.group_type = $${params.length}`); }
    const result = await pool.query(`
      SELECT group_item.id, group_item.slug, group_item.name, group_item.description,
             group_item.group_type, group_item.remote, group_item.join_url, group_item.verified_at,
             career.slug AS career_slug, career.name AS career_name,
             jsonb_build_object('code', country.iso_code, 'name', country.name) AS country
      FROM professional_groups group_item
      LEFT JOIN careers career ON career.id = group_item.career_id
      LEFT JOIN countries country ON country.id = group_item.country_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY group_item.verified_at DESC, group_item.name
      LIMIT 100
    `, params);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible cargar los grupos', error);
  }
}

export async function listCertificationsRoute(req, res) {
  try {
    const result = await pool.query(`
      SELECT certification.id, certification.slug, certification.name, certification.provider_name,
             certification.summary, certification.official_url, certification.level,
             certification.language, certification.editorial_note, certification.verified_at,
             jsonb_build_object('code', country.iso_code, 'name', country.name) AS country
      FROM certifications certification
      LEFT JOIN countries country ON country.id = certification.country_id
      WHERE certification.status = 'published' AND certification.verified_at IS NOT NULL
      ORDER BY certification.name
      LIMIT 100
    `);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible cargar las certificaciones', error);
  }
}

export async function listResourcesRoute(req, res) {
  try {
    const type = clean(req.query.type);
    const params = [];
    const conditions = ["resource.status = 'published'"];
    if (type) { params.push(type); conditions.push(`resource.resource_type = $${params.length}`); }
    const result = await pool.query(`
      SELECT resource.id, resource.slug, resource.title, resource.resource_type, resource.excerpt,
             resource.source_url, resource.author_name, resource.published_at, resource.updated_at,
             jsonb_build_object('code', country.iso_code, 'name', country.name) AS country
      FROM professional_resources resource
      LEFT JOIN countries country ON country.id = resource.country_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY resource.published_at DESC NULLS LAST, resource.updated_at DESC
      LIMIT 100
    `, params);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible cargar los recursos', error);
  }
}

export async function globalSearchRoute(req, res) {
  try {
    const q = clean(req.query.q, 80);
    if (q.length < 2) return res.json({ ok: true, data: [], total: 0 });
    const pattern = `%${q}%`;
    const result = await pool.query(`
      (SELECT 'career' AS result_type, slug, name AS title, headline AS excerpt, '/carreras/' || slug AS destination
       FROM careers WHERE status = 'published' AND (name ILIKE $1 OR headline ILIKE $1) LIMIT 6)
      UNION ALL
      (SELECT 'skill', slug, name, description, '/competencias/' || slug
       FROM skills WHERE status = 'published' AND (name ILIKE $1 OR description ILIKE $1) LIMIT 6)
      UNION ALL
      (SELECT 'course', slug, title, short_description, '/cursos/' || slug
       FROM courses WHERE active = TRUE AND (title ILIKE $1 OR short_description ILIKE $1) LIMIT 6)
      UNION ALL
      (SELECT 'resource', slug, title, excerpt, COALESCE(source_url, '/recursos')
       FROM professional_resources WHERE status = 'published' AND (title ILIKE $1 OR excerpt ILIKE $1) LIMIT 6)
      UNION ALL
      (SELECT 'opportunity', slug, title, description, '/oportunidades'
       FROM opportunities WHERE status = 'published' AND verified_at IS NOT NULL AND (title ILIKE $1 OR description ILIKE $1) LIMIT 6)
      UNION ALL
      (SELECT 'company', slug, name, description, '/empresas'
       FROM companies WHERE status = 'published' AND verified = TRUE AND (name ILIKE $1 OR description ILIKE $1) LIMIT 6)
    `, [pattern]);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible completar la búsqueda', error);
  }
}

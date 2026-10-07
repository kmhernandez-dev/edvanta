import { pool } from '../db.js';

const clean = (value, max = 100) => typeof value === 'string' ? value.trim().slice(0, max) : '';

/**
 * Cuántos resultados devolver.
 *
 * Estas rutas ignoraban ?limit y siempre devolvían 100: pedir 2 traía 50.
 * Se acota entre 1 y 100 porque un límite negativo o enorme no es una
 * petición legítima, y el tope protege la base cuando las tablas crezcan.
 */
const limite = (valor, porDefecto = 100) => {
  const n = parseInt(valor, 10);
  return Number.isFinite(n) ? Math.min(100, Math.max(1, n)) : porDefecto;
};
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

    params.push(limite(req.query.limit));
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
      LIMIT $${params.length}
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
    params.push(limite(req.query.limit));
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
      LIMIT $${params.length}
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
    params.push(limite(req.query.limit));
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
      LIMIT $${params.length}
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
    params.push(limite(req.query.limit));
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
      LIMIT $${params.length}
    `, params);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible cargar los grupos', error);
  }
}

export async function listCertificationsRoute(req, res) {
  try {
    const params = [limite(req.query.limit)];
    const result = await pool.query(`
      SELECT certification.id, certification.slug, certification.name, certification.provider_name,
             certification.summary, certification.official_url, certification.level,
             certification.language, certification.editorial_note, certification.verified_at,
             jsonb_build_object('code', country.iso_code, 'name', country.name) AS country
      FROM certifications certification
      LEFT JOIN countries country ON country.id = certification.country_id
      WHERE certification.status = 'published' AND certification.verified_at IS NOT NULL
      ORDER BY certification.name
      LIMIT $${params.length}
    `, params);
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
    params.push(limite(req.query.limit));
    const result = await pool.query(`
      SELECT resource.id, resource.slug, resource.title, resource.resource_type, resource.excerpt,
             resource.source_url, resource.author_name, resource.published_at, resource.updated_at,
             jsonb_build_object('code', country.iso_code, 'name', country.name) AS country
      FROM professional_resources resource
      LEFT JOIN countries country ON country.id = resource.country_id
      WHERE ${conditions.join(' AND ')}
      ORDER BY resource.published_at DESC NULLS LAST, resource.updated_at DESC
      LIMIT $${params.length}
    `, params);
    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible cargar los recursos', error);
  }
}

/**
 * Búsqueda del ecosistema.
 *
 * Qué hace distinto a un `ILIKE '%texto%'`:
 *
 *  · Ignora las tildes. «farmacologia» y «farmacología» son lo mismo,
 *    porque la mitad de la gente escribe sin ellas.
 *  · Busca también las páginas del sitio (tabla site_pages), no solo
 *    el catálogo: «hoja de vida» tiene que llevar a la herramienta.
 *  · Ordena por relevancia: primero lo que coincide con el título
 *    completo, después lo que empieza igual, luego lo que lo contiene
 *    y al final lo que se le parece.
 *  · Perdona erratas con trigramas (`pg_trgm`), pero solo cuando no
 *    hubo ninguna coincidencia literal: si hay resultados buenos, no
 *    tiene sentido ensuciarlos con parecidos.
 */
export async function globalSearchRoute(req, res) {
  try {
    const q = clean(req.query.q, 80);
    if (q.length < 2) return res.json({ ok: true, data: [], total: 0 });

    // El patrón se arma sobre el texto ya normalizado en SQL, así que
    // aquí solo se escapan los comodines que la persona haya escrito.
    const escapado = q.replace(/[\\%_]/g, (ch) => `\\${ch}`);

    const result = await pool.query(
      `
      WITH consulta AS (
        SELECT ed_normaliza($1) AS q,
               '%' || ed_normaliza($2) || '%' AS contiene,
               ed_normaliza($2) || '%' AS empieza
      ),
      candidatos AS (
        SELECT 'page' AS result_type, p.slug, p.title, p.excerpt, p.destination,
               ed_normaliza(p.title || ' ' || COALESCE(p.keywords, '')) AS texto,
               ed_normaliza(p.title) AS titulo_norm,
               p.weight AS peso
          FROM site_pages p, consulta c
         WHERE p.active
           AND ed_normaliza(p.title || ' ' || COALESCE(p.keywords, '')) LIKE c.contiene

        UNION ALL
        SELECT 'career', slug, name, headline, '/carreras/' || slug,
               ed_normaliza(name || ' ' || COALESCE(headline, '')),
               ed_normaliza(name), 40
          FROM careers, consulta c
         WHERE status = 'published'
           AND ed_normaliza(name || ' ' || COALESCE(headline, '')) LIKE c.contiene

        UNION ALL
        SELECT 'skill', slug, name, description, '/competencias/' || slug,
               ed_normaliza(name || ' ' || COALESCE(description, '')),
               ed_normaliza(name), 35
          FROM skills, consulta c
         WHERE status = 'published'
           AND ed_normaliza(name || ' ' || COALESCE(description, '')) LIKE c.contiene

        UNION ALL
        SELECT 'course', slug, title, short_description, '/cursos/' || slug,
               ed_normaliza(title || ' ' || COALESCE(short_description, '')),
               ed_normaliza(title), 30
          FROM courses, consulta c
         WHERE active = TRUE
           AND ed_normaliza(title || ' ' || COALESCE(short_description, '')) LIKE c.contiene

        UNION ALL
        SELECT 'resource', slug, title, excerpt, COALESCE(source_url, '/recursos'),
               ed_normaliza(title || ' ' || COALESCE(excerpt, '')),
               ed_normaliza(title), 20
          FROM professional_resources, consulta c
         WHERE status = 'published'
           AND ed_normaliza(title || ' ' || COALESCE(excerpt, '')) LIKE c.contiene

        UNION ALL
        SELECT 'opportunity', slug, title, description, '/oportunidades',
               ed_normaliza(title || ' ' || COALESCE(description, '')),
               ed_normaliza(title), 15
          FROM opportunities, consulta c
         WHERE status = 'published' AND verified_at IS NOT NULL
           AND ed_normaliza(title || ' ' || COALESCE(description, '')) LIKE c.contiene

        UNION ALL
        SELECT 'company', slug, name, description, '/empresas',
               ed_normaliza(name || ' ' || COALESCE(description, '')),
               ed_normaliza(name), 10
          FROM companies, consulta c
         WHERE status = 'published' AND verified = TRUE
           AND ed_normaliza(name || ' ' || COALESCE(description, '')) LIKE c.contiene
      )
      SELECT result_type, slug, title, excerpt, destination
        FROM candidatos, consulta c
       ORDER BY
         CASE
           WHEN titulo_norm = c.q           THEN 0   -- es exactamente eso
           WHEN titulo_norm LIKE c.empieza  THEN 1   -- el título empieza igual
           WHEN titulo_norm LIKE c.contiene THEN 2   -- el título lo menciona
           ELSE 3                                    -- aparece en la descripción
         END,
         peso DESC,
         length(title),
         title
       LIMIT 30
      `,
      [q, escapado],
    );

    // Plan B: si no hubo ninguna coincidencia literal, se busca por
    // parecido. Cubre la errata («farmacovigilancía») sin ensuciar los
    // resultados cuando la búsqueda sí acertó.
    if (!result.rowCount) {
      const parecidos = await pool.query(
        `
        WITH consulta AS (SELECT ed_normaliza($1) AS q)
        SELECT * FROM (
          SELECT 'page' AS result_type, p.slug, p.title, p.excerpt, p.destination,
                 similarity(ed_normaliza(p.title || ' ' || COALESCE(p.keywords, '')), c.q) AS parecido
            FROM site_pages p, consulta c WHERE p.active
          UNION ALL
          SELECT 'career', slug, name, headline, '/carreras/' || slug,
                 similarity(ed_normaliza(name), c.q)
            FROM careers, consulta c WHERE status = 'published'
          UNION ALL
          SELECT 'skill', slug, name, description, '/competencias/' || slug,
                 similarity(ed_normaliza(name), c.q)
            FROM skills, consulta c WHERE status = 'published'
          UNION ALL
          SELECT 'course', slug, title, short_description, '/cursos/' || slug,
                 similarity(ed_normaliza(title), c.q)
            FROM courses, consulta c WHERE active = TRUE
        ) AS t
         WHERE parecido > 0.28
         ORDER BY parecido DESC
         LIMIT 12
        `,
        [q],
      );
      return res.json({
        ok: true,
        data: parecidos.rows.map(({ parecido, ...fila }) => fila),
        total: parecidos.rowCount,
        aproximado: parecidos.rowCount > 0,
      });
    }

    return res.json({ ok: true, data: result.rows, total: result.rowCount });
  } catch (error) {
    return fail(res, 'No fue posible completar la búsqueda', error);
  }
}

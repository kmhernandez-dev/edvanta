import { access } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PROFILE_AREAS = {
  calidad: 'Calidad y cumplimiento',
  datos: 'Datos y tecnologia',
  farmacia: 'Industria farmaceutica',
  salud: 'Salud',
  hseq: 'HSEQ y sostenibilidad',
  logistica: 'Supply Chain',
  marketing: 'Comercial y marketing',
  empleabilidad: 'Empleabilidad',
};

const PROFILE_SKILLS = {
  calidad: ['sistemas-gestion-calidad', 'gestion-documental', 'mejora-continua'],
  datos: ['analisis-datos', 'visualizacion-datos'],
  farmacia: ['industria-farmaceutica'],
  hseq: ['gestion-riesgos-calidad'],
  logistica: ['gestion-proyectos'],
  marketing: ['comunicacion-cientifica'],
  empleabilidad: ['cv-profesional'],
};

const TITLE_SKILL_RULES = [
  [/power bi/i, ['power-bi', 'analisis-datos', 'visualizacion-datos']],
  [/excel/i, ['excel', 'analisis-datos']],
  [/sql/i, ['sql', 'analisis-datos']],
  [/python/i, ['python-datos', 'analisis-datos']],
  [/inteligencia artificial|\bia\b/i, ['ia-aplicada']],
  [/lean six sigma/i, ['lean', 'six-sigma', 'mejora-continua', 'analisis-datos']],
  [/\blean\b/i, ['lean', 'mejora-continua']],
  [/auditor/i, ['auditorias', 'sistemas-gestion-calidad']],
  [/calidad/i, ['sistemas-gestion-calidad', 'gestion-documental', 'mejora-continua']],
  [/riesgo/i, ['gestion-riesgos-calidad']],
  [/proyecto/i, ['gestion-proyectos']],
  [/ambiental/i, ['gestion-ambiental', 'gestion-riesgos-calidad']],
  [/seguridad y salud|riesgos laborales/i, ['seguridad-salud-trabajo', 'gestion-riesgos-calidad']],
  [/farmacolog|medicamento|farmac/i, ['industria-farmaceutica']],
  [/nutrici|endocrin|diabetes|microbiota/i, ['evidencia-cientifica']],
  [/logistica|inventario|almacen|abastecimiento/i, ['gestion-proyectos', 'analisis-datos']],
];

const FEATURED_RECOMMENDATIONS = {
  'sh-9060': ['aseguramiento-calidad', 'control-calidad', 'validaciones', 'asuntos-regulatorios', 'produccion-farmaceutica'],
  'sh-9086': ['datos-farma', 'aseguramiento-calidad', 'control-calidad', 'produccion-farmaceutica', 'inteligencia-artificial-farma'],
  'sh-9215': ['aseguramiento-calidad', 'control-calidad', 'asuntos-regulatorios', 'produccion-farmaceutica'],
  'sh-13818': ['produccion-farmaceutica', 'industria-cosmetica'],
  'sh-13571': ['produccion-farmaceutica'],
  'sh-10262': ['validaciones', 'asuntos-regulatorios', 'investigacion-desarrollo', 'medical-affairs'],
  'sh-13568': ['aseguramiento-calidad', 'produccion-farmaceutica', 'datos-farma'],
  'sh-10218': ['aseguramiento-calidad', 'control-calidad', 'produccion-farmaceutica', 'datos-farma'],
};

const PATH_STEP_COURSES = {
  'quality-assurance-desde-cero': { 2: ['sh-9060'], 3: ['sh-9060'], 4: ['sh-9060'], 9: ['sh-9215'], 12: ['sh-9086'] },
  'control-de-calidad': { 1: ['sh-9060'], 4: ['sh-9086'] },
  'validaciones-farmaceuticas': { 1: ['sh-9060'], 3: ['sh-9215'], 4: ['sh-10262'] },
  'regulatory-affairs': { 1: ['sh-9060'], 3: ['sh-9215'] },
  'produccion-farmaceutica': { 1: ['sh-9060'], 3: ['sh-13568', 'sh-10218'], 4: ['sh-13568'] },
  'investigacion-y-desarrollo': { 2: ['sh-10262'], 4: ['sh-10262'] },
  'formulacion-cosmetica': { 3: ['sh-13818'] },
  'medical-affairs': { 4: ['sh-10262'] },
  'data-y-pharma': { 2: ['sh-9086'], 3: ['sh-9086'], 4: ['sh-9086'] },
  'ia-para-profesionales-farmaceuticos': { 2: ['sh-9086'], 4: ['sh-10262'] },
};

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 160);
}

async function importSourceModule(filename) {
  const candidates = [
    new URL(`../../src/data/${filename}`, import.meta.url),
    new URL(`../source-data/${filename}`, import.meta.url),
  ];

  for (const candidate of candidates) {
    try {
      await access(fileURLToPath(candidate));
      return import(pathToFileURL(fileURLToPath(candidate)).href);
    } catch {
      // Try the next supported runtime location.
    }
  }

  throw new Error(`No se encontro la fuente del catalogo: ${filename}`);
}

function inferSkillSlugs(course, featured) {
  const slugs = new Set();
  for (const profile of course.profiles || []) {
    for (const skill of PROFILE_SKILLS[profile] || []) slugs.add(skill);
  }
  for (const [pattern, skills] of TITLE_SKILL_RULES) {
    if (pattern.test(`${course.name} ${course.category}`)) {
      for (const skill of skills) slugs.add(skill);
    }
  }
  for (const skill of featured?.skills || []) {
    const normalized = slugify(skill);
    const aliases = {
      'enfoque-por-procesos': 'sistemas-gestion-calidad',
      'indicadores-de-gestion': 'visualizacion-datos',
      'control-documental': 'gestion-documental',
      'mejora-continua': 'mejora-continua',
      'gestion-de-riesgos': 'gestion-riesgos-calidad',
      'modelado-de-datos': 'analisis-datos',
      'limpieza-y-transformacion': 'analisis-datos',
      dashboards: 'power-bi',
      'visualizacion-de-indicadores': 'visualizacion-datos',
      'analisis-para-decisiones': 'analisis-datos',
      planificacion: 'gestion-proyectos',
      'recoleccion-de-evidencias': 'auditorias',
      entrevistas: 'auditorias',
      'redaccion-de-hallazgos': 'auditorias',
      'seguimiento-de-acciones': 'capa-desviaciones',
      'identificacion-de-impactos': 'gestion-ambiental',
      'gestion-de-residuos': 'gestion-ambiental',
      'cumplimiento-ambiental': 'gestion-ambiental',
      'indicadores-ambientales': 'visualizacion-datos',
      'mejora-sostenible': 'mejora-continua',
      'identificacion-de-peligros': 'seguridad-salud-trabajo',
      'evaluacion-de-riesgos': 'gestion-riesgos-calidad',
      'medidas-de-control': 'seguridad-salud-trabajo',
      inspecciones: 'auditorias',
      'promocion-de-bienestar-laboral': 'seguridad-salud-trabajo',
      'alcance-y-objetivos': 'gestion-proyectos',
      cronograma: 'gestion-proyectos',
      'gestion-de-recursos': 'gestion-proyectos',
      riesgos: 'gestion-riesgos-calidad',
      'seguimiento-de-avances': 'gestion-proyectos',
      'principios-lean': 'lean',
      'identificacion-de-desperdicios': 'lean',
      'flujo-de-valor': 'lean',
      estandarizacion: 'lean',
      dmaic: 'six-sigma',
      'analisis-de-variabilidad': 'six-sigma',
      indicadores: 'visualizacion-datos',
      'control-de-procesos': 'six-sigma',
      'mejora-basada-en-datos': 'six-sigma',
    };
    if (aliases[normalized]) slugs.add(aliases[normalized]);
  }
  return [...slugs];
}

export async function buildEdvantaCatalog() {
  const [{ courses }, { featuredCourses }] = await Promise.all([
    importSourceModule('courses.js'),
    importSourceModule('featuredCourses.js'),
  ]);

  const featuredByCode = new Map(featuredCourses.map(item => [item.courseCode.toLowerCase(), item]));
  const baseByCode = new Map(courses.map(item => [item.code.toLowerCase(), item]));

  for (const featured of featuredCourses) {
    const code = featured.courseCode.toLowerCase();
    if (!baseByCode.has(code)) {
      baseByCode.set(code, {
        id: code,
        code: featured.courseCode,
        name: featured.title,
        category: featured.category,
        url: featured.affiliateUrl,
        profiles: ['calidad'],
      });
    }
  }

  const catalog = [...baseByCode.values()].map((course) => {
    const code = course.code.toLowerCase();
    const featured = featuredByCode.get(code);
    const exactUrl = featured?.affiliateUrl || course.url;
    const profile = (course.profiles || [])[0];

    return {
      title: featured?.title || course.name,
      slug: featured?.slug || `${slugify(course.name)}-${course.id.replace(/^sh-/, '')}`,
      shortDescription: featured?.shortDescription || `Curso de ${course.name} seleccionado para fortalecer competencias profesionales en ${course.category}.`,
      fullDescription: featured?.description || null,
      provider: 'edutin',
      providerCourseId: course.id,
      originalUrl: course.url,
      affiliateUrl: exactUrl,
      category: course.category,
      professionalArea: PROFILE_AREAS[profile] || course.category,
      language: 'Spanish',
      level: 'mixed',
      modality: 'self_paced',
      priceType: 'free_audit',
      certificateAvailable: true,
      certificateIncluded: false,
      duration: featured?.duration || null,
      imageUrl: featured?.image?.webp || null,
      institution: 'Edutin Academy',
      skills: featured?.skills || [],
      learningOutcomes: featured?.applications || [],
      requirements: [],
      featured: Boolean(featured),
      trending: false,
      active: true,
      skillSlugs: inferSkillSlugs(course, featured),
      mappingReviewStatus: featured ? 'verified' : 'pending',
      sourcePath: featured ? 'src/data/featuredCourses.js' : 'src/data/courses.js',
    };
  });

  const uniqueProviderIds = new Set(catalog.map(course => course.providerCourseId));
  if (uniqueProviderIds.size !== catalog.length) {
    throw new Error('El catalogo Edutin contiene identificadores duplicados');
  }

  return catalog;
}

export async function syncEdvantaLearningGraph(catalog) {
  const { pool } = await import('../db.js');
  const client = await pool.connect();
  const report = { affiliates: 0, skillMappings: 0, editorialRecommendations: 0, pathSteps: 0 };

  try {
    await client.query('BEGIN');

    const providerIds = catalog.map(course => course.providerCourseId);
    const courseResult = await client.query(
      `SELECT id, provider_course_id, original_url, affiliate_url
       FROM courses
       WHERE provider = 'edutin' AND provider_course_id = ANY($1::text[])`,
      [providerIds],
    );
    const courseByProviderId = new Map(courseResult.rows.map(row => [row.provider_course_id, row]));

    for (const sourceCourse of catalog) {
      const stored = courseByProviderId.get(sourceCourse.providerCourseId);
      if (!stored) continue;

      await client.query(
        `INSERT INTO affiliate_links (
           course_id, provider, original_url, affiliate_url, source_path, source_type
         ) VALUES ($1, 'edutin', $2, $3, $4, 'import')
         ON CONFLICT (course_id) DO UPDATE SET
           provider = EXCLUDED.provider,
           original_url = COALESCE(affiliate_links.original_url, EXCLUDED.original_url),
           affiliate_url = COALESCE(affiliate_links.affiliate_url, EXCLUDED.affiliate_url),
           source_path = COALESCE(affiliate_links.source_path, EXCLUDED.source_path)`,
        [stored.id, sourceCourse.originalUrl, sourceCourse.affiliateUrl, sourceCourse.sourcePath],
      );
      report.affiliates++;

      if (!sourceCourse.skillSlugs.length) continue;
      const skillResult = await client.query(
        `SELECT id, slug FROM skills WHERE slug = ANY($1::text[]) AND status = 'published'`,
        [sourceCourse.skillSlugs],
      );
      for (const skill of skillResult.rows) {
        await client.query(
          `INSERT INTO course_skills (
             course_id, skill_id, coverage, relevance, primary_skill, review_status, source
           ) VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (course_id, skill_id) DO UPDATE SET
             coverage = GREATEST(course_skills.coverage, EXCLUDED.coverage),
             relevance = GREATEST(course_skills.relevance, EXCLUDED.relevance),
             review_status = CASE
               WHEN course_skills.review_status = 'verified' THEN 'verified'
               ELSE EXCLUDED.review_status
             END,
             source = EXCLUDED.source`,
          [
            stored.id,
            skill.id,
            sourceCourse.featured ? 4 : 2,
            sourceCourse.featured ? 90 : 55,
            sourceCourse.skillSlugs[0] === skill.slug,
            sourceCourse.mappingReviewStatus,
            `catalog:${sourceCourse.sourcePath}`,
          ],
        );
        report.skillMappings++;
      }
    }

    for (const [providerCourseId, careerSlugs] of Object.entries(FEATURED_RECOMMENDATIONS)) {
      const stored = courseByProviderId.get(providerCourseId);
      if (!stored) continue;
      const careerResult = await client.query(
        `SELECT id, slug FROM careers WHERE slug = ANY($1::text[]) AND status = 'published'`,
        [careerSlugs],
      );
      for (const career of careerResult.rows) {
        await client.query(
          `INSERT INTO career_course_recommendations (career_id, course_id, priority, reason)
           VALUES ($1, $2, 90, 'Seleccion editorial: curso existente alineado con el perfil profesional.')
           ON CONFLICT (career_id, course_id) DO UPDATE SET
             priority = EXCLUDED.priority,
             reason = EXCLUDED.reason,
             status = 'published'`,
          [career.id, stored.id],
        );
        report.editorialRecommendations++;
      }
    }

    for (const [pathSlug, steps] of Object.entries(PATH_STEP_COURSES)) {
      for (const [stepOrder, ids] of Object.entries(steps)) {
        const courseIds = ids.map(id => courseByProviderId.get(id)?.id).filter(Boolean);
        if (!courseIds.length) continue;
        await client.query(
          `UPDATE learning_path_steps step
           SET course_id = $1, course_ids = $2::bigint[]
           FROM learning_paths path
           WHERE step.learning_path_id = path.id
             AND path.slug = $3
             AND step.step_order = $4`,
          [courseIds[0], courseIds, pathSlug, Number(stepOrder)],
        );
        report.pathSteps++;
      }
    }

    await client.query('COMMIT');
    return report;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

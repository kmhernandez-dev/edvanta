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
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { buffer as streamToBuffer } from 'node:stream/consumers';
import { pool } from '../db.js';
import { fichaDeCursoPropio, fichaDeCursoCurado, huecosDeLaFicha } from '../lib/ficha-de-curso.js';

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

/**
 * Cursos propios de Edvanta, para la portada pública.
 *
 * Son los que viven en el aula (`aula_courses`), no en el catálogo
 * externo. Hasta ahora solo se veían dentro de /aula, así que quien
 * llegaba a edvanta.co no sabía que existían.
 *
 * Solo salen los publicados y de tipo `edvanta`: un curso de empresa
 * pertenece a su empresa y no puede asomarse a la portada.
 */
export async function listOwnCoursesRoute(req, res) {
  try {
    // El tope sube a 60: con tres líneas de cursos montadas, 24 dejaba
    // fuera a los demás sin que se notara. El inicio sigue pidiendo 24,
    // que ya son muchas tarjetas para un carrusel; /cursos los pide todos.
    const limite = Math.min(60, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const { rows } = await pool.query(
      `SELECT c.id, c.title, c.short_description, c.cover_url, c.cover_file_id,
              c.category, c.area, c.level, c.duration_minutes, c.author_name, c.published_at,
              (SELECT COUNT(*)::int FROM aula_lessons l
                WHERE l.course_id = c.id AND l.deleted_at IS NULL) AS lessons
         FROM aula_courses c
        WHERE c.kind = 'edvanta'
          AND c.status = 'publicado'
          AND c.deleted_at IS NULL
          AND c.current_version_id IS NOT NULL
        ORDER BY c.published_at DESC NULLS LAST, c.title
        LIMIT $1`,
      [limite],
    );
    return res.json({
      ok: true,
      data: rows.map((r) => ({
        id: r.id,
        title: r.title,
        shortDescription: r.short_description || '',
        // La portada puede venir de un archivo subido o de un enlace.
        // La portada se sirve por su propia ruta pública: /api/aula/files
        // exige sesión y dejaba la imagen rota a quien no ha entrado.
        coverUrl: r.cover_file_id ? `/api/cursos-edvanta/${r.id}/portada` : r.cover_url,
        category: r.category,
        // La categoría grande con la que se agrupan en la web.
        area: r.area,
        level: r.level,
        durationMinutes: r.duration_minutes,
        authorName: r.author_name,
        lessons: r.lessons,
        // La ficha pública, no el aula: así se ve el curso antes de entrar.
        to: `/curso/${r.id}`,
      })),
      total: rows.length,
    });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error listando cursos propios', error: e.message }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar los cursos de Edvanta' });
  }
}

/**
 * GET /api/cursos-edvanta/:id — Ficha pública de un curso propio.
 *
 * Devuelve de qué va el curso y su temario (títulos y duraciones), nunca
 * el contenido de las clases: eso es lo que se abre al inscribirse. Quien
 * llega sin cuenta ve lo mismo que un folleto —suficiente para decidir—
 * y el contenido sigue detrás de la matrícula.
 *
 * El temario sale del snapshot publicado, no de las tablas vivas: así la
 * ficha enseña exactamente el curso que se va a cursar, no un borrador a
 * medio editar.
 *
 * La consulta y el armado del temario se exportan aparte para poder
 * probarlos: la consulta contra el esquema real (si una columna cambia de
 * nombre, la prueba falla antes que producción) y el temario contra un
 * snapshot de ejemplo.
 */
export const SQL_CURSO_PUBLICO = `
  SELECT c.id, c.title, c.short_description, c.description_html, c.cover_url, c.cover_file_id,
         c.category, c.level, c.duration_minutes, c.author_name, c.tags, c.modality,
         c.objective, c.learning_outcomes, c.audience, c.prerequisites, c.published_at,
         v.snapshot, v.version_number
    FROM aula_courses c
    JOIN aula_course_versions v ON v.id = c.current_version_id
   WHERE c.id = $1
     AND c.kind = 'edvanta'
     AND c.status = 'publicado'
     AND c.deleted_at IS NULL`;

/** Del snapshot publicado al temario que se puede enseñar sin cuenta. */
export function temarioPublico(snapshot) {
  const modulos = Array.isArray(snapshot?.modules) ? snapshot.modules : [];
  return modulos.map((m, i) => ({
    id: m.id,
    numero: i + 1,
    title: m.title,
    lessons: (m.lessons || []).map((l) => ({
      id: l.id,
      title: l.title,
      durationMinutes: l.durationMinutes || null,
      isRequired: l.isRequired !== false,
      // Si la clase trae video se dice, porque cambia la expectativa de
      // quien decide si entrar. No se dice cuál ni dónde está.
      hasVideo: (l.blocks || []).some((b) => b.type === 'video'),
    })),
  }));
}

export async function ownCourseDetailRoute(req, res) {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ ok: false, error: 'Identificador de curso no válido' });
    }
    const { rows } = await pool.query(SQL_CURSO_PUBLICO, [id]);
    const c = rows[0];
    if (!c) {
      return res.status(404).json({ ok: false, error: 'Este curso no está disponible' });
    }

    const temario = temarioPublico(c.snapshot);
    const clases = temario.reduce((n, m) => n + m.lessons.length, 0);

    return res.json({
      ok: true,
      data: {
        id: c.id,
        title: c.title,
        shortDescription: c.short_description || '',
        descriptionHtml: c.description_html || '',
        coverUrl: c.cover_file_id ? `/api/cursos-edvanta/${c.id}/portada` : c.cover_url,
        category: c.category,
        level: c.level,
        durationMinutes: c.duration_minutes,
        authorName: c.author_name,
        tags: Array.isArray(c.tags) ? c.tags : [],
        modality: c.modality,
        objective: c.objective || '',
        learningOutcomes: Array.isArray(c.learning_outcomes) ? c.learning_outcomes : [],
        audience: c.audience || '',
        prerequisites: c.prerequisites || '',
        publishedAt: c.published_at,
        version: c.version_number,
        modules: temario.length,
        lessons: clases,
        temario,
        aulaTo: `/aula/curso/${c.id}`,
      },
    });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error cargando curso propio', error: e.message }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar el curso' });
  }
}

/**
 * GET /api/cursos-edvanta/:id/portada — La portada, sin pedir cuenta.
 *
 * Las portadas vivían en /api/aula/files/:id, que exige sesión. En el
 * aula eso está bien —ahí dentro hay material de empresas— pero en la
 * portada de edvanta.co dejaba la imagen rota a todo el que no hubiera
 * entrado: justo a quien hay que convencer.
 *
 * Esto NO abre el almacén del aula. Solo sirve un archivo cuando es la
 * portada de un curso propio y publicado, y solo si es una imagen: si
 * alguien pusiera de portada un PDF, aquí no sale.
 *
 * Y no sirve el original. Las portadas subidas pesan ~1,7 MB cada una:
 * seis en el inicio son diez megas de imágenes para ver seis tarjetas.
 * Se reduce a lo que la tarjeta necesita y se guarda el resultado, así
 * que el trabajo se hace una vez por imagen y no una vez por visita.
 */
const PORTADAS_PUBLICAS = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']);

/** Ancho de la portada más grande que se muestra, con holgura para pantallas densas. */
const ANCHO_PORTADA = 960;
// Parte del nombre del archivo derivado: cambiarla invalida lo guardado
// sin tener que borrar nada a mano.
const VERSION_PORTADA = 'w960q78';

export const SQL_PORTADA_PUBLICA = `
  SELECT f.storage_key, f.mime_type, f.size_bytes, f.updated_at
    FROM aula_courses c
    JOIN aula_files f ON f.id = c.cover_file_id
   WHERE c.id = $1
     AND c.kind = 'edvanta'
     AND c.status = 'publicado'
     AND c.deleted_at IS NULL
     AND f.status = 'listo'
     AND f.deleted_at IS NULL`;

export function ownCourseCoverRoute({ storage }) {
  const cacheDir = path.join(storage.root, 'portadas');

  /**
   * Devuelve la ruta de la versión ligera, creándola la primera vez.
   * Si algo falla (sharp ausente, imagen rota) devuelve null y se sirve
   * el original: más vale pesada que ninguna.
   *
   * Cambiar la portada de un curso sube otro archivo, con otra clave, así
   * que la versión nueva se genera sola y la vieja queda huérfana. Son
   * decenas de kilobytes: no vale la pena un barrido para eso.
   */
  async function versionLigera(storageKey) {
    // El nombre sale de un hash: la clave de almacenamiento nunca toca
    // el sistema de archivos de aquí.
    const nombre = `${crypto.createHash('sha256').update(storageKey).digest('hex')}.${VERSION_PORTADA}.webp`;
    const destino = path.join(cacheDir, nombre);
    try {
      await fsp.access(destino);
      return destino;
    } catch { /* todavía no existe */ }
    try {
      const { default: sharp } = await import('sharp');
      await fsp.mkdir(cacheDir, { recursive: true });
      // sharp recibe el contenido, no el flujo: pasarle un readStream
      // lanza «Expected Buffer or string for input» y la portada salía
      // entera. Una portada son un par de megas; cabe de sobra.
      const entrada = await streamToBuffer(storage.readStream(storageKey));
      // Se escribe aparte y se renombra: si entran dos peticiones a la
      // vez, nadie lee un archivo a medio escribir.
      const parcial = `${destino}.${process.pid}.${Date.now()}.part`;
      await sharp(entrada)
        .rotate()
        .resize({ width: ANCHO_PORTADA, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(parcial);
      await fsp.rename(parcial, destino);
      return destino;
    } catch (err) {
      console.error(JSON.stringify({ level: 'warn', msg: 'No se pudo reducir la portada', error: err.message }));
      return null;
    }
  }

  return async function servirPortada(req, res) {
    try {
      const id = Number.parseInt(req.params.id, 10);
      if (!Number.isInteger(id) || id <= 0) return res.status(404).end();
      const { rows } = await pool.query(SQL_PORTADA_PUBLICA, [id]);
      const f = rows[0];
      if (!f || !PORTADAS_PUBLICAS.has(f.mime_type)) return res.status(404).end();
      if (!(await storage.exists(f.storage_key))) return res.status(404).end();

      res.setHeader('X-Content-Type-Options', 'nosniff');
      // Es pública y cambia poco; que la cachee el navegador y el proxy.
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');

      const ligera = await versionLigera(f.storage_key);
      const origen = ligera
        ? { tipo: 'image/webp', bytes: (await fsp.stat(ligera)).size, abrir: () => fs.createReadStream(ligera) }
        : { tipo: f.mime_type, bytes: f.size_bytes, abrir: () => storage.readStream(f.storage_key) };

      res.setHeader('Content-Type', origen.tipo);
      res.setHeader('Content-Length', origen.bytes);
      if (req.method === 'HEAD') return res.end();

      const stream = origen.abrir();
      stream.on('error', (err) => {
        console.error(JSON.stringify({ level: 'error', msg: 'Error leyendo portada', curso: id, error: err.message }));
        res.destroy(err);
      });
      return stream.pipe(res);
    } catch (e) {
      console.error(JSON.stringify({ level: 'error', msg: 'Error sirviendo portada', error: e.message }));
      return res.status(500).end();
    }
  };
}

/**
 * GET /api/ficha/:ref — Cualquier curso, propio o curado, en un solo
 * formato.
 *
 * `ref` es `edvanta-<id>` para los propios y el slug para los curados.
 * Así una sola plantilla sirve los 224 sin preguntar de dónde viene el
 * curso: pregunta por sus capacidades.
 */
export async function fichaDeCursoRoute(req, res) {
  try {
    const ref = String(req.params.ref || '').trim();
    if (!ref) return res.status(400).json({ ok: false, error: 'Falta el curso' });

    const propio = /^edvanta-(\d+)$/.exec(ref);
    if (propio) {
      const id = Number(propio[1]);
      const { rows } = await pool.query(SQL_CURSO_PUBLICO, [id]);
      if (!rows[0]) return res.status(404).json({ ok: false, error: 'Este curso no está disponible' });
      const ficha = fichaDeCursoPropio(rows[0], temarioPublico(rows[0].snapshot));
      return res.json({ ok: true, data: ficha, faltan: huecosDeLaFicha(ficha), relacionados: await relacionados(ficha) });
    }

    // Por slug, y si no, por el identificador del proveedor: las
    // direcciones viejas (/cursos-gratis/sh-7429) usaban ese código y
    // siguen circulando por ahí.
    const { rows } = await pool.query(
      `SELECT * FROM courses
        WHERE active = true AND (slug = $1 OR lower(provider_course_id) = lower($1))
        ORDER BY (slug = $1) DESC LIMIT 1`,
      [ref],
    );
    if (!rows[0]) return res.status(404).json({ ok: false, error: 'Este curso no está disponible' });
    const ficha = fichaDeCursoCurado(rows[0]);
    return res.json({ ok: true, data: ficha, faltan: huecosDeLaFicha(ficha), relacionados: await relacionados(ficha) });
  } catch (e) {
    console.error(JSON.stringify({ level: 'error', msg: 'Error cargando la ficha', error: e.message }));
    return res.status(500).json({ ok: false, error: 'No fue posible cargar el curso' });
  }
}

/**
 * Hasta cuatro cursos de la misma categoría, sin repetir el actual.
 *
 * Se mezclan propios y curados a propósito: a quien mira un curso de
 * calidad le sirve saber que hay otro del tema, lo imparta quien lo
 * imparta. Todos llevan a su ficha en Edvanta, nunca fuera.
 */
async function relacionados(ficha) {
  const salida = [];
  if (ficha.categoria) {
    const { rows } = await pool.query(
      `SELECT c.id, c.title, c.short_description, c.cover_url, c.cover_file_id, c.category, c.level
         FROM aula_courses c
        WHERE c.kind = 'edvanta' AND c.status = 'publicado' AND c.deleted_at IS NULL
          AND c.current_version_id IS NOT NULL
          AND (c.category = $1 OR c.area = $2)
          AND ('edvanta-' || c.id) <> $3
        ORDER BY (c.cover_url IS NULL AND c.cover_file_id IS NULL), c.published_at DESC NULLS LAST
        LIMIT 4`,
      [ficha.categoria, ficha.area, ficha.id],
    );
    for (const r of rows) {
      salida.push({
        titulo: r.title,
        url: `/curso/${r.id}`,
        portada: r.cover_file_id ? `/api/cursos-edvanta/${r.id}/portada` : r.cover_url,
        procedencia: 'Edvanta',
        nivel: r.level,
      });
    }
  }
  if (salida.length < 4 && ficha.categoria) {
    const { rows } = await pool.query(
      `SELECT id, title, slug, provider, image_url, level
         FROM courses
        WHERE active = true AND category = $1 AND slug <> $2
        ORDER BY (image_url IS NULL), featured DESC
        LIMIT $3`,
      [ficha.categoria, ficha.variante === 'edvanta' ? '' : ficha.url.replace('/cursos/', ''), 4 - salida.length],
    );
    for (const r of rows) {
      salida.push({
        titulo: r.title,
        url: `/cursos/${r.slug}`,
        portada: r.image_url,
        procedencia: r.provider === 'edutin' ? 'Edutin Academy' : r.provider === 'udemy' ? 'Udemy' : 'Coursera',
        nivel: r.level,
      });
    }
  }
  return salida;
}

/**
 * ============================================================
 *  routes/admin-design.js — Edvanta Design
 *
 *  Un solo lugar para los cursos de Edvanta, que hasta ahora
 *  vivían en dos sitios sin hablarse:
 *
 *   · Curados  → tabla `courses`. Cursos de otra plataforma
 *                (Coursera, Udemy, Edutin, YouTube). Se guarda el
 *                enlace y la portada; el contenido es de ellos.
 *   · Propios  → tablas `aula_*`. El contenido vive aquí: unidades,
 *                clases, video y texto de apoyo.
 *
 *  La diferencia importa porque un curso curado se publica con
 *  pegar una URL, y uno propio hay que armarlo clase por clase.
 *  El panel muestra los dos juntos y esta API decide a qué lado va
 *  cada operación.
 *
 *  AUTENTICACIÓN: adminMiddleware (ADMIN_TOKEN, cabecera
 *  x-admin-token), igual que el resto de los paneles.
 * ============================================================
 */

import { Router } from 'express';
import { pool } from '../db.js';
import { adminMiddleware } from '../lib/auth.js';
import { parseVideoUrl } from '../lib/aula/blocks.js';

const router = Router();
router.use(adminMiddleware);

/* ── Ayudas ───────────────────────────────────────────────── */

const texto = (v, max = 400) => {
  const s = typeof v === 'string' ? v.trim() : '';
  return s ? s.slice(0, max) : null;
};

/** Acentos fuera, espacios a guiones: así se arma un slug legible. */
function aSlug(valor) {
  return String(valor || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

/** Un slug que no choque con otro ya guardado. */
async function slugLibre(base) {
  const raiz = aSlug(base) || 'curso';
  for (let i = 0; i < 50; i += 1) {
    const intento = i === 0 ? raiz : `${raiz}-${i + 1}`;
    const { rowCount } = await pool.query('SELECT 1 FROM courses WHERE slug = $1', [intento]);
    if (!rowCount) return intento;
  }
  return `${raiz}-${Date.now()}`;
}

const fallo = (res, msg, error) => {
  if (error) console.error('[design]', msg, error);
  return res.status(error ? 500 : 400).json({ ok: false, error: msg });
};

/* ── Resumen ──────────────────────────────────────────────── */

router.get('/summary', async (_req, res) => {
  try {
    const [curados, propios] = await Promise.all([
      pool.query(`SELECT provider, COUNT(*)::int AS n,
                         COUNT(*) FILTER (WHERE active)::int AS activos,
                         COUNT(*) FILTER (WHERE image_url IS NULL OR image_url = '')::int AS sin_portada
                  FROM courses GROUP BY provider ORDER BY provider`),
      pool.query(`SELECT status, COUNT(*)::int AS n FROM aula_courses
                  WHERE deleted_at IS NULL GROUP BY status`),
    ]);
    return res.json({ ok: true, curados: curados.rows, propios: propios.rows });
  } catch (error) {
    return fallo(res, 'No fue posible leer el resumen', error);
  }
});

/* ── Listado unificado ────────────────────────────────────── */

router.get('/courses', async (req, res) => {
  try {
    const q = texto(req.query.q, 80);
    const tipo = ['curado', 'propio'].includes(req.query.tipo) ? req.query.tipo : null;
    const patron = q ? `%${q}%` : null;
    const salida = [];

    if (tipo !== 'propio') {
      const { rows } = await pool.query(
        `SELECT id, 'curado' AS tipo, title, slug, provider, original_url, affiliate_url,
                image_url, category, level, duration, active, featured, updated_at
         FROM courses
         WHERE ($1::text IS NULL OR title ILIKE $1 OR slug ILIKE $1 OR provider ILIKE $1)
         ORDER BY updated_at DESC NULLS LAST, title ASC
         LIMIT 300`, [patron],
      );
      salida.push(...rows);
    }

    if (tipo !== 'curado') {
      const { rows } = await pool.query(
        `SELECT c.id, 'propio' AS tipo, c.title, NULL::text AS slug, 'edvanta' AS provider,
                NULL::text AS original_url, NULL::text AS affiliate_url,
                c.cover_url AS image_url, c.category, c.level,
                c.duration_minutes::text AS duration,
                (c.status = 'publicado') AS active, FALSE AS featured, c.updated_at,
                c.status,
                (SELECT COUNT(*)::int FROM aula_modules m
                  WHERE m.course_id = c.id AND m.deleted_at IS NULL) AS unidades,
                (SELECT COUNT(*)::int FROM aula_lessons l
                  WHERE l.course_id = c.id AND l.deleted_at IS NULL) AS clases
         FROM aula_courses c
         WHERE c.deleted_at IS NULL AND c.kind = 'edvanta'
           AND ($1::text IS NULL OR c.title ILIKE $1)
         ORDER BY c.updated_at DESC
         LIMIT 300`, [patron],
      );
      salida.push(...rows);
    }

    return res.json({ ok: true, data: salida, total: salida.length });
  } catch (error) {
    return fallo(res, 'No fue posible listar los cursos', error);
  }
});

/* ── Cursos curados (catálogo externo) ────────────────────── */

const CAMPOS_CURADO = [
  'title', 'slug', 'short_description', 'full_description', 'provider', 'original_url',
  'affiliate_url', 'category', 'professional_area', 'language', 'level', 'modality',
  'price_type', 'duration', 'image_url', 'instructor', 'institution', 'certificate_available',
  'featured', 'active',
];

router.post('/curated', async (req, res) => {
  try {
    const body = req.body || {};
    if (!texto(body.title)) return fallo(res, 'El curso necesita un título.');
    if (!texto(body.provider)) return fallo(res, 'Indica de qué plataforma viene el curso.');
    if (!texto(body.original_url, 2000)) return fallo(res, 'Pega el enlace del curso.');

    const slug = texto(body.slug) ? aSlug(body.slug) : await slugLibre(body.title);
    const valores = CAMPOS_CURADO.map((c) => {
      if (c === 'slug') return slug;
      if (['certificate_available', 'featured', 'active'].includes(c)) return Boolean(body[c]);
      return texto(body[c], c.includes('description') ? 4000 : 2000);
    });

    const { rows } = await pool.query(
      `INSERT INTO courses (${CAMPOS_CURADO.join(', ')}, published_at)
       VALUES (${CAMPOS_CURADO.map((_, i) => `$${i + 1}`).join(', ')}, NOW())
       RETURNING id, slug, title`,
      valores,
    );
    return res.status(201).json({ ok: true, data: rows[0] });
  } catch (error) {
    if (error.code === '23505') return fallo(res, 'Ya existe un curso con ese slug.');
    return fallo(res, 'No fue posible guardar el curso', error);
  }
});

router.patch('/curated/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return fallo(res, 'Identificador no válido.');
    const body = req.body || {};
    const sets = [];
    const valores = [];
    for (const campo of CAMPOS_CURADO) {
      if (!(campo in body)) continue;
      valores.push(['certificate_available', 'featured', 'active'].includes(campo)
        ? Boolean(body[campo])
        : texto(body[campo], campo.includes('description') ? 4000 : 2000));
      sets.push(`${campo} = $${valores.length}`);
    }
    if (!sets.length) return fallo(res, 'No hay nada que cambiar.');
    valores.push(id);
    const { rows } = await pool.query(
      `UPDATE courses SET ${sets.join(', ')}, updated_at = NOW()
       WHERE id = $${valores.length} RETURNING id, slug, title`, valores,
    );
    if (!rows.length) return res.status(404).json({ ok: false, error: 'Ese curso no existe.' });
    return res.json({ ok: true, data: rows[0] });
  } catch (error) {
    if (error.code === '23505') return fallo(res, 'Ya existe un curso con ese slug.');
    return fallo(res, 'No fue posible actualizar el curso', error);
  }
});

/* ── Cursos propios (aula): unidades, clases, video y texto ─ */

/**
 * Arma un curso completo de una sola vez.
 *
 * Se hace en una transacción a propósito: un curso a medio crear
 * (con unidades pero sin clases) aparecería en el aula como un curso
 * roto, y nadie sabría si fue un fallo o si quedó así a medias.
 */
router.post('/structured', async (req, res) => {
  const cliente = await pool.connect();
  try {
    const body = req.body || {};
    const titulo = texto(body.title, 200);
    if (!titulo) return fallo(res, 'El curso necesita un título.');

    const unidades = Array.isArray(body.units) ? body.units : [];
    if (!unidades.length) return fallo(res, 'Agrega al menos una unidad.');

    // Se validan TODOS los enlaces antes de escribir nada: así un video
    // mal pegado en la última clase no deja medio curso creado.
    for (const [iu, u] of unidades.entries()) {
      if (!texto(u?.title, 200)) return fallo(res, `La unidad ${iu + 1} necesita un título.`);
      for (const [il, l] of (Array.isArray(u.lessons) ? u.lessons : []).entries()) {
        if (!texto(l?.title, 200)) return fallo(res, `La clase ${il + 1} de la unidad ${iu + 1} necesita un título.`);
        const url = texto(l?.videoUrl, 2000);
        if (url && !parseVideoUrl(url)) {
          return fallo(res, `El video de «${texto(l.title, 60)}» no es un enlace de YouTube o Vimeo válido.`);
        }
      }
    }

    await cliente.query('BEGIN');
    const { rows: [curso] } = await cliente.query(
      `INSERT INTO aula_courses
         (kind, title, short_description, description_html, cover_url, category, level,
          objective, audience, author_name, status, modality)
       VALUES ('edvanta', $1, $2, $3, $4, $5, $6, $7, $8, $9, 'borrador', 'asincronica')
       RETURNING id, title`,
      [
        titulo,
        texto(body.short_description, 400),
        texto(body.description_html, 8000),
        texto(body.cover_url, 2000),
        texto(body.category, 120),
        ['basico', 'intermedio', 'avanzado'].includes(body.level) ? body.level : null,
        texto(body.objective, 1000),
        texto(body.audience, 1000),
        texto(body.author_name, 160),
      ],
    );

    let totalClases = 0;
    for (const [iu, u] of unidades.entries()) {
      const { rows: [modulo] } = await cliente.query(
        `INSERT INTO aula_modules (course_id, title, description, sort_order)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [curso.id, texto(u.title, 200), texto(u.description, 1000), iu],
      );

      for (const [il, l] of (Array.isArray(u.lessons) ? u.lessons : []).entries()) {
        const url = texto(l.videoUrl, 2000);
        const { rows: [clase] } = await cliente.query(
          `INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order,
                                     duration_minutes, completion_rule)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [
            curso.id, modulo.id, texto(l.title, 200), texto(l.subtitle, 300), il,
            Number.isFinite(Number(l.minutes)) && Number(l.minutes) > 0 ? Math.round(Number(l.minutes)) : null,
            url ? 'video' : 'manual',
          ],
        );
        totalClases += 1;

        let orden = 0;
        if (url) {
          const parsed = parseVideoUrl(url);
          await cliente.query(
            `INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
             VALUES ($1, 'video', $2, $3::jsonb)`,
            [clase.id, orden++, JSON.stringify({
              source: 'enlace', url, ...parsed, title: texto(l.title, 200) || '', transcriptHtml: '',
            })],
          );
        }
        const apoyo = texto(l.description, 8000);
        if (apoyo) {
          // El texto va DEBAJO del video: es el apoyo de la clase, no su reemplazo.
          const html = /<[a-z][\s\S]*>/i.test(apoyo)
            ? apoyo
            : apoyo.split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
          await cliente.query(
            `INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
             VALUES ($1, 'texto', $2, $3::jsonb)`,
            [clase.id, orden++, JSON.stringify({ html })],
          );
        }
      }
    }

    await cliente.query('COMMIT');
    return res.status(201).json({
      ok: true,
      data: { id: curso.id, title: curso.title, unidades: unidades.length, clases: totalClases },
    });
  } catch (error) {
    await cliente.query('ROLLBACK').catch(() => {});
    return fallo(res, 'No fue posible crear el curso', error);
  } finally {
    cliente.release();
  }
});

/** Detalle de un curso propio, con sus unidades y clases. */
router.get('/structured/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return fallo(res, 'Identificador no válido.');
    const { rows: [curso] } = await pool.query(
      `SELECT id, title, short_description, cover_url, category, level, status, author_name
       FROM aula_courses WHERE id = $1 AND deleted_at IS NULL`, [id],
    );
    if (!curso) return res.status(404).json({ ok: false, error: 'Ese curso no existe.' });

    const { rows: estructura } = await pool.query(
      `SELECT m.id AS modulo_id, m.title AS unidad, m.sort_order AS orden_unidad,
              l.id AS clase_id, l.title AS clase, l.sort_order AS orden_clase,
              (SELECT b.data->>'url' FROM aula_lesson_blocks b
                WHERE b.lesson_id = l.id AND b.type = 'video' AND b.deleted_at IS NULL
                ORDER BY b.sort_order LIMIT 1) AS video_url
       FROM aula_modules m
       LEFT JOIN aula_lessons l ON l.module_id = m.id AND l.deleted_at IS NULL
       WHERE m.course_id = $1 AND m.deleted_at IS NULL
       ORDER BY m.sort_order, l.sort_order`, [id],
    );
    return res.json({ ok: true, data: { ...curso, estructura } });
  } catch (error) {
    return fallo(res, 'No fue posible leer el curso', error);
  }
});

export default router;

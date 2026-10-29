/**
 * ============================================================
 *  opiniones.js — Las cuatro formas de participar
 *
 *  Aquí vive QUIÉN puede hacer QUÉ. Nada de esto se decide en el
 *  navegador: el cliente pide, el servidor comprueba. En particular,
 *  el cliente nunca escribe la media, ni el total, ni si una opinión
 *  viene de alguien matriculado, ni el estado de moderación. Esos
 *  cuatro campos son justo los que valdría la pena falsear.
 *
 *  Las medias se calculan al leer, con índice por curso. Son 224
 *  cursos: recorrer la tabla entera para pintar una ficha sería
 *  absurdo, pero mantener un contador desnormalizado que se
 *  desincroniza lo es más.
 * ============================================================
 */

import { many, one } from './db.js';
import { badRequest, forbidden, notFound } from './http.js';
import { rutasDeReferencias } from '../slugs-publicos.js';

const MAX_RESENA = 4000;
const MAX_COMENTARIO = 4000;
export const POR_PAGINA = 10;

/* ── A qué curso apunta esto ──────────────────────────────── */

/**
 * Traduce la referencia de la ficha («edvanta-14» o un slug) al curso
 * real, y dice de cuál de las dos tablas viene.
 *
 * Se resuelve SIEMPRE contra la base: así una referencia inventada no
 * crea filas colgando de un curso que no existe.
 */
export async function resolverCurso(db, ref) {
  const propio = /^edvanta-(\d+)$/.exec(String(ref || '').trim());
  if (propio) {
    const curso = await one(
      db,
      `SELECT id FROM aula_courses
        WHERE id = $1 AND kind = 'edvanta' AND status = 'publicado' AND deleted_at IS NULL`,
      [Number(propio[1])],
    );
    if (!curso) throw notFound('Este curso no está disponible.');
    return { propio: true, aulaCourseId: curso.id, cursoId: null };
  }
  const curado = await one(db, 'SELECT id FROM courses WHERE slug = $1 AND active = true', [String(ref || '').trim()]);
  if (!curado) throw notFound('Este curso no está disponible.');
  return { propio: false, aulaCourseId: null, cursoId: curado.id };
}

/** Las dos columnas que identifican el curso, para WHERE y para INSERT. */
const columnaDelCurso = (c) => (c.propio ? 'aula_course_id' : 'curso_id');
const idDelCurso = (c) => (c.propio ? c.aulaCourseId : c.cursoId);

/* ── Quién es quien escribe ───────────────────────────────── */

/**
 * El nombre público de alguien. Nunca el correo ni el teléfono: esto se
 * ve en una página abierta a cualquiera.
 */
export function nombrePublico(fila) {
  const nombre = [fila.first_name, fila.last_name].filter(Boolean).join(' ').trim();
  if (nombre) return nombre;
  // Sin nombre, la inicial del correo antes de la arroba. El correo
  // entero no sale de aquí.
  const i = String(fila.email || '').trim().charAt(0).toUpperCase();
  return i ? `${i}.` : 'Alguien de Edvanta';
}

export function iniciales(fila) {
  const a = String(fila.first_name || '').charAt(0);
  const b = String(fila.last_name || '').charAt(0);
  return (a + b).toUpperCase() || String(fila.email || '?').charAt(0).toUpperCase();
}

/** ¿Esta persona está matriculada en este curso propio? */
async function estaMatriculado(db, userId, aulaCourseId) {
  const fila = await one(
    db,
    `SELECT 1 FROM aula_enrollments
      WHERE user_id = $1 AND course_id = $2 AND withdrawn_at IS NULL LIMIT 1`,
    [userId, aulaCourseId],
  );
  return Boolean(fila);
}

/* ── 1. Opiniones del curso ───────────────────────────────── */

const SELECT_OPINION = `
  SELECT o.id, o.puntuacion, o.texto, o.vinculo, o.created_at, o.updated_at,
         o.user_id, u.first_name, u.last_name, u.email
    FROM opiniones_curso o
    JOIN aula_users u ON u.id = o.user_id`;

function opinionPublica(fila, yo) {
  return {
    id: fila.id,
    puntuacion: fila.puntuacion,
    texto: fila.texto || '',
    // «declarada» se dice tal cual: la persona afirma haber hecho el
    // curso, nadie lo ha comprobado. Llamarla verificada sería mentir.
    vinculo: fila.vinculo,
    autor: { nombre: nombrePublico(fila), iniciales: iniciales(fila) },
    fecha: fila.created_at,
    editada: fila.updated_at > fila.created_at,
    mia: yo ? fila.user_id === yo : false,
  };
}

/**
 * Resumen y listado de opiniones de un curso.
 *
 * Solo cuenta lo publicado: una opinión oculta por moderación no debe
 * mover la media ni aparecer en el total.
 */
export async function opinionesDelCurso(db, curso, { pagina = 1, orden = 'recientes', estrellas = null, yo = null } = {}) {
  const col = columnaDelCurso(curso);
  const id = idDelCurso(curso);

  const resumen = await one(
    db,
    `SELECT COUNT(*)::int AS total,
            ROUND(AVG(puntuacion)::numeric, 1) AS promedio,
            COUNT(*) FILTER (WHERE puntuacion = 5)::int AS e5,
            COUNT(*) FILTER (WHERE puntuacion = 4)::int AS e4,
            COUNT(*) FILTER (WHERE puntuacion = 3)::int AS e3,
            COUNT(*) FILTER (WHERE puntuacion = 2)::int AS e2,
            COUNT(*) FILTER (WHERE puntuacion = 1)::int AS e1
       FROM opiniones_curso
      WHERE ${col} = $1 AND estado = 'publicada'`,
    [id],
  );

  const filtros = [`o.${col} = $1`, `o.estado = 'publicada'`];
  const params = [id];
  if (estrellas) {
    params.push(estrellas);
    filtros.push(`o.puntuacion = $${params.length}`);
  }
  const orderBy = orden === 'utiles'
    ? 'length(coalesce(o.texto, \'\')) DESC, o.created_at DESC'
    : 'o.created_at DESC';
  params.push(POR_PAGINA + 1, (Math.max(1, pagina) - 1) * POR_PAGINA);

  const filas = await many(
    db,
    `${SELECT_OPINION} WHERE ${filtros.join(' AND ')}
      ORDER BY ${orderBy} LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  const hayMas = filas.length > POR_PAGINA;

  return {
    resumen: {
      total: resumen.total,
      promedio: resumen.total ? Number(resumen.promedio) : null,
      distribucion: { 5: resumen.e5, 4: resumen.e4, 3: resumen.e3, 2: resumen.e2, 1: resumen.e1 },
    },
    opiniones: filas.slice(0, POR_PAGINA).map((f) => opinionPublica(f, yo)),
    hayMas,
  };
}

/** La opinión de quien mira, para poder editarla en vez de duplicarla. */
export async function miOpinionDelCurso(db, curso, userId) {
  const col = columnaDelCurso(curso);
  const fila = await one(
    db,
    `${SELECT_OPINION} WHERE o.${col} = $1 AND o.user_id = $2`,
    [idDelCurso(curso), userId],
  );
  return fila ? opinionPublica(fila, userId) : null;
}

/**
 * Deja o cambia la opinión de alguien sobre un curso.
 *
 * El vínculo lo decide el servidor mirando la matrícula, nunca el
 * cliente: en un curso propio hace falta estar matriculado de verdad;
 * en uno externo la persona declara haberlo hecho y así queda marcado.
 */
export async function guardarOpinionDeCurso(db, curso, userId, { puntuacion, texto, declaro }) {
  const nota = Number(puntuacion);
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    throw badRequest('La calificación va de 1 a 5 estrellas.', { field: 'puntuacion' });
  }
  const resena = typeof texto === 'string' ? texto.trim() : '';
  if (resena.length > MAX_RESENA) {
    throw badRequest('La reseña es demasiado larga. Resume lo esencial.', { field: 'texto' });
  }

  let vinculo;
  if (curso.propio) {
    if (!(await estaMatriculado(db, userId, curso.aulaCourseId))) {
      throw forbidden('Para calificar este curso tienes que estar inscrito en él.');
    }
    vinculo = 'matriculado';
  } else {
    if (!declaro) {
      throw badRequest('Confirma que hiciste este curso antes de calificarlo.', { field: 'declaro' });
    }
    vinculo = 'declarado';
  }

  const col = columnaDelCurso(curso);
  // El índice único es PARCIAL (solo donde la columna no es nula), y
  // Postgres solo lo usa para resolver el conflicto si se repite aquí su
  // misma condición. Sin el WHERE, el INSERT no encuentra índice que
  // encaje y revienta con un 500 en vez de actualizar.
  const fila = await one(
    db,
    `INSERT INTO opiniones_curso (${col}, user_id, puntuacion, texto, vinculo)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, ${col}) WHERE ${col} IS NOT NULL DO UPDATE
        SET puntuacion = EXCLUDED.puntuacion,
            texto = EXCLUDED.texto,
            updated_at = NOW()
     RETURNING id`,
    [idDelCurso(curso), userId, nota, resena || null, vinculo],
  );
  return fila.id;
}

export async function borrarMiOpinionDeCurso(db, curso, userId) {
  await db.query(
    `DELETE FROM opiniones_curso WHERE ${columnaDelCurso(curso)} = $1 AND user_id = $2`,
    [idDelCurso(curso), userId],
  );
}

/* ── 2 y 4. Comentarios ───────────────────────────────────── */

function comentarioPublico(fila, yo, esModerador) {
  // Un comentario retirado deja su hueco, para que las respuestas no
  // queden colgando de la nada, pero no enseña lo que decía.
  const retirado = fila.estado !== 'publicado';
  return {
    id: fila.id,
    cuerpo: retirado ? null : fila.cuerpo,
    retirado,
    padreId: fila.padre_id,
    autor: { nombre: nombrePublico(fila), iniciales: iniciales(fila) },
    fecha: fila.created_at,
    editado: Boolean(fila.editado_at),
    mio: yo ? fila.user_id === yo : false,
    puedoModerar: Boolean(esModerador),
  };
}

const SELECT_COMENTARIO = (tabla) => `
  SELECT c.id, c.cuerpo, c.padre_id, c.estado, c.editado_at, c.created_at,
         c.user_id, u.first_name, u.last_name, u.email
    FROM ${tabla} c
    JOIN aula_users u ON u.id = c.user_id`;

/** Comentarios de la ficha de un curso, en hilos y paginados. */
export async function comentariosDelCurso(db, curso, { pagina = 1, yo = null, esModerador = false } = {}) {
  const col = columnaDelCurso(curso);
  const id = idDelCurso(curso);
  const offset = (Math.max(1, pagina) - 1) * POR_PAGINA;

  // Primero los de primer nivel; sus respuestas van aparte, para no
  // traer un hilo entero solo porque tiene muchas respuestas.
  const raices = await many(
    db,
    `${SELECT_COMENTARIO('comentarios_curso')}
      WHERE c.${col} = $1 AND c.padre_id IS NULL AND c.estado <> 'eliminado'
      ORDER BY c.created_at DESC LIMIT $2 OFFSET $3`,
    [id, POR_PAGINA + 1, offset],
  );
  const hayMas = raices.length > POR_PAGINA;
  const visibles = raices.slice(0, POR_PAGINA);

  const respuestas = visibles.length
    ? await many(
      db,
      `${SELECT_COMENTARIO('comentarios_curso')}
        WHERE c.padre_id = ANY($1) AND c.estado <> 'eliminado'
        ORDER BY c.created_at ASC`,
      [visibles.map((r) => r.id)],
    )
    : [];

  const total = await one(
    db,
    `SELECT COUNT(*)::int AS n FROM comentarios_curso
      WHERE ${col} = $1 AND estado = 'publicado'`,
    [id],
  );

  return {
    total: total.n,
    hayMas,
    comentarios: visibles.map((r) => ({
      ...comentarioPublico(r, yo, esModerador),
      respuestas: respuestas.filter((x) => x.padre_id === r.id).map((x) => comentarioPublico(x, yo, esModerador)),
    })),
  };
}

/** Comentarios de UNA clase. Nunca se mezclan con los de otra. */
export async function comentariosDeLaClase(db, courseId, lessonId, { pagina = 1, yo = null, esModerador = false } = {}) {
  const offset = (Math.max(1, pagina) - 1) * POR_PAGINA;
  const raices = await many(
    db,
    `${SELECT_COMENTARIO('comentarios_clase')}
      WHERE c.course_id = $1 AND c.lesson_id = $2 AND c.padre_id IS NULL AND c.estado <> 'eliminado'
      ORDER BY c.created_at DESC LIMIT $3 OFFSET $4`,
    [courseId, lessonId, POR_PAGINA + 1, offset],
  );
  const hayMas = raices.length > POR_PAGINA;
  const visibles = raices.slice(0, POR_PAGINA);

  const respuestas = visibles.length
    ? await many(
      db,
      `${SELECT_COMENTARIO('comentarios_clase')}
        WHERE c.padre_id = ANY($1) AND c.estado <> 'eliminado' ORDER BY c.created_at ASC`,
      [visibles.map((r) => r.id)],
    )
    : [];

  const total = await one(
    db,
    `SELECT COUNT(*)::int AS n FROM comentarios_clase
      WHERE course_id = $1 AND lesson_id = $2 AND estado = 'publicado'`,
    [courseId, lessonId],
  );

  return {
    total: total.n,
    hayMas,
    comentarios: visibles.map((r) => ({
      ...comentarioPublico(r, yo, esModerador),
      respuestas: respuestas.filter((x) => x.padre_id === r.id).map((x) => comentarioPublico(x, yo, esModerador)),
    })),
  };
}

function validarCuerpo(cuerpo) {
  const texto = typeof cuerpo === 'string' ? cuerpo.trim() : '';
  if (!texto) throw badRequest('Escribe tu pregunta o comentario.', { field: 'cuerpo' });
  if (texto.length > MAX_COMENTARIO) {
    throw badRequest('El comentario es demasiado largo.', { field: 'cuerpo' });
  }
  return texto;
}

/** La respuesta tiene que colgar de un comentario del MISMO sitio. */
async function padreValido(db, tabla, padreId, where, params) {
  if (padreId === null || padreId === undefined) return null;
  const padre = await one(
    db,
    `SELECT id, padre_id FROM ${tabla} WHERE id = $1 AND ${where}`,
    [Number(padreId), ...params],
  );
  if (!padre) throw badRequest('No encontramos el comentario al que respondes.', { field: 'padreId' });
  // Un solo nivel de respuestas: los hilos en árbol se vuelven ilegibles.
  return padre.padre_id ? padre.padre_id : padre.id;
}

export async function comentarCurso(db, curso, userId, { cuerpo, padreId }) {
  const texto = validarCuerpo(cuerpo);
  const col = columnaDelCurso(curso);
  const padre = await padreValido(db, 'comentarios_curso', padreId, `${col} = $2`, [idDelCurso(curso)]);
  const fila = await one(
    db,
    `INSERT INTO comentarios_curso (${col}, user_id, cuerpo, padre_id)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [idDelCurso(curso), userId, texto, padre],
  );
  return fila.id;
}

export async function comentarClase(db, courseId, lessonId, userId, { cuerpo, padreId }) {
  const texto = validarCuerpo(cuerpo);
  const padre = await padreValido(
    db, 'comentarios_clase', padreId, 'course_id = $2 AND lesson_id = $3', [courseId, lessonId],
  );
  const fila = await one(
    db,
    `INSERT INTO comentarios_clase (course_id, lesson_id, user_id, cuerpo, padre_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [courseId, lessonId, userId, texto, padre],
  );
  return fila.id;
}

/**
 * Editar o retirar lo propio. Quien modera puede retirar lo ajeno, pero
 * NO puede reescribirlo: cambiarle las palabras a alguien y dejarlo
 * firmado con su nombre es peor que borrarlo.
 */
export async function editarComentario(db, tabla, id, userId, cuerpo) {
  const texto = validarCuerpo(cuerpo);
  const fila = await one(
    db,
    `UPDATE ${tabla} SET cuerpo = $3, editado_at = NOW()
      WHERE id = $1 AND user_id = $2 AND estado = 'publicado' RETURNING id`,
    [Number(id), userId, texto],
  );
  if (!fila) throw forbidden('Solo puedes editar tus propios comentarios.');
  return fila.id;
}

export async function retirarComentario(db, tabla, id, userId, { esModerador = false } = {}) {
  const fila = await one(
    db,
    `UPDATE ${tabla} SET estado = 'eliminado'
      WHERE id = $1 AND ($2::boolean OR user_id = $3) RETURNING id`,
    [Number(id), esModerador, userId],
  );
  if (!fila) throw forbidden('Solo puedes borrar tus propios comentarios.');
  return fila.id;
}

export async function reportar(db, tipo, objetoId, userId, motivo) {
  await db.query(
    `INSERT INTO reportes_de_contenido (tipo, objeto_id, user_id, motivo)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (tipo, objeto_id, user_id) DO NOTHING`,
    [tipo, Number(objetoId), userId, typeof motivo === 'string' ? motivo.trim().slice(0, 500) || null : null],
  );
}

/* ── 3. Opiniones de una clase ────────────────────────────── */

/**
 * Nota de una clase. Vive aparte y NO entra en la media del curso: no
 * hay ninguna consulta en este archivo que sume las dos tablas.
 */
export async function guardarOpinionDeClase(db, courseId, lessonId, userId, puntuacion) {
  const nota = Number(puntuacion);
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    throw badRequest('La calificación va de 1 a 5 estrellas.', { field: 'puntuacion' });
  }
  await db.query(
    `INSERT INTO opiniones_clase (course_id, lesson_id, user_id, puntuacion)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, lesson_id) DO UPDATE
        SET puntuacion = EXCLUDED.puntuacion, updated_at = NOW()`,
    [courseId, lessonId, userId, nota],
  );
}

export async function opinionesDeLaClase(db, courseId, lessonId, userId) {
  const resumen = await one(
    db,
    `SELECT COUNT(*)::int AS total, ROUND(AVG(puntuacion)::numeric, 1) AS promedio
       FROM opiniones_clase WHERE course_id = $1 AND lesson_id = $2`,
    [courseId, lessonId],
  );
  const mia = userId
    ? await one(db, 'SELECT puntuacion FROM opiniones_clase WHERE lesson_id = $1 AND user_id = $2', [lessonId, userId])
    : null;
  return {
    total: resumen.total,
    promedio: resumen.total ? Number(resumen.promedio) : null,
    mia: mia?.puntuacion ?? null,
  };
}

/* ── Moderación ───────────────────────────────────────────── */

/**
 * La bandeja de quien modera: comentarios de fichas y de clases en una
 * sola lista, con su contexto y cuántas veces los reportaron.
 *
 * Van en UNION porque son dos tablas distintas a propósito, pero quien
 * modera no quiere dos pantallas: quiere una cola de trabajo. El
 * contexto (qué curso, qué clase) viaja con cada fila para no tener que
 * abrir cada una para saber de qué habla.
 */
export async function bandejaDeModeracion(db, { filtro = 'reportados', pagina = 1, porPagina = 20 } = {}) {
  const condicion = {
    // Lo que alguien marcó y nadie ha mirado: la cola real de trabajo.
    reportados: 'r.pendientes > 0',
    publicados: `c.estado = 'publicado'`,
    retirados: `c.estado IN ('eliminado', 'oculto')`,
    todos: 'TRUE',
  }[filtro] || 'r.pendientes > 0';

  const base = (tabla, tipo) => `
    SELECT '${tipo}'::text AS donde, c.id, c.cuerpo, c.estado, c.created_at, c.editado_at,
           c.padre_id, c.user_id,
           u.first_name, u.last_name, u.email,
           ${tipo === 'curso'
    ? `COALESCE(ac.title, cu.title) AS curso, NULL::text AS clase,
               COALESCE('edvanta-' || ac.id, cu.slug) AS ref, NULL::bigint AS course_id, NULL::bigint AS lesson_id`
    : `ac2.title AS curso, l.title AS clase,
               NULL::text AS ref, c.course_id, c.lesson_id`},
           COALESCE(r.pendientes, 0)::int AS reportes
      FROM ${tabla} c
      JOIN aula_users u ON u.id = c.user_id
      ${tipo === 'curso'
    ? `LEFT JOIN aula_courses ac ON ac.id = c.aula_course_id
         LEFT JOIN courses cu ON cu.id = c.curso_id`
    : `JOIN aula_courses ac2 ON ac2.id = c.course_id
         JOIN aula_lessons l ON l.id = c.lesson_id`}
      LEFT JOIN (
        SELECT objeto_id, COUNT(*)::int AS pendientes
          FROM reportes_de_contenido
         WHERE tipo = 'comentario_${tipo}' AND resuelto_at IS NULL
         GROUP BY objeto_id
      ) r ON r.objeto_id = c.id
     WHERE ${condicion}`;

  const filas = await many(
    db,
    `${base('comentarios_curso', 'curso')}
     UNION ALL
     ${base('comentarios_clase', 'clase')}
     ORDER BY reportes DESC, created_at DESC
     LIMIT $1 OFFSET $2`,
    [porPagina + 1, (Math.max(1, pagina) - 1) * porPagina],
  );

  const hayMas = filas.length > porPagina;
  // La dirección pública de cada curso (/curso-de-…), en una sola consulta.
  const rutas = await rutasDeReferencias(db, filas.map((f) => f.donde === 'curso' && f.ref));
  return {
    hayMas,
    comentarios: filas.slice(0, porPagina).map((f) => ({
      id: f.id,
      donde: f.donde,
      cuerpo: f.cuerpo,
      estado: f.estado,
      esRespuesta: Boolean(f.padre_id),
      reportes: f.reportes,
      fecha: f.created_at,
      editado: Boolean(f.editado_at),
      autor: { nombre: nombrePublico(f), iniciales: iniciales(f) },
      // Lo que hace falta para responder sin salir de la bandeja.
      refCurso: f.ref,
      courseId: f.course_id,
      lessonId: f.lesson_id,
      contexto: {
        curso: f.curso,
        clase: f.clase,
        // A dónde ir para verlo en su sitio.
        url: f.donde === 'curso'
          ? (rutas.get(f.ref) || (f.ref?.startsWith('edvanta-') ? `/curso/${f.ref.replace('edvanta-', '')}` : `/cursos/${f.ref}`))
          : `/aula/curso/${f.course_id}/clase/${f.lesson_id}`,
      },
    })),
  };
}

/** Cuánto hay pendiente, para saber si hay trabajo sin abrir la lista. */
export async function pendientesDeModerar(db) {
  const fila = await one(
    db,
    `SELECT COUNT(*)::int AS n FROM reportes_de_contenido WHERE resuelto_at IS NULL`,
  );
  return fila.n;
}

/**
 * Devolver a la vista algo que se retiró.
 *
 * Quien modera se equivoca, y sin esto la única salida sería ir a la
 * base de datos. Un botón de retirar sin su contrario convierte cada
 * clic en definitivo.
 */
export async function restaurarComentario(db, tabla, id) {
  const fila = await one(
    db,
    `UPDATE ${tabla} SET estado = 'publicado' WHERE id = $1 RETURNING id`,
    [Number(id)],
  );
  if (!fila) throw notFound('No encontramos ese comentario.');
  return fila.id;
}

/**
 * Dar un reporte por visto sin tocar el comentario: no todo lo que se
 * reporta está mal. Sin esto, la cola solo se vacía borrando.
 */
export async function resolverReportes(db, tipo, objetoId, moderadorId) {
  await db.query(
    `UPDATE reportes_de_contenido
        SET resuelto_at = NOW()
      WHERE tipo = $1 AND objeto_id = $2 AND resuelto_at IS NULL`,
    [tipo, Number(objetoId)],
  );
  return { ok: true, por: moderadorId };
}

/** Quién reportó y por qué, para decidir con criterio. */
export async function motivosDeReporte(db, tipo, objetoId) {
  return many(
    db,
    `SELECT r.motivo, r.created_at, u.first_name, u.last_name, u.email
       FROM reportes_de_contenido r
       JOIN aula_users u ON u.id = r.user_id
      WHERE r.tipo = $1 AND r.objeto_id = $2 AND r.resuelto_at IS NULL
      ORDER BY r.created_at DESC`,
    [tipo, Number(objetoId)],
  ).then((filas) => filas.map((f) => ({
    motivo: f.motivo,
    fecha: f.created_at,
    quien: nombrePublico(f),
  })));
}

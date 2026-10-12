/**
 * ============================================================
 *  opiniones.js — Rutas de las cuatro formas de participar
 *
 *  Van bajo /api/aula aunque la ficha de curso viva fuera del aula,
 *  porque aquí ya están resueltos la sesión por cookie httpOnly y el
 *  encabezado anti-CSRF. Montar un segundo sistema de sesión para la
 *  ficha sería duplicar justo la parte donde más caro sale un error.
 *
 *  Leer es público: cualquiera puede ver opiniones y preguntas sin
 *  cuenta. Escribir necesita sesión, y lo comprueba el servidor en cada
 *  ruta, no el botón que se pinta.
 * ============================================================
 */

import express from 'express';
import { id as idField, int, route } from '../../lib/aula/http.js';
import { unauthorized } from '../../lib/aula/http.js';
import { requireOpenEnrollment } from '../../lib/aula/access.js';
import {
  borrarMiOpinionDeCurso, comentarClase, comentarCurso, comentariosDeLaClase,
  comentariosDelCurso, editarComentario, guardarOpinionDeClase, guardarOpinionDeCurso,
  miOpinionDelCurso, opinionesDeLaClase, opinionesDelCurso, reportar, resolverCurso,
  retirarComentario,
} from '../../lib/aula/opiniones.js';

/** Quien no ha entrado puede leer; para escribir hace falta sesión. */
const exigeSesion = (req) => {
  if (!req.aula?.user) throw unauthorized();
  return req.aula.user;
};

const esModerador = (req) => req.aula?.user?.role === 'admin';
const yo = (req) => req.aula?.user?.id || null;

const pagina = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : 1;
};

export function opinionesRouter() {
  const router = express.Router();

  /* ── Curso: leer (público) ──────────────────────────────── */

  router.get('/curso/:ref', route(async (req, res) => {
    const { db } = req.aula;
    const curso = await resolverCurso(db, req.params.ref);
    const [valoraciones, comentarios, mia] = await Promise.all([
      opinionesDelCurso(db, curso, { yo: yo(req) }),
      comentariosDelCurso(db, curso, { yo: yo(req), esModerador: esModerador(req) }),
      yo(req) ? miOpinionDelCurso(db, curso, yo(req)) : null,
    ]);
    res.json({
      ...valoraciones,
      comentarios,
      miOpinion: mia,
      // Lo que esta persona puede hacer aquí, decidido en el servidor.
      puedo: {
        opinar: Boolean(yo(req)),
        comentar: Boolean(yo(req)),
        moderar: esModerador(req),
      },
      // En un curso propio hay que estar matriculado; en uno externo se
      // declara haberlo hecho. La ficha necesita saberlo para pedir una
      // cosa u otra antes de enviar.
      exigeMatricula: curso.propio,
    });
  }));

  router.get('/curso/:ref/opiniones', route(async (req, res) => {
    const { db } = req.aula;
    const curso = await resolverCurso(db, req.params.ref);
    const estrellas = req.query.estrellas ? int(req.query.estrellas, 'estrellas', 'El filtro', { min: 1, max: 5 }) : null;
    res.json(await opinionesDelCurso(db, curso, {
      pagina: pagina(req.query.pagina),
      orden: req.query.orden === 'utiles' ? 'utiles' : 'recientes',
      estrellas,
      yo: yo(req),
    }));
  }));

  router.get('/curso/:ref/comentarios', route(async (req, res) => {
    const { db } = req.aula;
    const curso = await resolverCurso(db, req.params.ref);
    res.json(await comentariosDelCurso(db, curso, {
      pagina: pagina(req.query.pagina), yo: yo(req), esModerador: esModerador(req),
    }));
  }));

  /* ── Curso: escribir (con sesión) ───────────────────────── */

  router.put('/curso/:ref/mi-opinion', route(async (req, res) => {
    const user = exigeSesion(req);
    const { db } = req.aula;
    const curso = await resolverCurso(db, req.params.ref);
    await guardarOpinionDeCurso(db, curso, user.id, {
      puntuacion: req.body?.puntuacion,
      texto: req.body?.texto,
      declaro: Boolean(req.body?.declaro),
    });
    // Se devuelve el resumen recalculado: así la página no inventa la
    // media nueva sumando a ojo lo que acaba de enviar.
    const { resumen } = await opinionesDelCurso(db, curso, { yo: user.id });
    res.json({ ok: true, resumen, miOpinion: await miOpinionDelCurso(db, curso, user.id) });
  }));

  router.delete('/curso/:ref/mi-opinion', route(async (req, res) => {
    const user = exigeSesion(req);
    const { db } = req.aula;
    const curso = await resolverCurso(db, req.params.ref);
    await borrarMiOpinionDeCurso(db, curso, user.id);
    const { resumen } = await opinionesDelCurso(db, curso, { yo: user.id });
    res.json({ ok: true, resumen, miOpinion: null });
  }));

  router.post('/curso/:ref/comentarios', route(async (req, res) => {
    const user = exigeSesion(req);
    const { db } = req.aula;
    const curso = await resolverCurso(db, req.params.ref);
    await comentarCurso(db, curso, user.id, { cuerpo: req.body?.cuerpo, padreId: req.body?.padreId ?? null });
    res.status(201).json(await comentariosDelCurso(db, curso, {
      yo: user.id, esModerador: esModerador(req),
    }));
  }));

  /* ── Clase: dentro del aula, con matrícula ──────────────── */

  const claseDe = async (req) => {
    const user = exigeSesion(req);
    const courseId = idField(req.params.courseId, 'courseId', 'El curso');
    const lessonId = idField(req.params.lessonId, 'lessonId', 'La clase');
    // Que la clase sea de ese curso lo garantiza la clave foránea
    // compuesta; que esta persona pueda verla, esto.
    if (user.role !== 'admin') {
      await requireOpenEnrollment(req.aula.db, user, courseId, { now: req.aula.now });
    }
    return { user, courseId, lessonId };
  };

  router.get('/clase/:courseId/:lessonId', route(async (req, res) => {
    const { user, courseId, lessonId } = await claseDe(req);
    const { db } = req.aula;
    const [comentarios, nota] = await Promise.all([
      comentariosDeLaClase(db, courseId, lessonId, {
        pagina: pagina(req.query.pagina), yo: user.id, esModerador: esModerador(req),
      }),
      opinionesDeLaClase(db, courseId, lessonId, user.id),
    ]);
    res.json({ comentarios, nota, puedo: { comentar: true, opinar: true, moderar: esModerador(req) } });
  }));

  router.post('/clase/:courseId/:lessonId/comentarios', route(async (req, res) => {
    const { user, courseId, lessonId } = await claseDe(req);
    const { db } = req.aula;
    await comentarClase(db, courseId, lessonId, user.id, {
      cuerpo: req.body?.cuerpo, padreId: req.body?.padreId ?? null,
    });
    res.status(201).json(await comentariosDeLaClase(db, courseId, lessonId, {
      yo: user.id, esModerador: esModerador(req),
    }));
  }));

  router.put('/clase/:courseId/:lessonId/mi-nota', route(async (req, res) => {
    const { user, courseId, lessonId } = await claseDe(req);
    const { db } = req.aula;
    await guardarOpinionDeClase(db, courseId, lessonId, user.id, req.body?.puntuacion);
    res.json(await opinionesDeLaClase(db, courseId, lessonId, user.id));
  }));

  /* ── Editar, retirar y reportar ─────────────────────────── */

  const TABLAS = { curso: 'comentarios_curso', clase: 'comentarios_clase' };

  router.patch('/comentarios/:donde/:id', route(async (req, res) => {
    const user = exigeSesion(req);
    const tabla = TABLAS[req.params.donde];
    if (!tabla) return res.status(404).json({ error: { message: 'No existe esa ruta.' } });
    // Editar es solo de lo propio, incluso para quien modera: cambiarle
    // las palabras a alguien y dejarlo con su nombre es peor que borrarlo.
    await editarComentario(req.aula.db, tabla, req.params.id, user.id, req.body?.cuerpo);
    return res.json({ ok: true });
  }));

  router.delete('/comentarios/:donde/:id', route(async (req, res) => {
    const user = exigeSesion(req);
    const tabla = TABLAS[req.params.donde];
    if (!tabla) return res.status(404).json({ error: { message: 'No existe esa ruta.' } });
    await retirarComentario(req.aula.db, tabla, req.params.id, user.id, { esModerador: esModerador(req) });
    return res.json({ ok: true });
  }));

  router.post('/reportes/:tipo/:id', route(async (req, res) => {
    const user = exigeSesion(req);
    const tipos = ['comentario_curso', 'comentario_clase', 'opinion_curso'];
    if (!tipos.includes(req.params.tipo)) {
      return res.status(404).json({ error: { message: 'No existe ese tipo de reporte.' } });
    }
    await reportar(req.aula.db, req.params.tipo, req.params.id, user.id, req.body?.motivo);
    return res.status(201).json({ ok: true });
  }));

  return router;
}

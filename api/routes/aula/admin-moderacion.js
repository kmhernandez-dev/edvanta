/**
 * ============================================================
 *  admin-moderacion.js — La bandeja de quien modera
 *
 *  Una cola de trabajo, no dos pantallas: los comentarios de las fichas
 *  y los de las clases llegan juntos, ordenados por lo que más urge
 *  —lo reportado y sin mirar va primero—.
 *
 *  Tres acciones, y las tres tienen vuelta atrás salvo la de responder:
 *  retirar, restaurar y dar el reporte por visto. Un botón de retirar
 *  sin su contrario convierte cada clic en definitivo, y quien modera
 *  se equivoca como todo el mundo.
 *
 *  Lo que NO hay aquí, a propósito: editar el comentario de otra
 *  persona. Cambiarle las palabras y dejarlas firmadas con su nombre es
 *  peor que retirarlo.
 * ============================================================
 */

import express from 'express';
import { route } from '../../lib/aula/http.js';
import {
  bandejaDeModeracion, comentarClase, comentarCurso, motivosDeReporte,
  pendientesDeModerar, resolverCurso, resolverReportes, restaurarComentario,
  retirarComentario,
} from '../../lib/aula/opiniones.js';

const TABLAS = { curso: 'comentarios_curso', clase: 'comentarios_clase' };
const TIPOS = { curso: 'comentario_curso', clase: 'comentario_clase' };

export function adminModeracionRouter() {
  const router = express.Router();

  /** La cola. `filtro`: reportados | publicados | retirados | todos. */
  router.get('/moderacion', route(async (req, res) => {
    const { db } = req.aula;
    const pagina = Number(req.query.pagina) > 0 ? Number(req.query.pagina) : 1;
    const [bandeja, pendientes] = await Promise.all([
      bandejaDeModeracion(db, { filtro: String(req.query.filtro || 'reportados'), pagina }),
      pendientesDeModerar(db),
    ]);
    res.json({ ...bandeja, pendientes });
  }));

  /** Quién reportó algo y por qué, para decidir con criterio. */
  router.get('/moderacion/:donde/:id/reportes', route(async (req, res) => {
    const tipo = TIPOS[req.params.donde];
    if (!tipo) return res.status(404).json({ error: { message: 'No existe esa ruta.' } });
    return res.json({ motivos: await motivosDeReporte(req.aula.db, tipo, req.params.id) });
  }));

  router.post('/moderacion/:donde/:id/retirar', route(async (req, res) => {
    const tabla = TABLAS[req.params.donde];
    if (!tabla) return res.status(404).json({ error: { message: 'No existe esa ruta.' } });
    await retirarComentario(req.aula.db, tabla, req.params.id, req.aula.user.id, { esModerador: true });
    // Retirar cierra el aviso: ya se actuó, no hace falta volver a verlo.
    await resolverReportes(req.aula.db, TIPOS[req.params.donde], req.params.id, req.aula.user.id);
    return res.json({ ok: true });
  }));

  router.post('/moderacion/:donde/:id/restaurar', route(async (req, res) => {
    const tabla = TABLAS[req.params.donde];
    if (!tabla) return res.status(404).json({ error: { message: 'No existe esa ruta.' } });
    await restaurarComentario(req.aula.db, tabla, req.params.id);
    return res.json({ ok: true });
  }));

  /** El reporte era infundado: se da por visto sin tocar el comentario. */
  router.post('/moderacion/:donde/:id/descartar-reporte', route(async (req, res) => {
    const tipo = TIPOS[req.params.donde];
    if (!tipo) return res.status(404).json({ error: { message: 'No existe esa ruta.' } });
    await resolverReportes(req.aula.db, tipo, req.params.id, req.aula.user.id);
    return res.json({ ok: true });
  }));

  /**
   * Responder desde la bandeja, sin ir hasta la página del curso.
   *
   * La respuesta se publica con el nombre de quien modera, como
   * cualquier otra: no hay una voz anónima de «Edvanta» que no
   * corresponda a nadie.
   */
  router.post('/moderacion/curso/:ref/responder', route(async (req, res) => {
    const { db, user } = req.aula;
    const curso = await resolverCurso(db, req.params.ref);
    const id = await comentarCurso(db, curso, user.id, {
      cuerpo: req.body?.cuerpo, padreId: req.body?.padreId ?? null,
    });
    res.status(201).json({ ok: true, id });
  }));

  router.post('/moderacion/clase/:courseId/:lessonId/responder', route(async (req, res) => {
    const { db, user } = req.aula;
    const id = await comentarClase(db, Number(req.params.courseId), Number(req.params.lessonId), user.id, {
      cuerpo: req.body?.cuerpo, padreId: req.body?.padreId ?? null,
    });
    res.status(201).json({ ok: true, id });
  }));

  return router;
}

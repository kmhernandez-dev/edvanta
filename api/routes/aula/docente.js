/**
 * Rutas de docentes. El rol solo abre la puerta: cada operación vuelve a
 * comprobar la asignación docente al curso en el servidor.
 */
import express from 'express';
import { id as idField, oneOf, route, str } from '../../lib/aula/http.js';
import {
  gradeForum, hideForumPost, listCourseTeachers, teacherCourseOverview, teacherCourses,
  teacherForum, teacherSubmission, teacherSubmissions, reviewSubmission,
} from '../../lib/aula/pedagogia.js';

const courseIdOf = (req) => idField(req.params.courseId, 'courseId', 'El curso');
const idOf = (req, name) => idField(req.params[name], name, 'El identificador');

export function docenteRouter() {
  const router = express.Router();

  router.get('/courses', route(async (req, res) => {
    res.json(await teacherCourses(req.aula.db, req.aula.user));
  }));

  router.get('/courses/:courseId', route(async (req, res) => {
    res.json(await teacherCourseOverview(req.aula.db, req.aula.user, courseIdOf(req), { now: req.aula.now }));
  }));

  router.get('/courses/:courseId/teachers', route(async (req, res) => {
    // Solo administración puede ver el listado completo de docentes.
    if (req.aula.user.role !== 'admin') {
      return res.json(await listCourseTeachers(req.aula.db, courseIdOf(req)).then((rows) => rows.filter((r) => r.user_id === req.aula.user.id)));
    }
    return res.json(await listCourseTeachers(req.aula.db, courseIdOf(req)));
  }));

  router.get('/courses/:courseId/submissions', route(async (req, res) => {
    const status = req.query.status ? str(req.query.status, 'status', 'El estado', { max: 40, optional: true }) : null;
    res.json(await teacherSubmissions(req.aula.db, req.aula.user, courseIdOf(req), { status }));
  }));

  router.get('/submissions/:submissionId', route(async (req, res) => {
    res.json(await teacherSubmission(req.aula.db, req.aula.user, idOf(req, 'submissionId')));
  }));

  router.post('/submissions/:submissionId/review', route(async (req, res) => {
    res.json(await reviewSubmission(req.aula.db, req.aula.user, idOf(req, 'submissionId'), req.body, {
      ip: req.aula.ip, now: req.aula.now,
    }));
  }));

  router.get('/forums/:forumId', route(async (req, res) => {
    res.json(await teacherForum(req.aula.db, req.aula.user, idOf(req, 'forumId')));
  }));

  router.post('/forums/:forumId/grade', route(async (req, res) => {
    res.json(await gradeForum(req.aula.db, req.aula.user, idOf(req, 'forumId'), req.body, {
      ip: req.aula.ip, now: req.aula.now,
    }));
  }));

  router.post('/forum-posts/:postId/hide', route(async (req, res) => {
    const reason = str(req.body?.reason, 'reason', 'El motivo', { max: 500, optional: true });
    res.json(await hideForumPost(req.aula.db, req.aula.user, idOf(req, 'postId'), reason, {
      ip: req.aula.ip, now: req.aula.now,
    }));
  }));

  return router;
}

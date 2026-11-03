/**
 * Rutas del participante para la capa pedagógica.
 *
 * Montadas bajo /api/aula/me. Todas las operaciones exigen matrícula
 * abierta; el ID del estudiante nunca llega desde el cliente.
 */
import express from 'express';
import { id as idField, route } from '../../lib/aula/http.js';
import {
  activityForStudent, assessmentDetail, assessmentList, attemptResult, forumForStudent,
  pedagogyOverview, saveActivityDraft, saveAttempt, startAttempt, submitActivity, submitAttempt,
  createForumPost, replyForumPost,
} from '../../lib/aula/pedagogia.js';

const courseIdOf = (req) => idField(req.params.courseId, 'courseId', 'El curso');
const idOf = (req, name) => idField(req.params[name], name, 'El identificador');

export function pedagogiaRouter() {
  const router = express.Router();

  router.get('/courses/:courseId/pedagogy', route(async (req, res) => {
    res.json(await pedagogyOverview(req.aula.db, req.aula.user, courseIdOf(req), { now: req.aula.now }));
  }));

  // ── Quizzes ──────────────────────────────────────────────────────────
  router.get('/courses/:courseId/assessments', route(async (req, res) => {
    res.json(await assessmentList(req.aula.db, req.aula.user, courseIdOf(req), { now: req.aula.now }));
  }));

  router.get('/courses/:courseId/assessments/:assessmentId', route(async (req, res) => {
    res.json(await assessmentDetail(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'assessmentId'), { now: req.aula.now },
    ));
  }));

  router.post('/courses/:courseId/assessments/:assessmentId/attempts', route(async (req, res) => {
    const result = await startAttempt(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'assessmentId'), { now: req.aula.now },
    );
    res.status(result.resumed ? 200 : 201).json(result);
  }));

  router.get('/courses/:courseId/assessments/:assessmentId/attempt', route(async (req, res) => {
    const detail = await assessmentDetail(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'assessmentId'), { now: req.aula.now },
    );
    res.json({ attempt: detail.openAttempt });
  }));

  router.put('/courses/:courseId/assessments/:assessmentId/attempt', route(async (req, res) => {
    res.json(await saveAttempt(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'assessmentId'), req.body?.answers,
      { now: req.aula.now },
    ));
  }));

  router.post('/courses/:courseId/assessments/:assessmentId/attempt/submit', route(async (req, res) => {
    const result = await submitAttempt(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'assessmentId'), req.body?.answers,
      { now: req.aula.now },
    );
    res.status(result.alreadySubmitted ? 200 : 201).json(result);
  }));

  router.get('/courses/:courseId/assessments/:assessmentId/attempts/:attemptId', route(async (req, res) => {
    res.json(await attemptResult(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'assessmentId'), idOf(req, 'attemptId'),
      { now: req.aula.now },
    ));
  }));

  // ── Actividades ──────────────────────────────────────────────────────
  router.get('/courses/:courseId/activities/:activityId', route(async (req, res) => {
    res.json(await activityForStudent(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'activityId'), { now: req.aula.now },
    ));
  }));

  router.put('/courses/:courseId/activities/:activityId/draft', route(async (req, res) => {
    res.json(await saveActivityDraft(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'activityId'), req.body,
      { now: req.aula.now },
    ));
  }));

  router.post('/courses/:courseId/activities/:activityId/submissions', route(async (req, res) => {
    res.status(201).json(await submitActivity(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'activityId'), req.body,
      { now: req.aula.now },
    ));
  }));

  // ── Foros ────────────────────────────────────────────────────────────
  router.get('/courses/:courseId/forums/:forumId', route(async (req, res) => {
    res.json(await forumForStudent(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'forumId'), { now: req.aula.now },
    ));
  }));

  router.post('/courses/:courseId/forums/:forumId/posts', route(async (req, res) => {
    res.status(201).json(await createForumPost(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'forumId'), req.body, { now: req.aula.now },
    ));
  }));

  router.post('/courses/:courseId/forums/:forumId/posts/:postId/replies', route(async (req, res) => {
    res.status(201).json(await replyForumPost(
      req.aula.db, req.aula.user, courseIdOf(req), idOf(req, 'forumId'), idOf(req, 'postId'),
      req.body, { now: req.aula.now },
    ));
  }));

  return router;
}

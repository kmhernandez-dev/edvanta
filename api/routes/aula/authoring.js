/**
 * Rutas de autoría del curso. Se montan bajo /admin/authoring y
 * /docente/authoring; cada función vuelve a comprobar en el servidor
 * que la persona administra o tiene asignación docente al curso.
 */
import express from 'express';
import { id as idField, int, route, str } from '../../lib/aula/http.js';
import {
  activityEditor, archiveActivity, archiveForum, archiveQuiz, authoringData, closeForum,
  createActivity, createForum, createQuiz, duplicateActivity, duplicateForum, duplicateQuiz,
  forumEditor, getAcademicConfig, gradebook, moveActivity, moveForum, moveQuiz,
  overrideAttemptScore, participationOverview, publishActivity, publishForum, publishQuiz,
  quizEditor, readActivity, readForum, readQuiz, reviewQueue, updateAcademicConfig,
  updateActivity, updateForum, updateQuiz,
} from '../../lib/aula/authoring.js';

const courseIdOf = (req) => idField(req.params.courseId, 'courseId', 'El curso');
const idOf = (req, name) => idField(req.params[name], name, 'El identificador');
const ctx = (req) => ({ actor: req.aula.user, ip: req.aula.ip, now: req.aula.now });

function optionalId(value, field) {
  return value ? idField(value, field, 'El filtro') : null;
}

export function authoringRouter() {
  const router = express.Router();

  router.get('/courses/:courseId', route(async (req, res) => {
    res.json(await authoringData(req.aula.db, req.aula.user, courseIdOf(req)));
  }));

  router.get('/courses/:courseId/academic-config', route(async (req, res) => {
    res.json(await getAcademicConfig(req.aula.db, req.aula.user, courseIdOf(req)));
  }));

  router.patch('/courses/:courseId/academic-config', route(async (req, res) => {
    res.json(await updateAcademicConfig(req.aula.db, req.aula.user, courseIdOf(req), req.body, ctx(req)));
  }));

  router.get('/courses/:courseId/gradebook', route(async (req, res) => {
    res.json(await gradebook(req.aula.db, req.aula.user, courseIdOf(req), req.query));
  }));

  router.get('/courses/:courseId/review', route(async (req, res) => {
    res.json(await reviewQueue(req.aula.db, req.aula.user, courseIdOf(req), {
      status: req.query.status ? str(req.query.status, 'status', 'El estado', { max: 40, optional: true }) : null,
      moduleId: optionalId(req.query.moduleId, 'moduleId'),
      activityId: optionalId(req.query.activityId, 'activityId'),
      studentId: optionalId(req.query.studentId, 'studentId'),
      q: req.query.q ? str(req.query.q, 'q', 'La búsqueda', { max: 120, optional: true }) : null,
      page: req.query.page,
      pageSize: req.query.pageSize,
    }));
  }));

  router.get('/courses/:courseId/participation', route(async (req, res) => {
    res.json(await participationOverview(req.aula.db, req.aula.user, courseIdOf(req), {
      moduleId: optionalId(req.query.moduleId, 'moduleId'),
    }));
  }));

  // ── Quizzes ────────────────────────────────────────────────
  router.post('/courses/:courseId/quizzes', route(async (req, res) => {
    res.status(201).json(await createQuiz(req.aula.db, req.aula.user, courseIdOf(req), readQuiz(req.body), ctx(req)));
  }));
  router.get('/quizzes/:quizId', route(async (req, res) => {
    res.json(await quizEditor(req.aula.db, req.aula.user, idOf(req, 'quizId')));
  }));
  router.patch('/quizzes/:quizId', route(async (req, res) => {
    res.json(await updateQuiz(req.aula.db, req.aula.user, idOf(req, 'quizId'), readQuiz(req.body, { partial: true }), ctx(req)));
  }));
  router.post('/quizzes/:quizId/publish', route(async (req, res) => {
    res.json(await publishQuiz(req.aula.db, req.aula.user, idOf(req, 'quizId'), ctx(req)));
  }));
  router.post('/quizzes/:quizId/archive', route(async (req, res) => {
    res.json(await archiveQuiz(req.aula.db, req.aula.user, idOf(req, 'quizId'), req.body?.reason, ctx(req)));
  }));
  router.post('/quizzes/:quizId/duplicate', route(async (req, res) => {
    res.status(201).json(await duplicateQuiz(req.aula.db, req.aula.user, idOf(req, 'quizId'), ctx(req)));
  }));
  router.post('/quizzes/:quizId/move', route(async (req, res) => {
    res.json(await moveQuiz(
      req.aula.db, req.aula.user, idOf(req, 'quizId'),
      idField(req.body?.moduleId, 'moduleId', 'La unidad'),
      int(req.body?.position ?? 0, 'position', 'La posición', { min: 0, optional: true }),
      ctx(req),
    ));
  }));
  router.get('/quizzes/:quizId/preview', route(async (req, res) => {
    const data = await quizEditor(req.aula.db, req.aula.user, idOf(req, 'quizId'));
    res.json({
      quiz: { ...data.quiz, preview: true },
      questions: data.questions.map((q) => ({
        id: q.id, promptHtml: q.promptHtml, points: q.points, explanation: q.explanation,
        generalFeedback: q.generalFeedback,
        options: q.options.map((o) => ({ id: o.id, text: o.text })),
      })),
    });
  }));

  // ── Actividades ─────────────────────────────────────────────
  router.post('/courses/:courseId/activities', route(async (req, res) => {
    res.status(201).json(await createActivity(req.aula.db, req.aula.user, courseIdOf(req), readActivity(req.body), ctx(req)));
  }));
  router.get('/activities/:activityId', route(async (req, res) => {
    res.json(await activityEditor(req.aula.db, req.aula.user, idOf(req, 'activityId')));
  }));
  router.patch('/activities/:activityId', route(async (req, res) => {
    res.json(await updateActivity(req.aula.db, req.aula.user, idOf(req, 'activityId'), readActivity(req.body, { partial: true }), ctx(req)));
  }));
  router.post('/activities/:activityId/publish', route(async (req, res) => {
    res.json(await publishActivity(req.aula.db, req.aula.user, idOf(req, 'activityId'), ctx(req)));
  }));
  router.post('/activities/:activityId/archive', route(async (req, res) => {
    res.json(await archiveActivity(req.aula.db, req.aula.user, idOf(req, 'activityId'), req.body?.reason, ctx(req)));
  }));
  router.post('/activities/:activityId/duplicate', route(async (req, res) => {
    res.status(201).json(await duplicateActivity(req.aula.db, req.aula.user, idOf(req, 'activityId'), ctx(req)));
  }));
  router.post('/activities/:activityId/move', route(async (req, res) => {
    res.json(await moveActivity(
      req.aula.db, req.aula.user, idOf(req, 'activityId'),
      idField(req.body?.moduleId, 'moduleId', 'La unidad'),
      int(req.body?.position ?? 0, 'position', 'La posición', { min: 0, optional: true }),
      ctx(req),
    ));
  }));
  router.get('/activities/:activityId/preview', route(async (req, res) => {
    const data = await activityEditor(req.aula.db, req.aula.user, idOf(req, 'activityId'));
    res.json({
      activity: {
        ...data.activity, teacherGuideHtml: undefined, preview: true,
      },
    });
  }));

  // ── Foros ──────────────────────────────────────────────────
  router.post('/courses/:courseId/forums', route(async (req, res) => {
    res.status(201).json(await createForum(req.aula.db, req.aula.user, courseIdOf(req), readForum(req.body), ctx(req)));
  }));
  router.get('/forums/:forumId', route(async (req, res) => {
    res.json(await forumEditor(req.aula.db, req.aula.user, idOf(req, 'forumId')));
  }));
  router.patch('/forums/:forumId', route(async (req, res) => {
    res.json(await updateForum(req.aula.db, req.aula.user, idOf(req, 'forumId'), readForum(req.body, { partial: true }), ctx(req)));
  }));
  router.post('/forums/:forumId/publish', route(async (req, res) => {
    res.json(await publishForum(req.aula.db, req.aula.user, idOf(req, 'forumId'), ctx(req)));
  }));
  router.post('/forums/:forumId/archive', route(async (req, res) => {
    res.json(await archiveForum(req.aula.db, req.aula.user, idOf(req, 'forumId'), req.body?.reason, ctx(req)));
  }));
  router.post('/forums/:forumId/duplicate', route(async (req, res) => {
    res.status(201).json(await duplicateForum(req.aula.db, req.aula.user, idOf(req, 'forumId'), ctx(req)));
  }));
  router.post('/forums/:forumId/close', route(async (req, res) => {
    res.json(await closeForum(req.aula.db, req.aula.user, idOf(req, 'forumId'), Boolean(req.body?.closed), ctx(req)));
  }));
  router.post('/forums/:forumId/move', route(async (req, res) => {
    res.json(await moveForum(
      req.aula.db, req.aula.user, idOf(req, 'forumId'),
      idField(req.body?.moduleId, 'moduleId', 'La unidad'),
      int(req.body?.position ?? 0, 'position', 'La posición', { min: 0, optional: true }),
      ctx(req),
    ));
  }));
  router.get('/forums/:forumId/preview', route(async (req, res) => {
    const data = await forumEditor(req.aula.db, req.aula.user, idOf(req, 'forumId'));
    res.json({ forum: { ...data.forum, preview: true } });
  }));

  // ── Rectificación excepcional de un intento ─────────────────
  router.post('/attempts/:attemptId/override', route(async (req, res) => {
    res.json(await overrideAttemptScore(req.aula.db, req.aula.user, idOf(req, 'attemptId'), req.body, ctx(req)));
  }));

  return router;
}

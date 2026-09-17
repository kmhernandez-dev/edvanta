import express from 'express';
import { closedReason } from '../../lib/aula/access.js';
import { many } from '../../lib/aula/db.js';
import { id as idField, int, route } from '../../lib/aula/http.js';
import {
  addLessonTime, completeLesson, courseForParticipant, openLesson, reportVideo,
} from '../../lib/aula/learning.js';
import { participantResources } from '../../lib/aula/resources.js';

const ids = (req) => ({
  courseId: idField(req.params.courseId, 'courseId', 'El curso'),
  lessonId: req.params.lessonId ? idField(req.params.lessonId, 'lessonId', 'La clase') : null,
});

export function meRouter() {
  const router = express.Router();

  // Cursos asignados al participante (sin los retirados).
  router.get('/courses', route(async (req, res) => {
    const { db, user, now } = req.aula;
    const rows = await many(
      db,
      `SELECT e.id AS enrollment_id, e.course_id, e.effective_status, e.progress_pct,
              e.lessons_done, e.lessons_required, e.assessments_passed, e.assessments_required,
              e.activities_approved, e.activities_required, e.due_at, e.starts_at,
              e.last_access_at, e.completed_at, e.course_version_id,
              c.title, c.short_description, c.cover_file_id, c.kind, c.duration_minutes,
              c.status AS course_status, c.deleted_at AS course_deleted_at, c.current_version_id,
              c.available_from, c.available_until, co.name AS company_name
         FROM aula_enrollments_v e
         JOIN aula_courses c ON c.id = e.course_id
         LEFT JOIN aula_companies co ON co.id = c.company_id
        WHERE e.user_id = $1 AND e.withdrawn_at IS NULL AND c.deleted_at IS NULL
        ORDER BY (e.effective_status IN ('completado')) ASC, e.due_at ASC NULLS LAST, e.assigned_at DESC`,
      [user.id],
    );
    res.json(rows.map((r) => {
      const closed = closedReason(r, now);
      return {
        enrollmentId: r.enrollment_id,
        courseId: r.course_id,
        title: r.title,
        shortDescription: r.short_description,
        coverFileId: r.cover_file_id,
        kind: r.kind,
        companyName: r.company_name,
        durationMinutes: r.duration_minutes,
        status: r.effective_status,
        progressPct: r.progress_pct,
        lessons: { done: r.lessons_done, required: r.lessons_required },
        assessments: { passed: r.assessments_passed, required: r.assessments_required },
        activities: { approved: r.activities_approved, required: r.activities_required },
        dueAt: r.due_at,
        lastAccessAt: r.last_access_at,
        completedAt: r.completed_at,
        open: !closed,
        closedMessage: closed?.message || null,
      };
    }));
  }));

  // ── Aula de un curso ──────────────────────────────────────
  router.get('/courses/:courseId', route(async (req, res) => {
    const { courseId } = ids(req);
    res.json(await courseForParticipant(req.aula.db, req.aula.user, courseId, { now: req.aula.now }));
  }));

  router.get('/courses/:courseId/resources', route(async (req, res) => {
    const { courseId } = ids(req);
    res.json(await participantResources(req.aula.db, req.aula.user, courseId, { now: req.aula.now }));
  }));

  router.post('/courses/:courseId/lessons/:lessonId/open', route(async (req, res) => {
    const { courseId, lessonId } = ids(req);
    res.json(await openLesson(req.aula.db, req.aula.user, courseId, lessonId, { now: req.aula.now }));
  }));

  router.post('/courses/:courseId/lessons/:lessonId/time', route(async (req, res) => {
    const { courseId, lessonId } = ids(req);
    const seconds = int(req.body?.seconds, 'seconds', 'El tiempo', { min: 0, max: 3600 });
    res.json(await addLessonTime(req.aula.db, req.aula.user, courseId, lessonId, seconds, { now: req.aula.now }));
  }));

  router.post('/courses/:courseId/lessons/:lessonId/video', route(async (req, res) => {
    const { courseId, lessonId } = ids(req);
    res.json(await reportVideo(req.aula.db, req.aula.user, courseId, lessonId, req.body, { now: req.aula.now }));
  }));

  router.post('/courses/:courseId/lessons/:lessonId/complete', route(async (req, res) => {
    const { courseId, lessonId } = ids(req);
    res.json(await completeLesson(req.aula.db, req.aula.user, courseId, lessonId, { now: req.aula.now }));
  }));

  return router;
}

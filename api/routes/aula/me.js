import express from 'express';
import { closedReason } from '../../lib/aula/access.js';
import { many } from '../../lib/aula/db.js';
import { enrollUsers } from '../../lib/aula/enrollments.js';
import { badRequest, id as idField, int, notFound, route } from '../../lib/aula/http.js';
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
              c.title, c.short_description, c.cover_file_id, c.cover_url, c.kind, c.duration_minutes,
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
        // La portada también puede venir de un enlace, como en los curados.
        coverUrl: r.cover_url,
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

  // ── Apuntes de la clase ───────────────────────────────────
  //
  // Privados. Se buscan y se guardan siempre a través de la matrícula
  // de quien pregunta, así que nadie puede leer ni pisar los de otro
  // cambiando el identificador en la dirección.

  const matriculaDe = async (db, userId, courseId) => {
    const [fila] = await many(
      db,
      `SELECT id FROM aula_enrollments
        WHERE user_id = $1 AND course_id = $2 AND withdrawn_at IS NULL
        LIMIT 1`,
      [userId, courseId],
    );
    if (!fila) throw notFound('No encontramos este curso entre los que tienes asignados.');
    return fila.id;
  };

  router.get('/courses/:courseId/lessons/:lessonId/note', route(async (req, res) => {
    const { db, user } = req.aula;
    const { courseId, lessonId } = ids(req);
    const enrollmentId = await matriculaDe(db, user.id, courseId);
    const [nota] = await many(
      db,
      `SELECT body, video_second, updated_at FROM aula_notes
        WHERE enrollment_id = $1 AND lesson_id = $2`,
      [enrollmentId, lessonId],
    );
    res.json({
      body: nota?.body || '',
      videoSecond: nota?.video_second ?? null,
      updatedAt: nota?.updated_at || null,
    });
  }));

  router.put('/courses/:courseId/lessons/:lessonId/note', route(async (req, res) => {
    const { db, user } = req.aula;
    const { courseId, lessonId } = ids(req);
    const enrollmentId = await matriculaDe(db, user.id, courseId);

    const cuerpo = typeof req.body?.body === 'string' ? req.body.body : '';
    if (cuerpo.length > 20000) {
      throw badRequest('El apunte es demasiado largo. Resume o divídelo en varias clases.');
    }
    const segundo = Number.isFinite(Number(req.body?.videoSecond))
      ? Math.max(0, Math.round(Number(req.body.videoSecond)))
      : null;

    // Vaciar el apunte lo borra: guardar una fila en blanco solo ensucia.
    if (!cuerpo.trim()) {
      await db.query(
        'DELETE FROM aula_notes WHERE enrollment_id = $1 AND lesson_id = $2',
        [enrollmentId, lessonId],
      );
      return res.json({ body: '', videoSecond: null, updatedAt: null });
    }

    const [nota] = await many(
      db,
      `INSERT INTO aula_notes (enrollment_id, lesson_id, body, video_second)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (enrollment_id, lesson_id) DO UPDATE
          SET body = EXCLUDED.body,
              video_second = EXCLUDED.video_second,
              updated_at = NOW()
       RETURNING body, video_second, updated_at`,
      [enrollmentId, lessonId, cuerpo, segundo],
    );
    return res.json({
      body: nota.body,
      videoSecond: nota.video_second,
      updatedAt: nota.updated_at,
    });
  }));

  // ── Catálogo abierto de Edvanta ───────────────────────────
  //
  // Hasta aquí un participante solo veía lo que le asignaran: el aula se
  // diseñó para formación de empresas. Los cursos propios de Edvanta son
  // otra cosa — están para que cualquiera los tome — así que se listan
  // aparte y la persona se matricula sola.
  //
  // El filtro kind = 'edvanta' es la frontera que importa: un curso de
  // empresa pertenece a su empresa y NO puede asomarse aquí.

  const CATALOGO = `
    FROM aula_courses c
   WHERE c.kind = 'edvanta'
     AND c.status = 'publicado'
     AND c.deleted_at IS NULL
     AND c.current_version_id IS NOT NULL
     AND (c.available_from IS NULL OR c.available_from <= $2)
     AND (c.available_until IS NULL OR c.available_until > $2)
     AND NOT EXISTS (
       SELECT 1 FROM aula_enrollments e
        WHERE e.course_id = c.id AND e.user_id = $1 AND e.withdrawn_at IS NULL
     )`;

  router.get('/catalog', route(async (req, res) => {
    const { db, user, now } = req.aula;
    const rows = await many(
      db,
      `SELECT c.id, c.title, c.short_description, c.cover_file_id, c.cover_url,
              c.category, c.level, c.duration_minutes, c.author_name,
              (SELECT COUNT(*)::int FROM aula_lessons l
                WHERE l.course_id = c.id AND l.deleted_at IS NULL) AS lessons
       ${CATALOGO}
       ORDER BY c.published_at DESC NULLS LAST, c.title ASC`,
      [user.id, now],
    );
    res.json(rows.map((r) => ({
      courseId: r.id,
      title: r.title,
      shortDescription: r.short_description || '',
      coverFileId: r.cover_file_id,
      coverUrl: r.cover_url,
      category: r.category,
      level: r.level,
      durationMinutes: r.duration_minutes,
      authorName: r.author_name,
      lessons: r.lessons,
    })));
  }));

  router.post('/catalog/:courseId/enroll', route(async (req, res) => {
    const { db, user, now } = req.aula;
    const { courseId } = ids(req);
    // Se vuelve a comprobar con la MISMA condición del listado: que el curso
    // estuviera en pantalla hace un rato no basta para matricularse ahora.
    const [curso] = await many(
      db,
      `SELECT c.id, c.title, c.current_version_id ${CATALOGO} AND c.id = $3`,
      [user.id, now, courseId],
    );
    if (!curso) {
      throw notFound('Este curso ya no está disponible para inscribirse.');
    }
    await enrollUsers(db, { course: curso, userIds: [user.id], now });
    res.status(201).json({ ok: true, courseId: curso.id });
  }));

  return router;
}

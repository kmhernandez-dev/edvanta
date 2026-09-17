/**
 * Avance de una inscripción.
 *
 * El estado se recalcula en el servidor con cada evento de aprendizaje y
 * siempre contra el snapshot de la versión que cursa la persona. Un curso
 * se completa cuando están hechas el 100 % de las clases obligatorias (y,
 * cuando existan en el curso, aprobadas las evaluaciones y actividades
 * obligatorias).
 */
import { many, one } from './db.js';

const round2 = (n) => Math.round(n * 100) / 100;

/** Qué exige una versión para completar el curso. */
export function requirementsOf(snapshot) {
  const lessons = (snapshot?.modules || []).flatMap((m) => m.lessons || []);
  return {
    requiredLessonIds: lessons.filter((l) => l.isRequired).map((l) => l.id),
    lessonIds: lessons.map((l) => l.id),
  };
}

/**
 * Inscripciones recién creadas (sin avance): fija lo que exige su versión
 * con una sola lectura del snapshot, aunque sean cientos.
 */
export async function initializeEnrollments(db, enrollmentIds, versionId) {
  if (!enrollmentIds.length || !versionId) return;
  const v = await one(db, 'SELECT snapshot FROM aula_course_versions WHERE id = $1', [versionId]);
  if (!v) return;
  const req = requirementsOf(v.snapshot);
  await db.query(
    `UPDATE aula_enrollments SET lessons_required = $2, lessons_done = 0, progress_pct = 0
      WHERE id = ANY($1::bigint[])`,
    [enrollmentIds, req.requiredLessonIds.length],
  );
}

export async function recomputeEnrollment(db, enrollmentId, { now = new Date() } = {}) {
  const e = await one(
    db,
    `SELECT e.id, e.progress_status, e.completed_at, e.first_access_at, v.snapshot
       FROM aula_enrollments e
       LEFT JOIN aula_course_versions v ON v.id = e.course_version_id
      WHERE e.id = $1`,
    [enrollmentId],
  );
  if (!e) return null;
  const req = requirementsOf(e.snapshot);
  const progress = await many(
    db,
    'SELECT lesson_id, status FROM aula_lesson_progress WHERE enrollment_id = $1',
    [e.id],
  );
  const completed = new Set(progress.filter((p) => p.status === 'completado').map((p) => p.lesson_id));
  const lessonsDone = req.requiredLessonIds.filter((lessonId) => completed.has(lessonId)).length;

  const total = req.requiredLessonIds.length;
  const achieved = lessonsDone;
  const started = progress.length > 0 || Boolean(e.first_access_at);

  let status;
  if (total > 0 && achieved === total) status = 'completado';
  else if (started) status = 'en_progreso';
  else status = 'no_iniciado';

  const pct = total ? round2((achieved / total) * 100) : 0;
  const completedAt = status === 'completado' ? (e.completed_at || now) : null;

  await db.query(
    `UPDATE aula_enrollments
        SET progress_status = $2, lessons_done = $3, lessons_required = $4,
            progress_pct = $5, completed_at = $6
      WHERE id = $1`,
    [e.id, status, lessonsDone, req.requiredLessonIds.length, pct, completedAt],
  );
  return { status, lessonsDone, lessonsRequired: req.requiredLessonIds.length, progressPct: pct, completedAt };
}

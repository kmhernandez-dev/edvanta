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
import { pedagogyProgress } from './pedagogia-core.js';

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
    `SELECT e.id, e.course_id, e.user_id, e.progress_status, e.completed_at, e.first_access_at, v.snapshot
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

  const ped = await pedagogyProgress(db, {
    enrollmentId: e.id, courseId: e.course_id, userId: e.user_id,
  });
  const requirements = ped?.requirements || {
    assessments: { required: 0, submitted: 0, passed: 0 },
    activities: { required: 0, submitted: 0, approved: 0 },
    forums: { required: 0, participated: 0, graded: 0 },
  };

  const total = req.requiredLessonIds.length
    + requirements.assessments.required
    + requirements.activities.required
    + requirements.forums.required;
  const achieved = lessonsDone
    + requirements.assessments.submitted
    + requirements.activities.submitted
    + requirements.forums.participated;
  const started = progress.length > 0 || Boolean(e.first_access_at)
    || requirements.assessments.submitted > 0
    || requirements.activities.submitted > 0
    || requirements.forums.participated > 0;

  let status;
  if (total > 0 && achieved >= total) {
    if (ped?.configured) {
      if (ped.pending.length > 0 || !ped.configOk) status = 'pendiente_revision';
      else status = ped.approved ? 'completado' : 'no_aprobado';
    } else {
      status = 'completado';
    }
  } else if (started) {
    status = 'en_progreso';
  } else {
    status = 'no_iniciado';
  }

  const pct = total ? round2((achieved / total) * 100) : 0;
  const completedAt = status === 'completado' || status === 'no_aprobado' ? (e.completed_at || now) : null;
  const finalScore = ped?.configured && ped?.configOk ? ped.finalScore : null;

  await db.query(
    `UPDATE aula_enrollments
        SET progress_status = $2, lessons_done = $3, lessons_required = $4,
            assessments_required = $5, assessments_submitted = $6, assessments_passed = $7,
            activities_required = $8, activities_submitted = $9, activities_approved = $10,
            forums_required = $11, forums_participated = $12,
            progress_pct = $13, completed_at = $14, final_score = $15
      WHERE id = $1`,
    [
      e.id, status, lessonsDone, req.requiredLessonIds.length,
      requirements.assessments.required, requirements.assessments.submitted, requirements.assessments.passed,
      requirements.activities.required, requirements.activities.submitted, requirements.activities.approved,
      requirements.forums.required, requirements.forums.participated,
      pct, completedAt, finalScore,
    ],
  );
  return {
    status, lessonsDone, lessonsRequired: req.requiredLessonIds.length, progressPct: pct, completedAt,
    finalScore, pending: ped?.pending || [], requirements, provisional: ped?.provisional || false,
  };
}

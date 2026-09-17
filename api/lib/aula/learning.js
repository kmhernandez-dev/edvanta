/**
 * Aprendizaje del participante: abrir clases, tiempo activo, avance de
 * videos y clases completadas.
 *
 * Todo se valida contra el snapshot de la versión que cursa la persona.
 * El navegador informa lo que vio; el servidor acota esos reportes al
 * tiempo real transcurrido para que el avance no se pueda inflar.
 */
import { many, one } from './db.js';
import { AulaError, badRequest, conflict, notFound } from './http.js';
import { requireOpenEnrollment } from './access.js';
import { recomputeEnrollment } from './progress.js';

const MAX_TIME_REPORT_S = 60;
const MAX_VIDEO_SECONDS = 24 * 60 * 60;

export function flattenLessons(snapshot) {
  return (snapshot?.modules || []).flatMap((m, moduleIndex) => (m.lessons || []).map((l) => ({
    ...l, moduleId: m.id, moduleTitle: m.title, moduleIndex,
  })));
}

const videoBlocks = (lesson) => (lesson.blocks || []).filter((b) => b.type === 'video');

/** Avance de video de una clase: el menor porcentaje entre sus videos. */
function lessonVideoPct(lesson, segments) {
  const videos = videoBlocks(lesson);
  if (!videos.length) return 0;
  return Math.min(...videos.map((b) => Number(segments?.[b.id]?.pct) || 0));
}

/**
 * Estado de cada clase para una persona. Con «avanzar en orden», una clase
 * queda bloqueada mientras haya una obligatoria anterior sin completar
 * (las ya completadas siguen abiertas para repasar).
 */
export function lessonStates(snapshot, progressRows) {
  const byLesson = new Map(progressRows.map((p) => [p.lesson_id, p]));
  const sequential = Boolean(snapshot?.rules?.sequential);
  const states = {};
  let pendingRequired = null;
  for (const l of flattenLessons(snapshot)) {
    const p = byLesson.get(l.id);
    let status = p?.status === 'completado' ? 'completado' : p ? 'en_progreso' : 'pendiente';
    let reason = null;
    if (sequential && pendingRequired && status !== 'completado') {
      status = 'bloqueado';
      reason = `Completa «${pendingRequired.title}» para continuar.`;
    }
    states[l.id] = {
      status,
      reason,
      activeSeconds: p?.active_seconds || 0,
      videoPct: Number(p?.video_watched_pct) || 0,
      completedAt: p?.completed_at || null,
      lastActivityAt: p?.last_activity_at || null,
    };
    if (sequential && l.isRequired && status !== 'completado' && !pendingRequired) pendingRequired = l;
  }
  return states;
}

/** Clase para retomar: la última abierta que siga disponible, o la primera pendiente. */
export function resumeLessonId(snapshot, states) {
  const lessons = flattenLessons(snapshot);
  const open = lessons.filter((l) => states[l.id]?.status !== 'bloqueado');
  const recent = open
    .filter((l) => states[l.id]?.lastActivityAt && states[l.id].status !== 'completado')
    .sort((a, b) => new Date(states[b.id].lastActivityAt) - new Date(states[a.id].lastActivityAt))[0];
  if (recent) return recent.id;
  const next = open.find((l) => states[l.id]?.status !== 'completado');
  return (next || lessons[0])?.id ?? null;
}

async function loadContext(db, user, courseId, { now }) {
  const enrollment = await requireOpenEnrollment(db, user, courseId, { now });
  const version = await one(
    db,
    'SELECT id, version_number, snapshot FROM aula_course_versions WHERE id = $1',
    [enrollment.course_version_id],
  );
  if (!version) throw new AulaError(403, 'curso_sin_publicar', 'Este curso todavía no está publicado. Te avisaremos cuando abra.');
  const progress = await many(
    db,
    `SELECT lesson_id, status, active_seconds, video_segments, video_watched_pct, completed_at, last_activity_at
       FROM aula_lesson_progress WHERE enrollment_id = $1`,
    [enrollment.id],
  );
  return { enrollment, version, snapshot: version.snapshot, progress };
}

function findLesson(snapshot, lessonId) {
  const lesson = flattenLessons(snapshot).find((l) => l.id === lessonId);
  if (!lesson) throw notFound('Esta clase no forma parte de tu versión del curso.');
  return lesson;
}

function assertUnlocked(states, lesson) {
  const state = states[lesson.id];
  if (state?.status === 'bloqueado') {
    throw new AulaError(403, 'clase_bloqueada', state.reason || 'Completa la clase anterior para continuar.');
  }
}

async function touchEnrollment(db, enrollmentId, now) {
  await db.query(
    `UPDATE aula_enrollments
        SET first_access_at = COALESCE(first_access_at, $2), last_access_at = $2
      WHERE id = $1`,
    [enrollmentId, now],
  );
}

function summary(enrollment) {
  const pct = (done, total) => (total ? Math.round((done / total) * 10000) / 100 : null);
  return {
    enrollmentId: enrollment.id,
    status: enrollment.effective_status || enrollment.progress_status,
    progressPct: Number(enrollment.progress_pct) || 0,
    lessons: { done: enrollment.lessons_done, required: enrollment.lessons_required, pct: pct(enrollment.lessons_done, enrollment.lessons_required) },
    assessments: { passed: enrollment.assessments_passed, required: enrollment.assessments_required, pct: pct(enrollment.assessments_passed, enrollment.assessments_required) },
    activities: { approved: enrollment.activities_approved, required: enrollment.activities_required, pct: pct(enrollment.activities_approved, enrollment.activities_required) },
    startsAt: enrollment.starts_at,
    dueAt: enrollment.due_at,
    completedAt: enrollment.completed_at,
    firstAccessAt: enrollment.first_access_at,
  };
}

async function freshSummary(db, enrollmentId) {
  const e = await one(db, 'SELECT * FROM aula_enrollments_v WHERE id = $1', [enrollmentId]);
  return summary(e);
}

/** Todo lo que necesita el aula del participante para un curso. */
export async function courseForParticipant(db, user, courseId, { now = new Date() } = {}) {
  const ctx = await loadContext(db, user, courseId, { now });
  const states = lessonStates(ctx.snapshot, ctx.progress);
  const live = await one(
    db,
    `SELECT c.title, c.short_description, c.description_html, c.cover_file_id, c.objective, c.learning_outcomes,
            c.audience, c.prerequisites, c.duration_minutes, c.resources_enabled, co.name AS company_name
       FROM aula_courses c LEFT JOIN aula_companies co ON co.id = c.company_id WHERE c.id = $1`,
    [courseId],
  );
  // Los datos descriptivos se muestran siempre actualizados; el contenido y
  // las reglas, los de la versión que cursa la persona.
  const snapshot = {
    ...ctx.snapshot,
    fingerprint: undefined,
    course: {
      ...ctx.snapshot.course,
      title: live.title,
      shortDescription: live.short_description || '',
      descriptionHtml: live.description_html || '',
      coverFileId: live.cover_file_id,
      objective: live.objective || '',
      learningOutcomes: live.learning_outcomes || [],
      audience: live.audience || '',
      prerequisites: live.prerequisites || '',
      durationMinutes: live.duration_minutes,
    },
  };
  return {
    snapshot,
    version: { id: ctx.version.id, number: ctx.version.version_number },
    companyName: live.company_name,
    resourcesEnabled: live.resources_enabled,
    enrollment: await freshSummary(db, ctx.enrollment.id),
    lessonStates: states,
    resumeLessonId: resumeLessonId(ctx.snapshot, states),
    videoProgress: Object.fromEntries(ctx.progress.map((p) => [p.lesson_id, p.video_segments && !Array.isArray(p.video_segments) ? p.video_segments : {}])),
  };
}

async function upsertProgress(db, enrollment, lesson, version, now) {
  return one(
    db,
    `INSERT INTO aula_lesson_progress (enrollment_id, lesson_id, course_version_id, first_opened_at, last_activity_at)
     VALUES ($1, $2, $3, $4, $4)
     ON CONFLICT (enrollment_id, lesson_id) DO UPDATE
        SET last_activity_at = EXCLUDED.last_activity_at,
            course_version_id = EXCLUDED.course_version_id
     RETURNING *`,
    [enrollment.id, lesson.id, version.id, now],
  );
}

async function lessonResult(db, enrollmentId, courseId, user, lessonId, now) {
  const ctx = await loadContext(db, user, courseId, { now });
  const states = lessonStates(ctx.snapshot, ctx.progress);
  return {
    lesson: states[lessonId],
    lessonStates: states,
    enrollment: await freshSummary(db, enrollmentId),
  };
}

/** Abrir una clase: registra el inicio (o la última visita). */
export async function openLesson(db, user, courseId, lessonId, { now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const ctx = await loadContext(tx, user, courseId, { now });
    const lesson = findLesson(ctx.snapshot, lessonId);
    assertUnlocked(lessonStates(ctx.snapshot, ctx.progress), lesson);
    const existed = ctx.progress.some((p) => p.lesson_id === lessonId);
    await upsertProgress(tx, ctx.enrollment, lesson, ctx.version, now);
    await touchEnrollment(tx, ctx.enrollment.id, now);
    if (!existed) await recomputeEnrollment(tx, ctx.enrollment.id, { now });
    return lessonResult(tx, ctx.enrollment.id, courseId, user, lessonId, now);
  });
}

/**
 * Suma tiempo activo en una clase. Nunca más que el tiempo real desde la
 * última actividad (más un margen), ni más de un minuto por reporte.
 */
export async function addLessonTime(db, user, courseId, lessonId, seconds, { now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const ctx = await loadContext(tx, user, courseId, { now });
    const lesson = findLesson(ctx.snapshot, lessonId);
    const row = await one(
      tx,
      'SELECT id, last_activity_at, active_seconds FROM aula_lesson_progress WHERE enrollment_id = $1 AND lesson_id = $2 FOR UPDATE',
      [ctx.enrollment.id, lesson.id],
    );
    if (!row) throw conflict('Abre la clase antes de registrar tiempo.');
    const elapsed = Math.max(0, (now.getTime() - new Date(row.last_activity_at).getTime()) / 1000);
    const added = Math.max(0, Math.min(Math.floor(seconds), MAX_TIME_REPORT_S, Math.ceil(elapsed) + 5));
    await tx.query(
      'UPDATE aula_lesson_progress SET active_seconds = active_seconds + $2, last_activity_at = $3 WHERE id = $1',
      [row.id, added, now],
    );
    await tx.query(
      'UPDATE aula_enrollments SET active_seconds = active_seconds + $2, last_access_at = $3 WHERE id = $1',
      [ctx.enrollment.id, added, now],
    );
    return { added, activeSeconds: row.active_seconds + added, minSeconds: lesson.minSeconds };
  });
}

function mergeSegments(existing, incoming, duration) {
  const all = [...existing, ...incoming]
    .map(([a, b]) => [Math.max(0, Math.min(a, duration)), Math.max(0, Math.min(b, duration))])
    .filter(([a, b]) => b > a)
    .sort((x, y) => x[0] - y[0]);
  const merged = [];
  for (const [a, b] of all) {
    const last = merged[merged.length - 1];
    if (last && a <= last[1] + 1) last[1] = Math.max(last[1], b);
    else merged.push([a, b]);
  }
  return merged.map(([a, b]) => [Math.round(a * 10) / 10, Math.round(b * 10) / 10]);
}

const covered = (segments) => segments.reduce((s, [a, b]) => s + (b - a), 0);

/**
 * Avance de un video. `segments` son los tramos vistos desde el último
 * reporte. Se aceptan como máximo 2,5 veces el tiempo real transcurrido
 * (velocidad de reproducción) más un margen.
 */
export async function reportVideo(db, user, courseId, lessonId, input, { now = new Date() } = {}) {
  const blockId = Number(input?.blockId);
  const duration = Number(input?.duration);
  const position = Number(input?.position) || 0;
  if (!Number.isInteger(blockId) || blockId <= 0) throw badRequest('Falta el video.');
  if (!Number.isFinite(duration) || duration <= 0 || duration > MAX_VIDEO_SECONDS) throw badRequest('La duración del video no es válida.');
  const incoming = (Array.isArray(input?.segments) ? input.segments : [])
    .slice(0, 200)
    .filter((s) => Array.isArray(s) && s.length === 2 && s.every((n) => Number.isFinite(Number(n))))
    .map(([a, b]) => [Number(a), Number(b)]);

  return db.tx(async (tx) => {
    const ctx = await loadContext(tx, user, courseId, { now });
    const lesson = findLesson(ctx.snapshot, lessonId);
    assertUnlocked(lessonStates(ctx.snapshot, ctx.progress), lesson);
    if (!videoBlocks(lesson).some((b) => b.id === blockId)) throw badRequest('Ese video no está en esta clase.');
    const row = await one(
      tx,
      'SELECT * FROM aula_lesson_progress WHERE enrollment_id = $1 AND lesson_id = $2 FOR UPDATE',
      [ctx.enrollment.id, lesson.id],
    ) || await upsertProgress(tx, ctx.enrollment, lesson, ctx.version, now);

    const store = row.video_segments && !Array.isArray(row.video_segments) ? row.video_segments : {};
    const prev = store[blockId] || { segments: [], pct: 0, position: 0, reportedAt: null };
    const elapsed = prev.reportedAt
      ? Math.max(0, (now.getTime() - new Date(prev.reportedAt).getTime()) / 1000)
      : Math.max(0, (now.getTime() - new Date(row.last_activity_at).getTime()) / 1000);
    // Tope anti-inflado: lo nuevo no puede superar el tiempo real a 2,5x.
    let budget = elapsed * 2.5 + 15;
    const accepted = [];
    for (const [a, b] of incoming) {
      if (budget <= 0) break;
      const end = Math.min(b, a + budget);
      if (end > a) { accepted.push([a, end]); budget -= end - a; }
    }
    const segments = mergeSegments(prev.segments || [], accepted, duration);
    const pct = Math.min(100, Math.round((covered(segments) / duration) * 10000) / 100);
    store[blockId] = {
      segments, pct, duration: Math.round(duration * 10) / 10,
      position: Math.max(0, Math.min(position, duration)), reportedAt: now.toISOString(),
    };
    const watched = lessonVideoPct(lesson, store);
    const threshold = ctx.snapshot.rules.videoCompletionPct;
    const completesNow = lesson.completionRule === 'video' && row.status !== 'completado' && watched >= threshold;

    // last_activity_at no cambia aquí: es la referencia para acotar el tiempo activo.
    await tx.query(
      `UPDATE aula_lesson_progress
          SET video_segments = $2, video_watched_pct = $3, video_position_seconds = $4,
              video_duration_seconds = $5,
              status = CASE WHEN $7 THEN 'completado' ELSE status END,
              completed_at = CASE WHEN $7 THEN $6::timestamptz ELSE completed_at END
        WHERE id = $1`,
      [row.id, JSON.stringify(store), watched, store[blockId].position, duration, now, completesNow],
    );
    await touchEnrollment(tx, ctx.enrollment.id, now);
    if (completesNow) await recomputeEnrollment(tx, ctx.enrollment.id, { now });
    const result = await lessonResult(tx, ctx.enrollment.id, courseId, user, lessonId, now);
    return { ...result, video: { blockId, pct, watchedPct: watched, threshold }, completed: completesNow };
  });
}

/** Marcar como completada una clase de lectura (con su tiempo mínimo). */
export async function completeLesson(db, user, courseId, lessonId, { now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const ctx = await loadContext(tx, user, courseId, { now });
    const lesson = findLesson(ctx.snapshot, lessonId);
    assertUnlocked(lessonStates(ctx.snapshot, ctx.progress), lesson);
    if (lesson.completionRule === 'video') {
      throw badRequest(`Esta clase se completa sola al ver el ${ctx.snapshot.rules.videoCompletionPct} % del video.`);
    }
    const row = await one(
      tx,
      'SELECT * FROM aula_lesson_progress WHERE enrollment_id = $1 AND lesson_id = $2 FOR UPDATE',
      [ctx.enrollment.id, lesson.id],
    );
    if (!row) throw conflict('Abre la clase antes de marcarla como completada.');
    if (row.status === 'completado') {
      return { ...(await lessonResult(tx, ctx.enrollment.id, courseId, user, lessonId, now)), alreadyCompleted: true };
    }
    if (row.active_seconds < lesson.minSeconds) {
      const remaining = lesson.minSeconds - row.active_seconds;
      const left = remaining < 60 ? `${remaining} ${remaining === 1 ? 'segundo' : 'segundos'}` : `${Math.ceil(remaining / 60)} min`;
      throw new AulaError(409, 'tiempo_minimo', `Dedica un poco más de tiempo a esta clase: faltan ${left}.`, {
        remainingSeconds: remaining,
      });
    }
    await tx.query(
      "UPDATE aula_lesson_progress SET status = 'completado', completed_at = $2 WHERE id = $1",
      [row.id, now],
    );
    await touchEnrollment(tx, ctx.enrollment.id, now);
    await recomputeEnrollment(tx, ctx.enrollment.id, { now });
    return lessonResult(tx, ctx.enrollment.id, courseId, user, lessonId, now);
  });
}

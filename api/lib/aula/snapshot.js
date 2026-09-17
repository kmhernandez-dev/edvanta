/**
 * Snapshot de un curso: la foto completa de su contenido y sus reglas.
 *
 * Publicar guarda un snapshot inmutable (aula_course_versions); cada
 * inscripción cursa el de su versión. La vista previa usa el snapshot de
 * la copia de trabajo, así que el administrador ve exactamente lo que
 * verá el participante al publicar.
 *
 * La huella (`fingerprint`) resume contenido y reglas. Si la huella de la
 * copia de trabajo difiere de la versión publicada, hay cambios sin
 * publicar. Los datos descriptivos (título, portada, descripción…) no
 * forman parte de la huella: se muestran siempre actualizados y no
 * alteran resultados.
 */
import { createHash } from 'node:crypto';
import { many, one } from './db.js';
import { notFound } from './http.js';
import { blockDownloadable, blockFileIds, BLOCK_TYPES } from './blocks.js';

export const SNAPSHOT_SCHEMA = 1;

const rulesOf = (c) => ({
  passingScore: Number(c.passing_score),
  maxAttempts: c.max_attempts,
  sequential: c.sequential,
  videoCompletionPct: c.video_completion_pct,
});

/** JSON con las claves ordenadas: PostgreSQL reordena las claves de JSONB. */
export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`;
  }
  return JSON.stringify(value ?? null);
}

export function fingerprint({ rules, modules }) {
  return createHash('sha256').update(stableStringify({ rules, modules })).digest('hex');
}

/** Snapshot de la copia de trabajo de un curso. */
export async function buildSnapshot(db, courseId) {
  const course = await one(
    db,
    `SELECT id, title, short_description, description_html, cover_file_id, category, level, tags,
            objective, learning_outcomes, audience, prerequisites, duration_minutes, author_name,
            modality, passing_score, max_attempts, sequential, video_completion_pct, resources_enabled,
            kind, company_id
       FROM aula_courses WHERE id = $1 AND deleted_at IS NULL`,
    [courseId],
  );
  if (!course) throw notFound('No encontramos ese curso.');

  const moduleRows = await many(
    db,
    `SELECT id, title, description FROM aula_modules
      WHERE course_id = $1 AND deleted_at IS NULL ORDER BY sort_order, id`,
    [courseId],
  );
  const lessonRows = await many(
    db,
    `SELECT l.id, l.module_id, l.title, l.subtitle, l.is_required, l.completion_rule, l.min_seconds, l.duration_minutes
       FROM aula_lessons l
       JOIN aula_modules m ON m.id = l.module_id AND m.deleted_at IS NULL
      WHERE l.course_id = $1 AND l.deleted_at IS NULL
      ORDER BY l.sort_order, l.id`,
    [courseId],
  );
  const blockRows = await many(
    db,
    `SELECT b.id, b.lesson_id, b.type, b.data, b.allow_download
       FROM aula_lesson_blocks b
       JOIN aula_lessons l ON l.id = b.lesson_id AND l.deleted_at IS NULL
      WHERE l.course_id = $1 AND b.deleted_at IS NULL
      ORDER BY b.sort_order, b.id`,
    [courseId],
  );

  const blocksByLesson = new Map();
  const fileAccess = new Map();
  for (const b of blockRows) {
    if (!blocksByLesson.has(b.lesson_id)) blocksByLesson.set(b.lesson_id, []);
    const allowDownload = blockDownloadable(b.type, b.allow_download);
    blocksByLesson.get(b.lesson_id).push({ id: b.id, type: b.type, allowDownload, data: b.data });
    for (const fileId of blockFileIds(b.type, b.data)) {
      fileAccess.set(fileId, (fileAccess.get(fileId) || false) || allowDownload);
    }
  }

  const lessonsByModule = new Map();
  for (const l of lessonRows) {
    if (!lessonsByModule.has(l.module_id)) lessonsByModule.set(l.module_id, []);
    lessonsByModule.get(l.module_id).push({
      id: l.id,
      title: l.title,
      subtitle: l.subtitle || '',
      isRequired: l.is_required,
      completionRule: l.completion_rule,
      minSeconds: l.min_seconds,
      durationMinutes: l.duration_minutes,
      blocks: blocksByLesson.get(l.id) || [],
    });
  }

  const modules = moduleRows.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description || '',
    lessons: lessonsByModule.get(m.id) || [],
  }));
  const rules = rulesOf(course);

  const fileIds = [...fileAccess.keys()];
  const fileRows = fileIds.length
    ? await many(
      db,
      `SELECT id, original_name, mime_type, extension, size_bytes FROM aula_files WHERE id = ANY($1::bigint[])`,
      [fileIds],
    )
    : [];
  const files = Object.fromEntries(fileRows.map((f) => [f.id, {
    name: f.original_name, mime: f.mime_type, extension: f.extension, size: f.size_bytes,
    downloadable: fileAccess.get(f.id) || false,
  }]));

  const lessons = modules.flatMap((m) => m.lessons);
  return {
    schema: SNAPSHOT_SCHEMA,
    fingerprint: fingerprint({ rules, modules }),
    course: {
      id: course.id,
      title: course.title,
      shortDescription: course.short_description || '',
      descriptionHtml: course.description_html || '',
      coverFileId: course.cover_file_id,
      objective: course.objective || '',
      learningOutcomes: course.learning_outcomes || [],
      audience: course.audience || '',
      prerequisites: course.prerequisites || '',
      durationMinutes: course.duration_minutes,
    },
    rules,
    modules,
    files,
    totals: {
      modules: modules.length,
      lessons: lessons.length,
      requiredLessons: lessons.filter((l) => l.isRequired).length,
      blocks: blockRows.length,
    },
  };
}

/**
 * Revisión antes de publicar. `errors` impide publicar; `warnings` son
 * recomendaciones.
 */
export function validateSnapshot(snapshot, course) {
  const errors = [];
  const warnings = [];
  const where = (m, l) => (l ? `«${l.title}» (${m.title})` : `«${m.title}»`);

  if (!snapshot.modules.length) errors.push({ code: 'sin_modulos', message: 'El curso no tiene módulos. Agrega al menos uno con una clase.' });
  for (const m of snapshot.modules) {
    if (!m.lessons.length) errors.push({ code: 'modulo_vacio', message: `El módulo ${where(m)} no tiene clases.`, moduleId: m.id });
    for (const l of m.lessons) {
      if (!l.blocks.length) {
        errors.push({ code: 'clase_vacia', message: `La clase ${where(m, l)} no tiene contenido.`, lessonId: l.id });
      }
      const videos = l.blocks.filter((b) => b.type === 'video');
      if (l.completionRule === 'video' && !videos.length) {
        errors.push({
          code: 'clase_sin_video',
          message: `La clase ${where(m, l)} se completa al ver un video, pero no tiene ningún video.`,
          lessonId: l.id,
        });
      }
      if (videos.some((b) => !b.data.transcriptHtml)) {
        warnings.push({
          code: 'video_sin_transcripcion',
          message: `Un video de ${where(m, l)} no tiene transcripción. Ayuda a quien no puede escucharlo.`,
          lessonId: l.id,
        });
      }
      for (const b of l.blocks) {
        if (!BLOCK_TYPES[b.type]?.available) {
          errors.push({ code: 'bloque_no_disponible', message: `La clase ${where(m, l)} tiene un bloque que aún no se puede publicar.`, lessonId: l.id });
        }
      }
    }
  }
  if (snapshot.totals.lessons && !snapshot.totals.requiredLessons) {
    errors.push({ code: 'sin_obligatorias', message: 'Marca al menos una clase como obligatoria: sin ellas el curso no tiene cómo completarse.' });
  }
  if (course?.status === 'archivado') {
    errors.push({ code: 'archivado', message: 'El curso está archivado. Restáuralo antes de publicar.' });
  }
  if (!snapshot.course.coverFileId) warnings.push({ code: 'sin_portada', message: 'El curso no tiene imagen de portada.' });
  if (!snapshot.course.shortDescription) warnings.push({ code: 'sin_resumen', message: 'El curso no tiene descripción corta; es lo que ven los participantes en «Mi aula».' });
  if (course?.kind === 'empresa' && course?.company_status === 'inactiva') {
    warnings.push({ code: 'empresa_inactiva', message: 'La empresa de esta capacitación está inactiva.' });
  }
  return { errors, warnings };
}

const lessonSignature = (l) => stableStringify([l.title, l.subtitle, l.isRequired, l.completionRule, l.minSeconds, l.durationMinutes, l.blocks]);

/** Qué cambia entre la versión publicada y la copia de trabajo. */
export function diffSnapshots(previous, next) {
  if (!previous) {
    return { first: true, lessonsAdded: next.totals.lessons, lessonsRemoved: 0, lessonsChanged: 0, modulesAdded: next.totals.modules, modulesRemoved: 0, modulesChanged: 0, rules: [], requiredAdded: next.totals.requiredLessons };
  }
  const prevLessons = new Map(previous.modules.flatMap((m) => m.lessons.map((l) => [l.id, { ...l, moduleId: m.id }])));
  const nextLessons = new Map(next.modules.flatMap((m) => m.lessons.map((l) => [l.id, { ...l, moduleId: m.id }])));
  let lessonsAdded = 0;
  let lessonsChanged = 0;
  let requiredAdded = 0;
  for (const [lessonId, l] of nextLessons) {
    const before = prevLessons.get(lessonId);
    if (!before) {
      lessonsAdded += 1;
      if (l.isRequired) requiredAdded += 1;
    } else {
      if (lessonSignature(before) !== lessonSignature(l) || before.moduleId !== l.moduleId) lessonsChanged += 1;
      if (l.isRequired && !before.isRequired) requiredAdded += 1;
    }
  }
  const lessonsRemoved = [...prevLessons.keys()].filter((lessonId) => !nextLessons.has(lessonId)).length;

  const prevModules = new Map(previous.modules.map((m, i) => [m.id, { ...m, index: i }]));
  const nextModules = new Map(next.modules.map((m, i) => [m.id, { ...m, index: i }]));
  const modulesAdded = [...nextModules.keys()].filter((moduleId) => !prevModules.has(moduleId)).length;
  const modulesRemoved = [...prevModules.keys()].filter((moduleId) => !nextModules.has(moduleId)).length;
  const modulesChanged = [...nextModules.values()].filter((m) => {
    const before = prevModules.get(m.id);
    return before && (before.title !== m.title || before.description !== m.description || before.index !== m.index
      || before.lessons.map((l) => l.id).join() !== m.lessons.map((l) => l.id).join());
  }).length;

  const labels = {
    passingScore: ['Nota mínima', (v) => `${v} %`],
    maxAttempts: ['Intentos por evaluación', String],
    sequential: ['Avance en orden', (v) => (v ? 'sí' : 'no')],
    videoCompletionPct: ['Porcentaje de video para completar', (v) => `${v} %`],
  };
  const rules = Object.entries(labels)
    .filter(([key]) => previous.rules?.[key] !== next.rules[key])
    .map(([key, [label, fmt]]) => ({
      key, label, before: previous.rules?.[key] === undefined ? '—' : fmt(previous.rules[key]), after: fmt(next.rules[key]),
    }));

  return { first: false, lessonsAdded, lessonsRemoved, lessonsChanged, modulesAdded, modulesRemoved, modulesChanged, rules, requiredAdded };
}

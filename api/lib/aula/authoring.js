/**
 * Autoría y gestión académica desde el panel.
 *
 * Toda operación comprueba en el servidor que quien escribe es
 * administrador o docente asignado al curso. Los recursos se crean en
 * borrador, se publican o archivan sin borrar su historial y conservan
 * su unidad y su orden. Los intentos, entregas y mensajes nunca se
 * copian al duplicar.
 */
import { many, one } from './db.js';
import { requireCourseTeacher } from './access.js';
import {
  badRequest, bool, conflict, date, dayBoundary, id as idField, int, notFound, num, oneOf, paging,
  pageResult, str, strList,
} from './http.js';
import { htmlToText, richText, sanitizeRichText } from './richtext.js';
import { audit } from './audit.js';
import { pedagogyProgress, round2 } from './pedagogia-core.js';
import { recomputeEnrollment } from './progress.js';

const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const asJson = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return null; }
  }
  return value;
};
const cleanText = (value, max = 5000) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export const MAX_REQUIRED_ACTIVITIES = 5;

const QUIZ_STATUSES = ['borrador', 'publicado', 'archivado'];
const ACTIVITY_STATUSES = ['borrador', 'publicado', 'archivado'];
const FORUM_STATUSES = ['borrador', 'publicado', 'archivado'];

async function loadCourse(db, courseId) {
  const course = await one(
    db,
    `SELECT id, title, status, passing_score, max_attempts, grade_policy, sequential, video_completion_pct
       FROM aula_courses WHERE id = $1 AND deleted_at IS NULL`,
    [courseId],
  );
  if (!course) throw notFound('No encontramos ese curso.');
  return course;
}

async function assertMaterialFiles(db, actor, materials = []) {
  for (const material of materials) {
    if (!material.fileId) continue;
    const file = await one(
      db,
      `SELECT id FROM aula_files
        WHERE id = $1 AND purpose = 'recurso' AND status = 'listo' AND deleted_at IS NULL
          AND (uploaded_by = $2 OR $3::boolean = TRUE)`,
      [material.fileId, actor.id, actor.role === 'admin'],
    );
    if (!file) throw badRequest('Uno de los materiales adjuntos no está disponible.', { field: 'materials' });
  }
}

async function assertModule(db, courseId, moduleId) {
  const module = await one(
    db,
    'SELECT id, title FROM aula_modules WHERE id = $1 AND course_id = $2 AND deleted_at IS NULL',
    [moduleId, courseId],
  );
  if (!module) throw badRequest('La unidad no pertenece a este curso.', { field: 'moduleId' });
  return module;
}

function readUrl(value, field = 'url') {
  const text = cleanText(value, 2000);
  if (!text) return null;
  try {
    const url = new URL(text);
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocolo');
    return url.toString();
  } catch {
    throw badRequest('El enlace debe ser una dirección web (https://…).', { field });
  }
}

function readRubric(value) {
  if (value === undefined || value === null) return { present: false, rubric: null };
  if (typeof value !== 'object' || Array.isArray(value)) throw badRequest('La rúbrica no tiene un formato válido.', { field: 'rubric' });
  const criteria = Array.isArray(value.criteria) ? value.criteria : [];
  if (!criteria.length) return { present: true, rubric: null };
  if (criteria.length > 20) throw badRequest('Una rúbrica admite máximo 20 criterios.', { field: 'rubric' });
  const scale = value.scale === '0-100' ? '0-100' : '0-4';
  const out = [];
  let total = 0;
  for (const [index, item] of criteria.entries()) {
    const name = str(item?.name, `rubric.criteria.${index}.name`, `El criterio ${index + 1}`, { max: 160 });
    const weight = num(item?.weight, `rubric.criteria.${index}.weight`, `El peso de “${name}”`, { min: 0.01, max: 100 });
    total += weight;
    const levels = Array.isArray(item?.levels) ? item.levels.slice(0, 8).map((level, li) => ({
      level: int(level?.level, `rubric.criteria.${index}.levels.${li}.level`, 'El nivel', { min: 0, max: 4 }),
      label: cleanText(level?.label, 120),
      description: cleanText(level?.description, 1000),
    })) : [];
    out.push({
      id: cleanText(item?.id, 80) || `c-${index + 1}`,
      name,
      weight: round2(weight),
      levels,
    });
  }
  const sum = round2(total);
  if (Math.abs(sum - 100) > 0.05) {
    throw badRequest(`Los pesos de los criterios suman ${sum} %, no 100 %.`, { field: 'rubric' });
  }
  return {
    present: true,
    rubric: {
      version: scale === '0-100' ? 2 : 1,
      scale,
      total: 100,
      criteria: out,
    },
  };
}

function readQuestions(value) {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) throw badRequest('Las preguntas no tienen un formato válido.', { field: 'questions' });
  if (value.length > 200) throw badRequest('Un quiz admite máximo 200 preguntas.', { field: 'questions' });
  return value.map((item, index) => {
    const promptHtml = sanitizeRichText(item?.promptHtml || '');
    const options = Array.isArray(item?.options) ? item.options : [];
    if (options.length > 12) throw badRequest(`La pregunta ${index + 1} admite máximo 12 opciones.`, { field: 'questions' });
    return {
      id: item?.id ? idField(item.id, `questions.${index}.id`, 'La pregunta') : null,
      promptHtml,
      points: num(item?.points ?? 25, `questions.${index}.points`, `Los puntos de la pregunta ${index + 1}`, { min: 0.01, max: 1000 }),
      explanation: cleanText(item?.explanation, 5000),
      generalFeedback: cleanText(item?.generalFeedback, 5000),
      config: item?.config && typeof item.config === 'object' ? item.config : {},
      options: options.map((option, oi) => ({
        id: option?.id ? idField(option.id, `questions.${index}.options.${oi}.id`, 'La opción') : null,
        text: cleanText(option?.text, 1000),
        isCorrect: Boolean(option?.isCorrect),
        feedback: cleanText(option?.feedback, 2000),
      })),
    };
  });
}

export function readQuiz(body = {}, { partial = false } = {}) {
  const b = body || {};
  const want = (k) => !partial || has(b, k);
  const out = {};
  if (want('title')) out.title = str(b.title, 'title', 'El título', { max: 160 });
  if (want('moduleId')) out.moduleId = b.moduleId ? idField(b.moduleId, 'moduleId', 'La unidad') : null;
  if (want('instructionsHtml')) out.instructionsHtml = richText(b.instructionsHtml, 'instructionsHtml', 'Las instrucciones', { optional: true });
  if (want('isRequired')) out.isRequired = bool(b.isRequired ?? true, 'isRequired', 'La obligatoriedad');
  if (want('passingScore')) out.passingScore = num(b.passingScore ?? 70, 'passingScore', 'La nota mínima', { min: 0, max: 100 });
  if (want('maxAttempts')) out.maxAttempts = int(b.maxAttempts ?? 2, 'maxAttempts', 'Los intentos permitidos', { min: 1, max: 20 });
  if (want('showAnswersAfterSubmit')) {
    out.showAnswersAfterSubmit = bool(b.showAnswersAfterSubmit ?? true, 'showAnswersAfterSubmit', 'Mostrar soluciones');
  }
  if (want('weight')) out.weight = num(b.weight ?? 0, 'weight', 'El peso', { min: 0, max: 100 });
  if (want('sortOrder')) out.sortOrder = int(b.sortOrder ?? 0, 'sortOrder', 'El orden', { min: 0, max: 100000 });
  if (want('questions')) out.questions = readQuestions(b.questions);
  return out;
}

export function readActivity(body = {}, { partial = false } = {}) {
  const b = body || {};
  const want = (k) => !partial || has(b, k);
  const out = {};
  if (want('title')) out.title = str(b.title, 'title', 'El título', { max: 160 });
  if (want('moduleId')) out.moduleId = b.moduleId ? idField(b.moduleId, 'moduleId', 'La unidad') : null;
  if (want('instructionsHtml')) out.instructionsHtml = richText(b.instructionsHtml, 'instructionsHtml', 'La consigna', { optional: true });
  if (want('caseHtml')) out.caseHtml = richText(b.caseHtml, 'caseHtml', 'El caso de estudio', { optional: true });
  if (want('pointsToSolve')) out.pointsToSolve = strList(b.pointsToSolve ?? [], 'pointsToSolve', 'Los puntos a resolver', { maxItems: 30, maxLength: 800 });
  if (want('expectedProduct')) out.expectedProduct = str(b.expectedProduct, 'expectedProduct', 'El producto esperado', { max: 1000, optional: true });
  if (want('extensionHint')) out.extensionHint = str(b.extensionHint, 'extensionHint', 'La extensión orientativa', { max: 300, optional: true });
  if (want('supportHtml')) out.supportHtml = richText(b.supportHtml, 'supportHtml', 'Los recursos de apoyo', { optional: true });
  if (want('teacherGuideHtml')) out.teacherGuideHtml = richText(b.teacherGuideHtml, 'teacherGuideHtml', 'La guía docente', { optional: true });
  if (want('materials')) {
    const rawMaterials = b.materials ?? [];
    if (!Array.isArray(rawMaterials)) throw badRequest('Los materiales no tienen un formato válido.', { field: 'materials' });
    out.materials = rawMaterials.slice(0, 20).map((item, index) => {
      const name = str(item?.name, `materials.${index}.name`, `El nombre del material ${index + 1}`, { max: 200 });
      const fileId = item?.fileId ? idField(item.fileId, `materials.${index}.fileId`, 'El archivo') : null;
      const url = readUrl(item?.url, `materials.${index}.url`);
      if (!fileId && !url) throw badRequest(`El material ${index + 1} necesita un archivo o un enlace.`, { field: 'materials' });
      return { name, fileId, url };
    });
  }
  if (want('dueAt')) out.dueAt = b.dueAt ? dayBoundary(b.dueAt, 'dueAt', 'La fecha límite', { optional: true, end: true }) : null;
  if (want('allowText')) out.allowText = bool(b.allowText ?? true, 'allowText', 'La entrega por texto');
  if (want('allowLink')) out.allowLink = bool(b.allowLink ?? false, 'allowLink', 'La entrega por enlace');
  if (want('allowFile')) out.allowFile = bool(b.allowFile ?? true, 'allowFile', 'La entrega por archivo');
  if (want('acceptedExtensions')) {
    out.acceptedExtensions = strList(b.acceptedExtensions ?? ['pdf', 'docx', 'xlsx', 'pptx', 'png', 'jpg', 'jpeg'], 'acceptedExtensions', 'Los formatos', { maxItems: 12, maxLength: 12 })
      .map((ext) => ext.toLowerCase().replace(/^\./, ''));
  }
  if (want('maxFileMb')) out.maxFileMb = int(b.maxFileMb ?? 20, 'maxFileMb', 'El tamaño máximo', { min: 1, max: 1024 });
  if (want('maxPoints')) out.maxPoints = num(b.maxPoints ?? 100, 'maxPoints', 'El puntaje máximo', { min: 1, max: 1000 });
  if (want('isRequired')) out.isRequired = bool(b.isRequired ?? true, 'isRequired', 'La obligatoriedad');
  if (want('weight')) out.weight = num(b.weight ?? 0, 'weight', 'El peso', { min: 0, max: 100 });
  if (want('gradingMethod')) out.gradingMethod = oneOf(b.gradingMethod ?? 'directa', 'gradingMethod', 'La forma de calificar', ['directa', 'rubrica']);
  if (want('rubric')) out.rubric = readRubric(b.rubric).rubric;
  if (want('sortOrder')) out.sortOrder = int(b.sortOrder ?? 0, 'sortOrder', 'El orden', { min: 0, max: 100000 });
  return out;
}

export function readForum(body = {}, { partial = false } = {}) {
  const b = body || {};
  const want = (k) => !partial || has(b, k);
  const out = {};
  if (want('title')) out.title = str(b.title, 'title', 'El título', { max: 160 });
  if (want('moduleId')) out.moduleId = b.moduleId ? idField(b.moduleId, 'moduleId', 'La unidad') : null;
  if (want('purpose')) out.purpose = str(b.purpose, 'purpose', 'El propósito', { max: 500, optional: true });
  if (want('description')) out.description = richText(b.description, 'description', 'El caso o dilema', { optional: true });
  if (want('centralQuestion')) out.centralQuestion = str(b.centralQuestion, 'centralQuestion', 'La pregunta central', { max: 1000, optional: true });
  if (want('guidingQuestions')) out.guidingQuestions = strList(b.guidingQuestions ?? [], 'guidingQuestions', 'Las preguntas de profundización', { maxItems: 10, maxLength: 500 });
  if (want('participationHtml')) out.participationHtml = richText(b.participationHtml, 'participationHtml', 'Las instrucciones de participación', { optional: true });
  if (want('rulesHtml')) out.rulesHtml = richText(b.rulesHtml, 'rulesHtml', 'Las reglas de convivencia', { optional: true });
  if (want('opensAt')) out.opensAt = b.opensAt ? dayBoundary(b.opensAt, 'opensAt', 'La apertura', { optional: true }) : null;
  if (want('closesAt')) out.closesAt = b.closesAt ? dayBoundary(b.closesAt, 'closesAt', 'El cierre', { optional: true, end: true }) : null;
  if (want('isClosed')) out.isClosed = bool(b.isClosed ?? false, 'isClosed', 'Cerrar respuestas');
  if (want('allowAttachments')) out.allowAttachments = bool(b.allowAttachments ?? false, 'allowAttachments', 'Permitir adjuntos');
  if (want('gradingMethod')) out.gradingMethod = oneOf(b.gradingMethod ?? 'formativa', 'gradingMethod', 'La forma de calificar', ['formativa', 'directa', 'rubrica']);
  if (want('weight')) out.weight = num(b.weight ?? 0, 'weight', 'El peso', { min: 0, max: 100 });
  if (want('rubric')) out.rubric = readRubric(b.rubric).rubric;
  if (want('noParticipantsAlternative')) {
    out.noParticipantsAlternative = str(b.noParticipantsAlternative, 'noParticipantsAlternative', 'La alternativa sin participantes', { max: 2000, optional: true });
  }
  if (want('sortOrder')) out.sortOrder = int(b.sortOrder ?? 0, 'sortOrder', 'El orden', { min: 0, max: 100000 });
  out.scope = 'modulo';
  return out;
}

function quizRow(r) {
  return {
    id: r.id, type: 'quiz', courseId: r.course_id, moduleId: r.module_id,
    title: r.title, instructionsHtml: r.instructions_html || '',
    status: r.status, isRequired: r.is_required, weight: r.weight === null ? null : Number(r.weight),
    sortOrder: r.sort_order, passingScore: r.passing_score === null ? null : Number(r.passing_score),
    maxAttempts: r.max_attempts, showAnswersAfterSubmit: r.show_answers_after_submit,
    questionCount: Number(r.question_count || 0), attemptCount: Number(r.attempt_count || 0),
    updatedAt: r.updated_at,
  };
}

function activityRow(r) {
  return {
    id: r.id, type: 'activity', courseId: r.course_id, moduleId: r.module_id,
    title: r.title, status: r.status, isRequired: r.is_required,
    weight: r.weight === null ? null : Number(r.weight), sortOrder: r.sort_order,
    gradingMethod: r.grading_method, maxPoints: Number(r.max_points),
    submissionCount: Number(r.submission_count || 0), gradedCount: Number(r.graded_count || 0),
    dueAt: r.due_at, updatedAt: r.updated_at,
  };
}

function forumRow(r) {
  return {
    id: r.id, type: 'forum', courseId: r.course_id, moduleId: r.module_id,
    title: r.title, status: r.status, weight: r.weight === null ? null : Number(r.weight),
    sortOrder: r.sort_order, gradingMethod: r.grading_method, isClosed: r.is_closed,
    opensAt: r.opens_at, closesAt: r.closes_at,
    postCount: Number(r.post_count || 0), gradeCount: Number(r.grade_count || 0),
    updatedAt: r.updated_at,
  };
}

const QUIZ_SELECT = `
  SELECT a.*,
         (SELECT count(*)::int FROM aula_assessment_questions aq WHERE aq.assessment_id = a.id) AS question_count,
         (SELECT count(*)::int FROM aula_attempts at WHERE at.assessment_id = a.id AND at.status <> 'en_curso') AS attempt_count
    FROM aula_assessments a`;
const ACTIVITY_SELECT = `
  SELECT a.*,
         (SELECT count(*)::int FROM aula_submissions s WHERE s.activity_id = a.id AND s.current_revision > 0) AS submission_count,
         (SELECT count(*)::int FROM aula_submissions s WHERE s.activity_id = a.id AND s.score IS NOT NULL) AS graded_count
    FROM aula_activities a`;
const FORUM_SELECT = `
  SELECT f.*,
         (SELECT count(*)::int FROM aula_forum_posts p WHERE p.forum_id = f.id AND p.deleted_at IS NULL AND p.is_hidden = FALSE) AS post_count,
         (SELECT count(*)::int FROM aula_forum_grades g WHERE g.forum_id = f.id) AS grade_count
    FROM aula_forums f`;

export async function authoringData(db, actor, courseId) {
  await requireCourseTeacher(db, actor, courseId);
  const course = await loadCourse(db, courseId);
  const modules = await many(
    db,
    `SELECT id, title, description, sort_order FROM aula_modules
      WHERE course_id = $1 AND deleted_at IS NULL ORDER BY sort_order, id`,
    [courseId],
  );
  const quizzes = (await many(db, `${QUIZ_SELECT} WHERE a.course_id = $1 AND a.deleted_at IS NULL ORDER BY a.sort_order, a.id`, [courseId])).map(quizRow);
  const activities = (await many(db, `${ACTIVITY_SELECT} WHERE a.course_id = $1 AND a.deleted_at IS NULL ORDER BY a.sort_order, a.id`, [courseId])).map(activityRow);
  const forums = (await many(db, `${FORUM_SELECT} WHERE f.course_id = $1 AND f.deleted_at IS NULL ORDER BY f.sort_order, f.id`, [courseId])).map(forumRow);
  const weightSums = (rows) => round2(rows.filter((r) => r.status === 'publicado').reduce((sum, r) => sum + (Number(r.weight) || 0), 0));
  const requiredActivities = activities.filter((a) => a.isRequired && a.status === 'publicado').length;
  const policy = asJson(course.grade_policy);
  return {
    course: {
      id: course.id, title: course.title, status: course.status,
      passingScore: Number(course.passing_score), maxAttempts: course.max_attempts,
      gradePolicy: policy,
    },
    modules,
    quizzes,
    activities,
    forums,
    limits: { maxRequiredActivities: MAX_REQUIRED_ACTIVITIES, requiredActivities },
    weights: {
      activities: weightSums(activities),
      quizzes: weightSums(quizzes),
      forums: weightSums(forums),
    },
  };
}

async function loadQuiz(db, quizId) {
  const row = await one(
    db,
    `${QUIZ_SELECT} JOIN aula_courses c ON c.id = a.course_id AND c.deleted_at IS NULL
      WHERE a.id = $1 AND a.deleted_at IS NULL`,
    [quizId],
  );
  if (!row) throw notFound('No encontramos ese quiz.');
  return row;
}

async function loadActivity(db, activityId) {
  const row = await one(
    db,
    `${ACTIVITY_SELECT} JOIN aula_courses c ON c.id = a.course_id AND c.deleted_at IS NULL
      WHERE a.id = $1 AND a.deleted_at IS NULL`,
    [activityId],
  );
  if (!row) throw notFound('No encontramos esa actividad.');
  return row;
}

async function loadForum(db, forumId) {
  const row = await one(
    db,
    `${FORUM_SELECT} JOIN aula_courses c ON c.id = f.course_id AND c.deleted_at IS NULL
      WHERE f.id = $1 AND f.deleted_at IS NULL`,
    [forumId],
  );
  if (!row) throw notFound('No encontramos ese foro.');
  return row;
}

async function quizQuestions(db, quizId) {
  const rows = await many(
    db,
    `SELECT q.id, q.prompt_html, q.points, q.explanation, q.general_feedback, q.config, aq.sort_order
       FROM aula_assessment_questions aq
       JOIN aula_questions q ON q.id = aq.question_id
      WHERE aq.assessment_id = $1 AND q.deleted_at IS NULL
      ORDER BY aq.sort_order, q.id`,
    [quizId],
  );
  const ids = rows.map((q) => q.id);
  const options = ids.length
    ? await many(
      db,
      `SELECT id, question_id, text, is_correct, feedback, sort_order
         FROM aula_question_options WHERE question_id = ANY($1::bigint[]) AND deleted_at IS NULL
        ORDER BY sort_order, id`,
      [ids],
    )
    : [];
  const byQuestion = new Map();
  for (const option of options) {
    if (!byQuestion.has(option.question_id)) byQuestion.set(option.question_id, []);
    byQuestion.get(option.question_id).push({
      id: option.id, text: option.text, isCorrect: option.is_correct,
      feedback: option.feedback || '', sortOrder: option.sort_order,
    });
  }
  return rows.map((q) => ({
    id: q.id, promptHtml: q.prompt_html, points: Number(q.points),
    explanation: q.explanation || '', generalFeedback: q.general_feedback || '',
    config: asJson(q.config) || {}, sortOrder: q.sort_order,
    options: byQuestion.get(q.id) || [],
  }));
}

export async function quizEditor(db, actor, quizId) {
  const quiz = await loadQuiz(db, quizId);
  await requireCourseTeacher(db, actor, quiz.course_id);
  return { quiz: quizRow(quiz), questions: await quizQuestions(db, quizId) };
}

export async function activityEditor(db, actor, activityId) {
  const row = await loadActivity(db, activityId);
  await requireCourseTeacher(db, actor, row.course_id);
  return {
    activity: {
      ...activityRow(row),
      instructionsHtml: row.instructions_html || '',
      caseHtml: row.case_html || '',
      pointsToSolve: asJson(row.points_to_solve) || [],
      expectedProduct: row.expected_product || '',
      extensionHint: row.extension_hint || '',
      supportHtml: row.support_html || '',
      teacherGuideHtml: row.teacher_guide_html || '',
      materials: asJson(row.materials) || [],
      allowText: row.allow_text, allowLink: row.allow_link, allowFile: row.allow_file,
      acceptedExtensions: row.accepted_extensions || [],
      maxFileMb: row.max_file_mb, rubric: asJson(row.rubric),
    },
  };
}

export async function forumEditor(db, actor, forumId) {
  const row = await loadForum(db, forumId);
  await requireCourseTeacher(db, actor, row.course_id);
  return {
    forum: {
      ...forumRow(row),
      purpose: row.purpose || '', description: row.description || '',
      centralQuestion: row.central_question || '',
      guidingQuestions: row.guiding_questions || [],
      participationHtml: row.participation_html || '',
      rulesHtml: row.rules_html || '',
      noParticipantsAlternative: row.no_participants_alternative || '',
      rubric: asJson(row.rubric),
    },
  };
}

async function ensureQuestionBank(db, quiz, actor) {
  const linked = await one(
    db,
    `SELECT q.bank_id FROM aula_assessment_questions aq
       JOIN aula_questions q ON q.id = aq.question_id
      WHERE aq.assessment_id = $1 LIMIT 1`,
    [quiz.id],
  );
  if (linked) return linked.bank_id;
  const name = 'Banco de preguntas del curso';
  const existing = await one(
    db,
    'SELECT id FROM aula_question_banks WHERE course_id = $1 AND name = $2 AND deleted_at IS NULL LIMIT 1',
    [quiz.course_id, name],
  );
  if (existing) return existing.id;
  const created = await one(
    db,
    'INSERT INTO aula_question_banks (course_id, name, description) VALUES ($1, $2, $3) RETURNING id',
    [quiz.course_id, name, 'Preguntas creadas desde el editor del curso.'],
  );
  return created.id;
}

async function saveQuestions(db, quiz, questions, actor) {
  if (questions === undefined) return;
  const bankId = await ensureQuestionBank(db, quiz, actor);
  const current = await many(
    db,
    `SELECT aq.question_id, q.bank_id FROM aula_assessment_questions aq
       JOIN aula_questions q ON q.id = aq.question_id
      WHERE aq.assessment_id = $1`,
    [quiz.id],
  );
  const allowed = new Set(current.map((r) => Number(r.question_id)));
  const keep = new Set();
  for (const [index, question] of questions.entries()) {
    if (question.id && !allowed.has(Number(question.id))) {
      throw badRequest('Una de las preguntas no pertenece a este quiz.', { field: 'questions' });
    }
    let questionId = question.id ? Number(question.id) : null;
    if (questionId) {
      await db.query(
        `UPDATE aula_questions
            SET bank_id = $2, type = 'unica', prompt_html = $3, points = $4,
                explanation = $5, general_feedback = $6, config = $7::jsonb, updated_at = NOW()
          WHERE id = $1 AND deleted_at IS NULL`,
        [questionId, bankId, question.promptHtml, question.points, question.explanation || null,
          question.generalFeedback || null, JSON.stringify(question.config || {})],
      );
    } else {
      const created = await one(
        db,
        `INSERT INTO aula_questions (bank_id, type, prompt_html, points, explanation, general_feedback, config, created_by)
         VALUES ($1, 'unica', $2, $3, $4, $5, $6::jsonb, $7) RETURNING id`,
        [bankId, question.promptHtml, question.points, question.explanation || null,
          question.generalFeedback || null, JSON.stringify(question.config || {}), actor.id],
      );
      questionId = Number(created.id);
    }
    keep.add(questionId);
    await db.query(
      `INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (assessment_id, question_id)
       DO UPDATE SET sort_order = EXCLUDED.sort_order, points_override = EXCLUDED.points_override`,
      [quiz.id, questionId, index, question.points],
    );
    const oldOptions = await many(
      db,
      'SELECT id FROM aula_question_options WHERE question_id = $1 AND deleted_at IS NULL',
      [questionId],
    );
    const oldIds = new Set(oldOptions.map((o) => Number(o.id)));
    const keptOptions = new Set();
    for (const [oi, option] of question.options.entries()) {
      if (option.id && !oldIds.has(Number(option.id))) {
        throw badRequest(`Una de las opciones de la pregunta ${index + 1} no pertenece a esa pregunta.`, { field: 'questions' });
      }
      if (option.id) {
        keptOptions.add(Number(option.id));
        await db.query(
          `UPDATE aula_question_options
              SET text = $2, is_correct = $3, feedback = $4, sort_order = $5, updated_at = NOW()
            WHERE id = $1 AND question_id = $6`,
          [option.id, option.text, option.isCorrect, option.feedback || null, oi, questionId],
        );
      } else {
        const created = await one(
          db,
          `INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
           VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [questionId, option.text, option.isCorrect, option.feedback || null, oi],
        );
        keptOptions.add(Number(created.id));
      }
    }
    for (const oldId of oldIds) {
      if (!keptOptions.has(oldId)) {
        await db.query('UPDATE aula_question_options SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1', [oldId]);
      }
    }
  }
  for (const row of current) {
    if (keep.has(Number(row.question_id))) continue;
    await db.query('DELETE FROM aula_assessment_questions WHERE assessment_id = $1 AND question_id = $2', [quiz.id, row.question_id]);
    const usedElsewhere = await one(
      db,
      'SELECT 1 FROM aula_assessment_questions WHERE question_id = $1 LIMIT 1',
      [row.question_id],
    );
    if (!usedElsewhere) {
      await db.query('UPDATE aula_questions SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1', [row.question_id]);
    }
  }
}

function validateQuizForPublish(questions) {
  if (!questions.length) throw badRequest('Agrega al menos una pregunta antes de publicar.', { field: 'questions' });
  for (const [index, question] of questions.entries()) {
    const number = question.sortOrder + 1 || index + 1;
    if (!htmlToText(question.promptHtml)) {
      throw badRequest(`La pregunta ${index + 1} no tiene enunciado.`, { field: 'questions' });
    }
    if (question.options.length < 2) {
      throw badRequest(`La pregunta ${index + 1} necesita al menos dos opciones.`, { field: 'questions' });
    }
    const texts = new Set();
    let correct = 0;
    for (const [oi, option] of question.options.entries()) {
      const text = cleanText(option.text, 1000);
      if (!text) throw badRequest(`La opción ${String.fromCharCode(65 + oi)} de la pregunta ${index + 1} está vacía.`, { field: 'questions' });
      const key = text.toLowerCase();
      if (texts.has(key)) throw badRequest(`La pregunta ${index + 1} tiene opciones duplicadas.`, { field: 'questions' });
      texts.add(key);
      if (option.isCorrect) correct += 1;
    }
    if (correct !== 1) {
      throw badRequest(`La pregunta ${index + 1} debe tener exactamente una respuesta correcta.`, { field: 'questions' });
    }
    if (number < 1) throw badRequest('El orden de las preguntas no es válido.', { field: 'questions' });
  }
}

function validateRubricForPublish(rubric, field = 'rubric') {
  if (!rubric || !Array.isArray(rubric.criteria) || !rubric.criteria.length) {
    throw badRequest('Agrega al menos un criterio a la rúbrica.', { field });
  }
  const sum = round2(rubric.criteria.reduce((total, c) => total + Number(c.weight || 0), 0));
  if (Math.abs(sum - 100) > 0.05) throw badRequest(`Los pesos de la rúbrica suman ${sum} %, no 100 %.`, { field });
}

export async function createQuiz(db, actor, courseId, input, { ip, now = new Date() } = {}) {
  return db.tx(async (tx) => {
    await requireCourseTeacher(tx, actor, courseId);
    const course = await loadCourse(tx, courseId);
    if (course.status === 'archivado') throw conflict('El curso está archivado; restáuralo antes de crear recursos.');
    if (!input.moduleId) throw badRequest('Elige la unidad del quiz.', { field: 'moduleId' });
    await assertModule(tx, courseId, input.moduleId);
    const maxOrder = await one(tx, 'SELECT coalesce(max(sort_order), -1)::int + 1 AS n FROM aula_assessments WHERE course_id = $1', [courseId]);
    const row = await one(
      tx,
      `INSERT INTO aula_assessments
         (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
          show_answers_after_submit, status, weight, sort_order, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'borrador', $9, $10, $11)
       RETURNING *`,
      [courseId, input.moduleId, input.title, input.instructionsHtml, input.isRequired,
        input.passingScore, input.maxAttempts, input.showAnswersAfterSubmit, input.weight,
        maxOrder?.n ?? 0, actor.id],
    );
    await saveQuestions(tx, row, input.questions, actor);
    await audit(tx, {
      actor, ip, action: 'quiz.crear', entityType: 'quiz', entityId: row.id, courseId,
      summary: `Quiz “${row.title}” creado en borrador.`, after: { moduleId: input.moduleId, weight: input.weight },
    });
    return quizEditor(tx, actor, row.id);
  });
}

export async function updateQuiz(db, actor, quizId, input, { ip, now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const quiz = await loadQuiz(tx, quizId);
    await requireCourseTeacher(tx, actor, quiz.course_id);
    if (quiz.status === 'archivado') throw conflict('El quiz está archivado; restáuralo desde el editor antes de cambiarlo.');
    if (input.moduleId) await assertModule(tx, quiz.course_id, input.moduleId);
    const columns = {
      title: 'title', moduleId: 'module_id', instructionsHtml: 'instructions_html', isRequired: 'is_required',
      passingScore: 'passing_score', maxAttempts: 'max_attempts',
      showAnswersAfterSubmit: 'show_answers_after_submit', weight: 'weight', sortOrder: 'sort_order',
    };
    const keys = Object.keys(columns).filter((k) => input[k] !== undefined);
    if (keys.length) {
      const sets = keys.map((k, i) => `${columns[k]} = $${i + 2}`);
      await tx.query(
        `UPDATE aula_assessments SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $1`,
        [quiz.id, ...keys.map((k) => input[k])],
      );
    }
    await saveQuestions(tx, quiz, input.questions, actor);
    await audit(tx, {
      actor, ip, action: 'quiz.editar', entityType: 'quiz', entityId: quiz.id, courseId: quiz.course_id,
      summary: `Quiz “${quiz.title}” actualizado.`,
      before: { title: quiz.title, status: quiz.status, weight: quiz.weight },
      after: { fields: keys, questionsChanged: input.questions !== undefined },
    });
    const refreshed = await loadQuiz(tx, quiz.id);
    return { quiz: quizRow(refreshed), questions: await quizQuestions(tx, quiz.id) };
  });
}

export async function publishQuiz(db, actor, quizId, { ip } = {}) {
  return db.tx(async (tx) => {
    const quiz = await loadQuiz(tx, quizId);
    await requireCourseTeacher(tx, actor, quiz.course_id);
    if (quiz.status === 'archivado') throw conflict('Un quiz archivado no se puede publicar. Duplícalo para crear una versión nueva.');
    if (!quiz.module_id) throw badRequest('El quiz no está asociado a una unidad.', { field: 'moduleId' });
    await assertModule(tx, quiz.course_id, quiz.module_id);
    if (!htmlToText(quiz.title)) throw badRequest('El quiz no tiene título.', { field: 'title' });
    validateQuizForPublish(await quizQuestions(tx, quiz.id));
    const row = await one(
      tx,
      "UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = $1 RETURNING *",
      [quiz.id],
    );
    await audit(tx, {
      actor, ip, action: 'quiz.publicar', entityType: 'quiz', entityId: quiz.id, courseId: quiz.course_id,
      summary: `Quiz “${quiz.title}” publicado en la unidad ${quiz.module_id}.`,
      before: { status: quiz.status }, after: { status: 'publicado' },
    });
    return quizRow(row);
  });
}

export async function archiveQuiz(db, actor, quizId, reason, { ip } = {}) {
  return db.tx(async (tx) => {
    if (!reason || String(reason).trim().length < 5) throw badRequest('Explica el motivo del archivo.', { field: 'reason' });
    const quiz = await loadQuiz(tx, quizId);
    await requireCourseTeacher(tx, actor, quiz.course_id);
    const row = await one(
      tx,
      "UPDATE aula_assessments SET status = 'archivado', updated_at = NOW() WHERE id = $1 RETURNING *",
      [quiz.id],
    );
    await audit(tx, {
      actor, ip, action: 'quiz.archivar', entityType: 'quiz', entityId: quiz.id, courseId: quiz.course_id,
      summary: `Quiz “${quiz.title}” archivado.`, reason: reason || null,
      before: { status: quiz.status }, after: { status: 'archivado' },
    });
    return quizRow(row);
  });
}

export async function duplicateQuiz(db, actor, quizId, { ip } = {}) {
  return db.tx(async (tx) => {
    const quiz = await loadQuiz(tx, quizId);
    await requireCourseTeacher(tx, actor, quiz.course_id);
    const maxOrder = await one(tx, 'SELECT coalesce(max(sort_order), -1)::int + 1 AS n FROM aula_assessments WHERE course_id = $1', [quiz.course_id]);
    const copy = await one(
      tx,
      `INSERT INTO aula_assessments
         (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
          show_answers_after_submit, status, weight, sort_order, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'borrador', $9, $10, $11)
       RETURNING *`,
      [quiz.course_id, quiz.module_id, `${quiz.title} (copia)`, quiz.instructions_html, quiz.is_required,
        quiz.passing_score, quiz.max_attempts, quiz.show_answers_after_submit, quiz.weight,
        maxOrder?.n ?? 0, actor.id],
    );
    const questions = await quizQuestions(tx, quiz.id);
    await saveQuestions(tx, copy, questions.map((q) => ({
      promptHtml: q.promptHtml, points: q.points, explanation: q.explanation,
      generalFeedback: q.generalFeedback, config: q.config,
      options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect, feedback: o.feedback })),
    })), actor);
    await audit(tx, {
      actor, ip, action: 'quiz.duplicar', entityType: 'quiz', entityId: copy.id, courseId: quiz.course_id,
      summary: `Quiz “${quiz.title}” duplicado en borrador.`, after: { sourceId: quiz.id },
    });
    return quizEditor(tx, actor, copy.id);
  });
}

async function moveResource(db, actor, table, resource, targetModuleId, position, { ip } = {}) {
  await requireCourseTeacher(db, actor, resource.course_id);
  await assertModule(db, resource.course_id, targetModuleId);
  const siblings = await many(
    db,
    `SELECT id FROM ${table}
      WHERE course_id = $1 AND module_id = $2 AND id <> $3 AND deleted_at IS NULL
      ORDER BY sort_order, id`,
    [resource.course_id, targetModuleId, resource.id],
  );
  const at = Math.max(0, Math.min(Number.isInteger(position) ? position : siblings.length, siblings.length));
  const ordered = [...siblings.slice(0, at).map((r) => r.id), resource.id, ...siblings.slice(at).map((r) => r.id)];
  await db.query(`UPDATE ${table} SET module_id = $2, updated_at = NOW() WHERE id = $1`, [resource.id, targetModuleId]);
  for (const [index, id] of ordered.entries()) {
    await db.query(`UPDATE ${table} SET sort_order = $2, updated_at = NOW() WHERE id = $1`, [id, index]);
  }
  await audit(db, {
    actor, ip, action: `${resource.kind}.mover`, entityType: resource.kind, entityId: resource.id, courseId: resource.course_id,
    summary: `${resource.title} movido a la unidad ${targetModuleId}, posición ${at + 1}.`,
    before: { moduleId: resource.module_id, sortOrder: resource.sort_order },
    after: { moduleId: targetModuleId, position: at },
  });
}

export async function moveQuiz(db, actor, quizId, targetModuleId, position, opts) {
  const quiz = await loadQuiz(db, quizId);
  await moveResource(db, actor, 'aula_assessments', { ...quiz, kind: 'quiz' }, targetModuleId, position, opts);
  return quizEditor(db, actor, quizId);
}

export async function createActivity(db, actor, courseId, input, { ip } = {}) {
  return db.tx(async (tx) => {
    await requireCourseTeacher(tx, actor, courseId);
    const course = await loadCourse(tx, courseId);
    if (course.status === 'archivado') throw conflict('El curso está archivado; restáuralo antes de crear recursos.');
    if (!input.moduleId) throw badRequest('Elige la unidad de la actividad.', { field: 'moduleId' });
    await assertModule(tx, courseId, input.moduleId);
    if (!input.allowText && !input.allowLink && !input.allowFile) {
      throw badRequest('Elige al menos una forma de entrega.', { field: 'allowText' });
    }
    await assertMaterialFiles(tx, actor, input.materials || []);
    const maxOrder = await one(tx, 'SELECT coalesce(max(sort_order), -1)::int + 1 AS n FROM aula_activities WHERE course_id = $1', [courseId]);
    const row = await one(
      tx,
      `INSERT INTO aula_activities
         (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
          extension_hint, support_html, teacher_guide_html, materials, rubric, due_at, allow_text,
          allow_link, allow_file, accepted_extensions, max_file_mb, max_points, is_required, status,
          weight, grading_method, sort_order, created_by)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11::jsonb, $12::jsonb, $13, $14,
               $15, $16, $17, $18, $19, $20, 'borrador', $21, $22, $23, $24)
       RETURNING *`,
      [courseId, input.moduleId, input.title, input.instructionsHtml, input.caseHtml,
        JSON.stringify(input.pointsToSolve || []), input.expectedProduct, input.extensionHint,
        input.supportHtml, input.teacherGuideHtml, JSON.stringify(input.materials || []),
        input.rubric ? JSON.stringify(input.rubric) : null, input.dueAt, input.allowText,
        input.allowLink, input.allowFile, input.acceptedExtensions, input.maxFileMb, input.maxPoints,
        input.isRequired, input.weight, input.gradingMethod, maxOrder?.n ?? 0, actor.id],
    );
    await audit(tx, {
      actor, ip, action: 'actividad.crear', entityType: 'actividad', entityId: row.id, courseId,
      summary: `Actividad “${row.title}” creada en borrador.`, after: { moduleId: input.moduleId, weight: input.weight },
    });
    return activityEditor(tx, actor, row.id);
  });
}

export async function updateActivity(db, actor, activityId, input, { ip } = {}) {
  return db.tx(async (tx) => {
    const activity = await loadActivity(tx, activityId);
    await requireCourseTeacher(tx, actor, activity.course_id);
    if (activity.status === 'archivado') throw conflict('La actividad está archivada; restáurala antes de cambiarla.');
    if (input.moduleId) await assertModule(tx, activity.course_id, input.moduleId);
    if (input.allowText === false && input.allowLink === false && input.allowFile === false) {
      throw badRequest('Elige al menos una forma de entrega.', { field: 'allowText' });
    }
    if (input.materials !== undefined) await assertMaterialFiles(tx, actor, input.materials || []);
    const columns = {
      title: 'title', moduleId: 'module_id', instructionsHtml: 'instructions_html', caseHtml: 'case_html',
      pointsToSolve: 'points_to_solve', expectedProduct: 'expected_product', extensionHint: 'extension_hint',
      supportHtml: 'support_html', teacherGuideHtml: 'teacher_guide_html', materials: 'materials',
      dueAt: 'due_at', allowText: 'allow_text', allowLink: 'allow_link', allowFile: 'allow_file',
      acceptedExtensions: 'accepted_extensions', maxFileMb: 'max_file_mb', maxPoints: 'max_points',
      isRequired: 'is_required', weight: 'weight', gradingMethod: 'grading_method', rubric: 'rubric',
      sortOrder: 'sort_order',
    };
    const keys = Object.keys(columns).filter((k) => input[k] !== undefined);
    if (keys.length) {
      const sets = keys.map((k, i) => `${columns[k]} = $${i + 2}${['pointsToSolve', 'materials', 'rubric'].includes(k) ? '::jsonb' : ''}`);
      const params = keys.map((k) => (['pointsToSolve', 'materials', 'rubric'].includes(k)
        ? (input[k] === null ? null : JSON.stringify(input[k]))
        : input[k]));
      await tx.query(
        `UPDATE aula_activities SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $1`,
        [activity.id, ...params],
      );
    }
    await audit(tx, {
      actor, ip, action: 'actividad.editar', entityType: 'actividad', entityId: activity.id, courseId: activity.course_id,
      summary: `Actividad “${activity.title}” actualizada.`,
      before: { title: activity.title, status: activity.status, weight: activity.weight },
      after: { fields: keys },
    });
    return activityEditor(tx, actor, activity.id);
  });
}

export async function publishActivity(db, actor, activityId, { ip } = {}) {
  return db.tx(async (tx) => {
    const activity = await loadActivity(tx, activityId);
    await requireCourseTeacher(tx, actor, activity.course_id);
    if (!activity.module_id) throw badRequest('La actividad no está asociada a una unidad.', { field: 'moduleId' });
    await assertModule(tx, activity.course_id, activity.module_id);
    if (!htmlToText(activity.instructions_html)) throw badRequest('Escribe la consigna de la actividad.', { field: 'instructionsHtml' });
    if (!activity.allow_text && !activity.allow_link && !activity.allow_file) {
      throw badRequest('Elige al menos una forma de entrega.', { field: 'allowText' });
    }
    if (activity.allow_file && !(activity.accepted_extensions || []).length) {
      throw badRequest('Indica al menos un formato de archivo aceptado.', { field: 'acceptedExtensions' });
    }
    if (activity.grading_method === 'rubrica') validateRubricForPublish(asJson(activity.rubric), 'rubric');
    if (activity.is_required) {
      const count = await one(
        tx,
        `SELECT count(*)::int AS n FROM aula_activities
          WHERE course_id = $1 AND id <> $2 AND is_required = TRUE
            AND status = 'publicado' AND deleted_at IS NULL`,
        [activity.course_id, activity.id],
      );
      if (Number(count.n) >= MAX_REQUIRED_ACTIVITIES) {
        throw conflict(
          `Este curso ya tiene ${MAX_REQUIRED_ACTIVITIES} actividades obligatorias. Puedes publicar esta como formativa (sin obligatoriedad) o archivar otra. Los quizzes y los foros no cuentan para este límite.`,
          { field: 'isRequired', limit: MAX_REQUIRED_ACTIVITIES },
        );
      }
    }
    const row = await one(
      tx,
      "UPDATE aula_activities SET status = 'publicado', updated_at = NOW() WHERE id = $1 RETURNING *",
      [activity.id],
    );
    await audit(tx, {
      actor, ip, action: 'actividad.publicar', entityType: 'actividad', entityId: activity.id, courseId: activity.course_id,
      summary: `Actividad “${activity.title}” publicada.`,
      before: { status: activity.status }, after: { status: 'publicado' },
    });
    return activityEditor(tx, actor, row.id);
  });
}

export async function archiveActivity(db, actor, activityId, reason, { ip } = {}) {
  return db.tx(async (tx) => {
    if (!reason || String(reason).trim().length < 5) throw badRequest('Explica el motivo del archivo.', { field: 'reason' });
    const activity = await loadActivity(tx, activityId);
    await requireCourseTeacher(tx, actor, activity.course_id);
    const row = await one(
      tx,
      "UPDATE aula_activities SET status = 'archivado', updated_at = NOW() WHERE id = $1 RETURNING *",
      [activity.id],
    );
    await audit(tx, {
      actor, ip, action: 'actividad.archivar', entityType: 'actividad', entityId: activity.id, courseId: activity.course_id,
      summary: `Actividad “${activity.title}” archivada.`, reason: reason || null,
      before: { status: activity.status }, after: { status: 'archivado' },
    });
    return activityRow(row);
  });
}

export async function duplicateActivity(db, actor, activityId, { ip } = {}) {
  return db.tx(async (tx) => {
    const activity = await loadActivity(tx, activityId);
    await requireCourseTeacher(tx, actor, activity.course_id);
    const maxOrder = await one(tx, 'SELECT coalesce(max(sort_order), -1)::int + 1 AS n FROM aula_activities WHERE course_id = $1', [activity.course_id]);
    const copy = await one(
      tx,
      `INSERT INTO aula_activities
         (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
          extension_hint, support_html, teacher_guide_html, materials, rubric, due_at, allow_text,
          allow_link, allow_file, accepted_extensions, max_file_mb, max_points, is_required, status,
          weight, grading_method, sort_order, created_by)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, $9, $10, $11::jsonb, $12::jsonb, $13, $14,
               $15, $16, $17, $18, $19, $20, 'borrador', $21, $22, $23, $24)
       RETURNING *`,
      [activity.course_id, activity.module_id, `${activity.title} (copia)`, activity.instructions_html,
        activity.case_html, JSON.stringify(asJson(activity.points_to_solve) || []), activity.expected_product,
        activity.extension_hint, activity.support_html, activity.teacher_guide_html,
        JSON.stringify(asJson(activity.materials) || []),
        activity.rubric ? JSON.stringify(asJson(activity.rubric)) : null, activity.due_at,
        activity.allow_text, activity.allow_link, activity.allow_file, activity.accepted_extensions,
        activity.max_file_mb, activity.max_points, activity.is_required, activity.weight,
        activity.grading_method, maxOrder?.n ?? 0, actor.id],
    );
    await audit(tx, {
      actor, ip, action: 'actividad.duplicar', entityType: 'actividad', entityId: copy.id, courseId: activity.course_id,
      summary: `Actividad “${activity.title}” duplicada en borrador.`, after: { sourceId: activity.id },
    });
    return activityEditor(tx, actor, copy.id);
  });
}

export async function moveActivity(db, actor, activityId, targetModuleId, position, opts) {
  const activity = await loadActivity(db, activityId);
  await moveResource(db, actor, 'aula_activities', { ...activity, kind: 'actividad' }, targetModuleId, position, opts);
  return activityEditor(db, actor, activityId);
}

export async function createForum(db, actor, courseId, input, { ip } = {}) {
  return db.tx(async (tx) => {
    await requireCourseTeacher(tx, actor, courseId);
    const course = await loadCourse(tx, courseId);
    if (course.status === 'archivado') throw conflict('El curso está archivado; restáuralo antes de crear recursos.');
    if (!input.moduleId) throw badRequest('Elige la unidad del foro.', { field: 'moduleId' });
    await assertModule(tx, courseId, input.moduleId);
    if (input.opensAt && input.closesAt && input.closesAt <= input.opensAt) {
      throw badRequest('El cierre del foro debe ser posterior a la apertura.', { field: 'closesAt' });
    }
    const maxOrder = await one(tx, 'SELECT coalesce(max(sort_order), -1)::int + 1 AS n FROM aula_forums WHERE course_id = $1', [courseId]);
    const row = await one(
      tx,
      `INSERT INTO aula_forums
         (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
          participation_html, rules_html, opens_at, closes_at, is_closed, allow_attachments,
          grading_method, weight, rubric, no_participants_alternative, status, sort_order, created_by)
       VALUES ($1, $2, 'modulo', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::jsonb, $17, 'borrador', $18, $19)
       RETURNING *`,
      [courseId, input.moduleId, input.title, input.purpose, input.description, input.centralQuestion,
        input.guidingQuestions, input.participationHtml, input.rulesHtml, input.opensAt, input.closesAt,
        input.isClosed, input.allowAttachments, input.gradingMethod, input.weight,
        input.rubric ? JSON.stringify(input.rubric) : null, input.noParticipantsAlternative,
        maxOrder?.n ?? 0, actor.id],
    );
    await audit(tx, {
      actor, ip, action: 'foro.crear', entityType: 'foro', entityId: row.id, courseId,
      summary: `Foro “${row.title}” creado en borrador.`, after: { moduleId: input.moduleId, weight: input.weight },
    });
    return forumEditor(tx, actor, row.id);
  });
}

export async function updateForum(db, actor, forumId, input, { ip } = {}) {
  return db.tx(async (tx) => {
    const forum = await loadForum(tx, forumId);
    await requireCourseTeacher(tx, actor, forum.course_id);
    if (forum.status === 'archivado') throw conflict('El foro está archivado; restáuralo antes de cambiarlo.');
    if (input.moduleId) await assertModule(tx, forum.course_id, input.moduleId);
    if (input.opensAt && input.closesAt && input.closesAt <= input.opensAt) {
      throw badRequest('El cierre del foro debe ser posterior a la apertura.', { field: 'closesAt' });
    }
    const columns = {
      title: 'title', moduleId: 'module_id', purpose: 'purpose', description: 'description',
      centralQuestion: 'central_question', guidingQuestions: 'guiding_questions',
      participationHtml: 'participation_html', rulesHtml: 'rules_html', opensAt: 'opens_at',
      closesAt: 'closes_at', isClosed: 'is_closed', allowAttachments: 'allow_attachments',
      gradingMethod: 'grading_method', weight: 'weight', rubric: 'rubric',
      noParticipantsAlternative: 'no_participants_alternative', sortOrder: 'sort_order',
    };
    const keys = Object.keys(columns).filter((k) => input[k] !== undefined);
    if (keys.length) {
      const sets = keys.map((k, i) => `${columns[k]} = $${i + 2}${k === 'rubric' ? '::jsonb' : ''}`);
      const params = keys.map((k) => (k === 'rubric' ? (input[k] === null ? null : JSON.stringify(input[k])) : input[k]));
      await tx.query(
        `UPDATE aula_forums SET ${sets.join(', ')}, updated_at = NOW() WHERE id = $1`,
        [forum.id, ...params],
      );
    }
    await audit(tx, {
      actor, ip, action: 'foro.editar', entityType: 'foro', entityId: forum.id, courseId: forum.course_id,
      summary: `Foro “${forum.title}” actualizado.`,
      before: { title: forum.title, status: forum.status }, after: { fields: keys },
    });
    return forumEditor(tx, actor, forum.id);
  });
}

export async function publishForum(db, actor, forumId, { ip } = {}) {
  return db.tx(async (tx) => {
    const forum = await loadForum(tx, forumId);
    await requireCourseTeacher(tx, actor, forum.course_id);
    if (!forum.module_id) throw badRequest('El foro no está asociado a una unidad.', { field: 'moduleId' });
    await assertModule(tx, forum.course_id, forum.module_id);
    if (!htmlToText(forum.description) && !cleanText(forum.central_question)) {
      throw badRequest('Escribe el caso o la pregunta central del foro.', { field: 'centralQuestion' });
    }
    if (forum.grading_method !== 'formativa' && !(Number(forum.weight) > 0)) {
      throw badRequest('Un foro calificable necesita un peso mayor que 0.', { field: 'weight' });
    }
    if (forum.grading_method === 'rubrica') validateRubricForPublish(asJson(forum.rubric), 'rubric');
    const row = await one(
      tx,
      "UPDATE aula_forums SET status = 'publicado', updated_at = NOW() WHERE id = $1 RETURNING *",
      [forum.id],
    );
    await audit(tx, {
      actor, ip, action: 'foro.publicar', entityType: 'foro', entityId: forum.id, courseId: forum.course_id,
      summary: `Foro “${forum.title}” publicado.`, before: { status: forum.status }, after: { status: 'publicado' },
    });
    return forumEditor(tx, actor, row.id);
  });
}

export async function archiveForum(db, actor, forumId, reason, { ip } = {}) {
  return db.tx(async (tx) => {
    if (!reason || String(reason).trim().length < 5) throw badRequest('Explica el motivo del archivo.', { field: 'reason' });
    const forum = await loadForum(tx, forumId);
    await requireCourseTeacher(tx, actor, forum.course_id);
    const row = await one(
      tx,
      "UPDATE aula_forums SET status = 'archivado', updated_at = NOW() WHERE id = $1 RETURNING *",
      [forum.id],
    );
    await audit(tx, {
      actor, ip, action: 'foro.archivar', entityType: 'foro', entityId: forum.id, courseId: forum.course_id,
      summary: `Foro “${forum.title}” archivado.`, reason: reason || null,
      before: { status: forum.status }, after: { status: 'archivado' },
    });
    return forumRow(row);
  });
}

export async function closeForum(db, actor, forumId, closed, { ip } = {}) {
  return db.tx(async (tx) => {
    const forum = await loadForum(tx, forumId);
    await requireCourseTeacher(tx, actor, forum.course_id);
    const row = await one(
      tx,
      'UPDATE aula_forums SET is_closed = $2, updated_at = NOW() WHERE id = $1 RETURNING *',
      [forum.id, closed],
    );
    await audit(tx, {
      actor, ip, action: 'foro.cerrar', entityType: 'foro', entityId: forum.id, courseId: forum.course_id,
      summary: `Foro “${forum.title}” ${closed ? 'cerrado a respuestas' : 'reabierto'}. La lectura se conserva.`,
    });
    return forumRow(row);
  });
}

export async function duplicateForum(db, actor, forumId, { ip } = {}) {
  return db.tx(async (tx) => {
    const forum = await loadForum(tx, forumId);
    await requireCourseTeacher(tx, actor, forum.course_id);
    const maxOrder = await one(tx, 'SELECT coalesce(max(sort_order), -1)::int + 1 AS n FROM aula_forums WHERE course_id = $1', [forum.course_id]);
    const copy = await one(
      tx,
      `INSERT INTO aula_forums
         (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
          participation_html, rules_html, opens_at, closes_at, is_closed, allow_attachments,
          grading_method, weight, rubric, no_participants_alternative, status, sort_order, created_by)
       VALUES ($1, $2, 'modulo', $3, $4, $5, $6, $7, $8, $9, $10, $11, FALSE, $12, $13, $14, $15::jsonb, $16, 'borrador', $17, $18)
       RETURNING *`,
      [forum.course_id, forum.module_id, `${forum.title} (copia)`, forum.purpose, forum.description,
        forum.central_question, forum.guiding_questions, forum.participation_html, forum.rules_html,
        forum.opens_at, forum.closes_at, forum.allow_attachments, forum.grading_method, forum.weight,
        forum.rubric ? JSON.stringify(asJson(forum.rubric)) : null, forum.no_participants_alternative,
        maxOrder?.n ?? 0, actor.id],
    );
    await audit(tx, {
      actor, ip, action: 'foro.duplicar', entityType: 'foro', entityId: copy.id, courseId: forum.course_id,
      summary: `Foro “${forum.title}” duplicado en borrador.`, after: { sourceId: forum.id },
    });
    return forumEditor(tx, actor, copy.id);
  });
}

export async function moveForum(db, actor, forumId, targetModuleId, position, opts) {
  const forum = await loadForum(db, forumId);
  await moveResource(db, actor, 'aula_forums', { ...forum, kind: 'foro' }, targetModuleId, position, opts);
  return forumEditor(db, actor, forumId);
}

// ── Configuración académica ───────────────────────────────────

function configState(course, data) {
  const raw = asJson(course.grade_policy);
  const proposed = { activities: 60, quizzes: 30, forums: 10 };
  const components = raw?.components
    ? {
      activities: Number(raw.components.activities) || 0,
      quizzes: Number(raw.components.quizzes) || 0,
      forums: Number(raw.components.forums) || 0,
    }
    : proposed;
  const total = round2(components.activities + components.quizzes + components.forums);
  const sums = data?.weights || { activities: 0, quizzes: 0, forums: 0 };
  const mismatches = [];
  if (Math.abs(total - 100) > 0.05) mismatches.push(`Los componentes suman ${total} %, no 100 %.`);
  for (const key of ['activities', 'quizzes', 'forums']) {
    if (Math.abs(Number(sums[key] || 0) - Number(components[key] || 0)) > 0.05) {
      mismatches.push(`Los recursos de ${key === 'activities' ? 'actividades' : key === 'quizzes' ? 'quizzes' : 'foros'} suman ${round2(sums[key] || 0)} % y la política declara ${components[key]} %.`);
    }
  }
  return {
    saved: Boolean(raw),
    components,
    total,
    passingScore: Number(raw?.passingScore ?? course.passing_score ?? 70),
    maxAttempts: Number(raw?.maxAttempts ?? course.max_attempts ?? 3),
    rounding: raw?.rounding || 'half_up',
    proposed,
    weightSums: sums,
    configOk: Boolean(raw) && mismatches.length === 0,
    errors: mismatches,
  };
}

export async function getAcademicConfig(db, actor, courseId) {
  await requireCourseTeacher(db, actor, courseId);
  const course = await loadCourse(db, courseId);
  const data = await authoringData(db, actor, courseId);
  return configState(course, data);
}

export async function updateAcademicConfig(db, actor, courseId, input, { ip, now = new Date() } = {}) {
  return db.tx(async (tx) => {
    await requireCourseTeacher(tx, actor, courseId);
    const course = await loadCourse(tx, courseId);
    const rawComponents = input?.components || {};
    const components = {
      activities: num(rawComponents.activities ?? 0, 'components.activities', 'El peso de actividades', { min: 0, max: 100 }),
      quizzes: num(rawComponents.quizzes ?? 0, 'components.quizzes', 'El peso de quizzes', { min: 0, max: 100 }),
      forums: num(rawComponents.forums ?? 0, 'components.forums', 'El peso de foros', { min: 0, max: 100 }),
    };
    const passingScore = num(input?.passingScore ?? course.passing_score, 'passingScore', 'La nota de aprobación', { min: 0, max: 100 });
    const maxAttempts = int(input?.maxAttempts ?? course.max_attempts, 'maxAttempts', 'Los intentos por evaluación', { min: 1, max: 20 });
    const policy = {
      version: 1,
      components,
      rounding: 'half_up',
      passingScore,
      maxAttempts,
      updatedAt: now.toISOString(),
    };
    await tx.query(
      `UPDATE aula_courses
          SET grade_policy = $2::jsonb, passing_score = $3, max_attempts = $4, updated_by = $5, updated_at = NOW()
        WHERE id = $1`,
      [courseId, JSON.stringify(policy), passingScore, maxAttempts, actor.id],
    );
    await audit(tx, {
      actor, ip, action: 'curso.configuracion_academica', entityType: 'curso', entityId: courseId, courseId,
      summary: `Configuración académica actualizada: ${components.activities}/${components.quizzes}/${components.forums}, aprueba con ${passingScore}.`,
      before: { gradePolicy: asJson(course.grade_policy), passingScore: course.passing_score, maxAttempts: course.max_attempts },
      after: policy,
    });
    const updated = await loadCourse(tx, courseId);
    const data = await authoringData(tx, actor, courseId);
    return configState(updated, data);
  });
}

// ── Libro de calificaciones y bandeja de revisión ─────────────

export async function gradebook(db, actor, courseId, query = {}) {
  await requireCourseTeacher(db, actor, courseId);
  const course = await loadCourse(db, courseId);
  const pg = paging(query, { defaultSize: 50, maxSize: 200 });
  const q = typeof query.q === 'string' ? query.q.trim() : '';
  const conditions = ['e.course_id = $1', 'e.withdrawn_at IS NULL'];
  const params = [courseId];
  if (q) {
    params.push(`%${q}%`);
    conditions.push(`(u.first_name ILIKE $${params.length} OR u.last_name ILIKE $${params.length} OR u.email ILIKE $${params.length})`);
  }
  if (query.status) {
    params.push(query.status);
    conditions.push(`e.effective_status = $${params.length}`);
  }
  const where = conditions.join(' AND ');
  const total = (await one(
    db,
    `SELECT count(*)::int AS n FROM aula_enrollments_v e JOIN aula_users u ON u.id = e.user_id WHERE ${where}`,
    params,
  )).n;
  const students = await many(
    db,
    `SELECT e.id AS enrollment_id, e.user_id, e.effective_status, e.progress_pct, e.final_score,
            e.due_at, u.first_name, u.last_name, u.email
       FROM aula_enrollments_v e JOIN aula_users u ON u.id = e.user_id
      WHERE ${where}
      ORDER BY lower(u.first_name || ' ' || u.last_name), u.id
      LIMIT ${pg.size} OFFSET ${pg.offset}`,
    params,
  );
  const data = await authoringData(db, actor, courseId);
  const items = [];
  for (const student of students) {
    const progress = await pedagogyProgress(db, {
      enrollmentId: student.enrollment_id, courseId, userId: student.user_id,
    });
    const byType = { quiz: {}, activity: {}, forum: {} };
    for (const component of progress?.components || []) {
      byType[component.type][String(component.id)] = component;
    }
    const quizzes = data.quizzes.filter((r) => r.status === 'publicado').map((r) => {
      const c = byType.quiz[String(r.id)];
      const gradedAttempts = (c?.attempts || []).filter((a) => a.scorePct !== null && a.scorePct !== undefined);
      const bestAttempt = gradedAttempts.sort((a, b) => Number(b.scorePct) - Number(a.scorePct))[0] || null;
      return {
        id: r.id, title: r.title, weight: r.weight, maxAttempts: r.maxAttempts,
        score: c ? c.score : null, status: r.status, submitted: Boolean(c?.submitted), pending: !c || c.pending,
        attemptId: bestAttempt?.id || null, attemptCount: gradedAttempts.length,
      };
    });
    const activities = data.activities.filter((r) => r.status === 'publicado').map((r) => {
      const c = byType.activity[String(r.id)];
      return {
        id: r.id, title: r.title, weight: r.weight, score: c ? c.score : null,
        status: c?.status || r.status, submitted: Boolean(c?.submitted), graded: Boolean(c?.graded),
        pending: !c || c.pending,
      };
    });
    const forums = data.forums.filter((r) => r.status === 'publicado').map((r) => {
      const c = byType.forum[String(r.id)];
      return {
        id: r.id, title: r.title, weight: r.weight, score: c ? c.score : null,
        status: c?.status || r.status, submitted: Boolean(c?.submitted), graded: Boolean(c?.graded),
        pending: !c || c.pending,
      };
    });
    items.push({
      enrollmentId: student.enrollment_id,
      userId: student.user_id,
      name: [student.first_name, student.last_name].filter(Boolean).join(' ').trim() || 'Participante',
      email: student.email,
      status: student.effective_status,
      progressPct: Number(student.progress_pct) || 0,
      finalScore: progress?.finalScore ?? null,
      accumulatedScore: progress?.accumulatedScore ?? null,
      provisional: progress?.provisional ?? false,
      approved: progress?.approved ?? false,
      configured: progress?.configured ?? false,
      configOk: progress?.configOk ?? false,
      pending: progress?.pending || [],
      weightsTotal: progress?.weightsTotal ?? 0,
      quizzes, activities, forums,
    });
  }
  return {
    ...pageResult(items, total, pg),
    course: { id: course.id, title: course.title, passingScore: Number(course.passing_score) },
    policy: configState(course, data),
    resources: {
      quizzes: data.quizzes.filter((r) => r.status === 'publicado'),
      activities: data.activities.filter((r) => r.status === 'publicado'),
      forums: data.forums.filter((r) => r.status === 'publicado'),
    },
  };
}

export async function reviewQueue(db, actor, courseId, query = {}) {
  await requireCourseTeacher(db, actor, courseId);
  const pg = paging(query, { defaultSize: 25, maxSize: 100 });
  const conditions = ['a.course_id = $1', 's.current_revision > 0'];
  const params = [courseId];
  if (query.status === 'todos') {
    // Todas las entregas enviadas, calificadas o no.
    conditions.push('s.current_revision > 0');
  } else if (query.status) {
    params.push(query.status);
    conditions.push(`s.status = $${params.length}`);
  } else {
    conditions.push("s.status IN ('enviada','entregada_tarde','en_revision','requiere_ajustes')");
  }
  if (query.moduleId) {
    params.push(Number(query.moduleId));
    conditions.push(`a.module_id = $${params.length}`);
  }
  if (query.activityId) {
    params.push(Number(query.activityId));
    conditions.push(`a.id = $${params.length}`);
  }
  if (query.studentId) {
    params.push(Number(query.studentId));
    conditions.push(`e.user_id = $${params.length}`);
  }
  if (query.q && String(query.q).trim()) {
    params.push(`%${String(query.q).trim()}%`);
    conditions.push(`(u.first_name ILIKE $${params.length} OR u.last_name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR a.title ILIKE $${params.length})`);
  }
  const where = conditions.join(' AND ');
  const total = (await one(
    db,
    `SELECT count(*)::int AS n FROM aula_submissions s
       JOIN aula_activities a ON a.id = s.activity_id
       JOIN aula_enrollments e ON e.id = s.enrollment_id
       JOIN aula_users u ON u.id = e.user_id
      WHERE ${where}`,
    params,
  )).n;
  const items = await many(
    db,
    `SELECT s.id, s.status, s.score, s.current_revision, s.last_submitted_at,
            a.id AS activity_id, a.title AS activity_title, a.module_id, a.max_points, a.weight,
            m.title AS module_title,
            e.id AS enrollment_id, e.user_id, u.first_name, u.last_name, u.email
       FROM aula_submissions s
       JOIN aula_activities a ON a.id = s.activity_id
       LEFT JOIN aula_modules m ON m.id = a.module_id
       JOIN aula_enrollments e ON e.id = s.enrollment_id
       JOIN aula_users u ON u.id = e.user_id
      WHERE ${where}
      ORDER BY s.last_submitted_at DESC NULLS LAST, s.id DESC
      LIMIT ${pg.size} OFFSET ${pg.offset}`,
    params,
  );
  const pendingForums = await many(
    db,
    `SELECT f.id AS forum_id, f.title, f.module_id, m.title AS module_title,
            e.id AS enrollment_id, u.id AS user_id, u.first_name, u.last_name, u.email,
            (SELECT count(*)::int FROM aula_forum_posts p
              WHERE p.forum_id = f.id AND p.author_id = u.id AND p.deleted_at IS NULL AND p.is_hidden = FALSE) AS posts
       FROM aula_forums f
       LEFT JOIN aula_modules m ON m.id = f.module_id
       JOIN aula_enrollments e ON e.course_id = f.course_id AND e.withdrawn_at IS NULL
       JOIN aula_users u ON u.id = e.user_id
       LEFT JOIN aula_forum_grades g ON g.forum_id = f.id AND g.enrollment_id = e.id
      WHERE f.course_id = $1 AND f.deleted_at IS NULL AND f.status = 'publicado'
        AND f.grading_method <> 'formativa' AND g.id IS NULL
        ${query.moduleId ? 'AND f.module_id = $2' : ''}
      ORDER BY f.sort_order, f.id, lower(u.first_name || ' ' || u.last_name)`,
    query.moduleId ? [courseId, Number(query.moduleId)] : [courseId],
  );
  const withPosts = pendingForums.filter((row) => Number(row.posts) > 0);
  return {
    ...pageResult(items.map((s) => ({
      id: s.id, type: 'entrega', status: s.status,
      score: s.score === null ? null : Number(s.score),
      revision: s.current_revision, submittedAt: s.last_submitted_at,
      activityId: s.activity_id, activityTitle: s.activity_title,
      moduleId: s.module_id, moduleTitle: s.module_title, maxPoints: Number(s.max_points),
      weight: s.weight === null ? null : Number(s.weight),
      enrollmentId: s.enrollment_id, studentId: s.user_id,
      student: [s.first_name, s.last_name].filter(Boolean).join(' ').trim() || 'Participante',
      email: s.email,
    })), total, pg),
    forums: withPosts.map((row) => ({
      id: row.forum_id, type: 'foro', forumId: row.forum_id, title: row.title,
      moduleId: row.module_id, moduleTitle: row.module_title,
      enrollmentId: row.enrollment_id, studentId: row.user_id,
      student: [row.first_name, row.last_name].filter(Boolean).join(' ').trim() || 'Participante',
      email: row.email, posts: Number(row.posts), status: 'sin_calificar',
    })),
  };
}

export async function participationOverview(db, actor, courseId, query = {}) {
  await requireCourseTeacher(db, actor, courseId);
  const rows = await many(
    db,
    `SELECT f.id, f.title, f.module_id, f.status, f.is_closed, f.grading_method, f.weight,
            f.opens_at, f.closes_at, f.sort_order, m.title AS module_title,
            (SELECT count(*)::int FROM aula_forum_posts p
              WHERE p.forum_id = f.id AND p.deleted_at IS NULL AND p.is_hidden = FALSE) AS posts,
            (SELECT count(*)::int FROM aula_forum_posts p
              WHERE p.forum_id = f.id AND p.deleted_at IS NULL AND p.is_hidden = TRUE) AS hidden_posts,
            (SELECT count(*)::int FROM aula_forum_grades g WHERE g.forum_id = f.id) AS grades,
            (SELECT count(*)::int FROM (
              SELECT e2.id
                FROM aula_enrollments e2
                JOIN aula_forum_posts p2 ON p2.author_id = e2.user_id AND p2.forum_id = f.id
                 AND p2.deleted_at IS NULL AND p2.is_hidden = FALSE
                LEFT JOIN aula_forum_grades g2 ON g2.forum_id = f.id AND g2.enrollment_id = e2.id
               WHERE e2.course_id = f.course_id AND e2.withdrawn_at IS NULL AND g2.id IS NULL
               GROUP BY e2.id
            ) x) AS ungraded,
            (SELECT max(p.last_activity_at) FROM aula_forum_posts p
              WHERE p.forum_id = f.id AND p.deleted_at IS NULL AND p.is_hidden = FALSE) AS last_activity_at
       FROM aula_forums f LEFT JOIN aula_modules m ON m.id = f.module_id
      WHERE f.course_id = $1 AND f.deleted_at IS NULL
        ${query.moduleId ? 'AND f.module_id = $2' : ''}
      ORDER BY f.sort_order, f.id`,
    query.moduleId ? [courseId, Number(query.moduleId)] : [courseId],
  );
  return rows.map((f) => ({
    id: f.id, title: f.title, moduleId: f.module_id, moduleTitle: f.module_title,
    status: f.status, isClosed: f.is_closed, gradingMethod: f.grading_method,
    weight: f.weight === null ? null : Number(f.weight),
    opensAt: f.opens_at, closesAt: f.closes_at,
    posts: Number(f.posts), hiddenPosts: Number(f.hidden_posts), grades: Number(f.grades),
    ungraded: Number(f.ungraded), lastActivityAt: f.last_activity_at,
  }));
}

export async function overrideAttemptScore(db, actor, attemptId, input, { ip, now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const attempt = await one(
      tx,
      `SELECT at.*, a.course_id, a.title AS assessment_title, e.user_id
         FROM aula_attempts at
         JOIN aula_assessments a ON a.id = at.assessment_id
         JOIN aula_enrollments e ON e.id = at.enrollment_id
        WHERE at.id = $1`,
      [attemptId],
    );
    if (!attempt) throw notFound('No encontramos ese intento.');
    await requireCourseTeacher(tx, actor, attempt.course_id);
    if (attempt.status === 'en_curso') throw conflict('El intento sigue en curso; no se puede rectificar todavía.');
    const score = num(input?.score, 'score', 'La nota', { min: 0, max: 100 });
    const reason = str(input?.reason, 'reason', 'El motivo', { min: 5, max: 1000 });
    const old = attempt.score_pct === null ? null : Number(attempt.score_pct);
    if (old !== null && Math.abs(old - score) < 0.005) {
      throw badRequest('La nota nueva es igual a la actual. Escribe un cambio real.', { field: 'score' });
    }
    const passing = Number(attempt.passing_score);
    const updated = await one(
      tx,
      `UPDATE aula_attempts
          SET score_pct = $2, score = round(($2::numeric * max_score) / 100, 2), passed = ($2 >= $3),
              graded_at = $4, graded_by = $5, updated_at = NOW()
        WHERE id = $1 RETURNING *`,
      [attempt.id, score, passing, now, actor.id],
    );
    await tx.query(
      `INSERT INTO aula_grade_changes
         (target_type, target_id, enrollment_id, old_value, new_value, reason, changed_by, changed_by_email, changed_at, metadata)
       VALUES ('intento', $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)`,
      [attempt.id, attempt.enrollment_id, old, score, reason, actor.id, actor.email, now,
        JSON.stringify({ assessmentId: attempt.assessment_id, assessmentTitle: attempt.assessment_title })],
    );
    await recomputeEnrollment(tx, attempt.enrollment_id, { now });
    await audit(tx, {
      actor, ip, action: 'nota.cambiar', entityType: 'intento', entityId: attempt.id,
      courseId: attempt.course_id, summary: `Nota del intento de “${attempt.assessment_title}” cambiada de ${old ?? 'sin calificar'} a ${score}/100.`,
      reason, before: { score: old }, after: { score },
    });
    return { attempt: updated, score };
  });
}

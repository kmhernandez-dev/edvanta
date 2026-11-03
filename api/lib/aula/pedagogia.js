/**
 * Recorrido pedagógico del Aula: quizzes, actividades, foros y revisión.
 *
 * Toda operación valida la matrícula o la asignación docente en el
 * servidor. Las claves de los quizzes viven en aula_question_options y en
 * el `served` del intento; nunca salen en la respuesta pública antes de
 * que la política del quiz lo permita.
 */
import { many, one } from './db.js';
import { requireCourseTeacher, requireOpenEnrollment } from './access.js';
import { badRequest, conflict, forbidden, id as idField, int, notFound, num, oneOf, str } from './http.js';
import { sanitizeRichText } from './richtext.js';
import { recomputeEnrollment } from './progress.js';
import {
  activityState, attemptSummary, forumState, loadPolicy, pedagogyProgress, round2, submissionRow,
} from './pedagogia-core.js';
import { audit } from './audit.js';

const asJson = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return null; }
  }
  return value;
};

const publicQuestion = (q) => ({
  id: Number(q.id),
  promptHtml: q.promptHtml,
  points: Number(q.points),
  options: (q.options || []).map((o) => ({ id: Number(o.id), text: o.text })),
});

function publicAttempt(attempt, answers = {}) {
  const served = asJson(attempt.served) || { questions: [] };
  return {
    id: Number(attempt.id),
    number: Number(attempt.attempt_number),
    status: attempt.status,
    startedAt: attempt.started_at,
    expiresAt: attempt.expires_at,
    submittedAt: attempt.submitted_at,
    score: attempt.score === null ? null : Number(attempt.score),
    maxScore: attempt.max_score === null ? null : Number(attempt.max_score),
    scorePct: attempt.score_pct === null ? null : Number(attempt.score_pct),
    passed: attempt.passed,
    passingScore: Number(attempt.passing_score),
    questions: (served.questions || []).map(publicQuestion),
    answers,
  };
}

async function loadAssessment(db, courseId, assessmentId, { includeDraft = false } = {}) {
  const assessment = await one(
    db,
    `SELECT id, course_id, module_id, title, instructions_html, is_required, passing_score,
            max_attempts, time_limit_minutes, show_answers_after_submit, status, weight, sort_order
       FROM aula_assessments
      WHERE id = $1 AND course_id = $2 AND deleted_at IS NULL
        AND (status = 'publicado' OR $3::boolean = TRUE)`,
    [assessmentId, courseId, includeDraft],
  );
  if (!assessment) throw notFound('No encontramos ese quiz en el curso.');
  const questions = await many(
    db,
    `SELECT q.id, q.prompt_html, q.points, q.explanation, q.general_feedback, q.config, aq.sort_order
       FROM aula_assessment_questions aq
       JOIN aula_questions q ON q.id = aq.question_id AND q.deleted_at IS NULL
      WHERE aq.assessment_id = $1
      ORDER BY aq.sort_order, q.id`,
    [assessment.id],
  );
  const ids = questions.map((q) => q.id);
  const options = ids.length
    ? await many(
      db,
      `SELECT id, question_id, text, is_correct, feedback, sort_order
         FROM aula_question_options
        WHERE question_id = ANY($1::bigint[]) AND deleted_at IS NULL
        ORDER BY sort_order, id`,
      [ids],
    )
    : [];
  const byQuestion = new Map();
  for (const o of options) {
    if (!byQuestion.has(o.question_id)) byQuestion.set(o.question_id, []);
    byQuestion.get(o.question_id).push(o);
  }
  const served = {
    assessmentId: Number(assessment.id),
    title: assessment.title,
    passingScore: assessment.passing_score === null ? null : Number(assessment.passing_score),
    showAnswersAfterSubmit: Boolean(assessment.show_answers_after_submit),
    questions: questions.map((q) => {
      const opts = byQuestion.get(q.id) || [];
      const correct = opts.find((o) => o.is_correct);
      return {
        id: Number(q.id),
        promptHtml: q.prompt_html,
        points: Number(q.points),
        explanation: q.explanation,
        generalFeedback: q.general_feedback,
        options: opts.map((o) => ({
          id: Number(o.id), text: o.text, isCorrect: Boolean(o.is_correct), feedback: o.feedback,
        })),
        correctOptionId: correct ? Number(correct.id) : null,
      };
    }),
  };
  return { assessment, served };
}

async function answersOf(db, attemptId) {
  const rows = await many(
    db,
    'SELECT question_id, response FROM aula_attempt_answers WHERE attempt_id = $1',
    [attemptId],
  );
  const out = {};
  for (const r of rows) {
    const response = asJson(r.response);
    if (response && response.optionId !== undefined && response.optionId !== null) {
      out[String(r.question_id)] = Number(response.optionId);
    }
  }
  return out;
}

async function openAttempt(db, assessmentId, enrollmentId, { lock = false } = {}) {
  return one(
    db,
    `SELECT * FROM aula_attempts
      WHERE assessment_id = $1 AND enrollment_id = $2 AND status = 'en_curso'
      ${lock ? 'FOR UPDATE' : ''}`,
    [assessmentId, enrollmentId],
  );
}

async function latestAttempt(db, assessmentId, enrollmentId) {
  return one(
    db,
    `SELECT * FROM aula_attempts
      WHERE assessment_id = $1 AND enrollment_id = $2
      ORDER BY attempt_number DESC LIMIT 1`,
    [assessmentId, enrollmentId],
  );
}

async function attemptStats(db, assessmentId, enrollmentId, assessment, policy) {
  const rows = await many(
    db,
    `SELECT id, attempt_number, status, score, max_score, score_pct, passing_score, passed, started_at, submitted_at, graded_at, duration_seconds
       FROM aula_attempts WHERE assessment_id = $1 AND enrollment_id = $2 ORDER BY attempt_number`,
    [assessmentId, enrollmentId],
  );
  return attemptSummary(rows, assessment, policy);
}

export async function assessmentList(db, user, courseId, { now = new Date() } = {}) {
  const enrollment = await requireOpenEnrollment(db, user, courseId, { now });
  const config = await loadPolicy(db, courseId);
  const rows = await many(
    db,
    `SELECT id, module_id, title, instructions_html, passing_score, max_attempts,
            show_answers_after_submit, status, weight, sort_order
       FROM aula_assessments
      WHERE course_id = $1 AND deleted_at IS NULL AND status = 'publicado'
      ORDER BY sort_order, id`,
    [courseId],
  );
  const items = [];
  for (const a of rows) {
    const summary = await attemptStats(db, a.id, enrollment.id, a, config.policy);
    items.push({
      id: a.id, moduleId: a.module_id, title: a.title, instructionsHtml: a.instructions_html,
      passingScore: a.passing_score === null ? config.policy.passingScore : Number(a.passing_score),
      maxAttempts: Number(a.max_attempts || config.policy.maxAttempts || 1),
      showAnswersAfterSubmit: Boolean(a.show_answers_after_submit),
      weight: a.weight === null ? null : Number(a.weight),
      ...summary,
    });
  }
  return { assessments: items, policy: config.policy };
}

export async function assessmentDetail(db, user, courseId, assessmentId, { now = new Date() } = {}) {
  const enrollment = await requireOpenEnrollment(db, user, courseId, { now });
  const { assessment } = await loadAssessment(db, courseId, assessmentId);
  const config = await loadPolicy(db, courseId);
  const summary = await attemptStats(db, assessment.id, enrollment.id, assessment, config.policy);
  const open = await openAttempt(db, assessment.id, enrollment.id);
  return {
    assessment: {
      id: assessment.id, moduleId: assessment.module_id, title: assessment.title,
      instructionsHtml: assessment.instructions_html,
      passingScore: assessment.passing_score === null ? config.policy.passingScore : Number(assessment.passing_score),
      maxAttempts: Number(assessment.max_attempts || config.policy.maxAttempts || 1),
      showAnswersAfterSubmit: Boolean(assessment.show_answers_after_submit),
      weight: assessment.weight === null ? null : Number(assessment.weight),
      ...summary,
    },
    openAttempt: open ? publicAttempt(open, await answersOf(db, open.id)) : null,
  };
}

export async function startAttempt(db, user, courseId, assessmentId, { now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const enrollment = await requireOpenEnrollment(tx, user, courseId, { now });
    await tx.query('SELECT id FROM aula_enrollments WHERE id = $1 FOR UPDATE', [enrollment.id]);
    const { assessment, served } = await loadAssessment(tx, courseId, assessmentId);
    const config = await loadPolicy(tx, courseId);
    const existing = await openAttempt(tx, assessment.id, enrollment.id);
    if (existing) {
      return { resumed: true, attempt: publicAttempt(existing, await answersOf(tx, existing.id)) };
    }
    const used = await one(
      tx,
      "SELECT count(*)::int AS n FROM aula_attempts WHERE assessment_id = $1 AND enrollment_id = $2 AND status <> 'en_curso'",
      [assessment.id, enrollment.id],
    );
    const maxAttempts = Number(assessment.max_attempts || config.policy.maxAttempts || 1);
    if (used.n >= maxAttempts) {
      throw conflict('Ya usaste los intentos disponibles de este quiz.');
    }
    const next = await one(
      tx,
      'SELECT coalesce(max(attempt_number), 0)::int + 1 AS n FROM aula_attempts WHERE assessment_id = $1 AND enrollment_id = $2',
      [assessment.id, enrollment.id],
    );
    const maxScore = (served.questions || []).reduce((sum, q) => sum + Number(q.points || 0), 0);
    const passing = assessment.passing_score === null ? config.policy.passingScore : Number(assessment.passing_score);
    const row = await one(
      tx,
      `INSERT INTO aula_attempts
         (assessment_id, enrollment_id, course_version_id, attempt_number, status, served,
          started_at, passing_score, max_score)
       VALUES ($1, $2, $3, $4, 'en_curso', $5::jsonb, $6, $7, $8)
       RETURNING *`,
      [assessment.id, enrollment.id, enrollment.course_version_id, next.n, JSON.stringify(served), now, passing, maxScore],
    );
    return { resumed: false, attempt: publicAttempt(row) };
  });
}

export async function saveAttempt(db, user, courseId, assessmentId, answers, { now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const enrollment = await requireOpenEnrollment(tx, user, courseId, { now });
    const { assessment } = await loadAssessment(tx, courseId, assessmentId);
    const attempt = await openAttempt(tx, assessment.id, enrollment.id, { lock: true });
    if (!attempt) throw conflict('No tienes un intento en curso para este quiz.');
    // La versión que se califica es la que se sirvió al iniciar el intento,
    // no la copia actual del quiz.
    const attemptServed = asJson(attempt.served) || { questions: [] };
    const saved = await saveAnswers(tx, attemptServed, attempt, answers);
    return { saved, attempt: publicAttempt(attempt, await answersOf(tx, attempt.id)) };
  });
}

async function saveAnswers(db, served, attempt, answers) {
  if (!Array.isArray(answers)) throw badRequest('Las respuestas no tienen un formato válido.');
  if (answers.length > 200) throw badRequest('Hay demasiadas respuestas en una sola solicitud.');
  const byQuestion = new Map((served.questions || []).map((q) => [Number(q.id), q]));
  let saved = 0;
  for (const item of answers) {
    const questionId = idField(item?.questionId, 'questionId', 'La pregunta');
    const question = byQuestion.get(questionId);
    if (!question) throw badRequest('Una de las preguntas no pertenece a este quiz.');
    if (item.optionId === null || item.optionId === undefined || item.optionId === '') {
      await db.query('DELETE FROM aula_attempt_answers WHERE attempt_id = $1 AND question_id = $2', [attempt.id, questionId]);
      saved += 1;
      continue;
    }
    const optionId = idField(item.optionId, 'optionId', 'La opción');
    if (!(question.options || []).some((o) => Number(o.id) === optionId)) {
      throw badRequest('Una de las opciones no pertenece a la pregunta.');
    }
    await db.query(
      `INSERT INTO aula_attempt_answers (attempt_id, question_id, response, max_points)
       VALUES ($1, $2, $3::jsonb, $4)
       ON CONFLICT (attempt_id, question_id) DO UPDATE
          SET response = EXCLUDED.response, max_points = EXCLUDED.max_points, updated_at = NOW()`,
      [attempt.id, questionId, JSON.stringify({ optionId }), Number(question.points)],
    );
    saved += 1;
  }
  return saved;
}

async function gradeAttempt(db, served, attempt, answers) {
  const questions = served.questions || [];
  const missing = questions.filter((q) => answers[String(q.id)] === undefined);
  if (missing.length) {
    throw badRequest('Responde todas las preguntas antes de enviar.', { missingQuestionIds: missing.map((q) => q.id) });
  }
  const detail = questions.map((q) => {
    const optionId = Number(answers[String(q.id)]);
    const selected = (q.options || []).find((o) => Number(o.id) === optionId);
    if (!selected) throw badRequest('Una de las respuestas no pertenece a la pregunta.');
    const isCorrect = optionId === Number(q.correctOptionId);
    return {
      questionId: Number(q.id), optionId, isCorrect,
      pointsAwarded: isCorrect ? Number(q.points) : 0,
      maxPoints: Number(q.points),
    };
  });
  const score = detail.reduce((sum, d) => sum + d.pointsAwarded, 0);
  const maxScore = detail.reduce((sum, d) => sum + d.maxPoints, 0);
  const scorePct = maxScore ? round2((score / maxScore) * 100) : 0;
  const passed = scorePct >= Number(attempt.passing_score);
  return { detail, score, maxScore, scorePct, passed };
}

function feedbackFor(served, detail, showAnswers) {
  if (!showAnswers) {
    return detail.map((d) => ({
      questionId: d.questionId, isCorrect: d.isCorrect, pointsAwarded: d.pointsAwarded, maxPoints: d.maxPoints,
    }));
  }
  const byQuestion = new Map((served.questions || []).map((q) => [Number(q.id), q]));
  return detail.map((d) => {
    const q = byQuestion.get(d.questionId);
    return {
      questionId: d.questionId,
      isCorrect: d.isCorrect,
      pointsAwarded: d.pointsAwarded,
      maxPoints: d.maxPoints,
      explanation: q?.explanation || null,
      options: (q?.options || []).map((o) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect, feedback: o.feedback })),
    };
  });
}

async function resultAfterSubmit(db, attempt, served, detail, { showAnswers, maxAttempts }) {
  const answers = Object.fromEntries(detail.map((d) => [String(d.questionId), d.optionId]));
  const rows = await many(
    db,
    `SELECT id, attempt_number, status, score, max_score, score_pct, passing_score, passed,
            started_at, submitted_at, graded_at, duration_seconds
       FROM aula_attempts WHERE assessment_id = $1 AND enrollment_id = $2 ORDER BY attempt_number`,
    [attempt.assessment_id, attempt.enrollment_id],
  );
  const best = rows
    .filter((r) => r.score_pct !== null)
    .reduce((max, r) => Math.max(max, Number(r.score_pct)), null);
  const used = rows.filter((r) => r.status !== 'en_curso').length;
  return {
    attempt: publicAttempt(attempt, answers),
    feedback: feedbackFor(served, detail, showAnswers),
    bestScore: best,
    used,
    attemptsRemaining: Math.max(0, Number(maxAttempts || 0) - used),
  };
}

export async function submitAttempt(db, user, courseId, assessmentId, answers, { now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const enrollment = await requireOpenEnrollment(tx, user, courseId, { now });
    const { assessment, served } = await loadAssessment(tx, courseId, assessmentId);
    const attempt = await openAttempt(tx, assessment.id, enrollment.id, { lock: true });
    if (!attempt) {
      const last = await latestAttempt(tx, assessment.id, enrollment.id);
      if (last) {
        const lastServed = asJson(last.served) || served;
        const saved = await answersOf(tx, last.id);
        const detail = (lastServed.questions || []).map((q) => {
          const optionId = Number(saved[String(q.id)]);
          return {
            questionId: Number(q.id), optionId, isCorrect: optionId === Number(q.correctOptionId),
            pointsAwarded: optionId === Number(q.correctOptionId) ? Number(q.points) : 0,
            maxPoints: Number(q.points),
          };
        });
        return {
          alreadySubmitted: true,
          ...(await resultAfterSubmit(tx, last, lastServed, detail, {
            showAnswers: Boolean(lastServed.showAnswersAfterSubmit ?? assessment.show_answers_after_submit),
            maxAttempts: Number(assessment.max_attempts || 1),
          })),
        };
      }
      throw conflict('No tienes un intento en curso para este quiz.');
    }
    if (attempt.status !== 'en_curso') {
      throw conflict('Este intento ya fue enviado.');
    }
    const attemptServed = asJson(attempt.served) || served;
    if (Array.isArray(answers) && answers.length) {
      await saveAnswers(tx, attemptServed, attempt, answers);
    }
    const saved = await answersOf(tx, attempt.id);
    const grade = await gradeAttempt(tx, attemptServed, attempt, saved);
    const updated = await one(
      tx,
      `UPDATE aula_attempts
          SET status = 'calificado', submitted_at = $2, score = $3, max_score = $4,
              score_pct = $5, passed = $6, graded_at = $2,
              duration_seconds = GREATEST(0, floor(extract(epoch FROM ($2::timestamptz - started_at))))::int,
              updated_at = NOW()
        WHERE id = $1
        RETURNING *`,
      [attempt.id, now, grade.score, grade.maxScore, grade.scorePct, grade.passed],
    );
    for (const d of grade.detail) {
      await tx.query(
        `UPDATE aula_attempt_answers
            SET is_correct = $3, points_awarded = $4, max_points = $5, updated_at = NOW()
          WHERE attempt_id = $1 AND question_id = $2`,
        [attempt.id, d.questionId, d.isCorrect, d.pointsAwarded, d.maxPoints],
      );
    }
    await recomputeEnrollment(tx, enrollment.id, { now });
    const rows = await many(
      tx,
      "SELECT count(*)::int AS used FROM aula_attempts WHERE assessment_id = $1 AND enrollment_id = $2 AND status <> 'en_curso'",
      [assessment.id, enrollment.id],
    );
    const best = await one(
      tx,
      "SELECT max(score_pct) AS best FROM aula_attempts WHERE assessment_id = $1 AND enrollment_id = $2 AND status <> 'en_curso'",
      [assessment.id, enrollment.id],
    );
    const maxAttempts = Number(assessment.max_attempts || 1);
    return {
      alreadySubmitted: false,
      attempt: publicAttempt(updated, Object.fromEntries(grade.detail.map((d) => [String(d.questionId), d.optionId]))),
      feedback: feedbackFor(attemptServed, grade.detail, Boolean(attemptServed.showAnswersAfterSubmit ?? assessment.show_answers_after_submit)),
      bestScore: best.best === null || best.best === undefined ? grade.scorePct : Number(best.best),
      used: rows[0].used,
      attemptsRemaining: Math.max(0, maxAttempts - rows[0].used),
    };
  });
}

export async function attemptResult(db, user, courseId, assessmentId, attemptId, { now = new Date() } = {}) {
  const enrollment = await requireOpenEnrollment(db, user, courseId, { now });
  const { assessment, served } = await loadAssessment(db, courseId, assessmentId);
  const attempt = await one(
    db,
    'SELECT * FROM aula_attempts WHERE id = $1 AND assessment_id = $2 AND enrollment_id = $3',
    [attemptId, assessment.id, enrollment.id],
  );
  if (!attempt) throw notFound('No encontramos ese intento.');
  const attemptServed = asJson(attempt.served) || served;
  const answers = await answersOf(db, attempt.id);
  if (attempt.status === 'en_curso') {
    return { attempt: publicAttempt(attempt, answers), feedback: null };
  }
  const detail = (attemptServed.questions || []).map((q) => {
    const optionId = Number(answers[String(q.id)]);
    return {
      questionId: Number(q.id), optionId, isCorrect: optionId === Number(q.correctOptionId),
      pointsAwarded: optionId === Number(q.correctOptionId) ? Number(q.points) : 0,
      maxPoints: Number(q.points),
    };
  });
  return {
    attempt: publicAttempt(attempt, answers),
    feedback: feedbackFor(attemptServed, detail, Boolean(attemptServed.showAnswersAfterSubmit ?? assessment.show_answers_after_submit)),
  };
}

// ── Actividades ────────────────────────────────────────────────────────

async function loadActivity(db, courseId, activityId) {
  const activity = await one(
    db,
    `SELECT id, course_id, module_id, title, instructions_html, case_html, points_to_solve,
            expected_product, extension_hint, support_html, materials, rubric, due_at,
            allow_text, allow_link, allow_file, accepted_extensions, max_file_mb,
            max_points, is_required, status, weight, sort_order, grading_method
       FROM aula_activities
      WHERE id = $1 AND course_id = $2 AND deleted_at IS NULL AND status = 'publicado'`,
    [activityId, courseId],
  );
  if (!activity) throw notFound('No encontramos esa actividad en el curso.');
  return activity;
}

async function readActivityInput(db, user, activity, input = {}) {
  const text = str(input.text, 'text', 'El texto de la entrega', { max: 50000, optional: true });
  const link = str(input.link, 'link', 'El enlace de la entrega', { max: 2000, optional: true });
  const fileId = input.fileId ? idField(input.fileId, 'fileId', 'El archivo') : null;
  if (text && !activity.allow_text) throw badRequest('Esta actividad no recibe texto.');
  if (link && !activity.allow_link) throw badRequest('Esta actividad no recibe enlaces.');
  if (fileId && !activity.allow_file) throw badRequest('Esta actividad no recibe archivos.');
  if (link && !/^https?:\/\//i.test(link)) throw badRequest('El enlace debe empezar por https://.');
  if (fileId) {
    const file = await one(
      db,
      `SELECT id, original_name, extension, size_bytes FROM aula_files
        WHERE id = $1 AND uploaded_by = $2 AND purpose = 'entrega' AND status = 'listo' AND deleted_at IS NULL`,
      [fileId, user.id],
    );
    if (!file) throw notFound('No encontramos ese archivo de entrega.');
    const allowed = (activity.accepted_extensions || []).map((e) => String(e).toLowerCase());
    if (allowed.length && !allowed.includes(String(file.extension).toLowerCase())) {
      throw badRequest(`Esta actividad no admite archivos .${file.extension}.`);
    }
    if (Number(file.size_bytes) > Number(activity.max_file_mb) * 1024 * 1024) {
      throw badRequest(`El archivo supera el máximo de ${activity.max_file_mb} MB.`);
    }
  }
  if (!text && !link && !fileId) throw badRequest('Escribe, enlaza o adjunta tu entrega.');
  return { text, link, fileId };
}

async function activityDetail(db, user, courseId, activityId, { now = new Date() } = {}) {
  const enrollment = await requireOpenEnrollment(db, user, courseId, { now });
  const activity = await loadActivity(db, courseId, activityId);
  const submission = await submissionRow(db, activity.id, enrollment.id);
  const revisions = submission
    ? await many(
      db,
      `SELECT id, revision_number, text_body, link_url, file_id, is_late, submitted_at
         FROM aula_submission_revisions WHERE submission_id = $1 ORDER BY revision_number DESC`,
      [submission.id],
    )
    : [];
  return {
    activity: {
      id: activity.id, moduleId: activity.module_id, title: activity.title,
      instructionsHtml: activity.instructions_html, caseHtml: activity.case_html || '',
      pointsToSolve: asJson(activity.points_to_solve) || [],
      expectedProduct: activity.expected_product || '', extensionHint: activity.extension_hint || '',
      supportHtml: activity.support_html || '', materials: asJson(activity.materials) || [],
      rubric: asJson(activity.rubric), gradingMethod: activity.grading_method || (activity.rubric ? 'rubrica' : 'directa'),
      dueAt: activity.due_at, allowText: activity.allow_text, allowLink: activity.allow_link,
      allowFile: activity.allow_file, acceptedExtensions: activity.accepted_extensions,
      maxFileMb: activity.max_file_mb, maxPoints: Number(activity.max_points),
      weight: activity.weight === null ? null : Number(activity.weight),
      isRequired: activity.is_required,
    },
    submission: submission ? {
      id: submission.id, status: submission.status, score: submission.score,
      currentRevision: submission.current_revision, reviewedAt: submission.reviewed_at,
      reviewedBy: submission.reviewed_by, feedback: submission.last_feedback,
      rubricReview: asJson(submission.rubric_review), draft: activityState(submission, activity).draft,
      lastRevision: submission.last_revision ? {
        ...submission.last_revision,
        text_body: submission.last_revision.text_body,
      } : null,
      revisions,
    } : null,
    state: activityState(submission, activity),
  };
}

export async function activityList(db, user, courseId, { now = new Date() } = {}) {
  const rows = await many(
    db,
    `SELECT id FROM aula_activities
      WHERE course_id = $1 AND deleted_at IS NULL AND status = 'publicado'
      ORDER BY sort_order, id`,
    [courseId],
  );
  const items = [];
  for (const row of rows) {
    items.push(await activityDetail(db, user, courseId, row.id, { now }));
  }
  return items;
}

export async function activityForStudent(db, user, courseId, activityId, { now = new Date() } = {}) {
  return activityDetail(db, user, courseId, activityId, { now });
}

export async function saveActivityDraft(db, user, courseId, activityId, input, { now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const enrollment = await requireOpenEnrollment(tx, user, courseId, { now });
    const activity = await loadActivity(tx, courseId, activityId);
    const data = await readActivityInput(tx, user, activity, input);
    const existing = await one(
      tx,
      'SELECT * FROM aula_submissions WHERE activity_id = $1 AND enrollment_id = $2 FOR UPDATE',
      [activity.id, enrollment.id],
    );
    if (existing && !['pendiente', 'requiere_ajustes'].includes(existing.status)) {
      throw conflict('Esta entrega ya fue enviada; no puedes cambiarla sin una nueva versión.');
    }
    const row = existing
      ? await one(
        tx,
        `UPDATE aula_submissions
            SET draft_text = $2, draft_link = $3, draft_file_id = $4, draft_updated_at = $5, updated_at = NOW()
          WHERE id = $1 RETURNING *`,
        [existing.id, data.text, data.link, data.fileId, now],
      )
      : await one(
        tx,
        `INSERT INTO aula_submissions
           (activity_id, enrollment_id, status, draft_text, draft_link, draft_file_id, draft_updated_at)
         VALUES ($1, $2, 'pendiente', $3, $4, $5, $6) RETURNING *`,
        [activity.id, enrollment.id, data.text, data.link, data.fileId, now],
      );
    return { submission: row, state: activityState(row, activity) };
  });
}

export async function submitActivity(db, user, courseId, activityId, input = {}, { now = new Date() } = {}) {
  return db.tx(async (tx) => {
    const enrollment = await requireOpenEnrollment(tx, user, courseId, { now });
    const activity = await loadActivity(tx, courseId, activityId);
    let submission = await one(
      tx,
      'SELECT * FROM aula_submissions WHERE activity_id = $1 AND enrollment_id = $2 FOR UPDATE',
      [activity.id, enrollment.id],
    );
    if (submission && !['pendiente', 'requiere_ajustes'].includes(submission.status)) {
      throw conflict('Esta entrega ya fue enviada. La corrección se hace con una nueva versión autorizada.');
    }
    if (!submission) {
      submission = await one(
        tx,
        `INSERT INTO aula_submissions (activity_id, enrollment_id, status)
         VALUES ($1, $2, 'pendiente') RETURNING *`,
        [activity.id, enrollment.id],
      );
    }
    const source = input && (input.text || input.link || input.fileId)
      ? input
      : { text: submission.draft_text, link: submission.draft_link, fileId: submission.draft_file_id };
    const data = await readActivityInput(tx, user, activity, source);
    const revisionNumber = Number(submission.current_revision) + 1;
    const isLate = Boolean(activity.due_at && new Date(activity.due_at) < now);
    const revision = await one(
      tx,
      `INSERT INTO aula_submission_revisions
         (submission_id, revision_number, text_body, link_url, file_id, is_late, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [submission.id, revisionNumber, data.text, data.link, data.fileId, isLate, now],
    );
    const updated = await one(
      tx,
      `UPDATE aula_submissions
          SET status = $2, current_revision = $3,
              first_submitted_at = COALESCE(first_submitted_at, $4),
              last_submitted_at = $4,
              draft_text = NULL, draft_link = NULL, draft_file_id = NULL, draft_updated_at = NULL,
              score = NULL, rubric_review = NULL, review_draft = NULL, review_draft_by = NULL,
              review_draft_at = NULL, graded_revision_id = NULL, feedback_published_at = NULL,
              reviewed_at = NULL, reviewed_by = NULL, updated_at = NOW()
        WHERE id = $1 RETURNING *`,
      [submission.id, isLate ? 'entregada_tarde' : 'enviada', revisionNumber, now],
    );
    await recomputeEnrollment(tx, enrollment.id, { now });
    return { submission: updated, revision, state: activityState(updated, activity) };
  });
}

// ── Foros ──────────────────────────────────────────────────────────────

async function loadForum(db, courseId, forumId) {
  const forum = await one(
    db,
    `SELECT id, course_id, module_id, lesson_id, scope, title, purpose, description,
            central_question, guiding_questions, participation_html, rules_html,
            opens_at, closes_at, no_participants_alternative, grading_method,
            status, sort_order, is_closed, allow_attachments, weight, rubric
       FROM aula_forums
      WHERE id = $1 AND course_id = $2 AND deleted_at IS NULL AND status = 'publicado'`,
    [forumId, courseId],
  );
  if (!forum) throw notFound('No encontramos ese foro publicado en el curso.');
  return forum;
}

function forumWindowState(forum, now) {
  if (forum.opens_at && new Date(forum.opens_at) > now) {
    return {
      open: false,
      message: `Este foro abre el ${new Date(forum.opens_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' })}.`,
    };
  }
  if (forum.closes_at && new Date(forum.closes_at) < now) {
    return { open: false, message: 'El periodo de participación de este foro terminó. La lectura sigue disponible.' };
  }
  if (forum.is_closed) return { open: false, message: 'Este foro está cerrado a nuevas respuestas. La lectura sigue disponible.' };
  return { open: true, message: null };
}

function authorName(row) {
  return [row.first_name, row.last_name].filter(Boolean).join(' ').trim() || 'Participante';
}

export async function forumForStudent(db, user, courseId, forumId, { now = new Date() } = {}) {
  const enrollment = await requireOpenEnrollment(db, user, courseId, { now });
  const forum = await loadForum(db, courseId, forumId);
  const posts = await many(
    db,
    `SELECT p.id, p.thread_id, p.title, p.body_html, p.file_id, p.is_pinned, p.is_locked,
            p.reply_count, p.last_activity_at, p.created_at, p.author_id, u.first_name, u.last_name
       FROM aula_forum_posts p
       LEFT JOIN aula_users u ON u.id = p.author_id
      WHERE p.forum_id = $1 AND p.deleted_at IS NULL AND p.is_hidden = FALSE
      ORDER BY p.is_pinned DESC, p.created_at ASC`,
    [forum.id],
  );
  const muted = await one(db, 'SELECT 1 FROM aula_forum_mutes WHERE course_id = $1 AND user_id = $2', [courseId, user.id]);
  const state = await forumState(db, forum.id, enrollment.id, user.id);
  const windowState = forumWindowState(forum, now);
  return {
    forum: {
      id: forum.id, title: forum.title, purpose: forum.purpose || '',
      description: forum.description, centralQuestion: forum.central_question || '',
      guidingQuestions: forum.guiding_questions || [],
      participationHtml: forum.participation_html || '', rulesHtml: forum.rules_html || '',
      opensAt: forum.opens_at, closesAt: forum.closes_at,
      noParticipantsAlternative: forum.no_participants_alternative || '',
      gradingMethod: forum.grading_method,
      isClosed: forum.is_closed, allowAttachments: forum.allow_attachments,
      isOpen: windowState.open, closedMessage: windowState.message,
      weight: forum.weight === null ? null : Number(forum.weight),
      rubric: asJson(forum.rubric),
    },
    posts: posts.map((p) => ({
      id: p.id, threadId: p.thread_id, title: p.title, bodyHtml: p.body_html,
      fileId: p.file_id, isPinned: p.is_pinned, isLocked: p.is_locked,
      replyCount: p.reply_count, lastActivityAt: p.last_activity_at, createdAt: p.created_at,
      author: authorName(p), isMine: p.author_id === user.id,
    })),
    canPost: windowState.open && !muted,
    isMuted: Boolean(muted),
    state,
  };
}

async function checkForumPosting(db, user, forum, now) {
  const windowState = forumWindowState(forum, now);
  if (!windowState.open) throw forbidden(windowState.message || 'Este foro no está abierto a respuestas.');
  const muted = await one(db, 'SELECT 1 FROM aula_forum_mutes WHERE course_id = $1 AND user_id = $2', [forum.course_id, user.id]);
  if (muted) throw forbidden('Un administrador limitó tu participación en los foros de este curso.');
  await requireOpenEnrollment(db, user, forum.course_id, { now });
}

async function forumFile(db, user, forum, fileId) {
  if (!fileId) return null;
  if (!forum.allow_attachments) throw badRequest('Este foro no admite adjuntos.');
  const file = await one(
    db,
    `SELECT id FROM aula_files
      WHERE id = $1 AND uploaded_by = $2 AND purpose = 'foro' AND status = 'listo' AND deleted_at IS NULL`,
    [fileId, user.id],
  );
  if (!file) throw notFound('No encontramos ese archivo del foro.');
  return fileId;
}

export async function createForumPost(db, user, courseId, forumId, input, { now = new Date() } = {}) {
  const forum = await loadForum(db, courseId, forumId);
  await checkForumPosting(db, user, forum, now);
  const title = str(input?.title, 'title', 'El título', { max: 200 });
  const body = sanitizeRichText(input?.bodyHtml);
  if (!body) throw badRequest('Escribe tu intervención.');
  const fileId = await forumFile(db, user, forum, input?.fileId ? idField(input.fileId, 'fileId', 'El archivo') : null);
  const row = await one(
    db,
    `INSERT INTO aula_forum_posts (forum_id, author_id, title, body_html, file_id, created_at, updated_at, last_activity_at)
     VALUES ($1, $2, $3, $4, $5, $6, $6, $6) RETURNING *`,
    [forum.id, user.id, title, body, fileId, now],
  );
  await recomputeEnrollment(db, (await requireOpenEnrollment(db, user, courseId, { now })).id, { now });
  return { post: row };
}

export async function replyForumPost(db, user, courseId, forumId, postId, input, { now = new Date() } = {}) {
  const forum = await loadForum(db, courseId, forumId);
  await checkForumPosting(db, user, forum, now);
  const parent = await one(
    db,
    'SELECT * FROM aula_forum_posts WHERE id = $1 AND forum_id = $2 AND deleted_at IS NULL AND is_hidden = FALSE',
    [postId, forum.id],
  );
  if (!parent) throw notFound('No encontramos esa intervención.');
  if (parent.is_locked) throw forbidden('Esta intervención está cerrada a respuestas.');
  const body = sanitizeRichText(input?.bodyHtml);
  if (!body) throw badRequest('Escribe tu respuesta.');
  const fileId = await forumFile(db, user, forum, input?.fileId ? idField(input.fileId, 'fileId', 'El archivo') : null);
  const rootId = parent.thread_id || parent.id;
  const row = await one(
    db,
    `INSERT INTO aula_forum_posts (forum_id, thread_id, author_id, body_html, file_id, created_at, updated_at, last_activity_at)
     VALUES ($1, $2, $3, $4, $5, $6, $6, $6) RETURNING *`,
    [forum.id, rootId, user.id, body, fileId, now],
  );
  await db.query(
    'UPDATE aula_forum_posts SET reply_count = reply_count + 1, last_activity_at = $2 WHERE id = $1',
    [rootId, now],
  );
  return { post: row };
}

export async function hideForumPost(db, actor, postId, reason, { ip, now = new Date() } = {}) {
  const post = await one(
    db,
    `SELECT p.*, f.course_id, f.title AS forum_title
       FROM aula_forum_posts p JOIN aula_forums f ON f.id = p.forum_id
      WHERE p.id = $1 AND p.deleted_at IS NULL AND f.deleted_at IS NULL`,
    [postId],
  );
  if (!post) throw notFound('No encontramos esa intervención.');
  await requireCourseTeacher(db, actor, post.course_id);
  const updated = await one(
    db,
    `UPDATE aula_forum_posts
        SET is_hidden = TRUE, hidden_by = $2, hidden_reason = $3, hidden_at = $4, updated_at = NOW()
      WHERE id = $1 RETURNING *`,
    [post.id, actor.id, String(reason || '').slice(0, 500) || null, now],
  );
  await audit(db, {
    actor, ip, action: 'foro.ocultar', entityType: 'foro_mensaje', entityId: post.id, courseId: post.course_id,
    summary: `Mensaje oculto en «${post.forum_title}».`, reason: reason || null,
  });
  return { post: updated };
}

// ── Revisión docente ───────────────────────────────────────────────────

function rubricReview(rubric, criteria, maxPoints, meta) {
  const defs = Array.isArray(rubric?.criteria) ? rubric.criteria : [];
  if (!defs.length) throw badRequest('La actividad no tiene una rúbrica configurada.');
  const scale = rubric?.scale === '0-100' ? '0-100' : '0-4';
  const input = new Map((Array.isArray(criteria) ? criteria : []).map((c) => [String(c.id), c]));
  const review = [];
  for (const def of defs) {
    const item = input.get(String(def.id));
    if (!item) throw badRequest(`Falta el criterio «${def.name}».`, { field: 'criteria' });
    const comment = str(item.comment, `criteria.${def.id}.comment`, `El comentario de ${def.name}`, { max: 2000, optional: true });
    if (scale === '0-100') {
      const scoreValue = num(item.score, `criteria.${def.id}.score`, `La nota de ${def.name}`, { min: 0, max: 100 });
      review.push({ id: def.id, name: def.name, weight: Number(def.weight), score: scoreValue, comment });
    } else {
      const level = int(item.level, `criteria.${def.id}.level`, `El nivel de ${def.name}`, { min: 0, max: 4 });
      review.push({ id: def.id, name: def.name, weight: Number(def.weight), level, comment });
    }
  }
  const score100 = round2(review.reduce((sum, r) => sum
    + (scale === '0-100' ? (r.score * r.weight) / 100 : (r.weight * r.level) / 4), 0));
  const score = round2((score100 * Number(maxPoints || 100)) / 100);
  return {
    version: scale === '0-100' ? 2 : 1,
    scale,
    criteria: review,
    score100,
    score,
    maxPoints: Number(maxPoints || 100),
    ...meta,
  };
}

const DECISION_STATUS = {
  en_revision: 'en_revision',
  requiere_ajustes: 'requiere_ajustes',
  aprobada: 'aprobada',
  no_aprobada: 'no_aprobada',
};

export async function teacherSubmission(db, actor, submissionId) {
  const submission = await one(
    db,
    `SELECT s.*, a.course_id, a.title AS activity_title, a.rubric, a.max_points, a.grading_method,
            e.user_id AS student_id, u.first_name, u.last_name, u.email
       FROM aula_submissions s
       JOIN aula_activities a ON a.id = s.activity_id
       JOIN aula_enrollments e ON e.id = s.enrollment_id
       JOIN aula_users u ON u.id = e.user_id
      WHERE s.id = $1`,
    [submissionId],
  );
  if (!submission) throw notFound('No encontramos esa entrega.');
  await requireCourseTeacher(db, actor, submission.course_id);
  const revisions = await many(
    db,
    `SELECT id, revision_number, text_body, link_url, file_id, is_late, submitted_at
       FROM aula_submission_revisions WHERE submission_id = $1 ORDER BY revision_number DESC`,
    [submission.id],
  );
  const feedback = await many(
    db,
    `SELECT id, decision, body, score, author_email, created_at
       FROM aula_submission_feedback WHERE submission_id = $1 ORDER BY created_at DESC`,
    [submission.id],
  );
  return {
    submission: {
      id: submission.id,
      activityId: submission.activity_id,
      activityTitle: submission.activity_title,
      courseId: submission.course_id,
      student: { id: submission.student_id, name: authorName(submission), email: submission.email },
      status: submission.status,
      score: submission.score === null ? null : Number(submission.score),
      currentRevision: submission.current_revision,
      firstSubmittedAt: submission.first_submitted_at,
      lastSubmittedAt: submission.last_submitted_at,
      reviewedAt: submission.reviewed_at,
      rubric: asJson(submission.rubric),
      gradingMethod: submission.grading_method || (submission.rubric ? 'rubrica' : 'directa'),
      maxPoints: Number(submission.max_points),
      rubricReview: asJson(submission.rubric_review),
      reviewDraft: asJson(submission.review_draft),
      revisions,
      feedback,
    },
  };
}

export async function reviewSubmission(db, actor, submissionId, input, { ip, now = new Date() } = {}) {
  const submission = await one(
    db,
    `SELECT s.*, a.course_id, a.title AS activity_title, a.rubric, a.max_points, a.grading_method,
            e.user_id AS student_id, u.first_name, u.last_name, u.email
       FROM aula_submissions s
       JOIN aula_activities a ON a.id = s.activity_id
       JOIN aula_enrollments e ON e.id = s.enrollment_id
       JOIN aula_users u ON u.id = e.user_id
      WHERE s.id = $1`,
    [submissionId],
  );
  if (!submission) throw notFound('No encontramos esa entrega.');
  await requireCourseTeacher(db, actor, submission.course_id);
  const publish = Boolean(input?.publish);
  const decision = oneOf(input?.decision, 'decision', 'La decisión', Object.keys(DECISION_STATUS), { optional: true });
  const feedback = str(input?.feedback, 'feedback', 'La retroalimentación', { max: 10000, optional: true });
  const changeReason = str(input?.changeReason, 'changeReason', 'El motivo del cambio de nota', { min: 5, max: 1000, optional: true });
  const previousScore = submission.score === null || submission.score === undefined ? null : Number(submission.score);
  const latestRevision = await one(
    db,
    'SELECT id FROM aula_submission_revisions WHERE submission_id = $1 ORDER BY revision_number DESC LIMIT 1',
    [submission.id],
  );
  const meta = {
    decision: decision || null,
    revisionId: latestRevision?.id || null,
    revisionNumber: submission.current_revision,
    reviewerId: actor.id,
    reviewerEmail: actor.email,
    reviewedAt: now,
  };
  const hasCriteria = Array.isArray(input?.criteria) && input.criteria.length > 0;
  let review;
  if (hasCriteria) {
    review = rubricReview(asJson(submission.rubric), input.criteria, submission.max_points, meta);
  } else {
    const score100 = num(input?.score, 'score', 'La nota', { min: 0, max: 100, optional: !publish });
    if (score100 === null && publish) {
      throw badRequest('Escribe una nota entre 0 y 100 antes de publicar.', { field: 'score' });
    }
    review = {
      version: 1,
      scale: '0-100',
      mode: 'directa',
      criteria: [],
      score100,
      score: score100 === null ? null : round2((score100 * Number(submission.max_points || 100)) / 100),
      maxPoints: Number(submission.max_points || 100),
      ...meta,
    };
  }

  if (!publish) {
    const draft = { ...review, feedback, savedAt: now };
    await db.query(
      `UPDATE aula_submissions
          SET review_draft = $2::jsonb, review_draft_by = $3, review_draft_at = $4, updated_at = NOW()
        WHERE id = $1`,
      [submission.id, JSON.stringify(draft), actor.id, now],
    );
    return { draft: true, review: draft };
  }
  if (!decision) throw badRequest('Elige una decisión antes de publicar.');
  if (review.score === null || review.score === undefined) {
    throw badRequest('Escribe una nota entre 0 y 100 antes de publicar.', { field: 'score' });
  }

  const changed = previousScore !== null && Math.abs(previousScore - Number(review.score)) > 0.005;
  const reasonForChange = changeReason || (feedback && feedback.trim().length >= 5 ? feedback : null);
  if (changed && !reasonForChange) {
    throw badRequest('Explica el motivo del cambio de una nota ya publicada.', { field: 'changeReason' });
  }

  return db.tx(async (tx) => {
    const updated = await one(
      tx,
      `UPDATE aula_submissions
          SET status = $2, score = $3, reviewed_at = $4, reviewed_by = $5,
              graded_revision_id = (SELECT id FROM aula_submission_revisions
                                     WHERE submission_id = $1 ORDER BY revision_number DESC LIMIT 1),
              rubric_review = $6::jsonb, feedback_published_at = $4,
              review_draft = NULL, review_draft_by = NULL, review_draft_at = NULL,
              updated_at = NOW()
        WHERE id = $1 RETURNING *`,
      [submission.id, DECISION_STATUS[decision], review.score, now, actor.id, JSON.stringify(review)],
    );
    await tx.query(
      `INSERT INTO aula_submission_feedback (submission_id, revision_id, author_id, author_email, decision, body, score, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [submission.id, updated.graded_revision_id, actor.id, actor.email, decision, feedback, review.score, now],
    );
    await recomputeEnrollment(tx, submission.enrollment_id, { now });
    if (changed) {
      await tx.query(
        `INSERT INTO aula_grade_changes
           (target_type, target_id, enrollment_id, old_value, new_value, reason, changed_by, changed_by_email, changed_at)
         VALUES ('entrega', $1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          submission.id, submission.enrollment_id, previousScore, review.score,
          reasonForChange.slice(0, 500), actor.id, actor.email, now,
        ],
      );
    }
    await audit(tx, {
      actor, ip, action: 'entrega.revisar', entityType: 'entrega', entityId: submission.id,
      courseId: submission.course_id,
      summary: `Entrega de ${authorName(submission)} revisada: ${decision}, ${review.score}/${review.maxPoints}.`,
      reason: changed ? reasonForChange : null,
      after: { decision, score: review.score, maxPoints: review.maxPoints, revision: submission.current_revision },
    });
    return { draft: false, submission: updated, review };
  });
}

export async function teacherForum(db, actor, forumId) {
  const forum = await one(
    db,
    `SELECT f.*, c.title AS course_title FROM aula_forums f JOIN aula_courses c ON c.id = f.course_id
      WHERE f.id = $1 AND f.deleted_at IS NULL`,
    [forumId],
  );
  if (!forum) throw notFound('No encontramos ese foro.');
  await requireCourseTeacher(db, actor, forum.course_id);
  const posts = await many(
    db,
    `SELECT p.*, u.first_name, u.last_name, u.email
       FROM aula_forum_posts p LEFT JOIN aula_users u ON u.id = p.author_id
      WHERE p.forum_id = $1 AND p.deleted_at IS NULL
      ORDER BY p.created_at ASC`,
    [forum.id],
  );
  const grades = await many(
    db,
    `SELECT g.*, u.first_name, u.last_name, u.email
       FROM aula_forum_grades g
       JOIN aula_enrollments e ON e.id = g.enrollment_id
       JOIN aula_users u ON u.id = e.user_id
      WHERE g.forum_id = $1`,
    [forum.id],
  );
  return {
    forum: {
      id: forum.id, courseId: forum.course_id, title: forum.title, description: forum.description,
      purpose: forum.purpose || '', centralQuestion: forum.central_question || '',
      guidingQuestions: forum.guiding_questions || [], participationHtml: forum.participation_html || '',
      rulesHtml: forum.rules_html || '', noParticipantsAlternative: forum.no_participants_alternative || '',
      opensAt: forum.opens_at, closesAt: forum.closes_at, status: forum.status,
      gradingMethod: forum.grading_method || (forum.rubric ? 'rubrica' : 'formativa'),
      rubric: asJson(forum.rubric), weight: forum.weight === null ? null : Number(forum.weight),
    },
    posts: posts.map((p) => ({
      ...p, author: authorName(p),
    })),
    grades: grades.map((g) => ({
      enrollmentId: g.enrollment_id, student: authorName(g), email: g.email,
      score: g.score === null ? null : Number(g.score), feedback: g.feedback,
      rubricReview: asJson(g.rubric_review), gradedAt: g.graded_at,
    })),
  };
}

export async function gradeForum(db, actor, forumId, input, { ip, now = new Date() } = {}) {
  const forum = await one(
    db,
    `SELECT f.*, c.title AS course_title FROM aula_forums f JOIN aula_courses c ON c.id = f.course_id
      WHERE f.id = $1 AND f.deleted_at IS NULL`,
    [forumId],
  );
  if (!forum) throw notFound('No encontramos ese foro.');
  await requireCourseTeacher(db, actor, forum.course_id);
  const enrollmentId = idField(input?.enrollmentId, 'enrollmentId', 'La matrícula');
  const enrollment = await one(
    db,
    'SELECT e.id, e.course_id, u.first_name, u.last_name, u.email FROM aula_enrollments e JOIN aula_users u ON u.id = e.user_id WHERE e.id = $1 AND e.course_id = $2',
    [enrollmentId, forum.course_id],
  );
  if (!enrollment) throw notFound('Esa persona no está matriculada en el curso.');
  const feedback = str(input?.feedback, 'feedback', 'La retroalimentación', { max: 10000, optional: true });
  const changeReason = str(input?.changeReason, 'changeReason', 'El motivo del cambio de nota', { min: 5, max: 1000, optional: true });
  let score;
  let review = null;
  if (Array.isArray(input?.criteria) && input.criteria.length) {
    review = rubricReview(asJson(forum.rubric), input.criteria, 100, {
      forumId: forum.id, enrollmentId, reviewerId: actor.id, reviewerEmail: actor.email, reviewedAt: now,
    });
    score = review.score100;
  } else {
    score = Number(input?.score);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      throw badRequest('La nota del foro debe estar entre 0 y 100.', { field: 'score' });
    }
    score = round2(score);
  }
  return db.tx(async (tx) => {
    const previous = await one(
      tx,
      'SELECT score, feedback, graded_at FROM aula_forum_grades WHERE forum_id = $1 AND enrollment_id = $2 FOR UPDATE',
      [forum.id, enrollmentId],
    );
    const previousScore = previous?.score === null || previous?.score === undefined ? null : Number(previous.score);
    const changed = previousScore !== null && Math.abs(previousScore - score) > 0.005;
    const reasonForChange = changeReason || (feedback && feedback.trim().length >= 5 ? feedback : null);
    if (changed && !reasonForChange) {
      throw badRequest('Explica el motivo del cambio de una nota ya publicada.', { field: 'changeReason' });
    }
    const row = await one(
      tx,
      `INSERT INTO aula_forum_grades (forum_id, enrollment_id, score, rubric_review, feedback, graded_by, graded_at)
       VALUES ($1, $2, $3, $4::jsonb, $5, $6, $7)
       ON CONFLICT (forum_id, enrollment_id) DO UPDATE
          SET score = EXCLUDED.score, rubric_review = EXCLUDED.rubric_review,
              feedback = EXCLUDED.feedback, graded_by = EXCLUDED.graded_by,
              graded_at = EXCLUDED.graded_at, updated_at = NOW()
       RETURNING *`,
      [forum.id, enrollmentId, score, review ? JSON.stringify(review) : null, feedback, actor.id, now],
    );
    if (changed) {
      await tx.query(
        `INSERT INTO aula_grade_changes
           (target_type, target_id, enrollment_id, old_value, new_value, reason, changed_by, changed_by_email, changed_at, metadata)
         VALUES ('foro', $1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)`,
        [row.id, enrollmentId, previousScore, score, reasonForChange.slice(0, 500), actor.id, actor.email, now,
          JSON.stringify({ forumId: forum.id, forumTitle: forum.title })],
      );
    }
    await recomputeEnrollment(tx, enrollmentId, { now });
    await audit(tx, {
      actor, ip, action: 'foro.calificar', entityType: 'foro_calificacion', entityId: row.id, courseId: forum.course_id,
      summary: `Foro «${forum.title}» calificado a ${authorName(enrollment)}: ${score}/100.`,
      reason: changed ? reasonForChange : null,
      before: previous ? { score: previousScore, feedback: previous.feedback, gradedAt: previous.graded_at } : null,
      after: { score, enrollmentId },
    });
    return { grade: row, review };
  });
}

// ── Docente: cursos y resumen ──────────────────────────────────────────

export async function teacherCourses(db, user) {
  const admin = user.role === 'admin';
  const rows = await many(
    db,
    `SELECT c.id, c.title, c.short_description, c.cover_file_id, c.cover_url, c.status,
            (SELECT count(*)::int FROM aula_enrollments e WHERE e.course_id = c.id AND e.withdrawn_at IS NULL) AS students,
            (SELECT count(*)::int FROM aula_submissions s JOIN aula_activities a ON a.id = s.activity_id
              WHERE a.course_id = c.id AND s.status IN ('enviada','entregada_tarde','en_revision')) AS pending_submissions,
            (SELECT count(*)::int FROM aula_forums f WHERE f.course_id = c.id AND f.deleted_at IS NULL) AS forums
       FROM aula_courses c
       ${admin ? '' : 'JOIN aula_course_teachers t ON t.course_id = c.id AND t.user_id = $1'}
      WHERE c.deleted_at IS NULL
      ORDER BY c.title`,
    admin ? [] : [user.id],
  );
  return rows;
}

export async function teacherCourseOverview(db, user, courseId) {
  await requireCourseTeacher(db, user, courseId);
  const course = await one(
    db,
    `SELECT id, title, short_description, status, passing_score, grade_policy, duration_minutes
       FROM aula_courses WHERE id = $1 AND deleted_at IS NULL`,
    [courseId],
  );
  if (!course) throw notFound('No encontramos ese curso.');
  const students = await many(
    db,
    `SELECT e.id AS enrollment_id, e.user_id, e.effective_status, e.progress_pct, e.final_score,
            u.first_name, u.last_name, u.email
       FROM aula_enrollments_v e JOIN aula_users u ON u.id = e.user_id
      WHERE e.course_id = $1 AND e.withdrawn_at IS NULL
      ORDER BY lower(u.first_name || u.last_name)`,
    [courseId],
  );
  const studentRows = [];
  for (const s of students) {
    const ped = await pedagogyProgress(db, { enrollmentId: s.enrollment_id, courseId, userId: s.user_id });
    studentRows.push({
      enrollmentId: s.enrollment_id,
      userId: s.user_id,
      name: authorName(s),
      email: s.email,
      status: s.effective_status,
      progressPct: Number(s.progress_pct) || 0,
      finalScore: s.final_score === null ? null : Number(s.final_score),
      provisional: ped?.provisional ?? false,
      approved: ped?.approved ?? false,
      pending: ped?.pending || [],
      requirements: ped?.requirements || null,
    });
  }
  const submissions = await many(
    db,
    `SELECT s.id, s.status, s.score, s.current_revision, s.last_submitted_at,
            a.id AS activity_id, a.title AS activity_title,
            e.id AS enrollment_id, u.first_name, u.last_name, u.email
       FROM aula_submissions s
       JOIN aula_activities a ON a.id = s.activity_id
       JOIN aula_enrollments e ON e.id = s.enrollment_id
       JOIN aula_users u ON u.id = e.user_id
      WHERE a.course_id = $1 AND s.current_revision > 0
      ORDER BY s.last_submitted_at DESC NULLS LAST`,
    [courseId],
  );
  const attempts = await many(
    db,
    `SELECT at.id, at.attempt_number, at.status, at.score_pct, at.passed, at.submitted_at,
            a.title AS assessment_title, u.first_name, u.last_name, u.email
       FROM aula_attempts at
       JOIN aula_assessments a ON a.id = at.assessment_id
       JOIN aula_enrollments e ON e.id = at.enrollment_id
       JOIN aula_users u ON u.id = e.user_id
      WHERE a.course_id = $1 AND at.status <> 'en_curso'
      ORDER BY at.submitted_at DESC NULLS LAST`,
    [courseId],
  );
  const forums = await many(
    db,
    `SELECT f.id, f.title, f.weight,
            (SELECT count(*)::int FROM aula_forum_posts p WHERE p.forum_id = f.id AND p.deleted_at IS NULL AND p.is_hidden = FALSE) AS posts,
            (SELECT count(*)::int FROM aula_forum_grades g WHERE g.forum_id = f.id) AS grades
       FROM aula_forums f WHERE f.course_id = $1 AND f.deleted_at IS NULL ORDER BY f.id`,
    [courseId],
  );
  return {
    course: {
      id: course.id, title: course.title, shortDescription: course.short_description,
      status: course.status, passingScore: Number(course.passing_score),
      durationMinutes: course.duration_minutes,
      policy: asJson(course.grade_policy),
    },
    students: studentRows,
    submissions: submissions.map((s) => ({
      id: s.id, status: s.status, score: s.score === null ? null : Number(s.score),
      revision: s.current_revision, submittedAt: s.last_submitted_at,
      activityId: s.activity_id, activityTitle: s.activity_title,
      enrollmentId: s.enrollment_id, student: authorName(s), email: s.email,
    })),
    attempts: attempts.map((a) => ({
      id: a.id, number: a.attempt_number, status: a.status,
      scorePct: a.score_pct === null ? null : Number(a.score_pct), passed: a.passed,
      submittedAt: a.submitted_at, assessmentTitle: a.assessment_title,
      student: authorName(a), email: a.email,
    })),
    forums: forums.map((f) => ({
      id: f.id, title: f.title, weight: f.weight === null ? null : Number(f.weight),
      posts: f.posts, grades: f.grades,
    })),
  };
}




/** Resumen que alimenta la página de evaluación del estudiante. */
export async function pedagogyOverview(db, user, courseId, { now = new Date() } = {}) {
  const enrollment = await requireOpenEnrollment(db, user, courseId, { now });
  const progress = await pedagogyProgress(db, { enrollmentId: enrollment.id, courseId, userId: user.id });
  const assessments = (await assessmentList(db, user, courseId, { now })).assessments;
  const activities = await activityList(db, user, courseId, { now });
  const forumRows = await many(
    db,
    `SELECT id, title, purpose, description, central_question, guiding_questions,
            participation_html, rules_html, opens_at, closes_at, no_participants_alternative,
            grading_method, is_closed, allow_attachments, weight, rubric
       FROM aula_forums
      WHERE course_id = $1 AND deleted_at IS NULL AND status = 'publicado'
      ORDER BY sort_order, id`,
    [courseId],
  );
  const forums = [];
  for (const f of forumRows) {
    const state = await forumState(db, f.id, enrollment.id, user.id);
    const windowState = forumWindowState(f, now);
    forums.push({
      id: f.id, title: f.title, purpose: f.purpose || '', description: f.description,
      centralQuestion: f.central_question || '', guidingQuestions: f.guiding_questions || [],
      participationHtml: f.participation_html || '', rulesHtml: f.rules_html || '',
      noParticipantsAlternative: f.no_participants_alternative || '',
      opensAt: f.opens_at, closesAt: f.closes_at,
      isOpen: windowState.open, closedMessage: windowState.message,
      gradingMethod: f.grading_method, isClosed: f.is_closed,
      allowAttachments: f.allow_attachments,
      weight: f.weight === null ? null : Number(f.weight),
      rubric: asJson(f.rubric),
      ...state,
    });
  }
  return {
    policy: progress?.policy || null,
    grade: progress ? {
      configured: progress.configured,
      configOk: progress.configOk,
      configError: progress.configError,
      finalScore: progress.finalScore,
      accumulatedScore: progress.accumulatedScore,
      provisional: progress.provisional,
      approved: progress.approved,
      pending: progress.pending,
      components: progress.components,
      passingScore: progress.passingScore,
      policy: progress.policy,
      weightsByType: progress.weightsByType,
      weightMismatch: progress.weightMismatch,
    } : null,
    requirements: progress?.requirements || null,
    assessments,
    activities,
    forums,
  };
}

/** Entregas de un curso para el docente; por defecto, las ya enviadas. */
export async function teacherSubmissions(db, actor, courseId, { status = null } = {}) {
  await requireCourseTeacher(db, actor, courseId);
  const allowed = ['enviada', 'entregada_tarde', 'en_revision', 'requiere_ajustes', 'aprobada', 'no_aprobada'];
  const filter = allowed.includes(status) ? status : null;
  const rows = await many(
    db,
    `SELECT s.id, s.status, s.score, s.current_revision, s.first_submitted_at, s.last_submitted_at,
            s.reviewed_at, a.id AS activity_id, a.title AS activity_title, a.max_points,
            e.id AS enrollment_id, u.first_name, u.last_name, u.email
       FROM aula_submissions s
       JOIN aula_activities a ON a.id = s.activity_id
       JOIN aula_enrollments e ON e.id = s.enrollment_id
       JOIN aula_users u ON u.id = e.user_id
      WHERE a.course_id = $1 AND s.current_revision > 0
        ${filter ? 'AND s.status = $2' : ''}
      ORDER BY s.last_submitted_at DESC NULLS LAST`,
    filter ? [courseId, filter] : [courseId],
  );
  return rows.map((s) => ({
    id: s.id, status: s.status, score: s.score === null ? null : Number(s.score),
    revision: s.current_revision, firstSubmittedAt: s.first_submitted_at,
    lastSubmittedAt: s.last_submitted_at, reviewedAt: s.reviewed_at,
    activityId: s.activity_id, activityTitle: s.activity_title, maxPoints: Number(s.max_points),
    enrollmentId: s.enrollment_id, student: authorName(s), email: s.email,
  }));
}

export async function listCourseTeachers(db, courseId) {
  return many(
    db,
    `SELECT t.user_id, t.role, t.created_at, u.first_name, u.last_name, u.email, u.status
       FROM aula_course_teachers t JOIN aula_users u ON u.id = t.user_id
      WHERE t.course_id = $1 ORDER BY lower(u.first_name || u.last_name)`,
    [courseId],
  );
}

export async function addCourseTeacher(db, actor, courseId, userId, { role = 'docente', ip, now = new Date() } = {}) {
  const user = await one(
    db,
    "SELECT id, email, role, status FROM aula_users WHERE id = $1 AND deleted_at IS NULL",
    [userId],
  );
  if (!user) throw notFound('No encontramos a esa persona.');
  if (user.role !== 'docente') throw badRequest('La persona debe tener rol docente para asignarle un curso.');
  const course = await one(db, 'SELECT id, title FROM aula_courses WHERE id = $1 AND deleted_at IS NULL', [courseId]);
  if (!course) throw notFound('No encontramos ese curso.');
  await db.query(
    `INSERT INTO aula_course_teachers (course_id, user_id, role, created_by)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (course_id, user_id) DO UPDATE SET role = EXCLUDED.role`,
    [courseId, userId, role, actor.id],
  );
  await audit(db, {
    actor, ip, action: 'curso.docente', entityType: 'curso', entityId: courseId, courseId,
    summary: `${user.email} asignado como ${role} de «${course.title}».`,
    after: { userId, role },
  });
  return listCourseTeachers(db, courseId);
}

export async function removeCourseTeacher(db, actor, courseId, userId, { ip } = {}) {
  const user = await one(db, 'SELECT email FROM aula_users WHERE id = $1', [userId]);
  const course = await one(db, 'SELECT title FROM aula_courses WHERE id = $1', [courseId]);
  const deleted = await one(
    db,
    'DELETE FROM aula_course_teachers WHERE course_id = $1 AND user_id = $2 RETURNING course_id',
    [courseId, userId],
  );
  if (!deleted) throw notFound('Esa persona no está asignada como docente del curso.');
  await audit(db, {
    actor, ip, action: 'curso.docente', entityType: 'curso', entityId: courseId, courseId,
    summary: `${user?.email || userId} retirado como docente de «${course?.title || courseId}».`,
  });
  return listCourseTeachers(db, courseId);
}



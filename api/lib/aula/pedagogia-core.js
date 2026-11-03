/**
 * Cálculo compartido de requisitos, nota y aprobación.
 *
 * Este módulo solo lee. Lo usan progress.js (para actualizar la matrícula)
 * y pedagogia.js (para las pantallas y las operaciones). No importa
 * progress.js para evitar ciclos.
 */
import { many, one } from './db.js';

export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const n = (v) => (v === null || v === undefined ? null : Number(v));

export function normalizePolicy(raw, course = {}) {
  const passingScore = n(course.passing_score) ?? 70;
  const maxAttempts = Number(course.max_attempts) || 1;
  if (!raw || typeof raw !== 'object') {
    return {
      configured: false, configOk: false, components: { activities: 0, quizzes: 0, forums: 0 },
      passingScore, maxAttempts, error: 'El curso no tiene política de nota configurada.',
    };
  }
  const c = raw.components || {};
  const components = {
    activities: Number(c.activities) || 0,
    quizzes: Number(c.quizzes) || 0,
    forums: Number(c.forums) || 0,
  };
  const sum = round2(components.activities + components.quizzes + components.forums);
  const configOk = Math.abs(sum - 100) <= 0.05;
  return {
    configured: true,
    configOk,
    components,
    total: sum,
    passingScore: n(raw.passingScore) ?? passingScore,
    maxAttempts: Number(raw.maxAttempts) || maxAttempts,
    rounding: raw.rounding || 'half_up',
    error: configOk ? null : `Los pesos del curso suman ${sum} %, no 100 %.`,
  };
}

export async function loadPolicy(db, courseId) {
  const course = await one(
    db,
    'SELECT id, title, passing_score, max_attempts, grade_policy FROM aula_courses WHERE id = $1 AND deleted_at IS NULL',
    [courseId],
  );
  if (!course) return null;
  return { course, policy: normalizePolicy(course.grade_policy, course) };
}

export async function assessmentRows(db, courseId) {
  return many(
    db,
    `SELECT id, module_id, title, instructions_html, passing_score, max_attempts,
            show_answers_after_submit, status, weight, sort_order
       FROM aula_assessments
      WHERE course_id = $1 AND deleted_at IS NULL
      ORDER BY sort_order, id`,
    [courseId],
  );
}

export async function activityRows(db, courseId) {
  return many(
    db,
    `SELECT id, module_id, title, instructions_html, rubric, due_at,
            allow_text, allow_link, allow_file, accepted_extensions, max_file_mb,
            max_points, is_required, status, weight, sort_order
       FROM aula_activities
      WHERE course_id = $1 AND deleted_at IS NULL
      ORDER BY sort_order, id`,
    [courseId],
  );
}

export async function forumRows(db, courseId) {
  return many(
    db,
    `SELECT id, module_id, lesson_id, scope, title, description, is_closed, allow_attachments, weight
       FROM aula_forums
      WHERE course_id = $1 AND deleted_at IS NULL
      ORDER BY id`,
    [courseId],
  );
}

export async function attemptRows(db, assessmentId, enrollmentId) {
  return many(
    db,
    `SELECT id, attempt_number, status, score, max_score, score_pct, passing_score,
            passed, started_at, submitted_at, graded_at, duration_seconds
       FROM aula_attempts
      WHERE assessment_id = $1 AND enrollment_id = $2
      ORDER BY attempt_number`,
    [assessmentId, enrollmentId],
  );
}

export function attemptSummary(attempts, assessment, policy) {
  const open = attempts.find((a) => a.status === 'en_curso') || null;
  const submitted = attempts.filter((a) => a.status !== 'en_curso');
  const graded = submitted.filter((a) => a.score_pct !== null && a.score_pct !== undefined);
  const best = graded.length ? Math.max(...graded.map((a) => Number(a.score_pct))) : null;
  const maxAttempts = Number(assessment.max_attempts || policy.maxAttempts || 1);
  const passing = Number(assessment.passing_score ?? policy.passingScore ?? 70);
  const passed = best !== null && best >= passing;
  return {
    attempts: attempts.map((a) => ({
      id: a.id,
      number: a.attempt_number,
      status: a.status,
      score: n(a.score),
      maxScore: n(a.max_score),
      scorePct: n(a.score_pct),
      passed: a.passed,
      startedAt: a.started_at,
      submittedAt: a.submitted_at,
      gradedAt: a.graded_at,
      durationSeconds: a.duration_seconds,
    })),
    openAttemptId: open ? open.id : null,
    used: submitted.length,
    remaining: Math.max(0, maxAttempts - submitted.length),
    bestScore: best,
    passed,
    canStart: !open && submitted.length < maxAttempts,
    maxAttempts,
    passingScore: passing,
    status: open ? 'en_curso' : submitted.length ? (passed ? 'aprobado' : 'finalizado') : 'pendiente',
    submitted: submitted.length > 0,
  };
}

export async function submissionRow(db, activityId, enrollmentId) {
  return one(
    db,
    `SELECT s.*, 
            (SELECT row_to_json(r) FROM (
               SELECT id, revision_number, text_body, link_url, file_id, is_late, submitted_at
                 FROM aula_submission_revisions
                WHERE submission_id = s.id
                ORDER BY revision_number DESC LIMIT 1
             ) r) AS last_revision,
            (SELECT f.body FROM aula_submission_feedback f
              WHERE f.submission_id = s.id AND f.decision IN ('aprobada','no_aprobada','requiere_ajustes')
              ORDER BY f.created_at DESC LIMIT 1) AS last_feedback
       FROM aula_submissions s
      WHERE s.activity_id = $1 AND s.enrollment_id = $2`,
    [activityId, enrollmentId],
  );
}

export function activityState(submission, activity) {
  if (!submission) {
    return {
      status: 'sin_entregar', submitted: false, graded: false, score: null, score100: null,
      lastRevision: null, feedback: null, draft: null,
    };
  }
  const hasDraft = Boolean(submission.draft_text || submission.draft_link || submission.draft_file_id);
  const submitted = Number(submission.current_revision) > 0
    && !['pendiente'].includes(submission.status);
  const graded = submission.score !== null && submission.score !== undefined
    && ['aprobada', 'no_aprobada'].includes(submission.status);
  const score = n(submission.score);
  const maxPoints = Number(activity.max_points) || 100;
  return {
    status: graded ? 'calificado' : submitted ? 'pendiente_revision' : hasDraft ? 'borrador' : 'sin_entregar',
    rawStatus: submission.status,
    submitted,
    graded,
    score,
    score100: score === null ? null : round2((score / maxPoints) * 100),
    lastRevision: submission.last_revision || null,
    feedback: submission.last_feedback || null,
    draft: hasDraft ? {
      text: submission.draft_text || '',
      link: submission.draft_link || '',
      fileId: submission.draft_file_id || null,
      updatedAt: submission.draft_updated_at,
    } : null,
    currentRevision: Number(submission.current_revision) || 0,
    reviewedAt: submission.reviewed_at,
    rubricReview: submission.rubric_review || null,
  };
}

export async function forumState(db, forumId, enrollmentId, userId) {
  const post = await one(
    db,
    `SELECT count(*)::int AS posts
       FROM aula_forum_posts
      WHERE forum_id = $1 AND author_id = $2 AND deleted_at IS NULL AND is_hidden = FALSE`,
    [forumId, userId],
  );
  const grade = await one(
    db,
    'SELECT score, feedback, graded_at, rubric_review FROM aula_forum_grades WHERE forum_id = $1 AND enrollment_id = $2',
    [forumId, enrollmentId],
  );
  const posts = post?.posts || 0;
  const score = grade?.score === null || grade?.score === undefined ? null : Number(grade.score);
  return {
    posts,
    participated: posts > 0,
    graded: score !== null,
    score,
    feedback: grade?.feedback || null,
    gradedAt: grade?.graded_at || null,
    rubricReview: grade?.rubric_review || null,
    status: score !== null ? 'calificado' : posts > 0 ? 'pendiente_revision' : 'sin_entregar',
  };
}

/**
 * Estado completo de la pedagogía de una matrícula.
 * Devuelve componentes, requisitos, nota provisional/final y aprobación.
 */
export async function pedagogyProgress(db, { enrollmentId, courseId, userId }) {
  const config = await loadPolicy(db, courseId);
  if (!config) return null;
  const { course, policy } = config;
  const [assessments, activities, forums] = await Promise.all([
    assessmentRows(db, courseId),
    activityRows(db, courseId),
    forumRows(db, courseId),
  ]);

  const assessmentItems = [];
  for (const a of assessments) {
    const attempts = await attemptRows(db, a.id, enrollmentId);
    const summary = attemptSummary(attempts, a, policy);
    assessmentItems.push({
      id: a.id, moduleId: a.module_id, title: a.title, weight: n(a.weight),
      required: n(a.weight) > 0 && a.status === 'publicado',
      available: a.status === 'publicado',
      status: a.status, ...summary,
    });
  }

  const activityItems = [];
  for (const a of activities) {
    const submission = await submissionRow(db, a.id, enrollmentId);
    const state = activityState(submission, a);
    activityItems.push({
      id: a.id, moduleId: a.module_id, title: a.title, weight: n(a.weight),
      required: n(a.weight) > 0 && a.status === 'publicado',
      available: a.status === 'publicado',
      status: a.status, ...state,
    });
  }

  const forumItems = [];
  for (const f of forums) {
    const state = await forumState(db, f.id, enrollmentId, userId);
    forumItems.push({
      id: f.id, moduleId: f.module_id, title: f.title, weight: n(f.weight),
      required: n(f.weight) > 0,
      available: true, ...state,
    });
  }

  const requiredAssessments = assessmentItems.filter((a) => a.required);
  const requiredActivities = activityItems.filter((a) => a.required);
  const requiredForums = forumItems.filter((f) => f.required);

  const components = [
    ...requiredAssessments.map((a) => ({
      type: 'quiz', id: a.id, title: a.title, weight: a.weight,
      score: a.bestScore, status: a.status,
      submitted: a.submitted, passed: a.passed,
      pending: a.bestScore === null,
    })),
    ...requiredActivities.map((a) => ({
      type: 'activity', id: a.id, title: a.title, weight: a.weight,
      score: a.score100, status: a.status,
      submitted: a.submitted, graded: a.graded,
      pending: a.score100 === null,
    })),
    ...requiredForums.map((f) => ({
      type: 'forum', id: f.id, title: f.title, weight: f.weight,
      score: f.score, status: f.status,
      submitted: f.participated, graded: f.graded,
      pending: f.score === null,
    })),
  ];

  const finalScore = round2(components.reduce((sum, c) => sum + (c.score === null ? 0 : (c.score * c.weight) / 100), 0));
  const pending = components.filter((c) => c.pending);
  const weightsTotal = round2(components.reduce((sum, c) => sum + c.weight, 0));
  const approved = policy.configured && policy.configOk && pending.length === 0 && finalScore >= policy.passingScore;

  return {
    configured: policy.configured,
    configOk: policy.configOk,
    policy,
    passingScore: policy.passingScore,
    finalScore,
    provisional: pending.length > 0,
    approved,
    pending: pending.map((p) => ({ type: p.type, id: p.id, title: p.title })),
    weightsTotal,
    components,
    requirements: {
      lessons: null,
      assessments: {
        required: requiredAssessments.length,
        submitted: requiredAssessments.filter((a) => a.submitted).length,
        passed: requiredAssessments.filter((a) => a.passed).length,
      },
      activities: {
        required: requiredActivities.length,
        submitted: requiredActivities.filter((a) => a.submitted).length,
        approved: requiredActivities.filter((a) => a.graded && a.rawStatus === 'aprobada').length,
      },
      forums: {
        required: requiredForums.length,
        participated: requiredForums.filter((f) => f.participated).length,
        graded: requiredForums.filter((f) => f.graded).length,
      },
    },
    items: { assessments: assessmentItems, activities: activityItems, forums: forumItems },
  };
}

/**
 * Recorrido completo de la capa pedagógica en un curso aislado.
 *
 * Cubre: intentos de quiz, claves privadas, doble envío, segundo intento,
 * borrador y revisión de actividades, foros, permisos de docente y la
 * nota final conocida 78,5/100.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { pdfBytes, seedUser, startTestApp, uploadFile } from './helpers.js';

let t;
let course;
let moduleRow;
let lesson;
let block;
let quiz1;
let quiz2;
let quiz3;
let act1;
let act2;
let act3;
let actFile;
let forum1;
let forum2;
let forum3;
let student1;
let student2;
let outsider;
let teacher;
let teacher2;
let admin;
let s1;
let s2;
let out;
let doc;
let doc2;
let adminClient;

const RUBRIC_5 = {
  version: 1,
  total: 100,
  criteria: Array.from({ length: 5 }, (_, i) => ({
    id: `c${i + 1}`,
    name: `Criterio ${i + 1}`,
    weight: 20,
    levels: [4, 3, 2, 1, 0].map((level) => ({
      level, label: String(level), description: `Descriptor ${level}`,
    })),
  })),
};

const RUBRIC_3 = {
  version: 1,
  total: 100,
  criteria: [
    { id: 'pertinencia', name: 'Pertinencia', weight: 30, levels: [] },
    { id: 'razonamiento', name: 'Razonamiento', weight: 40, levels: [] },
    { id: 'interaccion', name: 'Interacción', weight: 30, levels: [] },
  ],
};

const levels = (sum) => {
  // Reparte el total de niveles (0–20) entre cinco criterios de 20%.
  const out = [4, 4, 4, 4, 4];
  let remaining = 20 - sum;
  for (let i = 4; i >= 0 && remaining > 0; i -= 1) {
    const take = Math.min(out[i], remaining);
    out[i] -= take;
    remaining -= take;
  }
  return out.map((level, i) => ({ id: `c${i + 1}`, level, comment: `Comentario ${i + 1}` }));
};

async function seedQuiz(title, weight = 10) {
  const { rows: [assessment] } = await t.db.query(
    `INSERT INTO aula_assessments
       (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
        shuffle_questions, shuffle_options, show_answers_after_submit, status, weight, sort_order)
     VALUES ($1, $2, $3, 'Responde con cuidado.', TRUE, 70, 2, FALSE, FALSE, TRUE, 'publicado', $4, 1)
     RETURNING *`,
    [course.id, moduleRow.id, title, weight],
  );
  const { rows: [bank] } = await t.db.query(
    'INSERT INTO aula_question_banks (course_id, name) VALUES ($1, $2) RETURNING *',
    [course.id, `Banco ${title}`],
  );
  const questions = [];
  for (let i = 0; i < 4; i += 1) {
    const { rows: [q] } = await t.db.query(
      `INSERT INTO aula_questions (bank_id, type, prompt_html, points, explanation, general_feedback)
       VALUES ($1, 'unica', $2, 25, 'Explicación de prueba.', 'Retroalimentación general.')
       RETURNING *`,
      [bank.id, `Pregunta ${i + 1} de ${title}`],
    );
    const options = [];
    for (let j = 0; j < 4; j += 1) {
      const correct = j === 0;
      const { rows: [o] } = await t.db.query(
        `INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [q.id, `Opción ${j + 1}`, correct, correct ? 'Correcto.' : 'Revisa la clase.', j],
      );
      options.push(o);
    }
    await t.db.query(
      `INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
       VALUES ($1, $2, $3, 25)`,
      [assessment.id, q.id, i],
    );
    questions.push({
      id: q.id,
      correctOptionId: options.find((o) => o.is_correct).id,
      wrongOptionId: options.find((o) => !o.is_correct).id,
    });
  }
  return { assessment, questions };
}

async function seedActivity(title, weight = 20, allowFile = false) {
  const { rows: [activity] } = await t.db.query(
    `INSERT INTO aula_activities
       (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
        accepted_extensions, max_file_mb, max_points, is_required, status, weight, sort_order)
     VALUES ($1, $2, $3, '<p>Resuelve el caso.</p>', $4::jsonb, TRUE, FALSE, $6,
             ARRAY['pdf']::text[], 20, 100, TRUE, 'publicado', $5, 1)
     RETURNING *`,
    [course.id, moduleRow.id, title, JSON.stringify(RUBRIC_5), weight, allowFile],
  );
  return activity;
}

async function seedForum(title, weight) {
  const { rows: [forum] } = await t.db.query(
    `INSERT INTO aula_forums (course_id, module_id, scope, title, description, weight, rubric)
     VALUES ($1, $2, 'modulo', $3, 'Caso y preguntas del foro.', $4, $5::jsonb) RETURNING *`,
    [course.id, moduleRow.id, title, weight, JSON.stringify(RUBRIC_3)],
  );
  return forum;
}

beforeAll(async () => {
  t = await startTestApp();
  teacher = await seedUser(t.db, { email: 'docente@prueba.co', firstName: 'Docente', role: 'docente' });
  teacher2 = await seedUser(t.db, { email: 'docente2@prueba.co', firstName: 'Otro', role: 'docente' });
  admin = await seedUser(t.db, { email: 'admin@prueba.co', firstName: 'Admin', role: 'admin' });
  student1 = await seedUser(t.db, { email: 'estudiante1@prueba.co', firstName: 'Ana' });
  student2 = await seedUser(t.db, { email: 'estudiante2@prueba.co', firstName: 'Luis' });
  outsider = await seedUser(t.db, { email: 'fuera@prueba.co', firstName: 'Eva' });

  const { rows: [c] } = await t.db.query(
    `INSERT INTO aula_courses
       (kind, title, short_description, category, level, objective, audience, duration_minutes,
        author_name, modality, status, passing_score, max_attempts, sequential, video_completion_pct, grade_policy)
     VALUES ('edvanta', 'Curso de prueba pedagógica', 'Curso aislado de prueba.', 'Calidad', 'intermedio',
             'Probar el recorrido.', 'Prueba', 60, 'Edvanta', 'asincronica', 'publicado', 70, 2, FALSE, 90,
             '{"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}'::jsonb)
     RETURNING *`,
  );
  course = c;
  const { rows: [m] } = await t.db.query(
    "INSERT INTO aula_modules (course_id, title, sort_order) VALUES ($1, 'Unidad 1', 0) RETURNING *",
    [course.id],
  );
  moduleRow = m;
  const { rows: [l] } = await t.db.query(
    `INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule, min_seconds, duration_minutes, is_required)
     VALUES ($1, $2, 'Clase 1', 'Introducción', 0, 'manual', 0, 10, TRUE) RETURNING *`,
    [course.id, moduleRow.id],
  );
  lesson = l;
  const { rows: [b] } = await t.db.query(
    `INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
     VALUES ($1, 'texto', 0, '{"html":"<p>Contenido de prueba.</p>"}'::jsonb) RETURNING *`,
    [lesson.id],
  );
  block = b;
  const snapshot = {
    schema: 1,
    course: {
      id: course.id, title: course.title, shortDescription: course.short_description,
      descriptionHtml: '', coverFileId: null, objective: course.objective,
      learningOutcomes: [], audience: course.audience, prerequisites: '', durationMinutes: 60,
    },
    rules: { passingScore: 70, maxAttempts: 2, sequential: false, videoCompletionPct: 90 },
    modules: [{
      id: moduleRow.id, title: moduleRow.title, description: '',
      lessons: [{
        id: lesson.id, title: lesson.title, subtitle: lesson.subtitle, isRequired: true,
        completionRule: 'manual', minSeconds: 0, durationMinutes: 10,
        blocks: [{ id: block.id, type: 'texto', allowDownload: false, data: { html: '<p>Contenido de prueba.</p>' } }],
      }],
    }],
    files: {},
    totals: { modules: 1, lessons: 1, requiredLessons: 1, blocks: 1 },
  };
  const { rows: [version] } = await t.db.query(
    `INSERT INTO aula_course_versions (course_id, version_number, change_summary, snapshot)
     VALUES ($1, 1, 'Prueba', $2::jsonb) RETURNING *`,
    [course.id, JSON.stringify(snapshot)],
  );
  await t.db.query('UPDATE aula_courses SET current_version_id = $2 WHERE id = $1', [course.id, version.id]);
  for (const user of [student1, student2]) {
    await t.db.query(
      `INSERT INTO aula_enrollments (course_id, user_id, course_version_id, progress_status, first_access_at)
       VALUES ($1, $2, $3, 'en_progreso', NOW())`,
      [course.id, user.id, version.id],
    );
  }
  await t.db.query(
    "INSERT INTO aula_course_teachers (course_id, user_id, role) VALUES ($1, $2, 'docente')",
    [course.id, teacher.id],
  );

  quiz1 = await seedQuiz('Quiz 1');
  quiz2 = await seedQuiz('Quiz 2');
  quiz3 = await seedQuiz('Quiz 3');
  act1 = await seedActivity('Actividad 1', 20);
  act2 = await seedActivity('Actividad 2', 20);
  act3 = await seedActivity('Actividad 3', 20);
  actFile = await seedActivity('Actividad de archivo', 0, true);
  forum1 = await seedForum('Foro 1', 3.34);
  forum2 = await seedForum('Foro 2', 3.33);
  forum3 = await seedForum('Foro 3', 3.33);

  s1 = t.client();
  s2 = t.client();
  out = t.client();
  doc = t.client();
  doc2 = t.client();
  adminClient = t.client();
  await s1.login(student1.email, student1.password);
  await s2.login(student2.email, student2.password);
  await out.login(outsider.email, outsider.password);
  await doc.login(teacher.email, teacher.password);
  await doc2.login(teacher2.email, teacher2.password);
  await adminClient.login(admin.email, admin.password);
}, 120_000);

afterAll(async () => { await t?.close(); });

const startQuiz = async (client, quiz) => {
  const res = await client.post(`/me/courses/${course.id}/assessments/${quiz.assessment.id}/attempts`, {});
  expect(res.status).toBe(201);
  return res.data.attempt;
};

const answersFor = (quiz, correctCount) => quiz.questions.map((q, i) => ({
  questionId: q.id,
  optionId: i < correctCount ? q.correctOptionId : q.wrongOptionId,
}));

const submitQuiz = async (client, quiz, correctCount) => {
  await startQuiz(client, quiz);
  return client.post(
    `/me/courses/${course.id}/assessments/${quiz.assessment.id}/attempt/submit`,
    { answers: answersFor(quiz, correctCount) },
  );
};

const studentActivity = async (client, activity, text) => {
  const draft = await client.put(`/me/courses/${course.id}/activities/${activity.id}/draft`, { text: `${text} (borrador)` });
  expect(draft.status).toBe(200);
  const sent = await client.post(`/me/courses/${course.id}/activities/${activity.id}/submissions`, { text });
  expect(sent.status).toBe(201);
  return sent.data;
};

const reviewActivity = async (activity, submissionId, levelValues, score, decision = 'aprobada') => {
  const res = await doc.post(`/docente/submissions/${submissionId}/review`, {
    criteria: levelValues.map((level, i) => ({ id: `c${i + 1}`, level, comment: `Comentario ${i + 1}` })),
    feedback: `Retroalimentación de ${score}.`,
    decision,
    publish: true,
  });
  expect(res.status).toBe(200);
  expect(Math.round(res.data.review.score)).toBe(score);
  return res.data;
};

describe('recorrido pedagógico', () => {
  it('el estudiante ve la ruta, inicia un intento y no recibe claves', async () => {
    const overview = await s1.get(`/me/courses/${course.id}/pedagogy`);
    expect(overview.status).toBe(200);
    expect(overview.data.assessments).toHaveLength(3);
    expect(overview.data.activities).toHaveLength(4);
    expect(overview.data.forums).toHaveLength(3);
    expect(overview.data.grade.configured).toBe(true);
    expect(overview.data.grade.policy.configOk).toBe(true);

    const detail = await s1.get(`/me/courses/${course.id}/assessments/${quiz1.assessment.id}`);
    expect(detail.status).toBe(200);
    expect(detail.data.assessment.used).toBe(0);
    expect(detail.data.openAttempt).toBeNull();

    const started = await startQuiz(s1, quiz1);
    expect(started.questions).toHaveLength(4);
    expect(started.questions.every((q) => q.options.length === 4)).toBe(true);
    const raw = JSON.stringify(started);
    expect(raw).not.toContain('correctOptionId');
    expect(raw).not.toContain('isCorrect');
  });

  it('guarda, recarga, envía, califica y controla el doble envío', async () => {
    const attempt = await s1.get(`/me/courses/${course.id}/assessments/${quiz1.assessment.id}/attempt`);
    expect(attempt.status).toBe(200);
    const saved = await s1.put(`/me/courses/${course.id}/assessments/${quiz1.assessment.id}/attempt`, {
      answers: answersFor(quiz1, 2),
    });
    expect(saved.status).toBe(200);
    expect(saved.data.saved).toBe(4);

    const reloaded = await s1.get(`/me/courses/${course.id}/assessments/${quiz1.assessment.id}/attempt`);
    expect(Object.keys(reloaded.data.attempt.answers)).toHaveLength(4);

    const submitted = await s1.post(`/me/courses/${course.id}/assessments/${quiz1.assessment.id}/attempt/submit`, {
      answers: answersFor(quiz1, 4),
    });
    expect(submitted.status).toBe(201);
    expect(submitted.data.attempt.scorePct).toBe(100);
    expect(submitted.data.attempt.passed).toBe(true);
    expect(submitted.data.feedback).toHaveLength(4);
    expect(submitted.data.feedback[0].options.some((o) => o.isCorrect)).toBe(true);

    const duplicate = await s1.post(`/me/courses/${course.id}/assessments/${quiz1.assessment.id}/attempt/submit`, {
      answers: answersFor(quiz1, 4),
    });
    expect(duplicate.status).toBe(200);
    expect(duplicate.data.alreadySubmitted).toBe(true);
    const count = await t.db.query(
      'SELECT count(*)::int AS n FROM aula_attempts WHERE assessment_id = $1',
      [quiz1.assessment.id],
    );
    expect(count.rows[0].n).toBe(1);

    const second = await submitQuiz(s1, quiz1, 2);
    expect(second.status).toBe(201);
    expect(second.data.attempt.scorePct).toBe(50);
    expect(second.data.bestScore).toBe(100);

    const third = await s1.post(`/me/courses/${course.id}/assessments/${quiz1.assessment.id}/attempts`, {});
    expect(third.status).toBe(409);
  });

  it('rechaza intentos ajenos y usuarios sin matrícula', async () => {
    const attempts = await t.db.query(
      'SELECT id FROM aula_attempts WHERE assessment_id = $1 ORDER BY id LIMIT 1',
      [quiz1.assessment.id],
    );
    const other = await s2.get(`/me/courses/${course.id}/assessments/${quiz1.assessment.id}/attempts/${attempts.rows[0].id}`);
    expect(other.status).toBe(404);
    const outside = await out.get(`/me/courses/${course.id}/pedagogy`);
    expect(outside.status).toBe(404);
  });

  it('actividad: borrador, envío, revisión y consulta posterior', async () => {
    const draft = await s1.put(`/me/courses/${course.id}/activities/${act1.id}/draft`, { text: 'Borrador de Ana' });
    expect(draft.status).toBe(200);
    expect(draft.data.state.status).toBe('borrador');
    const withDraft = await s1.get(`/me/courses/${course.id}/activities/${act1.id}`);
    expect(withDraft.data.submission.draft.text).toBe('Borrador de Ana');

    const sent = await s1.post(`/me/courses/${course.id}/activities/${act1.id}/submissions`, {
      text: 'Entrega final de Ana',
    });
    expect(sent.status).toBe(201);
    expect(sent.data.state.status).toBe('pendiente_revision');
    expect(sent.data.submission.current_revision).toBe(1);

    const afterSend = await s1.get(`/me/courses/${course.id}/activities/${act1.id}`);
    expect(afterSend.data.submission.draft).toBeNull();
    expect(afterSend.data.submission.revisions).toHaveLength(1);

    const blockedDraft = await s1.put(`/me/courses/${course.id}/activities/${act1.id}/draft`, { text: 'Otra cosa' });
    expect(blockedDraft.status).toBe(409);

    const overview = await doc.get(`/docente/courses/${course.id}`);
    expect(overview.status).toBe(200);
    const pending = overview.data.submissions.find((x) => x.activityId === act1.id);
    expect(pending).toBeTruthy();
    const detail = await doc.get(`/docente/submissions/${pending.id}`);
    expect(detail.status).toBe(200);
    expect(detail.data.submission.revisions).toHaveLength(1);
    expect(detail.data.submission.student.name).toContain('Ana');

    const forbidden = await doc2.get(`/docente/courses/${course.id}`);
    expect(forbidden.status).toBe(403);
    const forbiddenReview = await doc2.post(`/docente/submissions/${pending.id}/review`, {
      criteria: levels(16), feedback: 'No autorizado', decision: 'aprobada', publish: true,
    });
    expect(forbiddenReview.status).toBe(403);

    await reviewActivity(act1, pending.id, [4, 3, 3, 3, 3], 80);
    const graded = await s1.get(`/me/courses/${course.id}/activities/${act1.id}`);
    expect(graded.status).toBe(200);
    expect(graded.data.state.status).toBe('calificado');
    expect(graded.data.state.score100).toBe(80);
    expect(graded.data.submission.feedback).toContain('80');

    const afterGrade = await s1.post(`/me/courses/${course.id}/activities/${act1.id}/submissions`, { text: 'Otra' });
    expect(afterGrade.status).toBe(409);
  });

  it('registra el cambio de una nota publicada sin ocultar el historial', async () => {
    const sub = (await t.db.query(
      `SELECT s.id FROM aula_submissions s
        JOIN aula_enrollments e ON e.id = s.enrollment_id
       WHERE s.activity_id = $1 AND e.course_id = $2 AND e.user_id = $3`,
      [act1.id, course.id, student1.id],
    )).rows[0];
    await reviewActivity(act1, sub.id, [4, 4, 4, 4, 2], 90);
    await reviewActivity(act1, sub.id, [4, 3, 3, 3, 3], 80);
    const changes = (await t.db.query(
      `SELECT old_value, new_value FROM aula_grade_changes
        WHERE target_type = 'entrega' AND target_id = $1 ORDER BY id`,
      [sub.id],
    )).rows;
    expect(changes.map((c) => [Number(c.old_value), Number(c.new_value)])).toEqual([[80, 90], [90, 80]]);
  });

  it('foro: publica, responde, persiste y el docente califica', async () => {
    const post = await s1.post(`/me/courses/${course.id}/forums/${forum1.id}/posts`, {
      title: 'Mi postura', bodyHtml: '<p>Argumento con evidencia.</p>',
    });
    expect(post.status).toBe(201);
    const reply = await s1.post(`/me/courses/${course.id}/forums/${forum1.id}/posts/${post.data.post.id}/replies`, {
      bodyHtml: '<p>Respuesta a mi propia intervención.</p>',
    });
    expect(reply.status).toBe(201);

    const forum = await s1.get(`/me/courses/${course.id}/forums/${forum1.id}`);
    expect(forum.status).toBe(200);
    expect(forum.data.posts).toHaveLength(2);
    expect(forum.data.posts.every((p) => p.isMine)).toBe(true);
    expect(forum.data.state.posts).toBe(2);

    const outside = await out.get(`/me/courses/${course.id}/forums/${forum1.id}`);
    expect(outside.status).toBe(404);

    const teacherForum = await doc.get(`/docente/forums/${forum1.id}`);
    expect(teacherForum.status).toBe(200);
    expect(teacherForum.data.posts).toHaveLength(2);

    const graded = await doc.post(`/docente/forums/${forum1.id}/grade`, {
      enrollmentId: (await t.db.query('SELECT id FROM aula_enrollments WHERE course_id = $1 AND user_id = $2', [course.id, student1.id])).rows[0].id,
      score: 80,
      feedback: 'Buen argumento.',
    });
    expect(graded.status).toBe(200);
    const after = await s1.get(`/me/courses/${course.id}/forums/${forum1.id}`);
    expect(after.data.state.score).toBe(80);
    expect(after.data.state.status).toBe('calificado');
  });

  it('permite adjuntar una entrega privada y bloquea descargas ajenas', async () => {
    const upload = await uploadFile(s1, {
      purpose: 'entrega', filename: 'entrega.pdf', bytes: pdfBytes(4000), extra: { activityId: actFile.id },
    });
    expect(upload.init.status).toBe(201);
    expect(upload.done.status).toBe(200);
    const fileId = upload.id;

    const sent = await s1.post(`/me/courses/${course.id}/activities/${actFile.id}/submissions`, { fileId });
    expect(sent.status).toBe(201);
    const detail = await s1.get(`/me/courses/${course.id}/activities/${actFile.id}`);
    expect(detail.data.submission.lastRevision.file_id).toBe(fileId);

    const teacher = await doc.get(`/docente/submissions/${detail.data.submission.id}`);
    expect(teacher.status).toBe(200);
    expect(teacher.data.submission.revisions[0].file_id).toBe(fileId);

    expect((await s1.raw('GET', `/files/${fileId}`)).status).toBe(200);
    expect((await doc.raw('GET', `/files/${fileId}`)).status).toBe(200);
    expect((await s2.raw('GET', `/files/${fileId}`)).status).toBe(404);
    expect((await out.raw('GET', `/files/${fileId}`)).status).toBe(404);

    const bad = await s1.post('/uploads', {
      purpose: 'entrega', filename: 'entrega.html', size: 20, activityId: actFile.id,
    });
    expect(bad.status).toBe(400);
  });

  it('calcula 78,5/100 con tres actividades, tres quizzes y tres foros', async () => {
    await submitQuiz(s1, quiz2, 3);
    await submitQuiz(s1, quiz3, 2);

    const act2Sent = await studentActivity(s1, act2, 'Entrega de la actividad 2');
    await reviewActivity(act2, act2Sent.submission.id, [4, 4, 4, 3, 3], 90);
    const act3Sent = await studentActivity(s1, act3, 'Entrega de la actividad 3');
    await reviewActivity(act3, act3Sent.submission.id, [3, 3, 3, 3, 2], 70);

    const enrollmentId = (await t.db.query(
      'SELECT id FROM aula_enrollments WHERE course_id = $1 AND user_id = $2',
      [course.id, student1.id],
    )).rows[0].id;
    for (const forum of [forum2, forum3]) {
      const post = await s1.post(`/me/courses/${course.id}/forums/${forum.id}/posts`, {
        title: 'Intervención', bodyHtml: '<p>Argumento de prueba.</p>',
      });
      expect(post.status).toBe(201);
      const graded = await doc.post(`/docente/forums/${forum.id}/grade`, {
        enrollmentId, score: 80, feedback: 'Cumple.',
      });
      expect(graded.status).toBe(200);
    }

    const opened = await s1.post(`/me/courses/${course.id}/lessons/${lesson.id}/open`, {});
    expect(opened.status).toBe(200);
    const completed = await s1.post(`/me/courses/${course.id}/lessons/${lesson.id}/complete`, {});
    expect(completed.status).toBe(200);

    const overview = await s1.get(`/me/courses/${course.id}/pedagogy`);
    expect(overview.status).toBe(200);
    expect(overview.data.grade.finalScore).toBe(78.5);
    expect(overview.data.grade.pending).toEqual([]);
    expect(overview.data.grade.approved).toBe(true);
    expect(overview.data.requirements.assessments).toEqual({ required: 3, submitted: 3, passed: 2 });
    expect(overview.data.requirements.activities).toEqual({ required: 3, submitted: 3, approved: 3 });
    expect(overview.data.requirements.forums).toEqual({ required: 3, participated: 3, graded: 3 });

    const enrollment = (await t.db.query(
      'SELECT final_score, progress_status, progress_pct, assessments_submitted, activities_submitted, forums_participated FROM aula_enrollments WHERE id = $1',
      [enrollmentId],
    )).rows[0];
    expect(Number(enrollment.final_score)).toBe(78.5);
    expect(enrollment.progress_status).toBe('completado');
    expect(Number(enrollment.progress_pct)).toBe(100);
    expect(enrollment.assessments_submitted).toBe(3);
    expect(enrollment.activities_submitted).toBe(3);
    expect(enrollment.forums_participated).toBe(3);
  });

  it('la administración crea docentes y asigna el curso sin abrir permisos globales', async () => {
    const created = await adminClient.post('/admin/users', {
      firstName: 'Nueva', lastName: 'Docente', email: 'nueva.docente@prueba.co', role: 'docente', sendInvite: false,
    });
    expect(created.status).toBe(201);
    expect(created.data.user.role).toBe('docente');

    const rejected = await adminClient.post(`/admin/courses/${course.id}/teachers`, {
      userId: student2.id, role: 'docente',
    });
    expect(rejected.status).toBe(400);

    const assigned = await adminClient.post(`/admin/courses/${course.id}/teachers`, {
      userId: teacher2.id, role: 'docente',
    });
    expect(assigned.status).toBe(201);
    const courses = await doc2.get('/docente/courses');
    expect(courses.status).toBe(200);
    expect(courses.data.some((c) => c.id === course.id)).toBe(true);
    expect((await doc2.get(`/docente/courses/${course.id}`)).status).toBe(200);

    expect((await s1.get('/docente/courses')).status).toBe(403);

    const removed = await adminClient.del(`/admin/courses/${course.id}/teachers/${teacher2.id}`);
    expect(removed.status).toBe(200);
    expect((await doc2.get(`/docente/courses/${course.id}`)).status).toBe(403);
  });

  it('clasifica usuarios para CRM y exporta segmentos', async () => {
    const list = await adminClient.get('/admin/crm/users');
    expect(list.status).toBe(200);
    const ana = list.data.items.find((u) => u.email === student1.email);
    expect(ana.crmCode).toMatch(/^EDV-U-\d{6}$/);
    const originalCode = ana.crmCode;

    const updated = await adminClient.patch(`/admin/users/${student1.id}`, {
      segmento: 'paciente', crmTags: ['tiroides', '2026'], crmSource: 'formulario', crmNotes: 'Seguimiento FST',
    });
    expect(updated.status).toBe(200);
    expect(updated.data.segmento).toBe('paciente');
    expect(updated.data.crmTags).toEqual(['tiroides', '2026']);

    const filtered = await adminClient.get('/admin/crm/users?segmento=paciente&tag=tiroides');
    expect(filtered.status).toBe(200);
    expect(filtered.data.items.some((u) => u.email === student1.email)).toBe(true);
    expect(filtered.data.items.some((u) => u.email === student2.email)).toBe(false);

    const csv = await adminClient.raw('GET', '/admin/crm/export');
    expect(csv.status).toBe(200);
    const text = await csv.text();
    expect(text).toContain('crm_code');
    expect(text).toContain(student1.email);

    const changed = await adminClient.patch(`/admin/users/${student1.id}`, { email: 'ana.nueva@prueba.co' });
    expect(changed.status).toBe(200);
    expect(changed.data.crmCode).toBe(originalCode);

    const created = await adminClient.post('/admin/users', {
      firstName: 'Nuevo', email: 'nuevo.crm@prueba.co', role: 'participant', sendInvite: false,
    });
    expect(created.status).toBe(201);
    expect(created.data.user.crmCode).toMatch(/^EDV-U-\d{6}$/);
  });
});


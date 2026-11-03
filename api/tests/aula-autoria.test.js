/**
 * Recorrido de aceptación del panel de autoría:
 * crear, guardar, publicar, usar como estudiante, revisar, calificar,
 * rectificar con motivo y comprobar el libro de calificaciones.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { pdfBytes, seedUser, startTestApp, uploadFile } from './helpers.js';

let t;
let admin;
let teacher;
let teacher2;
let student1;
let student2;
let outsider;
let a;
let doc;
let doc2;
let s1;
let s2;
let out;
let course;
let moduleRow;
let quiz;
let activity;
let forum;
let quizQuestions;

const rubric = (criteria) => ({
  version: 1,
  scale: '0-4',
  total: 100,
  criteria,
});

const activityRubric = rubric(Array.from({ length: 5 }, (_, i) => ({
  id: `c${i + 1}`,
  name: `Criterio ${i + 1}`,
  weight: 20,
  levels: [4, 3, 2, 1, 0].map((level) => ({
    level, label: String(level), description: `Descriptor ${level}`,
  })),
})));

const forumRubric = rubric([
  { id: 'pertinencia', name: 'Pertinencia', weight: 50, levels: [] },
  { id: 'evidencia', name: 'Evidencia', weight: 50, levels: [] },
]);

const quizPayload = {
  title: 'Quiz de la unidad',
  instructionsHtml: '<p>Responde las cuatro preguntas.</p>',
  isRequired: true,
  passingScore: 70,
  maxAttempts: 2,
  showAnswersAfterSubmit: true,
  weight: 30,
  questions: Array.from({ length: 4 }, (_, q) => ({
    promptHtml: `<p>Pregunta ${q + 1}</p>`,
    points: 25,
    explanation: `Explicación ${q + 1}`,
    generalFeedback: 'Revisa la clase.',
    options: ['A', 'B', 'C', 'D'].map((letter, o) => ({
      text: `Opción ${letter} de la pregunta ${q + 1}`,
      isCorrect: o === 0,
      feedback: o === 0 ? 'Correcto.' : 'Incorrecto.',
    })),
  })),
};

const activityPayload = {
  title: 'Actividad de la unidad',
  instructionsHtml: '<p>Resuelve el caso y entrega un informe.</p>',
  caseHtml: '<p>Caso ficticio de prueba.</p>',
  pointsToSolve: ['Identifica el problema', 'Propón una solución'],
  expectedProduct: 'Informe breve',
  extensionHint: '2 páginas',
  materials: [],
  allowText: true,
  allowLink: false,
  allowFile: false,
  acceptedExtensions: ['pdf'],
  maxFileMb: 20,
  maxPoints: 100,
  isRequired: true,
  weight: 60,
  gradingMethod: 'rubrica',
  rubric: activityRubric,
};

const forumPayload = {
  title: 'Foro de la unidad',
  purpose: 'Discutir el caso',
  description: '<p>Analiza el dilema del caso.</p>',
  centralQuestion: '¿Qué harías y por qué?',
  guidingQuestions: ['¿Qué evidencia usarías?'],
  participationHtml: '<p>Publica una intervención.</p>',
  rulesHtml: '<p>Respeta las ideas de los demás.</p>',
  allowAttachments: false,
  gradingMethod: 'directa',
  weight: 10,
  rubric: forumRubric,
};

beforeAll(async () => {
  t = await startTestApp();
  admin = await seedUser(t.db, { email: 'admin@prueba.co', firstName: 'Admin', role: 'admin' });
  teacher = await seedUser(t.db, { email: 'docente@prueba.co', firstName: 'Docente', role: 'docente' });
  teacher2 = await seedUser(t.db, { email: 'docente2@prueba.co', firstName: 'Otro', role: 'docente' });
  student1 = await seedUser(t.db, { email: 'ana@prueba.co', firstName: 'Ana' });
  student2 = await seedUser(t.db, { email: 'luis@prueba.co', firstName: 'Luis' });
  outsider = await seedUser(t.db, { email: 'fuera@prueba.co', firstName: 'Eva' });

  a = t.client();
  doc = t.client();
  doc2 = t.client();
  s1 = t.client();
  s2 = t.client();
  out = t.client();
  await a.login(admin.email, admin.password);
  await doc.login(teacher.email, teacher.password);
  await doc2.login(teacher2.email, teacher2.password);
  await s1.login(student1.email, student1.password);
  await s2.login(student2.email, student2.password);
  await out.login(outsider.email, outsider.password);

  course = (await a.post('/admin/courses', { title: 'Curso de autoría', kind: 'edvanta' })).data;
  moduleRow = (await a.post(`/admin/courses/${course.id}/modules`, { title: 'Unidad de prueba' })).data;
  const lesson = (await a.post(`/admin/modules/${moduleRow.id}/lessons`, { title: 'Clase de prueba' })).data;
  await a.post(`/admin/lessons/${lesson.id}/blocks`, { type: 'texto', data: { html: '<p>Contenido de la clase.</p>' } });
  await a.post(`/admin/courses/${course.id}/publish`, {});
  await a.post('/admin/assignments', { courseIds: [course.id], targetType: 'usuario', targetIds: [student1.id, student2.id] });
  await a.post(`/admin/courses/${course.id}/teachers`, { userId: teacher.id, role: 'docente' });
}, 120_000);

afterAll(async () => { await t?.close(); });

describe('panel de autoría y evaluación', () => {
  it('crea un quiz desde el panel, lo guarda en borrador, lo recarga y lo publica', async () => {
    const created = await a.post(`/admin/authoring/courses/${course.id}/quizzes`, { ...quizPayload, moduleId: moduleRow.id });
    expect(created.status).toBe(201);
    expect(created.data.quiz.status).toBe('borrador');
    expect(created.data.questions).toHaveLength(4);
    expect(created.data.questions[0].options).toHaveLength(4);

    const reloaded = await a.get(`/admin/authoring/quizzes/${created.data.quiz.id}`);
    expect(reloaded.status).toBe(200);
    expect(reloaded.data.quiz.title).toBe(quizPayload.title);
    expect(reloaded.data.questions[0].options[0].isCorrect).toBe(true);

    const preview = await a.get(`/admin/authoring/quizzes/${created.data.quiz.id}/preview`);
    expect(preview.status).toBe(200);
    expect(JSON.stringify(preview.data)).not.toContain('isCorrect');
    const attempts = await t.db.query("SELECT count(*)::int AS n FROM aula_attempts WHERE assessment_id = $1", [created.data.quiz.id]);
    expect(attempts.rows[0].n).toBe(0);

    const published = await a.post(`/admin/authoring/quizzes/${created.data.quiz.id}/publish`, {});
    expect(published.status).toBe(200);
    expect(published.data.status).toBe('publicado');
    quiz = published.data;
    quizQuestions = reloaded.data.questions;
  });

  it('rechaza publicar un quiz con opciones duplicadas y lo explica', async () => {
    const draft = (await a.post(`/admin/authoring/courses/${course.id}/quizzes`, {
      ...quizPayload,
      title: 'Quiz inválido',
      moduleId: moduleRow.id,
      questions: [{
        promptHtml: '<p>Pregunta</p>', points: 100,
        options: [
          { text: 'Repetida', isCorrect: true },
          { text: ' repetida ', isCorrect: false },
        ],
      }],
    })).data;
    const res = await a.post(`/admin/authoring/quizzes/${draft.quiz.id}/publish`, {});
    expect(res.status).toBe(400);
    expect(res.data.error.message).toContain('duplicadas');
    await a.post(`/admin/authoring/quizzes/${draft.quiz.id}/archive`, { reason: 'Prueba de validación' });
  });

  it('crea actividad y foro publicados, y configura 60/30/10', async () => {
    const act = await a.post(`/admin/authoring/courses/${course.id}/activities`, { ...activityPayload, moduleId: moduleRow.id });
    expect(act.status).toBe(201);
    const actPub = await a.post(`/admin/authoring/activities/${act.data.activity.id}/publish`, {});
    expect(actPub.status).toBe(200);
    activity = actPub.data.activity;

    const foro = await a.post(`/admin/authoring/courses/${course.id}/forums`, { ...forumPayload, moduleId: moduleRow.id });
    expect(foro.status).toBe(201);
    const foroPub = await a.post(`/admin/authoring/forums/${foro.data.forum.id}/publish`, {});
    expect(foroPub.status).toBe(200);
    forum = foroPub.data.forum;

    const config = await a.patch(`/admin/authoring/courses/${course.id}/academic-config`, {
      components: { activities: 60, quizzes: 30, forums: 10 },
      passingScore: 70,
      maxAttempts: 2,
    });
    expect(config.status).toBe(200);
    expect(config.data.configOk).toBe(true);
    expect(config.data.weightSums).toEqual({ activities: 60, quizzes: 30, forums: 10 });
  });

  it('muestra los recursos publicados en la unidad y no los borradores', async () => {
    const draft = await a.post(`/admin/authoring/courses/${course.id}/quizzes`, { ...quizPayload, title: 'Borrador oculto', moduleId: moduleRow.id });
    expect(draft.status).toBe(201);
    const studentCourse = await s1.get(`/me/courses/${course.id}`);
    expect(studentCourse.status).toBe(200);
    const resources = studentCourse.data.snapshot.modules[0].resources;
    expect(resources.map((r) => r.type).sort()).toEqual(['activity', 'forum', 'quiz']);
    expect(resources.some((r) => r.title === 'Borrador oculto')).toBe(false);

    const pedagogy = await s1.get(`/me/courses/${course.id}/pedagogy`);
    expect(pedagogy.status).toBe(200);
    expect(pedagogy.data.assessments).toHaveLength(1);
    expect(pedagogy.data.activities).toHaveLength(1);
    expect(pedagogy.data.forums).toHaveLength(1);
  });

  it('el estudiante responde el quiz y el servidor calcula 100 sin aceptar notas del navegador', async () => {
    const started = await s1.post(`/me/courses/${course.id}/assessments/${quiz.id}/attempts`, {});
    expect(started.status).toBe(201);
    expect(JSON.stringify(started.data)).not.toContain('isCorrect');
    const answers = quizQuestions.map((q) => ({ questionId: q.id, optionId: q.options[0].id }));
    const submitted = await s1.post(`/me/courses/${course.id}/assessments/${quiz.id}/attempt/submit`, { answers, scorePct: 0 });
    expect(submitted.status).toBe(201);
    expect(submitted.data.attempt.scorePct).toBe(100);
    expect(submitted.data.attempt.passed).toBe(true);
  });

  it('entrega la actividad y participa en el foro; recargar recupera lo guardado', async () => {
    const draft = await s1.put(`/me/courses/${course.id}/activities/${activity.id}/draft`, { text: 'Borrador de Ana' });
    expect(draft.status).toBe(200);
    const sent = await s1.post(`/me/courses/${course.id}/activities/${activity.id}/submissions`, { text: 'Informe final de Ana' });
    expect(sent.status).toBe(201);
    const reloaded = await s1.get(`/me/courses/${course.id}/activities/${activity.id}`);
    expect(reloaded.data.submission.lastRevision.text_body).toBe('Informe final de Ana');

    const post = await s1.post(`/me/courses/${course.id}/forums/${forum.id}/posts`, {
      title: 'Mi postura', bodyHtml: '<p>Argumento con evidencia.</p>',
    });
    expect(post.status).toBe(201);
    const forumView = await s1.get(`/me/courses/${course.id}/forums/${forum.id}`);
    expect(forumView.data.posts).toHaveLength(1);
    expect(forumView.data.posts[0].isMine).toBe(true);
  });

  it('el docente asignado revisa, publica 80 con rúbrica y el estudiante lo ve', async () => {
    const queue = await doc.get(`/docente/authoring/courses/${course.id}/review`);
    expect(queue.status).toBe(200);
    const pending = queue.data.items.find((i) => i.activityId === activity.id);
    expect(pending).toBeTruthy();

    const detail = await doc.get(`/docente/submissions/${pending.id}`);
    expect(detail.status).toBe(200);
    const reviewed = await doc.post(`/docente/submissions/${pending.id}/review`, {
      criteria: [4, 4, 4, 4, 0].map((level, i) => ({ id: `c${i + 1}`, level, comment: `Comentario ${i + 1}` })),
      feedback: 'Entrega clara con un criterio por mejorar.',
      decision: 'aprobada',
      publish: true,
    });
    expect(reviewed.status).toBe(200);
    expect(reviewed.data.review.score).toBe(80);

    const studentActivity = await s1.get(`/me/courses/${course.id}/activities/${activity.id}`);
    expect(studentActivity.data.state.grade).toBeUndefined();
    expect(studentActivity.data.state.score100).toBe(80);
    expect(studentActivity.data.submission.feedback).toContain('Entrega clara');

    const enrollmentId = (await t.db.query(
      'SELECT id FROM aula_enrollments WHERE course_id = $1 AND user_id = $2',
      [course.id, student1.id],
    )).rows[0].id;
    const forumGrade = await doc.post(`/docente/forums/${forum.id}/grade`, {
      enrollmentId, score: 50, feedback: 'Aporta evidencia suficiente.',
    });
    expect(forumGrade.status).toBe(200);

    const pedagogy = await s1.get(`/me/courses/${course.id}/pedagogy`);
    expect(pedagogy.data.grade.finalScore).toBe(83);
    expect(pedagogy.data.grade.provisional).toBe(false);
    expect(pedagogy.data.grade.approved).toBe(true);
  });

  it('rectifica la nota a 20 con motivo, conserva historial y recalcula 47', async () => {
    const submission = (await t.db.query(
      `SELECT s.id FROM aula_submissions s
        JOIN aula_enrollments e ON e.id = s.enrollment_id
       WHERE s.activity_id = $1 AND e.user_id = $2`,
      [activity.id, student1.id],
    )).rows[0];
    const changed = await doc.post(`/docente/submissions/${submission.id}/review`, {
      score: 20,
      feedback: 'La entrega no sostiene la recomendación.',
      changeReason: 'Se encontró evidencia insuficiente en la revisión cruzada.',
      decision: 'no_aprobada',
      publish: true,
    });
    expect(changed.status).toBe(200);
    expect(changed.data.review.score).toBe(20);
    const history = await t.db.query(
      `SELECT old_value, new_value, reason FROM aula_grade_changes
        WHERE target_type = 'entrega' AND target_id = $1 ORDER BY id DESC LIMIT 1`,
      [submission.id],
    );
    expect(Number(history.rows[0].old_value)).toBe(80);
    expect(Number(history.rows[0].new_value)).toBe(20);
    expect(history.rows[0].reason).toContain('evidencia insuficiente');

    const pedagogy = await s1.get(`/me/courses/${course.id}/pedagogy`);
    expect(pedagogy.data.grade.finalScore).toBe(47);
    expect(pedagogy.data.grade.approved).toBe(false);
  });

  it('el libro de calificaciones muestra notas y «sin calificar» de forma distinta', async () => {
    const book = await doc.get(`/docente/authoring/courses/${course.id}/gradebook`);
    expect(book.status).toBe(200);
    const ana = book.data.items.find((i) => i.email === student1.email);
    expect(ana.activities[0].score).toBe(20);
    expect(ana.quizzes[0].score).toBe(100);
    expect(ana.forums[0].score).toBe(50);
    const luis = book.data.items.find((i) => i.email === student2.email);
    expect(luis.activities[0].score).toBeNull();
    expect(luis.finalScore).toBeNull();
    expect(luis.provisional).toBe(true);

    const post = await s2.post(`/me/courses/${course.id}/forums/${forum.id}/posts`, {
      title: 'Intervención de Luis', bodyHtml: '<p>Una postura distinta.</p>',
    });
    expect(post.status).toBe(201);
    const enrollment2 = (await t.db.query(
      'SELECT id FROM aula_enrollments WHERE course_id = $1 AND user_id = $2',
      [course.id, student2.id],
    )).rows[0].id;
    const zero = await doc.post(`/docente/forums/${forum.id}/grade`, {
      enrollmentId: enrollment2, score: 0, feedback: 'No cumple los criterios mínimos.',
    });
    expect(zero.status).toBe(200);
    const refreshed = await doc.get(`/docente/authoring/courses/${course.id}/gradebook`);
    const luisZero = refreshed.data.items.find((i) => i.email === student2.email);
    expect(luisZero.forums[0].score).toBe(0);
    expect(luisZero.activities[0].score).toBeNull();
    expect(luisZero.finalScore).toBeNull();
  });

  it('permite adjuntar un material privado a la actividad y lo sirve solo al curso', async () => {
    const upload = await uploadFile(doc, {
      purpose: 'recurso', filename: 'guia-actividad.pdf', bytes: pdfBytes(1500), extra: { courseId: course.id },
    });
    expect(upload.init.status).toBe(201);
    expect(upload.done.status).toBe(200);
    const updated = await doc.patch(`/docente/authoring/activities/${activity.id}`, {
      materials: [{ name: 'Guía de la actividad', fileId: upload.id }],
    });
    expect(updated.status).toBe(200);
    expect(updated.data.activity.materials[0].fileId).toBe(upload.id);

    const studentView = await s1.get(`/me/courses/${course.id}/activities/${activity.id}`);
    expect(studentView.data.activity.materials[0].name).toBe('Guía de la actividad');
    expect((await s1.raw('GET', `/files/${upload.id}`)).status).toBe(200);
    expect((await out.raw('GET', `/files/${upload.id}`)).status).toBe(404);
  });
  it('duplicar un quiz crea un borrador sin copiar intentos', async () => {
    const copy = await a.post(`/admin/authoring/quizzes/${quiz.id}/duplicate`, {});
    expect(copy.status).toBe(201);
    expect(copy.data.quiz.status).toBe('borrador');
    expect(copy.data.quiz.title).toContain('copia');
    const attempts = await t.db.query('SELECT count(*)::int AS n FROM aula_attempts WHERE assessment_id = $1', [copy.data.quiz.id]);
    expect(attempts.rows[0].n).toBe(0);
    await a.post(`/admin/authoring/quizzes/${copy.data.quiz.id}/archive`, { reason: 'Copia de prueba' });
  });

  it('archivar un foro lo retira del aula sin borrar sus mensajes', async () => {
    const archived = await doc.post(`/docente/authoring/forums/${forum.id}/archive`, { reason: 'Cierre del periodo' });
    expect(archived.status).toBe(200);
    expect((await s1.get(`/me/courses/${course.id}/forums/${forum.id}`)).status).toBe(404);
    const posts = await t.db.query('SELECT count(*)::int AS n FROM aula_forum_posts WHERE forum_id = $1', [forum.id]);
    expect(posts.rows[0].n).toBe(2);
  });

  it('respeta permisos de docente sin asignación, estudiante y usuario sin matrícula', async () => {
    expect((await doc2.get(`/docente/authoring/courses/${course.id}`)).status).toBe(403);
    expect((await doc2.get(`/docente/authoring/courses/${course.id}/gradebook`)).status).toBe(403);
    expect((await s1.get(`/admin/authoring/courses/${course.id}`)).status).toBe(403);
    expect((await out.get(`/me/courses/${course.id}/pedagogy`)).status).toBe(404);
    expect((await s2.get(`/me/courses/${course.id}/forums/${forum.id}`)).status).toBe(404);
  });

  it('limita a cinco las actividades obligatorias sin contar quizzes ni foros', async () => {
    for (let i = 1; i <= 4; i += 1) {
      const created = await a.post(`/admin/authoring/courses/${course.id}/activities`, {
        title: `Actividad obligatoria extra ${i}`,
        moduleId: moduleRow.id,
        instructionsHtml: '<p>Consigna de prueba.</p>',
        allowText: true,
        allowFile: false,
        allowLink: false,
        isRequired: true,
        weight: 0,
        maxPoints: 100,
        gradingMethod: 'directa',
      });
      expect(created.status).toBe(201);
      expect((await a.post(`/admin/authoring/activities/${created.data.activity.id}/publish`, {})).status).toBe(200);
    }
    const sixth = await a.post(`/admin/authoring/courses/${course.id}/activities`, {
      title: 'Actividad obligatoria seis',
      moduleId: moduleRow.id,
      instructionsHtml: '<p>Consigna de prueba.</p>',
      allowText: true,
      allowFile: false,
      allowLink: false,
      isRequired: true,
      weight: 0,
      maxPoints: 100,
      gradingMethod: 'directa',
    });
    expect(sixth.status).toBe(201);
    const blocked = await a.post(`/admin/authoring/activities/${sixth.data.activity.id}/publish`, {});
    expect(blocked.status).toBe(409);
    expect(blocked.data.error.message).toContain('5 actividades obligatorias');
  });
  it('mantiene la versión servida si el quiz se edita durante un intento', async () => {
    const created = await a.post(`/admin/authoring/courses/${course.id}/quizzes`, {
      title: 'Quiz de versión servida',
      moduleId: moduleRow.id,
      weight: 0,
      maxAttempts: 1,
      questions: [1, 2].map((n) => ({
        promptHtml: `<p>Original ${n}</p>`,
        points: 50,
        options: ['A', 'B', 'C', 'D'].map((letter, i) => ({
          text: `Original ${n}${letter}`, isCorrect: i === 0,
        })),
      })),
    });
    expect(created.status).toBe(201);
    const published = await a.post(`/admin/authoring/quizzes/${created.data.quiz.id}/publish`, {});
    expect(published.status).toBe(200);
    const started = await s2.post(`/me/courses/${course.id}/assessments/${created.data.quiz.id}/attempts`, {});
    expect(started.status).toBe(201);
    const oldQuestions = started.data.attempt.questions;

    const edited = await a.patch(`/admin/authoring/quizzes/${created.data.quiz.id}`, {
      questions: [1, 2].map((n) => ({
        promptHtml: `<p>Editada ${n}</p>`,
        points: 50,
        options: ['A', 'B', 'C', 'D'].map((letter, i) => ({
          text: `Editada ${n}${letter}`, isCorrect: i === 0,
        })),
      })),
    });
    expect(edited.status).toBe(200);

    const submitted = await s2.post(`/me/courses/${course.id}/assessments/${created.data.quiz.id}/attempt/submit`, {
      answers: oldQuestions.map((q) => ({ questionId: q.id, optionId: q.options[0].id })),
    });
    expect(submitted.status).toBe(201);
    expect(submitted.data.attempt.scorePct).toBe(100);
    expect(JSON.stringify(submitted.data.attempt.questions)).toContain('Original');
  });
  it('permite rectificar una nota automática solo con motivo y deja historial', async () => {
    const attempt = (await t.db.query(
      `SELECT at.id FROM aula_attempts at
         JOIN aula_enrollments e ON e.id = at.enrollment_id
        WHERE at.assessment_id = $1 AND e.user_id = $2 AND at.status <> 'en_curso'
        ORDER BY at.id LIMIT 1`,
      [quiz.id, student1.id],
    )).rows[0];
    const res = await doc.post(`/docente/authoring/attempts/${attempt.id}/override`, {
      score: 90,
      reason: 'Revisión extraordinaria de la clave por error de transcripción.',
    });
    expect(res.status).toBe(200);
    expect(Number(res.data.attempt.score_pct)).toBe(90);
    const history = await t.db.query(
      `SELECT old_value, new_value, reason FROM aula_grade_changes
        WHERE target_type = 'intento' AND target_id = $1 ORDER BY id DESC LIMIT 1`,
      [attempt.id],
    );
    expect(Number(history.rows[0].old_value)).toBe(100);
    expect(Number(history.rows[0].new_value)).toBe(90);
    expect(history.rows[0].reason).toContain('transcripción');
  });
});

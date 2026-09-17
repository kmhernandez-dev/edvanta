import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { pdfBytes, seedUser, startTestApp, uploadFile } from './helpers.js';

/** Un MP4 mínimo: basta la firma «ftyp» para que el aula lo acepte. */
const mp4Bytes = (size = 2000) => {
  const head = Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from('ftypisom', 'latin1')]);
  return Buffer.concat([head, Buffer.alloc(size - head.length, 0)]);
};

describe('aula · avance del participante', () => {
  let t;
  let a;
  let p;
  let participant;
  let course;
  let lessons;
  let videoBlockId;
  const base = new Date('2026-10-01T14:00:00Z');
  const at = (seconds) => { t.clock.current = new Date(base.getTime() + seconds * 1000); };

  beforeAll(async () => {
    t = await startTestApp();
    at(0);
    const admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);
    const company = (await a.post('/admin/companies', { name: 'Pharmarket' })).data;
    course = (await a.post('/admin/courses', {
      title: 'Producto en orden', kind: 'empresa', companyId: company.id, sequential: true, videoCompletionPct: 90,
    })).data;
    const m = (await a.post(`/admin/courses/${course.id}/modules`, { title: 'Único' })).data;
    const mk = async (body) => (await a.post(`/admin/modules/${m.id}/lessons`, body)).data;
    lessons = {
      lectura: await mk({ title: 'Lectura', minSeconds: 120 }),
      video: await mk({ title: 'Video', completionRule: 'video' }),
      opcional: await mk({ title: 'Opcional', isRequired: false }),
      cierre: await mk({ title: 'Cierre' }),
    };
    const pdf = await uploadFile(a, { purpose: 'contenido', filename: 'lectura.pdf', bytes: pdfBytes(1500) });
    await a.post(`/admin/lessons/${lessons.lectura.id}/blocks`, { type: 'pdf', data: { fileId: pdf.id } });
    const mp4 = await uploadFile(a, { purpose: 'contenido', filename: 'video.mp4', bytes: mp4Bytes() });
    videoBlockId = (await a.post(`/admin/lessons/${lessons.video.id}/blocks`, { type: 'video', data: { source: 'archivo', fileId: mp4.id } })).data.block.id;
    for (const l of [lessons.opcional, lessons.cierre]) {
      await a.post(`/admin/lessons/${l.id}/blocks`, { type: 'texto', data: { html: `<p>${l.title}</p>` } });
    }
    await a.post(`/admin/courses/${course.id}/publish`, {});
    participant = await seedUser(t.db, { email: 'ana@pharmarket.co', companyId: company.id });
    await a.post('/admin/assignments', { courseIds: [course.id], targetType: 'usuario', targetIds: [participant.id] });
    p = t.client();
    await p.login(participant.email, participant.password);
  });
  afterAll(async () => { await t.close(); });

  const path = (lesson, action) => `/me/courses/${course.id}/lessons/${lesson.id}/${action}`;

  it('muestra el curso con clases bloqueadas en orden y la clase para empezar', async () => {
    const res = await p.get(`/me/courses/${course.id}`);
    expect(res.status).toBe(200);
    const { lessonStates: s, resumeLessonId, enrollment, snapshot } = res.data;
    expect(s[lessons.lectura.id].status).toBe('pendiente');
    expect(s[lessons.video.id]).toMatchObject({ status: 'bloqueado', reason: 'Completa «Lectura» para continuar.' });
    expect(s[lessons.opcional.id].status).toBe('bloqueado');
    expect(resumeLessonId).toBe(lessons.lectura.id);
    expect(enrollment).toMatchObject({ status: 'no_iniciado', lessons: { done: 0, required: 3 } });
    expect(snapshot.fingerprint).toBeUndefined();

    const blocked = await p.post(path(lessons.video, 'open'), {});
    expect(blocked.status).toBe(403);
    expect(blocked.data.error.code).toBe('clase_bloqueada');

    // Quien no tiene el curso no sabe que existe; el administrador usa la vista previa.
    expect((await a.get(`/me/courses/${course.id}`)).status).toBe(404);
  });

  it('una lectura exige tiempo real antes de completarse', async () => {
    const opened = await p.post(path(lessons.lectura, 'open'), {});
    expect(opened.data.lesson.status).toBe('en_progreso');
    expect(opened.data.enrollment.status).toBe('en_progreso');

    const early = await p.post(path(lessons.lectura, 'complete'), {});
    expect(early.status).toBe(409);
    expect(early.data.error).toMatchObject({ code: 'tiempo_minimo', remainingSeconds: 120 });

    // Un reporte de 60 s tras 20 s reales solo suma 25 s.
    at(20);
    expect((await p.post(path(lessons.lectura, 'time'), { seconds: 60 })).data.added).toBe(25);
    at(90);
    expect((await p.post(path(lessons.lectura, 'time'), { seconds: 60 })).data.added).toBe(60);
    at(160);
    const enough = await p.post(path(lessons.lectura, 'time'), { seconds: 60 });
    expect(enough.data.activeSeconds).toBe(145);

    at(170);
    const done = await p.post(path(lessons.lectura, 'complete'), {});
    expect(done.status).toBe(200);
    expect(done.data.lesson.status).toBe('completado');
    expect(done.data.enrollment.lessons).toMatchObject({ done: 1, required: 3 });
    expect(done.data.lessonStates[lessons.video.id].status).toBe('pendiente');
    expect(done.data.lessonStates[lessons.cierre.id].status).toBe('bloqueado');
  });

  it('un video se completa al verlo, sin poder adelantar el avance', async () => {
    at(180);
    await p.post(path(lessons.video, 'open'), {});
    const manual = await p.post(path(lessons.video, 'complete'), {});
    expect(manual.status).toBe(400);

    // Dice haber visto 10 minutos a los 10 segundos: solo cuentan 40 s.
    at(190);
    const jump = await p.post(path(lessons.video, 'video'), { blockId: videoBlockId, duration: 600, position: 600, segments: [[0, 600]] });
    expect(jump.data.video.pct).toBeCloseTo(6.67, 1);
    expect(jump.data.completed).toBe(false);

    const foreign = await p.post(path(lessons.video, 'video'), { blockId: 999999, duration: 600, segments: [[0, 5]] });
    expect(foreign.status).toBe(400);

    // Cinco minutos después, lo visto sí alcanza.
    at(490);
    const partial = await p.post(path(lessons.video, 'video'), { blockId: videoBlockId, duration: 600, position: 500, segments: [[40, 500]] });
    expect(partial.data.video.pct).toBeCloseTo(83.33, 1);
    expect(partial.data.completed).toBe(false);

    at(560);
    const finished = await p.post(path(lessons.video, 'video'), { blockId: videoBlockId, duration: 600, position: 600, segments: [[500, 590]] });
    expect(finished.data.video.pct).toBeCloseTo(98.33, 1);
    expect(finished.data.completed).toBe(true);
    expect(finished.data.lessonStates[lessons.cierre.id].status).toBe('pendiente');
    expect(finished.data.lessonStates[lessons.opcional.id].status).toBe('pendiente');

    // Los reportes de video no recortan el tiempo activo de la clase.
    at(565);
    expect((await p.post(path(lessons.video, 'time'), { seconds: 30 })).data.added).toBe(30);

    const course1 = (await p.get(`/me/courses/${course.id}`)).data;
    expect(course1.videoProgress[lessons.video.id][videoBlockId]).toMatchObject({ pct: 98.33, position: 600 });
  });

  it('completa el curso con las obligatorias, aunque falte la opcional', async () => {
    at(600);
    await p.post(path(lessons.cierre, 'open'), {});
    const done = await p.post(path(lessons.cierre, 'complete'), {});
    expect(done.data.enrollment).toMatchObject({ status: 'completado', progressPct: 100, lessons: { done: 3, required: 3, pct: 100 } });
    expect(done.data.enrollment.completedAt).toBeTruthy();

    // Repetir la acción no cambia nada.
    const again = await p.post(path(lessons.cierre, 'complete'), {});
    expect(again.data.alreadyCompleted).toBe(true);

    const list = (await p.get('/me/courses')).data;
    expect(list[0]).toMatchObject({ status: 'completado', progressPct: 100 });

    const resume = (await p.get(`/me/courses/${course.id}`)).data.resumeLessonId;
    expect(resume).toBe(lessons.opcional.id);
  });

  it('respeta el cierre del curso y las fechas de acceso', async () => {
    await a.patch(`/admin/courses/${course.id}`, { availableUntil: '2026-09-30' });
    const closed = await p.get(`/me/courses/${course.id}`);
    expect(closed.status).toBe(403);
    expect(closed.data.error.code).toBe('curso_cerrado');
    expect((await p.post(path(lessons.opcional, 'open'), {})).status).toBe(403);
    await a.patch(`/admin/courses/${course.id}`, { availableUntil: null });
    expect((await p.get(`/me/courses/${course.id}`)).status).toBe(200);
  });
});

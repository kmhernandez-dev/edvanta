import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { recomputeEnrollment } from '../lib/aula/progress.js';
import { parseSlidesUrl, parseVideoUrl } from '../lib/aula/blocks.js';
import { sanitizeRichText } from '../lib/aula/richtext.js';
import { pdfBytes, pngBytes, seedUser, startTestApp, uploadFile } from './helpers.js';

const text = (html) => ({ type: 'texto', data: { html } });

describe('aula · texto enriquecido y enlaces', () => {
  it('limpia el HTML y deja solo lo permitido', () => {
    const dirty = '<h1 onclick="x()">Título</h1><p>Hola <b>equipo</b><script>robar()</script>'
      + '<a href="javascript:alert(1)">malo</a> <a href="https://edvanta.co">bueno</a></p>'
      + '<iframe src="https://x.co"></iframe><img src=x onerror=alert(1)>';
    const clean = sanitizeRichText(dirty);
    expect(clean).toBe('<h2>Título</h2><p>Hola <strong>equipo</strong>malo '
      + '<a href="https://edvanta.co" target="_blank" rel="noopener noreferrer nofollow">bueno</a></p>');
    expect(sanitizeRichText('<p> &nbsp; </p><p><br></p>')).toBe('');
  });

  it('reconoce videos y presentaciones de proveedores permitidos', () => {
    expect(parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10')).toEqual({ provider: 'youtube', videoId: 'dQw4w9WgXcQ' });
    expect(parseVideoUrl('https://youtu.be/dQw4w9WgXcQ')).toEqual({ provider: 'youtube', videoId: 'dQw4w9WgXcQ' });
    expect(parseVideoUrl('https://vimeo.com/123456789/abcdef1234')).toEqual({ provider: 'vimeo', videoId: '123456789', hash: 'abcdef1234' });
    expect(parseVideoUrl('https://evil.com/watch?v=dQw4w9WgXcQ')).toBeNull();
    expect(parseVideoUrl('javascript:alert(1)')).toBeNull();
    expect(parseSlidesUrl('https://docs.google.com/presentation/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit#slide=id.p')?.embedUrl)
      .toBe('https://docs.google.com/presentation/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/embed?start=false&loop=false');
    expect(parseSlidesUrl('https://www.canva.com/design/DAF1234567/abcdefgh12/view?utm_content=x')?.embedUrl)
      .toBe('https://www.canva.com/design/DAF1234567/abcdefgh12/view?embed');
    expect(parseSlidesUrl('http://docs.google.com/presentation/d/1AbCdEfGhIjKlMnOpQrStUvWxYz/edit')).toBeNull();
  });
});

describe('aula · cursos, contenido y versiones', () => {
  let t;
  let a;
  let admin;
  let company;
  let other;

  beforeAll(async () => {
    t = await startTestApp();
    admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);
    company = (await a.post('/admin/companies', { name: 'Pharmarket' })).data;
    other = (await a.post('/admin/companies', { name: 'Laboratorio Norte' })).data;
  });
  afterAll(async () => { await t.close(); });

  async function participant(email, companyId = company.id) {
    const u = await seedUser(t.db, { email, companyId });
    const c = t.client();
    await c.login(u.email, u.password);
    return { user: u, client: c };
  }

  it('crea cursos propios y privados con validación', async () => {
    const noCompany = await a.post('/admin/courses', { title: 'Privado sin empresa', kind: 'empresa' });
    expect(noCompany.data.error).toMatchObject({ field: 'companyId' });

    const own = await a.post('/admin/courses', { title: 'Fundamentos de asuntos regulatorios', kind: 'edvanta' });
    expect(own.status).toBe(201);
    expect(own.data).toMatchObject({ status: 'borrador', kind: 'edvanta', companyId: null, passingScore: 70 });

    const priv = await a.post('/admin/courses', {
      title: 'Capacitación de producto', kind: 'empresa', companyId: company.id,
      learningOutcomes: ['Explicar el producto', ' explicar el producto ', ''], tags: ['Comercial'],
      availableFrom: '2026-10-15', availableUntil: '2026-10-01',
    });
    expect(priv.data.error).toMatchObject({ field: 'availableUntil' });

    const ok = await a.post('/admin/courses', {
      title: 'Capacitación de producto', kind: 'empresa', companyId: company.id,
      learningOutcomes: ['Explicar el producto', ' explicar el producto ', ''], tags: ['Comercial'],
      descriptionHtml: '<p>Para el <em>equipo</em> comercial</p><script>x()</script>',
      availableFrom: '2026-10-15', availableUntil: '2026-12-15',
    });
    expect(ok.status).toBe(201);
    expect(ok.data.learningOutcomes).toEqual(['Explicar el producto']);
    expect(ok.data.descriptionHtml).toBe('<p>Para el <em>equipo</em> comercial</p>');
    // Días en hora de Colombia: abre a las 00:00 y cierra a las 23:59:59.
    expect(new Date(ok.data.availableFrom).toISOString()).toBe('2026-10-15T05:00:00.000Z');
    expect(new Date(ok.data.availableUntil).toISOString()).toBe('2026-12-16T04:59:59.999Z');
    expect(ok.data).toMatchObject({ availableFromDay: '2026-10-15', availableUntilDay: '2026-12-15' });

    const list = await a.get('/admin/courses?kind=empresa');
    expect(list.data.items.map((c) => c.title)).toEqual(['Capacitación de producto']);
    expect(list.data.items[0]).toMatchObject({ companyName: 'Pharmarket', modules: 0, enrollments: 0 });

    const badCover = await a.patch(`/admin/courses/${own.data.id}`, { coverFileId: 999999 });
    expect(badCover.data.error.field).toBe('coverFileId');
    const cover = await uploadFile(a, { purpose: 'portada', filename: 'portada.png', bytes: pngBytes(500) });
    const withCover = await a.patch(`/admin/courses/${own.data.id}`, { coverFileId: cover.id, passingScore: 80 });
    expect(withCover.data).toMatchObject({ coverFileId: cover.id, passingScore: 80 });
  });

  it('arma la estructura: módulos, clases, bloques, orden, copias y movimientos', async () => {
    const course = (await a.post('/admin/courses', { title: 'Estructura', kind: 'edvanta' })).data;
    const m1 = (await a.post(`/admin/courses/${course.id}/modules`, { title: 'Módulo 1' })).data;
    const m2 = (await a.post(`/admin/courses/${course.id}/modules`, { title: 'Módulo 2' })).data;
    const m0 = (await a.post(`/admin/courses/${course.id}/modules`, { title: 'Bienvenida' })).data;
    await a.put(`/admin/courses/${course.id}/modules/order`, { ids: [m0.id, m1.id, m2.id] });

    const stale = await a.put(`/admin/courses/${course.id}/modules/order`, { ids: [m0.id, m1.id] });
    expect(stale.status).toBe(409);
    expect(stale.data.error.code).toBe('orden_desactualizado');

    const l1 = (await a.post(`/admin/modules/${m1.id}/lessons`, { title: 'Clase A' })).data;
    const l2 = (await a.post(`/admin/modules/${m1.id}/lessons`, { title: 'Clase B', isRequired: false })).data;
    expect(l1).toMatchObject({ isRequired: true, completionRule: 'manual', minSeconds: 0 });

    const t1 = await a.post(`/admin/lessons/${l1.id}/blocks`, text('<p>Primero</p>'));
    expect(t1.status).toBe(201);
    const top = await a.post(`/admin/lessons/${l1.id}/blocks`, { type: 'encabezado', data: { text: 'Arriba', level: 2 }, position: 'inicio' });
    const empty = await a.post(`/admin/lessons/${l1.id}/blocks`, text('<p> </p>'));
    expect(empty.data.error).toMatchObject({ field: 'html' });
    const quiz = await a.post(`/admin/lessons/${l1.id}/blocks`, { type: 'quiz', data: {} });
    expect(quiz.data.error.message).toMatch(/todavía no están disponibles/);
    const badVideo = await a.post(`/admin/lessons/${l1.id}/blocks`, { type: 'video', data: { source: 'enlace', url: 'https://evil.com/v' } });
    expect(badVideo.data.error).toMatchObject({ field: 'url' });
    const video = await a.post(`/admin/lessons/${l1.id}/blocks`, {
      type: 'video', data: { source: 'enlace', url: 'https://youtu.be/dQw4w9WgXcQ', title: 'Presentación' },
    });
    expect(video.data.block.data).toMatchObject({ provider: 'youtube', videoId: 'dQw4w9WgXcQ' });

    const lesson = (await a.get(`/admin/lessons/${l1.id}`)).data;
    expect(lesson.blocks.map((b) => b.type)).toEqual(['encabezado', 'texto', 'video']);
    expect(lesson.next).toMatchObject({ id: l2.id });
    expect(lesson.blockTypes.map((b) => b.type)).not.toContain('quiz');

    // Imagen: exige texto alternativo y el formato correcto.
    const pdf = await uploadFile(a, { purpose: 'contenido', filename: 'guia.pdf', bytes: pdfBytes(3000) });
    const png = await uploadFile(a, { purpose: 'contenido', filename: 'mapa.png', bytes: pngBytes(400) });
    const noAlt = await a.post(`/admin/lessons/${l2.id}/blocks`, { type: 'imagen', data: { fileId: png.id } });
    expect(noAlt.data.error).toMatchObject({ field: 'alt' });
    const wrongKind = await a.post(`/admin/lessons/${l2.id}/blocks`, { type: 'imagen', data: { fileId: pdf.id, alt: 'x' } });
    expect(wrongKind.data.error.message).toMatch(/formato PDF no sirve/);
    const image = await a.post(`/admin/lessons/${l2.id}/blocks`, { type: 'imagen', data: { fileId: png.id, alt: 'Mapa de zonas' } });
    expect(image.status).toBe(201);
    expect(image.data.files[png.id]).toMatchObject({ name: 'mapa.png', extension: 'png' });

    const edited = await a.patch(`/admin/blocks/${t1.data.block.id}`, { data: { html: '<p>Editado</p>' } });
    expect(edited.data.block.data.html).toBe('<p>Editado</p>');

    const copy = await a.post(`/admin/blocks/${t1.data.block.id}/duplicate`, {});
    const order = (await a.get(`/admin/lessons/${l1.id}`)).data.blocks.map((b) => b.id);
    expect(order).toEqual([top.data.block.id, t1.data.block.id, copy.data.block.id, video.data.block.id]);
    await a.put(`/admin/lessons/${l1.id}/blocks/order`, { ids: [...order].reverse() });
    expect((await a.get(`/admin/lessons/${l1.id}`)).data.blocks[0].type).toBe('video');

    const lessonCopy = (await a.post(`/admin/lessons/${l1.id}/duplicate`, {})).data;
    expect(lessonCopy.title).toBe('Clase A (copia)');
    expect((await a.get(`/admin/lessons/${lessonCopy.id}`)).data.blocks).toHaveLength(4);

    const moved = await a.post(`/admin/lessons/${l2.id}/move`, { moduleId: m2.id, position: 0 });
    expect(moved.data.moduleId).toBe(m2.id);

    const moduleCopy = (await a.post(`/admin/modules/${m1.id}/duplicate`, {})).data;
    const outline = (await a.get(`/admin/courses/${course.id}`)).data.outline;
    expect(outline.map((m) => m.title)).toEqual(['Bienvenida', 'Módulo 1', 'Módulo 1 (copia)', 'Módulo 2']);
    expect(outline.find((m) => m.id === moduleCopy.id).lessons.map((l) => l.title)).toEqual(['Clase A', 'Clase A (copia)']);
    expect(outline.find((m) => m.id === m2.id).lessons[0]).toMatchObject({ title: 'Clase B', blockCount: 1, blockTypes: ['imagen'] });
  });

  it('publica versiones, mueve inscripciones con criterio y protege los archivos', async () => {
    const course = (await a.post('/admin/courses', { title: 'Producto X', kind: 'empresa', companyId: company.id })).data;
    const group = (await a.post('/admin/groups', { name: 'Equipo comercial', companyId: company.id })).data;
    const ana = await participant('ana@pharmarket.co');
    const beto = await participant('beto@pharmarket.co');
    const caro = await participant('caro@pharmarket.co');
    await a.post(`/admin/groups/${group.id}/members`, { userIds: [ana.user.id, beto.user.id, caro.user.id] });

    // Asignar antes de publicar: las personas lo ven como «sin publicar».
    const assigned = await a.post('/admin/assignments', { courseIds: [course.id], targetType: 'grupo', targetIds: [group.id], dueAt: '2027-01-31' });
    expect(assigned.data.created).toBe(3);
    const mine = (await ana.client.get('/me/courses')).data[0];
    expect(mine).toMatchObject({ open: false });
    expect(new Date(mine.dueAt).toISOString()).toBe('2027-02-01T04:59:59.999Z');

    // Vacío: no se puede publicar.
    const empty = await a.get(`/admin/courses/${course.id}/publish`);
    expect(empty.data.canPublish).toBe(false);
    expect(empty.data.errors.map((e) => e.code)).toContain('sin_modulos');
    expect((await a.post(`/admin/courses/${course.id}/publish`, {})).data.error.code).toBe('curso_incompleto');

    const m = (await a.post(`/admin/courses/${course.id}/modules`, { title: 'Producto' })).data;
    const l1 = (await a.post(`/admin/modules/${m.id}/lessons`, { title: 'Indicaciones aprobadas' })).data;
    const l2 = (await a.post(`/admin/modules/${m.id}/lessons`, { title: 'Presentación comercial', completionRule: 'video' })).data;
    const pdf = await uploadFile(a, { purpose: 'contenido', filename: 'ficha.pdf', bytes: pdfBytes(2500) });
    await a.post(`/admin/lessons/${l1.id}/blocks`, { type: 'pdf', data: { fileId: pdf.id, title: 'Ficha técnica' }, allowDownload: false });
    const check = await a.get(`/admin/courses/${course.id}/publish`);
    expect(check.data.errors.map((e) => e.code)).toEqual(['clase_vacia', 'clase_sin_video']);

    await a.post(`/admin/lessons/${l2.id}/blocks`, { type: 'video', data: { source: 'enlace', url: 'https://vimeo.com/123456789' } });
    const ready = await a.get(`/admin/courses/${course.id}/publish`);
    expect(ready.data).toMatchObject({ canPublish: true, nextVersion: 1, impact: { total: 3, automatic: 3 } });
    expect(ready.data.warnings.map((w) => w.code)).toEqual(expect.arrayContaining(['video_sin_transcripcion', 'sin_portada']));

    // Antes de publicar, el participante no puede abrir el archivo.
    expect((await ana.client.raw('GET', `/files/${pdf.id}`)).status).toBe(404);

    t.mails.length = 0;
    const v1 = await a.post(`/admin/courses/${course.id}/publish`, {});
    expect(v1.status).toBe(201);
    expect(v1.data).toMatchObject({ version: { number: 1 }, moved: 3, reassigned: 0 });
    const opened = (await ana.client.get('/me/courses')).data[0];
    expect(opened).toMatchObject({ open: true, lessons: { done: 0, required: 2 } });
    const notes = await t.db.query("SELECT count(*)::int AS n FROM aula_notifications WHERE type = 'curso_disponible'");
    expect(notes.rows[0].n).toBe(3);

    // Archivo visible pero no descargable (el bloque no lo permite).
    const meta = await ana.client.get(`/files/${pdf.id}/meta`);
    expect(meta.status).toBe(200);
    expect(meta.data).toMatchObject({ name: 'ficha.pdf', canDownload: false });
    expect((await ana.client.raw('GET', `/files/${pdf.id}?download=1`)).status).toBe(403);

    // Sin cambios no hay versión nueva.
    expect((await a.post(`/admin/courses/${course.id}/publish`, {})).status).toBe(409);

    // Ana avanza y Beto completa; Caro no entra.
    const e = Object.fromEntries((await t.db.query(
      'SELECT user_id, id FROM aula_enrollments WHERE course_id = $1', [course.id],
    )).rows.map((r) => [r.user_id, r.id]));
    await t.db.query(
      `INSERT INTO aula_lesson_progress (enrollment_id, lesson_id, status, completed_at) VALUES
         ($1, $3, 'completado', now()), ($2, $3, 'completado', now()), ($2, $4, 'completado', now())`,
      [e[ana.user.id], e[beto.user.id], l1.id, l2.id],
    );
    await t.db.query('UPDATE aula_enrollments SET first_access_at = now() WHERE id = ANY($1::bigint[])', [[e[ana.user.id], e[beto.user.id]]]);
    for (const id of Object.values(e)) await recomputeEnrollment(t.db, id);
    expect((await beto.client.get('/me/courses')).data[0]).toMatchObject({ status: 'completado', progressPct: 100 });
    expect((await ana.client.get('/me/courses')).data[0]).toMatchObject({ status: 'en_progreso', progressPct: 50 });

    // Cambio de contenido: nueva clase obligatoria y nota mínima distinta.
    await a.patch(`/admin/courses/${course.id}`, { passingScore: 85 });
    const l3 = (await a.post(`/admin/modules/${m.id}/lessons`, { title: 'Preguntas frecuentes' })).data;
    await a.post(`/admin/lessons/${l3.id}/blocks`, text('<p>Respuestas del área médica.</p>'));
    const editor = (await a.get(`/admin/courses/${course.id}`)).data;
    expect(editor).toMatchObject({ hasUnpublishedChanges: true, version: { number: 1 } });
    const diff = (await a.get(`/admin/courses/${course.id}/publish`)).data;
    expect(diff.diff).toMatchObject({ lessonsAdded: 1, lessonsChanged: 0, requiredAdded: 1 });
    expect(diff.diff.rules).toEqual([{ key: 'passingScore', label: 'Nota mínima', before: '70 %', after: '85 %' }]);
    expect(diff.impact).toMatchObject({ automatic: 1, inProgress: 1, completed: 1 });

    expect((await a.post(`/admin/courses/${course.id}/publish`, {})).data.error.field).toBe('changeSummary');

    // Versión 2 normal: solo Caro (sin empezar) pasa sola.
    const v2 = await a.post(`/admin/courses/${course.id}/publish`, { changeSummary: 'Nueva clase de preguntas frecuentes.' });
    expect(v2.data).toMatchObject({ version: { number: 2 }, moved: 1, reassigned: 0 });
    const versions = Object.fromEntries((await t.db.query(
      `SELECT e.user_id, v.version_number FROM aula_enrollments e JOIN aula_course_versions v ON v.id = e.course_version_id WHERE e.course_id = $1`,
      [course.id],
    )).rows.map((r) => [r.user_id, r.version_number]));
    expect(versions).toEqual({ [ana.user.id]: 1, [beto.user.id]: 1, [caro.user.id]: 2 });
    expect((await ana.client.get('/me/courses')).data[0].lessons).toEqual({ done: 1, required: 2 });

    // Versión 3 obligatoria: Ana pasa; Beto (completado) conserva su versión.
    await a.patch(`/admin/lessons/${l3.id}`, { title: 'Preguntas frecuentes (actualizadas)' });
    const v3 = await a.post(`/admin/courses/${course.id}/publish`, { changeSummary: 'Actualización de preguntas.', mandatory: true });
    expect(v3.data).toMatchObject({ version: { number: 3 }, reassigned: 1, reopened: 0 });
    expect((await ana.client.get('/me/courses')).data[0]).toMatchObject({ status: 'en_progreso', lessons: { done: 1, required: 3 } });
    expect((await beto.client.get('/me/courses')).data[0]).toMatchObject({ status: 'completado', lessons: { done: 2, required: 2 } });
    const mandatoryNote = await t.db.query(
      "SELECT user_id FROM aula_notifications WHERE type = 'actualizacion_obligatoria'",
    );
    expect(mandatoryNote.rows.map((r) => r.user_id)).toEqual([ana.user.id]);

    // Versión 4 obligatoria reabriendo completados: Beto vuelve a estar en curso.
    await a.patch(`/admin/lessons/${l3.id}`, { subtitle: 'Incluye cambios de etiqueta' });
    const v4 = await a.post(`/admin/courses/${course.id}/publish`, {
      changeSummary: 'Cambio de etiqueta del producto.', mandatory: true, reopenCompleted: true,
    });
    expect(v4.data).toMatchObject({ reopened: 1 });
    expect((await beto.client.get('/me/courses')).data[0]).toMatchObject({ status: 'en_progreso', progressPct: 66.67 });

    const history = (await a.get(`/admin/courses/${course.id}/versions`)).data;
    expect(history.map((v) => [v.number, v.mandatory])).toEqual([[4, true], [3, true], [2, false], [1, false]]);
    const snap = (await a.get(`/admin/courses/${course.id}/versions/${history[3].id}`)).data;
    expect(snap.snapshot.rules.passingScore).toBe(70);
    expect(snap.snapshot.modules[0].lessons.map((l) => l.title)).toEqual(['Indicaciones aprobadas', 'Presentación comercial']);

    // Las versiones publicadas no se pueden alterar.
    await expect(t.db.query("UPDATE aula_course_versions SET change_summary = 'x' WHERE id = $1", [history[0].id])).rejects.toThrow();

    const log = (await a.get('/admin/audit?action=inscripcion.actualizacion')).data.items;
    expect(log).toHaveLength(2);

    // Eliminar una clase con avance avisa del impacto y conserva el historial.
    const impact = (await a.get(`/admin/lessons/${l1.id}/impact`)).data;
    expect(impact).toMatchObject({ started: 2, completed: 2, published: true });
    await a.del(`/admin/lessons/${l1.id}`);
    const kept = await t.db.query('SELECT count(*)::int AS n FROM aula_lesson_progress WHERE lesson_id = $1', [l1.id]);
    expect(kept.rows[0].n).toBe(2);

    // Un curso publicado no se elimina: se archiva.
    expect((await a.del(`/admin/courses/${course.id}`)).status).toBe(409);
    const archived = await a.post(`/admin/courses/${course.id}/status`, { status: 'archivado' });
    expect(archived.data.status).toBe('archivado');
    expect((await ana.client.get('/me/courses')).data[0]).toMatchObject({ open: false });
    expect((await a.post(`/admin/modules/${m.id}/lessons`, { title: 'No' })).status).toBe(409);
    const restored = await a.post(`/admin/courses/${course.id}/status`, { status: 'restaurar' });
    expect(restored.data.status).toBe('publicado');

    // Participantes y asignaciones del curso.
    const people = (await a.get(`/admin/courses/${course.id}/enrollments?sort=name&dir=asc`)).data;
    expect(people.items.map((p) => [p.email, p.versionNumber])).toEqual([
      ['ana@pharmarket.co', 4], ['beto@pharmarket.co', 4], ['caro@pharmarket.co', 4],
    ]);
    const assignments = (await a.get(`/admin/courses/${course.id}/assignments`)).data;
    expect(assignments).toEqual([expect.objectContaining({ targetType: 'grupo', targetLabel: 'Equipo comercial', enrollments: 3 })]);
  });

  it('duplica un curso para otra empresa sin tocar el original', async () => {
    const src = (await a.post('/admin/courses', { title: 'Base', kind: 'empresa', companyId: company.id })).data;
    const m = (await a.post(`/admin/courses/${src.id}/modules`, { title: 'Único' })).data;
    const l = (await a.post(`/admin/modules/${m.id}/lessons`, { title: 'Clase' })).data;
    await a.post(`/admin/lessons/${l.id}/blocks`, text('<p>Contenido</p>'));
    const file = await uploadFile(a, { purpose: 'recurso', filename: 'formato.pdf', bytes: pdfBytes(1200) });
    await a.post(`/admin/courses/${src.id}/resources`, { title: 'Formato de visita', fileId: file.id });

    const copy = await a.post(`/admin/courses/${src.id}/duplicate`, { kind: 'empresa', companyId: other.id, title: 'Base para Norte' });
    expect(copy.status).toBe(201);
    expect(copy.data).toMatchObject({ title: 'Base para Norte', companyId: other.id, status: 'borrador' });
    const detail = (await a.get(`/admin/courses/${copy.data.id}`)).data;
    expect(detail.outline[0].lessons[0]).toMatchObject({ title: 'Clase', blockCount: 1 });
    const res = (await a.get(`/admin/courses/${copy.data.id}/resources`)).data;
    expect(res.resources.map((r) => [r.title, r.status, r.current.number])).toEqual([['Formato de visita', 'borrador', 1]]);

    // Un borrador sin participantes sí se puede eliminar.
    expect((await a.del(`/admin/courses/${copy.data.id}`)).status).toBe(200);
    expect((await a.get(`/admin/courses/${copy.data.id}`)).status).toBe(404);
    expect((await a.get(`/admin/courses/${src.id}`)).data.outline).toHaveLength(1);

    // No se cambia la empresa de un curso con participantes.
    const u = await participant('dora@pharmarket.co');
    await a.post('/admin/assignments', { courseIds: [src.id], targetType: 'usuario', targetIds: [u.user.id] });
    const change = await a.patch(`/admin/courses/${src.id}`, { companyId: other.id });
    expect(change.status).toBe(409);
  });

  it('gestiona recursos con versiones y solo muestra la vigente', async () => {
    const course = (await a.post('/admin/courses', { title: 'Con recursos', kind: 'edvanta', resourcesEnabled: true })).data;
    const m = (await a.post(`/admin/courses/${course.id}/modules`, { title: 'M' })).data;
    const l = (await a.post(`/admin/modules/${m.id}/lessons`, { title: 'L' })).data;
    await a.post(`/admin/lessons/${l.id}/blocks`, text('<p>Hola</p>'));
    await a.post(`/admin/courses/${course.id}/publish`, {});
    const eva = await participant('eva@correo.co', null);
    await a.post('/admin/assignments', { courseIds: [course.id], targetType: 'usuario', targetIds: [eva.user.id] });
    // Asignada después de publicar: ya sabe cuántas clases le exige su versión.
    expect((await eva.client.get('/me/courses')).data[0]).toMatchObject({ open: true, lessons: { done: 0, required: 1 } });

    const cat =(await a.post(`/admin/courses/${course.id}/resource-categories`, { name: 'Formatos' })).data;
    expect((await a.post(`/admin/courses/${course.id}/resource-categories`, { name: ' formatos ' })).status).toBe(409);

    const both = await a.post(`/admin/courses/${course.id}/resources`, { title: 'X', fileId: 1, url: 'https://a.co' });
    expect(both.status).toBe(400);
    const wrongPurpose = await uploadFile(a, { purpose: 'contenido', filename: 'no.pdf', bytes: pdfBytes(900) });
    expect((await a.post(`/admin/courses/${course.id}/resources`, { title: 'X', fileId: wrongPurpose.id })).data.error.field).toBe('fileId');

    const v1file = await uploadFile(a, { purpose: 'recurso', filename: 'guia-v1.pdf', bytes: pdfBytes(1500) });
    const created = (await a.post(`/admin/courses/${course.id}/resources`, {
      title: 'Guía de visita', categoryId: cat.id, fileId: v1file.id, allowDownload: true,
    })).data;
    expect(created).toMatchObject({ status: 'borrador', categoryName: 'Formatos', current: { number: 1 } });

    // En borrador no se ve.
    expect((await eva.client.get(`/files/${v1file.id}/meta`)).status).toBe(404);
    await a.post(`/admin/resources/${created.id}/status`, { status: 'publicado' });
    expect((await eva.client.get(`/files/${v1file.id}/meta`)).data).toMatchObject({ name: 'guia-v1.pdf', canDownload: true });

    // Reemplazar exige nota y deja la anterior en el historial.
    const v2file = await uploadFile(a, { purpose: 'recurso', filename: 'guia-v2.pdf', bytes: pdfBytes(1600) });
    expect((await a.post(`/admin/resources/${created.id}/versions`, { fileId: v2file.id })).data.error.field).toBe('notes');
    const replaced = await a.post(`/admin/resources/${created.id}/versions`, { fileId: v2file.id, notes: 'Se actualizó la tabla de dosis aprobadas.', notify: true });
    expect(replaced.data).toMatchObject({ notified: 1, resource: { current: { number: 2 } } });
    expect((await eva.client.get(`/files/${v1file.id}/meta`)).status).toBe(404);
    expect((await eva.client.get(`/files/${v2file.id}/meta`)).status).toBe(200);
    const history = (await a.get(`/admin/resources/${created.id}/versions`)).data;
    expect(history.map((v) => [v.number, v.current])).toEqual([[2, true], [1, false]]);

    // Un recurso publicado no se elimina sin archivarlo.
    expect((await a.del(`/admin/resources/${created.id}`)).status).toBe(409);
    await a.post(`/admin/resources/${created.id}/status`, { status: 'archivado' });
    expect((await eva.client.get(`/files/${v2file.id}/meta`)).status).toBe(404);
    expect((await a.del(`/admin/resources/${created.id}`)).status).toBe(200);

    // Eliminar la categoría deja los recursos sin categoría.
    const link = (await a.post(`/admin/courses/${course.id}/resources`, { title: 'Portal', url: 'https://edvanta.co', categoryId: cat.id })).data;
    expect(link.current).toMatchObject({ url: 'https://edvanta.co/', fileId: null });
    expect((await a.del(`/admin/resource-categories/${cat.id}`)).data.uncategorized).toBe(2);
  });

  it('las rutas de cursos son solo para administradores', async () => {
    const p = await participant('fede@pharmarket.co');
    expect((await p.client.get('/admin/courses')).status).toBe(403);
    expect((await p.client.post('/admin/courses', { title: 'x' })).status).toBe(403);
    expect((await t.client().get('/admin/courses')).status).toBe(401);
  });
});

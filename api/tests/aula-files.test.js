import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { closedReason } from '../lib/aula/access.js';
import { checkUpload, matchesSignature, parseRange } from '../lib/aula/storage.js';
import { pdfBytes, pngBytes, seedUser, startTestApp, uploadFile } from './helpers.js';

describe('aula · archivos', () => {
  let t;
  let admin;
  let adminClient;

  beforeAll(async () => {
    t = await startTestApp();
    admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    adminClient = t.client();
    await adminClient.login(admin.email, admin.password);
  });
  afterAll(async () => { await t.close(); });

  it('sube un PDF por partes y lo sirve completo y por rangos', async () => {
    const bytes = pdfBytes(5000);
    const up = await uploadFile(adminClient, { purpose: 'contenido', filename: 'Guía de visita.pdf', bytes, partSize: 1500 });
    expect(up.done.status).toBe(200);
    expect(up.done.data).toMatchObject({ status: 'listo', size: 5000, receivedBytes: 5000 });

    const full = await adminClient.raw('GET', `/files/${up.id}`);
    expect(full.status).toBe(200);
    expect(full.headers.get('content-type')).toBe('application/pdf');
    expect(full.headers.get('x-content-type-options')).toBe('nosniff');
    expect(full.headers.get('content-disposition')).toMatch(/^inline;/);
    expect(Buffer.from(await full.arrayBuffer()).equals(bytes)).toBe(true);

    const part = await adminClient.raw('GET', `/files/${up.id}`, { headers: { Range: 'bytes=100-199' } });
    expect(part.status).toBe(206);
    expect(part.headers.get('content-range')).toBe('bytes 100-199/5000');
    expect(Buffer.from(await part.arrayBuffer()).equals(bytes.subarray(100, 200))).toBe(true);

    const bad = await adminClient.raw('GET', `/files/${up.id}`, { headers: { Range: 'bytes=9000-' } });
    expect(bad.status).toBe(416);

    const download = await adminClient.raw('GET', `/files/${up.id}?download=1`);
    expect(download.headers.get('content-disposition')).toMatch(/^attachment;.*filename\*=UTF-8''Gu%C3%ADa%20de%20visita\.pdf/);
  });

  it('rechaza un archivo cuyo contenido no corresponde a su extensión', async () => {
    const up = await uploadFile(adminClient, { purpose: 'contenido', filename: 'falso.pdf', bytes: pngBytes(300) });
    expect(up.failed.status).toBe(400);
    expect(up.failed.data.error.code).toBe('archivo_invalido');
    const status = await adminClient.get(`/uploads/${up.init.data.id}`);
    expect(status.data.status).toBe('fallido');
  });

  it('rechaza formatos no permitidos y archivos demasiado grandes', async () => {
    const exe = await adminClient.post('/uploads', { purpose: 'contenido', filename: 'programa.exe', size: 100 });
    expect(exe.status).toBe(400);
    expect(exe.data.error.code).toBe('formato_no_permitido');

    const huge = await adminClient.post('/uploads', { purpose: 'logo', filename: 'logo.png', size: 6 * 1024 * 1024 });
    expect(huge.status).toBe(400);
    expect(huge.data.error.code).toBe('archivo_muy_grande');
    expect(huge.data.error.message).toMatch(/máximo para este tipo es 5\.0 MB/);
  });

  it('pide retomar desde la última parte cuando la posición no coincide', async () => {
    const bytes = pdfBytes(3000);
    const init = await adminClient.post('/uploads', { purpose: 'recurso', filename: 'ficha.pdf', size: bytes.length });
    await adminClient.put(`/uploads/${init.data.id}/chunk`, bytes.subarray(0, 1000), { headers: { 'X-Chunk-Offset': '0' } });
    const skipped = await adminClient.put(`/uploads/${init.data.id}/chunk`, bytes.subarray(2000), { headers: { 'X-Chunk-Offset': '2000' } });
    expect(skipped.status).toBe(409);
    expect(skipped.data.error.expectedOffset).toBe(1000);

    const early = await adminClient.post(`/uploads/${init.data.id}/complete`, {});
    expect(early.data.error.code).toBe('subida_incompleta');

    await adminClient.put(`/uploads/${init.data.id}/chunk`, bytes.subarray(1000), { headers: { 'X-Chunk-Offset': '1000' } });
    const done = await adminClient.post(`/uploads/${init.data.id}/complete`, {});
    expect(done.data.status).toBe('listo');
    const served = await adminClient.raw('GET', `/files/${init.data.id}`);
    expect(Buffer.from(await served.arrayBuffer()).equals(bytes)).toBe(true);
  });

  it('un participante solo ve archivos de la versión que cursa, y descarga solo si está permitido', async () => {
    const up = await uploadFile(adminClient, { purpose: 'contenido', filename: 'monografia.pdf', bytes: pdfBytes(2000) });
    const ivan = await seedUser(t.db, { email: 'ivan@pharmarket.co' });
    const c = t.client();
    await c.login(ivan.email, ivan.password);

    // Sin inscripción: el archivo "no existe" para él.
    expect((await c.get(`/files/${up.id}/meta`)).status).toBe(404);

    const { rows: [company] } = await t.db.query("INSERT INTO aula_companies (name) VALUES ('Pharmarket') RETURNING id");
    const { rows: [course] } = await t.db.query(
      "INSERT INTO aula_courses (kind, company_id, title, status) VALUES ('empresa', $1, 'Producto', 'publicado') RETURNING id",
      [company.id],
    );
    const { rows: [version] } = await t.db.query(
      "INSERT INTO aula_course_versions (course_id, version_number, snapshot) VALUES ($1, 1, '{}') RETURNING id",
      [course.id],
    );
    await t.db.query('UPDATE aula_courses SET current_version_id = $1 WHERE id = $2', [version.id, course.id]);
    await t.db.query('INSERT INTO aula_version_files (course_version_id, file_id, downloadable) VALUES ($1, $2, false)', [version.id, up.id]);

    // Inscrito en otra versión: tampoco.
    const { rows: [enrollment] } = await t.db.query(
      'INSERT INTO aula_enrollments (course_id, user_id) VALUES ($1, $2) RETURNING id',
      [course.id, ivan.id],
    );
    expect((await c.get(`/files/${up.id}/meta`)).status).toBe(404);

    await t.db.query('UPDATE aula_enrollments SET course_version_id = $1 WHERE id = $2', [version.id, enrollment.id]);
    const meta = await c.get(`/files/${up.id}/meta`);
    expect(meta.status).toBe(200);
    expect(meta.data.canDownload).toBe(false);
    expect((await c.raw('GET', `/files/${up.id}`)).status).toBe(200);
    const blocked = await c.get(`/files/${up.id}?download=1`);
    expect(blocked.status).toBe(403);

    await t.db.query('UPDATE aula_version_files SET downloadable = true WHERE file_id = $1', [up.id]);
    expect((await c.raw('GET', `/files/${up.id}?download=1`)).status).toBe(200);

    // Retirado: pierde el acceso.
    await t.db.query('UPDATE aula_enrollments SET withdrawn_at = NOW() WHERE id = $1', [enrollment.id]);
    expect((await c.get(`/files/${up.id}/meta`)).status).toBe(404);
  });

  it('un participante no puede subir contenido del curso ni leer entregas ajenas', async () => {
    const julia = await seedUser(t.db, { email: 'julia@pharmarket.co' });
    const c = t.client();
    await c.login(julia.email, julia.password);
    const res = await c.post('/uploads', { purpose: 'contenido', filename: 'x.pdf', size: 100 });
    expect(res.status).toBe(400);
    expect(res.data.error.field).toBe('purpose');

    const { rows: [foreign] } = await t.db.query(
      `INSERT INTO aula_files (storage_key, original_name, mime_type, extension, size_bytes, purpose, status, uploaded_by)
       VALUES ('2026/01/ajeno.pdf', 'ajeno.pdf', 'application/pdf', 'pdf', 10, 'entrega', 'listo', $1) RETURNING id`,
      [admin.id],
    );
    expect((await c.get(`/files/${foreign.id}/meta`)).status).toBe(404);
  });

  it('sin sesión no hay archivos', async () => {
    expect((await t.client().get('/files/1')).status).toBe(401);
    expect((await t.client().post('/uploads', { purpose: 'contenido', filename: 'a.pdf', size: 1 })).status).toBe(401);
  });
});

describe('aula · reglas de almacenamiento y disponibilidad', () => {
  it('reconoce firmas de formato', () => {
    expect(matchesSignature(pdfBytes(20), 'pdf')).toBe(true);
    expect(matchesSignature(pngBytes(20), 'png')).toBe(true);
    expect(matchesSignature(pngBytes(20), 'pdf')).toBe(false);
    expect(matchesSignature(Buffer.from([0, 0, 0, 24, 0x66, 0x74, 0x79, 0x70, 0x69]), 'ftyp')).toBe(true);
    expect(matchesSignature(Buffer.from('nombre;correo\nAna;ana@x.co'), 'text')).toBe(true);
  });

  it('combina los límites del propósito y de la actividad', () => {
    expect(() => checkUpload({ purpose: 'entrega', filename: 'a.mp4', size: 10 })).toThrow(/Formatos aceptados/);
    expect(() => checkUpload({ purpose: 'entrega', filename: 'a.pdf', size: 30 * 1024 * 1024, limits: { maxMb: 20 } }))
      .toThrow(/máximo para este tipo es 20 MB/);
    expect(checkUpload({ purpose: 'contenido', filename: 'Clase 1.MP4', size: 500 * 1024 * 1024 }))
      .toMatchObject({ extension: 'mp4', kind: 'video' });
  });

  it('interpreta rangos de bytes', () => {
    expect(parseRange(undefined, 100)).toBeNull();
    expect(parseRange('bytes=0-9', 100)).toEqual({ start: 0, end: 9 });
    expect(parseRange('bytes=90-', 100)).toEqual({ start: 90, end: 99 });
    expect(parseRange('bytes=-10', 100)).toEqual({ start: 90, end: 99 });
    expect(parseRange('bytes=50-500', 100)).toEqual({ start: 50, end: 99 });
    expect(parseRange('bytes=100-', 100)).toBe('invalid');
    expect(parseRange('items=0-1', 100)).toBe('invalid');
  });

  it('explica por qué un curso no está abierto', () => {
    const now = new Date('2026-10-10T12:00:00Z');
    const base = { course_status: 'publicado', current_version_id: 1, course_version_id: 1 };
    expect(closedReason(base, now)).toBeNull();
    expect(closedReason({ ...base, course_status: 'archivado' }, now).code).toBe('curso_no_disponible');
    expect(closedReason({ ...base, course_version_id: null }, now).code).toBe('curso_sin_publicar');
    // Las fechas se muestran en hora de Colombia: 00:00 UTC del 1/11 aún es 31/10 en Bogotá.
    expect(closedReason({ ...base, available_from: '2026-11-01T00:00:00Z' }, now).message).toMatch(/31 de octubre/);
    expect(closedReason({ ...base, available_from: '2026-11-01T15:00:00Z' }, now).message).toMatch(/1 de noviembre/);
    expect(closedReason({ ...base, starts_at: '2026-10-20T00:00:00Z' }, now).code).toBe('acceso_proximamente');
    expect(closedReason({ ...base, available_until: '2026-10-01T00:00:00Z' }, now).code).toBe('curso_cerrado');
  });
});

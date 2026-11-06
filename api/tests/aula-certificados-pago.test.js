/**
 * Certificados con costo (COP 60.000 en los cursos propios).
 *
 * Lo que no puede fallar:
 *  - el precio lo pone el servidor, nunca el navegador;
 *  - sin pago aprobado no se emite el certificado de un curso con precio;
 *  - el webhook aprueba por referencia (o por los datos del pago);
 *  - un segundo pago del mismo certificado no se aprueba dos veces;
 *  - la administración puede registrar un pago hecho por otro medio;
 *  - una matrícula asignada por una institución no paga;
 *  - el curso para pacientes y los de empresa siguen sin costo.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';
import { aprobarPagosDeCertificados, iniciarPago } from '../lib/aula/checkout.js';

describe('certificados con costo', () => {
  let t;
  let a;
  let curso;
  let clases;
  const preferencias = [];
  const crearPreferencia = async (body) => {
    preferencias.push(body);
    return { id: `pref-${preferencias.length}`, init_point: `https://mp.test/checkout/${preferencias.length}` };
  };

  const participante = async (email) => {
    const u = await seedUser(t.db, { email, firstName: 'Laura', lastName: 'Gómez' });
    const c = t.client();
    await c.login(u.email, u.password);
    return { u, c };
  };
  const completar = async (c) => {
    for (const l of clases) {
      await c.post(`/me/courses/${curso.id}/lessons/${l.id}/open`, {});
      await c.post(`/me/courses/${curso.id}/lessons/${l.id}/complete`, {});
    }
  };

  beforeAll(async () => {
    t = await startTestApp({ crearPreferencia });
    const admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);
    curso = (await a.post('/admin/courses', { title: 'Atención farmacéutica básica', kind: 'edvanta', durationMinutes: 120 })).data;
    const m = (await a.post(`/admin/courses/${curso.id}/modules`, { title: 'Única' })).data;
    clases = [];
    for (const title of ['Qué es', 'Cómo se hace']) {
      const l = (await a.post(`/admin/modules/${m.id}/lessons`, { title })).data;
      await a.post(`/admin/lessons/${l.id}/blocks`, { type: 'texto', data: { html: `<p>${title}</p>` } });
      clases.push(l);
    }
    await a.post(`/admin/courses/${curso.id}/publish`, {});
    await t.db.query('UPDATE aula_courses SET certificate_price = 60000 WHERE id = $1', [curso.id]);
  }, 120_000);
  afterAll(async () => { await t.close(); });

  it('la migración pone COP 60.000 a los cursos propios para profesionales y deja sin costo el de pacientes', async () => {
    const { rows } = await t.db.query(
      "SELECT publico, certificate_price FROM aula_courses WHERE kind = 'edvanta' AND deleted_at IS NULL AND id <> $1",
      [curso.id],
    );
    expect(rows.length).toBeGreaterThan(0);
    for (const r of rows) {
      if (r.publico === 'profesionales') expect(Number(r.certificate_price)).toBe(60000);
      else expect(r.certificate_price).toBeNull();
    }
  });

  it('sin pago no se emite; el precio lo pone el servidor y el pago aprobado lo habilita', async () => {
    const { c } = await participante('laura@correo.co');
    expect((await c.post(`/me/catalog/${curso.id}/enroll`, {})).status).toBeLessThan(300);

    const antes = await c.get(`/me/courses/${curso.id}/certificate`);
    expect(antes.data.pago).toEqual({ requerido: true, precio: 60000, estado: 'sin_pagar' });

    await completar(c);
    const sinPago = await c.post(`/me/courses/${curso.id}/certificate`, {});
    expect(sinPago.status).toBe(402);
    expect(sinPago.data.error.code).toBe('certificado_sin_pago');

    // El navegador intenta poner su propio precio y una ruta de regreso externa.
    const pago = await c.post('/me/checkout', {
      items: [{ id: `certificado-${curso.id}`, price: 1, qty: 5 }],
      volverA: '//otro-sitio.com/robo',
    });
    expect(pago.status).toBe(201);
    expect(pago.data.initPoint).toMatch(/^https:\/\/mp\.test\//);
    const body = preferencias.at(-1);
    expect(body.items).toEqual([expect.objectContaining({ quantity: 1, unit_price: 60000, currency_id: 'COP' })]);
    expect(body.back_urls.success).toBe('https://aula.test/?pago=exitoso');
    expect(body.metadata).toMatchObject({ certificados: [Number(curso.id)] });

    expect((await c.get(`/me/courses/${curso.id}/certificate`)).data.pago.estado).toBe('pendiente');

    const aprobados = await aprobarPagosDeCertificados(t.db, { externalReference: pago.data.externalReference, paymentId: 1001 });
    expect(aprobados).toHaveLength(1);
    expect((await c.get(`/me/courses/${curso.id}/certificate`)).data.pago.estado).toBe('pagado');

    const emitido = await c.post(`/me/courses/${curso.id}/certificate`, {});
    expect(emitido.status).toBe(201);
    // Ya emitido: no se vuelve a cobrar ni a vender.
    expect((await c.get(`/me/courses/${curso.id}/certificate`)).data.pago.requerido).toBe(false);
    const otraCompra = await c.post('/me/checkout', { items: [{ id: `certificado-${curso.id}` }] });
    expect(otraCompra.status).toBe(409);
  });

  it('un segundo pago del mismo certificado queda anulado y el webhook usa los datos del pago si no hay pendientes', async () => {
    const { u, c } = await participante('pedro@correo.co');
    await c.post(`/me/catalog/${curso.id}/enroll`, {});
    const p1 = await c.post('/me/checkout', { items: [{ id: `certificado-${curso.id}` }] });
    const p2 = await c.post('/me/checkout', { items: [{ id: `certificado-${curso.id}` }] });
    expect((await aprobarPagosDeCertificados(t.db, { externalReference: p1.data.externalReference, paymentId: 2001 }))).toHaveLength(1);
    expect((await aprobarPagosDeCertificados(t.db, { externalReference: p2.data.externalReference, paymentId: 2002 }))).toHaveLength(0);
    const { rows } = await t.db.query(
      'SELECT status FROM aula_certificate_payments WHERE user_id = $1 AND course_id = $2 ORDER BY id',
      [u.id, curso.id],
    );
    expect(rows.map((r) => r.status)).toEqual(['aprobado', 'anulado']);

    // Sin pendientes: aprueba con lo que viajó en el pago.
    const otra = await participante('sofia@correo.co');
    const porMetadatos = await aprobarPagosDeCertificados(t.db, {
      externalReference: 'referencia-desconocida', paymentId: 3001,
      metadata: { aula_user_id: otra.u.id, certificados: [Number(curso.id)] },
    });
    expect(porMetadatos).toEqual([{ userId: Number(otra.u.id), courseId: Number(curso.id) }]);
  });

  it('la administración registra un pago por otro medio y lo ve en la lista', async () => {
    const { u, c } = await participante('marta@correo.co');
    await c.post(`/me/catalog/${curso.id}/enroll`, {});
    const sinNota = await a.post(`/admin/courses/${curso.id}/certificate-payments`, { email: u.email });
    expect(sinNota.status).toBe(400);
    const ok = await a.post(`/admin/courses/${curso.id}/certificate-payments`, { email: u.email, nota: 'Transferencia del 6 de noviembre' });
    expect(ok.status).toBe(201);
    expect((await a.post(`/admin/courses/${curso.id}/certificate-payments`, { email: u.email, nota: 'Otra vez' })).status).toBe(409);
    await completar(c);
    expect((await c.post(`/me/courses/${curso.id}/certificate`, {})).status).toBe(201);
    const lista = await a.get(`/admin/courses/${curso.id}/certificate-payments`);
    expect(lista.data.pagos.some((x) => x.correo === u.email && x.origen === 'admin' && x.estado === 'aprobado')).toBe(true);
  });

  it('una matrícula asignada por la institución no paga', async () => {
    const { u, c } = await participante('ines@clinica.co');
    await a.post('/admin/assignments', { courseIds: [curso.id], targetType: 'usuario', targetIds: [u.id] });
    const estado = await c.get(`/me/courses/${curso.id}/certificate`);
    expect(estado.data.pago).toMatchObject({ requerido: false, estado: 'institucion' });
    await completar(c);
    expect((await c.post(`/me/courses/${curso.id}/certificate`, {})).status).toBe(201);
  });

  it('rechaza productos inexistentes, exige sesión y responde 503 si el pago en línea no está activo', async () => {
    const { u, c } = await participante('raul@correo.co');
    expect((await c.post('/me/checkout', { items: [{ id: 'certificado-999999' }] })).status).toBe(400);
    expect((await c.post('/me/checkout', { items: [] })).status).toBe(400);
    expect((await t.client().post('/me/checkout', { items: [{ id: `certificado-${curso.id}` }] })).status).toBe(401);
    await expect(iniciarPago(t.db, u, [{ id: `certificado-${curso.id}` }], { crearPreferencia: null }))
      .rejects.toMatchObject({ status: 503, code: 'pagos_inactivos' });
  });
});

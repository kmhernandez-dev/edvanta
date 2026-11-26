/**
 * Cursos propios de pago (acceso-pago.js): «vitrina abierta, curso pago».
 *
 * Lo que no puede fallar:
 *  - quien se inscribe después del lanzamiento ve la primera unidad
 *    completa y, del resto, solo el video y el inicio de cada clase;
 *  - completar una clase o abrir un quiz de una unidad de pago pide el
 *    curso completo (402 curso_de_pago), y en la primera unidad no;
 *  - comprar exige aceptar los términos y el inicio inmediato del acceso
 *    (Ley 1480, art. 47), y la aceptación queda en el pago y en la bitácora;
 *  - el pago aprobado abre todo el curso;
 *  - quien se inscribió antes del lanzamiento y los cursos sin precio no cambian.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';
import { aprobarPagosDeCertificados, VERSION_TERMINOS } from '../lib/aula/checkout.js';
import { CURSOS_PAGOS } from '../lib/aula/acceso-pago.js';

const DESPUES = new Date(new Date(CURSOS_PAGOS.desde).getTime() + 24 * 3600 * 1000).toISOString();
const ANTES = new Date(new Date(CURSOS_PAGOS.desde).getTime() - 24 * 3600 * 1000).toISOString();

describe('cursos propios de pago', () => {
  let t;
  let a;
  let curso;
  const clases = {};
  const quices = {};
  const crearPreferencia = async () => ({ id: 'pref-1', init_point: 'https://mp.test/checkout/1' });

  const participante = async (email, { inscritoEl = DESPUES } = {}) => {
    const u = await seedUser(t.db, { email, firstName: 'Ana', lastName: 'Ríos' });
    const c = t.client();
    await c.login(u.email, u.password);
    const id = curso.id;
    expect((await c.post(`/me/catalog/${id}/enroll`, {})).status).toBeLessThan(300);
    await t.db.query('UPDATE aula_enrollments SET assigned_at = $1 WHERE user_id = $2 AND course_id = $3', [inscritoEl, u.id, id]);
    return { u, c };
  };

  const quiz = async (moduleId, title) => {
    const { rows: [q] } = await t.db.query(
      `INSERT INTO aula_assessments
         (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
          shuffle_questions, shuffle_options, show_answers_after_submit, status, weight, sort_order)
       VALUES ($1, $2, $3, 'Responde.', TRUE, 70, 2, FALSE, FALSE, TRUE, 'publicado', 10, 1) RETURNING *`,
      [curso.id, moduleId, title],
    );
    return q;
  };

  beforeAll(async () => {
    t = await startTestApp({ crearPreferencia });
    const admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);

    curso = (await a.post('/admin/courses', { title: 'Farmacología de prueba', kind: 'edvanta', durationMinutes: 120 })).data;
    for (const [n, unidad] of [[1, 'Unidad 1'], [2, 'Unidad 2']]) {
      const m = (await a.post(`/admin/courses/${curso.id}/modules`, { title: unidad })).data;
      const l = (await a.post(`/admin/modules/${m.id}/lessons`, { title: `Clase ${n}` })).data;
      await a.post(`/admin/lessons/${l.id}/blocks`, { type: 'texto', data: { html: `<p>Texto de la clase ${n}</p>` } });
      clases[n] = l;
      quices[n] = await quiz(m.id, `Quiz ${n}`);
    }
    await a.post(`/admin/courses/${curso.id}/publish`, {});
    await t.db.query('UPDATE aula_courses SET certificate_price = 60000 WHERE id = $1', [curso.id]);

  }, 120_000);

  afterAll(async () => { await t.close(); });

  const tipos = (leccion) => (leccion.blocks || []).map((b) => b.type);

  it('después del lanzamiento: primera unidad completa y, del resto, solo la muestra', async () => {
    const { c } = await participante('muestra@correo.co');
    const r = await c.get(`/me/courses/${curso.id}`);
    expect(r.status).toBe(200);
    expect(r.data.acceso).toMatchObject({ completo: false, motivo: 'muestra', unidadesGratis: 1 });
    const [u1, u2] = r.data.snapshot.modules;
    expect(u1.requierePago).toBeFalsy();
    expect(tipos(u1.lessons[0])).toContain('texto');
    expect(u2.requierePago).toBe(true);
    expect(u2.lessons[0].requierePago).toBe(true);
    expect(tipos(u2.lessons[0])).not.toContain('texto');
    expect(JSON.stringify(u2)).not.toContain('Texto de la clase 2');
  });

  it('las clases y los quices de la unidad de pago piden el curso completo; los de la primera, no', async () => {
    const { c } = await participante('clases@correo.co');
    await c.post(`/me/courses/${curso.id}/lessons/${clases[1].id}/open`, {});
    expect((await c.post(`/me/courses/${curso.id}/lessons/${clases[1].id}/complete`, {})).status).toBeLessThan(300);

    await c.post(`/me/courses/${curso.id}/lessons/${clases[2].id}/open`, {});
    const cerrada = await c.post(`/me/courses/${curso.id}/lessons/${clases[2].id}/complete`, {});
    expect(cerrada.status).toBe(402);
    expect(cerrada.data.error.code).toBe('curso_de_pago');

    expect((await c.get(`/me/courses/${curso.id}/assessments/${quices[1].id}`)).status).not.toBe(402);
    const quizDePago = await c.get(`/me/courses/${curso.id}/assessments/${quices[2].id}`);
    expect(quizDePago.status).toBe(402);
    expect(quizDePago.data.error.code).toBe('curso_de_pago');
  });

  it('comprar exige aceptar los términos, deja la constancia y el pago abre todo el curso', async () => {
    const { u, c } = await participante('compra@correo.co');
    const sinAceptar = await c.post('/me/checkout', { items: [{ id: `certificado-${curso.id}` }] });
    expect(sinAceptar.status).toBe(400);
    expect(sinAceptar.data.error.field).toBe('aceptaTerminos');
    const { rows: ninguno } = await t.db.query('SELECT 1 FROM aula_certificate_payments WHERE user_id = $1', [u.id]);
    expect(ninguno).toHaveLength(0);

    const pago = await c.post('/me/checkout', { aceptaTerminos: true, items: [{ id: `certificado-${curso.id}` }] });
    expect(pago.status).toBe(201);
    const { rows: [fila] } = await t.db.query('SELECT note FROM aula_certificate_payments WHERE user_id = $1', [u.id]);
    expect(fila.note).toContain(`Términos ${VERSION_TERMINOS} aceptados`);
    expect(fila.note).toContain('no aplica el derecho de retracto');
    const { rows: bitacora } = await t.db.query("SELECT 1 FROM aula_audit_log WHERE action = 'pago.aceptacion' AND actor_id = $1", [u.id]);
    expect(bitacora).toHaveLength(1);

    await aprobarPagosDeCertificados(t.db, { externalReference: pago.data.externalReference, paymentId: 9001 });
    const r = await c.get(`/me/courses/${curso.id}`);
    expect(r.data.acceso).toMatchObject({ completo: true, motivo: 'pagado' });
    expect(tipos(r.data.snapshot.modules[1].lessons[0])).toContain('texto');
    expect((await c.get(`/me/courses/${curso.id}/assessments/${quices[2].id}`)).status).not.toBe(402);
  });

  it('quien se inscribió antes del lanzamiento conserva el curso completo', async () => {
    const { c } = await participante('antes@correo.co', { inscritoEl: ANTES });
    const r = await c.get(`/me/courses/${curso.id}`);
    expect(r.data.acceso).toMatchObject({ completo: true, motivo: 'previo' });
    expect(tipos(r.data.snapshot.modules[1].lessons[0])).toContain('texto');
  });

  it('un curso sin precio sigue abierto', async () => {
    const { c } = await participante('gratis@correo.co');
    await t.db.query('UPDATE aula_courses SET certificate_price = NULL WHERE id = $1', [curso.id]);
    try {
      const r = await c.get(`/me/courses/${curso.id}`);
      expect(r.data.acceso).toMatchObject({ completo: true, motivo: 'sin_costo' });
      expect(tipos(r.data.snapshot.modules[1].lessons[0])).toContain('texto');
    } finally {
      await t.db.query('UPDATE aula_courses SET certificate_price = 60000 WHERE id = $1', [curso.id]);
    }
  });
});

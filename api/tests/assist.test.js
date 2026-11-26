/**
 * Edvanta Assist y la venta automática.
 *
 * Lo que no puede fallar:
 *  - solo administradores entran a Assist;
 *  - la búsqueda encuentra cuentas y también interesados sin cuenta;
 *  - la ficha dice qué hacer ahora (recuperar un pago, vender el
 *    certificado a quien terminó) con precios reales;
 *  - un recordatorio manual no se repite el mismo día;
 *  - la bandeja agrupa el trabajo y el resumen de ventas cuenta pagos;
 *  - el embudo programado manda cada correo de venta UNA sola vez y solo
 *    por hechos posteriores a su lanzamiento.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';
import { correrEmbudoProgramado } from '../lib/aula/embudo-programado.js';
import { enlaceWhatsApp, numeroWhatsApp, siguientesAcciones } from '../lib/aula/assist.js';

const AHORA = new Date('2026-12-10T12:00:00Z');

describe('Edvanta Assist', () => {
  let t;
  let a;
  let curso;
  let clases;
  const personas = {};

  const participante = async (clave, email, nombre) => {
    const u = await seedUser(t.db, { email, firstName: nombre, lastName: 'Prueba' });
    const c = t.client();
    await c.login(u.email, u.password);
    personas[clave] = { u, c };
    return personas[clave];
  };

  beforeAll(async () => {
    t = await startTestApp();
    t.clock.current = AHORA;
    const admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);

    curso = (await a.post('/admin/courses', { title: 'Farmacovigilancia práctica', kind: 'edvanta', durationMinutes: 120 })).data;
    const m = (await a.post(`/admin/courses/${curso.id}/modules`, { title: 'Única' })).data;
    clases = [];
    for (const title of ['Qué es', 'Cómo se reporta']) {
      const l = (await a.post(`/admin/modules/${m.id}/lessons`, { title })).data;
      await a.post(`/admin/lessons/${l.id}/blocks`, { type: 'texto', data: { html: `<p>${title}</p>` } });
      clases.push(l);
    }
    await a.post(`/admin/courses/${curso.id}/publish`, {});
    await t.db.query('UPDATE aula_courses SET certificate_price = 60000 WHERE id = $1', [curso.id]);

    // Ana: empezó a pagar y no terminó.
    const ana = await participante('ana', 'ana.pago@correo.co', 'Ana');
    expect((await ana.c.post(`/me/catalog/${curso.id}/enroll`, {})).status).toBeLessThan(300);
    // Inscrita hace más de 7 días: su descuento ya venció.
    await t.db.query('UPDATE aula_enrollments SET assigned_at = $3 WHERE user_id = $1 AND course_id = $2',
      [ana.u.id, curso.id, new Date('2026-11-25T10:00:00Z')]);
    await t.db.query(
      `INSERT INTO aula_certificate_payments (user_id, course_id, status, amount, created_at)
       VALUES ($1, $2, 'pendiente', 60000, $3)`,
      [ana.u.id, curso.id, new Date('2026-12-10T08:00:00Z')],
    );

    // Beto: terminó el curso y no tiene certificado.
    const beto = await participante('beto', 'beto.termino@correo.co', 'Beto');
    await beto.c.post(`/me/catalog/${curso.id}/enroll`, {});
    for (const l of clases) {
      await beto.c.post(`/me/courses/${curso.id}/lessons/${l.id}/open`, {});
      await beto.c.post(`/me/courses/${curso.id}/lessons/${l.id}/complete`, {});
    }
    const { rows: [mb] } = await t.db.query(
      'SELECT completed_at FROM aula_enrollments WHERE user_id = $1 AND course_id = $2', [beto.u.id, curso.id],
    );
    expect(mb.completed_at).not.toBeNull();
    await t.db.query(
      'UPDATE aula_enrollments SET completed_at = $3 WHERE user_id = $1 AND course_id = $2',
      [beto.u.id, curso.id, new Date('2026-12-09T10:00:00Z')],
    );

    // Caro: va a la mitad y lleva 15 días sin entrar.
    const caro = await participante('caro', 'caro.quieta@correo.co', 'Caro');
    await caro.c.post(`/me/catalog/${curso.id}/enroll`, {});
    await t.db.query(
      `UPDATE aula_enrollments SET progress_status = 'en_progreso', progress_pct = 50,
              assigned_at = $3, last_access_at = $4
        WHERE user_id = $1 AND course_id = $2`,
      [caro.u.id, curso.id, new Date('2026-11-20T10:00:00Z'), new Date('2026-11-25T10:00:00Z')],
    );

    // Diana: interesada sin cuenta (llenó un formulario de la web).
    await t.db.query(
      `INSERT INTO solicitudes (tipo, nombre, correo, whatsapp, referencia, acepta_tratamiento, created_at)
       VALUES ('interes', 'Diana Interesada', 'diana.lead@correo.co', '3001234567', 'curso-farmacovigilancia', TRUE, $1)`,
      [new Date('2026-12-08T10:00:00Z')],
    );
  }, 180_000);
  afterAll(async () => { await t.close(); });

  it('solo administradores entran a Assist', async () => {
    const r = await personas.ana.c.get('/admin/assist/bandeja');
    expect(r.status).toBe(403);
  });

  it('busca cuentas e interesados sin cuenta por fragmento de nombre o correo', async () => {
    const r1 = await a.get('/admin/assist/buscar?q=beto');
    expect(r1.status).toBe(200);
    expect(r1.data.items.map((p) => p.correo)).toContain('beto.termino@correo.co');
    expect(r1.data.items[0].cuenta).toMatchObject({ cursos: 1 });

    const r2 = await a.get('/admin/assist/buscar?q=diana');
    expect(r2.data.items).toHaveLength(1);
    expect(r2.data.items[0]).toMatchObject({ correo: 'diana.lead@correo.co', cuenta: null, solicitudes: 1 });

    // Un % no es comodín: se busca tal cual.
    expect((await a.get('/admin/assist/buscar?q=%25%25')).data.items).toHaveLength(0);
  });

  it('la ficha de quien dejó un pago a medias propone recuperarlo, con el precio real', async () => {
    const r = await a.get('/admin/assist/persona?correo=ana.pago@correo.co');
    expect(r.status).toBe(200);
    expect(r.data.cuenta).toMatchObject({ estado: 'active' });
    expect(r.data.cursos[0].certificado).toMatchObject({ conCosto: true, pagado: false });
    const accion = r.data.acciones.find((x) => x.tipo === 'recuperar-pago');
    expect(accion).toMatchObject({ prioridad: 'alta', operacion: 'recordatorio-pago', courseId: curso.id });
    // Pasaron los 7 días de su descuento: hoy le corresponde el precio de lista.
    expect(accion.detalle).toMatch(/COP 199\.000/);
  });

  it('a quien terminó sin certificado le propone venderlo y lo ofrece por correo una vez por día', async () => {
    const r = await a.get('/admin/assist/persona?correo=beto.termino@correo.co');
    expect(r.data.acciones[0]).toMatchObject({ tipo: 'vender-certificado', prioridad: 'alta' });

    const antes = t.mails.length;
    const envio = await a.post('/admin/assist/persona/oferta-certificado', { correo: 'beto.termino@correo.co', courseId: curso.id });
    expect(envio.status).toBe(200);
    expect(envio.data.enviado).toBe(true);
    expect(t.mails.length).toBe(antes + 1);
    expect(t.mails.at(-1).subject).toMatch(/Terminaste Farmacovigilancia práctica/);
    expect(t.mails.at(-1).html).toMatch(/\/certificado/);

    // El automático ya no lo repite (usó su lugar) y el manual de hoy tampoco.
    const otra = await a.post('/admin/assist/persona/oferta-certificado', { correo: 'beto.termino@correo.co', courseId: curso.id });
    expect(otra.status).toBe(200); // el primero ocupó la clave automática; este es el manual del día
    const tercera = await a.post('/admin/assist/persona/oferta-certificado', { correo: 'beto.termino@correo.co', courseId: curso.id });
    expect(tercera.status).toBe(409);
  });

  it('vende por WhatsApp con el enlace de Mercado Pago y, al registrar el pago, abre el curso', async () => {
    const r = await a.get('/admin/assist/persona?correo=caro.quieta@correo.co');
    const accion = r.data.acciones.find((x) => x.tipo === 'vender-por-enlace');
    expect(accion).toMatchObject({ prioridad: 'media', operacion: 'pago-enlace', courseId: curso.id });
    expect(accion.detalle).toMatch(/COP 60\.000/);
    // Sin WhatsApp registrado no hay mensaje que abrir (ver la prueba de utilidades).
    expect(accion.whatsapp).toBeNull();

    // Solo administración registra el pago.
    expect((await personas.caro.c.post('/admin/assist/persona/pago-enlace', { correo: 'caro.quieta@correo.co', courseId: curso.id })).status).toBe(403);
    const pago = await a.post('/admin/assist/persona/pago-enlace', { correo: 'caro.quieta@correo.co', courseId: curso.id });
    expect(pago.status).toBe(200);
    const { rows: [fila] } = await t.db.query(
      `SELECT p.status, p.note FROM aula_certificate_payments p JOIN aula_users u ON u.id = p.user_id
        WHERE u.email = 'caro.quieta@correo.co' AND p.course_id = $1`, [curso.id],
    );
    expect(fila.status).toBe('aprobado');
    expect(fila.note).toContain('mpago.li');
    // Ya pagó: la acción de venta desaparece de su ficha.
    const despues = await a.get('/admin/assist/persona?correo=caro.quieta@correo.co');
    expect(despues.data.acciones.find((x) => x.tipo === 'vender-por-enlace')).toBeUndefined();

    // Deja a Caro como estaba: las pruebas siguientes la usan sin pago.
    await t.db.query(
      `DELETE FROM aula_certificate_payments
        WHERE course_id = $1 AND user_id = (SELECT id FROM aula_users WHERE email = 'caro.quieta@correo.co')`,
      [curso.id],
    );
  });

  it('no ofrece el certificado a quien no ha terminado', async () => {
    const r = await a.post('/admin/assist/persona/oferta-certificado', { correo: 'caro.quieta@correo.co', courseId: curso.id });
    expect(r.status).toBe(400);
  });

  it('guarda notas de atención por correo, también de quien no tiene cuenta', async () => {
    const r = await a.post('/admin/assist/persona/notas', { correo: 'Diana.Lead@correo.co', nota: 'Pidió precio para su equipo de 5 personas.' });
    expect(r.status).toBe(201);
    const ficha = await a.get('/admin/assist/persona?correo=diana.lead@correo.co');
    expect(ficha.data.cuenta).toBeNull();
    expect(ficha.data.whatsapp).toBe('573001234567');
    expect(ficha.data.notas[0]).toMatchObject({ nota: 'Pidió precio para su equipo de 5 personas.', autor: 'admin@edvanta.co' });
    expect(ficha.data.acciones.map((x) => x.tipo)).toEqual(expect.arrayContaining(['responder', 'invitar']));
    expect(ficha.data.acciones[0].whatsapp).toMatch(/^https:\/\/wa\.me\/573001234567\?text=/);
  });

  it('un correo que no existe en ninguna parte da 404', async () => {
    expect((await a.get('/admin/assist/persona?correo=nadie@correo.co')).status).toBe(404);
  });

  it('la bandeja agrupa el trabajo del día', async () => {
    const r = await a.get('/admin/assist/bandeja');
    expect(r.status).toBe(200);
    const g = r.data.grupos;
    expect(g.pagosSinTerminar.items.map((x) => x.correo)).toContain('ana.pago@correo.co');
    expect(g.terminaronSinCertificado.items.map((x) => x.correo)).toContain('beto.termino@correo.co');
    expect(g.inactivos.items.map((x) => x.correo)).toContain('caro.quieta@correo.co');
    expect(g.solicitudesNuevas.items.map((x) => x.correo)).toContain('diana.lead@correo.co');
    expect(g.solicitudesNuevas.total).toBeGreaterThanOrEqual(1);
  });

  it('el resumen de ventas cuenta inscripciones, pagos e ingresos', async () => {
    await a.post(`/admin/courses/${curso.id}/certificate-payments`, { email: 'beto.termino@correo.co', nota: 'Transferencia del 10 de diciembre' });
    const r = await a.get('/admin/assist/ventas?dias=30');
    expect(r.status).toBe(200);
    expect(r.data.totales.pagosAprobados).toBe(1);
    expect(r.data.totales.ingresosCop).toBe(60000);
    expect(r.data.totales.inscripciones).toBeGreaterThanOrEqual(3);
    expect(r.data.serie).toHaveLength(30);
    expect(r.data.porCurso[0]).toMatchObject({ titulo: 'Farmacovigilancia práctica', pagos: 1 });
    // Beto pagó después del correo «curso-completado»: cuenta como recuperada.
    expect(r.data.recuperadas.find((x) => x.plantilla === 'curso-completado')).toMatchObject({ pagos: 1 });
  });

  it('el embudo programado manda cada correo de venta una sola vez', async () => {
    const r1 = await correrEmbudoProgramado(t.db, { send: async (m) => { t.mails.push(m); return true; } }, { now: AHORA, siteUrl: 'https://aula.test' });
    expect(r1.pagosPendientes).toBe(1);   // Ana
    expect(r1.completados).toBe(0);       // Beto ya pagó (y ya tenía su oferta)
    expect(r1.reactivaciones).toBe(1);    // Caro
    const asuntos = t.mails.map((m) => m.subject);
    expect(asuntos.some((s) => /Ana, tu certificado de Farmacovigilancia práctica quedó a un paso/.test(s))).toBe(true);
    expect(asuntos.some((s) => /Caro, vas en el 50 %/.test(s))).toBe(true);

    const r2 = await correrEmbudoProgramado(t.db, { send: async () => true }, { now: AHORA, siteUrl: 'https://aula.test' });
    expect(r2.pagosPendientes + r2.completados + r2.reactivaciones).toBe(0);
  });

  it('no manda correos de venta por hechos anteriores al lanzamiento', async () => {
    const vieja = await seedUser(t.db, { email: 'vieja@correo.co', firstName: 'Elena' });
    await t.db.query(
      `INSERT INTO aula_certificate_payments (user_id, course_id, status, amount, created_at)
       VALUES ($1, $2, 'pendiente', 60000, $3)`,
      [vieja.id, curso.id, new Date('2026-11-15T10:00:00Z')],
    );
    const r = await correrEmbudoProgramado(t.db, { send: async () => true }, { now: new Date('2026-11-20T12:00:00Z'), siteUrl: 'https://aula.test' });
    expect(r.pagosPendientes).toBe(0);
  });
});

describe('Assist: utilidades', () => {
  it('normaliza números de WhatsApp', () => {
    expect(numeroWhatsApp('300 123 4567')).toBe('573001234567');
    expect(numeroWhatsApp('+57 300-123-4567')).toBe('573001234567');
    expect(numeroWhatsApp('+52 55 1234 5678')).toBe('525512345678');
    expect(numeroWhatsApp('123')).toBeNull();
    expect(enlaceWhatsApp(null, 'hola')).toBeNull();
  });

  it('ordena las acciones de mayor a menor prioridad y no supone el género', () => {
    const acciones = siguientesAcciones({
      nombre: 'Alex Rivera', whatsapp: '573001234567',
      cuenta: { estado: 'invited', creada: '2026-12-01T00:00:00Z', ultimaEntrada: null },
      cursos: [], pagos: [],
      solicitudes: [{ id: 1, estado: 'nueva', tipo: 'contacto', referencia: null, creada: '2026-12-09T00:00:00Z' }],
    }, { now: AHORA });
    expect(acciones.map((x) => x.prioridad)).toEqual(['alta', 'media']);
    for (const x of acciones) expect(decodeURIComponent(x.whatsapp)).not.toMatch(/\b(bienvenido|bienvenida|interesado|interesada|querido|querida)\b/i);
  });

  it('el mensaje de venta por WhatsApp lleva el enlace de pago y la aceptación de términos', () => {
    const acciones = siguientesAcciones({
      nombre: 'Alex Rivera', whatsapp: '573001234567',
      cuenta: { estado: 'active', creada: '2026-12-01T00:00:00Z', ultimaEntrada: '2026-12-09T00:00:00Z' },
      cursos: [{
        courseId: 9, titulo: 'Farmacovigilancia práctica', estado: 'en_progreso', avance: 20,
        ultimoAcceso: '2026-12-09T00:00:00Z', inscrito: '2026-12-01T00:00:00Z', terminado: null, retirado: false,
        certificado: { conCosto: true, pagado: false, estado: 'sin_pagar', precioHoy: 199000 },
      }],
      pagos: [], solicitudes: [],
    }, { now: AHORA });
    const venta = acciones.find((x) => x.tipo === 'vender-por-enlace');
    expect(venta.detalle).toMatch(/En el sitio hoy le corresponde COP 199\.000/);
    const mensaje = decodeURIComponent(venta.whatsapp);
    expect(mensaje).toContain('https://mpago.li/2T6UAUr');
    expect(mensaje).toContain('aceptas los términos');
    expect(mensaje).not.toMatch(/\b(bienvenido|bienvenida|interesado|interesada)\b/i);
  });
});

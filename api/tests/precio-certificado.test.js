/**
 * Precio del certificado por país y con descuento real.
 *
 *  - sin precio de lista, se cobra el precio del curso (o el del país) y
 *    no se anuncia descuento;
 *  - un «precio antes» solo existe con un plazo o una fecha que lo limite;
 *  - vencido el plazo, se cobra el precio de lista;
 *  - el checkout cobra lo mismo que dice la ficha, según el país.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';
import { OFERTA_CERTIFICADO, paisDeSolicitud, precioDelCertificado } from '../lib/precio-certificado.js';
import { revisionIncluida } from '../lib/aula/checkout.js';

const curso = { certificate_price: 60000 };
const ahora = new Date('2026-11-18T12:00:00-05:00');

describe('precioDelCertificado', () => {
  it('sin oferta configurada cobra el precio del curso y no anuncia descuento', () => {
    const p = precioDelCertificado(curso, { pais: 'MX', ahora, oferta: { porPais: {} } });
    expect(p).toMatchObject({ precio: 60000, lista: null, conDescuento: false, descuentoPct: 0 });
  });

  it('la oferta vigente es la que decidió Karla (18-nov): lista 199.000, 7 días, CO 60.000 y resto 65.000', () => {
    expect(precioDelCertificado(curso, { pais: 'CO', ahora })).toMatchObject({ precio: 60000, lista: 199000, descuentoPct: 70 });
    expect(precioDelCertificado(curso, { pais: 'MX', ahora })).toMatchObject({ precio: 65000, lista: 199000, descuentoPct: 67 });
    // Sin país conocido, el de Colombia.
    expect(precioDelCertificado(curso, { pais: null, ahora }).precio).toBe(60000);
    // Una inscripción anterior al lanzamiento cuenta sus 7 días desde el lanzamiento.
    const vieja = precioDelCertificado(curso, { pais: 'CO', inscritoEl: '2026-10-01T00:00:00-05:00', ahora });
    expect(vieja).toMatchObject({ precio: 60000, conDescuento: true });
    expect(vieja.venceEl).toBe(new Date('2026-11-25T00:00:00-05:00').toISOString());
    expect(precioDelCertificado(curso, { pais: 'CO', inscritoEl: '2026-10-01', ahora: new Date('2026-11-26') }).precio).toBe(199000);
  });

  it('un curso sin costo sigue sin costo', () => {
    expect(precioDelCertificado({ certificate_price: null }, { ahora }).precio).toBe(0);
  });

  it('cobra por país y el resto paga el precio general', () => {
    const oferta = { porPais: { CO: 60000 }, resto: 65000 };
    expect(precioDelCertificado(curso, { pais: 'CO', ahora, oferta }).precio).toBe(60000);
    expect(precioDelCertificado(curso, { pais: 'PE', ahora, oferta }).precio).toBe(65000);
    expect(precioDelCertificado(curso, { pais: 'BR', ahora, oferta }).precio).toBe(65000);
  });

  it('un precio de lista sin plazo ni fecha no se anuncia', () => {
    const p = precioDelCertificado(curso, { pais: 'CO', ahora, oferta: { precioDeLista: 199000, porPais: { CO: 60000 } } });
    expect(p).toMatchObject({ precio: 60000, lista: null, conDescuento: false });
  });

  it('con plazo desde la inscripción: descuento dentro del plazo y precio de lista después', () => {
    const oferta = { precioDeLista: 199000, porPais: { CO: 60000 }, resto: 65000, diasDeLaOferta: 7 };
    const dentro = precioDelCertificado(curso, { pais: 'CO', inscritoEl: '2026-11-15T12:00:00-05:00', ahora, oferta });
    expect(dentro).toMatchObject({ precio: 60000, lista: 199000, descuentoPct: 70, conDescuento: true });
    expect(dentro.venceEl).toBe(new Date('2026-11-22T12:00:00-05:00').toISOString());
    const fuera = precioDelCertificado(curso, { pais: 'CO', inscritoEl: '2026-11-01T12:00:00-05:00', ahora, oferta });
    expect(fuera).toMatchObject({ precio: 199000, conDescuento: false });
    // Quien aún no se inscribe ve el plazo completo desde hoy.
    expect(precioDelCertificado(curso, { pais: 'AR', ahora, oferta })).toMatchObject({ precio: 65000, descuentoPct: 67 });
  });

  it('con fecha de campaña: al vencer rige el precio de lista', () => {
    const oferta = { precioDeLista: 199000, resto: 60000, hasta: '2026-12-31T23:59:59-05:00' };
    expect(precioDelCertificado(curso, { ahora, oferta }).conDescuento).toBe(true);
    expect(precioDelCertificado(curso, { ahora: new Date('2027-01-02'), oferta }).precio).toBe(199000);
  });

  it('el país sale de Cloudflare y se ignoran los desconocidos', () => {
    expect(paisDeSolicitud({ headers: { 'cf-ipcountry': 'co' } })).toBe('CO');
    expect(paisDeSolicitud({ headers: { 'cf-ipcountry': 'XX' } })).toBeNull();
    expect(paisDeSolicitud({ headers: { 'cf-ipcountry': 'T1' } })).toBeNull();
    expect(paisDeSolicitud({ headers: {} })).toBeNull();
  });
});

describe('precio por país en la API y en el checkout', () => {
  let t;
  let cursoId;
  const preferencias = [];
  const crearPreferencia = async (body) => {
    preferencias.push(body);
    return { id: `pref-${preferencias.length}`, init_point: 'https://mp.test/checkout' };
  };
  const original = { ...OFERTA_CERTIFICADO };
  const MX = { headers: { 'CF-IPCountry': 'MX' } };
  const CO = { headers: { 'CF-IPCountry': 'CO' } };

  beforeAll(async () => {
    t = await startTestApp({ crearPreferencia });
    const admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    const a = t.client();
    await a.login(admin.email, admin.password);
    const c = (await a.post('/admin/courses', { title: 'Farmacovigilancia', kind: 'edvanta' })).data;
    const m = (await a.post(`/admin/courses/${c.id}/modules`, { title: 'Única' })).data;
    const l = (await a.post(`/admin/modules/${m.id}/lessons`, { title: 'Clase' })).data;
    await a.post(`/admin/lessons/${l.id}/blocks`, { type: 'texto', data: { html: '<p>Hola</p>' } });
    await a.post(`/admin/courses/${c.id}/publish`, {});
    await t.db.query('UPDATE aula_courses SET certificate_price = 60000 WHERE id = $1', [c.id]);
    cursoId = c.id;
    Object.assign(OFERTA_CERTIFICADO, { precioDeLista: 199000, porPais: { CO: 60000 }, resto: 65000, diasDeLaOferta: 7, hasta: null, lanzamiento: null });
  }, 120_000);
  afterAll(async () => {
    Object.assign(OFERTA_CERTIFICADO, original);
    await t.close();
  });

  it('la ficha recibe el precio del país de quien mira, sin caché', async () => {
    const anon = t.client();
    const mx = await anon.get(`/precio-certificado/${cursoId}`, MX);
    expect(mx.status).toBe(200);
    expect(mx.headers.get('cache-control')).toMatch(/no-store/);
    expect(mx.data).toMatchObject({ precio: 65000, lista: 199000, descuentoPct: 67, conDescuento: true, pais: 'MX', moneda: 'COP' });
    expect((await anon.get(`/precio-certificado/${cursoId}`, CO)).data.precio).toBe(60000);
    expect((await anon.get('/precio-certificado/999999', CO)).status).toBe(404);
  });

  it('el checkout cobra el precio del país, no el que manda el navegador', async () => {
    const u = await seedUser(t.db, { email: 'ana@correo.mx', firstName: 'Ana', lastName: 'Ruiz' });
    const c = t.client();
    await c.login(u.email, u.password);
    await c.post(`/me/catalog/${cursoId}/enroll`, {});
    const pago = await c.post('/me/checkout', { items: [{ id: `certificado-${cursoId}`, price: 1 }] }, MX);
    expect(pago.status).toBe(201);
    expect(preferencias.at(-1).items[0]).toMatchObject({ unit_price: 65000, currency_id: 'COP' });
    const cert = await c.get(`/me/courses/${cursoId}/certificate`, MX);
    expect(cert.data.pago).toMatchObject({ precio: 65000, lista: 199000, conDescuento: true });
  });

  it('vencido el plazo desde la inscripción, cobra el precio de lista', async () => {
    const u = await seedUser(t.db, { email: 'luis@correo.co' });
    const c = t.client();
    await c.login(u.email, u.password);
    await c.post(`/me/catalog/${cursoId}/enroll`, {});
    await t.db.query("UPDATE aula_enrollments SET assigned_at = NOW() - INTERVAL '30 days' WHERE user_id = $1", [u.id]);
    await c.post('/me/checkout', { items: [{ id: `certificado-${cursoId}` }] }, CO);
    expect(preferencias.at(-1).items[0].unit_price).toBe(199000);
  });

  it('la revisión de actividades es del camino con certificado: gratis no, pagado sí', async () => {
    const u = await seedUser(t.db, { email: 'sofia@correo.co' });
    const c = t.client();
    await c.login(u.email, u.password);
    await c.post(`/me/catalog/${cursoId}/enroll`, {});
    expect(await revisionIncluida(t.db, u.id, cursoId)).toBe(false);
    await t.db.query(
      "INSERT INTO aula_certificate_payments (user_id, course_id, status, source, approved_at) VALUES ($1, $2, 'aprobado', 'admin', NOW())",
      [u.id, cursoId],
    );
    expect(await revisionIncluida(t.db, u.id, cursoId)).toBe(true);
    // Un curso sin costo de certificado conserva la revisión para todos.
    await t.db.query('UPDATE aula_courses SET certificate_price = NULL WHERE id = $1', [cursoId]);
    const otro = await seedUser(t.db, { email: 'mario@correo.co' });
    expect(await revisionIncluida(t.db, otro.id, cursoId)).toBe(true);
    await t.db.query('UPDATE aula_courses SET certificate_price = 60000 WHERE id = $1', [cursoId]);
  });
});

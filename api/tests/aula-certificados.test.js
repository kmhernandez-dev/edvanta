/**
 * Certificados de aprobación.
 *
 * Lo que no puede fallar:
 *  - solo lo obtiene quien completó el curso, y una sola vez;
 *  - lo emitido no cambia aunque después cambien el nombre o el título;
 *  - el código es al azar y verificable en público, sin mostrar el
 *    documento completo;
 *  - revocar deja constancia y la verificación lo dice.
 */
import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';
import { codigoNuevo, formatoDeCodigo, horasDe } from '../lib/aula/certificados.js';
import { crearRutasPublicas } from '../routes/paginas-publicas.js';

describe('certificados · reglas', () => {
  it('el código es EDV-XXXX-XXXX, sin caracteres que se confundan', () => {
    const codigos = new Set(Array.from({ length: 200 }, codigoNuevo));
    expect(codigos.size).toBe(200);
    for (const c of codigos) {
      expect(c).toMatch(formatoDeCodigo);
      expect(c.slice(4)).not.toMatch(/[01ILO]/);
    }
  });

  it('las horas salen de la duración, redondeadas a media hora, y nunca se inventan', () => {
    expect(horasDe(150)).toBe(2.5);
    expect(horasDe(100)).toBe(1.5);
    expect(horasDe(10)).toBe(0.5);
    expect(horasDe(null)).toBeNull();
    expect(horasDe(0)).toBeNull();
  });
});

describe('certificados · emisión y verificación', () => {
  let t;
  let a;
  let p;
  let publico;
  let curso;
  let clases;
  let participante;

  const pedirPublico = (ruta) => fetch(`${publico}${ruta}`);
  const completar = async (l) => {
    await p.post(`/me/courses/${curso.id}/lessons/${l.id}/open`, {});
    return p.post(`/me/courses/${curso.id}/lessons/${l.id}/complete`, {});
  };

  beforeAll(async () => {
    t = await startTestApp();
    const admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);
    const empresa = (await a.post('/admin/companies', { name: 'Pharmarket' })).data;
    curso = (await a.post('/admin/courses', {
      title: 'Buenas prácticas de documentación', kind: 'empresa', companyId: empresa.id, durationMinutes: 150,
    })).data;
    const m = (await a.post(`/admin/courses/${curso.id}/modules`, { title: 'Único' })).data;
    clases = [];
    for (const title of ['Registros', 'Trazabilidad']) {
      const l = (await a.post(`/admin/modules/${m.id}/lessons`, { title })).data;
      await a.post(`/admin/lessons/${l.id}/blocks`, { type: 'texto', data: { html: `<p>${title}</p>` } });
      clases.push(l);
    }
    await a.post(`/admin/courses/${curso.id}/publish`, {});
    participante = await seedUser(t.db, { email: 'ana@pharmarket.co', firstName: 'Ana María', lastName: 'Restrepo', companyId: empresa.id });
    await a.post('/admin/assignments', { courseIds: [curso.id], targetType: 'usuario', targetIds: [participante.id] });
    p = t.client();
    await p.login(participante.email, participante.password);

    const app = express();
    app.use('/api', crearRutasPublicas({ db: t.db, sitio: 'https://edvanta.test', obtenerPlantilla: async () => null }));
    const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    publico = `http://127.0.0.1:${server.address().port}/api`;
    t.cerrarPublico = () => new Promise((resolve) => server.close(resolve));
  });
  afterAll(async () => {
    await t.cerrarPublico?.();
    await t.close();
  });

  it('antes de completar el curso no se puede pedir, pero se ve lo que dirá', async () => {
    const estado = await p.get(`/me/courses/${curso.id}/certificate`);
    expect(estado.status).toBe(200);
    expect(estado.data).toMatchObject({
      elegible: false,
      certificado: null,
      borrador: { titular: 'Ana María Restrepo', curso: 'Buenas prácticas de documentación', horas: 2.5, ciudad: 'Medellín' },
      emisor: { nombre: 'Edvanta S.A.S.', nit: '902.120.527-6' },
    });
    const pedido = await p.post(`/me/courses/${curso.id}/certificate`, {});
    expect(pedido.status).toBe(409);
    expect(pedido.data.error.code).toBe('curso_sin_completar');
  });

  it('al completarlo se emite una vez, con su código, y pedirlo de nuevo devuelve el mismo', async () => {
    for (const l of clases) expect((await completar(l)).status).toBe(200);

    const malo = await p.post(`/me/courses/${curso.id}/certificate`, { documento: '<script>' });
    expect(malo.status).toBe(400);

    const emitido = await p.post(`/me/courses/${curso.id}/certificate`, { documento: '1.045.876.876' });
    expect(emitido.status).toBe(201);
    const c = emitido.data.certificado;
    expect(c.codigo).toMatch(formatoDeCodigo);
    expect(c).toMatchObject({
      estado: 'vigente', titular: 'Ana María Restrepo', documento: '1.045.876.876',
      curso: 'Buenas prácticas de documentación', horas: 2.5, ciudad: 'Medellín',
    });

    const otraVez = await p.post(`/me/courses/${curso.id}/certificate`, { documento: '999999' });
    expect(otraVez.data.certificado.codigo).toBe(c.codigo);
    expect(otraVez.data.certificado.documento).toBe('1.045.876.876');

    // La portada del curso ya lo enlaza.
    expect((await p.get(`/me/courses/${curso.id}`)).data.certificate).toMatchObject({ code: c.codigo, status: 'emitido' });
  });

  it('lo emitido no cambia aunque cambien el título del curso o el nombre de la cuenta', async () => {
    await a.patch(`/admin/courses/${curso.id}`, { title: 'Documentación farmacéutica' });
    await t.db.query(`UPDATE aula_users SET first_name = 'Otra' WHERE id = $1`, [participante.id]);
    const { data } = await p.get(`/me/courses/${curso.id}/certificate`);
    expect(data.certificado).toMatchObject({ titular: 'Ana María Restrepo', curso: 'Buenas prácticas de documentación' });
  });

  it('se verifica en público por su código sin mostrar el documento completo', async () => {
    const { data } = await p.get(`/me/courses/${curso.id}/certificate`);
    const r = await pedirPublico(`/certificados/${data.certificado.codigo.toLowerCase()}`);
    expect(r.status).toBe(200);
    expect(r.headers.get('cache-control')).toBe('no-store');
    expect(r.headers.get('x-robots-tag')).toMatch(/noindex/);
    const v = (await r.json()).data;
    expect(v).toMatchObject({
      codigo: data.certificado.codigo, estado: 'vigente', titular: 'Ana María Restrepo', horas: 2.5,
      emisor: { nombre: 'Edvanta S.A.S.', nit: '902.120.527-6' },
    });
    expect(v.documento).toBe('••••••6876');
    expect(v).not.toHaveProperty('id');
    for (const codigo of ['EDV-2222-2222', 'nada', 'EDV-0000-0000']) {
      expect((await pedirPublico(`/certificados/${codigo}`)).status, codigo).toBe(404);
    }
  });

  it('revocar deja constancia, la verificación lo dice y no se vuelve a emitir', async () => {
    const lista = await a.get(`/admin/courses/${curso.id}/certificates`);
    expect(lista.data).toHaveLength(1);
    const [c] = lista.data;
    expect((await a.post(`/admin/certificates/${c.id}/revoke`, { motivo: 'x' })).status).toBe(400);
    const revocado = await a.post(`/admin/certificates/${c.id}/revoke`, { motivo: 'Emitido por error en una prueba' });
    expect(revocado.status).toBe(200);
    expect(revocado.data.estado).toBe('revocado');

    const v = (await (await pedirPublico(`/certificados/${c.codigo}`)).json()).data;
    expect(v.estado).toBe('revocado');
    expect(v.revocadoEl).toBeTruthy();
    const otraVez = await p.post(`/me/courses/${curso.id}/certificate`, {});
    expect(otraVez.status).toBe(409);
    expect(otraVez.data.error.code).toBe('certificado_revocado');

    const { rows } = await t.db.query(`SELECT action FROM aula_audit_log WHERE entity_type = 'certificado' ORDER BY id`);
    expect(rows.map((r) => r.action)).toEqual(['certificado.emitir', 'certificado.revocar']);
  });

  it('quien no tiene el curso no puede consultarlo ni pedirlo', async () => {
    const otra = await seedUser(t.db, { email: 'otra@pharmarket.co' });
    const o = t.client();
    await o.login(otra.email, otra.password);
    expect((await o.get(`/me/courses/${curso.id}/certificate`)).status).toBe(404);
    expect((await o.post(`/me/courses/${curso.id}/certificate`, {})).status).toBe(404);
  });
});

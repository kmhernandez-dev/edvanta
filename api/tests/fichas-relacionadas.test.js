/**
 * Cursos relacionados en el HTML del servidor de una ficha propia.
 *
 * Hallazgo del Agente de Crecimiento (19-nov-2026): 12 fichas propias
 * enlazaban menos de 3 cursos porque solo se buscaban los de su misma
 * categoría. Ahora, si la categoría no alcanza, se completan con los de
 * la misma área grande, primero los de la categoría.
 */
import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';
import { crearRutasPublicas } from '../routes/paginas-publicas.js';

const PLANTILLA = `<!doctype html><html><head>
<title>Edvanta</title>
<meta name="description" content="x" />
<link rel="canonical" href="https://edvanta.test/" />
</head><body><div id="root"></div></body></html>`;

describe('fichas propias · cursos relacionados', () => {
  let t;
  let a;
  let server;
  let publico;
  const cursos = {};

  const crear = async (clave, title, { category, area }) => {
    const course = (await a.post('/admin/courses', { title, kind: 'edvanta', durationMinutes: 60 })).data;
    const m = (await a.post(`/admin/courses/${course.id}/modules`, { title: 'Única' })).data;
    const l = (await a.post(`/admin/modules/${m.id}/lessons`, { title: 'Clase' })).data;
    await a.post(`/admin/lessons/${l.id}/blocks`, { type: 'texto', data: { html: '<p>Clase</p>' } });
    await t.db.query('UPDATE aula_courses SET category = $2, area = $3 WHERE id = $1', [course.id, category, area]);
    const res = await a.post(`/admin/courses/${course.id}/publish`, { changeSummary: 'Publicar' });
    expect(res.status, JSON.stringify(res.data)).toBeLessThan(300);
    const { rows } = await t.db.query(
      `SELECT slug FROM public_slugs WHERE entity = 'aula' AND entity_id = $1 AND is_current`, [course.id],
    );
    cursos[clave] = { id: course.id, slug: rows[0].slug };
  };

  beforeAll(async () => {
    t = await startTestApp();
    const admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);

    // Una categoría pequeña (solo radiofármacos) dentro de un área grande.
    await crear('radio', 'Curso de asuntos regulatorios de radiofármacos', { category: 'Radiofármacos', area: 'Asuntos Regulatorios' });
    await crear('registro', 'Curso de registro sanitario de medicamentos', { category: 'Registro sanitario', area: 'Asuntos Regulatorios' });
    await crear('dossier', 'Curso de elaboración de dossiers farmacéuticos', { category: 'Registro sanitario', area: 'Asuntos Regulatorios' });
    await crear('etiquetado', 'Curso de etiquetado e insertos de medicamentos', { category: 'Registro sanitario', area: 'Asuntos Regulatorios' });
    // Otra área: no debe colarse.
    await crear('bpm', 'Curso de buenas prácticas de manufactura', { category: 'BPM', area: 'Calidad' });
    // Misma categoría que BPM, para comprobar que la categoría va primero.
    await crear('bpl', 'Curso de buenas prácticas de laboratorio', { category: 'BPM', area: 'Calidad' });

    const app = express();
    app.use('/api', crearRutasPublicas({ db: t.db, sitio: 'https://edvanta.test', obtenerPlantilla: async () => PLANTILLA }));
    server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    publico = `http://127.0.0.1:${server.address().port}/api`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server?.close(resolve));
    await t?.close?.();
  });

  const relacionados = async (clave) => {
    const html = await (await fetch(`${publico}/paginas/slug/${cursos[clave].slug}`)).text();
    const bloque = (html.match(/<h2>Cursos relacionados<\/h2>([\s\S]*?)<\/section>/) || [])[1] || '';
    return [...bloque.matchAll(/href="\/([^"]+)"/g)].map((m) => m[1]);
  };

  it('una categoría pequeña se completa con cursos de la misma área', async () => {
    const enlaces = await relacionados('radio');
    expect(enlaces).toHaveLength(3);
    expect(enlaces).toEqual(expect.arrayContaining([cursos.registro.slug, cursos.dossier.slug, cursos.etiquetado.slug]));
    expect(enlaces).not.toContain(cursos.bpm.slug);
    expect(enlaces).not.toContain(cursos.radio.slug);
  });

  it('los de la misma categoría van primero', async () => {
    const enlaces = await relacionados('bpm');
    expect(enlaces[0]).toBe(cursos.bpl.slug);
    expect(enlaces).not.toContain(cursos.registro.slug);
  });
});

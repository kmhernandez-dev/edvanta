/**
 * Direcciones del aula con nombre: /aula/curso-de-…/clase/<clase>.
 *
 * Lo que no puede fallar:
 *  - el curso se abre por su slug y cada clase tiene el suyo, asignados al
 *    publicar y fijos aunque cambie el título;
 *  - el avance, los apuntes y los comentarios siguen colgando del id;
 *  - un curso de empresa lleva el nombre de la institución, no le quita el
 *    nombre corto al catálogo y su dirección nunca sale del aula.
 */
import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { seedUser, startTestApp } from './helpers.js';
import { asegurarSlugsDeClases, cambiarSlug, candidatosDeSlug, slugDeClase } from '../lib/slugs-publicos.js';
import { crearRutasPublicas } from '../routes/paginas-publicas.js';

const PLANTILLA = `<!doctype html><html><head>
<title>Edvanta</title>
<meta name="description" content="x" />
<link rel="canonical" href="https://edvanta.co/" />
</head><body><div id="root"></div></body></html>`;

describe('aula · slugs de clase', () => {
  it('salen del título, sin tildes, cortos y nunca solo un número', () => {
    expect(slugDeClase('Introducción: ¿qué es la calidad?')).toBe('introduccion-que-es-la-calidad');
    expect(slugDeClase('2026')).toBe('clase-2026');
    expect(slugDeClase('¿?')).toBe('clase');
    const largo = slugDeClase('Metformina: mecanismo de acción, dosis, ajustes por función renal y efectos adversos más frecuentes');
    expect(largo.length).toBeLessThanOrEqual(60);
    expect(largo).not.toMatch(/-(de|y|por)$/);
  });

  it('el curso de una empresa nunca toma el nombre corto', () => {
    const [primero, segundo] = candidatosDeSlug({ titulo: 'Gestión de calidad', entidad: 'aula', empresa: 'Pharmarket S.A.S.' });
    expect(primero).toBe('curso-de-gestion-de-calidad-para-pharmarket-s-a-s');
    expect(segundo).toBe(`${primero}-2`);
    const largo = candidatosDeSlug({ titulo: 'x '.repeat(60), entidad: 'aula', empresa: 'Laboratorios de una institución con un nombre muy largo' });
    for (const c of largo) expect(c.length).toBeLessThanOrEqual(80);
  });
});

describe('aula · direcciones con nombre', () => {
  let t;
  let a;
  let p;
  let publico;
  let empresa;
  let deEmpresa;
  let deEdvanta;
  let clases;
  let participante;

  const publicar = async (course) => {
    const res = await a.post(`/admin/courses/${course.id}/publish`, { changeSummary: 'Cambios de prueba' });
    expect(res.status, JSON.stringify(res.data)).toBeLessThan(300);
  };
  const crearCurso = async (body, titulos) => {
    const course = (await a.post('/admin/courses', body)).data;
    const m = (await a.post(`/admin/courses/${course.id}/modules`, { title: 'Único' })).data;
    const lista = [];
    for (const title of titulos) {
      const l = (await a.post(`/admin/modules/${m.id}/lessons`, { title })).data;
      await a.post(`/admin/lessons/${l.id}/blocks`, { type: 'texto', data: { html: `<p>${title}</p>` } });
      lista.push(l);
    }
    return { course, module: m, lessons: lista };
  };
  const pedirPublico = (ruta) => fetch(`${publico}${ruta}`, { redirect: 'manual' });

  beforeAll(async () => {
    t = await startTestApp();
    const admin = await seedUser(t.db, { email: 'admin@edvanta.co', role: 'admin' });
    a = t.client();
    await a.login(admin.email, admin.password);
    empresa = (await a.post('/admin/companies', { name: 'Pharmarket' })).data;

    // Primero el de empresa, con el mismo nombre que uno del catálogo.
    const e = await crearCurso(
      { title: 'Gestión de calidad', kind: 'empresa', companyId: empresa.id },
      ['Introducción: ¿qué es la calidad?', 'Repaso', 'Repaso', '2026'],
    );
    deEmpresa = e.course;
    clases = { intro: e.lessons[0], repaso: e.lessons[1], repaso2: e.lessons[2], anio: e.lessons[3], modulo: e.module };
    await publicar(deEmpresa);
    deEdvanta = (await crearCurso({ title: 'Gestión de calidad', kind: 'edvanta' }, ['Bienvenida'])).course;
    await publicar(deEdvanta);

    participante = await seedUser(t.db, { email: 'ana@pharmarket.co', companyId: empresa.id });
    await a.post('/admin/assignments', { courseIds: [deEmpresa.id], targetType: 'usuario', targetIds: [participante.id] });
    p = t.client();
    await p.login(participante.email, participante.password);

    const app = express();
    app.use('/api', crearRutasPublicas({ db: t.db, sitio: 'https://edvanta.test', obtenerPlantilla: async () => PLANTILLA }));
    const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    publico = `http://127.0.0.1:${server.address().port}/api`;
    t.cerrarPublico = () => new Promise((resolve) => server.close(resolve));
  });
  afterAll(async () => {
    await t.cerrarPublico?.();
    await t.close();
  });

  it('publicar le da nombre al curso y a cada clase; el catálogo conserva el corto', async () => {
    const res = await p.get(`/me/courses/${deEmpresa.id}`);
    expect(res.status).toBe(200);
    expect(res.data.courseId).toBe(Number(deEmpresa.id));
    expect(res.data.courseSlug).toBe('curso-de-gestion-de-calidad-para-pharmarket');
    const slugs = res.data.snapshot.modules[0].lessons.map((l) => l.slug);
    expect(slugs).toEqual(['introduccion-que-es-la-calidad', 'repaso', 'repaso-2', 'clase-2026']);

    const { rows } = await t.db.query(`SELECT slug FROM public_slugs WHERE entity = 'aula' AND entity_id = $1 AND is_current`, [deEdvanta.id]);
    expect(rows[0].slug).toBe('curso-de-gestion-de-calidad');
  });

  it('el curso se abre por su nombre, igual que por su id, y el avance sigue por id', async () => {
    const porId = await p.get(`/me/courses/${deEmpresa.id}`);
    const porNombre = await p.get('/me/courses/curso-de-gestion-de-calidad-para-pharmarket');
    expect(porNombre.status).toBe(200);
    expect(porNombre.data.courseId).toBe(porId.data.courseId);
    expect(porNombre.data.snapshot.modules).toEqual(porId.data.snapshot.modules);
    // La foto de la versión no cambió: la huella no se recalcula por el slug.
    expect(porNombre.data.snapshot.fingerprint).toBeUndefined();
    const abierta = await p.post(`/me/courses/${deEmpresa.id}/lessons/${clases.intro.id}/open`, {});
    expect(abierta.status).toBe(200);

    const lista = await p.get('/me/courses');
    expect(lista.data.find((c) => c.courseId === Number(deEmpresa.id)).slug).toBe('curso-de-gestion-de-calidad-para-pharmarket');
  });

  it('un nombre que no existe, o un curso ajeno, responde igual que si no fuera tuyo', async () => {
    const ajeno = await p.get('/me/courses/curso-de-gestion-de-calidad');
    const inexistente = await p.get('/me/courses/curso-de-nada');
    const raro = await p.get('/me/courses/hola');
    for (const r of [ajeno, inexistente, raro]) {
      expect(r.status).toBe(404);
      expect(r.data.error.message).toBe('No encontramos este curso entre los que tienes asignados.');
    }
  });

  it('abrir el enlace del catálogo inscribe y abre el curso sin paso intermedio', async () => {
    const antes = await p.get('/me/courses/curso-de-gestion-de-calidad');
    expect(antes.status).toBe(404);

    const alta = await p.post('/me/catalog/slug/curso-de-gestion-de-calidad/enroll', {});
    expect(alta.status).toBe(201);
    expect(alta.data.courseId).toBe(Number(deEdvanta.id));

    const despues = await p.get('/me/courses/curso-de-gestion-de-calidad');
    expect(despues.status).toBe(200);
    expect(despues.data.courseId).toBe(Number(deEdvanta.id));
  });

  it('el aviso de asignación ya lleva la dirección con nombre', async () => {
    const { rows } = await t.db.query(
      `SELECT link FROM aula_notifications WHERE user_id = $1 AND type = 'asignacion'`,
      [participante.id],
    );
    expect(rows.map((r) => r.link)).toContain('/aula/curso-de-gestion-de-calidad-para-pharmarket');
  });

  it('el nombre de una clase no cambia aunque cambie su título; las nuevas reciben el suyo', async () => {
    await a.patch(`/admin/lessons/${clases.repaso.id}`, { title: 'Repaso final del módulo' });
    const nueva = (await a.post(`/admin/modules/${clases.modulo.id}/lessons`, { title: 'Evaluación' })).data;
    await a.post(`/admin/lessons/${nueva.id}/blocks`, { type: 'texto', data: { html: '<p>Evaluación</p>' } });
    await publicar(deEmpresa);
    const { rows } = await t.db.query('SELECT id, slug FROM aula_lessons WHERE course_id = $1 ORDER BY id', [deEmpresa.id]);
    const slug = (id) => rows.find((r) => Number(r.id) === Number(id)).slug;
    expect(slug(clases.repaso.id)).toBe('repaso');
    expect(slug(nueva.id)).toBe('evaluacion');
  });

  it('las clases sin nombre lo reciben al arrancar sin mover las demás', async () => {
    await t.db.query('UPDATE aula_lessons SET slug = NULL WHERE id = $1', [clases.anio.id]);
    expect(await asegurarSlugsDeClases(t.db, deEmpresa.id)).toBe(1);
    // Las sembradas por migración (sin publicar por el aula) también lo reciben.
    expect(await asegurarSlugsDeClases(t.db)).toBeGreaterThan(0);
    expect((await t.db.query('SELECT COUNT(*)::int AS n FROM aula_lessons WHERE slug IS NULL')).rows[0].n).toBe(0);
    const { rows } = await t.db.query('SELECT id, slug FROM aula_lessons WHERE course_id = $1', [deEmpresa.id]);
    expect(rows.find((r) => Number(r.id) === Number(clases.anio.id)).slug).toBe('clase-2026');
    expect(rows.find((r) => Number(r.id) === Number(clases.intro.id)).slug).toBe('introduccion-que-es-la-calidad');
  });

  it('un nombre anterior del curso sigue abriendo el curso y dice cuál es el vigente', async () => {
    await cambiarSlug(t.db, { entidad: 'aula', id: deEmpresa.id, nuevo: 'curso-de-calidad-para-pharmarket' });
    const viejo = await p.get('/me/courses/curso-de-gestion-de-calidad-para-pharmarket');
    expect(viejo.status).toBe(200);
    expect(viejo.data.courseSlug).toBe('curso-de-calidad-para-pharmarket');
  });

  it('la dirección de un curso de empresa nunca sale del aula', async () => {
    for (const slug of ['curso-de-calidad-para-pharmarket', 'curso-de-gestion-de-calidad-para-pharmarket']) {
      const r = await pedirPublico(`/paginas/slug/${slug}`);
      expect(r.status, slug).toBe(404);
      expect(await r.text()).toContain('noindex');
      // Con mayúsculas se normaliza como cualquier dirección: no delata que existe.
      const mayus = await pedirPublico(`/paginas/slug/${slug.toUpperCase()}`);
      expect(mayus.headers.get('location')).toBe(`https://edvanta.test/${slug}`);
    }
    const tabla = await (await pedirPublico('/direcciones')).json();
    expect(tabla.data.some((f) => /pharmarket/.test(`${f.antigua} ${f.nueva}`))).toBe(false);
    expect(tabla.data.some((f) => f.nueva === '/curso-de-gestion-de-calidad')).toBe(true);
    const sitemap = await (await pedirPublico('/sitemap-cursos.xml')).text();
    expect(sitemap).toContain('https://edvanta.test/curso-de-gestion-de-calidad<');
    expect(sitemap).not.toContain('pharmarket');
    expect((await pedirPublico('/paginas/slug/curso-de-gestion-de-calidad')).status).toBe(200);
  });
});

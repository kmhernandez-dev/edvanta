/**
 * Direcciones públicas de los cursos (/curso-de-…).
 *
 * Lo que no puede fallar:
 *  - el slug sale del nombre real, sin tildes ni números de relleno;
 *  - dos cursos nunca comparten dirección, y lo que los diferencia es real;
 *  - una vez asignada, la dirección no cambia aunque cambie el título;
 *  - toda dirección vieja llega a la nueva en UN salto 301;
 *  - la página nueva trae su título, su canonical y sus datos
 *    estructurados escritos en el HTML (las redes no ejecutan JS).
 */
import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createTestDb } from './helpers.js';
import {
  asegurarSlugsDeCursos, cambiarSlug, nombreDeCurso, resolverSlug, rutasDeReferencias, slugBaseDeCurso, slugify,
} from '../lib/slugs-publicos.js';
import { conMetadatos, crearRutasPublicas } from '../routes/paginas-publicas.js';

const PLANTILLA = `<!doctype html><html><head>
<title>Edvanta</title>
<meta name="description" content="x" />
<link rel="canonical" href="https://edvanta.co/" />
<meta property="og:type" content="website" />
<meta property="og:title" content="x" />
<meta property="og:description" content="x" />
<meta property="og:url" content="https://edvanta.co/" />
<meta property="og:image" content="https://edvanta.co/img/x.jpg" />
<meta name="twitter:title" content="x" />
<meta name="twitter:description" content="x" />
<meta name="twitter:image" content="https://edvanta.co/img/x.jpg" />
</head><body><div id="root"></div></body></html>`;

describe('slugs de curso · reglas', () => {
  it('normaliza tildes, eñes y símbolos', () => {
    expect(slugify('Gestión de Calidad & Auditoría Ñandú')).toBe('gestion-de-calidad-y-auditoria-nandu');
    expect(slugify('  ISO 9001:2015 — Implementación  ')).toBe('iso-9001-2015-implementacion');
  });

  it('usa el patrón curso-de-nombre-del-curso', () => {
    expect(slugBaseDeCurso('Gestión de calidad')).toBe('curso-de-gestion-de-calidad');
    expect(slugBaseDeCurso('Curso de Farmacoterapia de la Diabetes')).toBe('curso-de-farmacoterapia-de-la-diabetes');
    expect(slugBaseDeCurso('Curso Integral de Excel')).toBe('curso-integral-de-excel');
    expect(slugBaseDeCurso('Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad')).toBe('curso-de-central-de-mezclas');
    expect(slugBaseDeCurso('Master Claude Code: Agentes de IA')).toBe('curso-de-master-claude-code-agentes-de-ia');
  });

  it('acorta solo lo que no cabe, sin cortar en «de» o «and»', () => {
    const s = slugBaseDeCurso('Statistics, Biostatistics and Data Analysis from Scratch for Healthcare Professionals and Researchers');
    expect(s.length).toBeLessThanOrEqual(70);
    expect(s).not.toMatch(/-(de|and|for|from|y)$/);
  });

  it('el título visible dice «Curso de …» salvo que ya diga lo que es', () => {
    expect(nombreDeCurso('Gestión de calidad')).toBe('Curso de Gestión de calidad');
    expect(nombreDeCurso('Curso de Farmacología Renal')).toBe('Curso de Farmacología Renal');
    expect(nombreDeCurso('Certificado Profesional de Google Data Analytics')).toBe('Certificado Profesional de Google Data Analytics');
  });
});

describe('slugs de curso · base de datos y rutas', () => {
  let pglite;
  let db;
  let server;
  let base;
  const ids = {};

  const insertarPropio = async (titulo, { estado = 'publicado', kind = 'edvanta', companyId = null } = {}) => {
    const { rows } = await db.query(
      `INSERT INTO aula_courses (kind, company_id, title, status, short_description, published_at)
       VALUES ($1, $2, $3, $4, 'Resumen del curso para la ficha.', NOW()) RETURNING id`,
      [kind, companyId, titulo, estado],
    );
    const id = rows[0].id;
    const { rows: v } = await db.query(
      `INSERT INTO aula_course_versions (course_id, version_number, snapshot) VALUES ($1, 1, '{"modules":[]}') RETURNING id`,
      [id],
    );
    await db.query('UPDATE aula_courses SET current_version_id = $2 WHERE id = $1', [id, v[0].id]);
    return Number(id);
  };
  const insertarCurado = async (titulo, slug, provider, extra = {}) => {
    const { rows } = await db.query(
      `INSERT INTO courses (title, slug, provider, provider_course_id, short_description, active, category)
       VALUES ($1, $2, $3, $4, 'Curso del catálogo.', TRUE, $5) RETURNING id`,
      [titulo, slug, provider, extra.codigo || null, extra.categoria || 'Calidad'],
    );
    return Number(rows[0].id);
  };

  beforeAll(async () => {
    ({ pglite, db } = await createTestDb());
    ids.diabetes = await insertarPropio('Curso de Farmacoterapia de la Diabetes');
    ids.cardio = await insertarPropio('Curso de Farmacología Cardiovascular');
    ids.borrador = await insertarPropio('Curso en preparación', { estado: 'borrador' });
    ids.cardioEdutin = await insertarCurado('Farmacología cardiovascular', 'farmacologia-cardiovascular-20799', 'edutin', { codigo: 'sh-20799' });
    ids.calidad = await insertarCurado('Gestión de calidad', 'gestion-de-calidad', 'edutin', { codigo: 'sh-9060' });
    ids.excel = await insertarCurado('Especialización en Excel', 'coursera-especializacion-en-excel', 'coursera');
    await asegurarSlugsDeCursos(db);

    const app = express();
    app.use('/api', crearRutasPublicas({ db, sitio: 'https://edvanta.test', obtenerPlantilla: async () => PLANTILLA }));
    server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    base = `http://127.0.0.1:${server.address().port}`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
    await pglite.close();
  });

  const pedir = (ruta) => fetch(`${base}${ruta}`, { redirect: 'manual' });

  it('da un slug a cada curso público; el propio gana el nombre corto', async () => {
    expect((await resolverSlug(db, 'curso-de-farmacologia-cardiovascular')).id).toBe(ids.cardio);
    const edutin = await resolverSlug(db, 'curso-de-farmacologia-cardiovascular-en-edutin');
    expect(edutin).toMatchObject({ entidad: 'curado', id: ids.cardioEdutin, esVigente: true });
    expect((await resolverSlug(db, 'curso-de-gestion-de-calidad')).id).toBe(ids.calidad);
    expect((await resolverSlug(db, 'curso-de-especializacion-en-excel')).id).toBe(ids.excel);
    // Un borrador todavía no es público: no tiene dirección.
    const { rows } = await db.query("SELECT 1 FROM public_slugs WHERE entity = 'aula' AND entity_id = $1", [ids.borrador]);
    expect(rows).toHaveLength(0);
  });

  it('la dirección no cambia aunque cambie el título', async () => {
    await db.query("UPDATE aula_courses SET title = 'Diabetes: farmacoterapia avanzada' WHERE id = $1", [ids.diabetes]);
    await asegurarSlugsDeCursos(db);
    const { rows } = await db.query("SELECT slug FROM public_slugs WHERE entity = 'aula' AND entity_id = $1", [ids.diabetes]);
    expect(rows.map((r) => r.slug)).toEqual(['curso-de-farmacoterapia-de-la-diabetes']);
    await db.query("UPDATE aula_courses SET title = 'Curso de Farmacoterapia de la Diabetes' WHERE id = $1", [ids.diabetes]);
  });

  it('las direcciones viejas llegan a la nueva en un solo 301, con su consulta', async () => {
    const propio = await pedir(`/api/paginas/curso/${ids.diabetes}?utm_source=boletin`);
    expect(propio.status).toBe(301);
    expect(propio.headers.get('location')).toBe('https://edvanta.test/aula/curso-de-farmacoterapia-de-la-diabetes?utm_source=boletin');

    const curado = await pedir('/api/paginas/cursos/farmacologia-cardiovascular-20799');
    expect(curado.status).toBe(301);
    expect(curado.headers.get('location')).toBe('https://edvanta.test/curso-de-farmacologia-cardiovascular-en-edutin');

    const gratis = await pedir('/api/paginas/cursos-gratis/SH-9060');
    expect(gratis.headers.get('location')).toBe('https://edvanta.test/curso-de-gestion-de-calidad');

    // El destino de un curado no vuelve a redirigir: es la página final.
    const destino = await pedir('/api/paginas/slug/curso-de-farmacologia-cardiovascular-en-edutin');
    expect(destino.status).toBe(200);
  });

  it('la ficha nueva de un curso curado trae título, canonical, redes y datos estructurados', async () => {
    const r = await pedir('/api/paginas/slug/curso-de-farmacologia-cardiovascular-en-edutin');
    const html = await r.text();
    expect(html).toContain('<title>Curso de Farmacolog');
    expect(html).toContain('cardiovascular | Edvanta</title>');
    expect(html).toContain('<link rel="canonical" href="https://edvanta.test/curso-de-farmacologia-cardiovascular-en-edutin"');
    expect(html).toContain('<meta property="og:url" content="https://edvanta.test/curso-de-farmacologia-cardiovascular-en-edutin"');
    expect(html).toContain('"@type":"Course"');
    expect(html).toContain('<h1>Curso de Farmacolog');
    expect(html).toContain('cardiovascular</h1>');
    expect(r.headers.get('cache-control')).toContain('no-cache');
  });

  it('los cursos propios redirigen al aula; mayúsculas y barra final también', async () => {
    const mayus = await pedir('/api/paginas/slug/Curso-De-Farmacoterapia-De-La-Diabetes');
    expect(mayus.status).toBe(301);
    expect(mayus.headers.get('location')).toBe('https://edvanta.test/aula/curso-de-farmacoterapia-de-la-diabetes');
    const barra = await pedir('/api/paginas/slug/curso-de-farmacoterapia-de-la-diabetes/');
    expect(barra.headers.get('location')).toBe('https://edvanta.test/aula/curso-de-farmacoterapia-de-la-diabetes');
    const propio = await pedir('/api/paginas/slug/curso-de-farmacoterapia-de-la-diabetes');
    expect(propio.status).toBe(301);
    expect(propio.headers.get('location')).toBe('https://edvanta.test/aula/curso-de-farmacoterapia-de-la-diabetes');

    await cambiarSlug(db, { entidad: 'curado', id: ids.excel, nuevo: 'curso-de-especializacion-en-excel-de-coursera' });
    const viejo = await pedir('/api/paginas/slug/curso-de-especializacion-en-excel');
    expect(viejo.status).toBe(301);
    expect(viejo.headers.get('location')).toBe('https://edvanta.test/curso-de-especializacion-en-excel-de-coursera');
    // El antiguo de la tabla courses también salta directo a la vigente.
    const antiguo = await pedir('/api/paginas/cursos/coursera-especializacion-en-excel');
    expect(antiguo.headers.get('location')).toBe('https://edvanta.test/curso-de-especializacion-en-excel-de-coursera');
  });

  it('una página fija (sin fila en la base) también se normaliza en un salto', async () => {
    const barra = await pedir('/api/paginas/slug/curso-de-pagina-fija/');
    expect(barra.status).toBe(301);
    expect(barra.headers.get('location')).toBe('https://edvanta.test/curso-de-pagina-fija');
    const mayus = await pedir('/api/paginas/slug/Curso-De-Pagina-Fija?utm_source=x');
    expect(mayus.headers.get('location')).toBe('https://edvanta.test/curso-de-pagina-fija?utm_source=x');
  });

  it('lo que no existe o no es público responde 404 sin indexar', async () => {
    for (const ruta of ['/api/paginas/slug/curso-de-nada', `/api/paginas/curso/${ids.borrador}`, '/api/paginas/curso/999999', '/api/paginas/cursos/no-existe']) {
      const r = await pedir(ruta);
      expect(r.status, ruta).toBe(404);
      expect(await r.text(), ruta).toContain('noindex');
    }
  });

  it('las categorías de artículos pasan a su propia dirección', async () => {
    const r = await pedir(`/api/paginas/articulos?categoria=${encodeURIComponent('Gestión de calidad')}`);
    expect(r.status).toBe(301);
    expect(r.headers.get('location')).toBe('https://edvanta.test/articulos/categoria/gestion-de-calidad');
  });

  it('el sitemap de cursos y la tabla de direcciones salen de la base', async () => {
    const xml = await (await pedir('/api/sitemap-cursos.xml')).text();
    // Los propios viven en el aula (noindex): no se anuncian.
    expect(xml).not.toContain('<loc>https://edvanta.test/curso-de-farmacoterapia-de-la-diabetes</loc>');
    expect(xml).toContain('<loc>https://edvanta.test/curso-de-farmacologia-cardiovascular-en-edutin</loc>');
    expect(xml).not.toContain('preparacion');

    const tabla = await (await pedir('/api/direcciones')).json();
    const fila = tabla.data.find((f) => f.antigua === `/curso/${ids.cardio}`);
    expect(fila.nueva).toBe('/curso-de-farmacologia-cardiovascular');
    expect(tabla.data.some((f) => f.antigua === '/curso-de-especializacion-en-excel')).toBe(true);
  });

  it('traduce referencias internas a direcciones públicas', async () => {
    const mapa = await rutasDeReferencias(db, [`edvanta-${ids.cardio}`, 'gestion-de-calidad', 'no-existe']);
    expect(mapa.get(`edvanta-${ids.cardio}`)).toBe('/curso-de-farmacologia-cardiovascular');
    expect(mapa.get('gestion-de-calidad')).toBe('/curso-de-gestion-de-calidad');
    expect(mapa.has('no-existe')).toBe(false);
  });

  it('inyecta los metadatos sin romper la plantilla', () => {
    const html = conMetadatos(PLANTILLA, { titulo: 'A & B', descripcion: '"x"', canonical: 'https://e.co/a', jsonLd: [{ a: '</script>' }] });
    expect(html).toContain('<title>A &amp; B</title>');
    expect(html).toContain('content="&quot;x&quot;"');
    expect(html).toContain('<\\/script>');
  });
});

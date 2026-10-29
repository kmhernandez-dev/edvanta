import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cleanMigrationSql } from '../lib/sql-text.js';
import { slugsDelGrafo } from '../lib/edvanta-catalog.js';
import { SQL_CURSO_PUBLICO, SQL_PORTADA_PUBLICA, temarioPublico } from '../routes/courses.js';
import { crearRutasPublicas } from '../routes/paginas-publicas.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

async function baseMigrada() {
  const db = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
  const files = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
  for (const file of files) {
    try {
      await db.exec(cleanMigrationSql(readFileSync(path.join(dir, file), 'utf8')));
    } catch (err) {
      throw new Error(`La migración ${file} falla: ${err.message}`);
    }
  }
  return { db, files };
}

describe('migraciones', () => {
  // Una sola base para todo el archivo. Aplicar las migraciones cuesta
  // varios megas de SQL —las de contenido pesan lo suyo— y levantar dos
  // Postgres en memoria para dos comprobaciones de lectura agotaba el
  // proceso: «Worker exited unexpectedly».
  let base;
  beforeAll(async () => { base = await baseMigrada(); }, 240_000);
  afterAll(async () => { await base?.db.close(); });

  it('quita el BOM que dejan algunos editores de Windows', () => {
    expect(cleanMigrationSql('﻿-- hola\nSELECT 1;')).toBe('-- hola\nSELECT 1;');
    expect(cleanMigrationSql('SELECT 1;')).toBe('SELECT 1;');
  });

  // Reproduce el arranque de producción: todas las migraciones, en orden,
  // limpiadas igual que lo hace lib/migrate.js. Si una falla, baseMigrada
  // lanza con el nombre del archivo y el migrador real se detendría ahí.
  it('aplica todas las migraciones en orden sobre una base vacía', () => {
    const aplicadas = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
    expect(aplicadas).toEqual(base.files);
  });

  // La ficha pública de un curso se consulta desde fuera del aula, con el
  // pool global, así que no la cubren las pruebas del aula. Lo que puede
  // romperse en silencio es el nombre de una columna: si alguien renombra
  // una, esto falla aquí y no en producción.
  it('las consultas públicas de curso casan con el esquema', async () => {
    expect((await base.db.query(SQL_CURSO_PUBLICO, [1])).rows).toEqual([]);
    expect((await base.db.query(SQL_PORTADA_PUBLICA, [1])).rows).toEqual([]);
  });

  // ── Direcciones de carreras, rutas y competencias (060) ─────

  const slugsDe = async (tabla) => new Set((await base.db.query(`SELECT slug FROM ${tabla}`)).rows.map((r) => r.slug));

  it('carreras, rutas y competencias quedan con su nombre en español y el viejo en el historial', async () => {
    const carreras = await slugsDe('careers');
    const rutas = await slugsDe('learning_paths');
    const competencias = await slugsDe('skills');
    for (const s of ['aseguramiento-de-calidad', 'control-de-calidad', 'datos-para-la-industria-farmaceutica', 'investigacion-y-desarrollo']) expect(carreras.has(s), s).toBe(true);
    for (const s of ['aseguramiento-calidad', 'datos-farma', 'inteligencia-artificial-farma']) expect(carreras.has(s), s).toBe(false);
    for (const s of ['aseguramiento-de-calidad-desde-cero', 'asuntos-regulatorios', 'datos-para-la-industria-farmaceutica']) expect(rutas.has(s), s).toBe(true);
    for (const s of ['quality-assurance-desde-cero', 'regulatory-affairs', 'data-y-pharma']) expect(rutas.has(s), s).toBe(false);
    for (const s of ['buenas-practicas-de-manufactura', 'resultados-fuera-de-especificacion-oos-y-oot', 'hoja-de-vida-profesional', 'control-de-cambios']) expect(competencias.has(s), s).toBe(true);
    for (const s of ['bpm-gmp', 'oos-oot', 'cv-profesional', 'change-control']) expect(competencias.has(s), s).toBe(false);

    // Cada nombre viejo apunta a su registro, que hoy tiene el nuevo.
    const { rows } = await base.db.query(
      `SELECT a.tipo, a.anterior, COALESCE(c.slug, p.slug, s.slug) AS actual FROM slugs_anteriores a
         LEFT JOIN careers c ON a.tipo = 'carrera' AND c.id = a.entidad_id
         LEFT JOIN learning_paths p ON a.tipo = 'ruta' AND p.id = a.entidad_id
         LEFT JOIN skills s ON a.tipo = 'competencia' AND s.id = a.entidad_id`,
    );
    const de = Object.fromEntries(rows.map((r) => [`${r.tipo}:${r.anterior}`, r.actual]));
    expect(de['carrera:aseguramiento-calidad']).toBe('aseguramiento-de-calidad');
    expect(de['ruta:regulatory-affairs']).toBe('asuntos-regulatorios');
    expect(de['competencia:bpm-gmp']).toBe('buenas-practicas-de-manufactura');
    expect(de['competencia:change-control']).toBe('control-de-cambios');
    expect(rows.every((r) => r.actual)).toBe(true);
    // Los nombres visibles también: en español y con tildes.
    const ruta = (await base.db.query(`SELECT name, seo_title FROM learning_paths WHERE slug = 'aseguramiento-de-calidad-desde-cero'`)).rows[0];
    expect(ruta).toEqual({ name: 'Aseguramiento de calidad desde cero', seo_title: 'Ruta de aseguramiento de calidad desde cero | Edvanta' });
  });

  it('el grafo de recomendaciones solo usa nombres que existen en la base', async () => {
    const grafo = slugsDelGrafo();
    const existen = { carreras: await slugsDe('careers'), rutas: await slugsDe('learning_paths'), competencias: await slugsDe('skills') };
    for (const [tipo, lista] of Object.entries(grafo)) {
      expect(lista.length, tipo).toBeGreaterThan(0);
      expect(lista.filter((s) => !existen[tipo].has(s)), tipo).toEqual([]);
    }
  });

  it('las páginas de carrera, ruta y competencia: 200 con su título, 301 desde el nombre viejo, 404 si no existe', async () => {
    const plantilla = '<!doctype html><html><head><title>Edvanta</title><meta name="description" content="x" /><link rel="canonical" href="https://edvanta.co/" /></head><body><div id="root"></div></body></html>';
    const app = express();
    app.use('/api', crearRutasPublicas({ db: base.db, sitio: 'https://edvanta.test', obtenerPlantilla: async () => plantilla }));
    const server = await new Promise((resolve) => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    const pedir = (ruta) => fetch(`http://127.0.0.1:${server.address().port}/api${ruta}`, { redirect: 'manual' });
    try {
      const viejo = await pedir('/paginas/carreras/aseguramiento-calidad?utm_source=x');
      expect(viejo.status).toBe(301);
      expect(viejo.headers.get('location')).toBe('https://edvanta.test/carreras/aseguramiento-de-calidad?utm_source=x');
      expect((await pedir('/paginas/rutas/quality-assurance-desde-cero')).headers.get('location'))
        .toBe('https://edvanta.test/rutas/aseguramiento-de-calidad-desde-cero');
      expect((await pedir('/paginas/competencias/bpm-gmp')).headers.get('location'))
        .toBe('https://edvanta.test/competencias/buenas-practicas-de-manufactura');
      expect((await pedir('/paginas/competencias/Control-De-Cambios')).headers.get('location'))
        .toBe('https://edvanta.test/competencias/control-de-cambios');

      const carrera = await pedir('/paginas/carreras/aseguramiento-de-calidad');
      expect(carrera.status).toBe(200);
      const html = await carrera.text();
      expect(html).toContain('<title>Carrera en aseguramiento de calidad farmacéutica | Edvanta</title>');
      expect(html).toContain('<link rel="canonical" href="https://edvanta.test/carreras/aseguramiento-de-calidad"');
      expect(html).toContain('<h1>Aseguramiento de calidad</h1>');
      expect(html).toContain('"@type":"BreadcrumbList"');
      const competencia = await (await pedir('/paginas/competencias/buenas-practicas-de-manufactura')).text();
      expect(competencia).toMatch(/<title>Buenas Prácticas de Manufactura \(BPM\/GMP\): carreras, cursos y rutas \| Edvanta<\/title>/);
      // Las rutas fijas del sitio (sin ficha en la base) también tienen página.
      expect((await pedir('/paginas/rutas/calidad-y-auditoria')).status).toBe(200);

      const nada = await pedir('/paginas/carreras/no-existe');
      expect(nada.status).toBe(404);
      expect(await nada.text()).toContain('noindex');

      const sitemap = await (await pedir('/sitemap-profesional.xml')).text();
      expect(sitemap).toContain('<loc>https://edvanta.test/carreras/aseguramiento-de-calidad</loc>');
      expect(sitemap).toContain('<loc>https://edvanta.test/competencias/buenas-practicas-de-manufactura</loc>');
      expect(sitemap).toContain('<loc>https://edvanta.test/rutas/calidad-y-auditoria</loc>');
      expect(sitemap).not.toMatch(/aseguramiento-calidad<|bpm-gmp|regulatory-affairs/);

      const tabla = await (await pedir('/direcciones')).json();
      expect(tabla.data).toContainEqual(expect.objectContaining({
        entidad: 'competencia', antigua: '/competencias/bpm-gmp', nueva: '/competencias/buenas-practicas-de-manufactura',
      }));
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});

describe('ficha pública de curso · temario', () => {
  it('numera los módulos y enseña títulos y duraciones, nunca el contenido', () => {
    const temario = temarioPublico({
      modules: [
        {
          id: 7,
          title: 'Fundamentos',
          lessons: [
            {
              id: 11,
              title: 'Qué son las BPM',
              durationMinutes: 12,
              isRequired: true,
              blocks: [{ type: 'video', data: { videoId: 'secreto' } }, { type: 'texto', data: { html: '<p>x</p>' } }],
            },
            { id: 12, title: 'Lectura complementaria', durationMinutes: 0, isRequired: false, blocks: [] },
          ],
        },
      ],
    });

    expect(temario).toEqual([{
      id: 7,
      numero: 1,
      title: 'Fundamentos',
      lessons: [
        { id: 11, title: 'Qué son las BPM', durationMinutes: 12, isRequired: true, hasVideo: true },
        { id: 12, title: 'Lectura complementaria', durationMinutes: null, isRequired: false, hasVideo: false },
      ],
    }]);
    // El contenido de la clase no viaja: solo se dice que hay video.
    expect(JSON.stringify(temario)).not.toContain('secreto');
  });

  it('aguanta un snapshot vacío o mal formado sin reventar', () => {
    expect(temarioPublico(null)).toEqual([]);
    expect(temarioPublico({})).toEqual([]);
    expect(temarioPublico({ modules: [{ id: 1, title: 'Sin clases' }] }))
      .toEqual([{ id: 1, numero: 1, title: 'Sin clases', lessons: [] }]);
  });
});

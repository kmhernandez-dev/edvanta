/**
 * Experiencias de clase y clases abiertas.
 *
 * 1. El bloque «experiencia»: validación, conteo de lectura y HTML sin
 *    inyección.
 * 2. Las migraciones de experiencias, como en producción: se aplican
 *    después de publicar los cursos, el arranque publica la versión
 *    aprobada y cada clase queda con su experiencia, sin el texto corto
 *    de la siembra y con sus videos, enlaces y actividades intactos.
 * 3. La clase abierta: datos, HTML para buscadores, temario enlazado y
 *    navegación entre clases.
 */
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { cleanMigrationSql } from '../lib/sql-text.js';
import { fromPglite, many } from '../lib/aula/db.js';
import { publishCourse } from '../lib/aula/courses.js';
import { publicarAprobados, republicarAprobadas } from '../lib/aula/publicaciones.js';
import { readBlockData } from '../lib/aula/blocks.js';
import { validateSnapshot } from '../lib/aula/snapshot.js';
import { asegurarSlugsDeClases, asegurarSlugsDeCursos } from '../lib/slugs-publicos.js';
import {
  ErrorDeExperiencia, caracteresDeExperiencia, htmlDeExperiencia, leerExperiencia,
} from '../lib/experiencia.js';
import {
  clasePublica, cuerpoDeClase, datosDeClase, descripcionDeClase, tituloDeClase,
} from '../lib/clase-publica.js';
import { CLASES as CLASES_VALIDACIONES, CURSO as CURSO_VALIDACIONES } from '../../contenido/experiencias/validaciones/index.mjs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
const privada = (f) => f.includes('_evaluacion_') || f === '063_pedagogia_bpm.sql' || f === '067_pedagogia_bpe.sql';
const CORTE = '077';

const minima = () => ({
  gancho: { titulo: 'Situación', texto: 'Un texto de prueba.' },
  objetivos: ['Aprender algo.'],
  secciones: [{ titulo: 'Sección', parrafos: ['Párrafo.'] }],
  resumen: ['Idea.'],
  referencias: [{ cita: 'Fuente', url: 'https://example.org/doc' }],
});

describe('bloque experiencia', () => {
  it('acepta una experiencia mínima y normaliza los campos opcionales', () => {
    const d = leerExperiencia(minima());
    expect(d.v).toBe(1);
    expect(d.conceptos).toEqual([]);
    expect(d.mapa).toBeUndefined();
  });

  it('exige exactamente una opción correcta en el caso', () => {
    const d = { ...minima(), caso: { titulo: 'C', contexto: 'X', pregunta: '¿?', opciones: [
      { texto: 'A', correcta: true, retro: 'r' }, { texto: 'B', correcta: true, retro: 'r' },
    ] } };
    expect(() => leerExperiencia(d)).toThrow(ErrorDeExperiencia);
  });

  it('rechaza enlaces que no son http(s) y lo convierte en 400 en la API', () => {
    const d = { ...minima(), referencias: [{ cita: 'x', url: 'javascript:alert(1)' }] };
    expect(() => readBlockData('experiencia', d)).toThrow(/http/);
  });

  it('cambia iconos desconocidos por el de reserva', () => {
    const d = leerExperiencia({ ...minima(), conceptos: [{ icono: 'NoExiste', termino: 'T', definicion: 'D' }] });
    expect(d.conceptos[0].icono).toBe('Sparkles');
  });

  it('escapa el HTML y solo admite **negrita**', () => {
    const d = leerExperiencia({ ...minima(), gancho: { titulo: '<script>x</script>', texto: 'Es **clave** & <b>no</b>' } });
    const html = htmlDeExperiencia(d);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<strong>clave</strong>');
    expect(html).toContain('&lt;b&gt;no&lt;/b&gt;');
  });

  it('cada clase de Validaciones pasa la validación y supera 3.000 caracteres de lectura', () => {
    for (const { titulo, ...exp } of CLASES_VALIDACIONES) {
      const d = leerExperiencia(exp);
      expect(caracteresDeExperiencia(d), titulo).toBeGreaterThanOrEqual(3000);
      expect(d.referencias.length, titulo).toBeGreaterThan(0);
    }
  });
});

describe('migraciones de experiencias y clases abiertas', () => {
  let pglite;
  let db;
  const errores = [];

  beforeAll(async () => {
    pglite = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
    const publicas = readdirSync(dir).filter((x) => x.endsWith('.sql') && !privada(x)).sort();
    for (const f of publicas.filter((x) => x < CORTE)) {
      await pglite.exec(cleanMigrationSql(readFileSync(path.join(dir, f), 'utf8')));
    }
    db = fromPglite(pglite);
    await publicarAprobados(db);
    const borradores = await many(db, "SELECT id FROM aula_courses WHERE kind = 'edvanta' AND deleted_at IS NULL AND current_version_id IS NULL");
    for (const c of borradores) {
      try {
        await publishCourse(db, c.id, { changeSummary: '' }, { actor: { id: null, email: null }, ip: null });
      } catch { /* sigue en borrador, igual que en producción */ }
    }
    for (const f of publicas.filter((x) => x >= CORTE)) {
      await pglite.exec(cleanMigrationSql(readFileSync(path.join(dir, f), 'utf8')));
    }
    const log = (e) => { if (e.level === 'error') errores.push(e); };
    await publicarAprobados(db, { log });
    await republicarAprobadas(db, { log });
    await asegurarSlugsDeCursos(db);
    await asegurarSlugsDeClases(db);
  }, 300_000);

  afterAll(async () => { await pglite?.close(); });

  const cursoId = async (titulo) => (await many(db, "SELECT id FROM aula_courses WHERE title = $1 AND kind = 'edvanta' AND deleted_at IS NULL", [titulo]))[0]?.id;

  it('el arranque publica sin errores la versión con las experiencias', async () => {
    expect(errores).toEqual([]);
    const id = await cursoId(CURSO_VALIDACIONES);
    const [v] = await many(db, `SELECT v.snapshot FROM aula_courses c JOIN aula_course_versions v ON v.id = c.current_version_id WHERE c.id = $1`, [id]);
    const lecciones = v.snapshot.modules.flatMap((m) => m.lessons);
    const conExperiencia = lecciones.filter((l) => l.blocks.some((b) => b.type === 'experiencia'));
    expect(conExperiencia).toHaveLength(CLASES_VALIDACIONES.length);
    expect(validateSnapshot(v.snapshot).errors).toEqual([]);
  });

  it('retira el texto corto y conserva videos, enlaces y actividades', async () => {
    const id = await cursoId(CURSO_VALIDACIONES);
    const filas = await many(db, `
      SELECT l.title,
             count(*) FILTER (WHERE b.type = 'texto' AND b.deleted_at IS NULL)::int AS textos,
             count(*) FILTER (WHERE b.type = 'experiencia' AND b.deleted_at IS NULL)::int AS experiencias,
             count(*) FILTER (WHERE b.type IN ('enlace', 'destacado', 'video') AND b.deleted_at IS NULL)::int AS otros,
             min(b.sort_order) FILTER (WHERE b.type = 'experiencia' AND b.deleted_at IS NULL) AS orden
        FROM aula_lessons l JOIN aula_lesson_blocks b ON b.lesson_id = l.id
       WHERE l.course_id = $1 AND l.deleted_at IS NULL
       GROUP BY l.title`, [id]);
    expect(filas).toHaveLength(CLASES_VALIDACIONES.length);
    for (const f of filas) {
      expect(f.textos, f.title).toBe(0);
      expect(f.experiencias, f.title).toBe(1);
      expect(f.otros, f.title).toBeGreaterThan(0);
      expect(f.orden, f.title).toBe(0);
    }
  });

  it('volver a aplicar la migración actualiza sin duplicar', async () => {
    const f = readdirSync(dir).find((x) => x.startsWith('119_'));
    await pglite.exec(cleanMigrationSql(readFileSync(path.join(dir, f), 'utf8')));
    const id = await cursoId(CURSO_VALIDACIONES);
    const [{ n }] = await many(db, `
      SELECT count(*)::int AS n FROM aula_lesson_blocks b JOIN aula_lessons l ON l.id = b.lesson_id
       WHERE l.course_id = $1 AND b.type = 'experiencia' AND b.deleted_at IS NULL`, [id]);
    expect(n).toBe(CLASES_VALIDACIONES.length);
  });

  it('la clase abierta tiene datos, HTML, datos estructurados y navegación', async () => {
    const id = await cursoId(CURSO_VALIDACIONES);
    const [{ slug }] = await many(db, "SELECT slug FROM public_slugs WHERE entity = 'aula' AND entity_id = $1 AND is_current", [id]);
    const [{ slug: claseSlug }] = await many(db, 'SELECT slug FROM aula_lessons WHERE course_id = $1 AND title = $2', [id, 'DQ, IQ, OQ y PQ']);

    const datos = await clasePublica(db, slug, claseSlug);
    expect(datos.clase.titulo).toBe('DQ, IQ, OQ y PQ');
    expect(datos.total).toBe(CLASES_VALIDACIONES.length);
    expect(datos.anterior).not.toBeNull();
    expect(datos.siguiente).not.toBeNull();
    expect(datos.anterior.ruta).toMatch(new RegExp(`^/${slug}/clase/`));

    const html = cuerpoDeClase(datos);
    expect(html).toContain('<h1>DQ, IQ, OQ y PQ</h1>');
    expect(html).toContain(`href="/${slug}"`);
    expect(html).toContain('rel="next"');
    expect(html.length).toBeGreaterThan(8000);

    const canonical = `https://edvanta.co/${slug}/clase/${claseSlug}`;
    const jsonLd = datosDeClase(datos, { canonical, cursoUrl: `https://edvanta.co/${slug}`, inicio: 'https://edvanta.co/' });
    expect(jsonLd.map((x) => x['@type'])).toEqual(['LearningResource', 'BreadcrumbList', 'FAQPage']);
    expect(tituloDeClase(datos).length).toBeLessThanOrEqual(80);
    expect(descripcionDeClase(datos).length).toBeLessThanOrEqual(156);
  });

  it('una clase sin experiencia no tiene página: se redirige al curso', async () => {
    const id = await cursoId('Curso de Farmacología Oncológica');
    const [{ slug }] = await many(db, "SELECT slug FROM public_slugs WHERE entity = 'aula' AND entity_id = $1 AND is_current", [id]);
    const [{ slug: claseSlug }] = await many(db, 'SELECT slug FROM aula_lessons WHERE course_id = $1 AND slug IS NOT NULL ORDER BY id LIMIT 1', [id]);
    const datos = await clasePublica(db, slug, claseSlug);
    expect(datos.clase).toBeNull();
    expect(datos.curso.slug).toBe(slug);
  });
});

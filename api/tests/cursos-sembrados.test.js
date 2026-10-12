/**
 * Los cursos que montan las migraciones de contenido.
 *
 * Una migración de cientos de kilobytes no se puede dar por buena porque
 * «corra sin error»: podría haber creado los cursos vacíos. Y lo que de
 * verdad importa es que el Aula los pueda PUBLICAR, porque publicar arma
 * un snapshot y lo pasa por validateSnapshot; si ahí aparece un fallo,
 * el botón contesta «el curso aún no se puede publicar» y nos
 * enteraríamos con los cursos ya creados en producción.
 *
 * Así que aquí se construye el snapshot real de cada uno y se valida
 * igual que lo hace el botón.
 */
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { cleanMigrationSql } from '../lib/sql-text.js';
import { fromPglite } from '../lib/aula/db.js';
import { buildSnapshot, validateSnapshot } from '../lib/aula/snapshot.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

/** Cada línea de cursos: su categoría y lo que debe haber quedado. */
const LINEAS = [
  { categoria: 'Calidad farmacéutica', cursos: 10, unidades: 50, clases: 338 },
  { categoria: 'Asuntos regulatorios', cursos: 10, unidades: 50, clases: 333 },
  { categoria: 'Asuntos regulatorios — productos especiales', cursos: 10, unidades: 50, clases: 336 },
  { categoria: 'Farmacología', cursos: 12, unidades: 60, clases: 405 },
];

let pglite;
let db;

beforeAll(async () => {
  pglite = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.sql')).sort()) {
    await pglite.exec(cleanMigrationSql(readFileSync(path.join(dir, f), 'utf8')));
  }
  db = fromPglite(pglite);
}, 240_000);

afterAll(async () => { await pglite?.close(); });

describe.each(LINEAS)('cursos de $categoria', ({ categoria, cursos: nCursos, unidades, clases }) => {
  let cursos;

  beforeAll(async () => {
    // El título es lo que separa estas líneas de los cursos que ya
    // existían: «Asuntos Regulatorios Sanitarios ante INVIMA», de la
    // migración 034, comparte categoría con esta tanda y se colaba en la
    // cuenta. Los de estos archivos empiezan todos por «Curso de ».
    cursos = (await pglite.query(
      `SELECT id, title, status, duration_minutes FROM aula_courses
        WHERE category = $1 AND kind = 'edvanta' AND deleted_at IS NULL
          AND title LIKE 'Curso de %'
        ORDER BY id`,
      [categoria],
    )).rows;
  });

  it('están todos y en borrador', () => {
    expect(cursos).toHaveLength(nCursos);
    // Publicar es una decisión que se toma mirando el curso.
    expect(cursos.every((c) => c.status === 'borrador')).toBe(true);
  });

  it('la estructura es la que declara el archivo de origen', async () => {
    const ids = cursos.map((c) => c.id);
    const [{ m }] = (await pglite.query(
      'SELECT COUNT(*)::int AS m FROM aula_modules WHERE course_id = ANY($1)', [ids],
    )).rows;
    const [{ l }] = (await pglite.query(
      'SELECT COUNT(*)::int AS l FROM aula_lessons WHERE course_id = ANY($1)', [ids],
    )).rows;
    expect(m).toBe(unidades);
    expect(l).toBe(clases);
  });

  it('ninguna clase se queda hueca ni ningún módulo sin clases', async () => {
    const ids = cursos.map((c) => c.id);
    const [{ huecas }] = (await pglite.query(
      `SELECT COUNT(*)::int AS huecas FROM aula_lessons l
        WHERE l.course_id = ANY($1)
          AND (btrim(coalesce(l.title, '')) = '' OR btrim(coalesce(l.subtitle, '')) = ''
               OR NOT EXISTS (SELECT 1 FROM aula_lesson_blocks b WHERE b.lesson_id = l.id))`,
      [ids],
    )).rows;
    expect(huecas).toBe(0);

    const { rows: vacios } = await pglite.query(
      `SELECT m.title FROM aula_modules m
        WHERE m.course_id = ANY($1)
          AND NOT EXISTS (SELECT 1 FROM aula_lessons l WHERE l.module_id = m.id AND l.deleted_at IS NULL)`,
      [ids],
    );
    expect(vacios.map((r) => r.title)).toEqual([]);
  });

  it('los bloques están bien formados y solo apuntan a http(s)', async () => {
    const ids = cursos.map((c) => c.id);
    const [{ rotos }] = (await pglite.query(
      `SELECT COUNT(*)::int AS rotos
         FROM aula_lesson_blocks b JOIN aula_lessons l ON l.id = b.lesson_id
        WHERE l.course_id = ANY($1)
          AND ((b.type = 'video'  AND (b.data->>'videoId' IS NULL OR b.data->>'provider' IS NULL))
            OR (b.type = 'enlace' AND (b.data->>'url' IS NULL OR b.data->>'title' IS NULL))
            OR (b.type = 'texto'  AND btrim(coalesce(b.data->>'html', '')) = ''))`,
      [ids],
    )).rows;
    expect(rotos).toBe(0);

    // Aquí es donde se colaría un javascript: si alguien edita el origen.
    const [{ raros }] = (await pglite.query(
      `SELECT COUNT(*)::int AS raros
         FROM aula_lesson_blocks b JOIN aula_lessons l ON l.id = b.lesson_id
        WHERE l.course_id = ANY($1) AND b.type IN ('enlace', 'video')
          AND b.data->>'url' !~* '^https?://'`,
      [ids],
    )).rows;
    expect(raros).toBe(0);
  });

  it('todos pasan la validación de publicar', async () => {
    const fallos = [];
    for (const c of cursos) {
      const snapshot = await buildSnapshot(db, c.id);
      const { errors } = validateSnapshot(snapshot, { status: 'borrador', kind: 'edvanta' });
      if (errors.length) fallos.push(`${c.title}: ${errors.slice(0, 3).map((e) => e.message).join(' | ')}`);
    }
    expect(fallos).toEqual([]);
  }, 240_000);
});

describe('las tres categorías con las que se agrupan', () => {
  it('cada curso profesional cae en una, y solo en una', async () => {
    const { rows } = await pglite.query(
      `SELECT area, COUNT(*)::int AS n FROM aula_courses
        WHERE kind = 'edvanta' AND deleted_at IS NULL
        GROUP BY area ORDER BY area NULLS LAST`,
    );
    const porArea = Object.fromEntries(rows.map((r) => [r.area ?? '(sin área)', r.n]));

    // Son tres y solo tres: si aparece una cuarta, alguien creó una
    // categoría nueva sin decidir dónde encaja.
    const areas = rows.map((r) => r.area).filter(Boolean).sort();
    expect(areas).toEqual(['Asuntos Regulatorios', 'Calidad', 'Farmacología']);

    expect(porArea['Calidad']).toBe(14);               // 10 sembrados + 4 anteriores
    expect(porArea['Asuntos Regulatorios']).toBe(21);  // 10 + 10 + el que ya existía
    expect(porArea['Farmacología']).toBe(12);
    // Autocuidado de la tiroides se queda fuera a propósito: es para
    // pacientes, no formación profesional.
    expect(porArea['(sin área)']).toBe(1);
  });

  // Una portada mal puesta no da error: el curso sale con la imagen de
  // otro y nadie se entera hasta que lo ve un alumno.
  it('las portadas apuntan a un archivo que existe, y ninguna se repite', async () => {
    const { rows } = await pglite.query(
      `SELECT title, cover_url FROM aula_courses
        WHERE kind = 'edvanta' AND deleted_at IS NULL AND cover_url LIKE '/img/%'
        ORDER BY title`,
    );
    expect(rows.length).toBeGreaterThanOrEqual(19);

    const publico = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'public');
    for (const { title, cover_url: url } of rows) {
      expect(existsSync(path.join(publico, url)), `${title} → falta ${url}`).toBe(true);
    }
    // Dos cursos con la misma portada casi siempre es un copiar y pegar.
    const urls = rows.map((r) => r.cover_url);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('los doce de farmacología tienen portada', async () => {
    const { rows } = await pglite.query(
      `SELECT title FROM aula_courses
        WHERE kind = 'edvanta' AND deleted_at IS NULL AND area = 'Farmacología'
          AND cover_url IS NULL AND cover_file_id IS NULL
        ORDER BY title`,
    );
    // Esta línea está completa; si vuelve a aparecer alguna sin portada,
    // es que se creó un curso nuevo y se quedó con el hueco gris.
    expect(rows.map((r) => r.title)).toEqual([]);
  });

  it('ningún curso con categoría conocida se queda sin área', async () => {
    const { rows } = await pglite.query(
      `SELECT title, category FROM aula_courses
        WHERE kind = 'edvanta' AND deleted_at IS NULL AND area IS NULL
          AND (category LIKE 'Calidad%' OR category LIKE 'Asuntos regulatorios%'
               OR category = 'Farmacología' OR category = 'Servicio farmacéutico')`,
    );
    expect(rows).toEqual([]);
  });
});

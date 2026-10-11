import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { cleanMigrationSql } from '../lib/sql-text.js';
import { SQL_CURSO_PUBLICO, SQL_PORTADA_PUBLICA, temarioPublico } from '../routes/courses.js';

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
  it('quita el BOM que dejan algunos editores de Windows', () => {
    expect(cleanMigrationSql('﻿-- hola\nSELECT 1;')).toBe('-- hola\nSELECT 1;');
    expect(cleanMigrationSql('SELECT 1;')).toBe('SELECT 1;');
  });

  // Reproduce el arranque de producción: todas las migraciones, en orden,
  // limpiadas igual que lo hace lib/migrate.js. Si una falla, el migrador
  // real se detiene ahí y bloquea las siguientes.
  it('aplica todas las migraciones en orden sobre una base vacía', async () => {
    const { db, files } = await baseMigrada();
    const aplicadas = readdirSync(dir).filter((f) => f.endsWith('.sql')).sort();
    expect(aplicadas).toEqual(files);
    await db.close();
  }, 120_000);

  // La ficha pública de un curso se consulta desde fuera del aula, con el
  // pool global, así que no la cubren las pruebas del aula. Lo que puede
  // romperse en silencio es el nombre de una columna: si alguien renombra
  // una, esto falla aquí y no en producción.
  it('las consultas públicas de curso casan con el esquema', async () => {
    const { db } = await baseMigrada();
    expect((await db.query(SQL_CURSO_PUBLICO, [1])).rows).toEqual([]);
    expect((await db.query(SQL_PORTADA_PUBLICA, [1])).rows).toEqual([]);
    await db.close();
  }, 120_000);

  // Que una migración de 850 kB «corra sin error» no dice nada: podría
  // haber creado los cursos vacíos. Esto mira lo que quedó dentro.
  it('la línea de Calidad Farmacéutica queda montada entera', async () => {
    const { db } = await baseMigrada();

    const { rows: cursos } = await db.query(
      `SELECT id, title, category, duration_minutes, status
         FROM aula_courses
        WHERE category = 'Calidad farmacéutica' AND kind = 'edvanta'
        ORDER BY id`,
    );
    expect(cursos).toHaveLength(10);
    // En borrador: publicarlos es una decisión que se toma mirándolos.
    expect(cursos.every((c) => c.status === 'borrador')).toBe(true);
    expect(cursos.every((c) => c.duration_minutes === 1200)).toBe(true);

    const ids = cursos.map((c) => c.id);
    const [{ modulos }] = (await db.query(
      'SELECT COUNT(*)::int AS modulos FROM aula_modules WHERE course_id = ANY($1)', [ids],
    )).rows;
    expect(modulos).toBe(50); // cinco unidades por curso

    const [{ clases }] = (await db.query(
      'SELECT COUNT(*)::int AS clases FROM aula_lessons WHERE course_id = ANY($1)', [ids],
    )).rows;
    expect(clases).toBe(338); // el total que declara el índice del archivo

    // Toda clase tiene título, subtítulo (que es el nivel «Clase» del
    // archivo) y al menos un bloque: ninguna quedó hueca.
    const [{ huecas }] = (await db.query(
      `SELECT COUNT(*)::int AS huecas FROM aula_lessons l
        WHERE l.course_id = ANY($1)
          AND (btrim(coalesce(l.title, '')) = '' OR btrim(coalesce(l.subtitle, '')) = ''
               OR NOT EXISTS (SELECT 1 FROM aula_lesson_blocks b WHERE b.lesson_id = l.id))`,
      [ids],
    )).rows;
    expect(huecas).toBe(0);

    const { rows: bloques } = await db.query(
      `SELECT b.type, COUNT(*)::int AS n
         FROM aula_lesson_blocks b JOIN aula_lessons l ON l.id = b.lesson_id
        WHERE l.course_id = ANY($1) GROUP BY b.type ORDER BY b.type`,
      [ids],
    );
    const porTipo = Object.fromEntries(bloques.map((b) => [b.type, b.n]));
    expect(porTipo.video).toBeGreaterThan(350);
    expect(porTipo.enlace).toBeGreaterThan(350);
    expect(porTipo.texto).toBeGreaterThan(400);

    // Ningún bloque mal formado: el Aula los lee por estas claves y un
    // nulo aquí rompe la clase al abrirla.
    const [{ rotos }] = (await db.query(
      `SELECT COUNT(*)::int AS rotos
         FROM aula_lesson_blocks b JOIN aula_lessons l ON l.id = b.lesson_id
        WHERE l.course_id = ANY($1)
          AND ((b.type = 'video'  AND (b.data->>'videoId' IS NULL OR b.data->>'provider' IS NULL))
            OR (b.type = 'enlace' AND (b.data->>'url' IS NULL OR b.data->>'title' IS NULL))
            OR (b.type = 'texto'  AND btrim(coalesce(b.data->>'html', '')) = ''))`,
      [ids],
    )).rows;
    expect(rotos).toBe(0);

    // Y nada de enlaces que no sean http(s): ahí es donde se cuela un
    // javascript: si alguien edita el archivo de origen.
    const [{ raros }] = (await db.query(
      `SELECT COUNT(*)::int AS raros
         FROM aula_lesson_blocks b JOIN aula_lessons l ON l.id = b.lesson_id
        WHERE l.course_id = ANY($1)
          AND b.type IN ('enlace', 'video')
          AND b.data->>'url' !~* '^https?://'`,
      [ids],
    )).rows;
    expect(raros).toBe(0);

    await db.close();
  }, 180_000);
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

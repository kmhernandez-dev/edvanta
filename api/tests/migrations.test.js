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

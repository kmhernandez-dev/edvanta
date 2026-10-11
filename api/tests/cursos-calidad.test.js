/**
 * Los diez cursos de la línea de Calidad Farmacéutica.
 *
 * La migración que los monta no se puede dar por buena porque «corra sin
 * error»: lo que importa es que el Aula los pueda PUBLICAR. Publicar
 * arma un snapshot del curso y lo pasa por validateSnapshot; si ahí
 * aparece un solo fallo, el botón devuelve «El curso aún no se puede
 * publicar» y el trabajo se queda a medias con los cursos ya creados.
 *
 * Así que aquí se hace exactamente eso: construir el snapshot real de
 * cada uno de los diez y comprobar que no tiene errores. Es la única
 * forma de saber antes de tiempo que el botón va a funcionar.
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
import { fromPglite } from '../lib/aula/db.js';
import { buildSnapshot, validateSnapshot } from '../lib/aula/snapshot.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('cursos de Calidad Farmacéutica', () => {
  let pglite;
  let db;
  let cursos;

  beforeAll(async () => {
    pglite = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.sql')).sort()) {
      await pglite.exec(cleanMigrationSql(readFileSync(path.join(dir, f), 'utf8')));
    }
    db = fromPglite(pglite);
    cursos = (await pglite.query(
      `SELECT id, title, status FROM aula_courses
        WHERE category = 'Calidad farmacéutica' AND kind = 'edvanta' ORDER BY id`,
    )).rows;
  }, 180_000);

  afterAll(async () => { await pglite?.close(); });

  it('son diez y están en borrador', () => {
    expect(cursos).toHaveLength(10);
    expect(cursos.every((c) => c.status === 'borrador')).toBe(true);
  });

  it('ningún módulo se queda sin clases', async () => {
    const { rows } = await pglite.query(
      `SELECT m.id, m.title FROM aula_modules m
        WHERE m.course_id = ANY($1)
          AND NOT EXISTS (SELECT 1 FROM aula_lessons l WHERE l.module_id = m.id AND l.deleted_at IS NULL)`,
      [cursos.map((c) => c.id)],
    );
    // Un módulo vacío es error al publicar, no aviso.
    expect(rows.map((r) => r.title)).toEqual([]);
  });

  it('los diez pasan la validación de publicar', async () => {
    const fallos = [];
    for (const c of cursos) {
      const snapshot = await buildSnapshot(db, c.id);
      const { errors } = validateSnapshot(snapshot, { status: 'borrador', kind: 'edvanta' });
      if (errors.length) {
        fallos.push(`${c.title}: ${errors.slice(0, 3).map((e) => e.message).join(' | ')}`);
      }
    }
    expect(fallos).toEqual([]);
  }, 180_000);

  it('cada curso tiene contenido de verdad en su temario', async () => {
    for (const c of cursos) {
      const snapshot = await buildSnapshot(db, c.id);
      expect(snapshot.modules.length).toBe(5);
      const clases = snapshot.modules.flatMap((m) => m.lessons);
      expect(clases.length).toBeGreaterThanOrEqual(30);
      // Toda clase lleva al menos un bloque, y hay videos repartidos.
      expect(clases.every((l) => l.blocks.length > 0)).toBe(true);
      expect(clases.some((l) => l.blocks.some((b) => b.type === 'video'))).toBe(true);
    }
  }, 180_000);
});

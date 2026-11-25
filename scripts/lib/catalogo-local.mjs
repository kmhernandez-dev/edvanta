/**
 * El catálogo del aula en una base en memoria: aplica todas las
 * migraciones de api/migrations sobre PGlite, como hace
 * scripts/generar-experiencias-catalogo.mjs. Sirve para auditar o planear
 * sin tocar producción. Lo que alguien haya editado a mano en el panel
 * de producción no aparece aquí.
 */
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cleanMigrationSql } from '../../api/lib/sql-text.js';

export const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export async function catalogoLocal() {
  const db = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
  const carpeta = path.join(raiz, 'api', 'migrations');
  for (const f of readdirSync(carpeta).filter((x) => x.endsWith('.sql')).sort()) {
    await db.exec(cleanMigrationSql(readFileSync(path.join(carpeta, f), 'utf8')));
  }
  return db;
}

/** Cursos propios con sus clases y los bloques vigentes de cada una, en orden. */
export async function clasesDelCatalogo(db) {
  const { rows } = await db.query(`
    SELECT c.id AS curso_id, c.title AS curso, c.category AS categoria, c.area,
           m.title AS unidad, m.sort_order AS unidad_orden,
           l.id AS clase_id, l.title AS clase, l.sort_order AS clase_orden,
           COALESCE((SELECT json_agg(json_build_object('type', b.type, 'data', b.data) ORDER BY b.sort_order, b.id)
                       FROM aula_lesson_blocks b WHERE b.lesson_id = l.id AND b.deleted_at IS NULL), '[]'::json) AS bloques,
           (SELECT COUNT(*)::int FROM aula_lesson_blocks b WHERE b.lesson_id = l.id AND b.deleted_at IS NOT NULL AND b.type = 'texto') AS textos_retirados
      FROM aula_lessons l
      JOIN aula_courses c ON c.id = l.course_id AND c.deleted_at IS NULL AND c.kind = 'edvanta'
      JOIN aula_modules m ON m.id = l.module_id
     WHERE l.deleted_at IS NULL
     ORDER BY c.id, m.sort_order, m.id, l.sort_order, l.id`);
  return rows.map((r) => ({ ...r, bloques: typeof r.bloques === 'string' ? JSON.parse(r.bloques) : r.bloques }));
}

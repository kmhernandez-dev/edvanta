/**
 * 194_formato_unico_de_clases.sql: todas las clases con el formato de
 * Farmacoterapia, sin contenido nuevo (solo vuelve el texto retirado).
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

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');
const MIGRACION = '194_formato_unico_de_clases.sql';
const sql = (f) => cleanMigrationSql(readFileSync(path.join(dir, f), 'utf8'));

const BLOQUES = `
  SELECT l.id AS clase, l.title AS titulo, c.title AS curso, c.category AS categoria,
         json_agg(json_build_object('type', b.type, 'nombre', COALESCE(b.data->>'title', b.data->>'text'), 'html', left(b.data->>'html', 20)) ORDER BY b.sort_order, b.id) AS bloques
    FROM aula_lessons l
    JOIN aula_courses c ON c.id = l.course_id AND c.kind = 'edvanta' AND c.deleted_at IS NULL
    JOIN aula_lesson_blocks b ON b.lesson_id = l.id AND b.deleted_at IS NULL
   WHERE l.deleted_at IS NULL
   GROUP BY l.id, l.title, c.title, c.category`;

let db;
let antes;
let clases;

const leer = async () => (await db.query(BLOQUES)).rows.map((r) => ({ ...r, bloques: typeof r.bloques === 'string' ? JSON.parse(r.bloques) : r.bloques }));
const es = (b, type, nombre) => b.type === type && (nombre === undefined || b.nombre === nombre);
const esLista = (b) => b.type === 'texto' && (/^<ol>/.test(b.html || '') || /^<h2>Fuentes/i.test(b.html || ''));

beforeAll(async () => {
  db = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.sql') && x < MIGRACION).sort()) await db.exec(sql(f));
  antes = await leer();
  await db.exec(sql(MIGRACION));
  clases = await leer();
}, 240_000);

afterAll(async () => { await db?.close(); });

describe('formato único de clases', () => {
  it('antes, Farmacoterapia tenía «La clase en texto» sin texto debajo', () => {
    const vacias = antes.filter((c) => c.bloques.some((b) => es(b, 'encabezado', 'La clase en texto')) && !c.bloques.some((b) => b.type === 'texto'));
    expect(vacias.length).toBe(136);
  });

  it('cada «La clase en texto» y cada «Referencias» tiene su texto justo debajo', () => {
    for (const c of clases) {
      c.bloques.forEach((b, i) => {
        if (es(b, 'encabezado', 'La clase en texto')) expect(c.bloques[i + 1]?.type, c.titulo).toBe('texto');
        if (es(b, 'encabezado', 'Referencias')) expect(esLista(c.bloques[i + 1] || {}), c.titulo).toBe(true);
      });
    }
    expect(clases.filter((c) => c.bloques.some((b) => es(b, 'encabezado', 'La clase en texto'))).length).toBeGreaterThan(500);
  });

  it('toda clase con experiencia abre con «En esta clase» (o «Cómo leer esta ficha»)', () => {
    const conExperiencia = clases.filter((c) => c.bloques.some((b) => b.type === 'experiencia'));
    expect(conExperiencia.length).toBeGreaterThan(1500);
    for (const c of conExperiencia) {
      expect(c.bloques.some((b) => es(b, 'destacado', 'En esta clase') || es(b, 'destacado', 'Cómo leer esta ficha')), `${c.curso} · ${c.titulo}`).toBe(true);
    }
  });

  it('el orden es video, experiencia, resumen, lectura, destacados, enlaces y referencias', () => {
    const grupo = (b) => {
      if (b.type === 'video') return 0;
      if (b.type === 'experiencia') return 1;
      if (es(b, 'destacado', 'En esta clase') || es(b, 'destacado', 'Cómo leer esta ficha')) return 2;
      if (es(b, 'encabezado', 'La clase en texto')) return 3;
      if (b.type === 'texto' && !esLista(b)) return 4;
      if (b.type === 'destacado') return 5;
      if (es(b, 'encabezado', 'Para profundizar')) return 6;
      if (b.type === 'enlace') return 7;
      if (es(b, 'encabezado', 'Referencias')) return 9;
      if (b.type === 'texto') return 10;
      return 8;
    };
    for (const c of clases.filter((x) => x.bloques.some((b) => es(b, 'destacado', 'En esta clase')))) {
      const orden = c.bloques.map(grupo);
      expect(orden, `${c.curso} · ${c.titulo}`).toEqual([...orden].sort((a, b) => a - b));
    }
  });

  it('los enlaces de una clase con resumen van bajo «Para profundizar»', () => {
    for (const c of clases.filter((x) => x.bloques.some((b) => es(b, 'destacado', 'En esta clase')) && x.bloques.some((b) => b.type === 'enlace'))) {
      const i = c.bloques.findIndex((b) => b.type === 'enlace');
      expect(es(c.bloques[i - 1], 'encabezado', 'Para profundizar'), `${c.curso} · ${c.titulo}`).toBe(true);
    }
  });

  it('no cambia experiencias, videos ni enlaces, y no deja bloques repetidos', () => {
    const cuenta = (lista, type) => lista.reduce((n, c) => n + c.bloques.filter((b) => b.type === type).length, 0);
    for (const type of ['experiencia', 'video', 'enlace']) expect(cuenta(clases, type)).toBe(cuenta(antes, type));
    for (const c of clases) {
      for (const nombre of ['En esta clase', 'La clase en texto', 'Para profundizar', 'Referencias']) {
        expect(c.bloques.filter((b) => b.nombre === nombre).length, `${c.titulo}: ${nombre}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it('aplicarla otra vez no cambia nada', async () => {
    await db.exec(sql(MIGRACION));
    expect(await leer()).toEqual(clases);
  });
});

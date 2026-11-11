/**
 * Las migraciones tal como llegan a producción.
 *
 * Las versiones privadas de la evaluación (las que llevan guías docentes)
 * están en .gitignore y nunca llegan al servidor. Aquí se aplican solo las
 * públicas y en el orden en que las vive producción:
 *
 *   1. Las que ya estaban (hasta la 076), con los cursos publicados, como
 *      están en el aula (unos a mano, otros al arrancar).
 *   2. Las nuevas (077 en adelante) y las tareas de arranque.
 *
 * Comprueba que ninguna detiene el arranque, que todos los cursos con
 * paquete de evaluación quedan con quizzes, actividades y foros
 * PUBLICADOS que suman 100, y que las versiones nuevas aprobadas se
 * publican: los videos de Habilidades Blandas y las clases completas de
 * BPM y BPE.
 */
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { unaccent } from '@electric-sql/pglite/contrib/unaccent';
import { uuid_ossp } from '@electric-sql/pglite/contrib/uuid_ossp';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { cleanMigrationSql } from '../lib/sql-text.js';
import { fromPglite, many } from '../lib/aula/db.js';
import { publishCourse } from '../lib/aula/courses.js';
import { publicarAprobados, republicarAprobadas } from '../lib/aula/publicaciones.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

// Lo mismo que excluye .gitignore.
const privada = (f) => f.includes('_evaluacion_') || f === '063_pedagogia_bpm.sql' || f === '067_pedagogia_bpe.sql';
const CORTE = '077';

const BPM = 'Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica';
const BPE = 'Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales';

let pglite;
let db;
const errores = [];
let publicadosAntes = new Map();

beforeAll(async () => {
  pglite = new PGlite({ extensions: { pg_trgm, pgcrypto, unaccent, uuid_ossp } });
  const publicas = readdirSync(dir).filter((x) => x.endsWith('.sql') && !privada(x)).sort();
  for (const f of publicas.filter((x) => x < CORTE)) {
    await pglite.exec(cleanMigrationSql(readFileSync(path.join(dir, f), 'utf8')));
  }
  db = fromPglite(pglite);

  // Producción: lo aprobado se publicó al arrancar y lo demás, a mano.
  await publicarAprobados(db);
  const borradores = await many(db, "SELECT id FROM aula_courses WHERE kind = 'edvanta' AND deleted_at IS NULL AND current_version_id IS NULL");
  for (const c of borradores) {
    try {
      await publishCourse(db, c.id, { changeSummary: '' }, { actor: { id: null, email: null }, ip: null });
    } catch { /* lo que no pasa la validación sigue en borrador, igual que allá */ }
  }
  publicadosAntes = new Map((await many(db, `
    SELECT c.id, c.title, v.version_number
      FROM aula_courses c JOIN aula_course_versions v ON v.id = c.current_version_id`)).map((r) => [r.title, r]));

  // El despliegue: las migraciones nuevas y las tareas de arranque.
  for (const f of publicas.filter((x) => x >= CORTE)) {
    await pglite.exec(cleanMigrationSql(readFileSync(path.join(dir, f), 'utf8')));
  }
  const log = (e) => { if (e.level === 'error') errores.push(e); };
  await publicarAprobados(db, { log });
  await republicarAprobadas(db, { log });
}, 300_000);

afterAll(async () => { await pglite?.close(); });

const versionActual = async (titulo) => (await many(db, `
  SELECT v.version_number, v.snapshot
    FROM aula_courses c JOIN aula_course_versions v ON v.id = c.current_version_id
   WHERE c.title = $1 AND c.deleted_at IS NULL`, [titulo]))[0];

describe('migraciones públicas, como en producción', () => {
  it('el arranque no registra errores y cada versión aprobada queda publicada', async () => {
    expect(errores).toEqual([]);
    const filas = await many(db, 'SELECT course_id, publicado_at, error FROM aula_republicaciones_aprobadas');
    expect(filas.length).toBeGreaterThan(0);
    for (const f of filas) {
      expect(f.error).toBeNull();
      expect(f.publicado_at).not.toBeNull();
    }
  });

  it('todos los cursos con paquete tienen quizzes, actividades y foros publicados que suman 100', async () => {
    const cursos = await many(db, `
      SELECT c.title, c.grade_policy,
             (SELECT count(*)::int FROM aula_assessments a WHERE a.course_id = c.id AND a.deleted_at IS NULL AND a.status = 'publicado') AS quizzes,
             (SELECT count(*)::int FROM aula_activities a WHERE a.course_id = c.id AND a.deleted_at IS NULL AND a.status = 'publicado') AS actividades,
             (SELECT count(*)::int FROM aula_forums f WHERE f.course_id = c.id AND f.deleted_at IS NULL AND f.status = 'publicado') AS foros,
             (SELECT count(*)::int FROM aula_assessments a WHERE a.course_id = c.id AND a.deleted_at IS NULL AND a.status = 'borrador')
           + (SELECT count(*)::int FROM aula_activities a WHERE a.course_id = c.id AND a.deleted_at IS NULL AND a.status = 'borrador')
           + (SELECT count(*)::int FROM aula_forums f WHERE f.course_id = c.id AND f.deleted_at IS NULL AND f.status = 'borrador') AS borradores,
             COALESCE((SELECT sum(weight) FROM aula_assessments a WHERE a.course_id = c.id AND a.deleted_at IS NULL AND a.status = 'publicado'), 0)
           + COALESCE((SELECT sum(weight) FROM aula_activities a WHERE a.course_id = c.id AND a.deleted_at IS NULL AND a.status = 'publicado'), 0)
           + COALESCE((SELECT sum(weight) FROM aula_forums f WHERE f.course_id = c.id AND f.deleted_at IS NULL AND f.status = 'publicado'), 0) AS peso
        FROM aula_courses c
       WHERE c.kind = 'edvanta' AND c.deleted_at IS NULL
         AND EXISTS (SELECT 1 FROM aula_assessments a WHERE a.course_id = c.id AND a.deleted_at IS NULL)
       ORDER BY c.title`);
    // 10 de Habilidades Blandas, 3 de bases, 10 de calidad, 2 de
    // regulatorios, BPM, BPE, 4 de Farmacoterapia, 12 de Farmacología (4 de oncología), Autocuidado de la tiroides y 2 regulatorios más (renovación y modificaciones).
    expect(cursos.length).toBeGreaterThanOrEqual(60);
    for (const c of cursos) {
      const ctx = c.title;
      expect(c.quizzes, ctx).toBeGreaterThan(0);
      expect(c.actividades, ctx).toBeGreaterThan(0);
      expect(c.foros, ctx).toBeGreaterThan(0);
      expect(c.borradores, ctx).toBe(0);
      expect(Number(c.peso), ctx).toBeCloseTo(100, 1);
      expect(c.grade_policy?.components, ctx).toEqual({ activities: 60, quizzes: 30, forums: 10 });
    }
    const titulos = cursos.map((c) => c.title);
    expect(titulos).toContain(BPM);
    expect(titulos).toContain(BPE);
  });

  it('cada quiz publicado tiene preguntas con una sola respuesta correcta', async () => {
    const malas = await many(db, `
      SELECT a.title, q.id,
             (SELECT count(*)::int FROM aula_question_options o WHERE o.question_id = q.id AND o.is_correct) AS correctas
        FROM aula_assessments a
        JOIN aula_assessment_questions aq ON aq.assessment_id = a.id
        JOIN aula_questions q ON q.id = aq.question_id
       WHERE a.status = 'publicado' AND a.deleted_at IS NULL`);
    expect(malas.length).toBeGreaterThan(0);
    expect(malas.filter((m) => m.correctas !== 1)).toEqual([]);
    const vacios = await many(db, `
      SELECT a.title FROM aula_assessments a
       WHERE a.status = 'publicado' AND a.deleted_at IS NULL
         AND NOT EXISTS (SELECT 1 FROM aula_assessment_questions aq WHERE aq.assessment_id = a.id)`);
    expect(vacios).toEqual([]);
  });

  it('cada clase de Habilidades Blandas muestra su video de YouTube en la versión publicada', async () => {
    const cursos = await many(db, "SELECT title FROM aula_courses WHERE area = 'Habilidades Blandas' AND deleted_at IS NULL ORDER BY title");
    expect(cursos).toHaveLength(10);
    let videos = 0;
    for (const { title } of cursos) {
      const v = await versionActual(title);
      expect(v, title).toBeTruthy();
      for (const m of v.snapshot.modules) {
        for (const l of m.lessons) {
          const enClase = l.blocks.filter((b) => b.type === 'video');
          expect(enClase, `${title} · ${l.title}`).toHaveLength(1);
          expect(enClase[0].data.url).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/);
          videos += 1;
        }
      }
    }
    expect(videos).toBe(80);
  });

  it('BPM y BPE publican una versión nueva con las clases completas', async () => {
    for (const titulo of [BPM, BPE]) {
      const antes = publicadosAntes.get(titulo);
      const v = await versionActual(titulo);
      expect(v, titulo).toBeTruthy();
      if (antes) expect(v.version_number, titulo).toBeGreaterThan(antes.version_number);
      const textos = v.snapshot.modules.flatMap((m) => m.lessons).map((l) => l.blocks.find((b) => b.type === 'texto')?.data.html || '');
      expect(textos.length, titulo).toBe(9);
      for (const t of textos) expect(t.length, titulo).toBeGreaterThan(4000);
    }
  });
});

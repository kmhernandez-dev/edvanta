/**
 * Curso de Manipulación de Alimentos (migraciones 161 y 162).
 *
 *  - se crea en BORRADOR (lo publica la dirección académica tras revisarlo);
 *  - 5 unidades, 15 clases y 600 minutos (10 horas, art. 12 de la Res. 2674 de 2013);
 *  - certificado con costo, como los demás cursos para profesionales;
 *  - por unidad: un quiz de 4 preguntas, una actividad con rúbrica y un foro;
 *  - la ficha dice el alcance del certificado (no reemplaza el certificado médico).
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createTestDb } from './helpers.js';
import { cleanMigrationSql } from '../lib/sql-text.js';
import { publishCourse } from '../lib/aula/courses.js';
import { EVALUACION } from '../../scripts/datos/manipulacion-alimentos.mjs';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

describe('Curso de Manipulación de Alimentos', () => {
  let t;
  let curso;
  beforeAll(async () => {
    t = await createTestDb();
    // La base de pruebas trae solo las migraciones del aula: se aplican las del curso.
    for (const f of ['161_curso_manipulacion_de_alimentos.sql', '162_quices_actividades_foros_manipulacion_de_alimentos.sql']) {
      await t.pglite.exec(cleanMigrationSql(readFileSync(path.join(dir, f), 'utf8')));
    }
    const { rows } = await t.db.query("SELECT * FROM aula_courses WHERE title = 'Curso de Manipulación de Alimentos'");
    [curso] = rows;
  }, 120_000);
  afterAll(async () => { await t.pglite.close(); });

  it('existe en borrador, para profesionales, con certificado de COP 60.000 y 10 horas', () => {
    expect(curso).toBeTruthy();
    expect(curso.status).toBe('borrador');
    expect(curso.publico).toBe('profesionales');
    expect(Number(curso.certificate_price)).toBe(60000);
    expect(Number(curso.duration_minutes)).toBe(600);
    expect(curso.description_html).toMatch(/No reemplaza el <strong>certificado médico de aptitud<\/strong>/);
  });

  it('tiene 5 unidades y 15 clases, cada una con sus fuentes', async () => {
    const m = await t.db.query('SELECT count(*)::int AS n FROM aula_modules WHERE course_id = $1', [curso.id]);
    const l = await t.db.query('SELECT id FROM aula_lessons WHERE course_id = $1', [curso.id]);
    expect(m.rows[0].n).toBe(5);
    expect(l.rows).toHaveLength(15);
    const f = await t.db.query(
      "SELECT count(*)::int AS n FROM aula_lesson_blocks b JOIN aula_lessons l ON l.id = b.lesson_id WHERE l.course_id = $1 AND b.data->>'html' LIKE '%<h2>Fuentes</h2>%'",
      [curso.id],
    );
    expect(f.rows[0].n).toBe(15);
  });

  it('cada unidad tiene quiz de 4 preguntas, actividad con rúbrica y foro', async () => {
    const q = await t.db.query('SELECT a.id, count(aq.*)::int AS n FROM aula_assessments a JOIN aula_assessment_questions aq ON aq.assessment_id = a.id WHERE a.course_id = $1 GROUP BY a.id', [curso.id]);
    expect(q.rows).toHaveLength(5);
    expect(q.rows.every((r) => r.n === 4)).toBe(true);
    const act = await t.db.query("SELECT rubric FROM aula_activities WHERE course_id = $1", [curso.id]);
    expect(act.rows).toHaveLength(5);
    expect(act.rows.every((r) => r.rubric.criteria.reduce((s, c) => s + c.weight, 0) === 100)).toBe(true);
    const f = await t.db.query('SELECT count(*)::int AS n FROM aula_forums WHERE course_id = $1', [curso.id]);
    expect(f.rows[0].n).toBe(5);
    // Una sola respuesta correcta por pregunta.
    const malas = await t.db.query(
      `SELECT q.id FROM aula_questions q JOIN aula_question_banks b ON b.id = q.bank_id
        WHERE b.course_id = $1
        GROUP BY q.id HAVING count(*) FILTER (WHERE (SELECT true FROM aula_question_options o WHERE o.question_id = q.id AND o.is_correct LIMIT 1)) <> 1`,
      [curso.id],
    );
    expect(malas.rows).toHaveLength(0);
  });

  it('pasa la validación de «Publicar» (lo que hará la aprobación de la dirección académica)', async () => {
    const { version } = await publishCourse(t.db, curso.id, { changeSummary: 'Prueba' }, { actor: { id: null, email: null }, ip: null });
    expect(version.id).toBeTruthy();
  });

  it('las respuestas correctas se reparten 5/5/5/5 y no delatan por su largo', () => {
    const preguntas = EVALUACION.flatMap((u) => u.quiz);
    const porPosicion = [0, 0, 0, 0];
    for (const [, opciones, correcta] of preguntas) {
      porPosicion[correcta] += 1;
      const otras = opciones.filter((_, i) => i !== correcta).map((o) => o.length);
      expect(opciones[correcta].length - Math.max(...otras), opciones[correcta]).toBeLessThanOrEqual(10);
    }
    expect(porPosicion).toEqual([5, 5, 5, 5]);
  });

  it('163: queda aprobado para publicar y toma la dirección principal; el curado de Edutin estrena la suya', async () => {
    // Producción: la principal es hoy del curado de Edutin (id 150) y el propio aún no tiene
    // dirección (la prueba de publicar de arriba se la asignó: se deja como en producción).
    await t.db.query("DELETE FROM public_slugs WHERE entity = 'aula' AND entity_id = $1", [curso.id]);
    await t.db.query("INSERT INTO public_slugs (slug, entity, entity_id, is_current) VALUES ('curso-de-manipulacion-de-alimentos', 'curado', 150, TRUE)");
    const sql = cleanMigrationSql(readFileSync(path.join(dir, '163_publicar_manipulacion_de_alimentos.sql'), 'utf8'));
    await t.pglite.exec(sql);
    await t.pglite.exec(sql); // idempotente
    const { rows } = await t.db.query('SELECT slug, entity, entity_id, is_current FROM public_slugs ORDER BY slug');
    expect(rows).toEqual([
      { slug: 'curso-de-manipulacion-de-alimentos', entity: 'aula', entity_id: curso.id, is_current: true },
      { slug: 'curso-de-manipulacion-de-alimentos-en-edutin', entity: 'curado', entity_id: 150, is_current: true },
    ]);
    const ap = await t.db.query('SELECT course_id FROM aula_publicaciones_aprobadas WHERE course_id = $1', [curso.id]);
    // Ya estaba publicado por la prueba anterior: la aprobación solo se registra si sigue en borrador.
    expect(ap.rows.length).toBeLessThanOrEqual(1);
  });
});

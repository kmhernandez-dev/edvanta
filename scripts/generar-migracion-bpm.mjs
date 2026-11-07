/**
 * Genera api/migrations/063_pedagogia_bpm.sql a partir del paquete
 * contenido/aula/bpm.
 *
 *   node scripts/generar-migracion-bpm.mjs
 *
 * La migración es idempotente: actualiza el curso y las clases existentes,
 * reemplaza solo los bloques de texto de BPM y crea evaluación, actividad
 * y foro si aún no existen. No publica el curso.
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURSO, UNIDADES, LECCIONES, QUIZZES, FOROS, ACTIVIDADES } from '../contenido/aula/bpm/index.mjs';
import { renderLeccion, renderForo, renderActividad, renderCurso } from '../contenido/aula/bpm/render.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destino = path.join(raiz, 'api', 'migrations', '063_pedagogia_bpm.sql');

const sqlString = (s) => `'${String(s ?? '').replaceAll("'", "''")}'`;
const sqlArray = (arr) => `ARRAY[${(arr || []).map(sqlString).join(', ')}]::text[]`;
const dollar = (tag, s) => `$${tag}$${String(s ?? '')}$${tag}$`;

const assertTag = (tag, s) => {
  if (String(s).includes(`$${tag}$`)) throw new Error(`El contenido contiene el delimitador $${tag}$; cambia el texto o el tag.`);
};

const unidadDe = (leccionId) => {
  const m = /^bpm-u(\d+)-l\d+$/.exec(leccionId);
  if (!m) throw new Error(`ID de clase inesperado: ${leccionId}`);
  return UNIDADES.find((u) => u.UNIDAD.numero === Number(m[1]));
};

const rubricaJson = (rubrica) => JSON.stringify({
  version: 1,
  total: 100,
  criteria: rubrica.map((r) => ({
    id: r.criterio.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: r.criterio,
    weight: r.peso,
    levels: [
      { level: 4, label: 'Destacado', description: r.nivel4 },
      { level: 3, label: 'Logrado', description: r.nivel3 },
      { level: 2, label: 'En desarrollo', description: r.nivel2 },
      { level: 1, label: 'Inicial', description: r.nivel1 },
      { level: 0, label: 'Sin evidencia', description: r.nivel0 },
    ],
  })),
}, null, 2);

const bloques = [];

bloques.push(`-- ============================================================
--  063_pedagogia_bpm.sql — Curso de BPM completo
--
--  Generado por scripts/generar-migracion-bpm.mjs a partir de
--  contenido/aula/bpm. No editar a mano: cambia el paquete y vuelve a
--  generar.
--
--  Qué hace:
--   1. Actualiza los metadatos del curso y sus resultados.
--   2. Reemplaza el texto de las nueve clases por la versión completa
--      (introducción, caso, ejemplo, mapa, errores, práctica, síntesis
--      y referencias), conservando videos, enlaces y destacados válidos.
--   3. Crea tres quizzes de cuatro preguntas, tres foros y tres
--      actividades con rúbrica.
--   4. Deja el curso en BORRADOR: publicar es una decisión aparte.
--
--  Pesos: actividades 60 %, quizzes 30 %, foros 10 %.
--  Aprobación: 70/100. Intentos por quiz: 2 (se conserva la mayor).
-- ============================================================

DO $bpm$
DECLARE
  v_curso   BIGINT;
  v_unidad  BIGINT;
  v_clase   BIGINT;
  v_banco   BIGINT;
  v_pregunta BIGINT;
  v_eval    BIGINT;
  v_act     BIGINT;
  v_foro    BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta'
     AND title = ${sqlString(CURSO.titulo)}
     AND deleted_at IS NULL
   LIMIT 1;

  IF v_curso IS NULL THEN
    RAISE EXCEPTION 'No existe el curso de BPM: aplica primero la migración 034.';
  END IF;

  UPDATE aula_courses
     SET short_description = ${sqlString(CURSO.descripcionCorta)},
         description_html = ${dollar('bpm_html', renderCurso(CURSO))},
         objective = ${sqlString(CURSO.objetivo)},
         learning_outcomes = ${sqlArray(CURSO.resultados)},
         audience = ${sqlString(CURSO.publico)},
         prerequisites = ${sqlString(CURSO.prerrequisitos)},
         duration_minutes = ${CURSO.duracionMin},
         level = ${sqlString(CURSO.nivel)},
         category = ${sqlString(CURSO.categoria)},
         area = ${sqlString(CURSO.area)},
         tags = ${sqlArray(CURSO.etiquetas)},
         passing_score = ${CURSO.aprobacion},
         max_attempts = ${CURSO.intentos},
         publico = 'profesionales',
         updated_at = NOW()
   WHERE id = v_curso;
`);

for (const l of LECCIONES) {
  const unidad = unidadDe(l.id);
  const html = renderLeccion(l);
  assertTag('bpm_html', html);
  bloques.push(`
  -- ── ${l.id} · ${l.titulo.replaceAll('\n', ' ')} ─────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = ${sqlString(unidad.UNIDAD.titulo)} AND deleted_at IS NULL
   LIMIT 1;

  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad ${unidad.UNIDAD.numero} del curso de BPM.';
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = ${sqlString(l.titulo)} AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    RAISE EXCEPTION 'No existe la clase % en la unidad %.', ${sqlString(l.titulo)}, ${unidad.UNIDAD.numero};
  END IF;

  UPDATE aula_lessons
     SET subtitle = ${sqlString(l.subtitulo)},
         completion_rule = 'manual',
         duration_minutes = ${l.duracionMin},
         is_required = TRUE,
         updated_at = NOW()
   WHERE id = v_clase;

  -- El texto viejo era un párrafo de apoyo. Se reemplaza por la clase
  -- completa; los videos, enlaces y destacados se conservan.
  DELETE FROM aula_lesson_blocks
   WHERE lesson_id = v_clase AND type = 'texto';

  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, 'texto', 0, jsonb_build_object('html', ${dollar('bpm_html', html)}));
`);
}

// Quizzes
for (const q of QUIZZES) {
  const unidadNum = Number(/^bpm-u(\d+)-quiz$/.exec(q.id)[1]);
  const unidad = UNIDADES.find((u) => u.UNIDAD.numero === unidadNum);
  bloques.push(`
  -- ── Quiz ${q.id} ───────────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = ${sqlString(unidad.UNIDAD.titulo)} AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = ${sqlString(q.titulo)} AND deleted_at IS NULL
   LIMIT 1;

  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, ${sqlString(q.titulo)}, ${sqlString(q.instrucciones)})
    RETURNING id INTO v_banco;
  ELSE
    UPDATE aula_question_banks
       SET description = ${sqlString(q.instrucciones)}, updated_at = NOW()
     WHERE id = v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = ${sqlString(q.titulo)} AND deleted_at IS NULL
   LIMIT 1;

  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score,
       max_attempts, shuffle_questions, shuffle_options, show_answers_after_submit,
       status, sort_order)
    VALUES
      (v_curso, v_unidad, ${sqlString(q.titulo)}, ${sqlString(q.instrucciones)}, TRUE,
       ${CURSO.aprobacion}, ${CURSO.intentos}, FALSE, FALSE, TRUE, 'borrador', ${unidadNum})
    RETURNING id INTO v_eval;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad,
           instructions_html = ${sqlString(q.instrucciones)},
           is_required = TRUE,
           passing_score = ${CURSO.aprobacion},
           max_attempts = ${CURSO.intentos},
           show_answers_after_submit = TRUE,
           status = 'borrador',
           sort_order = ${unidadNum},
           updated_at = NOW()
     WHERE id = v_eval;
  END IF;

  DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;
`);

  q.preguntas.forEach((p, index) => {
    const config = JSON.stringify({
      external_id: p.id,
      cognitive_level: p.nivel,
      difficulty: p.dificultad,
      lesson_id: p.clase,
      outcome: p.resultado,
    });
    bloques.push(`
  SELECT id INTO v_pregunta FROM aula_questions
   WHERE bank_id = v_banco AND config->>'external_id' = ${sqlString(p.id)} AND deleted_at IS NULL
   LIMIT 1;

  IF v_pregunta IS NULL THEN
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', ${sqlString(p.enunciado)}, 25, ${sqlString(p.explicacion)}, ${sqlString(p.explicacion)}, ${dollar('bpm_json', config)}::jsonb)
    RETURNING id INTO v_pregunta;
  ELSE
    UPDATE aula_questions
       SET prompt_html = ${sqlString(p.enunciado)},
           points = 25,
           general_feedback = ${sqlString(p.explicacion)},
           explanation = ${sqlString(p.explicacion)},
           config = ${dollar('bpm_json', config)}::jsonb,
           updated_at = NOW()
     WHERE id = v_pregunta;
  END IF;

  DELETE FROM aula_question_options WHERE question_id = v_pregunta;
`);
    p.opciones.forEach((o, i) => {
      bloques.push(`
  INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
  VALUES (v_pregunta, ${sqlString(o.texto)}, ${o.correcta ? 'TRUE' : 'FALSE'}, ${sqlString(o.feedback)}, ${i});
`);
    });
    bloques.push(`
  INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
  VALUES (v_eval, v_pregunta, ${index}, 25);
`);
  });
}

// Activities
for (const a of ACTIVIDADES) {
  const unidadNum = Number(/^bpm-u(\d+)-act$/.exec(a.id)[1]);
  const unidad = UNIDADES.find((u) => u.UNIDAD.numero === unidadNum);
  const html = renderActividad(a);
  const rubric = rubricaJson(a.rubrica);
  assertTag('bpm_html', html);
  assertTag('bpm_json', rubric);
  bloques.push(`
  -- ── Actividad ${a.id} ──────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = ${sqlString(unidad.UNIDAD.titulo)} AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = ${sqlString(a.titulo)} AND deleted_at IS NULL
   LIMIT 1;

  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order)
    VALUES
      (v_curso, v_unidad, ${sqlString(a.titulo)}, ${dollar('bpm_html', html)}, ${dollar('bpm_json', rubric)}::jsonb,
       TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'borrador', ${unidadNum})
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad,
           instructions_html = ${dollar('bpm_html', html)},
           rubric = ${dollar('bpm_json', rubric)}::jsonb,
           allow_text = TRUE,
           allow_link = TRUE,
           allow_file = TRUE,
           accepted_extensions = ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[],
           max_file_mb = 20,
           max_points = 100,
           is_required = TRUE,
           status = 'borrador',
           sort_order = ${unidadNum},
           updated_at = NOW()
     WHERE id = v_act;
  END IF;
`);
}

// Forums
for (const f of FOROS) {
  const unidadNum = Number(/^bpm-u(\d+)-foro$/.exec(f.id)[1]);
  const unidad = UNIDADES.find((u) => u.UNIDAD.numero === unidadNum);
  const html = renderForo(f);
  assertTag('bpm_html', html);
  bloques.push(`
  -- ── Foro ${f.id} ───────────────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = ${sqlString(unidad.UNIDAD.titulo)} AND deleted_at IS NULL
   LIMIT 1;

  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = ${sqlString(f.titulo)} AND deleted_at IS NULL
   LIMIT 1;

  IF v_foro IS NULL THEN
    INSERT INTO aula_forums (course_id, module_id, scope, title, description, is_closed, allow_attachments)
    VALUES (v_curso, v_unidad, 'modulo', ${sqlString(f.titulo)}, ${dollar('bpm_html', html)}, FALSE, FALSE)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET module_id = v_unidad,
           scope = 'modulo',
           description = ${dollar('bpm_html', html)},
           is_closed = FALSE,
           allow_attachments = FALSE,
           updated_at = NOW()
     WHERE id = v_foro;
  END IF;
`);
}

bloques.push(`
  RAISE NOTICE 'Curso de BPM actualizado: % clases, % quizzes, % actividades y % foros.',
    (SELECT COUNT(*) FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$bpm$;
`);

const sql = bloques.join('\n');
writeFileSync(destino, sql, 'utf8');
console.log(`Migración generada: ${destino}`);
console.log(`Tamaño: ${(sql.length / 1024).toFixed(1)} KB`);





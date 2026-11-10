/**
 * Genera api/migrations/063_pedagogia_bpm.sql a partir del paquete
 * contenido/aula/bpm.
 *
 *   node scripts/generar-migracion-bpm.mjs
 *   node scripts/generar-migracion-bpm.mjs --publica
 *
 * La migración es idempotente: actualiza el curso y las clases existentes,
 * reemplaza solo los bloques de texto de BPM y crea evaluación, actividad
 * y foro si aún no existen. No publica el curso.
 *
 * Con --publica escribe 084_clases_quices_actividades_foros_bpm.sql, la
 * versión que sí va al repositorio (aprobado por la dirección académica:
 * todos los cursos llevan quizzes, actividades y foros). Incluye lo que
 * hacía el bloque de BPM de la 064 (política 60/30/10, pesos y rúbrica de
 * foros), deja todo PUBLICADO, no toca preguntas de quizzes con intentos
 * ni rúbricas o pesos con entregas o notas, nunca detiene el arranque y
 * aprueba una versión nueva del curso (077) para que se vean las clases.
 */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURSO, UNIDADES, LECCIONES, QUIZZES, FOROS, ACTIVIDADES } from '../contenido/aula/bpm/index.mjs';
import { renderLeccion, renderForo, renderActividad, renderCurso } from '../contenido/aula/bpm/render.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLICA = process.argv.includes('--publica');
const destino = path.join(raiz, 'api', 'migrations', PUBLICA ? '084_clases_quices_actividades_foros_bpm.sql' : '063_pedagogia_bpm.sql');
const ESTADO = PUBLICA ? 'publicado' : 'borrador';
// Pesos de la 064: quizzes 3 × 10, actividades 3 × 20, foros 3.34 + 3.33 + 3.33.
const PESO_QUIZ = 10;
const PESO_ACTIVIDAD = 20;
const pesoForo = (i) => (i === 0 ? 3.34 : 3.33);
const fallar = (msg) => (PUBLICA
  ? `RAISE NOTICE '${msg.replaceAll("'", "''")} Se salta.';
    RETURN;`
  : `RAISE EXCEPTION '${msg.replaceAll("'", "''")}';`);

// Rúbrica de los foros de BPM, la misma que aplicó la 064.
const RUBRICA_FOROS = {
  version: 1,
  total: 100,
  criteria: [
    {
      id: 'pertinencia', name: 'Pertinencia', weight: 30,
      levels: [
        { level: 4, label: 'Destacado', description: 'Responde la pregunta central y usa el caso de forma explícita.' },
        { level: 3, label: 'Logrado', description: 'Responde la pregunta y menciona el caso.' },
        { level: 2, label: 'En desarrollo', description: 'Responde de forma general, con poca relación con el caso.' },
        { level: 1, label: 'Inicial', description: 'Se aleja de la pregunta.' },
        { level: 0, label: 'Sin evidencia', description: 'No responde.' },
      ],
    },
    {
      id: 'razonamiento', name: 'Razonamiento con evidencia', weight: 40,
      levels: [
        { level: 4, label: 'Destacado', description: 'Distingue conceptos, norma y riesgo con evidencia verificable.' },
        { level: 3, label: 'Logrado', description: 'Argumenta con una razón técnica correcta.' },
        { level: 2, label: 'En desarrollo', description: 'Usa opiniones generales.' },
        { level: 1, label: 'Inicial', description: 'Afirma sin justificar.' },
        { level: 0, label: 'Sin evidencia', description: 'No hay argumento.' },
      ],
    },
    {
      id: 'interaccion', name: 'Interacción sustantiva', weight: 30,
      levels: [
        { level: 4, label: 'Destacado', description: 'Aporta comparación, pregunta o evidencia en dos respuestas.' },
        { level: 3, label: 'Logrado', description: 'Responde a dos compañeros con aportes pertinentes.' },
        { level: 2, label: 'En desarrollo', description: 'Responde a uno o de forma superficial.' },
        { level: 1, label: 'Inicial', description: 'Solo dice «de acuerdo».' },
        { level: 0, label: 'Sin evidencia', description: 'No responde.' },
      ],
    },
  ],
};

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

bloques.push(PUBLICA ? `-- ============================================================
--  084_clases_quices_actividades_foros_bpm.sql — Curso de BPM completo
--
--  Generado por scripts/generar-migracion-bpm.mjs --publica a partir de
--  contenido/aula/bpm. No editar a mano.
--
--  Aprobado por la dirección académica: todos los cursos llevan quizzes,
--  actividades y foros. Las claves de los quizzes son las mismas que el
--  aula muestra al estudiante cuando envía.
--
--  Qué hace:
--   1. Actualiza los metadatos del curso, la nota mínima ${CURSO.aprobacion}, ${CURSO.intentos} intentos
--      y la política 60/30/10.
--   2. Reemplaza el texto de las nueve clases por la versión completa,
--      conservando videos, enlaces y destacados.
--   3. Crea o actualiza PUBLICADOS tres quizzes (10 % cada uno), tres
--      actividades con rúbrica (20 % cada una) y tres foros con rúbrica
--      (3,34 + 3,33 + 3,33 %). No toca preguntas de quizzes con intentos
--      ni rúbricas o pesos de recursos con entregas o notas.
--   4. Si el curso ya está publicado, aprueba una versión nueva (077)
--      para que quien estudia vea las clases completas.
--   5. Si el curso, una unidad o una clase no está en la base, avisa y
--      se salta: nunca detiene el arranque del servidor.
-- ============================================================
` : `-- ============================================================
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
`);

bloques.push(`
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
    ${fallar('No existe el curso de BPM: aplica primero la migración 034.')}
  END IF;
${PUBLICA ? `
  -- Si alguien cambió unidades o clases en el panel, no se fuerza nada.
  IF EXISTS (
    SELECT 1 FROM (VALUES
${LECCIONES.map((l) => `      (${sqlString(unidadDe(l.id).UNIDAD.titulo)}, ${sqlString(l.titulo)})`).join(',\n')}
    ) AS e(unidad, clase)
     WHERE NOT EXISTS (
       SELECT 1 FROM aula_lessons l JOIN aula_modules m ON m.id = l.module_id
        WHERE l.course_id = v_curso AND m.course_id = v_curso AND l.deleted_at IS NULL AND m.deleted_at IS NULL
          AND m.title = e.unidad AND l.title = e.clase)
  ) THEN
    RAISE NOTICE 'BPM: sus unidades o clases no coinciden con el paquete; se salta.';
    RETURN;
  END IF;
` : ''}
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
         max_attempts = ${CURSO.intentos},${PUBLICA ? `
         grade_policy = '{"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}'::jsonb,` : ''}
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
    ${fallar(`No existe la unidad ${unidad.UNIDAD.numero} del curso de BPM.`)}
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND module_id = v_unidad AND title = ${sqlString(l.titulo)} AND deleted_at IS NULL
   LIMIT 1;

  IF v_clase IS NULL THEN
    ${fallar(`No existe la clase ${l.titulo} en la unidad ${unidad.UNIDAD.numero}.`)}
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
       status, sort_order${PUBLICA ? ', weight' : ''})
    VALUES
      (v_curso, v_unidad, ${sqlString(q.titulo)}, ${sqlString(q.instrucciones)}, TRUE,
       ${CURSO.aprobacion}, ${CURSO.intentos}, FALSE, FALSE, TRUE, '${ESTADO}', ${unidadNum}${PUBLICA ? `, ${PESO_QUIZ}` : ''})
    RETURNING id INTO v_eval;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad,
           instructions_html = ${sqlString(q.instrucciones)},
           is_required = TRUE,
           passing_score = ${CURSO.aprobacion},
           max_attempts = ${CURSO.intentos},
           show_answers_after_submit = TRUE,
           status = '${ESTADO}',${PUBLICA ? `
           weight = ${PESO_QUIZ},` : ''}
           sort_order = ${unidadNum},
           updated_at = NOW()
     WHERE id = v_eval;
  END IF;
${PUBLICA ? `
  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas.', ${sqlString(q.titulo)};
  ELSE
` : ''}
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
  if (PUBLICA) bloques.push(`  END IF;
`);
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
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order${PUBLICA ? ', grading_method, weight' : ''})
    VALUES
      (v_curso, v_unidad, ${sqlString(a.titulo)}, ${dollar('bpm_html', html)}, ${dollar('bpm_json', rubric)}::jsonb,
       TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, '${ESTADO}', ${unidadNum}${PUBLICA ? `, 'rubrica', ${PESO_ACTIVIDAD}` : ''})
    RETURNING id INTO v_act;
  ELSE${PUBLICA ? `
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', ${sqlString(a.titulo)};
    ELSE
      UPDATE aula_activities
         SET rubric = ${dollar('bpm_json', rubric)}::jsonb, grading_method = 'rubrica', weight = ${PESO_ACTIVIDAD}
       WHERE id = v_act;
    END IF;` : ''}
    UPDATE aula_activities
       SET module_id = v_unidad,
           instructions_html = ${dollar('bpm_html', html)},${PUBLICA ? '' : `
           rubric = ${dollar('bpm_json', rubric)}::jsonb,`}
           allow_text = TRUE,
           allow_link = TRUE,
           allow_file = TRUE,
           accepted_extensions = ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[],
           max_file_mb = 20,
           max_points = 100,
           is_required = TRUE,
           status = '${ESTADO}',
           sort_order = ${unidadNum},
           updated_at = NOW()
     WHERE id = v_act;
  END IF;
`);
}

// Forums
FOROS.forEach((f, iForo) => {
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
    INSERT INTO aula_forums (course_id, module_id, scope, title, description, is_closed, allow_attachments${PUBLICA ? ', status, grading_method, weight, rubric, sort_order' : ''})
    VALUES (v_curso, v_unidad, 'modulo', ${sqlString(f.titulo)}, ${dollar('bpm_html', html)}, FALSE, FALSE${PUBLICA ? `, 'publicado', 'rubrica', ${pesoForo(iForo)}, ${dollar('bpm_json', JSON.stringify(RUBRICA_FOROS))}::jsonb, ${unidadNum}` : ''})
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET module_id = v_unidad,
           scope = 'modulo',
           description = ${dollar('bpm_html', html)},
           is_closed = FALSE,
           allow_attachments = FALSE,${PUBLICA ? `
           status = 'publicado',
           sort_order = ${unidadNum},` : ''}
           updated_at = NOW()
     WHERE id = v_foro;${PUBLICA ? `
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', ${sqlString(f.titulo)};
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = ${pesoForo(iForo)}, rubric = ${dollar('bpm_json', JSON.stringify(RUBRICA_FOROS))}::jsonb
       WHERE id = v_foro;
    END IF;` : ''}
  END IF;
`);
});

if (PUBLICA) {
  bloques.push(`
  -- Ya publicado: se aprueba la versión nueva con las clases completas.
  -- Si todavía no tiene su primera versión, esa primera publicación ya
  -- las incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Clases completas, quizzes, actividades y foros (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
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





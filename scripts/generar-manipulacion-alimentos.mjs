/**
 * Genera las migraciones del Curso de Manipulación de Alimentos a partir
 * de scripts/datos/manipulacion-alimentos.mjs:
 *   api/migrations/161_curso_manipulacion_de_alimentos.sql  (curso, unidades y clases)
 *   api/migrations/162_quices_actividades_foros_manipulacion_de_alimentos.sql (quices, actividades y foros)
 *
 *   node scripts/generar-manipulacion-alimentos.mjs
 *
 * El curso se crea en BORRADOR: lo publica la dirección académica después
 * de revisarlo (contenido sanitario y normativo). No editar las migraciones
 * a mano: se corrigen los datos y se vuelve a generar.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURSO, UNIDADES, EVALUACION } from './datos/manipulacion-alimentos.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = 'ma'; // etiqueta de las cadenas $ma…$
const txt = (s) => { if (String(s).includes(`$${T}`)) throw new Error('El texto contiene la etiqueta de cadena'); return `$${T}t$${s}$${T}t$`; };
const json = (o) => `$${T}j$${JSON.stringify(o)}$${T}j$::jsonb`;
const arr = (xs) => `ARRAY[${xs.map((x) => `'${String(x).replace(/'/g, "''")}'`).join(', ')}]::text[]`;
const lista = (xs) => `<ul>${xs.map((x) => `<li>${x}</li>`).join('')}</ul>`;
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const totalMin = UNIDADES.reduce((s, u) => s + u.clases.reduce((a, c) => a + c.minutos, 0), 0);
const descripcion = `<p>${CURSO.short}</p><h2>Objetivo</h2><p>${CURSO.objective}</p><h2>Para quién es</h2><p>${CURSO.audience}</p><h2>Cómo está organizado</h2><p>Cinco unidades con tres clases cada una (${Math.round(totalMin / 60)} horas). Cada clase trae un ejemplo aplicado, errores comunes, puntos clave y sus fuentes. Cada unidad cierra con un quiz, una actividad y un foro; la última actividad es el proyecto final.</p>${CURSO.alcance}<h2>Fuentes</h2><p>Resolución 2674 de 2013 del Ministerio de Salud y Protección Social; INVIMA, concepto 2036144 de 2018; OMS, Manual sobre las cinco claves para la inocuidad de los alimentos (2007).</p>`;

/* ── 161: curso, unidades y clases ─────────────────────────── */
const c = [];
c.push(`-- ============================================================
--  161_curso_manipulacion_de_alimentos.sql
--
--  Generado por scripts/generar-manipulacion-alimentos.mjs (18-nov-2026).
--  Curso propio pedido por la propietaria para la meta de tráfico de los
--  cursos (seo/cursos-nuevos-propuesta.md): «curso manipulacion de
--  alimentos» suma 19.090 búsquedas al mes en Colombia (Semrush).
--
--  5 unidades, 15 clases y ${totalMin} minutos (10 horas: el plan de
--  capacitación del art. 12 de la Res. 2674 de 2013 pide al menos 10 al año).
--  Se crea en BORRADOR, con certificado de COP 60.000 como los demás
--  cursos para profesionales. Lo publica la dirección académica después
--  de revisarlo. Idempotente: si el curso ya existe, no hace nada.
-- ============================================================

DO $${T}$
DECLARE
  v_curso  BIGINT;
  v_unidad BIGINT;
  v_clase  BIGINT;
BEGIN
  IF EXISTS (SELECT 1 FROM aula_courses WHERE title = ${txt(CURSO.title)} AND deleted_at IS NULL) THEN
    RETURN;
  END IF;

  INSERT INTO aula_courses
    (kind, title, short_description, description_html, category, area, level, tags,
     objective, learning_outcomes, audience, duration_minutes, author_name, status, modality, cover_url, publico, certificate_price)
  VALUES ('edvanta', ${txt(CURSO.title)}, ${txt(CURSO.short)},
          ${txt(descripcion)},
          ${txt(CURSO.category)}, ${txt(CURSO.area)}, '${CURSO.level}', ${arr(CURSO.tags)},
          ${txt(CURSO.objective)},
          ${arr(CURSO.outcomes)},
          ${txt(CURSO.audience)},
          ${totalMin}, 'Edvanta', 'borrador', 'asincronica', ${CURSO.cover ? `'${CURSO.cover}'` : 'NULL'}, 'profesionales', 60000)
  RETURNING id INTO v_curso;
`);
UNIDADES.forEach((u, ui) => {
  c.push(`
  INSERT INTO aula_modules (course_id, title, sort_order)
  VALUES (v_curso, ${txt(u.titulo)}, ${ui})
  RETURNING id INTO v_unidad;`);
  u.clases.forEach((cl, ci) => {
    const bloques = [
      ['destacado', { tone: 'info', title: 'En esta clase', html: `<p>${cl.intro}</p>` }],
      ['texto', { html: cl.cuerpo }],
      ['destacado', { tone: 'consejo', title: 'Ejemplo aplicado', html: cl.ejemplo }],
      ['destacado', { tone: 'advertencia', title: 'Errores comunes', html: lista(cl.errores) }],
      ['destacado', { tone: 'importante', title: 'Puntos clave', html: `<ol>${cl.claves.map((k) => `<li>${k}</li>`).join('')}</ol>` }],
      ['destacado', { tone: 'info', title: 'Siguiente paso', html: `<p>${cl.siguiente}</p>` }],
      ['texto', { html: `<h2>Fuentes</h2>${lista(cl.fuentes)}` }],
    ];
    c.push(`
  INSERT INTO aula_lessons (course_id, module_id, title, subtitle, sort_order, completion_rule, duration_minutes, is_required)
  VALUES (v_curso, v_unidad, ${txt(cl.titulo)}, 'Unidad ${ui + 1} · Clase ${ui + 1}.${ci + 1}', ${ci}, 'manual', ${cl.minutos}, TRUE)
  RETURNING id INTO v_clase;`);
    bloques.forEach(([tipo, data], bi) => {
      c.push(`
  INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
  VALUES (v_clase, '${tipo}', ${bi}, ${json(data)});`);
    });
  });
});
c.push(`
END $${T}$;
`);

/* ── 162: quices, actividades y foros ──────────────────────── */
const NIVELES = [
  { level: 4, label: 'Destacado', description: 'Cumple el criterio por completo, con evidencia clara y aplicada a su contexto.' },
  { level: 3, label: 'Logrado', description: 'Cumple el criterio; quedan detalles menores por mejorar.' },
  { level: 2, label: 'En desarrollo', description: 'Cumple el criterio de forma parcial.' },
  { level: 1, label: 'Inicial', description: 'Lo intenta, pero con vacíos importantes.' },
  { level: 0, label: 'Sin evidencia', description: 'No presenta evidencia de este criterio.' },
];
const CRITERIOS = [['Aplica la Resolución 2674 de 2013 y las cinco claves correctamente', 40], ['Identifica riesgos y propone medidas concretas para su contexto', 40], ['Presenta el trabajo completo, claro y ordenado', 20]];
const rubrica = { version: 1, total: 100, criteria: CRITERIOS.map(([name, weight]) => ({ id: slug(name), name, weight, levels: NIVELES })) };
const PESO_QUIZ = 6; const PESO_ACT = 12; const PESO_FORO = 2;

const e = [];
e.push(`-- ============================================================
--  162_quices_actividades_foros_manipulacion_de_alimentos.sql
--
--  Generado por scripts/generar-manipulacion-alimentos.mjs (18-nov-2026).
--  En el Curso de Manipulación de Alimentos (161): nota mínima 70, 2
--  intentos y política 60/30/10 (actividades, quices, foros). Por unidad,
--  un quiz de cuatro preguntas, una actividad con rúbrica (la 5 es el
--  proyecto final) y un foro. Idempotente por título.
-- ============================================================

DO $${T}e$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT := 'publicado';
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = ${txt(CURSO.title)} AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el Curso de Manipulación de Alimentos: aplica primero la migración 161.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2,
         grade_policy = ${json({ version: 1, components: { activities: 60, quizzes: 30, forums: 10 }, rounding: 'half_up' })},
         updated_at = NOW()
   WHERE id = v_curso;
`);
UNIDADES.forEach((u, ui) => {
  const ev = EVALUACION[ui];
  const nombreUnidad = u.titulo.replace(/^Unidad \d+\. /, '');
  const tituloQuiz = `Quiz de la unidad ${ui + 1}: ${nombreUnidad}`;
  const instr = 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.';
  e.push(`
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = ${txt(u.titulo)} AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = ${txt(tituloQuiz)} AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, ${txt(tituloQuiz)}, ${txt(instr)})
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, ${txt(tituloQuiz)}, ${txt(`<p>${instr}</p>`)}, TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, ${PESO_QUIZ})
    RETURNING id INTO v_eval;`);
  ev.quiz.forEach(([pregunta, opciones, correcta, expl], qi) => {
    e.push(`
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', ${txt(`<p>${pregunta}</p>`)}, 25, ${txt(expl)}, ${txt(expl)}, ${json({ external_id: `ma-q${ui + 1}.${qi + 1}` })})
    RETURNING id INTO v_pregunta;`);
    opciones.forEach((op, oi) => {
      e.push(`
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, ${txt(op)}, ${oi === correcta ? 'TRUE' : 'FALSE'}, '', ${oi});`);
    });
    e.push(`
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, ${qi}, 25);`);
  });
  const [tAct, hAct] = ev.actividad;
  const hActCompleto = `${hAct}<h2>Cómo se evalúa</h2><ul>${CRITERIOS.map(([n, w]) => `<li>${n} (${w} %)</li>`).join('')}</ul><p>No incluyas datos personales de clientes ni de pacientes.</p>`;
  const [tForo, pForo] = ev.foro;
  e.push(`
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = ${txt(tAct)} AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, ${txt(tAct)}, ${txt(hActCompleto)}, ${json(rubrica)},
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, ${PESO_ACT}, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = ${txt(tForo)} AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', ${txt(tForo)}, 'Aplicar lo de la unidad a tu trabajo y aprender de los compañeros.',
            ${txt(`<p>${pForo}</p>`)}, ${txt(pForo)}, '{}'::text[],
            ${txt('<p>Publica tu aporte (máx. 200 palabras) y responde a dos compañeros con una sugerencia concreta.</p>')},
            ${txt('<h2>Criterios de valoración</h2><p>Aporte propio aplicado a tu trabajo; dos respuestas con sugerencias específicas y respetuosas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de clientes ni información interna de tu empresa.</p>')},
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', ${PESO_FORO}, NULL, FALSE, FALSE, v_estado, 1);
  END IF;
`);
});
e.push(`
END $${T}e$;
`);

fs.writeFileSync(path.join(raiz, 'api/migrations/161_curso_manipulacion_de_alimentos.sql'), c.join(''));
fs.writeFileSync(path.join(raiz, 'api/migrations/162_quices_actividades_foros_manipulacion_de_alimentos.sql'), e.join(''));
console.log(`161: ${UNIDADES.length} unidades, ${UNIDADES.reduce((s, u) => s + u.clases.length, 0)} clases, ${totalMin} min. 162: ${EVALUACION.length} quices, actividades y foros.`);

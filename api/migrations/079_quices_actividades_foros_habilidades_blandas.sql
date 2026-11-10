-- ============================================================
--  079_quices_actividades_foros_habilidades_blandas.sql — evaluación de
--  la Escuela de Habilidades Blandas
--
--  Generado por scripts/generar-habilidades-blandas.mjs. Se aplica sola
--  al desplegar: la dirección académica pidió que todos los cursos
--  tengan quizzes, actividades y foros (10-nov-2026).
--
--  En cada curso de la 075:
--   1. Nota mínima 70, 2 intentos y política 60/30/10 (actividades,
--      quizzes, foros), y la duración del diseño completo.
--   2. Crea PUBLICADOS un quiz de cuatro preguntas por unidad, una
--      actividad con rúbrica por unidad (la 4 es el proyecto final) y un
--      foro por unidad; lo que ya existiera en borrador queda publicado.
--  Es idempotente: lo que ya existe (por título) no se duplica. Si un
--  curso no está en la base, se salta con un aviso.
-- ============================================================

-- ════ Curso de Oratoria: cómo hablar en público con seguridad ════
DO $evhb01$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Oratoria: cómo hablar en público con seguridad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Oratoria: cómo hablar en público con seguridad: aplica primero la migración 075.';
    RETURN;
  END IF;

  v_estado := 'publicado';
  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, duration_minutes = 960,
         grade_policy = $evhb01j${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhb01j$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la oratoria' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 1: Fundamentos de la oratoria' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 1: Fundamentos de la oratoria', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 1: Fundamentos de la oratoria', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>¿Cuál de los pilares de Aristóteles se refiere a la credibilidad del orador?</p>$evhb01h$, 25, $evhb01h$El ethos es la credibilidad: el público escucha porque confía en quien habla.$evhb01h$, $evhb01h$El ethos es la credibilidad: el público escucha porque confía en quien habla.$evhb01h$, $evhb01j${"external_id":"hb01-q1.1"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Logos$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Pathos$evhb01h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Ethos$evhb01h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Kairos$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>Una presentación con muchas cifras pero sin ejemplos ni historias está desequilibrada hacia:</p>$evhb01h$, 25, $evhb01h$Se apoya solo en la lógica (logos) y descuida la emoción que hace que los datos importen.$evhb01h$, $evhb01h$Se apoya solo en la lógica (logos) y descuida la emoción que hace que los datos importen.$evhb01h$, $evhb01j${"external_id":"hb01-q1.2"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Pathos$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Logos$evhb01h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Ethos$evhb01h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Ninguno$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>Al revisar tu video SIN sonido, principalmente evalúas:</p>$evhb01h$, 25, $evhb01h$Sin audio te concentras en el lenguaje corporal.$evhb01h$, $evhb01h$Sin audio te concentras en el lenguaje corporal.$evhb01h$, $evhb01j${"external_id":"hb01-q1.3"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Muletillas$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Velocidad$evhb01h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Postura, gestos y mirada$evhb01h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Estructura del mensaje$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>¿Cuál es una meta de mejora bien formulada?</p>$evhb01h$, 25, $evhb01h$Es específica, medible y tiene plazo.$evhb01h$, $evhb01h$Es específica, medible y tiene plazo.$evhb01h$, $evhb01j${"external_id":"hb01-q1.4"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Hablar mejor en público$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Ser más carismático$evhb01h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Bajar de 8 a 3 muletillas por minuto en cuatro semanas$evhb01h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$No ponerme nervioso$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Mi video de línea base' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Mi video de línea base', $evhb01h$<h2>Qué vas a hacer</h2><p>Grábate 2 minutos explicando un tema de tu trabajo, sin leer. Mira el video tres veces (sin sonido, solo audio y completo), llena la rúbrica de diagnóstico y cuenta muletillas y palabras por minuto.</p><h2>Qué entregas</h2><p>Video (enlace privado) + rúbrica diligenciada + 3 metas medibles.</p><h2>Cómo se evalúa</h2><ul><li>Completa el registro de datos objetivos (30 %)</li><li>Autoevaluación argumentada en los 5 componentes (40 %)</li><li>Metas medibles y priorizadas (30 %)</li></ul><p>Tiempo estimado: 60 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb01h$, $evhb01j${"version":1,"total":100,"criteria":[{"id":"completa-el-registro-de-datos-objetivos","name":"Completa el registro de datos objetivos","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"autoevaluacion-argumentada-en-los-5-componentes","name":"Autoevaluación argumentada en los 5 componentes","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"metas-medibles-y-priorizadas","name":"Metas medibles y priorizadas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb01j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = '¿Qué te frena al hablar en público?' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', '¿Qué te frena al hablar en público?', 'Aplicar lo de la unidad 1 a tu trabajo y aprender de los compañeros.',
            $evhb01h$<p>Comparte tus tres metas de mejora y una situación real de tu trabajo en la que te gustaría hablar con más seguridad. ¿Qué componente (mensaje, estructura, voz, cuerpo o conexión) crees que más te frena y por qué?</p>$evhb01h$, $evhb01h$Comparte tus tres metas de mejora y una situación real de tu trabajo en la que te gustaría hablar con más seguridad. ¿Qué componente (mensaje, estructura, voz, cuerpo o conexión) crees que más te frena y por qué?$evhb01h$, '{}'::text[],
            $evhb01h$<p>Publica tu aporte (máx. 200 palabras) y responde a dos compañeros con una sugerencia concreta para una de sus metas.</p>$evhb01h$,
            $evhb01h$<h2>Criterios de valoración</h2><p>Aporte propio con metas medibles; dos respuestas con sugerencias específicas y respetuosas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb01h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Estructura del discurso' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 2: Estructura del discurso' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 2: Estructura del discurso', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 2: Estructura del discurso', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 2, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>¿Cuál es un mensaje central y no solo un tema?</p>$evhb01h$, 25, $evhb01h$Es una afirmación completa que dice qué debe pensar o hacer la audiencia.$evhb01h$, $evhb01h$Es una afirmación completa que dice qué debe pensar o hacer la audiencia.$evhb01h$, $evhb01j${"external_id":"hb01-q2.1"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$La cadena de frío$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Las insulinas en la droguería$evhb01h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Registrar la temperatura en cada recepción evita pérdidas de insulina y riesgos para el paciente$evhb01h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Normativa de termolábiles$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>Según el principio de la pirámide de Minto, la conclusión va:</p>$evhb01h$, 25, $evhb01h$Minto propone empezar por la conclusión y sostenerla con razones y evidencia.$evhb01h$, $evhb01h$Minto propone empezar por la conclusión y sostenerla con razones y evidencia.$evhb01h$, $evhb01j${"external_id":"hb01-q2.2"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Al final$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$En la cima, al principio$evhb01h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$En la mitad$evhb01h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Solo en las diapositivas$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>¿Qué tres elementos debe tener cada idea del cuerpo?</p>$evhb01h$, 25, $evhb01h$Así cada idea queda clara, sustentada y concreta.$evhb01h$, $evhb01h$Así cada idea queda clara, sustentada y concreta.$evhb01h$, $evhb01j${"external_id":"hb01-q2.3"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Título, imagen y cita$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Afirmación, evidencia y ejemplo$evhb01h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Dato, chiste y pregunta$evhb01h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Introducción, nudo y desenlace$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>¿Cuál es la mejor forma de cerrar?</p>$evhb01h$, 25, $evhb01h$El cierre se recuerda: resume y moviliza.$evhb01h$, $evhb01h$El cierre se recuerda: resume y moviliza.$evhb01h$, $evhb01j${"external_id":"hb01-q2.4"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$"Eso es todo, gracias"$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Responder la última pregunta y salir$evhb01h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Resumir las tres ideas y pedir una acción concreta$evhb01h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Mostrar la bibliografía$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Discurso de 3 minutos en pirámide' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Discurso de 3 minutos en pirámide', $evhb01h$<h2>Qué vas a hacer</h2><p>Usa la plantilla para construir un discurso de 3 minutos: mensaje central (≤25 palabras), apertura de un tipo del banco, tres ideas con afirmación-evidencia-ejemplo y cierre con acción.</p><h2>Qué entregas</h2><p>Plantilla diligenciada (1 página).</p><h2>Cómo se evalúa</h2><ul><li>Mensaje pasa las 4 pruebas (35 %)</li><li>Tres ideas coherentes con evidencia (35 %)</li><li>Apertura y cierre efectivos (30 %)</li></ul><p>Tiempo estimado: 50 minutos.</p>$evhb01h$, $evhb01j${"version":1,"total":100,"criteria":[{"id":"mensaje-pasa-las-4-pruebas","name":"Mensaje pasa las 4 pruebas","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"tres-ideas-coherentes-con-evidencia","name":"Tres ideas coherentes con evidencia","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"apertura-y-cierre-efectivos","name":"Apertura y cierre efectivos","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb01j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 2, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi mensaje en una frase' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi mensaje en una frase', 'Aplicar lo de la unidad 2 a tu trabajo y aprender de los compañeros.',
            $evhb01h$<p>Publica el mensaje central de tu próxima presentación real (máx. 25 palabras). ¿Pasa la prueba del &quot;¿y qué?&quot;?</p>$evhb01h$, $evhb01h$Publica el mensaje central de tu próxima presentación real (máx. 25 palabras). ¿Pasa la prueba del "¿y qué?"?$evhb01h$, '{}'::text[],
            $evhb01h$<p>Lee los mensajes de dos compañeros y aplica las cuatro pruebas. Propón una versión mejorada de su frase.</p>$evhb01h$,
            $evhb01h$<h2>Criterios de valoración</h2><p>Mensaje propio formulado como afirmación; dos retroalimentaciones que apliquen las pruebas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb01h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 2);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Voz y cuerpo' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 3: Voz y cuerpo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 3: Voz y cuerpo', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 3: Voz y cuerpo', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 3, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>¿Qué tipo de respiración da más apoyo y control a la voz?</p>$evhb01h$, 25, $evhb01h$Usa la parte baja de los pulmones y permite exhalar de forma controlada.$evhb01h$, $evhb01h$Usa la parte baja de los pulmones y permite exhalar de forma controlada.$evhb01h$, $evhb01j${"external_id":"hb01-q3.1"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Clavicular$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Diafragmática$evhb01h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Rápida y superficial$evhb01h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Por la boca únicamente$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>¿Cuál es la mejor estrategia para reemplazar una muletilla?</p>$evhb01h$, 25, $evhb01h$El silencio es el reemplazo natural y transmite seguridad.$evhb01h$, $evhb01h$El silencio es el reemplazo natural y transmite seguridad.$evhb01h$, $evhb01j${"external_id":"hb01-q3.2"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Hablar más rápido$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Decir otra palabra de relleno$evhb01h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Hacer un silencio breve y respirar$evhb01h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Leer el texto$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>La técnica &quot;una idea, una persona&quot; consiste en:</p>$evhb01h$, 25, $evhb01h$Cada asistente siente que le hablas directamente.$evhb01h$, $evhb01h$Cada asistente siente que le hablas directamente.$evhb01h$, $evhb01j${"external_id":"hb01-q3.3"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Barrer el salón con la vista$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Mirar a la pantalla$evhb01h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Dirigir cada frase completa a una persona distinta$evhb01h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Mirar solo al jefe$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>Sobre las &quot;poses de poder&quot;, la evidencia actual indica que:</p>$evhb01h$, 25, $evhb01h$Los estudios de replicación no confirmaron el efecto hormonal.$evhb01h$, $evhb01h$Los estudios de replicación no confirmaron el efecto hormonal.$evhb01h$, $evhb01j${"external_id":"hb01-q3.4"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Cambian siempre las hormonas$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Los efectos hormonales no se replicaron, aunque una postura abierta comunica seguridad$evhb01h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Son peligrosas$evhb01h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Solo sirven en hombres$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Ensayo de voz y cuerpo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Ensayo de voz y cuerpo', $evhb01h$<h2>Qué vas a hacer</h2><p>Graba tu discurso de 3 minutos aplicando: rutina vocal previa, al menos 3 pausas intencionales, postura de base y la técnica &quot;una idea, una persona&quot; (mira a la cámara y a dos puntos laterales).</p><h2>Qué entregas</h2><p>Video de 3 minutos + checklist de lenguaje corporal + conteo de muletillas comparado con la línea base.</p><h2>Cómo se evalúa</h2><ul><li>Voz: volumen, variación y pausas (35 %)</li><li>Cuerpo: postura, gestos y mirada (35 %)</li><li>Mejora frente a línea base documentada (30 %)</li></ul><p>Tiempo estimado: 60 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb01h$, $evhb01j${"version":1,"total":100,"criteria":[{"id":"voz-volumen-variacion-y-pausas","name":"Voz: volumen, variación y pausas","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"cuerpo-postura-gestos-y-mirada","name":"Cuerpo: postura, gestos y mirada","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"mejora-frente-a-linea-base-documentada","name":"Mejora frente a línea base documentada","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb01j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 3, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Antes y después' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Antes y después', 'Aplicar lo de la unidad 3 a tu trabajo y aprender de los compañeros.',
            $evhb01h$<p>Compara tu video de línea base con el ensayo de voz y cuerpo. ¿Qué cambió? ¿Qué te costó más trabajo?</p>$evhb01h$, $evhb01h$Compara tu video de línea base con el ensayo de voz y cuerpo. ¿Qué cambió? ¿Qué te costó más trabajo?$evhb01h$, '{}'::text[],
            $evhb01h$<p>Comparte dos cifras (muletillas/min y palabras/min) antes y después. Comenta el progreso de dos compañeros.</p>$evhb01h$,
            $evhb01h$<h2>Criterios de valoración</h2><p>Datos comparativos propios; reflexión sobre dificultades; dos comentarios con reconocimiento y sugerencia.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb01h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 3);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Práctica y situaciones reales' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 4: Práctica y situaciones reales' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 4: Práctica y situaciones reales', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 4: Práctica y situaciones reales', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 4, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>¿Qué significa la primera P del método PREP?</p>$evhb01h$, 25, $evhb01h$Se empieza por responder de forma directa en una frase.$evhb01h$, $evhb01h$Se empieza por responder de forma directa en una frase.$evhb01h$, $evhb01j${"external_id":"hb01-q4.1"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Pregunta$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Punto (la respuesta directa)$evhb01h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Pausa$evhb01h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Presentación$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>¿Qué conviene memorizar de un discurso?</p>$evhb01h$, 25, $evhb01h$Lo demás se internaliza como estructura.$evhb01h$, $evhb01h$Lo demás se internaliza como estructura.$evhb01h$, $evhb01j${"external_id":"hb01-q4.2"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Todo el texto$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Nada$evhb01h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Apertura, cierre, cifras y citas$evhb01h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Solo las diapositivas$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>Si no sabes la respuesta a una pregunta técnica sobre una dosis, lo correcto es:</p>$evhb01h$, 25, $evhb01h$En salud la credibilidad y la seguridad del paciente dependen de no improvisar datos.$evhb01h$, $evhb01h$En salud la credibilidad y la seguridad del paciente dependen de no improvisar datos.$evhb01h$, $evhb01j${"external_id":"hb01-q4.3"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Dar un dato aproximado$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Cambiar de tema$evhb01h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Reconocerlo y ofrecer verificar en una fuente confiable$evhb01h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Decir que no es importante$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb01h$<p>En la práctica deliberada, cada ensayo debe tener:</p>$evhb01h$, 25, $evhb01h$La práctica deliberada se enfoca en una habilidad con retroalimentación.$evhb01h$, $evhb01h$La práctica deliberada se enfoca en una habilidad con retroalimentación.$evhb01h$, $evhb01j${"external_id":"hb01-q4.4"}$evhb01j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Público grande$evhb01h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Un objetivo concreto y una forma de medirlo$evhb01h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Diapositivas nuevas$evhb01h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb01h$Duración de una hora$evhb01h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Discurso final + ronda de preguntas' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Discurso final + ronda de preguntas', $evhb01h$<h2>Qué vas a hacer</h2><p>Graba tu discurso final de 3 a 5 minutos (aplicando estructura, voz y cuerpo) y, a continuación, responde con PREP tres preguntas del banco elegidas al azar por un compañero o familiar.</p><h2>Qué entregas</h2><p>Video completo + autoevaluación con la rúbrica inicial + comparación con tu línea base.</p><h2>Cómo se evalúa</h2><ul><li>Mensaje y estructura (25 %)</li><li>Voz (20 %)</li><li>Cuerpo (20 %)</li><li>Respuestas PREP (20 %)</li><li>Evidencia de progreso frente a la línea base (15 %)</li></ul><p>Tiempo estimado: 90 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb01h$, $evhb01j${"version":1,"total":100,"criteria":[{"id":"mensaje-y-estructura","name":"Mensaje y estructura","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"voz","name":"Voz","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"cuerpo","name":"Cuerpo","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"respuestas-prep","name":"Respuestas PREP","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"evidencia-de-progreso-frente-a-la-linea-base","name":"Evidencia de progreso frente a la línea base","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb01j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 4, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'La pregunta más difícil que me han hecho' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'La pregunta más difícil que me han hecho', 'Aplicar lo de la unidad 4 a tu trabajo y aprender de los compañeros.',
            $evhb01h$<p>Cuenta una pregunta difícil que te hayan hecho en una presentación o en tu trabajo. ¿Cómo la respondiste? Reescribe ahora la respuesta con el método PREP.</p>$evhb01h$, $evhb01h$Cuenta una pregunta difícil que te hayan hecho en una presentación o en tu trabajo. ¿Cómo la respondiste? Reescribe ahora la respuesta con el método PREP.$evhb01h$, '{}'::text[],
            $evhb01h$<p>Publica tu caso y tu respuesta PREP. Comenta el caso de un compañero proponiendo una frase puente alternativa.</p>$evhb01h$,
            $evhb01h$<h2>Criterios de valoración</h2><p>Caso real; respuesta en los 4 pasos de PREP; aporte constructivo a un compañero.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb01h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 4);
  END IF;

  -- Lo que existiera en borrador (p. ej., de la antigua versión privada 076) queda publicado.
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_activities  SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_forums      SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
END
$evhb01$;

-- ════ Curso para perder el miedo a hablar en público ════
DO $evhb02$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso para perder el miedo a hablar en público' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso para perder el miedo a hablar en público: aplica primero la migración 075.';
    RETURN;
  END IF;

  v_estado := 'publicado';
  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, duration_minutes = 720,
         grade_policy = $evhb02j${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhb02j$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Entender el miedo' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 1: Entender el miedo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 1: Entender el miedo', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 1: Entender el miedo', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>La sensación de que los demás notan tus nervios mucho más de lo que realmente lo hacen se llama:</p>$evhb02h$, 25, $evhb02h$Investigada por Gilovich y Savitsky en oradores.$evhb02h$, $evhb02h$Investigada por Gilovich y Savitsky en oradores.$evhb02h$, $evhb02j${"external_id":"hb02-q1.1"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Efecto halo$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Ilusión de transparencia$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Efecto Dunning-Kruger$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Sesgo de confirmación$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>¿Qué efecto tiene evitar las presentaciones a largo plazo?</p>$evhb02h$, 25, $evhb02h$La evitación da alivio inmediato pero refuerza el ciclo.$evhb02h$, $evhb02h$La evitación da alivio inmediato pero refuerza el ciclo.$evhb02h$, $evhb02j${"external_id":"hb02-q1.2"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Elimina el miedo$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Mantiene y refuerza el miedo$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$No tiene efecto$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Mejora la voz$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>La boca seca durante una presentación se debe a:</p>$evhb02h$, 25, $evhb02h$Es parte normal de la activación simpática.$evhb02h$, $evhb02h$Es parte normal de la activación simpática.$evhb02h$, $evhb02j${"external_id":"hb02-q1.3"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Falta de preparación$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$La respuesta de estrés, que reduce la salivación$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Una enfermedad$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Hablar muy lento$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>El objetivo del registro de pensamientos es:</p>$evhb02h$, 25, $evhb02h$Se buscan pensamientos realistas, no ingenuamente positivos.$evhb02h$, $evhb02h$Se buscan pensamientos realistas, no ingenuamente positivos.$evhb02h$, $evhb02j${"external_id":"hb02-q1.4"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Pensar siempre en positivo$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Encontrar un pensamiento más realista con base en evidencia$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Olvidar la presentación$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Culpar al público$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Mapa de mi miedo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Mapa de mi miedo', $evhb02h$<h2>Qué vas a hacer</h2><p>Completa el test de autoevaluación, identifica tus 3 síntomas físicos más frecuentes, describe tu ciclo del miedo (anticipación–síntomas–interpretación–evitación) y haz un registro de pensamientos completo de una situación próxima.</p><h2>Qué entregas</h2><p>Documento de 1 a 2 páginas con test, ciclo y registro de pensamientos.</p><h2>Cómo se evalúa</h2><ul><li>Identificación precisa de síntomas y ciclo (40 %)</li><li>Registro de pensamientos con evidencias a favor y en contra (40 %)</li><li>Pensamiento alternativo realista (20 %)</li></ul><p>Tiempo estimado: 45 minutos.</p>$evhb02h$, $evhb02j${"version":1,"total":100,"criteria":[{"id":"identificacion-precisa-de-sintomas-y-ciclo","name":"Identificación precisa de síntomas y ciclo","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"registro-de-pensamientos-con-evidencias-a-favor-y-en-contra","name":"Registro de pensamientos con evidencias a favor y en contra","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"pensamiento-alternativo-realista","name":"Pensamiento alternativo realista","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb02j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Lo que me dice mi mente' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Lo que me dice mi mente', 'Aplicar lo de la unidad 1 a tu trabajo y aprender de los compañeros.',
            $evhb02h$<p>Comparte (de forma anónima si prefieres) un pensamiento automático que aparece antes de hablar en público y el pensamiento alternativo que construiste.</p>$evhb02h$, $evhb02h$Comparte (de forma anónima si prefieres) un pensamiento automático que aparece antes de hablar en público y el pensamiento alternativo que construiste.$evhb02h$, '{}'::text[],
            $evhb02h$<p>Responde a dos compañeros identificando qué distorsión ves en su pensamiento original (lectura de mente, catastrofización, etc.).</p>$evhb02h$,
            $evhb02h$<h2>Criterios de valoración</h2><p>Pensamiento y alternativa claros; respuestas empáticas que nombren la distorsión. Moderación: el tutor cuida un tono de respeto y confidencialidad.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb02h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Herramientas para regular el cuerpo y la mente' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 2: Herramientas para regular el cuerpo y la mente' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 2: Herramientas para regular el cuerpo y la mente', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 2: Herramientas para regular el cuerpo y la mente', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 2, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>¿Qué parte de la respiración tiene mayor efecto calmante?</p>$evhb02h$, 25, $evhb02h$Alargar la exhalación favorece la activación parasimpática.$evhb02h$, $evhb02h$Alargar la exhalación favorece la activación parasimpática.$evhb02h$, $evhb02j${"external_id":"hb02-q2.1"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$La inhalación rápida$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$La exhalación prolongada$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Sostener el aire mucho tiempo$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Respirar por la boca$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>En el suspiro fisiológico se hace:</p>$evhb02h$, 25, $evhb02h$Es el patrón de doble inhalación seguido de exhalación lenta.$evhb02h$, $evhb02h$Es el patrón de doble inhalación seguido de exhalación lenta.$evhb02h$, $evhb02j${"external_id":"hb02-q2.2"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Una inhalación y exhalación corta$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Doble inhalación por la nariz y exhalación larga por la boca$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Respiración en caja$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Hiperventilación$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>Según Brooks (2014), antes de una tarea estresante conviene decir:</p>$evhb02h$, 25, $evhb02h$Reinterpretar como entusiasmo mejoró el desempeño.$evhb02h$, $evhb02h$Reinterpretar como entusiasmo mejoró el desempeño.$evhb02h$, $evhb02j${"external_id":"hb02-q2.3"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Estoy tranquilo$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Estoy ansioso$evhb02h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Estoy emocionado$evhb02h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$No digo nada$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>¿Por qué es más fácil pasar de ansiedad a entusiasmo que a calma?</p>$evhb02h$, 25, $evhb02h$Comparten la activación fisiológica; solo cambia la interpretación.$evhb02h$, $evhb02h$Comparten la activación fisiológica; solo cambia la interpretación.$evhb02h$, $evhb02j${"external_id":"hb02-q2.4"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Porque ambos son estados de alta activación$evhb02h$, TRUE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Porque la calma no existe$evhb02h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Porque el entusiasmo es un medicamento$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Porque se necesita café$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Mi kit de regulación' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Mi kit de regulación', $evhb02h$<h2>Qué vas a hacer</h2><p>Durante 7 días practica 5 minutos de suspiro cíclico y registra tu calma (0–10) antes y después. Escribe tu guion de 3 autoinstrucciones y úsalo antes de una reunión o situación en la que debas hablar.</p><h2>Qué entregas</h2><p>Registro de 7 días + guion + reflexión breve sobre la situación real.</p><h2>Cómo se evalúa</h2><ul><li>Registro completo y consistente (40 %)</li><li>Guion personalizado y realista (30 %)</li><li>Reflexión sobre la aplicación real (30 %)</li></ul><p>Tiempo estimado: 60 minutos.</p>$evhb02h$, $evhb02j${"version":1,"total":100,"criteria":[{"id":"registro-completo-y-consistente","name":"Registro completo y consistente","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"guion-personalizado-y-realista","name":"Guion personalizado y realista","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"reflexion-sobre-la-aplicacion-real","name":"Reflexión sobre la aplicación real","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb02j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 2, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi técnica favorita' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi técnica favorita', 'Aplicar lo de la unidad 2 a tu trabajo y aprender de los compañeros.',
            $evhb02h$<p>¿Cuál técnica de la unidad te funcionó mejor y en qué situación la usaste? Comparte tu guion de autoinstrucciones.</p>$evhb02h$, $evhb02h$¿Cuál técnica de la unidad te funcionó mejor y en qué situación la usaste? Comparte tu guion de autoinstrucciones.$evhb02h$, '{}'::text[],
            $evhb02h$<p>Lee los guiones de dos compañeros y destaca la frase que más te sirvió o adoptarías.</p>$evhb02h$,
            $evhb02h$<h2>Criterios de valoración</h2><p>Experiencia concreta; guion compartido; respuestas que reconozcan y complementen.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb02h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 2);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Exposición gradual y preparación' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 3: Exposición gradual y preparación' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 3: Exposición gradual y preparación', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 3: Exposición gradual y preparación', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 3, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>La exposición gradual reduce el miedo principalmente por:</p>$evhb02h$, 25, $evhb02h$Al quedarse en la situación, la ansiedad baja y el cerebro aprende que la catástrofe no ocurre.$evhb02h$, $evhb02h$Al quedarse en la situación, la ansiedad baja y el cerebro aprende que la catástrofe no ocurre.$evhb02h$, $evhb02j${"external_id":"hb02-q3.1"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Distracción$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Habituación y nuevo aprendizaje$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Evitación$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Medicación$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>¿Con qué nivel de USA conviene empezar la escalera?</p>$evhb02h$, 25, $evhb02h$Suficientemente retador para aprender, sin bloquearse.$evhb02h$, $evhb02h$Suficientemente retador para aprender, sin bloquearse.$evhb02h$, $evhb02j${"external_id":"hb02-q3.2"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$90–100$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$0–10$evhb02h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$30–40$evhb02h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$No importa$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>Leer todo el texto para no mirar al público es un ejemplo de:</p>$evhb02h$, 25, $evhb02h$Las conductas de seguridad mantienen el miedo y se deben reducir.$evhb02h$, $evhb02h$Las conductas de seguridad mantienen el miedo y se deben reducir.$evhb02h$, $evhb02j${"external_id":"hb02-q3.3"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Buena preparación$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Conducta de seguridad que impide el aprendizaje$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Técnica de respiración$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Exposición$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>¿Qué parte de la presentación conviene memorizar para manejar el pico de ansiedad?</p>$evhb02h$, 25, $evhb02h$La ansiedad suele ser máxima en el arranque.$evhb02h$, $evhb02h$La ansiedad suele ser máxima en el arranque.$evhb02h$, $evhb02j${"external_id":"hb02-q3.4"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Todo$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Los primeros 60 segundos$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Solo la bibliografía$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Nada$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Mi escalera de exposición' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Mi escalera de exposición', $evhb02h$<h2>Qué vas a hacer</h2><p>Diseña tu escalera de 10 peldaños con USA, completa al menos 2 peldaños con registro (USA antes, durante y después, y aprendizaje) y escribe tus primeros 60 segundos para el peldaño 3.</p><h2>Qué entregas</h2><p>Plantilla de escalera + registros de exposición + guion de 60 segundos.</p><h2>Cómo se evalúa</h2><ul><li>Escalera graduada y realista (35 %)</li><li>Registros completos de 2 exposiciones (40 %)</li><li>Guion de apertura con los 4 elementos (25 %)</li></ul><p>Tiempo estimado: 75 minutos.</p>$evhb02h$, $evhb02j${"version":1,"total":100,"criteria":[{"id":"escalera-graduada-y-realista","name":"Escalera graduada y realista","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"registros-completos-de-2-exposiciones","name":"Registros completos de 2 exposiciones","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"guion-de-apertura-con-los-4-elementos","name":"Guion de apertura con los 4 elementos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb02j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 3, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi primer peldaño' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi primer peldaño', 'Aplicar lo de la unidad 3 a tu trabajo y aprender de los compañeros.',
            $evhb02h$<p>Cuenta cómo te fue en tu primer peldaño de exposición: qué temías que pasara, qué pasó en realidad y qué aprendiste.</p>$evhb02h$, $evhb02h$Cuenta cómo te fue en tu primer peldaño de exposición: qué temías que pasara, qué pasó en realidad y qué aprendiste.$evhb02h$, '{}'::text[],
            $evhb02h$<p>Responde a dos compañeros reconociendo su avance y sugiriendo el siguiente peldaño.</p>$evhb02h$,
            $evhb02h$<h2>Criterios de valoración</h2><p>Relato con USA antes/después; aprendizaje explícito; retroalimentación de apoyo.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb02h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 3);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. En escena y plan de 30 días' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 4: En escena y plan de 30 días' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 4: En escena y plan de 30 días', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 4: En escena y plan de 30 días', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 4, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>Si te quedas en blanco, la primera técnica recomendada es:</p>$evhb02h$, 25, $evhb02h$La pausa es breve, natural y te permite recuperar el hilo.$evhb02h$, $evhb02h$La pausa es breve, natural y te permite recuperar el hilo.$evhb02h$, $evhb02j${"external_id":"hb02-q4.1"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Pedir disculpas y salir$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Hacer una pausa intencional y respirar$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Hablar más rápido$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Contar un chiste$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>¿Por qué memorizar palabra por palabra aumenta el riesgo de quedarse en blanco?</p>$evhb02h$, 25, $evhb02h$Es mejor internalizar la estructura.$evhb02h$, $evhb02h$Es mejor internalizar la estructura.$evhb02h$, $evhb02j${"external_id":"hb02-q4.2"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Porque cansa$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Porque si se pierde una palabra se rompe la cadena$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Porque el público lo nota$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$No aumenta el riesgo$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>¿Cuál es una señal para buscar ayuda profesional?</p>$evhb02h$, 25, $evhb02h$Puede indicar un trastorno de ansiedad social que requiere evaluación.$evhb02h$, $evhb02h$Puede indicar un trastorno de ansiedad social que requiere evaluación.$evhb02h$, $evhb02j${"external_id":"hb02-q4.3"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Sentir nervios antes de una ponencia$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$El miedo aparece en muchas situaciones sociales y hace rechazar oportunidades importantes$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Tener la boca seca$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Necesitar notas$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb02h$<p>Ante una recaída en el plan, lo más importante es:</p>$evhb02h$, 25, $evhb02h$Las recaídas son normales; la evitación es lo que mantiene el miedo.$evhb02h$, $evhb02h$Las recaídas son normales; la evitación es lo que mantiene el miedo.$evhb02h$, $evhb02j${"external_id":"hb02-q4.4"}$evhb02j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Abandonar el plan$evhb02h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$No volver a la evitación y ajustar el peldaño$evhb02h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Empezar desde cero$evhb02h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb02h$Tomar un medicamento sin fórmula$evhb02h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Plan personal de 30 días' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Plan personal de 30 días', $evhb02h$<h2>Qué vas a hacer</h2><p>Completa tu calendario de 30 días con actividades diarias y exposiciones semanales. Al terminar la semana 1, graba un video de 2 minutos aplicando tu rutina previa y al menos una técnica de rescate simulada.</p><h2>Qué entregas</h2><p>Calendario de 30 días + registro de semana 1 + video de 2 minutos.</p><h2>Cómo se evalúa</h2><ul><li>Plan realista y completo (35 %)</li><li>Registro de la semana 1 (30 %)</li><li>Video con rutina y técnica de rescate (35 %)</li></ul><p>Tiempo estimado: 90 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb02h$, $evhb02j${"version":1,"total":100,"criteria":[{"id":"plan-realista-y-completo","name":"Plan realista y completo","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"registro-de-la-semana-1","name":"Registro de la semana 1","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"video-con-rutina-y-tecnica-de-rescate","name":"Video con rutina y técnica de rescate","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb02j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 4, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi compromiso de 30 días' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi compromiso de 30 días', 'Aplicar lo de la unidad 4 a tu trabajo y aprender de los compañeros.',
            $evhb02h$<p>Comparte tu fecha de inicio, tus tres exposiciones más retadoras del plan y cómo vas a celebrar los logros.</p>$evhb02h$, $evhb02h$Comparte tu fecha de inicio, tus tres exposiciones más retadoras del plan y cómo vas a celebrar los logros.$evhb02h$, '{}'::text[],
            $evhb02h$<p>Elige a un compañero como &quot;aliado de práctica&quot; y comenta su plan. Vuelve al foro el día 15 para contar tu avance.</p>$evhb02h$,
            $evhb02h$<h2>Criterios de valoración</h2><p>Compromiso concreto y fechado; interacción de apoyo; seguimiento al día 15.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb02h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 4);
  END IF;

  -- Lo que existiera en borrador (p. ej., de la antigua versión privada 076) queda publicado.
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_activities  SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_forums      SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
END
$evhb02$;

-- ════ Curso de Presentaciones Efectivas y Storytelling ════
DO $evhb03$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Presentaciones Efectivas y Storytelling' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Presentaciones Efectivas y Storytelling: aplica primero la migración 075.';
    RETURN;
  END IF;

  v_estado := 'publicado';
  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, duration_minutes = 960,
         grade_policy = $evhb03j${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhb03j$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Audiencia y propósito' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 1: Audiencia y propósito' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 1: Audiencia y propósito', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 1: Audiencia y propósito', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>¿Cuál es el primer paso recomendado para crear una presentación?</p>$evhb03h$, 25, $evhb03h$Diseñar al final evita diapositivas recargadas.$evhb03h$, $evhb03h$Diseñar al final evita diapositivas recargadas.$evhb03h$, $evhb03j${"external_id":"hb03-q1.1"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Elegir la plantilla de PowerPoint$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Planear audiencia, objetivo y mensaje en papel$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Buscar imágenes$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Escribir la bibliografía$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>Un &quot;slideument&quot; es:</p>$evhb03h$, 25, $evhb03h$Término de Nancy Duarte; falla como documento y como apoyo visual.$evhb03h$, $evhb03h$Término de Nancy Duarte; falla como documento y como apoyo visual.$evhb03h$, $evhb03j${"external_id":"hb03-q1.2"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Un software$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Una diapositiva que intenta ser documento y presentación a la vez$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Un tipo de gráfico$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Un resumen ejecutivo$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>Para pacientes, un dato de riesgo se comunica mejor como:</p>$evhb03h$, 25, $evhb03h$Las frecuencias naturales son más comprensibles para el público general.$evhb03h$, $evhb03h$Las frecuencias naturales son más comprensibles para el público general.$evhb03h$, $evhb03j${"external_id":"hb03-q1.3"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Reducción de riesgo relativo$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Frecuencia natural (de cada 100 personas…)$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Valor p$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Hazard ratio$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>Ante un comité directivo conviene:</p>$evhb03h$, 25, $evhb03h$Los directivos prefieren la conclusión primero.$evhb03h$, $evhb03h$Los directivos prefieren la conclusión primero.$evhb03h$, $evhb03j${"external_id":"hb03-q1.4"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Empezar por los antecedentes$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Dar la recomendación primero y luego sustentarla$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Mostrar todos los estudios$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$No dar recomendación$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Lienzo y mapa de audiencia' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Lienzo y mapa de audiencia', $evhb03h$<h2>Qué vas a hacer</h2><p>Para una presentación real (o el caso propuesto: inclusión de un medicamento en el listado institucional), diligencia el lienzo audiencia–objetivo–mensaje y el mapa de audiencia con 3 objeciones y sus respuestas.</p><h2>Qué entregas</h2><p>Lienzo + mapa de audiencia (2 páginas).</p><h2>Cómo se evalúa</h2><ul><li>Objetivo formulado como acción observable (30 %)</li><li>Mapa de audiencia completo y realista (40 %)</li><li>Objeciones con respuestas basadas en evidencia (30 %)</li></ul><p>Tiempo estimado: 50 minutos.</p>$evhb03h$, $evhb03j${"version":1,"total":100,"criteria":[{"id":"objetivo-formulado-como-accion-observable","name":"Objetivo formulado como acción observable","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"mapa-de-audiencia-completo-y-realista","name":"Mapa de audiencia completo y realista","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"objeciones-con-respuestas-basadas-en-evidencia","name":"Objeciones con respuestas basadas en evidencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb03j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'La peor presentación que he visto' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'La peor presentación que he visto', 'Aplicar lo de la unidad 1 a tu trabajo y aprender de los compañeros.',
            $evhb03h$<p>Describe (sin nombres) la peor presentación que hayas presenciado. ¿Qué falló del triángulo audiencia–objetivo–mensaje?</p>$evhb03h$, $evhb03h$Describe (sin nombres) la peor presentación que hayas presenciado. ¿Qué falló del triángulo audiencia–objetivo–mensaje?$evhb03h$, '{}'::text[],
            $evhb03h$<p>Responde a dos compañeros proponiendo cómo habrías replanteado esa presentación.</p>$evhb03h$,
            $evhb03h$<h2>Criterios de valoración</h2><p>Análisis con los conceptos de la unidad; propuestas concretas y respetuosas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb03h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Storytelling' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 2: Storytelling' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 2: Storytelling', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 2: Storytelling', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 2, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>¿Quién es el héroe en una presentación con estructura del viaje del héroe?</p>$evhb03h$, 25, $evhb03h$El orador actúa como guía que ofrece una herramienta.$evhb03h$, $evhb03h$El orador actúa como guía que ofrece una herramienta.$evhb03h$, $evhb03j${"external_id":"hb03-q2.1"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$El orador$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$La audiencia o el paciente$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$La empresa$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$El medicamento$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>¿Cuál es un buen título para un gráfico?</p>$evhb03h$, 25, $evhb03h$El título debe comunicar el hallazgo.$evhb03h$, $evhb03h$El título debe comunicar el hallazgo.$evhb03h$, $evhb03j${"external_id":"hb03-q2.2"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Errores por turno$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Gráfico 3$evhb03h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$El 60 % de los errores ocurre en el turno de la noche$evhb03h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Datos 2026$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>Para comparar categorías con etiquetas largas conviene un gráfico de:</p>$evhb03h$, 25, $evhb03h$Las barras horizontales facilitan la lectura y comparación.$evhb03h$, $evhb03h$Las barras horizontales facilitan la lectura y comparación.$evhb03h$, $evhb03j${"external_id":"hb03-q2.3"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Torta 3D$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Barras horizontales$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Radar$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Área$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>Pasar de 8 % a 6 % de eventos corresponde a una reducción absoluta de:</p>$evhb03h$, 25, $evhb03h$La reducción relativa sería 25 %; la absoluta, 2 puntos.$evhb03h$, $evhb03h$La reducción relativa sería 25 %; la absoluta, 2 puntos.$evhb03h$, $evhb03j${"external_id":"hb03-q2.4"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$25 %$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$2 puntos porcentuales$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$6 %$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$8 %$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Historia + gráfico' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Historia + gráfico', $evhb03h$<h2>Qué vas a hacer</h2><p>Escribe un caso de 60 segundos con los 5 pasos y rediseña un gráfico real (o el del caso propuesto) aplicando los 4 pasos del storytelling con datos. Graba un audio de 90 s narrando el gráfico.</p><h2>Qué entregas</h2><p>Texto del caso + gráfico antes/después + audio de 90 s.</p><h2>Cómo se evalúa</h2><ul><li>Historia con personaje, conflicto, cambio y puente al mensaje (35 %)</li><li>Gráfico con título-hallazgo, sin ruido y con color intencional (40 %)</li><li>Narración en 4 pasos (25 %)</li></ul><p>Tiempo estimado: 70 minutos.</p>$evhb03h$, $evhb03j${"version":1,"total":100,"criteria":[{"id":"historia-con-personaje-conflicto-cambio-y-puente-al-mensaje","name":"Historia con personaje, conflicto, cambio y puente al mensaje","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"grafico-con-titulo-hallazgo-sin-ruido-y-con-color-intenciona","name":"Gráfico con título-hallazgo, sin ruido y con color intencional","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"narracion-en-4-pasos","name":"Narración en 4 pasos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb03j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 2, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Antes y después de un gráfico' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Antes y después de un gráfico', 'Aplicar lo de la unidad 2 a tu trabajo y aprender de los compañeros.',
            $evhb03h$<p>Publica tu gráfico antes y después. ¿Qué elementos quitaste y qué destacaste?</p>$evhb03h$, $evhb03h$Publica tu gráfico antes y después. ¿Qué elementos quitaste y qué destacaste?$evhb03h$, '{}'::text[],
            $evhb03h$<p>Comenta dos gráficos de compañeros: ¿el título dice el hallazgo?, ¿el color dirige la atención?</p>$evhb03h$,
            $evhb03h$<h2>Criterios de valoración</h2><p>Imágenes comparativas; justificación con los 4 pasos; retroalimentación concreta.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb03h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 2);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Diseño de diapositivas' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 3: Diseño de diapositivas' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 3: Diseño de diapositivas', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 3: Diseño de diapositivas', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 3, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>Leer en voz alta el mismo texto que aparece en la diapositiva contradice el principio de:</p>$evhb03h$, 25, $evhb03h$Imagen + narración funciona mejor que imagen + narración + texto idéntico.$evhb03h$, $evhb03h$Imagen + narración funciona mejor que imagen + narración + texto idéntico.$evhb03h$, $evhb03j${"external_id":"hb03-q3.1"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Coherencia$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Redundancia$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Segmentación$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Multimedia$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>Un título-afirmación es:</p>$evhb03h$, 25, $evhb03h$Dice la conclusión de la diapositiva.$evhb03h$, $evhb03h$Dice la conclusión de la diapositiva.$evhb03h$, $evhb03j${"external_id":"hb03-q3.2"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$"Resultados"$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$"La doble verificación redujo los errores a la mitad"$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$"Tabla 2"$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$"Introducción"$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>El revelado progresivo es útil para:</p>$evhb03h$, 25, $evhb03h$Ayuda al público a seguir la explicación.$evhb03h$, $evhb03h$Ayuda al público a seguir la explicación.$evhb03h$, $evhb03j${"external_id":"hb03-q3.3"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Ocultar datos negativos$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Explicar flujogramas o gráficos complejos por partes$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Hacer la presentación más larga$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Mostrar animaciones llamativas$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>Al presentar información de un medicamento en Colombia, se debe verificar con:</p>$evhb03h$, 25, $evhb03h$Indicaciones y dosis pueden diferir entre países.$evhb03h$, $evhb03h$Indicaciones y dosis pueden diferir entre países.$evhb03h$, $evhb03j${"external_id":"hb03-q3.4"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Wikipedia$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$El inserto o información aprobada por el INVIMA$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$La página de otro país únicamente$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$La opinión del orador$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Rediseño de presentación' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Rediseño de presentación', $evhb03h$<h2>Qué vas a hacer</h2><p>Toma una presentación técnica tuya (o el caso de los anticoagulantes) y rediseña 6 diapositivas: 3 aplicando los principios de Mayer y 3 para presentar un estudio clínico (pregunta-resultado-aplicabilidad).</p><h2>Qué entregas</h2><p>Archivo con diapositivas antes/después + notas del orador.</p><h2>Cómo se evalúa</h2><ul><li>Principios de coherencia, señalización y redundancia (35 %)</li><li>Títulos-afirmación (20 %)</li><li>Presentación del estudio con rigor y fuentes (30 %)</li><li>Estética y consistencia (15 %)</li></ul><p>Tiempo estimado: 90 minutos.</p>$evhb03h$, $evhb03j${"version":1,"total":100,"criteria":[{"id":"principios-de-coherencia-senalizacion-y-redundancia","name":"Principios de coherencia, señalización y redundancia","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"titulos-afirmacion","name":"Títulos-afirmación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"presentacion-del-estudio-con-rigor-y-fuentes","name":"Presentación del estudio con rigor y fuentes","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"estetica-y-consistencia","name":"Estética y consistencia","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb03j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 3, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi diapositiva más difícil' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi diapositiva más difícil', 'Aplicar lo de la unidad 3 a tu trabajo y aprender de los compañeros.',
            $evhb03h$<p>Comparte la diapositiva que más te costó simplificar y explica qué decidiste dejar en notas o anexos.</p>$evhb03h$, $evhb03h$Comparte la diapositiva que más te costó simplificar y explica qué decidiste dejar en notas o anexos.$evhb03h$, '{}'::text[],
            $evhb03h$<p>Sugiere a dos compañeros un título-afirmación alternativo para su diapositiva.</p>$evhb03h$,
            $evhb03h$<h2>Criterios de valoración</h2><p>Diapositiva compartida con justificación; sugerencias de títulos-afirmación.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb03h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 3);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Presentaciones virtuales y pitch' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 4: Presentaciones virtuales y pitch' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 4: Presentaciones virtuales y pitch', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 4: Presentaciones virtuales y pitch', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 4, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>¿Cada cuánto conviene incluir una interacción en una presentación virtual?</p>$evhb03h$, 25, $evhb03h$La atención en línea decae rápido.$evhb03h$, $evhb03h$La atención en línea decae rápido.$evhb03h$, $evhb03j${"external_id":"hb03-q4.1"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Cada 30 minutos$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Cada 5–7 minutos$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Solo al final$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Nunca$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>¿Dónde debe estar la luz principal en una videollamada?</p>$evhb03h$, 25, $evhb03h$La luz de frente ilumina el rostro; a contraluz se ve oscuro.$evhb03h$, $evhb03h$La luz de frente ilumina el rostro; a contraluz se ve oscuro.$evhb03h$, $evhb03j${"external_id":"hb03-q4.2"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Detrás de la persona$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$De frente a la persona$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Encima$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$No importa$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>¿Cuál es el último elemento de un elevator pitch?</p>$evhb03h$, 25, $evhb03h$Un pitch termina con una petición concreta.$evhb03h$, $evhb03h$Un pitch termina con una petición concreta.$evhb03h$, $evhb03j${"external_id":"hb03-q4.3"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$El gancho$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$La historia de la empresa$evhb03h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$El llamado a la acción$evhb03h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$La bibliografía$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb03h$<p>Un error frecuente en un pitch es:</p>$evhb03h$, 25, $evhb03h$El pitch debe empezar por el interés de la audiencia.$evhb03h$, $evhb03h$El pitch debe empezar por el interés de la audiencia.$evhb03h$, $evhb03j${"external_id":"hb03-q4.4"}$evhb03j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Pedir una reunión$evhb03h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Empezar con la historia de la empresa o la hoja de vida$evhb03h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Dar una prueba$evhb03h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb03h$Usar un gancho$evhb03h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Pitch final de 3 minutos' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Pitch final de 3 minutos', $evhb03h$<h2>Qué vas a hacer</h2><p>Graba un pitch de 3 minutos (virtual, con cámara y diapositivas de apoyo de máximo 5 láminas) para una idea, servicio o producto real del sector farmacéutico, aplicando la estructura de 6 partes.</p><h2>Qué entregas</h2><p>Video de 3 min + diapositivas + guion.</p><h2>Cómo se evalúa</h2><ul><li>Estructura completa de 6 partes (30 %)</li><li>Evidencia verificable (20 %)</li><li>Diapositivas según principios de Mayer (20 %)</li><li>Presencia en cámara y voz (20 %)</li><li>Cumplimiento del tiempo (10 %)</li></ul><p>Tiempo estimado: 120 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb03h$, $evhb03j${"version":1,"total":100,"criteria":[{"id":"estructura-completa-de-6-partes","name":"Estructura completa de 6 partes","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"evidencia-verificable","name":"Evidencia verificable","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"diapositivas-segun-principios-de-mayer","name":"Diapositivas según principios de Mayer","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"presencia-en-camara-y-voz","name":"Presencia en cámara y voz","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"cumplimiento-del-tiempo","name":"Cumplimiento del tiempo","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb03j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 4, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Feria de pitches' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Feria de pitches', 'Aplicar lo de la unidad 4 a tu trabajo y aprender de los compañeros.',
            $evhb03h$<p>Publica tu pitch de 60 segundos (texto o video). ¿Qué pides al final?</p>$evhb03h$, $evhb03h$Publica tu pitch de 60 segundos (texto o video). ¿Qué pides al final?$evhb03h$, '{}'::text[],
            $evhb03h$<p>Evalúa dos pitches con la rúbrica: ¿te dieron ganas de decir que sí? ¿Qué cambiarías del gancho?</p>$evhb03h$,
            $evhb03h$<h2>Criterios de valoración</h2><p>Pitch completo; dos evaluaciones con la rúbrica y sugerencias de mejora.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb03h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 4);
  END IF;

  -- Lo que existiera en borrador (p. ej., de la antigua versión privada 076) queda publicado.
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_activities  SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_forums      SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
END
$evhb03$;

-- ════ Curso de Comunicación Asertiva en el Trabajo ════
DO $evhb04$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Comunicación Asertiva en el Trabajo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Comunicación Asertiva en el Trabajo: aplica primero la migración 075.';
    RETURN;
  END IF;

  v_estado := 'publicado';
  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, duration_minutes = 840,
         grade_policy = $evhb04j${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhb04j$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la asertividad' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 1: Fundamentos de la asertividad' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 1: Fundamentos de la asertividad', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 1: Fundamentos de la asertividad', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>&quot;Ah, qué bien que por fin llegaste&quot; dicho con sarcasmo corresponde al estilo:</p>$evhb04h$, 25, $evhb04h$Expresa el enojo de forma indirecta.$evhb04h$, $evhb04h$Expresa el enojo de forma indirecta.$evhb04h$, $evhb04j${"external_id":"hb04-q1.1"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Asertivo$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Pasivo$evhb04h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Pasivo-agresivo$evhb04h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Agresivo$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>La comunicación asertiva busca:</p>$evhb04h$, 25, $evhb04h$Equilibrio entre el respeto propio y el ajeno.$evhb04h$, $evhb04h$Equilibrio entre el respeto propio y el ajeno.$evhb04h$, $evhb04j${"external_id":"hb04-q1.2"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Ganar siempre la discusión$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Evitar todo conflicto$evhb04h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Expresar necesidades respetando las del otro$evhb04h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Decir siempre que sí$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>El derecho a decir no implica también:</p>$evhb04h$, 25, $evhb04h$Cada derecho conlleva una responsabilidad.$evhb04h$, $evhb04h$Cada derecho conlleva una responsabilidad.$evhb04h$, $evhb04j${"external_id":"hb04-q1.3"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Que el otro no puede pedir$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Respetar el derecho del otro a pedir$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$No cumplir funciones$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$No justificar nunca nada$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>Un estilo pasivo suele generar a largo plazo:</p>$evhb04h$, 25, $evhb04h$Callar las propias necesidades acumula frustración.$evhb04h$, $evhb04h$Callar las propias necesidades acumula frustración.$evhb04h$, $evhb04j${"external_id":"hb04-q1.4"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Relaciones de confianza$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Resentimiento y estrés$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Liderazgo$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Conflictos resueltos$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Mi perfil asertivo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Mi perfil asertivo', $evhb04h$<h2>Qué vas a hacer</h2><p>Completa el cuestionario de 20 ítems, clasifica tres situaciones laborales recientes según el estilo con que respondiste, identifica dos creencias limitantes y formula una meta asertiva.</p><h2>Qué entregas</h2><p>Cuestionario + análisis de 3 situaciones + meta (1–2 páginas).</p><h2>Cómo se evalúa</h2><ul><li>Clasificación correcta de estilos (35 %)</li><li>Identificación de creencias (30 %)</li><li>Meta concreta y realista (35 %)</li></ul><p>Tiempo estimado: 45 minutos.</p>$evhb04h$, $evhb04j${"version":1,"total":100,"criteria":[{"id":"clasificacion-correcta-de-estilos","name":"Clasificación correcta de estilos","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"identificacion-de-creencias","name":"Identificación de creencias","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"meta-concreta-y-realista","name":"Meta concreta y realista","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb04j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi situación más difícil' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi situación más difícil', 'Aplicar lo de la unidad 1 a tu trabajo y aprender de los compañeros.',
            $evhb04h$<p>¿Con quién o en qué situación te cuesta más ser asertivo? Cuéntalo sin nombres y comparte tu meta para el curso.</p>$evhb04h$, $evhb04h$¿Con quién o en qué situación te cuesta más ser asertivo? Cuéntalo sin nombres y comparte tu meta para el curso.$evhb04h$, '{}'::text[],
            $evhb04h$<p>Responde a dos compañeros con una creencia alternativa que les pueda ayudar.</p>$evhb04h$,
            $evhb04h$<h2>Criterios de valoración</h2><p>Situación concreta y meta; respuestas empáticas con creencias alternativas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb04h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Técnicas para expresar, pedir y decir no' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 2: Técnicas para expresar, pedir y decir no' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 2: Técnicas para expresar, pedir y decir no', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 2: Técnicas para expresar, pedir y decir no', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 2, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>En la técnica DESC, la &quot;D&quot; significa:</p>$evhb04h$, 25, $evhb04h$Se describe sin juicios ni generalizaciones.$evhb04h$, $evhb04h$Se describe sin juicios ni generalizaciones.$evhb04h$, $evhb04j${"external_id":"hb04-q2.1"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Decidir$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Describir el comportamiento concreto$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Defender$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Discutir$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>¿Cuál es una descripción y no un juicio?</p>$evhb04h$, 25, $evhb04h$Es un hecho concreto y observable.$evhb04h$, $evhb04h$Es un hecho concreto y observable.$evhb04h$, $evhb04j${"external_id":"hb04-q2.2"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Eres irresponsable$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Siempre llegas tarde$evhb04h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Esta semana no se registraron dos recepciones de termolábiles$evhb04h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$No te importa el equipo$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>Repetir con calma tu negativa ante la insistencia es la técnica:</p>$evhb04h$, 25, $evhb04h$Se repite la respuesta sin entrar en nuevas justificaciones.$evhb04h$, $evhb04h$Se repite la respuesta sin entrar en nuevas justificaciones.$evhb04h$, $evhb04j${"external_id":"hb04-q2.3"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Banco de niebla$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Disco rayado$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Aplazamiento$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Sándwich$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>Ante un jefe que agrega una tarea urgente, una respuesta asertiva es:</p>$evhb04h$, 25, $evhb04h$Convierte el no en una negociación de prioridades.$evhb04h$, $evhb04h$Convierte el no en una negociación de prioridades.$evhb04h$, $evhb04j${"external_id":"hb04-q2.4"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Aceptar en silencio$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Negarse sin explicación$evhb04h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Mostrar el costo y pedirle que elija la prioridad$evhb04h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Quejarse con los compañeros$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Juego de roles: DESC y decir no' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Juego de roles: DESC y decir no', $evhb04h$<h2>Qué vas a hacer</h2><p>En pareja (videollamada), cada persona representa dos situaciones: (1) un DESC a un compañero o médico y (2) decir no a una solicitud con insistencia (disco rayado/banco de niebla). Graba la sesión y autoevalúate.</p><h2>Qué entregas</h2><p>Guion DESC escrito + grabación del juego de roles + autoevaluación.</p><h2>Cómo se evalúa</h2><ul><li>DESC con descripción sin juicios (35 %)</li><li>Técnica de negativa bien aplicada ante insistencia (35 %)</li><li>Lenguaje no verbal coherente (15 %)</li><li>Autoevaluación reflexiva (15 %)</li></ul><p>Tiempo estimado: 60 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb04h$, $evhb04j${"version":1,"total":100,"criteria":[{"id":"desc-con-descripcion-sin-juicios","name":"DESC con descripción sin juicios","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"tecnica-de-negativa-bien-aplicada-ante-insistencia","name":"Técnica de negativa bien aplicada ante insistencia","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"lenguaje-no-verbal-coherente","name":"Lenguaje no verbal coherente","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"autoevaluacion-reflexiva","name":"Autoevaluación reflexiva","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb04j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 2, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi "no" de esta semana' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi "no" de esta semana', 'Aplicar lo de la unidad 2 a tu trabajo y aprender de los compañeros.',
            $evhb04h$<p>Cuenta una situación en la que dijiste no (o en la que quisiste hacerlo) esta semana. ¿Qué técnica usaste o usarías?</p>$evhb04h$, $evhb04h$Cuenta una situación en la que dijiste no (o en la que quisiste hacerlo) esta semana. ¿Qué técnica usaste o usarías?$evhb04h$, '{}'::text[],
            $evhb04h$<p>Responde a dos compañeros proponiendo la frase exacta que podrían usar.</p>$evhb04h$,
            $evhb04h$<h2>Criterios de valoración</h2><p>Situación real; técnica identificada; frases propuestas concretas y respetuosas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb04h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 2);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Escuchar y conectar' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 3: Escuchar y conectar' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 3: Escuchar y conectar', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 3: Escuchar y conectar', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 3, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>Parafrasear consiste en:</p>$evhb04h$, 25, $evhb04h$Muestra comprensión y permite corregir malentendidos.$evhb04h$, $evhb04h$Muestra comprensión y permite corregir malentendidos.$evhb04h$, $evhb04j${"external_id":"hb04-q3.1"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Dar un consejo$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Repetir con tus palabras lo que entendiste$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Cambiar de tema$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Hacer una pregunta cerrada$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>&quot;Me siento ignorado&quot; en CNV se considera:</p>$evhb04h$, 25, $evhb04h$Implica una interpretación de la conducta del otro.$evhb04h$, $evhb04h$Implica una interpretación de la conducta del otro.$evhb04h$, $evhb04j${"external_id":"hb04-q3.2"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Un sentimiento real$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Un falso sentimiento que incluye un juicio sobre el otro$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Una necesidad$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Una petición$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>¿Qué diferencia una petición de una exigencia en CNV?</p>$evhb04h$, 25, $evhb04h$Si no se acepta el no, es una exigencia.$evhb04h$, $evhb04h$Si no se acepta el no, es una exigencia.$evhb04h$, $evhb04j${"external_id":"hb04-q3.3"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$El tono de voz$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$La petición acepta un no y busca alternativas$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$La exigencia es más amable$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$No hay diferencia$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>¿Cuál es una barrera para la escucha activa?</p>$evhb04h$, 25, $evhb04h$Responder antes de entender bloquea la conversación.$evhb04h$, $evhb04h$Responder antes de entender bloquea la conversación.$evhb04h$, $evhb04j${"external_id":"hb04-q3.4"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$El silencio$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Aconsejar demasiado pronto$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Resumir$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Reflejar emociones$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Práctica de escucha y CNV' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Práctica de escucha y CNV', $evhb04h$<h2>Qué vas a hacer</h2><p>En tríos (orador, oyente, observador) realicen 3 rondas de 5 minutos: el orador cuenta una situación laboral difícil; el oyente aplica parafraseo, reflejo, preguntas abiertas y resumen; el observador registra. Luego cada uno transforma 3 frases reactivas en CNV.</p><h2>Qué entregas</h2><p>Registro del observador + 3 frases CNV transformadas + reflexión individual.</p><h2>Cómo se evalúa</h2><ul><li>Uso de técnicas de escucha registrado (40 %)</li><li>Frases CNV con los 4 componentes (40 %)</li><li>Reflexión (20 %)</li></ul><p>Tiempo estimado: 60 minutos.</p>$evhb04h$, $evhb04j${"version":1,"total":100,"criteria":[{"id":"uso-de-tecnicas-de-escucha-registrado","name":"Uso de técnicas de escucha registrado","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"frases-cnv-con-los-4-componentes","name":"Frases CNV con los 4 componentes","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"reflexion","name":"Reflexión","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb04j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 3, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Una frase que cambiaría' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Una frase que cambiaría', 'Aplicar lo de la unidad 3 a tu trabajo y aprender de los compañeros.',
            $evhb04h$<p>Comparte una frase reactiva que hayas escuchado en tu trabajo y su versión CNV.</p>$evhb04h$, $evhb04h$Comparte una frase reactiva que hayas escuchado en tu trabajo y su versión CNV.$evhb04h$, '{}'::text[],
            $evhb04h$<p>Revisa la versión de dos compañeros: ¿la observación está libre de evaluación? ¿La petición es concreta?</p>$evhb04h$,
            $evhb04h$<h2>Criterios de valoración</h2><p>Transformación con los 4 pasos; retroalimentación con criterios de la clase.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb04h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 3);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Retroalimentación y conflictos' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 4: Retroalimentación y conflictos' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 4: Retroalimentación y conflictos', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 4: Retroalimentación y conflictos', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 4, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>En el modelo SBI, la &quot;I&quot; corresponde a:</p>$evhb04h$, 25, $evhb04h$Situación, comportamiento (behavior) e impacto.$evhb04h$, $evhb04h$Situación, comportamiento (behavior) e impacto.$evhb04h$, $evhb04j${"external_id":"hb04-q4.1"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Intención$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Impacto$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Idea$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Instrucción$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>El estilo de conflicto más adecuado ante un riesgo inmediato para la seguridad del paciente suele ser:</p>$evhb04h$, 25, $evhb04h$En emergencias o seguridad se requiere firmeza.$evhb04h$, $evhb04h$En emergencias o seguridad se requiere firmeza.$evhb04h$, $evhb04j${"external_id":"hb04-q4.2"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Evitar$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Acomodarse$evhb04h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Competir (actuar con firmeza)$evhb04h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Transigir$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>El estilo colaborar se caracteriza por:</p>$evhb04h$, 25, $evhb04h$Busca soluciones que satisfagan a ambas partes.$evhb04h$, $evhb04h$Busca soluciones que satisfagan a ambas partes.$evhb04h$, $evhb04j${"external_id":"hb04-q4.3"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Baja asertividad y baja cooperación$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Alta asertividad y alta cooperación$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Ceder siempre$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Imponer siempre$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb04h$<p>Al recibir una crítica, el primer paso recomendado es:</p>$evhb04h$, 25, $evhb04h$Escuchar completo antes de responder evita la reacción defensiva.$evhb04h$, $evhb04h$Escuchar completo antes de responder evita la reacción defensiva.$evhb04h$, $evhb04j${"external_id":"hb04-q4.4"}$evhb04j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Justificarse$evhb04h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Escuchar hasta el final sin interrumpir$evhb04h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Contraatacar$evhb04h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb04h$Cambiar de tema$evhb04h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Conversación difícil preparada' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Conversación difícil preparada', $evhb04h$<h2>Qué vas a hacer</h2><p>Elige un conflicto real (o el caso farmacia–enfermería). Prepara la conversación con la plantilla de 6 pasos, incluye un mensaje SBI y uno CNV, y represéntala en juego de roles grabado (8–10 min).</p><h2>Qué entregas</h2><p>Plantilla de 6 pasos + guion + video del juego de roles.</p><h2>Cómo se evalúa</h2><ul><li>Preparación completa con intereses de ambas partes (25 %)</li><li>Uso de escucha activa (25 %)</li><li>SBI/CNV bien aplicados (25 %)</li><li>Acuerdo concreto con seguimiento (25 %)</li></ul><p>Tiempo estimado: 90 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb04h$, $evhb04j${"version":1,"total":100,"criteria":[{"id":"preparacion-completa-con-intereses-de-ambas-partes","name":"Preparación completa con intereses de ambas partes","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"uso-de-escucha-activa","name":"Uso de escucha activa","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"sbi-cnv-bien-aplicados","name":"SBI/CNV bien aplicados","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"acuerdo-concreto-con-seguimiento","name":"Acuerdo concreto con seguimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb04j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 4, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Un conflicto bien resuelto' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Un conflicto bien resuelto', 'Aplicar lo de la unidad 4 a tu trabajo y aprender de los compañeros.',
            $evhb04h$<p>Comparte (sin nombres) un conflicto laboral que se resolvió bien o mal. ¿Qué estilo se usó? ¿Qué paso del método habría cambiado el resultado?</p>$evhb04h$, $evhb04h$Comparte (sin nombres) un conflicto laboral que se resolvió bien o mal. ¿Qué estilo se usó? ¿Qué paso del método habría cambiado el resultado?$evhb04h$, '{}'::text[],
            $evhb04h$<p>Responde a dos compañeros identificando el estilo usado y proponiendo una opción colaborativa.</p>$evhb04h$,
            $evhb04h$<h2>Criterios de valoración</h2><p>Análisis con estilos de Thomas-Kilmann; propuestas colaborativas concretas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb04h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 4);
  END IF;

  -- Lo que existiera en borrador (p. ej., de la antigua versión privada 076) queda publicado.
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_activities  SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_forums      SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
END
$evhb04$;

-- ════ Curso de Lenguaje Corporal y Comunicación No Verbal ════
DO $evhb05$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Lenguaje Corporal y Comunicación No Verbal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Lenguaje Corporal y Comunicación No Verbal: aplica primero la migración 075.';
    RETURN;
  END IF;

  v_estado := 'publicado';
  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, duration_minutes = 720,
         grade_policy = $evhb05j${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhb05j$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y mitos' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 1: Fundamentos y mitos' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 1: Fundamentos y mitos', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 1: Fundamentos y mitos', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Los estudios de Mehrabian de 1967 evaluaron:</p>$evhb05h$, 25, $evhb05h$Sus proporciones no se aplican a la comunicación en general.$evhb05h$, $evhb05h$Sus proporciones no se aplican a la comunicación en general.$evhb05h$, $evhb05j${"external_id":"hb05-q1.1"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Toda la comunicación humana$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$La interpretación de sentimientos con palabras sueltas cuando los canales se contradicen$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Conferencias académicas$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Ventas$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>El uso del espacio y la distancia interpersonal se estudia en la:</p>$evhb05h$, 25, $evhb05h$Término propuesto por Edward T. Hall.$evhb05h$, $evhb05h$Término propuesto por Edward T. Hall.$evhb05h$, $evhb05j${"external_id":"hb05-q1.2"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Kinésica$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Proxémica$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Háptica$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Cronémica$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Según la investigación, detectar mentiras por el lenguaje corporal es:</p>$evhb05h$, 25, $evhb05h$Metaanálisis como el de Bond y DePaulo (2006).$evhb05h$, $evhb05h$Metaanálisis como el de Bond y DePaulo (2006).$evhb05h$, $evhb05j${"external_id":"hb05-q1.3"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Muy preciso$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Solo un poco mejor que el azar$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Imposible de estudiar$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Exacto si se toca la nariz$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>La forma rigurosa de interpretar una señal no verbal es:</p>$evhb05h$, 25, $evhb05h$Las señales dan pistas, no certezas.$evhb05h$, $evhb05h$Las señales dan pistas, no certezas.$evhb05h$, $evhb05j${"external_id":"hb05-q1.4"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Concluir de inmediato$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Tratarla como hipótesis, considerar contexto y verificar preguntando$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Ignorarla$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Usar una tabla de significados universales$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Cazador de mitos' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Cazador de mitos', $evhb05h$<h2>Qué vas a hacer</h2><p>Busca 3 afirmaciones sobre lenguaje corporal en videos o artículos populares. Para cada una: cita la fuente, clasifícala (mito, parcialmente cierta, respaldada), argumenta con lo visto en clase y reescríbela de forma rigurosa.</p><h2>Qué entregas</h2><p>Tabla de análisis de 3 afirmaciones.</p><h2>Cómo se evalúa</h2><ul><li>Selección y cita de fuentes (20 %)</li><li>Análisis basado en evidencia (50 %)</li><li>Reescritura rigurosa (30 %)</li></ul><p>Tiempo estimado: 45 minutos.</p>$evhb05h$, $evhb05j${"version":1,"total":100,"criteria":[{"id":"seleccion-y-cita-de-fuentes","name":"Selección y cita de fuentes","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"analisis-basado-en-evidencia","name":"Análisis basado en evidencia","weight":50,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"reescritura-rigurosa","name":"Reescritura rigurosa","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb05j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'El mito que más he escuchado' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'El mito que más he escuchado', 'Aplicar lo de la unidad 1 a tu trabajo y aprender de los compañeros.',
            $evhb05h$<p>¿Cuál mito del lenguaje corporal has escuchado o creído? ¿Cómo lo explicarías ahora a un colega?</p>$evhb05h$, $evhb05h$¿Cuál mito del lenguaje corporal has escuchado o creído? ¿Cómo lo explicarías ahora a un colega?$evhb05h$, '{}'::text[],
            $evhb05h$<p>Responde a dos compañeros complementando con un ejemplo de su contexto laboral.</p>$evhb05h$,
            $evhb05h$<h2>Criterios de valoración</h2><p>Explicación correcta del mito; ejemplos aplicados; tono respetuoso.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb05h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Tu cuerpo comunica' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 2: Tu cuerpo comunica' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 2: Tu cuerpo comunica', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 2: Tu cuerpo comunica', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 2, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Tocarse el pelo o jugar con el bolígrafo son gestos:</p>$evhb05h$, 25, $evhb05h$Ayudan a manejar la tensión, pero distraen.$evhb05h$, $evhb05h$Ayudan a manejar la tensión, pero distraen.$evhb05h$, $evhb05j${"external_id":"hb05-q2.1"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Ilustradores$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Emblemas$evhb05h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Adaptadores$evhb05h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Reguladores$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Los gestos que acompañan y aclaran lo que se dice se llaman:</p>$evhb05h$, 25, $evhb05h$Mejoran la comprensión.$evhb05h$, $evhb05h$Mejoran la comprensión.$evhb05h$, $evhb05j${"external_id":"hb05-q2.2"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Adaptadores$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Ilustradores$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Emblemas$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Háptica$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Ante una expresión facial de preocupación de un paciente, lo más adecuado es:</p>$evhb05h$, 25, $evhb05h$La expresión es una pista que se verifica preguntando.$evhb05h$, $evhb05h$La expresión es una pista que se verifica preguntando.$evhb05h$, $evhb05j${"external_id":"hb05-q2.3"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Concluir que no entendió$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Ignorarla$evhb05h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Preguntar qué le preocupa$evhb05h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Hablar más rápido$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Respecto al contacto visual, es recomendable:</p>$evhb05h$, 25, $evhb05h$El contacto visual equilibrado genera confianza sin intimidar.$evhb05h$, $evhb05h$El contacto visual equilibrado genera confianza sin intimidar.$evhb05h$, $evhb05j${"external_id":"hb05-q2.4"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Mirar fijamente sin pausas$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Evitarlo siempre$evhb05h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Mantenerlo con pausas naturales y respetar la comodidad de la persona$evhb05h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Mirar solo al jefe en las reuniones$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Videoanálisis de presencia' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Videoanálisis de presencia', $evhb05h$<h2>Qué vas a hacer</h2><p>Graba 3 minutos explicando un procedimiento a una persona (presencial o en videollamada). Analiza: postura, gestos ilustradores vs. adaptadores, contacto visual al hablar y al escuchar, y coherencia de la expresión facial.</p><h2>Qué entregas</h2><p>Video + ficha de análisis con 3 fortalezas y 3 ajustes.</p><h2>Cómo se evalúa</h2><ul><li>Análisis preciso de postura y gestos (35 %)</li><li>Análisis de mirada y expresión (35 %)</li><li>Plan de ajustes concreto (30 %)</li></ul><p>Tiempo estimado: 60 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb05h$, $evhb05j${"version":1,"total":100,"criteria":[{"id":"analisis-preciso-de-postura-y-gestos","name":"Análisis preciso de postura y gestos","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"analisis-de-mirada-y-expresion","name":"Análisis de mirada y expresión","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"plan-de-ajustes-concreto","name":"Plan de ajustes concreto","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb05j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 2, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Lo que descubrí en mi video' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Lo que descubrí en mi video', 'Aplicar lo de la unidad 2 a tu trabajo y aprender de los compañeros.',
            $evhb05h$<p>¿Qué gesto adaptador descubriste en tu video? ¿Qué te sorprendió de tu mirada o tu postura?</p>$evhb05h$, $evhb05h$¿Qué gesto adaptador descubriste en tu video? ¿Qué te sorprendió de tu mirada o tu postura?$evhb05h$, '{}'::text[],
            $evhb05h$<p>Comenta a dos compañeros una estrategia práctica para reducir el gesto que identificaron.</p>$evhb05h$,
            $evhb05h$<h2>Criterios de valoración</h2><p>Hallazgo concreto; estrategias prácticas para los compañeros.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb05h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 2);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Voz y espacio' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 3: Voz y espacio' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 3: Voz y espacio', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 3: Voz y espacio', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 3, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Terminar una afirmación con tono ascendente puede transmitir:</p>$evhb05h$, 25, $evhb05h$Las afirmaciones seguras suelen terminar con tono descendente.$evhb05h$, $evhb05h$Las afirmaciones seguras suelen terminar con tono descendente.$evhb05h$, $evhb05j${"external_id":"hb05-q3.1"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Seguridad$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Inseguridad o que es una pregunta$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Enojo$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Alegría$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Según Hall, la zona social va aproximadamente de:</p>$evhb05h$, 25, $evhb05h$Es la distancia típica de interacciones de trabajo.$evhb05h$, $evhb05h$Es la distancia típica de interacciones de trabajo.$evhb05h$, $evhb05j${"external_id":"hb05-q3.2"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$0 a 45 cm$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$45 cm a 1,2 m$evhb05h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$1,2 a 3,6 m$evhb05h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Más de 10 m$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Para aplicar un inyectable (zona íntima) es recomendable:</p>$evhb05h$, 25, $evhb05h$Respeta la intimidad y la comodidad del paciente.$evhb05h$, $evhb05h$Respeta la intimidad y la comodidad del paciente.$evhb05h$, $evhb05j${"external_id":"hb05-q3.3"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Acercarse sin avisar$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Anunciar lo que se va a hacer y pedir permiso$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Hacerlo frente a la fila$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Hablar en voz alta del diagnóstico$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Sentarse en ángulo de 90° con el paciente, en lugar de frente a frente:</p>$evhb05h$, 25, $evhb05h$Reduce la sensación de barrera y confrontación.$evhb05h$, $evhb05h$Reduce la sensación de barrera y confrontación.$evhb05h$, $evhb05j${"external_id":"hb05-q3.4"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Genera confrontación$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Facilita la colaboración$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Es irrespetuoso$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$No tiene efecto$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Voz y espacio en mi lugar de trabajo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Voz y espacio en mi lugar de trabajo', $evhb05h$<h2>Qué vas a hacer</h2><p>(1) Graba la frase &quot;El medicamento está agotado&quot; con 5 intenciones y elige la mejor versión con solución. (2) Haz el diagnóstico proxémico de tu espacio de atención con el checklist y propone 3 mejoras de bajo costo.</p><h2>Qué entregas</h2><p>Audio con 5 versiones + diagnóstico del espacio con fotos (si es posible) + 3 propuestas.</p><h2>Cómo se evalúa</h2><ul><li>Variaciones de paralenguaje claras (35 %)</li><li>Diagnóstico proxémico con criterios de confidencialidad (35 %)</li><li>Propuestas viables (30 %)</li></ul><p>Tiempo estimado: 60 minutos.</p>$evhb05h$, $evhb05j${"version":1,"total":100,"criteria":[{"id":"variaciones-de-paralenguaje-claras","name":"Variaciones de paralenguaje claras","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"diagnostico-proxemico-con-criterios-de-confidencialidad","name":"Diagnóstico proxémico con criterios de confidencialidad","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"propuestas-viables","name":"Propuestas viables","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb05j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 3, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi espacio de atención' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi espacio de atención', 'Aplicar lo de la unidad 3 a tu trabajo y aprender de los compañeros.',
            $evhb05h$<p>Describe el espacio donde atiendes pacientes o clientes. ¿Qué favorece y qué dificulta la comunicación y la confidencialidad?</p>$evhb05h$, $evhb05h$Describe el espacio donde atiendes pacientes o clientes. ¿Qué favorece y qué dificulta la comunicación y la confidencialidad?$evhb05h$, '{}'::text[],
            $evhb05h$<p>Propón a dos compañeros una mejora de bajo costo para su espacio.</p>$evhb05h$,
            $evhb05h$<h2>Criterios de valoración</h2><p>Descripción con conceptos de proxémica; propuestas viables.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb05h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 3);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Leer a otros y comunicar en cámara' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 4: Leer a otros y comunicar en cámara' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 4: Leer a otros y comunicar en cámara', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 4: Leer a otros y comunicar en cámara', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 4, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>La &quot;línea base&quot; en la lectura del lenguaje corporal es:</p>$evhb05h$, 25, $evhb05h$Lo informativo es el cambio respecto a la línea base.$evhb05h$, $evhb05h$Lo informativo es el cambio respecto a la línea base.$evhb05h$, $evhb05j${"external_id":"hb05-q4.1"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$El gesto más frecuente de todas las personas$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$El comportamiento habitual de una persona cuando está tranquila$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$La distancia social$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$El encuadre de la cámara$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>¿Qué es más confiable para interpretar el lenguaje corporal?</p>$evhb05h$, 25, $evhb05h$Varias señales en la misma dirección y en contexto.$evhb05h$, $evhb05h$Varias señales en la misma dirección y en contexto.$evhb05h$, $evhb05j${"external_id":"hb05-q4.2"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Un gesto aislado$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Un conjunto de señales coherentes en contexto$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$La regla 7-38-55$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$La intuición sin verificar$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>En una videollamada, para dar sensación de contacto visual en los momentos clave se debe mirar:</p>$evhb05h$, 25, $evhb05h$Mirar al lente simula el contacto visual.$evhb05h$, $evhb05h$Mirar al lente simula el contacto visual.$evhb05h$, $evhb05j${"external_id":"hb05-q4.3"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$La propia imagen$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Los ojos del interlocutor en la pantalla$evhb05h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$El lente de la cámara$evhb05h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$El teclado$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb05h$<p>Una cámara ubicada por debajo de los ojos:</p>$evhb05h$, 25, $evhb05h$Se recomienda la cámara a la altura de los ojos.$evhb05h$, $evhb05h$Se recomienda la cámara a la altura de los ojos.$evhb05h$, $evhb05j${"external_id":"hb05-q4.4"}$evhb05j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Es el ángulo ideal$evhb05h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Muestra a la persona desde abajo con un ángulo poco favorecedor$evhb05h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$No tiene efecto$evhb05h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb05h$Mejora el sonido$evhb05h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Simulación de entrevista o visita virtual' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Simulación de entrevista o visita virtual', $evhb05h$<h2>Qué vas a hacer</h2><p>Graba una simulación de 6–8 minutos (entrevista de trabajo o visita médica virtual) aplicando encuadre, luz, mirada a cámara y gestos. Incluye al menos un momento en que verifiques con una pregunta una señal no verbal del interlocutor.</p><h2>Qué entregas</h2><p>Video + checklist de entrevista + autoevaluación.</p><h2>Cómo se evalúa</h2><ul><li>Encuadre, luz y sonido (20 %)</li><li>Mirada a cámara y postura (30 %)</li><li>Gestos dentro del encuadre (20 %)</li><li>Verificación de una señal con pregunta abierta (30 %)</li></ul><p>Tiempo estimado: 90 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb05h$, $evhb05j${"version":1,"total":100,"criteria":[{"id":"encuadre-luz-y-sonido","name":"Encuadre, luz y sonido","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"mirada-a-camara-y-postura","name":"Mirada a cámara y postura","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"gestos-dentro-del-encuadre","name":"Gestos dentro del encuadre","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"verificacion-de-una-senal-con-pregunta-abierta","name":"Verificación de una señal con pregunta abierta","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb05j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 4, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi setup de videollamada' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi setup de videollamada', 'Aplicar lo de la unidad 4 a tu trabajo y aprender de los compañeros.',
            $evhb05h$<p>Comparte una foto de tu encuadre antes y después de aplicar las recomendaciones (o descríbelo). ¿Qué cambió en cómo te sentiste?</p>$evhb05h$, $evhb05h$Comparte una foto de tu encuadre antes y después de aplicar las recomendaciones (o descríbelo). ¿Qué cambió en cómo te sentiste?$evhb05h$, '{}'::text[],
            $evhb05h$<p>Da a dos compañeros una recomendación concreta de encuadre, luz o mirada.</p>$evhb05h$,
            $evhb05h$<h2>Criterios de valoración</h2><p>Evidencia del cambio; recomendaciones específicas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb05h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 4);
  END IF;

  -- Lo que existiera en borrador (p. ej., de la antigua versión privada 076) queda publicado.
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_activities  SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_forums      SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
END
$evhb05$;

-- ════ Curso de Negociación y Persuasión ════
DO $evhb06$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Negociación y Persuasión' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Negociación y Persuasión: aplica primero la migración 075.';
    RETURN;
  END IF;

  v_estado := 'publicado';
  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, duration_minutes = 960,
         grade_policy = $evhb06j${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhb06j$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y preparación' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 1: Fundamentos y preparación' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 1: Fundamentos y preparación', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 1: Fundamentos y preparación', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>El MAAN (BATNA) es:</p>$evhb06h$, 25, $evhb06h$Mejor Alternativa a un Acuerdo Negociado.$evhb06h$, $evhb06h$Mejor Alternativa a un Acuerdo Negociado.$evhb06h$, $evhb06j${"external_id":"hb06-q1.1"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$El precio más alto posible$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Lo que harás si no hay acuerdo$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$La primera oferta$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$El objetivo ideal$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>La diferencia entre posición e interés es:</p>$evhb06h$, 25, $evhb06h$Explorar intereses permite crear valor (caso de la naranja).$evhb06h$, $evhb06h$Explorar intereses permite crear valor (caso de la naranja).$evhb06h$, $evhb06j${"external_id":"hb06-q1.2"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$No hay diferencia$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$La posición es lo que digo que quiero; el interés, por qué lo quiero$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$El interés es el precio$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$La posición es secreta$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>Si el vendedor no acepta menos de $1.100 y el comprador no paga más de $1.050:</p>$evhb06h$, 25, $evhb06h$Los rangos no se superponen.$evhb06h$, $evhb06h$Los rangos no se superponen.$evhb06h$, $evhb06j${"external_id":"hb06-q1.3"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Hay ZOPA de $50$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$No hay ZOPA en precio; hay que añadir variables o retirarse$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$El comprador debe ceder$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$El acuerdo es automático$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>La negociación integrativa se caracteriza por:</p>$evhb06h$, 25, $evhb06h$Permite que ambas partes obtengan más.$evhb06h$, $evhb06h$Permite que ambas partes obtengan más.$evhb06h$, $evhb06j${"external_id":"hb06-q1.4"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Negociar un solo recurso fijo$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Negociar varios temas e intercambiar para crear valor$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Ocultar toda la información$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Ganar a toda costa$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Plan de negociación' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Plan de negociación', $evhb06h$<h2>Qué vas a hacer</h2><p>Con la plantilla, prepara una negociación real o el caso propuesto (droguería–distribuidor): MAAN propia y de la otra parte, precio de reserva, objetivo, ZOPA estimada, intereses priorizados, variables e intercambios, y criterios objetivos.</p><h2>Qué entregas</h2><p>Plantilla de preparación (1–2 páginas).</p><h2>Cómo se evalúa</h2><ul><li>MAAN y precio de reserva coherentes (30 %)</li><li>Análisis de intereses de ambas partes (30 %)</li><li>Variables e intercambios creativos (25 %)</li><li>Criterios objetivos (15 %)</li></ul><p>Tiempo estimado: 60 minutos.</p>$evhb06h$, $evhb06j${"version":1,"total":100,"criteria":[{"id":"maan-y-precio-de-reserva-coherentes","name":"MAAN y precio de reserva coherentes","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"analisis-de-intereses-de-ambas-partes","name":"Análisis de intereses de ambas partes","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"variables-e-intercambios-creativos","name":"Variables e intercambios creativos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"criterios-objetivos","name":"Criterios objetivos","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb06j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi MAAN' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi MAAN', 'Aplicar lo de la unidad 1 a tu trabajo y aprender de los compañeros.',
            $evhb06h$<p>Describe una negociación próxima y tu MAAN. ¿Cómo podrías mejorarla antes de negociar?</p>$evhb06h$, $evhb06h$Describe una negociación próxima y tu MAAN. ¿Cómo podrías mejorarla antes de negociar?$evhb06h$, '{}'::text[],
            $evhb06h$<p>Ayuda a dos compañeros a identificar una variable adicional que podrían negociar además del precio.</p>$evhb06h$,
            $evhb06h$<h2>Criterios de valoración</h2><p>MAAN clara y acciones para mejorarla; variables adicionales sugeridas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb06h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Método y técnicas de negociación' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 2: Método y técnicas de negociación' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 2: Método y técnicas de negociación', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 2: Método y técnicas de negociación', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 2, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>&quot;Sé suave con las personas y firme con el problema&quot; corresponde al principio de:</p>$evhb06h$, 25, $evhb06h$Primer principio del método Harvard.$evhb06h$, $evhb06h$Primer principio del método Harvard.$evhb06h$, $evhb06j${"external_id":"hb06-q2.1"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Criterios objetivos$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Separar a las personas del problema$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Generar opciones$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$MAAN$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>Una pregunta calibrada típicamente empieza por:</p>$evhb06h$, 25, $evhb06h$Invitan a resolver juntos sin sonar acusatorias.$evhb06h$, $evhb06h$Invitan a resolver juntos sin sonar acusatorias.$evhb06h$, $evhb06j${"external_id":"hb06-q2.2"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Por qué…?$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Cómo…? o ¿Qué…?$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Usted no cree que…?$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Sí o no…?$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>El &quot;espejo&quot; en la técnica de Voss consiste en:</p>$evhb06h$, 25, $evhb06h$Invita al otro a ampliar la información.$evhb06h$, $evhb06h$Invita al otro a ampliar la información.$evhb06h$, $evhb06j${"external_id":"hb06-q2.3"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Imitar los gestos del otro$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Repetir las últimas palabras clave con tono de interés$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Mostrar el producto$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Mirar fijamente$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>Un ejemplo de criterio objetivo es:</p>$evhb06h$, 25, $evhb06h$Es un estándar independiente aceptable para ambas partes.$evhb06h$, $evhb06h$Es un estándar independiente aceptable para ambas partes.$evhb06h$, $evhb06j${"external_id":"hb06-q2.4"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$"Porque yo lo digo"$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Precios de referencia del mercado$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$La primera oferta$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$La opinión del vendedor$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Simulación de negociación en parejas' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Simulación de negociación en parejas', $evhb06h$<h2>Qué vas a hacer</h2><p>Con el caso proporcionado (hospital–laboratorio, hojas confidenciales para cada rol), realicen una negociación de 20 minutos por videollamada aplicando los 4 principios de Harvard, al menos 2 espejos, 2 etiquetas y 3 preguntas calibradas. Graben y luego comparen resultados.</p><h2>Qué entregas</h2><p>Acuerdo escrito + grabación + reflexión individual (qué técnicas funcionaron).</p><h2>Cómo se evalúa</h2><ul><li>Exploración de intereses (30 %)</li><li>Uso de técnicas de escucha táctica (30 %)</li><li>Acuerdo que crea valor y usa criterios objetivos (25 %)</li><li>Reflexión (15 %)</li></ul><p>Tiempo estimado: 90 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb06h$, $evhb06j${"version":1,"total":100,"criteria":[{"id":"exploracion-de-intereses","name":"Exploración de intereses","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"uso-de-tecnicas-de-escucha-tactica","name":"Uso de técnicas de escucha táctica","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"acuerdo-que-crea-valor-y-usa-criterios-objetivos","name":"Acuerdo que crea valor y usa criterios objetivos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"reflexion","name":"Reflexión","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb06j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 2, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Lo que aprendí negociando' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Lo que aprendí negociando', 'Aplicar lo de la unidad 2 a tu trabajo y aprender de los compañeros.',
            $evhb06h$<p>Después de la simulación, ¿qué interés de la otra parte descubriste que no esperabas? ¿Qué técnica te funcionó mejor?</p>$evhb06h$, $evhb06h$Después de la simulación, ¿qué interés de la otra parte descubriste que no esperabas? ¿Qué técnica te funcionó mejor?$evhb06h$, '{}'::text[],
            $evhb06h$<p>Compara tu acuerdo con el de dos compañeros: ¿quién creó más valor y por qué?</p>$evhb06h$,
            $evhb06h$<h2>Criterios de valoración</h2><p>Reflexión con conceptos de la unidad; comparación argumentada.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb06h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 2);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Persuasión ética' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 3: Persuasión ética' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 3: Persuasión ética', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 3: Persuasión ética', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 3, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>El séptimo principio que Cialdini agregó en Pre-suasión es:</p>$evhb06h$, 25, $evhb06h$Influye más quien consideramos "de los nuestros".$evhb06h$, $evhb06h$Influye más quien consideramos "de los nuestros".$evhb06h$, $evhb06j${"external_id":"hb06-q3.1"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Escasez$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Unidad$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Autoridad$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Reciprocidad$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>Decir &quot;solo quedan 2 cupos&quot; cuando no es cierto es un uso manipulador de:</p>$evhb06h$, 25, $evhb06h$La escasez falsa es manipulación.$evhb06h$, $evhb06h$La escasez falsa es manipulación.$evhb06h$, $evhb06j${"external_id":"hb06-q3.2"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Prueba social$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Escasez$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Simpatía$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Compromiso$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>En Colombia, la promoción de un medicamento debe ajustarse a:</p>$evhb06h$, 25, $evhb06h$Los usos no aprobados no se promueven.$evhb06h$, $evhb06h$Los usos no aprobados no se promueven.$evhb06h$, $evhb06j${"external_id":"hb06-q3.3"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Lo que diga el visitador$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Las indicaciones y condiciones aprobadas en el registro sanitario$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Lo aprobado en cualquier país$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$La opinión del médico$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>¿Cuál de estas preguntas ayuda a distinguir persuasión de manipulación?</p>$evhb06h$, 25, $evhb06h$Si no podrías decirlo abiertamente, probablemente es manipulación.$evhb06h$, $evhb06h$Si no podrías decirlo abiertamente, probablemente es manipulación.$evhb06h$, $evhb06j${"external_id":"hb06-q3.4"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Vendí más?$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Lo diría abiertamente a la otra persona?$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Fue rápido?$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Usé un gráfico?$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Argumentario ético' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Argumentario ético', $evhb06h$<h2>Qué vas a hacer</h2><p>Elabora un argumentario de 1 página para un producto o servicio real (o el caso propuesto) que use al menos 3 principios de Cialdini de forma ética, presente beneficios y riesgos con cifras absolutas y relativas, y pase el checklist de comunicación ética.</p><h2>Qué entregas</h2><p>Argumentario + checklist diligenciado + identificación de los principios usados.</p><h2>Cómo se evalúa</h2><ul><li>Uso ético y explícito de 3 principios (30 %)</li><li>Equilibrio beneficio-riesgo con precisión numérica (35 %)</li><li>Ajuste a indicaciones aprobadas y normativa (20 %)</li><li>Claridad (15 %)</li></ul><p>Tiempo estimado: 60 minutos.</p>$evhb06h$, $evhb06j${"version":1,"total":100,"criteria":[{"id":"uso-etico-y-explicito-de-3-principios","name":"Uso ético y explícito de 3 principios","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"equilibrio-beneficio-riesgo-con-precision-numerica","name":"Equilibrio beneficio-riesgo con precisión numérica","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"ajuste-a-indicaciones-aprobadas-y-normativa","name":"Ajuste a indicaciones aprobadas y normativa","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"claridad","name":"Claridad","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb06j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 3, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Dilema ético' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Dilema ético', 'Aplicar lo de la unidad 3 a tu trabajo y aprender de los compañeros.',
            $evhb06h$<p>Analiza el dilema propuesto (un cliente pide un antibiótico sin fórmula &quot;porque siempre se lo venden&quot;) o uno de tu experiencia. ¿Qué principios de persuasión usarías de forma ética para manejarlo?</p>$evhb06h$, $evhb06h$Analiza el dilema propuesto (un cliente pide un antibiótico sin fórmula "porque siempre se lo venden") o uno de tu experiencia. ¿Qué principios de persuasión usarías de forma ética para manejarlo?$evhb06h$, '{}'::text[],
            $evhb06h$<p>Responde a dos compañeros evaluando su propuesta con las tres preguntas éticas.</p>$evhb06h$,
            $evhb06h$<h2>Criterios de valoración</h2><p>Propuesta ética y viable; evaluación con las tres preguntas; respeto en la discusión.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb06h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 3);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Objeciones y cierre' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 4: Objeciones y cierre' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 4: Objeciones y cierre', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 4: Objeciones y cierre', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 4, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>En el método ERER, el tercer paso es:</p>$evhb06h$, 25, $evhb06h$Escuchar, reconocer, explorar, responder.$evhb06h$, $evhb06h$Escuchar, reconocer, explorar, responder.$evhb06h$, $evhb06j${"external_id":"hb06-q4.1"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Responder$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Explorar la objeción real con preguntas$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Rendirse$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Repetir el precio$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>Ante &quot;es muy caro&quot;, una buena pregunta de exploración es:</p>$evhb06h$, 25, $evhb06h$Permite entender el punto de referencia del otro.$evhb06h$, $evhb06h$Permite entender el punto de referencia del otro.$evhb06h$, $evhb06j${"external_id":"hb06-q4.2"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Por qué es tan tacaño?$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Comparado con qué alternativa?$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Va a comprar o no?$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$¿Quién le dijo eso?$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>Una regla de las concesiones es:</p>$evhb06h$, 25, $evhb06h$Toda concesión debe ser un intercambio.$evhb06h$, $evhb06h$Toda concesión debe ser un intercambio.$evhb06h$, $evhb06j${"external_id":"hb06-q4.3"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Conceder al inicio para generar confianza$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Conceder siempre a cambio de algo$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Conceder en cantidades crecientes$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Conceder cuando estés cansado$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb06h$<p>Después de cerrar un acuerdo se recomienda:</p>$evhb06h$, 25, $evhb06h$Formalizar evita malentendidos.$evhb06h$, $evhb06h$Formalizar evita malentendidos.$evhb06h$, $evhb06j${"external_id":"hb06-q4.4"}$evhb06j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Esperar a que el otro llame$evhb06h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Enviar un acta o correo de confirmación con responsables y fechas$evhb06h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$No escribir nada$evhb06h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb06h$Renegociar de inmediato$evhb06h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Negociación final completa' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Negociación final completa', $evhb06h$<h2>Qué vas a hacer</h2><p>Con el caso final (red de droguerías–laboratorio, roles confidenciales), negocien 30 minutos aplicando preparación, método Harvard, técnicas de Voss, manejo de objeciones ERER y cierre. Entreguen el acta de acuerdo.</p><h2>Qué entregas</h2><p>Plantilla de preparación + video de la negociación + acta de acuerdo + reflexión individual.</p><h2>Cómo se evalúa</h2><ul><li>Preparación (20 %)</li><li>Exploración de intereses y técnicas de escucha (25 %)</li><li>Manejo de objeciones (20 %)</li><li>Concesiones y cierre (20 %)</li><li>Acta clara con responsables y fechas (15 %)</li></ul><p>Tiempo estimado: 120 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb06h$, $evhb06j${"version":1,"total":100,"criteria":[{"id":"preparacion","name":"Preparación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"exploracion-de-intereses-y-tecnicas-de-escucha","name":"Exploración de intereses y técnicas de escucha","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"manejo-de-objeciones","name":"Manejo de objeciones","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"concesiones-y-cierre","name":"Concesiones y cierre","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"acta-clara-con-responsables-y-fechas","name":"Acta clara con responsables y fechas","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb06j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 4, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'La objeción más difícil' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'La objeción más difícil', 'Aplicar lo de la unidad 4 a tu trabajo y aprender de los compañeros.',
            $evhb06h$<p>¿Cuál es la objeción más difícil que enfrentas en tu trabajo? Comparte tu respuesta con el método ERER.</p>$evhb06h$, $evhb06h$¿Cuál es la objeción más difícil que enfrentas en tu trabajo? Comparte tu respuesta con el método ERER.$evhb06h$, '{}'::text[],
            $evhb06h$<p>Mejora la respuesta de dos compañeros con una pregunta de exploración adicional.</p>$evhb06h$,
            $evhb06h$<h2>Criterios de valoración</h2><p>Objeción real; respuesta en 4 pasos; aportes constructivos.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb06h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 4);
  END IF;

  -- Lo que existiera en borrador (p. ej., de la antigua versión privada 076) queda publicado.
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_activities  SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_forums      SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
END
$evhb06$;

-- ════ Curso de Inteligencia Emocional en el Trabajo ════
DO $evhb07$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Inteligencia Emocional en el Trabajo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Inteligencia Emocional en el Trabajo: aplica primero la migración 075.';
    RETURN;
  END IF;

  v_estado := 'publicado';
  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, duration_minutes = 840,
         grade_policy = $evhb07j${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhb07j$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Qué es la inteligencia emocional y autoconocimiento' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 1: Qué es la inteligencia emocional y autoconocimiento' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 1: Qué es la inteligencia emocional y autoconocimiento', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 1: Qué es la inteligencia emocional y autoconocimiento', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>¿Quiénes propusieron el concepto de inteligencia emocional en 1990?</p>$evhb07h$, 25, $evhb07h$Goleman lo popularizó en 1995.$evhb07h$, $evhb07h$Goleman lo popularizó en 1995.$evhb07h$, $evhb07j${"external_id":"hb07-q1.1"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Goleman y Cialdini$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Salovey y Mayer$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Ekman y Hall$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Fisher y Ury$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>¿Cuál NO es uno de los componentes del modelo de Goleman?</p>$evhb07h$, 25, $evhb07h$Los cinco son autoconciencia, autorregulación, motivación, empatía y habilidades sociales.$evhb07h$, $evhb07h$Los cinco son autoconciencia, autorregulación, motivación, empatía y habilidades sociales.$evhb07h$, $evhb07j${"external_id":"hb07-q1.2"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Autoconciencia$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Empatía$evhb07h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Coeficiente intelectual$evhb07h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Autorregulación$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>Poner en palabras una emoción (etiquetado afectivo):</p>$evhb07h$, 25, $evhb07h$Hallazgos del equipo de Lieberman (UCLA).$evhb07h$, $evhb07h$Hallazgos del equipo de Lieberman (UCLA).$evhb07h$, $evhb07j${"external_id":"hb07-q1.3"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$No tiene efecto$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Se asocia con menor activación de la amígdala y ayuda a regularla$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Aumenta la emoción siempre$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Es solo para terapeutas$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>La granularidad emocional es:</p>$evhb07h$, 25, $evhb07h$Concepto de Lisa Feldman Barrett.$evhb07h$, $evhb07h$Concepto de Lisa Feldman Barrett.$evhb07h$, $evhb07j${"external_id":"hb07-q1.4"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Reprimir emociones$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Distinguir emociones con precisión$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Sentir muchas emociones a la vez$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Un trastorno$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Diario emocional de 7 días' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Diario emocional de 7 días', $evhb07h$<h2>Qué vas a hacer</h2><p>Registra durante 7 días al menos una situación diaria en el diario emocional (situación, emoción precisa e intensidad, cuerpo, pensamiento, acción, reflexión). Al final identifica 2 patrones y 3 detonantes.</p><h2>Qué entregas</h2><p>Diario completo + análisis de patrones y detonantes (1 página).</p><h2>Cómo se evalúa</h2><ul><li>Registros completos y con vocabulario emocional preciso (40 %)</li><li>Identificación de patrones (30 %)</li><li>Detonantes y reflexión (30 %)</li></ul><p>Tiempo estimado: 60 minutos.</p>$evhb07h$, $evhb07j${"version":1,"total":100,"criteria":[{"id":"registros-completos-y-con-vocabulario-emocional-preciso","name":"Registros completos y con vocabulario emocional preciso","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"identificacion-de-patrones","name":"Identificación de patrones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"detonantes-y-reflexion","name":"Detonantes y reflexión","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb07j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'La emoción que más se repite' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'La emoción que más se repite', 'Aplicar lo de la unidad 1 a tu trabajo y aprender de los compañeros.',
            $evhb07h$<p>¿Qué emoción se repitió más en tu diario y en qué situaciones? ¿Te sorprendió algo?</p>$evhb07h$, $evhb07h$¿Qué emoción se repitió más en tu diario y en qué situaciones? ¿Te sorprendió algo?$evhb07h$, '{}'::text[],
            $evhb07h$<p>Comenta a dos compañeros con una palabra más precisa que podría describir su emoción (usa la rueda).</p>$evhb07h$,
            $evhb07h$<h2>Criterios de valoración</h2><p>Reflexión personal; aportes de vocabulario emocional; confidencialidad y respeto.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb07h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Autorregulación y manejo del estrés' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 2: Autorregulación y manejo del estrés' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 2: Autorregulación y manejo del estrés', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 2: Autorregulación y manejo del estrés', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 2, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>Según la OMS (CIE-11), el burnout es:</p>$evhb07h$, 25, $evhb07h$Se clasifica como fenómeno ocupacional, no como condición médica.$evhb07h$, $evhb07h$Se clasifica como fenómeno ocupacional, no como condición médica.$evhb07h$, $evhb07j${"external_id":"hb07-q2.1"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Una enfermedad mental$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Un fenómeno ocupacional$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Un rasgo de personalidad$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Un trastorno del sueño$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>¿Cuál es una dimensión del burnout?</p>$evhb07h$, 25, $evhb07h$Agotamiento, distancia/cinismo y menor eficacia.$evhb07h$, $evhb07h$Agotamiento, distancia/cinismo y menor eficacia.$evhb07h$, $evhb07j${"external_id":"hb07-q2.2"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Euforia$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Distancia mental o cinismo hacia el trabajo$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Hiperactividad productiva$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Mayor eficacia$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>En la técnica STOP, la &quot;O&quot; significa:</p>$evhb07h$, 25, $evhb07h$Para, toma aire, observa y procede.$evhb07h$, $evhb07h$Para, toma aire, observa y procede.$evhb07h$, $evhb07j${"external_id":"hb07-q2.3"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Olvidar$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Observar lo que siento y pienso$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Ordenar$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Opinar$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>A largo plazo, ¿qué estrategia de regulación suele ser más saludable que la supresión?</p>$evhb07h$, 25, $evhb07h$Cambiar la interpretación de la situación.$evhb07h$, $evhb07h$Cambiar la interpretación de la situación.$evhb07h$, $evhb07j${"external_id":"hb07-q2.4"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Ignorar$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Reevaluación cognitiva$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Gritar$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Evitar a las personas$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Plan de autorregulación y autocuidado' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Plan de autorregulación y autocuidado', $evhb07h$<h2>Qué vas a hacer</h2><p>(1) Registra 3 situaciones en las que aplicaste STOP o reevaluación. (2) Evalúa las 6 áreas de Maslach y Leiter en tu trabajo (escala 1–5). (3) Diseña un plan de autocuidado con 3 acciones individuales y 1 propuesta organizacional.</p><h2>Qué entregas</h2><p>Registro de 3 situaciones + evaluación de áreas + plan de autocuidado.</p><h2>Cómo se evalúa</h2><ul><li>Aplicación documentada de técnicas (35 %)</li><li>Análisis de áreas de riesgo (30 %)</li><li>Plan realista con propuesta organizacional (35 %)</li></ul><p>Tiempo estimado: 60 minutos.</p>$evhb07h$, $evhb07j${"version":1,"total":100,"criteria":[{"id":"aplicacion-documentada-de-tecnicas","name":"Aplicación documentada de técnicas","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"analisis-de-areas-de-riesgo","name":"Análisis de áreas de riesgo","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"plan-realista-con-propuesta-organizacional","name":"Plan realista con propuesta organizacional","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb07j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 2, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Lo que me recarga' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Lo que me recarga', 'Aplicar lo de la unidad 2 a tu trabajo y aprender de los compañeros.',
            $evhb07h$<p>¿Qué te recarga de energía fuera del trabajo y qué propuesta harías a tu organización para reducir el desgaste del equipo?</p>$evhb07h$, $evhb07h$¿Qué te recarga de energía fuera del trabajo y qué propuesta harías a tu organización para reducir el desgaste del equipo?$evhb07h$, '{}'::text[],
            $evhb07h$<p>Comenta dos propuestas organizacionales de compañeros: ¿son viables? ¿Cómo las presentarías a la dirección?</p>$evhb07h$,
            $evhb07h$<h2>Criterios de valoración</h2><p>Aporte personal y propuesta organizacional; retroalimentación constructiva. El tutor monitorea señales de alerta y orienta a recursos de apoyo si es necesario.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb07h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 2);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Empatía' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 3: Empatía' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 3: Empatía', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 3: Empatía', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 3, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>La empatía que combina entender, sentir y querer ayudar es la:</p>$evhb07h$, 25, $evhb07h$Es la más útil y protectora en salud.$evhb07h$, $evhb07h$Es la más útil y protectora en salud.$evhb07h$, $evhb07j${"external_id":"hb07-q3.1"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Cognitiva$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Emocional$evhb07h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Compasiva (preocupación empática)$evhb07h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Selectiva$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>En el protocolo NURSE, la &quot;R&quot; corresponde a:</p>$evhb07h$, 25, $evhb07h$Name, Understand, Respect, Support, Explore.$evhb07h$, $evhb07h$Name, Understand, Respect, Support, Explore.$evhb07h$, $evhb07j${"external_id":"hb07-q3.2"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Responder$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Respetar (reconocer el esfuerzo de la persona)$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Repetir$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Remitir$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>&quot;Al menos no es algo grave&quot; es un ejemplo de:</p>$evhb07h$, 25, $evhb07h$Puede hacer que la persona se sienta no escuchada.$evhb07h$, $evhb07h$Puede hacer que la persona se sienta no escuchada.$evhb07h$, $evhb07j${"external_id":"hb07-q3.3"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Empatía$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Minimizar o buscar el lado positivo demasiado pronto$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Exploración$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Apoyo$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>Después de una respuesta empática se recomienda:</p>$evhb07h$, 25, $evhb07h$El silencio permite que la persona comparta lo que necesita.$evhb07h$, $evhb07h$El silencio permite que la persona comparta lo que necesita.$evhb07h$, $evhb07j${"external_id":"hb07-q3.4"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Dar inmediatamente toda la información técnica$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Hacer silencio y dejar que la persona responda$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Cambiar de tema$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Despedirse$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Simulación NURSE' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Simulación NURSE', $evhb07h$<h2>Qué vas a hacer</h2><p>En parejas, representen 2 de los 4 casos (inicio de insulina, medicamento costoso, cuidadora agotada, paciente que no autoriza la EPS). Quien atiende usa al menos 3 respuestas NURSE y la pausa. Graben y autoevalúen.</p><h2>Qué entregas</h2><p>Video de 2 simulaciones (5 min c/u) + autoevaluación con la tarjeta NURSE.</p><h2>Cómo se evalúa</h2><ul><li>Identificación de la emoción (20 %)</li><li>Uso adecuado de 3+ respuestas NURSE (40 %)</li><li>Pausa y exploración (20 %)</li><li>Tono y no verbal coherentes (20 %)</li></ul><p>Tiempo estimado: 60 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb07h$, $evhb07j${"version":1,"total":100,"criteria":[{"id":"identificacion-de-la-emocion","name":"Identificación de la emoción","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"uso-adecuado-de-3-respuestas-nurse","name":"Uso adecuado de 3+ respuestas NURSE","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"pausa-y-exploracion","name":"Pausa y exploración","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"tono-y-no-verbal-coherentes","name":"Tono y no verbal coherentes","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb07j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 3, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Frases que funcionan' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Frases que funcionan', 'Aplicar lo de la unidad 3 a tu trabajo y aprender de los compañeros.',
            $evhb07h$<p>Comparte una frase de cada tipo NURSE para una situación emocional frecuente en tu trabajo.</p>$evhb07h$, $evhb07h$Comparte una frase de cada tipo NURSE para una situación emocional frecuente en tu trabajo.$evhb07h$, '{}'::text[],
            $evhb07h$<p>Elige la frase de un compañero que más te gustó y explica por qué. Sugiere una mejora a otra.</p>$evhb07h$,
            $evhb07h$<h2>Criterios de valoración</h2><p>Cinco frases contextualizadas; retroalimentación respetuosa.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb07h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 3);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Habilidades sociales y resiliencia' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 4: Habilidades sociales y resiliencia' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 4: Habilidades sociales y resiliencia', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 4: Habilidades sociales y resiliencia', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 4, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>Según la APA, la resiliencia es:</p>$evhb07h$, 25, $evhb07h$Es un proceso que se puede desarrollar.$evhb07h$, $evhb07h$Es un proceso que se puede desarrollar.$evhb07h$, $evhb07j${"external_id":"hb07-q4.1"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$No sentir dolor ante la adversidad$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Un proceso de adaptación exitosa a experiencias difíciles$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Un rasgo fijo de nacimiento$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Evitar los problemas$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>El término &quot;segunda víctima&quot; se refiere a:</p>$evhb07h$, 25, $evhb07h$Acuñado por Albert Wu.$evhb07h$, $evhb07h$Acuñado por Albert Wu.$evhb07h$, $evhb07j${"external_id":"hb07-q4.2"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$El familiar del paciente$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$El profesional que sufre tras estar involucrado en un evento adverso$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Un segundo paciente afectado$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$El jefe del servicio$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>En la ecuación de la confianza, ¿qué factor la disminuye?</p>$evhb07h$, 25, $evhb07h$La autoorientación va en el denominador.$evhb07h$, $evhb07h$La autoorientación va en el denominador.$evhb07h$, $evhb07j${"external_id":"hb07-q4.3"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Credibilidad$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Confiabilidad$evhb07h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Alta autoorientación (pensar más en uno mismo)$evhb07h$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Cercanía$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb07h$<p>Una disculpa efectiva para reparar una relación:</p>$evhb07h$, 25, $evhb07h$Reconocer, disculparse sin justificar y acordar cambios.$evhb07h$, $evhb07h$Reconocer, disculparse sin justificar y acordar cambios.$evhb07h$, $evhb07j${"external_id":"hb07-q4.4"}$evhb07j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Incluye "pero tú también…"$evhb07h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Reconoce la propia parte sin "pero" y propone cómo seguir$evhb07h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$Se hace por correo masivo$evhb07h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb07h$No es necesaria$evhb07h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Plan de desarrollo emocional de 90 días' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Plan de desarrollo emocional de 90 días', $evhb07h$<h2>Qué vas a hacer</h2><p>Diseña tu plan de 90 días con los 7 elementos (diagnóstico, meta, hábitos diarios, prácticas semanales, apoyos, medición, revisión), integrando al menos 3 técnicas del curso (diario, STOP, reevaluación, NURSE, SBI, etc.).</p><h2>Qué entregas</h2><p>Plan de 90 días (plantilla) + carta breve a ti mismo para leer en el día 90.</p><h2>Cómo se evalúa</h2><ul><li>Diagnóstico sustentado (15 %)</li><li>Meta concreta (20 %)</li><li>Hábitos y prácticas realistas con técnicas del curso (30 %)</li><li>Apoyos y medición (20 %)</li><li>Coherencia global (15 %)</li></ul><p>Tiempo estimado: 75 minutos.</p>$evhb07h$, $evhb07j${"version":1,"total":100,"criteria":[{"id":"diagnostico-sustentado","name":"Diagnóstico sustentado","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"meta-concreta","name":"Meta concreta","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"habitos-y-practicas-realistas-con-tecnicas-del-curso","name":"Hábitos y prácticas realistas con técnicas del curso","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"apoyos-y-medicion","name":"Apoyos y medición","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"coherencia-global","name":"Coherencia global","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb07j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 4, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi compromiso de 90 días' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi compromiso de 90 días', 'Aplicar lo de la unidad 4 a tu trabajo y aprender de los compañeros.',
            $evhb07h$<p>Comparte tu meta principal de 90 días y el hábito diario que vas a mantener.</p>$evhb07h$, $evhb07h$Comparte tu meta principal de 90 días y el hábito diario que vas a mantener.$evhb07h$, '{}'::text[],
            $evhb07h$<p>Elige a un compañero como &quot;aliado de rendición de cuentas&quot; y acuerden escribirse a los 30 días.</p>$evhb07h$,
            $evhb07h$<h2>Criterios de valoración</h2><p>Meta concreta; hábito sostenible; acuerdo de seguimiento con un compañero.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb07h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 4);
  END IF;

  -- Lo que existiera en borrador (p. ej., de la antigua versión privada 076) queda publicado.
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_activities  SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_forums      SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
END
$evhb07$;

-- ════ Curso de Liderazgo y Trabajo en Equipo ════
DO $evhb08$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Liderazgo y Trabajo en Equipo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Liderazgo y Trabajo en Equipo: aplica primero la migración 075.';
    RETURN;
  END IF;

  v_estado := 'publicado';
  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, duration_minutes = 1080,
         grade_policy = $evhb08j${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhb08j$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del liderazgo' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 1: Fundamentos del liderazgo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 1: Fundamentos del liderazgo', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 1: Fundamentos del liderazgo', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>En el liderazgo situacional, un colaborador nuevo con mucho entusiasmo pero poca competencia necesita un estilo:</p>$evhb08h$, 25, $evhb08h$Necesita instrucciones claras y supervisión cercana.$evhb08h$, $evhb08h$Necesita instrucciones claras y supervisión cercana.$evhb08h$, $evhb08j${"external_id":"hb08-q1.1"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Delegar$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Dirigir$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Apoyar$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Ignorar$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>El nivel de desarrollo en el modelo situacional se evalúa:</p>$evhb08h$, 25, $evhb08h$Una persona puede ser experta en una tarea y novata en otra.$evhb08h$, $evhb08h$Una persona puede ser experta en una tarea y novata en otra.$evhb08h$, $evhb08j${"external_id":"hb08-q1.2"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Por persona en general$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Por tarea específica$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Por antigüedad$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Por edad$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>Robert K. Greenleaf propuso el liderazgo:</p>$evhb08h$, 25, $evhb08h$El líder al servicio de su equipo (1970).$evhb08h$, $evhb08h$El líder al servicio de su equipo (1970).$evhb08h$, $evhb08j${"external_id":"hb08-q1.3"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Transaccional$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$De servicio$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Autocrático$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Laissez-faire$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>Un error frecuente del nuevo líder es:</p>$evhb08h$, 25, $evhb08h$Se convierte en cuello de botella.$evhb08h$, $evhb08h$Se convierte en cuello de botella.$evhb08h$, $evhb08j${"external_id":"hb08-q1.4"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Hacer 1:1 con su equipo$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Seguir haciendo todo él mismo sin delegar$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Pedir ayuda a su jefe$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Escuchar antes de cambiar$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Diagnóstico de mi equipo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Diagnóstico de mi equipo', $evhb08h$<h2>Qué vas a hacer</h2><p>Para cada persona de tu equipo (o un equipo ficticio de 4 personas del caso), identifica su nivel en 2 tareas clave y el estilo situacional adecuado. Haz tu autoevaluación de transición y escribe tus 3 prioridades de los próximos 90 días.</p><h2>Qué entregas</h2><p>Matriz equipo × tareas × estilo + autoevaluación + 3 prioridades.</p><h2>Cómo se evalúa</h2><ul><li>Diagnóstico de nivel por tarea coherente (40 %)</li><li>Estilo recomendado justificado (30 %)</li><li>Prioridades realistas (30 %)</li></ul><p>Tiempo estimado: 60 minutos.</p>$evhb08h$, $evhb08j${"version":1,"total":100,"criteria":[{"id":"diagnostico-de-nivel-por-tarea-coherente","name":"Diagnóstico de nivel por tarea coherente","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"estilo-recomendado-justificado","name":"Estilo recomendado justificado","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"prioridades-realistas","name":"Prioridades realistas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb08j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi transición' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi transición', 'Aplicar lo de la unidad 1 a tu trabajo y aprender de los compañeros.',
            $evhb08h$<p>¿Qué te ha costado más (o crees que te costaría) en el paso de técnico a líder? ¿Qué estilo te sale más natural y cuál te cuesta?</p>$evhb08h$, $evhb08h$¿Qué te ha costado más (o crees que te costaría) en el paso de técnico a líder? ¿Qué estilo te sale más natural y cuál te cuesta?$evhb08h$, '{}'::text[],
            $evhb08h$<p>Comparte con dos compañeros una estrategia que te haya funcionado o que hayas visto funcionar.</p>$evhb08h$,
            $evhb08h$<h2>Criterios de valoración</h2><p>Reflexión honesta; estrategias concretas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb08h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Construir equipos de alto desempeño' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 2: Construir equipos de alto desempeño' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 2: Construir equipos de alto desempeño', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 2: Construir equipos de alto desempeño', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 2, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>Según el Proyecto Aristóteles de Google, el factor más importante de los equipos efectivos fue:</p>$evhb08h$, 25, $evhb08h$Por encima de quiénes conformaban el equipo.$evhb08h$, $evhb08h$Por encima de quiénes conformaban el equipo.$evhb08h$, $evhb08j${"external_id":"hb08-q2.1"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$El coeficiente intelectual$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$La seguridad psicológica$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$El salario$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$La antigüedad$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>En los estudios de Edmondson, los mejores equipos de enfermería reportaban más errores porque:</p>$evhb08h$, 25, $evhb08h$La seguridad psicológica facilita el reporte.$evhb08h$, $evhb08h$La seguridad psicológica facilita el reporte.$evhb08h$, $evhb08j${"external_id":"hb08-q2.2"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Cometían más errores$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Se atrevían a reportarlos y podían aprender$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Tenían menos pacientes$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Eran más nuevos$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>La base de la pirámide de Lencioni es:</p>$evhb08h$, 25, $evhb08h$Cada disfunción se apoya en la anterior.$evhb08h$, $evhb08h$Cada disfunción se apoya en la anterior.$evhb08h$, $evhb08j${"external_id":"hb08-q2.3"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Falta de atención a resultados$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Ausencia de confianza$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Temor al conflicto$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Falta de compromiso$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>&quot;Estar en desacuerdo y comprometerse&quot; ayuda a superar:</p>$evhb08h$, 25, $evhb08h$Las personas se comprometen si fueron escuchadas.$evhb08h$, $evhb08h$Las personas se comprometen si fueron escuchadas.$evhb08h$, $evhb08j${"external_id":"hb08-q2.4"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$La falta de compromiso$evhb08h$, TRUE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$La falta de confianza$evhb08h$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$La falta de presupuesto$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$La rotación$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Diagnóstico de equipo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Diagnóstico de equipo', $evhb08h$<h2>Qué vas a hacer</h2><p>Aplica (de forma anónima) la encuesta de seguridad psicológica y el cuestionario de disfunciones de Lencioni a tu equipo (o analiza el caso de la red de droguerías). Identifica la disfunción prioritaria y diseña 3 acciones con responsables y fechas.</p><h2>Qué entregas</h2><p>Resultados de las encuestas + análisis + plan de 3 acciones.</p><h2>Cómo se evalúa</h2><ul><li>Aplicación de instrumentos o análisis del caso (25 %)</li><li>Diagnóstico coherente con la pirámide (35 %)</li><li>Acciones concretas y medibles (40 %)</li></ul><p>Tiempo estimado: 75 minutos.</p>$evhb08h$, $evhb08j${"version":1,"total":100,"criteria":[{"id":"aplicacion-de-instrumentos-o-analisis-del-caso","name":"Aplicación de instrumentos o análisis del caso","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"diagnostico-coherente-con-la-piramide","name":"Diagnóstico coherente con la pirámide","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"acciones-concretas-y-medibles","name":"Acciones concretas y medibles","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb08j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 2, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'La disfunción de mi equipo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'La disfunción de mi equipo', 'Aplicar lo de la unidad 2 a tu trabajo y aprender de los compañeros.',
            $evhb08h$<p>¿Qué disfunción de Lencioni reconoces en tu equipo actual o en uno anterior? ¿Qué conducta del líder la alimentaba o la redujo?</p>$evhb08h$, $evhb08h$¿Qué disfunción de Lencioni reconoces en tu equipo actual o en uno anterior? ¿Qué conducta del líder la alimentaba o la redujo?$evhb08h$, '{}'::text[],
            $evhb08h$<p>Propón a dos compañeros una acción concreta para su caso.</p>$evhb08h$,
            $evhb08h$<h2>Criterios de valoración</h2><p>Análisis con el modelo; acción concreta propuesta; sin nombres propios.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb08h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 2);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Delegar, reuniones y 1:1' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 3: Delegar, reuniones y 1:1' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 3: Delegar, reuniones y 1:1', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 3: Delegar, reuniones y 1:1', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 3, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>El nivel de delegación &quot;propón opciones con tu recomendación; yo decido&quot; corresponde a:</p>$evhb08h$, 25, $evhb08h$El colaborador analiza y recomienda; el líder decide.$evhb08h$, $evhb08h$El colaborador analiza y recomienda; el líder decide.$evhb08h$, $evhb08j${"external_id":"hb08-q3.1"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Nivel 1$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Nivel 2$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Nivel 4$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Nivel 5$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>La &quot;delegación inversa&quot; ocurre cuando:</p>$evhb08h$, 25, $evhb08h$Se evita preguntando por opciones y recomendación.$evhb08h$, $evhb08h$Se evita preguntando por opciones y recomendación.$evhb08h$, $evhb08j${"external_id":"hb08-q3.2"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$El líder delega demasiado$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$El colaborador devuelve el problema al líder y este lo resuelve$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Se delega a dos personas$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Se delega por escrito$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>En una reunión, para evitar que todos se alineen con el jefe, conviene:</p>$evhb08h$, 25, $evhb08h$Reduce el sesgo de autoridad.$evhb08h$, $evhb08h$Reduce el sesgo de autoridad.$evhb08h$, $evhb08j${"external_id":"hb08-q3.3"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Que el jefe hable primero$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Pedir primero la opinión de quienes tienen menos poder$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$No pedir opiniones$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Votar en secreto siempre$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>Las reuniones 1:1 son principalmente:</p>$evhb08h$, 25, $evhb08h$El colaborador trae los temas.$evhb08h$, $evhb08h$El colaborador trae los temas.$evhb08h$, $evhb08j${"external_id":"hb08-q3.4"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$La reunión del jefe para dar órdenes$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$La reunión del colaborador para sus temas, la relación y su desarrollo$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Una evaluación de desempeño$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Opcionales y cancelables$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Delegación y 1:1' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Delegación y 1:1', $evhb08h$<h2>Qué vas a hacer</h2><p>(1) Delega una tarea real con los 7 elementos y registra la conversación (o simúlala). (2) Realiza un 1:1 con un colaborador (o simulado) usando la estructura de 5 partes. (3) Rediseña la agenda de tu próxima reunión de equipo.</p><h2>Qué entregas</h2><p>Guion de delegación + notas del 1:1 (sin datos sensibles) + agenda rediseñada.</p><h2>Cómo se evalúa</h2><ul><li>Delegación con los 7 elementos y nivel de autonomía claro (35 %)</li><li>1:1 con estructura y preguntas abiertas (35 %)</li><li>Agenda con propósito, tiempos y roles (30 %)</li></ul><p>Tiempo estimado: 75 minutos.</p>$evhb08h$, $evhb08j${"version":1,"total":100,"criteria":[{"id":"delegacion-con-los-7-elementos-y-nivel-de-autonomia-claro","name":"Delegación con los 7 elementos y nivel de autonomía claro","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"1-1-con-estructura-y-preguntas-abiertas","name":"1:1 con estructura y preguntas abiertas","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"agenda-con-proposito-tiempos-y-roles","name":"Agenda con propósito, tiempos y roles","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb08j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 3, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'La mejor reunión' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'La mejor reunión', 'Aplicar lo de la unidad 3 a tu trabajo y aprender de los compañeros.',
            $evhb08h$<p>Describe la reunión más útil a la que hayas asistido. ¿Qué elementos de los 6 tenía?</p>$evhb08h$, $evhb08h$Describe la reunión más útil a la que hayas asistido. ¿Qué elementos de los 6 tenía?$evhb08h$, '{}'::text[],
            $evhb08h$<p>Comparte con dos compañeros una pregunta de 1:1 que te parezca poderosa.</p>$evhb08h$,
            $evhb08h$<h2>Criterios de valoración</h2><p>Análisis con los 6 elementos; preguntas aportadas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb08h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 3);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Motivación y liderazgo del cambio' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 4: Motivación y liderazgo del cambio' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 4: Motivación y liderazgo del cambio', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 4: Motivación y liderazgo del cambio', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 4, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>Según la teoría de la autodeterminación, las tres necesidades psicológicas básicas son:</p>$evhb08h$, 25, $evhb08h$Propuesta por Deci y Ryan.$evhb08h$, $evhb08h$Propuesta por Deci y Ryan.$evhb08h$, $evhb08j${"external_id":"hb08-q4.1"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Salario, horario y bonos$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Autonomía, competencia y relación$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Poder, logro y afiliación$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Seguridad, estima y autorrealización$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>Un reconocimiento efectivo es:</p>$evhb08h$, 25, $evhb08h$Debe además adaptarse a la persona.$evhb08h$, $evhb08h$Debe además adaptarse a la persona.$evhb08h$, $evhb08j${"external_id":"hb08-q4.2"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Genérico y anual$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Específico, oportuno y frecuente$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Solo monetario$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Siempre público$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>El primer paso del modelo de Kotter es:</p>$evhb08h$, 25, $evhb08h$Las personas deben ver por qué el cambio es necesario ahora.$evhb08h$, $evhb08h$Las personas deben ver por qué el cambio es necesario ahora.$evhb08h$, $evhb08j${"external_id":"hb08-q4.3"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Anclar el cambio en la cultura$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Crear sentido de urgencia$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Celebrar victorias$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Comunicar la visión$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb08h$<p>Declarar la victoria demasiado pronto es un error que se evita en el paso de:</p>$evhb08h$, 25, $evhb08h$Hay que usar la credibilidad ganada para extender el cambio.$evhb08h$, $evhb08h$Hay que usar la credibilidad ganada para extender el cambio.$evhb08h$, $evhb08j${"external_id":"hb08-q4.4"}$evhb08j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Formar la coalición$evhb08h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Consolidar y profundizar$evhb08h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Crear urgencia$evhb08h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb08h$Eliminar obstáculos$evhb08h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Plan de liderazgo del cambio' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Plan de liderazgo del cambio', $evhb08h$<h2>Qué vas a hacer</h2><p>Diseña el plan de un cambio real en tu equipo (o el caso de doble verificación) con los 8 pasos de Kotter, un mapa de actores con su posible resistencia, 3 acciones de motivación (autonomía, competencia, relación) y un plan de comunicación de 4 semanas.</p><h2>Qué entregas</h2><p>Plan de cambio (plantilla) + mapa de actores + plan de comunicación.</p><h2>Cómo se evalúa</h2><ul><li>8 pasos completos y concretos (35 %)</li><li>Análisis de resistencia y estrategias (25 %)</li><li>Acciones de motivación coherentes con la teoría (20 %)</li><li>Plan de comunicación (20 %)</li></ul><p>Tiempo estimado: 120 minutos.</p>$evhb08h$, $evhb08j${"version":1,"total":100,"criteria":[{"id":"8-pasos-completos-y-concretos","name":"8 pasos completos y concretos","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"analisis-de-resistencia-y-estrategias","name":"Análisis de resistencia y estrategias","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"acciones-de-motivacion-coherentes-con-la-teoria","name":"Acciones de motivación coherentes con la teoría","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"plan-de-comunicacion","name":"Plan de comunicación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb08j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 4, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'El cambio que voy a liderar' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'El cambio que voy a liderar', 'Aplicar lo de la unidad 4 a tu trabajo y aprender de los compañeros.',
            $evhb08h$<p>Comparte el cambio que vas a liderar, tu visión en una frase y la victoria temprana que planeas.</p>$evhb08h$, $evhb08h$Comparte el cambio que vas a liderar, tu visión en una frase y la victoria temprana que planeas.$evhb08h$, '{}'::text[],
            $evhb08h$<p>Ayuda a dos compañeros a identificar un obstáculo que no hayan considerado.</p>$evhb08h$,
            $evhb08h$<h2>Criterios de valoración</h2><p>Visión clara; victoria temprana concreta; retroalimentación útil.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb08h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 4);
  END IF;

  -- Lo que existiera en borrador (p. ej., de la antigua versión privada 076) queda publicado.
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_activities  SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_forums      SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
END
$evhb08$;

-- ════ Curso de Servicio al Cliente y Comunicación con el Paciente ════
DO $evhb09$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Servicio al Cliente y Comunicación con el Paciente' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Servicio al Cliente y Comunicación con el Paciente: aplica primero la migración 075.';
    RETURN;
  END IF;

  v_estado := 'publicado';
  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, duration_minutes = 840,
         grade_policy = $evhb09j${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhb09j$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del servicio' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 1: Fundamentos del servicio' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 1: Fundamentos del servicio', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 1: Fundamentos del servicio', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>El concepto de &quot;momentos de verdad&quot; fue popularizado por:</p>$evhb09h$, 25, $evhb09h$Presidente de la aerolínea SAS.$evhb09h$, $evhb09h$Presidente de la aerolínea SAS.$evhb09h$, $evhb09j${"external_id":"hb09-q1.1"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Philip Kotler$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Jan Carlzon$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Peter Drucker$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Daniel Goleman$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>En Colombia, la norma que adopta el Modelo de Gestión del Servicio Farmacéutico es la:</p>$evhb09h$, 25, $evhb09h$Incluye la información sobre el uso adecuado en la dispensación.$evhb09h$, $evhb09h$Incluye la información sobre el uso adecuado en la dispensación.$evhb09h$, $evhb09j${"external_id":"hb09-q1.2"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Ley 100 de 1993$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Resolución 1403 de 2007$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Ley 1581 de 2012$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Resolución 2764 de 2022$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>Si el medicamento no está disponible, lo correcto es:</p>$evhb09h$, 25, $evhb09h$El servicio no termina con el agotado.$evhb09h$, $evhb09h$El servicio no termina con el agotado.$evhb09h$, $evhb09j${"external_id":"hb09-q1.3"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Decir "no hay" y atender al siguiente$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Ofrecer alternativas: otra sede, fecha de llegada u opciones según la norma$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Vender otro sin preguntar$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Pedir que vuelva otro día sin más información$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>El paso más importante del protocolo desde la seguridad del paciente es:</p>$evhb09h$, 25, $evhb09h$Ahí se previenen errores de uso.$evhb09h$, $evhb09h$Ahí se previenen errores de uso.$evhb09h$, $evhb09j${"external_id":"hb09-q1.4"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$El cobro$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$La entrega con información y verificación de la comprensión$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$El saludo$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$El empaque$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Observación del protocolo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Observación del protocolo', $evhb09h$<h2>Qué vas a hacer</h2><p>Dibuja el recorrido del paciente en tu lugar de trabajo con 3 momentos críticos. Luego observa a un compañero (y que te observe) en 5 atenciones con la lista de verificación del protocolo de 6 pasos.</p><h2>Qué entregas</h2><p>Mapa del recorrido + 10 listas de verificación (5 propias, 5 del compañero) + 3 mejoras.</p><h2>Cómo se evalúa</h2><ul><li>Mapa con momentos críticos (30 %)</li><li>Observaciones completas (40 %)</li><li>Mejoras concretas (30 %)</li></ul><p>Tiempo estimado: 60 minutos.</p>$evhb09h$, $evhb09j${"version":1,"total":100,"criteria":[{"id":"mapa-con-momentos-criticos","name":"Mapa con momentos críticos","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"observaciones-completas","name":"Observaciones completas","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"mejoras-concretas","name":"Mejoras concretas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb09j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Un momento de verdad' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Un momento de verdad', 'Aplicar lo de la unidad 1 a tu trabajo y aprender de los compañeros.',
            $evhb09h$<p>Cuenta un momento de verdad (bueno o malo) que hayas vivido como paciente o cliente en una droguería o servicio de salud. ¿Qué paso del protocolo marcó la diferencia?</p>$evhb09h$, $evhb09h$Cuenta un momento de verdad (bueno o malo) que hayas vivido como paciente o cliente en una droguería o servicio de salud. ¿Qué paso del protocolo marcó la diferencia?$evhb09h$, '{}'::text[],
            $evhb09h$<p>Comenta dos experiencias de compañeros identificando el paso del protocolo involucrado.</p>$evhb09h$,
            $evhb09h$<h2>Criterios de valoración</h2><p>Experiencia concreta; análisis con el protocolo.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb09h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Comunicación clara con el paciente' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 2: Comunicación clara con el paciente' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 2: Comunicación clara con el paciente', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 2: Comunicación clara con el paciente', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 2, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>La técnica de enseñar de vuelta (teach-back) consiste en:</p>$evhb09h$, 25, $evhb09h$Verifica la comprensión y evalúa la explicación.$evhb09h$, $evhb09h$Verifica la comprensión y evalúa la explicación.$evhb09h$, $evhb09j${"external_id":"hb09-q2.1"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Preguntar "¿me entendió?"$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Pedir al paciente que explique con sus palabras lo que entendió$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Entregar un folleto$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Repetir la explicación tres veces$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>¿Cuál es una mejor pregunta para invitar dudas?</p>$evhb09h$, 25, $evhb09h$Asume que es normal tener preguntas.$evhb09h$, $evhb09h$Asume que es normal tener preguntas.$evhb09h$, $evhb09j${"external_id":"hb09-q2.2"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$¿Tiene preguntas?$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$¿Qué preguntas tiene?$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$¿Todo claro, cierto?$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$¿Ya se va?$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>En Colombia, los antibióticos:</p>$evhb09h$, 25, $evhb09h$Su uso inadecuado favorece la resistencia antimicrobiana.$evhb09h$, $evhb09h$Su uso inadecuado favorece la resistencia antimicrobiana.$evhb09h$, $evhb09j${"external_id":"hb09-q2.3"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Se pueden vender libremente$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Requieren fórmula médica$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Solo requieren cédula$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Se venden si el cliente insiste$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>Ante un niño de 2 años con fiebre de 3 días y respiración rápida, lo correcto es:</p>$evhb09h$, 25, $evhb09h$Es una señal de alarma que requiere valoración médica.$evhb09h$, $evhb09h$Es una señal de alarma que requiere valoración médica.$evhb09h$, $evhb09j${"external_id":"hb09-q2.4"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Recomendar un antigripal$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Remitirlo al médico ese mismo día$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Vender un antibiótico$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Esperar una semana$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Dispensación con información' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Dispensación con información', $evhb09h$<h2>Qué vas a hacer</h2><p>Graba 2 simulaciones de dispensación (una con fórmula —p. ej., suspensión de antibiótico pediátrico o insulina— y una solicitud de venta libre con señal de alarma). Aplica lenguaje sencillo, enseñar de vuelta y las 5 preguntas/remisión.</p><h2>Qué entregas</h2><p>2 videos (4–6 min c/u) + autoevaluación con la lista de verificación.</p><h2>Cómo se evalúa</h2><ul><li>Información completa y correcta según fórmula/inserto (30 %)</li><li>Lenguaje sencillo (20 %)</li><li>Enseñar de vuelta bien aplicado (25 %)</li><li>Identificación de la señal de alarma y remisión (25 %)</li></ul><p>Tiempo estimado: 75 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb09h$, $evhb09j${"version":1,"total":100,"criteria":[{"id":"informacion-completa-y-correcta-segun-formula-inserto","name":"Información completa y correcta según fórmula/inserto","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"lenguaje-sencillo","name":"Lenguaje sencillo","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"ensenar-de-vuelta-bien-aplicado","name":"Enseñar de vuelta bien aplicado","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"identificacion-de-la-senal-de-alarma-y-remision","name":"Identificación de la señal de alarma y remisión","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb09j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 2, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Traductor de términos técnicos' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Traductor de términos técnicos', 'Aplicar lo de la unidad 2 a tu trabajo y aprender de los compañeros.',
            $evhb09h$<p>Comparte 3 términos técnicos que usas a menudo con pacientes y su versión en lenguaje sencillo.</p>$evhb09h$, $evhb09h$Comparte 3 términos técnicos que usas a menudo con pacientes y su versión en lenguaje sencillo.$evhb09h$, '{}'::text[],
            $evhb09h$<p>Revisa los de dos compañeros: ¿un paciente sin formación en salud los entendería? Propón mejoras.</p>$evhb09h$,
            $evhb09h$<h2>Criterios de valoración</h2><p>Traducciones claras y correctas; aportes constructivos.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb09h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 2);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Clientes difíciles y quejas' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 3: Clientes difíciles y quejas' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 3: Clientes difíciles y quejas', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 3: Clientes difíciles y quejas', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 3, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>En el método LAST, la &quot;A&quot; corresponde a:</p>$evhb09h$, 25, $evhb09h$Listen, Apologize, Solve, Thank.$evhb09h$, $evhb09h$Listen, Apologize, Solve, Thank.$evhb09h$, $evhb09j${"external_id":"hb09-q3.1"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Argumentar$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Disculparse (Apologize)$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Avisar$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Acordar$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>Ante un cliente muy alterado, decir &quot;cálmese&quot;:</p>$evhb09h$, 25, $evhb09h$Se percibe como desestimar su emoción.$evhb09h$, $evhb09h$Se percibe como desestimar su emoción.$evhb09h$, $evhb09j${"external_id":"hb09-q3.2"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Siempre funciona$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Suele escalar la situación$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Es lo más profesional$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Es obligatorio$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>Si un cliente amenaza con violencia física, lo primero es:</p>$evhb09h$, 25, $evhb09h$La seguridad es la prioridad.$evhb09h$, $evhb09h$La seguridad es la prioridad.$evhb09h$, $evhb09j${"external_id":"hb09-q3.3"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Enfrentarlo$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Proteger tu seguridad, alejarte y pedir ayuda según el protocolo$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Ignorarlo$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Discutir$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>Si la misma queja se repite muchas veces, lo adecuado es:</p>$evhb09h$, 25, $evhb09h$Las quejas repetidas indican fallas del sistema.$evhb09h$, $evhb09h$Las quejas repetidas indican fallas del sistema.$evhb09h$, $evhb09j${"external_id":"hb09-q3.4"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Resolver caso por caso sin decir nada$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Reportar el patrón al coordinador para corregir el proceso$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Ignorarla$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Pedir a los clientes que no se quejen$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Simulación de quejas y desescalamiento' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Simulación de quejas y desescalamiento', $evhb09h$<h2>Qué vas a hacer</h2><p>En parejas, simulen dos casos: (1) queja por medicamento pendiente (LAST completo) y (2) cliente agresivo que insulta (desescalamiento con límite). Graben y evalúen con la tarjeta LAST y la guía de 7 pasos.</p><h2>Qué entregas</h2><p>2 videos + autoevaluación + propuesta de protocolo de seguridad para tu establecimiento (1 página).</p><h2>Cómo se evalúa</h2><ul><li>LAST completo y solución realista (30 %)</li><li>Técnicas de desescalamiento verbal y no verbal (30 %)</li><li>Límite respetuoso (15 %)</li><li>Protocolo de seguridad viable (25 %)</li></ul><p>Tiempo estimado: 90 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb09h$, $evhb09j${"version":1,"total":100,"criteria":[{"id":"last-completo-y-solucion-realista","name":"LAST completo y solución realista","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"tecnicas-de-desescalamiento-verbal-y-no-verbal","name":"Técnicas de desescalamiento verbal y no verbal","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"limite-respetuoso","name":"Límite respetuoso","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"protocolo-de-seguridad-viable","name":"Protocolo de seguridad viable","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb09j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 3, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'La queja que más escucho' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'La queja que más escucho', 'Aplicar lo de la unidad 3 a tu trabajo y aprender de los compañeros.',
            $evhb09h$<p>¿Cuál es la queja más frecuente en tu lugar de trabajo? Escribe tu respuesta LAST y una propuesta para evitarla desde el proceso.</p>$evhb09h$, $evhb09h$¿Cuál es la queja más frecuente en tu lugar de trabajo? Escribe tu respuesta LAST y una propuesta para evitarla desde el proceso.$evhb09h$, '{}'::text[],
            $evhb09h$<p>Comenta dos propuestas de compañeros: ¿atacan la causa raíz?</p>$evhb09h$,
            $evhb09h$<h2>Criterios de valoración</h2><p>Respuesta LAST completa; propuesta de mejora del proceso; comentarios constructivos.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb09h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 3);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Canales digitales y medición' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 4: Canales digitales y medición' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 4: Canales digitales y medición', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 4: Canales digitales y medición', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 4, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>Si de 100 encuestados 55 son promotores, 30 pasivos y 15 detractores, el NPS es:</p>$evhb09h$, 25, $evhb09h$NPS = % promotores − % detractores = 55 − 15.$evhb09h$, $evhb09h$NPS = % promotores − % detractores = 55 − 15.$evhb09h$, $evhb09j${"external_id":"hb09-q4.1"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$+55$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$+40$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$+70$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$+15$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>En el NPS, una calificación de 7 u 8 corresponde a:</p>$evhb09h$, 25, $evhb09h$Satisfechos pero no entusiastas.$evhb09h$, $evhb09h$Satisfechos pero no entusiastas.$evhb09h$, $evhb09j${"external_id":"hb09-q4.2"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Promotor$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Pasivo$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Detractor$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$No se cuenta en la encuesta$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>En Colombia, los datos de salud se consideran según la Ley 1581 de 2012:</p>$evhb09h$, 25, $evhb09h$Requieren especial cuidado y autorización.$evhb09h$, $evhb09h$Requieren especial cuidado y autorización.$evhb09h$, $evhb09j${"external_id":"hb09-q4.3"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Datos públicos$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Datos sensibles con protección reforzada$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Datos sin regulación$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Datos comerciales$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb09h$<p>Al atender por teléfono y dejar al cliente en espera se recomienda:</p>$evhb09h$, 25, $evhb09h$Respeta el tiempo y la paciencia del cliente.$evhb09h$, $evhb09h$Respeta el tiempo y la paciencia del cliente.$evhb09h$, $evhb09j${"external_id":"hb09-q4.4"}$evhb09j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Dejarlo en espera sin avisar$evhb09h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Pedir permiso y no superar un minuto sin volver$evhb09h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Colgar y llamar luego$evhb09h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb09h$Pasarlo a otra persona sin explicar$evhb09h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Plan de mejora del servicio' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Plan de mejora del servicio', $evhb09h$<h2>Qué vas a hacer</h2><p>Aplica la encuesta NPS + CSAT a 30 pacientes o clientes (o usa los datos del caso), calcula los indicadores en la plantilla, clasifica las PQRS de un mes, identifica las 2 causas principales y diseña 2 mejoras con responsables, fechas e indicador. Incluye 5 plantillas de WhatsApp.</p><h2>Qué entregas</h2><p>Plantilla con NPS/CSAT calculados + análisis de PQRS + plan de mejora + 5 plantillas de WhatsApp.</p><h2>Cómo se evalúa</h2><ul><li>Cálculo correcto de NPS y CSAT (25 %)</li><li>Análisis de causas (25 %)</li><li>Plan de mejora con responsables e indicador (30 %)</li><li>Plantillas de WhatsApp claras y seguras (20 %)</li></ul><p>Tiempo estimado: 120 minutos.</p>$evhb09h$, $evhb09j${"version":1,"total":100,"criteria":[{"id":"calculo-correcto-de-nps-y-csat","name":"Cálculo correcto de NPS y CSAT","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"analisis-de-causas","name":"Análisis de causas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"plan-de-mejora-con-responsables-e-indicador","name":"Plan de mejora con responsables e indicador","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"plantillas-de-whatsapp-claras-y-seguras","name":"Plantillas de WhatsApp claras y seguras","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb09j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 4, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi indicador de servicio' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi indicador de servicio', 'Aplicar lo de la unidad 4 a tu trabajo y aprender de los compañeros.',
            $evhb09h$<p>¿Qué indicador de servicio mides hoy en tu lugar de trabajo (si alguno)? ¿Cuál implementarías primero y por qué?</p>$evhb09h$, $evhb09h$¿Qué indicador de servicio mides hoy en tu lugar de trabajo (si alguno)? ¿Cuál implementarías primero y por qué?$evhb09h$, '{}'::text[],
            $evhb09h$<p>Comenta a dos compañeros cómo podrían recoger los datos de forma sencilla.</p>$evhb09h$,
            $evhb09h$<h2>Criterios de valoración</h2><p>Reflexión sobre la medición actual; propuesta viable; aportes prácticos.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb09h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 4);
  END IF;

  -- Lo que existiera en borrador (p. ej., de la antigua versión privada 076) queda publicado.
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_activities  SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_forums      SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
END
$evhb09$;

-- ════ Curso para Hablar Frente a la Cámara: Oratoria Digital para Videos y Videollamadas ════
DO $evhb10$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso para Hablar Frente a la Cámara: Oratoria Digital para Videos y Videollamadas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso para Hablar Frente a la Cámara: Oratoria Digital para Videos y Videollamadas: aplica primero la migración 075.';
    RETURN;
  END IF;

  v_estado := 'publicado';
  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, duration_minutes = 720,
         grade_policy = $evhb10j${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhb10j$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. De la tarima a la cámara' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 1: De la tarima a la cámara' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 1: De la tarima a la cámara', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 1: De la tarima a la cámara', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>Al hablar frente a la cámara es recomendable imaginar que hablas:</p>$evhb10h$, 25, $evhb10h$Cada espectador ve el video solo.$evhb10h$, $evhb10h$Cada espectador ve el video solo.$evhb10h$, $evhb10j${"external_id":"hb10-q1.1"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$A un auditorio de mil personas$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$A una persona concreta al otro lado del lente$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$A nadie$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Al jefe$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>¿Cuál es el elemento técnico más importante para que no abandonen un video?</p>$evhb10h$, 25, $evhb10h$La gente tolera mejor una imagen regular que un mal audio.$evhb10h$, $evhb10h$La gente tolera mejor una imagen regular que un mal audio.$evhb10h$, $evhb10j${"external_id":"hb10-q1.2"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$La resolución 4K$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$El audio claro$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$El filtro$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$La música$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>La mejor ubicación respecto a una ventana es:</p>$evhb10h$, 25, $evhb10h$La ventana detrás de la cámara ilumina el rostro.$evhb10h$, $evhb10h$La ventana detrás de la cámara ilumina el rostro.$evhb10h$, $evhb10j${"external_id":"hb10-q1.3"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$De espaldas a la ventana$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$De frente a la ventana$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Sin luz$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Debajo de un bombillo$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>Para videos cortos en redes como Reels o TikTok, el formato habitual es:</p>$evhb10h$, 25, $evhb10h$Es el formato nativo de esas plataformas.$evhb10h$, $evhb10h$Es el formato nativo de esas plataformas.$evhb10h$, $evhb10j${"external_id":"hb10-q1.4"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Horizontal 16:9$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Vertical 9:16$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Cuadrado 1:1$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Panorámico$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Mi set y mi primer video' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Mi set y mi primer video', $evhb10h$<h2>Qué vas a hacer</h2><p>Completa el reto de 7 días (registra cada día). Arma tu set con el checklist y graba un video de 45–60 s sobre un consejo de tu área, en vertical, aplicando audio, luz y encuadre.</p><h2>Qué entregas</h2><p>Registro del reto + foto del set + video de 45–60 s.</p><h2>Cómo se evalúa</h2><ul><li>Constancia en el reto (25 %)</li><li>Audio limpio (25 %)</li><li>Luz y encuadre correctos (25 %)</li><li>Mensaje claro dirigido a una persona (25 %)</li></ul><p>Tiempo estimado: 75 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb10h$, $evhb10j${"version":1,"total":100,"criteria":[{"id":"constancia-en-el-reto","name":"Constancia en el reto","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"audio-limpio","name":"Audio limpio","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"luz-y-encuadre-correctos","name":"Luz y encuadre correctos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"mensaje-claro-dirigido-a-una-persona","name":"Mensaje claro dirigido a una persona","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb10j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mi primer video' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mi primer video', 'Aplicar lo de la unidad 1 a tu trabajo y aprender de los compañeros.',
            $evhb10h$<p>Comparte tu video de 45–60 s (o el enlace) y cuenta qué fue lo más difícil del reto.</p>$evhb10h$, $evhb10h$Comparte tu video de 45–60 s (o el enlace) y cuenta qué fue lo más difícil del reto.$evhb10h$, '{}'::text[],
            $evhb10h$<p>Da a dos compañeros una fortaleza y una sugerencia técnica (audio, luz o encuadre).</p>$evhb10h$,
            $evhb10h$<h2>Criterios de valoración</h2><p>Video compartido; retroalimentación respetuosa con una fortaleza y una sugerencia.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb10h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Guion y naturalidad' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 2: Guion y naturalidad' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 2: Guion y naturalidad', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 2: Guion y naturalidad', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 2, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>¿Cuánto debe durar aproximadamente el gancho de un video corto?</p>$evhb10h$, 25, $evhb10h$La decisión de seguir viendo se toma en segundos.$evhb10h$, $evhb10h$La decisión de seguir viendo se toma en segundos.$evhb10h$, $evhb10j${"external_id":"hb10-q2.1"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$30 segundos$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Los primeros 3 segundos$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Un minuto$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$No es necesario$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>Un video de 60 segundos a ritmo natural tiene aproximadamente:</p>$evhb10h$, 25, $evhb10h$A 130–160 palabras por minuto.$evhb10h$, $evhb10h$A 130–160 palabras por minuto.$evhb10h$, $evhb10j${"external_id":"hb10-q2.2"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$40 palabras$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$120–150 palabras$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$400 palabras$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$1.000 palabras$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>Para usar bien un teleprompter conviene:</p>$evhb10h$, 25, $evhb10h$Reduce el movimiento de los ojos y suena más natural.$evhb10h$, $evhb10h$Reduce el movimiento de los ojos y suena más natural.$evhb10h$, $evhb10j${"external_id":"hb10-q2.3"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Poner el texto lejos del lente$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Ajustar la velocidad a tu ritmo y ubicar el texto cerca del lente$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Leer sin ensayar$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Usar letra pequeña$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>Frente a la cámara, la energía conviene:</p>$evhb10h$, 25, $evhb10h$La cámara aplana la expresión.$evhb10h$, $evhb10h$La cámara aplana la expresión.$evhb10h$, $evhb10j${"external_id":"hb10-q2.4"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Bajarla$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Subirla ligeramente (10–20 %)$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Mantenerla plana$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$No importa$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Tres métodos, un guion' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Tres métodos, un guion', $evhb10h$<h2>Qué vas a hacer</h2><p>Escribe 3 guiones de 60 s con la plantilla (ganchos distintos). Graba uno de ellos con los 3 métodos (teleprompter, puntos clave, bloques), edita la mejor versión y agrégale subtítulos revisados.</p><h2>Qué entregas</h2><p>3 guiones + 3 tomas comparativas + video final editado con subtítulos.</p><h2>Cómo se evalúa</h2><ul><li>Guiones con estructura de 4 partes y 120–150 palabras (35 %)</li><li>Comparación reflexiva de métodos (20 %)</li><li>Naturalidad y energía en el video final (25 %)</li><li>Subtítulos correctos (20 %)</li></ul><p>Tiempo estimado: 90 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb10h$, $evhb10j${"version":1,"total":100,"criteria":[{"id":"guiones-con-estructura-de-4-partes-y-120-150-palabras","name":"Guiones con estructura de 4 partes y 120–150 palabras","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"comparacion-reflexiva-de-metodos","name":"Comparación reflexiva de métodos","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"naturalidad-y-energia-en-el-video-final","name":"Naturalidad y energía en el video final","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"subtitulos-correctos","name":"Subtítulos correctos","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb10j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 2, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Banco de ganchos' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Banco de ganchos', 'Aplicar lo de la unidad 2 a tu trabajo y aprender de los compañeros.',
            $evhb10h$<p>Comparte tus 3 mejores ganchos para videos de tu área (máx. una frase cada uno).</p>$evhb10h$, $evhb10h$Comparte tus 3 mejores ganchos para videos de tu área (máx. una frase cada uno).$evhb10h$, '{}'::text[],
            $evhb10h$<p>Vota por el gancho más efectivo de dos compañeros y explica por qué te detendrías a ver ese video.</p>$evhb10h$,
            $evhb10h$<h2>Criterios de valoración</h2><p>Ganchos claros, veraces y atractivos; justificación de los votos.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb10h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 2);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Voz, mirada y formatos en vivo' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 3: Voz, mirada y formatos en vivo' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 3: Voz, mirada y formatos en vivo', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 3: Voz, mirada y formatos en vivo', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 3, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>Para dar sensación de contacto visual en un video conviene:</p>$evhb10h$, 25, $evhb10h$El lente representa los ojos del espectador.$evhb10h$, $evhb10h$El lente representa los ojos del espectador.$evhb10h$, $evhb10j${"external_id":"hb10-q3.1"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Mirar tu imagen en la pantalla$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Mirar al lente en las ideas clave$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Mirar las notas$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Cerrar los ojos$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>En un webinar, ¿quién debería leer y seleccionar las preguntas del chat?</p>$evhb10h$, 25, $evhb10h$Separar roles mejora la conducción.$evhb10h$, $evhb10h$Separar roles mejora la conducción.$evhb10h$, $evhb10j${"external_id":"hb10-q3.2"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$El presentador mientras expone$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$El moderador o anfitrión$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Nadie$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Los participantes$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>Una buena frecuencia de interacción en un webinar es:</p>$evhb10h$, 25, $evhb10h$Mantiene la atención en línea.$evhb10h$, $evhb10h$Mantiene la atención en línea.$evhb10h$, $evhb10j${"external_id":"hb10-q3.3"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Cada 30 minutos$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Cada 5–7 minutos$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Solo al final$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Ninguna$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>Después del webinar se recomienda enviar recursos y grabación:</p>$evhb10h$, 25, $evhb10h$El seguimiento oportuno aprovecha el interés.$evhb10h$, $evhb10h$El seguimiento oportuno aprovecha el interés.$evhb10h$, $evhb10j${"external_id":"hb10-q3.4"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Al mes$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$En las siguientes 24 horas$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Nunca$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Solo si alguien lo pide$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Microwebinar' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Microwebinar', $evhb10h$<h2>Qué vas a hacer</h2><p>En grupos de 3 (presentador, moderador, soporte), realicen un microwebinar de 15 minutos sobre un tema de salud para pacientes o colegas, con guion técnico, al menos 2 interacciones, ronda de preguntas y llamado a la acción. Graben la sesión.</p><h2>Qué entregas</h2><p>Guion técnico + grabación + informe de seguimiento (asistencia simulada, preguntas, mejoras).</p><h2>Cómo se evalúa</h2><ul><li>Guion técnico con estructura y roles (25 %)</li><li>Presencia en cámara (mirada, voz, energía) (25 %)</li><li>Interacciones efectivas (25 %)</li><li>Manejo de preguntas y cierre (25 %)</li></ul><p>Tiempo estimado: 90 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb10h$, $evhb10j${"version":1,"total":100,"criteria":[{"id":"guion-tecnico-con-estructura-y-roles","name":"Guion técnico con estructura y roles","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"presencia-en-camara-mirada-voz-energia","name":"Presencia en cámara (mirada, voz, energía)","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"interacciones-efectivas","name":"Interacciones efectivas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"manejo-de-preguntas-y-cierre","name":"Manejo de preguntas y cierre","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb10j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 3, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Lo que aprendí del microwebinar' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Lo que aprendí del microwebinar', 'Aplicar lo de la unidad 3 a tu trabajo y aprender de los compañeros.',
            $evhb10h$<p>¿Qué funcionó y qué mejorarías de tu microwebinar? ¿Qué interacción generó más participación?</p>$evhb10h$, $evhb10h$¿Qué funcionó y qué mejorarías de tu microwebinar? ¿Qué interacción generó más participación?$evhb10h$, '{}'::text[],
            $evhb10h$<p>Comparte con dos compañeros una idea de interacción que no hayan usado.</p>$evhb10h$,
            $evhb10h$<h2>Criterios de valoración</h2><p>Reflexión con evidencias de la grabación; ideas de interacción concretas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb10h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 3);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Contenido de salud en redes y plan de 30 días' AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = 'Quiz de la unidad 4: Contenido de salud en redes y plan de 30 días' AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, 'Quiz de la unidad 4: Contenido de salud en redes y plan de 30 días', 'Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.')
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, 'Quiz de la unidad 4: Contenido de salud en redes y plan de 30 días', '<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>', TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 4, 7.5)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>En Colombia, al público general solo pueden anunciarse:</p>$evhb10h$, 25, $evhb10h$Los de venta bajo fórmula se promocionan solo a profesionales.$evhb10h$, $evhb10h$Los de venta bajo fórmula se promocionan solo a profesionales.$evhb10h$, $evhb10j${"external_id":"hb10-q4.1"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Todos los medicamentos$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Los medicamentos de venta libre, cumpliendo los requisitos del INVIMA$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Los antibióticos$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Los medicamentos de control$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>Según la guía de la SIC de 2020, el contenido patrocinado en redes debe:</p>$evhb10h$, 25, $evhb10h$La transparencia protege al consumidor.$evhb10h$, $evhb10h$La transparencia protege al consumidor.$evhb10h$, $evhb10j${"external_id":"hb10-q4.2"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Ocultarse$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Revelarse de forma clara (p. ej., #Publicidad)$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Publicarse solo de noche$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Ser anónimo$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>Ante un seguidor que pide en comentarios qué dosis tomar, lo adecuado es:</p>$evhb10h$, 25, $evhb10h$No se prescribe por redes sociales.$evhb10h$, $evhb10h$No se prescribe por redes sociales.$evhb10h$, $evhb10j${"external_id":"hb10-q4.3"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Darle la dosis$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Responder con información general y remitirlo a su médico o QF$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Ignorarlo$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Venderle por mensaje$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $evhb10h$<p>La producción por lotes consiste en:</p>$evhb10h$, 25, $evhb10h$Ahorra tiempo y da coherencia visual.$evhb10h$, $evhb10h$Ahorra tiempo y da coherencia visual.$evhb10h$, $evhb10j${"external_id":"hb10-q4.4"}$evhb10j$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Publicar todo el mismo día$evhb10h$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Escribir, grabar y editar varias piezas en sesiones agrupadas$evhb10h$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Comprar contenido$evhb10h$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $evhb10h$Copiar videos de otros$evhb10h$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = 'Plan de contenido y portafolio' AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, 'Plan de contenido y portafolio', $evhb10h$<h2>Qué vas a hacer</h2><p>Diseña tu plan de 30 días (objetivo, audiencia, 3–4 pilares, 12 piezas en calendario) y produce por lotes 3 videos de 45–90 s que pasen el checklist ético-normativo. Define 3 métricas y cómo las revisarás cada semana.</p><h2>Qué entregas</h2><p>Calendario editorial + 3 videos finales con subtítulos + checklist ético diligenciado + tablero de métricas.</p><h2>Cómo se evalúa</h2><ul><li>Plan coherente con objetivo y audiencia (25 %)</li><li>Calidad de los 3 videos (guion, set, presencia) (35 %)</li><li>Cumplimiento ético-normativo (25 %)</li><li>Métricas y rutina de revisión (15 %)</li></ul><p>Tiempo estimado: 150 minutos.</p><p>Si entregas un video, súbelo a un servicio de tu confianza con acceso por enlace y pega aquí el enlace privado. No incluyas datos de pacientes.</p>$evhb10h$, $evhb10j${"version":1,"total":100,"criteria":[{"id":"plan-coherente-con-objetivo-y-audiencia","name":"Plan coherente con objetivo y audiencia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"calidad-de-los-3-videos-guion-set-presencia","name":"Calidad de los 3 videos (guion, set, presencia)","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"cumplimiento-etico-normativo","name":"Cumplimiento ético-normativo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"metricas-y-rutina-de-revision","name":"Métricas y rutina de revisión","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$evhb10j$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 4, 15, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = 'Mis pilares de contenido' AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', 'Mis pilares de contenido', 'Aplicar lo de la unidad 4 a tu trabajo y aprender de los compañeros.',
            $evhb10h$<p>Comparte tu objetivo, tu audiencia y tus 3–4 pilares de contenido, con dos ideas de video por pilar.</p>$evhb10h$, $evhb10h$Comparte tu objetivo, tu audiencia y tus 3–4 pilares de contenido, con dos ideas de video por pilar.$evhb10h$, '{}'::text[],
            $evhb10h$<p>Revisa el plan de dos compañeros con el checklist ético: ¿alguna idea podría tener riesgo normativo? Sugiere cómo reformularla.</p>$evhb10h$,
            $evhb10h$<h2>Criterios de valoración</h2><p>Plan claro; revisión ética fundamentada; sugerencias constructivas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de pacientes ni información interna de tu empresa.</p>$evhb10h$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2.5, NULL, FALSE, FALSE, v_estado, 4);
  END IF;

  -- Lo que existiera en borrador (p. ej., de la antigua versión privada 076) queda publicado.
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_activities  SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
  UPDATE aula_forums      SET status = 'publicado', updated_at = NOW() WHERE course_id = v_curso AND status = 'borrador' AND deleted_at IS NULL;
END
$evhb10$;

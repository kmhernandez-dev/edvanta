-- ============================================================
--  162_quices_actividades_foros_manipulacion_de_alimentos.sql
--
--  Generado por scripts/generar-manipulacion-alimentos.mjs (18-nov-2026).
--  En el Curso de Manipulación de Alimentos (161): nota mínima 70, 2
--  intentos y política 60/30/10 (actividades, quices, foros). Por unidad,
--  un quiz de cuatro preguntas, una actividad con rúbrica (la 5 es el
--  proyecto final) y un foro. Idempotente por título.
-- ============================================================

DO $mae$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_estado   TEXT := 'publicado';
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = $mat$Curso de Manipulación de Alimentos$mat$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el Curso de Manipulación de Alimentos: aplica primero la migración 161.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2,
         grade_policy = $maj${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$maj$::jsonb,
         updated_at = NOW()
   WHERE id = v_curso;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = $mat$Unidad 1. Inocuidad y lo que exige la norma$mat$ AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = $mat$Quiz de la unidad 1: Inocuidad y lo que exige la norma$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, $mat$Quiz de la unidad 1: Inocuidad y lo que exige la norma$mat$, $mat$Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.$mat$)
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, $mat$Quiz de la unidad 1: Inocuidad y lo que exige la norma$mat$, $mat$<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>$mat$, TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 6)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>Un alimento es inocuo cuando:</p>$mat$, 25, $mat$La inocuidad es que el alimento no cause daño; no se reconoce por su aspecto.$mat$, $mat$La inocuidad es que el alimento no cause daño; no se reconoce por su aspecto.$mat$, $maj${"external_id":"ma-q1.1"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$No causa daño a quien lo consume$mat$, TRUE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Se ve, huele y sabe bien al servirlo$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Está recién preparado en la cocina$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$No contiene ningún tipo de conservante$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>Según la OMS, en la mayoría de las ETA los síntomas aparecen:</p>$mat$, 25, $mat$El manual de la OMS indica que en la mayoría de los casos aparecen entre 24 y 72 horas después.$mat$, $mat$El manual de la OMS indica que en la mayoría de los casos aparecen entre 24 y 72 horas después.$mat$, $maj${"external_id":"ma-q1.2"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$En los primeros 5 minutos tras comer$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Entre 24 y 72 horas después de comer$mat$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Solo después de una semana de comer$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Únicamente si el alimento huele mal$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>¿Cuántas horas de capacitación al año pide el plan del artículo 12 de la Resolución 2674 de 2013?</p>$mat$, 25, $mat$El artículo 12 pide un plan continuo de al menos 10 horas al año.$mat$, $mat$El artículo 12 pide un plan continuo de al menos 10 horas al año.$mat$, $maj${"external_id":"ma-q1.3"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Al menos 2 horas$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Al menos 5 horas$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Al menos 10 horas$mat$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Al menos 40 horas$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>Un manipulador con diarrea debe:</p>$mat$, 25, $mat$El artículo 11 excluye de la manipulación directa a quien tiene diarrea y le pide informar a la empresa.$mat$, $mat$El artículo 11 excluye de la manipulación directa a quien tiene diarrea y le pide informar a la empresa.$mat$, $maj${"external_id":"ma-q1.4"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Seguir trabajando, pero con guantes$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Tomar un antidiarreico y continuar$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Trabajar solo en el turno de la tarde$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Avisar y no manipular alimentos$mat$, TRUE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = $mat$Mi diagnóstico de riesgos$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, $mat$Mi diagnóstico de riesgos$mat$, $mat$<h2>Qué vas a hacer</h2><p>Observa tu puesto de trabajo (o un establecimiento de alimentos que conozcas) durante un turno e identifica un peligro biológico, uno químico y uno físico.</p><h2>Qué entregas</h2><p>Una tabla con cada peligro, dónde lo viste, cómo llegaría al alimento y una medida para controlarlo según la Resolución 2674 de 2013.</p><h2>Cómo se evalúa</h2><ul><li>Aplica la Resolución 2674 de 2013 y las cinco claves correctamente (40 %)</li><li>Identifica riesgos y propone medidas concretas para su contexto (40 %)</li><li>Presenta el trabajo completo, claro y ordenado (20 %)</li></ul><p>No incluyas datos personales de clientes ni de pacientes.</p>$mat$, $maj${"version":1,"total":100,"criteria":[{"id":"aplica-la-resolucion-2674-de-2013-y-las-cinco-claves-correctamente","name":"Aplica la Resolución 2674 de 2013 y las cinco claves correctamente","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"identifica-riesgos-y-propone-medidas-concretas-para-su-contexto","name":"Identifica riesgos y propone medidas concretas para su contexto","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"presenta-el-trabajo-completo-claro-y-ordenado","name":"Presenta el trabajo completo, claro y ordenado","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$maj$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 12, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = $mat$¿Qué peligro encontraste en tu lugar de trabajo?$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', $mat$¿Qué peligro encontraste en tu lugar de trabajo?$mat$, 'Aplicar lo de la unidad a tu trabajo y aprender de los compañeros.',
            $mat$<p>Comparte un peligro que hayas visto y la medida que propones. Responde a dos compañeros con una sugerencia concreta.</p>$mat$, $mat$Comparte un peligro que hayas visto y la medida que propones. Responde a dos compañeros con una sugerencia concreta.$mat$, '{}'::text[],
            $mat$<p>Publica tu aporte (máx. 200 palabras) y responde a dos compañeros con una sugerencia concreta.</p>$mat$,
            $mat$<h2>Criterios de valoración</h2><p>Aporte propio aplicado a tu trabajo; dos respuestas con sugerencias específicas y respetuosas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de clientes ni información interna de tu empresa.</p>$mat$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = $mat$Unidad 2. Higiene personal y prácticas higiénicas$mat$ AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = $mat$Quiz de la unidad 2: Higiene personal y prácticas higiénicas$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, $mat$Quiz de la unidad 2: Higiene personal y prácticas higiénicas$mat$, $mat$Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.$mat$)
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, $mat$Quiz de la unidad 2: Higiene personal y prácticas higiénicas$mat$, $mat$<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>$mat$, TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 6)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>¿Durante cuánto tiempo, como mínimo, debes enjabonarte las manos según la OMS?</p>$mat$, 25, $mat$La OMS indica enjabonarse durante al menos 20 segundos.$mat$, $mat$La OMS indica enjabonarse durante al menos 20 segundos.$mat$, $maj${"external_id":"ma-q2.1"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$5 segundos$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$10 segundos$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$15 segundos$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$20 segundos$mat$, TRUE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>¿De qué color debe ser la ropa de trabajo según la Resolución 2674 de 2013?</p>$mat$, 25, $mat$El numeral 2 del artículo 14 pide ropa de color claro; no se permiten grises ni tonos que oculten la suciedad.$mat$, $mat$El numeral 2 del artículo 14 pide ropa de color claro; no se permiten grises ni tonos que oculten la suciedad.$mat$, $maj${"external_id":"ma-q2.2"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Oscuro, para disimular manchas$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Gris, por ser un tono neutro$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Claro, para que se vea la suciedad$mat$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Cualquiera, si está limpia$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>Usar guantes:</p>$mat$, 25, $mat$El numeral 10 aclara que los guantes no reemplazan el lavado de manos.$mat$, $mat$El numeral 10 aclara que los guantes no reemplazan el lavado de manos.$mat$, $maj${"external_id":"ma-q2.3"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Reemplaza el lavado de manos siempre$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$No reemplaza el lavado de manos$mat$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Es obligatorio en todas las tareas$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Permite cobrar y servir sin cambiarlos$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>¿Cuál de estas prácticas está permitida en el área de manipulación?</p>$mat$, 25, $mat$Las uñas cortas, limpias y sin esmalte son lo que pide el numeral 7.$mat$, $mat$Las uñas cortas, limpias y sin esmalte son lo que pide el numeral 7.$mat$, $maj${"external_id":"ma-q2.4"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Uñas cortas, limpias y sin esmalte$mat$, TRUE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Masticar chicle mientras se prepara$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Usar solo el anillo de matrimonio$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Llevar el celular en el bolsillo alto$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = $mat$Lista de chequeo de prácticas higiénicas$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, $mat$Lista de chequeo de prácticas higiénicas$mat$, $mat$<h2>Qué vas a hacer</h2><p>Arma una lista de chequeo con los numerales del artículo 14 de la Resolución 2674 de 2013 y aplícala a ti mismo durante tres turnos.</p><h2>Qué entregas</h2><p>La lista diligenciada, los incumplimientos que encontraste y cómo los corregiste.</p><h2>Cómo se evalúa</h2><ul><li>Aplica la Resolución 2674 de 2013 y las cinco claves correctamente (40 %)</li><li>Identifica riesgos y propone medidas concretas para su contexto (40 %)</li><li>Presenta el trabajo completo, claro y ordenado (20 %)</li></ul><p>No incluyas datos personales de clientes ni de pacientes.</p>$mat$, $maj${"version":1,"total":100,"criteria":[{"id":"aplica-la-resolucion-2674-de-2013-y-las-cinco-claves-correctamente","name":"Aplica la Resolución 2674 de 2013 y las cinco claves correctamente","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"identifica-riesgos-y-propone-medidas-concretas-para-su-contexto","name":"Identifica riesgos y propone medidas concretas para su contexto","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"presenta-el-trabajo-completo-claro-y-ordenado","name":"Presenta el trabajo completo, claro y ordenado","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$maj$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 12, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = $mat$La práctica higiénica que más cuesta cumplir$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', $mat$La práctica higiénica que más cuesta cumplir$mat$, 'Aplicar lo de la unidad a tu trabajo y aprender de los compañeros.',
            $mat$<p>¿Cuál práctica del artículo 14 cuesta más cumplir en tu trabajo y por qué? Propón una solución práctica y comenta la de dos compañeros.</p>$mat$, $mat$¿Cuál práctica del artículo 14 cuesta más cumplir en tu trabajo y por qué? Propón una solución práctica y comenta la de dos compañeros.$mat$, '{}'::text[],
            $mat$<p>Publica tu aporte (máx. 200 palabras) y responde a dos compañeros con una sugerencia concreta.</p>$mat$,
            $mat$<h2>Criterios de valoración</h2><p>Aporte propio aplicado a tu trabajo; dos respuestas con sugerencias específicas y respetuosas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de clientes ni información interna de tu empresa.</p>$mat$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = $mat$Unidad 3. Las cinco claves y el control de temperaturas$mat$ AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = $mat$Quiz de la unidad 3: Las cinco claves y el control de temperaturas$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, $mat$Quiz de la unidad 3: Las cinco claves y el control de temperaturas$mat$, $mat$Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.$mat$)
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, $mat$Quiz de la unidad 3: Las cinco claves y el control de temperaturas$mat$, $mat$<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>$mat$, TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 6)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>¿Qué temperatura interna recomienda la OMS para que un alimento cocinado sea seguro?</p>$mat$, 25, $mat$El manual de la OMS indica que el alimento debe alcanzar 70 °C.$mat$, $mat$El manual de la OMS indica que el alimento debe alcanzar 70 °C.$mat$, $maj${"external_id":"ma-q3.1"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$70 °C$mat$, TRUE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$50 °C$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$60 °C$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$40 °C$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>La zona de peligro va de:</p>$mat$, 25, $mat$Entre 5 y 60 °C los microorganismos se multiplican con gran rapidez.$mat$, $mat$Entre 5 y 60 °C los microorganismos se multiplican con gran rapidez.$mat$, $maj${"external_id":"ma-q3.2"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$0 a 20 °C$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$5 a 60 °C$mat$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$30 a 90 °C$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$60 a 100 °C$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>¿Cuánto tiempo, como máximo, puede estar un alimento cocinado a temperatura ambiente?</p>$mat$, 25, $mat$La OMS recomienda no dejarlo más de 2 horas.$mat$, $mat$La OMS recomienda no dejarlo más de 2 horas.$mat$, $maj${"external_id":"ma-q3.3"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$30 minutos$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$6 horas$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$2 horas$mat$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$12 horas$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>En la nevera, la carne cruda debe ir:</p>$mat$, 25, $mat$Abajo y tapada, para que sus jugos no goteen sobre los alimentos listos.$mat$, $mat$Abajo y tapada, para que sus jugos no goteen sobre los alimentos listos.$mat$, $maj${"external_id":"ma-q3.4"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$En la parte alta, a la vista$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Junto a los postres listos$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Sin tapa, para enfriar rápido$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$En la parte baja y tapada$mat$, TRUE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = $mat$Registro de temperaturas de una semana$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, $mat$Registro de temperaturas de una semana$mat$, $mat$<h2>Qué vas a hacer</h2><p>Durante una semana, mide y registra dos veces al día la temperatura de una nevera y de un alimento caliente en exhibición (o de tu casa, si no trabajas en el área).</p><h2>Qué entregas</h2><p>El registro, las lecturas fuera de rango y la acción que tomaste en cada caso.</p><h2>Cómo se evalúa</h2><ul><li>Aplica la Resolución 2674 de 2013 y las cinco claves correctamente (40 %)</li><li>Identifica riesgos y propone medidas concretas para su contexto (40 %)</li><li>Presenta el trabajo completo, claro y ordenado (20 %)</li></ul><p>No incluyas datos personales de clientes ni de pacientes.</p>$mat$, $maj${"version":1,"total":100,"criteria":[{"id":"aplica-la-resolucion-2674-de-2013-y-las-cinco-claves-correctamente","name":"Aplica la Resolución 2674 de 2013 y las cinco claves correctamente","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"identifica-riesgos-y-propone-medidas-concretas-para-su-contexto","name":"Identifica riesgos y propone medidas concretas para su contexto","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"presenta-el-trabajo-completo-claro-y-ordenado","name":"Presenta el trabajo completo, claro y ordenado","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$maj$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 12, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = $mat$¿Dónde se rompe la cadena de temperatura?$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', $mat$¿Dónde se rompe la cadena de temperatura?$mat$, 'Aplicar lo de la unidad a tu trabajo y aprender de los compañeros.',
            $mat$<p>Describe un momento de tu trabajo en que un alimento pasa por la zona de peligro y cómo lo evitarías. Responde a dos compañeros.</p>$mat$, $mat$Describe un momento de tu trabajo en que un alimento pasa por la zona de peligro y cómo lo evitarías. Responde a dos compañeros.$mat$, '{}'::text[],
            $mat$<p>Publica tu aporte (máx. 200 palabras) y responde a dos compañeros con una sugerencia concreta.</p>$mat$,
            $mat$<h2>Criterios de valoración</h2><p>Aporte propio aplicado a tu trabajo; dos respuestas con sugerencias específicas y respetuosas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de clientes ni información interna de tu empresa.</p>$mat$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = $mat$Unidad 4. Plan de saneamiento$mat$ AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = $mat$Quiz de la unidad 4: Plan de saneamiento$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, $mat$Quiz de la unidad 4: Plan de saneamiento$mat$, $mat$Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.$mat$)
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, $mat$Quiz de la unidad 4: Plan de saneamiento$mat$, $mat$<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>$mat$, TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 6)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>En la superficie de trabajo, ¿qué se hace primero?</p>$mat$, 25, $mat$Primero se limpia: la suciedad protege a los microorganismos del desinfectante.$mat$, $mat$Primero se limpia: la suciedad protege a los microorganismos del desinfectante.$mat$, $maj${"external_id":"ma-q4.1"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Desinfectar sin retirar la grasa$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Enjuagar solo con desinfectante$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Da igual el orden de los pasos$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Limpiar y luego desinfectar$mat$, TRUE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>¿Qué programas forman el plan de saneamiento del artículo 26?</p>$mat$, 25, $mat$Son los cuatro programas del artículo 26: limpieza y desinfección, residuos sólidos, control de plagas y agua potable.$mat$, $mat$Son los cuatro programas del artículo 26: limpieza y desinfección, residuos sólidos, control de plagas y agua potable.$mat$, $maj${"external_id":"ma-q4.2"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Ventas, compras, nómina y calidad$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Limpieza, uniformes, horarios y caja$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Limpieza, residuos, plagas y agua$mat$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Solo limpieza y control de plagas$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>La concentración de un desinfectante se toma de:</p>$mat$, 25, $mat$El programa por escrito define agentes, concentraciones y tiempos según la ficha técnica.$mat$, $mat$El programa por escrito define agentes, concentraciones y tiempos según la ficha técnica.$mat$, $maj${"external_id":"ma-q4.3"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$La experiencia del operario$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$La ficha técnica del producto$mat$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$El color que toma el agua$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$El olor que deja la mezcla$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>El control de plagas empieza por:</p>$mat$, 25, $mat$La norma pide énfasis en medidas preventivas: no dejar entrada, agua, comida ni refugio.$mat$, $mat$La norma pide énfasis en medidas preventivas: no dejar entrada, agua, comida ni refugio.$mat$, $maj${"external_id":"ma-q4.4"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Prevenir entrada, agua y comida$mat$, TRUE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Fumigar cada semana sin falta$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Poner cebos junto a los alimentos$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Esperar a ver plagas para actuar$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = $mat$Procedimiento de limpieza y desinfección$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, $mat$Procedimiento de limpieza y desinfección$mat$, $mat$<h2>Qué vas a hacer</h2><p>Escribe el procedimiento de limpieza y desinfección de una superficie o equipo de tu trabajo (tabla de picar, mesón, licuadora).</p><h2>Qué entregas</h2><p>El procedimiento con agente, concentración según la ficha técnica, tiempo de contacto, frecuencia y responsable, como pide el artículo 26.</p><h2>Cómo se evalúa</h2><ul><li>Aplica la Resolución 2674 de 2013 y las cinco claves correctamente (40 %)</li><li>Identifica riesgos y propone medidas concretas para su contexto (40 %)</li><li>Presenta el trabajo completo, claro y ordenado (20 %)</li></ul><p>No incluyas datos personales de clientes ni de pacientes.</p>$mat$, $maj${"version":1,"total":100,"criteria":[{"id":"aplica-la-resolucion-2674-de-2013-y-las-cinco-claves-correctamente","name":"Aplica la Resolución 2674 de 2013 y las cinco claves correctamente","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"identifica-riesgos-y-propone-medidas-concretas-para-su-contexto","name":"Identifica riesgos y propone medidas concretas para su contexto","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"presenta-el-trabajo-completo-claro-y-ordenado","name":"Presenta el trabajo completo, claro y ordenado","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$maj$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 12, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = $mat$Errores de limpieza que hemos visto$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', $mat$Errores de limpieza que hemos visto$mat$, 'Aplicar lo de la unidad a tu trabajo y aprender de los compañeros.',
            $mat$<p>Comparte un error de limpieza o de manejo de residuos que hayas visto y cómo se corrige. Comenta el aporte de dos compañeros.</p>$mat$, $mat$Comparte un error de limpieza o de manejo de residuos que hayas visto y cómo se corrige. Comenta el aporte de dos compañeros.$mat$, '{}'::text[],
            $mat$<p>Publica tu aporte (máx. 200 palabras) y responde a dos compañeros con una sugerencia concreta.</p>$mat$,
            $mat$<h2>Criterios de valoración</h2><p>Aporte propio aplicado a tu trabajo; dos respuestas con sugerencias específicas y respetuosas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de clientes ni información interna de tu empresa.</p>$mat$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = $mat$Unidad 5. Recepción, almacenamiento y registros$mat$ AND deleted_at IS NULL LIMIT 1;

  -- Quiz
  IF NOT EXISTS (SELECT 1 FROM aula_assessments WHERE course_id = v_curso AND title = $mat$Quiz de la unidad 5: Recepción, almacenamiento y registros$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, $mat$Quiz de la unidad 5: Recepción, almacenamiento y registros$mat$, $mat$Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.$mat$)
    RETURNING id INTO v_banco;
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES (v_curso, v_unidad, $mat$Quiz de la unidad 5: Recepción, almacenamiento y registros$mat$, $mat$<p>Cuatro preguntas de selección múltiple con una sola respuesta correcta. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación se muestra después de enviar.</p>$mat$, TRUE, 70, 2,
            FALSE, TRUE, TRUE, v_estado, 1, 6)
    RETURNING id INTO v_eval;
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>Al recibir un producto refrigerado que llega caliente, debes:</p>$mat$, 25, $mat$Un producto fuera de temperatura se rechaza y se registra.$mat$, $mat$Un producto fuera de temperatura se rechaza y se registra.$mat$, $maj${"external_id":"ma-q5.1"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Rechazarlo y registrarlo$mat$, TRUE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Guardarlo rápido en la nevera$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Usarlo de inmediato en el menú$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Congelarlo para salvarlo$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>PEPS significa:</p>$mat$, 25, $mat$Lo que llega primero se usa primero.$mat$, $mat$Lo que llega primero se usa primero.$mat$, $maj${"external_id":"ma-q5.2"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Productos en perfecto estado$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Primero en entrar, primero en salir$mat$, TRUE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Para empacar por separado$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Prevenir el ingreso de plagas$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>Los productos de limpieza se guardan:</p>$mat$, 25, $mat$Separados, en su envase original y rotulados evitan intoxicaciones químicas.$mat$, $mat$Separados, en su envase original y rotulados evitan intoxicaciones químicas.$mat$, $maj${"external_id":"ma-q5.3"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Junto a las bebidas frías$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$En botellas de gaseosa limpias$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$En su envase, aparte y rotulados$mat$, TRUE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Debajo del mesón de preparación$mat$, FALSE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);
    INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
    VALUES (v_banco, 'unica', $mat$<p>Un registro sirve como evidencia cuando:</p>$mat$, 25, $mat$El registro vale si refleja lo que pasó cuando pasó, con datos reales y firma.$mat$, $mat$El registro vale si refleja lo que pasó cuando pasó, con datos reales y firma.$mat$, $maj${"external_id":"ma-q5.4"}$maj$::jsonb)
    RETURNING id INTO v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Se llena al final de cada mes$mat$, FALSE, '', 0);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Lo llena el supervisor de memoria$mat$, FALSE, '', 1);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Se llena antes de la visita sanitaria$mat$, FALSE, '', 2);
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order)
    VALUES (v_pregunta, $mat$Se llena en el momento y con datos reales$mat$, TRUE, '', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);
  END IF;

  -- Actividad
  IF NOT EXISTS (SELECT 1 FROM aula_activities WHERE course_id = v_curso AND title = $mat$Proyecto final: plan de autocontrol de mi puesto$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, rubric, allow_text, allow_link, allow_file,
       accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight, grading_method)
    VALUES (v_curso, v_unidad, $mat$Proyecto final: plan de autocontrol de mi puesto$mat$, $mat$<h2>Qué vas a hacer</h2><p>Diseña el plan de autocontrol de tu puesto de trabajo: los puntos de control a tu cargo, cómo los vigilas, sus límites, qué haces ante una desviación y qué registros llevas.</p><h2>Qué entregas</h2><p>Un documento de 1 a 2 páginas que integre lo de las cinco unidades y la respuesta al caso integrador de la clase 5.3.</p><h2>Cómo se evalúa</h2><ul><li>Aplica la Resolución 2674 de 2013 y las cinco claves correctamente (40 %)</li><li>Identifica riesgos y propone medidas concretas para su contexto (40 %)</li><li>Presenta el trabajo completo, claro y ordenado (20 %)</li></ul><p>No incluyas datos personales de clientes ni de pacientes.</p>$mat$, $maj${"version":1,"total":100,"criteria":[{"id":"aplica-la-resolucion-2674-de-2013-y-las-cinco-claves-correctamente","name":"Aplica la Resolución 2674 de 2013 y las cinco claves correctamente","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"identifica-riesgos-y-propone-medidas-concretas-para-su-contexto","name":"Identifica riesgos y propone medidas concretas para su contexto","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]},{"id":"presenta-el-trabajo-completo-claro-y-ordenado","name":"Presenta el trabajo completo, claro y ordenado","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cumple el criterio por completo, con evidencia clara y aplicada a su contexto."},{"level":3,"label":"Logrado","description":"Cumple el criterio; quedan detalles menores por mejorar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con vacíos importantes."},{"level":0,"label":"Sin evidencia","description":"No presenta evidencia de este criterio."}]}]}$maj$::jsonb,
            TRUE, TRUE, TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, v_estado, 1, 12, 'rubrica');
  END IF;

  -- Foro
  IF NOT EXISTS (SELECT 1 FROM aula_forums WHERE course_id = v_curso AND title = $mat$Mi compromiso como manipulador$mat$ AND deleted_at IS NULL) THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES (v_curso, v_unidad, 'modulo', $mat$Mi compromiso como manipulador$mat$, 'Aplicar lo de la unidad a tu trabajo y aprender de los compañeros.',
            $mat$<p>¿Qué vas a cambiar desde mañana en tu trabajo después de este curso? Comparte un compromiso concreto y comenta el de dos compañeros.</p>$mat$, $mat$¿Qué vas a cambiar desde mañana en tu trabajo después de este curso? Comparte un compromiso concreto y comenta el de dos compañeros.$mat$, '{}'::text[],
            $mat$<p>Publica tu aporte (máx. 200 palabras) y responde a dos compañeros con una sugerencia concreta.</p>$mat$,
            $mat$<h2>Criterios de valoración</h2><p>Aporte propio aplicado a tu trabajo; dos respuestas con sugerencias específicas y respetuosas.</p><h2>Normas de participación</h2><p>Respeta a tus compañeros. No compartas datos de clientes ni información interna de tu empresa.</p>$mat$,
            'Si aún no hay compañeros, publica tu aporte y vuelve en unos días: el docente responde cada aporte.',
            'directa', 2, NULL, FALSE, FALSE, v_estado, 1);
  END IF;

END $mae$;

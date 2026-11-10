-- ============================================================
--  086_quices_actividades_foros_farmacoterapia.sql — quizzes, actividades y foros, lote «farmacoterapia»
--
--  Generado por scripts/evaluacion-aula.mjs farmacoterapia migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Farmacoterapia de la Diabetes; Farmacoterapia de la Hipertensión Arterial; Farmacoterapia de la Insuficiencia Cardíaca; Farmacoterapia del Asma y la EPOC.
--
--  Qué hace en cada curso (aprobado por la dirección académica: todos
--  los cursos llevan quizzes, actividades y foros):
--   1. Nota mínima 70, 2 intentos y política 60/30/10.
--   2. Crea PUBLICADOS un quiz por unidad, las actividades con rúbrica y
--      los foros; si ya existían en borrador, los publica. No toca
--      preguntas de quizzes con intentos ni rúbricas o pesos de recursos
--      con entregas o notas.
--   3. Sin guías docentes: esas quedan en la versión privada.
--   4. Si el curso o alguna unidad no está en la base, lo salta con un
--      aviso: nunca detiene el arranque del servidor.
-- ============================================================

-- ════════════════════════════════════════════════════════════════
--  Curso de Farmacoterapia de la Diabetes
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfdm$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_act      BIGINT;
  v_foro     BIGINT;
  v_t1 TEXT; v_t2 TEXT; v_t3 TEXT; v_t4 TEXT; v_t5 TEXT; v_t6 TEXT; v_t7 TEXT;
  v_j1 JSONB; v_j2 JSONB;
  v_a1 TEXT[];
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacoterapia de la Diabetes' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos de la diabetes, diagnóstico y metas terapéuticas', 'Unidad 2. Metformina, iDPP-4, sulfonilureas y otros antidiabéticos orales', 'Unidad 3. iSGLT2, agonistas del receptor GLP-1 y tirzepatida', 'Unidad 4. Insulinoterapia, dispositivos e hipoglucemia', 'Unidad 5. Comorbilidad cardiorrenal, obesidad, seguimiento farmacoterapéutico y farmacovigilancia']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacoterapia de la Diabetes: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfdm_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfdm_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fdm-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la diabetes, diagnóstico y metas terapéuticas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la diabetes, diagnóstico y metas terapéuticas) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos de la diabetes, diagnóstico y metas terapéuticas';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 1, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 1, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := 'Una mujer de 52 años sin síntomas clásicos se hace exámenes de laboratorio. ¿Qué resultado confirma el diagnóstico de diabetes según la ADA?';
    v_t4 := 'La ADA diagnostica diabetes con HbA1c ≥6,5 %, glucosa en ayunas ≥126 mg/dL, glucosa ≥200 mg/dL a las 2 horas de una carga de 75 g o glucosa al azar ≥200 mg/dL con síntomas. Sin síntomas claros se necesitan dos resultados alterados. La glucometría capilar no es diagnóstica.';
    v_j1 := $evfdm_json${"external_id":"fdm-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Criterios diagnósticos de diabetes y prediabetes, y tamizaje","outcome":"Criterios diagnósticos de diabetes y prediabetes, y tamizaje","source":"ADA, Standards of Care in Diabetes 2026, sección 2."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Una glucometría capilar en ayunas de 168 mg/dL tomada en una jornada de salud de una droguería.', FALSE, 'La glucometría capilar no sirve para diagnosticar: se remite al laboratorio.', 0),
      (v_pregunta, 'Una HbA1c de 6,2 % con una glucosa plasmática en ayunas de 118 mg/dL en la misma muestra.', FALSE, 'Ambos valores están en el rango de prediabetes, no de diabetes.', 1),
      (v_pregunta, 'Una HbA1c de 7,1 % y una glucosa plasmática en ayunas de 139 mg/dL, ambas de laboratorio.', TRUE, 'Correcto. Sin síntomas se necesitan dos resultados alterados, en la misma muestra o en muestras distintas.', 2),
      (v_pregunta, 'Una glucosa plasmática al azar de 190 mg/dL tomada a media tarde, sin síntomas asociados.', FALSE, 'La glucosa al azar diagnostica con ≥200 mg/dL y síntomas clásicos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un hombre de 81 años con deterioro cognitivo leve, que vive solo, tuvo dos hipoglucemias que necesitaron ayuda de terceros. Su HbA1c es 6,4 % con glibenclamida e insulina NPH. ¿Qué meta y qué propuesta corresponden?';
    v_t4 := 'La ADA propone una HbA1c menor de 7 % si se logra sin hipoglucemia importante y una meta menos estricta (menor de 8 %) cuando hay hipoglucemias graves, expectativa de vida limitada o complicaciones avanzadas. En adultos mayores se prioriza evitar la hipoglucemia y se desintensifican los fármacos que la causan.';
    v_j1 := $evfdm_json${"external_id":"fdm-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Metas glucémicas individualizadas: HbA1c, tiempo en rango y metas de riesgo cardiovascular","outcome":"Metas glucémicas individualizadas: HbA1c, tiempo en rango y metas de riesgo cardiovascular","source":"ADA 2026, secciones 6 y 13."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Una meta menos estricta (HbA1c menor de 8 %) y proponer al médico desintensificar el tratamiento.', TRUE, 'Correcto. Las hipoglucemias graves y la fragilidad justifican una meta más flexible.', 0),
      (v_pregunta, 'Mantener la meta de HbA1c menor de 7 % y reforzar la dieta para que no vuelva a tener hipoglucemias.', FALSE, 'Mantener la meta estricta deja el riesgo de hipoglucemia sin resolver.', 1),
      (v_pregunta, 'Una meta más estricta (HbA1c menor de 6,5 %) porque ya la está logrando con el tratamiento actual.', FALSE, 'Lograrla con hipoglucemias graves no es un buen control.', 2),
      (v_pregunta, 'Suspender todos los antidiabéticos porque a su edad la glucosa alta ya no causa complicaciones.', FALSE, 'No se suspende todo: se ajusta la meta y se desintensifica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer de 58 años tuvo un infarto hace dos años. Su HbA1c es 7,8 %, su TFG 72 mL/min y toma metformina 850 mg cada 12 horas. ¿Qué análisis hace el QF al revisar la fórmula?';
    v_t4 := 'La ADA 2026 recomienda, en enfermedad cardiovascular aterosclerótica o alto riesgo, un agonista GLP-1 y/o un iSGLT2 con beneficio demostrado, independientemente de la HbA1c (9.7). La decisión empieza por las comorbilidades, no por la cifra de glucosa.';
    v_j1 := $evfdm_json${"external_id":"fdm-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Algoritmo de tratamiento de la DM2 según ADA 2026: selección por comorbilidad","outcome":"Algoritmo de tratamiento de la DM2 según ADA 2026: selección por comorbilidad","source":"ADA 2026, sección 9, recomendación 9.7."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Basta con subir la metformina a la dosis máxima, porque la HbA1c está cerca de la meta de 7 %.', FALSE, 'Subir la metformina no aporta el beneficio cardiovascular que ella necesita.', 0),
      (v_pregunta, 'Hay que iniciar insulina basal, porque la metformina sola ya no es suficiente en una cardiópata.', FALSE, 'No hay hiperglucemia grave que indique insulina.', 1),
      (v_pregunta, 'No hay nada que proponer mientras la HbA1c no supere el 8 %, que es su meta individual.', FALSE, 'La recomendación por comorbilidad no depende del valor de HbA1c.', 2),
      (v_pregunta, 'Por su enfermedad cardiovascular, conviene un agonista GLP-1 o un iSGLT2 con beneficio demostrado.', TRUE, 'Correcto. Se indica con independencia de la HbA1c (recomendación 9.7).', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En una droguería llega un joven de 24 años, delgado, con pérdida de peso reciente y cetonas positivas, con fórmula de glibenclamida. El auxiliar opina que «la sulfonilurea basta porque estimula la insulina». ¿Cuál es la valoración más acertada?';
    v_t4 := 'En la diabetes tipo 1 hay destrucción autoinmune de las células beta y déficit absoluto de insulina: la persona siempre necesita insulina. Juventud, delgadez, pérdida de peso y cetonas sugieren tipo 1. Las sulfonilureas estimulan la secreción de insulina y no sirven sin células beta funcionales.';
    v_j1 := $evfdm_json${"external_id":"fdm-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Fisiopatología y clasificación de la diabetes: tipo 1, tipo 2 y otros tipos","outcome":"Fisiopatología y clasificación de la diabetes: tipo 1, tipo 2 y otros tipos","source":"ADA 2026, sección 2."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: la glibenclamida es la opción de elección en adultos jóvenes con diabetes recién diagnosticada.', FALSE, 'Las sulfonilureas no sirven si no hay células beta que estimular.', 0),
      (v_pregunta, 'Es errada: el cuadro sugiere diabetes tipo 1, que siempre requiere insulina; se remite de inmediato.', TRUE, 'Correcto. Ningún antidiabético oral reemplaza la insulina en la tipo 1.', 1),
      (v_pregunta, 'Es correcta si se acompaña de metformina, porque juntas cubren la resistencia y la secreción.', FALSE, 'Agregar metformina no corrige el déficit absoluto de insulina.', 2),
      (v_pregunta, 'Es errada solo porque la glibenclamida debe tomarse con las comidas para no causar hipoglucemia.', FALSE, 'El problema no es el horario, sino el tipo de diabetes.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fdm-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Metformina, iDPP-4, sulfonilureas y otros antidiabéticos orales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Metformina, iDPP-4, sulfonilureas y otros antidiabéticos orales) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Metformina, iDPP-4, sulfonilureas y otros antidiabéticos orales';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 2, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 2, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Por qué los inhibidores de la DPP-4, usados solos, tienen bajo riesgo de hipoglucemia?';
    v_t4 := 'Los iDPP-4 bloquean la enzima que degrada GLP-1 y GIP. Las incretinas aumentan la secreción de insulina cuando la glucosa está alta y reducen el glucagón; como el efecto depende de la glucosa, solos tienen bajo riesgo de hipoglucemia.';
    v_j1 := $evfdm_json${"external_id":"fdm-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Inhibidores de la DPP-4: mecanismo, perfil de seguridad y uso en poblaciones especiales","outcome":"Inhibidores de la DPP-4: mecanismo, perfil de seguridad y uso en poblaciones especiales","source":"ADA 2026, sección 9; fichas técnicas de los iDPP-4."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque se eliminan casi por completo por vía biliar y no se acumulan aunque haya enfermedad renal.', FALSE, 'Solo la linagliptina se elimina sobre todo por vía biliar; eso no explica el bajo riesgo.', 0),
      (v_pregunta, 'Porque prolongan el efecto de las incretinas, que aumentan la insulina solo cuando la glucosa está alta.', TRUE, 'Correcto. El efecto depende de la glucosa.', 1),
      (v_pregunta, 'Porque bloquean la absorción intestinal de la glucosa y no actúan sobre la secreción de insulina.', FALSE, 'Ese no es su mecanismo: inhiben la enzima que degrada las incretinas.', 2),
      (v_pregunta, 'Porque reducen la producción hepática de glucosa sin modificar la acción de ninguna hormona.', FALSE, 'Ese es el mecanismo principal de la metformina.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una mujer de 70 años toma metformina 850 mg tres veces al día. En el control su TFG bajó a 41 mL/min. ¿Qué propone el QF según la ficha técnica?';
    v_t4 := 'Según la ficha técnica: TFG 60-89, máximo 3.000 mg/día; 45-59, máximo 2.000 mg/día; 30-44, máximo 1.000 mg/día; menor de 30, contraindicada. La ADA coincide en reducir con TFG menor de 45 y suspender con TFG menor de 30. La TFG se vigila cada 3-6 meses si hay más riesgo.';
    v_j1 := $evfdm_json${"external_id":"fdm-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Metformina: mecanismo, indicaciones, dosificación y ajuste por función renal","outcome":"Metformina: mecanismo, indicaciones, dosificación y ajuste por función renal","source":"Ficha técnica de metformina; ADA 2026, sección 9."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Mantener la dosis, porque la metformina solo se ajusta cuando la TFG baja de 30 mL/min.', FALSE, 'Con TFG de 30 a 44 ya hay un máximo diario más bajo.', 0),
      (v_pregunta, 'Suspender la metformina de inmediato, porque está contraindicada con TFG menor de 45 mL/min.', FALSE, 'La contraindicación es con TFG menor de 30; entre 30 y 44 se reduce.', 1),
      (v_pregunta, 'Subir la dosis a 1.000 mg tres veces al día para compensar la menor eficacia por la función renal.', FALSE, 'Subir la dosis aumenta el riesgo de acumulación.', 2),
      (v_pregunta, 'Reducir a un máximo de 1.000 mg al día, por ejemplo 500 mg cada 12 horas, y repetir la TFG en 3 meses.', TRUE, 'Correcto. Recibe 2.550 mg y el máximo para TFG 30-44 es 1.000 mg/día.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'A un paciente que toma metformina le programan una tomografía con contraste yodado. Tiene TFG estable de 58 mL/min. ¿Qué plan es el correcto?';
    v_t4 := 'La ficha técnica indica suspender la metformina antes o en el momento del estudio con contraste yodado y no reanudarla hasta al menos 48 horas después, con la función renal estable. Lo mismo aplica en cirugía con anestesia general, espinal o epidural.';
    v_j1 := $evfdm_json${"external_id":"fdm-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Seguridad de la metformina: efectos digestivos, vitamina B12, acidosis láctica, contraste y cirugía","outcome":"Seguridad de la metformina: efectos digestivos, vitamina B12, acidosis láctica, contraste y cirugía","source":"Ficha técnica de metformina."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Suspenderla antes del estudio o en ese momento y reanudarla al menos 48 horas después con la función renal estable.', TRUE, 'Correcto. Es lo que indica la ficha técnica.', 0),
      (v_pregunta, 'Continuarla sin cambios, porque el contraste solo afecta a pacientes con TFG menor de 30 mL/min.', FALSE, 'La ficha técnica pide suspenderla con el contraste yodado.', 1),
      (v_pregunta, 'Suspenderla una semana antes y reanudarla solo cuando el médico ordene una nueva HbA1c.', FALSE, 'El plazo y la condición para reanudar no son esos.', 2),
      (v_pregunta, 'Duplicar la dosis el día anterior para compensar los días en que estará suspendida.', FALSE, 'Nunca se compensa duplicando la dosis.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'A un paciente con sitagliptina/metformina le acaban de formular semaglutida semanal. El médico propone mantener todo. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'La ADA 2026 recomienda no combinar un iDPP-4 con un agonista GLP-1 ni con tirzepatida, porque actúan sobre la misma vía y no suman beneficio (9.18). La metformina puede continuar si no está contraindicada.';
    v_j1 := $evfdm_json${"external_id":"fdm-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Inhibidores de la DPP-4: mecanismo, perfil de seguridad y uso en poblaciones especiales","outcome":"Inhibidores de la DPP-4: mecanismo, perfil de seguridad y uso en poblaciones especiales","source":"ADA 2026, sección 9, recomendación 9.18."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuado mantener los tres, porque cada fármaco actúa por un mecanismo completamente distinto.', FALSE, 'La sitagliptina y la semaglutida actúan sobre la misma vía incretina.', 0),
      (v_pregunta, 'Conviene suspender la metformina, porque no se combina con agonistas GLP-1 por riesgo digestivo.', FALSE, 'La metformina puede continuar; lo que no se combina es el iDPP-4.', 1),
      (v_pregunta, 'Conviene suspender la sitagliptina y continuar la metformina, porque iDPP-4 y agonista GLP-1 no suman beneficio.', TRUE, 'Correcto. Es la recomendación 9.18 de ADA 2026.', 2),
      (v_pregunta, 'Conviene cambiar la semaglutida por insulina basal, porque no puede usarse con antidiabéticos orales.', FALSE, 'La semaglutida sí se combina con otros antidiabéticos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fdm-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. iSGLT2, agonistas del receptor GLP-1 y tirzepatida' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. iSGLT2, agonistas del receptor GLP-1 y tirzepatida) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · iSGLT2, agonistas del receptor GLP-1 y tirzepatida';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 3, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 3, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Cómo bajan la glucosa los inhibidores del SGLT2, como la dapagliflozina?';
    v_t4 := 'El SGLT2 reabsorbe la mayor parte de la glucosa filtrada en el túbulo proximal. Los iSGLT2 lo bloquean y se elimina glucosa por la orina. También producen un efecto diurético leve y reducen la presión intraglomerular, lo que explica parte de su protección renal.';
    v_j1 := $evfdm_json${"external_id":"fdm-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"iSGLT2: mecanismo, indicaciones y beneficios en insuficiencia cardiaca y enfermedad renal","outcome":"iSGLT2: mecanismo, indicaciones y beneficios en insuficiencia cardiaca y enfermedad renal","source":"Ficha técnica de dapagliflozina; ADA 2026, sección 9."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Aumentan la secreción de insulina solo cuando la glucosa está alta, imitando a las incretinas.', FALSE, 'Ese es el mecanismo de los agonistas GLP-1.', 0),
      (v_pregunta, 'Reducen la producción de glucosa en el hígado y mejoran la sensibilidad a la insulina.', FALSE, 'Ese es el mecanismo de la metformina.', 1),
      (v_pregunta, 'Retrasan la absorción intestinal de los carbohidratos que se consumen en cada comida.', FALSE, 'No actúan en el intestino.', 2),
      (v_pregunta, 'Bloquean la reabsorción de glucosa en el túbulo proximal, que se elimina por la orina.', TRUE, 'Correcto. Además tienen un leve efecto diurético y natriurético.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente con semaglutida subcutánea semanal recuerda el jueves que no se aplicó la dosis del lunes. ¿Qué le indica el QF según la ficha técnica?';
    v_t4 := 'Según la ficha técnica de semaglutida subcutánea semanal, si se olvida una dosis se aplica lo antes posible si han pasado 5 días o menos; si no, se omite y se continúa el día habitual. Se aplica cualquier día y a cualquier hora, con o sin comidas.';
    v_j1 := $evfdm_json${"external_id":"fdm-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Semaglutida subcutánea y oral: dosificación, evidencia cardiorrenal y seguridad","outcome":"Semaglutida subcutánea y oral: dosificación, evidencia cardiorrenal y seguridad","source":"Ficha técnica de semaglutida subcutánea."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que espere al próximo lunes y se aplique dos dosis juntas para recuperar la que olvidó.', FALSE, 'Nunca se duplica la dosis.', 0),
      (v_pregunta, 'Que suspenda el tratamiento y reinicie la titulación desde 0,25 mg la semana siguiente.', FALSE, 'Un olvido aislado no obliga a reiniciar la titulación.', 1),
      (v_pregunta, 'Que se la aplique ese mismo día, porque han pasado 5 días o menos desde la dosis olvidada.', TRUE, 'Correcto. Si pasaron más de 5 días, se omite.', 2),
      (v_pregunta, 'Que la omita siempre, porque la semaglutida solo puede aplicarse el mismo día de la semana.', FALSE, 'Puede aplicarse cualquier día; el límite es de 5 días.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con dapagliflozina consulta por náuseas, vómito, dolor abdominal y cansancio desde ayer. Su glucometría marca 210 mg/dL y él cree que «no es nada porque el azúcar no está tan alto». ¿Qué análisis es correcto?';
    v_t4 := 'La ficha técnica de dapagliflozina advierte que la cetoacidosis es rara, puede ser mortal y presentarse con glucosa solo moderadamente elevada (cetoacidosis euglucémica). Ante náuseas, vómito, dolor abdominal o cansancio inusual se evalúa de inmediato y se suspende si se sospecha.';
    v_j1 := $evfdm_json${"external_id":"fdm-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Seguridad de los iSGLT2: cetoacidosis euglucémica, depleción de volumen, infecciones y reglas de días de enfermedad","outcome":"Seguridad de los iSGLT2: cetoacidosis euglucémica, depleción de volumen, infecciones y reglas de días de enfermedad","source":"Ficha técnica de dapagliflozina; ADA 2026, sección 9."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una intolerancia digestiva leve y puede seguir con el medicamento, tomándolo con las comidas.', FALSE, 'Esos síntomas con un iSGLT2 no se tratan como intolerancia.', 0),
      (v_pregunta, 'Puede ser una cetoacidosis euglucémica: se evalúa de inmediato aunque la glucosa no esté muy alta y se suspende.', TRUE, 'Correcto. La CAD con iSGLT2 puede presentarse con glucosa menor de 250 mg/dL.', 1),
      (v_pregunta, 'Es una hipoglucemia de rebote y debe tomar 15 g de azúcar y medir de nuevo en 15 minutos.', FALSE, 'La glucosa de 210 mg/dL descarta hipoglucemia.', 2),
      (v_pregunta, 'Es una infección urinaria por la glucosuria y se resuelve con abundante líquido y aseo genital.', FALSE, 'Los síntomas no corresponden a una infección urinaria.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un hombre de 64 años con diabetes tipo 2 e insuficiencia cardiaca con fracción de eyección reducida tiene HbA1c de 6,9 %. ¿Cuál de estas propuestas es la mejor?';
    v_t4 := 'La ADA 2026 recomienda un iSGLT2 en toda persona con diabetes e insuficiencia cardiaca, independientemente de la HbA1c (9.8). La pioglitazona se evita en insuficiencia cardiaca por la retención de líquidos y la saxagliptina se asoció con más hospitalizaciones por esa causa.';
    v_j1 := $evfdm_json${"external_id":"fdm-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Cómo elegir entre iSGLT2, agonista GLP-1 y tirzepatida según el perfil del paciente","outcome":"Cómo elegir entre iSGLT2, agonista GLP-1 y tirzepatida según el perfil del paciente","source":"ADA 2026, sección 9, recomendación 9.8."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Iniciar un iSGLT2 aunque la HbA1c esté en meta, por el beneficio en insuficiencia cardiaca.', TRUE, 'Correcto. Es la recomendación 9.8 de ADA 2026.', 0),
      (v_pregunta, 'No agregar nada, porque la HbA1c ya está por debajo de 7 % y no hay indicación de intensificar.', FALSE, 'La indicación por insuficiencia cardiaca no depende de la HbA1c.', 1),
      (v_pregunta, 'Agregar pioglitazona, porque mejora la sensibilidad a la insulina sin causar hipoglucemia.', FALSE, 'La pioglitazona retiene líquidos y se evita en insuficiencia cardiaca.', 2),
      (v_pregunta, 'Agregar saxagliptina, porque tiene bajo riesgo de hipoglucemia y se toma una vez al día.', FALSE, 'La saxagliptina se asoció con más hospitalizaciones por insuficiencia cardiaca.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fdm-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Insulinoterapia, dispositivos e hipoglucemia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Insulinoterapia, dispositivos e hipoglucemia) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Insulinoterapia, dispositivos e hipoglucemia';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 4, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 4, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Qué diferencia práctica tiene la insulina NPH frente a los análogos basales como la glargina?';
    v_t4 := 'La NPH es una insulina intermedia con pico varias horas después de aplicarla, lo que aumenta el riesgo de hipoglucemia nocturna; suele aplicarse dos veces al día. Los análogos basales (glargina, detemir, degludec) tienen un efecto más estable y producen menos hipoglucemia nocturna.';
    v_j1 := $evfdm_json${"external_id":"fdm-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Tipos de insulina y perfiles de acción: rápidas, regular, NPH, basales y premezcladas","outcome":"Tipos de insulina y perfiles de acción: rápidas, regular, NPH, basales y premezcladas","source":"ADA 2026, sección 9; fichas técnicas de las insulinas."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La NPH tiene un pico de acción varias horas después de aplicarla y produce más hipoglucemia nocturna.', TRUE, 'Correcto. Los análogos basales tienen un efecto más estable, sin pico marcado.', 0),
      (v_pregunta, 'La NPH empieza a actuar en pocos minutos y por eso se aplica justo antes de cada comida.', FALSE, 'Esa descripción corresponde a los análogos de acción rápida.', 1),
      (v_pregunta, 'La NPH dura más de 42 horas y permite aplicarla cada dos días sin perder el efecto basal.', FALSE, 'La NPH es de acción intermedia y suele aplicarse dos veces al día.', 2),
      (v_pregunta, 'La NPH es la insulina que se usa por vía intravenosa en el hospital para corregir la glucosa.', FALSE, 'La de uso intravenoso es la insulina regular.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente de 80 kg inició glargina 10 UI en la noche. Su meta acordada en ayunas es 80-130 mg/dL. Los últimos tres días amaneció con 165, 172 y 160 mg/dL, sin hipoglucemias. ¿Qué indica el plan de titulación?';
    v_t4 := 'El algoritmo de la ADA para la insulina basal: iniciar con 10 UI/día o 0,1-0,2 UI/kg/día, acordar una meta en ayunas y subir, por ejemplo, 2 UI cada 3 días hasta alcanzarla sin hipoglucemia. Si hay hipoglucemia sin causa clara, reducir 10-20 %.';
    v_j1 := $evfdm_json${"external_id":"fdm-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Inicio y titulación de insulina basal en DM2 y combinación con agonistas GLP-1","outcome":"Inicio y titulación de insulina basal en DM2 y combinación con agonistas GLP-1","source":"ADA 2026, sección 9."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Reducir la glargina 10-20 %, porque las glucosas altas en ayunas sugieren un efecto rebote.', FALSE, 'Se reduce si hay hipoglucemia sin causa clara, no con glucosas altas.', 0),
      (v_pregunta, 'Subir la glargina 2 UI y volver a evaluar en 3 días con las glucometrías en ayunas.', TRUE, 'Correcto. Es el esquema de titulación de la ADA.', 1),
      (v_pregunta, 'Agregar insulina rápida antes de cada comida, porque la basal ya no es suficiente.', FALSE, 'Con 10 UI aún no hay sobrebasalización: primero se titula la basal.', 2),
      (v_pregunta, 'Mantener la dosis tres meses y decidir según la HbA1c, que es el único parámetro válido.', FALSE, 'La titulación se guía por la glucosa en ayunas, no solo por la HbA1c.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer con diabetes tipo 1 trae su reporte AGP de 14 días: sensor activo 92 %, tiempo en rango 58 %, tiempo bajo 70 mg/dL 7 % (casi todo entre las 2 y las 5 a. m.) y picos después del almuerzo. ¿Qué analiza primero el QF?';
    v_t4 := 'Para leer el AGP se revisa primero la hipoglucemia (meta: menos de 4 % bajo 70 mg/dL y menos de 1 % bajo 54 mg/dL), luego el tiempo en rango (más de 70 %) y después los patrones por horario. La hipoglucemia nocturna sugiere exceso de basal. El reporte es confiable con el sensor activo al menos el 70 % del tiempo.';
    v_j1 := $evfdm_json${"external_id":"fdm-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Monitoreo continuo de glucosa y glucometría: interpretación del reporte AGP","outcome":"Monitoreo continuo de glucosa y glucometría: interpretación del reporte AGP","source":"ADA 2026, secciones 6 y 7."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Los picos después del almuerzo, porque son la causa principal de que el tiempo en rango sea bajo.', FALSE, 'Los picos importan, pero la seguridad va primero.', 0),
      (v_pregunta, 'El tiempo en rango, porque es el único indicador que el médico usa para ajustar el tratamiento.', FALSE, 'El AGP se lee empezando por la hipoglucemia.', 1),
      (v_pregunta, 'La hipoglucemia nocturna, que supera la meta de 4 % y sugiere exceso de insulina basal.', TRUE, 'Correcto. Se revisa primero la seguridad y luego el tiempo en rango y los patrones.', 2),
      (v_pregunta, 'El tiempo de uso del sensor, porque con 92 % los datos no son confiables para analizar.', FALSE, 'El AGP es confiable con al menos 70 % de uso del sensor.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'La hija de un paciente con insulina pregunta qué hacer si lo encuentra inconsciente. Un familiar sugiere «ponerle azúcar en la boca». ¿Cuál es la indicación más acertada?';
    v_t4 := 'En la persona inconsciente no se da nada por la boca por riesgo de aspiración: se usa glucagón si está disponible y se busca atención urgente. La ADA indica formular glucagón a toda persona con riesgo de hipoglucemia nivel 2 o 3 y entrenar a familiares o cuidadores en su uso.';
    v_j1 := $evfdm_json${"external_id":"fdm-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Hipoglucemia: clasificación, regla de los 15, glucagón y prevención","outcome":"Hipoglucemia: clasificación, regla de los 15, glucagón y prevención","source":"ADA 2026, sección 6."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Darle jugo o gaseosa en pequeños sorbos y medir la glucosa en 15 minutos, como en la regla de los 15.', FALSE, 'La regla de los 15 es para la persona consciente que puede tragar.', 0),
      (v_pregunta, 'Aplicarle una dosis extra de insulina rápida, porque la pérdida de conciencia suele ser por glucosa alta.', FALSE, 'Puede ser una hipoglucemia grave: la insulina la empeoraría.', 1),
      (v_pregunta, 'Esperar a que despierte para darle algo de comer y luego medir la glucosa con el glucómetro.', FALSE, 'Esperar retrasa el tratamiento de una hipoglucemia grave.', 2),
      (v_pregunta, 'No darle nada por la boca, usar glucagón si lo tienen y buscar atención urgente.', TRUE, 'Correcto. La ADA indica formular glucagón y entrenar a la familia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fdm-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Comorbilidad cardiorrenal, obesidad, seguimiento farmacoterapéutico y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Comorbilidad cardiorrenal, obesidad, seguimiento farmacoterapéutico y farmacovigilancia) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Comorbilidad cardiorrenal, obesidad, seguimiento farmacoterapéutico y farmacovigilancia';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 5, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 5, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Cómo se tamiza la enfermedad renal crónica en una persona con diabetes según la ADA?';
    v_t4 := 'La ADA recomienda medir al menos una vez al año la TFG y la relación albúmina/creatinina en orina (RAC). La ERC se confirma si las alteraciones persisten más de 3 meses. RAC de 30-299 mg/g es albuminuria moderada; de 300 mg/g o más, grave.';
    v_j1 := $evfdm_json${"external_id":"fdm-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Enfermedad renal crónica y diabetes: tamizaje, nefroprotección y ajuste de antidiabéticos","outcome":"Enfermedad renal crónica y diabetes: tamizaje, nefroprotección y ajuste de antidiabéticos","source":"ADA 2026, sección 11."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Con una creatinina sérica cada cinco años, porque la ERC por diabetes avanza muy lento.', FALSE, 'El tamizaje es anual y usa dos pruebas.', 0),
      (v_pregunta, 'Con una ecografía renal anual, que permite ver el daño antes de que cambien los exámenes.', FALSE, 'La ecografía no es la prueba de tamizaje.', 1),
      (v_pregunta, 'Con la TFG y la relación albúmina/creatinina al menos una vez al año, confirmando si persisten más de 3 meses.', TRUE, 'Correcto. Así se tamiza y se confirma la ERC.', 2),
      (v_pregunta, 'Con un uroanálisis de rutina, porque la glucosuria indica daño renal en la persona con diabetes.', FALSE, 'La glucosuria no indica daño renal.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente compró por redes una «semaglutida + B12» para bajar de peso y tiene náuseas y dolor abdominal. Tras remitirlo a urgencias, ¿qué hace el QF para la farmacovigilancia?';
    v_t4 := 'El Programa Nacional de Farmacovigilancia del INVIMA recibe reportes de sospechas de reacciones adversas y de problemas de calidad, incluidos productos falsificados o fraudulentos. La alerta INVIMA 090-2024 advirtió sobre la comercialización fraudulenta de «semaglutida + B12». Se conserva el empaque y se reporta con todos los datos.';
    v_j1 := $evfdm_json${"external_id":"fdm-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Farmacovigilancia de antidiabéticos: alertas recientes, productos falsificados y reporte al INVIMA","outcome":"Farmacovigilancia de antidiabéticos: alertas recientes, productos falsificados y reporte al INVIMA","source":"INVIMA, Programa Nacional de Farmacovigilancia; alerta 090-2024."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Le pide que bote el producto para que no lo vuelva a usar y anota el caso en el kárdex de la droguería.', FALSE, 'Botar el producto pierde la evidencia para el reporte.', 0),
      (v_pregunta, 'Llama al vendedor de la red social para pedir el registro sanitario antes de reportar nada.', FALSE, 'El reporte no depende de la respuesta del vendedor.', 1),
      (v_pregunta, 'Espera a conocer el diagnóstico de urgencias para decidir si el caso merece un reporte.', FALSE, 'Se reporta la sospecha; no se espera la confirmación.', 2),
      (v_pregunta, 'Conserva el empaque y reporta en eReporting con lote, fechas, síntomas y lugar de compra.', TRUE, 'Correcto. El producto coincide con la alerta INVIMA 090-2024.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En el seguimiento farmacoterapéutico, una paciente de 78 años con HbA1c 6,3 % y glibenclamida refiere sudoración y temblor a media mañana. ¿Cómo se clasifica el problema?';
    v_t4 := 'En el seguimiento farmacoterapéutico (método Dáder) los resultados negativos asociados a la medicación se clasifican en necesidad, efectividad y seguridad. Una hipoglucemia por una sulfonilurea en una adulta mayor con HbA1c baja es un problema de seguridad; la intervención es desintensificar.';
    v_j1 := $evfdm_json${"external_id":"fdm-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Seguimiento farmacoterapéutico de la persona con diabetes en el servicio farmacéutico colombiano","outcome":"Seguimiento farmacoterapéutico de la persona con diabetes en el servicio farmacéutico colombiano","source":"Resolución 1403 de 2007; método Dáder; ADA 2026, sección 13."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Como un resultado negativo de seguridad, asociado a una dosis excesiva para su meta y su edad.', TRUE, 'Correcto. El fármaco causa un daño: la hipoglucemia.', 0),
      (v_pregunta, 'Como un resultado negativo de efectividad, porque la glucosa no está controlada.', FALSE, 'La glucosa está por debajo de lo necesario; no hay falta de efecto.', 1),
      (v_pregunta, 'Como un resultado negativo de necesidad, porque la paciente necesita un medicamento adicional.', FALSE, 'No le falta un medicamento: le sobra efecto.', 2),
      (v_pregunta, 'Como un problema sin relación con los medicamentos, propio de la ansiedad del adulto mayor.', FALSE, 'Los síntomas son compatibles con hipoglucemia por sulfonilurea.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una persona de 26 años sin diabetes, con IMC de 24 kg/m², pide en la farmacia tirzepatida «para bajar unos kilos antes de un viaje». ¿Cuál es la respuesta más acertada del QF?';
    v_t4 := 'Según la ficha técnica, la tirzepatida para control del peso se indica con IMC ≥30 kg/m², o ≥27 con al menos una comorbilidad. La alerta INVIMA 95-2026 advirtió sobre tirzepatida 20 mg/mL sin registro sanitario promocionada para uso estético y recordó los casos de pancreatitis aguda.';
    v_j1 := $evfdm_json${"external_id":"fdm-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Obesidad y diabetes tipo 2: tratamiento farmacológico del peso y uso responsable","outcome":"Obesidad y diabetes tipo 2: tratamiento farmacológico del peso y uso responsable","source":"Ficha técnica de tirzepatida; alerta INVIMA 95-2026."}$evfdm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdm-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Dispensarla si trae fórmula, porque la tirzepatida es segura en cualquier persona que quiera bajar de peso.', FALSE, 'No cumple la indicación de control del peso de la ficha técnica.', 0),
      (v_pregunta, 'Explicar que no tiene indicación con ese IMC y advertir sobre productos sin registro para uso estético.', TRUE, 'Correcto. Y existe una alerta del INVIMA sobre ese uso.', 1),
      (v_pregunta, 'Recomendar liraglutida en lugar de tirzepatida, porque produce menos efectos digestivos.', FALSE, 'Tampoco tiene indicación con ese IMC.', 2),
      (v_pregunta, 'Sugerirle comprarla por internet, donde la presentación de 20 mg/mL es más económica.', FALSE, 'Esa presentación sin registro fue objeto de alerta del INVIMA.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fdm-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la diabetes, diagnóstico y metas terapéuticas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la diabetes, diagnóstico y metas terapéuticas) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Evaluación inicial de una persona con diabetes tipo 2 recién diagnosticada';
  v_t2 := $evfdm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Verifica que los datos confirman el diagnóstico y define la meta de HbA1c con su justificación.</li><li>Identifica las comorbilidades y los factores de riesgo presentes y qué falta confirmar (por ejemplo, la albuminuria en una segunda muestra).</li><li>Revisa la metformina: indicación, dosis de inicio, titulación, función renal y educación.</li><li>Según ADA 2026, explica qué fármaco con beneficio demostrado propondrías considerar si se confirma la enfermedad renal y por qué.</li><li>Analiza el producto natural: qué preguntarías, qué riesgos tiene y qué harías si no tiene registro sanitario.</li><li>Redacta la nota al médico en formato SOAP con tus propuestas (glucosa, presión, lípidos, tabaco).</li><li>Escribe tres mensajes educativos para Don Efraín, en lenguaje sencillo, que respondan a su temor a la insulina.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Verificar el diagnóstico y acordar una meta individual.</li><li>Identificar comorbilidades que cambian la elección del tratamiento según ADA 2026.</li><li>Proponer intervenciones documentadas al paciente y al médico.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Diagnóstico y meta</td><td>20 %</td><td>Confirma el diagnóstico con dos criterios y justifica una meta individual coherente.</td><td>Diagnóstico y meta correctos con justificación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comorbilidades y ADA 2026</td><td>25 %</td><td>Identifica la posible ERC, el riesgo cardiovascular y el tabaco, y propone un iSGLT2 o agonista GLP-1 con beneficio demostrado si se confirma la ERC.</td><td>Identifica lo principal sin relacionarlo del todo con la elección del fármaco.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Revisión de la metformina</td><td>20 %</td><td>Dosis, titulación, función renal y educación correctas según la ficha técnica.</td><td>Revisión correcta con alguna omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Producto natural y nota SOAP</td><td>25 %</td><td>Indaga el producto, reconoce el riesgo de productos sin registro y redacta una nota SOAP clara con propuestas priorizadas.</td><td>Nota correcta pero poco priorizada o sin abordar el producto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfdm_html$;
  v_t3 := $evfdm_html$<h2>Caso de estudio</h2>
<p>Don Efraín tiene 52 años, es vendedor en Cúcuta y acaba de recibir el diagnóstico de diabetes tipo 2 (datos simulados). Fuma 10 cigarrillos al día, su IMC es 32 kg/m² y su presión es 142/88 mmHg. Exámenes: HbA1c 8,1 %, glucosa en ayunas 168 mg/dL, TFG 81 mL/min, relación albúmina/creatinina 62 mg/g (primera muestra), LDL 148 mg/dL. Sin enfermedad cardiovascular conocida. El médico le formula metformina 850 mg cada 12 horas. Él dice que «no quiere terminar en insulina» y que toma un producto natural «para el azúcar» comprado en la plaza.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfdm_html$;
  v_t4 := 'Informe de evaluación inicial con nota SOAP al médico y mensajes educativos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfdm_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Standards of Care in Diabetes 2026 de la ADA (secciones 2, 6, 7, 8, 9, 10, 11 y 13); fichas técnicas e insertos aprobados por el INVIMA de metformina, dapagliflozina, liraglutida, semaglutida y tirzepatida; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y sus alertas sanitarias. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfdm_html$;
  v_t7 := NULL;
  v_j1 := $evfdm_json$["Diagnóstico y meta individual.","Comorbilidades y datos que faltan confirmar.","Revisión de la metformina.","Propuesta de nefroprotección según ADA 2026.","Producto natural y nota SOAP."]$evfdm_json$::jsonb;
  v_j2 := $evfdm_json${"version":1,"total":100,"criteria":[{"id":"diagnostico-y-meta","name":"Diagnóstico y meta","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Confirma el diagnóstico con dos criterios y justifica una meta individual coherente."},{"level":3,"label":"Logrado","description":"Diagnóstico y meta correctos con justificación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comorbilidades-y-ada-2026","name":"Comorbilidades y ADA 2026","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica la posible ERC, el riesgo cardiovascular y el tabaco, y propone un iSGLT2 o agonista GLP-1 con beneficio demostrado si se confirma la ERC."},{"level":3,"label":"Logrado","description":"Identifica lo principal sin relacionarlo del todo con la elección del fármaco."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"revision-de-la-metformina","name":"Revisión de la metformina","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Dosis, titulación, función renal y educación correctas según la ficha técnica."},{"level":3,"label":"Logrado","description":"Revisión correcta con alguna omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"producto-natural-y-nota-soap","name":"Producto natural y nota SOAP","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Indaga el producto, reconoce el riesgo de productos sin registro y redacta una nota SOAP clara con propuestas priorizadas."},{"level":3,"label":"Logrado","description":"Nota correcta pero poco priorizada o sin abordar el producto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfdm_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 1, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 1, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fdm-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Metformina, iDPP-4, sulfonilureas y otros antidiabéticos orales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Metformina, iDPP-4, sulfonilureas y otros antidiabéticos orales) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Revisión de la medicación de un adulto mayor con enfermedad renal';
  v_t2 := $evfdm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Calcula la dosis diaria actual de metformina y compárala con el máximo para su TFG.</li><li>Analiza los episodios matutinos: qué fármaco los explica y qué propones.</li><li>Define una meta individual de HbA1c para Doña Teresa y justifícala.</li><li>Analiza la anemia y el hormigueo: qué relación pueden tener con la metformina y qué examen propones.</li><li>Identifica el riesgo renal del naproxeno con enalapril y metformina y sugiere alternativas.</li><li>Según ADA 2026, propone la protección cardiorrenal que corresponde a su ERC con albuminuria.</li><li>Redacta una nota al médico con las recomendaciones priorizadas y un plan de seguimiento.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Ajustar la metformina a la función renal según la ficha técnica.</li><li>Identificar problemas de seguridad de los antidiabéticos orales en el adulto mayor.</li><li>Priorizar y comunicar recomendaciones al médico.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Ajuste renal de la metformina</td><td>25 %</td><td>Calcula 2.550 mg/día, identifica el máximo de 1.000 mg/día para TFG 30-44 y propone dosis y vigilancia.</td><td>Identifica el exceso de dosis sin plan de vigilancia.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Seguridad de los orales</td><td>25 %</td><td>Relaciona los episodios con la glibenclamida, propone suspenderla o reducirla y aborda la B12 y el AINE.</td><td>Aborda la glibenclamida pero omite la B12 o el AINE.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Meta y protección cardiorrenal</td><td>25 %</td><td>Meta individual flexible y propuesta de iSGLT2 o agonista GLP-1 con beneficio demostrado, con criterios de uso.</td><td>Propuesta correcta con justificación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Nota al médico</td><td>15 %</td><td>Recomendaciones priorizadas, claras y con seguimiento.</td><td>Nota correcta pero sin priorizar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfdm_html$;
  v_t3 := $evfdm_html$<h2>Caso de estudio</h2>
<p>Doña Teresa tiene 77 años, vive en Duitama y tiene diabetes tipo 2 desde hace 16 años e hipertensión (datos simulados). Toma metformina 850 mg cada 8 horas, glibenclamida 5 mg cada 12 horas, enalapril 20 mg cada 12 horas y naproxeno a necesidad por artrosis. Exámenes: HbA1c 6,5 %, TFG 36 mL/min, relación albúmina/creatinina 150 mg/g, hemoglobina 11,0 g/dL con volumen corpuscular alto. Refiere temblor y sudoración algunas mañanas y hormigueo en los pies. Lleva 10 años con metformina.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfdm_html$;
  v_t4 := 'Revisión de la medicación con nota al médico y plan de seguimiento.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfdm_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Standards of Care in Diabetes 2026 de la ADA (secciones 2, 6, 7, 8, 9, 10, 11 y 13); fichas técnicas e insertos aprobados por el INVIMA de metformina, dapagliflozina, liraglutida, semaglutida y tirzepatida; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y sus alertas sanitarias. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfdm_html$;
  v_t7 := NULL;
  v_j1 := $evfdm_json$["Ajuste de la metformina.","Hipoglucemia y glibenclamida.","Meta individual.","Vitamina B12 y AINE.","Protección cardiorrenal y nota priorizada."]$evfdm_json$::jsonb;
  v_j2 := $evfdm_json${"version":1,"total":100,"criteria":[{"id":"ajuste-renal-de-la-metformina","name":"Ajuste renal de la metformina","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Calcula 2.550 mg/día, identifica el máximo de 1.000 mg/día para TFG 30-44 y propone dosis y vigilancia."},{"level":3,"label":"Logrado","description":"Identifica el exceso de dosis sin plan de vigilancia."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguridad-de-los-orales","name":"Seguridad de los orales","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Relaciona los episodios con la glibenclamida, propone suspenderla o reducirla y aborda la B12 y el AINE."},{"level":3,"label":"Logrado","description":"Aborda la glibenclamida pero omite la B12 o el AINE."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"meta-y-proteccion-cardiorrenal","name":"Meta y protección cardiorrenal","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Meta individual flexible y propuesta de iSGLT2 o agonista GLP-1 con beneficio demostrado, con criterios de uso."},{"level":3,"label":"Logrado","description":"Propuesta correcta con justificación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"nota-al-medico","name":"Nota al médico","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Recomendaciones priorizadas, claras y con seguimiento."},{"level":3,"label":"Logrado","description":"Nota correcta pero sin priorizar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfdm_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 2, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 2, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fdm-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Insulinoterapia, dispositivos e hipoglucemia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Insulinoterapia, dispositivos e hipoglucemia) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Plan de inicio de insulina basal y educación';
  v_t2 := $evfdm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Verifica la indicación de insulina con los criterios de ADA 2026.</li><li>Propone la dosis inicial (calcula el rango por peso) y el esquema de titulación con su meta en ayunas.</li><li>Decide qué hacer con la glimepirida y con la metformina y justifícalo.</li><li>Diseña la educación en técnica con pluma, rotación de sitios y desecho de agujas.</li><li>Explica la conservación de la pluma en uso y sin abrir, considerando que trabaja en un taxi.</li><li>Prepara un plan de hipoglucemia: síntomas, regla de los 15, qué hacer si está manejando y papel de la esposa.</li><li>Define el plan de seguimiento y cuándo valorar un agonista GLP-1 para reducir la insulina.</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Proponer la dosis inicial y el plan de titulación de una insulina basal.</li><li>Ajustar los antidiabéticos orales por riesgo de hipoglucemia.</li><li>Diseñar la educación en técnica, conservación e hipoglucemia.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Indicación, dosis y titulación</td><td>25 %</td><td>Indicación correcta, dosis de 10 UI o 0,1-0,2 UI/kg (8-16 UI) y titulación de 2 UI cada 3 días con meta y regla de reducción.</td><td>Dosis y titulación correctas sin regla de reducción.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Ajuste de los orales</td><td>20 %</td><td>Propone suspender o reducir la glimepirida y continuar la metformina, con justificación.</td><td>Ajuste correcto con justificación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Técnica y conservación</td><td>20 %</td><td>Técnica completa, rotación, desecho y conservación adaptada a su trabajo, remitiendo al inserto.</td><td>Técnica correcta con omisiones en la conservación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Hipoglucemia y seguimiento</td><td>25 %</td><td>Plan claro de hipoglucemia, incluida la conducción, y seguimiento con valoración del agonista GLP-1.</td><td>Plan correcto sin el riesgo al conducir o sin seguimiento.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfdm_html$;
  v_t3 := $evfdm_html$<h2>Caso de estudio</h2>
<p>Don Ramiro tiene 61 años, es conductor de taxi en Ibagué y tiene diabetes tipo 2 hace 11 años (datos simulados). Toma metformina 1.000 mg cada 12 horas y glimepirida 4 mg al día. Refiere sed, orina frecuente y pérdida de 4 kg en dos meses. HbA1c 10,6 %, glucosa en ayunas 276 mg/dL, TFG 70 mL/min, peso 78 kg. El médico inicia insulina glargina en pluma y quiere un plan del servicio farmacéutico. Don Ramiro vive con su esposa, no tiene nevera en el taxi y le preocupa tener una hipoglucemia manejando.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfdm_html$;
  v_t4 := 'Plan de inicio de insulina con material educativo y seguimiento.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfdm_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Standards of Care in Diabetes 2026 de la ADA (secciones 2, 6, 7, 8, 9, 10, 11 y 13); fichas técnicas e insertos aprobados por el INVIMA de metformina, dapagliflozina, liraglutida, semaglutida y tirzepatida; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y sus alertas sanitarias. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfdm_html$;
  v_t7 := NULL;
  v_j1 := $evfdm_json$["Indicación y dosis inicial.","Titulación y meta.","Ajuste de los orales.","Técnica y conservación.","Plan de hipoglucemia y seguimiento."]$evfdm_json$::jsonb;
  v_j2 := $evfdm_json${"version":1,"total":100,"criteria":[{"id":"indicacion-dosis-y-titulacion","name":"Indicación, dosis y titulación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Indicación correcta, dosis de 10 UI o 0,1-0,2 UI/kg (8-16 UI) y titulación de 2 UI cada 3 días con meta y regla de reducción."},{"level":3,"label":"Logrado","description":"Dosis y titulación correctas sin regla de reducción."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ajuste-de-los-orales","name":"Ajuste de los orales","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Propone suspender o reducir la glimepirida y continuar la metformina, con justificación."},{"level":3,"label":"Logrado","description":"Ajuste correcto con justificación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tecnica-y-conservacion","name":"Técnica y conservación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Técnica completa, rotación, desecho y conservación adaptada a su trabajo, remitiendo al inserto."},{"level":3,"label":"Logrado","description":"Técnica correcta con omisiones en la conservación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"hipoglucemia-y-seguimiento","name":"Hipoglucemia y seguimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan claro de hipoglucemia, incluida la conducción, y seguimiento con valoración del agonista GLP-1."},{"level":3,"label":"Logrado","description":"Plan correcto sin el riesgo al conducir o sin seguimiento."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfdm_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 4, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 4, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fdm-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. iSGLT2, agonistas del receptor GLP-1 y tirzepatida' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. iSGLT2, agonistas del receptor GLP-1 y tirzepatida) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: evaluación y propuesta terapéutica para Doña Esperanza';
  v_t2 := $evfdm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y elabora el estado de situación: cada problema de salud con su medicamento y su parámetro de control.</li><li>Fase 1: define la meta individual de HbA1c y las comorbilidades que guían la elección del tratamiento.</li><li>Fase 2: revisa la dosis de metformina frente a la TFG, el riesgo de la glibenclamida y el ibuprofeno.</li><li>Fase 3: según ADA 2026, propone la terapia con beneficio cardiorrenal y qué hacer con la sitagliptina.</li><li>Fase 3: describe el plan de inicio (dosis, titulación, efectos adversos y reglas de días de enfermedad).</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (evaluación inicial).</strong> Problemas de salud, meta individual y comorbilidades que guían la elección.</li>
  <li><strong>Fase 2 · Unidad 2 (antidiabéticos orales).</strong> Revisión de dosis, ajustes renales, hipoglucemia y duplicidades.</li>
  <li><strong>Fase 3 · Unidad 3 (protección cardiorrenal).</strong> Propuesta de iSGLT2, agonista GLP-1 o tirzepatida con su plan de inicio.</li>
  <li><strong>Fase 4 · Unidad 4 (insulina y dispositivos).</strong> Criterios para insulina si no se logra la meta y plan de educación.</li>
  <li><strong>Fase 5 · Unidad 5 (seguimiento y farmacovigilancia).</strong> Plan de seguimiento farmacoterapéutico, indicadores y reporte del producto.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Evaluar de forma integral la farmacoterapia de una persona con diabetes y comorbilidad cardiorrenal.</li><li>Proponer cambios justificados con ADA 2026 y las fichas técnicas.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 6 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 8 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 8 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Estado de situación y meta</td><td>20 %</td><td>Relaciona cada problema con su medicamento y define una meta individual justificada.</td><td>Estado correcto con alguna omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Revisión de los orales</td><td>25 %</td><td>Detecta el exceso de metformina para TFG 45-59, el riesgo de la glibenclamida y del ibuprofeno.</td><td>Detecta lo principal con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Propuesta cardiorrenal</td><td>30 %</td><td>Propone iSGLT2 y/o agonista GLP-1 con beneficio demostrado (9.7 y 9.10) y suspender la sitagliptina si se inicia el agonista GLP-1 (9.18).</td><td>Propuesta correcta con justificación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan de inicio</td><td>15 %</td><td>Dosis, titulación, efectos adversos y reglas de días de enfermedad correctos.</td><td>Plan correcto con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfdm_html$;
  v_t3 := $evfdm_html$<h2>Caso de estudio</h2>
<p>Doña Esperanza tiene 60 años, vive en Montería y lleva 12 años con diabetes tipo 2 (datos simulados). Tiene hipertensión, infarto hace 4 años, IMC de 36 kg/m², TFG de 47 mL/min y relación albúmina/creatinina de 240 mg/g. HbA1c 9,1 %. Toma metformina 850 mg cada 8 horas, glibenclamida 5 mg cada 12 horas, sitagliptina 100 mg al día, losartán 100 mg al día, atorvastatina 20 mg y ácido acetilsalicílico 100 mg. Usa a veces ibuprofeno. Hace un mes compró por redes un producto «para bajar de peso». Su EPS la asignó al programa de seguimiento farmacoterapéutico que tú coordinas. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfdm_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfdm_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Standards of Care in Diabetes 2026 de la ADA (secciones 2, 6, 7, 8, 9, 10, 11 y 13); fichas técnicas e insertos aprobados por el INVIMA de metformina, dapagliflozina, liraglutida, semaglutida y tirzepatida; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y sus alertas sanitarias. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfdm_html$;
  v_t7 := NULL;
  v_j1 := $evfdm_json$["Estado de situación y meta.","Revisión de los orales.","Propuesta cardiorrenal.","Plan de inicio."]$evfdm_json$::jsonb;
  v_j2 := $evfdm_json${"version":1,"total":100,"criteria":[{"id":"estado-de-situacion-y-meta","name":"Estado de situación y meta","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Relaciona cada problema con su medicamento y define una meta individual justificada."},{"level":3,"label":"Logrado","description":"Estado correcto con alguna omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"revision-de-los-orales","name":"Revisión de los orales","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Detecta el exceso de metformina para TFG 45-59, el riesgo de la glibenclamida y del ibuprofeno."},{"level":3,"label":"Logrado","description":"Detecta lo principal con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"propuesta-cardiorrenal","name":"Propuesta cardiorrenal","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Propone iSGLT2 y/o agonista GLP-1 con beneficio demostrado (9.7 y 9.10) y suspender la sitagliptina si se inicia el agonista GLP-1 (9.18)."},{"level":3,"label":"Logrado","description":"Propuesta correcta con justificación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-de-inicio","name":"Plan de inicio","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Dosis, titulación, efectos adversos y reglas de días de enfermedad correctos."},{"level":3,"label":"Logrado","description":"Plan correcto con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfdm_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 13, 8)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 13, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 8,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fdm-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Comorbilidad cardiorrenal, obesidad, seguimiento farmacoterapéutico y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Comorbilidad cardiorrenal, obesidad, seguimiento farmacoterapéutico y farmacovigilancia) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan de seguimiento farmacoterapéutico y farmacovigilancia de Doña Esperanza';
  v_t2 := $evfdm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: define los criterios para iniciar insulina si no se logra la meta y el plan de educación que necesitaría.</li><li>Fase 5: diseña el plan de seguimiento (entrevistas, parámetros, frecuencia) con los PRM y RNM que vigilarás.</li><li>Fase 5: gestiona el producto comprado por redes: preguntas, conservación de la evidencia, reporte en eReporting y educación.</li><li>Fase 5: define tres indicadores para medir el resultado del programa con Doña Esperanza.</li><li>Escribe un resumen ejecutivo de una página para el comité de la EPS.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (evaluación inicial).</strong> Problemas de salud, meta individual y comorbilidades que guían la elección.</li>
  <li><strong>Fase 2 · Unidad 2 (antidiabéticos orales).</strong> Revisión de dosis, ajustes renales, hipoglucemia y duplicidades.</li>
  <li><strong>Fase 3 · Unidad 3 (protección cardiorrenal).</strong> Propuesta de iSGLT2, agonista GLP-1 o tirzepatida con su plan de inicio.</li>
  <li><strong>Fase 4 · Unidad 4 (insulina y dispositivos).</strong> Criterios para insulina si no se logra la meta y plan de educación.</li>
  <li><strong>Fase 5 · Unidad 5 (seguimiento y farmacovigilancia).</strong> Plan de seguimiento farmacoterapéutico, indicadores y reporte del producto.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar un plan de seguimiento farmacoterapéutico con indicadores.</li><li>Gestionar la farmacovigilancia de un producto fraudulento.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 8 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 16 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 16 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Integración y mejora</td><td>15 %</td><td>Integra las cinco fases y documenta cada corrección.</td><td>Integra y corrige lo principal.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Insulina y educación</td><td>20 %</td><td>Criterios de ADA 2026 para insulina y plan de educación completo.</td><td>Criterios correctos con educación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Seguimiento farmacoterapéutico</td><td>25 %</td><td>Plan sistemático con entrevistas, parámetros, PRM y RNM y frecuencia realista.</td><td>Plan correcto pero poco sistemático.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Farmacovigilancia</td><td>20 %</td><td>Conserva la evidencia, reporta con datos completos y relaciona con las alertas del INVIMA.</td><td>Reporte correcto con datos incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores</td><td>10 %</td><td>Tres indicadores medibles y pertinentes.</td><td>Indicadores generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfdm_html$;
  v_t3 := $evfdm_html$<h2>Caso de estudio</h2>
<p>Doña Esperanza tiene 60 años, vive en Montería y lleva 12 años con diabetes tipo 2 (datos simulados). Tiene hipertensión, infarto hace 4 años, IMC de 36 kg/m², TFG de 47 mL/min y relación albúmina/creatinina de 240 mg/g. HbA1c 9,1 %. Toma metformina 850 mg cada 8 horas, glibenclamida 5 mg cada 12 horas, sitagliptina 100 mg al día, losartán 100 mg al día, atorvastatina 20 mg y ácido acetilsalicílico 100 mg. Usa a veces ibuprofeno. Hace un mes compró por redes un producto «para bajar de peso». Su EPS la asignó al programa de seguimiento farmacoterapéutico que tú coordinas. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité de la EPS.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfdm_html$;
  v_t4 := 'Plan completo de seguimiento farmacoterapéutico y farmacovigilancia con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfdm_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Standards of Care in Diabetes 2026 de la ADA (secciones 2, 6, 7, 8, 9, 10, 11 y 13); fichas técnicas e insertos aprobados por el INVIMA de metformina, dapagliflozina, liraglutida, semaglutida y tirzepatida; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y sus alertas sanitarias. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfdm_html$;
  v_t7 := NULL;
  v_j1 := $evfdm_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Criterios de insulina y educación.","Plan de seguimiento con PRM y RNM.","Farmacovigilancia del producto.","Indicadores y resumen ejecutivo."]$evfdm_json$::jsonb;
  v_j2 := $evfdm_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"insulina-y-educacion","name":"Insulina y educación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Criterios de ADA 2026 para insulina y plan de educación completo."},{"level":3,"label":"Logrado","description":"Criterios correctos con educación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguimiento-farmacoterapeutico","name":"Seguimiento farmacoterapéutico","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan sistemático con entrevistas, parámetros, PRM y RNM y frecuencia realista."},{"level":3,"label":"Logrado","description":"Plan correcto pero poco sistemático."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacovigilancia","name":"Farmacovigilancia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Conserva la evidencia, reporta con datos completos y relaciona con las alertas del INVIMA."},{"level":3,"label":"Logrado","description":"Reporte correcto con datos incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores","name":"Indicadores","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Tres indicadores medibles y pertinentes."},{"level":3,"label":"Logrado","description":"Indicadores generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfdm_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 15, 16)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 15, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 16,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Foro fdm-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con personas con diabetes';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfdm_html$<h2>Para empezar</h2>
<p>Piensa en una persona con diabetes que hayas atendido en una farmacia, una IPS o tu familia y cuéntanos en tres o cuatro líneas una duda que tuvo sobre sus medicamentos, sin nombres ni datos que la identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfdm_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre el tratamiento de la diabetes te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfdm_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfdm_html$;
  v_t6 := $evfdm_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfdm_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué familia de antidiabéticos te genera más preguntas: orales, inyectables no insulínicos o insulinas?', '¿Has reportado alguna vez una sospecha de reacción adversa al INVIMA?']::text[];
  v_j1 := NULL;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, NULL, 'curso', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'formativa', NULL, v_j1,
       FALSE, FALSE, 'publicado', 0)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = NULL, scope = 'curso', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 0, updated_at = NOW()
     WHERE id = v_foro;
  END IF;


  -- ── Foro fdm-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la diabetes, diagnóstico y metas terapéuticas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la diabetes, diagnóstico y metas terapéuticas) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Meta estricta o meta segura?';
  v_t2 := 'Argumentar cómo se individualiza la meta glucémica y qué datos del paciente la cambian.';
  v_t3 := $evfdm_html$<h2>Caso del foro</h2>
<p>En un programa de riesgo cardiovascular hay dos pacientes con HbA1c de 7,4 % (datos simulados). Ana, de 46 años, con diabetes de 3 años, sin complicaciones, con metformina. Rubén, de 79 años, con diabetes de 20 años, enfermedad renal crónica, una caída el año pasado por una hipoglucemia y tratamiento con glibenclamida e insulina NPH. El médico quiere «llevar a los dos a menos de 7 %».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfdm_html$;
  v_t4 := '¿Debe ser igual la meta de HbA1c para Ana y para Rubén? ¿Qué propondrías para cada uno?';
  v_t5 := $evfdm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la meta que propones para cada paciente con la recomendación que la sustenta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfdm_html$;
  v_t6 := $evfdm_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la meta que propones para cada paciente con la recomendación que la sustenta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfdm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué metas de monitoreo continuo usarías si Rubén tuviera un sensor?', '¿Qué otros parámetros, además de la glucosa, deben estar en la meta de ambos?', '¿Cómo explicarías a Rubén que una HbA1c más alta puede ser más segura para él?']::text[];
  v_j1 := $evfdm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la meta que propones para cada paciente con la recomendación que la sustenta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfdm_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 1)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 1, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fdm-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Metformina, iDPP-4, sulfonilureas y otros antidiabéticos orales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Metformina, iDPP-4, sulfonilureas y otros antidiabéticos orales) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · ¿Retirar la glibenclamida?';
  v_t2 := 'Argumentar cuándo desintensificar una sulfonilurea y cómo equilibrar seguridad, eficacia y acceso.';
  v_t3 := $evfdm_html$<h2>Caso del foro</h2>
<p>En una IPS, el perfil de uso muestra que metformina más glibenclamida es la combinación más frecuente en mayores de 75 años (datos simulados). Un médico defiende la glibenclamida porque «es barata, baja bien la HbA1c y está en el plan de beneficios»; otro quiere retirarla a todos los mayores de 75 años.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfdm_html$;
  v_t4 := '¿Qué criterio usarías para decidir a quién retirar o reducir la glibenclamida y qué propondrías en su lugar?';
  v_t5 := $evfdm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el criterio de desintensificación que usas y la recomendación que lo sustenta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfdm_html$;
  v_t6 := $evfdm_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio de desintensificación que usas y la recomendación que lo sustenta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfdm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué datos del paciente aumentan el riesgo de hipoglucemia con sulfonilureas?', '¿Qué alternativas tienen bajo riesgo de hipoglucemia en el adulto mayor?', '¿Cómo cambia la decisión si el paciente tiene enfermedad renal con albuminuria?']::text[];
  v_j1 := $evfdm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio de desintensificación que usas y la recomendación que lo sustenta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfdm_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 2)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 2, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fdm-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. iSGLT2, agonistas del receptor GLP-1 y tirzepatida' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. iSGLT2, agonistas del receptor GLP-1 y tirzepatida) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · ¿iSGLT2, agonista GLP-1 o tirzepatida?';
  v_t2 := 'Argumentar la elección entre las familias con beneficio más allá de la glucosa según el perfil de cada paciente.';
  v_t3 := $evfdm_html$<h2>Caso del foro</h2>
<p>El comité de farmacia de una IPS debe priorizar a quién inicia primero cada familia, porque el presupuesto del trimestre no alcanza para todos (datos simulados). Tres pacientes: (1) mujer de 59 años con insuficiencia cardiaca con FE reducida y HbA1c 7,6 %; (2) hombre de 55 años con IMC 38, HbA1c 9,2 % y sin enfermedad cardiovascular; (3) hombre de 70 años con ERC, TFG 26 mL/min, RAC 400 mg/g y HbA1c 8,0 %.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfdm_html$;
  v_t4 := '¿Qué familia priorizarías para cada paciente y por qué?';
  v_t5 := $evfdm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de ADA 2026 o el dato de la ficha técnica que sustenta cada elección. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfdm_html$;
  v_t6 := $evfdm_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de ADA 2026 o el dato de la ficha técnica que sustenta cada elección.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfdm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué cambia en el paciente 3 con una TFG menor de 30 mL/min?', '¿Qué efectos adversos debe vigilar el servicio farmacéutico en cada caso?', '¿Se pueden combinar dos de estas familias en un mismo paciente?']::text[];
  v_j1 := $evfdm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de ADA 2026 o el dato de la ficha técnica que sustenta cada elección."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfdm_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 3)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 3, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fdm-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Insulinoterapia, dispositivos e hipoglucemia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Insulinoterapia, dispositivos e hipoglucemia) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · ¿Agonista GLP-1 o insulina primero?';
  v_t2 := 'Argumentar cuándo se prefiere la terapia basada en GLP-1 y cuándo la insulina en la diabetes tipo 2.';
  v_t3 := $evfdm_html$<h2>Caso del foro</h2>
<p>Dos pacientes con diabetes tipo 2 no logran la meta con metformina (datos simulados). Lucía, de 50 años, IMC 34, HbA1c 8,6 %, sin síntomas, con mucho miedo a «las agujas». Jorge, de 58 años, IMC 24, con sed, orina frecuente, pérdida de 5 kg en dos meses y HbA1c 11,4 %. En la farmacia hay escasez intermitente de agonistas GLP-1.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfdm_html$;
  v_t4 := '¿Qué propondrías para cada uno y qué harías ante la escasez del agonista GLP-1?';
  v_t5 := $evfdm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de ADA 2026 que sustenta cada propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfdm_html$;
  v_t6 := $evfdm_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de ADA 2026 que sustenta cada propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfdm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dice ADA 2026 sobre preferir GLP-1 o insulina sin hiperglucemia grave?', '¿Qué haría el QF con una sulfonilurea al iniciar insulina?', '¿Cómo educarías a Lucía sobre su temor a las inyecciones?']::text[];
  v_j1 := $evfdm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de ADA 2026 que sustenta cada propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfdm_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 4)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 4, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fdm-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Comorbilidad cardiorrenal, obesidad, seguimiento farmacoterapéutico y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Comorbilidad cardiorrenal, obesidad, seguimiento farmacoterapéutico y farmacovigilancia) en Farmacoterapia de la Diabetes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Productos para bajar de peso en redes sociales';
  v_t2 := 'Argumentar el papel del QF ante la venta de agonistas GLP-1 falsificados o sin registro.';
  v_t3 := $evfdm_html$<h2>Caso del foro</h2>
<p>En una semana llegan a una droguería tres personas con productos comprados por redes (datos simulados): un «Ozempic» en una caja sin sello, una «semaglutida + B12» en vial y una «tirzepatida 20 mg/mL» sin registro sanitario. Una tiene vómito persistente. El dueño de la droguería prefiere «no meterse en problemas» y no reportar.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfdm_html$;
  v_t4 := '¿Qué debe hacer el servicio farmacéutico en cada caso y por qué reportar es una obligación y no un riesgo?';
  v_t5 := $evfdm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la alerta o la norma que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfdm_html$;
  v_t6 := $evfdm_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la alerta o la norma que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfdm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué datos del producto y del paciente necesita el reporte en eReporting?', '¿Qué alertas del INVIMA aplican a estos productos?', '¿Cómo orientarías a la persona que quiere seguir bajando de peso?']::text[];
  v_j1 := $evfdm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la alerta o la norma que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfdm_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 5)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 5, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  RAISE NOTICE 'Farmacoterapia de la Diabetes: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfdm$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Farmacoterapia de la Hipertensión Arterial
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfhta$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_act      BIGINT;
  v_foro     BIGINT;
  v_t1 TEXT; v_t2 TEXT; v_t3 TEXT; v_t4 TEXT; v_t5 TEXT; v_t6 TEXT; v_t7 TEXT;
  v_j1 JSONB; v_j2 JSONB;
  v_a1 TEXT[];
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacoterapia de la Hipertensión Arterial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos: diagnóstico, riesgo cardiovascular y metas de presión arterial', 'Unidad 2. Bloqueo del sistema renina-angiotensina y calcioantagonistas', 'Unidad 3. Diuréticos, betabloqueadores y otros antihipertensivos', 'Unidad 4. Estrategia terapéutica, HTA resistente y poblaciones especiales', 'Unidad 5. Adherencia, seguimiento farmacoterapéutico y farmacovigilancia']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacoterapia de la Hipertensión Arterial: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfhta_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfhta_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fhta-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: diagnóstico, riesgo cardiovascular y metas de presión arterial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: diagnóstico, riesgo cardiovascular y metas de presión arterial) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos: diagnóstico, riesgo cardiovascular y metas de presión arterial';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 1, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 1, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := 'Un paciente tiene una presión de 134/84 mmHg confirmada. ¿Cómo la clasifican las guías ESC 2024 y AHA/ACC 2025?';
    v_t4 := 'La ESC 2024 clasifica la PA en no elevada (menor de 120/70), elevada (120-139/70-89) e hipertensión (≥140/90 mmHg). La AHA/ACC 2025 conserva normal, elevada (120-129/menor de 80), estadio 1 (130-139 u 80-89) y estadio 2 (≥140 o ≥90 mmHg).';
    v_j1 := $evfhta_json${"external_id":"fhta-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Definición y clasificación de la presión arterial: ESC 2024 frente a AHA/ACC 2025","outcome":"Definición y clasificación de la presión arterial: ESC 2024 frente a AHA/ACC 2025","source":"Guía ESC 2024; guía AHA/ACC 2025."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Hipertensión en ambas guías, porque las dos usan desde 2024 el umbral de 130/80 mmHg.', FALSE, 'La guía europea mantiene el umbral de hipertensión en 140/90 mmHg.', 0),
      (v_pregunta, 'PA elevada según la guía europea e hipertensión estadio 1 según la estadounidense.', TRUE, 'Correcto. Por eso hay que saber qué guía se está aplicando.', 1),
      (v_pregunta, 'PA normal según la guía europea y PA elevada según la guía estadounidense.', FALSE, 'Para la europea, 120-139/70-89 mmHg es PA elevada, no normal.', 2),
      (v_pregunta, 'Hipertensión estadio 2 según la estadounidense y PA no elevada según la europea.', FALSE, 'El estadio 2 de la AHA/ACC empieza en 140 o 90 mmHg.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente hizo la automedida domiciliaria (AMPA) con la técnica correcta durante 7 días y su promedio es 138/87 mmHg. En consultorio tuvo 148/92. ¿Qué concluye el QF al revisar el registro?';
    v_t4 := 'Los umbrales de hipertensión fuera del consultorio son AMPA ≥135/85 mmHg y MAPA de 24 horas ≥130/80 mmHg. La AMPA se hace con dos lecturas en la mañana y dos en la noche durante 3 a 7 días. Si la AMPA está sobre el umbral, se confirma la hipertensión y no es bata blanca.';
    v_j1 := $evfhta_json${"external_id":"fhta-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Medición correcta de la presión arterial: consultorio, MAPA y AMPA","outcome":"Medición correcta de la presión arterial: consultorio, MAPA y AMPA","source":"Guía ESC 2024, medición de la presión arterial."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que es una hipertensión de bata blanca, porque la PA medida en casa es menor que la del consultorio.', FALSE, 'Para hablar de bata blanca, la AMPA debe estar por debajo del umbral.', 0),
      (v_pregunta, 'Que la AMPA no sirve para confirmar el diagnóstico y debe repetirse en el consultorio.', FALSE, 'La AMPA es una de las formas recomendadas para confirmarlo.', 1),
      (v_pregunta, 'Que es una hipertensión enmascarada, porque la PA en casa sigue siendo alta.', FALSE, 'La enmascarada es normal en consultorio y alta fuera de él.', 2),
      (v_pregunta, 'Que se confirma la hipertensión, porque el promedio supera el umbral de AMPA de 135/85 mmHg.', TRUE, 'Correcto. El umbral de AMPA es más bajo que el de consultorio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre de 58 años con diabetes tiene una PA confirmada de 134/84 mmHg. ¿Qué plan corresponde según la guía ESC 2024?';
    v_t4 := 'Según la ESC 2024, en PA elevada (130-139/80-89 mmHg) con riesgo alto (diabetes, enfermedad cardiovascular, ERC, daño de órgano o riesgo estimado ≥10 %) se dan tres meses de cambios en el estilo de vida y, si la PA sigue ≥130/80, se inicia tratamiento.';
    v_j1 := $evfhta_json${"external_id":"fhta-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Umbrales de tratamiento y metas de presión arterial","outcome":"Umbrales de tratamiento y metas de presión arterial","source":"Guía ESC 2024, umbrales de tratamiento."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tres meses de cambios en el estilo de vida y, si la PA sigue en 130/80 o más, iniciar tratamiento.', TRUE, 'Correcto. La diabetes lo ubica en riesgo alto.', 0),
      (v_pregunta, 'No tratar con fármacos en ningún caso, porque la PA está por debajo de 140/90 mmHg.', FALSE, 'En riesgo alto, la PA elevada persistente sí justifica fármacos.', 1),
      (v_pregunta, 'Iniciar de inmediato tres fármacos distintos, porque la diabetes obliga a buscar la meta más estricta posible.', FALSE, 'No se inicia con triple terapia en PA elevada.', 2),
      (v_pregunta, 'Esperar a que aparezca daño de órgano antes de tomar cualquier decisión terapéutica.', FALSE, 'La diabetes ya es una condición de alto riesgo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para una mujer de 87 años con fragilidad moderada e hipotensión ortostática sintomática, el médico propone «llevarla a 120 de sistólica como a todos». ¿Cuál es la valoración más acertada?';
    v_t4 := 'La ESC 2024 propone una PA sistólica de 120 a 129 mmHg si se tolera. En personas de 85 años o más, con fragilidad moderada o grave, hipotensión ortostática sintomática o expectativa de vida limitada se aplica el principio ALARA: tan baja como sea razonablemente posible.';
    v_j1 := $evfhta_json${"external_id":"fhta-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Umbrales de tratamiento y metas de presión arterial","outcome":"Umbrales de tratamiento y metas de presión arterial","source":"Guía ESC 2024, metas de presión arterial."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: la meta de 120 a 129 mmHg aplica por igual a todos los adultos tratados, sin excepción.', FALSE, 'La guía europea hace excepciones explícitas para estos casos.', 0),
      (v_pregunta, 'Es errada: a su edad la PA ya no debe tratarse porque el beneficio desaparece.', FALSE, 'Tratar sigue siendo útil; lo que cambia es la intensidad.', 1),
      (v_pregunta, 'Es errada: en su caso aplica el principio ALARA, tan baja como sea razonablemente posible.', TRUE, 'Correcto. La fragilidad y la hipotensión ortostática cambian la meta.', 2),
      (v_pregunta, 'Es correcta si se logra en dos semanas, para reducir rápido el riesgo de ictus.', FALSE, 'Reducir rápido aumenta el riesgo de caídas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fhta-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Bloqueo del sistema renina-angiotensina y calcioantagonistas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Bloqueo del sistema renina-angiotensina y calcioantagonistas) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Bloqueo del sistema renina-angiotensina y calcioantagonistas';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 2, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 2, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Por qué la tos es mucho menos frecuente con los ARA-II que con los IECA?';
    v_t4 := 'Los IECA bloquean la formación de angiotensina II y reducen la degradación de bradicinina, lo que explica la tos seca. Los ARA-II bloquean el receptor AT1 y no aumentan la bradicinina; por eso la ficha técnica del losartán lo indica cuando el IECA no se tolera, sobre todo por tos.';
    v_j1 := $evfhta_json${"external_id":"fhta-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"ARA-II: losartán y otros sartanes","outcome":"ARA-II: losartán y otros sartanes","source":"Fichas técnicas de enalapril y losartán."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque los ARA-II se eliminan por vía biliar y no se acumulan en el tejido pulmonar.', FALSE, 'La vía de eliminación no explica la tos.', 0),
      (v_pregunta, 'Porque los ARA-II tienen menor efecto antihipertensivo y se usan a dosis más bajas.', FALSE, 'Su efecto antihipertensivo es comparable.', 1),
      (v_pregunta, 'Porque los ARA-II no aumentan la bradicinina, ya que bloquean el receptor AT1.', TRUE, 'Correcto. Los IECA reducen la degradación de la bradicinina.', 2),
      (v_pregunta, 'Porque los ARA-II se toman con las comidas y eso protege la mucosa respiratoria.', FALSE, 'La tos no depende de cómo se tome el medicamento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con amlodipino 10 mg recibe una nueva fórmula de simvastatina 40 mg en la noche. ¿Qué hace el QF según la ficha técnica del amlodipino?';
    v_t4 := 'La ficha técnica del amlodipino limita la simvastatina a 20 mg al día cuando se usan juntos, por el aumento de la exposición a la estatina y el riesgo de miopatía. El QF lo comunica al médico.';
    v_j1 := $evfhta_json${"external_id":"fhta-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso: tos por enalapril, edema por amlodipino e interacción con simvastatina","outcome":"Caso: tos por enalapril, edema por amlodipino e interacción con simvastatina","source":"Ficha técnica de amlodipino."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Advierte al médico que con amlodipino la simvastatina se limita a 20 mg al día por riesgo de miopatía.', TRUE, 'Correcto. Es una interacción documentada en la ficha técnica.', 0),
      (v_pregunta, 'Dispensa sin observaciones, porque el amlodipino no tiene interacciones con las estatinas.', FALSE, 'Sí hay una interacción con la simvastatina.', 1),
      (v_pregunta, 'Recomienda tomar la simvastatina en la mañana y el amlodipino en la noche para separarlos.', FALSE, 'Separar las tomas no evita la interacción.', 2),
      (v_pregunta, 'Recomienda suspender el amlodipino mientras use la estatina y reiniciarlo al terminarla.', FALSE, 'No se suspende el antihipertensivo: se ajusta la estatina.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una paciente lee en redes que «el losartán da cáncer» por una alerta de impurezas y decide suspenderlo hoy. ¿Qué análisis hace el QF?';
    v_t4 := 'El INVIMA emitió alertas por nitrosaminas en valsartán (167-2018, 023-2019) y el retiro preventivo de lotes de losartán por una impureza tipo azido (243-2021). El riesgo depende de la exposición acumulada; las alertas pidieron no suspender el tratamiento sin consultar y reportar eventos adversos.';
    v_j1 := $evfhta_json${"external_id":"fhta-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Farmacovigilancia de los sartanes: impurezas tipo nitrosamina y azido","outcome":"Farmacovigilancia de los sartanes: impurezas tipo nitrosamina y azido","source":"INVIMA, alertas 167-2018, 023-2019 y 243-2021."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que tiene razón y debe cambiarse hoy mismo a un IECA, porque las impurezas solo se han encontrado en los sartanes.', FALSE, 'Las nitrosaminas se evalúan hoy en todos los medicamentos.', 0),
      (v_pregunta, 'Que la alerta no aplica en Colombia porque el INVIMA nunca ha retirado lotes de sartanes.', FALSE, 'El INVIMA sí emitió alertas y retiros de lotes.', 1),
      (v_pregunta, 'Que puede suspenderlo una semana mientras se aclara la información y luego retomarlo.', FALSE, 'Suspender sin consultar expone a un riesgo inmediato mayor.', 2),
      (v_pregunta, 'Que no debe suspenderlo por su cuenta: se verifica si su lote está afectado y se consulta al médico.', TRUE, 'Correcto. Es lo que recomendaron las alertas del INVIMA.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'A un paciente con insuficiencia cardiaca que toma enalapril le formulan sacubitrilo/valsartán y le indican «empezar mañana con la primera dosis, junto con la última de enalapril». ¿Cuál es la mejor valoración?';
    v_t4 := 'La ficha técnica del enalapril lo contraindica con sacubitrilo/valsartán y exige respetar 36 horas entre uno y otro, por el riesgo de angioedema. También lo contraindica en angioedema previo por IECA y en el segundo y tercer trimestre del embarazo.';
    v_j1 := $evfhta_json${"external_id":"fhta-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"IECA: enalapril — mecanismo, posología, tos, angioedema y calidad","outcome":"IECA: enalapril — mecanismo, posología, tos, angioedema y calidad","source":"Ficha técnica de enalapril."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: superponer un día ambos medicamentos evita que la presión arterial suba mientras se hace el cambio de tratamiento.', FALSE, 'La superposición es justamente lo que está contraindicado.', 0),
      (v_pregunta, 'Es errada: hay que dejar 36 horas entre la última dosis de enalapril y la primera de sacubitrilo/valsartán.', TRUE, 'Correcto. La combinación aumenta el riesgo de angioedema.', 1),
      (v_pregunta, 'Es correcta si el paciente no tiene antecedente de angioedema por ningún medicamento.', FALSE, 'La contraindicación aplica aunque no haya antecedente.', 2),
      (v_pregunta, 'Es errada solo porque el enalapril debe suspenderse una semana antes por su vida media larga.', FALSE, 'El intervalo recomendado es de 36 horas, no una semana.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fhta-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Diuréticos, betabloqueadores y otros antihipertensivos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Diuréticos, betabloqueadores y otros antihipertensivos) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Diuréticos, betabloqueadores y otros antihipertensivos';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 3, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 3, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := 'Según la ficha técnica de la hidroclorotiazida, ¿qué se hace si la respuesta es insuficiente con 25 o 50 mg al día?';
    v_t4 := 'La hidroclorotiazida se inicia con 12,5 o 25 mg al día y su efecto completo aparece en 3 a 4 semanas. Si la respuesta es insuficiente con 25 o 50 mg/día, no se sube la dosis: no baja más la PA y aumenta la pérdida de potasio; se asocia otro antihipertensivo.';
    v_j1 := $evfhta_json${"external_id":"fhta-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Tiazidas y similares: hidroclorotiazida, clortalidona e indapamida","outcome":"Tiazidas y similares: hidroclorotiazida, clortalidona e indapamida","source":"Ficha técnica de hidroclorotiazida."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se asocia otro antihipertensivo, porque subir la dosis no baja más la PA y aumenta la pérdida de potasio.', TRUE, 'Correcto. Es la advertencia de la ficha técnica.', 0),
      (v_pregunta, 'Se sube a 100 mg al día, porque el efecto de las tiazidas aumenta en proporción a la dosis.', FALSE, 'Por encima de 50 mg no hay más efecto y sí más hipopotasemia.', 1),
      (v_pregunta, 'Se cambia a la toma nocturna, porque la tiazida es más eficaz durante el sueño.', FALSE, 'Se toma en la mañana, con el desayuno.', 2),
      (v_pregunta, 'Se suspende, porque las tiazidas no son de primera línea en las guías actuales.', FALSE, 'Las tiazidas sí son de primera línea.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'A un paciente con diabetes y ERC que toma losartán le inician espironolactona por HTA resistente. ¿Qué indica el QF?';
    v_t4 := 'La combinación de un antagonista de mineralocorticoides con un IECA o ARA-II exige controlar potasio y creatinina al inicio, a las pocas semanas y luego de forma periódica, sobre todo en ERC, diabetes y adultos mayores. Se evitan suplementos de potasio y sustitutos de sal con potasio.';
    v_j1 := $evfhta_json${"external_id":"fhta-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Antagonistas de mineralocorticoides, otros ahorradores de potasio y diuréticos de asa","outcome":"Antagonistas de mineralocorticoides, otros ahorradores de potasio y diuréticos de asa","source":"Guía ESC 2024; fichas técnicas."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que no necesita controles, porque la espironolactona no afecta el potasio cuando se usa con ARA-II.', FALSE, 'La combinación aumenta el riesgo de hiperpotasemia.', 0),
      (v_pregunta, 'Que tome un suplemento de potasio para compensar el efecto diurético de la espironolactona.', FALSE, 'Los suplementos de potasio deben evitarse con esta combinación.', 1),
      (v_pregunta, 'Que controle potasio y creatinina al inicio, a las pocas semanas y luego de forma periódica, sin sustitutos de sal.', TRUE, 'Correcto. Diabetes y ERC aumentan el riesgo.', 2),
      (v_pregunta, 'Que suspenda el losartán, porque nunca se combina un ARA-II con un antagonista de mineralocorticoides.', FALSE, 'Se pueden combinar con vigilancia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una paciente con asma y angina estable necesita un betabloqueador. El médico duda entre propranolol y bisoprolol. ¿Qué análisis es correcto?';
    v_t4 := 'Los betabloqueadores cardioselectivos (bisoprolol, metoprolol, atenolol, nebivolol) afectan menos el receptor beta-2 bronquial. Los no selectivos, como el propranolol, se evitan en asma. La angina es una indicación preferente de betabloqueador.';
    v_j1 := $evfhta_json${"external_id":"fhta-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Betabloqueadores: indicaciones preferentes y diferencias entre moléculas","outcome":"Betabloqueadores: indicaciones preferentes y diferencias entre moléculas","source":"Guía ESC 2024; fichas técnicas de los betabloqueadores."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Ambos son iguales en asma, porque los betabloqueadores no actúan sobre los bronquios.', FALSE, 'Los no selectivos bloquean también el receptor beta-2 bronquial.', 0),
      (v_pregunta, 'El bisoprolol es cardioselectivo y afecta menos el receptor beta-2; el propranolol se evita en asma.', TRUE, 'Correcto. La selectividad beta-1 importa en asma.', 1),
      (v_pregunta, 'El propranolol es preferible porque, además de controlar la angina, también ayuda con el temblor y la migraña.', FALSE, 'Esas indicaciones no compensan el riesgo bronquial.', 2),
      (v_pregunta, 'Ninguno puede usarse, porque la angina en una paciente asmática se trata solo con nitratos.', FALSE, 'Un cardioselectivo puede usarse con precaución.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con clonidina dice que la dejará «de un día para otro» porque le da mucho sueño. ¿Cuál es la respuesta más acertada del QF?';
    v_t4 := 'Los agonistas alfa-2 centrales como la clonidina reducen el tono simpático; producen sedación y boca seca y tienen efecto rebote si se suspenden de forma brusca. El retiro debe ser gradual y planeado por el médico.';
    v_j1 := $evfhta_json${"external_id":"fhta-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Otros antihipertensivos y nuevas moléculas para HTA resistente","outcome":"Otros antihipertensivos y nuevas moléculas para HTA resistente","source":"Guía ESC 2024; ficha técnica de clonidina."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una buena decisión, porque la clonidina no produce ningún efecto indeseado al suspenderla de forma brusca.', FALSE, 'La suspensión brusca produce efecto rebote.', 0),
      (v_pregunta, 'Puede dejarla si toma el doble de su otro antihipertensivo durante la primera semana.', FALSE, 'Duplicar otro medicamento por cuenta propia no es seguro.', 1),
      (v_pregunta, 'Puede dejarla solo en la noche y seguir con la dosis de la mañana sin consultar.', FALSE, 'Cualquier cambio debe hacerse con el médico.', 2),
      (v_pregunta, 'No debe suspenderla de golpe por el riesgo de rebote: el médico debe retirarla de forma gradual.', TRUE, 'Correcto. La sedación se reporta y el retiro se planea.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fhta-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Estrategia terapéutica, HTA resistente y poblaciones especiales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Estrategia terapéutica, HTA resistente y poblaciones especiales) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Estrategia terapéutica, HTA resistente y poblaciones especiales';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 4, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 4, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Por qué las guías prefieren las combinaciones de dos antihipertensivos en una sola tableta?';
    v_t4 := 'Combinar dos fármacos de mecanismos complementarios a dosis bajas reduce más la PA que duplicar la dosis de uno solo, en general con menos efectos adversos. La combinación en una sola tableta simplifica el esquema y mejora la adherencia y la persistencia.';
    v_j1 := $evfhta_json${"external_id":"fhta-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Terapia combinada inicial y combinaciones en dosis fija","outcome":"Terapia combinada inicial y combinaciones en dosis fija","source":"Guía ESC 2024; guía AHA/ACC 2025; iniciativa HEARTS de la OPS."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque permiten usar dosis más altas de cada fármaco sin aumentar los efectos adversos.', FALSE, 'La ventaja es combinar dosis bajas, no subirlas.', 0),
      (v_pregunta, 'Porque son más baratas que cualquier monoterapia disponible en el plan de beneficios.', FALSE, 'El costo varía; no es la razón principal.', 1),
      (v_pregunta, 'Porque reemplazan los cambios en el estilo de vida en las personas con riesgo alto.', FALSE, 'El estilo de vida sigue siendo parte del tratamiento.', 2),
      (v_pregunta, 'Porque dos fármacos complementarios a dosis bajas bajan más la PA y una tableta mejora la adherencia.', TRUE, 'Correcto. Por eso las prefieren la ESC, la AHA/ACC y HEARTS.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una mujer de 31 años con HTA crónica que toma losartán 50 mg confirma un embarazo de 7 semanas. ¿Qué recomienda el QF?';
    v_t4 := 'Los IECA y ARA-II no se recomiendan en el primer trimestre y están contraindicados en el segundo y tercero: al confirmar el embarazo se suspenden y se cambian por una alternativa segura. La ESC 2024 prefiere labetalol, nifedipino de liberación prolongada o metildopa. La hidroclorotiazida no se usa para tratar la HTA en el embarazo.';
    v_j1 := $evfhta_json${"external_id":"fhta-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"HTA en el embarazo y la lactancia","outcome":"HTA en el embarazo y la lactancia","source":"Guía ESC 2024; fichas técnicas de losartán, enalapril e hidroclorotiazida."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Continuar el losartán, porque solo está contraindicado en el último mes del embarazo.', FALSE, 'Está contraindicado en el segundo y tercer trimestre y no se recomienda en el primero.', 0),
      (v_pregunta, 'Consultar de inmediato para cambiarlo por una alternativa segura como labetalol, nifedipino LP o metildopa.', TRUE, 'Correcto. Los ARA-II deben suspenderse al confirmar el embarazo.', 1),
      (v_pregunta, 'Cambiarlo por hidroclorotiazida, que es el diurético de elección en el embarazo.', FALSE, 'La hidroclorotiazida no debe usarse para tratar la HTA en el embarazo.', 2),
      (v_pregunta, 'Suspender todo tratamiento antihipertensivo durante el resto del embarazo para proteger al feto de cualquier efecto.', FALSE, 'La HTA no tratada también es un riesgo materno y perinatal.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con losartán 100 mg, amlodipino 10 mg e hidroclorotiazida 25 mg sigue con 148/88 mmHg en AMPA. Retira sus medicamentos cada 45 días y toma naproxeno a diario. ¿Qué análisis es correcto?';
    v_t4 := 'La HTA resistente se define con la PA sobre la meta pese a tres fármacos de clases distintas, incluido un diurético, a dosis óptimas, confirmada con MAPA o AMPA y tras verificar la adherencia. Antes se descarta la pseudorresistencia: mala técnica, bata blanca, falta de adherencia, dosis insuficientes, sal o alcohol y medicamentos como los AINE.';
    v_j1 := $evfhta_json${"external_id":"fhta-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"HTA resistente: pseudorresistencia, causas secundarias, espironolactona y denervación renal","outcome":"HTA resistente: pseudorresistencia, causas secundarias, espironolactona y denervación renal","source":"Guía ESC 2024, HTA resistente."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una HTA resistente confirmada y lo indicado es agregar espironolactona de inmediato.', FALSE, 'Antes hay que descartar la pseudorresistencia.', 0),
      (v_pregunta, 'Es un efecto de bata blanca, porque la PA de consultorio suele ser más alta que la de casa.', FALSE, 'La AMPA también está fuera de meta.', 1),
      (v_pregunta, 'Antes de llamarla resistente hay que corregir la adherencia y el naproxeno, que causan pseudorresistencia.', TRUE, 'Correcto. La adherencia y los AINE son causas frecuentes.', 2),
      (v_pregunta, 'El esquema es insuficiente y debe cambiarse por tres medicamentos de otras clases.', FALSE, 'El esquema es el recomendado; falta descartar otras causas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En una droguería, un señor sin síntomas tiene 186/112 mmHg. Dejó su tratamiento hace una semana y pide «una pastilla debajo de la lengua para bajarla ya». ¿Cuál es la respuesta más acertada?';
    v_t4 := 'La emergencia hipertensiva es una PA muy elevada con daño agudo de órgano y requiere urgencias. Sin daño agudo, la AHA/ACC 2025 habla de hipertensión grave sin daño agudo de órgano: no se busca bajar la PA en minutos; se revisan la adherencia y el esquema oral, se reduce de forma gradual y se asegura control médico cercano.';
    v_j1 := $evfhta_json${"external_id":"fhta-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Crisis hipertensivas: emergencia hipertensiva frente a hipertensión grave sin daño agudo de órgano","outcome":"Crisis hipertensivas: emergencia hipertensiva frente a hipertensión grave sin daño agudo de órgano","source":"Guía AHA/ACC 2025; guía ESC 2024."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No se busca bajarla en minutos: se revisa el tratamiento, se reduce de forma gradual y se asegura control médico cercano.', TRUE, 'Correcto. Es hipertensión grave sin daño agudo de órgano.', 0),
      (v_pregunta, 'Darle nifedipino sublingual, porque una PA mayor de 180/110 es siempre una emergencia.', FALSE, 'Las reducciones bruscas pueden causar isquemia cerebral o coronaria.', 1),
      (v_pregunta, 'Enviarlo a casa a reposar y que vuelva a medirse en un mes, porque no tiene síntomas.', FALSE, 'Necesita control médico cercano, no un mes de espera.', 2),
      (v_pregunta, 'Duplicarle la dosis de su antihipertensivo durante tres días para compensar la semana perdida.', FALSE, 'Duplicar dosis por cuenta propia no es seguro.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fhta-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Adherencia, seguimiento farmacoterapéutico y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Adherencia, seguimiento farmacoterapéutico y farmacovigilancia) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Adherencia, seguimiento farmacoterapéutico y farmacovigilancia';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 5, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 5, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Qué mide la proporción de días cubiertos (PDC) y qué valor suele considerarse adherencia adecuada?';
    v_t4 := 'La proporción de días cubiertos (PDC) es el número de días con medicamento disponible sobre los días del periodo, calculado con los registros de dispensación; valores de 80 % o más suelen considerarse adherencia adecuada. Se combina con otros métodos, porque ninguno es perfecto.';
    v_j1 := $evfhta_json${"external_id":"fhta-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Adherencia al tratamiento antihipertensivo: medición, barreras e intervenciones","outcome":"Adherencia al tratamiento antihipertensivo: medición, barreras e intervenciones","source":"Medición de la adherencia con registros de dispensación (proporción de días cubiertos); guía AHA/ACC 2025."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El número de tabletas que el paciente tomó frente a las que dice que tomó, con un mínimo de 50 %.', FALSE, 'Eso se acerca a un recuento de tabletas, no al PDC.', 0),
      (v_pregunta, 'El tiempo que el paciente lleva en el programa, con un mínimo de doce meses continuos.', FALSE, 'El PDC no mide la permanencia en el programa.', 1),
      (v_pregunta, 'Los días con medicamento disponible sobre los días del periodo; 80 % o más suele considerarse adecuado.', TRUE, 'Correcto. Se calcula con los registros de dispensación.', 2),
      (v_pregunta, 'Las veces que el paciente asiste a control médico en el año; con cuatro controles se considera adherente al tratamiento.', FALSE, 'La asistencia a control no es el PDC.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un señor de 78 años que toma losartán/hidroclorotiazida pide ibuprofeno para el dolor de rodilla; hace calor y bebe poca agua. ¿Qué hace el QF?';
    v_t4 := 'Los AINE reducen el efecto de IECA, ARA-II y tiazidas y aumentan el riesgo de deterioro renal e hiperpotasemia. Con un IECA o ARA-II, un diurético y un AINE el riesgo de lesión renal aguda aumenta («triple amenaza»), sobre todo en adultos mayores, deshidratación o ERC.';
    v_j1 := $evfhta_json${"external_id":"fhta-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Interacciones y reacciones adversas relevantes: AINE, potasio, litio y la «triple amenaza»","outcome":"Interacciones y reacciones adversas relevantes: AINE, potasio, litio y la «triple amenaza»","source":"Fichas técnicas de losartán e hidroclorotiazida."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Lo dispensa con la indicación de tomarlo con las comidas para proteger el estómago.', FALSE, 'El riesgo principal aquí es renal, no gástrico.', 0),
      (v_pregunta, 'Le sugiere naproxeno en lugar de ibuprofeno, porque se toma solo dos veces al día.', FALSE, 'El naproxeno también es un AINE con el mismo riesgo.', 1),
      (v_pregunta, 'Le recomienda suspender el losartán mientras use el ibuprofeno para evitar la interacción.', FALSE, 'No se suspende el antihipertensivo por cuenta propia.', 2),
      (v_pregunta, 'Explica el riesgo de la «triple amenaza» y ofrece una alternativa como el acetaminofén, con hidratación.', TRUE, 'Correcto. ARA-II, diurético y AINE aumentan el riesgo de lesión renal aguda.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En el seguimiento, un paciente toma su losartán todos los días pero sigue con la PA fuera de meta porque usa naproxeno a diario. ¿Cómo se clasifica el resultado negativo asociado a la medicación?';
    v_t4 := 'En el método Dáder los resultados negativos asociados a la medicación se agrupan en necesidad (problema no tratado o medicamento innecesario), efectividad (el medicamento no logra el efecto: dosis insuficiente, mala adherencia, interacción con AINE) y seguridad (el medicamento causa daño).';
    v_j1 := $evfhta_json${"external_id":"fhta-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Seguimiento farmacoterapéutico en HTA: problemas relacionados con medicamentos e indicadores","outcome":"Seguimiento farmacoterapéutico en HTA: problemas relacionados con medicamentos e indicadores","source":"Método Dáder; Resolución 1403 de 2007."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'De efectividad, porque el medicamento no logra el efecto esperado por la interacción.', TRUE, 'Correcto. El AINE reduce el efecto del ARA-II.', 0),
      (v_pregunta, 'De necesidad, porque el paciente necesita un medicamento adicional que todavía no está recibiendo.', FALSE, 'El paciente sí recibe tratamiento para su problema.', 1),
      (v_pregunta, 'De seguridad, porque el losartán le está causando un daño directo al paciente.', FALSE, 'El problema no es un daño del losartán, sino su falta de efecto.', 2),
      (v_pregunta, 'No es un resultado negativo, porque el paciente es adherente al tratamiento.', FALSE, 'Ser adherente no descarta un resultado negativo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'El QF de una IPS con servicio farmacéutico habilitado dice que reporta las sospechas de reacciones adversas «en eReporting Industria, como los laboratorios». ¿Cuál es la mejor valoración?';
    v_t4 := 'Según el INVIMA, las IPS con servicio farmacéutico habilitado reportan en VigiFlow; los pacientes, familiares, cuidadores y profesionales independientes usan VigiFlow eForms o VigiMobile; y los titulares y fabricantes reportan en eReporting Industria conforme a la Resolución 2024015321 de 2024.';
    v_j1 := $evfhta_json${"external_id":"fhta-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Farmacovigilancia de antihipertensivos en Colombia: reporte, alertas y calidad","outcome":"Farmacovigilancia de antihipertensivos en Colombia: reporte, alertas y calidad","source":"INVIMA, Programa Nacional de Farmacovigilancia; Resolución 2024015321 de 2024."}$evfhta_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fhta-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: desde 2024 todos los actores reportan en eReporting Industria.', FALSE, 'Ese canal es para titulares y fabricantes.', 0),
      (v_pregunta, 'Es errada: las IPS con servicio farmacéutico habilitado reportan en VigiFlow.', TRUE, 'Correcto. Cada actor tiene su canal.', 1),
      (v_pregunta, 'Es correcta si la reacción es grave; las no graves se reportan solo en la historia clínica.', FALSE, 'Las no graves también se reportan.', 2),
      (v_pregunta, 'Es errada porque las IPS no reportan: solo los pacientes y los laboratorios pueden hacerlo.', FALSE, 'Las IPS son nodos de la Red Nacional de Farmacovigilancia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fhta-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: diagnóstico, riesgo cardiovascular y metas de presión arterial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: diagnóstico, riesgo cardiovascular y metas de presión arterial) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Confirmación, riesgo y meta en un paciente nuevo';
  v_t2 := $evfhta_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Revisa la técnica de medición y el equipo: ¿qué corregirías del tensiómetro y de la AMPA?</li><li>Confirma o descarta el diagnóstico con los umbrales de AMPA.</li><li>Clasifica la PA según la ESC 2024 y la AHA/ACC 2025.</li><li>Determina el nivel de riesgo cardiovascular y justifica si necesitas calculadora.</li><li>Define la meta de PA según ambas guías.</li><li>Identifica los factores del caso que pueden elevar la PA y propone qué hacer con cada uno.</li><li>Redacta una nota al médico con tus hallazgos y propuestas.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Confirmar el diagnóstico con mediciones fuera del consultorio.</li><li>Clasificar la PA y estimar el riesgo según las guías actuales.</li><li>Definir la meta y los factores que la elevan.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Medición</td><td>20 %</td><td>Corrige el equipo (tensiómetro de brazo validado) y la técnica de AMPA con detalle.</td><td>Corrige el equipo o la técnica, no ambos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Confirmación y clasificación</td><td>25 %</td><td>Confirma con AMPA ≥135/85 y clasifica correctamente en ambas guías.</td><td>Confirma y clasifica con un error menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Riesgo y meta</td><td>25 %</td><td>Reconoce riesgo alto por diabetes y albuminuria sin calculadora y define la meta de cada guía.</td><td>Riesgo y meta correctos con justificación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Factores y nota</td><td>20 %</td><td>Identifica el descongestionante y el alcohol, propone alternativas y redacta una nota clara.</td><td>Identifica un factor y redacta una nota general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfhta_html$;
  v_t3 := $evfhta_html$<h2>Caso de estudio</h2>
<p>Don Gilberto tiene 64 años, es tendero en Armenia y en una jornada de salud tuvo 156/94 mmHg (datos simulados). En dos consultas posteriores tuvo 148/92 y 150/90 mmHg. Su AMPA de 7 días promedia 144/89 mmHg. Tiene diabetes tipo 2 con metformina, IMC de 29 kg/m², TFGe de 68 ml/min/1,73 m² y relación albúmina/creatinina de 52 mg/g. Toma un descongestionante nasal casi a diario por rinitis y bebe tres cervezas los fines de semana. Su tensiómetro es de muñeca.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfhta_html$;
  v_t4 := 'Informe de confirmación diagnóstica con nota al médico.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfhta_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guía ESC 2024 de presión arterial elevada e hipertensión; guía AHA/ACC 2025 de hipertensión arterial; fichas técnicas e insertos aprobados por el INVIMA de enalapril, losartán, amlodipino e hidroclorotiazida; iniciativa HEARTS de la OPS; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y Resolución 2024015321 de 2024. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfhta_html$;
  v_t7 := NULL;
  v_j1 := $evfhta_json$["Técnica y equipo.","Confirmación y clasificación.","Riesgo y meta.","Factores que elevan la PA.","Nota al médico."]$evfhta_json$::jsonb;
  v_j2 := $evfhta_json${"version":1,"total":100,"criteria":[{"id":"medicion","name":"Medición","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Corrige el equipo (tensiómetro de brazo validado) y la técnica de AMPA con detalle."},{"level":3,"label":"Logrado","description":"Corrige el equipo o la técnica, no ambos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"confirmacion-y-clasificacion","name":"Confirmación y clasificación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Confirma con AMPA ≥135/85 y clasifica correctamente en ambas guías."},{"level":3,"label":"Logrado","description":"Confirma y clasifica con un error menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"riesgo-y-meta","name":"Riesgo y meta","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce riesgo alto por diabetes y albuminuria sin calculadora y define la meta de cada guía."},{"level":3,"label":"Logrado","description":"Riesgo y meta correctos con justificación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"factores-y-nota","name":"Factores y nota","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Identifica el descongestionante y el alcohol, propone alternativas y redacta una nota clara."},{"level":3,"label":"Logrado","description":"Identifica un factor y redacta una nota general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfhta_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 1, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 1, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fhta-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Bloqueo del sistema renina-angiotensina y calcioantagonistas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Bloqueo del sistema renina-angiotensina y calcioantagonistas) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Reacciones adversas e interacción en un paciente con IECA y calcioantagonista';
  v_t2 := $evfhta_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Analiza la tos: relación temporal, mecanismo y qué indica la ficha técnica del enalapril.</li><li>Analiza el edema: qué medicamento lo explica y qué opciones existen.</li><li>Identifica la interacción de la simvastatina con el amlodipino y propone el ajuste.</li><li>Analiza el efecto del ibuprofeno sobre la PA y el riñón con los medicamentos que toma.</li><li>Propone al médico un esquema alternativo coherente con las guías, preferiblemente en una sola tableta.</li><li>Prepara el reporte de la sospecha de reacción adversa (qué datos incluir y dónde reportar).</li><li>Escribe un mensaje para Doña Gladys que evite que abandone el tratamiento.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Relacionar reacciones adversas con los antihipertensivos usando las fichas técnicas.</li><li>Detectar interacciones y factores que reducen el control de la PA.</li><li>Proponer un esquema alternativo y reportar a farmacovigilancia.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Reacciones adversas</td><td>25 %</td><td>Relaciona la tos con el IECA y el edema con el amlodipino con la ficha técnica y la relación temporal.</td><td>Relaciona ambas reacciones sin sustento en la ficha técnica.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones y AINE</td><td>20 %</td><td>Identifica el límite de 20 mg de simvastatina con amlodipino y el efecto del ibuprofeno.</td><td>Identifica una de las dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Esquema alternativo</td><td>25 %</td><td>Propone cambiar el IECA por un ARA-II y combinar con calcioantagonista o tiazida a dosis adecuadas, idealmente en una sola tableta.</td><td>Propuesta razonable sin justificar la combinación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Farmacovigilancia y paciente</td><td>20 %</td><td>Reporte con datos completos en el canal correcto y mensaje claro para no abandonar el tratamiento.</td><td>Reporte incompleto o mensaje general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfhta_html$;
  v_t3 := $evfhta_html$<h2>Caso de estudio</h2>
<p>Doña Gladys tiene 62 años, vive en Tunja y tiene HTA y dislipidemia (datos simulados). Hace 6 meses inició enalapril 20 mg cada 12 horas; desde hace 4 meses tiene tos seca que no mejora con jarabes. Hace 5 semanas le añadieron amlodipino 10 mg porque su PA seguía en 150/92 mmHg, y ahora tiene hinchazón de tobillos. Toma simvastatina 40 mg en la noche y compra ibuprofeno para el dolor de espalda. Su AMPA actual es 142/88 mmHg. Está pensando en dejar «todas las pastillas de la presión» por los efectos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfhta_html$;
  v_t4 := 'Informe de análisis farmacoterapéutico con propuesta al médico y reporte de farmacovigilancia.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfhta_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guía ESC 2024 de presión arterial elevada e hipertensión; guía AHA/ACC 2025 de hipertensión arterial; fichas técnicas e insertos aprobados por el INVIMA de enalapril, losartán, amlodipino e hidroclorotiazida; iniciativa HEARTS de la OPS; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y Resolución 2024015321 de 2024. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfhta_html$;
  v_t7 := NULL;
  v_j1 := $evfhta_json$["Tos y edema.","Interacción con simvastatina.","Efecto del ibuprofeno.","Esquema alternativo.","Reporte y mensaje al paciente."]$evfhta_json$::jsonb;
  v_j2 := $evfhta_json${"version":1,"total":100,"criteria":[{"id":"reacciones-adversas","name":"Reacciones adversas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Relaciona la tos con el IECA y el edema con el amlodipino con la ficha técnica y la relación temporal."},{"level":3,"label":"Logrado","description":"Relaciona ambas reacciones sin sustento en la ficha técnica."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones-y-aine","name":"Interacciones y AINE","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Identifica el límite de 20 mg de simvastatina con amlodipino y el efecto del ibuprofeno."},{"level":3,"label":"Logrado","description":"Identifica una de las dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"esquema-alternativo","name":"Esquema alternativo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Propone cambiar el IECA por un ARA-II y combinar con calcioantagonista o tiazida a dosis adecuadas, idealmente en una sola tableta."},{"level":3,"label":"Logrado","description":"Propuesta razonable sin justificar la combinación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacovigilancia-y-paciente","name":"Farmacovigilancia y paciente","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Reporte con datos completos en el canal correcto y mensaje claro para no abandonar el tratamiento."},{"level":3,"label":"Logrado","description":"Reporte incompleto o mensaje general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfhta_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 2, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 2, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fhta-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Estrategia terapéutica, HTA resistente y poblaciones especiales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Estrategia terapéutica, HTA resistente y poblaciones especiales) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Análisis de una HTA aparentemente resistente';
  v_t2 := $evfhta_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Verifica si cumple la definición de HTA resistente y qué falta para confirmarla.</li><li>Calcula la proporción de días cubiertos y analiza la adherencia.</li><li>Identifica los medicamentos y hábitos que elevan la PA o reducen el efecto del tratamiento.</li><li>Analiza el riesgo renal y de potasio del esquema actual con el diclofenaco.</li><li>Señala las causas secundarias que el médico debería evaluar.</li><li>Propone el siguiente paso farmacológico si, corregido lo anterior, la PA sigue alta, con su vigilancia.</li><li>Redacta la nota al médico y un plan de educación para Don Rubén.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar los criterios de HTA resistente y descartar la pseudorresistencia.</li><li>Identificar interferencias farmacológicas y causas secundarias.</li><li>Proponer un plan escalonado al médico.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Definición y adherencia</td><td>25 %</td><td>Aplica la definición y calcula el PDC (252/365 = 69 %), reconociendo que no es adherencia adecuada.</td><td>Aplica la definición sin calcular el PDC.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interferencias</td><td>25 %</td><td>Identifica el diclofenaco (y la «triple amenaza»), el descongestionante y la sal, con propuestas.</td><td>Identifica dos de los tres factores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Causas secundarias</td><td>15 %</td><td>Señala la posible apnea del sueño y el tamizaje del hiperaldosteronismo primario.</td><td>Señala una causa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Siguiente paso</td><td>25 %</td><td>Propone espironolactona como cuarto fármaco tras corregir lo anterior, con control de potasio y creatinina por la ERC.</td><td>Propone un cuarto fármaco sin vigilancia.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfhta_html$;
  v_t3 := $evfhta_html$<h2>Caso de estudio</h2>
<p>Don Rubén tiene 66 años, vive en Neiva y tiene diabetes tipo 2 y ERC (TFGe 49 ml/min/1,73 m²; relación albúmina/creatinina 210 mg/g) (datos simulados). Recibe losartán 100 mg, amlodipino 10 mg e hidroclorotiazida 25 mg, además de metformina. PA en consultorio 158/94 mmHg; AMPA 150/90 mmHg. Potasio 4,7 mmol/l. Toma diclofenaco casi a diario por dolor de rodilla, usa un descongestionante nasal en las noches, ronca y tiene somnolencia diurna. Los registros de dispensación muestran 252 días cubiertos en el último año. Come embutidos y caldos en cubo a diario.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfhta_html$;
  v_t4 := 'Informe de análisis de HTA aparentemente resistente con nota al médico y plan educativo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfhta_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guía ESC 2024 de presión arterial elevada e hipertensión; guía AHA/ACC 2025 de hipertensión arterial; fichas técnicas e insertos aprobados por el INVIMA de enalapril, losartán, amlodipino e hidroclorotiazida; iniciativa HEARTS de la OPS; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y Resolución 2024015321 de 2024. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfhta_html$;
  v_t7 := NULL;
  v_j1 := $evfhta_json$["Definición y confirmación.","Adherencia (PDC).","Interferencias y sal.","Causas secundarias.","Siguiente paso y vigilancia."]$evfhta_json$::jsonb;
  v_j2 := $evfhta_json${"version":1,"total":100,"criteria":[{"id":"definicion-y-adherencia","name":"Definición y adherencia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Aplica la definición y calcula el PDC (252/365 = 69 %), reconociendo que no es adherencia adecuada."},{"level":3,"label":"Logrado","description":"Aplica la definición sin calcular el PDC."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interferencias","name":"Interferencias","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica el diclofenaco (y la «triple amenaza»), el descongestionante y la sal, con propuestas."},{"level":3,"label":"Logrado","description":"Identifica dos de los tres factores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"causas-secundarias","name":"Causas secundarias","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Señala la posible apnea del sueño y el tamizaje del hiperaldosteronismo primario."},{"level":3,"label":"Logrado","description":"Señala una causa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"siguiente-paso","name":"Siguiente paso","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Propone espironolactona como cuarto fármaco tras corregir lo anterior, con control de potasio y creatinina por la ERC."},{"level":3,"label":"Logrado","description":"Propone un cuarto fármaco sin vigilancia."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfhta_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 4, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 4, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fhta-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Diuréticos, betabloqueadores y otros antihipertensivos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Diuréticos, betabloqueadores y otros antihipertensivos) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: diagnóstico, meta y esquema inicial de Doña Rosalba';
  v_t2 := $evfhta_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y define qué mediciones necesitas para confirmar el diagnóstico.</li><li>Fase 1: clasifica, estima el riesgo y define la meta según ambas guías.</li><li>Fase 2: elige el bloqueador del SRAA y justifícalo con su albuminuria; describe sus riesgos y controles.</li><li>Fase 3: decide si combinarlo con calcioantagonista o tiazida, en una sola tableta, y explica qué vigilar.</li><li>Analiza el ibuprofeno y qué alternativa propones.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (diagnóstico y meta).</strong> Confirmación, clasificación, riesgo y meta.</li>
  <li><strong>Fase 2 · Unidad 2 (primera línea).</strong> Elección del bloqueador del SRAA y del calcioantagonista, con sus riesgos.</li>
  <li><strong>Fase 3 · Unidad 3 (diuréticos y otros).</strong> Lugar de la tiazida y de otros grupos en su caso.</li>
  <li><strong>Fase 4 · Unidad 4 (estrategia).</strong> Esquema escalonado, combinaciones y conducta ante crisis o resistencia.</li>
  <li><strong>Fase 5 · Unidad 5 (seguimiento).</strong> Adherencia, educación, seguimiento farmacoterapéutico y farmacovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Confirmar el diagnóstico y definir la meta según el riesgo.</li><li>Proponer un esquema inicial coherente con las guías y las fichas técnicas.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 6 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 8 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 8 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Diagnóstico y meta</td><td>25 %</td><td>Pide AMPA o MAPA, reconoce riesgo alto por diabetes y albuminuria y define la meta de cada guía.</td><td>Correcto con alguna imprecisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Bloqueador del SRAA</td><td>25 %</td><td>Elige IECA o ARA-II por la albuminuria, con dosis, controles de creatinina y potasio y contraindicaciones.</td><td>Elige bien sin detallar los controles.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Combinación</td><td>25 %</td><td>Propone una combinación a dosis bajas en una sola tableta y explica qué vigilar con cada componente.</td><td>Combinación correcta con vigilancia parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>AINE</td><td>15 %</td><td>Explica el efecto del ibuprofeno y propone alternativa.</td><td>Menciona el problema sin alternativa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfhta_html$;
  v_t3 := $evfhta_html$<h2>Caso de estudio</h2>
<p>Doña Rosalba tiene 59 años, vive en Barranquilla y en una jornada de tamizaje de la farmacia tuvo 154/96 mmHg (datos simulados). Tiene diabetes tipo 2, IMC de 31 kg/m² y una TFGe de 64 ml/min/1,73 m² con relación albúmina/creatinina de 85 mg/g. Toma metformina, compra ibuprofeno por dolor de espalda y planea un viaje largo a la casa de su hija. Su EPS la asignó al programa de HTA donde tú eres el QF responsable del seguimiento. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfhta_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfhta_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guía ESC 2024 de presión arterial elevada e hipertensión; guía AHA/ACC 2025 de hipertensión arterial; fichas técnicas e insertos aprobados por el INVIMA de enalapril, losartán, amlodipino e hidroclorotiazida; iniciativa HEARTS de la OPS; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y Resolución 2024015321 de 2024. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfhta_html$;
  v_t7 := NULL;
  v_j1 := $evfhta_json$["Confirmación, riesgo y meta.","Bloqueador del SRAA.","Combinación y vigilancia.","Manejo del AINE."]$evfhta_json$::jsonb;
  v_j2 := $evfhta_json${"version":1,"total":100,"criteria":[{"id":"diagnostico-y-meta","name":"Diagnóstico y meta","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Pide AMPA o MAPA, reconoce riesgo alto por diabetes y albuminuria y define la meta de cada guía."},{"level":3,"label":"Logrado","description":"Correcto con alguna imprecisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"bloqueador-del-sraa","name":"Bloqueador del SRAA","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Elige IECA o ARA-II por la albuminuria, con dosis, controles de creatinina y potasio y contraindicaciones."},{"level":3,"label":"Logrado","description":"Elige bien sin detallar los controles."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"combinacion","name":"Combinación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Propone una combinación a dosis bajas en una sola tableta y explica qué vigilar con cada componente."},{"level":3,"label":"Logrado","description":"Combinación correcta con vigilancia parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"aine","name":"AINE","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Explica el efecto del ibuprofeno y propone alternativa."},{"level":3,"label":"Logrado","description":"Menciona el problema sin alternativa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfhta_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 13, 8)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 13, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 8,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fhta-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Adherencia, seguimiento farmacoterapéutico y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Adherencia, seguimiento farmacoterapéutico y farmacovigilancia) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan de seguimiento y farmacovigilancia de Doña Rosalba';
  v_t2 := $evfhta_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: define los pasos si no llega a la meta (triple terapia, criterios de resistencia, cuarto fármaco) y qué haría ante una PA muy alta.</li><li>Fase 5: diseña el seguimiento farmacoterapéutico con frecuencia, parámetros y resultados negativos a vigilar.</li><li>Fase 5: prepara la educación (AMPA, sal, adherencia, viaje) y el plan de farmacovigilancia (qué vigilar y dónde reportar).</li><li>Fase 5: define tres indicadores del programa para Doña Rosalba.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (diagnóstico y meta).</strong> Confirmación, clasificación, riesgo y meta.</li>
  <li><strong>Fase 2 · Unidad 2 (primera línea).</strong> Elección del bloqueador del SRAA y del calcioantagonista, con sus riesgos.</li>
  <li><strong>Fase 3 · Unidad 3 (diuréticos y otros).</strong> Lugar de la tiazida y de otros grupos en su caso.</li>
  <li><strong>Fase 4 · Unidad 4 (estrategia).</strong> Esquema escalonado, combinaciones y conducta ante crisis o resistencia.</li>
  <li><strong>Fase 5 · Unidad 5 (seguimiento).</strong> Adherencia, educación, seguimiento farmacoterapéutico y farmacovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar un esquema escalonado y un plan de seguimiento con indicadores.</li><li>Integrar la farmacovigilancia y la educación en el plan.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 8 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 16 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 16 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Integración y mejora</td><td>15 %</td><td>Integra las cinco fases y documenta cada corrección.</td><td>Integra y corrige lo principal.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Esquema escalonado</td><td>20 %</td><td>Pasos claros hasta la HTA resistente y conducta correcta ante la PA muy alta con o sin daño de órgano.</td><td>Pasos correctos sin la conducta ante crisis.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Seguimiento farmacoterapéutico</td><td>25 %</td><td>Plan sistemático con entrevistas, parámetros y resultados negativos de necesidad, efectividad y seguridad.</td><td>Plan correcto pero poco sistemático.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Educación y farmacovigilancia</td><td>20 %</td><td>Educación práctica y canal de reporte correcto con las reacciones a vigilar.</td><td>Educación o farmacovigilancia incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores</td><td>10 %</td><td>Tres indicadores medibles y pertinentes.</td><td>Indicadores generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfhta_html$;
  v_t3 := $evfhta_html$<h2>Caso de estudio</h2>
<p>Doña Rosalba tiene 59 años, vive en Barranquilla y en una jornada de tamizaje de la farmacia tuvo 154/96 mmHg (datos simulados). Tiene diabetes tipo 2, IMC de 31 kg/m² y una TFGe de 64 ml/min/1,73 m² con relación albúmina/creatinina de 85 mg/g. Toma metformina, compra ibuprofeno por dolor de espalda y planea un viaje largo a la casa de su hija. Su EPS la asignó al programa de HTA donde tú eres el QF responsable del seguimiento. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité del programa.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfhta_html$;
  v_t4 := 'Plan completo de tratamiento, seguimiento y farmacovigilancia con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfhta_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guía ESC 2024 de presión arterial elevada e hipertensión; guía AHA/ACC 2025 de hipertensión arterial; fichas técnicas e insertos aprobados por el INVIMA de enalapril, losartán, amlodipino e hidroclorotiazida; iniciativa HEARTS de la OPS; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y Resolución 2024015321 de 2024. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfhta_html$;
  v_t7 := NULL;
  v_j1 := $evfhta_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Esquema escalonado y crisis.","Seguimiento farmacoterapéutico.","Educación y farmacovigilancia.","Indicadores y resumen ejecutivo."]$evfhta_json$::jsonb;
  v_j2 := $evfhta_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"esquema-escalonado","name":"Esquema escalonado","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Pasos claros hasta la HTA resistente y conducta correcta ante la PA muy alta con o sin daño de órgano."},{"level":3,"label":"Logrado","description":"Pasos correctos sin la conducta ante crisis."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguimiento-farmacoterapeutico","name":"Seguimiento farmacoterapéutico","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan sistemático con entrevistas, parámetros y resultados negativos de necesidad, efectividad y seguridad."},{"level":3,"label":"Logrado","description":"Plan correcto pero poco sistemático."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"educacion-y-farmacovigilancia","name":"Educación y farmacovigilancia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Educación práctica y canal de reporte correcto con las reacciones a vigilar."},{"level":3,"label":"Logrado","description":"Educación o farmacovigilancia incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores","name":"Indicadores","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Tres indicadores medibles y pertinentes."},{"level":3,"label":"Logrado","description":"Indicadores generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfhta_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 15, 16)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 15, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 16,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Foro fhta-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con la hipertensión';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfhta_html$<h2>Para empezar</h2>
<p>Piensa en una persona con hipertensión que hayas atendido o acompañado y cuéntanos en tres o cuatro líneas una dificultad que tuvo con su tratamiento, sin nombres ni datos que la identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfhta_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre la hipertensión te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfhta_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfhta_html$;
  v_t6 := $evfhta_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfhta_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué te genera más dudas: el diagnóstico, la elección de fármacos o el seguimiento?', '¿Has enseñado alguna vez a un paciente a medirse la presión en casa?']::text[];
  v_j1 := NULL;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, NULL, 'curso', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'formativa', NULL, v_j1,
       FALSE, FALSE, 'publicado', 0)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = NULL, scope = 'curso', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 0, updated_at = NOW()
     WHERE id = v_foro;
  END IF;


  -- ── Foro fhta-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: diagnóstico, riesgo cardiovascular y metas de presión arterial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: diagnóstico, riesgo cardiovascular y metas de presión arterial) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Hipertensión o presión elevada?';
  v_t2 := 'Argumentar cómo cambian la clasificación y la conducta según la guía que se aplique y el riesgo del paciente.';
  v_t3 := $evfhta_html$<h2>Caso del foro</h2>
<p>En un programa de riesgo cardiovascular, dos profesionales discuten sobre Hernán, de 52 años, con PA confirmada por AMPA de 134/84 mmHg, sin diabetes ni enfermedad cardiovascular, fumador y con un riesgo estimado a 10 años del 6 % (datos simulados). Una dice que «es hipertenso estadio 1 y hay que darle losartán»; el otro, que «solo tiene la presión elevada y no necesita nada».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfhta_html$;
  v_t4 := '¿Qué le dirías a cada profesional y qué plan propondrías para Hernán?';
  v_t5 := $evfhta_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía y la recomendación que aplicas para clasificar y decidir. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfhta_html$;
  v_t6 := $evfhta_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía y la recomendación que aplicas para clasificar y decidir.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfhta_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Cambiaría tu respuesta si Hernán tuviera albuminuria?', '¿Qué papel tiene el tabaco en la decisión?', '¿Qué umbral usa la Cuenta de Alto Costo para el indicador de control en Colombia?']::text[];
  v_j1 := $evfhta_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía y la recomendación que aplicas para clasificar y decidir."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfhta_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 1)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 1, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fhta-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Bloqueo del sistema renina-angiotensina y calcioantagonistas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Bloqueo del sistema renina-angiotensina y calcioantagonistas) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · ¿Suspender el antihipertensivo por una alerta?';
  v_t2 := 'Argumentar cómo comunicar una alerta de calidad sin poner en riesgo la continuidad del tratamiento.';
  v_t3 := $evfhta_html$<h2>Caso del foro</h2>
<p>Una droguería recibe una alerta ficticia del INVIMA sobre el retiro preventivo de dos lotes de un ARA-II por una impureza (datos simulados). Ese día llegan tres pacientes: uno trae un lote afectado, otro un lote no afectado pero quiere «cambiar de pastilla» y una tercera ya dejó de tomarlo hace cuatro días y tiene 168/98 mmHg.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfhta_html$;
  v_t4 := '¿Qué harías con cada paciente y qué mensaje darías para que nadie suspenda el tratamiento por miedo?';
  v_t5 := $evfhta_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la alerta o la norma que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfhta_html$;
  v_t6 := $evfhta_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la alerta o la norma que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfhta_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué información de la alerta necesitas antes de hablar con los pacientes?', '¿Qué haces con las unidades del lote afectado que tienes en inventario?', '¿Debe reportarse algo al INVIMA en estos casos?']::text[];
  v_j1 := $evfhta_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la alerta o la norma que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfhta_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 2)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 2, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fhta-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Diuréticos, betabloqueadores y otros antihipertensivos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Diuréticos, betabloqueadores y otros antihipertensivos) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · ¿Betabloqueador como primera línea?';
  v_t2 := 'Argumentar cuándo un betabloqueador es una buena elección y cuándo no en la HTA.';
  v_t3 := $evfhta_html$<h2>Caso del foro</h2>
<p>En una revisión de fórmulas, la QF encuentra que un consultorio inicia atenolol en monoterapia a casi todos los pacientes nuevos con HTA no complicada (datos simulados). Entre ellos hay una mujer de 34 años que planea un embarazo, un hombre de 60 años con angina estable y un hombre de 45 años con asma.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfhta_html$;
  v_t4 := '¿Para cuáles de estos pacientes es razonable un betabloqueador y qué propondrías para los demás?';
  v_t5 := $evfhta_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de la guía o el dato de la ficha técnica que sustenta cada propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfhta_html$;
  v_t6 := $evfhta_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de la guía o el dato de la ficha técnica que sustenta cada propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfhta_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dicen las guías sobre los betabloqueadores en la HTA no complicada?', '¿Qué betabloqueador se usa en el embarazo?', '¿Cómo plantearías la conversación con el médico del consultorio?']::text[];
  v_j1 := $evfhta_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de la guía o el dato de la ficha técnica que sustenta cada propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfhta_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 3)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 3, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fhta-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Estrategia terapéutica, HTA resistente y poblaciones especiales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Estrategia terapéutica, HTA resistente y poblaciones especiales) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · ¿Monoterapia o combinación desde el inicio?';
  v_t2 := 'Argumentar cuándo iniciar con combinación y cuándo con monoterapia, y cómo lo apoya un protocolo estandarizado.';
  v_t3 := $evfhta_html$<h2>Caso del foro</h2>
<p>Una IPS adopta un protocolo tipo HEARTS con losartán, amlodipino e hidroclorotiazida (datos simulados). Llegan cuatro pacientes nuevos con HTA confirmada: un hombre de 48 años con 158/98 mmHg; una mujer de 88 años, frágil, con 162/84; un hombre de 70 años con 146/88 e hipotensión ortostática; y una mujer de 55 años con diabetes y 150/94.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfhta_html$;
  v_t4 := '¿Con qué esquema iniciarías a cada paciente y por qué?';
  v_t5 := $evfhta_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de la guía que sustenta cada esquema. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfhta_html$;
  v_t6 := $evfhta_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de la guía que sustenta cada esquema.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfhta_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué ventajas tiene un protocolo con pocos medicamentos y pasos definidos?', '¿Qué combinaciones deben evitarse?', '¿Cómo vigilarías a la paciente de 88 años después de iniciar?']::text[];
  v_j1 := $evfhta_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de la guía que sustenta cada esquema."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfhta_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 4)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 4, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fhta-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Adherencia, seguimiento farmacoterapéutico y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Adherencia, seguimiento farmacoterapéutico y farmacovigilancia) en Farmacoterapia de la Hipertensión Arterial: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Adherencia: ¿problema del paciente o del sistema?';
  v_t2 := 'Argumentar qué barreras de adherencia puede resolver el servicio farmacéutico y cuáles requieren al sistema de salud.';
  v_t3 := $evfhta_html$<h2>Caso del foro</h2>
<p>En un programa de HTA de una EPS, el 35 % de los pacientes tiene una proporción de días cubiertos menor de 80 % (datos simulados). En las entrevistas aparecen: «si me siento bien no la necesito», «tomo cuatro pastillas a horas distintas», «la farmacia no tenía el medicamento y me tocó volver otro día» y «el bus para la farmacia me cuesta más que la pastilla».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfhta_html$;
  v_t4 := '¿Qué intervenciones propondrías para cada barrera y cuáles dependen del servicio farmacéutico?';
  v_t5 := $evfhta_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación o el dato que respalda cada intervención. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfhta_html$;
  v_t6 := $evfhta_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato que respalda cada intervención.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfhta_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Cómo medirías el efecto de tus intervenciones?', '¿Qué papel tienen las combinaciones en una sola tableta?', '¿Qué reportarías si el desabastecimiento se repite?']::text[];
  v_j1 := $evfhta_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato que respalda cada intervención."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfhta_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 5)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 5, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  RAISE NOTICE 'Farmacoterapia de la Hipertensión Arterial: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfhta$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Farmacoterapia de la Insuficiencia Cardíaca
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfic$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_act      BIGINT;
  v_foro     BIGINT;
  v_t1 TEXT; v_t2 TEXT; v_t3 TEXT; v_t4 TEXT; v_t5 TEXT; v_t6 TEXT; v_t7 TEXT;
  v_j1 JSONB; v_j2 JSONB;
  v_a1 TEXT[];
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacoterapia de la Insuficiencia Cardíaca' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos: fisiopatología, definición, diagnóstico y clasificación de la insuficiencia cardíaca', 'Unidad 2. Terapia médica fundamental en la IC con FEVI reducida: los cuatro pilares', 'Unidad 3. Implementación segura: titulación, diuréticos, potasio y función renal', 'Unidad 4. IC descompensada, terapias adicionales e IC con FEVI preservada', 'Unidad 5. Seguridad, seguimiento farmacoterapéutico y educación del paciente con IC']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacoterapia de la Insuficiencia Cardíaca: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfic_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfic_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fic-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: fisiopatología, definición, diagnóstico y clasificación de la insuficiencia cardíaca' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: fisiopatología, definición, diagnóstico y clasificación de la insuficiencia cardíaca) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos: fisiopatología, definición, diagnóstico y clasificación de la insuficiencia cardíaca';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 1, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 1, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Qué papel tiene la neprilisina en la fisiopatología de la insuficiencia cardíaca?';
    v_t4 := 'El corazón libera péptidos natriuréticos (ANP y BNP) cuando sus paredes se estiran; aumentan la eliminación de sodio y dilatan los vasos, y se oponen al SRAA y al sistema simpático. La neprilisina los degrada; el sacubitrilo la inhibe.';
    v_j1 := $evfic_json${"external_id":"fic-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Fisiopatología de la insuficiencia cardíaca: activación neurohormonal, remodelado y congestión","outcome":"Fisiopatología de la insuficiencia cardíaca: activación neurohormonal, remodelado y congestión","source":"Guía ESC 2021; ficha técnica de sacubitrilo/valsartán."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Activa el sistema renina-angiotensina-aldosterona y aumenta la retención de sodio y agua.', FALSE, 'La activación del SRAA no depende de la neprilisina.', 0),
      (v_pregunta, 'Es la enzima que transforma la angiotensina I en angiotensina II en el pulmón y el riñón.', FALSE, 'Esa es la enzima convertidora de angiotensina (ECA).', 1),
      (v_pregunta, 'Estimula la liberación de péptidos natriuréticos cuando se estiran las paredes del corazón.', FALSE, 'Los péptidos los libera el corazón; la neprilisina no los estimula.', 2),
      (v_pregunta, 'Degrada los péptidos natriuréticos, que normalmente eliminan sodio y dilatan los vasos.', TRUE, 'Correcto. Por eso inhibirla con sacubitrilo aumenta su efecto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una mujer de 63 años con hipertensión y diabetes tiene hipertrofia ventricular en el ecocardiograma, pero no tiene síntomas ni signos de IC. ¿En qué etapa está?';
    v_t4 := 'Las etapas son un continuo: A, en riesgo (hipertensión, diabetes, obesidad) sin alteraciones; B, pre-IC, con alteraciones cardíacas sin síntomas; C, IC sintomática actual o previa; D, IC avanzada. Las etapas no retroceden.';
    v_j1 := $evfic_json${"external_id":"fic-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Definición universal de la IC (2026), etapas A–D, clase funcional NYHA e IC izquierda y derecha","outcome":"Definición universal de la IC (2026), etapas A–D, clase funcional NYHA e IC izquierda y derecha","source":"Segunda Definición Universal de IC (2026); Guía ESC 2026."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Etapa A, porque solo tiene factores de riesgo y ninguna alteración cardíaca medible.', FALSE, 'Ya tiene una alteración estructural: la hipertrofia.', 0),
      (v_pregunta, 'Etapa B o pre-IC, porque tiene alteraciones cardíacas sin síntomas.', TRUE, 'Correcto. La etapa C exige síntomas actuales o previos.', 1),
      (v_pregunta, 'Etapa C, porque la hipertrofia ventricular ya cuenta como insuficiencia cardíaca establecida.', FALSE, 'Sin síntomas ni signos no es etapa C.', 2),
      (v_pregunta, 'Etapa D, porque la diabetes con hipertrofia se considera insuficiencia cardíaca avanzada.', FALSE, 'La etapa D es la IC avanzada.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre de 66 años consulta en forma ambulatoria por disnea de esfuerzo. Su ECG es anormal y su NT-proBNP es de 480 pg/mL. ¿Qué análisis es correcto?';
    v_t4 := 'Según la guía ESC 2021, en situación no aguda un NT-proBNP ≥125 pg/mL o un BNP ≥35 pg/mL justifican el ecocardiograma; en el escenario agudo se usan NT-proBNP ≥300 o BNP ≥100 pg/mL. El ecocardiograma confirma, mide la FEVI y orienta la causa.';
    v_j1 := $evfic_json${"external_id":"fic-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Diagnóstico de la IC: síntomas y signos, péptidos natriuréticos, ECG, ecocardiograma y búsqueda de la causa","outcome":"Diagnóstico de la IC: síntomas y signos, péptidos natriuréticos, ECG, ecocardiograma y búsqueda de la causa","source":"Guía ESC 2021, diagnóstico."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El valor descarta la insuficiencia cardíaca, porque en consulta el umbral es de 1.000 pg/mL.', FALSE, 'En situación no aguda el umbral es mucho más bajo.', 0),
      (v_pregunta, 'El valor confirma la insuficiencia cardíaca y permite iniciar tratamiento sin más estudios.', FALSE, 'El péptido no confirma por sí solo el diagnóstico.', 1),
      (v_pregunta, 'El valor supera el umbral no agudo de 125 pg/mL y justifica el ecocardiograma.', TRUE, 'Correcto. El ecocardiograma confirma y mide la FEVI.', 2),
      (v_pregunta, 'El valor solo es útil si se repite en urgencias, donde el umbral es de 125 pg/mL.', FALSE, 'En el escenario agudo los umbrales son más altos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con IC tuvo una FEVI de 30 % y hoy, con tratamiento completo, tiene 52 % y no tiene síntomas. Quiere suspender los medicamentos «porque ya se curó». ¿Cuál es la mejor valoración?';
    v_t4 := 'La FEVI mejorada describe a quien tuvo FEVI reducida y luego supera el umbral. La Guía ESC 2026, según los resúmenes publicados, pide no suspender el tratamiento cuando el paciente queda asintomático o su FEVI mejora mucho. Las etapas no retroceden: sigue en etapa C.';
    v_j1 := $evfic_json${"external_id":"fic-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Clasificación por FEVI: FEVIr, FEVIlr, FEVIp y FEVI mejorada — de ESC 2021/2023 a ESC 2026","outcome":"Clasificación por FEVI: FEVIr, FEVIlr, FEVIp y FEVI mejorada — de ESC 2021/2023 a ESC 2026","source":"Guía ESC 2026; Segunda Definición Universal de IC (2026)."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No debe suspenderlos: la mejoría de la FEVI no es curación y retirar el tratamiento puede revertirla.', TRUE, 'Correcto. Las guías piden no suspender cuando la FEVI mejora.', 0),
      (v_pregunta, 'Puede suspenderlos todos, porque con FEVI mayor de 50 % ya no tiene insuficiencia cardíaca.', FALSE, 'Haber estado en etapa C no se revierte con la mejoría.', 1),
      (v_pregunta, 'Puede suspender los cuatro pilares y quedarse solo con el diurético por si vuelve la congestión.', FALSE, 'El diurético alivia síntomas, pero no protege el corazón.', 2),
      (v_pregunta, 'Debe suspenderlos y repetir el ecocardiograma en un año para ver si la FEVI se mantiene.', FALSE, 'Esperar sin tratamiento expone a una recaída.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fic-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Terapia médica fundamental en la IC con FEVI reducida: los cuatro pilares' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Terapia médica fundamental en la IC con FEVI reducida: los cuatro pilares) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Terapia médica fundamental en la IC con FEVI reducida: los cuatro pilares';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 2, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 2, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Cuáles son los cuatro pilares de la terapia médica fundamental en la IC con FEVI reducida?';
    v_t4 := 'Los cuatro grupos que redujeron mortalidad y hospitalizaciones en FEVIr son: bloqueo del SRAA, preferiblemente con ARNI (o IECA o ARA-II); betabloqueadores con evidencia (bisoprolol, carvedilol, metoprolol succinato, nebivolol); ARM (espironolactona, eplerenona); e iSGLT2 (dapagliflozina, empagliflozina).';
    v_j1 := $evfic_json${"external_id":"fic-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: la terapia médica fundamental de la IC con FEVI reducida (los cuatro pilares)","outcome":"Introducción a la unidad: la terapia médica fundamental de la IC con FEVI reducida (los cuatro pilares)","source":"Guía ESC 2021 y actualización 2023; Guía ESC 2026."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'ARNI (o IECA o ARA-II), betabloqueador con evidencia, antagonista mineralocorticoide e iSGLT2.', TRUE, 'Correcto. Redujeron mortalidad y hospitalizaciones en ensayos clínicos.', 0),
      (v_pregunta, 'Diurético de asa, digoxina, nitratos y un betabloqueador cualquiera a la dosis tolerada.', FALSE, 'Los diuréticos y la digoxina alivian síntomas; no son los pilares.', 1),
      (v_pregunta, 'IECA, ARA-II y ARNI combinados entre sí, más un diurético de asa para la congestión.', FALSE, 'IECA, ARA-II y ARNI no se combinan entre sí.', 2),
      (v_pregunta, 'Ivabradina, vericiguat, hierro intravenoso y un calcioantagonista no dihidropiridínico.', FALSE, 'Son terapias adicionales o, en el último caso, no recomendadas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con FEVIr toma enalapril 10 mg cada 12 horas y el médico lo cambia a sacubitrilo/valsartán. Su presión es 118/70 mmHg y su potasio 4,6 mmol/L. ¿Qué plan corresponde según la ficha técnica?';
    v_t4 := 'La ficha técnica contraindica el sacubitrilo/valsartán con un IECA y hasta 36 horas después de la última dosis. Se inicia con 49/51 mg cada 12 horas y se duplica cada 2-4 semanas hasta 97/103 mg. La dosis de 24/26 mg se usa en quien no tomaba IECA o ARA-II o los tomaba a dosis bajas. No se inicia con potasio mayor de 5,4 o sistólica menor de 100 mmHg.';
    v_j1 := $evfic_json${"external_id":"fic-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"ARNI: sacubitrilo/valsartán — mecanismo, inicio, titulación y transición desde IECA","outcome":"ARNI: sacubitrilo/valsartán — mecanismo, inicio, titulación y transición desde IECA","source":"Ficha técnica de sacubitrilo/valsartán."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tomar la última dosis de enalapril y la primera de sacubitrilo/valsartán juntas esa misma noche.', FALSE, 'Juntos están contraindicados por el riesgo de angioedema.', 0),
      (v_pregunta, 'Suspender el enalapril y empezar de inmediato con 24/26 mg cada 12 horas por seguridad.', FALSE, 'Falta el intervalo de 36 horas y la dosis inicial sería otra.', 1),
      (v_pregunta, 'Esperar 36 horas tras la última dosis de enalapril e iniciar con 49/51 mg cada 12 horas.', TRUE, 'Correcto. Venía con una dosis plena de IECA.', 2),
      (v_pregunta, 'Suspender el enalapril una semana antes y luego iniciar con 97/103 mg cada 12 horas.', FALSE, 'El intervalo es de 36 horas y no se inicia con la dosis objetivo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con FEVI de 28 % recibe atenolol 50 mg al día desde hace años «como betabloqueador para el corazón». ¿Qué análisis hace el QF?';
    v_t4 := 'Solo cuatro betabloqueadores redujeron la mortalidad en IC: bisoprolol, carvedilol, metoprolol succinato y nebivolol. El atenolol y el metoprolol tartrato no son equivalentes. El cambio se hace con dosis de inicio bajas y titulación.';
    v_j1 := $evfic_json${"external_id":"fic-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Betabloqueadores con evidencia en IC: bisoprolol, carvedilol, metoprolol succinato y nebivolol","outcome":"Betabloqueadores con evidencia en IC: bisoprolol, carvedilol, metoprolol succinato y nebivolol","source":"Guía ESC 2021, tabla de dosis; fichas técnicas."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El atenolol es adecuado, porque todos los betabloqueadores tienen el mismo efecto en la IC.', FALSE, 'No todos los betabloqueadores tienen evidencia en IC.', 0),
      (v_pregunta, 'El atenolol debe suspenderse sin reemplazo, porque los betabloqueadores empeoran la IC.', FALSE, 'Los betabloqueadores con evidencia reducen la mortalidad.', 1),
      (v_pregunta, 'El atenolol es adecuado si se sube a 100 mg, que es la dosis con beneficio demostrado en IC.', FALSE, 'El problema no es la dosis, sino la molécula.', 2),
      (v_pregunta, 'El atenolol no tiene evidencia en IC: se propone uno que sí la tenga, como bisoprolol o carvedilol.', TRUE, 'Correcto. Solo cuatro moléculas la tienen.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para un paciente con FEVIr, potasio de 5,3 mmol/L y creatinina de 1,4 mg/dL, el médico propone iniciar hoy espironolactona 25 mg. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'Según la ficha técnica, en IC grave la espironolactona se inicia con 25 mg al día solo si el potasio es ≤5,0 mEq/L y la creatinina ≤2,5 mg/dL. Se controlan potasio y creatinina a la semana, cada mes los primeros 3 meses, cada 3 meses el primer año y luego cada 6 meses.';
    v_j1 := $evfic_json${"external_id":"fic-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Antagonistas del receptor mineralocorticoide: espironolactona, eplerenona y finerenona","outcome":"Antagonistas del receptor mineralocorticoide: espironolactona, eplerenona y finerenona","source":"Ficha técnica de espironolactona."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: el potasio está por debajo de 5,5 y la espironolactona puede iniciarse sin riesgo.', FALSE, 'El umbral de la ficha técnica para iniciar es más bajo.', 0),
      (v_pregunta, 'Conviene esperar: la ficha técnica pide iniciar solo con potasio ≤5,0; primero se buscan y corrigen causas.', TRUE, 'Correcto. Y luego se vigila potasio y creatinina a la semana.', 1),
      (v_pregunta, 'Es correcta si se acompaña de un suplemento de potasio para evitar alteraciones del ritmo.', FALSE, 'Los suplementos de potasio están contraindicados con espironolactona.', 2),
      (v_pregunta, 'Conviene iniciar con 50 mg para alcanzar rápido la dosis objetivo y luego bajar si sube el potasio.', FALSE, 'Se inicia con 25 mg y se sube solo si se tolera.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fic-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Implementación segura: titulación, diuréticos, potasio y función renal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Implementación segura: titulación, diuréticos, potasio y función renal) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Implementación segura: titulación, diuréticos, potasio y función renal';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 3, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 3, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Qué papel tienen los diuréticos de asa en la insuficiencia cardíaca?';
    v_t4 := 'Los diuréticos de asa inhiben el cotransportador Na-K-2Cl en el asa de Henle. En IC alivian síntomas y signos de congestión, pero no se ha demostrado que reduzcan la mortalidad; por eso se busca la dosis mínima eficaz y la euvolemia.';
    v_j1 := $evfic_json${"external_id":"fic-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Diuréticos de asa en IC: furosemida, torasemida y bumetanida — dosis, equivalencias y autoajuste","outcome":"Diuréticos de asa en IC: furosemida, torasemida y bumetanida — dosis, equivalencias y autoajuste","source":"Guía ESC 2021; ficha técnica de furosemida."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Reducen la mortalidad como los cuatro pilares, por eso se usan a la dosis máxima tolerada.', FALSE, 'No se ha demostrado que reduzcan la mortalidad.', 0),
      (v_pregunta, 'Alivian la congestión, sin beneficio demostrado en mortalidad: se busca la dosis mínima eficaz.', TRUE, 'Correcto. La meta es la euvolemia.', 1),
      (v_pregunta, 'Previenen la hiperpotasemia de los ARM y por eso se indican a todos los pacientes con IC.', FALSE, 'Se indican por congestión, no para corregir el potasio.', 2),
      (v_pregunta, 'Reemplazan al iSGLT2 en los pacientes que no tienen diabetes ni enfermedad renal crónica.', FALSE, 'El iSGLT2 es un pilar y el diurético no lo reemplaza.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con FEVIr y terapia fundamental tiene mareo y presión de 92/60 mmHg. Sin congestión. También toma tamsulosina y un nitrato sin tener angina. ¿Qué ajusta primero el QF en su propuesta?';
    v_t4 := 'Ante hipotensión sintomática el orden es: 1) retirar fármacos que bajan la presión sin aportar pronóstico (nitratos sin angina, calcioantagonistas, alfabloqueadores como tamsulosina o doxazosina); 2) si no hay congestión, reducir el diurético; 3) solo después, reducir temporalmente el ARNI, IECA o ARA-II.';
    v_j1 := $evfic_json${"external_id":"fic-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Hipotensión, bradicardia, fatiga y otras barreras de la titulación: qué ajustar primero","outcome":"Hipotensión, bradicardia, fatiga y otras barreras de la titulación: qué ajustar primero","source":"Guía ESC 2021, recomendaciones prácticas."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Suspender el sacubitrilo/valsartán, que es el fármaco que más baja la presión arterial.', FALSE, 'Reducir el ARNI es el último paso, no el primero.', 0),
      (v_pregunta, 'Suspender el betabloqueador, porque la hipotensión es su efecto adverso más frecuente.', FALSE, 'El betabloqueador aporta pronóstico; no se retira primero.', 1),
      (v_pregunta, 'Aumentar el diurético para mejorar el gasto cardíaco y así subir la presión arterial.', FALSE, 'Sin congestión, el diurético se reduce, no se aumenta.', 2),
      (v_pregunta, 'Retirar la tamsulosina y el nitrato, que bajan la presión sin aportar pronóstico.', TRUE, 'Correcto. Luego, si no hay congestión, reducir el diurético.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Tres semanas después de iniciar sacubitrilo/valsartán, la creatinina de un paciente estable sube de 1,2 a 1,5 mg/dL. No tiene hipotensión ni oliguria. ¿Qué análisis es correcto?';
    v_t4 := 'Al iniciar fármacos que actúan sobre la hemodinámica renal es habitual un aumento pequeño de la creatinina. Para los inhibidores del SRAA se considera aceptable un aumento de hasta 50 % sobre el basal, o hasta 3,5 mg/dL, o una TFG de hasta 25, si el paciente está estable. Preocupa con hipotensión, deshidratación, oliguria o tras un AINE o contraste.';
    v_j1 := $evfic_json${"external_id":"fic-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Función renal y terapia fundamental: la caída esperada de la TFG y cuándo preocuparse","outcome":"Función renal y terapia fundamental: la caída esperada de la TFG y cuándo preocuparse","source":"Guía ESC 2021, recomendaciones prácticas."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un aumento aceptable (25 %): se continúa el tratamiento y se vigila la función renal.', TRUE, 'Correcto. Se acepta hasta un 50 % sobre el basal si el paciente está estable.', 0),
      (v_pregunta, 'Es una lesión renal aguda y el ARNI debe suspenderse de forma definitiva de inmediato.', FALSE, 'Un aumento moderado en un paciente estable es esperable.', 1),
      (v_pregunta, 'Es una señal de deshidratación y hay que suspender la furosemida aunque tenga congestión.', FALSE, 'No hay datos de deshidratación ni de oliguria.', 2),
      (v_pregunta, 'Es un error del laboratorio, porque los inhibidores del SRAA no modifican la creatinina.', FALSE, 'Estos fármacos sí producen un aumento inicial de la creatinina.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con ARNI, espironolactona, carvedilol, dapagliflozina y furosemida llega con potasio de 5,8 mmol/L. Lleva cinco días con diclofenaco y usa un sustituto de sal con potasio. ¿Cuál es la mejor propuesta?';
    v_t4 := 'Ante hiperpotasemia: confirmar (la hemólisis puede elevar el valor) y pedir ECG; buscar causas (AINE, sustitutos de sal con potasio, trimetoprim/sulfametoxazol, deshidratación); y ajustar según la ficha técnica: la espironolactona se suspende o interrumpe si el potasio supera 5 mEq/L.';
    v_j1 := $evfic_json${"external_id":"fic-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Hiperpotasemia en IC: umbrales de acción, ajuste de ARM y ARNI/IECA, y quelantes de potasio","outcome":"Hiperpotasemia en IC: umbrales de acción, ajuste de ARM y ARNI/IECA, y quelantes de potasio","source":"Ficha técnica de espironolactona; Guía ESC 2021."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Suspender los cuatro pilares de forma definitiva, porque el paciente no tolera la terapia fundamental.', FALSE, 'Suspender todo de forma definitiva quita el beneficio pronóstico.', 0),
      (v_pregunta, 'Mantener todo igual y repetir el potasio en tres meses, porque la hiperpotasemia es leve.', FALSE, 'Con 5,8 mmol/L hay que actuar ya.', 1),
      (v_pregunta, 'Confirmar el potasio con ECG, suspender el diclofenaco y el sustituto de sal e interrumpir la espironolactona.', TRUE, 'Correcto. Luego se reevalúa reintroducir con controles.', 2),
      (v_pregunta, 'Agregar un suplemento de magnesio, que compensa el exceso de potasio y protege el ritmo cardíaco.', FALSE, 'El magnesio no corrige la hiperpotasemia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fic-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. IC descompensada, terapias adicionales e IC con FEVI preservada' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. IC descompensada, terapias adicionales e IC con FEVI preservada) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · IC descompensada, terapias adicionales e IC con FEVI preservada';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 4, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 4, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := 'En la IC descompensada, ¿qué describe el perfil clínico «caliente y húmedo»?';
    v_t4 := 'Los perfiles de Stevenson combinan congestión (húmedo o seco) y perfusión (caliente o frío). El caliente y húmedo, con congestión y buena perfusión, es el más frecuente. Signos de congestión: ortopnea, crepitantes, ingurgitación yugular, edemas; de hipoperfusión: extremidades frías, oliguria, confusión.';
    v_j1 := $evfic_json${"external_id":"fic-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"IC descompensada: perfiles clínicos, desencadenantes, diuréticos intravenosos, vasodilatadores e inotrópicos","outcome":"IC descompensada: perfiles clínicos, desencadenantes, diuréticos intravenosos, vasodilatadores e inotrópicos","source":"Guía ESC 2021; Guía ESC 2026."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Hipoperfusión con extremidades frías y oliguria, sin signos de congestión pulmonar.', FALSE, 'Ese sería un paciente frío y seco.', 0),
      (v_pregunta, 'Fiebre por una infección respiratoria que precipita la descompensación de la IC.', FALSE, 'El perfil no se refiere a la temperatura corporal.', 1),
      (v_pregunta, 'Congestión con buena perfusión, que es el perfil más frecuente en la práctica.', TRUE, 'Correcto. Se trata sobre todo con diuréticos.', 2),
      (v_pregunta, 'Congestión con hipoperfusión, que suele requerir inotrópicos desde el ingreso.', FALSE, 'Ese es el perfil frío y húmedo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con IC sintomática y FEVI de 32 % tiene ferritina de 160 ng/mL y saturación de transferrina de 15 %. ¿Cómo se interpreta según los criterios de las guías ESC?';
    v_t4 := 'El criterio de las guías ESC para déficit de hierro en IC es ferritina menor de 100 ng/mL, o entre 100 y 299 ng/mL con TSAT menor de 20 %. Es distinto al de la población general porque la ferritina sube con la inflamación. La actualización 2023 recomienda hierro intravenoso en pacientes sintomáticos con FEVI reducida o levemente reducida y déficit.';
    v_j1 := $evfic_json${"external_id":"fic-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Déficit de hierro en IC: diagnóstico con ferritina y saturación de transferrina, y hierro intravenoso","outcome":"Déficit de hierro en IC: diagnóstico con ferritina y saturación de transferrina, y hierro intravenoso","source":"Guía ESC 2021 y actualización 2023."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tiene déficit de hierro, porque la ferritina está entre 100 y 299 con TSAT menor de 20 %.', TRUE, 'Correcto. Y puede beneficiarse del hierro intravenoso.', 0),
      (v_pregunta, 'No tiene déficit de hierro, porque la ferritina supera el valor normal de la población general.', FALSE, 'En IC el criterio es distinto al de la población general.', 1),
      (v_pregunta, 'Tiene déficit de hierro solo si además tiene anemia con hemoglobina menor de 10 g/dL.', FALSE, 'El déficit de hierro puede existir sin anemia.', 2),
      (v_pregunta, 'No puede interpretarse, porque la ferritina no se usa en pacientes con IC por la inflamación.', FALSE, 'Se usa, con un criterio adaptado a la inflamación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con FEVI de 30 %, en fibrilación auricular, sigue con frecuencia de 96 lpm pese al betabloqueador. El médico pregunta si agregar ivabradina. ¿Qué análisis es correcto?';
    v_t4 := 'La ivabradina reduce la frecuencia al inhibir la corriente If del nodo sinusal. La guía ESC 2021 la recomienda en pacientes sintomáticos con FEVI ≤35 %, en ritmo sinusal y con frecuencia ≥70 lpm pese a la dosis máxima tolerada de betabloqueador. No sirve en fibrilación auricular y no reemplaza al betabloqueador.';
    v_j1 := $evfic_json${"external_id":"fic-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Terapia médica adicional en FEVI reducida: ivabradina, vericiguat y digoxina/digitoxina","outcome":"Terapia médica adicional en FEVI reducida: ivabradina, vericiguat y digoxina/digitoxina","source":"Guía ESC 2021, terapia adicional."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Sí, porque la ivabradina baja la frecuencia en cualquier ritmo y no reduce la presión.', FALSE, 'La ivabradina actúa sobre el nodo sinusal.', 0),
      (v_pregunta, 'No, porque la ivabradina requiere ritmo sinusal y no sirve en fibrilación auricular.', TRUE, 'Correcto. Además no reemplaza al betabloqueador.', 1),
      (v_pregunta, 'Sí, porque la ivabradina reemplaza al betabloqueador cuando la frecuencia sigue alta.', FALSE, 'La ivabradina no reemplaza al betabloqueador.', 2),
      (v_pregunta, 'No, porque la ivabradina solo se usa en IC con FEVI preservada y frecuencia alta.', FALSE, 'Se usa en FEVI reducida, con ritmo sinusal.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para una mujer de 74 años con IC y FEVI de 58 %, sintomática, con potasio de 4,4 y TFG de 55, ¿cuál propuesta es la más coherente con las guías?';
    v_t4 := 'Los iSGLT2 tienen recomendación clase I en todo el espectro de la IC y la Guía ESC 2026 da a los ARM clase I independientemente de la FEVI; según los resúmenes, iSGLT2 y ARM son la terapia fundamental en FEVIp. Los diuréticos alivian la congestión y se tratan las comorbilidades.';
    v_j1 := $evfic_json${"external_id":"fic-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Tratamiento de la IC con FEVI preservada (y del antiguo rango levemente reducido): iSGLT2, ARM, diuréticos, comorbilidades y aGLP-1","outcome":"Tratamiento de la IC con FEVI preservada (y del antiguo rango levemente reducido): iSGLT2, ARM, diuréticos, comorbilidades y aGLP-1","source":"Guía ESC 2023; Guía ESC 2026."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo un diurético de asa a dosis alta, porque en FEVI preservada no hay fármacos con beneficio.', FALSE, 'Ya hay fármacos con beneficio demostrado en FEVIp.', 0),
      (v_pregunta, 'Un ARNI y un betabloqueador a dosis objetivo, igual que en la FEVI reducida.', FALSE, 'La terapia de la FEVIp no es la misma de la FEVIr.', 1),
      (v_pregunta, 'Ivabradina para bajar la frecuencia y digoxina para mejorar la contractilidad.', FALSE, 'No son la terapia con evidencia en FEVIp.', 2),
      (v_pregunta, 'Un iSGLT2 y un antagonista mineralocorticoide, con diurético si hay congestión.', TRUE, 'Correcto. Con control de potasio y creatinina.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fic-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Seguridad, seguimiento farmacoterapéutico y educación del paciente con IC' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Seguridad, seguimiento farmacoterapéutico y educación del paciente con IC) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Seguridad, seguimiento farmacoterapéutico y educación del paciente con IC';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 5, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 5, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Cómo debe pesarse un paciente con IC y cuándo debe avisar al equipo de salud?';
    v_t4 := 'El paciente se pesa cada mañana, después de orinar y antes de desayunar, y lo anota. Un aumento rápido (por ejemplo, más de 2 kg en 3 días) puede indicar retención de líquidos y debe avisarse al equipo, según el plan escrito acordado con el médico.';
    v_j1 := $evfic_json${"external_id":"fic-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Educación al paciente con IC y autocuidado: signos de alarma, peso diario, sal, adherencia y vacunación","outcome":"Educación al paciente con IC y autocuidado: signos de alarma, peso diario, sal, adherencia y vacunación","source":"Guía ESC 2026, educación y autocuidado."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Una vez por semana, en la noche y vestido, y avisar si sube más de 5 kg en un mes.', FALSE, 'El peso es diario y en condiciones constantes.', 0),
      (v_pregunta, 'Solo cuando note hinchazón en las piernas, para confirmar si está reteniendo líquido.', FALSE, 'El peso diario detecta la retención antes que la hinchazón.', 1),
      (v_pregunta, 'Cada vez que vaya a la farmacia, para que el QF registre el peso en el programa.', FALSE, 'El paciente debe pesarse en casa cada día.', 2),
      (v_pregunta, 'Cada mañana después de orinar y antes de desayunar, y avisar si sube más de 2 kg en 3 días.', TRUE, 'Correcto. Según el plan escrito acordado con el médico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con IC y diabetes toma pioglitazona 30 mg desde hace dos años. ¿Qué propone el QF?';
    v_t4 := 'Las tiazolidinedionas como la pioglitazona retienen sodio y agua y no se recomiendan en IC. En diabetes con IC, los iSGLT2 tienen beneficio demostrado y son la alternativa preferida.';
    v_j1 := $evfic_json${"external_id":"fic-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Fármacos que causan o empeoran la insuficiencia cardíaca","outcome":"Fármacos que causan o empeoran la insuficiencia cardíaca","source":"Guía ESC 2021; consenso del European Journal of Heart Failure de 2025."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Proponer al médico retirarla, porque retiene líquidos y no se recomienda en IC.', TRUE, 'Correcto. Existen alternativas con beneficio en IC, como los iSGLT2.', 0),
      (v_pregunta, 'Mantenerla, porque no causa hipoglucemia y mejora la sensibilidad a la insulina.', FALSE, 'Su efecto en la glucosa no compensa el riesgo en IC.', 1),
      (v_pregunta, 'Duplicar la dosis para controlar mejor la glucosa y así proteger el corazón.', FALSE, 'Subir la dosis aumentaría la retención de líquidos.', 2),
      (v_pregunta, 'Cambiarla por una sulfonilurea, que tiene el mismo efecto sin ningún riesgo en la IC.', FALSE, 'Las sulfonilureas tienen sus propios riesgos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con digoxina, carvedilol y furosemida consulta por náuseas, inapetencia y visión amarillenta. Su potasio es de 3,2 mmol/L. ¿Qué análisis hace el QF?';
    v_t4 := 'La hipopotasemia por furosemida favorece la toxicidad digitálica; el carvedilol aumenta la exposición a la digoxina hasta un 20 % y la espironolactona prolonga su semivida. Náuseas, inapetencia y alteraciones visuales sugieren toxicidad: se remite y se mide la digoxinemia.';
    v_j1 := $evfic_json${"external_id":"fic-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Interacciones clínicamente relevantes en IC y notificación de eventos adversos al INVIMA","outcome":"Interacciones clínicamente relevantes en IC y notificación de eventos adversos al INVIMA","source":"Fichas técnicas de carvedilol, furosemida y espironolactona."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un efecto esperado del carvedilol al inicio y desaparece con las semanas.', FALSE, 'Esos síntomas no son los efectos esperados del carvedilol.', 0),
      (v_pregunta, 'Puede ser una toxicidad por digoxina, favorecida por la hipopotasemia y por el carvedilol.', TRUE, 'Correcto. Se remite y se sugiere digoxinemia.', 1),
      (v_pregunta, 'Es una gastritis por la furosemida y basta con tomarla con el estómago lleno.', FALSE, 'La visión amarillenta orienta a toxicidad digitálica.', 2),
      (v_pregunta, 'Es una reacción alérgica a la furosemida por ser una sulfonamida y debe cambiarse.', FALSE, 'El cuadro no corresponde a una alergia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un programa de IC propone controlar el potasio y la creatinina de los pacientes con espironolactona «una vez al año». ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'La ficha técnica de espironolactona pide controlar potasio y creatinina a la semana de iniciar o aumentar la dosis, cada mes los primeros 3 meses, cada 3 meses durante el primer año y luego cada 6 meses.';
    v_j1 := $evfic_json${"external_id":"fic-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Seguimiento farmacoterapéutico del paciente con IC: parámetros, adherencia, polifarmacia y continuidad","outcome":"Seguimiento farmacoterapéutico del paciente con IC: parámetros, adherencia, polifarmacia y continuidad","source":"Ficha técnica de espironolactona."}$evfic_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fic-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es suficiente, porque la espironolactona a 25 mg casi nunca altera el potasio.', FALSE, 'La hiperpotasemia es uno de sus riesgos principales.', 0),
      (v_pregunta, 'Es suficiente si el paciente toma sustitutos de sal con potasio para evitar la hipopotasemia.', FALSE, 'Los sustitutos de sal con potasio aumentan el riesgo.', 1),
      (v_pregunta, 'Es insuficiente: la ficha técnica pide control a la semana, mensual 3 meses, trimestral el primer año y luego semestral.', TRUE, 'Correcto. Y también tras cada aumento de dosis.', 2),
      (v_pregunta, 'Es excesivo: con un control al iniciar basta, porque después el potasio se estabiliza.', FALSE, 'El riesgo persiste y exige controles periódicos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fic-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: fisiopatología, definición, diagnóstico y clasificación de la insuficiencia cardíaca' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: fisiopatología, definición, diagnóstico y clasificación de la insuficiencia cardíaca) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Diagnóstico, clasificación y revisión de la fórmula';
  v_t2 := $evfic_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Explica por qué los datos confirman la IC y qué estudio la confirmó.</li><li>Clasifica a Don Alirio por etapa, clase NYHA y FEVI (con la guía ESC 2021 y con la Guía ESC 2026).</li><li>Identifica los medicamentos de su fórmula que pueden causar o empeorar la IC y explica el mecanismo.</li><li>Analiza el hallazgo de la ferritina y qué estudio complementario propones.</li><li>Señala qué pilares de la terapia fundamental le faltan.</li><li>Redacta la nota al médico con tus propuestas priorizadas.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar la IC por etapa, clase funcional y FEVI.</li><li>Identificar medicamentos que causan o empeoran la IC.</li><li>Proponer al médico los cambios y los estudios pendientes.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Diagnóstico y clasificación</td><td>25 %</td><td>Explica la confirmación con péptido y ecocardiograma y clasifica correctamente en etapa, NYHA y FEVI con ambas guías.</td><td>Clasificación correcta con justificación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Medicamentos que empeoran la IC</td><td>25 %</td><td>Identifica la pioglitazona y el celecoxib, con su mecanismo, y propone retirarlos.</td><td>Identifica uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Hierro y pilares</td><td>25 %</td><td>Reconoce el posible déficit de hierro (ferritina menor de 100) y los pilares que faltan.</td><td>Reconoce los pilares sin abordar el hierro.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Nota al médico</td><td>15 %</td><td>Propuestas priorizadas, claras y con seguimiento.</td><td>Nota correcta sin priorizar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfic_html$;
  v_t3 := $evfic_html$<h2>Caso de estudio</h2>
<p>Don Alirio tiene 71 años, vive en Pereira y tiene hipertensión, diabetes tipo 2 y artrosis (datos simulados). Consulta por disnea al subir un piso, ortopnea de dos almohadas y edemas en tobillos. Toma enalapril 5 mg cada 12 horas, metformina 850 mg cada 12 horas, pioglitazona 30 mg al día y celecoxib 200 mg al día que le recomendó un vecino. Exámenes: NT-proBNP 1.900 pg/mL, FEVI 33 %, TFG 62 mL/min/1,73 m², potasio 4,5 mmol/L, hemoglobina 12,0 g/dL, ferritina 70 ng/mL.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfic_html$;
  v_t4 := 'Informe de evaluación inicial con nota al médico.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfic_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guía ESC 2021 de insuficiencia cardíaca y su actualización de 2023; Guía ESC 2026 de insuficiencia cardíaca y Segunda Definición Universal de IC (2026); vía de decisión del ACC de 2024; fichas técnicas e insertos aprobados por el INVIMA de sacubitrilo/valsartán, carvedilol, espironolactona, dapagliflozina y furosemida; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfic_html$;
  v_t7 := NULL;
  v_j1 := $evfic_json$["Confirmación diagnóstica.","Clasificación.","Medicamentos que empeoran la IC.","Déficit de hierro.","Pilares faltantes y nota."]$evfic_json$::jsonb;
  v_j2 := $evfic_json${"version":1,"total":100,"criteria":[{"id":"diagnostico-y-clasificacion","name":"Diagnóstico y clasificación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica la confirmación con péptido y ecocardiograma y clasifica correctamente en etapa, NYHA y FEVI con ambas guías."},{"level":3,"label":"Logrado","description":"Clasificación correcta con justificación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"medicamentos-que-empeoran-la-ic","name":"Medicamentos que empeoran la IC","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica la pioglitazona y el celecoxib, con su mecanismo, y propone retirarlos."},{"level":3,"label":"Logrado","description":"Identifica uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"hierro-y-pilares","name":"Hierro y pilares","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce el posible déficit de hierro (ferritina menor de 100) y los pilares que faltan."},{"level":3,"label":"Logrado","description":"Reconoce los pilares sin abordar el hierro."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"nota-al-medico","name":"Nota al médico","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Propuestas priorizadas, claras y con seguimiento."},{"level":3,"label":"Logrado","description":"Nota correcta sin priorizar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfic_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 1, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 1, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fic-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Terapia médica fundamental en la IC con FEVI reducida: los cuatro pilares' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Terapia médica fundamental en la IC con FEVI reducida: los cuatro pilares) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Plan de inicio de la terapia fundamental';
  v_t2 := $evfic_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Verifica, para cada pilar, si los datos de Doña Amparo permiten iniciarlo según la ficha técnica.</li><li>Define la dosis inicial de sacubitrilo/valsartán y justifícala (venía con losartán 25 mg).</li><li>Elige el betabloqueador con evidencia, su dosis de inicio y su meta.</li><li>Define el inicio del ARM y del iSGLT2 con sus condiciones.</li><li>Propone la secuencia de las primeras 6 semanas con los controles de laboratorio.</li><li>Prepara la educación para Doña Amparo: para qué sirve cada medicamento y qué síntomas reportar.</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Verificar los requisitos de seguridad de cada pilar.</li><li>Proponer dosis de inicio, secuencia y titulación.</li><li>Diseñar los controles y la educación del plan.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Requisitos de seguridad</td><td>20 %</td><td>Verifica presión, potasio, frecuencia, creatinina y TFG frente a los umbrales de cada ficha técnica.</td><td>Verifica la mayoría de los requisitos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Dosis de inicio</td><td>25 %</td><td>ARNI 24/26 mg cada 12 h (venía con ARA-II a dosis baja), betabloqueador con evidencia a dosis baja, espironolactona 25 mg y dapagliflozina 10 mg.</td><td>Dosis correctas con un error menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Secuencia y controles</td><td>30 %</td><td>Secuencia en pocas semanas, aumentos cada 1-2 o 2-4 semanas según el fármaco y controles de potasio y creatinina a la semana.</td><td>Secuencia razonable con controles incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Educación</td><td>15 %</td><td>Explica para qué sirve cada medicamento, efectos esperados y signos de alarma.</td><td>Educación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfic_html$;
  v_t3 := $evfic_html$<h2>Caso de estudio</h2>
<p>Doña Amparo tiene 61 años, vive en Villavicencio y acaba de recibir el diagnóstico de IC con FEVI de 27 % por miocardiopatía isquémica (datos simulados). NYHA II, sin congestión. Presión 116/72 mmHg, frecuencia 92 lpm en ritmo sinusal, potasio 4,5 mmol/L, creatinina 1,1 mg/dL (TFG 58), sin diabetes. Toma losartán 25 mg al día, atorvastatina 40 mg y ácido acetilsalicílico 100 mg. El médico quiere cambiar a sacubitrilo/valsartán e iniciar el resto de la terapia fundamental, y pide al servicio farmacéutico un plan.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfic_html$;
  v_t4 := 'Plan de inicio y titulación de la terapia fundamental con controles y educación.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfic_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guía ESC 2021 de insuficiencia cardíaca y su actualización de 2023; Guía ESC 2026 de insuficiencia cardíaca y Segunda Definición Universal de IC (2026); vía de decisión del ACC de 2024; fichas técnicas e insertos aprobados por el INVIMA de sacubitrilo/valsartán, carvedilol, espironolactona, dapagliflozina y furosemida; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfic_html$;
  v_t7 := NULL;
  v_j1 := $evfic_json$["Requisitos de seguridad.","ARNI: dosis y justificación.","Betabloqueador, ARM e iSGLT2.","Secuencia y controles.","Educación."]$evfic_json$::jsonb;
  v_j2 := $evfic_json${"version":1,"total":100,"criteria":[{"id":"requisitos-de-seguridad","name":"Requisitos de seguridad","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Verifica presión, potasio, frecuencia, creatinina y TFG frente a los umbrales de cada ficha técnica."},{"level":3,"label":"Logrado","description":"Verifica la mayoría de los requisitos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"dosis-de-inicio","name":"Dosis de inicio","weight":25,"levels":[{"level":4,"label":"Destacado","description":"ARNI 24/26 mg cada 12 h (venía con ARA-II a dosis baja), betabloqueador con evidencia a dosis baja, espironolactona 25 mg y dapagliflozina 10 mg."},{"level":3,"label":"Logrado","description":"Dosis correctas con un error menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"secuencia-y-controles","name":"Secuencia y controles","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Secuencia en pocas semanas, aumentos cada 1-2 o 2-4 semanas según el fármaco y controles de potasio y creatinina a la semana."},{"level":3,"label":"Logrado","description":"Secuencia razonable con controles incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"educacion","name":"Educación","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Explica para qué sirve cada medicamento, efectos esperados y signos de alarma."},{"level":3,"label":"Logrado","description":"Educación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfic_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 2, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 2, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fic-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. IC descompensada, terapias adicionales e IC con FEVI preservada' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. IC descompensada, terapias adicionales e IC con FEVI preservada) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Conciliación y plan de transición al alta';
  v_t2 := $evfic_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Concilia la medicación de ingreso e identifica posibles desencadenantes de la descompensación.</li><li>Propone qué suspender o cambiar (incluido el betabloqueador sin evidencia) y justifícalo.</li><li>Propone los pilares que deben quedar iniciados antes del alta, con sus dosis y requisitos.</li><li>Revisa los antidiabéticos según la TFG y la IC.</li><li>Define el plan de diurético y el peso de alta.</li><li>Diseña la educación (peso diario, signos de alarma, adherencia al diurético) y el control en 1-2 semanas.</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Conciliar la medicación y detectar desencadenantes de la descompensación.</li><li>Proponer la optimización de la terapia fundamental antes del alta.</li><li>Diseñar el plan de seguimiento temprano y la educación.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Conciliación y desencadenantes</td><td>20 %</td><td>Identifica la omisión del diurético y el ibuprofeno como desencadenantes probables.</td><td>Identifica uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Optimización</td><td>30 %</td><td>Cambia metoprolol tartrato por bisoprolol (cardioselectivo por EPOC), plantea ARNI tras 36 h sin enalapril, inicia iSGLT2 y valora ARM.</td><td>Optimización correcta con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Antidiabéticos y diurético</td><td>20 %</td><td>Ajusta la metformina a la TFG, retira la glibenclamida y define el diurético con peso de alta.</td><td>Ajuste parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Educación y seguimiento</td><td>20 %</td><td>Educación práctica y control en 1-2 semanas con laboratorios.</td><td>Educación general sin fecha de control.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfic_html$;
  v_t3 := $evfic_html$<h2>Caso de estudio</h2>
<p>Don Eliécer tiene 69 años, vive en Montería y está hospitalizado por IC descompensada (datos simulados). FEVI 29 %, diabetes tipo 2, TFG 48, EPOC leve. Al ingreso tomaba enalapril 5 mg cada 12 h, metoprolol tartrato 50 mg cada 12 h, furosemida 40 mg (que omite cuando sale de casa), metformina 850 mg cada 8 h, glibenclamida 5 mg al día e ibuprofeno a necesidad. Al día 5 está euvolémico, con presión de 108/66 mmHg, frecuencia de 82 lpm, potasio de 4,2 mmol/L y peso de 71 kg. El alta está prevista en 48 horas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfic_html$;
  v_t4 := 'Plan de transición al alta con conciliación, optimización y seguimiento.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfic_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guía ESC 2021 de insuficiencia cardíaca y su actualización de 2023; Guía ESC 2026 de insuficiencia cardíaca y Segunda Definición Universal de IC (2026); vía de decisión del ACC de 2024; fichas técnicas e insertos aprobados por el INVIMA de sacubitrilo/valsartán, carvedilol, espironolactona, dapagliflozina y furosemida; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfic_html$;
  v_t7 := NULL;
  v_j1 := $evfic_json$["Conciliación y desencadenantes.","Suspensiones y cambios.","Pilares antes del alta.","Antidiabéticos y diurético.","Educación y seguimiento."]$evfic_json$::jsonb;
  v_j2 := $evfic_json${"version":1,"total":100,"criteria":[{"id":"conciliacion-y-desencadenantes","name":"Conciliación y desencadenantes","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Identifica la omisión del diurético y el ibuprofeno como desencadenantes probables."},{"level":3,"label":"Logrado","description":"Identifica uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"optimizacion","name":"Optimización","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cambia metoprolol tartrato por bisoprolol (cardioselectivo por EPOC), plantea ARNI tras 36 h sin enalapril, inicia iSGLT2 y valora ARM."},{"level":3,"label":"Logrado","description":"Optimización correcta con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"antidiabeticos-y-diuretico","name":"Antidiabéticos y diurético","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Ajusta la metformina a la TFG, retira la glibenclamida y define el diurético con peso de alta."},{"level":3,"label":"Logrado","description":"Ajuste parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"educacion-y-seguimiento","name":"Educación y seguimiento","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Educación práctica y control en 1-2 semanas con laboratorios."},{"level":3,"label":"Logrado","description":"Educación general sin fecha de control."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfic_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 4, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 4, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fic-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Implementación segura: titulación, diuréticos, potasio y función renal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Implementación segura: titulación, diuréticos, potasio y función renal) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: clasificación, terapia fundamental y titulación de Don Hernán';
  v_t2 := $evfic_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y clasifica la IC de Don Hernán (etapa, NYHA si la puedes estimar, FEVI).</li><li>Fase 1: identifica los medicamentos de su fórmula o de su automedicación que empeoran la IC.</li><li>Fase 2: señala los pilares presentes y faltantes y propone dosis de inicio y objetivo de cada uno.</li><li>Fase 3: propone la secuencia de titulación de las próximas 6 semanas con controles de presión, frecuencia, potasio y creatinina.</li><li>Fase 3: explica qué aumento de creatinina aceptarías y qué harías ante hiperpotasemia.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (clasificación).</strong> Etapa, clase NYHA, FEVI y medicamentos que empeoran la IC.</li>
  <li><strong>Fase 2 · Unidad 2 (cuatro pilares).</strong> Pilares presentes y faltantes, con dosis de inicio y objetivo.</li>
  <li><strong>Fase 3 · Unidad 3 (implementación segura).</strong> Secuencia de titulación, diurético, potasio y función renal.</li>
  <li><strong>Fase 4 · Unidad 4 (terapias adicionales).</strong> Déficit de hierro y conducta ante una descompensación.</li>
  <li><strong>Fase 5 · Unidad 5 (seguimiento).</strong> Seguimiento farmacoterapéutico, interacciones, farmacovigilancia y educación.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar la IC y revisar la fórmula de alta.</li><li>Proponer y secuenciar la terapia fundamental con seguridad.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 6 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 8 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 8 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Clasificación y fórmula</td><td>20 %</td><td>Clasifica correctamente e identifica el naproxeno y la glibenclamida como problemas.</td><td>Clasificación correcta con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Pilares</td><td>30 %</td><td>Propone ARNI tras 36 h sin enalapril, iSGLT2, ARM y titulación del carvedilol, con dosis de inicio y objetivo.</td><td>Propuesta correcta con dosis incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Titulación y seguridad</td><td>30 %</td><td>Secuencia realista con controles y umbrales de creatinina y potasio según las guías y las fichas técnicas.</td><td>Secuencia correcta con umbrales imprecisos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Coherencia renal</td><td>10 %</td><td>Ajusta la metformina a la TFG y explica el aumento inicial esperado de la creatinina.</td><td>Ajuste parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfic_html$;
  v_t3 := $evfic_html$<h2>Caso de estudio</h2>
<p>Don Hernán tiene 66 años, vive en Bogotá y fue dado de alta hace una semana de su primera hospitalización por IC (datos simulados). FEVI 31 %, hipertensión, diabetes tipo 2 y ERC (TFG 46). Sale con enalapril 10 mg cada 12 h, carvedilol 6,25 mg cada 12 h, furosemida 40 mg al día, metformina 850 mg cada 12 h y glibenclamida 5 mg al día. Peso de alta 78 kg. Ferritina 85 ng/mL. Toma naproxeno por dolor lumbar y le gusta cocinar con caldo en cubo. Su EPS lo asignó al programa de IC donde tú eres el QF responsable. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfic_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfic_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guía ESC 2021 de insuficiencia cardíaca y su actualización de 2023; Guía ESC 2026 de insuficiencia cardíaca y Segunda Definición Universal de IC (2026); vía de decisión del ACC de 2024; fichas técnicas e insertos aprobados por el INVIMA de sacubitrilo/valsartán, carvedilol, espironolactona, dapagliflozina y furosemida; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfic_html$;
  v_t7 := NULL;
  v_j1 := $evfic_json$["Clasificación.","Medicamentos que empeoran la IC.","Pilares y dosis.","Titulación y umbrales de laboratorio."]$evfic_json$::jsonb;
  v_j2 := $evfic_json${"version":1,"total":100,"criteria":[{"id":"clasificacion-y-formula","name":"Clasificación y fórmula","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Clasifica correctamente e identifica el naproxeno y la glibenclamida como problemas."},{"level":3,"label":"Logrado","description":"Clasificación correcta con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"pilares","name":"Pilares","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Propone ARNI tras 36 h sin enalapril, iSGLT2, ARM y titulación del carvedilol, con dosis de inicio y objetivo."},{"level":3,"label":"Logrado","description":"Propuesta correcta con dosis incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"titulacion-y-seguridad","name":"Titulación y seguridad","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Secuencia realista con controles y umbrales de creatinina y potasio según las guías y las fichas técnicas."},{"level":3,"label":"Logrado","description":"Secuencia correcta con umbrales imprecisos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"coherencia-renal","name":"Coherencia renal","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Ajusta la metformina a la TFG y explica el aumento inicial esperado de la creatinina."},{"level":3,"label":"Logrado","description":"Ajuste parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfic_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 13, 8)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 13, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 8,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fic-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Seguridad, seguimiento farmacoterapéutico y educación del paciente con IC' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Seguridad, seguimiento farmacoterapéutico y educación del paciente con IC) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan integral de seguimiento de Don Hernán';
  v_t2 := $evfic_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: interpreta la ferritina, define qué estudio falta y si estaría indicado el hierro intravenoso.</li><li>Fase 4: define el plan escrito ante el aumento de peso o los signos de descompensación.</li><li>Fase 5: diseña el seguimiento farmacoterapéutico (parámetros, frecuencia, interacciones a vigilar) y el plan de farmacovigilancia.</li><li>Fase 5: prepara la educación (peso diario, sal y caldo en cubo, adherencia, vacunación, automedicación).</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (clasificación).</strong> Etapa, clase NYHA, FEVI y medicamentos que empeoran la IC.</li>
  <li><strong>Fase 2 · Unidad 2 (cuatro pilares).</strong> Pilares presentes y faltantes, con dosis de inicio y objetivo.</li>
  <li><strong>Fase 3 · Unidad 3 (implementación segura).</strong> Secuencia de titulación, diurético, potasio y función renal.</li>
  <li><strong>Fase 4 · Unidad 4 (terapias adicionales).</strong> Déficit de hierro y conducta ante una descompensación.</li>
  <li><strong>Fase 5 · Unidad 5 (seguimiento).</strong> Seguimiento farmacoterapéutico, interacciones, farmacovigilancia y educación.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar las terapias adicionales y la conducta ante la descompensación.</li><li>Diseñar un plan de seguimiento, farmacovigilancia y educación.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 8 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 16 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 16 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Integración y mejora</td><td>15 %</td><td>Integra las cinco fases y documenta cada corrección.</td><td>Integra y corrige lo principal.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Hierro y descompensación</td><td>20 %</td><td>Interpreta la ferritina con el criterio ESC, pide TSAT y define un plan escrito ante el aumento de peso.</td><td>Correcto con un plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Seguimiento farmacoterapéutico</td><td>25 %</td><td>Parámetros clínicos y de laboratorio con frecuencias de las fichas técnicas e interacciones a vigilar.</td><td>Seguimiento correcto pero poco sistemático.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Farmacovigilancia y educación</td><td>30 %</td><td>Reacciones a vigilar con su canal de reporte y educación práctica adaptada a sus hábitos.</td><td>Educación o farmacovigilancia incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfic_html$;
  v_t3 := $evfic_html$<h2>Caso de estudio</h2>
<p>Don Hernán tiene 66 años, vive en Bogotá y fue dado de alta hace una semana de su primera hospitalización por IC (datos simulados). FEVI 31 %, hipertensión, diabetes tipo 2 y ERC (TFG 46). Sale con enalapril 10 mg cada 12 h, carvedilol 6,25 mg cada 12 h, furosemida 40 mg al día, metformina 850 mg cada 12 h y glibenclamida 5 mg al día. Peso de alta 78 kg. Ferritina 85 ng/mL. Toma naproxeno por dolor lumbar y le gusta cocinar con caldo en cubo. Su EPS lo asignó al programa de IC donde tú eres el QF responsable. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité del programa de IC.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfic_html$;
  v_t4 := 'Plan integral de seguimiento con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfic_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guía ESC 2021 de insuficiencia cardíaca y su actualización de 2023; Guía ESC 2026 de insuficiencia cardíaca y Segunda Definición Universal de IC (2026); vía de decisión del ACC de 2024; fichas técnicas e insertos aprobados por el INVIMA de sacubitrilo/valsartán, carvedilol, espironolactona, dapagliflozina y furosemida; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfic_html$;
  v_t7 := NULL;
  v_j1 := $evfic_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Hierro y plan ante descompensación.","Seguimiento farmacoterapéutico.","Farmacovigilancia y educación.","Resumen ejecutivo."]$evfic_json$::jsonb;
  v_j2 := $evfic_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"hierro-y-descompensacion","name":"Hierro y descompensación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Interpreta la ferritina con el criterio ESC, pide TSAT y define un plan escrito ante el aumento de peso."},{"level":3,"label":"Logrado","description":"Correcto con un plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguimiento-farmacoterapeutico","name":"Seguimiento farmacoterapéutico","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Parámetros clínicos y de laboratorio con frecuencias de las fichas técnicas e interacciones a vigilar."},{"level":3,"label":"Logrado","description":"Seguimiento correcto pero poco sistemático."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacovigilancia-y-educacion","name":"Farmacovigilancia y educación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Reacciones a vigilar con su canal de reporte y educación práctica adaptada a sus hábitos."},{"level":3,"label":"Logrado","description":"Educación o farmacovigilancia incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfic_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 15, 16)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 15, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 16,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Foro fic-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con la insuficiencia cardíaca';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfic_html$<h2>Para empezar</h2>
<p>Piensa en una persona con insuficiencia cardíaca que hayas atendido o acompañado y cuéntanos en tres o cuatro líneas una dificultad que tuvo con sus medicamentos, sin nombres ni datos que la identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfic_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre el tratamiento de la IC te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfic_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfic_html$;
  v_t6 := $evfic_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfic_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué te genera más dudas: iniciar los pilares, titularlos o manejar el potasio y la creatinina?', '¿Has participado en la conciliación de medicamentos de un paciente hospitalizado?']::text[];
  v_j1 := NULL;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, NULL, 'curso', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'formativa', NULL, v_j1,
       FALSE, FALSE, 'publicado', 0)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = NULL, scope = 'curso', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 0, updated_at = NOW()
     WHERE id = v_foro;
  END IF;


  -- ── Foro fic-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: fisiopatología, definición, diagnóstico y clasificación de la insuficiencia cardíaca' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: fisiopatología, definición, diagnóstico y clasificación de la insuficiencia cardíaca) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Cómo clasificar una FEVI de 45 %?';
  v_t2 := 'Argumentar cómo cambia la clasificación por FEVI entre guías y qué implica para el tratamiento.';
  v_t3 := $evfic_html$<h2>Caso del foro</h2>
<p>En una revisión de historias de un programa de IC aparecen tres pacientes sintomáticos con FEVI de 45 %, 38 % y 56 % (datos simulados). Un médico los clasifica con la guía ESC 2021 y otro con la Guía ESC 2026. El paciente con FEVI de 45 % recibe solo furosemida «porque no tiene FEVI reducida».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfic_html$;
  v_t4 := '¿Cómo clasificarías a cada paciente con cada guía y qué tratamiento debería recibir el de FEVI de 45 %?';
  v_t5 := $evfic_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el criterio de clasificación que usas y la guía de donde sale. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfic_html$;
  v_t6 := $evfic_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio de clasificación que usas y la guía de donde sale.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfic_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué significa «FEVI mejorada» y por qué no se suspende el tratamiento?', '¿Qué terapias tienen recomendación en todo el espectro de FEVI?', '¿Qué debe revisarse en el texto completo de la Guía ESC 2026 antes de cambiar un protocolo?']::text[];
  v_j1 := $evfic_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio de clasificación que usas y la guía de donde sale."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfic_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 1)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 1, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fic-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Terapia médica fundamental en la IC con FEVI reducida: los cuatro pilares' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Terapia médica fundamental en la IC con FEVI reducida: los cuatro pilares) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · ¿Los cuatro pilares de una vez o uno por uno?';
  v_t2 := 'Argumentar cómo iniciar la terapia fundamental de forma rápida y segura.';
  v_t3 := $evfic_html$<h2>Caso del foro</h2>
<p>Un hombre de 56 años con miocardiopatía dilatada nueva tiene FEVI de 30 %, NYHA II, presión de 112/70 mmHg, frecuencia de 90 lpm, potasio de 4,3 mmol/L y TFG de 75 (datos simulados). La cardióloga quiere iniciar los cuatro pilares en dos semanas; el médico tratante prefiere «subir el IECA al máximo y luego ver» como se hacía antes.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfic_html$;
  v_t4 := '¿Qué estrategia defenderías y cómo organizarías el inicio y los controles?';
  v_t5 := $evfic_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación o el ensayo que respalda tu estrategia. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfic_html$;
  v_t6 := $evfic_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el ensayo que respalda tu estrategia.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfic_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué fármaco no se titula y casi no baja la presión?', '¿Qué controles harías antes de cada inicio o aumento?', '¿Por qué conviene cambiar un medicamento a la vez durante la titulación?']::text[];
  v_j1 := $evfic_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el ensayo que respalda tu estrategia."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfic_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 2)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 2, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fic-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Implementación segura: titulación, diuréticos, potasio y función renal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Implementación segura: titulación, diuréticos, potasio y función renal) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · ¿Suspender por la creatinina o por el potasio?';
  v_t2 := 'Argumentar cuándo un cambio de laboratorio obliga a ajustar la terapia fundamental y cuándo no.';
  v_t3 := $evfic_html$<h2>Caso del foro</h2>
<p>En un programa de IC, el 40 % de los pacientes con FEVIr no recibe ARM y el 30 % recibe el ARNI a la dosis mínima desde hace un año (datos simulados). En las historias se lee: «creatinina subió de 1,1 a 1,4, se suspende IECA», «potasio 5,2, no iniciar ARM» y «presión 98/62 sin síntomas, no subir dosis».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfic_html$;
  v_t4 := '¿Cuáles de esas decisiones están justificadas y cuáles representan inercia terapéutica? ¿Qué propondrías?';
  v_t5 := $evfic_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación práctica o el dato de la ficha técnica que sustenta cada juicio. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfic_html$;
  v_t6 := $evfic_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación práctica o el dato de la ficha técnica que sustenta cada juicio.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfic_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué aumento de creatinina se considera aceptable con los inhibidores del SRAA?', '¿Qué hacer ante una presión de 98/62 sin síntomas?', '¿Qué estrategias permiten mantener los ARM en pacientes con riesgo de hiperpotasemia?']::text[];
  v_j1 := $evfic_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación práctica o el dato de la ficha técnica que sustenta cada juicio."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfic_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 3)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 3, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fic-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. IC descompensada, terapias adicionales e IC con FEVI preservada' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. IC descompensada, terapias adicionales e IC con FEVI preservada) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · La hospitalización como oportunidad';
  v_t2 := 'Argumentar qué debe estar resuelto antes del alta de un paciente hospitalizado por IC.';
  v_t3 := $evfic_html$<h2>Caso del foro</h2>
<p>Un hospital revisa 50 altas por IC con FEVIr (datos simulados): el 70 % sale sin iSGLT2, el 50 % sin ARM, el 80 % sin cita en las dos semanas siguientes y casi ninguno con peso de alta registrado. El servicio de medicina interna dice que «la titulación es tarea del cardiólogo de consulta externa».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfic_html$;
  v_t4 := '¿Qué debería incluir la lista de verificación del QF antes del alta y por qué no conviene dejar la titulación para después?';
  v_t5 := $evfic_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación o el ensayo que respalda cada punto de tu lista. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfic_html$;
  v_t6 := $evfic_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el ensayo que respalda cada punto de tu lista.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfic_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué recomienda la Guía ESC 2026 sobre el iSGLT2 durante la hospitalización?', '¿Qué mostró el ensayo STRONG-HF?', '¿Qué información debe llevarse el paciente al salir?']::text[];
  v_j1 := $evfic_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el ensayo que respalda cada punto de tu lista."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfic_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 4)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 4, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fic-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Seguridad, seguimiento farmacoterapéutico y educación del paciente con IC' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Seguridad, seguimiento farmacoterapéutico y educación del paciente con IC) en Farmacoterapia de la Insuficiencia Cardíaca: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Desprescribir sin quitar lo que salva vidas';
  v_t2 := 'Argumentar cómo reducir la polifarmacia en IC sin retirar la terapia fundamental.';
  v_t3 := $evfic_html$<h2>Caso del foro</h2>
<p>Doña Inés tiene 78 años, IC con FEVI de 30 %, fibrilación auricular, diabetes, artrosis y depresión (datos simulados). Toma 13 medicamentos: sacubitrilo/valsartán, bisoprolol, espironolactona, dapagliflozina, furosemida, apixabán, metformina, pioglitazona, naproxeno, pregabalina, omeprazol, un suplemento de potasio y un jarabe de calcio. Su hija pide «quitarle pastillas porque son demasiadas».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfic_html$;
  v_t4 := '¿Qué medicamentos propondrías retirar o revisar y cuáles defenderías aunque sean muchos?';
  v_t5 := $evfic_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación, la ficha técnica o el consenso que sustenta cada decisión. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfic_html$;
  v_t6 := $evfic_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación, la ficha técnica o el consenso que sustenta cada decisión.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfic_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué fármacos de la lista pueden empeorar la IC?', '¿Qué interacción ves entre el suplemento de potasio y otros medicamentos?', '¿Cómo explicarías a la hija por qué algunos medicamentos no se retiran?']::text[];
  v_j1 := $evfic_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación, la ficha técnica o el consenso que sustenta cada decisión."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfic_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 5)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 5, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  RAISE NOTICE 'Farmacoterapia de la Insuficiencia Cardíaca: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfic$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Farmacoterapia del Asma y la EPOC
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfae$
DECLARE
  v_curso    BIGINT;
  v_unidad   BIGINT;
  v_banco    BIGINT;
  v_pregunta BIGINT;
  v_eval     BIGINT;
  v_act      BIGINT;
  v_foro     BIGINT;
  v_t1 TEXT; v_t2 TEXT; v_t3 TEXT; v_t4 TEXT; v_t5 TEXT; v_t6 TEXT; v_t7 TEXT;
  v_j1 JSONB; v_j2 JSONB;
  v_a1 TEXT[];
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacoterapia del Asma y la EPOC' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos: asma, EPOC, diagnóstico diferencial y contexto colombiano', 'Unidad 2. Farmacología de broncodilatadores, corticoides inhalados y otros controladores', 'Unidad 3. Farmacoterapia del asma: tratamiento escalonado, MART y asma grave', 'Unidad 4. Farmacoterapia de la EPOC y manejo de exacerbaciones', 'Unidad 5. Dispositivos, adherencia, prevención y seguimiento farmacoterapéutico']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacoterapia del Asma y la EPOC: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfae_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfae_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fae-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: asma, EPOC, diagnóstico diferencial y contexto colombiano' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: asma, EPOC, diagnóstico diferencial y contexto colombiano) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos: asma, EPOC, diagnóstico diferencial y contexto colombiano';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 1, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 1, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := 'Según GINA 2026, ¿cuándo es positiva la prueba broncodilatadora en un adulto?';
    v_t4 := 'GINA 2026 exige síntomas variables y evidencia de limitación variable del flujo. En adultos, la prueba broncodilatadora es positiva si el FEV1 o la FVC aumentan 12 % o más y 200 mL o más (o el PEF 20 % o más). Una variabilidad del PEF en dos semanas mayor de 10 % también apoya el diagnóstico.';
    v_j1 := $evfae_json${"external_id":"fae-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Asma: definición, fenotipos y criterios diagnósticos según GINA 2026","outcome":"Asma: definición, fenotipos y criterios diagnósticos según GINA 2026","source":"GINA 2026, diagnóstico."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Cuando el FEV1 aumenta al menos 5 % después del broncodilatador, sin importar el volumen.', FALSE, 'El umbral en porcentaje es mayor y además exige un volumen mínimo.', 0),
      (v_pregunta, 'Cuando la relación FEV1/FVC posbroncodilatador queda por debajo de 0,70 de forma persistente.', FALSE, 'Ese es el criterio de obstrucción persistente de la EPOC.', 1),
      (v_pregunta, 'Cuando el FEV1 o la FVC aumentan 12 % o más y 200 mL o más respecto al valor basal.', TRUE, 'Correcto. También apoya el diagnóstico una variabilidad del PEF mayor de 10 %.', 2),
      (v_pregunta, 'Cuando el paciente refiere menos ahogo a los 15 minutos de usar el inhalador de rescate.', FALSE, 'La mejoría subjetiva no es el criterio de la prueba.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un hombre de 64 años, exfumador, con disnea y tos crónicas, tiene una espirometría posbroncodilatador con FEV1/FVC de 0,64. ¿Qué concluye el QF al revisar el resultado?';
    v_t4 := 'GOLD define la EPOC por síntomas respiratorios crónicos con obstrucción persistente del flujo aéreo, confirmada con una relación FEV1/FVC posbroncodilatador menor de 0,70. Los factores de riesgo incluyen tabaco, humo de biomasa y exposiciones ocupacionales.';
    v_j1 := $evfae_json${"external_id":"fae-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"EPOC: definición, factores de riesgo y diagnóstico espirométrico según GOLD 2026","outcome":"EPOC: definición, factores de riesgo y diagnóstico espirométrico según GOLD 2026","source":"GOLD 2026, diagnóstico."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Hay obstrucción persistente compatible con EPOC, porque la relación es menor de 0,70 tras el broncodilatador.', TRUE, 'Correcto. Luego se clasifica la gravedad y el grupo.', 0),
      (v_pregunta, 'El resultado es normal, porque para la EPOC la relación debe ser menor de 0,50.', FALSE, 'El umbral diagnóstico es 0,70.', 1),
      (v_pregunta, 'Tiene asma, porque toda obstrucción en un exfumador se explica por inflamación variable.', FALSE, 'La historia y la obstrucción persistente orientan a EPOC.', 2),
      (v_pregunta, 'No puede interpretarse, porque la espirometría solo es válida antes del broncodilatador.', FALSE, 'El criterio de EPOC usa el valor posbroncodilatador.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una paciente con diagnóstico de EPOC muestra una reversibilidad de 13 % y 220 mL. El auxiliar concluye que «entonces es asma y no EPOC». ¿Qué análisis es correcto?';
    v_t4 := 'Asma y EPOC difieren en edad de inicio, atopia, variabilidad de los síntomas y persistencia de la obstrucción. La respuesta al broncodilatador no basta para separarlas: algunas personas con EPOC tienen reversibilidad y algunas con asma de larga evolución tienen obstrucción fija. Se integran historia, espirometría, variabilidad y biomarcadores.';
    v_j1 := $evfae_json${"external_id":"fae-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Diagnóstico diferencial entre asma y EPOC y superposición de rasgos","outcome":"Diagnóstico diferencial entre asma y EPOC y superposición de rasgos","source":"GINA 2026; GOLD 2026."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es asma, porque cualquier reversibilidad descarta la EPOC según GOLD 2026.', FALSE, 'La reversibilidad sola no separa las dos enfermedades.', 0),
      (v_pregunta, 'Es EPOC, porque la reversibilidad nunca se presenta en el asma de larga evolución.', FALSE, 'Algunas personas con asma de larga evolución tienen obstrucción fija.', 1),
      (v_pregunta, 'No importa la diferencia, porque el tratamiento del asma y de la EPOC es el mismo.', FALSE, 'El papel del corticoide inhalado es distinto en cada una.', 2),
      (v_pregunta, 'La respuesta al broncodilatador no basta: se integran historia, espirometría, variabilidad y biomarcadores.', TRUE, 'Correcto. Algunas personas con EPOC tienen reversibilidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un exfumador de 62 años con EPOC tiene disnea al caminar en plano (mMRC 2), CAT de 18 y ninguna exacerbación en el último año. Solo usa salbutamol a necesidad. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'GOLD 2026: grupo A, sin exacerbaciones y con mMRC 0-1 y CAT menor de 10; grupo B, sin exacerbaciones y con mMRC ≥2 o CAT ≥10; grupo E, una o más exacerbaciones moderadas o graves. El grupo B inicia con LABA+LAMA.';
    v_j1 := $evfae_json${"external_id":"fae-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: adulto exfumador con disnea y espirometría obstructiva","outcome":"Caso: adulto exfumador con disnea y espirometría obstructiva","source":"GOLD 2026, evaluación y tratamiento inicial."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El esquema es adecuado, porque sin exacerbaciones basta con el broncodilatador de rescate.', FALSE, 'Con síntomas importantes se necesita mantenimiento.', 0),
      (v_pregunta, 'Corresponde al grupo B: se propone un LABA más un LAMA como tratamiento de mantenimiento.', TRUE, 'Correcto. Es el tratamiento inicial del grupo B en GOLD 2026.', 1),
      (v_pregunta, 'Corresponde al grupo E: se propone triple terapia con corticoide inhalado desde el inicio.', FALSE, 'Sin exacerbaciones no está en el grupo E.', 2),
      (v_pregunta, 'Corresponde al grupo A: se propone agregar montelukast para reducir la disnea.', FALSE, 'Con mMRC 2 o CAT de 10 o más ya no es grupo A.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fae-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Farmacología de broncodilatadores, corticoides inhalados y otros controladores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Farmacología de broncodilatadores, corticoides inhalados y otros controladores) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Farmacología de broncodilatadores, corticoides inhalados y otros controladores';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 2, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 2, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Por qué el formoterol, combinado con budesonida, puede usarse como rescate y el salmeterol no?';
    v_t4 := 'Los LABA estimulan los receptores beta-2 durante 12 horas (formoterol, salmeterol) o 24 horas (vilanterol, indacaterol, olodaterol). El formoterol inicia su acción en minutos; por eso, combinado con budesonida o beclometasona, puede usarse como rescate antiinflamatorio y en MART. En asma, un LABA nunca se usa sin corticoide inhalado.';
    v_j1 := $evfae_json${"external_id":"fae-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"LABA y LAMA: formoterol, salmeterol, tiotropio y otros broncodilatadores de mantenimiento","outcome":"LABA y LAMA: formoterol, salmeterol, tiotropio y otros broncodilatadores de mantenimiento","source":"GINA 2026; fichas técnicas."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque el formoterol dura 24 horas y el salmeterol solo unas 4 horas después de cada una de las dosis.', FALSE, 'Ambos duran unas 12 horas.', 0),
      (v_pregunta, 'Porque el formoterol inicia su acción en minutos y el salmeterol tiene un inicio más lento.', TRUE, 'Correcto. Por eso permite el rescate antiinflamatorio y MART.', 1),
      (v_pregunta, 'Porque el formoterol no tiene efectos adversos cardiovasculares y el salmeterol sí.', FALSE, 'Ambos pueden causar temblor y palpitaciones.', 2),
      (v_pregunta, 'Porque el formoterol es un anticolinérgico y el salmeterol un agonista beta-2.', FALSE, 'Ambos son agonistas beta-2 de acción prolongada.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente que inicia un corticoide inhalado pregunta cómo evitar la ronquera y los «hongos en la boca». ¿Qué le recomienda el QF?';
    v_t4 := 'La ficha técnica de budesonida-formoterol describe candidiasis orofaríngea, disfonía e irritación de garganta como reacciones frecuentes. Enjuagarse la boca y escupir después de cada uso, y usar cámara con los inhaladores presurizados, reduce el depósito en la orofaringe.';
    v_j1 := $evfae_json${"external_id":"fae-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Corticoides inhalados: mecanismo, uso en asma y EPOC y efectos adversos","outcome":"Corticoides inhalados: mecanismo, uso en asma y EPOC y efectos adversos","source":"Ficha técnica de budesonida-formoterol; GINA 2026."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Suspender el inhalador cada vez que note ronquera y reiniciarlo cuando desaparezca.', FALSE, 'Suspender el corticoide inhalado pone en riesgo el control.', 0),
      (v_pregunta, 'Tomar un antimicótico oral de forma preventiva todos los meses mientras use el inhalador.', FALSE, 'No se indica un antimicótico preventivo.', 1),
      (v_pregunta, 'Usar el inhalador justo antes de cada comida para que el alimento arrastre el medicamento al estómago.', FALSE, 'No es la recomendación para reducir el depósito en la boca.', 2),
      (v_pregunta, 'Enjuagarse la boca y escupir después de cada uso y, con inhalador presurizado, usar cámara.', TRUE, 'Correcto. Así se reduce el depósito orofaríngeo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer de 28 años con asma solo usa salbutamol, que compra sin fórmula. En 6 meses retiró 4 inhaladores de 200 dosis y se despierta dos noches por semana. ¿Qué análisis es correcto?';
    v_t4 := 'GINA 2026 señala que usar 3 o más inhaladores de SABA al año se asocia con exacerbaciones, y recomienda evitar el tratamiento solo con SABA: todo paciente con asma debe recibir tratamiento con corticoide inhalado. Los despertares nocturnos y el uso casi diario del rescate indican mal control.';
    v_j1 := $evfae_json${"external_id":"fae-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso: paciente con asma que solo usa salbutamol y presenta sobreuso","outcome":"Caso: paciente con asma que solo usa salbutamol y presenta sobreuso","source":"GINA 2026."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tiene asma no controlada con sobreuso de SABA, que se asocia con exacerbaciones; necesita corticoide inhalado.', TRUE, 'Correcto. Su ritmo equivale a unos 8 inhaladores al año.', 0),
      (v_pregunta, 'Tiene asma controlada, porque el salbutamol le alivia los síntomas cada vez que lo usa.', FALSE, 'El alivio con el rescate no significa control.', 1),
      (v_pregunta, 'Tiene una tolerancia al salbutamol y debe cambiarlo por ipratropio como único inhalador.', FALSE, 'El problema es la falta de tratamiento antiinflamatorio.', 2),
      (v_pregunta, 'Debe aumentar el salbutamol a 4 inhalaciones cada 4 horas para evitar los despertares.', FALSE, 'Aumentar el SABA solo empeora el riesgo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'La madre de un niño de 8 años que toma montelukast cuenta que desde hace un mes tiene pesadillas y está más irritable. Un familiar dice que «son cosas de la edad». ¿Cuál es la respuesta más acertada del QF?';
    v_t4 := 'Con el montelukast se han reportado eventos neuropsiquiátricos en todas las edades: alteraciones del sueño, pesadillas, ansiedad, depresión, agresividad e ideación suicida. El INVIMA publicó el informe de seguridad 349-2024. Se informa al médico y se reporta la sospecha.';
    v_j1 := $evfae_json${"external_id":"fae-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Montelukast y otros controladores: eficacia comparada y seguridad neuropsiquiátrica","outcome":"Montelukast y otros controladores: eficacia comparada y seguridad neuropsiquiátrica","source":"Ficha técnica de montelukast; INVIMA, informe de seguridad 349-2024."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Coincidir con el familiar, porque el montelukast no tiene efectos sobre el comportamiento.', FALSE, 'Se han reportado eventos neuropsiquiátricos en todas las edades.', 0),
      (v_pregunta, 'Recomendar duplicar la dosis en la noche para que el niño duerma mejor.', FALSE, 'Subir la dosis no corrige el problema y aumenta el riesgo.', 1),
      (v_pregunta, 'Explicar que pueden ser eventos neuropsiquiátricos del montelukast, avisar al médico y reportar la sospecha.', TRUE, 'Correcto. Existe un informe de seguridad del INVIMA sobre este riesgo.', 2),
      (v_pregunta, 'Suspender también el corticoide inhalado, porque podría estar causando las pesadillas.', FALSE, 'No hay razón para retirar el corticoide inhalado.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fae-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Farmacoterapia del asma: tratamiento escalonado, MART y asma grave' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Farmacoterapia del asma: tratamiento escalonado, MART y asma grave) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Farmacoterapia del asma: tratamiento escalonado, MART y asma grave';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 3, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 3, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Cuál es la ventaja principal de la vía 1 de GINA 2026, con ICS-formoterol como rescate?';
    v_t4 := 'En la vía 1 de GINA 2026, los pasos 1-2 usan ICS-formoterol a dosis baja a necesidad (rescate antiinflamatorio) y los pasos 3-4, MART. La ventaja es usar un solo inhalador en todos los pasos y que cada rescate aporte corticoide.';
    v_j1 := $evfae_json${"external_id":"fae-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Vías 1 y 2 de GINA 2026 en adultos y adolescentes: pasos 1 a 5","outcome":"Vías 1 y 2 de GINA 2026 en adultos y adolescentes: pasos 1 a 5","source":"GINA 2026, vías de tratamiento."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que permite suspender por completo el corticoide inhalado cuando el paciente se siente bien.', FALSE, 'GINA no recomienda suspender del todo el ICS en adultos.', 0),
      (v_pregunta, 'Que reemplaza la revisión de la técnica inhalatoria porque el dispositivo es más sencillo.', FALSE, 'La técnica se revisa en cada visita, con cualquier dispositivo.', 1),
      (v_pregunta, 'Que evita el uso de cualquier corticoide en los pasos 1 y 2 del tratamiento.', FALSE, 'Justamente cada rescate aporta corticoide.', 2),
      (v_pregunta, 'Que usa un solo inhalador en todos los pasos y cada rescate aporta una dosis de corticoide.', TRUE, 'Correcto. Por eso es la vía preferida.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente en MART con budesonida-formoterol 160/4,5 cuenta que ayer usó 13 inhalaciones en total porque estaba muy ahogado. ¿Qué le indica el QF?';
    v_t4 := 'Según la ficha técnica, en MART no se usan más de 6 inhalaciones en una sola ocasión, normalmente no más de 8 al día y hasta 12 por un tiempo limitado. GINA 2026 pide buscar atención si los síntomas empeoran rápido, no mejoran en 2-3 días o se necesitan más de 12 inhalaciones en 24 horas.';
    v_j1 := $evfae_json${"external_id":"fae-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"MART con budesonida-formoterol: dosificación, límites y educación","outcome":"MART con budesonida-formoterol: dosificación, límites y educación","source":"Ficha técnica de budesonida-formoterol; GINA 2026."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que es normal en MART y puede usar todas las inhalaciones que necesite sin límite.', FALSE, 'Hay límites claros en la ficha técnica y en GINA.', 0),
      (v_pregunta, 'Que pase a usar salbutamol como rescate y deje el inhalador solo para la mañana.', FALSE, 'Cambiar el rescate no resuelve el empeoramiento.', 1),
      (v_pregunta, 'Que busque atención médica, porque superó las 12 inhalaciones en 24 horas.', TRUE, 'Correcto. También si empeora rápido o no mejora en 2-3 días.', 2),
      (v_pregunta, 'Que duplique la dosis de mantenimiento durante una semana y luego vuelva a la habitual.', FALSE, 'El ajuste lo define el médico tras evaluarlo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre de 45 años en MART a dosis media sigue sin control. Exhala dentro del Turbuhaler antes de inhalar, retira el inhalador cada 6 semanas en vez de cada 30 días y fuma. Su médico propone un biológico. ¿Qué análisis es correcto?';
    v_t4 := 'El asma de difícil control sigue sin controlarse pese a ICS-LABA a dosis media o alta; muchas veces la causa es modificable: técnica, adherencia, tabaquismo, exposiciones o comorbilidades. El asma grave es la que persiste no controlada tras corregirlas. GINA 2026 remite en el paso 5 para valoración del fenotipo.';
    v_j1 := $evfae_json${"external_id":"fae-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Asma de difícil control vs asma grave: evaluación y opciones del paso 5","outcome":"Asma de difícil control vs asma grave: evaluación y opciones del paso 5","source":"GINA 2026, asma de difícil control y grave."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tiene asma grave confirmada y el biológico es la única opción pendiente.', FALSE, 'No se puede llamar grave sin corregir los factores modificables.', 0),
      (v_pregunta, 'Es asma de difícil control con causas modificables: técnica, adherencia y tabaco se corrigen antes.', TRUE, 'Correcto. Luego se reevalúa y, si persiste, se remite para fenotipo.', 1),
      (v_pregunta, 'Debe suspender el MART y volver al salbutamol solo, porque el Turbuhaler no le sirve.', FALSE, 'Volver al SABA solo aumenta el riesgo.', 2),
      (v_pregunta, 'El tabaco no influye en el control del asma, así que solo hay que corregir la técnica.', FALSE, 'El tabaco es un factor modificable importante.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una adulta con asma lleva 3 meses con buen control y quiere dejar «de una vez» su corticoide inhalado. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'GINA 2026 recomienda, tras 2-3 meses de buen control (3 meses en niños), considerar reducir el tratamiento, pero en adultos y adolescentes no suspender por completo el corticoide inhalado. También pide evitar el tratamiento solo con SABA.';
    v_j1 := $evfae_json${"external_id":"fae-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Introducción a la unidad: metas y ciclo de manejo del asma según GINA 2026","outcome":"Introducción a la unidad: metas y ciclo de manejo del asma según GINA 2026","source":"GINA 2026, ciclo de manejo."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se puede considerar reducir el tratamiento con el médico, pero sin suspender del todo el corticoide inhalado.', TRUE, 'Correcto. Es lo que recomienda GINA 2026 en adultos y adolescentes.', 0),
      (v_pregunta, 'Tiene razón: tras 3 meses de control el asma está curada y no necesita más tratamiento.', FALSE, 'El asma no se cura; el control depende del tratamiento.', 1),
      (v_pregunta, 'Puede suspenderlo y usar solo salbutamol, que es suficiente cuando no hay síntomas.', FALSE, 'GINA desaconseja el tratamiento solo con SABA.', 2),
      (v_pregunta, 'No se puede cambiar nada nunca, porque cualquier reducción provoca una crisis grave.', FALSE, 'GINA permite reducir tras 2-3 meses de buen control.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fae-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Farmacoterapia de la EPOC y manejo de exacerbaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Farmacoterapia de la EPOC y manejo de exacerbaciones) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Farmacoterapia de la EPOC y manejo de exacerbaciones';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 4, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 4, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := 'Según GOLD 2026, ¿qué basta para clasificar a una persona con EPOC en el grupo E?';
    v_t4 := 'Según GOLD 2026, una sola exacerbación moderada (que requiere corticoide sistémico o antibiótico) o grave (que requiere hospitalización o urgencias) en el año previo basta para clasificar en el grupo E, sin importar los síntomas.';
    v_j1 := $evfae_json${"external_id":"fae-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Clasificación ABE y tratamiento inicial de la EPOC según GOLD 2026","outcome":"Clasificación ABE y tratamiento inicial de la EPOC según GOLD 2026","source":"GOLD 2026, evaluación ABE."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Una o más exacerbaciones moderadas o graves en el último año, sin importar los síntomas.', TRUE, 'Correcto. Antes se exigían dos moderadas o una con hospitalización.', 0),
      (v_pregunta, 'Un CAT de 10 o más junto con una disnea mMRC de 2 o más, aunque no haya tenido exacerbaciones en el año.', FALSE, 'Eso define el grupo B.', 1),
      (v_pregunta, 'Un FEV1 menor de 50 % del predicho en la espirometría posbroncodilatador.', FALSE, 'La gravedad de la obstrucción no define el grupo E.', 2),
      (v_pregunta, 'Tener eosinófilos de 300 células/µL o más en dos mediciones separadas.', FALSE, 'Los eosinófilos orientan el tratamiento, no el grupo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una mujer de 70 años con EPOC GOLD 3 egresa tras una exacerbación grave. Antes usaba solo tiotropio y salbutamol. Sus eosinófilos son de 350 células/µL. ¿Qué propone el QF para el mantenimiento?';
    v_t4 := 'Con una exacerbación grave queda en el grupo E. GOLD 2026 propone LABA+LAMA y considerar LABA+LAMA+ICS si los eosinófilos son de 300 células/µL o más. La triple terapia en un solo inhalador simplifica el régimen.';
    v_j1 := $evfae_json${"external_id":"fae-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso: paciente con EPOC al egreso de una hospitalización por exacerbación","outcome":"Caso: paciente con EPOC al egreso de una hospitalización por exacerbación","source":"GOLD 2026, tratamiento inicial y de seguimiento."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Mantener solo el tiotropio, porque la exacerbación fue un evento aislado.', FALSE, 'Con una exacerbación grave queda en grupo E y debe escalar.', 0),
      (v_pregunta, 'Escalar a LABA+LAMA+ICS, porque está en grupo E y sus eosinófilos son de 300 o más.', TRUE, 'Correcto. De preferencia en un solo inhalador y con técnica verificada.', 1),
      (v_pregunta, 'Cambiar el tiotropio por montelukast, que reduce las exacerbaciones de la EPOC.', FALSE, 'El montelukast no es un tratamiento de la EPOC.', 2),
      (v_pregunta, 'Agregar teofilina oral, porque es el broncodilatador más potente para el mantenimiento.', FALSE, 'Las metilxantinas no se recomiendan por sus efectos adversos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un adulto con una exacerbación moderada de asma sale de urgencias con prednisolona 10 mg al día por 3 días. ¿Qué análisis hace el QF?';
    v_t4 := 'GINA 2026 indica, salvo en casos leves, prednisolona 40-50 mg cada mañana por 5-7 días en adultos y 1-2 mg/kg/día (máximo 40 mg) por 3-5 días en niños, además del broncodilatador.';
    v_j1 := $evfae_json${"external_id":"fae-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Exacerbaciones del asma: manejo inicial, corticoide oral y alta segura","outcome":"Exacerbaciones del asma: manejo inicial, corticoide oral y alta segura","source":"GINA 2026, manejo de las exacerbaciones."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La dosis es adecuada, porque en adultos se usan 10 mg por 3 días para no causar efectos.', FALSE, 'La dosis y la duración son menores que las recomendadas.', 0),
      (v_pregunta, 'La prednisolona no se indica en exacerbaciones de asma; basta con el salbutamol.', FALSE, 'El corticoide oral se usa salvo en casos leves.', 1),
      (v_pregunta, 'La dosis parece insuficiente: GINA indica 40-50 mg cada mañana por 5-7 días en adultos.', TRUE, 'Correcto. Se consulta con el médico que la formuló.', 2),
      (v_pregunta, 'La prednisolona debe darse por un mes completo para evitar una nueva exacerbación.', FALSE, 'No se recomiendan ciclos tan largos en una exacerbación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para una exacerbación moderada de EPOC con esputo purulento, la fórmula incluye aminofilina, prednisolona por 14 días y un antibiótico por 10 días. ¿Cuál es la mejor valoración?';
    v_t4 := 'Según la guía de bolsillo GOLD 2026: broncodilatador inicial SABA con o sin SAMA; corticoide sistémico hasta por 5 días en exacerbaciones moderadas o graves; antibiótico por un total de 5 días cuando está indicado (por ejemplo, esputo purulento); y no se recomiendan las metilxantinas por sus efectos adversos.';
    v_j1 := $evfae_json${"external_id":"fae-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Exacerbaciones de la EPOC: broncodilatadores, corticoide sistémico y antibióticos","outcome":"Exacerbaciones de la EPOC: broncodilatadores, corticoide sistémico y antibióticos","source":"GOLD 2026, exacerbaciones."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada, porque una exacerbación necesita el tratamiento más largo y potente posible.', FALSE, 'Más largo no es mejor: aumenta los efectos adversos.', 0),
      (v_pregunta, 'Es adecuada si se agrega un corticoide inhalado a dosis alta durante los mismos 14 días.', FALSE, 'Eso no corrige los problemas de la fórmula.', 1),
      (v_pregunta, 'Es inadecuada solo porque el antibiótico nunca se usa en las exacerbaciones de EPOC.', FALSE, 'Con esputo purulento el antibiótico puede estar indicado.', 2),
      (v_pregunta, 'Conviene revisarla: GOLD no recomienda metilxantinas y propone corticoide hasta 5 días y antibiótico por 5 días.', TRUE, 'Correcto. Además, broncodilatador de acción corta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fae-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Dispositivos, adherencia, prevención y seguimiento farmacoterapéutico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Dispositivos, adherencia, prevención y seguimiento farmacoterapéutico) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Dispositivos, adherencia, prevención y seguimiento farmacoterapéutico';
  v_t2 := 'Cuatro preguntas de selección múltiple con una sola respuesta correcta, ordenadas según la taxonomía de Bloom: comprender, aplicar, analizar y evaluar. Cada una vale 25 puntos. Tienes dos intentos y se conserva la nota mayor. La retroalimentación de cada opción se muestra después de enviar.';
  SELECT id INTO v_banco FROM aula_question_banks
   WHERE course_id = v_curso AND name = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_banco IS NULL THEN
    INSERT INTO aula_question_banks (course_id, name, description)
    VALUES (v_curso, v_t1, v_t2)
    RETURNING id INTO v_banco;
  END IF;

  SELECT id INTO v_eval FROM aula_assessments
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_eval IS NULL THEN
    INSERT INTO aula_assessments
      (course_id, module_id, title, instructions_html, is_required, passing_score, max_attempts,
       shuffle_questions, shuffle_options, show_answers_after_submit, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, TRUE, 70, 2,
       FALSE, FALSE, TRUE, 'publicado', 5, 6)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 5, weight = 6, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Qué exige un inhalador de polvo seco, como el Turbuhaler, a diferencia de un inhalador presurizado?';
    v_t4 := 'En el inhalador de polvo seco el paciente activa el medicamento con una inhalación rápida y fuerte; no requiere coordinación, pero sí flujo inspiratorio suficiente, y no se debe exhalar dentro del dispositivo. Puede no servir en niños pequeños, adultos muy frágiles o en una crisis grave.';
    v_j1 := $evfae_json${"external_id":"fae-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Tipos de dispositivos de inhalación y criterios de selección","outcome":"Tipos de dispositivos de inhalación y criterios de selección","source":"GINA 2026, dispositivos."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Agitarlo con fuerza antes de cada inhalación para mezclar bien el propelente con el fármaco en polvo.', FALSE, 'El polvo seco no lleva propelente que agitar.', 0),
      (v_pregunta, 'Usarlo siempre con cámara espaciadora para reducir el depósito en la boca.', FALSE, 'La cámara se usa con los inhaladores presurizados.', 1),
      (v_pregunta, 'Una inhalación rápida y fuerte, sin exhalar dentro del dispositivo; no requiere coordinación.', TRUE, 'Correcto. Por eso puede no servir en una crisis grave.', 2),
      (v_pregunta, 'Disparar y luego inhalar lento durante 5 segundos, igual que con el salbutamol.', FALSE, 'Esa es la técnica del inhalador presurizado.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Al revisar la técnica de un niño con salbutamol en cámara, el QF ve que la madre dispara dos veces seguidas dentro de la cámara. ¿Qué corrige?';
    v_t4 := 'GINA 2026 recomienda, con inhalador presurizado y cámara: agitar, conectar, disparar una sola vez, inhalar lento y profundo o respirar varias veces a volumen corriente, y para otra dosis agitar de nuevo y repetir. Un disparo a la vez.';
    v_j1 := $evfae_json${"external_id":"fae-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Enseñanza y verificación de la técnica inhalatoria: pMDI con cámara y polvo seco","outcome":"Enseñanza y verificación de la técnica inhalatoria: pMDI con cámara y polvo seco","source":"GINA 2026, técnica inhalatoria."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que dispare tres veces seguidas para asegurar que llegue suficiente medicamento.', FALSE, 'Más disparos juntos no mejoran la dosis que llega.', 0),
      (v_pregunta, 'Que retire la cámara, porque en niños es mejor el disparo directo en la boca.', FALSE, 'En niños se usa siempre cámara.', 1),
      (v_pregunta, 'Que espere una hora entre los dos disparos para que no haya efectos adversos.', FALSE, 'La espera entre disparos es corta, no de una hora.', 2),
      (v_pregunta, 'Que dispare una sola vez, deje respirar al niño y repita agitando de nuevo para la otra dosis.', TRUE, 'Correcto. Un disparo a la vez.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con EPOC tiene formulado un inhalador de mantenimiento al mes. En 12 meses retiró 6. En la entrevista dice que lo usa «cuando se siente mal». ¿Qué análisis es correcto?';
    v_t4 := 'La falta de adherencia puede ser no intencional (olvido, confusión, técnica, acceso) o intencional (suspender cuando se siente bien, temor). Los registros de dispensación (inhaladores retirados frente a los esperados) son útiles y se combinan con entrevistas sin juicio y contadores de dosis.';
    v_j1 := $evfae_json${"external_id":"fae-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Adherencia al tratamiento inhalado: medición e intervenciones del QF","outcome":"Adherencia al tratamiento inhalado: medición e intervenciones del QF","source":"GINA 2026; GOLD 2026, adherencia."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La adherencia es cercana al 50 % y parece intencional: usa el controlador como si fuera de rescate.', TRUE, 'Correcto. Se aborda con educación y simplificación.', 0),
      (v_pregunta, 'La adherencia es adecuada, porque retiró la mitad de los inhaladores formulados.', FALSE, 'El 50 % está muy por debajo de lo esperado.', 1),
      (v_pregunta, 'El problema es solo de acceso, porque la EPS no le entregó los otros seis inhaladores.', FALSE, 'El relato del paciente sugiere otra causa.', 2),
      (v_pregunta, 'No puede analizarse, porque los registros de dispensación de la farmacia no sirven para medir la adherencia.', FALSE, 'Son una de las formas útiles de medirla.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una mujer de 70 años con EPOC dice que no se vacuna contra la influenza «porque la vacuna da gripa». ¿Cuál es la mejor respuesta del QF?';
    v_t4 := 'GOLD 2026 indica seguir las guías locales de vacunación: influenza, neumococo y VSR reducen las infecciones respiratorias bajas. En Colombia, el lineamiento del Ministerio de Salud para la influenza estacional 2026 incluye a adultos de 60 años o más y a personas con enfermedades crónicas.';
    v_j1 := $evfae_json${"external_id":"fae-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Vacunación y prevención en asma y EPOC: influenza, neumococo, VSR y cesación tabáquica","outcome":"Vacunación y prevención en asma y EPOC: influenza, neumococo, VSR y cesación tabáquica","source":"GOLD 2026; lineamiento de vacunación contra influenza 2026 del Ministerio de Salud."}$evfae_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fae-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Respetar su decisión, porque la vacuna no cambia el riesgo de exacerbaciones en la EPOC.', FALSE, 'Las vacunas reducen las infecciones respiratorias bajas.', 0),
      (v_pregunta, 'Explicar que la vacuna reduce las infecciones respiratorias y está indicada para ella, y orientarla al vacunatorio.', TRUE, 'Correcto. También neumococo y VSR según lineamientos.', 1),
      (v_pregunta, 'Recomendarle un antigripal cada mes durante el invierno en lugar de la vacuna.', FALSE, 'Los antigripales no previenen la influenza.', 2),
      (v_pregunta, 'Recomendar que se vacune solo si tiene una exacerbación este año.', FALSE, 'La vacunación es preventiva y anual.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fae-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: asma, EPOC, diagnóstico diferencial y contexto colombiano' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: asma, EPOC, diagnóstico diferencial y contexto colombiano) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Clasificación y tratamiento inicial de una persona con EPOC';
  v_t2 := $evfae_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Confirma el diagnóstico con los datos de la espirometría y la historia de exposición.</li><li>Clasifica la gravedad de la obstrucción (GOLD 1 a 4) y el grupo A, B o E.</li><li>Propone el tratamiento de mantenimiento inicial según su grupo y sus eosinófilos.</li><li>Analiza el uso de salbutamol y qué te dice sobre su control.</li><li>Propone el dispositivo más adecuado y cómo verificarías la técnica.</li><li>Define las medidas de prevención (vacunas, exposición a la leña) y el seguimiento.</li><li>Redacta la nota al médico con tus propuestas.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Confirmar el diagnóstico de EPOC y clasificar la obstrucción y el grupo.</li><li>Proponer el tratamiento inicial según GOLD 2026.</li><li>Planear educación, prevención y seguimiento.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Diagnóstico y clasificación</td><td>25 %</td><td>Confirma la EPOC por biomasa, clasifica GOLD 3 y grupo E con la exacerbación del año.</td><td>Clasificación correcta con justificación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Tratamiento inicial</td><td>25 %</td><td>Propone LABA+LAMA y considera añadir ICS por eosinófilos ≥300, con sus riesgos.</td><td>Propone LABA+LAMA sin considerar los eosinófilos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Dispositivo y técnica</td><td>20 %</td><td>Elige un dispositivo según su capacidad y describe la verificación con lista de chequeo.</td><td>Dispositivo razonable sin verificación detallada.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Prevención y seguimiento</td><td>20 %</td><td>Vacunación, reducción de la exposición al humo y seguimiento con indicadores.</td><td>Prevención parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfae_html$;
  v_t3 := $evfae_html$<h2>Caso de estudio</h2>
<p>Doña Gloria tiene 67 años, vive en una vereda de Boyacá y cocinó con leña durante 40 años; nunca fumó (datos simulados). Tiene disnea al caminar con personas de su edad (mMRC 2), tos con expectoración la mayoría de los días y un CAT de 21. En el último año tuvo una exacerbación que requirió prednisolona y antibiótico. Espirometría posbroncodilatador: FEV1/FVC 0,61; FEV1 47 % del predicho. Eosinófilos: 320 células/µL. Usa salbutamol 6 a 8 veces al día y nunca le revisaron la técnica. No tiene vacuna de influenza este año.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfae_html$;
  v_t4 := 'Informe de evaluación con nota al médico y plan de educación.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfae_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Estrategia GINA 2026; Informe GOLD 2026 y su guía de bolsillo; guías de práctica clínica del Ministerio de Salud de asma (2013) y EPOC (2014); fichas técnicas e insertos aprobados por el INVIMA de salbutamol, budesonida-formoterol, tiotropio y montelukast; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y Resolución 2024015321 de 2024; lineamientos de vacunación del Ministerio de Salud. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfae_html$;
  v_t7 := NULL;
  v_j1 := $evfae_json$["Diagnóstico y exposición.","Clasificación GOLD.","Tratamiento inicial.","Dispositivo y técnica.","Prevención y seguimiento."]$evfae_json$::jsonb;
  v_j2 := $evfae_json${"version":1,"total":100,"criteria":[{"id":"diagnostico-y-clasificacion","name":"Diagnóstico y clasificación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Confirma la EPOC por biomasa, clasifica GOLD 3 y grupo E con la exacerbación del año."},{"level":3,"label":"Logrado","description":"Clasificación correcta con justificación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tratamiento-inicial","name":"Tratamiento inicial","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Propone LABA+LAMA y considera añadir ICS por eosinófilos ≥300, con sus riesgos."},{"level":3,"label":"Logrado","description":"Propone LABA+LAMA sin considerar los eosinófilos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"dispositivo-y-tecnica","name":"Dispositivo y técnica","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Elige un dispositivo según su capacidad y describe la verificación con lista de chequeo."},{"level":3,"label":"Logrado","description":"Dispositivo razonable sin verificación detallada."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"prevencion-y-seguimiento","name":"Prevención y seguimiento","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Vacunación, reducción de la exposición al humo y seguimiento con indicadores."},{"level":3,"label":"Logrado","description":"Prevención parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfae_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 1, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 1, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fae-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Farmacología de broncodilatadores, corticoides inhalados y otros controladores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Farmacología de broncodilatadores, corticoides inhalados y otros controladores) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Sobreuso de broncodilatador de rescate en una persona con asma';
  v_t2 := $evfae_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Calcula el ritmo anual de inhaladores de SABA y compáralo con el umbral de riesgo de GINA.</li><li>Evalúa el control de síntomas con las preguntas de GINA y el riesgo futuro.</li><li>Identifica los errores de técnica y cómo los corregirías.</li><li>Analiza sus creencias sobre los corticoides y prepara una respuesta clara y verdadera.</li><li>Propone al médico un esquema según la vía preferida de GINA 2026 y justifícalo.</li><li>Define el plan de acción escrito y el seguimiento.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Cuantificar el uso de SABA y evaluar el control y el riesgo.</li><li>Identificar errores de técnica y creencias que afectan la adherencia.</li><li>Proponer al médico un esquema según GINA 2026 y educar al paciente.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Uso de SABA y control</td><td>25 %</td><td>Calcula unos 7,5 inhaladores al año, reconoce asma no controlada con riesgo alto (corticoide oral reciente).</td><td>Reconoce el mal control sin cuantificar el riesgo.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Técnica y creencias</td><td>20 %</td><td>Corrige la coordinación, propone cámara y responde las creencias con información verificable.</td><td>Aborda la técnica o las creencias, no ambas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Propuesta según GINA 2026</td><td>30 %</td><td>Propone corticoide inhalado, preferiblemente ICS-formoterol (vía 1) con el paso adecuado, y tratar la rinitis.</td><td>Propone corticoide inhalado sin especificar la vía o el paso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan de acción y seguimiento</td><td>15 %</td><td>Plan escrito claro con señales de alarma y fecha de revisión.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfae_html$;
  v_t3 := $evfae_html$<h2>Caso de estudio</h2>
<p>Camilo tiene 34 años, es mensajero en moto en Bogotá y tiene asma desde los 12 años (datos simulados). Solo usa salbutamol inhalado, que compra sin fórmula: 5 inhaladores de 200 dosis en los últimos 8 meses. Usa el inhalador casi todos los días y se despierta 3 noches por semana con tos. Hace dos meses recibió prednisolona en urgencias. Dispara el inhalador y después inhala, sin cámara. Tiene rinitis sin tratamiento y dice que «los corticoides engordan y crean dependencia».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfae_html$;
  v_t4 := 'Informe de intervención con propuesta al médico y plan de acción escrito.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfae_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Estrategia GINA 2026; Informe GOLD 2026 y su guía de bolsillo; guías de práctica clínica del Ministerio de Salud de asma (2013) y EPOC (2014); fichas técnicas e insertos aprobados por el INVIMA de salbutamol, budesonida-formoterol, tiotropio y montelukast; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y Resolución 2024015321 de 2024; lineamientos de vacunación del Ministerio de Salud. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfae_html$;
  v_t7 := NULL;
  v_j1 := $evfae_json$["Uso de SABA y control.","Técnica inhalatoria.","Creencias y adherencia.","Propuesta según GINA 2026.","Plan de acción y seguimiento."]$evfae_json$::jsonb;
  v_j2 := $evfae_json${"version":1,"total":100,"criteria":[{"id":"uso-de-saba-y-control","name":"Uso de SABA y control","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Calcula unos 7,5 inhaladores al año, reconoce asma no controlada con riesgo alto (corticoide oral reciente)."},{"level":3,"label":"Logrado","description":"Reconoce el mal control sin cuantificar el riesgo."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tecnica-y-creencias","name":"Técnica y creencias","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Corrige la coordinación, propone cámara y responde las creencias con información verificable."},{"level":3,"label":"Logrado","description":"Aborda la técnica o las creencias, no ambas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"propuesta-segun-gina-2026","name":"Propuesta según GINA 2026","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Propone corticoide inhalado, preferiblemente ICS-formoterol (vía 1) con el paso adecuado, y tratar la rinitis."},{"level":3,"label":"Logrado","description":"Propone corticoide inhalado sin especificar la vía o el paso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-de-accion-y-seguimiento","name":"Plan de acción y seguimiento","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Plan escrito claro con señales de alarma y fecha de revisión."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfae_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 2, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 2, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fae-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Farmacoterapia de la EPOC y manejo de exacerbaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Farmacoterapia de la EPOC y manejo de exacerbaciones) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Egreso seguro tras una exacerbación de EPOC';
  v_t2 := $evfae_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Concilia la fórmula de ingreso y la de egreso.</li><li>Reclasifica el grupo GOLD con la exacerbación y analiza si el mantenimiento corresponde a GOLD 2026.</li><li>Analiza el corticoide inhalado considerando sus eosinófilos y la neumonía previa, y propone el esquema.</li><li>Verifica la duración del corticoide sistémico y del antibiótico.</li><li>Corrige la técnica y el dispositivo (cámara, contador de dosis).</li><li>Define vacunación, rehabilitación y seguimiento temprano tras el egreso.</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Reclasificar al paciente y revisar el mantenimiento según GOLD 2026.</li><li>Verificar la duración del corticoide y del antibiótico.</li><li>Diseñar el plan de educación, prevención y seguimiento temprano.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 3 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 12 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 12 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Reclasificación y mantenimiento</td><td>25 %</td><td>Grupo E y propuesta coherente con GOLD 2026: LABA+LAMA como base.</td><td>Reclasifica sin ajustar el mantenimiento.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Decisión sobre el ICS</td><td>20 %</td><td>Pondera eosinófilos de 260 y la neumonía previa y justifica mantener o no el ICS con el médico.</td><td>Decide sin ponderar ambos datos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Duraciones</td><td>15 %</td><td>Verifica 5 días de corticoide y 5 de antibiótico.</td><td>Verifica una de las dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Técnica y prevención</td><td>30 %</td><td>Corrige técnica con cámara y contador, define vacunas, rehabilitación y control temprano.</td><td>Plan correcto con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfae_html$;
  v_t3 := $evfae_html$<h2>Caso de estudio</h2>
<p>Don Marco tiene 73 años, vive en Pasto (2.500 m) y egresa tras 5 días de hospitalización por una exacerbación grave de EPOC (datos simulados). EPOC GOLD 3, exfumador de 45 paquetes-año. Antes usaba solo salmeterol-fluticasona en inhalador presurizado y salbutamol. Eosinófilos estables de 260 células/µL; tuvo una neumonía hace 8 meses. Fórmula de egreso: prednisolona hasta completar 5 días, amoxicilina-clavulanato hasta completar 5 días, salbutamol y el mismo salmeterol-fluticasona. No usa cámara, no sabe si su inhalador tiene dosis y no tiene vacuna de influenza ni de neumococo.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfae_html$;
  v_t4 := 'Plan de egreso con propuesta al médico, educación y seguimiento.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfae_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Estrategia GINA 2026; Informe GOLD 2026 y su guía de bolsillo; guías de práctica clínica del Ministerio de Salud de asma (2013) y EPOC (2014); fichas técnicas e insertos aprobados por el INVIMA de salbutamol, budesonida-formoterol, tiotropio y montelukast; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y Resolución 2024015321 de 2024; lineamientos de vacunación del Ministerio de Salud. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfae_html$;
  v_t7 := NULL;
  v_j1 := $evfae_json$["Reclasificación y mantenimiento.","Decisión sobre el ICS.","Corticoide sistémico y antibiótico.","Técnica y dispositivo.","Prevención y seguimiento."]$evfae_json$::jsonb;
  v_j2 := $evfae_json${"version":1,"total":100,"criteria":[{"id":"reclasificacion-y-mantenimiento","name":"Reclasificación y mantenimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Grupo E y propuesta coherente con GOLD 2026: LABA+LAMA como base."},{"level":3,"label":"Logrado","description":"Reclasifica sin ajustar el mantenimiento."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"decision-sobre-el-ics","name":"Decisión sobre el ICS","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Pondera eosinófilos de 260 y la neumonía previa y justifica mantener o no el ICS con el médico."},{"level":3,"label":"Logrado","description":"Decide sin ponderar ambos datos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"duraciones","name":"Duraciones","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Verifica 5 días de corticoide y 5 de antibiótico."},{"level":3,"label":"Logrado","description":"Verifica una de las dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tecnica-y-prevencion","name":"Técnica y prevención","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Corrige técnica con cámara y contador, define vacunas, rehabilitación y control temprano."},{"level":3,"label":"Logrado","description":"Plan correcto con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfae_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 4, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 4, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 12,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fae-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Farmacoterapia del asma: tratamiento escalonado, MART y asma grave' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Farmacoterapia del asma: tratamiento escalonado, MART y asma grave) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: diagnóstico y esquema de tratamiento de Doña Carmenza';
  v_t2 := $evfae_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso e identifica los rasgos de asma y de EPOC.</li><li>Fase 1: explica qué implica esa combinación de rasgos para el uso del corticoide inhalado.</li><li>Fase 2: revisa cada medicamento (indicación, riesgo, efectos adversos) y cuantifica el uso de salbutamol.</li><li>Fase 2: analiza el problema de sueño y su posible relación con el montelukast.</li><li>Fase 3: propone al médico un esquema que incluya corticoide inhalado y justifica la vía o el paso.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (diagnóstico).</strong> Rasgos de asma y de EPOC y su implicación para el tratamiento.</li>
  <li><strong>Fase 2 · Unidad 2 (farmacología).</strong> Revisión de cada medicamento, efectos adversos y sobreuso de rescate.</li>
  <li><strong>Fase 3 · Unidad 3 (asma).</strong> Propuesta de esquema con corticoide inhalado según GINA 2026.</li>
  <li><strong>Fase 4 · Unidad 4 (EPOC y exacerbaciones).</strong> Componente EPOC y plan ante una exacerbación.</li>
  <li><strong>Fase 5 · Unidad 5 (seguimiento).</strong> Dispositivos, adherencia, prevención, farmacovigilancia e indicadores.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar los rasgos de asma y EPOC para orientar el tratamiento.</li><li>Proponer un esquema seguro y coherente con GINA y GOLD.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 6 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 8 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 8 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Integración diagnóstica</td><td>25 %</td><td>Identifica rasgos de ambas y concluye que el esquema debe incluir corticoide inhalado.</td><td>Identifica los rasgos sin la implicación terapéutica.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Revisión de medicamentos</td><td>25 %</td><td>Revisa cada medicamento, cuantifica 6 SABA al año y reconoce el riesgo.</td><td>Revisión correcta con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Montelukast</td><td>15 %</td><td>Relaciona el insomnio con el montelukast y propone informar y reportar.</td><td>Lo menciona sin plan.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Esquema propuesto</td><td>25 %</td><td>Propone ICS-formoterol o ICS-LABA más LAMA, justificado con GINA y GOLD.</td><td>Esquema razonable con justificación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfae_html$;
  v_t3 := $evfae_html$<h2>Caso de estudio</h2>
<p>Doña Carmenza tiene 59 años, vive en Ibagué, tiene asma desde la infancia, fumó 20 años (lo dejó hace 5) y cocinó con leña en su juventud (datos simulados). Espirometría posbroncodilatador: FEV1/FVC 0,65, FEV1 60 %, reversibilidad de 14 % y 250 mL. Eosinófilos: 360 células/µL. Usa tiotropio, salbutamol (6 inhaladores en el año) y montelukast; desde que inició el montelukast duerme mal. Tuvo una exacerbación con prednisolona hace 4 meses. Su EPS la asignó al programa respiratorio donde tú eres el QF responsable del seguimiento. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfae_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfae_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Estrategia GINA 2026; Informe GOLD 2026 y su guía de bolsillo; guías de práctica clínica del Ministerio de Salud de asma (2013) y EPOC (2014); fichas técnicas e insertos aprobados por el INVIMA de salbutamol, budesonida-formoterol, tiotropio y montelukast; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y Resolución 2024015321 de 2024; lineamientos de vacunación del Ministerio de Salud. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfae_html$;
  v_t7 := NULL;
  v_j1 := $evfae_json$["Rasgos de asma y EPOC.","Revisión de los medicamentos.","Sospecha de reacción adversa.","Esquema propuesto."]$evfae_json$::jsonb;
  v_j2 := $evfae_json${"version":1,"total":100,"criteria":[{"id":"integracion-diagnostica","name":"Integración diagnóstica","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica rasgos de ambas y concluye que el esquema debe incluir corticoide inhalado."},{"level":3,"label":"Logrado","description":"Identifica los rasgos sin la implicación terapéutica."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"revision-de-medicamentos","name":"Revisión de medicamentos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Revisa cada medicamento, cuantifica 6 SABA al año y reconoce el riesgo."},{"level":3,"label":"Logrado","description":"Revisión correcta con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"montelukast","name":"Montelukast","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Relaciona el insomnio con el montelukast y propone informar y reportar."},{"level":3,"label":"Logrado","description":"Lo menciona sin plan."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"esquema-propuesto","name":"Esquema propuesto","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Propone ICS-formoterol o ICS-LABA más LAMA, justificado con GINA y GOLD."},{"level":3,"label":"Logrado","description":"Esquema razonable con justificación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfae_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 13, 8)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 13, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 8,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad fae-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Dispositivos, adherencia, prevención y seguimiento farmacoterapéutico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Dispositivos, adherencia, prevención y seguimiento farmacoterapéutico) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan integral de seguimiento de Doña Carmenza';
  v_t2 := $evfae_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: define el plan de acción ante una exacerbación (cuándo consultar, corticoide oral según la guía) y el componente EPOC del mantenimiento.</li><li>Fase 5: elige el dispositivo, diseña la verificación de técnica y el plan de adherencia.</li><li>Fase 5: define vacunación, prevención de exposiciones y el plan de farmacovigilancia.</li><li>Fase 5: propone tres indicadores (control, exacerbaciones, uso de rescate) y la frecuencia del seguimiento.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (diagnóstico).</strong> Rasgos de asma y de EPOC y su implicación para el tratamiento.</li>
  <li><strong>Fase 2 · Unidad 2 (farmacología).</strong> Revisión de cada medicamento, efectos adversos y sobreuso de rescate.</li>
  <li><strong>Fase 3 · Unidad 3 (asma).</strong> Propuesta de esquema con corticoide inhalado según GINA 2026.</li>
  <li><strong>Fase 4 · Unidad 4 (EPOC y exacerbaciones).</strong> Componente EPOC y plan ante una exacerbación.</li>
  <li><strong>Fase 5 · Unidad 5 (seguimiento).</strong> Dispositivos, adherencia, prevención, farmacovigilancia e indicadores.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar un plan ante exacerbaciones y un seguimiento con indicadores.</li><li>Integrar dispositivos, adherencia, prevención y farmacovigilancia.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 8 horas de trabajo individual.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 16 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 16 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Integración y mejora</td><td>15 %</td><td>Integra las cinco fases y documenta cada corrección.</td><td>Integra y corrige lo principal.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Exacerbaciones</td><td>20 %</td><td>Plan de acción escrito con señales de alarma y conducta según GINA y GOLD.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Dispositivo y adherencia</td><td>25 %</td><td>Dispositivo justificado, lista de chequeo, verificación repetida y medición de adherencia.</td><td>Correcto sin medición de adherencia.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Prevención y farmacovigilancia</td><td>20 %</td><td>Vacunas, exposiciones y reacciones a vigilar con su reporte.</td><td>Prevención o farmacovigilancia incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores</td><td>10 %</td><td>Tres indicadores medibles con frecuencia de seguimiento.</td><td>Indicadores generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfae_html$;
  v_t3 := $evfae_html$<h2>Caso de estudio</h2>
<p>Doña Carmenza tiene 59 años, vive en Ibagué, tiene asma desde la infancia, fumó 20 años (lo dejó hace 5) y cocinó con leña en su juventud (datos simulados). Espirometría posbroncodilatador: FEV1/FVC 0,65, FEV1 60 %, reversibilidad de 14 % y 250 mL. Eosinófilos: 360 células/µL. Usa tiotropio, salbutamol (6 inhaladores en el año) y montelukast; desde que inició el montelukast duerme mal. Tuvo una exacerbación con prednisolona hace 4 meses. Su EPS la asignó al programa respiratorio donde tú eres el QF responsable del seguimiento. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité del programa respiratorio.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfae_html$;
  v_t4 := 'Plan integral de seguimiento con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfae_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Estrategia GINA 2026; Informe GOLD 2026 y su guía de bolsillo; guías de práctica clínica del Ministerio de Salud de asma (2013) y EPOC (2014); fichas técnicas e insertos aprobados por el INVIMA de salbutamol, budesonida-formoterol, tiotropio y montelukast; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA y Resolución 2024015321 de 2024; lineamientos de vacunación del Ministerio de Salud. En Colombia prevalece el inserto aprobado por el INVIMA. Cita en APA 7.</p>$evfae_html$;
  v_t7 := NULL;
  v_j1 := $evfae_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Plan ante exacerbaciones.","Dispositivo, técnica y adherencia.","Prevención y farmacovigilancia.","Indicadores y resumen ejecutivo."]$evfae_json$::jsonb;
  v_j2 := $evfae_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"exacerbaciones","name":"Exacerbaciones","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Plan de acción escrito con señales de alarma y conducta según GINA y GOLD."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"dispositivo-y-adherencia","name":"Dispositivo y adherencia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Dispositivo justificado, lista de chequeo, verificación repetida y medición de adherencia."},{"level":3,"label":"Logrado","description":"Correcto sin medición de adherencia."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"prevencion-y-farmacovigilancia","name":"Prevención y farmacovigilancia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Vacunas, exposiciones y reacciones a vigilar con su reporte."},{"level":3,"label":"Logrado","description":"Prevención o farmacovigilancia incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores","name":"Indicadores","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Tres indicadores medibles con frecuencia de seguimiento."},{"level":3,"label":"Logrado","description":"Indicadores generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfae_json$::jsonb;
  SELECT id INTO v_act FROM aula_activities
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_act IS NULL THEN
    INSERT INTO aula_activities
      (course_id, module_id, title, instructions_html, case_html, points_to_solve, expected_product,
       extension_hint, support_html, teacher_guide_html, rubric, grading_method, allow_text, allow_link,
       allow_file, accepted_extensions, max_file_mb, max_points, is_required, status, sort_order, weight)
    VALUES
      (v_curso, v_unidad, v_t1, v_t2, v_t3, v_j1, v_t4,
       v_t5, v_t6, v_t7, v_j2, 'rubrica', TRUE, TRUE,
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 15, 16)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 15, updated_at = NOW()
     WHERE id = v_act;
    IF EXISTS (SELECT 1 FROM aula_submissions WHERE activity_id = v_act) THEN
      RAISE NOTICE 'La actividad % tiene entregas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_activities
         SET rubric = v_j2, grading_method = 'rubrica', weight = 16,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Foro fae-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con los inhaladores';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfae_html$<h2>Para empezar</h2>
<p>Piensa en una persona con asma o EPOC que hayas atendido o acompañado y cuéntanos en tres o cuatro líneas una dificultad que tuvo con su inhalador, sin nombres ni datos que la identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfae_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre el asma o la EPOC te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfae_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfae_html$;
  v_t6 := $evfae_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfae_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué dispositivo de inhalación te parece más difícil de enseñar?', '¿Has visto personas que compran salbutamol con mucha frecuencia?']::text[];
  v_j1 := NULL;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, NULL, 'curso', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'formativa', NULL, v_j1,
       FALSE, FALSE, 'publicado', 0)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = NULL, scope = 'curso', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 0, updated_at = NOW()
     WHERE id = v_foro;
  END IF;


  -- ── Foro fae-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: asma, EPOC, diagnóstico diferencial y contexto colombiano' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: asma, EPOC, diagnóstico diferencial y contexto colombiano) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Asma, EPOC o ambas?';
  v_t2 := 'Argumentar por qué el diagnóstico diferencial cambia el tratamiento, sobre todo el uso del corticoide inhalado.';
  v_t3 := $evfae_html$<h2>Caso del foro</h2>
<p>Don Wilson tiene 55 años, asma desde la infancia y fuma desde los 18 años (datos simulados). Su espirometría muestra FEV1/FVC posbroncodilatador de 0,66 con reversibilidad de 15 % y 280 mL; eosinófilos de 400 células/µL. Un médico le formuló solo tiotropio «porque tiene EPOC» y otro solo budesonida-formoterol «porque tiene asma».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfae_html$;
  v_t4 := '¿Cómo integrarías los rasgos de ambas enfermedades y qué riesgo tiene cada una de las fórmulas?';
  v_t5 := $evfae_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de GINA o GOLD que sustenta tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfae_html$;
  v_t6 := $evfae_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de GINA o GOLD que sustenta tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfae_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué en el asma un broncodilatador de acción prolongada nunca debe usarse sin corticoide inhalado?', '¿Qué aporta la cesación del tabaco en ambos diagnósticos?', '¿Qué biomarcador sugiere un mayor beneficio del corticoide inhalado?']::text[];
  v_j1 := $evfae_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de GINA o GOLD que sustenta tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfae_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 1)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 1, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fae-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Farmacología de broncodilatadores, corticoides inhalados y otros controladores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Farmacología de broncodilatadores, corticoides inhalados y otros controladores) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · El salbutamol sin fórmula';
  v_t2 := 'Argumentar el papel del servicio farmacéutico ante la compra frecuente de inhaladores de rescate sin fórmula.';
  v_t3 := $evfae_html$<h2>Caso del foro</h2>
<p>Una droguería de barrio vende cada mes unos 40 inhaladores de salbutamol sin fórmula (datos simulados). Hay compradores que vuelven cada dos o tres semanas. El dueño dice que «si no se los vendemos, se ahogan» y que «no es nuestro problema si no van al médico».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfae_html$;
  v_t4 := '¿Qué debería hacer el servicio farmacéutico con las personas que compran salbutamol con frecuencia, sin dejar de atender la urgencia?';
  v_t5 := $evfae_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de GINA o la norma del servicio farmacéutico que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfae_html$;
  v_t6 := $evfae_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de GINA o la norma del servicio farmacéutico que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfae_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué indicador de riesgo propone GINA sobre el número de inhaladores de SABA al año?', '¿Qué preguntas harías para evaluar el control del asma en la droguería?', '¿Cómo cambia el riesgo si la persona nunca ha usado corticoide inhalado?']::text[];
  v_j1 := $evfae_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de GINA o la norma del servicio farmacéutico que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfae_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 2)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 2, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fae-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Farmacoterapia del asma: tratamiento escalonado, MART y asma grave' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Farmacoterapia del asma: tratamiento escalonado, MART y asma grave) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · ¿Biológico o primero lo básico?';
  v_t2 := 'Argumentar qué debe verificarse antes de proponer un biológico en el asma.';
  v_t3 := $evfae_html$<h2>Caso del foro</h2>
<p>Una paciente de 39 años con asma no controlada pese a ICS-LABA a dosis alta llega con una orden de un biológico que su EPS aún no autoriza (datos simulados). Su ACT es 12, tuvo tres ciclos de corticoide oral en el año, eosinófilos de 520 células/µL. En la farmacia se observa que usa el inhalador presurizado sin cámara y sin agitar, tiene reflujo sin tratamiento y su casa tiene humedad y moho.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfae_html$;
  v_t4 := '¿Qué debería verificarse y corregirse mientras se tramita el biológico y por qué?';
  v_t5 := $evfae_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de GINA 2026 que sustenta cada paso. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfae_html$;
  v_t6 := $evfae_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de GINA 2026 que sustenta cada paso.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfae_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué diferencia hay entre asma de difícil control y asma grave?', '¿Qué biomarcadores orientan la elección del biológico?', '¿Qué opciones tiene GINA antes o junto con los biológicos?']::text[];
  v_j1 := $evfae_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de GINA 2026 que sustenta cada paso."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfae_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 3)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 3, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fae-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Farmacoterapia de la EPOC y manejo de exacerbaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Farmacoterapia de la EPOC y manejo de exacerbaciones) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · ¿Corticoide inhalado en la EPOC: a quién?';
  v_t2 := 'Argumentar cuándo el corticoide inhalado aporta beneficio en la EPOC y cuándo conviene retirarlo.';
  v_t3 := $evfae_html$<h2>Caso del foro</h2>
<p>En un programa de EPOC, el 60 % de los pacientes usa una combinación ICS-LABA (datos simulados). Entre ellos: un hombre sin exacerbaciones con eosinófilos de 80 células/µL y dos neumonías en el año; una mujer con dos exacerbaciones y eosinófilos de 450; y un exfumador con una exacerbación y eosinófilos de 150 que usa LABA+LAMA.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfae_html$;
  v_t4 := '¿A quién mantendrías, iniciarías o retirarías el corticoide inhalado y por qué?';
  v_t5 := $evfae_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el criterio de GOLD 2026 que aplicas en cada caso. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfae_html$;
  v_t6 := $evfae_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio de GOLD 2026 que aplicas en cada caso.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfae_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué umbrales de eosinófilos usa GOLD para decidir sobre el ICS?', '¿Qué riesgos tiene el ICS en la EPOC?', '¿Qué opciones hay si las exacerbaciones persisten con eosinófilos bajos?']::text[];
  v_j1 := $evfae_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio de GOLD 2026 que aplicas en cada caso."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfae_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 4)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 4, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro fae-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Dispositivos, adherencia, prevención y seguimiento farmacoterapéutico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Dispositivos, adherencia, prevención y seguimiento farmacoterapéutico) en Farmacoterapia del Asma y la EPOC: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Leña, tabaco y vacunas';
  v_t2 := 'Argumentar qué medidas de prevención puede impulsar el servicio farmacéutico en asma y EPOC, sobre todo en zonas rurales.';
  v_t3 := $evfae_html$<h2>Caso del foro</h2>
<p>Un servicio farmacéutico rural atiende a 120 personas con EPOC o asma (datos simulados). El 45 % cocina con leña dentro de la casa, el 20 % fuma, solo el 30 % tiene la vacuna de influenza del año y nadie ha recibido la de VSR. El puesto de vacunación más cercano queda a una hora en bus.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfae_html$;
  v_t4 := '¿Qué tres intervenciones priorizarías y cómo medirías su efecto?';
  v_t5 := $evfae_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de GOLD, GINA o el lineamiento de vacunación que sustenta cada intervención. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfae_html$;
  v_t6 := $evfae_html$<h2>Normas de participación</h2>
<p>Discute argumentos, no personas. No compartas datos de pacientes reales ni documentos internos de empresas. Cita la fuente de cada norma o dato. Si usas herramientas de IA, decláralo y verifica cada cita en la fuente original.</p>
<h2>Criterios de valoración</h2>
<p>Pertinencia (30 %), razonamiento con evidencia (40 %) e interacción sustantiva (30 %). No se califica el número de mensajes.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica del foro (los pesos suman 100 %)</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Pertinencia</td><td>30 %</td><td>Responde la pregunta central y usa los datos concretos del caso.</td><td>Responde la pregunta central y menciona el caso.</td><td>Responde de forma general, con poca relación con el caso.</td><td>Se aleja de la pregunta central.</td><td>No hay intervención o no responde.</td></tr>
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de GOLD, GINA o el lineamiento de vacunación que sustenta cada intervención.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfae_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué recomienda GOLD 2026 sobre las vacunas en EPOC?', '¿Qué puede hacer el servicio farmacéutico frente al humo de leña?', '¿Cómo apoyarías la cesación del tabaco?']::text[];
  v_j1 := $evfae_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de GOLD, GINA o el lineamiento de vacunación que sustenta cada intervención."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfae_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 2, v_j1,
       FALSE, FALSE, 'publicado', 5)
    RETURNING id INTO v_foro;
  ELSE
    UPDATE aula_forums
       SET status = 'publicado', module_id = v_unidad, scope = 'modulo', purpose = v_t2, description = v_t3,
           central_question = v_t4, guiding_questions = v_a1, participation_html = v_t5,
           rules_html = v_t6, no_participants_alternative = v_t7, sort_order = 5, updated_at = NOW()
     WHERE id = v_foro;
    IF EXISTS (SELECT 1 FROM aula_forum_grades WHERE forum_id = v_foro) THEN
      RAISE NOTICE 'El foro % tiene notas: se conserva su rúbrica y su peso.', v_t1;
    ELSE
      UPDATE aula_forums
         SET grading_method = 'rubrica', weight = 2, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  RAISE NOTICE 'Farmacoterapia del Asma y la EPOC: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfae$;

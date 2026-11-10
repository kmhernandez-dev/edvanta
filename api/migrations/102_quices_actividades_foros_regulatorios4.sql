-- ============================================================
--  102_quices_actividades_foros_regulatorios4.sql — quizzes, actividades y foros, lote «regulatorios4»
--
--  Generado por scripts/evaluacion-aula.mjs regulatorios4 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Etiquetado e Insertos de Medicamentos; Estudios de Estabilidad para el Registro de Medicamentos.
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
--  Curso de Etiquetado e Insertos de Medicamentos
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evetiq$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Etiquetado e Insertos de Medicamentos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos y marco normativo del etiquetado de medicamentos en Colombia', 'Unidad 2. Leyendas obligatorias y regímenes especiales de etiquetado', 'Unidad 3. Inserto, información para prescribir (IPP) e información de seguridad', 'Unidad 4. Diseño, legibilidad y prevención de errores de medicación', 'Unidad 5. Aprobación de artes y control de cambios del material de empaque']::text[])) < 5 THEN
    RAISE NOTICE 'Etiquetado e Insertos de Medicamentos: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evetiq_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evetiq_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz etiq-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo del etiquetado de medicamentos en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo del etiquetado de medicamentos en Colombia) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos y marco normativo del etiquetado de medicamentos en Colombia';
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


    v_t3 := 'Según el artículo 70 del Decreto 677 de 1995, ¿qué relación hay entre el envase y el registro sanitario?';
    v_t4 := 'El artículo 70 del Decreto 677 de 1995 dispone que el Invima, previo concepto técnico, aprueba los envases al otorgar el registro, y prohíbe expender o entregar medicamentos al público fuera del envase aprobado. El artículo 71 permite el envase hospitalario solo a clínicas y hospitales, con el medicamento plenamente identificado al entregarlo.';
    v_j1 := $evetiq_json${"external_id":"etiq-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Decreto 677 de 1995: envases y etiquetas (arts. 70-74) y su vigencia","outcome":"Decreto 677 de 1995: envases y etiquetas (arts. 70-74) y su vigencia","source":"Decreto 677 de 1995, arts. 70 y 71."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u1-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El envase lo elige libremente el titular después de obtener el registro, sin informar nada al Invima.', FALSE, 'El envase se aprueba con el registro.', 0),
      (v_pregunta, 'El Invima lo aprueba con el registro y se prohíbe entregar el medicamento fuera de ese envase.', TRUE, 'Correcto. El envase es parte del producto aprobado.', 1),
      (v_pregunta, 'El envase solo se revisa si el medicamento es de control especial o de uso hospitalario.', FALSE, 'La aprobación aplica a todos los medicamentos.', 2),
      (v_pregunta, 'El envase lo aprueba el fabricante del material de empaque mediante un certificado de calidad.', FALSE, 'La aprobación corresponde al Invima.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Al revisar la caja de un medicamento, ¿cuál de estas leyendas exige el artículo 72 del Decreto 677 de 1995?';
    v_t4 := 'El artículo 72 exige, entre otros datos, el nombre o marca con la denominación genérica (literal a), la fecha de vencimiento (literal d), la condición de venta (literal j) y la leyenda «Manténgase fuera del alcance de los niños» (literal n). La leyenda de las etiquetas requiere aprobación del Invima.';
    v_j1 := $evetiq_json${"external_id":"etiq-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Datos y leyendas obligatorias del art. 72 del Decreto 677","outcome":"Datos y leyendas obligatorias del art. 72 del Decreto 677","source":"Decreto 677 de 1995, art. 72."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u1-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, '«Manténgase fuera del alcance de los niños», con los demás datos del artículo.', TRUE, 'Correcto. Es el literal n del artículo 72.', 0),
      (v_pregunta, '«Producto natural sin efectos secundarios», para orientar al consumidor en la compra.', FALSE, 'Es una afirmación engañosa y no es una leyenda exigida.', 1),
      (v_pregunta, '«Recomendado por los médicos», cuando el producto sea de venta libre.', FALSE, 'No es una leyenda exigida y tiene carácter publicitario.', 2),
      (v_pregunta, '«Garantía de satisfacción», para cumplir con el estatuto del consumidor.', FALSE, 'No es una leyenda que exija el artículo 72.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una lista de verificación interna de artes todavía exige la «franja de control especial del artículo 73 del Decreto 677». ¿Qué análisis es correcto?';
    v_t4 := 'El artículo 73 y el literal l del artículo 72 del Decreto 677 de 1995 fueron derogados por el artículo 14 del Decreto 843 de 2016. Las listas de verificación deben citar normas vigentes; para los medicamentos de control especial se revisa el marco que hoy los regula.';
    v_j1 := $evetiq_json${"external_id":"etiq-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Decreto 677 de 1995: envases y etiquetas (arts. 70-74) y su vigencia","outcome":"Decreto 677 de 1995: envases y etiquetas (arts. 70-74) y su vigencia","source":"Decreto 677 de 1995, arts. 72 y 73; Decreto 843 de 2016, art. 14."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u1-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'La lista está al día, porque el artículo 73 es la norma vigente para todos los medicamentos.', FALSE, 'El artículo 73 fue derogado.', 0),
      (v_pregunta, 'La lista debe eliminar todo requisito para medicamentos de control especial.', FALSE, 'Siguen existiendo reglas para estos medicamentos.', 1),
      (v_pregunta, 'La lista está desactualizada: el artículo 73 fue derogado y debe revisarse la norma que hoy rige ese punto.', TRUE, 'Correcto. Por eso se verifica la vigencia de cada fuente.', 2),
      (v_pregunta, 'La lista está al día si el producto es importado, porque el artículo 74 remite al 73.', FALSE, 'La remisión a una norma derogada no la revive.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Mercadeo propone imprimir en la caja una fecha de vencimiento de seis años desde la fabricación, «porque el producto es muy estable». ¿Cuál es la mejor valoración?';
    v_t4 := 'El literal d del artículo 72 del Decreto 677 de 1995 dispone que la fecha de vencimiento no puede superar cinco años desde la elaboración. La vida útil impresa debe ser la aprobada en el registro y respaldada por los estudios de estabilidad.';
    v_j1 := $evetiq_json${"external_id":"etiq-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Datos y leyendas obligatorias del art. 72 del Decreto 677","outcome":"Datos y leyendas obligatorias del art. 72 del Decreto 677","source":"Decreto 677 de 1995, art. 72, literal d."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u1-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es aceptable si el área de calidad firma una carta que respalde la estabilidad del producto.', FALSE, 'Una carta no cambia el límite de la norma.', 0),
      (v_pregunta, 'Es aceptable si se trata de un medicamento de venta libre con amplio margen de seguridad.', FALSE, 'El límite aplica a todos los medicamentos.', 1),
      (v_pregunta, 'Es aceptable porque el titular decide la vida útil que imprime en la etiqueta.', FALSE, 'La vida útil se aprueba con el registro.', 2),
      (v_pregunta, 'No es aceptable: la fecha no puede superar cinco años desde la elaboración y debe coincidir con lo aprobado.', TRUE, 'Correcto. Además debe respaldarla la estabilidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz etiq-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Leyendas obligatorias y regímenes especiales de etiquetado' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Leyendas obligatorias y regímenes especiales de etiquetado) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Leyendas obligatorias y regímenes especiales de etiquetado';
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


    v_t3 := 'Según el parágrafo 1 del artículo 72 del Decreto 677, ¿qué no debe aparecer en la etiqueta de un medicamento de venta bajo fórmula médica?';
    v_t4 := 'El parágrafo 1 del artículo 72 dispone que en los medicamentos de venta bajo fórmula médica u odontológica no deben aparecer las indicaciones, salvo las excepciones que defina el Invima, pero sí la posología, las advertencias y las contraindicaciones.';
    v_j1 := $evetiq_json${"external_id":"etiq-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"'Venta bajo fórmula médica' vs. venta libre y uso institucional","outcome":"'Venta bajo fórmula médica' vs. venta libre y uso institucional","source":"Decreto 677 de 1995, art. 72, parágrafo 1."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u2-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'La posología, porque solo el médico puede indicarla al paciente en la consulta.', FALSE, 'La posología sí debe aparecer.', 0),
      (v_pregunta, 'Las advertencias y contraindicaciones, porque asustan al paciente.', FALSE, 'Deben aparecer en la etiqueta.', 1),
      (v_pregunta, 'Las indicaciones, salvo las excepciones que defina el Invima.', TRUE, 'Correcto. Sí aparecen posología, advertencias y contraindicaciones.', 2),
      (v_pregunta, 'El nombre genérico, porque basta con la marca comercial del producto.', FALSE, 'El nombre genérico es obligatorio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un medicamento importado conserva la etiqueta del país de origen en inglés. Según el artículo 74 del Decreto 677, ¿qué debe incluir en español como mínimo?';
    v_t4 := 'El artículo 74 del Decreto 677 de 1995 acepta las etiquetas de los importados tal como se establecieron en el país de origen, siempre que incluyan en español el nombre o la dirección del importador, la composición, las condiciones especiales de almacenamiento cuando apliquen y el número de registro sanitario. También les aplica la prohibición de indicaciones del parágrafo 1 del artículo 72.';
    v_j1 := $evetiq_json${"external_id":"etiq-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso práctico: sticker y reetiquetado de un medicamento importado","outcome":"Caso práctico: sticker y reetiquetado de un medicamento importado","source":"Decreto 677 de 1995, art. 74."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u2-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Solo la marca comercial, porque el resto puede leerse en el inserto en inglés.', FALSE, 'Se exige más información en español.', 0),
      (v_pregunta, 'El importador, la composición, las condiciones de almacenamiento y el número de registro.', TRUE, 'Correcto. Suele agregarse con un adhesivo aprobado.', 1),
      (v_pregunta, 'La traducción completa de toda la etiqueta, incluida la publicidad que se usa en el país de origen.', FALSE, 'El artículo fija un mínimo, no una traducción total.', 2),
      (v_pregunta, 'El precio de venta al público y el nombre de la farmacia que lo dispensa.', FALSE, 'No es lo que exige el artículo 74.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular quiere clasificar como de venta libre un analgésico. ¿Qué criterio de la Resolución 886 de 2004 analizarías primero?';
    v_t4 := 'El artículo 1 de la Resolución 886 de 2004 exige, entre otros, efectividad probada, amplio margen de seguridad, trayectoria no menor de cinco años, uso para afecciones leves que el usuario reconoce, bajo potencial de dependencia, no enmascarar enfermedades serias y no ser de administración parenteral. El artículo 2 exige presentar los estudios a la Comisión Revisora.';
    v_j1 := $evetiq_json${"external_id":"etiq-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Medicamentos de venta libre: criterios de clasificación y etiqueta orientada al usuario","outcome":"Medicamentos de venta libre: criterios de clasificación y etiqueta orientada al usuario","source":"Resolución 886 de 2004, arts. 1 y 2."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u2-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Efectividad probada, amplio margen de seguridad y trayectoria no menor de cinco años.', TRUE, 'Correcto. Junto con los demás criterios del artículo 1.', 0),
      (v_pregunta, 'Que el precio sea bajo para que los usuarios puedan comprarlo sin fórmula médica en cualquier tienda.', FALSE, 'El precio no es un criterio.', 1),
      (v_pregunta, 'Que el producto se fabrique en Colombia y no sea importado.', FALSE, 'El origen no es un criterio.', 2),
      (v_pregunta, 'Que se administre por vía parenteral para asegurar el efecto rápido.', FALSE, 'Al contrario: no debe ser parenteral.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un laboratorio entrega muestras médicas con la misma caja comercial y un adhesivo que dice «Gratis». ¿Cuál es la mejor valoración?';
    v_t4 := 'El Decreto 677 de 1995 (art. 76) exige que las muestras médicas lleven la leyenda que las identifica como «Muestra médica prohibida su venta». Por eso la muestra tiene un arte propio aprobado, distinto del comercial.';
    v_j1 := $evetiq_json${"external_id":"etiq-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Muestra médica y nombre genérico en la etiqueta","outcome":"Muestra médica y nombre genérico en la etiqueta","source":"Decreto 677 de 1995, art. 76."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u2-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es suficiente, porque el adhesivo informa claramente al médico que el producto no tiene costo.', FALSE, '«Gratis» no reemplaza la leyenda exigida.', 0),
      (v_pregunta, 'Es suficiente si las muestras se entregan solo a médicos especialistas.', FALSE, 'El destinatario no cambia el requisito de la etiqueta.', 1),
      (v_pregunta, 'Es inadecuado: la muestra médica lleva la leyenda del Decreto 677 y un arte aprobado.', TRUE, 'Correcto. Es un arte distinto del comercial.', 2),
      (v_pregunta, 'Es inadecuado solo porque el adhesivo debería decir «Promoción».', FALSE, 'El problema es la falta de la leyenda exigida.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz etiq-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Inserto, información para prescribir (IPP) e información de seguridad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Inserto, información para prescribir (IPP) e información de seguridad) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Inserto, información para prescribir (IPP) e información de seguridad';
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


    v_t3 := '¿Qué diferencia hay entre el inserto y la información para prescribir (IPP)?';
    v_t4 := 'El inserto acompaña al medicamento y se dirige al paciente o cuidador; la IPP es el documento técnico para el profesional. Ambos deben reflejar lo aprobado en el registro sanitario y en las actas de la Sala Especializada.';
    v_j1 := $evetiq_json${"external_id":"etiq-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción: inserto, IPP y su relación con el registro sanitario","outcome":"Introducción: inserto, IPP y su relación con el registro sanitario","source":"Decreto 677 de 1995; actas de la Sala Especializada."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u3-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El inserto es publicidad del producto y la IPP es el contrato de compra con la farmacia.', FALSE, 'Ninguno de los dos es publicidad ni contrato.', 0),
      (v_pregunta, 'El inserto es solo para hospitales y la IPP solo para farmacias de barrio.', FALSE, 'La diferencia es el destinatario, no el canal.', 1),
      (v_pregunta, 'No hay diferencia: son el mismo documento con dos nombres distintos.', FALSE, 'Son documentos distintos.', 2),
      (v_pregunta, 'El inserto se dirige al paciente y la IPP al profesional que prescribe; ambos reflejan lo aprobado.', TRUE, 'Correcto. Deben coincidir con el registro y las actas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una agencia de referencia comunica una nueva reacción adversa que debe incluirse en el inserto. Según el Decreto 334 de 2022, ¿qué tipo de cambio es en principio?';
    v_t4 := 'El Decreto 334 de 2022 clasifica los cambios de seguridad y eficacia; una nueva reacción adversa, advertencia o contraindicación es, en principio, un cambio en la información del etiquetado. Si el riesgo exige acción inmediata, se gestiona como cambio urgente de seguridad, con acuerdo previo del Invima y radicación posterior.';
    v_j1 := $evetiq_json${"external_id":"etiq-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Tipos de modificación de seguridad y eficacia (GU079, GU044 y ACOM-INS80)","outcome":"Tipos de modificación de seguridad y eficacia (GU079, GU044 y ACOM-INS80)","source":"Decreto 334 de 2022, art. 8."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u3-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Un cambio en la información del etiquetado, con los plazos del artículo 8.', TRUE, 'Correcto. Salvo que sea un cambio urgente de seguridad.', 0),
      (v_pregunta, 'Un cambio de mercadeo que el titular implementa directamente, sin informar nada al Invima.', FALSE, 'Es un cambio de información de seguridad.', 1),
      (v_pregunta, 'Un cambio que exige un nuevo registro sanitario del medicamento.', FALSE, 'Se tramita como modificación.', 2),
      (v_pregunta, 'Un cambio administrativo igual a corregir la dirección del titular.', FALSE, 'Afecta la información de seguridad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular quiere agregar al inserto una indicación aprobada en otro país, sin tramitarla ante el Invima. ¿Qué análisis es correcto?';
    v_t4 := 'El inserto y la IPP solo pueden contener lo aprobado. Una nueva indicación es una modificación de seguridad y eficacia que, según el Decreto 334 de 2022 (art. 8), requiere aprobación previa del Invima.';
    v_j1 := $evetiq_json${"external_id":"etiq-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Coherencia con el registro, las actas de la Comisión Revisora y las agencias de referencia","outcome":"Coherencia con el registro, las actas de la Comisión Revisora y las agencias de referencia","source":"Decreto 334 de 2022, art. 8."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u3-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es válido, porque la aprobación de una agencia extranjera se reconoce en Colombia de manera automática.', FALSE, 'No hay reconocimiento automático.', 0),
      (v_pregunta, 'Es válido si la nueva indicación se agrega solo en la IPP y no en el inserto.', FALSE, 'Tampoco puede agregarse en la IPP.', 1),
      (v_pregunta, 'No es válido: una nueva indicación es un cambio de seguridad y eficacia con aprobación previa.', TRUE, 'Correcto. El inserto refleja lo aprobado.', 2),
      (v_pregunta, 'Es válido mientras no se mencione la nueva indicación en la publicidad.', FALSE, 'El problema es el inserto mismo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En un inserto para pacientes se lee: «Puede producir hepatotoxicidad idiosincrática». ¿Cuál es la mejor valoración?';
    v_t4 := 'El inserto se redacta en lenguaje claro para el paciente, con equilibrio entre beneficios y riesgos y signos de alarma comprensibles, sin alterar el contenido aprobado. La IPP conserva la terminología técnica.';
    v_j1 := $evetiq_json${"external_id":"etiq-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Lenguaje para pacientes y legibilidad del inserto","outcome":"Lenguaje para pacientes y legibilidad del inserto","source":"Buenas prácticas de redacción de insertos."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u3-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es adecuado, porque usa el término técnico exacto que aprobó la Sala Especializada en su concepto.', FALSE, 'El inserto se dirige al paciente.', 0),
      (v_pregunta, 'Es adecuado si el paciente puede buscar el término en internet.', FALSE, 'El inserto debe entenderse sin ayuda.', 1),
      (v_pregunta, 'Es inadecuado solo porque el texto debería estar en negrilla y mayúsculas.', FALSE, 'El problema principal es el lenguaje.', 2),
      (v_pregunta, 'Conviene decirlo en lenguaje claro, como «daño en el hígado», sin cambiar lo aprobado.', TRUE, 'Correcto. Con los signos de alarma.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz etiq-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Diseño, legibilidad y prevención de errores de medicación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Diseño, legibilidad y prevención de errores de medicación) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Diseño, legibilidad y prevención de errores de medicación';
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


    v_t3 := '¿Qué son los medicamentos LASA?';
    v_t4 := 'LASA (look-alike, sound-alike) designa medicamentos de aspecto o nombre parecido. La OMS, en el reto mundial Medicación sin daño, los identifica como una causa frecuente de errores prevenibles; las similitudes pueden ser de nombre, de envase o de ambos.';
    v_j1 := $evetiq_json${"external_id":"etiq-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Qué son los medicamentos LASA y cómo generan errores","outcome":"Qué son los medicamentos LASA y cómo generan errores","source":"OMS, Medication Without Harm; guía técnica sobre medicamentos LASA (2023)."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u4-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Medicamentos de alto costo que requieren autorización especial del asegurador.', FALSE, 'No se refiere al costo.', 0),
      (v_pregunta, 'Medicamentos de aspecto o nombre parecido, que pueden confundirse y causar errores.', TRUE, 'Correcto. La OMS los señala como causa de daño prevenible.', 1),
      (v_pregunta, 'Medicamentos de liberación prolongada que se administran una vez al día.', FALSE, 'No se refiere a la forma farmacéutica.', 2),
      (v_pregunta, 'Medicamentos importados con etiqueta en un idioma distinto al español.', FALSE, 'No se refiere al idioma.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué estrategia de diseño ayuda a diferenciar nombres parecidos como DOPamina y DOBUTamina?';
    v_t4 := 'Las letras mayúsculas resaltadas (tall man) destacan la parte del nombre que difiere. Se combinan con diferenciación cromática, jerarquía visual, código de barras y evaluación de nombres antes de aprobar una marca.';
    v_j1 := $evetiq_json${"external_id":"etiq-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Estrategias de prevención aplicadas al diseño del empaque","outcome":"Estrategias de prevención aplicadas al diseño del empaque","source":"OMS e ISMP, estrategias de prevención de errores con medicamentos LASA."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u4-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Imprimir ambos nombres con la misma fuente y el mismo color para mantener la imagen de marca.', FALSE, 'Aumenta la confusión.', 0),
      (v_pregunta, 'Resaltar con mayúsculas las letras que los diferencian (tall man) y diferenciar el diseño.', TRUE, 'Correcto. Junto con otras barreras.', 1),
      (v_pregunta, 'Eliminar el nombre genérico y dejar solo la marca comercial en la caja.', FALSE, 'El nombre genérico es obligatorio.', 2),
      (v_pregunta, 'Reducir el tamaño de los nombres para dar más espacio al logotipo.', FALSE, 'Reduce la legibilidad del nombre.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una línea tiene presentaciones de 5 mg y 10 mg con cajas idénticas que solo difieren en el número. ¿Qué análisis es correcto?';
    v_t4 := 'Los envases casi idénticos para distintas concentraciones son una causa reconocida de errores de medicación. Diferenciar color, jerarquía visual y ubicación de la concentración reduce el riesgo; el cambio de arte se clasifica según el Decreto 334 de 2022.';
    v_j1 := $evetiq_json${"external_id":"etiq-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Legibilidad, jerarquía visual y diseño seguro del arte","outcome":"Legibilidad, jerarquía visual y diseño seguro del arte","source":"OMS, guía técnica sobre medicamentos LASA (2023); Decreto 334 de 2022."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u4-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Hay riesgo de confusión; conviene diferenciar color, jerarquía y ubicación de la concentración.', TRUE, 'Correcto. Y clasificar el cambio de arte.', 0),
      (v_pregunta, 'No hay riesgo, porque el número de la concentración es suficiente para cualquier usuario atento.', FALSE, 'La similitud del envase induce errores.', 1),
      (v_pregunta, 'El riesgo se elimina si se imprime el logotipo más grande en ambas cajas.', FALSE, 'El logotipo no diferencia las concentraciones.', 2),
      (v_pregunta, 'El riesgo es solo de mercadeo, porque las ventas de ambas presentaciones se confunden.', FALSE, 'Es un riesgo para el paciente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En un arte se lee la concentración «1.0 mg». ¿Cuál es la mejor valoración?';
    v_t4 := 'Las recomendaciones de seguridad desaconsejan los ceros finales después del decimal («1.0 mg»), porque pueden leerse como diez veces la dosis. La concentración se expresa sin ceros finales y con jerarquía visual clara.';
    v_j1 := $evetiq_json${"external_id":"etiq-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Legibilidad, jerarquía visual y diseño seguro del arte","outcome":"Legibilidad, jerarquía visual y diseño seguro del arte","source":"ISMP, recomendaciones sobre expresión de dosis."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u4-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es adecuado, porque el cero decimal da precisión a la concentración.', FALSE, 'El cero final puede leerse como 10 mg.', 0),
      (v_pregunta, 'Es adecuado si el punto decimal se imprime en negrilla.', FALSE, 'Sigue siendo un riesgo.', 1),
      (v_pregunta, 'Es inadecuado solo porque debería escribirse en microgramos.', FALSE, 'El problema es el cero final.', 2),
      (v_pregunta, 'Conviene escribir «1 mg»: el cero final tras el decimal puede leerse como «10 mg».', TRUE, 'Correcto. Es una recomendación de seguridad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz etiq-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Aprobación de artes y control de cambios del material de empaque' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Aprobación de artes y control de cambios del material de empaque) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Aprobación de artes y control de cambios del material de empaque';
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


    v_t3 := '¿Cuál es el punto de partida de un procedimiento interno de elaboración de artes?';
    v_t4 := 'Un procedimiento robusto parte del texto maestro que elabora Regulatorios con base en la resolución del registro, las actas de la Sala y el Decreto 677; luego se diseña el arte, lo revisan Regulatorios, Calidad, Mercadeo y Producción, se aprueba y se controla la prueba de impresión frente al texto maestro.';
    v_j1 := $evetiq_json${"external_id":"etiq-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Procedimiento interno de elaboración y aprobación de artes","outcome":"Procedimiento interno de elaboración y aprobación de artes","source":"Decreto 677 de 1995, arts. 72 y 74; buenas prácticas de control de material de empaque."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u5-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El diseño que propone Mercadeo, al que luego se agregan los datos legales que falten.', FALSE, 'Así se cuelan errores regulatorios.', 0),
      (v_pregunta, 'El texto maestro que elabora Regulatorios a partir de la resolución del registro y de las actas.', TRUE, 'Correcto. Luego se diseña y se revisa.', 1),
      (v_pregunta, 'El arte de la competencia, para mantener una presentación similar en el mercado.', FALSE, 'Copiar a la competencia puede generar confusiones.', 2),
      (v_pregunta, 'La prueba de impresión del proveedor, que se aprueba si los colores se ven bien.', FALSE, 'La prueba de impresión es una etapa posterior.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Se va a actualizar el arte con una advertencia aprobada en un cambio de seguridad. ¿Qué incluye la implementación?';
    v_t4 := 'La implementación de un cambio aprobado recorre la cadena completa: resolución, texto maestro, artes (caja, blíster, inserto), IPP y medios digitales, con un punto de corte definido, control del inventario de material anterior y trazabilidad por lote.';
    v_j1 := $evetiq_json${"external_id":"etiq-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Clasificación regulatoria del cambio, notificación y agotamiento de existencias","outcome":"Clasificación regulatoria del cambio, notificación y agotamiento de existencias","source":"Decreto 334 de 2022; buenas prácticas de control de cambios."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u5-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Imprimir el arte nuevo cuando se agote el inventario anterior, sin fecha límite.', FALSE, 'Se necesita un plan con fechas.', 0),
      (v_pregunta, 'Cambiar solo el inserto y dejar la caja y la IPP como estaban.', FALSE, 'Debe revisarse la coherencia de todos los materiales.', 1),
      (v_pregunta, 'Actualizar el texto maestro, los artes y la IPP, con un punto de corte e inventario controlado.', TRUE, 'Correcto. Con trazabilidad por lote.', 2),
      (v_pregunta, 'Esperar a la siguiente renovación del registro para hacer todos los cambios juntos.', FALSE, 'El cambio de seguridad no espera a la renovación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Tras liberar un lote se detecta que el blíster tiene una concentración distinta a la de la caja. ¿Qué análisis es correcto?';
    v_t4 := 'Un error de impresión en información crítica (concentración) es una desviación que puede exigir el retiro del producto. Se investiga la causa raíz (por ejemplo, la verificación de la prueba de impresión frente al texto maestro) y se definen acciones correctivas y preventivas.';
    v_j1 := $evetiq_json${"external_id":"etiq-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso práctico integral: revisión de caja, blíster, muestra médica e inserto","outcome":"Caso práctico integral: revisión de caja, blíster, muestra médica e inserto","source":"Buenas prácticas de manufactura; control de material de empaque."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u5-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es un error menor que se corrige en el siguiente pedido de material de empaque.', FALSE, 'Puede causar daño al paciente.', 0),
      (v_pregunta, 'Es un problema del proveedor de impresión, que debe asumirlo sin ninguna intervención del titular.', FALSE, 'El titular responde por el producto.', 1),
      (v_pregunta, 'Basta con informar al área de mercadeo para que lo comunique a los clientes.', FALSE, 'Requiere gestión de calidad y regulatoria.', 2),
      (v_pregunta, 'Es una desviación grave: evaluar el retiro del lote, la causa raíz y el control de impresión.', TRUE, 'Correcto. Y acciones preventivas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Tras aprobarse una nueva advertencia, el titular propone seguir usando sin plazo los insertos antiguos «hasta que se acaben». ¿Cuál es la mejor valoración?';
    v_t4 := 'Un cambio de seguridad aprobado se implementa con un plan y un punto de corte; cualquier uso de material anterior debe estar autorizado y acotado en el tiempo. Mantener indefinidamente insertos sin la advertencia expone a los pacientes a un riesgo conocido.';
    v_j1 := $evetiq_json${"external_id":"etiq-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: implementación de un cambio de seguridad en todos los materiales","outcome":"Caso práctico: implementación de un cambio de seguridad en todos los materiales","source":"Decreto 334 de 2022; buenas prácticas de control de cambios."}$evetiq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'etiq-u5-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es inaceptable: el cambio de seguridad se implementa con un plan y una fecha de corte.', TRUE, 'Correcto. Los pacientes deben recibir la advertencia.', 0),
      (v_pregunta, 'Es aceptable, porque desechar insertos es un desperdicio de recursos.', FALSE, 'La seguridad del paciente prevalece.', 1),
      (v_pregunta, 'Es aceptable si los insertos antiguos se entregan solo en farmacias de barrio y droguerías pequeñas.', FALSE, 'El canal no cambia la obligación.', 2),
      (v_pregunta, 'Es aceptable si el titular publica la advertencia solo en su página web.', FALSE, 'La web no reemplaza el inserto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad etiq-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo del etiquetado de medicamentos en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo del etiquetado de medicamentos en Colombia) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Revisión del arte de una caja para un nuevo registro';
  v_t2 := $evetiq_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Construye una lista de verificación con los datos obligatorios del artículo 72.</li><li>Aplica la lista al boceto y marca cada hallazgo.</li><li>Analiza la frase de indicaciones a la luz del parágrafo 1 del artículo 72.</li><li>Analiza la condición de venta y la vida útil propuestas.</li><li>Redacta el texto corregido de la caja.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar el artículo 72 del Decreto 677 a un boceto.</li><li>Identificar los errores y su fundamento.</li><li>Proponer el texto corregido.</li></ul>
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
  <tr><td>Lista de verificación</td><td>25 %</td><td>Incluye los datos obligatorios del artículo 72 con su literal.</td><td>Lista incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Hallazgos</td><td>40 %</td><td>Detecta el nombre genérico ausente, las indicaciones, la condición de venta, la leyenda faltante y la vida útil.</td><td>Detecta tres o cuatro hallazgos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Texto corregido</td><td>25 %</td><td>Texto completo y coherente con el registro.</td><td>Texto con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evetiq_html$;
  v_t3 := $evetiq_html$<h2>Caso de estudio</h2>
<p>Laboratorios Mirador (ficticia) va a solicitar el registro de tabletas de enalapril 20 mg, caja por 30, venta bajo fórmula médica, fabricadas en Colombia (datos simulados). El boceto de la caja incluye: la marca en grande sin el nombre genérico; la composición; «Registro sanitario en trámite»; espacio para lote y vencimiento; una vida útil de 60 meses; la frase «Indicado para la hipertensión y la insuficiencia cardíaca»; «Venta libre»; y no incluye la leyenda «Manténgase fuera del alcance de los niños».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evetiq_html$;
  v_t4 := 'Lista de verificación aplicada y texto corregido de la caja.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evetiq_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 (arts. 70 a 76); Decreto 843 de 2016 (art. 14, derogatorias); Decreto 334 de 2022 (art. 8); Resolución 886 de 2004; registro sanitario y actas de la Sala Especializada; OMS, Medication Without Harm y guía técnica sobre medicamentos LASA (2023); normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evetiq_html$;
  v_t7 := NULL;
  v_j1 := $evetiq_json$["Lista de verificación.","Hallazgos.","Indicaciones.","Condición de venta y vida útil.","Texto corregido."]$evetiq_json$::jsonb;
  v_j2 := $evetiq_json${"version":1,"total":100,"criteria":[{"id":"lista-de-verificacion","name":"Lista de verificación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Incluye los datos obligatorios del artículo 72 con su literal."},{"level":3,"label":"Logrado","description":"Lista incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"hallazgos","name":"Hallazgos","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Detecta el nombre genérico ausente, las indicaciones, la condición de venta, la leyenda faltante y la vida útil."},{"level":3,"label":"Logrado","description":"Detecta tres o cuatro hallazgos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"texto-corregido","name":"Texto corregido","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Texto completo y coherente con el registro."},{"level":3,"label":"Logrado","description":"Texto con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evetiq_json$::jsonb;
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


  -- ── Actividad etiq-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Leyendas obligatorias y regímenes especiales de etiquetado' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Leyendas obligatorias y regímenes especiales de etiquetado) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Adhesivo en español para un medicamento importado';
  v_t2 := $evetiq_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lista lo que exige el artículo 74 en español.</li><li>Compara el borrador del adhesivo con esa lista.</li><li>Analiza la frase «Para la presión alta» frente al parágrafo del artículo 74.</li><li>Analiza cómo tratar las indicaciones que aparecen en la caja original.</li><li>Redacta el adhesivo corregido y define su ubicación sin tapar información obligatoria.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar el artículo 74 del Decreto 677.</li><li>Detectar omisiones y contenidos no permitidos.</li><li>Redactar el adhesivo corregido.</li></ul>
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
  <tr><td>Requisitos</td><td>30 %</td><td>Lista completa del artículo 74 (importador, composición, almacenamiento, registro).</td><td>Lista parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Análisis</td><td>35 %</td><td>Detecta la falta de composición y almacenamiento y la indicación no permitida.</td><td>Detecta parte de los hallazgos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Adhesivo</td><td>25 %</td><td>Texto completo, en español, sin indicaciones y bien ubicado.</td><td>Texto con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evetiq_html$;
  v_t3 := $evetiq_html$<h2>Caso de estudio</h2>
<p>Importadora Pacífico (ficticia) trae de Europa un antihipertensivo en caja con texto en inglés (datos simulados). La caja original incluye las indicaciones, la composición, la temperatura de almacenamiento «Store below 30 °C» y el nombre del fabricante. El borrador del adhesivo en español dice: «Importado por: Importadora Pacífico. Para la presión alta. Registro sanitario INVIMA 20XX-M-000000».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evetiq_html$;
  v_t4 := 'Adhesivo corregido con análisis.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evetiq_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 (arts. 70 a 76); Decreto 843 de 2016 (art. 14, derogatorias); Decreto 334 de 2022 (art. 8); Resolución 886 de 2004; registro sanitario y actas de la Sala Especializada; OMS, Medication Without Harm y guía técnica sobre medicamentos LASA (2023); normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evetiq_html$;
  v_t7 := NULL;
  v_j1 := $evetiq_json$["Requisitos del artículo 74.","Omisiones.","Indicaciones.","Adhesivo corregido.","Ubicación."]$evetiq_json$::jsonb;
  v_j2 := $evetiq_json${"version":1,"total":100,"criteria":[{"id":"requisitos","name":"Requisitos","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Lista completa del artículo 74 (importador, composición, almacenamiento, registro)."},{"level":3,"label":"Logrado","description":"Lista parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"analisis","name":"Análisis","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Detecta la falta de composición y almacenamiento y la indicación no permitida."},{"level":3,"label":"Logrado","description":"Detecta parte de los hallazgos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"adhesivo","name":"Adhesivo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Texto completo, en español, sin indicaciones y bien ubicado."},{"level":3,"label":"Logrado","description":"Texto con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evetiq_json$::jsonb;
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


  -- ── Actividad etiq-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Diseño, legibilidad y prevención de errores de medicación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Diseño, legibilidad y prevención de errores de medicación) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Análisis LASA y rediseño de una línea de productos';
  v_t2 := $evetiq_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar, evaluar y crear.</p>
<ol><li>Identifica las similitudes de nombre y de envase entre los productos.</li><li>Analiza cómo pudieron ocurrir los errores en la dispensación.</li><li>Propón cambios de diseño (color, jerarquía, tall man, ubicación de la concentración).</li><li>Evalúa si alguno de los nombres debería revisarse.</li><li>Define cómo se clasifica y tramita el cambio de arte.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar los tipos de similitud LASA.</li><li>Proponer estrategias de diseño seguro.</li><li>Definir la clasificación regulatoria del cambio.</li></ul>
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
  <tr><td>Análisis LASA</td><td>30 %</td><td>Identifica similitud de nombre (Carvetol/Cardiol) y de envase y de concentraciones.</td><td>Identifica solo una similitud.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Propuesta de diseño</td><td>35 %</td><td>Propone diferenciación cromática, jerarquía de la concentración y tall man con justificación.</td><td>Propuesta general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Regulación</td><td>25 %</td><td>Clasifica el cambio de arte y prevé su trámite e implementación.</td><td>Clasificación imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evetiq_html$;
  v_t3 := $evetiq_html$<h2>Caso de estudio</h2>
<p>Laboratorios Horizonte (ficticia) tiene una línea de tabletas con tres productos (datos simulados): «Carvetol» (carvedilol 6,25 mg y 25 mg) y «Cardiol» (otro principio activo, 25 mg). Las tres cajas son blancas con franja azul, el logotipo ocupa la mitad de la cara principal y la concentración está en letra pequeña en una esquina. Farmacovigilancia registra cuatro errores de dispensación en seis meses entre estas presentaciones.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evetiq_html$;
  v_t4 := 'Informe de análisis LASA con propuesta de rediseño.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evetiq_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 (arts. 70 a 76); Decreto 843 de 2016 (art. 14, derogatorias); Decreto 334 de 2022 (art. 8); Resolución 886 de 2004; registro sanitario y actas de la Sala Especializada; OMS, Medication Without Harm y guía técnica sobre medicamentos LASA (2023); normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evetiq_html$;
  v_t7 := NULL;
  v_j1 := $evetiq_json$["Similitudes LASA.","Análisis de errores.","Propuesta de diseño.","Nombres.","Clasificación regulatoria."]$evetiq_json$::jsonb;
  v_j2 := $evetiq_json${"version":1,"total":100,"criteria":[{"id":"analisis-lasa","name":"Análisis LASA","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Identifica similitud de nombre (Carvetol/Cardiol) y de envase y de concentraciones."},{"level":3,"label":"Logrado","description":"Identifica solo una similitud."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"propuesta-de-diseno","name":"Propuesta de diseño","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Propone diferenciación cromática, jerarquía de la concentración y tall man con justificación."},{"level":3,"label":"Logrado","description":"Propuesta general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"regulacion","name":"Regulación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Clasifica el cambio de arte y prevé su trámite e implementación."},{"level":3,"label":"Logrado","description":"Clasificación imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evetiq_json$::jsonb;
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


  -- ── Actividad etiq-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Inserto, información para prescribir (IPP) e información de seguridad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Inserto, información para prescribir (IPP) e información de seguridad) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: textos maestros, muestra médica, importado e inserto del losartán';
  v_t2 := $evetiq_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos del registro (ficticios) que usarás.</li><li>Fase 1: redacta el texto maestro de la caja y del blíster con los datos del artículo 72.</li><li>Fase 2: redacta el texto de la muestra médica y del adhesivo del importado (art. 74).</li><li>Fase 3: define la estructura del inserto para el paciente y de la IPP.</li><li>Señala la norma que sustenta cada elemento.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco normativo).</strong> Texto maestro de la caja y el blíster según el artículo 72.</li>
  <li><strong>Fase 2 · Unidad 2 (regímenes especiales).</strong> Artes de la muestra médica y adhesivo del importado.</li>
  <li><strong>Fase 3 · Unidad 3 (inserto e IPP).</strong> Estructura del inserto y de la IPP.</li>
  <li><strong>Fase 4 · Unidad 4 (diseño seguro).</strong> Revisión LASA y legibilidad.</li>
  <li><strong>Fase 5 · Unidad 5 (control de cambios).</strong> Implementación de la nueva advertencia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Redactar los textos maestros del juego de artes.</li><li>Aplicar los regímenes de muestra médica e importados y estructurar el inserto.</li></ul>
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
  <tr><td>Textos maestros</td><td>35 %</td><td>Incluye todos los datos del artículo 72, sin indicaciones y con condición de venta correcta.</td><td>Textos con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Regímenes especiales</td><td>30 %</td><td>Muestra médica con su leyenda (art. 76) y adhesivo con el mínimo del artículo 74.</td><td>Regímenes con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Inserto e IPP</td><td>25 %</td><td>Estructura clara para cada destinatario y coherente con el registro.</td><td>Estructura incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evetiq_html$;
  v_t3 := $evetiq_html$<h2>Caso de estudio</h2>
<p>Laboratorios Sabana (ficticio) prepara el lanzamiento de losartán potásico 50 mg tabletas recubiertas, caja por 30, venta bajo fórmula médica, fabricado en Colombia, con presentación comercial, muestra médica y una presentación importada desde su planta de otro país (datos simulados). Un año después del lanzamiento, la Sala aprueba una nueva advertencia de seguridad. Te encargan el juego completo de artes y su ciclo de vida. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evetiq_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evetiq_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 (arts. 70 a 76); Decreto 843 de 2016 (art. 14, derogatorias); Decreto 334 de 2022 (art. 8); Resolución 886 de 2004; registro sanitario y actas de la Sala Especializada; OMS, Medication Without Harm y guía técnica sobre medicamentos LASA (2023); normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evetiq_html$;
  v_t7 := NULL;
  v_j1 := $evetiq_json$["Texto maestro de caja y blíster.","Muestra médica.","Adhesivo del importado.","Estructura del inserto y la IPP.","Fundamento normativo."]$evetiq_json$::jsonb;
  v_j2 := $evetiq_json${"version":1,"total":100,"criteria":[{"id":"textos-maestros","name":"Textos maestros","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Incluye todos los datos del artículo 72, sin indicaciones y con condición de venta correcta."},{"level":3,"label":"Logrado","description":"Textos con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"regimenes-especiales","name":"Regímenes especiales","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Muestra médica con su leyenda (art. 76) y adhesivo con el mínimo del artículo 74."},{"level":3,"label":"Logrado","description":"Regímenes con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"inserto-e-ipp","name":"Inserto e IPP","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Estructura clara para cada destinatario y coherente con el registro."},{"level":3,"label":"Logrado","description":"Estructura incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evetiq_json$::jsonb;
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


  -- ── Actividad etiq-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Aprobación de artes y control de cambios del material de empaque' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Aprobación de artes y control de cambios del material de empaque) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: juego de artes revisado y plan de implementación del cambio de seguridad';
  v_t2 := $evetiq_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: revisa el juego de artes con criterios LASA y de legibilidad, y propone los ajustes.</li><li>Fase 5: clasifica el cambio de seguridad según el Decreto 334 de 2022.</li><li>Fase 5: diseña la implementación (texto maestro, artes, IPP, punto de corte, inventario).</li><li>Fase 5: define los controles de la prueba de impresión.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el juego de artes y el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco normativo).</strong> Texto maestro de la caja y el blíster según el artículo 72.</li>
  <li><strong>Fase 2 · Unidad 2 (regímenes especiales).</strong> Artes de la muestra médica y adhesivo del importado.</li>
  <li><strong>Fase 3 · Unidad 3 (inserto e IPP).</strong> Estructura del inserto y de la IPP.</li>
  <li><strong>Fase 4 · Unidad 4 (diseño seguro).</strong> Revisión LASA y legibilidad.</li>
  <li><strong>Fase 5 · Unidad 5 (control de cambios).</strong> Implementación de la nueva advertencia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar criterios de diseño seguro al juego de artes.</li><li>Planear la implementación de un cambio de seguridad.</li></ul>
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
  <tr><td>Diseño seguro</td><td>25 %</td><td>Aplica jerarquía, diferenciación y expresión segura de la concentración.</td><td>Aplicación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cambio de seguridad</td><td>25 %</td><td>Clasificación correcta y trámite según el Decreto 334.</td><td>Clasificación imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Implementación</td><td>25 %</td><td>Plan con punto de corte, inventario, IPP y control de pruebas de impresión.</td><td>Plan sin punto de corte o sin controles.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evetiq_html$;
  v_t3 := $evetiq_html$<h2>Caso de estudio</h2>
<p>Laboratorios Sabana (ficticio) prepara el lanzamiento de losartán potásico 50 mg tabletas recubiertas, caja por 30, venta bajo fórmula médica, fabricado en Colombia, con presentación comercial, muestra médica y una presentación importada desde su planta de otro país (datos simulados). Un año después del lanzamiento, la Sala aprueba una nueva advertencia de seguridad. Te encargan el juego completo de artes y su ciclo de vida. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el juego de artes que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evetiq_html$;
  v_t4 := 'Juego de artes revisado con plan de implementación y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evetiq_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 (arts. 70 a 76); Decreto 843 de 2016 (art. 14, derogatorias); Decreto 334 de 2022 (art. 8); Resolución 886 de 2004; registro sanitario y actas de la Sala Especializada; OMS, Medication Without Harm y guía técnica sobre medicamentos LASA (2023); normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evetiq_html$;
  v_t7 := NULL;
  v_j1 := $evetiq_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Revisión de diseño seguro.","Clasificación del cambio.","Plan de implementación.","Controles y resumen."]$evetiq_json$::jsonb;
  v_j2 := $evetiq_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"diseno-seguro","name":"Diseño seguro","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Aplica jerarquía, diferenciación y expresión segura de la concentración."},{"level":3,"label":"Logrado","description":"Aplicación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"cambio-de-seguridad","name":"Cambio de seguridad","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Clasificación correcta y trámite según el Decreto 334."},{"level":3,"label":"Logrado","description":"Clasificación imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"implementacion","name":"Implementación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan con punto de corte, inventario, IPP y control de pruebas de impresión."},{"level":3,"label":"Logrado","description":"Plan sin punto de corte o sin controles."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evetiq_json$::jsonb;
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


  -- ── Foro etiq-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con etiquetas e insertos';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evetiq_html$<h2>Para empezar</h2>
<p>Piensa en una etiqueta, caja o inserto que hayas revisado, diseñado o usado y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evetiq_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evetiq_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evetiq_html$;
  v_t6 := $evetiq_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evetiq_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has visto errores de medicación causados por envases parecidos?', '¿Qué parte del etiquetado te parece más difícil de cumplir?']::text[];
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


  -- ── Foro etiq-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo del etiquetado de medicamentos en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo del etiquetado de medicamentos en Colombia) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · La etiqueta como parte del medicamento';
  v_t2 := 'Argumentar por qué el etiquetado es parte del medicamento aprobado y no un tema de mercadeo.';
  v_t3 := $evetiq_html$<h2>Caso del foro</h2>
<p>En un laboratorio ficticio, Mercadeo cambia los colores y la tipografía de una caja sin pasar por Asuntos Regulatorios «porque no cambia el contenido» (datos simulados). En el nuevo diseño, la concentración quedó en letra pequeña y la leyenda de condición de venta en la cara posterior.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evetiq_html$;
  v_t4 := '¿Qué riesgos regulatorios y de seguridad ves y cómo organizarías la aprobación de artes?';
  v_t5 := $evetiq_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evetiq_html$;
  v_t6 := $evetiq_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evetiq_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dice el Decreto 677 sobre la aprobación de las leyendas?', '¿Qué riesgo de seguridad tiene una concentración poco visible?', '¿Quién debería aprobar un cambio de arte?']::text[];
  v_j1 := $evetiq_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evetiq_json$::jsonb;
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


  -- ── Foro etiq-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Leyendas obligatorias y regímenes especiales de etiquetado' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Leyendas obligatorias y regímenes especiales de etiquetado) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Un mismo producto, varios artes';
  v_t2 := 'Argumentar cómo cambia el arte según la condición de venta, el destino y el origen.';
  v_t3 := $evetiq_html$<h2>Caso del foro</h2>
<p>Un titular ficticio vende el mismo antibiótico en presentación comercial, institucional para una entidad de seguridad social y como muestra médica, y además importa un lote del fabricante extranjero con etiqueta en inglés (datos simulados). El área de diseño quiere «un solo arte para todo».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evetiq_html$;
  v_t4 := '¿Es viable un solo arte? ¿Qué diferencias debe tener cada uno?';
  v_t5 := $evetiq_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada diferencia. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evetiq_html$;
  v_t6 := $evetiq_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada diferencia.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evetiq_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué leyenda exige el parágrafo 4 del artículo 72?', '¿Qué exige el artículo 74 para el lote importado?', '¿Qué identifica a la muestra médica?']::text[];
  v_j1 := $evetiq_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada diferencia."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evetiq_json$::jsonb;
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


  -- ── Foro etiq-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Inserto, información para prescribir (IPP) e información de seguridad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Inserto, información para prescribir (IPP) e información de seguridad) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Alerta de seguridad: ¿urgente o no?';
  v_t2 := 'Argumentar cómo decidir si un cambio de seguridad es urgente.';
  v_t3 := $evetiq_html$<h2>Caso del foro</h2>
<p>Un titular ficticio recibe una comunicación de una agencia de referencia sobre casos graves de un efecto adverso con su principio activo (datos simulados). El área médica quiere actualizar el inserto «cuando se pueda»; farmacovigilancia propone tratarlo como cambio urgente.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evetiq_html$;
  v_t4 := '¿Qué criterios usarías para decidir y qué pasos seguirías?';
  v_t5 := $evetiq_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada paso. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evetiq_html$;
  v_t6 := $evetiq_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada paso.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evetiq_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué diferencia hay entre un cambio de información del etiquetado y uno urgente de seguridad?', '¿Qué documentos soportan la solicitud?', '¿Cómo se comunica el cambio a los profesionales?']::text[];
  v_j1 := $evetiq_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada paso."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evetiq_json$::jsonb;
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


  -- ── Foro etiq-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Diseño, legibilidad y prevención de errores de medicación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Diseño, legibilidad y prevención de errores de medicación) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Marca o seguridad';
  v_t2 := 'Argumentar cómo equilibrar la identidad de marca con el diseño seguro del empaque.';
  v_t3 := $evetiq_html$<h2>Caso del foro</h2>
<p>Mercadeo de un laboratorio ficticio quiere que todas las cajas de su línea cardiovascular sean del mismo azul, con el logotipo grande y la concentración pequeña «para que la línea se reconozca» (datos simulados). Un hospital reportó dos errores de dispensación entre presentaciones de la línea.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evetiq_html$;
  v_t4 := '¿Cómo defenderías un diseño seguro sin perder la identidad de marca?';
  v_t5 := $evetiq_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o la norma que sustenta cada propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evetiq_html$;
  v_t6 := $evetiq_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta cada propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evetiq_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué estrategias de diferenciación son compatibles con la marca?', '¿Qué peso visual debe tener la concentración?', '¿Cómo se clasifica regulatoriamente el rediseño?']::text[];
  v_j1 := $evetiq_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta cada propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evetiq_json$::jsonb;
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


  -- ── Foro etiq-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Aprobación de artes y control de cambios del material de empaque' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Aprobación de artes y control de cambios del material de empaque) en Etiquetado e Insertos de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Errores de impresión que llegan al paciente';
  v_t2 := 'Argumentar qué controles evitan que un error de arte llegue al mercado.';
  v_t3 := $evetiq_html$<h2>Caso del foro</h2>
<p>En un laboratorio ficticio, un inserto se imprimió con la posología de otro producto de la línea (datos simulados). Las revisiones existían, pero cada área revisaba «su parte» y nadie comparó la prueba de impresión con el texto maestro.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evetiq_html$;
  v_t4 := '¿Qué controles implementarías y quién sería responsable de cada uno?';
  v_t5 := $evetiq_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la buena práctica que sustenta cada control. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evetiq_html$;
  v_t6 := $evetiq_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la buena práctica que sustenta cada control.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evetiq_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué etapas debe tener el flujo de aprobación de artes?', '¿Cómo se compara la prueba de impresión con el texto maestro?', '¿Qué indicador usarías para medir el proceso?']::text[];
  v_j1 := $evetiq_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la buena práctica que sustenta cada control."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evetiq_json$::jsonb;
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


  RAISE NOTICE 'Etiquetado e Insertos de Medicamentos: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evetiq$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Estudios de Estabilidad para el Registro de Medicamentos
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evestab$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Estudios de Estabilidad para el Registro de Medicamentos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos y marco normativo de la estabilidad', 'Unidad 2. Zonas climáticas y tipos de estudios de estabilidad', 'Unidad 3. Diseño del protocolo y métodos indicadores de estabilidad', 'Unidad 4. Evaluación estadística y asignación de vida útil', 'Unidad 5. Ciclo de vida, dossier y requerimientos INVIMA']::text[])) < 5 THEN
    RAISE NOTICE 'Estudios de Estabilidad para el Registro de Medicamentos: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evestab_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evestab_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz estab-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo de la estabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo de la estabilidad) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos y marco normativo de la estabilidad';
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


    v_t3 := 'Según el artículo 2 de la Resolución 3157 de 2018, ¿a quiénes aplica la guía de estabilidad?';
    v_t4 := 'El artículo 2 de la Resolución 3157 de 2018 incluye a quienes solicitan un registro nuevo, a los titulares que lo renuevan, a quienes lo modifican por cambios que afectan la estabilidad y a titulares, fabricantes e importadores. Los biológicos se rigen por la Resolución 3690 de 2016.';
    v_j1 := $evestab_json${"external_id":"estab-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Resolución 3157 de 2018 y sus modificaciones (Resoluciones 1839 de 2020 y 0525 de 2025)","outcome":"Resolución 3157 de 2018 y sus modificaciones (Resoluciones 1839 de 2020 y 0525 de 2025)","source":"Resolución 3157 de 2018, art. 2."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u1-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Solo a quienes solicitan un registro sanitario nuevo de un medicamento de síntesis química en Colombia.', FALSE, 'También aplica a renovaciones y modificaciones.', 0),
      (v_pregunta, 'Solo a los fabricantes extranjeros que exportan medicamentos a Colombia.', FALSE, 'Aplica también a fabricantes nacionales.', 1),
      (v_pregunta, 'A registros nuevos, renovaciones y modificaciones que afecten la estabilidad, y a sus responsables.', TRUE, 'Correcto. Incluye a titulares, fabricantes e importadores.', 2),
      (v_pregunta, 'Solo a los medicamentos biológicos y a las vacunas que requieren cadena de frío.', FALSE, 'Los biológicos tienen su propia guía.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Se va a registrar un anticuerpo monoclonal. ¿Qué guía colombiana de estabilidad corresponde?';
    v_t4 := 'Los medicamentos biológicos se rigen por la Resolución 3690 de 2016, que contempla estabilidad del principio activo y del producto, estabilidad natural y cadena de frío; la guía ICH Q5C es el referente técnico. La Resolución 3157 de 2018 es para medicamentos de síntesis química.';
    v_j1 := $evestab_json${"external_id":"estab-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Resolución 3690 de 2016: guía de estabilidad de medicamentos biológicos","outcome":"Resolución 3690 de 2016: guía de estabilidad de medicamentos biológicos","source":"Resolución 3690 de 2016; ICH Q5C."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u1-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'La Resolución 3690 de 2016, guía de estabilidad de medicamentos biológicos, con ICH Q5C como apoyo.', TRUE, 'Correcto. Exige, entre otros, cadena de frío.', 0),
      (v_pregunta, 'La Resolución 3157 de 2018, porque es la única guía de estabilidad vigente para cualquier medicamento.', FALSE, 'Esa guía es de síntesis química.', 1),
      (v_pregunta, 'La Resolución 2514 de 1995, porque aplica a todos los productos de origen biológico.', FALSE, 'Aplica solo a gases medicinales y fitoterapéuticos.', 2),
      (v_pregunta, 'Ninguna, porque los biológicos no requieren estudios de estabilidad para el registro.', FALSE, 'Sí los requieren, con su propia guía.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Desde cuándo surte efectos la Resolución 3157 de 2018 para el producto terminado y el principio activo?';
    v_t4 := 'El artículo 7 de la Resolución 3157 de 2018, modificado por la Resolución 1839 de 2020, dispone que rige desde su publicación y surte efectos desde el 1 de abril de 2024 para el producto terminado y el principio activo.';
    v_j1 := $evestab_json${"external_id":"estab-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Resolución 3157 de 2018 y sus modificaciones (Resoluciones 1839 de 2020 y 0525 de 2025)","outcome":"Resolución 3157 de 2018 y sus modificaciones (Resoluciones 1839 de 2020 y 0525 de 2025)","source":"Resolución 3157 de 2018, art. 7; Resolución 1839 de 2020."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u1-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Desde su publicación en 2018, sin periodo de transición para ningún producto.', FALSE, 'Su efecto se aplazó.', 0),
      (v_pregunta, 'Desde el 1 de enero de 2030, cuando termine la transición de todos los productos.', FALSE, 'No es la fecha prevista.', 1),
      (v_pregunta, 'Solo desde que el Invima publique un nuevo instructivo para cada forma farmacéutica.', FALSE, 'La fecha la fija la norma.', 2),
      (v_pregunta, 'Desde el 1 de abril de 2024, según el artículo 7 modificado por la Resolución 1839 de 2020.', TRUE, 'Correcto. Rige desde su publicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un consultor presenta la estabilidad de unas tabletas de síntesis química con base en la Resolución 2514 de 1995. ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 6 de la Resolución 3157 de 2018 dispone que la Resolución 2514 de 1995 solo aplica a gases medicinales y fitoterapéuticos. Para medicamentos de síntesis química aplica la Resolución 3157; presentar el estudio con la guía equivocada genera requerimientos.';
    v_j1 := $evestab_json${"external_id":"estab-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: identificar la norma de estabilidad aplicable a un trámite INVIMA","outcome":"Caso práctico: identificar la norma de estabilidad aplicable a un trámite INVIMA","source":"Resolución 3157 de 2018, art. 6."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u1-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcto, porque la Resolución 2514 de 1995 sigue siendo la guía general de estabilidad del país.', FALSE, 'Ya no es la guía para síntesis química.', 0),
      (v_pregunta, 'Es incorrecto: la 2514 solo aplica a gases medicinales y fitoterapéuticos (art. 6 de la 3157).', TRUE, 'Correcto. Para tabletas aplica la 3157.', 1),
      (v_pregunta, 'Es correcto si el estudio se hizo antes de 2018 en el país de origen.', FALSE, 'La fecha del estudio no cambia la norma aplicable.', 2),
      (v_pregunta, 'Es indiferente, porque el Invima acepta cualquier guía de estabilidad del mundo.', FALSE, 'Hay una guía nacional aplicable.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz estab-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Zonas climáticas y tipos de estudios de estabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Zonas climáticas y tipos de estudios de estabilidad) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Zonas climáticas y tipos de estudios de estabilidad';
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


    v_t3 := '¿Qué condiciones de largo plazo corresponden a la zona climática IVb, en la que se ubica Colombia?';
    v_t4 := 'La Resolución 3157 de 2018 ubica a Colombia en la zona climática IVb (caliente y muy húmeda) y fija para el largo plazo 30 °C ± 2 °C y 75 % HR ± 5 % HR, salvo productos con almacenamiento especial.';
    v_j1 := $evestab_json${"external_id":"estab-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Zonas climáticas de la OMS/ICH y la zona IVb de Colombia","outcome":"Zonas climáticas de la OMS/ICH y la zona IVb de Colombia","source":"Resolución 3157 de 2018; ICH Q1A(R2); OMS TRS 1010, anexo 10."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u2-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, '25 °C ± 2 °C y 60 % HR ± 5 % HR, las de la zona climática II.', FALSE, 'Esa es la condición de la zona II.', 0),
      (v_pregunta, '30 °C ± 2 °C y 75 % HR ± 5 % HR.', TRUE, 'Correcto. Zona caliente y muy húmeda.', 1),
      (v_pregunta, '40 °C ± 2 °C y 75 % HR ± 5 % HR, las mismas del estudio acelerado.', FALSE, 'Son condiciones del acelerado.', 2),
      (v_pregunta, '5 °C ± 3 °C, porque todos los medicamentos se refrigeran en zonas cálidas.', FALSE, 'La refrigeración aplica solo a productos que la requieren.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué exige la Resolución 3157 de 2018 para el estudio acelerado del producto terminado?';
    v_t4 := 'La Resolución 3157 de 2018 (num. 2.6) pide para el estudio acelerado seis meses con al menos tres puntos de análisis (por ejemplo, 0, 3 y 6 meses), a 40 °C según las condiciones de la guía. Los acelerados son provisionales; los de largo plazo son definitivos.';
    v_j1 := $evestab_json${"external_id":"estab-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Estudios de largo plazo, acelerados e intermedios","outcome":"Estudios de largo plazo, acelerados e intermedios","source":"Resolución 3157 de 2018, nums. 1.4 y 2.6."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u2-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Un único punto de análisis al final de los seis meses, para reducir costos.', FALSE, 'Se exigen al menos tres puntos.', 0),
      (v_pregunta, 'Doce meses de estudio con un punto de análisis cada mes.', FALSE, 'El acelerado es de seis meses.', 1),
      (v_pregunta, 'No se exige ningún estudio acelerado si el producto es de venta libre.', FALSE, 'La condición de venta no exime el estudio.', 2),
      (v_pregunta, 'Seis meses de estudio con al menos tres puntos de análisis, por ejemplo 0, 3 y 6 meses.', TRUE, 'Correcto. A 40 °C según la guía.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En el estudio acelerado de un producto se observa un cambio significativo. ¿Qué análisis es correcto según la guía?';
    v_t4 := 'Según la Resolución 3157 de 2018 (nums. 2.7.1 y 3.8.1), el cambio significativo en el acelerado activa el estudio intermedio (al menos 12 meses con al menos cuatro puntos) y la estabilidad se determina con los datos de largo plazo, sin extrapolar.';
    v_j1 := $evestab_json${"external_id":"estab-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Estudios de largo plazo, acelerados e intermedios","outcome":"Estudios de largo plazo, acelerados e intermedios","source":"Resolución 3157 de 2018, num. 3.8.1."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u2-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Se hace un estudio intermedio y la vida útil se fija con los datos de largo plazo, sin extrapolar.', TRUE, 'Correcto. Así lo prevé el num. 3.8.1.', 0),
      (v_pregunta, 'El producto queda rechazado sin posibilidad de obtener un registro.', FALSE, 'Se ajusta el programa, no se rechaza de inmediato.', 1),
      (v_pregunta, 'Se ignora el resultado, porque el estudio acelerado es solo provisional y no tiene ninguna consecuencia.', FALSE, 'El cambio significativo tiene consecuencias.', 2),
      (v_pregunta, 'Se puede extrapolar la vida útil al doble del tiempo estudiado.', FALSE, 'Con cambio significativo no se extrapola.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un estudio de fotoestabilidad confirmatorio expuso las muestras a 600.000 lux·h. ¿Cuál es la mejor valoración según ICH Q1B?';
    v_t4 := 'ICH Q1B pide, para el estudio confirmatorio, una exposición total no menor de 1,2 millones de lux·h y una energía UV cercana integrada no menor de 200 W·h/m², con controles protegidos de la luz. La Resolución 3157 (num. 3.3) exige la prueba en al menos un lote primario, si procede.';
    v_j1 := $evestab_json${"external_id":"estab-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Fotoestabilidad (ICH Q1B)","outcome":"Fotoestabilidad (ICH Q1B)","source":"ICH Q1B; Resolución 3157 de 2018, num. 3.3."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u2-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es suficiente, porque cualquier exposición a la luz demuestra la fotoestabilidad.', FALSE, 'La guía fija una exposición mínima.', 0),
      (v_pregunta, 'Es suficiente si el producto se vende en una caja opaca.', FALSE, 'El envase no cambia la exposición mínima del estudio.', 1),
      (v_pregunta, 'Es insuficiente: la guía pide al menos 1,2 millones de lux·h y 200 W·h/m² de UV cercano.', TRUE, 'Correcto. En al menos un lote primario.', 2),
      (v_pregunta, 'Es excesiva, porque la guía pide como máximo 100.000 lux·h.', FALSE, 'La exposición mínima es mayor.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz estab-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Diseño del protocolo y métodos indicadores de estabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Diseño del protocolo y métodos indicadores de estabilidad) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Diseño del protocolo y métodos indicadores de estabilidad';
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


    v_t3 := '¿Cuántos lotes del producto terminado pide como mínimo la Resolución 3157 de 2018 para el estudio de estabilidad?';
    v_t4 := 'La Resolución 3157 de 2018 (num. 3.4) pide al menos tres lotes primarios del producto terminado con la misma formulación y el envase propuesto para comercializar; si se justifica, dos pueden ser de escala piloto industrial. Para formas con principio activo estable, se admiten dos lotes.';
    v_j1 := $evestab_json${"external_id":"estab-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Lotes, envases, frecuencias, parámetros y especificaciones","outcome":"Lotes, envases, frecuencias, parámetros y especificaciones","source":"Resolución 3157 de 2018, num. 3.4."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u3-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Un solo lote, siempre que sea de escala industrial.', FALSE, 'Se piden al menos tres lotes.', 0),
      (v_pregunta, 'Diez lotes, uno por cada mes del primer año de comercialización.', FALSE, 'No es el número exigido.', 1),
      (v_pregunta, 'Tantos lotes como presentaciones comerciales tenga el producto, sin mínimo.', FALSE, 'Hay un mínimo definido.', 2),
      (v_pregunta, 'Al menos tres lotes primarios, con la formulación y el envase propuestos.', TRUE, 'Correcto. Con excepciones para IFA estables.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un producto tiene tres concentraciones con la misma formulación proporcional y el mismo envase. ¿Qué diseño reducido podría justificarse?';
    v_t4 := 'ICH Q1D describe el bracketing (estudiar los extremos de concentración o tamaño de envase) y el matrixing (estudiar un subconjunto de muestras en cada punto). Requieren justificar que los extremos representan a los intermedios; la guía de Colombia admite estos diseños si se justifican.';
    v_j1 := $evestab_json${"external_id":"estab-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Diseños reducidos: bracketing y matrixing (ICH Q1D)","outcome":"Diseños reducidos: bracketing y matrixing (ICH Q1D)","source":"ICH Q1D; Resolución 3157 de 2018, num. 3.14."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u3-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Bracketing: estudiar las concentraciones extremas, asumiendo que la intermedia queda representada.', TRUE, 'Correcto. Con los supuestos de ICH Q1D.', 0),
      (v_pregunta, 'Ningún estudio para la concentración intermedia, sin ninguna justificación.', FALSE, 'Cualquier reducción se justifica.', 1),
      (v_pregunta, 'Estudiar solo la concentración más vendida y extender sus resultados a las demás.', FALSE, 'No es un diseño reconocido.', 2),
      (v_pregunta, 'Estudiar la concentración intermedia y suponer que los extremos se comportan exactamente igual que ella.', FALSE, 'El bracketing estudia los extremos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Para qué sirven los estudios de degradación forzada en el registro?';
    v_t4 := 'La degradación forzada (calor, humedad, oxidación, luz, hidrólisis a distintos pH) identifica las rutas y productos de degradación y demuestra que el método analítico es indicador de estabilidad: específico, con pureza de pico y balance de masas razonable.';
    v_j1 := $evestab_json${"external_id":"estab-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Métodos analíticos indicadores de estabilidad","outcome":"Métodos analíticos indicadores de estabilidad","source":"ICH Q1A(R2); ICH Q1B; Resolución 3157 de 2018, num. 2.2."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u3-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Para fijar directamente la vida útil del producto sin estudios de largo plazo.', FALSE, 'No reemplazan los estudios de largo plazo.', 0),
      (v_pregunta, 'Para demostrar que el producto es estable en cualquier condición extrema.', FALSE, 'Buscan degradar el producto, no demostrar estabilidad.', 1),
      (v_pregunta, 'Para identificar productos de degradación y demostrar que el método los separa y cuantifica.', TRUE, 'Correcto. Sustentan el método indicador de estabilidad.', 2),
      (v_pregunta, 'Para elegir el color del envase que se usará en la comercialización.', FALSE, 'No es el propósito de estos estudios.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En la validación, un producto de degradación coeluye con el pico del principio activo. ¿Cuál es la mejor valoración del método?';
    v_t4 := 'Un método indicador de estabilidad debe separar y cuantificar el principio activo frente a sus productos de degradación. Si un degradado coeluye, el método sobrestima el contenido y no detecta la degradación; debe optimizarse y validarse de nuevo.';
    v_j1 := $evestab_json${"external_id":"estab-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Métodos analíticos indicadores de estabilidad","outcome":"Métodos analíticos indicadores de estabilidad","source":"ICH Q2(R2); ICH Q1A(R2)."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u3-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es aceptable, porque la valoración del principio activo sigue dando valores cercanos al 100 %.', FALSE, 'La coelución oculta la degradación.', 0),
      (v_pregunta, 'No es indicador de estabilidad: debe optimizarse para separar el degradado.', TRUE, 'Correcto. Sin especificidad, no sirve para estabilidad.', 1),
      (v_pregunta, 'Es aceptable si el estudio de estabilidad dura menos de seis meses.', FALSE, 'La duración no corrige la falta de especificidad.', 2),
      (v_pregunta, 'Es aceptable si el laboratorio tiene el método acreditado para otros productos.', FALSE, 'La acreditación no reemplaza la especificidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz estab-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Evaluación estadística y asignación de vida útil' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Evaluación estadística y asignación de vida útil) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Evaluación estadística y asignación de vida útil';
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


    v_t3 := 'Según la Resolución 3157 de 2018, ¿qué se considera cambio significativo en el producto terminado?';
    v_t4 := 'La Resolución 3157 de 2018 (num. 3.8.1) define como cambio significativo, entre otros: una variación del 5 % o más del contenido inicial, productos de degradación que exceden su límite, fallas en apariencia, atributos físicos o funcionalidad, y fallas en pH o disolución.';
    v_j1 := $evestab_json${"external_id":"estab-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Cambio significativo y árbol de decisión de ICH Q1E","outcome":"Cambio significativo y árbol de decisión de ICH Q1E","source":"Resolución 3157 de 2018, num. 3.8.1."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u4-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Cualquier variación del contenido, por pequeña que sea, frente al valor inicial del primer análisis.', FALSE, 'Se fija un umbral del 5 %.', 0),
      (v_pregunta, 'Un cambio de 5 % o más del contenido, degradados fuera de límite o fallas de pH o disolución.', TRUE, 'Correcto. También cuentan fallas de apariencia o funcionalidad.', 1),
      (v_pregunta, 'Solo el cambio de color del producto observado por el paciente.', FALSE, 'Es más amplio que la apariencia.', 2),
      (v_pregunta, 'Solo la falla en la prueba de esterilidad de los inyectables.', FALSE, 'Incluye otros atributos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Según ICH Q1E, ¿cuándo pueden combinarse los datos de varios lotes para estimar una sola vida útil?';
    v_t4 := 'ICH Q1E recomienda probar la igualdad de pendientes e interceptos con un nivel de significancia de 0,25; si no se rechaza (p mayor de 0,25), los datos pueden combinarse. Si no son combinables, la vida útil se basa en el lote que la agota primero.';
    v_j1 := $evestab_json${"external_id":"estab-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Regresión, combinación de lotes y extrapolación","outcome":"Regresión, combinación de lotes y extrapolación","source":"ICH Q1E."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u4-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Siempre, porque combinar lotes aumenta la precisión de la estimación y simplifica el análisis.', FALSE, 'Se debe probar la combinabilidad.', 0),
      (v_pregunta, 'Cuando el titular lo decide, sin necesidad de pruebas estadísticas.', FALSE, 'La combinación se sustenta estadísticamente.', 1),
      (v_pregunta, 'Cuando pendientes e interceptos no difieren significativamente, con significancia de 0,25.', TRUE, 'Correcto. Si no, se usa el lote peor.', 2),
      (v_pregunta, 'Cuando los lotes se fabricaron el mismo día con el mismo operario.', FALSE, 'El criterio es estadístico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Hay 12 meses de largo plazo sin cambio significativo en el acelerado y los datos permiten análisis estadístico. ¿Hasta qué vida útil puede extrapolarse según ICH Q1E?';
    v_t4 := 'ICH Q1E permite, cuando no hay cambio significativo en el acelerado y los datos son aptos para análisis estadístico, extrapolar hasta el doble del periodo cubierto por los datos de largo plazo, sin superarlo en más de 12 meses. La extrapolación se confirma con datos reales.';
    v_j1 := $evestab_json${"external_id":"estab-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Vida útil provisional y definitiva; condiciones de almacenamiento en la etiqueta","outcome":"Vida útil provisional y definitiva; condiciones de almacenamiento en la etiqueta","source":"ICH Q1E; Resolución 3157 de 2018, num. 3.10."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u4-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Hasta 60 meses, porque es el máximo de fecha de vencimiento permitido.', FALSE, 'La extrapolación tiene un límite propio.', 0),
      (v_pregunta, 'Hasta 36 meses, porque los datos son favorables.', FALSE, 'Excede el límite de extrapolación.', 1),
      (v_pregunta, 'No puede extrapolarse en ningún caso, porque solo valen los datos reales obtenidos en las cámaras.', FALSE, 'ICH Q1E permite extrapolación limitada.', 2),
      (v_pregunta, 'Hasta 24 meses: el doble del periodo cubierto, sin superar en 12 meses los datos de largo plazo.', TRUE, 'Correcto. Con compromiso de confirmarla.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En la regresión del contenido, el límite de confianza del 95 % cruza el criterio de aceptación a los 20 meses. El titular propone 24 meses. ¿Cuál es la mejor valoración?';
    v_t4 := 'Según ICH Q1E, la vida útil es el tiempo en que el límite de confianza de una cola del 95 % de la regresión del atributo cruza el criterio de aceptación. Si cruza a los 20 meses, la vida útil propuesta no puede superarlos.';
    v_j1 := $evestab_json${"external_id":"estab-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Vida útil provisional y definitiva; condiciones de almacenamiento en la etiqueta","outcome":"Vida útil provisional y definitiva; condiciones de almacenamiento en la etiqueta","source":"ICH Q1E."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u4-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'La vida útil debe ser como máximo de 20 meses, donde el límite de confianza cruza el criterio.', TRUE, 'Correcto. La vida útil no puede superar ese punto.', 0),
      (v_pregunta, 'Es aceptable proponer 24 meses, porque la línea de regresión media aún cumple.', FALSE, 'Se usa el límite de confianza, no la media.', 1),
      (v_pregunta, 'Es aceptable si se redondea al siguiente año completo de comercialización.', FALSE, 'No se redondea hacia arriba.', 2),
      (v_pregunta, 'Es aceptable si el producto se almacena en bodegas con aire acondicionado.', FALSE, 'Las condiciones de bodega no cambian el cálculo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz estab-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Ciclo de vida, dossier y requerimientos INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Ciclo de vida, dossier y requerimientos INVIMA) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Ciclo de vida, dossier y requerimientos INVIMA';
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


    v_t3 := '¿Qué exige la Resolución 3157 de 2018 para el programa de aseguramiento continuo (on-going) del producto terminado?';
    v_t4 := 'La Resolución 3157 de 2018 (num. 3.14) exige incluir al menos un lote de producción por año por cada concentración y tipo de envase primario (si se produce), y admite diseños reducidos justificados. Para el principio activo, al menos un lote por año (num. 2.11).';
    v_j1 := $evestab_json${"external_id":"estab-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Programa on-going y cambios que requieren nuevos datos de estabilidad","outcome":"Programa on-going y cambios que requieren nuevos datos de estabilidad","source":"Resolución 3157 de 2018, nums. 2.11 y 3.14."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u5-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Un lote de producción cada cinco años, solo cuando se renueve el registro.', FALSE, 'La frecuencia es mayor.', 0),
      (v_pregunta, 'Todos los lotes producidos, con análisis mensual durante toda su vida útil.', FALSE, 'No se exigen todos los lotes.', 1),
      (v_pregunta, 'Al menos un lote de producción por año, por concentración y tipo de envase primario.', TRUE, 'Correcto. Si se produce en ese año.', 2),
      (v_pregunta, 'Ningún estudio después del registro, si el producto ya fue aprobado.', FALSE, 'El aseguramiento continúa después del registro.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En el programa on-going, un lote presenta un resultado fuera de especificación a los 18 meses. ¿Qué exige la guía?';
    v_t4 := 'La Resolución 3157 de 2018 dispone que los resultados fuera de especificación en los estudios de aseguramiento se reporten de inmediato y por escrito a la autoridad sanitaria. Se investigan con las buenas prácticas y se evalúa el impacto en los lotes distribuidos.';
    v_j1 := $evestab_json${"external_id":"estab-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Programa on-going y cambios que requieren nuevos datos de estabilidad","outcome":"Programa on-going y cambios que requieren nuevos datos de estabilidad","source":"Resolución 3157 de 2018, num. 3.14."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u5-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Repetir el análisis hasta obtener un resultado que cumpla y archivar el primero.', FALSE, 'Eso es una mala práctica grave.', 0),
      (v_pregunta, 'Reportarlo de inmediato y por escrito a la autoridad sanitaria e investigarlo.', TRUE, 'Correcto. Y evaluar el impacto en los lotes del mercado.', 1),
      (v_pregunta, 'Esperar a la renovación del registro para informarlo al Invima.', FALSE, 'Debe reportarse de inmediato.', 2),
      (v_pregunta, 'No hacer nada si el lote ya fue vendido completamente.', FALSE, 'El impacto en el mercado debe evaluarse.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular cambia el blíster de PVC por PVC/PVDC. ¿Qué análisis es correcto sobre la estabilidad?';
    v_t4 := 'La Resolución 3157 de 2018 (num. 3.13) exige estudios adicionales tras cambios en la formulación, el fabricante, el proceso o el envase primario. El cambio de blíster se tramita como modificación con los datos que lo respalden.';
    v_j1 := $evestab_json${"external_id":"estab-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Programa on-going y cambios que requieren nuevos datos de estabilidad","outcome":"Programa on-going y cambios que requieren nuevos datos de estabilidad","source":"Resolución 3157 de 2018, num. 3.13."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u5-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No se requiere nada, porque el material del blíster no está en contacto directo con el producto terminado.', FALSE, 'El blíster es envase primario.', 0),
      (v_pregunta, 'Solo se actualiza el arte de la caja con el nuevo material.', FALSE, 'También hay que evaluar la estabilidad.', 1),
      (v_pregunta, 'Se requiere un nuevo registro sanitario con todos los estudios desde cero.', FALSE, 'Se tramita como modificación.', 2),
      (v_pregunta, 'El cambio de envase primario exige estudios de estabilidad adicionales que respalden la vida útil.', TRUE, 'Correcto. Se tramita como modificación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Tras obtener el registro con 12 meses de datos y un compromiso de estabilidad, la empresa suspende los estudios «porque ya está aprobado». ¿Cuál es la mejor valoración?';
    v_t4 := 'El compromiso de estabilidad posaprobación obliga a continuar los estudios en los lotes primarios hasta cubrir la vida útil y a reportar los resultados. Suspenderlo es un incumplimiento que deja sin respaldo la vida útil asignada.';
    v_j1 := $evestab_json${"external_id":"estab-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Requerimientos INVIMA frecuentes en estabilidad","outcome":"Requerimientos INVIMA frecuentes en estabilidad","source":"Resolución 3157 de 2018; ICH Q1A(R2)."}$evestab_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'estab-u5-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es un incumplimiento: el compromiso obliga a continuar y reportar hasta cubrir la vida útil.', TRUE, 'Correcto. Además pone en riesgo la vida útil asignada.', 0),
      (v_pregunta, 'Es aceptable, porque el registro sanitario ya fue otorgado y su vida útil no puede revisarse después.', FALSE, 'El compromiso hace parte del registro.', 1),
      (v_pregunta, 'Es aceptable si los lotes se venden antes de 12 meses.', FALSE, 'La vida útil asignada cubre más tiempo.', 2),
      (v_pregunta, 'Es aceptable si el producto no ha tenido quejas de los pacientes.', FALSE, 'La falta de quejas no reemplaza los datos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad estab-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo de la estabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo de la estabilidad) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Norma de estabilidad aplicable a distintos trámites';
  v_t2 := $evestab_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Para cada trámite, identifica la norma colombiana aplicable y el artículo que lo sustenta.</li><li>Define la condición de largo plazo exigida para Colombia.</li><li>Indica qué guías ICH u OMS pueden usarse como soporte.</li><li>Analiza qué exige el cambio de envase primario en términos de estabilidad.</li><li>Resume los riesgos de requerimiento de cada trámite.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar la norma de estabilidad aplicable a cada trámite.</li><li>Definir la condición climática de largo plazo.</li><li>Señalar las guías internacionales de soporte.</li></ul>
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
  <tr><td>Norma aplicable</td><td>40 %</td><td>Identifica la 3157 para 1 a 3, la 2514 para 4 y la 3690 para 5, con su fundamento.</td><td>Confunde una de las normas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Condiciones y guías</td><td>30 %</td><td>Zona IVb (30 °C ± 2 °C / 75 % HR ± 5 % HR) y guías ICH u OMS pertinentes.</td><td>Condiciones o guías imprecisas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Análisis</td><td>20 %</td><td>Explica que el cambio de envase primario exige estudios adicionales (num. 3.13).</td><td>Análisis general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evestab_html$;
  v_t3 := $evestab_html$<h2>Caso de estudio</h2>
<p>El área regulatoria de Farmacéutica Andina (ficticia) prepara cinco trámites (datos simulados): (1) registro nuevo de cápsulas de omeprazol fabricadas en Colombia; (2) renovación de un jarabe de síntesis química; (3) modificación por cambio de envase primario de un colirio; (4) registro de un fitoterapéutico en cápsulas; (5) registro de una insulina importada.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evestab_html$;
  v_t4 := 'Tabla de normas aplicables con análisis.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evestab_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 3157 de 2018 (guía de estabilidad de medicamentos de síntesis química) y Resolución 1839 de 2020; Resolución 3690 de 2016 (biológicos); guías ICH Q1A(R2), Q1B, Q1D, Q1E y Q5C; OMS TRS 1010, anexo 10; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, numeral».</p>$evestab_html$;
  v_t7 := NULL;
  v_j1 := $evestab_json$["Norma por trámite.","Condición climática.","Guías de soporte.","Cambio de envase.","Riesgos."]$evestab_json$::jsonb;
  v_j2 := $evestab_json${"version":1,"total":100,"criteria":[{"id":"norma-aplicable","name":"Norma aplicable","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Identifica la 3157 para 1 a 3, la 2514 para 4 y la 3690 para 5, con su fundamento."},{"level":3,"label":"Logrado","description":"Confunde una de las normas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"condiciones-y-guias","name":"Condiciones y guías","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Zona IVb (30 °C ± 2 °C / 75 % HR ± 5 % HR) y guías ICH u OMS pertinentes."},{"level":3,"label":"Logrado","description":"Condiciones o guías imprecisas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"analisis","name":"Análisis","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Explica que el cambio de envase primario exige estudios adicionales (num. 3.13)."},{"level":3,"label":"Logrado","description":"Análisis general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evestab_json$::jsonb;
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


  -- ── Actividad estab-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Zonas climáticas y tipos de estudios de estabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Zonas climáticas y tipos de estudios de estabilidad) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Estrategia de estabilidad para un importado con datos de zona II';
  v_t2 := $evestab_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Compara los datos disponibles con lo que exige la Resolución 3157 de 2018.</li><li>Analiza qué aportan los datos acelerados sin cambio significativo.</li><li>Diseña el plan de estudios a 30 °C/75 % HR (lotes, duración, puntos).</li><li>Propón la vida útil y la leyenda de almacenamiento para la radicación.</li><li>Define el compromiso de estabilidad y su seguimiento.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar la brecha frente a la zona IVb.</li><li>Diseñar el plan de estudios.</li><li>Proponer la vida útil y la leyenda para Colombia.</li></ul>
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
  <tr><td>Brecha y análisis</td><td>30 %</td><td>Reconoce la falta de datos en zona IVb y el valor de soporte del acelerado.</td><td>Análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan</td><td>30 %</td><td>Tres lotes primarios a 30 °C/75 % HR, al menos 12 meses al radicar, puntos definidos.</td><td>Plan incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vida útil y compromiso</td><td>30 %</td><td>Vida útil coherente con los datos, leyenda adecuada y compromiso de seguimiento.</td><td>Propuesta sin compromiso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evestab_html$;
  v_t3 := $evestab_html$<h2>Caso de estudio</h2>
<p>Importadora Caribe (ficticia) quiere registrar cápsulas de un antibiótico fabricadas en Europa, en blíster PVC/aluminio (datos simulados). El fabricante tiene tres lotes con 36 meses a 25 °C/60 % HR y 6 meses a 40 °C/75 % HR sin cambio significativo, y un estudio de fotoestabilidad en un lote. La vida útil aprobada en Europa es de 36 meses.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evestab_html$;
  v_t4 := 'Plan de estabilidad para el registro en Colombia.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evestab_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 3157 de 2018 (guía de estabilidad de medicamentos de síntesis química) y Resolución 1839 de 2020; Resolución 3690 de 2016 (biológicos); guías ICH Q1A(R2), Q1B, Q1D, Q1E y Q5C; OMS TRS 1010, anexo 10; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, numeral».</p>$evestab_html$;
  v_t7 := NULL;
  v_j1 := $evestab_json$["Brecha.","Acelerados.","Plan de estudios.","Vida útil y leyenda.","Compromiso."]$evestab_json$::jsonb;
  v_j2 := $evestab_json${"version":1,"total":100,"criteria":[{"id":"brecha-y-analisis","name":"Brecha y análisis","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Reconoce la falta de datos en zona IVb y el valor de soporte del acelerado."},{"level":3,"label":"Logrado","description":"Análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan","name":"Plan","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Tres lotes primarios a 30 °C/75 % HR, al menos 12 meses al radicar, puntos definidos."},{"level":3,"label":"Logrado","description":"Plan incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vida-util-y-compromiso","name":"Vida útil y compromiso","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Vida útil coherente con los datos, leyenda adecuada y compromiso de seguimiento."},{"level":3,"label":"Logrado","description":"Propuesta sin compromiso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evestab_json$::jsonb;
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


  -- ── Actividad estab-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Evaluación estadística y asignación de vida útil' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Evaluación estadística y asignación de vida útil) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Cálculo de la vida útil con datos de tres lotes';
  v_t2 := $evestab_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Calcula la pendiente de cada lote (puedes usar una hoja de cálculo).</li><li>Analiza si los lotes son combinables según ICH Q1E.</li><li>Estima el tiempo en que el límite inferior de confianza del 95 % cruza 95,0 %.</li><li>Aplica el límite de extrapolación de ICH Q1E a los 12 meses disponibles.</li><li>Propón la vida útil, la leyenda de almacenamiento y el compromiso de estabilidad.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar la regresión y la prueba de combinación de lotes.</li><li>Estimar la vida útil con el límite de confianza.</li><li>Evaluar la vida útil propuesta.</li></ul>
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
  <tr><td>Análisis estadístico</td><td>35 %</td><td>Pendientes, combinabilidad y uso del límite de confianza correctos.</td><td>Análisis con errores menores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Límite de extrapolación</td><td>30 %</td><td>Aplica el máximo de 24 meses (doble y no más de 12 meses adicionales).</td><td>Aplica un límite impreciso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Propuesta</td><td>25 %</td><td>Vida útil, leyenda y compromiso coherentes con los datos.</td><td>Propuesta incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evestab_html$;
  v_t3 := $evestab_html$<h2>Caso de estudio</h2>
<p>Laboratorios Meridiano (ficticia) tiene datos de valoración de tres lotes de tabletas a 30 °C/75 % HR (datos simulados), criterio de aceptación 95,0 % a 105,0 %. Lote A: 100,2 / 99,6 / 99,1 / 98,5 / 97,9 % a 0, 3, 6, 9 y 12 meses. Lote B: 100,5 / 99,9 / 99,3 / 98,8 / 98,2 %. Lote C: 99,8 / 99,0 / 98,1 / 97,3 / 96,4 %. El acelerado a 6 meses no mostró cambio significativo. Se propone una vida útil de 30 meses.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evestab_html$;
  v_t4 := 'Informe de evaluación estadística con propuesta de vida útil.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evestab_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 3157 de 2018 (guía de estabilidad de medicamentos de síntesis química) y Resolución 1839 de 2020; Resolución 3690 de 2016 (biológicos); guías ICH Q1A(R2), Q1B, Q1D, Q1E y Q5C; OMS TRS 1010, anexo 10; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, numeral».</p>$evestab_html$;
  v_t7 := NULL;
  v_j1 := $evestab_json$["Pendientes.","Combinabilidad.","Estimación.","Límite de extrapolación.","Propuesta final."]$evestab_json$::jsonb;
  v_j2 := $evestab_json${"version":1,"total":100,"criteria":[{"id":"analisis-estadistico","name":"Análisis estadístico","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Pendientes, combinabilidad y uso del límite de confianza correctos."},{"level":3,"label":"Logrado","description":"Análisis con errores menores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"limite-de-extrapolacion","name":"Límite de extrapolación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aplica el máximo de 24 meses (doble y no más de 12 meses adicionales)."},{"level":3,"label":"Logrado","description":"Aplica un límite impreciso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"propuesta","name":"Propuesta","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Vida útil, leyenda y compromiso coherentes con los datos."},{"level":3,"label":"Logrado","description":"Propuesta incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evestab_json$::jsonb;
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


  -- ── Actividad estab-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Diseño del protocolo y métodos indicadores de estabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Diseño del protocolo y métodos indicadores de estabilidad) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: norma, programa de estudios y protocolo del antihipertensivo';
  v_t2 := $evestab_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos del producto (ficticios).</li><li>Fase 1: identifica la norma aplicable, su fecha de efectos y las guías de soporte.</li><li>Fase 2: define las condiciones de largo plazo, acelerado, intermedio (si aplica) y fotoestabilidad.</li><li>Fase 3: redacta el protocolo (lotes, envase, puntos, pruebas, criterios).</li><li>Fase 3: describe la degradación forzada y la validación del método indicador.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco normativo).</strong> Norma aplicable y guías de soporte.</li>
  <li><strong>Fase 2 · Unidad 2 (zonas y tipos de estudio).</strong> Condiciones y estudios del programa.</li>
  <li><strong>Fase 3 · Unidad 3 (protocolo y métodos).</strong> Protocolo y método indicador.</li>
  <li><strong>Fase 4 · Unidad 4 (evaluación estadística).</strong> Vida útil y leyenda de almacenamiento.</li>
  <li><strong>Fase 5 · Unidad 5 (ciclo de vida).</strong> Compromisos, on-going y presentación en el dossier.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Definir el marco normativo y el programa de estudios.</li><li>Redactar el protocolo y el plan del método indicador.</li></ul>
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
  <tr><td>Marco normativo</td><td>20 %</td><td>Resolución 3157 de 2018 con efectos desde el 1 de abril de 2024 y guías ICH pertinentes.</td><td>Marco incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Programa de estudios</td><td>30 %</td><td>Condiciones IVb, acelerado de seis meses con tres puntos, intermedio condicionado y fotoestabilidad.</td><td>Programa con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Protocolo y método</td><td>40 %</td><td>Tres lotes primarios, puntos y pruebas por forma farmacéutica, degradación forzada y especificidad.</td><td>Protocolo incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evestab_html$;
  v_t3 := $evestab_html$<h2>Caso de estudio</h2>
<p>Laboratorios Altiplano (ficticio) desarrolla tabletas recubiertas de un antihipertensivo de síntesis química, en blíster PVC/PVDC/aluminio, para registro sanitario nuevo en Colombia (datos simulados). Tiene tres lotes piloto con 12 meses a 30 °C/75 % HR y 6 meses a 40 °C/75 % HR. Te encargan el programa de estabilidad completo, desde el protocolo hasta el ciclo de vida. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evestab_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evestab_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 3157 de 2018 (guía de estabilidad de medicamentos de síntesis química) y Resolución 1839 de 2020; Resolución 3690 de 2016 (biológicos); guías ICH Q1A(R2), Q1B, Q1D, Q1E y Q5C; OMS TRS 1010, anexo 10; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, numeral».</p>$evestab_html$;
  v_t7 := NULL;
  v_j1 := $evestab_json$["Norma y guías.","Condiciones.","Fotoestabilidad.","Protocolo.","Método indicador."]$evestab_json$::jsonb;
  v_j2 := $evestab_json${"version":1,"total":100,"criteria":[{"id":"marco-normativo","name":"Marco normativo","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Resolución 3157 de 2018 con efectos desde el 1 de abril de 2024 y guías ICH pertinentes."},{"level":3,"label":"Logrado","description":"Marco incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"programa-de-estudios","name":"Programa de estudios","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Condiciones IVb, acelerado de seis meses con tres puntos, intermedio condicionado y fotoestabilidad."},{"level":3,"label":"Logrado","description":"Programa con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"protocolo-y-metodo","name":"Protocolo y método","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Tres lotes primarios, puntos y pruebas por forma farmacéutica, degradación forzada y especificidad."},{"level":3,"label":"Logrado","description":"Protocolo incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evestab_json$::jsonb;
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


  -- ── Actividad estab-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Ciclo de vida, dossier y requerimientos INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Ciclo de vida, dossier y requerimientos INVIMA) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: vida útil, compromisos y presentación en el dossier del antihipertensivo';
  v_t2 := $evestab_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: con datos simulados de tres lotes, aplica ICH Q1E y propone la vida útil y la leyenda.</li><li>Fase 5: redacta el compromiso de estabilidad.</li><li>Fase 5: diseña el programa on-going y los criterios para cambios que requieren nuevos datos.</li><li>Fase 5: organiza la presentación en el dossier (resumen, protocolo, compromisos, datos).</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el expediente en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco normativo).</strong> Norma aplicable y guías de soporte.</li>
  <li><strong>Fase 2 · Unidad 2 (zonas y tipos de estudio).</strong> Condiciones y estudios del programa.</li>
  <li><strong>Fase 3 · Unidad 3 (protocolo y métodos).</strong> Protocolo y método indicador.</li>
  <li><strong>Fase 4 · Unidad 4 (evaluación estadística).</strong> Vida útil y leyenda de almacenamiento.</li>
  <li><strong>Fase 5 · Unidad 5 (ciclo de vida).</strong> Compromisos, on-going y presentación en el dossier.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Asignar la vida útil con criterios estadísticos.</li><li>Planear el ciclo de vida y la presentación en el dossier.</li></ul>
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
  <tr><td>Vida útil</td><td>30 %</td><td>Aplica combinabilidad, límite de confianza y límite de extrapolación.</td><td>Aplicación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Ciclo de vida</td><td>25 %</td><td>Compromiso, on-going de un lote por año por concentración y envase, y reporte de resultados fuera de especificación.</td><td>Plan incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Dossier</td><td>20 %</td><td>Presentación ordenada y coherente con el protocolo.</td><td>Presentación desordenada.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evestab_html$;
  v_t3 := $evestab_html$<h2>Caso de estudio</h2>
<p>Laboratorios Altiplano (ficticio) desarrolla tabletas recubiertas de un antihipertensivo de síntesis química, en blíster PVC/PVDC/aluminio, para registro sanitario nuevo en Colombia (datos simulados). Tiene tres lotes piloto con 12 meses a 30 °C/75 % HR y 6 meses a 40 °C/75 % HR. Te encargan el programa de estabilidad completo, desde el protocolo hasta el ciclo de vida. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el expediente de estabilidad que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evestab_html$;
  v_t4 := 'Expediente de estabilidad con vida útil, compromisos y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evestab_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 3157 de 2018 (guía de estabilidad de medicamentos de síntesis química) y Resolución 1839 de 2020; Resolución 3690 de 2016 (biológicos); guías ICH Q1A(R2), Q1B, Q1D, Q1E y Q5C; OMS TRS 1010, anexo 10; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, numeral».</p>$evestab_html$;
  v_t7 := NULL;
  v_j1 := $evestab_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Vida útil y leyenda.","Compromiso.","Programa on-going.","Dossier y resumen."]$evestab_json$::jsonb;
  v_j2 := $evestab_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vida-util","name":"Vida útil","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aplica combinabilidad, límite de confianza y límite de extrapolación."},{"level":3,"label":"Logrado","description":"Aplicación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ciclo-de-vida","name":"Ciclo de vida","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Compromiso, on-going de un lote por año por concentración y envase, y reporte de resultados fuera de especificación."},{"level":3,"label":"Logrado","description":"Plan incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"dossier","name":"Dossier","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Presentación ordenada y coherente con el protocolo."},{"level":3,"label":"Logrado","description":"Presentación desordenada."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evestab_json$::jsonb;
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


  -- ── Foro estab-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con estudios de estabilidad';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evestab_html$<h2>Para empezar</h2>
<p>Piensa en un estudio de estabilidad que hayas diseñado, revisado o conocido y cuéntanos en tres o cuatro líneas qué fue lo más difícil, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evestab_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evestab_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evestab_html$;
  v_t6 := $evestab_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evestab_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has trabajado con estudios en zona IVb?', '¿Qué parte de la estabilidad te parece más difícil: el diseño, la estadística o el dossier?']::text[];
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


  -- ── Foro estab-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo de la estabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo de la estabilidad) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · La guía equivocada';
  v_t2 := 'Argumentar por qué identificar la norma aplicable es el primer paso del estudio de estabilidad.';
  v_t3 := $evestab_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio tiene en desarrollo una tableta de síntesis química, un fitoterapéutico y un biosimilar (datos simulados). El jefe de desarrollo quiere usar «el mismo protocolo de estabilidad para los tres, para ahorrar tiempo».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evestab_html$;
  v_t4 := '¿Es viable? ¿Qué norma aplica a cada producto y qué diferencias habría?';
  v_t5 := $evestab_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o guía que sustenta cada diferencia. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evestab_html$;
  v_t6 := $evestab_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta cada diferencia.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evestab_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué norma aplica a los fitoterapéuticos?', '¿Qué exige de particular la guía de biológicos?', '¿Qué elementos podrían compartirse entre protocolos?']::text[];
  v_j1 := $evestab_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta cada diferencia."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evestab_json$::jsonb;
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


  -- ── Foro estab-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Zonas climáticas y tipos de estudios de estabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Zonas climáticas y tipos de estudios de estabilidad) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Datos de zona II para un país de zona IVb';
  v_t2 := 'Argumentar qué hacer cuando el fabricante solo tiene estudios a 25 °C/60 % HR.';
  v_t3 := $evestab_html$<h2>Caso del foro</h2>
<p>Un importador ficticio quiere registrar un producto europeo con 36 meses de datos a 25 °C/60 % HR y 6 meses a 40 °C/75 % HR (datos simulados). No tiene datos a 30 °C/75 % HR. El fabricante dice que «el producto es muy estable» y no quiere iniciar estudios nuevos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evestab_html$;
  v_t4 := '¿Qué estrategia propondrías al fabricante y qué presentarías al Invima?';
  v_t5 := $evestab_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o guía que sustenta tu estrategia. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evestab_html$;
  v_t6 := $evestab_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta tu estrategia.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evestab_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dicen los datos acelerados sobre el comportamiento a 30 °C/75 % HR?', '¿Qué riesgo tiene una leyenda de almacenamiento restrictiva?', '¿Qué compromiso de estabilidad sería razonable?']::text[];
  v_j1 := $evestab_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta tu estrategia."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evestab_json$::jsonb;
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


  -- ── Foro estab-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Diseño del protocolo y métodos indicadores de estabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Diseño del protocolo y métodos indicadores de estabilidad) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Protocolo e informe que no coinciden';
  v_t2 := 'Argumentar por qué el protocolo debe aprobarse antes del estudio y cumplirse.';
  v_t3 := $evestab_html$<h2>Caso del foro</h2>
<p>En un laboratorio ficticio, el informe de estabilidad muestra puntos de análisis y pruebas distintos a los del protocolo, porque «se ajustó sobre la marcha» (datos simulados). El Invima emitió un requerimiento por inconsistencias.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evestab_html$;
  v_t4 := '¿Cómo responderías el requerimiento y qué cambiarías en la gestión de protocolos?';
  v_t5 := $evestab_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o guía que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evestab_html$;
  v_t6 := $evestab_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evestab_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué debe definir un protocolo de estabilidad?', '¿Cómo se documenta un cambio de protocolo?', '¿Qué impacto tienen las desviaciones en la vida útil?']::text[];
  v_j1 := $evestab_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evestab_json$::jsonb;
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


  -- ── Foro estab-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Evaluación estadística y asignación de vida útil' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Evaluación estadística y asignación de vida útil) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Vida útil provisional o definitiva';
  v_t2 := 'Argumentar cómo proponer una vida útil prudente cuando los datos aún son limitados.';
  v_t3 := $evestab_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio tiene 12 meses de largo plazo en zona IVb y 6 meses de acelerado sin cambio significativo (datos simulados). Mercadeo pide 36 meses de vida útil «porque la competencia los tiene».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evestab_html$;
  v_t4 := '¿Qué vida útil propondrías y cómo la defenderías ante Mercadeo y ante el Invima?';
  v_t5 := $evestab_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o guía que sustenta tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evestab_html$;
  v_t6 := $evestab_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evestab_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué límite de extrapolación permite ICH Q1E?', '¿Qué diferencia hay entre vida útil provisional y definitiva?', '¿Qué compromiso acompaña a una vida útil extrapolada?']::text[];
  v_j1 := $evestab_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evestab_json$::jsonb;
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


  -- ── Foro estab-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Ciclo de vida, dossier y requerimientos INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Ciclo de vida, dossier y requerimientos INVIMA) en Estudios de Estabilidad para el Registro de Medicamentos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Requerimientos de estabilidad más frecuentes';
  v_t2 := 'Argumentar cómo prevenir los requerimientos de estabilidad antes de radicar.';
  v_t3 := $evestab_html$<h2>Caso del foro</h2>
<p>Un área regulatoria ficticia recibió en un año requerimientos de estabilidad por (datos simulados): estudios solo a 25 °C/60 % HR, vida útil extrapolada sin estadística, métodos no indicadores de estabilidad, falta de fotoestabilidad y protocolos distintos a los informes.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evestab_html$;
  v_t4 := '¿Qué controles aplicarías antes de radicar para evitar cada requerimiento?';
  v_t5 := $evestab_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o guía que sustenta cada control. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evestab_html$;
  v_t6 := $evestab_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta cada control.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evestab_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué lista de verificación usarías?', '¿Quién debería revisar la estadística?', '¿Cómo presentarías la información en el dossier?']::text[];
  v_j1 := $evestab_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta cada control."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evestab_json$::jsonb;
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


  RAISE NOTICE 'Estudios de Estabilidad para el Registro de Medicamentos: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evestab$;

-- ============================================================
--  114_quices_actividades_foros_regulatorios10.sql — quizzes, actividades y foros, lote «regulatorios10»
--
--  Generado por scripts/evaluacion-aula.mjs regulatorios10 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Regulación Sanitaria de Gases Medicinales; Importación de Medicamentos Vitales No Disponibles.
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
--  Curso de Regulación Sanitaria de Gases Medicinales
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evgases$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Regulación Sanitaria de Gases Medicinales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Los gases medicinales como medicamentos', 'Unidad 2. Buenas Prácticas de Manufactura y certificación de plantas', 'Unidad 3. Registro sanitario, estabilidad, envases y trazabilidad', 'Unidad 4. Gases en las IPS, almacenamiento, distribución y transporte', 'Unidad 5. Pandemia, vigilancia y casos integradores']::text[])) < 5 THEN
    RAISE NOTICE 'Regulación Sanitaria de Gases Medicinales: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evgases_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evgases_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz gases-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Los gases medicinales como medicamentos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Los gases medicinales como medicamentos) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Los gases medicinales como medicamentos';
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


    v_t3 := 'Según la Resolución 4410 de 2009, ¿qué es un gas medicinal?';
    v_t4 := 'La Resolución 4410 de 2009 define el gas medicinal como medicamento constituido por uno o más componentes gaseosos apto para entrar en contacto directo con el organismo humano, elaborado según especificaciones farmacopeicas.';
    v_j1 := $evgases_json${"external_id":"gases-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Definición legal: gas medicinal vs. gas industrial","outcome":"Definición legal: gas medicinal vs. gas industrial","source":"Resolución 4410 de 2009, art. 3."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u1-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Cualquier gas comprimido que se vende en cilindros para uso en hospitales o industrias.', FALSE, 'No todo gas en cilindro es medicinal.', 0),
      (v_pregunta, 'Un medicamento de uno o más componentes gaseosos apto para el contacto directo con el organismo.', TRUE, 'Correcto. Con especificaciones farmacopeicas.', 1),
      (v_pregunta, 'Un dispositivo médico que entrega oxígeno a pacientes en su domicilio.', FALSE, 'El concentrador es dispositivo; el gas es medicamento.', 2),
      (v_pregunta, 'Un gas industrial al que se le cambia la etiqueta para uso hospitalario.', FALSE, 'Eso sería un producto ilegal.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Quién debe dirigir los procesos farmacéuticos de los gases medicinales según el artículo 2 de la Resolución 4410?';
    v_t4 := 'El artículo 2 dispone que los procesos farmacéuticos de los gases medicinales estén bajo la dirección técnica de un químico farmacéutico, y el artículo 7 exige que la liberación de cada lote la haga un químico farmacéutico.';
    v_j1 := $evgases_json${"external_id":"gases-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Actores de la cadena: fabricante, estación de llenado, distribuidor, IPS y paciente domiciliario","outcome":"Actores de la cadena: fabricante, estación de llenado, distribuidor, IPS y paciente domiciliario","source":"Resolución 4410 de 2009, arts. 2 y 7."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u1-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Un químico farmacéutico.', TRUE, 'Correcto. También libera los lotes (art. 7).', 0),
      (v_pregunta, 'El jefe de mantenimiento de la planta de llenado de cilindros.', FALSE, 'No es el responsable técnico.', 1),
      (v_pregunta, 'El conductor que transporta los cilindros hasta la IPS.', FALSE, 'No es el responsable técnico.', 2),
      (v_pregunta, 'El gerente comercial de la empresa distribuidora.', FALSE, 'No es el responsable técnico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una IPS compra «oxígeno» a un proveedor que no muestra registro sanitario y llena cilindros industriales. ¿Qué análisis es correcto?';
    v_t4 := 'El gas medicinal es un medicamento que requiere fabricación bajo BPM, liberación de lote por un QF y trazabilidad. Un proveedor sin registro que llena cilindros industriales pone en riesgo a los pacientes; la IPS debe verificar el registro, suspender la compra y reportar.';
    v_j1 := $evgases_json${"external_id":"gases-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Normas vigentes: Res. 4410/2009, Res. INVIMA 2011012580/2011, Decretos 677, 335 y 1474, Res. 1497/2023","outcome":"Normas vigentes: Res. 4410/2009, Res. INVIMA 2011012580/2011, Decretos 677, 335 y 1474, Res. 1497/2023","source":"Resolución 4410 de 2009, arts. 3, 6 y 7; Decreto 677 de 1995."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u1-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No hay problema, porque el oxígeno es el mismo gas sin importar su origen ni su fabricante.', FALSE, 'La calidad y el control son distintos.', 0),
      (v_pregunta, 'Es aceptable si el proveedor es más barato y entrega a tiempo.', FALSE, 'El precio no reemplaza el control sanitario.', 1),
      (v_pregunta, 'Es un riesgo grave: gas sin control ni trazabilidad; se verifica y se reporta.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Es aceptable si los cilindros están pintados de verde.', FALSE, 'El color no prueba la calidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un consultor sostiene que «la estabilidad de los gases se rige por la Resolución 3157 de 2018 como cualquier medicamento». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 6 de la Resolución 3157 de 2018 dispone que la Resolución 2514 de 1995 aplica solo a gases medicinales y fitoterapéuticos. Antes de diseñar estudios se verifica en el normograma si hay una norma posterior específica para gases.';
    v_j1 := $evgases_json${"external_id":"gases-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: detectar un 'oxígeno' sin registro sanitario","outcome":"Caso: detectar un 'oxígeno' sin registro sanitario","source":"Resolución 3157 de 2018, art. 6."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u1-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcta, porque la Resolución 3157 aplica a todos los medicamentos sin excepción.', FALSE, 'Tiene excepciones. Revisa la explicación.', 0),
      (v_pregunta, 'Es correcta solo para el oxígeno líquido criogénico.', FALSE, 'No es la distinción de la norma.', 1),
      (v_pregunta, 'Es correcta si el gas se vende en cilindros de aluminio.', FALSE, 'El material no cambia la norma.', 2),
      (v_pregunta, 'Es imprecisa: el art. 6 de la 3157 remite los gases a la Res. 2514 de 1995.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz gases-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Buenas Prácticas de Manufactura y certificación de plantas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Buenas Prácticas de Manufactura y certificación de plantas) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Buenas Prácticas de Manufactura y certificación de plantas';
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


    v_t3 := '¿Qué exige la Resolución 4410 antes de llenar un cilindro con gas medicinal?';
    v_t4 := 'La Resolución 4410 exige eliminar el gas remanente por purga y venteo o por vacío (por ejemplo, 25 pulgadas de mercurio al nivel del mar) antes de llenar (num. 6.2 y 6.5) y realizar pruebas previas: inspección externa, olor, sonido y prueba hidrostática vigente (art. 47).';
    v_j1 := $evgases_json${"external_id":"gases-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Llenado de cilindros y liberación de lotes","outcome":"Llenado de cilindros y liberación de lotes","source":"Resolución 4410 de 2009, num. 6.2 y 6.5, art. 47."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u2-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Pintar el cilindro de un color nuevo en cada llenado.', FALSE, 'No es el requisito. Revisa la explicación.', 0),
      (v_pregunta, 'Eliminar el gas remanente por vacío o por purga y venteo, y hacer las pruebas previas.', TRUE, 'Correcto. Num. 6.2 y 6.5; art. 47.', 1),
      (v_pregunta, 'Llenar el cilindro sobre el gas remanente para ahorrar producto.', FALSE, 'Está prohibido. Revisa la explicación.', 2),
      (v_pregunta, 'Solo pesar el cilindro antes y después del llenado.', FALSE, 'Se requieren más controles.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un lote de cilindros de oxígeno acaba de llenarse. ¿Cuándo puede venderse?';
    v_t4 := 'El artículo 7 exige que la liberación de cada lote la haga un químico farmacéutico, y el numeral 6.6 prohíbe vender o suministrar un lote antes de su certificación; los registros de llenado incluyen los resultados del control de calidad.';
    v_j1 := $evgases_json${"external_id":"gases-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Llenado de cilindros y liberación de lotes","outcome":"Llenado de cilindros y liberación de lotes","source":"Resolución 4410 de 2009, art. 7 y num. 6.6."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u2-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Inmediatamente, porque el oxígeno no requiere control de calidad.', FALSE, 'Sí lo requiere. Revisa la explicación.', 0),
      (v_pregunta, 'Después de que el conductor revise visualmente los cilindros.', FALSE, 'No es la persona autorizada.', 1),
      (v_pregunta, 'Cuando un químico farmacéutico libere el lote con los resultados del control de calidad.', TRUE, 'Correcto. Art. 7. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Cuando el cliente firme el recibido del pedido.', FALSE, 'La liberación es previa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En una inspección se encuentra que gases medicinales e industriales se almacenan juntos, sin delimitación. ¿Qué análisis es correcto?';
    v_t4 := 'El artículo 41 exige separar los gases medicinales de los industriales, con zonas delimitadas (cuarentena, producto aprobado, llenos, vacíos), almacenamiento bajo techo y temperatura ambiente no mayor de 52 °C.';
    v_j1 := $evgases_json${"external_id":"gases-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Guía de inspección INVIMA y clasificación de no conformidades","outcome":"Guía de inspección INVIMA y clasificación de no conformidades","source":"Resolución 4410 de 2009, art. 41."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u2-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es un hallazgo relevante: deben separarse en zonas delimitadas.', TRUE, 'Correcto. Art. 41. Lo sustenta la explicación.', 0),
      (v_pregunta, 'No importa, porque los cilindros tienen etiquetas distintas que permiten diferenciarlos.', FALSE, 'La separación física también se exige.', 1),
      (v_pregunta, 'Es aceptable si la bodega tiene buena ventilación.', FALSE, 'No reemplaza la separación.', 2),
      (v_pregunta, 'Es aceptable si los cilindros son de distintos tamaños.', FALSE, 'No reemplaza la separación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un cilindro llega a la planta con la prueba hidrostática vencida y el cliente pide llenarlo «por esta vez». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 47 exige, antes de cada uso, que la prueba de presión hidrostática esté vigente, además de inspección externa y pruebas de olor y sonido. Un cilindro con prueba vencida no se llena.';
    v_j1 := $evgases_json${"external_id":"gases-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Certificación BPM de plantas de llenado: alcance y vigencia","outcome":"Certificación BPM de plantas de llenado: alcance y vigencia","source":"Resolución 4410 de 2009, art. 47."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u2-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Se llena si el cilindro se ve en buen estado por fuera.', FALSE, 'La apariencia no reemplaza la prueba.', 0),
      (v_pregunta, 'Se llena si el cliente firma una carta de responsabilidad.', FALSE, 'La carta no reemplaza la prueba.', 1),
      (v_pregunta, 'Se llena a menor presión para reducir el riesgo.', FALSE, 'No es una alternativa válida.', 2),
      (v_pregunta, 'No se llena: la prueba hidrostática vigente es requisito previo al llenado.', TRUE, 'Correcto. Art. 47. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz gases-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Registro sanitario, estabilidad, envases y trazabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Registro sanitario, estabilidad, envases y trazabilidad) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Registro sanitario, estabilidad, envases y trazabilidad';
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


    v_t3 := '¿Qué deben permitir los registros de fabricación y distribución según el artículo 6 de la Resolución 4410?';
    v_t4 := 'El artículo 6 exige registros de fabricación y distribución que permitan indagar la historia de un lote; el artículo 17 exige registros de distribución para los retiros. La trazabilidad cilindro-lote-paciente permite actuar ante un problema de calidad.';
    v_j1 := $evgases_json${"external_id":"gases-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Trazabilidad de cilindros y lotes, devolución y mercado informal","outcome":"Trazabilidad de cilindros y lotes, devolución y mercado informal","source":"Resolución 4410 de 2009, arts. 6 y 17."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u3-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Calcular el precio de venta de cada cilindro según el cliente.', FALSE, 'No es su propósito. Revisa la explicación.', 0),
      (v_pregunta, 'Indagar la historia de un lote, para la trazabilidad y los retiros.', TRUE, 'Correcto. Art. 6 y art. 17.', 1),
      (v_pregunta, 'Llevar el inventario de los vehículos de transporte.', FALSE, 'No es su propósito principal.', 2),
      (v_pregunta, 'Registrar las horas trabajadas por cada operario.', FALSE, 'No es su propósito. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Cómo se identifica el contenido de un cilindro de gas medicinal?';
    v_t4 := 'El artículo 47 remite al código de colores de las normas farmacológicas vigentes; la etiqueta identifica el gas, el lote y el vencimiento (num. 6.7 y 6.8) y las conexiones no intercambiables evitan errores de conexión.';
    v_j1 := $evgases_json${"external_id":"gases-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Cilindros, válvulas y código de colores","outcome":"Cilindros, válvulas y código de colores","source":"Resolución 4410 de 2009, art. 47 y num. 6.7 a 6.9."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u3-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Solo por el tamaño del cilindro, que varía según el gas que contiene cada uno.', FALSE, 'El tamaño no identifica el gas.', 0),
      (v_pregunta, 'Por el olor del gas al abrir la válvula.', FALSE, 'No es un método de identificación seguro.', 1),
      (v_pregunta, 'Por el código de colores, la etiqueta y las conexiones no intercambiables.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Por la marca del fabricante grabada en el cilindro.', FALSE, 'La marca no identifica el contenido.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una etiqueta nueva se pega sobre otra anterior en un cilindro. ¿Qué análisis es correcto?';
    v_t4 := 'La Resolución 4410 dispone que no se deben sobreponer etiquetas; la etiqueta debe identificar con claridad el gas, el lote y las fechas, para evitar errores y asegurar la trazabilidad.';
    v_j1 := $evgases_json${"external_id":"gases-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Cilindros, válvulas y código de colores","outcome":"Cilindros, válvulas y código de colores","source":"Resolución 4410 de 2009, num. 6.7 y 6.8."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u3-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No está permitido sobreponer etiquetas: genera confusión sobre el contenido y el lote.', TRUE, 'Correcto. Num. 6.8. Lo sustenta la explicación.', 0),
      (v_pregunta, 'Es aceptable si la etiqueta nueva es más grande que la anterior.', FALSE, 'No corrige el riesgo.', 1),
      (v_pregunta, 'Es aceptable si ambas etiquetas son del mismo gas.', FALSE, 'Sigue siendo un riesgo de trazabilidad.', 2),
      (v_pregunta, 'Es aceptable si se anota el cambio en la factura.', FALSE, 'No es suficiente. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un titular quiere agregar una presentación de cilindro de aluminio de menor volumen. ¿Cuál es la mejor valoración?';
    v_t4 := 'Una nueva presentación o envase es una modificación del registro que se tramita según la norma de modificaciones, con soportes del envase (material, válvula) y de estabilidad según la norma aplicable a gases, que debe verificarse.';
    v_j1 := $evgases_json${"external_id":"gases-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: solicitud de modificación por nueva presentación y vida útil","outcome":"Caso: solicitud de modificación por nueva presentación y vida útil","source":"Decreto 334 de 2022; Resolución 3157 de 2018, art. 6."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u3-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No requiere ningún trámite, porque el gas es el mismo y solo cambia el tamaño.', FALSE, 'Una nueva presentación se tramita.', 0),
      (v_pregunta, 'Requiere un nuevo registro sanitario completo del gas.', FALSE, 'Se tramita como modificación.', 1),
      (v_pregunta, 'Requiere solo informar al cliente por correo.', FALSE, 'Se requiere trámite ante el Invima.', 2),
      (v_pregunta, 'Como modificación, con soporte de envase y de estabilidad aplicable.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz gases-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Gases en las IPS, almacenamiento, distribución y transporte' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Gases en las IPS, almacenamiento, distribución y transporte) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Gases en las IPS, almacenamiento, distribución y transporte';
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


    v_t3 := '¿Qué diferencia hay entre un concentrador de oxígeno domiciliario y un cilindro de oxígeno medicinal?';
    v_t4 := 'El concentrador de oxígeno es un dispositivo médico (tecnovigilancia), mientras que el oxígeno en cilindro es un medicamento (farmacovigilancia). En el domicilio ambos requieren educación al paciente y medidas de seguridad.';
    v_j1 := $evgases_json${"external_id":"gases-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Oxígeno domiciliario: concentradores y cilindros","outcome":"Oxígeno domiciliario: concentradores y cilindros","source":"Resolución 4410 de 2009, art. 3; normativa de dispositivos médicos."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u4-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Ninguna: ambos son medicamentos con registro sanitario de gas.', FALSE, 'Tienen naturaleza regulatoria distinta.', 0),
      (v_pregunta, 'El concentrador es un dispositivo médico; el oxígeno en cilindro es un medicamento.', TRUE, 'Correcto. Con vigilancias distintas.', 1),
      (v_pregunta, 'El cilindro es un dispositivo y el concentrador es un medicamento.', FALSE, 'Es al revés. Revisa la explicación.', 2),
      (v_pregunta, 'Ambos son dispositivos médicos sin control sanitario.', FALSE, 'Ambos están regulados.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿A qué temperatura máxima ambiente pueden exponerse los cilindros según la Resolución 4410?';
    v_t4 := 'El artículo 41 dispone que los cilindros no deben exponerse a más de 52 °C de temperatura ambiente, que se almacenen bajo techo y protegidos del deterioro externo, y que no se usen sitios subterráneos para gases comprimidos (art. 47).';
    v_j1 := $evgases_json${"external_id":"gases-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Almacenamiento seguro de cilindros y termos","outcome":"Almacenamiento seguro de cilindros y termos","source":"Resolución 4410 de 2009, arts. 41 y 47."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u4-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, '52 °C.', TRUE, 'Correcto. Art. 41. Lo sustenta la explicación.', 0),
      (v_pregunta, '100 °C.', FALSE, 'Es una temperatura excesiva.', 1),
      (v_pregunta, '80 °C.', FALSE, 'Es una temperatura excesiva.', 2),
      (v_pregunta, 'No hay límite, porque los cilindros son de acero.', FALSE, 'Hay un límite. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué papel tiene el químico farmacéutico del servicio farmacéutico frente a los gases medicinales de la IPS?';
    v_t4 := 'Los gases medicinales son medicamentos; el servicio farmacéutico gestiona su selección, adquisición, recepción, almacenamiento, dispensación y farmacovigilancia, en coordinación con mantenimiento para las redes y equipos.';
    v_j1 := $evgases_json${"external_id":"gases-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"El servicio farmacéutico y la gestión de gases medicinales","outcome":"El servicio farmacéutico y la gestión de gases medicinales","source":"Resolución 4410 de 2009, arts. 2 y 3."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u4-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Ninguno, porque los gases medicinales los maneja solo el área de mantenimiento del hospital.', FALSE, 'Los gases son medicamentos.', 0),
      (v_pregunta, 'Solo firmar las facturas de compra de los cilindros.', FALSE, 'Su papel es más amplio.', 1),
      (v_pregunta, 'Gestionar la selección, recepción, almacenamiento, dispensación y vigilancia del gas.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Solo reparar las fugas de la red de gases.', FALSE, 'Es una función de mantenimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Tras ampliar la red de oxígeno de una UCI, el contratista propone ponerla en servicio sin pruebas «porque la tubería es nueva». ¿Cuál es la mejor valoración?';
    v_t4 := 'Antes de poner en servicio una red de gases se verifican la hermeticidad, la ausencia de gases cruzados, la pureza y las alarmas, según NFPA 99. Una conexión cruzada puede ser mortal.';
    v_j1 := $evgases_json${"external_id":"gases-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: verificación de la red de gases tras una ampliación de UCI","outcome":"Caso: verificación de la red de gases tras una ampliación de UCI","source":"NFPA 99; Resolución 4410 de 2009."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u4-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es aceptable, porque una tubería nueva no puede tener fallas.', FALSE, 'Puede tener fugas o conexiones cruzadas.', 0),
      (v_pregunta, 'Es aceptable si el contratista firma una garantía de un año.', FALSE, 'La garantía no reemplaza las pruebas.', 1),
      (v_pregunta, 'Es aceptable si se vigila de cerca a los pacientes de la UCI durante la primera semana.', FALSE, 'El riesgo debe controlarse antes.', 2),
      (v_pregunta, 'Es inaceptable: antes del uso se prueban hermeticidad, gases cruzados y alarmas.', TRUE, 'Correcto. Según NFPA 99.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz gases-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Pandemia, vigilancia y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Pandemia, vigilancia y casos integradores) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Pandemia, vigilancia y casos integradores';
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


    v_t3 := '¿Cuándo se reporta un evento a farmacovigilancia y cuándo a tecnovigilancia en la cadena de gases?';
    v_t4 := 'El gas es un medicamento (farmacovigilancia); los concentradores, reguladores y flujómetros son dispositivos médicos (tecnovigilancia). La trazabilidad del lote y del equipo permite investigar el evento.';
    v_j1 := $evgases_json${"external_id":"gases-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Farmacovigilancia y tecnovigilancia en la cadena de gases","outcome":"Farmacovigilancia y tecnovigilancia en la cadena de gases","source":"Resolución 4410 de 2009, art. 3; programas de farmacovigilancia y tecnovigilancia."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u5-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Todo se reporta solo a tecnovigilancia, porque los gases vienen en equipos.', FALSE, 'El gas es un medicamento.', 0),
      (v_pregunta, 'Todo se reporta solo a farmacovigilancia, porque los equipos no fallan.', FALSE, 'Los equipos pueden fallar.', 1),
      (v_pregunta, 'El gas va a farmacovigilancia; los equipos, a tecnovigilancia.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'No se reporta nada si el paciente se recupera.', FALSE, 'Se reporta igual. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Llega una alerta del Invima sobre «oxígeno en lata» para uso recreativo. ¿Qué hace la IPS?';
    v_t4 := 'Ante una alerta sanitaria, la IPS verifica su inventario, informa al personal, orienta a los pacientes (por ejemplo, que no usen productos sin registro como sustituto del oxígeno prescrito) y reporta si detecta el producto.';
    v_j1 := $evgases_json${"external_id":"gases-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Alertas sanitarias e ilegalidad: oxígeno en lata y cilindros informales","outcome":"Alertas sanitarias e ilegalidad: oxígeno en lata y cilindros informales","source":"Alertas sanitarias del Invima."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u5-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Verificar que no esté en su inventario, informar al personal y orientar a los pacientes.', TRUE, 'Correcto. Lo sustenta la explicación.', 0),
      (v_pregunta, 'Comprarlo para tener una reserva en caso de emergencia.', FALSE, 'No es un gas medicinal.', 1),
      (v_pregunta, 'Recomendarlo a los pacientes con EPOC para salir a caminar.', FALSE, 'Es un riesgo. Revisa la explicación.', 2),
      (v_pregunta, 'Ignorar la alerta, porque no afecta a los hospitales.', FALSE, 'Debe gestionarse. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Durante la pandemia, la demanda de oxígeno se multiplicó. ¿Qué lección regulatoria es más útil?';
    v_t4 := 'La pandemia mostró la necesidad de planes de contingencia (capacidad de producción, respaldo, distribución) y de medidas transitorias proporcionales que mantengan el control de calidad, como la producción en IPS con requisitos y la priorización del oxígeno medicinal.';
    v_j1 := $evgases_json${"external_id":"gases-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso integrador: nitrógeno entregado como oxígeno","outcome":"Caso integrador: nitrógeno entregado como oxígeno","source":"Recomendaciones de la OMS sobre sistemas de oxígeno; medidas transitorias del Ministerio."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u5-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que los controles de calidad deben eliminarse en cualquier emergencia futura.', FALSE, 'Las medidas deben ser proporcionales.', 0),
      (v_pregunta, 'Que el oxígeno industrial es igual al medicinal y puede usarse sin restricciones.', FALSE, 'No es una lección válida.', 1),
      (v_pregunta, 'Que las IPS no deben producir oxígeno en ningún caso.', FALSE, 'Hubo medidas para la producción en IPS.', 2),
      (v_pregunta, 'Que se necesitan planes de contingencia y medidas transitorias proporcionales, con control de calidad.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un cilindro rotulado como oxígeno contenía nitrógeno y un paciente sufrió hipoxia. ¿Cuál es la mejor valoración del análisis de causa raíz?';
    v_t4 := 'Un error de identidad del gas exige un análisis de causa raíz en toda la cadena: evacuación y llenado (num. 6.2 y 6.5), etiquetado (num. 6.7 y 6.8), liberación por QF (art. 7), trazabilidad (art. 6), distribución y conexiones no intercambiables; con reporte y acciones por actor.';
    v_j1 := $evgases_json${"external_id":"gases-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso integrador: nitrógeno entregado como oxígeno","outcome":"Caso integrador: nitrógeno entregado como oxígeno","source":"Resolución 4410 de 2009, arts. 6 y 7, num. 6.2 a 6.9."}$evgases_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gases-u5-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Culpar solo a la enfermera que conectó el cilindro.', FALSE, 'El análisis debe incluir toda la cadena.', 0),
      (v_pregunta, 'Analizar toda la cadena, desde el llenado hasta la conexión al paciente.', TRUE, 'Correcto. Con acciones por actor.', 1),
      (v_pregunta, 'Concluir que fue un evento aislado e irrepetible, sin investigar la cadena.', FALSE, 'Debe investigarse. Revisa la explicación.', 2),
      (v_pregunta, 'Cambiar de proveedor sin reportar el evento.', FALSE, 'Debe reportarse e investigarse.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad gases-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Los gases medicinales como medicamentos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Los gases medicinales como medicamentos) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Detección de un oxígeno sin registro sanitario';
  v_t2 := $evgases_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lista lo que debe verificarse al recibir gases medicinales (registro, etiqueta, lote, certificado).</li><li>Verifica el caso frente a la Resolución 4410 (etiquetado, trazabilidad, liberación).</li><li>Analiza los riesgos para los pacientes.</li><li>Define las acciones inmediatas (cuarentena, reemplazo, reporte).</li><li>Propón controles para la selección de proveedores.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Verificar el registro y la documentación del gas.</li><li>Identificar los riesgos para los pacientes.</li><li>Definir las acciones de la IPS.</li></ul>
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
  <tr><td>Verificación</td><td>35 %</td><td>Detecta falta de lote y vencimiento, registro que no corresponde y cilindro de uso industrial.</td><td>Detecta parte de los hallazgos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acciones</td><td>35 %</td><td>Cuarentena, reemplazo con proveedor confiable y reporte a la autoridad sanitaria.</td><td>Acciones incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Prevención</td><td>20 %</td><td>Criterios de selección y calificación de proveedores.</td><td>Criterios generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evgases_html$;
  v_t3 := $evgases_html$<h2>Caso de estudio</h2>
<p>El servicio farmacéutico del Hospital San Rafael (ficticio) recibe cilindros de oxígeno de un nuevo proveedor (datos simulados). Los cilindros no tienen etiqueta con lote ni fecha de vencimiento, el número de registro sanitario que aparece en la factura no corresponde a gases, y uno de los cilindros tiene marcas de un uso industrial anterior.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evgases_html$;
  v_t4 := 'Informe de verificación con plan de acción.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evgases_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 4410 de 2009 (reglamento técnico de BPM de gases medicinales); Decreto 677 de 1995; Decreto 335 de 2022; Resolución 3157 de 2018 (art. 6) y norma de estabilidad aplicable a gases (verificar la vigente); NFPA 99; reglamentación de transporte de mercancías peligrosas; recomendaciones de la OMS sobre sistemas de oxígeno; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evgases_html$;
  v_t7 := NULL;
  v_j1 := $evgases_json$["Lista de recepción.","Verificación.","Riesgos.","Acciones inmediatas.","Selección de proveedores."]$evgases_json$::jsonb;
  v_j2 := $evgases_json${"version":1,"total":100,"criteria":[{"id":"verificacion","name":"Verificación","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Detecta falta de lote y vencimiento, registro que no corresponde y cilindro de uso industrial."},{"level":3,"label":"Logrado","description":"Detecta parte de los hallazgos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acciones","name":"Acciones","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cuarentena, reemplazo con proveedor confiable y reporte a la autoridad sanitaria."},{"level":3,"label":"Logrado","description":"Acciones incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"prevencion","name":"Prevención","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Criterios de selección y calificación de proveedores."},{"level":3,"label":"Logrado","description":"Criterios generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evgases_json$::jsonb;
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


  -- ── Actividad gases-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Buenas Prácticas de Manufactura y certificación de plantas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Buenas Prácticas de Manufactura y certificación de plantas) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Preparación de la visita de certificación de una estación de llenado';
  v_t2 := $evgases_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Relaciona cada hallazgo con el requisito de la Resolución 4410.</li><li>Clasifica los hallazgos (críticos, mayores, menores) y justifica.</li><li>Propón acciones correctivas y preventivas con responsables.</li><li>Define la evidencia de cierre para la visita.</li><li>Prioriza el plan según el riesgo para el paciente.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar los hallazgos por riesgo.</li><li>Diseñar el plan de acción.</li><li>Preparar la evidencia para la visita.</li></ul>
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
  <tr><td>Requisitos y clasificación</td><td>35 %</td><td>Relaciona cada hallazgo con su artículo y clasifica por riesgo.</td><td>Relación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acciones y evidencia</td><td>40 %</td><td>Acciones concretas con evidencia (registros de evacuación, liberación por QF, separación, etiquetas).</td><td>Acciones generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Priorización</td><td>15 %</td><td>Prioriza la evacuación y la liberación por QF.</td><td>Sin priorización clara.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evgases_html$;
  v_t3 := $evgases_html$<h2>Caso de estudio</h2>
<p>Gases del Caribe (ficticia) recibirá la visita de certificación de BPM de su estación de llenado (datos simulados). La autoinspección encontró: cilindros llenados sin registro de la evacuación previa; liberación de lotes firmada por el jefe de planta; cilindros medicinales e industriales en la misma área; y etiquetas sin fecha de vencimiento.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evgases_html$;
  v_t4 := 'Plan de preparación de la visita BPM.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evgases_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 4410 de 2009 (reglamento técnico de BPM de gases medicinales); Decreto 677 de 1995; Decreto 335 de 2022; Resolución 3157 de 2018 (art. 6) y norma de estabilidad aplicable a gases (verificar la vigente); NFPA 99; reglamentación de transporte de mercancías peligrosas; recomendaciones de la OMS sobre sistemas de oxígeno; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evgases_html$;
  v_t7 := NULL;
  v_j1 := $evgases_json$["Requisitos.","Clasificación.","Acciones.","Evidencia.","Priorización."]$evgases_json$::jsonb;
  v_j2 := $evgases_json${"version":1,"total":100,"criteria":[{"id":"requisitos-y-clasificacion","name":"Requisitos y clasificación","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Relaciona cada hallazgo con su artículo y clasifica por riesgo."},{"level":3,"label":"Logrado","description":"Relación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acciones-y-evidencia","name":"Acciones y evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Acciones concretas con evidencia (registros de evacuación, liberación por QF, separación, etiquetas)."},{"level":3,"label":"Logrado","description":"Acciones generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"priorizacion","name":"Priorización","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Prioriza la evacuación y la liberación por QF."},{"level":3,"label":"Logrado","description":"Sin priorización clara."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evgases_json$::jsonb;
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


  -- ── Actividad gases-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Gases en las IPS, almacenamiento, distribución y transporte' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Gases en las IPS, almacenamiento, distribución y transporte) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Verificación de la red de gases tras una ampliación de UCI';
  v_t2 := $evgases_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lista las pruebas previas a la puesta en servicio (hermeticidad, gases cruzados, pureza, alarmas, identificación de tomas).</li><li>Define quién hace cada prueba y con qué equipo.</li><li>Define los criterios de aceptación y qué hacer si una prueba falla.</li><li>Describe el papel del químico farmacéutico en la verificación de la pureza del gas.</li><li>Define los registros que quedarán.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar el protocolo de verificación.</li><li>Asignar responsabilidades.</li><li>Definir criterios de aceptación.</li></ul>
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
  <tr><td>Pruebas</td><td>35 %</td><td>Incluye hermeticidad, gases cruzados, pureza, alarmas e identificación.</td><td>Omite pruebas críticas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Responsables y criterios</td><td>35 %</td><td>Responsables claros y criterios de aceptación con acciones ante fallas.</td><td>Criterios vagos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Registros</td><td>20 %</td><td>Registros completos y firmados antes del uso.</td><td>Registros parciales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evgases_html$;
  v_t3 := $evgases_html$<h2>Caso de estudio</h2>
<p>El Hospital del Valle (ficticio) amplió su UCI con ocho camas y nuevas tomas de oxígeno, aire medicinal y vacío (datos simulados). El contratista entregó la obra y pide ponerla en servicio. El servicio farmacéutico y el área de mantenimiento deben verificarla antes del uso.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evgases_html$;
  v_t4 := 'Protocolo de verificación de la red de gases.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evgases_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 4410 de 2009 (reglamento técnico de BPM de gases medicinales); Decreto 677 de 1995; Decreto 335 de 2022; Resolución 3157 de 2018 (art. 6) y norma de estabilidad aplicable a gases (verificar la vigente); NFPA 99; reglamentación de transporte de mercancías peligrosas; recomendaciones de la OMS sobre sistemas de oxígeno; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evgases_html$;
  v_t7 := NULL;
  v_j1 := $evgases_json$["Pruebas.","Responsables.","Criterios de aceptación.","Papel del QF.","Registros."]$evgases_json$::jsonb;
  v_j2 := $evgases_json${"version":1,"total":100,"criteria":[{"id":"pruebas","name":"Pruebas","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Incluye hermeticidad, gases cruzados, pureza, alarmas e identificación."},{"level":3,"label":"Logrado","description":"Omite pruebas críticas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"responsables-y-criterios","name":"Responsables y criterios","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Responsables claros y criterios de aceptación con acciones ante fallas."},{"level":3,"label":"Logrado","description":"Criterios vagos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"registros","name":"Registros","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Registros completos y firmados antes del uso."},{"level":3,"label":"Logrado","description":"Registros parciales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evgases_json$::jsonb;
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


  -- ── Actividad gases-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Registro sanitario, estabilidad, envases y trazabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Registro sanitario, estabilidad, envases y trazabilidad) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: clasificación, BPM y trazabilidad de la estación de llenado';
  v_t2 := $evgases_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos de la estación (ficticios).</li><li>Fase 1: define los productos, los actores de la cadena y las normas aplicables.</li><li>Fase 2: describe el proceso de llenado con evacuación, pruebas previas y liberación por QF.</li><li>Fase 3: define el registro sanitario, las presentaciones y la estabilidad aplicable.</li><li>Fase 3: diseña la trazabilidad cilindro-lote-cliente y el etiquetado.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (gas como medicamento).</strong> Clasificación, actores y normas.</li>
  <li><strong>Fase 2 · Unidad 2 (BPM).</strong> Llenado, liberación y certificación.</li>
  <li><strong>Fase 3 · Unidad 3 (registro y trazabilidad).</strong> Registro, envases y trazabilidad.</li>
  <li><strong>Fase 4 · Unidad 4 (IPS y transporte).</strong> Almacenamiento, redes y domicilio.</li>
  <li><strong>Fase 5 · Unidad 5 (vigilancia).</strong> Contingencias, vigilancia y errores de identidad.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Definir el marco y los actores.</li><li>Diseñar el llenado, la liberación y la trazabilidad.</li></ul>
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
  <tr><td>Marco y actores</td><td>20 %</td><td>Gas como medicamento (Res. 4410) y actores con sus obligaciones.</td><td>Marco incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>BPM</td><td>40 %</td><td>Evacuación, pruebas previas (art. 47), liberación por QF (art. 7).</td><td>BPM incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Trazabilidad</td><td>30 %</td><td>Registros (arts. 6 y 17), etiquetado (num. 6.7 y 6.8) y estabilidad con norma verificada.</td><td>Trazabilidad parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evgases_html$;
  v_t3 := $evgases_html$<h2>Caso de estudio</h2>
<p>Oxígeno Andino (ficticia) es una estación de llenado que quiere certificarse y abastecer de oxígeno y aire medicinal a cinco IPS y a pacientes domiciliarios (datos simulados). Te encargan el plan de cumplimiento desde la planta hasta el paciente. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evgases_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evgases_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 4410 de 2009 (reglamento técnico de BPM de gases medicinales); Decreto 677 de 1995; Decreto 335 de 2022; Resolución 3157 de 2018 (art. 6) y norma de estabilidad aplicable a gases (verificar la vigente); NFPA 99; reglamentación de transporte de mercancías peligrosas; recomendaciones de la OMS sobre sistemas de oxígeno; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evgases_html$;
  v_t7 := NULL;
  v_j1 := $evgases_json$["Marco y actores.","Llenado.","Liberación.","Registro y estabilidad.","Trazabilidad y etiquetado."]$evgases_json$::jsonb;
  v_j2 := $evgases_json${"version":1,"total":100,"criteria":[{"id":"marco-y-actores","name":"Marco y actores","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Gas como medicamento (Res. 4410) y actores con sus obligaciones."},{"level":3,"label":"Logrado","description":"Marco incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"bpm","name":"BPM","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Evacuación, pruebas previas (art. 47), liberación por QF (art. 7)."},{"level":3,"label":"Logrado","description":"BPM incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"trazabilidad","name":"Trazabilidad","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Registros (arts. 6 y 17), etiquetado (num. 6.7 y 6.8) y estabilidad con norma verificada."},{"level":3,"label":"Logrado","description":"Trazabilidad parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evgases_json$::jsonb;
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


  -- ── Actividad gases-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Pandemia, vigilancia y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Pandemia, vigilancia y casos integradores) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: distribución, IPS, domicilio y vigilancia de la estación de llenado';
  v_t2 := $evgases_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: define el almacenamiento (art. 41) y el transporte como mercancía peligrosa.</li><li>Fase 4: define la educación y los controles para pacientes domiciliarios.</li><li>Fase 5: diseña la farmacovigilancia y la tecnovigilancia y el plan de contingencia.</li><li>Fase 5: define barreras contra errores de identidad del gas.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (gas como medicamento).</strong> Clasificación, actores y normas.</li>
  <li><strong>Fase 2 · Unidad 2 (BPM).</strong> Llenado, liberación y certificación.</li>
  <li><strong>Fase 3 · Unidad 3 (registro y trazabilidad).</strong> Registro, envases y trazabilidad.</li>
  <li><strong>Fase 4 · Unidad 4 (IPS y transporte).</strong> Almacenamiento, redes y domicilio.</li>
  <li><strong>Fase 5 · Unidad 5 (vigilancia).</strong> Contingencias, vigilancia y errores de identidad.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Planear el almacenamiento, el transporte y la atención domiciliaria.</li><li>Diseñar la vigilancia y las contingencias.</li></ul>
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
  <tr><td>Distribución y domicilio</td><td>30 %</td><td>Almacenamiento conforme, transporte y educación domiciliaria.</td><td>Plan parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vigilancia</td><td>25 %</td><td>Farmacovigilancia y tecnovigilancia diferenciadas, con contingencia.</td><td>Vigilancia general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Barreras</td><td>20 %</td><td>Barreras contra errores de identidad en toda la cadena.</td><td>Barreras incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evgases_html$;
  v_t3 := $evgases_html$<h2>Caso de estudio</h2>
<p>Oxígeno Andino (ficticia) es una estación de llenado que quiere certificarse y abastecer de oxígeno y aire medicinal a cinco IPS y a pacientes domiciliarios (datos simulados). Te encargan el plan de cumplimiento desde la planta hasta el paciente. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evgases_html$;
  v_t4 := 'Plan de cumplimiento completo con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evgases_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 4410 de 2009 (reglamento técnico de BPM de gases medicinales); Decreto 677 de 1995; Decreto 335 de 2022; Resolución 3157 de 2018 (art. 6) y norma de estabilidad aplicable a gases (verificar la vigente); NFPA 99; reglamentación de transporte de mercancías peligrosas; recomendaciones de la OMS sobre sistemas de oxígeno; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evgases_html$;
  v_t7 := NULL;
  v_j1 := $evgases_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Almacenamiento y transporte.","Domicilio.","Vigilancia y contingencia.","Barreras y resumen."]$evgases_json$::jsonb;
  v_j2 := $evgases_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"distribucion-y-domicilio","name":"Distribución y domicilio","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Almacenamiento conforme, transporte y educación domiciliaria."},{"level":3,"label":"Logrado","description":"Plan parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vigilancia","name":"Vigilancia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Farmacovigilancia y tecnovigilancia diferenciadas, con contingencia."},{"level":3,"label":"Logrado","description":"Vigilancia general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"barreras","name":"Barreras","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Barreras contra errores de identidad en toda la cadena."},{"level":3,"label":"Logrado","description":"Barreras incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evgases_json$::jsonb;
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


  -- ── Foro gases-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con gases medicinales';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evgases_html$<h2>Para empezar</h2>
<p>Piensa en un gas medicinal que hayas gestionado, dispensado o visto usar y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evgases_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evgases_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evgases_html$;
  v_t6 := $evgases_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evgases_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has trabajado con redes de gases o con oxígeno domiciliario?', '¿Qué te parece más difícil: las BPM, la trazabilidad o la seguridad?']::text[];
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


  -- ── Foro gases-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Los gases medicinales como medicamentos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Los gases medicinales como medicamentos) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Gas medicinal o gas industrial';
  v_t2 := 'Argumentar por qué el oxígeno medicinal no puede reemplazarse por oxígeno industrial.';
  v_t3 := $evgases_html$<h2>Caso del foro</h2>
<p>Durante un pico de demanda, un administrador ficticio propone comprar oxígeno industrial «porque es el mismo gas y es más barato» (datos simulados). El químico farmacéutico se opone.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evgases_html$;
  v_t4 := '¿Qué argumentos técnicos y regulatorios darías?';
  v_t5 := $evgases_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evgases_html$;
  v_t6 := $evgases_html$<h2>Normas de participación</h2>
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
</details>$evgases_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué controles tiene el gas medicinal que no tiene el industrial?', '¿Qué riesgos tiene un cilindro sin trazabilidad?', '¿Qué responsabilidad asume la IPS?']::text[];
  v_j1 := $evgases_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evgases_json$::jsonb;
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


  -- ── Foro gases-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Buenas Prácticas de Manufactura y certificación de plantas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Buenas Prácticas de Manufactura y certificación de plantas) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Plantas PSA en las IPS';
  v_t2 := 'Argumentar qué requisitos aseguran la calidad del oxígeno producido en sitio.';
  v_t3 := $evgases_html$<h2>Caso del foro</h2>
<p>Un hospital ficticio instaló una planta de oxígeno por tamiz molecular para reducir costos (datos simulados). No tiene químico farmacéutico a cargo ni análisis periódico de pureza.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evgases_html$;
  v_t4 := '¿Qué riesgos ves y qué debería implementar el hospital?';
  v_t5 := $evgases_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada medida. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evgases_html$;
  v_t6 := $evgases_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada medida.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evgases_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dice la Resolución 4410 sobre el oxígeno por tamiz molecular?', '¿Quién debe dirigir el proceso?', '¿Qué controles de calidad son indispensables?']::text[];
  v_j1 := $evgases_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada medida."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evgases_json$::jsonb;
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


  -- ── Foro gases-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Registro sanitario, estabilidad, envases y trazabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Registro sanitario, estabilidad, envases y trazabilidad) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · El cilindro que nunca vuelve';
  v_t2 := 'Argumentar cómo asegurar la trazabilidad de cilindros en el mercado.';
  v_t3 := $evgases_html$<h2>Caso del foro</h2>
<p>Un distribuidor ficticio pierde cada año cientos de cilindros que no regresan y sospecha que terminan en el mercado informal (datos simulados). Algunos reaparecen con etiquetas de otros proveedores.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evgases_html$;
  v_t4 := '¿Qué controles propondrías para la trazabilidad y para evitar el uso ilegal?';
  v_t5 := $evgases_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada control. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evgases_html$;
  v_t6 := $evgases_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada control.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evgases_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué información del marcado permite identificar el cilindro?', '¿Qué exige la norma sobre registros de distribución?', '¿Qué papel tienen las IPS en la devolución?']::text[];
  v_j1 := $evgases_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada control."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evgases_json$::jsonb;
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


  -- ── Foro gases-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Gases en las IPS, almacenamiento, distribución y transporte' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Gases en las IPS, almacenamiento, distribución y transporte) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Oxígeno en casa';
  v_t2 := 'Argumentar qué educación y controles necesita un paciente con oxígeno domiciliario.';
  v_t3 := $evgases_html$<h2>Caso del foro</h2>
<p>Un paciente ficticio con EPOC recibe oxígeno en cilindro y un concentrador en casa (datos simulados). Fuma ocasionalmente y guarda el cilindro junto a la estufa.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evgases_html$;
  v_t4 := '¿Qué educación le darías y qué controles harías?';
  v_t5 := $evgases_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada recomendación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evgases_html$;
  v_t6 := $evgases_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada recomendación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evgases_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué riesgos tiene el oxígeno cerca de fuentes de calor?', '¿Cómo debe almacenarse el cilindro?', '¿Qué reportarías y a qué programa?']::text[];
  v_j1 := $evgases_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada recomendación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evgases_json$::jsonb;
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


  -- ── Foro gases-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Pandemia, vigilancia y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Pandemia, vigilancia y casos integradores) en Regulación Sanitaria de Gases Medicinales: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Error de identidad de un gas';
  v_t2 := 'Argumentar qué barreras evitan que un gas equivocado llegue al paciente.';
  v_t3 := $evgases_html$<h2>Caso del foro</h2>
<p>En un hospital ficticio, un cilindro de nitrógeno con etiqueta de oxígeno llegó a una sala y se conectó con un adaptador improvisado (datos simulados). El paciente presentó hipoxia.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evgases_html$;
  v_t4 := '¿Qué barreras fallaron y cuáles reforzarías?';
  v_t5 := $evgases_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada barrera. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evgases_html$;
  v_t6 := $evgases_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada barrera.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evgases_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué controles del llenado y el etiquetado fallaron?', '¿Qué papel tienen las conexiones no intercambiables?', '¿Qué responsabilidad tiene cada actor?']::text[];
  v_j1 := $evgases_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada barrera."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evgases_json$::jsonb;
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


  RAISE NOTICE 'Regulación Sanitaria de Gases Medicinales: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evgases$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Importación de Medicamentos Vitales No Disponibles
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evvital$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Importación de Medicamentos Vitales No Disponibles' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos del régimen de Medicamentos Vitales No Disponibles', 'Unidad 2. Listado de MVND y papel de la Sala Especializada del INVIMA', 'Unidad 3. Modalidades de autorización y trámite de importación', 'Unidad 4. Desabastecimiento, enfermedades huérfanas y medicamentos de control especial', 'Unidad 5. Responsabilidades del importador, farmacovigilancia y caso integrador']::text[])) < 5 THEN
    RAISE NOTICE 'Importación de Medicamentos Vitales No Disponibles: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evvital_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evvital_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz vital-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del régimen de Medicamentos Vitales No Disponibles' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos del régimen de Medicamentos Vitales No Disponibles) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos del régimen de Medicamentos Vitales No Disponibles';
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


    v_t3 := 'Según el artículo 2 del Decreto 481 de 2004, ¿qué es un medicamento vital no disponible?';
    v_t4 := 'El artículo 2 define el medicamento vital no disponible como indispensable e irremplazable para salvaguardar la vida o aliviar el sufrimiento de un paciente o grupo de pacientes, que por baja rentabilidad no está disponible en el país o no en cantidades suficientes.';
    v_j1 := $evvital_json${"external_id":"vital-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Definición y criterios del artículo 2 y 4","outcome":"Definición y criterios del artículo 2 y 4","source":"Decreto 481 de 2004, art. 2."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u1-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Cualquier medicamento costoso que el paciente no puede pagar con sus recursos propios ni con su EPS.', FALSE, 'El costo no es el criterio.', 0),
      (v_pregunta, 'Uno indispensable e irremplazable que no está disponible en el país en cantidad suficiente.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'Un medicamento en investigación clínica que todavía no tiene resultados de eficacia.', FALSE, 'Está excluido. Revisa la explicación.', 2),
      (v_pregunta, 'Un medicamento con registro sanitario que el paciente prefiere comprar en el exterior.', FALSE, 'No cumple los criterios.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué criterios concurrentes exige el artículo 4 del Decreto 481?';
    v_t4 := 'El artículo 4 exige que el medicamento no esté en fase de investigación clínica, no esté comercializado en el país o lo esté sin cantidades suficientes, y no tenga sustitutos en el mercado.';
    v_j1 := $evvital_json${"external_id":"vital-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Definición y criterios del artículo 2 y 4","outcome":"Definición y criterios del artículo 2 y 4","source":"Decreto 481 de 2004, art. 4."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u1-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No en investigación, no comercializado o insuficiente, y sin sustitutos.', TRUE, 'Correcto. Lo sustenta la explicación.', 0),
      (v_pregunta, 'Tener registro sanitario vigente y precio regulado por el Ministerio de Salud.', FALSE, 'No son los criterios.', 1),
      (v_pregunta, 'Estar aprobado por la FDA y por la EMA en los últimos cinco años.', FALSE, 'No son los criterios.', 2),
      (v_pregunta, 'Ser un medicamento de venta libre de bajo costo para el sistema de salud.', FALSE, 'No son los criterios.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un medicamento tiene registro sanitario y se vende en Colombia en cantidad suficiente, pero es costoso. ¿Procede la vía de vital no disponible?';
    v_t4 := 'Los criterios del artículo 4 se refieren a la disponibilidad (no comercializado o no en cantidad suficiente), a la ausencia de sustitutos y a no estar en investigación; el precio alto no habilita la vía de vital no disponible.';
    v_j1 := $evvital_json${"external_id":"vital-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso práctico: ¿procede la vía MVND? Tres escenarios","outcome":"Caso práctico: ¿procede la vía MVND? Tres escenarios","source":"Decreto 481 de 2004, art. 4."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u1-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Sí, porque el alto costo lo hace no disponible para muchos pacientes.', FALSE, 'El costo no es un criterio del art. 4.', 0),
      (v_pregunta, 'Sí, si el paciente presenta una fórmula médica y un resumen de su historia clínica.', FALSE, 'Los documentos no sustituyen los criterios.', 1),
      (v_pregunta, 'No: está comercializado en cantidad suficiente; el precio no es un criterio.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Sí, si el importador consigue un precio menor en el exterior.', FALSE, 'Un menor precio no es un criterio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un medicamento vital no disponible ingresa sin registro sanitario. Alguien concluye que «queda por fuera de cualquier control sanitario». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 5 exime del registro sanitario, pero exige cumplir los requisitos del decreto; el artículo 12 prevé reportes de las importaciones y el 13 aplica las sanciones del Decreto 677 de 1995 ante incumplimientos.';
    v_j1 := $evvital_json${"external_id":"vital-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Datos del sistema: cuántas solicitudes, para qué y con qué resultados","outcome":"Datos del sistema: cuántas solicitudes, para qué y con qué resultados","source":"Decreto 481 de 2004, arts. 5, 12 y 13."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u1-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcto, porque la exención de registro elimina todas las obligaciones.', FALSE, 'Se mantienen requisitos y controles.', 0),
      (v_pregunta, 'Es correcto si el importador es una entidad pública.', FALSE, 'No cambia las obligaciones.', 1),
      (v_pregunta, 'Es correcto si el medicamento se usa solo en un paciente.', FALSE, 'Sigue habiendo controles.', 2),
      (v_pregunta, 'Es incorrecto: está exento de registro pero debe cumplir el decreto, con reportes y sanciones.', TRUE, 'Correcto. Arts. 5, 12 y 13.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz vital-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Listado de MVND y papel de la Sala Especializada del INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Listado de MVND y papel de la Sala Especializada del INVIMA) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Listado de MVND y papel de la Sala Especializada del INVIMA';
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


    v_t3 := 'Según el artículo 3 del Decreto 481, ¿quién establece y actualiza el listado de medicamentos vitales no disponibles?';
    v_t4 := 'El artículo 3 asigna a la Sala Especializada de Medicamentos de la Comisión Revisora del Invima establecer y actualizar en forma permanente el listado; los medicamentos deben estar incluidos en normas farmacológicas.';
    v_j1 := $evvital_json${"external_id":"vital-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: cómo se construye y usa el listado de MVND","outcome":"Introducción a la unidad: cómo se construye y usa el listado de MVND","source":"Decreto 481 de 2004, art. 3."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u2-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Cada EPS, según las necesidades de sus afiliados.', FALSE, 'No es la EPS. Revisa la explicación.', 0),
      (v_pregunta, 'La Sala Especializada de Medicamentos de la Comisión Revisora del Invima.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'El Ministerio de Comercio, Industria y Turismo.', FALSE, 'No es su competencia.', 2),
      (v_pregunta, 'Las secretarías de salud departamentales.', FALSE, 'No es su competencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué condición adicional exige el artículo 3 para los medicamentos del listado?';
    v_t4 := 'El artículo 3 dispone que los medicamentos del listado deben estar incluidos en las normas farmacológicas, lo que asegura una evaluación previa del principio activo.';
    v_j1 := $evvital_json${"external_id":"vital-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Consulta e interpretación del listado vigente","outcome":"Consulta e interpretación del listado vigente","source":"Decreto 481 de 2004, art. 3."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u2-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que tengan un precio inferior al de los medicamentos con registro.', FALSE, 'No es la condición. Revisa la explicación.', 0),
      (v_pregunta, 'Que se fabriquen en un país de la Unión Europea.', FALSE, 'No es la condición. Revisa la explicación.', 1),
      (v_pregunta, 'Que estén incluidos en las normas farmacológicas.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Que hayan sido solicitados por más de cien pacientes.', FALSE, 'No es la condición. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular demuestra que ya puede atender toda la demanda de un medicamento del listado. ¿Qué análisis es correcto?';
    v_t4 := 'El parágrafo 1 del artículo 4 permite al Invima excluir un medicamento del listado si desaparecen las condiciones que motivaron su inclusión o si el titular del registro demuestra capacidad para atender la demanda.';
    v_j1 := $evvital_json${"external_id":"vital-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Inclusión y exclusión: conceptos de la Sala Especializada","outcome":"Inclusión y exclusión: conceptos de la Sala Especializada","source":"Decreto 481 de 2004, art. 4."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u2-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El Invima puede excluirlo del listado, porque desapareció la condición de no disponibilidad.', TRUE, 'Correcto. Art. 4, par. 1.', 0),
      (v_pregunta, 'El medicamento sigue en el listado para siempre, una vez incluido.', FALSE, 'Puede excluirse. Revisa la explicación.', 1),
      (v_pregunta, 'El titular debe pagar una multa por haber dejado de suministrar antes.', FALSE, 'No es la consecuencia.', 2),
      (v_pregunta, 'Los importadores pueden seguir importándolo sin restricción.', FALSE, 'La condición desaparece.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para pedir la inclusión de un principio activo en el listado, un solicitante presenta solo una carta de un médico. ¿Cuál es la mejor valoración?';
    v_t4 := 'La inclusión requiere sustentar los criterios de los artículos 2 y 4 (indispensable, irremplazable, sin oferta suficiente, sin sustitutos, no en investigación) y la inclusión en normas farmacológicas (art. 3), con evidencia que la Sala pueda evaluar.';
    v_j1 := $evvital_json${"external_id":"vital-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: solicitar la inclusión de un principio activo en el listado","outcome":"Caso práctico: solicitar la inclusión de un principio activo en el listado","source":"Decreto 481 de 2004, arts. 2 a 4."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u2-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es suficiente, porque el médico tratante conoce mejor que nadie la necesidad del paciente.', FALSE, 'Se requiere más sustento.', 0),
      (v_pregunta, 'Es suficiente si la carta tiene sello de la IPS.', FALSE, 'El sello no sustituye la evidencia.', 1),
      (v_pregunta, 'Es suficiente si el medicamento es para una enfermedad rara.', FALSE, 'También se sustenta.', 2),
      (v_pregunta, 'Es insuficiente: se sustentan todos los criterios con evidencia evaluable.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz vital-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Modalidades de autorización y trámite de importación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Modalidades de autorización y trámite de importación) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Modalidades de autorización y trámite de importación';
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


    v_t3 := '¿Qué requiere la modalidad para un paciente específico (art. 8)?';
    v_t4 := 'El artículo 8 exige solicitud expresa ante el Invima, nombre y documento del paciente, principio activo y composición, fórmula médica firmada por el médico tratante con su tarjeta profesional e historia clínica resumida, y el recibo de pago. La autorización se concede por una sola vez y puede volver a pedirse según la prescripción.';
    v_j1 := $evvital_json${"external_id":"vital-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Paciente específico (art. 8)","outcome":"Paciente específico (art. 8)","source":"Decreto 481 de 2004, art. 8."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u3-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Solo el pago de la tarifa, sin datos del paciente ni del médico.', FALSE, 'Se requieren más documentos.', 0),
      (v_pregunta, 'Una carta del distribuidor internacional que vende el medicamento.', FALSE, 'No es el requisito. Revisa la explicación.', 1),
      (v_pregunta, 'Solicitud, datos del paciente, fórmula con historia clínica resumida y pago.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'El registro sanitario del medicamento en el país de origen, sin ningún otro documento.', FALSE, 'No es el requisito. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué permite la modalidad de urgencia clínica (art. 9)?';
    v_t4 := 'El artículo 9 permite, para medicamentos de uso exclusivo en urgencia clínica, autorizar la importación de cantidades no comerciales sin documentación del paciente, bastando la sustentación médica.';
    v_j1 := $evvital_json${"external_id":"vital-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Urgencia clínica (art. 9) frente a las demás modalidades","outcome":"Urgencia clínica (art. 9) frente a las demás modalidades","source":"Decreto 481 de 2004, art. 9."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u3-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Importar cantidades no comerciales para uso exclusivo en urgencia, con sustentación médica.', TRUE, 'Correcto. Sin documentos del paciente.', 0),
      (v_pregunta, 'Importar cualquier medicamento sin ninguna sustentación médica, por razones comerciales del importador.', FALSE, 'Requiere sustentación médica.', 1),
      (v_pregunta, 'Vender el medicamento importado en droguerías al público general.', FALSE, 'No es lo que permite.', 2),
      (v_pregunta, 'Importar medicamentos en investigación para ensayos clínicos.', FALSE, 'No es lo que permite.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Quién puede solicitar la modalidad para más de un paciente (art. 10) y qué debe aportar?';
    v_t4 := 'El artículo 10 permite autorizar la importación para más de un paciente a entidades públicas o privadas legalmente constituidas y autorizadas para distribuir medicamentos, que aporten certificado de venta libre o certificado conforme a la OMS, certificado de existencia y representación legal y certificado de análisis.';
    v_j1 := $evvital_json${"external_id":"vital-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Más de un paciente (art. 10) y acceso para salud pública","outcome":"Más de un paciente (art. 10) y acceso para salud pública","source":"Decreto 481 de 2004, art. 10."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u3-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Cualquier persona natural, sin documentos adicionales.', FALSE, 'Se exige una entidad autorizada.', 0),
      (v_pregunta, 'Solo el médico tratante, con la historia clínica completa de cada uno de los pacientes.', FALSE, 'No es la regla. Revisa la explicación.', 1),
      (v_pregunta, 'Solo las EPS, con la lista de afiliados beneficiados.', FALSE, 'No es la regla. Revisa la explicación.', 2),
      (v_pregunta, 'Una entidad autorizada para distribuir, con CVL, existencia y representación y CoA.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una IPS usa la modalidad de urgencia clínica para importar un medicamento de uso crónico y repartirlo entre varios pacientes. ¿Cuál es la mejor valoración?';
    v_t4 := 'La modalidad del artículo 9 se limita a medicamentos de uso exclusivo en urgencia clínica y cantidades no comerciales. Un uso crónico para varios pacientes debe tramitarse por paciente específico (art. 8) o por más de un paciente con entidad autorizada (art. 10).';
    v_j1 := $evvital_json${"external_id":"vital-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Urgencia clínica (art. 9) frente a las demás modalidades","outcome":"Urgencia clínica (art. 9) frente a las demás modalidades","source":"Decreto 481 de 2004, arts. 8 a 10."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u3-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcto, porque la urgencia clínica permite cualquier uso.', FALSE, 'Es para uso exclusivo en urgencia.', 0),
      (v_pregunta, 'Es correcto si los pacientes firman un consentimiento informado.', FALSE, 'El consentimiento no cambia la modalidad.', 1),
      (v_pregunta, 'Es inadecuado: la urgencia clínica es para uso exclusivo en urgencia; aplica otra modalidad.', TRUE, 'Correcto. Paciente específico o más de un paciente.', 2),
      (v_pregunta, 'Es correcto si la IPS es pública.', FALSE, 'La naturaleza de la IPS no cambia la modalidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz vital-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Desabastecimiento, enfermedades huérfanas y medicamentos de control especial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Desabastecimiento, enfermedades huérfanas y medicamentos de control especial) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Desabastecimiento, enfermedades huérfanas y medicamentos de control especial';
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


    v_t3 := '¿Qué diferencia hay entre un medicamento huérfano y un medicamento vital no disponible?';
    v_t4 := 'Un medicamento huérfano se define por estar destinado a una enfermedad rara; un vital no disponible, por ser indispensable, irremplazable y no estar disponible en el país (Decreto 481, arts. 2 y 4). Un huérfano puede tener registro o requerir la vía de vital no disponible.';
    v_j1 := $evvital_json${"external_id":"vital-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Medicamentos huérfanos frente a MVND","outcome":"Medicamentos huérfanos frente a MVND","source":"Decreto 481 de 2004, arts. 2 y 4."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u4-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Ninguna: ambos términos significan exactamente lo mismo en la norma colombiana vigente.', FALSE, 'Son categorías distintas.', 0),
      (v_pregunta, 'El huérfano se define por la enfermedad rara; el vital, por la falta de disponibilidad.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'El huérfano siempre es importado y el vital siempre es nacional.', FALSE, 'No es la diferencia.', 2),
      (v_pregunta, 'El vital no disponible requiere ensayos clínicos y el huérfano no.', FALSE, 'No es la diferencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un opioide de control especial escasea y se quiere importar como vital no disponible. ¿Qué se suma al trámite del Invima?';
    v_t4 := 'Además de la autorización como vital no disponible, los medicamentos de control especial requieren cumplir los requisitos del Fondo Nacional de Estupefacientes (inscripción, autorizaciones de importación y control de existencias).';
    v_j1 := $evvital_json${"external_id":"vital-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Papel del Fondo Nacional de Estupefacientes en MVND de control especial","outcome":"Papel del Fondo Nacional de Estupefacientes en MVND de control especial","source":"Decreto 481 de 2004; requisitos del Fondo Nacional de Estupefacientes."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u4-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Nada, porque la autorización del Invima cubre todo el control especial.', FALSE, 'Se suman requisitos del FNE.', 0),
      (v_pregunta, 'Los requisitos del Fondo Nacional de Estupefacientes para medicamentos de control especial.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'Solo la autorización de la EPS del paciente.', FALSE, 'No es el requisito adicional.', 2),
      (v_pregunta, 'Solo un permiso de la alcaldía municipal.', FALSE, 'No es el requisito adicional.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un medicamento aparece en el listado de desabastecimiento del Invima. ¿Qué análisis es correcto?';
    v_t4 := 'Estar en desabastecimiento puede justificar la evaluación como vital no disponible si se cumplen los criterios del artículo 4 (no comercializado o no en cantidad suficiente, sin sustitutos, no en investigación); la inclusión en el listado la decide la Sala (art. 3).';
    v_j1 := $evvital_json${"external_id":"vital-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Listados de abastecimiento y desabastecimiento en seguimiento","outcome":"Listados de abastecimiento y desabastecimiento en seguimiento","source":"Decreto 481 de 2004, arts. 3 y 4."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u4-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Puede evaluarse como vital no disponible si cumple los criterios del art. 4.', TRUE, 'Correcto. Con concepto de la Sala.', 0),
      (v_pregunta, 'Pasa automáticamente al listado de vitales no disponibles sin concepto de la Sala.', FALSE, 'La inclusión requiere concepto de la Sala.', 1),
      (v_pregunta, 'Queda prohibido importarlo hasta que termine el desabastecimiento.', FALSE, 'No es la consecuencia.', 2),
      (v_pregunta, 'Deja de requerir registro sanitario de forma permanente.', FALSE, 'No es la consecuencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una red hospitalaria importa un opioide como vital no disponible pero no lo registra ante el FNE «porque el Invima ya autorizó». ¿Cuál es la mejor valoración?';
    v_t4 := 'Los medicamentos de control especial importados como vitales no disponibles deben cumplir también los requisitos del Fondo Nacional de Estupefacientes; omitirlos es un incumplimiento que puede llevar a sanciones (Decreto 481 art. 13).';
    v_j1 := $evvital_json${"external_id":"vital-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: opioide desabastecido para una red hospitalaria","outcome":"Caso práctico: opioide desabastecido para una red hospitalaria","source":"Decreto 481 de 2004, art. 13; requisitos del FNE."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u4-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcto, porque la autorización del Invima es suficiente.', FALSE, 'Faltan los requisitos del FNE.', 0),
      (v_pregunta, 'Es correcto si el opioide se usa solo en pacientes hospitalizados.', FALSE, 'No cambia los requisitos.', 1),
      (v_pregunta, 'Es correcto si la red hospitalaria es pública.', FALSE, 'No cambia los requisitos.', 2),
      (v_pregunta, 'Es un incumplimiento: el control especial exige cumplir los requisitos del FNE.', TRUE, 'Correcto. Con riesgo de sanciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz vital-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Responsabilidades del importador, farmacovigilancia y caso integrador' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Responsabilidades del importador, farmacovigilancia y caso integrador) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Responsabilidades del importador, farmacovigilancia y caso integrador';
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


    v_t3 := '¿Qué exige el artículo 11 del Decreto 481 en importaciones en cantidades comerciales?';
    v_t4 := 'El artículo 11 exige que, en importaciones en cantidades comerciales, el importador ponga un sello visible que diga «medicamento vital», con el nombre y la ubicación del distribuidor autorizado.';
    v_j1 := $evvital_json${"external_id":"vital-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Etiquetado, sello de medicamento vital y reportes al INVIMA","outcome":"Etiquetado, sello de medicamento vital y reportes al INVIMA","source":"Decreto 481 de 2004, art. 11."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u5-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Un sello visible de «medicamento vital» con el distribuidor autorizado.', TRUE, 'Correcto. Lo sustenta la explicación.', 0),
      (v_pregunta, 'Reetiquetar todo el producto con un nuevo diseño de marca.', FALSE, 'No es lo que exige. Revisa la explicación.', 1),
      (v_pregunta, 'Traducir y reimprimir el inserto completo en la planta del fabricante extranjero.', FALSE, 'No es lo que exige. Revisa la explicación.', 2),
      (v_pregunta, 'Retirar la etiqueta de origen del producto.', FALSE, 'No es lo que exige. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente presenta una reacción adversa grave con un vital no disponible importado. ¿Qué corresponde?';
    v_t4 := 'Los medicamentos vitales no disponibles conservan obligaciones de vigilancia: los eventos se reportan al Programa Nacional de Farmacovigilancia con la identificación del producto y del lote, lo que exige trazabilidad desde la importación (art. 12).';
    v_j1 := $evvital_json${"external_id":"vital-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Responsabilidades del importador y farmacovigilancia de MVND","outcome":"Responsabilidades del importador y farmacovigilancia de MVND","source":"Decreto 481 de 2004, art. 12; Programa Nacional de Farmacovigilancia."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u5-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No se reporta, porque el medicamento no tiene registro sanitario.', FALSE, 'Igual se reporta. Revisa la explicación.', 0),
      (v_pregunta, 'Se reporta al programa de farmacovigilancia, identificando el producto y el lote importado.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'Se reporta solo al fabricante extranjero, sin informar a la autoridad local.', FALSE, 'Se reporta en Colombia.', 2),
      (v_pregunta, 'Se espera a tener varios casos antes de reportar.', FALSE, 'Los casos graves se reportan de inmediato.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Quién responde por la calidad de un medicamento vital no disponible importado?';
    v_t4 := 'Aunque está exento de registro (art. 5), el importador debe cumplir los requisitos del decreto (certificado de análisis, sello, reportes) y responde ante incumplimientos con las sanciones del Decreto 677 de 1995 (art. 13).';
    v_j1 := $evvital_json${"external_id":"vital-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Introducción a la unidad: la responsabilidad sanitaria sin registro sanitario","outcome":"Introducción a la unidad: la responsabilidad sanitaria sin registro sanitario","source":"Decreto 481 de 2004, arts. 5, 10, 11, 12 y 13."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u5-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Nadie, porque no tiene registro sanitario en Colombia.', FALSE, 'La exención no elimina la responsabilidad.', 0),
      (v_pregunta, 'Solo el paciente, que asumió el riesgo al pedirlo.', FALSE, 'No es la regla. Revisa la explicación.', 1),
      (v_pregunta, 'El importador, con controles, trazabilidad y reportes, sujeto a sanciones por incumplimiento.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Solo el fabricante extranjero, sin responsabilidad local.', FALSE, 'Hay responsabilidad local.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una EPS quiere importar un vital no disponible para 40 niños usando 40 solicitudes de paciente específico, aunque tiene un distribuidor autorizado. ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 10 permite autorizar la importación para más de un paciente a entidades autorizadas para distribuir medicamentos, con los documentos exigidos; para 40 pacientes puede ser más eficiente y trazable que 40 solicitudes individuales (art. 8).';
    v_j1 := $evvital_json${"external_id":"vital-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso integrador: importación para 40 pacientes pediátricos desde la EPS","outcome":"Caso integrador: importación para 40 pacientes pediátricos desde la EPS","source":"Decreto 481 de 2004, arts. 8 y 10."}$evvital_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vital-u5-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es lo único posible, porque cada paciente debe tener su propia autorización.', FALSE, 'Existe la modalidad de más de un paciente.', 0),
      (v_pregunta, 'Es mejor, porque el Invima prefiere muchas solicitudes pequeñas.', FALSE, 'No es un criterio de la norma.', 1),
      (v_pregunta, 'Es obligatorio cuando los pacientes son menores de edad.', FALSE, 'No es una regla del decreto.', 2),
      (v_pregunta, 'Puede ser más eficiente la modalidad de más de un paciente, por el distribuidor autorizado.', TRUE, 'Correcto. Art. 10. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad vital-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del régimen de Medicamentos Vitales No Disponibles' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos del régimen de Medicamentos Vitales No Disponibles) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · ¿Procede la vía de vital no disponible? Tres escenarios';
  v_t2 := $evvital_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y evaluar.</p>
<ol><li>Construye una matriz con los criterios de los artículos 2 y 4.</li><li>Aplica la matriz a cada caso.</li><li>Decide si procede la vía y con qué modalidad.</li><li>Propón alternativas para los casos en que no procede.</li><li>Indica qué evidencia documental soportaría cada decisión.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar la definición y los criterios.</li><li>Decidir si procede la vía en cada caso.</li><li>Proponer alternativas.</li></ul>
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
  <tr><td>Criterios</td><td>35 %</td><td>Matriz completa con los criterios de los arts. 2 y 4.</td><td>Matriz incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Decisiones</td><td>40 %</td><td>Procede en 1; no procede en 2 (disponible) ni en 3 (investigación).</td><td>Una decisión errada.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Alternativas</td><td>15 %</td><td>Alternativas pertinentes para los casos 2 y 3.</td><td>Alternativas generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvital_html$;
  v_t3 := $evvital_html$<h2>Caso de estudio</h2>
<p>El comité de farmacia del Hospital Pediátrico del Norte (ficticio) analiza tres casos (datos simulados): (1) un antídoto para una intoxicación rara cuyo único titular dejó de comercializarlo en Colombia; (2) un antiepiléptico con registro, disponible en el país, que una familia quiere importar porque es más barato en otro país; (3) un medicamento para una enfermedad rara que solo está en ensayo clínico de fase II.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evvital_html$;
  v_t4 := 'Matriz de decisión con alternativas.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evvital_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 481 de 2004 (arts. 2 a 14); Decreto 677 de 1995; listados de medicamentos vitales no disponibles y de desabastecimiento del Invima; lineamientos del Programa Nacional de Farmacovigilancia; requisitos del Fondo Nacional de Estupefacientes para medicamentos de control especial; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evvital_html$;
  v_t7 := NULL;
  v_j1 := $evvital_json$["Matriz de criterios.","Aplicación.","Decisión y modalidad.","Alternativas.","Evidencia."]$evvital_json$::jsonb;
  v_j2 := $evvital_json${"version":1,"total":100,"criteria":[{"id":"criterios","name":"Criterios","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Matriz completa con los criterios de los arts. 2 y 4."},{"level":3,"label":"Logrado","description":"Matriz incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"decisiones","name":"Decisiones","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Procede en 1; no procede en 2 (disponible) ni en 3 (investigación)."},{"level":3,"label":"Logrado","description":"Una decisión errada."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"alternativas","name":"Alternativas","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Alternativas pertinentes para los casos 2 y 3."},{"level":3,"label":"Logrado","description":"Alternativas generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvital_json$::jsonb;
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


  -- ── Actividad vital-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Listado de MVND y papel de la Sala Especializada del INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Listado de MVND y papel de la Sala Especializada del INVIMA) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Solicitud de inclusión de un principio activo en el listado';
  v_t2 := $evvital_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Relaciona cada criterio de los artículos 2, 3 y 4 con la evidencia del caso.</li><li>Estructura la sustentación (necesidad, epidemiología, ausencia de oferta y sustitutos).</li><li>Identifica la evidencia que falta.</li><li>Indica la modalidad de importación que seguiría a la inclusión.</li><li>Describe cuándo y cómo podría excluirse del listado.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Estructurar la sustentación técnica.</li><li>Demostrar el cumplimiento de los criterios.</li><li>Prever la gestión posterior.</li></ul>
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
  <tr><td>Criterios</td><td>40 %</td><td>Relaciona todos los criterios con evidencia concreta.</td><td>Relación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Sustentación</td><td>30 %</td><td>Necesidad, epidemiología y ausencia de oferta y sustitutos.</td><td>Sustentación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Gestión posterior</td><td>20 %</td><td>Modalidad (por ejemplo, urgencia clínica o más de un paciente) y exclusión (art. 4, par. 1).</td><td>Gestión imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvital_html$;
  v_t3 := $evvital_html$<h2>Caso de estudio</h2>
<p>La Asociación de Hospitales del Sur (ficticia) identifica que un medicamento para una intoxicación grave no tiene registro vigente en Colombia (datos simulados): el único titular canceló su registro hace un año, no hay sustitutos terapéuticos y está incluido en las normas farmacológicas. Cada año se presentan unos 30 casos en la región.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evvital_html$;
  v_t4 := 'Sustentación técnica de inclusión.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evvital_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 481 de 2004 (arts. 2 a 14); Decreto 677 de 1995; listados de medicamentos vitales no disponibles y de desabastecimiento del Invima; lineamientos del Programa Nacional de Farmacovigilancia; requisitos del Fondo Nacional de Estupefacientes para medicamentos de control especial; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evvital_html$;
  v_t7 := NULL;
  v_j1 := $evvital_json$["Criterios y evidencia.","Sustentación.","Evidencia faltante.","Modalidad.","Exclusión futura."]$evvital_json$::jsonb;
  v_j2 := $evvital_json${"version":1,"total":100,"criteria":[{"id":"criterios","name":"Criterios","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Relaciona todos los criterios con evidencia concreta."},{"level":3,"label":"Logrado","description":"Relación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"sustentacion","name":"Sustentación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Necesidad, epidemiología y ausencia de oferta y sustitutos."},{"level":3,"label":"Logrado","description":"Sustentación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"gestion-posterior","name":"Gestión posterior","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Modalidad (por ejemplo, urgencia clínica o más de un paciente) y exclusión (art. 4, par. 1)."},{"level":3,"label":"Logrado","description":"Gestión imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvital_json$::jsonb;
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


  -- ── Actividad vital-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Desabastecimiento, enfermedades huérfanas y medicamentos de control especial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Desabastecimiento, enfermedades huérfanas y medicamentos de control especial) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Opioide desabastecido para una red hospitalaria';
  v_t2 := $evvital_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Verifica los criterios de vital no disponible (arts. 2 y 4) y la situación del listado.</li><li>Define la modalidad y el solicitante (art. 10).</li><li>Lista los documentos (CVL o certificado OMS, existencia y representación, CoA).</li><li>Integra los requisitos del FNE para control especial.</li><li>Planea el sello «medicamento vital» (art. 11), la distribución y los reportes (art. 12).</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Definir la ruta de importación.</li><li>Integrar los requisitos del FNE.</li><li>Planear la distribución y el control.</li></ul>
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
  <tr><td>Ruta</td><td>35 %</td><td>Criterios, inclusión en el listado y modalidad de más de un paciente con solicitante autorizado.</td><td>Ruta incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Control especial</td><td>30 %</td><td>Integra los requisitos del FNE.</td><td>Omite el FNE.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Distribución y reportes</td><td>25 %</td><td>Sello del art. 11, reportes del art. 12 y trazabilidad.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvital_html$;
  v_t3 := $evvital_html$<h2>Caso de estudio</h2>
<p>La Red Hospitalaria del Centro (ficticia) enfrenta el desabastecimiento de un opioide inyectable de control especial para cuidado crítico (datos simulados). El titular del registro informó que no podrá suministrar en seis meses y no hay sustitutos adecuados para algunos pacientes. Un distribuidor autorizado ofrece importarlo desde otro país.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evvital_html$;
  v_t4 := 'Ruta de importación con plan de control.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evvital_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 481 de 2004 (arts. 2 a 14); Decreto 677 de 1995; listados de medicamentos vitales no disponibles y de desabastecimiento del Invima; lineamientos del Programa Nacional de Farmacovigilancia; requisitos del Fondo Nacional de Estupefacientes para medicamentos de control especial; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evvital_html$;
  v_t7 := NULL;
  v_j1 := $evvital_json$["Criterios y listado.","Modalidad y solicitante.","Documentos.","Requisitos del FNE.","Sello, distribución y reportes."]$evvital_json$::jsonb;
  v_j2 := $evvital_json${"version":1,"total":100,"criteria":[{"id":"ruta","name":"Ruta","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Criterios, inclusión en el listado y modalidad de más de un paciente con solicitante autorizado."},{"level":3,"label":"Logrado","description":"Ruta incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"control-especial","name":"Control especial","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Integra los requisitos del FNE."},{"level":3,"label":"Logrado","description":"Omite el FNE."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"distribucion-y-reportes","name":"Distribución y reportes","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Sello del art. 11, reportes del art. 12 y trazabilidad."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvital_json$::jsonb;
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


  -- ── Actividad vital-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Modalidades de autorización y trámite de importación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Modalidades de autorización y trámite de importación) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: criterios, listado y modalidad del medicamento para 40 pacientes';
  v_t2 := $evvital_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos del medicamento (ficticios).</li><li>Fase 1: sustenta los criterios de los artículos 2 y 4.</li><li>Fase 2: verifica el listado y, si hace falta, prepara la solicitud de inclusión (art. 3).</li><li>Fase 3: define la modalidad (art. 10), el solicitante y los documentos.</li><li>Fase 3: describe el trámite de importación y sus puntos críticos.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Criterios de vital no disponible.</li>
  <li><strong>Fase 2 · Unidad 2 (listado).</strong> Inclusión en el listado.</li>
  <li><strong>Fase 3 · Unidad 3 (modalidades).</strong> Modalidad, documentos y trámite.</li>
  <li><strong>Fase 4 · Unidad 4 (desabastecimiento).</strong> Coordinación y casos especiales.</li>
  <li><strong>Fase 5 · Unidad 5 (responsabilidades).</strong> Sello, reportes y farmacovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Sustentar los criterios y la inclusión en el listado.</li><li>Definir la modalidad y el expediente.</li></ul>
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
  <tr><td>Criterios y listado</td><td>35 %</td><td>Criterios de los arts. 2 y 4 con evidencia, e inclusión en el listado (art. 3).</td><td>Criterios incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Modalidad y documentos</td><td>40 %</td><td>Modalidad de más de un paciente con entidad autorizada y documentos del art. 10.</td><td>Modalidad o documentos errados.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Trámite</td><td>15 %</td><td>Puntos críticos del trámite identificados.</td><td>Trámite general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvital_html$;
  v_t3 := $evvital_html$<h2>Caso de estudio</h2>
<p>Una EPS ficticia necesita garantizar un medicamento para 40 pacientes pediátricos con una enfermedad rara; el único titular del registro dejó de comercializarlo en Colombia y no hay sustitutos (datos simulados). Un distribuidor autorizado puede importarlo. Te encargan el plan regulatorio desde los criterios hasta la farmacovigilancia. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evvital_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evvital_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 481 de 2004 (arts. 2 a 14); Decreto 677 de 1995; listados de medicamentos vitales no disponibles y de desabastecimiento del Invima; lineamientos del Programa Nacional de Farmacovigilancia; requisitos del Fondo Nacional de Estupefacientes para medicamentos de control especial; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evvital_html$;
  v_t7 := NULL;
  v_j1 := $evvital_json$["Criterios.","Listado.","Modalidad.","Documentos.","Trámite."]$evvital_json$::jsonb;
  v_j2 := $evvital_json${"version":1,"total":100,"criteria":[{"id":"criterios-y-listado","name":"Criterios y listado","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Criterios de los arts. 2 y 4 con evidencia, e inclusión en el listado (art. 3)."},{"level":3,"label":"Logrado","description":"Criterios incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"modalidad-y-documentos","name":"Modalidad y documentos","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Modalidad de más de un paciente con entidad autorizada y documentos del art. 10."},{"level":3,"label":"Logrado","description":"Modalidad o documentos errados."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tramite","name":"Trámite","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Puntos críticos del trámite identificados."},{"level":3,"label":"Logrado","description":"Trámite general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvital_json$::jsonb;
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


  -- ── Actividad vital-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Responsabilidades del importador, farmacovigilancia y caso integrador' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Responsabilidades del importador, farmacovigilancia y caso integrador) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: coordinación, responsabilidades y farmacovigilancia del medicamento para 40 pacientes';
  v_t2 := $evvital_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: define el papel de la EPS, el distribuidor, las IPS y el Invima, y qué pasaría si el medicamento fuera de control especial.</li><li>Fase 5: diseña el sello (art. 11), los reportes (art. 12) y la trazabilidad por paciente.</li><li>Fase 5: diseña la farmacovigilancia y el procedimiento de retiro.</li><li>Fase 5: define cómo se gestionaría la salida del listado si vuelve la oferta (art. 4, par. 1).</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Criterios de vital no disponible.</li>
  <li><strong>Fase 2 · Unidad 2 (listado).</strong> Inclusión en el listado.</li>
  <li><strong>Fase 3 · Unidad 3 (modalidades).</strong> Modalidad, documentos y trámite.</li>
  <li><strong>Fase 4 · Unidad 4 (desabastecimiento).</strong> Coordinación y casos especiales.</li>
  <li><strong>Fase 5 · Unidad 5 (responsabilidades).</strong> Sello, reportes y farmacovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Coordinar a los actores y prever casos especiales.</li><li>Asegurar el sello, los reportes y la farmacovigilancia.</li></ul>
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
  <tr><td>Coordinación</td><td>20 %</td><td>Roles claros y previsión del control especial (FNE).</td><td>Roles confusos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Responsabilidades</td><td>30 %</td><td>Sello del art. 11, reportes del art. 12 y trazabilidad por paciente.</td><td>Responsabilidades incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Farmacovigilancia</td><td>25 %</td><td>Reporte de eventos, retiro y salida del listado.</td><td>Plan parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvital_html$;
  v_t3 := $evvital_html$<h2>Caso de estudio</h2>
<p>Una EPS ficticia necesita garantizar un medicamento para 40 pacientes pediátricos con una enfermedad rara; el único titular del registro dejó de comercializarlo en Colombia y no hay sustitutos (datos simulados). Un distribuidor autorizado puede importarlo. Te encargan el plan regulatorio desde los criterios hasta la farmacovigilancia. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evvital_html$;
  v_t4 := 'Plan regulatorio completo con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evvital_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 481 de 2004 (arts. 2 a 14); Decreto 677 de 1995; listados de medicamentos vitales no disponibles y de desabastecimiento del Invima; lineamientos del Programa Nacional de Farmacovigilancia; requisitos del Fondo Nacional de Estupefacientes para medicamentos de control especial; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evvital_html$;
  v_t7 := NULL;
  v_j1 := $evvital_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Coordinación de actores.","Sello, reportes y trazabilidad.","Farmacovigilancia y retiro.","Salida del listado y resumen."]$evvital_json$::jsonb;
  v_j2 := $evvital_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"coordinacion","name":"Coordinación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Roles claros y previsión del control especial (FNE)."},{"level":3,"label":"Logrado","description":"Roles confusos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"responsabilidades","name":"Responsabilidades","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Sello del art. 11, reportes del art. 12 y trazabilidad por paciente."},{"level":3,"label":"Logrado","description":"Responsabilidades incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacovigilancia","name":"Farmacovigilancia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reporte de eventos, retiro y salida del listado."},{"level":3,"label":"Logrado","description":"Plan parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvital_json$::jsonb;
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


  -- ── Foro vital-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con medicamentos vitales no disponibles';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evvital_html$<h2>Para empezar</h2>
<p>Piensa en un medicamento que haya escaseado o que hayas tenido que conseguir en el exterior y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evvital_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evvital_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evvital_html$;
  v_t6 := $evvital_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evvital_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has tramitado una importación de un medicamento vital no disponible?', '¿Qué te parece más difícil: los criterios, el trámite o la farmacovigilancia?']::text[];
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


  -- ── Foro vital-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del régimen de Medicamentos Vitales No Disponibles' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos del régimen de Medicamentos Vitales No Disponibles) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Vital no disponible o problema de acceso?';
  v_t2 := 'Argumentar cuándo la vía de vital no disponible es la herramienta correcta.';
  v_t3 := $evvital_html$<h2>Caso del foro</h2>
<p>Una EPS ficticia recibe tres solicitudes (datos simulados): un antídoto discontinuado en el país; un medicamento oncológico con registro pero muy costoso; y una molécula nueva que solo existe en ensayos clínicos. El comité quiere usar la vía de vital no disponible para las tres.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvital_html$;
  v_t4 := '¿En cuáles procede y qué alternativas hay para las demás?';
  v_t5 := $evvital_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada decisión. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evvital_html$;
  v_t6 := $evvital_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada decisión.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvital_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué criterios del art. 4 cumple cada caso?', '¿Qué ruta existe para medicamentos en investigación?', '¿Qué herramientas hay para problemas de precio?']::text[];
  v_j1 := $evvital_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada decisión."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvital_json$::jsonb;
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


  -- ── Foro vital-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Listado de MVND y papel de la Sala Especializada del INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Listado de MVND y papel de la Sala Especializada del INVIMA) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · El listado como herramienta de salud pública';
  v_t2 := 'Argumentar cómo el listado de vitales no disponibles responde a crisis de abastecimiento.';
  v_t3 := $evvital_html$<h2>Caso del foro</h2>
<p>Durante una crisis ficticia, varios medicamentos de cuidado crítico escasean y los hospitales piden incluirlos en el listado (datos simulados). Un titular afirma que en tres meses normalizará el suministro.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvital_html$;
  v_t4 := '¿Qué debería considerar la Sala y cómo se gestionaría la salida del listado?';
  v_t5 := $evvital_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada consideración. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evvital_html$;
  v_t6 := $evvital_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada consideración.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvital_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué criterios aplican a la inclusión?', '¿Qué permite el parágrafo 1 del art. 4?', '¿Cómo se coordina con los listados de desabastecimiento?']::text[];
  v_j1 := $evvital_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada consideración."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvital_json$::jsonb;
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


  -- ── Foro vital-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Modalidades de autorización y trámite de importación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Modalidades de autorización y trámite de importación) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Elegir la modalidad correcta';
  v_t2 := 'Argumentar cómo escoger la modalidad de importación según el caso.';
  v_t3 := $evvital_html$<h2>Caso del foro</h2>
<p>Un hospital ficticio necesita (datos simulados): un antídoto para tener en el servicio de urgencias; un medicamento para un niño con una enfermedad rara; y un medicamento para 40 pacientes de una EPS. El equipo quiere usar la misma modalidad para todo.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvital_html$;
  v_t4 := '¿Qué modalidad corresponde a cada necesidad y por qué?';
  v_t5 := $evvital_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada elección. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evvital_html$;
  v_t6 := $evvital_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada elección.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvital_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué permite la urgencia clínica?', '¿Qué documentos exige el paciente específico?', '¿Quién puede pedir la modalidad de más de un paciente?']::text[];
  v_j1 := $evvital_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada elección."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvital_json$::jsonb;
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


  -- ── Foro vital-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Desabastecimiento, enfermedades huérfanas y medicamentos de control especial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Desabastecimiento, enfermedades huérfanas y medicamentos de control especial) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Desabastecimiento y respuesta del sistema';
  v_t2 := 'Argumentar cómo coordinar a los actores ante un desabastecimiento.';
  v_t3 := $evvital_html$<h2>Caso del foro</h2>
<p>Un anestésico esencial ficticio entra en desabastecimiento (datos simulados). Las EPS esperan que los hospitales lo consigan, los hospitales esperan a las EPS y los pacientes ven cirugías aplazadas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvital_html$;
  v_t4 := '¿Qué debería hacer cada actor y cómo se usaría la vía de vital no disponible?';
  v_t5 := $evvital_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo o la fuente que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evvital_html$;
  v_t6 := $evvital_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo o la fuente que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvital_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué papel tiene la Sala en el listado?', '¿Qué modalidad serviría para abastecer a varios hospitales?', '¿Qué información pública consultarías?']::text[];
  v_j1 := $evvital_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo o la fuente que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvital_json$::jsonb;
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


  -- ── Foro vital-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Responsabilidades del importador, farmacovigilancia y caso integrador' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Responsabilidades del importador, farmacovigilancia y caso integrador) en Importación de Medicamentos Vitales No Disponibles: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Responsabilidad sin registro';
  v_t2 := 'Argumentar qué responsabilidades conserva un medicamento que ingresa sin registro sanitario.';
  v_t3 := $evvital_html$<h2>Caso del foro</h2>
<p>Un importador ficticio de vitales no disponibles no lleva registro de los lotes que entrega a cada hospital (datos simulados). Cuando llega una alerta del fabricante sobre un lote defectuoso, no puede saber dónde está.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvital_html$;
  v_t4 := '¿Qué falló y qué controles implementarías?';
  v_t5 := $evvital_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada control. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evvital_html$;
  v_t6 := $evvital_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada control.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvital_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué exigen los artículos 11 y 12?', '¿Cómo se ejecuta un retiro sin trazabilidad?', '¿Qué responsabilidad tiene el importador?']::text[];
  v_j1 := $evvital_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada control."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvital_json$::jsonb;
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


  RAISE NOTICE 'Importación de Medicamentos Vitales No Disponibles: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evvital$;

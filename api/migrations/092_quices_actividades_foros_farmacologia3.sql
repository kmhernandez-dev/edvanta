-- ============================================================
--  092_quices_actividades_foros_farmacologia3.sql — quizzes, actividades y foros, lote «farmacologia3»
--
--  Generado por scripts/evaluacion-aula.mjs farmacologia3 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Farmacología Renal; Anticoagulantes y Antiagregantes.
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
--  Curso de Farmacología Renal
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfren$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacología Renal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacología Renal: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fisiología renal aplicada a los fármacos y estimación de la función renal', 'Unidad 2. Diuréticos: farmacología y uso clínico', 'Unidad 3. Trastornos hidroelectrolíticos inducidos por fármacos y nefrotoxicidad', 'Unidad 4. Farmacoterapia de la enfermedad renal crónica y de sus complicaciones', 'Unidad 5. Trasplante renal, infecciones urinarias y contexto colombiano de la ERC']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacología Renal: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfren_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfren_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fren-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fisiología renal aplicada a los fármacos y estimación de la función renal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fisiología renal aplicada a los fármacos y estimación de la función renal) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fisiología renal aplicada a los fármacos y estimación de la función renal';
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


    v_t3 := '¿Qué parte de un fármaco en la sangre se filtra en el glomérulo?';
    v_t4 := 'En el glomérulo se filtra la fracción libre del fármaco; la unida a proteínas no atraviesa el filtro. Además hay secreción tubular por transportadores (OAT, OCT, glicoproteína P, MATE) y reabsorción pasiva que depende del pH urinario.';
    v_j1 := $evfren_json${"external_id":"fren-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Filtración glomerular, secreción y reabsorción tubular de fármacos","outcome":"Filtración glomerular, secreción y reabsorción tubular de fármacos","source":"Farmacocinética renal; fichas técnicas."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u1-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'La fracción libre, no unida a proteínas plasmáticas.', TRUE, 'Correcto. La unida a proteínas no atraviesa el filtro.', 0),
      (v_pregunta, 'La fracción unida a la albúmina, que arrastra al fármaco a través del filtro glomerular.', FALSE, 'Las proteínas no se filtran en un glomérulo sano.', 1),
      (v_pregunta, 'Todo el fármaco, sin importar su unión a proteínas ni su tamaño molecular.', FALSE, 'La unión a proteínas y el tamaño limitan la filtración.', 2),
      (v_pregunta, 'Solo los metabolitos conjugados, porque el fármaco original nunca llega al glomérulo.', FALSE, 'El fármaco original también puede filtrarse.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un hombre de 80 años pesa 60 kg y tiene una creatinina sérica de 1,5 mg/dL. ¿Cuál es su aclaramiento de creatinina estimado con Cockcroft-Gault?';
    v_t4 := 'Cockcroft-Gault: (140 - edad) × peso en kg / (72 × creatinina sérica), multiplicado por 0,85 en mujeres. En este paciente: 60 × 60 / 108 ≈ 33 mL/min. En adultos mayores con poca masa muscular una creatinina cercana a lo normal puede ocultar una función renal baja.';
    v_j1 := $evfren_json${"external_id":"fren-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Cockcroft-Gault frente a CKD-EPI 2021: qué ecuación usar para dosificar","outcome":"Cockcroft-Gault frente a CKD-EPI 2021: qué ecuación usar para dosificar","source":"Ecuación de Cockcroft-Gault; fichas técnicas."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u1-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Alrededor de 60 mL/min, porque la creatinina está apenas por encima de lo normal.', FALSE, 'La edad y el peso reducen mucho la estimación.', 0),
      (v_pregunta, 'Alrededor de 45 mL/min, al restar la edad sin considerar el peso del paciente.', FALSE, 'La fórmula incluye el peso.', 1),
      (v_pregunta, 'Alrededor de 33 mL/min: (140 - 80) × 60 / (72 × 1,5).', TRUE, 'Correcto. Una creatinina «casi normal» puede ocultar una función baja.', 2),
      (v_pregunta, 'Alrededor de 22 mL/min, porque en los hombres se multiplica el resultado por 0,85.', FALSE, 'El factor 0,85 se aplica a las mujeres.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con ERC avanzada que recibe morfina oral se vuelve somnoliento y confuso días después de iniciarla. ¿Qué análisis es correcto?';
    v_t4 := 'La ERC modifica la absorción, la unión a proteínas, el volumen de distribución, el metabolismo y la excreción. Algunos fármacos tienen metabolitos activos de eliminación renal que se acumulan, como los de la morfina, y causan sedación y neurotoxicidad.';
    v_j1 := $evfren_json${"external_id":"fren-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Cambios farmacocinéticos en la enfermedad renal crónica","outcome":"Cambios farmacocinéticos en la enfermedad renal crónica","source":"Ficha técnica de morfina; farmacocinética en la ERC."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u1-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'La morfina se elimina más rápido en la ERC y su efecto analgésico desaparece en poco tiempo.', FALSE, 'Ocurre lo contrario con sus metabolitos.', 0),
      (v_pregunta, 'La confusión se debe solo a la uremia y no tiene ninguna relación con el analgésico que inició.', FALSE, 'La relación temporal sugiere el medicamento.', 1),
      (v_pregunta, 'La ERC no modifica la farmacocinética de los opioides, porque todos se eliminan por el hígado.', FALSE, 'La ERC sí altera la eliminación de algunos metabolitos.', 2),
      (v_pregunta, 'En la ERC se acumulan metabolitos activos de la morfina, que causan sedación y neurotoxicidad.', TRUE, 'Correcto. Se revisa la dosis o se elige otro opioide.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para dosificar un fármaco de margen estrecho en una mujer de 88 años y 42 kg, alguien propone usar la TFGe por CKD-EPI normalizada a 1,73 m², aunque la ficha técnica usa el aclaramiento de creatinina. ¿Cuál es la mejor valoración?';
    v_t4 := 'La TFGe por CKD-EPI 2021 se expresa normalizada a 1,73 m²; en personas muy pequeñas o con poca masa muscular puede sobrestimar la función real. Para dosificar se sigue la ficha técnica, que con frecuencia usa el aclaramiento de creatinina por Cockcroft-Gault, y se considera la situación clínica.';
    v_j1 := $evfren_json${"external_id":"fren-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Cockcroft-Gault frente a CKD-EPI 2021: qué ecuación usar para dosificar","outcome":"Cockcroft-Gault frente a CKD-EPI 2021: qué ecuación usar para dosificar","source":"KDIGO 2024; fichas técnicas."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u1-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcta: la TFGe normalizada siempre es la estimación más exacta para dosificar cualquier fármaco.', FALSE, 'En personas muy pequeñas puede sobrestimar la función real.', 0),
      (v_pregunta, 'Conviene seguir la ficha técnica: estimar el aclaramiento con Cockcroft-Gault, porque la TFGe normalizada puede sobrestimar.', TRUE, 'Correcto. Se considera además la situación clínica.', 1),
      (v_pregunta, 'Es correcta si se redondea la TFGe hacia arriba para evitar dar dosis demasiado bajas.', FALSE, 'Redondear hacia arriba aumenta el riesgo de toxicidad.', 2),
      (v_pregunta, 'Conviene no ajustar la dosis, porque las ecuaciones de función renal no sirven en adultos mayores.', FALSE, 'Las ecuaciones tienen límites, pero son útiles.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fren-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Diuréticos: farmacología y uso clínico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Diuréticos: farmacología y uso clínico) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Diuréticos: farmacología y uso clínico';
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


    v_t3 := '¿Dónde actúan los diuréticos de asa como la furosemida?';
    v_t4 := 'Los diuréticos de asa inhiben el cotransportador Na-K-2Cl (NKCC2) de la rama ascendente gruesa del asa de Henle; son los más potentes. Sus efectos adversos incluyen hipopotasemia, hipomagnesemia, deshidratación y ototoxicidad con dosis altas intravenosas rápidas.';
    v_j1 := $evfren_json${"external_id":"fren-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Diuréticos de asa: furosemida, bumetanida y torasemida","outcome":"Diuréticos de asa: furosemida, bumetanida y torasemida","source":"Ficha técnica de furosemida."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u2-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'En el túbulo colector, donde bloquean los canales de sodio y ahorran potasio.', FALSE, 'Ese es el sitio de los ahorradores de potasio.', 0),
      (v_pregunta, 'En el túbulo proximal, donde inhiben la anhidrasa carbónica y alcalinizan de forma marcada la orina.', FALSE, 'Ese es el mecanismo de la acetazolamida.', 1),
      (v_pregunta, 'En el túbulo distal, donde inhiben el cotransportador de sodio y cloro (NCC).', FALSE, 'Ese es el sitio de las tiazidas.', 2),
      (v_pregunta, 'En la rama ascendente gruesa del asa de Henle, donde inhiben el cotransportador NKCC2.', TRUE, 'Correcto. Por eso son los diuréticos más potentes.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un viajero que toma acetazolamida para el mal de altura consulta por hormigueo en manos y pies. ¿Qué le indica el QF?';
    v_t4 := 'La acetazolamida inhibe la anhidrasa carbónica; se usa en glaucoma, mal de altura y alcalosis metabólica. Produce acidosis metabólica leve, parestesias, alteración del gusto y aumento de la diuresis; es una sulfonamida y se usa con precaución en alergia a sulfas.';
    v_j1 := $evfren_json${"external_id":"fren-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Acetazolamida y manitol: inhibidores de anhidrasa carbónica y diuréticos osmóticos","outcome":"Acetazolamida y manitol: inhibidores de anhidrasa carbónica y diuréticos osmóticos","source":"Ficha técnica de acetazolamida."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u2-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que el hormigueo indica una alergia grave y debe ir de inmediato a urgencias por una posible anafilaxia.', FALSE, 'Las parestesias son un efecto frecuente, no una anafilaxia.', 0),
      (v_pregunta, 'Que es un efecto adverso frecuente de la acetazolamida; se vigila y se consulta si es intenso.', TRUE, 'Correcto. También puede alterar el sabor de las bebidas gaseosas.', 1),
      (v_pregunta, 'Que debe duplicar la dosis, porque el hormigueo indica que la dosis aún es insuficiente.', FALSE, 'Subir la dosis empeoraría el efecto.', 2),
      (v_pregunta, 'Que el hormigueo se debe a la altura y nunca tiene relación con el medicamento que toma.', FALSE, 'Es un efecto conocido del medicamento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con insuficiencia cardiaca sigue con edema pese a furosemida 80 mg al día; toma ibuprofeno y come con mucha sal. El médico propone añadir una tiazida. ¿Qué análisis hace el QF?';
    v_t4 := 'La resistencia diurética tiene causas como los AINE, la ingesta alta de sal, la mala adherencia y la adaptación del túbulo distal. Se corrigen primero; el bloqueo secuencial de la nefrona (añadir una tiazida o acetazolamida) aumenta la diuresis, con riesgo de hipopotasemia, hiponatremia y deterioro renal.';
    v_j1 := $evfren_json${"external_id":"fren-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Resistencia diurética y bloqueo secuencial de la nefrona","outcome":"Resistencia diurética y bloqueo secuencial de la nefrona","source":"Ficha técnica de furosemida; recomendaciones de resistencia diurética."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u2-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Antes se corrigen el AINE y la sal; si se añade la tiazida, se vigilan de cerca potasio, sodio y función renal.', TRUE, 'Correcto. El bloqueo secuencial potencia la diuresis y los riesgos.', 0),
      (v_pregunta, 'La tiazida no tiene efecto con un diurético de asa, así que la propuesta no cambiará nada.', FALSE, 'La combinación sí potencia el efecto diurético.', 1),
      (v_pregunta, 'Lo mejor es suspender la furosemida y dejar solo la tiazida, que es más potente.', FALSE, 'La tiazida es menos potente que el diurético de asa.', 2),
      (v_pregunta, 'El AINE mejora la respuesta a la furosemida y debe mantenerse para reducir el edema.', FALSE, 'Los AINE reducen la respuesta a los diuréticos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con ERC toma enalapril, espironolactona y un suplemento de potasio «para los calambres». ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'Los ahorradores de potasio (espironolactona, eplerenona, amilorida) combinados con IECA o ARA-II aumentan el riesgo de hiperpotasemia, sobre todo en ERC. Los suplementos de potasio y los sustitutos de sal con potasio deben evitarse en esta combinación; se vigilan potasio y creatinina.';
    v_j1 := $evfren_json${"external_id":"fren-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Ahorradores de potasio: espironolactona, eplerenona, amilorida y triamtereno","outcome":"Ahorradores de potasio: espironolactona, eplerenona, amilorida y triamtereno","source":"Fichas técnicas de espironolactona y enalapril."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u2-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es una combinación segura, porque el potasio extra compensa lo que elimina la espironolactona.', FALSE, 'La espironolactona retiene potasio, no lo elimina.', 0),
      (v_pregunta, 'Es segura si el paciente toma el suplemento en la noche y los demás en la mañana.', FALSE, 'El horario no cambia el riesgo.', 1),
      (v_pregunta, 'Hay un riesgo alto de hiperpotasemia: se propone retirar el suplemento y controlar potasio y creatinina.', TRUE, 'Correcto. Los calambres se estudian por otra vía.', 2),
      (v_pregunta, 'El único riesgo es la tos por el enalapril, porque los otros dos medicamentos no interactúan entre sí en absoluto.', FALSE, 'Hay una interacción grave sobre el potasio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fren-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Trastornos hidroelectrolíticos inducidos por fármacos y nefrotoxicidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Trastornos hidroelectrolíticos inducidos por fármacos y nefrotoxicidad) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Trastornos hidroelectrolíticos inducidos por fármacos y nefrotoxicidad';
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


    v_t3 := '¿Cuál de estos medicamentos puede elevar el potasio sérico?';
    v_t4 := 'Elevan el potasio: IECA/ARA-II, antagonistas mineralocorticoides, trimetoprim (efecto tipo amilorida), inhibidores de calcineurina, heparina y betabloqueadores. Lo reducen: diuréticos de asa y tiazidas, agonistas beta-2 e insulina.';
    v_j1 := $evfren_json${"external_id":"fren-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Hipopotasemia e hiperpotasemia inducidas por fármacos","outcome":"Hipopotasemia e hiperpotasemia inducidas por fármacos","source":"Fichas técnicas; farmacología de los trastornos del potasio."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u3-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El salbutamol inhalado a dosis altas, que introduce potasio en las células del músculo.', FALSE, 'Los agonistas beta-2 tienden a bajar el potasio.', 0),
      (v_pregunta, 'El trimetoprim-sulfametoxazol, que bloquea canales de sodio en el túbulo como la amilorida.', TRUE, 'Correcto. Es una causa frecuente de hiperpotasemia.', 1),
      (v_pregunta, 'La insulina, que aumenta la eliminación renal de potasio en las primeras horas.', FALSE, 'La insulina baja el potasio al introducirlo en las células.', 2),
      (v_pregunta, 'La hidroclorotiazida, que reduce de forma marcada la eliminación urinaria de potasio en el túbulo distal.', FALSE, 'Las tiazidas tienden a bajar el potasio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Por qué los aminoglucósidos como la gentamicina se dosifican hoy en intervalo extendido (una dosis al día) en muchos pacientes?';
    v_t4 := 'Los aminoglucósidos tienen actividad dependiente de la concentración y efecto posantibiótico; el intervalo extendido logra picos altos y valles bajos, con eficacia similar y menor nefrotoxicidad. Requieren ajuste por función renal y monitorización de niveles, y son nefrotóxicos y ototóxicos.';
    v_j1 := $evfren_json${"external_id":"fren-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Aminoglucósidos y vancomicina: nefrotoxicidad y monitorización terapéutica","outcome":"Aminoglucósidos y vancomicina: nefrotoxicidad y monitorización terapéutica","source":"Fichas técnicas de gentamicina y amikacina."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u3-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Porque su efecto depende del tiempo sobre la CMI y requieren concentraciones bajas y constantes todo el día.', FALSE, 'Su efecto depende de la concentración, no del tiempo.', 0),
      (v_pregunta, 'Porque se eliminan por el hígado y una sola dosis evita su acumulación en el riñón.', FALSE, 'Se eliminan por el riñón.', 1),
      (v_pregunta, 'Porque así no necesitan ningún ajuste por función renal ni monitorización de niveles.', FALSE, 'Siguen necesitando ajuste y monitorización.', 2),
      (v_pregunta, 'Porque su acción depende de la concentración y tienen efecto posantibiótico, con menor nefrotoxicidad.', TRUE, 'Correcto. Se monitorizan niveles y función renal.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer de 81 años que toma hidroclorotiazida inicia sertralina y dos semanas después está confundida; su sodio es de 122 mmol/L. ¿Qué análisis es correcto?';
    v_t4 := 'Causas farmacológicas de hiponatremia: tiazidas, ISRS e IRSN (secreción inadecuada de ADH), carbamazepina, oxcarbazepina y desmopresina, entre otros. El riesgo es mayor en mujeres mayores; la combinación de tiazida e ISRS suma riesgo.';
    v_j1 := $evfren_json${"external_id":"fren-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Hiponatremia y alteraciones del magnesio por medicamentos","outcome":"Hiponatremia y alteraciones del magnesio por medicamentos","source":"Fichas técnicas de hidroclorotiazida y sertralina."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u3-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es una hipernatremia por deshidratación y debe beber menos agua de inmediato.', FALSE, 'El sodio está bajo, no alto.', 0),
      (v_pregunta, 'Es un efecto esperado de la edad que no tiene relación con los medicamentos que toma.', FALSE, 'La relación temporal sugiere los medicamentos.', 1),
      (v_pregunta, 'Es una hiponatremia en la que pueden sumar la tiazida y el ISRS (secreción inadecuada de ADH).', TRUE, 'Correcto. Se remite y se revisan ambos fármacos.', 2),
      (v_pregunta, 'Es una hiperpotasemia por la sertralina que se corrige con un diurético de asa.', FALSE, 'Los datos muestran una alteración del sodio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un servicio de imágenes propone a todos los pacientes que reciben contraste yodado un protocolo de N-acetilcisteína oral y bicarbonato. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'Para prevenir la lesión renal asociada al contraste, las medidas con mejor respaldo son identificar a los pacientes de riesgo, la hidratación isotónica cuando está indicada y evitar nefrotóxicos concomitantes; la evidencia de la N-acetilcisteína y del bicarbonato es débil. La metformina se maneja según la ficha técnica.';
    v_j1 := $evfren_json${"external_id":"fren-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Contraste yodado y otras nefrotoxinas: prevención en la práctica","outcome":"Contraste yodado y otras nefrotoxinas: prevención en la práctica","source":"Recomendaciones de prevención de la lesión renal por contraste; ficha técnica de metformina."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u3-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Conviene revisarlo: las medidas con mejor respaldo son la hidratación isotónica en riesgo y evitar nefrotóxicos.', TRUE, 'Correcto. También se revisa la metformina.', 0),
      (v_pregunta, 'Es el protocolo con mejor evidencia y debe aplicarse sin excepciones a todos los pacientes.', FALSE, 'La evidencia de esas medidas es débil.', 1),
      (v_pregunta, 'Conviene reemplazarlo por un diurético de asa antes del contraste para «lavar» el riñón.', FALSE, 'El diurético puede empeorar el riesgo.', 2),
      (v_pregunta, 'Es innecesario cualquier cuidado, porque el contraste yodado no afecta nunca la función renal.', FALSE, 'Hay pacientes con riesgo real.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fren-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Farmacoterapia de la enfermedad renal crónica y de sus complicaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Farmacoterapia de la enfermedad renal crónica y de sus complicaciones) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Farmacoterapia de la enfermedad renal crónica y de sus complicaciones';
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


    v_t3 := '¿Qué dos criterios usa la clasificación KDIGO de la enfermedad renal crónica?';
    v_t4 := 'KDIGO clasifica la ERC por la tasa de filtración glomerular (G1 a G5) y la albuminuria (A1, menor de 30 mg/g; A2, 30-300; A3, más de 300), lo que define el riesgo de progresión y de eventos cardiovasculares.';
    v_j1 := $evfren_json${"external_id":"fren-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: clasificación KDIGO de la ERC (TFG y albuminuria) y pilares terapéuticos","outcome":"Introducción a la unidad: clasificación KDIGO de la ERC (TFG y albuminuria) y pilares terapéuticos","source":"KDIGO 2024."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u4-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'La creatinina sérica y la urea, medidas en la misma muestra de sangre.', FALSE, 'La clasificación usa la TFG estimada y la albuminuria.', 0),
      (v_pregunta, 'La presión arterial y la glucosa, porque son las causas más frecuentes de ERC.', FALSE, 'Son causas, no criterios de clasificación.', 1),
      (v_pregunta, 'La tasa de filtración glomerular (G1 a G5) y la albuminuria (A1 a A3).', TRUE, 'Correcto. Ambas definen el riesgo de progresión.', 2),
      (v_pregunta, 'El tamaño de los riñones en la ecografía y el número de quistes en cada riñón.', FALSE, 'La ecografía no define la clasificación KDIGO.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente que inicia patiromer para la hiperpotasemia toma levotiroxina a la misma hora. ¿Qué le indica el QF?';
    v_t4 := 'Los quelantes de potasio (patiromer, ciclosilicato de sodio y zirconio) permiten mantener el bloqueo del SRAA en pacientes con hiperpotasemia. El patiromer puede unirse a otros medicamentos orales; su ficha técnica pide separarlos al menos 3 horas.';
    v_j1 := $evfren_json${"external_id":"fren-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Hiperpotasemia crónica: patiromer y ciclosilicato de sodio y zirconio","outcome":"Hiperpotasemia crónica: patiromer y ciclosilicato de sodio y zirconio","source":"Ficha técnica de patiromer."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u4-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que separe el patiromer de los otros medicamentos orales al menos 3 horas, porque puede unirse a ellos.', TRUE, 'Correcto. Así se evita reducir su absorción.', 0),
      (v_pregunta, 'Que los tome juntos, porque el patiromer mejora la absorción de la levotiroxina en el intestino.', FALSE, 'Puede ocurrir lo contrario.', 1),
      (v_pregunta, 'Que suspenda la levotiroxina mientras use el patiromer para evitar cualquier interacción.', FALSE, 'No se suspende; se separan las tomas.', 2),
      (v_pregunta, 'Que tome el patiromer solo en ayunas y nunca con los alimentos para que funcione.', FALSE, 'La forma de toma depende de la ficha técnica; lo clave es separarlo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente en diálisis toma carbonato de calcio como quelante de fósforo solo al acostarse. Su fósforo sigue alto. ¿Qué análisis es correcto?';
    v_t4 := 'Los quelantes de fósforo se unen al fósforo de los alimentos en el intestino; deben tomarse con las comidas. Los quelantes cálcicos pueden causar hipercalcemia y favorecer la calcificación vascular; los no cálcicos (sevelamer) son alternativas. Interactúan con otros medicamentos orales.';
    v_j1 := $evfren_json${"external_id":"fren-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Trastorno mineral óseo: quelantes de fósforo, calcitriol/análogos y cinacalcet","outcome":"Trastorno mineral óseo: quelantes de fósforo, calcitriol/análogos y cinacalcet","source":"KDIGO de trastorno mineral óseo; fichas técnicas de los quelantes."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u4-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El carbonato de calcio no sirve como quelante de fósforo y debe cambiarse por un suplemento de vitamina D.', FALSE, 'Sí es un quelante; el problema es cómo se toma.', 0),
      (v_pregunta, 'Los quelantes actúan sobre el fósforo de la comida: deben tomarse con las comidas, no al acostarse.', TRUE, 'Correcto. Además se vigila el calcio.', 1),
      (v_pregunta, 'El fósforo alto se debe a una dosis baja y basta con duplicar la toma de la noche.', FALSE, 'Duplicar la toma nocturna no corrige el problema.', 2),
      (v_pregunta, 'Los quelantes deben tomarse en ayunas para que se absorban mejor en el intestino.', FALSE, 'Los quelantes no actúan por absorción.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con ERC sin diabetes, TFGe de 38 y albuminuria de 400 mg/g no recibe un iSGLT2 «porque no tiene diabetes». ¿Cuál es la mejor valoración?';
    v_t4 := 'KDIGO 2024 recomienda un iSGLT2 en muchos pacientes con ERC, con o sin diabetes, para reducir la progresión y los eventos cardiovasculares, además del bloqueo del SRAA a la dosis máxima tolerada y del control de la presión arterial.';
    v_j1 := $evfren_json${"external_id":"fren-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Bloqueo del SRAA, iSGLT2 y control de la presión arterial","outcome":"Bloqueo del SRAA, iSGLT2 y control de la presión arterial","source":"KDIGO 2024."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u4-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcta: los iSGLT2 solo se indican en personas con diabetes tipo 2.', FALSE, 'KDIGO los recomienda también en ERC sin diabetes.', 0),
      (v_pregunta, 'Es correcta si el paciente ya toma un ARA-II, porque no se pueden combinar con iSGLT2.', FALSE, 'Se combinan con frecuencia.', 1),
      (v_pregunta, 'Es errada solo porque los iSGLT2 bajan la glucosa en cualquier persona y eso protege el riñón.', FALSE, 'Su beneficio renal no depende de la glucosa.', 2),
      (v_pregunta, 'Es errada: KDIGO 2024 recomienda iSGLT2 en ERC con o sin diabetes para reducir la progresión.', TRUE, 'Correcto. Junto con IECA/ARA-II a dosis máxima tolerada.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fren-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Trasplante renal, infecciones urinarias y contexto colombiano de la ERC' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Trasplante renal, infecciones urinarias y contexto colombiano de la ERC) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Trasplante renal, infecciones urinarias y contexto colombiano de la ERC';
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


    v_t3 := '¿Por qué las formulaciones de tacrolimus no deben intercambiarse sin control?';
    v_t4 := 'El tacrolimus es un inhibidor de la calcineurina con margen terapéutico estrecho, gran variabilidad interindividual y metabolismo por CYP3A4/3A5 y glicoproteína P. Las formulaciones (liberación inmediata y prolongada) no son intercambiables sin supervisión y control de niveles valle.';
    v_j1 := $evfren_json${"external_id":"fren-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Inhibidores de calcineurina: tacrolimus y ciclosporina, monitorización de niveles","outcome":"Inhibidores de calcineurina: tacrolimus y ciclosporina, monitorización de niveles","source":"Ficha técnica de tacrolimus."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u5-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Porque todas las marcas tienen exactamente la misma absorción y cambiarlas no tiene ningún efecto.', FALSE, 'Si fueran idénticas no habría precaución.', 0),
      (v_pregunta, 'Porque el tacrolimus se elimina sin cambios por el riñón y cada marca tiene una vida media distinta.', FALSE, 'Se metaboliza en el hígado por el CYP3A4/3A5.', 1),
      (v_pregunta, 'Porque tiene un margen terapéutico estrecho y gran variabilidad: el cambio exige control de niveles valle.', TRUE, 'Correcto. Las de liberación inmediata y prolongada no son equivalentes.', 2),
      (v_pregunta, 'Porque las formulaciones solo difieren en el color de la cápsula y el paciente puede confundirse.', FALSE, 'La diferencia es farmacocinética, no estética.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un receptor de trasplante renal que toma tacrolimus recibe claritromicina para una infección respiratoria. ¿Qué propone el QF?';
    v_t4 := 'Los inhibidores del CYP3A4 (claritromicina, eritromicina, azoles) elevan las concentraciones de tacrolimus, con riesgo de nefrotoxicidad, neurotoxicidad e hiperpotasemia; los inductores (rifampicina) las reducen y aumentan el riesgo de rechazo. Se eligen alternativas con menos interacción y se monitorizan los niveles.';
    v_j1 := $evfren_json${"external_id":"fren-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso clínico: interacción claritromicina–tacrolimus en un receptor de trasplante renal","outcome":"Caso clínico: interacción claritromicina–tacrolimus en un receptor de trasplante renal","source":"Ficha técnica de tacrolimus."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u5-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Dispensar sin cambios, porque los macrólidos no interactúan con los inmunosupresores.', FALSE, 'Hay una interacción mayor.', 0),
      (v_pregunta, 'Duplicar el tacrolimus durante el antibiótico para evitar un rechazo por la infección.', FALSE, 'Ocurre lo contrario: los niveles subirán.', 1),
      (v_pregunta, 'Suspender el tacrolimus mientras dure el antibiótico para evitar la interacción.', FALSE, 'Suspenderlo expone al rechazo.', 2),
      (v_pregunta, 'Advertir que la claritromicina eleva mucho el tacrolimus; sugerir otro antibiótico y controlar niveles.', TRUE, 'Correcto. Hay riesgo de nefrotoxicidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer de 28 años con trasplante renal que toma micofenolato cuenta que quiere quedar embarazada este año. ¿Qué análisis es correcto?';
    v_t4 := 'El micofenolato es teratogénico (malformaciones y pérdidas gestacionales); exige anticoncepción eficaz y, si se desea un embarazo, el equipo de trasplante planea el cambio a un esquema compatible con anticipación. Los inhibidores de mTOR y los corticoides tienen sus propios riesgos.';
    v_j1 := $evfren_json${"external_id":"fren-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Micofenolato, inhibidores de mTOR y corticoides: seguridad y seguimiento","outcome":"Micofenolato, inhibidores de mTOR y corticoides: seguridad y seguimiento","source":"Ficha técnica de micofenolato."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u5-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El micofenolato es teratogénico: necesita anticoncepción eficaz y planear el embarazo con el equipo de trasplante.', TRUE, 'Correcto. El cambio de inmunosupresor se planea antes.', 0),
      (v_pregunta, 'El micofenolato es seguro en el embarazo y puede seguir igual sin ninguna consulta previa.', FALSE, 'Tiene un riesgo alto de malformaciones.', 1),
      (v_pregunta, 'Debe suspender todos los inmunosupresores en cuanto decida buscar el embarazo.', FALSE, 'Suspender todo expone al rechazo del injerto.', 2),
      (v_pregunta, 'El único riesgo del embarazo es la presión arterial, porque los inmunosupresores no afectan al feto.', FALSE, 'Algunos inmunosupresores sí afectan al feto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una mujer de 84 años con aclaramiento de creatinina de 22 mL/min recibe nitrofurantoína para una cistitis. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'La nitrofurantoína alcanza concentraciones urinarias adecuadas solo con función renal suficiente; con aclaramiento menor de 30 mL/min es menos eficaz y aumenta su toxicidad (neuropatía, toxicidad pulmonar). Los criterios de Beers recomiendan evitarla en esa situación. La elección empírica se basa en la resistencia local.';
    v_j1 := $evfren_json${"external_id":"fren-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Infecciones del tracto urinario: elección antimicrobiana y ajuste por función renal","outcome":"Infecciones del tracto urinario: elección antimicrobiana y ajuste por función renal","source":"Ficha técnica de nitrofurantoína; criterios de Beers 2023."}$evfren_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fren-u5-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es una elección adecuada, porque la nitrofurantoína no se afecta por la función renal.', FALSE, 'Su eficacia y su seguridad dependen de la función renal.', 0),
      (v_pregunta, 'Conviene evitarla: con aclaramiento menor de 30 es menos eficaz y más tóxica; se busca otra opción según la resistencia local.', TRUE, 'Correcto. Los criterios de Beers la desaconsejan en esa situación.', 1),
      (v_pregunta, 'Es adecuada si se duplica la dosis para compensar la menor eliminación por el riñón.', FALSE, 'Duplicar la dosis aumentaría la toxicidad.', 2),
      (v_pregunta, 'Conviene suspender cualquier antibiótico y tratar la cistitis solo con abundante agua.', FALSE, 'Una cistitis en una adulta mayor suele requerir tratamiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fren-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fisiología renal aplicada a los fármacos y estimación de la función renal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fisiología renal aplicada a los fármacos y estimación de la función renal) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Ajuste de dosis en un adulto mayor con ERC';
  v_t2 := $evfren_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Calcula el aclaramiento de creatinina con Cockcroft-Gault y compáralo con la TFGe.</li><li>Revisa la metformina según su función renal.</li><li>Revisa el rivaroxabán según la ficha técnica para su aclaramiento.</li><li>Revisa la gabapentina y su riesgo de acumulación.</li><li>Analiza la nitrofurantoína en su función renal y propone una alternativa.</li><li>Redacta la nota al médico con las dosis propuestas y la fuente de cada una.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Estimar la función renal con la ecuación adecuada.</li><li>Identificar los fármacos que requieren ajuste o evitarse.</li><li>Proponer dosis y alternativas según la ficha técnica.</li></ul>
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
  <tr><td>Estimación</td><td>20 %</td><td>Calcula Cockcroft-Gault (≈22 mL/min con el factor 0,85 de mujer) y explica la diferencia con la TFGe.</td><td>Calcula con un error menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Ajustes</td><td>40 %</td><td>Ajustes de metformina, rivaroxabán y gabapentina coherentes con sus fichas técnicas, citando la fuente.</td><td>Ajusta dos de los tres.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Nitrofurantoína</td><td>20 %</td><td>Reconoce que debe evitarse con aclaramiento menor de 30 y propone alternativa según epidemiología local.</td><td>Lo reconoce sin alternativa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Nota</td><td>10 %</td><td>Nota clara con dosis y fuente.</td><td>Nota sin fuentes.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfren_html$;
  v_t3 := $evfren_html$<h2>Caso de estudio</h2>
<p>Doña Inés tiene 82 años, pesa 52 kg y vive en Popayán (datos simulados). Tiene ERC con creatinina de 1,6 mg/dL y TFGe de 30 mL/min/1,73 m². Toma metformina 850 mg cada 12 horas, rivaroxabán 20 mg al día por fibrilación auricular, gabapentina 300 mg cada 8 horas por dolor neuropático y le acaban de formular nitrofurantoína por una cistitis.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfren_html$;
  v_t4 := 'Informe de ajuste de dosis con nota al médico.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfren_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías KDIGO de enfermedad renal crónica (2024), presión arterial (2021), anemia y trastorno mineral óseo; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (diuréticos, IECA/ARA-II, iSGLT2, finerenona, quelantes de fósforo y de potasio, aminoglucósidos, vancomicina, tacrolimus y micofenolato); criterios de Beers 2023; guía de manejo de la ERC del Ministerio de Salud e informes de la Cuenta de Alto Costo; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfren_html$;
  v_t7 := NULL;
  v_j1 := $evfren_json$["Estimación de la función renal.","Metformina.","Rivaroxabán.","Gabapentina.","Nitrofurantoína."]$evfren_json$::jsonb;
  v_j2 := $evfren_json${"version":1,"total":100,"criteria":[{"id":"estimacion","name":"Estimación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Calcula Cockcroft-Gault (≈22 mL/min con el factor 0,85 de mujer) y explica la diferencia con la TFGe."},{"level":3,"label":"Logrado","description":"Calcula con un error menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ajustes","name":"Ajustes","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Ajustes de metformina, rivaroxabán y gabapentina coherentes con sus fichas técnicas, citando la fuente."},{"level":3,"label":"Logrado","description":"Ajusta dos de los tres."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"nitrofurantoina","name":"Nitrofurantoína","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Reconoce que debe evitarse con aclaramiento menor de 30 y propone alternativa según epidemiología local."},{"level":3,"label":"Logrado","description":"Lo reconoce sin alternativa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"nota","name":"Nota","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Nota clara con dosis y fuente."},{"level":3,"label":"Logrado","description":"Nota sin fuentes."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfren_json$::jsonb;
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


  -- ── Actividad fren-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Diuréticos: farmacología y uso clínico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Diuréticos: farmacología y uso clínico) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Edema refractario e hipopotasemia en IC con ERC';
  v_t2 := $evfren_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Identifica las causas de la resistencia diurética en el caso.</li><li>Analiza la combinación de diurético de asa y tiazida y su efecto sobre el potasio y el magnesio.</li><li>Analiza el naproxeno y su efecto sobre la diuresis y la función renal.</li><li>Propone el ajuste del horario de la furosemida y la educación sobre la sal.</li><li>Propone el manejo de la hipopotasemia y la hipomagnesemia con el médico.</li><li>Diseña la monitorización de electrolitos, función renal y peso.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar las causas de la resistencia diurética.</li><li>Analizar las alteraciones de potasio y magnesio.</li><li>Proponer ajustes y un plan de monitorización.</li></ul>
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
  <tr><td>Resistencia diurética</td><td>30 %</td><td>Identifica AINE, sal, adherencia por el horario y ERC como causas.</td><td>Identifica dos causas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Electrolitos</td><td>25 %</td><td>Relaciona la hipopotasemia y la hipomagnesemia con el bloqueo secuencial y propone su manejo.</td><td>Manejo parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Ajustes y monitorización</td><td>35 %</td><td>Retira el AINE, ajusta horario, educa en sal y define controles de potasio, magnesio, creatinina y peso.</td><td>Plan incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfren_html$;
  v_t3 := $evfren_html$<h2>Caso de estudio</h2>
<p>Don Elías tiene 74 años, vive en Barranquilla y tiene insuficiencia cardiaca y ERC (TFGe 35) (datos simulados). Toma furosemida 40 mg cada 12 horas, hidroclorotiazida 25 mg, enalapril 10 mg cada 12 horas y compra naproxeno por dolor de rodilla. Sigue con edema en piernas, come sopas con caldo en cubo y su potasio es de 3,0 mmol/L con magnesio bajo. Toma la furosemida de la tarde a las 8 p. m. y se levanta varias veces a orinar, por eso a veces la omite.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfren_html$;
  v_t4 := 'Informe de análisis con propuestas y plan de monitorización.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfren_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías KDIGO de enfermedad renal crónica (2024), presión arterial (2021), anemia y trastorno mineral óseo; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (diuréticos, IECA/ARA-II, iSGLT2, finerenona, quelantes de fósforo y de potasio, aminoglucósidos, vancomicina, tacrolimus y micofenolato); criterios de Beers 2023; guía de manejo de la ERC del Ministerio de Salud e informes de la Cuenta de Alto Costo; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfren_html$;
  v_t7 := NULL;
  v_j1 := $evfren_json$["Causas de resistencia.","Potasio y magnesio.","AINE.","Horario y sal.","Monitorización."]$evfren_json$::jsonb;
  v_j2 := $evfren_json${"version":1,"total":100,"criteria":[{"id":"resistencia-diuretica","name":"Resistencia diurética","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Identifica AINE, sal, adherencia por el horario y ERC como causas."},{"level":3,"label":"Logrado","description":"Identifica dos causas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"electrolitos","name":"Electrolitos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Relaciona la hipopotasemia y la hipomagnesemia con el bloqueo secuencial y propone su manejo."},{"level":3,"label":"Logrado","description":"Manejo parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ajustes-y-monitorizacion","name":"Ajustes y monitorización","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Retira el AINE, ajusta horario, educa en sal y define controles de potasio, magnesio, creatinina y peso."},{"level":3,"label":"Logrado","description":"Plan incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfren_json$::jsonb;
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


  -- ── Actividad fren-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Farmacoterapia de la enfermedad renal crónica y de sus complicaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Farmacoterapia de la enfermedad renal crónica y de sus complicaciones) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Brechas de nefroprotección en diabetes con ERC';
  v_t2 := $evfren_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Clasifica la ERC con KDIGO y explica su riesgo.</li><li>Identifica las brechas de la terapia nefroprotectora (ARA-II, iSGLT2, finerenona, estatina, presión).</li><li>Ajusta la metformina y revisa la glibenclamida según su función renal.</li><li>Propone la secuencia de cambios y sus condiciones de inicio.</li><li>Diseña la monitorización de potasio, creatinina y presión.</li><li>Redacta la nota al médico.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar las brechas frente a KDIGO 2024.</li><li>Ajustar los antidiabéticos a la función renal.</li><li>Proponer un plan de nefroprotección y monitorización.</li></ul>
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
  <tr><td>Clasificación y brechas</td><td>30 %</td><td>Clasifica G3b A3 e identifica losartán a dosis baja, falta de iSGLT2, estatina y control de presión, y la opción de finerenona.</td><td>Identifica la mayoría de las brechas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Antidiabéticos</td><td>25 %</td><td>Reduce la metformina a máximo 1.000 mg/día y propone retirar la glibenclamida.</td><td>Ajusta uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan y monitorización</td><td>35 %</td><td>Secuencia segura con condiciones de inicio y controles de potasio y creatinina.</td><td>Plan sin condiciones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfren_html$;
  v_t3 := $evfren_html$<h2>Caso de estudio</h2>
<p>Don Rodrigo tiene 64 años, vive en Ibagué y tiene diabetes tipo 2 con ERC G3b A3 (TFGe 36; albuminuria 650 mg/g) (datos simulados). Toma losartán 25 mg al día, metformina 850 mg cada 8 horas, glibenclamida 5 mg al día y no recibe estatina. Potasio 4,6 mmol/L, presión 146/88 mmHg, LDL 140 mg/dL.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfren_html$;
  v_t4 := 'Informe de brechas con plan de nefroprotección.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfren_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías KDIGO de enfermedad renal crónica (2024), presión arterial (2021), anemia y trastorno mineral óseo; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (diuréticos, IECA/ARA-II, iSGLT2, finerenona, quelantes de fósforo y de potasio, aminoglucósidos, vancomicina, tacrolimus y micofenolato); criterios de Beers 2023; guía de manejo de la ERC del Ministerio de Salud e informes de la Cuenta de Alto Costo; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfren_html$;
  v_t7 := NULL;
  v_j1 := $evfren_json$["Clasificación.","Brechas de nefroprotección.","Antidiabéticos.","Secuencia y condiciones.","Monitorización."]$evfren_json$::jsonb;
  v_j2 := $evfren_json${"version":1,"total":100,"criteria":[{"id":"clasificacion-y-brechas","name":"Clasificación y brechas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Clasifica G3b A3 e identifica losartán a dosis baja, falta de iSGLT2, estatina y control de presión, y la opción de finerenona."},{"level":3,"label":"Logrado","description":"Identifica la mayoría de las brechas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"antidiabeticos","name":"Antidiabéticos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reduce la metformina a máximo 1.000 mg/día y propone retirar la glibenclamida."},{"level":3,"label":"Logrado","description":"Ajusta uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-y-monitorizacion","name":"Plan y monitorización","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Secuencia segura con condiciones de inicio y controles de potasio y creatinina."},{"level":3,"label":"Logrado","description":"Plan sin condiciones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfren_json$::jsonb;
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


  -- ── Actividad fren-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Trastornos hidroelectrolíticos inducidos por fármacos y nefrotoxicidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Trastornos hidroelectrolíticos inducidos por fármacos y nefrotoxicidad) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: función renal, diuréticos y nefrotóxicos de Don Isidro';
  v_t2 := $evfren_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y calcula el aclaramiento de creatinina con Cockcroft-Gault.</li><li>Fase 1: revisa cada medicamento que requiere ajuste o está contraindicado con su función renal.</li><li>Fase 2: analiza el esquema diurético con una TFGe de 22 y el papel de la tiazida.</li><li>Fase 3: identifica los nefrotóxicos y los fármacos que elevan el potasio, y propone qué hacer.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (función renal).</strong> Estimación de la función renal y fármacos que requieren ajuste.</li>
  <li><strong>Fase 2 · Unidad 2 (diuréticos).</strong> Revisión del esquema diurético y de los electrolitos.</li>
  <li><strong>Fase 3 · Unidad 3 (nefrotoxicidad).</strong> Nefrotóxicos, hiperpotasemia y prevención de la lesión aguda.</li>
  <li><strong>Fase 4 · Unidad 4 (complicaciones de la ERC).</strong> Nefroprotección, anemia y trastorno mineral óseo.</li>
  <li><strong>Fase 5 · Unidad 5 (diálisis y contexto).</strong> Ajustes para hemodiálisis, indicadores de la Cuenta de Alto Costo y seguimiento.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Estimar la función renal y revisar los fármacos que requieren ajuste.</li><li>Analizar diuréticos, electrolitos y nefrotóxicos.</li></ul>
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
  <tr><td>Estimación y ajustes</td><td>30 %</td><td>Calcula ≈24 mL/min y detecta la contraindicación de la metformina y el riesgo de la glibenclamida.</td><td>Calcula sin revisar todos los fármacos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Diuréticos</td><td>25 %</td><td>Analiza la menor eficacia de la tiazida sola en ERC avanzada y la vigilancia de electrolitos.</td><td>Análisis general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Nefrotóxicos y potasio</td><td>35 %</td><td>Retira el diclofenaco y analiza la hiperpotasemia con el IECA y las opciones para manejarla.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfren_html$;
  v_t3 := $evfren_html$<h2>Caso de estudio</h2>
<p>Don Isidro tiene 66 años, vive en Montería y tiene diabetes tipo 2, hipertensión y ERC G4 A3 (TFGe 22; albuminuria 900 mg/g) (datos simulados). Pesa 70 kg y su creatinina es de 3,0 mg/dL. Toma enalapril 5 mg al día, furosemida 40 mg, hidroclorotiazida 25 mg, metformina 850 mg cada 12 horas, glibenclamida, carbonato de calcio al acostarse y compra diclofenaco. Tiene anemia (hemoglobina 9,5 g/dL) y potasio de 5,4 mmol/L. Su nefrólogo prepara el inicio de hemodiálisis y la EPS lo asignó al programa de ERC donde tú eres el QF responsable. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfren_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfren_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías KDIGO de enfermedad renal crónica (2024), presión arterial (2021), anemia y trastorno mineral óseo; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (diuréticos, IECA/ARA-II, iSGLT2, finerenona, quelantes de fósforo y de potasio, aminoglucósidos, vancomicina, tacrolimus y micofenolato); criterios de Beers 2023; guía de manejo de la ERC del Ministerio de Salud e informes de la Cuenta de Alto Costo; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfren_html$;
  v_t7 := NULL;
  v_j1 := $evfren_json$["Estimación y ajustes.","Diuréticos.","Nefrotóxicos.","Potasio."]$evfren_json$::jsonb;
  v_j2 := $evfren_json${"version":1,"total":100,"criteria":[{"id":"estimacion-y-ajustes","name":"Estimación y ajustes","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Calcula ≈24 mL/min y detecta la contraindicación de la metformina y el riesgo de la glibenclamida."},{"level":3,"label":"Logrado","description":"Calcula sin revisar todos los fármacos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"diureticos","name":"Diuréticos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Analiza la menor eficacia de la tiazida sola en ERC avanzada y la vigilancia de electrolitos."},{"level":3,"label":"Logrado","description":"Análisis general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"nefrotoxicos-y-potasio","name":"Nefrotóxicos y potasio","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Retira el diclofenaco y analiza la hiperpotasemia con el IECA y las opciones para manejarla."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfren_json$::jsonb;
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


  -- ── Actividad fren-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Trasplante renal, infecciones urinarias y contexto colombiano de la ERC' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Trasplante renal, infecciones urinarias y contexto colombiano de la ERC) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan integral de Don Isidro antes y durante la hemodiálisis';
  v_t2 := $evfren_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: propone el manejo de la anemia (hierro, estimulantes de la eritropoyesis) y del fósforo (quelantes con las comidas).</li><li>Fase 5: explica qué factores determinan si un fármaco se dializa y cómo ajustarías los horarios respecto a la sesión.</li><li>Fase 5: relaciona tu intervención con indicadores de la Cuenta de Alto Costo y define el seguimiento.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (función renal).</strong> Estimación de la función renal y fármacos que requieren ajuste.</li>
  <li><strong>Fase 2 · Unidad 2 (diuréticos).</strong> Revisión del esquema diurético y de los electrolitos.</li>
  <li><strong>Fase 3 · Unidad 3 (nefrotoxicidad).</strong> Nefrotóxicos, hiperpotasemia y prevención de la lesión aguda.</li>
  <li><strong>Fase 4 · Unidad 4 (complicaciones de la ERC).</strong> Nefroprotección, anemia y trastorno mineral óseo.</li>
  <li><strong>Fase 5 · Unidad 5 (diálisis y contexto).</strong> Ajustes para hemodiálisis, indicadores de la Cuenta de Alto Costo y seguimiento.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar el manejo de las complicaciones de la ERC.</li><li>Planear los ajustes para hemodiálisis y los indicadores del programa.</li></ul>
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
  <tr><td>Anemia y fósforo</td><td>25 %</td><td>Hierro antes de estimulantes, metas según la guía y quelantes con las comidas.</td><td>Manejo parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Hemodiálisis</td><td>25 %</td><td>Dializabilidad (peso molecular, unión a proteínas, volumen de distribución) y horarios respecto a la sesión.</td><td>Explicación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores y seguimiento</td><td>25 %</td><td>Indicadores de la CAC relacionados y seguimiento con frecuencia.</td><td>Indicadores generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfren_html$;
  v_t3 := $evfren_html$<h2>Caso de estudio</h2>
<p>Don Isidro tiene 66 años, vive en Montería y tiene diabetes tipo 2, hipertensión y ERC G4 A3 (TFGe 22; albuminuria 900 mg/g) (datos simulados). Pesa 70 kg y su creatinina es de 3,0 mg/dL. Toma enalapril 5 mg al día, furosemida 40 mg, hidroclorotiazida 25 mg, metformina 850 mg cada 12 horas, glibenclamida, carbonato de calcio al acostarse y compra diclofenaco. Tiene anemia (hemoglobina 9,5 g/dL) y potasio de 5,4 mmol/L. Su nefrólogo prepara el inicio de hemodiálisis y la EPS lo asignó al programa de ERC donde tú eres el QF responsable. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité del programa de ERC.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfren_html$;
  v_t4 := 'Plan integral con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfren_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías KDIGO de enfermedad renal crónica (2024), presión arterial (2021), anemia y trastorno mineral óseo; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (diuréticos, IECA/ARA-II, iSGLT2, finerenona, quelantes de fósforo y de potasio, aminoglucósidos, vancomicina, tacrolimus y micofenolato); criterios de Beers 2023; guía de manejo de la ERC del Ministerio de Salud e informes de la Cuenta de Alto Costo; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfren_html$;
  v_t7 := NULL;
  v_j1 := $evfren_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Anemia y fósforo.","Hemodiálisis.","Indicadores y seguimiento.","Resumen ejecutivo."]$evfren_json$::jsonb;
  v_j2 := $evfren_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"anemia-y-fosforo","name":"Anemia y fósforo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Hierro antes de estimulantes, metas según la guía y quelantes con las comidas."},{"level":3,"label":"Logrado","description":"Manejo parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"hemodialisis","name":"Hemodiálisis","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Dializabilidad (peso molecular, unión a proteínas, volumen de distribución) y horarios respecto a la sesión."},{"level":3,"label":"Logrado","description":"Explicación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores-y-seguimiento","name":"Indicadores y seguimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Indicadores de la CAC relacionados y seguimiento con frecuencia."},{"level":3,"label":"Logrado","description":"Indicadores generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfren_json$::jsonb;
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


  -- ── Foro fren-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con pacientes renales';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfren_html$<h2>Para empezar</h2>
<p>Piensa en una persona con enfermedad renal que hayas atendido o acompañado y cuéntanos en tres o cuatro líneas una dificultad que tuvo con sus medicamentos, sin nombres ni datos que la identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfren_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre medicamentos y riñón te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfren_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfren_html$;
  v_t6 := $evfren_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfren_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Calculas el aclaramiento de creatinina antes de dispensar algún medicamento?', '¿Qué medicamento de venta libre te preocupa más en pacientes renales?']::text[];
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


  -- ── Foro fren-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fisiología renal aplicada a los fármacos y estimación de la función renal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fisiología renal aplicada a los fármacos y estimación de la función renal) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Cockcroft-Gault o CKD-EPI para dosificar?';
  v_t2 := 'Argumentar qué estimación de la función renal usar para ajustar dosis y cuándo pedir otra medida.';
  v_t3 := $evfren_html$<h2>Caso del foro</h2>
<p>En un hospital, el laboratorio solo reporta la TFGe por CKD-EPI (datos simulados). Un QF ajusta los antibióticos con ese valor; otro calcula siempre Cockcroft-Gault con el peso real. Con una paciente de 90 años y 40 kg obtienen dosis distintas de un aminoglucósido; con un paciente obeso de 130 kg, también.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfren_html$;
  v_t4 := '¿Qué estimación usarías en cada paciente y qué criterio propondrías para el protocolo del hospital?';
  v_t5 := $evfren_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación de KDIGO que sustenta tu criterio. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfren_html$;
  v_t6 := $evfren_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación de KDIGO que sustenta tu criterio.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfren_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué estimación usan las fichas técnicas de la mayoría de fármacos?', '¿Qué peso usarías en Cockcroft-Gault en una persona obesa?', '¿Cuándo sería útil la cistatina C o una medición directa?']::text[];
  v_j1 := $evfren_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación de KDIGO que sustenta tu criterio."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfren_json$::jsonb;
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


  -- ── Foro fren-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Diuréticos: farmacología y uso clínico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Diuréticos: farmacología y uso clínico) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Diuréticos en verano y con diarrea';
  v_t2 := 'Argumentar qué deben hacer los pacientes con diuréticos y bloqueadores del SRAA cuando se deshidratan.';
  v_t3 := $evfren_html$<h2>Caso del foro</h2>
<p>Durante una ola de calor, un programa de crónicos recibe varios adultos mayores con mareo, caídas y creatinina elevada (datos simulados). Todos toman diuréticos, varios también IECA o ARA-II y metformina, y algunos tuvieron diarrea esos días sin dejar de tomar nada.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfren_html$;
  v_t4 := '¿Qué reglas de «días de enfermedad» enseñarías y cómo evitarías que se conviertan en suspensiones innecesarias?';
  v_t5 := $evfren_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación que sustenta cada regla. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfren_html$;
  v_t6 := $evfren_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada regla.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfren_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué medicamentos se suspenden temporalmente en la deshidratación y por qué?', '¿Cuándo deben reiniciarse?', '¿Qué riesgos tiene una regla mal entendida?']::text[];
  v_j1 := $evfren_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada regla."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfren_json$::jsonb;
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


  -- ── Foro fren-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Trastornos hidroelectrolíticos inducidos por fármacos y nefrotoxicidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Trastornos hidroelectrolíticos inducidos por fármacos y nefrotoxicidad) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · La «triple amenaza» en la droguería';
  v_t2 := 'Argumentar cómo prevenir la lesión renal por AINE en personas con bloqueadores del SRAA y diuréticos.';
  v_t3 := $evfren_html$<h2>Caso del foro</h2>
<p>Una cadena de droguerías revisa sus ventas y encuentra que muchos clientes con fórmulas crónicas de losartán e hidroclorotiazida compran ibuprofeno o naproxeno sin fórmula varias veces al mes (datos simulados). Los vendedores no preguntan qué otros medicamentos toman.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfren_html$;
  v_t4 := '¿Qué intervención propondrías en el punto de venta para prevenir la «triple amenaza»?';
  v_t5 := $evfren_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación que sustenta tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfren_html$;
  v_t6 := $evfren_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfren_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Cuál es el mecanismo hemodinámico de la lesión renal en esta combinación?', '¿Quiénes tienen más riesgo?', '¿Qué alternativas analgésicas ofrecerías?']::text[];
  v_j1 := $evfren_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfren_json$::jsonb;
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


  -- ── Foro fren-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Farmacoterapia de la enfermedad renal crónica y de sus complicaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Farmacoterapia de la enfermedad renal crónica y de sus complicaciones) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Nefroprotección que no llega';
  v_t2 := 'Argumentar por qué muchos pacientes con ERC no reciben la terapia nefroprotectora y qué puede hacer el QF.';
  v_t3 := $evfren_html$<h2>Caso del foro</h2>
<p>En un programa de ERC, de 500 pacientes con albuminuria (datos simulados): el 60 % recibe IECA o ARA-II a dosis bajas, solo el 15 % recibe un iSGLT2 y casi ninguno finerenona aunque varios tienen diabetes y albuminuria persistente. Los médicos temen la hiperpotasemia y el aumento de la creatinina.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfren_html$;
  v_t4 := '¿Qué barreras identificas y qué intervenciones propondrías al equipo?';
  v_t5 := $evfren_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de KDIGO o la ficha técnica que sustenta cada intervención. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfren_html$;
  v_t6 := $evfren_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de KDIGO o la ficha técnica que sustenta cada intervención.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfren_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué aumento de la creatinina es esperable al iniciar estos fármacos?', '¿Cómo se maneja la hiperpotasemia sin retirar el bloqueo del SRAA?', '¿Qué criterios de uso tiene la finerenona?']::text[];
  v_j1 := $evfren_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de KDIGO o la ficha técnica que sustenta cada intervención."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfren_json$::jsonb;
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


  -- ── Foro fren-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Trasplante renal, infecciones urinarias y contexto colombiano de la ERC' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Trasplante renal, infecciones urinarias y contexto colombiano de la ERC) en Farmacología Renal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Tacrolimus: cambios de producto y adherencia';
  v_t2 := 'Argumentar cómo proteger el injerto ante cambios de producto, interacciones y fallas de adherencia.';
  v_t3 := $evfren_html$<h2>Caso del foro</h2>
<p>Un programa de trasplante renal encuentra (datos simulados): un paciente al que le cambiaron el tacrolimus de liberación inmediata por uno de liberación prolongada «a la misma dosis» sin avisar; otra que toma jugo de toronja todas las mañanas; y un joven que omite la dosis de la noche cuando sale con amigos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfren_html$;
  v_t4 := '¿Qué riesgos tiene cada situación y qué haría el servicio farmacéutico?';
  v_t5 := $evfren_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfren_html$;
  v_t6 := $evfren_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfren_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué un cambio de formulación exige control de niveles?', '¿Qué alimentos y medicamentos alteran los niveles del tacrolimus?', '¿Qué estrategias de adherencia funcionan en adultos jóvenes?']::text[];
  v_j1 := $evfren_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfren_json$::jsonb;
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


  RAISE NOTICE 'Farmacología Renal: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfren$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Farmacología de Anticoagulantes y Antiagregantes
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfant$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacología de Anticoagulantes y Antiagregantes' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacología de Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos de la hemostasia y monitorización de la coagulación', 'Unidad 2. Antiagregantes plaquetarios', 'Unidad 3. Anticoagulantes parenterales y antagonistas de la vitamina K', 'Unidad 4. Anticoagulantes orales directos e indicaciones clínicas', 'Unidad 5. Perioperatorio, reversión y atención farmacéutica en anticoagulación']::text[])) < 5 THEN
    RAISE NOTICE 'Anticoagulantes y Antiagregantes: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfant_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfant_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fant-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la hemostasia y monitorización de la coagulación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la hemostasia y monitorización de la coagulación) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos de la hemostasia y monitorización de la coagulación';
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


    v_t3 := '¿Qué prueba se usa de rutina para monitorizar la warfarina?';
    v_t4 := 'El tiempo de protrombina, expresado como INR, es la prueba estándar para la warfarina. El aPTT se usa con la heparina no fraccionada; la actividad anti-Xa, con HBPM en poblaciones especiales y, calibrada, con algunos ACOD. El INR y el aPTT no miden de forma confiable el efecto de los ACOD.';
    v_j1 := $evfant_json${"external_id":"fant-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"TP/INR, aPTT, anti-Xa y pruebas específicas para ACOD","outcome":"TP/INR, aPTT, anti-Xa y pruebas específicas para ACOD","source":"Fichas técnicas de warfarina y heparinas."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u1-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El aPTT, que es la prueba estándar para todos los anticoagulantes orales disponibles.', FALSE, 'El aPTT se usa con la heparina no fraccionada.', 0),
      (v_pregunta, 'El INR, derivado del tiempo de protrombina.', TRUE, 'Correcto. Su rango depende de la indicación.', 1),
      (v_pregunta, 'La actividad anti-Xa, que es la única prueba confiable para los antagonistas de vitamina K.', FALSE, 'La anti-Xa se usa en otros escenarios, como HBPM.', 2),
      (v_pregunta, 'El recuento de plaquetas, que refleja el efecto anticoagulante de la warfarina cada semana.', FALSE, 'Las plaquetas no miden el efecto de la warfarina.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una mujer de 78 años llega a urgencias tras una caída con un hematoma en la frente. Toma «un anticoagulante» que no saben nombrar. Su INR es 1,4 y el aPTT normal. El médico pregunta si «está bien anticoagulada». ¿Qué aporta el QF?';
    v_t4 := 'Con los ACOD el INR y el aPTT pueden ser normales o poco alterados aunque haya efecto anticoagulante. El QF ayuda a identificar el medicamento (conciliación con la familia, registros de dispensación), la hora de la última dosis y la función renal, que determinan el efecto residual.';
    v_j1 := $evfant_json${"external_id":"fant-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso: paciente anticoagulado en urgencias con pruebas de coagulación casi normales","outcome":"Caso: paciente anticoagulado en urgencias con pruebas de coagulación casi normales","source":"Fichas técnicas de los ACOD."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u1-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que no está anticoagulada, porque con un INR de 1,4 y un aPTT normal no hay ningún efecto.', FALSE, 'Esas pruebas pueden ser casi normales con un ACOD.', 0),
      (v_pregunta, 'Que está sobreanticoagulada, porque cualquier INR mayor de 1 indica riesgo alto de sangrado.', FALSE, 'Un INR de 1,4 no indica sobreanticoagulación con warfarina.', 1),
      (v_pregunta, 'Que basta con repetir el INR en una semana para saber qué anticoagulante usa la paciente.', FALSE, 'Se necesita la información ahora, no en una semana.', 2),
      (v_pregunta, 'Que pruebas casi normales no descartan un ACOD: hay que identificar el fármaco, la última dosis y la función renal.', TRUE, 'Correcto. Con esos datos se decide el manejo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Por qué el efecto antiagregante del ácido acetilsalicílico dura varios días después de suspenderlo?';
    v_t4 := 'El ácido acetilsalicílico acetila de forma irreversible la COX-1 plaquetaria e impide la síntesis de tromboxano A2. Como las plaquetas no tienen núcleo, no producen nueva enzima: el efecto dura el tiempo de vida de la plaqueta (unos 7 a 10 días).';
    v_j1 := $evfant_json${"external_id":"fant-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Hemostasia primaria: activación y agregación plaquetaria","outcome":"Hemostasia primaria: activación y agregación plaquetaria","source":"Ficha técnica de ácido acetilsalicílico."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u1-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Porque inhibe de forma irreversible la COX-1 de las plaquetas, que no pueden sintetizar nueva enzima.', TRUE, 'Correcto. El efecto dura lo que viven las plaquetas.', 0),
      (v_pregunta, 'Porque se acumula en el tejido graso y se libera lentamente durante varias semanas.', FALSE, 'No es la explicación de su efecto prolongado.', 1),
      (v_pregunta, 'Porque tiene una vida media plasmática de más de una semana en la mayoría de personas.', FALSE, 'Su vida media plasmática es corta.', 2),
      (v_pregunta, 'Porque bloquea de forma reversible el receptor P2Y12 hasta que se elimina por el riñón.', FALSE, 'Ese mecanismo corresponde a otros antiagregantes.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un familiar dice que la heparina que recibe su papá «disuelve el coágulo que tiene en la pierna». ¿Cuál es la mejor explicación del QF?';
    v_t4 := 'La heparina potencia la antitrombina, que inactiva la trombina (IIa) y el factor Xa; así impide la formación y extensión del coágulo. No lo disuelve: eso lo hacen la fibrinólisis del propio organismo o los fármacos fibrinolíticos.';
    v_j1 := $evfant_json${"external_id":"fant-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Modelo celular de la coagulación: iniciación, amplificación, propagación y terminación","outcome":"Modelo celular de la coagulación: iniciación, amplificación, propagación y terminación","source":"Fichas técnicas de heparina y enoxaparina."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u1-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcto: la heparina destruye la fibrina del coágulo en pocas horas después de aplicarla.', FALSE, 'Esa es la acción de los fibrinolíticos.', 0),
      (v_pregunta, 'Es correcto si se aplica en la misma pierna donde está el coágulo, para que actúe directamente sobre él.', FALSE, 'La vía y el sitio no le dan efecto fibrinolítico.', 1),
      (v_pregunta, 'La heparina potencia la antitrombina e impide que el coágulo crezca; el cuerpo lo va disolviendo.', TRUE, 'Correcto. No es un fibrinolítico.', 2),
      (v_pregunta, 'La heparina no hace nada sobre la coagulación y solo se usa para aliviar el dolor de la pierna.', FALSE, 'Sí es un anticoagulante eficaz.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fant-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antiagregantes plaquetarios' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antiagregantes plaquetarios) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Antiagregantes plaquetarios';
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


    v_t3 := '¿Qué inhibidor P2Y12 está contraindicado en personas con antecedente de ataque cerebrovascular o isquemia transitoria?';
    v_t4 := 'El clopidogrel es un profármaco activado por el CYP2C19; el prasugrel también es profármaco y está contraindicado con antecedente de ataque cerebrovascular o isquemia transitoria por el riesgo de sangrado intracraneal; el ticagrelor actúa directamente, es reversible y puede causar disnea.';
    v_j1 := $evfant_json${"external_id":"fant-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Inhibidores P2Y12: clopidogrel, prasugrel y ticagrelor","outcome":"Inhibidores P2Y12: clopidogrel, prasugrel y ticagrelor","source":"Fichas técnicas de clopidogrel, prasugrel y ticagrelor."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u2-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El clopidogrel, porque es un profármaco que se activa en el cerebro y aumenta el sangrado.', FALSE, 'El clopidogrel no tiene esa contraindicación.', 0),
      (v_pregunta, 'El ticagrelor, porque produce disnea en los pacientes que tuvieron un ataque cerebrovascular.', FALSE, 'La disnea es un efecto adverso, no esa contraindicación.', 1),
      (v_pregunta, 'El prasugrel, por mayor riesgo de sangrado intracraneal.', TRUE, 'Correcto. Está en su ficha técnica.', 2),
      (v_pregunta, 'El ácido acetilsalicílico, porque no es eficaz en la prevención secundaria del ataque cerebrovascular.', FALSE, 'No es un inhibidor P2Y12 y sí se usa en prevención.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente que toma ácido acetilsalicílico 100 mg en la mañana por un stent empieza a tomar ibuprofeno antes del desayuno por dolor de espalda. ¿Qué le indica el QF?';
    v_t4 := 'El ibuprofeno puede ocupar de forma reversible el sitio de la COX-1 y evitar la acetilación por el ácido acetilsalicílico, reduciendo su efecto antiagregante si se toma antes; además suma riesgo de sangrado gastrointestinal. Se prefiere otro analgésico, como el acetaminofén.';
    v_j1 := $evfant_json${"external_id":"fant-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Ácido acetilsalicílico, cilostazol y dipiridamol","outcome":"Ácido acetilsalicílico, cilostazol y dipiridamol","source":"Fichas técnicas de ácido acetilsalicílico e ibuprofeno."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u2-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que el ibuprofeno tomado antes puede bloquear el efecto antiagregante de la aspirina; se busca otro analgésico.', TRUE, 'Correcto. Además suma riesgo gástrico.', 0),
      (v_pregunta, 'Que el ibuprofeno potencia el efecto de la aspirina y protege todavía más el stent coronario.', FALSE, 'Ocurre lo contrario.', 1),
      (v_pregunta, 'Que suspenda la aspirina mientras toma el ibuprofeno, porque los dos hacen exactamente lo mismo.', FALSE, 'Nunca se suspende la aspirina por cuenta propia tras un stent.', 2),
      (v_pregunta, 'Que no hay interacción, porque el ibuprofeno actúa solo sobre el dolor y no sobre las plaquetas.', FALSE, 'El ibuprofeno compite por el sitio de la COX-1.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre al que le pusieron un stent medicado hace un mes dejó el clopidogrel hace cinco días porque la EPS no se lo entregó. ¿Qué análisis hace el QF?';
    v_t4 := 'La interrupción prematura de la doble antiagregación tras un stent, sobre todo en los primeros meses, aumenta mucho el riesgo de trombosis del stent, infarto y muerte. La falta de acceso es una urgencia: se gestiona la entrega y se informa al cardiólogo.';
    v_j1 := $evfant_json${"external_id":"fant-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso: interrupción de DAPT e interacción clopidogrel–omeprazol","outcome":"Caso: interrupción de DAPT e interacción clopidogrel–omeprazol","source":"Guía ESC 2023 de síndrome coronario agudo; ficha técnica de clopidogrel."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u2-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No hay ningún riesgo, porque el ácido acetilsalicílico protege el stent por sí solo en todos los casos y en cualquier momento.', FALSE, 'Sin la doble antiagregación el riesgo es alto al inicio.', 0),
      (v_pregunta, 'Puede esperar a la próxima cita de control en dos meses para reiniciarlo sin problema.', FALSE, 'La demora aumenta el riesgo de trombosis.', 1),
      (v_pregunta, 'Puede reemplazarlo por ibuprofeno, que también inhibe las plaquetas de forma eficaz.', FALSE, 'El ibuprofeno no reemplaza a un inhibidor P2Y12.', 2),
      (v_pregunta, 'Tiene riesgo alto de trombosis del stent: se gestiona la entrega de inmediato y se comunica al cardiólogo.', TRUE, 'Correcto. Es una urgencia de acceso.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una paciente con insuficiencia cardiaca recibe una fórmula de cilostazol para la claudicación. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'El cilostazol es un inhibidor de la fosfodiesterasa 3 que se usa en la claudicación intermitente; está contraindicado en la insuficiencia cardiaca, por el aumento de mortalidad observado con otros inhibidores de la PDE3 en esa población.';
    v_j1 := $evfant_json${"external_id":"fant-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Ácido acetilsalicílico, cilostazol y dipiridamol","outcome":"Ácido acetilsalicílico, cilostazol y dipiridamol","source":"Ficha técnica de cilostazol."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u2-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es adecuada, porque el cilostazol mejora la circulación de las piernas y del corazón a la vez.', FALSE, 'Su efecto en el corazón es justamente el problema.', 0),
      (v_pregunta, 'Es inadecuada: el cilostazol está contraindicado en la insuficiencia cardiaca; se comunica al médico.', TRUE, 'Correcto. Es un inhibidor de la fosfodiesterasa 3.', 1),
      (v_pregunta, 'Es adecuada si se toma con las comidas para reducir sus efectos sobre el ritmo cardiaco.', FALSE, 'Tomarlo con comida no elimina la contraindicación.', 2),
      (v_pregunta, 'Es inadecuada solo porque el cilostazol debe combinarse siempre con clopidogrel para funcionar.', FALSE, 'El problema es la contraindicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fant-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Anticoagulantes parenterales y antagonistas de la vitamina K' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Anticoagulantes parenterales y antagonistas de la vitamina K) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Anticoagulantes parenterales y antagonistas de la vitamina K';
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


    v_t3 := '¿Qué fármaco revierte la heparina no fraccionada?';
    v_t4 := 'La protamina neutraliza la heparina no fraccionada por completo y las heparinas de bajo peso molecular solo de forma parcial. La vitamina K revierte la warfarina; el idarucizumab, el dabigatrán; y el andexanet alfa, los inhibidores del factor Xa.';
    v_j1 := $evfant_json${"external_id":"fant-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Heparina no fraccionada: mecanismo, nomogramas por aPTT y protamina","outcome":"Heparina no fraccionada: mecanismo, nomogramas por aPTT y protamina","source":"Fichas técnicas de protamina, heparina y enoxaparina."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u3-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'La protamina, que la neutraliza por completo; con las HBPM el efecto es parcial.', TRUE, 'Correcto. Se dosifica según la heparina reciente.', 0),
      (v_pregunta, 'La vitamina K intravenosa, que restaura los factores que inactiva la heparina.', FALSE, 'La vitamina K revierte la warfarina, no la heparina.', 1),
      (v_pregunta, 'El idarucizumab, que se une a la heparina y la elimina por el riñón en pocos minutos.', FALSE, 'El idarucizumab revierte el dabigatrán.', 2),
      (v_pregunta, 'El ácido tranexámico, que inactiva la antitrombina potenciada por la heparina.', FALSE, 'No es un antídoto de la heparina.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Al séptimo día de recibir heparina, las plaquetas de un paciente bajan de 250.000 a 90.000 y aparece una trombosis venosa. ¿Qué propone el QF?';
    v_t4 := 'La trombocitopenia inducida por heparina aparece típicamente 5 a 10 días después de iniciarla, con caída de las plaquetas mayor del 50 % y trombosis. Se evalúa con la escala 4T, se suspende toda heparina (incluidos lavados de catéter) y se usa un anticoagulante no heparínico; la warfarina no se inicia en la fase aguda.';
    v_j1 := $evfant_json${"external_id":"fant-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Trombocitopenia inducida por heparina (TIH)","outcome":"Trombocitopenia inducida por heparina (TIH)","source":"Fichas técnicas de heparina; recomendaciones ACCP/CHEST."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u3-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Continuar la heparina y transfundir plaquetas para recuperar el recuento cuanto antes.', FALSE, 'Las transfusiones pueden empeorar la trombosis en este cuadro.', 0),
      (v_pregunta, 'Cambiar a enoxaparina, porque las heparinas de bajo peso molecular no causan nunca este problema.', FALSE, 'Las HBPM también pueden causarla.', 1),
      (v_pregunta, 'Suspender toda heparina, incluidas las de las líneas, y usar un anticoagulante no heparínico.', TRUE, 'Correcto. Sospecha de trombocitopenia inducida por heparina.', 2),
      (v_pregunta, 'Iniciar warfarina de inmediato a dosis alta para tratar la nueva trombosis cuanto antes.', FALSE, 'La warfarina no se inicia en la fase aguda de este cuadro.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una paciente con warfarina e INR estable recibe trimetoprim-sulfametoxazol por una infección urinaria. A los 5 días su INR es 6,2. ¿Qué análisis es correcto?';
    v_t4 := 'La warfarina se metaboliza sobre todo por el CYP2C9. El sulfametoxazol lo inhibe y aumenta el INR; otros antibióticos y antifúngicos (metronidazol, fluconazol) tienen el mismo efecto. Se prefiere un antibiótico sin esta interacción o se controla el INR de cerca.';
    v_j1 := $evfant_json${"external_id":"fant-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Interacciones de la warfarina con medicamentos, alimentos y productos naturales","outcome":"Interacciones de la warfarina con medicamentos, alimentos y productos naturales","source":"Ficha técnica de warfarina."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u3-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El antibiótico aceleró la eliminación de la warfarina y por eso el INR aumentó tanto.', FALSE, 'Ocurre lo contrario.', 0),
      (v_pregunta, 'El sulfametoxazol inhibe el CYP2C9 y desplaza a la warfarina, por eso subió el INR.', TRUE, 'Correcto. Es una interacción mayor.', 1),
      (v_pregunta, 'El INR subió por la infección y no tiene ninguna relación con el antibiótico.', FALSE, 'La relación temporal y el mecanismo apuntan al antibiótico.', 2),
      (v_pregunta, 'El aumento del INR se debe a que la paciente comió más verduras verdes esa semana.', FALSE, 'Las verduras con vitamina K bajarían el INR.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para la paciente con INR de 6,2 sin sangrado, el equipo propone administrar complejo de protrombina «para normalizar rápido». ¿Cuál es la mejor valoración?';
    v_t4 := 'Según ACCP/CHEST, con INR elevado sin sangrado se omiten una o más dosis, se controla el INR y se busca la causa; la vitamina K oral a dosis baja se considera con INR muy elevado. El complejo de protrombina se reserva para sangrados graves o que amenazan la vida, junto con vitamina K intravenosa.';
    v_j1 := $evfant_json${"external_id":"fant-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Manejo del INR fuera de rango y del sangrado con warfarina","outcome":"Manejo del INR fuera de rango y del sangrado con warfarina","source":"Recomendaciones ACCP/CHEST; ficha técnica de warfarina."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u3-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es la conducta indicada: cualquier INR por encima del rango exige complejo de protrombina.', FALSE, 'El complejo de protrombina se reserva para sangrados graves.', 0),
      (v_pregunta, 'Es correcta si además se suspende la warfarina de forma definitiva por el riesgo.', FALSE, 'La paciente necesita seguir anticoagulada.', 1),
      (v_pregunta, 'Conviene duplicar la dosis de warfarina, porque un INR alto indica que la paciente desarrolló resistencia.', FALSE, 'Un INR alto indica exceso de efecto.', 2),
      (v_pregunta, 'Sin sangrado se omiten dosis, se controla el INR y se busca la causa; el complejo de protrombina se reserva para sangrados graves.', TRUE, 'Correcto. La vitamina K oral se valora según el INR y el riesgo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fant-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Anticoagulantes orales directos e indicaciones clínicas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Anticoagulantes orales directos e indicaciones clínicas) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Anticoagulantes orales directos e indicaciones clínicas';
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


    v_t3 := '¿Cuál de estos anticoagulantes orales directos debe tomarse con alimentos a sus dosis de 15 y 20 mg?';
    v_t4 := 'El dabigatrán es un inhibidor directo de la trombina; rivaroxabán, apixabán y edoxabán inhiben el factor Xa. El rivaroxabán de 15 y 20 mg se toma con alimentos porque aumentan su absorción; apixabán, edoxabán y dabigatrán se toman con o sin comida.';
    v_j1 := $evfant_json${"external_id":"fant-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Dabigatrán, rivaroxabán, apixabán y edoxabán: farmacología comparada","outcome":"Dabigatrán, rivaroxabán, apixabán y edoxabán: farmacología comparada","source":"Fichas técnicas de los ACOD."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u4-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El dabigatrán, porque es un inhibidor directo de la trombina que no se absorbe sin grasa.', FALSE, 'El dabigatrán no requiere tomarse con comida.', 0),
      (v_pregunta, 'El apixabán, porque su absorción aumenta mucho con las comidas abundantes.', FALSE, 'El apixabán se toma con o sin comida.', 1),
      (v_pregunta, 'El edoxabán, porque sin alimentos produce náuseas intensas en la mayoría de pacientes.', FALSE, 'El edoxabán se toma con o sin comida.', 2),
      (v_pregunta, 'El rivaroxabán, porque los alimentos aumentan su absorción a esas dosis.', TRUE, 'Correcto. La dosis de 10 mg puede tomarse con o sin comida.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una mujer de 82 años, 58 kg y creatinina de 1,3 mg/dL, con fibrilación auricular no valvular, inicia apixabán. ¿Qué dosis corresponde según la ficha técnica?';
    v_t4 := 'En la fibrilación auricular, la ficha técnica del apixabán reduce la dosis a 2,5 mg cada 12 horas si se cumplen al menos dos de estos criterios: edad de 80 años o más, peso de 60 kg o menos, creatinina sérica de 1,5 mg/dL o más (o si el aclaramiento está entre 15 y 29 mL/min).';
    v_j1 := $evfant_json${"external_id":"fant-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"ACOD: ajuste renal, interacciones P-gp/CYP3A4 y poblaciones especiales","outcome":"ACOD: ajuste renal, interacciones P-gp/CYP3A4 y poblaciones especiales","source":"Ficha técnica de apixabán."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u4-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, '5 mg cada 12 horas, porque la creatinina es menor de 1,5 mg/dL y por eso no se reduce la dosis.', FALSE, 'Cumple otros dos criterios de reducción.', 0),
      (v_pregunta, '2,5 mg cada 12 horas, porque cumple dos criterios: edad de 80 o más y peso de 60 kg o menos.', TRUE, 'Correcto. Se requieren dos de los tres criterios.', 1),
      (v_pregunta, '10 mg cada 12 horas durante 7 días y luego 5 mg, como en la trombosis venosa profunda.', FALSE, 'Ese esquema corresponde al tratamiento de la TEV.', 2),
      (v_pregunta, '2,5 mg una vez al día, porque es la dosis mínima para cualquier persona mayor de 75 años.', FALSE, 'La dosis reducida se da cada 12 horas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre de 81 años con fibrilación auricular inicia un ACOD. Además toma ácido acetilsalicílico «por prevención», naproxeno por artrosis y verapamilo formulado por otro especialista. ¿Qué análisis es correcto?';
    v_t4 := 'La aspirina sin indicación de prevención secundaria y los AINE aumentan el riesgo de sangrado con los ACOD sin beneficio que lo justifique; se propone retirarlos. El verapamilo inhibe la glicoproteína P y puede elevar las concentraciones de dabigatrán y otros ACOD; se revisa la ficha técnica de cada uno.';
    v_j1 := $evfant_json${"external_id":"fant-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso: adulto mayor con FA, enfermedad renal e interacciones","outcome":"Caso: adulto mayor con FA, enfermedad renal e interacciones","source":"Fichas técnicas de los ACOD; guía ESC 2024 de fibrilación auricular."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u4-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No hay riesgo adicional, porque los ACOD no interactúan con ningún otro medicamento.', FALSE, 'Hay interacciones farmacocinéticas y farmacodinámicas.', 0),
      (v_pregunta, 'Basta con reducir el ACOD a la mitad para poder mantener todos los demás medicamentos.', FALSE, 'Reducir el ACOD no resuelve los riesgos y puede dejarlo sin protección.', 1),
      (v_pregunta, 'La aspirina sin indicación y el AINE suman riesgo de sangrado; el verapamilo puede elevar algunos ACOD.', TRUE, 'Correcto. Se propone retirar la aspirina y el AINE.', 2),
      (v_pregunta, 'El verapamilo reduce el efecto del ACOD y hay que duplicar la dosis del anticoagulante.', FALSE, 'El verapamilo inhibe la glicoproteína P.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con una prótesis valvular mecánica en warfarina pide cambiar a rivaroxabán «para no hacerse más controles de INR». ¿Cuál es la mejor respuesta del QF?';
    v_t4 := 'Los ACOD están contraindicados en pacientes con prótesis valvulares mecánicas; con dabigatrán se observaron más trombosis y sangrados que con warfarina. La warfarina con control del INR sigue siendo el tratamiento; también se prefiere en el síndrome antifosfolípido de alto riesgo.';
    v_j1 := $evfant_json${"external_id":"fant-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"ACOD: ajuste renal, interacciones P-gp/CYP3A4 y poblaciones especiales","outcome":"ACOD: ajuste renal, interacciones P-gp/CYP3A4 y poblaciones especiales","source":"Fichas técnicas de los ACOD."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u4-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que los ACOD están contraindicados con válvulas mecánicas; la warfarina sigue siendo el tratamiento.', TRUE, 'Correcto. Se explica el riesgo trombótico.', 0),
      (v_pregunta, 'Que el cambio es seguro y recomendable para todos los pacientes que usan warfarina.', FALSE, 'No aplica a las prótesis mecánicas.', 1),
      (v_pregunta, 'Que puede cambiar si toma el rivaroxabán junto con ácido acetilsalicílico para reforzarlo.', FALSE, 'La combinación no corrige la contraindicación.', 2),
      (v_pregunta, 'Que puede cambiar a dabigatrán, que sí está aprobado para las prótesis valvulares mecánicas.', FALSE, 'El dabigatrán aumentó trombosis y sangrados en esos pacientes.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fant-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Perioperatorio, reversión y atención farmacéutica en anticoagulación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Perioperatorio, reversión y atención farmacéutica en anticoagulación) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Perioperatorio, reversión y atención farmacéutica en anticoagulación';
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


    v_t3 := '¿Qué agente revierte específicamente el efecto del dabigatrán?';
    v_t4 := 'El idarucizumab es un fragmento de anticuerpo que revierte el dabigatrán; el andexanet alfa revierte los inhibidores del factor Xa (apixabán, rivaroxabán); el complejo de protrombina se usa cuando no hay agente específico; la vitamina K revierte la warfarina y la protamina la heparina.';
    v_j1 := $evfant_json${"external_id":"fant-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Reversión: vitamina K, CCP, protamina, idarucizumab y andexanet alfa","outcome":"Reversión: vitamina K, CCP, protamina, idarucizumab y andexanet alfa","source":"Fichas técnicas de idarucizumab, andexanet alfa y vitamina K."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u5-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'La vitamina K intravenosa, que restaura la síntesis de los factores de la coagulación.', FALSE, 'La vitamina K revierte la warfarina.', 0),
      (v_pregunta, 'La protamina, que se une al dabigatrán y lo neutraliza en minutos.', FALSE, 'La protamina revierte la heparina.', 1),
      (v_pregunta, 'El idarucizumab, un fragmento de anticuerpo que se une al dabigatrán.', TRUE, 'Correcto. El andexanet alfa revierte los inhibidores del factor Xa.', 2),
      (v_pregunta, 'El andexanet alfa, que neutraliza a todos los anticoagulantes orales por igual.', FALSE, 'El andexanet alfa es para los inhibidores del factor Xa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente con apixabán y función renal normal tendrá una extracción dental simple. Pregunta si necesita «inyecciones de heparina» mientras suspende el anticoagulante. ¿Qué le indica el QF?';
    v_t4 := 'Con los ACOD no se hace terapia puente con heparina, por su inicio y fin de acción rápidos. El tiempo de suspensión depende del riesgo hemorrágico del procedimiento y de la función renal; en procedimientos de bajo riesgo, como muchas extracciones dentales simples, la suspensión es mínima o innecesaria según el protocolo.';
    v_j1 := $evfant_json${"external_id":"fant-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Suspensión perioperatoria de antitrombóticos y terapia puente","outcome":"Suspensión perioperatoria de antitrombóticos y terapia puente","source":"Fichas técnicas de los ACOD; recomendaciones perioperatorias."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u5-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que sí necesita enoxaparina cada 12 horas durante una semana antes y después del procedimiento.', FALSE, 'Con los ACOD no se hace terapia puente.', 0),
      (v_pregunta, 'Que debe suspender el apixabán dos semanas antes del procedimiento para eliminar por completo el riesgo de sangrado.', FALSE, 'Ese tiempo es excesivo y expone a trombosis.', 1),
      (v_pregunta, 'Que no debe suspender nunca el apixabán, ni siquiera ante una cirugía mayor de alto riesgo.', FALSE, 'En cirugías de alto riesgo sí se suspende.', 2),
      (v_pregunta, 'Que con los ACOD no se usa terapia puente; el odontólogo y el médico definen si y cuánto suspender.', TRUE, 'Correcto. Muchos procedimientos dentales simples requieren ajustes mínimos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre de 70 años en rivaroxabán llega con hemorragia digestiva alta, presión de 85/50 mmHg y hemoglobina de 7,1 g/dL. Tomó la última dosis hace 8 horas. Toma además sertralina e ibuprofeno. ¿Qué análisis es correcto?';
    v_t4 := 'Un sangrado con inestabilidad hemodinámica es mayor. El rivaroxabán sigue activo horas después de la dosis. El ibuprofeno y los ISRS (sertralina) aumentan el riesgo de sangrado gastrointestinal. Se suspende el anticoagulante, se da soporte, se considera la reversión (andexanet alfa o complejo de protrombina según disponibilidad) y se reporta.';
    v_j1 := $evfant_json${"external_id":"fant-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso integrador: sangrado digestivo mayor en paciente con rivaroxabán","outcome":"Caso integrador: sangrado digestivo mayor en paciente con rivaroxabán","source":"Fichas técnicas de rivaroxabán y andexanet alfa."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u5-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es un sangrado mayor: sertralina e ibuprofeno sumaron riesgo; se considera la reversión y se reporta.', TRUE, 'Correcto. El QF apoya con la información del fármaco.', 0),
      (v_pregunta, 'No es un sangrado grave, porque el rivaroxabán ya no tiene efecto a las 8 horas de la dosis.', FALSE, 'A las 8 horas todavía tiene efecto.', 1),
      (v_pregunta, 'El sangrado se debe solo a la úlcera y los medicamentos no tienen ninguna relación con él.', FALSE, 'Varios medicamentos contribuyen al sangrado.', 2),
      (v_pregunta, 'Lo indicado es dar vitamina K oral, que revierte de inmediato el efecto del rivaroxabán.', FALSE, 'La vitamina K no revierte a los inhibidores del factor Xa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una clínica de anticoagulación informa que su tiempo en rango terapéutico (TTR) con warfarina es de 45 % y lo considera «un control adecuado». ¿Cuál es la mejor valoración?';
    v_t4 := 'El tiempo en rango terapéutico (TTR) mide la proporción del tiempo con el INR en el rango objetivo; valores de 65-70 % o más indican buen control. Un TTR bajo se asocia a más trombosis y sangrados y obliga a revisar adherencia, interacciones, educación y la opción de cambiar a un ACOD cuando corresponde.';
    v_j1 := $evfant_json${"external_id":"fant-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Clínicas de anticoagulación y rol del QF","outcome":"Clínicas de anticoagulación y rol del QF","source":"Recomendaciones ACCP/CHEST; guía ESC 2024 de fibrilación auricular."}$evfant_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fant-u5-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es adecuado, porque cualquier TTR mayor de 40 % se considera un control excelente.', FALSE, 'Un TTR de 45 % es un control deficiente.', 0),
      (v_pregunta, 'Es insuficiente: un TTR menor de 65-70 % indica control deficiente y obliga a revisar el programa.', TRUE, 'Correcto. También se consideran alternativas como los ACOD.', 1),
      (v_pregunta, 'Es adecuado si los pacientes no han tenido ningún sangrado mayor durante el último año.', FALSE, 'La ausencia de sangrados no garantiza un buen control.', 2),
      (v_pregunta, 'El TTR no sirve para evaluar una clínica de anticoagulación y debe dejar de medirse.', FALSE, 'El TTR es un indicador clave de calidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fant-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la hemostasia y monitorización de la coagulación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la hemostasia y monitorización de la coagulación) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Paciente anticoagulado en urgencias';
  v_t2 := $evfant_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Explica qué prueba sirve para cada anticoagulante y por qué estas pruebas no descartan efecto.</li><li>Describe cómo identificarías el medicamento (conciliación, registros de dispensación, preguntas a la hija).</li><li>Calcula el aclaramiento de creatinina y explica su importancia para el efecto residual.</li><li>Explica qué información adicional pediría el equipo (hora de la última dosis, pruebas específicas si existen).</li><li>Prepara la comunicación al médico con tu recomendación.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Interpretar las pruebas de coagulación según el posible anticoagulante.</li><li>Obtener la información farmacoterapéutica necesaria para decidir.</li><li>Comunicar al equipo de urgencias una recomendación clara.</li></ul>
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
  <tr><td>Pruebas</td><td>25 %</td><td>Explica que INR y aPTT casi normales no descartan un ACOD y qué prueba sirve para cada fármaco.</td><td>Explicación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Identificación</td><td>25 %</td><td>Propone conciliación con registros de dispensación y preguntas concretas a la familia.</td><td>Propuesta general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Función renal</td><td>25 %</td><td>Calcula el aclaramiento (≈23 mL/min con el factor 0,85 de mujer) y explica su efecto sobre la eliminación de los ACOD.</td><td>Calcula sin interpretar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación</td><td>15 %</td><td>Recomendación clara y oportuna para el equipo.</td><td>Comunicación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfant_html$;
  v_t3 := $evfant_html$<h2>Caso de estudio</h2>
<p>Doña Amalia tiene 79 años, pesa 55 kg y llega a urgencias de una IPS en Medellín tras una caída con hematoma en la cabeza (datos simulados). Su hija dice que toma «un anticoagulante para el corazón» que retira cada mes en una farmacia de la EPS, pero no trae la fórmula. Laboratorio: INR 1,3; aPTT 36 s (normal); creatinina 1,7 mg/dL; plaquetas 230.000. El médico quiere saber qué tan anticoagulada está y qué hacer.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfant_html$;
  v_t4 := 'Informe para el equipo de urgencias con recomendación.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfant_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías ESC de síndrome coronario agudo (2023) y fibrilación auricular (2024); recomendaciones ACCP/CHEST sobre antitrombóticos; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (ácido acetilsalicílico, clopidogrel, prasugrel, ticagrelor, cilostazol, heparinas, warfarina, dabigatrán, rivaroxabán, apixabán, edoxabán y sus agentes de reversión); guías de práctica clínica del Ministerio de Salud; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfant_html$;
  v_t7 := NULL;
  v_j1 := $evfant_json$["Interpretación de pruebas.","Identificación del medicamento.","Función renal.","Información adicional.","Comunicación."]$evfant_json$::jsonb;
  v_j2 := $evfant_json${"version":1,"total":100,"criteria":[{"id":"pruebas","name":"Pruebas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica que INR y aPTT casi normales no descartan un ACOD y qué prueba sirve para cada fármaco."},{"level":3,"label":"Logrado","description":"Explicación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"identificacion","name":"Identificación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Propone conciliación con registros de dispensación y preguntas concretas a la familia."},{"level":3,"label":"Logrado","description":"Propuesta general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"funcion-renal","name":"Función renal","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Calcula el aclaramiento (≈23 mL/min con el factor 0,85 de mujer) y explica su efecto sobre la eliminación de los ACOD."},{"level":3,"label":"Logrado","description":"Calcula sin interpretar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion","name":"Comunicación","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Recomendación clara y oportuna para el equipo."},{"level":3,"label":"Logrado","description":"Comunicación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfant_json$::jsonb;
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


  -- ── Actividad fant-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antiagregantes plaquetarios' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antiagregantes plaquetarios) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Doble antiagregación tras un infarto e interacción con el IBP';
  v_t2 := $evfant_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Analiza el cambio a prasugrel con su antecedente de ataque cerebrovascular.</li><li>Analiza la interacción del omeprazol con el clopidogrel y propone una alternativa de gastroprotección.</li><li>Analiza el ibuprofeno con la doble antiagregación.</li><li>Evalúa el riesgo de las interrupciones por falta de acceso y propone cómo resolverlas.</li><li>Redacta la comunicación al cardiólogo con tus recomendaciones.</li><li>Prepara la educación para Don Hernando.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Revisar la doble antiagregación y sus contraindicaciones.</li><li>Identificar interacciones y problemas de acceso.</li><li>Proponer intervenciones al cardiólogo y al paciente.</li></ul>
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
  <tr><td>Contraindicación</td><td>25 %</td><td>Reconoce que el prasugrel está contraindicado por el ACV previo y propone alternativas.</td><td>Lo reconoce sin alternativas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones</td><td>25 %</td><td>Identifica omeprazol con clopidogrel (proponer pantoprazol) e ibuprofeno con la doble antiagregación.</td><td>Identifica una de las dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acceso</td><td>25 %</td><td>Explica el riesgo de trombosis del stent y propone un plan de acceso concreto.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y educación</td><td>15 %</td><td>Comunicación clara y educación práctica.</td><td>Comunicación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfant_html$;
  v_t3 := $evfant_html$<h2>Caso de estudio</h2>
<p>Don Hernando tiene 62 años, diabetes y un ataque cerebrovascular isquémico hace tres años (datos simulados). Egresa de una clínica en Bogotá tras un infarto sin elevación del ST con stent medicado. Fórmula: ácido acetilsalicílico 100 mg, clopidogrel 75 mg, atorvastatina 80 mg, metoprolol, omeprazol 20 mg y metformina. Un mes después cuenta que le cambiaron el clopidogrel por prasugrel porque «es mejor», que a veces no consigue el medicamento y que toma ibuprofeno por dolor en las rodillas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfant_html$;
  v_t4 := 'Informe con comunicación al cardiólogo y plan educativo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfant_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías ESC de síndrome coronario agudo (2023) y fibrilación auricular (2024); recomendaciones ACCP/CHEST sobre antitrombóticos; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (ácido acetilsalicílico, clopidogrel, prasugrel, ticagrelor, cilostazol, heparinas, warfarina, dabigatrán, rivaroxabán, apixabán, edoxabán y sus agentes de reversión); guías de práctica clínica del Ministerio de Salud; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfant_html$;
  v_t7 := NULL;
  v_j1 := $evfant_json$["Prasugrel y ACV.","IBP y clopidogrel.","AINE.","Acceso.","Comunicación y educación."]$evfant_json$::jsonb;
  v_j2 := $evfant_json${"version":1,"total":100,"criteria":[{"id":"contraindicacion","name":"Contraindicación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce que el prasugrel está contraindicado por el ACV previo y propone alternativas."},{"level":3,"label":"Logrado","description":"Lo reconoce sin alternativas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones","name":"Interacciones","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica omeprazol con clopidogrel (proponer pantoprazol) e ibuprofeno con la doble antiagregación."},{"level":3,"label":"Logrado","description":"Identifica una de las dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acceso","name":"Acceso","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica el riesgo de trombosis del stent y propone un plan de acceso concreto."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-educacion","name":"Comunicación y educación","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Comunicación clara y educación práctica."},{"level":3,"label":"Logrado","description":"Comunicación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfant_json$::jsonb;
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


  -- ── Actividad fant-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Anticoagulantes orales directos e indicaciones clínicas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Anticoagulantes orales directos e indicaciones clínicas) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Fibrilación auricular en un adulto mayor con enfermedad renal';
  v_t2 := $evfant_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Calcula el CHA2DS2-VASc (o CHA2DS2-VA) y el HAS-BLED y explica su significado.</li><li>Calcula el aclaramiento de creatinina con Cockcroft-Gault.</li><li>Propone el ACOD y la dosis según la ficha técnica, considerando la edad, el peso y la función renal.</li><li>Analiza las interacciones con el verapamilo y la aspirina, y el riesgo del naproxeno.</li><li>Revisa la metformina según la función renal.</li><li>Redacta la propuesta al cardiólogo y la educación para Don Mario.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Estratificar el riesgo trombótico y hemorrágico.</li><li>Seleccionar y dosificar el ACOD según la función renal y las interacciones.</li><li>Proponer la deprescripción de fármacos que aumentan el sangrado.</li></ul>
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
  <tr><td>Escalas y función renal</td><td>25 %</td><td>Calcula las escalas y el aclaramiento (≈31 mL/min) con su interpretación.</td><td>Cálculos con un error menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>ACOD y dosis</td><td>30 %</td><td>Propone un ACOD con la dosis de su ficha técnica para esta edad, peso y función renal.</td><td>Propone el fármaco con dosis imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones y deprescripción</td><td>25 %</td><td>Retira aspirina y naproxeno y analiza el verapamilo con el ACOD elegido.</td><td>Aborda dos de los tres.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Metformina y educación</td><td>10 %</td><td>Ajusta la metformina y educa sobre signos de sangrado y adherencia.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfant_html$;
  v_t3 := $evfant_html$<h2>Caso de estudio</h2>
<p>Don Mario tiene 81 años, pesa 64 kg y tiene hipertensión, insuficiencia cardiaca con FE preservada y diabetes (datos simulados). Le diagnosticaron fibrilación auricular no valvular. Creatinina 1,7 mg/dL. Toma amlodipino, losartán, metformina 850 mg cada 12 horas, verapamilo formulado por otro especialista, ácido acetilsalicílico «por prevención» y naproxeno. El cardiólogo quiere iniciar un ACOD y pide al servicio farmacéutico una propuesta.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfant_html$;
  v_t4 := 'Propuesta al cardiólogo con plan educativo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfant_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías ESC de síndrome coronario agudo (2023) y fibrilación auricular (2024); recomendaciones ACCP/CHEST sobre antitrombóticos; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (ácido acetilsalicílico, clopidogrel, prasugrel, ticagrelor, cilostazol, heparinas, warfarina, dabigatrán, rivaroxabán, apixabán, edoxabán y sus agentes de reversión); guías de práctica clínica del Ministerio de Salud; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfant_html$;
  v_t7 := NULL;
  v_j1 := $evfant_json$["Escalas de riesgo.","Función renal.","ACOD y dosis.","Interacciones y deprescripción.","Metformina y educación."]$evfant_json$::jsonb;
  v_j2 := $evfant_json${"version":1,"total":100,"criteria":[{"id":"escalas-y-funcion-renal","name":"Escalas y función renal","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Calcula las escalas y el aclaramiento (≈31 mL/min) con su interpretación."},{"level":3,"label":"Logrado","description":"Cálculos con un error menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acod-y-dosis","name":"ACOD y dosis","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Propone un ACOD con la dosis de su ficha técnica para esta edad, peso y función renal."},{"level":3,"label":"Logrado","description":"Propone el fármaco con dosis imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones-y-deprescripcion","name":"Interacciones y deprescripción","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Retira aspirina y naproxeno y analiza el verapamilo con el ACOD elegido."},{"level":3,"label":"Logrado","description":"Aborda dos de los tres."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"metformina-y-educacion","name":"Metformina y educación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Ajusta la metformina y educa sobre signos de sangrado y adherencia."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfant_json$::jsonb;
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


  -- ── Actividad fant-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Anticoagulantes parenterales y antagonistas de la vitamina K' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Anticoagulantes parenterales y antagonistas de la vitamina K) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: terapia antitrombótica triple de Doña Fabiola';
  v_t2 := $evfant_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso, elabora el estado de situación y calcula el aclaramiento de creatinina.</li><li>Fase 1: define qué pruebas de seguimiento necesita cada antitrombótico.</li><li>Fase 2: analiza el riesgo de la terapia triple y qué recomiendan las guías sobre su duración y composición.</li><li>Fase 3: identifica las interacciones de la warfarina (omeprazol, té de jengibre, ibuprofeno) y el riesgo de sangrado.</li><li>Fase 3: propone la educación sobre dieta, productos naturales y signos de sangrado.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (hemostasia y pruebas).</strong> Estado de situación, pruebas de seguimiento y función renal.</li>
  <li><strong>Fase 2 · Unidad 2 (antiagregantes).</strong> Revisión de la terapia triple y de su duración.</li>
  <li><strong>Fase 3 · Unidad 3 (warfarina).</strong> Interacciones, dieta, productos naturales y manejo del INR.</li>
  <li><strong>Fase 4 · Unidad 4 (ACOD).</strong> Valoración del cambio a un ACOD y su dosis.</li>
  <li><strong>Fase 5 · Unidad 5 (perioperatorio y seguimiento).</strong> Plan para la cirugía, reversión y seguimiento en la clínica.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Analizar una terapia antitrombótica triple y sus riesgos.</li><li>Identificar interacciones y factores modificables del sangrado.</li></ul>
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
  <tr><td>Estado y función renal</td><td>20 %</td><td>Estado completo y aclaramiento calculado (≈31 mL/min con el factor 0,85 de mujer).</td><td>Estado con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Terapia triple</td><td>35 %</td><td>Reconoce el riesgo alto de sangrado y propone acortar la triple terapia según la guía, con decisión del cardiólogo.</td><td>Reconoce el riesgo sin propuesta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones</td><td>25 %</td><td>Identifica ibuprofeno, té de jengibre y la gastroprotección adecuada con clopidogrel.</td><td>Identifica dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Educación</td><td>10 %</td><td>Educación práctica sobre dieta y sangrado.</td><td>Educación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfant_html$;
  v_t3 := $evfant_html$<h2>Caso de estudio</h2>
<p>Doña Fabiola tiene 74 años, vive en Cali y pesa 60 kg (datos simulados). Tiene fibrilación auricular, hipertensión, diabetes y ERC (creatinina 1,5 mg/dL). Hace dos semanas le pusieron un stent coronario y salió con ácido acetilsalicílico, clopidogrel, warfarina, omeprazol, atorvastatina y metformina. En dos meses tendrá una cirugía de catarata. Toma un té de jengibre a diario y compra ibuprofeno para la rodilla. Su EPS la asignó a la clínica de anticoagulación donde tú eres el QF responsable. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfant_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfant_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías ESC de síndrome coronario agudo (2023) y fibrilación auricular (2024); recomendaciones ACCP/CHEST sobre antitrombóticos; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (ácido acetilsalicílico, clopidogrel, prasugrel, ticagrelor, cilostazol, heparinas, warfarina, dabigatrán, rivaroxabán, apixabán, edoxabán y sus agentes de reversión); guías de práctica clínica del Ministerio de Salud; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfant_html$;
  v_t7 := NULL;
  v_j1 := $evfant_json$["Estado de situación y función renal.","Pruebas de seguimiento.","Terapia triple.","Interacciones y educación."]$evfant_json$::jsonb;
  v_j2 := $evfant_json${"version":1,"total":100,"criteria":[{"id":"estado-y-funcion-renal","name":"Estado y función renal","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Estado completo y aclaramiento calculado (≈31 mL/min con el factor 0,85 de mujer)."},{"level":3,"label":"Logrado","description":"Estado con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"terapia-triple","name":"Terapia triple","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Reconoce el riesgo alto de sangrado y propone acortar la triple terapia según la guía, con decisión del cardiólogo."},{"level":3,"label":"Logrado","description":"Reconoce el riesgo sin propuesta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones","name":"Interacciones","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica ibuprofeno, té de jengibre y la gastroprotección adecuada con clopidogrel."},{"level":3,"label":"Logrado","description":"Identifica dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"educacion","name":"Educación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Educación práctica sobre dieta y sangrado."},{"level":3,"label":"Logrado","description":"Educación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfant_json$::jsonb;
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


  -- ── Actividad fant-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Perioperatorio, reversión y atención farmacéutica en anticoagulación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Perioperatorio, reversión y atención farmacéutica en anticoagulación) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan de anticoagulación, cirugía y seguimiento de Doña Fabiola';
  v_t2 := $evfant_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: valora si conviene cambiar la warfarina por un ACOD y propone el fármaco y la dosis según su ficha técnica.</li><li>Fase 5: diseña el plan para la cirugía de catarata (riesgo hemorrágico, suspensión o no, terapia puente).</li><li>Fase 5: define qué haría la clínica ante un sangrado mayor (reversión según el fármaco) y el seguimiento con indicadores.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (hemostasia y pruebas).</strong> Estado de situación, pruebas de seguimiento y función renal.</li>
  <li><strong>Fase 2 · Unidad 2 (antiagregantes).</strong> Revisión de la terapia triple y de su duración.</li>
  <li><strong>Fase 3 · Unidad 3 (warfarina).</strong> Interacciones, dieta, productos naturales y manejo del INR.</li>
  <li><strong>Fase 4 · Unidad 4 (ACOD).</strong> Valoración del cambio a un ACOD y su dosis.</li>
  <li><strong>Fase 5 · Unidad 5 (perioperatorio y seguimiento).</strong> Plan para la cirugía, reversión y seguimiento en la clínica.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Valorar el cambio a un ACOD y su dosificación.</li><li>Planear el manejo perioperatorio y el seguimiento.</li></ul>
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
  <tr><td>ACOD</td><td>25 %</td><td>Valora el cambio con criterios y dosifica según la ficha técnica y la función renal.</td><td>Propuesta sin dosis precisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Perioperatorio</td><td>25 %</td><td>Reconoce el bajo riesgo hemorrágico de la catarata y evita la terapia puente innecesaria.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Reversión y seguimiento</td><td>25 %</td><td>Agente de reversión según el fármaco e indicadores (TTR o adherencia, función renal, eventos).</td><td>Plan incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfant_html$;
  v_t3 := $evfant_html$<h2>Caso de estudio</h2>
<p>Doña Fabiola tiene 74 años, vive en Cali y pesa 60 kg (datos simulados). Tiene fibrilación auricular, hipertensión, diabetes y ERC (creatinina 1,5 mg/dL). Hace dos semanas le pusieron un stent coronario y salió con ácido acetilsalicílico, clopidogrel, warfarina, omeprazol, atorvastatina y metformina. En dos meses tendrá una cirugía de catarata. Toma un té de jengibre a diario y compra ibuprofeno para la rodilla. Su EPS la asignó a la clínica de anticoagulación donde tú eres el QF responsable. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité de la clínica.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfant_html$;
  v_t4 := 'Plan integral con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfant_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías ESC de síndrome coronario agudo (2023) y fibrilación auricular (2024); recomendaciones ACCP/CHEST sobre antitrombóticos; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (ácido acetilsalicílico, clopidogrel, prasugrel, ticagrelor, cilostazol, heparinas, warfarina, dabigatrán, rivaroxabán, apixabán, edoxabán y sus agentes de reversión); guías de práctica clínica del Ministerio de Salud; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfant_html$;
  v_t7 := NULL;
  v_j1 := $evfant_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Cambio a ACOD.","Plan perioperatorio.","Reversión y seguimiento.","Resumen ejecutivo."]$evfant_json$::jsonb;
  v_j2 := $evfant_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acod","name":"ACOD","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Valora el cambio con criterios y dosifica según la ficha técnica y la función renal."},{"level":3,"label":"Logrado","description":"Propuesta sin dosis precisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"perioperatorio","name":"Perioperatorio","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce el bajo riesgo hemorrágico de la catarata y evita la terapia puente innecesaria."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"reversion-y-seguimiento","name":"Reversión y seguimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Agente de reversión según el fármaco e indicadores (TTR o adherencia, función renal, eventos)."},{"level":3,"label":"Logrado","description":"Plan incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfant_json$::jsonb;
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


  -- ── Foro fant-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con anticoagulantes';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfant_html$<h2>Para empezar</h2>
<p>Piensa en una persona anticoagulada o antiagregada que hayas atendido o acompañado y cuéntanos en tres o cuatro líneas una dificultad que tuvo con su tratamiento, sin nombres ni datos que la identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfant_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre antitrombóticos te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfant_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfant_html$;
  v_t6 := $evfant_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfant_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué te genera más dudas: la warfarina, los ACOD o la doble antiagregación?', '¿Has visto interacciones de antitrombóticos con productos de venta libre?']::text[];
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


  -- ── Foro fant-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la hemostasia y monitorización de la coagulación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la hemostasia y monitorización de la coagulación) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Antitrombóticos: medicamentos de alto riesgo';
  v_t2 := 'Argumentar por qué los antitrombóticos requieren barreras de seguridad específicas en el servicio farmacéutico.';
  v_t3 := $evfant_html$<h2>Caso del foro</h2>
<p>Un hospital revisa sus eventos adversos del año (datos simulados): dosis de enoxaparina no ajustadas a la función renal, warfarina duplicada al alta por dos nombres comerciales distintos, un ACOD reiniciado tras una cirugía sin indicación clara y una heparina que siguió en las líneas de un paciente con trombocitopenia.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfant_html$;
  v_t4 := '¿Qué barreras propondrías para cada tipo de error y cuál priorizarías?';
  v_t5 := $evfant_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación o el dato que sustenta cada barrera. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfant_html$;
  v_t6 := $evfant_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato que sustenta cada barrera.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfant_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué los antitrombóticos están en las listas de medicamentos de alto riesgo?', '¿Qué información debe estar siempre disponible para dosificarlos?', '¿Cómo se integra la farmacovigilancia en estas barreras?']::text[];
  v_j1 := $evfant_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato que sustenta cada barrera."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfant_json$::jsonb;
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


  -- ── Foro fant-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antiagregantes plaquetarios' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antiagregantes plaquetarios) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Doble antiagregación interrumpida por trámites';
  v_t2 := 'Argumentar cómo debe actuar el servicio farmacéutico ante barreras de acceso a la doble antiagregación.';
  v_t3 := $evfant_html$<h2>Caso del foro</h2>
<p>Un servicio farmacéutico detecta en un trimestre 15 pacientes con stent que no recibieron el inhibidor P2Y12 a tiempo por desabastecimiento o autorización (datos simulados). Algunos dejaron también la aspirina «porque sin la otra no sirve», y uno tuvo un infarto por trombosis del stent.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfant_html$;
  v_t4 := '¿Qué protocolo propondrías para que estos pacientes nunca queden sin tratamiento?';
  v_t5 := $evfant_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o la ficha técnica que sustenta cada punto del protocolo. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfant_html$;
  v_t6 := $evfant_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la ficha técnica que sustenta cada punto del protocolo.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfant_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué los primeros meses tras un stent son los de mayor riesgo?', '¿Qué alternativas existen si un inhibidor P2Y12 no está disponible?', '¿Cómo se reporta y se analiza un evento así?']::text[];
  v_j1 := $evfant_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la ficha técnica que sustenta cada punto del protocolo."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfant_json$::jsonb;
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


  -- ── Foro fant-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Anticoagulantes parenterales y antagonistas de la vitamina K' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Anticoagulantes parenterales y antagonistas de la vitamina K) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Warfarina y dieta: ¿prohibir las verduras?';
  v_t2 := 'Argumentar qué consejo dietético es correcto para las personas que toman warfarina.';
  v_t3 := $evfant_html$<h2>Caso del foro</h2>
<p>En una clínica de anticoagulación, muchos pacientes dicen que les «prohibieron las verduras verdes» (datos simulados). Una paciente las dejó por completo y su INR sube y baja; otro empezó a tomar un batido verde diario y su INR bajó; una tercera toma un suplemento de ginkgo y té de jengibre.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfant_html$;
  v_t4 := '¿Qué consejo darías sobre la dieta y los productos naturales a cada paciente?';
  v_t5 := $evfant_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación que sustenta cada consejo. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfant_html$;
  v_t6 := $evfant_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada consejo.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfant_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué importa más la constancia que la prohibición?', '¿Qué productos naturales interactúan con la warfarina?', '¿Cómo registrarías estos cambios en el seguimiento?']::text[];
  v_j1 := $evfant_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada consejo."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfant_json$::jsonb;
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


  -- ── Foro fant-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Anticoagulantes orales directos e indicaciones clínicas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Anticoagulantes orales directos e indicaciones clínicas) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · ¿ACOD para todos?';
  v_t2 := 'Argumentar en qué pacientes conviene un ACOD y en cuáles la warfarina sigue siendo la opción.';
  v_t3 := $evfant_html$<h2>Caso del foro</h2>
<p>Una EPS propone cambiar a ACOD a todos los pacientes con warfarina para cerrar la clínica de anticoagulación (datos simulados). Entre ellos hay una mujer con prótesis mecánica, un hombre con aclaramiento de 18 mL/min, una paciente con síndrome antifosfolípido triple positivo y muchos con fibrilación auricular no valvular y buen control.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfant_html$;
  v_t4 := '¿A quiénes cambiarías, a quiénes no y qué condiciones pondrías?';
  v_t5 := $evfant_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la guía que sustenta cada decisión. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfant_html$;
  v_t6 := $evfant_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta cada decisión.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfant_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿En qué situaciones los ACOD están contraindicados o no se recomiendan?', '¿Cómo se elige y dosifica el ACOD según la función renal?', '¿Qué pierde el paciente si se cierra la clínica de anticoagulación?']::text[];
  v_j1 := $evfant_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta cada decisión."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfant_json$::jsonb;
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


  -- ── Foro fant-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Perioperatorio, reversión y atención farmacéutica en anticoagulación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Perioperatorio, reversión y atención farmacéutica en anticoagulación) en Anticoagulantes y Antiagregantes: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · La clínica de anticoagulación que no mide';
  v_t2 := 'Argumentar qué debe medir y hacer una clínica de anticoagulación para ser segura.';
  v_t3 := $evfant_html$<h2>Caso del foro</h2>
<p>Una IPS tiene una «clínica de anticoagulación» que solo toma el INR y ajusta la dosis por teléfono (datos simulados). No calcula el TTR, no registra interacciones ni eventos, no hace seguimiento a los pacientes con ACOD y no tiene protocolo para cirugías.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfant_html$;
  v_t4 := '¿Qué componentes mínimos debería tener la clínica y qué papel tendría el QF?';
  v_t5 := $evfant_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación o el dato que sustenta cada componente. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfant_html$;
  v_t6 := $evfant_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato que sustenta cada componente.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfant_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué indicadores medirías?', '¿Qué seguimiento necesitan los pacientes con ACOD?', '¿Cómo se integra la farmacovigilancia?']::text[];
  v_j1 := $evfant_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato que sustenta cada componente."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfant_json$::jsonb;
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


  RAISE NOTICE 'Anticoagulantes y Antiagregantes: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfant$;

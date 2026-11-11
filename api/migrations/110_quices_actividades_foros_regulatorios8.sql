-- ============================================================
--  110_quices_actividades_foros_regulatorios8.sql — quizzes, actividades y foros, lote «regulatorios8»
--
--  Generado por scripts/evaluacion-aula.mjs regulatorios8 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Regulación de Medicamentos Homeopáticos; Registro Sanitario de Suplementos Dietarios.
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
--  Curso de Regulación de Medicamentos Homeopáticos
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evhomeo$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Regulación de Medicamentos Homeopáticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia', 'Unidad 2. Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas', 'Unidad 3. Registro sanitario de medicamentos homeopáticos', 'Unidad 4. Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia', 'Unidad 5. Contexto internacional, debate científico y comunicación responsable']::text[])) < 5 THEN
    RAISE NOTICE 'Regulación de Medicamentos Homeopáticos: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evhomeo_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evhomeo_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz homeo-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia';
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


    v_t3 := 'Según el Decreto 3554 de 2004, ¿qué diferencia un medicamento homeopático simple de uno complejo?';
    v_t4 := 'El artículo 2 define el homeopático simple como el preparado a partir de una sola cepa o tintura madre y el complejo (modificado por el Decreto 1861 de 2006) como la mezcla de dos o más dinamizaciones de una misma cepa o de cepas distintas. El artículo 18 los clasifica así para el registro.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Homeopático simple, complejo, magistral y oficinal; venta libre y con fórmula; con y sin indicación","outcome":"Homeopático simple, complejo, magistral y oficinal; venta libre y con fórmula; con y sin indicación","source":"Decreto 3554 de 2004, arts. 2 y 18."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u1-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El simple se vende con fórmula médica y el complejo siempre se vende libremente en tiendas naturistas.', FALSE, 'La diferencia es la composición.', 0),
      (v_pregunta, 'El simple se prepara con una sola cepa; el complejo mezcla dos o más dinamizaciones.', TRUE, 'Correcto. De una o varias cepas.', 1),
      (v_pregunta, 'El simple contiene una sola dilución y el complejo contiene principios activos de síntesis química.', FALSE, 'No contienen activos de síntesis.', 2),
      (v_pregunta, 'El simple se fabrica en Colombia y el complejo siempre es importado de Europa.', FALSE, 'El origen no define la categoría.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué indica la expresión «30 CH» en un medicamento homeopático?';
    v_t4 := 'El artículo 6 del Decreto 3554 reconoce las escalas de dilución y dinamización (D/X decimal, C/CH centesimal, LM/Q cincuentamilesimal, K korsakoviana). «30 CH» indica 30 diluciones centesimales sucesivas con dinamización.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Cepas, tinturas madre y escalas de dilución y dinamización (D/X, CH, LM, K)","outcome":"Cepas, tinturas madre y escalas de dilución y dinamización (D/X, CH, LM, K)","source":"Decreto 3554 de 2004, art. 6."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u1-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que el producto contiene 30 miligramos de cepa por cada mililitro de solución.', FALSE, 'No expresa una concentración en masa.', 0),
      (v_pregunta, 'Que el producto se debe tomar 30 veces al día durante el tratamiento.', FALSE, 'No es una posología.', 1),
      (v_pregunta, 'Que se aplicaron 30 diluciones sucesivas en la escala centesimal hahnemanniana.', TRUE, 'Correcto. Escala del art. 6.', 2),
      (v_pregunta, 'Que la cepa proviene de 30 plantas distintas mezcladas en la tintura madre.', FALSE, 'No indica número de plantas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una farmacia homeopática prepara un medicamento para un paciente según la fórmula de su médico. ¿Qué análisis es correcto sobre su régimen?';
    v_t4 := 'El Decreto 1737 de 2005 regula la preparación, distribución, dispensación y comercialización de medicamentos homeopáticos magistrales y oficinales y las farmacias homeopáticas; derogó del Decreto 3554 la definición de farmacia homeopática y de magistral. Los magistrales se preparan para un paciente con fórmula y no requieren registro.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Decreto 1737 de 2005 y Decreto 4664 de 2006: magistrales, oficinales y farmacias homeopáticas","outcome":"Decreto 1737 de 2005 y Decreto 4664 de 2006: magistrales, oficinales y farmacias homeopáticas","source":"Decreto 1737 de 2005; Decreto 3554 de 2004, art. 2 (nota de vigencia)."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u1-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es un preparado magistral, regido por el Decreto 1737 de 2005, que no requiere registro sanitario.', TRUE, 'Correcto. Con sus condiciones de preparación.', 0),
      (v_pregunta, 'Requiere registro sanitario completo antes de entregarse al paciente, como cualquier producto industrial.', FALSE, 'Los magistrales no se registran.', 1),
      (v_pregunta, 'Está prohibido, porque solo los laboratorios pueden preparar medicamentos homeopáticos.', FALSE, 'Las farmacias pueden preparar magistrales.', 2),
      (v_pregunta, 'Se rige por el Decreto 677 de 1995 como un medicamento de síntesis química.', FALSE, 'Tiene su régimen propio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una empresa afirma que su homeopático «no necesita renovar el registro nunca más porque así lo dice el Decreto 3554». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 23 del Decreto 3554 fijaba una vigencia de diez años; el artículo 22 (renovación) fue derogado por el Decreto 334 de 2022, y el Decreto 1474 de 2023 estableció la vigencia indefinida de los registros. La afirmación atribuye a la norma equivocada.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Cómo impactan los Decretos 334 de 2022 y 1474 de 2023 al régimen homeopático","outcome":"Cómo impactan los Decretos 334 de 2022 y 1474 de 2023 al régimen homeopático","source":"Decreto 3554 de 2004, arts. 22 y 23; Decreto 334 de 2022; Decreto 1474 de 2023."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u1-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcta: el artículo 23 del Decreto 3554 estableció desde 2004 registros sanitarios sin ningún vencimiento.', FALSE, 'El art. 23 fijaba diez años.', 0),
      (v_pregunta, 'Es incorrecta, porque los homeopáticos deben renovarse cada año con un pago al Invima.', FALSE, 'No es el régimen. Revisa la explicación.', 1),
      (v_pregunta, 'Es correcta solo para los homeopáticos importados desde países de la Unión Europea.', FALSE, 'No hay esa distinción.', 2),
      (v_pregunta, 'Es imprecisa: la renovación se derogó en 2022 y el Decreto 1474 de 2023 dio vigencia indefinida.', TRUE, 'Correcto. El art. 23 fijaba diez años.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz homeo-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas';
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


    v_t3 := '¿Qué farmacopeas acepta como oficiales el artículo 3 del Decreto 3554, modificado en 2006?';
    v_t4 := 'El artículo 3 acepta como oficiales, entre otras, las farmacopeas alemana, estadounidense, francesa, británica, mexicana, brasileña y de la Unión Europea; el Decreto 1861 de 2006 añadió la italiana y las demás que acoja el Ministerio.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Farmacopeas homeopáticas aceptadas en Colombia (HAB/GHP, HPUS, francesa, europea y otras)","outcome":"Farmacopeas homeopáticas aceptadas en Colombia (HAB/GHP, HPUS, francesa, europea y otras)","source":"Decreto 3554 de 2004, art. 3."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u2-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Solo la farmacopea colombiana, porque las extranjeras no tienen validez en el país.', FALSE, 'Acepta farmacopeas extranjeras.', 0),
      (v_pregunta, 'Solo la farmacopea de los Estados Unidos, por ser la más usada en el mundo.', FALSE, 'Acepta varias. Revisa la explicación.', 1),
      (v_pregunta, 'Cualquier libro de homeopatía publicado por una escuela reconocida.', FALSE, 'Deben ser farmacopeas oficiales.', 2),
      (v_pregunta, 'La alemana, la estadounidense, la francesa, la europea y otras, como la italiana.', TRUE, 'Correcto. También la británica, entre otras.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué control es esencial en una tintura madre antes de preparar las diluciones?';
    v_t4 := 'La tintura madre o cepa es el preparado primario del que parten las diluciones (art. 2). Su identidad y calidad se controlan según la monografía de la farmacopea, con pruebas de pureza; en diluciones bajas los componentes y contaminantes pueden persistir.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Control de calidad de tinturas madre, diluciones y producto terminado","outcome":"Control de calidad de tinturas madre, diluciones y producto terminado","source":"Decreto 3554 de 2004, arts. 2 y 3; farmacopeas homeopáticas."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u2-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Su identidad y calidad según la monografía de la farmacopea, incluidas pruebas de pureza.', TRUE, 'Correcto. Es el punto de partida.', 0),
      (v_pregunta, 'Solo su color, porque las diluciones posteriores eliminan cualquier impureza.', FALSE, 'Las impurezas pueden persistir en diluciones bajas.', 1),
      (v_pregunta, 'Ninguno, porque la tintura madre siempre se diluye millones de veces.', FALSE, 'No siempre; hay diluciones bajas.', 2),
      (v_pregunta, 'Solo el precio de compra al proveedor de la materia prima.', FALSE, 'No es un control de calidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué vigencia tiene el certificado de cumplimiento de BPM homeopáticas según el Decreto 3554?';
    v_t4 := 'El certificado de cumplimiento de BPM homeopáticas tiene una vigencia de cinco años, renovable (art. 11), y el artículo 12 prevé visitas de inspección al menos una vez al año. El certificado de capacidad de producción tiene vigencia de un año (arts. 13 y 14).';
    v_j1 := $evhomeo_json${"external_id":"homeo-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Certificación BPM: guía de verificación (Res. 3665/2009) y clasificación de no conformidades","outcome":"Certificación BPM: guía de verificación (Res. 3665/2009) y clasificación de no conformidades","source":"Decreto 3554 de 2004, arts. 9 a 14."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u2-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Un año, renovable cada año con una visita del Invima a la planta.', FALSE, 'Esa es la vigencia de otro certificado.', 0),
      (v_pregunta, 'Cinco años, renovable, con visitas de inspección al menos una vez al año.', TRUE, 'Correcto. Arts. 11 y 12.', 1),
      (v_pregunta, 'Indefinida, porque la certificación de BPM no vence nunca.', FALSE, 'Tiene vigencia. Revisa la explicación.', 2),
      (v_pregunta, 'Diez años, igual que el registro sanitario original.', FALSE, 'No es la vigencia del certificado.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En una visita, el Invima encuentra que un laboratorio homeopático no separa las áreas de dinamización de diluciones bajas y altas. ¿Cuál es la mejor valoración?';
    v_t4 := 'Las BPM homeopáticas buscan evitar la contaminación cruzada entre cepas y diluciones; la falta de separación entre diluciones bajas y altas es un hallazgo relevante que exige acciones correctivas y preventivas.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Manual de BPM homeopáticas: Resolución 4594 de 2007","outcome":"Manual de BPM homeopáticas: Resolución 4594 de 2007","source":"Manual de BPM homeopáticas; Decreto 3554 de 2004, arts. 9 a 12."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u2-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No importa, porque todas las diluciones son prácticamente agua sin riesgo alguno.', FALSE, 'Hay riesgo de contaminación cruzada.', 0),
      (v_pregunta, 'Es aceptable si los operarios se lavan las manos entre una dilución y otra.', FALSE, 'No reemplaza la separación.', 1),
      (v_pregunta, 'Es un hallazgo relevante: hay riesgo de contaminación cruzada y se requiere un plan de acción.', TRUE, 'Correcto. Según las BPM homeopáticas.', 2),
      (v_pregunta, 'Es un hallazgo solo si el producto es de venta bajo fórmula médica.', FALSE, 'Aplica a todos los productos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz homeo-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Registro sanitario de medicamentos homeopáticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Registro sanitario de medicamentos homeopáticos) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Registro sanitario de medicamentos homeopáticos';
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


    v_t3 := '¿Qué evaluaciones exige el Decreto 3554 para el registro de un homeopático?';
    v_t4 := 'Los artículos 25 a 27 exigen evaluación farmacéutica y legal; el artículo 29 exige para los complejos la evaluación de utilidad terapéutica, con 90 días hábiles para el concepto de la Comisión Revisora.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Modalidades de registro y evaluación farmacéutica y legal","outcome":"Modalidades de registro y evaluación farmacéutica y legal","source":"Decreto 3554 de 2004, arts. 25 a 30."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u3-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Solo la evaluación legal, porque los homeopáticos no tienen principios activos medibles.', FALSE, 'También se exige la farmacéutica.', 0),
      (v_pregunta, 'La farmacéutica y la legal; para complejos, además, la de utilidad terapéutica.', TRUE, 'Correcto. Arts. 25 a 30.', 1),
      (v_pregunta, 'Solo la evaluación farmacológica de eficacia con ensayos clínicos de fase III.', FALSE, 'No es la regla del decreto.', 2),
      (v_pregunta, 'Ninguna, porque los homeopáticos se registran de forma automática.', FALSE, 'Requieren evaluaciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un laboratorio fabrica gránulos de una misma cepa en diez diluciones. ¿Cuántos registros necesita según el artículo 24?';
    v_t4 := 'El artículo 24 dispone que los homeopáticos simples de una misma cepa, en distintas diluciones y una misma forma farmacéutica, se consideran como grupo y se amparan con un solo registro.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Registro simplificado por cepa (MHS) para homeopáticos simples sin indicación","outcome":"Registro simplificado por cepa (MHS) para homeopáticos simples sin indicación","source":"Decreto 3554 de 2004, art. 24."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u3-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Uno: las diluciones de una misma cepa y forma farmacéutica forman un grupo.', TRUE, 'Correcto. Así lo dispone el artículo 24.', 0),
      (v_pregunta, 'Diez, uno por cada dilución, porque cada una es un producto distinto con su propia potencia.', FALSE, 'Las diluciones se agrupan en un registro.', 1),
      (v_pregunta, 'Ninguno, porque los gránulos simples están exentos de registro.', FALSE, 'Requieren registro. Revisa la explicación.', 2),
      (v_pregunta, 'Dos: uno para diluciones bajas y otro para diluciones altas.', FALSE, 'No es la regla del artículo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular quiere ampliar la vida útil de unos gránulos a siete años. ¿Qué análisis es correcto?';
    v_t4 := 'El parágrafo 2 del artículo 26, modificado por el Decreto 1861 de 2006, fija una vida útil máxima de cinco años para formas sólidas o líquidas.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Modificaciones al registro homeopático por nivel de riesgo","outcome":"Modificaciones al registro homeopático por nivel de riesgo","source":"Decreto 3554 de 2004, art. 26."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u3-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es posible si el producto se conserva en un empaque de vidrio ámbar.', FALSE, 'El empaque no supera el límite.', 0),
      (v_pregunta, 'Es posible si el laboratorio tiene la certificación de BPM vigente.', FALSE, 'La certificación no supera el límite.', 1),
      (v_pregunta, 'Es posible si se presentan estudios de estabilidad acelerada de seis meses en cámara climática.', FALSE, 'El límite no depende del estudio.', 2),
      (v_pregunta, 'No: el artículo 26 fija un máximo de cinco años para formas sólidas o líquidas.', TRUE, 'Correcto. Parágrafo 2, modificado en 2006.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un titular radica una solicitud de renovación de un registro homeopático en 2026. ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 22 del Decreto 3554 (renovación) fue derogado por el Decreto 334 de 2022 y el Decreto 1474 de 2023 estableció la vigencia indefinida de los registros. El control se traslada a las modificaciones y a la vigilancia.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Modificaciones al registro homeopático por nivel de riesgo","outcome":"Modificaciones al registro homeopático por nivel de riesgo","source":"Decreto 3554 de 2004, art. 22; Decreto 334 de 2022; Decreto 1474 de 2023."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u3-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es lo correcto, porque el artículo 22 del Decreto 3554 exige renovar el registro cada diez años.', FALSE, 'Ese artículo fue derogado.', 0),
      (v_pregunta, 'Es necesaria solo si el producto cambió de fabricante.', FALSE, 'No es un caso de renovación.', 1),
      (v_pregunta, 'Es innecesaria: la renovación se derogó y el registro tiene vigencia indefinida.', TRUE, 'Correcto. Decretos 334 de 2022 y 1474 de 2023.', 2),
      (v_pregunta, 'Es necesaria solo para los homeopáticos complejos con indicación.', FALSE, 'No hay esa distinción.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz homeo-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia';
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


    v_t3 := '¿Qué leyendas exige el artículo 43 del Decreto 3554 en la etiqueta de un homeopático?';
    v_t4 := 'El artículo 43 exige, entre otros, la leyenda «Medicamento Homeopático», la condición de venta y «Manténgase fuera del alcance de los niños». El artículo 41 exige el castellano, salvo el nombre de la cepa en latín.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Etiquetado de medicamentos homeopáticos: contenido, idioma, nombres y prohibiciones","outcome":"Etiquetado de medicamentos homeopáticos: contenido, idioma, nombres y prohibiciones","source":"Decreto 3554 de 2004, arts. 41 y 43."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u4-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, '«Producto natural sin efectos secundarios» y «Recomendado por médicos».', FALSE, 'No son leyendas exigidas.', 0),
      (v_pregunta, '«Garantía de curación» y «Sin contraindicaciones conocidas».', FALSE, 'Son afirmaciones prohibidas.', 1),
      (v_pregunta, '«Medicamento homeopático» y «Manténgase fuera del alcance de los niños», entre otras.', TRUE, 'Correcto. Art. 43. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Solo el nombre comercial, porque los homeopáticos no requieren leyendas.', FALSE, 'Se exigen leyendas. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un homeopático importado llega con la etiqueta del país de origen. ¿Qué exige el artículo 44?';
    v_t4 := 'El artículo 44 acepta las etiquetas del país de origen con información mínima en castellano; su parágrafo 2 prohíbe indicaciones o propiedades terapéuticas en etiquetas y envases.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Etiquetado de medicamentos homeopáticos: contenido, idioma, nombres y prohibiciones","outcome":"Etiquetado de medicamentos homeopáticos: contenido, idioma, nombres y prohibiciones","source":"Decreto 3554 de 2004, art. 44."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u4-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que se reemplace toda la etiqueta por una nueva fabricada en Colombia.', FALSE, 'No exige reemplazarla.', 0),
      (v_pregunta, 'Que incluya información mínima en castellano y no muestre indicaciones terapéuticas.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'Que se venda sin etiqueta, solo con un folleto explicativo aparte.', FALSE, 'Debe estar etiquetado.', 2),
      (v_pregunta, 'Que muestre en grande todas las indicaciones del país de origen.', FALSE, 'Están prohibidas. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un homeopático se llama «Curansiedad». ¿Qué análisis es correcto según los artículos 46 y 47?';
    v_t4 := 'Los artículos 46 y 47 prohíben nombres engañosos, exagerados o que indiquen usos farmacológicos. «Curansiedad» sugiere una curación y un uso, por lo que no es admisible.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Publicidad de homeopáticos bajo la Resolución 1896 de 2023","outcome":"Publicidad de homeopáticos bajo la Resolución 1896 de 2023","source":"Decreto 3554 de 2004, arts. 46 y 47."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u4-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Indica un uso y puede inducir a engaño, por lo que no está permitido.', TRUE, 'Correcto. Arts. 46 y 47.', 0),
      (v_pregunta, 'Es un nombre válido porque describe claramente para qué sirve el producto.', FALSE, 'Indicar usos en el nombre está prohibido.', 1),
      (v_pregunta, 'Es válido si el producto es de venta bajo fórmula médica.', FALSE, 'La condición de venta no lo habilita.', 2),
      (v_pregunta, 'Es válido si la marca está registrada ante la Superintendencia.', FALSE, 'El registro de marca no lo habilita.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una farmacia homeopática quiere vender con marca propia, en supermercados, un oficinal que prepara en lotes grandes. ¿Cuál es la mejor valoración?';
    v_t4 := 'El Decreto 1737 de 2005 regula la preparación y dispensación de magistrales y oficinales en farmacias homeopáticas, con límites. Producir en lotes y comercializar con marca en otros canales corresponde a un producto industrial que requiere registro sanitario según el Decreto 3554.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: una farmacia Nivel II quiere escalar un oficinal con marca propia","outcome":"Caso práctico: una farmacia Nivel II quiere escalar un oficinal con marca propia","source":"Decreto 1737 de 2005; Decreto 3554 de 2004, art. 15."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u4-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es válido, porque los oficinales pueden venderse en cualquier canal sin registro.', FALSE, 'Los oficinales tienen límites.', 0),
      (v_pregunta, 'Es válido si la farmacia tiene más de diez años de funcionamiento.', FALSE, 'La antigüedad no cambia el régimen.', 1),
      (v_pregunta, 'Es válido si el oficinal se prepara solo con cepas de farmacopea.', FALSE, 'No resuelve el cambio de régimen.', 2),
      (v_pregunta, 'Excede los límites del Decreto 1737: comercializarlo así exige pasar al régimen de registro.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz homeo-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Contexto internacional, debate científico y comunicación responsable' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Contexto internacional, debate científico y comunicación responsable) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Contexto internacional, debate científico y comunicación responsable';
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


    v_t3 := '¿Qué concluyó el Consejo Consultivo Científico de las Academias Europeas (EASAC) en 2017 sobre la homeopatía?';
    v_t4 := 'La declaración de EASAC de 2017 concluyó que no hay enfermedades conocidas para las que exista evidencia robusta y reproducible de que la homeopatía sea eficaz más allá del placebo, y advirtió sobre el riesgo de retrasar tratamientos eficaces.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Qué dice la evidencia: EASAC, Real Academia Nacional de Farmacia y AEMPS (2026)","outcome":"Qué dice la evidencia: EASAC, Real Academia Nacional de Farmacia y AEMPS (2026)","source":"EASAC (2017), Homeopathic products and practices."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u5-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que la homeopatía es más eficaz que los medicamentos convencionales para enfermedades crónicas.', FALSE, 'No fue su conclusión.', 0),
      (v_pregunta, 'Que no hay enfermedades para las que exista evidencia robusta de eficacia más allá del placebo.', TRUE, 'Correcto. Con riesgos de demorar tratamientos.', 1),
      (v_pregunta, 'Que la homeopatía debe reemplazar a los antibióticos en las infecciones leves.', FALSE, 'No fue su conclusión.', 2),
      (v_pregunta, 'Que la homeopatía está prohibida en todos los países de la Unión Europea.', FALSE, 'No está prohibida. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En la Unión Europea, ¿qué condiciones tiene el registro simplificado de homeopáticos (Directiva 2001/83/CE)?';
    v_t4 := 'La Directiva 2001/83/CE prevé un registro simplificado para homeopáticos de vía oral o externa, sin indicación terapéutica en la etiqueta y con un grado de dilución que garantice la seguridad (por ejemplo, no más de una parte por 10.000 de la tintura madre).';
    v_j1 := $evhomeo_json${"external_id":"homeo-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Unión Europea: Directiva 2001/83/CE y registro simplificado (arts. 13–16)","outcome":"Unión Europea: Directiva 2001/83/CE y registro simplificado (arts. 13–16)","source":"Directiva 2001/83/CE, arts. 13 a 16."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u5-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Vía oral o externa, sin indicación terapéutica y con una dilución que garantice la seguridad.', TRUE, 'Correcto. Arts. 13 a 16.', 0),
      (v_pregunta, 'Cualquier vía, incluida la inyectable, con indicación terapéutica aprobada por la agencia europea.', FALSE, 'Excluye indicaciones e inyectables.', 1),
      (v_pregunta, 'Solo productos complejos con estudios clínicos de fase III.', FALSE, 'No es el registro simplificado.', 2),
      (v_pregunta, 'Productos sin control de calidad, porque su dilución es muy alta.', FALSE, 'La calidad se controla.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con diabetes tipo 1 pregunta en la farmacia si puede cambiar la insulina por un homeopático. ¿Qué análisis es correcto para el QF?';
    v_t4 := 'Suspender la insulina en diabetes tipo 1 pone en riesgo la vida. El químico farmacéutico debe informar con claridad que un homeopático no reemplaza un tratamiento esencial y remitir al médico, de acuerdo con la evidencia y su rol educativo.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Comunicación responsable del QF y del área de mercadeo","outcome":"Comunicación responsable del QF y del área de mercadeo","source":"EASAC (2017); ética profesional del químico farmacéutico."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u5-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Puede recomendarlo si el producto tiene registro sanitario vigente del Invima.', FALSE, 'El registro no prueba eficacia para esa condición.', 0),
      (v_pregunta, 'Puede recomendarlo como complemento y suspender la insulina de forma gradual.', FALSE, 'Suspender la insulina es peligroso.', 1),
      (v_pregunta, 'Debe explicar que no puede reemplazar la insulina y remitir al médico tratante.', TRUE, 'Correcto. La seguridad del paciente es prioritaria.', 2),
      (v_pregunta, 'Debe vender el producto, porque la decisión es solo del paciente.', FALSE, 'El QF tiene un deber de orientación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Mercadeo quiere decir que una línea homeopática está «científicamente comprobada» porque tiene registro del Invima. ¿Cuál es la mejor valoración?';
    v_t4 := 'El registro de un homeopático verifica calidad, condiciones legales y, en complejos, una utilidad terapéutica según la norma; no equivale a eficacia demostrada con estándares científicos. Decir «científicamente comprobado» induce a error.';
    v_j1 := $evhomeo_json${"external_id":"homeo-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Comunicación responsable del QF y del área de mercadeo","outcome":"Comunicación responsable del QF y del área de mercadeo","source":"Decreto 3554 de 2004, arts. 25 a 30; EASAC (2017)."}$evhomeo_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'homeo-u5-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcto, porque el registro sanitario certifica la eficacia del producto.', FALSE, 'El registro no equivale a eficacia comprobada.', 0),
      (v_pregunta, 'Es correcto si el producto se vende en farmacias reconocidas.', FALSE, 'El canal no cambia la evidencia.', 1),
      (v_pregunta, 'Es correcto si lo dice un médico homeópata en el anuncio.', FALSE, 'La opinión no sustituye la evidencia.', 2),
      (v_pregunta, 'Es engañoso: el registro no prueba eficacia científica.', TRUE, 'Correcto. Aprueba calidad y condiciones de uso.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad homeo-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Clasificación del portafolio de un laboratorio homeopático';
  v_t2 := $evhomeo_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Clasifica cada producto (simple, complejo, magistral u otro).</li><li>Indica si se agrupa bajo un solo registro por cepa (art. 24).</li><li>Indica qué evaluaciones exige cada uno (arts. 25 a 30).</li><li>Analiza el producto con cepa no farmacopeica.</li><li>Resume los riesgos de cada producto.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar las categorías del Decreto 3554 y del Decreto 1737.</li><li>Asignar el trámite de cada producto.</li><li>Identificar los riesgos regulatorios.</li></ul>
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
  <tr><td>Clasificación</td><td>35 %</td><td>Clasifica bien los cuatro productos.</td><td>Clasifica bien dos o tres.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Trámite y evaluaciones</td><td>35 %</td><td>Agrupación por cepa (art. 24), evaluaciones farmacéutica y legal y utilidad terapéutica para el complejo (art. 29).</td><td>Trámite impreciso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Riesgos</td><td>20 %</td><td>Identifica la cepa no farmacopeica y la indicación del complejo como riesgos.</td><td>Riesgos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evhomeo_html$;
  v_t3 := $evhomeo_html$<h2>Caso de estudio</h2>
<p>Homeolab (ficticia) tiene en su portafolio (datos simulados): (1) gránulos de una sola cepa en diluciones 6, 12 y 30 CH; (2) gotas que combinan cinco cepas para «el resfriado»; (3) preparados para pacientes según fórmula médica en su farmacia; (4) un producto importado de una cepa no incluida en ninguna farmacopea oficial.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evhomeo_html$;
  v_t4 := 'Tabla de clasificación con trámite y riesgos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evhomeo_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 3554 de 2004 y Decreto 1861 de 2006; Decreto 1737 de 2005; Decreto 334 de 2022; Decreto 1474 de 2023; farmacopeas homeopáticas oficiales; manual de BPM homeopáticas; EASAC (2017), declaración sobre productos homeopáticos; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evhomeo_html$;
  v_t7 := NULL;
  v_j1 := $evhomeo_json$["Clasificación.","Agrupación por cepa.","Evaluaciones.","Cepa no farmacopeica.","Riesgos."]$evhomeo_json$::jsonb;
  v_j2 := $evhomeo_json${"version":1,"total":100,"criteria":[{"id":"clasificacion","name":"Clasificación","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Clasifica bien los cuatro productos."},{"level":3,"label":"Logrado","description":"Clasifica bien dos o tres."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tramite-y-evaluaciones","name":"Trámite y evaluaciones","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Agrupación por cepa (art. 24), evaluaciones farmacéutica y legal y utilidad terapéutica para el complejo (art. 29)."},{"level":3,"label":"Logrado","description":"Trámite impreciso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"riesgos","name":"Riesgos","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Identifica la cepa no farmacopeica y la indicación del complejo como riesgos."},{"level":3,"label":"Logrado","description":"Riesgos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evhomeo_json$::jsonb;
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


  -- ── Actividad homeo-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Preparación de la visita de certificación de BPM homeopáticas';
  v_t2 := $evhomeo_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Clasifica cada hallazgo como crítico, mayor o menor, y justifica.</li><li>Propón acciones correctivas y preventivas para cada uno.</li><li>Asigna responsables y fechas antes de la visita.</li><li>Prioriza el plan según el riesgo para el producto.</li><li>Define cómo demostrarás el cierre de cada acción.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar los hallazgos por riesgo.</li><li>Diseñar un plan de acción.</li><li>Priorizar según el impacto en la calidad.</li></ul>
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
  <tr><td>Clasificación</td><td>30 %</td><td>Clasificación justificada por riesgo (identidad y contaminación cruzada como más graves).</td><td>Clasificación sin justificar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan de acción</td><td>40 %</td><td>Acciones concretas con responsables, fechas y evidencia de cierre.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Priorización</td><td>20 %</td><td>Prioriza identidad de tinturas y separación de áreas.</td><td>Sin priorización clara.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evhomeo_html$;
  v_t3 := $evhomeo_html$<h2>Caso de estudio</h2>
<p>Laboratorio Similia (ficticio) recibirá la visita de certificación de BPM homeopáticas en tres meses (datos simulados). La autoinspección encontró: tinturas madre sin certificado de identidad; un solo cuarto para todas las dinamizaciones; registros de lote incompletos; y un proveedor de lactosa sin calificar.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evhomeo_html$;
  v_t4 := 'Plan de acción para la visita de BPM.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evhomeo_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 3554 de 2004 y Decreto 1861 de 2006; Decreto 1737 de 2005; Decreto 334 de 2022; Decreto 1474 de 2023; farmacopeas homeopáticas oficiales; manual de BPM homeopáticas; EASAC (2017), declaración sobre productos homeopáticos; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evhomeo_html$;
  v_t7 := NULL;
  v_j1 := $evhomeo_json$["Clasificación.","Acciones.","Responsables.","Priorización.","Evidencia de cierre."]$evhomeo_json$::jsonb;
  v_j2 := $evhomeo_json${"version":1,"total":100,"criteria":[{"id":"clasificacion","name":"Clasificación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Clasificación justificada por riesgo (identidad y contaminación cruzada como más graves)."},{"level":3,"label":"Logrado","description":"Clasificación sin justificar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-de-accion","name":"Plan de acción","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Acciones concretas con responsables, fechas y evidencia de cierre."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"priorizacion","name":"Priorización","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Prioriza identidad de tinturas y separación de áreas."},{"level":3,"label":"Logrado","description":"Sin priorización clara."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evhomeo_json$::jsonb;
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


  -- ── Actividad homeo-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Revisión de etiqueta y publicidad de un homeopático';
  v_t2 := $evhomeo_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Revisa la etiqueta frente a los artículos 41, 43, 44, 46 y 47.</li><li>Analiza el nombre del producto.</li><li>Analiza el post de redes sociales.</li><li>Redacta la etiqueta y el post corregidos.</li><li>Indica qué norma de publicidad verificarías como vigente.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Detectar incumplimientos de etiqueta.</li><li>Detectar afirmaciones engañosas en la publicidad.</li><li>Proponer textos corregidos.</li></ul>
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
  <tr><td>Etiqueta y nombre</td><td>35 %</td><td>Detecta idioma, leyenda faltante, indicación prohibida y nombre engañoso.</td><td>Detecta parte de los hallazgos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Publicidad</td><td>30 %</td><td>Detecta afirmaciones de inocuidad y de reemplazo de tratamientos.</td><td>Análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Correcciones</td><td>25 %</td><td>Textos corregidos y verificación de la norma vigente de publicidad.</td><td>Correcciones incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evhomeo_html$;
  v_t3 := $evhomeo_html$<h2>Caso de estudio</h2>
<p>Homeovida (ficticia) presenta para aprobación interna (datos simulados) la etiqueta de un homeopático complejo importado llamado «Duerme Ya», con la frase «elimina el insomnio en tres noches», sin la leyenda «Medicamento homeopático», con el texto principal en francés, y un post para redes que dice «100 % natural, sin riesgos, reemplaza tus pastillas para dormir».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evhomeo_html$;
  v_t4 := 'Informe de revisión con textos corregidos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evhomeo_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 3554 de 2004 y Decreto 1861 de 2006; Decreto 1737 de 2005; Decreto 334 de 2022; Decreto 1474 de 2023; farmacopeas homeopáticas oficiales; manual de BPM homeopáticas; EASAC (2017), declaración sobre productos homeopáticos; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evhomeo_html$;
  v_t7 := NULL;
  v_j1 := $evhomeo_json$["Etiqueta.","Nombre.","Publicidad.","Textos corregidos.","Norma vigente."]$evhomeo_json$::jsonb;
  v_j2 := $evhomeo_json${"version":1,"total":100,"criteria":[{"id":"etiqueta-y-nombre","name":"Etiqueta y nombre","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Detecta idioma, leyenda faltante, indicación prohibida y nombre engañoso."},{"level":3,"label":"Logrado","description":"Detecta parte de los hallazgos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"publicidad","name":"Publicidad","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Detecta afirmaciones de inocuidad y de reemplazo de tratamientos."},{"level":3,"label":"Logrado","description":"Análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"correcciones","name":"Correcciones","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Textos corregidos y verificación de la norma vigente de publicidad."},{"level":3,"label":"Logrado","description":"Correcciones incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evhomeo_json$::jsonb;
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


  -- ── Actividad homeo-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Registro sanitario de medicamentos homeopáticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Registro sanitario de medicamentos homeopáticos) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: clasificación, calidad y registro de la línea homeopática';
  v_t2 := $evhomeo_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos de los productos (ficticios).</li><li>Fase 1: clasifica cada producto (arts. 2 y 18).</li><li>Fase 2: verifica farmacopeas (art. 3), la cepa no farmacopeica y las BPM (arts. 9 a 12).</li><li>Fase 3: define registros (agrupación del art. 24), evaluaciones (arts. 25 a 30) y vida útil (art. 26).</li><li>Fase 3: explica la vigencia del registro tras los Decretos 334 de 2022 y 1474 de 2023.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco y clasificación).</strong> Clasificación de la línea.</li>
  <li><strong>Fase 2 · Unidad 2 (calidad y BPM).</strong> Farmacopeas, cepas y BPM.</li>
  <li><strong>Fase 3 · Unidad 3 (registro).</strong> Ruta de registro y vigencia.</li>
  <li><strong>Fase 4 · Unidad 4 (etiquetado y publicidad).</strong> Etiquetas, nombres y publicidad.</li>
  <li><strong>Fase 5 · Unidad 5 (comunicación responsable).</strong> Mensajes basados en la evidencia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar la línea y definir la ruta de registro.</li><li>Asegurar la calidad y las BPM.</li></ul>
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
  <tr><td>Clasificación</td><td>20 %</td><td>Clasifica bien los cinco productos.</td><td>Clasificación con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Calidad</td><td>30 %</td><td>Farmacopeas oficiales, tratamiento de la cepa no farmacopeica y BPM certificadas.</td><td>Calidad incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Registro</td><td>40 %</td><td>Agrupación por cepa, utilidad terapéutica del complejo, vida útil máxima y vigencia indefinida.</td><td>Registro impreciso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evhomeo_html$;
  v_t3 := $evhomeo_html$<h2>Caso de estudio</h2>
<p>Similar Andina (ficticia) quiere lanzar en Colombia una línea de cinco homeopáticos: tres simples de una misma cepa en distintas diluciones, un complejo importado con indicación y un producto de cepa no farmacopeica (datos simulados). Te encargan el dictamen regulatorio y de comunicación. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evhomeo_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evhomeo_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 3554 de 2004 y Decreto 1861 de 2006; Decreto 1737 de 2005; Decreto 334 de 2022; Decreto 1474 de 2023; farmacopeas homeopáticas oficiales; manual de BPM homeopáticas; EASAC (2017), declaración sobre productos homeopáticos; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evhomeo_html$;
  v_t7 := NULL;
  v_j1 := $evhomeo_json$["Clasificación.","Farmacopeas y cepas.","BPM.","Registros y evaluaciones.","Vigencia."]$evhomeo_json$::jsonb;
  v_j2 := $evhomeo_json${"version":1,"total":100,"criteria":[{"id":"clasificacion","name":"Clasificación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Clasifica bien los cinco productos."},{"level":3,"label":"Logrado","description":"Clasificación con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"calidad","name":"Calidad","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Farmacopeas oficiales, tratamiento de la cepa no farmacopeica y BPM certificadas."},{"level":3,"label":"Logrado","description":"Calidad incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"registro","name":"Registro","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Agrupación por cepa, utilidad terapéutica del complejo, vida útil máxima y vigencia indefinida."},{"level":3,"label":"Logrado","description":"Registro impreciso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evhomeo_json$::jsonb;
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


  -- ── Actividad homeo-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Contexto internacional, debate científico y comunicación responsable' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Contexto internacional, debate científico y comunicación responsable) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: etiquetado, publicidad y comunicación de la línea homeopática';
  v_t2 := $evhomeo_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: redacta las etiquetas con las leyendas del art. 43 y las reglas de los arts. 41, 44, 46 y 47.</li><li>Fase 4: define las reglas de publicidad verificando la norma vigente.</li><li>Fase 5: redacta mensajes para profesionales y pacientes que no induzcan a error.</li><li>Fase 5: define la farmacovigilancia de la línea.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el dictamen en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco y clasificación).</strong> Clasificación de la línea.</li>
  <li><strong>Fase 2 · Unidad 2 (calidad y BPM).</strong> Farmacopeas, cepas y BPM.</li>
  <li><strong>Fase 3 · Unidad 3 (registro).</strong> Ruta de registro y vigencia.</li>
  <li><strong>Fase 4 · Unidad 4 (etiquetado y publicidad).</strong> Etiquetas, nombres y publicidad.</li>
  <li><strong>Fase 5 · Unidad 5 (comunicación responsable).</strong> Mensajes basados en la evidencia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar etiquetas y nombres conformes.</li><li>Definir una comunicación responsable basada en la evidencia.</li></ul>
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
  <tr><td>Etiquetas</td><td>30 %</td><td>Leyendas, idioma, nombres no engañosos y sin indicaciones donde están prohibidas.</td><td>Etiquetas con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación</td><td>30 %</td><td>Mensajes transparentes que no prometen eficacia no demostrada ni reemplazo de tratamientos.</td><td>Mensajes con afirmaciones dudosas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vigilancia</td><td>15 %</td><td>Plan de farmacovigilancia con notificación de eventos.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evhomeo_html$;
  v_t3 := $evhomeo_html$<h2>Caso de estudio</h2>
<p>Similar Andina (ficticia) quiere lanzar en Colombia una línea de cinco homeopáticos: tres simples de una misma cepa en distintas diluciones, un complejo importado con indicación y un producto de cepa no farmacopeica (datos simulados). Te encargan el dictamen regulatorio y de comunicación. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el dictamen que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evhomeo_html$;
  v_t4 := 'Dictamen regulatorio y de comunicación con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evhomeo_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 3554 de 2004 y Decreto 1861 de 2006; Decreto 1737 de 2005; Decreto 334 de 2022; Decreto 1474 de 2023; farmacopeas homeopáticas oficiales; manual de BPM homeopáticas; EASAC (2017), declaración sobre productos homeopáticos; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evhomeo_html$;
  v_t7 := NULL;
  v_j1 := $evhomeo_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Etiquetas.","Publicidad.","Comunicación responsable.","Farmacovigilancia y resumen."]$evhomeo_json$::jsonb;
  v_j2 := $evhomeo_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"etiquetas","name":"Etiquetas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Leyendas, idioma, nombres no engañosos y sin indicaciones donde están prohibidas."},{"level":3,"label":"Logrado","description":"Etiquetas con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion","name":"Comunicación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Mensajes transparentes que no prometen eficacia no demostrada ni reemplazo de tratamientos."},{"level":3,"label":"Logrado","description":"Mensajes con afirmaciones dudosas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vigilancia","name":"Vigilancia","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Plan de farmacovigilancia con notificación de eventos."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evhomeo_json$::jsonb;
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


  -- ── Foro homeo-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con medicamentos homeopáticos';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evhomeo_html$<h2>Para empezar</h2>
<p>Piensa en un homeopático que hayas dispensado, registrado o conocido y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evhomeo_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evhomeo_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evhomeo_html$;
  v_t6 := $evhomeo_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evhomeo_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has orientado a pacientes que usan homeopáticos?', '¿Qué te parece más difícil: la norma, la calidad o la comunicación?']::text[];
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


  -- ── Foro homeo-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Un régimen propio para la homeopatía';
  v_t2 := 'Argumentar por qué los homeopáticos tienen un régimen regulatorio diferente.';
  v_t3 := $evhomeo_html$<h2>Caso del foro</h2>
<p>En una clase ficticia, un estudiante afirma que los homeopáticos «no deberían regularse porque son agua» y otro que «deberían evaluarse como cualquier medicamento» (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evhomeo_html$;
  v_t4 := '¿Qué respondes a ambas posiciones desde la regulación sanitaria?';
  v_t5 := $evhomeo_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo o la fuente que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evhomeo_html$;
  v_t6 := $evhomeo_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo o la fuente que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evhomeo_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué controla la regulación aunque se discuta la eficacia?', '¿Qué exige el Decreto 3554 para los complejos?', '¿Qué papel tiene la calidad en la seguridad?']::text[];
  v_j1 := $evhomeo_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo o la fuente que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evhomeo_json$::jsonb;
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


  -- ── Foro homeo-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Calidad en lo infinitesimal';
  v_t2 := 'Argumentar por qué la calidad importa en productos muy diluidos.';
  v_t3 := $evhomeo_html$<h2>Caso del foro</h2>
<p>El gerente de un laboratorio ficticio cuestiona el costo de los controles de calidad «porque en 30 CH no queda nada de la cepa» (datos simulados). El laboratorio también fabrica productos en 3 D y 6 D.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evhomeo_html$;
  v_t4 := '¿Qué le responderías?';
  v_t5 := $evhomeo_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la farmacopea que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evhomeo_html$;
  v_t6 := $evhomeo_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la farmacopea que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evhomeo_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué riesgos tienen las diluciones bajas?', '¿Qué controles aplican al vehículo y al producto terminado?', '¿Qué exige el Decreto 3554 sobre BPM?']::text[];
  v_j1 := $evhomeo_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la farmacopea que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evhomeo_json$::jsonb;
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


  -- ── Foro homeo-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Registro sanitario de medicamentos homeopáticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Registro sanitario de medicamentos homeopáticos) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Utilidad terapéutica de los complejos';
  v_t2 := 'Argumentar qué evidencia es razonable para la utilidad terapéutica de un homeopático complejo.';
  v_t3 := $evhomeo_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio presenta un complejo de seis cepas «para la ansiedad» con referencias de materias médicas homeopáticas y testimonios de pacientes (datos simulados). La Comisión Revisora pide más información.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evhomeo_html$;
  v_t4 := '¿Qué evidencia presentarías y qué limitaciones reconocerías?';
  v_t5 := $evhomeo_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo o la fuente que sustenta tu posición. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evhomeo_html$;
  v_t6 := $evhomeo_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo o la fuente que sustenta tu posición.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evhomeo_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué evalúa la Comisión en la utilidad terapéutica?', '¿Qué riesgos tiene la indicación «ansiedad»?', '¿Cómo comunicarías los límites de la evidencia?']::text[];
  v_j1 := $evhomeo_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo o la fuente que sustenta tu posición."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evhomeo_json$::jsonb;
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


  -- ── Foro homeo-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Publicidad de homeopáticos en redes';
  v_t2 := 'Argumentar cómo comunicar un homeopático en redes sociales sin inducir a error.';
  v_t3 := $evhomeo_html$<h2>Caso del foro</h2>
<p>Una marca ficticia publica en redes: «Adiós a los antibióticos: nuestro homeopático cura las infecciones de tus hijos» (datos simulados). El post tiene miles de compartidos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evhomeo_html$;
  v_t4 := '¿Qué problemas ves y cómo debería corregirse?';
  v_t5 := $evhomeo_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evhomeo_html$;
  v_t6 := $evhomeo_html$<h2>Normas de participación</h2>
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
</details>$evhomeo_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué prohíben los artículos 44, 46 y 47?', '¿Qué riesgo tiene sugerir dejar los antibióticos?', '¿Qué norma rige hoy la publicidad, tras la derogatoria de los arts. 48 y 49?']::text[];
  v_j1 := $evhomeo_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evhomeo_json$::jsonb;
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


  -- ── Foro homeo-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Contexto internacional, debate científico y comunicación responsable' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Contexto internacional, debate científico y comunicación responsable) en Regulación de Medicamentos Homeopáticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · El químico farmacéutico frente a la homeopatía';
  v_t2 := 'Argumentar el rol del QF ante pacientes que usan homeopáticos.';
  v_t3 := $evhomeo_html$<h2>Caso del foro</h2>
<p>Una paciente ficticia en tratamiento oncológico usa varios homeopáticos y pregunta si son compatibles con su quimioterapia (datos simulados). Quiere sentirse escuchada y no juzgada.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evhomeo_html$;
  v_t4 := '¿Cómo la orientarías?';
  v_t5 := $evhomeo_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la fuente que sustenta cada recomendación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evhomeo_html$;
  v_t6 := $evhomeo_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la fuente que sustenta cada recomendación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evhomeo_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué riesgos directos e indirectos hay?', '¿Cómo comunicar la evidencia con respeto?', '¿Cuándo involucrar al oncólogo?']::text[];
  v_j1 := $evhomeo_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la fuente que sustenta cada recomendación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evhomeo_json$::jsonb;
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


  RAISE NOTICE 'Regulación de Medicamentos Homeopáticos: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evhomeo$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Registro Sanitario de Suplementos Dietarios
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evsupl$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Registro Sanitario de Suplementos Dietarios' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos: qué es un suplemento dietario y su marco normativo', 'Unidad 2. Composición: ingredientes, niveles máximos y evaluación de ingredientes nuevos', 'Unidad 3. Registro sanitario, fabricación e importación', 'Unidad 4. Rotulado, declaraciones de propiedades y publicidad', 'Unidad 5. Vigilancia, productos fraudulentos y comparación internacional']::text[])) < 5 THEN
    RAISE NOTICE 'Registro Sanitario de Suplementos Dietarios: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evsupl_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evsupl_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz supl-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: qué es un suplemento dietario y su marco normativo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: qué es un suplemento dietario y su marco normativo) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos: qué es un suplemento dietario y su marco normativo';
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


    v_t3 := 'Según el artículo 2 del Decreto 3249 de 2006, ¿qué es un suplemento dietario?';
    v_t4 := 'El artículo 2 define el suplemento dietario como el producto que adiciona la dieta normal y es fuente concentrada de nutrientes u otras sustancias con efecto fisiológico o nutricional; puede contener vitaminas, minerales, aminoácidos, plantas o extractos.';
    v_j1 := $evsupl_json${"external_id":"supl-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Definición legal de suplemento dietario","outcome":"Definición legal de suplemento dietario","source":"Decreto 3249 de 2006, art. 2."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u1-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Un producto que adiciona la dieta normal y es fuente concentrada de nutrientes u otras sustancias.', TRUE, 'Correcto. Lo sustenta la explicación.', 0),
      (v_pregunta, 'Un medicamento de venta libre que previene y trata deficiencias nutricionales graves en adultos.', FALSE, 'No es un medicamento.', 1),
      (v_pregunta, 'Un alimento que reemplaza las comidas principales en personas que buscan bajar de peso.', FALSE, 'No reemplaza comidas.', 2),
      (v_pregunta, 'Un producto fitoterapéutico de uso tradicional con plantas medicinales del listado del Invima.', FALSE, 'Es otra categoría. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un producto en cápsulas contiene un extracto vegetal y se anuncia «para tratar la gastritis». ¿Puede registrarse como suplemento dietario?';
    v_t4 := 'El artículo 3 (modificado por el Decreto 3863 de 2008) excluye de los suplementos los productos que se ajustan a las definiciones de medicamento o fitoterapéutico, y los artículos 24 y 25 prohíben indicaciones terapéuticas. La finalidad terapéutica lleva a otro régimen.';
    v_j1 := $evsupl_json${"external_id":"supl-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Frontera con alimentos, medicamentos y fitoterapéuticos","outcome":"Frontera con alimentos, medicamentos y fitoterapéuticos","source":"Decreto 3249 de 2006, arts. 3, 24 y 25."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u1-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Sí, porque contiene un extracto vegetal y se presenta en cápsulas como muchos suplementos.', FALSE, 'La finalidad terapéutica lo excluye.', 0),
      (v_pregunta, 'Sí, si la gastritis se menciona solo en la publicidad y no en la etiqueta.', FALSE, 'La publicidad tampoco puede tener indicaciones terapéuticas.', 1),
      (v_pregunta, 'No: con finalidad terapéutica no es suplemento; podría ser fitoterapéutico o medicamento.', TRUE, 'Correcto. Art. 3. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Sí, si el fabricante tiene certificado de BPM de alimentos.', FALSE, 'El certificado no cambia la categoría.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Quién conceptúa sobre un ingrediente que no está en las listas de referencia de suplementos?';
    v_t4 := 'El artículo 12 (numeral 2) dispone que, para ingredientes no incluidos en las listas de referencia, la Sala Especializada de la Comisión Revisora del Invima evalúa y decide; el artículo 5 toma como referencia a la FDA o la EFSA para las declaraciones.';
    v_j1 := $evsupl_json${"external_id":"supl-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"INVIMA y la Comisión Revisora: la Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios","outcome":"INVIMA y la Comisión Revisora: la Sala Especializada de Productos Fitoterapéuticos y Suplementos Dietarios","source":"Decreto 3249 de 2006, arts. 5 y 12."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u1-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El fabricante, con una declaración juramentada sobre la seguridad del ingrediente.', FALSE, 'La decisión no es del fabricante.', 0),
      (v_pregunta, 'La Sala Especializada de la Comisión Revisora del Invima.', TRUE, 'Correcto. Art. 12. Lo sustenta la explicación.', 1),
      (v_pregunta, 'La Superintendencia de Industria y Comercio, porque es un tema de consumo.', FALSE, 'No es su competencia.', 2),
      (v_pregunta, 'El Ministerio de Agricultura, porque los ingredientes vienen del campo.', FALSE, 'No es su competencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un consultor afirma que «los suplementos tienen vigencia indefinida desde 2023, como los medicamentos». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 13 del Decreto 3249 fija una vigencia de diez años renovables y el artículo 14 exige radicar la renovación al menos tres meses antes del vencimiento. La vigencia indefinida del Decreto 1474 de 2023 se refiere a medicamentos; cualquier cambio para suplementos debe verificarse en el normograma.';
    v_j1 := $evsupl_json${"external_id":"supl-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Decreto 3249 de 2006 y sus modificaciones (3863/2008, 272/2009, permanencia 2474/2018)","outcome":"Decreto 3249 de 2006 y sus modificaciones (3863/2008, 272/2009, permanencia 2474/2018)","source":"Decreto 3249 de 2006, arts. 13 y 14."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u1-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcta, porque toda norma de vigencia indefinida aplica a cualquier producto vigilado por el Invima.', FALSE, 'No se extiende automáticamente.', 0),
      (v_pregunta, 'Es correcta solo para los suplementos importados de Estados Unidos.', FALSE, 'No hay esa distinción.', 1),
      (v_pregunta, 'Es correcta si el suplemento contiene solo vitaminas y minerales.', FALSE, 'La composición no cambia la vigencia.', 2),
      (v_pregunta, 'Es imprecisa: el art. 13 fija diez años renovables; se verifica cualquier cambio.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz supl-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Composición: ingredientes, niveles máximos y evaluación de ingredientes nuevos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Composición: ingredientes, niveles máximos y evaluación de ingredientes nuevos) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Composición: ingredientes, niveles máximos y evaluación de ingredientes nuevos';
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


    v_t3 := '¿Dónde se fijan los niveles máximos de vitaminas, minerales y oligoelementos para suplementos?';
    v_t4 := 'El artículo 3 (modificado por el Decreto 3863 de 2008) limita los aportes diarios de vitaminas, minerales y oligoelementos según los niveles máximos tolerables; los valores están en el anexo 1 del Decreto 3863 de 2008, que derogó el anexo 1 original.';
    v_j1 := $evsupl_json${"external_id":"supl-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Niveles máximos de vitaminas, minerales y oligoelementos (Anexo 1)","outcome":"Niveles máximos de vitaminas, minerales y oligoelementos (Anexo 1)","source":"Decreto 3249 de 2006, art. 3; Decreto 3863 de 2008, anexo 1."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u2-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'En la ficha técnica que redacta cada fabricante según su criterio.', FALSE, 'Los fija la norma. Revisa la explicación.', 0),
      (v_pregunta, 'En el anexo 1 del Decreto 3863 de 2008, que reemplazó el anexo original.', TRUE, 'Correcto. Art. 3. Lo sustenta la explicación.', 1),
      (v_pregunta, 'En la publicidad aprobada del producto en redes sociales.', FALSE, 'No es una fuente normativa.', 2),
      (v_pregunta, 'En el registro de marca ante la Superintendencia de Industria y Comercio.', FALSE, 'No es una fuente normativa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Cuál de estas sustancias no puede contener un suplemento dietario según el artículo 3?';
    v_t4 := 'El artículo 3 excluye sustancias que representen riesgos para la salud (hormonas, residuos de plaguicidas, antibióticos, medicamentos veterinarios, metales pesados) y sustancias estupefacientes, psicotrópicas o que generen dependencia, así como ingredientes con alertas de calidad o inocuidad.';
    v_j1 := $evsupl_json${"external_id":"supl-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Sustancias prohibidas y ingredientes de riesgo","outcome":"Sustancias prohibidas y ingredientes de riesgo","source":"Decreto 3249 de 2006, art. 3."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u2-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Vitamina C en una dosis diaria dentro del nivel máximo permitido.', FALSE, 'Está permitida dentro de los niveles.', 0),
      (v_pregunta, 'Proteína de suero de leche como fuente de aminoácidos.', FALSE, 'Puede ser un ingrediente de suplementos.', 1),
      (v_pregunta, 'Hormonas, antibióticos o sustancias que generen dependencia.', TRUE, 'Correcto. Están excluidas.', 2),
      (v_pregunta, 'Magnesio dentro del nivel máximo tolerable diario.', FALSE, 'Está permitido dentro de los niveles.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En un producto «para quemar grasa» vendido como suplemento, un laboratorio detecta sibutramina. ¿Qué análisis es correcto?';
    v_t4 := 'Un suplemento no puede contener sustancias farmacológicas (art. 3). La presencia de un fármaco no declarado, como la sibutramina, configura un producto adulterado y fraudulento, que motiva alertas sanitarias y medidas de seguridad.';
    v_j1 := $evsupl_json${"external_id":"supl-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Sustancias prohibidas y ingredientes de riesgo","outcome":"Sustancias prohibidas y ingredientes de riesgo","source":"Decreto 3249 de 2006, art. 3; alertas sanitarias del Invima."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u2-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es un producto adulterado con un fármaco no declarado; es fraudulento y peligroso.', TRUE, 'Correcto. Genera alerta y medidas.', 0),
      (v_pregunta, 'Es aceptable si la sibutramina está en una dosis baja que no cause efectos.', FALSE, 'Un fármaco no declarado no es aceptable.', 1),
      (v_pregunta, 'Es aceptable si el producto tiene registro como suplemento.', FALSE, 'El registro no ampara la adulteración.', 2),
      (v_pregunta, 'Es un error de etiqueta que se corrige agregando el ingrediente a la lista.', FALSE, 'No es un error de etiqueta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un titular quiere incluir un ingrediente botánico nuevo sin estudios de seguridad, porque «es natural». ¿Cuál es la mejor valoración?';
    v_t4 := 'Para ingredientes no listados, la Sala Especializada evalúa con evidencia de seguridad, uso y referencias internacionales (FDA, EFSA, Codex) (arts. 5 y 12). Lo natural no es sinónimo de seguro.';
    v_j1 := $evsupl_json${"external_id":"supl-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: solicitud de evaluación de un ingrediente nuevo","outcome":"Caso: solicitud de evaluación de un ingrediente nuevo","source":"Decreto 3249 de 2006, arts. 5 y 12."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u2-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es suficiente, porque los ingredientes naturales no requieren evaluación de seguridad.', FALSE, 'La seguridad se evalúa.', 0),
      (v_pregunta, 'Es suficiente si el ingrediente se vende en otros países sin registro.', FALSE, 'No es evidencia suficiente.', 1),
      (v_pregunta, 'Es suficiente si se declara en la etiqueta con letra grande.', FALSE, 'Declararlo no prueba su seguridad.', 2),
      (v_pregunta, 'Es insuficiente: la Sala evalúa el ingrediente con evidencia de seguridad y referencias.', TRUE, 'Correcto. Art. 12. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz supl-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Registro sanitario, fabricación e importación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Registro sanitario, fabricación e importación) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Registro sanitario, fabricación e importación';
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


    v_t3 := '¿Qué modalidades de registro prevé el artículo 10 del Decreto 3249?';
    v_t4 := 'El artículo 10 prevé las modalidades fabricar y vender; importar y vender; e importar, empacar y vender. El artículo 9 exige el registro para fabricar, importar y comercializar.';
    v_j1 := $evsupl_json${"external_id":"supl-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Modalidades y requisitos documentales (arts. 9–11)","outcome":"Modalidades y requisitos documentales (arts. 9–11)","source":"Decreto 3249 de 2006, arts. 9 y 10."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u3-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Solo fabricar y vender, porque no se permite importar suplementos dietarios.', FALSE, 'Se permite importar.', 0),
      (v_pregunta, 'Fabricar y vender; importar y vender; e importar, empacar y vender.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'Solo importar y vender, porque en Colombia no hay fábricas de suplementos.', FALSE, 'Hay fabricación nacional.', 2),
      (v_pregunta, 'Vender sin registro y registrar después de un año en el mercado.', FALSE, 'El registro es previo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Cuánto tiempo antes del vencimiento debe radicarse la renovación de un registro de suplemento?';
    v_t4 := 'El artículo 13 fija una vigencia de diez años renovables y el artículo 14 exige radicar la renovación al menos tres meses antes del vencimiento.';
    v_j1 := $evsupl_json${"external_id":"supl-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Vigencia, renovación y modificaciones del registro","outcome":"Vigencia, renovación y modificaciones del registro","source":"Decreto 3249 de 2006, arts. 13 y 14."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u3-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Al menos tres meses antes del vencimiento.', TRUE, 'Correcto. Art. 14. Lo sustenta la explicación.', 0),
      (v_pregunta, 'El mismo día del vencimiento, para aprovechar toda la vigencia del registro.', FALSE, 'Se exige antelación.', 1),
      (v_pregunta, 'Un año después del vencimiento, con un pago adicional.', FALSE, 'Vencido no se renueva.', 2),
      (v_pregunta, 'No es necesario renovar, porque la vigencia es indefinida.', FALSE, 'La vigencia es de diez años.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un suplemento se fabricará en una planta de medicamentos. ¿Qué análisis es correcto según el artículo 7 modificado?';
    v_t4 := 'El artículo 7 (modificado por el Decreto 3863 de 2008) prevé que las plantas de medicamentos o fitoterapéuticos requieren autorización aparte, con soportes de validación de limpieza, y fabricación en áreas comunes o por campaña.';
    v_j1 := $evsupl_json${"external_id":"supl-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"BPM y condiciones sanitarias de fabricación (art. 7 y Anexo 2)","outcome":"BPM y condiciones sanitarias de fabricación (art. 7 y Anexo 2)","source":"Decreto 3249 de 2006, art. 7."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u3-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No requiere nada adicional, porque las BPM de medicamentos son más exigentes.', FALSE, 'Se requiere autorización aparte.', 0),
      (v_pregunta, 'Está prohibido fabricar suplementos en plantas de medicamentos.', FALSE, 'Está permitido con condiciones.', 1),
      (v_pregunta, 'Requiere autorización aparte con validación de limpieza, en áreas comunes o por campaña.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Requiere solo el certificado de BPM de alimentos de la planta.', FALSE, 'No es el requisito. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un titular propone una vida útil de cuatro años para un suplemento con estudios acelerados. ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 11 (numeral 2.3) dispone que la vida útil no puede superar dos años, salvo estudios de estabilidad, y que con estudios de envejecimiento natural puede llegar a tres años como máximo.';
    v_j1 := $evsupl_json${"external_id":"supl-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Vigencia, renovación y modificaciones del registro","outcome":"Vigencia, renovación y modificaciones del registro","source":"Decreto 3249 de 2006, art. 11."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u3-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es aceptable, porque los estudios acelerados permiten cualquier vida útil.', FALSE, 'Hay un límite. Revisa la explicación.', 0),
      (v_pregunta, 'Es aceptable si el empaque es de vidrio ámbar.', FALSE, 'El empaque no cambia el límite.', 1),
      (v_pregunta, 'Es aceptable si el producto solo contiene minerales.', FALSE, 'El límite aplica a todos.', 2),
      (v_pregunta, 'No es aceptable: el máximo es de dos años, o hasta tres con envejecimiento natural.', TRUE, 'Correcto. Art. 11. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz supl-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Rotulado, declaraciones de propiedades y publicidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Rotulado, declaraciones de propiedades y publicidad) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Rotulado, declaraciones de propiedades y publicidad';
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


    v_t3 := '¿Qué leyenda exige el artículo 21 en el rótulo de un suplemento dietario?';
    v_t4 := 'El artículo 21 exige, entre otras, la leyenda «Este producto es un suplemento dietario, no es un medicamento y no suple una alimentación equilibrada», además de «Manténgase fuera del alcance de los niños» y «No consumir en estado de embarazo y lactancia».';
    v_j1 := $evsupl_json${"external_id":"supl-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Rotulado obligatorio y etiquetas de importados (arts. 21–22)","outcome":"Rotulado obligatorio y etiquetas de importados (arts. 21–22)","source":"Decreto 3249 de 2006, art. 21."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u4-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, '«Este producto cura y previene enfermedades del sistema inmune».', FALSE, 'Está prohibida. Revisa la explicación.', 0),
      (v_pregunta, '«Producto aprobado por médicos especialistas».', FALSE, 'No es una leyenda exigida.', 1),
      (v_pregunta, '«Este producto es un suplemento dietario, no es un medicamento y no suple una alimentación equilibrada».', TRUE, 'Correcto. Con otras leyendas.', 2),
      (v_pregunta, '«Garantía de resultados en 30 días o le devolvemos su dinero».', FALSE, 'No es una leyenda exigida.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un anuncio de un suplemento dice «previene la gripa». ¿Qué corresponde según el artículo 24?';
    v_t4 := 'El artículo 24 exige aprobación previa de la publicidad por el Invima y su parágrafo (modificado por el Decreto 272 de 2009) prohíbe indicaciones preventivas, de rehabilitación o terapéuticas. El artículo 25 prohíbe declarar que el producto previene, alivia, trata o cura enfermedades.';
    v_j1 := $evsupl_json${"external_id":"supl-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Publicidad de suplementos: arts. 24–25 y Decreto 272 de 2009","outcome":"Publicidad de suplementos: arts. 24–25 y Decreto 272 de 2009","source":"Decreto 3249 de 2006, arts. 24 y 25."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u4-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es una indicación preventiva no permitida; debe retirarse.', TRUE, 'Correcto. La publicidad requiere aprobación previa.', 0),
      (v_pregunta, 'Es aceptable si se acompaña de una foto de un médico.', FALSE, 'La foto no lo habilita.', 1),
      (v_pregunta, 'Es aceptable si el producto tiene vitamina C.', FALSE, 'La composición no lo habilita.', 2),
      (v_pregunta, 'Es aceptable si el anuncio se publica solo en redes sociales.', FALSE, 'El canal no lo habilita.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué análisis es correcto sobre la tabla de información nutricional de un suplemento?';
    v_t4 := 'La Resolución 3096 de 2007 establece el rotulado nutricional de los suplementos: contenido por porción, porcentaje de valor diario y términos de contenido como «buena fuente» o «alto», con condiciones.';
    v_j1 := $evsupl_json${"external_id":"supl-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Resolución 3096 de 2007: información nutricional y declaraciones de contenido","outcome":"Resolución 3096 de 2007: información nutricional y declaraciones de contenido","source":"Resolución 3096 de 2007."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u4-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es opcional, porque los suplementos no son alimentos.', FALSE, 'Se rige por la norma de rotulado nutricional.', 0),
      (v_pregunta, 'Debe expresar el contenido por porción y el porcentaje de valor diario.', TRUE, 'Correcto. Resolución 3096 de 2007.', 1),
      (v_pregunta, 'Debe incluir solo las calorías, porque es lo que interesa al consumidor.', FALSE, 'Incluye nutrientes declarados.', 2),
      (v_pregunta, 'Puede omitir las vitaminas si el producto las contiene en dosis bajas.', FALSE, 'Se declaran los nutrientes.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una marca paga a un influenciador para que diga que su suplemento «reemplaza el desayuno y quita la ansiedad». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 25 prohíbe afirmar que el producto reemplaza comidas o cubre por sí solo los requerimientos nutricionales, y declarar propiedades para tratar o aliviar enfermedades. La publicidad, incluida la pagada a influenciadores, requiere aprobación previa (art. 24).';
    v_j1 := $evsupl_json${"external_id":"supl-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: revisar etiqueta y pieza publicitaria","outcome":"Caso: revisar etiqueta y pieza publicitaria","source":"Decreto 3249 de 2006, arts. 24 y 25."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u4-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es aceptable, porque el influenciador habla de su experiencia personal.', FALSE, 'La publicidad pagada se rige por la norma.', 0),
      (v_pregunta, 'Es aceptable si el influenciador tiene muchos seguidores.', FALSE, 'La audiencia no cambia la regla.', 1),
      (v_pregunta, 'Es aceptable si se menciona que es publicidad pagada.', FALSE, 'Avisarlo no corrige el contenido.', 2),
      (v_pregunta, 'Es inaceptable: no puede decir que reemplaza comidas ni atribuir efectos terapéuticos.', TRUE, 'Correcto. Arts. 24 y 25.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz supl-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Vigilancia, productos fraudulentos y comparación internacional' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Vigilancia, productos fraudulentos y comparación internacional) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Vigilancia, productos fraudulentos y comparación internacional';
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


    v_t3 := '¿Qué busca una alerta sanitaria del Invima sobre un suplemento fraudulento?';
    v_t4 := 'Las alertas sanitarias informan sobre productos fraudulentos o riesgosos (sin registro, adulterados, con fármacos no declarados) y dan recomendaciones a ciudadanos, establecimientos, profesionales y autoridades territoriales.';
    v_j1 := $evsupl_json${"external_id":"supl-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Alertas sanitarias del INVIMA sobre suplementos fraudulentos","outcome":"Alertas sanitarias del INVIMA sobre suplementos fraudulentos","source":"Alertas sanitarias del Invima."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u5-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Promocionar el producto para que más personas lo conozcan.', FALSE, 'Busca proteger, no promocionar.', 0),
      (v_pregunta, 'Informar el riesgo y recomendar acciones a ciudadanos y establecimientos.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'Fijar el precio máximo de venta del producto en el mercado.', FALSE, 'No fija precios. Revisa la explicación.', 2),
      (v_pregunta, 'Autorizar la venta del producto mientras se tramita su registro sanitario ante la entidad.', FALSE, 'No autoriza la venta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una droguería encuentra en su inventario un suplemento incluido en una alerta sanitaria. ¿Qué debe hacer?';
    v_t4 := 'Ante una alerta, el establecimiento debe retirar el producto de la venta, aislarlo, informar a la autoridad sanitaria y no devolverlo al mercado. Seguir comercializándolo expone a medidas sanitarias y sanciones.';
    v_j1 := $evsupl_json${"external_id":"supl-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Medidas sanitarias, sanciones y responsabilidad de los actores","outcome":"Medidas sanitarias, sanciones y responsabilidad de los actores","source":"Alertas sanitarias del Invima; régimen de medidas sanitarias."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u5-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Retirarlo de la venta, aislarlo e informar a la autoridad sanitaria.', TRUE, 'Correcto. Y no devolverlo al mercado.', 0),
      (v_pregunta, 'Venderlo con descuento para recuperar la inversión.', FALSE, 'Seguir vendiéndolo es una infracción.', 1),
      (v_pregunta, 'Devolverlo al proveedor para que lo venda en otra ciudad.', FALSE, 'Lo mantendría en el mercado.', 2),
      (v_pregunta, 'Seguir vendiéndolo hasta que llegue una visita del Invima.', FALSE, 'Debe actuar de inmediato.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué diferencia el modelo de la FDA (DSHEA) del modelo colombiano para suplementos?';
    v_t4 := 'Bajo la DSHEA, la FDA no aprueba los suplementos antes de su venta (salvo notificación de ingredientes nuevos) y el control es principalmente posmercado; en Colombia se exige registro sanitario previo del Invima (Decreto 3249 art. 9).';
    v_j1 := $evsupl_json${"external_id":"supl-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Estados Unidos: DSHEA, NDI y declaraciones estructura/función","outcome":"Estados Unidos: DSHEA, NDI y declaraciones estructura/función","source":"DSHEA (1994); Decreto 3249 de 2006, art. 9."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u5-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'En ambos países los suplementos se registran como medicamentos con ensayos clínicos.', FALSE, 'Ninguno los trata así.', 0),
      (v_pregunta, 'En Estados Unidos los suplementos están prohibidos y en Colombia están permitidos.', FALSE, 'Están permitidos en ambos.', 1),
      (v_pregunta, 'En Estados Unidos el control es principalmente posmercado; en Colombia se exige registro previo.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'En Colombia no hay control y en Estados Unidos cada lote se libera por la FDA.', FALSE, 'No es así. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un suplemento aprobado bajo DSHEA quiere entrar a Colombia «sin cambios porque ya es legal en Estados Unidos». ¿Cuál es la mejor valoración?';
    v_t4 := 'Un producto legal en Estados Unidos debe obtener registro sanitario en Colombia (art. 9), cumplir los niveles máximos (anexo 1), ajustar la etiqueta (arts. 21 y 22), adecuar declaraciones (arts. 5, 24 y 25) y obtener aprobación previa de la publicidad (art. 24).';
    v_j1 := $evsupl_json${"external_id":"supl-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso integrador: lanzar en Colombia un suplemento aprobado bajo DSHEA","outcome":"Caso integrador: lanzar en Colombia un suplemento aprobado bajo DSHEA","source":"Decreto 3249 de 2006, arts. 5, 9, 21, 22, 24 y 25."}$evsupl_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'supl-u5-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcto, porque Colombia acepta automáticamente los productos legales en Estados Unidos.', FALSE, 'No hay aceptación automática.', 0),
      (v_pregunta, 'Es correcto si el importador tiene certificado de BPM del fabricante.', FALSE, 'El certificado no basta.', 1),
      (v_pregunta, 'Es correcto si el producto se vende solo por comercio electrónico.', FALSE, 'El canal no exime del registro.', 2),
      (v_pregunta, 'Requiere registro, verificar niveles, ajustar etiqueta y declaraciones, y aprobar la publicidad.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad supl-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: qué es un suplemento dietario y su marco normativo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: qué es un suplemento dietario y su marco normativo) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Clasificación de un portafolio de cinco productos';
  v_t2 := $evsupl_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Revisa los artículos 2, 3, 12, 24 y 25 del Decreto 3249.</li><li>Clasifica cada producto.</li><li>Indica la vía de trámite.</li><li>Identifica qué declaraciones no se permiten.</li><li>Indica qué productos requieren concepto de la Sala.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar la definición y las exclusiones del Decreto 3249.</li><li>Decidir la categoría y la vía de cada producto.</li><li>Identificar los riesgos de cada decisión.</li></ul>
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
  <tr><td>Clasificación</td><td>40 %</td><td>Clasifica bien los cinco productos.</td><td>Clasifica bien tres o cuatro.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Declaraciones</td><td>25 %</td><td>Detecta «baja el azúcar» y «reemplazo de comidas» como no permitidas.</td><td>Detecta una.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vía y Sala</td><td>25 %</td><td>Vía correcta y concepto de la Sala para el ingrediente no listado (art. 12).</td><td>Vía imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evsupl_html$;
  v_t3 := $evsupl_html$<h2>Caso de estudio</h2>
<p>NutriAndes (ficticia) tiene cinco proyectos (datos simulados): (1) tabletas de vitamina D3 de 1.000 UI; (2) gomitas de vitamina C para niños; (3) cápsulas con un extracto vegetal y la frase «baja el azúcar»; (4) un polvo de proteína de suero como reemplazo de comidas; (5) un producto con un ingrediente botánico que no está en ninguna lista de referencia.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evsupl_html$;
  v_t4 := 'Tabla de clasificación con vía y riesgos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evsupl_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 3249 de 2006 y sus modificaciones (Decretos 3863 de 2008 y 272 de 2009); anexo 1 del Decreto 3863 de 2008 (niveles máximos); Resolución 3096 de 2007; alertas sanitarias del Invima; FDA (DSHEA) y Codex como referentes; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evsupl_html$;
  v_t7 := NULL;
  v_j1 := $evsupl_json$["Clasificación.","Vía de trámite.","Declaraciones.","Concepto de la Sala.","Riesgos."]$evsupl_json$::jsonb;
  v_j2 := $evsupl_json${"version":1,"total":100,"criteria":[{"id":"clasificacion","name":"Clasificación","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Clasifica bien los cinco productos."},{"level":3,"label":"Logrado","description":"Clasifica bien tres o cuatro."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"declaraciones","name":"Declaraciones","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Detecta «baja el azúcar» y «reemplazo de comidas» como no permitidas."},{"level":3,"label":"Logrado","description":"Detecta una."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"via-y-sala","name":"Vía y Sala","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Vía correcta y concepto de la Sala para el ingrediente no listado (art. 12)."},{"level":3,"label":"Logrado","description":"Vía imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evsupl_json$::jsonb;
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


  -- ── Actividad supl-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Composición: ingredientes, niveles máximos y evaluación de ingredientes nuevos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Composición: ingredientes, niveles máximos y evaluación de ingredientes nuevos) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Dossier para evaluar un ingrediente nuevo';
  v_t2 := $evsupl_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Define el contenido del dossier (identidad, composición, seguridad, uso, referencias).</li><li>Evalúa la evidencia de seguridad disponible.</li><li>Identifica la información faltante (dosis propuesta, población, interacciones).</li><li>Propón las declaraciones que se pedirían y si son admisibles.</li><li>Describe el trámite ante la Sala (art. 12).</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Estructurar el dossier para la Sala.</li><li>Evaluar la suficiencia de la evidencia.</li><li>Identificar la información faltante.</li></ul>
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
  <tr><td>Dossier</td><td>30 %</td><td>Estructura completa con identidad, composición y seguridad.</td><td>Estructura incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Evidencia</td><td>35 %</td><td>Evalúa toxicidad, uso alimentario y referencias, y detecta vacíos.</td><td>Evaluación superficial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Declaraciones y trámite</td><td>25 %</td><td>Declaraciones sin fines terapéuticos y trámite del art. 12.</td><td>Declaraciones inadmisibles.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evsupl_html$;
  v_t3 := $evsupl_html$<h2>Caso de estudio</h2>
<p>BioNutri (ficticia) quiere usar en un suplemento un extracto de una semilla andina que no está en las listas de referencia (datos simulados). Tiene: identificación botánica; composición nutricional; un estudio de toxicidad subcrónica en ratas; uso tradicional como alimento; y autorización como alimento nuevo en otro país.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evsupl_html$;
  v_t4 := 'Estructura del dossier con análisis de evidencia.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evsupl_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 3249 de 2006 y sus modificaciones (Decretos 3863 de 2008 y 272 de 2009); anexo 1 del Decreto 3863 de 2008 (niveles máximos); Resolución 3096 de 2007; alertas sanitarias del Invima; FDA (DSHEA) y Codex como referentes; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evsupl_html$;
  v_t7 := NULL;
  v_j1 := $evsupl_json$["Contenido del dossier.","Evidencia de seguridad.","Información faltante.","Declaraciones.","Trámite."]$evsupl_json$::jsonb;
  v_j2 := $evsupl_json${"version":1,"total":100,"criteria":[{"id":"dossier","name":"Dossier","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Estructura completa con identidad, composición y seguridad."},{"level":3,"label":"Logrado","description":"Estructura incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"evidencia","name":"Evidencia","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Evalúa toxicidad, uso alimentario y referencias, y detecta vacíos."},{"level":3,"label":"Logrado","description":"Evaluación superficial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"declaraciones-y-tramite","name":"Declaraciones y trámite","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Declaraciones sin fines terapéuticos y trámite del art. 12."},{"level":3,"label":"Logrado","description":"Declaraciones inadmisibles."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evsupl_json$::jsonb;
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


  -- ── Actividad supl-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Rotulado, declaraciones de propiedades y publicidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Rotulado, declaraciones de propiedades y publicidad) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Revisión de etiqueta importada y pieza publicitaria';
  v_t2 := $evsupl_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Revisa la etiqueta frente a los artículos 21 y 22.</li><li>Revisa la declaración «Boosts immunity» frente a los artículos 24 y 25.</li><li>Revisa cada frase de la pieza publicitaria.</li><li>Redacta el adhesivo en castellano y la pieza corregida.</li><li>Describe el trámite de aprobación de la publicidad.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Detectar incumplimientos de rotulado.</li><li>Detectar afirmaciones publicitarias prohibidas.</li><li>Proponer textos corregidos.</li></ul>
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
  <tr><td>Rotulado</td><td>30 %</td><td>Información mínima en castellano y leyendas del art. 21.</td><td>Rotulado incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Publicidad</td><td>40 %</td><td>Detecta la promesa preventiva, el reemplazo de comidas y el uso engañoso del registro.</td><td>Detecta parte.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Correcciones</td><td>20 %</td><td>Textos corregidos y trámite de aprobación previa (art. 24).</td><td>Correcciones generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evsupl_html$;
  v_t3 := $evsupl_html$<h2>Caso de estudio</h2>
<p>SuplePlus (ficticia) importa un multivitamínico de Estados Unidos (datos simulados). La etiqueta, en inglés, dice «Boosts immunity» y no tiene ninguna leyenda en castellano. La pieza para redes dice: «Nunca más te enfermarás. Reemplaza tus comidas con nuestras cápsulas. Aprobado por el Invima».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evsupl_html$;
  v_t4 := 'Informe de revisión con textos corregidos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evsupl_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 3249 de 2006 y sus modificaciones (Decretos 3863 de 2008 y 272 de 2009); anexo 1 del Decreto 3863 de 2008 (niveles máximos); Resolución 3096 de 2007; alertas sanitarias del Invima; FDA (DSHEA) y Codex como referentes; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evsupl_html$;
  v_t7 := NULL;
  v_j1 := $evsupl_json$["Etiqueta.","Declaración de salud.","Pieza publicitaria.","Textos corregidos.","Aprobación previa."]$evsupl_json$::jsonb;
  v_j2 := $evsupl_json${"version":1,"total":100,"criteria":[{"id":"rotulado","name":"Rotulado","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Información mínima en castellano y leyendas del art. 21."},{"level":3,"label":"Logrado","description":"Rotulado incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"publicidad","name":"Publicidad","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Detecta la promesa preventiva, el reemplazo de comidas y el uso engañoso del registro."},{"level":3,"label":"Logrado","description":"Detecta parte."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"correcciones","name":"Correcciones","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Textos corregidos y trámite de aprobación previa (art. 24)."},{"level":3,"label":"Logrado","description":"Correcciones generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evsupl_json$::jsonb;
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


  -- ── Actividad supl-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Registro sanitario, fabricación e importación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Registro sanitario, fabricación e importación) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: clasificación, composición y registro del suplemento importado';
  v_t2 := $evsupl_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define las cantidades (ficticias) de cada ingrediente.</li><li>Fase 1: confirma que es suplemento (arts. 2 y 3) y el marco aplicable.</li><li>Fase 2: verifica los niveles de vitamina D y zinc frente al anexo 1 y el estado del extracto botánico (art. 12).</li><li>Fase 3: define la modalidad (art. 10), los documentos, el certificado de BPM aceptado (art. 7) y la vida útil (art. 11).</li><li>Fase 3: describe la vigencia y la renovación (arts. 13 y 14).</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (clasificación).</strong> Categoría y marco normativo.</li>
  <li><strong>Fase 2 · Unidad 2 (composición).</strong> Niveles máximos e ingredientes.</li>
  <li><strong>Fase 3 · Unidad 3 (registro).</strong> Modalidad, documentos, BPM y vida útil.</li>
  <li><strong>Fase 4 · Unidad 4 (rotulado y publicidad).</strong> Etiqueta, declaraciones y publicidad.</li>
  <li><strong>Fase 5 · Unidad 5 (vigilancia).</strong> Vigilancia y prevención del fraude.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Confirmar la categoría y la composición admisible.</li><li>Preparar el expediente de registro.</li></ul>
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
  <tr><td>Categoría y composición</td><td>35 %</td><td>Categoría correcta, niveles verificados y ruta para el botánico.</td><td>Composición sin verificar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Registro</td><td>35 %</td><td>Modalidad importar y vender, documentos, BPM y vida útil máxima.</td><td>Registro incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vigencia</td><td>20 %</td><td>Diez años con renovación tres meses antes.</td><td>Vigencia imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evsupl_html$;
  v_t3 := $evsupl_html$<h2>Caso de estudio</h2>
<p>Vital Import (ficticia) quiere lanzar en Colombia un suplemento aprobado bajo DSHEA en Estados Unidos: cápsulas con vitamina D, zinc y un extracto botánico, con la declaración «supports immune health» y una vida útil de tres años (datos simulados). Te encargan el plan regulatorio completo. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evsupl_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evsupl_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 3249 de 2006 y sus modificaciones (Decretos 3863 de 2008 y 272 de 2009); anexo 1 del Decreto 3863 de 2008 (niveles máximos); Resolución 3096 de 2007; alertas sanitarias del Invima; FDA (DSHEA) y Codex como referentes; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evsupl_html$;
  v_t7 := NULL;
  v_j1 := $evsupl_json$["Categoría.","Niveles máximos.","Ingrediente botánico.","Expediente y BPM.","Vida útil y vigencia."]$evsupl_json$::jsonb;
  v_j2 := $evsupl_json${"version":1,"total":100,"criteria":[{"id":"categoria-y-composicion","name":"Categoría y composición","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Categoría correcta, niveles verificados y ruta para el botánico."},{"level":3,"label":"Logrado","description":"Composición sin verificar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"registro","name":"Registro","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Modalidad importar y vender, documentos, BPM y vida útil máxima."},{"level":3,"label":"Logrado","description":"Registro incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vigencia","name":"Vigencia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Diez años con renovación tres meses antes."},{"level":3,"label":"Logrado","description":"Vigencia imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evsupl_json$::jsonb;
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


  -- ── Actividad supl-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Vigilancia, productos fraudulentos y comparación internacional' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Vigilancia, productos fraudulentos y comparación internacional) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: rotulado, publicidad y vigilancia del suplemento importado';
  v_t2 := $evsupl_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: redacta el adhesivo en castellano con las leyendas del art. 21 y la tabla nutricional.</li><li>Fase 4: ajusta la declaración «supports immune health» a lo permitido.</li><li>Fase 4: define el trámite de aprobación previa de la publicidad y las reglas para influenciadores.</li><li>Fase 5: define la vigilancia de quejas, eventos y productos falsificados.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (clasificación).</strong> Categoría y marco normativo.</li>
  <li><strong>Fase 2 · Unidad 2 (composición).</strong> Niveles máximos e ingredientes.</li>
  <li><strong>Fase 3 · Unidad 3 (registro).</strong> Modalidad, documentos, BPM y vida útil.</li>
  <li><strong>Fase 4 · Unidad 4 (rotulado y publicidad).</strong> Etiqueta, declaraciones y publicidad.</li>
  <li><strong>Fase 5 · Unidad 5 (vigilancia).</strong> Vigilancia y prevención del fraude.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar el rotulado y las declaraciones permitidas.</li><li>Planear la publicidad y la vigilancia.</li></ul>
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
  <tr><td>Rotulado y declaraciones</td><td>35 %</td><td>Leyendas del art. 21, castellano (art. 22), tabla nutricional y declaraciones sin fines preventivos ni terapéuticos.</td><td>Rotulado con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Publicidad</td><td>20 %</td><td>Aprobación previa (art. 24) y control de influenciadores.</td><td>Publicidad sin control.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vigilancia</td><td>20 %</td><td>Plan de quejas, eventos y prevención de falsificaciones.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evsupl_html$;
  v_t3 := $evsupl_html$<h2>Caso de estudio</h2>
<p>Vital Import (ficticia) quiere lanzar en Colombia un suplemento aprobado bajo DSHEA en Estados Unidos: cápsulas con vitamina D, zinc y un extracto botánico, con la declaración «supports immune health» y una vida útil de tres años (datos simulados). Te encargan el plan regulatorio completo. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan regulatorio que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evsupl_html$;
  v_t4 := 'Plan regulatorio completo con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evsupl_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 3249 de 2006 y sus modificaciones (Decretos 3863 de 2008 y 272 de 2009); anexo 1 del Decreto 3863 de 2008 (niveles máximos); Resolución 3096 de 2007; alertas sanitarias del Invima; FDA (DSHEA) y Codex como referentes; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evsupl_html$;
  v_t7 := NULL;
  v_j1 := $evsupl_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Rotulado.","Declaraciones.","Publicidad.","Vigilancia y resumen."]$evsupl_json$::jsonb;
  v_j2 := $evsupl_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"rotulado-y-declaraciones","name":"Rotulado y declaraciones","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Leyendas del art. 21, castellano (art. 22), tabla nutricional y declaraciones sin fines preventivos ni terapéuticos."},{"level":3,"label":"Logrado","description":"Rotulado con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"publicidad","name":"Publicidad","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Aprobación previa (art. 24) y control de influenciadores."},{"level":3,"label":"Logrado","description":"Publicidad sin control."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vigilancia","name":"Vigilancia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Plan de quejas, eventos y prevención de falsificaciones."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evsupl_json$::jsonb;
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


  -- ── Foro supl-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con suplementos dietarios';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evsupl_html$<h2>Para empezar</h2>
<p>Piensa en un suplemento que hayas registrado, dispensado o visto anunciado y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evsupl_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evsupl_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evsupl_html$;
  v_t6 := $evsupl_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evsupl_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has visto publicidad engañosa de suplementos?', '¿Qué te parece más difícil: la clasificación, el registro o la publicidad?']::text[];
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


  -- ── Foro supl-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: qué es un suplemento dietario y su marco normativo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: qué es un suplemento dietario y su marco normativo) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · La frontera de los suplementos';
  v_t2 := 'Argumentar cómo distinguir un suplemento de un alimento, un medicamento o un fitoterapéutico.';
  v_t3 := $evsupl_html$<h2>Caso del foro</h2>
<p>Una empresa ficticia quiere lanzar (datos simulados): una bebida con proteína y vitaminas, cápsulas de melatonina, un polvo de colágeno con vitamina C y cápsulas de un extracto «para la próstata». Pregunta qué registro necesita cada uno.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evsupl_html$;
  v_t4 := '¿Cómo clasificarías cada producto y qué criterios usarías?';
  v_t5 := $evsupl_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada clasificación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evsupl_html$;
  v_t6 := $evsupl_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada clasificación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evsupl_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué excluye el artículo 3?', '¿Qué papel tienen la finalidad y las declaraciones?', '¿A quién consultarías un caso dudoso?']::text[];
  v_j1 := $evsupl_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada clasificación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evsupl_json$::jsonb;
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


  -- ── Foro supl-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Composición: ingredientes, niveles máximos y evaluación de ingredientes nuevos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Composición: ingredientes, niveles máximos y evaluación de ingredientes nuevos) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Megadosis de vitaminas';
  v_t2 := 'Argumentar por qué existen niveles máximos para vitaminas y minerales.';
  v_t3 := $evsupl_html$<h2>Caso del foro</h2>
<p>Un influenciador ficticio recomienda tomar 50.000 UI diarias de vitamina D «para el sistema inmune» (datos simulados). Una marca quiere lanzar un suplemento con esa dosis.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evsupl_html$;
  v_t4 := '¿Qué le responderías a la marca y al influenciador?';
  v_t5 := $evsupl_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la fuente que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evsupl_html$;
  v_t6 := $evsupl_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la fuente que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evsupl_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué es un nivel máximo de consumo tolerable?', '¿Qué riesgos tiene el exceso de vitamina D?', '¿Qué permite el anexo 1 del Decreto 3863?']::text[];
  v_j1 := $evsupl_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la fuente que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evsupl_json$::jsonb;
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


  -- ── Foro supl-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Registro sanitario, fabricación e importación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Registro sanitario, fabricación e importación) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Importar un suplemento exitoso';
  v_t2 := 'Argumentar qué ajustes requiere un suplemento extranjero para entrar a Colombia.';
  v_t3 := $evsupl_html$<h2>Caso del foro</h2>
<p>Un importador ficticio quiere traer un suplemento muy vendido en Estados Unidos (datos simulados). La etiqueta dice «supports immune health», tiene 5.000 UI de vitamina D y una vida útil de cuatro años.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evsupl_html$;
  v_t4 := '¿Qué ajustes necesitaría y qué verificarías?';
  v_t5 := $evsupl_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada ajuste. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evsupl_html$;
  v_t6 := $evsupl_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada ajuste.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evsupl_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué exige el artículo 22 para etiquetas de importados?', '¿Cumple la dosis los niveles máximos?', '¿Qué vida útil se puede asignar?']::text[];
  v_j1 := $evsupl_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada ajuste."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evsupl_json$::jsonb;
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


  -- ── Foro supl-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Rotulado, declaraciones de propiedades y publicidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Rotulado, declaraciones de propiedades y publicidad) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Influenciadores y suplementos';
  v_t2 := 'Argumentar cómo debe controlarse la publicidad de suplementos en redes sociales.';
  v_t3 := $evsupl_html$<h2>Caso del foro</h2>
<p>Una marca ficticia contrata a diez influenciadores para promocionar un suplemento «detox» (datos simulados). Algunos publican que «elimina toxinas del hígado» y que «adelgaza sin dieta».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evsupl_html$;
  v_t4 := '¿Qué responsabilidad tienen la marca y los influenciadores y qué harías?';
  v_t5 := $evsupl_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada medida. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evsupl_html$;
  v_t6 := $evsupl_html$<h2>Normas de participación</h2>
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
</details>$evsupl_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué exige el artículo 24 sobre aprobación previa?', '¿Qué afirmaciones prohíbe el artículo 25?', '¿Cómo controlarías el contenido de terceros?']::text[];
  v_j1 := $evsupl_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada medida."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evsupl_json$::jsonb;
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


  -- ── Foro supl-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Vigilancia, productos fraudulentos y comparación internacional' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Vigilancia, productos fraudulentos y comparación internacional) en Registro Sanitario de Suplementos Dietarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Suplementos fraudulentos en el mercado';
  v_t2 := 'Argumentar el papel del químico farmacéutico frente a los suplementos fraudulentos.';
  v_t3 := $evsupl_html$<h2>Caso del foro</h2>
<p>Una droguería ficticia recibe clientes que piden un «potenciador sexual natural» que vieron en redes y que no tiene registro (datos simulados). Una alerta del Invima advierte que productos similares contienen fármacos no declarados.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evsupl_html$;
  v_t4 := '¿Cómo orientarías a los clientes y qué harías como establecimiento?';
  v_t5 := $evsupl_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la alerta que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evsupl_html$;
  v_t6 := $evsupl_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la alerta que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evsupl_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué riesgos tienen los fármacos no declarados?', '¿Cómo verificar el registro de un producto?', '¿Qué hacer si llega el producto a la droguería?']::text[];
  v_j1 := $evsupl_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la alerta que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evsupl_json$::jsonb;
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


  RAISE NOTICE 'Registro Sanitario de Suplementos Dietarios: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evsupl$;

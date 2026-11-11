-- ============================================================
--  106_quices_actividades_foros_regulatorios6.sql — quizzes, actividades y foros, lote «regulatorios6»
--
--  Generado por scripts/evaluacion-aula.mjs regulatorios6 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Registro Sanitario de Medicamentos Biológicos; Regulación de Medicamentos Biosimilares.
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
--  Curso de Registro Sanitario de Medicamentos Biológicos
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evbiol$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Registro Sanitario de Medicamentos Biológicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos de los medicamentos biológicos y su marco normativo', 'Unidad 2. Decreto 1782 de 2014: rutas y evaluación farmacológica', 'Unidad 3. Guías técnicas: inmunogenicidad, estabilidad y gestión de riesgo', 'Unidad 4. Calidad de biológicos y Buenas Prácticas de Manufactura', 'Unidad 5. Ciclo de vida: migración normativa, modificaciones y cadena de frío']::text[])) < 5 THEN
    RAISE NOTICE 'Registro Sanitario de Medicamentos Biológicos: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evbiol_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evbiol_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz biol-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de los medicamentos biológicos y su marco normativo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de los medicamentos biológicos y su marco normativo) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos de los medicamentos biológicos y su marco normativo';
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


    v_t3 := 'Según el artículo 3 del Decreto 1782 de 2014, ¿cuándo un medicamento biológico se denomina biotecnológico?';
    v_t4 := 'El artículo 3 define el medicamento biológico como el derivado de organismos o células vivas o sus partes, y denomina biotecnológicos a los obtenidos por ADN recombinante, hibridoma o transgénesis. El artículo 19 agrega las siglas MB o MBT al número de registro.';
    v_j1 := $evbiol_json${"external_id":"biol-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Definición de medicamento biológico y diferencias con la síntesis química","outcome":"Definición de medicamento biológico y diferencias con la síntesis química","source":"Decreto 1782 de 2014, arts. 3 y 19."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u1-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Cuando se obtiene por ADN recombinante, hibridoma o transgénesis.', TRUE, 'Correcto. Lleva la sigla MBT en el registro.', 0),
      (v_pregunta, 'Cuando se fabrica en un laboratorio con certificado de BPM vigente y equipos automatizados.', FALSE, 'La certificación no define la categoría.', 1),
      (v_pregunta, 'Cuando se administra por vía intravenosa en hospitales de alta complejidad.', FALSE, 'La vía de administración no define la categoría.', 2),
      (v_pregunta, 'Cuando contiene más de un principio activo de origen vegetal o animal en su fórmula.', FALSE, 'No es la definición del decreto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un laboratorio quiere registrar un alérgeno para diagnóstico. ¿Se rige por el Decreto 1782 de 2014?';
    v_t4 := 'El parágrafo del artículo 2 del Decreto 1782 de 2014 excluye los alérgenos, los magistrales obtenidos de organismos vivos, ciertos productos de células o tejidos no viables y las preparaciones homeopáticas de fluidos o sustancias biológicas.';
    v_j1 := $evbiol_json${"external_id":"biol-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso práctico: clasificar un portafolio de productos de origen biológico","outcome":"Caso práctico: clasificar un portafolio de productos de origen biológico","source":"Decreto 1782 de 2014, art. 2."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u1-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Sí, porque todo producto de origen biológico se rige siempre por el Decreto 1782.', FALSE, 'El decreto tiene exclusiones.', 0),
      (v_pregunta, 'Sí, si el alérgeno se importa desde un país con agencia de referencia reconocida.', FALSE, 'El origen no cambia la exclusión.', 1),
      (v_pregunta, 'No: el parágrafo del artículo 2 excluye los alérgenos.', TRUE, 'Correcto. También excluye otros productos.', 2),
      (v_pregunta, 'Sí, si el alérgeno se usa en hospitales públicos de alta complejidad.', FALSE, 'El lugar de uso no cambia la exclusión.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Por qué los biológicos tienen un régimen propio frente a los medicamentos de síntesis química?';
    v_t4 := 'Los biológicos son moléculas grandes y complejas, con variabilidad inherente y dependencia del proceso de fabricación; pueden generar respuestas inmunes. Por eso el Decreto 1782 exige información de proceso, sistema de expresión, potencia, pureza e inmunogenicidad (art. 6) y define rutas con comparabilidad.';
    v_j1 := $evbiol_json${"external_id":"biol-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Definición de medicamento biológico y diferencias con la síntesis química","outcome":"Definición de medicamento biológico y diferencias con la síntesis química","source":"Decreto 1782 de 2014, art. 6."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u1-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Porque su precio es mayor y el Estado necesita controlar el gasto en salud pública.', FALSE, 'El régimen no responde al precio.', 0),
      (v_pregunta, 'Porque su complejidad y su dependencia del proceso exigen evaluar inmunogenicidad y comparabilidad.', TRUE, 'Correcto. «El proceso es el producto».', 1),
      (v_pregunta, 'Porque todos se fabrican fuera de Colombia y requieren controles de importación especiales.', FALSE, 'No todos son importados.', 2),
      (v_pregunta, 'Porque no requieren estudios clínicos, a diferencia de los de síntesis química.', FALSE, 'Sí requieren estudios clínicos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un consultor afirma que «los registros de biológicos vencen a los cinco años, como dice el artículo 16 del Decreto 1782». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 16 del Decreto 1782 fijó una vigencia de cinco años, pero el Decreto 1474 de 2023 estableció la vigencia indefinida de los registros sanitarios, con medidas ante incumplimientos o hallazgos de farmacovigilancia. El control se traslada al ciclo de vida.';
    v_j1 := $evbiol_json${"external_id":"biol-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Mapa normativo de biológicos en Colombia","outcome":"Mapa normativo de biológicos en Colombia","source":"Decreto 1782 de 2014, art. 16; Decreto 1474 de 2023."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u1-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcta, porque el artículo 16 sigue rigiendo sin cambios desde 2014.', FALSE, 'Una norma posterior cambió la vigencia.', 0),
      (v_pregunta, 'Es correcta solo para los biotecnológicos importados de agencias de referencia.', FALSE, 'No hay esa distinción.', 1),
      (v_pregunta, 'Es incorrecta, porque los registros de biológicos vencen cada diez años desde 2014.', FALSE, 'No es el régimen vigente.', 2),
      (v_pregunta, 'Está desactualizada: el Decreto 1474 de 2023 estableció la vigencia indefinida del registro.', TRUE, 'Correcto. El control pasa al ciclo de vida.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz biol-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Decreto 1782 de 2014: rutas y evaluación farmacológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Decreto 1782 de 2014: rutas y evaluación farmacológica) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Decreto 1782 de 2014: rutas y evaluación farmacológica';
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


    v_t3 := '¿Qué papel tiene la Sala Especializada de Medicamentos y Productos Biológicos según el Decreto 1782?';
    v_t4 := 'El artículo 4 del Decreto 1782 de 2014 asigna la evaluación farmacológica como función privativa de la Sala Especializada, que forma un juicio sobre calidad, seguridad y eficacia, incluidas indicaciones, dosificación, efectos adversos, inmunogenicidad y beneficio-riesgo.';
    v_j1 := $evbiol_json${"external_id":"biol-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"La Sala Especializada de Medicamentos y Productos Biológicos","outcome":"La Sala Especializada de Medicamentos y Productos Biológicos","source":"Decreto 1782 de 2014, art. 4."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u2-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Hace la evaluación farmacológica, que es función privativa suya.', TRUE, 'Correcto. Juzga calidad, seguridad y eficacia.', 0),
      (v_pregunta, 'Expide los certificados de buenas prácticas de manufactura a las plantas que fabrican biológicos.', FALSE, 'No es su función en el decreto.', 1),
      (v_pregunta, 'Fija los precios de venta de los medicamentos biológicos en el mercado colombiano.', FALSE, 'No es su función en el decreto.', 2),
      (v_pregunta, 'Hace la evaluación legal de los documentos del titular y del fabricante extranjero.', FALSE, 'La evaluación legal la hace el Invima.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una solicitud de registro de un biológico se radica con las tres evaluaciones. ¿Cuál es el orden previsto en el decreto?';
    v_t4 := 'Según los artículos 14 y 15 del Decreto 1782, el Invima continúa el trámite solo si la Sala emite concepto favorable sobre la evaluación farmacológica; después evalúa la farmacéutica y la legal y decide dentro de tres meses.';
    v_j1 := $evbiol_json${"external_id":"biol-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Estructura del Decreto 1782: definiciones e información común (art. 6)","outcome":"Estructura del Decreto 1782: definiciones e información común (art. 6)","source":"Decreto 1782 de 2014, arts. 14 y 15."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u2-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Primero la legal, luego la farmacéutica y al final la farmacológica, si sobra tiempo.', FALSE, 'El orden es distinto.', 0),
      (v_pregunta, 'Las tres al mismo tiempo, con una decisión única al final del trámite en un mes.', FALSE, 'El trámite continúa solo con concepto favorable.', 1),
      (v_pregunta, 'Solo la farmacéutica, porque la farmacológica es opcional para los biológicos.', FALSE, 'La farmacológica es obligatoria.', 2),
      (v_pregunta, 'Primero la farmacológica; solo con concepto favorable siguen la farmacéutica y la legal.', TRUE, 'Correcto. Luego se decide en tres meses.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué exige la ruta de expediente completo del artículo 7?';
    v_t4 := 'La ruta de expediente completo (art. 7) exige estudios preclínicos y ensayos clínicos con el medicamento objeto de evaluación. La de comparabilidad (art. 8) exige un ejercicio de comparabilidad con un medicamento de referencia; la abreviada (art. 9) tiene condiciones estrictas.';
    v_j1 := $evbiol_json${"external_id":"biol-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Ruta de expediente completo","outcome":"Ruta de expediente completo","source":"Decreto 1782 de 2014, arts. 7 a 9."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u2-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Solo información publicada en revistas científicas sobre el principio activo.', FALSE, 'Eso se acerca a la ruta abreviada.', 0),
      (v_pregunta, 'Estudios preclínicos y ensayos clínicos propios con el medicamento objeto de evaluación.', TRUE, 'Correcto. Es la ruta de los innovadores.', 1),
      (v_pregunta, 'Solo un ejercicio de comparabilidad con un medicamento de referencia aprobado en otro país.', FALSE, 'Esa es la ruta de comparabilidad.', 2),
      (v_pregunta, 'Solo los certificados de venta libre de los países donde ya se comercializa.', FALSE, 'No basta para ninguna ruta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un titular quiere usar la ruta abreviada para un biológico nuevo con poca experiencia clínica «para ahorrar tiempo». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 9 limita la ruta abreviada a ingredientes activos suficientemente caracterizados, con perfil de seguridad y eficacia altamente documentado, considerable experiencia clínica y farmacovigilancia robusta. Un biológico nuevo con poca experiencia no las cumple.';
    v_j1 := $evbiol_json${"external_id":"biol-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Rutas de comparabilidad y abreviada: visión general","outcome":"Rutas de comparabilidad y abreviada: visión general","source":"Decreto 1782 de 2014, art. 9."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u2-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es viable, porque cualquier biológico puede presentarse por la ruta que el titular escoja libremente.', FALSE, 'Cada ruta tiene condiciones.', 0),
      (v_pregunta, 'Es viable si el producto ya está aprobado en un país con agencia de referencia.', FALSE, 'La aprobación externa no cumple las condiciones del art. 9.', 1),
      (v_pregunta, 'No: la ruta abreviada exige un activo bien caracterizado y con amplia experiencia clínica.', TRUE, 'Correcto. También farmacovigilancia robusta.', 2),
      (v_pregunta, 'Es viable si el titular se compromete a presentar estudios clínicos después del registro.', FALSE, 'Los compromisos no suplen las condiciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz biol-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Guías técnicas: inmunogenicidad, estabilidad y gestión de riesgo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Guías técnicas: inmunogenicidad, estabilidad y gestión de riesgo) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Guías técnicas: inmunogenicidad, estabilidad y gestión de riesgo';
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


    v_t3 := '¿Qué guías debía expedir el Ministerio de Salud según el artículo 22 del Decreto 1782?';
    v_t4 := 'El artículo 22 del Decreto 1782 ordenó expedir la guía de inmunogenicidad (22.1), la de planes de gestión de riesgo (22.2) y la de estabilidad (22.3). El artículo 26 condicionó la entrada en vigencia del decreto a la expedición de las guías de inmunogenicidad y estabilidad.';
    v_j1 := $evbiol_json${"external_id":"biol-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: las guías que desarrollan el Decreto 1782","outcome":"Introducción a la unidad: las guías que desarrollan el Decreto 1782","source":"Decreto 1782 de 2014, arts. 22 y 26."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u3-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Las guías de publicidad y de precios de los medicamentos biológicos comercializados.', FALSE, 'No son las guías del art. 22.', 0),
      (v_pregunta, 'Las guías de etiquetado y de empaque de las vacunas de uso pediátrico.', FALSE, 'No son las guías del art. 22.', 1),
      (v_pregunta, 'Las guías de inmunogenicidad, de planes de gestión de riesgo y de estabilidad.', TRUE, 'Correcto. Su expedición condicionó la vigencia.', 2),
      (v_pregunta, 'Las guías de importación de materias primas para fabricar biológicos.', FALSE, 'No son las guías del art. 22.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué exige el artículo 24 del Decreto 1782 al titular en materia de farmacovigilancia?';
    v_t4 := 'El artículo 24 exige al titular implementar un plan de gestión de riesgos y un programa de farmacovigilancia activa, presentar informes periódicos de seguridad y contar con tecnología de señalización que permita identificar el producto en la cadena de distribución.';
    v_j1 := $evbiol_json${"external_id":"biol-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Plan de gestión de riesgo: Resolución 213 de 2022","outcome":"Plan de gestión de riesgo: Resolución 213 de 2022","source":"Decreto 1782 de 2014, art. 24."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u3-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Un plan de gestión de riesgos, farmacovigilancia activa e informes periódicos de seguridad.', TRUE, 'Correcto. Con trazabilidad en la distribución.', 0),
      (v_pregunta, 'Solo reportar los eventos adversos graves que lleguen por quejas de los pacientes en la farmacia.', FALSE, 'La farmacovigilancia es activa.', 1),
      (v_pregunta, 'Solo una revisión anual de la literatura científica sobre el principio activo del producto.', FALSE, 'Se exige mucho más que eso.', 2),
      (v_pregunta, 'Nada, porque la farmacovigilancia es una responsabilidad exclusiva del Invima.', FALSE, 'El titular tiene obligaciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente desarrolla anticuerpos antifármaco que neutralizan un biológico. ¿Qué análisis es correcto?';
    v_t4 := 'La inmunogenicidad es la capacidad de un biológico de inducir una respuesta inmune, como anticuerpos antifármaco que pueden neutralizar su efecto o causar eventos adversos. Se evalúa con una estrategia escalonada (tamizaje, confirmación, neutralización) y es información común exigida (art. 6).';
    v_j1 := $evbiol_json${"external_id":"biol-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Evaluación del riesgo inmunogénico y estrategia de ensayos","outcome":"Evaluación del riesgo inmunogénico y estrategia de ensayos","source":"Decreto 1782 de 2014, art. 6; guía de inmunogenicidad del Ministerio."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u3-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No es relevante, porque los anticuerpos antifármaco no tienen ningún efecto clínico.', FALSE, 'Pueden reducir la eficacia o causar eventos.', 0),
      (v_pregunta, 'Es un problema exclusivo de los biosimilares, nunca de los productos innovadores.', FALSE, 'Afecta también a los innovadores.', 1),
      (v_pregunta, 'Indica un error de dispensación, porque los biológicos no generan respuestas inmunes.', FALSE, 'Los biológicos pueden ser inmunogénicos.', 2),
      (v_pregunta, 'Es inmunogenicidad: puede reducir la eficacia y se evalúa con ensayos escalonados.', TRUE, 'Correcto. Es parte del art. 6.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para un biológico, un titular propone asignar la vida útil con estudios acelerados extrapolados, como en una tableta de síntesis química. ¿Cuál es la mejor valoración?';
    v_t4 := 'La guía de estabilidad de biológicos (Resolución 3690 de 2016) e ICH Q5C basan la vida útil en datos reales en las condiciones de almacenamiento propuestas, con indicadores como potencia y agregados; la extrapolación de acelerados no se aplica como en síntesis química.';
    v_j1 := $evbiol_json${"external_id":"biol-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Guía de estabilidad de medicamentos biológicos (Res. 3690 de 2016) e ICH Q5C","outcome":"Guía de estabilidad de medicamentos biológicos (Res. 3690 de 2016) e ICH Q5C","source":"Resolución 3690 de 2016; ICH Q5C."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u3-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es adecuado, porque la extrapolación es aceptada igual para todos los medicamentos.', FALSE, 'Los biológicos tienen requisitos propios.', 0),
      (v_pregunta, 'Es adecuado si el producto se conserva refrigerado durante toda su vida útil.', FALSE, 'La refrigeración no habilita la extrapolación.', 1),
      (v_pregunta, 'Es inadecuado: en biológicos la vida útil se basa en datos reales en las condiciones propuestas.', TRUE, 'Correcto. Según la guía de biológicos e ICH Q5C.', 2),
      (v_pregunta, 'Es inadecuado solo porque los biológicos no requieren estudios de estabilidad.', FALSE, 'Sí los requieren, con su propia guía.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz biol-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Calidad de biológicos y Buenas Prácticas de Manufactura' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Calidad de biológicos y Buenas Prácticas de Manufactura) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Calidad de biológicos y Buenas Prácticas de Manufactura';
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


    v_t3 := '¿De qué trata la guía ICH Q5A?';
    v_t4 := 'ICH Q5A trata la evaluación de la seguridad viral de productos biotecnológicos derivados de líneas celulares, incluidos los estudios de remoción e inactivación viral. Q5D trata los sustratos celulares, Q5B el constructo de expresión, Q5C la estabilidad y Q5E la comparabilidad tras cambios de proceso.';
    v_j1 := $evbiol_json${"external_id":"biol-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"ICH Q5A y Q5D: sustratos celulares y seguridad viral","outcome":"ICH Q5A y Q5D: sustratos celulares y seguridad viral","source":"ICH Q5A, Q5B, Q5C, Q5D y Q5E."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u4-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'De la evaluación de la seguridad viral de productos derivados de líneas celulares.', TRUE, 'Correcto. Incluye estudios de remoción e inactivación.', 0),
      (v_pregunta, 'De los estudios de bioequivalencia de formas sólidas orales de liberación inmediata.', FALSE, 'Ese es el alcance de ICH M13A.', 1),
      (v_pregunta, 'Del etiquetado de vacunas y del contenido de los insertos para pacientes.', FALSE, 'No es el alcance de las guías Q5.', 2),
      (v_pregunta, 'De la publicidad de medicamentos biológicos de venta bajo fórmula médica.', FALSE, 'Las guías ICH no regulan publicidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un fabricante cambia la escala de su biorreactor. Según ICH Q5E, ¿qué debe demostrar?';
    v_t4 := 'ICH Q5E exige un ejercicio de comparabilidad cuando cambia el proceso de fabricación: demostrar con datos analíticos (y, si es necesario, no clínicos o clínicos) que el producto antes y después del cambio es comparable en calidad, seguridad y eficacia.';
    v_j1 := $evbiol_json${"external_id":"biol-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"ICH Q5B y Q5E: constructo de expresión y comparabilidad tras cambios","outcome":"ICH Q5B y Q5E: constructo de expresión y comparabilidad tras cambios","source":"ICH Q5E."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u4-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Nada, porque un cambio de escala no afecta un producto biológico bien caracterizado.', FALSE, 'En biológicos el proceso influye en el producto.', 0),
      (v_pregunta, 'Que el producto antes y después del cambio es comparable en calidad, seguridad y eficacia.', TRUE, 'Correcto. Con datos analíticos y, si hace falta, no clínicos o clínicos.', 1),
      (v_pregunta, 'Que el nuevo biorreactor es de una marca reconocida y tiene certificado del proveedor.', FALSE, 'La marca del equipo no demuestra comparabilidad.', 2),
      (v_pregunta, 'Que el costo de producción por lote bajó al menos un 20 %.', FALSE, 'El costo no es un criterio técnico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Según ICH Q6B, ¿qué incluye la caracterización de un producto biotecnológico?';
    v_t4 := 'ICH Q6B describe la caracterización (propiedades fisicoquímicas y estructura, actividad biológica, pureza e impurezas) y cómo fijar especificaciones a partir de ella. La potencia, medida con un ensayo biológico, es un atributo clave.';
    v_j1 := $evbiol_json${"external_id":"biol-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"ICH Q6B: especificaciones y caracterización","outcome":"ICH Q6B: especificaciones y caracterización","source":"ICH Q6B."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u4-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Solo la apariencia y el color de la solución, porque son los atributos visibles.', FALSE, 'La caracterización es mucho más amplia.', 0),
      (v_pregunta, 'Solo el contenido de proteína total, porque define la dosis del producto.', FALSE, 'Es solo uno de los atributos.', 1),
      (v_pregunta, 'Estructura, actividad biológica, pureza e impurezas, que sustentan las especificaciones.', TRUE, 'Correcto. Con métodos ortogonales.', 2),
      (v_pregunta, 'Solo el estudio de estabilidad a largo plazo en condiciones de refrigeración.', FALSE, 'La estabilidad es otro bloque.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En la cadena de fabricación de un anticuerpo importado, el principio activo se produce en un país, el llenado en otro y el acondicionamiento en un tercero. Solo hay certificado de BPM del acondicionador. ¿Cuál es la mejor valoración?';
    v_t4 := 'Cada sitio que interviene en la fabricación (principio activo, llenado, acondicionamiento, control) debe contar con evidencia de BPM aceptada por el Invima, conforme al marco de certificación vigente. Se verifica sitio por sitio, con coherencia de nombres y direcciones.';
    v_j1 := $evbiol_json${"external_id":"biol-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: revisión de certificados BPM de una cadena de fabricación multinacional","outcome":"Caso práctico: revisión de certificados BPM de una cadena de fabricación multinacional","source":"Decreto 1782 de 2014, art. 6; marco de certificación de BPM del Invima."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u4-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es suficiente, porque el acondicionador es quien despacha el producto a Colombia.', FALSE, 'Cada etapa debe estar cubierta.', 0),
      (v_pregunta, 'Es suficiente si el titular presenta una declaración de calidad firmada por su director técnico.', FALSE, 'Una declaración no reemplaza los certificados.', 1),
      (v_pregunta, 'Es suficiente si el producto se aprobó en una agencia de referencia.', FALSE, 'La aprobación no exime de documentar las BPM de cada sitio.', 2),
      (v_pregunta, 'Es insuficiente: cada etapa de fabricación debe tener evidencia de BPM aceptada por el Invima.', TRUE, 'Correcto. Se verifica sitio por sitio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz biol-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Ciclo de vida: migración normativa, modificaciones y cadena de frío' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Ciclo de vida: migración normativa, modificaciones y cadena de frío) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Ciclo de vida: migración normativa, modificaciones y cadena de frío';
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


    v_t3 := '¿Qué cambia para el ciclo de vida de un biológico con la vigencia indefinida del registro?';
    v_t4 := 'Con la vigencia indefinida (Decreto 1474 de 2023), el control se traslada al ciclo de vida: modificaciones, farmacovigilancia (plan de gestión de riesgo e informes periódicos) y medidas del Invima ante incumplimientos o hallazgos.';
    v_j1 := $evbiol_json${"external_id":"biol-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: el registro como compromiso permanente","outcome":"Introducción a la unidad: el registro como compromiso permanente","source":"Decreto 1474 de 2023; Decreto 1782 de 2014, art. 24."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u5-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que el titular ya no tiene ninguna obligación después de obtener el registro sanitario indefinido.', FALSE, 'Las obligaciones continúan.', 0),
      (v_pregunta, 'Que el control pasa a modificaciones, farmacovigilancia y medidas ante incumplimientos.', TRUE, 'Correcto. Sin renovaciones periódicas.', 1),
      (v_pregunta, 'Que el Invima ya no puede suspender ni cancelar registros de biológicos.', FALSE, 'Puede tomar medidas.', 2),
      (v_pregunta, 'Que los cambios de proceso ya no necesitan ningún trámite ante el Invima.', FALSE, 'Los cambios siguen tramitándose.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Durante el transporte, un lote de un biológico refrigerado registra 12 °C durante tres horas. ¿Qué se hace primero?';
    v_t4 := 'Ante una excursión de temperatura, el lote se pone en cuarentena, se documenta la excursión y se evalúa con los datos de estabilidad del fabricante (incluidos estudios de excursiones) antes de decidir su liberación o rechazo.';
    v_j1 := $evbiol_json${"external_id":"biol-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Cadena de frío: almacenamiento y transporte de biológicos","outcome":"Cadena de frío: almacenamiento y transporte de biológicos","source":"Resolución 3690 de 2016; buenas prácticas de cadena de frío."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u5-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Se despacha normalmente, porque tres horas es un tiempo corto para un producto refrigerado.', FALSE, 'Debe evaluarse antes de despachar.', 0),
      (v_pregunta, 'Se pone en cuarentena y se evalúa la excursión con los datos de estabilidad.', TRUE, 'Correcto. Se decide con evidencia del fabricante.', 1),
      (v_pregunta, 'Se destruye siempre el lote completo sin ninguna evaluación técnica.', FALSE, 'Primero se evalúa con datos.', 2),
      (v_pregunta, 'Se reetiqueta con una vida útil más corta sin consultar a nadie.', FALSE, 'Requiere evaluación y autorización.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un biológico se registró antes del Decreto 1782 y nunca fue evaluado bajo él. ¿Qué análisis es correcto sobre su situación?';
    v_t4 := 'Los registros de biológicos otorgados antes del Decreto 1782 y no evaluados bajo él deben adecuarse mediante el trámite que defina el Invima (migración normativa), aportando la información técnica que exige el decreto.';
    v_j1 := $evbiol_json${"external_id":"biol-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Decreto 1474 de 2023 y Circular 19 de 2023","outcome":"Decreto 1474 de 2023 y Circular 19 de 2023","source":"Decreto 1782 de 2014; lineamientos del Invima."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u5-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Queda exento para siempre de los requisitos del Decreto 1782.', FALSE, 'Debe analizarse su adecuación.', 0),
      (v_pregunta, 'Debe retirarse del mercado de inmediato, sin ningún trámite previo.', FALSE, 'Hay un procedimiento de adecuación.', 1),
      (v_pregunta, 'Solo cambia la sigla del registro, sin presentar ninguna información técnica adicional.', FALSE, 'Se requiere información técnica.', 2),
      (v_pregunta, 'Debe evaluarse su adecuación al Decreto 1782 mediante el trámite que fije el Invima.', TRUE, 'Correcto. Es la migración normativa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una nueva señal de seguridad obliga a cambiar el inserto de un biológico. El titular propone cambiar solo el inserto, sin tocar el plan de gestión de riesgo. ¿Cuál es la mejor valoración?';
    v_t4 := 'Una nueva señal de seguridad exige actualizar de forma coherente el inserto, la información para prescribir y el plan de gestión de riesgo (art. 24), y tramitar las modificaciones de seguridad y eficacia según la guía vigente.';
    v_j1 := $evbiol_json${"external_id":"biol-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Modificaciones de seguridad y eficacia de biológicos","outcome":"Modificaciones de seguridad y eficacia de biológicos","source":"Decreto 1782 de 2014, art. 24; Decreto 334 de 2022."}$evbiol_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'biol-u5-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es incompleto: también debe actualizarse el plan de gestión de riesgo y tramitar el cambio.', TRUE, 'Correcto. Son documentos coherentes.', 0),
      (v_pregunta, 'Es suficiente, porque el plan de gestión de riesgo solo se presenta en el registro inicial.', FALSE, 'El plan se actualiza.', 1),
      (v_pregunta, 'Es suficiente si el inserto se publica también en la página web del titular.', FALSE, 'La web no reemplaza el plan.', 2),
      (v_pregunta, 'Es suficiente si el médico tratante conoce la nueva señal.', FALSE, 'La comunicación individual no basta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad biol-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de los medicamentos biológicos y su marco normativo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de los medicamentos biológicos y su marco normativo) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Clasificación normativa de un portafolio biológico';
  v_t2 := $evbiol_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Revisa los artículos 2, 3 y 7 a 9 del Decreto 1782 de 2014.</li><li>Decide si cada producto está dentro del ámbito.</li><li>Identifica la ruta probable (completa, comparabilidad o abreviada) y sus condiciones.</li><li>Señala la sigla de registro (MB o MBT) cuando aplique.</li><li>Identifica qué información común (art. 6) deberá presentar cada uno.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar el ámbito y las exclusiones del Decreto 1782.</li><li>Identificar la ruta probable de cada producto.</li><li>Fundamentar cada decisión.</li></ul>
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
  <tr><td>Ámbito y exclusiones</td><td>30 %</td><td>Excluye el alérgeno y ubica los demás en el ámbito.</td><td>Error en una clasificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Rutas</td><td>40 %</td><td>Ruta completa (1), comparabilidad (2), abreviada solo si cumple las condiciones del art. 9 (3), con fundamento.</td><td>Rutas con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Información común</td><td>20 %</td><td>Relaciona la información del art. 6 con cada producto.</td><td>Relación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbiol_html$;
  v_t3 := $evbiol_html$<h2>Caso de estudio</h2>
<p>BioAndes (ficticia) prepara cinco solicitudes (datos simulados): (1) un anticuerpo monoclonal innovador con estudios propios; (2) un biosimilar de filgrastim; (3) una eritropoyetina con amplia experiencia clínica que se presentaría con información publicada; (4) un alérgeno para pruebas cutáneas; (5) una vacuna importada.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evbiol_html$;
  v_t4 := 'Tabla de clasificación con fundamento normativo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evbiol_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 1 a 9, 14 a 16, 19, 22, 24 y 26); Decreto 677 de 1995; Decreto 1474 de 2023; Resolución 3690 de 2016 (estabilidad de biológicos); guías del Ministerio de inmunogenicidad y de planes de gestión de riesgo; ICH Q5A a Q5E y Q6B; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo».</p>$evbiol_html$;
  v_t7 := NULL;
  v_j1 := $evbiol_json$["Ámbito.","Ruta.","Condiciones de la ruta.","Sigla.","Información común."]$evbiol_json$::jsonb;
  v_j2 := $evbiol_json${"version":1,"total":100,"criteria":[{"id":"ambito-y-exclusiones","name":"Ámbito y exclusiones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Excluye el alérgeno y ubica los demás en el ámbito."},{"level":3,"label":"Logrado","description":"Error en una clasificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"rutas","name":"Rutas","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Ruta completa (1), comparabilidad (2), abreviada solo si cumple las condiciones del art. 9 (3), con fundamento."},{"level":3,"label":"Logrado","description":"Rutas con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"informacion-comun","name":"Información común","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Relaciona la información del art. 6 con cada producto."},{"level":3,"label":"Logrado","description":"Relación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbiol_json$::jsonb;
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


  -- ── Actividad biol-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Decreto 1782 de 2014: rutas y evaluación farmacológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Decreto 1782 de 2014: rutas y evaluación farmacológica) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Planeación de la solicitud de un anticuerpo monoclonal nuevo';
  v_t2 := $evbiol_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Justifica la ruta con el artículo correspondiente.</li><li>Lista la información común del artículo 6 que debe preparar el fabricante.</li><li>Describe la secuencia de evaluaciones (arts. 14 y 15) y sus implicaciones en tiempos.</li><li>Identifica los riesgos (inmunogenicidad, plan de gestión de riesgo, requerimientos de la Sala).</li><li>Propón un cronograma con hitos.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Escoger y justificar la ruta.</li><li>Planear la secuencia de evaluaciones.</li><li>Identificar los riesgos del trámite.</li></ul>
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
  <tr><td>Ruta e información</td><td>35 %</td><td>Ruta de expediente completo (art. 7) y lista completa del art. 6.</td><td>Ruta correcta con información incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Secuencia y tiempos</td><td>30 %</td><td>Evaluación farmacológica primero y decisión en tres meses tras el concepto favorable.</td><td>Secuencia imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Riesgos y cronograma</td><td>25 %</td><td>Riesgos concretos con mitigación e hitos realistas.</td><td>Riesgos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbiol_html$;
  v_t3 := $evbiol_html$<h2>Caso de estudio</h2>
<p>Inmuno Pacífico (ficticia) quiere registrar un anticuerpo monoclonal innovador para artritis reumatoide, fabricado en el exterior, con estudios preclínicos y ensayos clínicos fase I a III propios (datos simulados). La gerencia pide un plan con tiempos y riesgos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evbiol_html$;
  v_t4 := 'Plan de solicitud con ruta, secuencia, riesgos y cronograma.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evbiol_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 1 a 9, 14 a 16, 19, 22, 24 y 26); Decreto 677 de 1995; Decreto 1474 de 2023; Resolución 3690 de 2016 (estabilidad de biológicos); guías del Ministerio de inmunogenicidad y de planes de gestión de riesgo; ICH Q5A a Q5E y Q6B; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo».</p>$evbiol_html$;
  v_t7 := NULL;
  v_j1 := $evbiol_json$["Ruta.","Información común.","Secuencia.","Riesgos.","Cronograma."]$evbiol_json$::jsonb;
  v_j2 := $evbiol_json${"version":1,"total":100,"criteria":[{"id":"ruta-e-informacion","name":"Ruta e información","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Ruta de expediente completo (art. 7) y lista completa del art. 6."},{"level":3,"label":"Logrado","description":"Ruta correcta con información incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"secuencia-y-tiempos","name":"Secuencia y tiempos","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Evaluación farmacológica primero y decisión en tres meses tras el concepto favorable."},{"level":3,"label":"Logrado","description":"Secuencia imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"riesgos-y-cronograma","name":"Riesgos y cronograma","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Riesgos concretos con mitigación e hitos realistas."},{"level":3,"label":"Logrado","description":"Riesgos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbiol_json$::jsonb;
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


  -- ── Actividad biol-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Calidad de biológicos y Buenas Prácticas de Manufactura' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Calidad de biológicos y Buenas Prácticas de Manufactura) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Verificación de BPM en una cadena de fabricación multinacional';
  v_t2 := $evbiol_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Construye la tabla de la cadena (etapa, sitio, país, evidencia de BPM, vigencia).</li><li>Identifica las brechas de cada sitio.</li><li>Analiza la discrepancia de dirección y sus consecuencias.</li><li>Propón cómo obtener o actualizar cada evidencia.</li><li>Prioriza el plan según su impacto en la radicación.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Mapear la cadena de fabricación y sus evidencias de BPM.</li><li>Detectar brechas documentales.</li><li>Proponer un plan para cerrarlas.</li></ul>
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
  <tr><td>Mapeo y brechas</td><td>40 %</td><td>Detecta el certificado vencido, la dirección distinta y el sitio sin evidencia.</td><td>Detecta dos de tres.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan</td><td>35 %</td><td>Acciones concretas por sitio (renovación, aclaración de dirección, evidencia del laboratorio).</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Priorización</td><td>15 %</td><td>Prioriza según el impacto en la radicación.</td><td>Sin priorización.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbiol_html$;
  v_t3 := $evbiol_html$<h2>Caso de estudio</h2>
<p>Biofarma Andina (ficticia) importará un anticuerpo cuya cadena incluye (datos simulados): banco celular y principio activo en Irlanda; llenado en Suiza; control de calidad de liberación en Alemania; acondicionamiento en Colombia. Recibe un certificado de BPM de la planta de Irlanda vencido hace dos meses, uno de Suiza vigente con una dirección distinta a la del contrato, ninguno del laboratorio de Alemania y el de la planta colombiana vigente.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evbiol_html$;
  v_t4 := 'Matriz de verificación de BPM con plan de cierre.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evbiol_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 1 a 9, 14 a 16, 19, 22, 24 y 26); Decreto 677 de 1995; Decreto 1474 de 2023; Resolución 3690 de 2016 (estabilidad de biológicos); guías del Ministerio de inmunogenicidad y de planes de gestión de riesgo; ICH Q5A a Q5E y Q6B; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo».</p>$evbiol_html$;
  v_t7 := NULL;
  v_j1 := $evbiol_json$["Tabla de la cadena.","Brechas.","Discrepancia de dirección.","Plan de cierre.","Priorización."]$evbiol_json$::jsonb;
  v_j2 := $evbiol_json${"version":1,"total":100,"criteria":[{"id":"mapeo-y-brechas","name":"Mapeo y brechas","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Detecta el certificado vencido, la dirección distinta y el sitio sin evidencia."},{"level":3,"label":"Logrado","description":"Detecta dos de tres."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan","name":"Plan","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Acciones concretas por sitio (renovación, aclaración de dirección, evidencia del laboratorio)."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"priorizacion","name":"Priorización","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Prioriza según el impacto en la radicación."},{"level":3,"label":"Logrado","description":"Sin priorización."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbiol_json$::jsonb;
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


  -- ── Actividad biol-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Guías técnicas: inmunogenicidad, estabilidad y gestión de riesgo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Guías técnicas: inmunogenicidad, estabilidad y gestión de riesgo) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: clasificación, ruta y paquete técnico del anticuerpo';
  v_t2 := $evbiol_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos del producto (ficticios).</li><li>Fase 1: clasifica el producto (art. 3) y su sigla de registro (art. 19).</li><li>Fase 2: justifica la ruta (art. 7) y la secuencia de evaluaciones (arts. 14 y 15).</li><li>Fase 3: resume la estrategia de inmunogenicidad y de estabilidad.</li><li>Fase 3: estructura el plan de gestión de riesgo (art. 24).</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Clasificación y marco normativo.</li>
  <li><strong>Fase 2 · Unidad 2 (rutas).</strong> Ruta, secuencia de evaluaciones y solicitud.</li>
  <li><strong>Fase 3 · Unidad 3 (guías técnicas).</strong> Inmunogenicidad, estabilidad y plan de gestión de riesgo.</li>
  <li><strong>Fase 4 · Unidad 4 (calidad y BPM).</strong> Calidad del producto y BPM de la cadena.</li>
  <li><strong>Fase 5 · Unidad 5 (ciclo de vida).</strong> Modificaciones, farmacovigilancia y cadena de frío.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar el producto y escoger la ruta.</li><li>Integrar inmunogenicidad, estabilidad y plan de gestión de riesgo.</li></ul>
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
  <tr><td>Clasificación y ruta</td><td>30 %</td><td>Biotecnológico (MBT), ruta de expediente completo y secuencia correcta.</td><td>Clasificación o ruta con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Paquete técnico</td><td>35 %</td><td>Estrategia escalonada de inmunogenicidad y estabilidad con datos reales.</td><td>Paquete incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan de gestión de riesgo</td><td>25 %</td><td>Especificaciones de seguridad, farmacovigilancia activa, minimización e informes periódicos.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbiol_html$;
  v_t3 := $evbiol_html$<h2>Caso de estudio</h2>
<p>BioCaribe (ficticia) quiere registrar en Colombia un anticuerpo monoclonal biotecnológico fabricado en el exterior, con estudios preclínicos y clínicos propios, y luego mantenerlo en el mercado (datos simulados). La cadena incluye principio activo, llenado y acondicionamiento en tres países. Te encargan la estrategia regulatoria completa. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evbiol_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evbiol_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 1 a 9, 14 a 16, 19, 22, 24 y 26); Decreto 677 de 1995; Decreto 1474 de 2023; Resolución 3690 de 2016 (estabilidad de biológicos); guías del Ministerio de inmunogenicidad y de planes de gestión de riesgo; ICH Q5A a Q5E y Q6B; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo».</p>$evbiol_html$;
  v_t7 := NULL;
  v_j1 := $evbiol_json$["Clasificación y sigla.","Ruta y secuencia.","Inmunogenicidad.","Estabilidad.","Plan de gestión de riesgo."]$evbiol_json$::jsonb;
  v_j2 := $evbiol_json${"version":1,"total":100,"criteria":[{"id":"clasificacion-y-ruta","name":"Clasificación y ruta","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Biotecnológico (MBT), ruta de expediente completo y secuencia correcta."},{"level":3,"label":"Logrado","description":"Clasificación o ruta con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"paquete-tecnico","name":"Paquete técnico","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Estrategia escalonada de inmunogenicidad y estabilidad con datos reales."},{"level":3,"label":"Logrado","description":"Paquete incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-de-gestion-de-riesgo","name":"Plan de gestión de riesgo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Especificaciones de seguridad, farmacovigilancia activa, minimización e informes periódicos."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbiol_json$::jsonb;
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


  -- ── Actividad biol-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Ciclo de vida: migración normativa, modificaciones y cadena de frío' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Ciclo de vida: migración normativa, modificaciones y cadena de frío) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: calidad, BPM y ciclo de vida del anticuerpo';
  v_t2 := $evbiol_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: resume la calidad del producto (Q5A a Q5E, Q6B) y verifica las BPM de cada sitio.</li><li>Fase 5: diseña el control de cambios con comparabilidad (Q5E) y su trámite.</li><li>Fase 5: define la farmacovigilancia y la actualización del plan de gestión de riesgo.</li><li>Fase 5: diseña el plan de cadena de frío y la gestión de excursiones.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube la estrategia en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Clasificación y marco normativo.</li>
  <li><strong>Fase 2 · Unidad 2 (rutas).</strong> Ruta, secuencia de evaluaciones y solicitud.</li>
  <li><strong>Fase 3 · Unidad 3 (guías técnicas).</strong> Inmunogenicidad, estabilidad y plan de gestión de riesgo.</li>
  <li><strong>Fase 4 · Unidad 4 (calidad y BPM).</strong> Calidad del producto y BPM de la cadena.</li>
  <li><strong>Fase 5 · Unidad 5 (ciclo de vida).</strong> Modificaciones, farmacovigilancia y cadena de frío.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Asegurar la calidad y las BPM de la cadena.</li><li>Planear el ciclo de vida del registro.</li></ul>
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
  <tr><td>Calidad y BPM</td><td>25 %</td><td>Calidad según ICH y BPM verificadas sitio por sitio.</td><td>Verificación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Ciclo de vida</td><td>30 %</td><td>Comparabilidad ante cambios, actualización del plan de riesgo y medidas de vigencia indefinida.</td><td>Ciclo de vida general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cadena de frío</td><td>20 %</td><td>Plan con cuarentena y evaluación de excursiones con datos.</td><td>Plan sin evaluación de excursiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbiol_html$;
  v_t3 := $evbiol_html$<h2>Caso de estudio</h2>
<p>BioCaribe (ficticia) quiere registrar en Colombia un anticuerpo monoclonal biotecnológico fabricado en el exterior, con estudios preclínicos y clínicos propios, y luego mantenerlo en el mercado (datos simulados). La cadena incluye principio activo, llenado y acondicionamiento en tres países. Te encargan la estrategia regulatoria completa. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en la estrategia que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evbiol_html$;
  v_t4 := 'Estrategia regulatoria completa con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evbiol_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 1 a 9, 14 a 16, 19, 22, 24 y 26); Decreto 677 de 1995; Decreto 1474 de 2023; Resolución 3690 de 2016 (estabilidad de biológicos); guías del Ministerio de inmunogenicidad y de planes de gestión de riesgo; ICH Q5A a Q5E y Q6B; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo».</p>$evbiol_html$;
  v_t7 := NULL;
  v_j1 := $evbiol_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Calidad y BPM.","Control de cambios.","Farmacovigilancia.","Cadena de frío y resumen."]$evbiol_json$::jsonb;
  v_j2 := $evbiol_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"calidad-y-bpm","name":"Calidad y BPM","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Calidad según ICH y BPM verificadas sitio por sitio."},{"level":3,"label":"Logrado","description":"Verificación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ciclo-de-vida","name":"Ciclo de vida","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Comparabilidad ante cambios, actualización del plan de riesgo y medidas de vigencia indefinida."},{"level":3,"label":"Logrado","description":"Ciclo de vida general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"cadena-de-frio","name":"Cadena de frío","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Plan con cuarentena y evaluación de excursiones con datos."},{"level":3,"label":"Logrado","description":"Plan sin evaluación de excursiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbiol_json$::jsonb;
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


  -- ── Foro biol-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con medicamentos biológicos';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evbiol_html$<h2>Para empezar</h2>
<p>Piensa en un biológico que hayas dispensado, registrado o estudiado y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evbiol_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evbiol_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evbiol_html$;
  v_t6 := $evbiol_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evbiol_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has trabajado con la cadena de frío o con planes de gestión de riesgo?', '¿Qué te parece más difícil de los biológicos: la calidad, la norma o la farmacovigilancia?']::text[];
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


  -- ── Foro biol-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de los medicamentos biológicos y su marco normativo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de los medicamentos biológicos y su marco normativo) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Productos frontera';
  v_t2 := 'Argumentar cómo clasificar productos de origen biológico que no encajan fácilmente.';
  v_t3 := $evbiol_html$<h2>Caso del foro</h2>
<p>Un importador ficticio tiene en su portafolio (datos simulados): un anticuerpo monoclonal, un alérgeno de diagnóstico, una heparina de origen porcino, un medicamento homeopático con extractos biológicos y una insulina recombinante. El equipo duda qué norma aplica a cada uno.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbiol_html$;
  v_t4 := '¿Cómo clasificarías cada producto y con qué fundamento?';
  v_t5 := $evbiol_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada clasificación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbiol_html$;
  v_t6 := $evbiol_html$<h2>Normas de participación</h2>
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
</details>$evbiol_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué excluye el artículo 2 del Decreto 1782?', '¿Qué hace biotecnológico a un producto?', '¿A quién consultarías un caso dudoso?']::text[];
  v_j1 := $evbiol_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada clasificación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbiol_json$::jsonb;
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


  -- ── Foro biol-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Decreto 1782 de 2014: rutas y evaluación farmacológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Decreto 1782 de 2014: rutas y evaluación farmacológica) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Elegir la ruta correcta';
  v_t2 := 'Argumentar cómo escoger la ruta de registro de un biológico y sus riesgos.';
  v_t3 := $evbiol_html$<h2>Caso del foro</h2>
<p>Una empresa ficticia tiene una proteína de fusión aprobada en Europa con estudios propios y quiere registrarla en Colombia (datos simulados). Un asesor propone la ruta de comparabilidad «porque es más rápida», aunque no hay un medicamento de referencia con el mismo principio activo.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbiol_html$;
  v_t4 := '¿Qué ruta recomendarías y por qué?';
  v_t5 := $evbiol_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta tu recomendación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbiol_html$;
  v_t6 := $evbiol_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta tu recomendación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbiol_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué necesita la ruta de comparabilidad para aplicarse?', '¿Qué información común se exige en todas las rutas?', '¿Cómo influye el concepto de la Sala en los tiempos?']::text[];
  v_j1 := $evbiol_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta tu recomendación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbiol_json$::jsonb;
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


  -- ── Foro biol-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Guías técnicas: inmunogenicidad, estabilidad y gestión de riesgo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Guías técnicas: inmunogenicidad, estabilidad y gestión de riesgo) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · El plan de gestión de riesgo como documento vivo';
  v_t2 := 'Argumentar por qué el plan de gestión de riesgo debe actualizarse durante el ciclo de vida.';
  v_t3 := $evbiol_html$<h2>Caso del foro</h2>
<p>Un titular ficticio presentó el plan de gestión de riesgo de un biológico hace tres años y nunca lo actualizó (datos simulados). Desde entonces hubo dos señales de seguridad y una nueva indicación aprobada.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbiol_html$;
  v_t4 := '¿Qué riesgos ves y qué harías?';
  v_t5 := $evbiol_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbiol_html$;
  v_t6 := $evbiol_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbiol_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué contiene un plan de gestión de riesgo?', '¿Qué eventos obligan a actualizarlo?', '¿Cómo se relaciona con los informes periódicos de seguridad?']::text[];
  v_j1 := $evbiol_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbiol_json$::jsonb;
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


  -- ── Foro biol-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Calidad de biológicos y Buenas Prácticas de Manufactura' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Calidad de biológicos y Buenas Prácticas de Manufactura) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · El proceso es el producto';
  v_t2 := 'Argumentar por qué los cambios de proceso en biológicos exigen comparabilidad.';
  v_t3 := $evbiol_html$<h2>Caso del foro</h2>
<p>Un fabricante ficticio de un anticuerpo cambia el medio de cultivo para mejorar el rendimiento (datos simulados). El área de producción dice que «la molécula es la misma» y no quiere hacer estudios adicionales.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbiol_html$;
  v_t4 := '¿Qué le responderías y qué estudios propondrías?';
  v_t5 := $evbiol_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o la norma que sustenta tu respuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbiol_html$;
  v_t6 := $evbiol_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta tu respuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbiol_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué atributos pueden cambiar con el medio de cultivo?', '¿Qué dice ICH Q5E sobre la comparabilidad?', '¿Cómo se tramita el cambio ante el Invima?']::text[];
  v_j1 := $evbiol_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta tu respuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbiol_json$::jsonb;
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


  -- ── Foro biol-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Ciclo de vida: migración normativa, modificaciones y cadena de frío' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Ciclo de vida: migración normativa, modificaciones y cadena de frío) en Registro Sanitario de Medicamentos Biológicos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Cadena de frío en ciudades calurosas';
  v_t2 := 'Argumentar qué controles aseguran la cadena de frío hasta el paciente.';
  v_t3 := $evbiol_html$<h2>Caso del foro</h2>
<p>Un distribuidor ficticio reporta tres excursiones de temperatura en un mes en rutas hacia ciudades costeras (datos simulados). Los registradores muestran que las excursiones ocurren en el último tramo, entre la bodega regional y la farmacia.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbiol_html$;
  v_t4 := '¿Qué controles implementarías y cómo decidirías sobre los lotes afectados?';
  v_t5 := $evbiol_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o la norma que sustenta cada control. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbiol_html$;
  v_t6 := $evbiol_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta cada control.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbiol_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué datos se necesitan para evaluar una excursión?', '¿Qué responsabilidades tiene el titular frente al distribuidor?', '¿Qué indicador usarías?']::text[];
  v_j1 := $evbiol_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta cada control."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbiol_json$::jsonb;
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


  RAISE NOTICE 'Registro Sanitario de Medicamentos Biológicos: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evbiol$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Regulación de Medicamentos Biosimilares
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evbios$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Regulación de Medicamentos Biosimilares' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos: qué es un biosimilar y por qué no es un genérico', 'Unidad 2. El ejercicio de comparabilidad paso a paso', 'Unidad 3. Marco colombiano: las rutas del Decreto 1782 de 2014', 'Unidad 4. Referentes internacionales: OMS, EMA, FDA y Latinoamérica', 'Unidad 5. Uso, vigilancia y acceso: extrapolación, intercambiabilidad y casos reales']::text[])) < 5 THEN
    RAISE NOTICE 'Regulación de Medicamentos Biosimilares: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evbios_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evbios_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz bios-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: qué es un biosimilar y por qué no es un genérico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: qué es un biosimilar y por qué no es un genérico) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos: qué es un biosimilar y por qué no es un genérico';
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


    v_t3 := '¿Por qué un biosimilar no se registra como un genérico de síntesis química?';
    v_t4 := 'Los biológicos tienen variabilidad inherente y dependen del proceso; un biosimilar no es idéntico al referente. Por eso no basta la bioequivalencia: se demuestra alta similitud con un ejercicio de comparabilidad escalonado (calidad, no clínico, clínico).';
    v_j1 := $evbios_json${"external_id":"bios-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Biosimilar frente a genérico: diferencias regulatorias","outcome":"Biosimilar frente a genérico: diferencias regulatorias","source":"Decreto 1782 de 2014, arts. 3 y 8; OMS TRS 1043, anexo 3."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u1-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Porque los biosimilares siempre son más costosos que los genéricos y requieren otro trámite de precios.', FALSE, 'El precio no define el régimen.', 0),
      (v_pregunta, 'Porque no puede ser idéntico al referente; se demuestra alta similitud con un ejercicio de comparabilidad.', TRUE, 'Correcto. No basta la bioequivalencia.', 1),
      (v_pregunta, 'Porque los biosimilares no requieren ningún estudio para obtener el registro sanitario en Colombia.', FALSE, 'Requieren un ejercicio de comparabilidad.', 2),
      (v_pregunta, 'Porque los genéricos de síntesis química no pueden venderse en hospitales de alta complejidad.', FALSE, 'No es la razón del régimen propio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Según el artículo 3.2 del Decreto 1782, ¿qué es el medicamento de referencia?';
    v_t4 := 'El artículo 3.2 del Decreto 1782 define el medicamento de referencia como el biológico con registro autorizado por el Invima u otra agencia de referencia, con expediente completo, que se usa como comparador en el ejercicio de comparabilidad.';
    v_j1 := $evbios_json${"external_id":"bios-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"El medicamento de referencia y su papel","outcome":"El medicamento de referencia y su papel","source":"Decreto 1782 de 2014, art. 3.2."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u1-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Un biológico autorizado por el Invima u otra agencia de referencia, con expediente completo.', TRUE, 'Correcto. Se usa como comparador.', 0),
      (v_pregunta, 'El biosimilar más vendido del mercado, que sirve como patrón para los nuevos competidores.', FALSE, 'El referente tiene expediente completo.', 1),
      (v_pregunta, 'Cualquier biológico importado con certificado de venta libre del país de origen del fabricante.', FALSE, 'Se exige expediente completo y autorización.', 2),
      (v_pregunta, 'El producto que el titular escoja libremente entre los disponibles en las farmacias colombianas.', FALSE, 'Hay criterios definidos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un genérico de síntesis y un biosimilar se comparan con su referente. ¿Qué análisis es correcto?';
    v_t4 := 'El genérico se apoya en la identidad del principio activo y en la bioequivalencia. El biosimilar demuestra alta similitud con la totalidad de la evidencia: caracterización analítica extensa, estudios no clínicos (con prioridad in vitro) y clínicos (PK/PD e inmunogenicidad, y eficacia cuando sea necesario).';
    v_j1 := $evbios_json${"external_id":"bios-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Biosimilar frente a genérico: diferencias regulatorias","outcome":"Biosimilar frente a genérico: diferencias regulatorias","source":"OMS TRS 1043, anexo 3; Decreto 1782 de 2014, art. 8."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u1-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Ambos se registran exactamente igual, con un estudio de bioequivalencia en voluntarios sanos y nada más.', FALSE, 'El biosimilar exige más.', 0),
      (v_pregunta, 'El genérico requiere ensayos clínicos de eficacia y el biosimilar solo una prueba de disolución.', FALSE, 'Es al revés en complejidad.', 1),
      (v_pregunta, 'El genérico suele bastar con BE; el biosimilar exige comparabilidad analítica, no clínica y clínica.', TRUE, 'Correcto. Totalidad de la evidencia.', 2),
      (v_pregunta, 'Ninguno de los dos necesita compararse con el referente si ya se vende en otros países.', FALSE, 'La comparación es la base de ambos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un laboratorio quiere presentar como biosimilar un producto sin medicamento de referencia aprobado. ¿Cuál es la mejor valoración?';
    v_t4 := 'La ruta de comparabilidad (art. 8) exige un medicamento de referencia con el cual hacer el ejercicio escalonado. Sin referente, el producto debe presentarse por la ruta de expediente completo (art. 7), con estudios propios.';
    v_j1 := $evbios_json${"external_id":"bios-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: ¿biosimilar o expediente completo?","outcome":"Caso práctico: ¿biosimilar o expediente completo?","source":"Decreto 1782 de 2014, arts. 7 y 8."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u1-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es viable, porque cualquier biológico puede registrarse como biosimilar si es más económico.', FALSE, 'Sin referente no hay biosimilar.', 0),
      (v_pregunta, 'Es viable si el producto se fabrica en un país de la OCDE con alta vigilancia sanitaria.', FALSE, 'El origen no reemplaza al referente.', 1),
      (v_pregunta, 'Es viable si se compromete a presentar el referente después de obtener el registro.', FALSE, 'El referente se requiere desde el inicio.', 2),
      (v_pregunta, 'No es viable: sin referente no hay comparabilidad; correspondería la ruta de expediente completo.', TRUE, 'Correcto. Artículo 7.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bios-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. El ejercicio de comparabilidad paso a paso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. El ejercicio de comparabilidad paso a paso) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · El ejercicio de comparabilidad paso a paso';
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


    v_t3 := '¿Qué significa el principio de «totalidad de la evidencia» en biosimilares?';
    v_t4 := 'La biosimilitud se concluye integrando toda la evidencia: la caracterización analítica es la base, los estudios no clínicos priorizan ensayos in vitro y los clínicos (PK/PD, inmunogenicidad y eficacia cuando sea necesaria) resuelven la incertidumbre residual.';
    v_j1 := $evbios_json${"external_id":"bios-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: totalidad de la evidencia","outcome":"Introducción a la unidad: totalidad de la evidencia","source":"OMS TRS 1043, anexo 3."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u2-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que basta un único ensayo clínico grande para demostrar la biosimilitud del producto ante cualquier agencia.', FALSE, 'No se basa en un solo estudio.', 0),
      (v_pregunta, 'Que el producto debe ser idéntico al referente en todos sus atributos medibles.', FALSE, 'Se exige alta similitud, no identidad.', 1),
      (v_pregunta, 'Que se concluye integrando datos analíticos, no clínicos y clínicos de forma escalonada.', TRUE, 'Correcto. El análisis es la base.', 2),
      (v_pregunta, 'Que la decisión se toma solo con la experiencia de uso en otros países.', FALSE, 'Se requiere evidencia propia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En la caracterización analítica de un anticuerpo biosimilar, ¿cuál es un atributo crítico de calidad?';
    v_t4 := 'Los atributos críticos de calidad de un anticuerpo incluyen estructura primaria y de orden superior, glicosilación, variantes de carga y tamaño, agregados y potencia. Se fijan rangos de similitud a partir de varios lotes del referente.';
    v_j1 := $evbios_json${"external_id":"bios-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caracterización analítica y atributos críticos de calidad","outcome":"Caracterización analítica y atributos críticos de calidad","source":"ICH Q6B; OMS TRS 1043, anexo 3."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u2-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'El patrón de glicosilación, que puede afectar la función efectora y la farmacocinética.', TRUE, 'Correcto. Junto con potencia y variantes.', 0),
      (v_pregunta, 'El color de la tapa del vial, que identifica la presentación comercial del producto.', FALSE, 'No es un atributo de calidad crítico.', 1),
      (v_pregunta, 'El nombre comercial elegido para el mercado colombiano y su registro de marca.', FALSE, 'No es un atributo de calidad.', 2),
      (v_pregunta, 'El precio por miligramo frente al producto de referencia en el sistema de salud.', FALSE, 'No es un atributo de calidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Según la OMS 2022, ¿qué papel tienen los estudios en animales en un biosimilar?';
    v_t4 := 'La revisión de la OMS de 2022 (TRS 1043, anexo 3) adopta un enfoque escalonado que prioriza los ensayos in vitro y reserva los estudios en animales para cuando quedan incertidumbres que no pueden resolverse de otra forma.';
    v_j1 := $evbios_json${"external_id":"bios-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Estudios no clínicos: del in vitro al in vivo","outcome":"Estudios no clínicos: del in vitro al in vivo","source":"OMS TRS 1043, anexo 3."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u2-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Son obligatorios siempre, con estudios de toxicidad completos como en un producto biológico nuevo.', FALSE, 'La OMS 2022 reduce su papel.', 0),
      (v_pregunta, 'Se priorizan los ensayos in vitro; los estudios en animales se reservan para incertidumbres.', TRUE, 'Correcto. Enfoque escalonado.', 1),
      (v_pregunta, 'Reemplazan por completo la caracterización analítica del producto y del referente.', FALSE, 'La analítica es la base.', 2),
      (v_pregunta, 'Solo se hacen si el producto se va a vender también en Europa o Estados Unidos.', FALSE, 'No depende del mercado.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En un biosimilar, la incidencia de anticuerpos antifármaco fue del 12 % frente al 5 % del referente. ¿Cuál es la mejor valoración?';
    v_t4 := 'Una mayor inmunogenicidad puede afectar la eficacia y la seguridad. La diferencia debe analizarse (métodos, neutralización, impacto clínico) y justificarse; si es clínicamente relevante, impide concluir la biosimilitud. La guía colombiana de inmunogenicidad orienta la evaluación.';
    v_j1 := $evbios_json${"external_id":"bios-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Inmunogenicidad: la guía colombiana","outcome":"Inmunogenicidad: la guía colombiana","source":"Guía de inmunogenicidad del Ministerio de Salud; Decreto 1782 de 2014, art. 8."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u2-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No importa, porque la inmunogenicidad no tiene relación con la eficacia ni con la seguridad.', FALSE, 'Puede afectar ambas.', 0),
      (v_pregunta, 'Es aceptable si el producto se vende a un precio menor que el del referente.', FALSE, 'El precio no compensa la diferencia.', 1),
      (v_pregunta, 'Es aceptable si los pacientes firman un consentimiento informado específico.', FALSE, 'El consentimiento no resuelve la diferencia.', 2),
      (v_pregunta, 'Es una diferencia relevante que debe explicarse y evaluarse por su impacto clínico.', TRUE, 'Correcto. Puede impedir la biosimilitud.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bios-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Marco colombiano: las rutas del Decreto 1782 de 2014' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Marco colombiano: las rutas del Decreto 1782 de 2014) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Marco colombiano: las rutas del Decreto 1782 de 2014';
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


    v_t3 := 'Según el artículo 5 del Decreto 1782, ¿cambia el estándar de evaluación según la ruta?';
    v_t4 := 'El artículo 5 aclara que el estándar de evaluación es el mismo sin importar la ruta; lo que cambia es el tipo de evidencia: estudios propios (art. 7), ejercicio de comparabilidad (art. 8) o la ruta abreviada con sus condiciones (art. 9).';
    v_j1 := $evbios_json${"external_id":"bios-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Expediente completo, comparabilidad y ruta abreviada","outcome":"Expediente completo, comparabilidad y ruta abreviada","source":"Decreto 1782 de 2014, art. 5."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u3-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Sí: la ruta abreviada tiene un estándar menor y por eso se aprueba sin estudios de calidad.', FALSE, 'El estándar es el mismo.', 0),
      (v_pregunta, 'Sí: la ruta de comparabilidad solo evalúa la calidad y no la seguridad ni la eficacia.', FALSE, 'Se evalúan las tres dimensiones.', 1),
      (v_pregunta, 'No: el estándar es el mismo en todas las rutas; cambia el tipo de evidencia.', TRUE, 'Correcto. Así lo aclara el artículo 5.', 2),
      (v_pregunta, 'Depende del país de origen del fabricante y de su agencia sanitaria.', FALSE, 'El estándar no depende del origen.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un biosimilar quiere usar como referente un producto aprobado por ANVISA. ¿Lo admite el artículo 8?';
    v_t4 := 'El artículo 8 del Decreto 1782 acepta como referentes los productos aprobados por las agencias que enumera, entre ellas la EMA, ANVISA, ANMAT y países de la OCDE con alta vigilancia sanitaria.';
    v_j1 := $evbios_json${"external_id":"bios-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Ruta de comparabilidad: requisitos y evaluación INVIMA","outcome":"Ruta de comparabilidad: requisitos y evaluación INVIMA","source":"Decreto 1782 de 2014, art. 8."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u3-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'No, porque solo se aceptan referentes aprobados por el Invima en Colombia.', FALSE, 'El art. 8 acepta otras agencias.', 0),
      (v_pregunta, 'Sí: el artículo 8 acepta, entre otras, a EMA, ANVISA, ANMAT y países OCDE de alta vigilancia.', TRUE, 'Correcto. Se verifica la lista.', 1),
      (v_pregunta, 'No, porque los productos aprobados en Latinoamérica nunca pueden servir de referente.', FALSE, 'ANVISA y ANMAT están en la lista.', 2),
      (v_pregunta, 'Sí, cualquier agencia sanitaria del mundo sirve como referencia.', FALSE, 'La lista es definida.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué análisis es correcto sobre la ruta abreviada del artículo 9?';
    v_t4 := 'El artículo 9 permite la ruta abreviada solo si el ingrediente activo está suficientemente caracterizado, tiene un perfil de seguridad y eficacia altamente documentado, considerable experiencia clínica y farmacovigilancia robusta. La evaluación farmacológica sigue a cargo de la Sala (art. 4).';
    v_j1 := $evbios_json${"external_id":"bios-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Ruta abreviada de comparabilidad: condiciones del art. 9","outcome":"Ruta abreviada de comparabilidad: condiciones del art. 9","source":"Decreto 1782 de 2014, arts. 4 y 9."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u3-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Permite registrar cualquier biológico sin estudios, solo con una carta del fabricante.', FALSE, 'Tiene condiciones estrictas.', 0),
      (v_pregunta, 'Aplica a cualquier producto nuevo para acelerar su llegada al mercado colombiano.', FALSE, 'No aplica a productos nuevos.', 1),
      (v_pregunta, 'Reemplaza la evaluación de la Sala Especializada por una revisión documental.', FALSE, 'La Sala sigue evaluando.', 2),
      (v_pregunta, 'Exige activo caracterizado, perfil documentado, amplia experiencia y farmacovigilancia robusta.', TRUE, 'Correcto. Sigue evaluando la Sala.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un gremio afirma que «en Colombia no existen guías del Decreto 1782». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 22 ordenó expedir guías de inmunogenicidad, planes de gestión de riesgo y estabilidad; el artículo 26 condicionó la vigencia a las de inmunogenicidad y estabilidad, que se expidieron. Otras guías previstas quedaron en proyecto; conviene verificar su estado en el normograma.';
    v_j1 := $evbios_json${"external_id":"bios-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Guías reglamentarias y estado de implementación","outcome":"Guías reglamentarias y estado de implementación","source":"Decreto 1782 de 2014, arts. 22 y 26."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u3-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es imprecisa: se expidieron las de inmunogenicidad y estabilidad; otras quedaron en proyecto.', TRUE, 'Correcto. Hay que revisar su estado.', 0),
      (v_pregunta, 'Es correcta, porque el decreto nunca entró en vigencia por falta de las guías que debía expedir el Ministerio.', FALSE, 'El decreto está vigente.', 1),
      (v_pregunta, 'Es correcta, porque el Invima aplica solo las guías de la FDA a los biológicos.', FALSE, 'Hay guías nacionales.', 2),
      (v_pregunta, 'Es imprecisa porque todas las guías previstas ya se expidieron hace años.', FALSE, 'No todas se expidieron.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bios-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Referentes internacionales: OMS, EMA, FDA y Latinoamérica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Referentes internacionales: OMS, EMA, FDA y Latinoamérica) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Referentes internacionales: OMS, EMA, FDA y Latinoamérica';
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


    v_t3 := '¿Qué cambió en la guía de la OMS de 2022 frente a la de 2009?';
    v_t4 := 'La revisión de 2022 (TRS 1043, anexo 3) admite referentes no locales con condiciones, reduce el papel de los estudios en animales y flexibiliza los ensayos comparativos de eficacia cuando la analítica y la PK/PD resuelven la incertidumbre.';
    v_j1 := $evbios_json${"external_id":"bios-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"De la guía OMS 2009 a la revisión 2022 (TRS 1043, Anexo 3)","outcome":"De la guía OMS 2009 a la revisión 2022 (TRS 1043, Anexo 3)","source":"OMS TRS 1043, anexo 3."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u4-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Prohibió los biosimilares en los países de ingresos bajos y medianos por razones de seguridad.', FALSE, 'La guía no prohibió los biosimilares.', 0),
      (v_pregunta, 'Exigió estudios de toxicidad en animales para todos los biosimilares sin excepción.', FALSE, 'Redujo el papel de esos estudios.', 1),
      (v_pregunta, 'Referentes no locales, menos estudios en animales y eficacia según la incertidumbre.', TRUE, 'Correcto. Con condiciones para cada flexibilidad.', 2),
      (v_pregunta, 'Eliminó la caracterización analítica y la reemplazó por ensayos clínicos grandes.', FALSE, 'La analítica gana peso.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En Estados Unidos, ¿qué distingue a un biosimilar «intercambiable»?';
    v_t4 := 'La FDA (sección 351(k)) tiene la categoría de biosimilar intercambiable, que permite la sustitución en la farmacia según las leyes estatales. La EMA y las agencias europeas consideran intercambiables los biosimilares aprobados en la UE, sin una categoría separada.';
    v_j1 := $evbios_json${"external_id":"bios-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"FDA: biosimilar, intercambiable y los cambios de 2024–2025","outcome":"FDA: biosimilar, intercambiable y los cambios de 2024–2025","source":"FDA, sección 351(k); EMA y HMA."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u4-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que puede sustituirse en la farmacia sin intervención del prescriptor, según reglas estatales.', TRUE, 'Correcto. Es una categoría propia de la FDA.', 0),
      (v_pregunta, 'Que se vende a un precio igual al del producto de referencia en todos los estados del país norteamericano.', FALSE, 'No es un criterio de precio.', 1),
      (v_pregunta, 'Que se fabrica en la misma planta que el producto de referencia.', FALSE, 'No es un criterio de fabricación.', 2),
      (v_pregunta, 'Que no requiere farmacovigilancia después de su aprobación.', FALSE, 'Requiere farmacovigilancia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Al planear el registro de un biosimilar en varios países latinoamericanos, ¿qué análisis es más útil?';
    v_t4 := 'Una matriz regulatoria multipaís identifica diferencias en referentes aceptados, exigencias clínicas, inmunogenicidad, extrapolación, intercambiabilidad y farmacovigilancia, y permite planear un paquete que satisfaga a todas las autoridades.';
    v_j1 := $evbios_json${"external_id":"bios-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"ANMAT, COFEPRIS y el panorama latinoamericano","outcome":"ANMAT, COFEPRIS y el panorama latinoamericano","source":"Marcos regulatorios regionales; OMS TRS 1043, anexo 3."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u4-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Asumir que todos los países exigen lo mismo, porque comparten idioma y región geográfica.', FALSE, 'Los requisitos difieren.', 0),
      (v_pregunta, 'Una matriz por país con referente, clínica, inmunogenicidad, extrapolación e intercambiabilidad.', TRUE, 'Correcto. También farmacovigilancia.', 1),
      (v_pregunta, 'Registrar primero en el país con menos requisitos y usar esa aprobación como única prueba en los demás.', FALSE, 'Una aprobación no reemplaza los requisitos.', 2),
      (v_pregunta, 'Presentar en cada país solo la información que pida su formulario básico.', FALSE, 'Se arriesgan requerimientos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un asesor dice que «como la EMA declara intercambiables los biosimilares, en Colombia pueden sustituirse automáticamente en la farmacia». ¿Cuál es la mejor valoración?';
    v_t4 := 'La posición de la EMA y las HMA no se aplica automáticamente en Colombia, donde no hay una reglamentación específica sobre intercambiabilidad o sustitución automática de biológicos. Los cambios requieren decisión clínica, trazabilidad y farmacovigilancia (Decreto 1782 art. 24).';
    v_j1 := $evbios_json${"external_id":"bios-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Marco de la EMA para biosimilares","outcome":"Marco de la EMA para biosimilares","source":"Decreto 1782 de 2014, art. 24; EMA y HMA."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u4-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es correcta, porque Colombia adopta automáticamente todas las posiciones técnicas de la EMA.', FALSE, 'No hay adopción automática.', 0),
      (v_pregunta, 'Es correcta si el biosimilar fue aprobado por la ruta de comparabilidad.', FALSE, 'La ruta no define la sustitución.', 1),
      (v_pregunta, 'Es incorrecta porque la EMA nunca se ha pronunciado sobre la intercambiabilidad.', FALSE, 'La EMA sí se pronunció.', 2),
      (v_pregunta, 'Es imprecisa: en Colombia no hay reglamentación específica; se requiere decisión médica.', TRUE, 'Correcto. Con trazabilidad y farmacovigilancia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bios-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Uso, vigilancia y acceso: extrapolación, intercambiabilidad y casos reales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Uso, vigilancia y acceso: extrapolación, intercambiabilidad y casos reales) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Uso, vigilancia y acceso: extrapolación, intercambiabilidad y casos reales';
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


    v_t3 := '¿En qué se basa la extrapolación de indicaciones de un biosimilar?';
    v_t4 := 'La extrapolación se justifica por indicación con el mecanismo de acción, el receptor, la población más sensible estudiada y la seguridad e inmunogenicidad. El Decreto 1782 exige que las indicaciones se soporten en evidencia de seguridad y eficacia (art. 4, par. 1).';
    v_j1 := $evbios_json${"external_id":"bios-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Extrapolación de indicaciones","outcome":"Extrapolación de indicaciones","source":"Decreto 1782 de 2014, art. 4; OMS TRS 1043, anexo 3."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u5-q1' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'En la decisión comercial del titular de vender el producto para todas las indicaciones.', FALSE, 'Requiere justificación científica.', 0),
      (v_pregunta, 'En el mecanismo de acción, el receptor implicado y la evidencia de la población estudiada.', TRUE, 'Correcto. Con justificación por indicación.', 1),
      (v_pregunta, 'En la opinión de los médicos que ya usan el producto en otras indicaciones.', FALSE, 'No es la base científica.', 2),
      (v_pregunta, 'En el precio del biosimilar frente al del producto de referencia.', FALSE, 'El precio no es un criterio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué exige el artículo 24 del Decreto 1782 que facilita la vigilancia de un biosimilar?';
    v_t4 := 'El artículo 24 exige un plan de gestión de riesgos, farmacovigilancia activa, informes periódicos y tecnología de señalización que identifique el producto en la cadena de distribución, lo que permite atribuir los eventos al producto correcto.';
    v_j1 := $evbios_json${"external_id":"bios-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Nomenclatura, farmacovigilancia y trazabilidad","outcome":"Nomenclatura, farmacovigilancia y trazabilidad","source":"Decreto 1782 de 2014, art. 24."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u5-q2' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Que el producto se venda solo en hospitales públicos para controlar mejor su uso en pacientes.', FALSE, 'El artículo no restringe el canal de venta.', 0),
      (v_pregunta, 'Que el paciente firme un consentimiento cada vez que reciba una dosis.', FALSE, 'El artículo no exige consentimientos por dosis.', 1),
      (v_pregunta, 'Que el titular publique sus precios en la página web del Ministerio.', FALSE, 'El artículo no trata la publicación de precios.', 2),
      (v_pregunta, 'Señalización que identifique el producto en la cadena, con farmacovigilancia activa.', TRUE, 'Correcto. Permite saber qué recibió cada paciente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Tras un cambio no médico a un biosimilar, aparecen reacciones en el sitio de inyección. ¿Qué análisis es correcto?';
    v_t4 := 'Ante una señal tras un cambio, se requiere identificar el producto (marca y lote), notificar al Invima, evaluar la causalidad (excipientes, dispositivo, técnica, efecto nocebo) y documentar, sin conclusiones apresuradas. La trazabilidad del art. 24 es clave.';
    v_j1 := $evbios_json${"external_id":"bios-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso integrador: señal de farmacovigilancia tras un cambio a biosimilar","outcome":"Caso integrador: señal de farmacovigilancia tras un cambio a biosimilar","source":"Decreto 1782 de 2014, art. 24."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u5-q3' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Se requiere trazabilidad por marca y lote, notificación al Invima y evaluación de causalidad.', TRUE, 'Correcto. Sin conclusiones apresuradas.', 0),
      (v_pregunta, 'Se concluye de inmediato que el biosimilar es inferior y se suspende su uso en todos los pacientes.', FALSE, 'Se requiere evaluación.', 1),
      (v_pregunta, 'Se ignora porque las reacciones en el sitio de inyección nunca son relevantes.', FALSE, 'Deben analizarse como posible señal.', 2),
      (v_pregunta, 'Se resuelve volviendo al referente sin notificar ni registrar nada.', FALSE, 'Se pierde información valiosa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un hospital registra en la historia clínica solo la denominación común del biológico, sin marca ni lote. ¿Cuál es la mejor valoración?';
    v_t4 := 'Varios biológicos pueden compartir denominación común. Registrar marca y lote es indispensable para atribuir eventos adversos y hacer farmacovigilancia; es un pilar de la trazabilidad que exige el art. 24.';
    v_j1 := $evbios_json${"external_id":"bios-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Nomenclatura, farmacovigilancia y trazabilidad","outcome":"Nomenclatura, farmacovigilancia y trazabilidad","source":"Decreto 1782 de 2014, art. 24; OMS, propuestas de calificador biológico."}$evbios_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bios-u5-q4' AND deleted_at IS NULL LIMIT 1;
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
      (v_pregunta, 'Es suficiente, porque la denominación común identifica el medicamento.', FALSE, 'No distingue entre productos.', 0),
      (v_pregunta, 'Es suficiente si el hospital usa un solo proveedor durante todo el año.', FALSE, 'El proveedor puede cambiar.', 1),
      (v_pregunta, 'Es insuficiente: sin marca y lote no se puede atribuir un evento al producto correcto.', TRUE, 'Correcto. Afecta la farmacovigilancia.', 2),
      (v_pregunta, 'Es insuficiente solo para los biosimilares, no para los innovadores.', FALSE, 'Aplica a todos los biológicos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad bios-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: qué es un biosimilar y por qué no es un genérico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: qué es un biosimilar y por qué no es un genérico) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · ¿Biosimilar o expediente completo?';
  v_t2 := $evbios_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y evaluar.</p>
<ol><li>Revisa los artículos 3, 7, 8 y 9 del Decreto 1782.</li><li>Decide para cada proyecto si puede presentarse como biosimilar.</li><li>Identifica la ruta y la evidencia faltante.</li><li>Analiza el caso del producto con secuencia distinta.</li><li>Resume los riesgos de cada decisión.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar las definiciones y rutas del Decreto 1782.</li><li>Decidir la ruta de cada proyecto.</li><li>Identificar la evidencia faltante.</li></ul>
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
  <tr><td>Decisiones</td><td>40 %</td><td>Decide bien los cuatro proyectos con fundamento.</td><td>Decide bien dos o tres.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Evidencia</td><td>30 %</td><td>Identifica la evidencia faltante (PK/PD, inmunogenicidad).</td><td>Evidencia imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Análisis</td><td>20 %</td><td>Explica por qué una secuencia distinta impide la biosimilitud.</td><td>Análisis general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbios_html$;
  v_t3 := $evbios_html$<h2>Caso de estudio</h2>
<p>BioSabana (ficticia) evalúa cuatro proyectos (datos simulados): (1) un filgrastim con ejercicio de comparabilidad completo frente a un referente aprobado por la EMA; (2) un anticuerpo nuevo sin referente; (3) una insulina con caracterización analítica comparativa pero sin estudios PK/PD; (4) un producto «mejorado» con distinta secuencia de aminoácidos que un referente.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evbios_html$;
  v_t4 := 'Tabla de decisiones con evidencia faltante.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evbios_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 3 a 9, 22 y 24); guía de inmunogenicidad del Ministerio de Salud; Resolución 3690 de 2016 (estabilidad de biológicos); OMS TRS 1043, anexo 3 (2022); guías de biosimilares de la EMA y de la FDA; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evbios_html$;
  v_t7 := NULL;
  v_j1 := $evbios_json$["Definiciones.","Ruta por proyecto.","Evidencia faltante.","Producto con secuencia distinta.","Riesgos."]$evbios_json$::jsonb;
  v_j2 := $evbios_json${"version":1,"total":100,"criteria":[{"id":"decisiones","name":"Decisiones","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Decide bien los cuatro proyectos con fundamento."},{"level":3,"label":"Logrado","description":"Decide bien dos o tres."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"evidencia","name":"Evidencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Identifica la evidencia faltante (PK/PD, inmunogenicidad)."},{"level":3,"label":"Logrado","description":"Evidencia imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"analisis","name":"Análisis","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Explica por qué una secuencia distinta impide la biosimilitud."},{"level":3,"label":"Logrado","description":"Análisis general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbios_json$::jsonb;
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


  -- ── Actividad bios-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. El ejercicio de comparabilidad paso a paso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. El ejercicio de comparabilidad paso a paso) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Plan de comparabilidad de un trastuzumab biosimilar';
  v_t2 := $evbios_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Justifica el referente según el artículo 8 del Decreto 1782.</li><li>Lista los atributos críticos de calidad y el método para fijar rangos de similitud.</li><li>Define los estudios no clínicos con el enfoque escalonado.</li><li>Define el estudio PK y la estrategia de inmunogenicidad.</li><li>Decide si propones un ensayo comparativo de eficacia y justifícalo.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar el plan analítico con atributos críticos.</li><li>Planear los estudios no clínicos y clínicos.</li><li>Justificar el referente y la estrategia de inmunogenicidad.</li></ul>
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
  <tr><td>Analítica</td><td>35 %</td><td>Atributos críticos completos (estructura, glicosilación, variantes, potencia, unión a HER2 y FcγR) y rangos con lotes del referente.</td><td>Analítica incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>No clínico y clínico</td><td>30 %</td><td>Enfoque escalonado, PK de equivalencia e inmunogenicidad escalonada.</td><td>Plan parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Referente y eficacia</td><td>25 %</td><td>Referente aceptado (art. 8) y decisión justificada sobre la eficacia.</td><td>Justificación débil.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbios_html$;
  v_t3 := $evbios_html$<h2>Caso de estudio</h2>
<p>OncoBio (ficticia) desarrolla un trastuzumab biosimilar para registrarlo en Colombia por la ruta de comparabilidad (datos simulados). Tiene 10 lotes del biosimilar y acceso a 15 lotes del referente comprados en Europa. Debe presentar a la gerencia el plan del ejercicio de comparabilidad.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evbios_html$;
  v_t4 := 'Plan del ejercicio de comparabilidad.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evbios_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 3 a 9, 22 y 24); guía de inmunogenicidad del Ministerio de Salud; Resolución 3690 de 2016 (estabilidad de biológicos); OMS TRS 1043, anexo 3 (2022); guías de biosimilares de la EMA y de la FDA; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evbios_html$;
  v_t7 := NULL;
  v_j1 := $evbios_json$["Referente.","Atributos críticos.","No clínico.","PK e inmunogenicidad.","Eficacia."]$evbios_json$::jsonb;
  v_j2 := $evbios_json${"version":1,"total":100,"criteria":[{"id":"analitica","name":"Analítica","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Atributos críticos completos (estructura, glicosilación, variantes, potencia, unión a HER2 y FcγR) y rangos con lotes del referente."},{"level":3,"label":"Logrado","description":"Analítica incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"no-clinico-y-clinico","name":"No clínico y clínico","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Enfoque escalonado, PK de equivalencia e inmunogenicidad escalonada."},{"level":3,"label":"Logrado","description":"Plan parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"referente-y-eficacia","name":"Referente y eficacia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Referente aceptado (art. 8) y decisión justificada sobre la eficacia."},{"level":3,"label":"Logrado","description":"Justificación débil."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbios_json$::jsonb;
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


  -- ── Actividad bios-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Referentes internacionales: OMS, EMA, FDA y Latinoamérica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Referentes internacionales: OMS, EMA, FDA y Latinoamérica) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Matriz regulatoria multipaís de un biosimilar';
  v_t2 := $evbios_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar, evaluar y crear.</p>
<ol><li>Construye una matriz con filas por país y columnas: referente aceptado, exigencia clínica, inmunogenicidad, extrapolación, intercambiabilidad y farmacovigilancia.</li><li>Completa la columna de Colombia con el Decreto 1782 (arts. 4, 8 y 24).</li><li>Completa los demás países con las fuentes oficiales que consultes y cítalas.</li><li>Identifica las brechas del paquete en cada país.</li><li>Propón el orden de presentación y la estrategia para cerrar las brechas.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Comparar los requisitos de varias autoridades.</li><li>Identificar brechas del paquete para cada país.</li><li>Proponer una estrategia de presentación.</li></ul>
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
  <tr><td>Matriz y fuentes</td><td>35 %</td><td>Matriz completa con fuentes oficiales citadas.</td><td>Matriz con vacíos o sin fuentes.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Colombia</td><td>30 %</td><td>Referente aceptado por el art. 8, extrapolación justificada (art. 4) y farmacovigilancia (art. 24).</td><td>Columna de Colombia incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Brechas y estrategia</td><td>25 %</td><td>Brechas concretas y estrategia realista.</td><td>Estrategia general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbios_html$;
  v_t3 := $evbios_html$<h2>Caso de estudio</h2>
<p>BioAndina (ficticia) tiene aprobado en Europa un biosimilar de pegfilgrastim y quiere registrarlo en Colombia y en otros dos países de la región (datos simulados). Su paquete incluye comparabilidad analítica frente al referente europeo, un estudio PK/PD en voluntarios sanos, datos de inmunogenicidad y un ensayo de eficacia en una sola indicación.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evbios_html$;
  v_t4 := 'Matriz regulatoria con brechas y estrategia.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evbios_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 3 a 9, 22 y 24); guía de inmunogenicidad del Ministerio de Salud; Resolución 3690 de 2016 (estabilidad de biológicos); OMS TRS 1043, anexo 3 (2022); guías de biosimilares de la EMA y de la FDA; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evbios_html$;
  v_t7 := NULL;
  v_j1 := $evbios_json$["Matriz.","Columna de Colombia.","Otros países con fuentes.","Brechas.","Estrategia."]$evbios_json$::jsonb;
  v_j2 := $evbios_json${"version":1,"total":100,"criteria":[{"id":"matriz-y-fuentes","name":"Matriz y fuentes","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Matriz completa con fuentes oficiales citadas."},{"level":3,"label":"Logrado","description":"Matriz con vacíos o sin fuentes."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"colombia","name":"Colombia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Referente aceptado por el art. 8, extrapolación justificada (art. 4) y farmacovigilancia (art. 24)."},{"level":3,"label":"Logrado","description":"Columna de Colombia incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"brechas-y-estrategia","name":"Brechas y estrategia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Brechas concretas y estrategia realista."},{"level":3,"label":"Logrado","description":"Estrategia general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbios_json$::jsonb;
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


  -- ── Actividad bios-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Marco colombiano: las rutas del Decreto 1782 de 2014' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Marco colombiano: las rutas del Decreto 1782 de 2014) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: biosimilitud, comparabilidad y ruta del adalimumab';
  v_t2 := $evbios_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos del producto (ficticios).</li><li>Fase 1: justifica el referente (arts. 3.2 y 8).</li><li>Fase 2: diseña el plan analítico, no clínico y clínico con la totalidad de la evidencia.</li><li>Fase 3: justifica la ruta de comparabilidad y describe la secuencia de evaluaciones.</li><li>Fase 3: lista la información común del art. 6 que acompaña la radicación.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Biosimilitud y referente.</li>
  <li><strong>Fase 2 · Unidad 2 (comparabilidad).</strong> Plan analítico, no clínico y clínico.</li>
  <li><strong>Fase 3 · Unidad 3 (marco colombiano).</strong> Ruta y radicación ante el Invima.</li>
  <li><strong>Fase 4 · Unidad 4 (referentes internacionales).</strong> Matriz multipaís.</li>
  <li><strong>Fase 5 · Unidad 5 (uso y vigilancia).</strong> Extrapolación, trazabilidad y farmacovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Justificar el referente y el plan de comparabilidad.</li><li>Definir la ruta y la radicación ante el Invima.</li></ul>
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
  <tr><td>Referente y ruta</td><td>25 %</td><td>Referente aceptado y ruta de comparabilidad bien fundamentada.</td><td>Fundamento parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan de comparabilidad</td><td>45 %</td><td>Atributos críticos, enfoque escalonado, PK e inmunogenicidad.</td><td>Plan incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Radicación</td><td>20 %</td><td>Secuencia de evaluaciones e información común del art. 6.</td><td>Radicación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbios_html$;
  v_t3 := $evbios_html$<h2>Caso de estudio</h2>
<p>BioLatam (ficticia) desarrolla un adalimumab biosimilar y quiere registrarlo en Colombia por la ruta de comparabilidad, con un referente aprobado por la EMA, y luego en dos países latinoamericanos (datos simulados). Te encargan la estrategia de comparabilidad, registro y vigilancia. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evbios_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evbios_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 3 a 9, 22 y 24); guía de inmunogenicidad del Ministerio de Salud; Resolución 3690 de 2016 (estabilidad de biológicos); OMS TRS 1043, anexo 3 (2022); guías de biosimilares de la EMA y de la FDA; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evbios_html$;
  v_t7 := NULL;
  v_j1 := $evbios_json$["Referente.","Plan analítico.","No clínico y clínico.","Ruta y secuencia.","Información común."]$evbios_json$::jsonb;
  v_j2 := $evbios_json${"version":1,"total":100,"criteria":[{"id":"referente-y-ruta","name":"Referente y ruta","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Referente aceptado y ruta de comparabilidad bien fundamentada."},{"level":3,"label":"Logrado","description":"Fundamento parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-de-comparabilidad","name":"Plan de comparabilidad","weight":45,"levels":[{"level":4,"label":"Destacado","description":"Atributos críticos, enfoque escalonado, PK e inmunogenicidad."},{"level":3,"label":"Logrado","description":"Plan incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"radicacion","name":"Radicación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Secuencia de evaluaciones e información común del art. 6."},{"level":3,"label":"Logrado","description":"Radicación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbios_json$::jsonb;
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


  -- ── Actividad bios-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Uso, vigilancia y acceso: extrapolación, intercambiabilidad y casos reales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Uso, vigilancia y acceso: extrapolación, intercambiabilidad y casos reales) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: matriz multipaís y plan de vigilancia del adalimumab';
  v_t2 := $evbios_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: construye la matriz multipaís (referente, clínica, inmunogenicidad, extrapolación, intercambiabilidad, farmacovigilancia).</li><li>Fase 5: justifica la extrapolación a las indicaciones del referente.</li><li>Fase 5: diseña la trazabilidad (marca y lote) y la farmacovigilancia activa (art. 24).</li><li>Fase 5: define cómo comunicarías la intercambiabilidad en Colombia.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube la estrategia en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Biosimilitud y referente.</li>
  <li><strong>Fase 2 · Unidad 2 (comparabilidad).</strong> Plan analítico, no clínico y clínico.</li>
  <li><strong>Fase 3 · Unidad 3 (marco colombiano).</strong> Ruta y radicación ante el Invima.</li>
  <li><strong>Fase 4 · Unidad 4 (referentes internacionales).</strong> Matriz multipaís.</li>
  <li><strong>Fase 5 · Unidad 5 (uso y vigilancia).</strong> Extrapolación, trazabilidad y farmacovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Planear el registro multipaís.</li><li>Diseñar la extrapolación y la vigilancia poscomercialización.</li></ul>
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
  <tr><td>Matriz multipaís</td><td>25 %</td><td>Matriz completa con diferencias relevantes.</td><td>Matriz parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Extrapolación</td><td>25 %</td><td>Justificación por indicación con mecanismo y población sensible.</td><td>Justificación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vigilancia y comunicación</td><td>25 %</td><td>Trazabilidad, farmacovigilancia activa y mensaje adecuado a Colombia.</td><td>Plan incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbios_html$;
  v_t3 := $evbios_html$<h2>Caso de estudio</h2>
<p>BioLatam (ficticia) desarrolla un adalimumab biosimilar y quiere registrarlo en Colombia por la ruta de comparabilidad, con un referente aprobado por la EMA, y luego en dos países latinoamericanos (datos simulados). Te encargan la estrategia de comparabilidad, registro y vigilancia. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en la estrategia que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evbios_html$;
  v_t4 := 'Estrategia de registro y vigilancia con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evbios_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 3 a 9, 22 y 24); guía de inmunogenicidad del Ministerio de Salud; Resolución 3690 de 2016 (estabilidad de biológicos); OMS TRS 1043, anexo 3 (2022); guías de biosimilares de la EMA y de la FDA; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evbios_html$;
  v_t7 := NULL;
  v_j1 := $evbios_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Matriz multipaís.","Extrapolación.","Trazabilidad y farmacovigilancia.","Comunicación y resumen."]$evbios_json$::jsonb;
  v_j2 := $evbios_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"matriz-multipais","name":"Matriz multipaís","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Matriz completa con diferencias relevantes."},{"level":3,"label":"Logrado","description":"Matriz parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"extrapolacion","name":"Extrapolación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Justificación por indicación con mecanismo y población sensible."},{"level":3,"label":"Logrado","description":"Justificación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vigilancia-y-comunicacion","name":"Vigilancia y comunicación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Trazabilidad, farmacovigilancia activa y mensaje adecuado a Colombia."},{"level":3,"label":"Logrado","description":"Plan incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbios_json$::jsonb;
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


  -- ── Foro bios-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con biosimilares';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evbios_html$<h2>Para empezar</h2>
<p>Piensa en un biosimilar que hayas dispensado, evaluado o estudiado y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evbios_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evbios_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evbios_html$;
  v_t6 := $evbios_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evbios_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has participado en un cambio de referente a biosimilar?', '¿Qué te genera más dudas: la comparabilidad, la norma o la intercambiabilidad?']::text[];
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


  -- ── Foro bios-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: qué es un biosimilar y por qué no es un genérico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: qué es un biosimilar y por qué no es un genérico) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Biosimilar es igual a genérico?';
  v_t2 := 'Argumentar las diferencias entre biosimilares y genéricos ante profesionales de la salud.';
  v_t3 := $evbios_html$<h2>Caso del foro</h2>
<p>En un comité de farmacia ficticio, un médico propone tratar los biosimilares «como cualquier genérico» y cambiarlos sin más análisis (datos simulados). Otro médico dice que «los biosimilares son copias de mala calidad».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbios_html$;
  v_t4 := '¿Qué responderías a ambas posiciones?';
  v_t5 := $evbios_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbios_html$;
  v_t6 := $evbios_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbios_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué demuestra el ejercicio de comparabilidad?', '¿Qué diferencias permite y cuáles no?', '¿Qué controles se necesitan al cambiar de producto?']::text[];
  v_j1 := $evbios_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbios_json$::jsonb;
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


  -- ── Foro bios-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. El ejercicio de comparabilidad paso a paso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. El ejercicio de comparabilidad paso a paso) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · ¿Hace falta el ensayo comparativo de eficacia?';
  v_t2 := 'Argumentar cuándo un ensayo comparativo de eficacia aporta información a la biosimilitud.';
  v_t3 := $evbios_html$<h2>Caso del foro</h2>
<p>Un desarrollador ficticio tiene una caracterización analítica muy robusta y un estudio PK/PD equivalente para un biosimilar (datos simulados). Propone no hacer el ensayo comparativo de eficacia, que costaría años y millones.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbios_html$;
  v_t4 := '¿Apoyarías la propuesta? ¿Qué condiciones exigirías?';
  v_t5 := $evbios_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o la norma que sustenta tu posición. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbios_html$;
  v_t6 := $evbios_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta tu posición.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbios_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dice la OMS 2022 sobre la flexibilidad en la eficacia?', '¿Qué incertidumbre residual podría quedar?', '¿Cómo evaluaría la Sala del Invima la propuesta?']::text[];
  v_j1 := $evbios_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta tu posición."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbios_json$::jsonb;
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


  -- ── Foro bios-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Marco colombiano: las rutas del Decreto 1782 de 2014' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Marco colombiano: las rutas del Decreto 1782 de 2014) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · El debate sobre la ruta abreviada';
  v_t2 := 'Argumentar con evidencia las posiciones sobre la ruta abreviada.';
  v_t3 := $evbios_html$<h2>Caso del foro</h2>
<p>En un panel ficticio, un representante de la industria innovadora dice que la ruta abreviada «pone en riesgo a los pacientes» y uno del Ministerio responde que «garantiza competencia y acceso» (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbios_html$;
  v_t4 := '¿Qué argumentos técnicos sostienen o debilitan cada posición?';
  v_t5 := $evbios_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la evidencia que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbios_html$;
  v_t6 := $evbios_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la evidencia que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbios_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué condiciones del art. 9 mitigan el riesgo?', '¿Qué papel tiene la Sala en esa ruta?', '¿Qué evidencia de farmacovigilancia sería útil para el debate?']::text[];
  v_j1 := $evbios_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la evidencia que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbios_json$::jsonb;
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


  -- ── Foro bios-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Referentes internacionales: OMS, EMA, FDA y Latinoamérica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Referentes internacionales: OMS, EMA, FDA y Latinoamérica) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Intercambiabilidad: tres mundos';
  v_t2 := 'Argumentar cómo las diferencias entre EMA, FDA y Colombia afectan la práctica.';
  v_t3 := $evbios_html$<h2>Caso del foro</h2>
<p>Una multinacional ficticia quiere usar el mismo material educativo sobre su biosimilar en Europa, Estados Unidos y Colombia (datos simulados). El texto dice «intercambiable con el producto de referencia».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbios_html$;
  v_t4 := '¿Es adecuado el mensaje en los tres mercados?';
  v_t5 := $evbios_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la posición que sustenta cada respuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbios_html$;
  v_t6 := $evbios_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la posición que sustenta cada respuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbios_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué significa intercambiable para la FDA?', '¿Cuál es la posición de la EMA?', '¿Qué regula Colombia al respecto?']::text[];
  v_j1 := $evbios_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la posición que sustenta cada respuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbios_json$::jsonb;
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


  -- ── Foro bios-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Uso, vigilancia y acceso: extrapolación, intercambiabilidad y casos reales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Uso, vigilancia y acceso: extrapolación, intercambiabilidad y casos reales) en Regulación de Medicamentos Biosimilares: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Cambiar a biosimilar en la institución';
  v_t2 := 'Argumentar cómo implementar un cambio a biosimilar de forma segura.';
  v_t3 := $evbios_html$<h2>Caso del foro</h2>
<p>Un hospital ficticio decide cambiar a todos sus pacientes con adalimumab al biosimilar ganador de una licitación (datos simulados). Algunos médicos se oponen y los pacientes tienen dudas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbios_html$;
  v_t4 := '¿Cómo diseñarías el cambio para que sea seguro y aceptado?';
  v_t5 := $evbios_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada medida. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbios_html$;
  v_t6 := $evbios_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada medida.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbios_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué información darías a médicos y pacientes?', '¿Qué datos registrarías?', '¿Cómo vigilarías los eventos tras el cambio?']::text[];
  v_j1 := $evbios_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada medida."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbios_json$::jsonb;
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


  RAISE NOTICE 'Regulación de Medicamentos Biosimilares: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evbios$;

-- ============================================================
--  098_quices_actividades_foros_regulatorios2.sql — quizzes, actividades y foros, lote «regulatorios2»
--
--  Generado por scripts/evaluacion-aula.mjs regulatorios2 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Renovación de Registros Sanitarios; Modificaciones al Registro Sanitario.
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
--  Curso de Renovación de Registros Sanitarios de Medicamentos
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evrenov$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Renovación de Registros Sanitarios de Medicamentos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Renovación de Registros Sanitarios de Medicamentos: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Vigencia del registro sanitario: de la renovación quinquenal a la vigencia indefinida', 'Unidad 2. Requisitos de renovación y transición por tipo de producto', 'Unidad 3. Actualización de la información técnica: estabilidad, BPM, insertos y CPP', 'Unidad 4. Pérdida de vigencia, no comercialización, retiro y agotamiento de existencias', 'Unidad 5. Planificación del portafolio, semaforización y tarifas INVIMA']::text[])) < 5 THEN
    RAISE NOTICE 'Renovación de Registros Sanitarios: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evrenov_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evrenov_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz renov-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Vigencia del registro sanitario: de la renovación quinquenal a la vigencia indefinida' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Vigencia del registro sanitario: de la renovación quinquenal a la vigencia indefinida) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Vigencia del registro sanitario: de la renovación quinquenal a la vigencia indefinida';
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


    v_t3 := '¿Qué estableció el Decreto 1474 de 2023 sobre la vigencia de los registros sanitarios de medicamentos?';
    v_t4 := 'El artículo 5 del Decreto 1474 de 2023 (vigente desde el 8 de septiembre de 2023) estableció que la vigencia de los registros sanitarios de medicamentos es indefinida; los que estaban vigentes pasaron a duración indefinida siempre que mantengan las condiciones aprobadas.';
    v_j1 := $evrenov_json${"external_id":"renov-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Decreto 1474 de 2023: vigencia indefinida y sus límites","outcome":"Decreto 1474 de 2023: vigencia indefinida y sus límites","source":"Decreto 1474 de 2023, art. 5."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que todos los registros vencen a los cinco años y se renuevan de forma automática sin requisitos.', FALSE, 'Esa no es la regla del Decreto 1474.', 0),
      (v_pregunta, 'Que los registros vigentes perdieron su validez y debían tramitarse de nuevo ante el Invima.', FALSE, 'Los vigentes pasaron a vigencia indefinida.', 1),
      (v_pregunta, 'Que su vigencia es indefinida, y los vigentes a esa fecha la adquirieron si mantienen las condiciones aprobadas.', TRUE, 'Correcto. Rige desde el 8 de septiembre de 2023.', 2),
      (v_pregunta, 'Que la vigencia pasa a diez años para todos los productos, incluidos los fitoterapéuticos.', FALSE, 'Los diez años corresponden a los fitoterapéuticos por su norma propia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una empresa tiene un producto fitoterapéutico con registro concedido en 2017. ¿Qué régimen de vigencia le aplica?';
    v_t4 := 'Los productos fitoterapéuticos tienen su propia norma: el artículo 14 del Decreto 1156 de 2018 fija una vigencia de diez años, renovables por periodos iguales. El Decreto 1474 de 2023 se refiere a los registros de medicamentos.';
    v_j1 := $evrenov_json${"external_id":"renov-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Medicamentos con vigencia indefinida vs. fitoterapéuticos con vigencia de diez años","outcome":"Medicamentos con vigencia indefinida vs. fitoterapéuticos con vigencia de diez años","source":"Decreto 1156 de 2018, art. 14; Decreto 1474 de 2023, art. 5."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Vigencia de diez años, renovable por periodos iguales, según su norma propia.', TRUE, 'Correcto. Su renovación sigue el Decreto 1156 de 2018.', 0),
      (v_pregunta, 'Vigencia indefinida, porque el Decreto 1474 de 2023 se aplica a todos los productos del Invima.', FALSE, 'El Decreto 1474 se refiere a los medicamentos.', 1),
      (v_pregunta, 'Vigencia de cinco años, renovable una sola vez y luego indefinida de forma automática.', FALSE, 'No es el régimen de los fitoterapéuticos.', 2),
      (v_pregunta, 'Vigencia de un año, porque los fitoterapéuticos se consideran productos de riesgo alto.', FALSE, 'Su vigencia es de diez años.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Bajo el régimen de renovación automática del Decreto 334 de 2022, un titular radicó la solicitud tres semanas antes del vencimiento. ¿Qué análisis es correcto?';
    v_t4 := 'El artículo 4 del Decreto 334 de 2022 exigía radicar la renovación automática con una antelación no menor a un mes al vencimiento; el Invima expedía el acto a más tardar el día del vencimiento. Fuera de ese término el trámite no procedía y debía iniciarse un nuevo registro. El artículo 9 previó un control posterior en máximo ocho meses.';
    v_j1 := $evrenov_json${"external_id":"renov-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Decreto 334 de 2022: renovación automática y control posterior en 8 meses","outcome":"Decreto 334 de 2022: renovación automática y control posterior en 8 meses","source":"Decreto 334 de 2022, arts. 4 y 9."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La renovación procede porque se radicó antes del día del vencimiento del registro.', FALSE, 'El plazo exigía más antelación.', 0),
      (v_pregunta, 'La renovación procede, pero con una multa por radicación tardía según la tarifa vigente.', FALSE, 'La norma no prevé una multa: el trámite no procede.', 1),
      (v_pregunta, 'El Invima debía conceder la renovación y revisar la radicación tardía en el control posterior.', FALSE, 'El control posterior no subsana la radicación tardía.', 2),
      (v_pregunta, 'No procedía: debía radicarse con no menos de un mes de antelación; fuera de término correspondía un nuevo registro.', TRUE, 'Correcto. Es el artículo 4 del Decreto 334.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un gerente afirma que «con la vigencia indefinida, el Invima ya no puede revisar nuestros registros». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 5 del Decreto 1474 de 2023 aclara que la vigencia indefinida no impide al Invima adoptar las medidas necesarias ante un incumplimiento de las normas técnicas o un riesgo sanitario asociado a la farmacovigilancia. Los registros deben mantener las condiciones aprobadas.';
    v_j1 := $evrenov_json${"external_id":"renov-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Decreto 1474 de 2023: vigencia indefinida y sus límites","outcome":"Decreto 1474 de 2023: vigencia indefinida y sus límites","source":"Decreto 1474 de 2023, art. 5."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: un registro indefinido no puede ser revisado ni modificado por la autoridad.', FALSE, 'El Invima conserva sus facultades.', 0),
      (v_pregunta, 'Es errada: el Invima puede adoptar medidas ante incumplimientos o riesgos de farmacovigilancia.', TRUE, 'Correcto. La vigencia indefinida exige mantener las condiciones aprobadas.', 1),
      (v_pregunta, 'Es correcta si el titular no ha recibido ninguna visita de inspección en los últimos cinco años.', FALSE, 'La ausencia de visitas no limita las facultades.', 2),
      (v_pregunta, 'Es errada solo porque los registros indefinidos deben renovarse de todas formas cada diez años.', FALSE, 'Los medicamentos ya no se renuevan cada diez años.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz renov-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Requisitos de renovación y transición por tipo de producto' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Requisitos de renovación y transición por tipo de producto) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Requisitos de renovación y transición por tipo de producto';
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


    v_t3 := '¿Qué requisitos exigía el artículo 3 del Decreto 334 de 2022 para la renovación?';
    v_t4 := 'El artículo 3 del Decreto 334 de 2022 exigía para la renovación el formato de solicitud del Invima, el certificado de Buenas Prácticas de Manufactura vigente y el Certificado de Venta Libre o el Certificado de Producto Farmacéutico vigente, según la norma especial de cada tipo de medicamento.';
    v_j1 := $evrenov_json${"external_id":"renov-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Síntesis química y gases medicinales: requisitos de la renovación automática","outcome":"Síntesis química y gases medicinales: requisitos de la renovación automática","source":"Decreto 334 de 2022, art. 3."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un expediente completo nuevo con estudios clínicos actualizados del principio activo.', FALSE, 'La renovación automática no exigía un expediente nuevo.', 0),
      (v_pregunta, 'El formato del Invima, el certificado de BPM vigente y el CVL o el CPP vigente.', TRUE, 'Correcto. Según la norma especial de cada tipo de medicamento.', 1),
      (v_pregunta, 'Solo el pago de la tarifa, sin ningún documento adicional del fabricante.', FALSE, 'Se exigían documentos además del pago.', 2),
      (v_pregunta, 'Una visita de inspección previa del Invima a la planta del fabricante.', FALSE, 'No era un requisito de la solicitud.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Al preparar la renovación de un registro bajo el Decreto 334 de 2022, el equipo quiere incluir en la misma solicitud un cambio de fabricante. ¿Qué indicaba la norma?';
    v_t4 := 'El parágrafo 2 del artículo 3 del Decreto 334 de 2022 dispuso que el interesado no podía incluir modificaciones al registro en la solicitud de renovación; debían pedirse por escrito separado y regirse por el capítulo de modificaciones. La renovación podía radicarse aunque hubiera modificaciones en curso.';
    v_j1 := $evrenov_json${"external_id":"renov-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Síntesis química y gases medicinales: requisitos de la renovación automática","outcome":"Síntesis química y gases medicinales: requisitos de la renovación automática","source":"Decreto 334 de 2022, art. 3, par. 2."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que podían incluirse todas las modificaciones en la renovación para ahorrar tarifas y tiempo.', FALSE, 'La norma lo impedía expresamente.', 0),
      (v_pregunta, 'Que el cambio de fabricante se aprobaba de forma automática con la renovación.', FALSE, 'Las modificaciones seguían su propio trámite.', 1),
      (v_pregunta, 'Que primero debía aprobarse el cambio y solo después podía radicarse la renovación.', FALSE, 'La renovación podía radicarse con modificaciones en curso.', 2),
      (v_pregunta, 'Que las modificaciones no se incluían en la renovación: se pedían por escrito separado.', TRUE, 'Correcto. Es el parágrafo 2 del artículo 3.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un fitoterapéutico importado va a renovarse, pero su Certificado de Venta Libre está vencido. ¿Qué análisis es correcto según el Decreto 1156 de 2018?';
    v_t4 := 'El artículo 27 del Decreto 1156 de 2018 establece la renovación automática de los fitoterapéuticos que mantengan la información aprobada, aporten estabilidad de dos lotes industriales, tengan BPM vigente y, si son importados, aporten el CVL vigente. Si no cumplen, el artículo 29 remite a la ruta no automática (requisitos de los artículos 15 a 19).';
    v_j1 := $evrenov_json${"external_id":"renov-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Fitoterapéuticos: renovación automática y no automática (Decreto 1156 de 2018)","outcome":"Fitoterapéuticos: renovación automática y no automática (Decreto 1156 de 2018)","source":"Decreto 1156 de 2018, arts. 27 y 29."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No cumple una condición de la renovación automática: debe aportar el CVL vigente o seguir la ruta no automática.', TRUE, 'Correcto. El CVL vigente es condición para importados.', 0),
      (v_pregunta, 'El CVL no es necesario para fitoterapéuticos, porque solo se exige a los medicamentos de síntesis química.', FALSE, 'El artículo 27 lo exige a los importados.', 1),
      (v_pregunta, 'Puede renovarse de forma automática y presentar el CVL dentro de los dos años siguientes.', FALSE, 'La norma no prevé ese plazo.', 2),
      (v_pregunta, 'El vencimiento del CVL cancela de inmediato el registro sanitario del producto.', FALSE, 'No cancela el registro, pero afecta la renovación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una empresa cambió la concentración de un extracto en su fitoterapéutico sin trámite y quiere usar la renovación automática. ¿Cuál es la mejor valoración?';
    v_t4 := 'La primera condición del artículo 27 del Decreto 1156 de 2018 es mantener la información y las características aprobadas durante la vigencia del registro. Un cambio no autorizado impide la renovación automática; el artículo 29 remite a la ruta no automática, y el cambio debió tramitarse.';
    v_j1 := $evrenov_json${"external_id":"renov-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Fitoterapéuticos: renovación automática y no automática (Decreto 1156 de 2018)","outcome":"Fitoterapéuticos: renovación automática y no automática (Decreto 1156 de 2018)","source":"Decreto 1156 de 2018, arts. 27 y 29."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es viable, porque la renovación automática no revisa la información técnica del producto.', FALSE, 'Mantener la información aprobada es condición.', 0),
      (v_pregunta, 'Es viable si paga una tarifa adicional por el cambio en la misma solicitud de renovación.', FALSE, 'Un pago no subsana el cambio no autorizado.', 1),
      (v_pregunta, 'No es viable: no mantiene la información aprobada, condición de la renovación automática; aplicaría la ruta no automática.', TRUE, 'Correcto. Además, el cambio debía tramitarse.', 2),
      (v_pregunta, 'No es viable solo porque los fitoterapéuticos no tienen renovación automática en Colombia.', FALSE, 'Sí la tienen, con condiciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz renov-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Actualización de la información técnica: estabilidad, BPM, insertos y CPP' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Actualización de la información técnica: estabilidad, BPM, insertos y CPP) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Actualización de la información técnica: estabilidad, BPM, insertos y CPP';
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


    v_t3 := 'Con la vigencia indefinida, ¿cómo se mantiene actualizada la información técnica de un registro de medicamento?';
    v_t4 := 'Sin renovación periódica, la actualización de estabilidad, BPM, insertos y certificados de importación se hace mediante modificaciones al registro, y el Invima conserva la revisión y el control posterior. El Decreto 1474 de 2023 prevé que las modificaciones automáticas sean objeto de ese control.';
    v_j1 := $evrenov_json${"external_id":"renov-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: el registro indefinido exige actualización continua","outcome":"Introducción a la unidad: el registro indefinido exige actualización continua","source":"Decreto 1474 de 2023; Decreto 334 de 2022."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Con una renovación quinquenal obligatoria en la que se actualiza toda la información a la vez.', FALSE, 'Ya no hay renovación quinquenal para los medicamentos.', 0),
      (v_pregunta, 'No se actualiza, porque la información aprobada queda fija para siempre en el registro.', FALSE, 'La información debe mantenerse vigente.', 1),
      (v_pregunta, 'Con una visita anual del Invima en la que se reescribe el registro completo.', FALSE, 'No es el mecanismo de actualización.', 2),
      (v_pregunta, 'Mediante modificaciones al registro, sujetas a la revisión y el control posterior del Invima.', TRUE, 'Correcto. Estabilidad, BPM, insertos y certificados se actualizan así.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'El CPP que respalda un medicamento importado vence en tres meses. ¿Qué hace el responsable regulatorio?';
    v_t4 := 'El Certificado de Producto Farmacéutico (modelo OMS) lo emite la autoridad sanitaria del país de origen y certifica la situación del producto y del fabricante. Mantenerlo vigente respalda los registros de importación; se coordina con el fabricante con anticipación.';
    v_j1 := $evrenov_json${"external_id":"renov-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Importados: CPP o CVL y BPM del fabricante extranjero","outcome":"Importados: CPP o CVL y BPM del fabricante extranjero","source":"Esquema de certificación de la OMS; Decreto 334 de 2022, art. 3."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Nada, porque con el registro indefinido el CPP deja de tener importancia.', FALSE, 'El CPP respalda las condiciones del registro del importado.', 0),
      (v_pregunta, 'Solicita al Invima que emita un CPP colombiano para reemplazar el del país de origen.', FALSE, 'El CPP lo emite la autoridad del país de origen.', 1),
      (v_pregunta, 'Coordina con el fabricante que la autoridad de origen emita un CPP nuevo antes del vencimiento.', TRUE, 'Correcto. Y lo incorpora al expediente.', 2),
      (v_pregunta, 'Suspende la importación del producto hasta que el registro sanitario venza de forma natural y deba tramitarse otro.', FALSE, 'No hay vencimiento del registro; se actualiza el certificado.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una empresa quiere cambiar el fabricante de un medicamento con registro indefinido. ¿Qué análisis es correcto?';
    v_t4 := 'El fabricante forma parte de las condiciones aprobadas del registro. Cambiarlo requiere una modificación con sus soportes (BPM del nuevo fabricante, documentación técnica), clasificada según el riesgo; la vigencia indefinida no exime de mantener las condiciones aprobadas.';
    v_j1 := $evrenov_json${"external_id":"renov-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Cambios de calidad: estabilidad y vida útil, fabricante y BPM","outcome":"Cambios de calidad: estabilidad y vida útil, fabricante y BPM","source":"Decreto 334 de 2022; Decreto 1474 de 2023, art. 5."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Basta con informar al Invima por correo el nombre del nuevo fabricante el mismo día del cambio.', FALSE, 'Un cambio de fabricante requiere un trámite con soportes.', 0),
      (v_pregunta, 'Es un cambio que requiere el trámite de modificación con sus soportes antes de comercializar.', TRUE, 'Correcto. Se clasifica según el riesgo y se soporta.', 1),
      (v_pregunta, 'No requiere ningún trámite, porque el registro indefinido permite cualquier cambio del titular.', FALSE, 'La vigencia indefinida exige mantener las condiciones aprobadas.', 2),
      (v_pregunta, 'Requiere un registro sanitario completamente nuevo y la cancelación del registro actual.', FALSE, 'Se tramita como modificación, no como registro nuevo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un consultor recomienda aplicar desde hoy las rutas de modificación de un proyecto de decreto que el Ministerio publicó para comentarios en 2026. ¿Cuál es la mejor valoración?';
    v_t4 := 'Un proyecto de decreto publicado para comentarios no es norma vigente: puede cambiar o no expedirse. Se aplica la regulación actual y se sigue la evolución del proyecto para preparar al equipo, citándolo siempre como proyecto.';
    v_j1 := $evrenov_json${"external_id":"renov-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Proyecto de decreto 2026: nuevas rutas de modificación (IA, IA-IN, IB, II, URG)","outcome":"Proyecto de decreto 2026: nuevas rutas de modificación (IA, IA-IN, IB, II, URG)","source":"Principio de vigencia de las normas; normograma del Invima."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una mala recomendación: un proyecto en consulta no es norma vigente; se sigue la regulación actual.', TRUE, 'Correcto. Conviene seguir su evolución para prepararse.', 0),
      (v_pregunta, 'Es una buena recomendación, porque los proyectos en consulta tienen fuerza de ley desde que se publican.', FALSE, 'Un proyecto no tiene fuerza obligatoria.', 1),
      (v_pregunta, 'Es una buena recomendación si el Invima no ha publicado ninguna objeción al proyecto.', FALSE, 'El silencio no convierte el proyecto en norma.', 2),
      (v_pregunta, 'Es una mala recomendación solo porque los proyectos de decreto nunca llegan a expedirse.', FALSE, 'Muchos se expiden; el problema es que aún no rige.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz renov-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Pérdida de vigencia, no comercialización, retiro y agotamiento de existencias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Pérdida de vigencia, no comercialización, retiro y agotamiento de existencias) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Pérdida de vigencia, no comercialización, retiro y agotamiento de existencias';
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


    v_t3 := 'Según el artículo 23 del Decreto 334 de 2022, ¿qué ocurría si un registro vencía sin solicitud de renovación presentada a tiempo?';
    v_t4 := 'El artículo 23 del Decreto 334 de 2022 dispuso que, si el registro vencía sin solicitud de renovación (o esta se abandonaba, desistía o no se presentaba en término), el producto no podía fabricarse ni importarse; las existencias en el país podían agotarse hasta su vida útil y el material de envase y empaque no podía usarse.';
    v_j1 := $evrenov_json${"external_id":"renov-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Vencimiento sin renovación y radicación extemporánea","outcome":"Vencimiento sin renovación y radicación extemporánea","source":"Decreto 334 de 2022, art. 23."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El producto no podía fabricarse ni importarse, aunque se podían agotar las existencias en su vida útil.', TRUE, 'Correcto. El material de empaque no podía usarse.', 0),
      (v_pregunta, 'El producto podía seguir fabricándose un año más mientras se tramitaba un registro nuevo.', FALSE, 'La norma no permitía seguir fabricando.', 1),
      (v_pregunta, 'El registro se renovaba de oficio por el Invima sin necesidad de ninguna solicitud.', FALSE, 'La renovación requería solicitud oportuna.', 2),
      (v_pregunta, 'Las existencias debían destruirse de inmediato, sin posibilidad de comercializarlas.', FALSE, 'Podían agotarse dentro de la vida útil.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Tras el vencimiento sin renovación de un registro, la bodega tiene 20.000 cajas impresas sin usar con ese número de registro. ¿Qué se hace con ellas?';
    v_t4 := 'Según el artículo 23 del Decreto 334 de 2022 (y el artículo 39 del Decreto 1156 de 2018 para fitoterapéuticos), tras el vencimiento sin renovación el material de envase y empaque no puede utilizarse y debe disponerse de forma final; solo pueden agotarse las existencias de producto terminado dentro de su vida útil.';
    v_j1 := $evrenov_json${"external_id":"renov-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Agotamiento de existencias","outcome":"Agotamiento de existencias","source":"Decreto 334 de 2022, art. 23."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se usan para envasar producto nuevo mientras se tramita el nuevo registro sanitario.', FALSE, 'No se puede fabricar ni usar ese empaque.', 0),
      (v_pregunta, 'No se pueden usar y se les da disposición final.', TRUE, 'Correcto. Solo se agotan las existencias de producto terminado.', 1),
      (v_pregunta, 'Se reetiquetan con un número de registro de otro producto de la misma empresa.', FALSE, 'Eso sería un uso indebido de registro.', 2),
      (v_pregunta, 'Se venden a otra empresa que tenga un producto parecido con registro vigente.', FALSE, 'No es una disposición permitida.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular decide no volver a comercializar un medicamento con registro indefinido. ¿Qué análisis es correcto?';
    v_t4 := 'La pérdida de ejecutoriedad de los actos administrativos está prevista en el artículo 91 de la Ley 1437 de 2011. El Decreto 1474 de 2023 (art. 4, par. 2) prevé que, en el retiro voluntario del mercado, si pasados seis meses no se reanuda la comercialización ni se pide la pérdida de fuerza ejecutoria, el Invima cancela el registro.';
    v_j1 := $evrenov_json${"external_id":"renov-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Pérdida de fuerza ejecutoria, archivo y cancelación","outcome":"Pérdida de fuerza ejecutoria, archivo y cancelación","source":"Ley 1437 de 2011, art. 91; Decreto 1474 de 2023, art. 4, par. 2."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Puede dejar el registro activo para siempre sin informar al Invima, porque es indefinido.', FALSE, 'El retiro debe gestionarse ante el Invima.', 0),
      (v_pregunta, 'Debe vender el registro a otra empresa, porque los registros no pueden quedar sin uso.', FALSE, 'No es una obligación de la norma.', 1),
      (v_pregunta, 'Debe gestionar el retiro: puede pedir la pérdida de fuerza ejecutoria; si no reanuda ni la pide, el Invima puede cancelar el registro.', TRUE, 'Correcto. Decreto 1474 y Ley 1437, art. 91.', 2),
      (v_pregunta, 'El registro se convierte de inmediato en uno de otro titular asignado por el Invima.', FALSE, 'No existe esa figura.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'El registro de un fitoterapéutico venció hace dos meses sin solicitud de renovación. La empresa quiere seguir importándolo «mientras sale el nuevo registro». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 39 del Decreto 1156 de 2018 establece que, si el registro de un fitoterapéutico vence sin solicitud de renovación, el producto no puede importarse ni fabricarse; las existencias en el mercado pueden agotarse dentro de su vida útil, salvo que la calidad esté afectada o haya riesgo para la salud pública.';
    v_j1 := $evrenov_json${"external_id":"renov-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: renovación extemporánea","outcome":"Caso: renovación extemporánea","source":"Decreto 1156 de 2018, art. 39."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es posible, porque la importación se permite durante el trámite de cualquier registro nuevo.', FALSE, 'La norma lo prohíbe tras el vencimiento.', 0),
      (v_pregunta, 'Es posible si paga una tarifa extemporánea al Invima por cada lote que importe.', FALSE, 'No existe esa opción.', 1),
      (v_pregunta, 'Es posible si el producto es de bajo riesgo y no ha tenido reportes de farmacovigilancia.', FALSE, 'El riesgo bajo no habilita la importación.', 2),
      (v_pregunta, 'No es posible: sin renovación el producto no puede importarse; solo se agotan las existencias en vida útil.', TRUE, 'Correcto. Es el artículo 39 del Decreto 1156.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz renov-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Planificación del portafolio, semaforización y tarifas INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Planificación del portafolio, semaforización y tarifas INVIMA) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Planificación del portafolio, semaforización y tarifas INVIMA';
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


    v_t3 := 'Con la vigencia indefinida, ¿qué debe incluir el inventario regulatorio de un portafolio de medicamentos?';
    v_t4 := 'Con la vigencia indefinida de los medicamentos, el inventario regulatorio debe mostrar qué registros conservan vencimiento (fitoterapéuticos), los fabricantes, los certificados de BPM, CVL o CPP, la vida útil, los insertos y los trámites en curso: las obligaciones que mantienen las condiciones aprobadas.';
    v_j1 := $evrenov_json${"external_id":"renov-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Inventario regulatorio del portafolio","outcome":"Inventario regulatorio del portafolio","source":"Decreto 1474 de 2023; Decreto 1156 de 2018."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo la fecha de vencimiento de cada registro, que sigue siendo el único dato crítico.', FALSE, 'La fecha de vencimiento ya no es el único dato crítico.', 0),
      (v_pregunta, 'Solo el nombre comercial y el precio de venta de cada producto del portafolio.', FALSE, 'Faltan los datos regulatorios.', 1),
      (v_pregunta, 'Vigencias de fitoterapéuticos, fabricantes, BPM, CVL o CPP, vida útil, insertos y trámites en curso.', TRUE, 'Correcto. Son las obligaciones que mantienen vivo el registro.', 2),
      (v_pregunta, 'Solo los registros de productos importados, porque los nacionales no tienen obligaciones.', FALSE, 'Los nacionales también tienen obligaciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'El registro de un fitoterapéutico vence en nueve meses y solo hay estabilidad de un lote industrial. ¿Cuándo se inicia la preparación de la renovación?';
    v_t4 := 'La renovación automática de un fitoterapéutico exige estabilidad de dos lotes industriales, BPM vigente y CVL si es importado (Decreto 1156, art. 27). Con nueve meses y un solo lote de estabilidad, la preparación debe empezar de inmediato; un semáforo de vencimientos anticipa estas alertas.';
    v_j1 := $evrenov_json${"external_id":"renov-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Semaforización de vencimientos y obligaciones","outcome":"Semaforización de vencimientos y obligaciones","source":"Decreto 1156 de 2018, art. 27."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un mes antes del vencimiento, porque es el plazo mínimo que fijaba el Decreto 334 de 2022.', FALSE, 'Ese plazo era de la renovación de medicamentos y no da tiempo para la estabilidad.', 0),
      (v_pregunta, 'Después del vencimiento, porque así se evita pagar dos veces la tarifa del trámite.', FALSE, 'Tras el vencimiento ya no se puede renovar.', 1),
      (v_pregunta, 'Cuando el Invima envíe un aviso, porque la entidad notifica todos los vencimientos.', FALSE, 'La responsabilidad es del titular.', 2),
      (v_pregunta, 'Ya: hay que completar la estabilidad del segundo lote y verificar BPM y CVL con margen.', TRUE, 'Correcto. El semáforo está en amarillo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Al presupuestar los trámites del año ante el Invima, ¿qué análisis es correcto sobre las tarifas?';
    v_t4 := 'El Invima fija tarifas por trámite en una resolución que se actualiza periódicamente; el pago es previo a la radicación. El presupuesto anual se arma con la resolución vigente y los códigos de cada trámite previsto en el plan del portafolio.';
    v_j1 := $evrenov_json${"external_id":"renov-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Tarifas INVIMA: cómo leer la resolución tarifaria","outcome":"Tarifas INVIMA: cómo leer la resolución tarifaria","source":"Resoluciones tarifarias del Invima."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se consulta la resolución de tarifas vigente del Invima, que se actualiza, y se presupuesta cada trámite con su código.', TRUE, 'Correcto. La tarifa se paga antes de radicar.', 0),
      (v_pregunta, 'Las tarifas del Invima son las mismas desde hace veinte años y no hace falta consultarlas.', FALSE, 'Las tarifas se actualizan.', 1),
      (v_pregunta, 'Las tarifas se pagan solo después de que el Invima apruebe el trámite solicitado.', FALSE, 'El pago es previo a la radicación.', 2),
      (v_pregunta, 'Los trámites de medicamentos ante el Invima no tienen costo para los titulares nacionales.', FALSE, 'Sí tienen costo: cada trámite tiene su tarifa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un plan anual de gestión regulatoria solo vigila la fecha de vencimiento de los registros de medicamentos indefinidos. ¿Cuál es la mejor valoración?';
    v_t4 := 'Con la vigencia indefinida de los medicamentos, un plan centrado en fechas de vencimiento omite lo esencial: los fitoterapéuticos que sí vencen, los certificados de BPM, CVL y CPP, las modificaciones pendientes, las actualizaciones de seguridad y los retiros. El plan anual combina inventario, semáforo y presupuesto de tarifas.';
    v_j1 := $evrenov_json${"external_id":"renov-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso integrador: plan anual de gestión de vigencias","outcome":"Caso integrador: plan anual de gestión de vigencias","source":"Decreto 1474 de 2023; Decreto 1156 de 2018."}$evrenov_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'renov-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es completo, porque el vencimiento es la única obligación que tienen los registros.', FALSE, 'Los medicamentos ya no vencen y hay otras obligaciones.', 0),
      (v_pregunta, 'Es incompleto: omite fitoterapéuticos, certificados de terceros, modificaciones y retiros.', TRUE, 'Correcto. El plan debe cubrir todas las obligaciones.', 1),
      (v_pregunta, 'Es completo si se revisa una vez al año en la reunión de presupuesto de la empresa.', FALSE, 'La frecuencia no compensa lo que falta.', 2),
      (v_pregunta, 'Es incompleto solo porque debería incluir también el precio de venta de cada producto del portafolio.', FALSE, 'El problema principal es regulatorio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad renov-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Vigencia del registro sanitario: de la renovación quinquenal a la vigencia indefinida' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Vigencia del registro sanitario: de la renovación quinquenal a la vigencia indefinida) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Estado de los registros de un portafolio';
  v_t2 := $evrenov_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Determina el régimen de vigencia de cada registro con la norma que lo sustenta.</li><li>Explica qué ocurre con el registro de 2021 que «vencía» en 2026.</li><li>Define qué hacer con el CPP del importado y por qué importa aunque el registro sea indefinido.</li><li>Calcula cuándo vence el fitoterapéutico de 2016 y qué condiciones debe cumplir para una renovación automática.</li><li>Analiza el fitoterapéutico vencido: qué puede hacer con las existencias y con el material de empaque.</li><li>Prioriza las cuatro situaciones y justifica el orden.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Determinar la vigencia aplicable a cada registro.</li><li>Identificar el trámite o la acción que corresponde.</li><li>Priorizar las acciones del portafolio.</li></ul>
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
  <tr><td>Vigencia</td><td>25 %</td><td>Aplica la vigencia indefinida a los medicamentos y los diez años a los fitoterapéuticos, con la norma.</td><td>Aplica con una imprecisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acciones de mantenimiento</td><td>25 %</td><td>Define la gestión del CPP y las condiciones de renovación del fitoterapéutico de 2016.</td><td>Acciones generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Registro vencido</td><td>30 %</td><td>Explica que no puede fabricarse ni importarse, que puede agotar existencias en vida útil y que el empaque no se usa.</td><td>Explicación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Priorización</td><td>10 %</td><td>Orden justificado por riesgo y plazo.</td><td>Orden sin justificar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evrenov_html$;
  v_t3 := $evrenov_html$<h2>Caso de estudio</h2>
<p>Laboratorios Sabana (ficticio) te entrega cuatro registros consultados en la base del Invima (datos simulados): (1) tabletas de síntesis química concedidas en 2021, que «vencían» en 2026; (2) un jarabe importado concedido en 2019, con CPP que vence en seis meses; (3) un fitoterapéutico en cápsulas concedido en 2016; (4) un fitoterapéutico tópico cuyo registro venció hace dos meses sin solicitud de renovación, con existencias en bodega y material de empaque impreso.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evrenov_html$;
  v_t4 := 'Informe de estado del portafolio con acciones priorizadas.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evrenov_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995; Decreto 334 de 2022 (arts. 3, 4, 9 y 23); Decreto 1474 de 2023 (arts. 4 y 5); Decreto 1156 de 2018 (arts. 14, 27, 29 y 39); Ley 1437 de 2011 (art. 91); consulta pública de registros sanitarios y normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evrenov_html$;
  v_t7 := NULL;
  v_j1 := $evrenov_json$["Régimen de vigencia.","Registro de síntesis química.","CPP del importado.","Fitoterapéutico de 2016.","Fitoterapéutico vencido y priorización."]$evrenov_json$::jsonb;
  v_j2 := $evrenov_json${"version":1,"total":100,"criteria":[{"id":"vigencia","name":"Vigencia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Aplica la vigencia indefinida a los medicamentos y los diez años a los fitoterapéuticos, con la norma."},{"level":3,"label":"Logrado","description":"Aplica con una imprecisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acciones-de-mantenimiento","name":"Acciones de mantenimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Define la gestión del CPP y las condiciones de renovación del fitoterapéutico de 2016."},{"level":3,"label":"Logrado","description":"Acciones generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"registro-vencido","name":"Registro vencido","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Explica que no puede fabricarse ni importarse, que puede agotar existencias en vida útil y que el empaque no se usa."},{"level":3,"label":"Logrado","description":"Explicación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"priorizacion","name":"Priorización","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Orden justificado por riesgo y plazo."},{"level":3,"label":"Logrado","description":"Orden sin justificar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evrenov_json$::jsonb;
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


  -- ── Actividad renov-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Requisitos de renovación y transición por tipo de producto' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Requisitos de renovación y transición por tipo de producto) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Preparación de la renovación de un fitoterapéutico importado';
  v_t2 := $evrenov_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lista las condiciones del artículo 27 del Decreto 1156 de 2018 y verifica cada una.</li><li>Analiza el cambio de proveedor del extracto y su efecto sobre la renovación.</li><li>Define qué documentos deben actualizarse y en qué orden (BPM, CVL, estabilidad).</li><li>Decide si procede la renovación automática o la ruta no automática y justifica.</li><li>Construye un cronograma mensual hasta el vencimiento.</li><li>Explica qué ocurriría si el registro vence sin solicitud.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Verificar las condiciones de la renovación automática.</li><li>Identificar los riesgos que impiden la renovación automática.</li><li>Planear el cronograma del expediente.</li></ul>
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
  <tr><td>Condiciones del art. 27</td><td>30 %</td><td>Verifica las cuatro condiciones con los datos del caso.</td><td>Verifica la mayoría.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cambio no autorizado</td><td>25 %</td><td>Reconoce que puede afectar la información aprobada y propone cómo regularizarlo.</td><td>Lo menciona sin plan.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Ruta y cronograma</td><td>25 %</td><td>Decide la ruta con justificación y un cronograma realista.</td><td>Cronograma optimista o sin ruta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Consecuencias</td><td>10 %</td><td>Explica los efectos del vencimiento sin solicitud (art. 39).</td><td>Explicación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evrenov_html$;
  v_t3 := $evrenov_html$<h2>Caso de estudio</h2>
<p>Fitoandes S. A. S. (ficticia) importa desde Chile un fitoterapéutico en cápsulas cuyo registro vence en diez meses (datos simulados). El fabricante tiene BPM vigentes hasta dentro de cuatro meses; el CVL vence en seis meses; solo hay estabilidad de un lote industrial; y hace un año se cambió el proveedor del extracto sin trámite. La gerencia quiere una renovación automática.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evrenov_html$;
  v_t4 := 'Plan de renovación con verificación de condiciones y cronograma.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evrenov_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995; Decreto 334 de 2022 (arts. 3, 4, 9 y 23); Decreto 1474 de 2023 (arts. 4 y 5); Decreto 1156 de 2018 (arts. 14, 27, 29 y 39); Ley 1437 de 2011 (art. 91); consulta pública de registros sanitarios y normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evrenov_html$;
  v_t7 := NULL;
  v_j1 := $evrenov_json$["Verificación de condiciones.","Cambio de proveedor.","Documentos a actualizar.","Ruta de renovación.","Cronograma y riesgos."]$evrenov_json$::jsonb;
  v_j2 := $evrenov_json${"version":1,"total":100,"criteria":[{"id":"condiciones-del-art-27","name":"Condiciones del art. 27","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Verifica las cuatro condiciones con los datos del caso."},{"level":3,"label":"Logrado","description":"Verifica la mayoría."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"cambio-no-autorizado","name":"Cambio no autorizado","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce que puede afectar la información aprobada y propone cómo regularizarlo."},{"level":3,"label":"Logrado","description":"Lo menciona sin plan."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ruta-y-cronograma","name":"Ruta y cronograma","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Decide la ruta con justificación y un cronograma realista."},{"level":3,"label":"Logrado","description":"Cronograma optimista o sin ruta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"consecuencias","name":"Consecuencias","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Explica los efectos del vencimiento sin solicitud (art. 39)."},{"level":3,"label":"Logrado","description":"Explicación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evrenov_json$::jsonb;
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


  -- ── Actividad renov-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Pérdida de vigencia, no comercialización, retiro y agotamiento de existencias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Pérdida de vigencia, no comercialización, retiro y agotamiento de existencias) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Decisión ante un registro próximo a vencer';
  v_t2 := $evrenov_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Verifica qué condiciones del artículo 27 del Decreto 1156 cumple y cuáles no.</li><li>Analiza el efecto del BPM vencido sobre la renovación automática.</li><li>Compara las opciones: radicar con lo que hay, ruta no automática, dejar vencer y pedir un registro nuevo.</li><li>Explica qué pasará con las 8.000 unidades y los 15.000 empaques si el registro vence.</li><li>Recomienda una decisión y un cronograma inmediato.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Analizar la viabilidad de la renovación con los documentos disponibles.</li><li>Comparar las opciones: renovación, nuevo registro y agotamiento.</li><li>Recomendar una decisión con sus consecuencias.</li></ul>
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
  <tr><td>Condiciones</td><td>25 %</td><td>Identifica que el BPM vencido impide la renovación automática y verifica las demás condiciones.</td><td>Verificación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Opciones</td><td>30 %</td><td>Compara con fundamento la ruta no automática, el registro nuevo y el agotamiento.</td><td>Comparación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Existencias y empaques</td><td>25 %</td><td>Aplica el artículo 39: agotamiento en vida útil y no uso del empaque.</td><td>Aplicación con error.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Recomendación</td><td>10 %</td><td>Recomendación clara con cronograma.</td><td>Recomendación sin cronograma.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evrenov_html$;
  v_t3 := $evrenov_html$<h2>Caso de estudio</h2>
<p>Hierbas del Valle S. A. S. (ficticia) tiene un fitoterapéutico cuyo registro vence en tres semanas (datos simulados). No ha radicado la renovación; el certificado de BPM venció hace un mes; tiene estabilidad de dos lotes industriales; hay 8.000 unidades en bodega con vida útil de 14 meses y 15.000 empaques impresos. La gerencia pide opciones.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evrenov_html$;
  v_t4 := 'Informe de opciones con recomendación a la gerencia.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evrenov_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995; Decreto 334 de 2022 (arts. 3, 4, 9 y 23); Decreto 1474 de 2023 (arts. 4 y 5); Decreto 1156 de 2018 (arts. 14, 27, 29 y 39); Ley 1437 de 2011 (art. 91); consulta pública de registros sanitarios y normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evrenov_html$;
  v_t7 := NULL;
  v_j1 := $evrenov_json$["Condiciones del art. 27.","BPM vencido.","Comparación de opciones.","Existencias y empaques.","Recomendación."]$evrenov_json$::jsonb;
  v_j2 := $evrenov_json${"version":1,"total":100,"criteria":[{"id":"condiciones","name":"Condiciones","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica que el BPM vencido impide la renovación automática y verifica las demás condiciones."},{"level":3,"label":"Logrado","description":"Verificación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"opciones","name":"Opciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Compara con fundamento la ruta no automática, el registro nuevo y el agotamiento."},{"level":3,"label":"Logrado","description":"Comparación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"existencias-y-empaques","name":"Existencias y empaques","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Aplica el artículo 39: agotamiento en vida útil y no uso del empaque."},{"level":3,"label":"Logrado","description":"Aplicación con error."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"recomendacion","name":"Recomendación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Recomendación clara con cronograma."},{"level":3,"label":"Logrado","description":"Recomendación sin cronograma."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evrenov_json$::jsonb;
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


  -- ── Actividad renov-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Actualización de la información técnica: estabilidad, BPM, insertos y CPP' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Actualización de la información técnica: estabilidad, BPM, insertos y CPP) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: diagnóstico regulatorio del portafolio de Farmacéutica del Norte';
  v_t2 := $evrenov_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y clasifica cada registro por régimen de vigencia con la norma.</li><li>Fase 2: define las condiciones de renovación de cada fitoterapéutico y su urgencia.</li><li>Fase 2: explica la situación del biológico y qué debe revisarse con la regulación de biológicos.</li><li>Fase 3: lista las actualizaciones necesarias (CPP, BPM, fabricantes, insertos) con su soporte.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (vigencia).</strong> Régimen de vigencia de cada registro.</li>
  <li><strong>Fase 2 · Unidad 2 (requisitos).</strong> Requisitos de renovación de los fitoterapéuticos y situación del biológico.</li>
  <li><strong>Fase 3 · Unidad 3 (actualización).</strong> Actualización de certificados, fabricantes e insertos.</li>
  <li><strong>Fase 4 · Unidad 4 (retiro y vencimiento).</strong> Decisiones sobre los productos no comercializados y el registro vencido.</li>
  <li><strong>Fase 5 · Unidad 5 (planificación).</strong> Inventario, semáforo, presupuesto y plan anual.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar los registros por régimen de vigencia.</li><li>Identificar los trámites de renovación y actualización necesarios.</li></ul>
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
  <tr><td>Vigencia</td><td>25 %</td><td>Clasificación correcta de todos los registros con la norma.</td><td>Clasificación con un error.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Fitoterapéuticos</td><td>30 %</td><td>Condiciones del art. 27 y urgencia de cada uno, incluido el vencido.</td><td>Análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Biológico y actualizaciones</td><td>35 %</td><td>Plantea la revisión del biológico frente al Decreto 1782 de 2014 y las actualizaciones con soportes.</td><td>Plantea sin soportes.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evrenov_html$;
  v_t3 := $evrenov_html$<h2>Caso de estudio</h2>
<p>Farmacéutica del Norte S. A. S. (ficticia) te contrata para ordenar su gestión regulatoria (datos simulados). Su portafolio: seis medicamentos de síntesis química nacionales, dos importados de la India con CPP, un biológico concedido hace años y tres fitoterapéuticos (uno vence en 11 meses, otro en 4 y otro venció hace un mes). Dos productos no se comercializan desde hace un año y la empresa nunca ha hecho un presupuesto de trámites. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evrenov_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evrenov_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995; Decreto 334 de 2022 (arts. 3, 4, 9 y 23); Decreto 1474 de 2023 (arts. 4 y 5); Decreto 1156 de 2018 (arts. 14, 27, 29 y 39); Ley 1437 de 2011 (art. 91); consulta pública de registros sanitarios y normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evrenov_html$;
  v_t7 := NULL;
  v_j1 := $evrenov_json$["Régimen de vigencia.","Fitoterapéuticos.","Biológico.","Actualizaciones."]$evrenov_json$::jsonb;
  v_j2 := $evrenov_json${"version":1,"total":100,"criteria":[{"id":"vigencia","name":"Vigencia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Clasificación correcta de todos los registros con la norma."},{"level":3,"label":"Logrado","description":"Clasificación con un error."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"fitoterapeuticos","name":"Fitoterapéuticos","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Condiciones del art. 27 y urgencia de cada uno, incluido el vencido."},{"level":3,"label":"Logrado","description":"Análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"biologico-y-actualizaciones","name":"Biológico y actualizaciones","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Plantea la revisión del biológico frente al Decreto 1782 de 2014 y las actualizaciones con soportes."},{"level":3,"label":"Logrado","description":"Plantea sin soportes."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evrenov_json$::jsonb;
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


  -- ── Actividad renov-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Planificación del portafolio, semaforización y tarifas INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Planificación del portafolio, semaforización y tarifas INVIMA) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan anual de gestión regulatoria de Farmacéutica del Norte';
  v_t2 := $evrenov_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: decide qué hacer con los dos productos no comercializados y con el fitoterapéutico vencido, con sus trámites.</li><li>Fase 5: construye el inventario regulatorio y el semáforo de hitos.</li><li>Fase 5: arma el plan anual por trimestres con el presupuesto de tarifas según la resolución vigente.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (vigencia).</strong> Régimen de vigencia de cada registro.</li>
  <li><strong>Fase 2 · Unidad 2 (requisitos).</strong> Requisitos de renovación de los fitoterapéuticos y situación del biológico.</li>
  <li><strong>Fase 3 · Unidad 3 (actualización).</strong> Actualización de certificados, fabricantes e insertos.</li>
  <li><strong>Fase 4 · Unidad 4 (retiro y vencimiento).</strong> Decisiones sobre los productos no comercializados y el registro vencido.</li>
  <li><strong>Fase 5 · Unidad 5 (planificación).</strong> Inventario, semáforo, presupuesto y plan anual.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Decidir sobre los productos no comercializados y el registro vencido.</li><li>Construir el inventario, el semáforo y el plan anual con presupuesto.</li></ul>
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
  <tr><td>Retiro y vencimiento</td><td>25 %</td><td>Decisiones fundamentadas con el Decreto 1474 (art. 4) y el Decreto 1156 (art. 39).</td><td>Decisiones sin norma.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Inventario y semáforo</td><td>25 %</td><td>Inventario completo y semáforo con hitos y márgenes realistas.</td><td>Inventario o semáforo incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan y presupuesto</td><td>25 %</td><td>Plan trimestral con presupuesto basado en la resolución vigente.</td><td>Plan sin presupuesto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evrenov_html$;
  v_t3 := $evrenov_html$<h2>Caso de estudio</h2>
<p>Farmacéutica del Norte S. A. S. (ficticia) te contrata para ordenar su gestión regulatoria (datos simulados). Su portafolio: seis medicamentos de síntesis química nacionales, dos importados de la India con CPP, un biológico concedido hace años y tres fitoterapéuticos (uno vence en 11 meses, otro en 4 y otro venció hace un mes). Dos productos no se comercializan desde hace un año y la empresa nunca ha hecho un presupuesto de trámites. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás a la gerencia.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evrenov_html$;
  v_t4 := 'Plan anual de gestión regulatoria con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evrenov_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995; Decreto 334 de 2022 (arts. 3, 4, 9 y 23); Decreto 1474 de 2023 (arts. 4 y 5); Decreto 1156 de 2018 (arts. 14, 27, 29 y 39); Ley 1437 de 2011 (art. 91); consulta pública de registros sanitarios y normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evrenov_html$;
  v_t7 := NULL;
  v_j1 := $evrenov_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Decisiones de retiro y vencimiento.","Inventario y semáforo.","Plan anual y presupuesto.","Resumen ejecutivo."]$evrenov_json$::jsonb;
  v_j2 := $evrenov_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"retiro-y-vencimiento","name":"Retiro y vencimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Decisiones fundamentadas con el Decreto 1474 (art. 4) y el Decreto 1156 (art. 39)."},{"level":3,"label":"Logrado","description":"Decisiones sin norma."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"inventario-y-semaforo","name":"Inventario y semáforo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Inventario completo y semáforo con hitos y márgenes realistas."},{"level":3,"label":"Logrado","description":"Inventario o semáforo incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-y-presupuesto","name":"Plan y presupuesto","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan trimestral con presupuesto basado en la resolución vigente."},{"level":3,"label":"Logrado","description":"Plan sin presupuesto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evrenov_json$::jsonb;
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


  -- ── Foro renov-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con renovaciones';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evrenov_html$<h2>Para empezar</h2>
<p>Piensa en una renovación, un vencimiento o un retiro de registro que hayas vivido o conocido y cuéntanos en tres o cuatro líneas qué pasó, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evrenov_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre la vigencia de los registros te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evrenov_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evrenov_html$;
  v_t6 := $evrenov_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evrenov_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Cómo cambió tu trabajo con la vigencia indefinida de los medicamentos?', '¿Has gestionado la renovación de un fitoterapéutico?']::text[];
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


  -- ── Foro renov-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Vigencia del registro sanitario: de la renovación quinquenal a la vigencia indefinida' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Vigencia del registro sanitario: de la renovación quinquenal a la vigencia indefinida) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Ya no hay que preocuparse por la renovación?';
  v_t2 := 'Argumentar qué cambió y qué no con la vigencia indefinida de los registros de medicamentos.';
  v_t3 := $evrenov_html$<h2>Caso del foro</h2>
<p>Una empresa farmacéutica decide eliminar el cargo de analista de renovaciones porque «con el Decreto 1474 ya nada vence» (datos simulados). Su portafolio incluye medicamentos de síntesis química nacionales e importados, un biológico y tres fitoterapéuticos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evrenov_html$;
  v_t4 := '¿Tiene razón la empresa? ¿Qué obligaciones regulatorias siguen vigentes en su portafolio?';
  v_t5 := $evrenov_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma y el artículo que sustentan cada obligación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evrenov_html$;
  v_t6 := $evrenov_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma y el artículo que sustentan cada obligación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evrenov_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué productos del portafolio siguen teniendo vencimiento?', '¿Qué documentos de terceros (BPM, CVL, CPP) siguen venciendo?', '¿Qué puede hacer el Invima ante un registro que no mantiene las condiciones aprobadas?']::text[];
  v_j1 := $evrenov_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma y el artículo que sustentan cada obligación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evrenov_json$::jsonb;
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


  -- ── Foro renov-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Requisitos de renovación y transición por tipo de producto' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Requisitos de renovación y transición por tipo de producto) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Renovar no es modificar';
  v_t2 := 'Argumentar por qué la renovación y las modificaciones son trámites distintos y cómo planearlos.';
  v_t3 := $evrenov_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio tiene un fitoterapéutico que vence en ocho meses (datos simulados). En el mismo periodo quiere cambiar el material de envase y ampliar la vida útil. El director técnico propone «meter todo en la renovación para que salga en un solo acto».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evrenov_html$;
  v_t4 := '¿Qué le responderías y cómo organizarías los trámites?';
  v_t5 := $evrenov_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma y el artículo que sustentan tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evrenov_html$;
  v_t6 := $evrenov_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma y el artículo que sustentan tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evrenov_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué condiciones exige la renovación automática de un fitoterapéutico?', '¿Qué pasa si los cambios afectan la información aprobada?', '¿Qué orden de trámites reduce el riesgo de quedarse sin registro?']::text[];
  v_j1 := $evrenov_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma y el artículo que sustentan tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evrenov_json$::jsonb;
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


  -- ── Foro renov-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Actualización de la información técnica: estabilidad, BPM, insertos y CPP' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Actualización de la información técnica: estabilidad, BPM, insertos y CPP) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Registro indefinido, información viva';
  v_t2 := 'Argumentar cómo mantener vigente la información técnica de un registro sin renovaciones periódicas.';
  v_t3 := $evrenov_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio con 40 registros indefinidos descubre en una auditoría (datos simulados): insertos sin las últimas advertencias de seguridad, un CPP vencido, un fabricante de principio activo cambiado sin trámite y estudios de estabilidad que no respaldan la vida útil impresa.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evrenov_html$;
  v_t4 := '¿Qué riesgos regulatorios tiene cada hallazgo y qué sistema propondrías para que no se repitan?';
  v_t5 := $evrenov_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada riesgo y cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evrenov_html$;
  v_t6 := $evrenov_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada riesgo y cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evrenov_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué puede hacer el Invima ante un registro que no mantiene las condiciones aprobadas?', '¿Quién en la empresa debe vigilar la información de seguridad?', '¿Cómo priorizarías la corrección de los hallazgos?']::text[];
  v_j1 := $evrenov_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada riesgo y cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evrenov_json$::jsonb;
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


  -- ── Foro renov-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Pérdida de vigencia, no comercialización, retiro y agotamiento de existencias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Pérdida de vigencia, no comercialización, retiro y agotamiento de existencias) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Retirar o mantener un registro';
  v_t2 := 'Argumentar cómo decidir y gestionar el retiro de un producto del mercado.';
  v_t3 := $evrenov_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio revisa su portafolio (datos simulados): un antibiótico que no vende hace dos años, un analgésico que dejará de fabricar por falta de materia prima y un fitoterapéutico cuyo registro vence en tres meses y que no es rentable.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evrenov_html$;
  v_t4 := '¿Qué decisión tomarías con cada producto y qué trámites implicaría?';
  v_t5 := $evrenov_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma y el artículo que sustentan cada decisión. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evrenov_html$;
  v_t6 := $evrenov_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma y el artículo que sustentan cada decisión.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evrenov_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué prevé el Decreto 1474 sobre el retiro voluntario y la cancelación?', '¿Qué pasa con las existencias de un producto cuyo registro no se renueva?', '¿Qué impacto puede tener un retiro en el abastecimiento?']::text[];
  v_j1 := $evrenov_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma y el artículo que sustentan cada decisión."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evrenov_json$::jsonb;
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


  -- ── Foro renov-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Planificación del portafolio, semaforización y tarifas INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Planificación del portafolio, semaforización y tarifas INVIMA) en Renovación de Registros Sanitarios: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · El semáforo regulatorio';
  v_t2 := 'Argumentar cómo diseñar alertas que anticipen trámites y eviten pérdidas de registro o desabastecimientos.';
  v_t3 := $evrenov_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio perdió en un año el registro de un fitoterapéutico por radicar tarde y tuvo que frenar importaciones por un CPP vencido (datos simulados). La gerencia pide un «semáforo» que avise a tiempo.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evrenov_html$;
  v_t4 := '¿Qué hitos incluirías en el semáforo y con qué márgenes?';
  v_t5 := $evrenov_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada hito. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evrenov_html$;
  v_t6 := $evrenov_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada hito.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evrenov_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué margen necesitas para reunir la estabilidad de dos lotes industriales?', '¿Qué documentos de terceros dependen de proveedores externos?', '¿Quién debe recibir cada alerta?']::text[];
  v_j1 := $evrenov_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada hito."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evrenov_json$::jsonb;
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


  RAISE NOTICE 'Renovación de Registros Sanitarios: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evrenov$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Modificaciones al Registro Sanitario de Medicamentos
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evmodif$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Modificaciones al Registro Sanitario de Medicamentos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Modificaciones al Registro Sanitario de Medicamentos: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos y marco normativo de las modificaciones al registro sanitario', 'Unidad 2. Modificaciones administrativo-legales', 'Unidad 3. Modificaciones de calidad (farmacéuticas) en medicamentos de síntesis química', 'Unidad 4. Modificaciones de seguridad y eficacia (farmacológicas) y modificaciones de biológicos', 'Unidad 5. Gestión estratégica del ciclo de vida: control de cambios, unificación de trámites y tarifas']::text[])) < 5 THEN
    RAISE NOTICE 'Modificaciones al Registro Sanitario: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evmodif_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evmodif_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz modif-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo de las modificaciones al registro sanitario' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo de las modificaciones al registro sanitario) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos y marco normativo de las modificaciones al registro sanitario';
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


    v_t3 := '¿En qué familias agrupa el artículo 5 del Decreto 334 de 2022 las modificaciones al registro sanitario?';
    v_t4 := 'El artículo 5 del Decreto 334 de 2022 agrupa las modificaciones en administrativo-legales (no afectan calidad, seguridad ni eficacia), de calidad (con cuatro niveles de riesgo: sin impacto, menor, moderado y mayor) y de seguridad y eficacia (etiquetado administrativo, etiquetado, urgentes de seguridad y seguridad y eficacia).';
    v_j1 := $evmodif_json${"external_id":"modif-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Las tres familias: administrativo-legales, calidad y seguridad/eficacia","outcome":"Las tres familias: administrativo-legales, calidad y seguridad/eficacia","source":"Decreto 334 de 2022, art. 5."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En cambios menores y mayores, sin distinguir entre calidad, seguridad o eficacia del producto.', FALSE, 'La norma distingue tres familias.', 0),
      (v_pregunta, 'En cambios de titular, de precio y de publicidad, que son los más frecuentes en la práctica.', FALSE, 'Esas no son las familias del artículo 5.', 1),
      (v_pregunta, 'En cambios nacionales e importados, según el origen del medicamento registrado.', FALSE, 'El origen no define la familia.', 2),
      (v_pregunta, 'Administrativo-legales, de calidad y de seguridad y eficacia.', TRUE, 'Correcto. Cada familia tiene sus niveles y vías.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un cambio de calidad se clasifica como de riesgo mayor. ¿Qué vía y qué plazo prevé el Decreto 334 de 2022?';
    v_t4 := 'El artículo 8 del Decreto 334 de 2022 dispone para los cambios de calidad: sin impacto, documentación interna; riesgo menor, notificación o modificación automática; riesgo moderado, aprobación previa en 1 a 3 meses; riesgo mayor, aprobación previa en 3 a 6 meses.';
    v_j1 := $evmodif_json${"external_id":"modif-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Vías de trámite y plazos (art. 8): notificación, automática y aprobación previa","outcome":"Vías de trámite y plazos (art. 8): notificación, automática y aprobación previa","source":"Decreto 334 de 2022, art. 8.2.4."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Notificación de novedad dentro del año siguiente a la implementación del cambio.', FALSE, 'Esa vía corresponde a cambios de menor riesgo.', 0),
      (v_pregunta, 'Aprobación previa, con un plazo de 3 a 6 meses para que el Invima resuelva.', TRUE, 'Correcto. Con un único requerimiento posible.', 1),
      (v_pregunta, 'Modificación automática, con acto expedido dentro del mes siguiente a la radicación.', FALSE, 'La vía automática es para cambios menores.', 2),
      (v_pregunta, 'Documentación interna, sin informar al Invima, sujeta solo a revisión posterior.', FALSE, 'Eso aplica a los cambios sin impacto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'El Invima hizo un requerimiento sobre una modificación de riesgo moderado. El titular dejó pasar dos meses sin responder ni pedir prórroga. ¿Qué análisis es correcto?';
    v_t4 := 'El artículo 8 del Decreto 334 de 2022 prevé un único requerimiento; el titular tiene un mes para responder y puede pedir una prórroga por igual término. Si no responde, se entiende desistida la solicitud y el Invima declara el desistimiento. Tras la respuesta, el plazo de decisión vuelve a correr.';
    v_j1 := $evmodif_json${"external_id":"modif-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Vías de trámite y plazos (art. 8): notificación, automática y aprobación previa","outcome":"Vías de trámite y plazos (art. 8): notificación, automática y aprobación previa","source":"Decreto 334 de 2022, art. 8."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El Invima debe hacer un segundo requerimiento antes de tomar cualquier decisión.', FALSE, 'El requerimiento es único.', 0),
      (v_pregunta, 'La modificación se entiende aprobada por silencio administrativo positivo.', FALSE, 'La norma no prevé aprobación por silencio en este caso.', 1),
      (v_pregunta, 'Se entiende desistida: el titular tenía un mes para responder, prorrogable una vez por igual término.', TRUE, 'Correcto. El Invima declara el desistimiento.', 2),
      (v_pregunta, 'El titular puede responder en cualquier momento, porque el requerimiento no tiene plazo.', FALSE, 'El plazo es de un mes.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un director técnico dice que «con la vigencia indefinida ya no hay que informar cambios, porque el registro no vence». ¿Cuál es la mejor valoración?';
    v_t4 := 'Con la vigencia indefinida (Decreto 1474 de 2023), el registro debe mantener las condiciones aprobadas y el Invima conserva la vigilancia. Los cambios se gestionan como modificaciones según su familia, nivel de riesgo y vía (Decreto 334 de 2022, arts. 5 y 8).';
    v_j1 := $evmodif_json${"external_id":"modif-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Vigencia indefinida y su efecto sobre la gestión de cambios","outcome":"Vigencia indefinida y su efecto sobre la gestión de cambios","source":"Decreto 1474 de 2023, art. 5; Decreto 334 de 2022, arts. 5 y 8."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es errada: la vigencia indefinida traslada el control al ciclo de vida, y los cambios siguen sus trámites.', TRUE, 'Correcto. El registro debe mantener las condiciones aprobadas.', 0),
      (v_pregunta, 'Es correcta, porque los cambios solo se informaban al renovar el registro cada cinco años.', FALSE, 'Las modificaciones nunca dependieron solo de la renovación.', 1),
      (v_pregunta, 'Es correcta para los cambios de calidad, pero no para los de seguridad y eficacia.', FALSE, 'Ambas familias siguen sus trámites.', 2),
      (v_pregunta, 'Es errada solo porque la vigencia indefinida no aplica a los medicamentos de síntesis química.', FALSE, 'Sí aplica a los medicamentos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz modif-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Modificaciones administrativo-legales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Modificaciones administrativo-legales) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Modificaciones administrativo-legales';
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


    v_t3 := '¿Qué caracteriza a una modificación administrativo-legal según el Decreto 334 de 2022?';
    v_t4 := 'Las modificaciones administrativo-legales cambian información del registro sanitario sin afectar la calidad, la seguridad ni la eficacia. Según el artículo 8, se tramitan por notificación (hasta un año después de implementarlas), de forma automática (acto en un mes) o con aprobación previa (dos meses), según la guía de cada producto.';
    v_j1 := $evmodif_json${"external_id":"modif-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a las modificaciones administrativo-legales","outcome":"Introducción a las modificaciones administrativo-legales","source":"Decreto 334 de 2022, arts. 5.1 y 8.1."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Cambia información del registro sin afectar la calidad, la seguridad ni la eficacia del medicamento.', TRUE, 'Correcto. Puede ser notificación, automática o con aprobación previa.', 0),
      (v_pregunta, 'Cambia la fórmula del medicamento sin modificar el texto de la resolución del registro.', FALSE, 'Un cambio de fórmula es de calidad.', 1),
      (v_pregunta, 'Cambia las indicaciones aprobadas del medicamento en el inserto y la etiqueta.', FALSE, 'Eso es seguridad y eficacia.', 2),
      (v_pregunta, 'Cambia el proceso de fabricación sin necesidad de informar al Invima en ningún caso.', FALSE, 'Eso sería un cambio de calidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'El fabricante de un medicamento cambia su razón social, pero sigue fabricando en la misma planta y con el mismo proceso. ¿Qué tipo de modificación es?';
    v_t4 := 'El cambio de razón social sin cambio de sitio ni de proceso es administrativo-legal. En cambio, un traslado de planta o la inclusión de un nuevo sitio de fabricación son cambios de calidad, porque pueden afectar al producto.';
    v_j1 := $evmodif_json${"external_id":"modif-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Cambios de razón social, dirección e inclusión/exclusión de fabricantes, importadores y acondicionadores","outcome":"Cambios de razón social, dirección e inclusión/exclusión de fabricantes, importadores y acondicionadores","source":"Decreto 334 de 2022, art. 5; guías de modificaciones del Invima."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'De calidad de riesgo mayor, porque cambia el fabricante del producto terminado.', FALSE, 'El sitio y el proceso no cambian.', 0),
      (v_pregunta, 'De seguridad y eficacia, porque el inserto debe mostrar el nuevo nombre del fabricante.', FALSE, 'No afecta la seguridad ni la eficacia.', 1),
      (v_pregunta, 'Administrativo-legal, porque cambia un dato del registro sin afectar calidad, seguridad ni eficacia.', TRUE, 'Correcto. Distinto de un traslado de planta.', 2),
      (v_pregunta, 'No requiere ningún trámite, porque el registro sanitario es indefinido.', FALSE, 'Los cambios de información del registro se tramitan.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular tiene tres cambios administrativo-legales que se tramitan por notificación de novedad. ¿Qué análisis es correcto sobre su radicación?';
    v_t4 := 'El artículo 8 del Decreto 334 de 2022 permite agrupar varias notificaciones de novedad en una sola, identificando cada cambio, y varias modificaciones automáticas en una sola solicitud. El parágrafo añadido por el Decreto 1474 de 2023 permite agrupar cambios moderados y mayores en un radicado.';
    v_j1 := $evmodif_json${"external_id":"modif-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Agrupación de cambios legales, un solo pago y agotamiento de existencias","outcome":"Agrupación de cambios legales, un solo pago y agotamiento de existencias","source":"Decreto 334 de 2022, art. 8."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Deben radicarse en tres trámites separados, porque la norma prohíbe agruparlos.', FALSE, 'La norma permite agruparlos.', 0),
      (v_pregunta, 'Deben esperar a una renovación para radicarlos juntos en la misma solicitud.', FALSE, 'Los medicamentos ya no se renuevan.', 1),
      (v_pregunta, 'Deben agruparse con cambios de calidad de riesgo mayor en un solo radicado.', FALSE, 'La agrupación sigue reglas por vía.', 2),
      (v_pregunta, 'Pueden agruparse en una sola notificación, identificando cada cambio.', TRUE, 'Correcto. Es lo que permite el artículo 8.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una empresa compra el registro de otra y empieza a vender el producto a su nombre «porque el contrato de compra ya está firmado». ¿Cuál es la mejor valoración?';
    v_t4 := 'La cesión o el traspaso de la titularidad de un registro sanitario es una modificación administrativo-legal que se tramita ante el Invima con sus soportes. Un contrato privado no cambia por sí solo quién responde ante la autoridad.';
    v_j1 := $evmodif_json${"external_id":"modif-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: cesión de titularidad con inclusión de importador","outcome":"Caso: cesión de titularidad con inclusión de importador","source":"Decreto 334 de 2022, art. 5.1; guía de modificaciones administrativo-legales del Invima."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: el contrato privado traslada la titularidad del registro de forma automática.', FALSE, 'La titularidad cambia con el trámite ante el Invima.', 0),
      (v_pregunta, 'Es errada: la cesión de titularidad es una modificación que debe tramitarse ante el Invima antes de actuar como titular.', TRUE, 'Correcto. El nuevo titular asume las obligaciones.', 1),
      (v_pregunta, 'Es correcta si el comprador informa al Invima dentro de los cinco años siguientes.', FALSE, 'No es un trámite que pueda posponerse así.', 2),
      (v_pregunta, 'Es errada solo porque los registros sanitarios no pueden venderse ni cederse nunca.', FALSE, 'Sí pueden cederse mediante el trámite.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz modif-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Modificaciones de calidad (farmacéuticas) en medicamentos de síntesis química' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Modificaciones de calidad (farmacéuticas) en medicamentos de síntesis química) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Modificaciones de calidad (farmacéuticas) en medicamentos de síntesis química';
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


    v_t3 := '¿Qué niveles de riesgo distingue el Decreto 334 de 2022 para los cambios de calidad?';
    v_t4 := 'El artículo 5.2 del Decreto 334 de 2022 clasifica los cambios de calidad en cuatro niveles: sin impacto, riesgo menor, riesgo moderado y riesgo mayor (con repercusiones significativas en la calidad). El artículo 8.2 asigna a cada nivel su vía y su plazo.';
    v_j1 := $evmodif_json${"external_id":"modif-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a las modificaciones con impacto en la calidad","outcome":"Introducción a las modificaciones con impacto en la calidad","source":"Decreto 334 de 2022, arts. 5.2 y 8.2."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Bajo, medio y alto, con la misma vía de trámite para los tres niveles de riesgo.', FALSE, 'Son cuatro niveles con vías distintas.', 0),
      (v_pregunta, 'Sin impacto, menor, moderado y mayor.', TRUE, 'Correcto. Cada nivel tiene su vía y su plazo.', 1),
      (v_pregunta, 'Nacional, regional e internacional, según dónde se fabrique el medicamento.', FALSE, 'El lugar de fabricación no define el nivel.', 2),
      (v_pregunta, 'Urgente, prioritario y ordinario, según la necesidad comercial del titular.', FALSE, 'La necesidad comercial no define el riesgo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un titular quiere adicionar un sitio alterno de fabricación del producto terminado, clasificado en la guía del Invima como de riesgo mayor. ¿Qué trámite le corresponde?';
    v_t4 := 'Los cambios de calidad de riesgo mayor requieren aprobación previa; el Invima tiene de 3 a 6 meses para resolver y puede hacer un único requerimiento (respuesta en un mes, prorrogable). La guía del Invima clasifica la adición o el reemplazo del fabricante del producto terminado como cambio mayor.';
    v_j1 := $evmodif_json${"external_id":"modif-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso: adición de un fabricante alterno de producto terminado","outcome":"Caso: adición de un fabricante alterno de producto terminado","source":"Decreto 334 de 2022, art. 8.2.4; guía de modificaciones de calidad del Invima."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Documentar el cambio internamente y empezar a fabricar en el nuevo sitio de inmediato.', FALSE, 'Los cambios mayores requieren aprobación previa.', 0),
      (v_pregunta, 'Notificar la novedad dentro del año siguiente a empezar a fabricar en el sitio nuevo.', FALSE, 'La notificación es para cambios menores.', 1),
      (v_pregunta, 'Pedir un registro nuevo, porque cualquier cambio de fabricante anula de inmediato el registro actual.', FALSE, 'Se tramita como modificación.', 2),
      (v_pregunta, 'Aprobación previa: el Invima resuelve en 3 a 6 meses y puede hacer un único requerimiento.', TRUE, 'Correcto. No se fabrica en el sitio nuevo hasta la aprobación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular tiene un cambio de calidad de riesgo moderado y otro de riesgo mayor para el mismo producto. ¿Qué análisis es correcto sobre su radicación?';
    v_t4 := 'El parágrafo del artículo 8 del Decreto 334 de 2022, añadido por el Decreto 1474 de 2023, permite agrupar varios cambios de riesgo moderado o mayor en un mismo radicado, con la tarifa aplicable; el plazo de respuesta es el del nivel de mayor riesgo del grupo.';
    v_j1 := $evmodif_json${"external_id":"modif-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Agrupación de cambios de calidad y cambios que exigen nuevo registro","outcome":"Agrupación de cambios de calidad y cambios que exigen nuevo registro","source":"Decreto 334 de 2022, art. 8, parágrafo (Decreto 1474 de 2023)."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Pueden agruparse en un mismo radicado; el plazo de respuesta es el del nivel de mayor riesgo.', TRUE, 'Correcto. Lo permite el parágrafo añadido por el Decreto 1474.', 0),
      (v_pregunta, 'Deben radicarse siempre por separado, porque la norma prohíbe agrupar niveles de riesgo distintos.', FALSE, 'La norma permite esa agrupación.', 1),
      (v_pregunta, 'Pueden agruparse y el plazo de respuesta es el del nivel de menor riesgo.', FALSE, 'Se aplica el plazo del mayor riesgo.', 2),
      (v_pregunta, 'Deben esperar a que se apruebe el moderado para poder radicar el mayor.', FALSE, 'No es necesario esperar.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un jefe de producción dice que los cambios de calidad «sin impacto» no requieren «ningún papel». ¿Cuál es la mejor valoración?';
    v_t4 := 'Según el artículo 8.2.1 del Decreto 334 de 2022, los cambios de calidad sin impacto se implementan de inmediato una vez documentados internamente, sin notificar al Invima, y quedan sujetos a revisión posterior. La documentación del sistema de calidad es su soporte.';
    v_j1 := $evmodif_json${"external_id":"modif-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Cambios de fórmula y de proceso de manufactura","outcome":"Cambios de fórmula y de proceso de manufactura","source":"Decreto 334 de 2022, art. 8.2.1."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: los cambios sin impacto no se registran en ninguna parte.', FALSE, 'Deben documentarse en el sistema de calidad.', 0),
      (v_pregunta, 'Es correcta si el cambio se hace un fin de semana sin afectar la producción.', FALSE, 'El momento no cambia la obligación.', 1),
      (v_pregunta, 'Es errada: se implementan de inmediato, pero deben documentarse y quedan sujetos a revisión posterior.', TRUE, 'Correcto. Su soporte está en el sistema de calidad.', 2),
      (v_pregunta, 'Es errada solo porque todos los cambios requieren aprobación previa del Invima.', FALSE, 'Los sin impacto no requieren aprobación previa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz modif-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Modificaciones de seguridad y eficacia (farmacológicas) y modificaciones de biológicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Modificaciones de seguridad y eficacia (farmacológicas) y modificaciones de biológicos) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Modificaciones de seguridad y eficacia (farmacológicas) y modificaciones de biológicos';
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


    v_t3 := '¿Qué subtipos de modificaciones de seguridad y eficacia distingue el Decreto 334 de 2022?';
    v_t4 := 'El artículo 5.3 del Decreto 334 de 2022 distingue en la familia de seguridad y eficacia: cambios administrativos del etiquetado, cambios en la información del etiquetado, cambios urgentes de seguridad y cambios de la información de seguridad y eficacia.';
    v_j1 := $evmodif_json${"external_id":"modif-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Cambios en la información del etiquetado y cambios urgentes de seguridad","outcome":"Cambios en la información del etiquetado y cambios urgentes de seguridad","source":"Decreto 334 de 2022, art. 5.3."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Cambios de precio, de presentación comercial y de publicidad dirigida a profesionales de la salud.', FALSE, 'Esos no son los subtipos de la norma.', 0),
      (v_pregunta, 'Cambios nacionales, importados y de exportación según la modalidad del registro.', FALSE, 'La modalidad no define los subtipos.', 1),
      (v_pregunta, 'Etiquetado administrativo, etiquetado, urgentes de seguridad y de seguridad y eficacia.', TRUE, 'Correcto. Cada uno tiene su vía.', 2),
      (v_pregunta, 'Cambios menores, moderados y mayores, como en las modificaciones de calidad.', FALSE, 'Esa clasificación es la de calidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una señal de farmacovigilancia exige agregar con urgencia una advertencia grave al inserto. ¿Qué vía prevé el Decreto 334 de 2022?';
    v_t4 := 'Según el artículo 8.3.2 del Decreto 334 de 2022, los cambios urgentes de seguridad se notifican y se implementan con acuerdo previo del Invima; el titular debe radicar la solicitud de aprobación dentro del mes siguiente.';
    v_j1 := $evmodif_json${"external_id":"modif-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso: señal de farmacovigilancia que exige cambio urgente de inserto","outcome":"Caso: señal de farmacovigilancia que exige cambio urgente de inserto","source":"Decreto 334 de 2022, art. 8.3.2."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Implementar el cambio con acuerdo previo del Invima y radicar la solicitud de aprobación dentro del mes siguiente.', TRUE, 'Correcto. Es la vía de los cambios urgentes de seguridad.', 0),
      (v_pregunta, 'Esperar la aprobación previa de hasta 10 meses antes de cambiar cualquier texto del inserto.', FALSE, 'Ese plazo es de los cambios de seguridad y eficacia.', 1),
      (v_pregunta, 'Cambiar el inserto sin informar al Invima, porque se trata de proteger a los pacientes.', FALSE, 'Se requiere el acuerdo previo y la radicación.', 2),
      (v_pregunta, 'Notificar la novedad un año después de implementar el nuevo texto del inserto.', FALSE, 'Ese plazo es de las notificaciones administrativas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular quiere incluir una nueva indicación terapéutica para su medicamento. ¿Qué análisis es correcto?';
    v_t4 := 'Las nuevas indicaciones, posologías, grupos etarios o vías de administración son cambios de seguridad y eficacia; el artículo 8.3.4 del Decreto 334 de 2022 prevé aprobación previa con un plazo de hasta 10 meses y un único requerimiento.';
    v_j1 := $evmodif_json${"external_id":"modif-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Nuevas indicaciones, posología, grupo etario, vía de administración y condición de venta","outcome":"Nuevas indicaciones, posología, grupo etario, vía de administración y condición de venta","source":"Decreto 334 de 2022, art. 8.3.4."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un cambio de etiquetado administrativo que se notifica dentro del año siguiente.', FALSE, 'Una nueva indicación no es un cambio administrativo.', 0),
      (v_pregunta, 'Es un cambio de seguridad y eficacia que requiere aprobación previa, con un plazo de hasta 10 meses.', TRUE, 'Correcto. Requiere evidencia clínica que la sustente.', 1),
      (v_pregunta, 'Es un cambio de calidad de riesgo menor que se tramita de forma automática en un mes.', FALSE, 'No es un cambio de calidad.', 2),
      (v_pregunta, 'No requiere trámite si la indicación ya fue aprobada por otra agencia sanitaria extranjera de referencia.', FALSE, 'La aprobación extranjera no reemplaza el trámite.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un analista propone incluir de inmediato una nueva reacción adversa no urgente en el inserto, sin trámite, «porque solo es un texto». ¿Cuál es la mejor valoración?';
    v_t4 := 'Los cambios en la información del etiquetado (nuevas reacciones adversas, advertencias, interacciones o contraindicaciones) requieren aprobación previa con un plazo de hasta 5 meses (art. 8.3.3 del Decreto 334 de 2022). Si el riesgo es urgente, se usa la vía de los cambios urgentes de seguridad.';
    v_j1 := $evmodif_json${"external_id":"modif-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Cambios en la información del etiquetado y cambios urgentes de seguridad","outcome":"Cambios en la información del etiquetado y cambios urgentes de seguridad","source":"Decreto 334 de 2022, art. 8.3.3."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: los cambios de texto del inserto nunca requieren trámite ante el Invima.', FALSE, 'Los cambios de información de seguridad sí lo requieren.', 0),
      (v_pregunta, 'Es correcta si se informa al Invima en la siguiente renovación del registro sanitario.', FALSE, 'Los medicamentos ya no se renuevan.', 1),
      (v_pregunta, 'Es errada solo porque las reacciones adversas no deben aparecer en el inserto.', FALSE, 'Sí deben aparecer, con el trámite correspondiente.', 2),
      (v_pregunta, 'Es errada: es un cambio en la información del etiquetado, con aprobación previa de hasta 5 meses.', TRUE, 'Correcto. Si fuera urgente, seguiría otra vía.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz modif-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Gestión estratégica del ciclo de vida: control de cambios, unificación de trámites y tarifas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Gestión estratégica del ciclo de vida: control de cambios, unificación de trámites y tarifas) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Gestión estratégica del ciclo de vida: control de cambios, unificación de trámites y tarifas';
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


    v_t3 := '¿Qué aporta el control de cambios del sistema de calidad (ICH Q10) a la gestión regulatoria?';
    v_t4 := 'ICH Q10 describe el control de cambios del sistema de calidad farmacéutico: propuesta, evaluación del impacto, aprobación, implementación y verificación de la eficacia. Esa evaluación alimenta la clasificación regulatoria del cambio y el trámite que corresponda ante el Invima.';
    v_j1 := $evmodif_json${"external_id":"modif-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Control de cambios en el sistema de calidad farmacéutico (ICH Q10)","outcome":"Control de cambios en el sistema de calidad farmacéutico (ICH Q10)","source":"ICH Q10."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Reemplaza por completo los trámites ante el Invima, porque el cambio queda documentado.', FALSE, 'No reemplaza los trámites regulatorios.', 0),
      (v_pregunta, 'Solo sirve para registrar los costos de cada cambio en la contabilidad de la empresa.', FALSE, 'Su propósito es la calidad, no la contabilidad.', 1),
      (v_pregunta, 'Solo se usa en las empresas que exportan a Europa, porque ICH no aplica en Colombia.', FALSE, 'Es una buena práctica aplicable a cualquier empresa.', 2),
      (v_pregunta, 'Evalúa, aprueba e implementa cada cambio y alimenta su clasificación regulatoria.', TRUE, 'Correcto. Es el punto de partida del trámite.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una empresa quiere acordar con la autoridad, por adelantado, cómo presentará un cambio futuro de su proceso. ¿Qué herramienta de ICH Q12 corresponde?';
    v_t4 := 'ICH Q12 introduce las condiciones establecidas (elementos del expediente cuyo cambio debe comunicarse a la autoridad), el protocolo de gestión de cambios post-aprobación (PACMP), que acuerda por adelantado la evidencia de un cambio futuro, y el documento de gestión del ciclo de vida (PLCM).';
    v_j1 := $evmodif_json${"external_id":"modif-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"ICH Q12: condiciones establecidas, PACMP y PLCM","outcome":"ICH Q12: condiciones establecidas, PACMP y PLCM","source":"ICH Q12."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un protocolo de gestión de cambios post-aprobación (PACMP).', TRUE, 'Correcto. Se acuerda el plan y la evidencia del cambio futuro.', 0),
      (v_pregunta, 'Un certificado de producto farmacéutico emitido por la autoridad del país de origen.', FALSE, 'No es una herramienta de ICH Q12 para cambios.', 1),
      (v_pregunta, 'Una notificación de novedad radicada un año después de implementar el cambio.', FALSE, 'Es una vía de trámite colombiana, no una herramienta de ICH Q12.', 2),
      (v_pregunta, 'Un estudio de bioequivalencia con el medicamento de referencia del mercado.', FALSE, 'No es la herramienta para planear cambios.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un consultor propone usar ya las rutas de modificación de un proyecto de reforma publicado para comentarios en 2026. ¿Qué análisis es correcto?';
    v_t4 := 'Un proyecto de decreto publicado para comentarios no es norma vigente. Las modificaciones se tramitan con el Decreto 334 de 2022 y sus modificaciones; el proyecto sirve para preparar los procesos y se cita como proyecto.';
    v_j1 := $evmodif_json${"external_id":"modif-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Tendencias: reliance, plan de contingencia 2026 y proyecto de reforma del Capítulo III","outcome":"Tendencias: reliance, plan de contingencia 2026 y proyecto de reforma del Capítulo III","source":"Principio de vigencia de las normas; normograma del Invima."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Pueden usarse de inmediato, porque los proyectos publicados tienen la misma fuerza que los decretos.', FALSE, 'Un proyecto no tiene fuerza obligatoria.', 0),
      (v_pregunta, 'Rige la norma vigente; el proyecto sirve para prepararse, pero no se aplica hasta que se expida.', TRUE, 'Correcto. Y se cita siempre como proyecto.', 1),
      (v_pregunta, 'Pueden usarse si el Invima no responde en un mes a la solicitud del titular.', FALSE, 'El silencio no da vigencia a un proyecto.', 2),
      (v_pregunta, 'Deben usarse porque la norma vigente quedó derogada al publicarse el proyecto.', FALSE, 'Publicar un proyecto no deroga la norma.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Tras adquirir un producto, una empresa tiene siete cambios pendientes y propone radicarlos uno por uno «para no complicarse». ¿Cuál es la mejor valoración?';
    v_t4 := 'Un plan de cambios post-aprobación parte del control de cambios interno, clasifica cada cambio, agrupa según las reglas del artículo 8 del Decreto 334 de 2022 (notificaciones entre sí, automáticas entre sí, moderados y mayores en un radicado con el plazo del mayor) y secuencia los trámites por riesgo, plazo y tarifa.';
    v_j1 := $evmodif_json${"external_id":"modif-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso integrador: plan de cambios post-adquisición de un producto","outcome":"Caso integrador: plan de cambios post-adquisición de un producto","source":"Decreto 334 de 2022, art. 8; ICH Q10 e ICH Q12."}$evmodif_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'modif-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es la mejor opción, porque la norma no permite agrupar ningún tipo de modificación.', FALSE, 'La norma permite agrupar según la vía.', 0),
      (v_pregunta, 'Es la mejor opción si se radican todos el mismo día, aunque sean trámites separados.', FALSE, 'Radicar el mismo día no es agrupar.', 1),
      (v_pregunta, 'Conviene planear: clasificar, agrupar según las reglas del artículo 8 y secuenciar por riesgo y plazo.', TRUE, 'Correcto. Se optimizan tiempos y tarifas.', 2),
      (v_pregunta, 'Conviene esperar a tener veinte cambios para radicarlos todos juntos en un año.', FALSE, 'Retrasar cambios puede ser un riesgo y un incumplimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad modif-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo de las modificaciones al registro sanitario' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo de las modificaciones al registro sanitario) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Clasificación de un paquete de cambios';
  v_t2 := $evmodif_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Para cada cambio, identifica qué información del registro cambia y qué atributo afecta.</li><li>Clasifica cada cambio por familia (art. 5) y, en calidad, por nivel de riesgo (consulta la guía del Invima).</li><li>Asigna la vía y el plazo del artículo 8 a cada cambio.</li><li>Define qué cambios pueden agruparse y en cuántos radicados.</li><li>Prioriza los trámites y justifica el orden.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar cada cambio por familia y nivel de riesgo.</li><li>Definir la vía, el plazo y la agrupación de los trámites.</li><li>Priorizar los cambios según su impacto.</li></ul>
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
  <tr><td>Clasificación</td><td>35 %</td><td>Familia y nivel correctos para los seis cambios, con el artículo 5.</td><td>Clasificación con uno o dos errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vía y plazo</td><td>25 %</td><td>Vía y plazo del artículo 8 correctos para cada cambio.</td><td>Vías correctas con plazos imprecisos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Agrupación</td><td>20 %</td><td>Agrupa según las reglas del artículo 8 y su parágrafo.</td><td>Agrupación con un error.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Priorización</td><td>10 %</td><td>Prioriza la contraindicación por seguridad y justifica el resto.</td><td>Orden sin justificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evmodif_html$;
  v_t3 := $evmodif_html$<h2>Caso de estudio</h2>
<p>Laboratorios Cumbre (ficticio) recibe del control de cambios interno seis cambios de un medicamento de síntesis química (datos simulados): (1) cambio de la dirección comercial del titular; (2) ajuste menor de un parámetro de mezcla dentro del rango validado; (3) cambio del proveedor del material de envase primario; (4) adición de un fabricante alterno del producto terminado; (5) nueva contraindicación en el inserto por una alerta internacional; (6) nueva indicación aprobada en otros países.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evmodif_html$;
  v_t4 := 'Matriz de clasificación de cambios con plan de radicación.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evmodif_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 334 de 2022 (arts. 5 y 8), modificado por el Decreto 1474 de 2023; Decreto 677 de 1995; guías de modificaciones del Invima por tipo de producto; ICH Q10 e ICH Q12; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evmodif_html$;
  v_t7 := NULL;
  v_j1 := $evmodif_json$["Atributo afectado.","Familia y nivel.","Vía y plazo.","Agrupación.","Priorización."]$evmodif_json$::jsonb;
  v_j2 := $evmodif_json${"version":1,"total":100,"criteria":[{"id":"clasificacion","name":"Clasificación","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Familia y nivel correctos para los seis cambios, con el artículo 5."},{"level":3,"label":"Logrado","description":"Clasificación con uno o dos errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"via-y-plazo","name":"Vía y plazo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Vía y plazo del artículo 8 correctos para cada cambio."},{"level":3,"label":"Logrado","description":"Vías correctas con plazos imprecisos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"agrupacion","name":"Agrupación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Agrupa según las reglas del artículo 8 y su parágrafo."},{"level":3,"label":"Logrado","description":"Agrupación con un error."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"priorizacion","name":"Priorización","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Prioriza la contraindicación por seguridad y justifica el resto."},{"level":3,"label":"Logrado","description":"Orden sin justificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evmodif_json$::jsonb;
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


  -- ── Actividad modif-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Modificaciones administrativo-legales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Modificaciones administrativo-legales) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Cesión de titularidad con inclusión de importador';
  v_t2 := $evmodif_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Clasifica cada cambio (cesión, inclusión de importador, razón social del fabricante).</li><li>Define la vía y el plazo de cada uno con el artículo 8 y la guía del Invima.</li><li>Define cómo agruparías los trámites y qué soportes necesitas.</li><li>Analiza qué obligaciones asume el nuevo titular y el nuevo importador.</li><li>Propone cómo gestionar las 5.000 cajas con los datos anteriores y la actualización de etiquetas.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar los cambios administrativo-legales del caso.</li><li>Planear la radicación y la agrupación de los trámites.</li><li>Gestionar el producto que ya está en el mercado.</li></ul>
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
  <tr><td>Clasificación y vía</td><td>30 %</td><td>Clasifica los tres cambios como administrativo-legales y asigna vía y plazo.</td><td>Clasificación con un error.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Agrupación y soportes</td><td>25 %</td><td>Agrupa según la norma y lista soportes razonables.</td><td>Agrupación sin soportes.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Obligaciones</td><td>25 %</td><td>Explica las responsabilidades del nuevo titular y del importador.</td><td>Explicación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Producto en el mercado</td><td>10 %</td><td>Propone un manejo razonable de existencias y etiquetas según la guía.</td><td>Propuesta vaga.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evmodif_html$;
  v_t3 := $evmodif_html$<h2>Caso de estudio</h2>
<p>Distribuciones Andinas S. A. S. (ficticia) compró a otra empresa el registro de un medicamento importado de México (datos simulados). Quiere ser el nuevo titular e incluir como importador a una empresa de Cartagena. Además, el fabricante mexicano cambió su razón social sin cambiar de planta. Hay 5.000 cajas en el mercado con los datos del titular anterior.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evmodif_html$;
  v_t4 := 'Plan de radicación con soportes y gestión de etiquetas.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evmodif_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 334 de 2022 (arts. 5 y 8), modificado por el Decreto 1474 de 2023; Decreto 677 de 1995; guías de modificaciones del Invima por tipo de producto; ICH Q10 e ICH Q12; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evmodif_html$;
  v_t7 := NULL;
  v_j1 := $evmodif_json$["Clasificación.","Vía y plazo.","Agrupación y soportes.","Obligaciones.","Producto en el mercado."]$evmodif_json$::jsonb;
  v_j2 := $evmodif_json${"version":1,"total":100,"criteria":[{"id":"clasificacion-y-via","name":"Clasificación y vía","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Clasifica los tres cambios como administrativo-legales y asigna vía y plazo."},{"level":3,"label":"Logrado","description":"Clasificación con un error."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"agrupacion-y-soportes","name":"Agrupación y soportes","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Agrupa según la norma y lista soportes razonables."},{"level":3,"label":"Logrado","description":"Agrupación sin soportes."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"obligaciones","name":"Obligaciones","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica las responsabilidades del nuevo titular y del importador."},{"level":3,"label":"Logrado","description":"Explicación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"producto-en-el-mercado","name":"Producto en el mercado","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Propone un manejo razonable de existencias y etiquetas según la guía."},{"level":3,"label":"Logrado","description":"Propuesta vaga."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evmodif_json$::jsonb;
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


  -- ── Actividad modif-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Modificaciones de seguridad y eficacia (farmacológicas) y modificaciones de biológicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Modificaciones de seguridad y eficacia (farmacológicas) y modificaciones de biológicos) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Gestión de un cambio urgente de seguridad';
  v_t2 := $evmodif_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Analiza si el cambio es urgente de seguridad o de etiquetado y justifica.</li><li>Describe la vía del artículo 8 y los plazos que aplican.</li><li>Define el texto que propondrías para el inserto (advertencia y recomendación).</li><li>Planea la comunicación a profesionales mientras se actualiza el inserto.</li><li>Decide qué hacer con las unidades en el mercado y los insertos impresos.</li><li>Define la gestión de farmacovigilancia relacionada.</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar el cambio y elegir la vía del Decreto 334 de 2022.</li><li>Planear la implementación y la radicación.</li><li>Gestionar la comunicación y el inventario.</li></ul>
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
  <tr><td>Clasificación y vía</td><td>35 %</td><td>Clasifica como urgente de seguridad y describe el acuerdo previo y la radicación en un mes.</td><td>Clasifica sin describir la vía.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Texto y comunicación</td><td>30 %</td><td>Texto claro de la advertencia y plan de comunicación a profesionales.</td><td>Texto o comunicación incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Inventario y farmacovigilancia</td><td>25 %</td><td>Decisión fundamentada sobre unidades e insertos, y gestión de la señal.</td><td>Decisión sin fundamento.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evmodif_html$;
  v_t3 := $evmodif_html$<h2>Caso de estudio</h2>
<p>Farmacéutica Litoral (ficticia) recibe una alerta de una agencia internacional: su medicamento puede causar una reacción cutánea grave en pacientes con un alelo genético frecuente en ciertas poblaciones (datos simulados). El inserto colombiano no menciona este riesgo. La empresa tiene 30.000 unidades en el mercado y 50.000 insertos impresos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evmodif_html$;
  v_t4 := 'Plan de gestión del cambio urgente de seguridad.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evmodif_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 334 de 2022 (arts. 5 y 8), modificado por el Decreto 1474 de 2023; Decreto 677 de 1995; guías de modificaciones del Invima por tipo de producto; ICH Q10 e ICH Q12; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evmodif_html$;
  v_t7 := NULL;
  v_j1 := $evmodif_json$["Clasificación.","Vía y plazos.","Texto propuesto.","Comunicación.","Inventario y farmacovigilancia."]$evmodif_json$::jsonb;
  v_j2 := $evmodif_json${"version":1,"total":100,"criteria":[{"id":"clasificacion-y-via","name":"Clasificación y vía","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Clasifica como urgente de seguridad y describe el acuerdo previo y la radicación en un mes."},{"level":3,"label":"Logrado","description":"Clasifica sin describir la vía."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"texto-y-comunicacion","name":"Texto y comunicación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Texto claro de la advertencia y plan de comunicación a profesionales."},{"level":3,"label":"Logrado","description":"Texto o comunicación incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"inventario-y-farmacovigilancia","name":"Inventario y farmacovigilancia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Decisión fundamentada sobre unidades e insertos, y gestión de la señal."},{"level":3,"label":"Logrado","description":"Decisión sin fundamento."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evmodif_json$::jsonb;
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


  -- ── Actividad modif-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Modificaciones de calidad (farmacéuticas) en medicamentos de síntesis química' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Modificaciones de calidad (farmacéuticas) en medicamentos de síntesis química) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: clasificación y trámites administrativo-legales y de calidad del producto adquirido';
  v_t2 := $evmodif_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y clasifica los siete cambios por familia y nivel (art. 5 y guías del Invima).</li><li>Fase 2: planea el cambio de titular y la inclusión del importador, con vía, plazo y soportes.</li><li>Fase 3: clasifica y planea los cambios de calidad (fabricante alterno, envase, vida útil, presentación), con su evidencia.</li><li>Fase 3: identifica qué cambios de calidad pueden agruparse y con qué plazo.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Clasificación de los siete cambios por familia y nivel.</li>
  <li><strong>Fase 2 · Unidad 2 (administrativo-legales).</strong> Cambio de titular e inclusión de importador.</li>
  <li><strong>Fase 3 · Unidad 3 (calidad).</strong> Fabricante alterno, envase, vida útil y presentación.</li>
  <li><strong>Fase 4 · Unidad 4 (seguridad y eficacia).</strong> Nueva interacción en el inserto.</li>
  <li><strong>Fase 5 · Unidad 5 (gestión estratégica).</strong> Agrupación, secuencia, presupuesto y control de cambios.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar un paquete de cambios post-adquisición.</li><li>Planear los trámites administrativo-legales y de calidad con sus soportes.</li></ul>
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
  <tr><td>Clasificación</td><td>30 %</td><td>Clasificación correcta de los siete cambios con el artículo 5.</td><td>Clasificación con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Administrativo-legales</td><td>20 %</td><td>Vía, plazo y soportes correctos.</td><td>Plan parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Calidad</td><td>40 %</td><td>Nivel, vía, plazo, evidencia y agrupación correctos para los cambios de calidad.</td><td>Plan de calidad incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evmodif_html$;
  v_t3 := $evmodif_html$<h2>Caso de estudio</h2>
<p>Laboratorios Altiplano S. A. S. (ficticia) compró a otra empresa un medicamento de síntesis química importado de la India y quiere hacerle siete cambios en el primer año (datos simulados): cambio de titular; inclusión de un importador; nuevo fabricante alterno del producto terminado en Colombia; cambio del envase primario; ampliación de la vida útil de 24 a 36 meses; inclusión de una nueva interacción en el inserto; y una nueva presentación comercial. Te contratan para diseñar la estrategia regulatoria. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evmodif_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evmodif_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 334 de 2022 (arts. 5 y 8), modificado por el Decreto 1474 de 2023; Decreto 677 de 1995; guías de modificaciones del Invima por tipo de producto; ICH Q10 e ICH Q12; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evmodif_html$;
  v_t7 := NULL;
  v_j1 := $evmodif_json$["Clasificación.","Administrativo-legales.","Calidad y evidencia.","Agrupación."]$evmodif_json$::jsonb;
  v_j2 := $evmodif_json${"version":1,"total":100,"criteria":[{"id":"clasificacion","name":"Clasificación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Clasificación correcta de los siete cambios con el artículo 5."},{"level":3,"label":"Logrado","description":"Clasificación con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"administrativo-legales","name":"Administrativo-legales","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Vía, plazo y soportes correctos."},{"level":3,"label":"Logrado","description":"Plan parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"calidad","name":"Calidad","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Nivel, vía, plazo, evidencia y agrupación correctos para los cambios de calidad."},{"level":3,"label":"Logrado","description":"Plan de calidad incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evmodif_json$::jsonb;
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


  -- ── Actividad modif-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Gestión estratégica del ciclo de vida: control de cambios, unificación de trámites y tarifas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Gestión estratégica del ciclo de vida: control de cambios, unificación de trámites y tarifas) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: estrategia regulatoria completa del producto adquirido';
  v_t2 := $evmodif_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: define la vía de la nueva interacción y si podría ser urgente de seguridad.</li><li>Fase 5: diseña la secuencia de radicación con un cronograma mensual y los riesgos de requerimiento.</li><li>Fase 5: presupuesta los trámites con la resolución tarifaria vigente del Invima.</li><li>Fase 5: diseña el flujo de control de cambios interno conectado con asuntos regulatorios.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube la estrategia en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Clasificación de los siete cambios por familia y nivel.</li>
  <li><strong>Fase 2 · Unidad 2 (administrativo-legales).</strong> Cambio de titular e inclusión de importador.</li>
  <li><strong>Fase 3 · Unidad 3 (calidad).</strong> Fabricante alterno, envase, vida útil y presentación.</li>
  <li><strong>Fase 4 · Unidad 4 (seguridad y eficacia).</strong> Nueva interacción en el inserto.</li>
  <li><strong>Fase 5 · Unidad 5 (gestión estratégica).</strong> Agrupación, secuencia, presupuesto y control de cambios.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Planear el cambio de seguridad del inserto.</li><li>Diseñar la secuencia, la agrupación, el presupuesto y el control de cambios.</li></ul>
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
  <tr><td>Seguridad</td><td>20 %</td><td>Vía correcta (etiquetado o urgente) con justificación.</td><td>Vía sin justificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Secuencia y presupuesto</td><td>35 %</td><td>Cronograma con plazos del artículo 8, riesgo de requerimiento y presupuesto con fuente.</td><td>Cronograma optimista o sin presupuesto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Control de cambios</td><td>20 %</td><td>Flujo conectado con ICH Q10 y uso de herramientas de ICH Q12.</td><td>Flujo general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evmodif_html$;
  v_t3 := $evmodif_html$<h2>Caso de estudio</h2>
<p>Laboratorios Altiplano S. A. S. (ficticia) compró a otra empresa un medicamento de síntesis química importado de la India y quiere hacerle siete cambios en el primer año (datos simulados): cambio de titular; inclusión de un importador; nuevo fabricante alterno del producto terminado en Colombia; cambio del envase primario; ampliación de la vida útil de 24 a 36 meses; inclusión de una nueva interacción en el inserto; y una nueva presentación comercial. Te contratan para diseñar la estrategia regulatoria. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en la estrategia que presentarás a la gerencia.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evmodif_html$;
  v_t4 := 'Estrategia regulatoria con cronograma, presupuesto y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evmodif_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 334 de 2022 (arts. 5 y 8), modificado por el Decreto 1474 de 2023; Decreto 677 de 1995; guías de modificaciones del Invima por tipo de producto; ICH Q10 e ICH Q12; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evmodif_html$;
  v_t7 := NULL;
  v_j1 := $evmodif_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Cambio de seguridad.","Secuencia y cronograma.","Presupuesto.","Control de cambios y resumen."]$evmodif_json$::jsonb;
  v_j2 := $evmodif_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguridad","name":"Seguridad","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Vía correcta (etiquetado o urgente) con justificación."},{"level":3,"label":"Logrado","description":"Vía sin justificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"secuencia-y-presupuesto","name":"Secuencia y presupuesto","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cronograma con plazos del artículo 8, riesgo de requerimiento y presupuesto con fuente."},{"level":3,"label":"Logrado","description":"Cronograma optimista o sin presupuesto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"control-de-cambios","name":"Control de cambios","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Flujo conectado con ICH Q10 y uso de herramientas de ICH Q12."},{"level":3,"label":"Logrado","description":"Flujo general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evmodif_json$::jsonb;
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


  -- ── Foro modif-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con modificaciones';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evmodif_html$<h2>Para empezar</h2>
<p>Piensa en un cambio a un registro sanitario que hayas gestionado o conocido y cuéntanos en tres o cuatro líneas qué pasó, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evmodif_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre modificaciones te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evmodif_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evmodif_html$;
  v_t6 := $evmodif_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evmodif_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué tipo de cambio te parece más difícil de clasificar?', '¿Has respondido algún requerimiento del Invima sobre una modificación?']::text[];
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


  -- ── Foro modif-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos y marco normativo de las modificaciones al registro sanitario' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos y marco normativo de las modificaciones al registro sanitario) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Qué familia es este cambio?';
  v_t2 := 'Argumentar cómo clasificar un cambio antes de elegir el trámite.';
  v_t3 := $evmodif_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio tiene en la misma semana cinco cambios (datos simulados): actualizar el código QR del empaque, ampliar la vida útil de 24 a 36 meses, incluir una nueva reacción adversa en el inserto, cambiar la razón social del titular y agregar un fabricante alterno del producto terminado.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evmodif_html$;
  v_t4 := '¿A qué familia y nivel corresponde cada cambio, y cuántos trámites radicarías?';
  v_t5 := $evmodif_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo y el numeral del Decreto 334 de 2022 que sustentan cada clasificación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evmodif_html$;
  v_t6 := $evmodif_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo y el numeral del Decreto 334 de 2022 que sustentan cada clasificación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evmodif_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué pregunta debe hacerse antes de elegir el formulario?', '¿Qué cambios pueden agruparse y cuáles no?', '¿Qué cambio implementarías primero y por qué?']::text[];
  v_j1 := $evmodif_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo y el numeral del Decreto 334 de 2022 que sustentan cada clasificación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evmodif_json$::jsonb;
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


  -- ── Foro modif-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Modificaciones administrativo-legales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Modificaciones administrativo-legales) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Cambios administrativos que esconden cambios de calidad';
  v_t2 := 'Argumentar cómo detectar cuándo un cambio aparentemente administrativo afecta la calidad.';
  v_t3 := $evmodif_html$<h2>Caso del foro</h2>
<p>Un analista ficticio clasificó como administrativo-legales tres cambios (datos simulados): el fabricante cambió de razón social y además se trasladó a otra ciudad; se incluyó un nuevo importador que almacenará el producto en una bodega sin control de temperatura; y se cambió el nombre comercial del medicamento.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evmodif_html$;
  v_t4 := '¿Cuáles de esos cambios son realmente administrativo-legales y cuáles tienen impacto en la calidad?';
  v_t5 := $evmodif_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada clasificación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evmodif_html$;
  v_t6 := $evmodif_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada clasificación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evmodif_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué diferencia un cambio de nombre de un cambio de sitio?', '¿Qué responsabilidades asume un nuevo importador?', '¿Qué riesgos tiene clasificar mal un cambio?']::text[];
  v_j1 := $evmodif_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada clasificación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evmodif_json$::jsonb;
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


  -- ── Foro modif-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Modificaciones de calidad (farmacéuticas) en medicamentos de síntesis química' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Modificaciones de calidad (farmacéuticas) en medicamentos de síntesis química) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · ¿Agrupar o separar los cambios?';
  v_t2 := 'Argumentar cuándo conviene agrupar modificaciones y cuándo separarlas.';
  v_t3 := $evmodif_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio tiene cuatro cambios de calidad del mismo producto (datos simulados): dos de riesgo menor, uno moderado (cambio de envase secundario) y uno mayor (nuevo fabricante). La gerencia quiere agrupar todo «para pagar menos»; el área técnica teme que el cambio mayor retrase los demás.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evmodif_html$;
  v_t4 := '¿Qué estrategia de agrupación propondrías y por qué?';
  v_t5 := $evmodif_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo y el parágrafo que sustentan tu estrategia. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evmodif_html$;
  v_t6 := $evmodif_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo y el parágrafo que sustentan tu estrategia.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evmodif_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué reglas de agrupación prevé el artículo 8 y su parágrafo?', '¿Qué plazo aplica a un grupo con un cambio mayor?', '¿Qué riesgo tiene que un requerimiento sobre un cambio frene a los demás?']::text[];
  v_j1 := $evmodif_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo y el parágrafo que sustentan tu estrategia."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evmodif_json$::jsonb;
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


  -- ── Foro modif-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Modificaciones de seguridad y eficacia (farmacológicas) y modificaciones de biológicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Modificaciones de seguridad y eficacia (farmacológicas) y modificaciones de biológicos) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Señal de seguridad: ¿esperar la aprobación?';
  v_t2 := 'Argumentar cómo equilibrar la protección de los pacientes con el trámite regulatorio ante una señal de seguridad.';
  v_t3 := $evmodif_html$<h2>Caso del foro</h2>
<p>Una agencia internacional comunica un riesgo grave de un principio activo que un laboratorio ficticio comercializa en Colombia (datos simulados). El área comercial quiere «esperar el trámite normal» para no cambiar los empaques en inventario; el área de farmacovigilancia quiere actuar ya.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evmodif_html$;
  v_t4 := '¿Qué vía de trámite propondrías y qué haría la empresa mientras tanto?';
  v_t5 := $evmodif_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el numeral del artículo 8 y la norma de farmacovigilancia que sustentan tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evmodif_html$;
  v_t6 := $evmodif_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el numeral del artículo 8 y la norma de farmacovigilancia que sustentan tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evmodif_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué diferencia un cambio urgente de seguridad de un cambio de etiquetado?', '¿Cómo se comunica el riesgo a los profesionales mientras se actualiza el inserto?', '¿Qué responsabilidades tiene el titular en farmacovigilancia?']::text[];
  v_j1 := $evmodif_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el numeral del artículo 8 y la norma de farmacovigilancia que sustentan tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evmodif_json$::jsonb;
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


  -- ── Foro modif-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Gestión estratégica del ciclo de vida: control de cambios, unificación de trámites y tarifas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Gestión estratégica del ciclo de vida: control de cambios, unificación de trámites y tarifas) en Modificaciones al Registro Sanitario: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Control de cambios interno y regulatorio';
  v_t2 := 'Argumentar cómo conectar el control de cambios del sistema de calidad con la clasificación regulatoria.';
  v_t3 := $evmodif_html$<h2>Caso del foro</h2>
<p>En un laboratorio ficticio, producción implementa cambios aprobados por su comité interno sin consultar a asuntos regulatorios (datos simulados). En una auditoría se descubren cambios de proveedor y de proceso que debían notificarse o aprobarse ante el Invima.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evmodif_html$;
  v_t4 := '¿Cómo rediseñarías el flujo para que ningún cambio con impacto regulatorio se implemente sin el trámite correspondiente?';
  v_t5 := $evmodif_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta tu rediseño. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evmodif_html$;
  v_t6 := $evmodif_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta tu rediseño.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evmodif_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿En qué etapa del control de cambios debe intervenir asuntos regulatorios?', '¿Qué herramientas de ICH Q12 ayudan a planear cambios futuros?', '¿Qué hacer con los cambios ya implementados sin trámite?']::text[];
  v_j1 := $evmodif_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta tu rediseño."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evmodif_json$::jsonb;
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


  RAISE NOTICE 'Modificaciones al Registro Sanitario: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evmodif$;

-- ============================================================
--  104_quices_actividades_foros_regulatorios5.sql — quizzes, actividades y foros, lote «regulatorios5»
--
--  Generado por scripts/evaluacion-aula.mjs regulatorios5 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Bioequivalencia y Requisitos Regulatorios en Colombia; Gestión Documental de Trámites ante el INVIMA.
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
--  Curso de Bioequivalencia y Requisitos Regulatorios en Colombia
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evbioeq$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Bioequivalencia y Requisitos Regulatorios en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad', 'Unidad 2. Marco regulatorio colombiano de BD/BE', 'Unidad 3. Referentes internacionales y diseño de estudios de BE', 'Unidad 4. Bioexenciones y perfiles de disolución', 'Unidad 5. Presentación de estudios al INVIMA y requerimientos']::text[])) < 5 THEN
    RAISE NOTICE 'Bioequivalencia y Requisitos Regulatorios en Colombia: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evbioeq_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evbioeq_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz bioeq-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad';
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


    v_t3 := '¿Qué significa que dos productos sean bioequivalentes?';
    v_t4 := 'Dos equivalentes farmacéuticos son bioequivalentes cuando su biodisponibilidad (velocidad y magnitud de absorción) después de la misma dosis molar es tan similar que sus efectos serán esencialmente los mismos. Se evalúa con el AUC (magnitud) y la Cmax (velocidad).';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Biodisponibilidad y bioequivalencia: definiciones y bases farmacocinéticas","outcome":"Biodisponibilidad y bioequivalencia: definiciones y bases farmacocinéticas","source":"OMS TRS 1003, anexo 6; Resolución 1124 de 2016, anexo técnico 1."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que tienen el mismo precio de venta y la misma presentación comercial en el mercado.', FALSE, 'El precio no define la bioequivalencia.', 0),
      (v_pregunta, 'Que tienen exactamente los mismos excipientes y el mismo proceso de fabricación.', FALSE, 'Pueden tener excipientes distintos.', 1),
      (v_pregunta, 'Que no hay diferencias significativas en la velocidad y magnitud de absorción.', TRUE, 'Correcto. Se demuestra con AUC y Cmax.', 2),
      (v_pregunta, 'Que tienen la misma marca y el mismo laboratorio fabricante.', FALSE, 'La bioequivalencia compara productos distintos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Según la Resolución 1124 de 2016, ¿qué productos deben presentar estudios de bioequivalencia?';
    v_t4 := 'El artículo 2 de la Resolución 1124 de 2016 (modificado por la Resolución 662 de 2022) aplica a los medicamentos de síntesis química con principios activos o formas farmacéuticas del anexo técnico 2, en registro nuevo, renovación y modificaciones que puedan afectar su comportamiento farmacocinético. El parágrafo 2 excluye los biológicos.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Medicamento de referencia y comparador: cómo se define y dónde se consulta","outcome":"Medicamento de referencia y comparador: cómo se define y dónde se consulta","source":"Resolución 1124 de 2016, art. 2."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Todos los medicamentos, incluidos los biológicos y las vacunas, sin excepción.', FALSE, 'Los biológicos están excluidos.', 0),
      (v_pregunta, 'Los de síntesis química con principios activos o formas del anexo técnico 2.', TRUE, 'Correcto. En registro, renovación o modificaciones que afecten la farmacocinética.', 1),
      (v_pregunta, 'Solo los medicamentos importados de países que no son agencias de referencia.', FALSE, 'El criterio es el listado, no el origen.', 2),
      (v_pregunta, 'Solo los medicamentos de venta libre con más de cinco años en el mercado.', FALSE, 'No es el criterio de la norma.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué diferencia hay entre equivalentes farmacéuticos y equivalentes terapéuticos?';
    v_t4 := 'Los equivalentes farmacéuticos contienen la misma cantidad del mismo principio activo en la misma forma farmacéutica y vía. Son equivalentes terapéuticos cuando, además, se espera el mismo efecto y seguridad, lo que en general se demuestra con bioequivalencia. Un multifuente es intercambiable cuando es equivalente terapéutico del de referencia.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Equivalencia farmacéutica, equivalencia terapéutica e intercambiabilidad","outcome":"Equivalencia farmacéutica, equivalencia terapéutica e intercambiabilidad","source":"OMS TRS 1003, anexo 6."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Igual principio activo, dosis y forma; son terapéuticos si además se demuestra, por ejemplo, la BE.', TRUE, 'Correcto. Ahí se basa la intercambiabilidad.', 0),
      (v_pregunta, 'No hay diferencia: ambos términos significan que los productos tienen el mismo precio.', FALSE, 'Son conceptos distintos.', 1),
      (v_pregunta, 'Los equivalentes terapéuticos tienen distinto principio activo, pero la misma indicación clínica aprobada.', FALSE, 'Eso describe alternativas terapéuticas.', 2),
      (v_pregunta, 'Los equivalentes farmacéuticos son siempre intercambiables, sin necesidad de otra prueba.', FALSE, 'Se necesita demostrar la equivalencia terapéutica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para un estudio que se presentará al Invima, un patrocinador propone usar como comparador el genérico más vendido del país. ¿Cuál es la mejor valoración?';
    v_t4 := 'El anexo técnico 2 de la Resolución 1124 de 2016 lista los medicamentos que deben presentar bioequivalencia con sus comparadores de referencia; por regla general es el innovador. Un comparador distinto puede invalidar el estudio.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: selección y soporte documental del comparador","outcome":"Caso: selección y soporte documental del comparador","source":"Resolución 1124 de 2016, arts. 2 y 12, anexo técnico 2."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuado, porque el producto más vendido es el que más usan los pacientes en la práctica diaria.', FALSE, 'Las ventas no definen el comparador.', 0),
      (v_pregunta, 'Es adecuado si el genérico ya tiene registro sanitario vigente en Colombia.', FALSE, 'El registro no lo convierte en referencia.', 1),
      (v_pregunta, 'Es indiferente, porque el Invima acepta cualquier comparador con registro.', FALSE, 'El comparador está definido.', 2),
      (v_pregunta, 'No: se usa el producto de referencia del listado del Invima, con su soporte documental.', TRUE, 'Correcto. Un comparador errado invalida el estudio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bioeq-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Marco regulatorio colombiano de BD/BE' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Marco regulatorio colombiano de BD/BE) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Marco regulatorio colombiano de BD/BE';
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


    v_t3 := '¿Qué contiene el anexo técnico 3 de la Resolución 1124 de 2016?';
    v_t4 := 'La Resolución 1124 de 2016 adopta tres anexos: el 1, guía de BD y BE; el 2, listado de medicamentos que deben presentar estudios y sus comparadores; y el 3, requisitos para la certificación de instituciones en buenas prácticas de BD/BE (art. 13).';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Resolución 1124 de 2016: estructura, alcance y anexos técnicos","outcome":"Resolución 1124 de 2016: estructura, alcance y anexos técnicos","source":"Resolución 1124 de 2016, arts. 4 y 13."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El listado de medicamentos que deben presentar estudios de bioequivalencia con sus comparadores.', FALSE, 'Ese es el anexo técnico 2.', 0),
      (v_pregunta, 'Los requisitos para certificar instituciones en buenas prácticas de BD/BE.', TRUE, 'Correcto. Según el artículo 13.', 1),
      (v_pregunta, 'La guía de biodisponibilidad y bioequivalencia de productos farmacéuticos.', FALSE, 'Ese es el anexo técnico 1.', 2),
      (v_pregunta, 'Las tarifas del Invima para evaluar estudios de bioequivalencia.', FALSE, 'Las tarifas no están en esta resolución.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un centro de BD/BE obtuvo su certificado del Invima. ¿Cuál es su vigencia y cuándo debe pedir la renovación?';
    v_t4 := 'El certificado en buenas prácticas de BD/BE tiene una vigencia de tres años desde la ejecutoria del acto que lo concede (art. 13 par. 1) y su renovación se solicita con al menos tres meses de anterioridad al vencimiento (art. 14).';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Certificación en Buenas Prácticas de BD/BE de centros clínicos y analíticos","outcome":"Certificación en Buenas Prácticas de BD/BE de centros clínicos y analíticos","source":"Resolución 1124 de 2016, arts. 13 y 14."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tres años desde la ejecutoria; la renovación se pide al menos tres meses antes.', TRUE, 'Correcto. Arts. 13 y 14.', 0),
      (v_pregunta, 'Un año desde la visita, con renovación automática si no hay quejas.', FALSE, 'No es la vigencia de la norma.', 1),
      (v_pregunta, 'Indefinida, porque los centros ya certificados no necesitan renovar su certificado.', FALSE, 'La certificación tiene vigencia.', 2),
      (v_pregunta, 'Cinco años, con renovación el día siguiente al vencimiento.', FALSE, 'No es la vigencia ni el momento de la norma.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un patrocinador quiere hacer en Colombia un estudio in vivo de BE. ¿Qué análisis es correcto según el artículo 6 modificado por la Resolución 662 de 2022?';
    v_t4 := 'El artículo 6 de la Resolución 1124 de 2016, modificado por la Resolución 662 de 2022, dispone que todo estudio in vivo que se realice en Colombia sea aprobado por el Invima, con concepto previo del comité de ética; los cambios requieren autorización del comité y aprobación del Invima antes de implementarse.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Resolución 662 de 2022: qué cambió","outcome":"Resolución 662 de 2022: qué cambió","source":"Resolución 1124 de 2016, art. 6."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Puede iniciar sin aprobación, porque el Invima solo revisa el informe final.', FALSE, 'Se requiere aprobación previa.', 0),
      (v_pregunta, 'Requiere solo la aprobación del comité de ética de la institución investigadora y nada más.', FALSE, 'También se requiere la aprobación del Invima.', 1),
      (v_pregunta, 'Aprobación del Invima con concepto previo del comité de ética; los cambios también.', TRUE, 'Correcto. El Invima puede verificar el estudio.', 2),
      (v_pregunta, 'Requiere solo registrar el estudio en una base de datos internacional.', FALSE, 'El registro no reemplaza la aprobación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Al terminar un estudio de BE en Colombia, el patrocinador decide enviar los resultados al Invima «cuando radique el registro, dentro de un año». ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 8 de la Resolución 1124 de 2016 exige comunicar al Invima los resultados al terminar el estudio o al abandonarlo, en un plazo de 30 días calendario, firmados por el investigador. El patrocinador responde por la seguridad de los voluntarios (art. 9, Resolución 8430 de 1993).';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Resolución 2378 de 2008: Buenas Prácticas Clínicas","outcome":"Resolución 2378 de 2008: Buenas Prácticas Clínicas","source":"Resolución 1124 de 2016, arts. 8 y 9."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcto, porque los resultados solo se necesitan con la solicitud de registro.', FALSE, 'La norma fija un plazo de comunicación.', 0),
      (v_pregunta, 'Es correcto si el estudio salió favorable para el producto.', FALSE, 'La obligación no depende del resultado.', 1),
      (v_pregunta, 'Es incorrecto solo si el estudio fue abandonado antes de terminar.', FALSE, 'También aplica al terminar el estudio.', 2),
      (v_pregunta, 'Es incorrecto: los resultados se comunican al Invima en 30 días calendario al terminar o abandonar el estudio.', TRUE, 'Correcto. Firmados por el investigador.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bioeq-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Referentes internacionales y diseño de estudios de BE' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Referentes internacionales y diseño de estudios de BE) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Referentes internacionales y diseño de estudios de BE';
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


    v_t3 := '¿Cuál es el criterio de aceptación habitual de bioequivalencia para AUC y Cmax?';
    v_t4 := 'El criterio habitual es que el intervalo de confianza del 90 % de la razón de medias geométricas (prueba/referencia) de AUC y Cmax, con datos transformados a logaritmo, quede dentro de 80,00 % a 125,00 %.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Parámetros AUC y Cmax, intervalo de confianza 90 % y criterio 80–125 %","outcome":"Parámetros AUC y Cmax, intervalo de confianza 90 % y criterio 80–125 %","source":"OMS TRS 1003, anexo 6; ICH M13A."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que las medias aritméticas difieran menos del 20 %.', FALSE, 'Se usa la razón de medias geométricas con su intervalo.', 0),
      (v_pregunta, 'Que el valor p de la comparación sea mayor de 0,05.', FALSE, 'No se usa una prueba de diferencia simple.', 1),
      (v_pregunta, 'Que el intervalo de confianza del 90 % de la razón de medias geométricas esté entre 80,00 % y 125,00 %.', TRUE, 'Correcto. Con datos transformados a logaritmo.', 2),
      (v_pregunta, 'Que todos los voluntarios tengan concentraciones dentro del rango terapéutico.', FALSE, 'Es un criterio individual que no se usa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué diseño se usa como estándar en un estudio de BE de una forma sólida oral de liberación inmediata?';
    v_t4 := 'El diseño estándar es cruzado 2x2, aleatorizado, de dosis única, en voluntarios sanos, con un periodo de lavado suficiente (en general al menos cinco vidas medias) y un muestreo que caracterice Cmax y AUC.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Diseño cruzado 2x2, población, lavado y muestreo","outcome":"Diseño cruzado 2x2, población, lavado y muestreo","source":"OMS TRS 1003, anexo 6; ICH M13A."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Paralelo, con un grupo que recibe solo el producto de prueba durante varios meses.', FALSE, 'El estándar es cruzado.', 0),
      (v_pregunta, 'Cruzado 2x2 aleatorizado, dosis única, con lavado suficiente entre periodos.', TRUE, 'Correcto. En voluntarios sanos.', 1),
      (v_pregunta, 'Observacional, con datos de farmacia sobre los pacientes que ya usan el producto.', FALSE, 'Se requiere un estudio controlado.', 2),
      (v_pregunta, 'Abierto, sin aleatorización, con el mismo orden de administración para todos.', FALSE, 'Se aleatoriza la secuencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un fármaco tiene un coeficiente de variación intrasujeto de Cmax del 45 %. ¿Qué análisis es correcto?';
    v_t4 := 'Un fármaco es altamente variable cuando el CV intrasujeto de Cmax supera el 30 %. Con un diseño replicado, las guías permiten ampliar el intervalo de aceptación de Cmax según la variabilidad de la referencia, con un límite (por ejemplo, 69,84-143,19 % en la EMA) y una restricción de la razón puntual; el AUC mantiene 80-125 %.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Fármacos altamente variables y diseños replicados","outcome":"Fármacos altamente variables y diseños replicados","source":"Guía de BE de la EMA; OMS TRS 1003, anexo 6."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es altamente variable; con diseño replicado puede ampliarse el intervalo de Cmax, con límites.', TRUE, 'Correcto. El AUC mantiene 80-125 %.', 0),
      (v_pregunta, 'No requiere estudio, porque la variabilidad tan alta impide llegar a cualquier conclusión válida.', FALSE, 'Se estudia con diseño adecuado.', 1),
      (v_pregunta, 'Se amplía el intervalo de AUC y de Cmax sin ningún límite.', FALSE, 'La ampliación tiene límites y se aplica a Cmax.', 2),
      (v_pregunta, 'Se resuelve aumentando la dosis del producto de prueba.', FALSE, 'Cambiar la dosis invalida la comparación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para un fármaco de estrecho margen terapéutico, el informe concluye BE con un IC 90 % del AUC de 88-112 %. ¿Cuál es la mejor valoración?';
    v_t4 := 'Para fármacos de estrecho margen terapéutico se aplica un intervalo más estricto (90,00-111,11 % para AUC en la guía de la EMA). Un IC de 88-112 % no cumple. El Invima publica un listado de principios activos de estrecho margen.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Medicamentos de estrecho margen terapéutico","outcome":"Medicamentos de estrecho margen terapéutico","source":"Guía de BE de la EMA; listados del Invima."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es bioequivalente, porque el intervalo está dentro de 80-125 %.', FALSE, 'Para margen estrecho el criterio es más estricto.', 0),
      (v_pregunta, 'Es bioequivalente si el estudio tuvo más de 24 voluntarios.', FALSE, 'El número de sujetos no cambia el criterio.', 1),
      (v_pregunta, 'No es aplicable, porque los fármacos de margen estrecho no admiten genéricos.', FALSE, 'Sí admiten genéricos con criterios más estrictos.', 2),
      (v_pregunta, 'No cumple el criterio estrecho de 90,00-111,11 %, porque el límite inferior es 88 %.', TRUE, 'Correcto. Se consulta el listado de margen estrecho.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bioeq-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Bioexenciones y perfiles de disolución' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Bioexenciones y perfiles de disolución) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Bioexenciones y perfiles de disolución';
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


    v_t3 := 'Según ICH M9, ¿cuándo se considera de alta solubilidad un principio activo?';
    v_t4 := 'ICH M9 considera alta solubilidad cuando la dosis terapéutica más alta se disuelve en 250 mL o menos de medios acuosos en todo el rango de pH 1,2 a 6,8 a 37 °C. La alta permeabilidad corresponde a una absorción del 85 % o más.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"BCS: solubilidad, permeabilidad y las cuatro clases","outcome":"BCS: solubilidad, permeabilidad y las cuatro clases","source":"ICH M9."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Cuando se disuelve rápido en agua a temperatura ambiente, sin importar la dosis.', FALSE, 'Se considera la dosis más alta.', 0),
      (v_pregunta, 'Cuando la dosis terapéutica más alta se disuelve en 250 mL o menos en todo el rango de pH 1,2 a 6,8.', TRUE, 'Correcto. Se evalúa a 37 °C.', 1),
      (v_pregunta, 'Cuando se absorbe más del 85 % de la dosis administrada.', FALSE, 'Eso describe la permeabilidad.', 2),
      (v_pregunta, 'Cuando el principio activo es una sal sódica o potásica.', FALSE, 'El tipo de sal no define la clase.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un perfil de disolución comparativo da un f2 de 54. ¿Cómo se interpreta?';
    v_t4 := 'Un f2 de 50 o más indica similitud de perfiles. Su uso exige condiciones: al menos 12 unidades, mismos tiempos, no más de un punto por encima del 85 % en ambos productos y baja variabilidad (CV de 20 % o menos en los primeros puntos y de 10 % o menos en los demás). Si ambos disuelven 85 % o más en 15 minutos, no se requiere f2.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Perfiles de disolución comparativos y factor de similitud f2","outcome":"Perfiles de disolución comparativos y factor de similitud f2","source":"OMS TRS 1003, anexo 6; ICH M9."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Los perfiles son similares, si se cumplieron las condiciones de uso de f2.', TRUE, 'Correcto. f2 de 50 o más indica similitud.', 0),
      (v_pregunta, 'Los perfiles son diferentes, porque f2 debe ser de 100 para concluir similitud.', FALSE, '100 indica perfiles idénticos; el umbral es 50.', 1),
      (v_pregunta, 'El resultado no tiene interpretación sin un estudio in vivo adicional.', FALSE, 'f2 se interpreta con su umbral.', 2),
      (v_pregunta, 'Los perfiles son diferentes, porque f2 debe ser menor de 50.', FALSE, 'Es al revés: 50 o más indica similitud.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un principio activo es de clase III del BCS. ¿Qué análisis es correcto sobre la bioexención?';
    v_t4 := 'ICH M9 admite la bioexención para clase III si el producto es de disolución muy rápida (85 % o más en 15 minutos) y los excipientes son cualitativamente iguales y cuantitativamente muy similares a los de la referencia, porque la baja permeabilidad hace la absorción más sensible a los excipientes.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Requisitos de bioexención para clases I y III: excipientes y disolución","outcome":"Requisitos de bioexención para clases I y III: excipientes y disolución","source":"ICH M9."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No puede pedirse nunca, porque solo la clase I admite bioexención.', FALSE, 'ICH M9 la admite para clase III con requisitos.', 0),
      (v_pregunta, 'Puede pedirse sin ningún requisito de excipientes ni de disolución, por ser de alta solubilidad.', FALSE, 'Los requisitos son más estrictos.', 1),
      (v_pregunta, 'Si es de disolución muy rápida y sus excipientes son iguales y muy similares en cantidad.', TRUE, 'Correcto. Por su baja permeabilidad.', 2),
      (v_pregunta, 'Puede pedirse si el principio activo se absorbe mejor con alimentos.', FALSE, 'No es un criterio de bioexención.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Se pide bioexención para una concentración de 25 mg cuando el estudio in vivo se hizo con 100 mg del mismo fabricante. ¿Qué es lo más importante verificar?';
    v_t4 := 'La bioexención de concentraciones adicionales exige el mismo fabricante y proceso, fórmulas proporcionales, perfiles de disolución similares y, en general, farmacocinética lineal en el rango de dosis.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Bioexención de concentraciones adicionales por proporcionalidad","outcome":"Bioexención de concentraciones adicionales por proporcionalidad","source":"OMS TRS 1003, anexo 6; Resolución 1124 de 2016, anexo técnico 1."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que la caja de 25 mg tenga el mismo diseño que la de 100 mg.', FALSE, 'El diseño del empaque no es un criterio.', 0),
      (v_pregunta, 'Que el precio de la concentración de 25 mg sea proporcional.', FALSE, 'El precio no es un criterio.', 1),
      (v_pregunta, 'Que la concentración de 25 mg se venda en las mismas farmacias.', FALSE, 'El canal no es un criterio.', 2),
      (v_pregunta, 'El mismo proceso de fabricación, la proporcionalidad de la fórmula y la similitud de perfiles de disolución.', TRUE, 'Correcto. Y la farmacocinética lineal.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz bioeq-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Presentación de estudios al INVIMA y requerimientos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Presentación de estudios al INVIMA y requerimientos) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Presentación de estudios al INVIMA y requerimientos';
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


    v_t3 := '¿En qué trámites se presenta el estudio de BE según la Resolución 1124 de 2016?';
    v_t4 := 'El artículo 2 de la Resolución 1124 de 2016 incluye el registro nuevo, la renovación y las modificaciones que puedan afectar el comportamiento farmacocinético. Una vez aprobados los estudios, no se presentan de nuevo en renovaciones posteriores (par. 1).';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: el estudio de BE dentro del trámite sanitario","outcome":"Introducción a la unidad: el estudio de BE dentro del trámite sanitario","source":"Resolución 1124 de 2016, art. 2."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo en el registro sanitario nuevo, nunca en otros trámites.', FALSE, 'También en renovaciones y modificaciones.', 0),
      (v_pregunta, 'Solo cuando el Invima hace una visita de inspección a la planta del fabricante del producto.', FALSE, 'Se presenta con los trámites del registro.', 1),
      (v_pregunta, 'En registro nuevo, renovación y modificaciones que afecten la farmacocinética.', TRUE, 'Correcto. Según el artículo 2.', 2),
      (v_pregunta, 'Solo cuando un médico reporta falta de eficacia del producto.', FALSE, 'No es el momento previsto por la norma.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Durante un estudio aprobado en Colombia, se necesita cambiar los tiempos de muestreo. ¿Qué corresponde?';
    v_t4 := 'El parágrafo 1 del artículo 6 de la Resolución 1124 de 2016 (mod. Res. 662 de 2022) exige que los cambios al estudio tengan autorización del comité de ética y aprobación del Invima antes de implementarse.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Aprobación de protocolos in vivo en Colombia y enmiendas","outcome":"Aprobación de protocolos in vivo en Colombia y enmiendas","source":"Resolución 1124 de 2016, art. 6."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Implementar el cambio y explicarlo en el informe final.', FALSE, 'El cambio requiere aprobación previa.', 0),
      (v_pregunta, 'Pedir autorización al comité de ética y aprobación del Invima antes de implementarlo.', TRUE, 'Correcto. Art. 6, parágrafo 1.', 1),
      (v_pregunta, 'Informar solo al patrocinador, que decide si el cambio es pertinente.', FALSE, 'Se requieren aprobaciones externas.', 2),
      (v_pregunta, 'Suspender el estudio y empezar uno nuevo sin informar a nadie.', FALSE, 'No es el procedimiento previsto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un auto cuestiona que el informe de BE no incluye la validación del método bioanalítico. ¿Qué análisis es correcto?';
    v_t4 := 'Entre las deficiencias frecuentes están la falta de validación bioanalítica, de soportes del comparador, de justificación del tamaño de muestra o de datos individuales. Se subsanan con documentos trazables en el plazo del requerimiento.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Requerimientos y deficiencias frecuentes en estudios de BE","outcome":"Requerimientos y deficiencias frecuentes en estudios de BE","source":"Resolución 1124 de 2016, anexo técnico 1; ICH M10."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una deficiencia que se subsana con la validación bioanalítica y los datos de las corridas.', TRUE, 'Correcto. Es una deficiencia frecuente.', 0),
      (v_pregunta, 'No es relevante, porque el resultado de bioequivalencia ya fue favorable.', FALSE, 'Sin método validado, el resultado no es confiable.', 1),
      (v_pregunta, 'Se resuelve repitiendo el estudio clínico con nuevos voluntarios.', FALSE, 'Primero se aporta la validación.', 2),
      (v_pregunta, 'Se resuelve con una carta del laboratorio bioanalítico que certifica que el método funciona bien.', FALSE, 'Se requieren datos de validación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un estudio obtuvo un IC 90 % de Cmax de 78-118 %. El patrocinador propone excluir dos voluntarios «atípicos» para que cumpla. ¿Cuál es la mejor valoración?';
    v_t4 := 'Las exclusiones de sujetos deben definirse en el protocolo y basarse en criterios previos (por ejemplo, vómito o desviaciones), no en el resultado farmacocinético. Excluir datos para cumplir el criterio sesga el estudio y genera rechazo.';
    v_j1 := $evbioeq_json${"external_id":"bioeq-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: respuesta a un requerimiento del INVIMA sobre un estudio de BE","outcome":"Caso: respuesta a un requerimiento del INVIMA sobre un estudio de BE","source":"OMS TRS 1003, anexo 6; guía de BE de la EMA."}$evbioeq_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'bioeq-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es aceptable, porque los datos atípicos siempre deben excluirse del análisis.', FALSE, 'Las exclusiones se definen antes.', 0),
      (v_pregunta, 'Es aceptable si el comité de ética lo aprueba después de ver los resultados.', FALSE, 'No se justifica tras ver los resultados.', 1),
      (v_pregunta, 'Es aceptable si los voluntarios excluidos tuvieron concentraciones bajas.', FALSE, 'Excluir por resultado sesga el estudio.', 2),
      (v_pregunta, 'No es aceptable: las exclusiones deben estar previstas en el protocolo y justificarse sin ver el resultado.', TRUE, 'Correcto. Lo contrario sesga la conclusión.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad bioeq-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · ¿Requiere estudio de bioequivalencia?';
  v_t2 := $evbioeq_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Revisa el artículo 2 de la Resolución 1124 de 2016 y sus parágrafos.</li><li>Decide para cada caso si se requiere estudio de BE.</li><li>Analiza si alguna forma farmacéutica podría justificar una bioexención.</li><li>Explica qué pasa con la renovación de estudios ya aprobados.</li><li>Indica dónde consultar el listado vigente y el comparador.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar el ámbito de la Resolución 1124 de 2016.</li><li>Decidir si cada producto requiere estudio, bioexención o nada.</li><li>Fundamentar cada decisión.</li></ul>
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
  <tr><td>Ámbito y decisiones</td><td>40 %</td><td>Decide bien los cinco casos con el artículo 2 y sus parágrafos.</td><td>Decide bien tres o cuatro.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Bioexención y renovación</td><td>30 %</td><td>Analiza la solución oral y aplica el parágrafo 1 a la renovación.</td><td>Análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Fuentes</td><td>20 %</td><td>Indica los listados vigentes del Invima y el comparador del anexo técnico 2.</td><td>Fuentes generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbioeq_html$;
  v_t3 := $evbioeq_html$<h2>Caso de estudio</h2>
<p>Farmacéutica Sabana (ficticia) revisa su portafolio (datos simulados): (1) registro nuevo de tabletas de un principio activo incluido en el anexo técnico 2; (2) renovación de un producto cuyos estudios de BE ya fueron aprobados en el registro inicial; (3) modificación por cambio de fabricante del principio activo de un producto del listado; (4) registro de un biosimilar; (5) registro de una solución oral de un principio activo del listado.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evbioeq_html$;
  v_t4 := 'Tabla de decisiones con fundamento normativo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evbioeq_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1124 de 2016 y Resolución 662 de 2022 (anexos técnicos 1, 2 y 3); Resolución 8430 de 1993; OMS TRS 1003, anexo 6 (TRS 1052, anexo 8); ICH M9 y M13A; guías de bioequivalencia de la EMA y la FDA; listados del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evbioeq_html$;
  v_t7 := NULL;
  v_j1 := $evbioeq_json$["Ámbito.","Decisión por caso.","Bioexención.","Renovación.","Fuentes de consulta."]$evbioeq_json$::jsonb;
  v_j2 := $evbioeq_json${"version":1,"total":100,"criteria":[{"id":"ambito-y-decisiones","name":"Ámbito y decisiones","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Decide bien los cinco casos con el artículo 2 y sus parágrafos."},{"level":3,"label":"Logrado","description":"Decide bien tres o cuatro."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"bioexencion-y-renovacion","name":"Bioexención y renovación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Analiza la solución oral y aplica el parágrafo 1 a la renovación."},{"level":3,"label":"Logrado","description":"Análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"fuentes","name":"Fuentes","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Indica los listados vigentes del Invima y el comparador del anexo técnico 2."},{"level":3,"label":"Logrado","description":"Fuentes generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbioeq_json$::jsonb;
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


  -- ── Actividad bioeq-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Marco regulatorio colombiano de BD/BE' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Marco regulatorio colombiano de BD/BE) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Plan regulatorio de una renovación con molécula del listado';
  v_t2 := $evbioeq_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Identifica la obligación de presentar BE en la renovación.</li><li>Describe las aprobaciones previas del estudio (comité de ética e Invima).</li><li>Analiza el riesgo del certificado del centro y su renovación.</li><li>Define el cronograma: protocolo, aprobación, ejecución, comunicación de resultados.</li><li>Evalúa alternativas si el cronograma no alcanza.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar la Resolución 1124 de 2016 a una renovación.</li><li>Planear el estudio en Colombia con sus aprobaciones.</li><li>Evaluar los riesgos del centro y del cronograma.</li></ul>
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
  <tr><td>Marco normativo</td><td>35 %</td><td>Aplica arts. 2, 6, 8, 13 y 14 de la Resolución 1124 de 2016.</td><td>Aplica parte de los artículos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan y cronograma</td><td>30 %</td><td>Cronograma realista con aprobaciones previas y comunicación de resultados.</td><td>Cronograma incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Riesgos y alternativas</td><td>25 %</td><td>Identifica el vencimiento del certificado y propone alternativas.</td><td>Riesgos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbioeq_html$;
  v_t3 := $evbioeq_html$<h2>Caso de estudio</h2>
<p>Laboratorios Llanos (ficticia) debe renovar el registro de tabletas de un principio activo incluido en el anexo técnico 2 (datos simulados). El producto nunca presentó estudio de BE. El fabricante propone hacer el estudio en un centro colombiano que tiene certificado vigente hasta dentro de cinco meses.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evbioeq_html$;
  v_t4 := 'Plan regulatorio con cronograma y riesgos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evbioeq_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1124 de 2016 y Resolución 662 de 2022 (anexos técnicos 1, 2 y 3); Resolución 8430 de 1993; OMS TRS 1003, anexo 6 (TRS 1052, anexo 8); ICH M9 y M13A; guías de bioequivalencia de la EMA y la FDA; listados del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evbioeq_html$;
  v_t7 := NULL;
  v_j1 := $evbioeq_json$["Obligación.","Aprobaciones.","Certificado del centro.","Cronograma.","Alternativas."]$evbioeq_json$::jsonb;
  v_j2 := $evbioeq_json${"version":1,"total":100,"criteria":[{"id":"marco-normativo","name":"Marco normativo","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Aplica arts. 2, 6, 8, 13 y 14 de la Resolución 1124 de 2016."},{"level":3,"label":"Logrado","description":"Aplica parte de los artículos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-y-cronograma","name":"Plan y cronograma","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cronograma realista con aprobaciones previas y comunicación de resultados."},{"level":3,"label":"Logrado","description":"Cronograma incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"riesgos-y-alternativas","name":"Riesgos y alternativas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica el vencimiento del certificado y propone alternativas."},{"level":3,"label":"Logrado","description":"Riesgos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbioeq_json$::jsonb;
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


  -- ── Actividad bioeq-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Bioexenciones y perfiles de disolución' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Bioexenciones y perfiles de disolución) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Cálculo de f2 y decisión de bioexención';
  v_t2 := $evbioeq_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Verifica en qué medios no es necesario calcular f2.</li><li>Verifica las condiciones de uso de f2 a pH 6,8 (unidades, puntos sobre 85 %, CV).</li><li>Calcula f2 a pH 6,8 con los puntos válidos.</li><li>Interpreta el resultado.</li><li>Decide si procede la bioexención y qué otros requisitos verificarías.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Calcular e interpretar f2.</li><li>Verificar las condiciones de uso de f2.</li><li>Decidir sobre la bioexención.</li></ul>
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
  <tr><td>Condiciones de uso</td><td>30 %</td><td>Aplica las condiciones (12 unidades, un solo punto sobre 85 %, CV).</td><td>Aplica parte de las condiciones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cálculo e interpretación</td><td>35 %</td><td>Calcula f2 correctamente e interpreta frente a 50.</td><td>Cálculo con errores menores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Decisión</td><td>25 %</td><td>Decisión fundada con los demás requisitos (proceso, proporcionalidad, linealidad).</td><td>Decisión sin requisitos complementarios.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbioeq_html$;
  v_t3 := $evbioeq_html$<h2>Caso de estudio</h2>
<p>Laboratorios Orinoco (ficticia) compara 12 unidades de su producto (T) con la referencia (R) en pH 1,2, 4,5 y 6,8 (datos simulados). A pH 6,8, porcentaje disuelto promedio a 10, 15, 20 y 30 minutos: R = 45, 68, 82, 93; T = 40, 60, 76, 91. El CV de T a 10 minutos es del 18 %. A pH 1,2 y 4,5, ambos disuelven más del 85 % en 15 minutos. Se pide bioexención para una concentración adicional de 50 mg (el estudio in vivo se hizo con 100 mg).</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evbioeq_html$;
  v_t4 := 'Informe de cálculo de f2 con decisión de bioexención.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evbioeq_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1124 de 2016 y Resolución 662 de 2022 (anexos técnicos 1, 2 y 3); Resolución 8430 de 1993; OMS TRS 1003, anexo 6 (TRS 1052, anexo 8); ICH M9 y M13A; guías de bioequivalencia de la EMA y la FDA; listados del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evbioeq_html$;
  v_t7 := NULL;
  v_j1 := $evbioeq_json$["Medios sin f2.","Condiciones de uso.","Cálculo.","Interpretación.","Decisión."]$evbioeq_json$::jsonb;
  v_j2 := $evbioeq_json${"version":1,"total":100,"criteria":[{"id":"condiciones-de-uso","name":"Condiciones de uso","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aplica las condiciones (12 unidades, un solo punto sobre 85 %, CV)."},{"level":3,"label":"Logrado","description":"Aplica parte de las condiciones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"calculo-e-interpretacion","name":"Cálculo e interpretación","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Calcula f2 correctamente e interpreta frente a 50."},{"level":3,"label":"Logrado","description":"Cálculo con errores menores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"decision","name":"Decisión","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Decisión fundada con los demás requisitos (proceso, proporcionalidad, linealidad)."},{"level":3,"label":"Logrado","description":"Decisión sin requisitos complementarios."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbioeq_json$::jsonb;
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


  -- ── Actividad bioeq-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Referentes internacionales y diseño de estudios de BE' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Referentes internacionales y diseño de estudios de BE) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: obligación, aprobaciones y diseño del estudio del genérico';
  v_t2 := $evbioeq_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos del producto (ficticios).</li><li>Fase 1: fundamenta la obligación de BE y documenta el comparador del anexo técnico 2.</li><li>Fase 2: describe las aprobaciones previas, el certificado del centro y la comunicación de resultados.</li><li>Fase 3: define el diseño (replicado o 2x2), tamaño de muestra, lavado y muestreo.</li><li>Fase 3: define los criterios de aceptación para AUC y Cmax según la variabilidad.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Obligación de BE y comparador.</li>
  <li><strong>Fase 2 · Unidad 2 (marco colombiano).</strong> Aprobaciones, centro certificado y obligaciones.</li>
  <li><strong>Fase 3 · Unidad 3 (diseño).</strong> Diseño del estudio y criterios de aceptación.</li>
  <li><strong>Fase 4 · Unidad 4 (bioexención).</strong> Bioexención de la concentración de 20 mg.</li>
  <li><strong>Fase 5 · Unidad 5 (presentación).</strong> Expediente y prevención de requerimientos.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Fundamentar la obligación y seleccionar el comparador.</li><li>Diseñar el estudio con sus aprobaciones.</li></ul>
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
  <tr><td>Obligación y comparador</td><td>25 %</td><td>Aplica el art. 2 y documenta el comparador del anexo técnico 2.</td><td>Fundamento parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Marco colombiano</td><td>30 %</td><td>Aprobación del Invima con concepto del comité de ética, certificado vigente y resultados en 30 días.</td><td>Marco incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Diseño y criterios</td><td>35 %</td><td>Diseño adecuado al CV del 35 %, tamaño de muestra justificado y criterios correctos.</td><td>Diseño sin justificar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbioeq_html$;
  v_t3 := $evbioeq_html$<h2>Caso de estudio</h2>
<p>Laboratorios Pacífico (ficticio) quiere registrar un genérico de síntesis química en tabletas de 20 mg y 40 mg de un principio activo incluido en el anexo técnico 2, con un CV intrasujeto de Cmax estimado del 35 % (datos simulados). Hará el estudio in vivo en un centro colombiano con la concentración de 40 mg y pedirá bioexención para la de 20 mg. Te encargan el expediente de bioequivalencia completo. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evbioeq_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evbioeq_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1124 de 2016 y Resolución 662 de 2022 (anexos técnicos 1, 2 y 3); Resolución 8430 de 1993; OMS TRS 1003, anexo 6 (TRS 1052, anexo 8); ICH M9 y M13A; guías de bioequivalencia de la EMA y la FDA; listados del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evbioeq_html$;
  v_t7 := NULL;
  v_j1 := $evbioeq_json$["Obligación y comparador.","Aprobaciones.","Centro y obligaciones.","Diseño.","Criterios de aceptación."]$evbioeq_json$::jsonb;
  v_j2 := $evbioeq_json${"version":1,"total":100,"criteria":[{"id":"obligacion-y-comparador","name":"Obligación y comparador","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Aplica el art. 2 y documenta el comparador del anexo técnico 2."},{"level":3,"label":"Logrado","description":"Fundamento parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"marco-colombiano","name":"Marco colombiano","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aprobación del Invima con concepto del comité de ética, certificado vigente y resultados en 30 días."},{"level":3,"label":"Logrado","description":"Marco incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"diseno-y-criterios","name":"Diseño y criterios","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Diseño adecuado al CV del 35 %, tamaño de muestra justificado y criterios correctos."},{"level":3,"label":"Logrado","description":"Diseño sin justificar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbioeq_json$::jsonb;
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


  -- ── Actividad bioeq-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Presentación de estudios al INVIMA y requerimientos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Presentación de estudios al INVIMA y requerimientos) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: bioexención y expediente de BE del genérico';
  v_t2 := $evbioeq_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: sustenta la bioexención de 20 mg (proceso, proporcionalidad, perfiles, linealidad).</li><li>Fase 4: presenta un cálculo de f2 con datos simulados y verifica sus condiciones.</li><li>Fase 5: organiza el expediente (protocolo, aprobaciones, informe clínico y bioanalítico, estadística, comparador).</li><li>Fase 5: aplica una lista de verificación de deficiencias frecuentes.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el expediente en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Obligación de BE y comparador.</li>
  <li><strong>Fase 2 · Unidad 2 (marco colombiano).</strong> Aprobaciones, centro certificado y obligaciones.</li>
  <li><strong>Fase 3 · Unidad 3 (diseño).</strong> Diseño del estudio y criterios de aceptación.</li>
  <li><strong>Fase 4 · Unidad 4 (bioexención).</strong> Bioexención de la concentración de 20 mg.</li>
  <li><strong>Fase 5 · Unidad 5 (presentación).</strong> Expediente y prevención de requerimientos.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Sustentar la bioexención de la concentración adicional.</li><li>Integrar el expediente y prevenir requerimientos.</li></ul>
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
  <tr><td>Bioexención</td><td>30 %</td><td>Cumple los requisitos y el f2 se calcula con sus condiciones.</td><td>Requisitos incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Expediente</td><td>25 %</td><td>Expediente completo y trazable.</td><td>Expediente con vacíos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Prevención</td><td>20 %</td><td>Lista que cubre comparador, bioanalítica, exclusiones y certificación.</td><td>Lista parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evbioeq_html$;
  v_t3 := $evbioeq_html$<h2>Caso de estudio</h2>
<p>Laboratorios Pacífico (ficticio) quiere registrar un genérico de síntesis química en tabletas de 20 mg y 40 mg de un principio activo incluido en el anexo técnico 2, con un CV intrasujeto de Cmax estimado del 35 % (datos simulados). Hará el estudio in vivo en un centro colombiano con la concentración de 40 mg y pedirá bioexención para la de 20 mg. Te encargan el expediente de bioequivalencia completo. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el expediente que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evbioeq_html$;
  v_t4 := 'Expediente de BE con bioexención y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evbioeq_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1124 de 2016 y Resolución 662 de 2022 (anexos técnicos 1, 2 y 3); Resolución 8430 de 1993; OMS TRS 1003, anexo 6 (TRS 1052, anexo 8); ICH M9 y M13A; guías de bioequivalencia de la EMA y la FDA; listados del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evbioeq_html$;
  v_t7 := NULL;
  v_j1 := $evbioeq_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Bioexención.","Cálculo de f2.","Expediente.","Lista de verificación y resumen."]$evbioeq_json$::jsonb;
  v_j2 := $evbioeq_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"bioexencion","name":"Bioexención","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cumple los requisitos y el f2 se calcula con sus condiciones."},{"level":3,"label":"Logrado","description":"Requisitos incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"expediente","name":"Expediente","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Expediente completo y trazable."},{"level":3,"label":"Logrado","description":"Expediente con vacíos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"prevencion","name":"Prevención","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Lista que cubre comparador, bioanalítica, exclusiones y certificación."},{"level":3,"label":"Logrado","description":"Lista parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evbioeq_json$::jsonb;
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


  -- ── Foro bioeq-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con bioequivalencia';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evbioeq_html$<h2>Para empezar</h2>
<p>Piensa en un genérico, un estudio de BE o una bioexención que hayas conocido y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evbioeq_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evbioeq_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evbioeq_html$;
  v_t6 := $evbioeq_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evbioeq_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has revisado un informe de BE o un perfil de disolución?', '¿Qué parte te parece más difícil: el diseño, la estadística o la norma?']::text[];
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


  -- ── Foro bioeq-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Genéricos e intercambiabilidad';
  v_t2 := 'Argumentar por qué la bioequivalencia sustenta la confianza en los genéricos.';
  v_t3 := $evbioeq_html$<h2>Caso del foro</h2>
<p>Un médico ficticio afirma en una reunión que «los genéricos no funcionan igual» y pide que sus pacientes reciban solo la marca innovadora (datos simulados). El químico farmacéutico del servicio debe responder con argumentos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbioeq_html$;
  v_t4 := '¿Qué le responderías y qué evidencia usarías?';
  v_t5 := $evbioeq_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbioeq_html$;
  v_t6 := $evbioeq_html$<h2>Normas de participación</h2>
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
</details>$evbioeq_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué demuestra un estudio de bioequivalencia y qué no?', '¿Todos los genéricos del país tienen estudio de bioequivalencia?', '¿Qué pasa con los medicamentos de estrecho margen terapéutico?']::text[];
  v_j1 := $evbioeq_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbioeq_json$::jsonb;
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


  -- ── Foro bioeq-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Marco regulatorio colombiano de BD/BE' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Marco regulatorio colombiano de BD/BE) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Estudios hechos en el exterior';
  v_t2 := 'Argumentar qué verificar antes de presentar un estudio de BE realizado fuera de Colombia.';
  v_t3 := $evbioeq_html$<h2>Caso del foro</h2>
<p>Un importador ficticio quiere presentar un estudio de BE hecho por una CRO en otro país (datos simulados). La CRO tiene un certificado de buenas prácticas de una autoridad que no aparece en el artículo 5 de la Resolución 1124. El comparador fue comprado en Europa.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbioeq_html$;
  v_t4 := '¿Qué verificarías y qué riesgos ves?';
  v_t5 := $evbioeq_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada verificación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbioeq_html$;
  v_t6 := $evbioeq_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada verificación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbioeq_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué certificados acepta el Invima según el artículo 5?', '¿Qué pasa si el comparador no es el del anexo técnico 2?', '¿Qué soportes del comparador pedirías?']::text[];
  v_j1 := $evbioeq_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada verificación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbioeq_json$::jsonb;
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


  -- ── Foro bioeq-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Referentes internacionales y diseño de estudios de BE' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Referentes internacionales y diseño de estudios de BE) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Diseñar para no fracasar';
  v_t2 := 'Argumentar las decisiones de diseño que aumentan la probabilidad de un estudio concluyente.';
  v_t3 := $evbioeq_html$<h2>Caso del foro</h2>
<p>Un patrocinador ficticio repitió dos veces un estudio de BE que no fue concluyente: 12 voluntarios, diseño 2x2 y un fármaco con CV intrasujeto del 40 % (datos simulados). Quiere intentarlo una tercera vez «con los mismos parámetros, a ver si hay suerte».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbioeq_html$;
  v_t4 := '¿Qué cambiarías en el diseño y por qué?';
  v_t5 := $evbioeq_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía que sustenta cada cambio. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbioeq_html$;
  v_t6 := $evbioeq_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía que sustenta cada cambio.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbioeq_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Cómo se calcula el tamaño de muestra?', '¿Qué aporta un diseño replicado?', '¿Qué condiciones deben cumplirse para ampliar el intervalo de Cmax?']::text[];
  v_j1 := $evbioeq_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía que sustenta cada cambio."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbioeq_json$::jsonb;
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


  -- ── Foro bioeq-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Bioexenciones y perfiles de disolución' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Bioexenciones y perfiles de disolución) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Bioexención: ahorro con riesgo';
  v_t2 := 'Argumentar cuándo una bioexención es una decisión técnica sólida y cuándo es un riesgo.';
  v_t3 := $evbioeq_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio quiere pedir bioexención BCS para un principio activo de clase III cambiando dos excipientes respecto de la referencia para abaratar costos (datos simulados). El área de desarrollo dice que «los excipientes son inertes».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbioeq_html$;
  v_t4 := '¿Apoyarías la solicitud? ¿Qué condiciones exigirías?';
  v_t5 := $evbioeq_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía que sustenta tu posición. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbioeq_html$;
  v_t6 := $evbioeq_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía que sustenta tu posición.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbioeq_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué los excipientes importan más en la clase III?', '¿Qué excipientes son críticos para la absorción?', '¿Qué pasaría si la bioexención es rechazada?']::text[];
  v_j1 := $evbioeq_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía que sustenta tu posición."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbioeq_json$::jsonb;
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


  -- ── Foro bioeq-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Presentación de estudios al INVIMA y requerimientos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Presentación de estudios al INVIMA y requerimientos) en Bioequivalencia y Requisitos Regulatorios en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Deficiencias frecuentes en estudios de BE';
  v_t2 := 'Argumentar cómo prevenir los requerimientos sobre estudios de BE.';
  v_t3 := $evbioeq_html$<h2>Caso del foro</h2>
<p>Un titular ficticio recibió requerimientos en tres estudios de BE (datos simulados): comparador sin soportes de compra, falta de validación bioanalítica y exclusiones de voluntarios no previstas en el protocolo.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evbioeq_html$;
  v_t4 := '¿Qué lista de verificación aplicarías antes de presentar un estudio?';
  v_t5 := $evbioeq_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o guía que sustenta cada punto. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evbioeq_html$;
  v_t6 := $evbioeq_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta cada punto.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evbioeq_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué soportes del comparador son indispensables?', '¿Qué debe incluir el informe bioanalítico?', '¿Cómo se documentan las exclusiones?']::text[];
  v_j1 := $evbioeq_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o guía que sustenta cada punto."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evbioeq_json$::jsonb;
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


  RAISE NOTICE 'Bioequivalencia y Requisitos Regulatorios en Colombia: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evbioeq$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Gestión Documental de Trámites ante el INVIMA
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evgdoc$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Gestión Documental de Trámites ante el INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. El área regulatoria como gestor documental y la plataforma de trámites del INVIMA', 'Unidad 2. Seguimiento de trámites, notificaciones y bases de datos públicas del INVIMA', 'Unidad 3. Documentos legales, apostilla, legalización y traducción oficial', 'Unidad 4. Organización del expediente regulatorio, archivo y control de vencimientos', 'Unidad 5. Herramientas digitales, indicadores y derechos de petición']::text[])) < 5 THEN
    RAISE NOTICE 'Gestión Documental de Trámites ante el INVIMA: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evgdoc_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evgdoc_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz gdoc-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. El área regulatoria como gestor documental y la plataforma de trámites del INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. El área regulatoria como gestor documental y la plataforma de trámites del INVIMA) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · El área regulatoria como gestor documental y la plataforma de trámites del INVIMA';
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


    v_t3 := '¿Qué papel cumple el área regulatoria en la gestión documental de los registros sanitarios?';
    v_t4 := 'El área regulatoria es custodia del ciclo documental de los registros: prepara y verifica los documentos, radica, hace seguimiento, gestiona notificaciones, archiva y controla vencimientos, con trazabilidad entre lo radicado y lo aprobado.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción al curso: el área regulatoria como gestor documental","outcome":"Introducción al curso: el área regulatoria como gestor documental","source":"Ley 594 de 2000; buenas prácticas de gestión regulatoria."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo archiva las resoluciones que llegan del Invima, sin intervenir nunca en los trámites.', FALSE, 'Su papel es mucho más amplio.', 0),
      (v_pregunta, 'Custodia el ciclo documental: prepara, radica, sigue, archiva y controla vencimientos.', TRUE, 'Correcto. Es el gestor del ciclo documental.', 1),
      (v_pregunta, 'Solo paga las tarifas de los trámites que le solicita el área comercial.', FALSE, 'El pago es una parte pequeña del proceso.', 2),
      (v_pregunta, 'Solo redacta los textos de publicidad de los productos registrados.', FALSE, 'No es su función principal.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Antes de radicar un trámite en la plataforma del Invima, ¿qué verificación previene más rechazos?';
    v_t4 := 'Las causas más frecuentes de rechazo son incoherencias entre el formulario, la tarifa pagada y los soportes, o documentos faltantes o vencidos. Una lista de verificación previa a la radicación, con el manual tarifario vigente, las previene.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso: preparar y radicar una solicitud en la Oficina Virtual sin rechazos","outcome":"Caso: preparar y radicar una solicitud en la Oficina Virtual sin rechazos","source":"Manual tarifario e instructivos vigentes del Invima."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que el archivo PDF tenga el logotipo de la empresa en todas las páginas.', FALSE, 'El logotipo no previene rechazos.', 0),
      (v_pregunta, 'Que el trámite se radique el último día del plazo para ganar tiempo.', FALSE, 'Aumenta el riesgo de perder el plazo.', 1),
      (v_pregunta, 'La coherencia entre formulario, código de tarifa, pago y soportes.', TRUE, 'Correcto. Es la causa más frecuente de rechazos.', 2),
      (v_pregunta, 'Que el correo del radicador sea personal y no institucional.', FALSE, 'Conviene un correo institucional.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un trámite se pagó con un código de tarifa equivocado. ¿Qué análisis es correcto?';
    v_t4 := 'Un pago con código equivocado genera rechazo o inconsistencias. El procedimiento correcto es revisar el instructivo vigente del Invima sobre devoluciones, pagar la tarifa correcta y verificar la coherencia antes de radicar.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Pago de tarifas: PSE, recibo bancario, devoluciones y errores frecuentes","outcome":"Pago de tarifas: PSE, recibo bancario, devoluciones y errores frecuentes","source":"Manual tarifario e instructivos vigentes del Invima."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Revisar el instructivo vigente sobre devoluciones y pagar la tarifa correcta antes de radicar.', TRUE, 'Correcto. Y registrar la lección aprendida.', 0),
      (v_pregunta, 'No importa, porque el Invima ajusta el código de tarifa de oficio sin ninguna intervención del usuario.', FALSE, 'El usuario debe corregirlo.', 1),
      (v_pregunta, 'Se radica igual y se explica el error en el formulario.', FALSE, 'Lo probable es el rechazo.', 2),
      (v_pregunta, 'Se paga dos veces la tarifa mayor para evitar cualquier problema.', FALSE, 'Pagar de más no es la solución.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un área regulatoria usa el correo personal de un analista como usuario de la plataforma del Invima. ¿Cuál es la mejor valoración?';
    v_t4 := 'Las notificaciones electrónicas se surten cuando el administrado accede a ellas (CPACA art. 56). Un buzón personal concentra el riesgo de perder notificaciones o el acceso. Un usuario institucional con responsables y suplentes protege los plazos.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: preparar y radicar una solicitud en la Oficina Virtual sin rechazos","outcome":"Caso: preparar y radicar una solicitud en la Oficina Virtual sin rechazos","source":"Ley 1437 de 2011, art. 56."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuado, porque el analista conoce mejor que nadie los trámites.', FALSE, 'Concentra el riesgo en una persona.', 0),
      (v_pregunta, 'Es adecuado si el analista reenvía los correos importantes a su jefe.', FALSE, 'Depende de una acción manual.', 1),
      (v_pregunta, 'Es indiferente, porque el Invima notifica también por correo certificado.', FALSE, 'La notificación electrónica es la habitual.', 2),
      (v_pregunta, 'Es un riesgo: conviene un usuario y un buzón institucionales, con responsables y suplentes.', TRUE, 'Correcto. Evita perder notificaciones y plazos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz gdoc-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Seguimiento de trámites, notificaciones y bases de datos públicas del INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Seguimiento de trámites, notificaciones y bases de datos públicas del INVIMA) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Seguimiento de trámites, notificaciones y bases de datos públicas del INVIMA';
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


    v_t3 := '¿Qué es el Código Único de Medicamentos (CUM)?';
    v_t4 := 'El CUM identifica cada presentación comercial de un medicamento con registro sanitario; el Invima publica conjuntos de datos abiertos de CUM vigentes, vencidos y en trámite de renovación, útiles para auditar un portafolio.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"CUM, IUM y datos abiertos del INVIMA","outcome":"CUM, IUM y datos abiertos del INVIMA","source":"Datos abiertos del Invima (CUM)."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El número de lote que asigna el fabricante a cada producción del medicamento en su planta.', FALSE, 'El lote es distinto del CUM.', 0),
      (v_pregunta, 'El código de barras comercial que asigna el distribuidor.', FALSE, 'No es un código comercial.', 1),
      (v_pregunta, 'El código que identifica cada presentación comercial de un medicamento registrado.', TRUE, 'Correcto. El Invima publica sus datos abiertos.', 2),
      (v_pregunta, 'El número de radicado que se genera al pagar un trámite.', FALSE, 'El radicado identifica el trámite.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'La empresa aceptó la notificación electrónica. ¿Desde cuándo corre el plazo de un auto notificado así?';
    v_t4 := 'Según el artículo 56 del CPACA, la notificación electrónica queda surtida a partir de la fecha y hora en que el administrado accede a ella, lo que certifica la administración. El plazo del auto corre desde entonces.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Notificación de actos administrativos: electrónica, personal, por autorizado y por aviso","outcome":"Notificación de actos administrativos: electrónica, personal, por autorizado y por aviso","source":"Ley 1437 de 2011, art. 56."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Desde la fecha de firma del auto por el funcionario del Invima que lo expide en el trámite.', FALSE, 'La firma no es la notificación.', 0),
      (v_pregunta, 'Desde que el administrado accede a ella, según lo certifique la administración.', TRUE, 'Correcto. Por eso se revisa el buzón a diario.', 1),
      (v_pregunta, 'Desde que el jefe de regulatorios imprime el auto.', FALSE, 'Imprimir no es el criterio.', 2),
      (v_pregunta, 'Desde 30 días después del envío, se lea o no.', FALSE, 'No es la regla del artículo 56.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Al cruzar el portafolio con las bases públicas, un registro aparece «vencido» aunque la empresa lo creía vigente. ¿Qué análisis es correcto?';
    v_t4 := 'La auditoría documental cruza las bases públicas (registros, CUM, resoluciones) con el archivo interno. Una discrepancia de estado es crítica: se verifica con la resolución y el expediente y, si el registro está vencido, se detiene la comercialización y se define la acción regulatoria.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso: auditoría documental de un portafolio con bases públicas del INVIMA","outcome":"Caso: auditoría documental de un portafolio con bases públicas del INVIMA","source":"Bases públicas del Invima; Decreto 334 de 2022, art. 4."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una discrepancia crítica: verificar con la resolución y el expediente y actuar ya.', TRUE, 'Correcto. Puede afectar la comercialización.', 0),
      (v_pregunta, 'Es un error de la base pública que no tiene ninguna consecuencia para la empresa ni sus productos.', FALSE, 'Debe verificarse antes de descartarlo.', 1),
      (v_pregunta, 'Se ignora si el producto se sigue vendiendo sin quejas.', FALSE, 'Las ventas no prueban la vigencia.', 2),
      (v_pregunta, 'Se resuelve actualizando la hoja de cálculo interna con la palabra «vigente».', FALSE, 'Eso oculta el problema.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un cliente envía una copia escaneada de una resolución del Invima para sustentar una licitación. ¿Cuál es la mejor verificación?';
    v_t4 := 'El Invima ofrece herramientas para descargar sus actos y validar la firma digital. Verificar en la fuente oficial previene el uso de documentos alterados o desactualizados.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Verificación y descarga de documentos emitidos por el INVIMA y firma digital","outcome":"Verificación y descarga de documentos emitidos por el INVIMA y firma digital","source":"Herramientas de consulta y verificación del Invima."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Aceptarla si el escaneo es nítido y tiene el logotipo del Invima.', FALSE, 'El logotipo puede copiarse.', 0),
      (v_pregunta, 'Aceptarla si el cliente firma una declaración de autenticidad.', FALSE, 'La declaración no verifica el documento.', 1),
      (v_pregunta, 'Rechazarla siempre, porque solo valen los documentos en papel.', FALSE, 'Los documentos electrónicos son válidos.', 2),
      (v_pregunta, 'Descargarla o validarla con las herramientas del Invima, incluida la firma digital.', TRUE, 'Correcto. Así se confirma su autenticidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz gdoc-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Documentos legales, apostilla, legalización y traducción oficial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Documentos legales, apostilla, legalización y traducción oficial) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Documentos legales, apostilla, legalización y traducción oficial';
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


    v_t3 := '¿Cuándo se usa la apostilla y cuándo la legalización de un documento extranjero?';
    v_t4 := 'La apostilla sustituye la cadena de legalización entre países parte de la Convención de La Haya de 1961, que Colombia aprobó mediante la Ley 455 de 1998. Los documentos de países no parte requieren legalización consular.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Apostilla y legalización: Convención de La Haya y Resolución 1959 de 2020","outcome":"Apostilla y legalización: Convención de La Haya y Resolución 1959 de 2020","source":"Ley 455 de 1998; Convención de La Haya de 1961."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La apostilla se usa siempre, sin importar el país que emite el documento ni el tipo de documento.', FALSE, 'Depende de si el país es parte de la Convención.', 0),
      (v_pregunta, 'La legalización se usa solo para documentos en español.', FALSE, 'El idioma no define el trámite.', 1),
      (v_pregunta, 'Ninguna se necesita si el documento tiene firma digital.', FALSE, 'La firma digital no reemplaza el trámite.', 2),
      (v_pregunta, 'Apostilla si el país emisor es parte de la Convención de La Haya; si no, legalización consular.', TRUE, 'Correcto. Colombia la aprobó con la Ley 455 de 1998.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué es un Certificado de Producto Farmacéutico (CPP) tipo OMS?';
    v_t4 := 'El CPP del esquema de certificación de la OMS lo emite la autoridad sanitaria del país exportador e informa el estado de autorización del producto y el cumplimiento de BPM del fabricante. Se usa en trámites de productos importados.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Certificado de Producto Farmacéutico (CPP) tipo OMS y Certificado de Venta Libre","outcome":"Certificado de Producto Farmacéutico (CPP) tipo OMS y Certificado de Venta Libre","source":"Esquema de certificación de la OMS."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un certificado de la autoridad del país exportador sobre el producto y su fabricante.', TRUE, 'Correcto. Sigue el esquema de certificación de la OMS.', 0),
      (v_pregunta, 'Una factura comercial del fabricante que acredita la compra del producto.', FALSE, 'No es un documento comercial.', 1),
      (v_pregunta, 'Un certificado que emite el Invima a los productos fabricados en Colombia para venderlos aquí.', FALSE, 'Lo emite la autoridad del país exportador.', 2),
      (v_pregunta, 'Un documento interno del importador con la lista de precios del producto.', FALSE, 'No es un documento interno.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un poder dice «para radicar el trámite de renovación». El Invima notifica un auto al apoderado. ¿Qué análisis es correcto?';
    v_t4 := 'Un poder especial se limita a las facultades que expresa. Para un trámite completo conviene incluir radicar, notificarse, responder requerimientos, desistir y recurrir. Revisar las facultades antes de radicar evita problemas en la notificación.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Poderes y cartas de autorización para trámites ante el INVIMA","outcome":"Poderes y cartas de autorización para trámites ante el INVIMA","source":"Código General del Proceso (poderes); buenas prácticas de gestión regulatoria."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El apoderado puede hacer cualquier gestión, porque el poder es general.', FALSE, 'El poder especial se limita a sus facultades.', 0),
      (v_pregunta, 'El poder no incluye facultades para notificarse ni para recurrir; conviene incluirlas expresamente.', TRUE, 'Correcto. Se revisan las facultades antes de radicar.', 1),
      (v_pregunta, 'El poder no sirve para nada, porque debe ser otorgado ante notario en el exterior.', FALSE, 'No es el problema principal.', 2),
      (v_pregunta, 'El poder vence automáticamente al radicar el trámite.', FALSE, 'No es una regla general.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un certificado de BPM en alemán se traduce por un empleado bilingüe de la empresa y se radica así. ¿Cuál es la mejor valoración?';
    v_t4 := 'Los documentos en idioma extranjero se presentan con traducción oficial y, cuando corresponde, con la cadena de apostilla o legalización. Planear la cadena (documento original, apostilla, traducción) evita rechazos y requerimientos.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Traducción oficial y apostilla de documentos traducidos","outcome":"Traducción oficial y apostilla de documentos traducidos","source":"Ley 455 de 1998; requisitos del Invima para documentos extranjeros."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es suficiente, porque el empleado conoce bien el idioma y la terminología técnica.', FALSE, 'Se requiere traducción oficial.', 0),
      (v_pregunta, 'Es suficiente si el empleado firma la traducción.', FALSE, 'La firma no la convierte en oficial.', 1),
      (v_pregunta, 'Es un riesgo: se requiere traducción oficial y la cadena de apostilla o legalización que corresponda.', TRUE, 'Correcto. Con planificación de tiempos.', 2),
      (v_pregunta, 'Es suficiente si el Invima tiene evaluadores que hablan alemán.', FALSE, 'Los documentos se presentan en español con traducción oficial.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz gdoc-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Organización del expediente regulatorio, archivo y control de vencimientos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Organización del expediente regulatorio, archivo y control de vencimientos) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Organización del expediente regulatorio, archivo y control de vencimientos';
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


    v_t3 := 'Según la Ley 594 de 2000, ¿qué es el ciclo vital del documento?';
    v_t4 := 'La Ley 594 de 2000 (Ley General de Archivos) define el ciclo vital del documento: archivo de gestión, archivo central y archivo histórico. Aunque es obligatoria para entidades públicas, es una buena práctica para organizar el expediente regulatorio en empresas privadas.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Ley 594 de 2000 aplicada al área regulatoria","outcome":"Ley 594 de 2000 aplicada al área regulatoria","source":"Ley 594 de 2000."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Las etapas del documento: archivo de gestión, archivo central y archivo histórico.', TRUE, 'Correcto. Útil como buena práctica en empresas.', 0),
      (v_pregunta, 'El tiempo que tarda el Invima en aprobar un trámite desde la radicación hasta la resolución.', FALSE, 'No es un concepto de tiempos de trámite.', 1),
      (v_pregunta, 'El número de versiones de un dossier antes de radicarlo.', FALSE, 'Eso es control de versiones.', 2),
      (v_pregunta, 'El periodo de vigencia de un certificado de BPM.', FALSE, 'No es un concepto de vigencias.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En una matriz de vencimientos, ¿con cuánta antelación mínima debe radicarse la renovación de un registro con vigencia temporal, según el Decreto 334 de 2022?';
    v_t4 := 'El artículo 4 del Decreto 334 de 2022 exige radicar la renovación con al menos un mes de antelación al vencimiento; si se presenta tarde, procede una solicitud de registro nuevo. La matriz de vencimientos debe alertar con margen para preparar los documentos.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Matriz y semáforo de vencimientos del portafolio","outcome":"Matriz y semáforo de vencimientos del portafolio","source":"Decreto 334 de 2022, art. 4."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El mismo día del vencimiento, porque el Invima resuelve en horas.', FALSE, 'Se exige antelación.', 0),
      (v_pregunta, 'Con un año de antelación, porque así lo exige toda renovación.', FALSE, 'No es el plazo de la norma.', 1),
      (v_pregunta, 'Con al menos un mes de antelación; si se radica tarde, se requiere un nuevo registro.', TRUE, 'Correcto. La matriz debe alertar antes.', 2),
      (v_pregunta, 'En cualquier momento después del vencimiento, con una multa.', FALSE, 'Vencido el registro, se pierde la renovación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Lo radicado ante el Invima no coincide con la versión «final» del dossier en el servidor. ¿Qué análisis es correcto?';
    v_t4 := 'El control de versiones (código, versión, estado, historial) asegura que lo radicado coincida con lo aprobado y con el archivo. Una discrepancia exige reconstruir qué se radicó y corregir el procedimiento.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Control de versiones de dossiers y expedientes","outcome":"Control de versiones de dossiers y expedientes","source":"Buenas prácticas de control de documentos."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No importa, porque el Invima solo evalúa la versión final que la empresa guarda en su servidor.', FALSE, 'El Invima evalúa lo radicado.', 0),
      (v_pregunta, 'Falla el control de versiones: hay que identificar qué se radicó y alinear el archivo.', TRUE, 'Correcto. Con codificación, estado e historial.', 1),
      (v_pregunta, 'Se resuelve borrando las versiones anteriores del servidor.', FALSE, 'Borrar elimina la trazabilidad.', 2),
      (v_pregunta, 'Se resuelve radicando de nuevo todo el dossier.', FALSE, 'Primero hay que entender qué se radicó.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una empresa conserva todos los borradores de sus dossiers sin ninguna regla, «por si acaso». ¿Cuál es la mejor valoración?';
    v_t4 := 'Las tablas de retención documental definen series, tiempos de retención y disposición final. Aplicadas a las series regulatorias, evitan confundir borradores con versiones aprobadas y conservan lo necesario durante el tiempo requerido.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Tablas de retención documental (TRD) para series regulatorias","outcome":"Tablas de retención documental (TRD) para series regulatorias","source":"Ley 594 de 2000; metodología de tablas de retención documental."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es lo mejor, porque conservar todo garantiza la trazabilidad.', FALSE, 'Sin reglas, se dificulta encontrar lo vigente.', 0),
      (v_pregunta, 'Es indiferente, porque el almacenamiento digital no cuesta.', FALSE, 'El costo principal es la confusión.', 1),
      (v_pregunta, 'Es mejor borrar todo lo que tenga más de un año.', FALSE, 'Se pierden documentos que deben conservarse.', 2),
      (v_pregunta, 'Conviene una tabla de retención con series, tiempos y disposición final.', TRUE, 'Correcto. Ordena lo que se conserva y por cuánto tiempo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz gdoc-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Herramientas digitales, indicadores y derechos de petición' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Herramientas digitales, indicadores y derechos de petición) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Herramientas digitales, indicadores y derechos de petición';
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


    v_t3 := '¿Qué ventaja tiene un sistema RIM frente a una hoja de cálculo para el portafolio regulatorio?';
    v_t4 := 'Un sistema RIM integra la información de registros, documentos, versiones, compromisos y vencimientos con trazabilidad y control de acceso. Una hoja de cálculo puede servir si tiene validaciones, responsables y control de versiones.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Sistemas RIM y gestores documentales","outcome":"Sistemas RIM y gestores documentales","source":"Buenas prácticas de gestión de información regulatoria."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que elimina la necesidad de tener un área regulatoria con personal propio en la empresa.', FALSE, 'No reemplaza al equipo.', 0),
      (v_pregunta, 'Integra registros, documentos, versiones y vencimientos con trazabilidad.', TRUE, 'Correcto. La hoja de cálculo sirve si está bien controlada.', 1),
      (v_pregunta, 'Que hace que el Invima apruebe más rápido los trámites.', FALSE, 'No cambia los tiempos del Invima.', 2),
      (v_pregunta, 'Que no requiere actualizar los datos después de cada resolución.', FALSE, 'Requiere actualización.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Según el artículo 14 de la Ley 1437 (sustituido por la Ley 1755 de 2015), ¿en qué plazo debe responderse una petición de documentos e información?';
    v_t4 := 'El artículo 14 fija 15 días como regla general, 10 días para peticiones de documentos e información (si no hay respuesta, se entiende aceptada y las copias se entregan en 3 días) y 30 días para consultas. Si no es posible responder a tiempo, la autoridad lo informa antes del vencimiento, con un plazo que no puede exceder el doble del inicial.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Derecho de petición y solicitudes de información (Ley 1755 de 2015)","outcome":"Derecho de petición y solicitudes de información (Ley 1755 de 2015)","source":"Ley 1755 de 2015, art. 14."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En 30 días, igual que las consultas sobre materias a cargo de la autoridad.', FALSE, 'Ese es el plazo de las consultas.', 0),
      (v_pregunta, 'En 15 días, que es la regla general para todas las peticiones, sin ninguna excepción.', FALSE, 'Hay un plazo especial para documentos e información.', 1),
      (v_pregunta, 'En 10 días; si no se responde, se entiende aceptada y se entregan las copias.', TRUE, 'Correcto. Las copias se entregan en 3 días.', 2),
      (v_pregunta, 'En 6 meses, porque el Invima tiene muchos trámites.', FALSE, 'No es un plazo de la ley.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un indicador muestra que el 40 % de los trámites recibe auto de requerimiento. ¿Qué análisis es más útil?';
    v_t4 := 'Un indicador útil lleva a la acción: clasificar los requerimientos por causa (legal, técnica, documental) y por sección del expediente permite enfocar controles en las causas más frecuentes y medir la mejora.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Indicadores de gestión regulatoria","outcome":"Indicadores de gestión regulatoria","source":"Buenas prácticas de indicadores de gestión."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Clasificar los autos por causa y sección del expediente para atacar las más frecuentes.', TRUE, 'Correcto. Así el indicador lleva a la acción.', 0),
      (v_pregunta, 'Concluir que el Invima es demasiado exigente y no cambiar nada.', FALSE, 'No lleva a ninguna mejora.', 1),
      (v_pregunta, 'Reducir el número de trámites que se radican para bajar el porcentaje.', FALSE, 'No resuelve la causa.', 2),
      (v_pregunta, 'Dejar de medir el indicador porque genera malas noticias.', FALSE, 'Se pierde la información.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un trámite lleva meses sin respuesta y el gerente quiere «demandar al Invima». Como primer paso, ¿cuál es la mejor opción?';
    v_t4 := 'El derecho de petición (Ley 1755 arts. 13, 14 y 16) permite pedir información sobre el estado del trámite, sin necesidad de abogado; debe identificar la autoridad, el solicitante, el objeto, las razones y los documentos. La respuesta se rige por los plazos del artículo 14.';
    v_j1 := $evgdoc_json${"external_id":"gdoc-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: redactar un derecho de petición de información ante el INVIMA","outcome":"Caso: redactar un derecho de petición de información ante el INVIMA","source":"Ley 1755 de 2015, arts. 13, 14 y 16."}$evgdoc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'gdoc-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Radicar de nuevo el mismo trámite y pagar otra vez la tarifa para que lo atiendan más rápido.', FALSE, 'Duplica el trámite sin resolver la demora.', 0),
      (v_pregunta, 'Llamar al conmutador hasta que alguien responda.', FALSE, 'No deja constancia formal.', 1),
      (v_pregunta, 'Publicar una queja en redes sociales para presionar.', FALSE, 'No es un mecanismo formal.', 2),
      (v_pregunta, 'Presentar un derecho de petición de información sobre el estado del trámite.', TRUE, 'Correcto. No requiere abogado.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad gdoc-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. El área regulatoria como gestor documental y la plataforma de trámites del INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. El área regulatoria como gestor documental y la plataforma de trámites del INVIMA) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Lista de verificación previa a la radicación';
  v_t2 := $evgdoc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Diseña la lista de verificación (formulario, tarifa, pago, poder, certificados, soportes).</li><li>Aplica la lista al paquete y registra cada hallazgo.</li><li>Analiza las consecuencias de cada error (rechazo, nuevo pago, notificación).</li><li>Propón la corrección de cada hallazgo y su responsable.</li><li>Define cómo organizar los soportes para facilitar la evaluación.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar una lista de verificación previa a la radicación.</li><li>Detectar los errores del paquete.</li><li>Proponer las correcciones.</li></ul>
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
  <tr><td>Lista</td><td>25 %</td><td>Lista completa y reutilizable.</td><td>Lista incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Hallazgos</td><td>40 %</td><td>Detecta firma, tarifa, facultades del poder, vigencia del certificado y organización.</td><td>Detecta tres o cuatro.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Correcciones</td><td>25 %</td><td>Correcciones concretas con responsables.</td><td>Correcciones generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evgdoc_html$;
  v_t3 := $evgdoc_html$<h2>Caso de estudio</h2>
<p>Farmacéutica Montaña (ficticia) va a radicar una modificación de un registro sanitario (datos simulados). El paquete incluye: formulario diligenciado sin firma; comprobante de pago con un código de tarifa de otro tipo de trámite; poder del representante legal con facultad «para radicar» pero no «para notificarse»; certificado de existencia y representación expedido hace cuatro meses; soportes técnicos en un solo PDF de 300 páginas sin índice.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evgdoc_html$;
  v_t4 := 'Lista de verificación aplicada con plan de corrección.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evgdoc_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 1755 de 2015 (arts. 13, 14, 16 a 18); Ley 1437 de 2011, CPACA (art. 56); Decreto 334 de 2022 (art. 4); Ley 594 de 2000 (Ley General de Archivos); Ley 455 de 1998 (Convención de La Haya sobre la apostilla); manual tarifario e instructivos vigentes del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evgdoc_html$;
  v_t7 := NULL;
  v_j1 := $evgdoc_json$["Lista de verificación.","Hallazgos.","Consecuencias.","Correcciones.","Organización de soportes."]$evgdoc_json$::jsonb;
  v_j2 := $evgdoc_json${"version":1,"total":100,"criteria":[{"id":"lista","name":"Lista","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Lista completa y reutilizable."},{"level":3,"label":"Logrado","description":"Lista incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"hallazgos","name":"Hallazgos","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Detecta firma, tarifa, facultades del poder, vigencia del certificado y organización."},{"level":3,"label":"Logrado","description":"Detecta tres o cuatro."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"correcciones","name":"Correcciones","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Correcciones concretas con responsables."},{"level":3,"label":"Logrado","description":"Correcciones generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evgdoc_json$::jsonb;
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


  -- ── Actividad gdoc-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Seguimiento de trámites, notificaciones y bases de datos públicas del INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Seguimiento de trámites, notificaciones y bases de datos públicas del INVIMA) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Auditoría documental de un portafolio con bases públicas';
  v_t2 := $evgdoc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Diseña la tabla de cruce (registro, titular, estado, CUM, resoluciones).</li><li>Clasifica cada discrepancia por riesgo (alto, medio, bajo).</li><li>Define la acción para cada una y su responsable.</li><li>Analiza la causa raíz común de las discrepancias.</li><li>Propón un procedimiento de auditoría periódica.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Cruzar el archivo interno con las bases públicas.</li><li>Clasificar las discrepancias por riesgo.</li><li>Definir acciones correctivas.</li></ul>
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
  <tr><td>Cruce y clasificación</td><td>35 %</td><td>Cruce completo y riesgo justificado de cada discrepancia.</td><td>Clasificación sin justificar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acciones</td><td>30 %</td><td>Acciones concretas: actualizar archivo, verificar CUM, descargar resolución válida.</td><td>Acciones generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Causa y procedimiento</td><td>25 %</td><td>Causa raíz (falta de actualización tras cada resolución) y auditoría periódica.</td><td>Procedimiento general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evgdoc_html$;
  v_t3 := $evgdoc_html$<h2>Caso de estudio</h2>
<p>Laboratorios Ribera (ficticia) tiene una hoja de cálculo con 10 registros (datos simulados). Al cruzarla con las bases públicas encuentras: dos registros con titular distinto al de la hoja (hubo una cesión hace un año); un CUM de una presentación que figura como no vigente; un registro con una modificación aprobada que no está en el archivo; y una resolución de renovación cuya copia interna no coincide con la descargada del Invima.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evgdoc_html$;
  v_t4 := 'Informe de auditoría con plan de acción.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evgdoc_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 1755 de 2015 (arts. 13, 14, 16 a 18); Ley 1437 de 2011, CPACA (art. 56); Decreto 334 de 2022 (art. 4); Ley 594 de 2000 (Ley General de Archivos); Ley 455 de 1998 (Convención de La Haya sobre la apostilla); manual tarifario e instructivos vigentes del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evgdoc_html$;
  v_t7 := NULL;
  v_j1 := $evgdoc_json$["Tabla de cruce.","Clasificación por riesgo.","Acciones.","Causa raíz.","Procedimiento periódico."]$evgdoc_json$::jsonb;
  v_j2 := $evgdoc_json${"version":1,"total":100,"criteria":[{"id":"cruce-y-clasificacion","name":"Cruce y clasificación","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cruce completo y riesgo justificado de cada discrepancia."},{"level":3,"label":"Logrado","description":"Clasificación sin justificar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acciones","name":"Acciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Acciones concretas: actualizar archivo, verificar CUM, descargar resolución válida."},{"level":3,"label":"Logrado","description":"Acciones generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"causa-y-procedimiento","name":"Causa y procedimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Causa raíz (falta de actualización tras cada resolución) y auditoría periódica."},{"level":3,"label":"Logrado","description":"Procedimiento general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evgdoc_json$::jsonb;
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


  -- ── Actividad gdoc-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Organización del expediente regulatorio, archivo y control de vencimientos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Organización del expediente regulatorio, archivo y control de vencimientos) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Tablero de control documental de un portafolio';
  v_t2 := $evgdoc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Propón la estructura de carpetas por registro y la codificación de documentos.</li><li>Define las series regulatorias y sus tiempos de retención.</li><li>Diseña la matriz de vencimientos con fechas límite de radicación y semáforo.</li><li>Prioriza los vencimientos del caso y define acciones.</li><li>Define tres indicadores de control documental.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Organizar el expediente con una estructura y codificación.</li><li>Diseñar la matriz de vencimientos con semáforo.</li><li>Definir indicadores de control.</li></ul>
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
  <tr><td>Organización</td><td>25 %</td><td>Estructura por registro, codificación y series con retención.</td><td>Organización parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Matriz</td><td>40 %</td><td>Fechas límite de radicación (al menos un mes antes) con alertas de preparación y semáforo.</td><td>Matriz sin fechas límite.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores</td><td>25 %</td><td>Indicadores medibles con meta y responsable.</td><td>Indicadores generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evgdoc_html$;
  v_t3 := $evgdoc_html$<h2>Caso de estudio</h2>
<p>Laboratorios Valle Alto (ficticia) tiene 25 registros sanitarios (datos simulados), tres de ellos de fitoterapéuticos con vigencia temporal que vencen en 4, 9 y 14 meses; certificados de BPM de dos fabricantes extranjeros que vencen en 3 y 7 meses; y poderes de cinco años de antigüedad. El archivo está en carpetas por persona, sin codificación.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evgdoc_html$;
  v_t4 := 'Tablero de control documental con matriz e indicadores.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evgdoc_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 1755 de 2015 (arts. 13, 14, 16 a 18); Ley 1437 de 2011, CPACA (art. 56); Decreto 334 de 2022 (art. 4); Ley 594 de 2000 (Ley General de Archivos); Ley 455 de 1998 (Convención de La Haya sobre la apostilla); manual tarifario e instructivos vigentes del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evgdoc_html$;
  v_t7 := NULL;
  v_j1 := $evgdoc_json$["Estructura y codificación.","Series y retención.","Matriz de vencimientos.","Priorización.","Indicadores."]$evgdoc_json$::jsonb;
  v_j2 := $evgdoc_json${"version":1,"total":100,"criteria":[{"id":"organizacion","name":"Organización","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Estructura por registro, codificación y series con retención."},{"level":3,"label":"Logrado","description":"Organización parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"matriz","name":"Matriz","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Fechas límite de radicación (al menos un mes antes) con alertas de preparación y semáforo."},{"level":3,"label":"Logrado","description":"Matriz sin fechas límite."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores","name":"Indicadores","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Indicadores medibles con meta y responsable."},{"level":3,"label":"Logrado","description":"Indicadores generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evgdoc_json$::jsonb;
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


  -- ── Actividad gdoc-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Documentos legales, apostilla, legalización y traducción oficial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Documentos legales, apostilla, legalización y traducción oficial) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: verificación, seguimiento y paquete legal del fitoterapéutico';
  v_t2 := $evgdoc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define las fechas (ficticias) de vencimiento y radicación.</li><li>Fase 1: diseña la lista de verificación previa (formulario, tarifa del manual vigente, pago, soportes).</li><li>Fase 2: verifica el estado del registro en bases públicas y define el control de notificaciones.</li><li>Fase 3: lista los documentos legales y define apostilla o legalización para cada país.</li><li>Fase 3: define el orden de traducción oficial y el cronograma.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (plataforma).</strong> Verificación previa, tarifa y pago.</li>
  <li><strong>Fase 2 · Unidad 2 (seguimiento).</strong> Estado del registro en bases públicas y control de notificaciones.</li>
  <li><strong>Fase 3 · Unidad 3 (documentos legales).</strong> Paquete legal, apostilla, legalización y traducción.</li>
  <li><strong>Fase 4 · Unidad 4 (expediente y vencimientos).</strong> Expediente, versiones y matriz.</li>
  <li><strong>Fase 5 · Unidad 5 (indicadores y peticiones).</strong> Seguimiento, indicadores y derecho de petición.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Preparar la radicación sin rechazos.</li><li>Planear el paquete legal con su cadena de legalización.</li></ul>
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
  <tr><td>Radicación</td><td>25 %</td><td>Lista de verificación completa y coherencia tarifa-pago-soportes.</td><td>Lista parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Seguimiento</td><td>25 %</td><td>Verificación en bases públicas y buzón institucional con responsables.</td><td>Seguimiento general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Paquete legal</td><td>40 %</td><td>Apostilla para el país parte y legalización consular para el otro, traducción oficial y cronograma que permite radicar al menos un mes antes.</td><td>Paquete con errores de cadena.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evgdoc_html$;
  v_t3 := $evgdoc_html$<h2>Caso de estudio</h2>
<p>Importadora Altamar (ficticia) debe renovar el registro de un fitoterapéutico con vigencia temporal que vence en seis meses y, al mismo tiempo, incluir un nuevo importador (datos simulados). El fabricante está en un país parte de la Convención de La Haya; el acondicionador, en uno que no lo es. Te encargan la gestión documental completa. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evgdoc_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evgdoc_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 1755 de 2015 (arts. 13, 14, 16 a 18); Ley 1437 de 2011, CPACA (art. 56); Decreto 334 de 2022 (art. 4); Ley 594 de 2000 (Ley General de Archivos); Ley 455 de 1998 (Convención de La Haya sobre la apostilla); manual tarifario e instructivos vigentes del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evgdoc_html$;
  v_t7 := NULL;
  v_j1 := $evgdoc_json$["Verificación previa.","Estado y notificaciones.","Documentos legales.","Apostilla y legalización.","Cronograma."]$evgdoc_json$::jsonb;
  v_j2 := $evgdoc_json${"version":1,"total":100,"criteria":[{"id":"radicacion","name":"Radicación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Lista de verificación completa y coherencia tarifa-pago-soportes."},{"level":3,"label":"Logrado","description":"Lista parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguimiento","name":"Seguimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Verificación en bases públicas y buzón institucional con responsables."},{"level":3,"label":"Logrado","description":"Seguimiento general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"paquete-legal","name":"Paquete legal","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Apostilla para el país parte y legalización consular para el otro, traducción oficial y cronograma que permite radicar al menos un mes antes."},{"level":3,"label":"Logrado","description":"Paquete con errores de cadena."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evgdoc_json$::jsonb;
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


  -- ── Actividad gdoc-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Herramientas digitales, indicadores y derechos de petición' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Herramientas digitales, indicadores y derechos de petición) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: expediente, matriz e indicadores del fitoterapéutico';
  v_t2 := $evgdoc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: organiza el expediente con codificación, versiones y retención.</li><li>Fase 4: construye la matriz de vencimientos del registro y sus documentos.</li><li>Fase 5: define los indicadores del proceso.</li><li>Fase 5: redacta un derecho de petición de información para el caso de demora.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (plataforma).</strong> Verificación previa, tarifa y pago.</li>
  <li><strong>Fase 2 · Unidad 2 (seguimiento).</strong> Estado del registro en bases públicas y control de notificaciones.</li>
  <li><strong>Fase 3 · Unidad 3 (documentos legales).</strong> Paquete legal, apostilla, legalización y traducción.</li>
  <li><strong>Fase 4 · Unidad 4 (expediente y vencimientos).</strong> Expediente, versiones y matriz.</li>
  <li><strong>Fase 5 · Unidad 5 (indicadores y peticiones).</strong> Seguimiento, indicadores y derecho de petición.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Organizar el expediente y la matriz de vencimientos.</li><li>Definir el seguimiento con indicadores y derecho de petición.</li></ul>
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
  <tr><td>Expediente y matriz</td><td>30 %</td><td>Expediente codificado con versiones y matriz con fechas límite.</td><td>Expediente o matriz incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores</td><td>20 %</td><td>Indicadores medibles con meta y responsable.</td><td>Indicadores generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Derecho de petición</td><td>25 %</td><td>Petición con los requisitos del art. 16 y plazos del art. 14.</td><td>Petición incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evgdoc_html$;
  v_t3 := $evgdoc_html$<h2>Caso de estudio</h2>
<p>Importadora Altamar (ficticia) debe renovar el registro de un fitoterapéutico con vigencia temporal que vence en seis meses y, al mismo tiempo, incluir un nuevo importador (datos simulados). El fabricante está en un país parte de la Convención de La Haya; el acondicionador, en uno que no lo es. Te encargan la gestión documental completa. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan de gestión documental que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evgdoc_html$;
  v_t4 := 'Plan de gestión documental con matriz, indicadores, petición y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evgdoc_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 1755 de 2015 (arts. 13, 14, 16 a 18); Ley 1437 de 2011, CPACA (art. 56); Decreto 334 de 2022 (art. 4); Ley 594 de 2000 (Ley General de Archivos); Ley 455 de 1998 (Convención de La Haya sobre la apostilla); manual tarifario e instructivos vigentes del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evgdoc_html$;
  v_t7 := NULL;
  v_j1 := $evgdoc_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Expediente.","Matriz de vencimientos.","Indicadores.","Derecho de petición y resumen."]$evgdoc_json$::jsonb;
  v_j2 := $evgdoc_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"expediente-y-matriz","name":"Expediente y matriz","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Expediente codificado con versiones y matriz con fechas límite."},{"level":3,"label":"Logrado","description":"Expediente o matriz incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores","name":"Indicadores","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Indicadores medibles con meta y responsable."},{"level":3,"label":"Logrado","description":"Indicadores generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"derecho-de-peticion","name":"Derecho de petición","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Petición con los requisitos del art. 16 y plazos del art. 14."},{"level":3,"label":"Logrado","description":"Petición incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evgdoc_json$::jsonb;
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


  -- ── Foro gdoc-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con trámites ante el Invima';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evgdoc_html$<h2>Para empezar</h2>
<p>Piensa en un trámite que hayas radicado, seguido o archivado y cuéntanos en tres o cuatro líneas qué fue lo más difícil, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evgdoc_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría organizar mejor al terminarlo?';
  v_t5 := $evgdoc_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evgdoc_html$;
  v_t6 := $evgdoc_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evgdoc_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has tenido un rechazo por un error documental?', '¿Cómo controlas hoy los vencimientos?']::text[];
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


  -- ── Foro gdoc-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. El área regulatoria como gestor documental y la plataforma de trámites del INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. El área regulatoria como gestor documental y la plataforma de trámites del INVIMA) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Rechazos que se pudieron evitar';
  v_t2 := 'Argumentar qué controles previos a la radicación reducen los rechazos.';
  v_t3 := $evgdoc_html$<h2>Caso del foro</h2>
<p>Un área regulatoria ficticia tuvo ocho rechazos en un trimestre (datos simulados): tres por tarifa errada, dos por certificados vencidos, dos por formularios sin firma y uno por un poder sin facultades. Cada rechazo exigió un nuevo pago.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evgdoc_html$;
  v_t4 := '¿Qué controles implementarías y cómo medirías su efecto?';
  v_t5 := $evgdoc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o el instructivo que sustenta cada control. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evgdoc_html$;
  v_t6 := $evgdoc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el instructivo que sustenta cada control.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evgdoc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué incluiría una lista de verificación previa?', '¿Quién debería hacer la verificación cruzada?', '¿Qué indicador usarías?']::text[];
  v_j1 := $evgdoc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el instructivo que sustenta cada control."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evgdoc_json$::jsonb;
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


  -- ── Foro gdoc-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Seguimiento de trámites, notificaciones y bases de datos públicas del INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Seguimiento de trámites, notificaciones y bases de datos públicas del INVIMA) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Auditar el portafolio con datos públicos';
  v_t2 := 'Argumentar cómo usar las bases públicas del Invima para controlar un portafolio.';
  v_t3 := $evgdoc_html$<h2>Caso del foro</h2>
<p>Una empresa ficticia con 40 registros nunca ha cruzado su archivo interno con las bases públicas (datos simulados). El gerente pregunta si «vale la pena», porque «el archivo interno siempre ha funcionado».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evgdoc_html$;
  v_t4 := '¿Qué le responderías y qué cruces harías primero?';
  v_t5 := $evgdoc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la fuente pública que sustenta cada cruce. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evgdoc_html$;
  v_t6 := $evgdoc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la fuente pública que sustenta cada cruce.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evgdoc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué información pública sirve para el cruce?', '¿Qué discrepancias son más críticas?', '¿Con qué frecuencia harías la auditoría?']::text[];
  v_j1 := $evgdoc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la fuente pública que sustenta cada cruce."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evgdoc_json$::jsonb;
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


  -- ── Foro gdoc-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Documentos legales, apostilla, legalización y traducción oficial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Documentos legales, apostilla, legalización y traducción oficial) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · La cadena de legalización';
  v_t2 := 'Argumentar cómo planear la legalización de un paquete documental extranjero.';
  v_t3 := $evgdoc_html$<h2>Caso del foro</h2>
<p>Un importador ficticio debe renovar un registro con documentos de un fabricante en un país parte de la Convención de La Haya y de otro que no lo es (datos simulados). Faltan cinco semanas para radicar y nadie ha iniciado el trámite de los documentos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evgdoc_html$;
  v_t4 := '¿Cómo planearías la cadena y qué harías si no alcanza el tiempo?';
  v_t5 := $evgdoc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada paso. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evgdoc_html$;
  v_t6 := $evgdoc_html$<h2>Normas de participación</h2>
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
</details>$evgdoc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué documento requiere apostilla y cuál legalización?', '¿En qué orden van la apostilla y la traducción?', '¿Qué controles evitarían esta urgencia?']::text[];
  v_j1 := $evgdoc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada paso."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evgdoc_json$::jsonb;
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


  -- ── Foro gdoc-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Organización del expediente regulatorio, archivo y control de vencimientos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Organización del expediente regulatorio, archivo y control de vencimientos) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · El semáforo que nadie mira';
  v_t2 := 'Argumentar cómo hacer que una matriz de vencimientos funcione en la práctica.';
  v_t3 := $evgdoc_html$<h2>Caso del foro</h2>
<p>Un área regulatoria ficticia tiene una matriz de vencimientos en Excel con semáforo, pero un registro con vigencia temporal se venció porque «nadie la revisó» (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evgdoc_html$;
  v_t4 := '¿Qué cambiarías para que la matriz realmente prevenga vencimientos?';
  v_t5 := $evgdoc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta las fechas. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evgdoc_html$;
  v_t6 := $evgdoc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta las fechas.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evgdoc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué fechas debe incluir la matriz?', '¿Con qué antelación deben activarse las alertas?', '¿Quién debe revisar la matriz y con qué frecuencia?']::text[];
  v_j1 := $evgdoc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta las fechas."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evgdoc_json$::jsonb;
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


  -- ── Foro gdoc-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Herramientas digitales, indicadores y derechos de petición' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Herramientas digitales, indicadores y derechos de petición) en Gestión Documental de Trámites ante el INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Excel o sistema RIM';
  v_t2 := 'Argumentar qué herramienta conviene según el tamaño del portafolio.';
  v_t3 := $evgdoc_html$<h2>Caso del foro</h2>
<p>Una empresa ficticia con 15 registros duda entre comprar un sistema RIM o mejorar su hoja de cálculo (datos simulados). El presupuesto es limitado y el equipo es de dos personas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evgdoc_html$;
  v_t4 := '¿Qué recomendarías y qué controles mínimos exigirías?';
  v_t5 := $evgdoc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la buena práctica que sustenta tu recomendación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evgdoc_html$;
  v_t6 := $evgdoc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la buena práctica que sustenta tu recomendación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evgdoc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué funciones mínimas debe tener la herramienta?', '¿Qué riesgos tiene una hoja de cálculo sin control?', '¿Cuándo se justifica un RIM?']::text[];
  v_j1 := $evgdoc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la buena práctica que sustenta tu recomendación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evgdoc_json$::jsonb;
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


  RAISE NOTICE 'Gestión Documental de Trámites ante el INVIMA: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evgdoc$;

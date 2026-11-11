-- ============================================================
--  108_quices_actividades_foros_regulatorios7.sql — quizzes, actividades y foros, lote «regulatorios7»
--
--  Generado por scripts/evaluacion-aula.mjs regulatorios7 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Registro Sanitario de Vacunas; Registro Sanitario de Productos Fitoterapéuticos.
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
--  Curso de Registro Sanitario de Vacunas
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evvacu$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Registro Sanitario de Vacunas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Las vacunas como medicamentos biológicos: marco regulatorio y plataformas', 'Unidad 2. Desarrollo clínico y calidad de vacunas', 'Unidad 3. Liberación lote a lote, precalificación OMS y PAI', 'Unidad 4. Autorización sanitaria de uso de emergencia (ASUE): el caso COVID-19', 'Unidad 5. Farmacovigilancia de vacunas, ESAVI y cadena de frío']::text[])) < 5 THEN
    RAISE NOTICE 'Registro Sanitario de Vacunas: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evvacu_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evvacu_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz vacu-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Las vacunas como medicamentos biológicos: marco regulatorio y plataformas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Las vacunas como medicamentos biológicos: marco regulatorio y plataformas) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Las vacunas como medicamentos biológicos: marco regulatorio y plataformas';
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


    v_t3 := '¿Qué distingue a las vacunas dentro de los medicamentos biológicos desde el punto de vista regulatorio?';
    v_t4 := 'Las vacunas se aplican sobre todo a personas sanas, muchas veces a poblaciones completas, por lo que la tolerancia al riesgo es baja; además, el artículo 25 del Decreto 1782 exige la liberación de cada lote por el Invima antes de comercializarlo.';
    v_j1 := $evvacu_json${"external_id":"vacu-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción al curso: por qué las vacunas tienen un régimen propio","outcome":"Introducción al curso: por qué las vacunas tienen un régimen propio","source":"Decreto 1782 de 2014, art. 25."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que se usan sobre todo en personas sanas, en poblaciones masivas y con liberación lote a lote.', TRUE, 'Correcto. Por eso la tolerancia al riesgo es menor.', 0),
      (v_pregunta, 'Que no requieren ensayos clínicos porque su mecanismo de acción ya es bien conocido por la ciencia.', FALSE, 'Sí requieren ensayos clínicos.', 1),
      (v_pregunta, 'Que se registran como medicamentos de síntesis química porque contienen antígenos purificados.', FALSE, 'Las vacunas son medicamentos biológicos.', 2),
      (v_pregunta, 'Que su venta es libre en droguerías y no necesitan farmacovigilancia después del registro.', FALSE, 'Requieren vigilancia estricta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una vacuna conjugada importada, con estudios propios, se va a registrar. ¿Qué ruta del Decreto 1782 corresponde en principio?';
    v_t4 := 'Con estudios preclínicos y clínicos propios, la ruta es la de expediente completo (art. 7). La evaluación farmacológica corresponde a la Sala Especializada (art. 4) y después se aplican la evaluación farmacéutica y legal; cada lote se libera según el art. 25.';
    v_j1 := $evvacu_json${"external_id":"vacu-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Decreto 1782 de 2014: rutas de evaluación y artículos específicos para vacunas","outcome":"Decreto 1782 de 2014: rutas de evaluación y artículos específicos para vacunas","source":"Decreto 1782 de 2014, arts. 4, 7 y 25."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La ruta abreviada, porque todas las vacunas tienen amplia experiencia clínica en el mundo.', FALSE, 'La abreviada tiene condiciones estrictas.', 0),
      (v_pregunta, 'La de comparabilidad, aunque no haya un medicamento de referencia con el mismo antígeno.', FALSE, 'Sin referente no hay comparabilidad.', 1),
      (v_pregunta, 'La de expediente completo, con estudios preclínicos y clínicos propios.', TRUE, 'Correcto. Con la información común del art. 6.', 2),
      (v_pregunta, 'Ninguna, porque las vacunas importadas solo requieren el certificado de venta libre del país de origen.', FALSE, 'Se requiere evaluación completa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué diferencia una vacuna viva atenuada de una inactivada desde el punto de vista regulatorio y de uso?';
    v_t4 := 'Las vacunas vivas atenuadas contienen microorganismos capaces de replicarse, lo que genera respuestas robustas pero implica contraindicaciones (inmunosupresión, embarazo) y exigencias de estabilidad y cadena de frío. Las inactivadas no se replican y suelen requerir adyuvantes y refuerzos.';
    v_j1 := $evvacu_json${"external_id":"vacu-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Plataformas clásicas: vivas atenuadas, inactivadas, toxoides, polisacáridas, conjugadas y recombinantes","outcome":"Plataformas clásicas: vivas atenuadas, inactivadas, toxoides, polisacáridas, conjugadas y recombinantes","source":"Recomendaciones de la OMS para vacunas (TRS)."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La inactivada siempre produce inmunidad de por vida con una sola dosis y no requiere refuerzos.', FALSE, 'No es una regla general.', 0),
      (v_pregunta, 'La viva atenuada puede replicarse; se contraindica en inmunosuprimidos y gestantes.', TRUE, 'Correcto. Exige además cuidado en estabilidad.', 1),
      (v_pregunta, 'No hay diferencias, porque ambas contienen el mismo tipo de antígeno purificado y se controlan igual.', FALSE, 'Son plataformas distintas.', 2),
      (v_pregunta, 'La viva atenuada no requiere cadena de frío porque el microorganismo está vivo y se conserva solo.', FALSE, 'Es especialmente sensible a la temperatura.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una vacuna de ARNm encapsulada en nanopartículas lipídicas se presenta con el mismo paquete de calidad de una vacuna inactivada. ¿Cuál es la mejor valoración?';
    v_t4 := 'Las vacunas de ARNm plantean atributos de calidad propios: integridad y pureza del ARN, eficiencia de encapsulación, tamaño y composición de las nanopartículas lipídicas, y estabilidad a temperaturas muy bajas. El paquete de calidad debe adaptarse a la plataforma.';
    v_j1 := $evvacu_json${"external_id":"vacu-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Nuevas plataformas: ARNm, vectores virales y ADN","outcome":"Nuevas plataformas: ARNm, vectores virales y ADN","source":"Guías de la OMS para vacunas de ARNm; ICH Q5C."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuado, porque todas las vacunas comparten exactamente los mismos atributos críticos de calidad.', FALSE, 'Cada plataforma tiene atributos propios.', 0),
      (v_pregunta, 'Es adecuado si la vacuna ya se aplicó a millones de personas en otros países del mundo.', FALSE, 'El uso no reemplaza el paquete de calidad.', 1),
      (v_pregunta, 'Es inadecuado solo porque las vacunas de ARNm no requieren control de calidad alguno.', FALSE, 'Sí lo requieren, con atributos propios.', 2),
      (v_pregunta, 'Es insuficiente: la plataforma exige caracterizar el ARN, las nanopartículas y su estabilidad.', TRUE, 'Correcto. Integridad, encapsulación, tamaño.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz vacu-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Desarrollo clínico y calidad de vacunas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Desarrollo clínico y calidad de vacunas) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Desarrollo clínico y calidad de vacunas';
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


    v_t3 := '¿Qué objetivo principal tienen los ensayos de fase III de una vacuna?';
    v_t4 := 'La fase I evalúa seguridad inicial en pocos voluntarios; la fase II, dosis y esquema; la fase III confirma eficacia (o inmunogenicidad con un correlato aceptado) y seguridad en miles de personas; la fase IV vigila después de la comercialización.';
    v_j1 := $evvacu_json${"external_id":"vacu-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Fases del desarrollo clínico de vacunas (I a IV)","outcome":"Fases del desarrollo clínico de vacunas (I a IV)","source":"Guías de la OMS sobre evaluación clínica de vacunas."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Probar por primera vez la vacuna en humanos para evaluar su seguridad inicial en pocos voluntarios.', FALSE, 'Eso corresponde a la fase I.', 0),
      (v_pregunta, 'Seleccionar la dosis y el esquema en algunos cientos de personas de la población objetivo.', FALSE, 'Eso corresponde sobre todo a la fase II.', 1),
      (v_pregunta, 'Vigilar la seguridad después de la comercialización en la población general vacunada.', FALSE, 'Eso corresponde a la fase IV.', 2),
      (v_pregunta, 'Confirmar eficacia o inmunogenicidad y seguridad en miles de personas.', TRUE, 'Correcto. Es la fase confirmatoria.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Cuándo puede aceptarse la inmunogenicidad en lugar de un ensayo de eficacia clínica?';
    v_t4 := 'Cuando existe un correlato inmunológico de protección establecido, la autoridad puede aceptar datos de inmunogenicidad en lugar de un ensayo de eficacia, a menudo con compromisos posaprobación (efectividad, seguridad).';
    v_j1 := $evvacu_json${"external_id":"vacu-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Inmunogenicidad, eficacia y correlatos de protección","outcome":"Inmunogenicidad, eficacia y correlatos de protección","source":"Guías de la OMS sobre evaluación clínica de vacunas."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Siempre, porque medir anticuerpos es más rápido y barato que un ensayo de eficacia en la población.', FALSE, 'Requiere un correlato aceptado.', 0),
      (v_pregunta, 'Cuando existe un correlato inmunológico de protección establecido para esa enfermedad.', TRUE, 'Correcto. Con compromisos posaprobación.', 1),
      (v_pregunta, 'Nunca, porque la autoridad sanitaria exige un ensayo de eficacia para todas las vacunas.', FALSE, 'Se acepta cuando hay correlato.', 2),
      (v_pregunta, 'Solo cuando la vacuna se fabrica en un país con agencia de referencia reconocida.', FALSE, 'El origen no define la evidencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una vacuna cambia su vida útil y su condición de almacenamiento. ¿Qué análisis es correcto sobre la estabilidad?';
    v_t4 := 'La Resolución 3690 de 2016, ICH Q5C y la guía de la OMS sobre estabilidad de vacunas basan la vida útil en datos reales en las condiciones propuestas, con atributos indicadores como la potencia.';
    v_j1 := $evvacu_json${"external_id":"vacu-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"ICH Q5 y estabilidad de vacunas","outcome":"ICH Q5 y estabilidad de vacunas","source":"Resolución 3690 de 2016; ICH Q5C; OMS TRS 962."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se requieren datos reales en las condiciones propuestas, con atributos indicadores como la potencia.', TRUE, 'Correcto. Según la guía de biológicos y la OMS.', 0),
      (v_pregunta, 'Basta con un estudio acelerado corto, porque las vacunas son muy estables a cualquier temperatura.', FALSE, 'Las vacunas son sensibles.', 1),
      (v_pregunta, 'No se requieren estudios si la vacuna ya se usa en el programa nacional de inmunización.', FALSE, 'El uso no reemplaza los datos.', 2),
      (v_pregunta, 'Se extrapola la vida útil al doble del tiempo estudiado, como en las tabletas.', FALSE, 'En biológicos se usan datos reales.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un fabricante traslada la producción de una vacuna a otra planta y propone comercializar sin estudios porque «el proceso es el mismo». ¿Cuál es la mejor valoración?';
    v_t4 := 'Un cambio de sitio de fabricación de una vacuna puede afectar sus atributos; ICH Q5E y la guía de la OMS sobre cambios a vacunas aprobadas exigen demostrar comparabilidad y tramitar la modificación según su nivel de riesgo.';
    v_j1 := $evvacu_json${"external_id":"vacu-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: cambio de sitio de fabricación de una vacuna y su modificación ante INVIMA","outcome":"Caso práctico: cambio de sitio de fabricación de una vacuna y su modificación ante INVIMA","source":"ICH Q5E; OMS TRS 993."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es aceptable, porque un traslado no afecta un biológico si el procedimiento escrito es idéntico.', FALSE, 'En biológicos el sitio puede influir.', 0),
      (v_pregunta, 'Es aceptable si la nueva planta tiene un certificado de BPM vigente de cualquier autoridad.', FALSE, 'La BPM no reemplaza la comparabilidad.', 1),
      (v_pregunta, 'Es inaceptable: se requiere comparabilidad (ICH Q5E) y tramitar la modificación según su riesgo.', TRUE, 'Correcto. Según ICH Q5E y la OMS.', 2),
      (v_pregunta, 'Es inaceptable solo si la vacuna se aplica en niños menores de un año.', FALSE, 'Aplica a todas las vacunas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz vacu-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Liberación lote a lote, precalificación OMS y PAI' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Liberación lote a lote, precalificación OMS y PAI) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Liberación lote a lote, precalificación OMS y PAI';
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


    v_t3 := 'Según el artículo 25 del Decreto 1782, ¿qué debe presentar el titular antes de comercializar cada lote de vacuna?';
    v_t4 := 'El artículo 25 exige presentar al Invima, antes de comercializar cada lote de vacunas y hemoderivados, un informe resumido de producción con el certificado de análisis del producto terminado y muestras para análisis cuando se requiera; la comercialización depende de la aprobación de la liberación.';
    v_j1 := $evvacu_json${"external_id":"vacu-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Marco legal: artículo 25 del Decreto 1782 y Resolución 22392 de 2010","outcome":"Marco legal: artículo 25 del Decreto 1782 y Resolución 22392 de 2010","source":"Decreto 1782 de 2014, art. 25."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo la factura de compra del lote y el certificado de origen de la mercancía importada.', FALSE, 'No es lo que exige el artículo.', 0),
      (v_pregunta, 'Un informe de ventas del lote anterior y la proyección de la demanda del año siguiente.', FALSE, 'No es lo que exige el artículo.', 1),
      (v_pregunta, 'Un informe resumido de producción con el certificado de análisis y muestras cuando se requiera.', TRUE, 'Correcto. La comercialización depende de la liberación.', 2),
      (v_pregunta, 'Ningún documento, porque la liberación la hace el fabricante en su país de origen.', FALSE, 'La liberación la aprueba el Invima.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Llega un lote importado de vacuna. ¿Qué documento es central en el paquete de liberación?';
    v_t4 := 'El paquete de liberación se centra en el informe o protocolo resumido de producción y control del lote, con el certificado de análisis; suele acompañarse del certificado de liberación de la autoridad del país de origen y de los datos de cadena de frío del envío.';
    v_j1 := $evvacu_json${"external_id":"vacu-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso práctico: preparar el expediente de liberación de un lote importado","outcome":"Caso práctico: preparar el expediente de liberación de un lote importado","source":"Decreto 1782 de 2014, art. 25; recomendaciones de la OMS sobre liberación de lotes."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El protocolo resumido de producción y control del lote, con su certificado de análisis.', TRUE, 'Correcto. Con soportes de la autoridad de origen.', 0),
      (v_pregunta, 'La publicidad que se usará para promocionar la vacuna en el mercado privado.', FALSE, 'No es parte del paquete.', 1),
      (v_pregunta, 'El contrato laboral de los vacunadores que aplicarán el lote en el programa.', FALSE, 'No es parte del paquete.', 2),
      (v_pregunta, 'La lista de precios del distribuidor mayorista que comprará el lote.', FALSE, 'No es parte del paquete.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué papel tiene la precalificación de la OMS en el suministro de vacunas?';
    v_t4 := 'La precalificación de la OMS evalúa que una vacuna cumpla estándares de calidad, seguridad y eficacia para que agencias de las Naciones Unidas puedan adquirirla; se apoya en una autoridad reguladora funcional en el país productor y no reemplaza la regulación nacional.';
    v_j1 := $evvacu_json${"external_id":"vacu-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Precalificación de vacunas por la OMS","outcome":"Precalificación de vacunas por la OMS","source":"OMS, procedimiento de precalificación de vacunas (TRS 978, anexo 6)."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Reemplaza el registro sanitario del Invima en todos los casos de compra pública.', FALSE, 'No reemplaza la regulación nacional.', 0),
      (v_pregunta, 'Certifica calidad, seguridad y eficacia para que agencias de la ONU puedan comprar la vacuna.', TRUE, 'Correcto. Se apoya en la autoridad del país productor.', 1),
      (v_pregunta, 'Fija el precio de venta de las vacunas en cada uno de los países de la región.', FALSE, 'La precalificación no fija precios.', 2),
      (v_pregunta, 'Autoriza a cualquier fabricante a vender sin control de lotes en los países compradores.', FALSE, 'El control de lotes continúa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un lote llega por compra conjunta con precalificación de la OMS y un funcionario propone distribuirlo sin liberación del Invima. ¿Cuál es la mejor valoración?';
    v_t4 := 'El artículo 25 condiciona la comercialización de cada lote a la aprobación de su liberación por el Invima, que aplica criterios de priorización y procedimientos propios. La precalificación facilita el proceso documental, pero no elimina la liberación nacional.';
    v_j1 := $evvacu_json${"external_id":"vacu-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Fondo Rotatorio de la OPS: compra conjunta de vacunas","outcome":"Fondo Rotatorio de la OPS: compra conjunta de vacunas","source":"Decreto 1782 de 2014, art. 25."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcto, porque la precalificación de la OMS reemplaza la liberación de lotes nacional.', FALSE, 'La precalificación no la reemplaza.', 0),
      (v_pregunta, 'Es correcto si el lote es urgente para una campaña de vacunación del programa nacional.', FALSE, 'La urgencia no elimina la obligación.', 1),
      (v_pregunta, 'Es correcto si el lote viene con certificado del fabricante firmado por su director de calidad.', FALSE, 'El certificado del fabricante no basta.', 2),
      (v_pregunta, 'Debe surtirse la liberación que exige el artículo 25, con el procedimiento que fije el Invima.', TRUE, 'Correcto. Lo exige el artículo 25.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz vacu-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Autorización sanitaria de uso de emergencia (ASUE): el caso COVID-19' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Autorización sanitaria de uso de emergencia (ASUE): el caso COVID-19) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Autorización sanitaria de uso de emergencia (ASUE): el caso COVID-19';
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


    v_t3 := 'Según el Decreto 1787 de 2020, ¿qué es la Autorización Sanitaria de Uso de Emergencia (ASUE)?';
    v_t4 := 'El Decreto 1787 de 2020 define la ASUE como un acto del Invima que permite un uso temporal y condicionado de medicamentos para la Covid-19 sin toda la información del registro, con estudios clínicos en curso y un balance beneficio-riesgo favorable (art. 4).';
    v_j1 := $evvacu_json${"external_id":"vacu-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Decreto 1787 de 2020: requisitos, procedimiento y vigencia de la ASUE","outcome":"Decreto 1787 de 2020: requisitos, procedimiento y vigencia de la ASUE","source":"Decreto 1787 de 2020, arts. 1 y 4."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un registro sanitario definitivo que se otorga sin evaluación a cualquier medicamento importado.', FALSE, 'No es definitivo ni sin evaluación.', 0),
      (v_pregunta, 'Un permiso de importación para donaciones que no requiere ninguna evaluación de beneficio-riesgo.', FALSE, 'Exige beneficio-riesgo favorable.', 1),
      (v_pregunta, 'Un acto del Invima que permite un uso temporal y condicionado, con beneficio-riesgo favorable.', TRUE, 'Correcto. Con estudios clínicos en curso.', 2),
      (v_pregunta, 'Una certificación de buenas prácticas para plantas que fabrican medicamentos de emergencia.', FALSE, 'No es una certificación de BPM.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Según el Decreto 1787 de 2020, ¿cuánto dura una ASUE y cómo se renueva?';
    v_t4 := 'El artículo 9 del Decreto 1787 de 2020 fija una vigencia de un año desde la ejecutoria, renovable una sola vez por igual término; la solicitud de renovación se presenta con hasta 30 días hábiles de antelación al vencimiento.';
    v_j1 := $evvacu_json${"external_id":"vacu-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Decreto 1787 de 2020: requisitos, procedimiento y vigencia de la ASUE","outcome":"Decreto 1787 de 2020: requisitos, procedimiento y vigencia de la ASUE","source":"Decreto 1787 de 2020, art. 9."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un año desde la ejecutoria, renovable una sola vez por igual término.', TRUE, 'Correcto. Así lo fija el artículo 9.', 0),
      (v_pregunta, 'Cinco años, igual que los registros sanitarios de medicamentos biológicos.', FALSE, 'Es temporal y más corta.', 1),
      (v_pregunta, 'Indefinidamente, mientras el titular pague la tarifa anual de mantenimiento.', FALSE, 'La autorización es temporal.', 2),
      (v_pregunta, 'Seis meses, sin ninguna posibilidad de renovación por parte del titular.', FALSE, 'Dura un año y puede renovarse.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué obligaciones tiene el titular de una ASUE según el Decreto 1787 de 2020?';
    v_t4 := 'El artículo 13 exige completar los estudios en curso y los que pida el Invima, cumplir los planes de gestión de riesgos y la farmacovigilancia activa, mantener informado al Invima e informar de inmediato cambios en el beneficio-riesgo; además, garantizar la trazabilidad (art. 19) y cumplir el cronograma de entrega progresiva de información.';
    v_j1 := $evvacu_json${"external_id":"vacu-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Obligaciones del titular de una ASUE: análisis de resoluciones CoronaVac y Moderna","outcome":"Obligaciones del titular de una ASUE: análisis de resoluciones CoronaVac y Moderna","source":"Decreto 1787 de 2020, arts. 13 y 19."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Ninguna, porque la emergencia exime al titular de las obligaciones habituales.', FALSE, 'Tiene obligaciones explícitas.', 0),
      (v_pregunta, 'Solo pagar la tarifa y entregar el producto en el plazo pactado con el Ministerio.', FALSE, 'Las obligaciones son técnicas.', 1),
      (v_pregunta, 'Solo publicar información sobre el producto en su página web para los profesionales.', FALSE, 'Las obligaciones son más amplias.', 2),
      (v_pregunta, 'Completar estudios, cumplir el plan de riesgo y la farmacovigilancia e informar.', TRUE, 'Correcto. También entrega progresiva de datos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un documento de 2026 cita el Decreto 1787 de 2020 como «vigente» sin más análisis. ¿Cuál es la mejor valoración?';
    v_t4 := 'El normograma del Invima anota que el Decreto 1787 de 2020 estuvo vigente hasta el 29 de junio de 2022. Antes de citarlo como vigente se verifica su estado y las normas que regularon después las autorizaciones de emergencia o la transición al registro.';
    v_j1 := $evvacu_json${"external_id":"vacu-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"De la ASUE al registro sanitario: lecciones y verificación de vigencia","outcome":"De la ASUE al registro sanitario: lecciones y verificación de vigencia","source":"Decreto 1787 de 2020 y su nota de vigencia en el normograma del Invima."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcto, porque los decretos de emergencia nunca pierden vigencia una vez expedidos.', FALSE, 'Pueden tener vigencia limitada.', 0),
      (v_pregunta, 'Hay que verificarlo: el normograma anota vigencia hasta junio de 2022.', TRUE, 'Correcto. Se revisa la norma posterior antes de citarla.', 1),
      (v_pregunta, 'Es correcto si el documento lo escribió un abogado con experiencia en derecho sanitario.', FALSE, 'La autoría no verifica la vigencia.', 2),
      (v_pregunta, 'Es incorrecto porque el decreto fue declarado inconstitucional por la Corte en 2020.', FALSE, 'No es lo que muestra la fuente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz vacu-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Farmacovigilancia de vacunas, ESAVI y cadena de frío' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Farmacovigilancia de vacunas, ESAVI y cadena de frío) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Farmacovigilancia de vacunas, ESAVI y cadena de frío';
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


    v_t3 := '¿Qué es un ESAVI en la vigilancia de la seguridad de las vacunas?';
    v_t4 := 'Un evento supuestamente atribuible a la vacunación o inmunización (ESAVI) es cualquier evento adverso que ocurre después de vacunar; no implica necesariamente causalidad. Se clasifica por gravedad y se evalúa su causalidad (vacuna, calidad, error programático, ansiedad, coincidente).';
    v_j1 := $evvacu_json${"external_id":"vacu-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"ESAVI: definiciones, gravedad y clasificación de causalidad","outcome":"ESAVI: definiciones, gravedad y clasificación de causalidad","source":"OMS, clasificación de causalidad de ESAVI."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un evento adverso tras la vacunación que no necesariamente es causado por la vacuna.', TRUE, 'Correcto. Requiere evaluar la causalidad.', 0),
      (v_pregunta, 'Un error de facturación en la compra de vacunas del programa nacional de inmunización.', FALSE, 'No es un evento clínico.', 1),
      (v_pregunta, 'Un estudio de efectividad que se hace antes de aprobar una vacuna nueva.', FALSE, 'Un ESAVI no es un estudio.', 2),
      (v_pregunta, 'Una excursión de temperatura en la cadena de frío durante el transporte.', FALSE, 'Es un evento en personas vacunadas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Varios niños presentan abscesos en el sitio de inyección tras vacunarse en el mismo puesto con viales multidosis. ¿Qué causa es más probable?';
    v_t4 := 'Un agrupamiento de abscesos en un mismo puesto con viales multidosis sugiere un error programático (contaminación, técnica, manejo del vial). Se investiga el puesto, se retiran los viales sospechosos y se notifica.';
    v_j1 := $evvacu_json${"external_id":"vacu-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"ESAVI: definiciones, gravedad y clasificación de causalidad","outcome":"ESAVI: definiciones, gravedad y clasificación de causalidad","source":"OMS, clasificación de causalidad de ESAVI."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Una reacción inherente a la vacuna que aparece en todos los vacunados del país.', FALSE, 'Se concentra en un puesto.', 0),
      (v_pregunta, 'Un evento coincidente sin relación con la vacunación ni con el puesto de vacunación.', FALSE, 'El patrón sugiere otra causa.', 1),
      (v_pregunta, 'Una reacción de ansiedad relacionada con el miedo a la inyección en los niños.', FALSE, 'No explica abscesos.', 2),
      (v_pregunta, 'Un error programático, como contaminación del vial o técnica de aplicación inadecuada.', TRUE, 'Correcto. Se investiga el puesto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'El titular de una vacuna recibe la notificación de un ESAVI grave. ¿Qué análisis es correcto sobre sus obligaciones?';
    v_t4 := 'El titular tiene obligaciones de farmacovigilancia activa (Decreto 1782 art. 24): notificar los eventos en los plazos del programa nacional, investigar el caso (lote, calidad, cadena de frío) y evaluar si hay una señal, en coordinación con el INS y el Invima.';
    v_j1 := $evvacu_json${"external_id":"vacu-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso práctico: el titular recibe un ESAVI grave","outcome":"Caso práctico: el titular recibe un ESAVI grave","source":"Decreto 1782 de 2014, art. 24; Programa Nacional de Farmacovigilancia."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No tiene obligaciones, porque los ESAVI son responsabilidad exclusiva del programa nacional.', FALSE, 'El titular tiene obligaciones de farmacovigilancia.', 0),
      (v_pregunta, 'Debe notificar en los plazos del programa de farmacovigilancia, investigar y evaluar si hay una señal.', TRUE, 'Correcto. Coordina con el INS y el Invima.', 1),
      (v_pregunta, 'Debe esperar a que se acumulen varios casos antes de informar cualquier cosa.', FALSE, 'Los casos graves se notifican de inmediato.', 2),
      (v_pregunta, 'Debe retirar todos los lotes del mercado sin ninguna evaluación previa.', FALSE, 'Primero se evalúa el caso.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un lote de vacunas estuvo a 15 °C durante seis horas en un centro de acopio. El coordinador propone aplicarlo «porque se ve normal». ¿Cuál es la mejor valoración?';
    v_t4 := 'Ante una excursión de temperatura, el lote se pone en cuarentena y la decisión se toma con los datos de estabilidad del fabricante, los indicadores de temperatura del vial cuando existen y los lineamientos del PAI; el aspecto físico no demuestra la potencia.';
    v_j1 := $evvacu_json${"external_id":"vacu-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico integrador: excursión de temperatura en un lote de vacunas","outcome":"Caso práctico integrador: excursión de temperatura en un lote de vacunas","source":"OMS TRS 962 y TRS 999; lineamientos del PAI."}$evvacu_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'vacu-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es aceptable, porque el aspecto físico normal demuestra que la potencia de la vacuna no cambió.', FALSE, 'El aspecto no prueba la potencia.', 0),
      (v_pregunta, 'Es aceptable si se aplica rápido, antes de que se pierda más potencia.', FALSE, 'No resuelve el riesgo.', 1),
      (v_pregunta, 'Se pone en cuarentena y se decide con datos de estabilidad e indicadores del vial.', TRUE, 'Correcto. Con registro del evento.', 2),
      (v_pregunta, 'Se destruye siempre, sin necesidad de ninguna evaluación técnica previa.', FALSE, 'Primero se evalúa con datos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad vacu-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Las vacunas como medicamentos biológicos: marco regulatorio y plataformas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Las vacunas como medicamentos biológicos: marco regulatorio y plataformas) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Ruta y requisitos de una vacuna conjugada importada';
  v_t2 := $evvacu_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Define la ruta con el Decreto 1782 y justifícala.</li><li>Lista la información común del artículo 6 adaptada a una vacuna conjugada.</li><li>Describe la secuencia de evaluaciones y quién las hace.</li><li>Explica qué exige el artículo 25 para cada lote importado.</li><li>Describe el plan de gestión de riesgo y la farmacovigilancia (art. 24).</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Definir la ruta de evaluación.</li><li>Listar los requisitos de calidad, seguridad y eficacia.</li><li>Prever la liberación de lotes y la vigilancia.</li></ul>
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
  <tr><td>Ruta y secuencia</td><td>30 %</td><td>Expediente completo (art. 7), Sala primero (art. 4) y luego farmacéutica y legal.</td><td>Ruta o secuencia imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Requisitos</td><td>30 %</td><td>Información del art. 6 adaptada (polisacáridos, proteína portadora, conjugación, potencia).</td><td>Requisitos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Lotes y vigilancia</td><td>30 %</td><td>Liberación de cada lote (art. 25) y plan de gestión de riesgo (art. 24).</td><td>Omite uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvacu_html$;
  v_t3 := $evvacu_html$<h2>Caso de estudio</h2>
<p>Vacunas del Sur (ficticia) quiere registrar en Colombia una vacuna neumocócica conjugada fabricada en Europa, con estudios preclínicos y clínicos propios y aprobación de la EMA (datos simulados). Pretende venderla al sector privado y participar en compras públicas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evvacu_html$;
  v_t4 := 'Informe de ruta y requisitos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evvacu_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 4, 7 a 9, 24 y 25); Decreto 1787 de 2020 (ASUE) y su nota de vigencia; Decreto 1474 de 2023; Resolución 3690 de 2016; recomendaciones y guías de la OMS (TRS) para vacunas; ICH Q5C y Q5E; lineamientos del PAI; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evvacu_html$;
  v_t7 := NULL;
  v_j1 := $evvacu_json$["Ruta.","Información común.","Secuencia.","Liberación de lotes.","Farmacovigilancia."]$evvacu_json$::jsonb;
  v_j2 := $evvacu_json${"version":1,"total":100,"criteria":[{"id":"ruta-y-secuencia","name":"Ruta y secuencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Expediente completo (art. 7), Sala primero (art. 4) y luego farmacéutica y legal."},{"level":3,"label":"Logrado","description":"Ruta o secuencia imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"requisitos","name":"Requisitos","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Información del art. 6 adaptada (polisacáridos, proteína portadora, conjugación, potencia)."},{"level":3,"label":"Logrado","description":"Requisitos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"lotes-y-vigilancia","name":"Lotes y vigilancia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Liberación de cada lote (art. 25) y plan de gestión de riesgo (art. 24)."},{"level":3,"label":"Logrado","description":"Omite uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvacu_json$::jsonb;
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


  -- ── Actividad vacu-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Desarrollo clínico y calidad de vacunas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Desarrollo clínico y calidad de vacunas) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Revisión del paquete clínico de una vacuna';
  v_t2 := $evvacu_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar, evaluar y crear.</p>
<ol><li>Revisa cada fase y su objetivo.</li><li>Analiza si el estudio de puente sustenta el uso en la población objetivo.</li><li>Construye una matriz de preguntas probables de la Sala con su respuesta.</li><li>Evalúa el plan de farmacovigilancia frente al art. 24.</li><li>Propón compromisos posaprobación.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Revisar el paquete clínico por fases.</li><li>Anticipar las preguntas de la Sala Especializada.</li><li>Proponer compromisos posaprobación.</li></ul>
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
  <tr><td>Análisis clínico</td><td>35 %</td><td>Analiza las fases y justifica el puente inmunológico con la población objetivo.</td><td>Análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Preguntas de la Sala</td><td>30 %</td><td>Preguntas realistas (duración de protección, seguridad en niñas, coadministración) con respuestas.</td><td>Preguntas generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vigilancia y compromisos</td><td>25 %</td><td>Plan con farmacovigilancia activa (art. 24) y estudios de efectividad.</td><td>Compromisos vagos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvacu_html$;
  v_t3 := $evvacu_html$<h2>Caso de estudio</h2>
<p>Inmuniza (ficticia) prepara el registro de una vacuna contra el virus del papiloma humano (datos simulados). El paquete incluye: fase I en 60 adultos; fase II de búsqueda de dosis; fase III de eficacia en mujeres de 16 a 26 años; un estudio de puente inmunológico en niñas de 9 a 14 años (población objetivo del programa); y un plan de farmacovigilancia sin estudios de efectividad.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evvacu_html$;
  v_t4 := 'Matriz de revisión clínica con compromisos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evvacu_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 4, 7 a 9, 24 y 25); Decreto 1787 de 2020 (ASUE) y su nota de vigencia; Decreto 1474 de 2023; Resolución 3690 de 2016; recomendaciones y guías de la OMS (TRS) para vacunas; ICH Q5C y Q5E; lineamientos del PAI; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evvacu_html$;
  v_t7 := NULL;
  v_j1 := $evvacu_json$["Fases.","Puente inmunológico.","Matriz de preguntas.","Farmacovigilancia.","Compromisos."]$evvacu_json$::jsonb;
  v_j2 := $evvacu_json${"version":1,"total":100,"criteria":[{"id":"analisis-clinico","name":"Análisis clínico","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Analiza las fases y justifica el puente inmunológico con la población objetivo."},{"level":3,"label":"Logrado","description":"Análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"preguntas-de-la-sala","name":"Preguntas de la Sala","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Preguntas realistas (duración de protección, seguridad en niñas, coadministración) con respuestas."},{"level":3,"label":"Logrado","description":"Preguntas generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vigilancia-y-compromisos","name":"Vigilancia y compromisos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan con farmacovigilancia activa (art. 24) y estudios de efectividad."},{"level":3,"label":"Logrado","description":"Compromisos vagos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvacu_json$::jsonb;
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


  -- ── Actividad vacu-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Autorización sanitaria de uso de emergencia (ASUE): el caso COVID-19' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Autorización sanitaria de uso de emergencia (ASUE): el caso COVID-19) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Lectura de una autorización de uso de emergencia';
  v_t2 := $evvacu_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, analizar y evaluar.</p>
<ol><li>Extrae indicación, población, esquema y condiciones.</li><li>Relaciona cada condición con el artículo del Decreto 1787 que la sustenta.</li><li>Construye un cronograma de cumplimiento de las condiciones.</li><li>Analiza qué pasa con la autorización cuando se obtiene el registro.</li><li>Indica cómo verificarías hoy la vigencia de la norma y de la autorización.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar indicación, población y condiciones.</li><li>Relacionar las condiciones con el Decreto 1787 de 2020.</li><li>Evaluar qué pasa con la autorización al obtener el registro.</li></ul>
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
  <tr><td>Lectura</td><td>25 %</td><td>Extrae correctamente indicación, población y condiciones.</td><td>Lectura con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Fundamento</td><td>35 %</td><td>Relaciona condiciones con los arts. 4, 9, 13, 14 y 19.</td><td>Fundamento parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cronograma y vigencia</td><td>30 %</td><td>Cronograma realista; reconoce que el registro hace perder fuerza a la autorización y verifica la vigencia de la norma.</td><td>Análisis incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvacu_html$;
  v_t3 := $evvacu_html$<h2>Caso de estudio</h2>
<p>Te entregan un resumen ficticio de una resolución de autorización de uso de emergencia de una vacuna (datos simulados): población de 12 años o más; esquema de dos dosis; condiciones: entregar informes de seguridad mensuales, completar el estudio de fase III, presentar datos de estabilidad adicionales en seis meses, garantizar la trazabilidad por lote, y no distribuir muestras. Un año después, el titular obtiene el registro sanitario.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evvacu_html$;
  v_t4 := 'Análisis de la autorización con cronograma.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evvacu_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 4, 7 a 9, 24 y 25); Decreto 1787 de 2020 (ASUE) y su nota de vigencia; Decreto 1474 de 2023; Resolución 3690 de 2016; recomendaciones y guías de la OMS (TRS) para vacunas; ICH Q5C y Q5E; lineamientos del PAI; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evvacu_html$;
  v_t7 := NULL;
  v_j1 := $evvacu_json$["Indicación y condiciones.","Relación con el decreto.","Cronograma.","Paso al registro.","Verificación de vigencia."]$evvacu_json$::jsonb;
  v_j2 := $evvacu_json${"version":1,"total":100,"criteria":[{"id":"lectura","name":"Lectura","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Extrae correctamente indicación, población y condiciones."},{"level":3,"label":"Logrado","description":"Lectura con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"fundamento","name":"Fundamento","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Relaciona condiciones con los arts. 4, 9, 13, 14 y 19."},{"level":3,"label":"Logrado","description":"Fundamento parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"cronograma-y-vigencia","name":"Cronograma y vigencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cronograma realista; reconoce que el registro hace perder fuerza a la autorización y verifica la vigencia de la norma."},{"level":3,"label":"Logrado","description":"Análisis incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvacu_json$::jsonb;
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


  -- ── Actividad vacu-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Liberación lote a lote, precalificación OMS y PAI' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Liberación lote a lote, precalificación OMS y PAI) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: registro, paquete técnico y liberación de la vacuna';
  v_t2 := $evvacu_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos del producto (ficticios).</li><li>Fase 1: define la ruta (Decreto 1782) y la información común del art. 6.</li><li>Fase 2: resume el paquete clínico (fases, correlato de protección) y la estabilidad.</li><li>Fase 3: diseña el paquete de liberación de cada lote (art. 25).</li><li>Fase 3: describe el papel de la precalificación y la compra conjunta.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco y plataforma).</strong> Ruta y requisitos.</li>
  <li><strong>Fase 2 · Unidad 2 (clínica y calidad).</strong> Paquete clínico y estabilidad.</li>
  <li><strong>Fase 3 · Unidad 3 (liberación y PAI).</strong> Liberación de lotes y suministro.</li>
  <li><strong>Fase 4 · Unidad 4 (emergencias).</strong> Plan ante una situación excepcional.</li>
  <li><strong>Fase 5 · Unidad 5 (vigilancia y cadena de frío).</strong> ESAVI y excursiones de temperatura.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Definir la ruta y el paquete clínico y de calidad.</li><li>Planear la liberación de lotes y el suministro al PAI.</li></ul>
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
  <tr><td>Ruta y requisitos</td><td>25 %</td><td>Expediente completo con la información del art. 6.</td><td>Ruta con requisitos incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Clínica y calidad</td><td>35 %</td><td>Usa el correlato de protección (anticuerpos anti-HBs) y estabilidad con datos reales.</td><td>Paquete parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Liberación y suministro</td><td>30 %</td><td>Paquete del art. 25 y papel de la precalificación sin reemplazar la liberación.</td><td>Liberación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvacu_html$;
  v_t3 := $evvacu_html$<h2>Caso de estudio</h2>
<p>Biovacunas Andinas (ficticia) registrará en Colombia una vacuna recombinante contra la hepatitis B fabricada en el exterior, con estudios propios, y quiere suministrarla al PAI mediante compra conjunta (datos simulados). Te encargan la estrategia regulatoria desde el registro hasta la vigilancia. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evvacu_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evvacu_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 4, 7 a 9, 24 y 25); Decreto 1787 de 2020 (ASUE) y su nota de vigencia; Decreto 1474 de 2023; Resolución 3690 de 2016; recomendaciones y guías de la OMS (TRS) para vacunas; ICH Q5C y Q5E; lineamientos del PAI; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evvacu_html$;
  v_t7 := NULL;
  v_j1 := $evvacu_json$["Ruta.","Paquete clínico.","Estabilidad.","Liberación de lotes.","Suministro al PAI."]$evvacu_json$::jsonb;
  v_j2 := $evvacu_json${"version":1,"total":100,"criteria":[{"id":"ruta-y-requisitos","name":"Ruta y requisitos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Expediente completo con la información del art. 6."},{"level":3,"label":"Logrado","description":"Ruta con requisitos incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"clinica-y-calidad","name":"Clínica y calidad","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Usa el correlato de protección (anticuerpos anti-HBs) y estabilidad con datos reales."},{"level":3,"label":"Logrado","description":"Paquete parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"liberacion-y-suministro","name":"Liberación y suministro","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Paquete del art. 25 y papel de la precalificación sin reemplazar la liberación."},{"level":3,"label":"Logrado","description":"Liberación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvacu_json$::jsonb;
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


  -- ── Actividad vacu-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Farmacovigilancia de vacunas, ESAVI y cadena de frío' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Farmacovigilancia de vacunas, ESAVI y cadena de frío) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: contingencias, ESAVI y cadena de frío de la vacuna';
  v_t2 := $evvacu_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: describe cómo actuarías ante una situación excepcional y cómo verificarías la norma vigente.</li><li>Fase 5: diseña el flujo de notificación e investigación de ESAVI.</li><li>Fase 5: diseña la gestión de excursiones de temperatura con cuarentena y datos de estabilidad.</li><li>Fase 5: define indicadores de vacunación segura.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube la estrategia en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco y plataforma).</strong> Ruta y requisitos.</li>
  <li><strong>Fase 2 · Unidad 2 (clínica y calidad).</strong> Paquete clínico y estabilidad.</li>
  <li><strong>Fase 3 · Unidad 3 (liberación y PAI).</strong> Liberación de lotes y suministro.</li>
  <li><strong>Fase 4 · Unidad 4 (emergencias).</strong> Plan ante una situación excepcional.</li>
  <li><strong>Fase 5 · Unidad 5 (vigilancia y cadena de frío).</strong> ESAVI y excursiones de temperatura.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Planear la respuesta ante situaciones excepcionales.</li><li>Diseñar la vigilancia de ESAVI y la gestión de excursiones.</li></ul>
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
  <tr><td>Contingencias</td><td>20 %</td><td>Plan con verificación de la norma vigente antes de actuar.</td><td>Plan sin verificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>ESAVI</td><td>30 %</td><td>Notificación, investigación, causalidad y coordinación con INS e Invima.</td><td>Flujo incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cadena de frío</td><td>25 %</td><td>Cuarentena, datos de estabilidad e indicadores.</td><td>Gestión sin datos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvacu_html$;
  v_t3 := $evvacu_html$<h2>Caso de estudio</h2>
<p>Biovacunas Andinas (ficticia) registrará en Colombia una vacuna recombinante contra la hepatitis B fabricada en el exterior, con estudios propios, y quiere suministrarla al PAI mediante compra conjunta (datos simulados). Te encargan la estrategia regulatoria desde el registro hasta la vigilancia. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en la estrategia que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evvacu_html$;
  v_t4 := 'Estrategia de vigilancia y contingencias con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evvacu_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1782 de 2014 (arts. 4, 7 a 9, 24 y 25); Decreto 1787 de 2020 (ASUE) y su nota de vigencia; Decreto 1474 de 2023; Resolución 3690 de 2016; recomendaciones y guías de la OMS (TRS) para vacunas; ICH Q5C y Q5E; lineamientos del PAI; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, artículo o sección».</p>$evvacu_html$;
  v_t7 := NULL;
  v_j1 := $evvacu_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Situaciones excepcionales.","ESAVI.","Excursiones de temperatura.","Indicadores y resumen."]$evvacu_json$::jsonb;
  v_j2 := $evvacu_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"contingencias","name":"Contingencias","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Plan con verificación de la norma vigente antes de actuar."},{"level":3,"label":"Logrado","description":"Plan sin verificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"esavi","name":"ESAVI","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Notificación, investigación, causalidad y coordinación con INS e Invima."},{"level":3,"label":"Logrado","description":"Flujo incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"cadena-de-frio","name":"Cadena de frío","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cuarentena, datos de estabilidad e indicadores."},{"level":3,"label":"Logrado","description":"Gestión sin datos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvacu_json$::jsonb;
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


  -- ── Foro vacu-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con vacunas';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evvacu_html$<h2>Para empezar</h2>
<p>Piensa en una vacuna que hayas aplicado, distribuido, registrado o estudiado y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evvacu_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evvacu_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evvacu_html$;
  v_t6 := $evvacu_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evvacu_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has trabajado con la cadena de frío o con la liberación de lotes?', '¿Qué te parece más difícil: el registro, el PAI o la farmacovigilancia?']::text[];
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


  -- ── Foro vacu-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Las vacunas como medicamentos biológicos: marco regulatorio y plataformas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Las vacunas como medicamentos biológicos: marco regulatorio y plataformas) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Plataformas nuevas, preguntas nuevas';
  v_t2 := 'Argumentar qué retos regulatorios plantean las nuevas plataformas de vacunas.';
  v_t3 := $evvacu_html$<h2>Caso del foro</h2>
<p>Un comité ficticio de un hospital debe opinar sobre la introducción de una vacuna de vector viral y otra de ARNm (datos simulados). Algunos miembros dudan de las «vacunas nuevas» y otros creen que «si están aprobadas en otro país, no hay nada que revisar».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvacu_html$;
  v_t4 := '¿Qué aspectos revisarías de cada plataforma y por qué?';
  v_t5 := $evvacu_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada aspecto. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evvacu_html$;
  v_t6 := $evvacu_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada aspecto.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvacu_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué atributos de calidad son propios de cada plataforma?', '¿Qué dice el Decreto 1782 sobre la evaluación farmacológica?', '¿Qué vigilancia poscomercialización pedirías?']::text[];
  v_j1 := $evvacu_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada aspecto."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvacu_json$::jsonb;
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


  -- ── Foro vacu-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Desarrollo clínico y calidad de vacunas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Desarrollo clínico y calidad de vacunas) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Correlatos de protección';
  v_t2 := 'Argumentar cuándo un correlato inmunológico basta para aprobar una vacuna.';
  v_t3 := $evvacu_html$<h2>Caso del foro</h2>
<p>Un fabricante ficticio presenta una nueva vacuna contra una enfermedad sin correlato de protección establecido, solo con datos de anticuerpos (datos simulados). Argumenta que «los anticuerpos subieron mucho».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvacu_html$;
  v_t4 := '¿Es suficiente la evidencia? ¿Qué pedirías?';
  v_t5 := $evvacu_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o la norma que sustenta tu respuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evvacu_html$;
  v_t6 := $evvacu_html$<h2>Normas de participación</h2>
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
</details>$evvacu_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué es un correlato de protección?', '¿Qué compromisos posaprobación serían razonables?', '¿Cómo evaluaría la Sala el beneficio-riesgo?']::text[];
  v_j1 := $evvacu_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta tu respuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvacu_json$::jsonb;
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


  -- ── Foro vacu-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Liberación lote a lote, precalificación OMS y PAI' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Liberación lote a lote, precalificación OMS y PAI) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · La liberación de lotes como garantía';
  v_t2 := 'Argumentar por qué la liberación lote a lote es necesaria aunque el fabricante ya haya liberado.';
  v_t3 := $evvacu_html$<h2>Caso del foro</h2>
<p>Un gerente ficticio considera que la liberación de lotes del Invima es «un trámite repetido» que retrasa campañas (datos simulados). Pide eliminarla para vacunas precalificadas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvacu_html$;
  v_t4 := '¿Qué le responderías y cómo agilizarías el proceso sin perder control?';
  v_t5 := $evvacu_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evvacu_html$;
  v_t6 := $evvacu_html$<h2>Normas de participación</h2>
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
</details>$evvacu_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué riesgos controla la liberación independiente?', '¿Qué permite el art. 25 sobre criterios de priorización?', '¿Qué documentos aceleran la liberación?']::text[];
  v_j1 := $evvacu_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvacu_json$::jsonb;
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


  -- ── Foro vacu-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Autorización sanitaria de uso de emergencia (ASUE): el caso COVID-19' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Autorización sanitaria de uso de emergencia (ASUE): el caso COVID-19) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Lecciones de las autorizaciones de emergencia';
  v_t2 := 'Argumentar qué aprendizajes regulatorios dejó la autorización de emergencia de vacunas.';
  v_t3 := $evvacu_html$<h2>Caso del foro</h2>
<p>En un seminario ficticio, un participante afirma que las autorizaciones de emergencia fueron «aprobaciones sin evidencia» y otro que deberían ser la regla para todas las vacunas «porque fueron rápidas» (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvacu_html$;
  v_t4 := '¿Qué responderías a ambas posiciones?';
  v_t5 := $evvacu_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evvacu_html$;
  v_t6 := $evvacu_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvacu_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué requisitos exigía el Decreto 1787 de 2020?', '¿Qué condiciones se impusieron a los titulares?', '¿Por qué la autorización era temporal?']::text[];
  v_j1 := $evvacu_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvacu_json$::jsonb;
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


  -- ── Foro vacu-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Farmacovigilancia de vacunas, ESAVI y cadena de frío' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Farmacovigilancia de vacunas, ESAVI y cadena de frío) en Registro Sanitario de Vacunas: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Comunicar un ESAVI sin generar pánico';
  v_t2 := 'Argumentar cómo comunicar un evento grave tras la vacunación protegiendo la confianza.';
  v_t3 := $evvacu_html$<h2>Caso del foro</h2>
<p>En un municipio ficticio, un adolescente presenta un evento grave tras vacunarse y el caso se difunde en redes sociales (datos simulados). Varios padres cancelan las citas de vacunación.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvacu_html$;
  v_t4 := '¿Qué harías desde la farmacovigilancia y la comunicación?';
  v_t5 := $evvacu_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evvacu_html$;
  v_t6 := $evvacu_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvacu_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué información se necesita para evaluar la causalidad?', '¿Quién debe comunicar y qué?', '¿Cómo se mantiene la confianza en el programa?']::text[];
  v_j1 := $evvacu_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvacu_json$::jsonb;
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


  RAISE NOTICE 'Registro Sanitario de Vacunas: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evvacu$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Registro Sanitario de Productos Fitoterapéuticos
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfito$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Registro Sanitario de Productos Fitoterapéuticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Marco normativo, definiciones y clasificación de los productos fitoterapéuticos', 'Unidad 2. Plantas medicinales aceptadas y evaluación farmacológica', 'Unidad 3. Evaluación farmacéutica y control de calidad del material vegetal', 'Unidad 4. Trámites ante el INVIMA: registro, renovación y modificaciones', 'Unidad 5. BPM, etiquetado, publicidad y fitovigilancia']::text[])) < 5 THEN
    RAISE NOTICE 'Registro Sanitario de Productos Fitoterapéuticos: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfito_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfito_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fito-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Marco normativo, definiciones y clasificación de los productos fitoterapéuticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Marco normativo, definiciones y clasificación de los productos fitoterapéuticos) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Marco normativo, definiciones y clasificación de los productos fitoterapéuticos';
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


    v_t3 := '¿Qué norma rige hoy el registro sanitario de los productos fitoterapéuticos?';
    v_t4 := 'El Decreto 1156 de 2018 reglamenta el régimen de registro sanitario de los productos fitoterapéuticos y derogó los Decretos 2266 y 3553 de 2004, salvo las disposiciones de BPM y de envases, etiquetas y empaques, mientras el Ministerio expide nueva reglamentación (arts. 52 y 53).';
    v_j1 := $evfito_json${"external_id":"fito-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Del Decreto 2266 de 2004 al Decreto 1156 de 2018","outcome":"Del Decreto 2266 de 2004 al Decreto 1156 de 2018","source":"Decreto 1156 de 2018, arts. 52 y 53."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El Decreto 2266 de 2004 completo, que sigue vigente sin ninguna derogatoria desde su expedición.', FALSE, 'Fue derogado en gran parte.', 0),
      (v_pregunta, 'El Decreto 677 de 1995, porque los fitoterapéuticos se registran como medicamentos de síntesis química.', FALSE, 'Tienen un régimen propio.', 1),
      (v_pregunta, 'El Decreto 1156 de 2018, que derogó el 2266 salvo BPM y envases, etiquetas y empaques.', TRUE, 'Correcto. Así lo disponen los arts. 52 y 53.', 2),
      (v_pregunta, 'El Decreto 3249 de 2006, porque los fitoterapéuticos son suplementos dietarios con plantas.', FALSE, 'No son suplementos dietarios.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un producto nacional con plantas cultivadas en Colombia, cuya seguridad y eficacia se deducen de su uso registrado en el tiempo, ¿qué categoría tiene?';
    v_t4 := 'El artículo 3.22 define el PFT como de fabricación nacional, con plantas cultivadas en el país, cuya eficacia y seguridad se deducen de la experiencia por su uso registrado en el tiempo. El PFTI es su equivalente importado (3.23) y la PFM tiene actividad y seguridad comprobadas para indicaciones definidas (3.17).';
    v_j1 := $evfito_json${"external_id":"fito-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Definiciones y clasificación: PFM, PFT y PFTI","outcome":"Definiciones y clasificación: PFM, PFT y PFTI","source":"Decreto 1156 de 2018, arts. 3 y 10."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Producto fitoterapéutico de uso tradicional (PFT).', TRUE, 'Correcto. Art. 3.22.', 0),
      (v_pregunta, 'Preparación farmacéutica con base en plantas medicinales (PFM) con indicaciones definidas.', FALSE, 'La PFM tiene actividad comprobada.', 1),
      (v_pregunta, 'Producto fitoterapéutico de uso tradicional importado (PFTI) de fabricación extranjera.', FALSE, 'El producto del caso es nacional.', 2),
      (v_pregunta, 'Suplemento dietario con extractos vegetales para complementar la alimentación diaria.', FALSE, 'No es un suplemento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un producto combina extracto de una planta con cafeína pura aislada. ¿Qué análisis es correcto?';
    v_t4 := 'Los artículos 15 (PFM) y 20 (PFT y PFTI) excluyen la combinación con sustancias activas aisladas y químicamente definidas. Un producto así debe analizarse bajo otro régimen (por ejemplo, medicamento).';
    v_j1 := $evfito_json${"external_id":"fito-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Fitoterapéutico vs medicamento de síntesis, suplemento dietario y cosmético","outcome":"Fitoterapéutico vs medicamento de síntesis, suplemento dietario y cosmético","source":"Decreto 1156 de 2018, arts. 15 y 20."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una PFM, porque la cafeína proviene originalmente de plantas como el café o el té.', FALSE, 'Está aislada y químicamente definida.', 0),
      (v_pregunta, 'Es un PFT, porque el extracto vegetal se usa tradicionalmente en varias regiones del país.', FALSE, 'La combinación lo excluye.', 1),
      (v_pregunta, 'Es un fitoterapéutico válido si la cafeína no supera el 10 % de la fórmula total.', FALSE, 'La norma no prevé ese umbral.', 2),
      (v_pregunta, 'No es fitoterapéutico: no puede combinarse con sustancias activas aisladas y químicamente definidas.', TRUE, 'Correcto. Arts. 15 y 20.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una empresa quiere vender un té de una planta medicinal como suplemento dietario para «evitar el trámite». ¿Cuál es la mejor valoración?';
    v_t4 := 'La frontera entre fitoterapéutico, suplemento dietario y medicamento depende de la composición y la finalidad: si se atribuyen usos terapéuticos con base en plantas medicinales, el producto se rige por el Decreto 1156 de 2018. Clasificar mal para evitar el trámite expone a sanciones.';
    v_j1 := $evfito_json${"external_id":"fito-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Fitoterapéutico vs medicamento de síntesis, suplemento dietario y cosmético","outcome":"Fitoterapéutico vs medicamento de síntesis, suplemento dietario y cosmético","source":"Decreto 1156 de 2018, art. 3."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es válido, porque cualquier producto con plantas puede venderse como suplemento dietario.', FALSE, 'La finalidad define el régimen.', 0),
      (v_pregunta, 'Es inadecuado si se le atribuyen usos terapéuticos: con esa finalidad es un fitoterapéutico.', TRUE, 'Correcto. Se analiza la frontera.', 1),
      (v_pregunta, 'Es válido si el empaque no menciona el nombre científico de la planta.', FALSE, 'Ocultar el nombre no cambia la finalidad.', 2),
      (v_pregunta, 'Es válido si se vende solo por internet y no en droguerías.', FALSE, 'El canal no cambia el régimen.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fito-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Plantas medicinales aceptadas y evaluación farmacológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Plantas medicinales aceptadas y evaluación farmacológica) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Plantas medicinales aceptadas y evaluación farmacológica';
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


    v_t3 := '¿Qué condición previa necesita cualquier fitoterapéutico para registrarse?';
    v_t4 := 'El Invima elabora y actualiza los listados de plantas aceptadas con base en el Vademécum Colombiano de Plantas Medicinales y monografías de la OMS y la EMA (art. 5). Si la planta no está, el interesado debe sustentar su inclusión (arts. 6 a 9).';
    v_j1 := $evfito_json${"external_id":"fito-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: la planta como punto de partida del registro","outcome":"Introducción a la unidad: la planta como punto de partida del registro","source":"Decreto 1156 de 2018, arts. 5 a 9."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que la planta esté incluida en el listado de plantas aceptadas del Invima para su categoría.', TRUE, 'Correcto. Si no, se pide su inclusión.', 0),
      (v_pregunta, 'Que el fabricante tenga más de diez años de experiencia en la producción de productos naturales.', FALSE, 'La experiencia no es un requisito.', 1),
      (v_pregunta, 'Que la planta crezca en todas las regiones climáticas de Colombia sin excepción.', FALSE, 'La distribución de la planta no es un requisito.', 2),
      (v_pregunta, 'Que el producto se haya vendido antes en tiendas naturistas sin ningún registro.', FALSE, 'Vender sin registro está prohibido.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Para incluir una planta en el listado de uso tradicional (PFT o PFTI), ¿qué exige el artículo 8?';
    v_t4 := 'El artículo 8 exige, para PFT y PFTI, un uso permitido por al menos cuatro décadas, con tradición escrita y un mínimo de tres referencias documentales. Para PFM, el artículo 7 exige pruebas de toxicidad y eficacia y revisión bibliográfica.';
    v_j1 := $evfito_json${"external_id":"fito-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Criterios y trámite de inclusión de plantas (arts. 5 a 9 del Decreto 1156)","outcome":"Criterios y trámite de inclusión de plantas (arts. 5 a 9 del Decreto 1156)","source":"Decreto 1156 de 2018, arts. 7 y 8."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un ensayo clínico controlado de fase III con al menos mil pacientes tratados.', FALSE, 'Eso no es lo que exige para uso tradicional.', 0),
      (v_pregunta, 'Que la planta se cultive en invernaderos certificados por el Ministerio de Agricultura.', FALSE, 'El lugar de cultivo no es el requisito.', 1),
      (v_pregunta, 'Uso permitido por al menos cuatro décadas, con tradición escrita y mínimo tres referencias.', TRUE, 'Correcto. Así lo exige el artículo 8.', 2),
      (v_pregunta, 'Que la planta tenga una patente vigente a nombre del solicitante.', FALSE, 'La patente no es un requisito.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un solicitante pide incluir una planta nativa y el Invima le pide información complementaria. ¿Qué análisis es correcto según el artículo 9?';
    v_t4 := 'El artículo 9 dispone que el Invima puede pedir información complementaria por una sola vez, tiene tres meses para emitir concepto y, si es desfavorable, archiva la solicitud.';
    v_j1 := $evfito_json${"external_id":"fito-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Criterios y trámite de inclusión de plantas (arts. 5 a 9 del Decreto 1156)","outcome":"Criterios y trámite de inclusión de plantas (arts. 5 a 9 del Decreto 1156)","source":"Decreto 1156 de 2018, art. 9."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El Invima puede pedir información tantas veces como quiera y no tiene plazo para decidir.', FALSE, 'Hay un solo requerimiento y un plazo.', 0),
      (v_pregunta, 'La planta queda incluida automáticamente si el Invima no responde en un mes.', FALSE, 'No hay inclusión automática.', 1),
      (v_pregunta, 'Se pide una sola vez; el Invima conceptúa en tres meses y, si es desfavorable, archiva.', TRUE, 'Correcto. Así lo prevé el artículo 9.', 2),
      (v_pregunta, 'La solicitud solo puede presentarla una universidad pública colombiana.', FALSE, 'No es una restricción de la norma.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un investigador quiere registrar una PFM de una planta nativa con solo estudios etnobotánicos de uso. ¿Cuál es la mejor valoración?';
    v_t4 := 'La PFM exige actividad terapéutica y seguridad comprobadas: pruebas de toxicidad y eficacia y revisión bibliográfica (art. 7). Los estudios de uso pueden sustentar la inclusión para uso tradicional (art. 8) si cumplen sus condiciones.';
    v_j1 := $evfito_json${"external_id":"fito-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: la inclusión del dividivi (Caesalpinia spinosa) en el listado PFM","outcome":"Caso práctico: la inclusión del dividivi (Caesalpinia spinosa) en el listado PFM","source":"Decreto 1156 de 2018, arts. 3, 7 y 8."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es suficiente, porque el uso ancestral demuestra la eficacia de cualquier preparación.', FALSE, 'Para PFM se exige más.', 0),
      (v_pregunta, 'Es suficiente si la planta aparece en un libro de medicina tradicional.', FALSE, 'Eso apoya el uso tradicional, no la PFM.', 1),
      (v_pregunta, 'Es insuficiente solo porque falta el certificado de la Cámara de Comercio.', FALSE, 'El problema es la evidencia.', 2),
      (v_pregunta, 'Para PFM se exigen toxicidad y eficacia (art. 7); el uso podría sustentar un PFT.', TRUE, 'Correcto. Cada categoría tiene su evidencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fito-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Evaluación farmacéutica y control de calidad del material vegetal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Evaluación farmacéutica y control de calidad del material vegetal) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Evaluación farmacéutica y control de calidad del material vegetal';
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


    v_t3 := 'Según el artículo 45 del Decreto 1156, ¿qué incluye el control de calidad de las materias primas vegetales?';
    v_t4 := 'El artículo 45 asigna el control de calidad al titular y al fabricante, con evaluación de materias primas (organoléptica, cromatográfica, metales pesados, pesticidas, microbiológica) y control del producto terminado.';
    v_j1 := $evfito_json${"external_id":"fito-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Control de calidad de materias primas y producto terminado (art. 45)","outcome":"Control de calidad de materias primas y producto terminado (art. 45)","source":"Decreto 1156 de 2018, art. 45."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo la verificación del peso y del color del material vegetal recibido en la bodega.', FALSE, 'Se exigen más ensayos.', 0),
      (v_pregunta, 'Evaluación organoléptica, cromatográfica, de metales pesados, pesticidas y microbiológica.', TRUE, 'Correcto. Es responsabilidad del titular y del fabricante.', 1),
      (v_pregunta, 'Solo el certificado de origen expedido por el proveedor de la planta.', FALSE, 'El certificado de origen no basta.', 2),
      (v_pregunta, 'Solo la prueba de esterilidad, igual que en los productos inyectables.', FALSE, 'No es el control previsto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué documento sustenta la identidad botánica de la planta en el dossier?';
    v_t4 := 'La identidad se sustenta con la identificación botánica (nombre científico) emitida por un herbario reconocido, complementada con ensayos de identidad como el perfil cromatográfico. Los nombres comunes son ambiguos.';
    v_j1 := $evfito_json${"external_id":"fito-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Origen, identificación botánica y buenas prácticas agrícolas y de recolección","outcome":"Origen, identificación botánica y buenas prácticas agrícolas y de recolección","source":"Decreto 1156 de 2018, art. 45; Vademécum Colombiano de Plantas Medicinales."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Una foto de la planta tomada por el proveedor en el lugar de cultivo.', FALSE, 'Una foto no es una identificación formal.', 0),
      (v_pregunta, 'El nombre común de la planta escrito en la factura del proveedor.', FALSE, 'Los nombres comunes son ambiguos.', 1),
      (v_pregunta, 'El certificado de identificación botánica de un herbario reconocido, con nombre científico.', TRUE, 'Correcto. Es la base de la identidad.', 2),
      (v_pregunta, 'La declaración del gerente de la empresa sobre el origen de la planta.', FALSE, 'No es una identificación técnica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Para qué sirve un marcador en un extracto vegetal?';
    v_t4 := 'Un marcador (activo, si contribuye a la actividad, o analítico, si solo sirve de control) permite controlar la consistencia del extracto entre lotes y su estabilidad; no demuestra por sí solo la eficacia ni reemplaza la identificación botánica.';
    v_j1 := $evfito_json${"external_id":"fito-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Marcadores, estandarización de extractos y estabilidad","outcome":"Marcadores, estandarización de extractos y estabilidad","source":"Monografías de la OMS y la EMA sobre calidad de preparados vegetales."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Para controlar la consistencia del extracto entre lotes, aunque no explique la actividad.', TRUE, 'Correcto. Puede ser activo o analítico.', 0),
      (v_pregunta, 'Para demostrar por sí solo la eficacia clínica del producto terminado ante la Sala del Invima.', FALSE, 'No basta para demostrar eficacia.', 1),
      (v_pregunta, 'Para reemplazar la identificación botánica de la planta en el dossier.', FALSE, 'El marcador no reemplaza la identificación.', 2),
      (v_pregunta, 'Para fijar el precio del producto según su concentración del marcador.', FALSE, 'El precio no es su propósito.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un lote de material vegetal presenta un recuento microbiano y un nivel de plomo por encima de los límites. El proveedor propone «mezclarlo con otro lote bueno». ¿Cuál es la mejor valoración?';
    v_t4 := 'El control de calidad (art. 45) exige rechazar las materias primas que no cumplen especificaciones de metales pesados o microbiología; mezclarlas para diluir contaminantes es una mala práctica. Se investiga al proveedor y se refuerzan los controles.';
    v_j1 := $evfito_json${"external_id":"fito-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Documentación legal y farmacéutica por categoría (arts. 17, 18, 21 y 24)","outcome":"Documentación legal y farmacéutica por categoría (arts. 17, 18, 21 y 24)","source":"Decreto 1156 de 2018, art. 45."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es aceptable, porque la mezcla diluye los contaminantes por debajo del límite.', FALSE, 'Diluir un lote no conforme no es aceptable.', 0),
      (v_pregunta, 'Es aceptable si el producto terminado se vende con una vida útil más corta.', FALSE, 'No resuelve la contaminación.', 1),
      (v_pregunta, 'Es aceptable si el lote se lava antes de mezclarlo con el lote bueno.', FALSE, 'No es una práctica válida para metales.', 2),
      (v_pregunta, 'Es inaceptable: el lote no conforme se rechaza y se investiga al proveedor.', TRUE, 'Correcto. Según el control de calidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fito-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Trámites ante el INVIMA: registro, renovación y modificaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Trámites ante el INVIMA: registro, renovación y modificaciones) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Trámites ante el INVIMA: registro, renovación y modificaciones';
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


    v_t3 := 'Según el artículo 14 del Decreto 1156, ¿cuál es la vigencia del registro de un fitoterapéutico?';
    v_t4 := 'El artículo 14 fija una vigencia de diez años, renovables por periodos iguales; el código del registro incluye el año de expedición.';
    v_j1 := $evfito_json${"external_id":"fito-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: vías de trámite para fitoterapéuticos","outcome":"Introducción a la unidad: vías de trámite para fitoterapéuticos","source":"Decreto 1156 de 2018, art. 14."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Indefinida, igual que los medicamentos de síntesis química desde 2023.', FALSE, 'Los fitoterapéuticos tienen vigencia temporal.', 0),
      (v_pregunta, 'Cinco años, renovables solo una vez por un periodo igual.', FALSE, 'Esa no es la vigencia del art. 14.', 1),
      (v_pregunta, 'Diez años, renovables por periodos iguales.', TRUE, 'Correcto. Así lo fija el artículo 14.', 2),
      (v_pregunta, 'Un año, renovable cada año con un pago de mantenimiento.', FALSE, 'La vigencia es mucho mayor.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En el registro de una PFM, el Invima pide información adicional. ¿Qué plazo tiene el solicitante para responder?';
    v_t4 := 'El artículo 19 prevé evaluación legal y farmacéutica con 30 días hábiles para decidir o pedir información; si se requiere, se pide una sola vez y el solicitante tiene 60 días hábiles para responder; luego el Invima tiene 30 días hábiles para decidir.';
    v_j1 := $evfito_json${"external_id":"fito-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Registro de PFM con evaluación (arts. 15 a 19)","outcome":"Registro de PFM con evaluación (arts. 15 a 19)","source":"Decreto 1156 de 2018, art. 19."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Diez días hábiles, porque el trámite es de evaluación rápida.', FALSE, 'El plazo de la norma es mayor.', 0),
      (v_pregunta, 'Sesenta días hábiles; luego el Invima tiene 30 días hábiles para decidir.', TRUE, 'Correcto. Así lo prevé el artículo 19.', 1),
      (v_pregunta, 'Un año, porque los estudios de plantas medicinales tardan mucho.', FALSE, 'No es el plazo del artículo 19.', 2),
      (v_pregunta, 'No hay plazo: el solicitante responde cuando tenga la información completa.', FALSE, 'Sí hay un plazo para responder.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿En qué condiciones se otorga el registro automático de un PFT o PFTI?';
    v_t4 := 'Los artículos 20 a 22 otorgan el registro automático a PFT y PFTI con plantas del listado de uso tradicional, en formas permitidas (no inyectables estériles ni oftálmicas), sin sustancias aisladas y con venta libre. El Invima hace revisión posterior y puede suspender o cancelar (arts. 23 y 26).';
    v_j1 := $evfito_json${"external_id":"fito-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Registro automático de PFT y PFTI y revisión posterior (arts. 20 a 26)","outcome":"Registro automático de PFT y PFTI y revisión posterior (arts. 20 a 26)","source":"Decreto 1156 de 2018, arts. 20 a 26."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Planta en el listado de uso tradicional, formas permitidas, sin sustancias aisladas y venta libre.', TRUE, 'Correcto. Con revisión posterior.', 0),
      (v_pregunta, 'Cualquier producto con plantas, sin importar la forma farmacéutica ni la composición.', FALSE, 'El registro automático tiene condiciones.', 1),
      (v_pregunta, 'Solo los productos importados de países con agencia de referencia reconocida.', FALSE, 'También aplica a nacionales.', 2),
      (v_pregunta, 'Solo si el producto se vende bajo fórmula médica en droguerías.', FALSE, 'Se otorgan con venta libre.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un registro de PFT vence sin renovación y quedan existencias en bodega con vida útil vigente. ¿Cuál es la mejor valoración según el artículo 39?';
    v_t4 := 'El artículo 39 dispone que, si el registro venció sin renovación, no se puede importar ni fabricar, pero las existencias pueden venderse dentro de su vida útil. Con renovación, se pueden agotar existencias con el registro original hasta su vida útil.';
    v_j1 := $evfito_json${"external_id":"fito-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Modificaciones automáticas y no automáticas y agotamiento de existencias (arts. 30-32 y 39)","outcome":"Modificaciones automáticas y no automáticas y agotamiento de existencias (arts. 30-32 y 39)","source":"Decreto 1156 de 2018, art. 39."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se pueden seguir fabricando lotes nuevos mientras se tramita la renovación.', FALSE, 'No se puede fabricar sin registro.', 0),
      (v_pregunta, 'Hay que destruir de inmediato todas las existencias, aunque estén vigentes.', FALSE, 'La norma permite venderlas.', 1),
      (v_pregunta, 'Se pueden importar nuevos lotes si ya estaban pagados antes del vencimiento del registro.', FALSE, 'No se puede importar.', 2),
      (v_pregunta, 'No se fabrica ni importa, pero las existencias se venden dentro de su vida útil.', TRUE, 'Correcto. Así lo dispone el artículo 39.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fito-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. BPM, etiquetado, publicidad y fitovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. BPM, etiquetado, publicidad y fitovigilancia) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · BPM, etiquetado, publicidad y fitovigilancia';
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


    v_t3 := '¿Qué exige el Decreto 1156 sobre el idioma de las etiquetas de un fitoterapéutico?';
    v_t4 := 'El artículo 36 exige el texto en castellano, con el nombre científico en latín. El artículo 35 prohíbe nombres que induzcan a engaño, y el 37 prohíbe en productos con prescripción los dibujos alusivos a la actividad terapéutica.';
    v_j1 := $evfito_json${"external_id":"fito-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Etiquetado, nombre del producto, envase y expendio (Dec. 2266 arts. 7-12; Dec. 1156 arts. 34-37 y 41)","outcome":"Etiquetado, nombre del producto, envase y expendio (Dec. 2266 arts. 7-12; Dec. 1156 arts. 34-37 y 41)","source":"Decreto 1156 de 2018, arts. 35 a 37."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que todo el texto esté en inglés, porque es el idioma científico internacional.', FALSE, 'El idioma exigido es el castellano.', 0),
      (v_pregunta, 'Que el texto esté en castellano y el nombre científico de la planta en latín.', TRUE, 'Correcto. Así lo exige el artículo 36.', 1),
      (v_pregunta, 'Que se use el idioma del país de origen de la planta medicinal.', FALSE, 'No es la regla del artículo 36.', 2),
      (v_pregunta, 'Que no se incluya el nombre científico para no confundir al consumidor.', FALSE, 'El nombre científico va en latín.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Para un PFT, ¿cómo debe anunciarse su uso en la etiqueta según el Decreto 2266 de 2004 (art. 45, vigente)?';
    v_t4 := 'El artículo 45 del Decreto 2266 de 2004, que sigue vigente en materia de etiquetas, exige anunciar el uso con la expresión «este producto tradicionalmente ha sido utilizado para…» y una leyenda de que trata el efecto sintomático y no es curativo. El art. 35 del Decreto 1156 prohíbe el término «doctor» en los nombres.';
    v_j1 := $evfito_json${"external_id":"fito-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Etiquetado, nombre del producto, envase y expendio (Dec. 2266 arts. 7-12; Dec. 1156 arts. 34-37 y 41)","outcome":"Etiquetado, nombre del producto, envase y expendio (Dec. 2266 arts. 7-12; Dec. 1156 arts. 34-37 y 41)","source":"Decreto 2266 de 2004, art. 45; Decreto 1156 de 2018, art. 35."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Con la frase «cura definitivamente la enfermedad» para informar al consumidor.', FALSE, 'Está prohibido atribuir curación.', 0),
      (v_pregunta, 'Con «este producto tradicionalmente ha sido utilizado para…» y la leyenda de efecto sintomático.', TRUE, 'Correcto. Así lo exige el artículo 45.', 1),
      (v_pregunta, 'Con la palabra «doctor» en el nombre para dar confianza al consumidor.', FALSE, 'El término «doctor» está prohibido.', 2),
      (v_pregunta, 'Sin ninguna indicación, porque los productos tradicionales no pueden informar a los consumidores su uso.', FALSE, 'Se informa con la expresión prevista.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un PFT de venta libre se ofrece en un semáforo por un vendedor ambulante. ¿Qué análisis es correcto?';
    v_t4 := 'El artículo 41 del Decreto 1156 de 2018 prohíbe la venta ambulante y exige que los productos de fórmula facultativa se vendan solo con fórmula médica. Los de venta libre deben comercializarse en los establecimientos autorizados.';
    v_j1 := $evfito_json${"external_id":"fito-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Etiquetado, nombre del producto, envase y expendio (Dec. 2266 arts. 7-12; Dec. 1156 arts. 34-37 y 41)","outcome":"Etiquetado, nombre del producto, envase y expendio (Dec. 2266 arts. 7-12; Dec. 1156 arts. 34-37 y 41)","source":"Decreto 1156 de 2018, art. 41."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es permitido, porque los productos de venta libre pueden venderse en cualquier lugar.', FALSE, 'Hay canales permitidos.', 0),
      (v_pregunta, 'Es permitido si el vendedor exhibe una copia del registro sanitario.', FALSE, 'La copia no habilita la venta ambulante.', 1),
      (v_pregunta, 'Es permitido si el producto está dentro de su vida útil.', FALSE, 'La vida útil no habilita el canal.', 2),
      (v_pregunta, 'Está prohibido: el artículo 41 prohíbe la venta ambulante de fitoterapéuticos.', TRUE, 'Correcto. Así lo dispone el artículo 41.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un titular publica que su PFM «elimina el cáncer» con base en testimonios. ¿Cuál es la mejor valoración?';
    v_t4 := 'La publicidad y las etiquetas solo pueden reflejar los usos aprobados; atribuir propiedades curativas no aprobadas induce a engaño y está prohibido (art. 35 sobre nombres engañosos y normas de publicidad). Expone a medidas sanitarias y sanciones.';
    v_j1 := $evfito_json${"external_id":"fito-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Publicidad de fitoterapéuticos: de la Res. 4320 de 2004 a la Res. 1896 de 2023","outcome":"Publicidad de fitoterapéuticos: de la Res. 4320 de 2004 a la Res. 1896 de 2023","source":"Decreto 1156 de 2018, art. 35; normas de publicidad de fitoterapéuticos."}$evfito_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fito-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es inaceptable: atribuye una propiedad curativa no aprobada e induce a engaño.', TRUE, 'Correcto. Expone a sanciones.', 0),
      (v_pregunta, 'Es aceptable porque los testimonios son reales y voluntarios de los clientes.', FALSE, 'Los testimonios no sustentan la afirmación.', 1),
      (v_pregunta, 'Es aceptable si la publicidad se difunde solo por redes sociales.', FALSE, 'El canal no cambia la regla.', 2),
      (v_pregunta, 'Es aceptable si el producto tiene registro sanitario vigente del Invima.', FALSE, 'El registro no autoriza afirmaciones falsas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fito-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Marco normativo, definiciones y clasificación de los productos fitoterapéuticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Marco normativo, definiciones y clasificación de los productos fitoterapéuticos) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Clasificación de cuatro productos con base en plantas';
  v_t2 := $evfito_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Revisa los artículos 3, 10, 15 y 20 del Decreto 1156 de 2018.</li><li>Clasifica cada producto (PFM, PFT, PFTI u otro).</li><li>Indica la vía de registro (con evaluación o automático).</li><li>Analiza las formas farmacéuticas permitidas y excluidas.</li><li>Indica dónde verificarías que la planta esté en el listado.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar las definiciones del art. 3 y la clasificación del art. 10.</li><li>Identificar la vía de registro.</li><li>Detectar productos excluidos o con restricciones.</li></ul>
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
  <tr><td>Clasificación</td><td>40 %</td><td>Clasifica bien los cuatro productos con el art. 3.</td><td>Clasifica bien dos o tres.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vía y formas</td><td>30 %</td><td>PFM con evaluación (arts. 15 a 19); PFT y PFTI automáticos (arts. 20 a 22); analiza la forma oftálmica.</td><td>Vías imprecisas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Fundamento</td><td>20 %</td><td>Cita artículos y el listado vigente del Invima.</td><td>Fundamento general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfito_html$;
  v_t3 := $evfito_html$<h2>Caso de estudio</h2>
<p>Naturales del Valle (ficticia) evalúa cuatro productos (datos simulados): (1) tableta de extracto de psyllium para el estreñimiento, con estudios de eficacia; (2) tisana nacional de una planta del listado de uso tradicional; (3) cápsulas importadas de una planta con uso tradicional en su país; (4) gotas oftálmicas de un extracto vegetal.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfito_html$;
  v_t4 := 'Tabla de clasificación con fundamento.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfito_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1156 de 2018 (arts. 3, 5 a 10, 14, 15, 19 a 24, 26, 27, 29, 30, 32, 34 a 37, 39, 41, 45, 47, 52 y 53); Decreto 2266 de 2004 (disposiciones vigentes de BPM y etiquetas); Vademécum Colombiano de Plantas Medicinales y listados del Invima; Resolución 886 de 2004; monografías de la OMS y la EMA; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evfito_html$;
  v_t7 := NULL;
  v_j1 := $evfito_json$["Clasificación.","Vía de registro.","Formas farmacéuticas.","Listado de plantas.","Fundamento."]$evfito_json$::jsonb;
  v_j2 := $evfito_json${"version":1,"total":100,"criteria":[{"id":"clasificacion","name":"Clasificación","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Clasifica bien los cuatro productos con el art. 3."},{"level":3,"label":"Logrado","description":"Clasifica bien dos o tres."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"via-y-formas","name":"Vía y formas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"PFM con evaluación (arts. 15 a 19); PFT y PFTI automáticos (arts. 20 a 22); analiza la forma oftálmica."},{"level":3,"label":"Logrado","description":"Vías imprecisas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"fundamento","name":"Fundamento","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cita artículos y el listado vigente del Invima."},{"level":3,"label":"Logrado","description":"Fundamento general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfito_json$::jsonb;
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


  -- ── Actividad fito-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Plantas medicinales aceptadas y evaluación farmacológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Plantas medicinales aceptadas y evaluación farmacológica) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Solicitud de inclusión de una planta en el listado';
  v_t2 := $evfito_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lista los requisitos del artículo 8 para uso tradicional.</li><li>Evalúa si la evidencia cumple cuatro décadas, tradición escrita y tres referencias.</li><li>Identifica qué información adicional del artículo 6 falta (contraindicaciones, usos).</li><li>Describe el trámite y los plazos del artículo 9.</li><li>Redacta el índice de la solicitud.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar los requisitos del artículo 8.</li><li>Evaluar la suficiencia de la evidencia.</li><li>Preparar la solicitud de inclusión.</li></ul>
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
  <tr><td>Requisitos y evidencia</td><td>40 %</td><td>Evalúa cuatro décadas (desde 1975), tradición escrita y tres referencias.</td><td>Evaluación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Información faltante</td><td>25 %</td><td>Identifica usos, contraindicaciones y seguridad según el art. 6.</td><td>Información general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Trámite</td><td>25 %</td><td>Un solo requerimiento, concepto en tres meses y archivo si es desfavorable.</td><td>Trámite impreciso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfito_html$;
  v_t3 := $evfito_html$<h2>Caso de estudio</h2>
<p>Herbolaria Andina (ficticia) quiere registrar un PFT con una planta medicinal colombiana que no está en el listado de uso tradicional (datos simulados). Tiene: dos libros de botánica popular de 1975 y 1982 que describen su uso; un artículo de una revista universitaria de 2010; testimonios de sabedores; y un certificado de identificación botánica de un herbario colombiano.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfito_html$;
  v_t4 := 'Análisis de evidencia e índice de la solicitud.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfito_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1156 de 2018 (arts. 3, 5 a 10, 14, 15, 19 a 24, 26, 27, 29, 30, 32, 34 a 37, 39, 41, 45, 47, 52 y 53); Decreto 2266 de 2004 (disposiciones vigentes de BPM y etiquetas); Vademécum Colombiano de Plantas Medicinales y listados del Invima; Resolución 886 de 2004; monografías de la OMS y la EMA; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evfito_html$;
  v_t7 := NULL;
  v_j1 := $evfito_json$["Requisitos.","Suficiencia de la evidencia.","Información faltante.","Trámite y plazos.","Índice de la solicitud."]$evfito_json$::jsonb;
  v_j2 := $evfito_json${"version":1,"total":100,"criteria":[{"id":"requisitos-y-evidencia","name":"Requisitos y evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Evalúa cuatro décadas (desde 1975), tradición escrita y tres referencias."},{"level":3,"label":"Logrado","description":"Evaluación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"informacion-faltante","name":"Información faltante","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica usos, contraindicaciones y seguridad según el art. 6."},{"level":3,"label":"Logrado","description":"Información general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tramite","name":"Trámite","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Un solo requerimiento, concepto en tres meses y archivo si es desfavorable."},{"level":3,"label":"Logrado","description":"Trámite impreciso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfito_json$::jsonb;
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


  -- ── Actividad fito-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Trámites ante el INVIMA: registro, renovación y modificaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Trámites ante el INVIMA: registro, renovación y modificaciones) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Renovación y modificaciones de un portafolio fitoterapéutico';
  v_t2 := $evfito_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Analiza si la renovación del producto 1 puede ser automática (art. 27).</li><li>Clasifica los cambios del producto 2 (art. 30).</li><li>Clasifica el cambio del producto 3 y su plazo (art. 32).</li><li>Construye un cronograma de radicación.</li><li>Indica qué pasa con las existencias si alguna renovación se retrasa (art. 39).</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar las reglas de renovación.</li><li>Clasificar las modificaciones como automáticas o no automáticas.</li><li>Planear los plazos.</li></ul>
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
  <tr><td>Renovación</td><td>30 %</td><td>Aplica las condiciones del art. 27 (listado, misma información, estabilidad de dos lotes, BPM).</td><td>Condiciones incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Modificaciones</td><td>35 %</td><td>Marca y presentación automáticas (art. 30); nuevo uso no automático con 60 días hábiles (art. 32).</td><td>Clasificación con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cronograma y existencias</td><td>25 %</td><td>Cronograma con margen y regla de agotamiento del art. 39.</td><td>Cronograma sin margen.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfito_html$;
  v_t3 := $evfito_html$<h2>Caso de estudio</h2>
<p>Fitolab (ficticia) tiene tres registros (datos simulados): (1) una PFM cuyo registro vence en ocho meses, con la planta aún en el listado y estabilidad de dos lotes industriales; (2) un PFT al que quiere cambiarle la marca y agregar una presentación que no requiere estudios de estabilidad; (3) una PFM a la que quiere agregar un nuevo uso terapéutico.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfito_html$;
  v_t4 := 'Plan de trámites con cronograma.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfito_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1156 de 2018 (arts. 3, 5 a 10, 14, 15, 19 a 24, 26, 27, 29, 30, 32, 34 a 37, 39, 41, 45, 47, 52 y 53); Decreto 2266 de 2004 (disposiciones vigentes de BPM y etiquetas); Vademécum Colombiano de Plantas Medicinales y listados del Invima; Resolución 886 de 2004; monografías de la OMS y la EMA; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evfito_html$;
  v_t7 := NULL;
  v_j1 := $evfito_json$["Renovación.","Modificaciones automáticas.","Modificación no automática.","Cronograma.","Existencias."]$evfito_json$::jsonb;
  v_j2 := $evfito_json${"version":1,"total":100,"criteria":[{"id":"renovacion","name":"Renovación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aplica las condiciones del art. 27 (listado, misma información, estabilidad de dos lotes, BPM)."},{"level":3,"label":"Logrado","description":"Condiciones incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"modificaciones","name":"Modificaciones","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Marca y presentación automáticas (art. 30); nuevo uso no automático con 60 días hábiles (art. 32)."},{"level":3,"label":"Logrado","description":"Clasificación con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"cronograma-y-existencias","name":"Cronograma y existencias","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cronograma con margen y regla de agotamiento del art. 39."},{"level":3,"label":"Logrado","description":"Cronograma sin margen."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfito_json$::jsonb;
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


  -- ── Actividad fito-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Evaluación farmacéutica y control de calidad del material vegetal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Evaluación farmacéutica y control de calidad del material vegetal) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: clasificación, inclusión de la planta y dossier del PFTI';
  v_t2 := $evfito_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos del producto (ficticios).</li><li>Fase 1: clasifica el producto (art. 3.23) y explica la norma aplicable.</li><li>Fase 2: planea la solicitud de inclusión de la planta (arts. 6, 8 y 9).</li><li>Fase 3: lista el dossier farmacéutico (identificación botánica, control de calidad del art. 45, estabilidad).</li><li>Fase 3: lista los documentos legales del importado (certificado de venta libre, art. 24).</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco y clasificación).</strong> Clasificación y norma aplicable.</li>
  <li><strong>Fase 2 · Unidad 2 (plantas aceptadas).</strong> Inclusión de la planta en el listado.</li>
  <li><strong>Fase 3 · Unidad 3 (calidad).</strong> Dossier farmacéutico y control de calidad.</li>
  <li><strong>Fase 4 · Unidad 4 (trámites).</strong> Registro, vigencia, renovación y modificaciones.</li>
  <li><strong>Fase 5 · Unidad 5 (poscomercialización).</strong> Etiquetado, publicidad y fitovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar el producto y planear la inclusión de la planta.</li><li>Preparar el dossier farmacéutico.</li></ul>
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
  <tr><td>Clasificación</td><td>20 %</td><td>PFTI con Decreto 1156 de 2018 y fundamento.</td><td>Clasificación imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Inclusión de la planta</td><td>35 %</td><td>Cuatro décadas, tradición escrita, tres referencias y trámite del art. 9.</td><td>Plan incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Dossier</td><td>35 %</td><td>Identificación botánica, controles del art. 45, estabilidad y certificado de venta libre.</td><td>Dossier con vacíos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfito_html$;
  v_t3 := $evfito_html$<h2>Caso de estudio</h2>
<p>Natura Andina (ficticia) quiere registrar en Colombia un producto fitoterapéutico de uso tradicional importado (PFTI) en cápsulas, a base de una planta con uso tradicional en su país de origen (datos simulados). La planta no está en el listado de uso tradicional del Invima. Te encargan el plan regulatorio de principio a fin. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfito_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfito_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1156 de 2018 (arts. 3, 5 a 10, 14, 15, 19 a 24, 26, 27, 29, 30, 32, 34 a 37, 39, 41, 45, 47, 52 y 53); Decreto 2266 de 2004 (disposiciones vigentes de BPM y etiquetas); Vademécum Colombiano de Plantas Medicinales y listados del Invima; Resolución 886 de 2004; monografías de la OMS y la EMA; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evfito_html$;
  v_t7 := NULL;
  v_j1 := $evfito_json$["Clasificación.","Inclusión de la planta.","Dossier farmacéutico.","Documentos legales.","Fundamento normativo."]$evfito_json$::jsonb;
  v_j2 := $evfito_json${"version":1,"total":100,"criteria":[{"id":"clasificacion","name":"Clasificación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"PFTI con Decreto 1156 de 2018 y fundamento."},{"level":3,"label":"Logrado","description":"Clasificación imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"inclusion-de-la-planta","name":"Inclusión de la planta","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cuatro décadas, tradición escrita, tres referencias y trámite del art. 9."},{"level":3,"label":"Logrado","description":"Plan incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"dossier","name":"Dossier","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Identificación botánica, controles del art. 45, estabilidad y certificado de venta libre."},{"level":3,"label":"Logrado","description":"Dossier con vacíos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfito_json$::jsonb;
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


  -- ── Actividad fito-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. BPM, etiquetado, publicidad y fitovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. BPM, etiquetado, publicidad y fitovigilancia) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: registro, ciclo de vida y poscomercialización del PFTI';
  v_t2 := $evfito_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: describe el registro automático, la revisión posterior y la vigencia de diez años.</li><li>Fase 4: planea la renovación y las modificaciones previsibles.</li><li>Fase 5: redacta el texto de la etiqueta con las leyendas de uso tradicional.</li><li>Fase 5: define las reglas de publicidad y el programa de fitovigilancia.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco y clasificación).</strong> Clasificación y norma aplicable.</li>
  <li><strong>Fase 2 · Unidad 2 (plantas aceptadas).</strong> Inclusión de la planta en el listado.</li>
  <li><strong>Fase 3 · Unidad 3 (calidad).</strong> Dossier farmacéutico y control de calidad.</li>
  <li><strong>Fase 4 · Unidad 4 (trámites).</strong> Registro, vigencia, renovación y modificaciones.</li>
  <li><strong>Fase 5 · Unidad 5 (poscomercialización).</strong> Etiquetado, publicidad y fitovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Planear el registro automático y el ciclo de vida.</li><li>Definir el etiquetado, la publicidad y la fitovigilancia.</li></ul>
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
  <tr><td>Trámites</td><td>30 %</td><td>Registro automático (arts. 20 a 24), revisión posterior, vigencia de diez años y renovación (art. 27).</td><td>Trámites imprecisos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Etiqueta y publicidad</td><td>25 %</td><td>Castellano y nombre científico en latín, expresión de uso tradicional y leyenda de efecto sintomático, sin afirmaciones engañosas.</td><td>Etiqueta con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Fitovigilancia</td><td>20 %</td><td>Programa de farmacovigilancia con notificación y análisis de señales.</td><td>Programa general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfito_html$;
  v_t3 := $evfito_html$<h2>Caso de estudio</h2>
<p>Natura Andina (ficticia) quiere registrar en Colombia un producto fitoterapéutico de uso tradicional importado (PFTI) en cápsulas, a base de una planta con uso tradicional en su país de origen (datos simulados). La planta no está en el listado de uso tradicional del Invima. Te encargan el plan regulatorio de principio a fin. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan regulatorio que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfito_html$;
  v_t4 := 'Plan regulatorio completo con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfito_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 1156 de 2018 (arts. 3, 5 a 10, 14, 15, 19 a 24, 26, 27, 29, 30, 32, 34 a 37, 39, 41, 45, 47, 52 y 53); Decreto 2266 de 2004 (disposiciones vigentes de BPM y etiquetas); Vademécum Colombiano de Plantas Medicinales y listados del Invima; Resolución 886 de 2004; monografías de la OMS y la EMA; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evfito_html$;
  v_t7 := NULL;
  v_j1 := $evfito_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Registro y vigencia.","Renovación y modificaciones.","Etiqueta.","Publicidad, fitovigilancia y resumen."]$evfito_json$::jsonb;
  v_j2 := $evfito_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tramites","name":"Trámites","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Registro automático (arts. 20 a 24), revisión posterior, vigencia de diez años y renovación (art. 27)."},{"level":3,"label":"Logrado","description":"Trámites imprecisos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"etiqueta-y-publicidad","name":"Etiqueta y publicidad","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Castellano y nombre científico en latín, expresión de uso tradicional y leyenda de efecto sintomático, sin afirmaciones engañosas."},{"level":3,"label":"Logrado","description":"Etiqueta con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"fitovigilancia","name":"Fitovigilancia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Programa de farmacovigilancia con notificación y análisis de señales."},{"level":3,"label":"Logrado","description":"Programa general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfito_json$::jsonb;
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


  -- ── Foro fito-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con productos fitoterapéuticos';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfito_html$<h2>Para empezar</h2>
<p>Piensa en un producto con base en plantas que hayas registrado, dispensado o usado y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfito_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evfito_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfito_html$;
  v_t6 := $evfito_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfito_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Conoces el Vademécum Colombiano de Plantas Medicinales?', '¿Qué te parece más difícil: la clasificación, la calidad o los trámites?']::text[];
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


  -- ── Foro fito-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Marco normativo, definiciones y clasificación de los productos fitoterapéuticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Marco normativo, definiciones y clasificación de los productos fitoterapéuticos) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Productos frontera con plantas';
  v_t2 := 'Argumentar cómo clasificar productos con base en plantas que están en la frontera regulatoria.';
  v_t3 := $evfito_html$<h2>Caso del foro</h2>
<p>Una tienda naturista ficticia vende (datos simulados): un té de manzanilla «para la digestión», cápsulas de un extracto estandarizado con indicación definida, un polvo de proteína con extracto de jengibre y una crema de caléndula. El propietario pregunta qué registro necesita cada uno.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfito_html$;
  v_t4 := '¿Cómo clasificarías cada producto y con qué criterio?';
  v_t5 := $evfito_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada clasificación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfito_html$;
  v_t6 := $evfito_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada clasificación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfito_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué diferencia una PFM de un PFT?', '¿Cuándo un producto con plantas es un suplemento?', '¿Qué régimen podría aplicar a la crema?']::text[];
  v_j1 := $evfito_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada clasificación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfito_json$::jsonb;
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


  -- ── Foro fito-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Plantas medicinales aceptadas y evaluación farmacológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Plantas medicinales aceptadas y evaluación farmacológica) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · De la planta nativa al producto registrado';
  v_t2 := 'Argumentar el recorrido de una planta nativa hasta un producto registrado.';
  v_t3 := $evfito_html$<h2>Caso del foro</h2>
<p>Una cooperativa campesina ficticia quiere registrar un producto con una planta nativa usada por su comunidad (datos simulados). La planta no está en ningún listado del Invima y la cooperativa tiene pocos recursos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfito_html$;
  v_t4 := '¿Qué ruta le recomendarías y qué evidencia necesitaría?';
  v_t5 := $evfito_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta tu recomendación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfito_html$;
  v_t6 := $evfito_html$<h2>Normas de participación</h2>
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
</details>$evfito_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué categoría es más viable: PFM o PFT?', '¿Qué evidencia de tradición escrita podría reunir?', '¿Qué aliados podrían apoyar la investigación?']::text[];
  v_j1 := $evfito_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta tu recomendación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfito_json$::jsonb;
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


  -- ── Foro fito-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Evaluación farmacéutica y control de calidad del material vegetal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Evaluación farmacéutica y control de calidad del material vegetal) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Calidad desde el cultivo';
  v_t2 := 'Argumentar por qué la calidad de un fitoterapéutico empieza en el cultivo y la recolección.';
  v_t3 := $evfito_html$<h2>Caso del foro</h2>
<p>Un fabricante ficticio compra la misma planta a cinco recolectores distintos (datos simulados). Los perfiles cromatográficos varían mucho entre lotes y dos lotes tuvieron plaguicidas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfito_html$;
  v_t4 := '¿Qué controles propondrías desde el origen hasta el producto terminado?';
  v_t5 := $evfito_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada control. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfito_html$;
  v_t6 := $evfito_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada control.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfito_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué aportan las buenas prácticas agrícolas y de recolección?', '¿Cómo se usa el perfil cromatográfico?', '¿Qué relación tiene la variabilidad con la eficacia?']::text[];
  v_j1 := $evfito_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada control."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfito_json$::jsonb;
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


  -- ── Foro fito-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Trámites ante el INVIMA: registro, renovación y modificaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Trámites ante el INVIMA: registro, renovación y modificaciones) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Registro automático y responsabilidad';
  v_t2 := 'Argumentar qué responsabilidad asume el titular cuando obtiene un registro automático.';
  v_t3 := $evfito_html$<h2>Caso del foro</h2>
<p>Un titular ficticio obtuvo el registro automático de un PFTI y considera que «ya no hay nada que hacer» (datos simulados). Meses después, el Invima inicia una revisión posterior y detecta que el certificado de venta libre estaba vencido al radicar.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfito_html$;
  v_t4 := '¿Qué consecuencias puede tener y qué debió hacer el titular?';
  v_t5 := $evfito_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfito_html$;
  v_t6 := $evfito_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfito_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué verifica el Invima en la revisión posterior?', '¿Qué exige el artículo 24 para los importados?', '¿Qué controles internos evitarían el problema?']::text[];
  v_j1 := $evfito_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfito_json$::jsonb;
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


  -- ── Foro fito-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. BPM, etiquetado, publicidad y fitovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. BPM, etiquetado, publicidad y fitovigilancia) en Registro Sanitario de Productos Fitoterapéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Fitovigilancia: lo natural también tiene riesgos';
  v_t2 := 'Argumentar por qué los fitoterapéuticos necesitan farmacovigilancia.';
  v_t3 := $evfito_html$<h2>Caso del foro</h2>
<p>Una paciente ficticia que toma anticoagulantes presenta un sangrado después de iniciar un fitoterapéutico de venta libre (datos simulados). Dice que no lo mencionó a su médico «porque es natural».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfito_html$;
  v_t4 := '¿Qué haría el químico farmacéutico y qué debería hacer el titular?';
  v_t5 := $evfito_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfito_html$;
  v_t6 := $evfito_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfito_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué interacciones son relevantes en fitoterapéuticos?', '¿Cómo se notifica el evento?', '¿Qué información debería tener la etiqueta?']::text[];
  v_j1 := $evfito_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfito_json$::jsonb;
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


  RAISE NOTICE 'Registro Sanitario de Productos Fitoterapéuticos: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfito$;

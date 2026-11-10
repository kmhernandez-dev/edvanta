-- ============================================================
--  082_quices_actividades_foros_regulatorios.sql — quizzes, actividades y foros, lote «regulatorios»
--
--  Generado por scripts/evaluacion-aula.mjs regulatorios migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Asuntos Regulatorios Farmacéuticos; Registro Sanitario de Medicamentos.
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
--  Curso de Asuntos Regulatorios Farmacéuticos en Colombia
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evarf$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Asuntos Regulatorios Farmacéuticos en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Asuntos Regulatorios Farmacéuticos en Colombia: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico', 'Unidad 2. Sistema sanitario y autoridades regulatorias', 'Unidad 3. Marco normativo y categorías de productos', 'Unidad 4. Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia', 'Unidad 5. Armonización internacional, estrategia e inteligencia regulatoria']::text[])) < 5 THEN
    RAISE NOTICE 'Asuntos Regulatorios Farmacéuticos: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evarf_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evarf_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz arf-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Unidad 1. Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico';
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


    v_t3 := '¿Cuál es la razón de ser de la función de asuntos regulatorios en una empresa farmacéutica?';
    v_t4 := 'Asuntos regulatorios asegura que los productos obtengan y mantengan su autorización de comercialización, cumpliendo las normas sanitarias, y articula la evidencia técnica con las decisiones de negocio.';
    v_j1 := $evarf_json${"external_id":"arf-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"¿Qué son los asuntos regulatorios y por qué existen?","outcome":"¿Qué son los asuntos regulatorios y por qué existen?","source":"Decreto 677 de 1995; Decreto 334 de 2022."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Negociar con el Invima excepciones a los requisitos para acelerar los lanzamientos de la empresa.', FALSE, 'La función no busca excepciones, sino cumplir y demostrar el cumplimiento.', 0),
      (v_pregunta, 'Diseñar las campañas de mercadeo de los productos nuevos para todos los canales digitales.', FALSE, 'El mercadeo es otra función; asuntos regulatorios vigila que la información cumpla.', 1),
      (v_pregunta, 'Reemplazar al área de calidad en la liberación de los lotes cuando hay mucha carga de trabajo.', FALSE, 'La liberación es de calidad, no de asuntos regulatorios.', 2),
      (v_pregunta, 'Lograr y mantener la autorización de los productos cumpliendo las normas que protegen al paciente.', TRUE, 'Correcto. Conecta la ciencia, la norma y el negocio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un analista de asuntos regulatorios descubre que el arte de un empaque que se va a imprimir no coincide con el aprobado en el registro. ¿Qué le corresponde hacer?';
    v_t4 := 'La información del empaque y la etiqueta aprobada hace parte de las condiciones del registro; los cambios se tramitan según su clasificación (Decreto 334 de 2022) antes de implementarse.';
    v_j1 := $evarf_json${"external_id":"arf-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Rol, competencias y responsabilidades del QF en asuntos regulatorios","outcome":"Rol, competencias y responsabilidades del QF en asuntos regulatorios","source":"Decreto 334 de 2022, artículos 5 y 8."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Autorizar la impresión, porque las diferencias de diseño gráfico no afectan las condiciones del registro.', FALSE, 'El arte aprobado es parte de las condiciones del registro.', 0),
      (v_pregunta, 'Detener la impresión y gestionar la corrección o la modificación que corresponda antes de usarlo.', TRUE, 'Correcto. Ningún material se usa si no corresponde a lo aprobado.', 1),
      (v_pregunta, 'Informar al área de mercadeo y dejar que decida si se imprime o no el nuevo material de empaque.', FALSE, 'La decisión sobre el cumplimiento regulatorio no se delega a mercadeo.', 2),
      (v_pregunta, 'Imprimirlo y solicitar después al Invima que apruebe el nuevo arte por excepción.', FALSE, 'No existe una aprobación posterior por excepción para un material ya en uso.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un departamento de asuntos regulatorios mantiene un calendario de «vencimientos y renovaciones» de sus 40 registros de medicamentos. ¿Qué análisis es correcto con la norma vigente?';
    v_t4 := 'El Decreto 1474 de 2023 volvió indefinida la vigencia de los registros sanitarios de medicamentos, siempre que se mantengan las condiciones aprobadas. El seguimiento regulatorio se orienta a modificaciones, notificaciones de comercialización (artículo 18 del Decreto 334 de 2022), farmacovigilancia y requisitos de otras categorías.';
    v_j1 := $evarf_json${"external_id":"arf-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso: diseño del mapa funcional de un departamento de asuntos regulatorios","outcome":"Caso: diseño del mapa funcional de un departamento de asuntos regulatorios","source":"Decreto 1474 de 2023; Decreto 334 de 2022, artículo 18."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La vigencia es indefinida desde el Decreto 1474 de 2023: el calendario sigue modificaciones y notificaciones.', TRUE, 'Correcto. Las obligaciones cambian de forma, no desaparecen.', 0),
      (v_pregunta, 'Es correcto: los registros de medicamentos se renuevan cada cinco años y el calendario es imprescindible para no perderlos.', FALSE, 'Ese régimen cambió con el Decreto 1474 de 2023.', 1),
      (v_pregunta, 'Debe eliminarse todo seguimiento, porque un registro indefinido ya no tiene obligaciones asociadas.', FALSE, 'Siguen las modificaciones, las notificaciones, la farmacovigilancia y la vigilancia.', 2),
      (v_pregunta, 'Solo hay que mantener las fechas de los registros de los productos biológicos y de las vacunas.', FALSE, 'La vigencia indefinida aplica a los medicamentos; el seguimiento de obligaciones es para todos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un gerente afirma que «la digitalización y el enfoque de riesgo del Invima significan que ya no hay que preparar bien los expedientes». ¿Cuál es la valoración más acertada?';
    v_t4 := 'La digitalización y el enfoque de riesgo cambian cómo se tramita, no qué se demuestra. Incluso los trámites automáticos tienen control posterior: el Decreto 334 de 2022 permite suspender registros por inconsistencias detectadas en ese control.';
    v_j1 := $evarf_json${"external_id":"arf-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Ciencia regulatoria y tendencias de transformación del INVIMA","outcome":"Ciencia regulatoria y tendencias de transformación del INVIMA","source":"Decreto 334 de 2022, artículo 21."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: los trámites digitales se aprueban automáticamente, sin ninguna evaluación técnica del Invima.', FALSE, 'Digital no significa automático para todo trámite.', 0),
      (v_pregunta, 'Es correcta si la empresa paga la tarifa del trámite prioritario que ofrece el Invima.', FALSE, 'La tarifa no cambia los requisitos de evidencia.', 1),
      (v_pregunta, 'Es errada: la digitalización agiliza el trámite, pero la calidad de la evidencia sigue decidiendo.', TRUE, 'Correcto. Además, el control posterior puede llevar a suspender registros.', 2),
      (v_pregunta, 'Es errada solo porque los expedientes digitales tienen que ser más extensos que los de papel.', FALSE, 'La extensión no es el punto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz arf-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Sistema sanitario y autoridades regulatorias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Unidad 2. Sistema sanitario y autoridades regulatorias) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Sistema sanitario y autoridades regulatorias';
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


    v_t3 := '¿Qué función cumple la Sala Especializada de Medicamentos de la Comisión Revisora del Invima?';
    v_t4 := 'La Comisión Revisora del Invima, a través de sus salas especializadas, emite conceptos técnicos; la Sala Especializada de Medicamentos hace, entre otras, la evaluación farmacológica de los medicamentos nuevos.';
    v_j1 := $evarf_json${"external_id":"arf-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"La Comisión Revisora y sus salas especializadas (incluida la Sala Especializada de Medicamentos)","outcome":"La Comisión Revisora y sus salas especializadas (incluida la Sala Especializada de Medicamentos)","source":"Decreto 677 de 1995, evaluación farmacológica; actas de la Comisión Revisora."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Emite conceptos técnicos científicos, como la evaluación farmacológica de los medicamentos nuevos.', TRUE, 'Correcto. Sus actas son fuente para sustentar trámites.', 0),
      (v_pregunta, 'Inspecciona las droguerías y farmacias del país para verificar sus condiciones de almacenamiento.', FALSE, 'Esa inspección corresponde a las entidades territoriales.', 1),
      (v_pregunta, 'Fija los precios máximos de venta de los medicamentos que están en régimen de control directo.', FALSE, 'Los precios los regula la Comisión Nacional de Precios.', 2),
      (v_pregunta, 'Tramita las quejas de los consumidores por publicidad engañosa de cualquier tipo de producto.', FALSE, 'No es la función de la sala.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una EPS no entrega a tiempo los medicamentos formulados a sus afiliados. ¿Qué entidad vigila esa conducta?';
    v_t4 := 'En el sistema colombiano, el Invima vigila productos y fabricantes; las entidades territoriales, los establecimientos farmacéuticos; la Superintendencia Nacional de Salud, a los actores del sistema de salud (EPS, IPS); y la Superintendencia de Industria y Comercio, la protección del consumidor y el régimen de precios.';
    v_j1 := $evarf_json${"external_id":"arf-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Secretarías de salud, Supersalud y SIC en la vigilancia de productos farmacéuticos","outcome":"Secretarías de salud, Supersalud y SIC en la vigilancia de productos farmacéuticos","source":"Ley 1751 de 2015; organización del sistema de inspección, vigilancia y control."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El Invima, porque se trata de medicamentos que tienen registro sanitario vigente en el país.', FALSE, 'El Invima vigila productos y fabricantes, no la prestación del servicio.', 0),
      (v_pregunta, 'La Superintendencia de Industria y Comercio, porque se trata de una relación de consumo.', FALSE, 'La relación de la EPS con sus afiliados la vigila otra superintendencia.', 1),
      (v_pregunta, 'La Superintendencia Nacional de Salud, que vigila a los actores del sistema.', TRUE, 'Correcto. Vigila a EPS e IPS en la prestación del servicio.', 2),
      (v_pregunta, 'La secretaría de salud del municipio, porque vigila a todas las droguerías de su territorio.', FALSE, 'La conducta es de la EPS, no de una droguería.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué implica que el Invima sea reconocido por la OPS como autoridad reguladora nacional de referencia regional (nivel IV)?';
    v_t4 := 'La designación de la OPS como autoridad de referencia regional reconoce un desempeño competente en las funciones regulatorias; facilita que otras autoridades consideren sus decisiones, pero no las vuelve automáticamente válidas fuera de Colombia.';
    v_j1 := $evarf_json${"external_id":"arf-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"INVIMA como Autoridad Reguladora Nacional de Referencia Regional (nivel IV OPS)","outcome":"INVIMA como Autoridad Reguladora Nacional de Referencia Regional (nivel IV OPS)","source":"OPS, sistema de evaluación de autoridades reguladoras nacionales."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que sus registros sanitarios son válidos automáticamente en todos los países de América.', FALSE, 'El reconocimiento no da validez automática a sus decisiones en otros países.', 0),
      (v_pregunta, 'Que puede inspeccionar plantas de otros países sin pedir autorización a las autoridades sanitarias de esos países.', FALSE, 'No otorga facultades sobre otros territorios.', 1),
      (v_pregunta, 'Que deja de aplicar la norma colombiana y usa directamente las guías técnicas de la OPS.', FALSE, 'Sigue aplicando la norma colombiana.', 2),
      (v_pregunta, 'Que la OPS lo considera competente en sus funciones, lo que facilita la confianza de otras autoridades.', TRUE, 'Correcto. Es la base de esquemas de confianza regulatoria.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para sustentar una nueva indicación, un analista cita un «concepto» de la Comisión Revisora que encontró en un foro de internet, sin número de acta. ¿Cuál es la valoración más acertada?';
    v_t4 := 'Los antecedentes que sustentan un trámite se citan desde la fuente oficial: actas de las salas especializadas de la Comisión Revisora y listados del Invima, con número, fecha y numeral.';
    v_j1 := $evarf_json${"external_id":"arf-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: búsqueda de un concepto de la Comisión Revisora para soportar un trámite","outcome":"Caso: búsqueda de un concepto de la Comisión Revisora para soportar un trámite","source":"Actas de la Comisión Revisora del Invima."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es suficiente, porque los conceptos de la Comisión Revisora son de dominio público en internet.', FALSE, 'Que sean públicos no hace confiable una copia sin referencia.', 0),
      (v_pregunta, 'Es insuficiente: hay que ubicar el acta oficial de la sala y citarla con su número y fecha.', TRUE, 'Correcto. Solo la fuente oficial respalda el trámite.', 1),
      (v_pregunta, 'Es suficiente si el foro pertenece a una asociación reconocida de químicos farmacéuticos.', FALSE, 'Una asociación no reemplaza la fuente oficial.', 2),
      (v_pregunta, 'Es insuficiente solo porque los conceptos de la Comisión deben citarse en inglés en el expediente.', FALSE, 'El idioma no es el problema.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz arf-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Marco normativo y categorías de productos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Unidad 3. Marco normativo y categorías de productos) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Marco normativo y categorías de productos';
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


    v_t3 := 'En la jerarquía normativa, ¿qué relación hay entre una ley, un decreto reglamentario y una resolución del Ministerio de Salud?';
    v_t4 := 'La pirámide normativa va de la Constitución a las leyes, los decretos reglamentarios, las resoluciones y las circulares; cada nivel desarrolla al superior sin contradecirlo. Las decisiones de la Comunidad Andina tienen un régimen propio.';
    v_j1 := $evarf_json${"external_id":"arf-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: pirámide normativa sanitaria","outcome":"Introducción a la unidad: pirámide normativa sanitaria","source":"Constitución Política; Ley 9 de 1979; Decreto 677 de 1995."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La resolución prevalece sobre la ley cuando es más reciente y tiene un contenido más técnico y detallado que ella.', FALSE, 'La resolución no puede contradecir normas superiores.', 0),
      (v_pregunta, 'Tienen la misma jerarquía y se aplica la que favorezca a la empresa en cada caso concreto.', FALSE, 'No tienen la misma jerarquía.', 1),
      (v_pregunta, 'La ley fija el marco, el decreto la reglamenta y la resolución desarrolla lo técnico sin contradecirlos.', TRUE, 'Correcto. Cada nivel se subordina al anterior.', 2),
      (v_pregunta, 'El decreto reglamentario puede modificar la ley si el Ministerio lo considera necesario.', FALSE, 'Un decreto reglamentario no modifica la ley.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un laboratorio quiere registrar un biológico altamente similar a uno de referencia aprobado con expediente completo y presentará un ejercicio de comparabilidad. ¿Qué ruta del Decreto 1782 de 2014 usa?';
    v_t4 := 'El Decreto 1782 de 2014 prevé tres rutas: expediente completo (artículo 7), comparabilidad frente a un medicamento de referencia (artículo 8) y comparabilidad abreviada (artículo 9). En todas se exigen, entre otros, pruebas de inmunogenicidad y plan de gestión de riesgo.';
    v_j1 := $evarf_json${"external_id":"arf-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Medicamentos de síntesis química y biológicos (Decreto 1782 de 2014)","outcome":"Medicamentos de síntesis química y biológicos (Decreto 1782 de 2014)","source":"Decreto 1782 de 2014, artículos 5 a 9."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La ruta de la comparabilidad, con el ejercicio frente al medicamento de referencia.', TRUE, 'Correcto. Es la ruta del artículo 8 del decreto.', 0),
      (v_pregunta, 'La ruta del expediente completo, porque todo biológico exige estudios clínicos propios completos.', FALSE, 'Esa ruta aplica cuando no se usa la comparación con un referente.', 1),
      (v_pregunta, 'La ruta abreviada de comparabilidad, que no exige ningún dato de comparación con el de referencia.', FALSE, 'La ruta abreviada aplica a activos suficientemente caracterizados y bien documentados.', 2),
      (v_pregunta, 'La ruta de las normas farmacológicas, porque el principio activo ya está aprobado en Colombia.', FALSE, 'Esa no es una de las rutas del Decreto 1782.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un laboratorio quiere registrar un medicamento con un principio activo incluido en las normas farmacológicas, pero para una indicación que no figura en ellas. ¿Qué análisis es correcto?';
    v_t4 := 'Las normas farmacológicas listan principios activos con sus indicaciones y condiciones aceptadas. Una nueva indicación requiere evaluación farmacológica de la Sala Especializada de Medicamentos antes de incluirse en el registro.';
    v_j1 := $evarf_json${"external_id":"arf-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Normas Farmacológicas: qué son y cómo se consultan","outcome":"Normas Farmacológicas: qué son y cómo se consultan","source":"Decreto 677 de 1995, medicamentos nuevos y evaluación farmacológica."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No requiere evaluación farmacológica, porque el principio activo ya está aprobado en el país.', FALSE, 'La aprobación es para unas indicaciones concretas.', 0),
      (v_pregunta, 'La indicación nueva requiere evaluación farmacológica de la sala especializada antes del registro.', TRUE, 'Correcto. Una indicación nueva hace que se considere un medicamento nuevo.', 1),
      (v_pregunta, 'Basta con declarar la nueva indicación en el inserto y notificarla al Invima más adelante.', FALSE, 'Una indicación no aprobada no puede declararse.', 2),
      (v_pregunta, 'La indicación se aprueba automáticamente si ya está aprobada en algún otro país.', FALSE, 'La aprobación en otro país es un antecedente, no una aprobación automática.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una empresa quiere tramitar como cosmético una crema con un corticoide «para tratar la dermatitis atópica». ¿Cuál es la valoración más acertada?';
    v_t4 := 'La categoría de un producto frontera se define por su composición y por lo que declara: un corticoide con indicación para tratar una enfermedad es un medicamento, que requiere registro sanitario, no la notificación sanitaria obligatoria de los cosméticos.';
    v_j1 := $evarf_json${"external_id":"arf-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: clasificación de productos frontera ante INVIMA","outcome":"Caso: clasificación de productos frontera ante INVIMA","source":"Decreto 677 de 1995; régimen andino de cosméticos."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta, porque se aplica sobre la piel y todo producto de uso tópico se considera un cosmético.', FALSE, 'La vía de aplicación no define la categoría.', 0),
      (v_pregunta, 'Es correcta si la concentración del corticoide en la fórmula es menor del 1 %.', FALSE, 'Un corticoide en baja concentración sigue siendo un principio activo farmacológico.', 1),
      (v_pregunta, 'Es correcta si la empresa obtiene primero la notificación sanitaria obligatoria del cosmético.', FALSE, 'La notificación no cambia la naturaleza del producto.', 2),
      (v_pregunta, 'Es errada: el principio activo y la indicación terapéutica la hacen un medicamento.', TRUE, 'Correcto. Necesita registro sanitario de medicamento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz arf-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 4 (Unidad 4. Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia';
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


    v_t3 := 'Según el Decreto 334 de 2022, ¿dónde puede hacerse publicidad de un medicamento de venta con fórmula médica?';
    v_t4 := 'El artículo 11 del Decreto 334 de 2022 limita la información y la publicidad de los medicamentos de venta con fórmula a publicaciones de distribución restringida dirigidas a profesionales en medicina y odontología, y las prohíbe en medios masivos, plataformas digitales, mensajería y redes sociales.';
    v_j1 := $evarf_json${"external_id":"arf-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Información y publicidad de medicamentos: Resolución 1896 de 2023","outcome":"Información y publicidad de medicamentos: Resolución 1896 de 2023","source":"Decreto 334 de 2022, artículo 11; Resolución 1896 de 2023."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En redes sociales, siempre que la pieza incluya la leyenda «consulte a su médico» en un lugar visible.', FALSE, 'Las redes están prohibidas para estos medicamentos, con o sin leyenda.', 0),
      (v_pregunta, 'Solo en publicaciones de distribución restringida dirigidas a médicos y odontólogos.', TRUE, 'Correcto. Así lo dispone el artículo 11.', 1),
      (v_pregunta, 'En televisión, en horarios en los que los niños no estén viendo la programación de los canales.', FALSE, 'Los medios masivos están prohibidos para estos medicamentos.', 2),
      (v_pregunta, 'En cualquier medio, porque la publicidad ya no requiere aprobación previa del Invima.', FALSE, 'No requerir aprobación previa no elimina las prohibiciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un titular dejará de comercializar de forma temporal un medicamento por problemas con el proveedor del principio activo. ¿Qué debe hacer?';
    v_t4 := 'El artículo 18 del Decreto 334 de 2022 (modificado por el Decreto 1474 de 2023) exige notificar al Invima la no comercialización temporal en un plazo no mayor de 30 días calendario, y el retiro definitivo con al menos seis meses de antelación. No notificar puede llevar a la suspensión del registro (artículo 21).';
    v_j1 := $evarf_json${"external_id":"arf-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Etapas del ciclo de vida: desarrollo, registro, mantenimiento, desabastecimiento y retiro","outcome":"Etapas del ciclo de vida: desarrollo, registro, mantenimiento, desabastecimiento y retiro","source":"Decreto 334 de 2022, artículos 18 y 21."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Nada, porque el registro tiene vigencia indefinida y ya no exige ninguna notificación al Invima.', FALSE, 'La vigencia indefinida no elimina la obligación de notificar.', 0),
      (v_pregunta, 'Avisar al Invima con seis meses de anticipación antes de dejar de vender el medicamento.', FALSE, 'Los seis meses aplican al retiro definitivo.', 1),
      (v_pregunta, 'Solicitar la cancelación del registro y radicar uno nuevo cuando vuelva a comercializarlo.', FALSE, 'No hace falta cancelar el registro por una no comercialización temporal.', 2),
      (v_pregunta, 'Notificar la no comercialización temporal al Invima en un plazo no mayor de 30 días calendario.', TRUE, 'Correcto. Así lo exige el artículo 18 del Decreto 334 de 2022.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un medicamento en régimen de control directo se vende en una farmacia por encima del precio máximo fijado. ¿Qué análisis es correcto?';
    v_t4 := 'La Comisión Nacional de Precios de Medicamentos y Dispositivos Médicos define el régimen de precios (incluido el control directo con precio máximo); la Superintendencia de Industria y Comercio vigila su cumplimiento.';
    v_j1 := $evarf_json${"external_id":"arf-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Regulación de precios: Comisión Nacional de Precios de Medicamentos y Dispositivos Médicos","outcome":"Regulación de precios: Comisión Nacional de Precios de Medicamentos y Dispositivos Médicos","source":"Ley 1751 de 2015 (política farmacéutica y precios); regulación de la Comisión Nacional de Precios."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es legal, porque cada farmacia puede fijar libremente el margen de ganancia de sus productos.', FALSE, 'En control directo el precio máximo es obligatorio.', 0),
      (v_pregunta, 'Es un asunto del Invima, que puede cancelar el registro sanitario del medicamento por el precio.', FALSE, 'El Invima no vigila el régimen de precios.', 1),
      (v_pregunta, 'Es una infracción al régimen de precios; la vigila la Superintendencia de Industria y Comercio.', TRUE, 'Correcto. La Comisión Nacional de Precios fija el régimen y la Superintendencia lo vigila.', 2),
      (v_pregunta, 'Solo es infracción si el medicamento es importado y no si se fabrica en el territorio nacional.', FALSE, 'El régimen aplica sin importar el origen.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un titular decide no inscribirse en la Red Nacional de Farmacovigilancia porque «nunca le han reportado eventos». ¿Cuál es la valoración más acertada?';
    v_t4 := 'La Resolución 2024015321 de 2024 del Invima exige a los titulares un programa de farmacovigilancia, la inscripción en la Red Nacional de Farmacovigilancia y el reporte de eventos en los plazos establecidos (15 días calendario los serios y 90 los no serios).';
    v_j1 := $evarf_json${"external_id":"arf-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Programa Nacional de Farmacovigilancia y Red Nacional","outcome":"Programa Nacional de Farmacovigilancia y Red Nacional","source":"Resolución 2024015321 de 2024 del Invima, artículos 3, 5 y 8."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es errada: la inscripción y el programa de farmacovigilancia son obligatorios, haya o no reportes.', TRUE, 'Correcto. Además debe informar periodos sin eventos.', 0),
      (v_pregunta, 'Es correcta: la inscripción solo es obligatoria después de recibir el primer reporte de un evento serio.', FALSE, 'La obligación no depende de que haya eventos.', 1),
      (v_pregunta, 'Es correcta si el medicamento es de venta libre y tiene un perfil de seguridad conocido.', FALSE, 'La condición de venta no exime de la farmacovigilancia.', 2),
      (v_pregunta, 'Es errada solo porque el Invima publica cada año la lista de los titulares inscritos.', FALSE, 'La razón de fondo es la obligación legal.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz arf-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Armonización internacional, estrategia e inteligencia regulatoria' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 5 (Unidad 5. Armonización internacional, estrategia e inteligencia regulatoria) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Armonización internacional, estrategia e inteligencia regulatoria';
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


    v_t3 := '¿Qué es la confianza regulatoria (reliance) según la OPS?';
    v_t4 := 'La confianza regulatoria es el acto por el cual una autoridad toma en cuenta las evaluaciones o decisiones de otra autoridad confiable para fundamentar las suyas, manteniendo su independencia y su responsabilidad.';
    v_j1 := $evarf_json${"external_id":"arf-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"OPS, Red PARF y reliance (dependencia regulatoria)","outcome":"OPS, Red PARF y reliance (dependencia regulatoria)","source":"OPS y Red PARF, documentos sobre confianza regulatoria."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que una autoridad copia, sin ninguna revisión, todas las decisiones de la autoridad sanitaria de otro país de la región.', FALSE, 'La confianza no es copiar sin revisar.', 0),
      (v_pregunta, 'Que las empresas eligen libremente qué autoridad evaluará sus productos en cada país.', FALSE, 'La competencia regulatoria es de cada país.', 1),
      (v_pregunta, 'Que la OPS reemplaza a las autoridades nacionales en la aprobación de los medicamentos.', FALSE, 'La OPS no reemplaza a las autoridades nacionales.', 2),
      (v_pregunta, 'Que una autoridad considera evaluaciones de otra confiable para decidir, sin renunciar a su responsabilidad.', TRUE, 'Correcto. Cada autoridad conserva su decisión.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una empresa prepara un expediente con el formato del documento técnico común (CTD). ¿Qué organización armonizó ese formato?';
    v_t4 := 'El documento técnico común (CTD) fue armonizado por el ICH en su guía M4 y organiza la información en módulos (administrativo, resúmenes, calidad, no clínico y clínico); muchas autoridades lo usan o lo aceptan.';
    v_j1 := $evarf_json${"external_id":"arf-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"ICH y PIC/S: armonización técnica e inspecciones","outcome":"ICH y PIC/S: armonización técnica e inspecciones","source":"ICH M4 (CTD)."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'PIC/S, que también lo usa para las inspecciones de BPM en todos sus países miembros.', FALSE, 'PIC/S trabaja en inspecciones, no en el formato del expediente.', 0),
      (v_pregunta, 'La OPS, que lo exige como requisito para la precalificación de todos los productos.', FALSE, 'No es la organización que lo armonizó.', 1),
      (v_pregunta, 'El ICH, que lo armonizó en su guía M4 (documento técnico común).', TRUE, 'Correcto. Organiza el expediente en módulos.', 2),
      (v_pregunta, 'La OMS, que lo creó solo para los expedientes de los medicamentos de venta libre.', FALSE, 'No es su origen ni su alcance.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Para lanzar un medicamento nuevo, ¿qué debe definir primero una estrategia regulatoria?';
    v_t4 := 'Una estrategia regulatoria parte de la clasificación del producto y de la ruta (por ejemplo, evaluación farmacológica, ruta del Decreto 1782 para biológicos), que definen la evidencia, los tiempos, los riesgos y las obligaciones posteriores.';
    v_j1 := $evarf_json${"external_id":"arf-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Estrategia regulatoria: del portafolio al plan de lanzamiento","outcome":"Estrategia regulatoria: del portafolio al plan de lanzamiento","source":"Decreto 677 de 1995; Decreto 1782 de 2014."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La clasificación del producto y la ruta regulatoria, porque de ellas dependen la evidencia y los tiempos.', TRUE, 'Correcto. Todo lo demás se planea a partir de ahí.', 0),
      (v_pregunta, 'El diseño del empaque y los colores de la marca, para presentarlos junto con el expediente.', FALSE, 'El arte se define después y debe ajustarse a lo aprobado.', 1),
      (v_pregunta, 'El precio de venta al público, porque el Invima lo evalúa antes que la calidad y la seguridad del producto nuevo.', FALSE, 'El Invima no evalúa precios.', 2),
      (v_pregunta, 'La lista de distribuidores, porque el registro sanitario se otorga por canal de venta.', FALSE, 'El registro no se otorga por canal de venta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un área de asuntos regulatorios se entera de los cambios normativos solo cuando el Invima le hace un requerimiento. ¿Cuál es la valoración más acertada?';
    v_t4 := 'La inteligencia regulatoria vigila de forma sistemática las fuentes (normograma del Invima, proyectos normativos en consulta, actas de la Comisión Revisora, guías internacionales) para anticipar cambios y su efecto en el portafolio.';
    v_j1 := $evarf_json${"external_id":"arf-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Inteligencia regulatoria: fuentes, vigilancia normativa y análisis","outcome":"Inteligencia regulatoria: fuentes, vigilancia normativa y análisis","source":"Prácticas de inteligencia regulatoria; normograma del Invima."}$evarf_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'arf-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada, porque el Invima siempre avisa personalmente a cada titular de los cambios normativos que lo afectan.', FALSE, 'La autoridad publica las normas; no avisa a cada titular.', 0),
      (v_pregunta, 'Es reactiva: necesita vigilancia normativa sistemática (normograma, proyectos y actas) para anticiparse.', TRUE, 'Correcto. La inteligencia regulatoria evita sorpresas.', 1),
      (v_pregunta, 'Es adecuada si el área tiene un abogado externo que revise las normas una vez al año.', FALSE, 'Una revisión anual es tardía para muchos cambios.', 2),
      (v_pregunta, 'Es reactiva solo porque los cambios normativos se publican únicamente en idioma inglés.', FALSE, 'Las normas colombianas se publican en español.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad arf-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Unidad 1. Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Mapa funcional de un departamento de asuntos regulatorios';
  v_t2 := $evarf_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y lista las categorías de producto y sus normas.</li><li>Diseña el inventario regulatorio (qué datos de cada registro se controlan).</li><li>Construye el calendario de obligaciones con la norma vigente: modificaciones, notificaciones del artículo 18 del Decreto 334 de 2022, farmacovigilancia y los requisitos propios de suplementos y dispositivos.</li><li>Señala qué hacer con los biológicos registrados bajo el Decreto 677 y cita la fuente que verificaste.</li><li>Dibuja los flujos principales (nuevo registro, modificación, requerimiento, notificación) con sus responsables.</li><li>Propón cuatro indicadores del área con fórmula y meta.</li><li>Revisa con la rúbrica y sube tu propuesta en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar la estructura y los procesos de un área de asuntos regulatorios.</li><li>Construir un inventario y un calendario de obligaciones acorde con la norma vigente.</li><li>Definir indicadores de gestión del área.</li></ul>
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
  <tr><td>Inventario y calendario</td><td>30 %</td><td>Inventario completo y calendario coherente con la vigencia indefinida y las notificaciones vigentes.</td><td>Inventario adecuado con un calendario que mantiene renovaciones de medicamentos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Biológicos</td><td>15 %</td><td>Identifica la necesidad de migración al Decreto 1782 de 2014 y cita la fuente verificada.</td><td>Menciona los biológicos sin fuente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Flujos</td><td>25 %</td><td>Flujos claros, con responsables y control de plazos (incluidos los requerimientos).</td><td>Flujos razonables con plazos poco controlados.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores</td><td>20 %</td><td>Indicadores útiles con fórmula y meta.</td><td>Indicadores razonables sin meta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evarf_html$;
  v_t3 := $evarf_html$<h2>Caso de estudio</h2>
<p>Laboratorios Cóndor (ficticio) es titular de 40 registros de medicamentos (8 biológicos registrados hace años bajo el Decreto 677), 12 suplementos dietarios y 5 dispositivos médicos. Hoy no tiene un área de asuntos regulatorios: cada gerente de producto «lleva sus registros» en hojas de cálculo distintas, hubo un requerimiento vencido el año pasado y nadie sabe qué productos llevan más de 30 días sin comercializarse (datos simulados). La dirección quiere crear el área.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evarf_html$;
  v_t4 := 'Mapa funcional del área de asuntos regulatorios.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evarf_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 9 de 1979; Ley 1751 de 2015; Decreto 677 de 1995; Decreto 780 de 2016; Decreto 334 de 2022 y Decreto 1474 de 2023; Resolución 1896 de 2023; Decreto 1782 de 2014 (biológicos); Decreto 1156 de 2018 (fitoterapéuticos), Decreto 3554 de 2004 (homeopáticos) y Decreto 3249 de 2006 (suplementos); Decreto 4725 de 2005; Resolución 2024015321 de 2024 del Invima (farmacovigilancia); guía ICH M4 (CTD); documentos de la OPS sobre confianza regulatoria. Cita en APA 7 o en el formato «norma, artículo».</p>$evarf_html$;
  v_t7 := NULL;
  v_j1 := $evarf_json$["Inventario regulatorio.","Calendario de obligaciones con la norma vigente.","Situación de los biológicos registrados bajo el Decreto 677.","Flujos con responsables.","Indicadores."]$evarf_json$::jsonb;
  v_j2 := $evarf_json${"version":1,"total":100,"criteria":[{"id":"inventario-y-calendario","name":"Inventario y calendario","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Inventario completo y calendario coherente con la vigencia indefinida y las notificaciones vigentes."},{"level":3,"label":"Logrado","description":"Inventario adecuado con un calendario que mantiene renovaciones de medicamentos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"biologicos","name":"Biológicos","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Identifica la necesidad de migración al Decreto 1782 de 2014 y cita la fuente verificada."},{"level":3,"label":"Logrado","description":"Menciona los biológicos sin fuente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"flujos","name":"Flujos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Flujos claros, con responsables y control de plazos (incluidos los requerimientos)."},{"level":3,"label":"Logrado","description":"Flujos razonables con plazos poco controlados."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores","name":"Indicadores","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Indicadores útiles con fórmula y meta."},{"level":3,"label":"Logrado","description":"Indicadores razonables sin meta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evarf_json$::jsonb;
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


  -- ── Actividad arf-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Sistema sanitario y autoridades regulatorias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Unidad 2. Sistema sanitario y autoridades regulatorias) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Mapa de autoridades para cinco situaciones';
  v_t2 := $evarf_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y describe cada situación.</li><li>Identifica la autoridad competente de cada una y explica por qué.</li><li>Cita la norma que regula cada situación.</li><li>Describe qué acciones puede tomar la autoridad (medidas, sanciones, requerimientos).</li><li>Señala los casos en que más de una entidad puede intervenir y cómo se coordinan.</li><li>Redacta una respuesta breve para cada consultante.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Distinguir las competencias de las autoridades sanitarias y de otras entidades.</li><li>Relacionar cada situación con su norma.</li><li>Evaluar las consecuencias de cada incumplimiento.</li></ul>
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
  <tr><td>Competencias</td><td>35 %</td><td>Asigna correctamente la autoridad en las cinco situaciones.</td><td>Asigna bien cuatro.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Normas</td><td>25 %</td><td>Cita la norma pertinente de cada situación.</td><td>Normas correctas con citas generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acciones y coordinación</td><td>20 %</td><td>Describe acciones posibles y reconoce los casos de competencia compartida.</td><td>Acciones razonables sin coordinación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Respuestas</td><td>10 %</td><td>Respuestas claras y útiles.</td><td>Respuestas generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evarf_html$;
  v_t3 := $evarf_html$<h2>Caso de estudio</h2>
<p>La consultora ficticia RegulaPlus recibe cinco consultas (datos simulados): (1) una farmacia vende un medicamento en control directo por encima del precio máximo; (2) un laboratorio quiere saber si su planta cumple BPM antes de exportar; (3) una droguería almacena medicamentos al sol; (4) una IPS no tiene servicio farmacéutico habilitado; (5) un influenciador promociona un antibiótico de venta con fórmula. Debe responder qué autoridad es competente, con qué norma y qué puede hacer cada una.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evarf_html$;
  v_t4 := 'Matriz de autoridades con respuestas a cinco consultas.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evarf_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 9 de 1979; Ley 1751 de 2015; Decreto 677 de 1995; Decreto 780 de 2016; Decreto 334 de 2022 y Decreto 1474 de 2023; Resolución 1896 de 2023; Decreto 1782 de 2014 (biológicos); Decreto 1156 de 2018 (fitoterapéuticos), Decreto 3554 de 2004 (homeopáticos) y Decreto 3249 de 2006 (suplementos); Decreto 4725 de 2005; Resolución 2024015321 de 2024 del Invima (farmacovigilancia); guía ICH M4 (CTD); documentos de la OPS sobre confianza regulatoria. Cita en APA 7 o en el formato «norma, artículo».</p>$evarf_html$;
  v_t7 := NULL;
  v_j1 := $evarf_json$["Autoridad competente de cada situación.","Norma aplicable.","Acciones posibles de cada autoridad.","Casos con varias entidades.","Respuestas a los consultantes."]$evarf_json$::jsonb;
  v_j2 := $evarf_json${"version":1,"total":100,"criteria":[{"id":"competencias","name":"Competencias","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Asigna correctamente la autoridad en las cinco situaciones."},{"level":3,"label":"Logrado","description":"Asigna bien cuatro."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"normas","name":"Normas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cita la norma pertinente de cada situación."},{"level":3,"label":"Logrado","description":"Normas correctas con citas generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acciones-y-coordinacion","name":"Acciones y coordinación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Describe acciones posibles y reconoce los casos de competencia compartida."},{"level":3,"label":"Logrado","description":"Acciones razonables sin coordinación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"respuestas","name":"Respuestas","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Respuestas claras y útiles."},{"level":3,"label":"Logrado","description":"Respuestas generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evarf_json$::jsonb;
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


  -- ── Actividad arf-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 4 (Unidad 4. Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Línea de tiempo regulatoria de un genérico';
  v_t2 := $evarf_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y lista las etapas: desarrollo, registro, lanzamiento, mantenimiento y posibles cambios.</li><li>Para el registro, define las evaluaciones que aplican y las verificaciones previas (por ejemplo, si se exige bioequivalencia según la norma vigente).</li><li>Para el cambio de proveedor, define cómo se clasifica y se tramita según el Decreto 334 de 2022.</li><li>Para la campaña con pacientes, define qué está permitido con un medicamento de venta con fórmula.</li><li>Incluye las obligaciones permanentes: farmacovigilancia, notificaciones de comercialización y precio.</li><li>Dibuja la línea de tiempo con hitos, responsables y riesgos.</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Planear los hitos regulatorios del ciclo de vida de un medicamento.</li><li>Aplicar la norma vigente a cada etapa.</li><li>Anticipar riesgos regulatorios del plan comercial.</li></ul>
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
  <tr><td>Registro</td><td>25 %</td><td>Evaluaciones correctas (farmacéutica y legal) y verificación de bioequivalencia en la fuente vigente.</td><td>Evaluaciones correctas sin verificación en la fuente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cambios y mantenimiento</td><td>25 %</td><td>Cambio de proveedor clasificado por riesgo y obligaciones permanentes correctas, sin renovaciones.</td><td>Correcto con alguna obligación ausente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Información y publicidad</td><td>20 %</td><td>Distingue la publicidad prohibida de la información no publicitaria permitida.</td><td>Reconoce límites con imprecisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Línea de tiempo</td><td>20 %</td><td>Línea realista con dependencias, responsables y riesgos.</td><td>Línea razonable con vacíos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evarf_html$;
  v_t3 := $evarf_html$<h2>Caso de estudio</h2>
<p>Genéricos del Valle (ficticio) va a desarrollar, registrar y comercializar tabletas de losartán de 50 mg, incluido en las normas farmacológicas, fabricadas en su planta certificada en BPM. Prevé lanzar en 18 meses, cambiar el proveedor del principio activo al segundo año y hacer una campaña de información para pacientes hipertensos (datos simulados). La gerencia pide la línea de tiempo regulatoria con todas las obligaciones.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evarf_html$;
  v_t4 := 'Línea de tiempo regulatoria del genérico con hitos, responsables y riesgos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evarf_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 9 de 1979; Ley 1751 de 2015; Decreto 677 de 1995; Decreto 780 de 2016; Decreto 334 de 2022 y Decreto 1474 de 2023; Resolución 1896 de 2023; Decreto 1782 de 2014 (biológicos); Decreto 1156 de 2018 (fitoterapéuticos), Decreto 3554 de 2004 (homeopáticos) y Decreto 3249 de 2006 (suplementos); Decreto 4725 de 2005; Resolución 2024015321 de 2024 del Invima (farmacovigilancia); guía ICH M4 (CTD); documentos de la OPS sobre confianza regulatoria. Cita en APA 7 o en el formato «norma, artículo».</p>$evarf_html$;
  v_t7 := NULL;
  v_j1 := $evarf_json$["Etapas e hitos.","Evaluaciones y verificaciones del registro.","Trámite del cambio de proveedor.","Límites de la campaña con pacientes.","Obligaciones permanentes y línea de tiempo."]$evarf_json$::jsonb;
  v_j2 := $evarf_json${"version":1,"total":100,"criteria":[{"id":"registro","name":"Registro","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Evaluaciones correctas (farmacéutica y legal) y verificación de bioequivalencia en la fuente vigente."},{"level":3,"label":"Logrado","description":"Evaluaciones correctas sin verificación en la fuente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"cambios-y-mantenimiento","name":"Cambios y mantenimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Cambio de proveedor clasificado por riesgo y obligaciones permanentes correctas, sin renovaciones."},{"level":3,"label":"Logrado","description":"Correcto con alguna obligación ausente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"informacion-y-publicidad","name":"Información y publicidad","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Distingue la publicidad prohibida de la información no publicitaria permitida."},{"level":3,"label":"Logrado","description":"Reconoce límites con imprecisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"linea-de-tiempo","name":"Línea de tiempo","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Línea realista con dependencias, responsables y riesgos."},{"level":3,"label":"Logrado","description":"Línea razonable con vacíos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evarf_json$::jsonb;
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


  -- ── Actividad arf-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Marco normativo y categorías de productos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Unidad 3. Marco normativo y categorías de productos) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: organización, autoridades y ruta del biosimilar de Biofarma Andina';
  v_t2 := $evarf_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y lista lo que necesitas saber.</li><li>Fase 1: define el equipo, las responsabilidades y el alcance del plan.</li><li>Fase 2: arma el mapa de autoridades e interlocutores y explica cómo buscarías antecedentes en las actas de la Comisión Revisora.</li><li>Fase 3: clasifica el producto y justifica la ruta del Decreto 1782 de 2014 que usarás.</li><li>Fase 3: lista la evidencia que exige la ruta (incluidas inmunogenicidad y plan de gestión de riesgo) y las evaluaciones que aplican.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (organización).</strong> Equipo de asuntos regulatorios, responsabilidades y alcance del plan.</li>
  <li><strong>Fase 2 · Unidad 2 (autoridades).</strong> Mapa de autoridades e interlocutores, y búsqueda de antecedentes en la Comisión Revisora.</li>
  <li><strong>Fase 3 · Unidad 3 (clasificación y ruta).</strong> Clasificación del producto y ruta del Decreto 1782 de 2014, con la evidencia que exige.</li>
  <li><strong>Fase 4 · Unidad 4 (ciclo de vida).</strong> Información y publicidad, precio, farmacovigilancia y plan de gestión de riesgo, y notificaciones de comercialización.</li>
  <li><strong>Fase 5 · Unidad 5 (estrategia).</strong> Confianza regulatoria, cronograma, riesgos e inteligencia regulatoria.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Organizar el equipo y el alcance de un plan regulatorio.</li><li>Definir la clasificación y la ruta de un biológico con su evidencia.</li></ul>
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
  <tr><td>Organización</td><td>15 %</td><td>Equipo y alcance claros y realistas.</td><td>Organización adecuada con alguna omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Autoridades y antecedentes</td><td>25 %</td><td>Mapa correcto y método de búsqueda de antecedentes en fuentes oficiales.</td><td>Mapa correcto sin método de búsqueda.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Ruta</td><td>30 %</td><td>Ruta de la comparabilidad bien justificada, con el medicamento de referencia definido.</td><td>Ruta correcta con justificación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Evidencia</td><td>20 %</td><td>Lista completa, incluidas inmunogenicidad y plan de gestión de riesgo.</td><td>Lista adecuada con alguna omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evarf_html$;
  v_t3 := $evarf_html$<h2>Caso de estudio</h2>
<p>Biofarma Andina (ficticia) quiere lanzar en Colombia un biosimilar de un anticuerpo monoclonal usado en artritis reumatoide, fabricado en el exterior y ya aprobado por una agencia de referencia. Tiene un área de asuntos regulatorios pequeña y quiere el producto en el mercado en dos años. Tú lideras el plan regulatorio completo (datos simulados). En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evarf_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evarf_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 9 de 1979; Ley 1751 de 2015; Decreto 677 de 1995; Decreto 780 de 2016; Decreto 334 de 2022 y Decreto 1474 de 2023; Resolución 1896 de 2023; Decreto 1782 de 2014 (biológicos); Decreto 1156 de 2018 (fitoterapéuticos), Decreto 3554 de 2004 (homeopáticos) y Decreto 3249 de 2006 (suplementos); Decreto 4725 de 2005; Resolución 2024015321 de 2024 del Invima (farmacovigilancia); guía ICH M4 (CTD); documentos de la OPS sobre confianza regulatoria. Cita en APA 7 o en el formato «norma, artículo».</p>$evarf_html$;
  v_t7 := NULL;
  v_j1 := $evarf_json$["Equipo, responsabilidades y alcance.","Mapa de autoridades y búsqueda de antecedentes.","Clasificación y ruta con su justificación.","Evidencia y evaluaciones requeridas."]$evarf_json$::jsonb;
  v_j2 := $evarf_json${"version":1,"total":100,"criteria":[{"id":"organizacion","name":"Organización","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Equipo y alcance claros y realistas."},{"level":3,"label":"Logrado","description":"Organización adecuada con alguna omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"autoridades-y-antecedentes","name":"Autoridades y antecedentes","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Mapa correcto y método de búsqueda de antecedentes en fuentes oficiales."},{"level":3,"label":"Logrado","description":"Mapa correcto sin método de búsqueda."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ruta","name":"Ruta","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Ruta de la comparabilidad bien justificada, con el medicamento de referencia definido."},{"level":3,"label":"Logrado","description":"Ruta correcta con justificación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"evidencia","name":"Evidencia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Lista completa, incluidas inmunogenicidad y plan de gestión de riesgo."},{"level":3,"label":"Logrado","description":"Lista adecuada con alguna omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evarf_json$::jsonb;
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


  -- ── Actividad arf-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Armonización internacional, estrategia e inteligencia regulatoria' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 5 (Unidad 5. Armonización internacional, estrategia e inteligencia regulatoria) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan regulatorio de lanzamiento del biosimilar de Biofarma Andina';
  v_t2 := $evarf_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: define las reglas de información y publicidad para un medicamento de venta con fórmula, el trámite de precio y el plan de farmacovigilancia activa y gestión de riesgo.</li><li>Fase 4: define las obligaciones de notificación de comercialización y retiro.</li><li>Fase 5: explica cómo usarías la aprobación de la agencia de referencia sin suponer la aprobación en Colombia.</li><li>Fase 5: arma el cronograma de dos años con la ruta crítica, los riesgos y el plan de inteligencia regulatoria.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (organización).</strong> Equipo de asuntos regulatorios, responsabilidades y alcance del plan.</li>
  <li><strong>Fase 2 · Unidad 2 (autoridades).</strong> Mapa de autoridades e interlocutores, y búsqueda de antecedentes en la Comisión Revisora.</li>
  <li><strong>Fase 3 · Unidad 3 (clasificación y ruta).</strong> Clasificación del producto y ruta del Decreto 1782 de 2014, con la evidencia que exige.</li>
  <li><strong>Fase 4 · Unidad 4 (ciclo de vida).</strong> Información y publicidad, precio, farmacovigilancia y plan de gestión de riesgo, y notificaciones de comercialización.</li>
  <li><strong>Fase 5 · Unidad 5 (estrategia).</strong> Confianza regulatoria, cronograma, riesgos e inteligencia regulatoria.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar las obligaciones del ciclo de vida de un biológico.</li><li>Integrar una estrategia regulatoria con cronograma, riesgos e inteligencia regulatoria.</li></ul>
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
  <tr><td>Ciclo de vida</td><td>30 %</td><td>Publicidad, precio, farmacovigilancia activa, plan de gestión de riesgo y notificaciones correctos.</td><td>Elementos correctos con alguna omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Estrategia</td><td>25 %</td><td>Uso razonado de la confianza regulatoria, cronograma con ruta crítica y riesgos priorizados.</td><td>Estrategia adecuada con riesgos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Inteligencia regulatoria</td><td>10 %</td><td>Plan de vigilancia normativa con fuentes y frecuencia.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Resumen ejecutivo</td><td>10 %</td><td>Resumen claro con decisiones y recursos.</td><td>Resumen razonable.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evarf_html$;
  v_t3 := $evarf_html$<h2>Caso de estudio</h2>
<p>Biofarma Andina (ficticia) quiere lanzar en Colombia un biosimilar de un anticuerpo monoclonal usado en artritis reumatoide, fabricado en el exterior y ya aprobado por una agencia de referencia. Tiene un área de asuntos regulatorios pequeña y quiere el producto en el mercado en dos años. Tú lideras el plan regulatorio completo (datos simulados). En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás a la gerencia.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evarf_html$;
  v_t4 := 'Plan regulatorio de lanzamiento con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evarf_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 9 de 1979; Ley 1751 de 2015; Decreto 677 de 1995; Decreto 780 de 2016; Decreto 334 de 2022 y Decreto 1474 de 2023; Resolución 1896 de 2023; Decreto 1782 de 2014 (biológicos); Decreto 1156 de 2018 (fitoterapéuticos), Decreto 3554 de 2004 (homeopáticos) y Decreto 3249 de 2006 (suplementos); Decreto 4725 de 2005; Resolución 2024015321 de 2024 del Invima (farmacovigilancia); guía ICH M4 (CTD); documentos de la OPS sobre confianza regulatoria. Cita en APA 7 o en el formato «norma, artículo».</p>$evarf_html$;
  v_t7 := NULL;
  v_j1 := $evarf_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Publicidad, precio, farmacovigilancia y gestión de riesgo.","Notificaciones de comercialización y retiro.","Uso de la confianza regulatoria.","Cronograma, riesgos, inteligencia regulatoria y resumen ejecutivo."]$evarf_json$::jsonb;
  v_j2 := $evarf_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ciclo-de-vida","name":"Ciclo de vida","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Publicidad, precio, farmacovigilancia activa, plan de gestión de riesgo y notificaciones correctos."},{"level":3,"label":"Logrado","description":"Elementos correctos con alguna omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"estrategia","name":"Estrategia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Uso razonado de la confianza regulatoria, cronograma con ruta crítica y riesgos priorizados."},{"level":3,"label":"Logrado","description":"Estrategia adecuada con riesgos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"inteligencia-regulatoria","name":"Inteligencia regulatoria","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Plan de vigilancia normativa con fuentes y frecuencia."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"resumen-ejecutivo","name":"Resumen ejecutivo","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Resumen claro con decisiones y recursos."},{"level":3,"label":"Logrado","description":"Resumen razonable."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evarf_json$::jsonb;
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


  -- ── Foro arf-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu relación con los asuntos regulatorios';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evarf_html$<h2>Para empezar</h2>
<p>Piensa en un trámite, un requerimiento o una norma que te haya hecho perder tiempo o ganar claridad en tu trabajo o en tus estudios. Cuéntanos en tres o cuatro líneas qué aprendiste, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evarf_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión regulatoria te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evarf_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evarf_html$;
  v_t6 := $evarf_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evarf_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué categoría de producto conoces mejor: medicamentos, biológicos, suplementos, dispositivos o cosméticos?', '¿Qué te preocupa más hoy: las autoridades, las normas, el ciclo de vida o la estrategia?']::text[];
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


  -- ── Foro arf-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Unidad 1. Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Regulatorio o mercadeo?';
  v_t2 := 'Argumentar cómo resolver la tensión entre la presión comercial y el cumplimiento regulatorio.';
  v_t3 := $evarf_html$<h2>Caso del foro</h2>
<p>En un laboratorio ficticio, mercadeo quiere lanzar en un mes una nueva presentación de un analgésico con la frase «alivio en 10 minutos» en el empaque, sin estudios que la respalden y con un arte distinto del aprobado. La analista de asuntos regulatorios dice que no es posible; el gerente comercial la acusa de «frenar el negocio» (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evarf_html$;
  v_t4 := '¿Qué debe hacer asuntos regulatorios y cómo puede aportar al negocio sin ceder en el cumplimiento?';
  v_t5 := $evarf_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que limita la propuesta y la alternativa que ofrecerías. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evarf_html$;
  v_t6 := $evarf_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que limita la propuesta y la alternativa que ofrecerías.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evarf_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué trámite exigiría el nuevo arte y en qué plazo podría estar listo?', '¿Qué evidencia necesitaría la frase «alivio en 10 minutos»?', '¿Cómo se construye una relación de confianza entre regulatorio y mercadeo?']::text[];
  v_j1 := $evarf_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que limita la propuesta y la alternativa que ofrecerías."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evarf_json$::jsonb;
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


  -- ── Foro arf-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Sistema sanitario y autoridades regulatorias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Unidad 2. Sistema sanitario y autoridades regulatorias) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Foro de interacción 2 · Tocar la puerta equivocada';
  v_t2 := 'Argumentar qué autoridad atiende cada problema y por qué equivocarse cuesta tiempo y credibilidad.';
  v_t3 := $evarf_html$<h2>Caso del foro</h2>
<p>Una paciente ficticia escribe al Invima tres quejas en un mismo correo: su EPS le entrega tarde la insulina; una droguería le vendió un jarabe vencido; y un suplemento que compró por redes promete «curar la diabetes». Pide una sola respuesta (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evarf_html$;
  v_t4 := '¿Qué autoridad atiende cada una de las tres quejas y cómo se orientaría a la paciente?';
  v_t5 := $evarf_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la competencia de cada entidad y la norma que la asigna. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evarf_html$;
  v_t6 := $evarf_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la competencia de cada entidad y la norma que la asigna.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evarf_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué parte de la queja del suplemento le corresponde al Invima y cuál podría corresponder a otra entidad?', '¿Qué pasa si una empresa responde un requerimiento ante la entidad equivocada?', '¿Cómo usarías este caso para capacitar a un equipo de servicio al cliente?']::text[];
  v_j1 := $evarf_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la competencia de cada entidad y la norma que la asigna."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evarf_json$::jsonb;
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


  -- ── Foro arf-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Marco normativo y categorías de productos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Unidad 3. Marco normativo y categorías de productos) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Foro de interacción 3 · El producto frontera';
  v_t2 := 'Argumentar la clasificación de un producto cuya categoría depende de sus declaraciones.';
  v_t3 := $evarf_html$<h2>Caso del foro</h2>
<p>Una empresa ficticia quiere lanzar un enjuague bucal con clorhexidina al 0,12 % y la frase «trata la gingivitis y detiene el sangrado de encías». Mercadeo propone registrarlo como cosmético «para salir rápido», quitando la palabra «trata» pero dejando «detiene el sangrado» (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evarf_html$;
  v_t4 := '¿Cómo clasificarías este producto y qué cambia si se modifican sus declaraciones? ¿Es suficiente quitar la palabra «trata»?';
  v_t5 := $evarf_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el criterio de clasificación y la fuente que consultarías. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evarf_html$;
  v_t6 := $evarf_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio de clasificación y la fuente que consultarías.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evarf_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué peso tiene la composición frente a las declaraciones?', '¿Qué haría el Invima si encuentra el producto como cosmético con esa frase?', '¿Qué documento consultarías para resolver la duda de clasificación?']::text[];
  v_j1 := $evarf_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio de clasificación y la fuente que consultarías."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evarf_json$::jsonb;
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


  -- ── Foro arf-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 4 (Unidad 4. Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Foro de interacción 4 · Retirar un medicamento sin avisar';
  v_t2 := 'Argumentar las obligaciones del titular frente a la discontinuación de un medicamento y su efecto en el desabastecimiento.';
  v_t3 := $evarf_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio, único proveedor nacional de un antiarrítmico, decide dejar de fabricarlo porque no es rentable. Agota el inventario sin avisar a nadie. Dos meses después, varios hospitales reportan que no consiguen el medicamento (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evarf_html$;
  v_t4 := '¿Qué obligaciones incumplió el titular y qué consecuencias puede tener para los pacientes y para su registro?';
  v_t5 := $evarf_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo de la norma que fija la obligación y su consecuencia. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evarf_html$;
  v_t6 := $evarf_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo de la norma que fija la obligación y su consecuencia.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evarf_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué plazo de aviso exige la norma para un retiro definitivo?', '¿Qué puede hacer el Invima ante un riesgo de desabastecimiento?', '¿Qué debió haber hecho el laboratorio para equilibrar su decisión comercial y la continuidad del tratamiento?']::text[];
  v_j1 := $evarf_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo de la norma que fija la obligación y su consecuencia."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evarf_json$::jsonb;
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


  -- ── Foro arf-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Armonización internacional, estrategia e inteligencia regulatoria' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 5 (Unidad 5. Armonización internacional, estrategia e inteligencia regulatoria) en Asuntos Regulatorios Farmacéuticos.';
  END IF;
  v_t1 := 'Foro de interacción 5 · ¿Confiar en otra autoridad?';
  v_t2 := 'Argumentar las ventajas y los límites de la confianza regulatoria para un país como Colombia.';
  v_t3 := $evarf_html$<h2>Caso del foro</h2>
<p>En un foro de una asociación ficticia, un gerente propone que el Invima apruebe de forma automática cualquier medicamento aprobado por una agencia estricta extranjera, para acelerar el acceso. Una evaluadora responde que eso ignoraría diferencias de población, clima y condiciones de uso en Colombia (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evarf_html$;
  v_t4 := '¿Qué ventajas y qué límites tiene la confianza regulatoria? ¿Dónde trazarías la línea entre confiar y delegar?';
  v_t5 := $evarf_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el principio de la OPS o el requisito nacional que respalda tu postura. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evarf_html$;
  v_t6 := $evarf_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el principio de la OPS o el requisito nacional que respalda tu postura.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evarf_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué aspectos son específicos de Colombia y no pueden suponerse (por ejemplo, estabilidad en zona IVb)?', '¿Qué diferencia hay entre usar una evaluación extranjera y aprobar automáticamente?', '¿Qué beneficios tendría para los pacientes una confianza bien aplicada?']::text[];
  v_j1 := $evarf_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el principio de la OPS o el requisito nacional que respalda tu postura."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evarf_json$::jsonb;
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


  RAISE NOTICE 'Asuntos Regulatorios Farmacéuticos: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evarf$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Registro Sanitario de Medicamentos ante el INVIMA
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evrsm$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Registro Sanitario de Medicamentos ante el INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Registro Sanitario de Medicamentos ante el INVIMA: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos del registro sanitario de medicamentos en Colombia', 'Unidad 2. Clasificación del medicamento y evaluaciones farmacológica, farmacéutica y legal', 'Unidad 3. Requisitos según el tipo de medicamento', 'Unidad 4. Certificaciones, tarifas, tiempos y trámite en línea', 'Unidad 5. Actos administrativos, CUM y casos integradores']::text[])) < 5 THEN
    RAISE NOTICE 'Registro Sanitario de Medicamentos: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evrsm_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evrsm_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz rsm-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del registro sanitario de medicamentos en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Unidad 1. Fundamentos del registro sanitario de medicamentos en Colombia) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos del registro sanitario de medicamentos en Colombia';
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


    v_t3 := '¿Qué es el registro sanitario de un medicamento?';
    v_t4 := 'El registro sanitario es el acto administrativo del Invima que autoriza fabricar, importar, envasar, semielaborar o comercializar un medicamento, con base en sus evaluaciones y en condiciones aprobadas.';
    v_j1 := $evrsm_json${"external_id":"rsm-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"¿Qué es el registro sanitario y cuándo se exige?","outcome":"¿Qué es el registro sanitario y cuándo se exige?","source":"Decreto 677 de 1995, definiciones y artículo 14."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El certificado que demuestra que la planta del fabricante cumple las buenas prácticas de manufactura.', FALSE, 'Ese es el certificado de BPM, un requisito distinto.', 0),
      (v_pregunta, 'El código numérico que identifica cada presentación comercial del medicamento en el mercado.', FALSE, 'Ese es el CUM, que se asigna después del registro.', 1),
      (v_pregunta, 'El acto del Invima que autoriza fabricar, importar, envasar o comercializar el medicamento.', TRUE, 'Correcto. Ampara un producto con condiciones aprobadas.', 2),
      (v_pregunta, 'La lista de principios activos e indicaciones aceptados para su uso en Colombia.', FALSE, 'Esas son las normas farmacológicas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una empresa importa tabletas a granel desde la India y en Colombia solo las envasa en blísteres y las vende. ¿Qué modalidad corresponde?';
    v_t4 := 'El artículo 14 del Decreto 677 de 1995 prevé las modalidades: fabricar y vender; importar y vender; importar, envasar y vender; importar, semielaborar y vender; semielaborar y vender; y fabricar y exportar.';
    v_j1 := $evrsm_json${"external_id":"rsm-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Modalidades: fabricar y vender, importar y vender, importar, envasar y vender y otras","outcome":"Modalidades: fabricar y vender, importar y vender, importar, envasar y vender y otras","source":"Decreto 677 de 1995, artículo 14."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Importar, envasar y vender, porque en Colombia solo se hace el envasado.', TRUE, 'Correcto. Es una de las modalidades del artículo 14.', 0),
      (v_pregunta, 'Fabricar y vender, porque el envasado hecho en el país se considera una fabricación completa.', FALSE, 'El envasado no es la fabricación completa del producto.', 1),
      (v_pregunta, 'Importar y vender, porque el producto ya llega terminado desde el exterior para la venta.', FALSE, 'Llega a granel: falta el envasado, que se hace en Colombia.', 2),
      (v_pregunta, 'Semielaborar y vender, porque las tabletas se fabrican de forma parcial en el país.', FALSE, 'Las tabletas llegan fabricadas; solo se envasan.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un registro de un medicamento de síntesis química expedido en 2019 con vigencia de cinco años «vencía» en 2024. Otro, de un producto fitoterapéutico, se expidió en 2016. ¿Qué análisis es correcto?';
    v_t4 := 'El Decreto 1474 de 2023 volvió indefinida la vigencia de los registros de medicamentos vigentes, siempre que mantengan las condiciones aprobadas. Los productos fitoterapéuticos se rigen por el Decreto 1156 de 2018: vigencia de diez años, renovable.';
    v_j1 := $evrsm_json${"external_id":"rsm-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Vigencia del registro sanitario: de 10 años a vigencia indefinida","outcome":"Vigencia del registro sanitario: de 10 años a vigencia indefinida","source":"Decreto 1474 de 2023; Decreto 1156 de 2018."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Ambos vencieron y deben solicitar un registro nuevo con un expediente completo ante el Invima.', FALSE, 'El del medicamento pasó a vigencia indefinida antes de vencer.', 0),
      (v_pregunta, 'Ambos pasaron a vigencia indefinida, porque el Decreto 1474 aplica a todos los productos vigilados.', FALSE, 'El Decreto 1474 se refiere a los registros de medicamentos.', 1),
      (v_pregunta, 'El del medicamento debe renovarse cada cinco años y el del fitoterapéutico es ahora indefinido.', FALSE, 'Es al revés: el medicamento es indefinido y el fitoterapéutico se renueva.', 2),
      (v_pregunta, 'El del medicamento pasó a vigencia indefinida; el fitoterapéutico conserva su régimen propio.', TRUE, 'Correcto. Los fitoterapéuticos tienen su norma propia: diez años, renovable.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un titular de registro que fabrica por contrato afirma que, si un lote sale defectuoso, «la responsabilidad es solo del fabricante». ¿Cuál es la valoración más acertada?';
    v_t4 := 'El titular del registro responde ante la autoridad por el producto que ampara el registro; el fabricante responde por la fabricación conforme a las BPM y al contrato. Un contrato distribuye responsabilidades entre privados, pero no traslada las obligaciones sanitarias.';
    v_j1 := $evrsm_json${"external_id":"rsm-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Actores del registro: titular, fabricante, importador, envasador y acondicionador","outcome":"Actores del registro: titular, fabricante, importador, envasador y acondicionador","source":"Decreto 677 de 1995, responsabilidades de titulares y fabricantes."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: el titular solo es el dueño de la marca y no tiene ninguna obligación sanitaria.', FALSE, 'El titular tiene obligaciones sanitarias propias.', 0),
      (v_pregunta, 'Es errada: el titular también responde ante la autoridad; la responsabilidad no se traslada por contrato.', TRUE, 'Correcto. El fabricante responde por la fabricación según el contrato y las BPM.', 1),
      (v_pregunta, 'Es correcta si el contrato de fabricación incluye una cláusula de indemnidad a favor del titular.', FALSE, 'Una cláusula privada no cambia las obligaciones ante la autoridad.', 2),
      (v_pregunta, 'Es errada solo porque la responsabilidad recae siempre en el importador del producto.', FALSE, 'El importador tiene sus obligaciones, pero no exime al titular.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz rsm-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Clasificación del medicamento y evaluaciones farmacológica, farmacéutica y legal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Unidad 2. Clasificación del medicamento y evaluaciones farmacológica, farmacéutica y legal) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Clasificación del medicamento y evaluaciones farmacológica, farmacéutica y legal';
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


    v_t3 := '¿Qué diferencia a un medicamento nuevo de uno incluido en las normas farmacológicas?';
    v_t4 := 'El Decreto 677 de 1995 distingue los medicamentos incluidos en las normas farmacológicas (evaluación farmacéutica y legal, artículo 20) de los medicamentos nuevos, que requieren además la evaluación farmacológica (artículos 26 y 27).';
    v_j1 := $evrsm_json${"external_id":"rsm-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Medicamento nuevo vs. medicamento incluido en Normas Farmacológicas","outcome":"Medicamento nuevo vs. medicamento incluido en Normas Farmacológicas","source":"Decreto 677 de 1995, artículos 20, 26 y 27."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El nuevo es el que lleva menos de un año en el mercado colombiano desde su lanzamiento comercial.', FALSE, 'La antigüedad en el mercado no define la categoría.', 0),
      (v_pregunta, 'El nuevo tiene algo no aprobado (activo, indicación o forma) y exige evaluación farmacológica.', TRUE, 'Correcto. También una combinación no aprobada; los incluidos en las normas solo requieren evaluación farmacéutica y legal.', 1),
      (v_pregunta, 'El nuevo es el que se fabrica en una planta recién certificada en BPM por el Invima.', FALSE, 'La certificación de la planta no define la categoría del medicamento.', 2),
      (v_pregunta, 'El nuevo es cualquier medicamento importado que entra por primera vez al territorio nacional.', FALSE, 'El origen no define la categoría.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un laboratorio radica por la vía unificada un medicamento nuevo de síntesis química. ¿Qué evalúa el Invima en ese trámite?';
    v_t4 := 'El Decreto 2106 de 2019 unificó la evaluación farmacológica y el registro sanitario nuevo en una sola solicitud, que integra las evaluaciones farmacológica, farmacéutica y legal, con un plazo máximo de 180 días para decidir.';
    v_j1 := $evrsm_json${"external_id":"rsm-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Solicitud unificada de evaluación farmacológica y registro sanitario nuevo","outcome":"Solicitud unificada de evaluación farmacológica y registro sanitario nuevo","source":"Decreto 2106 de 2019; instructivo de trámites del Invima."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo la evaluación legal, porque las otras dos se hacen después de la comercialización del producto.', FALSE, 'Las evaluaciones técnicas no se hacen después de comercializar.', 0),
      (v_pregunta, 'Solo la evaluación farmacológica, y el registro se tramita después en una solicitud separada.', FALSE, 'La vía unificada reúne ambos trámites.', 1),
      (v_pregunta, 'Solo la evaluación farmacéutica, porque el principio activo ya fue evaluado en otro país.', FALSE, 'La aprobación en otro país no reemplaza la evaluación farmacológica.', 2),
      (v_pregunta, 'Las tres evaluaciones en una sola solicitud, con un plazo máximo de 180 días.', TRUE, 'Correcto. Es la vía unificada del Decreto 2106 de 2019.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En la evaluación de un genérico, el Invima encuentra que el certificado de existencia y representación legal del titular está vencido y que la especificación de disolución no tiene sustento. ¿Qué análisis es correcto?';
    v_t4 := 'La evaluación farmacéutica conceptúa sobre la capacidad del fabricante, el proceso y la calidad del producto (por ejemplo, la especificación de disolución); la evaluación legal verifica la documentación jurídica (por ejemplo, la existencia y representación del titular). Los faltantes se requieren por una sola vez.';
    v_j1 := $evrsm_json${"external_id":"rsm-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Evaluación farmacéutica y evaluación legal","outcome":"Evaluación farmacéutica y evaluación legal","source":"Decreto 677 de 1995, artículos 21 a 25."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El primero es de la evaluación legal y el segundo de la farmacéutica; ambos se resuelven en el requerimiento.', TRUE, 'Correcto. Y el requerimiento se hace por una sola vez.', 0),
      (v_pregunta, 'Ambos son asuntos de la evaluación farmacológica que hace la Sala Especializada de Medicamentos.', FALSE, 'Ninguno es un asunto farmacológico.', 1),
      (v_pregunta, 'Solo importa el segundo, porque la evaluación legal no puede detener nunca un registro sanitario.', FALSE, 'La evaluación legal también condiciona la decisión.', 2),
      (v_pregunta, 'Solo importa el primero, porque la especificación se puede ajustar después de obtener el registro.', FALSE, 'La especificación sin sustento compromete la evaluación farmacéutica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un laboratorio interpreta un acta de la Sala Especializada que aprobó una indicación «con condiciones» como una aprobación sin restricciones. ¿Cuál es la valoración más acertada?';
    v_t4 := 'Las actas de la Sala Especializada pueden aprobar indicaciones con condiciones (población, dosis, advertencias, condición de venta, farmacovigilancia); esas condiciones forman parte de lo aprobado y se reflejan en el registro y en la información del producto.';
    v_j1 := $evrsm_json${"external_id":"rsm-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Evaluación farmacológica y la Sala Especializada (SEMPB)","outcome":"Evaluación farmacológica y la Sala Especializada (SEMPB)","source":"Actas de la Comisión Revisora del Invima; Decreto 677 de 1995."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: una vez aprobada, la indicación se puede usar en cualquier paciente sin restricciones.', FALSE, 'Las condiciones del acta son parte de la aprobación.', 0),
      (v_pregunta, 'Es correcta si las condiciones se mencionan en la página web institucional del laboratorio.', FALSE, 'La información debe reflejarse en el registro y el inserto.', 1),
      (v_pregunta, 'Es errada: las condiciones (población, dosis, advertencias) deben reflejarse en el registro y el inserto.', TRUE, 'Correcto. Lo aprobado incluye sus condiciones.', 2),
      (v_pregunta, 'Es errada solo porque las actas de la Sala deben publicarse en el Diario Oficial antes de usarse.', FALSE, 'El problema es la interpretación, no la publicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz rsm-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Requisitos según el tipo de medicamento' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Unidad 3. Requisitos según el tipo de medicamento) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Requisitos según el tipo de medicamento';
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


    v_t3 := 'Según el Decreto 1156 de 2018, ¿qué distingue a un producto fitoterapéutico de uso tradicional (PFT)?';
    v_t4 := 'El Decreto 1156 de 2018 define tres categorías: preparaciones farmacéuticas con base en plantas medicinales (PFM), productos de uso tradicional (PFT) y de uso tradicional importados (PFTI). Los PFT se sustentan en el uso tradicional registrado y su planta debe estar en el listado del Invima; su registro es automático con revisión posterior.';
    v_j1 := $evrsm_json${"external_id":"rsm-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Registro sanitario de productos fitoterapéuticos (Decreto 1156 de 2018)","outcome":"Registro sanitario de productos fitoterapéuticos (Decreto 1156 de 2018)","source":"Decreto 1156 de 2018 (categorías y listados)."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un medicamento de síntesis química que contiene un excipiente de origen vegetal en su fórmula.', FALSE, 'No es un medicamento de síntesis química.', 0),
      (v_pregunta, 'Se registra siempre con estudios clínicos completos de fase III hechos en Colombia.', FALSE, 'Su sustento es el uso tradicional, no los estudios de fase III.', 1),
      (v_pregunta, 'Es un suplemento dietario que contiene extractos de plantas medicinales autorizadas.', FALSE, 'Los suplementos tienen otra norma y no son fitoterapéuticos.', 2),
      (v_pregunta, 'Se sustenta en el uso tradicional registrado y su planta debe estar en el listado oficial.', TRUE, 'Correcto. Su registro es automático, con revisión posterior.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un laboratorio quiere registrar un biológico cuyo ingrediente activo está suficientemente caracterizado y tiene un perfil de seguridad y eficacia altamente documentado. ¿Qué ruta del Decreto 1782 de 2014 puede considerar?';
    v_t4 := 'El Decreto 1782 de 2014 prevé tres rutas (artículo 5). La abreviada de comparabilidad (artículo 9) exige un ingrediente activo suficientemente caracterizado, un perfil de seguridad y eficacia altamente documentado, experiencia clínica y farmacovigilancia robusta, y demostrar alta similitud; en todas las rutas se exigen inmunogenicidad y plan de gestión de riesgo (artículo 6).';
    v_j1 := $evrsm_json${"external_id":"rsm-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Rutas de evaluación de biológicos: expediente completo, comparabilidad y abreviada","outcome":"Rutas de evaluación de biológicos: expediente completo, comparabilidad y abreviada","source":"Decreto 1782 de 2014, artículos 5, 6 y 9."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La ruta del expediente completo, que es la única posible para cualquier medicamento biológico.', FALSE, 'Hay otras rutas según el caso.', 0),
      (v_pregunta, 'La ruta abreviada de comparabilidad, si cumple sus condiciones.', TRUE, 'Correcto. Es la ruta del artículo 9 del decreto.', 1),
      (v_pregunta, 'La vía unificada del Decreto 2106 de 2019, que se aplica a todos los medicamentos biológicos.', FALSE, 'La vía unificada es un trámite, no una de las rutas del Decreto 1782.', 2),
      (v_pregunta, 'El registro automático con revisión posterior que se aplica a los productos fitoterapéuticos.', FALSE, 'Ese mecanismo es de algunos fitoterapéuticos, no de los biológicos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En el expediente de un genérico fabricado por contrato, la fórmula del certificado de análisis no coincide con la fórmula cuali-cuantitativa declarada. ¿Qué análisis es correcto?';
    v_t4 := 'El expediente debe ser coherente: fórmula declarada, certificados, proceso, especificaciones y estabilidad deben referirse al mismo producto. Una inconsistencia se investiga y se corrige antes de radicar.';
    v_j1 := $evrsm_json${"external_id":"rsm-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Requisitos del expediente de síntesis química","outcome":"Requisitos del expediente de síntesis química","source":"Decreto 677 de 1995, evaluación farmacéutica."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No importa, porque el Invima solo revisa la fórmula del inserto y no la del certificado de análisis.', FALSE, 'Toda la documentación debe ser coherente.', 0),
      (v_pregunta, 'Se resuelve radicando el expediente y esperando que el Invima no lo note durante la evaluación.', FALSE, 'Radicar inconsistencias es un riesgo y una falta de integridad.', 1),
      (v_pregunta, 'Es una inconsistencia que compromete la evaluación farmacéutica: se aclara antes de radicar.', TRUE, 'Correcto. Hay que saber cuál es la fórmula real.', 2),
      (v_pregunta, 'Se corrige cambiando la fórmula declarada para que coincida con la del certificado de análisis.', FALSE, 'Primero hay que investigar cuál documento es el correcto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una empresa quiere registrar como homeopático un producto con un principio activo de síntesis en dosis farmacológicas, sin preparación por técnicas homeopáticas. ¿Cuál es la valoración más acertada?';
    v_t4 := 'El Decreto 3554 de 2004 define el medicamento homeopático como el preparado obtenido por técnicas homeopáticas conforme a las farmacopeas oficiales, y exige un grado de dilución que garantice la inocuidad. Un principio activo en dosis farmacológicas, sin esas técnicas, no cumple la definición: debe evaluarse como medicamento.';
    v_j1 := $evrsm_json${"external_id":"rsm-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Registro sanitario de medicamentos homeopáticos (Decreto 3554 de 2004)","outcome":"Registro sanitario de medicamentos homeopáticos (Decreto 3554 de 2004)","source":"Decreto 3554 de 2004, artículos 2 y 21 (modificados por el Decreto 1861 de 2006); Decreto 677 de 1995."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es errada: con dosis farmacológicas no es un homeopático y debe evaluarse como medicamento.', TRUE, 'Correcto. La categoría depende de cómo se prepara y de su dosis.', 0),
      (v_pregunta, 'Es correcta si la etiqueta del producto incluye la palabra «homeopático» en un lugar visible.', FALSE, 'La palabra en la etiqueta no define la categoría.', 1),
      (v_pregunta, 'Es correcta, porque los productos homeopáticos se registran sin ningún tipo de evaluación.', FALSE, 'Los homeopáticos tienen su propio régimen de registro.', 2),
      (v_pregunta, 'Es errada solo porque los productos homeopáticos solo pueden importarse y no fabricarse.', FALSE, 'No existe esa limitación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz rsm-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Certificaciones, tarifas, tiempos y trámite en línea' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 4 (Unidad 4. Certificaciones, tarifas, tiempos y trámite en línea) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Certificaciones, tarifas, tiempos y trámite en línea';
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


    v_t3 := '¿Qué demuestra un certificado de producto farmacéutico (CPP) del esquema de la OMS?';
    v_t4 := 'El certificado de producto farmacéutico del esquema de la OMS para productos objeto de comercio internacional lo emite la autoridad del país exportador: confirma que el producto está autorizado y que el fabricante cumple BPM y se inspecciona periódicamente. El artículo 31 del Decreto 677 de 1995 exige estos certificados para los importados.';
    v_j1 := $evrsm_json${"external_id":"rsm-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Certificado de Producto Farmacéutico (CPP) y certificado de venta libre","outcome":"Certificado de Producto Farmacéutico (CPP) y certificado de venta libre","source":"Decreto 677 de 1995, artículo 31 (modificado por el Decreto 426 de 2009); esquema de certificación de la OMS."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La autorización del producto en el país exportador y las BPM de su fabricante.', TRUE, 'Correcto. Lo emite la autoridad del país exportador.', 0),
      (v_pregunta, 'Que el producto fue aprobado por la OMS para su venta en todos los países miembros.', FALSE, 'La OMS no aprueba productos para todos los países.', 1),
      (v_pregunta, 'Que el producto tiene registro sanitario vigente en Colombia, otorgado por el Invima.', FALSE, 'El CPP lo emite la autoridad del país exportador.', 2),
      (v_pregunta, 'Que el precio del producto es el mismo en todos los países donde se comercializa.', FALSE, 'El CPP no informa precios.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Durante el trámite de un registro vence el certificado de BPM del fabricante extranjero. ¿Qué debe hacer el solicitante?';
    v_t4 := 'El fabricante, nacional o extranjero, debe cumplir BPM durante el trámite y la vigencia del registro; el solicitante responde por aportar la certificación vigente.';
    v_j1 := $evrsm_json${"external_id":"rsm-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Certificado de Buenas Prácticas de Manufactura del fabricante","outcome":"Certificado de Buenas Prácticas de Manufactura del fabricante","source":"Decreto 677 de 1995; Decreto 335 de 2022 (certificación)."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Nada, porque el certificado de BPM solo se revisa el día de la radicación del trámite.', FALSE, 'El cumplimiento de BPM se exige durante el trámite y la vigencia.', 0),
      (v_pregunta, 'Cambiar de fabricante sin informar al Invima, para no retrasar el trámite en curso.', FALSE, 'Cambiar de fabricante sin informar es una falta grave.', 1),
      (v_pregunta, 'Gestionar y aportar la certificación vigente: las BPM se exigen siempre.', TRUE, 'Correcto. Sin BPM vigentes durante el trámite, la solicitud no prospera.', 2),
      (v_pregunta, 'Presentar el certificado vencido con una carta que explique los motivos del retraso.', FALSE, 'Una carta no reemplaza la certificación vigente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un proyecto planea lanzar un genérico seis meses después de radicar, usando solo el tiempo de ley. ¿Qué análisis es correcto?';
    v_t4 := 'Un cronograma realista suma el tiempo de evaluación (de ley y real, según los indicadores publicados por el Invima), el riesgo de un requerimiento con su término de respuesta y los tiempos de los certificados.';
    v_j1 := $evrsm_json${"external_id":"rsm-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Tiempos de ley e indicadores de desempeño del INVIMA","outcome":"Tiempos de ley e indicadores de desempeño del INVIMA","source":"Decreto 677 de 1995, términos de requerimiento; indicadores de gestión del Invima."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es realista, porque el Invima siempre resuelve las solicitudes dentro del tiempo de ley.', FALSE, 'Los tiempos reales pueden diferir del tiempo de ley.', 0),
      (v_pregunta, 'Es optimista: faltan el posible requerimiento y los tiempos reales del Invima.', TRUE, 'Correcto. Un buen plan usa datos reales y riesgos.', 1),
      (v_pregunta, 'Es realista si la empresa paga la tarifa más alta del manual tarifario del Invima.', FALSE, 'La tarifa no acorta los tiempos de evaluación.', 2),
      (v_pregunta, 'Es pesimista, porque los genéricos se aprueban de inmediato después de radicar el expediente.', FALSE, 'Los genéricos también se evalúan.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un analista comparte su usuario de la plataforma de trámites del Invima con todo el equipo «para no depender de una persona». ¿Cuál es la valoración más acertada?';
    v_t4 := 'Los usuarios de las plataformas de trámites son personales: compartirlos impide atribuir las actuaciones y compromete la seguridad. La continuidad se logra con usuarios propios para cada integrante y suplencias definidas.';
    v_j1 := $evrsm_json${"external_id":"rsm-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Sistema de Trámites en Línea e INVIMA a un clic","outcome":"Sistema de Trámites en Línea e INVIMA a un clic","source":"Buenas prácticas de seguridad de la información; condiciones de uso de las plataformas del Invima."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuado, porque así cualquier integrante del equipo puede radicar trámites a cualquier hora.', FALSE, 'La comodidad no justifica perder la trazabilidad.', 0),
      (v_pregunta, 'Es adecuado si la contraseña del usuario compartido se cambia por lo menos una vez al año.', FALSE, 'Cambiar la contraseña no resuelve que varios usen el mismo usuario.', 1),
      (v_pregunta, 'Es inadecuado solo porque compartir el usuario genera un costo adicional en la plataforma.', FALSE, 'El problema de fondo es la trazabilidad, no un costo.', 2),
      (v_pregunta, 'Es inadecuado: cada persona tiene su usuario; compartirlo impide saber quién radicó qué.', TRUE, 'Correcto. La continuidad se resuelve con usuarios y suplencias propios.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz rsm-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Actos administrativos, CUM y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 5 (Unidad 5. Actos administrativos, CUM y casos integradores) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Actos administrativos, CUM y casos integradores';
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


    v_t3 := '¿Qué es el CUM de un medicamento?';
    v_t4 := 'El Código Único de Medicamentos (CUM) lo asigna el Invima a cada presentación comercial; se construye con el número de expediente y un consecutivo, y se usa en los reportes del sistema de salud, como los de precios de medicamentos.';
    v_j1 := $evrsm_json${"external_id":"rsm-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"CUM: concepto, estructura y uso en el sistema de salud","outcome":"CUM: concepto, estructura y uso en el sistema de salud","source":"Invima, información sobre el Código Único de Medicamentos."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El número de lote que el fabricante imprime en cada empaque del medicamento que distribuye.', FALSE, 'El lote identifica la producción, no la presentación comercial.', 0),
      (v_pregunta, 'El certificado de buenas prácticas de manufactura del fabricante del producto terminado.', FALSE, 'Ese es el certificado de BPM, un documento distinto.', 1),
      (v_pregunta, 'El código que asigna el Invima a cada presentación comercial del medicamento.', TRUE, 'Correcto. Se construye con el expediente y un consecutivo.', 2),
      (v_pregunta, 'El número del acta de la Comisión Revisora que aprobó el principio activo del producto.', FALSE, 'Las actas tienen su propia numeración.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'El Invima niega un registro y notifica la resolución. ¿Qué puede hacer el solicitante si no está de acuerdo con la decisión?';
    v_t4 := 'Contra las decisiones que ponen fin a una actuación administrativa procede el recurso de reposición, que se interpone dentro de los diez días siguientes a la notificación, conforme a la Ley 1437 de 2011.';
    v_j1 := $evrsm_json${"external_id":"rsm-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Requerimientos, negación, desistimiento y recurso de reposición","outcome":"Requerimientos, negación, desistimiento y recurso de reposición","source":"Ley 1437 de 2011, artículos 74 y 76."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Radicar de nuevo el mismo expediente al día siguiente, sin ningún cambio en su contenido.', FALSE, 'Radicar lo mismo no atiende las razones de la negación.', 0),
      (v_pregunta, 'Esperar a que el Invima revise la decisión de oficio en el transcurso del año siguiente.', FALSE, 'No hay una revisión de oficio automática.', 1),
      (v_pregunta, 'Comercializar el producto mientras se resuelve la inconformidad con la decisión.', FALSE, 'Sin registro no se puede comercializar.', 2),
      (v_pregunta, 'Interponer recurso de reposición dentro de los diez días hábiles siguientes a la notificación.', TRUE, 'Correcto. Es el recurso que prevé la Ley 1437 de 2011.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'La resolución de concesión aprueba una vida útil de 24 meses, pero el área comercial imprimió empaques con 36 meses. ¿Qué análisis es correcto?';
    v_t4 := 'La vida útil aprobada en la resolución es una condición del registro; ampliarla exige una modificación sustentada con estabilidad. Mientras tanto, los empaques con otra vida útil no pueden usarse.';
    v_j1 := $evrsm_json${"external_id":"rsm-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"La resolución de concesión del registro sanitario","outcome":"La resolución de concesión del registro sanitario","source":"Decreto 334 de 2022 (modificaciones); Resolución 3157 de 2018."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Esos empaques no se usan: ampliar la vida útil exige un trámite con estabilidad.', TRUE, 'Correcto. La vida útil es una condición aprobada.', 0),
      (v_pregunta, 'Es aceptable si los estudios internos de la empresa muestran que el producto dura 36 meses.', FALSE, 'Los datos internos deben pasar por el trámite antes de aplicarse.', 1),
      (v_pregunta, 'Es aceptable porque la vida útil impresa en el empaque prevalece sobre la de la resolución.', FALSE, 'La resolución define lo aprobado.', 2),
      (v_pregunta, 'Basta con informar al Invima después de vender los lotes que tengan ese empaque nuevo.', FALSE, 'Vender con información no aprobada es un incumplimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para un medicamento importado de liberación prolongada, el equipo planea presentar estabilidad a 25 °C y 60 % HR y un certificado de producto farmacéutico vencido «que se actualizará después». ¿Cuál es la valoración más acertada?';
    v_t4 := 'La Resolución 3157 de 2018 exige estabilidad en condiciones de zona IVb (30 °C ± 2 °C y 75 % ± 5 % HR) para los medicamentos de síntesis química; los certificados (BPM, producto farmacéutico) deben estar vigentes al radicar.';
    v_j1 := $evrsm_json${"external_id":"rsm-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso integrador: medicamento de síntesis química importado de liberación prolongada","outcome":"Caso integrador: medicamento de síntesis química importado de liberación prolongada","source":"Resolución 3157 de 2018; Decreto 677 de 1995, artículo 31."}$evrsm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'rsm-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es viable, porque el Invima acepta cualquiera de las condiciones de estabilidad de la guía ICH.', FALSE, 'Colombia exige la zona IVb.', 0),
      (v_pregunta, 'Es inviable: falta estabilidad de zona IVb y el certificado debe estar vigente.', TRUE, 'Correcto. Ambas brechas llevarían a un requerimiento o a la negación.', 1),
      (v_pregunta, 'Es viable si el producto ya cuenta con la aprobación de una agencia europea de referencia.', FALSE, 'La aprobación extranjera no reemplaza los requisitos colombianos.', 2),
      (v_pregunta, 'Es inviable solo porque los productos de liberación prolongada no pueden importarse al país.', FALSE, 'No existe esa prohibición.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad rsm-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del registro sanitario de medicamentos en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Unidad 1. Fundamentos del registro sanitario de medicamentos en Colombia) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Lectura de una resolución de concesión';
  v_t2 := $evrsm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee la resolución y extrae la modalidad, los actores y las condiciones aprobadas.</li><li>Explica las responsabilidades de cada actor (titular, fabricante, envasador).</li><li>Identifica las condiciones que no pueden cambiarse sin trámite (vida útil, envase, condición de venta, fabricante, envasador).</li><li>Explica qué pasa con los CUM de las dos presentaciones.</li><li>Señala tres riesgos de incumplimiento frecuentes después de la concesión y cómo prevenirlos.</li><li>Indica qué haría el titular si no estuviera de acuerdo con alguna condición y en qué plazo.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar modalidad, actores y condiciones aprobadas en una resolución.</li><li>Derivar las obligaciones de cada actor y del titular.</li><li>Detectar riesgos de incumplimiento a partir de las condiciones aprobadas.</li></ul>
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
  <tr><td>Lectura de la resolución</td><td>25 %</td><td>Identifica con precisión modalidad, actores y condiciones aprobadas.</td><td>Identifica lo principal con alguna omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Responsabilidades</td><td>25 %</td><td>Explica con claridad las responsabilidades de cada actor.</td><td>Explicación correcta pero general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Condiciones y CUM</td><td>25 %</td><td>Reconoce las condiciones que exigen trámite y explica los CUM por presentación.</td><td>Reconoce las condiciones con algún error.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Riesgos y recurso</td><td>15 %</td><td>Riesgos pertinentes con prevención y recurso con plazo correcto.</td><td>Riesgos generales o plazo impreciso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evrsm_html$;
  v_t3 := $evrsm_html$<h2>Caso de estudio</h2>
<p>Te entregan el resumen de una resolución ficticia del Invima (datos simulados): concede registro sanitario en la modalidad importar, envasar y vender; titular: Laboratorios Andes S. A. S. (Bogotá); fabricante del granel: una planta de Ahmedabad (India); envasador: Envasados del Caribe S. A. S. (Barranquilla); principio activo incluido en las normas farmacológicas; vida útil de 24 meses en blíster de PVC/aluminio a temperatura no mayor de 30 °C; condición de venta con fórmula médica; dos presentaciones comerciales (caja por 10 y por 30 tabletas); y se reconoce un recurso de reposición en los diez días siguientes a la notificación.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evrsm_html$;
  v_t4 := 'Ficha de lectura de la resolución con obligaciones y riesgos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evrsm_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 en su versión vigente; Decreto 2106 de 2019 (vía unificada); Decreto 334 de 2022 y Decreto 1474 de 2023; Decreto 1782 de 2014 (biológicos); Decreto 1156 de 2018 (fitoterapéuticos); Decreto 3554 de 2004 (homeopáticos); Resolución 3157 de 2018 (estabilidad); Ley 1437 de 2011 (recursos); esquema de certificación de la OMS (certificado de producto farmacéutico). Cita en APA 7 o en el formato «norma, artículo».</p>$evrsm_html$;
  v_t7 := NULL;
  v_j1 := $evrsm_json$["Modalidad, actores y condiciones aprobadas.","Responsabilidades de cada actor.","Condiciones que exigen trámite para cambiar.","CUM de las presentaciones.","Riesgos y recurso."]$evrsm_json$::jsonb;
  v_j2 := $evrsm_json${"version":1,"total":100,"criteria":[{"id":"lectura-de-la-resolucion","name":"Lectura de la resolución","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica con precisión modalidad, actores y condiciones aprobadas."},{"level":3,"label":"Logrado","description":"Identifica lo principal con alguna omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"responsabilidades","name":"Responsabilidades","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica con claridad las responsabilidades de cada actor."},{"level":3,"label":"Logrado","description":"Explicación correcta pero general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"condiciones-y-cum","name":"Condiciones y CUM","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce las condiciones que exigen trámite y explica los CUM por presentación."},{"level":3,"label":"Logrado","description":"Reconoce las condiciones con algún error."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"riesgos-y-recurso","name":"Riesgos y recurso","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Riesgos pertinentes con prevención y recurso con plazo correcto."},{"level":3,"label":"Logrado","description":"Riesgos generales o plazo impreciso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evrsm_json$::jsonb;
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


  -- ── Actividad rsm-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Clasificación del medicamento y evaluaciones farmacológica, farmacéutica y legal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Unidad 2. Clasificación del medicamento y evaluaciones farmacológica, farmacéutica y legal) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Ruta de evaluación de dos productos';
  v_t2 := $evrsm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y clasifica cada producto.</li><li>Define las evaluaciones que aplican a cada uno y la vía de radicación.</li><li>Lista el contenido principal de cada expediente (legal, de calidad, no clínico y clínico cuando aplique).</li><li>Define la modalidad de cada registro.</li><li>Estima los tiempos con el plazo de ley y el riesgo de requerimientos.</li><li>Señala qué debe verificarse en la norma vigente antes de radicar (por ejemplo, la bioequivalencia del genérico).</li><li>Revisa con la rúbrica y sube tu ruta en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar productos como medicamento nuevo o incluido en las normas farmacológicas.</li><li>Definir la ruta de evaluación y la vía de radicación.</li><li>Planear el contenido del expediente y los tiempos.</li></ul>
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
  <tr><td>Clasificación y evaluaciones</td><td>30 %</td><td>Clasifica bien ambos productos y asigna las evaluaciones y la vía correctas.</td><td>Clasificación correcta con una vía imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Expediente</td><td>25 %</td><td>Contenido completo y diferenciado para cada producto.</td><td>Contenido adecuado con alguna omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Modalidad y tiempos</td><td>20 %</td><td>Modalidades correctas y tiempos realistas con riesgo de requerimientos.</td><td>Correcto con tiempos optimistas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Verificaciones</td><td>15 %</td><td>Identifica lo que debe verificarse en la fuente vigente.</td><td>Verificaciones generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evrsm_html$;
  v_t3 := $evrsm_html$<h2>Caso de estudio</h2>
<p>Laboratorios Andes (ficticio) tiene dos proyectos (datos simulados): (1) un antidiabético de una molécula nueva, aprobado ya en Estados Unidos y Europa, que fabricará en su planta de Bogotá; (2) un genérico de atorvastatina de 20 mg, incluido en las normas farmacológicas, que importará terminado desde Brasil. La gerencia quiere saber qué evaluaciones aplican, por qué vía radicar, qué incluye cada expediente y en qué tiempos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evrsm_html$;
  v_t4 := 'Ruta de evaluación de los dos productos con expediente y tiempos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evrsm_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 en su versión vigente; Decreto 2106 de 2019 (vía unificada); Decreto 334 de 2022 y Decreto 1474 de 2023; Decreto 1782 de 2014 (biológicos); Decreto 1156 de 2018 (fitoterapéuticos); Decreto 3554 de 2004 (homeopáticos); Resolución 3157 de 2018 (estabilidad); Ley 1437 de 2011 (recursos); esquema de certificación de la OMS (certificado de producto farmacéutico). Cita en APA 7 o en el formato «norma, artículo».</p>$evrsm_html$;
  v_t7 := NULL;
  v_j1 := $evrsm_json$["Clasificación de cada producto.","Evaluaciones y vía de radicación.","Contenido del expediente.","Modalidades.","Tiempos y verificaciones previas."]$evrsm_json$::jsonb;
  v_j2 := $evrsm_json${"version":1,"total":100,"criteria":[{"id":"clasificacion-y-evaluaciones","name":"Clasificación y evaluaciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Clasifica bien ambos productos y asigna las evaluaciones y la vía correctas."},{"level":3,"label":"Logrado","description":"Clasificación correcta con una vía imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"expediente","name":"Expediente","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Contenido completo y diferenciado para cada producto."},{"level":3,"label":"Logrado","description":"Contenido adecuado con alguna omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"modalidad-y-tiempos","name":"Modalidad y tiempos","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Modalidades correctas y tiempos realistas con riesgo de requerimientos."},{"level":3,"label":"Logrado","description":"Correcto con tiempos optimistas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"verificaciones","name":"Verificaciones","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Identifica lo que debe verificarse en la fuente vigente."},{"level":3,"label":"Logrado","description":"Verificaciones generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evrsm_json$::jsonb;
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


  -- ── Actividad rsm-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Certificaciones, tarifas, tiempos y trámite en línea' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 4 (Unidad 4. Certificaciones, tarifas, tiempos y trámite en línea) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Lista de verificación para radicar un genérico importado';
  v_t2 := $evrsm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y arma la lista de verificación por bloques: legal, certificaciones, calidad, estabilidad, artes, tarifa y plataforma.</li><li>Marca qué tiene la empresa y qué falta para cada ítem.</li><li>Evalúa el riesgo del certificado de BPM que vence en cuatro meses.</li><li>Evalúa si la estabilidad disponible sustenta la vida útil que se propondría.</li><li>Indica qué documentos requieren traducción y qué verificaciones debes hacer en la norma vigente.</li><li>Decide si se puede radicar en dos meses y con qué condiciones.</li><li>Revisa con la rúbrica y sube tu lista en PDF, DOCX o XLSX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Construir una lista de verificación completa para radicar un registro.</li><li>Detectar brechas antes de radicar.</li><li>Decidir si el expediente está listo y qué falta.</li></ul>
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
  <tr><td>Lista de verificación</td><td>30 %</td><td>Lista completa y organizada por bloques.</td><td>Lista adecuada con algún ítem ausente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Brechas y riesgos</td><td>30 %</td><td>Identifica las brechas reales (BPM por vencer, artes en borrador, traducciones) y su riesgo.</td><td>Identifica brechas con riesgos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vida útil</td><td>15 %</td><td>Propone una vida útil coherente con los datos de zona IVb disponibles.</td><td>Propuesta razonable sin justificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Decisión</td><td>15 %</td><td>Decisión fundamentada con condiciones claras.</td><td>Decisión razonable con condiciones vagas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evrsm_html$;
  v_t3 := $evrsm_html$<h2>Caso de estudio</h2>
<p>Farmacéutica del Llano (ficticia) importará de Argentina tabletas recubiertas de un antihipertensivo incluido en las normas farmacológicas, en la modalidad importar y vender, para radicar el registro en dos meses (datos simulados). Tiene: el expediente técnico del fabricante en inglés, un certificado de BPM del fabricante que vence en cuatro meses, estabilidad a 30 °C / 75 % HR de 12 meses y acelerada de 6, y artes de empaque en borrador.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evrsm_html$;
  v_t4 := 'Lista de verificación con brechas y decisión de radicación.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evrsm_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 en su versión vigente; Decreto 2106 de 2019 (vía unificada); Decreto 334 de 2022 y Decreto 1474 de 2023; Decreto 1782 de 2014 (biológicos); Decreto 1156 de 2018 (fitoterapéuticos); Decreto 3554 de 2004 (homeopáticos); Resolución 3157 de 2018 (estabilidad); Ley 1437 de 2011 (recursos); esquema de certificación de la OMS (certificado de producto farmacéutico). Cita en APA 7 o en el formato «norma, artículo».</p>$evrsm_html$;
  v_t7 := NULL;
  v_j1 := $evrsm_json$["Lista de verificación por bloques.","Brechas identificadas.","Riesgo del certificado de BPM.","Sustento de la vida útil.","Decisión de radicación."]$evrsm_json$::jsonb;
  v_j2 := $evrsm_json${"version":1,"total":100,"criteria":[{"id":"lista-de-verificacion","name":"Lista de verificación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Lista completa y organizada por bloques."},{"level":3,"label":"Logrado","description":"Lista adecuada con algún ítem ausente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"brechas-y-riesgos","name":"Brechas y riesgos","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Identifica las brechas reales (BPM por vencer, artes en borrador, traducciones) y su riesgo."},{"level":3,"label":"Logrado","description":"Identifica brechas con riesgos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vida-util","name":"Vida útil","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Propone una vida útil coherente con los datos de zona IVb disponibles."},{"level":3,"label":"Logrado","description":"Propuesta razonable sin justificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"decision","name":"Decisión","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Decisión fundamentada con condiciones claras."},{"level":3,"label":"Logrado","description":"Decisión razonable con condiciones vagas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evrsm_json$::jsonb;
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


  -- ── Actividad rsm-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Requisitos según el tipo de medicamento' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Unidad 3. Requisitos según el tipo de medicamento) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: clasificación, evaluaciones y expediente del producto de Farmacéutica Atlántico';
  v_t2 := $evrsm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y lista lo que necesitas saber.</li><li>Fase 1: define la modalidad, los actores y sus responsabilidades, y la vigencia del registro que se obtendría.</li><li>Fase 2: clasifica el producto y justifica las evaluaciones que aplican y la vía de radicación.</li><li>Fase 3: arma el índice del expediente (legal, calidad, no clínico y clínico si aplica), con los soportes de cada sección.</li><li>Fase 3: identifica qué datos debes pedir al fabricante extranjero y en qué plazo.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Modalidad, actores, vigencia y responsabilidades.</li>
  <li><strong>Fase 2 · Unidad 2 (clasificación y evaluaciones).</strong> Clasificación del producto, evaluaciones y vía de radicación.</li>
  <li><strong>Fase 3 · Unidad 3 (expediente).</strong> Requisitos del expediente para este tipo de producto.</li>
  <li><strong>Fase 4 · Unidad 4 (radicación).</strong> Certificaciones, tarifa, tiempos y radicación en línea.</li>
  <li><strong>Fase 5 · Unidad 5 (después de la decisión).</strong> Resolución, recursos, CUM y obligaciones posteriores.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Definir la ruta regulatoria de un medicamento importado de liberación prolongada.</li><li>Planear el expediente completo con sus soportes.</li></ul>
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
  <tr><td>Fundamentos</td><td>20 %</td><td>Modalidad, actores, responsabilidades y vigencia correctos.</td><td>Correcto con alguna imprecisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Clasificación y evaluaciones</td><td>30 %</td><td>Reconoce la nueva forma farmacéutica como medicamento nuevo y define evaluaciones y vía.</td><td>Clasificación correcta con justificación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Expediente</td><td>30 %</td><td>Índice completo, coherente y con soportes.</td><td>Índice adecuado con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Relación con el fabricante</td><td>10 %</td><td>Lista clara de datos y plazos.</td><td>Lista general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evrsm_html$;
  v_t3 := $evrsm_html$<h2>Caso de estudio</h2>
<p>Farmacéutica Atlántico (ficticia), de Barranquilla, quiere registrar un medicamento de síntesis química importado: tabletas de liberación prolongada de un antidiabético cuyo principio activo figura en las normas farmacológicas solo en liberación inmediata. El fabricante está en Corea del Sur. La empresa nunca ha registrado un producto importado y te encargó el proceso completo, desde la clasificación hasta el seguimiento después de la concesión (datos simulados). En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evrsm_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evrsm_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 en su versión vigente; Decreto 2106 de 2019 (vía unificada); Decreto 334 de 2022 y Decreto 1474 de 2023; Decreto 1782 de 2014 (biológicos); Decreto 1156 de 2018 (fitoterapéuticos); Decreto 3554 de 2004 (homeopáticos); Resolución 3157 de 2018 (estabilidad); Ley 1437 de 2011 (recursos); esquema de certificación de la OMS (certificado de producto farmacéutico). Cita en APA 7 o en el formato «norma, artículo».</p>$evrsm_html$;
  v_t7 := NULL;
  v_j1 := $evrsm_json$["Modalidad, actores, responsabilidades y vigencia.","Clasificación, evaluaciones y vía.","Índice del expediente con soportes.","Datos a solicitar al fabricante."]$evrsm_json$::jsonb;
  v_j2 := $evrsm_json${"version":1,"total":100,"criteria":[{"id":"fundamentos","name":"Fundamentos","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Modalidad, actores, responsabilidades y vigencia correctos."},{"level":3,"label":"Logrado","description":"Correcto con alguna imprecisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"clasificacion-y-evaluaciones","name":"Clasificación y evaluaciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Reconoce la nueva forma farmacéutica como medicamento nuevo y define evaluaciones y vía."},{"level":3,"label":"Logrado","description":"Clasificación correcta con justificación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"expediente","name":"Expediente","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Índice completo, coherente y con soportes."},{"level":3,"label":"Logrado","description":"Índice adecuado con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"relacion-con-el-fabricante","name":"Relación con el fabricante","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Lista clara de datos y plazos."},{"level":3,"label":"Logrado","description":"Lista general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evrsm_json$::jsonb;
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


  -- ── Actividad rsm-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Actos administrativos, CUM y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 5 (Unidad 5. Actos administrativos, CUM y casos integradores) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan completo de registro y seguimiento del producto de Farmacéutica Atlántico';
  v_t2 := $evrsm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: define las certificaciones (BPM y producto farmacéutico), el pago de la tarifa y los pasos de la radicación en línea.</li><li>Fase 4: arma el cronograma con el plazo de ley, un posible requerimiento y los tiempos reales.</li><li>Fase 5: describe qué harías ante un requerimiento, una negación (recurso de reposición) o una concesión.</li><li>Fase 5: define qué haces al recibir la resolución (lectura de condiciones, CUM, artes, difusión interna) y las obligaciones posteriores.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Modalidad, actores, vigencia y responsabilidades.</li>
  <li><strong>Fase 2 · Unidad 2 (clasificación y evaluaciones).</strong> Clasificación del producto, evaluaciones y vía de radicación.</li>
  <li><strong>Fase 3 · Unidad 3 (expediente).</strong> Requisitos del expediente para este tipo de producto.</li>
  <li><strong>Fase 4 · Unidad 4 (radicación).</strong> Certificaciones, tarifa, tiempos y radicación en línea.</li>
  <li><strong>Fase 5 · Unidad 5 (después de la decisión).</strong> Resolución, recursos, CUM y obligaciones posteriores.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Planear la radicación con certificaciones, tarifa y tiempos realistas.</li><li>Preparar la gestión de la decisión y las obligaciones posteriores.</li></ul>
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
  <tr><td>Radicación y tiempos</td><td>25 %</td><td>Certificaciones vigentes, pasos de radicación y cronograma realista con riesgos.</td><td>Correcto con un cronograma optimista.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Gestión de la decisión</td><td>25 %</td><td>Respuestas correctas a cada desenlace, con el recurso y su plazo.</td><td>Respuestas razonables con un plazo impreciso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Obligaciones posteriores</td><td>25 %</td><td>Lectura de la resolución, CUM, artes, modificaciones, notificaciones y farmacovigilancia.</td><td>Obligaciones correctas con alguna omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evrsm_html$;
  v_t3 := $evrsm_html$<h2>Caso de estudio</h2>
<p>Farmacéutica Atlántico (ficticia), de Barranquilla, quiere registrar un medicamento de síntesis química importado: tabletas de liberación prolongada de un antidiabético cuyo principio activo figura en las normas farmacológicas solo en liberación inmediata. El fabricante está en Corea del Sur. La empresa nunca ha registrado un producto importado y te encargó el proceso completo, desde la clasificación hasta el seguimiento después de la concesión (datos simulados). En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás a la gerencia.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evrsm_html$;
  v_t4 := 'Plan completo de registro y seguimiento con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evrsm_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 en su versión vigente; Decreto 2106 de 2019 (vía unificada); Decreto 334 de 2022 y Decreto 1474 de 2023; Decreto 1782 de 2014 (biológicos); Decreto 1156 de 2018 (fitoterapéuticos); Decreto 3554 de 2004 (homeopáticos); Resolución 3157 de 2018 (estabilidad); Ley 1437 de 2011 (recursos); esquema de certificación de la OMS (certificado de producto farmacéutico). Cita en APA 7 o en el formato «norma, artículo».</p>$evrsm_html$;
  v_t7 := NULL;
  v_j1 := $evrsm_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Certificaciones, tarifa y radicación.","Cronograma realista.","Gestión de requerimiento, negación o concesión.","Obligaciones posteriores y resumen ejecutivo."]$evrsm_json$::jsonb;
  v_j2 := $evrsm_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"radicacion-y-tiempos","name":"Radicación y tiempos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Certificaciones vigentes, pasos de radicación y cronograma realista con riesgos."},{"level":3,"label":"Logrado","description":"Correcto con un cronograma optimista."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"gestion-de-la-decision","name":"Gestión de la decisión","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Respuestas correctas a cada desenlace, con el recurso y su plazo."},{"level":3,"label":"Logrado","description":"Respuestas razonables con un plazo impreciso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"obligaciones-posteriores","name":"Obligaciones posteriores","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Lectura de la resolución, CUM, artes, modificaciones, notificaciones y farmacovigilancia."},{"level":3,"label":"Logrado","description":"Obligaciones correctas con alguna omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evrsm_json$::jsonb;
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


  -- ── Foro rsm-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con registros sanitarios';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evrsm_html$<h2>Para empezar</h2>
<p>Piensa en un producto que hayas visto llegar —o no llegar— al mercado por un tema de registro sanitario y cuéntanos en tres o cuatro líneas qué pasó, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evrsm_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre registros sanitarios te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evrsm_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evrsm_html$;
  v_t6 := $evrsm_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evrsm_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué parte del trámite te parece más difícil: clasificar, armar el expediente o responder requerimientos?', '¿Has leído alguna vez una resolución de concesión completa?']::text[];
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


  -- ── Foro rsm-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del registro sanitario de medicamentos en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Unidad 1. Fundamentos del registro sanitario de medicamentos en Colombia) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Quién es quién en el registro?';
  v_t2 := 'Argumentar las responsabilidades de cada actor que figura en un registro sanitario.';
  v_t3 := $evrsm_html$<h2>Caso del foro</h2>
<p>Una resolución ficticia concede un registro en la modalidad importar y vender: titular, una empresa de Bogotá; fabricante, una planta en México; importador, una distribuidora de Cartagena. Tras una queja por tabletas partidas, el titular culpa al fabricante, el fabricante al transportador y el importador dice que «solo recibió cajas cerradas» (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evrsm_html$;
  v_t4 := '¿Qué responsabilidad tiene cada actor y quién debe liderar la investigación ante el Invima?';
  v_t5 := $evrsm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la responsabilidad de cada actor y la norma o el documento que la fija. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evrsm_html$;
  v_t6 := $evrsm_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la responsabilidad de cada actor y la norma o el documento que la fija.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evrsm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué obligaciones tiene el importador en el almacenamiento y la distribución?', '¿Qué documento ordenaría las responsabilidades entre titular y fabricante?', '¿Qué pasa con la farmacovigilancia y las quejas en este esquema?']::text[];
  v_j1 := $evrsm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la responsabilidad de cada actor y la norma o el documento que la fija."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evrsm_json$::jsonb;
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


  -- ── Foro rsm-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Clasificación del medicamento y evaluaciones farmacológica, farmacéutica y legal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Unidad 2. Clasificación del medicamento y evaluaciones farmacológica, farmacéutica y legal) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Foro de interacción 2 · ¿Molécula nueva o genérico?';
  v_t2 := 'Argumentar cuándo un producto requiere evaluación farmacológica aunque su principio activo sea conocido.';
  v_t3 := $evrsm_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio quiere registrar tres productos con principios activos ya incluidos en las normas farmacológicas (datos simulados): (1) tabletas de liberación prolongada de un antihipertensivo que en las normas solo figura en liberación inmediata; (2) una combinación a dosis fija de dos antidiabéticos que figuran por separado; (3) un genérico idéntico al de referencia en forma, concentración e indicación.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evrsm_html$;
  v_t4 := '¿Cuáles de los tres requieren evaluación farmacológica y por qué?';
  v_t5 := $evrsm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el criterio de «medicamento nuevo» que aplicas y su fuente. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evrsm_html$;
  v_t6 := $evrsm_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio de «medicamento nuevo» que aplicas y su fuente.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evrsm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué cambia con una nueva forma farmacéutica de liberación modificada?', '¿Por qué una combinación a dosis fija puede ser un medicamento nuevo?', '¿Qué verificación previa harías para el genérico?']::text[];
  v_j1 := $evrsm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio de «medicamento nuevo» que aplicas y su fuente."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evrsm_json$::jsonb;
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


  -- ── Foro rsm-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Requisitos según el tipo de medicamento' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Unidad 3. Requisitos según el tipo de medicamento) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Foro de interacción 3 · El listado de plantas';
  v_t2 := 'Argumentar la ruta de un producto fitoterapéutico según la planta y la indicación que declara.';
  v_t3 := $evrsm_html$<h2>Caso del foro</h2>
<p>Una empresa ficticia quiere registrar un jarabe de una planta medicinal con indicación expectorante. La planta está en el listado de uso tradicional del Invima, pero la empresa quiere agregar la indicación «antiinflamatorio bronquial», que no figura en el listado para esa planta (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evrsm_html$;
  v_t4 := '¿Qué ruta de registro aplica con cada indicación y qué riesgo corre la empresa si agrega la indicación no listada?';
  v_t5 := $evrsm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo o el listado que respalda tu análisis. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evrsm_html$;
  v_t6 := $evrsm_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo o el listado que respalda tu análisis.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evrsm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿En qué categoría del Decreto 1156 de 2018 quedaría el producto con la indicación listada?', '¿Qué evidencia necesitaría la indicación no listada?', '¿Cómo afecta esto la publicidad del producto?']::text[];
  v_j1 := $evrsm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo o el listado que respalda tu análisis."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evrsm_json$::jsonb;
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


  -- ── Foro rsm-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Certificaciones, tarifas, tiempos y trámite en línea' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 4 (Unidad 4. Certificaciones, tarifas, tiempos y trámite en línea) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Foro de interacción 4 · Seis meses o dos años';
  v_t2 := 'Argumentar cómo construir un cronograma regulatorio realista y comunicarlo a la gerencia.';
  v_t3 := $evrsm_html$<h2>Caso del foro</h2>
<p>La gerencia de un laboratorio ficticio prometió a un cliente institucional tener un genérico importado en seis meses. Asuntos regulatorios estima entre doce y dieciocho meses: el certificado de BPM del fabricante extranjero está en renovación, la estabilidad en zona IVb tiene apenas seis meses de datos y hay riesgo de requerimiento (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evrsm_html$;
  v_t4 := '¿Cómo justificarías el cronograma ante la gerencia y qué opciones legítimas existen para reducir los tiempos?';
  v_t5 := $evrsm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el dato o la norma que sustenta tu estimación de tiempos. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evrsm_html$;
  v_t6 := $evrsm_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el dato o la norma que sustenta tu estimación de tiempos.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evrsm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué parte del cronograma depende de la empresa y qué parte del Invima?', '¿Qué riesgos tiene radicar con información incompleta para «ganar tiempo»?', '¿Cómo comunicarías el riesgo al cliente institucional?']::text[];
  v_j1 := $evrsm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el dato o la norma que sustenta tu estimación de tiempos."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evrsm_json$::jsonb;
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


  -- ── Foro rsm-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Actos administrativos, CUM y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 5 (Unidad 5. Actos administrativos, CUM y casos integradores) en Registro Sanitario de Medicamentos.';
  END IF;
  v_t1 := 'Foro de interacción 5 · La resolución que nadie leyó';
  v_t2 := 'Argumentar por qué las condiciones de la resolución de concesión gobiernan el producto en el mercado.';
  v_t3 := $evrsm_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio obtuvo hace dos años el registro de un antibiótico. Nadie leyó la resolución completa: el registro se otorgó con la condición de venta «uso hospitalario» y con una vida útil de 18 meses, pero el producto se vende en droguerías con 24 meses impresos en el empaque (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evrsm_html$;
  v_t4 := '¿Qué incumplimientos hay, qué riesgo representan y qué debe hacer ahora el titular?';
  v_t5 := $evrsm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la condición aprobada que se incumple y la acción que propones. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evrsm_html$;
  v_t6 := $evrsm_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la condición aprobada que se incumple y la acción que propones.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evrsm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué riesgo para el paciente crea la venta en droguerías de un producto de uso hospitalario?', '¿Qué haría el titular con los lotes en el mercado?', '¿Qué control interno evitaría que esto vuelva a ocurrir?']::text[];
  v_j1 := $evrsm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la condición aprobada que se incumple y la acción que propones."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evrsm_json$::jsonb;
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


  RAISE NOTICE 'Registro Sanitario de Medicamentos: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evrsm$;

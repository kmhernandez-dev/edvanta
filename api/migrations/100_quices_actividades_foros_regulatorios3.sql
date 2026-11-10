-- ============================================================
--  100_quices_actividades_foros_regulatorios3.sql — quizzes, actividades y foros, lote «regulatorios3»
--
--  Generado por scripts/evaluacion-aula.mjs regulatorios3 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Elaboración de Dossiers Farmacéuticos; Respuesta a Requerimientos del INVIMA.
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
--  Curso de Elaboración de Dossiers Farmacéuticos
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evdoss$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Elaboración de Dossiers Farmacéuticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos del Documento Técnico Común (CTD) y su situación en Colombia y Latam', 'Unidad 2. Módulo 1 regional (Colombia) y Módulo 2: resúmenes', 'Unidad 3. Módulo 3 Calidad I: el principio activo (3.2.S) y los archivos maestros', 'Unidad 4. Módulo 3 Calidad II: el producto terminado (3.2.P)', 'Unidad 5. Módulos 4 y 5, eCTD y control de calidad del dossier']::text[])) < 5 THEN
    RAISE NOTICE 'Elaboración de Dossiers Farmacéuticos: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evdoss_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evdoss_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz doss-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del Documento Técnico Común (CTD) y su situación en Colombia y Latam' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos del Documento Técnico Común (CTD) y su situación en Colombia y Latam) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos del Documento Técnico Común (CTD) y su situación en Colombia y Latam';
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


    v_t3 := '¿Cómo se organiza el Documento Técnico Común (CTD) de ICH?';
    v_t4 := 'El CTD (ICH M4) organiza el expediente en cinco módulos: 1, información regional (no armonizada); 2, resúmenes; 3, calidad; 4, informes no clínicos; 5, informes clínicos. Los Módulos 2 a 5 son comunes a las autoridades que lo adoptan.';
    v_j1 := $evdoss_json${"external_id":"doss-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción al curso: qué es un dossier farmacéutico y por qué hablar de CTD","outcome":"Introducción al curso: qué es un dossier farmacéutico y por qué hablar de CTD","source":"ICH M4."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En cinco módulos; el Módulo 1 es regional y los Módulos 2 a 5 están armonizados.', TRUE, 'Correcto. Resúmenes, calidad, no clínico y clínico.', 0),
      (v_pregunta, 'En tres módulos: legal, farmacéutico y farmacológico, igual que el expediente del Invima.', FALSE, 'Esa es la lógica de las evaluaciones colombianas, no del CTD.', 1),
      (v_pregunta, 'En diez módulos, uno por cada tipo de prueba de calidad que se haga al producto.', FALSE, 'El CTD tiene cinco módulos.', 2),
      (v_pregunta, 'En un único documento sin secciones, que cada autoridad organiza como prefiera.', FALSE, 'El CTD tiene una estructura y numeración definidas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿En qué sección del CTD se presentan los datos de estabilidad del producto terminado?';
    v_t4 := 'En el Módulo 3 (ICH M4Q), la estabilidad del principio activo va en 3.2.S.7 y la del producto terminado en 3.2.P.8, con el resumen y las conclusiones, el protocolo y los compromisos posaprobación, y los datos.';
    v_j1 := $evdoss_json${"external_id":"doss-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Estructura, numeración y granularidad del CTD","outcome":"Estructura, numeración y granularidad del CTD","source":"ICH M4Q."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En 3.2.S.7, que corresponde a la estabilidad del principio activo.', FALSE, 'Esa sección es del principio activo.', 0),
      (v_pregunta, 'En el Módulo 1, junto con los formularios y los pagos del trámite.', FALSE, 'El Módulo 1 es regional y administrativo.', 1),
      (v_pregunta, 'En 3.2.P.8, la sección de estabilidad del producto terminado.', TRUE, 'Correcto. Incluye resumen, protocolo, compromisos y datos.', 2),
      (v_pregunta, 'En 2.7, que es el resumen clínico del medicamento.', FALSE, 'El 2.7 resume información clínica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un genérico de un principio activo incluido en las normas farmacológicas se va a registrar ante el Invima. ¿Qué análisis es correcto sobre las evaluaciones y su correspondencia con el CTD?';
    v_t4 := 'El Decreto 677 de 1995 prevé las evaluaciones farmacéutica, legal y farmacológica. Un medicamento incluido en las normas farmacológicas requiere evaluación farmacéutica y legal; la información de calidad que se organiza en el Módulo 3 del CTD sustenta la evaluación farmacéutica.';
    v_j1 := $evdoss_json${"external_id":"doss-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Marco colombiano vigente: formato propio INVIMA frente al CTD","outcome":"Marco colombiano vigente: formato propio INVIMA frente al CTD","source":"Decreto 677 de 1995, arts. 20 a 24; ICH M4."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Requiere evaluación farmacológica completa con estudios clínicos propios en el Módulo 5.', FALSE, 'Al estar en las normas, no requiere evaluación farmacológica.', 0),
      (v_pregunta, 'No requiere ninguna evaluación, porque el principio activo ya está aprobado en Colombia.', FALSE, 'Requiere evaluación farmacéutica y legal.', 1),
      (v_pregunta, 'Requiere solo la evaluación legal, porque la calidad ya fue evaluada para el producto de referencia.', FALSE, 'La calidad de cada producto se evalúa.', 2),
      (v_pregunta, 'Requiere evaluación farmacéutica y legal, sustentada sobre todo en la información de calidad.', TRUE, 'Correcto. Y se verifica si se exige bioequivalencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un consultor afirma que «el CTD ya es obligatorio en Colombia para todos los registros». Según el estado que describe el curso, ¿cuál es la mejor valoración?';
    v_t4 := 'El Invima organiza hoy la evaluación según el Decreto 677 de 1995 y sus formatos; la adopción obligatoria del CTD depende de una reforma que el curso describe como en trámite. Preparar el dossier con estructura CTD es una buena práctica que facilita la evaluación y los registros en otros países.';
    v_j1 := $evdoss_json${"external_id":"doss-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Hacia el CTD obligatorio: reforma en curso, reliance e ICH en Latam","outcome":"Hacia el CTD obligatorio: reforma en curso, reliance e ICH en Latam","source":"Decreto 677 de 1995; ICH M4."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: el Invima solo recibe expedientes en CTD electrónico desde hace años.', FALSE, 'La obligatoriedad depende de una reforma aún en trámite.', 0),
      (v_pregunta, 'Es imprecisa: depende de una reforma en trámite, aunque armar el dossier en CTD es buena práctica.', TRUE, 'Correcto. Facilita además radicar en otros países.', 1),
      (v_pregunta, 'Es correcta solo para los medicamentos genéricos de síntesis química.', FALSE, 'No hay esa obligatoriedad parcial vigente.', 2),
      (v_pregunta, 'Es imprecisa porque el CTD está prohibido en Colombia y solo se acepta el formato propio del Invima.', FALSE, 'No está prohibido; es una buena práctica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz doss-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Módulo 1 regional (Colombia) y Módulo 2: resúmenes' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Módulo 1 regional (Colombia) y Módulo 2: resúmenes) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Módulo 1 regional (Colombia) y Módulo 2: resúmenes';
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


    v_t3 := '¿Qué es el resumen global de calidad (QOS, sección 2.3) del CTD?';
    v_t4 := 'El QOS (2.3) resume la información de calidad del Módulo 3 siguiendo su misma estructura (2.3.S y 2.3.P) y orienta al evaluador. No debe incluir datos que no estén en el Módulo 3; las discrepancias entre ambos generan requerimientos.';
    v_j1 := $evdoss_json${"external_id":"doss-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Quality Overall Summary (QOS, sección 2.3)","outcome":"Quality Overall Summary (QOS, sección 2.3)","source":"ICH M4Q."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un documento con datos nuevos de calidad que no aparecen en ninguna otra parte del dossier.', FALSE, 'El QOS no debe aportar datos nuevos.', 0),
      (v_pregunta, 'El informe clínico principal que demuestra la eficacia del medicamento en pacientes.', FALSE, 'Eso va en el Módulo 5.', 1),
      (v_pregunta, 'El conjunto de formularios del Invima y los comprobantes de pago del trámite.', FALSE, 'Eso es parte del Módulo 1.', 2),
      (v_pregunta, 'Un resumen del Módulo 3 que sigue su misma estructura y ayuda al evaluador a ubicar los datos.', TRUE, 'Correcto. Debe ser coherente con el Módulo 3.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Para un medicamento importado, el certificado de BPM del fabricante fue emitido por una autoridad extranjera. ¿Qué verifica el responsable regulatorio antes de incluirlo en el Módulo 1?';
    v_t4 := 'Los documentos legales del Módulo 1 (BPM, CPP o CVL, poderes, existencia y representación) deben estar vigentes, legalizados o apostillados cuando son extranjeros, y ser coherentes en nombres y direcciones con contratos y demás documentos. Certificados vencidos o sin legalizar son una causa frecuente de requerimientos.';
    v_j1 := $evdoss_json${"external_id":"doss-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Documentación legal para el INVIMA: titular, fabricante, BPM, poderes y legalización","outcome":"Documentación legal para el INVIMA: titular, fabricante, BPM, poderes y legalización","source":"Decreto 677 de 1995 (evaluación legal); requisitos documentales del Invima."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo que tenga el logo de la autoridad, porque el Invima no revisa la vigencia.', FALSE, 'La vigencia y la legalización se revisan.', 0),
      (v_pregunta, 'Que esté vigente, apostillado o legalizado, y con nombres y direcciones coherentes con el dossier.', TRUE, 'Correcto. Son errores frecuentes en los requerimientos.', 1),
      (v_pregunta, 'Que el fabricante lo haya firmado a mano, porque así no necesita ningún otro trámite.', FALSE, 'La firma del fabricante no reemplaza la legalización.', 2),
      (v_pregunta, 'Que haya sido emitido hace más de cinco años, para demostrar la experiencia y trayectoria del fabricante.', FALSE, 'Lo importante es que esté vigente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué diferencia hay entre los resúmenes no clínicos y clínicos (2.4 a 2.7) de un medicamento nuevo y los de un genérico?';
    v_t4 := 'En un medicamento nuevo, los resúmenes 2.4 a 2.7 integran estudios no clínicos y clínicos propios. En un genérico se apoyan sobre todo en la bibliografía y en la demostración de bioequivalencia (o bioexención) con el medicamento de referencia, cuyo informe va en el Módulo 5.';
    v_j1 := $evdoss_json${"external_id":"doss-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Resúmenes y visiones generales no clínicas y clínicas (2.4–2.7)","outcome":"Resúmenes y visiones generales no clínicas y clínicas (2.4–2.7)","source":"ICH M4S e ICH M4E."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En el genérico suelen ser breves y apoyados en bibliografía, y el eje clínico es la bioequivalencia.', TRUE, 'Correcto. El medicamento nuevo los sustenta con sus propios estudios.', 0),
      (v_pregunta, 'En el genérico son más extensos, porque debe repetir todos los estudios clínicos y no clínicos del innovador.', FALSE, 'El genérico no repite los estudios del innovador.', 1),
      (v_pregunta, 'No hay ninguna diferencia: ambos presentan exactamente los mismos estudios propios.', FALSE, 'Hay diferencias importantes.', 2),
      (v_pregunta, 'En el genérico se omite todo el Módulo 2, porque solo se evalúa la calidad.', FALSE, 'El Módulo 2 se presenta también en el genérico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Al revisar un QOS, encuentras que reporta una vida útil de 36 meses, mientras que el Módulo 3 solo respalda 24 meses. ¿Cuál es la mejor valoración?';
    v_t4 := 'El QOS debe reflejar fielmente el Módulo 3. Una vida útil que no está sustentada por los datos de estabilidad (3.2.P.8) es una discrepancia que genera requerimientos o rechazos; se corrige antes de radicar.';
    v_j1 := $evdoss_json${"external_id":"doss-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: redactar el QOS de un genérico a partir del Módulo 3","outcome":"Caso práctico: redactar el QOS de un genérico a partir del Módulo 3","source":"ICH M4Q."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No importa, porque el evaluador solo lee el QOS y no revisa el Módulo 3.', FALSE, 'El evaluador revisa ambos y detecta la discrepancia.', 0),
      (v_pregunta, 'Conviene dejarlo así, porque una vida útil mayor favorece la aprobación y la comercialización del producto.', FALSE, 'Una afirmación sin sustento es un error grave.', 1),
      (v_pregunta, 'Es una discrepancia que debe corregirse: el QOS no puede afirmar lo que el Módulo 3 no respalda.', TRUE, 'Correcto. Se alinea con los datos.', 2),
      (v_pregunta, 'Es un error menor que se corrige después de obtener el registro sanitario.', FALSE, 'Debe corregirse antes de radicar.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz doss-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Módulo 3 Calidad I: el principio activo (3.2.S) y los archivos maestros' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Módulo 3 Calidad I: el principio activo (3.2.S) y los archivos maestros) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Módulo 3 Calidad I: el principio activo (3.2.S) y los archivos maestros';
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


    v_t3 := '¿Qué se presenta en la sección 3.2.S.4 del CTD?';
    v_t4 := 'La sección 3.2.S del CTD (ICH M4Q) incluye: S.1 información general, S.2 fabricación, S.3 caracterización (estructura e impurezas), S.4 control del principio activo (especificaciones, métodos, validación, análisis de lotes, justificación), S.5 estándares de referencia, S.6 envase y cierre, S.7 estabilidad.';
    v_j1 := $evdoss_json${"external_id":"doss-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Secciones 3.2.S.1 a 3.2.S.7: del nombre a la estabilidad del API","outcome":"Secciones 3.2.S.1 a 3.2.S.7: del nombre a la estabilidad del API","source":"ICH M4Q."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La descripción del proceso de síntesis del principio activo y los controles de sus pasos críticos.', FALSE, 'Eso va en 3.2.S.2 (fabricación).', 0),
      (v_pregunta, 'El control del principio activo: especificaciones, métodos, validación, análisis de lotes y justificación.', TRUE, 'Correcto. Es la sección del control del principio activo.', 1),
      (v_pregunta, 'El sistema de envase y cierre en que se almacena el principio activo.', FALSE, 'Eso va en 3.2.S.6 (envase y cierre).', 2),
      (v_pregunta, 'Los estudios de estabilidad del principio activo, su periodo de reanálisis y las condiciones de almacenamiento.', FALSE, 'Eso va en 3.2.S.7 (estabilidad).', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un principio activo con dosis máxima diaria de 1 g presenta una impureza no identificada al 0,12 %. ¿Qué indica ICH Q3A?';
    v_t4 := 'Para dosis máximas diarias de hasta 2 g, ICH Q3A fija un umbral de notificación de 0,05 %, de identificación de 0,10 % (o 1,0 mg/día, el menor) y de calificación de 0,15 % (o 1,0 mg/día, el menor). Una impureza al 0,12 % debe identificarse.';
    v_j1 := $evdoss_json${"external_id":"doss-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Impurezas, solventes residuales y nitrosaminas en 3.2.S.3 y 3.2.S.4","outcome":"Impurezas, solventes residuales y nitrosaminas en 3.2.S.3 y 3.2.S.4","source":"ICH Q3A(R2)."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Nada, porque solo se identifican las impurezas que superan el 1 %.', FALSE, 'El umbral de identificación es mucho menor.', 0),
      (v_pregunta, 'Que basta con reportarla, porque está por debajo del umbral de calificación.', FALSE, 'También supera el umbral de identificación.', 1),
      (v_pregunta, 'Que debe eliminarse el lote completo, porque toda impureza desconocida es inaceptable.', FALSE, 'No es lo que establece la guía.', 2),
      (v_pregunta, 'Que debe identificarse, porque supera el umbral de identificación de 0,10 % para esa dosis.', TRUE, 'Correcto. Su calificación depende del umbral de 0,15 %.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un fabricante de principio activo presenta su información mediante un archivo maestro (DMF/ASMF). ¿Qué análisis es correcto sobre su manejo?';
    v_t4 := 'El archivo maestro del principio activo (DMF o ASMF) tiene una parte abierta (para el solicitante) y una parte cerrada o restringida (confidencial, que el fabricante presenta directamente a la autoridad), con una carta de acceso que autoriza a la autoridad a consultarla. El certificado de idoneidad de la Farmacopea Europea (CEP) es otra vía.';
    v_j1 := $evdoss_json${"external_id":"doss-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"DMF, ASMF y CEP: parte abierta, parte cerrada y carta de acceso","outcome":"DMF, ASMF y CEP: parte abierta, parte cerrada y carta de acceso","source":"Procedimientos de DMF/ASMF y CEP."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El titular del registro recibe la parte cerrada completa del fabricante y la incluye tal cual en su dossier.', FALSE, 'La parte cerrada es confidencial del fabricante.', 0),
      (v_pregunta, 'El DMF reemplaza toda la información de calidad del producto terminado en el Módulo 3.', FALSE, 'Solo cubre el principio activo.', 1),
      (v_pregunta, 'El titular recibe la parte abierta y una carta de acceso; la parte cerrada va directo a la autoridad.', TRUE, 'Correcto. Protege la información confidencial del fabricante.', 2),
      (v_pregunta, 'El DMF solo sirve para los medicamentos biológicos y no para los principios activos de síntesis química.', FALSE, 'Se usa también para principios activos de síntesis.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'El paquete de un proveedor de principio activo no incluye la evaluación del riesgo de nitrosaminas y su estabilidad tiene datos de hace diez años. Alguien propone radicar así «porque el proveedor es conocido». ¿Cuál es la mejor valoración?';
    v_t4 := 'Las autoridades exigen una evaluación del riesgo de nitrosaminas para los principios activos y productos, y datos de estabilidad que respalden el periodo de reanálisis. Un paquete incompleto del proveedor es una brecha que debe cerrarse antes de radicar.';
    v_j1 := $evdoss_json${"external_id":"doss-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: evaluar el paquete técnico de un proveedor de API y completar 3.2.S","outcome":"Caso práctico: evaluar el paquete técnico de un proveedor de API y completar 3.2.S","source":"ICH M4Q; ICH Q3A; requisitos de las autoridades sobre nitrosaminas."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es arriesgado: son brechas que deben cerrarse con el proveedor antes de radicar.', TRUE, 'Correcto. Las autoridades exigen la evaluación de nitrosaminas.', 0),
      (v_pregunta, 'Es aceptable, porque la reputación del proveedor reemplaza la documentación técnica.', FALSE, 'La reputación no reemplaza los datos.', 1),
      (v_pregunta, 'Es aceptable si se promete enviar la información después de obtener el registro.', FALSE, 'La información debe estar en el dossier.', 2),
      (v_pregunta, 'Es arriesgado solo porque los datos de estabilidad deben ser de un solo lote.', FALSE, 'El problema es la falta de datos actuales y de la evaluación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz doss-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Módulo 3 Calidad II: el producto terminado (3.2.P)' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Módulo 3 Calidad II: el producto terminado (3.2.P)) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Módulo 3 Calidad II: el producto terminado (3.2.P)';
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


    v_t3 := '¿Qué contiene la sección 3.2.P.2 (desarrollo farmacéutico) según ICH Q8(R2)?';
    v_t4 := 'La sección 3.2.P.2 explica por qué el producto se formuló y fabrica como se hace: perfil objetivo de calidad, atributos críticos de calidad, selección de excipientes, desarrollo del proceso y, en genéricos, la comparación de disolución con el producto de referencia (ICH Q8(R2)).';
    v_j1 := $evdoss_json${"external_id":"doss-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"3.2.P.1 y 3.2.P.2: composición y desarrollo farmacéutico según ICH Q8(R2)","outcome":"3.2.P.1 y 3.2.P.2: composición y desarrollo farmacéutico según ICH Q8(R2)","source":"ICH Q8(R2); ICH M4Q."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo el certificado de análisis del primer lote fabricado del producto.', FALSE, 'El desarrollo va mucho más allá de un certificado.', 0),
      (v_pregunta, 'Los informes de los estudios clínicos de eficacia y seguridad realizados con el producto terminado en pacientes.', FALSE, 'Eso va en el Módulo 5.', 1),
      (v_pregunta, 'El perfil de calidad objetivo, los atributos críticos y la justificación de la fórmula y los excipientes.', TRUE, 'Correcto. En genéricos, incluye la disolución comparativa.', 2),
      (v_pregunta, 'La lista de precios y de presentaciones comerciales que se venderán en cada uno de los países de destino.', FALSE, 'No es información de desarrollo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un genérico se comercializará en Colombia. ¿Qué condiciones de estudio de estabilidad a largo plazo corresponden según la guía colombiana?';
    v_t4 := 'La Resolución 3157 de 2018 (guía de estudios de estabilidad) ubica a Colombia en la zona climática IVb, con condiciones de largo plazo de 30 °C y 75 % de humedad relativa, salvo productos que requieren almacenamiento especial.';
    v_j1 := $evdoss_json${"external_id":"doss-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"3.2.P.7–3.2.P.8: envase y estabilidad (Res. 3157 de 2018 y zona IVb)","outcome":"3.2.P.7–3.2.P.8: envase y estabilidad (Res. 3157 de 2018 y zona IVb)","source":"Resolución 3157 de 2018."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Las de la zona climática IVb: 30 °C y 75 % de humedad relativa.', TRUE, 'Correcto. Es la zona asignada a Colombia.', 0),
      (v_pregunta, 'Las de la zona climática II: 25 °C y 60 % de humedad relativa.', FALSE, 'No es la zona que exige la guía colombiana.', 1),
      (v_pregunta, 'Refrigeración a 5 °C para todos los medicamentos, sin importar su forma farmacéutica.', FALSE, 'La refrigeración aplica solo a productos que la requieren.', 2),
      (v_pregunta, 'Cualquier condición que elija el fabricante, porque la guía no fija condiciones.', FALSE, 'La guía fija condiciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'El método de valoración de un producto es el de la farmacopea vigente, aplicado sin cambios. ¿Qué análisis es correcto sobre su documentación?';
    v_t4 := 'Los métodos propios se validan según ICH Q2(R2); los métodos farmacopeicos aplicados sin cambios se verifican en las condiciones del laboratorio. Las especificaciones de liberación y de vida útil se fijan y justifican según ICH Q6A.';
    v_j1 := $evdoss_json${"external_id":"doss-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"3.2.P.4–3.2.P.5: excipientes, especificaciones ICH Q6A y métodos analíticos","outcome":"3.2.P.4–3.2.P.5: excipientes, especificaciones ICH Q6A y métodos analíticos","source":"ICH Q2(R2); ICH Q6A."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Requiere una validación completa como si fuera un método propio nuevo.', FALSE, 'Para un método farmacopeico sin cambios basta la verificación.', 0),
      (v_pregunta, 'Requiere la verificación de que el método funciona en las condiciones del laboratorio.', TRUE, 'Correcto. Los métodos propios se validan según ICH Q2(R2).', 1),
      (v_pregunta, 'No requiere ninguna evidencia, porque los métodos de la farmacopea no se revisan.', FALSE, 'Se requiere evidencia de su idoneidad.', 2),
      (v_pregunta, 'Debe reemplazarse siempre por un método propio para que el Invima lo acepte.', FALSE, 'Los métodos farmacopeicos son aceptados.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En un dossier, la fórmula del lote en 3.2.P.3 es de 300.000 tabletas, pero la validación del proceso se hizo en lotes de 100.000. ¿Cuál es la mejor valoración?';
    v_t4 := 'La sección 3.2.P.3 debe ser coherente: la fórmula del lote, el proceso, los controles y la validación deben corresponder al tamaño de lote que se registra, o debe justificarse y comprometerse la validación a escala comercial. Las incoherencias generan requerimientos.';
    v_j1 := $evdoss_json${"external_id":"doss-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: armar la sección 3.2.P de una tableta genérica","outcome":"Caso práctico: armar la sección 3.2.P de una tableta genérica","source":"ICH M4Q; ICH Q8(R2)."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No importa, porque el tamaño de lote no afecta el proceso ni la calidad.', FALSE, 'El escalamiento puede afectar el proceso.', 0),
      (v_pregunta, 'Es correcto siempre que los lotes pequeños hayan cumplido todas las especificaciones de liberación y estabilidad.', FALSE, 'Cumplir con lotes pequeños no valida el tamaño comercial.', 1),
      (v_pregunta, 'Es un problema solo si el producto es un medicamento biológico.', FALSE, 'También aplica a los de síntesis química.', 2),
      (v_pregunta, 'Es una incoherencia que debe explicarse: la validación debe respaldar el tamaño de lote registrado.', TRUE, 'Correcto. O comprometer la validación a escala comercial.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz doss-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Módulos 4 y 5, eCTD y control de calidad del dossier' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Módulos 4 y 5, eCTD y control de calidad del dossier) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Módulos 4 y 5, eCTD y control de calidad del dossier';
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


    v_t3 := '¿En qué sección del CTD va el informe del estudio de bioequivalencia de un genérico?';
    v_t4 := 'Según ICH M4E, los informes de estudios de biodisponibilidad comparativa y bioequivalencia van en la sección 5.3.1.2 del Módulo 5; su resumen se integra en el Módulo 2. El desarrollo farmacéutico (3.2.P.2) discute la disolución comparativa.';
    v_j1 := $evdoss_json${"external_id":"doss-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Estructura de los Módulos 4 y 5 y diferencias entre medicamentos nuevos y genéricos","outcome":"Estructura de los Módulos 4 y 5 y diferencias entre medicamentos nuevos y genéricos","source":"ICH M4E."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En 3.2.P.2, dentro del desarrollo farmacéutico del producto terminado y la disolución comparativa.', FALSE, 'Allí se discute la disolución, no el informe del estudio.', 0),
      (v_pregunta, 'En el Módulo 1, porque es un requisito regional del Invima.', FALSE, 'El informe es un estudio clínico del Módulo 5.', 1),
      (v_pregunta, 'En 5.3.1.2, informes de estudios de biodisponibilidad comparativa y bioequivalencia.', TRUE, 'Correcto. Su resumen va en el Módulo 2.', 2),
      (v_pregunta, 'En el Módulo 4, junto con los estudios de toxicología en animales.', FALSE, 'El Módulo 4 es no clínico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En un eCTD, se actualiza el documento de especificaciones del producto ya presentado. ¿Qué operación de ciclo de vida corresponde?';
    v_t4 := 'El eCTD (especificaciones ICH M2 para la versión 3.2.2 y M8 para la 4.0) combina la estructura de carpetas del CTD con un archivo XML que describe cada documento y su operación de ciclo de vida: nuevo, reemplazar, añadir o eliminar.';
    v_j1 := $evdoss_json${"external_id":"doss-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"eCTD: especificaciones ICH M2/M8, backbone XML y ciclo de vida","outcome":"eCTD: especificaciones ICH M2/M8, backbone XML y ciclo de vida","source":"ICH M2; ICH M8."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, '«Nuevo», porque cada versión de un documento se presenta como un documento distinto.', FALSE, 'Un documento que sustituye a otro no es «nuevo».', 0),
      (v_pregunta, '«Eliminar», porque el documento anterior ya no tiene validez.', FALSE, 'Eliminar retira el documento sin sustituirlo.', 1),
      (v_pregunta, '«Añadir», porque se suma información al documento anterior.', FALSE, '«Añadir» complementa sin sustituir.', 2),
      (v_pregunta, '«Reemplazar», porque el documento nuevo sustituye al anterior.', TRUE, 'Correcto. Así se conserva el historial.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un dossier recibe un requerimiento porque el nombre y la dirección del fabricante difieren entre el certificado de BPM, el contrato de fabricación y el Módulo 3. ¿Qué análisis es correcto?';
    v_t4 := 'Entre los errores más frecuentes están los certificados vencidos o sin legalizar, los poderes incompletos y las discrepancias de nombres y direcciones de fabricantes entre documentos. Se previenen con una revisión cruzada del dossier antes de radicar.';
    v_j1 := $evdoss_json${"external_id":"doss-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Errores frecuentes en dossiers y su sección CTD de origen","outcome":"Errores frecuentes en dossiers y su sección CTD de origen","source":"Buenas prácticas de control de calidad del dossier."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un error frecuente de coherencia documental que se previene con una revisión cruzada antes de radicar.', TRUE, 'Correcto. Se corrige con documentos coherentes.', 0),
      (v_pregunta, 'Es un error del Invima, porque los nombres de los fabricantes no se revisan durante la evaluación del registro.', FALSE, 'La coherencia de los datos del fabricante se revisa.', 1),
      (v_pregunta, 'No tiene importancia, porque basta con que el principio activo sea el correcto.', FALSE, 'La identidad del fabricante es esencial.', 2),
      (v_pregunta, 'Se resuelve cambiando el fabricante por otro que tenga los documentos en orden.', FALSE, 'Se corrige la coherencia, no se cambia el fabricante.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En una empresa, quien arma el dossier lo revisa él mismo y lo radica el mismo día. ¿Cuál es la mejor valoración?';
    v_t4 := 'Un procedimiento de control de calidad del dossier incluye revisión documental, coherencia cruzada (QOS frente a Módulo 3, legales frente a técnicos), verificación de vigencias y aprobación final por una persona distinta del autor. Reduce requerimientos y retrasos.';
    v_j1 := $evdoss_json${"external_id":"doss-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Control de calidad del dossier antes de radicar","outcome":"Control de calidad del dossier antes de radicar","source":"Buenas prácticas de control de calidad del dossier."}$evdoss_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'doss-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es eficiente y suficiente, porque nadie conoce mejor el dossier que la persona que lo armó desde el inicio.', FALSE, 'La autorrevisión no detecta muchos errores.', 0),
      (v_pregunta, 'Es mejor un control de calidad con lista de chequeo, coherencia cruzada y aprobación por otra persona.', TRUE, 'Correcto. Reduce requerimientos.', 1),
      (v_pregunta, 'Es suficiente si el dossier pasa por un corrector ortográfico antes de radicar.', FALSE, 'La ortografía no detecta incoherencias técnicas.', 2),
      (v_pregunta, 'Es mejor que el Invima haga el control de calidad durante la evaluación.', FALSE, 'El control de calidad es responsabilidad del solicitante.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad doss-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del Documento Técnico Común (CTD) y su situación en Colombia y Latam' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos del Documento Técnico Común (CTD) y su situación en Colombia y Latam) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Mapeo de un expediente del Invima a la estructura CTD';
  v_t2 := $evdoss_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Construye una tabla con cada documento del expediente y su sección CTD de destino.</li><li>Identifica qué secciones del CTD quedan vacías (por ejemplo, 3.2.S completa, 3.2.P.2, resúmenes del Módulo 2).</li><li>Analiza qué información del principio activo falta y cómo obtenerla del proveedor.</li><li>Identifica qué documentos son regionales y deben adaptarse al país de destino.</li><li>Propone un plan priorizado para cerrar las brechas.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Ubicar cada documento en el módulo y la sección del CTD.</li><li>Identificar las brechas documentales.</li><li>Proponer un plan para cerrarlas.</li></ul>
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
  <tr><td>Mapeo</td><td>35 %</td><td>Ubica cada documento en el módulo y la sección correctos (ICH M4).</td><td>Mapeo con errores en algunas secciones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Brechas</td><td>30 %</td><td>Identifica las secciones vacías relevantes, incluido el desarrollo farmacéutico y la información del principio activo.</td><td>Identifica brechas generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan</td><td>25 %</td><td>Plan priorizado con responsables y fuentes (proveedor, DMF, desarrollo).</td><td>Plan sin prioridades.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evdoss_html$;
  v_t3 := $evdoss_html$<h2>Caso de estudio</h2>
<p>Genéricos del Caribe (ficticia) tiene el expediente de registro de tabletas de losartán 50 mg organizado con el formato del Invima (datos simulados): documentos legales del titular, certificado de BPM, fórmula cuali-cuantitativa, proceso de fabricación, especificaciones y métodos del producto, certificados de análisis del principio activo, estudio de estabilidad, artes de etiqueta e inserto, y un estudio de bioequivalencia. Quiere preparar el mismo expediente para otro país que exige CTD.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evdoss_html$;
  v_t4 := 'Tabla de mapeo al CTD con análisis de brechas y plan.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evdoss_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías ICH M4 (M4Q, M4S, M4E), Q3A, Q6A, Q8(R2), Q2(R2), M2 y M8; Decreto 677 de 1995 (evaluaciones farmacéutica, legal y farmacológica); Resolución 3157 de 2018 (estabilidad); Decreto 334 de 2022; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, sección».</p>$evdoss_html$;
  v_t7 := NULL;
  v_j1 := $evdoss_json$["Tabla de mapeo.","Secciones vacías.","Información del principio activo.","Documentos regionales.","Plan de cierre."]$evdoss_json$::jsonb;
  v_j2 := $evdoss_json${"version":1,"total":100,"criteria":[{"id":"mapeo","name":"Mapeo","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Ubica cada documento en el módulo y la sección correctos (ICH M4)."},{"level":3,"label":"Logrado","description":"Mapeo con errores en algunas secciones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"brechas","name":"Brechas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Identifica las secciones vacías relevantes, incluido el desarrollo farmacéutico y la información del principio activo."},{"level":3,"label":"Logrado","description":"Identifica brechas generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan","name":"Plan","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan priorizado con responsables y fuentes (proveedor, DMF, desarrollo)."},{"level":3,"label":"Logrado","description":"Plan sin prioridades."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evdoss_json$::jsonb;
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


  -- ── Actividad doss-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Módulo 1 regional (Colombia) y Módulo 2: resúmenes' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Módulo 1 regional (Colombia) y Módulo 2: resúmenes) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Redacción de secciones clave del QOS de un genérico';
  v_t2 := $evdoss_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Redacta 2.3.S.4 (control del principio activo) en un párrafo con los datos esenciales.</li><li>Redacta 2.3.P.2 (desarrollo), justificando la equivalencia de los perfiles de disolución.</li><li>Redacta 2.3.P.5 (control del producto) con las especificaciones críticas.</li><li>Redacta 2.3.P.8 (estabilidad) y analiza si los datos respaldan los 24 meses propuestos.</li><li>Señala qué información adicional pediría un evaluador.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Redactar secciones del QOS coherentes con el Módulo 3.</li><li>Sintetizar y justificar la información crítica.</li><li>Detectar datos que no respaldan una afirmación.</li></ul>
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
  <tr><td>Síntesis y coherencia</td><td>35 %</td><td>Secciones breves, fieles al Módulo 3 y sin datos nuevos.</td><td>Secciones correctas pero extensas o con imprecisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Justificaciones</td><td>30 %</td><td>Justifica la disolución (f2 ≥50) y la vida útil con los datos disponibles.</td><td>Justificación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Análisis crítico</td><td>25 %</td><td>Reconoce que 12 meses de datos a largo plazo exigen justificar la extrapolación y los compromisos de estabilidad.</td><td>Análisis superficial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evdoss_html$;
  v_t3 := $evdoss_html$<h2>Caso de estudio</h2>
<p>Te entregan el Módulo 3 de tabletas de metformina 850 mg de Genéricos Andinos (ficticia) (datos simulados): especificaciones del principio activo con límites de impurezas según la farmacopea; desarrollo con perfiles de disolución comparativos frente al producto de referencia (f2 de 62 en tres medios); especificaciones del producto con disolución y valoración; y estabilidad de tres lotes piloto a 30 °C y 75 % HR por 12 meses más acelerada de 6 meses, que respalda una vida útil propuesta de 24 meses.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evdoss_html$;
  v_t4 := 'Secciones del QOS redactadas con análisis de coherencia.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evdoss_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías ICH M4 (M4Q, M4S, M4E), Q3A, Q6A, Q8(R2), Q2(R2), M2 y M8; Decreto 677 de 1995 (evaluaciones farmacéutica, legal y farmacológica); Resolución 3157 de 2018 (estabilidad); Decreto 334 de 2022; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, sección».</p>$evdoss_html$;
  v_t7 := NULL;
  v_j1 := $evdoss_json$["2.3.S.4.","2.3.P.2.","2.3.P.5.","2.3.P.8.","Información adicional."]$evdoss_json$::jsonb;
  v_j2 := $evdoss_json${"version":1,"total":100,"criteria":[{"id":"sintesis-y-coherencia","name":"Síntesis y coherencia","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Secciones breves, fieles al Módulo 3 y sin datos nuevos."},{"level":3,"label":"Logrado","description":"Secciones correctas pero extensas o con imprecisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"justificaciones","name":"Justificaciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Justifica la disolución (f2 ≥50) y la vida útil con los datos disponibles."},{"level":3,"label":"Logrado","description":"Justificación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"analisis-critico","name":"Análisis crítico","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce que 12 meses de datos a largo plazo exigen justificar la extrapolación y los compromisos de estabilidad."},{"level":3,"label":"Logrado","description":"Análisis superficial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evdoss_json$::jsonb;
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


  -- ── Actividad doss-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Módulo 3 Calidad II: el producto terminado (3.2.P)' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Módulo 3 Calidad II: el producto terminado (3.2.P)) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Armado y revisión de la sección 3.2.P de una tableta genérica';
  v_t2 := $evdoss_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Asigna cada documento a su sección de 3.2.P.</li><li>Verifica la coherencia entre la fórmula del lote y la validación del proceso.</li><li>Revisa si los métodos tienen el soporte adecuado (validación o verificación).</li><li>Revisa si la estabilidad respalda la vida útil propuesta y si las condiciones corresponden a Colombia.</li><li>Revisa si el envase-cierre está bien documentado.</li><li>Lista los puntos que generarían requerimientos y cómo resolverlos.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Ordenar la información en las secciones 3.2.P.1 a 3.2.P.8.</li><li>Verificar la coherencia entre fórmula, proceso, validación, especificaciones y estabilidad.</li><li>Identificar los puntos que generarían requerimientos.</li></ul>
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
  <tr><td>Ubicación</td><td>20 %</td><td>Ubica correctamente cada documento en 3.2.P.1 a 3.2.P.8.</td><td>Ubicación con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Coherencia</td><td>35 %</td><td>Detecta la diferencia entre el lote de 200.000 y la validación en 50.000 y la vida útil frente a 18 meses de datos.</td><td>Detecta una de las dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Métodos y estabilidad</td><td>25 %</td><td>Reconoce la verificación del método farmacopeico y las condiciones de zona IVb.</td><td>Análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Requerimientos</td><td>10 %</td><td>Lista realista de requerimientos y soluciones.</td><td>Lista general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evdoss_html$;
  v_t3 := $evdoss_html$<h2>Caso de estudio</h2>
<p>Te entregan los documentos de tabletas de atorvastatina 20 mg de Laboratorios Sierra (ficticia) (datos simulados): composición por tableta; proceso de granulación húmeda con fórmula de lote de 200.000 tabletas; validación del proceso en tres lotes de 50.000; especificaciones con disolución, valoración e impurezas; método de disolución propio validado y método de valoración farmacopeico; blíster de PVC/aluminio; estabilidad a 30 °C y 75 % HR de tres lotes por 18 meses con vida útil propuesta de 24 meses.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evdoss_html$;
  v_t4 := 'Informe de revisión de la sección 3.2.P con puntos de mejora.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evdoss_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías ICH M4 (M4Q, M4S, M4E), Q3A, Q6A, Q8(R2), Q2(R2), M2 y M8; Decreto 677 de 1995 (evaluaciones farmacéutica, legal y farmacológica); Resolución 3157 de 2018 (estabilidad); Decreto 334 de 2022; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, sección».</p>$evdoss_html$;
  v_t7 := NULL;
  v_j1 := $evdoss_json$["Ubicación en 3.2.P.","Coherencia de lote y validación.","Métodos.","Estabilidad y envase.","Requerimientos previstos."]$evdoss_json$::jsonb;
  v_j2 := $evdoss_json${"version":1,"total":100,"criteria":[{"id":"ubicacion","name":"Ubicación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Ubica correctamente cada documento en 3.2.P.1 a 3.2.P.8."},{"level":3,"label":"Logrado","description":"Ubicación con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"coherencia","name":"Coherencia","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Detecta la diferencia entre el lote de 200.000 y la validación en 50.000 y la vida útil frente a 18 meses de datos."},{"level":3,"label":"Logrado","description":"Detecta una de las dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"metodos-y-estabilidad","name":"Métodos y estabilidad","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce la verificación del método farmacopeico y las condiciones de zona IVb."},{"level":3,"label":"Logrado","description":"Análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"requerimientos","name":"Requerimientos","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Lista realista de requerimientos y soluciones."},{"level":3,"label":"Logrado","description":"Lista general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evdoss_json$::jsonb;
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


  -- ── Actividad doss-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Módulo 3 Calidad I: el principio activo (3.2.S) y los archivos maestros' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Módulo 3 Calidad I: el principio activo (3.2.S) y los archivos maestros) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: índice, Módulos 1 y 2 y sección 3.2.S del dossier de amlodipino';
  v_t2 := $evdoss_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y construye el índice CTD del dossier.</li><li>Fase 1: explica qué evaluaciones del Decreto 677 aplican en Colombia y qué módulos las sustentan.</li><li>Fase 2: lista la documentación legal del Módulo 1 con requisitos de vigencia y legalización.</li><li>Fase 2: define la estructura del QOS y quién lo redactará y revisará.</li><li>Fase 3: planea 3.2.S con la parte abierta del DMF, la carta de acceso y las brechas a pedir al proveedor (impurezas, nitrosaminas, estabilidad).</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Índice CTD y evaluaciones que aplican en Colombia.</li>
  <li><strong>Fase 2 · Unidad 2 (Módulos 1 y 2).</strong> Documentación legal regional y plan del QOS.</li>
  <li><strong>Fase 3 · Unidad 3 (3.2.S).</strong> Información del principio activo a partir del DMF.</li>
  <li><strong>Fase 4 · Unidad 4 (3.2.P).</strong> Producto terminado: desarrollo, proceso, controles y estabilidad.</li>
  <li><strong>Fase 5 · Unidad 5 (Módulos 4 y 5, eCTD y control de calidad).</strong> Bioequivalencia, gestión electrónica y revisión final.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Estructurar el dossier y su documentación regional.</li><li>Planear la sección del principio activo con el DMF.</li></ul>
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
  <tr><td>Índice y evaluaciones</td><td>25 %</td><td>Índice completo y relación correcta con las evaluaciones farmacéutica y legal.</td><td>Índice incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Módulos 1 y 2</td><td>30 %</td><td>Documentación legal con vigencias y legalización, y plan del QOS con revisión.</td><td>Plan parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>3.2.S</td><td>35 %</td><td>Plan del DMF con carta de acceso y brechas concretas (Q3A, nitrosaminas, estabilidad).</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evdoss_html$;
  v_t3 := $evdoss_html$<h2>Caso de estudio</h2>
<p>Laboratorios Pacífico (ficticio) quiere registrar en Colombia tabletas de amlodipino 10 mg genérico, fabricadas en su planta de Cali con principio activo importado de la India mediante DMF (datos simulados), y luego presentarlas en Perú, que exige CTD. Te encargan armar el dossier completo con estructura CTD y control de calidad. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evdoss_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evdoss_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías ICH M4 (M4Q, M4S, M4E), Q3A, Q6A, Q8(R2), Q2(R2), M2 y M8; Decreto 677 de 1995 (evaluaciones farmacéutica, legal y farmacológica); Resolución 3157 de 2018 (estabilidad); Decreto 334 de 2022; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, sección».</p>$evdoss_html$;
  v_t7 := NULL;
  v_j1 := $evdoss_json$["Índice CTD.","Evaluaciones en Colombia.","Módulo 1.","QOS.","3.2.S y DMF."]$evdoss_json$::jsonb;
  v_j2 := $evdoss_json${"version":1,"total":100,"criteria":[{"id":"indice-y-evaluaciones","name":"Índice y evaluaciones","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Índice completo y relación correcta con las evaluaciones farmacéutica y legal."},{"level":3,"label":"Logrado","description":"Índice incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"modulos-1-y-2","name":"Módulos 1 y 2","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Documentación legal con vigencias y legalización, y plan del QOS con revisión."},{"level":3,"label":"Logrado","description":"Plan parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"3-2-s","name":"3.2.S","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Plan del DMF con carta de acceso y brechas concretas (Q3A, nitrosaminas, estabilidad)."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evdoss_json$::jsonb;
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


  -- ── Actividad doss-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Módulos 4 y 5, eCTD y control de calidad del dossier' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Módulos 4 y 5, eCTD y control de calidad del dossier) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: dossier completo y control de calidad del amlodipino';
  v_t2 := $evdoss_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: define el contenido de 3.2.P (desarrollo con disolución comparativa, proceso y validación, especificaciones, envase, estabilidad en zona IVb).</li><li>Fase 5: ubica la bioequivalencia en el Módulo 5 y su resumen en el Módulo 2.</li><li>Fase 5: diseña la estructura de carpetas y el control de versiones «eCTD-ready».</li><li>Fase 5: aplica una lista de control de calidad con coherencia cruzada y aprobación final.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el dossier o su índice comentado en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Índice CTD y evaluaciones que aplican en Colombia.</li>
  <li><strong>Fase 2 · Unidad 2 (Módulos 1 y 2).</strong> Documentación legal regional y plan del QOS.</li>
  <li><strong>Fase 3 · Unidad 3 (3.2.S).</strong> Información del principio activo a partir del DMF.</li>
  <li><strong>Fase 4 · Unidad 4 (3.2.P).</strong> Producto terminado: desarrollo, proceso, controles y estabilidad.</li>
  <li><strong>Fase 5 · Unidad 5 (Módulos 4 y 5, eCTD y control de calidad).</strong> Bioequivalencia, gestión electrónica y revisión final.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Completar la sección del producto terminado y el Módulo 5.</li><li>Aplicar el control de calidad y la gestión electrónica del dossier.</li></ul>
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
  <tr><td>3.2.P y Módulo 5</td><td>35 %</td><td>Contenido completo y coherente de 3.2.P y ubicación correcta de la bioequivalencia.</td><td>Contenido incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Gestión electrónica</td><td>15 %</td><td>Estructura de carpetas, PDF y control de versiones coherentes con eCTD.</td><td>Estructura general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Control de calidad</td><td>25 %</td><td>Lista con vigencias, coherencia cruzada y aprobación por un tercero.</td><td>Lista parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evdoss_html$;
  v_t3 := $evdoss_html$<h2>Caso de estudio</h2>
<p>Laboratorios Pacífico (ficticio) quiere registrar en Colombia tabletas de amlodipino 10 mg genérico, fabricadas en su planta de Cali con principio activo importado de la India mediante DMF (datos simulados), y luego presentarlas en Perú, que exige CTD. Te encargan armar el dossier completo con estructura CTD y control de calidad. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el dossier que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evdoss_html$;
  v_t4 := 'Dossier (o índice comentado) con lista de control de calidad y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evdoss_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Guías ICH M4 (M4Q, M4S, M4E), Q3A, Q6A, Q8(R2), Q2(R2), M2 y M8; Decreto 677 de 1995 (evaluaciones farmacéutica, legal y farmacológica); Resolución 3157 de 2018 (estabilidad); Decreto 334 de 2022; normograma del Invima. Cita en APA 7 o en el formato «norma o guía, sección».</p>$evdoss_html$;
  v_t7 := NULL;
  v_j1 := $evdoss_json$["Fases 1 a 3 corregidas, con tabla de cambios.","3.2.P.","Módulo 5.","Gestión electrónica.","Control de calidad y resumen."]$evdoss_json$::jsonb;
  v_j2 := $evdoss_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"3-2-p-y-modulo-5","name":"3.2.P y Módulo 5","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Contenido completo y coherente de 3.2.P y ubicación correcta de la bioequivalencia."},{"level":3,"label":"Logrado","description":"Contenido incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"gestion-electronica","name":"Gestión electrónica","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Estructura de carpetas, PDF y control de versiones coherentes con eCTD."},{"level":3,"label":"Logrado","description":"Estructura general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"control-de-calidad","name":"Control de calidad","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Lista con vigencias, coherencia cruzada y aprobación por un tercero."},{"level":3,"label":"Logrado","description":"Lista parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evdoss_json$::jsonb;
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


  -- ── Foro doss-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con dossiers';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evdoss_html$<h2>Para empezar</h2>
<p>Piensa en un expediente de registro que hayas armado, revisado o conocido y cuéntanos en tres o cuatro líneas qué fue lo más difícil, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evdoss_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué parte del dossier te gustaría dominar al terminarlo?';
  v_t5 := $evdoss_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evdoss_html$;
  v_t6 := $evdoss_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evdoss_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has trabajado con la estructura CTD o solo con el formato del Invima?', '¿Qué sección te parece más difícil de documentar?']::text[];
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


  -- ── Foro doss-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos del Documento Técnico Común (CTD) y su situación en Colombia y Latam' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos del Documento Técnico Común (CTD) y su situación en Colombia y Latam) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Vale la pena armar el dossier en CTD?';
  v_t2 := 'Argumentar las ventajas y los costos de organizar el dossier en CTD aunque la autoridad local no lo exija.';
  v_t3 := $evdoss_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio que solo vende en Colombia duda si migrar sus expedientes a la estructura CTD (datos simulados). Exportar a Perú y Ecuador está en su plan a dos años. El área regulatoria dice que «es doble trabajo» y la gerencia teme el costo.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evdoss_html$;
  v_t4 := '¿Recomendarías migrar a CTD? ¿Cómo lo harías sin duplicar trabajo?';
  v_t5 := $evdoss_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía ICH o la norma que sustenta tu recomendación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evdoss_html$;
  v_t6 := $evdoss_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía ICH o la norma que sustenta tu recomendación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evdoss_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué partes del CTD son armonizadas y cuáles regionales?', '¿Cómo se mapea el expediente actual del Invima a los módulos del CTD?', '¿Qué significa preparar un dossier «eCTD-ready»?']::text[];
  v_j1 := $evdoss_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía ICH o la norma que sustenta tu recomendación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evdoss_json$::jsonb;
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


  -- ── Foro doss-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Módulo 1 regional (Colombia) y Módulo 2: resúmenes' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Módulo 1 regional (Colombia) y Módulo 2: resúmenes) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · El resumen de calidad que nadie lee';
  v_t2 := 'Argumentar el valor del QOS y cómo redactarlo para que sirva al evaluador.';
  v_t3 := $evdoss_html$<h2>Caso del foro</h2>
<p>En un laboratorio ficticio, el QOS se arma al final copiando y pegando párrafos del Módulo 3 (datos simulados). Un evaluador extranjero devolvió el dossier por incoherencias entre el QOS y los datos, y el equipo dice que «nadie lee el QOS».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evdoss_html$;
  v_t4 := '¿Qué valor tiene el QOS para el evaluador y cómo debería prepararse?';
  v_t5 := $evdoss_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía ICH que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evdoss_html$;
  v_t6 := $evdoss_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía ICH que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evdoss_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué estructura debe seguir el QOS?', '¿Qué errores de redacción son más frecuentes?', '¿Quién debería revisar la coherencia entre el QOS y el Módulo 3?']::text[];
  v_j1 := $evdoss_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía ICH que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evdoss_json$::jsonb;
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


  -- ── Foro doss-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Módulo 3 Calidad I: el principio activo (3.2.S) y los archivos maestros' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Módulo 3 Calidad I: el principio activo (3.2.S) y los archivos maestros) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Archivos maestros: ¿confiar en el proveedor?';
  v_t2 := 'Argumentar cómo evaluar la información del proveedor del principio activo sin acceso a su parte confidencial.';
  v_t3 := $evdoss_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio cambia de proveedor de principio activo para ahorrar costos (datos simulados). El nuevo proveedor entrega la parte abierta de su DMF, certificados de análisis y una carta de acceso, pero se niega a compartir la evaluación de nitrosaminas «por confidencialidad».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evdoss_html$;
  v_t4 := '¿Qué verificarías antes de aceptar al proveedor y cómo resolverías la negativa?';
  v_t5 := $evdoss_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o la norma que sustenta cada verificación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evdoss_html$;
  v_t6 := $evdoss_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta cada verificación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evdoss_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué información debe estar en la parte abierta?', '¿Qué responsabilidades tiene el titular frente a la calidad del principio activo?', '¿Qué cambios en el registro implica cambiar de proveedor?']::text[];
  v_j1 := $evdoss_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta cada verificación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evdoss_json$::jsonb;
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


  -- ── Foro doss-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Módulo 3 Calidad II: el producto terminado (3.2.P)' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Módulo 3 Calidad II: el producto terminado (3.2.P)) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Estabilidad en zona IVb para productos importados';
  v_t2 := 'Argumentar cómo cumplir los requisitos de estabilidad cuando el fabricante extranjero estudió otras condiciones.';
  v_t3 := $evdoss_html$<h2>Caso del foro</h2>
<p>Un importador ficticio quiere registrar en Colombia un medicamento fabricado en Europa (datos simulados). El fabricante tiene estabilidad a 25 °C y 60 % HR por 36 meses, pero nada a 30 °C y 75 % HR. Propone «poner en el inserto que se conserve por debajo de 25 °C» y radicar así.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evdoss_html$;
  v_t4 := '¿Es aceptable la propuesta? ¿Qué opciones tiene el importador?';
  v_t5 := $evdoss_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta tu análisis. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evdoss_html$;
  v_t6 := $evdoss_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta tu análisis.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evdoss_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué zona climática corresponde a Colombia y por qué?', '¿Qué riesgos tiene una condición de almacenamiento difícil de cumplir en el país?', '¿Cómo se negocia con el fabricante un estudio adicional?']::text[];
  v_j1 := $evdoss_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta tu análisis."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evdoss_json$::jsonb;
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


  -- ── Foro doss-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Módulos 4 y 5, eCTD y control de calidad del dossier' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Módulos 4 y 5, eCTD y control de calidad del dossier) en Elaboración de Dossiers Farmacéuticos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Errores que generan requerimientos';
  v_t2 := 'Argumentar cómo prevenir los errores más frecuentes de los dossiers.';
  v_t3 := $evdoss_html$<h2>Caso del foro</h2>
<p>Un área regulatoria ficticia recibió requerimientos en el 70 % de sus radicaciones del último año (datos simulados). Los motivos: certificados vencidos o sin apostilla, discrepancias entre el QOS y el Módulo 3, vida útil sin sustento y especificaciones sin justificación.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evdoss_html$;
  v_t4 := '¿Qué controles implementarías para reducir esos requerimientos y cómo medirías el resultado?';
  v_t5 := $evdoss_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o la buena práctica que sustenta cada control. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evdoss_html$;
  v_t6 := $evdoss_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la buena práctica que sustenta cada control.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evdoss_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué errores se pueden detectar con una lista de chequeo?', '¿Cuáles requieren una revisión técnica experta?', '¿Qué indicador usarías para medir la mejora?']::text[];
  v_j1 := $evdoss_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la buena práctica que sustenta cada control."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evdoss_json$::jsonb;
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


  RAISE NOTICE 'Elaboración de Dossiers Farmacéuticos: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evdoss$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Respuesta a Requerimientos del INVIMA
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evresp$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Respuesta a Requerimientos del INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. El auto de requerimiento en el procedimiento administrativo', 'Unidad 2. Tipos de requerimientos y lectura de actas de la Comisión Revisora', 'Unidad 3. Estrategia y estructura de la respuesta técnica', 'Unidad 4. Requerimientos frecuentes por tema técnico', 'Unidad 5. Notificación, radicación, negaciones y recursos']::text[])) < 5 THEN
    RAISE NOTICE 'Respuesta a Requerimientos del INVIMA: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evresp_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evresp_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz resp-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. El auto de requerimiento en el procedimiento administrativo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. El auto de requerimiento en el procedimiento administrativo) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · El auto de requerimiento en el procedimiento administrativo';
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


    v_t3 := 'Según el artículo 17 de la Ley 1437 de 2011 (sustituido por la Ley 1755 de 2015), ¿qué pasa si el peticionario no completa una petición incompleta en el plazo?';
    v_t4 := 'El artículo 17 prevé que la autoridad requiera al peticionario para completar la petición en un máximo de un mes, prorrogable por un término igual si se pide antes de vencer. Si no cumple, se entiende que desistió; la autoridad lo declara y archiva con un acto motivado que se notifica personalmente y contra el que solo procede reposición. La petición puede presentarse de nuevo completa.';
    v_j1 := $evresp_json${"external_id":"resp-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"La solicitud ante el INVIMA como derecho de petición: CPACA y Ley 1755 de 2015","outcome":"La solicitud ante el INVIMA como derecho de petición: CPACA y Ley 1755 de 2015","source":"Ley 1755 de 2015, art. 17."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La autoridad debe decidir de fondo con la información que tenga en el expediente en ese momento.', FALSE, 'La norma prevé el desistimiento tácito.', 0),
      (v_pregunta, 'Se entiende que desistió; la autoridad lo declara y archiva con un acto que admite reposición.', TRUE, 'Correcto. La solicitud puede volver a presentarse completa.', 1),
      (v_pregunta, 'La petición se aprueba automáticamente por silencio administrativo positivo.', FALSE, 'No opera el silencio positivo en ese caso.', 2),
      (v_pregunta, 'El peticionario recibe una multa y queda inhabilitado para volver a radicar.', FALSE, 'No hay multa ni inhabilidad; puede radicar de nuevo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'El Invima requiere información en la evaluación farmacéutica de un trámite de registro regido por el Decreto 677 de 1995. ¿Qué plazo tiene el interesado para responder?';
    v_t4 := 'El Decreto 677 de 1995 (art. 23, num. 3) prevé, en la evaluación farmacéutica, un único requerimiento con 30 días hábiles para responder; vencido el término, se entiende abandonada la solicitud. Para medicamentos en normas farmacológicas y nuevos el plazo es de 60 días hábiles (arts. 25 y 29) y para importados de 40 (art. 31).';
    v_j1 := $evresp_json${"external_id":"resp-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Plazos del Decreto 677 de 1995: evaluación farmacéutica, normas farmacológicas, medicamentos nuevos e importados","outcome":"Plazos del Decreto 677 de 1995: evaluación farmacéutica, normas farmacológicas, medicamentos nuevos e importados","source":"Decreto 677 de 1995, arts. 23, 25, 29 y 31."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Cinco días hábiles, porque la evaluación farmacéutica es un trámite urgente.', FALSE, 'El Decreto 677 fija un plazo mayor.', 0),
      (v_pregunta, 'Un año calendario, porque la información técnica toma mucho tiempo en reunirse y verificarse.', FALSE, 'El plazo es de días hábiles, no de un año.', 1),
      (v_pregunta, 'Treinta días hábiles; vencidos, se entiende abandonada la solicitud de evaluación.', TRUE, 'Correcto. Es un único requerimiento.', 2),
      (v_pregunta, 'No hay plazo: el interesado responde cuando tenga lista la información.', FALSE, 'Sí hay un plazo y una consecuencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular quiere interponer un recurso de reposición contra un auto que le pide información adicional. ¿Qué análisis es correcto?';
    v_t4 := 'El artículo 75 del CPACA dispone que no hay recurso contra los actos de trámite, preparatorios o de ejecución, salvo norma en contrario. El auto de requerimiento es un acto de trámite; los recursos proceden contra la resolución que decide de fondo o que declara el desistimiento.';
    v_j1 := $evresp_json${"external_id":"resp-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Actos de trámite y actos definitivos: auto, resolución y firmeza","outcome":"Actos de trámite y actos definitivos: auto, resolución y firmeza","source":"Ley 1437 de 2011, arts. 74 y 75."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Procede siempre, porque todo acto que expide el Invima admite el recurso de reposición en su contra.', FALSE, 'Los actos de trámite no admiten recursos.', 0),
      (v_pregunta, 'Procede solo si el auto fue notificado por medios electrónicos.', FALSE, 'La forma de notificación no cambia la naturaleza del acto.', 1),
      (v_pregunta, 'Procede solo si lo presenta un abogado dentro de los cinco días siguientes.', FALSE, 'No es la regla para ese tipo de acto.', 2),
      (v_pregunta, 'No procede, porque el auto es un acto de trámite; lo que corresponde es responder dentro del plazo.', TRUE, 'Correcto. Los recursos proceden contra actos definitivos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En una modificación regida por el Decreto 334 de 2022, el área regulatoria pide la prórroga del requerimiento dos días después de vencido el mes. ¿Cuál es la mejor valoración?';
    v_t4 := 'El Decreto 334 de 2022 (art. 8) prevé un único requerimiento con un mes para responder, prorrogable si se pide antes del vencimiento; si no se responde, se entiende que el interesado desiste. Una prórroga pedida después del vencimiento es extemporánea.';
    v_j1 := $evresp_json${"external_id":"resp-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Decreto 334 de 2022: requerimiento único, plazo de un mes, prórroga y desistimiento en renovaciones y modificaciones","outcome":"Decreto 334 de 2022: requerimiento único, plazo de un mes, prórroga y desistimiento en renovaciones y modificaciones","source":"Decreto 334 de 2022, art. 8; Ley 1755 de 2015, art. 17."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es tardía: la prórroga debe pedirse antes de que venza el plazo; el riesgo es el desistimiento.', TRUE, 'Correcto. Por eso se registra la fecha de notificación.', 0),
      (v_pregunta, 'Es oportuna, porque la prórroga puede pedirse en cualquier momento del trámite.', FALSE, 'Debe pedirse antes del vencimiento.', 1),
      (v_pregunta, 'Es oportuna si se paga una tarifa adicional por la solicitud extemporánea.', FALSE, 'No hay una tarifa que habilite la prórroga tardía.', 2),
      (v_pregunta, 'Es irrelevante, porque en las modificaciones del registro sanitario no existe la figura del desistimiento.', FALSE, 'El Decreto 334 sí prevé el desistimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz resp-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Tipos de requerimientos y lectura de actas de la Comisión Revisora' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Tipos de requerimientos y lectura de actas de la Comisión Revisora) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Tipos de requerimientos y lectura de actas de la Comisión Revisora';
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


    v_t3 := '¿Cuáles son los componentes de la evaluación de una solicitud de registro sanitario de medicamentos?';
    v_t4 := 'El Decreto 677 de 1995 prevé las evaluaciones legal, farmacéutica y farmacológica; esta última aplica a medicamentos nuevos y la emite la Sala Especializada de la Comisión Revisora. Cada componente puede generar requerimientos.';
    v_j1 := $evresp_json${"external_id":"resp-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: requerimientos legales, farmacéuticos y farmacológicos","outcome":"Introducción a la unidad: requerimientos legales, farmacéuticos y farmacológicos","source":"Decreto 677 de 1995."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo la evaluación económica del precio de venta del medicamento.', FALSE, 'El precio no es un componente de esa evaluación.', 0),
      (v_pregunta, 'La evaluación clínica de cada paciente que usará el medicamento.', FALSE, 'La evaluación es del producto, no de pacientes.', 1),
      (v_pregunta, 'Solo la visita de inspección a la planta del fabricante.', FALSE, 'La inspección de BPM es un proceso distinto.', 2),
      (v_pregunta, 'Legal, farmacéutica y, cuando aplica, farmacológica.', TRUE, 'Correcto. Cada una puede generar requerimientos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un auto pide «allegar poder que acredite facultades suficientes del apoderado». ¿Qué tipo de requerimiento es y cómo se subsana?';
    v_t4 := 'Los requerimientos legales más frecuentes se refieren a poderes, certificados de existencia y representación, certificados de BPM o de producto farmacéutico, apostilla o legalización y coherencia documental. Se subsanan con documentos vigentes, completos y coherentes.';
    v_j1 := $evresp_json${"external_id":"resp-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Requerimientos legales: poderes, certificados, apostilla, CPP y coherencia documental","outcome":"Requerimientos legales: poderes, certificados, apostilla, CPP y coherencia documental","source":"Decreto 677 de 1995 (evaluación legal)."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es farmacológico y se subsana con un estudio clínico adicional.', FALSE, 'No es un requerimiento técnico.', 0),
      (v_pregunta, 'Es legal y se subsana con un poder vigente, con facultades expresas y coherente con el trámite.', TRUE, 'Correcto. Sin reabrir la evaluación técnica.', 1),
      (v_pregunta, 'Es farmacéutico y se subsana con un nuevo certificado de análisis del producto terminado y sus lotes.', FALSE, 'No se relaciona con la calidad.', 2),
      (v_pregunta, 'No requiere respuesta, porque el apoderado ya radicó el trámite.', FALSE, 'Si no se responde, opera la consecuencia del plazo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En un acta, la Sala Especializada de la Comisión Revisora conceptúa sobre un medicamento nuevo y pide información de seguridad adicional. ¿Qué análisis es correcto sobre el efecto en los plazos?';
    v_t4 := 'Según el artículo 28 del Decreto 677 de 1995, la Comisión Revisora tiene 180 días hábiles para emitir su concepto en la evaluación farmacológica, término que se interrumpe mientras el interesado no responda el requerimiento.';
    v_j1 := $evresp_json${"external_id":"resp-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Del concepto de la Sala al acto administrativo: aprobar, negar, aplazar o requerir","outcome":"Del concepto de la Sala al acto administrativo: aprobar, negar, aplazar o requerir","source":"Decreto 677 de 1995, art. 28."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El plazo de la Comisión Revisora se interrumpe mientras el interesado no responda el requerimiento.', TRUE, 'Correcto. Así lo prevé el artículo 28 del Decreto 677.', 0),
      (v_pregunta, 'El plazo de la Comisión sigue corriendo y el Invima debe decidir aunque no haya respuesta.', FALSE, 'El plazo se interrumpe mientras no se responda.', 1),
      (v_pregunta, 'El concepto de la Sala es definitivo y no admite que el interesado complete la información.', FALSE, 'La Sala puede requerir información.', 2),
      (v_pregunta, 'El requerimiento de la Sala no tiene plazo de respuesta para el interesado.', FALSE, 'Sí hay un plazo de respuesta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un concepto de la Sala recomienda aprobar «con ajustes al inserto y a la información para prescribir». El equipo propone ignorar los ajustes «porque el concepto es favorable». ¿Cuál es la mejor valoración?';
    v_t4 := 'Un concepto que recomienda aprobar con condiciones (ajustes a indicaciones, advertencias o inserto) exige que el titular presente las versiones ajustadas. Convertir el concepto en una lista de requerimientos verificables, con responsables, es la práctica recomendada.';
    v_j1 := $evresp_json${"external_id":"resp-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: analizar un concepto de la Sala y extraer la lista de requerimientos","outcome":"Caso práctico: analizar un concepto de la Sala y extraer la lista de requerimientos","source":"Decreto 677 de 1995 (evaluación farmacológica); actas de la Sala Especializada."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta, porque un concepto favorable aprueba el producto tal como se presentó.', FALSE, 'La aprobación está condicionada a los ajustes.', 0),
      (v_pregunta, 'Es correcta si el inserto ya está impreso y distribuido a las farmacias.', FALSE, 'El inventario no cambia lo que exige el concepto.', 1),
      (v_pregunta, 'Es incorrecta: los ajustes son condiciones que deben presentarse para que la decisión se concrete.', TRUE, 'Correcto. Se convierten en una lista de acciones.', 2),
      (v_pregunta, 'Es incorrecta solo si la Sala lo repite en un segundo concepto.', FALSE, 'No es necesario un segundo concepto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz resp-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Estrategia y estructura de la respuesta técnica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Estrategia y estructura de la respuesta técnica) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Estrategia y estructura de la respuesta técnica';
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


    v_t3 := '¿Por qué se dice que la respuesta al requerimiento es «la última oportunidad» antes de la decisión?';
    v_t4 := 'El Decreto 677 de 1995 (registros) y el Decreto 334 de 2022 (renovaciones y modificaciones) prevén un único requerimiento. La respuesta debe ser completa, trazable, coherente y oportuna, porque un punto sin atender suele llevar a la negación.';
    v_j1 := $evresp_json${"external_id":"resp-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: la respuesta como última oportunidad antes de la decisión","outcome":"Introducción a la unidad: la respuesta como última oportunidad antes de la decisión","source":"Decreto 677 de 1995, arts. 23, 25, 29 y 31; Decreto 334 de 2022, art. 8."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque después de responder ya no se puede presentar ningún recurso contra la decisión que tome el Invima.', FALSE, 'Los recursos proceden contra la decisión de fondo.', 0),
      (v_pregunta, 'Porque suele haber un único requerimiento; si un punto queda sin atender, lo probable es la negación.', TRUE, 'Correcto. Por eso debe ser completa.', 1),
      (v_pregunta, 'Porque el Invima solo lee la primera página de cada respuesta que recibe.', FALSE, 'El Invima evalúa toda la respuesta.', 2),
      (v_pregunta, 'Porque la respuesta reemplaza todo el expediente presentado inicialmente.', FALSE, 'La respuesta complementa el expediente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Qué columnas debería tener una matriz de respuesta punto por punto?';
    v_t4 := 'La matriz acompaña la carta de respuesta: número del requerimiento en el orden del auto, transcripción literal, respuesta concreta, evidencia (documento, versión, fecha), ubicación en el expediente y observaciones.';
    v_j1 := $evresp_json${"external_id":"resp-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"La matriz de respuesta punto por punto","outcome":"La matriz de respuesta punto por punto","source":"Buenas prácticas de respuesta a requerimientos."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo el número del requerimiento y la palabra «cumplido» al frente.', FALSE, 'No permite verificar la respuesta.', 0),
      (v_pregunta, 'El nombre del evaluador, su cargo y su opinión sobre el producto.', FALSE, 'La matriz organiza la respuesta, no al evaluador.', 1),
      (v_pregunta, 'Una sola columna con un texto narrativo extenso que responde todo junto.', FALSE, 'Dificulta verificar cada punto.', 2),
      (v_pregunta, 'Número, transcripción literal, respuesta concreta, evidencia y ubicación en el expediente.', TRUE, 'Correcto. Facilita la evaluación y evita omisiones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En la respuesta se reemplaza el certificado de análisis ya radicado por una nueva versión. ¿Qué análisis es correcto sobre su presentación?';
    v_t4 := 'El soporte documental debe ser verificable: documentos completos, firmados y fechados, con control de versiones (se identifica la versión nueva y lo que reemplaza), apostilla o legalización cuando son extranjeros y traducción cuando corresponde.';
    v_j1 := $evresp_json${"external_id":"resp-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Soporte documental: firmas, versiones, apostilla, traducción y concordancia","outcome":"Soporte documental: firmas, versiones, apostilla, traducción y concordancia","source":"Buenas prácticas de soporte documental."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se identifica la versión nueva e indica expresamente qué documento reemplaza.', TRUE, 'Correcto. Así se conserva la trazabilidad.', 0),
      (v_pregunta, 'Se presenta sin explicación, porque el evaluador encontrará solo la diferencia.', FALSE, 'Sin explicación se pierde la trazabilidad.', 1),
      (v_pregunta, 'Se retira el documento anterior del expediente sin informar al Invima.', FALSE, 'No se retiran documentos sin informar.', 2),
      (v_pregunta, 'Se presentan ambas versiones sin indicar cuál es la vigente para la decisión.', FALSE, 'Genera confusión sobre la versión vigente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un requerimiento pide justificar el límite de una impureza. El equipo propone responder «el límite es adecuado según nuestra experiencia». ¿Cuál es la mejor valoración?';
    v_t4 := 'La justificación científica se apoya en la farmacopea oficial, las guías adoptadas en Colombia y las de ICH/OMS, y en los datos de lotes. Una afirmación sin sustento no atiende el requerimiento.';
    v_j1 := $evresp_json${"external_id":"resp-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Justificación científica: farmacopeas, guías del Ministerio de Salud e ICH/OMS","outcome":"Justificación científica: farmacopeas, guías del Ministerio de Salud e ICH/OMS","source":"Farmacopeas oficiales; guías ICH Q3A y Q6A."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es suficiente, porque la experiencia del fabricante es la mejor evidencia disponible.', FALSE, 'Sin referencias técnicas, la respuesta es débil.', 0),
      (v_pregunta, 'Es suficiente si la carta está firmada por el director técnico del laboratorio.', FALSE, 'La firma no reemplaza la justificación técnica.', 1),
      (v_pregunta, 'Es insuficiente: la justificación debe apoyarse en la farmacopea, las guías aplicables y los datos de lotes.', TRUE, 'Correcto. Una respuesta sin sustento suele llevar a la negación.', 2),
      (v_pregunta, 'Es insuficiente solo porque debería estar escrita en inglés.', FALSE, 'El idioma no es el problema.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz resp-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Requerimientos frecuentes por tema técnico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Requerimientos frecuentes por tema técnico) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Requerimientos frecuentes por tema técnico';
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


    v_t3 := '¿Qué condiciones de estabilidad a largo plazo exige la guía colombiana para los productos que se comercializan en el país?';
    v_t4 := 'La Resolución 3157 de 2018 ubica a Colombia en la zona climática IVb (30 °C y 75 % HR para largo plazo), salvo productos que requieren almacenamiento especial. Los requerimientos sobre vida útil suelen referirse a lotes, tiempos o condiciones.';
    v_j1 := $evresp_json${"external_id":"resp-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Estabilidad: zona climática IVb, lotes, tiempos y vida útil","outcome":"Estabilidad: zona climática IVb, lotes, tiempos y vida útil","source":"Resolución 3157 de 2018."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Las de la zona climática I: 21 °C y 45 % de humedad relativa.', FALSE, 'No es la zona asignada a Colombia.', 0),
      (v_pregunta, 'Las de la zona climática IVb: 30 °C y 75 % de humedad relativa.', TRUE, 'Correcto. Salvo productos con almacenamiento especial.', 1),
      (v_pregunta, 'Las que el fabricante haya usado en su país de origen, sin importar cuáles sean.', FALSE, 'La guía fija las condiciones para Colombia.', 2),
      (v_pregunta, 'Solo condiciones aceleradas de 40 °C, porque reemplazan los estudios a largo plazo.', FALSE, 'Los acelerados no reemplazan los de largo plazo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un auto señala que las especificaciones del producto no incluyen la prueba de disolución. ¿Cómo se responde?';
    v_t4 := 'Los requerimientos de especificaciones apuntan a pruebas faltantes (disolución, uniformidad, sustancias relacionadas), límites sin justificación o diferencias entre liberación y estabilidad. Se responden con las especificaciones corregidas, el método validado o verificado y los resultados de los lotes.';
    v_j1 := $evresp_json${"external_id":"resp-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Especificaciones y métodos analíticos: justificación de límites y validación","outcome":"Especificaciones y métodos analíticos: justificación de límites y validación","source":"Guías ICH Q6A y Q2(R2); farmacopeas oficiales."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Explicando que la disolución no es necesaria porque el principio activo es muy conocido.', FALSE, 'Para una forma sólida oral es una prueba esperada.', 0),
      (v_pregunta, 'Enviando una carta en la que el titular se compromete a hacerla después del registro.', FALSE, 'Debe atenderse en la respuesta.', 1),
      (v_pregunta, 'Presentando las especificaciones con la disolución, el método validado o verificado y los resultados de los lotes.', TRUE, 'Correcto. Con límites justificados.', 2),
      (v_pregunta, 'Retirando la solicitud, porque una prueba faltante no se puede corregir en la respuesta.', FALSE, 'Sí se corrige en la respuesta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un auto cuestiona el producto de referencia usado en el estudio de bioequivalencia porque no corresponde al definido para Colombia. ¿Qué análisis es correcto?';
    v_t4 := 'Cuando se cuestiona el comparador, las opciones son justificar con evidencia que el comparador usado es equivalente al de referencia para Colombia, o hacer un nuevo estudio. Si no es posible en el plazo, se evalúa acotar o desistir y radicar de nuevo con la información completa.';
    v_j1 := $evresp_json${"external_id":"resp-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Bioequivalencia: listado de moléculas, producto de referencia y formato de presentación","outcome":"Bioequivalencia: listado de moléculas, producto de referencia y formato de presentación","source":"Decreto 677 de 1995; requisitos del Invima sobre bioequivalencia."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No tiene solución, porque un estudio de bioequivalencia ya presentado nunca puede complementarse ni justificarse.', FALSE, 'Hay opciones que deben analizarse.', 0),
      (v_pregunta, 'Basta con cambiar el nombre del comparador en el informe del estudio.', FALSE, 'Eso sería alterar la evidencia.', 1),
      (v_pregunta, 'Se resuelve presentando el mismo estudio con una nueva carta de presentación.', FALSE, 'No resuelve el problema del comparador.', 2),
      (v_pregunta, 'Justificar la equivalencia del comparador o evaluar un nuevo estudio, y decidir si responder o desistir.', TRUE, 'Correcto. Es una decisión estratégica con evidencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'La Sala pide ajustar el inserto con una nueva advertencia. El equipo propone enviar solo una frase en la carta. ¿Cuál es la mejor valoración?';
    v_t4 := 'Los requerimientos sobre inserto e información para prescribir se responden con las versiones ajustadas, identificando los cambios (control de cambios o tabla comparativa) y asegurando la coherencia entre inserto, información para prescribir y etiquetas.';
    v_j1 := $evresp_json${"external_id":"resp-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Insertos e información para prescribir: ajustes solicitados por la Sala","outcome":"Insertos e información para prescribir: ajustes solicitados por la Sala","source":"Decreto 677 de 1995; actas de la Sala Especializada."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es mejor presentar el inserto ajustado, con los cambios señalados.', TRUE, 'Correcto. Facilita la verificación.', 0),
      (v_pregunta, 'Es suficiente, porque el Invima se encarga de editar el inserto final antes de aprobar el registro.', FALSE, 'El titular presenta la versión ajustada.', 1),
      (v_pregunta, 'Es suficiente si la advertencia se agrega después en la etiqueta de la caja.', FALSE, 'El ajuste se pide en el inserto.', 2),
      (v_pregunta, 'Es mejor no responder ese punto, porque las advertencias reducen las ventas.', FALSE, 'No responder lleva a la negación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz resp-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Notificación, radicación, negaciones y recursos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Notificación, radicación, negaciones y recursos) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Notificación, radicación, negaciones y recursos';
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


    v_t3 := 'Según el artículo 56 del CPACA, ¿desde cuándo se entiende surtida una notificación electrónica?';
    v_t4 := 'El artículo 56 del CPACA (modificado por la Ley 2080 de 2021) permite notificar por medios electrónicos cuando el administrado lo ha aceptado; la notificación queda surtida desde la fecha y hora en que accede a ella, lo que certifica la administración.';
    v_j1 := $evresp_json${"external_id":"resp-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Notificación de autos y resoluciones: personal, por aviso y electrónica","outcome":"Notificación de autos y resoluciones: personal, por aviso y electrónica","source":"Ley 1437 de 2011, art. 56."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Desde la fecha en que el Invima firma el acto administrativo, aunque el titular todavía no lo conozca.', FALSE, 'La firma no es el momento de la notificación.', 0),
      (v_pregunta, 'Desde que pasan diez días del envío, se haya leído o no.', FALSE, 'No es la regla del artículo 56.', 1),
      (v_pregunta, 'Desde la fecha y hora en que el administrado accede a ella, según lo certifique la administración.', TRUE, 'Correcto. Requiere que el interesado haya aceptado ese medio.', 2),
      (v_pregunta, 'Desde la fecha en que el titular decide imprimirla para archivarla.', FALSE, 'Imprimir no es el criterio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una resolución que niega un registro sanitario se notifica el lunes. ¿Hasta cuándo puede interponerse el recurso de reposición, según el CPACA?';
    v_t4 := 'Según el artículo 76 del CPACA, los recursos de reposición y apelación se interponen por escrito en la diligencia de notificación personal o dentro de los diez días siguientes a ella. El artículo 77 exige expresar los motivos de inconformidad y aportar las pruebas.';
    v_j1 := $evresp_json${"external_id":"resp-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Recursos de reposición y apelación: procedencia, plazo y contenido","outcome":"Recursos de reposición y apelación: procedencia, plazo y contenido","source":"Ley 1437 de 2011, arts. 76 y 77."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Dentro del mes siguiente, igual que la respuesta a un requerimiento.', FALSE, 'Ese es el plazo de las peticiones incompletas.', 0),
      (v_pregunta, 'Dentro de los diez días siguientes a la notificación.', TRUE, 'Correcto. Por escrito y con los motivos de inconformidad.', 1),
      (v_pregunta, 'En cualquier momento, mientras el producto no se haya comercializado.', FALSE, 'Hay un plazo definido.', 2),
      (v_pregunta, 'Dentro de las 24 horas siguientes, porque es un recurso urgente.', FALSE, 'El plazo es de diez días, no de horas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un titular dejó vencer el plazo del recurso y pide la revocatoria directa alegando que la negación es contraria a la ley. ¿Qué análisis es correcto?';
    v_t4 := 'El artículo 93 del CPACA prevé la revocación de actos manifiestamente opuestos a la Constitución o a la ley, no conformes con el interés público o que causen agravio injustificado. Según el artículo 94, la revocación a solicitud de parte por oposición a la ley no procede si el peticionario interpuso los recursos procedentes. La solicitud se resuelve en dos meses (art. 95).';
    v_j1 := $evresp_json${"external_id":"resp-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Revocatoria directa y alternativas: nueva solicitud o desistimiento","outcome":"Revocatoria directa y alternativas: nueva solicitud o desistimiento","source":"Ley 1437 de 2011, arts. 93 a 95."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Procede siempre, porque la revocatoria reemplaza el recurso que no se presentó.', FALSE, 'Tiene causales y límites propios.', 0),
      (v_pregunta, 'No procede nunca contra actos que niegan un registro sanitario.', FALSE, 'La norma no la excluye por ese motivo.', 1),
      (v_pregunta, 'Procede solo si el titular paga de nuevo la tarifa del trámite.', FALSE, 'El pago no es una causal.', 2),
      (v_pregunta, 'Puede pedirse por las causales del artículo 93; esa causal no procede si interpuso los recursos.', TRUE, 'Correcto. Aquí no los interpuso.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Tras un desistimiento por no responder a tiempo una modificación, el gerente pide «presentar un recurso para que nos devuelvan el plazo». ¿Cuál es la mejor valoración?';
    v_t4 := 'El acto que declara el desistimiento admite reposición (Ley 1755 art. 17), útil si hubo un error (por ejemplo, en la notificación). Si el plazo venció por causas del titular, lo práctico es radicar de nuevo la solicitud completa y corregir el control de plazos.';
    v_j1 := $evresp_json${"external_id":"resp-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso práctico: desistimiento en una modificación (Decreto 334) y plan de recuperación","outcome":"Caso práctico: desistimiento en una modificación (Decreto 334) y plan de recuperación","source":"Ley 1755 de 2015, art. 17; Decreto 334 de 2022, art. 8."}$evresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'resp-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Radicar de nuevo la solicitud completa y corregir el control de plazos; recurrir solo si hubo un error.', TRUE, 'Correcto. La solicitud puede volver a presentarse.', 0),
      (v_pregunta, 'El recurso siempre devuelve el plazo completo, porque el desistimiento es una sanción que puede revocarse.', FALSE, 'El desistimiento no es una sanción.', 1),
      (v_pregunta, 'No hay nada que hacer: el producto queda sin posibilidad de modificarse.', FALSE, 'Puede presentarse una nueva solicitud.', 2),
      (v_pregunta, 'Lo más útil es comercializar con el cambio mientras se resuelve el recurso.', FALSE, 'Implementar un cambio no aprobado es un incumplimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad resp-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. El auto de requerimiento en el procedimiento administrativo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. El auto de requerimiento en el procedimiento administrativo) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Cálculo del vencimiento y solicitud de prórroga';
  v_t2 := $evresp_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y evaluar.</p>
<ol><li>Identifica la norma aplicable y el plazo de respuesta de cada auto.</li><li>Calcula el vencimiento de cada uno a partir de una fecha de notificación que definas (en días hábiles o en meses, según corresponda).</li><li>Indica la consecuencia de no responder en cada caso.</li><li>Decide en cuál auto es necesaria la prórroga y hasta cuándo puede pedirse.</li><li>Redacta la solicitud de prórroga motivada.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar la norma y el plazo de cada requerimiento.</li><li>Calcular los vencimientos.</li><li>Redactar una solicitud de prórroga oportuna y motivada.</li></ul>
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
  <tr><td>Norma y plazos</td><td>35 %</td><td>Identifica 30 días hábiles (art. 23), 40 días hábiles (art. 31) y un mes prorrogable (Decreto 334).</td><td>Identifica dos de los tres.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cálculo y consecuencias</td><td>25 %</td><td>Calcula bien los vencimientos y explica abandono o desistimiento.</td><td>Cálculos con errores menores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Prórroga</td><td>30 %</td><td>Solicitud antes del vencimiento, motivada y con un plan concreto.</td><td>Solicitud sin motivación suficiente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evresp_html$;
  v_t3 := $evresp_html$<h2>Caso de estudio</h2>
<p>Farmacéutica Los Andes (ficticia) recibe tres autos del Invima en la misma semana (datos simulados): (1) un requerimiento en la evaluación farmacéutica de un registro nuevo (Decreto 677 de 1995); (2) un requerimiento en el registro de un medicamento importado; (3) un requerimiento en una modificación por cambio de fabricante del principio activo (Decreto 334 de 2022). El fabricante extranjero avisa que la información del tercer auto tardará siete semanas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evresp_html$;
  v_t4 := 'Tabla de vencimientos y solicitud de prórroga.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evresp_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 (arts. 23, 25, 28, 29 y 31); Decreto 334 de 2022 (art. 8); Ley 1755 de 2015 (arts. 17 y 18); Ley 1437 de 2011, CPACA (arts. 56, 74 a 77, 87 y 93 a 95); Resolución 3157 de 2018 (estabilidad); normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evresp_html$;
  v_t7 := NULL;
  v_j1 := $evresp_json$["Norma y plazo por auto.","Cálculo de vencimientos.","Consecuencias.","Decisión sobre la prórroga.","Solicitud redactada."]$evresp_json$::jsonb;
  v_j2 := $evresp_json${"version":1,"total":100,"criteria":[{"id":"norma-y-plazos","name":"Norma y plazos","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Identifica 30 días hábiles (art. 23), 40 días hábiles (art. 31) y un mes prorrogable (Decreto 334)."},{"level":3,"label":"Logrado","description":"Identifica dos de los tres."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"calculo-y-consecuencias","name":"Cálculo y consecuencias","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Calcula bien los vencimientos y explica abandono o desistimiento."},{"level":3,"label":"Logrado","description":"Cálculos con errores menores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"prorroga","name":"Prórroga","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Solicitud antes del vencimiento, motivada y con un plan concreto."},{"level":3,"label":"Logrado","description":"Solicitud sin motivación suficiente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evresp_json$::jsonb;
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


  -- ── Actividad resp-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Tipos de requerimientos y lectura de actas de la Comisión Revisora' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Tipos de requerimientos y lectura de actas de la Comisión Revisora) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Del concepto de la Sala a la lista de requerimientos';
  v_t2 := $evresp_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, analizar y crear.</p>
<ol><li>Identifica el tipo de concepto y su efecto en el trámite.</li><li>Clasifica cada requerimiento como legal, farmacéutico o farmacológico.</li><li>Redacta cada requerimiento como una acción verificable.</li><li>Asigna responsable, evidencia esperada y fecha a cada uno.</li><li>Identifica los riesgos de cada punto (por ejemplo, información que no existe).</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Interpretar el tipo de concepto.</li><li>Convertirlo en una lista de requerimientos verificables.</li><li>Asignar responsables, evidencias y fechas.</li></ul>
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
  <tr><td>Interpretación</td><td>25 %</td><td>Reconoce un concepto de requerir y su efecto en el plazo de la Comisión.</td><td>Interpretación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Clasificación y acciones</td><td>35 %</td><td>Clasifica bien cada punto y lo redacta como acción verificable.</td><td>Clasificación con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan</td><td>30 %</td><td>Responsables, evidencias y fechas realistas, con riesgos identificados.</td><td>Plan sin evidencias o sin riesgos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evresp_html$;
  v_t3 := $evresp_html$<h2>Caso de estudio</h2>
<p>Laboratorios Altamira (ficticia) recibe un concepto de la Sala Especializada sobre su solicitud de una nueva concentración de un antihipertensivo (datos simulados). El concepto dice: «La Sala recomienda requerir al interesado para que: a) allegue la justificación clínica de la nueva concentración; b) ajuste las contraindicaciones del inserto a la información del producto de referencia; c) incluya la advertencia sobre hipotensión en adultos mayores; d) presente el plan de gestión de riesgos actualizado». Además, el auto del Invima incluye un requerimiento legal: el certificado de existencia y representación tiene más de tres meses.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evresp_html$;
  v_t4 := 'Lista de requerimientos verificables con responsables y riesgos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evresp_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 (arts. 23, 25, 28, 29 y 31); Decreto 334 de 2022 (art. 8); Ley 1755 de 2015 (arts. 17 y 18); Ley 1437 de 2011, CPACA (arts. 56, 74 a 77, 87 y 93 a 95); Resolución 3157 de 2018 (estabilidad); normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evresp_html$;
  v_t7 := NULL;
  v_j1 := $evresp_json$["Tipo de concepto.","Clasificación.","Acciones verificables.","Responsables y fechas.","Riesgos."]$evresp_json$::jsonb;
  v_j2 := $evresp_json${"version":1,"total":100,"criteria":[{"id":"interpretacion","name":"Interpretación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce un concepto de requerir y su efecto en el plazo de la Comisión."},{"level":3,"label":"Logrado","description":"Interpretación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"clasificacion-y-acciones","name":"Clasificación y acciones","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Clasifica bien cada punto y lo redacta como acción verificable."},{"level":3,"label":"Logrado","description":"Clasificación con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan","name":"Plan","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responsables, evidencias y fechas realistas, con riesgos identificados."},{"level":3,"label":"Logrado","description":"Plan sin evidencias o sin riesgos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evresp_json$::jsonb;
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


  -- ── Actividad resp-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Requerimientos frecuentes por tema técnico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Requerimientos frecuentes por tema técnico) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Estrategia ante un auto combinado de estabilidad y bioequivalencia';
  v_t2 := $evresp_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar, evaluar y crear.</p>
<ol><li>Analiza qué evidencia exige cada requerimiento y si puede obtenerse en 60 días hábiles.</li><li>Propón cómo acotar la vida útil con los datos disponibles y qué compromisos ofrecer.</li><li>Analiza las opciones frente al comparador (justificación con evidencia o nuevo estudio).</li><li>Redacta las respuestas a los requerimientos 3 y 4.</li><li>Decide la estrategia global (responder completo, acotar o desistir y radicar de nuevo) y justifícala.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Analizar cada requerimiento técnico y su factibilidad en el plazo.</li><li>Decidir entre responder, acotar o desistir.</li><li>Redactar la estrategia y las respuestas posibles.</li></ul>
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
  <tr><td>Análisis técnico</td><td>30 %</td><td>Analiza la evidencia y la factibilidad de cada punto (Res. 3157 de 2018, bioequivalencia, especificaciones, inserto).</td><td>Análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Respuestas</td><td>25 %</td><td>Respuestas 3 y 4 completas y verificables.</td><td>Respuestas incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Estrategia</td><td>35 %</td><td>Decisión justificada con riesgos, plazos y consecuencias de cada opción.</td><td>Decisión sin análisis de consecuencias.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evresp_html$;
  v_t3 := $evresp_html$<h2>Caso de estudio</h2>
<p>Genéricos del Valle (ficticia) solicitó el registro de tabletas de liberación inmediata de un principio activo con bioequivalencia exigida (datos simulados). El auto requiere: (1) estabilidad de largo plazo de tres lotes en zona IVb que respalde la vida útil propuesta de 36 meses (hoy hay 12 meses de datos); (2) justificar el producto de referencia usado en el estudio de bioequivalencia, que se compró en otro país; (3) incluir la prueba de sustancias relacionadas en las especificaciones de estabilidad; (4) ajustar el inserto con una advertencia pedida por la Sala. El plazo es de 60 días hábiles.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evresp_html$;
  v_t4 := 'Informe de estrategia con respuestas propuestas.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evresp_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 (arts. 23, 25, 28, 29 y 31); Decreto 334 de 2022 (art. 8); Ley 1755 de 2015 (arts. 17 y 18); Ley 1437 de 2011, CPACA (arts. 56, 74 a 77, 87 y 93 a 95); Resolución 3157 de 2018 (estabilidad); normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evresp_html$;
  v_t7 := NULL;
  v_j1 := $evresp_json$["Factibilidad por requerimiento.","Vida útil acotada.","Comparador.","Respuestas 3 y 4.","Decisión estratégica."]$evresp_json$::jsonb;
  v_j2 := $evresp_json${"version":1,"total":100,"criteria":[{"id":"analisis-tecnico","name":"Análisis técnico","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Analiza la evidencia y la factibilidad de cada punto (Res. 3157 de 2018, bioequivalencia, especificaciones, inserto)."},{"level":3,"label":"Logrado","description":"Análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"respuestas","name":"Respuestas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Respuestas 3 y 4 completas y verificables."},{"level":3,"label":"Logrado","description":"Respuestas incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"estrategia","name":"Estrategia","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Decisión justificada con riesgos, plazos y consecuencias de cada opción."},{"level":3,"label":"Logrado","description":"Decisión sin análisis de consecuencias."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evresp_json$::jsonb;
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


  -- ── Actividad resp-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Estrategia y estructura de la respuesta técnica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Estrategia y estructura de la respuesta técnica) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: diagnóstico, plan y matriz de respuesta del valsartán';
  v_t2 := $evresp_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define una fecha de notificación.</li><li>Fase 1: identifica la norma y el plazo (60 días hábiles, Decreto 677 art. 25), calcula el vencimiento y decide si hace falta prórroga.</li><li>Fase 2: clasifica los seis requerimientos y redáctalos como acciones verificables con responsables y fechas.</li><li>Fase 3: construye la matriz de respuesta con transcripción, respuesta, evidencia y ubicación.</li><li>Fase 3: define los requisitos del soporte documental (firmas, versiones, apostilla, traducción).</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (procedimiento).</strong> Norma aplicable, plazo, vencimiento y decisión sobre la prórroga.</li>
  <li><strong>Fase 2 · Unidad 2 (tipos de requerimientos).</strong> Clasificación y lista verificable con responsables.</li>
  <li><strong>Fase 3 · Unidad 3 (estrategia).</strong> Matriz de respuesta y soporte documental.</li>
  <li><strong>Fase 4 · Unidad 4 (temas técnicos).</strong> Respuestas técnicas y decisión de responder, acotar o desistir.</li>
  <li><strong>Fase 5 · Unidad 5 (radicación y recursos).</strong> Radicación, seguimiento y plan ante una eventual negación.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diagnosticar el auto y planear la respuesta.</li><li>Construir la matriz de respuesta punto por punto.</li></ul>
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
  <tr><td>Procedimiento</td><td>25 %</td><td>Norma y plazo correctos (art. 25: 60 días hábiles, único requerimiento) con vencimiento calculado.</td><td>Plazo con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Clasificación y plan</td><td>30 %</td><td>Clasifica los seis puntos y asigna responsables y fechas realistas.</td><td>Plan parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Matriz y soporte</td><td>35 %</td><td>Matriz completa y soporte con control de versiones y apostilla.</td><td>Matriz incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evresp_html$;
  v_t3 := $evresp_html$<h2>Caso de estudio</h2>
<p>Laboratorios Cordillera (ficticio) radicó el registro sanitario de tabletas de valsartán 160 mg, un genérico incluido en las normas farmacológicas, con bioequivalencia exigida (datos simulados). El Invima notificó electrónicamente un auto con seis requerimientos: dos legales (poder sin facultades expresas; certificado de BPM del fabricante del principio activo sin apostilla), dos farmacéuticos (especificaciones sin sustancias relacionadas; estabilidad con 6 meses de largo plazo para 24 meses propuestos) y dos sobre el estudio de bioequivalencia (comparador y análisis estadístico). Te encargan gestionar la respuesta de principio a fin. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evresp_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evresp_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 (arts. 23, 25, 28, 29 y 31); Decreto 334 de 2022 (art. 8); Ley 1755 de 2015 (arts. 17 y 18); Ley 1437 de 2011, CPACA (arts. 56, 74 a 77, 87 y 93 a 95); Resolución 3157 de 2018 (estabilidad); normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evresp_html$;
  v_t7 := NULL;
  v_j1 := $evresp_json$["Norma, plazo y vencimiento.","Clasificación.","Plan con responsables.","Matriz de respuesta.","Soporte documental."]$evresp_json$::jsonb;
  v_j2 := $evresp_json${"version":1,"total":100,"criteria":[{"id":"procedimiento","name":"Procedimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Norma y plazo correctos (art. 25: 60 días hábiles, único requerimiento) con vencimiento calculado."},{"level":3,"label":"Logrado","description":"Plazo con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"clasificacion-y-plan","name":"Clasificación y plan","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Clasifica los seis puntos y asigna responsables y fechas realistas."},{"level":3,"label":"Logrado","description":"Plan parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"matriz-y-soporte","name":"Matriz y soporte","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Matriz completa y soporte con control de versiones y apostilla."},{"level":3,"label":"Logrado","description":"Matriz incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evresp_json$::jsonb;
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


  -- ── Actividad resp-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Notificación, radicación, negaciones y recursos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Notificación, radicación, negaciones y recursos) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: respuesta completa y plan de contingencia del valsartán';
  v_t2 := $evresp_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: redacta las respuestas técnicas (especificaciones, estabilidad, bioequivalencia) con su sustento.</li><li>Fase 4: decide si respondes completo, acotas (por ejemplo, la vida útil) o desistes, y justifica.</li><li>Fase 5: describe la radicación, el seguimiento y el control de notificaciones.</li><li>Fase 5: diseña el plan ante una eventual negación (recurso de reposición en diez días o nueva solicitud).</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube la respuesta en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (procedimiento).</strong> Norma aplicable, plazo, vencimiento y decisión sobre la prórroga.</li>
  <li><strong>Fase 2 · Unidad 2 (tipos de requerimientos).</strong> Clasificación y lista verificable con responsables.</li>
  <li><strong>Fase 3 · Unidad 3 (estrategia).</strong> Matriz de respuesta y soporte documental.</li>
  <li><strong>Fase 4 · Unidad 4 (temas técnicos).</strong> Respuestas técnicas y decisión de responder, acotar o desistir.</li>
  <li><strong>Fase 5 · Unidad 5 (radicación y recursos).</strong> Radicación, seguimiento y plan ante una eventual negación.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Redactar las respuestas técnicas y decidir la estrategia.</li><li>Planear la radicación y la defensa ante una negación.</li></ul>
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
  <tr><td>Respuestas técnicas</td><td>30 %</td><td>Respuestas sustentadas en farmacopea, guías y datos.</td><td>Respuestas con sustento parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Estrategia</td><td>25 %</td><td>Decisión justificada sobre responder, acotar o desistir.</td><td>Decisión sin justificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Radicación y recursos</td><td>20 %</td><td>Control de notificaciones y plan de recurso o nueva solicitud con plazos correctos.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evresp_html$;
  v_t3 := $evresp_html$<h2>Caso de estudio</h2>
<p>Laboratorios Cordillera (ficticio) radicó el registro sanitario de tabletas de valsartán 160 mg, un genérico incluido en las normas farmacológicas, con bioequivalencia exigida (datos simulados). El Invima notificó electrónicamente un auto con seis requerimientos: dos legales (poder sin facultades expresas; certificado de BPM del fabricante del principio activo sin apostilla), dos farmacéuticos (especificaciones sin sustancias relacionadas; estabilidad con 6 meses de largo plazo para 24 meses propuestos) y dos sobre el estudio de bioequivalencia (comparador y análisis estadístico). Te encargan gestionar la respuesta de principio a fin. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en la respuesta que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evresp_html$;
  v_t4 := 'Respuesta completa con matriz, plan de contingencia y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evresp_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Decreto 677 de 1995 (arts. 23, 25, 28, 29 y 31); Decreto 334 de 2022 (art. 8); Ley 1755 de 2015 (arts. 17 y 18); Ley 1437 de 2011, CPACA (arts. 56, 74 a 77, 87 y 93 a 95); Resolución 3157 de 2018 (estabilidad); normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evresp_html$;
  v_t7 := NULL;
  v_j1 := $evresp_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Respuestas técnicas.","Decisión estratégica.","Radicación y notificaciones.","Plan ante negación y resumen."]$evresp_json$::jsonb;
  v_j2 := $evresp_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"respuestas-tecnicas","name":"Respuestas técnicas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Respuestas sustentadas en farmacopea, guías y datos."},{"level":3,"label":"Logrado","description":"Respuestas con sustento parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"estrategia","name":"Estrategia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Decisión justificada sobre responder, acotar o desistir."},{"level":3,"label":"Logrado","description":"Decisión sin justificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"radicacion-y-recursos","name":"Radicación y recursos","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Control de notificaciones y plan de recurso o nueva solicitud con plazos correctos."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evresp_json$::jsonb;
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


  -- ── Foro resp-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con requerimientos';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evresp_html$<h2>Para empezar</h2>
<p>Piensa en un requerimiento del Invima que hayas respondido, revisado o conocido y cuéntanos en tres o cuatro líneas qué fue lo más difícil, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evresp_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría hacer mejor al responder un requerimiento?';
  v_t5 := $evresp_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evresp_html$;
  v_t6 := $evresp_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evresp_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué tipo de requerimiento te parece más difícil: legal, farmacéutico o farmacológico?', '¿Has tenido que pedir una prórroga o interponer un recurso?']::text[];
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


  -- ── Foro resp-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. El auto de requerimiento en el procedimiento administrativo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. El auto de requerimiento en el procedimiento administrativo) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · El plazo que nadie anotó';
  v_t2 := 'Argumentar cómo controlar los plazos de los requerimientos para evitar desistimientos y abandonos.';
  v_t3 := $evresp_html$<h2>Caso del foro</h2>
<p>En un laboratorio ficticio, la notificación electrónica de un auto llegó al correo de una persona que estaba de vacaciones (datos simulados). Nadie registró la fecha; cuando se dieron cuenta, faltaban tres días para vencer el mes y la información del fabricante extranjero tardaría seis semanas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evresp_html$;
  v_t4 := '¿Qué harías hoy y qué cambiarías en el proceso para que no se repita?';
  v_t5 := $evresp_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evresp_html$;
  v_t6 := $evresp_html$<h2>Normas de participación</h2>
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
</details>$evresp_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Desde cuándo se cuenta el plazo en una notificación electrónica?', '¿Qué debe contener una solicitud de prórroga?', '¿Qué controles evitarían perder una notificación?']::text[];
  v_j1 := $evresp_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evresp_json$::jsonb;
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


  -- ── Foro resp-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Tipos de requerimientos y lectura de actas de la Comisión Revisora' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Tipos de requerimientos y lectura de actas de la Comisión Revisora) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Leer un acta sin perderse';
  v_t2 := 'Argumentar cómo convertir un concepto de la Sala en acciones concretas.';
  v_t3 := $evresp_html$<h2>Caso del foro</h2>
<p>Un titular ficticio recibe un concepto de la Sala que «aplaza» la decisión sobre una nueva indicación y pide «allegar análisis por subgrupos y datos de seguridad a largo plazo» (datos simulados). El gerente pregunta si eso significa que negaron el producto.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evresp_html$;
  v_t4 := '¿Cómo le explicarías el concepto al gerente y qué plan propondrías?';
  v_t5 := $evresp_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o el documento que sustenta tu interpretación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evresp_html$;
  v_t6 := $evresp_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el documento que sustenta tu interpretación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evresp_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué diferencia hay entre aprobar, negar, aplazar y requerir?', '¿Dónde se ubica en el acta la información relevante?', '¿Qué responsables asignarías a cada punto?']::text[];
  v_j1 := $evresp_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el documento que sustenta tu interpretación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evresp_json$::jsonb;
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


  -- ── Foro resp-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Estrategia y estructura de la respuesta técnica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Estrategia y estructura de la respuesta técnica) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Responder punto por punto o con una carta';
  v_t2 := 'Argumentar el formato de respuesta que mejor sirve al evaluador.';
  v_t3 := $evresp_html$<h2>Caso del foro</h2>
<p>En un laboratorio ficticio, el área regulatoria responde los requerimientos con una carta narrativa de doce páginas (datos simulados). En el último año, tres respuestas fueron negadas porque «no se atendió el requerimiento 4». El equipo dice que «sí estaba, en la página 9».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evresp_html$;
  v_t4 := '¿Qué cambiarías en el formato de respuesta y por qué?';
  v_t5 := $evresp_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la buena práctica que sustenta cada cambio. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evresp_html$;
  v_t6 := $evresp_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la buena práctica que sustenta cada cambio.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evresp_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué ventajas tiene la matriz punto por punto?', '¿Cómo demostrar que cada documento es la versión vigente?', '¿Quién debería revisar la respuesta antes de radicar?']::text[];
  v_j1 := $evresp_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la buena práctica que sustenta cada cambio."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evresp_json$::jsonb;
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


  -- ── Foro resp-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Requerimientos frecuentes por tema técnico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Requerimientos frecuentes por tema técnico) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Responder, acotar o desistir';
  v_t2 := 'Argumentar cuándo conviene responder un requerimiento crítico y cuándo es mejor desistir y radicar de nuevo.';
  v_t3 := $evresp_html$<h2>Caso del foro</h2>
<p>Un titular ficticio recibe un auto que exige un nuevo estudio de bioequivalencia y 12 meses más de estabilidad en zona IVb para un genérico (datos simulados). El plazo es de 60 días hábiles; el estudio tomaría ocho meses. La gerencia quiere «responder lo que se pueda y esperar».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evresp_html$;
  v_t4 := '¿Qué estrategia recomendarías y por qué?';
  v_t5 := $evresp_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta tu recomendación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evresp_html$;
  v_t6 := $evresp_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta tu recomendación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evresp_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué consecuencias tiene responder incompleto?', '¿Qué ventajas tiene el desistimiento expreso?', '¿Qué se puede acotar sin perder el producto?']::text[];
  v_j1 := $evresp_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta tu recomendación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evresp_json$::jsonb;
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


  -- ── Foro resp-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Notificación, radicación, negaciones y recursos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Notificación, radicación, negaciones y recursos) en Respuesta a Requerimientos del INVIMA: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · ¿Vale la pena el recurso?';
  v_t2 := 'Argumentar cuándo conviene un recurso de reposición frente a una nueva solicitud.';
  v_t3 := $evresp_html$<h2>Caso del foro</h2>
<p>El Invima niega el registro de un genérico ficticio porque el intervalo de confianza del 90 % de la Cmax quedó fuera de los límites de aceptación (datos simulados). El titular tiene diez días para recurrir. El área legal quiere recurrir «por principio»; el área técnica cree que el estudio no da para más.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evresp_html$;
  v_t4 := '¿Recomendarías recurrir? ¿Con qué argumentos o qué alternativa?';
  v_t5 := $evresp_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que sustenta tu análisis. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evresp_html$;
  v_t6 := $evresp_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta tu análisis.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evresp_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué requisitos debe cumplir el recurso?', '¿Qué pruebas nuevas podrían cambiar la decisión?', '¿Qué ventajas tiene una nueva solicitud con un nuevo estudio?']::text[];
  v_j1 := $evresp_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que sustenta tu análisis."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evresp_json$::jsonb;
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


  RAISE NOTICE 'Respuesta a Requerimientos del INVIMA: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evresp$;

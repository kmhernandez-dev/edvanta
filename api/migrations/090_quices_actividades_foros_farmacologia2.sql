-- ============================================================
--  090_quices_actividades_foros_farmacologia2.sql — quizzes, actividades y foros, lote «farmacologia2»
--
--  Generado por scripts/evaluacion-aula.mjs farmacologia2 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Psicofarmacología; Farmacología Respiratoria; Farmacología Gastrointestinal.
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
--  Curso de Psicofarmacología
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfpsi$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Psicofarmacología' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Psicofarmacología: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia', 'Unidad 2. Antidepresivos', 'Unidad 3. Ansiolíticos e hipnóticos', 'Unidad 4. Antipsicóticos y estabilizadores del ánimo', 'Unidad 5. TDAH, adicciones, poblaciones especiales y casos integradores']::text[])) < 5 THEN
    RAISE NOTICE 'Psicofarmacología: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfpsi_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfpsi_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fpsi-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia';
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


    v_t3 := '¿Cómo actúan las benzodiacepinas sobre el receptor GABA-A?';
    v_t4 := 'Las benzodiacepinas son moduladores alostéricos positivos del receptor GABA-A: en presencia de GABA aumentan la frecuencia de apertura del canal de cloro. Con el uso continuo aparecen adaptaciones del receptor que explican la tolerancia y la abstinencia.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Glutamato y GABA: el equilibrio excitación-inhibición","outcome":"Glutamato y GABA: el equilibrio excitación-inhibición","source":"Fichas técnicas de las benzodiacepinas."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Bloquean el receptor GABA-A y reducen la entrada de cloro a la neurona durante varias horas.', FALSE, 'Las benzodiacepinas no bloquean el receptor; potencian al GABA.', 0),
      (v_pregunta, 'Son moduladores alostéricos positivos: aumentan la frecuencia de apertura del canal de cloro con GABA.', TRUE, 'Correcto. Necesitan la presencia de GABA para actuar.', 1),
      (v_pregunta, 'Activan directamente el canal de cloro aunque no haya GABA presente en la sinapsis.', FALSE, 'Ese efecto directo no corresponde a las benzodiacepinas.', 2),
      (v_pregunta, 'Inhiben la recaptación de GABA en la sinapsis y aumentan de forma sostenida su concentración en el espacio sináptico.', FALSE, 'Ese no es su mecanismo de acción.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente trae en el mismo mes dos fórmulas de alprazolam de dos médicos distintos y pide que le dispensen ambas. ¿Qué hace el QF?';
    v_t4 := 'Las benzodiacepinas son medicamentos de control especial. La duplicidad de prescriptores es un problema relacionado con medicamentos y un riesgo de uso indebido; el QF verifica, no dispensa el duplicado, comunica a los prescriptores y documenta.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso: seguimiento farmacoterapéutico en salud mental","outcome":"Caso: seguimiento farmacoterapéutico en salud mental","source":"Normativa de medicamentos de control especial; Resolución 1403 de 2007."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Dispensa ambas, porque cada fórmula es válida por separado y cumple los requisitos.', FALSE, 'Dispensar ambas duplica el tratamiento sin control.', 0),
      (v_pregunta, 'Dispensa la fórmula de mayor dosis y guarda la otra para el mes siguiente sin avisar a ninguno de los médicos.', FALSE, 'No resuelve la duplicidad ni la comunica.', 1),
      (v_pregunta, 'Le recomienda cambiar a otra benzodiacepina de venta libre para no tener problemas.', FALSE, 'Las benzodiacepinas no son de venta libre.', 2),
      (v_pregunta, 'Identifica la duplicidad de prescriptores, no dispensa el duplicado y lo comunica para conciliar.', TRUE, 'Correcto. Se documenta y se hace seguimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Los antidepresivos aumentan la serotonina en la sinapsis en pocas horas, pero su efecto clínico tarda semanas. ¿Qué análisis es correcto?';
    v_t4 := 'La hipótesis monoaminérgica explica parte del efecto antidepresivo, pero tiene límites: el aumento de monoaminas es rápido y la mejoría tarda semanas, lo que sugiere cambios adaptativos de receptores y de plasticidad neuronal. En la práctica, la respuesta se evalúa tras varias semanas a dosis adecuada.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Monoaminas: serotonina, noradrenalina y dopamina","outcome":"Monoaminas: serotonina, noradrenalina y dopamina","source":"Fichas técnicas de los antidepresivos; GPC de depresión del Ministerio de Salud."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El retraso sugiere que el efecto depende de cambios adaptativos posteriores, un límite de la hipótesis monoaminérgica.', TRUE, 'Correcto. Por eso hay que esperar antes de juzgar la respuesta.', 0),
      (v_pregunta, 'El retraso se debe a que los antidepresivos tardan semanas en absorberse en el intestino.', FALSE, 'Se absorben en horas; el retraso no es farmacocinético.', 1),
      (v_pregunta, 'El retraso demuestra que los antidepresivos actúan solo como placebo durante el primer mes.', FALSE, 'Esa conclusión no se sigue del dato.', 2),
      (v_pregunta, 'El retraso indica que la dosis inicial es insuficiente y debe duplicarse desde el primer día.', FALSE, 'Duplicar la dosis no acelera el efecto y aumenta las reacciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una droguería se niega a dispensar un antipsicótico a un paciente con esquizofrenia «porque viene solo y es paciente psiquiátrico». ¿Cuál es la mejor valoración?';
    v_t4 := 'La Ley 1616 de 2013 garantiza el derecho a la salud mental, la atención integral y el acceso a los servicios, incluidos los medicamentos, sin discriminación. Negar la dispensación por el diagnóstico interrumpe el tratamiento y aumenta el riesgo de recaída.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Ley 1616 de 2013 de salud mental y sus modificaciones","outcome":"Ley 1616 de 2013 de salud mental y sus modificaciones","source":"Ley 1616 de 2013."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: los pacientes con trastornos mentales solo pueden retirar sus medicamentos si van acompañados.', FALSE, 'No existe esa exigencia general.', 0),
      (v_pregunta, 'Es correcta si el paciente parece nervioso, porque podría no tomarse bien el medicamento.', FALSE, 'Esa es una suposición discriminatoria.', 1),
      (v_pregunta, 'Es errada: la Ley 1616 de 2013 protege el acceso a la atención y a los medicamentos sin discriminación.', TRUE, 'Correcto. La negativa interrumpe un tratamiento necesario.', 2),
      (v_pregunta, 'Es errada solo porque el antipsicótico no es un medicamento de control especial en Colombia.', FALSE, 'El problema principal es el derecho del paciente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fpsi-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antidepresivos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antidepresivos) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Antidepresivos';
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


    v_t3 := '¿Qué inhibidor selectivo de la recaptación de serotonina tiene la vida media más larga gracias a su metabolito activo?';
    v_t4 := 'La fluoxetina tiene una vida media larga y su metabolito activo, la norfluoxetina, prolonga su efecto semanas; esto reduce los síntomas de discontinuación pero prolonga sus interacciones (inhibe el CYP2D6). La paroxetina, de vida media corta, produce más síntomas de retiro.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"ISRS e IRSN","outcome":"ISRS e IRSN","source":"Fichas técnicas de fluoxetina y paroxetina."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La sertralina, porque se elimina sin cambios por el riñón durante varias semanas.', FALSE, 'La sertralina tiene una vida media de alrededor de un día.', 0),
      (v_pregunta, 'El escitalopram, porque su metabolito tiene una vida media de casi dos meses.', FALSE, 'El escitalopram no tiene una vida media tan larga.', 1),
      (v_pregunta, 'La fluoxetina, cuyo metabolito norfluoxetina prolonga su efecto durante semanas.', TRUE, 'Correcto. Por eso su retiro produce menos discontinuación.', 2),
      (v_pregunta, 'La paroxetina, que por su vida media larga es la que menos síntomas de retiro produce.', FALSE, 'La paroxetina tiene vida media corta y más síntomas de retiro.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con fluoxetina 40 mg recibe al alta tramadol para el dolor posoperatorio. ¿Qué advierte el QF al médico?';
    v_t4 := 'El tramadol inhibe la recaptación de serotonina y noradrenalina además de su efecto opioide; con un ISRS aumenta el riesgo de síndrome serotoninérgico y disminuye el umbral convulsivo. La fluoxetina inhibe el CYP2D6, que activa el tramadol.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso: síndrome serotoninérgico por interacción","outcome":"Caso: síndrome serotoninérgico por interacción","source":"Fichas técnicas de tramadol y fluoxetina."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que la combinación aumenta el riesgo de síndrome serotoninérgico y de convulsiones; conviene otra analgesia.', TRUE, 'Correcto. La fluoxetina además inhibe la activación del tramadol por el CYP2D6.', 0),
      (v_pregunta, 'Que el tramadol potencia el efecto antidepresivo y permite reducir la dosis de fluoxetina.', FALSE, 'No es un efecto terapéutico buscado; aumenta el riesgo.', 1),
      (v_pregunta, 'Que no hay interacción, porque el tramadol actúa solo sobre los receptores opioides.', FALSE, 'El tramadol también inhibe la recaptación de serotonina.', 2),
      (v_pregunta, 'Que basta con tomar el tramadol en la mañana y la fluoxetina en la noche para evitar riesgos.', FALSE, 'Separar las tomas no evita la interacción.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'A una paciente con depresión e ideas de muerte le formulan amitriptilina para tres meses en una sola entrega. ¿Qué análisis hace el QF?';
    v_t4 := 'Los antidepresivos tricíclicos son muy tóxicos en sobredosis por su efecto quinidínico (ensanchamiento del QRS, arritmias), anticolinérgico y convulsivo. En pacientes con riesgo suicida se prefieren entregas fraccionadas, alternativas más seguras y seguimiento estrecho.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Tricíclicos e IMAO","outcome":"Tricíclicos e IMAO","source":"Ficha técnica de amitriptilina; GPC de depresión del Ministerio de Salud."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No hay riesgo, porque la amitriptilina es el antidepresivo más seguro en sobredosis.', FALSE, 'Los tricíclicos son de los más peligrosos en sobredosis.', 0),
      (v_pregunta, 'El único problema es la boca seca, que se resuelve con más agua durante el día.', FALSE, 'Hay un riesgo mucho más grave en este caso.', 1),
      (v_pregunta, 'Conviene entregar más cantidad para que no interrumpa el tratamiento por trámites.', FALSE, 'Más cantidad aumenta el riesgo de sobredosis.', 2),
      (v_pregunta, 'Los tricíclicos son muy tóxicos en sobredosis; una entrega grande en una paciente con ideas de muerte es un riesgo.', TRUE, 'Correcto. Se comunica para entregas fraccionadas y seguimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente suspendió de golpe la paroxetina hace cuatro días y tiene mareo, irritabilidad y sensaciones de «corrientazos». Un familiar cree que «es una recaída grave». ¿Cuál es la mejor valoración?';
    v_t4 := 'La suspensión brusca de antidepresivos, sobre todo de vida media corta como la paroxetina o la venlafaxina, puede causar un síndrome de discontinuación: mareo, irritabilidad, insomnio, síntomas gripales y sensaciones de «corrientazos». Se previene con una reducción gradual.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Síndrome de discontinuación y advertencia de riesgo suicida en jóvenes","outcome":"Síndrome de discontinuación y advertencia de riesgo suicida en jóvenes","source":"Fichas técnicas de paroxetina y venlafaxina."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una recaída de la depresión y lo indicado es iniciar de inmediato otro antidepresivo de una familia distinta.', FALSE, 'La relación temporal sugiere otra causa.', 0),
      (v_pregunta, 'Es probable un síndrome de discontinuación; se consulta para reiniciar y retirar de forma gradual.', TRUE, 'Correcto. La paroxetina, de vida media corta, lo produce con frecuencia.', 1),
      (v_pregunta, 'Es una reacción alérgica a la paroxetina que apareció de forma tardía después de suspenderla.', FALSE, 'Una alergia no aparece al suspender el medicamento.', 2),
      (v_pregunta, 'Es un síndrome serotoninérgico por exceso de serotonina que se acumuló durante el tratamiento.', FALSE, 'Ocurre lo contrario: es la falta brusca del fármaco.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fpsi-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Ansiolíticos e hipnóticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Ansiolíticos e hipnóticos) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Ansiolíticos e hipnóticos';
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


    v_t3 := '¿Qué diferencia a la buspirona de las benzodiacepinas en el tratamiento de la ansiedad?';
    v_t4 := 'La buspirona es un agonista parcial de los receptores 5-HT1A; no produce sedación ni dependencia relevantes, pero su efecto ansiolítico tarda semanas, por lo que no sirve a necesidad. Los fármacos Z (zolpidem, zopiclona) son moduladores del GABA-A con predominio hipnótico.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Fármacos Z y buspirona","outcome":"Fármacos Z y buspirona","source":"Fichas técnicas de buspirona y zolpidem."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un agonista parcial 5-HT1A sin sedación ni dependencia relevantes, y su efecto tarda semanas.', TRUE, 'Correcto. Por eso no sirve a necesidad.', 0),
      (v_pregunta, 'Actúa sobre el receptor GABA-A con mayor potencia que el alprazolam y se usa a necesidad en las crisis de pánico.', FALSE, 'No actúa sobre el receptor GABA-A.', 1),
      (v_pregunta, 'Produce más dependencia y abstinencia que las benzodiacepinas, por eso es de control especial.', FALSE, 'Su riesgo de dependencia es bajo.', 2),
      (v_pregunta, 'Es un hipnótico de acción rápida que se toma justo antes de dormir para inducir el sueño.', FALSE, 'No es un hipnótico ni actúa de forma inmediata.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En urgencias, un paciente que toma clonazepam desde hace años llega muy sedado tras una sobredosis mixta con amitriptilina. ¿Qué precaución debe recordar el QF sobre el flumazenil?';
    v_t4 := 'El flumazenil antagoniza las benzodiacepinas en el receptor GABA-A. En usuarios crónicos puede precipitar abstinencia y convulsiones, y en sobredosis mixtas con tricíclicos aumenta el riesgo de convulsiones y arritmias. Su efecto es corto y la sedación puede reaparecer.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Benzodiacepinas: mecanismo y farmacocinética","outcome":"Benzodiacepinas: mecanismo y farmacocinética","source":"Ficha técnica de flumazenil."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que el flumazenil es totalmente seguro y debe darse siempre a la dosis máxima de inmediato.', FALSE, 'Tiene riesgos importantes en este contexto.', 0),
      (v_pregunta, 'Que el flumazenil no revierte las benzodiacepinas, solo los opioides y el alcohol.', FALSE, 'El flumazenil es el antagonista de las benzodiacepinas.', 1),
      (v_pregunta, 'Que puede desencadenar convulsiones en usuarios crónicos y en sobredosis con tricíclicos; se usa con mucha cautela.', TRUE, 'Correcto. La decisión es del equipo de urgencias.', 2),
      (v_pregunta, 'Que su efecto dura más que el de cualquier benzodiacepina, así que una dosis basta siempre.', FALSE, 'Su efecto es corto y la sedación puede reaparecer.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer que toma lorazepam 2 mg cada noche desde hace 3 años quiere dejarlo «este fin de semana». ¿Qué análisis hace el QF?';
    v_t4 := 'Con el uso continuo de benzodiacepinas aparecen tolerancia y dependencia física. La suspensión brusca puede causar insomnio de rebote, ansiedad, temblor, alteraciones de la percepción y convulsiones. La desprescripción se hace con una reducción gradual planeada.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Dependencia, abstinencia y desprescripción de benzodiacepinas","outcome":"Dependencia, abstinencia y desprescripción de benzodiacepinas","source":"Fichas técnicas de las benzodiacepinas; criterios de Beers 2023."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Puede dejarlo sin ningún riesgo, porque el lorazepam se elimina en pocas horas y no deja efectos al suspenderlo.', FALSE, 'Tras años de uso hay dependencia física.', 0),
      (v_pregunta, 'Tras años de uso hay dependencia física; la suspensión brusca puede causar abstinencia y convulsiones.', TRUE, 'Correcto. Se planea una reducción gradual con el médico.', 1),
      (v_pregunta, 'Debe cambiarlo por zolpidem, que puede suspenderse de golpe en cualquier momento.', FALSE, 'El zolpidem también genera dependencia.', 2),
      (v_pregunta, 'Debe duplicar la dosis la última semana para que el cuerpo se adapte mejor al retiro.', FALSE, 'Subir la dosis antes de suspender no tiene sentido.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una mujer de 79 años con caídas toma lorazepam, zolpidem, amitriptilina y difenhidramina de venta libre para dormir. ¿Cuál es la mejor propuesta del QF?';
    v_t4 := 'Los criterios de Beers 2023 recomiendan evitar en adultos mayores las benzodiacepinas, los fármacos Z y los anticolinérgicos fuertes (amitriptilina, difenhidramina) por el riesgo de caídas, fracturas y deterioro cognitivo. La desprescripción se prioriza y se hace de forma gradual.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: adulto mayor con caídas y polifarmacia sedante","outcome":"Caso: adulto mayor con caídas y polifarmacia sedante","source":"Criterios de Beers 2023; STOPP/START."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Agregar melatonina y mantener todos los demás medicamentos, porque ayudan a dormir mejor.', FALSE, 'Mantener todos deja sin resolver el riesgo de caídas.', 0),
      (v_pregunta, 'Suspender los cuatro medicamentos el mismo día para eliminar el riesgo de caídas.', FALSE, 'Retirar todo de golpe expone a abstinencia y rebote.', 1),
      (v_pregunta, 'Cambiar el lorazepam por diazepam, que es más seguro en adultos mayores.', FALSE, 'El diazepam tiene vida media más larga y se acumula.', 2),
      (v_pregunta, 'Proponer una desprescripción priorizada y gradual, empezando por los anticolinérgicos y el sedante duplicado.', TRUE, 'Correcto. Son medicamentos que los criterios de Beers recomiendan evitar.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fpsi-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Antipsicóticos y estabilizadores del ánimo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Antipsicóticos y estabilizadores del ánimo) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Antipsicóticos y estabilizadores del ánimo';
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


    v_t3 := '¿Qué caracteriza al aripiprazol entre los antipsicóticos?';
    v_t4 := 'Los antipsicóticos típicos bloquean los receptores D2; los atípicos añaden antagonismo 5-HT2A. El aripiprazol es un agonista parcial D2, con menor riesgo de hiperprolactinemia y de efectos metabólicos, aunque puede causar acatisia.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Antipsicóticos típicos y atípicos","outcome":"Antipsicóticos típicos y atípicos","source":"Ficha técnica de aripiprazol."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un antipsicótico típico de alta potencia con muchos síntomas extrapiramidales.', FALSE, 'No es un antipsicótico típico.', 0),
      (v_pregunta, 'Es un antagonista puro de los receptores D2 sin ninguna acción sobre la serotonina.', FALSE, 'Tiene acción parcial sobre D2 y efectos serotoninérgicos.', 1),
      (v_pregunta, 'Es el único antipsicótico que exige controles de neutrófilos durante el tratamiento.', FALSE, 'Ese requisito corresponde a la clozapina.', 2),
      (v_pregunta, 'Es un agonista parcial de los receptores D2, con menor riesgo metabólico y de hiperprolactinemia.', TRUE, 'Correcto. Puede causar acatisia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con clozapina desde hace 3 meses llama por fiebre y dolor de garganta. ¿Qué le indica el QF?';
    v_t4 := 'La clozapina puede causar neutropenia y agranulocitosis; exige un protocolo de monitorización de neutrófilos y consulta inmediata ante fiebre o dolor de garganta. También se vigilan miocarditis, estreñimiento grave, convulsiones y efectos metabólicos.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Síndrome metabólico, QT y clozapina con monitorización de neutrófilos","outcome":"Síndrome metabólico, QT y clozapina con monitorización de neutrófilos","source":"Ficha técnica de clozapina."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que tome acetaminofén y espere tres días, porque es un resfriado común sin relación.', FALSE, 'Esos síntomas pueden ser una señal de neutropenia.', 0),
      (v_pregunta, 'Que consulte de inmediato para un recuento de neutrófilos, por el riesgo de agranulocitosis.', TRUE, 'Correcto. La clozapina exige monitorización de neutrófilos.', 1),
      (v_pregunta, 'Que duplique la dosis de clozapina, porque la fiebre reduce sus concentraciones en la sangre.', FALSE, 'Subir la dosis no corresponde y podría agravar el cuadro.', 2),
      (v_pregunta, 'Que la suspenda por su cuenta y no vuelva a tomarla nunca, sin consultar con el psiquiatra.', FALSE, 'La decisión depende del recuento y del psiquiatra.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre de 66 años estable con litio inicia enalapril e hidroclorotiazida y se automedica con ibuprofeno. Una semana después tiene temblor grueso, diarrea y confusión. ¿Qué análisis es correcto?';
    v_t4 := 'El litio tiene un margen terapéutico estrecho y se elimina por el riñón. Los IECA, ARA-II, tiazidas y AINE reducen su eliminación y pueden causar intoxicación (temblor grueso, diarrea, vómito, confusión, ataxia). La deshidratación aumenta el riesgo.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso: intoxicación por litio por interacciones","outcome":"Caso: intoxicación por litio por interacciones","source":"Ficha técnica de carbonato de litio."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una recaída del trastorno bipolar que exige subir la dosis de litio de inmediato.', FALSE, 'Subir el litio empeoraría una posible intoxicación.', 0),
      (v_pregunta, 'Es un efecto adverso del enalapril sin ninguna relación con el litio, que se resuelve cambiándolo.', FALSE, 'El enalapril sí interactúa con el litio.', 1),
      (v_pregunta, 'Es una probable intoxicación por litio: IECA, tiazida y AINE reducen su eliminación renal.', TRUE, 'Correcto. Se remite de urgencia y se mide la litemia.', 2),
      (v_pregunta, 'Es una gastroenteritis viral y basta con hidratarlo en casa durante unos días.', FALSE, 'Los síntomas coinciden con toxicidad por litio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Dos días después de iniciar haloperidol intramuscular, un paciente tiene fiebre de 39,5 °C, rigidez intensa, confusión y presión inestable. El equipo piensa en «una infección». ¿Cuál es la mejor valoración?';
    v_t4 := 'El síndrome neuroléptico maligno es una reacción grave a los antipsicóticos con fiebre, rigidez muscular, alteración de la conciencia, inestabilidad autonómica y elevación de la CK. Es una urgencia: se suspende el antipsicótico y se da soporte.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Síntomas extrapiramidales y síndrome neuroléptico maligno","outcome":"Síntomas extrapiramidales y síndrome neuroléptico maligno","source":"Ficha técnica de haloperidol; GPC de esquizofrenia del Ministerio de Salud."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Debe considerarse un síndrome neuroléptico maligno: es una urgencia y se suspende el antipsicótico.', TRUE, 'Correcto. Se confirma con la evaluación médica y la CK.', 0),
      (v_pregunta, 'Es una distonía aguda que se resuelve con una dosis adicional del mismo antipsicótico.', FALSE, 'La distonía no produce fiebre alta ni inestabilidad autonómica.', 1),
      (v_pregunta, 'Es una acatisia esperada al inicio del tratamiento que desaparece en pocos días.', FALSE, 'La acatisia es inquietud, no fiebre con rigidez.', 2),
      (v_pregunta, 'Es un síndrome serotoninérgico por el haloperidol, que se trata con más hidratación.', FALSE, 'El cuadro y el fármaco orientan a otro diagnóstico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fpsi-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. TDAH, adicciones, poblaciones especiales y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. TDAH, adicciones, poblaciones especiales y casos integradores) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · TDAH, adicciones, poblaciones especiales y casos integradores';
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


    v_t3 := '¿Cuál de estos medicamentos para el TDAH no es un psicoestimulante?';
    v_t4 := 'El metilfenidato bloquea los transportadores de dopamina y noradrenalina y es un psicoestimulante de control especial. La atomoxetina es un inhibidor selectivo de la recaptación de noradrenalina, no estimulante; su efecto tarda más en aparecer.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"TDAH: metilfenidato y atomoxetina","outcome":"TDAH: metilfenidato y atomoxetina","source":"Fichas técnicas de metilfenidato y atomoxetina."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El metilfenidato de liberación prolongada, que se toma una vez al día en la mañana.', FALSE, 'El metilfenidato es un psicoestimulante.', 0),
      (v_pregunta, 'La lisdexanfetamina, que es un profármaco de una anfetamina de acción prolongada.', FALSE, 'Es un psicoestimulante.', 1),
      (v_pregunta, 'La atomoxetina, inhibidor selectivo de la recaptación de noradrenalina.', TRUE, 'Correcto. No es de control especial como los estimulantes.', 2),
      (v_pregunta, 'El metilfenidato de liberación inmediata, que se toma dos o tres veces durante el día.', FALSE, 'Sigue siendo un psicoestimulante.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con clozapina que fumaba 20 cigarrillos al día deja de fumar de golpe al ser hospitalizado. ¿Qué advierte el QF?';
    v_t4 := 'Los hidrocarburos del humo del tabaco inducen el CYP1A2, que metaboliza la clozapina. Al dejar de fumar, las concentraciones de clozapina pueden aumentar mucho en pocos días, con sedación, hipotensión y convulsiones; se vigila y se ajusta la dosis.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso: inicio de clozapina en esquizofrenia resistente","outcome":"Caso: inicio de clozapina en esquizofrenia resistente","source":"Ficha técnica de clozapina."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que no hay ningún cambio, porque el tabaco no influye en el metabolismo de los antipsicóticos.', FALSE, 'El humo del tabaco induce el CYP1A2.', 0),
      (v_pregunta, 'Que debe aumentar la dosis de clozapina, porque dejar de fumar acelera su eliminación.', FALSE, 'Ocurre lo contrario.', 1),
      (v_pregunta, 'Que debe suspender la clozapina mientras esté sin fumar para evitar efectos adversos.', FALSE, 'No se suspende; se ajusta y se vigila.', 2),
      (v_pregunta, 'Que las concentraciones de clozapina pueden subir al perderse la inducción del CYP1A2; se vigila y se ajusta.', TRUE, 'Correcto. Hay riesgo de sedación y convulsiones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una persona con trastorno por consumo de alcohol que toma tramadol por dolor crónico recibe una fórmula de naltrexona. ¿Qué análisis hace el QF?';
    v_t4 := 'La naltrexona es un antagonista de los receptores opioides usado en el trastorno por consumo de alcohol y de opioides. Está contraindicada en personas que reciben opioides: puede precipitar abstinencia y anula la analgesia.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Farmacoterapia de las adicciones: visión general","outcome":"Farmacoterapia de las adicciones: visión general","source":"Ficha técnica de naltrexona."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La naltrexona bloquea los receptores opioides: no se combina con opioides porque precipita abstinencia y anula la analgesia.', TRUE, 'Correcto. Se comunica al médico.', 0),
      (v_pregunta, 'La naltrexona potencia el efecto del tramadol y permite reducir su dosis a la mitad.', FALSE, 'Ocurre lo contrario: lo bloquea.', 1),
      (v_pregunta, 'No hay interacción, porque la naltrexona actúa solo sobre el deseo de beber alcohol.', FALSE, 'Actúa sobre los receptores opioides.', 2),
      (v_pregunta, 'La combinación es segura si se separan las tomas al menos doce horas entre sí.', FALSE, 'Separar las tomas no evita el bloqueo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una mujer con depresión moderada estable con sertralina confirma un embarazo y quiere suspenderla de inmediato «para no dañar al bebé». ¿Cuál es la mejor respuesta del QF?';
    v_t4 := 'Los trastornos mentales no tratados en el embarazo se asocian a peor autocuidado, parto prematuro, depresión posparto y riesgo suicida; la suspensión abrupta no es segura por defecto. La decisión sobre continuar, ajustar o cambiar se individualiza con el médico, considerando el riesgo y el beneficio.';
    v_j1 := $evfpsi_json${"external_id":"fpsi-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Embarazo y lactancia","outcome":"Embarazo y lactancia","source":"Fichas técnicas de los antidepresivos; recomendaciones sobre psicofármacos en el embarazo."}$evfpsi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fpsi-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que la suspenda hoy mismo, porque cualquier antidepresivo causa malformaciones.', FALSE, 'La suspensión brusca no es segura por defecto.', 0),
      (v_pregunta, 'Que no la suspenda por su cuenta: la depresión no tratada también es un riesgo; se decide con su médico.', TRUE, 'Correcto. La decisión se individualiza.', 1),
      (v_pregunta, 'Que duplique la dosis para que el efecto dure durante todo el embarazo sin tomarla.', FALSE, 'Esa recomendación no tiene sentido farmacológico.', 2),
      (v_pregunta, 'Que la cambie por hipérico, que es natural y no tiene ningún riesgo durante el embarazo.', FALSE, 'Lo natural no es sinónimo de seguro y tiene interacciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fpsi-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Seguimiento de una paciente con depresión y uso prolongado de alprazolam';
  v_t2 := $evfpsi_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Elabora el estado de situación de Andrea y clasifica los problemas encontrados.</li><li>Analiza la duplicidad de prescriptores y qué haría el servicio farmacéutico.</li><li>Explica por qué los síntomas que describe sugieren dependencia física.</li><li>Analiza el riesgo del alcohol con la benzodiacepina.</li><li>Propone al psiquiatra un plan de reducción gradual y explica por qué no debe suspenderse de golpe.</li><li>Redacta la comunicación al equipo tratante y el mensaje para Andrea.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar problemas relacionados con psicofármacos de control especial.</li><li>Analizar la dependencia y los riesgos de la combinación con alcohol.</li><li>Proponer intervenciones al equipo tratante y a la paciente.</li></ul>
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
  <tr><td>Estado y duplicidad</td><td>25 %</td><td>Identifica la duplicidad, la usa como problema relacionado con medicamentos y propone conciliar.</td><td>Identifica la duplicidad sin plan.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Dependencia y alcohol</td><td>25 %</td><td>Relaciona los síntomas con dependencia física y explica la depresión del SNC aditiva con el alcohol.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Reducción gradual</td><td>30 %</td><td>Propone una reducción gradual planeada con el psiquiatra y explica los riesgos de la suspensión brusca.</td><td>Propone reducir sin plan.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación</td><td>10 %</td><td>Mensaje claro, sin juicio y respetuoso.</td><td>Mensaje general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfpsi_html$;
  v_t3 := $evfpsi_html$<h2>Caso de estudio</h2>
<p>Andrea tiene 36 años, vive en Medellín y tiene trastorno depresivo recurrente y ansiedad generalizada (datos simulados). Toma sertralina 100 mg desde hace 9 meses y alprazolam 0,5 mg cada 8 horas desde hace 7 meses «mientras hacía efecto la sertralina». Trae una fórmula de alprazolam de su psiquiatra y otra de un médico general. Dice que sin el alprazolam «no puede dormir y le tiemblan las manos». Bebe vino casi todas las noches.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfpsi_html$;
  v_t4 := 'Informe de seguimiento con comunicación al equipo tratante.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfpsi_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los psicofármacos del caso; guías de práctica clínica del Ministerio de Salud de depresión y de esquizofrenia; criterios de Beers 2023 y STOPP/START; Ley 1616 de 2013 de salud mental; normativa colombiana de medicamentos de control especial y Fondo Nacional de Estupefacientes; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfpsi_html$;
  v_t7 := NULL;
  v_j1 := $evfpsi_json$["Estado de situación.","Duplicidad de prescriptores.","Dependencia y alcohol.","Plan de reducción gradual.","Comunicación."]$evfpsi_json$::jsonb;
  v_j2 := $evfpsi_json${"version":1,"total":100,"criteria":[{"id":"estado-y-duplicidad","name":"Estado y duplicidad","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica la duplicidad, la usa como problema relacionado con medicamentos y propone conciliar."},{"level":3,"label":"Logrado","description":"Identifica la duplicidad sin plan."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"dependencia-y-alcohol","name":"Dependencia y alcohol","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Relaciona los síntomas con dependencia física y explica la depresión del SNC aditiva con el alcohol."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"reduccion-gradual","name":"Reducción gradual","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Propone una reducción gradual planeada con el psiquiatra y explica los riesgos de la suspensión brusca."},{"level":3,"label":"Logrado","description":"Propone reducir sin plan."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion","name":"Comunicación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Mensaje claro, sin juicio y respetuoso."},{"level":3,"label":"Logrado","description":"Mensaje general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfpsi_json$::jsonb;
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


  -- ── Actividad fpsi-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antidepresivos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antidepresivos) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Síndrome serotoninérgico por interacción';
  v_t2 := $evfpsi_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Describe los hallazgos que orientan a síndrome serotoninérgico y relaciónalos con los criterios de Hunter.</li><li>Identifica cada medicamento o producto que contribuye y explica cómo.</li><li>Analiza la interacción farmacocinética entre fluoxetina y tramadol.</li><li>Propone qué suspender y qué alternativa analgésica y antiemética sugerirías.</li><li>Define el reporte al Programa Nacional de Farmacovigilancia.</li><li>Diseña cómo prevenir este error en las fórmulas de egreso.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Reconocer un síndrome serotoninérgico con criterios clínicos.</li><li>Identificar los fármacos y productos implicados.</li><li>Proponer el manejo farmacéutico y la prevención.</li></ul>
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
  <tr><td>Reconocimiento</td><td>20 %</td><td>Relaciona el clonus, la hipertermia, la agitación y la diaforesis con los criterios de Hunter.</td><td>Reconoce el síndrome sin criterios.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Fármacos implicados</td><td>30 %</td><td>Identifica fluoxetina, tramadol, hipérico y metoclopramida con su contribución.</td><td>Identifica tres de los cuatro.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Manejo y alternativas</td><td>25 %</td><td>Suspender los serotoninérgicos agregados, soporte en urgencias y alternativas analgésicas y antieméticas razonables.</td><td>Manejo parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Reporte y prevención</td><td>15 %</td><td>Reporte al INVIMA y medida concreta de prevención en el egreso.</td><td>Reporte sin prevención.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfpsi_html$;
  v_t3 := $evfpsi_html$<h2>Caso de estudio</h2>
<p>Don Jaime tiene 58 años, vive en Cali y toma fluoxetina 40 mg por depresión mayor (datos simulados). Tras una cirugía de rodilla sale con tramadol 50 mg cada 8 horas y metoclopramida para las náuseas. Por su cuenta toma hipérico «para el ánimo». Al tercer día consulta a urgencias con agitación, sudoración, temblor, diarrea, temperatura de 38,4 °C, taquicardia y clonus en los tobillos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfpsi_html$;
  v_t4 := 'Informe de análisis con propuesta de manejo y prevención.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfpsi_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los psicofármacos del caso; guías de práctica clínica del Ministerio de Salud de depresión y de esquizofrenia; criterios de Beers 2023 y STOPP/START; Ley 1616 de 2013 de salud mental; normativa colombiana de medicamentos de control especial y Fondo Nacional de Estupefacientes; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfpsi_html$;
  v_t7 := NULL;
  v_j1 := $evfpsi_json$["Reconocimiento clínico.","Fármacos implicados.","Interacción farmacocinética.","Manejo y alternativas.","Reporte y prevención."]$evfpsi_json$::jsonb;
  v_j2 := $evfpsi_json${"version":1,"total":100,"criteria":[{"id":"reconocimiento","name":"Reconocimiento","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Relaciona el clonus, la hipertermia, la agitación y la diaforesis con los criterios de Hunter."},{"level":3,"label":"Logrado","description":"Reconoce el síndrome sin criterios."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacos-implicados","name":"Fármacos implicados","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Identifica fluoxetina, tramadol, hipérico y metoclopramida con su contribución."},{"level":3,"label":"Logrado","description":"Identifica tres de los cuatro."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"manejo-y-alternativas","name":"Manejo y alternativas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Suspender los serotoninérgicos agregados, soporte en urgencias y alternativas analgésicas y antieméticas razonables."},{"level":3,"label":"Logrado","description":"Manejo parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"reporte-y-prevencion","name":"Reporte y prevención","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Reporte al INVIMA y medida concreta de prevención en el egreso."},{"level":3,"label":"Logrado","description":"Reporte sin prevención."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfpsi_json$::jsonb;
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


  -- ── Actividad fpsi-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Antipsicóticos y estabilizadores del ánimo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Antipsicóticos y estabilizadores del ánimo) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Intoxicación por litio por interacciones';
  v_t2 := $evfpsi_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Relaciona los síntomas con la toxicidad por litio y explica la urgencia.</li><li>Analiza cómo cada medicamento y la diarrea aumentan la litemia.</li><li>Propone qué hacer de inmediato y qué comunicar al médico.</li><li>Propone alternativas para la hipertensión y para el dolor que interactúen menos con el litio.</li><li>Diseña el plan de monitorización (litemia, función renal, tiroides) y la educación.</li><li>Define el reporte al Programa Nacional de Farmacovigilancia.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Detectar una intoxicación por litio y sus causas.</li><li>Analizar las interacciones farmacocinéticas implicadas.</li><li>Diseñar un plan de prevención y monitorización.</li></ul>
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
  <tr><td>Reconocimiento</td><td>20 %</td><td>Relaciona temblor grueso, confusión y ataxia con toxicidad por litio y remite de urgencia.</td><td>Reconoce sin urgencia.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones</td><td>30 %</td><td>Explica cómo IECA, tiazida, AINE y diarrea reducen la eliminación renal del litio.</td><td>Explica dos factores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Alternativas y monitorización</td><td>30 %</td><td>Alternativas razonables y plan de litemia, función renal y tiroides con educación.</td><td>Plan parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Reporte</td><td>10 %</td><td>Reporte al INVIMA con datos completos.</td><td>Reporte incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfpsi_html$;
  v_t3 := $evfpsi_html$<h2>Caso de estudio</h2>
<p>Don Alfonso tiene 67 años, vive en Manizales y tiene trastorno bipolar tipo I estable desde hace 10 años con carbonato de litio 300 mg cada 8 horas (datos simulados). Hace un mes le iniciaron enalapril e hidroclorotiazida por hipertensión, y esta semana tomó ibuprofeno 400 mg cada 6 horas por dolor lumbar. Tuvo además dos días de diarrea. Su esposa cuenta que tiene un temblor grueso, está confuso y camina inestable.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfpsi_html$;
  v_t4 := 'Informe de análisis con plan de prevención y monitorización.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfpsi_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los psicofármacos del caso; guías de práctica clínica del Ministerio de Salud de depresión y de esquizofrenia; criterios de Beers 2023 y STOPP/START; Ley 1616 de 2013 de salud mental; normativa colombiana de medicamentos de control especial y Fondo Nacional de Estupefacientes; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfpsi_html$;
  v_t7 := NULL;
  v_j1 := $evfpsi_json$["Reconocimiento y urgencia.","Interacciones.","Conducta inmediata.","Alternativas.","Monitorización y reporte."]$evfpsi_json$::jsonb;
  v_j2 := $evfpsi_json${"version":1,"total":100,"criteria":[{"id":"reconocimiento","name":"Reconocimiento","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Relaciona temblor grueso, confusión y ataxia con toxicidad por litio y remite de urgencia."},{"level":3,"label":"Logrado","description":"Reconoce sin urgencia."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones","name":"Interacciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Explica cómo IECA, tiazida, AINE y diarrea reducen la eliminación renal del litio."},{"level":3,"label":"Logrado","description":"Explica dos factores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"alternativas-y-monitorizacion","name":"Alternativas y monitorización","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Alternativas razonables y plan de litemia, función renal y tiroides con educación."},{"level":3,"label":"Logrado","description":"Plan parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"reporte","name":"Reporte","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Reporte al INVIMA con datos completos."},{"level":3,"label":"Logrado","description":"Reporte incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfpsi_json$::jsonb;
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


  -- ── Actividad fpsi-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Ansiolíticos e hipnóticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Ansiolíticos e hipnóticos) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: estado de situación, antidepresivo y benzodiacepina de Mariana';
  v_t2 := $evfpsi_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y elabora el estado de situación de Mariana.</li><li>Fase 1: identifica los medicamentos de control especial y los requisitos de su dispensación.</li><li>Fase 2: analiza el riesgo de viraje a manía con la sertralina y por qué debe comunicarse al psiquiatra.</li><li>Fase 3: analiza la dependencia del clonazepam y propone un plan de reducción gradual con el psiquiatra.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco y control especial).</strong> Derechos, control especial y estado de situación.</li>
  <li><strong>Fase 2 · Unidad 2 (antidepresivos).</strong> Riesgos de añadir un antidepresivo en el trastorno bipolar.</li>
  <li><strong>Fase 3 · Unidad 3 (ansiolíticos).</strong> Dependencia del clonazepam y plan de desprescripción.</li>
  <li><strong>Fase 4 · Unidad 4 (antipsicóticos y estabilizadores).</strong> Monitorización del litio y riesgo metabólico de la quetiapina.</li>
  <li><strong>Fase 5 · Unidad 5 (poblaciones especiales).</strong> Planeación del embarazo, tabaco y seguimiento integral.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Construir el estado de situación de una paciente con trastorno bipolar.</li><li>Analizar los riesgos del antidepresivo y de la benzodiacepina.</li></ul>
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
  <tr><td>Estado de situación</td><td>20 %</td><td>Relaciona cada problema con su medicamento y su parámetro de control.</td><td>Estado incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Antidepresivo</td><td>30 %</td><td>Explica el riesgo de viraje a manía o ciclación con un antidepresivo sin estabilizador suficiente y la necesidad de comunicarlo.</td><td>Menciona el riesgo sin justificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Benzodiacepina</td><td>30 %</td><td>Plan de reducción gradual acordado, con riesgos de la suspensión brusca.</td><td>Propone reducir sin plan.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Control especial</td><td>10 %</td><td>Requisitos de dispensación correctos.</td><td>Requisitos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfpsi_html$;
  v_t3 := $evfpsi_html$<h2>Caso de estudio</h2>
<p>Mariana tiene 31 años, vive en Bucaramanga y tiene trastorno bipolar tipo I (datos simulados). Toma carbonato de litio 300 mg cada 8 horas y quetiapina 200 mg en la noche; hace un mes otro médico le añadió sertralina por un episodio depresivo. Usa clonazepam 2 mg en la noche desde hace dos años, fuma 15 cigarrillos al día y está pensando en quedar embarazada. Su EPS la asignó al programa de salud mental donde tú eres el QF responsable. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfpsi_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfpsi_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los psicofármacos del caso; guías de práctica clínica del Ministerio de Salud de depresión y de esquizofrenia; criterios de Beers 2023 y STOPP/START; Ley 1616 de 2013 de salud mental; normativa colombiana de medicamentos de control especial y Fondo Nacional de Estupefacientes; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfpsi_html$;
  v_t7 := NULL;
  v_j1 := $evfpsi_json$["Estado de situación.","Control especial.","Antidepresivo en bipolar.","Clonazepam."]$evfpsi_json$::jsonb;
  v_j2 := $evfpsi_json${"version":1,"total":100,"criteria":[{"id":"estado-de-situacion","name":"Estado de situación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Relaciona cada problema con su medicamento y su parámetro de control."},{"level":3,"label":"Logrado","description":"Estado incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"antidepresivo","name":"Antidepresivo","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Explica el riesgo de viraje a manía o ciclación con un antidepresivo sin estabilizador suficiente y la necesidad de comunicarlo."},{"level":3,"label":"Logrado","description":"Menciona el riesgo sin justificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"benzodiacepina","name":"Benzodiacepina","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Plan de reducción gradual acordado, con riesgos de la suspensión brusca."},{"level":3,"label":"Logrado","description":"Propone reducir sin plan."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"control-especial","name":"Control especial","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Requisitos de dispensación correctos."},{"level":3,"label":"Logrado","description":"Requisitos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfpsi_json$::jsonb;
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


  -- ── Actividad fpsi-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. TDAH, adicciones, poblaciones especiales y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. TDAH, adicciones, poblaciones especiales y casos integradores) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan integral de seguimiento de Mariana';
  v_t2 := $evfpsi_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: diseña la monitorización del litio (litemia, función renal y tiroidea, interacciones) y el seguimiento metabólico de la quetiapina.</li><li>Fase 5: analiza qué debe planearse con el psiquiatra antes del embarazo, sin suspender por cuenta propia.</li><li>Fase 5: considera el efecto del tabaco y de su cesación sobre los psicofármacos y el embarazo.</li><li>Fase 5: define indicadores y el plan de farmacovigilancia.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco y control especial).</strong> Derechos, control especial y estado de situación.</li>
  <li><strong>Fase 2 · Unidad 2 (antidepresivos).</strong> Riesgos de añadir un antidepresivo en el trastorno bipolar.</li>
  <li><strong>Fase 3 · Unidad 3 (ansiolíticos).</strong> Dependencia del clonazepam y plan de desprescripción.</li>
  <li><strong>Fase 4 · Unidad 4 (antipsicóticos y estabilizadores).</strong> Monitorización del litio y riesgo metabólico de la quetiapina.</li>
  <li><strong>Fase 5 · Unidad 5 (poblaciones especiales).</strong> Planeación del embarazo, tabaco y seguimiento integral.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar la monitorización del litio y del antipsicótico.</li><li>Planear el embarazo y el seguimiento integral.</li></ul>
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
  <tr><td>Litio y quetiapina</td><td>25 %</td><td>Monitorización completa del litio y seguimiento metabólico (peso, glucosa, lípidos).</td><td>Monitorización parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Embarazo y tabaco</td><td>30 %</td><td>Planeación con el psiquiatra, balance riesgo-beneficio, efecto del tabaco y de su cesación.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores y farmacovigilancia</td><td>20 %</td><td>Indicadores medibles y reporte definido.</td><td>Indicadores generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfpsi_html$;
  v_t3 := $evfpsi_html$<h2>Caso de estudio</h2>
<p>Mariana tiene 31 años, vive en Bucaramanga y tiene trastorno bipolar tipo I (datos simulados). Toma carbonato de litio 300 mg cada 8 horas y quetiapina 200 mg en la noche; hace un mes otro médico le añadió sertralina por un episodio depresivo. Usa clonazepam 2 mg en la noche desde hace dos años, fuma 15 cigarrillos al día y está pensando en quedar embarazada. Su EPS la asignó al programa de salud mental donde tú eres el QF responsable. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al equipo de salud mental.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfpsi_html$;
  v_t4 := 'Plan integral de seguimiento con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfpsi_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los psicofármacos del caso; guías de práctica clínica del Ministerio de Salud de depresión y de esquizofrenia; criterios de Beers 2023 y STOPP/START; Ley 1616 de 2013 de salud mental; normativa colombiana de medicamentos de control especial y Fondo Nacional de Estupefacientes; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfpsi_html$;
  v_t7 := NULL;
  v_j1 := $evfpsi_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Litio y quetiapina.","Planeación del embarazo.","Tabaco.","Indicadores, farmacovigilancia y resumen."]$evfpsi_json$::jsonb;
  v_j2 := $evfpsi_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"litio-y-quetiapina","name":"Litio y quetiapina","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Monitorización completa del litio y seguimiento metabólico (peso, glucosa, lípidos)."},{"level":3,"label":"Logrado","description":"Monitorización parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"embarazo-y-tabaco","name":"Embarazo y tabaco","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Planeación con el psiquiatra, balance riesgo-beneficio, efecto del tabaco y de su cesación."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores-y-farmacovigilancia","name":"Indicadores y farmacovigilancia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Indicadores medibles y reporte definido."},{"level":3,"label":"Logrado","description":"Indicadores generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfpsi_json$::jsonb;
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


  -- ── Foro fpsi-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con psicofármacos';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfpsi_html$<h2>Para empezar</h2>
<p>Piensa en una situación con un antidepresivo, un ansiolítico o un antipsicótico que te haya generado dudas y cuéntala en tres o cuatro líneas, sin nombres ni datos que identifiquen a nadie.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfpsi_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre psicofármacos te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfpsi_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfpsi_html$;
  v_t6 := $evfpsi_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfpsi_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué estigma o creencia sobre los psicofármacos encuentras con más frecuencia?', '¿Has dispensado medicamentos de control especial en salud mental?']::text[];
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


  -- ── Foro fpsi-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Control especial: entre el acceso y el uso indebido';
  v_t2 := 'Argumentar cómo cumplir la normativa de control especial sin crear barreras al tratamiento.';
  v_t3 := $evfpsi_html$<h2>Caso del foro</h2>
<p>En un mes, un servicio farmacéutico encuentra (datos simulados): una paciente con clonazepam formulado por tres médicos distintos; un adolescente con metilfenidato cuya fórmula llegó vencida; y un adulto mayor que no pudo retirar su benzodiacepina porque «el sistema no tenía disponibilidad» y sufrió síntomas de abstinencia.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfpsi_html$;
  v_t4 := '¿Qué haría el servicio farmacéutico en cada caso y cómo evitaría que el control se vuelva una barrera?';
  v_t5 := $evfpsi_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o el dato de la ficha técnica que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfpsi_html$;
  v_t6 := $evfpsi_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el dato de la ficha técnica que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfpsi_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué riesgos tiene la suspensión brusca de una benzodiacepina?', '¿Qué información se registra en la dispensación de control especial?', '¿Qué papel tienen el Fondo Nacional de Estupefacientes y los fondos rotatorios?']::text[];
  v_j1 := $evfpsi_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el dato de la ficha técnica que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfpsi_json$::jsonb;
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


  -- ── Foro fpsi-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antidepresivos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antidepresivos) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Antidepresivos y riesgo suicida en jóvenes: ¿cómo comunicarlo?';
  v_t2 := 'Argumentar cómo informar la advertencia regulatoria sin desalentar un tratamiento necesario.';
  v_t3 := $evfpsi_html$<h2>Caso del foro</h2>
<p>Una madre llega a la droguería con la fórmula de fluoxetina para su hijo de 17 años con depresión (datos simulados). Leyó el inserto, vio la advertencia sobre pensamientos suicidas y dice que «no se lo va a dar porque lo puede matar».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfpsi_html$;
  v_t4 := '¿Cómo le explicarías la advertencia y qué vigilancia recomendarías?';
  v_t5 := $evfpsi_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la guía que sustenta tu explicación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfpsi_html$;
  v_t6 := $evfpsi_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta tu explicación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfpsi_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dice la advertencia y en qué grupos de edad aplica?', '¿Qué riesgo tiene la depresión no tratada en un adolescente?', '¿Qué señales de alarma deben motivar una consulta inmediata?']::text[];
  v_j1 := $evfpsi_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta tu explicación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfpsi_json$::jsonb;
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


  -- ── Foro fpsi-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Ansiolíticos e hipnóticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Ansiolíticos e hipnóticos) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Desprescribir benzodiacepinas en el adulto mayor';
  v_t2 := 'Argumentar cómo plantear la desprescripción de benzodiacepinas a pacientes, familias y médicos.';
  v_t3 := $evfpsi_html$<h2>Caso del foro</h2>
<p>Un programa de atención domiciliaria tiene 60 adultos mayores con benzodiacepinas por más de un año (datos simulados). Muchos dicen que «sin la pastilla no duermen», varias familias temen que «se vuelvan locos» si la dejan y algunos médicos prefieren «no mover lo que funciona».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfpsi_html$;
  v_t4 := '¿Cómo plantearías un programa de desprescripción que sea seguro y aceptado?';
  v_t5 := $evfpsi_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de Beers, STOPP/START o la ficha técnica que sustenta tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfpsi_html$;
  v_t6 := $evfpsi_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de Beers, STOPP/START o la ficha técnica que sustenta tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfpsi_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué riesgos tiene mantener las benzodiacepinas en esta población?', '¿Qué ritmo de reducción es razonable y cómo se ajusta?', '¿Qué alternativas no farmacológicas existen para el insomnio?']::text[];
  v_j1 := $evfpsi_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de Beers, STOPP/START o la ficha técnica que sustenta tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfpsi_json$::jsonb;
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


  -- ── Foro fpsi-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Antipsicóticos y estabilizadores del ánimo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Antipsicóticos y estabilizadores del ánimo) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Litio en la vida real';
  v_t2 := 'Argumentar cómo asegurar la monitorización del litio y prevenir sus intoxicaciones.';
  v_t3 := $evfpsi_html$<h2>Caso del foro</h2>
<p>En un programa de salud mental, de 50 pacientes con litio (datos simulados), solo 20 tienen una litemia en los últimos 6 meses, 12 tienen función renal sin controlar y varios compran ibuprofeno sin fórmula. Un paciente tuvo diarrea por una semana y siguió tomando su dosis completa.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfpsi_html$;
  v_t4 := '¿Qué acciones priorizarías para que el litio se use con seguridad?';
  v_t5 := $evfpsi_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la guía que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfpsi_html$;
  v_t6 := $evfpsi_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfpsi_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué medicamentos de uso común interactúan con el litio?', '¿Qué situaciones (diarrea, calor, dietas) aumentan el riesgo de toxicidad?', '¿Qué controles necesita un paciente con litio y con qué frecuencia?']::text[];
  v_j1 := $evfpsi_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfpsi_json$::jsonb;
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


  -- ── Foro fpsi-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. TDAH, adicciones, poblaciones especiales y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. TDAH, adicciones, poblaciones especiales y casos integradores) en Psicofarmacología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Metilfenidato: ¿uso médico o rendimiento académico?';
  v_t2 := 'Argumentar el papel del QF ante el uso no médico de psicoestimulantes.';
  v_t3 := $evfpsi_html$<h2>Caso del foro</h2>
<p>En una droguería cercana a una universidad, varios estudiantes piden metilfenidato «para estudiar para los parciales» (datos simulados). Uno trae una fórmula de un familiar y otro dice que lo consiguió por redes y quiere saber «cuánto tomar». La droguería también atiende a niños con TDAH que tienen dificultades para obtener su medicamento.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfpsi_html$;
  v_t4 := '¿Cómo responderías a cada situación y cómo equilibrarías el control con el acceso de quienes lo necesitan?';
  v_t5 := $evfpsi_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o el dato de la ficha técnica que sustenta cada respuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfpsi_html$;
  v_t6 := $evfpsi_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el dato de la ficha técnica que sustenta cada respuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfpsi_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué riesgos tiene el uso no médico del metilfenidato?', '¿Qué controles exige su dispensación?', '¿Qué alternativa no estimulante existe para el TDAH?']::text[];
  v_j1 := $evfpsi_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el dato de la ficha técnica que sustenta cada respuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfpsi_json$::jsonb;
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


  RAISE NOTICE 'Psicofarmacología: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfpsi$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Farmacología Respiratoria
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfresp$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacología Respiratoria' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos: fisiopatología respiratoria, broncodilatadores y corticosteroides', 'Unidad 2. Asma: GINA 2024-2026, GPC colombiana, controladores y biológicos', 'Unidad 3. EPOC: GOLD 2025-2026, GPC colombiana y terapias complementarias', 'Unidad 4. Dispositivos de inhalación y técnica inhalatoria: el rol del QF', 'Unidad 5. Otros fármacos respiratorios: tos, rinitis, fibrosis pulmonar y tuberculosis']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacología Respiratoria: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfresp_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfresp_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fresp-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: fisiopatología respiratoria, broncodilatadores y corticosteroides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: fisiopatología respiratoria, broncodilatadores y corticosteroides) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos: fisiopatología respiratoria, broncodilatadores y corticosteroides';
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


    v_t3 := '¿Qué efectos adversos son típicos de los agonistas beta-2 a dosis altas?';
    v_t4 := 'Los agonistas beta-2 (salbutamol, formoterol, salmeterol) estimulan los receptores beta-2; a dosis altas producen taquicardia, palpitaciones, temblor e hipopotasemia, que se acentúa con xantinas, corticoides o diuréticos.';
    v_j1 := $evfresp_json${"external_id":"fresp-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Agonistas beta-2: SABA y LABA (salbutamol, formoterol, salmeterol, vilanterol, indacaterol, olodaterol)","outcome":"Agonistas beta-2: SABA y LABA (salbutamol, formoterol, salmeterol, vilanterol, indacaterol, olodaterol)","source":"Fichas técnicas de salbutamol y formoterol."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Bradicardia, somnolencia intensa y aumento del potasio en la sangre durante varias horas.', FALSE, 'Producen el efecto contrario sobre la frecuencia y el potasio.', 0),
      (v_pregunta, 'Candidiasis oral, disfonía y supresión del eje suprarrenal con el uso diario prolongado.', FALSE, 'Esos son efectos de los corticoides inhalados.', 1),
      (v_pregunta, 'Taquicardia, temblor e hipopotasemia.', TRUE, 'Correcto. Se acentúan con xantinas, corticoides o diuréticos.', 2),
      (v_pregunta, 'Boca seca, retención urinaria y empeoramiento de un glaucoma de ángulo cerrado.', FALSE, 'Esos son efectos de los antimuscarínicos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'A un hombre de 72 años con hiperplasia prostática y episodios de retención urinaria le inician tiotropio. ¿Qué advierte el QF?';
    v_t4 := 'Los antimuscarínicos bloquean los receptores M3; sus efectos anticolinérgicos incluyen boca seca, retención urinaria y empeoramiento del glaucoma de ángulo cerrado. La ficha técnica del tiotropio pide precaución en hiperplasia prostática y obstrucción del cuello vesical.';
    v_j1 := $evfresp_json${"external_id":"fresp-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Antimuscarínicos: SAMA y LAMA (ipratropio, tiotropio, glicopirronio, umeclidinio, aclidinio)","outcome":"Antimuscarínicos: SAMA y LAMA (ipratropio, tiotropio, glicopirronio, umeclidinio, aclidinio)","source":"Ficha técnica de tiotropio."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que el tiotropio puede empeorar la retención urinaria; se informa al médico y se vigila.', TRUE, 'Correcto. También se precisa en glaucoma de ángulo cerrado.', 0),
      (v_pregunta, 'Que el tiotropio mejora la retención urinaria porque relaja el músculo de la vejiga y la próstata.', FALSE, 'Ocurre lo contrario por su efecto anticolinérgico.', 1),
      (v_pregunta, 'Que no hay ninguna precaución, porque los antimuscarínicos inhalados no se absorben en absoluto.', FALSE, 'Una parte se absorbe y puede dar efectos sistémicos.', 2),
      (v_pregunta, 'Que debe usarlo cuatro veces al día para que el efecto sobre la próstata sea menor y constante.', FALSE, 'El tiotropio se usa una vez al día.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una paciente con asma tiene eosinófilos en sangre de 550 células/µL y FeNO elevado. ¿Qué análisis es correcto?';
    v_t4 := 'El asma con inflamación T2 se asocia a IL-4, IL-5, IL-13 e IgE, con eosinofilia y FeNO elevado; suele responder a los corticoides inhalados y, en el asma grave, a biológicos dirigidos a esa vía. El asma no T2 responde peor a ellos.';
    v_j1 := $evfresp_json${"external_id":"fresp-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Asma: inflamación T2 y no T2, hiperreactividad y obstrucción reversible","outcome":"Asma: inflamación T2 y no T2, hiperreactividad y obstrucción reversible","source":"GINA 2024-2026."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tiene un asma no T2 que no responde a los corticoides inhalados ni a los biológicos actuales.', FALSE, 'Los datos apuntan a lo contrario.', 0),
      (v_pregunta, 'Tiene una infección parasitaria que explica todo y el asma debe tratarse solo con antiparasitarios.', FALSE, 'No hay datos para concluir eso.', 1),
      (v_pregunta, 'Tiene una EPOC, porque los eosinófilos altos excluyen el diagnóstico de asma.', FALSE, 'Los eosinófilos altos son frecuentes en el asma.', 2),
      (v_pregunta, 'Tiene un fenotipo con inflamación T2, que suele responder a corticoides inhalados y a biológicos anti-T2.', TRUE, 'Correcto. Las IL-4, IL-5 e IL-13 son los blancos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con asma recibe cuatro ciclos de prednisolona al año porque «es más barato que el inhalador controlador». ¿Cuál es la mejor valoración?';
    v_t4 := 'Los ciclos repetidos de corticoide oral acumulan efectos adversos (osteoporosis, diabetes, cataratas, supresión suprarrenal). Varios ciclos al año indican asma no controlada; la base del tratamiento es el corticoide inhalado, con efectos sistémicos mucho menores.';
    v_j1 := $evfresp_json${"external_id":"fresp-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Corticosteroides inhalados y sistémicos: potencia, dosis bajas/medias/altas y seguridad","outcome":"Corticosteroides inhalados y sistémicos: potencia, dosis bajas/medias/altas y seguridad","source":"GINA 2024-2026; fichas técnicas de los corticoides."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una estrategia razonable, porque los ciclos cortos de corticoide oral no tienen efectos acumulados.', FALSE, 'Los ciclos repetidos sí tienen efectos acumulados.', 0),
      (v_pregunta, 'Es errada: los ciclos repetidos acumulan efectos adversos y el control debe basarse en el corticoide inhalado.', TRUE, 'Correcto. Cuatro ciclos al año indican mal control.', 1),
      (v_pregunta, 'Es razonable si cada ciclo dura menos de 3 días, porque así no hay ningún riesgo para el paciente.', FALSE, 'El riesgo acumulado depende del número de ciclos.', 2),
      (v_pregunta, 'Es errada solo porque la prednisolona es más cara que la dexametasona en las droguerías.', FALSE, 'El problema no es el costo, sino la seguridad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fresp-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Asma: GINA 2024-2026, GPC colombiana, controladores y biológicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Asma: GINA 2024-2026, GPC colombiana, controladores y biológicos) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Asma: GINA 2024-2026, GPC colombiana, controladores y biológicos';
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


    v_t3 := '¿Por qué GINA ya no recomienda tratar el asma solo con un SABA a necesidad?';
    v_t4 := 'Desde 2019 GINA no recomienda el tratamiento solo con SABA: no trata la inflamación y se asocia a exacerbaciones graves y muertes. La vía preferida usa budesonida-formoterol como aliviador (y en MART), de modo que cada rescate aporta corticoide inhalado.';
    v_j1 := $evfresp_json${"external_id":"fresp-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"GINA Track 1: MART con budesonida-formoterol y por qué no SABA solo","outcome":"GINA Track 1: MART con budesonida-formoterol y por qué no SABA solo","source":"GINA 2024-2026."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque el salbutamol tiene un costo muy alto y no está cubierto por el plan de beneficios.', FALSE, 'La razón no es económica.', 0),
      (v_pregunta, 'Porque el SABA solo no trata la inflamación y se asocia a exacerbaciones y muertes por asma.', TRUE, 'Correcto. Se prefiere un aliviador con corticoide inhalado.', 1),
      (v_pregunta, 'Porque el salbutamol solo produce efecto si se usa en nebulización y no en inhalador presurizado.', FALSE, 'El inhalador presurizado es eficaz.', 2),
      (v_pregunta, 'Porque el salbutamol dejó de producirse y fue reemplazado por la teofilina oral en todo el mundo.', FALSE, 'El salbutamol sigue disponible y es útil como rescate.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con EPOC que toma teofilina recibe ciprofloxacino por una infección urinaria. ¿Qué advierte el QF al médico?';
    v_t4 := 'La teofilina tiene un margen terapéutico estrecho y se metaboliza por el CYP1A2. Inhibidores como el ciprofloxacino o la fluvoxamina elevan sus niveles (náuseas, taquicardia, arritmias, convulsiones); dejar de fumar también los eleva. Se monitorizan los niveles séricos.';
    v_j1 := $evfresp_json${"external_id":"fresp-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Teofilina y metilxantinas: margen estrecho, niveles séricos e interacciones por CYP1A2","outcome":"Teofilina y metilxantinas: margen estrecho, niveles séricos e interacciones por CYP1A2","source":"Ficha técnica de teofilina."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que el ciprofloxacino acelera la eliminación de la teofilina y su efecto broncodilatador desaparece.', FALSE, 'Ocurre lo contrario.', 0),
      (v_pregunta, 'Que la teofilina inactiva al antibiótico y la infección urinaria no responderá al tratamiento.', FALSE, 'No es la interacción relevante.', 1),
      (v_pregunta, 'Que no hay interacción, porque el ciprofloxacino solo actúa sobre las bacterias de la orina.', FALSE, 'Hay una interacción por el CYP1A2.', 2),
      (v_pregunta, 'Que el ciprofloxacino inhibe el CYP1A2 y puede elevar la teofilina a niveles tóxicos.', TRUE, 'Correcto. Se ajusta la dosis o se elige otro antibiótico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre con asma grave, buena técnica y adherencia comprobada, tiene eosinófilos de 600 células/µL, pólipos nasales y tres ciclos de corticoide oral al año. ¿Qué análisis es correcto?';
    v_t4 := 'En el asma grave con buena técnica y adherencia, el fenotipo orienta el biológico: anti-IgE en asma alérgica; anti-IL-5 o anti-IL-5R en asma eosinofílica; anti-IL-4Rα en inflamación T2 (también con beneficio en pólipos nasales); anti-TSLP en un espectro amplio. La elección la hace el especialista según biomarcadores, comorbilidades y acceso.';
    v_j1 := $evfresp_json${"external_id":"fresp-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Biológicos en asma grave: omalizumab, mepolizumab, benralizumab, dupilumab y tezepelumab","outcome":"Biológicos en asma grave: omalizumab, mepolizumab, benralizumab, dupilumab y tezepelumab","source":"GINA 2024-2026; fichas técnicas de los biológicos."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un candidato a un biológico dirigido a la vía eosinofílica o T2, elegido con el especialista.', TRUE, 'Correcto. Las comorbilidades orientan la elección.', 0),
      (v_pregunta, 'Debe tratarse con montelukast en monoterapia, que reemplaza al corticoide inhalado en el asma grave.', FALSE, 'El montelukast no reemplaza al corticoide inhalado.', 1),
      (v_pregunta, 'Debe aumentar los ciclos de corticoide oral, porque es la opción más eficaz en el asma eosinofílica.', FALSE, 'Los ciclos repetidos acumulan efectos adversos.', 2),
      (v_pregunta, 'No es candidato a biológicos porque los pólipos nasales los contraindican en todos los casos.', FALSE, 'Los pólipos no los contraindican; algunos los mejoran.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una IPS mantiene un protocolo basado en la GPC de asma de 2013 que trata el asma leve solo con salbutamol a necesidad. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'La GPC colombiana de asma de 2013 no incorpora el cambio de GINA desde 2019, que desaconseja el tratamiento solo con SABA y prefiere un aliviador con corticoide inhalado (budesonida-formoterol). Los protocolos deben actualizarse con la evidencia vigente.';
    v_j1 := $evfresp_json${"external_id":"fresp-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Escalonamiento, desescalamiento, niños y la GPC de asma MinSalud (2013)","outcome":"Escalonamiento, desescalamiento, niños y la GPC de asma MinSalud (2013)","source":"GINA 2024-2026; GPC de asma del Ministerio de Salud (2013)."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuado, porque la guía colombiana es la única que puede aplicarse en el país.', FALSE, 'Las guías internacionales vigentes deben considerarse.', 0),
      (v_pregunta, 'Es adecuado si se acompaña de un ciclo de corticoide oral cada vez que haya síntomas.', FALSE, 'Eso empeora la seguridad.', 1),
      (v_pregunta, 'Conviene actualizarlo: GINA ya no recomienda el SABA solo; se propone un aliviador con corticoide inhalado.', TRUE, 'Correcto. Se presenta la evidencia al comité.', 2),
      (v_pregunta, 'Conviene eliminar el salbutamol del protocolo y usar solo teofilina oral en el asma leve.', FALSE, 'La teofilina no es una opción preferida.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fresp-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. EPOC: GOLD 2025-2026, GPC colombiana y terapias complementarias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. EPOC: GOLD 2025-2026, GPC colombiana y terapias complementarias) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · EPOC: GOLD 2025-2026, GPC colombiana y terapias complementarias';
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


    v_t3 := '¿Qué indica un recuento de eosinófilos en sangre menor de 100 células/µL en una persona con EPOC?';
    v_t4 := 'En la EPOC, los eosinófilos orientan el uso del corticoide inhalado: menos de 100 células/µL predice poco beneficio y el riesgo de neumonía pesa más; entre 100 y 300, beneficio intermedio; 300 o más, mayor beneficio en pacientes con exacerbaciones.';
    v_j1 := $evfresp_json${"external_id":"fresp-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Seguimiento: eosinófilos, triple terapia en un solo dispositivo y retirada del CI","outcome":"Seguimiento: eosinófilos, triple terapia en un solo dispositivo y retirada del CI","source":"GOLD 2025-2026."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que el corticoide inhalado tendrá el máximo beneficio y debe iniciarse siempre a dosis altas.', FALSE, 'Con eosinófilos bajos ocurre lo contrario.', 0),
      (v_pregunta, 'Que el paciente tiene asma y no EPOC, porque los eosinófilos bajos descartan la EPOC.', FALSE, 'No descarta la EPOC.', 1),
      (v_pregunta, 'Que el paciente necesita teofilina como tratamiento de primera línea en lugar de inhaladores.', FALSE, 'La teofilina no es primera línea.', 2),
      (v_pregunta, 'Que el beneficio del corticoide inhalado es bajo y su riesgo de neumonía pesa más.', TRUE, 'Correcto. Con 300 o más el beneficio es mayor.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con EPOC y oxígeno domiciliario sigue fumando en la casa. ¿Qué le indica el QF?';
    v_t4 := 'El oxígeno domiciliario es un medicamento: se prescribe con flujo, horas al día y objetivo de saturación. Fumar o usar llamas cerca del oxígeno causa quemaduras e incendios; la cesación del tabaco es la medida más importante en la EPOC.';
    v_j1 := $evfresp_json${"external_id":"fresp-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Exacerbaciones y oxigenoterapia como medicamento","outcome":"Exacerbaciones y oxigenoterapia como medicamento","source":"GOLD 2025-2026, oxigenoterapia."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que puede fumar si baja el flujo de oxígeno a la mitad mientras tiene el cigarrillo encendido.', FALSE, 'Reducir el flujo no elimina el riesgo de incendio.', 0),
      (v_pregunta, 'Que puede fumar con la cánula puesta si mantiene las ventanas abiertas para ventilar el cuarto.', FALSE, 'Ventilar no evita el riesgo de quemaduras e incendio.', 1),
      (v_pregunta, 'Que fumar cerca del oxígeno causa quemaduras e incendios; además, dejar de fumar es el tratamiento clave.', TRUE, 'Correcto. El oxígeno es un medicamento con riesgos de seguridad.', 2),
      (v_pregunta, 'Que el oxígeno anula el daño del cigarrillo, así que fumar ya no le afecta la enfermedad.', FALSE, 'El tabaco sigue dañando el pulmón.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'A un paciente con EPOC y QT prolongado que toma citalopram le proponen azitromicina diaria para reducir exacerbaciones. ¿Qué análisis hace el QF?';
    v_t4 := 'La azitromicina a largo plazo reduce exacerbaciones en algunos pacientes con EPOC, pero prolonga el QT, puede causar pérdida auditiva y favorece la resistencia bacteriana. Con otros fármacos que prolongan el QT (como el citalopram) o QT prolongado basal, el riesgo de arritmia aumenta.';
    v_j1 := $evfresp_json${"external_id":"fresp-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Roflumilast, azitromicina, mucolíticos y biológicos en EPOC (dupilumab, mepolizumab); ensifentrina","outcome":"Roflumilast, azitromicina, mucolíticos y biológicos en EPOC (dupilumab, mepolizumab); ensifentrina","source":"GOLD 2025-2026; ficha técnica de azitromicina."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No hay riesgo, porque la azitromicina a largo plazo solo puede producir molestias digestivas.', FALSE, 'Tiene otros riesgos relevantes.', 0),
      (v_pregunta, 'La azitromicina prolonga el QT; con citalopram y QT prolongado el riesgo de arritmia aumenta.', TRUE, 'Correcto. También se vigilan la audición y la resistencia.', 1),
      (v_pregunta, 'El citalopram acelera el metabolismo de la azitromicina y la deja sin ningún efecto clínico.', FALSE, 'No es la interacción relevante.', 2),
      (v_pregunta, 'La azitromicina debe darse solo en la noche para evitar cualquier interacción con el citalopram.', FALSE, 'El horario no cambia el riesgo farmacodinámico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con EPOC del grupo E, eosinófilos de 80 células/µL y una neumonía el año pasado usa solo LABA+corticoide inhalado. ¿Cuál es la mejor propuesta?';
    v_t4 := 'GOLD desaconseja el corticoide inhalado con eosinófilos menores de 100 células/µL o neumonías repetidas. En un paciente con exacerbaciones, la base es LABA+LAMA; el corticoide inhalado se reserva para eosinófilos más altos.';
    v_j1 := $evfresp_json${"external_id":"fresp-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso clínico: EPOC grupo E con eosinófilos bajos y neumonía en LABA+CI","outcome":"Caso clínico: EPOC grupo E con eosinófilos bajos y neumonía en LABA+CI","source":"GOLD 2025-2026, seguimiento."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Retirar el corticoide inhalado y pasar a LABA+LAMA, con técnica verificada.', TRUE, 'Correcto. Es coherente con GOLD.', 0),
      (v_pregunta, 'Mantener el esquema y añadir un segundo corticoide inhalado para reforzar el efecto.', FALSE, 'Duplicar corticoides aumenta el riesgo de neumonía.', 1),
      (v_pregunta, 'Añadir prednisolona oral diaria a largo plazo para prevenir las exacerbaciones futuras.', FALSE, 'El corticoide oral crónico no está indicado.', 2),
      (v_pregunta, 'Suspender todos los inhaladores y usar solo salbutamol a necesidad cuando tenga síntomas.', FALSE, 'Dejaría al paciente sin mantenimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fresp-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Dispositivos de inhalación y técnica inhalatoria: el rol del QF' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Dispositivos de inhalación y técnica inhalatoria: el rol del QF) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Dispositivos de inhalación y técnica inhalatoria: el rol del QF';
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


    v_t3 := '¿Qué tamaño de partícula favorece el depósito del medicamento inhalado en las vías respiratorias bajas?';
    v_t4 := 'El depósito pulmonar depende del tamaño de partícula, del flujo inspiratorio y de la coordinación. Las partículas de alrededor de 1 a 5 micras llegan a las vías bajas; las más grandes se depositan en la boca y la garganta.';
    v_j1 := $evfresp_json${"external_id":"fresp-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: depósito pulmonar y por qué el dispositivo importa","outcome":"Introducción a la unidad: depósito pulmonar y por qué el dispositivo importa","source":"GINA 2024-2026; fundamentos de terapia inhalada."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Partículas de alrededor de 1 a 5 micras.', TRUE, 'Correcto. Las más grandes se quedan en la boca y la garganta.', 0),
      (v_pregunta, 'Partículas de más de 20 micras, que caen por su peso directamente sobre los alvéolos.', FALSE, 'Las partículas grandes se depositan en la orofaringe.', 1),
      (v_pregunta, 'Partículas de cualquier tamaño, porque el depósito solo depende de la dosis del inhalador.', FALSE, 'El tamaño de partícula influye mucho en el depósito.', 2),
      (v_pregunta, 'Partículas de más de 50 micras, que avanzan mejor con una inhalación lenta y profunda.', FALSE, 'Son demasiado grandes para llegar a las vías bajas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una madre pregunta cómo limpiar la cámara espaciadora de su hijo. ¿Qué le indica el QF?';
    v_t4 := 'Las cámaras espaciadoras se lavan con agua y detergente suave según las instrucciones del fabricante y se dejan secar al aire, sin frotar, para reducir la carga electrostática que atrapa el medicamento en las paredes.';
    v_j1 := $evfresp_json${"external_id":"fresp-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Inhalador presurizado (pMDI) y cámaras espaciadoras con válvula (con boquilla y con mascarilla)","outcome":"Inhalador presurizado (pMDI) y cámaras espaciadoras con válvula (con boquilla y con mascarilla)","source":"Instrucciones de los fabricantes de cámaras; GINA 2024-2026."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que la lave con alcohol todos los días y la seque con una toalla para que quede brillante.', FALSE, 'El alcohol y frotar pueden dañarla y crear carga estática.', 0),
      (v_pregunta, 'Que la lave con agua y detergente suave según el fabricante y la deje secar al aire, sin frotar.', TRUE, 'Correcto. Así se reduce la carga estática.', 1),
      (v_pregunta, 'Que nunca la lave, porque el agua arrastra el medicamento que queda adherido en las paredes.', FALSE, 'Debe lavarse con la frecuencia que indique el fabricante.', 2),
      (v_pregunta, 'Que la hierva diez minutos cada noche para esterilizarla antes de cada uso del niño.', FALSE, 'Hervirla puede deformarla.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer de 74 años con artrosis en las manos no logra perforar las cápsulas de su inhalador de polvo seco y sopla dentro del dispositivo. ¿Qué análisis es correcto?';
    v_t4 := 'La elección del dispositivo depende del flujo inspiratorio, la coordinación y la destreza manual. Soplar dentro del inhalador de polvo seco humedece el polvo, y la artrosis puede impedir cargar las cápsulas; se propone un dispositivo adecuado y se verifica la técnica.';
    v_j1 := $evfresp_json${"external_id":"fresp-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso clínico: adulta mayor con EPOC, artrosis y errores críticos de inhalación","outcome":"Caso clínico: adulta mayor con EPOC, artrosis y errores críticos de inhalación","source":"GINA 2024-2026; GOLD 2025-2026."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Basta con explicarle de nuevo la técnica, porque los errores siempre se deben a falta de información.', FALSE, 'Hay una limitación física que la explicación no resuelve.', 0),
      (v_pregunta, 'Debe aumentar el número de cápsulas para compensar el medicamento que se pierde con los errores.', FALSE, 'Más cápsulas no corrigen el error de técnica.', 1),
      (v_pregunta, 'El dispositivo no se ajusta a su destreza: conviene proponer otro, como uno de niebla fina o un presurizado con cámara.', TRUE, 'Correcto. La elección del dispositivo depende del paciente.', 2),
      (v_pregunta, 'Debe suspender el inhalador de mantenimiento y usar solo el salbutamol cuando se sienta mal.', FALSE, 'Dejaría a la paciente sin mantenimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una familia quiere comprar un nebulizador para tratar en casa las crisis leves de asma de su hijo de 8 años, «porque el inhalador no sirve». ¿Cuál es la mejor orientación?';
    v_t4 := 'En la mayoría de las crisis de asma, el inhalador presurizado con cámara espaciadora es tan eficaz como el nebulizador, más rápido y portátil. Cuando «el inhalador no sirve», suele haber errores de técnica; se revisa la técnica y el plan de acción.';
    v_j1 := $evfresp_json${"external_id":"fresp-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Inhaladores de polvo seco (DPI), inhalador de niebla fina y nebulizadores","outcome":"Inhaladores de polvo seco (DPI), inhalador de niebla fina y nebulizadores","source":"GINA 2024-2026."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Comprar el nebulizador, porque siempre es más eficaz que cualquier inhalador en los niños.', FALSE, 'En la mayoría de las crisis no es más eficaz.', 0),
      (v_pregunta, 'Comprar el nebulizador y usarlo con agua y sal todas las noches para prevenir las crisis.', FALSE, 'Esa práctica no previene las crisis.', 1),
      (v_pregunta, 'Evitar cualquier tratamiento en casa y llevar al niño a urgencias en cada episodio leve.', FALSE, 'Las crisis leves pueden manejarse con un plan de acción.', 2),
      (v_pregunta, 'Explicar que el presurizado con cámara bien usado es tan eficaz en la mayoría de las crisis, y revisar la técnica.', TRUE, 'Correcto. El problema suele ser la técnica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fresp-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Otros fármacos respiratorios: tos, rinitis, fibrosis pulmonar y tuberculosis' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Otros fármacos respiratorios: tos, rinitis, fibrosis pulmonar y tuberculosis) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Otros fármacos respiratorios: tos, rinitis, fibrosis pulmonar y tuberculosis';
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


    v_t3 := '¿Qué ventaja tienen los antihistamínicos H1 de segunda generación, como la loratadina o la cetirizina, frente a los de primera generación?';
    v_t4 := 'Los antihistamínicos de segunda generación atraviesan poco la barrera hematoencefálica y producen menos sedación y menos efectos anticolinérgicos que los de primera generación (como la clorfeniramina o la difenhidramina). En la rinitis persistente, los corticoides intranasales son muy eficaces.';
    v_j1 := $evfresp_json${"external_id":"fresp-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Rinitis alérgica: antihistamínicos H1, corticoides intranasales, antileucotrienos y técnica del spray nasal","outcome":"Rinitis alérgica: antihistamínicos H1, corticoides intranasales, antileucotrienos y técnica del spray nasal","source":"Fichas técnicas de loratadina y cetirizina."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tienen un efecto anticolinérgico más intenso, útil para secar la congestión nasal.', FALSE, 'Ocurre lo contrario: tienen menos efecto anticolinérgico.', 0),
      (v_pregunta, 'Son más eficaces que los corticoides intranasales en la congestión de la rinitis persistente.', FALSE, 'Los corticoides intranasales suelen ser más eficaces en la congestión.', 1),
      (v_pregunta, 'Producen menos sedación y menos efectos anticolinérgicos.', TRUE, 'Correcto. Atraviesan poco la barrera hematoencefálica.', 2),
      (v_pregunta, 'Se usan sobre todo para inducir el sueño en adultos mayores con insomnio.', FALSE, 'Ese uso corresponde a los de primera generación y no se recomienda.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una madre pide un jarabe con codeína para la tos de su hijo de 9 años. ¿Qué le indica el QF?';
    v_t4 := 'La codeína se transforma en morfina por el CYP2D6; en metabolizadores ultrarrápidos puede causar depresión respiratoria. La EMA la contraindica para la tos en menores de 12 años. La evidencia de los antitusivos de venta libre es limitada.';
    v_j1 := $evfresp_json${"external_id":"fresp-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Antitusivos, mucolíticos y expectorantes: qué dice la evidencia","outcome":"Antitusivos, mucolíticos y expectorantes: qué dice la evidencia","source":"Comunicación de seguridad de la EMA sobre codeína."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que lo puede usar a media dosis, porque en los niños la codeína solo es peligrosa en dosis altas.', FALSE, 'El riesgo no se elimina con media dosis.', 0),
      (v_pregunta, 'Que lo use solo en la noche, cuando la tos no deja dormir al niño, para limitar el riesgo.', FALSE, 'El horario no cambia el riesgo.', 1),
      (v_pregunta, 'Que es seguro porque la codeína de los jarabes no se transforma en morfina en el cuerpo.', FALSE, 'La codeína sí se transforma en morfina por el CYP2D6.', 2),
      (v_pregunta, 'Que la codeína no se recomienda en menores de 12 años por el riesgo de depresión respiratoria.', TRUE, 'Correcto. Se orienta según la causa de la tos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con tuberculosis, VIH en tratamiento antirretroviral y metadona inicia rifampicina. Días después refiere ansiedad, sudoración y dolores. ¿Qué análisis es correcto?';
    v_t4 := 'La rifampicina es un inductor potente del CYP3A4 y de otras enzimas: reduce las concentraciones de metadona (síntomas de abstinencia), de muchos antirretrovirales, anticonceptivos hormonales y otros. El manejo se coordina con el programa de tuberculosis y los médicos tratantes.';
    v_j1 := $evfresp_json${"external_id":"fresp-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso clínico: TB sensible en paciente con VIH y metadona — interacciones de la rifampicina","outcome":"Caso clínico: TB sensible en paciente con VIH y metadona — interacciones de la rifampicina","source":"Ficha técnica de rifampicina; Programa Nacional de Tuberculosis."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La rifampicina es un inductor enzimático potente: bajó la metadona y puede afectar antirretrovirales.', TRUE, 'Correcto. Se coordina con el programa y el médico.', 0),
      (v_pregunta, 'Son efectos de la tuberculosis activa que no tienen ninguna relación con los medicamentos.', FALSE, 'Los síntomas coinciden con abstinencia de opioides.', 1),
      (v_pregunta, 'La rifampicina aumentó la metadona a niveles tóxicos y hay que suspenderla de inmediato.', FALSE, 'La rifampicina reduce, no aumenta, la metadona.', 2),
      (v_pregunta, 'Es una reacción alérgica a la isoniazida, que debe suspenderse sin consultar al programa.', FALSE, 'El cuadro y la cronología orientan a otra causa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un hombre con fibrosis pulmonar que inicia pirfenidona trabaja todo el día al sol en una finca. Pregunta si debe tomar alguna precaución. ¿Cuál es la mejor respuesta?';
    v_t4 := 'La pirfenidona produce fotosensibilidad y erupciones, además de síntomas digestivos; se recomienda protección solar y evitar la exposición. Requiere vigilancia de la función hepática. El nintedanib causa sobre todo diarrea y hepatotoxicidad.';
    v_j1 := $evfresp_json${"external_id":"fresp-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Fibrosis pulmonar idiopática: pirfenidona y nintedanib","outcome":"Fibrosis pulmonar idiopática: pirfenidona y nintedanib","source":"Fichas técnicas de pirfenidona y nintedanib."}$evfresp_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fresp-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que no hay precauciones especiales, porque la pirfenidona solo puede causar diarrea leve.', FALSE, 'Tiene otros efectos relevantes.', 0),
      (v_pregunta, 'Que la pirfenidona causa fotosensibilidad: protección solar, ropa y evitar la exposición; con vigilancia hepática.', TRUE, 'Correcto. También se vigilan los síntomas digestivos.', 1),
      (v_pregunta, 'Que debe suspenderla los días soleados y reanudarla cuando esté nublado.', FALSE, 'No se suspende según el clima.', 2),
      (v_pregunta, 'Que debe tomarla en ayunas para evitar que el sol active el medicamento en la piel.', FALSE, 'La forma de toma no previene la fotosensibilidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fresp-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: fisiopatología respiratoria, broncodilatadores y corticosteroides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: fisiopatología respiratoria, broncodilatadores y corticosteroides) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Sobreuso de salbutamol y corticofobia';
  v_t2 := $evfresp_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Evalúa el control del asma con las preguntas de GINA y el riesgo futuro.</li><li>Analiza el sobreuso de salbutamol y por qué no debe tratarse solo con él.</li><li>Corrige la técnica del inhalador presurizado.</li><li>Prepara la respuesta a su miedo a los corticoides con datos de la ficha técnica.</li><li>Explica a Diana para qué sirve la budesonida-formoterol que no compró.</li><li>Redacta la derivación documentada al médico.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Detectar el sobreuso de broncodilatador de rescate y el riesgo de exacerbación.</li><li>Abordar la corticofobia con información verificable.</li><li>Derivar al médico de forma documentada.</li></ul>
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
  <tr><td>Control y riesgo</td><td>25 %</td><td>Reconoce asma no controlada con riesgo alto por el corticoide oral reciente.</td><td>Reconoce el mal control sin el riesgo.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Sobreuso y técnica</td><td>25 %</td><td>Explica el riesgo del SABA solo y corrige la técnica (agitar, cámara).</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Corticofobia</td><td>30 %</td><td>Responde el miedo con información verificable y propone medidas para efectos locales.</td><td>Respuesta general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Derivación</td><td>10 %</td><td>Derivación clara y documentada.</td><td>Derivación sin datos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfresp_html$;
  v_t3 := $evfresp_html$<h2>Caso de estudio</h2>
<p>Diana tiene 33 años, es docente en Bogotá y pide en la droguería dos inhaladores de salbutamol «porque el anterior se acabó» (datos simulados). Usa el salbutamol casi a diario, se despierta con tos dos noches por semana y tuvo prednisolona en urgencias hace dos meses. Tiene una fórmula de budesonida-formoterol que nunca compró porque «los corticoides engordan». Usa el salbutamol sin agitar y sin cámara.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfresp_html$;
  v_t4 := 'Informe de intervención con derivación documentada.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfresp_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Estrategia GINA (2024-2026); Informe GOLD (2025-2026); guías de práctica clínica del Ministerio de Salud de asma (2013) y EPOC (2014); fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (broncodilatadores, corticoides, montelukast, teofilina, biológicos, antihistamínicos, pirfenidona, nintedanib y antituberculosos); comunicaciones de seguridad de la EMA sobre codeína; Programa Nacional de Tuberculosis; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfresp_html$;
  v_t7 := NULL;
  v_j1 := $evfresp_json$["Control y riesgo.","Sobreuso de SABA.","Técnica.","Corticofobia.","Derivación."]$evfresp_json$::jsonb;
  v_j2 := $evfresp_json${"version":1,"total":100,"criteria":[{"id":"control-y-riesgo","name":"Control y riesgo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce asma no controlada con riesgo alto por el corticoide oral reciente."},{"level":3,"label":"Logrado","description":"Reconoce el mal control sin el riesgo."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"sobreuso-y-tecnica","name":"Sobreuso y técnica","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica el riesgo del SABA solo y corrige la técnica (agitar, cámara)."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"corticofobia","name":"Corticofobia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde el miedo con información verificable y propone medidas para efectos locales."},{"level":3,"label":"Logrado","description":"Respuesta general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"derivacion","name":"Derivación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Derivación clara y documentada."},{"level":3,"label":"Logrado","description":"Derivación sin datos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfresp_json$::jsonb;
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


  -- ── Actividad fresp-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Asma: GINA 2024-2026, GPC colombiana, controladores y biológicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Asma: GINA 2024-2026, GPC colombiana, controladores y biológicos) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Asma grave eosinofílica y acceso a un biológico';
  v_t2 := $evfresp_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Explica por qué Jorge cumple criterios de asma grave y no solo de difícil control.</li><li>Relaciona sus biomarcadores y comorbilidades con los blancos de los biológicos disponibles.</li><li>Describe cómo apoyarías la gestión del acceso con la EPS (documentación clínica, soportes).</li><li>Diseña el manejo de la cadena de frío y la educación para la aplicación.</li><li>Define cómo medir la respuesta al biológico (exacerbaciones, corticoide oral, control).</li><li>Define la farmacovigilancia del biológico.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Confirmar que se descartaron causas de asma de difícil control.</li><li>Relacionar el fenotipo con las opciones de biológicos.</li><li>Diseñar la gestión del acceso, la cadena de frío y el seguimiento.</li></ul>
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
  <tr><td>Criterios de asma grave</td><td>20 %</td><td>Explica que técnica, adherencia y dosis alta ya se verificaron y persisten exacerbaciones.</td><td>Explicación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Fenotipo y biológico</td><td>30 %</td><td>Relaciona eosinofilia, FeNO y pólipos con anti-IL-5/5R o anti-IL-4Rα, decisión del especialista.</td><td>Relación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acceso y cadena de frío</td><td>25 %</td><td>Gestión documentada del acceso y manejo de 2-8 °C con educación.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Respuesta y farmacovigilancia</td><td>15 %</td><td>Indicadores de respuesta y reacciones a vigilar.</td><td>Indicadores generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfresp_html$;
  v_t3 := $evfresp_html$<h2>Caso de estudio</h2>
<p>Jorge tiene 46 años, vive en Medellín y tiene asma desde la infancia (datos simulados). Usa budesonida-formoterol a dosis alta y tiotropio, con técnica verificada y más de 80 % de adherencia por registros de dispensación. Tuvo tres exacerbaciones el último año con corticoide oral. Eosinófilos de 620 células/µL, FeNO de 60 ppb, pólipos nasales y rinitis. El neumólogo propone un biológico y pide al QF apoyo con el acceso y el seguimiento.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfresp_html$;
  v_t4 := 'Plan de gestión y seguimiento del biológico.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfresp_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Estrategia GINA (2024-2026); Informe GOLD (2025-2026); guías de práctica clínica del Ministerio de Salud de asma (2013) y EPOC (2014); fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (broncodilatadores, corticoides, montelukast, teofilina, biológicos, antihistamínicos, pirfenidona, nintedanib y antituberculosos); comunicaciones de seguridad de la EMA sobre codeína; Programa Nacional de Tuberculosis; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfresp_html$;
  v_t7 := NULL;
  v_j1 := $evfresp_json$["Asma grave frente a difícil control.","Fenotipo y biológico.","Acceso.","Cadena de frío y educación.","Respuesta y farmacovigilancia."]$evfresp_json$::jsonb;
  v_j2 := $evfresp_json${"version":1,"total":100,"criteria":[{"id":"criterios-de-asma-grave","name":"Criterios de asma grave","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Explica que técnica, adherencia y dosis alta ya se verificaron y persisten exacerbaciones."},{"level":3,"label":"Logrado","description":"Explicación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"fenotipo-y-biologico","name":"Fenotipo y biológico","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Relaciona eosinofilia, FeNO y pólipos con anti-IL-5/5R o anti-IL-4Rα, decisión del especialista."},{"level":3,"label":"Logrado","description":"Relación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acceso-y-cadena-de-frio","name":"Acceso y cadena de frío","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Gestión documentada del acceso y manejo de 2-8 °C con educación."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"respuesta-y-farmacovigilancia","name":"Respuesta y farmacovigilancia","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Indicadores de respuesta y reacciones a vigilar."},{"level":3,"label":"Logrado","description":"Indicadores generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfresp_json$::jsonb;
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


  -- ── Actividad fresp-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Dispositivos de inhalación y técnica inhalatoria: el rol del QF' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Dispositivos de inhalación y técnica inhalatoria: el rol del QF) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Evaluación y corrección de la técnica inhalatoria';
  v_t2 := $evfresp_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Diseña o adapta una lista de chequeo para cada dispositivo y marca los errores observados.</li><li>Clasifica cuáles errores son críticos y por qué.</li><li>Propone al médico un cambio de dispositivo que se ajuste a su destreza y justifícalo.</li><li>Diseña la enseñanza (explicar, demostrar, practicar, corregir, verificar).</li><li>Estima la adherencia con los registros de dispensación y propone intervenciones.</li><li>Define cómo medirás el resultado en la siguiente visita.</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar los errores críticos con una lista de chequeo.</li><li>Proponer un dispositivo adecuado a su destreza.</li><li>Diseñar una intervención educativa medible y el seguimiento de la adherencia.</li></ul>
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
  <tr><td>Errores críticos</td><td>25 %</td><td>Identifica soplar en el dispositivo, no perforar la cápsula y no coordinar el presurizado como errores críticos.</td><td>Identifica dos errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Dispositivo</td><td>25 %</td><td>Propone un dispositivo según destreza (niebla fina o presurizado con cámara) con justificación.</td><td>Propuesta sin justificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Enseñanza y adherencia</td><td>30 %</td><td>Método de enseñanza completo y adherencia estimada en 60 % con intervenciones.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Medición</td><td>10 %</td><td>Indicador claro para la siguiente visita.</td><td>Indicador vago.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfresp_html$;
  v_t3 := $evfresp_html$<h2>Caso de estudio</h2>
<p>Doña Rosa tiene 74 años, vive en Barranquilla y tiene EPOC y artrosis en las manos (datos simulados). Le dispensan tiotropio en inhalador de polvo seco con cápsulas y salbutamol en presurizado. Dice que «los inhaladores no le sirven». En la demostración: no exhala antes de inhalar y sopla dentro del dispositivo; no logra perforar bien la cápsula; con el presurizado dispara y luego inhala rápido, sin cámara. Vive sola y retira el tiotropio cada 50 días aunque es para 30.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfresp_html$;
  v_t4 := 'Plan de intervención educativa con lista de chequeo y medición.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfresp_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Estrategia GINA (2024-2026); Informe GOLD (2025-2026); guías de práctica clínica del Ministerio de Salud de asma (2013) y EPOC (2014); fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (broncodilatadores, corticoides, montelukast, teofilina, biológicos, antihistamínicos, pirfenidona, nintedanib y antituberculosos); comunicaciones de seguridad de la EMA sobre codeína; Programa Nacional de Tuberculosis; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfresp_html$;
  v_t7 := NULL;
  v_j1 := $evfresp_json$["Lista de chequeo y errores críticos.","Cambio de dispositivo.","Enseñanza.","Adherencia.","Medición del resultado."]$evfresp_json$::jsonb;
  v_j2 := $evfresp_json${"version":1,"total":100,"criteria":[{"id":"errores-criticos","name":"Errores críticos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica soplar en el dispositivo, no perforar la cápsula y no coordinar el presurizado como errores críticos."},{"level":3,"label":"Logrado","description":"Identifica dos errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"dispositivo","name":"Dispositivo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Propone un dispositivo según destreza (niebla fina o presurizado con cámara) con justificación."},{"level":3,"label":"Logrado","description":"Propuesta sin justificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ensenanza-y-adherencia","name":"Enseñanza y adherencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Método de enseñanza completo y adherencia estimada en 60 % con intervenciones."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"medicion","name":"Medición","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Indicador claro para la siguiente visita."},{"level":3,"label":"Logrado","description":"Indicador vago."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfresp_json$::jsonb;
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


  -- ── Actividad fresp-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. EPOC: GOLD 2025-2026, GPC colombiana y terapias complementarias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. EPOC: GOLD 2025-2026, GPC colombiana y terapias complementarias) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: diagnóstico e intervenciones en asma y EPOC del programa';
  v_t2 := $evfresp_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y prioriza los problemas según su gravedad.</li><li>Fase 1: propone cómo identificar con los registros a los pacientes con sobreuso de SABA o ciclos de corticoide oral.</li><li>Fase 2: diseña la intervención para quienes usan SABA sin controlador, alineada con GINA.</li><li>Fase 3: propone la revisión de la teofilina, del corticoide inhalado según eosinófilos y del oxígeno domiciliario.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Diagnóstico del uso de broncodilatadores y corticoides en la droguería.</li>
  <li><strong>Fase 2 · Unidad 2 (asma).</strong> Intervención en el sobreuso de SABA y actualización frente a GINA.</li>
  <li><strong>Fase 3 · Unidad 3 (EPOC).</strong> Teofilina, corticoide inhalado según eosinófilos y oxígeno domiciliario.</li>
  <li><strong>Fase 4 · Unidad 4 (dispositivos).</strong> Programa de enseñanza y verificación de la técnica.</li>
  <li><strong>Fase 5 · Unidad 5 (otros fármacos).</strong> Tos, rinitis, sospecha de tuberculosis, farmacovigilancia e indicadores.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diagnosticar los problemas de uso de medicamentos respiratorios.</li><li>Diseñar intervenciones en asma y EPOC basadas en GINA y GOLD.</li></ul>
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
  <tr><td>Priorización e identificación</td><td>25 %</td><td>Prioriza con criterios y usa registros de dispensación para identificar pacientes en riesgo.</td><td>Prioriza sin usar datos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Asma</td><td>30 %</td><td>Intervención coherente con GINA: aliviador con corticoide inhalado, técnica y remisión documentada.</td><td>Intervención general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>EPOC</td><td>35 %</td><td>Revisión de teofilina (niveles, interacciones), corticoide según eosinófilos y seguridad del oxígeno.</td><td>Aborda dos de los tres temas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfresp_html$;
  v_t3 := $evfresp_html$<h2>Caso de estudio</h2>
<p>Eres el QF de una droguería con servicio farmacéutico en Sogamoso (datos simulados). Atiendes a muchas personas con asma y EPOC, buena parte expuestas al humo de leña. En un mes detectas: compras frecuentes de salbutamol sin controlador; pacientes con teofilina sin niveles; errores de técnica generalizados; un paciente con oxígeno que fuma; y jarabes con codeína pedidos para niños. La EPS te propone liderar un programa de atención farmacéutica respiratoria. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfresp_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfresp_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Estrategia GINA (2024-2026); Informe GOLD (2025-2026); guías de práctica clínica del Ministerio de Salud de asma (2013) y EPOC (2014); fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (broncodilatadores, corticoides, montelukast, teofilina, biológicos, antihistamínicos, pirfenidona, nintedanib y antituberculosos); comunicaciones de seguridad de la EMA sobre codeína; Programa Nacional de Tuberculosis; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfresp_html$;
  v_t7 := NULL;
  v_j1 := $evfresp_json$["Priorización.","Identificación con registros.","Intervención en asma.","Intervención en EPOC."]$evfresp_json$::jsonb;
  v_j2 := $evfresp_json${"version":1,"total":100,"criteria":[{"id":"priorizacion-e-identificacion","name":"Priorización e identificación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Prioriza con criterios y usa registros de dispensación para identificar pacientes en riesgo."},{"level":3,"label":"Logrado","description":"Prioriza sin usar datos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"asma","name":"Asma","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Intervención coherente con GINA: aliviador con corticoide inhalado, técnica y remisión documentada."},{"level":3,"label":"Logrado","description":"Intervención general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"epoc","name":"EPOC","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Revisión de teofilina (niveles, interacciones), corticoide según eosinófilos y seguridad del oxígeno."},{"level":3,"label":"Logrado","description":"Aborda dos de los tres temas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfresp_json$::jsonb;
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


  -- ── Actividad fresp-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Otros fármacos respiratorios: tos, rinitis, fibrosis pulmonar y tuberculosis' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Otros fármacos respiratorios: tos, rinitis, fibrosis pulmonar y tuberculosis) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: programa integral de atención farmacéutica respiratoria';
  v_t2 := $evfresp_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: diseña el programa de enseñanza y verificación de la técnica con listas de chequeo.</li><li>Fase 5: diseña el protocolo de dispensación para la tos y la rinitis, incluida la remisión ante sospecha de tuberculosis.</li><li>Fase 5: define indicadores del programa y el plan de farmacovigilancia.</li><li>Escribe un resumen ejecutivo de una página para la EPS.</li><li>Revisa con la rúbrica y sube el programa en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Diagnóstico del uso de broncodilatadores y corticoides en la droguería.</li>
  <li><strong>Fase 2 · Unidad 2 (asma).</strong> Intervención en el sobreuso de SABA y actualización frente a GINA.</li>
  <li><strong>Fase 3 · Unidad 3 (EPOC).</strong> Teofilina, corticoide inhalado según eosinófilos y oxígeno domiciliario.</li>
  <li><strong>Fase 4 · Unidad 4 (dispositivos).</strong> Programa de enseñanza y verificación de la técnica.</li>
  <li><strong>Fase 5 · Unidad 5 (otros fármacos).</strong> Tos, rinitis, sospecha de tuberculosis, farmacovigilancia e indicadores.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar un programa de técnica inhalatoria y de dispensación segura de productos para la tos y la rinitis.</li><li>Definir indicadores y farmacovigilancia.</li></ul>
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
  <tr><td>Técnica inhalatoria</td><td>25 %</td><td>Programa con método completo, verificación periódica y registro.</td><td>Programa sin verificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Tos y rinitis</td><td>25 %</td><td>Protocolo con restricción de codeína en niños, cuidado en adultos mayores y remisión por tos prolongada.</td><td>Protocolo parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores y farmacovigilancia</td><td>25 %</td><td>Indicadores medibles con metas y reporte al INVIMA.</td><td>Indicadores sin metas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfresp_html$;
  v_t3 := $evfresp_html$<h2>Caso de estudio</h2>
<p>Eres el QF de una droguería con servicio farmacéutico en Sogamoso (datos simulados). Atiendes a muchas personas con asma y EPOC, buena parte expuestas al humo de leña. En un mes detectas: compras frecuentes de salbutamol sin controlador; pacientes con teofilina sin niveles; errores de técnica generalizados; un paciente con oxígeno que fuma; y jarabes con codeína pedidos para niños. La EPS te propone liderar un programa de atención farmacéutica respiratoria. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el programa que presentarás a la EPS.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfresp_html$;
  v_t4 := 'Programa integral con indicadores y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfresp_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Estrategia GINA (2024-2026); Informe GOLD (2025-2026); guías de práctica clínica del Ministerio de Salud de asma (2013) y EPOC (2014); fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (broncodilatadores, corticoides, montelukast, teofilina, biológicos, antihistamínicos, pirfenidona, nintedanib y antituberculosos); comunicaciones de seguridad de la EMA sobre codeína; Programa Nacional de Tuberculosis; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfresp_html$;
  v_t7 := NULL;
  v_j1 := $evfresp_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Técnica inhalatoria.","Tos, rinitis y tuberculosis.","Indicadores y farmacovigilancia.","Resumen ejecutivo."]$evfresp_json$::jsonb;
  v_j2 := $evfresp_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tecnica-inhalatoria","name":"Técnica inhalatoria","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Programa con método completo, verificación periódica y registro."},{"level":3,"label":"Logrado","description":"Programa sin verificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tos-y-rinitis","name":"Tos y rinitis","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Protocolo con restricción de codeína en niños, cuidado en adultos mayores y remisión por tos prolongada."},{"level":3,"label":"Logrado","description":"Protocolo parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores-y-farmacovigilancia","name":"Indicadores y farmacovigilancia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Indicadores medibles con metas y reporte al INVIMA."},{"level":3,"label":"Logrado","description":"Indicadores sin metas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfresp_json$::jsonb;
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


  -- ── Foro fresp-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con medicamentos respiratorios';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfresp_html$<h2>Para empezar</h2>
<p>Piensa en una persona con un problema respiratorio que hayas atendido o acompañado y cuéntanos en tres o cuatro líneas una dificultad que tuvo con sus medicamentos o su inhalador, sin nombres ni datos que la identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfresp_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre medicamentos respiratorios te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfresp_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfresp_html$;
  v_t6 := $evfresp_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfresp_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué producto para la tos o la gripa te piden con más frecuencia?', '¿Has visto errores de técnica con los inhaladores en tu práctica?']::text[];
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


  -- ── Foro fresp-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos: fisiopatología respiratoria, broncodilatadores y corticosteroides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos: fisiopatología respiratoria, broncodilatadores y corticosteroides) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Corticofobia: cómo hablar de los corticoides inhalados';
  v_t2 := 'Argumentar cómo abordar el miedo a los corticoides inhalados para mejorar el control del asma.';
  v_t3 := $evfresp_html$<h2>Caso del foro</h2>
<p>En una droguería, tres personas con asma rechazan el corticoide inhalado (datos simulados): una dice que «engorda y daña los huesos», otro que «crea dependencia» y una madre que «le va a frenar el crecimiento a su hijo». Todos usan salbutamol con frecuencia.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfresp_html$;
  v_t4 := '¿Qué le dirías a cada persona y qué información verificable usarías?';
  v_t5 := $evfresp_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación de GINA que sustenta tu respuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfresp_html$;
  v_t6 := $evfresp_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación de GINA que sustenta tu respuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfresp_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué diferencia hay entre los efectos del corticoide inhalado y los del oral?', '¿Qué se sabe del efecto sobre el crecimiento en niños?', '¿Cómo se reducen los efectos locales?']::text[];
  v_j1 := $evfresp_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación de GINA que sustenta tu respuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfresp_json$::jsonb;
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


  -- ── Foro fresp-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Asma: GINA 2024-2026, GPC colombiana, controladores y biológicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Asma: GINA 2024-2026, GPC colombiana, controladores y biológicos) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Teofilina: ¿todavía tiene lugar?';
  v_t2 := 'Argumentar el lugar actual de la teofilina y cómo usarla con seguridad si se mantiene.';
  v_t3 := $evfresp_html$<h2>Caso del foro</h2>
<p>En un programa de EPOC de una zona rural, 25 pacientes siguen con teofilina oral (datos simulados): es barata y fácil de conseguir. Ninguno tiene niveles séricos. Varios fuman y algunos reciben a veces ciprofloxacino o claritromicina.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfresp_html$;
  v_t4 := '¿Mantendrías la teofilina en estos pacientes? ¿Qué propondrías?';
  v_t5 := $evfresp_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la guía que sustenta tu postura. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfresp_html$;
  v_t6 := $evfresp_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta tu postura.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfresp_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué la teofilina tiene un margen terapéutico estrecho?', '¿Qué factores suben o bajan sus niveles?', '¿Qué alternativas recomiendan las guías actuales?']::text[];
  v_j1 := $evfresp_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta tu postura."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfresp_json$::jsonb;
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


  -- ── Foro fresp-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. EPOC: GOLD 2025-2026, GPC colombiana y terapias complementarias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. EPOC: GOLD 2025-2026, GPC colombiana y terapias complementarias) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Oxígeno en casa: un medicamento que se olvida';
  v_t2 := 'Argumentar por qué el oxígeno domiciliario debe gestionarse como un medicamento.';
  v_t3 := $evfresp_html$<h2>Caso del foro</h2>
<p>En un programa de EPOC, 30 pacientes tienen oxígeno domiciliario (datos simulados). Muchos lo usan solo «cuando se ahogan», otros lo usan 24 horas sin indicación clara, una familia cocina con leña cerca del concentrador y nadie sabe cuál es la saturación objetivo de cada paciente.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfresp_html$;
  v_t4 := '¿Qué debe saber cada paciente sobre su oxígeno y qué papel tiene el servicio farmacéutico?';
  v_t5 := $evfresp_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación de GOLD o la norma que sustenta cada punto. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfresp_html$;
  v_t6 := $evfresp_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de GOLD o la norma que sustenta cada punto.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfresp_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué datos debe tener una prescripción de oxígeno?', '¿Qué riesgos de seguridad tiene el oxígeno en casa?', '¿Cómo se vigila que el paciente lo use según lo indicado?']::text[];
  v_j1 := $evfresp_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación de GOLD o la norma que sustenta cada punto."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfresp_json$::jsonb;
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


  -- ── Foro fresp-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Dispositivos de inhalación y técnica inhalatoria: el rol del QF' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Dispositivos de inhalación y técnica inhalatoria: el rol del QF) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · ¿Quién enseña la técnica inhalatoria?';
  v_t2 := 'Argumentar el papel del servicio farmacéutico en la enseñanza y verificación de la técnica inhalatoria.';
  v_t3 := $evfresp_html$<h2>Caso del foro</h2>
<p>Una auditoría en una EPS muestra que el 70 % de los pacientes con asma o EPOC comete al menos un error crítico con su inhalador (datos simulados). Los médicos dicen que «no tienen tiempo», las enfermeras que «es tarea de la farmacia» y en la farmacia se dispensan los inhaladores sin demostración.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfresp_html$;
  v_t4 := '¿Cómo organizarías la enseñanza y la verificación de la técnica y cómo medirías el resultado?';
  v_t5 := $evfresp_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación o el dato que sustenta tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfresp_html$;
  v_t6 := $evfresp_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato que sustenta tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfresp_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué es un error crítico y por qué importa?', '¿Qué método de enseñanza tiene mejores resultados?', '¿Cada cuánto debe volver a verificarse la técnica?']::text[];
  v_j1 := $evfresp_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato que sustenta tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfresp_json$::jsonb;
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


  -- ── Foro fresp-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Otros fármacos respiratorios: tos, rinitis, fibrosis pulmonar y tuberculosis' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Otros fármacos respiratorios: tos, rinitis, fibrosis pulmonar y tuberculosis) en Farmacología Respiratoria: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Jarabes para la tos: ¿qué vender?';
  v_t2 := 'Argumentar qué recomendar ante la tos en la droguería con base en la evidencia y la seguridad.';
  v_t3 := $evfresp_html$<h2>Caso del foro</h2>
<p>En una droguería de barrio, en una semana piden (datos simulados): un jarabe con codeína para un niño de 6 años; un antigripal con clorfeniramina para un señor de 80 años; un mucolítico para un adulto con tos de tres semanas y pérdida de peso; y «algo fuerte» para la tos de una persona que fuma.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfresp_html$;
  v_t4 := '¿Qué harías en cada caso y cuándo remitirías?';
  v_t5 := $evfresp_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica, la comunicación de seguridad o la recomendación que sustenta cada respuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfresp_html$;
  v_t6 := $evfresp_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica, la comunicación de seguridad o la recomendación que sustenta cada respuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfresp_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué evidencia tienen los antitusivos y expectorantes de venta libre?', '¿Qué riesgos tienen los antihistamínicos de primera generación en adultos mayores?', '¿Qué señales de alarma obligan a remitir, incluida la sospecha de tuberculosis?']::text[];
  v_j1 := $evfresp_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica, la comunicación de seguridad o la recomendación que sustenta cada respuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfresp_json$::jsonb;
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


  RAISE NOTICE 'Farmacología Respiratoria: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfresp$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Farmacología Gastrointestinal
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfgi$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacología Gastrointestinal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Secreción ácida gástrica y fármacos antisecretores', 'Unidad 2. ERGE, úlcera péptica y erradicación de Helicobacter pylori', 'Unidad 3. Motilidad digestiva: antieméticos, procinéticos, laxantes, antidiarreicos, SII y probióticos', 'Unidad 4. Enfermedad inflamatoria intestinal', 'Unidad 5. Hígado y páncreas: cirrosis, hepatotoxicidad y enzimas pancreáticas']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacología Gastrointestinal: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfgi_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfgi_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fgi-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Secreción ácida gástrica y fármacos antisecretores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Secreción ácida gástrica y fármacos antisecretores) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Secreción ácida gástrica y fármacos antisecretores';
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


    v_t3 := '¿Por qué los inhibidores de la bomba de protones se toman antes del desayuno?';
    v_t4 := 'Los IBP son profármacos que se activan en el medio ácido de la célula parietal y bloquean de forma irreversible la H+/K+-ATPasa. Actúan mejor sobre las bombas activas, por eso se toman 30 a 60 minutos antes de la primera comida del día.';
    v_j1 := $evfgi_json${"external_id":"fgi-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"IBP: mecanismo, farmacocinética, CYP2C19 e interacciones","outcome":"IBP: mecanismo, farmacocinética, CYP2C19 e interacciones","source":"Fichas técnicas de omeprazol y esomeprazol."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque así se evita que el alimento los destruya en la boca antes de llegar al estómago del paciente.', FALSE, 'La razón no es la destrucción en la boca.', 0),
      (v_pregunta, 'Porque tomados en la noche producen insomnio y pesadillas en la mayoría de los pacientes adultos.', FALSE, 'No es la razón de la recomendación.', 1),
      (v_pregunta, 'Porque su absorción es nula si se toman después de comer y el medicamento se elimina sin efecto.', FALSE, 'No es una absorción nula; el motivo es la activación.', 2),
      (v_pregunta, 'Porque son profármacos que se activan en medio ácido y bloquean las bombas activadas por la comida.', TRUE, 'Correcto. Se toman 30 a 60 minutos antes.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con ciprofloxacino toma también un antiácido de aluminio y magnesio para la acidez. ¿Qué le indica el QF?';
    v_t4 := 'Los antiácidos con aluminio, magnesio o calcio forman quelatos con quinolonas, tetraciclinas, hierro y levotiroxina, y reducen su absorción. Se separan varias horas según la ficha técnica de cada medicamento.';
    v_j1 := $evfgi_json${"external_id":"fgi-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Antiácidos, alginatos y protectores de mucosa","outcome":"Antiácidos, alginatos y protectores de mucosa","source":"Fichas técnicas de ciprofloxacino y de los antiácidos."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que los tome juntos, porque el antiácido protege el estómago de los efectos irritantes del antibiótico.', FALSE, 'Tomarlos juntos reduce mucho la absorción del antibiótico.', 0),
      (v_pregunta, 'Que separe el antiácido del ciprofloxacino varias horas, porque los cationes reducen su absorción.', TRUE, 'Correcto. Lo mismo ocurre con tetraciclinas, hierro y levotiroxina.', 1),
      (v_pregunta, 'Que suspenda el antibiótico, porque nunca puede usarse en personas que tienen acidez.', FALSE, 'No hay razón para suspender el antibiótico.', 2),
      (v_pregunta, 'Que duplique el ciprofloxacino los días en que tome el antiácido para compensar el efecto.', FALSE, 'Duplicar la dosis no es la solución correcta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente que toma clopidogrel tras un stent recibe omeprazol para proteger el estómago. ¿Qué análisis hace el QF?';
    v_t4 := 'El clopidogrel es un profármaco activado por el CYP2C19. El omeprazol y el esomeprazol inhiben esa enzima y pueden reducir su efecto; se prefiere un IBP con menor interacción, como el pantoprazol, cuando la gastroprotección está indicada.';
    v_j1 := $evfgi_json${"external_id":"fgi-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"IBP: mecanismo, farmacocinética, CYP2C19 e interacciones","outcome":"IBP: mecanismo, farmacocinética, CYP2C19 e interacciones","source":"Fichas técnicas de clopidogrel y omeprazol."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No hay interacción, porque el omeprazol actúa solo en el estómago y el clopidogrel en las plaquetas.', FALSE, 'Hay una interacción metabólica relevante.', 0),
      (v_pregunta, 'El omeprazol aumenta el efecto del clopidogrel y eleva el riesgo de sangrado grave.', FALSE, 'El efecto es el contrario.', 1),
      (v_pregunta, 'El omeprazol inhibe el CYP2C19, que activa el clopidogrel; se prefiere un IBP con menos interacción, como el pantoprazol.', TRUE, 'Correcto. La gastroprotección se mantiene.', 2),
      (v_pregunta, 'El paciente debe suspender el clopidogrel mientras tome cualquier IBP para evitar riesgos.', FALSE, 'Nunca se suspende el antiagregante por cuenta propia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un adulto mayor toma omeprazol desde hace 5 años «para proteger el estómago», sin úlcera, sin reflujo actual y sin AINE. Su hijo quiere suspenderlo hoy. ¿Cuál es la mejor propuesta?';
    v_t4 := 'Muchos tratamientos crónicos con IBP carecen de indicación vigente. El uso prolongado se asocia a hipomagnesemia, déficit de B12, fracturas e infección por C. difficile. La deprescripción revisa la indicación, reduce de forma gradual o pasa a uso a demanda y maneja la hipersecreción de rebote.';
    v_j1 := $evfgi_json${"external_id":"fgi-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Protocolo de deprescripción de IBP","outcome":"Protocolo de deprescripción de IBP","source":"Protocolos de deprescripción de IBP; fichas técnicas."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Revisar la indicación con el médico y, si no la hay, reducir de forma gradual o pasar a uso a demanda, previniendo el rebote.', TRUE, 'Correcto. Es el protocolo de deprescripción.', 0),
      (v_pregunta, 'Suspenderlo de golpe hoy, porque los IBP no producen ningún efecto al retirarlos.', FALSE, 'La suspensión brusca puede causar hipersecreción de rebote.', 1),
      (v_pregunta, 'Mantenerlo de por vida, porque el uso prolongado de IBP no tiene ningún riesgo conocido.', FALSE, 'El uso prolongado tiene riesgos asociados.', 2),
      (v_pregunta, 'Duplicar la dosis un mes antes de suspenderlo para que el estómago se acostumbre al cambio.', FALSE, 'Subir la dosis no prepara el retiro.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fgi-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. ERGE, úlcera péptica y erradicación de Helicobacter pylori' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. ERGE, úlcera péptica y erradicación de Helicobacter pylori) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · ERGE, úlcera péptica y erradicación de Helicobacter pylori';
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


    v_t3 := '¿Qué hallazgos en una persona con reflujo obligan a remitir para estudio en lugar de tratar en la droguería?';
    v_t4 := 'En la ERGE se tratan los síntomas típicos con medidas generales e IBP por 8 semanas, y luego la dosis mínima eficaz o el uso a demanda. Los signos de alarma (disfagia, pérdida de peso, sangrado, anemia, vómito persistente) obligan a remitir para endoscopia.';
    v_j1 := $evfgi_json${"external_id":"fgi-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"ERGE: escalonamiento terapéutico, IBP a dosis estándar o doble y terapia a demanda","outcome":"ERGE: escalonamiento terapéutico, IBP a dosis estándar o doble y terapia a demanda","source":"Guías de ERGE; fichas técnicas de los IBP."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Dificultad para tragar, pérdida de peso, sangrado o anemia.', TRUE, 'Correcto. Son signos de alarma.', 0),
      (v_pregunta, 'Acidez después de comidas muy grasosas que mejora con un antiácido en pocos minutos.', FALSE, 'Es un síntoma típico sin alarma.', 1),
      (v_pregunta, 'Ardor ocasional en la noche que mejora al elevar la cabecera de la cama.', FALSE, 'Es un síntoma típico que responde a medidas generales.', 2),
      (v_pregunta, 'Regurgitación después de comer en exceso, sin otros síntomas asociados.', FALSE, 'Por sí sola no es un signo de alarma.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un hombre de 72 años que toma ácido acetilsalicílico 100 mg recibe naproxeno por artrosis. ¿Qué propone el QF?';
    v_t4 := 'Los factores de riesgo de complicaciones por AINE incluyen edad avanzada, úlcera previa, uso de antiagregantes, anticoagulantes o corticoides y dosis altas. En pacientes de riesgo se evita el AINE o se indica gastroprotección con un IBP.';
    v_j1 := $evfgi_json${"external_id":"fgi-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Úlcera péptica: H. pylori, AINE y gastroprotección","outcome":"Úlcera péptica: H. pylori, AINE y gastroprotección","source":"Fichas técnicas de los AINE; guías de gastroprotección."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Dispensar el naproxeno sin ningún cambio, porque la aspirina a dosis bajas no aumenta el riesgo gástrico.', FALSE, 'Sí lo aumenta, y más con otro AINE.', 0),
      (v_pregunta, 'Agregar un antiácido de magnesio y aluminio en cada comida como única protección necesaria.', FALSE, 'Los antiácidos no protegen contra la úlcera por AINE.', 1),
      (v_pregunta, 'Valorar con el médico la gastroprotección con un IBP o evitar el AINE, por su riesgo alto de sangrado.', TRUE, 'Correcto. Edad y combinación de antitrombótico y AINE elevan el riesgo.', 2),
      (v_pregunta, 'Cambiar el naproxeno por diclofenaco, que no produce daño en la mucosa del estómago.', FALSE, 'El diclofenaco también es un AINE con riesgo gástrico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En una región de Colombia con resistencia a la claritromicina cercana al 25 %, un médico usa como primera línea la triple terapia con claritromicina por 7 días. ¿Qué análisis es correcto?';
    v_t4 := 'Maastricht VI recomienda la terapia cuádruple con bismuto por 14 días como primera línea donde la resistencia a la claritromicina supera el 15 % o es desconocida. En Colombia los datos muestran resistencia alta a la claritromicina y muy alta al metronidazol.';
    v_j1 := $evfgi_json${"external_id":"fgi-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Resistencia antimicrobiana de H. pylori en Colombia","outcome":"Resistencia antimicrobiana de H. pylori en Colombia","source":"Consenso de Maastricht VI/Florencia; datos de resistencia en Colombia."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada, porque la resistencia a la claritromicina no afecta el resultado de la erradicación.', FALSE, 'La resistencia reduce mucho la eficacia.', 0),
      (v_pregunta, 'Es adecuada si el paciente toma probióticos, que compensan cualquier resistencia del germen.', FALSE, 'Los probióticos no compensan la resistencia.', 1),
      (v_pregunta, 'Es adecuada si se extiende a 30 días, porque así se supera la resistencia de la bacteria.', FALSE, 'Prolongar no resuelve la resistencia.', 2),
      (v_pregunta, 'Con resistencia mayor de 15 %, Maastricht VI prefiere la cuádruple con bismuto por 14 días.', TRUE, 'Correcto. La triple con claritromicina falla con frecuencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente que inicia la cuádruple con bismuto (con metronidazol y tetraciclina) dice que seguirá tomando cerveza los fines de semana y tomará las cápsulas con leche. ¿Cuál es la mejor orientación?';
    v_t4 := 'El metronidazol puede causar una reacción tipo disulfiram con el alcohol (náuseas, rubor, taquicardia), por lo que se evita durante el tratamiento y unos días después. La tetraciclina se quela con el calcio de los lácteos y los antiácidos. El bismuto oscurece las heces. La adherencia completa es clave para erradicar.';
    v_j1 := $evfgi_json${"external_id":"fgi-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso clínico: fracaso de la triple terapia y rescate con cuádruple con bismuto","outcome":"Caso clínico: fracaso de la triple terapia y rescate con cuádruple con bismuto","source":"Fichas técnicas de metronidazol, tetraciclina y bismuto."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que no hay problema con la cerveza ni con la leche, porque no afectan a estos medicamentos.', FALSE, 'Ambos interfieren con el tratamiento.', 0),
      (v_pregunta, 'Que evite el alcohol por la reacción con el metronidazol y separe los lácteos de la tetraciclina.', TRUE, 'Correcto. También se explica que las heces pueden oscurecerse.', 1),
      (v_pregunta, 'Que tome el doble de cápsulas los fines de semana para compensar el efecto de la cerveza.', FALSE, 'Duplicar dosis no corrige la interacción.', 2),
      (v_pregunta, 'Que suspenda el tratamiento los fines de semana y lo retome cada lunes para evitar las interacciones.', FALSE, 'Interrumpir el esquema reduce la erradicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fgi-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Motilidad digestiva: antieméticos, procinéticos, laxantes, antidiarreicos, SII y probióticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Motilidad digestiva: antieméticos, procinéticos, laxantes, antidiarreicos, SII y probióticos) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Motilidad digestiva: antieméticos, procinéticos, laxantes, antidiarreicos, SII y probióticos';
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


    v_t3 := '¿Qué restricción de uso tiene la metoclopramida según su ficha técnica actual?';
    v_t4 := 'Las agencias restringieron la metoclopramida a un uso corto (máximo 5 días y 30 mg al día en adultos) por el riesgo de síntomas extrapiramidales y de discinesia tardía, que puede ser irreversible; está contraindicada en menores de 1 año.';
    v_j1 := $evfgi_json${"external_id":"fgi-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Metoclopramida: advertencias de seguridad (máximo 5 días, discinesia tardía)","outcome":"Metoclopramida: advertencias de seguridad (máximo 5 días, discinesia tardía)","source":"Comunicación de seguridad de la EMA sobre metoclopramida; ficha técnica."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Puede usarse de forma indefinida en adultos porque no produce efectos neurológicos.', FALSE, 'Tiene un riesgo neurológico importante.', 0),
      (v_pregunta, 'Uso corto, máximo 5 días, por el riesgo de síntomas extrapiramidales y discinesia tardía.', TRUE, 'Correcto. También se contraindica en menores de 1 año.', 1),
      (v_pregunta, 'Solo puede usarse en niños pequeños, porque en ellos no causa reacciones extrapiramidales.', FALSE, 'En niños el riesgo es mayor; está contraindicada en menores de 1 año.', 2),
      (v_pregunta, 'Debe tomarse siempre junto con domperidona para potenciar el efecto procinético.', FALSE, 'No se recomienda esa combinación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una madre pide loperamida para su hijo de 3 años con diarrea desde ayer, sin sangre. ¿Qué le indica el QF?';
    v_t4 := 'En la diarrea aguda la prioridad es la rehidratación con sales de rehidratación oral (OMS) y mantener la alimentación. La loperamida está contraindicada en niños pequeños y en la diarrea invasiva (con sangre o fiebre alta); en sobredosis tiene riesgo cardíaco.';
    v_j1 := $evfgi_json${"external_id":"fgi-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Antidiarreicos y rehidratación: loperamida, racecadotrilo y SRO","outcome":"Antidiarreicos y rehidratación: loperamida, racecadotrilo y SRO","source":"Ficha técnica de loperamida; recomendaciones de la OMS sobre rehidratación oral."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que le dé la mitad de la dosis de un adulto durante tres días para cortar la diarrea.', FALSE, 'La loperamida no se usa en niños pequeños.', 0),
      (v_pregunta, 'Que le dé un antibiótico de venta libre, porque toda diarrea infantil es bacteriana.', FALSE, 'La mayoría son virales y no requieren antibiótico.', 1),
      (v_pregunta, 'Que suspenda la alimentación y le dé solo agua hasta que pare la diarrea.', FALSE, 'Se mantiene la alimentación y se usa sales de rehidratación.', 2),
      (v_pregunta, 'Que la prioridad son las sales de rehidratación oral; la loperamida no se usa en niños pequeños.', TRUE, 'Correcto. Y se explican los signos de deshidratación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer de 78 años toma citalopram y recibe domperidona para las náuseas y claritromicina por una infección. ¿Qué análisis hace el QF?';
    v_t4 := 'La domperidona prolonga el QT y se asocia a arritmias y muerte súbita; su dosis máxima es 30 mg al día por no más de una semana y está contraindicada con inhibidores potentes del CYP3A4 (claritromicina, azoles, inhibidores de proteasa). El citalopram y la edad aumentan el riesgo.';
    v_j1 := $evfgi_json${"external_id":"fgi-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso clínico: adulto mayor con náuseas, polifarmacia y prolongación del QT","outcome":"Caso clínico: adulto mayor con náuseas, polifarmacia y prolongación del QT","source":"Comunicación de seguridad de la EMA sobre domperidona; ficha técnica."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Hay riesgo alto de prolongación del QT: la domperidona está contraindicada con inhibidores potentes del CYP3A4.', TRUE, 'Correcto. Se proponen alternativas y se reporta si hay evento.', 0),
      (v_pregunta, 'No hay riesgo, porque la domperidona no atraviesa la barrera hematoencefálica.', FALSE, 'Su riesgo es cardíaco, no neurológico.', 1),
      (v_pregunta, 'El único problema es la sedación por la combinación de los tres medicamentos.', FALSE, 'El riesgo principal es arrítmico.', 2),
      (v_pregunta, 'Basta con separar las tomas dos horas para que no haya ninguna interacción.', FALSE, 'Separar las tomas no evita la interacción.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con morfina tiene estreñimiento, bebe poca agua y está en cama. Un colega recomienda psyllium como único laxante. ¿Cuál es la mejor valoración?';
    v_t4 := 'En el estreñimiento inducido por opioides se prefieren laxantes osmóticos (macrogol, lactulosa) o estimulantes (senósidos, bisacodilo), de forma preventiva. Los formadores de masa requieren buena ingesta de líquidos y movilidad; en pacientes encamados o con poca agua pueden empeorar el cuadro.';
    v_j1 := $evfgi_json${"external_id":"fgi-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Laxantes: formadores de masa, osmóticos, estimulantes, emolientes y secretagogos","outcome":"Laxantes: formadores de masa, osmóticos, estimulantes, emolientes y secretagogos","source":"Fichas técnicas de los laxantes."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es la mejor opción, porque la fibra es eficaz en cualquier tipo de estreñimiento, sin ninguna excepción.', FALSE, 'No es la mejor opción en este escenario.', 0),
      (v_pregunta, 'Es correcta si se toma con poca agua para que la fibra no aumente el volumen de las heces.', FALSE, 'Con poca agua la fibra puede empeorar el problema.', 1),
      (v_pregunta, 'Es poco adecuada: en el estreñimiento por opioides se prefieren laxantes osmóticos o estimulantes.', TRUE, 'Correcto. La fibra con poca agua y movilidad puede empeorarlo.', 2),
      (v_pregunta, 'Es correcta si se acompaña de loperamida para regular el tránsito intestinal del paciente.', FALSE, 'La loperamida empeoraría el estreñimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fgi-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Enfermedad inflamatoria intestinal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Enfermedad inflamatoria intestinal) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Enfermedad inflamatoria intestinal';
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


    v_t3 := '¿Por qué se mide la actividad de la TPMT antes de iniciar azatioprina?';
    v_t4 := 'La tiopurina metiltransferasa (TPMT) inactiva parte de los metabolitos de la azatioprina. Las personas con actividad baja o nula acumulan nucleótidos de tioguanina y tienen riesgo de mielotoxicidad grave; se mide el genotipo o fenotipo antes de iniciar y se vigila el hemograma.';
    v_j1 := $evfgi_json${"external_id":"fgi-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Tiopurinas y TPMT; metotrexato","outcome":"Tiopurinas y TPMT; metotrexato","source":"Ficha técnica de azatioprina."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque su déficit aumenta la eliminación de la azatioprina y la deja sin ningún efecto terapéutico.', FALSE, 'Ocurre lo contrario: su déficit acumula metabolitos activos.', 0),
      (v_pregunta, 'Porque define si el paciente es alérgico a la azatioprina y debe usar otro inmunosupresor.', FALSE, 'No es una prueba de alergia.', 1),
      (v_pregunta, 'Porque su déficit acumula metabolitos activos y aumenta el riesgo de mielotoxicidad grave.', TRUE, 'Correcto. Se ajusta la dosis o se elige otra opción.', 2),
      (v_pregunta, 'Porque mide la función renal y permite ajustar la dosis según la depuración de creatinina.', FALSE, 'La TPMT no mide la función renal.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con azatioprina por enfermedad de Crohn recibe alopurinol por gota. ¿Qué advierte el QF al médico?';
    v_t4 := 'La xantina oxidasa inactiva la azatioprina y la mercaptopurina; el alopurinol la inhibe y aumenta mucho su toxicidad. Si se combinan, la dosis de azatioprina se reduce a alrededor de un 25 % y se vigila estrechamente el hemograma.';
    v_j1 := $evfgi_json${"external_id":"fgi-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Tiopurinas y TPMT; metotrexato","outcome":"Tiopurinas y TPMT; metotrexato","source":"Ficha técnica de azatioprina."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que el alopurinol inhibe la xantina oxidasa y la dosis de azatioprina debe reducirse a un 25 % con control del hemograma.', TRUE, 'Correcto. Sin ajuste hay riesgo de mielotoxicidad grave.', 0),
      (v_pregunta, 'Que el alopurinol acelera la eliminación de la azatioprina y debe duplicarse su dosis.', FALSE, 'Ocurre lo contrario.', 1),
      (v_pregunta, 'Que no hay interacción, porque el alopurinol actúa solo sobre el ácido úrico de la sangre.', FALSE, 'Hay una interacción grave por la xantina oxidasa.', 2),
      (v_pregunta, 'Que debe suspender la azatioprina de forma definitiva mientras use el alopurinol.', FALSE, 'Se puede combinar con ajuste y vigilancia estrecha.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Antes de iniciar infliximab, ¿qué tamizajes debe verificar el QF que estén hechos?';
    v_t4 := 'Los anti-TNF (infliximab, adalimumab) aumentan el riesgo de infecciones, incluida la reactivación de la tuberculosis latente y de la hepatitis B. Antes de iniciar se tamizan ambas y se revisa el esquema de vacunación. También se vigilan las reacciones a la infusión y la inmunogenicidad.';
    v_j1 := $evfgi_json${"external_id":"fgi-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Anti-TNF (infliximab, adalimumab) y biosimilares","outcome":"Anti-TNF (infliximab, adalimumab) y biosimilares","source":"Fichas técnicas de infliximab y adalimumab."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo el embarazo, porque es la única contraindicación absoluta de los anti-TNF.', FALSE, 'Hay tamizajes infecciosos imprescindibles.', 0),
      (v_pregunta, 'Tuberculosis latente y hepatitis B, por el riesgo de reactivación con el anti-TNF.', TRUE, 'Correcto. También se revisa el esquema de vacunas.', 1),
      (v_pregunta, 'Solo la glucosa en ayunas, porque los anti-TNF producen diabetes en la mayoría de pacientes.', FALSE, 'No es el tamizaje principal.', 2),
      (v_pregunta, 'Ninguno, porque los anti-TNF no aumentan el riesgo de infecciones oportunistas.', FALSE, 'Sí aumentan el riesgo de infecciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con infliximab planea un viaje y quiere vacunarse contra la fiebre amarilla. ¿Cuál es la mejor orientación?';
    v_t4 := 'En pacientes con inmunosupresión por anti-TNF, tiopurinas o corticoides a dosis altas están contraindicadas las vacunas vivas (como la de fiebre amarilla). Las vacunas inactivadas se aplican según el esquema; lo ideal es completar las vivas antes de iniciar el tratamiento.';
    v_j1 := $evfgi_json${"external_id":"fgi-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Monitorización, vacunación y embarazo en pacientes con EII","outcome":"Monitorización, vacunación y embarazo en pacientes con EII","source":"Fichas técnicas de los anti-TNF; recomendaciones de vacunación en EII."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que se vacune sin problema, porque las vacunas no interactúan con los biológicos.', FALSE, 'Las vacunas vivas sí implican riesgo en inmunosuprimidos.', 0),
      (v_pregunta, 'Que se aplique la vacuna justo el día de la infusión para que ambos actúen al mismo tiempo.', FALSE, 'El momento no elimina el riesgo de una vacuna viva.', 1),
      (v_pregunta, 'Que suspenda el infliximab una semana, se vacune y lo reanude al volver del viaje.', FALSE, 'Una semana sin el fármaco no elimina la inmunosupresión.', 2),
      (v_pregunta, 'Que consulte: es una vacuna viva, contraindicada durante la inmunosupresión con anti-TNF.', TRUE, 'Correcto. La decisión es del especialista.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fgi-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Hígado y páncreas: cirrosis, hepatotoxicidad y enzimas pancreáticas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Hígado y páncreas: cirrosis, hepatotoxicidad y enzimas pancreáticas) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Hígado y páncreas: cirrosis, hepatotoxicidad y enzimas pancreáticas';
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


    v_t3 := '¿Qué parámetros combina la escala de Child-Pugh para clasificar la insuficiencia hepática?';
    v_t4 := 'La escala de Child-Pugh combina bilirrubina, albúmina, tiempo de protrombina o INR, ascitis y encefalopatía, y clasifica en A (5-6 puntos), B (7-9) y C (10-15). Las fichas técnicas usan esta clasificación para ajustar o contraindicar fármacos.';
    v_j1 := $evfgi_json${"external_id":"fgi-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Ajuste de dosis según Child-Pugh: procedimiento con ficha técnica","outcome":"Ajuste de dosis según Child-Pugh: procedimiento con ficha técnica","source":"Fichas técnicas; recomendaciones de ajuste en insuficiencia hepática."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Creatinina, potasio, sodio, glucosa y presión arterial del paciente en reposo.', FALSE, 'Esos parámetros no forman la escala.', 0),
      (v_pregunta, 'Transaminasas, fosfatasa alcalina, GGT y amilasa medidas en una sola muestra.', FALSE, 'La escala no usa las enzimas hepáticas.', 1),
      (v_pregunta, 'Edad, peso, talla, índice de masa corporal y consumo diario de alcohol.', FALSE, 'No son los componentes de la escala.', 2),
      (v_pregunta, 'Bilirrubina, albúmina, INR, ascitis y encefalopatía.', TRUE, 'Correcto. Clasifica en A, B y C.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un niño con fibrosis quística recibe enzimas pancreáticas en cápsulas. ¿Cómo deben tomarse?';
    v_t4 := 'La terapia de reemplazo con enzimas pancreáticas se toma con cada comida y merienda; la dosis se calcula en unidades de lipasa. Las microesferas no se mastican ni se trituran; las cápsulas pueden abrirse y mezclarse con un alimento blando ácido. A veces se usa un IBP como coadyuvante.';
    v_j1 := $evfgi_json${"external_id":"fgi-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Terapia de reemplazo con enzimas pancreáticas","outcome":"Terapia de reemplazo con enzimas pancreáticas","source":"Fichas técnicas de las enzimas pancreáticas."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Con las comidas y meriendas; las cápsulas pueden abrirse y mezclarse con un alimento blando ácido, sin masticar.', TRUE, 'Correcto. La dosis se calcula en unidades de lipasa.', 0),
      (v_pregunta, 'En ayunas, una hora antes de comer, para que actúen antes de que llegue la comida.', FALSE, 'Deben coincidir con la comida.', 1),
      (v_pregunta, 'Una vez al día en la noche, porque su efecto dura las 24 horas del día.', FALSE, 'Se toman con cada comida.', 2),
      (v_pregunta, 'Trituradas y disueltas en leche caliente para que se absorban mejor en el intestino.', FALSE, 'Triturar o calentar daña la cubierta y las enzimas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En un paciente con cirrosis y derivaciones portosistémicas, ¿qué ocurre con fármacos de alta extracción hepática como el propranolol oral?';
    v_t4 := 'En la cirrosis, la reducción del flujo hepático y las derivaciones portosistémicas hacen que los fármacos de alta extracción (propranolol, morfina, verapamilo, midazolam oral) pierdan el primer paso y aumente su biodisponibilidad; se usan dosis menores y se titula con cuidado.';
    v_j1 := $evfgi_json${"external_id":"fgi-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Cambios farmacocinéticos y farmacodinámicos en la cirrosis","outcome":"Cambios farmacocinéticos y farmacodinámicos en la cirrosis","source":"Farmacocinética en la cirrosis; fichas técnicas."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Su biodisponibilidad disminuye mucho porque el hígado los elimina más rápido.', FALSE, 'Ocurre lo contrario.', 0),
      (v_pregunta, 'Pierden parte del efecto de primer paso y su biodisponibilidad aumenta; se necesitan dosis menores.', TRUE, 'Correcto. Se titula con cuidado.', 1),
      (v_pregunta, 'No cambian, porque la cirrosis solo afecta a los fármacos de baja extracción hepática.', FALSE, 'Los de alta extracción son los más afectados por el flujo.', 2),
      (v_pregunta, 'Se eliminan por completo por el riñón y dejan de depender del hígado.', FALSE, 'No cambian así su vía de eliminación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una paciente con ictericia colestásica terminó amoxicilina-clavulánico hace tres semanas y toma un producto herbal. El médico descarta el antibiótico «porque ya lo terminó». ¿Cuál es la mejor valoración?';
    v_t4 := 'La lesión hepática por amoxicilina-clavulánico es idiosincrásica, suele ser colestásica o mixta y puede aparecer días o semanas después de terminar el tratamiento. Los productos herbales y suplementos también causan DILI. Se construye la línea de tiempo, se evalúa la causalidad (RUCAM/RECAM) y se reporta.';
    v_j1 := $evfgi_json${"external_id":"fgi-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso clínico: ictericia colestásica tras amoxicilina-clavulánico y un producto herbal","outcome":"Caso clínico: ictericia colestásica tras amoxicilina-clavulánico y un producto herbal","source":"Ficha técnica de amoxicilina-clavulánico; métodos RUCAM/RECAM."}$evfgi_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fgi-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: un medicamento ya suspendido no puede causar una lesión hepática después.', FALSE, 'La lesión por este antibiótico puede aparecer semanas después.', 0),
      (v_pregunta, 'Es correcta: la causa es siempre el producto herbal cuando el paciente toma uno.', FALSE, 'No se puede asumir sin evaluar la causalidad.', 1),
      (v_pregunta, 'Es errada: la lesión por amoxicilina-clavulánico puede aparecer semanas después; se evalúa la causalidad de ambos.', TRUE, 'Correcto. Se reporta al INVIMA.', 2),
      (v_pregunta, 'Es errada solo porque la amoxicilina-clavulánico produce siempre un patrón hepatocelular y no colestásico.', FALSE, 'Suele producir un patrón colestásico o mixto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fgi-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Secreción ácida gástrica y fármacos antisecretores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Secreción ácida gástrica y fármacos antisecretores) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Deprescripción de un IBP en un adulto mayor polimedicado';
  v_t2 := $evfgi_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Revisa si el omeprazol tiene una indicación vigente.</li><li>Analiza la interacción del omeprazol con el clopidogrel.</li><li>Relaciona la B12 baja y el magnesio con el IBP y con otros medicamentos de la fórmula.</li><li>Propone un plan de reducción o cambio (por ejemplo, a pantoprazol o a demanda) y el manejo del rebote.</li><li>Documenta los hallazgos como problemas relacionados con medicamentos.</li><li>Redacta la nota al médico.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Revisar la indicación de un IBP de uso prolongado.</li><li>Relacionar hallazgos clínicos con el uso prolongado del IBP y otros fármacos.</li><li>Proponer un plan de deprescripción documentado como problema relacionado con medicamentos.</li></ul>
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
  <tr><td>Indicación e interacción</td><td>25 %</td><td>Concluye que no hay indicación de dosis alta y detecta la interacción con clopidogrel por CYP2C19.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>B12 y magnesio</td><td>25 %</td><td>Relaciona la B12 con el IBP y la metformina, y el magnesio con el IBP.</td><td>Relaciona solo con un fármaco.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan de deprescripción</td><td>30 %</td><td>Plan gradual o cambio a un IBP con menos interacción si se requiere gastroprotección por el antiagregante, con manejo del rebote.</td><td>Plan sin manejo del rebote.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Documentación</td><td>10 %</td><td>Problemas documentados y nota clara.</td><td>Documentación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfgi_html$;
  v_t3 := $evfgi_html$<h2>Caso de estudio</h2>
<p>Don Gustavo tiene 79 años, está en un programa de atención domiciliaria en Bogotá y toma omeprazol 40 mg al día desde hace 6 años (datos simulados). No tiene antecedente de úlcera ni sangrado y su reflujo está controlado. También toma clopidogrel tras un stent hace 4 años, metformina y losartán. Tiene anemia macrocítica y hormigueo en los pies; su B12 está baja y su magnesio en el límite inferior.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfgi_html$;
  v_t4 := 'Informe de revisión con plan de deprescripción y nota al médico.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfgi_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (IBP, antiácidos, metoclopramida, domperidona, laxantes, loperamida, azatioprina, anti-TNF y enzimas pancreáticas); consenso de Maastricht VI/Florencia sobre Helicobacter pylori; comunicaciones de seguridad de la EMA sobre metoclopramida, domperidona e inhibidores JAK; alertas del INVIMA sobre la ranitidina; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfgi_html$;
  v_t7 := NULL;
  v_j1 := $evfgi_json$["Indicación del IBP.","Interacción con clopidogrel.","B12 y magnesio.","Plan de deprescripción.","Documentación y nota."]$evfgi_json$::jsonb;
  v_j2 := $evfgi_json${"version":1,"total":100,"criteria":[{"id":"indicacion-e-interaccion","name":"Indicación e interacción","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Concluye que no hay indicación de dosis alta y detecta la interacción con clopidogrel por CYP2C19."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"b12-y-magnesio","name":"B12 y magnesio","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Relaciona la B12 con el IBP y la metformina, y el magnesio con el IBP."},{"level":3,"label":"Logrado","description":"Relaciona solo con un fármaco."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-de-deprescripcion","name":"Plan de deprescripción","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Plan gradual o cambio a un IBP con menos interacción si se requiere gastroprotección por el antiagregante, con manejo del rebote."},{"level":3,"label":"Logrado","description":"Plan sin manejo del rebote."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"documentacion","name":"Documentación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Problemas documentados y nota clara."},{"level":3,"label":"Logrado","description":"Documentación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfgi_json$::jsonb;
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


  -- ── Actividad fgi-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. ERGE, úlcera péptica y erradicación de Helicobacter pylori' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. ERGE, úlcera péptica y erradicación de Helicobacter pylori) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Fracaso de la erradicación y plan de rescate';
  v_t2 := $evfgi_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Analiza las causas probables del fracaso (resistencia, duración, adherencia).</li><li>Describe el esquema de rescate que propone Maastricht VI en este contexto.</li><li>Identifica las interacciones de la domperidona y el citalopram con los antibióticos posibles (QT, CYP3A4).</li><li>Analiza el riesgo del alcohol con el metronidazol.</li><li>Diseña un plan de adherencia para 14 días (horarios, efectos esperados, señales de alarma).</li><li>Define cómo y cuándo se confirma la erradicación.</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Explicar las causas probables del fracaso.</li><li>Identificar interacciones del esquema de rescate con su fórmula.</li><li>Diseñar un plan de adherencia y seguimiento.</li></ul>
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
  <tr><td>Fracaso y rescate</td><td>30 %</td><td>Relaciona el fracaso con la resistencia a claritromicina y la duración corta, y describe un rescate coherente con Maastricht VI.</td><td>Explicación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones</td><td>30 %</td><td>Detecta el riesgo de QT de domperidona y citalopram, la contraindicación de domperidona con inhibidores del CYP3A4 y el alcohol con metronidazol.</td><td>Detecta dos interacciones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Adherencia y confirmación</td><td>30 %</td><td>Plan práctico de 14 días y prueba de confirmación en el momento adecuado.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfgi_html$;
  v_t3 := $evfgi_html$<h2>Caso de estudio</h2>
<p>Lucía tiene 45 años, vive en Pasto y tuvo una úlcera duodenal con H. pylori (datos simulados). Recibió triple terapia con omeprazol, amoxicilina y claritromicina por 7 días; la prueba de control sigue positiva. Además toma domperidona para las náuseas y citalopram por depresión, y bebe vino los fines de semana. El gastroenterólogo indicará un rescate y pide al servicio farmacéutico un plan.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfgi_html$;
  v_t4 := 'Plan de rescate con análisis de interacciones y adherencia.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfgi_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (IBP, antiácidos, metoclopramida, domperidona, laxantes, loperamida, azatioprina, anti-TNF y enzimas pancreáticas); consenso de Maastricht VI/Florencia sobre Helicobacter pylori; comunicaciones de seguridad de la EMA sobre metoclopramida, domperidona e inhibidores JAK; alertas del INVIMA sobre la ranitidina; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfgi_html$;
  v_t7 := NULL;
  v_j1 := $evfgi_json$["Causas del fracaso.","Esquema de rescate.","Interacciones.","Plan de adherencia.","Confirmación."]$evfgi_json$::jsonb;
  v_j2 := $evfgi_json${"version":1,"total":100,"criteria":[{"id":"fracaso-y-rescate","name":"Fracaso y rescate","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Relaciona el fracaso con la resistencia a claritromicina y la duración corta, y describe un rescate coherente con Maastricht VI."},{"level":3,"label":"Logrado","description":"Explicación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones","name":"Interacciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Detecta el riesgo de QT de domperidona y citalopram, la contraindicación de domperidona con inhibidores del CYP3A4 y el alcohol con metronidazol."},{"level":3,"label":"Logrado","description":"Detecta dos interacciones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"adherencia-y-confirmacion","name":"Adherencia y confirmación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Plan práctico de 14 días y prueba de confirmación en el momento adecuado."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfgi_json$::jsonb;
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


  -- ── Actividad fgi-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Enfermedad inflamatoria intestinal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Enfermedad inflamatoria intestinal) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Inicio de infliximab con azatioprina';
  v_t2 := $evfgi_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lista los tamizajes que deben estar hechos antes del infliximab y por qué.</li><li>Analiza la TPMT y la interacción de la azatioprina con el alopurinol.</li><li>Define la conducta con la vacuna de fiebre amarilla y el esquema de vacunas inactivadas.</li><li>Explica las consideraciones para la planeación del embarazo con estos fármacos.</li><li>Diseña la monitorización (hemograma, función hepática, niveles si hay pérdida de respuesta) y la farmacovigilancia.</li><li>Describe cómo apoyarías la gestión del acceso con la EPS.</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Verificar el tamizaje previo al biológico.</li><li>Identificar interacciones y contraindicaciones de la combinación.</li><li>Diseñar la educación, la monitorización y la gestión del acceso.</li></ul>
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
  <tr><td>Tamizaje y vacunas</td><td>25 %</td><td>Tuberculosis latente, hepatitis B, vacunas vivas antes de iniciar y contraindicadas después.</td><td>Tamizaje incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Azatioprina</td><td>30 %</td><td>TPMT antes de iniciar y reducción a cerca del 25 % con alopurinol, con hemograma estrecho.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Embarazo, monitorización y acceso</td><td>35 %</td><td>Orientación para planear el embarazo con el especialista, plan de monitorización y gestión del acceso.</td><td>Plan parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfgi_html$;
  v_t3 := $evfgi_html$<h2>Caso de estudio</h2>
<p>Andrés tiene 29 años, vive en Cali y tiene enfermedad de Crohn moderada a grave que no respondió a corticoides (datos simulados). El gastroenterólogo indica infliximab con azatioprina. Andrés trabaja en una finca, nunca le hicieron prueba de tuberculosis, no sabe si tiene la vacuna de hepatitis B y planea viajar a una zona donde exigen vacuna de fiebre amarilla. Toma alopurinol por gota y su pareja planea un embarazo.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfgi_html$;
  v_t4 := 'Plan de inicio del biológico con educación, monitorización y gestión.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfgi_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (IBP, antiácidos, metoclopramida, domperidona, laxantes, loperamida, azatioprina, anti-TNF y enzimas pancreáticas); consenso de Maastricht VI/Florencia sobre Helicobacter pylori; comunicaciones de seguridad de la EMA sobre metoclopramida, domperidona e inhibidores JAK; alertas del INVIMA sobre la ranitidina; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfgi_html$;
  v_t7 := NULL;
  v_j1 := $evfgi_json$["Tamizaje previo.","TPMT y alopurinol.","Vacunas.","Embarazo.","Monitorización y acceso."]$evfgi_json$::jsonb;
  v_j2 := $evfgi_json${"version":1,"total":100,"criteria":[{"id":"tamizaje-y-vacunas","name":"Tamizaje y vacunas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Tuberculosis latente, hepatitis B, vacunas vivas antes de iniciar y contraindicadas después."},{"level":3,"label":"Logrado","description":"Tamizaje incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"azatioprina","name":"Azatioprina","weight":30,"levels":[{"level":4,"label":"Destacado","description":"TPMT antes de iniciar y reducción a cerca del 25 % con alopurinol, con hemograma estrecho."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"embarazo-monitorizacion-y-acceso","name":"Embarazo, monitorización y acceso","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Orientación para planear el embarazo con el especialista, plan de monitorización y gestión del acceso."},{"level":3,"label":"Logrado","description":"Plan parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfgi_json$::jsonb;
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


  -- ── Actividad fgi-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Motilidad digestiva: antieméticos, procinéticos, laxantes, antidiarreicos, SII y probióticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Motilidad digestiva: antieméticos, procinéticos, laxantes, antidiarreicos, SII y probióticos) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: antisecretores, erradicación y motilidad en el programa';
  v_t2 := $evfgi_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y prioriza los problemas por riesgo.</li><li>Fase 1: diseña el protocolo de revisión y deprescripción de IBP con criterios de indicación.</li><li>Fase 2: propone el protocolo de erradicación de H. pylori según Maastricht VI y la resistencia local, con apoyo a la adherencia.</li><li>Fase 3: define las reglas de dispensación de metoclopramida, domperidona, loperamida y laxantes.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (antisecretores).</strong> Programa de revisión y deprescripción de IBP.</li>
  <li><strong>Fase 2 · Unidad 2 (H. pylori).</strong> Protocolo de erradicación según la resistencia local y apoyo a la adherencia.</li>
  <li><strong>Fase 3 · Unidad 3 (motilidad).</strong> Dispensación segura de procinéticos, laxantes y antidiarreicos.</li>
  <li><strong>Fase 4 · Unidad 4 (EII).</strong> Lista de verificación para el inicio de biológicos e inmunomoduladores.</li>
  <li><strong>Fase 5 · Unidad 5 (hígado y páncreas).</strong> Ajuste en insuficiencia hepática, farmacovigilancia de DILI e indicadores.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar intervenciones para el uso de IBP, la erradicación y los procinéticos.</li><li>Justificar cada intervención con la evidencia y las fichas técnicas.</li></ul>
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
  <tr><td>IBP</td><td>30 %</td><td>Criterios de indicación, reducción gradual o a demanda y manejo del rebote.</td><td>Protocolo sin criterios.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Erradicación</td><td>30 %</td><td>Cuádruple con bismuto por 14 días como primera línea con la resistencia local, adherencia y confirmación.</td><td>Protocolo incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Motilidad</td><td>30 %</td><td>Reglas de duración y dosis de metoclopramida y domperidona, interacciones y restricciones en niños.</td><td>Reglas generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfgi_html$;
  v_t3 := $evfgi_html$<h2>Caso de estudio</h2>
<p>Eres el QF del servicio farmacéutico de una IPS de gastroenterología en Bucaramanga (datos simulados). Encuentras: IBP sin indicación en la mitad de los pacientes crónicos; triple terapia con claritromicina como primera línea pese a la resistencia local; domperidona y metoclopramida dispensadas por meses; pacientes con EII que inician biológicos sin tamizaje documentado; y casos de daño hepático en los que nadie preguntó por productos herbales. La dirección te pide un programa de uso seguro de medicamentos digestivos. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfgi_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfgi_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (IBP, antiácidos, metoclopramida, domperidona, laxantes, loperamida, azatioprina, anti-TNF y enzimas pancreáticas); consenso de Maastricht VI/Florencia sobre Helicobacter pylori; comunicaciones de seguridad de la EMA sobre metoclopramida, domperidona e inhibidores JAK; alertas del INVIMA sobre la ranitidina; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfgi_html$;
  v_t7 := NULL;
  v_j1 := $evfgi_json$["Priorización.","Deprescripción de IBP.","Erradicación.","Procinéticos y motilidad."]$evfgi_json$::jsonb;
  v_j2 := $evfgi_json${"version":1,"total":100,"criteria":[{"id":"ibp","name":"IBP","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Criterios de indicación, reducción gradual o a demanda y manejo del rebote."},{"level":3,"label":"Logrado","description":"Protocolo sin criterios."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"erradicacion","name":"Erradicación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cuádruple con bismuto por 14 días como primera línea con la resistencia local, adherencia y confirmación."},{"level":3,"label":"Logrado","description":"Protocolo incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"motilidad","name":"Motilidad","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Reglas de duración y dosis de metoclopramida y domperidona, interacciones y restricciones en niños."},{"level":3,"label":"Logrado","description":"Reglas generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfgi_json$::jsonb;
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


  -- ── Actividad fgi-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Hígado y páncreas: cirrosis, hepatotoxicidad y enzimas pancreáticas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Hígado y páncreas: cirrosis, hepatotoxicidad y enzimas pancreáticas) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: programa integral de uso seguro de medicamentos digestivos';
  v_t2 := $evfgi_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: diseña la lista de verificación para iniciar biológicos e inmunomoduladores (tamizaje, TPMT, vacunas, embarazo).</li><li>Fase 5: diseña el procedimiento de ajuste por Child-Pugh con la ficha técnica y el de sospecha de DILI con preguntas sobre productos herbales.</li><li>Fase 5: define indicadores del programa y su farmacovigilancia.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el programa en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (antisecretores).</strong> Programa de revisión y deprescripción de IBP.</li>
  <li><strong>Fase 2 · Unidad 2 (H. pylori).</strong> Protocolo de erradicación según la resistencia local y apoyo a la adherencia.</li>
  <li><strong>Fase 3 · Unidad 3 (motilidad).</strong> Dispensación segura de procinéticos, laxantes y antidiarreicos.</li>
  <li><strong>Fase 4 · Unidad 4 (EII).</strong> Lista de verificación para el inicio de biológicos e inmunomoduladores.</li>
  <li><strong>Fase 5 · Unidad 5 (hígado y páncreas).</strong> Ajuste en insuficiencia hepática, farmacovigilancia de DILI e indicadores.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar la lista de verificación para biológicos en EII.</li><li>Definir el ajuste en insuficiencia hepática, la farmacovigilancia de DILI y los indicadores.</li></ul>
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
  <tr><td>EII</td><td>25 %</td><td>Lista con tuberculosis, hepatitis B, TPMT, vacunas vivas, embarazo e interacciones.</td><td>Lista incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Hígado</td><td>25 %</td><td>Ajuste con Child-Pugh y la ficha técnica, y procedimiento de DILI con línea de tiempo, causalidad y reporte.</td><td>Procedimiento parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores y farmacovigilancia</td><td>25 %</td><td>Indicadores medibles con metas y reporte al INVIMA.</td><td>Indicadores sin metas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfgi_html$;
  v_t3 := $evfgi_html$<h2>Caso de estudio</h2>
<p>Eres el QF del servicio farmacéutico de una IPS de gastroenterología en Bucaramanga (datos simulados). Encuentras: IBP sin indicación en la mitad de los pacientes crónicos; triple terapia con claritromicina como primera línea pese a la resistencia local; domperidona y metoclopramida dispensadas por meses; pacientes con EII que inician biológicos sin tamizaje documentado; y casos de daño hepático en los que nadie preguntó por productos herbales. La dirección te pide un programa de uso seguro de medicamentos digestivos. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el programa que presentarás a la dirección.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfgi_html$;
  v_t4 := 'Programa integral con indicadores y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfgi_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (IBP, antiácidos, metoclopramida, domperidona, laxantes, loperamida, azatioprina, anti-TNF y enzimas pancreáticas); consenso de Maastricht VI/Florencia sobre Helicobacter pylori; comunicaciones de seguridad de la EMA sobre metoclopramida, domperidona e inhibidores JAK; alertas del INVIMA sobre la ranitidina; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfgi_html$;
  v_t7 := NULL;
  v_j1 := $evfgi_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Biológicos en EII.","Insuficiencia hepática y DILI.","Indicadores y farmacovigilancia.","Resumen ejecutivo."]$evfgi_json$::jsonb;
  v_j2 := $evfgi_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"eii","name":"EII","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Lista con tuberculosis, hepatitis B, TPMT, vacunas vivas, embarazo e interacciones."},{"level":3,"label":"Logrado","description":"Lista incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"higado","name":"Hígado","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Ajuste con Child-Pugh y la ficha técnica, y procedimiento de DILI con línea de tiempo, causalidad y reporte."},{"level":3,"label":"Logrado","description":"Procedimiento parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores-y-farmacovigilancia","name":"Indicadores y farmacovigilancia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Indicadores medibles con metas y reporte al INVIMA."},{"level":3,"label":"Logrado","description":"Indicadores sin metas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfgi_json$::jsonb;
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


  -- ── Foro fgi-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con medicamentos digestivos';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfgi_html$<h2>Para empezar</h2>
<p>Piensa en una situación con un antiácido, un IBP, un procinético o un laxante que te haya generado dudas y cuéntala en tres o cuatro líneas, sin nombres ni datos que identifiquen a nadie.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfgi_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre medicamentos digestivos te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfgi_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfgi_html$;
  v_t6 := $evfgi_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfgi_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué medicamento digestivo te piden más sin fórmula?', '¿Has visto a pacientes que toman un IBP por años sin saber por qué?']::text[];
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


  -- ── Foro fgi-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Secreción ácida gástrica y fármacos antisecretores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Secreción ácida gástrica y fármacos antisecretores) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · IBP para todos';
  v_t2 := 'Argumentar cuándo un IBP está indicado y cómo reducir su uso innecesario.';
  v_t3 := $evfgi_html$<h2>Caso del foro</h2>
<p>En una IPS, el 40 % de los pacientes hospitalizados recibe un IBP «de protección» y la mayoría sale con él en la fórmula de alta sin fecha de revisión (datos simulados). En consulta externa, muchos adultos mayores lo toman desde hace años sin saber por qué.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfgi_html$;
  v_t4 := '¿Cómo distinguirías el uso indicado del no indicado y qué estrategia propondrías al comité de farmacia?';
  v_t5 := $evfgi_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica, la guía o el estudio que sustenta tu postura. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfgi_html$;
  v_t6 := $evfgi_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica, la guía o el estudio que sustenta tu postura.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfgi_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué situaciones sí justifican la gastroprotección?', '¿Qué riesgos se asocian al uso prolongado y cuál es su nivel de evidencia?', '¿Cómo se maneja el rebote ácido al retirarlo?']::text[];
  v_j1 := $evfgi_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica, la guía o el estudio que sustenta tu postura."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfgi_json$::jsonb;
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


  -- ── Foro fgi-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. ERGE, úlcera péptica y erradicación de Helicobacter pylori' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. ERGE, úlcera péptica y erradicación de Helicobacter pylori) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Erradicación en un país con alta resistencia';
  v_t2 := 'Argumentar cómo elegir y apoyar el esquema de erradicación de H. pylori con los datos locales de resistencia.';
  v_t3 := $evfgi_html$<h2>Caso del foro</h2>
<p>Una EPS sigue entregando como primera línea la triple terapia con claritromicina por 7 días (datos simulados). En el servicio farmacéutico aparecen pacientes con fracaso, otros que abandonan por los efectos digestivos y algunos que no consiguen el bismuto.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfgi_html$;
  v_t4 := '¿Qué propondrías al comité para mejorar la erradicación y qué haría el servicio farmacéutico con cada paciente?';
  v_t5 := $evfgi_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el consenso o el dato de resistencia que sustenta tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfgi_html$;
  v_t6 := $evfgi_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el consenso o el dato de resistencia que sustenta tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfgi_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dice Maastricht VI sobre la primera línea con resistencia alta a la claritromicina?', '¿Qué papel tienen los P-CAB como el vonoprazán?', '¿Cómo se mejora la adherencia a esquemas de 14 días con muchas tabletas?']::text[];
  v_j1 := $evfgi_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el consenso o el dato de resistencia que sustenta tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfgi_json$::jsonb;
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


  -- ── Foro fgi-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Motilidad digestiva: antieméticos, procinéticos, laxantes, antidiarreicos, SII y probióticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Motilidad digestiva: antieméticos, procinéticos, laxantes, antidiarreicos, SII y probióticos) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Domperidona y metoclopramida en el mostrador';
  v_t2 := 'Argumentar cómo dispensar procinéticos con seguridad tras las restricciones de las agencias.';
  v_t3 := $evfgi_html$<h2>Caso del foro</h2>
<p>Una cadena de droguerías vende domperidona y metoclopramida casi como productos de venta libre (datos simulados). Hay clientes que las usan por meses «para la llenura», madres que las piden para bebés y adultos mayores que toman además macrólidos o antidepresivos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfgi_html$;
  v_t4 := '¿Qué protocolo propondrías para dispensarlas y qué preguntarías siempre?';
  v_t5 := $evfgi_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la comunicación de seguridad o la ficha técnica que sustenta cada punto. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfgi_html$;
  v_t6 := $evfgi_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la comunicación de seguridad o la ficha técnica que sustenta cada punto.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfgi_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué restricciones de duración y dosis tienen hoy ambos medicamentos?', '¿Qué interacciones aumentan el riesgo cardíaco de la domperidona?', '¿Qué alternativas hay para la dispepsia funcional y para el vómito en niños?']::text[];
  v_j1 := $evfgi_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la comunicación de seguridad o la ficha técnica que sustenta cada punto."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfgi_json$::jsonb;
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


  -- ── Foro fgi-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Enfermedad inflamatoria intestinal' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Enfermedad inflamatoria intestinal) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Biosimilares en enfermedad inflamatoria intestinal';
  v_t2 := 'Argumentar cómo gestionar el cambio a un biosimilar con seguridad y confianza del paciente.';
  v_t3 := $evfgi_html$<h2>Caso del foro</h2>
<p>Una EPS anuncia que cambiará el infliximab de referencia por un biosimilar en todos los pacientes con EII (datos simulados). Algunos pacientes temen perder el control de su enfermedad, un gastroenterólogo pide mantener a los pacientes estables y el comité de farmacia quiere el ahorro.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfgi_html$;
  v_t4 := '¿Qué condiciones propondrías para que el cambio sea seguro y aceptado?';
  v_t5 := $evfgi_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma, la ficha técnica o el estudio que sustenta tus condiciones. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfgi_html$;
  v_t6 := $evfgi_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma, la ficha técnica o el estudio que sustenta tus condiciones.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfgi_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué es un biosimilar y qué demuestra su aprobación?', '¿Qué papel tienen la inmunogenicidad y los niveles del fármaco?', '¿Cómo se haría la farmacovigilancia del cambio?']::text[];
  v_j1 := $evfgi_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma, la ficha técnica o el estudio que sustenta tus condiciones."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfgi_json$::jsonb;
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


  -- ── Foro fgi-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Hígado y páncreas: cirrosis, hepatotoxicidad y enzimas pancreáticas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Hígado y páncreas: cirrosis, hepatotoxicidad y enzimas pancreáticas) en Farmacología Gastrointestinal: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Productos herbales y el hígado';
  v_t2 := 'Argumentar cómo abordar los productos herbales y suplementos en la sospecha de daño hepático.';
  v_t3 := $evfgi_html$<h2>Caso del foro</h2>
<p>En un mes, un servicio de hepatología recibe tres pacientes con hepatitis aguda (datos simulados): uno tomaba un «quemador de grasa», otra un té «para desintoxicar el hígado» y otro un suplemento para el gimnasio. Ninguno lo mencionó en la consulta inicial porque «es natural».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfgi_html$;
  v_t4 := '¿Cómo debería preguntar el servicio farmacéutico por estos productos y qué haría con cada caso?';
  v_t5 := $evfgi_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el método de causalidad o la norma que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfgi_html$;
  v_t6 := $evfgi_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el método de causalidad o la norma que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfgi_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué productos herbales y suplementos se asocian con daño hepático?', '¿Qué información se necesita para evaluar la causalidad?', '¿Dónde y cómo se reportan estos casos?']::text[];
  v_j1 := $evfgi_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el método de causalidad o la norma que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfgi_json$::jsonb;
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


  RAISE NOTICE 'Farmacología Gastrointestinal: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfgi$;

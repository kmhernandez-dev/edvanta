-- ============================================================
--  080_quices_actividades_foros_bases.sql — quizzes, actividades y foros, lote «bases»
--
--  Generado por scripts/evaluacion-aula.mjs bases migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Central de Mezclas; Asuntos Regulatorios ante INVIMA; Validaciones y Calificaciones.
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
--  Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad
--  3 quizzes · 5 actividades · 4 foros
-- ════════════════════════════════════════════════════════════════
DO $evcmez$
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
   WHERE kind = 'edvanta' AND title = 'Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Por qué lo estéril es distinto', 'Áreas limpias y técnica aséptica', 'Gestión de la calidad en la central']::text[])) < 3 THEN
    RAISE NOTICE 'Central de Mezclas: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evcmez_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evcmez_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz cmez-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Por qué lo estéril es distinto' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Por qué lo estéril es distinto) en Central de Mezclas.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Por qué lo estéril es distinto';
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
       FALSE, FALSE, TRUE, 'publicado', 1, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 1, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Por qué una preparación estéril para uso intravenoso exige controles más estrictos que una preparación oral no estéril?';
    v_t4 := 'La vía parenteral elimina las barreras del organismo. Por eso un error de esterilidad o de contaminación por partículas o endotoxinas no tiene margen y la central trabaja con áreas, controles y personal calificados.';
    v_j1 := $evcmez_json${"external_id":"cmez-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"El riesgo que se está conteniendo","outcome":"El riesgo que se está conteniendo","source":"Capítulo 797 de la USP, introducción y alcance; Resolución 1403 de 2007."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque entra directo al torrente sanguíneo, sin las barreras del cuerpo que frenan microorganismos, endotoxinas y partículas.', TRUE, 'Correcto. Ese es el riesgo que la central contiene: no hay piel, mucosa ni ácido gástrico que frenen la contaminación.', 0),
      (v_pregunta, 'Porque los medicamentos intravenosos tienen siempre concentraciones más altas que los orales y eso los vuelve inestables y difíciles de controlar.', FALSE, 'La concentración no define la exigencia. Un intravenoso diluido es tan crítico como uno concentrado si se contamina.', 1),
      (v_pregunta, 'Porque las preparaciones intravenosas solo se usan en pacientes de cuidado intensivo, que son los únicos inmunosuprimidos.', FALSE, 'También se administran en hospitalización general y en casa. El riesgo viene de la vía, no del servicio.', 2),
      (v_pregunta, 'Porque la norma colombiana exige registro sanitario para toda preparación intravenosa elaborada en una central.', FALSE, 'Las preparaciones de la central no llevan registro sanitario; la exigencia viene del riesgo de la vía parenteral.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una clínica sin sala limpia prepara jeringas de antibiótico en una cabina de flujo laminar ISO 5 ubicada en un área segregada. Enfermería pide guardarlas 72 horas en nevera. Según la revisión vigente del capítulo 797 de la USP, ¿qué fecha límite de uso máxima corresponde?';
    v_t4 := 'La revisión de 2023 del capítulo 797 reemplazó los niveles de riesgo por categorías. La categoría 1 se prepara en un área segregada y admite como máximo 12 horas a temperatura ambiente o 24 horas refrigerada.';
    v_j1 := $evcmez_json${"external_id":"cmez-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Niveles de riesgo de una preparación","outcome":"Niveles de riesgo de una preparación","source":"Capítulo 797 de la USP (2023), categorías de preparación y fechas límite de uso."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, '72 horas en refrigeración, porque la nevera conserva la esterilidad mientras el empaque esté cerrado.', FALSE, 'La nevera retarda el crecimiento, pero no compensa la falta de sala limpia. El área segregada limita la preparación a la categoría 1.', 0),
      (v_pregunta, '10 días en refrigeración, porque la jeringa se preparó a partir de componentes estériles.', FALSE, 'Esos 10 días aplican a la categoría 2, que exige preparar dentro de una sala limpia. Aquí no la hay.', 1),
      (v_pregunta, '24 horas en refrigeración o 12 horas a temperatura ambiente, porque es una preparación de categoría 1.', TRUE, 'Correcto. En un área segregada solo se elaboran preparaciones de categoría 1, con esos límites.', 2),
      (v_pregunta, '4 horas desde el inicio de la preparación, porque toda preparación hecha fuera de la central es de uso inmediato.', FALSE, 'El uso inmediato es otra figura, para administrar sin almacenar. Aquí se prepara en una cabina y se quiere almacenar.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En una auditoría interna, el químico farmacéutico encuentra un procedimiento que cita solo el capítulo 797 de la USP y ninguna norma colombiana. ¿Qué análisis es correcto sobre la relación entre ambas referencias?';
    v_t4 := 'La obligación legal en Colombia viene de la Resolución 1403 de 2007 (y del Decreto 2200 de 2005 que desarrolla). El capítulo 797 de la USP es la referencia internacional que ordena la práctica y ayuda a sustentar decisiones técnicas.';
    v_j1 := $evcmez_json${"external_id":"cmez-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Normativa aplicable","outcome":"Normativa aplicable","source":"Resolución 1403 de 2007; capítulo 797 de la USP."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La USP reemplaza a la norma colombiana porque es más reciente y más detallada, así que el procedimiento está completo y no necesita otra cita.', FALSE, 'La USP no es obligatoria en Colombia. Su actualización no deroga ni reemplaza la norma nacional.', 0),
      (v_pregunta, 'Son incompatibles: si el procedimiento cita la USP, debe eliminarla y dejar solo la Resolución 1403 de 2007.', FALSE, 'No son excluyentes. La USP sirve de soporte técnico donde la norma colombiana es menos específica.', 1),
      (v_pregunta, 'La norma colombiana solo aplica a preparaciones no estériles; para lo estéril la referencia obligatoria es la USP.', FALSE, 'La Resolución 1403 de 2007 sí regula las preparaciones estériles de la central de mezclas en Colombia.', 2),
      (v_pregunta, 'Es obligatoria la Resolución 1403 de 2007; la USP es una referencia técnica que la complementa, y el procedimiento debe citar las dos.', TRUE, 'Correcto. Se cumple la norma nacional y se usa la USP para precisar lo técnico, sin presentarla como obligatoria.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para ahorrar tiempo, la jefe de enfermería propone preparar a las 7:00 todas las diluciones de antibiótico del turno en la estación de enfermería y administrarlas hasta las 18:00. ¿Cuál es la valoración más sólida de la propuesta?';
    v_t4 := 'El uso inmediato es una excepción para situaciones en que no hay tiempo de ir a la central: se administra pronto y no se almacena. Preparar para todo el turno es almacenar sin área ni controles.';
    v_j1 := $evcmez_json${"external_id":"cmez-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"El riesgo que se está conteniendo","outcome":"El riesgo que se está conteniendo","source":"Capítulo 797 de la USP (2023), preparaciones de uso inmediato."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es aceptable si las jeringas se rotulan con la hora de preparación y se guardan en la nevera de la estación hasta la hora de cada dosis.', FALSE, 'Rotular y refrigerar no convierte una preparación sin área controlada en una almacenable por once horas.', 0),
      (v_pregunta, 'No es aceptable: el uso inmediato exige empezar a administrar en las 4 horas siguientes; para almacenar se prepara en la central.', TRUE, 'Correcto. La propuesta convierte el uso inmediato en almacenamiento sin las condiciones que este exige: área, controles y fecha límite de uso.', 1),
      (v_pregunta, 'Es aceptable porque enfermería conoce la técnica aséptica y los antibióticos diluidos se consideran preparaciones de bajo riesgo.', FALSE, 'La técnica individual no reemplaza el área y los controles, y el antibiótico contaminado no es de bajo riesgo para el paciente.', 2),
      (v_pregunta, 'No es aceptable solo porque los antibióticos deben prepararse siempre en una cabina de seguridad biológica clase II.', FALSE, 'Los antibióticos no peligrosos no exigen cabina de seguridad biológica. El problema es el tiempo y el lugar.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz cmez-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Áreas limpias y técnica aséptica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Áreas limpias y técnica aséptica) en Central de Mezclas.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Áreas limpias y técnica aséptica';
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
       FALSE, FALSE, TRUE, 'publicado', 2, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 2, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Por qué en una central de mezclas se trabaja en un ambiente ISO 5 dentro de una sala ISO 7, y no al revés?';
    v_t4 := 'El diseño del aire es por capas: la cabina entrega aire HEPA unidireccional ISO 5 sobre el sitio crítico; la sala de amortiguamiento ISO 7 y la antesala reducen la carga y, con presiones diferenciales, evitan que entre aire sucio.';
    v_j1 := $evcmez_json${"external_id":"cmez-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Clasificación de áreas limpias","outcome":"Clasificación de áreas limpias","source":"ISO 14644-1; capítulo 797 de la USP (2023), instalaciones."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque la sala ISO 7 filtra el aire de la cabina y así la cabina no necesita un filtro HEPA propio sobre la zona de trabajo.', FALSE, 'La cabina sí tiene filtro HEPA propio: es la que entrega el aire de primera pasada sobre el sitio crítico.', 0),
      (v_pregunta, 'Porque el sitio crítico necesita el aire más limpio y la sala que lo rodea reduce la carga de partículas que llega a la cabina.', TRUE, 'Correcto. El diseño protege el sitio crítico con capas: la cabina ISO 5, donde se abre el vial y se manipula, y una sala ISO 7 que la rodea.', 1),
      (v_pregunta, 'Porque la norma prohíbe, por razones de costo y de consumo de energía, que una sala completa se diseñe como ISO 5.', FALSE, 'No es una prohibición por costo. La clasificación responde a dónde está el riesgo de contaminación.', 2),
      (v_pregunta, 'Porque así el aire de la cabina sale hacia la sala y la mantiene en ISO 7 sin necesidad de presiones diferenciales.', FALSE, 'Las presiones diferenciales siguen siendo necesarias para que el aire fluya de lo más limpio a lo menos limpio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'La sala de amortiguamiento de una central se diseñó ISO 7. En la recertificación, el conteo de partículas de 0,5 µm o más es de 410.000 por metro cúbico. ¿Qué conclusión es correcta?';
    v_t4 := 'El límite de la clase ISO 7 para partículas de 0,5 µm o más es 352.000 por metro cúbico (ISO 8: 3.520.000; ISO 5: 3.520). Una sala fuera de su clase de diseño no puede seguir funcionando como si cumpliera.';
    v_j1 := $evcmez_json${"external_id":"cmez-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Clasificación de áreas limpias","outcome":"Clasificación de áreas limpias","source":"ISO 14644-1:2015, tabla de clases; capítulo 797 de la USP, certificación."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Cumple, porque el resultado está muy por debajo del límite de la clase ISO 8, que es la siguiente en la escala.', FALSE, 'La sala se diseñó y se usa como ISO 7; compararla con ISO 8 es bajar el criterio después del resultado.', 0),
      (v_pregunta, 'Cumple, porque el conteo de partículas es solo informativo y lo que define la clase de una sala es la microbiología.', FALSE, 'El conteo de partículas es un criterio de clasificación, no solo informativo.', 1),
      (v_pregunta, 'No se puede concluir nada hasta repetir la medición en la próxima recertificación, dentro de seis meses.', FALSE, 'Esperar seis meses deja la sala operando fuera de clase. Se investiga y se corrige de inmediato.', 2),
      (v_pregunta, 'No cumple: supera el límite ISO 7 (352.000 por metro cúbico); se investiga, se corrige y se recertifica antes de seguir.', TRUE, 'Correcto. El resultado está fuera de la clase de diseño: no se elaboran preparaciones de categoría 2 hasta corregir y recertificar.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hospital tiene una cabina de flujo laminar horizontal y una cabina de seguridad biológica clase II dentro de una sala de presión negativa. Hoy debe preparar una nutrición parenteral, una jeringa de vancomicina y una infusión de metotrexato. ¿Qué distribución es correcta?';
    v_t4 := 'La cabina horizontal protege el producto y dirige el aire hacia el operador: sirve para lo no peligroso. La cabina de seguridad biológica clase II, en una sala de presión negativa, protege también a quien prepara y es la indicada para los citostáticos.';
    v_j1 := $evcmez_json${"external_id":"cmez-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Cabinas de seguridad y flujo laminar","outcome":"Cabinas de seguridad y flujo laminar","source":"Capítulo 800 de la USP, controles de ingeniería; capítulo 797 de la USP."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El metotrexato en la cabina de seguridad biológica; la nutrición y la vancomicina en la cabina de flujo laminar.', TRUE, 'Correcto. El peligroso va donde el aire protege a quien prepara; lo no peligroso, donde el flujo protege la preparación.', 0),
      (v_pregunta, 'Las tres en la cabina de flujo laminar horizontal, porque es la que entrega el aire más limpio y unidireccional sobre la preparación.', FALSE, 'El flujo horizontal sopla hacia el operador: con un citostático lo expone directamente.', 1),
      (v_pregunta, 'El metotrexato en la cabina horizontal con doble guante, y las otras dos en la cabina de seguridad biológica.', FALSE, 'El doble guante no compensa un flujo que sale hacia la cara del operador.', 2),
      (v_pregunta, 'Las tres en la cabina de seguridad biológica, porque es la única que protege al producto, al operador y al ambiente.', FALSE, 'Usar la cabina de peligrosos para todo expone las preparaciones no peligrosas a contaminación cruzada con el citostático.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'El llenado con medio de cultivo (media fill) de un técnico sale turbio durante la incubación. El jefe de la central decide repetir la prueba el próximo semestre y dejar al técnico trabajando mientras tanto. ¿Cuál es la valoración más acertada?';
    v_t4 := 'El media fill demuestra que una persona puede manipular sin contaminar. Si falla, la persona deja de elaborar hasta requalificarse, se investiga la causa y se evalúa el impacto sobre lo preparado desde la última prueba aprobada.';
    v_j1 := $evcmez_json${"external_id":"cmez-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Técnica aséptica y su validación","outcome":"Técnica aséptica y su validación","source":"Capítulo 797 de la USP (2023), calificación del personal; guía de la FDA sobre procesamiento aséptico."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada, porque un solo resultado positivo puede deberse a contaminación del medio de cultivo durante la incubación y no a la técnica.', FALSE, 'Esa hipótesis se investiga, pero mientras tanto el resultado obliga a actuar como si la técnica hubiera fallado.', 0),
      (v_pregunta, 'Es adecuada si mientras tanto el técnico solo prepara antibióticos, que tienen menos riesgo que las nutriciones parenterales.', FALSE, 'No hay preparación estéril de bajo riesgo para quien la recibe contaminada.', 1),
      (v_pregunta, 'Es inadecuada: el técnico no prepara hasta reentrenarse y aprobar de nuevo, y se evalúa lo que elaboró desde su última prueba aprobada.', TRUE, 'Correcto. Un media fill fallido suspende la autorización para elaborar, obliga a investigar la causa y abre una evaluación de impacto.', 2),
      (v_pregunta, 'Es inadecuada solo porque la repetición de la prueba debe hacerse en tres meses y no en seis, según la categoría.', FALSE, 'El problema no es el plazo de repetición: el técnico sigue preparando con una técnica no demostrada.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz cmez-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Gestión de la calidad en la central' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Gestión de la calidad en la central) en Central de Mezclas.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Gestión de la calidad en la central';
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
       FALSE, FALSE, TRUE, 'publicado', 3, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 3, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Cuál es el propósito principal del monitoreo ambiental y de personal en una central de mezclas?';
    v_t4 := 'Los resultados de partículas, microbiología de aire y superficies y huellas de guantes muestran si el estado de control se mantiene. Su valor está en analizarlos, ver tendencias y actuar.';
    v_j1 := $evcmez_json${"external_id":"cmez-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Controles ambientales y de personal","outcome":"Controles ambientales y de personal","source":"Capítulo 797 de la USP (2023), monitoreo ambiental; Anexo 1 de las BPM de la UE (2022)."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Cumplir un requisito documental que el inspector del Invima revisa en cada visita de certificación de la central.', FALSE, 'Si se ve como trámite, se pierde su valor: los resultados deben analizarse y generar acciones.', 0),
      (v_pregunta, 'Demostrar que cada preparación final es estéril, de modo que no se necesitan otros controles de calidad.', FALSE, 'El monitoreo no prueba la esterilidad de cada preparación; muestra el estado del ambiente y del personal.', 1),
      (v_pregunta, 'Reemplazar la certificación semestral de las áreas, que deja de ser necesaria si el monitoreo sale bien.', FALSE, 'La certificación y el monitoreo se complementan; uno no reemplaza al otro.', 2),
      (v_pregunta, 'Aportar evidencia continua de que áreas y personas siguen bajo control, y detectar tendencias antes de una falla.', TRUE, 'Correcto. El monitoreo es la evidencia de que las áreas y las personas siguen comportándose como cuando se calificaron.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Se prepara una jeringa de cefazolina en una sala limpia (categoría 2), con técnica aséptica, a partir de componentes estériles y sin prueba de esterilidad. La literatura muestra estabilidad química de 30 días refrigerada. ¿Qué fecha límite de uso se asigna en refrigeración?';
    v_t4 := 'La fecha límite de uso es la menor entre el límite por esterilidad de la categoría y el límite por estabilidad. En categoría 2, con técnica aséptica, componentes estériles y sin prueba de esterilidad, el límite en refrigeración es de 10 días.';
    v_j1 := $evcmez_json${"external_id":"cmez-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Estabilidad, trazabilidad y documentación","outcome":"Estabilidad, trazabilidad y documentación","source":"Capítulo 797 de la USP (2023), fechas límite de uso de la categoría 2."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, '30 días, porque la estabilidad química publicada es el dato más específico disponible para esa mezcla.', FALSE, 'La estabilidad química es solo uno de los dos límites; el de esterilidad es más corto.', 0),
      (v_pregunta, '10 días: es el límite de esterilidad de la categoría 2 en nevera y es menor que la estabilidad química.', TRUE, 'Correcto. Se asigna el menor de los dos límites: esterilidad y estabilidad.', 1),
      (v_pregunta, '24 horas, porque toda preparación sin prueba de esterilidad se clasifica en la categoría 1, sin importar el área donde se elaboró.', FALSE, 'La categoría depende de dónde y cómo se prepara; en sala limpia puede ser categoría 2 sin prueba de esterilidad.', 2),
      (v_pregunta, '45 días, porque la refrigeración prolonga el límite de esterilidad de la categoría 2 hasta ese plazo.', FALSE, '45 días corresponde a congelación en esa tabla, no a refrigeración.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un neonato presenta una bacteriemia horas después de recibir una nutrición parenteral de la central. Para analizar si la preparación pudo ser la causa, ¿qué conjunto de evidencias es el más útil?';
    v_t4 := 'Cada preparación debe poder reconstruirse: componentes y lotes, persona que preparó y verificó, hora, área y su monitoreo, competencia vigente del operador, condiciones de almacenamiento y transporte. Sin eso no se puede investigar.';
    v_j1 := $evcmez_json${"external_id":"cmez-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Estabilidad, trazabilidad y documentación","outcome":"Estabilidad, trazabilidad y documentación","source":"Resolución 1403 de 2007, documentación y registros; capítulo 797 de la USP, registros."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La orden médica y la etiqueta de la bolsa, porque muestran qué se prescribió, qué se entregó y a qué hora llegó al servicio.', FALSE, 'Ayudan, pero no permiten reconstruir cómo se preparó ni en qué condiciones.', 0),
      (v_pregunta, 'El resultado del último media fill de la central y su certificación vigente, porque resumen la calidad de todas las preparaciones del periodo.', FALSE, 'Son piezas útiles, pero no reemplazan la reconstrucción de esta preparación concreta.', 1),
      (v_pregunta, 'El registro de elaboración (lotes, quién preparó y verificó, hora), el monitoreo y el media fill vigentes, y el transporte.', TRUE, 'Correcto. Con esa trazabilidad, incluido el almacenamiento hasta la administración, se puede confirmar o descartar la preparación como fuente.', 2),
      (v_pregunta, 'El hemocultivo del paciente, porque si el germen aislado es de la piel la causa es siempre la preparación de la central.', FALSE, 'Un germen de piel también puede venir del catéter o de la administración; hay que cruzar evidencias.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Tras un derrame de 20 mL de ciclofosfamida fuera de la cabina, un auxiliar lo limpió con toallas de papel y alcohol, con un solo par de guantes de nitrilo, y botó las toallas en la caneca común. ¿Cuál es la valoración más acertada?';
    v_t4 := 'El manejo de un derrame de un medicamento peligroso exige equipo de protección completo, contención con kit, desactivación, descontaminación, limpieza y residuos peligrosos, además del registro y la evaluación de la exposición.';
    v_j1 := $evcmez_json${"external_id":"cmez-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Mezclas oncológicas y seguridad de quien prepara","outcome":"Mezclas oncológicas y seguridad de quien prepara","source":"Capítulo 800 de la USP, derrames y equipo de protección personal."}$evcmez_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cmez-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Adecuada, porque se limpió de inmediato y el alcohol al 70 % desinfecta la superficie y arrastra el residuo del citostático.', FALSE, 'Desinfectar no es descontaminar: el alcohol no inactiva el citostático y puede dispersarlo.', 0),
      (v_pregunta, 'Inadecuada: faltaron protección completa, kit de derrames y residuo peligroso; además se documenta y se valora la exposición.', TRUE, 'Correcto. Un derrame de peligroso exige doble guante de quimioterapia, bata impermeable, protección ocular y respiratoria, contención con el kit y residuo peligroso, y se valora a la persona expuesta.', 1),
      (v_pregunta, 'Inadecuada solo en el residuo: las toallas debían ir a la caneca de reciclaje, pero la limpieza con alcohol fue correcta.', FALSE, 'El reciclaje no aplica a residuos contaminados con citostáticos, y el alcohol no descontamina.', 2),
      (v_pregunta, 'Adecuada, porque 20 mL es un volumen pequeño que no exige kit de derrames ni protección distinta de la habitual del servicio.', FALSE, 'No hay un volumen de citostático que permita omitir el procedimiento de derrames.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad cmez-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Por qué lo estéril es distinto' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Por qué lo estéril es distinto) en Central de Mezclas.';
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Mapa de riesgo de las preparaciones de una clínica';
  v_t2 := $evcmez_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y haz una lista con los datos de cada una de las seis preparaciones.</li><li>Para cada una, anota los tres factores de riesgo de la clase 3: número de manipulaciones, tipo de envase o componente de partida y tiempo hasta la administración.</li><li>Decide si es de uso inmediato o si debe prepararse en la central, y en qué categoría del capítulo 797 quedaría con las instalaciones actuales.</li><li>Asigna la fecha límite de uso máxima que permitiría esa categoría y compárala con lo que hoy hace la clínica.</li><li>Identifica qué preparaciones no pueden hacerse con las instalaciones actuales y explica por qué (por ejemplo, el citostático sin presión negativa).</li><li>Prioriza los tres riesgos más graves y propone una medida concreta para cada uno.</li><li>Revisa tu entrega con la rúbrica y súbela al aula en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar los factores de riesgo de cada preparación estéril.</li><li>Ubicar cada preparación en una categoría del capítulo 797 de la USP y asignar dónde se prepara.</li><li>Proponer decisiones de seguridad sustentadas en la norma colombiana y en la referencia técnica.</li></ul>
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
  <tr><td>Análisis de factores de riesgo</td><td>30 %</td><td>Analiza los tres factores en las seis preparaciones y explica cuál pesa más en cada una.</td><td>Analiza los factores en cinco preparaciones con justificación suficiente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Categoría, lugar y fecha límite de uso</td><td>30 %</td><td>Asigna categoría, lugar y fecha límite correctos en todas y detecta lo que la clínica hace mal hoy.</td><td>Asignaciones correctas con un error menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Decisiones de seguridad</td><td>30 %</td><td>Identifica lo que no puede prepararse hoy (citostático, fraccionamiento intravítreo) y propone medidas concretas y priorizadas.</td><td>Identifica lo principal y propone medidas razonables, con alguna débil.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evcmez_html$;
  v_t3 := $evcmez_html$<h2>Caso de estudio</h2>
<p>La Clínica Santa Clara (ficticia), de 180 camas, quiere ordenar sus preparaciones estériles antes de solicitar la certificación de su central de mezclas. Hoy prepara: (1) ceftriaxona reconstituida en urgencias para administrar en bolo de inmediato; (2) nutrición parenteral neonatal con aminoácidos, dextrosa, lípidos, electrolitos y oligoelementos; (3) ciclofosfamida para pacientes ambulatorios de oncología; (4) jeringas de morfina para analgesia controlada por el paciente, preparadas el lunes para toda la semana; (5) bevacizumab fraccionado en jeringas para uso intravítreo a partir de un vial de uso único; (6) bolsas de bupivacaína con fentanilo para analgesia epidural. La central tiene una antesala ISO 8, una sala de amortiguamiento ISO 7 con una cabina de flujo laminar horizontal y ninguna zona de presión negativa.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evcmez_html$;
  v_t4 := 'Mapa de riesgo de las preparaciones estériles de la clínica, con tabla y priorización.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evcmez_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1403 de 2007 y su Manual de condiciones esenciales; Decreto 2200 de 2005; Resolución 444 de 2008; capítulos 797 (revisión oficial desde el 1 de noviembre de 2023) y 800 de la USP; ISO 14644-1; Anexo 1 de las BPM de la Unión Europea (2022). Cita en APA 7 o en el formato «norma, artículo o numeral».</p>$evcmez_html$;
  v_t7 := NULL;
  v_j1 := $evcmez_json$["Tabla de las seis preparaciones con factores de riesgo, lugar de preparación, categoría y fecha límite de uso.","Preparaciones que no pueden hacerse hoy y la razón técnica y normativa.","Tres riesgos priorizados con su medida.","Citas de la Resolución 1403 de 2007 y del capítulo 797 o 800 de la USP donde corresponda."]$evcmez_json$::jsonb;
  v_j2 := $evcmez_json${"version":1,"total":100,"criteria":[{"id":"analisis-de-factores-de-riesgo","name":"Análisis de factores de riesgo","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Analiza los tres factores en las seis preparaciones y explica cuál pesa más en cada una."},{"level":3,"label":"Logrado","description":"Analiza los factores en cinco preparaciones con justificación suficiente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"categoria-lugar-y-fecha-limite-de-uso","name":"Categoría, lugar y fecha límite de uso","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Asigna categoría, lugar y fecha límite correctos en todas y detecta lo que la clínica hace mal hoy."},{"level":3,"label":"Logrado","description":"Asignaciones correctas con un error menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"decisiones-de-seguridad","name":"Decisiones de seguridad","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Identifica lo que no puede prepararse hoy (citostático, fraccionamiento intravítreo) y propone medidas concretas y priorizadas."},{"level":3,"label":"Logrado","description":"Identifica lo principal y propone medidas razonables, con alguna débil."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evcmez_json$::jsonb;
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


  -- ── Actividad cmez-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Áreas limpias y técnica aséptica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Áreas limpias y técnica aséptica) en Central de Mezclas.';
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Diagnóstico de áreas y técnica de una central';
  v_t2 := $evcmez_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar y evaluar.</p>
<ol><li>Lee el informe y arma una tabla con cada resultado, su criterio y si cumple.</li><li>Analiza el diferencial de presión y el número de renovaciones de aire frente a lo que exige la referencia técnica.</li><li>Lista las fallas de técnica observadas y explica qué riesgo crea cada una.</li><li>Decide qué preparaciones pueden continuar mientras se corrige y cuáles deben suspenderse.</li><li>Explica qué le falta a la central para preparar quimioterapia (área, cabina, presión y personal).</li><li>Propón un plan de corrección con responsables y fecha para cada hallazgo.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Comparar resultados de certificación con los criterios de la norma ISO 14644-1 y del capítulo 797 de la USP.</li><li>Identificar fallas de técnica aséptica y su efecto sobre el aire de primera pasada.</li><li>Evaluar si la central puede seguir operando y qué falta para preparar peligrosos.</li></ul>
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
  <tr><td>Lectura de la certificación</td><td>25 %</td><td>Compara cada resultado con su criterio y detecta que la sala no cumple ISO 7 y que el diferencial de presión es insuficiente.</td><td>Detecta los dos incumplimientos principales con un error menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Análisis de la técnica aséptica</td><td>25 %</td><td>Explica el riesgo de bloquear el aire de primera pasada, no dejar secar el alcohol y entrar con accesorios.</td><td>Identifica las fallas con explicación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Decisión de operación</td><td>20 %</td><td>Suspende o restringe con criterio y propone contingencia para los pacientes.</td><td>Decide con criterio, con una contingencia débil.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Requisitos para peligrosos y plan</td><td>20 %</td><td>Señala sala de presión negativa, cabina de seguridad biológica o aislador y personal entrenado, y propone un plan con responsables y fechas.</td><td>Señala lo principal con un plan razonable.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evcmez_html$;
  v_t3 := $evcmez_html$<h2>Caso de estudio</h2>
<p>La central de mezclas del Hospital Río Claro (ficticio) recibió su informe de recertificación semestral y una observación de la técnica de dos auxiliares. Datos simulados: antesala (diseño ISO 8) con 1.900.000 partículas de 0,5 µm por metro cúbico; sala de amortiguamiento (diseño ISO 7) con 395.000; cabina de flujo laminar horizontal ISO 5 con 2.800; diferencial de presión entre sala y antesala de 0,008 pulgadas de columna de agua; 32 renovaciones de aire por hora en la sala. Observación: una auxiliar trabaja con los antebrazos dentro de la cabina pero bloquea con la bolsa el aire que llega al punto de inyección; el otro rocía alcohol sobre los viales sin dejar secar y entra a la sala con reloj. La gerencia quiere empezar a preparar quimioterapia el próximo mes en la misma sala.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evcmez_html$;
  v_t4 := 'Informe técnico de diagnóstico de áreas y técnica, con tabla de resultados y plan de corrección.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evcmez_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1403 de 2007 y su Manual de condiciones esenciales; Decreto 2200 de 2005; Resolución 444 de 2008; capítulos 797 (revisión oficial desde el 1 de noviembre de 2023) y 800 de la USP; ISO 14644-1; Anexo 1 de las BPM de la Unión Europea (2022). Cita en APA 7 o en el formato «norma, artículo o numeral».</p>$evcmez_html$;
  v_t7 := NULL;
  v_j1 := $evcmez_json$["Tabla de resultados de certificación con criterio y conclusión.","Fallas de técnica aséptica con el riesgo que generan.","Decisión sobre la operación mientras se corrige.","Requisitos que faltan para preparar quimioterapia.","Plan de corrección con responsables y fechas."]$evcmez_json$::jsonb;
  v_j2 := $evcmez_json${"version":1,"total":100,"criteria":[{"id":"lectura-de-la-certificacion","name":"Lectura de la certificación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Compara cada resultado con su criterio y detecta que la sala no cumple ISO 7 y que el diferencial de presión es insuficiente."},{"level":3,"label":"Logrado","description":"Detecta los dos incumplimientos principales con un error menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"analisis-de-la-tecnica-aseptica","name":"Análisis de la técnica aséptica","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica el riesgo de bloquear el aire de primera pasada, no dejar secar el alcohol y entrar con accesorios."},{"level":3,"label":"Logrado","description":"Identifica las fallas con explicación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"decision-de-operacion","name":"Decisión de operación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Suspende o restringe con criterio y propone contingencia para los pacientes."},{"level":3,"label":"Logrado","description":"Decide con criterio, con una contingencia débil."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"requisitos-para-peligrosos-y-plan","name":"Requisitos para peligrosos y plan","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Señala sala de presión negativa, cabina de seguridad biológica o aislador y personal entrenado, y propone un plan con responsables y fechas."},{"level":3,"label":"Logrado","description":"Señala lo principal con un plan razonable."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evcmez_json$::jsonb;
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


  -- ── Actividad cmez-u3-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Gestión de la calidad en la central' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Gestión de la calidad en la central) en Central de Mezclas.';
  END IF;
  v_t1 := 'Actividad de la unidad 3 · Informe de desviación en la central';
  v_t2 := $evcmez_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y escribe la descripción objetiva de la desviación: qué, dónde, cuándo y quién la detectó.</li><li>Define las acciones de contención inmediatas para el viernes y el fin de semana.</li><li>Analiza el impacto: qué preparaciones y qué pacientes pueden estar afectados, y qué registros consultarías.</li><li>Plantea al menos dos hipótesis de causa y la evidencia que confirmaría o descartaría cada una.</li><li>Propón acciones correctivas y preventivas con responsable, fecha e indicador de eficacia.</li><li>Decide qué condición debe cumplirse para que el técnico vuelva a preparar.</li><li>Revisa con la rúbrica y sube el informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar el procedimiento de gestión de desviaciones a un resultado de monitoreo fuera de límite.</li><li>Analizar el impacto sobre lo elaborado y sobre los pacientes con la trazabilidad disponible.</li><li>Proponer causa probable, contención y acciones correctivas y preventivas verificables.</li></ul>
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
  <tr><td>Descripción y contención</td><td>25 %</td><td>Describe la desviación con hechos y contiene a tiempo: suspende al técnico, limpia y desinfecta, repite el muestreo y asegura las nutriciones del fin de semana.</td><td>Describe y contiene lo principal con alguna omisión menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Evaluación de impacto</td><td>25 %</td><td>Delimita las preparaciones y pacientes afectados con la trazabilidad y propone qué vigilar o comunicar.</td><td>Delimita el impacto con criterio general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Investigación de causa</td><td>20 %</td><td>Plantea hipótesis plausibles (técnica, limpieza, guantes, flujo de aire) con la evidencia que las prueba.</td><td>Plantea hipótesis razonables sin la evidencia completa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acciones y eficacia</td><td>20 %</td><td>Acciones concretas con responsable, fecha e indicador, y una condición clara de regreso del técnico.</td><td>Acciones razonables con un indicador débil.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evcmez_html$;
  v_t3 := $evcmez_html$<h2>Caso de estudio</h2>
<p>El viernes a las 16:00, la central de mezclas de la Clínica Valle Alto (ficticia) recibe dos resultados: una placa de contacto de la superficie de trabajo de la cabina ISO 5, del muestreo mensual, con 4 UFC de cocos grampositivos; y la huella de guantes de un técnico, tomada al terminar su prueba de llenado con medio de cultivo, por encima del nivel de acción del programa. Ese técnico preparó en la semana 46 nutriciones parenterales y 120 jeringas de antibiótico (datos simulados). Para el fin de semana hay 30 nutriciones programadas. El jefe de la central te pide el informe de desviación.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evcmez_html$;
  v_t4 := 'Informe de desviación completo, listo para firma del director técnico.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evcmez_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1403 de 2007 y su Manual de condiciones esenciales; Decreto 2200 de 2005; Resolución 444 de 2008; capítulos 797 (revisión oficial desde el 1 de noviembre de 2023) y 800 de la USP; ISO 14644-1; Anexo 1 de las BPM de la Unión Europea (2022). Cita en APA 7 o en el formato «norma, artículo o numeral».</p>$evcmez_html$;
  v_t7 := NULL;
  v_j1 := $evcmez_json$["Descripción objetiva de la desviación.","Contención inmediata, incluida la producción del fin de semana.","Evaluación de impacto con trazabilidad.","Hipótesis de causa con la evidencia que las prueba.","Acciones correctivas y preventivas con indicador de eficacia y condición de regreso del técnico."]$evcmez_json$::jsonb;
  v_j2 := $evcmez_json${"version":1,"total":100,"criteria":[{"id":"descripcion-y-contencion","name":"Descripción y contención","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Describe la desviación con hechos y contiene a tiempo: suspende al técnico, limpia y desinfecta, repite el muestreo y asegura las nutriciones del fin de semana."},{"level":3,"label":"Logrado","description":"Describe y contiene lo principal con alguna omisión menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"evaluacion-de-impacto","name":"Evaluación de impacto","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Delimita las preparaciones y pacientes afectados con la trazabilidad y propone qué vigilar o comunicar."},{"level":3,"label":"Logrado","description":"Delimita el impacto con criterio general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"investigacion-de-causa","name":"Investigación de causa","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Plantea hipótesis plausibles (técnica, limpieza, guantes, flujo de aire) con la evidencia que las prueba."},{"level":3,"label":"Logrado","description":"Plantea hipótesis razonables sin la evidencia completa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acciones-y-eficacia","name":"Acciones y eficacia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Acciones concretas con responsable, fecha e indicador, y una condición clara de regreso del técnico."},{"level":3,"label":"Logrado","description":"Acciones razonables con un indicador débil."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evcmez_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 3, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 3, updated_at = NOW()
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


  -- ── Actividad cmez-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Áreas limpias y técnica aséptica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Áreas limpias y técnica aséptica) en Central de Mezclas.';
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: alcance, áreas y técnica de la central del Hospital San Jacinto';
  v_t2 := $evcmez_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y lista los datos que necesitas para cada fase.</li><li>Fase 1: clasifica cada línea del portafolio por factores de riesgo y por categoría del capítulo 797, y decide qué se prepara en la central y qué queda como uso inmediato.</li><li>Fase 1: identifica las normas que aplican y la certificación que necesita la central ante el Invima, con sus citas.</li><li>Fase 2: dibuja el plano funcional con antesala, sala de amortiguamiento y zona de presión negativa para la segunda etapa, con clases ISO y sentido de las presiones.</li><li>Fase 2: elige las dos cabinas y justifica para qué línea del portafolio se usa cada una.</li><li>Fase 2: escribe el plan de calificación de áreas y el programa de calificación del personal (formación, media fill y huellas de guantes con su frecuencia).</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (alcance y riesgo).</strong> Portafolio de la central, clasificación de cada preparación por riesgo y categoría, marco normativo y autorizaciones que se necesitan.</li>
  <li><strong>Fase 2 · Unidad 2 (áreas, cabinas y técnica).</strong> Plano funcional con clases de aire y presiones, selección de cabinas, plan de calificación de áreas y programa de calificación del personal.</li>
  <li><strong>Fase 3 · Unidad 3 (calidad y seguridad).</strong> Plan de monitoreo ambiental y de personal, trazabilidad y fechas límite de uso, programa de manejo de medicamentos peligrosos e indicadores de la central.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 2. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Delimitar el alcance de una central de mezclas y las autorizaciones que necesita.</li><li>Diseñar las áreas, la selección de cabinas y la calificación del personal.</li></ul>
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
  <tr><td>Alcance y marco normativo</td><td>25 %</td><td>Portafolio bien clasificado y certificación correctamente identificada, con citas precisas.</td><td>Alcance correcto con alguna cita imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Diseño de áreas y cabinas</td><td>30 %</td><td>Plano con clases y presiones coherentes, separación de peligrosos y cabinas bien asignadas.</td><td>Diseño adecuado con una omisión menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Calificación de áreas y personal</td><td>30 %</td><td>Plan completo con pruebas, frecuencias y criterios de aceptación.</td><td>Plan razonable con alguna frecuencia o criterio ausente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>15 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evcmez_html$;
  v_t3 := $evcmez_html$<h2>Caso de estudio</h2>
<p>El Hospital San Jacinto (ficticio) es una IPS de 220 camas en Bucaramanga. Hoy las enfermeras preparan todas las mezclas intravenosas en los servicios y las mezclas oncológicas se compran a un proveedor externo. La gerencia aprobó crear una central de mezclas propia en un espacio de 60 m² junto a la farmacia. Portafolio previsto (datos simulados): nutrición parenteral de adultos (8 al día) y neonatal (5 al día), jeringas de antibiótico (150 al día), infusiones de analgesia (20 al día) y, en una segunda etapa, mezclas oncológicas (25 al día). Hay una química farmacéutica, dos regentes y presupuesto para dos cabinas. Tú eres la persona que la directora técnica encargó del proyecto. En esta entrega construyes las fases 1 y 2.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evcmez_html$;
  v_t4 := 'Documento de avance con las fases 1 y 2 y el plano funcional.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evcmez_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1403 de 2007 y su Manual de condiciones esenciales; Decreto 2200 de 2005; Resolución 444 de 2008; capítulos 797 (revisión oficial desde el 1 de noviembre de 2023) y 800 de la USP; ISO 14644-1; Anexo 1 de las BPM de la Unión Europea (2022). Cita en APA 7 o en el formato «norma, artículo o numeral».</p>$evcmez_html$;
  v_t7 := NULL;
  v_j1 := $evcmez_json$["Portafolio clasificado por riesgo y categoría.","Marco normativo y certificación necesaria, con citas.","Plano funcional con clases de aire y presiones.","Selección de cabinas justificada.","Plan de calificación de áreas y del personal."]$evcmez_json$::jsonb;
  v_j2 := $evcmez_json${"version":1,"total":100,"criteria":[{"id":"alcance-y-marco-normativo","name":"Alcance y marco normativo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Portafolio bien clasificado y certificación correctamente identificada, con citas precisas."},{"level":3,"label":"Logrado","description":"Alcance correcto con alguna cita imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"diseno-de-areas-y-cabinas","name":"Diseño de áreas y cabinas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Plano con clases y presiones coherentes, separación de peligrosos y cabinas bien asignadas."},{"level":3,"label":"Logrado","description":"Diseño adecuado con una omisión menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"calificacion-de-areas-y-personal","name":"Calificación de áreas y personal","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Plan completo con pruebas, frecuencias y criterios de aceptación."},{"level":3,"label":"Logrado","description":"Plan razonable con alguna frecuencia o criterio ausente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evcmez_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 12, 8)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 12, updated_at = NOW()
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


  -- ── Actividad cmez-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Gestión de la calidad en la central' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Gestión de la calidad en la central) en Central de Mezclas.';
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: expediente de la central de mezclas del Hospital San Jacinto';
  v_t2 := $evcmez_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar, evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 y 2; deja una tabla de cambios.</li><li>Fase 3: diseña el plan de monitoreo ambiental y de personal: qué se mide, dónde, con qué frecuencia y qué se hace si un resultado se sale de límite.</li><li>Fase 3: define la trazabilidad mínima de cada preparación y las fechas límite de uso de cada línea del portafolio, con el menor entre esterilidad y estabilidad.</li><li>Fase 3: escribe el programa de manejo de medicamentos peligrosos: lista, evaluación de riesgos, protección, derrames, residuos y vigilancia de salud.</li><li>Fase 3: propone cinco indicadores de la central con fórmula, meta y frecuencia.</li><li>Escribe un resumen ejecutivo de una página para la gerencia: qué está listo, qué falta y qué recursos se necesitan.</li><li>Revisa el expediente con la rúbrica y súbelo en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (alcance y riesgo).</strong> Portafolio de la central, clasificación de cada preparación por riesgo y categoría, marco normativo y autorizaciones que se necesitan.</li>
  <li><strong>Fase 2 · Unidad 2 (áreas, cabinas y técnica).</strong> Plano funcional con clases de aire y presiones, selección de cabinas, plan de calificación de áreas y programa de calificación del personal.</li>
  <li><strong>Fase 3 · Unidad 3 (calidad y seguridad).</strong> Plan de monitoreo ambiental y de personal, trazabilidad y fechas límite de uso, programa de manejo de medicamentos peligrosos e indicadores de la central.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 2. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar las fases del proyecto en un expediente coherente y corregido.</li><li>Diseñar el monitoreo, la trazabilidad, las fechas límite de uso y el programa de peligrosos.</li><li>Definir indicadores para gobernar la central.</li></ul>
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
  <tr><td>Integración y mejora</td><td>15 %</td><td>Integra las tres fases con coherencia y documenta cada corrección.</td><td>Integra y corrige lo principal.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Monitoreo y trazabilidad</td><td>25 %</td><td>Plan con sitios, frecuencias y respuesta ante resultados fuera de límite; trazabilidad que permite reconstruir cada preparación.</td><td>Plan y trazabilidad correctos con omisiones menores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Fechas límite de uso</td><td>20 %</td><td>Fechas correctas por línea, con el menor entre esterilidad y estabilidad y sus fuentes.</td><td>Fechas correctas con un error menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Programa de peligrosos</td><td>20 %</td><td>Programa completo según el capítulo 800, con vigilancia de salud y manejo de derrames.</td><td>Programa adecuado con algún componente débil.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores y resumen ejecutivo</td><td>10 %</td><td>Indicadores útiles con fórmula, meta y frecuencia; resumen claro para la gerencia.</td><td>Indicadores y resumen razonables.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evcmez_html$;
  v_t3 := $evcmez_html$<h2>Caso de estudio</h2>
<p>El Hospital San Jacinto (ficticio) es una IPS de 220 camas en Bucaramanga. Hoy las enfermeras preparan todas las mezclas intravenosas en los servicios y las mezclas oncológicas se compran a un proveedor externo. La gerencia aprobó crear una central de mezclas propia en un espacio de 60 m² junto a la farmacia. Portafolio previsto (datos simulados): nutrición parenteral de adultos (8 al día) y neonatal (5 al día), jeringas de antibiótico (150 al día), infusiones de analgesia (20 al día) y, en una segunda etapa, mezclas oncológicas (25 al día). Hay una química farmacéutica, dos regentes y presupuesto para dos cabinas. Tú eres la persona que la directora técnica encargó del proyecto. En esta entrega terminas la fase 3 e integras todo el proyecto en el expediente que la directora técnica presentará a la gerencia.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evcmez_html$;
  v_t4 := 'Expediente de la central de mezclas: resumen ejecutivo, fases 1 a 3, indicadores y plan de implementación.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evcmez_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1403 de 2007 y su Manual de condiciones esenciales; Decreto 2200 de 2005; Resolución 444 de 2008; capítulos 797 (revisión oficial desde el 1 de noviembre de 2023) y 800 de la USP; ISO 14644-1; Anexo 1 de las BPM de la Unión Europea (2022). Cita en APA 7 o en el formato «norma, artículo o numeral».</p>$evcmez_html$;
  v_t7 := NULL;
  v_j1 := $evcmez_json$["Fases 1 y 2 corregidas, con tabla de cambios.","Plan de monitoreo ambiental y de personal.","Trazabilidad y fechas límite de uso por línea.","Programa de manejo de peligrosos.","Indicadores y resumen ejecutivo."]$evcmez_json$::jsonb;
  v_j2 := $evcmez_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las tres fases con coherencia y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"monitoreo-y-trazabilidad","name":"Monitoreo y trazabilidad","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan con sitios, frecuencias y respuesta ante resultados fuera de límite; trazabilidad que permite reconstruir cada preparación."},{"level":3,"label":"Logrado","description":"Plan y trazabilidad correctos con omisiones menores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"fechas-limite-de-uso","name":"Fechas límite de uso","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Fechas correctas por línea, con el menor entre esterilidad y estabilidad y sus fuentes."},{"level":3,"label":"Logrado","description":"Fechas correctas con un error menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"programa-de-peligrosos","name":"Programa de peligrosos","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Programa completo según el capítulo 800, con vigilancia de salud y manejo de derrames."},{"level":3,"label":"Logrado","description":"Programa adecuado con algún componente débil."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores-y-resumen-ejecutivo","name":"Indicadores y resumen ejecutivo","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Indicadores útiles con fórmula, meta y frecuencia; resumen claro para la gerencia."},{"level":3,"label":"Logrado","description":"Indicadores y resumen razonables."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evcmez_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 13, 16)
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
         SET rubric = v_j2, grading_method = 'rubrica', weight = 16,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Foro cmez-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu relación con las preparaciones estériles';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evcmez_html$<h2>Para empezar</h2>
<p>Piensa en una situación que hayas vivido o presenciado —en una central, en un servicio o como estudiante— en la que una mezcla intravenosa se preparó con prisa, fuera de la cabina o sin registro. Cuéntala en tres o cuatro líneas, sin nombres ni datos que permitan identificar a nadie.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evcmez_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre preparaciones estériles te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evcmez_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evcmez_html$;
  v_t6 := $evcmez_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evcmez_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué norma o guía has oído mencionar cuando se habla de centrales de mezclas?', '¿Qué te preocupa más hoy: las áreas, la técnica aséptica o los medicamentos peligrosos?']::text[];
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


  -- ── Foro cmez-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Por qué lo estéril es distinto' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Por qué lo estéril es distinto) en Central de Mezclas.';
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Preparar en el servicio o en la central?';
  v_t2 := 'Decidir qué preparaciones deben pasar a la central de mezclas y cuáles pueden seguir como uso inmediato en los servicios, con argumentos de riesgo y de norma.';
  v_t3 := $evcmez_html$<h2>Caso del foro</h2>
<p>En la Clínica Los Almendros (ficticia), las enfermeras diluyen en la estación todos los antibióticos y analgésicos intravenosos. En el último trimestre hubo dos bacteriemias asociadas a catéter en el mismo servicio (datos simulados). La farmacia propone centralizar; la coordinación de enfermería responde que la central no alcanza a cubrir las dosis urgentes de la noche y que «siempre se ha hecho así».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evcmez_html$;
  v_t4 := '¿Qué preparaciones deben pasar a la central de mezclas, cuáles pueden seguir como uso inmediato en el servicio y con qué condiciones?';
  v_t5 := $evcmez_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el criterio (tiempo hasta la administración, número de manipulaciones o tipo de producto) que usarías para separar las preparaciones. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.34 %.</li></ul>$evcmez_html$;
  v_t6 := $evcmez_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio (tiempo hasta la administración, número de manipulaciones o tipo de producto) que usarías para separar las preparaciones.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evcmez_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dato adicional pedirías antes de relacionar las bacteriemias con la forma de preparar?', '¿Cómo responderías al argumento de las dosis urgentes de la noche sin poner en riesgo al paciente?', '¿Qué cambia si una de las preparaciones es un citostático?']::text[];
  v_j1 := $evcmez_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el criterio (tiempo hasta la administración, número de manipulaciones o tipo de producto) que usarías para separar las preparaciones."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evcmez_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 3.34, v_j1,
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
         SET grading_method = 'rubrica', weight = 3.34, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro cmez-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Áreas limpias y técnica aséptica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Áreas limpias y técnica aséptica) en Central de Mezclas.';
  END IF;
  v_t1 := 'Foro de interacción 2 · El aire que no se ve';
  v_t2 := 'Evaluar si una central puede seguir elaborando cuando las condiciones de aire cambian y qué evidencia se necesita para reanudar.';
  v_t3 := $evcmez_html$<h2>Caso del foro</h2>
<p>Durante una remodelación en el pasillo vecino, mantenimiento deja abierta la puerta entre la antesala y la sala de amortiguamiento «para ventilar» y silencia la alarma del monitor de presión diferencial, que sonaba cada hora. El turno de la tarde tiene 14 nutriciones parenterales pendientes. El director técnico debe decidir si se sigue preparando (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evcmez_html$;
  v_t4 := '¿Se puede seguir elaborando en esas condiciones? ¿Qué debe verificarse, y con qué evidencia, antes de reanudar?';
  v_t5 := $evcmez_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la verificación concreta (presiones, conteo de partículas, limpieza o monitoreo) que exigirías antes de reanudar. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$evcmez_html$;
  v_t6 := $evcmez_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la verificación concreta (presiones, conteo de partículas, limpieza o monitoreo) que exigirías antes de reanudar.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evcmez_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué harías con las preparaciones elaboradas mientras la alarma estuvo silenciada?', '¿Cómo garantizarías las 14 nutriciones sin poner en riesgo a los pacientes?', '¿Qué cambiarías en el procedimiento de mantenimiento para que no se repita?']::text[];
  v_j1 := $evcmez_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la verificación concreta (presiones, conteo de partículas, limpieza o monitoreo) que exigirías antes de reanudar."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evcmez_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 3.33, v_j1,
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
         SET grading_method = 'rubrica', weight = 3.33, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro cmez-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Gestión de la calidad en la central' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Gestión de la calidad en la central) en Central de Mezclas.';
  END IF;
  v_t1 := 'Foro de interacción 3 · ¿Quién protege a quien prepara?';
  v_t2 := 'Argumentar qué medidas, además de la cabina, protegen al personal que prepara medicamentos peligrosos y cómo priorizarlas con un presupuesto limitado.';
  v_t3 := $evcmez_html$<h2>Caso del foro</h2>
<p>En la central de un hospital ficticio, las mezclas oncológicas se preparan en una cabina de seguridad biológica. El personal refiere dolores de cabeza y una técnica está embarazada. La gerencia dice que «la cabina basta» y que no hay presupuesto para dispositivos cerrados de transferencia ni para muestreo de superficies. Nunca se ha hecho una evaluación de riesgos de los medicamentos peligrosos que maneja el servicio (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evcmez_html$;
  v_t4 := '¿Qué medidas, además de la cabina, son necesarias para proteger a quien prepara medicamentos peligrosos y cuáles priorizarías con un presupuesto limitado?';
  v_t5 := $evcmez_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el control (de ingeniería, administrativo o de protección personal) que priorizarías y por qué. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$evcmez_html$;
  v_t6 := $evcmez_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el control (de ingeniería, administrativo o de protección personal) que priorizarías y por qué.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evcmez_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué le corresponde hacer al servicio con la técnica embarazada?', '¿Qué evidencia mostraría que la cabina no está conteniendo el citostático?', '¿Cómo usarías la jerarquía de controles para convencer a la gerencia?']::text[];
  v_j1 := $evcmez_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el control (de ingeniería, administrativo o de protección personal) que priorizarías y por qué."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evcmez_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 3.33, v_j1,
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
         SET grading_method = 'rubrica', weight = 3.33, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  RAISE NOTICE 'Central de Mezclas: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evcmez$;


-- ════════════════════════════════════════════════════════════════
--  Asuntos Regulatorios Sanitarios ante INVIMA
--  3 quizzes · 5 actividades · 4 foros
-- ════════════════════════════════════════════════════════════════
DO $evinvima$
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
   WHERE kind = 'edvanta' AND title = 'Asuntos Regulatorios Sanitarios ante INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Asuntos Regulatorios Sanitarios ante INVIMA: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['El sistema sanitario colombiano', 'El registro sanitario, paso a paso', 'Después del registro']::text[])) < 3 THEN
    RAISE NOTICE 'Asuntos Regulatorios ante INVIMA: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evinvima_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evinvima_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz invima-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El sistema sanitario colombiano' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (El sistema sanitario colombiano) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · El sistema sanitario colombiano';
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
       FALSE, FALSE, TRUE, 'publicado', 1, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 1, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Cómo se reparten las funciones entre el Ministerio de Salud y Protección Social y el Invima en materia de medicamentos?';
    v_t4 := 'El Ministerio de Salud y Protección Social formula la política y expide la regulación; el Invima, creado por la Ley 100 de 1993, ejecuta: concede registros sanitarios, certifica buenas prácticas y ejerce inspección, vigilancia y control.';
    v_j1 := $evinvima_json${"external_id":"invima-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Qué es el INVIMA y qué vigila","outcome":"Qué es el INVIMA y qué vigila","source":"Ley 100 de 1993, artículo 245; portal institucional del Invima."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El Invima expide los decretos sobre medicamentos y el Ministerio de Salud solo se encarga de publicarlos en el Diario Oficial.', FALSE, 'Los decretos y resoluciones generales los expide el Gobierno y el Ministerio; el Invima ejecuta.', 0),
      (v_pregunta, 'El Invima vigila solo los medicamentos; los alimentos y los cosméticos los vigila el Ministerio de Comercio.', FALSE, 'El Invima vigila también alimentos, cosméticos, dispositivos médicos y otros productos de uso humano.', 1),
      (v_pregunta, 'El Ministerio fija la política y expide la regulación; el Invima la ejecuta: otorga registros, certifica y vigila.', TRUE, 'Correcto. Conocer esta división evita tocar la puerta equivocada en un trámite.', 2),
      (v_pregunta, 'Son la misma entidad con dos nombres, uno técnico y otro administrativo, que responden igual a cualquier trámite.', FALSE, 'Son entidades distintas: el Invima es un establecimiento público adscrito al Ministerio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un ciudadano quiere quejarse por las condiciones de almacenamiento de una droguería de barrio en Pereira: neveras sin termómetro y cajas en el piso. ¿Ante quién debe dirigir la queja?';
    v_t4 := 'La vigilancia sanitaria se reparte por niveles: el Invima vigila productos, fabricantes e importadores; las secretarías de salud departamentales y distritales vigilan los establecimientos farmacéuticos minoristas, como las droguerías.';
    v_j1 := $evinvima_json${"external_id":"invima-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Qué es el INVIMA y qué vigila","outcome":"Qué es el INVIMA y qué vigila","source":"Decreto 2200 de 2005 (servicio farmacéutico y establecimientos); organización de la inspección, vigilancia y control sanitario."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Ante el Invima, porque toda queja sobre medicamentos en Colombia le corresponde a la autoridad nacional.', FALSE, 'El Invima vigila productos y fabricantes, pero los establecimientos minoristas los vigilan las entidades territoriales.', 0),
      (v_pregunta, 'Ante la secretaría de salud del departamento, que vigila los establecimientos farmacéuticos minoristas.', TRUE, 'Correcto. La inspección de droguerías y farmacias-droguerías está en cabeza de las entidades territoriales de salud.', 1),
      (v_pregunta, 'Ante la Superintendencia de Industria y Comercio, porque se trata de una relación de consumo con un comercio.', FALSE, 'La protección al consumidor no reemplaza la vigilancia sanitaria del establecimiento.', 2),
      (v_pregunta, 'Ante el Ministerio de Salud, que inspecciona directamente cada establecimiento que vende medicamentos.', FALSE, 'El Ministerio no inspecciona establecimientos uno a uno; regula y dirige el sistema.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una empresa vende cápsulas con extracto de una planta y en la etiqueta dice: «mejora la memoria y previene la demencia». Quiere registrarlas como suplemento dietario porque el trámite le parece más sencillo. ¿Qué análisis es correcto?';
    v_t4 := 'La clasificación depende de la composición y de lo que el producto declara. Los suplementos dietarios no pueden atribuirse propiedades terapéuticas ni preventivas de enfermedades; esa declaración lleva el producto a otra categoría con sus propios requisitos.';
    v_j1 := $evinvima_json${"external_id":"invima-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Cómo se clasifica un producto","outcome":"Cómo se clasifica un producto","source":"Decreto 3249 de 2006 (suplementos dietarios); Decreto 1156 de 2018 (productos fitoterapéuticos)."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un suplemento dietario, porque se trata de un extracto vegetal presentado en cápsulas para consumo oral diario.', FALSE, 'La forma de presentación no define la categoría: la definen la composición y lo que el producto declara hacer.', 0),
      (v_pregunta, 'Es un alimento, porque se vende en tiendas naturistas y no requiere fórmula médica para su compra.', FALSE, 'El canal de venta no clasifica el producto. Las declaraciones de salud sí.', 1),
      (v_pregunta, 'Puede ser suplemento si elimina la palabra «demencia» y conserva «previene» para no alarmar al comprador.', FALSE, 'Cualquier declaración de prevenir o tratar una enfermedad es terapéutica, con o sin esa palabra.', 2),
      (v_pregunta, 'Prevenir una enfermedad es una declaración terapéutica: no cabe como suplemento y debe evaluarse otra figura.', TRUE, 'Correcto. Un suplemento no puede atribuirse propiedades terapéuticas; con esa declaración, la ruta es fitoterapéutico o medicamento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para resolver una duda sobre requisitos de un registro, un analista consulta solo el texto original del Decreto 677 de 1995 que descargó hace años. ¿Cuál es la valoración más acertada?';
    v_t4 := 'El Decreto 677 de 1995 es la base del régimen de registros, pero ha cambiado mucho: el Decreto 334 de 2022 derogó su artículo 18 (modificaciones) y el Decreto 1474 de 2023 volvió indefinida la vigencia de los registros de medicamentos. La consulta responsable usa la versión vigente, por ejemplo en el normograma del Invima.';
    v_j1 := $evinvima_json${"external_id":"invima-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"El Decreto 677 de 1995 y sus actualizaciones","outcome":"El Decreto 677 de 1995 y sus actualizaciones","source":"Decreto 677 de 1995, versión vigente en el normograma del Invima; Decreto 334 de 2022; Decreto 1474 de 2023."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es suficiente: un decreto no cambia una vez expedido, y el texto original es la fuente más confiable.', FALSE, 'Los decretos se modifican, se derogan parcialmente y se complementan con normas posteriores.', 0),
      (v_pregunta, 'Es riesgosa: debe consultar la versión vigente y compilada, y las normas posteriores que lo modifican o complementan.', TRUE, 'Correcto. Un texto desactualizado lleva a radicar con requisitos que ya no existen o a omitir los nuevos.', 1),
      (v_pregunta, 'Es suficiente si además revisa una guía de la OMS, que prevalece sobre la norma colombiana cuando hay alguna diferencia entre ambas.', FALSE, 'Las guías internacionales orientan, pero no prevalecen sobre la norma colombiana vigente.', 2),
      (v_pregunta, 'Es riesgosa solo porque los trámites ya no se rigen por decretos sino por circulares internas del Invima.', FALSE, 'Los decretos siguen rigiendo; las circulares y guías orientan su aplicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz invima-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El registro sanitario, paso a paso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (El registro sanitario, paso a paso) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · El registro sanitario, paso a paso';
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
       FALSE, FALSE, TRUE, 'publicado', 2, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 2, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Qué diferencia hay entre la evaluación farmacológica y la evaluación farmacéutica de un medicamento?';
    v_t4 := 'La evaluación farmacológica se forma un juicio sobre la utilidad, conveniencia y seguridad del medicamento; la farmacéutica conceptúa sobre la capacidad técnica del fabricante, el proceso de fabricación y la calidad del producto.';
    v_j1 := $evinvima_json${"external_id":"invima-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Evaluación farmacológica y farmacéutica","outcome":"Evaluación farmacológica y farmacéutica","source":"Decreto 677 de 1995, evaluación farmacológica y evaluación farmacéutica."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La farmacológica revisa la calidad del producto y la farmacéutica revisa la publicidad que se hará después de obtener el registro.', FALSE, 'La publicidad no es objeto de ninguna de las dos evaluaciones del registro.', 0),
      (v_pregunta, 'La farmacológica juzga la utilidad, conveniencia y seguridad del principio activo; la farmacéutica, la calidad del producto.', TRUE, 'Correcto. Son dos juicios distintos y a veces consecutivos.', 1),
      (v_pregunta, 'Son la misma evaluación con dos nombres; la diferencia está solo en el grupo del Invima que la firma.', FALSE, 'No son la misma: evalúan objetos distintos con criterios distintos.', 2),
      (v_pregunta, 'La farmacéutica solo aplica a medicamentos importados y la farmacológica a los fabricados en Colombia.', FALSE, 'El origen del producto no define qué evaluación aplica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un laboratorio quiere registrar tabletas de losartán de 50 mg con la misma indicación, forma farmacéutica y concentración que ya figuran en las normas farmacológicas. ¿Qué evaluaciones necesita su solicitud?';
    v_t4 := 'Cuando el principio activo, la indicación, la forma y la concentración ya están en las normas farmacológicas, la solicitud no requiere evaluación farmacológica; sí requiere la evaluación farmacéutica (calidad) y la legal.';
    v_j1 := $evinvima_json${"external_id":"invima-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Evaluación farmacológica y farmacéutica","outcome":"Evaluación farmacológica y farmacéutica","source":"Decreto 677 de 1995; normas farmacológicas del Invima."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Las evaluaciones farmacéutica y legal; la farmacológica no, porque el principio activo ya está aprobado en esas condiciones.', TRUE, 'Correcto. La evaluación farmacológica se exige a lo nuevo: molécula, indicación, combinación o forma.', 0),
      (v_pregunta, 'Solo la evaluación farmacológica, porque la calidad de un genérico se presume igual a la del innovador.', FALSE, 'La calidad nunca se presume: la evaluación farmacéutica es la que la examina.', 1),
      (v_pregunta, 'Las tres evaluaciones completas, porque toda solicitud de registro nuevo pasa siempre por la Comisión Revisora del Invima.', FALSE, 'La evaluación farmacológica no se repite para lo que ya está incluido en las normas farmacológicas.', 2),
      (v_pregunta, 'Ninguna evaluación técnica: basta con el certificado de buenas prácticas del fabricante y la solicitud.', FALSE, 'El certificado de buenas prácticas es un soporte, no reemplaza la evaluación del producto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'El expediente de un genérico trae fórmula, métodos analíticos validados y certificado de buenas prácticas del fabricante, pero los estudios de estabilidad se hicieron en un envase distinto del que se comercializará. ¿Qué consecuencia tiene ese vacío?';
    v_t4 := 'La vida útil se sustenta con estabilidad del producto en su envase de comercialización. Si el envase cambia, el dato no es transferible sin justificación, y la evaluación farmacéutica lo cuestionará.';
    v_j1 := $evinvima_json${"external_id":"invima-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Qué lleva el expediente","outcome":"Qué lleva el expediente","source":"Decreto 677 de 1995, documentación técnica del registro; guía ICH Q1A(R2) como referencia técnica de estabilidad."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Ninguna, porque la estabilidad depende del principio activo y no del material de envase.', FALSE, 'El envase protege de la humedad, la luz y el oxígeno: cambiarlo puede cambiar la estabilidad.', 0),
      (v_pregunta, 'El expediente se rechaza de plano, sin posibilidad de requerimiento, porque falta un documento legal obligatorio del expediente.', FALSE, 'La estabilidad es un soporte técnico, no legal, y su vacío suele dar lugar a un requerimiento.', 1),
      (v_pregunta, 'La vida útil propuesta no queda sustentada para el envase real; la evaluación farmacéutica pedirá esa estabilidad.', TRUE, 'Correcto. Cada dato de la vida útil debe corresponder al producto en su envase de comercialización.', 2),
      (v_pregunta, 'Solo afecta la etiqueta, que deberá decir «sin datos de estabilidad» mientras se completan los estudios.', FALSE, 'No existe esa leyenda: sin sustento no se aprueba la vida útil propuesta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una empresa responde un requerimiento del Invima reenviando el expediente completo con una carta que dice: «adjuntamos la información solicitada». ¿Cuál es la valoración más acertada de esa respuesta?';
    v_t4 := 'El Invima requiere la información faltante por una sola vez y con un término fijo según el trámite. Por eso la respuesta va punto por punto, con la evidencia de cada uno y su ubicación, coherente con el expediente. Si el término se vence sin respuesta, se entiende que la empresa desiste y se declara el abandono de la solicitud.';
    v_j1 := $evinvima_json${"external_id":"invima-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Requerimientos y cómo responderlos","outcome":"Requerimientos y cómo responderlos","source":"Decreto 677 de 1995, artículos 23, 25 y 29 (requerimiento por una sola vez y abandono)."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada, porque el Invima recibe toda la información y su evaluador puede buscar en ella lo que necesite revisar.', FALSE, 'Trasladar al evaluador la búsqueda aumenta el riesgo de que el punto se dé por no respondido.', 0),
      (v_pregunta, 'Es adecuada si se envía antes de la mitad del plazo, porque la oportunidad compensa la forma.', FALSE, 'La oportunidad no compensa una respuesta que no demuestra que cada punto quedó resuelto.', 1),
      (v_pregunta, 'Es inadecuada solo porque la carta debía ir firmada por el representante legal y no por el analista.', FALSE, 'La firma importa, pero el problema de fondo es que no hay trazabilidad punto por punto.', 2),
      (v_pregunta, 'Es inadecuada: debe responder punto por punto, con la evidencia de cada uno y dónde está, dentro del término.', TRUE, 'Correcto. Una respuesta trazable muestra qué se pidió, qué se aporta y dónde se encuentra.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz invima-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Después del registro' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Después del registro) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Después del registro';
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
       FALSE, FALSE, TRUE, 'publicado', 3, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 3, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Por qué un cambio de fabricante, de fórmula o de envase exige tramitar una modificación del registro sanitario?';
    v_t4 := 'El registro sanitario autoriza un producto con una fórmula, un fabricante, un proceso, un envase y una información aprobados. Desde el Decreto 1474 de 2023 su vigencia es indefinida, siempre que se mantengan esas condiciones: por eso los cambios se tramitan como modificación, que hoy regula el Decreto 334 de 2022.';
    v_j1 := $evinvima_json${"external_id":"invima-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Modificaciones y renovaciones","outcome":"Modificaciones y renovaciones","source":"Decreto 334 de 2022 (modificación de registros sanitarios); Decreto 1474 de 2023 (vigencia indefinida)."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque el registro aprueba un producto en condiciones concretas; cambiarlas sin aprobación es vender otro producto.', TRUE, 'Correcto. El registro ampara lo que se evaluó, no cualquier versión del producto.', 0),
      (v_pregunta, 'Porque cada modificación genera una tarifa, y el registro solo se mantiene vigente si se pagan al Invima las tarifas anuales.', FALSE, 'Las tarifas existen, pero la razón de fondo es que el registro ampara condiciones evaluadas.', 1),
      (v_pregunta, 'Porque la ley obliga a actualizar el registro cada vez que cambia el representante legal de la empresa.', FALSE, 'Ese es un cambio administrativo; la pregunta trata de cambios que afectan el producto.', 2),
      (v_pregunta, 'Porque cada modificación reinicia la vigencia del registro, que de otro modo vencería a los cinco años de expedido.', FALSE, 'Desde el Decreto 1474 de 2023 la vigencia del registro de medicamentos es indefinida; la modificación existe porque el registro ampara condiciones aprobadas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'El titular de un registro recibe el reporte de un paciente hospitalizado por una reacción adversa grave atribuida a su medicamento. ¿Qué debe hacer con ese caso?';
    v_t4 := 'Desde el 1 de marzo de 2025, la Resolución 2024015321 de 2024 del Invima obliga al titular a comunicar los eventos adversos serios dentro de los 15 días calendario siguientes al día en que los conoce, y los no serios dentro de los 90, por eReporting Industria. Se reporta la sospecha; la causalidad se evalúa después.';
    v_j1 := $evinvima_json${"external_id":"invima-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Farmacovigilancia y poscomercialización","outcome":"Farmacovigilancia y poscomercialización","source":"Resolución 2024015321 de 2024 del Invima, artículo 8; ICH E2A, definición de evento serio."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Esperar al informe periódico del semestre, porque los reportes de un producto se consolidan antes de enviarlos al Invima.', FALSE, 'Los eventos serios no esperan al informe periódico: tienen un plazo corto propio.', 0),
      (v_pregunta, 'Reportarlo al Invima como serio dentro de los 15 días calendario siguientes a conocerlo, por eReporting Industria.', TRUE, 'Correcto. Una hospitalización hace serio el evento y activa el reporte en ese plazo, que cuenta desde el día siguiente al conocimiento.', 1),
      (v_pregunta, 'Reportarlo solo si el médico tratante confirma por escrito que el medicamento fue la causa del evento.', FALSE, 'Se reporta la sospecha; la causalidad se evalúa después y no es requisito para reportar.', 2),
      (v_pregunta, 'Retirar de inmediato todos los lotes del mercado y reportar el caso cuando termine la investigación.', FALSE, 'Un solo caso no implica retiro automático; el reporte oportuno es la primera obligación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'La marca de un antihipertensivo de venta con fórmula médica publica en redes sociales: «Controla tu presión con X; pregúntale a tu médico». ¿Qué análisis es correcto?';
    v_t4 := 'El artículo 11 del Decreto 334 de 2022 limita la información y la publicidad de los medicamentos de venta con fórmula a publicaciones de distribución restringida, dirigidas a profesionales en medicina y odontología, y las prohíbe en medios masivos, plataformas digitales, mensajería y redes sociales.';
    v_j1 := $evinvima_json${"external_id":"invima-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Publicidad, visitas y sanciones","outcome":"Publicidad, visitas y sanciones","source":"Decreto 334 de 2022, artículo 11; Resolución 1896 de 2023 del Ministerio de Salud."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es válida porque remite al médico, y esa frase convierte cualquier pieza en información educativa.', FALSE, 'Remitir al médico no cambia que se esté promoviendo al público un medicamento de prescripción.', 0),
      (v_pregunta, 'Es válida si la pieza muestra el número de registro sanitario y las contraindicaciones principales.', FALSE, 'Agregar datos no habilita la publicidad al público de un producto de venta con fórmula.', 1),
      (v_pregunta, 'No es válida: los de venta con fórmula solo se anuncian en publicaciones restringidas a médicos y odontólogos.', TRUE, 'Correcto. El Decreto 334 de 2022 prohíbe expresamente anunciarlos en redes sociales, medios masivos y plataformas digitales.', 2),
      (v_pregunta, 'No es válida solo porque las redes sociales no están reguladas todavía como medio publicitario de medicamentos en Colombia.', FALSE, 'Las redes sí están reguladas: el Decreto 334 de 2022 las prohíbe para los medicamentos de venta con fórmula.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En una visita, el Invima encuentra lotes sin registro sanitario y aplica de inmediato un decomiso. La empresa alega que «la sancionaron sin derecho a defensa». ¿Cuál es la valoración más acertada?';
    v_t4 := 'Las medidas sanitarias de seguridad (decomiso, congelación, suspensión, clausura temporal) son preventivas, de ejecución inmediata y transitorias. Las sanciones se imponen después, en un proceso sancionatorio con derecho de defensa.';
    v_j1 := $evinvima_json${"external_id":"invima-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Publicidad, visitas y sanciones","outcome":"Publicidad, visitas y sanciones","source":"Decreto 677 de 1995, artículos 104, 105 y 110 (medidas sanitarias de seguridad) y procedimiento sancionatorio; Ley 9 de 1979."}$evinvima_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'invima-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La empresa tiene razón: ninguna medida puede aplicarse antes de un proceso con descargos y pruebas.', FALSE, 'Las medidas sanitarias de seguridad son preventivas y de ejecución inmediata; no requieren proceso previo.', 0),
      (v_pregunta, 'La empresa tiene razón solo si el decomiso supera cierto valor comercial fijado por la ley.', FALSE, 'El valor de la mercancía no define si la medida es preventiva o sancionatoria.', 1),
      (v_pregunta, 'La empresa no tiene razón: el decomiso preventivo es una sanción definitiva y no admite ningún recurso ni revisión posterior.', FALSE, 'Confunde los dos conceptos: la medida preventiva no es la sanción definitiva.', 2),
      (v_pregunta, 'La empresa no tiene razón: el decomiso es una medida preventiva; la sanción se decide después, con defensa.', TRUE, 'Correcto. La medida protege la salud de inmediato; el proceso sancionatorio garantiza el derecho de defensa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad invima-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El sistema sanitario colombiano' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (El sistema sanitario colombiano) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Ruta regulatoria de cinco productos';
  v_t2 := $evinvima_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y escribe, para cada producto, su composición y lo que declara.</li><li>Clasifica cada producto: medicamento, producto fitoterapéutico, suplemento dietario, cosmético o dispositivo médico.</li><li>Identifica la norma que rige cada categoría y el tipo de autorización (registro sanitario, notificación sanitaria obligatoria u otra) con su cita.</li><li>Señala qué dato tendrías que verificar en una fuente oficial antes de radicar cada trámite (por ejemplo, un listado o una clase de riesgo).</li><li>Analiza qué pasaría con el producto 3 si la frase dijera «previene la osteoporosis».</li><li>Elige el producto con mayor riesgo de clasificarse mal y explica por qué.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar productos de uso humano según su composición y sus declaraciones.</li><li>Identificar la norma, el tipo de autorización y la entidad competente para cada categoría.</li><li>Evaluar el riesgo regulatorio de una clasificación equivocada.</li></ul>
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
  <tr><td>Clasificación</td><td>30 %</td><td>Clasifica bien los cinco productos y explica qué rasgo decide cada clasificación.</td><td>Clasifica bien cuatro con justificación suficiente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Norma, autorización y entidad</td><td>30 %</td><td>Cita la norma correcta de cada categoría y distingue registro sanitario de notificación sanitaria obligatoria.</td><td>Normas y autorizaciones correctas con un error menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Análisis de declaraciones y riesgo</td><td>30 %</td><td>Explica cómo una declaración terapéutica cambia la categoría y argumenta con solidez el producto de mayor riesgo.</td><td>Análisis correcto con argumentos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evinvima_html$;
  v_t3 := $evinvima_html$<h2>Caso de estudio</h2>
<p>Laboratorios Andinos S. A. S. (ficticio), de Bogotá, quiere lanzar en el próximo año cinco productos y te pide la ruta regulatoria de cada uno: (1) tabletas de ibuprofeno de 400 mg; (2) jarabe con extracto de hojas de hiedra, con indicación expectorante; (3) cápsulas de vitamina D3 de 1.000 UI con la frase «apoya la salud de tus huesos»; (4) crema hidratante corporal con urea al 5 %; (5) termómetro digital de uso doméstico. La gerencia quiere saber qué autorización necesita cada uno, ante quién y con qué norma, y cuál representa el mayor riesgo de clasificarse mal (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evinvima_html$;
  v_t4 := 'Informe de ruta regulatoria con tabla de clasificación y análisis de riesgo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evinvima_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 9 de 1979; Ley 100 de 1993; Decreto 677 de 1995 en su versión vigente (normograma del Invima); Decreto 334 de 2022 (modificación de registros, información y publicidad de medicamentos) y Resolución 1896 de 2023 del Ministerio de Salud; Decreto 1474 de 2023 (vigencia indefinida de los registros de medicamentos); Resolución 2024015321 de 2024 del Invima (reportes de eventos adversos, vigente desde el 1 de marzo de 2025); Decreto 1156 de 2018 (fitoterapéuticos, que derogó el Decreto 2266 de 2004); Decreto 3249 de 2006 (suplementos dietarios); Decreto 4725 de 2005 (dispositivos médicos); Decisión 833 de la CAN (cosméticos). Cita en APA 7 o en el formato «norma, artículo».</p>$evinvima_html$;
  v_t7 := NULL;
  v_j1 := $evinvima_json$["Tabla de los cinco productos con categoría, norma, autorización y entidad.","Dato que se debe verificar en una fuente oficial para cada uno.","Análisis del cambio de declaración del producto 3.","Producto con mayor riesgo de clasificarse mal y su justificación."]$evinvima_json$::jsonb;
  v_j2 := $evinvima_json${"version":1,"total":100,"criteria":[{"id":"clasificacion","name":"Clasificación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Clasifica bien los cinco productos y explica qué rasgo decide cada clasificación."},{"level":3,"label":"Logrado","description":"Clasifica bien cuatro con justificación suficiente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"norma-autorizacion-y-entidad","name":"Norma, autorización y entidad","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cita la norma correcta de cada categoría y distingue registro sanitario de notificación sanitaria obligatoria."},{"level":3,"label":"Logrado","description":"Normas y autorizaciones correctas con un error menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"analisis-de-declaraciones-y-riesgo","name":"Análisis de declaraciones y riesgo","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Explica cómo una declaración terapéutica cambia la categoría y argumenta con solidez el producto de mayor riesgo."},{"level":3,"label":"Logrado","description":"Análisis correcto con argumentos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evinvima_json$::jsonb;
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


  -- ── Actividad invima-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El registro sanitario, paso a paso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (El registro sanitario, paso a paso) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Plan de respuesta a un requerimiento';
  v_t2 := $evinvima_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el requerimiento y copia cada punto en una matriz con columnas: punto, evidencia disponible, brecha, responsable y fecha.</li><li>Para cada punto, decide si la evidencia existe, si puede generarse antes del vencimiento o si no.</li><li>Analiza si la estabilidad a 6 meses permite sostener la vida útil propuesta o si conviene ajustarla.</li><li>Evalúa las alternativas para los puntos sin evidencia, sabiendo que el requerimiento se hace por una sola vez: responder con lo que existe y asumir el riesgo, o desistir y radicar de nuevo.</li><li>Redacta la carta de respuesta con la estructura punto por punto (máximo una página) y el índice de anexos.</li><li>Escribe una recomendación para la gerencia con la alternativa elegida y su riesgo.</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Analizar un requerimiento y separar lo que se puede responder de lo que no.</li><li>Construir una respuesta trazable punto por punto.</li><li>Evaluar el riesgo jurídico y comercial de cada alternativa.</li></ul>
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
  <tr><td>Análisis del requerimiento</td><td>25 %</td><td>Separa con precisión lo que existe, lo que puede generarse y lo que no, en los cuatro puntos.</td><td>Analiza los cuatro puntos con un error menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Decisiones técnicas</td><td>25 %</td><td>Decide con fundamento la vida útil y el manejo del certificado vencido, sin aportar datos inexistentes.</td><td>Decisiones correctas con argumentos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Respuesta trazable</td><td>25 %</td><td>Carta punto por punto con evidencia ubicada en anexos, coherente con el expediente.</td><td>Carta clara con alguna referencia incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Evaluación de riesgo y recomendación</td><td>15 %</td><td>Compara alternativas con su consecuencia jurídica y comercial y recomienda una con claridad.</td><td>Recomienda una alternativa razonable con análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evinvima_html$;
  v_t3 := $evinvima_html$<h2>Caso de estudio</h2>
<p>Medicamentos del Pacífico S. A. S. (ficticia), de Cali, radicó la solicitud de registro sanitario de un genérico importado en la modalidad importar y vender. Hoy recibió un requerimiento con cuatro puntos: (1) estudios de estabilidad en el envase de comercialización, porque los presentados usaron otro envase; (2) informe de validación del método de disolución; (3) corrección del arte de la etiqueta, que omite el número de lote y la fecha de vencimiento; (4) certificado de buenas prácticas de manufactura del fabricante extranjero vigente, porque el aportado venció hace dos meses. La empresa tiene la estabilidad en el envase correcto a 6 meses, la validación del método está en curso y el fabricante dice que su nueva certificación saldrá «en unas semanas» (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evinvima_html$;
  v_t4 := 'Plan de respuesta al requerimiento: matriz, carta y recomendación.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evinvima_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 9 de 1979; Ley 100 de 1993; Decreto 677 de 1995 en su versión vigente (normograma del Invima); Decreto 334 de 2022 (modificación de registros, información y publicidad de medicamentos) y Resolución 1896 de 2023 del Ministerio de Salud; Decreto 1474 de 2023 (vigencia indefinida de los registros de medicamentos); Resolución 2024015321 de 2024 del Invima (reportes de eventos adversos, vigente desde el 1 de marzo de 2025); Decreto 1156 de 2018 (fitoterapéuticos, que derogó el Decreto 2266 de 2004); Decreto 3249 de 2006 (suplementos dietarios); Decreto 4725 de 2005 (dispositivos médicos); Decisión 833 de la CAN (cosméticos). Cita en APA 7 o en el formato «norma, artículo».</p>$evinvima_html$;
  v_t7 := NULL;
  v_j1 := $evinvima_json$["Matriz del requerimiento con evidencia, brecha, responsable y fecha.","Decisión sobre la vida útil con la estabilidad disponible.","Evaluación de alternativas para los puntos sin evidencia.","Carta de respuesta punto por punto con índice de anexos.","Recomendación a la gerencia con su riesgo."]$evinvima_json$::jsonb;
  v_j2 := $evinvima_json${"version":1,"total":100,"criteria":[{"id":"analisis-del-requerimiento","name":"Análisis del requerimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Separa con precisión lo que existe, lo que puede generarse y lo que no, en los cuatro puntos."},{"level":3,"label":"Logrado","description":"Analiza los cuatro puntos con un error menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"decisiones-tecnicas","name":"Decisiones técnicas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Decide con fundamento la vida útil y el manejo del certificado vencido, sin aportar datos inexistentes."},{"level":3,"label":"Logrado","description":"Decisiones correctas con argumentos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"respuesta-trazable","name":"Respuesta trazable","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Carta punto por punto con evidencia ubicada en anexos, coherente con el expediente."},{"level":3,"label":"Logrado","description":"Carta clara con alguna referencia incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"evaluacion-de-riesgo-y-recomendacion","name":"Evaluación de riesgo y recomendación","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Compara alternativas con su consecuencia jurídica y comercial y recomienda una con claridad."},{"level":3,"label":"Logrado","description":"Recomienda una alternativa razonable con análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evinvima_json$::jsonb;
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


  -- ── Actividad invima-u3-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Después del registro' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Después del registro) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Actividad de la unidad 3 · Plan de cumplimiento poscomercialización';
  v_t2 := $evinvima_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y separa las cinco situaciones.</li><li>Para el cambio de fabricante del principio activo, define el trámite, la documentación de soporte y si se puede vender con el nuevo fabricante antes de la aprobación.</li><li>Explica al gerente comercial qué significa la vigencia indefinida del registro (Decreto 1474 de 2023) y qué condiciones la sostienen.</li><li>Define qué se hace con los tres reportes: plazos, canal, evaluación de causalidad y análisis de señal.</li><li>Responde a mercadeo sobre el comercial y los influenciadores con la norma aplicable y una alternativa permitida.</li><li>Prepara la lista de verificación para la visita del Invima a la bodega.</li><li>Prioriza las acciones por riesgo, revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar las obligaciones posteriores al registro a situaciones simultáneas.</li><li>Priorizar acciones por riesgo para el paciente y para el registro.</li><li>Justificar cada decisión en la norma.</li></ul>
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
  <tr><td>Modificación y vigencia del registro</td><td>25 %</td><td>Clasifica el cambio de fabricante como cambio de calidad, define su trámite con la guía del Invima sin implementarlo antes de tiempo y explica que la vigencia indefinida depende de mantener las condiciones aprobadas.</td><td>Decisiones correctas con una explicación incompleta de la vigencia.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Farmacovigilancia</td><td>25 %</td><td>Comunica el evento serio en 15 días calendario y los no serios en 90, por eReporting Industria, y propone análisis de señal.</td><td>Gestiona los reportes con un plazo o un canal impreciso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Publicidad</td><td>20 %</td><td>Explica por qué no proceden el comercial ni los influenciadores y propone una alternativa dirigida a profesionales.</td><td>Rechaza la propuesta con argumento general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Visita y priorización</td><td>20 %</td><td>Lista de verificación útil y prioridades ordenadas por riesgo para el paciente y para el registro.</td><td>Lista y prioridades razonables con vacíos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evinvima_html$;
  v_t3 := $evinvima_html$<h2>Caso de estudio</h2>
<p>Distribuciones Andes Pharma (ficticia) es titular del registro sanitario de unas tabletas de venta con fórmula médica. En la misma semana ocurre lo siguiente: compras propone cambiar el fabricante del principio activo por uno más barato; llegan tres reportes de eventos adversos, uno de ellos con hospitalización; mercadeo propone un comercial de televisión y una campaña con influenciadores; el gerente comercial afirma que «como el registro ya no vence, no hay que volver a tocarlo»; y el Invima anuncia una visita de inspección a la bodega del importador para el próximo mes (datos simulados). La gerente te pide un plan para no poner en riesgo el registro.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evinvima_html$;
  v_t4 := 'Plan de cumplimiento poscomercialización con calendario, decisiones y prioridades.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evinvima_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 9 de 1979; Ley 100 de 1993; Decreto 677 de 1995 en su versión vigente (normograma del Invima); Decreto 334 de 2022 (modificación de registros, información y publicidad de medicamentos) y Resolución 1896 de 2023 del Ministerio de Salud; Decreto 1474 de 2023 (vigencia indefinida de los registros de medicamentos); Resolución 2024015321 de 2024 del Invima (reportes de eventos adversos, vigente desde el 1 de marzo de 2025); Decreto 1156 de 2018 (fitoterapéuticos, que derogó el Decreto 2266 de 2004); Decreto 3249 de 2006 (suplementos dietarios); Decreto 4725 de 2005 (dispositivos médicos); Decisión 833 de la CAN (cosméticos). Cita en APA 7 o en el formato «norma, artículo».</p>$evinvima_html$;
  v_t7 := NULL;
  v_j1 := $evinvima_json$["Trámite y soporte del cambio de fabricante del principio activo.","Explicación de la vigencia indefinida y de las condiciones que la sostienen.","Gestión de los tres reportes de farmacovigilancia.","Respuesta a mercadeo con la norma y una alternativa.","Lista de verificación para la visita y priorización."]$evinvima_json$::jsonb;
  v_j2 := $evinvima_json${"version":1,"total":100,"criteria":[{"id":"modificacion-y-vigencia-del-registro","name":"Modificación y vigencia del registro","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Clasifica el cambio de fabricante como cambio de calidad, define su trámite con la guía del Invima sin implementarlo antes de tiempo y explica que la vigencia indefinida depende de mantener las condiciones aprobadas."},{"level":3,"label":"Logrado","description":"Decisiones correctas con una explicación incompleta de la vigencia."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacovigilancia","name":"Farmacovigilancia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Comunica el evento serio en 15 días calendario y los no serios en 90, por eReporting Industria, y propone análisis de señal."},{"level":3,"label":"Logrado","description":"Gestiona los reportes con un plazo o un canal impreciso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"publicidad","name":"Publicidad","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Explica por qué no proceden el comercial ni los influenciadores y propone una alternativa dirigida a profesionales."},{"level":3,"label":"Logrado","description":"Rechaza la propuesta con argumento general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"visita-y-priorizacion","name":"Visita y priorización","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Lista de verificación útil y prioridades ordenadas por riesgo para el paciente y para el registro."},{"level":3,"label":"Logrado","description":"Lista y prioridades razonables con vacíos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evinvima_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 3, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 3, updated_at = NOW()
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


  -- ── Actividad invima-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El registro sanitario, paso a paso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (El registro sanitario, paso a paso) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: clasificación y expediente de la metformina de Farmalia';
  v_t2 := $evinvima_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y lista lo que necesitas saber en cada fase.</li><li>Fase 1: clasifica el producto, define la modalidad del registro y cita las normas que aplican.</li><li>Fase 1: identifica con qué entidades se relacionará la empresa y para qué (registro, importación, vigilancia de la bodega).</li><li>Fase 2: arma el índice del expediente en tres bloques (legal, técnico y de calidad) con el soporte de cada documento.</li><li>Fase 2: indica qué evaluaciones aplican y qué debes verificar en fuentes oficiales antes de radicar (por ejemplo, si la molécula exige estudios de bioequivalencia según la norma vigente).</li><li>Fase 2: anticipa los tres requerimientos más probables y cómo los evitarías.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (clasificación y marco).</strong> Clasificación del producto, modalidad del registro, normas que aplican y entidades con las que se relacionará la empresa.</li>
  <li><strong>Fase 2 · Unidad 2 (expediente y evaluaciones).</strong> Índice del expediente con sus soportes, evaluaciones que aplican, verificaciones previas y plan para responder requerimientos.</li>
  <li><strong>Fase 3 · Unidad 3 (ciclo de vida).</strong> Control de cambios y modificaciones, condiciones que sostienen la vigencia del registro, sistema de farmacovigilancia, reglas de publicidad y preparación para visitas.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 2. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Definir la ruta regulatoria de un medicamento importado.</li><li>Construir el índice de un expediente de registro y anticipar requerimientos.</li></ul>
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
  <tr><td>Clasificación y marco</td><td>25 %</td><td>Clasificación, modalidad (importar y vender) y normas correctas, con un mapa de entidades preciso.</td><td>Correcto con alguna imprecisión menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Expediente</td><td>30 %</td><td>Índice completo en tres bloques, con el soporte de cada documento y coherencia entre ellos.</td><td>Índice adecuado con omisiones menores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Evaluaciones y verificaciones</td><td>20 %</td><td>Identifica las evaluaciones que aplican y verifica en fuentes oficiales lo que no puede suponerse, como la bioequivalencia.</td><td>Identifica las evaluaciones con alguna verificación ausente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Anticipación de requerimientos</td><td>15 %</td><td>Tres requerimientos probables y medidas concretas para evitarlos.</td><td>Requerimientos razonables con medidas generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evinvima_html$;
  v_t3 := $evinvima_html$<h2>Caso de estudio</h2>
<p>Farmalia S. A. S. (ficticia) es una empresa de Barranquilla que va a importar y vender en Colombia tabletas de metformina de 850 mg fabricadas en la India. Tiene una química farmacéutica como directora técnica, una bodega arrendada y presupuesto para un analista regulatorio. La gerencia quiere el producto en el mercado en doce meses y te encargó el proyecto regulatorio completo: desde la clasificación hasta las obligaciones posteriores al registro (datos simulados). En esta entrega construyes las fases 1 y 2.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evinvima_html$;
  v_t4 := 'Documento de avance con las fases 1 y 2 del proyecto regulatorio.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evinvima_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 9 de 1979; Ley 100 de 1993; Decreto 677 de 1995 en su versión vigente (normograma del Invima); Decreto 334 de 2022 (modificación de registros, información y publicidad de medicamentos) y Resolución 1896 de 2023 del Ministerio de Salud; Decreto 1474 de 2023 (vigencia indefinida de los registros de medicamentos); Resolución 2024015321 de 2024 del Invima (reportes de eventos adversos, vigente desde el 1 de marzo de 2025); Decreto 1156 de 2018 (fitoterapéuticos, que derogó el Decreto 2266 de 2004); Decreto 3249 de 2006 (suplementos dietarios); Decreto 4725 de 2005 (dispositivos médicos); Decisión 833 de la CAN (cosméticos). Cita en APA 7 o en el formato «norma, artículo».</p>$evinvima_html$;
  v_t7 := NULL;
  v_j1 := $evinvima_json$["Clasificación, modalidad y normas.","Mapa de entidades y para qué se relaciona con cada una.","Índice del expediente con soportes.","Evaluaciones aplicables y verificaciones en fuentes oficiales.","Requerimientos probables y cómo evitarlos."]$evinvima_json$::jsonb;
  v_j2 := $evinvima_json${"version":1,"total":100,"criteria":[{"id":"clasificacion-y-marco","name":"Clasificación y marco","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Clasificación, modalidad (importar y vender) y normas correctas, con un mapa de entidades preciso."},{"level":3,"label":"Logrado","description":"Correcto con alguna imprecisión menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"expediente","name":"Expediente","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Índice completo en tres bloques, con el soporte de cada documento y coherencia entre ellos."},{"level":3,"label":"Logrado","description":"Índice adecuado con omisiones menores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"evaluaciones-y-verificaciones","name":"Evaluaciones y verificaciones","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Identifica las evaluaciones que aplican y verifica en fuentes oficiales lo que no puede suponerse, como la bioequivalencia."},{"level":3,"label":"Logrado","description":"Identifica las evaluaciones con alguna verificación ausente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"anticipacion-de-requerimientos","name":"Anticipación de requerimientos","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Tres requerimientos probables y medidas concretas para evitarlos."},{"level":3,"label":"Logrado","description":"Requerimientos razonables con medidas generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evinvima_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 12, 8)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 12, updated_at = NOW()
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


  -- ── Actividad invima-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Después del registro' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Después del registro) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan regulatorio del ciclo de vida de la metformina de Farmalia';
  v_t2 := $evinvima_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar, evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 y 2; deja una tabla de cambios.</li><li>Fase 3: diseña el procedimiento de control de cambios con la clasificación de los cambios que exigen modificación del registro.</li><li>Fase 3: explica qué sostiene la vigencia indefinida del registro y qué revisiones periódicas hará la empresa para mantener las condiciones aprobadas.</li><li>Fase 3: describe el sistema de farmacovigilancia: responsable, fuentes de casos, plazos de reporte y análisis de señales.</li><li>Fase 3: escribe las reglas de publicidad y promoción para este producto y la lista de verificación para visitas.</li><li>Escribe un resumen ejecutivo de una página con el cronograma de doce meses, los riesgos y los recursos.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (clasificación y marco).</strong> Clasificación del producto, modalidad del registro, normas que aplican y entidades con las que se relacionará la empresa.</li>
  <li><strong>Fase 2 · Unidad 2 (expediente y evaluaciones).</strong> Índice del expediente con sus soportes, evaluaciones que aplican, verificaciones previas y plan para responder requerimientos.</li>
  <li><strong>Fase 3 · Unidad 3 (ciclo de vida).</strong> Control de cambios y modificaciones, condiciones que sostienen la vigencia del registro, sistema de farmacovigilancia, reglas de publicidad y preparación para visitas.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 2. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar el proyecto regulatorio en un plan coherente y corregido.</li><li>Diseñar las obligaciones posteriores al registro: cambios, condiciones de vigencia, farmacovigilancia y publicidad.</li><li>Comunicar a la gerencia riesgos, tiempos y recursos.</li></ul>
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
  <tr><td>Integración y mejora</td><td>15 %</td><td>Integra las fases con coherencia y documenta cada corrección.</td><td>Integra y corrige lo principal.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cambios y vigencia del registro</td><td>25 %</td><td>Control de cambios que distingue lo que exige aprobación previa y explica qué sostiene la vigencia indefinida del registro.</td><td>Correcto con alguna omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Farmacovigilancia</td><td>25 %</td><td>Sistema con responsable, fuentes, plazos correctos y gestión de señales.</td><td>Sistema adecuado con un plazo impreciso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Publicidad, visitas y resumen</td><td>25 %</td><td>Reglas correctas para un producto de venta con fórmula, lista de verificación útil y resumen ejecutivo con cronograma realista.</td><td>Elementos correctos con vacíos menores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evinvima_html$;
  v_t3 := $evinvima_html$<h2>Caso de estudio</h2>
<p>Farmalia S. A. S. (ficticia) es una empresa de Barranquilla que va a importar y vender en Colombia tabletas de metformina de 850 mg fabricadas en la India. Tiene una química farmacéutica como directora técnica, una bodega arrendada y presupuesto para un analista regulatorio. La gerencia quiere el producto en el mercado en doce meses y te encargó el proyecto regulatorio completo: desde la clasificación hasta las obligaciones posteriores al registro (datos simulados). En esta entrega terminas la fase 3 e integras todo el proyecto en el plan que la directora técnica presentará a la gerencia.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evinvima_html$;
  v_t4 := 'Plan regulatorio del ciclo de vida del producto, con resumen ejecutivo y cronograma.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evinvima_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 9 de 1979; Ley 100 de 1993; Decreto 677 de 1995 en su versión vigente (normograma del Invima); Decreto 334 de 2022 (modificación de registros, información y publicidad de medicamentos) y Resolución 1896 de 2023 del Ministerio de Salud; Decreto 1474 de 2023 (vigencia indefinida de los registros de medicamentos); Resolución 2024015321 de 2024 del Invima (reportes de eventos adversos, vigente desde el 1 de marzo de 2025); Decreto 1156 de 2018 (fitoterapéuticos, que derogó el Decreto 2266 de 2004); Decreto 3249 de 2006 (suplementos dietarios); Decreto 4725 de 2005 (dispositivos médicos); Decisión 833 de la CAN (cosméticos). Cita en APA 7 o en el formato «norma, artículo».</p>$evinvima_html$;
  v_t7 := NULL;
  v_j1 := $evinvima_json$["Fases 1 y 2 corregidas, con tabla de cambios.","Procedimiento de control de cambios y modificaciones.","Condiciones que sostienen la vigencia del registro y revisiones periódicas.","Sistema de farmacovigilancia.","Reglas de publicidad, lista para visitas y resumen ejecutivo."]$evinvima_json$::jsonb;
  v_j2 := $evinvima_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las fases con coherencia y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"cambios-y-vigencia-del-registro","name":"Cambios y vigencia del registro","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Control de cambios que distingue lo que exige aprobación previa y explica qué sostiene la vigencia indefinida del registro."},{"level":3,"label":"Logrado","description":"Correcto con alguna omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacovigilancia","name":"Farmacovigilancia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Sistema con responsable, fuentes, plazos correctos y gestión de señales."},{"level":3,"label":"Logrado","description":"Sistema adecuado con un plazo impreciso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"publicidad-visitas-y-resumen","name":"Publicidad, visitas y resumen","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reglas correctas para un producto de venta con fórmula, lista de verificación útil y resumen ejecutivo con cronograma realista."},{"level":3,"label":"Logrado","description":"Elementos correctos con vacíos menores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evinvima_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 13, 16)
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
         SET rubric = v_j2, grading_method = 'rubrica', weight = 16,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Foro invima-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu primer contacto con el Invima';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evinvima_html$<h2>Para empezar</h2>
<p>Piensa en una situación —un trámite, una visita, una alerta sanitaria o un producto que viste en una tienda— en la que te preguntaste si un producto estaba bien autorizado. Cuéntala en tres o cuatro líneas, sin nombres de empresas ni datos que permitan identificar a nadie.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evinvima_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué trámite o decisión regulatoria te gustaría poder manejar con seguridad al terminarlo?';
  v_t5 := $evinvima_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evinvima_html$;
  v_t6 := $evinvima_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evinvima_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué producto de los que usas a diario te cuesta clasificar: alimento, suplemento, cosmético o medicamento?', '¿Qué te preocupa más hoy: el expediente, los requerimientos o lo que pasa después del registro?']::text[];
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


  -- ── Foro invima-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El sistema sanitario colombiano' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (El sistema sanitario colombiano) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Qué es este producto?';
  v_t2 := 'Argumentar la clasificación sanitaria de un producto a partir de su composición y de lo que declara, y prever qué cambia si se modifica la etiqueta.';
  v_t3 := $evinvima_html$<h2>Caso del foro</h2>
<p>Una empresa emergente de Medellín (ficticia) quiere lanzar una bebida en polvo con colágeno hidrolizado, biotina y extracto de cúrcuma. El borrador de etiqueta dice: «reduce la inflamación de las articulaciones y mejora la piel en 30 días». El equipo de mercadeo pregunta si puede venderla como alimento o suplemento para «salir rápido» y quiere publicitarla con una influenciadora (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evinvima_html$;
  v_t4 := '¿Cómo clasificarías este producto con la etiqueta actual, qué cambiaría si se ajustan sus declaraciones y qué riesgo corre la empresa si lo clasifica mal?';
  v_t5 := $evinvima_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma de la categoría que propones y la frase de la etiqueta que decide la clasificación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.34 %.</li></ul>$evinvima_html$;
  v_t6 := $evinvima_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma de la categoría que propones y la frase de la etiqueta que decide la clasificación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evinvima_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué parte de la etiqueta pesa más en la clasificación y por qué?', '¿Qué documento del Invima consultarías si la clasificación sigue en duda?', '¿Qué cambia en la publicidad según la categoría que se elija?']::text[];
  v_j1 := $evinvima_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma de la categoría que propones y la frase de la etiqueta que decide la clasificación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evinvima_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 3.34, v_j1,
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
         SET grading_method = 'rubrica', weight = 3.34, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro invima-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'El registro sanitario, paso a paso' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (El registro sanitario, paso a paso) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Foro de interacción 2 · El requerimiento que llegó tarde';
  v_t2 := 'Decidir la mejor estrategia ante un requerimiento con poco tiempo y una prueba que no existe, y cómo responder de forma trazable.';
  v_t3 := $evinvima_html$<h2>Caso del foro</h2>
<p>Farmacéutica del Caribe (ficticia) recibió un requerimiento sobre el registro de un genérico. La analista que llevaba el trámite renunció y el requerimiento apareció en su correo cuando faltaban tres días para el vencimiento. Pide: la validación del método de disolución, la estabilidad en el envase de comercialización y una corrección del arte de la etiqueta. La validación del método nunca se hizo; la estabilidad existe; el arte se corrige en un día (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evinvima_html$;
  v_t4 := '¿Qué estrategia es la más responsable con tres días de plazo y una prueba que no existe, y cómo construirías una respuesta trazable?';
  v_t5 := $evinvima_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la consecuencia jurídica de cada opción (responder parcial, pedir prórroga o dejar vencer). Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$evinvima_html$;
  v_t6 := $evinvima_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la consecuencia jurídica de cada opción (responder parcial, pedir prórroga o dejar vencer).</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evinvima_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué pasa si el término se vence sin respuesta?', '¿Es preferible responder parcialmente, pedir prórroga o desistir y radicar de nuevo?', '¿Qué cambiarías en el proceso de la empresa para que no se repita?']::text[];
  v_j1 := $evinvima_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la consecuencia jurídica de cada opción (responder parcial, pedir prórroga o dejar vencer)."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evinvima_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 3.33, v_j1,
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
         SET grading_method = 'rubrica', weight = 3.33, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro invima-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Después del registro' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Después del registro) en Asuntos Regulatorios ante INVIMA.';
  END IF;
  v_t1 := 'Foro de interacción 3 · La pieza de la influenciadora';
  v_t2 := 'Evaluar los límites de la publicidad de medicamentos y las obligaciones que siguen al registro sanitario.';
  v_t3 := $evinvima_html$<h2>Caso del foro</h2>
<p>Un laboratorio ficticio tiene un analgésico de venta libre con registro vigente. Una influenciadora con un millón de seguidores publica un video: «Lo tomo todos los días para la migraña y para dormir; ¡es natural y no tiene efectos secundarios!». La marca le pagó la publicación, pero el guion no fue revisado por el área regulatoria. En los comentarios, dos personas cuentan que tuvieron dolor de estómago intenso (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evinvima_html$;
  v_t4 := '¿Qué incumplimientos ves en la pieza, quién responde por ellos y qué debe hacer el titular del registro ahora?';
  v_t5 := $evinvima_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma que limita la pieza y la obligación de farmacovigilancia que activa. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$evinvima_html$;
  v_t6 := $evinvima_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que limita la pieza y la obligación de farmacovigilancia que activa.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evinvima_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Cambia algo que el medicamento sea de venta libre?', '¿Qué hace el titular con los comentarios sobre dolor de estómago?', '¿Qué control interno evitaría una pieza así?']::text[];
  v_j1 := $evinvima_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma que limita la pieza y la obligación de farmacovigilancia que activa."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evinvima_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 3.33, v_j1,
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
         SET grading_method = 'rubrica', weight = 3.33, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  RAISE NOTICE 'Asuntos Regulatorios ante INVIMA: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evinvima$;


-- ════════════════════════════════════════════════════════════════
--  Validaciones y Calificaciones en la Industria Farmacéutica
--  3 quizzes · 5 actividades · 4 foros
-- ════════════════════════════════════════════════════════════════
DO $evvalid$
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
   WHERE kind = 'edvanta' AND title = 'Validaciones y Calificaciones en la Industria Farmacéutica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Validaciones y Calificaciones en la Industria Farmacéutica: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Calificar y validar no es lo mismo', 'Calificación de equipos e instalaciones', 'Validación de procesos, limpieza y métodos']::text[])) < 3 THEN
    RAISE NOTICE 'Validaciones y Calificaciones: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evvalid_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evvalid_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz valid-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calificar y validar no es lo mismo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Calificar y validar no es lo mismo) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Calificar y validar no es lo mismo';
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
       FALSE, FALSE, TRUE, 'publicado', 1, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 1, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Qué diferencia hay entre calificar y validar en la industria farmacéutica?';
    v_t4 := 'Se califica un equipo, una instalación o un sistema: se demuestra que está bien instalado y opera como debe. Se valida un proceso, una limpieza o un método: se demuestra que produce siempre el mismo resultado.';
    v_j1 := $evvalid_json${"external_id":"valid-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Los dos conceptos y su diferencia","outcome":"Los dos conceptos y su diferencia","source":"Anexo 15 de PIC/S y UE (2015), glosario y alcance."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se califica un equipo, una instalación o un sistema; se valida un proceso, una limpieza o un método.', TRUE, 'Correcto. La calificación demuestra que algo está bien instalado y opera; la validación, que un proceso da siempre el resultado.', 0),
      (v_pregunta, 'Calificar es la versión abreviada de validar y se usa cuando no hay tiempo para la validación completa.', FALSE, 'No es una versión abreviada: se aplican a objetos distintos y responden preguntas distintas.', 1),
      (v_pregunta, 'Se califica lo que compra la empresa y se valida lo que fabrica, sin importar si es equipo o proceso.', FALSE, 'El criterio no es compra o fabricación, sino si se demuestra un equipo o un resultado reproducible.', 2),
      (v_pregunta, 'Son sinónimos en la norma colombiana; la diferencia solo existe en las guías de la FDA de Estados Unidos.', FALSE, 'La distinción está en las BPM y en el Anexo 15 de PIC/S, no solo en la FDA.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'De estas cuatro tareas del plan de un laboratorio, ¿cuál es una calificación y no una validación?';
    v_t4 := 'La distribución de temperatura de un autoclave vacío demuestra que el equipo opera como se especificó: es calificación. Limpieza, método y lotes de producción son validaciones.';
    v_j1 := $evvalid_json${"external_id":"valid-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Los dos conceptos y su diferencia","outcome":"Los dos conceptos y su diferencia","source":"Anexo 15 de PIC/S y UE (2015), secciones de calificación y validación."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Demostrar que la limpieza del mezclador deja residuos por debajo del límite aceptado para el siguiente producto.', FALSE, 'Eso es validación de limpieza: demuestra que un procedimiento da un resultado.', 0),
      (v_pregunta, 'Demostrar que el método HPLC cuantifica el principio activo con exactitud y precisión suficientes en el rango.', FALSE, 'Eso es validación de un método analítico.', 1),
      (v_pregunta, 'Demostrar que un autoclave recién instalado alcanza y mantiene la temperatura en todos sus puntos sin carga.', TRUE, 'Correcto. Es una prueba de calificación de operación del equipo.', 2),
      (v_pregunta, 'Demostrar con lotes consecutivos de producción que los comprimidos cumplen todas sus especificaciones de calidad.', FALSE, 'Eso es validación de proceso.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un inspector pregunta en qué se basa el protocolo de calificación de un autoclave. El jefe de validación responde: «en las buenas prácticas de la industria». ¿Qué análisis es correcto?';
    v_t4 := 'En Colombia la exigencia de calificar y validar llega por las BPM de la Resolución 1160 de 2016. El Anexo 15 de PIC/S y las guías ICH son las referencias técnicas para definir cómo se hace y con qué criterio.';
    v_j1 := $evvalid_json${"external_id":"valid-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"De dónde viene la exigencia","outcome":"De dónde viene la exigencia","source":"Resolución 1160 de 2016; Anexo 15 de PIC/S."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La respuesta basta, porque el inspector solo revisa los resultados del protocolo y no su fundamento normativo.', FALSE, 'El fundamento se revisa: un criterio sin origen es difícil de defender en una inspección.', 0),
      (v_pregunta, 'Debe citar la norma ISO 9001, porque es la base de toda calificación y validación en la industria.', FALSE, 'ISO 9001 es un modelo de gestión de calidad general; no es la fuente de los requisitos de validación.', 1),
      (v_pregunta, 'La exigencia viene de las BPM de la Resolución 1160 de 2016; el Anexo 15 de PIC/S y las guías ICH sustentan el cómo.', TRUE, 'Correcto. La obligación es nacional y las guías técnicas fundamentan el diseño del protocolo.', 2),
      (v_pregunta, 'Debe citar la FDA, porque es la única autoridad con requisitos de validación aplicables a plantas en Colombia.', FALSE, 'Las guías de la FDA son referencia técnica útil, pero la obligación en Colombia viene de las BPM nacionales.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una planta validó un proceso con tres lotes en 2015 y desde entonces no revisa datos ni cambios. El gerente afirma: «el proceso está validado para siempre». ¿Cuál es la valoración más acertada?';
    v_t4 := 'La validación dejó de ser un evento único: después de calificar el proceso, se verifica de forma continua con datos de rutina y se revisa periódicamente, junto con el control de cambios.';
    v_j1 := $evvalid_json${"external_id":"valid-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"El enfoque de ciclo de vida y el Plan Maestro","outcome":"El enfoque de ciclo de vida y el Plan Maestro","source":"Guía de la FDA de validación de procesos (2011), etapa 3; Anexo 15 de PIC/S (2015), verificación continua."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta, porque una validación aprobada no caduca mientras no cambie el principio activo del producto.', FALSE, 'Pueden cambiar materias primas, equipos, proveedores o personal sin que cambie el principio activo.', 0),
      (v_pregunta, 'Es correcta si los tres lotes cumplieron con un margen amplio frente a todas las especificaciones del producto.', FALSE, 'Un buen resultado inicial no demuestra que el proceso siga bajo control años después.', 1),
      (v_pregunta, 'Es errada solo porque la norma exige repetir cada año la validación completa con otros tres lotes nuevos.', FALSE, 'No hay una revalidación anual obligatoria; se exige mantener el estado validado con datos.', 2),
      (v_pregunta, 'Es errada: el estado validado se mantiene con verificación continua o revisión periódica y control de cambios.', TRUE, 'Correcto. Con el enfoque de ciclo de vida, la validación no es un evento único.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz valid-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calificación de equipos e instalaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Calificación de equipos e instalaciones) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Calificación de equipos e instalaciones';
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
       FALSE, FALSE, TRUE, 'publicado', 2, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 2, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := '¿Qué demuestra la calificación de operación (OQ) de un equipo?';
    v_t4 := 'DQ: el diseño cumple los requisitos. IQ: está instalado como se diseñó. OQ: opera según lo especificado en el rango previsto. PQ: rinde de forma reproducible con la carga real en la rutina.';
    v_j1 := $evvalid_json${"external_id":"valid-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"DQ, IQ, OQ y PQ","outcome":"DQ, IQ, OQ y PQ","source":"Anexo 15 de PIC/S y UE (2015), etapas de calificación."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que el equipo llegó completo e instalado según el diseño, con manuales, conexiones y certificados de calibración.', FALSE, 'Eso lo demuestra la calificación de instalación (IQ).', 0),
      (v_pregunta, 'Que el equipo funciona según lo especificado en todo el rango previsto, incluidas alarmas y condiciones límite.', TRUE, 'Correcto. La OQ prueba el funcionamiento del equipo en el rango en que se va a usar.', 1),
      (v_pregunta, 'Que con el producto o una carga real el equipo rinde de forma reproducible en las condiciones de la rutina.', FALSE, 'Eso lo demuestra la calificación de desempeño (PQ).', 2),
      (v_pregunta, 'Que el diseño propuesto cumple los requisitos del usuario y las BPM antes de comprar o construir el equipo.', FALSE, 'Eso lo demuestra la calificación de diseño (DQ).', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'El protocolo de una cámara de estabilidad nueva dice: «verificar coincidencia con la orden de compra, conexión eléctrica, manuales y certificados de calibración de los sensores». ¿A qué etapa corresponde?';
    v_t4 := 'La IQ verifica que el equipo recibido corresponde a lo especificado, que está instalado correctamente y que trae su documentación y sus calibraciones.';
    v_j1 := $evvalid_json${"external_id":"valid-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"DQ, IQ, OQ y PQ","outcome":"DQ, IQ, OQ y PQ","source":"Anexo 15 de PIC/S y UE (2015), calificación de instalación."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'A la calificación de operación, porque verifica los sensores que controlan la temperatura y la humedad.', FALSE, 'Revisar que los certificados existan no es probar el funcionamiento: eso viene después.', 0),
      (v_pregunta, 'A la calificación de diseño, porque compara el equipo con la orden de compra aprobada por la empresa.', FALSE, 'La DQ se hace antes de comprar; aquí ya se verifica lo recibido e instalado.', 1),
      (v_pregunta, 'A la calificación de desempeño, porque los sensores calibrados son los que dan resultados en la rutina.', FALSE, 'La PQ prueba el desempeño con carga real, no la documentación de instalación.', 2),
      (v_pregunta, 'A la calificación de instalación, porque verifica que lo recibido e instalado corresponde al diseño.', TRUE, 'Correcto. Documentos, conexiones y calibraciones de lo recibido son pruebas de IQ.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'La calificación de un sistema de agua purificada incluye, después de las fases intensivas, una fase de un año de monitoreo. ¿Por qué se exige un periodo tan largo?';
    v_t4 := 'La calificación de sistemas de agua suele hacerse en tres fases: dos intensivas de varias semanas y una tercera de un año, que demuestra el control sostenido frente a la variación estacional del agua de alimentación y del sistema.';
    v_j1 := $evvalid_json${"external_id":"valid-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Sistemas críticos: agua, aire y vapor","outcome":"Sistemas críticos: agua, aire y vapor","source":"OMS TRS 1033, anexo 3 (agua para uso farmacéutico), calificación del sistema."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque la calidad del agua de alimentación y el desempeño del sistema cambian con las estaciones y el tiempo.', TRUE, 'Correcto. Solo un año de datos muestra la variación estacional y el control a largo plazo.', 0),
      (v_pregunta, 'Porque el Invima exige un año de producción con el sistema antes de expedir el certificado de BPM de la planta.', FALSE, 'La fase larga responde a la variabilidad del sistema, no a un requisito de producción previa.', 1),
      (v_pregunta, 'Porque las resinas y las membranas tardan un año en estabilizarse y antes de eso no producen agua utilizable.', FALSE, 'El sistema produce agua desde las primeras fases; lo que se demuestra en el año es su control sostenido.', 2),
      (v_pregunta, 'Porque la fase de un año reemplaza la calificación de instalación y de operación, que así ya no son necesarias.', FALSE, 'Las fases de monitoreo vienen después de la IQ y la OQ, no las reemplazan.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En la PQ de un cuarto frío de 2 a 8 °C, un sensor de una esquina registra 9,2 °C durante la prueba de apertura de puerta. El equipo propone cambiar el criterio a 2–10 °C y aprobar. ¿Cuál es la valoración más acertada?';
    v_t4 := 'Los criterios de aceptación se aprueban antes de ejecutar el protocolo. Un resultado fuera de criterio es una desviación: se investiga la causa, se corrige y se repite la prueba; un cambio de criterio solo procede con justificación científica aprobada antes de la nueva ejecución.';
    v_j1 := $evvalid_json${"external_id":"valid-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Protocolos, desviaciones y recalificación","outcome":"Protocolos, desviaciones y recalificación","source":"Anexo 15 de PIC/S y UE (2015), desviaciones durante la calificación."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se acepta si el gerente de calidad firma el cambio, porque tiene la autoridad para modificar los protocolos.', FALSE, 'Nadie puede cambiar un criterio después de ver el resultado para aprobarlo: eso invalida la prueba.', 0),
      (v_pregunta, 'Se acepta, porque 9,2 °C es una diferencia pequeña que no afecta a los medicamentos refrigerados almacenados.', FALSE, 'El criterio de 2 a 8 °C viene del producto; superarlo puede afectar su estabilidad.', 1),
      (v_pregunta, 'No se acepta: se registra la desviación, se investiga, se corrige (flujo de aire, zona restringida) y se repite.', TRUE, 'Correcto. El criterio estaba aprobado antes de ejecutar; la desviación se gestiona y la prueba se repite.', 2),
      (v_pregunta, 'No se acepta, y la única solución posible es comprar un cuarto frío nuevo con mejor capacidad de enfriamiento.', FALSE, 'Hay alternativas: redistribuir el aire, restringir la zona o ajustar el procedimiento de apertura.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz valid-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Validación de procesos, limpieza y métodos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Validación de procesos, limpieza y métodos) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Validación de procesos, limpieza y métodos';
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
       FALSE, FALSE, TRUE, 'publicado', 3, 10)
    RETURNING id INTO v_eval;
  END IF;
  UPDATE aula_assessments SET status = 'publicado', updated_at = NOW() WHERE id = v_eval AND status = 'borrador';

  IF EXISTS (SELECT 1 FROM aula_attempts WHERE assessment_id = v_eval) THEN
    RAISE NOTICE 'El quiz % ya tiene intentos: no se modifican sus preguntas ni su configuración.', v_t1;
  ELSE
    UPDATE aula_assessments
       SET module_id = v_unidad, instructions_html = v_t2, is_required = TRUE,
           passing_score = 70, max_attempts = 2, shuffle_options = FALSE,
           show_answers_after_submit = TRUE, sort_order = 3, weight = 10, updated_at = NOW()
     WHERE id = v_eval;
    DELETE FROM aula_assessment_questions WHERE assessment_id = v_eval;


    v_t3 := 'Según el enfoque de ciclo de vida de la guía de la FDA de 2011, ¿cuáles son las etapas de la validación de procesos?';
    v_t4 := 'La guía de la FDA ordena la validación en tres etapas: diseño del proceso (conocimiento y estrategia de control), calificación del proceso (instalaciones, equipos y lotes de calificación) y verificación continua del proceso en la rutina.';
    v_j1 := $evvalid_json${"external_id":"valid-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Validación de procesos","outcome":"Validación de procesos","source":"FDA, Process Validation: General Principles and Practices (2011)."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Compra de equipos, capacitación del personal y auditoría externa del proceso por parte de un tercero.', FALSE, 'Esas actividades pueden apoyar, pero no son las etapas de la validación de procesos.', 0),
      (v_pregunta, 'Fabricación de un lote piloto, aprobación del Invima y archivo definitivo del informe de validación.', FALSE, 'La validación no termina en un archivo: continúa con la verificación durante la rutina.', 1),
      (v_pregunta, 'Diseño del proceso, calificación del proceso y verificación continua durante la producción de rutina.', TRUE, 'Correcto. Son las tres etapas del ciclo de vida.', 2),
      (v_pregunta, 'Calificación de instalación, de operación y de desempeño de cada equipo, sin otras etapas posteriores.', FALSE, 'Esas son etapas de calificación de equipos, que hacen parte de la segunda etapa, no el ciclo completo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un laboratorio valida un método HPLC para la valoración del principio activo en comprimidos (prueba cuantitativa del componente mayoritario). Según ICH Q2, ¿qué parámetros debe evaluar?';
    v_t4 := 'ICH Q2 asigna los parámetros según el tipo de prueba. Para la valoración del componente mayoritario se evalúan especificidad, exactitud, precisión, linealidad y rango; los límites de detección y de cuantificación aplican a impurezas y trazas.';
    v_j1 := $evvalid_json${"external_id":"valid-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Validación de métodos analíticos","outcome":"Validación de métodos analíticos","source":"ICH Q2(R2), validación de procedimientos analíticos."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo la especificidad, porque la valoración consiste en identificar el principio activo en la muestra.', FALSE, 'La valoración cuantifica: necesita además exactitud, precisión, linealidad y rango.', 0),
      (v_pregunta, 'Especificidad, exactitud, precisión, linealidad y rango; no requiere límites de detección ni cuantificación.', TRUE, 'Correcto. Los límites se exigen para impurezas o trazas, no para valorar el componente mayoritario.', 1),
      (v_pregunta, 'Los límites de detección y de cuantificación, porque son los que definen la sensibilidad de una valoración.', FALSE, 'Para el componente mayoritario esos límites no son relevantes: se trabaja lejos de ellos.', 2),
      (v_pregunta, 'Todos los parámetros, incluidos los límites, porque ICH no distingue entre los tipos de prueba analítica.', FALSE, 'ICH sí distingue: los parámetros dependen del tipo de prueba.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un tren de equipos compartido fabrica tres productos: A, muy soluble, con exposición diaria permitida (PDE) de 5 mg; B, poco soluble, con PDE de 1 mg; y C, soluble, con PDE de 0,05 mg. ¿Cuál es el enfoque correcto para el peor caso de la validación de limpieza?';
    v_t4 := 'El peor caso combina la dificultad de limpieza (solubilidad, adherencia) y la toxicidad o potencia (PDE más baja). Se valida con el más difícil de limpiar y con el límite más estricto, que viene del producto más potente.';
    v_j1 := $evvalid_json${"external_id":"valid-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Validación de limpieza","outcome":"Validación de limpieza","source":"Anexo 15 de PIC/S y UE (2015), validación de limpieza; guía de la EMA sobre límites de exposición basados en la salud."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Validar solo con A, porque es el producto que se fabrica con más frecuencia en ese tren de equipos.', FALSE, 'La frecuencia de fabricación no define el peor caso de limpieza.', 0),
      (v_pregunta, 'Validar con B, el más difícil de limpiar, y fijar el límite con C, el de menor PDE.', TRUE, 'Correcto. La dificultad de limpieza y la potencia se combinan en el peor caso.', 1),
      (v_pregunta, 'Validar solo con C, porque si se limpia bien el más potente quedan cubiertos todos los demás productos.', FALSE, 'C es soluble: no representa la dificultad de limpieza de B.', 2),
      (v_pregunta, 'Validar los tres por separado, porque las guías no permiten agrupar productos en la validación de limpieza.', FALSE, 'La agrupación con peor caso justificado sí está permitida.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un laboratorio empieza a usar un método de valoración de la farmacopea y decide no hacer ninguna prueba, porque «los métodos farmacopeicos ya están validados». ¿Cuál es la valoración más acertada?';
    v_t4 := 'Los métodos compendiales no requieren validación completa, pero sí verificación: demostrar que funcionan con la matriz del producto, los equipos y el personal del laboratorio.';
    v_j1 := $evvalid_json${"external_id":"valid-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Validación de métodos analíticos","outcome":"Validación de métodos analíticos","source":"USP, capítulo 1226 (verificación de procedimientos compendiales); ICH Q2(R2)."}$evvalid_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'valid-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada: los métodos de farmacopea están validados y el laboratorio no necesita hacer ninguna prueba propia.', FALSE, 'Validado en general no significa idóneo con este producto, estos equipos y este personal.', 0),
      (v_pregunta, 'Es adecuada si el analista que lo ejecuta tiene experiencia demostrada con la técnica de cromatografía.', FALSE, 'La experiencia del analista no reemplaza la verificación del método en el laboratorio.', 1),
      (v_pregunta, 'Es incompleta: todo método de farmacopea debe validarse completo, igual que un método desarrollado en casa.', FALSE, 'No se exige validación completa: se exige verificación de su idoneidad.', 2),
      (v_pregunta, 'Es incompleta: no se valida completo, pero sí se verifica su idoneidad con el producto y en el laboratorio.', TRUE, 'Correcto. La verificación demuestra que el método funciona en las condiciones reales de uso.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad valid-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calificar y validar no es lo mismo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Calificar y validar no es lo mismo) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Borrador del plan maestro de validación';
  v_t2 := $evvalid_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y haz el inventario completo de equipos, sistemas, procesos, limpiezas, métodos y sistemas informáticos.</li><li>Clasifica cada elemento: se califica o se valida, y con qué etapas.</li><li>Anota el estado actual de cada uno y la brecha frente a lo que exige la referencia técnica.</li><li>Prioriza las brechas con un criterio de riesgo explícito (impacto en el producto, en el paciente y probabilidad).</li><li>Redacta la estructura del plan maestro: política, alcance, organización y responsabilidades, inventario, estrategia, control de cambios y desviaciones, y cronograma.</li><li>Propón el cronograma de seis meses con lo que debe estar listo antes de la visita.</li><li>Revisa con la rúbrica y sube tu borrador en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar los elementos de una planta en lo que se califica y lo que se valida.</li><li>Priorizar por riesgo para el producto y el paciente.</li><li>Estructurar un plan maestro de validación defendible en una inspección.</li></ul>
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
  <tr><td>Inventario y clasificación</td><td>25 %</td><td>Inventario completo, bien clasificado y con las etapas correctas para cada elemento.</td><td>Inventario casi completo con una clasificación dudosa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Brechas y priorización</td><td>25 %</td><td>Identifica las brechas críticas (calificaciones sin revisión, métodos transferidos sin estudio) y prioriza con un criterio de riesgo explícito.</td><td>Identifica las brechas principales con una priorización general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Estructura del plan</td><td>25 %</td><td>Plan con todos sus componentes, coherente con el Anexo 15 y defendible en una inspección.</td><td>Plan adecuado con un componente débil.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cronograma</td><td>15 %</td><td>Cronograma realista que pone primero lo crítico para la visita.</td><td>Cronograma razonable con alguna secuencia dudosa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvalid_html$;
  v_t3 := $evvalid_html$<h2>Caso de estudio</h2>
<p>Laboratorios Sierra Verde (ficticio), de Medellín, fabrica sólidos orales y líquidos no estériles. Tiene: dos mezcladoras, un granulador de lecho fluido, dos tableteadoras, una recubridora, una llenadora de líquidos, un sistema de agua purificada, el sistema de aire de las áreas de producción, tres cromatógrafos líquidos, un sistema informático de laboratorio, ocho productos y dos procedimientos de limpieza. Algunos equipos se calificaron en 2016 y nunca se revisaron; los métodos analíticos de dos productos se transfirieron de otra planta sin estudio; no existe plan maestro de validación. En seis meses espera la visita de renovación de su certificado de BPM (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evvalid_html$;
  v_t4 := 'Borrador del plan maestro de validación con inventario, priorización y cronograma.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evvalid_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016 (BPM); Anexo 15 de las guías de BPM de PIC/S y de la Unión Europea (calificación y validación, revisión de 2015); guía de la FDA «Process Validation: General Principles and Practices» (2011); ICH Q2(R2), Q8, Q9 y Q10; OMS TRS 1033, anexo 3 (agua para uso farmacéutico); guía de la EMA sobre límites de exposición basados en la salud para instalaciones compartidas. Cita en APA 7 o en el formato «norma o guía, sección».</p>$evvalid_html$;
  v_t7 := NULL;
  v_j1 := $evvalid_json$["Inventario clasificado en calificación o validación, con etapas.","Estado actual y brechas.","Priorización por riesgo con su criterio.","Estructura del plan maestro de validación.","Cronograma de seis meses."]$evvalid_json$::jsonb;
  v_j2 := $evvalid_json${"version":1,"total":100,"criteria":[{"id":"inventario-y-clasificacion","name":"Inventario y clasificación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Inventario completo, bien clasificado y con las etapas correctas para cada elemento."},{"level":3,"label":"Logrado","description":"Inventario casi completo con una clasificación dudosa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"brechas-y-priorizacion","name":"Brechas y priorización","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica las brechas críticas (calificaciones sin revisión, métodos transferidos sin estudio) y prioriza con un criterio de riesgo explícito."},{"level":3,"label":"Logrado","description":"Identifica las brechas principales con una priorización general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"estructura-del-plan","name":"Estructura del plan","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan con todos sus componentes, coherente con el Anexo 15 y defendible en una inspección."},{"level":3,"label":"Logrado","description":"Plan adecuado con un componente débil."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"cronograma","name":"Cronograma","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Cronograma realista que pone primero lo crítico para la visita."},{"level":3,"label":"Logrado","description":"Cronograma razonable con alguna secuencia dudosa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvalid_json$::jsonb;
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


  -- ── Actividad valid-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calificación de equipos e instalaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Calificación de equipos e instalaciones) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Protocolo y desviación en la calificación de un cuarto frío';
  v_t2 := $evvalid_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y lista lo que debe demostrar cada etapa: IQ, OQ y PQ.</li><li>Para cada etapa, escribe las pruebas, el criterio de aceptación y la evidencia que se archiva.</li><li>Define el número y la ubicación de los sensores del mapeo y justifica cada ubicación crítica.</li><li>Analiza los resultados del caso: qué cumple y qué no.</li><li>Redacta el informe de desviación del sensor de la puerta: descripción, impacto, causa probable, acción y repetición de la prueba.</li><li>Define qué uso del cuarto frío se autoriza mientras se cierra la desviación y qué procedimiento de emergencia se necesita por el resultado del corte de energía.</li><li>Revisa con la rúbrica y sube tu documento en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar las pruebas de IQ, OQ y PQ de un equipo con sus criterios de aceptación.</li><li>Analizar datos de mapeo de temperatura.</li><li>Gestionar una desviación de calificación sin cambiar el criterio después del resultado.</li></ul>
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
  <tr><td>Diseño del protocolo</td><td>30 %</td><td>Pruebas y criterios completos y coherentes en las tres etapas, con evidencia definida.</td><td>Protocolo adecuado con alguna prueba ausente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Análisis de datos</td><td>25 %</td><td>Interpreta bien el mapeo y el corte de energía, y relaciona cada resultado con el riesgo para el producto.</td><td>Interpretación correcta con una relación débil con el riesgo.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Gestión de la desviación</td><td>25 %</td><td>Investiga sin cambiar el criterio, propone causa y acción verificables y define la repetición de la prueba.</td><td>Gestiona la desviación con una acción poco verificable.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Decisión de uso y contingencia</td><td>10 %</td><td>Restringe con criterio el uso del cuarto y define la respuesta ante un corte de energía.</td><td>Decisión razonable con una contingencia general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvalid_html$;
  v_t3 := $evvalid_html$<h2>Caso de estudio</h2>
<p>Distribuidora Farmacéutica del Sur (ficticia), de Neiva, instaló un cuarto frío de 2 a 8 °C y 40 m³ para almacenar medicamentos terminados. Debe calificarlo antes de usarlo. En la prueba de desempeño de verano, con carga simulada, 15 sensores registraron durante 72 horas: 14 sensores entre 3,1 y 7,4 °C; el sensor de la esquina junto a la puerta llegó a 9,2 °C durante 11 minutos en las aperturas de puerta de la mañana. En la prueba de corte de energía, la temperatura salió de rango a los 48 minutos (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evvalid_html$;
  v_t4 := 'Esquema del protocolo de calificación, análisis de resultados e informe de desviación.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evvalid_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016 (BPM); Anexo 15 de las guías de BPM de PIC/S y de la Unión Europea (calificación y validación, revisión de 2015); guía de la FDA «Process Validation: General Principles and Practices» (2011); ICH Q2(R2), Q8, Q9 y Q10; OMS TRS 1033, anexo 3 (agua para uso farmacéutico); guía de la EMA sobre límites de exposición basados en la salud para instalaciones compartidas. Cita en APA 7 o en el formato «norma o guía, sección».</p>$evvalid_html$;
  v_t7 := NULL;
  v_j1 := $evvalid_json$["Pruebas, criterios y evidencias de IQ, OQ y PQ.","Plan de ubicación de sensores justificado.","Análisis de los resultados del mapeo y del corte de energía.","Informe de desviación con acción y repetición.","Decisión de uso y procedimiento de emergencia."]$evvalid_json$::jsonb;
  v_j2 := $evvalid_json${"version":1,"total":100,"criteria":[{"id":"diseno-del-protocolo","name":"Diseño del protocolo","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Pruebas y criterios completos y coherentes en las tres etapas, con evidencia definida."},{"level":3,"label":"Logrado","description":"Protocolo adecuado con alguna prueba ausente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"analisis-de-datos","name":"Análisis de datos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Interpreta bien el mapeo y el corte de energía, y relaciona cada resultado con el riesgo para el producto."},{"level":3,"label":"Logrado","description":"Interpretación correcta con una relación débil con el riesgo."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"gestion-de-la-desviacion","name":"Gestión de la desviación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Investiga sin cambiar el criterio, propone causa y acción verificables y define la repetición de la prueba."},{"level":3,"label":"Logrado","description":"Gestiona la desviación con una acción poco verificable."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"decision-de-uso-y-contingencia","name":"Decisión de uso y contingencia","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Restringe con criterio el uso del cuarto y define la respuesta ante un corte de energía."},{"level":3,"label":"Logrado","description":"Decisión razonable con una contingencia general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvalid_json$::jsonb;
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


  -- ── Actividad valid-u3-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Validación de procesos, limpieza y métodos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Validación de procesos, limpieza y métodos) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Actividad de la unidad 3 · Estrategia de validación de limpieza con límites basados en la salud';
  v_t2 := $evvalid_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee los datos y elige el producto peor caso para la limpieza (dificultad) y el producto que fija el límite (potencia); justifica.</li><li>Calcula el arrastre máximo permitido (MACO) de C con la fórmula MACO = PDE de C × tamaño de lote del siguiente ÷ dosis diaria máxima del siguiente, usando el siguiente producto más restrictivo.</li><li>Convierte el MACO a µg/cm² y a µg por hisopo de 25 cm², y corrige por la recuperación del 80 %.</li><li>Calcula el límite con el criterio de 10 ppm para el mismo caso y compáralo con el basado en la salud.</li><li>Decide el criterio de aceptación final y explica por qué.</li><li>Diseña el muestreo: puntos críticos, hisopo y enjuague, número de corridas, tiempo máximo antes de limpiar y tiempo máximo de equipo limpio.</li><li>Revisa con la rúbrica y sube tu estrategia en PDF o DOCX con los cálculos a la vista.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Calcular un límite de arrastre con la exposición diaria permitida.</li><li>Seleccionar el peor caso de limpieza con criterios explícitos.</li><li>Diseñar el muestreo y los criterios de aceptación de una validación de limpieza.</li></ul>
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
  <tr><td>Selección del peor caso</td><td>20 %</td><td>Elige B por dificultad y C por potencia, con criterios explícitos.</td><td>Selección correcta con justificación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Cálculos</td><td>35 %</td><td>Cálculos correctos y trazables: MACO, µg/cm², µg por hisopo y corrección por recuperación.</td><td>Cálculos correctos con un error menor de conversión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Criterio de aceptación</td><td>20 %</td><td>Compara con 10 ppm, elige el criterio más protector y lo justifica con la guía.</td><td>Elige un criterio razonable con justificación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan de muestreo</td><td>15 %</td><td>Puntos críticos, método de muestreo, corridas y tiempos de espera bien definidos.</td><td>Plan adecuado con una omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvalid_html$;
  v_t3 := $evvalid_html$<h2>Caso de estudio</h2>
<p>En Laboratorios Monteverde (ficticio), un tren compartido de mezclador y tableteadora fabrica cuatro productos (datos simulados). A: PDE 5 mg/día, muy soluble, lote de 300 kg, dosis diaria máxima de 2.000 mg. B: PDE 1 mg/día, poco soluble, lote de 150 kg, dosis diaria máxima de 400 mg. C: hormona potente, PDE 0,005 mg/día, solubilidad media, lote de 50 kg, dosis diaria máxima de 2 mg. D: PDE 2 mg/día, solubilidad media, lote de 200 kg, dosis diaria máxima de 1.000 mg. El área de contacto del tren es de 60.000 cm²; el hisopo muestrea 25 cm² y el estudio de recuperación dio 80 %. Hoy la empresa usa como único criterio «visualmente limpio y 10 ppm».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evvalid_html$;
  v_t4 := 'Estrategia de validación de limpieza con cálculos, criterio de aceptación y plan de muestreo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evvalid_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016 (BPM); Anexo 15 de las guías de BPM de PIC/S y de la Unión Europea (calificación y validación, revisión de 2015); guía de la FDA «Process Validation: General Principles and Practices» (2011); ICH Q2(R2), Q8, Q9 y Q10; OMS TRS 1033, anexo 3 (agua para uso farmacéutico); guía de la EMA sobre límites de exposición basados en la salud para instalaciones compartidas. Cita en APA 7 o en el formato «norma o guía, sección».</p>$evvalid_html$;
  v_t7 := NULL;
  v_j1 := $evvalid_json$["Peor caso de limpieza y producto que fija el límite, con su justificación.","Cálculo del MACO basado en la PDE, por área y por hisopo, corregido por recuperación.","Comparación con el criterio de 10 ppm y decisión del criterio final.","Plan de muestreo, número de corridas y tiempos de espera."]$evvalid_json$::jsonb;
  v_j2 := $evvalid_json${"version":1,"total":100,"criteria":[{"id":"seleccion-del-peor-caso","name":"Selección del peor caso","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Elige B por dificultad y C por potencia, con criterios explícitos."},{"level":3,"label":"Logrado","description":"Selección correcta con justificación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"calculos","name":"Cálculos","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Cálculos correctos y trazables: MACO, µg/cm², µg por hisopo y corrección por recuperación."},{"level":3,"label":"Logrado","description":"Cálculos correctos con un error menor de conversión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"criterio-de-aceptacion","name":"Criterio de aceptación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Compara con 10 ppm, elige el criterio más protector y lo justifica con la guía."},{"level":3,"label":"Logrado","description":"Elige un criterio razonable con justificación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-de-muestreo","name":"Plan de muestreo","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Puntos críticos, método de muestreo, corridas y tiempos de espera bien definidos."},{"level":3,"label":"Logrado","description":"Plan adecuado con una omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvalid_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 3, 12)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 3, updated_at = NOW()
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


  -- ── Actividad valid-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calificación de equipos e instalaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Calificación de equipos e instalaciones) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: plan maestro y calificación de la línea de jarabes';
  v_t2 := $evvalid_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y lista los elementos de la línea.</li><li>Fase 1: clasifica cada elemento (calificación o validación), prioriza por riesgo y escribe el plan maestro con responsabilidades y cronograma de nueve meses.</li><li>Fase 2: diseña la calificación del sistema de agua: requisitos, DQ, IQ, OQ, PQ y las tres fases de monitoreo con puntos de muestreo, pruebas y límites de alerta y de acción.</li><li>Fase 2: diseña la calificación del tanque: pruebas de IQ, OQ (agitación, calentamiento, alarmas) y PQ con criterios.</li><li>Fase 2: escribe el procedimiento que seguirás si un resultado de calificación sale de criterio.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (alcance y plan).</strong> Plan maestro de validación de la línea: inventario, clasificación en calificación o validación, priorización por riesgo, responsabilidades y cronograma.</li>
  <li><strong>Fase 2 · Unidad 2 (calificación).</strong> Calificación del sistema de agua (de DQ a PQ y sus fases de monitoreo) y del tanque de fabricación, con criterios de aceptación y manejo de desviaciones.</li>
  <li><strong>Fase 3 · Unidad 3 (validación).</strong> Estrategia de validación del proceso, validación de limpieza del tanque y plan de validación del método analítico.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 2. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Delimitar el alcance de un programa de validación con un plan maestro.</li><li>Diseñar la calificación de un sistema crítico y de un equipo de proceso.</li></ul>
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
  <tr><td>Plan maestro</td><td>25 %</td><td>Inventario clasificado, priorización explícita y cronograma realista con la ruta crítica.</td><td>Plan adecuado con una omisión menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Calificación del sistema de agua</td><td>30 %</td><td>Etapas completas, tres fases de monitoreo con puntos, pruebas y límites justificados.</td><td>Calificación correcta con algún límite o punto ausente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Calificación del tanque</td><td>20 %</td><td>Pruebas de IQ, OQ y PQ pertinentes con criterios medibles.</td><td>Pruebas adecuadas con criterios generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Manejo de desviaciones</td><td>15 %</td><td>Procedimiento que impide cambiar criterios después del resultado e incluye investigación y repetición.</td><td>Procedimiento razonable con un paso débil.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvalid_html$;
  v_t3 := $evvalid_html$<h2>Caso de estudio</h2>
<p>Laboratorios Cordillera (ficticio), de Rionegro (Antioquia), instala una línea nueva de jarabes: un sistema de agua purificada por ósmosis inversa, un tanque de fabricación de 2.000 L con agitador y chaqueta de calentamiento, una llenadora y el sistema de aire del área. El primer producto será un jarabe con un principio activo y conservantes, valorado con un método HPLC desarrollado en casa. La planta quiere producir para la venta en nueve meses y tú eres la persona que la dirección técnica encargó del programa de validación (datos simulados). En esta entrega construyes las fases 1 y 2.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evvalid_html$;
  v_t4 := 'Documento de avance con el plan maestro y los esquemas de calificación.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evvalid_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016 (BPM); Anexo 15 de las guías de BPM de PIC/S y de la Unión Europea (calificación y validación, revisión de 2015); guía de la FDA «Process Validation: General Principles and Practices» (2011); ICH Q2(R2), Q8, Q9 y Q10; OMS TRS 1033, anexo 3 (agua para uso farmacéutico); guía de la EMA sobre límites de exposición basados en la salud para instalaciones compartidas. Cita en APA 7 o en el formato «norma o guía, sección».</p>$evvalid_html$;
  v_t7 := NULL;
  v_j1 := $evvalid_json$["Plan maestro de la línea con priorización y cronograma.","Calificación del sistema de agua con sus fases.","Calificación del tanque de fabricación.","Procedimiento ante resultados fuera de criterio."]$evvalid_json$::jsonb;
  v_j2 := $evvalid_json${"version":1,"total":100,"criteria":[{"id":"plan-maestro","name":"Plan maestro","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Inventario clasificado, priorización explícita y cronograma realista con la ruta crítica."},{"level":3,"label":"Logrado","description":"Plan adecuado con una omisión menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"calificacion-del-sistema-de-agua","name":"Calificación del sistema de agua","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Etapas completas, tres fases de monitoreo con puntos, pruebas y límites justificados."},{"level":3,"label":"Logrado","description":"Calificación correcta con algún límite o punto ausente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"calificacion-del-tanque","name":"Calificación del tanque","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Pruebas de IQ, OQ y PQ pertinentes con criterios medibles."},{"level":3,"label":"Logrado","description":"Pruebas adecuadas con criterios generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"manejo-de-desviaciones","name":"Manejo de desviaciones","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Procedimiento que impide cambiar criterios después del resultado e incluye investigación y repetición."},{"level":3,"label":"Logrado","description":"Procedimiento razonable con un paso débil."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvalid_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 12, 8)
    RETURNING id INTO v_act;
  ELSE
    UPDATE aula_activities
       SET module_id = v_unidad, instructions_html = v_t2, case_html = v_t3, points_to_solve = v_j1,
           expected_product = v_t4, extension_hint = v_t5, support_html = v_t6, teacher_guide_html = COALESCE(v_t7, teacher_guide_html),
           status = 'publicado', sort_order = 12, updated_at = NOW()
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


  -- ── Actividad valid-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Validación de procesos, limpieza y métodos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Validación de procesos, limpieza y métodos) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: programa de validación de la línea de jarabes';
  v_t2 := $evvalid_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar, evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 y 2; deja una tabla de cambios.</li><li>Fase 3: define los atributos críticos de calidad del jarabe y los parámetros críticos del proceso, y la estrategia de calificación del proceso con el número de lotes justificado.</li><li>Fase 3: diseña la validación de limpieza del tanque: peor caso, cálculo del límite, muestreo y criterios.</li><li>Fase 3: escribe el plan de validación del método HPLC con los parámetros de ICH Q2 que aplican a la valoración y a los conservantes.</li><li>Fase 3: describe cómo se mantendrá el estado validado (verificación continua y revisión periódica).</li><li>Escribe un resumen ejecutivo de una página con la ruta crítica, los riesgos y la fecha realista de venta.</li><li>Revisa con la rúbrica y sube el programa en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (alcance y plan).</strong> Plan maestro de validación de la línea: inventario, clasificación en calificación o validación, priorización por riesgo, responsabilidades y cronograma.</li>
  <li><strong>Fase 2 · Unidad 2 (calificación).</strong> Calificación del sistema de agua (de DQ a PQ y sus fases de monitoreo) y del tanque de fabricación, con criterios de aceptación y manejo de desviaciones.</li>
  <li><strong>Fase 3 · Unidad 3 (validación).</strong> Estrategia de validación del proceso, validación de limpieza del tanque y plan de validación del método analítico.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 2. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar el programa de validación de una línea nueva, corregido con la retroalimentación.</li><li>Diseñar la validación del proceso, de la limpieza y del método analítico.</li><li>Comunicar a la gerencia la ruta crítica y los riesgos.</li></ul>
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
  <tr><td>Integración y mejora</td><td>15 %</td><td>Integra las fases con coherencia y documenta cada corrección.</td><td>Integra y corrige lo principal.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Validación del proceso</td><td>25 %</td><td>Atributos y parámetros críticos pertinentes y estrategia de lotes justificada con el ciclo de vida.</td><td>Estrategia adecuada con una justificación débil.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Validación de limpieza</td><td>20 %</td><td>Peor caso, límite calculado y muestreo bien definidos.</td><td>Limpieza adecuada con un cálculo o un punto ausente.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Validación del método</td><td>20 %</td><td>Parámetros de ICH Q2 correctos para cada uso del método.</td><td>Parámetros correctos con alguna omisión.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Estado validado y resumen</td><td>10 %</td><td>Plan de verificación continua y resumen claro con fecha realista.</td><td>Elementos razonables con vacíos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evvalid_html$;
  v_t3 := $evvalid_html$<h2>Caso de estudio</h2>
<p>Laboratorios Cordillera (ficticio), de Rionegro (Antioquia), instala una línea nueva de jarabes: un sistema de agua purificada por ósmosis inversa, un tanque de fabricación de 2.000 L con agitador y chaqueta de calentamiento, una llenadora y el sistema de aire del área. El primer producto será un jarabe con un principio activo y conservantes, valorado con un método HPLC desarrollado en casa. La planta quiere producir para la venta en nueve meses y tú eres la persona que la dirección técnica encargó del programa de validación (datos simulados). En esta entrega terminas la fase 3 e integras todo el programa que la dirección técnica presentará a la gerencia.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evvalid_html$;
  v_t4 := 'Programa de validación de la línea de jarabes con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evvalid_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 1160 de 2016 (BPM); Anexo 15 de las guías de BPM de PIC/S y de la Unión Europea (calificación y validación, revisión de 2015); guía de la FDA «Process Validation: General Principles and Practices» (2011); ICH Q2(R2), Q8, Q9 y Q10; OMS TRS 1033, anexo 3 (agua para uso farmacéutico); guía de la EMA sobre límites de exposición basados en la salud para instalaciones compartidas. Cita en APA 7 o en el formato «norma o guía, sección».</p>$evvalid_html$;
  v_t7 := NULL;
  v_j1 := $evvalid_json$["Fases 1 y 2 corregidas, con tabla de cambios.","Estrategia de validación del proceso con atributos y parámetros críticos.","Validación de limpieza del tanque.","Plan de validación del método analítico.","Mantenimiento del estado validado y resumen ejecutivo."]$evvalid_json$::jsonb;
  v_j2 := $evvalid_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las fases con coherencia y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"validacion-del-proceso","name":"Validación del proceso","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Atributos y parámetros críticos pertinentes y estrategia de lotes justificada con el ciclo de vida."},{"level":3,"label":"Logrado","description":"Estrategia adecuada con una justificación débil."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"validacion-de-limpieza","name":"Validación de limpieza","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Peor caso, límite calculado y muestreo bien definidos."},{"level":3,"label":"Logrado","description":"Limpieza adecuada con un cálculo o un punto ausente."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"validacion-del-metodo","name":"Validación del método","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Parámetros de ICH Q2 correctos para cada uso del método."},{"level":3,"label":"Logrado","description":"Parámetros correctos con alguna omisión."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"estado-validado-y-resumen","name":"Estado validado y resumen","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Plan de verificación continua y resumen claro con fecha realista."},{"level":3,"label":"Logrado","description":"Elementos razonables con vacíos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evvalid_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 13, 16)
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
         SET rubric = v_j2, grading_method = 'rubrica', weight = 16,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Foro valid-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con protocolos';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evvalid_html$<h2>Para empezar</h2>
<p>Piensa en un protocolo de calificación o de validación que hayas visto, ejecutado o revisado —o, si aún no has trabajado en planta, en un equipo de laboratorio que usaste—. Cuéntanos en tres o cuatro líneas qué demostraba y qué te pareció difícil, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evvalid_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre calificación o validación te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evvalid_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evvalid_html$;
  v_t6 := $evvalid_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evvalid_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Alguna vez viste usar «validar» y «calificar» como sinónimos? ¿En qué contexto?', '¿Qué te preocupa más hoy: los equipos y sistemas, los procesos, la limpieza o los métodos?']::text[];
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


  -- ── Foro valid-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calificar y validar no es lo mismo' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 1 (Calificar y validar no es lo mismo) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Calificar o validar primero?';
  v_t2 := 'Argumentar la secuencia correcta entre calificación de equipos y validación del proceso cuando hay presión comercial.';
  v_t3 := $evvalid_html$<h2>Caso del foro</h2>
<p>Llegó a Laboratorios Altamira (ficticio) una tableteadora nueva. El gerente de producción quiere «validar la máquina» la próxima semana fabricando tres lotes comerciales, porque hay un compromiso de ventas. Aseguramiento de la calidad responde que el equipo no tiene calificación de instalación ni de operación y que no figura en el plan maestro de validación. El proveedor ofrece su protocolo genérico de pruebas de fábrica (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvalid_html$;
  v_t4 := '¿Cuál es la secuencia correcta antes de fabricar los lotes de validación del proceso y qué evidencia mínima exigirías? ¿Qué riesgo corre la empresa si se salta pasos?';
  v_t5 := $evvalid_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la etapa que exigirías antes de los lotes y la guía que la respalda. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.34 %.</li></ul>$evvalid_html$;
  v_t6 := $evvalid_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la etapa que exigirías antes de los lotes y la guía que la respalda.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvalid_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué parte del protocolo del proveedor puedes aprovechar y qué debes hacer por tu cuenta?', '¿Cómo responderías al compromiso de ventas sin ceder en la calidad?', '¿Qué pasa con los tres lotes si después la calificación falla?']::text[];
  v_j1 := $evvalid_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la etapa que exigirías antes de los lotes y la guía que la respalda."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvalid_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 3.34, v_j1,
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
         SET grading_method = 'rubrica', weight = 3.34, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro valid-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Calificación de equipos e instalaciones' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 2 (Calificación de equipos e instalaciones) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Foro de interacción 2 · El sensor que molesta';
  v_t2 := 'Evaluar cómo se gestiona un resultado fuera de criterio durante una calificación, sin manipular la evidencia.';
  v_t3 := $evvalid_html$<h2>Caso del foro</h2>
<p>Durante la calificación de operación de un autoclave nuevo en una planta ficticia, uno de los doce termopares de la prueba de distribución de calor registra 2 °C menos que los demás, siempre cerca del drenaje de la cámara. El técnico del proveedor propone excluir ese sensor por «defectuoso» y terminar la prueba hoy, porque mañana viaja. Nadie ha revisado aún la calibración del termopar antes y después de la prueba (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvalid_html$;
  v_t4 := '¿Se puede excluir el sensor y aprobar la prueba? ¿Qué harías para decidir si el problema está en el sensor o en el autoclave?';
  v_t5 := $evvalid_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la verificación concreta que separaría una falla del sensor de una falla del equipo. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$evvalid_html$;
  v_t6 := $evvalid_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la verificación concreta que separaría una falla del sensor de una falla del equipo.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvalid_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué te diría la verificación de calibración del termopar antes y después de la prueba?', '¿Qué significa, para la esterilización, un punto frío cerca del drenaje?', '¿Qué documento debe quedar si al final se excluye el sensor?']::text[];
  v_j1 := $evvalid_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la verificación concreta que separaría una falla del sensor de una falla del equipo."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvalid_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 3.33, v_j1,
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
         SET grading_method = 'rubrica', weight = 3.33, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  -- ── Foro valid-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Validación de procesos, limpieza y métodos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE EXCEPTION 'No existe la unidad 3 (Validación de procesos, limpieza y métodos) en Validaciones y Calificaciones.';
  END IF;
  v_t1 := 'Foro de interacción 3 · ¿Qué tan limpio es limpio?';
  v_t2 := 'Argumentar qué criterio de limpieza protege al paciente cuando se comparten equipos con un producto muy potente.';
  v_t3 := $evvalid_html$<h2>Caso del foro</h2>
<p>En una planta ficticia, el mismo tren de equipos fabrica un anticonceptivo hormonal y cuatro productos de uso general. El criterio de limpieza vigente es «visualmente limpio y no más de 10 ppm del producto anterior en el siguiente». La nueva jefa de aseguramiento propone límites basados en la exposición diaria permitida (PDE) de cada principio activo. Producción responde que «el criterio actual nunca ha fallado» y que cambiarlo obligará a repetir validaciones (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evvalid_html$;
  v_t4 := '¿Qué criterio de limpieza debería aplicarse en esta planta y qué evidencia se necesita para cambiarlo?';
  v_t5 := $evvalid_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el cálculo o la guía que muestra por qué un criterio protege y el otro no. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$evvalid_html$;
  v_t6 := $evvalid_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el cálculo o la guía que muestra por qué un criterio protege y el otro no.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evvalid_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿«Nunca ha fallado» demuestra que el criterio protege al paciente? Argumenta.', '¿En qué caso el criterio de 10 ppm podría ser menos estricto que uno basado en la salud?', '¿Qué alternativa considerarías si el límite basado en la salud no se puede alcanzar con la limpieza actual?']::text[];
  v_j1 := $evvalid_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el cálculo o la guía que muestra por qué un criterio protege y el otro no."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evvalid_json$::jsonb;
  SELECT id INTO v_foro FROM aula_forums
   WHERE course_id = v_curso AND title = v_t1 AND deleted_at IS NULL LIMIT 1;
  IF v_foro IS NULL THEN
    INSERT INTO aula_forums
      (course_id, module_id, scope, title, purpose, description, central_question, guiding_questions,
       participation_html, rules_html, no_participants_alternative, grading_method, weight, rubric,
       is_closed, allow_attachments, status, sort_order)
    VALUES
      (v_curso, v_unidad, 'modulo', v_t1, v_t2, v_t3, v_t4, v_a1,
       v_t5, v_t6, v_t7, 'rubrica', 3.33, v_j1,
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
         SET grading_method = 'rubrica', weight = 3.33, rubric = v_j1
       WHERE id = v_foro;
    END IF;
  END IF;


  RAISE NOTICE 'Validaciones y Calificaciones: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evvalid$;

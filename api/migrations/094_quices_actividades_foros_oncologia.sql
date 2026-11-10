-- ============================================================
--  094_quices_actividades_foros_oncologia.sql — quizzes, actividades y foros, lote «oncologia»
--
--  Generado por scripts/evaluacion-aula.mjs oncologia migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Farmacología Oncológica; Quimioterapia Antineoplásica; Inmunoterapia Oncológica; Terapias Dirigidas en Oncología.
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
--  Curso de Farmacología Oncológica
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfonc$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacología Oncológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacología Oncológica: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Biología del cáncer y bases de la farmacología antineoplásica', 'Unidad 2. Terapia hormonal en oncología', 'Unidad 3. Tratamiento de soporte en el paciente oncológico', 'Unidad 4. Manejo seguro de medicamentos peligrosos y farmacia oncológica', 'Unidad 5. Contexto colombiano y farmacovigilancia oncológica']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacología Oncológica: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfonc_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfonc_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fonc-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Biología del cáncer y bases de la farmacología antineoplásica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Biología del cáncer y bases de la farmacología antineoplásica) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Biología del cáncer y bases de la farmacología antineoplásica';
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


    v_t3 := '¿Qué plantea la hipótesis de muerte logarítmica (log-kill) de los citotóxicos?';
    v_t4 := 'Según la hipótesis log-kill, cada ciclo de quimioterapia elimina una fracción constante de las células tumorales, no un número fijo; por eso se necesitan varios ciclos y la intensidad de dosis importa. Los tumores con alta fracción de crecimiento son más sensibles a los citotóxicos.';
    v_j1 := $evfonc_json${"external_id":"fonc-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Ciclo celular y cinética tumoral: fracción de crecimiento, crecimiento gompertziano y log-kill","outcome":"Ciclo celular y cinética tumoral: fracción de crecimiento, crecimiento gompertziano y log-kill","source":"Fundamentos de farmacología antineoplásica."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que cada ciclo elimina un número fijo de células tumorales, sin importar el tamaño del tumor.', FALSE, 'La hipótesis habla de una fracción, no de un número fijo.', 0),
      (v_pregunta, 'Que la primera dosis de quimioterapia elimina todas las células tumorales sensibles que hay en el cuerpo.', FALSE, 'Si fuera así no se necesitarían varios ciclos.', 1),
      (v_pregunta, 'Que cada ciclo elimina una fracción constante de las células; por eso se necesitan varios ciclos.', TRUE, 'Correcto. Una fracción fija deja células residuales.', 2),
      (v_pregunta, 'Que el efecto de la quimioterapia aumenta a medida que el tumor crece y tiene más células.', FALSE, 'Los tumores grandes suelen tener menor fracción de crecimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con cáncer de colon inicia quimioterapia adyuvante. ¿Qué datos debe verificar el QF antes de validar la orden?';
    v_t4 := 'La validación farmacéutica de la orden oncológica verifica el protocolo, el peso y la talla actuales, la superficie corporal, las dosis, la función renal y hepática, el hemograma, el ciclo y las interacciones con los medicamentos crónicos del paciente.';
    v_j1 := $evfonc_json${"external_id":"fonc-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso clínico: primera consulta farmacéutica del paciente oncológico","outcome":"Caso clínico: primera consulta farmacéutica del paciente oncológico","source":"Recomendaciones de farmacia oncológica; fichas técnicas."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Peso y talla actuales, superficie corporal, función renal y hepática, hemograma e interacciones.', TRUE, 'Correcto. Con datos desactualizados la dosis puede ser errónea.', 0),
      (v_pregunta, 'Solo el nombre del medicamento y la firma del oncólogo, porque la dosis la define el médico.', FALSE, 'La validación farmacéutica revisa mucho más que eso.', 1),
      (v_pregunta, 'El color de la bolsa y la temperatura de la sala, porque son los únicos riesgos de la mezcla.', FALSE, 'Son aspectos de la preparación, no de la validación clínica.', 2),
      (v_pregunta, 'La opinión del paciente sobre el tratamiento, porque es el único dato clínico que el QF puede verificar por sí mismo.', FALSE, 'La validación incluye datos clínicos y de laboratorio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Por qué se combinan antineoplásicos con mecanismos distintos y toxicidades que no se superponen?';
    v_t4 := 'La hipótesis de Goldie-Coldman plantea que a mayor masa tumoral más probable es la aparición de clones resistentes. Combinar fármacos con mecanismos distintos y toxicidades que no se superponen ataca clones con distinta sensibilidad, reduce la resistencia y permite dosis eficaces con toxicidad tolerable.';
    v_j1 := $evfonc_json${"external_id":"fonc-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Resistencia a los antineoplásicos y fundamentos de la poliquimioterapia","outcome":"Resistencia a los antineoplásicos y fundamentos de la poliquimioterapia","source":"Fundamentos de farmacología antineoplásica."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque así se puede reducir la dosis de cada fármaco a una décima parte de la habitual.', FALSE, 'La razón principal no es reducir tanto las dosis.', 0),
      (v_pregunta, 'Porque los antineoplásicos solos no tienen ningún efecto sobre las células tumorales.', FALSE, 'Muchos tienen actividad en monoterapia.', 1),
      (v_pregunta, 'Porque la combinación elimina por completo los efectos adversos de cada fármaco.', FALSE, 'Las combinaciones también tienen toxicidad.', 2),
      (v_pregunta, 'Para atacar clones con distinta sensibilidad, reducir la resistencia y mantener una toxicidad tolerable.', TRUE, 'Correcto. Es la lógica de la poliquimioterapia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un familiar pide para su papá con cáncer «la terapia dirigida que salió en las noticias, porque sirve para cualquier tumor». ¿Cuál es la mejor respuesta del QF?';
    v_t4 := 'Los antineoplásicos se agrupan en citotóxicos, hormonales, terapias dirigidas e inmunoterapia. Las terapias dirigidas actúan sobre alteraciones moleculares concretas (por ejemplo, una mutación o una sobreexpresión), por lo que requieren un biomarcador que justifique su uso y tienen toxicidades propias.';
    v_j1 := $evfonc_json${"external_id":"fonc-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Clasificación general de los antineoplásicos: citotóxicos, hormonales, dirigidos e inmunoterapia","outcome":"Clasificación general de los antineoplásicos: citotóxicos, hormonales, dirigidos e inmunoterapia","source":"Fundamentos de farmacología antineoplásica; fichas técnicas."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que tiene razón: las terapias dirigidas funcionan en cualquier tumor, sin necesidad de exámenes previos.', FALSE, 'Su eficacia depende de una alteración molecular concreta.', 0),
      (v_pregunta, 'Que las terapias dirigidas actúan sobre alteraciones moleculares concretas y requieren un biomarcador que lo justifique.', TRUE, 'Correcto. La decisión es del oncólogo con esa información.', 1),
      (v_pregunta, 'Que las terapias dirigidas no tienen efectos adversos y por eso se pueden pedir sin fórmula.', FALSE, 'Tienen efectos adversos propios.', 2),
      (v_pregunta, 'Que las terapias dirigidas siempre son menos eficaces que la quimioterapia clásica.', FALSE, 'En tumores con el blanco adecuado pueden ser muy eficaces.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fonc-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Terapia hormonal en oncología' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Terapia hormonal en oncología) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Terapia hormonal en oncología';
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


    v_t3 := '¿Por qué los inhibidores de aromatasa se usan en mujeres posmenopáusicas y no solos en premenopáusicas?';
    v_t4 := 'Los inhibidores de aromatasa (anastrozol, letrozol, exemestano) bloquean la conversión periférica de andrógenos en estrógenos. En la premenopausia el ovario sigue produciendo estrógenos, por lo que solo se usan con supresión ovárica. Producen artralgias y pérdida ósea; el tamoxifeno aumenta el riesgo trombótico y endometrial.';
    v_j1 := $evfonc_json${"external_id":"fonc-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Inhibidores de aromatasa: anastrozol, letrozol y exemestano","outcome":"Inhibidores de aromatasa: anastrozol, letrozol y exemestano","source":"Fichas técnicas de anastrozol, letrozol y tamoxifeno."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque en las premenopáusicas producen más sofocos que el tamoxifeno y se toleran peor.', FALSE, 'La razón no es la tolerancia.', 0),
      (v_pregunta, 'Porque en las premenopáusicas el ovario produce estrógenos que no se suprimen solo con ellos.', TRUE, 'Correcto. Requieren supresión ovárica si se usan.', 1),
      (v_pregunta, 'Porque en las premenopáusicas se eliminan por el riñón y no alcanzan concentraciones útiles en la sangre.', FALSE, 'No es una razón farmacocinética.', 2),
      (v_pregunta, 'Porque en las premenopáusicas aumentan el riesgo de trombosis mucho más que el tamoxifeno.', FALSE, 'El riesgo trombótico es mayor con el tamoxifeno.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una mujer con tamoxifeno por cáncer de mama recibe paroxetina para los sofocos. ¿Qué propone el QF al médico?';
    v_t4 := 'El tamoxifeno se activa a endoxifeno por el CYP2D6. Los inhibidores potentes de esa enzima (paroxetina, fluoxetina, bupropión) reducen la formación del metabolito activo; para los sofocos se prefieren alternativas con poca inhibición del CYP2D6, como la venlafaxina, según el médico.';
    v_j1 := $evfonc_json${"external_id":"fonc-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso clínico: tamoxifeno, sofocos e interacción con paroxetina","outcome":"Caso clínico: tamoxifeno, sofocos e interacción con paroxetina","source":"Ficha técnica de tamoxifeno."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Mantener la paroxetina, porque es el antidepresivo más eficaz para los sofocos.', FALSE, 'Su interacción con el tamoxifeno es relevante.', 0),
      (v_pregunta, 'Duplicar la dosis del tamoxifeno para compensar cualquier efecto que tenga la paroxetina sobre su eficacia.', FALSE, 'Subir la dosis no corrige la interacción.', 1),
      (v_pregunta, 'Suspender el tamoxifeno mientras use la paroxetina para evitar la interacción.', FALSE, 'Suspender el tamoxifeno compromete el tratamiento del cáncer.', 2),
      (v_pregunta, 'Evitar la paroxetina, que inhibe el CYP2D6 y reduce la activación del tamoxifeno; considerar otra opción.', TRUE, 'Correcto. Por ejemplo, venlafaxina u otra según el médico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre con cáncer de próstata metastásico inicia un agonista de GnRH y en la segunda semana aumenta su dolor óseo. ¿Qué análisis es correcto?';
    v_t4 := 'Los agonistas de GnRH (leuprolida, goserelina) producen al inicio un aumento transitorio de la testosterona («flare») que puede empeorar el dolor óseo u obstrucciones; se previene con un antiandrógeno las primeras semanas. Los antagonistas de GnRH reducen la testosterona sin flare.';
    v_j1 := $evfonc_json${"external_id":"fonc-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Privación androgénica: agonistas y antagonistas de GnRH","outcome":"Privación androgénica: agonistas y antagonistas de GnRH","source":"Fichas técnicas de leuprolida y degarelix."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Puede ser el fenómeno de «flare» por el aumento inicial de testosterona; se previene con un antiandrógeno.', TRUE, 'Correcto. Los antagonistas de GnRH no lo producen.', 0),
      (v_pregunta, 'Es una prueba de que el tratamiento fracasó y debe suspenderse de inmediato.', FALSE, 'Es un efecto transitorio esperable al inicio.', 1),
      (v_pregunta, 'Se debe a la falta de testosterona, que siempre produce dolor óseo en las primeras semanas.', FALSE, 'Al inicio la testosterona aumenta, no disminuye.', 2),
      (v_pregunta, 'Es una reacción alérgica al agonista que obliga a cambiar a quimioterapia.', FALSE, 'No es una reacción alérgica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con cáncer de próstata toma abiraterona, pero «dejó la prednisona porque no le gustan los corticoides». ¿Cuál es la mejor valoración?';
    v_t4 := 'La abiraterona inhibe la CYP17 y la síntesis de andrógenos; produce un exceso mineralocorticoide (hipertensión, hipopotasemia, retención de líquidos) que se controla con prednisona a dosis bajas. Se toma en ayunas, porque los alimentos aumentan mucho su absorción. Se vigilan presión, potasio y función hepática.';
    v_j1 := $evfonc_json${"external_id":"fonc-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Antiandrógenos e inhibidores de la síntesis androgénica (bicalutamida, enzalutamida, apalutamida, darolutamida, abiraterona)","outcome":"Antiandrógenos e inhibidores de la síntesis androgénica (bicalutamida, enzalutamida, apalutamida, darolutamida, abiraterona)","source":"Ficha técnica de abiraterona."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una decisión razonable, porque la abiraterona funciona igual con o sin prednisona.', FALSE, 'La prednisona tiene un papel concreto con la abiraterona.', 0),
      (v_pregunta, 'Es razonable si toma la abiraterona con una comida grasosa para mejorar su efecto.', FALSE, 'Los alimentos aumentan mucho su absorción y no deben acompañarla.', 1),
      (v_pregunta, 'Es un riesgo: sin prednisona aumentan los efectos mineralocorticoides (hipertensión, hipopotasemia, edema).', TRUE, 'Correcto. Se informa al médico y se vigilan presión y potasio.', 2),
      (v_pregunta, 'Es un riesgo solo porque la prednisona aumenta de forma importante la absorción de la abiraterona en el intestino.', FALSE, 'La prednisona no se da para la absorción.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fonc-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Tratamiento de soporte en el paciente oncológico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Tratamiento de soporte en el paciente oncológico) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Tratamiento de soporte en el paciente oncológico';
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


    v_t3 := '¿Qué caracteriza a las náuseas y vómitos anticipatorios en el paciente con quimioterapia?';
    v_t4 := 'Las náuseas y vómitos inducidos por quimioterapia se clasifican en agudos (primeras 24 horas), tardíos (después de 24 horas), anticipatorios (antes del ciclo, condicionados por experiencias previas) e irruptivos (pese a la profilaxis). La mejor prevención de los anticipatorios es un buen control desde el primer ciclo.';
    v_j1 := $evfonc_json${"external_id":"fonc-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Fisiopatología de las NVIQ y clasificación de emetogenicidad MASCC/ESMO","outcome":"Fisiopatología de las NVIQ y clasificación de emetogenicidad MASCC/ESMO","source":"Clasificación MASCC/ESMO."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Aparecen en las primeras 24 horas tras la quimioterapia y se controlan con antagonistas 5-HT3.', FALSE, 'Esa es la fase aguda.', 0),
      (v_pregunta, 'Aparecen después del segundo día y duran hasta una semana tras cada ciclo.', FALSE, 'Esa es la fase tardía.', 1),
      (v_pregunta, 'Aparecen pese a una profilaxis adecuada y requieren medicación de rescate.', FALSE, 'Ese es el vómito irruptivo.', 2),
      (v_pregunta, 'Aparecen antes de la quimioterapia, condicionados por malas experiencias previas.', TRUE, 'Correcto. Se previenen con un buen control desde el primer ciclo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente recibirá un esquema con cisplatino, de alto riesgo emetógeno. ¿Qué profilaxis antiemética corresponde según MASCC/ESMO?';
    v_t4 := 'Para la quimioterapia de alto riesgo emetógeno (como el cisplatino), MASCC/ESMO recomienda combinar un antagonista NK1, un antagonista 5-HT3, dexametasona y olanzapina, con cobertura de la fase tardía.';
    v_j1 := $evfonc_json${"external_id":"fonc-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Antieméticos y esquemas de profilaxis según riesgo","outcome":"Antieméticos y esquemas de profilaxis según riesgo","source":"Clasificación y recomendaciones MASCC/ESMO."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo metoclopramida a necesidad, porque la profilaxis se reserva para los vómitos que ya aparecieron.', FALSE, 'Con riesgo alto la profilaxis es combinada y anticipada.', 0),
      (v_pregunta, 'Solo dexametasona el día de la quimioterapia, que basta para cualquier nivel de riesgo.', FALSE, 'Con riesgo alto se combinan varios antieméticos.', 1),
      (v_pregunta, 'Antagonista NK1, antagonista 5-HT3, dexametasona y olanzapina.', TRUE, 'Correcto. Es la combinación para el riesgo alto.', 2),
      (v_pregunta, 'Un antagonista 5-HT3 solo, porque el cisplatino tiene un riesgo emetógeno bajo.', FALSE, 'El cisplatino es de riesgo alto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente llama al día 10 de su ciclo de quimioterapia con fiebre de 38,5 °C y malestar. Dice que esperará a la cita de la semana siguiente. ¿Qué análisis es correcto?';
    v_t4 := 'La neutropenia febril (fiebre con neutrófilos muy bajos) suele aparecer entre los días 7 y 14 del ciclo y es una urgencia oncológica: requiere evaluación inmediata y antibióticos. Los factores estimulantes de colonias se usan como profilaxis primaria cuando el riesgo del esquema es alto o secundaria tras un episodio.';
    v_j1 := $evfonc_json${"external_id":"fonc-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Neutropenia febril y factores estimulantes de colonias (filgrastim, pegfilgrastim, biosimilares)","outcome":"Neutropenia febril y factores estimulantes de colonias (filgrastim, pegfilgrastim, biosimilares)","source":"Fichas técnicas de filgrastim y pegfilgrastim; recomendaciones de neutropenia febril."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Puede esperar, porque la fiebre durante la quimioterapia es un efecto esperado sin importancia.', FALSE, 'Puede ser una neutropenia febril.', 0),
      (v_pregunta, 'Puede ser una neutropenia febril, una urgencia: debe consultar de inmediato.', TRUE, 'Correcto. Requiere evaluación y antibióticos sin demora.', 1),
      (v_pregunta, 'Basta con tomar acetaminofén y medir la fiebre cada día hasta la próxima cita.', FALSE, 'Enmascarar la fiebre retrasa una urgencia.', 2),
      (v_pregunta, 'Debe suspender la quimioterapia por su cuenta y reiniciarla cuando se le pase la fiebre.', FALSE, 'La conducta es consultar de inmediato.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una paciente con metástasis óseas toma acetaminofén y tramadol y su dolor sigue en 7/10. El médico propone «subir el tramadol a 600 mg al día». ¿Cuál es la mejor valoración?';
    v_t4 := 'La guía de la OMS de 2019 sobre dolor por cáncer recomienda escalar a opioides fuertes cuando el dolor no se controla, con titulación individual, rescates, coadyuvantes y prevención del estreñimiento. El tramadol tiene dosis máxima (400 mg al día) y a dosis altas aumenta el riesgo de convulsiones y síndrome serotoninérgico.';
    v_j1 := $evfonc_json${"external_id":"fonc-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Dolor oncológico: escalera analgésica OMS, guía OMS 2019 y opioides en Colombia","outcome":"Dolor oncológico: escalera analgésica OMS, guía OMS 2019 y opioides en Colombia","source":"Guía OMS de dolor por cáncer (2019); ficha técnica de tramadol."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Conviene pasar a un opioide fuerte, como la morfina, con titulación; el tramadol tiene techo y más riesgos a dosis altas.', TRUE, 'Correcto. Se suman coadyuvantes y laxantes.', 0),
      (v_pregunta, 'Es la mejor opción, porque el tramadol no tiene dosis máxima y es más seguro que la morfina.', FALSE, 'El tramadol tiene dosis máxima y riesgos a dosis altas.', 1),
      (v_pregunta, 'Conviene agregar un AINE a dosis máxima y otro AINE distinto para potenciar el efecto.', FALSE, 'Combinar AINE no es adecuado.', 2),
      (v_pregunta, 'Conviene esperar a que la quimioterapia reduzca el tumor antes de cambiar la analgesia.', FALSE, 'El dolor debe tratarse ya.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fonc-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Manejo seguro de medicamentos peligrosos y farmacia oncológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Manejo seguro de medicamentos peligrosos y farmacia oncológica) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Manejo seguro de medicamentos peligrosos y farmacia oncológica';
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


    v_t3 := '¿Por qué muchos antineoplásicos se clasifican como medicamentos peligrosos según NIOSH?';
    v_t4 := 'NIOSH clasifica como peligrosos los medicamentos carcinógenos, teratógenos o tóxicos para el desarrollo, tóxicos para la reproducción, tóxicos para órganos a dosis bajas o genotóxicos. Su manipulación requiere controles de ingeniería, equipos de protección y procedimientos según capítulo 800 de la USP.';
    v_j1 := $evfonc_json${"external_id":"fonc-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Medicamentos peligrosos: lista NIOSH 2024 y estándar USP <800>","outcome":"Medicamentos peligrosos: lista NIOSH 2024 y estándar USP <800>","source":"Lista NIOSH 2024; capítulo 800 de la USP."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque pueden ser carcinógenos, teratógenos o tóxicos para la reproducción u órganos a dosis bajas.', TRUE, 'Correcto. Por eso se manipulan con controles específicos.', 0),
      (v_pregunta, 'Porque su precio es muy alto y su pérdida representa un riesgo económico importante para la institución.', FALSE, 'La clasificación es por riesgo para la salud, no económico.', 1),
      (v_pregunta, 'Porque solo pueden administrarse por vía intravenosa en el hospital.', FALSE, 'Algunos son orales y también son peligrosos.', 2),
      (v_pregunta, 'Porque se degradan rápido con la luz y pierden su efecto si no se protegen.', FALSE, 'La estabilidad no define un medicamento peligroso.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En el pasillo de la central de mezclas se rompe una bolsa con un citotóxico preparado. ¿Qué hace primero el QF responsable?';
    v_t4 := 'Ante un derrame de un medicamento peligroso: aislar el área, usar el kit de derrames con el equipo de protección (doble guante, bata, protección respiratoria y ocular), contener y limpiar de afuera hacia adentro, desechar como residuo citotóxico, descontaminar y documentar el evento.';
    v_j1 := $evfonc_json${"external_id":"fonc-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Exposición accidental, derrames y residuos de medicamentos citotóxicos","outcome":"Exposición accidental, derrames y residuos de medicamentos citotóxicos","source":"Estándar capítulo 800 de la USP; procedimientos de manejo de derrames."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Limpiar rápido con un trapero y agua para que nadie resbale, sin protección especial.', FALSE, 'Así se dispersa el contaminante y se expone el personal.', 0),
      (v_pregunta, 'Aislar el área y usar el kit de derrames con el equipo de protección completo, conteniendo de afuera hacia adentro.', TRUE, 'Correcto. Luego se desecha como residuo citotóxico y se documenta.', 1),
      (v_pregunta, 'Esperar a que se seque el líquido para recogerlo con más facilidad al final del turno.', FALSE, 'Esperar aumenta la exposición.', 2),
      (v_pregunta, 'Abrir las ventanas y encender ventiladores para dispersar los vapores del medicamento.', FALSE, 'Dispersar el contaminante empeora la exposición.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Al validar una orden, el QF nota que la dosis de un citotóxico se calculó con un peso de hace tres meses; desde entonces el paciente perdió 9 kg. ¿Qué análisis es correcto?';
    v_t4 := 'Muchos citotóxicos se dosifican por superficie corporal; con un peso desactualizado la dosis puede ser excesiva. El QF recalcula, consulta al oncólogo antes de preparar y documenta el error interceptado como parte de la gestión de la seguridad.';
    v_j1 := $evfonc_json${"external_id":"fonc-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso clínico: derrame en la central de mezclas y error de dosis interceptado","outcome":"Caso clínico: derrame en la central de mezclas y error de dosis interceptado","source":"Recomendaciones de validación en farmacia oncológica."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No importa, porque las dosis de los citotóxicos no dependen del peso del paciente.', FALSE, 'Muchas se calculan por superficie corporal.', 0),
      (v_pregunta, 'El QF debe preparar la dosis tal como está y anotar el hallazgo para el siguiente ciclo.', FALSE, 'Preparar una dosis posiblemente errónea es un riesgo.', 1),
      (v_pregunta, 'La dosis puede estar sobrestimada: se recalcula la superficie corporal y se consulta al oncólogo antes de preparar.', TRUE, 'Correcto. Es un error interceptado que se documenta.', 2),
      (v_pregunta, 'El QF debe reducir la dosis a la mitad por su cuenta para evitar cualquier toxicidad.', FALSE, 'El ajuste se define con el oncólogo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una clínica pequeña propone que las enfermeras preparen las mezclas de citotóxicos en la estación de enfermería para ahorrar costos. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'En Colombia, las mezclas de medicamentos oncológicos se preparan en centrales de mezclas que cumplen las buenas prácticas de elaboración (Resolución 444 de 2008), con controles de ingeniería y procedimientos que protegen al paciente y al personal.';
    v_j1 := $evfonc_json${"external_id":"fonc-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Central de mezclas en Colombia: Resolución 444 de 2008 (BPE) y Ley 1384 de 2010","outcome":"Central de mezclas en Colombia: Resolución 444 de 2008 (BPE) y Ley 1384 de 2010","source":"Resolución 444 de 2008; capítulo 800 de la USP."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es aceptable si las enfermeras usan guantes de látex y tapabocas durante la preparación.', FALSE, 'Esos elementos no reemplazan las condiciones de una central de mezclas.', 0),
      (v_pregunta, 'Es aceptable si se prepara en la mañana, cuando hay menos personas en el servicio.', FALSE, 'El horario no reduce el riesgo.', 1),
      (v_pregunta, 'Es aceptable porque los citotóxicos no generan riesgo para quien los prepara.', FALSE, 'Sí generan riesgo ocupacional.', 2),
      (v_pregunta, 'Es inadecuada: las mezclas de citotóxicos requieren una central de mezclas con buenas prácticas de elaboración.', TRUE, 'Correcto. Protege al paciente y al personal.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fonc-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Contexto colombiano y farmacovigilancia oncológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Contexto colombiano y farmacovigilancia oncológica) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Contexto colombiano y farmacovigilancia oncológica';
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


    v_t3 := '¿Qué establece la Ley 1384 de 2010, conocida como Ley Sandra Ceballos?';
    v_t4 := 'La Ley 1384 de 2010 (Ley Sandra Ceballos) establece acciones para la atención integral del cáncer en adultos en Colombia: promoción, prevención, diagnóstico oportuno, tratamiento, rehabilitación y cuidado paliativo, con la organización de unidades funcionales para la atención del cáncer.';
    v_j1 := $evfonc_json${"external_id":"fonc-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Ley 1384 de 2010 (Sandra Ceballos), sus modificaciones y las Unidades Funcionales","outcome":"Ley 1384 de 2010 (Sandra Ceballos), sus modificaciones y las Unidades Funcionales","source":"Ley 1384 de 2010."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que los medicamentos oncológicos solo pueden comprarse en el exterior por los pacientes.', FALSE, 'Ese no es el contenido de la ley.', 0),
      (v_pregunta, 'Que los pacientes con cáncer deben pagar la totalidad de sus tratamientos sin apoyo del sistema.', FALSE, 'La ley busca lo contrario.', 1),
      (v_pregunta, 'Acciones para el control integral del cáncer en adultos: prevención, diagnóstico, tratamiento y cuidado paliativo.', TRUE, 'Correcto. Incluye la atención en unidades funcionales.', 2),
      (v_pregunta, 'Que solo los hospitales públicos pueden atender a los pacientes con cáncer en Colombia.', FALSE, 'No restringe la atención a los hospitales públicos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con oxaliplatino presenta una neuropatía que le impide abotonarse la camisa. El auxiliar dice que «no se reporta porque es un efecto esperado». ¿Qué hace el QF?';
    v_t4 := 'En oncología muchos eventos adversos son esperados y por eso se reportan menos. Se gradúan con los criterios CTCAE (una neuropatía que limita el autocuidado suele ser grado 3), se informan al oncólogo para ajustar el tratamiento y se reportan al Programa Nacional de Farmacovigilancia.';
    v_j1 := $evfonc_json${"external_id":"fonc-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Farmacovigilancia oncológica: detección, graduación (CTCAE), causalidad y reporte al INVIMA","outcome":"Farmacovigilancia oncológica: detección, graduación (CTCAE), causalidad y reporte al INVIMA","source":"Criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No reportarla, porque solo se reportan las reacciones que no aparecen en la ficha técnica.', FALSE, 'También se reportan las reacciones esperadas.', 0),
      (v_pregunta, 'Esperar a que la neuropatía sea irreversible para reportarla como un evento grave.', FALSE, 'Esperar retrasa el manejo y el reporte.', 1),
      (v_pregunta, 'Suspender el oxaliplatino por su cuenta y no informar al oncólogo para evitar conflictos.', FALSE, 'La decisión es del oncólogo y debe informarse.', 2),
      (v_pregunta, 'Graduarla con CTCAE, informar al oncólogo y reportarla al INVIMA, aunque sea esperada.', TRUE, 'Correcto. Afecta las actividades diarias: grado 3.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'A una paciente le formulan un antineoplásico oral que no está financiado con la UPC. ¿Qué análisis hace el QF para gestionar el acceso?';
    v_t4 := 'Las tecnologías incluidas en el Plan de Beneficios se financian con la UPC; las no financiadas se prescriben mediante la herramienta MIPRES. El QF verifica la prescripción, acompaña la gestión con la EPS y vigila los tiempos para que el paciente no quede sin tratamiento.';
    v_j1 := $evfonc_json${"external_id":"fonc-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Acceso a medicamentos oncológicos: PBS/UPC, MIPRES y barreras","outcome":"Acceso a medicamentos oncológicos: PBS/UPC, MIPRES y barreras","source":"Normativa del Plan de Beneficios en Salud y MIPRES."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Debe prescribirse por MIPRES; el QF verifica la prescripción y acompaña el trámite con la EPS.', TRUE, 'Correcto. Así se evita que la paciente quede sin tratamiento.', 0),
      (v_pregunta, 'La paciente debe comprarlo con su propio dinero, porque no hay ninguna vía de financiación en el sistema de salud.', FALSE, 'Existe una vía para tecnologías no financiadas con la UPC.', 1),
      (v_pregunta, 'Se debe cambiar por un medicamento financiado aunque no tenga la misma indicación.', FALSE, 'El cambio sin indicación no es adecuado.', 2),
      (v_pregunta, 'Se debe esperar a que el medicamento entre al Plan de Beneficios para poder iniciarlo.', FALSE, 'Esperar retrasa un tratamiento oncológico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para una paciente rural con cáncer de mama metastásico, que toma letrozol y un inhibidor de CDK4/6 y viaja 3 horas a la ciudad, alguien propone «entregarle seis meses de medicamentos y que vuelva solo si se siente mal». ¿Cuál es la mejor valoración?';
    v_t4 := 'Los inhibidores de CDK4/6 producen neutropenia con frecuencia y requieren hemogramas periódicos, además de otros controles según la molécula. El plan de atención de una paciente rural coordina entregas, controles de laboratorio cercanos, telefarmacia y signos de alarma, sin sacrificar la vigilancia.';
    v_j1 := $evfonc_json${"external_id":"fonc-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso integrador: paciente con cáncer de mama metastásico en zona rural","outcome":"Caso integrador: paciente con cáncer de mama metastásico en zona rural","source":"Fichas técnicas de los inhibidores de CDK4/6."}$evfonc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fonc-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una buena solución, porque así se elimina por completo la barrera de transporte.', FALSE, 'Elimina el transporte pero no la necesidad de controles.', 0),
      (v_pregunta, 'Es inadecuada: los inhibidores de CDK4/6 exigen controles de hemograma; se coordinan entregas y controles con su EPS.', TRUE, 'Correcto. La neutropenia es frecuente.', 1),
      (v_pregunta, 'Es adecuada si la paciente se toma los medicamentos en días alternos para que le duren más.', FALSE, 'Cambiar la dosis compromete la eficacia.', 2),
      (v_pregunta, 'Es inadecuada solo porque el letrozol se daña si se almacena en casa más de un mes.', FALSE, 'El problema principal es la vigilancia de la toxicidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fonc-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Biología del cáncer y bases de la farmacología antineoplásica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Biología del cáncer y bases de la farmacología antineoplásica) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Primera consulta farmacéutica de un paciente oncológico';
  v_t2 := $evfonc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Explica qué implica el cambio de peso para la superficie corporal y la dosis.</li><li>Revisa los datos de laboratorio que necesitas para validar (función renal y hepática, hemograma).</li><li>Concilia la medicación crónica e identifica interacciones relevantes (por ejemplo, con la warfarina).</li><li>Analiza el suplemento herbal y qué harías con él.</li><li>Prepara la educación sobre los efectos esperados y los signos de alarma.</li><li>Redacta la comunicación al oncólogo con tus hallazgos.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Validar la orden con datos clínicos actualizados.</li><li>Conciliar la medicación crónica e identificar interacciones.</li><li>Educar al paciente en efectos esperados y signos de alarma.</li></ul>
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
  <tr><td>Validación</td><td>25 %</td><td>Reconoce el peso desactualizado, recalcula la superficie corporal y define el laboratorio necesario.</td><td>Validación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones</td><td>30 %</td><td>Identifica la interacción de la capecitabina con la warfarina (aumento del INR) y propone vigilancia o alternativa.</td><td>Identifica sin plan.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Suplemento y educación</td><td>25 %</td><td>Aborda el suplemento y educa sobre fiebre, diarrea, síndrome mano-pie y neuropatía por frío.</td><td>Educación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación</td><td>10 %</td><td>Comunicación clara al oncólogo.</td><td>Comunicación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfonc_html$;
  v_t3 := $evfonc_html$<h2>Caso de estudio</h2>
<p>Don Alberto tiene 62 años, vive en Bogotá y fue operado de un adenocarcinoma de colon estadio III (datos simulados). El oncólogo prescribe quimioterapia adyuvante con capecitabina y oxaliplatino. Tiene hipertensión con losartán, diabetes con metformina, toma warfarina por una trombosis previa y un suplemento «para las defensas» con hierbas. El peso registrado en la orden es de 78 kg, pero hoy pesa 70 kg.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfonc_html$;
  v_t4 := 'Informe de primera consulta con comunicación al oncólogo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfonc_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los antineoplásicos y medicamentos de soporte del caso (tamoxifeno, inhibidores de aromatasa, análogos de GnRH, abiraterona, antieméticos, factores estimulantes de colonias y opioides); clasificación de emetogenicidad MASCC/ESMO; guía de la OMS de dolor por cáncer (2019); lista NIOSH 2024 de medicamentos peligrosos y capítulo 800 de la USP; Ley 1384 de 2010 y Resolución 444 de 2008 (buenas prácticas de elaboración); criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfonc_html$;
  v_t7 := NULL;
  v_j1 := $evfonc_json$["Peso y superficie corporal.","Laboratorio.","Interacciones.","Suplemento.","Educación y comunicación."]$evfonc_json$::jsonb;
  v_j2 := $evfonc_json${"version":1,"total":100,"criteria":[{"id":"validacion","name":"Validación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce el peso desactualizado, recalcula la superficie corporal y define el laboratorio necesario."},{"level":3,"label":"Logrado","description":"Validación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones","name":"Interacciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Identifica la interacción de la capecitabina con la warfarina (aumento del INR) y propone vigilancia o alternativa."},{"level":3,"label":"Logrado","description":"Identifica sin plan."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"suplemento-y-educacion","name":"Suplemento y educación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Aborda el suplemento y educa sobre fiebre, diarrea, síndrome mano-pie y neuropatía por frío."},{"level":3,"label":"Logrado","description":"Educación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion","name":"Comunicación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Comunicación clara al oncólogo."},{"level":3,"label":"Logrado","description":"Comunicación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfonc_json$::jsonb;
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


  -- ── Actividad fonc-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Terapia hormonal en oncología' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Terapia hormonal en oncología) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Tamoxifeno, sofocos e interacción con un antidepresivo';
  v_t2 := $evfonc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Explica la activación del tamoxifeno y la interacción con la paroxetina.</li><li>Propone alternativas para los sofocos que no inhiban el CYP2D6, para discutir con el médico.</li><li>Analiza el anticonceptivo combinado en una paciente con cáncer de mama hormonodependiente.</li><li>Analiza el suplemento de soya.</li><li>Diseña un plan para que no abandone el tamoxifeno.</li><li>Redacta la comunicación a los médicos tratantes.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Detectar la interacción por CYP2D6 y su consecuencia.</li><li>Identificar otros productos inadecuados en una paciente con cáncer hormonodependiente.</li><li>Proponer alternativas y un plan de adherencia.</li></ul>
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
  <tr><td>Interacción</td><td>30 %</td><td>Explica la activación a endoxifeno y la reducción con paroxetina, con alternativa.</td><td>Explica sin alternativa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Productos inadecuados</td><td>25 %</td><td>Reconoce que el anticonceptivo hormonal no se usa en cáncer de mama y advierte sobre la soya.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Adherencia</td><td>25 %</td><td>Plan concreto que aborda los síntomas y el riesgo de abandonar.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación</td><td>10 %</td><td>Comunicación clara y coordinada entre médicos.</td><td>Comunicación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfonc_html$;
  v_t3 := $evfonc_html$<h2>Caso de estudio</h2>
<p>Carolina tiene 44 años, vive en Cali y tiene cáncer de mama con receptores de estrógeno positivos (datos simulados). Lleva cuatro meses con tamoxifeno adyuvante. Por sofocos intensos e insomnio, el médico general le formuló paroxetina. También toma un anticonceptivo oral combinado «para regular la regla» y un suplemento de soya. Dice que piensa dejar el tamoxifeno «porque la está volviendo loca».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfonc_html$;
  v_t4 := 'Informe con propuesta a los médicos y plan de adherencia.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfonc_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los antineoplásicos y medicamentos de soporte del caso (tamoxifeno, inhibidores de aromatasa, análogos de GnRH, abiraterona, antieméticos, factores estimulantes de colonias y opioides); clasificación de emetogenicidad MASCC/ESMO; guía de la OMS de dolor por cáncer (2019); lista NIOSH 2024 de medicamentos peligrosos y capítulo 800 de la USP; Ley 1384 de 2010 y Resolución 444 de 2008 (buenas prácticas de elaboración); criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfonc_html$;
  v_t7 := NULL;
  v_j1 := $evfonc_json$["Interacción por CYP2D6.","Alternativas para los sofocos.","Anticonceptivo y soya.","Adherencia.","Comunicación."]$evfonc_json$::jsonb;
  v_j2 := $evfonc_json${"version":1,"total":100,"criteria":[{"id":"interaccion","name":"Interacción","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Explica la activación a endoxifeno y la reducción con paroxetina, con alternativa."},{"level":3,"label":"Logrado","description":"Explica sin alternativa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"productos-inadecuados","name":"Productos inadecuados","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce que el anticonceptivo hormonal no se usa en cáncer de mama y advierte sobre la soya."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"adherencia","name":"Adherencia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan concreto que aborda los síntomas y el riesgo de abandonar."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion","name":"Comunicación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Comunicación clara y coordinada entre médicos."},{"level":3,"label":"Logrado","description":"Comunicación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfonc_json$::jsonb;
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


  -- ── Actividad fonc-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Manejo seguro de medicamentos peligrosos y farmacia oncológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Manejo seguro de medicamentos peligrosos y farmacia oncológica) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Derrame en la central de mezclas y error de dosis interceptado';
  v_t2 := $evfonc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Describe paso a paso el procedimiento ante el derrame (aislamiento, protección, contención, limpieza, residuos).</li><li>Define qué se documenta y a quién se reporta el derrame, incluida la exposición del auxiliar.</li><li>Explica el efecto del cambio de peso en la superficie corporal y la dosis.</li><li>Describe cómo gestionarías el error interceptado con el oncólogo.</li><li>Propone mejoras en el transporte de mezclas y en la actualización de datos del paciente.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Ejecutar el procedimiento de respuesta ante un derrame.</li><li>Gestionar un error de dosis interceptado.</li><li>Proponer mejoras para prevenir ambos eventos.</li></ul>
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
  <tr><td>Derrame</td><td>30 %</td><td>Procedimiento completo con kit, protección, contención, residuos y descontaminación.</td><td>Procedimiento con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Exposición y documentación</td><td>15 %</td><td>Atiende al auxiliar expuesto y documenta el evento.</td><td>Documenta sin atender la exposición.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Error de dosis</td><td>30 %</td><td>Recalcula, consulta al oncólogo antes de preparar y documenta el error interceptado.</td><td>Detecta sin gestionar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Mejoras</td><td>15 %</td><td>Propone mejoras concretas para ambos eventos.</td><td>Mejoras generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfonc_html$;
  v_t3 := $evfonc_html$<h2>Caso de estudio</h2>
<p>En la central de mezclas de una IPS oncológica de Barranquilla (datos simulados), un auxiliar deja caer en el pasillo una bolsa con un citotóxico preparado y se derraman unos 200 mL. Ese mismo turno, al validar otra orden, el QF detecta que la dosis de un citotóxico se calculó con un peso de hace dos meses: el paciente pasó de 72 a 63 kg.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfonc_html$;
  v_t4 := 'Informe de gestión de eventos con plan de mejora.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfonc_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los antineoplásicos y medicamentos de soporte del caso (tamoxifeno, inhibidores de aromatasa, análogos de GnRH, abiraterona, antieméticos, factores estimulantes de colonias y opioides); clasificación de emetogenicidad MASCC/ESMO; guía de la OMS de dolor por cáncer (2019); lista NIOSH 2024 de medicamentos peligrosos y capítulo 800 de la USP; Ley 1384 de 2010 y Resolución 444 de 2008 (buenas prácticas de elaboración); criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfonc_html$;
  v_t7 := NULL;
  v_j1 := $evfonc_json$["Procedimiento ante el derrame.","Documentación y exposición.","Superficie corporal.","Gestión del error.","Mejoras."]$evfonc_json$::jsonb;
  v_j2 := $evfonc_json${"version":1,"total":100,"criteria":[{"id":"derrame","name":"Derrame","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Procedimiento completo con kit, protección, contención, residuos y descontaminación."},{"level":3,"label":"Logrado","description":"Procedimiento con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"exposicion-y-documentacion","name":"Exposición y documentación","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Atiende al auxiliar expuesto y documenta el evento."},{"level":3,"label":"Logrado","description":"Documenta sin atender la exposición."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"error-de-dosis","name":"Error de dosis","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Recalcula, consulta al oncólogo antes de preparar y documenta el error interceptado."},{"level":3,"label":"Logrado","description":"Detecta sin gestionar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"mejoras","name":"Mejoras","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Propone mejoras concretas para ambos eventos."},{"level":3,"label":"Logrado","description":"Mejoras generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfonc_json$::jsonb;
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


  -- ── Actividad fonc-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Tratamiento de soporte en el paciente oncológico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Tratamiento de soporte en el paciente oncológico) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: primera consulta, hormonoterapia y soporte de Doña Gloria';
  v_t2 := $evfonc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y realiza la conciliación de sus ocho medicamentos y el suplemento.</li><li>Fase 1: identifica interacciones relevantes del inhibidor de CDK4/6 con su fórmula (revisa su ficha técnica) y el riesgo del suplemento.</li><li>Fase 2: plantea la salud ósea con letrozol y su osteoporosis, y la adherencia.</li><li>Fase 3: explica la neutropenia por el inhibidor de CDK4/6, los controles de hemograma y los signos de alarma.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (bases).</strong> Primera consulta: validación, conciliación y educación.</li>
  <li><strong>Fase 2 · Unidad 2 (hormonoterapia).</strong> Letrozol, salud ósea y adherencia.</li>
  <li><strong>Fase 3 · Unidad 3 (soporte).</strong> Neutropenia, síntomas y signos de alarma.</li>
  <li><strong>Fase 4 · Unidad 4 (manejo seguro).</strong> Manipulación segura de antineoplásicos orales en casa.</li>
  <li><strong>Fase 5 · Unidad 5 (contexto colombiano).</strong> Acceso, farmacovigilancia y seguimiento.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Validar y conciliar la terapia de una paciente oncológica polimedicada.</li><li>Planear la hormonoterapia y el soporte con seguridad.</li></ul>
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
  <tr><td>Conciliación e interacciones</td><td>30 %</td><td>Concilia y revisa interacciones del inhibidor de CDK4/6 según su ficha técnica, con el suplemento.</td><td>Conciliación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Hormonoterapia</td><td>25 %</td><td>Aborda la pérdida ósea con letrozol, la osteoporosis y la adherencia.</td><td>Aborda solo uno.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Soporte</td><td>35 %</td><td>Plan de hemogramas, explicación de la neutropenia y signos de alarma claros.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfonc_html$;
  v_t3 := $evfonc_html$<h2>Caso de estudio</h2>
<p>Doña Gloria tiene 67 años, está en el régimen subsidiado y vive en un municipio de Boyacá (datos simulados). Tiene cáncer de mama metastásico con receptores hormonales positivos y recibe letrozol; le prescribieron un inhibidor de CDK4/6 por MIPRES. Tiene osteoporosis, ERC estadio 3 y toma ocho medicamentos, entre ellos omeprazol, un antidepresivo y un suplemento «para el cáncer» que le recomendó una vecina. Viaja 3 horas para cada cita. La EPS la asignó al programa de atención farmacéutica oncológica donde tú eres el QF responsable. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfonc_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfonc_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los antineoplásicos y medicamentos de soporte del caso (tamoxifeno, inhibidores de aromatasa, análogos de GnRH, abiraterona, antieméticos, factores estimulantes de colonias y opioides); clasificación de emetogenicidad MASCC/ESMO; guía de la OMS de dolor por cáncer (2019); lista NIOSH 2024 de medicamentos peligrosos y capítulo 800 de la USP; Ley 1384 de 2010 y Resolución 444 de 2008 (buenas prácticas de elaboración); criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfonc_html$;
  v_t7 := NULL;
  v_j1 := $evfonc_json$["Conciliación.","Interacciones y suplemento.","Salud ósea y adherencia.","Neutropenia y alarma."]$evfonc_json$::jsonb;
  v_j2 := $evfonc_json${"version":1,"total":100,"criteria":[{"id":"conciliacion-e-interacciones","name":"Conciliación e interacciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Concilia y revisa interacciones del inhibidor de CDK4/6 según su ficha técnica, con el suplemento."},{"level":3,"label":"Logrado","description":"Conciliación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"hormonoterapia","name":"Hormonoterapia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Aborda la pérdida ósea con letrozol, la osteoporosis y la adherencia."},{"level":3,"label":"Logrado","description":"Aborda solo uno."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"soporte","name":"Soporte","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Plan de hemogramas, explicación de la neutropenia y signos de alarma claros."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfonc_json$::jsonb;
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


  -- ── Actividad fonc-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Contexto colombiano y farmacovigilancia oncológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Contexto colombiano y farmacovigilancia oncológica) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan integral de atención farmacéutica de Doña Gloria';
  v_t2 := $evfonc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: diseña la educación para manejar, almacenar y desechar los antineoplásicos orales en casa.</li><li>Fase 5: diseña el plan de acceso (MIPRES, entregas sincronizadas) y de seguimiento a distancia.</li><li>Fase 5: define la farmacovigilancia (graduación CTCAE y reporte) e indicadores.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (bases).</strong> Primera consulta: validación, conciliación y educación.</li>
  <li><strong>Fase 2 · Unidad 2 (hormonoterapia).</strong> Letrozol, salud ósea y adherencia.</li>
  <li><strong>Fase 3 · Unidad 3 (soporte).</strong> Neutropenia, síntomas y signos de alarma.</li>
  <li><strong>Fase 4 · Unidad 4 (manejo seguro).</strong> Manipulación segura de antineoplásicos orales en casa.</li>
  <li><strong>Fase 5 · Unidad 5 (contexto colombiano).</strong> Acceso, farmacovigilancia y seguimiento.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar la educación para manejar antineoplásicos orales en casa.</li><li>Planear el acceso, la farmacovigilancia y el seguimiento a distancia.</li></ul>
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
  <tr><td>Manejo seguro</td><td>20 %</td><td>Educación práctica: no triturar, guantes del cuidador, almacenamiento y residuos.</td><td>Educación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acceso y seguimiento</td><td>30 %</td><td>Plan realista con MIPRES, entregas, controles cercanos y telefarmacia.</td><td>Plan sin controles.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Farmacovigilancia e indicadores</td><td>25 %</td><td>Graduación CTCAE, reporte al INVIMA e indicadores medibles.</td><td>Indicadores generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfonc_html$;
  v_t3 := $evfonc_html$<h2>Caso de estudio</h2>
<p>Doña Gloria tiene 67 años, está en el régimen subsidiado y vive en un municipio de Boyacá (datos simulados). Tiene cáncer de mama metastásico con receptores hormonales positivos y recibe letrozol; le prescribieron un inhibidor de CDK4/6 por MIPRES. Tiene osteoporosis, ERC estadio 3 y toma ocho medicamentos, entre ellos omeprazol, un antidepresivo y un suplemento «para el cáncer» que le recomendó una vecina. Viaja 3 horas para cada cita. La EPS la asignó al programa de atención farmacéutica oncológica donde tú eres el QF responsable. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité del programa.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfonc_html$;
  v_t4 := 'Plan integral con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfonc_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los antineoplásicos y medicamentos de soporte del caso (tamoxifeno, inhibidores de aromatasa, análogos de GnRH, abiraterona, antieméticos, factores estimulantes de colonias y opioides); clasificación de emetogenicidad MASCC/ESMO; guía de la OMS de dolor por cáncer (2019); lista NIOSH 2024 de medicamentos peligrosos y capítulo 800 de la USP; Ley 1384 de 2010 y Resolución 444 de 2008 (buenas prácticas de elaboración); criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfonc_html$;
  v_t7 := NULL;
  v_j1 := $evfonc_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Manejo seguro en casa.","Acceso y seguimiento.","Farmacovigilancia e indicadores.","Resumen ejecutivo."]$evfonc_json$::jsonb;
  v_j2 := $evfonc_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"manejo-seguro","name":"Manejo seguro","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Educación práctica: no triturar, guantes del cuidador, almacenamiento y residuos."},{"level":3,"label":"Logrado","description":"Educación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acceso-y-seguimiento","name":"Acceso y seguimiento","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Plan realista con MIPRES, entregas, controles cercanos y telefarmacia."},{"level":3,"label":"Logrado","description":"Plan sin controles."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacovigilancia-e-indicadores","name":"Farmacovigilancia e indicadores","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Graduación CTCAE, reporte al INVIMA e indicadores medibles."},{"level":3,"label":"Logrado","description":"Indicadores generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfonc_json$::jsonb;
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


  -- ── Foro fonc-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia en oncología';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfonc_html$<h2>Para empezar</h2>
<p>Piensa en una persona con cáncer que hayas atendido o acompañado y cuéntanos en tres o cuatro líneas una dificultad que tuvo con sus medicamentos o con el acceso, sin nombres ni datos que la identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfonc_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre medicamentos oncológicos te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfonc_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfonc_html$;
  v_t6 := $evfonc_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfonc_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has trabajado en una central de mezclas o en una farmacia oncológica?', '¿Qué efecto adverso de la quimioterapia te preocupa más?']::text[];
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


  -- ── Foro fonc-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Biología del cáncer y bases de la farmacología antineoplásica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Biología del cáncer y bases de la farmacología antineoplásica) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Primera consulta farmacéutica: ¿qué no puede faltar?';
  v_t2 := 'Argumentar qué debe incluir la primera consulta farmacéutica de un paciente que inicia tratamiento oncológico.';
  v_t3 := $evfonc_html$<h2>Caso del foro</h2>
<p>Una unidad de oncología quiere estandarizar la primera consulta farmacéutica (datos simulados). Un QF propone revisar solo la quimioterapia; otro, incluir la medicación crónica, los productos naturales y la educación; la coordinación pide que dure máximo 15 minutos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfonc_html$;
  v_t4 := '¿Qué componentes priorizarías y cómo los organizarías en el tiempo disponible?';
  v_t5 := $evfonc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación o el dato que sustenta tu priorización. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfonc_html$;
  v_t6 := $evfonc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato que sustenta tu priorización.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfonc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué interacciones frecuentes aparecen entre antineoplásicos y medicación crónica?', '¿Por qué preguntar por productos naturales y suplementos?', '¿Qué información debe llevarse el paciente por escrito?']::text[];
  v_j1 := $evfonc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato que sustenta tu priorización."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfonc_json$::jsonb;
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


  -- ── Foro fonc-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Terapia hormonal en oncología' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Terapia hormonal en oncología) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Adherencia a años de hormonoterapia';
  v_t2 := 'Argumentar cómo apoyar la adherencia a tratamientos hormonales de 5 a 10 años.';
  v_t3 := $evfonc_html$<h2>Caso del foro</h2>
<p>En un programa de cáncer de mama, el 30 % de las pacientes con hormonoterapia adyuvante la abandona antes de 5 años (datos simulados). Las razones: artralgias con los inhibidores de aromatasa, sofocos con el tamoxifeno, miedo a la osteoporosis y la sensación de que «ya están curadas».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfonc_html$;
  v_t4 := '¿Qué intervenciones del servicio farmacéutico propondrías para cada barrera?';
  v_t5 := $evfonc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación que sustenta cada intervención. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfonc_html$;
  v_t6 := $evfonc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada intervención.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfonc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué efectos adversos son más frecuentes con cada familia?', '¿Qué opciones existen para manejar las artralgias y los sofocos?', '¿Cómo medirías la adherencia en un tratamiento tan largo?']::text[];
  v_j1 := $evfonc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada intervención."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfonc_json$::jsonb;
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


  -- ── Foro fonc-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Tratamiento de soporte en el paciente oncológico' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Tratamiento de soporte en el paciente oncológico) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Dolor oncológico no tratado';
  v_t2 := 'Argumentar por qué el dolor oncológico se trata de forma insuficiente y qué puede hacer el QF.';
  v_t3 := $evfonc_html$<h2>Caso del foro</h2>
<p>En una unidad de oncología, una encuesta muestra que el 40 % de los pacientes tiene dolor moderado o intenso (datos simulados). Muchos reciben solo tramadol, algunos no consiguen morfina por trámites de control especial y otros temen «volverse adictos».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfonc_html$;
  v_t4 := '¿Qué barreras identificas y qué intervenciones propondrías?';
  v_t5 := $evfonc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o la norma que sustenta cada intervención. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfonc_html$;
  v_t6 := $evfonc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta cada intervención.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfonc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué recomienda la OMS para el dolor por cáncer?', '¿Cómo se gestiona el acceso a opioides de control especial en Colombia?', '¿Cómo responderías al temor a la adicción?']::text[];
  v_j1 := $evfonc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la norma que sustenta cada intervención."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfonc_json$::jsonb;
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


  -- ── Foro fonc-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Manejo seguro de medicamentos peligrosos y farmacia oncológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Manejo seguro de medicamentos peligrosos y farmacia oncológica) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Seguridad ocupacional con medicamentos peligrosos';
  v_t2 := 'Argumentar cómo proteger al personal que manipula medicamentos peligrosos, incluidos los orales.';
  v_t3 := $evfonc_html$<h2>Caso del foro</h2>
<p>En una farmacia ambulatoria de oncología (datos simulados), el personal cuenta tabletas de capecitabina con las manos, una auxiliar embarazada reempaca antineoplásicos orales y los residuos se botan con la basura común. Nadie ha recibido capacitación sobre medicamentos peligrosos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfonc_html$;
  v_t4 := '¿Qué cambios propondrías y cuáles priorizarías?';
  v_t5 := $evfonc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la lista NIOSH, el capítulo 800 de la USP o la norma que sustenta cada cambio. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfonc_html$;
  v_t6 := $evfonc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la lista NIOSH, el capítulo 800 de la USP o la norma que sustenta cada cambio.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfonc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dice NIOSH sobre la manipulación de formas orales?', '¿Qué medidas especiales requiere el personal en edad fértil o embarazado?', '¿Cómo se gestionan los residuos citotóxicos?']::text[];
  v_j1 := $evfonc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la lista NIOSH, el capítulo 800 de la USP o la norma que sustenta cada cambio."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfonc_json$::jsonb;
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


  -- ── Foro fonc-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Contexto colombiano y farmacovigilancia oncológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Contexto colombiano y farmacovigilancia oncológica) en Farmacología Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Barreras de acceso en oncología';
  v_t2 := 'Argumentar el papel del QF en la gestión del acceso a medicamentos oncológicos.';
  v_t3 := $evfonc_html$<h2>Caso del foro</h2>
<p>Un servicio farmacéutico oncológico registra en un trimestre (datos simulados): 20 pacientes con retrasos de más de dos semanas por trámites, 8 que viajan más de 3 horas por cada entrega y 5 que interrumpieron su tratamiento oral por falta de medicamento.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfonc_html$;
  v_t4 := '¿Qué intervenciones propondrías para reducir estas barreras y cómo las medirías?';
  v_t5 := $evfonc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o el dato que sustenta cada intervención. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfonc_html$;
  v_t6 := $evfonc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el dato que sustenta cada intervención.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfonc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué diferencia hay entre las tecnologías financiadas con la UPC y las prescritas por MIPRES?', '¿Qué consecuencias clínicas tienen las interrupciones?', '¿Qué papel tienen la telefarmacia y las entregas a domicilio?']::text[];
  v_j1 := $evfonc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el dato que sustenta cada intervención."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfonc_json$::jsonb;
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


  RAISE NOTICE 'Farmacología Oncológica: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfonc$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Quimioterapia Antineoplásica
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfqt$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Quimioterapia Antineoplásica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos de la quimioterapia citotóxica y agentes alquilantes', 'Unidad 2. Antimetabolitos', 'Unidad 3. Antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos', 'Unidad 4. Cálculo de dosis, validación y preparación', 'Unidad 5. Seguridad: extravasación, toxicidades, interacciones y quimioterapia oral']::text[])) < 5 THEN
    RAISE NOTICE 'Quimioterapia Antineoplásica: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfqt_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfqt_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fqt-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la quimioterapia citotóxica y agentes alquilantes' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la quimioterapia citotóxica y agentes alquilantes) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos de la quimioterapia citotóxica y agentes alquilantes';
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


    v_t3 := '¿Cómo se previene la cistitis hemorrágica por ciclofosfamida o ifosfamida a dosis altas?';
    v_t4 := 'Las oxazafosforinas (ciclofosfamida, ifosfamida) se activan en el hígado y producen acroleína, que lesiona la vejiga. La cistitis hemorrágica se previene con mesna, que neutraliza la acroleína en la orina, e hidratación. La ifosfamida puede causar además encefalopatía.';
    v_j1 := $evfqt_json${"external_id":"fqt-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Ciclofosfamida e ifosfamida: activación, cistitis hemorrágica y mesna","outcome":"Ciclofosfamida e ifosfamida: activación, cistitis hemorrágica y mesna","source":"Fichas técnicas de ciclofosfamida, ifosfamida y mesna."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Con un antibiótico profiláctico durante el ciclo, porque la cistitis siempre es de origen infeccioso.', FALSE, 'La cistitis se debe a un metabolito tóxico, no a una infección.', 0),
      (v_pregunta, 'Con restricción de líquidos, para que la orina concentrada proteja la mucosa de la vejiga.', FALSE, 'Se necesita lo contrario: hidratación abundante.', 1),
      (v_pregunta, 'Con un antiespasmódico urinario, que bloquea la llegada del metabolito tóxico a la vejiga.', FALSE, 'No es el mecanismo de prevención.', 2),
      (v_pregunta, 'Con mesna e hidratación, que neutralizan y diluyen la acroleína en la vejiga.', TRUE, 'Correcto. La acroleína es el metabolito responsable.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente recibirá cisplatino a dosis altas. ¿Qué medidas preventivas verifica el QF en la orden?';
    v_t4 := 'El cisplatino forma enlaces cruzados en el ADN; su toxicidad limitante es renal y produce pérdida de magnesio y potasio, ototoxicidad acumulativa, neuropatía y emesis de alto riesgo. Se previene con hidratación, reposición de magnesio, evitar nefrotóxicos (AINE, aminoglucósidos) y vigilancia de la función renal y la audición.';
    v_j1 := $evfqt_json${"external_id":"fqt-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Platinos: cisplatino, carboplatino y oxaliplatino","outcome":"Platinos: cisplatino, carboplatino y oxaliplatino","source":"Ficha técnica de cisplatino."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo un antiemético en la noche, porque el cisplatino no tiene otras toxicidades relevantes.', FALSE, 'Tiene toxicidades renal, auditiva y neurológica.', 0),
      (v_pregunta, 'Hidratación, reposición de magnesio, evitar nefrotóxicos y control de la audición y la función renal.', TRUE, 'Correcto. Además, profilaxis antiemética de alto riesgo.', 1),
      (v_pregunta, 'Una dosis alta de furosemida antes de cada ciclo para eliminar el cisplatino por la orina mucho más rápido.', FALSE, 'El diurético no reemplaza la hidratación y puede deshidratar.', 2),
      (v_pregunta, 'Reducir la ingesta de agua el día del ciclo para que el cisplatino actúe con más potencia.', FALSE, 'La deshidratación aumenta la nefrotoxicidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Tras recibir oxaliplatino, un paciente siente que «se le cierra la garganta» al tomar agua fría. No tiene erupción ni hipotensión. ¿Qué análisis es correcto?';
    v_t4 := 'El oxaliplatino causa una neurotoxicidad aguda desencadenada por el frío (parestesias, disestesia faringolaríngea con sensación de falta de aire) y una neuropatía sensitiva acumulativa. Se educa para evitar bebidas y aire fríos. Las reacciones de hipersensibilidad tienen otros signos.';
    v_j1 := $evfqt_json${"external_id":"fqt-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Platinos: cisplatino, carboplatino y oxaliplatino","outcome":"Platinos: cisplatino, carboplatino y oxaliplatino","source":"Ficha técnica de oxaliplatino."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una anafilaxia grave y debe administrarse epinefrina de inmediato en la casa.', FALSE, 'Faltan los signos de una reacción alérgica sistémica.', 0),
      (v_pregunta, 'Es una infección de la garganta por la neutropenia y requiere un antibiótico urgente.', FALSE, 'El cuadro aparece con el frío, no con una infección.', 1),
      (v_pregunta, 'Es una neurotoxicidad aguda por el frío, típica del oxaliplatino; se evitan las bebidas y el aire fríos.', TRUE, 'Correcto. Es transitoria, pero debe informarse al oncólogo.', 2),
      (v_pregunta, 'Es un efecto del antiemético y desaparece al suspender el antiemético por completo.', FALSE, 'Es un efecto característico del oxaliplatino.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con cisplatino tiene la creatinina en ascenso, el magnesio bajo, zumbido de oídos y toma ibuprofeno para el dolor. El médico propone «seguir igual en el próximo ciclo». ¿Cuál es la mejor valoración?';
    v_t4 := 'La nefrotoxicidad, la hipomagnesemia y la ototoxicidad del cisplatino son acumulativas. Los AINE suman daño renal. Antes de cada ciclo se revisan la función renal, los electrolitos y la audición; el oncólogo decide ajustes o cambios (por ejemplo, a carboplatino en algunos esquemas).';
    v_j1 := $evfqt_json${"external_id":"fqt-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso clínico: seguimiento de un paciente con cisplatino","outcome":"Caso clínico: seguimiento de un paciente con cisplatino","source":"Ficha técnica de cisplatino."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Conviene revisarlo: retirar el AINE, reponer magnesio y evaluar la función renal y la audición antes de continuar.', TRUE, 'Correcto. El oncólogo define el ajuste o el cambio.', 0),
      (v_pregunta, 'Es adecuado, porque la ototoxicidad del cisplatino siempre es reversible al terminar el tratamiento.', FALSE, 'La ototoxicidad puede ser permanente.', 1),
      (v_pregunta, 'Es adecuado si se duplica la hidratación solo el día del ciclo, sin otros cambios.', FALSE, 'Persisten el AINE y las alteraciones detectadas.', 2),
      (v_pregunta, 'Conviene cambiar el ibuprofeno por naproxeno, que no afecta el riñón durante la quimioterapia.', FALSE, 'El naproxeno también es nefrotóxico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fqt-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antimetabolitos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antimetabolitos) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Antimetabolitos';
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


    v_t3 := '¿Qué situación prolonga la exposición al metotrexato y aumenta su toxicidad?';
    v_t4 := 'El metotrexato inhibe la dihidrofolato reductasa y se elimina sobre todo por el riñón. Los terceros espacios (ascitis, derrames) actúan como reservorio y prolongan su exposición, igual que la función renal reducida; aumentan la mielotoxicidad, la mucositis y la nefrotoxicidad.';
    v_j1 := $evfqt_json${"external_id":"fqt-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Metotrexato: mecanismo, farmacocinética y toxicidad","outcome":"Metotrexato: mecanismo, farmacocinética y toxicidad","source":"Ficha técnica de metotrexato."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un tercer espacio, como ascitis o derrame pleural, del que el fármaco se libera lentamente.', TRUE, 'Correcto. También la función renal reducida.', 0),
      (v_pregunta, 'Tomar el metotrexato con abundante agua, porque diluye el fármaco en la orina y retrasa su eliminación.', FALSE, 'La hidratación favorece su eliminación.', 1),
      (v_pregunta, 'Una función renal muy buena, porque el riñón reabsorbe más metotrexato y lo acumula.', FALSE, 'La función renal reducida es la que prolonga la exposición.', 2),
      (v_pregunta, 'Recibir ácido fólico, porque potencia la inhibición de la dihidrofolato reductasa.', FALSE, 'El folinato se usa justamente como rescate.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente que recibirá metotrexato a dosis altas tiene en su fórmula omeprazol y trimetoprim-sulfametoxazol. ¿Qué advierte el QF?';
    v_t4 := 'Con metotrexato a dosis altas se usan hidratación, alcalinización urinaria, niveles seriados y rescate con folinato cálcico. Fármacos que retrasan su eliminación o suman toxicidad (IBP, trimetoprim-sulfametoxazol, AINE, algunas penicilinas) se evitan o se vigilan de cerca.';
    v_j1 := $evfqt_json${"external_id":"fqt-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Metotrexato a dosis altas: rescate con leucovorina y monitorización de niveles","outcome":"Metotrexato a dosis altas: rescate con leucovorina y monitorización de niveles","source":"Ficha técnica de metotrexato."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que no hay ningún problema, porque el metotrexato no interactúa con otros medicamentos.', FALSE, 'Tiene interacciones relevantes.', 0),
      (v_pregunta, 'Que el omeprazol acelera la eliminación del metotrexato y hay que aumentar la dosis.', FALSE, 'Ocurre lo contrario.', 1),
      (v_pregunta, 'Que ambos pueden retrasar la eliminación del metotrexato; se valora suspenderlos y vigilar niveles.', TRUE, 'Correcto. También los AINE y algunas penicilinas.', 2),
      (v_pregunta, 'Que el trimetoprim-sulfametoxazol reemplaza la necesidad de rescate con folinato.', FALSE, 'El rescate sigue siendo necesario.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con capecitabina presenta en el primer ciclo mucositis grave, diarrea intensa y neutropenia profunda. ¿Qué análisis es correcto?';
    v_t4 := 'Más del 80 % del 5-fluorouracilo se cataboliza por la dihidropirimidina deshidrogenasa (DPD, gen DPYD). Los pacientes con déficit acumulan el fármaco y pueden presentar toxicidad grave o mortal. La EMA recomienda evaluar la DPD antes de iniciar fluoropirimidinas.';
    v_j1 := $evfqt_json${"external_id":"fqt-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"5-fluorouracilo y capecitabina: DPD, modulación con leucovorina y toxicidad","outcome":"5-fluorouracilo y capecitabina: DPD, modulación con leucovorina y toxicidad","source":"Recomendación de la EMA sobre la prueba de DPD; ficha técnica de capecitabina."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es la toxicidad esperada en todos los pacientes y no requiere ningún estudio adicional.', FALSE, 'Una toxicidad tan grave en el primer ciclo sugiere otra causa.', 0),
      (v_pregunta, 'Se debe a una alergia a la capecitabina, que se resuelve con antihistamínicos.', FALSE, 'No es una reacción alérgica.', 1),
      (v_pregunta, 'Se debe a que tomó la capecitabina con comida, que aumenta mucho su absorción.', FALSE, 'La capecitabina se toma con comida según la ficha técnica.', 2),
      (v_pregunta, 'Puede deberse a un déficit de DPD, que impide eliminar el fluorouracilo; por eso se recomienda la prueba antes.', TRUE, 'Correcto. Se suspende y se informa al oncólogo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una orden de citarabina a dosis altas no incluye colirio de corticoide. El médico dice que «no hace falta». ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'La citarabina a dosis altas produce conjuntivitis química (se previene con colirio de corticoide), toxicidad cerebelosa (se vigilan los signos antes de cada dosis) y el síndrome de citarabina. La gemcitabina tiene su propia toxicidad, como la pulmonar.';
    v_j1 := $evfqt_json${"external_id":"fqt-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Gemcitabina y citarabina","outcome":"Gemcitabina y citarabina","source":"Ficha técnica de citarabina."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta, porque la citarabina no tiene ninguna toxicidad ocular a ninguna dosis.', FALSE, 'A dosis altas produce conjuntivitis.', 0),
      (v_pregunta, 'Conviene proponer el colirio: a dosis altas la citarabina causa conjuntivitis, y se vigila la toxicidad cerebelosa.', TRUE, 'Correcto. Es parte del esquema de soporte.', 1),
      (v_pregunta, 'Es correcta si el paciente usa gafas oscuras durante toda la infusión.', FALSE, 'Las gafas no previenen la conjuntivitis química.', 2),
      (v_pregunta, 'Conviene reemplazar la citarabina por gemcitabina, que no tiene ningún efecto en los ojos.', FALSE, 'El cambio de fármaco no es la respuesta a este problema.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fqt-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos';
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


    v_t3 := '¿Qué caracteriza a la cardiotoxicidad de las antraciclinas como la doxorrubicina?';
    v_t4 := 'Las antraciclinas producen cardiotoxicidad relacionada con la dosis acumulada, que puede ser irreversible y aparecer años después. Se evalúa la fracción de eyección antes y durante el tratamiento, se registra la dosis acumulada y se consideran factores de riesgo; el dexrazoxano puede usarse como cardioprotector en casos seleccionados.';
    v_j1 := $evfqt_json${"external_id":"fqt-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Antraciclinas: mecanismo, cardiotoxicidad y dosis acumulada","outcome":"Antraciclinas: mecanismo, cardiotoxicidad y dosis acumulada","source":"Ficha técnica de doxorrubicina."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Aparece solo en la primera dosis y no tiene relación con la dosis total recibida.', FALSE, 'La cardiotoxicidad crónica depende de la dosis acumulada.', 0),
      (v_pregunta, 'Depende de la dosis acumulada; se vigila la fracción de eyección y se controla el total recibido.', TRUE, 'Correcto. El riesgo aumenta con factores cardiovasculares.', 1),
      (v_pregunta, 'Es siempre reversible al suspender el tratamiento y no requiere ningún seguimiento.', FALSE, 'Puede ser irreversible y aparecer años después.', 2),
      (v_pregunta, 'Se previene tomando la doxorrubicina con comida para reducir su absorción en el corazón.', FALSE, 'La doxorrubicina es intravenosa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente recibirá paclitaxel. ¿Qué verifica el QF en la preparación y la premedicación?';
    v_t4 := 'El paclitaxel estabiliza los microtúbulos. Por su vehículo puede causar reacciones de hipersensibilidad, por lo que se premedica con un corticoide y antihistamínicos H1 y H2; se administra con equipos sin PVC y filtro en línea. Su toxicidad incluye neuropatía periférica y mielosupresión.';
    v_j1 := $evfqt_json${"external_id":"fqt-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Taxanos: premedicación, hipersensibilidad y neuropatía","outcome":"Taxanos: premedicación, hipersensibilidad y neuropatía","source":"Ficha técnica de paclitaxel."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que se prepare en un equipo de PVC sin filtro y se administre sin premedicación para ahorrar tiempo.', FALSE, 'El PVC y la falta de premedicación son riesgos.', 0),
      (v_pregunta, 'Que se administre en bolo rápido de 5 minutos para reducir las reacciones de hipersensibilidad.', FALSE, 'La infusión rápida no reduce la hipersensibilidad.', 1),
      (v_pregunta, 'Que se mezcle con el resto de la quimioterapia en la misma bolsa para una sola infusión.', FALSE, 'No se mezcla con otros citotóxicos en la misma bolsa.', 2),
      (v_pregunta, 'Premedicación (corticoide y antihistamínicos) y un equipo sin PVC con filtro en línea.', TRUE, 'Correcto. Por el riesgo de hipersensibilidad y por el vehículo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Durante la infusión de irinotecán, un paciente presenta sudoración, cólicos, salivación y diarrea. ¿Qué análisis es correcto?';
    v_t4 := 'El irinotecán produce una diarrea temprana colinérgica (sudoración, cólicos, salivación) durante o poco después de la infusión, que responde a la atropina, y una diarrea tardía que puede ser grave y se maneja con loperamida a dosis altas e hidratación. El polimorfismo UGT1A1*28 aumenta el riesgo de neutropenia.';
    v_j1 := $evfqt_json${"external_id":"fqt-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Irinotecán, topotecán y etopósido","outcome":"Irinotecán, topotecán y etopósido","source":"Ficha técnica de irinotecán."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un síndrome colinérgico agudo por el irinotecán, que responde a la atropina.', TRUE, 'Correcto. La diarrea tardía se maneja de otra forma.', 0),
      (v_pregunta, 'Es una reacción alérgica grave que exige epinefrina y suspender el tratamiento para siempre.', FALSE, 'Los síntomas son colinérgicos, no alérgicos.', 1),
      (v_pregunta, 'Es la diarrea tardía del irinotecán, que se trata con antibióticos desde el primer síntoma.', FALSE, 'La diarrea tardía aparece días después.', 2),
      (v_pregunta, 'Es una infección intestinal adquirida en la unidad de quimioterapia durante la infusión.', FALSE, 'La cronología orienta al efecto del fármaco.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En un servicio de pediatría proponen enviar en la misma bandeja la jeringa de vincristina intravenosa y las de metotrexato intratecal «para ahorrar viajes». ¿Cuál es la mejor valoración?';
    v_t4 := 'La administración intratecal de alcaloides de la vinca es casi siempre mortal. Las barreras recomendadas incluyen diluir la vincristina en una minibolsa (no en jeringa), rotularla como «solo intravenosa, mortal por otras vías» y separar en tiempo y lugar su entrega de los intratecales.';
    v_j1 := $evfqt_json${"external_id":"fqt-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Alcaloides de la vinca y el error fatal de la vincristina intratecal","outcome":"Alcaloides de la vinca y el error fatal de la vincristina intratecal","source":"Alertas de la OMS y del ISMP sobre la vincristina; ficha técnica."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada si las jeringas tienen colores distintos, porque así no se confunden nunca.', FALSE, 'El color no es una barrera suficiente.', 0),
      (v_pregunta, 'Es adecuada si la enfermera es experimentada y conoce bien ambos medicamentos.', FALSE, 'La experiencia no evita este error.', 1),
      (v_pregunta, 'Es inaceptable: la vincristina intratecal es casi siempre mortal; se diluye en minibolsa y se separa en tiempo y lugar.', TRUE, 'Correcto. Con rótulo de «mortal por otras vías».', 2),
      (v_pregunta, 'Es inaceptable solo porque el metotrexato debe prepararse en una cabina distinta de la vincristina.', FALSE, 'El riesgo principal es el error de vía.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fqt-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Cálculo de dosis, validación y preparación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Cálculo de dosis, validación y preparación) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Cálculo de dosis, validación y preparación';
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


    v_t3 := '¿Cuál es la superficie corporal, por la fórmula de Mosteller, de una persona de 170 cm y 70 kg?';
    v_t4 := 'Fórmula de Mosteller: superficie corporal (m²) = raíz cuadrada de (talla en cm × peso en kg / 3.600). Para 170 cm y 70 kg: raíz de 3,31 ≈ 1,82 m². Se recalcula si el peso cambia de forma significativa.';
    v_j1 := $evfqt_json${"external_id":"fqt-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Superficie corporal: fórmulas, obesidad y redondeo","outcome":"Superficie corporal: fórmulas, obesidad y redondeo","source":"Fórmula de Mosteller."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Alrededor de 1,50 m², porque la fórmula divide el peso entre la talla en metros.', FALSE, 'La fórmula de Mosteller es otra.', 0),
      (v_pregunta, 'Alrededor de 2,40 m², porque la fórmula suma el peso y la talla y los divide entre 100.', FALSE, 'Ese no es el cálculo.', 1),
      (v_pregunta, 'Alrededor de 1,82 m²: raíz cuadrada de (170 × 70 / 3.600).', TRUE, 'Correcto. Se recalcula si el peso cambia.', 2),
      (v_pregunta, 'Alrededor de 1,20 m², porque la fórmula usa solo el peso del paciente en kilogramos.', FALSE, 'La fórmula usa la talla y el peso.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Se prescribe carboplatino AUC 5 a un paciente con una TFG estimada de 75 mL/min. ¿Qué dosis resulta con la fórmula de Calvert?';
    v_t4 := 'La fórmula de Calvert calcula la dosis de carboplatino: dosis (mg) = AUC objetivo × (TFG + 25). Con AUC 5 y TFG de 75 mL/min: 5 × 100 = 500 mg. Los protocolos fijan un tope de TFG (habitualmente 125 mL/min).';
    v_j1 := $evfqt_json${"external_id":"fqt-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Carboplatino por AUC (fórmula de Calvert) y ajustes renal y hepático","outcome":"Carboplatino por AUC (fórmula de Calvert) y ajustes renal y hepático","source":"Fórmula de Calvert; ficha técnica de carboplatino."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, '500 mg: 5 × (75 + 25).', TRUE, 'Correcto. Se aplica el tope de TFG del protocolo.', 0),
      (v_pregunta, '375 mg, porque la fórmula multiplica el AUC por la TFG sin sumar ningún valor.', FALSE, 'La fórmula suma 25 a la TFG.', 1),
      (v_pregunta, '750 mg, porque la fórmula multiplica el AUC por la TFG y luego por dos.', FALSE, 'Ese no es el cálculo de Calvert.', 2),
      (v_pregunta, '125 mg, porque la dosis de carboplatino siempre se calcula por superficie corporal.', FALSE, 'El carboplatino se dosifica por AUC.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'El día de un ciclo, el recuento de neutrófilos de una paciente es de 900/µL y no tiene fiebre. La orden está completa. ¿Qué análisis hace el QF?';
    v_t4 := 'La validación farmacéutica incluye verificar los criterios hematológicos para administrar el ciclo (con frecuencia neutrófilos de 1.500/µL o más y plaquetas de 100.000/µL o más, según el protocolo). Si no se cumplen, se consulta al oncólogo antes de preparar.';
    v_j1 := $evfqt_json${"external_id":"fqt-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Validación farmacéutica de la prescripción de quimioterapia","outcome":"Validación farmacéutica de la prescripción de quimioterapia","source":"Recomendaciones de validación de quimioterapia; protocolos institucionales."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se puede administrar el ciclo sin cambios, porque la paciente no tiene fiebre en este momento.', FALSE, 'Los criterios hematológicos no se cumplen.', 0),
      (v_pregunta, 'No cumple los criterios hematológicos habituales para administrar; se consulta al oncólogo antes de preparar.', TRUE, 'Correcto. El protocolo define si se aplaza o se ajusta.', 1),
      (v_pregunta, 'Se debe administrar el doble de dosis para compensar el retraso del ciclo anterior.', FALSE, 'Duplicar la dosis sería peligroso.', 2),
      (v_pregunta, 'Se debe preparar la mezcla y guardarla, porque el resultado del laboratorio no influye en absoluto en la validación de la orden.', FALSE, 'El laboratorio es parte de la validación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una clínica propone preparar los citotóxicos en una cabina de flujo laminar horizontal que ya tiene. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'La cabina de flujo laminar horizontal protege el producto, pero dirige el aire hacia el operador y lo expone a los citotóxicos. Los medicamentos peligrosos se preparan en cabinas de seguridad biológica (clase II tipo adecuado) o aisladores, con sistemas cerrados cuando es posible, según el capítulo 800 de la USP y las buenas prácticas de elaboración.';
    v_j1 := $evfqt_json${"external_id":"fqt-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Preparación, estabilidad de mezclas y manipulación segura","outcome":"Preparación, estabilidad de mezclas y manipulación segura","source":"Capítulo 800 de la USP; Resolución 444 de 2008."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada, porque cualquier cabina de flujo laminar protege por igual al producto y al operador.', FALSE, 'No todas las cabinas protegen al operador.', 0),
      (v_pregunta, 'Es adecuada si el operador usa doble tapabocas durante toda la preparación.', FALSE, 'El tapabocas no compensa la exposición.', 1),
      (v_pregunta, 'Es adecuada si se prepara con la puerta abierta para ventilar la sala.', FALSE, 'Eso dispersa el contaminante.', 2),
      (v_pregunta, 'Es inadecuada: el flujo horizontal dirige el aire hacia el operador; se requiere cabina de seguridad biológica.', TRUE, 'Correcto. Con sistemas cerrados cuando sea posible.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fqt-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Seguridad: extravasación, toxicidades, interacciones y quimioterapia oral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Seguridad: extravasación, toxicidades, interacciones y quimioterapia oral) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Seguridad: extravasación, toxicidades, interacciones y quimioterapia oral';
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


    v_t3 := '¿Cuál de estos citotóxicos es vesicante, es decir, puede causar necrosis si se extravasa?';
    v_t4 := 'Los citotóxicos se clasifican por su agresividad tisular en vesicantes (antraciclinas como la doxorrubicina, alcaloides de la vinca), irritantes y no agresivos. Ante una extravasación se aplican medidas generales y específicas (dexrazoxano para antraciclinas; calor y hialuronidasa para alcaloides de la vinca) con un kit disponible.';
    v_j1 := $evfqt_json${"external_id":"fqt-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Extravasación: vesicantes, irritantes y antídotos","outcome":"Extravasación: vesicantes, irritantes y antídotos","source":"Fichas técnicas; recomendaciones de manejo de extravasaciones."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El carboplatino, que se considera vesicante en cualquier concentración que se use.', FALSE, 'No se clasifica como vesicante.', 0),
      (v_pregunta, 'La gemcitabina, que produce necrosis extensa con cualquier volumen extravasado.', FALSE, 'No se clasifica como vesicante.', 1),
      (v_pregunta, 'El metotrexato, que es el vesicante más potente de todos los citotóxicos disponibles.', FALSE, 'No se clasifica como vesicante.', 2),
      (v_pregunta, 'La doxorrubicina.', TRUE, 'Correcto. Las antraciclinas y los alcaloides de la vinca son vesicantes.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con linfoma voluminoso y ácido úrico elevado iniciará quimioterapia. Tiene alto riesgo de síndrome de lisis tumoral. ¿Qué verifica el QF?';
    v_t4 := 'El síndrome de lisis tumoral produce hiperuricemia, hiperpotasemia, hiperfosfatemia e hipocalcemia y puede causar lesión renal aguda. En riesgo alto se usan hidratación intensa y rasburicasa (contraindicada en déficit de G6PD por el riesgo de hemólisis); en riesgo intermedio, alopurinol. Se vigilan electrolitos y función renal con frecuencia.';
    v_j1 := $evfqt_json${"external_id":"fqt-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Síndrome de lisis tumoral","outcome":"Síndrome de lisis tumoral","source":"Ficha técnica de rasburicasa; recomendaciones de prevención del síndrome de lisis tumoral."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Hidratación intensa y rasburicasa, comprobando antes que no tenga déficit de G6PD.', TRUE, 'Correcto. Con vigilancia de electrolitos y función renal.', 0),
      (v_pregunta, 'Restricción de líquidos para evitar sobrecarga mientras se administra la quimioterapia.', FALSE, 'La hidratación es la base de la prevención.', 1),
      (v_pregunta, 'Suplementos de potasio y fósforo para compensar las pérdidas que produce la lisis tumoral.', FALSE, 'La lisis eleva el potasio y el fósforo.', 2),
      (v_pregunta, 'Iniciar alopurinol y rasburicasa juntos a dosis máxima sin ningún control de laboratorio.', FALSE, 'Se requiere vigilancia estrecha de laboratorio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Al día 12 de su ciclo, un paciente sin fiebre tiene 400 neutrófilos/µL en un control de rutina. ¿Qué análisis es correcto?';
    v_t4 := 'La mayoría de los citotóxicos producen un nadir de neutrófilos alrededor de los días 7 a 14. Sin fiebre ni signos de infección no es una neutropenia febril, pero el paciente debe saber que la fiebre en ese periodo es una urgencia. El protocolo define si se usan factores estimulantes de colonias o ajustes en el siguiente ciclo.';
    v_j1 := $evfqt_json${"external_id":"fqt-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Mielosupresión y neutropenia febril: nadir y criterios de administración","outcome":"Mielosupresión y neutropenia febril: nadir y criterios de administración","source":"Fichas técnicas; recomendaciones de neutropenia febril."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una urgencia vital que obliga a hospitalizarlo y darle antibióticos de amplio espectro aunque esté sin fiebre.', FALSE, 'Sin fiebre ni infección no es una neutropenia febril.', 0),
      (v_pregunta, 'Es probablemente el nadir esperado; se educa sobre la fiebre como urgencia y se sigue el protocolo.', TRUE, 'Correcto. La conducta depende del protocolo y de los síntomas.', 1),
      (v_pregunta, 'Indica que el tratamiento fracasó y debe cambiarse de inmediato por otro esquema.', FALSE, 'El nadir no indica fracaso del tratamiento.', 2),
      (v_pregunta, 'Se debe a un error del laboratorio, porque la quimioterapia no baja los neutrófilos.', FALSE, 'La mielosupresión es una toxicidad frecuente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una paciente con capecitabina, cuyo esquema es 14 días de toma y 7 de descanso, cuenta que la toma «todos los días sin parar» desde hace un mes. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'La quimioterapia oral traslada al paciente la responsabilidad de seguir esquemas complejos; los errores de esquema son frecuentes y pueden causar toxicidad grave. Ante un error, se suspende la toma, se informa al oncólogo, se evalúan signos de toxicidad (diarrea, mucositis, síndrome mano-pie, neutropenia) y se refuerza la educación con calendarios.';
    v_j1 := $evfqt_json${"external_id":"fqt-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Quimioterapia oral: adherencia, educación y manejo en casa","outcome":"Quimioterapia oral: adherencia, educación y manejo en casa","source":"Ficha técnica de capecitabina; recomendaciones de quimioterapia oral."}$evfqt_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fqt-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No hay problema, porque tomarla de forma continua solo mejora la eficacia contra el tumor.', FALSE, 'Aumenta el riesgo de toxicidad grave.', 0),
      (v_pregunta, 'Es un error que se corrige en el próximo control, sin necesidad de avisar al oncólogo.', FALSE, 'Debe informarse de inmediato.', 1),
      (v_pregunta, 'Es un error de esquema con riesgo de toxicidad: se suspende, se avisa al oncólogo y se refuerza la educación.', TRUE, 'Correcto. Se evalúan síntomas de toxicidad.', 2),
      (v_pregunta, 'Es un error, pero se compensa si descansa 14 días seguidos antes de reiniciar el esquema.', FALSE, 'La conducta la define el oncólogo tras evaluarla.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fqt-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la quimioterapia citotóxica y agentes alquilantes' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la quimioterapia citotóxica y agentes alquilantes) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Seguimiento de un paciente con cisplatino';
  v_t2 := $evfqt_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Relaciona cada hallazgo con una toxicidad del cisplatino.</li><li>Identifica los factores que agravan el daño renal en este paciente.</li><li>Propone el manejo de la hipomagnesemia, la hidratación y la analgesia para la mucositis.</li><li>Analiza la profilaxis antiemética de la fase tardía.</li><li>Redacta la comunicación al oncólogo antes del tercer ciclo.</li><li>Diseña el plan de seguimiento entre ciclos.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar las toxicidades del cisplatino y sus factores agravantes.</li><li>Proponer medidas de prevención y ajuste al oncólogo.</li><li>Planear la educación y el seguimiento.</li></ul>
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
  <tr><td>Toxicidades</td><td>25 %</td><td>Relaciona creatinina, magnesio, zumbido y náuseas tardías con el cisplatino.</td><td>Relaciona la mayoría.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Agravantes y prevención</td><td>35 %</td><td>Identifica el AINE y la deshidratación, propone retirarlo, analgesia alternativa, hidratación y magnesio.</td><td>Propuesta parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Antiemesis</td><td>20 %</td><td>Propone una profilaxis de alto riesgo con cobertura de la fase tardía.</td><td>Propuesta general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación</td><td>10 %</td><td>Comunicación clara y oportuna.</td><td>Comunicación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfqt_html$;
  v_t3 := $evfqt_html$<h2>Caso de estudio</h2>
<p>Don Rafael tiene 58 años, vive en Bucaramanga y recibe cisplatino concomitante con radioterapia por un cáncer de cabeza y cuello (datos simulados). Antes del tercer ciclo: creatinina de 1,6 mg/dL (era 0,9), magnesio bajo, zumbido en ambos oídos y náuseas que duran varios días tras cada ciclo. Toma ibuprofeno 400 mg cada 8 horas por la mucositis y bebe poca agua porque le duele tragar.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfqt_html$;
  v_t4 := 'Informe de seguimiento con comunicación al oncólogo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfqt_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los citotóxicos del caso (ciclofosfamida, ifosfamida, cisplatino, carboplatino, oxaliplatino, metotrexato, 5-fluorouracilo, capecitabina, citarabina, doxorrubicina, irinotecán, paclitaxel y vincristina) y de sus antídotos y medicamentos de soporte; recomendaciones de la EMA sobre la prueba de DPD; alertas de la OMS y del ISMP sobre la vincristina; capítulo 800 de la USP; Resolución 444 de 2008; criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfqt_html$;
  v_t7 := NULL;
  v_j1 := $evfqt_json$["Toxicidades.","Factores agravantes.","Prevención y analgesia.","Antiemesis tardía.","Comunicación y seguimiento."]$evfqt_json$::jsonb;
  v_j2 := $evfqt_json${"version":1,"total":100,"criteria":[{"id":"toxicidades","name":"Toxicidades","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Relaciona creatinina, magnesio, zumbido y náuseas tardías con el cisplatino."},{"level":3,"label":"Logrado","description":"Relaciona la mayoría."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"agravantes-y-prevencion","name":"Agravantes y prevención","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Identifica el AINE y la deshidratación, propone retirarlo, analgesia alternativa, hidratación y magnesio."},{"level":3,"label":"Logrado","description":"Propuesta parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"antiemesis","name":"Antiemesis","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Propone una profilaxis de alto riesgo con cobertura de la fase tardía."},{"level":3,"label":"Logrado","description":"Propuesta general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion","name":"Comunicación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Comunicación clara y oportuna."},{"level":3,"label":"Logrado","description":"Comunicación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfqt_json$::jsonb;
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


  -- ── Actividad fqt-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antimetabolitos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antimetabolitos) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Capecitabina, DPD, warfarina y función renal';
  v_t2 := $evfqt_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Calcula el aclaramiento de creatinina y revisa el ajuste de la capecitabina en su ficha técnica.</li><li>Explica por qué se recomienda la prueba de DPD antes de iniciar y cómo la gestionarías.</li><li>Analiza la interacción con la warfarina y propone cómo vigilarla.</li><li>Diseña la educación sobre el esquema (días de toma y descanso), los signos de toxicidad y la manipulación en casa.</li><li>Redacta la comunicación al oncólogo.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Ajustar la capecitabina a la función renal.</li><li>Gestionar la prueba de DPD y la interacción con la warfarina.</li><li>Diseñar la educación para la quimioterapia oral.</li></ul>
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
  <tr><td>Función renal y dosis</td><td>25 %</td><td>Calcula ≈37 mL/min (con el factor 0,85 de mujer) y aplica el ajuste de la ficha técnica para ese rango.</td><td>Calcula sin aplicar el ajuste.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>DPD y warfarina</td><td>35 %</td><td>Gestiona la prueba de DPD y propone INR frecuente o alternativa de anticoagulación.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Educación</td><td>30 %</td><td>Educación clara sobre el esquema, la diarrea, el síndrome mano-pie, la fiebre y la manipulación.</td><td>Educación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfqt_html$;
  v_t3 := $evfqt_html$<h2>Caso de estudio</h2>
<p>Doña Teresa tiene 72 años, pesa 60 kg y vive en Pereira (datos simulados). Iniciará capecitabina adyuvante por cáncer de colon. Su creatinina es de 1,3 mg/dL. Toma warfarina por una fibrilación auricular con INR estable y omeprazol. No le han hecho la prueba de DPD. Vive sola y dice que «se toma todas las pastillas juntas para no olvidar».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfqt_html$;
  v_t4 := 'Informe de validación con plan educativo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfqt_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los citotóxicos del caso (ciclofosfamida, ifosfamida, cisplatino, carboplatino, oxaliplatino, metotrexato, 5-fluorouracilo, capecitabina, citarabina, doxorrubicina, irinotecán, paclitaxel y vincristina) y de sus antídotos y medicamentos de soporte; recomendaciones de la EMA sobre la prueba de DPD; alertas de la OMS y del ISMP sobre la vincristina; capítulo 800 de la USP; Resolución 444 de 2008; criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfqt_html$;
  v_t7 := NULL;
  v_j1 := $evfqt_json$["Función renal y dosis.","DPD.","Warfarina.","Educación.","Comunicación."]$evfqt_json$::jsonb;
  v_j2 := $evfqt_json${"version":1,"total":100,"criteria":[{"id":"funcion-renal-y-dosis","name":"Función renal y dosis","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Calcula ≈37 mL/min (con el factor 0,85 de mujer) y aplica el ajuste de la ficha técnica para ese rango."},{"level":3,"label":"Logrado","description":"Calcula sin aplicar el ajuste."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"dpd-y-warfarina","name":"DPD y warfarina","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Gestiona la prueba de DPD y propone INR frecuente o alternativa de anticoagulación."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"educacion","name":"Educación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Educación clara sobre el esquema, la diarrea, el síndrome mano-pie, la fiebre y la manipulación."},{"level":3,"label":"Logrado","description":"Educación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfqt_json$::jsonb;
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


  -- ── Actividad fqt-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Cálculo de dosis, validación y preparación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Cálculo de dosis, validación y preparación) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Validación de FOLFOX con pérdida de peso y neuropatía';
  v_t2 := $evfqt_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Recalcula la superficie corporal con el peso actual (Mosteller) y compárala con la del ciclo 1.</li><li>Verifica los criterios hematológicos para administrar el ciclo.</li><li>Gradúa la neuropatía con CTCAE y analiza qué implica para el oxaliplatino.</li><li>Revisa la función renal y su relevancia para el esquema.</li><li>Verifica la educación y la seguridad de la bomba elastomérica en casa (derrames, desconexión, residuos).</li><li>Redacta la comunicación al oncólogo con tus hallazgos.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Recalcular la superficie corporal y validar las dosis.</li><li>Evaluar la neuropatía por oxaliplatino y la función renal.</li><li>Verificar la seguridad de la infusión domiciliaria.</li></ul>
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
  <tr><td>Superficie corporal</td><td>25 %</td><td>Recalcula ≈1,83 m² (antes ≈1,96 m²) y propone ajustar las dosis.</td><td>Recalcula con error menor.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Neuropatía y laboratorio</td><td>35 %</td><td>Gradúa la neuropatía como grado 3 si limita el autocuidado, la comunica para ajuste o suspensión del oxaliplatino y verifica criterios hematológicos y renales.</td><td>Análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Infusión domiciliaria</td><td>20 %</td><td>Educación sobre la bomba, derrames, residuos y signos de alarma.</td><td>Educación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación</td><td>10 %</td><td>Comunicación clara al oncólogo.</td><td>Comunicación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfqt_html$;
  v_t3 := $evfqt_html$<h2>Caso de estudio</h2>
<p>Don Jairo tiene 64 años, vive en Medellín y recibe FOLFOX por cáncer de colon metastásico (datos simulados). En el ciclo 1 pesaba 80 kg (talla 172 cm); hoy pesa 70 kg. Su creatinina es de 1,4 mg/dL. Refiere hormigueo en manos y pies que le dificulta abotonarse la camisa. Neutrófilos 1.800/µL, plaquetas 140.000/µL. Recibe la infusión de 5-FU de 46 horas con bomba elastomérica en casa.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfqt_html$;
  v_t4 := 'Informe de validación con comunicación al oncólogo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfqt_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los citotóxicos del caso (ciclofosfamida, ifosfamida, cisplatino, carboplatino, oxaliplatino, metotrexato, 5-fluorouracilo, capecitabina, citarabina, doxorrubicina, irinotecán, paclitaxel y vincristina) y de sus antídotos y medicamentos de soporte; recomendaciones de la EMA sobre la prueba de DPD; alertas de la OMS y del ISMP sobre la vincristina; capítulo 800 de la USP; Resolución 444 de 2008; criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfqt_html$;
  v_t7 := NULL;
  v_j1 := $evfqt_json$["Superficie corporal.","Criterios hematológicos.","Neuropatía.","Función renal.","Infusión domiciliaria."]$evfqt_json$::jsonb;
  v_j2 := $evfqt_json${"version":1,"total":100,"criteria":[{"id":"superficie-corporal","name":"Superficie corporal","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Recalcula ≈1,83 m² (antes ≈1,96 m²) y propone ajustar las dosis."},{"level":3,"label":"Logrado","description":"Recalcula con error menor."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"neuropatia-y-laboratorio","name":"Neuropatía y laboratorio","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Gradúa la neuropatía como grado 3 si limita el autocuidado, la comunica para ajuste o suspensión del oxaliplatino y verifica criterios hematológicos y renales."},{"level":3,"label":"Logrado","description":"Análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"infusion-domiciliaria","name":"Infusión domiciliaria","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Educación sobre la bomba, derrames, residuos y signos de alarma."},{"level":3,"label":"Logrado","description":"Educación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion","name":"Comunicación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Comunicación clara al oncólogo."},{"level":3,"label":"Logrado","description":"Comunicación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfqt_json$::jsonb;
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


  -- ── Actividad fqt-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: protocolos de alquilantes, antimetabolitos y vincristina';
  v_t2 := $evfqt_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y prioriza los hallazgos por su gravedad.</li><li>Fase 1: diseña el protocolo de mesna e hidratación para la ifosfamida y de prevención de nefrotoxicidad para el cisplatino.</li><li>Fase 2: diseña el protocolo de metotrexato a dosis altas (hidratación, alcalinización, niveles, folinato, interacciones) y la gestión de la prueba de DPD.</li><li>Fase 3: diseña las barreras para la vincristina y el registro de dosis acumuladas de antraciclinas.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (alquilantes y platinos).</strong> Protocolos de prevención para ifosfamida y cisplatino.</li>
  <li><strong>Fase 2 · Unidad 2 (antimetabolitos).</strong> Protocolo de metotrexato a dosis altas y prueba de DPD.</li>
  <li><strong>Fase 3 · Unidad 3 (productos naturales).</strong> Cardiotoxicidad de antraciclinas y barreras para la vincristina.</li>
  <li><strong>Fase 4 · Unidad 4 (cálculo y validación).</strong> Lista de verificación para validar órdenes y preparar mezclas.</li>
  <li><strong>Fase 5 · Unidad 5 (seguridad).</strong> Extravasación, lisis tumoral, quimioterapia oral e indicadores.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar protocolos de prevención de toxicidades por citotóxicos.</li><li>Diseñar barreras para errores de alto riesgo.</li></ul>
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
  <tr><td>Alquilantes y platinos</td><td>25 %</td><td>Protocolos completos de mesna e hidratación y de prevención con cisplatino.</td><td>Protocolos incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Metotrexato y DPD</td><td>30 %</td><td>Protocolo de niveles y rescate con interacciones a evitar, y gestión de la DPD.</td><td>Protocolo parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vincristina y antraciclinas</td><td>35 %</td><td>Minibolsa, rótulo, separación de intratecales y registro de dosis acumulada con fracción de eyección.</td><td>Barreras parciales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfqt_html$;
  v_t3 := $evfqt_html$<h2>Caso de estudio</h2>
<p>Eres el QF responsable de la unidad de quimioterapia y la central de mezclas de una IPS oncológica en Cali (datos simulados). En una auditoría se encontró: mesna omitida en dos órdenes de ifosfamida; metotrexato a dosis altas sin protocolo de niveles; vincristina enviada junto con intratecales; dosis calculadas con pesos de meses atrás; un kit de extravasación incompleto; y pacientes con quimioterapia oral sin educación. La dirección te pide un programa de seguridad en quimioterapia. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfqt_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfqt_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los citotóxicos del caso (ciclofosfamida, ifosfamida, cisplatino, carboplatino, oxaliplatino, metotrexato, 5-fluorouracilo, capecitabina, citarabina, doxorrubicina, irinotecán, paclitaxel y vincristina) y de sus antídotos y medicamentos de soporte; recomendaciones de la EMA sobre la prueba de DPD; alertas de la OMS y del ISMP sobre la vincristina; capítulo 800 de la USP; Resolución 444 de 2008; criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfqt_html$;
  v_t7 := NULL;
  v_j1 := $evfqt_json$["Priorización.","Alquilantes y platinos.","Metotrexato y DPD.","Vincristina y antraciclinas."]$evfqt_json$::jsonb;
  v_j2 := $evfqt_json${"version":1,"total":100,"criteria":[{"id":"alquilantes-y-platinos","name":"Alquilantes y platinos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Protocolos completos de mesna e hidratación y de prevención con cisplatino."},{"level":3,"label":"Logrado","description":"Protocolos incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"metotrexato-y-dpd","name":"Metotrexato y DPD","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Protocolo de niveles y rescate con interacciones a evitar, y gestión de la DPD."},{"level":3,"label":"Logrado","description":"Protocolo parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vincristina-y-antraciclinas","name":"Vincristina y antraciclinas","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Minibolsa, rótulo, separación de intratecales y registro de dosis acumulada con fracción de eyección."},{"level":3,"label":"Logrado","description":"Barreras parciales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfqt_json$::jsonb;
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


  -- ── Actividad fqt-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Seguridad: extravasación, toxicidades, interacciones y quimioterapia oral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Seguridad: extravasación, toxicidades, interacciones y quimioterapia oral) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: programa integral de seguridad en quimioterapia';
  v_t2 := $evfqt_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: diseña la lista de verificación de validación (peso actual, superficie corporal, AUC, laboratorio, dosis acumuladas) y de preparación segura.</li><li>Fase 5: diseña el contenido del kit de extravasación, el protocolo de lisis tumoral y el programa de quimioterapia oral.</li><li>Fase 5: define indicadores del programa y su farmacovigilancia.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el programa en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (alquilantes y platinos).</strong> Protocolos de prevención para ifosfamida y cisplatino.</li>
  <li><strong>Fase 2 · Unidad 2 (antimetabolitos).</strong> Protocolo de metotrexato a dosis altas y prueba de DPD.</li>
  <li><strong>Fase 3 · Unidad 3 (productos naturales).</strong> Cardiotoxicidad de antraciclinas y barreras para la vincristina.</li>
  <li><strong>Fase 4 · Unidad 4 (cálculo y validación).</strong> Lista de verificación para validar órdenes y preparar mezclas.</li>
  <li><strong>Fase 5 · Unidad 5 (seguridad).</strong> Extravasación, lisis tumoral, quimioterapia oral e indicadores.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar la lista de verificación de validación y preparación.</li><li>Integrar la seguridad del paciente con quimioterapia oral e indicadores.</li></ul>
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
  <tr><td>Validación y preparación</td><td>25 %</td><td>Lista completa y preparación en cabina de seguridad biológica con sistemas cerrados.</td><td>Lista incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Extravasación, lisis y oral</td><td>25 %</td><td>Kit con antídotos, protocolo de lisis con rasburicasa y G6PD, programa oral con educación.</td><td>Componentes parciales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores y farmacovigilancia</td><td>25 %</td><td>Indicadores medibles (errores interceptados, extravasaciones, adherencia oral) y reporte.</td><td>Indicadores generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfqt_html$;
  v_t3 := $evfqt_html$<h2>Caso de estudio</h2>
<p>Eres el QF responsable de la unidad de quimioterapia y la central de mezclas de una IPS oncológica en Cali (datos simulados). En una auditoría se encontró: mesna omitida en dos órdenes de ifosfamida; metotrexato a dosis altas sin protocolo de niveles; vincristina enviada junto con intratecales; dosis calculadas con pesos de meses atrás; un kit de extravasación incompleto; y pacientes con quimioterapia oral sin educación. La dirección te pide un programa de seguridad en quimioterapia. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el programa que presentarás a la dirección.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfqt_html$;
  v_t4 := 'Programa integral con indicadores y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfqt_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los citotóxicos del caso (ciclofosfamida, ifosfamida, cisplatino, carboplatino, oxaliplatino, metotrexato, 5-fluorouracilo, capecitabina, citarabina, doxorrubicina, irinotecán, paclitaxel y vincristina) y de sus antídotos y medicamentos de soporte; recomendaciones de la EMA sobre la prueba de DPD; alertas de la OMS y del ISMP sobre la vincristina; capítulo 800 de la USP; Resolución 444 de 2008; criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfqt_html$;
  v_t7 := NULL;
  v_j1 := $evfqt_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Validación y preparación.","Extravasación, lisis y oral.","Indicadores y farmacovigilancia.","Resumen ejecutivo."]$evfqt_json$::jsonb;
  v_j2 := $evfqt_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"validacion-y-preparacion","name":"Validación y preparación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Lista completa y preparación en cabina de seguridad biológica con sistemas cerrados."},{"level":3,"label":"Logrado","description":"Lista incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"extravasacion-lisis-y-oral","name":"Extravasación, lisis y oral","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Kit con antídotos, protocolo de lisis con rasburicasa y G6PD, programa oral con educación."},{"level":3,"label":"Logrado","description":"Componentes parciales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores-y-farmacovigilancia","name":"Indicadores y farmacovigilancia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Indicadores medibles (errores interceptados, extravasaciones, adherencia oral) y reporte."},{"level":3,"label":"Logrado","description":"Indicadores generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfqt_json$::jsonb;
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


  -- ── Foro fqt-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con la quimioterapia';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfqt_html$<h2>Para empezar</h2>
<p>Piensa en una situación con un paciente que recibía quimioterapia (o en tu trabajo en una central de mezclas) que te haya generado dudas y cuéntala en tres o cuatro líneas, sin nombres ni datos que identifiquen a nadie.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfqt_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre la quimioterapia te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfqt_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfqt_html$;
  v_t6 := $evfqt_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfqt_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has validado o preparado órdenes de quimioterapia?', '¿Qué toxicidad te parece más difícil de prevenir?']::text[];
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


  -- ── Foro fqt-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la quimioterapia citotóxica y agentes alquilantes' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la quimioterapia citotóxica y agentes alquilantes) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Cisplatino ambulatorio: ¿quién vigila el riñón?';
  v_t2 := 'Argumentar qué controles requiere el cisplatino y qué papel tiene el QF en el seguimiento entre ciclos.';
  v_t3 := $evfqt_html$<h2>Caso del foro</h2>
<p>Una unidad de quimioterapia administra cisplatino en forma ambulatoria (datos simulados). Los laboratorios llegan a veces el mismo día del ciclo, nadie revisa la audiometría y varios pacientes toman AINE comprados en la droguería. Un paciente desarrolló una lesión renal aguda.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfqt_html$;
  v_t4 := '¿Qué protocolo de seguimiento propondrías y qué responsabilidades tendría el servicio farmacéutico?';
  v_t5 := $evfqt_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación que sustenta tu protocolo. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfqt_html$;
  v_t6 := $evfqt_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta tu protocolo.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfqt_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué parámetros deben revisarse antes de cada ciclo?', '¿Qué medicamentos de uso común aumentan la nefrotoxicidad?', '¿Cómo se documenta y se reporta una lesión renal por cisplatino?']::text[];
  v_j1 := $evfqt_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta tu protocolo."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfqt_json$::jsonb;
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


  -- ── Foro fqt-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antimetabolitos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antimetabolitos) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Prueba de DPD antes de las fluoropirimidinas';
  v_t2 := 'Argumentar si la prueba de DPD debe hacerse antes de iniciar 5-fluorouracilo o capecitabina.';
  v_t3 := $evfqt_html$<h2>Caso del foro</h2>
<p>Una unidad de oncología debate si pedir la prueba de DPD a todos los pacientes que inician fluoropirimidinas (datos simulados). En el último año tuvieron dos casos de toxicidad grave en el primer ciclo. La EPS dice que la prueba «no está cubierta» y algunos oncólogos temen retrasar el inicio.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfqt_html$;
  v_t4 := '¿Qué postura defenderías y cómo resolverías las barreras de acceso y de tiempo?';
  v_t5 := $evfqt_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación regulatoria o el dato que sustenta tu postura. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfqt_html$;
  v_t6 := $evfqt_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación regulatoria o el dato que sustenta tu postura.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfqt_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué recomendó la EMA sobre la DPD?', '¿Qué se hace si el paciente tiene un déficit parcial?', '¿Qué haría el servicio farmacéutico mientras llega el resultado?']::text[];
  v_j1 := $evfqt_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación regulatoria o el dato que sustenta tu postura."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfqt_json$::jsonb;
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


  -- ── Foro fqt-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Antraciclinas, inhibidores de topoisomerasa y antimicrotúbulos) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Vincristina intratecal: el error que no debe repetirse';
  v_t2 := 'Argumentar qué barreras previenen la administración intratecal accidental de vincristina.';
  v_t3 := $evfqt_html$<h2>Caso del foro</h2>
<p>Un hospital pediátrico revisa sus procesos tras un casi error (datos simulados): una jeringa de vincristina llegó a la sala de procedimientos junto con las de metotrexato y citarabina intratecales. Alguien lo detectó a tiempo. El jefe de servicio dice que «fue un despiste y no volverá a pasar».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfqt_html$;
  v_t4 := '¿Por qué «tener más cuidado» no basta y qué barreras propondrías?';
  v_t5 := $evfqt_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la alerta o la recomendación que sustenta cada barrera. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfqt_html$;
  v_t6 := $evfqt_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la alerta o la recomendación que sustenta cada barrera.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfqt_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué la dilución en minibolsa es una barrera fuerte?', '¿Cómo se separan en tiempo y lugar los intratecales?', '¿Cómo se gestiona y se reporta un casi error?']::text[];
  v_j1 := $evfqt_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la alerta o la recomendación que sustenta cada barrera."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfqt_json$::jsonb;
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


  -- ── Foro fqt-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Cálculo de dosis, validación y preparación' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Cálculo de dosis, validación y preparación) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · ¿Redondear las dosis de citotóxicos?';
  v_t2 := 'Argumentar cuándo es aceptable redondear dosis o usar bandas de dosis y cómo hacerlo con seguridad.';
  v_t3 := $evfqt_html$<h2>Caso del foro</h2>
<p>Una central de mezclas propone redondear las dosis de citotóxicos al vial más cercano para reducir desperdicios (datos simulados). Un oncólogo acepta redondear hasta un 5 %; otro exige la dosis exacta siempre. En la misma semana, un paciente obeso recibió una dosis «topada» a 2 m² sin indicación del protocolo.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfqt_html$;
  v_t4 := '¿Qué política propondrías sobre el redondeo y el uso del peso real en obesidad?';
  v_t5 := $evfqt_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación o el protocolo que sustenta tu política. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfqt_html$;
  v_t6 := $evfqt_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el protocolo que sustenta tu política.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfqt_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué margen de redondeo suele considerarse aceptable?', '¿Qué recomiendan las guías sobre el peso real en pacientes obesos con intención curativa?', '¿Cómo se documenta una decisión de redondeo?']::text[];
  v_j1 := $evfqt_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el protocolo que sustenta tu política."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfqt_json$::jsonb;
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


  -- ── Foro fqt-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Seguridad: extravasación, toxicidades, interacciones y quimioterapia oral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Seguridad: extravasación, toxicidades, interacciones y quimioterapia oral) en Quimioterapia Antineoplásica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Quimioterapia oral en casa';
  v_t2 := 'Argumentar qué apoyo necesita un paciente que recibe quimioterapia oral.';
  v_t3 := $evfqt_html$<h2>Caso del foro</h2>
<p>Un programa revisa a 40 pacientes con quimioterapia oral (datos simulados): algunos no entienden los días de descanso, otros parten las tabletas para «tomar menos», una cuidadora embarazada manipula los medicamentos y varios guardan sobrantes en la cocina.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfqt_html$;
  v_t4 := '¿Qué intervenciones propondrías para que la quimioterapia oral sea segura y eficaz en casa?';
  v_t5 := $evfqt_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación que sustenta cada intervención. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfqt_html$;
  v_t6 := $evfqt_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada intervención.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfqt_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué errores de esquema son más frecuentes?', '¿Qué precauciones de manipulación deben conocer el paciente y el cuidador?', '¿Cómo se hace el seguimiento a distancia?']::text[];
  v_j1 := $evfqt_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada intervención."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfqt_json$::jsonb;
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


  RAISE NOTICE 'Quimioterapia Antineoplásica: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfqt$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Inmunoterapia Oncológica
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfinm$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Inmunoterapia Oncológica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos de inmunología tumoral', 'Unidad 2. Inhibidores de puntos de control inmunitario', 'Unidad 3. Eventos adversos inmunorrelacionados (irAEs)', 'Unidad 4. Terapias celulares, biespecíficos, vacunas y patrones de respuesta', 'Unidad 5. Rol del químico farmacéutico y acceso en Colombia']::text[])) < 5 THEN
    RAISE NOTICE 'Inmunoterapia Oncológica: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfinm_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfinm_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz finm-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de inmunología tumoral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de inmunología tumoral) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos de inmunología tumoral';
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


    v_t3 := '¿Por qué el bloqueo de PD-1 o PD-L1 puede tener efecto antitumoral?';
    v_t4 := 'PD-1 (en los linfocitos T) y su ligando PD-L1 (que el tumor puede expresar) forman un punto de control que frena la respuesta inmune y mantiene la tolerancia periférica. Bloquearlos reactiva linfocitos T capaces de atacar al tumor; CTLA-4 actúa en una fase más temprana de la activación.';
    v_j1 := $evfinm_json${"external_id":"finm-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Fisiología de PD-1/PD-L1 y CTLA-4","outcome":"Fisiología de PD-1/PD-L1 y CTLA-4","source":"Fichas técnicas de nivolumab y pembrolizumab."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque destruye de forma directa las células tumorales al unirse al ADN de su núcleo.', FALSE, 'Los inhibidores de puntos de control no actúan sobre el ADN tumoral.', 0),
      (v_pregunta, 'Porque libera un freno de los linfocitos T y les permite reconocer y atacar al tumor.', TRUE, 'Correcto. La vía PD-1/PD-L1 mantiene la tolerancia periférica.', 1),
      (v_pregunta, 'Porque bloquea la división de las células tumorales en la fase S del ciclo celular.', FALSE, 'Ese es el mecanismo de algunos citotóxicos.', 2),
      (v_pregunta, 'Porque aumenta la producción de anticuerpos contra el tumor en el bazo y la médula ósea.', FALSE, 'Su efecto principal se ejerce sobre los linfocitos T.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En una junta, se comparan dos tumores: uno con abundantes linfocitos T infiltrantes y otro casi sin células inmunes. ¿Cuál tiene más probabilidad de responder a un inhibidor de puntos de control?';
    v_t4 := 'Los tumores «calientes» o inflamados, con linfocitos T infiltrantes, suelen responder mejor a los inhibidores de puntos de control que los «fríos», con poca infiltración o con un microambiente inmunosupresor (Treg, células supresoras mieloides, macrófagos M2, TGF-beta).';
    v_j1 := $evfinm_json${"external_id":"finm-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Microambiente tumoral: tumores calientes y fríos","outcome":"Microambiente tumoral: tumores calientes y fríos","source":"Fundamentos de inmunología tumoral."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El tumor sin células inmunes, porque no tiene ninguna defensa que el fármaco deba superar.', FALSE, 'Sin linfocitos que reactivar, la respuesta suele ser menor.', 0),
      (v_pregunta, 'Ambos tienen la misma probabilidad, porque la respuesta depende solo de la dosis del medicamento.', FALSE, 'La biología tumoral influye mucho en la respuesta.', 1),
      (v_pregunta, 'Ninguno, porque los inhibidores de puntos de control solo funcionan en tumores de la sangre.', FALSE, 'Se usan en muchos tumores sólidos.', 2),
      (v_pregunta, 'El tumor «caliente», con linfocitos infiltrantes que el fármaco puede reactivar.', TRUE, 'Correcto. Los tumores «fríos» suelen responder menos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un tumor pierde la expresión de moléculas HLA de clase I. ¿Qué implicación tiene para la inmunoterapia?';
    v_t4 := 'La inmunoedición pasa por eliminación, equilibrio y escape. Entre los mecanismos de escape están la pérdida de HLA (que impide presentar antígenos a los linfocitos T), la expresión de PD-L1 y las citocinas supresoras. La pérdida de HLA se asocia a resistencia a los inhibidores de puntos de control.';
    v_j1 := $evfinm_json${"external_id":"finm-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Inmunoedición y mecanismos de evasión inmune","outcome":"Inmunoedición y mecanismos de evasión inmune","source":"Fundamentos de inmunología tumoral."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Los linfocitos T no pueden reconocer los antígenos tumorales, lo que favorece la resistencia.', TRUE, 'Correcto. Es un mecanismo de escape inmune.', 0),
      (v_pregunta, 'El tumor se vuelve más sensible, porque sin HLA las células tumorales mueren solas.', FALSE, 'La pérdida de HLA favorece el escape, no la muerte.', 1),
      (v_pregunta, 'No cambia nada, porque los linfocitos T reconocen al tumor sin necesidad de HLA.', FALSE, 'El reconocimiento por linfocitos T depende de la presentación por HLA.', 2),
      (v_pregunta, 'El paciente necesita una dosis mayor del inhibidor de puntos de control para compensar la falta de HLA.', FALSE, 'Subir la dosis no corrige la falta de presentación de antígenos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un familiar opina que «si mi papá no respondió a la inmunoterapia fue porque le pusieron poca dosis». ¿Cuál es la mejor respuesta del QF?';
    v_t4 := 'La respuesta a los inhibidores de puntos de control depende de la biología tumoral (infiltración por linfocitos, carga mutacional, inestabilidad de microsatélites, PD-L1, mecanismos de escape) y del sistema inmune del paciente. Las dosis están establecidas en la ficha técnica; subirlas no compensa la resistencia biológica.';
    v_j1 := $evfinm_json${"external_id":"finm-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: ¿por qué responde un tumor y otro no?","outcome":"Caso: ¿por qué responde un tumor y otro no?","source":"Fundamentos de inmunología tumoral; fichas técnicas."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que tiene razón: la falta de respuesta casi siempre se debe a una dosis insuficiente.', FALSE, 'La respuesta depende sobre todo de la biología del tumor.', 0),
      (v_pregunta, 'Que se puede duplicar la dosis en el siguiente ciclo para asegurar que funcione.', FALSE, 'Duplicar la dosis no está indicado.', 1),
      (v_pregunta, 'Que la falta de respuesta suele depender de la biología del tumor y del sistema inmune, no solo de la dosis.', TRUE, 'Correcto. Las dosis están definidas en la ficha técnica.', 2),
      (v_pregunta, 'Que la inmunoterapia nunca funciona en personas mayores de 60 años.', FALSE, 'La edad no excluye la respuesta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz finm-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Inhibidores de puntos de control inmunitario' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Inhibidores de puntos de control inmunitario) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Inhibidores de puntos de control inmunitario';
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


    v_t3 := '¿Cuál de estos medicamentos es un anticuerpo anti-CTLA-4?';
    v_t4 := 'Anti-PD-1: nivolumab, pembrolizumab. Anti-PD-L1: atezolizumab, durvalumab, avelumab. Anti-CTLA-4: ipilimumab, tremelimumab. La combinación anti-PD-1 + anti-CTLA-4 aumenta la eficacia en algunos tumores, pero también los eventos inmunorrelacionados.';
    v_j1 := $evfinm_json${"external_id":"finm-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Anti-PD-1, anti-PD-L1 y anti-CTLA-4: nivolumab, pembrolizumab, atezolizumab, durvalumab e ipilimumab","outcome":"Anti-PD-1, anti-PD-L1 y anti-CTLA-4: nivolumab, pembrolizumab, atezolizumab, durvalumab e ipilimumab","source":"Fichas técnicas de nivolumab, atezolizumab, pembrolizumab e ipilimumab."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El nivolumab, que bloquea el receptor CTLA-4 de los linfocitos T activados en el ganglio.', FALSE, 'El nivolumab es un anti-PD-1.', 0),
      (v_pregunta, 'El atezolizumab, que se une a CTLA-4 en las células presentadoras de antígeno.', FALSE, 'El atezolizumab es un anti-PD-L1.', 1),
      (v_pregunta, 'El ipilimumab.', TRUE, 'Correcto. Se combina con nivolumab en algunos tumores.', 2),
      (v_pregunta, 'El pembrolizumab, que es el único anti-CTLA-4 aprobado para el cáncer de pulmón.', FALSE, 'El pembrolizumab es un anti-PD-1.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente que inicia pembrolizumab toma prednisona 20 mg al día por una EPOC desde hace meses. ¿Qué hace el QF en la validación?';
    v_t4 := 'Los corticoides sistémicos en dosis altas (por ejemplo, equivalentes a prednisona de 10 mg o más) antes de iniciar un inhibidor de puntos de control pueden reducir su eficacia; se recomienda evitarlos salvo indicación clara. Una vez iniciada la inmunoterapia, se usan para tratar los eventos inmunorrelacionados. No se suspenden de forma brusca.';
    v_j1 := $evfinm_json${"external_id":"finm-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Farmacocinética, posología, interacciones y poblaciones especiales","outcome":"Farmacocinética, posología, interacciones y poblaciones especiales","source":"Fichas técnicas de los inhibidores de puntos de control; guías ESMO."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Informa al oncólogo: los corticoides basales en dosis altas pueden reducir la eficacia; se revisa si son necesarios.', TRUE, 'Correcto. Se decide con el equipo tratante.', 0),
      (v_pregunta, 'Suspende la prednisona de golpe para no interferir con la inmunoterapia el día del ciclo.', FALSE, 'La suspensión brusca expone a insuficiencia suprarrenal.', 1),
      (v_pregunta, 'Aumenta la prednisona al doble para prevenir cualquier evento inmunorrelacionado futuro.', FALSE, 'La profilaxis con corticoides no está indicada.', 2),
      (v_pregunta, 'No hace nada, porque los corticoides no tienen ninguna relación con la inmunoterapia.', FALSE, 'Pueden reducir la respuesta si se usan antes de iniciar.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con cáncer colorrectal metastásico tiene un tumor con inestabilidad de microsatélites alta (MSI-H/dMMR). ¿Qué análisis es correcto?';
    v_t4 := 'La inestabilidad de microsatélites alta o la deficiencia de reparación de errores de emparejamiento (MSI-H/dMMR) produce muchas mutaciones y neoantígenos; predice respuesta a los anti-PD-1 de forma agnóstica de tumor, incluido el colorrectal metastásico. La carga mutacional alta es otro biomarcador agnóstico.';
    v_j1 := $evfinm_json${"external_id":"finm-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"MSI-H/dMMR, TMB e indicaciones principales por tumor","outcome":"MSI-H/dMMR, TMB e indicaciones principales por tumor","source":"Fichas técnicas de pembrolizumab y nivolumab."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El MSI-H indica resistencia a la inmunoterapia y obliga a usar solo quimioterapia clásica.', FALSE, 'Ocurre lo contrario.', 0),
      (v_pregunta, 'El MSI-H solo tiene valor en el cáncer de endometrio y no en el colorrectal.', FALSE, 'Es relevante en varios tumores.', 1),
      (v_pregunta, 'El MSI-H indica que el paciente tiene una enfermedad hereditaria y no puede recibir anticuerpos.', FALSE, 'El estado de MSI no contraindica los anticuerpos.', 2),
      (v_pregunta, 'Es candidato a un anti-PD-1: el MSI-H/dMMR predice respuesta, con independencia del órgano.', TRUE, 'Correcto. Es un biomarcador agnóstico de tumor.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con cáncer de pulmón y PD-L1 del 70 % dice que «con ese resultado la curación está garantizada». ¿Cuál es la mejor respuesta del QF?';
    v_t4 := 'El PD-L1 por inmunohistoquímica (TPS, CPS) orienta la elección entre monoterapia e inmunoquimioterapia: en cáncer de pulmón sin alteraciones dirigibles, un TPS de 50 % o más permite la monoterapia con anti-PD-1 en primera línea. Es un biomarcador imperfecto: aumenta la probabilidad de respuesta, pero no la garantiza.';
    v_j1 := $evfinm_json${"external_id":"finm-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"PD-L1: técnicas, puntuaciones (TPS, CPS) y limitaciones","outcome":"PD-L1: técnicas, puntuaciones (TPS, CPS) y limitaciones","source":"Ficha técnica de pembrolizumab."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que tiene razón: un PD-L1 mayor de 50 % garantiza la respuesta completa al tratamiento.', FALSE, 'Ningún biomarcador garantiza la respuesta.', 0),
      (v_pregunta, 'Que un PD-L1 alto aumenta la probabilidad de responder, pero no la garantiza; se evalúa la respuesta en el tiempo.', TRUE, 'Correcto. El PD-L1 es un biomarcador imperfecto.', 1),
      (v_pregunta, 'Que el PD-L1 no tiene ninguna utilidad y no debería haberse medido en su caso.', FALSE, 'Orienta la elección del tratamiento.', 2),
      (v_pregunta, 'Que con PD-L1 alto debe recibir siempre quimioterapia y nunca inmunoterapia.', FALSE, 'Con PD-L1 alto la monoterapia con anti-PD-1 es una opción.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz finm-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Eventos adversos inmunorrelacionados (irAEs)' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Eventos adversos inmunorrelacionados (irAEs)) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Eventos adversos inmunorrelacionados (irAEs)';
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


    v_t3 := '¿Cuál es la conducta general ante un evento inmunorrelacionado de grado 2?';
    v_t4 := 'Regla general de las guías: grado 1, continuar con vigilancia; grado 2, suspender temporalmente y considerar corticoides; grado 3-4, suspender y dar corticoides sistémicos a dosis altas, con valoración de inmunosupresores de segunda línea si no hay respuesta. Hay excepciones por órgano.';
    v_j1 := $evfinm_json${"external_id":"finm-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Graduación CTCAE y principios generales de manejo","outcome":"Graduación CTCAE y principios generales de manejo","source":"Guías ESMO 2022 y ASCO 2021."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Suspender temporalmente la inmunoterapia y considerar corticoides, con vigilancia estrecha.', TRUE, 'Correcto. El grado 1 suele permitir continuar con vigilancia.', 0),
      (v_pregunta, 'Continuar la inmunoterapia sin cambios, porque el grado 2 es siempre un efecto sin importancia.', FALSE, 'El grado 2 suele requerir suspender temporalmente.', 1),
      (v_pregunta, 'Suspender para siempre la inmunoterapia y usar quimioterapia en todos los casos.', FALSE, 'La suspensión definitiva se reserva para casos graves.', 2),
      (v_pregunta, 'Duplicar la dosis de la inmunoterapia para acelerar la respuesta antes de que empeore.', FALSE, 'Aumentar la dosis empeoraría el evento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente recibirá prednisona 1 mg/kg por varias semanas por un evento inmunorrelacionado. ¿Qué medidas acompañantes revisa el QF?';
    v_t4 := 'Los corticoides para los eventos inmunorrelacionados se descienden de forma gradual, en general en 4 a 6 semanas. Con dosis altas y prolongadas se considera la profilaxis contra Pneumocystis jirovecii, la vigilancia de la glucosa y otras medidas según el riesgo. Si no hay respuesta, se usan rescates (infliximab, vedolizumab, micofenolato).';
    v_j1 := $evfinm_json${"external_id":"finm-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Corticoides e inmunosupresores de segunda línea","outcome":"Corticoides e inmunosupresores de segunda línea","source":"Guías ESMO 2022 y ASCO 2021."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Ninguna, porque los corticoides a dosis altas por pocas semanas no tienen ningún riesgo.', FALSE, 'Tienen riesgos que se previenen.', 0),
      (v_pregunta, 'Suspender la prednisona a los tres días aunque no haya ninguna mejoría, para evitar sus efectos adversos.', FALSE, 'El descenso es gradual y depende de la respuesta.', 1),
      (v_pregunta, 'Profilaxis contra Pneumocystis, vigilancia de la glucosa y un descenso gradual en 4 a 6 semanas.', TRUE, 'Correcto. Según la dosis y la duración.', 2),
      (v_pregunta, 'Aumentar la inmunoterapia mientras dure la prednisona para que no pierda su efecto.', FALSE, 'La inmunoterapia se suspende durante el evento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con nivolumab llega con fatiga intensa, presión baja, sodio de 128 mmol/L y cortisol matutino muy bajo. ¿Qué análisis es correcto?';
    v_t4 := 'Las endocrinopatías inmunorrelacionadas (tiroiditis, hipofisitis, insuficiencia suprarrenal, diabetes tipo 1) están entre los eventos más frecuentes y suelen ser permanentes. La insuficiencia suprarrenal requiere hidrocortisona y educación en dosis de estrés; con reemplazo hormonal, la inmunoterapia a menudo puede continuar.';
    v_j1 := $evfinm_json${"external_id":"finm-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Endocrinopatías y monitorización de tiroides, glucemia y cortisol","outcome":"Endocrinopatías y monitorización de tiroides, glucemia y cortisol","source":"Guías ESMO 2022 y ASCO 2021."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una deshidratación simple que se corrige con suero y no tiene relación con la inmunoterapia.', FALSE, 'Los datos orientan a una endocrinopatía.', 0),
      (v_pregunta, 'Puede ser una insuficiencia suprarrenal o una hipofisitis inmunorrelacionada; requiere hidrocortisona y suele ser permanente.', TRUE, 'Correcto. Con reemplazo, la inmunoterapia a menudo puede continuar.', 1),
      (v_pregunta, 'Es una progresión del tumor al cerebro y debe suspenderse cualquier corticoide.', FALSE, 'El cuadro es endocrino y requiere corticoide de reemplazo.', 2),
      (v_pregunta, 'Es un efecto esperado de la fatiga por el cáncer que no requiere ningún estudio adicional.', FALSE, 'Hay alteraciones de laboratorio que exigen estudio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con nivolumab e ipilimumab tiene 8 deposiciones al día por encima de su basal, dolor abdominal y sangre en las heces. Alguien propone loperamida y seguir con la inmunoterapia. ¿Cuál es la mejor valoración?';
    v_t4 := 'Un aumento de 7 o más deposiciones al día sobre la basal corresponde a colitis de grado 3 según CTCAE. Se suspende la inmunoterapia, se dan corticoides sistémicos a dosis altas y, si no hay respuesta en 48-72 horas, se considera infliximab o vedolizumab. La loperamida puede enmascarar una colitis grave.';
    v_j1 := $evfinm_json${"external_id":"finm-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: colitis grado 3 con nivolumab + ipilimumab","outcome":"Caso: colitis grado 3 con nivolumab + ipilimumab","source":"Criterios CTCAE; guías ESMO 2022 y ASCO 2021."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada, porque la diarrea de la inmunoterapia siempre es leve y responde a la loperamida.', FALSE, 'Este cuadro corresponde a una colitis grave.', 0),
      (v_pregunta, 'Es adecuada si además se agrega un probiótico y se reduce a la mitad la dosis de ipilimumab.', FALSE, 'No corrige la gravedad del evento.', 1),
      (v_pregunta, 'Es inadecuada solo porque la loperamida debe darse por vía intravenosa en estos casos.', FALSE, 'El problema es el manejo, no la vía.', 2),
      (v_pregunta, 'Es inadecuada: es una colitis de grado 3; se suspende la inmunoterapia y se dan corticoides sistémicos a dosis altas.', TRUE, 'Correcto. Si no responde en 48-72 h, se considera infliximab o vedolizumab.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz finm-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Terapias celulares, biespecíficos, vacunas y patrones de respuesta' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Terapias celulares, biespecíficos, vacunas y patrones de respuesta) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Terapias celulares, biespecíficos, vacunas y patrones de respuesta';
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


    v_t3 := '¿Qué medicamento se usa como tratamiento específico del síndrome de liberación de citoquinas tras una terapia CAR-T?';
    v_t4 := 'El síndrome de liberación de citoquinas se gradúa con los criterios ASTCT y se trata con tocilizumab (anti-receptor de IL-6) y corticoides según la gravedad. En la neurotoxicidad (ICANS) se prefieren los corticoides, porque el tocilizumab no la resuelve.';
    v_j1 := $evfinm_json${"external_id":"finm-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Síndrome de liberación de citoquinas e ICANS","outcome":"Síndrome de liberación de citoquinas e ICANS","source":"Fichas técnicas de las terapias CAR-T y del tocilizumab; criterios ASTCT."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La loperamida, que reduce la diarrea producida por las citoquinas liberadas.', FALSE, 'No trata el síndrome de liberación de citoquinas.', 0),
      (v_pregunta, 'El filgrastim, que restaura los neutrófilos destruidos por las citoquinas.', FALSE, 'No es el tratamiento del síndrome.', 1),
      (v_pregunta, 'La naloxona, que bloquea los receptores de las citoquinas en el sistema nervioso.', FALSE, 'No tiene relación con este síndrome.', 2),
      (v_pregunta, 'El tocilizumab, un anticuerpo contra el receptor de la interleucina 6.', TRUE, 'Correcto. En el ICANS se prefieren los corticoides.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Por qué el blinatumomab se inicia con dosis escalonadas y premedicación?';
    v_t4 := 'El blinatumomab es un anticuerpo biespecífico CD19/CD3 que acerca los linfocitos T a las células B malignas. Se administra en infusión intravenosa continua, con escalonamiento de la dosis y premedicación con dexametasona para reducir el riesgo de síndrome de liberación de citoquinas y de neurotoxicidad. Tiene requisitos de preparación específicos.';
    v_j1 := $evfinm_json${"external_id":"finm-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Anticuerpos biespecíficos y engagers de células T: blinatumomab y nuevos agentes","outcome":"Anticuerpos biespecíficos y engagers de células T: blinatumomab y nuevos agentes","source":"Ficha técnica de blinatumomab."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque así se mejora su absorción oral, que es muy baja en la primera semana del tratamiento.', FALSE, 'El blinatumomab es de administración intravenosa.', 0),
      (v_pregunta, 'Para reducir el riesgo de síndrome de liberación de citoquinas y de neurotoxicidad.', TRUE, 'Correcto. Se administra en infusión continua.', 1),
      (v_pregunta, 'Porque la dosis inicial alta destruye los linfocitos T que el medicamento necesita.', FALSE, 'Esa no es la razón del escalonamiento.', 2),
      (v_pregunta, 'Porque el medicamento se inactiva si se administra a la dosis completa desde el primer día.', FALSE, 'La razón es de seguridad, no de estabilidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'A las 8 semanas de iniciar un anti-PD-1, la imagen muestra un aumento de una lesión, pero el paciente está clínicamente mejor. ¿Qué análisis es correcto?';
    v_t4 := 'La inmunoterapia puede producir patrones atípicos: pseudoprogresión (aumento aparente inicial por infiltración inmune, seguido de respuesta) e hiperprogresión. Los criterios iRECIST introducen la progresión no confirmada (iUPD), que se confirma con una nueva imagen en 4 a 8 semanas si el paciente está clínicamente estable.';
    v_j1 := $evfinm_json${"external_id":"finm-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Pseudoprogresión, hiperprogresión y criterios iRECIST","outcome":"Pseudoprogresión, hiperprogresión y criterios iRECIST","source":"Criterios iRECIST."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una progresión segura y el tratamiento debe suspenderse de inmediato sin más estudios.', FALSE, 'Puede tratarse de una pseudoprogresión.', 0),
      (v_pregunta, 'Es un error del equipo de imagen que debe ignorarse por completo en la decisión.', FALSE, 'El hallazgo se analiza, no se ignora.', 1),
      (v_pregunta, 'Puede ser una pseudoprogresión; con iRECIST se confirma con una nueva imagen en 4 a 8 semanas si el paciente está estable.', TRUE, 'Correcto. Se continúa con vigilancia según el oncólogo.', 2),
      (v_pregunta, 'Indica que hay que duplicar la dosis del anti-PD-1 para vencer la resistencia del tumor.', FALSE, 'Subir la dosis no está indicado.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un centro que quiere ofrecer terapia CAR-T no tiene tocilizumab disponible en la institución y planea «pedirlo si se necesita». ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'El proceso CAR-T incluye aféresis, fabricación, linfodepleción (fludarabina y ciclofosfamida) e infusión. Las fichas técnicas exigen que el tocilizumab esté disponible en el centro antes de la infusión, porque el síndrome de liberación de citoquinas suele aparecer en los primeros días y puede ser grave.';
    v_j1 := $evfinm_json${"external_id":"finm-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"CAR-T: estructura, proceso e indicaciones","outcome":"CAR-T: estructura, proceso e indicaciones","source":"Fichas técnicas de las terapias CAR-T."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es inaceptable: el tocilizumab debe estar disponible antes de la infusión, por el riesgo de síndrome de liberación de citoquinas.', TRUE, 'Correcto. Las fichas técnicas lo exigen.', 0),
      (v_pregunta, 'Es aceptable, porque el síndrome de liberación de citoquinas aparece solo meses después de la infusión.', FALSE, 'Suele aparecer en los primeros días.', 1),
      (v_pregunta, 'Es aceptable si el paciente recibe antibióticos profilácticos durante la primera semana.', FALSE, 'Los antibióticos no previenen el síndrome.', 2),
      (v_pregunta, 'Es aceptable si se reemplaza el tocilizumab por paracetamol para la fiebre.', FALSE, 'El paracetamol no trata el síndrome.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz finm-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Rol del químico farmacéutico y acceso en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Rol del químico farmacéutico y acceso en Colombia) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Rol del químico farmacéutico y acceso en Colombia';
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


    v_t3 := '¿Qué precaución es propia de la preparación de los anticuerpos monoclonales inmunoterapéuticos?';
    v_t4 := 'Los inhibidores de puntos de control son proteínas: se preparan en condiciones asépticas, sin agitar (para no desnaturalizarlas), con la dilución y la estabilidad que indica la ficha técnica y con el filtro en línea indicado. El blinatumomab tiene requisitos especiales.';
    v_j1 := $evfinm_json${"external_id":"finm-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Preparación y administración de anticuerpos monoclonales y biespecíficos","outcome":"Preparación y administración de anticuerpos monoclonales y biespecíficos","source":"Fichas técnicas de los inhibidores de puntos de control y del blinatumomab."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Agitar con fuerza el vial para disolver bien la proteína antes de diluirla en la bolsa.', FALSE, 'Agitar puede desnaturalizar la proteína.', 0),
      (v_pregunta, 'Prepararlos con el mismo protocolo de un citotóxico y desechar el sobrante sin dejar ningún registro.', FALSE, 'No se manejan como citotóxicos clásicos.', 1),
      (v_pregunta, 'No agitar, diluir según la ficha técnica y administrar con el filtro en línea que indique.', TRUE, 'Correcto. Se preparan en condiciones asépticas.', 2),
      (v_pregunta, 'Calentar la mezcla a 40 °C para que la proteína actúe más rápido en el paciente.', FALSE, 'El calor daña la proteína.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con pembrolizumab llama porque lleva dos días con diarrea y pregunta si puede tomar loperamida y esperar la cita. ¿Qué le indica el QF?';
    v_t4 := 'La educación al paciente con inmunoterapia incluye la tarjeta de alerta, los signos de alarma (diarrea, tos, dificultad respiratoria, fatiga intensa, alteraciones de la piel) y un contacto 24/7. La diarrea puede ser una colitis inmunorrelacionada; el equipo debe graduarla antes de cualquier manejo.';
    v_j1 := $evfinm_json${"external_id":"finm-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Educación al paciente y farmacovigilancia de irAEs","outcome":"Educación al paciente y farmacovigilancia de irAEs","source":"Guías ESMO 2022 y ASCO 2021."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que tome loperamida hasta que se detenga la diarrea y comente el síntoma en la próxima cita.', FALSE, 'Puede enmascarar una colitis inmunorrelacionada.', 0),
      (v_pregunta, 'Que suspenda la inmunoterapia para siempre por su cuenta y no vuelva a la unidad.', FALSE, 'La decisión es del equipo tratante.', 1),
      (v_pregunta, 'Que la diarrea no tiene ninguna relación con la inmunoterapia y es por la comida.', FALSE, 'La diarrea puede ser un evento inmunorrelacionado.', 2),
      (v_pregunta, 'Que contacte de inmediato al equipo con su tarjeta de alerta, porque puede ser una colitis inmunorrelacionada.', TRUE, 'Correcto. El equipo gradúa y decide el manejo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un comité busca reducir el costo de la inmunoterapia sin afectar a los pacientes. ¿Cuál de estas estrategias es una optimización razonable?';
    v_t4 := 'Las estrategias de optimización incluyen el aprovechamiento de viales en centrales de mezclas con condiciones asépticas y estabilidad documentada, la elección de esquemas de dosis aprobados y la definición de la duración del tratamiento según la evidencia y la ficha técnica, sin reducir dosis de forma arbitraria.';
    v_j1 := $evfinm_json${"external_id":"finm-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Evaluación económica y sostenibilidad de la inmunoterapia en Colombia","outcome":"Evaluación económica y sostenibilidad de la inmunoterapia en Colombia","source":"Fichas técnicas; evaluaciones económicas de inmunoterapia."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Compartir viales en condiciones asépticas validadas y estabilidad documentada, según la ficha técnica.', TRUE, 'Correcto. Reduce el desperdicio sin cambiar la dosis.', 0),
      (v_pregunta, 'Reducir la dosis a la mitad en todos los pacientes para que el presupuesto alcance para atender a más personas.', FALSE, 'Cambiar la dosis afecta la eficacia.', 1),
      (v_pregunta, 'Suspender la inmunoterapia a todos los pacientes que no respondieron en el primer ciclo.', FALSE, 'La respuesta se evalúa en el tiempo.', 2),
      (v_pregunta, 'Cambiar a productos sin registro sanitario más baratos comprados en el exterior.', FALSE, 'Los productos sin registro no son una opción.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una paciente con melanoma y tiroiditis de Hashimoto tratada con levotiroxina va a iniciar nivolumab e ipilimumab. Alguien opina que «la enfermedad autoinmune es una contraindicación absoluta». ¿Cuál es la mejor valoración?';
    v_t4 := 'Las enfermedades autoinmunes previas no son una contraindicación absoluta para los inhibidores de puntos de control, pero aumentan el riesgo de reactivación o de eventos inmunorrelacionados. Se decide con la paciente, se vigila de cerca (en este caso, la función tiroidea) y se educa sobre los signos de alarma.';
    v_j1 := $evfinm_json${"external_id":"finm-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso integrador: melanoma metastásico con nivolumab + ipilimumab","outcome":"Caso integrador: melanoma metastásico con nivolumab + ipilimumab","source":"Guías ESMO 2022 y ASCO 2021."}$evfinm_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'finm-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: ninguna persona con enfermedad autoinmune puede recibir inhibidores de puntos de control.', FALSE, 'No es una contraindicación absoluta.', 0),
      (v_pregunta, 'No es una contraindicación absoluta: se valora el riesgo, se vigila la tiroides de cerca y se educa sobre los signos de alarma.', TRUE, 'Correcto. La decisión es del equipo con la paciente.', 1),
      (v_pregunta, 'Es correcta si la paciente toma levotiroxina, porque interactúa con el nivolumab.', FALSE, 'La levotiroxina no interactúa con el nivolumab.', 2),
      (v_pregunta, 'No es una contraindicación porque la inmunoterapia cura la enfermedad autoinmune.', FALSE, 'La inmunoterapia puede empeorarla.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad finm-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de inmunología tumoral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de inmunología tumoral) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Explicar la elegibilidad para inmunoterapia en una junta';
  v_t2 := $evfinm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Explica los pasos del ciclo cáncer-inmunidad y dónde actúan PD-1/PD-L1 y CTLA-4.</li><li>Relaciona el PD-L1, la carga mutacional y el estado de microsatélites con la probabilidad de respuesta.</li><li>Explica por qué el paciente B tiene menor probabilidad de responder a la monoterapia.</li><li>Prepara una explicación sencilla para cada paciente.</li><li>Señala los límites de cada biomarcador.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Explicar el ciclo cáncer-inmunidad y los puntos de control.</li><li>Relacionar los biomarcadores con la probabilidad de respuesta.</li><li>Comunicar la explicación a un equipo y a los pacientes.</li></ul>
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
  <tr><td>Fundamentos</td><td>25 %</td><td>Explica el ciclo cáncer-inmunidad y los puntos de control con precisión.</td><td>Explicación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Biomarcadores</td><td>30 %</td><td>Relaciona PD-L1 alto, carga mutacional alta y MSI-H con mayor probabilidad de respuesta, y MSS con menor.</td><td>Relación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación a pacientes</td><td>25 %</td><td>Explicaciones claras, honestas y sin promesas.</td><td>Explicación técnica o con promesas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Límites</td><td>10 %</td><td>Reconoce que ningún biomarcador garantiza la respuesta.</td><td>No menciona límites.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfinm_html$;
  v_t3 := $evfinm_html$<h2>Caso de estudio</h2>
<p>En una junta multidisciplinaria se discuten dos pacientes (datos simulados). Paciente A: 60 años, cáncer de pulmón con PD-L1 del 80 %, alta carga mutacional, sin mutaciones EGFR ni ALK. Paciente B: 55 años, cáncer de colon metastásico estable a microsatélites (MSS), con tumor «frío» en la biopsia. El oncólogo pide al QF explicar, desde la biología, por qué uno es mejor candidato a un inhibidor de puntos de control.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfinm_html$;
  v_t4 := 'Informe para la junta con explicación a los pacientes.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfinm_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los inhibidores de puntos de control (nivolumab, pembrolizumab, atezolizumab, durvalumab, ipilimumab), de blinatumomab, de las terapias CAR-T y del tocilizumab; guías de manejo de eventos adversos inmunorrelacionados de ESMO (2022) y ASCO (2021); graduación ASTCT del síndrome de liberación de citoquinas e ICANS; criterios iRECIST; criterios CTCAE; normativa del Plan de Beneficios en Salud y MIPRES; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfinm_html$;
  v_t7 := NULL;
  v_j1 := $evfinm_json$["Ciclo cáncer-inmunidad.","Biomarcadores.","Comparación de pacientes.","Explicación a pacientes.","Límites de los biomarcadores."]$evfinm_json$::jsonb;
  v_j2 := $evfinm_json${"version":1,"total":100,"criteria":[{"id":"fundamentos","name":"Fundamentos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica el ciclo cáncer-inmunidad y los puntos de control con precisión."},{"level":3,"label":"Logrado","description":"Explicación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"biomarcadores","name":"Biomarcadores","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Relaciona PD-L1 alto, carga mutacional alta y MSI-H con mayor probabilidad de respuesta, y MSS con menor."},{"level":3,"label":"Logrado","description":"Relación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-a-pacientes","name":"Comunicación a pacientes","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explicaciones claras, honestas y sin promesas."},{"level":3,"label":"Logrado","description":"Explicación técnica o con promesas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"limites","name":"Límites","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Reconoce que ningún biomarcador garantiza la respuesta."},{"level":3,"label":"Logrado","description":"No menciona límites."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfinm_json$::jsonb;
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


  -- ── Actividad finm-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Inhibidores de puntos de control inmunitario' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Inhibidores de puntos de control inmunitario) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Validación farmacéutica de pembrolizumab';
  v_t2 := $evfinm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Verifica la indicación con el biomarcador y la ausencia de alteraciones dirigibles.</li><li>Define los laboratorios basales necesarios (tiroides, función hepática y renal, glucosa, cortisol si aplica).</li><li>Analiza el hipotiroidismo subclínico como punto de partida para el seguimiento.</li><li>Analiza la prednisona basal y comunica la recomendación al oncólogo.</li><li>Revisa la dosis y el intervalo de pembrolizumab según su ficha técnica.</li><li>Describe la gestión del acceso (Plan de Beneficios o MIPRES) y el plan de seguimiento por ciclo.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Validar la indicación con el biomarcador y el registro sanitario.</li><li>Identificar los laboratorios basales y los concomitantes relevantes.</li><li>Planear la gestión del acceso y el seguimiento.</li></ul>
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
  <tr><td>Indicación</td><td>20 %</td><td>Valida la monoterapia con TPS ≥50 % sin alteraciones dirigibles.</td><td>Valida sin justificar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Basales y concomitantes</td><td>35 %</td><td>Pide los laboratorios basales y comunica la prednisona y la tiroides como puntos críticos.</td><td>Aborda la mitad.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Dosis y acceso</td><td>25 %</td><td>Dosis e intervalo según la ficha técnica y ruta de acceso clara.</td><td>Dosis o acceso incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Seguimiento</td><td>10 %</td><td>Plan por ciclo con laboratorios y signos de alarma.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfinm_html$;
  v_t3 := $evfinm_html$<h2>Caso de estudio</h2>
<p>Don Ernesto tiene 67 años, está afiliado al régimen contributivo y tiene un adenocarcinoma de pulmón estadio IV, ECOG 1, sin mutaciones EGFR ni rearreglos ALK/ROS1, con PD-L1 (TPS) del 70 % (datos simulados). Le prescriben pembrolizumab en monoterapia de primera línea. Tiene hipotiroidismo subclínico no tratado, EPOC con prednisona 15 mg al día desde hace dos meses y toma omeprazol. No hay laboratorios basales en la historia.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfinm_html$;
  v_t4 := 'Informe de validación con plan de seguimiento.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfinm_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los inhibidores de puntos de control (nivolumab, pembrolizumab, atezolizumab, durvalumab, ipilimumab), de blinatumomab, de las terapias CAR-T y del tocilizumab; guías de manejo de eventos adversos inmunorrelacionados de ESMO (2022) y ASCO (2021); graduación ASTCT del síndrome de liberación de citoquinas e ICANS; criterios iRECIST; criterios CTCAE; normativa del Plan de Beneficios en Salud y MIPRES; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfinm_html$;
  v_t7 := NULL;
  v_j1 := $evfinm_json$["Indicación y biomarcador.","Laboratorios basales.","Concomitantes.","Dosis e intervalo.","Acceso y seguimiento."]$evfinm_json$::jsonb;
  v_j2 := $evfinm_json${"version":1,"total":100,"criteria":[{"id":"indicacion","name":"Indicación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Valida la monoterapia con TPS ≥50 % sin alteraciones dirigibles."},{"level":3,"label":"Logrado","description":"Valida sin justificar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"basales-y-concomitantes","name":"Basales y concomitantes","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Pide los laboratorios basales y comunica la prednisona y la tiroides como puntos críticos."},{"level":3,"label":"Logrado","description":"Aborda la mitad."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"dosis-y-acceso","name":"Dosis y acceso","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Dosis e intervalo según la ficha técnica y ruta de acceso clara."},{"level":3,"label":"Logrado","description":"Dosis o acceso incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguimiento","name":"Seguimiento","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Plan por ciclo con laboratorios y signos de alarma."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfinm_json$::jsonb;
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


  -- ── Actividad finm-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Terapias celulares, biespecíficos, vacunas y patrones de respuesta' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Terapias celulares, biespecíficos, vacunas y patrones de respuesta) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Síndrome de liberación de citoquinas tras CAR-T';
  v_t2 := $evfinm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Gradúa el síndrome de liberación de citoquinas con los criterios ASTCT y justifica.</li><li>Describe el tratamiento indicado según el grado y la ficha técnica (tocilizumab, corticoides).</li><li>Verifica la disponibilidad y la preparación del tocilizumab.</li><li>Explica cómo se vigila el ICANS (puntuación ICE) y qué medicamento se prefiere si aparece.</li><li>Define la farmacovigilancia del evento.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Graduar el síndrome de liberación de citoquinas con ASTCT.</li><li>Asegurar los medicamentos de rescate y su preparación.</li><li>Planear la prevención y la vigilancia del ICANS y la farmacovigilancia.</li></ul>
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
  <tr><td>Graduación</td><td>25 %</td><td>Gradúa como grado 2 (fiebre con hipotensión que responde a líquidos, sin vasopresores) con justificación.</td><td>Gradúa con error.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Tratamiento y preparación</td><td>35 %</td><td>Tocilizumab según la ficha técnica, corticoides si no responde, disponibilidad y preparación correctas.</td><td>Tratamiento parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>ICANS</td><td>20 %</td><td>Vigilancia con la escala ICE y corticoides como tratamiento preferido.</td><td>Vigilancia general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Farmacovigilancia</td><td>10 %</td><td>Reporte del evento con datos completos.</td><td>Reporte incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfinm_html$;
  v_t3 := $evfinm_html$<h2>Caso de estudio</h2>
<p>Doña Patricia tiene 45 años y un linfoma B difuso de células grandes refractario (datos simulados). Recibió CAR-T anti-CD19 tras linfodepleción con fludarabina y ciclofosfamida. En el día +3 tiene fiebre de 39,2 °C, frecuencia de 118 lpm y presión de 85/50 mmHg que responde a un bolo de cristaloides, con saturación normal. Está orientada. El hematólogo pide al servicio farmacéutico apoyo con el manejo.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfinm_html$;
  v_t4 := 'Informe de apoyo al manejo del síndrome de liberación de citoquinas.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfinm_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los inhibidores de puntos de control (nivolumab, pembrolizumab, atezolizumab, durvalumab, ipilimumab), de blinatumomab, de las terapias CAR-T y del tocilizumab; guías de manejo de eventos adversos inmunorrelacionados de ESMO (2022) y ASCO (2021); graduación ASTCT del síndrome de liberación de citoquinas e ICANS; criterios iRECIST; criterios CTCAE; normativa del Plan de Beneficios en Salud y MIPRES; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfinm_html$;
  v_t7 := NULL;
  v_j1 := $evfinm_json$["Graduación.","Tratamiento.","Disponibilidad y preparación.","ICANS.","Farmacovigilancia."]$evfinm_json$::jsonb;
  v_j2 := $evfinm_json${"version":1,"total":100,"criteria":[{"id":"graduacion","name":"Graduación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Gradúa como grado 2 (fiebre con hipotensión que responde a líquidos, sin vasopresores) con justificación."},{"level":3,"label":"Logrado","description":"Gradúa con error."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tratamiento-y-preparacion","name":"Tratamiento y preparación","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Tocilizumab según la ficha técnica, corticoides si no responde, disponibilidad y preparación correctas."},{"level":3,"label":"Logrado","description":"Tratamiento parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"icans","name":"ICANS","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Vigilancia con la escala ICE y corticoides como tratamiento preferido."},{"level":3,"label":"Logrado","description":"Vigilancia general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacovigilancia","name":"Farmacovigilancia","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Reporte del evento con datos completos."},{"level":3,"label":"Logrado","description":"Reporte incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfinm_json$::jsonb;
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


  -- ── Actividad finm-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Eventos adversos inmunorrelacionados (irAEs)' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Eventos adversos inmunorrelacionados (irAEs)) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: validación y plan de vigilancia de la inmunoterapia de Doña Lucía';
  v_t2 := $evfinm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y prepara una explicación sencilla del tratamiento para la paciente.</li><li>Fase 2: valida el esquema (dosis, intervalos, número de ciclos) según las fichas técnicas y define los laboratorios basales.</li><li>Fase 2: analiza el suplemento y los concomitantes.</li><li>Fase 3: diseña el plan de vigilancia de eventos inmunorrelacionados, con énfasis en la tiroides, la piel, el intestino y el hígado.</li><li>Fase 3: define qué hacer ante una diarrea de grado 3 con el algoritmo de corticoides.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (inmunología tumoral).</strong> Explicación del tratamiento a la paciente y a su familia.</li>
  <li><strong>Fase 2 · Unidad 2 (inhibidores de puntos de control).</strong> Validación, laboratorios basales y concomitantes.</li>
  <li><strong>Fase 3 · Unidad 3 (eventos inmunorrelacionados).</strong> Plan de vigilancia y manejo de eventos, con su tiroides.</li>
  <li><strong>Fase 4 · Unidad 4 (patrones de respuesta).</strong> Interpretación de la respuesta y comunicación de la pseudoprogresión.</li>
  <li><strong>Fase 5 · Unidad 5 (rol del QF y acceso).</strong> Preparación, acceso, educación, farmacovigilancia y seguimiento.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Validar la inmunoterapia combinada en una paciente con enfermedad autoinmune.</li><li>Diseñar el plan de vigilancia de eventos inmunorrelacionados.</li></ul>
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
  <tr><td>Validación</td><td>25 %</td><td>Esquema coherente con las fichas técnicas y laboratorios basales completos.</td><td>Validación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Enfermedad autoinmune y concomitantes</td><td>25 %</td><td>Reconoce el riesgo por Hashimoto sin contraindicar y aborda el suplemento.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vigilancia y algoritmo</td><td>40 %</td><td>Plan de vigilancia por órgano con frecuencias y algoritmo de corticoides para la colitis de grado 3.</td><td>Plan incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfinm_html$;
  v_t3 := $evfinm_html$<h2>Caso de estudio</h2>
<p>Doña Lucía tiene 49 años, tiene un melanoma metastásico BRAF no mutado, ECOG 0, y está afiliada al régimen contributivo (datos simulados). La junta oncológica decide nivolumab con ipilimumab por 4 ciclos seguido de nivolumab de mantenimiento. Tiene tiroiditis de Hashimoto con levotiroxina, toma omeprazol y un suplemento «para fortalecer las defensas». Vive a 2 horas de la unidad. Eres el QF responsable del programa de inmunoterapia. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfinm_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfinm_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los inhibidores de puntos de control (nivolumab, pembrolizumab, atezolizumab, durvalumab, ipilimumab), de blinatumomab, de las terapias CAR-T y del tocilizumab; guías de manejo de eventos adversos inmunorrelacionados de ESMO (2022) y ASCO (2021); graduación ASTCT del síndrome de liberación de citoquinas e ICANS; criterios iRECIST; criterios CTCAE; normativa del Plan de Beneficios en Salud y MIPRES; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfinm_html$;
  v_t7 := NULL;
  v_j1 := $evfinm_json$["Explicación a la paciente.","Validación y basales.","Concomitantes.","Vigilancia y algoritmo."]$evfinm_json$::jsonb;
  v_j2 := $evfinm_json${"version":1,"total":100,"criteria":[{"id":"validacion","name":"Validación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Esquema coherente con las fichas técnicas y laboratorios basales completos."},{"level":3,"label":"Logrado","description":"Validación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"enfermedad-autoinmune-y-concomitantes","name":"Enfermedad autoinmune y concomitantes","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce el riesgo por Hashimoto sin contraindicar y aborda el suplemento."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vigilancia-y-algoritmo","name":"Vigilancia y algoritmo","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Plan de vigilancia por órgano con frecuencias y algoritmo de corticoides para la colitis de grado 3."},{"level":3,"label":"Logrado","description":"Plan incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfinm_json$::jsonb;
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


  -- ── Actividad finm-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Rol del químico farmacéutico y acceso en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Rol del químico farmacéutico y acceso en Colombia) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan integral de inmunoterapia de Doña Lucía';
  v_t2 := $evfinm_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: explica cómo comunicarías una posible pseudoprogresión y cómo se confirma.</li><li>Fase 5: define las precauciones de preparación de los anticuerpos y la gestión del acceso.</li><li>Fase 5: diseña la educación (tarjeta de alerta, contacto 24/7) considerando que vive lejos, y la farmacovigilancia.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (inmunología tumoral).</strong> Explicación del tratamiento a la paciente y a su familia.</li>
  <li><strong>Fase 2 · Unidad 2 (inhibidores de puntos de control).</strong> Validación, laboratorios basales y concomitantes.</li>
  <li><strong>Fase 3 · Unidad 3 (eventos inmunorrelacionados).</strong> Plan de vigilancia y manejo de eventos, con su tiroides.</li>
  <li><strong>Fase 4 · Unidad 4 (patrones de respuesta).</strong> Interpretación de la respuesta y comunicación de la pseudoprogresión.</li>
  <li><strong>Fase 5 · Unidad 5 (rol del QF y acceso).</strong> Preparación, acceso, educación, farmacovigilancia y seguimiento.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Comunicar los patrones de respuesta a la paciente.</li><li>Diseñar la preparación, el acceso, la educación y la farmacovigilancia.</li></ul>
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
  <tr><td>Respuesta</td><td>20 %</td><td>Explica la pseudoprogresión y la confirmación con iRECIST de forma comprensible.</td><td>Explicación técnica o incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Preparación y acceso</td><td>25 %</td><td>Preparación sin agitar, con filtro, y ruta de acceso clara.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Educación y farmacovigilancia</td><td>30 %</td><td>Tarjeta de alerta, contacto 24/7, plan para la distancia y reporte al INVIMA.</td><td>Educación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfinm_html$;
  v_t3 := $evfinm_html$<h2>Caso de estudio</h2>
<p>Doña Lucía tiene 49 años, tiene un melanoma metastásico BRAF no mutado, ECOG 0, y está afiliada al régimen contributivo (datos simulados). La junta oncológica decide nivolumab con ipilimumab por 4 ciclos seguido de nivolumab de mantenimiento. Tiene tiroiditis de Hashimoto con levotiroxina, toma omeprazol y un suplemento «para fortalecer las defensas». Vive a 2 horas de la unidad. Eres el QF responsable del programa de inmunoterapia. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité del programa.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfinm_html$;
  v_t4 := 'Plan integral con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfinm_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los inhibidores de puntos de control (nivolumab, pembrolizumab, atezolizumab, durvalumab, ipilimumab), de blinatumomab, de las terapias CAR-T y del tocilizumab; guías de manejo de eventos adversos inmunorrelacionados de ESMO (2022) y ASCO (2021); graduación ASTCT del síndrome de liberación de citoquinas e ICANS; criterios iRECIST; criterios CTCAE; normativa del Plan de Beneficios en Salud y MIPRES; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfinm_html$;
  v_t7 := NULL;
  v_j1 := $evfinm_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Patrones de respuesta.","Preparación y acceso.","Educación y farmacovigilancia.","Resumen ejecutivo."]$evfinm_json$::jsonb;
  v_j2 := $evfinm_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"respuesta","name":"Respuesta","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Explica la pseudoprogresión y la confirmación con iRECIST de forma comprensible."},{"level":3,"label":"Logrado","description":"Explicación técnica o incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"preparacion-y-acceso","name":"Preparación y acceso","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Preparación sin agitar, con filtro, y ruta de acceso clara."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"educacion-y-farmacovigilancia","name":"Educación y farmacovigilancia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Tarjeta de alerta, contacto 24/7, plan para la distancia y reporte al INVIMA."},{"level":3,"label":"Logrado","description":"Educación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfinm_json$::jsonb;
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


  -- ── Foro finm-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con la inmunoterapia';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfinm_html$<h2>Para empezar</h2>
<p>Piensa en un paciente con inmunoterapia que hayas atendido o del que hayas oído y cuéntanos en tres o cuatro líneas una duda o un evento adverso que te llamó la atención, sin nombres ni datos que lo identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfinm_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre inmunoterapia te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfinm_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfinm_html$;
  v_t6 := $evfinm_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfinm_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has preparado o validado anticuerpos monoclonales?', '¿Qué evento inmunorrelacionado te parece más difícil de reconocer?']::text[];
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


  -- ── Foro finm-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de inmunología tumoral' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de inmunología tumoral) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Por qué no todos responden?';
  v_t2 := 'Argumentar cómo explicar a pacientes y familias la variabilidad en la respuesta a la inmunoterapia.';
  v_t3 := $evfinm_html$<h2>Caso del foro</h2>
<p>En una unidad de oncología, dos pacientes con el mismo tipo de cáncer de pulmón reciben el mismo anti-PD-1 (datos simulados). Uno tiene una respuesta casi completa; el otro progresa a los tres meses. La familia del segundo pregunta si «le dieron un medicamento de menor calidad».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfinm_html$;
  v_t4 := '¿Cómo explicarías la diferencia con base en la biología y qué información verificable usarías?';
  v_t5 := $evfinm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el dato biológico o el biomarcador que sustenta tu explicación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfinm_html$;
  v_t6 := $evfinm_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el dato biológico o el biomarcador que sustenta tu explicación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfinm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué biomarcadores se asocian a mayor probabilidad de respuesta?', '¿Qué es la pseudoprogresión y cómo se diferencia de la progresión real?', '¿Cómo responderías la duda sobre la calidad del medicamento?']::text[];
  v_j1 := $evfinm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el dato biológico o el biomarcador que sustenta tu explicación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfinm_json$::jsonb;
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


  -- ── Foro finm-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Inhibidores de puntos de control inmunitario' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Inhibidores de puntos de control inmunitario) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Inmunoterapia sin biomarcador';
  v_t2 := 'Argumentar por qué los biomarcadores son necesarios para indicar la inmunoterapia y qué hacer cuando faltan.';
  v_t3 := $evfinm_html$<h2>Caso del foro</h2>
<p>En una EPS llegan prescripciones de anti-PD-1 sin el resultado de PD-L1 ni de MSI (datos simulados). Un oncólogo argumenta que «el paciente no puede esperar» y que «en el exterior lo usan así». El comité de farmacia debe decidir si autoriza.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfinm_html$;
  v_t4 := '¿Qué postura defenderías y qué solución propondrías para no retrasar a los pacientes?';
  v_t5 := $evfinm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la indicación aprobada que sustenta tu postura. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfinm_html$;
  v_t6 := $evfinm_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la indicación aprobada que sustenta tu postura.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfinm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿En qué indicaciones el biomarcador es requisito y en cuáles no?', '¿Qué dice el registro sanitario sobre las indicaciones aprobadas?', '¿Cómo se pueden reducir los tiempos de los exámenes?']::text[];
  v_j1 := $evfinm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la indicación aprobada que sustenta tu postura."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfinm_json$::jsonb;
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


  -- ── Foro finm-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Eventos adversos inmunorrelacionados (irAEs)' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Eventos adversos inmunorrelacionados (irAEs)) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Los eventos inmunorrelacionados que llegan a urgencias';
  v_t2 := 'Argumentar cómo asegurar que los eventos inmunorrelacionados se reconozcan y traten a tiempo fuera de la unidad de oncología.';
  v_t3 := $evfinm_html$<h2>Caso del foro</h2>
<p>Un hospital revisa casos de pacientes con inmunoterapia atendidos en urgencias (datos simulados): una colitis tratada como gastroenteritis viral, una neumonitis tratada solo con antibióticos y una insuficiencia suprarrenal no reconocida. Ninguno de los pacientes llevaba tarjeta de alerta.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfinm_html$;
  v_t4 := '¿Qué medidas propondrías para que urgencias reconozca y maneje estos eventos?';
  v_t5 := $evfinm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o la ficha técnica que sustenta cada medida. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfinm_html$;
  v_t6 := $evfinm_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la ficha técnica que sustenta cada medida.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfinm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué información debe llevar la tarjeta de alerta del paciente?', '¿Qué protocolos necesita urgencias?', '¿Cómo se reportan estos eventos al INVIMA?']::text[];
  v_j1 := $evfinm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o la ficha técnica que sustenta cada medida."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfinm_json$::jsonb;
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


  -- ── Foro finm-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Terapias celulares, biespecíficos, vacunas y patrones de respuesta' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Terapias celulares, biespecíficos, vacunas y patrones de respuesta) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Terapias celulares en Colombia: ¿está listo el servicio?';
  v_t2 := 'Argumentar qué debe tener un servicio farmacéutico para participar en terapias CAR-T y biespecíficos.';
  v_t3 := $evfinm_html$<h2>Caso del foro</h2>
<p>Un hospital universitario planea iniciar terapia CAR-T y anticuerpos biespecíficos (datos simulados). El servicio farmacéutico nunca ha manejado productos celulares, no tiene protocolo de síndrome de liberación de citoquinas y el inventario de tocilizumab es irregular.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfinm_html$;
  v_t4 := '¿Qué requisitos priorizarías antes de tratar al primer paciente?';
  v_t5 := $evfinm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la guía que sustenta cada requisito. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfinm_html$;
  v_t6 := $evfinm_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta cada requisito.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfinm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué cadena de custodia requiere un producto celular?', '¿Qué medicamentos de rescate deben estar disponibles?', '¿Cómo se organiza la vigilancia de los primeros días?']::text[];
  v_j1 := $evfinm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta cada requisito."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfinm_json$::jsonb;
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


  -- ── Foro finm-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Rol del químico farmacéutico y acceso en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Rol del químico farmacéutico y acceso en Colombia) en Inmunoterapia Oncológica: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Sostenibilidad de la inmunoterapia';
  v_t2 := 'Argumentar cómo equilibrar el acceso a la inmunoterapia con la sostenibilidad del sistema de salud.';
  v_t3 := $evfinm_html$<h2>Caso del foro</h2>
<p>Una EPS reporta que la inmunoterapia oncológica representa una proporción creciente de su gasto (datos simulados). Propone limitar la duración de todos los tratamientos a un año, compartir viales y exigir biomarcador en todas las indicaciones. Las asociaciones de pacientes temen que se recorten tratamientos eficaces.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfinm_html$;
  v_t4 := '¿Qué propuestas apoyarías y cuáles no, y por qué?';
  v_t5 := $evfinm_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica, la evidencia o la norma que sustenta cada postura. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfinm_html$;
  v_t6 := $evfinm_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica, la evidencia o la norma que sustenta cada postura.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfinm_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dice la evidencia sobre la duración de los tratamientos con inhibidores de puntos de control?', '¿Qué condiciones requiere compartir viales con seguridad?', '¿Cuándo el biomarcador es requisito y cuándo no?']::text[];
  v_j1 := $evfinm_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica, la evidencia o la norma que sustenta cada postura."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfinm_json$::jsonb;
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


  RAISE NOTICE 'Inmunoterapia Oncológica: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfinm$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Terapias Dirigidas en Oncología
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfdir$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Terapias Dirigidas en Oncología' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Medicina de precisión y biomarcadores en oncología', 'Unidad 2. Anticuerpos monoclonales dirigidos y conjugados anticuerpo-fármaco', 'Unidad 3. Inhibidores de tirosina cinasa y otras moléculas pequeñas', 'Unidad 4. Seguridad: toxicidades, interacciones, adherencia y resistencia', 'Unidad 5. Acceso en Colombia y casos integradores']::text[])) < 5 THEN
    RAISE NOTICE 'Terapias Dirigidas en Oncología: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfdir_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfdir_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fdir-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Medicina de precisión y biomarcadores en oncología' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Medicina de precisión y biomarcadores en oncología) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Medicina de precisión y biomarcadores en oncología';
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


    v_t3 := '¿Qué es un biomarcador predictivo?';
    v_t4 := 'Un biomarcador predictivo anticipa el beneficio de un tratamiento concreto (por ejemplo, mutación de EGFR para inhibidores de EGFR, HER2 para anti-HER2, RAS no mutado para anti-EGFR); un biomarcador pronóstico informa sobre la evolución de la enfermedad con independencia del tratamiento.';
    v_j1 := $evfdir_json${"external_id":"fdir-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Biomarcadores predictivos y pronósticos: IHQ, FISH y PCR","outcome":"Biomarcadores predictivos y pronósticos: IHQ, FISH y PCR","source":"Fundamentos de medicina de precisión; fichas técnicas."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Uno que anticipa la respuesta a un tratamiento concreto, como una mutación de EGFR para un inhibidor de EGFR.', TRUE, 'Correcto. Orienta la elección del fármaco.', 0),
      (v_pregunta, 'Uno que indica el pronóstico del paciente sin importar el tratamiento que reciba.', FALSE, 'Ese es un biomarcador pronóstico.', 1),
      (v_pregunta, 'Uno que se mide solo después del tratamiento para saber si hubo efectos adversos.', FALSE, 'No es la definición de un biomarcador predictivo.', 2),
      (v_pregunta, 'Uno que confirma el diagnóstico de cáncer cuando la biopsia no es concluyente.', FALSE, 'Ese sería un biomarcador diagnóstico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'El informe de patología de un cáncer de mama reporta HER2 por inmunohistoquímica 2+. ¿Qué paso sigue?';
    v_t4 := 'HER2 por inmunohistoquímica: 0 y 1+ negativos (1+ y algunos 2+ sin amplificación se consideran «HER2-bajo»), 2+ equívoco que se confirma con hibridación in situ, 3+ positivo. El resultado orienta el uso de trastuzumab, pertuzumab y conjugados como el T-DXd.';
    v_j1 := $evfdir_json${"external_id":"fdir-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Biomarcadores predictivos y pronósticos: IHQ, FISH y PCR","outcome":"Biomarcadores predictivos y pronósticos: IHQ, FISH y PCR","source":"Fichas técnicas de trastuzumab y trastuzumab deruxtecán."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Iniciar trastuzumab de inmediato, porque 2+ es siempre un resultado positivo para HER2.', FALSE, 'Un 2+ es un resultado equívoco.', 0),
      (v_pregunta, 'Descartar cualquier terapia anti-HER2, porque solo el 3+ tiene algún valor clínico.', FALSE, 'El 2+ se confirma antes de decidir.', 1),
      (v_pregunta, 'Confirmar con hibridación in situ (ISH), porque el 2+ es un resultado equívoco.', TRUE, 'Correcto. La ISH define si hay amplificación.', 2),
      (v_pregunta, 'Repetir la misma inmunohistoquímica cada mes hasta que el resultado cambie a 3+.', FALSE, 'No se repite la misma prueba: se confirma con ISH.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En un paciente con cáncer de pulmón la biopsia tiene poco tejido. ¿Qué análisis es correcto sobre el estudio molecular?';
    v_t4 := 'Los paneles de secuenciación de nueva generación (NGS) evalúan muchas alteraciones a la vez con poco tejido. La biopsia líquida (ADN tumoral circulante) ayuda cuando no hay tejido suficiente y para seguir la resistencia; un resultado negativo no excluye la alteración y puede requerir confirmación en tejido.';
    v_j1 := $evfdir_json${"external_id":"fdir-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Secuenciación de nueva generación (NGS) y biopsia líquida","outcome":"Secuenciación de nueva generación (NGS) y biopsia líquida","source":"Fundamentos de medicina de precisión."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Basta con estudiar una sola alteración, porque las demás son muy raras en el cáncer de pulmón.', FALSE, 'Hay varias alteraciones dirigibles que estudiar.', 0),
      (v_pregunta, 'Si la biopsia líquida es negativa, se descarta por completo cualquier alteración dirigible.', FALSE, 'Una biopsia líquida negativa no las descarta.', 1),
      (v_pregunta, 'El poco tejido impide cualquier estudio, así que se trata sin conocer el perfil molecular.', FALSE, 'Existen opciones para estudiar con poco tejido.', 2),
      (v_pregunta, 'Un panel de secuenciación evalúa varias alteraciones con poco tejido; la biopsia líquida complementa si falta muestra.', TRUE, 'Correcto. Un resultado negativo en sangre no las excluye.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'A un paciente con adenocarcinoma de pulmón avanzado, en buen estado general, le prescriben quimioinmunoterapia sin resultados de EGFR, ALK ni ROS1. ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'En el adenocarcinoma de pulmón avanzado se recomienda conocer el perfil molecular (EGFR, ALK, ROS1, BRAF, entre otros) y el PD-L1 antes de iniciar la primera línea: una alteración dirigible cambia el tratamiento y la inmunoterapia previa puede aumentar la toxicidad de algunos ITK. El QF identifica la falta y gestiona la ruta de solicitud.';
    v_j1 := $evfdir_json${"external_id":"fdir-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: paciente con CPCNP sin perfil molecular completo","outcome":"Caso: paciente con CPCNP sin perfil molecular completo","source":"Fichas técnicas de osimertinib y de los ITK de ALK."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada, porque el perfil molecular no cambia el tratamiento del adenocarcinoma de pulmón.', FALSE, 'El perfil molecular puede cambiar el tratamiento por completo.', 0),
      (v_pregunta, 'Conviene comunicar al oncólogo la falta del perfil molecular y gestionarlo, porque una alteración cambia la primera línea.', TRUE, 'Correcto. Salvo urgencia clínica, se espera el resultado.', 1),
      (v_pregunta, 'Es adecuada si se agrega un inhibidor de EGFR a la quimioinmunoterapia por si acaso.', FALSE, 'Añadir un ITK sin biomarcador no es adecuado.', 2),
      (v_pregunta, 'Conviene suspender cualquier tratamiento hasta repetir la biopsia en seis meses.', FALSE, 'Un retraso tan largo no es aceptable.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fdir-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Anticuerpos monoclonales dirigidos y conjugados anticuerpo-fármaco' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Anticuerpos monoclonales dirigidos y conjugados anticuerpo-fármaco) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Anticuerpos monoclonales dirigidos y conjugados anticuerpo-fármaco';
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


    v_t3 := '¿En qué pacientes con cáncer colorrectal metastásico benefician los anti-EGFR como el cetuximab?';
    v_t4 := 'Los anti-EGFR (cetuximab, panitumumab) solo benefician a los pacientes con cáncer colorrectal RAS no mutado: con mutaciones de KRAS o NRAS la vía se activa por debajo del receptor. Sus toxicidades típicas son el rash acneiforme y la hipomagnesemia.';
    v_j1 := $evfdir_json${"external_id":"fdir-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Cetuximab y panitumumab: la importancia del estado de RAS","outcome":"Cetuximab y panitumumab: la importancia del estado de RAS","source":"Fichas técnicas de cetuximab y panitumumab."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En todos los pacientes con cáncer colorrectal, sin necesidad de ningún estudio molecular.', FALSE, 'Su beneficio depende del estado de RAS.', 0),
      (v_pregunta, 'Solo en los que tienen mutación de KRAS o NRAS, que activa la vía del EGFR.', FALSE, 'Ocurre lo contrario: con RAS mutado no benefician.', 1),
      (v_pregunta, 'Solo en los mayores de 70 años, porque en ellos el EGFR está más expresado.', FALSE, 'La edad no define el beneficio.', 2),
      (v_pregunta, 'En los tumores con RAS no mutado (silvestre).', TRUE, 'Correcto. Con RAS mutado no benefician.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con linfoma iniciará rituximab. ¿Qué tamizaje verifica el QF antes de validar?';
    v_t4 := 'El rituximab (anti-CD20) puede reactivar la hepatitis B, con casos graves; antes de iniciar se tamiza el antígeno de superficie y el anticuerpo anti-core, y se indica profilaxis o seguimiento según el resultado. También se premedica por las reacciones a la infusión y se controla la velocidad.';
    v_j1 := $evfdir_json${"external_id":"fdir-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Rituximab: anti-CD20, reacciones a la infusión y reactivación de hepatitis B","outcome":"Rituximab: anti-CD20, reacciones a la infusión y reactivación de hepatitis B","source":"Ficha técnica de rituximab."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo el embarazo, porque es la única contraindicación del rituximab.', FALSE, 'Falta un tamizaje infeccioso clave.', 0),
      (v_pregunta, 'Hepatitis B (antígeno de superficie y anticuerpo anti-core), por el riesgo de reactivación.', TRUE, 'Correcto. Según el resultado se da profilaxis antiviral.', 1),
      (v_pregunta, 'Solo el colesterol, porque el rituximab eleva los lípidos en la mayoría de los pacientes tratados.', FALSE, 'No es el tamizaje relevante.', 2),
      (v_pregunta, 'Ningún tamizaje, porque el rituximab no aumenta el riesgo de infecciones.', FALSE, 'Sí aumenta el riesgo de infecciones y de reactivación del VHB.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una paciente con trastuzumab tenía una fracción de eyección de 60 % y en el control está en 44 %, sin síntomas. ¿Qué análisis es correcto?';
    v_t4 := 'El trastuzumab puede causar disfunción ventricular, en general reversible, con más riesgo si se combina o sigue a antraciclinas. Se vigila la fracción de eyección antes y durante el tratamiento; una caída significativa obliga a suspender y reevaluar según los criterios de la ficha técnica.';
    v_j1 := $evfdir_json${"external_id":"fdir-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Trastuzumab y pertuzumab: bloqueo dual de HER2 y cardiotoxicidad","outcome":"Trastuzumab y pertuzumab: bloqueo dual de HER2 y cardiotoxicidad","source":"Ficha técnica de trastuzumab."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Hay una caída relevante de la fracción de eyección: se informa al oncólogo para suspender y reevaluar según el protocolo.', TRUE, 'Correcto. La cardiotoxicidad del trastuzumab suele ser reversible.', 0),
      (v_pregunta, 'No es relevante, porque la paciente no tiene síntomas y la fracción de eyección no importa.', FALSE, 'La caída es significativa aunque no haya síntomas.', 1),
      (v_pregunta, 'Es una cardiotoxicidad irreversible que contraindica para siempre cualquier anti-HER2.', FALSE, 'Suele ser reversible y puede reiniciarse según el protocolo.', 2),
      (v_pregunta, 'Se debe duplicar la dosis de trastuzumab para compensar la menor fracción de eyección.', FALSE, 'Subir la dosis empeoraría la toxicidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una paciente con trastuzumab deruxtecán consulta por tos seca y falta de aire desde hace una semana. Alguien propone darle un jarabe y continuar el tratamiento. ¿Cuál es la mejor valoración?';
    v_t4 := 'El trastuzumab deruxtecán puede causar enfermedad pulmonar intersticial o neumonitis, a veces grave o mortal. Ante tos, disnea o fiebre se suspende, se evalúa con urgencia (imagen) y se maneja según el grado indicado en la ficha técnica, con corticoides si corresponde; se reporta al INVIMA.';
    v_j1 := $evfdir_json${"external_id":"fdir-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: tos y disnea en una paciente con T-DXd","outcome":"Caso: tos y disnea en una paciente con T-DXd","source":"Ficha técnica de trastuzumab deruxtecán."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada, porque la tos con T-DXd siempre es por una infección viral sin importancia.', FALSE, 'Puede tratarse de una enfermedad pulmonar intersticial.', 0),
      (v_pregunta, 'Es adecuada si además se reduce la dosis del T-DXd a la mitad en el siguiente ciclo.', FALSE, 'Primero hay que evaluar el cuadro.', 1),
      (v_pregunta, 'Es inadecuada: puede ser una enfermedad pulmonar intersticial; se suspende, se evalúa con urgencia y se reporta.', TRUE, 'Correcto. La ficha técnica define la conducta según el grado.', 2),
      (v_pregunta, 'Es inadecuada solo porque el jarabe debe ser con codeína para que funcione bien.', FALSE, 'El problema no es el jarabe, sino la posible neumonitis.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fdir-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Inhibidores de tirosina cinasa y otras moléculas pequeñas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Inhibidores de tirosina cinasa y otras moléculas pequeñas) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Inhibidores de tirosina cinasa y otras moléculas pequeñas';
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


    v_t3 := '¿Cómo actúan la mayoría de los inhibidores de tirosina cinasa?';
    v_t4 := 'Los inhibidores de tirosina cinasa son moléculas pequeñas orales que compiten con el ATP en el sitio catalítico de la cinasa y bloquean la señalización (RTK, MAPK, PI3K/AKT). La mayoría se metaboliza por el CYP3A4, lo que explica muchas interacciones.';
    v_j1 := $evfdir_json${"external_id":"fdir-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: farmacología general de los ITK","outcome":"Introducción a la unidad: farmacología general de los ITK","source":"Fichas técnicas de los inhibidores de tirosina cinasa."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Se unen al ADN de la célula tumoral y bloquean su replicación en la fase S.', FALSE, 'Ese es el mecanismo de algunos citotóxicos.', 0),
      (v_pregunta, 'Compiten con el ATP en el sitio catalítico de la cinasa y bloquean la señal de proliferación.', TRUE, 'Correcto. Son orales y suelen metabolizarse por el CYP3A4.', 1),
      (v_pregunta, 'Activan a los linfocitos T para que destruyan las células tumorales del paciente.', FALSE, 'Ese es el mecanismo de la inmunoterapia.', 2),
      (v_pregunta, 'Se unen a receptores de la superficie y provocan citotoxicidad mediada por el complemento del plasma.', FALSE, 'Ese es un mecanismo de los anticuerpos monoclonales.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente con ribociclib recibe ondansetrón para las náuseas. ¿Qué advierte el QF?';
    v_t4 := 'Los inhibidores de CDK4/6 difieren en su toxicidad: el palbociclib produce sobre todo neutropenia, el abemaciclib diarrea, y el ribociclib neutropenia y prolongación del QT, por lo que exige ECG y evitar otros fármacos que prolongan el QT, como el ondansetrón.';
    v_j1 := $evfdir_json${"external_id":"fdir-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Inhibidores de CDK4/6: palbociclib, ribociclib y abemaciclib","outcome":"Inhibidores de CDK4/6: palbociclib, ribociclib y abemaciclib","source":"Fichas técnicas de ribociclib, palbociclib y abemaciclib."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que no hay interacción, porque el ondansetrón actúa solo en el estómago.', FALSE, 'El ondansetrón también prolonga el QT.', 0),
      (v_pregunta, 'Que debe duplicar la dosis del ribociclib para compensar el efecto antiemético que tiene el ondansetrón.', FALSE, 'No hay razón para cambiar la dosis.', 1),
      (v_pregunta, 'Que el ribociclib reduce el efecto del ondansetrón y debe usarse una dosis mayor.', FALSE, 'La preocupación es el QT, no la eficacia.', 2),
      (v_pregunta, 'Que ambos prolongan el QT: se revisa el ECG y se valora una alternativa antiemética con el oncólogo.', TRUE, 'Correcto. El ribociclib exige control del QT.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con leucemia linfocítica crónica inicia venetoclax y recibe posaconazol como profilaxis antifúngica. ¿Qué análisis es correcto?';
    v_t4 := 'El venetoclax (inhibidor de BCL-2) reduce con rapidez la masa tumoral; su riesgo principal al inicio es el síndrome de lisis tumoral, por lo que se escala la dosis en 5 semanas con profilaxis. Los inhibidores potentes del CYP3A4 (como el posaconazol) están contraindicados durante la escalada y requieren reducción de dosis en el mantenimiento, según la ficha técnica.';
    v_j1 := $evfdir_json${"external_id":"fdir-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso: inicio de venetoclax en LLC, lisis tumoral e interacciones CYP3A4","outcome":"Caso: inicio de venetoclax en LLC, lisis tumoral e interacciones CYP3A4","source":"Ficha técnica de venetoclax."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No hay interacción, porque el posaconazol actúa solo sobre los hongos.', FALSE, 'El posaconazol inhibe con potencia el CYP3A4.', 0),
      (v_pregunta, 'El posaconazol reduce los niveles de venetoclax y hay que aumentar su dosis.', FALSE, 'Ocurre lo contrario.', 1),
      (v_pregunta, 'Es un inhibidor potente del CYP3A4: eleva el venetoclax y el riesgo de lisis tumoral; la ficha técnica lo restringe en la escalada.', TRUE, 'Correcto. Se ajusta o se cambia según la ficha técnica.', 2),
      (v_pregunta, 'La combinación es segura si se toman con 12 horas de diferencia.', FALSE, 'Separar las tomas no evita la inhibición enzimática.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Para reducir costos, alguien propone tratar un melanoma BRAF V600E solo con un inhibidor de BRAF, sin el inhibidor de MEK. ¿Cuál es la mejor valoración?';
    v_t4 := 'Los inhibidores de BRAF en monoterapia pueden activar de forma paradójica la vía MAPK en células sin la mutación, con lesiones cutáneas como queratoacantomas y carcinomas escamosos. La combinación BRAF+MEK es más eficaz y reduce ese efecto; su toxicidad característica incluye la pirexia.';
    v_j1 := $evfdir_json${"external_id":"fdir-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Inhibidores de BRAF/MEK en melanoma y otros tumores BRAF V600E","outcome":"Inhibidores de BRAF/MEK en melanoma y otros tumores BRAF V600E","source":"Fichas técnicas de los inhibidores de BRAF y MEK."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es inadecuada: la combinación BRAF+MEK es más eficaz y reduce la activación paradójica de la vía.', TRUE, 'Correcto. La monoterapia con BRAF causa más lesiones cutáneas.', 0),
      (v_pregunta, 'Es adecuada, porque el inhibidor de MEK no aporta ningún beneficio clínico al de BRAF.', FALSE, 'La combinación mejora la eficacia y la seguridad cutánea.', 1),
      (v_pregunta, 'Es adecuada si se usa el inhibidor de BRAF a doble dosis para compensar la falta del inhibidor de MEK.', FALSE, 'Subir la dosis no reemplaza la combinación.', 2),
      (v_pregunta, 'Es inadecuada solo porque el inhibidor de BRAF se usa siempre por vía intravenosa.', FALSE, 'Los inhibidores de BRAF y de MEK son medicamentos orales.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fdir-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Seguridad: toxicidades, interacciones, adherencia y resistencia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Seguridad: toxicidades, interacciones, adherencia y resistencia) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Seguridad: toxicidades, interacciones, adherencia y resistencia';
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


    v_t3 := '¿Qué medidas se usan para prevenir el rash acneiforme por anti-EGFR?';
    v_t4 := 'El rash acneiforme por anti-EGFR (cetuximab, panitumumab y algunos ITK) se previene con emolientes, protección solar y, con frecuencia, una tetraciclina oral (doxiciclina o minociclina) profiláctica; se gradúa con CTCAE. Los tratamientos del acné común pueden irritar.';
    v_j1 := $evfdir_json${"external_id":"fdir-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Toxicidad dermatológica y gastrointestinal: rash acneiforme, mano-pie y diarrea","outcome":"Toxicidad dermatológica y gastrointestinal: rash acneiforme, mano-pie y diarrea","source":"Fichas técnicas de cetuximab y panitumumab."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Peróxido de benzoílo y retinoides tópicos a diario, como en el acné común del adolescente.', FALSE, 'Pueden irritar la piel y empeorar el cuadro.', 0),
      (v_pregunta, 'Suspender el anti-EGFR desde el primer día para que nunca aparezca ninguna lesión.', FALSE, 'El rash se maneja sin suspender en la mayoría de casos.', 1),
      (v_pregunta, 'Hidratación de la piel, protección solar y, a menudo, una tetraciclina oral profiláctica.', TRUE, 'Correcto. Según el protocolo y la ficha técnica.', 2),
      (v_pregunta, 'Baños con agua muy caliente varias veces al día para limpiar los poros de la piel.', FALSE, 'El agua caliente reseca e irrita la piel.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con dasatinib toma omeprazol diario por acidez. ¿Qué le propone el QF?';
    v_t4 := 'La absorción de varios ITK, como el dasatinib, depende del pH gástrico. La ficha técnica del dasatinib desaconseja los inhibidores de la bomba de protones y los antagonistas H2, y permite antiácidos separados al menos 2 horas antes o después.';
    v_j1 := $evfdir_json${"external_id":"fdir-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Interacciones por CYP3A4, P-gp, pH gástrico (antiácidos/IBP) y alimentos","outcome":"Interacciones por CYP3A4, P-gp, pH gástrico (antiácidos/IBP) y alimentos","source":"Ficha técnica de dasatinib."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Evitar el IBP, que reduce la absorción del dasatinib, y usar un antiácido separado según la ficha técnica.', TRUE, 'Correcto. La absorción del dasatinib depende del pH.', 0),
      (v_pregunta, 'Tomar el omeprazol junto con el dasatinib para proteger el estómago del medicamento.', FALSE, 'Tomarlos juntos reduce mucho la absorción.', 1),
      (v_pregunta, 'Duplicar el dasatinib mientras use el omeprazol para compensar la menor absorción.', FALSE, 'No se compensa cambiando la dosis por cuenta propia.', 2),
      (v_pregunta, 'Cambiar el omeprazol por una tetraciclina, que también controla la acidez.', FALSE, 'Las tetraciclinas no controlan la acidez.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con leucemia mieloide crónica pierde la respuesta molecular al dasatinib. Toma omeprazol, usa hipérico y retira el medicamento cada 45 días aunque es para 30. ¿Qué análisis es correcto?';
    v_t4 := 'Antes de asumir una resistencia molecular, se descartan causas farmacológicas: falta de adherencia (aquí, retiros que sugieren una adherencia cercana al 67 %), reducción de la absorción por IBP y aumento del metabolismo por inductores como el hipérico. Si persiste la pérdida de respuesta, se estudian mutaciones de resistencia.';
    v_j1 := $evfdir_json${"external_id":"fdir-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso: pérdida de respuesta a dasatinib por IBP, hipérico y falta de adherencia","outcome":"Caso: pérdida de respuesta a dasatinib por IBP, hipérico y falta de adherencia","source":"Ficha técnica de dasatinib."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una resistencia molecular segura y debe cambiarse de inmediato a otro ITK sin necesidad de más análisis.', FALSE, 'Primero se descartan causas farmacológicas.', 0),
      (v_pregunta, 'Antes de asumir resistencia se corrigen la adherencia, el IBP y el hipérico, que reducen la exposición.', TRUE, 'Correcto. Luego se reevalúa la respuesta.', 1),
      (v_pregunta, 'El hipérico potencia al dasatinib, por eso la respuesta es mejor de lo que parece.', FALSE, 'El hipérico es un inductor que reduce la exposición.', 2),
      (v_pregunta, 'La pérdida de respuesta se debe solo a la edad y no a los medicamentos.', FALSE, 'Hay causas farmacológicas evidentes.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con leucemia mieloide crónica tiene la mutación T315I. Alguien propone cambiar de imatinib a dasatinib. ¿Cuál es la mejor valoración?';
    v_t4 := 'La mutación T315I del dominio cinasa de BCR-ABL confiere resistencia al imatinib y a los ITK de segunda generación (dasatinib, nilotinib, bosutinib). Las opciones activas frente a ella incluyen el ponatinib y el asciminib, según el especialista.';
    v_j1 := $evfdir_json${"external_id":"fdir-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Mecanismos de resistencia a las terapias dirigidas","outcome":"Mecanismos de resistencia a las terapias dirigidas","source":"Fichas técnicas de los ITK de BCR-ABL."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuada, porque todos los ITK de segunda generación superan cualquier mutación de resistencia que aparezca en BCR-ABL.', FALSE, 'La T315I resiste a la mayoría de los ITK de primera y segunda generación.', 0),
      (v_pregunta, 'Es adecuada si se usa el dasatinib a doble dosis para vencer la mutación.', FALSE, 'Subir la dosis no supera la T315I.', 1),
      (v_pregunta, 'Es inadecuada solo porque el dasatinib nunca puede usarse después del imatinib.', FALSE, 'El dasatinib se usa tras el imatinib en otras situaciones.', 2),
      (v_pregunta, 'Es inadecuada: la T315I confiere resistencia a la mayoría de los ITK; se requieren opciones activas frente a ella.', TRUE, 'Correcto. Como el ponatinib o el asciminib, según el especialista.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fdir-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Acceso en Colombia y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Acceso en Colombia y casos integradores) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Acceso en Colombia y casos integradores';
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


    v_t3 := '¿Cómo se prescribe en Colombia una terapia dirigida que no está financiada con la UPC?';
    v_t4 := 'En Colombia las tecnologías incluidas en el Plan de Beneficios se financian con la UPC; las no financiadas se prescriben mediante MIPRES y se financian por presupuestos máximos. El QF verifica la prescripción, gestiona la continuidad del suministro y reporta a la Cuenta de Alto Costo cuando corresponde.';
    v_j1 := $evfdir_json${"external_id":"fdir-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"PBS, MIPRES, presupuestos máximos y Cuenta de Alto Costo","outcome":"PBS, MIPRES, presupuestos máximos y Cuenta de Alto Costo","source":"Normativa del Plan de Beneficios en Salud y MIPRES."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Con una fórmula común, porque todas las terapias dirigidas están incluidas en el Plan de Beneficios.', FALSE, 'No todas están financiadas con la UPC.', 0),
      (v_pregunta, 'El paciente debe comprarla siempre en una droguería, porque el sistema no la cubre.', FALSE, 'Existe una vía de financiación en el sistema.', 1),
      (v_pregunta, 'Mediante la herramienta MIPRES, con financiación por presupuestos máximos.', TRUE, 'Correcto. El QF acompaña la gestión.', 2),
      (v_pregunta, 'Mediante una tutela obligatoria antes de cualquier otra gestión con la EPS.', FALSE, 'La tutela no es la vía ordinaria.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente con trastuzumab cambia a un biosimilar. ¿Qué registro debe asegurar el QF?';
    v_t4 := 'Los biosimilares demuestran comparabilidad con el producto de referencia. Para la farmacovigilancia de los biológicos se registran la marca comercial y el lote en cada dispensación, de modo que los eventos puedan atribuirse al producto correcto. El Decreto 1782 de 2014 regula la evaluación de los medicamentos biológicos en Colombia.';
    v_j1 := $evfdir_json${"external_id":"fdir-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Biosimilares de trastuzumab, rituximab y bevacizumab, y regulación de precios","outcome":"Biosimilares de trastuzumab, rituximab y bevacizumab, y regulación de precios","source":"Decreto 1782 de 2014; fichas técnicas."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Ninguno especial, porque el biosimilar y el innovador son exactamente el mismo producto.', FALSE, 'Son comparables, pero la trazabilidad es necesaria.', 0),
      (v_pregunta, 'Solo el nombre genérico, porque la marca y el lote no tienen ninguna importancia clínica ni regulatoria.', FALSE, 'La marca y el lote son clave para la farmacovigilancia.', 1),
      (v_pregunta, 'Solo la fecha del cambio, porque los biosimilares no requieren farmacovigilancia.', FALSE, 'Los biológicos requieren farmacovigilancia por marca.', 2),
      (v_pregunta, 'La marca comercial y el lote en cada dispensación, para la trazabilidad y la farmacovigilancia.', TRUE, 'Correcto. Así se atribuyen los eventos al producto correcto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una paciente con ribociclib y letrozol inicia ondansetrón y tiene un hemograma con neutrófilos de 900/µL antes del siguiente ciclo. ¿Qué análisis hace el QF?';
    v_t4 := 'El ribociclib produce neutropenia y prolongación del QT; su ficha técnica define interrupciones y reducciones de dosis según el recuento de neutrófilos y pide ECG, evitando otros fármacos que prolongan el QT (como el ondansetrón). El QF programa los controles y comunica al oncólogo.';
    v_j1 := $evfdir_json${"external_id":"fdir-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso: cáncer de mama RH+/HER2- con ribociclib y un nuevo antiemético","outcome":"Caso: cáncer de mama RH+/HER2- con ribociclib y un nuevo antiemético","source":"Ficha técnica de ribociclib."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Hay dos alertas: riesgo de QT con el ondansetrón y neutropenia que la ficha técnica maneja con interrupción o ajuste.', TRUE, 'Correcto. Se comunica al oncólogo.', 0),
      (v_pregunta, 'No hay ninguna alerta, porque la neutropenia es esperada y nunca cambia el tratamiento.', FALSE, 'La ficha técnica define ajustes por neutropenia.', 1),
      (v_pregunta, 'El único problema es el letrozol, que causa neutropenia en la mayoría de pacientes.', FALSE, 'La neutropenia se asocia al inhibidor de CDK4/6.', 2),
      (v_pregunta, 'Se debe duplicar el ribociclib para compensar la menor eficacia por la neutropenia.', FALSE, 'Subir la dosis empeoraría la neutropenia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En un servicio dicen que con el biosimilar de trastuzumab «ya no hace falta vigilar la fracción de eyección porque es un producto distinto». ¿Cuál es la mejor valoración?';
    v_t4 := 'Un biosimilar de trastuzumab es comparable en eficacia y seguridad al producto de referencia, incluido el riesgo de disfunción ventricular; se mantiene la vigilancia de la fracción de eyección y de las reacciones a la infusión, con trazabilidad por marca y lote.';
    v_j1 := $evfdir_json${"external_id":"fdir-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: cáncer de mama HER2+ con cambio a biosimilar de trastuzumab","outcome":"Caso: cáncer de mama HER2+ con cambio a biosimilar de trastuzumab","source":"Fichas técnicas de trastuzumab y sus biosimilares."}$evfdir_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fdir-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta, porque los biosimilares no tienen las toxicidades del producto de referencia.', FALSE, 'Comparten el perfil de seguridad.', 0),
      (v_pregunta, 'Es errada: el biosimilar comparte el perfil de seguridad; se mantiene la vigilancia de la fracción de eyección.', TRUE, 'Correcto. La vigilancia no cambia con el producto.', 1),
      (v_pregunta, 'Es correcta si la paciente ya recibió más de seis ciclos con el producto innovador.', FALSE, 'El tiempo previo no elimina el riesgo.', 2),
      (v_pregunta, 'Es errada solo porque el biosimilar se debe administrar siempre por vía subcutánea.', FALSE, 'El problema es la vigilancia, no la vía.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fdir-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Medicina de precisión y biomarcadores en oncología' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Medicina de precisión y biomarcadores en oncología) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Cáncer de pulmón sin perfil molecular completo';
  v_t2 := $evfdir_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Identifica los biomarcadores que faltan y explica por qué su perfil clínico hace probable una alteración dirigible.</li><li>Explica qué cambiaría si se encontrara una mutación de EGFR (incluida la actividad en el SNC).</li><li>Propone la ruta para obtener el perfil (panel de secuenciación, biopsia líquida) y cómo acelerar la autorización.</li><li>Analiza los riesgos de iniciar la inmunoterapia antes del resultado.</li><li>Redacta la comunicación al oncólogo.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar los biomarcadores que faltan y su impacto en el tratamiento.</li><li>Proponer una ruta para obtener el perfil molecular.</li><li>Comunicar al oncólogo los riesgos de iniciar sin perfil.</li></ul>
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
  <tr><td>Biomarcadores</td><td>25 %</td><td>Identifica EGFR, ALK, ROS1, BRAF y otros, y relaciona el perfil de no fumador con mayor probabilidad.</td><td>Identificación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Impacto clínico</td><td>25 %</td><td>Explica el cambio a un ITK con actividad en el SNC si hay EGFR y el riesgo de iniciar inmunoterapia antes.</td><td>Explicación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Ruta molecular</td><td>30 %</td><td>Propone panel de secuenciación, biopsia líquida y gestión de tiempos con la EPS.</td><td>Propuesta incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación</td><td>10 %</td><td>Comunicación clara al oncólogo.</td><td>Comunicación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfdir_html$;
  v_t3 := $evfdir_html$<h2>Caso de estudio</h2>
<p>Don Gilberto tiene 61 años, nunca fumó y tiene un adenocarcinoma de pulmón estadio IV con metástasis cerebrales pequeñas, ECOG 1 (datos simulados). Le prescriben quimioterapia con pembrolizumab. En la historia solo aparece el PD-L1 (TPS 20 %); no hay resultados de EGFR, ALK, ROS1 ni BRAF. La biopsia fue pequeña. Su EPS tarda tres semanas en autorizar las pruebas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfdir_html$;
  v_t4 := 'Informe con propuesta de ruta molecular y comunicación al oncólogo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfdir_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (trastuzumab, pertuzumab, trastuzumab deruxtecán, cetuximab, panitumumab, bevacizumab, rituximab, imatinib, dasatinib, osimertinib, inhibidores de BRAF/MEK, inhibidores de CDK4/6, venetoclax); Decreto 1782 de 2014 (medicamentos biológicos); normativa del Plan de Beneficios en Salud y MIPRES; criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfdir_html$;
  v_t7 := NULL;
  v_j1 := $evfdir_json$["Biomarcadores faltantes.","Impacto de una alteración dirigible.","Ruta para el perfil.","Riesgos de iniciar sin perfil.","Comunicación."]$evfdir_json$::jsonb;
  v_j2 := $evfdir_json${"version":1,"total":100,"criteria":[{"id":"biomarcadores","name":"Biomarcadores","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Identifica EGFR, ALK, ROS1, BRAF y otros, y relaciona el perfil de no fumador con mayor probabilidad."},{"level":3,"label":"Logrado","description":"Identificación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"impacto-clinico","name":"Impacto clínico","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica el cambio a un ITK con actividad en el SNC si hay EGFR y el riesgo de iniciar inmunoterapia antes."},{"level":3,"label":"Logrado","description":"Explicación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ruta-molecular","name":"Ruta molecular","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Propone panel de secuenciación, biopsia líquida y gestión de tiempos con la EPS."},{"level":3,"label":"Logrado","description":"Propuesta incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion","name":"Comunicación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Comunicación clara al oncólogo."},{"level":3,"label":"Logrado","description":"Comunicación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfdir_json$::jsonb;
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


  -- ── Actividad fdir-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Anticuerpos monoclonales dirigidos y conjugados anticuerpo-fármaco' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Anticuerpos monoclonales dirigidos y conjugados anticuerpo-fármaco) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Sospecha de neumonitis con trastuzumab deruxtecán';
  v_t2 := $evfdir_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Explica qué es el trastuzumab deruxtecán y por qué puede causar enfermedad pulmonar intersticial.</li><li>Relaciona los síntomas de la paciente con esa toxicidad.</li><li>Define qué haría el servicio farmacéutico con el ciclo programado y cómo comunicarlo al oncólogo.</li><li>Describe el manejo según el grado de la ficha técnica.</li><li>Define el reporte al INVIMA y la educación sobre los signos de alarma.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Reconocer la posible enfermedad pulmonar intersticial por el conjugado.</li><li>Actuar de forma coordinada con el equipo oncológico.</li><li>Reportar y educar a la paciente.</li></ul>
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
  <tr><td>Reconocimiento</td><td>25 %</td><td>Relaciona tos y disnea con posible enfermedad pulmonar intersticial por T-DXd.</td><td>Lo menciona sin justificar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Conducta</td><td>35 %</td><td>No prepara ni dispensa el ciclo hasta la evaluación y comunica de inmediato al oncólogo.</td><td>Comunica sin detener el ciclo.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Manejo y reporte</td><td>30 %</td><td>Describe el manejo por grado y el reporte al INVIMA con educación.</td><td>Manejo o reporte incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfdir_html$;
  v_t3 := $evfdir_html$<h2>Caso de estudio</h2>
<p>Doña Beatriz tiene 56 años y un cáncer de mama HER2-bajo metastásico (datos simulados). Recibe trastuzumab deruxtecán desde hace cuatro meses. Al recoger su premedicación cuenta que tiene tos seca y que se cansa al subir escaleras desde hace 10 días, sin fiebre. Su siguiente ciclo es en dos días. Tomó un jarabe para la tos que le recomendaron en la droguería.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfdir_html$;
  v_t4 := 'Informe de intervención con comunicación al oncólogo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfdir_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (trastuzumab, pertuzumab, trastuzumab deruxtecán, cetuximab, panitumumab, bevacizumab, rituximab, imatinib, dasatinib, osimertinib, inhibidores de BRAF/MEK, inhibidores de CDK4/6, venetoclax); Decreto 1782 de 2014 (medicamentos biológicos); normativa del Plan de Beneficios en Salud y MIPRES; criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfdir_html$;
  v_t7 := NULL;
  v_j1 := $evfdir_json$["Mecanismo y riesgo.","Relación con los síntomas.","Conducta con el ciclo.","Manejo según el grado.","Reporte y educación."]$evfdir_json$::jsonb;
  v_j2 := $evfdir_json${"version":1,"total":100,"criteria":[{"id":"reconocimiento","name":"Reconocimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Relaciona tos y disnea con posible enfermedad pulmonar intersticial por T-DXd."},{"level":3,"label":"Logrado","description":"Lo menciona sin justificar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"conducta","name":"Conducta","weight":35,"levels":[{"level":4,"label":"Destacado","description":"No prepara ni dispensa el ciclo hasta la evaluación y comunica de inmediato al oncólogo."},{"level":3,"label":"Logrado","description":"Comunica sin detener el ciclo."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"manejo-y-reporte","name":"Manejo y reporte","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Describe el manejo por grado y el reporte al INVIMA con educación."},{"level":3,"label":"Logrado","description":"Manejo o reporte incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfdir_json$::jsonb;
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


  -- ── Actividad fdir-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Seguridad: toxicidades, interacciones, adherencia y resistencia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Seguridad: toxicidades, interacciones, adherencia y resistencia) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Pérdida de respuesta a un ITK: causas farmacológicas';
  v_t2 := $evfdir_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Estima la adherencia con los registros de dispensación.</li><li>Analiza la interacción del omeprazol con el dasatinib y cómo resolverla.</li><li>Analiza el hipérico y su efecto sobre el dasatinib.</li><li>Propone un plan de adherencia adaptado a sus turnos.</li><li>Explica cuándo estaría indicada la búsqueda de mutaciones de resistencia.</li><li>Redacta la comunicación al hematólogo.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar las causas farmacológicas de la pérdida de respuesta.</li><li>Proponer correcciones según la ficha técnica.</li><li>Diseñar un plan de adherencia y seguimiento.</li></ul>
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
  <tr><td>Adherencia</td><td>20 %</td><td>Estima una adherencia cercana al 67 % y la relaciona con la pérdida de respuesta.</td><td>Estimación sin interpretación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones</td><td>35 %</td><td>Explica el IBP (pH) y el hipérico (inducción) con propuestas según la ficha técnica.</td><td>Explica una de las dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan y reevaluación</td><td>35 %</td><td>Plan de adherencia concreto y criterio para la reevaluación molecular tras corregir.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfdir_html$;
  v_t3 := $evfdir_html$<h2>Caso de estudio</h2>
<p>Don Fabio tiene 54 años y leucemia mieloide crónica tratada con dasatinib (datos simulados). Tenía respuesta molecular mayor y en el último control la perdió. Toma omeprazol 40 mg en la mañana junto con el dasatinib, usa hipérico «para el ánimo» desde hace tres meses y sus retiros en la farmacia son cada 45 días aunque se le entrega para 30. Trabaja en turnos rotativos y dice que «a veces no se acuerda».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfdir_html$;
  v_t4 := 'Informe de análisis con comunicación al hematólogo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfdir_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (trastuzumab, pertuzumab, trastuzumab deruxtecán, cetuximab, panitumumab, bevacizumab, rituximab, imatinib, dasatinib, osimertinib, inhibidores de BRAF/MEK, inhibidores de CDK4/6, venetoclax); Decreto 1782 de 2014 (medicamentos biológicos); normativa del Plan de Beneficios en Salud y MIPRES; criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfdir_html$;
  v_t7 := NULL;
  v_j1 := $evfdir_json$["Adherencia.","IBP.","Hipérico.","Plan de adherencia.","Reevaluación molecular."]$evfdir_json$::jsonb;
  v_j2 := $evfdir_json${"version":1,"total":100,"criteria":[{"id":"adherencia","name":"Adherencia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Estima una adherencia cercana al 67 % y la relaciona con la pérdida de respuesta."},{"level":3,"label":"Logrado","description":"Estimación sin interpretación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones","name":"Interacciones","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Explica el IBP (pH) y el hipérico (inducción) con propuestas según la ficha técnica."},{"level":3,"label":"Logrado","description":"Explica una de las dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-y-reevaluacion","name":"Plan y reevaluación","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Plan de adherencia concreto y criterio para la reevaluación molecular tras corregir."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfdir_json$::jsonb;
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


  -- ── Actividad fdir-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Inhibidores de tirosina cinasa y otras moléculas pequeñas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Inhibidores de tirosina cinasa y otras moléculas pequeñas) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: biomarcadores, anticuerpos y moléculas pequeñas en el tratamiento de Doña Rosa';
  v_t2 := $evfdir_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y explica cómo se confirma un HER2 positivo y qué opciones abre.</li><li>Fase 2: diseña la vigilancia de la fracción de eyección con trastuzumab y pertuzumab tras antraciclinas.</li><li>Fase 2: explica la toxicidad pulmonar del trastuzumab deruxtecán y qué educación necesitaría.</li><li>Fase 3: revisa las interacciones de un posible ITK anti-HER2 con su fórmula (consulta la ficha técnica) y el suplemento.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (biomarcadores).</strong> Interpretación del HER2 y de las pruebas que orientan el tratamiento.</li>
  <li><strong>Fase 2 · Unidad 2 (anticuerpos y conjugados).</strong> Vigilancia cardiaca y riesgos de un posible conjugado.</li>
  <li><strong>Fase 3 · Unidad 3 (moléculas pequeñas).</strong> Interacciones de un posible ITK con su fórmula.</li>
  <li><strong>Fase 4 · Unidad 4 (seguridad).</strong> Plan de toxicidades, interacciones y adherencia.</li>
  <li><strong>Fase 5 · Unidad 5 (acceso).</strong> Cambio a biosimilar, trazabilidad, acceso y farmacovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Interpretar los biomarcadores y la vigilancia de los anticuerpos anti-HER2.</li><li>Anticipar los riesgos de las siguientes líneas.</li></ul>
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
  <tr><td>Biomarcadores</td><td>20 %</td><td>Explica la confirmación de HER2 (3+ o ISH) y las opciones que abre.</td><td>Explicación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vigilancia cardiaca</td><td>30 %</td><td>Plan de fracción de eyección con mayor riesgo por antraciclinas previas.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Conjugado e ITK</td><td>40 %</td><td>Explica la neumonitis por T-DXd y revisa interacciones del ITK con omeprazol, fluoxetina y el suplemento según la ficha técnica.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfdir_html$;
  v_t3 := $evfdir_html$<h2>Caso de estudio</h2>
<p>Doña Rosa tiene 58 años y un cáncer de mama HER2 positivo metastásico (datos simulados). Recibió antraciclinas hace años, ahora recibe trastuzumab y pertuzumab con un taxano, y su fracción de eyección es de 55 %. Toma omeprazol, un suplemento de hierbas y, por depresión, fluoxetina. Su EPS cambiará el trastuzumab por un biosimilar. Si progresa, el oncólogo considera trastuzumab deruxtecán o un ITK anti-HER2. Eres el QF responsable del programa de terapias dirigidas. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfdir_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfdir_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (trastuzumab, pertuzumab, trastuzumab deruxtecán, cetuximab, panitumumab, bevacizumab, rituximab, imatinib, dasatinib, osimertinib, inhibidores de BRAF/MEK, inhibidores de CDK4/6, venetoclax); Decreto 1782 de 2014 (medicamentos biológicos); normativa del Plan de Beneficios en Salud y MIPRES; criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfdir_html$;
  v_t7 := NULL;
  v_j1 := $evfdir_json$["HER2.","Vigilancia cardiaca.","Conjugado.","Interacciones del ITK."]$evfdir_json$::jsonb;
  v_j2 := $evfdir_json${"version":1,"total":100,"criteria":[{"id":"biomarcadores","name":"Biomarcadores","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Explica la confirmación de HER2 (3+ o ISH) y las opciones que abre."},{"level":3,"label":"Logrado","description":"Explicación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vigilancia-cardiaca","name":"Vigilancia cardiaca","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Plan de fracción de eyección con mayor riesgo por antraciclinas previas."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"conjugado-e-itk","name":"Conjugado e ITK","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Explica la neumonitis por T-DXd y revisa interacciones del ITK con omeprazol, fluoxetina y el suplemento según la ficha técnica."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfdir_json$::jsonb;
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


  -- ── Actividad fdir-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Acceso en Colombia y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Acceso en Colombia y casos integradores) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan integral de terapias dirigidas de Doña Rosa';
  v_t2 := $evfdir_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: diseña el plan de toxicidades (cardiaca, pulmonar, digestiva), interacciones y adherencia.</li><li>Fase 5: planea el cambio a biosimilar (información a la paciente, trazabilidad por marca y lote, vigilancia).</li><li>Fase 5: describe la ruta de acceso de las siguientes líneas y la farmacovigilancia.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (biomarcadores).</strong> Interpretación del HER2 y de las pruebas que orientan el tratamiento.</li>
  <li><strong>Fase 2 · Unidad 2 (anticuerpos y conjugados).</strong> Vigilancia cardiaca y riesgos de un posible conjugado.</li>
  <li><strong>Fase 3 · Unidad 3 (moléculas pequeñas).</strong> Interacciones de un posible ITK con su fórmula.</li>
  <li><strong>Fase 4 · Unidad 4 (seguridad).</strong> Plan de toxicidades, interacciones y adherencia.</li>
  <li><strong>Fase 5 · Unidad 5 (acceso).</strong> Cambio a biosimilar, trazabilidad, acceso y farmacovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar el plan de seguridad y adherencia.</li><li>Gestionar el cambio a biosimilar, el acceso y la farmacovigilancia.</li></ul>
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
  <tr><td>Seguridad y adherencia</td><td>25 %</td><td>Plan de toxicidades por órgano, interacciones y adherencia.</td><td>Plan incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Biosimilar</td><td>25 %</td><td>Información, trazabilidad por marca y lote y continuidad de la vigilancia.</td><td>Aborda la mitad.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acceso y farmacovigilancia</td><td>25 %</td><td>Ruta de acceso clara y reporte con trazabilidad.</td><td>Ruta general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfdir_html$;
  v_t3 := $evfdir_html$<h2>Caso de estudio</h2>
<p>Doña Rosa tiene 58 años y un cáncer de mama HER2 positivo metastásico (datos simulados). Recibió antraciclinas hace años, ahora recibe trastuzumab y pertuzumab con un taxano, y su fracción de eyección es de 55 %. Toma omeprazol, un suplemento de hierbas y, por depresión, fluoxetina. Su EPS cambiará el trastuzumab por un biosimilar. Si progresa, el oncólogo considera trastuzumab deruxtecán o un ITK anti-HER2. Eres el QF responsable del programa de terapias dirigidas. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité del programa.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfdir_html$;
  v_t4 := 'Plan integral con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfdir_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (trastuzumab, pertuzumab, trastuzumab deruxtecán, cetuximab, panitumumab, bevacizumab, rituximab, imatinib, dasatinib, osimertinib, inhibidores de BRAF/MEK, inhibidores de CDK4/6, venetoclax); Decreto 1782 de 2014 (medicamentos biológicos); normativa del Plan de Beneficios en Salud y MIPRES; criterios CTCAE; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfdir_html$;
  v_t7 := NULL;
  v_j1 := $evfdir_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Plan de seguridad.","Biosimilar.","Acceso y farmacovigilancia.","Resumen ejecutivo."]$evfdir_json$::jsonb;
  v_j2 := $evfdir_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguridad-y-adherencia","name":"Seguridad y adherencia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan de toxicidades por órgano, interacciones y adherencia."},{"level":3,"label":"Logrado","description":"Plan incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"biosimilar","name":"Biosimilar","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Información, trazabilidad por marca y lote y continuidad de la vigilancia."},{"level":3,"label":"Logrado","description":"Aborda la mitad."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acceso-y-farmacovigilancia","name":"Acceso y farmacovigilancia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Ruta de acceso clara y reporte con trazabilidad."},{"level":3,"label":"Logrado","description":"Ruta general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfdir_json$::jsonb;
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


  -- ── Foro fdir-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con terapias dirigidas';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfdir_html$<h2>Para empezar</h2>
<p>Piensa en un paciente con una terapia dirigida (un anticuerpo o un medicamento oral) que hayas atendido o del que hayas sabido, y cuéntanos en tres o cuatro líneas una duda o un problema que te llamó la atención, sin nombres ni datos que lo identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfdir_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre terapias dirigidas te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfdir_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfdir_html$;
  v_t6 := $evfdir_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfdir_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has gestionado algún medicamento oncológico por MIPRES?', '¿Qué interacción de un ITK oral te parece más difícil de detectar?']::text[];
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


  -- ── Foro fdir-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Medicina de precisión y biomarcadores en oncología' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Medicina de precisión y biomarcadores en oncología) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Perfil molecular completo antes de tratar';
  v_t2 := 'Argumentar por qué el perfil molecular debe estar completo antes de la primera línea y cómo reducir los tiempos.';
  v_t3 := $evfdir_html$<h2>Caso del foro</h2>
<p>En una unidad de oncología, el 40 % de los pacientes con cáncer de pulmón avanzado inicia tratamiento sin el perfil molecular completo (datos simulados). Las causas: tiempos de la EPS, poco tejido, falta de un panel de secuenciación y presión por iniciar.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfdir_html$;
  v_t4 := '¿Qué propondrías para que los pacientes tengan el perfil antes de iniciar sin retrasos peligrosos?';
  v_t5 := $evfdir_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación o la ficha técnica que sustenta tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfdir_html$;
  v_t6 := $evfdir_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o la ficha técnica que sustenta tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfdir_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué alteraciones deben estudiarse en el adenocarcinoma de pulmón?', '¿Qué papel tiene la biopsia líquida?', '¿Qué riesgos tiene iniciar inmunoterapia antes de conocer una alteración dirigible?']::text[];
  v_j1 := $evfdir_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o la ficha técnica que sustenta tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfdir_json$::jsonb;
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


  -- ── Foro fdir-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Anticuerpos monoclonales dirigidos y conjugados anticuerpo-fármaco' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Anticuerpos monoclonales dirigidos y conjugados anticuerpo-fármaco) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Anticuerpos y hepatitis B: el tamizaje que se olvida';
  v_t2 := 'Argumentar cómo asegurar el tamizaje de hepatitis B antes de los anticuerpos que pueden reactivarla.';
  v_t3 := $evfdir_html$<h2>Caso del foro</h2>
<p>Una unidad de hematología revisa 50 pacientes que iniciaron rituximab (datos simulados): 12 no tenían tamizaje de hepatitis B y uno presentó una hepatitis fulminante por reactivación. Los médicos dicen que «el laboratorio tarda» y que «la mayoría sale negativa».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfdir_html$;
  v_t4 := '¿Qué barrera propondrías para que ningún paciente inicie sin tamizaje?';
  v_t5 := $evfdir_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación que sustenta la barrera. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfdir_html$;
  v_t6 := $evfdir_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta la barrera.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfdir_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué pruebas se requieren y por qué no basta el antígeno de superficie?', '¿Qué profilaxis se usa si el anticuerpo anti-core es positivo?', '¿Qué otros medicamentos tienen este riesgo?']::text[];
  v_j1 := $evfdir_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta la barrera."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfdir_json$::jsonb;
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


  -- ── Foro fdir-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Inhibidores de tirosina cinasa y otras moléculas pequeñas' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Inhibidores de tirosina cinasa y otras moléculas pequeñas) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · ITK orales en casa: interacciones invisibles';
  v_t2 := 'Argumentar cómo detectar interacciones de los inhibidores de tirosina cinasa con medicamentos, alimentos y productos naturales.';
  v_t3 := $evfdir_html$<h2>Caso del foro</h2>
<p>Un programa de oncología oral revisa a 30 pacientes con ITK (datos simulados): varios toman omeprazol para la acidez, una toma jugo de toronja cada mañana, otro usa hipérico «para el ánimo» y uno recibió claritromicina de un médico general.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfdir_html$;
  v_t4 := '¿Cómo organizarías la detección y el manejo de estas interacciones?';
  v_t5 := $evfdir_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica que sustenta el manejo de cada interacción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfdir_html$;
  v_t6 := $evfdir_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica que sustenta el manejo de cada interacción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfdir_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué interacciones dependen del CYP3A4 y cuáles del pH gástrico?', '¿Qué productos naturales y alimentos son relevantes?', '¿Qué hacer cuando otro médico formula un medicamento que interactúa?']::text[];
  v_j1 := $evfdir_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica que sustenta el manejo de cada interacción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfdir_json$::jsonb;
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


  -- ── Foro fdir-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Seguridad: toxicidades, interacciones, adherencia y resistencia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Seguridad: toxicidades, interacciones, adherencia y resistencia) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · ¿Resistencia o falta de adherencia?';
  v_t2 := 'Argumentar cómo el seguimiento farmacoterapéutico ayuda a distinguir la resistencia molecular de las causas farmacológicas.';
  v_t3 := $evfdir_html$<h2>Caso del foro</h2>
<p>En una junta, tres pacientes con terapias dirigidas orales tienen pérdida de respuesta (datos simulados). El oncólogo propone cambiar de línea a los tres. El QF tiene los registros de dispensación, las interacciones detectadas y las notas de las entrevistas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfdir_html$;
  v_t4 := '¿Qué información aportaría el QF antes de decidir el cambio y por qué es importante?';
  v_t5 := $evfdir_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o el dato que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfdir_html$;
  v_t6 := $evfdir_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o el dato que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfdir_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Cómo se estima la adherencia con los registros de dispensación?', '¿Qué interacciones reducen la exposición a los ITK?', '¿Cuándo está indicada la reevaluación molecular?']::text[];
  v_j1 := $evfdir_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o el dato que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfdir_json$::jsonb;
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


  -- ── Foro fdir-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Acceso en Colombia y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Acceso en Colombia y casos integradores) en Terapias Dirigidas en Oncología: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Biosimilares y sostenibilidad';
  v_t2 := 'Argumentar cómo introducir biosimilares de anticuerpos oncológicos con seguridad y aceptación.';
  v_t3 := $evfdir_html$<h2>Caso del foro</h2>
<p>Una EPS anuncia el cambio a biosimilares de trastuzumab, rituximab y bevacizumab en todos sus pacientes (datos simulados). Algunas pacientes temen que «sean de menor calidad», un oncólogo exige mantener a quienes están en respuesta y el comité destaca el ahorro.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfdir_html$;
  v_t4 := '¿Qué condiciones propondrías para el cambio y cómo lo comunicarías a las pacientes?';
  v_t5 := $evfdir_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma, la ficha técnica o la evidencia que sustenta tus condiciones. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfdir_html$;
  v_t6 := $evfdir_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma, la ficha técnica o la evidencia que sustenta tus condiciones.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfdir_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué demuestra un biosimilar para obtener su registro?', '¿Qué trazabilidad y farmacovigilancia requiere el cambio?', '¿Cómo se manejan los cambios repetidos entre productos?']::text[];
  v_j1 := $evfdir_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma, la ficha técnica o la evidencia que sustenta tus condiciones."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfdir_json$::jsonb;
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


  RAISE NOTICE 'Terapias Dirigidas en Oncología: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfdir$;

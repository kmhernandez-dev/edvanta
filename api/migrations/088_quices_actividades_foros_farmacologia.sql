-- ============================================================
--  088_quices_actividades_foros_farmacologia.sql — quizzes, actividades y foros, lote «farmacologia»
--
--  Generado por scripts/evaluacion-aula.mjs farmacologia migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Farmacología Cardiovascular; Farmacología Endocrina; Farmacología del Sistema Nervioso Central.
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
--  Curso de Farmacología Cardiovascular
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfcv$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacología Cardiovascular' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos de la farmacología cardiovascular y riesgo cardiovascular en Colombia', 'Unidad 2. Farmacoterapia de la hipertensión arterial', 'Unidad 3. Insuficiencia cardiaca y cardiopatía isquémica', 'Unidad 4. Fármacos antiarrítmicos', 'Unidad 5. Dislipidemias, seguridad farmacológica e integración']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacología Cardiovascular: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfcv_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfcv_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fcv-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la farmacología cardiovascular y riesgo cardiovascular en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la farmacología cardiovascular y riesgo cardiovascular en Colombia) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos de la farmacología cardiovascular y riesgo cardiovascular en Colombia';
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


    v_t3 := '¿Cuál de estas condiciones forma parte de la técnica correcta para medir la presión arterial en consultorio?';
    v_t4 := 'La medición en consultorio exige un tensiómetro validado de brazo, manguito adecuado, 5 minutos de reposo sentado, espalda apoyada, piernas sin cruzar, brazo apoyado a la altura del corazón y no hablar. Se toman al menos dos lecturas separadas por un minuto y se promedian.';
    v_j1 := $evfcv_json${"external_id":"fcv-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Medición correcta de la presión arterial y educación al paciente","outcome":"Medición correcta de la presión arterial y educación al paciente","source":"Guía ESC 2024 de hipertensión, medición de la presión arterial."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Medir de pie, justo después de que el paciente llega caminando desde la calle, para ver la presión real del día.', FALSE, 'El paciente debe reposar sentado antes de la medición.', 0),
      (v_pregunta, 'Cinco minutos de reposo sentado, brazo apoyado a la altura del corazón y manguito del tamaño adecuado.', TRUE, 'Correcto. Se toman al menos dos lecturas y se promedian.', 1),
      (v_pregunta, 'Una sola lectura en la muñeca, sobre la ropa, mientras el paciente cuenta sus síntomas.', FALSE, 'Hablar y medir sobre la ropa alteran el resultado.', 2),
      (v_pregunta, 'Medir con las piernas cruzadas y el brazo colgando para relajar al paciente durante la toma.', FALSE, 'Las piernas cruzadas y el brazo sin apoyo elevan la cifra.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente del programa de riesgo cardiovascular toma losartán e hidroclorotiazida y compra ibuprofeno a diario por dolor de rodilla. ¿Qué propone el QF?';
    v_t4 := 'La combinación de un AINE con un bloqueador del sistema renina-angiotensina y un diurético aumenta el riesgo de lesión renal aguda y reduce el efecto antihipertensivo. Se evita el AINE y se busca una alternativa analgésica.';
    v_j1 := $evfcv_json${"external_id":"fcv-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso: paciente con HTA, DM2 y ERC en el programa de RCV","outcome":"Caso: paciente con HTA, DM2 y ERC en el programa de RCV","source":"Fichas técnicas de losartán e hidroclorotiazida."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que tome el ibuprofeno con leche para evitar la gastritis y continúe igual con todo lo demás.', FALSE, 'El riesgo principal aquí es renal, no gástrico.', 0),
      (v_pregunta, 'Que reemplace el ibuprofeno por naproxeno, que tiene una vida media más larga y además protege mejor el riñón.', FALSE, 'El naproxeno es otro AINE con el mismo riesgo.', 1),
      (v_pregunta, 'Que suspenda el losartán mientras tome el AINE, para que no se sumen los efectos.', FALSE, 'No se retira el antihipertensivo por cuenta propia.', 2),
      (v_pregunta, 'Explicar el riesgo de lesión renal de AINE con ARA-II y diurético, y proponer acetaminofén al médico.', TRUE, 'Correcto. Es la llamada «triple amenaza».', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En el programa de riesgo cardiovascular, un paciente dice que deja el antihipertensivo «cuando se siente bien» y lo retoma «cuando le duele la cabeza». ¿Qué análisis hace el QF?';
    v_t4 := 'La falta de adherencia puede ser intencional (creencias como «si me siento bien no lo necesito», miedo a los efectos) o no intencional (olvidos, acceso). La hipertensión suele ser asintomática; la intervención combina educación sin juicio, automedida y seguimiento.';
    v_j1 := $evfcv_json${"external_id":"fcv-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Programas de riesgo cardiovascular y adherencia terapéutica","outcome":"Programas de riesgo cardiovascular y adherencia terapéutica","source":"Guía AHA/ACC 2025; Resolución 1403 de 2007."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una falta de adherencia intencional basada en una creencia; se aborda con educación y seguimiento.', TRUE, 'Correcto. La hipertensión casi nunca da síntomas.', 0),
      (v_pregunta, 'Es un uso correcto, porque el dolor de cabeza es la mejor señal que tiene el paciente de que la presión subió.', FALSE, 'La presión alta suele ser asintomática.', 1),
      (v_pregunta, 'Es un problema de acceso, porque la EPS no le entrega el medicamento a tiempo.', FALSE, 'El relato apunta a una creencia, no al acceso.', 2),
      (v_pregunta, 'Es una reacción adversa al antihipertensivo que obliga a cambiarlo de inmediato.', FALSE, 'No describe ninguna reacción adversa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En el seguimiento, un paciente toma su losartán todos los días, pero su presión sigue alta porque consume naproxeno a diario. Un colega lo clasifica como «resultado negativo de necesidad». ¿Cuál es la mejor valoración?';
    v_t4 := 'Los resultados negativos asociados a la medicación se clasifican en necesidad (problema no tratado o medicamento innecesario), efectividad (el medicamento no logra el efecto) y seguridad (el medicamento causa daño). Un AINE que reduce el efecto del ARA-II produce un problema de efectividad.';
    v_j1 := $evfcv_json${"external_id":"fcv-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: paciente con HTA, DM2 y ERC en el programa de RCV","outcome":"Caso: paciente con HTA, DM2 y ERC en el programa de RCV","source":"Método Dáder; Resolución 1403 de 2007."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta, porque el paciente necesita un antihipertensivo adicional para llegar a la meta de presión arterial.', FALSE, 'Aún no se ha descartado la causa del mal control.', 0),
      (v_pregunta, 'Es correcta, porque toda presión fuera de meta se clasifica siempre como de necesidad.', FALSE, 'La clasificación depende de la causa.', 1),
      (v_pregunta, 'Es errada: es de efectividad, porque el medicamento no logra el efecto por la interacción con el AINE.', TRUE, 'Correcto. Se corrige la interacción antes de sumar fármacos.', 2),
      (v_pregunta, 'Es errada: es de seguridad, porque el naproxeno le causa un daño directo al paciente.', FALSE, 'El problema descrito es la falta de efecto.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fcv-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Farmacoterapia de la hipertensión arterial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Farmacoterapia de la hipertensión arterial) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Farmacoterapia de la hipertensión arterial';
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


    v_t3 := '¿Qué tienen en común los IECA y los ARA-II en cuanto a contraindicaciones?';
    v_t4 := 'IECA y ARA-II bloquean el sistema renina-angiotensina. Ambos están contraindicados en el segundo y tercer trimestre del embarazo, comparten el riesgo de hiperpotasemia y deterioro renal, y no deben combinarse entre sí (doble bloqueo). La tos es mucho menos frecuente con los ARA-II.';
    v_j1 := $evfcv_json${"external_id":"fcv-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"IECA y ARA-II: mecanismo, farmacocinética e indicaciones","outcome":"IECA y ARA-II: mecanismo, farmacocinética e indicaciones","source":"Fichas técnicas de enalapril y losartán."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Ambos están contraindicados en el segundo y tercer trimestre del embarazo y no se combinan entre sí.', TRUE, 'Correcto. Comparten el riesgo fetal y el doble bloqueo no se recomienda.', 0),
      (v_pregunta, 'Ambos están contraindicados en la diabetes tipo 2, porque elevan la glucosa en sangre.', FALSE, 'Al contrario: se prefieren en diabetes con albuminuria.', 1),
      (v_pregunta, 'Ambos se contraindican en la insuficiencia cardiaca porque deprimen la contractilidad.', FALSE, 'Son parte del tratamiento de la insuficiencia cardiaca.', 2),
      (v_pregunta, 'Ambos producen tos seca con la misma frecuencia, por eso uno no reemplaza al otro.', FALSE, 'La tos es mucho menos frecuente con los ARA-II.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con metoprolol para una angina recibe una nueva fórmula de verapamilo. ¿Qué advierte el QF al médico?';
    v_t4 := 'Los calcioantagonistas no dihidropiridínicos (verapamilo, diltiazem) reducen la frecuencia y la conducción cardiaca; combinados con betabloqueadores aumentan el riesgo de bradicardia y bloqueo auriculoventricular. Además se evitan en insuficiencia cardiaca con FE reducida. Son sustratos e inhibidores del CYP3A4.';
    v_j1 := $evfcv_json${"external_id":"fcv-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Calcioantagonistas dihidropiridínicos y no dihidropiridínicos","outcome":"Calcioantagonistas dihidropiridínicos y no dihidropiridínicos","source":"Fichas técnicas de verapamilo y diltiazem."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que el verapamilo produce edema maleolar con más frecuencia que el amlodipino.', FALSE, 'El edema es más típico de las dihidropiridinas.', 0),
      (v_pregunta, 'Que la combinación es la de elección porque ambos son vasodilatadores arteriales.', FALSE, 'El verapamilo actúa sobre todo en el corazón.', 1),
      (v_pregunta, 'Que el verapamilo con un betabloqueador aumenta el riesgo de bradicardia y bloqueo AV.', TRUE, 'Correcto. Ambos deprimen la frecuencia y la conducción.', 2),
      (v_pregunta, 'Que el verapamilo debe tomarse siempre en la noche para evitar la hipotensión ortostática matutina.', FALSE, 'El problema principal no es el horario.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer de 81 años que inició hidroclorotiazida hace tres semanas llega confundida y con náuseas; su sodio es de 124 mmol/L. ¿Qué análisis es correcto?';
    v_t4 := 'Las tiazidas pueden causar hiponatremia, hipopotasemia, hipomagnesemia, hiperuricemia y alteración de la glucosa. La hiponatremia es más frecuente en mujeres adultas mayores y en las primeras semanas; con síntomas exige evaluación médica. Por eso se monitorizan sodio, potasio, ácido úrico y glucosa.';
    v_j1 := $evfcv_json${"external_id":"fcv-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Tiazidas y diuréticos tipo tiazida como antihipertensivos","outcome":"Tiazidas y diuréticos tipo tiazida como antihipertensivos","source":"Ficha técnica de hidroclorotiazida."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una hipoglucemia por la tiazida y se corrige con una bebida azucarada.', FALSE, 'Los datos apuntan a una alteración del sodio.', 0),
      (v_pregunta, 'Es un efecto esperado al inicio que desaparece solo y no exige ninguna acción.', FALSE, 'Una hiponatremia con síntomas exige actuar.', 1),
      (v_pregunta, 'Es una hiperpotasemia por la tiazida y obliga a suspender el potasio de la dieta.', FALSE, 'Las tiazidas tienden a bajar el potasio, no a subirlo.', 2),
      (v_pregunta, 'Puede ser una hiponatremia por la tiazida, más frecuente en adultas mayores; se remite y se reevalúa.', TRUE, 'Correcto. La monitorización de sodio es parte del seguimiento.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente tuvo un angioedema de labios y lengua con enalapril. El médico propone cambiarlo por ramipril «porque es otra molécula». ¿Cuál es la mejor valoración?';
    v_t4 := 'El angioedema por IECA se relaciona con la acumulación de bradicinina; es un efecto de clase y contraindica volver a usar cualquier IECA. Antes de iniciar un ARNI se exige un lavado de 36 horas desde el último IECA. La reacción se reporta al Programa Nacional de Farmacovigilancia.';
    v_j1 := $evfcv_json${"external_id":"fcv-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Angioedema, tos e hiperpotasemia por bloqueo del SRAA","outcome":"Angioedema, tos e hiperpotasemia por bloqueo del SRAA","source":"Ficha técnica de enalapril; ficha técnica de sacubitrilo/valsartán."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una buena opción, porque el angioedema depende de la molécula y no del grupo.', FALSE, 'El mecanismo es común a los IECA.', 0),
      (v_pregunta, 'Es errada: el angioedema se relaciona con la bradicinina y contraindica cualquier IECA en adelante.', TRUE, 'Correcto. Se reporta y se elige otra clase con precaución.', 1),
      (v_pregunta, 'Es correcta si se inicia el ramipril a la mitad de la dosis habitual.', FALSE, 'Bajar la dosis no elimina el riesgo de un nuevo angioedema.', 2),
      (v_pregunta, 'Es correcta si el paciente toma un antihistamínico todos los días con el ramipril.', FALSE, 'El antihistamínico no previene este tipo de angioedema.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fcv-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Insuficiencia cardiaca y cardiopatía isquémica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Insuficiencia cardiaca y cardiopatía isquémica) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Insuficiencia cardiaca y cardiopatía isquémica';
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


    v_t3 := '¿Por qué se recomienda un intervalo libre de nitratos con los nitratos de acción prolongada?';
    v_t4 := 'Con la exposición continua a los nitratos aparece tolerancia y disminuye su efecto. Para prevenirla se programa un intervalo libre de nitratos cada día. Los nitratos están contraindicados con los inhibidores de la fosfodiesterasa 5 por riesgo de hipotensión grave.';
    v_j1 := $evfcv_json${"external_id":"fcv-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Nitratos: farmacocinética, tolerancia e interacciones","outcome":"Nitratos: farmacocinética, tolerancia e interacciones","source":"Guía ESC 2024 de síndromes coronarios crónicos; fichas técnicas de los nitratos."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Para prevenir la tolerancia, que reduce el efecto antianginoso con la exposición continua.', TRUE, 'Correcto. Por eso se dejan unas horas al día sin nitrato.', 0),
      (v_pregunta, 'Para que el hígado elimine el nitrato acumulado y no cause daño hepático.', FALSE, 'La razón no es la toxicidad hepática.', 1),
      (v_pregunta, 'Para permitir que el paciente use sildenafil en ese periodo sin riesgo.', FALSE, 'Nitratos e inhibidores de la PDE-5 no se combinan.', 2),
      (v_pregunta, 'Para evitar la bradicardia que producen los nitratos con el uso continuo.', FALSE, 'Los nitratos tienden a producir taquicardia refleja.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con dinitrato de isosorbida para la angina pide sildenafil para una disfunción eréctil. ¿Qué hace el QF?';
    v_t4 := 'Los inhibidores de la fosfodiesterasa 5 (sildenafil, tadalafilo, vardenafilo) potencian el efecto vasodilatador de los nitratos y pueden causar una hipotensión grave; la combinación está contraindicada.';
    v_j1 := $evfcv_json${"external_id":"fcv-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Nitratos: farmacocinética, tolerancia e interacciones","outcome":"Nitratos: farmacocinética, tolerancia e interacciones","source":"Fichas técnicas de los nitratos y del sildenafil."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Lo dispensa e indica separar las dosis por lo menos dos horas.', FALSE, 'Separar las dosis no evita la interacción.', 0),
      (v_pregunta, 'Lo dispensa a la mitad de la dosis habitual, porque así el riesgo desaparece.', FALSE, 'Bajar la dosis no elimina el riesgo.', 1),
      (v_pregunta, 'No lo dispensa y explica que la combinación puede causar una hipotensión grave; remite al médico.', TRUE, 'Correcto. Es una contraindicación.', 2),
      (v_pregunta, 'Le sugiere tadalafilo, porque a diferencia del sildenafil no tiene ninguna interacción con los nitratos.', FALSE, 'Todos los inhibidores de la PDE-5 comparten la contraindicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con digoxina inicia furosemida a dosis alta y, semanas después, tiene náuseas, inapetencia y palpitaciones. Su potasio es de 3,0 mmol/L y su creatinina subió. ¿Qué análisis es correcto?';
    v_t4 := 'La digoxina tiene un margen terapéutico estrecho. La hipopotasemia (por ejemplo, por diuréticos de asa), la insuficiencia renal y fármacos como la amiodarona o el verapamilo favorecen su toxicidad: náuseas, inapetencia, alteraciones visuales y arritmias.';
    v_j1 := $evfcv_json${"external_id":"fcv-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Diuréticos de asa, digoxina e ivabradina","outcome":"Diuréticos de asa, digoxina e ivabradina","source":"Ficha técnica de digoxina; guía ESC 2021 de insuficiencia cardiaca."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Son efectos digestivos esperados de la furosemida que se resuelven tomándola siempre con la comida.', FALSE, 'Los síntomas y los datos orientan a otra causa.', 0),
      (v_pregunta, 'Puede ser una toxicidad digitálica favorecida por la hipopotasemia y el deterioro renal.', TRUE, 'Correcto. Se remite y se mide la digoxinemia.', 1),
      (v_pregunta, 'Es una falta de efecto de la digoxina y conviene duplicar la dosis.', FALSE, 'Subir la dosis empeoraría una posible toxicidad.', 2),
      (v_pregunta, 'Es una reacción alérgica a la furosemida por ser una sulfonamida.', FALSE, 'El cuadro no corresponde a una alergia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente con insuficiencia cardiaca y FE reducida toma naproxeno por artrosis y pioglitazona por su diabetes. ¿Cuál es la mejor propuesta del QF?';
    v_t4 := 'Los AINE (incluidos los inhibidores de la COX-2) y las glitazonas como la pioglitazona retienen sodio y agua y pueden descompensar la insuficiencia cardiaca. También se evitan los calcioantagonistas no dihidropiridínicos en la FE reducida.';
    v_j1 := $evfcv_json${"external_id":"fcv-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Fármacos a evitar en IC y evidencia de costo-efectividad","outcome":"Fármacos a evitar en IC y evidencia de costo-efectividad","source":"Guía ESC 2021 de insuficiencia cardiaca."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Mantener ambos, porque mejoran el dolor y la glucosa sin afectar el corazón.', FALSE, 'Ambos pueden empeorar la insuficiencia cardiaca.', 0),
      (v_pregunta, 'Mantener la pioglitazona y cambiar el naproxeno por diclofenaco, que retiene menos líquido.', FALSE, 'El diclofenaco es otro AINE con el mismo problema.', 1),
      (v_pregunta, 'Suspender solo la pioglitazona, porque los AINE no tienen relación con la insuficiencia cardiaca.', FALSE, 'Los AINE retienen sodio y agua.', 2),
      (v_pregunta, 'Proponer retirar ambos: los AINE y las glitazonas retienen sodio y agua y empeoran la IC.', TRUE, 'Correcto. Se buscan alternativas para el dolor y la glucosa.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fcv-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Fármacos antiarrítmicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Fármacos antiarrítmicos) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Fármacos antiarrítmicos';
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


    v_t3 := 'En la clasificación de Vaughan-Williams, ¿qué hacen los antiarrítmicos de clase III, como la amiodarona y el sotalol?';
    v_t4 := 'Clase I: bloqueo de canales de sodio (por ejemplo, flecainida); clase II: betabloqueadores; clase III: bloqueo de canales de potasio, prolongan la repolarización (amiodarona, sotalol); clase IV: calcioantagonistas no dihidropiridínicos. La amiodarona tiene además acciones de las clases I, II y IV.';
    v_j1 := $evfcv_json${"external_id":"fcv-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Clases I a IV y otros antiarrítmicos (adenosina, digoxina)","outcome":"Clases I a IV y otros antiarrítmicos (adenosina, digoxina)","source":"Clasificación de Vaughan-Williams; ficha técnica de amiodarona."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Bloquean los canales de sodio y enlentecen la conducción en el tejido auricular y en el ventricular.', FALSE, 'Ese es el mecanismo principal de la clase I.', 0),
      (v_pregunta, 'Bloquean los receptores beta-adrenérgicos y reducen la frecuencia sinusal.', FALSE, 'Ese es el mecanismo de la clase II.', 1),
      (v_pregunta, 'Bloquean los canales de calcio y enlentecen la conducción en el nodo AV.', FALSE, 'Ese es el mecanismo de la clase IV.', 2),
      (v_pregunta, 'Bloquean los canales de potasio y prolongan la repolarización y el periodo refractario.', TRUE, 'Correcto. Por eso pueden prolongar el QT.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con digoxina 0,25 mg al día inicia amiodarona por fibrilación auricular. ¿Qué propone el QF al médico?';
    v_t4 := 'La amiodarona inhibe la glicoproteína P y aumenta las concentraciones de digoxina; se recomienda reducir la dosis de digoxina (habitualmente a la mitad) y vigilar concentraciones y signos de toxicidad. También potencia a la warfarina y aumenta el riesgo de miopatía con algunas estatinas.';
    v_j1 := $evfcv_json${"external_id":"fcv-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Interacciones de amiodarona con digoxina, estatinas y bradicardizantes","outcome":"Interacciones de amiodarona con digoxina, estatinas y bradicardizantes","source":"Ficha técnica de amiodarona."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Mantener la digoxina igual, porque la amiodarona no modifica sus concentraciones.', FALSE, 'La amiodarona aumenta las concentraciones de digoxina.', 0),
      (v_pregunta, 'Reducir la dosis de digoxina, habitualmente a la mitad, y vigilar sus concentraciones y síntomas.', TRUE, 'Correcto. La amiodarona inhibe la glicoproteína P.', 1),
      (v_pregunta, 'Suspender la amiodarona, porque nunca puede combinarse con digoxina.', FALSE, 'Se pueden combinar con ajuste y vigilancia.', 2),
      (v_pregunta, 'Aumentar la digoxina, porque la amiodarona acelera su eliminación renal.', FALSE, 'Ocurre lo contrario: reduce su eliminación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer de 74 años con citalopram 40 mg recibe azitromicina y ondansetrón; su potasio es de 3,2 mmol/L y su frecuencia de 54 lpm. ¿Qué análisis hace el QF?';
    v_t4 := 'La prolongación del QT y la torsade de pointes se favorecen al combinar fármacos que prolongan el QT (por ejemplo, citalopram a dosis altas, macrólidos, ondansetrón) y con hipopotasemia, hipomagnesemia, bradicardia, sexo femenino y edad avanzada.';
    v_j1 := $evfcv_json${"external_id":"fcv-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Proarritmia y prolongación del QT","outcome":"Proarritmia y prolongación del QT","source":"Fichas técnicas de citalopram, azitromicina y ondansetrón."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No hay riesgo, porque ninguno de estos medicamentos es un antiarrítmico.', FALSE, 'Muchos fármacos no cardiológicos prolongan el QT.', 0),
      (v_pregunta, 'El único riesgo es la sedación por la combinación de citalopram y ondansetrón.', FALSE, 'El riesgo relevante es arrítmico.', 1),
      (v_pregunta, 'Tiene varios factores de riesgo de torsade de pointes: tres prolongadores del QT, hipopotasemia, bradicardia y sexo femenino.', TRUE, 'Correcto. Se propone ECG, corregir el potasio y revisar la combinación.', 2),
      (v_pregunta, 'El riesgo desaparece si toma la azitromicina en la mañana y el citalopram en la noche.', FALSE, 'Separar las tomas no evita la interacción farmacodinámica.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un programa propone vigilar a los pacientes con amiodarona «solo con un electrocardiograma anual». ¿Cuál es la mejor valoración?';
    v_t4 := 'La amiodarona es muy lipofílica, con gran volumen de distribución y vida media de semanas a meses. Su toxicidad es tiroidea (hipo o hipertiroidismo), pulmonar, hepática, ocular y cutánea; por eso se vigilan pruebas tiroideas y hepáticas al inicio y de forma periódica, además de evaluación pulmonar y oftalmológica según síntomas y protocolo.';
    v_j1 := $evfcv_json${"external_id":"fcv-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Amiodarona: farmacocinética, toxicidad y monitorización","outcome":"Amiodarona: farmacocinética, toxicidad y monitorización","source":"Ficha técnica de amiodarona."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es insuficiente: además se vigilan función tiroidea, hepática, pulmonar y ocular de forma periódica.', TRUE, 'Correcto. Su toxicidad es multisistémica.', 0),
      (v_pregunta, 'Es suficiente, porque la toxicidad de la amiodarona es solo cardiaca.', FALSE, 'Su toxicidad afecta varios órganos.', 1),
      (v_pregunta, 'Es excesiva, porque la amiodarona no requiere ningún tipo de control mientras el paciente no tenga síntomas.', FALSE, 'Muchas toxicidades aparecen antes de dar síntomas claros.', 2),
      (v_pregunta, 'Es suficiente si el paciente usa protector solar todos los días.', FALSE, 'La fotosensibilidad es solo una de sus toxicidades.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fcv-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Dislipidemias, seguridad farmacológica e integración' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Dislipidemias, seguridad farmacológica e integración) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Dislipidemias, seguridad farmacológica e integración';
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


    v_t3 := '¿Qué caracteriza a una estatina de alta intensidad?';
    v_t4 := 'Las estatinas se clasifican por la reducción de LDL que logran: alta intensidad (50 % o más; atorvastatina 40-80 mg, rosuvastatina 20-40 mg), moderada (30-49 %) y baja. La atorvastatina y la simvastatina se metabolizan por el CYP3A4; la rosuvastatina y la pravastatina dependen menos de esa vía.';
    v_j1 := $evfcv_json${"external_id":"fcv-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Estatinas: mecanismo, intensidad y uso clínico","outcome":"Estatinas: mecanismo, intensidad y uso clínico","source":"Guías ESC/EAS y AHA/ACC de dislipidemias."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que se toma dos veces al día para mantener niveles estables durante la noche.', FALSE, 'La intensidad no depende del número de tomas.', 0),
      (v_pregunta, 'Que se metaboliza por el CYP3A4 y por eso tiene más efecto que las demás.', FALSE, 'La vía metabólica no define la intensidad.', 1),
      (v_pregunta, 'Que reduce el colesterol LDL en 50 % o más, como la atorvastatina 40-80 mg o la rosuvastatina 20-40 mg.', TRUE, 'Correcto. Se indica en prevención secundaria y riesgo muy alto.', 2),
      (v_pregunta, 'Que se combina siempre con ezetimiba desde el inicio para alcanzar la meta.', FALSE, 'La combinación es una opción, no lo que define la intensidad.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con simvastatina 40 mg recibe una fórmula de claritromicina por 7 días. ¿Qué propone el QF?';
    v_t4 := 'La simvastatina está contraindicada con inhibidores potentes del CYP3A4 como la claritromicina, porque aumentan mucho su exposición y el riesgo de miopatía y rabdomiólisis. Se suspende durante el tratamiento o se elige un antibiótico sin esa interacción.';
    v_j1 := $evfcv_json${"external_id":"fcv-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Miopatía por estatinas e interacciones","outcome":"Miopatía por estatinas e interacciones","source":"Ficha técnica de simvastatina."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Continuar igual, porque la interacción solo importa con tratamientos antibióticos de más de un mes.', FALSE, 'El riesgo aparece desde los primeros días.', 0),
      (v_pregunta, 'Duplicar la simvastatina para compensar el efecto del antibiótico sobre el colesterol.', FALSE, 'Subir la estatina aumentaría el riesgo muscular.', 1),
      (v_pregunta, 'Tomar la simvastatina en la mañana y la claritromicina en la noche para separarlas.', FALSE, 'Separar las tomas no evita la inhibición del CYP3A4.', 2),
      (v_pregunta, 'Suspender la simvastatina durante el antibiótico o pedir otra opción, por riesgo de miopatía.', TRUE, 'Correcto. La claritromicina es un inhibidor potente del CYP3A4.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente tras un infarto toma atorvastatina 80 mg con buena adherencia, pero su LDL sigue por encima de la meta. ¿Cuál es el siguiente paso más habitual?';
    v_t4 := 'Cuando no se alcanza la meta de LDL con la estatina de máxima intensidad tolerada, el siguiente paso habitual es añadir ezetimiba (inhibe la absorción intestinal de colesterol; reduce LDL alrededor de 20-25 % adicional) y, si no basta, considerar inhibidores de PCSK9 u otras terapias, según acceso.';
    v_j1 := $evfcv_json${"external_id":"fcv-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Terapias no estatínicas: ezetimiba, ácido bempedoico, iPCSK9 e inclisirán","outcome":"Terapias no estatínicas: ezetimiba, ácido bempedoico, iPCSK9 e inclisirán","source":"Guías ESC/EAS de dislipidemias."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Añadir ezetimiba, que inhibe la absorción intestinal de colesterol y baja el LDL alrededor de 20-25 % más.', TRUE, 'Correcto. Si persiste, se consideran los iPCSK9 u otras terapias.', 0),
      (v_pregunta, 'Cambiar a simvastatina 80 mg, que es más potente que la atorvastatina.', FALSE, 'La simvastatina 80 mg no es más potente y tiene más riesgo muscular.', 1),
      (v_pregunta, 'Suspender la estatina porque ya no está funcionando y empezar un fibrato.', FALSE, 'La estatina sigue siendo la base del tratamiento.', 2),
      (v_pregunta, 'Añadir niacina, que es la terapia no estatínica con más evidencia de reducir eventos.', FALSE, 'No es la opción preferida en las guías actuales.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una mujer de 33 años con hipertensión y dislipidemia familiar, que toma enalapril y atorvastatina, cuenta que planea quedar embarazada este año. ¿Cuál es la mejor respuesta del QF?';
    v_t4 := 'Los IECA, ARA-II y ARNI están contraindicados en el segundo y tercer trimestre y no se recomiendan en el primero; las estatinas se evitan en el embarazo. Las mujeres que planean un embarazo deben cambiar a alternativas seguras antes de concebir, con el médico.';
    v_j1 := $evfcv_json${"external_id":"fcv-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Fármacos cardiovasculares en ERC, embarazo, adulto mayor y perioperatorio","outcome":"Fármacos cardiovasculares en ERC, embarazo, adulto mayor y perioperatorio","source":"Fichas técnicas de enalapril y atorvastatina."}$evfcv_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fcv-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que siga igual hasta confirmar el embarazo y entonces suspenda todo de inmediato.', FALSE, 'Conviene ajustar antes de concebir.', 0),
      (v_pregunta, 'Que consulte antes de concebir: IECA y estatinas se evitan en el embarazo y deben cambiarse con el médico.', TRUE, 'Correcto. La planeación permite elegir alternativas seguras.', 1),
      (v_pregunta, 'Que suspenda ya mismo ambos medicamentos sin consultar, para no correr riesgos.', FALSE, 'Suspender sin plan expone a una presión no controlada.', 2),
      (v_pregunta, 'Que no hay problema, porque los efectos fetales de estos medicamentos son teóricos.', FALSE, 'Las contraindicaciones en el embarazo están en las fichas técnicas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fcv-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la farmacología cardiovascular y riesgo cardiovascular en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la farmacología cardiovascular y riesgo cardiovascular en Colombia) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Seguimiento de una paciente con multimorbilidad cardiometabólica';
  v_t2 := $evfcv_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Elabora el estado de situación: cada problema de salud con su medicamento y su parámetro de control.</li><li>Identifica la interacción del diclofenaco con el enalapril y la tiazida y su riesgo en una paciente con ERC.</li><li>Analiza la tos y su relación con el enalapril; propone una alternativa.</li><li>Revisa la dosis de metformina frente a la función renal.</li><li>Estima la adherencia con los registros de dispensación y analiza sus posibles causas.</li><li>Clasifica cada problema como de necesidad, efectividad o seguridad.</li><li>Redacta la nota al médico con las propuestas priorizadas y el plan educativo para la paciente.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar problemas relacionados con medicamentos y resultados negativos.</li><li>Detectar interacciones y problemas de adherencia.</li><li>Proponer intervenciones priorizadas al médico y a la paciente.</li></ul>
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
  <tr><td>Estado de situación y clasificación</td><td>20 %</td><td>Relaciona cada problema con su medicamento y clasifica correctamente los resultados negativos.</td><td>Estado correcto con alguna clasificación imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones y reacciones adversas</td><td>30 %</td><td>Identifica la triple amenaza, relaciona la tos con el IECA y propone un ARA-II.</td><td>Identifica una de las dos situaciones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Ajuste renal y adherencia</td><td>25 %</td><td>Detecta el exceso de metformina para TFG 45-59 y estima una adherencia cercana al 67 %.</td><td>Detecta uno de los dos problemas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Nota y educación</td><td>15 %</td><td>Propuestas priorizadas y plan educativo claro.</td><td>Nota correcta sin priorizar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfcv_html$;
  v_t3 := $evfcv_html$<h2>Caso de estudio</h2>
<p>Doña Fanny tiene 66 años, vive en Sincelejo y está en el programa de riesgo cardiovascular por hipertensión, diabetes tipo 2 y enfermedad renal crónica (TFG 48 mL/min) (datos simulados). Toma enalapril 20 mg cada 12 horas, hidroclorotiazida 25 mg, metformina 850 mg cada 8 horas, atorvastatina 20 mg y compra diclofenaco por dolor lumbar. Su presión en casa promedia 148/90 mmHg. Retira sus medicamentos cada 45 días aunque se los entregan para 30. Dice que el enalapril le da «una tos que no la deja dormir».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfcv_html$;
  v_t4 := 'Informe de seguimiento farmacoterapéutico con nota al médico.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfcv_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso; guías ESC de hipertensión (2024), insuficiencia cardiaca (2021, actualización 2023) y síndromes coronarios crónicos (2024); guía AHA/ACC de hipertensión (2025); guía de práctica clínica de hipertensión del Ministerio de Salud; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfcv_html$;
  v_t7 := NULL;
  v_j1 := $evfcv_json$["Estado de situación.","Interacciones y tos.","Ajuste renal.","Adherencia.","Clasificación y nota al médico."]$evfcv_json$::jsonb;
  v_j2 := $evfcv_json${"version":1,"total":100,"criteria":[{"id":"estado-de-situacion-y-clasificacion","name":"Estado de situación y clasificación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Relaciona cada problema con su medicamento y clasifica correctamente los resultados negativos."},{"level":3,"label":"Logrado","description":"Estado correcto con alguna clasificación imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones-y-reacciones-adversas","name":"Interacciones y reacciones adversas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Identifica la triple amenaza, relaciona la tos con el IECA y propone un ARA-II."},{"level":3,"label":"Logrado","description":"Identifica una de las dos situaciones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"ajuste-renal-y-adherencia","name":"Ajuste renal y adherencia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Detecta el exceso de metformina para TFG 45-59 y estima una adherencia cercana al 67 %."},{"level":3,"label":"Logrado","description":"Detecta uno de los dos problemas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"nota-y-educacion","name":"Nota y educación","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Propuestas priorizadas y plan educativo claro."},{"level":3,"label":"Logrado","description":"Nota correcta sin priorizar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfcv_json$::jsonb;
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


  -- ── Actividad fcv-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Farmacoterapia de la hipertensión arterial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Farmacoterapia de la hipertensión arterial) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Hipertensión no controlada con monoterapia';
  v_t2 := $evfcv_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Analiza las causas posibles del mal control (adherencia, descongestionante, dosis).</li><li>Define la meta de presión del paciente con su riesgo.</li><li>Propone una combinación a dosis fija y justifícala con su diabetes y su albuminuria.</li><li>Explica qué controles de laboratorio y de presión harías tras el cambio.</li><li>Diseña dos intervenciones de adherencia adaptadas a su trabajo.</li><li>Redacta la propuesta al médico.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar las causas del mal control de la presión.</li><li>Proponer una combinación coherente con las guías.</li><li>Diseñar el plan de adherencia y seguimiento.</li></ul>
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
  <tr><td>Causas del mal control</td><td>20 %</td><td>Identifica la adherencia y el descongestionante como causas antes de sumar fármacos.</td><td>Identifica una causa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Meta y combinación</td><td>30 %</td><td>Meta coherente con su riesgo y combinación de ARA-II con calcioantagonista o tiazida a dosis fija, justificada.</td><td>Combinación correcta sin justificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Controles</td><td>20 %</td><td>Potasio y creatinina y presión en casa en las semanas siguientes.</td><td>Controles incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Adherencia</td><td>20 %</td><td>Intervenciones concretas y medibles adaptadas a su rutina.</td><td>Intervenciones generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfcv_html$;
  v_t3 := $evfcv_html$<h2>Caso de estudio</h2>
<p>Don Ernesto tiene 58 años, es taxista en Bucaramanga y lleva dos años con losartán 50 mg al día (datos simulados). Su automedida promedia 152/94 mmHg. Tiene diabetes tipo 2, relación albúmina/creatinina de 70 mg/g, potasio 4,3 mmol/L y TFG de 75. Dice que olvida la pastilla «unas dos veces por semana» y que toma un descongestionante nasal cuando tiene gripa. El médico pregunta qué combinación conviene.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfcv_html$;
  v_t4 := 'Propuesta al médico con plan de adherencia y seguimiento.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfcv_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso; guías ESC de hipertensión (2024), insuficiencia cardiaca (2021, actualización 2023) y síndromes coronarios crónicos (2024); guía AHA/ACC de hipertensión (2025); guía de práctica clínica de hipertensión del Ministerio de Salud; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfcv_html$;
  v_t7 := NULL;
  v_j1 := $evfcv_json$["Causas del mal control.","Meta de presión.","Combinación propuesta.","Controles tras el cambio.","Adherencia."]$evfcv_json$::jsonb;
  v_j2 := $evfcv_json${"version":1,"total":100,"criteria":[{"id":"causas-del-mal-control","name":"Causas del mal control","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Identifica la adherencia y el descongestionante como causas antes de sumar fármacos."},{"level":3,"label":"Logrado","description":"Identifica una causa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"meta-y-combinacion","name":"Meta y combinación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Meta coherente con su riesgo y combinación de ARA-II con calcioantagonista o tiazida a dosis fija, justificada."},{"level":3,"label":"Logrado","description":"Combinación correcta sin justificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"controles","name":"Controles","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Potasio y creatinina y presión en casa en las semanas siguientes."},{"level":3,"label":"Logrado","description":"Controles incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"adherencia","name":"Adherencia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Intervenciones concretas y medibles adaptadas a su rutina."},{"level":3,"label":"Logrado","description":"Intervenciones generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfcv_json$::jsonb;
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


  -- ── Actividad fcv-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Fármacos antiarrítmicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Fármacos antiarrítmicos) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Plan de monitorización al iniciar amiodarona';
  v_t2 := $evfcv_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Explica las características farmacocinéticas de la amiodarona que importan para el plan.</li><li>Analiza la interacción con la warfarina y propone cómo vigilar el INR.</li><li>Analiza la interacción con la digoxina y el papel del potasio bajo.</li><li>Revisa la estatina y la levotiroxina en relación con la amiodarona.</li><li>Diseña el calendario de monitorización (tiroides, hígado, pulmón, ojos, ECG).</li><li>Prepara la educación para la paciente (fotosensibilidad, síntomas respiratorios, signos de sangrado).</li><li>Revisa con la rúbrica y sube tu plan en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar las interacciones de la amiodarona con su fórmula.</li><li>Diseñar un plan de monitorización de la toxicidad.</li><li>Educar a la paciente sobre los signos de alarma.</li></ul>
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
  <tr><td>Farmacocinética</td><td>15 %</td><td>Explica lipofilia, volumen de distribución, carga y vida media prolongada.</td><td>Explicación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones</td><td>30 %</td><td>Warfarina (INR más frecuente y posible reducción de dosis), digoxina (reducir y vigilar), estatina y función tiroidea.</td><td>Identifica dos interacciones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Monitorización</td><td>30 %</td><td>Calendario completo con pruebas tiroideas y hepáticas, evaluación pulmonar y ocular, ECG y potasio.</td><td>Calendario con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Educación</td><td>15 %</td><td>Signos de alarma claros y protección solar.</td><td>Educación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfcv_html$;
  v_t3 := $evfcv_html$<h2>Caso de estudio</h2>
<p>Doña Nelly tiene 68 años, vive en Manizales y empieza amiodarona por fibrilación auricular con insuficiencia cardiaca (datos simulados). Toma warfarina con INR estable de 2,5, digoxina 0,25 mg al día, atorvastatina 40 mg, furosemida 40 mg y levotiroxina por un hipotiroidismo. Su potasio es de 3,4 mmol/L. El médico pide al servicio farmacéutico un plan de monitorización.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfcv_html$;
  v_t4 := 'Plan de monitorización y educación para el inicio de amiodarona.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfcv_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso; guías ESC de hipertensión (2024), insuficiencia cardiaca (2021, actualización 2023) y síndromes coronarios crónicos (2024); guía AHA/ACC de hipertensión (2025); guía de práctica clínica de hipertensión del Ministerio de Salud; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfcv_html$;
  v_t7 := NULL;
  v_j1 := $evfcv_json$["Farmacocinética.","Interacciones.","Potasio y digoxina.","Calendario de monitorización.","Educación."]$evfcv_json$::jsonb;
  v_j2 := $evfcv_json${"version":1,"total":100,"criteria":[{"id":"farmacocinetica","name":"Farmacocinética","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Explica lipofilia, volumen de distribución, carga y vida media prolongada."},{"level":3,"label":"Logrado","description":"Explicación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones","name":"Interacciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Warfarina (INR más frecuente y posible reducción de dosis), digoxina (reducir y vigilar), estatina y función tiroidea."},{"level":3,"label":"Logrado","description":"Identifica dos interacciones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"monitorizacion","name":"Monitorización","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Calendario completo con pruebas tiroideas y hepáticas, evaluación pulmonar y ocular, ECG y potasio."},{"level":3,"label":"Logrado","description":"Calendario con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"educacion","name":"Educación","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Signos de alarma claros y protección solar."},{"level":3,"label":"Logrado","description":"Educación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfcv_json$::jsonb;
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


  -- ── Actividad fcv-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Insuficiencia cardiaca y cardiopatía isquémica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Insuficiencia cardiaca y cardiopatía isquémica) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: conciliación y optimización cardiovascular de Don Ramiro';
  v_t2 := $evfcv_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y elabora el estado de situación.</li><li>Fase 1: identifica los problemas relacionados con medicamentos y clasifícalos.</li><li>Fase 2: revisa el IECA y el betabloqueador (molécula, dosis, evidencia).</li><li>Fase 3: propone la terapia de la FE reducida que falta y qué hacer con el ibuprofeno y el nitrato.</li><li>Fase 3: explica la educación sobre el nitrato (uso, intervalo libre, interacción con inhibidores de la PDE-5).</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (riesgo y seguimiento).</strong> Estado de situación, problemas relacionados con medicamentos y adherencia.</li>
  <li><strong>Fase 2 · Unidad 2 (presión arterial).</strong> Revisión del bloqueo del SRAA y de los demás antihipertensivos.</li>
  <li><strong>Fase 3 · Unidad 3 (IC y cardiopatía isquémica).</strong> Terapia de la FE reducida, nitratos y medicamentos a evitar.</li>
  <li><strong>Fase 4 · Unidad 4 (ritmo).</strong> Riesgos arrítmicos y prolongación del QT en su fórmula.</li>
  <li><strong>Fase 5 · Unidad 5 (lípidos y seguridad).</strong> Terapia hipolipemiante, poblaciones especiales y farmacovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Conciliar la fórmula de alta e identificar problemas relacionados con medicamentos.</li><li>Proponer la optimización de la terapia según las guías.</li></ul>
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
  <tr><td>Estado de situación</td><td>20 %</td><td>Relaciona cada problema con su medicamento y clasifica los resultados negativos.</td><td>Estado correcto con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Antihipertensivos</td><td>25 %</td><td>Reconoce que el metoprolol tartrato no tiene evidencia en IC y propone uno con evidencia; revisa el IECA o el paso a ARNI.</td><td>Revisión parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Terapia de la FE reducida</td><td>25 %</td><td>Propone ARM e iSGLT2 con sus requisitos.</td><td>Propone uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Medicamentos a evitar y nitrato</td><td>20 %</td><td>Retira el ibuprofeno y educa sobre el nitrato y la PDE-5.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfcv_html$;
  v_t3 := $evfcv_html$<h2>Caso de estudio</h2>
<p>Don Ramiro tiene 63 años, vive en Cali y fue dado de alta tras un síndrome coronario agudo con fracción de eyección de 38 % (datos simulados). Tiene hipertensión, dislipidemia y enfermedad renal crónica leve (TFG 62). Sale con ácido acetilsalicílico, clopidogrel, enalapril 10 mg cada 12 horas, metoprolol tartrato 50 mg cada 12 horas, simvastatina 40 mg, dinitrato de isosorbida e ibuprofeno «para el dolor del pecho». Su LDL es de 128 mg/dL. Su EPS lo asignó al programa cardiovascular donde tú eres el QF responsable. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfcv_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfcv_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso; guías ESC de hipertensión (2024), insuficiencia cardiaca (2021, actualización 2023) y síndromes coronarios crónicos (2024); guía AHA/ACC de hipertensión (2025); guía de práctica clínica de hipertensión del Ministerio de Salud; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfcv_html$;
  v_t7 := NULL;
  v_j1 := $evfcv_json$["Estado de situación y problemas.","IECA y betabloqueador.","Terapia de la FE reducida.","Ibuprofeno y nitrato."]$evfcv_json$::jsonb;
  v_j2 := $evfcv_json${"version":1,"total":100,"criteria":[{"id":"estado-de-situacion","name":"Estado de situación","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Relaciona cada problema con su medicamento y clasifica los resultados negativos."},{"level":3,"label":"Logrado","description":"Estado correcto con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"antihipertensivos","name":"Antihipertensivos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Reconoce que el metoprolol tartrato no tiene evidencia en IC y propone uno con evidencia; revisa el IECA o el paso a ARNI."},{"level":3,"label":"Logrado","description":"Revisión parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"terapia-de-la-fe-reducida","name":"Terapia de la FE reducida","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Propone ARM e iSGLT2 con sus requisitos."},{"level":3,"label":"Logrado","description":"Propone uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"medicamentos-a-evitar-y-nitrato","name":"Medicamentos a evitar y nitrato","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Retira el ibuprofeno y educa sobre el nitrato y la PDE-5."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfcv_json$::jsonb;
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


  -- ── Actividad fcv-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Dislipidemias, seguridad farmacológica e integración' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Dislipidemias, seguridad farmacológica e integración) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan integral de seguimiento cardiovascular de Don Ramiro';
  v_t2 := $evfcv_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: revisa si algún medicamento actual o propuesto prolonga el QT o tiene interacciones arrítmicas.</li><li>Fase 5: propone la terapia hipolipemiante (intensidad de la estatina, ezetimiba si hace falta) y la meta de LDL.</li><li>Fase 5: diseña el seguimiento (parámetros, laboratorios, frecuencia) y el plan de farmacovigilancia.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (riesgo y seguimiento).</strong> Estado de situación, problemas relacionados con medicamentos y adherencia.</li>
  <li><strong>Fase 2 · Unidad 2 (presión arterial).</strong> Revisión del bloqueo del SRAA y de los demás antihipertensivos.</li>
  <li><strong>Fase 3 · Unidad 3 (IC y cardiopatía isquémica).</strong> Terapia de la FE reducida, nitratos y medicamentos a evitar.</li>
  <li><strong>Fase 4 · Unidad 4 (ritmo).</strong> Riesgos arrítmicos y prolongación del QT en su fórmula.</li>
  <li><strong>Fase 5 · Unidad 5 (lípidos y seguridad).</strong> Terapia hipolipemiante, poblaciones especiales y farmacovigilancia.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar la terapia hipolipemiante y la seguridad en el plan.</li><li>Diseñar el seguimiento y la farmacovigilancia.</li></ul>
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
  <tr><td>Riesgo arrítmico</td><td>15 %</td><td>Revisa el QT y las interacciones con criterio.</td><td>Revisión general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Terapia hipolipemiante</td><td>30 %</td><td>Cambia a estatina de alta intensidad y propone ezetimiba si no llega a la meta.</td><td>Propuesta correcta sin escalonamiento.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Seguimiento y farmacovigilancia</td><td>30 %</td><td>Parámetros y frecuencia claros, reacciones a vigilar y canal de reporte.</td><td>Plan correcto con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfcv_html$;
  v_t3 := $evfcv_html$<h2>Caso de estudio</h2>
<p>Don Ramiro tiene 63 años, vive en Cali y fue dado de alta tras un síndrome coronario agudo con fracción de eyección de 38 % (datos simulados). Tiene hipertensión, dislipidemia y enfermedad renal crónica leve (TFG 62). Sale con ácido acetilsalicílico, clopidogrel, enalapril 10 mg cada 12 horas, metoprolol tartrato 50 mg cada 12 horas, simvastatina 40 mg, dinitrato de isosorbida e ibuprofeno «para el dolor del pecho». Su LDL es de 128 mg/dL. Su EPS lo asignó al programa cardiovascular donde tú eres el QF responsable. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité del programa.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfcv_html$;
  v_t4 := 'Plan integral de seguimiento con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfcv_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso; guías ESC de hipertensión (2024), insuficiencia cardiaca (2021, actualización 2023) y síndromes coronarios crónicos (2024); guía AHA/ACC de hipertensión (2025); guía de práctica clínica de hipertensión del Ministerio de Salud; Decreto 780 de 2016 y Resolución 1403 de 2007 (servicio farmacéutico); Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfcv_html$;
  v_t7 := NULL;
  v_j1 := $evfcv_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Riesgo arrítmico.","Terapia hipolipemiante.","Seguimiento y farmacovigilancia.","Resumen ejecutivo."]$evfcv_json$::jsonb;
  v_j2 := $evfcv_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"riesgo-arritmico","name":"Riesgo arrítmico","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Revisa el QT y las interacciones con criterio."},{"level":3,"label":"Logrado","description":"Revisión general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"terapia-hipolipemiante","name":"Terapia hipolipemiante","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Cambia a estatina de alta intensidad y propone ezetimiba si no llega a la meta."},{"level":3,"label":"Logrado","description":"Propuesta correcta sin escalonamiento."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguimiento-y-farmacovigilancia","name":"Seguimiento y farmacovigilancia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Parámetros y frecuencia claros, reacciones a vigilar y canal de reporte."},{"level":3,"label":"Logrado","description":"Plan correcto con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfcv_json$::jsonb;
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


  -- ── Foro fcv-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con medicamentos cardiovasculares';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfcv_html$<h2>Para empezar</h2>
<p>Piensa en un paciente con enfermedad cardiovascular que hayas atendido o acompañado y cuéntanos en tres o cuatro líneas una duda o un problema con sus medicamentos, sin nombres ni datos que lo identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfcv_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre medicamentos cardiovasculares te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfcv_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfcv_html$;
  v_t6 := $evfcv_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfcv_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué grupo de medicamentos te genera más dudas: antihipertensivos, antiarrítmicos o hipolipemiantes?', '¿Has detectado alguna vez una interacción grave en una fórmula cardiovascular?']::text[];
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


  -- ── Foro fcv-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de la farmacología cardiovascular y riesgo cardiovascular en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de la farmacología cardiovascular y riesgo cardiovascular en Colombia) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Qué puede mover el QF en los indicadores de riesgo cardiovascular?';
  v_t2 := 'Argumentar qué indicadores de control cardiovascular dependen del servicio farmacéutico y cómo influir en ellos.';
  v_t3 := $evfcv_html$<h2>Caso del foro</h2>
<p>Un programa de riesgo cardiovascular de una EPS tiene 3.000 pacientes (datos simulados): el 62 % con presión controlada, el 40 % con HbA1c medida en el año y solo el 35 % con estudio de enfermedad renal. La gerencia pide al servicio farmacéutico «subir los indicadores».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfcv_html$;
  v_t4 := '¿Qué indicadores puede influir el servicio farmacéutico y con qué intervenciones concretas?';
  v_t5 := $evfcv_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el dato o la recomendación que respalda cada intervención. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfcv_html$;
  v_t6 := $evfcv_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el dato o la recomendación que respalda cada intervención.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfcv_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué datos de dispensación sirven para detectar a los pacientes con mal control?', '¿Qué intervención tendría más impacto con menos recursos?', '¿Qué indicadores no dependen del servicio farmacéutico y cómo se coordina con el resto del equipo?']::text[];
  v_j1 := $evfcv_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el dato o la recomendación que respalda cada intervención."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfcv_json$::jsonb;
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


  -- ── Foro fcv-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Farmacoterapia de la hipertensión arterial' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Farmacoterapia de la hipertensión arterial) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · ¿Combinación en una sola tableta para todos?';
  v_t2 := 'Argumentar las ventajas y los límites de las combinaciones a dosis fija en la hipertensión.';
  v_t3 := $evfcv_html$<h2>Caso del foro</h2>
<p>Un comité de farmacia discute reemplazar en el programa de hipertensión las monoterapias por combinaciones de dosis fija (datos simulados). A favor: menos tabletas y mejor adherencia. En contra: menor flexibilidad para ajustar dosis, costo y el caso de una paciente de 86 años, frágil, que ya tuvo dos caídas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfcv_html$;
  v_t4 := '¿A qué pacientes beneficiaría más la combinación a dosis fija y a quiénes no?';
  v_t5 := $evfcv_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía o el dato de la ficha técnica que sustenta tu postura. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfcv_html$;
  v_t6 := $evfcv_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o el dato de la ficha técnica que sustenta tu postura.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfcv_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dicen las guías actuales sobre iniciar con dos fármacos?', '¿Qué combinaciones deben evitarse?', '¿Cómo vigilarías a la paciente frágil si se decide iniciar o cambiar su esquema?']::text[];
  v_j1 := $evfcv_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía o el dato de la ficha técnica que sustenta tu postura."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfcv_json$::jsonb;
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


  -- ── Foro fcv-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Insuficiencia cardiaca y cardiopatía isquémica' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Insuficiencia cardiaca y cardiopatía isquémica) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Medicamentos de venta libre que empeoran el corazón';
  v_t2 := 'Argumentar cómo debe actuar la droguería ante medicamentos sin fórmula que descompensan la insuficiencia cardiaca.';
  v_t3 := $evfcv_html$<h2>Caso del foro</h2>
<p>En una droguería de barrio, en un mes, piden sin fórmula (datos simulados): ibuprofeno para un paciente con insuficiencia cardiaca, un antigripal con descongestionante para una señora con angina y un «suplemento natural» con regaliz para un hipertenso. El vendedor dice que «todo es de venta libre, así que no hay riesgo».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfcv_html$;
  v_t4 := '¿Qué haría el servicio farmacéutico en cada caso y por qué «de venta libre» no significa «sin riesgo»?';
  v_t5 := $evfcv_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la guía que sustenta cada recomendación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfcv_html$;
  v_t6 := $evfcv_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta cada recomendación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfcv_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué mecanismos explican el riesgo de cada producto?', '¿Qué alternativas ofrecerías en cada caso?', '¿Cuándo remitirías al médico y cuándo reportarías al INVIMA?']::text[];
  v_j1 := $evfcv_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la guía que sustenta cada recomendación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfcv_json$::jsonb;
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


  -- ── Foro fcv-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Fármacos antiarrítmicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Fármacos antiarrítmicos) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Amiodarona: ¿el beneficio justifica el riesgo?';
  v_t2 := 'Argumentar cómo equilibrar la eficacia y la toxicidad de la amiodarona en la práctica.';
  v_t3 := $evfcv_html$<h2>Caso del foro</h2>
<p>Un hombre de 70 años con fibrilación auricular y cardiopatía estructural lleva tres años con amiodarona 200 mg al día (datos simulados). Toma también warfarina, simvastatina 40 mg y digoxina. Nunca le han medido la función tiroidea. Su hija leyó que «la amiodarona es muy tóxica» y quiere que la suspendan.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfcv_html$;
  v_t4 := '¿Qué le responderías a la hija y qué propondrías al médico?';
  v_t5 := $evfcv_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o el ensayo que sustenta cada propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfcv_html$;
  v_t6 := $evfcv_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o el ensayo que sustenta cada propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfcv_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué interacciones tiene la amiodarona con los otros tres medicamentos?', '¿Por qué sus efectos persisten mucho tiempo después de suspenderla?', '¿Por qué la flecainida no sería una alternativa en este paciente?']::text[];
  v_j1 := $evfcv_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o el ensayo que sustenta cada propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfcv_json$::jsonb;
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


  -- ── Foro fcv-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Dislipidemias, seguridad farmacológica e integración' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Dislipidemias, seguridad farmacológica e integración) en Farmacología Cardiovascular: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · ¿Estatina en el adulto mayor frágil?';
  v_t2 := 'Argumentar cuándo mantener, reducir o retirar una estatina en una persona mayor con polifarmacia.';
  v_t3 := $evfcv_html$<h2>Caso del foro</h2>
<p>Don Gustavo tiene 88 años, demencia moderada, insuficiencia cardiaca y 11 medicamentos (datos simulados). Toma atorvastatina 80 mg desde un infarto hace 15 años. Ha perdido peso, tiene dolores musculares y dificultad para tragar tabletas grandes. Su hija pregunta si «todas esas pastillas son necesarias».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfcv_html$;
  v_t4 := '¿Qué harías con la estatina y cómo lo plantearías al médico y a la familia?';
  v_t5 := $evfcv_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación, la guía o el dato que sustenta tu postura. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfcv_html$;
  v_t6 := $evfcv_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación, la guía o el dato que sustenta tu postura.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfcv_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué beneficio se espera de la estatina en su situación?', '¿Qué interacciones podrían explicar los dolores musculares?', '¿Cómo se decide una deprescripción de forma segura y documentada?']::text[];
  v_j1 := $evfcv_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación, la guía o el dato que sustenta tu postura."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfcv_json$::jsonb;
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


  RAISE NOTICE 'Farmacología Cardiovascular: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfcv$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Farmacología Endocrina
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfend$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacología Endocrina' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacología Endocrina: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Diabetes mellitus: bases terapéuticas e insulinoterapia', 'Unidad 2. Antidiabéticos no insulínicos y farmacoterapia de la obesidad', 'Unidad 3. Tiroides y glucocorticoides', 'Unidad 4. Metabolismo óseo e hipófisis', 'Unidad 5. Hormonas sexuales']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacología Endocrina: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfend_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfend_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fend-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Diabetes mellitus: bases terapéuticas e insulinoterapia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Diabetes mellitus: bases terapéuticas e insulinoterapia) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Diabetes mellitus: bases terapéuticas e insulinoterapia';
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


    v_t3 := '¿Qué diferencia a un análogo basal de acción prolongada, como la glargina, de la insulina NPH?';
    v_t4 := 'Las insulinas se diferencian por inicio, pico y duración. La NPH es intermedia, con pico varias horas después de aplicarla y mayor riesgo de hipoglucemia nocturna. Los análogos basales (glargina, detemir, degludec) tienen un efecto más estable y prolongado, sin pico marcado.';
    v_j1 := $evfend_json${"external_id":"fend-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Tipos de insulina y perfiles de acción","outcome":"Tipos de insulina y perfiles de acción","source":"Fichas técnicas de las insulinas; ADA 2026, sección 9."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El análogo basal empieza a actuar en minutos y se aplica justo antes de cada comida principal.', FALSE, 'Esa descripción corresponde a los análogos rápidos.', 0),
      (v_pregunta, 'El análogo basal se usa por vía intravenosa en el hospital para corregir la glucosa muy alta.', FALSE, 'La insulina de uso intravenoso es la regular.', 1),
      (v_pregunta, 'El análogo basal tiene un efecto más estable, sin pico marcado, y produce menos hipoglucemia nocturna.', TRUE, 'Correcto. La NPH tiene un pico varias horas después de aplicarla.', 2),
      (v_pregunta, 'El análogo basal dura unas 6 horas, así que se necesitan cuatro aplicaciones al día para cubrir la noche.', FALSE, 'Los análogos basales cubren alrededor de un día o más.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente cuenta que guardó su pluma de insulina de reserva en el congelador «para que dure más». ¿Qué le indica el QF?';
    v_t4 := 'Las insulinas y plumas sin abrir se guardan en nevera entre 2 y 8 °C, sin congelar. Una vez en uso, se pueden mantener a temperatura ambiente el tiempo que indique el inserto. La insulina congelada se desecha.';
    v_j1 := $evfend_json${"external_id":"fend-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Dispositivos, técnica de inyección y conservación de la insulina","outcome":"Dispositivos, técnica de inyección y conservación de la insulina","source":"Fichas técnicas de las insulinas."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que no la use: la insulina congelada pierde su actividad y debe desecharse.', TRUE, 'Correcto. Sin abrir se guarda en nevera entre 2 y 8 °C, sin congelar.', 0),
      (v_pregunta, 'Que la deje descongelar a temperatura ambiente y la use normalmente desde el día siguiente.', FALSE, 'Descongelarla no le devuelve la actividad perdida.', 1),
      (v_pregunta, 'Que la caliente unos segundos en el microondas para recuperar la potencia antes de aplicarla.', FALSE, 'El calor también daña la insulina.', 2),
      (v_pregunta, 'Que la use, pero aumentando la dosis un 20 % para compensar la pérdida de efecto por el frío.', FALSE, 'La pérdida de actividad no es predecible; no se compensa con la dosis.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una paciente de 72 años que toma glibenclamida tiene sudoración y temblor; su glucometría marca 50 mg/dL y está consciente. ¿Qué análisis es correcto?';
    v_t4 := 'La ADA clasifica la hipoglucemia en nivel 1 (menor de 70 y ≥54 mg/dL), nivel 2 (menor de 54 mg/dL) y nivel 3 (requiere ayuda de otra persona). En la persona consciente se dan 15-20 g de glucosa y se mide a los 15 minutos. Las sulfonilureas de acción prolongada pueden causar hipoglucemias prolongadas o recurrentes.';
    v_j1 := $evfend_json${"external_id":"fend-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Hipoglucemia: clasificación, causas farmacológicas y tratamiento","outcome":"Hipoglucemia: clasificación, causas farmacológicas y tratamiento","source":"ADA 2026, sección 6."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una hipoglucemia leve sin importancia y basta con que almuerce un poco más temprano.', FALSE, 'Una glucosa menor de 54 mg/dL requiere acción inmediata.', 0),
      (v_pregunta, 'Es una hiperglucemia de rebote y debe tomar una dosis adicional de su antidiabético.', FALSE, 'La glucometría confirma una glucosa baja.', 1),
      (v_pregunta, 'Es una crisis de ansiedad, porque la glibenclamida no causa hipoglucemia en adultos mayores.', FALSE, 'Las sulfonilureas son una causa frecuente de hipoglucemia en mayores.', 2),
      (v_pregunta, 'Es una hipoglucemia de nivel 2: regla 15-15 ahora y revisar la sulfonilurea, cuyo efecto puede prolongarse.', TRUE, 'Correcto. Además se informa al médico para desintensificar.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un joven con diabetes tipo 1 tiene glucosas impredecibles. Se inyecta siempre en el mismo punto del abdomen, donde tiene un bulto blando. Un familiar propone «subirle la dosis». ¿Cuál es la mejor valoración?';
    v_t4 := 'Inyectar siempre en el mismo sitio produce lipohipertrofia, donde la absorción es irregular y aparecen hipoglucemias o glucosas altas inexplicables. Se rota dentro de cada zona y entre zonas; al pasar a piel sana la absorción puede aumentar y la dosis debe revisarse con el médico.';
    v_j1 := $evfend_json${"external_id":"fend-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Dispositivos, técnica de inyección y conservación de la insulina","outcome":"Dispositivos, técnica de inyección y conservación de la insulina","source":"ADA 2026, sección 7; recomendaciones de técnica de inyección."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: si la glucosa es impredecible, la causa más probable es una dosis insuficiente.', FALSE, 'Primero hay que descartar el problema del sitio de inyección.', 0),
      (v_pregunta, 'Es errada: probablemente tiene lipohipertrofia, que altera la absorción; se enseña la rotación de sitios.', TRUE, 'Correcto. Al cambiar de sitio puede necesitarse ajustar la dosis con el médico.', 1),
      (v_pregunta, 'Es correcta si además cambia a una aguja más larga para atravesar el bulto.', FALSE, 'Inyectar sobre el bulto mantiene la absorción irregular.', 2),
      (v_pregunta, 'Es errada solo porque la insulina debe aplicarse siempre en el brazo y nunca en el abdomen.', FALSE, 'El abdomen es un sitio válido si se rota.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fend-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antidiabéticos no insulínicos y farmacoterapia de la obesidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antidiabéticos no insulínicos y farmacoterapia de la obesidad) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Antidiabéticos no insulínicos y farmacoterapia de la obesidad';
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


    v_t3 := '¿Qué antecedente contraindica el uso de semaglutida o tirzepatida según sus fichas técnicas?';
    v_t4 := 'Las fichas técnicas de los agonistas del receptor de GLP-1 y de la tirzepatida los contraindican en personas con antecedente personal o familiar de carcinoma medular de tiroides o de neoplasia endocrina múltiple tipo 2. Sus efectos más frecuentes son digestivos y requieren escalamiento de dosis.';
    v_j1 := $evfend_json${"external_id":"fend-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Agonistas del receptor de GLP-1 y agonista dual GIP/GLP-1: semaglutida y tirzepatida","outcome":"Agonistas del receptor de GLP-1 y agonista dual GIP/GLP-1: semaglutida y tirzepatida","source":"Fichas técnicas de semaglutida y tirzepatida."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Haber tenido una infección urinaria en el último año por la glucosuria que producen.', FALSE, 'Esa preocupación corresponde a los iSGLT2.', 0),
      (v_pregunta, 'Antecedente personal o familiar de carcinoma medular de tiroides o de neoplasia endocrina múltiple tipo 2.', TRUE, 'Correcto. Es una contraindicación de los agonistas del receptor de GLP-1.', 1),
      (v_pregunta, 'Tener una función renal con TFG menor de 60 mL/min, porque se acumulan en el riñón.', FALSE, 'No requieren ajuste por función renal en la mayoría de los casos.', 2),
      (v_pregunta, 'Usar metformina al mismo tiempo, porque la combinación causa acidosis láctica.', FALSE, 'Pueden combinarse con metformina.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un hombre de 69 años toma metformina 850 mg cada 8 horas y su TFG bajó a 38 mL/min. ¿Qué propone el QF al médico?';
    v_t4 := 'Según la ficha técnica de la metformina: con TFG 45-59 el máximo es 2.000 mg/día; con 30-44, 1.000 mg/día; con menos de 30 está contraindicada. La TFG se vigila al menos una vez al año, y cada 3 a 6 meses si hay más riesgo.';
    v_j1 := $evfend_json${"external_id":"fend-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Metformina: mecanismo, farmacocinética, función renal y seguridad","outcome":"Metformina: mecanismo, farmacocinética, función renal y seguridad","source":"Ficha técnica de metformina; ADA 2026."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Mantener la dosis, porque la metformina no se ajusta hasta que la TFG sea menor de 15 mL/min.', FALSE, 'El ajuste empieza mucho antes.', 0),
      (v_pregunta, 'Suspenderla de inmediato, porque la metformina está contraindicada con TFG menor de 45 mL/min.', FALSE, 'La contraindicación es con TFG menor de 30.', 1),
      (v_pregunta, 'Aumentar la dosis, porque con la función renal baja la metformina pierde parte de su efecto.', FALSE, 'Aumentar la dosis eleva el riesgo de acumulación.', 2),
      (v_pregunta, 'Reducir a un máximo de 1.000 mg al día y vigilar la TFG cada 3 a 6 meses.', TRUE, 'Correcto. Recibe 2.550 mg/día.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una paciente con dapagliflozina tiene vómito y diarrea desde ayer y casi no come. Pregunta si debe seguir con su tableta. ¿Qué análisis es correcto?';
    v_t4 := 'Los iSGLT2 pueden causar depleción de volumen y cetoacidosis euglucémica. Ante vómito, diarrea, fiebre o ingesta muy baja se suspenden temporalmente y se consulta; se reanudan cuando la persona esté estable y comiendo.';
    v_j1 := $evfend_json${"external_id":"fend-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Inhibidores de SGLT2: beneficio cardiorrenal y seguridad","outcome":"Inhibidores de SGLT2: beneficio cardiorrenal y seguridad","source":"Ficha técnica de dapagliflozina; ADA 2026."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Debe suspenderla temporalmente y consultar: hay riesgo de deshidratación y de cetoacidosis aun con glucosa no muy alta.', TRUE, 'Correcto. Son las reglas de los días de enfermedad.', 0),
      (v_pregunta, 'Debe duplicar la dosis, porque la enfermedad sube la glucosa y necesita más efecto del medicamento.', FALSE, 'La duplicación aumenta el riesgo de deshidratación y cetoacidosis.', 1),
      (v_pregunta, 'Debe seguir igual, porque los iSGLT2 no tienen ninguna relación con la deshidratación.', FALSE, 'Su efecto diurético favorece la deshidratación.', 2),
      (v_pregunta, 'Debe cambiarla por una sulfonilurea mientras dure la diarrea para evitar la hiperglucemia.', FALSE, 'Una sulfonilurea sin comer aumenta la hipoglucemia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una paciente que inició orlistat refiere heces grasosas y manchas en la ropa interior. Quiere suspenderlo de inmediato. ¿Cuál es la mejor orientación del QF?';
    v_t4 := 'El orlistat inhibe las lipasas intestinales; la grasa no absorbida produce heces grasosas, urgencia y manchado, que dependen de la grasa de la dieta. Reduce la absorción de vitaminas liposolubles: se recomienda un multivitamínico al acostarse o al menos 2 horas después del orlistat.';
    v_j1 := $evfend_json${"external_id":"fend-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Farmacoterapia actual de la obesidad","outcome":"Farmacoterapia actual de la obesidad","source":"Ficha técnica de orlistat."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que lo suspenda, porque esos síntomas indican una reacción alérgica grave al medicamento.', FALSE, 'Son efectos esperados, no una alergia.', 0),
      (v_pregunta, 'Que tome un laxante para eliminar la grasa más rápido y siga con la misma dieta.', FALSE, 'El laxante no resuelve la causa de los síntomas.', 1),
      (v_pregunta, 'Que son efectos esperados por la grasa no absorbida: reducir la grasa de la dieta y separar un multivitamínico.', TRUE, 'Correcto. El multivitamínico se toma al acostarse o al menos 2 horas después.', 2),
      (v_pregunta, 'Que duplique la dosis, porque así el cuerpo se acostumbra más rápido al medicamento.', FALSE, 'Más dosis aumenta los efectos digestivos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fend-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Tiroides y glucocorticoides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Tiroides y glucocorticoides) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Tiroides y glucocorticoides';
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


    v_t3 := '¿Cómo debe tomarse la levotiroxina para una absorción adecuada?';
    v_t4 := 'La levotiroxina tiene un margen terapéutico estrecho y absorción variable. Se toma en ayunas, con agua, 30 a 60 minutos antes del desayuno (o al acostarse, al menos 3 horas después de la última comida), siempre igual. El calcio, el hierro, los antiácidos y otros reducen su absorción y deben separarse.';
    v_j1 := $evfend_json${"external_id":"fend-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Levotiroxina: absorción, interacciones y monitorización","outcome":"Levotiroxina: absorción, interacciones y monitorización","source":"Ficha técnica de levotiroxina."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Con el desayuno y un vaso de leche, para proteger el estómago de la irritación.', FALSE, 'Los alimentos y el calcio reducen su absorción.', 0),
      (v_pregunta, 'Junto con el suplemento de calcio y hierro, para tomar todo en un solo momento del día.', FALSE, 'El calcio y el hierro reducen su absorción por quelación.', 1),
      (v_pregunta, 'En cualquier momento del día, porque su absorción no depende de los alimentos.', FALSE, 'Su absorción es variable y depende de las condiciones de la toma.', 2),
      (v_pregunta, 'En ayunas, con agua, 30 a 60 minutos antes del desayuno, siempre de la misma forma.', TRUE, 'Correcto. O al acostarse, al menos 3 horas después de comer.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente que toma metimazol desde hace un mes llama porque tiene fiebre y dolor de garganta. ¿Qué le indica el QF?';
    v_t4 := 'Los antitiroideos (metimazol y propiltiouracilo) pueden causar agranulocitosis, sobre todo en los primeros meses. Ante fiebre, dolor de garganta o úlceras en la boca, se suspende y se hace un hemograma urgente. El propiltiouracilo tiene además riesgo de hepatotoxicidad grave.';
    v_j1 := $evfend_json${"external_id":"fend-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Antitiroideos: metimazol y propiltiouracilo; agranulocitosis y hepatotoxicidad","outcome":"Antitiroideos: metimazol y propiltiouracilo; agranulocitosis y hepatotoxicidad","source":"Fichas técnicas de metimazol y propiltiouracilo."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que tome acetaminofén y continúe el metimazol, porque es un resfriado común.', FALSE, 'Esos síntomas pueden ser una señal de alarma grave.', 0),
      (v_pregunta, 'Que duplique el metimazol, porque la fiebre indica que el hipertiroidismo empeoró.', FALSE, 'Subir la dosis podría agravar una reacción grave.', 1),
      (v_pregunta, 'Que suspenda el metimazol y consulte de inmediato para un hemograma por posible agranulocitosis.', TRUE, 'Correcto. Es la señal de alarma que todo paciente debe conocer.', 2),
      (v_pregunta, 'Que lo cambie por propiltiouracilo, que no produce ninguna alteración en la sangre.', FALSE, 'El PTU también puede causar agranulocitosis y es más hepatotóxico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un médico duda entre glucocorticoides para un paciente que necesita mucha potencia antiinflamatoria y poca retención de sodio. ¿Qué análisis es correcto?';
    v_t4 := 'Los glucocorticoides difieren en potencia, duración y actividad mineralocorticoide. La hidrocortisona tiene baja potencia y actividad mineralocorticoide relevante; la prednisona y la prednisolona, potencia intermedia; la metilprednisolona, algo mayor; la dexametasona, gran potencia, acción prolongada y actividad mineralocorticoide casi nula.';
    v_j1 := $evfend_json${"external_id":"fend-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Glucocorticoides: mecanismo, equivalencias y efectos adversos","outcome":"Glucocorticoides: mecanismo, equivalencias y efectos adversos","source":"Fichas técnicas de los glucocorticoides; tablas de equivalencia."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La hidrocortisona es la mejor opción, porque es la más potente y no retiene sodio.', FALSE, 'La hidrocortisona tiene baja potencia y alta actividad mineralocorticoide.', 0),
      (v_pregunta, 'La dexametasona tiene gran potencia antiinflamatoria y actividad mineralocorticoide casi nula.', TRUE, 'Correcto. Además tiene una duración de acción larga.', 1),
      (v_pregunta, 'La prednisona es la de mayor potencia de todas y no tiene ninguna actividad mineralocorticoide.', FALSE, 'La prednisona tiene potencia intermedia y algo de actividad mineralocorticoide.', 2),
      (v_pregunta, 'Todos los glucocorticoides tienen la misma potencia y la misma retención de sodio a cualquier dosis.', FALSE, 'Difieren en potencia, duración y actividad mineralocorticoide.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un paciente que lleva 8 semanas con prednisona 20 mg al día dice que ya se siente bien y la dejará «desde mañana». ¿Cuál es la mejor respuesta del QF?';
    v_t4 := 'El uso de glucocorticoides por varias semanas puede suprimir el eje hipotálamo-hipófisis-suprarrenal. La suspensión brusca puede causar insuficiencia suprarrenal; el retiro debe ser gradual y planeado por el médico, y el paciente debe conocer las dosis de estrés.';
    v_j1 := $evfend_json${"external_id":"fend-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Supresión del eje HHS, retiro gradual y dosis de estrés","outcome":"Supresión del eje HHS, retiro gradual y dosis de estrés","source":"Fichas técnicas de los glucocorticoides."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que no la suspenda de golpe: tras varias semanas hay riesgo de insuficiencia suprarrenal; el médico debe planear el retiro gradual.', TRUE, 'Correcto. También se le enseña sobre las dosis de estrés.', 0),
      (v_pregunta, 'Que puede suspenderla sin problema, porque los corticoides no generan ningún efecto al retirarlos.', FALSE, 'El eje suprarrenal puede estar suprimido.', 1),
      (v_pregunta, 'Que la deje un día sí y otro no durante una semana, sin consultar al médico.', FALSE, 'El esquema de retiro lo define el médico.', 2),
      (v_pregunta, 'Que la cambie por dexametasona a la misma dosis, que se puede suspender de golpe.', FALSE, 'Cambiar de molécula no evita el riesgo de supresión.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fend-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Metabolismo óseo e hipófisis' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Metabolismo óseo e hipófisis) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Metabolismo óseo e hipófisis';
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


    v_t3 := '¿Cuál es la forma correcta de tomar el alendronato oral semanal?';
    v_t4 := 'Los bisfosfonatos orales tienen una absorción muy baja que disminuye con alimentos, calcio y otras bebidas. El alendronato se toma en ayunas, con un vaso lleno de agua, y la persona permanece erguida y sin comer al menos 30 minutos, para reducir el riesgo de esofagitis.';
    v_j1 := $evfend_json${"external_id":"fend-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Calcio, vitamina D y bisfosfonatos","outcome":"Calcio, vitamina D y bisfosfonatos","source":"Ficha técnica de alendronato."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En ayunas, con un vaso lleno de agua, y permanecer erguido sin comer durante al menos 30 minutos.', TRUE, 'Correcto. Así se reduce el riesgo esofágico y mejora la absorción.', 0),
      (v_pregunta, 'Con el desayuno y un vaso de leche, para proteger el estómago y absorberlo mejor.', FALSE, 'La leche y los alimentos reducen mucho su absorción.', 1),
      (v_pregunta, 'En la noche, justo antes de acostarse, para que actúe mientras el paciente duerme.', FALSE, 'Acostarse después aumenta el riesgo de lesión esofágica.', 2),
      (v_pregunta, 'Junto con el suplemento de calcio de la mañana, para que ambos actúen al mismo tiempo sobre el hueso.', FALSE, 'El calcio impide su absorción si se toman juntos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una paciente con osteoporosis lleva 10 meses sin su dosis de denosumab, que debía aplicarse cada 6 meses, por trámites con la EPS. ¿Qué hace el QF?';
    v_t4 := 'Al suspender o retrasar el denosumab se produce una pérdida ósea de rebote, con riesgo de fracturas vertebrales múltiples. No debe interrumpirse sin un plan de transición (por lo general, a un bisfosfonato) definido por el médico.';
    v_j1 := $evfend_json${"external_id":"fend-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Denosumab, teriparatida y romosozumab","outcome":"Denosumab, teriparatida y romosozumab","source":"Ficha técnica de denosumab."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tranquilizarla, porque el efecto del denosumab dura años después de la última dosis.', FALSE, 'Su efecto se pierde rápido al suspenderlo.', 0),
      (v_pregunta, 'Advertir el riesgo de pérdida ósea de rebote y fracturas vertebrales; gestionar con urgencia la dosis o el plan de transición.', TRUE, 'Correcto. No se debe interrumpir sin un plan.', 1),
      (v_pregunta, 'Recomendar que suspenda también el calcio y la vitamina D hasta que llegue el denosumab.', FALSE, 'El calcio y la vitamina D deben continuar.', 2),
      (v_pregunta, 'Indicarle que la próxima vez se aplique dos dosis juntas para recuperar el efecto perdido.', FALSE, 'No se duplican dosis de denosumab.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre de 78 años que inició desmopresina por nicturia llega confuso, con náuseas y sodio de 126 mmol/L. Cuenta que toma mucha agua en la noche. ¿Qué análisis es correcto?';
    v_t4 := 'La desmopresina es un análogo de la vasopresina que reduce la producción de orina. Su principal riesgo es la hiponatremia, más frecuente en adultos mayores y con ingesta alta de líquidos; se restringen los líquidos alrededor de la dosis y se vigila el sodio.';
    v_j1 := $evfend_json${"external_id":"fend-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Desmopresina: diabetes insípida, enuresis y riesgo de hiponatremia","outcome":"Desmopresina: diabetes insípida, enuresis y riesgo de hiponatremia","source":"Ficha técnica de desmopresina."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un efecto esperado al inicio que mejora con más agua, para diluir el medicamento.', FALSE, 'Más agua empeora la hiponatremia.', 0),
      (v_pregunta, 'Es una deshidratación por la desmopresina, que aumenta la producción de orina.', FALSE, 'La desmopresina reduce la orina, no la aumenta.', 1),
      (v_pregunta, 'Es una hiponatremia por la desmopresina, favorecida por la edad y la ingesta de líquidos; se remite.', TRUE, 'Correcto. Se educa en la restricción de líquidos alrededor de la dosis.', 2),
      (v_pregunta, 'Es una hiperglucemia por la desmopresina y debe medirse la glucosa de inmediato.', FALSE, 'Los datos apuntan a una alteración del sodio.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una paciente con alendronato desde hace 3 años debe hacerse una extracción dental y quiere dejar el medicamento «para siempre» por miedo a la osteonecrosis. ¿Cuál es la mejor orientación?';
    v_t4 := 'La osteonecrosis maxilar es un riesgo poco frecuente con los bisfosfonatos orales; aumenta con dosis altas intravenosas, cáncer y procedimientos dentales invasivos. Se recomienda revisión dental, buena higiene e informar al odontólogo; las pausas o «vacaciones terapéuticas» se deciden de forma individual con el médico.';
    v_j1 := $evfend_json${"external_id":"fend-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Calcio, vitamina D y bisfosfonatos","outcome":"Calcio, vitamina D y bisfosfonatos","source":"Ficha técnica de alendronato."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que lo deje de inmediato y para siempre, porque la osteonecrosis maxilar es frecuente con bisfosfonatos orales.', FALSE, 'Con bisfosfonatos orales el riesgo es bajo.', 0),
      (v_pregunta, 'Que no informe al odontólogo, para que no le niegue el procedimiento dental.', FALSE, 'El odontólogo debe conocer el tratamiento.', 1),
      (v_pregunta, 'Que pida al médico cambiarlo por denosumab, que no tiene ningún riesgo de osteonecrosis.', FALSE, 'El denosumab también tiene ese riesgo.', 2),
      (v_pregunta, 'Que informe al odontólogo y al médico: el riesgo con orales es bajo y la decisión de pausar es individual.', TRUE, 'Correcto. La higiene dental y la revisión previa ayudan a prevenir.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fend-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Hormonas sexuales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Hormonas sexuales) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Hormonas sexuales';
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


    v_t3 := '¿Cuál de estos métodos anticonceptivos contiene solo progestágeno?';
    v_t4 := 'Los métodos combinados (píldora, parche, anillo, inyectable mensual) contienen estrógeno y progestágeno. Los de solo progestágeno incluyen la píldora de progestágeno, el implante subdérmico, el inyectable trimestral y el DIU con levonorgestrel.';
    v_j1 := $evfend_json${"external_id":"fend-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Tipos de anticoncepción hormonal","outcome":"Tipos de anticoncepción hormonal","source":"Criterios médicos de elegibilidad de la OMS; fichas técnicas."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El anillo vaginal mensual que se deja tres semanas y se retira una semana.', FALSE, 'El anillo contiene estrógeno y progestágeno.', 0),
      (v_pregunta, 'El parche semanal que se cambia tres semanas seguidas y se descansa una semana.', FALSE, 'El parche también es un método combinado.', 1),
      (v_pregunta, 'El implante subdérmico, que libera progestágeno durante varios años.', TRUE, 'Correcto. Es una opción cuando los estrógenos están contraindicados.', 2),
      (v_pregunta, 'El inyectable mensual que combina un estrógeno con un progestágeno en una sola dosis.', FALSE, 'El inyectable mensual es combinado; el trimestral es de solo progestágeno.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una mujer de 27 años con epilepsia que toma carbamazepina usa una píldora anticonceptiva combinada. ¿Qué le indica el QF?';
    v_t4 := 'Los inductores enzimáticos (carbamazepina, fenitoína, rifampicina, entre otros) aumentan el metabolismo de los anticonceptivos hormonales combinados y reducen su eficacia. Se recomiendan métodos no afectados, como el DIU de cobre o el DIU con levonorgestrel, o el inyectable trimestral, según los criterios de la OMS.';
    v_j1 := $evfend_json${"external_id":"fend-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Criterios médicos de elegibilidad OMS e interacciones","outcome":"Criterios médicos de elegibilidad OMS e interacciones","source":"Criterios médicos de elegibilidad de la OMS; ficha técnica de carbamazepina."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que no hay ningún problema, porque los anticonceptivos hormonales no interactúan con los antiepilépticos.', FALSE, 'La carbamazepina es un inductor enzimático.', 0),
      (v_pregunta, 'Que duplique la píldora en los días en que tome la carbamazepina en la noche.', FALSE, 'Duplicar la píldora no es una práctica recomendada.', 1),
      (v_pregunta, 'Que suspenda la carbamazepina mientras use la píldora para que no interfiera.', FALSE, 'Nunca se suspende un antiepiléptico por cuenta propia.', 2),
      (v_pregunta, 'Que la carbamazepina reduce la eficacia de la píldora; consulte por un método no afectado, como un DIU.', TRUE, 'Correcto. Los inductores enzimáticos reducen los niveles hormonales.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una mujer de 52 años con útero recibe una fórmula de terapia hormonal de la menopausia solo con estrógeno. ¿Qué análisis hace el QF?';
    v_t4 := 'En la terapia hormonal de la menopausia, las mujeres con útero necesitan un progestágeno además del estrógeno para proteger el endometrio de la hiperplasia y el cáncer. Se valoran la vía, la ventana de oportunidad y los riesgos (tromboembolismo, cáncer de mama).';
    v_j1 := $evfend_json${"external_id":"fend-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Terapia hormonal de la menopausia","outcome":"Terapia hormonal de la menopausia","source":"Fichas técnicas de la terapia hormonal de la menopausia."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Con útero se necesita añadir un progestágeno para proteger el endometrio; se consulta con el médico.', TRUE, 'Correcto. El estrógeno solo aumenta el riesgo de hiperplasia y cáncer de endometrio.', 0),
      (v_pregunta, 'El estrógeno solo es lo indicado en todas las mujeres, con o sin útero, porque tiene menos riesgos y efectos.', FALSE, 'Solo es adecuado en mujeres sin útero.', 1),
      (v_pregunta, 'Se debe cambiar por testosterona, que controla los sofocos con menos riesgo de trombosis.', FALSE, 'La testosterona no es el tratamiento de los síntomas vasomotores.', 2),
      (v_pregunta, 'El problema es solo la vía oral; si se cambia a parche ya no hace falta nada más.', FALSE, 'La protección del endometrio se necesita con cualquier vía.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un hombre que usa testosterona en gel pregunta si puede cargar a su hija pequeña justo después de aplicárselo. ¿Cuál es la mejor respuesta del QF?';
    v_t4 := 'La testosterona en gel puede transferirse a otras personas por contacto de piel con piel. Se recomienda lavarse las manos tras aplicarla, cubrir la zona con ropa y evitar el contacto con niños y mujeres hasta que se seque y se cubra. También se vigilan hematocrito y PSA durante el tratamiento.';
    v_j1 := $evfend_json${"external_id":"fend-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Testosterona: hipogonadismo masculino, monitorización y uso indebido","outcome":"Testosterona: hipogonadismo masculino, monitorización y uso indebido","source":"Ficha técnica de testosterona en gel."}$evfend_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fend-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que no hay problema, porque la testosterona en gel no pasa a otras personas por la piel.', FALSE, 'La transferencia secundaria por contacto está descrita.', 0),
      (v_pregunta, 'Que se lave las manos y cubra la zona con ropa antes del contacto, por el riesgo de transferencia a la niña.', TRUE, 'Correcto. La transferencia puede causar efectos virilizantes en niños.', 1),
      (v_pregunta, 'Que se aplique el gel en las manos para que se absorba más rápido y así no haya riesgo.', FALSE, 'Las manos son justamente la vía de transferencia.', 2),
      (v_pregunta, 'Que cambie a inyecciones sin consultar al médico, porque el gel está contraindicado en padres de niños pequeños.', FALSE, 'No es una contraindicación; se manejan precauciones.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fend-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Diabetes mellitus: bases terapéuticas e insulinoterapia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Diabetes mellitus: bases terapéuticas e insulinoterapia) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Educación de una persona con diabetes tipo 1 en insulinoterapia';
  v_t2 := $evfend_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Clasifica las hipoglucemias según la ADA, incluida la que tuvo en clase.</li><li>Identifica los errores de técnica (sitio, rotación, agujas) y su relación con la absorción.</li><li>Identifica el problema de conservación y explica sus consecuencias.</li><li>Explica la regla 15-15 y el uso del glucagón, y a quién entrenarías.</li><li>Diseña un plan educativo con demostración y verificación de la técnica.</li><li>Redacta la comunicación al médico con tus hallazgos.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar los errores de técnica y conservación que explican las hipoglucemias.</li><li>Clasificar la hipoglucemia y proponer su prevención y tratamiento.</li><li>Diseñar un plan educativo y la comunicación con el médico.</li></ul>
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
  <tr><td>Hipoglucemia</td><td>25 %</td><td>Clasifica el episodio en clase como nivel 3 y propone glucagón y entrenamiento de compañeros o familia.</td><td>Clasificación correcta sin plan de glucagón.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Técnica y conservación</td><td>30 %</td><td>Relaciona lipohipertrofia, reutilización de agujas y conservación junto al congelador con las glucosas impredecibles.</td><td>Identifica dos de los tres problemas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Plan educativo</td><td>25 %</td><td>Plan con demostración, práctica, verificación y materiales adaptados a su vida de estudiante.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación al médico</td><td>10 %</td><td>Hallazgos claros y propuesta de revisar dosis tras la rotación.</td><td>Comunicación incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfend_html$;
  v_t3 := $evfend_html$<h2>Caso de estudio</h2>
<p>Valentina tiene 19 años, estudia en Pasto y tiene diabetes tipo 1 desde los 12 años (datos simulados). Usa glargina 20 UI en la noche y lispro antes de las comidas. En el último mes tuvo tres hipoglucemias, una con pérdida de conciencia en clase. Se inyecta siempre en el mismo lado del abdomen, reutiliza las agujas una semana y guarda la pluma en uso dentro de la nevera de la residencia, junto al congelador. No tiene glucagón.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfend_html$;
  v_t4 := 'Plan educativo con comunicación al médico.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfend_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Standards of Care in Diabetes 2026 de la ADA; guía de práctica clínica de diabetes tipo 2 del Ministerio de Salud; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (insulinas, metformina, iSGLT2, agonistas GLP-1, levotiroxina, metimazol, glucocorticoides, bisfosfonatos, denosumab, desmopresina, anticonceptivos y testosterona); Criterios médicos de elegibilidad para el uso de anticonceptivos de la OMS; Decreto 780 de 2016 y Resolución 1403 de 2007. Cita en APA 7.</p>$evfend_html$;
  v_t7 := NULL;
  v_j1 := $evfend_json$["Clasificación de la hipoglucemia.","Técnica de inyección.","Conservación.","Tratamiento y glucagón.","Plan educativo y comunicación."]$evfend_json$::jsonb;
  v_j2 := $evfend_json${"version":1,"total":100,"criteria":[{"id":"hipoglucemia","name":"Hipoglucemia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Clasifica el episodio en clase como nivel 3 y propone glucagón y entrenamiento de compañeros o familia."},{"level":3,"label":"Logrado","description":"Clasificación correcta sin plan de glucagón."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"tecnica-y-conservacion","name":"Técnica y conservación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Relaciona lipohipertrofia, reutilización de agujas y conservación junto al congelador con las glucosas impredecibles."},{"level":3,"label":"Logrado","description":"Identifica dos de los tres problemas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"plan-educativo","name":"Plan educativo","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Plan con demostración, práctica, verificación y materiales adaptados a su vida de estudiante."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-al-medico","name":"Comunicación al médico","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Hallazgos claros y propuesta de revisar dosis tras la rotación."},{"level":3,"label":"Logrado","description":"Comunicación incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfend_json$::jsonb;
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


  -- ── Actividad fend-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antidiabéticos no insulínicos y farmacoterapia de la obesidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antidiabéticos no insulínicos y farmacoterapia de la obesidad) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Optimización en diabetes tipo 2 con enfermedad renal e insuficiencia cardiaca';
  v_t2 := $evfend_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Revisa la dosis de metformina frente a la TFG.</li><li>Analiza la glibenclamida y los episodios nocturnos.</li><li>Analiza la pioglitazona en un paciente con insuficiencia cardiaca.</li><li>Propone el antidiabético con beneficio cardiorrenal que corresponde y sus condiciones de inicio.</li><li>Define la educación (días de enfermedad, hipoglucemia, infecciones genitales).</li><li>Define el seguimiento de laboratorio.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Ajustar los antidiabéticos a la función renal y a la comorbilidad.</li><li>Proponer fármacos con beneficio cardiorrenal según ADA 2026.</li><li>Planear la educación y el seguimiento.</li></ul>
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
  <tr><td>Ajustes y retiros</td><td>35 %</td><td>Reduce la metformina a máximo 1.000 mg/día, propone retirar la glibenclamida y la pioglitazona con su justificación.</td><td>Aborda dos de los tres medicamentos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Beneficio cardiorrenal</td><td>30 %</td><td>Propone un iSGLT2 por IC y ERC con albuminuria, con sus condiciones de inicio.</td><td>Propone el fármaco sin condiciones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Educación y seguimiento</td><td>25 %</td><td>Días de enfermedad, signos de cetoacidosis, higiene genital, TFG y potasio en 2-4 semanas.</td><td>Educación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfend_html$;
  v_t3 := $evfend_html$<h2>Caso de estudio</h2>
<p>Don Arturo tiene 68 años, vive en Montería y tiene diabetes tipo 2, insuficiencia cardiaca con FE reducida y enfermedad renal crónica (TFG 41 mL/min; relación albúmina/creatinina 260 mg/g) (datos simulados). Toma metformina 850 mg cada 8 horas, glibenclamida 5 mg cada 12 horas, pioglitazona 30 mg y furosemida. HbA1c 8,2 %. Ha tenido dos episodios de sudoración y temblor en la madrugada.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfend_html$;
  v_t4 := 'Propuesta al médico con plan de educación y seguimiento.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfend_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Standards of Care in Diabetes 2026 de la ADA; guía de práctica clínica de diabetes tipo 2 del Ministerio de Salud; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (insulinas, metformina, iSGLT2, agonistas GLP-1, levotiroxina, metimazol, glucocorticoides, bisfosfonatos, denosumab, desmopresina, anticonceptivos y testosterona); Criterios médicos de elegibilidad para el uso de anticonceptivos de la OMS; Decreto 780 de 2016 y Resolución 1403 de 2007. Cita en APA 7.</p>$evfend_html$;
  v_t7 := NULL;
  v_j1 := $evfend_json$["Metformina y función renal.","Sulfonilurea e hipoglucemia.","Pioglitazona e IC.","Fármaco con beneficio cardiorrenal.","Educación y seguimiento."]$evfend_json$::jsonb;
  v_j2 := $evfend_json${"version":1,"total":100,"criteria":[{"id":"ajustes-y-retiros","name":"Ajustes y retiros","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Reduce la metformina a máximo 1.000 mg/día, propone retirar la glibenclamida y la pioglitazona con su justificación."},{"level":3,"label":"Logrado","description":"Aborda dos de los tres medicamentos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"beneficio-cardiorrenal","name":"Beneficio cardiorrenal","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Propone un iSGLT2 por IC y ERC con albuminuria, con sus condiciones de inicio."},{"level":3,"label":"Logrado","description":"Propone el fármaco sin condiciones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"educacion-y-seguimiento","name":"Educación y seguimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Días de enfermedad, signos de cetoacidosis, higiene genital, TFG y potasio en 2-4 semanas."},{"level":3,"label":"Logrado","description":"Educación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfend_json$::jsonb;
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


  -- ── Actividad fend-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Metabolismo óseo e hipófisis' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Metabolismo óseo e hipófisis) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Osteoporosis inducida por glucocorticoides';
  v_t2 := $evfend_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Explica por qué la prednisona aumenta su riesgo de fractura.</li><li>Identifica los errores de administración del alendronato y del calcio y sus consecuencias.</li><li>Redacta las instrucciones correctas en lenguaje sencillo.</li><li>Analiza la acidez y qué relación tiene con la forma de toma.</li><li>Explica a la paciente las ventajas y el riesgo principal del denosumab si se cambiara.</li><li>Define el seguimiento y la comunicación con el médico.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Corregir la administración del bisfosfonato y del calcio.</li><li>Relacionar el glucocorticoide con el riesgo de fractura.</li><li>Orientar sobre las alternativas y sus riesgos.</li></ul>
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
  <tr><td>Riesgo por glucocorticoides</td><td>15 %</td><td>Explica el aumento del riesgo de fractura desde las primeras semanas de uso.</td><td>Explicación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Administración</td><td>35 %</td><td>Identifica la toma con alimentos y calcio y el acostarse después, y redacta instrucciones correctas.</td><td>Identifica dos de los tres errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acidez y denosumab</td><td>30 %</td><td>Relaciona la acidez con la toma incorrecta y explica el rebote al suspender el denosumab.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Seguimiento</td><td>10 %</td><td>Plan de seguimiento y comunicación al médico.</td><td>Plan general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfend_html$;
  v_t3 := $evfend_html$<h2>Caso de estudio</h2>
<p>Doña Mercedes tiene 63 años, vive en Tunja y toma prednisona 10 mg al día desde hace 8 meses por artritis reumatoide (datos simulados). Le formularon alendronato 70 mg semanal, carbonato de calcio y vitamina D. Toma el alendronato con el café con leche del desayuno, junto con el calcio, y se acuesta un rato porque «le da acidez». Tuvo una fractura de muñeca al caerse en casa. Su hermana le dijo que el denosumab «es mejor y se pone dos veces al año».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfend_html$;
  v_t4 := 'Informe de intervención con instrucciones para la paciente.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfend_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Standards of Care in Diabetes 2026 de la ADA; guía de práctica clínica de diabetes tipo 2 del Ministerio de Salud; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (insulinas, metformina, iSGLT2, agonistas GLP-1, levotiroxina, metimazol, glucocorticoides, bisfosfonatos, denosumab, desmopresina, anticonceptivos y testosterona); Criterios médicos de elegibilidad para el uso de anticonceptivos de la OMS; Decreto 780 de 2016 y Resolución 1403 de 2007. Cita en APA 7.</p>$evfend_html$;
  v_t7 := NULL;
  v_j1 := $evfend_json$["Glucocorticoide y riesgo.","Errores de administración.","Instrucciones correctas.","Acidez.","Denosumab y seguimiento."]$evfend_json$::jsonb;
  v_j2 := $evfend_json${"version":1,"total":100,"criteria":[{"id":"riesgo-por-glucocorticoides","name":"Riesgo por glucocorticoides","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Explica el aumento del riesgo de fractura desde las primeras semanas de uso."},{"level":3,"label":"Logrado","description":"Explicación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"administracion","name":"Administración","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Identifica la toma con alimentos y calcio y el acostarse después, y redacta instrucciones correctas."},{"level":3,"label":"Logrado","description":"Identifica dos de los tres errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acidez-y-denosumab","name":"Acidez y denosumab","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Relaciona la acidez con la toma incorrecta y explica el rebote al suspender el denosumab."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguimiento","name":"Seguimiento","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Plan de seguimiento y comunicación al médico."},{"level":3,"label":"Logrado","description":"Plan general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfend_json$::jsonb;
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


  -- ── Actividad fend-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Tiroides y glucocorticoides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Tiroides y glucocorticoides) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: diabetes, tiroides y glucocorticoides de Doña Liliana';
  v_t2 := $evfend_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Lee el caso y elabora el estado de situación de cada problema endocrino.</li><li>Fase 1: analiza el riesgo de hipoglucemia con la glimepirida y qué educación necesita.</li><li>Fase 2: revisa la metformina y propone opciones según sus comorbilidades y el efecto de la prednisona sobre la glucosa.</li><li>Fase 3: corrige la toma de la levotiroxina y explica qué interacciones tiene.</li><li>Fase 3: explica los riesgos de la prednisona a largo plazo y por qué no debe suspenderse de golpe.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (insulinoterapia).</strong> Riesgo de hipoglucemia y criterios para una eventual insulina.</li>
  <li><strong>Fase 2 · Unidad 2 (antidiabéticos).</strong> Revisión de metformina y glimepirida y opciones por comorbilidad.</li>
  <li><strong>Fase 3 · Unidad 3 (tiroides y glucocorticoides).</strong> Toma de la levotiroxina y riesgos de la prednisona.</li>
  <li><strong>Fase 4 · Unidad 4 (hueso).</strong> Prevención de fracturas por glucocorticoides y uso correcto del alendronato.</li>
  <li><strong>Fase 5 · Unidad 5 (hormonas sexuales).</strong> Orientación sobre la terapia hormonal de la menopausia y seguimiento integral.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Revisar la farmacoterapia endocrina de una paciente polimedicada.</li><li>Proponer ajustes y educación en diabetes, tiroides y glucocorticoides.</li></ul>
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
  <tr><td>Diabetes</td><td>30 %</td><td>Analiza la hipoglucemia por glimepirida, el efecto hiperglucemiante de la prednisona y propone opciones.</td><td>Análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Levotiroxina</td><td>25 %</td><td>Corrige la toma (ayunas, agua, separar calcio) y propone control de TSH.</td><td>Corrige la toma sin control.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Prednisona</td><td>25 %</td><td>Explica riesgos (glucosa, hueso, eje suprarrenal) y el retiro gradual.</td><td>Explica dos riesgos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Estado de situación</td><td>10 %</td><td>Relaciona cada problema con su medicamento y parámetro.</td><td>Estado incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfend_html$;
  v_t3 := $evfend_html$<h2>Caso de estudio</h2>
<p>Doña Liliana tiene 56 años, vive en Barranquilla y es posmenopáusica (datos simulados). Tiene diabetes tipo 2 con metformina y glimepirida, hipotiroidismo con levotiroxina, artritis reumatoide con prednisona 7,5 mg al día desde hace un año y osteopenia. Toma la levotiroxina con el desayuno y el calcio, y le formularon alendronato que aún no ha empezado. Tiene sofocos intensos y pregunta por «hormonas». Su EPS la asignó al programa de seguimiento donde tú eres el QF responsable. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfend_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfend_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Standards of Care in Diabetes 2026 de la ADA; guía de práctica clínica de diabetes tipo 2 del Ministerio de Salud; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (insulinas, metformina, iSGLT2, agonistas GLP-1, levotiroxina, metimazol, glucocorticoides, bisfosfonatos, denosumab, desmopresina, anticonceptivos y testosterona); Criterios médicos de elegibilidad para el uso de anticonceptivos de la OMS; Decreto 780 de 2016 y Resolución 1403 de 2007. Cita en APA 7.</p>$evfend_html$;
  v_t7 := NULL;
  v_j1 := $evfend_json$["Estado de situación.","Hipoglucemia y antidiabéticos.","Levotiroxina.","Prednisona."]$evfend_json$::jsonb;
  v_j2 := $evfend_json${"version":1,"total":100,"criteria":[{"id":"diabetes","name":"Diabetes","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Analiza la hipoglucemia por glimepirida, el efecto hiperglucemiante de la prednisona y propone opciones."},{"level":3,"label":"Logrado","description":"Análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"levotiroxina","name":"Levotiroxina","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Corrige la toma (ayunas, agua, separar calcio) y propone control de TSH."},{"level":3,"label":"Logrado","description":"Corrige la toma sin control."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"prednisona","name":"Prednisona","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica riesgos (glucosa, hueso, eje suprarrenal) y el retiro gradual."},{"level":3,"label":"Logrado","description":"Explica dos riesgos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"estado-de-situacion","name":"Estado de situación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Relaciona cada problema con su medicamento y parámetro."},{"level":3,"label":"Logrado","description":"Estado incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfend_json$::jsonb;
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


  -- ── Actividad fend-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Hormonas sexuales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Hormonas sexuales) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: plan integral endocrino de Doña Liliana';
  v_t2 := $evfend_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: diseña las instrucciones de inicio del alendronato y la suplementación de calcio y vitamina D.</li><li>Fase 5: analiza si la terapia hormonal de la menopausia podría considerarse y qué evaluaría el médico (útero, riesgos, contraindicaciones).</li><li>Fase 5: diseña el seguimiento integral (glucosa, TSH, hueso, presión) y la farmacovigilancia.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (insulinoterapia).</strong> Riesgo de hipoglucemia y criterios para una eventual insulina.</li>
  <li><strong>Fase 2 · Unidad 2 (antidiabéticos).</strong> Revisión de metformina y glimepirida y opciones por comorbilidad.</li>
  <li><strong>Fase 3 · Unidad 3 (tiroides y glucocorticoides).</strong> Toma de la levotiroxina y riesgos de la prednisona.</li>
  <li><strong>Fase 4 · Unidad 4 (hueso).</strong> Prevención de fracturas por glucocorticoides y uso correcto del alendronato.</li>
  <li><strong>Fase 5 · Unidad 5 (hormonas sexuales).</strong> Orientación sobre la terapia hormonal de la menopausia y seguimiento integral.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar la prevención de fracturas en el plan.</li><li>Orientar sobre la terapia hormonal de la menopausia y diseñar el seguimiento.</li></ul>
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
  <tr><td>Hueso</td><td>25 %</td><td>Instrucciones correctas del alendronato y del calcio y vitamina D, con revisión dental.</td><td>Instrucciones con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Menopausia</td><td>25 %</td><td>Orientación prudente: progestágeno si tiene útero, riesgos, decisión médica.</td><td>Orientación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Seguimiento</td><td>25 %</td><td>Parámetros, frecuencias y reacciones a vigilar con su reporte.</td><td>Seguimiento incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfend_html$;
  v_t3 := $evfend_html$<h2>Caso de estudio</h2>
<p>Doña Liliana tiene 56 años, vive en Barranquilla y es posmenopáusica (datos simulados). Tiene diabetes tipo 2 con metformina y glimepirida, hipotiroidismo con levotiroxina, artritis reumatoide con prednisona 7,5 mg al día desde hace un año y osteopenia. Toma la levotiroxina con el desayuno y el calcio, y le formularon alendronato que aún no ha empezado. Tiene sofocos intensos y pregunta por «hormonas». Su EPS la asignó al programa de seguimiento donde tú eres el QF responsable. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás al comité del programa.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfend_html$;
  v_t4 := 'Plan integral de seguimiento con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfend_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Standards of Care in Diabetes 2026 de la ADA; guía de práctica clínica de diabetes tipo 2 del Ministerio de Salud; fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (insulinas, metformina, iSGLT2, agonistas GLP-1, levotiroxina, metimazol, glucocorticoides, bisfosfonatos, denosumab, desmopresina, anticonceptivos y testosterona); Criterios médicos de elegibilidad para el uso de anticonceptivos de la OMS; Decreto 780 de 2016 y Resolución 1403 de 2007. Cita en APA 7.</p>$evfend_html$;
  v_t7 := NULL;
  v_j1 := $evfend_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Alendronato, calcio y vitamina D.","Terapia hormonal de la menopausia.","Seguimiento y farmacovigilancia.","Resumen ejecutivo."]$evfend_json$::jsonb;
  v_j2 := $evfend_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"hueso","name":"Hueso","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Instrucciones correctas del alendronato y del calcio y vitamina D, con revisión dental."},{"level":3,"label":"Logrado","description":"Instrucciones con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"menopausia","name":"Menopausia","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Orientación prudente: progestágeno si tiene útero, riesgos, decisión médica."},{"level":3,"label":"Logrado","description":"Orientación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"seguimiento","name":"Seguimiento","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Parámetros, frecuencias y reacciones a vigilar con su reporte."},{"level":3,"label":"Logrado","description":"Seguimiento incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfend_json$::jsonb;
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


  -- ── Foro fend-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con medicamentos hormonales';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfend_html$<h2>Para empezar</h2>
<p>Piensa en una persona que hayas atendido o acompañado con diabetes, tiroides, osteoporosis o terapia hormonal y cuéntanos en tres o cuatro líneas una duda que tuvo sobre sus medicamentos, sin nombres ni datos que la identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfend_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre medicamentos endocrinos te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfend_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfend_html$;
  v_t6 := $evfend_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfend_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Qué medicamento endocrino te parece más difícil de explicar a un paciente?', '¿Has visto errores frecuentes en la forma de tomar la levotiroxina o el alendronato?']::text[];
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


  -- ── Foro fend-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Diabetes mellitus: bases terapéuticas e insulinoterapia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Diabetes mellitus: bases terapéuticas e insulinoterapia) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Insulina en casa sin nevera';
  v_t2 := 'Argumentar cómo garantizar la conservación de la insulina cuando el paciente no tiene condiciones ideales.';
  v_t3 := $evfend_html$<h2>Caso del foro</h2>
<p>Una droguería de un municipio de clima cálido dispensa insulina a pacientes de zonas rurales (datos simulados). Algunos no tienen nevera, otros viajan dos horas en moto con la insulina en un bolso y una señora la guarda junto al congelador «para que esté bien fría».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfend_html$;
  v_t4 := '¿Qué recomendaciones darías a cada paciente y qué debería hacer la droguería para proteger la cadena de frío?';
  v_t5 := $evfend_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el dato del inserto o la norma que sustenta cada recomendación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfend_html$;
  v_t6 := $evfend_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el dato del inserto o la norma que sustenta cada recomendación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfend_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Cuánto tiempo puede estar una pluma en uso a temperatura ambiente y dónde se verifica?', '¿Qué señales indican que la insulina se dañó?', '¿Qué registros de temperatura debe llevar el servicio farmacéutico?']::text[];
  v_j1 := $evfend_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el dato del inserto o la norma que sustenta cada recomendación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfend_json$::jsonb;
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


  -- ── Foro fend-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Antidiabéticos no insulínicos y farmacoterapia de la obesidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Antidiabéticos no insulínicos y farmacoterapia de la obesidad) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Agonistas GLP-1 para bajar de peso: ¿quién decide?';
  v_t2 := 'Argumentar el uso responsable de los fármacos para la obesidad y el papel del QF ante la demanda estética.';
  v_t3 := $evfend_html$<h2>Caso del foro</h2>
<p>En un mes, una droguería recibe muchas solicitudes de semaglutida y tirzepatida (datos simulados): una mujer de 30 años con IMC de 24 que quiere «bajar dos kilos», un hombre de 50 años con IMC de 36 y diabetes con fórmula, y una persona que trae un vial comprado por redes «para que le enseñen a inyectárselo».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfend_html$;
  v_t4 := '¿Cómo responderías a cada persona y qué riesgos debe comunicar el servicio farmacéutico?';
  v_t5 := $evfend_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la alerta sanitaria que sustenta cada respuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfend_html$;
  v_t6 := $evfend_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la alerta sanitaria que sustenta cada respuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfend_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué criterios de IMC usan las fichas técnicas para el control del peso?', '¿Qué contraindicaciones verificarías antes de dispensar?', '¿Qué harías con el vial comprado por redes?']::text[];
  v_j1 := $evfend_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la alerta sanitaria que sustenta cada respuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfend_json$::jsonb;
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


  -- ── Foro fend-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Tiroides y glucocorticoides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Tiroides y glucocorticoides) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Levotiroxina: ¿cambiar de marca sin avisar?';
  v_t2 := 'Argumentar por qué los cambios de producto de un medicamento de margen estrecho requieren comunicación y control.';
  v_t3 := $evfend_html$<h2>Caso del foro</h2>
<p>Por un cambio de proveedor, una EPS empieza a entregar una levotiroxina de otro laboratorio (datos simulados). Una paciente con cáncer de tiroides operado, que necesita una TSH muy controlada, nota palpitaciones; otra paciente toma la tableta con café, calcio y omeprazol, y su TSH subió.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfend_html$;
  v_t4 := '¿Qué debería hacer el servicio farmacéutico ante el cambio de producto y ante los problemas de cada paciente?';
  v_t5 := $evfend_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfend_html$;
  v_t6 := $evfend_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfend_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué la levotiroxina se considera de margen terapéutico estrecho?', '¿Cuándo se recomienda controlar la TSH tras un cambio de producto o de dosis?', '¿Qué interacciones explican la TSH alta de la segunda paciente?']::text[];
  v_j1 := $evfend_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfend_json$::jsonb;
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


  -- ── Foro fend-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Metabolismo óseo e hipófisis' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Metabolismo óseo e hipófisis) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Denosumab interrumpido por trámites';
  v_t2 := 'Argumentar por qué ciertas interrupciones de tratamiento son riesgosas y cómo debe actuar el servicio farmacéutico.';
  v_t3 := $evfend_html$<h2>Caso del foro</h2>
<p>Un servicio farmacéutico encuentra que 30 pacientes con denosumab llevan más de 8 meses sin su dosis por demoras de autorización (datos simulados). Algunos creen que «ya no lo necesitan», otros esperan la autorización y dos ya tuvieron fracturas vertebrales.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfend_html$;
  v_t4 := '¿Qué debería hacer el servicio farmacéutico y por qué este caso es distinto a la interrupción de otros medicamentos para el hueso?';
  v_t5 := $evfend_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la recomendación que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfend_html$;
  v_t6 := $evfend_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfend_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué ocurre con el hueso al suspender el denosumab?', '¿Qué alternativas de transición existen?', '¿Cómo se prioriza a los pacientes en riesgo?']::text[];
  v_j1 := $evfend_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la recomendación que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfend_json$::jsonb;
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


  -- ── Foro fend-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Hormonas sexuales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Hormonas sexuales) en Farmacología Endocrina: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Anticoncepción en la droguería';
  v_t2 := 'Argumentar cómo orientar sobre anticoncepción hormonal con los criterios de elegibilidad de la OMS.';
  v_t3 := $evfend_html$<h2>Caso del foro</h2>
<p>En una droguería se presentan tres mujeres (datos simulados): una de 38 años, fumadora de 20 cigarrillos al día, que pide «la misma pastilla de su hermana»; una de 24 años con migraña con aura que quiere iniciar el anillo vaginal; y una de 30 años que tomó lamotrigina y dice que desde que empezó la píldora «le volvieron las crisis».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfend_html$;
  v_t4 := '¿Qué orientación darías a cada una con los criterios de elegibilidad de la OMS?';
  v_t5 := $evfend_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la categoría de la OMS o el dato de la ficha técnica que sustenta cada orientación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfend_html$;
  v_t6 := $evfend_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la categoría de la OMS o el dato de la ficha técnica que sustenta cada orientación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfend_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué significan las categorías 1 a 4 de los criterios de la OMS?', '¿Qué métodos podrían usar las mujeres a quienes no les conviene un método combinado?', '¿Por qué la píldora puede bajar los niveles de lamotrigina?']::text[];
  v_j1 := $evfend_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la categoría de la OMS o el dato de la ficha técnica que sustenta cada orientación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfend_json$::jsonb;
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


  RAISE NOTICE 'Farmacología Endocrina: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfend$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Farmacología del Sistema Nervioso Central
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evfsnc$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Farmacología del Sistema Nervioso Central' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Bases de la neurofarmacología y anestésicos', 'Unidad 2. Dolor: analgésicos opioides y no opioides', 'Unidad 3. Antiepilépticos', 'Unidad 4. Enfermedades neurodegenerativas: Parkinson y demencias', 'Unidad 5. Migraña, esclerosis múltiple y relajantes musculares']::text[])) < 5 THEN
    RAISE NOTICE 'Farmacología del Sistema Nervioso Central: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evfsnc_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evfsnc_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz fsnc-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Bases de la neurofarmacología y anestésicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Bases de la neurofarmacología y anestésicos) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Bases de la neurofarmacología y anestésicos';
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


    v_t3 := '¿Cuál es el mecanismo de acción de los anestésicos locales como la lidocaína y la bupivacaína?';
    v_t4 := 'Los anestésicos locales bloquean los canales de sodio dependientes de voltaje y detienen la conducción nerviosa. Se dividen en ésteres (hidrolizados por esterasas plasmáticas) y amidas (metabolizadas en el hígado). El vasoconstrictor prolonga su efecto y reduce su absorción sistémica.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Anestésicos locales: mecanismo, tipos y toxicidad","outcome":"Anestésicos locales: mecanismo, tipos y toxicidad","source":"Fichas técnicas de lidocaína y bupivacaína."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Activan los receptores GABA-A de la médula espinal y producen una sedación profunda, intensa y transitoria.', FALSE, 'Ese no es su mecanismo; actúan sobre la conducción nerviosa.', 0),
      (v_pregunta, 'Bloquean los receptores opioides mu de las terminaciones nerviosas de la piel y de las mucosas.', FALSE, 'No actúan sobre receptores opioides.', 1),
      (v_pregunta, 'Inhiben la ciclooxigenasa en el sitio de la lesión y reducen la producción de prostaglandinas.', FALSE, 'Ese es el mecanismo de los AINE.', 2),
      (v_pregunta, 'Bloquean los canales de sodio dependientes de voltaje e impiden la conducción del impulso nervioso.', TRUE, 'Correcto. Por eso su toxicidad afecta al corazón y al SNC.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Durante un bloqueo con bupivacaína, una paciente refiere sabor metálico, adormecimiento alrededor de la boca y zumbido de oídos, y luego convulsiona. ¿Qué medicamento debe estar disponible de inmediato?';
    v_t4 := 'La toxicidad sistémica por anestésicos locales se manifiesta con síntomas neurológicos (sabor metálico, parestesias peribucales, tinnitus, convulsiones) y cardiovasculares (arritmias, colapso). Además del soporte vital, se administra emulsión lipídica al 20 %; el servicio farmacéutico garantiza su disponibilidad donde se aplican bloqueos.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso clínico: toxicidad sistémica por anestésicos locales e hipertermia maligna","outcome":"Caso clínico: toxicidad sistémica por anestésicos locales e hipertermia maligna","source":"Recomendaciones de manejo de la toxicidad sistémica por anestésicos locales; fichas técnicas."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Dantroleno intravenoso, que es el antídoto de todas las reacciones a anestésicos.', FALSE, 'El dantroleno es para la hipertermia maligna.', 0),
      (v_pregunta, 'Emulsión lipídica al 20 %, que se usa en la toxicidad sistémica por anestésicos locales.', TRUE, 'Correcto. Junto con el soporte vital y el control de las convulsiones.', 1),
      (v_pregunta, 'Naloxona intravenosa, porque los síntomas son de una sobredosis de opioides.', FALSE, 'Los síntomas no corresponden a una sobredosis de opioides.', 2),
      (v_pregunta, 'Flumazenil intravenoso, porque revierte el efecto de todos los anestésicos locales sobre el cerebro.', FALSE, 'El flumazenil revierte benzodiacepinas.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Por qué la loperamida, que es un opioide, no produce efectos sobre el SNC a dosis habituales?';
    v_t4 := 'La barrera hematoencefálica limita el paso de fármacos al SNC por las uniones estrechas y por transportadores de salida como la glicoproteína P. La loperamida es sustrato de la gp-P; a dosis muy altas o con inhibidores de la gp-P puede tener efectos centrales y cardiacos.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Barrera hematoencefálica y farmacocinética en el SNC","outcome":"Barrera hematoencefálica y farmacocinética en el SNC","source":"Ficha técnica de loperamida; farmacología de la barrera hematoencefálica."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque se elimina por el riñón en minutos y nunca alcanza concentraciones en la sangre.', FALSE, 'Su efecto limitado no se explica por una eliminación renal rápida.', 0),
      (v_pregunta, 'Porque no se une a los receptores opioides, sino a receptores de serotonina de la pared del intestino.', FALSE, 'Sí actúa sobre receptores opioides intestinales.', 1),
      (v_pregunta, 'Porque la glicoproteína P de la barrera hematoencefálica la expulsa y limita su paso al cerebro.', TRUE, 'Correcto. Con inhibidores de la gp-P o dosis muy altas puede tener efectos centrales.', 2),
      (v_pregunta, 'Porque es tan hidrosoluble que no puede atravesar ninguna membrana del cuerpo.', FALSE, 'Sí se absorbe y llega a la sangre en cierta medida.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un hospital que realiza cirugías con anestésicos inhalados y succinilcolina decide «no tener dantroleno porque la hipertermia maligna es muy rara». ¿Cuál es la mejor valoración del QF?';
    v_t4 := 'La hipertermia maligna es una reacción farmacogenética desencadenada por anestésicos volátiles y succinilcolina; su tratamiento específico es el dantroleno, que debe estar disponible de inmediato donde se usan esos desencadenantes.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso clínico: toxicidad sistémica por anestésicos locales e hipertermia maligna","outcome":"Caso clínico: toxicidad sistémica por anestésicos locales e hipertermia maligna","source":"Ficha técnica de dantroleno; recomendaciones de manejo de la hipertermia maligna."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es errada: donde se usan esos desencadenantes debe haber dantroleno disponible de inmediato.', TRUE, 'Correcto. Es una emergencia rara pero mortal.', 0),
      (v_pregunta, 'Es correcta: basta con enfriar al paciente con hielo y sueros fríos, que resuelve la hipertermia maligna.', FALSE, 'El enfriamiento ayuda, pero el tratamiento específico es el dantroleno.', 1),
      (v_pregunta, 'Es correcta: si ocurre, se puede pedir el dantroleno a otro hospital y esperar su llegada.', FALSE, 'La demora en el tratamiento aumenta la mortalidad.', 2),
      (v_pregunta, 'Es errada solo porque el dantroleno también sirve como relajante muscular en la cirugía.', FALSE, 'Su papel aquí es el de tratamiento de la hipertermia maligna.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fsnc-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Dolor: analgésicos opioides y no opioides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Dolor: analgésicos opioides y no opioides) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Dolor: analgésicos opioides y no opioides';
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


    v_t3 := '¿Qué caracteriza a la buprenorfina como opioide?';
    v_t4 := 'Los opioides se clasifican en agonistas puros (morfina, fentanilo), agonistas parciales (buprenorfina) y mixtos. La buprenorfina, agonista parcial del receptor mu, tiene efecto techo en la depresión respiratoria y puede desencadenar abstinencia en personas que reciben agonistas puros.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Receptores opioides, agonistas y agonistas parciales","outcome":"Receptores opioides, agonistas y agonistas parciales","source":"Ficha técnica de buprenorfina."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es un agonista parcial del receptor mu, con efecto techo en la depresión respiratoria.', TRUE, 'Correcto. También puede desencadenar abstinencia en quien usa agonistas puros.', 0),
      (v_pregunta, 'Es un antagonista puro que se usa para revertir las sobredosis de otros opioides.', FALSE, 'Ese papel corresponde a la naloxona.', 1),
      (v_pregunta, 'Es un agonista puro de corta duración que se usa solo en anestesia intravenosa.', FALSE, 'No es un agonista puro.', 2),
      (v_pregunta, 'Es un opioide que actúa solo en el intestino y que no tiene ningún efecto analgésico central.', FALSE, 'Tiene efecto analgésico central.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una madre que lacta pide una fórmula con codeína para un dolor dental. ¿Qué le indica el QF?';
    v_t4 := 'La codeína se transforma en morfina por el CYP2D6. En metabolizadoras ultrarrápidas se produce mucha morfina, que puede pasar a la leche y causar depresión respiratoria en el lactante. Las agencias contraindican la codeína en la lactancia y la restringen en niños.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Farmacocinética de los opioides y particularidades por molécula","outcome":"Farmacocinética de los opioides y particularidades por molécula","source":"Comunicación de seguridad de la EMA sobre codeína; ficha técnica de codeína."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que puede usarla sin problema, porque la codeína no pasa a la leche materna.', FALSE, 'Sí puede pasar morfina a la leche.', 0),
      (v_pregunta, 'Que la use solo en la noche, cuando el bebé duerme más horas, para evitar efectos.', FALSE, 'El horario no elimina el riesgo.', 1),
      (v_pregunta, 'Que no se recomienda en la lactancia: en metabolizadoras ultrarrápidas puede pasar mucha morfina al bebé.', TRUE, 'Correcto. Se consulta por una alternativa.', 2),
      (v_pregunta, 'Que duplique la dosis para acortar el tratamiento y exponer menos días al bebé.', FALSE, 'Duplicar la dosis aumenta el riesgo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente de 70 kg toma acetaminofén 1 g cada 6 horas, además de un antigripal con acetaminofén y un analgésico combinado para la cabeza. Bebe alcohol los fines de semana. ¿Qué análisis hace el QF?';
    v_t4 := 'El paracetamol (acetaminofén) tiene un techo analgésico y su toxicidad es hepática; la dosis máxima habitual en adultos es de 4 g al día y debe ser menor con consumo de alcohol o enfermedad hepática. La causa frecuente de sobredosis es la suma de productos combinados.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"AINE y paracetamol en el manejo del dolor: visión desde el SNC","outcome":"AINE y paracetamol en el manejo del dolor: visión desde el SNC","source":"Ficha técnica de paracetamol."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No hay riesgo, porque el acetaminofén solo es tóxico si se toma con el estómago vacío.', FALSE, 'La toxicidad depende de la dosis total, no del estómago vacío.', 0),
      (v_pregunta, 'El único problema es gástrico, porque el acetaminofén irrita la mucosa como los AINE.', FALSE, 'El riesgo principal es hepático.', 1),
      (v_pregunta, 'El riesgo es solo renal, porque el acetaminofén se elimina completo por el riñón sin metabolizarse en el hígado.', FALSE, 'Se metaboliza en el hígado y su toxicidad es hepática.', 2),
      (v_pregunta, 'Probablemente supera la dosis máxima diaria al sumar productos, con riesgo hepático aumentado por el alcohol.', TRUE, 'Correcto. Se revisan todos los productos que contienen acetaminofén.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'En urgencias, un paciente con sobredosis de un opioide de liberación prolongada se recupera con una dosis de naloxona. El médico propone darle de alta de inmediato. ¿Cuál es la mejor valoración?';
    v_t4 := 'La naloxona es un antagonista opioide de acción corta; en sobredosis por opioides de acción prolongada la depresión respiratoria puede reaparecer cuando su efecto termina. Se requiere observación y pueden necesitarse dosis repetidas o infusión.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Antagonistas opioides: naloxona, naltrexona y antagonistas periféricos","outcome":"Antagonistas opioides: naloxona, naltrexona y antagonistas periféricos","source":"Ficha técnica de naloxona."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: una vez despierto, el efecto de la naloxona dura más que el del opioide.', FALSE, 'Ocurre lo contrario.', 0),
      (v_pregunta, 'Es errada: la naloxona dura menos que muchos opioides y puede reaparecer la depresión respiratoria; se observa.', TRUE, 'Correcto. Pueden necesitarse dosis repetidas o infusión.', 1),
      (v_pregunta, 'Es correcta si se le entrega una tableta de naltrexona para tomar en casa esa noche.', FALSE, 'La naltrexona no reemplaza la observación.', 2),
      (v_pregunta, 'Es errada solo porque la naloxona debe darse siempre por vía oral para que dure más.', FALSE, 'La vía oral no es la adecuada en la sobredosis.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fsnc-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Antiepilépticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Antiepilépticos) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Antiepilépticos';
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


    v_t3 := '¿Qué implica que la fenitoína tenga una cinética no lineal?';
    v_t4 := 'La fenitoína tiene una cinética saturable (no lineal): cerca del rango terapéutico, pequeños aumentos de dosis producen grandes aumentos de la concentración y toxicidad (nistagmo, ataxia). La carbamazepina se autoinduce y el valproato es un inhibidor enzimático.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Antiepilépticos clásicos y monitorización de niveles plasmáticos","outcome":"Antiepilépticos clásicos y monitorización de niveles plasmáticos","source":"Ficha técnica de fenitoína."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que su efecto antiepiléptico aparece solo después de varios meses de tratamiento continuo y sin interrupciones.', FALSE, 'La cinética no lineal no se refiere al tiempo de inicio del efecto.', 0),
      (v_pregunta, 'Que un aumento pequeño de la dosis puede elevar mucho la concentración y causar toxicidad.', TRUE, 'Correcto. Su metabolismo se satura dentro del rango terapéutico.', 1),
      (v_pregunta, 'Que su concentración no cambia aunque se duplique la dosis del medicamento.', FALSE, 'Ocurre lo contrario: puede subir de forma desproporcionada.', 2),
      (v_pregunta, 'Que se elimina por el riñón sin metabolizarse y no necesita monitorización.', FALSE, 'Se metaboliza en el hígado y suele requerir monitorización.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'A una paciente que toma valproato le van a iniciar lamotrigina. ¿Qué advierte el QF al médico?';
    v_t4 := 'El valproato inhibe el metabolismo de la lamotrigina y aumenta sus concentraciones; la ficha técnica pide reducir la dosis y titular más despacio por el riesgo de erupciones cutáneas graves. Los inductores (carbamazepina, fenitoína) tienen el efecto contrario.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Inducción e inhibición enzimática con antiepilépticos","outcome":"Inducción e inhibición enzimática con antiepilépticos","source":"Ficha técnica de lamotrigina."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que el valproato acelera la eliminación de la lamotrigina y por eso hay que duplicar su dosis desde el inicio.', FALSE, 'El valproato hace lo contrario: la inhibe.', 0),
      (v_pregunta, 'Que no hay interacción porque los dos antiepilépticos actúan en receptores distintos.', FALSE, 'La interacción es farmacocinética.', 1),
      (v_pregunta, 'Que la combinación está prohibida y debe elegirse otro antiepiléptico.', FALSE, 'Se pueden combinar con ajuste de dosis.', 2),
      (v_pregunta, 'Que el valproato aumenta las concentraciones de lamotrigina y su dosis y titulación deben reducirse.', TRUE, 'Correcto. Aumenta el riesgo de erupciones graves.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hombre de 28 años con ascendencia del sudeste asiático va a iniciar carbamazepina. ¿Qué análisis hace el QF?';
    v_t4 := 'El alelo HLA-B*1502 se asocia a síndrome de Stevens-Johnson y necrólisis epidérmica tóxica con carbamazepina, sobre todo en personas de ascendencia asiática; se recomienda la prueba antes de iniciar en esas poblaciones. El HLA-A*3101 también se asocia a reacciones de hipersensibilidad.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Seguridad: teratogenicidad del valproato y HLA-B*1502 con carbamazepina","outcome":"Seguridad: teratogenicidad del valproato y HLA-B*1502 con carbamazepina","source":"Ficha técnica de carbamazepina."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Conviene la prueba del alelo HLA-B*1502 antes de iniciar, por el riesgo de síndrome de Stevens-Johnson.', TRUE, 'Correcto. Si es positivo, se evita la carbamazepina.', 0),
      (v_pregunta, 'No hay ningún riesgo especial, porque las reacciones cutáneas graves no dependen del origen ni de la genética.', FALSE, 'El riesgo se asocia a alelos HLA más frecuentes en ciertas poblaciones.', 1),
      (v_pregunta, 'Debe iniciar con la dosis máxima para evitar que la autoinducción reduzca el efecto.', FALSE, 'Se inicia con dosis bajas y se titula.', 2),
      (v_pregunta, 'Debe tomar un antihistamínico diario para prevenir cualquier reacción cutánea.', FALSE, 'El antihistamínico no previene estas reacciones graves.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una mujer de 24 años con epilepsia controlada con valproato dice que quiere quedar embarazada y que dejará el medicamento «desde ya». ¿Cuál es la mejor respuesta del QF?';
    v_t4 := 'El valproato tiene un riesgo alto de malformaciones y de alteraciones del neurodesarrollo; las agencias exigen un programa de prevención del embarazo en mujeres en edad fértil. El cambio de tratamiento se planea con el neurólogo antes de concebir; la suspensión brusca puede causar crisis.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Seguridad: teratogenicidad del valproato y HLA-B*1502 con carbamazepina","outcome":"Seguridad: teratogenicidad del valproato y HLA-B*1502 con carbamazepina","source":"Comunicaciones de seguridad de la EMA y del INVIMA sobre valproato; ficha técnica."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que lo suspenda de inmediato, porque es la única forma de proteger al bebé.', FALSE, 'Suspender de golpe puede desencadenar crisis graves.', 0),
      (v_pregunta, 'Que siga igual, porque el valproato es el antiepiléptico más seguro en el embarazo.', FALSE, 'El valproato tiene un riesgo teratogénico alto.', 1),
      (v_pregunta, 'Que no lo suspenda por su cuenta y consulte antes de concebir para planear un cambio con el neurólogo.', TRUE, 'Correcto. Existe un programa de prevención del embarazo.', 2),
      (v_pregunta, 'Que duplique el ácido fólico y así puede seguir con el valproato sin ningún riesgo.', FALSE, 'El ácido fólico no elimina el riesgo del valproato.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fsnc-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Enfermedades neurodegenerativas: Parkinson y demencias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Enfermedades neurodegenerativas: Parkinson y demencias) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Enfermedades neurodegenerativas: Parkinson y demencias';
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


    v_t3 := '¿Por qué la levodopa se combina con carbidopa?';
    v_t4 := 'La carbidopa inhibe la dopa-descarboxilasa periférica y no atraviesa la barrera hematoencefálica; así llega más levodopa al cerebro y se reducen efectos periféricos como las náuseas. Las proteínas de la dieta compiten con la levodopa por su transporte.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Levodopa/carbidopa: mecanismo, farmacocinética y complicaciones motoras","outcome":"Levodopa/carbidopa: mecanismo, farmacocinética y complicaciones motoras","source":"Ficha técnica de levodopa/carbidopa."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque la carbidopa es un agonista dopaminérgico que suma su efecto en el cerebro.', FALSE, 'La carbidopa no actúa como agonista.', 0),
      (v_pregunta, 'Porque la carbidopa acelera el paso de la levodopa por la barrera hematoencefálica.', FALSE, 'No modifica el transporte por la barrera.', 1),
      (v_pregunta, 'Porque la carbidopa inhibe la dopa-descarboxilasa periférica: llega más levodopa al cerebro con menos náuseas.', TRUE, 'Correcto. La carbidopa no atraviesa la barrera hematoencefálica.', 2),
      (v_pregunta, 'Porque la carbidopa impide que la levodopa se absorba con las proteínas de la dieta.', FALSE, 'La competencia con las proteínas sigue existiendo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con enfermedad de Parkinson recibe una fórmula de metoclopramida para las náuseas. ¿Qué hace el QF?';
    v_t4 := 'La metoclopramida es un antagonista de los receptores de dopamina que atraviesa la barrera hematoencefálica; puede empeorar el parkinsonismo y antagonizar la levodopa. En la enfermedad de Parkinson se evita y se buscan alternativas con el médico.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso clínico: Parkinson avanzado con fluctuaciones y trastorno del control de impulsos","outcome":"Caso clínico: Parkinson avanzado con fluctuaciones y trastorno del control de impulsos","source":"Ficha técnica de metoclopramida."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Advierte al médico que la metoclopramida bloquea receptores de dopamina y puede empeorar el parkinsonismo.', TRUE, 'Correcto. Se busca otra alternativa con el médico.', 0),
      (v_pregunta, 'Dispensa sin observaciones, porque la metoclopramida mejora la absorción de la levodopa.', FALSE, 'Su efecto antidopaminérgico central es el problema.', 1),
      (v_pregunta, 'Recomienda tomarla junto con la levodopa para que ambas actúen al mismo tiempo.', FALSE, 'Tomarlas juntas no evita el antagonismo.', 2),
      (v_pregunta, 'Recomienda suspender la levodopa mientras use la metoclopramida para no sumar efectos.', FALSE, 'Nunca se suspende la levodopa de forma brusca.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una adulta mayor con Alzheimer toma donepezilo, bisoprolol y oxibutinina. Tiene frecuencia de 48 lpm, mareos y más confusión. ¿Qué análisis es correcto?';
    v_t4 := 'Los inhibidores de la colinesterasa (donepezilo, rivastigmina, galantamina) pueden causar bradicardia, más con betabloqueadores. Los anticolinérgicos como la oxibutinina se oponen a su efecto y empeoran la cognición en adultos mayores; aumentan la carga anticolinérgica.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso clínico: Alzheimer con carga anticolinérgica y bradicardia","outcome":"Caso clínico: Alzheimer con carga anticolinérgica y bradicardia","source":"Fichas técnicas de donepezilo y oxibutinina."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La bradicardia se debe solo a la edad y la confusión es parte esperada de la enfermedad.', FALSE, 'Hay medicamentos que explican ambos hallazgos.', 0),
      (v_pregunta, 'El donepezilo con el betabloqueador favorece la bradicardia y la oxibutinina anticolinérgica empeora la cognición.', TRUE, 'Correcto. Se revisan ambos con el médico.', 1),
      (v_pregunta, 'La oxibutinina causa la bradicardia y el donepezilo es el que produce la confusión.', FALSE, 'Los efectos son al revés.', 2),
      (v_pregunta, 'La solución es duplicar el donepezilo para contrarrestar la confusión y la bradicardia.', FALSE, 'Subir el donepezilo empeoraría la bradicardia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'La esposa de un paciente con pramipexol cuenta que él empezó a apostar dinero y a comprar de forma compulsiva. Un familiar dice que «son cosas de la edad». ¿Cuál es la mejor valoración?';
    v_t4 := 'Los agonistas dopaminérgicos (pramipexol, ropinirol, rotigotina) se asocian a trastornos del control de impulsos: juego patológico, compras compulsivas, hipersexualidad, atracones. Se informa al médico, que suele reducir o retirar el agonista, y se reporta la reacción.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Agonistas dopaminérgicos, IMAO-B, ICOMT y amantadina","outcome":"Agonistas dopaminérgicos, IMAO-B, ICOMT y amantadina","source":"Fichas técnicas de pramipexol y ropinirol."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcta: los cambios de conducta en Parkinson nunca se relacionan con los medicamentos.', FALSE, 'Los agonistas dopaminérgicos causan este efecto.', 0),
      (v_pregunta, 'Es correcta si el paciente no tiene antecedentes de juego antes del diagnóstico.', FALSE, 'El trastorno puede aparecer sin antecedentes.', 1),
      (v_pregunta, 'Es errada solo porque estos cambios se deben siempre a la levodopa y no al pramipexol.', FALSE, 'Se asocian sobre todo a los agonistas dopaminérgicos.', 2),
      (v_pregunta, 'Es errada: puede ser un trastorno del control de impulsos por el agonista; se informa al médico y se reporta.', TRUE, 'Correcto. Suele requerir reducir o retirar el agonista.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz fsnc-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Migraña, esclerosis múltiple y relajantes musculares' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Migraña, esclerosis múltiple y relajantes musculares) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Migraña, esclerosis múltiple y relajantes musculares';
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


    v_t3 := '¿En qué pacientes están contraindicados los triptanes?';
    v_t4 := 'Los triptanes son agonistas de los receptores 5-HT1B/1D con efecto vasoconstrictor; están contraindicados en enfermedad coronaria, enfermedad cerebrovascular, enfermedad vascular periférica e hipertensión no controlada, y no se combinan con ergotamínicos en las 24 horas.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Tratamiento agudo de la migraña: AINE, triptanes, gepantes y ditanes","outcome":"Tratamiento agudo de la migraña: AINE, triptanes, gepantes y ditanes","source":"Ficha técnica de sumatriptán."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En personas con migraña sin aura, porque solo funcionan en la migraña con aura.', FALSE, 'Sirven en ambos tipos de migraña.', 0),
      (v_pregunta, 'En personas que usan paracetamol a diario, porque la combinación de ambos causa un daño hepático grave.', FALSE, 'No existe esa contraindicación.', 1),
      (v_pregunta, 'En menores de 40 años, porque su metabolismo hepático aún no está completo.', FALSE, 'La edad no es la contraindicación principal.', 2),
      (v_pregunta, 'En personas con enfermedad coronaria o hipertensión no controlada, por su efecto vasoconstrictor.', TRUE, 'Correcto. También en enfermedad cerebrovascular.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una mujer con migraña usa casi todos los días acetaminofén con cafeína y ergotamina que compra sin fórmula; ahora tiene cefalea 18 días al mes. ¿Qué le indica el QF?';
    v_t4 := 'El uso frecuente de analgésicos simples (15 días o más al mes) o de triptanes, ergotamínicos, opioides o combinaciones (10 días o más al mes) puede causar cefalea por uso excesivo de medicación. Se remite para un plan de retiro y un tratamiento preventivo.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Tratamiento agudo de la migraña: AINE, triptanes, gepantes y ditanes","outcome":"Tratamiento agudo de la migraña: AINE, triptanes, gepantes y ditanes","source":"Clasificación internacional de las cefaleas; fichas técnicas."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que puede tener cefalea por uso excesivo de medicación; se remite para un plan de retiro y prevención.', TRUE, 'Correcto. El uso frecuente de analgésicos cronifica la cefalea.', 0),
      (v_pregunta, 'Que aumente la ergotamina, porque la cefalea casi diaria indica que la dosis que usa todavía es insuficiente.', FALSE, 'Más ergotamina empeora el problema y el riesgo vascular.', 1),
      (v_pregunta, 'Que cambie a un analgésico combinado más fuerte con codeína para cortar el ciclo.', FALSE, 'Los opioides también causan cefalea por uso excesivo.', 2),
      (v_pregunta, 'Que el problema es solo la cafeína y basta con tomar el acetaminofén sin cafeína.', FALSE, 'El problema es la frecuencia de uso de los analgésicos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un paciente con esclerosis múltiple que toma baclofeno oral se quedó sin el medicamento hace dos días y tiene alucinaciones y fiebre. ¿Qué análisis es correcto?';
    v_t4 := 'La suspensión brusca del baclofeno puede causar un síndrome de abstinencia con alucinaciones, confusión, convulsiones, fiebre y espasticidad de rebote; el retiro debe ser gradual. Los relajantes de acción central también causan sedación, con más riesgo en adultos mayores.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Relajantes musculares de acción central y periférica","outcome":"Relajantes musculares de acción central y periférica","source":"Ficha técnica de baclofeno."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una recaída de la esclerosis múltiple que no tiene relación con el medicamento.', FALSE, 'La relación temporal con la suspensión es clave.', 0),
      (v_pregunta, 'Puede ser un síndrome de abstinencia por la suspensión brusca del baclofeno; requiere atención urgente.', TRUE, 'Correcto. El baclofeno se retira siempre de forma gradual.', 1),
      (v_pregunta, 'Es una reacción alérgica al baclofeno que apareció justo al dejarlo de tomar.', FALSE, 'Una alergia no aparece al suspender el medicamento.', 2),
      (v_pregunta, 'Es un efecto esperado que desaparece solo y no requiere ninguna consulta médica.', FALSE, 'La abstinencia de baclofeno puede ser grave.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una mujer trae una fórmula de sumatriptán. Cuenta que esta mañana tomó ergotamina por el dolor y que toma fluoxetina. El auxiliar quiere dispensar. ¿Cuál es la mejor decisión?';
    v_t4 := 'Los triptanes no se combinan con ergotamínicos en las 24 horas siguientes, por el riesgo de vasoespasmo. Con inhibidores selectivos de la recaptación de serotonina se vigila el riesgo de síndrome serotoninérgico. La decisión de no dispensar se documenta y se remite.';
    v_j1 := $evfsnc_json${"external_id":"fsnc-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso clínico integrador: migraña con uso excesivo de medicación, triptán y riesgo serotoninérgico","outcome":"Caso clínico integrador: migraña con uso excesivo de medicación, triptán y riesgo serotoninérgico","source":"Fichas técnicas de sumatriptán y ergotamina."}$evfsnc_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'fsnc-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Dispensar y recomendar tomar el sumatriptán de inmediato para cortar la crisis.', FALSE, 'Combinar con ergotamina en las 24 horas está contraindicado.', 0),
      (v_pregunta, 'Dispensar media dosis de sumatriptán para reducir la interacción con la ergotamina.', FALSE, 'Reducir la dosis no elimina la contraindicación.', 1),
      (v_pregunta, 'No dispensar para uso inmediato: no se combina con ergotamina en 24 horas; se remite y se revisa el riesgo serotoninérgico.', TRUE, 'Correcto. Además se aborda el uso excesivo de medicación.', 2),
      (v_pregunta, 'Dispensar y recomendar suspender la fluoxetina para evitar el síndrome serotoninérgico.', FALSE, 'No se suspende un antidepresivo por cuenta propia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad fsnc-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Bases de la neurofarmacología y anestésicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Bases de la neurofarmacología y anestésicos) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Preparación del servicio ante la toxicidad por anestésicos';
  v_t2 := $evfsnc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Explica el mecanismo de los anestésicos locales y por qué su toxicidad afecta al corazón y al SNC.</li><li>Identifica los factores que aumentan el riesgo de toxicidad (dosis acumulada, peso, vía, vasoconstrictor).</li><li>Explica los desencadenantes de la hipertermia maligna y su tratamiento específico.</li><li>Define los medicamentos de rescate, su ubicación y la verificación periódica.</li><li>Diseña una tabla de dosis máximas que debería estar en el quirófano (sin inventar valores: indica la fuente que usarías).</li><li>Define cómo se documenta y se reporta un evento al Programa Nacional de Farmacovigilancia.</li><li>Revisa con la rúbrica y sube tu protocolo en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Explicar los mecanismos y los factores de riesgo de ambas emergencias.</li><li>Definir los medicamentos de rescate y su disponibilidad.</li><li>Diseñar un protocolo con verificación y farmacovigilancia.</li></ul>
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
  <tr><td>Mecanismos y riesgos</td><td>25 %</td><td>Explica el bloqueo de canales de sodio y los factores de riesgo con claridad.</td><td>Explicación correcta con omisiones.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Rescate</td><td>30 %</td><td>Emulsión lipídica y dantroleno disponibles de inmediato, con ubicación y verificación periódica.</td><td>Define los rescates sin verificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Dosis y fuentes</td><td>20 %</td><td>Tabla de dosis máximas con fuente verificable (ficha técnica) y advertencia sobre dosis acumuladas.</td><td>Tabla sin fuente o sin dosis acumuladas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Farmacovigilancia</td><td>15 %</td><td>Documentación y reporte al INVIMA definidos.</td><td>Reporte mencionado sin proceso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfsnc_html$;
  v_t3 := $evfsnc_html$<h2>Caso de estudio</h2>
<p>Eres el QF de un hospital de Ibagué que abrirá una sala de cirugía ambulatoria (datos simulados). Se harán bloqueos de plexo con bupivacaína y lidocaína con epinefrina, y anestesia general con sevoflurano y succinilcolina. El jefe de anestesia te pide un protocolo del servicio farmacéutico para prevenir y atender la toxicidad sistémica por anestésicos locales y la hipertermia maligna.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfsnc_html$;
  v_t4 := 'Protocolo del servicio farmacéutico para emergencias por anestésicos.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfsnc_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (anestésicos locales, opioides, paracetamol, antiepilépticos, levodopa/carbidopa, agonistas dopaminérgicos, inhibidores de la colinesterasa, triptanes y relajantes musculares); comunicaciones de seguridad de la EMA y del INVIMA sobre codeína, valproato y carbamazepina; normativa colombiana de medicamentos de control especial y Fondo Nacional de Estupefacientes; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfsnc_html$;
  v_t7 := NULL;
  v_j1 := $evfsnc_json$["Mecanismos y factores de riesgo.","Hipertermia maligna.","Medicamentos de rescate.","Tabla de dosis y verificación.","Farmacovigilancia."]$evfsnc_json$::jsonb;
  v_j2 := $evfsnc_json${"version":1,"total":100,"criteria":[{"id":"mecanismos-y-riesgos","name":"Mecanismos y riesgos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica el bloqueo de canales de sodio y los factores de riesgo con claridad."},{"level":3,"label":"Logrado","description":"Explicación correcta con omisiones."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"rescate","name":"Rescate","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Emulsión lipídica y dantroleno disponibles de inmediato, con ubicación y verificación periódica."},{"level":3,"label":"Logrado","description":"Define los rescates sin verificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"dosis-y-fuentes","name":"Dosis y fuentes","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Tabla de dosis máximas con fuente verificable (ficha técnica) y advertencia sobre dosis acumuladas."},{"level":3,"label":"Logrado","description":"Tabla sin fuente o sin dosis acumuladas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacovigilancia","name":"Farmacovigilancia","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Documentación y reporte al INVIMA definidos."},{"level":3,"label":"Logrado","description":"Reporte mencionado sin proceso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfsnc_json$::jsonb;
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


  -- ── Actividad fsnc-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Dolor: analgésicos opioides y no opioides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Dolor: analgésicos opioides y no opioides) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Dolor oncológico y dispensación de control especial';
  v_t2 := $evfsnc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Calcula la dosis diaria de morfina incluidos los rescates y explica qué indica el número de rescates.</li><li>Analiza la duplicidad de opioides con el tramadol y sus riesgos.</li><li>Analiza el ibuprofeno y la morfina con una TFG de 38 (metabolitos y riesgo renal).</li><li>Propone el manejo del estreñimiento inducido por opioides.</li><li>Explica los requisitos de dispensación de los medicamentos de control especial.</li><li>Prepara la respuesta a la hija sobre la adicción y la tolerancia.</li><li>Redacta la nota al médico con tus propuestas.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar problemas relacionados con medicamentos en un paciente con dolor oncológico.</li><li>Proponer ajustes seguros de la analgesia.</li><li>Aplicar los requisitos de dispensación de control especial y educar a la familia.</li></ul>
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
  <tr><td>Dosis y rescates</td><td>20 %</td><td>Calcula la dosis total y reconoce que muchos rescates indican dolor no controlado.</td><td>Calcula sin interpretar.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Duplicidad y función renal</td><td>30 %</td><td>Detecta la duplicidad con tramadol, la acumulación de metabolitos de la morfina con TFG baja y el riesgo del AINE.</td><td>Detecta dos de los tres problemas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Estreñimiento y educación</td><td>25 %</td><td>Propone laxantes de forma preventiva y explica dependencia física, tolerancia y adicción.</td><td>Aborda uno de los dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Control especial y nota</td><td>15 %</td><td>Requisitos de dispensación correctos y nota clara.</td><td>Requisitos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfsnc_html$;
  v_t3 := $evfsnc_html$<h2>Caso de estudio</h2>
<p>Don Efraín tiene 69 años, vive en Barranquilla y tiene cáncer de pulmón con metástasis óseas (datos simulados). Recibe morfina oral de liberación inmediata 10 mg cada 4 horas y usa 4 a 5 rescates al día. Además toma tramadol 50 mg cada 8 horas que le formuló otro médico, ibuprofeno 400 mg cada 8 horas y tiene una TFG de 38 mL/min. Lleva cinco días sin deposiciones. Su hija dice que «ya no quiere darle más morfina para que no se vuelva adicto».</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfsnc_html$;
  v_t4 := 'Informe de seguimiento con nota al médico y plan educativo.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfsnc_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (anestésicos locales, opioides, paracetamol, antiepilépticos, levodopa/carbidopa, agonistas dopaminérgicos, inhibidores de la colinesterasa, triptanes y relajantes musculares); comunicaciones de seguridad de la EMA y del INVIMA sobre codeína, valproato y carbamazepina; normativa colombiana de medicamentos de control especial y Fondo Nacional de Estupefacientes; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfsnc_html$;
  v_t7 := NULL;
  v_j1 := $evfsnc_json$["Dosis total y rescates.","Duplicidad de opioides.","Función renal e ibuprofeno.","Estreñimiento.","Control especial y educación."]$evfsnc_json$::jsonb;
  v_j2 := $evfsnc_json${"version":1,"total":100,"criteria":[{"id":"dosis-y-rescates","name":"Dosis y rescates","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Calcula la dosis total y reconoce que muchos rescates indican dolor no controlado."},{"level":3,"label":"Logrado","description":"Calcula sin interpretar."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"duplicidad-y-funcion-renal","name":"Duplicidad y función renal","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Detecta la duplicidad con tramadol, la acumulación de metabolitos de la morfina con TFG baja y el riesgo del AINE."},{"level":3,"label":"Logrado","description":"Detecta dos de los tres problemas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"estrenimiento-y-educacion","name":"Estreñimiento y educación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Propone laxantes de forma preventiva y explica dependencia física, tolerancia y adicción."},{"level":3,"label":"Logrado","description":"Aborda uno de los dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"control-especial-y-nota","name":"Control especial y nota","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Requisitos de dispensación correctos y nota clara."},{"level":3,"label":"Logrado","description":"Requisitos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfsnc_json$::jsonb;
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


  -- ── Actividad fsnc-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Enfermedades neurodegenerativas: Parkinson y demencias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Enfermedades neurodegenerativas: Parkinson y demencias) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Parkinson avanzado con fluctuaciones y riesgos de la fórmula';
  v_t2 := $evfsnc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Describe el fenómeno de fin de dosis y las discinesias y su relación con la levodopa.</li><li>Analiza la relación entre las proteínas de la dieta y la absorción de la levodopa.</li><li>Analiza el cambio de conducta y su posible relación con el pramipexol.</li><li>Analiza la metoclopramida y propone qué hacer.</li><li>Analiza el antigripal con descongestionante junto con la rasagilina.</li><li>Redacta la nota al médico y el plan educativo para la familia.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Reconocer complicaciones motoras de la levodopa y factores que las agravan.</li><li>Identificar reacciones adversas e interacciones de su fórmula.</li><li>Proponer intervenciones al médico y educar a la familia.</li></ul>
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
  <tr><td>Complicaciones motoras y dieta</td><td>25 %</td><td>Explica el fin de dosis, las discinesias y la competencia de las proteínas con la levodopa.</td><td>Explicación parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Reacciones adversas</td><td>25 %</td><td>Relaciona la conducta con el pramipexol y propone informar y reportar.</td><td>Menciona el problema sin plan.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Interacciones</td><td>30 %</td><td>Detecta la metoclopramida como antidopaminérgico y el riesgo del descongestionante con la rasagilina.</td><td>Detecta una de las dos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Nota y educación</td><td>10 %</td><td>Nota clara y educación práctica a la familia.</td><td>Nota general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfsnc_html$;
  v_t3 := $evfsnc_html$<h2>Caso de estudio</h2>
<p>Don Hugo tiene 73 años, vive en Pereira y tiene enfermedad de Parkinson desde hace 10 años (datos simulados). Toma levodopa/carbidopa cuatro veces al día con las comidas (dieta rica en carne y huevo), pramipexol y rasagilina. Su esposa cuenta que el efecto de cada dosis «se le acaba antes», que tiene movimientos involuntarios cuando la dosis hace efecto y que últimamente compra billetes de lotería todos los días. Le acaban de formular metoclopramida para las náuseas y su nieto le recomendó un antigripal con descongestionante.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evfsnc_html$;
  v_t4 := 'Informe con nota al médico y plan educativo para la familia.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evfsnc_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (anestésicos locales, opioides, paracetamol, antiepilépticos, levodopa/carbidopa, agonistas dopaminérgicos, inhibidores de la colinesterasa, triptanes y relajantes musculares); comunicaciones de seguridad de la EMA y del INVIMA sobre codeína, valproato y carbamazepina; normativa colombiana de medicamentos de control especial y Fondo Nacional de Estupefacientes; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfsnc_html$;
  v_t7 := NULL;
  v_j1 := $evfsnc_json$["Complicaciones motoras.","Dieta y levodopa.","Control de impulsos.","Metoclopramida.","Antigripal e IMAO-B."]$evfsnc_json$::jsonb;
  v_j2 := $evfsnc_json${"version":1,"total":100,"criteria":[{"id":"complicaciones-motoras-y-dieta","name":"Complicaciones motoras y dieta","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Explica el fin de dosis, las discinesias y la competencia de las proteínas con la levodopa."},{"level":3,"label":"Logrado","description":"Explicación parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"reacciones-adversas","name":"Reacciones adversas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Relaciona la conducta con el pramipexol y propone informar y reportar."},{"level":3,"label":"Logrado","description":"Menciona el problema sin plan."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"interacciones","name":"Interacciones","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Detecta la metoclopramida como antidopaminérgico y el riesgo del descongestionante con la rasagilina."},{"level":3,"label":"Logrado","description":"Detecta una de las dos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"nota-y-educacion","name":"Nota y educación","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Nota clara y educación práctica a la familia."},{"level":3,"label":"Logrado","description":"Nota general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfsnc_json$::jsonb;
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


  -- ── Actividad fsnc-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Antiepilépticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Antiepilépticos) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: anestésicos, dolor y antiepilépticos en el programa del hospital';
  v_t2 := $evfsnc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y prioriza los riesgos según su gravedad y frecuencia.</li><li>Fase 1: diseña la verificación de los medicamentos de rescate en cirugía.</li><li>Fase 2: propone cómo garantizar el acceso oportuno a opioides para pacientes paliativos cumpliendo la normativa de control especial.</li><li>Fase 3: diseña el proceso de monitorización e interpretación de niveles de fenitoína y la revisión de interacciones de los antiepilépticos.</li><li>Fase 3: propone cómo identificar a las mujeres en edad fértil con valproato.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (anestésicos).</strong> Prevención y rescate en la toxicidad por anestésicos e hipertermia maligna.</li>
  <li><strong>Fase 2 · Unidad 2 (dolor).</strong> Acceso y seguridad de opioides y analgésicos, y control especial.</li>
  <li><strong>Fase 3 · Unidad 3 (antiepilépticos).</strong> Monitorización de niveles, interacciones y programa con valproato.</li>
  <li><strong>Fase 4 · Unidad 4 (neurodegenerativas).</strong> Carga anticolinérgica y seguridad en Parkinson y demencia.</li>
  <li><strong>Fase 5 · Unidad 5 (migraña y relajantes).</strong> Uso excesivo de medicación, retiro de relajantes y farmacovigilancia del programa.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diagnosticar los riesgos del uso de medicamentos del SNC en el hospital.</li><li>Diseñar intervenciones para anestesia, dolor y epilepsia.</li></ul>
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
  <tr><td>Priorización</td><td>15 %</td><td>Prioriza con criterios de gravedad y frecuencia justificados.</td><td>Prioriza sin criterios claros.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Anestésicos y dolor</td><td>35 %</td><td>Verificación de rescates y propuesta realista de acceso a opioides con control especial.</td><td>Propuestas generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Antiepilépticos</td><td>35 %</td><td>Proceso de niveles con la cinética no lineal de la fenitoína, interacciones y programa con valproato.</td><td>Proceso incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Formato</td><td>5 %</td><td>Documento ordenado.</td><td>Documento poco ordenado.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfsnc_html$;
  v_t3 := $evfsnc_html$<h2>Caso de estudio</h2>
<p>Eres el nuevo QF del servicio farmacéutico de un hospital de segundo nivel de Villavicencio (datos simulados). En tu primer mes encuentras: emulsión lipídica vencida en cirugía; pacientes paliativos sin morfina por trámites de control especial; niveles de fenitoína que nadie interpreta; adultos mayores con demencia y varios anticolinérgicos; y venta libre de combinaciones con ergotamina en la droguería del hospital. La dirección te pide un programa de uso seguro de medicamentos del SNC. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfsnc_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfsnc_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (anestésicos locales, opioides, paracetamol, antiepilépticos, levodopa/carbidopa, agonistas dopaminérgicos, inhibidores de la colinesterasa, triptanes y relajantes musculares); comunicaciones de seguridad de la EMA y del INVIMA sobre codeína, valproato y carbamazepina; normativa colombiana de medicamentos de control especial y Fondo Nacional de Estupefacientes; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfsnc_html$;
  v_t7 := NULL;
  v_j1 := $evfsnc_json$["Priorización de riesgos.","Rescates en cirugía.","Acceso a opioides.","Antiepilépticos y valproato."]$evfsnc_json$::jsonb;
  v_j2 := $evfsnc_json${"version":1,"total":100,"criteria":[{"id":"priorizacion","name":"Priorización","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Prioriza con criterios de gravedad y frecuencia justificados."},{"level":3,"label":"Logrado","description":"Prioriza sin criterios claros."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"anestesicos-y-dolor","name":"Anestésicos y dolor","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Verificación de rescates y propuesta realista de acceso a opioides con control especial."},{"level":3,"label":"Logrado","description":"Propuestas generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"antiepilepticos","name":"Antiepilépticos","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Proceso de niveles con la cinética no lineal de la fenitoína, interacciones y programa con valproato."},{"level":3,"label":"Logrado","description":"Proceso incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"formato","name":"Formato","weight":5,"levels":[{"level":4,"label":"Destacado","description":"Documento ordenado."},{"level":3,"label":"Logrado","description":"Documento poco ordenado."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfsnc_json$::jsonb;
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


  -- ── Actividad fsnc-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Migraña, esclerosis múltiple y relajantes musculares' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Migraña, esclerosis múltiple y relajantes musculares) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: programa integral de uso seguro de medicamentos del SNC';
  v_t2 := $evfsnc_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: diseña la revisión de la carga anticolinérgica en pacientes con demencia y la vigilancia de medicamentos que empeoran el Parkinson.</li><li>Fase 5: diseña la intervención en la droguería para el uso excesivo de analgésicos y ergotamina, y el retiro seguro de relajantes como el baclofeno.</li><li>Fase 5: define indicadores del programa y el plan de farmacovigilancia.</li><li>Escribe un resumen ejecutivo de una página para la dirección.</li><li>Revisa con la rúbrica y sube el programa en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (anestésicos).</strong> Prevención y rescate en la toxicidad por anestésicos e hipertermia maligna.</li>
  <li><strong>Fase 2 · Unidad 2 (dolor).</strong> Acceso y seguridad de opioides y analgésicos, y control especial.</li>
  <li><strong>Fase 3 · Unidad 3 (antiepilépticos).</strong> Monitorización de niveles, interacciones y programa con valproato.</li>
  <li><strong>Fase 4 · Unidad 4 (neurodegenerativas).</strong> Carga anticolinérgica y seguridad en Parkinson y demencia.</li>
  <li><strong>Fase 5 · Unidad 5 (migraña y relajantes).</strong> Uso excesivo de medicación, retiro de relajantes y farmacovigilancia del programa.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Integrar intervenciones en neurodegenerativas, migraña y relajantes.</li><li>Definir indicadores y farmacovigilancia del programa.</li></ul>
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
  <tr><td>Neurodegenerativas</td><td>25 %</td><td>Revisión de carga anticolinérgica y lista de medicamentos a evitar en Parkinson.</td><td>Revisión parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Migraña y relajantes</td><td>20 %</td><td>Intervención en el punto de venta y retiro gradual de relajantes.</td><td>Intervención general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Indicadores y farmacovigilancia</td><td>30 %</td><td>Indicadores medibles con metas y proceso de reporte al INVIMA.</td><td>Indicadores sin metas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evfsnc_html$;
  v_t3 := $evfsnc_html$<h2>Caso de estudio</h2>
<p>Eres el nuevo QF del servicio farmacéutico de un hospital de segundo nivel de Villavicencio (datos simulados). En tu primer mes encuentras: emulsión lipídica vencida en cirugía; pacientes paliativos sin morfina por trámites de control especial; niveles de fenitoína que nadie interpreta; adultos mayores con demencia y varios anticolinérgicos; y venta libre de combinaciones con ergotamina en la droguería del hospital. La dirección te pide un programa de uso seguro de medicamentos del SNC. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el programa que presentarás a la dirección.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evfsnc_html$;
  v_t4 := 'Programa integral con indicadores y resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evfsnc_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Fichas técnicas e insertos aprobados por el INVIMA de los medicamentos del caso (anestésicos locales, opioides, paracetamol, antiepilépticos, levodopa/carbidopa, agonistas dopaminérgicos, inhibidores de la colinesterasa, triptanes y relajantes musculares); comunicaciones de seguridad de la EMA y del INVIMA sobre codeína, valproato y carbamazepina; normativa colombiana de medicamentos de control especial y Fondo Nacional de Estupefacientes; Decreto 780 de 2016 y Resolución 1403 de 2007; Programa Nacional de Farmacovigilancia del INVIMA. Cita en APA 7.</p>$evfsnc_html$;
  v_t7 := NULL;
  v_j1 := $evfsnc_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Neurodegenerativas.","Migraña y relajantes.","Indicadores y farmacovigilancia.","Resumen ejecutivo."]$evfsnc_json$::jsonb;
  v_j2 := $evfsnc_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"neurodegenerativas","name":"Neurodegenerativas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Revisión de carga anticolinérgica y lista de medicamentos a evitar en Parkinson."},{"level":3,"label":"Logrado","description":"Revisión parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"migrana-y-relajantes","name":"Migraña y relajantes","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Intervención en el punto de venta y retiro gradual de relajantes."},{"level":3,"label":"Logrado","description":"Intervención general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"indicadores-y-farmacovigilancia","name":"Indicadores y farmacovigilancia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Indicadores medibles con metas y proceso de reporte al INVIMA."},{"level":3,"label":"Logrado","description":"Indicadores sin metas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evfsnc_json$::jsonb;
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


  -- ── Foro fsnc-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con medicamentos del sistema nervioso';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evfsnc_html$<h2>Para empezar</h2>
<p>Piensa en una situación con un analgésico, un antiepiléptico, un medicamento para el Parkinson o la migraña que te haya generado dudas y cuéntala en tres o cuatro líneas, sin nombres ni datos que identifiquen a nadie.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evfsnc_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué decisión sobre medicamentos del SNC te gustaría tomar con seguridad al terminarlo?';
  v_t5 := $evfsnc_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evfsnc_html$;
  v_t6 := $evfsnc_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evfsnc_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has dispensado medicamentos de control especial? ¿Qué te resultó más difícil?', '¿Qué interacción de un medicamento del SNC te parece más peligrosa?']::text[];
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


  -- ── Foro fsnc-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Bases de la neurofarmacología y anestésicos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Bases de la neurofarmacología y anestésicos) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Cirugía ambulatoria: ¿qué debe tener la farmacia?';
  v_t2 := 'Argumentar qué medicamentos de rescate y qué procesos debe garantizar el servicio farmacéutico donde se usan anestésicos.';
  v_t3 := $evfsnc_html$<h2>Caso del foro</h2>
<p>Una clínica de cirugía ambulatoria hace bloqueos con bupivacaína y usa anestésicos inhalados (datos simulados). En una auditoría se encuentra que la emulsión lipídica está vencida, que el dantroleno «se pide cuando se necesite» y que no hay tabla de dosis máximas de anestésicos locales en el quirófano.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfsnc_html$;
  v_t4 := '¿Qué priorizarías y por qué, y cómo lo presentarías a la dirección?';
  v_t5 := $evfsnc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la recomendación o el dato de la ficha técnica que sustenta cada prioridad. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfsnc_html$;
  v_t6 := $evfsnc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato de la ficha técnica que sustenta cada prioridad.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfsnc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué factores aumentan el riesgo de toxicidad sistémica por anestésicos locales?', '¿Qué papel tiene el vasoconstrictor en la dosis máxima?', '¿Cómo se verifica que los medicamentos de rescate estén vigentes y disponibles?']::text[];
  v_j1 := $evfsnc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la recomendación o el dato de la ficha técnica que sustenta cada prioridad."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfsnc_json$::jsonb;
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


  -- ── Foro fsnc-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Dolor: analgésicos opioides y no opioides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Dolor: analgésicos opioides y no opioides) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Opioides: ¿miedo o seguridad?';
  v_t2 := 'Argumentar cómo equilibrar el acceso a opioides para el dolor con su uso seguro y la normativa de control especial.';
  v_t3 := $evfsnc_html$<h2>Caso del foro</h2>
<p>Un paciente con cáncer metastásico no recibe su morfina porque la droguería «no maneja control especial» y la siguiente queda a una hora (datos simulados). En la misma ciudad, otra droguería dispensa tramadol sin fórmula. Un familiar del paciente cree que «la morfina es para los que se van a morir».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfsnc_html$;
  v_t4 := '¿Qué barreras de acceso y qué riesgos de seguridad identificas, y qué haría el servicio farmacéutico?';
  v_t5 := $evfsnc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o el dato de la ficha técnica que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfsnc_html$;
  v_t6 := $evfsnc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el dato de la ficha técnica que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfsnc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué papel cumplen el Fondo Nacional de Estupefacientes y los fondos rotatorios?', '¿Qué riesgos tiene el tramadol sin control (convulsiones, síndrome serotoninérgico, dependencia)?', '¿Cómo explicarías al familiar el uso de la morfina en el dolor oncológico?']::text[];
  v_j1 := $evfsnc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el dato de la ficha técnica que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfsnc_json$::jsonb;
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


  -- ── Foro fsnc-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Antiepilépticos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Antiepilépticos) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Valproato en mujeres jóvenes';
  v_t2 := 'Argumentar el papel del servicio farmacéutico en el programa de prevención del embarazo con valproato.';
  v_t3 := $evfsnc_html$<h2>Caso del foro</h2>
<p>En la revisión de un programa de epilepsia aparecen 40 mujeres de 15 a 45 años con valproato (datos simulados). Muchas no saben del riesgo para el embarazo, algunas usan anticonceptivos orales con carbamazepina adicional y una está embarazada de 6 semanas.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfsnc_html$;
  v_t4 := '¿Qué acciones priorizarías y cómo comunicarías el riesgo sin provocar que suspendan el tratamiento de golpe?';
  v_t5 := $evfsnc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la comunicación de seguridad o la ficha técnica que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfsnc_html$;
  v_t6 := $evfsnc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la comunicación de seguridad o la ficha técnica que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfsnc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué la carbamazepina complica la anticoncepción oral?', '¿Qué haría el servicio farmacéutico con la paciente embarazada?', '¿Qué información debe recibir cada paciente y cómo se documenta?']::text[];
  v_j1 := $evfsnc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la comunicación de seguridad o la ficha técnica que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfsnc_json$::jsonb;
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


  -- ── Foro fsnc-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Enfermedades neurodegenerativas: Parkinson y demencias' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Enfermedades neurodegenerativas: Parkinson y demencias) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Carga anticolinérgica en el adulto mayor';
  v_t2 := 'Argumentar cómo identificar y reducir la carga anticolinérgica en personas con deterioro cognitivo.';
  v_t3 := $evfsnc_html$<h2>Caso del foro</h2>
<p>En un programa de atención domiciliaria, una revisión encuentra que el 35 % de los pacientes con demencia toma al menos un medicamento anticolinérgico (datos simulados): oxibutinina, amitriptilina, difenhidramina para dormir, hioscina para cólicos y clorfeniramina en antigripales.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfsnc_html$;
  v_t4 := '¿Qué medicamentos priorizarías revisar y qué alternativas propondrías?';
  v_t5 := $evfsnc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la ficha técnica o la herramienta de evaluación que sustenta tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfsnc_html$;
  v_t6 := $evfsnc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la herramienta de evaluación que sustenta tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfsnc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Por qué los anticolinérgicos se oponen a los inhibidores de la colinesterasa?', '¿Qué medicamentos de venta libre aumentan la carga anticolinérgica?', '¿Cómo medirías el efecto de la deprescripción?']::text[];
  v_j1 := $evfsnc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la ficha técnica o la herramienta de evaluación que sustenta tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfsnc_json$::jsonb;
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


  -- ── Foro fsnc-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Migraña, esclerosis múltiple y relajantes musculares' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Migraña, esclerosis múltiple y relajantes musculares) en Farmacología del Sistema Nervioso Central: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Analgésicos combinados sin fórmula y cefalea crónica';
  v_t2 := 'Argumentar el papel de la droguería en la prevención de la cefalea por uso excesivo de medicación.';
  v_t3 := $evfsnc_html$<h2>Caso del foro</h2>
<p>Una cadena de droguerías vende cada mes miles de unidades de combinaciones de acetaminofén con cafeína y de ergotamina con cafeína (datos simulados). Un estudio interno muestra compradores que llevan estos productos varias veces por semana desde hace meses.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evfsnc_html$;
  v_t4 := '¿Qué intervención propondrías en el punto de venta y cómo la medirías?';
  v_t5 := $evfsnc_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la clasificación, la ficha técnica o la recomendación que sustenta tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evfsnc_html$;
  v_t6 := $evfsnc_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la clasificación, la ficha técnica o la recomendación que sustenta tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evfsnc_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué umbrales de uso se asocian a cefalea por uso excesivo de medicación?', '¿Qué riesgos adicionales tiene la ergotamina?', '¿Cuándo debe remitirse una persona con cefalea a evaluación médica urgente?']::text[];
  v_j1 := $evfsnc_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la clasificación, la ficha técnica o la recomendación que sustenta tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evfsnc_json$::jsonb;
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


  RAISE NOTICE 'Farmacología del Sistema Nervioso Central: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evfsnc$;

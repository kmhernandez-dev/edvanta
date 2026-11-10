-- ============================================================
--  096_quices_actividades_foros_autocuidado.sql — quizzes, actividades y foros, lote «autocuidado»
--
--  Generado por scripts/evaluacion-aula.mjs autocuidado migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Autocuidado de la tiroides.
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
--  Autocuidado de la tiroides
--  3 quizzes · 3 actividades · 4 foros
-- ════════════════════════════════════════════════════════════════
DO $evtiro$
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
   WHERE kind = 'edvanta' AND title = 'Autocuidado de la tiroides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Autocuidado de la tiroides: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Empieza aquí', 'Comprende tu tiroides', 'Medicamentos y autocuidado seguro']::text[])) < 3 THEN
    RAISE NOTICE 'Autocuidado de la tiroides: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evtiro_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evtiro_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz tiro-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Empieza aquí' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Empieza aquí) en Autocuidado de la tiroides: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Empieza aquí';
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


    v_t3 := '¿Para qué sirve este curso de autocuidado de la tiroides?';
    v_t4 := 'Este curso es educativo: te ayuda a entender tu tiroides, tus exámenes y tus medicamentos, y a preparar preguntas para tu médico y tu químico farmacéutico. No sirve para diagnosticar ni para cambiar tratamientos por tu cuenta.';
    v_j1 := $evtiro_json${"external_id":"tiro-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Bienvenida: cómo usar este curso","outcome":"Bienvenida: cómo usar este curso","source":"Clase de bienvenida del curso."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Para diagnosticarte en casa sin necesidad de ir al médico ni de hacerte ningún examen.', FALSE, 'El curso no sirve para diagnosticar.', 0),
      (v_pregunta, 'Para entender tu tiroides y preparar mejores preguntas para tu equipo de salud.', TRUE, 'Correcto. Es un curso educativo.', 1),
      (v_pregunta, 'Para cambiar la dosis de tus medicamentos según cómo te sientas cada semana.', FALSE, 'Los cambios de dosis los decide tu médico.', 2),
      (v_pregunta, 'Para reemplazar los controles médicos cuando ya te sientes bien con el tratamiento.', FALSE, 'Los controles siguen siendo necesarios.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Después de ver una clase, Marta cree que su cansancio puede ser por la tiroides. ¿Qué es lo más útil que puede hacer?';
    v_t4 := 'El cansancio tiene muchas causas. Lo útil es pedir una cita, anotar los síntomas (desde cuándo, cómo son) y las preguntas, y dejar que el médico decida qué exámenes hacer. Tomar medicamentos o suplementos por tu cuenta puede ser peligroso.';
    v_j1 := $evtiro_json${"external_id":"tiro-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Bienvenida: cómo usar este curso","outcome":"Bienvenida: cómo usar este curso","source":"Clase de bienvenida del curso."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Comprar un medicamento para la tiroides en la droguería y probar si se siente mejor.', FALSE, 'No se debe tomar medicamentos para la tiroides sin fórmula.', 0),
      (v_pregunta, 'Esperar a que el cansancio pase solo y no comentarlo con nadie para no preocupar.', FALSE, 'Es mejor consultarlo.', 1),
      (v_pregunta, 'Tomar un suplemento de yodo que vio en internet para «activar» la tiroides.', FALSE, 'El yodo extra puede ser perjudicial.', 2),
      (v_pregunta, 'Pedir una cita y llevar anotados sus síntomas y sus preguntas para el médico.', TRUE, 'Correcto. Así la consulta es más útil.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'En una red social, un video dice que «un suplemento natural cura la tiroides y permite dejar la levotiroxina». ¿Cómo analizas esa información?';
    v_t4 := 'Las promesas de curas rápidas, los testimonios y los productos «naturales» no son pruebas. Antes de creerlas, compara con fuentes oficiales y pregunta a tu médico o químico farmacéutico. Dejar la levotiroxina por un suplemento puede hacer que vuelvan los síntomas.';
    v_j1 := $evtiro_json${"external_id":"tiro-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Bienvenida: cómo usar este curso","outcome":"Bienvenida: cómo usar este curso","source":"Clase de bienvenida del curso."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una promesa poco confiable: se compara con fuentes oficiales y se pregunta al médico o al químico farmacéutico.', TRUE, 'Correcto. Ningún suplemento reemplaza la levotiroxina.', 0),
      (v_pregunta, 'Es confiable porque el video tiene muchos «me gusta» y comentarios positivos.', FALSE, 'La popularidad no demuestra que algo sea cierto.', 1),
      (v_pregunta, 'Es confiable si el producto dice que es natural, porque lo natural no tiene riesgos.', FALSE, 'Lo natural también puede tener riesgos e interacciones.', 2),
      (v_pregunta, 'Es confiable si quien lo vende cuenta que a él le funcionó con su propia tiroides.', FALSE, 'Una experiencia personal no es una prueba.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Luis lleva un año con levotiroxina, se siente muy bien y decide dejarla «porque ya se curó». ¿Qué opinas de su decisión?';
    v_t4 := 'La levotiroxina reemplaza la hormona que la tiroides no produce lo suficiente. Sentirse bien suele ser gracias al tratamiento; si se deja, los síntomas pueden volver. Cualquier cambio se decide con el médico, con exámenes de control.';
    v_j1 := $evtiro_json${"external_id":"tiro-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Bienvenida: cómo usar este curso","outcome":"Bienvenida: cómo usar este curso","source":"Clase de bienvenida del curso; inserto de levotiroxina."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es buena idea, porque si se siente bien significa que su tiroides ya funciona sola.', FALSE, 'Sentirse bien suele ser gracias al medicamento.', 0),
      (v_pregunta, 'Es buena idea si la deja poco a poco durante una semana sin decirle al médico.', FALSE, 'Cualquier cambio debe hablarse con el médico.', 1),
      (v_pregunta, 'No es buena idea: sentirse bien suele ser efecto del tratamiento; debe hablarlo con su médico.', TRUE, 'Correcto. Muchas personas la necesitan de por vida.', 2),
      (v_pregunta, 'No importa, porque la levotiroxina no tiene ningún efecto real sobre el cuerpo.', FALSE, 'La levotiroxina reemplaza una hormona necesaria.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz tiro-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Comprende tu tiroides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Comprende tu tiroides) en Autocuidado de la tiroides: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Comprende tu tiroides';
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


    v_t3 := '¿Qué hacen las hormonas de la tiroides en el cuerpo?';
    v_t4 := 'La tiroides produce hormonas (T4 y T3) que regulan el metabolismo: cuánta energía usa el cuerpo, el ritmo del corazón, la temperatura, el intestino y muchas otras funciones. Por eso, cuando produce poco o mucho, aparecen síntomas en distintas partes del cuerpo.';
    v_j1 := $evtiro_json${"external_id":"tiro-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"¿Qué es la tiroides y para qué sirve?","outcome":"¿Qué es la tiroides y para qué sirve?","source":"Clase «¿Qué es la tiroides y para qué sirve?»."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo controlan el crecimiento del cabello y de las uñas en los adultos.', FALSE, 'Sus funciones son mucho más amplias.', 0),
      (v_pregunta, 'Solo regulan el azúcar de la sangre después de cada comida.', FALSE, 'Esa es una función de la insulina.', 1),
      (v_pregunta, 'Regulan el metabolismo: la energía, el ritmo del corazón, la temperatura y otras funciones.', TRUE, 'Correcto. Por eso sus alteraciones dan síntomas tan variados.', 2),
      (v_pregunta, 'Solo producen las defensas del cuerpo contra las infecciones.', FALSE, 'Esa es función del sistema inmune.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Carmen recibe sus exámenes: TSH alta y T4 libre baja. ¿Qué hace con ese resultado?';
    v_t4 := 'La TSH es la hormona que la hipófisis usa para «pedirle» a la tiroides que trabaje. Una TSH alta con T4 libre baja suele indicar que la tiroides produce poco (hipotiroidismo), pero el diagnóstico y el tratamiento los define el médico con tus síntomas y tu historia.';
    v_j1 := $evtiro_json${"external_id":"tiro-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Exámenes tiroideos: TSH, T4, T3 y anticuerpos","outcome":"Exámenes tiroideos: TSH, T4, T3 y anticuerpos","source":"Clase «Exámenes tiroideos: TSH, T4, T3 y anticuerpos»."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Lo lleva al médico, que lo interpreta con sus síntomas y decide el tratamiento.', TRUE, 'Correcto. Ese patrón suele asociarse al hipotiroidismo, pero lo define el médico.', 0),
      (v_pregunta, 'Empieza a tomar la levotiroxina de su hermana, que tiene el mismo problema de tiroides desde hace años.', FALSE, 'Nunca se toman medicamentos de otra persona.', 1),
      (v_pregunta, 'Decide que tiene hipertiroidismo y deja de comer sal para corregirlo.', FALSE, 'El patrón no corresponde a hipertiroidismo.', 2),
      (v_pregunta, 'Repite el examen todos los días hasta que salga normal sin consultar.', FALSE, 'Repetir sin indicación no ayuda.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Pedro tiene palpitaciones, pérdida de peso y nerviosismo; su vecina tiene cansancio, frío y estreñimiento. ¿Qué análisis es correcto?';
    v_t4 := 'El hipertiroidismo (tiroides acelerada) puede dar palpitaciones, pérdida de peso, nerviosismo y calor; el hipotiroidismo (tiroides lenta), cansancio, frío, estreñimiento y aumento de peso. Muchos síntomas se parecen a otras enfermedades, por eso solo el médico con exámenes puede confirmar el diagnóstico.';
    v_j1 := $evtiro_json${"external_id":"tiro-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Hipotiroidismo e hipertiroidismo: reconoce las diferencias","outcome":"Hipotiroidismo e hipertiroidismo: reconoce las diferencias","source":"Clase «Hipotiroidismo e hipertiroidismo: reconoce las diferencias»."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Ambos tienen hipotiroidismo, porque cualquier síntoma raro es de la tiroides baja.', FALSE, 'Los síntomas apuntan a situaciones distintas.', 0),
      (v_pregunta, 'Ambos tienen hipertiroidismo, porque las palpitaciones y el frío son lo mismo.', FALSE, 'No son síntomas equivalentes.', 1),
      (v_pregunta, 'Ninguno puede tener un problema de tiroides, porque la tiroides no da síntomas.', FALSE, 'Sí puede dar síntomas.', 2),
      (v_pregunta, 'Los síntomas de Pedro se parecen a una tiroides acelerada y los de la vecina a una lenta, pero solo los exámenes lo confirman.', TRUE, 'Correcto. No se debe autodiagnosticar.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Rosa compara su TSH con la de su amiga y concluye que «la suya está mal» porque es distinta. ¿Qué opinas?';
    v_t4 := 'El valor de TSH que el médico busca puede variar según la persona: edad, embarazo, enfermedades del corazón o algunos tipos de cáncer de tiroides cambian la meta. Por eso no se comparan resultados entre personas; se llevan al médico.';
    v_j1 := $evtiro_json${"external_id":"tiro-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Exámenes tiroideos: TSH, T4, T3 y anticuerpos","outcome":"Exámenes tiroideos: TSH, T4, T3 y anticuerpos","source":"Clase «Exámenes tiroideos: TSH, T4, T3 y anticuerpos»."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tiene razón: todas las personas deben tener exactamente la misma TSH.', FALSE, 'La meta puede variar entre personas.', 0),
      (v_pregunta, 'No necesariamente: la meta de TSH depende de cada persona y de su situación; lo interpreta su médico.', TRUE, 'Correcto. Por ejemplo, cambia en el embarazo.', 1),
      (v_pregunta, 'Tiene razón si la diferencia es de cualquier valor, por pequeño que sea.', FALSE, 'Pequeñas diferencias pueden ser normales.', 2),
      (v_pregunta, 'No importa, porque la TSH no tiene ninguna relación con la tiroides.', FALSE, 'La TSH es clave para evaluar la tiroides.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz tiro-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Medicamentos y autocuidado seguro' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Medicamentos y autocuidado seguro) en Autocuidado de la tiroides: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Medicamentos y autocuidado seguro';
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


    v_t3 := '¿Cómo se toma correctamente la levotiroxina?';
    v_t4 := 'La levotiroxina se absorbe mejor en ayunas, con agua, unos 30 a 60 minutos antes del desayuno, y conviene tomarla siempre de la misma forma. Los alimentos, el café, la leche, el calcio y el hierro pueden reducir su absorción.';
    v_j1 := $evtiro_json${"external_id":"tiro-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Levotiroxina: cinco pasos para tomarla correctamente","outcome":"Levotiroxina: cinco pasos para tomarla correctamente","source":"Clase «Levotiroxina: cinco pasos para tomarla correctamente»; inserto de levotiroxina."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'En ayunas, solo con agua, unos 30 a 60 minutos antes del desayuno, todos los días igual.', TRUE, 'Correcto. Siempre de la misma forma.', 0),
      (v_pregunta, 'Con el desayuno y un café con leche, para que no caiga pesada en el estómago.', FALSE, 'La comida, el café y la leche reducen su absorción.', 1),
      (v_pregunta, 'Cuando te acuerdes durante el día, porque la hora no tiene ninguna importancia.', FALSE, 'La forma y la hora sí importan.', 2),
      (v_pregunta, 'Junto con el calcio y el hierro, para tomar todas las pastillas de una sola vez en la mañana.', FALSE, 'El calcio y el hierro reducen su absorción.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Gloria toma levotiroxina en ayunas y un suplemento de calcio en el desayuno. ¿Qué le recomienda el químico farmacéutico?';
    v_t4 := 'El calcio, el hierro y algunos antiácidos se unen a la levotiroxina y reducen su absorción. Se recomienda separarlos varias horas (por lo general, al menos 4 horas); tu químico farmacéutico te ayuda a organizar los horarios.';
    v_j1 := $evtiro_json${"external_id":"tiro-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Levotiroxina e interacciones: horarios, alimentos y suplementos","outcome":"Levotiroxina e interacciones: horarios, alimentos y suplementos","source":"Clase «Levotiroxina e interacciones»; inserto de levotiroxina."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tomar el calcio junto con la levotiroxina para no olvidarlo en el desayuno.', FALSE, 'Juntos reducen la absorción de la levotiroxina.', 0),
      (v_pregunta, 'Dejar el calcio para siempre, porque nunca puede tomarse con un problema de tiroides.', FALSE, 'Puede tomarlo, separándolo.', 1),
      (v_pregunta, 'Separar el calcio de la levotiroxina varias horas, por ejemplo tomarlo al almuerzo.', TRUE, 'Correcto. Se confirma el horario con el médico o el químico farmacéutico.', 2),
      (v_pregunta, 'Duplicar la levotiroxina los días en que tome calcio para compensar.', FALSE, 'Nunca se cambia la dosis por cuenta propia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Manuel toma metimazol desde hace un mes y hoy tiene fiebre y dolor de garganta. ¿Qué análisis es correcto?';
    v_t4 := 'Los antitiroideos como el metimazol pueden, en raras ocasiones, bajar mucho las defensas de la sangre (agranulocitosis), sobre todo en los primeros meses. La fiebre, el dolor de garganta o las llagas en la boca son señales de alarma: se consulta de inmediato y se avisa que toma el medicamento.';
    v_j1 := $evtiro_json${"external_id":"tiro-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Antitiroideos: uso seguro, controles y riesgos","outcome":"Antitiroideos: uso seguro, controles y riesgos","source":"Clase «Antitiroideos: uso seguro, controles y riesgos»; inserto de metimazol."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una gripa sin importancia y puede seguir igual con su medicamento.', FALSE, 'Puede ser una señal de alarma del metimazol.', 0),
      (v_pregunta, 'Puede ser una señal de alarma: debe consultar de inmediato y avisar que toma metimazol.', TRUE, 'Correcto. Pueden pedirle un examen de sangre urgente.', 1),
      (v_pregunta, 'Debe duplicar el metimazol, porque la fiebre significa que la tiroides empeoró.', FALSE, 'Nunca se aumenta la dosis por cuenta propia.', 2),
      (v_pregunta, 'Debe tomar un antibiótico que le sobró de otra ocasión y seguir con el metimazol como siempre.', FALSE, 'No se toman antibióticos sobrantes sin indicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Sofía toma levotiroxina y acaba de saber que está embarazada. Decide esperar a la cita de control dentro de tres meses. ¿Qué opinas?';
    v_t4 := 'Durante el embarazo la necesidad de hormona tiroidea suele aumentar y el control es importante para la madre y el bebé. Por eso, quien toma levotiroxina debe avisar pronto a su médico al confirmar el embarazo; no debe suspenderla ni cambiar la dosis por su cuenta.';
    v_j1 := $evtiro_json${"external_id":"tiro-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Levotiroxina e interacciones: horarios, alimentos y suplementos","outcome":"Levotiroxina e interacciones: horarios, alimentos y suplementos","source":"Inserto de levotiroxina; clase «Levotiroxina e interacciones»."}$evtiro_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'tiro-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es buena idea, porque el embarazo no cambia la necesidad de levotiroxina.', FALSE, 'El embarazo suele cambiar la dosis necesaria.', 0),
      (v_pregunta, 'Es buena idea si deja la levotiroxina para proteger al bebé.', FALSE, 'Dejarla puede ser perjudicial para el bebé.', 1),
      (v_pregunta, 'Es buena idea si toma el doble de dosis por su cuenta desde hoy.', FALSE, 'Los cambios de dosis los decide el médico.', 2),
      (v_pregunta, 'No conviene esperar: debe avisar pronto a su médico, porque en el embarazo la dosis suele ajustarse.', TRUE, 'Correcto. El control temprano protege a la madre y al bebé.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad tiro-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Empieza aquí' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Empieza aquí) en Autocuidado de la tiroides: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Mis preguntas para la próxima consulta';
  v_t2 := $evtiro_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender y aplicar.</p>
<ol><li>Escribe en una lista los síntomas que has notado, desde cuándo y cómo son.</li><li>Anota los medicamentos, vitaminas y productos naturales que tomas, con la dosis y la hora.</li><li>Escribe tres preguntas concretas para tu médico.</li><li>Escribe dos preguntas para tu químico farmacéutico sobre tu medicamento.</li><li>Ordena las preguntas de la más importante a la menos importante.</li><li>Revisa con la rúbrica y sube tu lista en PDF, DOCX o una foto legible.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Organizar la información de tu salud antes de una consulta.</li><li>Formular preguntas claras para tu equipo de salud.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 45 minutos.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 22 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 22 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Síntomas</td><td>25 %</td><td>Describe los síntomas con detalle: desde cuándo, cómo son y qué los empeora.</td><td>Menciona los síntomas sin detalles.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Medicamentos y productos</td><td>25 %</td><td>Lista completa con dosis y horario, incluidas vitaminas y productos naturales.</td><td>Lista incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Preguntas</td><td>40 %</td><td>Preguntas claras, concretas y ordenadas por importancia para el médico y el químico farmacéutico.</td><td>Preguntas generales o desordenadas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evtiro_html$;
  v_t3 := $evtiro_html$<h2>Caso de estudio</h2>
<p>Imagina que tienes una cita de control para tu tiroides en dos semanas (situación de práctica ficticia). El médico tendrá poco tiempo y quieres aprovecharlo. Desde hace dos meses te sientes más cansada, tomas levotiroxina en el desayuno junto con un suplemento de calcio y no recuerdas cuándo fue tu último examen. Tienes dudas sobre tus síntomas, tus exámenes y tu medicamento.</p>
<p><strong>Caso ficticio. Situación de práctica.</strong></p>$evtiro_html$;
  v_t4 := 'Una lista de una página con tus síntomas, tus medicamentos y tus preguntas.';
  v_t5 := 'Una página, escrita a mano o en computador.';
  v_t6 := $evtiro_html$<h2>Materiales, anexos y datos</h2>
<p>No compartas datos que te identifiquen (nombre completo, documento, dirección).</p>
<h2>Fuentes de apoyo y citación</h2>
<p>El inserto de tus medicamentos (levotiroxina o antitiroideo) aprobado por el INVIMA, las indicaciones escritas de tu médico y de tu químico farmacéutico, y páginas oficiales de salud. Cuando uses una fuente, escribe de dónde la tomaste.</p>$evtiro_html$;
  v_t7 := NULL;
  v_j1 := $evtiro_json$["Síntomas.","Medicamentos y productos.","Preguntas para el médico.","Preguntas para el químico farmacéutico."]$evtiro_json$::jsonb;
  v_j2 := $evtiro_json${"version":1,"total":100,"criteria":[{"id":"sintomas","name":"Síntomas","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Describe los síntomas con detalle: desde cuándo, cómo son y qué los empeora."},{"level":3,"label":"Logrado","description":"Menciona los síntomas sin detalles."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"medicamentos-y-productos","name":"Medicamentos y productos","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Lista completa con dosis y horario, incluidas vitaminas y productos naturales."},{"level":3,"label":"Logrado","description":"Lista incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"preguntas","name":"Preguntas","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Preguntas claras, concretas y ordenadas por importancia para el médico y el químico farmacéutico."},{"level":3,"label":"Logrado","description":"Preguntas generales o desordenadas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evtiro_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 1, 22)
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
         SET rubric = v_j2, grading_method = 'rubrica', weight = 22,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad tiro-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Comprende tu tiroides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Comprende tu tiroides) en Autocuidado de la tiroides: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Mi registro de exámenes de tiroides';
  v_t2 := $evtiro_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender y aplicar.</p>
<ol><li>Haz una tabla con la fecha, el examen, el resultado, el valor de referencia del laboratorio y la dosis que tomabas.</li><li>Ubica en la tabla el cambio de dosis.</li><li>Describe con tus palabras cómo cambió la TSH después del cambio de dosis, sin sacar conclusiones médicas.</li><li>Escribe tres preguntas para tu médico sobre tus resultados.</li><li>Escribe cuándo crees que te toca el próximo control y confírmalo con tu médico.</li><li>Revisa con la rúbrica y sube tu registro en PDF, DOCX o una foto legible.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Organizar tus resultados de exámenes en una tabla.</li><li>Preparar preguntas sobre tus resultados para el médico.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 1 hora.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 22 %.</li></ul>
<h2>Uso de herramientas de IA</h2>
<p>Puedes usar herramientas de IA para organizar ideas o revisar la redacción, y debes declararlo al final con el uso que les diste. No se aceptan como fuente: cada cita se verifica en la norma o la guía original, y el análisis y las decisiones deben ser tuyos.</p>
<h2>Rúbrica analítica</h2>
<p>La nota de la actividad se calcula sobre 100 y luego se pondera por el 22 % del curso. Los pesos de los criterios suman 100 %.</p>
<details>
  <summary>Ver la rúbrica completa con sus cinco niveles</summary>
  <table>
  <caption>Rúbrica de la actividad</caption>
  <thead><tr><th scope="col">Criterio</th><th scope="col">Peso</th><th scope="col">Destacado (4)</th><th scope="col">Logrado (3)</th><th scope="col">En desarrollo (2)</th><th scope="col">Inicial (1)</th><th scope="col">Sin evidencia (0)</th></tr></thead>
  <tbody>
  <tr><td>Tabla</td><td>35 %</td><td>Tabla completa y ordenada por fecha, con resultado, valor de referencia y dosis.</td><td>Tabla con datos faltantes.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Lectura de los resultados</td><td>25 %</td><td>Describe el cambio de la TSH tras el ajuste de dosis sin hacer diagnósticos.</td><td>Descripción confusa o con conclusiones médicas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Preguntas</td><td>30 %</td><td>Tres preguntas claras y útiles para el médico.</td><td>Preguntas generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evtiro_html$;
  v_t3 := $evtiro_html$<h2>Caso de estudio</h2>
<p>Imagina que tienes tres resultados de exámenes de tiroides de los últimos dos años en papeles distintos (situación de práctica con datos simulados): TSH de 6,8 hace dos años, de 3,1 hace un año y de 2,4 este año; T4 libre normal en los tres. Te cambiaron la dosis de levotiroxina hace un año.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evtiro_html$;
  v_t4 := 'Una tabla con tus resultados y tus preguntas para el médico.';
  v_t5 := 'Una o dos páginas.';
  v_t6 := $evtiro_html$<h2>Materiales, anexos y datos</h2>
<p>Usa los datos simulados del caso. No subas tus exámenes reales ni datos que te identifiquen.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>El inserto de tus medicamentos (levotiroxina o antitiroideo) aprobado por el INVIMA, las indicaciones escritas de tu médico y de tu químico farmacéutico, y páginas oficiales de salud. Cuando uses una fuente, escribe de dónde la tomaste.</p>$evtiro_html$;
  v_t7 := NULL;
  v_j1 := $evtiro_json$["Tabla de resultados.","Cambio de dosis.","Descripción sin diagnóstico.","Preguntas."]$evtiro_json$::jsonb;
  v_j2 := $evtiro_json${"version":1,"total":100,"criteria":[{"id":"tabla","name":"Tabla","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Tabla completa y ordenada por fecha, con resultado, valor de referencia y dosis."},{"level":3,"label":"Logrado","description":"Tabla con datos faltantes."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"lectura-de-los-resultados","name":"Lectura de los resultados","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Describe el cambio de la TSH tras el ajuste de dosis sin hacer diagnósticos."},{"level":3,"label":"Logrado","description":"Descripción confusa o con conclusiones médicas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"preguntas","name":"Preguntas","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Tres preguntas claras y útiles para el médico."},{"level":3,"label":"Logrado","description":"Preguntas generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evtiro_json$::jsonb;
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
       TRUE, ARRAY['pdf','docx','xlsx','pptx','png','jpg','jpeg']::text[], 20, 100, TRUE, 'publicado', 2, 22)
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
         SET rubric = v_j2, grading_method = 'rubrica', weight = 22,
             allow_text = TRUE, allow_link = TRUE, allow_file = TRUE, max_points = 100, is_required = TRUE
       WHERE id = v_act;
    END IF;
  END IF;


  -- ── Actividad tiro-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Medicamentos y autocuidado seguro' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Medicamentos y autocuidado seguro) en Autocuidado de la tiroides: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: mi plan de autocuidado para Doña Elsa';
  v_t2 := $evtiro_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar y crear.</p>
<ol><li>Fase 1: escribe las preguntas que Doña Elsa debería llevar a su médico y a su químico farmacéutico.</li><li>Fase 2: diseña una tabla para registrar sus exámenes y sus controles.</li><li>Fase 3: organiza un horario diario para la levotiroxina, el calcio y el multivitamínico con hierro.</li><li>Fase 3: propone dos recordatorios para que no olvide su medicamento.</li><li>Fase 3: escribe qué haría con el té para adelgazar y por qué debe consultarlo.</li><li>Escribe las señales por las que debería consultar pronto.</li><li>Revisa con la rúbrica y sube el plan en PDF, DOCX o una foto legible.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Empieza aquí.</strong> Preguntas para el equipo de salud y fuentes confiables.</li>
  <li><strong>Fase 2 · Comprende tu tiroides.</strong> Registro de exámenes y señales que conviene consultar.</li>
  <li><strong>Fase 3 · Medicamentos y autocuidado.</strong> Rutina de la levotiroxina, horarios y plan de control.</li>
</ol>
<p>La entrega final integra todas las fases.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar un plan de autocuidado práctico y seguro.</li><li>Organizar horarios, controles y señales de alarma.</li></ul>
<h2>Tiempo y modalidad</h2>
<ul><li>Tiempo estimado: 1 hora y media.</li><li>Modalidad: Individual.</li><li>Peso en el curso: 16 %.</li></ul>
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
  <tr><td>Preguntas y registro</td><td>25 %</td><td>Preguntas claras y una tabla útil para registrar exámenes y controles.</td><td>Preguntas o tabla incompletas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Horario</td><td>35 %</td><td>Levotiroxina en ayunas con agua y calcio e hierro separados varias horas, en un horario realista.</td><td>Horario con algún error de separación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Recordatorios y té</td><td>20 %</td><td>Recordatorios prácticos y recomendación de consultar antes de tomar el té.</td><td>Aborda solo uno.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Señales para consultar</td><td>10 %</td><td>Señales claras para consultar pronto.</td><td>Señales generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evtiro_html$;
  v_t3 := $evtiro_html$<h2>Caso de estudio</h2>
<p>Imagina a Doña Elsa, de 58 años, que tiene hipotiroidismo y toma levotiroxina (situación de práctica con datos simulados). También toma calcio, un multivitamínico con hierro y, a veces, un té «para adelgazar». Se le olvida el medicamento algunas mañanas y no sabe cuándo es su próximo control. Su hija te pide ayuda para organizar un plan de autocuidado. En esta entrega construyes el plan completo con las tres fases.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evtiro_html$;
  v_t4 := 'Un plan de autocuidado de una o dos páginas para Doña Elsa.';
  v_t5 := 'Una o dos páginas.';
  v_t6 := $evtiro_html$<h2>Materiales, anexos y datos</h2>
<p>Usa los datos simulados del caso. No incluyas datos que identifiquen a personas reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>El inserto de tus medicamentos (levotiroxina o antitiroideo) aprobado por el INVIMA, las indicaciones escritas de tu médico y de tu químico farmacéutico, y páginas oficiales de salud. Cuando uses una fuente, escribe de dónde la tomaste.</p>$evtiro_html$;
  v_t7 := NULL;
  v_j1 := $evtiro_json$["Preguntas para el equipo de salud.","Registro de exámenes.","Horario de medicamentos.","Recordatorios y productos naturales.","Señales para consultar."]$evtiro_json$::jsonb;
  v_j2 := $evtiro_json${"version":1,"total":100,"criteria":[{"id":"preguntas-y-registro","name":"Preguntas y registro","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Preguntas claras y una tabla útil para registrar exámenes y controles."},{"level":3,"label":"Logrado","description":"Preguntas o tabla incompletas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"horario","name":"Horario","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Levotiroxina en ayunas con agua y calcio e hierro separados varias horas, en un horario realista."},{"level":3,"label":"Logrado","description":"Horario con algún error de separación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"recordatorios-y-te","name":"Recordatorios y té","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Recordatorios prácticos y recomendación de consultar antes de tomar el té."},{"level":3,"label":"Logrado","description":"Aborda solo uno."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"senales-para-consultar","name":"Señales para consultar","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Señales claras para consultar pronto."},{"level":3,"label":"Logrado","description":"Señales generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evtiro_json$::jsonb;
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


  -- ── Foro tiro-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos qué te trae a este curso';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evtiro_html$<h2>Para empezar</h2>
<p>Cuéntanos en tres o cuatro líneas qué te gustaría entender mejor sobre tu tiroides o la de un familiar, sin compartir datos que te identifiquen.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evtiro_html$;
  v_t4 := '¿Qué te trae a este curso y qué te gustaría saber al terminarlo?';
  v_t5 := $evtiro_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evtiro_html$;
  v_t6 := $evtiro_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evtiro_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Tienes alguna duda sobre tus exámenes o tus medicamentos?', '¿Qué te gustaría preguntarle a tu médico o a tu químico farmacéutico?']::text[];
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


  -- ── Foro tiro-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Empieza aquí' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Empieza aquí) en Autocuidado de la tiroides: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · ¿Dónde buscas información sobre tu salud?';
  v_t2 := 'Compartir cómo reconocer información confiable sobre la tiroides.';
  v_t3 := $evtiro_html$<h2>Caso del foro</h2>
<p>Tres personas del curso cuentan dónde se informan (datos simulados): Ana ve videos en redes sociales, Jorge pregunta en el grupo de WhatsApp de su familia y Rosa lee el inserto y pregunta a su químico farmacéutico.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evtiro_html$;
  v_t4 := '¿Qué fuentes te parecen más confiables y cómo distingues una promesa falsa de una información útil?';
  v_t5 := $evtiro_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y una fuente confiable (el inserto, tu médico o una página oficial de salud). Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.34 %.</li></ul>$evtiro_html$;
  v_t6 := $evtiro_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone una fuente confiable (el inserto, tu médico o una página oficial de salud).</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evtiro_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué señales te hacen desconfiar de un video o un mensaje?', '¿Qué preguntas le harías a tu médico o químico farmacéutico sobre algo que leíste?', '¿Has encontrado alguna vez información que resultó falsa?']::text[];
  v_j1 := $evtiro_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone una fuente confiable (el inserto, tu médico o una página oficial de salud)."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evtiro_json$::jsonb;
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


  -- ── Foro tiro-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Comprende tu tiroides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Comprende tu tiroides) en Autocuidado de la tiroides: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Mis síntomas y la tiroides';
  v_t2 := 'Compartir experiencias sobre síntomas y la importancia de no autodiagnosticarse.';
  v_t3 := $evtiro_html$<h2>Caso del foro</h2>
<p>En el curso, varias personas cuentan que les dijeron que «todo es la tiroides» (datos simulados): una por el cansancio, otra por la caída del cabello y otra por el aumento de peso. Algunas empezaron dietas o suplementos sin consultar.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evtiro_html$;
  v_t4 := '¿Por qué no conviene atribuir todos los síntomas a la tiroides y qué harías antes de cambiar algo en tu tratamiento?';
  v_t5 := $evtiro_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y una fuente confiable (el inserto, tu médico o una página oficial de salud). Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$evtiro_html$;
  v_t6 := $evtiro_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone una fuente confiable (el inserto, tu médico o una página oficial de salud).</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evtiro_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué otros problemas pueden causar cansancio o caída del cabello?', '¿Qué información llevarías a tu médico?', '¿Qué riesgos tiene tomar suplementos para la tiroides sin consultar?']::text[];
  v_j1 := $evtiro_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone una fuente confiable (el inserto, tu médico o una página oficial de salud)."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evtiro_json$::jsonb;
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


  -- ── Foro tiro-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Medicamentos y autocuidado seguro' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Medicamentos y autocuidado seguro) en Autocuidado de la tiroides: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Mi rutina con los medicamentos de la tiroides';
  v_t2 := 'Compartir estrategias para tomar bien los medicamentos de la tiroides todos los días.';
  v_t3 := $evtiro_html$<h2>Caso del foro</h2>
<p>Varias personas del curso cuentan sus dificultades (datos simulados): una toma la levotiroxina con el café porque «si no, se le olvida»; otro trabaja de noche y no sabe cuándo es su «ayuno»; y una señora toma calcio, hierro y levotiroxina juntos para «no complicarse».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evtiro_html$;
  v_t4 := '¿Qué estrategia les recomendarías a cada uno para tomar bien su medicamento sin complicarse la vida?';
  v_t5 := $evtiro_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y una fuente confiable (el inserto, tu médico o tu químico farmacéutico). Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 3.33 %.</li></ul>$evtiro_html$;
  v_t6 := $evtiro_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone una fuente confiable (el inserto, tu médico o tu químico farmacéutico).</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evtiro_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué recordatorios te han funcionado para no olvidar tus medicamentos?', '¿Cómo organizarías el horario si tomas calcio o hierro?', '¿A quién le preguntarías si tienes dudas sobre el horario?']::text[];
  v_j1 := $evtiro_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone una fuente confiable (el inserto, tu médico o tu químico farmacéutico)."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evtiro_json$::jsonb;
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


  RAISE NOTICE 'Autocuidado de la tiroides: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evtiro$;

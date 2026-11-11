-- ============================================================
--  112_quices_actividades_foros_regulatorios9.sql — quizzes, actividades y foros, lote «regulatorios9»
--
--  Generado por scripts/evaluacion-aula.mjs regulatorios9 migracion --publica
--  a partir de contenido/aula/catalogo. No editar a mano.
--
--  Cursos: Regulación Sanitaria del Cannabis Medicinal en Colombia; Asuntos Regulatorios de Radiofármacos.
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
--  Curso de Regulación Sanitaria del Cannabis Medicinal en Colombia
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evcann$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Regulación Sanitaria del Cannabis Medicinal en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Marco legal y gobernanza del cannabis medicinal en Colombia', 'Unidad 2. Licencias y cupos', 'Unidad 3. Productos derivados: vías sanitarias ante el INVIMA', 'Unidad 4. Exportación, vigilancia y farmacovigilancia', 'Unidad 5. Tendencias internacionales y casos integradores']::text[])) < 5 THEN
    RAISE NOTICE 'Regulación Sanitaria del Cannabis Medicinal en Colombia: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evcann_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evcann_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz cann-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Marco legal y gobernanza del cannabis medicinal en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Marco legal y gobernanza del cannabis medicinal en Colombia) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Marco legal y gobernanza del cannabis medicinal en Colombia';
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


    v_t3 := '¿Cuál es el objeto de la Ley 1787 de 2016?';
    v_t4 := 'La Ley 1787 de 2016 crea un marco regulatorio para el acceso seguro e informado al uso médico y científico del cannabis y sus derivados, con control del Estado sobre la cadena (semillas, cultivo, fabricación, comercialización).';
    v_j1 := $evcann_json${"external_id":"cann-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Ley 1787 de 2016: acceso seguro e informado al uso médico y científico","outcome":"Ley 1787 de 2016: acceso seguro e informado al uso médico y científico","source":"Ley 1787 de 2016."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Legalizar el consumo recreativo de cannabis en todo el territorio nacional sin restricciones.', FALSE, 'La ley no regula el uso recreativo.', 0),
      (v_pregunta, 'Crear un marco regulatorio para el acceso seguro e informado al uso médico y científico del cannabis.', TRUE, 'Correcto. Con control estatal de la cadena.', 1),
      (v_pregunta, 'Prohibir toda actividad relacionada con el cannabis, incluida la investigación científica.', FALSE, 'La ley habilita usos médicos y científicos.', 2),
      (v_pregunta, 'Autorizar la venta libre de flor de cannabis en tiendas naturistas del país.', FALSE, 'No es el objeto de la ley.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Según el Decreto 811 de 2021, un cannabis con 0,6 % de THC en peso seco, ¿cómo se clasifica?';
    v_t4 := 'El artículo 2.8.11.1.3 define como psicoactivo el cannabis con THC igual o superior al 1 % en peso seco, y como no psicoactivo el que tiene THC inferior al 1 %. El límite de fiscalización de los productos lo fija el Ministerio de Salud por dosis o por gramo o mililitro.';
    v_j1 := $evcann_json${"external_id":"cann-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Psicoactivo vs. no psicoactivo y límite de fiscalización: control especial THC vs. CBD","outcome":"Psicoactivo vs. no psicoactivo y límite de fiscalización: control especial THC vs. CBD","source":"Decreto 780 de 2016, art. 2.8.11.1.3 (Decreto 811 de 2021)."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Psicoactivo, porque cualquier contenido de THC lo hace psicoactivo.', FALSE, 'El umbral es el 1 %.', 0),
      (v_pregunta, 'Psicoactivo, si se cultiva al aire libre y no en invernadero.', FALSE, 'El lugar de cultivo no define la categoría.', 1),
      (v_pregunta, 'No psicoactivo, porque su THC es inferior al 1 % en peso seco.', TRUE, 'Correcto. Art. 2.8.11.1.3.', 2),
      (v_pregunta, 'No se puede clasificar sin conocer el contenido de CBD de la planta.', FALSE, 'La clasificación se basa en el THC.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué entidad otorga la licencia de fabricación de derivados de cannabis según el Decreto 811 de 2021?';
    v_t4 := 'Según el artículo 2.8.11.1.4, el Invima otorga las licencias de fabricación de derivados (psicoactivos y no psicoactivos), y el Ministerio de Justicia las de semillas para siembra y grano y de cultivo de plantas psicoactivas y no psicoactivas. El FNE hace seguimiento a las de fabricación (art. 2.8.11.1.5).';
    v_j1 := $evcann_json${"external_id":"cann-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Mapa institucional: MinJusticia, INVIMA, FNE, ICA, MinAgricultura y MinCIT","outcome":"Mapa institucional: MinJusticia, INVIMA, FNE, ICA, MinAgricultura y MinCIT","source":"Decreto 780 de 2016, arts. 2.8.11.1.4 y 2.8.11.1.5."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El Invima, mientras el Ministerio de Justicia otorga las de semillas y cultivo.', TRUE, 'Correcto. Art. 2.8.11.1.4.', 0),
      (v_pregunta, 'El Ministerio de Agricultura, porque el cannabis es un producto agrícola.', FALSE, 'No es la autoridad de esa licencia.', 1),
      (v_pregunta, 'La Superintendencia de Industria y Comercio, por tratarse de una actividad comercial.', FALSE, 'No es su competencia.', 2),
      (v_pregunta, 'El Ministerio de Justicia, que también otorga los registros sanitarios de los productos.', FALSE, 'Los registros los otorga el Invima.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un asesor cita en 2026 el Decreto 613 de 2017 como la norma vigente de licencias de cannabis. ¿Cuál es la mejor valoración?';
    v_t4 := 'El Decreto 811 de 2021 sustituyó el Título 11 del Decreto 780 de 2016, que había incorporado el régimen del Decreto 613 de 2017. Antes de citar la norma se verifica en el normograma si hay modificaciones posteriores.';
    v_j1 := $evcann_json${"external_id":"cann-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Decreto 1138 de 2025 y reformas en curso (2026)","outcome":"Decreto 1138 de 2025 y reformas en curso (2026)","source":"Decreto 811 de 2021; normograma del Invima."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcto, porque el Decreto 613 de 2017 nunca fue reemplazado por otra norma posterior.', FALSE, 'Fue sustituido. Revisa la explicación.', 0),
      (v_pregunta, 'Es correcto si la licencia se otorgó antes de 2021.', FALSE, 'La norma aplicable es la vigente.', 1),
      (v_pregunta, 'Es indiferente, porque todas las normas de cannabis dicen lo mismo.', FALSE, 'Cambiaron definiciones, vigencias y trámites.', 2),
      (v_pregunta, 'Está desactualizado: el Decreto 811 de 2021 sustituyó ese régimen.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz cann-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Licencias y cupos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Licencias y cupos) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Licencias y cupos';
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


    v_t3 := '¿Qué vigencia tienen las licencias según el artículo 2.8.11.2.1.8?';
    v_t4 := 'El artículo 2.8.11.2.1.8 fija una vigencia de diez años, renovable por periodos iguales; los titulares con licencias de cinco años pudieron pedir extenderlas otros cinco.';
    v_j1 := $evcann_json${"external_id":"cann-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Tipos y modalidades de licencias (semillas, cultivo psicoactivo y no psicoactivo, fabricación de derivados, extraordinarias)","outcome":"Tipos y modalidades de licencias (semillas, cultivo psicoactivo y no psicoactivo, fabricación de derivados, extraordinarias)","source":"Decreto 780 de 2016, art. 2.8.11.2.1.8."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un año, renovable cada año con una nueva visita de inspección.', FALSE, 'No es la vigencia. Revisa la explicación.', 0),
      (v_pregunta, 'Indefinida, mientras el titular pague una tarifa anual.', FALSE, 'Tienen vigencia definida.', 1),
      (v_pregunta, 'Diez años, renovables por periodos iguales.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Cinco años, sin posibilidad de renovación.', FALSE, 'No es la vigencia actual.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un licenciatario de fabricación de derivados no psicoactivos pide un cupo de fabricación. ¿Qué corresponde?';
    v_t4 := 'El artículo 2.8.11.2.1.4 dispone que los derivados no psicoactivos no requieren cupos. Los cupos (cantidad máxima autorizada durante una vigencia) aplican a las actividades con cannabis psicoactivo.';
    v_j1 := $evcann_json${"external_id":"cann-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Cupos de cultivo y de fabricación: ordinarios y suplementarios","outcome":"Cupos de cultivo y de fabricación: ordinarios y suplementarios","source":"Decreto 780 de 2016, art. 2.8.11.2.1.4."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No requiere cupo: los derivados no psicoactivos no están sujetos a cupos.', TRUE, 'Correcto. Art. 2.8.11.2.1.4.', 0),
      (v_pregunta, 'Debe pedir un cupo ordinario al Ministerio de Agricultura cada año.', FALSE, 'No requiere cupo. Revisa la explicación.', 1),
      (v_pregunta, 'Debe pedir un cupo suplementario antes de cada lote.', FALSE, 'No requiere cupo. Revisa la explicación.', 2),
      (v_pregunta, 'Debe pedir el cupo al Fondo Nacional de Estupefacientes cada mes.', FALSE, 'No requiere cupo. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué papel tiene el Fondo Nacional de Estupefacientes en el cannabis medicinal?';
    v_t4 := 'El artículo 2.8.11.1.5 asigna al FNE el seguimiento a las licencias de fabricación de derivados y el control del cannabis psicoactivo, sus derivados y los productos sujetos a control especial, sin perjuicio de las competencias sanitarias del Invima.';
    v_j1 := $evcann_json${"external_id":"cann-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"El FNE: inscripción, control especial y reportes","outcome":"El FNE: inscripción, control especial y reportes","source":"Decreto 780 de 2016, art. 2.8.11.1.5."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Otorga los registros sanitarios de los medicamentos con cannabinoides que se venden en el país.', FALSE, 'Eso corresponde al Invima.', 0),
      (v_pregunta, 'Otorga las licencias de cultivo de plantas psicoactivas.', FALSE, 'Eso corresponde al Ministerio de Justicia.', 1),
      (v_pregunta, 'Fija los precios de venta de los productos con cannabis.', FALSE, 'No es su función. Revisa la explicación.', 2),
      (v_pregunta, 'Hace seguimiento a las licencias de fabricación y controla los derivados psicoactivos.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un licenciatario pide un cupo de fabricación sin soportes de demanda «para tener margen». ¿Cuál es la mejor valoración?';
    v_t4 := 'El cupo es la cantidad máxima autorizada durante una vigencia (art. 2.8.11.1.3); su solicitud se sustenta con la necesidad, los soportes de demanda y un plan de reporte. Pedir sin soportes aumenta el riesgo de negación.';
    v_j1 := $evcann_json${"external_id":"cann-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso: solicitud de un cupo ordinario de fabricación","outcome":"Caso: solicitud de un cupo ordinario de fabricación","source":"Decreto 780 de 2016, art. 2.8.11.1.3."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es una buena práctica, porque un cupo amplio evita pedir cupos suplementarios después.', FALSE, 'El cupo debe sustentarse.', 0),
      (v_pregunta, 'Es aceptable si el licenciatario tiene una planta grande.', FALSE, 'La capacidad no sustituye la demanda.', 1),
      (v_pregunta, 'Es débil: el cupo se sustenta con la necesidad y los soportes de demanda.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Es aceptable si el producto es para exportación.', FALSE, 'También se sustenta.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz cann-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Productos derivados: vías sanitarias ante el INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Productos derivados: vías sanitarias ante el INVIMA) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Productos derivados: vías sanitarias ante el INVIMA';
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


    v_t3 := 'Según el Decreto 811 de 2021, ¿qué necesita un producto terminado con cannabis para comercializarse?';
    v_t4 := 'El numeral 38 del artículo 2.8.11.1.3 define el producto terminado como la preparación para consumo humano o veterinario que cuente con la autorización sanitaria o de comercialización que aplique (registro de medicamento, fitoterapéutico, notificación de cosmético, alimento, etc.).';
    v_j1 := $evcann_json${"external_id":"cann-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: de derivado a producto terminado","outcome":"Introducción a la unidad: de derivado a producto terminado","source":"Decreto 780 de 2016, art. 2.8.11.1.3."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo la licencia de fabricación de derivados del fabricante.', FALSE, 'La licencia no basta.', 0),
      (v_pregunta, 'La autorización sanitaria o de comercialización que aplique según el tipo de producto.', TRUE, 'Correcto. Num. 38 del art. 2.8.11.1.3.', 1),
      (v_pregunta, 'Solo el registro de marca ante la Superintendencia de Industria y Comercio.', FALSE, 'No es una autorización sanitaria.', 2),
      (v_pregunta, 'Ningún trámite, si el producto tiene menos del 1 % de THC.', FALSE, 'Requiere autorización sanitaria.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un laboratorio quiere registrar un medicamento con un cannabinoide como principio activo. ¿Qué evaluaciones exige el Decreto 677 de 1995?';
    v_t4 := 'Un medicamento con cannabinoides como principio activo se evalúa como medicamento: evaluación farmacológica (eficacia y seguridad por la Sala Especializada), farmacéutica y legal (Decreto 677 de 1995), con BPM y licencias de cannabis vigentes.';
    v_j1 := $evcann_json${"external_id":"cann-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Registro sanitario y BPM de medicamentos a base de cannabis","outcome":"Registro sanitario y BPM de medicamentos a base de cannabis","source":"Decreto 677 de 1995."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo la evaluación legal, porque el cannabis ya está autorizado por ley.', FALSE, 'Se requieren más evaluaciones.', 0),
      (v_pregunta, 'Solo un certificado de análisis del contenido de THC y CBD.', FALSE, 'No basta. Revisa la explicación.', 1),
      (v_pregunta, 'La farmacológica, la farmacéutica y la legal, como cualquier medicamento nuevo.', TRUE, 'Correcto. Con BPM y licencias vigentes.', 2),
      (v_pregunta, 'Ninguna, porque los medicamentos con cannabis se registran de forma automática.', FALSE, 'No hay registro automático.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué limita el uso de la vía de fitoterapéutico para un extracto de cannabis?';
    v_t4 := 'El Decreto 1156 de 2018 exige que la planta esté en el listado del Invima para su categoría y prohíbe combinar con sustancias activas aisladas y químicamente definidas (arts. 15 y 20); para el cannabis se suman los controles de THC y las licencias.';
    v_j1 := $evcann_json${"external_id":"cann-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Fitoterapéuticos con cannabis","outcome":"Fitoterapéuticos con cannabis","source":"Decreto 1156 de 2018, arts. 5, 15 y 20."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La planta debe estar en el listado y no puede combinarse con sustancias aisladas.', TRUE, 'Correcto. Además del control del THC.', 0),
      (v_pregunta, 'Que los fitoterapéuticos solo pueden venderse en hospitales públicos.', FALSE, 'No es una limitación real.', 1),
      (v_pregunta, 'Que los fitoterapéuticos no pueden contener extractos vegetales.', FALSE, 'Sí pueden contenerlos.', 2),
      (v_pregunta, 'Que el Decreto 1156 prohíbe expresamente cualquier planta que contenga cannabinoides en su composición.', FALSE, 'No es lo verificado.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una marca de cosméticos quiere decir que su crema con CBD «alivia el dolor articular». ¿Cuál es la mejor valoración?';
    v_t4 := 'Los cosméticos no pueden tener indicaciones terapéuticas; un claim como «alivia el dolor articular» convierte el producto en algo distinto de un cosmético. Además, el THC debe controlarse y la materia prima debe provenir de licenciatarios.';
    v_j1 := $evcann_json${"external_id":"cann-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Cosméticos con CBD","outcome":"Cosméticos con CBD","source":"Normativa sanitaria de cosméticos; Decreto 780 de 2016, Título 2.8.11."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es aceptable, porque el CBD tiene estudios publicados sobre efectos analgésicos en personas.', FALSE, 'Un cosmético no puede tener claims terapéuticos.', 0),
      (v_pregunta, 'Es aceptable si la crema tiene menos del 1 % de THC.', FALSE, 'El THC no cambia la regla de los claims.', 1),
      (v_pregunta, 'Es aceptable si se aclara que es «natural».', FALSE, 'No cambia la naturaleza del claim.', 2),
      (v_pregunta, 'Es inaceptable: un cosmético no puede atribuirse efectos terapéuticos.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz cann-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Exportación, vigilancia y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Exportación, vigilancia y farmacovigilancia) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Exportación, vigilancia y farmacovigilancia';
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


    v_t3 := '¿Qué riesgo farmacológico es relevante en la farmacovigilancia del cannabidiol (CBD)?';
    v_t4 := 'El CBD inhibe enzimas del citocromo P450 (por ejemplo, CYP2C19 y CYP3A4), con interacciones relevantes (como con clobazam y valproato), y puede elevar las transaminasas. La farmacovigilancia vigila estos riesgos.';
    v_j1 := $evcann_json${"external_id":"cann-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Farmacovigilancia de medicamentos y magistrales con cannabis","outcome":"Farmacovigilancia de medicamentos y magistrales con cannabis","source":"Fichas técnicas de cannabidiol aprobado (EMA y FDA)."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No tiene ningún riesgo, porque es un compuesto natural.', FALSE, 'Tiene riesgos documentados.', 0),
      (v_pregunta, 'Interacciones por inhibición de enzimas CYP y elevación de transaminasas.', TRUE, 'Correcto. Sobre todo con antiepilépticos.', 1),
      (v_pregunta, 'Que produce dependencia física intensa en todos los pacientes desde la primera dosis.', FALSE, 'No es su perfil principal.', 2),
      (v_pregunta, 'Que solo causa efectos adversos si se usa por vía inhalada.', FALSE, 'Los efectos no dependen solo de la vía.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Un paciente con epilepsia que toma valproato inicia un aceite de CBD. ¿Qué recomendación es más adecuada?';
    v_t4 := 'La combinación de CBD con valproato se asocia a elevación de transaminasas; se recomienda vigilar la función hepática, revisar interacciones, coordinar con el médico y notificar eventos adversos.';
    v_j1 := $evcann_json${"external_id":"cann-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Farmacovigilancia de medicamentos y magistrales con cannabis","outcome":"Farmacovigilancia de medicamentos y magistrales con cannabis","source":"Fichas técnicas de cannabidiol aprobado; Programa Nacional de Farmacovigilancia."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Vigilar enzimas hepáticas e interacciones, y coordinar con el médico tratante.', TRUE, 'Correcto. Y notificar eventos.', 0),
      (v_pregunta, 'Suspender el valproato, porque el CBD lo reemplaza.', FALSE, 'No se suspende sin indicación médica.', 1),
      (v_pregunta, 'Duplicar la dosis de CBD para lograr el efecto más rápido.', FALSE, 'Aumenta el riesgo. Revisa la explicación.', 2),
      (v_pregunta, 'No hacer nada, porque el CBD no interactúa con otros medicamentos.', FALSE, 'Sí interactúa. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Para exportar un derivado psicoactivo, ¿qué análisis es correcto según el Decreto 811 de 2021?';
    v_t4 := 'La exportación de derivados psicoactivos requiere licencia de fabricación, cupo y, según el artículo 2.8.11.2.2.4, proyecciones de un año de actividades, volúmenes y países importadores; además, los permisos del país de destino bajo la Convención de 1961.';
    v_j1 := $evcann_json${"external_id":"cann-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Exportación de flor seca y derivados: Resolución 539 de 2022 y mercados destino","outcome":"Exportación de flor seca y derivados: Resolución 539 de 2022 y mercados destino","source":"Decreto 780 de 2016, art. 2.8.11.2.2.4; Convención Única de 1961."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo se necesita una factura comercial y el certificado de origen.', FALSE, 'Se requieren licencias y controles.', 0),
      (v_pregunta, 'Licencia, cupo y proyecciones de actividades, volúmenes y países importadores.', TRUE, 'Correcto. Art. 2.8.11.2.2.4.', 1),
      (v_pregunta, 'Se puede exportar sin licencia en Colombia si el país de destino lo permite en su norma.', FALSE, 'Se requiere licencia en Colombia.', 2),
      (v_pregunta, 'Se requiere solo el registro sanitario del producto en Colombia.', FALSE, 'No basta. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una tienda vende gotas de «aceite de cannabis medicinal» sin registro, que curan «todo tipo de cáncer». ¿Cuál es la mejor valoración?';
    v_t4 := 'Un producto sin autorización sanitaria que promete curar el cáncer es fraudulento y peligroso; puede contener THC no declarado o contaminantes. Se reporta a la autoridad sanitaria y se orienta al paciente a no abandonar su tratamiento.';
    v_j1 := $evcann_json${"external_id":"cann-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Productos fraudulentos y alertas sanitarias del INVIMA","outcome":"Productos fraudulentos y alertas sanitarias del INVIMA","source":"Decreto 780 de 2016, art. 2.8.11.1.3; alertas del Invima."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es aceptable si el producto es artesanal, natural y de producción local en pequeña escala.', FALSE, 'No exime de autorización.', 0),
      (v_pregunta, 'Es aceptable si la tienda tiene licencia de cultivo.', FALSE, 'La licencia no autoriza el producto.', 1),
      (v_pregunta, 'Es aceptable si el THC es menor del 1 %.', FALSE, 'Igual requiere autorización y no puede prometer curas.', 2),
      (v_pregunta, 'Es un producto fraudulento: sin autorización y con promesas engañosas.', TRUE, 'Correcto. Se reporta al Invima.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz cann-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Tendencias internacionales y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Tendencias internacionales y casos integradores) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Tendencias internacionales y casos integradores';
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


    v_t3 := '¿Qué decidió la Comisión de Estupefacientes de la ONU en diciembre de 2020 sobre el cannabis?';
    v_t4 := 'En diciembre de 2020, la Comisión de Estupefacientes, siguiendo recomendaciones de la OMS de 2019, retiró el cannabis y la resina de cannabis de la Lista IV de la Convención Única de 1961, manteniéndolos en la Lista I. Sigue sujeto a fiscalización.';
    v_j1 := $evcann_json${"external_id":"cann-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Reclasificación del cannabis en la ONU (OMS 2019 – CND 2020)","outcome":"Reclasificación del cannabis en la ONU (OMS 2019 – CND 2020)","source":"Convención Única de 1961; decisión de la Comisión de Estupefacientes (2020)."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Retirarlo de la Lista IV de la Convención de 1961, manteniéndolo en la Lista I.', TRUE, 'Correcto. Reconoce su potencial médico.', 0),
      (v_pregunta, 'Legalizar el uso recreativo del cannabis en todos los países miembros.', FALSE, 'No fue esa la decisión.', 1),
      (v_pregunta, 'Eliminar el cannabis de todas las listas de fiscalización internacional.', FALSE, 'Sigue fiscalizado. Revisa la explicación.', 2),
      (v_pregunta, 'Prohibir el uso médico del cannabis en todo el mundo.', FALSE, 'No fue esa la decisión.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Al planear el lanzamiento de un medicamento con cannabinoides, ¿cuál es el orden lógico de los trámites?';
    v_t4 := 'La ruta lógica es: clasificar el producto y la vía sanitaria; obtener licencias y cupos (Título 2.8.11); asegurar BPM; obtener el registro sanitario (Decreto 677 de 1995) y operar la farmacovigilancia.';
    v_j1 := $evcann_json${"external_id":"cann-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Caso integrador: lanzamiento de un medicamento con cannabinoides","outcome":"Caso integrador: lanzamiento de un medicamento con cannabinoides","source":"Decreto 780 de 2016, Título 2.8.11; Decreto 677 de 1995."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Primero la publicidad, luego el registro y al final las licencias.', FALSE, 'La publicidad va al final.', 0),
      (v_pregunta, 'Clasificación, licencias y cupos, BPM, registro sanitario y farmacovigilancia.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'Primero vender, y luego tramitar el registro con los datos de ventas.', FALSE, 'No se vende sin registro.', 2),
      (v_pregunta, 'Solo el registro sanitario, porque incluye todas las licencias.', FALSE, 'Son trámites distintos.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un informe afirma que Colombia tiene «cientos de licencias pero pocos productos registrados». ¿Qué análisis es más útil?';
    v_t4 := 'La diferencia entre licencias y productos registrados sugiere brechas en la ruta: evidencia para el registro, BPM, costos, demanda y acceso a mercados. Analizarlas con datos permite proponer mejoras regulatorias y de negocio.';
    v_j1 := $evcann_json${"external_id":"cann-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Desafíos de la industria colombiana: mercado, pequeños cultivadores y competitividad","outcome":"Desafíos de la industria colombiana: mercado, pequeños cultivadores y competitividad","source":"Decreto 780 de 2016, Título 2.8.11; datos públicos de licencias y registros."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Que el modelo funciona perfectamente y no hay nada que mejorar.', FALSE, 'El dato sugiere brechas.', 0),
      (v_pregunta, 'Que las licencias deberían eliminarse por completo.', FALSE, 'Es una conclusión extrema.', 1),
      (v_pregunta, 'Que hay brechas entre licencia y producto: registro, evidencia, BPM y mercado.', TRUE, 'Correcto. Se analizan con datos.', 2),
      (v_pregunta, 'Que los productos registrados no necesitan licencias.', FALSE, 'Las licencias son necesarias.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un pequeño cultivador quiere aplicar una reforma de 2025 que leyó en una noticia. ¿Cuál es la mejor valoración?';
    v_t4 := 'Antes de aplicar una reforma se verifica el texto oficial en el normograma, su vigencia, el régimen de transición y si requiere reglamentación técnica adicional; las noticias no sustituyen la fuente.';
    v_j1 := $evcann_json${"external_id":"cann-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Caso integrador: pequeño cultivador y flor medicinal bajo el Decreto 1138 de 2025","outcome":"Caso integrador: pequeño cultivador y flor medicinal bajo el Decreto 1138 de 2025","source":"Normograma del Invima; buenas prácticas regulatorias."}$evcann_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'cann-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Aplicarla de inmediato, porque las noticias de los medios son fuentes confiables y suficientes.', FALSE, 'Se verifica en la fuente oficial.', 0),
      (v_pregunta, 'Ignorarla, porque las reformas nunca cambian nada en la práctica.', FALSE, 'Las reformas pueden cambiar requisitos.', 1),
      (v_pregunta, 'Aplicarla solo si la noticia la publicó un medio internacional.', FALSE, 'No reemplaza la fuente oficial.', 2),
      (v_pregunta, 'Verificar el texto oficial, su vigencia y su reglamentación antes de actuar.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad cann-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Marco legal y gobernanza del cannabis medicinal en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Marco legal y gobernanza del cannabis medicinal en Colombia) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Clasificación de materiales y actividades con cannabis';
  v_t2 := $evcann_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Clasifica cada material como psicoactivo o no psicoactivo.</li><li>Identifica la licencia y la autoridad de cada actividad.</li><li>Indica si la actividad requiere cupo.</li><li>Indica el papel del FNE.</li><li>Indica qué autorización sanitaria requeriría cada producto terminado.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Aplicar las definiciones y umbrales.</li><li>Identificar la licencia y la autoridad de cada actividad.</li><li>Identificar si requiere cupo.</li></ul>
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
  <tr><td>Clasificación</td><td>30 %</td><td>Aplica el umbral del 1 % de THC correctamente.</td><td>Error en una clasificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Licencias y cupos</td><td>40 %</td><td>Licencias del Ministerio de Justicia y del Invima, y cupos solo para psicoactivos.</td><td>Licencias o cupos con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>FNE y autorización</td><td>20 %</td><td>Papel del FNE y autorización sanitaria del producto terminado.</td><td>Análisis general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evcann_html$;
  v_t3 := $evcann_html$<h2>Caso de estudio</h2>
<p>CannaAndes (ficticia) planea (datos simulados): (1) cultivar plantas con THC del 0,4 % para obtener CBD; (2) cultivar plantas con THC del 12 % para investigación médica; (3) fabricar un aceite de CBD con trazas de THC; (4) fabricar un extracto con THC alto para un medicamento; (5) vender grano para alimentos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evcann_html$;
  v_t4 := 'Tabla de actividades con licencias, cupos y autoridades.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evcann_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 1787 de 2016; Decreto 780 de 2016, Título 2.8.11, sustituido por el Decreto 811 de 2021, y sus modificaciones vigentes (verificar en el normograma); Decreto 677 de 1995; Decreto 1156 de 2018; Convención Única de 1961 y decisión de la Comisión de Estupefacientes de 2020; alertas del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evcann_html$;
  v_t7 := NULL;
  v_j1 := $evcann_json$["Clasificación.","Licencia y autoridad.","Cupo.","FNE.","Autorización sanitaria."]$evcann_json$::jsonb;
  v_j2 := $evcann_json${"version":1,"total":100,"criteria":[{"id":"clasificacion","name":"Clasificación","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Aplica el umbral del 1 % de THC correctamente."},{"level":3,"label":"Logrado","description":"Error en una clasificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"licencias-y-cupos","name":"Licencias y cupos","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Licencias del Ministerio de Justicia y del Invima, y cupos solo para psicoactivos."},{"level":3,"label":"Logrado","description":"Licencias o cupos con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"fne-y-autorizacion","name":"FNE y autorización","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Papel del FNE y autorización sanitaria del producto terminado."},{"level":3,"label":"Logrado","description":"Análisis general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evcann_json$::jsonb;
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


  -- ── Actividad cann-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Licencias y cupos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Licencias y cupos) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Simulación de una solicitud de cupo de fabricación';
  v_t2 := $evcann_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Estima la cantidad de extracto necesaria para cada destino (ensayos, magistrales).</li><li>Sustenta la demanda con los soportes disponibles y señala los que faltan.</li><li>Describe a quién se dirige la solicitud y el papel del FNE.</li><li>Diseña el plan de reporte y trazabilidad.</li><li>Identifica los riesgos de negación.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Calcular la necesidad de cupo.</li><li>Sustentar la demanda.</li><li>Diseñar el plan de reporte.</li></ul>
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
  <tr><td>Cálculo y soportes</td><td>40 %</td><td>Cálculo coherente con soportes de demanda reales y vacíos identificados.</td><td>Cálculo sin soportes.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Autoridades y reporte</td><td>30 %</td><td>Licencia del Invima, seguimiento del FNE y plan de trazabilidad.</td><td>Reporte general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Riesgos</td><td>20 %</td><td>Riesgos de negación y mitigación.</td><td>Riesgos generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evcann_html$;
  v_t3 := $evcann_html$<h2>Caso de estudio</h2>
<p>Farmacann (ficticia) tiene licencia de fabricación de derivados psicoactivos y quiere un cupo ordinario para producir un extracto con THC destinado a un medicamento en desarrollo y a preparaciones magistrales (datos simulados). Tiene cartas de intención de dos farmacias magistrales y un plan de ensayos clínicos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evcann_html$;
  v_t4 := 'Solicitud de cupo simulada con plan de reporte.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evcann_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 1787 de 2016; Decreto 780 de 2016, Título 2.8.11, sustituido por el Decreto 811 de 2021, y sus modificaciones vigentes (verificar en el normograma); Decreto 677 de 1995; Decreto 1156 de 2018; Convención Única de 1961 y decisión de la Comisión de Estupefacientes de 2020; alertas del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evcann_html$;
  v_t7 := NULL;
  v_j1 := $evcann_json$["Cálculo.","Soportes.","Autoridades.","Reporte.","Riesgos."]$evcann_json$::jsonb;
  v_j2 := $evcann_json${"version":1,"total":100,"criteria":[{"id":"calculo-y-soportes","name":"Cálculo y soportes","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Cálculo coherente con soportes de demanda reales y vacíos identificados."},{"level":3,"label":"Logrado","description":"Cálculo sin soportes."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"autoridades-y-reporte","name":"Autoridades y reporte","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Licencia del Invima, seguimiento del FNE y plan de trazabilidad."},{"level":3,"label":"Logrado","description":"Reporte general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"riesgos","name":"Riesgos","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Riesgos de negación y mitigación."},{"level":3,"label":"Logrado","description":"Riesgos generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evcann_json$::jsonb;
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


  -- ── Actividad cann-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Exportación, vigilancia y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Exportación, vigilancia y farmacovigilancia) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Ruta regulatoria para exportar un extracto de cannabis';
  v_t2 := $evcann_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lista los requisitos en Colombia (licencia, cupo, proyecciones del art. 2.8.11.2.2.4).</li><li>Identifica los permisos del país de destino bajo la Convención de 1961.</li><li>Describe los documentos de exportación y la trazabilidad.</li><li>Planea la conciliación de cantidades y los reportes al FNE.</li><li>Identifica los riesgos y cómo mitigarlos.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Construir la ruta de exportación.</li><li>Identificar los permisos en origen y destino.</li><li>Planear la conciliación y el reporte.</li></ul>
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
  <tr><td>Requisitos</td><td>35 %</td><td>Licencia, cupo que contemple exportación y proyecciones (art. 2.8.11.2.2.4).</td><td>Requisitos incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Destino y trazabilidad</td><td>35 %</td><td>Permisos de importación del destino, documentos y trazabilidad.</td><td>Análisis parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Conciliación y riesgos</td><td>20 %</td><td>Conciliación con el FNE y riesgos mitigados.</td><td>Conciliación general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evcann_html$;
  v_t3 := $evcann_html$<h2>Caso de estudio</h2>
<p>ExportCann (ficticia) quiere exportar un extracto psicoactivo a un país que permite el cannabis medicinal (datos simulados). Tiene licencia de fabricación de derivados psicoactivos, pero su cupo actual no contempla exportación y no ha contactado a la autoridad del país de destino.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evcann_html$;
  v_t4 := 'Ruta regulatoria de exportación.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evcann_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 1787 de 2016; Decreto 780 de 2016, Título 2.8.11, sustituido por el Decreto 811 de 2021, y sus modificaciones vigentes (verificar en el normograma); Decreto 677 de 1995; Decreto 1156 de 2018; Convención Única de 1961 y decisión de la Comisión de Estupefacientes de 2020; alertas del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evcann_html$;
  v_t7 := NULL;
  v_j1 := $evcann_json$["Requisitos en Colombia.","Permisos en destino.","Documentos y trazabilidad.","Conciliación y reportes.","Riesgos."]$evcann_json$::jsonb;
  v_j2 := $evcann_json${"version":1,"total":100,"criteria":[{"id":"requisitos","name":"Requisitos","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Licencia, cupo que contemple exportación y proyecciones (art. 2.8.11.2.2.4)."},{"level":3,"label":"Logrado","description":"Requisitos incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"destino-y-trazabilidad","name":"Destino y trazabilidad","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Permisos de importación del destino, documentos y trazabilidad."},{"level":3,"label":"Logrado","description":"Análisis parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"conciliacion-y-riesgos","name":"Conciliación y riesgos","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Conciliación con el FNE y riesgos mitigados."},{"level":3,"label":"Logrado","description":"Conciliación general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evcann_json$::jsonb;
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


  -- ── Actividad cann-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Productos derivados: vías sanitarias ante el INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Productos derivados: vías sanitarias ante el INVIMA) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: clasificación, licencias y registro del medicamento con CBD';
  v_t2 := $evcann_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define el contenido de THC (ficticio) de la materia prima.</li><li>Fase 1: clasifica el cultivo y el derivado, e identifica las autoridades.</li><li>Fase 2: define licencias, cupos (si aplican) y el papel del FNE.</li><li>Fase 3: planea el registro (evaluaciones farmacológica, farmacéutica y legal) y las BPM.</li><li>Fase 3: identifica la evidencia clínica necesaria.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco legal).</strong> Clasificación y autoridades.</li>
  <li><strong>Fase 2 · Unidad 2 (licencias y cupos).</strong> Licencias, cupos y FNE.</li>
  <li><strong>Fase 3 · Unidad 3 (vía sanitaria).</strong> Registro del medicamento y BPM.</li>
  <li><strong>Fase 4 · Unidad 4 (exportación y vigilancia).</strong> Exportación y farmacovigilancia.</li>
  <li><strong>Fase 5 · Unidad 5 (tendencias).</strong> Riesgos regulatorios y cambios normativos.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar y definir licencias y cupos.</li><li>Planear el registro del medicamento.</li></ul>
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
  <tr><td>Clasificación y licencias</td><td>35 %</td><td>Umbral de THC aplicado, licencias del Ministerio de Justicia y del Invima, cupos solo si es psicoactivo.</td><td>Errores de licencias o cupos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Registro</td><td>35 %</td><td>Evaluaciones del Decreto 677, BPM y evidencia clínica en la indicación.</td><td>Registro incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Autoridades</td><td>20 %</td><td>Rol del FNE y del Invima bien diferenciados.</td><td>Roles confusos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evcann_html$;
  v_t3 := $evcann_html$<h2>Caso de estudio</h2>
<p>CannaMed (ficticia) quiere lanzar en Colombia un medicamento con CBD para un tipo de epilepsia refractaria, fabricado con cannabis cultivado en el país, y luego exportar el extracto (datos simulados). Te encargan el plan regulatorio completo. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evcann_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evcann_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 1787 de 2016; Decreto 780 de 2016, Título 2.8.11, sustituido por el Decreto 811 de 2021, y sus modificaciones vigentes (verificar en el normograma); Decreto 677 de 1995; Decreto 1156 de 2018; Convención Única de 1961 y decisión de la Comisión de Estupefacientes de 2020; alertas del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evcann_html$;
  v_t7 := NULL;
  v_j1 := $evcann_json$["Clasificación.","Licencias y cupos.","FNE.","Registro y BPM.","Evidencia clínica."]$evcann_json$::jsonb;
  v_j2 := $evcann_json${"version":1,"total":100,"criteria":[{"id":"clasificacion-y-licencias","name":"Clasificación y licencias","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Umbral de THC aplicado, licencias del Ministerio de Justicia y del Invima, cupos solo si es psicoactivo."},{"level":3,"label":"Logrado","description":"Errores de licencias o cupos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"registro","name":"Registro","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Evaluaciones del Decreto 677, BPM y evidencia clínica en la indicación."},{"level":3,"label":"Logrado","description":"Registro incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"autoridades","name":"Autoridades","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Rol del FNE y del Invima bien diferenciados."},{"level":3,"label":"Logrado","description":"Roles confusos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evcann_json$::jsonb;
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


  -- ── Actividad cann-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Tendencias internacionales y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Tendencias internacionales y casos integradores) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: exportación, farmacovigilancia y riesgos del medicamento con CBD';
  v_t2 := $evcann_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: diseña la ruta de exportación del extracto.</li><li>Fase 4: diseña la farmacovigilancia (interacciones CYP, función hepática).</li><li>Fase 5: identifica los riesgos regulatorios y cómo verificarías los cambios normativos.</li><li>Fase 5: define indicadores de cumplimiento.</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (marco legal).</strong> Clasificación y autoridades.</li>
  <li><strong>Fase 2 · Unidad 2 (licencias y cupos).</strong> Licencias, cupos y FNE.</li>
  <li><strong>Fase 3 · Unidad 3 (vía sanitaria).</strong> Registro del medicamento y BPM.</li>
  <li><strong>Fase 4 · Unidad 4 (exportación y vigilancia).</strong> Exportación y farmacovigilancia.</li>
  <li><strong>Fase 5 · Unidad 5 (tendencias).</strong> Riesgos regulatorios y cambios normativos.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Planear la exportación y la farmacovigilancia.</li><li>Gestionar los riesgos y los cambios normativos.</li></ul>
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
  <tr><td>Exportación</td><td>25 %</td><td>Licencia, cupo o condición aplicable, proyecciones y permisos del destino.</td><td>Ruta incompleta.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Farmacovigilancia</td><td>30 %</td><td>Interacciones CYP, transaminasas, notificación y plan de gestión del riesgo.</td><td>Farmacovigilancia general.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Riesgos</td><td>20 %</td><td>Riesgos con verificación de normas en el normograma.</td><td>Riesgos sin verificación.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evcann_html$;
  v_t3 := $evcann_html$<h2>Caso de estudio</h2>
<p>CannaMed (ficticia) quiere lanzar en Colombia un medicamento con CBD para un tipo de epilepsia refractaria, fabricado con cannabis cultivado en el país, y luego exportar el extracto (datos simulados). Te encargan el plan regulatorio completo. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan regulatorio que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evcann_html$;
  v_t4 := 'Plan regulatorio completo con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evcann_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Ley 1787 de 2016; Decreto 780 de 2016, Título 2.8.11, sustituido por el Decreto 811 de 2021, y sus modificaciones vigentes (verificar en el normograma); Decreto 677 de 1995; Decreto 1156 de 2018; Convención Única de 1961 y decisión de la Comisión de Estupefacientes de 2020; alertas del Invima; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evcann_html$;
  v_t7 := NULL;
  v_j1 := $evcann_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Exportación.","Farmacovigilancia.","Riesgos y cambios normativos.","Indicadores y resumen."]$evcann_json$::jsonb;
  v_j2 := $evcann_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"exportacion","name":"Exportación","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Licencia, cupo o condición aplicable, proyecciones y permisos del destino."},{"level":3,"label":"Logrado","description":"Ruta incompleta."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"farmacovigilancia","name":"Farmacovigilancia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Interacciones CYP, transaminasas, notificación y plan de gestión del riesgo."},{"level":3,"label":"Logrado","description":"Farmacovigilancia general."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"riesgos","name":"Riesgos","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Riesgos con verificación de normas en el normograma."},{"level":3,"label":"Logrado","description":"Riesgos sin verificación."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evcann_json$::jsonb;
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


  -- ── Foro cann-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con cannabis medicinal';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evcann_html$<h2>Para empezar</h2>
<p>Piensa en un producto, una licencia o un paciente relacionado con cannabis medicinal y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evcann_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evcann_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evcann_html$;
  v_t6 := $evcann_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evcann_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has orientado a pacientes que usan productos con cannabis?', '¿Qué te parece más difícil: las licencias, el registro o la farmacovigilancia?']::text[];
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


  -- ── Foro cann-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Marco legal y gobernanza del cannabis medicinal en Colombia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Marco legal y gobernanza del cannabis medicinal en Colombia) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · Psicoactivo o no psicoactivo';
  v_t2 := 'Argumentar por qué el umbral de THC define la autoridad, el trámite y los controles.';
  v_t3 := $evcann_html$<h2>Caso del foro</h2>
<p>Un emprendedor ficticio quiere cultivar cannabis «para CBD» y vender aceites en tiendas y por redes sociales (datos simulados). Asume que «como es CBD, no necesita licencias» y ya compró semillas a un vendedor informal.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evcann_html$;
  v_t4 := '¿Qué le explicarías sobre licencias, autoridades y controles?';
  v_t5 := $evcann_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada explicación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evcann_html$;
  v_t6 := $evcann_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada explicación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evcann_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué define el umbral del 1 % de THC?', '¿Qué licencias necesita cultivar y fabricar?', '¿Qué autorización sanitaria necesita el producto terminado?']::text[];
  v_j1 := $evcann_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada explicación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evcann_json$::jsonb;
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


  -- ── Foro cann-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Licencias y cupos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Licencias y cupos) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Licencias que no se convierten en negocio';
  v_t2 := 'Argumentar por qué tener licencia no garantiza un producto en el mercado.';
  v_t3 := $evcann_html$<h2>Caso del foro</h2>
<p>Un emprendedor ficticio obtuvo licencias de cultivo y fabricación, pero dos años después no ha vendido nada (datos simulados). Pensaba que la licencia le permitía vender sus aceites.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evcann_html$;
  v_t4 := '¿Qué le faltó y qué le recomendarías?';
  v_t5 := $evcann_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada recomendación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evcann_html$;
  v_t6 := $evcann_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada recomendación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evcann_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué diferencia hay entre licencia y autorización sanitaria?', '¿Qué requiere un producto terminado para venderse?', '¿Qué demanda real existe para sus productos?']::text[];
  v_j1 := $evcann_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada recomendación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evcann_json$::jsonb;
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


  -- ── Foro cann-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Productos derivados: vías sanitarias ante el INVIMA' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Productos derivados: vías sanitarias ante el INVIMA) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Magistrales con cannabis';
  v_t2 := 'Argumentar los controles que necesitan las preparaciones magistrales con cannabis.';
  v_t3 := $evcann_html$<h2>Caso del foro</h2>
<p>Una farmacia ficticia quiere preparar aceites magistrales con cannabis para pacientes con fórmula médica (datos simulados). Compra el extracto a un proveedor que no muestra licencia y no tiene certificación de buenas prácticas de elaboración.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evcann_html$;
  v_t4 := '¿Qué riesgos ves y qué debería hacer la farmacia?';
  v_t5 := $evcann_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evcann_html$;
  v_t6 := $evcann_html$<h2>Normas de participación</h2>
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
</details>$evcann_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué exige la cadena de licencias para la materia prima?', '¿Qué certificación necesita la farmacia?', '¿Qué controles de calidad aplicarías?']::text[];
  v_j1 := $evcann_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evcann_json$::jsonb;
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


  -- ── Foro cann-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Exportación, vigilancia y farmacovigilancia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Exportación, vigilancia y farmacovigilancia) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Pacientes que se automedican con cannabis';
  v_t2 := 'Argumentar cómo orientar a pacientes que usan productos de cannabis sin control.';
  v_t3 := $evcann_html$<h2>Caso del foro</h2>
<p>Una paciente ficticia con cáncer de mama usa un aceite de cannabis comprado por internet y dice que «quiere dejar la quimioterapia» (datos simulados). Toma además tamoxifeno.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evcann_html$;
  v_t4 := '¿Cómo la orientarías y qué harías como profesional?';
  v_t5 := $evcann_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la fuente que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evcann_html$;
  v_t6 := $evcann_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la fuente que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evcann_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué riesgos tiene el producto sin autorización?', '¿Qué interacciones podrían existir?', '¿A quién involucrarías?']::text[];
  v_j1 := $evcann_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la fuente que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evcann_json$::jsonb;
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


  -- ── Foro cann-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Tendencias internacionales y casos integradores' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Tendencias internacionales y casos integradores) en Regulación Sanitaria del Cannabis Medicinal en Colombia: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · El futuro del cannabis medicinal colombiano';
  v_t2 := 'Argumentar qué cambios mejorarían la competitividad del cannabis medicinal colombiano.';
  v_t3 := $evcann_html$<h2>Caso del foro</h2>
<p>En un foro ficticio, una asociación de pequeños cultivadores afirma que «la regulación solo beneficia a las grandes empresas» y una empresa responde que «sin controles estrictos no hay exportación» (datos simulados).</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evcann_html$;
  v_t4 := '¿Qué cambios propondrías y con qué evidencia?';
  v_t5 := $evcann_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o el dato que sustenta tu propuesta. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evcann_html$;
  v_t6 := $evcann_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el dato que sustenta tu propuesta.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evcann_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué controles son indispensables para exportar?', '¿Qué barreras enfrentan los pequeños cultivadores?', '¿Cómo verificarías las reformas en curso?']::text[];
  v_j1 := $evcann_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o el dato que sustenta tu propuesta."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evcann_json$::jsonb;
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


  RAISE NOTICE 'Regulación Sanitaria del Cannabis Medicinal en Colombia: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evcann$;


-- ════════════════════════════════════════════════════════════════
--  Curso de Asuntos Regulatorios de Radiofármacos
--  5 quizzes · 5 actividades · 6 foros
-- ════════════════════════════════════════════════════════════════
DO $evradio$
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
   WHERE kind = 'edvanta' AND title = 'Curso de Asuntos Regulatorios de Radiofármacos' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso Curso de Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;

  -- Si alguien cambió las unidades en el panel, no se fuerza nada.
  IF (SELECT COUNT(DISTINCT title) FROM aula_modules
       WHERE course_id = v_curso AND deleted_at IS NULL
         AND title = ANY(ARRAY['Unidad 1. Fundamentos de radiofármacos y radiofarmacia', 'Unidad 2. Marco sanitario colombiano: BPER, certificación y registro', 'Unidad 3. Protección radiológica, autorizaciones y transporte', 'Unidad 4. Calidad de radiofármacos: BPM OMS/OIEA y control de calidad', 'Unidad 5. Teranósticos, suministro y casos integrales']::text[])) < 5 THEN
    RAISE NOTICE 'Asuntos Regulatorios de Radiofármacos: sus unidades no coinciden con el paquete; se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET passing_score = 70, max_attempts = 2, grade_policy = $evradio_json${"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}$evradio_json$::jsonb, updated_at = NOW()
   WHERE id = v_curso;


  -- ── Quiz radio-u1-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de radiofármacos y radiofarmacia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de radiofármacos y radiofarmacia) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 1 · Fundamentos de radiofármacos y radiofarmacia';
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


    v_t3 := 'Según la Resolución 560 de 2024, ¿qué es un generador?';
    v_t4 := 'La Resolución 560 de 2024 define el generador como el sistema con un radionúclido padre que produce un radionúclido hijo por elución u otro método (por ejemplo, 99Mo/99mTc o 68Ge/68Ga); el kit es el preparado que se reconstituye con radionúclidos y el precursor es el radionúclido producido para marcar otra sustancia.';
    v_j1 := $evradio_json${"external_id":"radio-u1-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Radiofármaco, radionúclido, kit frío, generador y precursor","outcome":"Radiofármaco, radionúclido, kit frío, generador y precursor","source":"Resolución 560 de 2024, art. 3."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u1-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Un sistema con un radionúclido padre que produce un hijo por elución u otro método.', TRUE, 'Correcto. Por ejemplo, 99Mo/99mTc.', 0),
      (v_pregunta, 'Un equipo de rayos X que se usa para tomar imágenes en el servicio de medicina nuclear.', FALSE, 'Es un equipo generador de radiación, no un generador de radionúclidos.', 1),
      (v_pregunta, 'Un preparado no radiactivo que se reconstituye con un radionúclido para marcarlo.', FALSE, 'Eso es un kit. Revisa la explicación.', 2),
      (v_pregunta, 'Un radionúclido producido para marcar radiactivamente otra sustancia en la radiofarmacia.', FALSE, 'Eso es un precursor.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Cuál de estos radionúclidos se usa típicamente en terapia y no solo en diagnóstico?';
    v_t4 := 'El 177Lu, emisor beta con vida media de unos 6,7 días, se usa en terapia (por ejemplo, 177Lu-PSMA); también el 131I. El 99mTc, el 18F y el 68Ga se usan sobre todo en diagnóstico (SPECT o PET).';
    v_j1 := $evradio_json${"external_id":"radio-u1-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Diagnóstico, terapia, PET y teranóstica","outcome":"Diagnóstico, terapia, PET y teranóstica","source":"OIEA, radiofármacos terapéuticos; literatura de medicina nuclear."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u1-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El tecnecio-99m, con vida media de unas seis horas, emisor gamma para imágenes SPECT.', FALSE, 'Se usa en diagnóstico.', 0),
      (v_pregunta, 'El flúor-18, con vida media de unos 110 minutos, emisor de positrones para PET.', FALSE, 'Se usa en diagnóstico PET.', 1),
      (v_pregunta, 'El galio-68, emisor de positrones obtenido de un generador para PET.', FALSE, 'Se usa en diagnóstico PET.', 2),
      (v_pregunta, 'El lutecio-177, emisor beta con vida media de unos 6,7 días.', TRUE, 'Correcto. Se usa en terapia, como 177Lu-PSMA.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Qué diferencia una radiofarmacia hospitalaria de una centralizada según la Resolución 560?';
    v_t4 := 'El artículo 4 define la radiofarmacia hospitalaria como la que depende de un servicio de medicina nuclear habilitado y la centralizada como la que funciona independientemente y abastece a uno o más servicios; la industrial produce para distribución comercial y requiere registro y BPM.';
    v_j1 := $evradio_json${"external_id":"radio-u1-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Tipos de radiofarmacia: hospitalaria, centralizada e industrial","outcome":"Tipos de radiofarmacia: hospitalaria, centralizada e industrial","source":"Resolución 560 de 2024, art. 4."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u1-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La hospitalaria produce radiofármacos para distribución comercial con registro sanitario.', FALSE, 'Eso describe la industrial.', 0),
      (v_pregunta, 'Depende de un servicio de medicina nuclear; la centralizada abastece a otros.', TRUE, 'Correcto. Art. 4. Lo sustenta la explicación.', 1),
      (v_pregunta, 'La centralizada solo recibe dosis listas para usar y no hace procesos especiales.', FALSE, 'Se considera que hace procesos especiales.', 2),
      (v_pregunta, 'No hay diferencia: ambas son radiofarmacias industriales sujetas a BPM.', FALSE, 'La industrial es otra categoría.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una IPS planea toda su logística de 18F-FDG como si fuera 99mTc, con entregas cada 24 horas. ¿Cuál es la mejor valoración?';
    v_t4 := 'La vida media del 18F (unos 110 minutos) condiciona la producción, el control y el transporte del 18F-FDG, que deben coordinarse en pocas horas; el 99mTc (unas seis horas) se obtiene de generadores. La logística debe diseñarse según el radionúclido.';
    v_j1 := $evradio_json${"external_id":"radio-u1-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Producción de radionúclidos: reactor, ciclotrón y generadores","outcome":"Producción de radionúclidos: reactor, ciclotrón y generadores","source":"OIEA-OMS, TRS 1025, anexo 2."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u1-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es adecuado, porque todos los radiofármacos tienen la misma vida útil.', FALSE, 'Las vidas medias difieren mucho.', 0),
      (v_pregunta, 'Es adecuado si las dosis se almacenan en un refrigerador blindado.', FALSE, 'El frío no detiene el decaimiento.', 1),
      (v_pregunta, 'Es inadecuado: el 18F dura unos 110 minutos y exige logística más rápida.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Es inadecuado solo porque el 18F-FDG no requiere ningún control de calidad.', FALSE, 'Sí requiere controles.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz radio-u2-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Marco sanitario colombiano: BPER, certificación y registro' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Marco sanitario colombiano: BPER, certificación y registro) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 2 · Marco sanitario colombiano: BPER, certificación y registro';
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


    v_t3 := '¿A quiénes excluye el artículo 2 de la Resolución 560 de 2024?';
    v_t4 := 'El artículo 2 aplica a las radiofarmacias hospitalarias y centralizadas y a las autoridades que las supervisan, y exceptúa a las radiofarmacias industriales, que deben cumplir requisitos de BPM que fijará el Ministerio.';
    v_j1 := $evradio_json${"external_id":"radio-u2-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Objeto, ámbito, definiciones y competencias de la Res. 560/2024","outcome":"Objeto, ámbito, definiciones y competencias de la Res. 560/2024","source":"Resolución 560 de 2024, art. 2."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u2-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'A las radiofarmacias hospitalarias, porque dependen de un servicio de medicina nuclear.', FALSE, 'Están incluidas. Revisa la explicación.', 0),
      (v_pregunta, 'A las radiofarmacias centralizadas, porque abastecen a otros servicios.', FALSE, 'Están incluidas. Revisa la explicación.', 1),
      (v_pregunta, 'A las radiofarmacias industriales, que deben cumplir BPM que fije el Ministerio.', TRUE, 'Correcto. Lo sustenta la explicación.', 2),
      (v_pregunta, 'A los servicios que hacen terapia con 131I, porque usan cápsulas orales.', FALSE, 'No es la exclusión. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Una radiofarmacia solo recibe dosis listas para usar de una centralizada certificada. ¿Necesita certificado BPER?';
    v_t4 := 'El artículo 5.1.1 define como proceso general la recepción y entrega de dosis listas, que deben provenir de una radiofarmacia certificada. Según el artículo 14, quienes solo realizan procesos generales no requieren el certificado, pero sí cumplir los requisitos sanitarios del anexo.';
    v_j1 := $evradio_json${"external_id":"radio-u2-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Procesos generales vs. procesos especiales: ¿quién necesita BPER?","outcome":"Procesos generales vs. procesos especiales: ¿quién necesita BPER?","source":"Resolución 560 de 2024, arts. 5 y 14."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u2-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'No, porque hace solo procesos generales; debe cumplir los requisitos sanitarios del anexo.', TRUE, 'Correcto. Arts. 5 y 14.', 0),
      (v_pregunta, 'Sí, porque toda radiofarmacia necesita certificado sin importar sus procesos.', FALSE, 'Los procesos generales no lo requieren.', 1),
      (v_pregunta, 'Sí, si la radiofarmacia queda en una ciudad distinta de la centralizada.', FALSE, 'La ubicación no cambia el requisito.', 2),
      (v_pregunta, 'No, y además no debe cumplir ningún requisito sanitario.', FALSE, 'Debe cumplir los requisitos sanitarios.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Desde cuándo deben contar con certificado BPER las radiofarmacias hospitalarias y centralizadas, y qué pasa si no lo tienen?';
    v_t4 := 'El artículo 16 dispone que, a partir del 1 de abril de 2025, las radiofarmacias hospitalarias y centralizadas deben contar con el certificado BPER; las que no lo tengan no pueden realizar actividades de radiofarmacia y se aplican medidas sanitarias.';
    v_j1 := $evradio_json${"external_id":"radio-u2-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Procedimiento de certificación, vigencia, renovación y ampliaciones (Decreto 335/2022)","outcome":"Procedimiento de certificación, vigencia, renovación y ampliaciones (Decreto 335/2022)","source":"Resolución 560 de 2024, art. 16."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u2-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Desde 2030, y sin certificado pueden seguir operando con una multa anual.', FALSE, 'No es la fecha ni la consecuencia.', 0),
      (v_pregunta, 'Desde el 1 de abril de 2025; sin certificado no pueden realizar actividades de radiofarmacia.', TRUE, 'Correcto. Art. 16. Lo sustenta la explicación.', 1),
      (v_pregunta, 'Desde que el Invima las visite, sin ninguna fecha límite fijada.', FALSE, 'Hay una fecha fijada.', 2),
      (v_pregunta, 'Nunca, porque el certificado BPER es voluntario.', FALSE, 'Es obligatorio para procesos especiales.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Una radiofarmacia marca kits sin registro sanitario con materias primas importadas «para ahorrar». ¿Cuál es la mejor valoración?';
    v_t4 := 'La radiomarcación de kits con registro y la elaboración a partir de materias primas son procesos especiales distintos (art. 5.2); este último exige el alcance correspondiente en el certificado BPER y el cumplimiento de las condiciones de preparación. Usar kits sin registro fuera de ese marco expone a medidas sanitarias.';
    v_j1 := $evradio_json${"external_id":"radio-u2-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Registro sanitario e importación de radiofármacos industriales","outcome":"Registro sanitario e importación de radiofármacos industriales","source":"Resolución 560 de 2024, arts. 5 y 6."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u2-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es aceptable si el resultado del control de calidad de cada preparación es conforme.', FALSE, 'El control no sustituye el marco aplicable.', 0),
      (v_pregunta, 'Es aceptable porque los kits no son medicamentos.', FALSE, 'Los kits son productos regulados.', 1),
      (v_pregunta, 'Es aceptable si el médico nuclear lo autoriza por escrito.', FALSE, 'La autorización médica no reemplaza la norma.', 2),
      (v_pregunta, 'Es un riesgo: se analiza si encaja como proceso especial certificado.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz radio-u3-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Protección radiológica, autorizaciones y transporte' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Protección radiológica, autorizaciones y transporte) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 3 · Protección radiológica, autorizaciones y transporte';
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


    v_t3 := 'Según el parágrafo 1 del artículo 15 de la Resolución 560, ¿quién es competente en protección y seguridad radiológica?';
    v_t4 := 'El parágrafo 1 del artículo 15 de la Resolución 560 de 2024 señala que la protección y seguridad radiológica es competencia del Servicio Geológico Colombiano; el Invima verifica los requisitos sanitarios.';
    v_j1 := $evradio_json${"external_id":"radio-u3-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: el marco radiológico (MinMinas, SGC y MinSalud)","outcome":"Introducción a la unidad: el marco radiológico (MinMinas, SGC y MinSalud)","source":"Resolución 560 de 2024, art. 15."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u3-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'El Invima, que también expide el certificado BPER.', FALSE, 'El Invima no tiene esa competencia.', 0),
      (v_pregunta, 'El Servicio Geológico Colombiano.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'Las secretarías de salud municipales.', FALSE, 'No es la autoridad indicada.', 2),
      (v_pregunta, 'El Fondo Nacional de Estupefacientes.', FALSE, 'No es su competencia.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := '¿Cuáles son los principios básicos de la protección radiológica ocupacional?';
    v_t4 := 'La protección radiológica ocupacional se basa en minimizar el tiempo de exposición, aumentar la distancia y usar blindaje, con optimización de las dosis (principio ALARA) y dosimetría personal.';
    v_j1 := $evradio_json${"external_id":"radio-u3-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Licencias y registros ante el SGC: Res. 90874/2014 y sus modificaciones","outcome":"Licencias y registros ante el SGC: Res. 90874/2014 y sus modificaciones","source":"OIEA, normas de seguridad; reglamentación nacional de protección radiológica."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u3-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Tiempo, distancia y blindaje, junto con la optimización de las dosis.', TRUE, 'Correcto. Lo sustenta la explicación.', 0),
      (v_pregunta, 'Velocidad, cantidad y precio del material radiactivo usado.', FALSE, 'No son principios de protección.', 1),
      (v_pregunta, 'Temperatura, humedad y luz en el área de trabajo.', FALSE, 'Son condiciones ambientales, no de protección.', 2),
      (v_pregunta, 'Publicidad, etiquetado y venta del radiofármaco.', FALSE, 'No son principios de protección.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Una radiofarmacia centralizada despacha dosis de 18F-FDG a tres clínicas. ¿Qué análisis es correcto?';
    v_t4 := 'El despacho de dosis exige bultos y etiquetado para material radiactivo, transporte conforme a la reglamentación de transporte seguro (basada en la norma SSR-6 del OIEA) y, desde el punto de vista sanitario, contratos de suministro de dosis unitarias para pacientes específicos (Res. 560 art. 13).';
    v_j1 := $evradio_json${"external_id":"radio-u3-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Transporte seguro de material radiactivo: Res. 40306/2024 y SSR-6","outcome":"Transporte seguro de material radiactivo: Res. 40306/2024 y SSR-6","source":"Resolución 560 de 2024, art. 13; OIEA SSR-6."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u3-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Basta con enviar las dosis en una caja de cartón con el nombre de la clínica.', FALSE, 'Se requieren bultos y etiquetado para material radiactivo.', 0),
      (v_pregunta, 'Puede enviarlas un mensajero sin formación, porque el trayecto es corto.', FALSE, 'Se requiere un transportador idóneo.', 1),
      (v_pregunta, 'Requiere bultos adecuados, etiquetado radiológico, transporte autorizado y contratos de suministro.', TRUE, 'Correcto. Art. 13. Lo sustenta la explicación.', 2),
      (v_pregunta, 'Solo requiere la factura comercial de las dosis.', FALSE, 'No basta. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un servicio cambia su equipo PET/CT y cree que la licencia del material radiactivo cubre también el tomógrafo. ¿Cuál es la mejor valoración?';
    v_t4 := 'El componente de tomografía (rayos X) de un PET/CT es un equipo generador de radiación con su propio régimen de licencia, distinto de la autorización para el material radiactivo. Se verifica la norma vigente aplicable a cada uno.';
    v_j1 := $evradio_json${"external_id":"radio-u3-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"De la Res. 482/2018 a la Res. 1811/2025: licencias de equipos generadores","outcome":"De la Res. 482/2018 a la Res. 1811/2025: licencias de equipos generadores","source":"Reglamentación nacional de equipos generadores de radiación y de material radiactivo."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u3-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es correcto, porque una sola licencia cubre todo el servicio de medicina nuclear.', FALSE, 'Son autorizaciones distintas.', 0),
      (v_pregunta, 'Es correcto si el equipo es de la misma marca que el anterior.', FALSE, 'La marca no cambia el requisito.', 1),
      (v_pregunta, 'Es correcto si el equipo se usa solo para pacientes oncológicos.', FALSE, 'El uso no cambia el requisito.', 2),
      (v_pregunta, 'Es incorrecto: el equipo de rayos X tiene un régimen de licencia distinto.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz radio-u4-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Calidad de radiofármacos: BPM OMS/OIEA y control de calidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Calidad de radiofármacos: BPM OMS/OIEA y control de calidad) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 4 · Calidad de radiofármacos: BPM OMS/OIEA y control de calidad';
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


    v_t3 := '¿Qué mide la pureza radioquímica de un radiofármaco?';
    v_t4 := 'La pureza radioquímica es la proporción de la radiactividad en la forma química deseada (por ejemplo, 99mTc unido al ligando frente a pertecnetato libre); se mide por TLC o HPLC. La radionuclídica se refiere a otros radionúclidos y la química a impurezas no radiactivas.';
    v_j1 := $evradio_json${"external_id":"radio-u4-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Pureza radionuclídica, radioquímica y química","outcome":"Pureza radionuclídica, radioquímica y química","source":"Farmacopeas; OIEA-OMS, TRS 1025, anexo 2."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u4-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La proporción de la radiactividad presente en la forma química deseada.', TRUE, 'Correcto. Se mide por TLC o HPLC.', 0),
      (v_pregunta, 'La proporción de radionúclidos distintos al deseado, como 99Mo en 99mTc.', FALSE, 'Eso es la pureza radionuclídica.', 1),
      (v_pregunta, 'El contenido de sustancias químicas no radiactivas, como aluminio.', FALSE, 'Eso es la pureza química.', 2),
      (v_pregunta, 'La esterilidad del producto terminado.', FALSE, 'Es un control microbiológico.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'En el eluido de un generador de 99Mo/99mTc, ¿qué control verifica la ruptura de molibdeno?';
    v_t4 := 'La ruptura de 99Mo se controla con la pureza radionuclídica, midiendo la actividad de 99Mo frente a la de 99mTc y comparándola con el límite de la farmacopea (del orden de 0,15 kBq de 99Mo por MBq de 99mTc al momento de la administración).';
    v_j1 := $evradio_json${"external_id":"radio-u4-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Pureza radionuclídica, radioquímica y química","outcome":"Pureza radionuclídica, radioquímica y química","source":"Farmacopeas (USP, Ph. Eur.)."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u4-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'La prueba de endotoxinas bacterianas del eluido, que se hace a cada lote del generador.', FALSE, 'Es un control microbiológico.', 0),
      (v_pregunta, 'La prueba de pH del eluido con una tira reactiva.', FALSE, 'No mide el 99Mo. Revisa la explicación.', 1),
      (v_pregunta, 'La inspección visual del color del eluido.', FALSE, 'No detecta el 99Mo. Revisa la explicación.', 2),
      (v_pregunta, 'La prueba de pureza radionuclídica, que mide el 99Mo frente a su límite.', TRUE, 'Correcto. Lo sustenta la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := '¿Por qué se permite la liberación de algunos radiofármacos antes de conocer el resultado de esterilidad?';
    v_t4 := 'En radiofármacos de vida media corta (como el 18F-FDG) la esterilidad se conoce después del uso; se permite la liberación anticipada con proceso aséptico validado (media fills), controles críticos previos (pureza radioquímica, pH, endotoxinas cuando aplica) y un procedimiento ante resultados posteriores no conformes.';
    v_j1 := $evradio_json${"external_id":"radio-u4-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Liberación anticipada y paramétrica en radiofármacos de vida media corta","outcome":"Liberación anticipada y paramétrica en radiofármacos de vida media corta","source":"OIEA-OMS, TRS 1025, anexo 2."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u4-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Porque los radiofármacos nunca se contaminan, al ser radiactivos.', FALSE, 'Pueden contaminarse.', 0),
      (v_pregunta, 'Por su vida media corta: se libera con proceso validado y controles críticos previos.', TRUE, 'Correcto. Con gestión de resultados posteriores.', 1),
      (v_pregunta, 'Porque la esterilidad no es un requisito para los inyectables radiactivos de vida media corta.', FALSE, 'Sí es un requisito. Revisa la explicación.', 2),
      (v_pregunta, 'Porque el médico nuclear asume toda la responsabilidad por escrito.', FALSE, 'Se basa en validación, no en una firma.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un lote de 18F-FDG muestra una pureza radioquímica inferior a la especificación, pero «hay pacientes esperando». ¿Cuál es la mejor valoración?';
    v_t4 := 'Un lote fuera de especificación no se libera: la impureza radioquímica afecta la calidad diagnóstica y la dosimetría. Se rechaza, se investiga la causa y se reprograma, según las BPM de radiofármacos.';
    v_j1 := $evradio_json${"external_id":"radio-u4-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Producción y control de 18F-FDG","outcome":"Producción y control de 18F-FDG","source":"OIEA-OMS, TRS 1025, anexo 2."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u4-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Liberarlo, porque la pureza radioquímica no afecta la calidad de las imágenes.', FALSE, 'Sí afecta la imagen y la dosis.', 0),
      (v_pregunta, 'Liberarlo con una dosis mayor para compensar la impureza.', FALSE, 'Aumenta la exposición sin resolver el problema.', 1),
      (v_pregunta, 'No liberarlo: un lote fuera de especificación se rechaza y se investiga la causa.', TRUE, 'Correcto. La urgencia no cambia la especificación.', 2),
      (v_pregunta, 'Liberarlo solo para pacientes mayores de 60 años.', FALSE, 'No hay criterio que lo justifique.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Quiz radio-u5-quiz ──────────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Teranósticos, suministro y casos integrales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Teranósticos, suministro y casos integrales) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Evaluación de la Unidad 5 · Teranósticos, suministro y casos integrales';
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


    v_t3 := '¿Qué es la teranóstica en medicina nuclear?';
    v_t4 := 'La teranóstica usa un mismo vector molecular marcado con un radionúclido de diagnóstico (por ejemplo, 68Ga-PSMA para PET) y otro de terapia (177Lu-PSMA), para seleccionar pacientes y tratarlos.';
    v_j1 := $evradio_json${"external_id":"radio-u5-q1","cognitive_level":"Comprender","difficulty":"baja","lesson_title":"Introducción a la unidad: la teranóstica y los nuevos retos regulatorios","outcome":"Introducción a la unidad: la teranóstica y los nuevos retos regulatorios","source":"OIEA; literatura de medicina nuclear."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u5-q1' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Usar un mismo vector molecular marcado para diagnóstico y para terapia, como 68Ga y 177Lu-PSMA.', TRUE, 'Correcto. Lo sustenta la explicación.', 0),
      (v_pregunta, 'Usar solo radiofármacos de diagnóstico para seguir la evolución del paciente.', FALSE, 'Incluye la terapia. Revisa la explicación.', 1),
      (v_pregunta, 'Usar equipos de rayos X para tratar tumores.', FALSE, 'Eso es radioterapia externa.', 2),
      (v_pregunta, 'Usar medicamentos de síntesis química junto con imágenes.', FALSE, 'No es la definición.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 0, 25);


    v_t3 := 'Según el artículo 13 de la Resolución 560, ¿cómo puede una radiofarmacia certificada suministrar dosis a otra?';
    v_t4 := 'El artículo 13 permite a las radiofarmacias certificadas suministrar dosis unitarias a radiofarmacias de procesos generales o certificadas, mediante contratos o convenios y para pacientes específicos; los viales multidosis solo si el servicio cuenta con un dispositivo de dispensación autoblindado con registro o autorización del Invima.';
    v_j1 := $evradio_json${"external_id":"radio-u5-q2","cognitive_level":"Aplicar","difficulty":"media","lesson_title":"Suministro entre radiofarmacias, contratos y farmacovigilancia","outcome":"Suministro entre radiofarmacias, contratos y farmacovigilancia","source":"Resolución 560 de 2024, art. 13."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u5-q2' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Mediante venta libre al público en farmacias comerciales.', FALSE, 'No es el mecanismo. Revisa la explicación.', 0),
      (v_pregunta, 'Sin ningún acuerdo, enviando dosis según la disponibilidad del día.', FALSE, 'Se requiere contrato o convenio.', 1),
      (v_pregunta, 'Mediante contratos o convenios, con dosis unitarias para pacientes específicos.', TRUE, 'Correcto. Los multidosis tienen condiciones.', 2),
      (v_pregunta, 'Solo si ambas radiofarmacias son del mismo dueño.', FALSE, 'No es el requisito. Revisa la explicación.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 1, 25);


    v_t3 := 'Un hospital quiere iniciar terapias con 177Lu-PSMA importado. ¿Qué análisis es correcto sobre su cadena regulatoria?';
    v_t4 := 'Un teranóstico importado exige registro sanitario o autorización de importación, licencias del material radiactivo ante el SGC, transporte seguro, gestión de desechos y protección del paciente y del personal; si la radiofarmacia hace procesos especiales, certificado BPER (Res. 560 arts. 5 y 6).';
    v_j1 := $evradio_json${"external_id":"radio-u5-q3","cognitive_level":"Analizar","difficulty":"media","lesson_title":"Caso: cadena regulatoria de un teranóstico de 177Lu importado","outcome":"Caso: cadena regulatoria de un teranóstico de 177Lu importado","source":"Resolución 560 de 2024; reglamentación radiológica."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u5-q3' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Solo necesita comprar el producto al proveedor extranjero y aplicarlo al paciente en el servicio.', FALSE, 'Hay varias autorizaciones.', 0),
      (v_pregunta, 'Registro o importación autorizada, licencias del SGC, transporte, desechos y BPER si aplica.', TRUE, 'Correcto. Lo sustenta la explicación.', 1),
      (v_pregunta, 'Solo requiere la licencia del tomógrafo del servicio.', FALSE, 'No basta. Revisa la explicación.', 2),
      (v_pregunta, 'Solo requiere el consentimiento del paciente.', FALSE, 'Es necesario pero no suficiente.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 2, 25);


    v_t3 := 'Un servicio suministra viales multidosis de 99mTc a otro servicio que no tiene dispositivo de dispensación autoblindado. ¿Cuál es la mejor valoración?';
    v_t4 := 'El parágrafo del artículo 13 permite suministrar viales multidosis inyectables solo si el servicio de medicina nuclear cuenta con un dispositivo de dispensación autoblindado con registro sanitario o autorización del Invima.';
    v_j1 := $evradio_json${"external_id":"radio-u5-q4","cognitive_level":"Evaluar","difficulty":"alta","lesson_title":"Producción local y soberanía sanitaria: BPM industriales de radiofármacos en Colombia","outcome":"Producción local y soberanía sanitaria: BPM industriales de radiofármacos en Colombia","source":"Resolución 560 de 2024, art. 13."}$evradio_json$::jsonb;
    SELECT id INTO v_pregunta FROM aula_questions
     WHERE bank_id = v_banco AND config->>'external_id' = 'radio-u5-q4' AND deleted_at IS NULL LIMIT 1;
    IF v_pregunta IS NULL THEN
      INSERT INTO aula_questions (bank_id, type, prompt_html, points, general_feedback, explanation, config)
      VALUES (v_banco, 'unica', v_t3, 25, v_t4, v_t4, v_j1)
      RETURNING id INTO v_pregunta;
    ELSE
      UPDATE aula_questions
         SET prompt_html = v_t3, points = 25, general_feedback = v_t4, explanation = v_t4, config = v_j1, updated_at = NOW()
       WHERE id = v_pregunta;
    END IF;
    DELETE FROM aula_question_options WHERE question_id = v_pregunta;
    INSERT INTO aula_question_options (question_id, text, is_correct, feedback, sort_order) VALUES
      (v_pregunta, 'Es aceptable si los viales se entregan el mismo día de la elución.', FALSE, 'El tiempo no cambia el requisito.', 0),
      (v_pregunta, 'Es aceptable si el servicio receptor tiene un químico farmacéutico.', FALSE, 'El profesional no reemplaza el dispositivo.', 1),
      (v_pregunta, 'Es aceptable porque los multidosis siempre pueden suministrarse.', FALSE, 'Tienen una condición específica.', 2),
      (v_pregunta, 'No cumple: los multidosis solo se suministran si hay un dispositivo autoblindado autorizado.', TRUE, 'Correcto. Art. 13, parágrafo.', 3);
    INSERT INTO aula_assessment_questions (assessment_id, question_id, sort_order, points_override)
    VALUES (v_eval, v_pregunta, 3, 25);

  END IF;


  -- ── Actividad radio-u1-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de radiofármacos y radiofarmacia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de radiofármacos y radiofarmacia) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 1 · Mapa de actores y autorizaciones de un servicio con radiofarmacia';
  v_t2 := $evradio_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> comprender, aplicar y analizar.</p>
<ol><li>Clasifica cada actividad como proceso general o especial (art. 5).</li><li>Indica si requiere certificado BPER (arts. 6 y 14).</li><li>Identifica qué productos requieren registro sanitario.</li><li>Identifica las autorizaciones radiológicas y su autoridad.</li><li>Construye un mapa de autorizaciones con vigencias y responsables.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Identificar las autoridades y autorizaciones.</li><li>Clasificar los procesos según la Resolución 560.</li><li>Construir el mapa de vigencias.</li></ul>
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
  <tr><td>Procesos y BPER</td><td>40 %</td><td>Clasifica la radiomarcación de kits como especial y la recepción de dosis como general.</td><td>Clasificación con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Registro y autoridades</td><td>30 %</td><td>Registro de kits y generadores; SGC para lo radiológico.</td><td>Autoridades confusas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Mapa</td><td>20 %</td><td>Mapa claro con vigencias (BPER 5 años) y responsables.</td><td>Mapa incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evradio_html$;
  v_t3 := $evradio_html$<h2>Caso de estudio</h2>
<p>Clínica del Sol (ficticia) tiene un servicio de medicina nuclear habilitado y quiere crear su radiofarmacia hospitalaria (datos simulados) para: marcar kits de 99mTc con un generador; recibir dosis de 18F-FDG listas para usar de una radiofarmacia centralizada certificada; e iniciar terapias con 177Lu-PSMA importado. La gerencia necesita saber qué autoridad autoriza cada actividad y con qué vigencia.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evradio_html$;
  v_t4 := 'Mapa de actores y autorizaciones.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evradio_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 560 de 2024 (BPER) y su anexo técnico; Decreto 335 de 2022; Decreto 677 de 1995; reglamentación de protección radiológica y transporte del sector minero-energético (Servicio Geológico Colombiano); OIEA-OMS, TRS 1025, anexo 2; farmacopeas; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evradio_html$;
  v_t7 := NULL;
  v_j1 := $evradio_json$["Procesos.","Certificado BPER.","Registro sanitario.","Autorizaciones radiológicas.","Mapa de vigencias."]$evradio_json$::jsonb;
  v_j2 := $evradio_json${"version":1,"total":100,"criteria":[{"id":"procesos-y-bper","name":"Procesos y BPER","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Clasifica la radiomarcación de kits como especial y la recepción de dosis como general."},{"level":3,"label":"Logrado","description":"Clasificación con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"registro-y-autoridades","name":"Registro y autoridades","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Registro de kits y generadores; SGC para lo radiológico."},{"level":3,"label":"Logrado","description":"Autoridades confusas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"mapa","name":"Mapa","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Mapa claro con vigencias (BPER 5 años) y responsables."},{"level":3,"label":"Logrado","description":"Mapa incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evradio_json$::jsonb;
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


  -- ── Actividad radio-u2-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Marco sanitario colombiano: BPER, certificación y registro' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Marco sanitario colombiano: BPER, certificación y registro) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 2 · Solicitud de certificación BPER de una radiofarmacia hospitalaria';
  v_t2 := $evradio_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y evaluar.</p>
<ol><li>Define el alcance (procesos especiales) que solicitarás.</li><li>Lista los requisitos de la solicitud según los arts. 7 y 8 y el Decreto 335 de 2022.</li><li>Identifica las brechas frente al anexo técnico y prioriza.</li><li>Propón un plan de cierre con responsables y fechas.</li><li>Describe la vigencia del certificado y cómo ampliar el alcance después.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Preparar la solicitud de certificación.</li><li>Identificar y priorizar brechas.</li><li>Definir el alcance del certificado.</li></ul>
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
  <tr><td>Alcance y requisitos</td><td>30 %</td><td>Alcance de procesos especiales y requisitos de los arts. 7 y 8.</td><td>Alcance impreciso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Brechas y plan</td><td>40 %</td><td>Prioriza la calificación de la celda, la formación del QF y la documentación.</td><td>Plan sin prioridades.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Vigencia</td><td>20 %</td><td>Cinco años (art. 9) y ampliación por el Decreto 335 (art. 11).</td><td>Vigencia imprecisa.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evradio_html$;
  v_t3 := $evradio_html$<h2>Caso de estudio</h2>
<p>Radiofarmacia del Norte (ficticia), hospitalaria, marca kits de 99mTc y quiere ampliar a radiomarcación celular (datos simulados). Debe solicitar el certificado BPER. Tiene: procedimientos desactualizados, un químico farmacéutico sin formación en radiofarmacia, una celda blindada sin calificación y registros de control de calidad incompletos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evradio_html$;
  v_t4 := 'Plan de solicitud de certificación BPER.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evradio_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 560 de 2024 (BPER) y su anexo técnico; Decreto 335 de 2022; Decreto 677 de 1995; reglamentación de protección radiológica y transporte del sector minero-energético (Servicio Geológico Colombiano); OIEA-OMS, TRS 1025, anexo 2; farmacopeas; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evradio_html$;
  v_t7 := NULL;
  v_j1 := $evradio_json$["Alcance.","Requisitos.","Brechas.","Plan de cierre.","Vigencia y ampliación."]$evradio_json$::jsonb;
  v_j2 := $evradio_json${"version":1,"total":100,"criteria":[{"id":"alcance-y-requisitos","name":"Alcance y requisitos","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Alcance de procesos especiales y requisitos de los arts. 7 y 8."},{"level":3,"label":"Logrado","description":"Alcance impreciso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"brechas-y-plan","name":"Brechas y plan","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Prioriza la calificación de la celda, la formación del QF y la documentación."},{"level":3,"label":"Logrado","description":"Plan sin prioridades."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"vigencia","name":"Vigencia","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cinco años (art. 9) y ampliación por el Decreto 335 (art. 11)."},{"level":3,"label":"Logrado","description":"Vigencia imprecisa."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evradio_json$::jsonb;
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


  -- ── Actividad radio-u4-act ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Calidad de radiofármacos: BPM OMS/OIEA y control de calidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Calidad de radiofármacos: BPM OMS/OIEA y control de calidad) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Actividad de la unidad 4 · Autoinspección de calidad y cierre de brechas';
  v_t2 := $evradio_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> analizar, evaluar y crear.</p>
<ol><li>Analiza el riesgo de cada hallazgo.</li><li>Prioriza los hallazgos.</li><li>Propón acciones correctivas y preventivas.</li><li>Define cómo demostrarías el cierre ante el Invima.</li><li>Diseña el procedimiento ante resultados de esterilidad no conformes.</li><li>Revisa con la rúbrica y sube tu informe en PDF o DOCX.</li></ol>

<h2>Para qué sirve esta actividad</h2>
<ul><li>Evaluar las brechas de calidad.</li><li>Priorizar según el riesgo para el paciente.</li><li>Diseñar el plan de cierre.</li></ul>
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
  <tr><td>Riesgo y prioridad</td><td>35 %</td><td>Prioriza media fills y el procedimiento de esterilidad por su impacto en la seguridad.</td><td>Prioridades poco justificadas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Acciones</td><td>35 %</td><td>Acciones concretas con evidencia (media fills, validación de métodos, registros).</td><td>Acciones generales.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Procedimiento</td><td>20 %</td><td>Procedimiento con notificación, evaluación de pacientes e investigación.</td><td>Procedimiento incompleto.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evradio_html$;
  v_t3 := $evradio_html$<h2>Caso de estudio</h2>
<p>Radiofarmacia Central Andina (ficticia), centralizada, produce 18F-FDG y marca kits de 99mTc (datos simulados). La autoinspección encuentra: media fills vencidos hace un año; control de pureza radioquímica del 99mTc con un método no validado; ausencia de procedimiento ante resultados de esterilidad posteriores no conformes; y registros de ruptura de 99Mo incompletos.</p>
<p><strong>Caso ficticio. Datos simulados.</strong></p>$evradio_html$;
  v_t4 := 'Plan de cierre de brechas de calidad.';
  v_t5 := '3 a 5 páginas (900 a 1.500 palabras), en PDF o DOCX';
  v_t6 := $evradio_html$<h2>Materiales, anexos y datos</h2>
<p>Toda la información necesaria está en el caso. No uses documentos internos de empresas reales ni datos de pacientes reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 560 de 2024 (BPER) y su anexo técnico; Decreto 335 de 2022; Decreto 677 de 1995; reglamentación de protección radiológica y transporte del sector minero-energético (Servicio Geológico Colombiano); OIEA-OMS, TRS 1025, anexo 2; farmacopeas; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evradio_html$;
  v_t7 := NULL;
  v_j1 := $evradio_json$["Análisis de riesgo.","Priorización.","Acciones.","Evidencia de cierre.","Procedimiento de esterilidad."]$evradio_json$::jsonb;
  v_j2 := $evradio_json${"version":1,"total":100,"criteria":[{"id":"riesgo-y-prioridad","name":"Riesgo y prioridad","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Prioriza media fills y el procedimiento de esterilidad por su impacto en la seguridad."},{"level":3,"label":"Logrado","description":"Prioridades poco justificadas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"acciones","name":"Acciones","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Acciones concretas con evidencia (media fills, validación de métodos, registros)."},{"level":3,"label":"Logrado","description":"Acciones generales."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"procedimiento","name":"Procedimiento","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Procedimiento con notificación, evaluación de pacientes e investigación."},{"level":3,"label":"Logrado","description":"Procedimiento incompleto."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evradio_json$::jsonb;
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


  -- ── Actividad radio-proyecto-1 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Protección radiológica, autorizaciones y transporte' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Protección radiológica, autorizaciones y transporte) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega 1: procesos, certificación y autorizaciones de la radiofarmacia';
  v_t2 := $evradio_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> aplicar, analizar y crear.</p>
<ol><li>Lee el caso y define los datos del servicio (ficticios).</li><li>Fase 1: clasifica los procesos (art. 5) y los productos.</li><li>Fase 2: define el alcance del certificado BPER, los requisitos y la vigencia (arts. 6 a 9 y 16).</li><li>Fase 2: identifica los registros sanitarios de kits, generadores y 177Lu.</li><li>Fase 3: mapea las autorizaciones del SGC, el transporte y la dosimetría.</li><li>Revisa con la rúbrica y sube la entrega en PDF o DOCX. El docente te devolverá observaciones para la entrega final.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Procesos, productos y actores.</li>
  <li><strong>Fase 2 · Unidad 2 (BPER y registro).</strong> Certificación y registros.</li>
  <li><strong>Fase 3 · Unidad 3 (protección radiológica).</strong> Autorizaciones y transporte.</li>
  <li><strong>Fase 4 · Unidad 4 (calidad).</strong> Control de calidad y liberación.</li>
  <li><strong>Fase 5 · Unidad 5 (teranósticos y suministro).</strong> Cadena del 177Lu y contratos.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Clasificar procesos y planear la certificación BPER.</li><li>Mapear las autorizaciones radiológicas.</li></ul>
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
  <tr><td>Procesos y BPER</td><td>35 %</td><td>Procesos bien clasificados, alcance BPER, vigencia de cinco años y fecha obligatoria.</td><td>Clasificación o alcance con errores.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Registros</td><td>25 %</td><td>Registro de kits, generadores y del 177Lu importado.</td><td>Registros incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Radiológico</td><td>30 %</td><td>Autorizaciones del SGC, transporte y dosimetría bien atribuidos.</td><td>Autoridades confusas.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evradio_html$;
  v_t3 := $evradio_html$<h2>Caso de estudio</h2>
<p>Medicina Nuclear del Valle (ficticia) es una IPS que quiere crear una radiofarmacia hospitalaria para marcar kits de 99mTc, recibir 18F-FDG de una centralizada e iniciar terapias con 177Lu-PSMA importado (datos simulados). Te encargan el plan regulatorio y de calidad completo. En esta entrega construyes las fases 1, 2 y 3.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evradio_html$;
  v_t4 := 'Documento de avance con las fases 1, 2 y 3.';
  v_t5 := '5 a 8 páginas más anexos, en PDF o DOCX';
  v_t6 := $evradio_html$<h2>Materiales, anexos y datos</h2>
<p>Los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 560 de 2024 (BPER) y su anexo técnico; Decreto 335 de 2022; Decreto 677 de 1995; reglamentación de protección radiológica y transporte del sector minero-energético (Servicio Geológico Colombiano); OIEA-OMS, TRS 1025, anexo 2; farmacopeas; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evradio_html$;
  v_t7 := NULL;
  v_j1 := $evradio_json$["Procesos.","Certificado BPER.","Registros sanitarios.","Autorizaciones radiológicas.","Transporte y dosimetría."]$evradio_json$::jsonb;
  v_j2 := $evradio_json${"version":1,"total":100,"criteria":[{"id":"procesos-y-bper","name":"Procesos y BPER","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Procesos bien clasificados, alcance BPER, vigencia de cinco años y fecha obligatoria."},{"level":3,"label":"Logrado","description":"Clasificación o alcance con errores."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"registros","name":"Registros","weight":25,"levels":[{"level":4,"label":"Destacado","description":"Registro de kits, generadores y del 177Lu importado."},{"level":3,"label":"Logrado","description":"Registros incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"radiologico","name":"Radiológico","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Autorizaciones del SGC, transporte y dosimetría bien atribuidos."},{"level":3,"label":"Logrado","description":"Autoridades confusas."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evradio_json$::jsonb;
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


  -- ── Actividad radio-proyecto-2 ─────────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Teranósticos, suministro y casos integrales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Teranósticos, suministro y casos integrales) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Proyecto integrador · Entrega final: calidad, teranóstico y suministro de la radiofarmacia';
  v_t2 := $evradio_html$<h2>Instrucciones paso a paso</h2>
<p><strong>Nivel de la taxonomía de Bloom:</strong> evaluar y crear.</p>
<ol><li>Relee la retroalimentación de la entrega 1 y corrige las fases 1 a 3; deja una tabla de cambios.</li><li>Fase 4: diseña el control de calidad (pureza radionuclídica, radioquímica, química, esterilidad, endotoxinas).</li><li>Fase 4: define los criterios de liberación y el procedimiento ante resultados posteriores.</li><li>Fase 5: diseña la cadena regulatoria del 177Lu-PSMA y la protección del paciente.</li><li>Fase 5: define los contratos de suministro con la centralizada (art. 13).</li><li>Escribe un resumen ejecutivo de una página.</li><li>Revisa con la rúbrica y sube el plan en PDF o DOCX.</li></ol>

<h2>El proyecto avanza con el curso</h2>
<ol>
  <li><strong>Fase 1 · Unidad 1 (fundamentos).</strong> Procesos, productos y actores.</li>
  <li><strong>Fase 2 · Unidad 2 (BPER y registro).</strong> Certificación y registros.</li>
  <li><strong>Fase 3 · Unidad 3 (protección radiológica).</strong> Autorizaciones y transporte.</li>
  <li><strong>Fase 4 · Unidad 4 (calidad).</strong> Control de calidad y liberación.</li>
  <li><strong>Fase 5 · Unidad 5 (teranósticos y suministro).</strong> Cadena del 177Lu y contratos.</li>
</ol>
<p>La entrega 1 reúne las fases 1 a 3. La entrega final integra todas las fases, corregidas con la retroalimentación recibida.</p>
<h2>Para qué sirve esta actividad</h2>
<ul><li>Diseñar el control de calidad y la liberación.</li><li>Planear la cadena del teranóstico y el suministro.</li></ul>
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
  <tr><td>Calidad y liberación</td><td>35 %</td><td>Controles completos y liberación anticipada validada.</td><td>Controles incompletos.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Teranóstico</td><td>20 %</td><td>Cadena completa del 177Lu con protección del paciente y desechos.</td><td>Cadena parcial.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Suministro</td><td>20 %</td><td>Contratos de dosis unitarias y condición para multidosis.</td><td>Suministro impreciso.</td><td>Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado.</td><td>Lo intenta, pero con errores importantes o sin relación con el caso.</td><td>No hay evidencia de este criterio en la entrega.</td></tr>
  <tr><td>Comunicación y fuentes</td><td>10 %</td><td>Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica.</td><td>Entrega clara, con errores menores de cita.</td><td>Entrega comprensible, con citas incompletas o imprecisas.</td><td>Entrega difícil de seguir o sin citas.</td><td>No hay fuentes.</td></tr>
  </tbody>
</table>
</details>$evradio_html$;
  v_t3 := $evradio_html$<h2>Caso de estudio</h2>
<p>Medicina Nuclear del Valle (ficticia) es una IPS que quiere crear una radiofarmacia hospitalaria para marcar kits de 99mTc, recibir 18F-FDG de una centralizada e iniciar terapias con 177Lu-PSMA importado (datos simulados). Te encargan el plan regulatorio y de calidad completo. En esta entrega terminas las fases 4 y 5 e integras todo el proyecto en el plan que presentarás para aprobación interna.</p>
<p><strong>Caso ficticio. Datos simulados. Proyecto que se desarrolla a lo largo del curso.</strong></p>$evradio_html$;
  v_t4 := 'Plan regulatorio y de calidad con resumen ejecutivo.';
  v_t5 := '10 a 15 páginas más anexos, en PDF o DOCX';
  v_t6 := $evradio_html$<h2>Materiales, anexos y datos</h2>
<p>Tu entrega anterior con la retroalimentación del docente y los datos simulados del caso. No uses documentos internos de instituciones reales.</p>
<h2>Fuentes de apoyo y citación</h2>
<p>Resolución 560 de 2024 (BPER) y su anexo técnico; Decreto 335 de 2022; Decreto 677 de 1995; reglamentación de protección radiológica y transporte del sector minero-energético (Servicio Geológico Colombiano); OIEA-OMS, TRS 1025, anexo 2; farmacopeas; normograma del Invima. Cita en APA 7 o en el formato «norma, artículo».</p>$evradio_html$;
  v_t7 := NULL;
  v_j1 := $evradio_json$["Fases 1 a 3 corregidas, con tabla de cambios.","Control de calidad.","Liberación.","Cadena del teranóstico.","Suministro y resumen."]$evradio_json$::jsonb;
  v_j2 := $evradio_json${"version":1,"total":100,"criteria":[{"id":"integracion-y-mejora","name":"Integración y mejora","weight":15,"levels":[{"level":4,"label":"Destacado","description":"Integra las cinco fases y documenta cada corrección."},{"level":3,"label":"Logrado","description":"Integra y corrige lo principal."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"calidad-y-liberacion","name":"Calidad y liberación","weight":35,"levels":[{"level":4,"label":"Destacado","description":"Controles completos y liberación anticipada validada."},{"level":3,"label":"Logrado","description":"Controles incompletos."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"teranostico","name":"Teranóstico","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Cadena completa del 177Lu con protección del paciente y desechos."},{"level":3,"label":"Logrado","description":"Cadena parcial."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"suministro","name":"Suministro","weight":20,"levels":[{"level":4,"label":"Destacado","description":"Contratos de dosis unitarias y condición para multidosis."},{"level":3,"label":"Logrado","description":"Suministro impreciso."},{"level":2,"label":"En desarrollo","description":"Cumple el criterio de forma parcial o general, con errores u omisiones que no invalidan el resultado."},{"level":1,"label":"Inicial","description":"Lo intenta, pero con errores importantes o sin relación con el caso."},{"level":0,"label":"Sin evidencia","description":"No hay evidencia de este criterio en la entrega."}]},{"id":"comunicacion-y-fuentes","name":"Comunicación y fuentes","weight":10,"levels":[{"level":4,"label":"Destacado","description":"Entrega ordenada y profesional, con citas verificables (norma y artículo o numeral, o guía y sección) y declaración del uso de IA cuando aplica."},{"level":3,"label":"Logrado","description":"Entrega clara, con errores menores de cita."},{"level":2,"label":"En desarrollo","description":"Entrega comprensible, con citas incompletas o imprecisas."},{"level":1,"label":"Inicial","description":"Entrega difícil de seguir o sin citas."},{"level":0,"label":"Sin evidencia","description":"No hay fuentes."}]}]}$evradio_json$::jsonb;
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


  -- ── Foro radio-foro-bienvenida (bienvenida) ──────────────────────────────
  v_t1 := 'Foro de bienvenida · Preséntate y cuéntanos tu experiencia con radiofármacos';
  v_t2 := 'Conocernos, activar lo que ya sabes y conectar tu experiencia con lo que vas a aprender.';
  v_t3 := $evradio_html$<h2>Para empezar</h2>
<p>Piensa en un radiofármaco o un servicio de medicina nuclear que hayas conocido y cuéntanos en tres o cuatro líneas qué te llamó la atención, sin nombres de empresas ni datos internos.</p>
<p><strong>Foro formativo: no se califica.</strong> Nivel de la taxonomía de Bloom: recordar y comprender.</p>$evradio_html$;
  v_t4 := '¿Desde dónde llegas a este curso y qué te gustaría dominar al terminarlo?';
  v_t5 := $evradio_html$<h2>Qué debes publicar</h2>
<p>Preséntate con tu nombre, tu rol y el tipo de organización donde trabajas o estudias; responde la pregunta central y escribe una expectativa concreta para el curso. Después saluda a un compañero y comenta algo de su experiencia.</p>
<ul><li>Extensión: 80–150 palabras la presentación; 30–80 palabras la respuesta.</li><li>Respuestas: Al menos una respuesta a un compañero.</li><li>Sin peso en la nota del curso.</li></ul>$evradio_html$;
  v_t6 := $evradio_html$<h2>Normas de participación</h2>
<p>Es un espacio de bienvenida: no se califica. No compartas datos de pacientes ni información interna de tu empresa. Las consultas sobre casos reales concretos no se resuelven en el foro.</p>
<h2>Criterios de valoración</h2>
<p>Foro formativo, sin nota. Se espera una presentación, la respuesta a la pregunta central y una expectativa.</p>
$evradio_html$;
  v_t7 := 'Si aún no hay compañeros: si aún no hay compañeros, publica tu presentación y vuelve en unos días; el docente responde a cada presentación.';
  v_a1 := ARRAY['¿Has trabajado en una radiofarmacia o en medicina nuclear?', '¿Qué te parece más difícil: la protección radiológica, la calidad o la norma?']::text[];
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


  -- ── Foro radio-u1-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 1. Fundamentos de radiofármacos y radiofarmacia' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 1 (Unidad 1. Fundamentos de radiofármacos y radiofarmacia) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 1 · La doble naturaleza del radiofármaco';
  v_t2 := 'Argumentar por qué un radiofármaco está sujeto a regulación sanitaria y radiológica al mismo tiempo.';
  v_t3 := $evradio_html$<h2>Caso del foro</h2>
<p>El gerente ficticio de una IPS cree que «con la licencia del material radiactivo ya está todo» para abrir una radiofarmacia (datos simulados). No ha considerado la certificación sanitaria ni el registro de los kits.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evradio_html$;
  v_t4 := '¿Qué le explicarías sobre las autoridades y autorizaciones?';
  v_t5 := $evradio_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada explicación. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evradio_html$;
  v_t6 := $evradio_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada explicación.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evradio_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué regula el Invima y qué el Servicio Geológico Colombiano?', '¿Qué procesos exigen certificado BPER?', '¿Qué productos requieren registro sanitario?']::text[];
  v_j1 := $evradio_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada explicación."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evradio_json$::jsonb;
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


  -- ── Foro radio-u2-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 2. Marco sanitario colombiano: BPER, certificación y registro' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 2 (Unidad 2. Marco sanitario colombiano: BPER, certificación y registro) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 2 · Prepararse para la visita BPER';
  v_t2 := 'Argumentar cómo organizar la certificación BPER de una radiofarmacia.';
  v_t3 := $evradio_html$<h2>Caso del foro</h2>
<p>Una radiofarmacia hospitalaria ficticia no solicitó el certificado BPER a tiempo y ahora corre el riesgo de suspender servicios (datos simulados). El equipo médico pregunta qué pasará con los pacientes programados.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evradio_html$;
  v_t4 := '¿Qué harías de inmediato y cómo evitarías que se repita?';
  v_t5 := $evradio_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evradio_html$;
  v_t6 := $evradio_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada acción.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evradio_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dice el artículo 16 sobre las consecuencias?', '¿Qué alternativa de suministro existe (art. 13)?', '¿Cómo se prepara la solicitud y la visita?']::text[];
  v_j1 := $evradio_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evradio_json$::jsonb;
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


  -- ── Foro radio-u3-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 3. Protección radiológica, autorizaciones y transporte' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 3 (Unidad 3. Protección radiológica, autorizaciones y transporte) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 3 · Cultura de seguridad radiológica';
  v_t2 := 'Argumentar cómo construir una cultura de seguridad radiológica en la radiofarmacia.';
  v_t3 := $evradio_html$<h2>Caso del foro</h2>
<p>En una radiofarmacia ficticia, los dosímetros personales de dos operarios muestran dosis crecientes (datos simulados). Ellos dicen que «a veces no usan el blindaje porque es incómodo».</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evradio_html$;
  v_t4 := '¿Qué harías como responsable y cómo cambiarías las prácticas?';
  v_t5 := $evradio_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la norma o la guía que sustenta cada acción. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evradio_html$;
  v_t6 := $evradio_html$<h2>Normas de participación</h2>
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
</details>$evradio_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dicen los principios de tiempo, distancia y blindaje?', '¿Qué papel tiene la dosimetría personal?', '¿A qué autoridad se reporta?']::text[];
  v_j1 := $evradio_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la norma o la guía que sustenta cada acción."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evradio_json$::jsonb;
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


  -- ── Foro radio-u4-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 4. Calidad de radiofármacos: BPM OMS/OIEA y control de calidad' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 4 (Unidad 4. Calidad de radiofármacos: BPM OMS/OIEA y control de calidad) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 4 · Calidad contra el reloj';
  v_t2 := 'Argumentar cómo asegurar la calidad cuando el producto decae en minutos.';
  v_t3 := $evradio_html$<h2>Caso del foro</h2>
<p>Una radiofarmacia ficticia de 18F-FDG tiene presión de tres clínicas para despachar antes de las siete de la mañana y propone reducir los controles previos a la liberación (datos simulados). Dos lotes del último mes salieron tarde por repetir la prueba de pureza radioquímica.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evradio_html$;
  v_t4 := '¿Qué controles no negociarías y cómo ganarías tiempo sin perder calidad?';
  v_t5 := $evradio_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y la guía que sustenta cada control. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evradio_html$;
  v_t6 := $evradio_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía que sustenta cada control.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evradio_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué controles son críticos antes de liberar?', '¿Qué permite la liberación anticipada?', '¿Cómo se gestionan los resultados posteriores?']::text[];
  v_j1 := $evradio_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone la guía que sustenta cada control."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evradio_json$::jsonb;
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


  -- ── Foro radio-u5-foro ──────────────────────────────
  SELECT id INTO v_unidad FROM aula_modules
   WHERE course_id = v_curso AND title = 'Unidad 5. Teranósticos, suministro y casos integrales' AND deleted_at IS NULL
   LIMIT 1;
  IF v_unidad IS NULL THEN
    RAISE NOTICE 'No existe la unidad 5 (Unidad 5. Teranósticos, suministro y casos integrales) en Asuntos Regulatorios de Radiofármacos: se salta.';
    RETURN;
  END IF;
  v_t1 := 'Foro de interacción 5 · Soberanía en radiofármacos';
  v_t2 := 'Argumentar qué se necesita para producir radiofármacos industriales en Colombia.';
  v_t3 := $evradio_html$<h2>Caso del foro</h2>
<p>Un grupo ficticio de inversionistas quiere montar una radiofarmacia industrial para producir 177Lu-PSMA en Colombia (datos simulados). Preguntan si la Resolución 560 les aplica.</p>
<p><strong>Caso ficticio. Datos simulados.</strong> Nivel de la taxonomía de Bloom: analizar y evaluar.</p>$evradio_html$;
  v_t4 := '¿Qué les responderías y qué marco necesitarían?';
  v_t5 := $evradio_html$<h2>Qué debes publicar</h2>
<p>Publica una intervención inicial con tu postura, al menos un argumento técnico o normativo con su fuente y el artículo o la guía que sustenta cada argumento. Después responde a dos compañeros: compara, pregunta o aporta una evidencia que su intervención no tenía.</p>
<ul><li>Extensión: 150–250 palabras la intervención inicial; 60–120 palabras cada respuesta.</li><li>Respuestas: Dos respuestas a compañeros con comparación, pregunta o evidencia nueva.</li><li>Peso en el curso: 2 %.</li></ul>$evradio_html$;
  v_t6 := $evradio_html$<h2>Normas de participación</h2>
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
  <tr><td>Razonamiento con evidencia</td><td>40 %</td><td>Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo o la guía que sustenta cada argumento.</td><td>Cita una fuente pertinente y da una razón técnica correcta.</td><td>Argumenta con opiniones o con citas imprecisas.</td><td>Afirma sin justificar o cita una fuente que no corresponde.</td><td>No hay argumento.</td></tr>
  <tr><td>Interacción sustantiva</td><td>30 %</td><td>Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión.</td><td>Dos respuestas pertinentes.</td><td>Una respuesta pertinente o dos superficiales.</td><td>Respuestas de acuerdo o desacuerdo sin contenido.</td><td>No responde a compañeros ni usa la alternativa.</td></tr>
  </tbody>
</table>
</details>$evradio_html$;
  v_t7 := 'Si el grupo tiene menos de tres participantes: publica tu intervención inicial y, en lugar de responder a compañeros, responde por escrito a dos de las preguntas de profundización, con una evidencia distinta para cada una. Se valora con la misma rúbrica.';
  v_a1 := ARRAY['¿Qué dice el artículo 2 sobre las radiofarmacias industriales?', '¿Qué requiere una radiofarmacia industrial según el artículo 4?', '¿Qué referentes internacionales usarías mientras tanto?']::text[];
  v_j1 := $evradio_json${"version":1,"total":100,"criteria":[{"id":"pertinencia","name":"Pertinencia","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Responde la pregunta central y usa los datos concretos del caso."},{"level":3,"label":"Logrado","description":"Responde la pregunta central y menciona el caso."},{"level":2,"label":"En desarrollo","description":"Responde de forma general, con poca relación con el caso."},{"level":1,"label":"Inicial","description":"Se aleja de la pregunta central."},{"level":0,"label":"Sin evidencia","description":"No hay intervención o no responde."}]},{"id":"razonamiento-con-evidencia","name":"Razonamiento con evidencia","weight":40,"levels":[{"level":4,"label":"Destacado","description":"Argumenta con una fuente precisa (norma, guía o dato verificable) y propone el artículo o la guía que sustenta cada argumento."},{"level":3,"label":"Logrado","description":"Cita una fuente pertinente y da una razón técnica correcta."},{"level":2,"label":"En desarrollo","description":"Argumenta con opiniones o con citas imprecisas."},{"level":1,"label":"Inicial","description":"Afirma sin justificar o cita una fuente que no corresponde."},{"level":0,"label":"Sin evidencia","description":"No hay argumento."}]},{"id":"interaccion-sustantiva","name":"Interacción sustantiva","weight":30,"levels":[{"level":4,"label":"Destacado","description":"Dos respuestas que comparan, preguntan o aportan evidencia nueva y hacen avanzar la discusión."},{"level":3,"label":"Logrado","description":"Dos respuestas pertinentes."},{"level":2,"label":"En desarrollo","description":"Una respuesta pertinente o dos superficiales."},{"level":1,"label":"Inicial","description":"Respuestas de acuerdo o desacuerdo sin contenido."},{"level":0,"label":"Sin evidencia","description":"No responde a compañeros ni usa la alternativa."}]}]}$evradio_json$::jsonb;
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


  RAISE NOTICE 'Asuntos Regulatorios de Radiofármacos: % quizzes, % actividades, % foros.',
    (SELECT COUNT(*) FROM aula_assessments WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_activities WHERE course_id = v_curso AND deleted_at IS NULL),
    (SELECT COUNT(*) FROM aula_forums WHERE course_id = v_curso AND deleted_at IS NULL);
END
$evradio$;

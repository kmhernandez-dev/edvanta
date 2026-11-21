-- ============================================================
--  190_quiz_gestion_calidad_iso_2026.sql — Curso de Gestión de Calidad
--  Farmacéutica: el quiz de la unidad 3 pasa a ISO 9001:2026.
--
--  188 llevó la unidad 3 a «… ICH Q10 e ISO 9001:2026», pero el quiz de
--  esa unidad (sembrado en 081) seguía titulado «… ISO 9001:2015». Aquí
--  se renombran el quiz y su banco de preguntas. Las evaluaciones se leen
--  directo de sus tablas (no van en la versión publicada del curso), así
--  que el cambio se ve en el aula sin publicar una versión nueva.
--
--  Solo cambia el título: las preguntas, los intentos y las notas
--  quedan igual. Idempotente.
-- ============================================================

DO $quiz$
DECLARE
  v_curso BIGINT;
  v_viejo CONSTANT TEXT := 'Evaluación de la Unidad 3 · Modelos de sistema de gestión de calidad: ICH Q10 e ISO 9001:2015';
  v_nuevo CONSTANT TEXT := 'Evaluación de la Unidad 3 · Modelos de sistema de gestión de calidad: ICH Q10 e ISO 9001:2026';
  v_q     INTEGER;
  v_b     INTEGER;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = $t$Curso de Gestión de Calidad Farmacéutica$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Quiz ISO 9001:2026: no existe el curso de gestión de calidad. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_assessments
     SET title = v_nuevo, updated_at = NOW()
   WHERE course_id = v_curso AND deleted_at IS NULL AND title = v_viejo;
  GET DIAGNOSTICS v_q = ROW_COUNT;

  UPDATE aula_question_banks
     SET name = v_nuevo, updated_at = NOW()
   WHERE course_id = v_curso AND deleted_at IS NULL AND name = v_viejo;
  GET DIAGNOSTICS v_b = ROW_COUNT;

  RAISE NOTICE 'Quiz ISO 9001:2026 en gestión de calidad: % quiz y % banco renombrados.', v_q, v_b;
END $quiz$;

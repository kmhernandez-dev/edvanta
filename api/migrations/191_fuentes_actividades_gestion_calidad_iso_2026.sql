-- ============================================================
--  191_fuentes_actividades_gestion_calidad_iso_2026.sql — Curso de
--  Gestión de Calidad Farmacéutica: las fuentes de las actividades
--  pasan a ISO 9000:2026 e ISO 9001:2026.
--
--  188 llevó el curso a las ediciones 2026 (ISO 9000:2026, mayo de 2026;
--  ISO 9001:2026, 16 de septiembre de 2026), pero las 5 actividades
--  sembradas en 081 (las de las unidades y las entregas del proyecto)
--  seguían citando «ISO 9000:2015 e ISO 9001:2015» en «Fuentes de apoyo
--  y citación». Aquí solo se cambia esa cita, sin números de cláusula.
--  Las actividades se leen directo de su tabla (no van en la versión
--  publicada del curso), así que el cambio se ve sin publicar versión.
--
--  No toca las entregas, rúbricas ni pesos. Idempotente.
-- ============================================================

DO $fuentes$
DECLARE
  v_curso BIGINT;
  v_n     INTEGER;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = $t$Curso de Gestión de Calidad Farmacéutica$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Fuentes ISO 2026: no existe el curso de gestión de calidad. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_activities
     SET support_html = replace(support_html, 'ISO 9000:2015 e ISO 9001:2015', 'ISO 9000:2026 e ISO 9001:2026'),
         updated_at = NOW()
   WHERE course_id = v_curso AND deleted_at IS NULL
     AND support_html LIKE '%ISO 9000:2015 e ISO 9001:2015%';
  GET DIAGNOSTICS v_n = ROW_COUNT;

  RAISE NOTICE 'Fuentes ISO 2026 en gestión de calidad: % actividades actualizadas.', v_n;
END $fuentes$;

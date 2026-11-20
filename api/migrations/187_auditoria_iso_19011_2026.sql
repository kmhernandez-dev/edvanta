-- ============================================================
--  187_auditoria_iso_19011_2026.sql — Curso de Auditoría de Calidad
--  Farmacéutica: de ISO 19011:2018 a ISO 19011:2026.
--
--  ISO publicó en mayo de 2026 la 4.ª edición de ISO 19011 y retiró la
--  de 2018 (verificado en https://www.iso.org/standard/19011 el
--  19-nov-2026). La siembra del curso (042) citaba la de 2018 en la
--  descripción, en los subtítulos de dos clases y en dos enlaces.
--  Las clases escritas a mano (185) ya enseñan la edición 2026.
--
--  Idempotente: solo cambia lo que todavía dice 2018. Si hubo cambios y
--  el curso está publicado, aprueba una versión nueva.
-- ============================================================

DO $iso$
DECLARE
  v_curso BIGINT;
  v_n     INTEGER := 0;
  v_k     INTEGER;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = $t$Curso de Auditoría de Calidad Farmacéutica$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'ISO 19011:2026: no existe el curso de auditoría. Se salta.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET short_description = replace(short_description, 'ISO 19011:2018', 'ISO 19011:2026'),
         objective        = replace(objective, 'ISO 19011:2018', 'ISO 19011:2026'),
         description_html = replace(description_html, 'ISO 19011:2018', 'ISO 19011:2026'),
         updated_at = NOW()
   WHERE id = v_curso
     AND (short_description LIKE '%ISO 19011:2018%' OR objective LIKE '%ISO 19011:2018%' OR description_html LIKE '%ISO 19011:2018%');
  GET DIAGNOSTICS v_k = ROW_COUNT; v_n := v_n + v_k;

  UPDATE aula_lessons
     SET subtitle = replace(subtitle, 'ISO 19011:2018', 'ISO 19011:2026'), updated_at = NOW()
   WHERE course_id = v_curso AND deleted_at IS NULL AND subtitle LIKE '%ISO 19011:2018%';
  GET DIAGNOSTICS v_k = ROW_COUNT; v_n := v_n + v_k;

  UPDATE aula_lesson_blocks b
     SET data = b.data
               || jsonb_build_object(
                    'url', 'https://www.iso.org/standard/19011',
                    'title', '[Página web] ISO 19011:2026 – Directrices para la auditoría de sistemas de gestión',
                    'description', 'ISO (4.ª edición, mayo de 2026)'),
         updated_at = NOW()
    FROM aula_lessons l
   WHERE b.lesson_id = l.id AND l.course_id = v_curso AND l.deleted_at IS NULL
     AND b.type = 'enlace' AND b.deleted_at IS NULL
     AND b.data->>'url' IN ('https://committee.iso.org/standard/70017.html', 'https://www.iso.org/standard/70017.html');
  GET DIAGNOSTICS v_k = ROW_COUNT; v_n := v_n + v_k;

  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Actualización a ISO 19011:2026 (187_auditoria_iso_19011_2026.sql).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;

  RAISE NOTICE 'ISO 19011:2026 en el curso de auditoría: % cambios.', v_n;
END $iso$;

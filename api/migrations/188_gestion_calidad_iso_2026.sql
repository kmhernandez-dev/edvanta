-- ============================================================
--  188_gestion_calidad_iso_2026.sql — Curso de Gestión de Calidad
--  Farmacéutica: de ISO 9001:2015 e ISO 9000:2015 a sus ediciones 2026.
--
--  ISO publicó ISO 9000:2026 (5.ª edición, mayo de 2026) e ISO 9001:2026
--  (6.ª edición, 16 de septiembre de 2026) y retiró las de 2015
--  (verificado en https://www.iso.org/standard/9001 y /9000 el
--  19-nov-2026). La siembra (042) y las clases escritas a mano (181)
--  citaban las de 2015. Aquí se corrige lo que no está en la experiencia
--  de cada clase:
--
--    · descripción y objetivo del curso;
--    · título de la unidad 3 y subtítulos de clases;
--    · dos títulos de clase que llevaban la edición (el slug no cambia:
--      se asigna una sola vez, así que la dirección pública se conserva);
--    · los enlaces a las vistas previas de las normas de 2015, que pasan
--      a las páginas oficiales de las ediciones 2026;
--    · los títulos de los videos de Edutin sobre ISO 9001, que aclaran
--      que explican la edición 2015.
--
--  Las experiencias se actualizan después, en 189 (que ya usa los
--  títulos nuevos). Idempotente. Si hubo cambios y el curso está
--  publicado, aprueba una versión nueva.
-- ============================================================

DO $iso$
DECLARE
  v_curso BIGINT;
  v_n     INTEGER := 0;
  v_k     INTEGER;
  r       RECORD;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = $t$Curso de Gestión de Calidad Farmacéutica$t$ AND deleted_at IS NULL
   ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'ISO 9001:2026: no existe el curso de gestión de calidad. Se salta.';
    RETURN;
  END IF;

  -- Curso
  UPDATE aula_courses
     SET short_description = replace(short_description, 'ISO 9001:2015', 'ISO 9001:2026'),
         objective        = replace(objective, 'ISO 9001:2015', 'ISO 9001:2026'),
         description_html = replace(description_html, 'ISO 9001:2015', 'ISO 9001:2026'),
         updated_at = NOW()
   WHERE id = v_curso
     AND (short_description LIKE '%ISO 9001:2015%' OR objective LIKE '%ISO 9001:2015%' OR description_html LIKE '%ISO 9001:2015%');
  GET DIAGNOSTICS v_k = ROW_COUNT; v_n := v_n + v_k;

  -- Unidades
  UPDATE aula_modules
     SET title = replace(title, 'ISO 9001:2015', 'ISO 9001:2026'), updated_at = NOW()
   WHERE course_id = v_curso AND deleted_at IS NULL AND title LIKE '%ISO 9001:2015%';
  GET DIAGNOSTICS v_k = ROW_COUNT; v_n := v_n + v_k;

  -- Títulos de clase
  FOR r IN SELECT * FROM (VALUES
      ($a$Los siete principios de la gestión de la calidad (ISO 9000:2015)$a$, $b$Los siete principios de la gestión de la calidad (ISO 9000:2026)$b$),
      ($a$Estructura de alto nivel de ISO 9001:2015, contexto y partes interesadas$a$, $b$Estructura armonizada de ISO 9001:2026, contexto y partes interesadas$b$)
    ) AS t(viejo, nuevo)
  LOOP
    UPDATE aula_lessons SET title = r.nuevo, updated_at = NOW()
     WHERE course_id = v_curso AND deleted_at IS NULL AND title = r.viejo;
    GET DIAGNOSTICS v_k = ROW_COUNT; v_n := v_n + v_k;
  END LOOP;

  -- Subtítulos
  UPDATE aula_lessons
     SET subtitle = replace(subtitle, 'ISO 9001:2015', 'ISO 9001:2026'), updated_at = NOW()
   WHERE course_id = v_curso AND deleted_at IS NULL AND subtitle LIKE '%ISO 9001:2015%';
  GET DIAGNOSTICS v_k = ROW_COUNT; v_n := v_n + v_k;

  -- Enlaces a las vistas previas de 2015
  UPDATE aula_lesson_blocks b
     SET data = b.data || jsonb_build_object(
                  'url', 'https://www.iso.org/standard/9000',
                  'title', 'ISO 9000:2026 Gestión de la calidad — Fundamentos y vocabulario (página oficial)',
                  'description', 'ISO (5.ª edición, mayo de 2026; disponible en español)'),
         updated_at = NOW()
    FROM aula_lessons l
   WHERE b.lesson_id = l.id AND l.course_id = v_curso AND l.deleted_at IS NULL
     AND b.type = 'enlace' AND b.deleted_at IS NULL
     AND b.data->>'url' = 'https://webstore.ansi.org/preview-pages/ISO/preview_ISO+9000-2015[S].pdf';
  GET DIAGNOSTICS v_k = ROW_COUNT; v_n := v_n + v_k;

  UPDATE aula_lesson_blocks b
     SET data = b.data || jsonb_build_object(
                  'url', 'https://www.iso.org/standard/9001',
                  'title', 'ISO 9001:2026 Sistemas de gestión de la calidad — Requisitos (página oficial)',
                  'description', 'ISO (6.ª edición, septiembre de 2026; disponible en español)'),
         updated_at = NOW()
    FROM aula_lessons l
   WHERE b.lesson_id = l.id AND l.course_id = v_curso AND l.deleted_at IS NULL
     AND b.type = 'enlace' AND b.deleted_at IS NULL
     AND b.data->>'url' = 'https://webstore.ansi.org/preview-pages/ISO/preview_ISO+9001-2015[S].pdf';
  GET DIAGNOSTICS v_k = ROW_COUNT; v_n := v_n + v_k;

  -- Títulos de los videos de Edutin sobre ISO 9001 (explican la edición 2015)
  FOR r IN SELECT * FROM (VALUES
      ('c0UCt35OR64', $v$ISO 9000 e ISO 9001: generalidades (Edutin Academy, edición 2015)$v$),
      ('gKveWCovbF8', $v$Norma ISO 9001, capítulo 4: contexto de la organización (Edutin Academy, edición 2015)$v$),
      ('JLPZQmXXJTo', $v$Norma ISO 9001, capítulo 9: evaluación del desempeño (Edutin Academy, edición 2015)$v$),
      ('7abeO2M6oAY', $v$ISO 9001: planificación de los cambios (Edutin Academy, edición 2015)$v$)
    ) AS t(video, titulo)
  LOOP
    UPDATE aula_lesson_blocks b
       SET data = jsonb_set(b.data, '{title}', to_jsonb(r.titulo::text)), updated_at = NOW()
      FROM aula_lessons l
     WHERE b.lesson_id = l.id AND l.course_id = v_curso AND l.deleted_at IS NULL
       AND b.type = 'video' AND b.deleted_at IS NULL
       AND b.data->>'videoId' = r.video AND b.data->>'title' IS DISTINCT FROM r.titulo;
    GET DIAGNOSTICS v_k = ROW_COUNT; v_n := v_n + v_k;
  END LOOP;

  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Actualización a ISO 9001:2026 e ISO 9000:2026 (188_gestion_calidad_iso_2026.sql).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;

  RAISE NOTICE 'ISO 9001:2026 en el curso de gestión de calidad: % cambios.', v_n;
END $iso$;

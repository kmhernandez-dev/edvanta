-- ============================================================
--  184_publicar_cuatro_pendientes.sql
--
--  Cuatro cursos no quedaron publicados con la 183:
--
--    • Autocuidado de la tiroides
--    • Importación de Medicamentos Vitales No Disponibles
--    • Quimioterapia Antineoplásica
--    • Terapias Dirigidas en Oncología
--
--  Se corrigen las causas más frecuentes de rechazo antes de volver a
--  aprobarlos:
--
--    1. Si el curso estaba archivado, vuelve a borrador.
--    2. Si una clase se completa «al ver un video» y no tiene video,
--       pasa a completarse de forma manual (no se inventa un video).
--    3. Si el curso no tiene ninguna clase obligatoria, la primera pasa
--       a serlo.
--    4. Se limpian las aprobaciones pendientes con error y se vuelve a
--       aprobar la publicación o la nueva versión.
--
--  El servidor hace la publicación real al arrancar, con validación.
-- ============================================================

DO $cuatro$
DECLARE
  r RECORD;
  v_curso BIGINT;
  v_primera INTEGER := 0;
  v_nueva INTEGER := 0;
BEGIN
  UPDATE aula_courses
     SET status = 'borrador', updated_at = NOW()
   WHERE kind = 'edvanta'
     AND deleted_at IS NULL
     AND status = 'archivado'
     AND title IN (
       'Autocuidado de la tiroides',
       'Curso de Importación de Medicamentos Vitales No Disponibles',
       'Curso de Quimioterapia Antineoplásica',
       'Curso de Terapias Dirigidas en Oncología'
     );

  UPDATE aula_lessons l
     SET completion_rule = 'manual', updated_at = NOW()
    FROM aula_courses c
   WHERE l.course_id = c.id
     AND c.kind = 'edvanta'
     AND c.deleted_at IS NULL
     AND l.deleted_at IS NULL
     AND l.completion_rule = 'video'
     AND NOT EXISTS (
       SELECT 1 FROM aula_lesson_blocks b
        WHERE b.lesson_id = l.id AND b.deleted_at IS NULL AND b.type = 'video'
     );

  FOR r IN
    SELECT c.id, c.title
      FROM aula_courses c
     WHERE c.kind = 'edvanta'
       AND c.deleted_at IS NULL
       AND c.title IN (
         'Autocuidado de la tiroides',
         'Curso de Importación de Medicamentos Vitales No Disponibles',
         'Curso de Quimioterapia Antineoplásica',
         'Curso de Terapias Dirigidas en Oncología'
       )
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM aula_lessons l
       WHERE l.course_id = r.id AND l.deleted_at IS NULL AND l.is_required = TRUE
    ) THEN
      UPDATE aula_lessons l
         SET is_required = TRUE, updated_at = NOW()
       WHERE l.id = (
         SELECT l2.id FROM aula_lessons l2
          WHERE l2.course_id = r.id AND l2.deleted_at IS NULL
          ORDER BY l2.sort_order, l2.id LIMIT 1
       );
    END IF;

    DELETE FROM aula_publicaciones_aprobadas
     WHERE course_id = r.id AND publicado_at IS NULL;
    DELETE FROM aula_republicaciones_aprobadas
     WHERE course_id = r.id AND publicado_at IS NULL;

    SELECT current_version_id INTO v_curso FROM aula_courses WHERE id = r.id;
    IF v_curso IS NULL THEN
      INSERT INTO aula_publicaciones_aprobadas (course_id, aprobado_por, nota)
      VALUES (
        r.id,
        'Dirección académica de Edvanta',
        'Publicación del catálogo completo, corregida y aprobada (184).'
      );
      v_primera := v_primera + 1;
    ELSE
      INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
      VALUES (
        r.id,
        'Dirección académica de Edvanta',
        'Nueva versión del catálogo completo, corregida y aprobada (184).'
      );
      v_nueva := v_nueva + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'Pendientes: % primeras publicaciones y % versiones nuevas.', v_primera, v_nueva;
END $cuatro$;

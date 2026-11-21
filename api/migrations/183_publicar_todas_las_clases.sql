-- ============================================================
--  183_publicar_todas_las_clases.sql
--
--  Publica el catálogo completo de Edvanta:
--
--    • cursos que nunca se publicaron → primera publicación;
--    • cursos ya publicados → nueva versión con el contenido actual
--      (experiencias, videos, títulos y evaluaciones).
--
--  Usa el mismo camino del botón «Publicar»: snapshot, validación,
--  versión y bitácora. Si un curso no pasa la validación, no se fuerza:
--  queda el error en la tabla de aprobaciones y el curso sigue como está.
--
--  Idempotente: no duplica una aprobación pendiente.
-- ============================================================

DO $todas$
DECLARE
  r RECORD;
  v_primera INTEGER := 0;
  v_nueva   INTEGER := 0;
BEGIN
  FOR r IN
    SELECT c.id, c.title, c.current_version_id
      FROM aula_courses c
     WHERE c.kind = 'edvanta'
       AND c.deleted_at IS NULL
     ORDER BY c.id
  LOOP
    IF r.current_version_id IS NULL THEN
      IF EXISTS (
        SELECT 1 FROM aula_publicaciones_aprobadas p WHERE p.course_id = r.id
      ) THEN
        UPDATE aula_publicaciones_aprobadas
           SET publicado_at = NULL,
               version_id = NULL,
               error = NULL,
               aprobado_por = 'Dirección académica de Edvanta',
               nota = 'Publicación del catálogo completo, aprobada por dirección académica (183).'
         WHERE course_id = r.id
           AND publicado_at IS NOT NULL;
      ELSE
        INSERT INTO aula_publicaciones_aprobadas (course_id, aprobado_por, nota)
        VALUES (
          r.id,
          'Dirección académica de Edvanta',
          'Publicación del catálogo completo, aprobada por dirección académica (183).'
        );
      END IF;
      v_primera := v_primera + 1;
    ELSE
      IF NOT EXISTS (
        SELECT 1 FROM aula_republicaciones_aprobadas p
         WHERE p.course_id = r.id AND p.publicado_at IS NULL
      ) THEN
        INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
        VALUES (
          r.id,
          'Dirección académica de Edvanta',
          'Catálogo completo: nueva versión con experiencias y videos (183).'
        );
        v_nueva := v_nueva + 1;
      END IF;
    END IF;
  END LOOP;

  RAISE NOTICE 'Catálogo completo: % primeras publicaciones y % versiones nuevas aprobadas.', v_primera, v_nueva;
END $todas$;

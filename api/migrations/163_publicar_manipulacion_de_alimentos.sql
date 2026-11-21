-- ============================================================
--  163_publicar_manipulacion_de_alimentos.sql
--
--  La propietaria aprobó el Curso de Manipulación de Alimentos (161 y
--  162) el 18-nov-2026 («apruebo todo»).
--
--   1. Publicación aprobada: el servidor lo publica al arrancar con el
--      mismo publishCourse del botón «Publicar» (054).
--   2. La dirección principal /curso-de-manipulacion-de-alimentos, que
--      tenía el curso curado de Edutin, pasa al curso propio: es la que
--      busca la gente (19.090 búsquedas al mes en Colombia) y la que vende
--      el certificado. El curado queda en
--      /curso-de-manipulacion-de-alimentos-en-edutin. No se borra ninguna
--      fila de public_slugs: la principal cambia de dueño y el curado
--      recibe una nueva vigente.
--
--  Idempotente: si el curso propio ya tiene dirección, o la principal ya
--  no es del curado, no hace nada.
-- ============================================================

INSERT INTO aula_publicaciones_aprobadas (course_id, aprobado_por, nota)
SELECT c.id, 'Karla Hernández, dirección académica',
       'Aprobado para publicar el 18-nov-2026 («apruebo todo»).'
  FROM aula_courses c
 WHERE c.kind = 'edvanta' AND c.deleted_at IS NULL
   AND c.status = 'borrador' AND c.current_version_id IS NULL
   AND c.title = 'Curso de Manipulación de Alimentos'
ON CONFLICT (course_id) DO NOTHING;

DO $pma$
DECLARE
  v_curso  BIGINT;
  v_curado BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Manipulación de Alimentos' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el Curso de Manipulación de Alimentos (161).';
    RETURN;
  END IF;
  IF EXISTS (SELECT 1 FROM public_slugs WHERE entity = 'aula' AND entity_id = v_curso AND is_current) THEN
    RETURN;
  END IF;

  SELECT entity_id INTO v_curado FROM public_slugs
   WHERE slug = 'curso-de-manipulacion-de-alimentos' AND entity = 'curado';

  IF v_curado IS NOT NULL THEN
    -- El curado deja la principal y estrena la suya.
    UPDATE public_slugs SET is_current = FALSE
     WHERE entity = 'curado' AND entity_id = v_curado AND is_current;
    INSERT INTO public_slugs (slug, entity, entity_id, is_current)
    VALUES ('curso-de-manipulacion-de-alimentos-en-edutin', 'curado', v_curado, TRUE)
    ON CONFLICT (slug) DO UPDATE SET is_current = TRUE
      WHERE public_slugs.entity = 'curado' AND public_slugs.entity_id = v_curado;
    -- La principal pasa al curso propio.
    UPDATE public_slugs SET entity = 'aula', entity_id = v_curso, is_current = TRUE
     WHERE slug = 'curso-de-manipulacion-de-alimentos';
  ELSIF NOT EXISTS (SELECT 1 FROM public_slugs WHERE slug = 'curso-de-manipulacion-de-alimentos') THEN
    INSERT INTO public_slugs (slug, entity, entity_id, is_current)
    VALUES ('curso-de-manipulacion-de-alimentos', 'aula', v_curso, TRUE);
  END IF;
END $pma$;

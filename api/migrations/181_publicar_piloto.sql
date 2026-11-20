-- ============================================================
--  181_publicar_piloto.sql
--
--  Publica los tres cursos piloto del catálogo nuevo:
--
--    1. Curso de Gestión de Calidad Farmacéutica
--    2. Curso de Asuntos Regulatorios Farmacéuticos en Colombia
--    3. Curso de Farmacoterapia de la Diabetes
--
--  No publica los 60 restantes: siguen en borrador para la revisión
--  académica. El servidor los publica al arrancar con el mismo camino del
--  botón «Publicar» (snapshot, validación, versión y bitácora). Si alguno
--  no pasa la validación, queda en borrador y el error se guarda en
--  aula_publicaciones_aprobadas.
-- ============================================================

DO $piloto$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT c.id, c.title
      FROM aula_courses c
     WHERE c.kind = 'edvanta'
       AND c.deleted_at IS NULL
       AND c.current_version_id IS NULL
       AND c.title IN (
         'Curso de Gestión de Calidad Farmacéutica',
         'Curso de Asuntos Regulatorios Farmacéuticos en Colombia',
         'Curso de Farmacoterapia de la Diabetes'
       )
       AND NOT EXISTS (
         SELECT 1 FROM aula_publicaciones_aprobadas p
          WHERE p.course_id = c.id AND p.publicado_at IS NULL
       )
  LOOP
    INSERT INTO aula_publicaciones_aprobadas (course_id, aprobado_por, nota)
    VALUES (
      r.id,
      'Dirección académica de Edvanta',
      'Piloto de lanzamiento del catálogo con experiencias y videos verificados. Contenido pendiente de revisión académica final.'
    );
    RAISE NOTICE 'Piloto aprobado para publicar: %', r.title;
  END LOOP;
END $piloto$;

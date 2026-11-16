-- ============================================================
--  128_aula_matriculas_version_vigente.sql
--
--  Las clases ampliadas se publicaron en una versión nueva, pero las
--  matrículas existentes seguían ancladas a la versión anterior. El aula
--  mostraba el texto corto aunque la página pública ya tuviera la
--  experiencia completa.
--
--  Esta migración lleva a la versión vigente las matrículas activas de
--  los cursos que ya tienen una republicación publicada. El avance no se
--  pierde: las clases conservan el mismo id.
-- ============================================================

UPDATE aula_enrollments e
   SET course_version_id = c.current_version_id,
       updated_at = NOW()
  FROM aula_courses c
 WHERE e.course_id = c.id
   AND e.withdrawn_at IS NULL
   AND c.deleted_at IS NULL
   AND c.current_version_id IS NOT NULL
   AND e.course_version_id IS DISTINCT FROM c.current_version_id
   AND EXISTS (
     SELECT 1 FROM aula_republicaciones_aprobadas r
      WHERE r.course_id = c.id AND r.publicado_at IS NOT NULL
   );

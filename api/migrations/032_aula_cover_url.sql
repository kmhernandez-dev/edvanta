-- ============================================================
--  032_aula_cover_url.sql — Portada por enlace en los cursos del aula
--
--  Hasta ahora la portada de un curso del aula solo podía venir de
--  un archivo subido (cover_file_id). Para curar cursos rápido hace
--  falta poder pegar la URL de una imagen, igual que ya se hace en
--  el catálogo externo (courses.image_url).
--
--  Las dos conviven: si hay archivo subido, manda el archivo; si no,
--  se usa el enlace.
-- ============================================================

ALTER TABLE aula_courses
  ADD COLUMN IF NOT EXISTS cover_url TEXT;

COMMENT ON COLUMN aula_courses.cover_url IS
  'Portada por enlace. Solo se usa cuando cover_file_id es NULL.';

-- ============================================================
--  059 · Direcciones del aula con nombre
--
--  Cada clase tiene un nombre fijo para su dirección:
--    /aula/curso-de-farmacoterapia-de-la-diabetes/clase/metformina
--  en vez de /aula/curso/53/clase/812.
--
--  Lo asigna la API (lib/slugs-publicos.js) al publicar el curso y, a las
--  clases que ya existían, al arrancar. Una vez asignado no cambia aunque
--  cambie el título. Es único dentro del curso contando las clases
--  borradas: una dirección vieja nunca abre otra clase.
--
--  El id sigue siendo la llave del avance, los apuntes y los comentarios.
-- ============================================================

ALTER TABLE aula_lessons ADD COLUMN IF NOT EXISTS slug TEXT
  CHECK (slug IS NULL OR (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND slug !~ '^[0-9]+$' AND length(slug) <= 80));

CREATE UNIQUE INDEX IF NOT EXISTS aula_lessons_slug_en_curso
  ON aula_lessons (course_id, slug) WHERE slug IS NOT NULL;

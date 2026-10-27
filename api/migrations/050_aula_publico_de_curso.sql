-- ============================================================
--  050_aula_publico_de_curso.sql — Para quién es cada curso
--
--  Edvanta forma a dos públicos que no se deben mezclar: profesionales
--  que se actualizan y pacientes que quieren comprender su salud. Hasta
--  ahora la única pista era que «Autocuidado de la tiroides» no tenía
--  área (046), y por eso el catálogo profesional lo mostraba bajo «Otros
--  cursos de Edvanta», junto a farmacología y regulatorios.
--
--  Una ausencia no es un dato. Se añade `publico`, explícito, con dos
--  valores. Todo lo que ya existe es profesional salvo el curso de
--  tiroides, que se marca por su etiqueta y no por su título: así entra
--  también lo que se cree después con esa misma etiqueta.
--
--  Solo agrega: no borra ni cambia ninguna otra columna.
-- ============================================================

ALTER TABLE aula_courses
  ADD COLUMN IF NOT EXISTS publico TEXT NOT NULL DEFAULT 'profesionales';

DO $$
BEGIN
  ALTER TABLE aula_courses
    ADD CONSTRAINT aula_courses_publico_check CHECK (publico IN ('profesionales', 'pacientes'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON COLUMN aula_courses.publico IS
  'profesionales (formación del talento humano) o pacientes (educación para pacientes y cuidadores). Nunca se listan juntos.';

UPDATE aula_courses SET publico = 'pacientes'
 WHERE category = 'Tiroides y autocuidado';

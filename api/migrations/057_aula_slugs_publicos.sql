-- ============================================================
--  057_aula_slugs_publicos.sql — Direcciones públicas de los cursos
--
--  Antes, un curso propio vivía en /curso/53 y uno curado en
--  /cursos/desarrollador-front-end-junior-22145. Ahora cada curso
--  tiene una dirección que dice qué es:
--
--    /curso-de-farmacoterapia-de-la-diabetes
--
--  El slug se guarda aquí, una vez, y no se recalcula: si después
--  cambia el título, la dirección sigue igual. Si hay que cambiarla,
--  la anterior queda con is_current = FALSE y redirige a la vigente.
--
--  Los identificadores internos no cambian: matrículas, progreso,
--  opiniones y pagos siguen colgando del id del curso. Esta tabla solo
--  traduce dirección ↔ curso.
--
--  Las filas las crea el servidor (lib/slugs-publicos.js) al arrancar
--  y al publicar un curso: el slug sale del título con reglas que no se
--  pueden escribir en SQL sin repetirlas aquí.
-- ============================================================

CREATE TABLE IF NOT EXISTS public_slugs (
  slug        TEXT PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(slug) <= 80),
  -- aula → aula_courses (propios) · curado → courses (Edutin, Coursera, Udemy)
  entity      TEXT NOT NULL CHECK (entity IN ('aula', 'curado')),
  entity_id   BIGINT NOT NULL,
  is_current  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Un solo slug vigente por curso; los anteriores se conservan para redirigir.
CREATE UNIQUE INDEX IF NOT EXISTS public_slugs_vigente ON public_slugs (entity, entity_id) WHERE is_current;
CREATE INDEX IF NOT EXISTS public_slugs_curso ON public_slugs (entity, entity_id);

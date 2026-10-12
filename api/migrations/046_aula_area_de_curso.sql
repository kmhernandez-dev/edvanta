-- ============================================================
--  046_aula_area_de_curso.sql — Tres categorías para ordenar
--
--  Los cursos propios habían crecido hasta seis etiquetas distintas
--  («Calidad farmacéutica», «Calidad y manufactura», «Servicio
--  farmacéutico», «Asuntos regulatorios», «Asuntos regulatorios —
--  productos especiales», «Farmacología»), que es demasiado para que
--  alguien se oriente de un vistazo.
--
--  Se añade `area`: la categoría grande con la que se agrupan en la
--  página. Son tres y solo tres.
--
--  `category` NO se toca. Sigue siendo la etiqueta fina que se ve en la
--  ficha del curso, y es la que distingue, por ejemplo, los diez cursos
--  de productos especiales dentro de todo lo regulatorio. Machacarla
--  para dejar tres valores habría perdido esa distinción, que costó
--  trabajo y sirve.
--
--  «Autocuidado de la tiroides» se queda sin área a propósito: es un
--  curso para pacientes, no formación profesional, y meterlo con calzador
--  en una de las tres solo ensucia las tres.
-- ============================================================

ALTER TABLE aula_courses
  ADD COLUMN IF NOT EXISTS area TEXT;

COMMENT ON COLUMN aula_courses.area IS
  'Categoría grande para agrupar en la web (Calidad, Asuntos Regulatorios, Farmacología). La etiqueta fina es category.';

-- El reparto va por `category`, no por título: así entra también lo que
-- se cree más adelante con esas mismas etiquetas.
UPDATE aula_courses SET area = 'Calidad'
 WHERE area IS NULL
   AND category IN ('Calidad farmacéutica', 'Calidad y manufactura', 'Servicio farmacéutico');

UPDATE aula_courses SET area = 'Asuntos Regulatorios'
 WHERE area IS NULL
   AND category LIKE 'Asuntos regulatorios%';

UPDATE aula_courses SET area = 'Farmacología'
 WHERE area IS NULL
   AND category = 'Farmacología';

CREATE INDEX IF NOT EXISTS aula_courses_area_idx
  ON aula_courses (area) WHERE deleted_at IS NULL AND area IS NOT NULL;

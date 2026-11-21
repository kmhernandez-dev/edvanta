-- ============================================================
--  176_renombrar_clases_homonimas.sql
--
--  Las experiencias del catálogo volvieron públicas muchas clases
--  nuevas. Tres títulos se repetían y la página pública no puede
--  distinguirlos: «Introducción a la unidad» (ocho veces), «Introducción
--  al curso» (dos veces) y «Tiazidas y similares…» (dos cursos). Aquí se
--  renombran con el tema de su unidad, sin tocar el contenido ni los
--  videos. Si la versión ya estaba publicada, se aprueba una nueva.
--
--  Idempotente: solo cambia cuando el título sigue siendo el genérico.
-- ============================================================

DO $renombres$
DECLARE
  v_cursos BIGINT[] := ARRAY[]::BIGINT[];
  r RECORD;
BEGIN
  FOR r IN
    SELECT * FROM (VALUES
      ('Curso de Buenas Prácticas de Documentación Farmacéutica', 'Unidad 1. Fundamentos de las Buenas Prácticas de Documentación y marco normativo', 'Introducción al curso', 'Introducción: documentación farmacéutica'),
      ('Curso de Buenas Prácticas de Documentación Farmacéutica', 'Unidad 2. Jerarquía documental y redacción de procedimientos', 'Introducción a la unidad', 'Introducción: jerarquía documental'),
      ('Curso de Buenas Prácticas de Documentación Farmacéutica', 'Unidad 3. Control de documentos y reglas de diligenciamiento', 'Introducción a la unidad', 'Introducción: control de documentos'),
      ('Curso de Buenas Prácticas de Documentación Farmacéutica', 'Unidad 4. Registros de lote, documentación de laboratorio e integridad de datos', 'Introducción a la unidad', 'Introducción: registros de lote e integridad'),
      ('Curso de Buenas Prácticas de Documentación Farmacéutica', 'Unidad 5. Registros electrónicos, archivo y retención', 'Introducción a la unidad', 'Introducción: registros electrónicos y archivo'),
      ('Curso de Validación de Métodos Analíticos', 'Unidad 1. Fundamentos y marco regulatorio de la validación analítica', 'Introducción al curso', 'Introducción: validación analítica'),
      ('Curso de Validación de Métodos Analíticos', 'Unidad 2. Parámetros de desempeño del método', 'Introducción a la unidad', 'Introducción: parámetros de desempeño'),
      ('Curso de Validación de Métodos Analíticos', 'Unidad 3. Diseño experimental y estadística aplicada', 'Introducción a la unidad', 'Introducción: diseño experimental'),
      ('Curso de Validación de Métodos Analíticos', 'Unidad 4. Métodos indicadores de estabilidad y métodos microbiológicos', 'Introducción a la unidad', 'Introducción: estabilidad y microbiología'),
      ('Curso de Validación de Métodos Analíticos', 'Unidad 5. Documentación, ciclo de vida y casos prácticos', 'Introducción a la unidad', 'Introducción: documentación y ciclo de vida')
    ) AS t(curso, unidad, viejo, nuevo)
  LOOP
    UPDATE aula_lessons l
       SET title = r.nuevo, updated_at = NOW()
      FROM aula_modules m, aula_courses c
     WHERE l.module_id = m.id
       AND m.course_id = c.id
       AND c.title = r.curso
       AND m.title = r.unidad
       AND l.title = r.viejo
       AND l.deleted_at IS NULL
       AND m.deleted_at IS NULL
       AND c.deleted_at IS NULL;

    UPDATE aula_lesson_blocks b
       SET data = jsonb_set(b.data, '{gancho,titulo}', to_jsonb(r.nuevo::text)), updated_at = NOW()
      FROM aula_lessons l, aula_modules m, aula_courses c
     WHERE b.lesson_id = l.id
       AND l.module_id = m.id
       AND m.course_id = c.id
       AND c.title = r.curso
       AND m.title = r.unidad
       AND l.title = r.nuevo
       AND b.type = 'experiencia'
       AND b.deleted_at IS NULL
       AND COALESCE(b.data->'gancho'->>'titulo', '') = r.viejo;
  END LOOP;

  -- Curso de Farmacología Renal: la clase homónima de Farmacoterapia de la HTA.
  UPDATE aula_lessons l
     SET title = 'Tiazidas y similares en la enfermedad renal', updated_at = NOW()
    FROM aula_courses c
   WHERE l.course_id = c.id
     AND c.title = 'Curso de Farmacología Renal'
     AND l.title = 'Tiazidas y similares: hidroclorotiazida, clortalidona e indapamida'
     AND l.deleted_at IS NULL
     AND c.deleted_at IS NULL;

  UPDATE aula_lesson_blocks b
     SET data = jsonb_set(b.data, '{gancho,titulo}', to_jsonb('Tiazidas y similares en la enfermedad renal'::text)), updated_at = NOW()
    FROM aula_lessons l, aula_courses c
   WHERE b.lesson_id = l.id
     AND l.course_id = c.id
     AND c.title = 'Curso de Farmacología Renal'
     AND l.title = 'Tiazidas y similares en la enfermedad renal'
     AND b.type = 'experiencia'
     AND b.deleted_at IS NULL
     AND COALESCE(b.data->'gancho'->>'titulo', '') = 'Tiazidas y similares: hidroclorotiazida, clortalidona e indapamida';

  SELECT array_agg(DISTINCT c.id) INTO v_cursos
    FROM aula_courses c
   WHERE c.deleted_at IS NULL
     AND c.id IN (
       SELECT id FROM aula_courses WHERE title = 'Curso de Buenas Prácticas de Documentación Farmacéutica'
       UNION SELECT id FROM aula_courses WHERE title = 'Curso de Validación de Métodos Analíticos'
       UNION SELECT id FROM aula_courses WHERE title = 'Curso de Farmacología Renal'
     )
     AND c.current_version_id IS NOT NULL;

  IF v_cursos IS NOT NULL THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT unnest(v_cursos), 'Dirección académica de Edvanta',
           'Títulos de clase únicos para la página pública (176).';
  END IF;

  RAISE NOTICE 'Renombres de clases homónimas aplicados.';
END $renombres$;

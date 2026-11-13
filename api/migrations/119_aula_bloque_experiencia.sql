-- ============================================================
--  119_aula_bloque_experiencia.sql — Bloque «experiencia de clase»
--
--  Un bloque nuevo guarda la clase completa como datos estructurados:
--  situación inicial, objetivos, conceptos con icono, mapa conceptual,
--  desarrollo, mapa de proceso, caso con decisión, errores frecuentes,
--  autoevaluación, resumen, referencias y sugerencias de imagen.
--  La validación vive en api/lib/experiencia.js.
--
--  Aquí solo se amplía la lista de tipos permitidos. No cambia ni borra
--  ningún bloque existente. Idempotente.
-- ============================================================

DO $$
DECLARE
  c RECORD;
BEGIN
  -- El CHECK de 029 no tiene nombre propio: se busca por su definición.
  FOR c IN
    SELECT con.conname
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
     WHERE rel.relname = 'aula_lesson_blocks'
       AND con.contype = 'c'
       AND pg_get_constraintdef(con.oid) LIKE '%encabezado%'
  LOOP
    EXECUTE format('ALTER TABLE aula_lesson_blocks DROP CONSTRAINT %I', c.conname);
  END LOOP;

  ALTER TABLE aula_lesson_blocks
    ADD CONSTRAINT aula_lesson_blocks_type_check CHECK (type IN (
      'encabezado', 'texto', 'imagen', 'galeria', 'video', 'audio', 'pdf',
      'presentacion', 'archivos', 'infografia', 'enlace', 'destacado',
      'actividad', 'quiz', 'foro', 'experiencia'
    ));
END $$;

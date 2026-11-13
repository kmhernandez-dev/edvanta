-- ============================================================
--  123_aula_video_antes_de_la_lectura.sql — En cada clase con experiencia,
--  el video va arriba y la lectura debajo
-- ============================================================
--
--  Las migraciones 120, 121 y 122 dejaron la experiencia de clase en el
--  primer lugar y corrieron los demás bloques una posición, así que los
--  videos de YouTube quedaron debajo de la lectura larga. La dirección
--  pidió (13-nov-2026) que el video quede siempre arriba y la lectura siga
--  debajo.
--
--  En cada clase que tiene experiencia, los bloques quedan así:
--    1. los videos, en el orden en que estaban;
--    2. la experiencia de clase;
--    3. el resto (enlaces, destacados, archivos), en su orden.
--
--  Solo se tocan las clases cuyo orden cambia. Cada curso tocado deja una
--  republicación aprobada para que el aula muestre el orden nuevo.
--  Volver a aplicarla no cambia nada.
-- ============================================================

DO $orden$
DECLARE
  v_cursos BIGINT[];
BEGIN
  WITH clases AS (
    SELECT DISTINCT lesson_id
      FROM aula_lesson_blocks
     WHERE type = 'experiencia' AND deleted_at IS NULL
  ),
  orden AS (
    SELECT b.id,
           (row_number() OVER (
              PARTITION BY b.lesson_id
              ORDER BY CASE b.type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, b.sort_order, b.id
            ) - 1)::int AS pos
      FROM aula_lesson_blocks b
      JOIN clases c ON c.lesson_id = b.lesson_id
     WHERE b.deleted_at IS NULL
  ),
  cambiados AS (
    UPDATE aula_lesson_blocks b
       SET sort_order = o.pos
      FROM orden o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos
    RETURNING b.lesson_id
  )
  SELECT array_agg(DISTINCT l.course_id) INTO v_cursos
    FROM cambiados x
    JOIN aula_lessons l ON l.id = x.lesson_id;

  IF v_cursos IS NOT NULL THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT c.id, 'Dirección académica de Edvanta', 'Video arriba y lectura debajo en las clases con experiencia (123_aula_video_antes_de_la_lectura.sql).'
      FROM aula_courses c
     WHERE c.id = ANY (v_cursos) AND c.current_version_id IS NOT NULL;
  END IF;

  RAISE NOTICE 'Video antes de la lectura: % cursos con clases reordenadas.', coalesce(array_length(v_cursos, 1), 0);
END $orden$;

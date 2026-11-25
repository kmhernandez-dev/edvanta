-- ============================================================
--  194_formato_unico_de_clases.sql — Todas las clases con el formato
--  de los cursos de Farmacoterapia
--
--  El formato de referencia (055_cursos_farmacoterapia.sql) es:
--
--    1. Video
--    2. Experiencia interactiva
--    3. «En esta clase»            (destacado: de qué trata y objetivo)
--    4. «La clase en texto»        (encabezado + la lectura)
--    5. Ejemplo aplicado, puntos clave y demás destacados
--    6. «Para profundizar»         (encabezado + enlaces)
--    7. «Referencias»              (encabezado + lista)
--
--  Las migraciones de experiencias (120 a 189) retiraron TODOS los
--  bloques de texto de cada clase al insertar la experiencia, no solo
--  el resumen corto de la siembra. En Farmacoterapia quedaron los
--  encabezados «La clase en texto» y «Referencias» sin nada debajo, y
--  en el resto del catálogo se perdió la lectura donde la había.
--
--  Esta migración no escribe contenido nuevo: devuelve a su lugar el
--  texto que ya existía y ordena los bloques. Por clase:
--
--    a. Los textos retirados junto con la experiencia (misma marca de
--       tiempo que su creación) vuelven:
--         · la lista de referencias, bajo «Referencias» o «Fuentes»;
--         · el resumen corto de la siembra, como destacado «En esta
--           clase» (si la clase no lo tiene);
--         · el resto, como lectura bajo «La clase en texto».
--    b. Se agregan los encabezados «La clase en texto» y «Para
--       profundizar» donde falten y haya algo que encabezar.
--    c. En las clases sin experiencia que ya traen resumen y lectura
--       (habilidades blandas, gestión de riesgos) se aplica el mismo
--       orden con sus propios bloques.
--
--  Las fichas de medicamento de Farmacoterapia recuperan la ficha
--  completa, después de «Cómo leer esta ficha», sin encabezado nuevo.
--
--  No toca la experiencia, los videos, los enlaces ni las evaluaciones.
--  Idempotente: aplicarla dos veces no cambia nada. Cada curso
--  publicado que cambie deja una republicación aprobada (077).
-- ============================================================

DO $formato$
DECLARE
  r          RECORD;
  t          RECORD;
  v_exp_at   TIMESTAMPTZ;
  v_cambio   BOOLEAN;
  v_resumen  BOOLEAN;
  v_lectura  BOOLEAN;
  v_cursos   BIGINT[] := '{}';
  v_clases   INTEGER := 0;
  v_textos   INTEGER := 0;
  LIMITE_RESUMEN CONSTANT INTEGER := 600;
BEGIN
  FOR r IN
    SELECT l.id AS clase, l.course_id AS curso
      FROM aula_lessons l
      JOIN aula_courses c ON c.id = l.course_id AND c.kind = 'edvanta' AND c.deleted_at IS NULL
     WHERE l.deleted_at IS NULL
     ORDER BY l.course_id, l.id
  LOOP
    v_cambio := FALSE;

    SELECT created_at INTO v_exp_at FROM aula_lesson_blocks
     WHERE lesson_id = r.clase AND type = 'experiencia' AND deleted_at IS NULL
     ORDER BY id LIMIT 1;

    v_resumen := EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = r.clase AND deleted_at IS NULL
                          AND type = 'destacado' AND data->>'title' = 'En esta clase');

    IF v_exp_at IS NOT NULL THEN
      -- a. Los textos que se retiraron al insertar la experiencia.
      FOR t IN
        SELECT id, data->>'html' AS html, sort_order
          FROM aula_lesson_blocks
         WHERE lesson_id = r.clase AND type = 'texto' AND deleted_at = v_exp_at
         ORDER BY sort_order, id
      LOOP
        IF t.html LIKE '<ol>%' OR t.html ILIKE '<h2>Fuentes</h2>%' THEN
          -- Referencias: vuelven al final (9xxx).
          UPDATE aula_lesson_blocks SET deleted_at = NULL, sort_order = 9000 + t.sort_order, updated_at = NOW() WHERE id = t.id;
        ELSIF NOT v_resumen AND length(t.html) <= LIMITE_RESUMEN THEN
          -- El resumen de la siembra pasa a ser «En esta clase». El texto sigue retirado.
          INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
          VALUES (r.clase, 'destacado', -3000, jsonb_build_object('tone', 'info', 'title', 'En esta clase', 'html', t.html));
          UPDATE aula_lesson_blocks SET deleted_at = v_exp_at + INTERVAL '1 microsecond', updated_at = NOW() WHERE id = t.id;
          v_resumen := TRUE;
        ELSE
          -- La lectura: bajo «La clase en texto» (-1xxx).
          UPDATE aula_lesson_blocks SET deleted_at = NULL, sort_order = -1000 + t.sort_order, updated_at = NOW() WHERE id = t.id;
        END IF;
        v_textos := v_textos + 1;
        v_cambio := TRUE;
      END LOOP;
    ELSE
      -- c. Sin experiencia: un texto corto antes de una lectura larga es el resumen.
      IF NOT v_resumen THEN
        SELECT id, data->>'html' AS html INTO t FROM aula_lesson_blocks
         WHERE lesson_id = r.clase AND type = 'texto' AND deleted_at IS NULL
         ORDER BY sort_order, id LIMIT 1;
        IF t.id IS NOT NULL AND length(t.html) <= LIMITE_RESUMEN
           AND EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = r.clase AND type = 'texto' AND deleted_at IS NULL
                        AND id <> t.id AND length(data->>'html') > LIMITE_RESUMEN) THEN
          INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
          VALUES (r.clase, 'destacado', -3000, jsonb_build_object('tone', 'info', 'title', 'En esta clase', 'html', t.html));
          UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE id = t.id;
          v_resumen := TRUE;
          v_cambio := TRUE;
        END IF;
      END IF;
    END IF;

    -- b. «La clase en texto»: si la clase tiene resumen y lectura, y falta el encabezado.
    v_lectura := EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = r.clase AND type = 'texto' AND deleted_at IS NULL
                          AND NOT (data->>'html' LIKE '<ol>%' OR data->>'html' ILIKE '<h2>Fuentes</h2>%'));
    IF v_resumen AND v_lectura
       AND NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = r.clase AND deleted_at IS NULL
                        AND type = 'encabezado' AND data->>'text' = 'La clase en texto') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
      VALUES (r.clase, 'encabezado', -2000, '{"text":"La clase en texto","level":2}'::jsonb);
      v_cambio := TRUE;
    END IF;

    -- b. «Para profundizar»: antes del primer enlace, si falta.
    IF v_resumen
       AND EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = r.clase AND type = 'enlace' AND deleted_at IS NULL)
       AND NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = r.clase AND deleted_at IS NULL
                        AND type = 'encabezado' AND data->>'text' = 'Para profundizar') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
      VALUES (r.clase, 'encabezado', 8000, '{"text":"Para profundizar","level":2}'::jsonb);
      v_cambio := TRUE;
    END IF;

    IF v_cambio THEN
      -- El orden del formato. Dentro de cada grupo se conserva el orden que traían.
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (
          SELECT id, (row_number() OVER (ORDER BY
                   CASE
                     WHEN type = 'video' THEN 0
                     WHEN type = 'experiencia' THEN 1
                     -- La entrada de la clase; en las fichas de medicamento, «Cómo leer esta ficha».
                     WHEN type = 'destacado' AND data->>'title' IN ('En esta clase', 'Cómo leer esta ficha') THEN 2
                     WHEN type = 'encabezado' AND data->>'text' = 'La clase en texto' THEN 3
                     WHEN type = 'texto' AND NOT (data->>'html' LIKE '<ol>%' OR data->>'html' ILIKE '<h2>Fuentes</h2>%') THEN 4
                     WHEN type = 'destacado' THEN 5
                     WHEN type = 'encabezado' AND data->>'text' = 'Para profundizar' THEN 6
                     WHEN type = 'enlace' THEN 7
                     WHEN type = 'encabezado' AND data->>'text' = 'Referencias' THEN 9
                     WHEN type = 'texto' THEN 10
                     ELSE 8
                   END, sort_order, id) - 1)::int AS pos
            FROM aula_lesson_blocks WHERE lesson_id = r.clase AND deleted_at IS NULL
        ) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_clases := v_clases + 1;
      IF NOT (r.curso = ANY (v_cursos)) THEN v_cursos := v_cursos || r.curso; END IF;
    END IF;
  END LOOP;

  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT c.id, 'Dirección académica de Edvanta', 'Formato único de clase: se restituye la lectura y se ordenan los bloques (194_formato_unico_de_clases.sql).'
    FROM aula_courses c
   WHERE c.id = ANY (v_cursos) AND c.current_version_id IS NOT NULL;

  RAISE NOTICE 'Formato único: % clases en % cursos; % textos restituidos.', v_clases, COALESCE(array_length(v_cursos, 1), 0), v_textos;
END $formato$;

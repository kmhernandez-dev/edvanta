-- ============================================================
--  174_videos_catalogo.sql — Videos curados para clases sin video
--
--  Generado por scripts/curar-videos-aula.mjs. Cada video fue buscado por
--  el tema de la clase, exigió coincidencia de palabras y un canal
--  educativo o institucional, y se verificó con el oEmbed oficial de
--  YouTube antes de entrar aquí.
--
--  32 clases en 9 cursos. Idempotente: si
--  la clase ya tiene ese video, no lo duplica. El crédito y el estado del
--  canal quedan en api/lib/videos-youtube.json.
-- ============================================================

DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica$t$;
    RETURN;
  END IF;

  -- El marco normativo en Colombia
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$El marco normativo en Colombia$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$El marco normativo en Colombia$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'BTjUjZiBkwU') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=BTjUjZiBkwU","provider":"youtube","videoId":"BTjUjZiBkwU","title":"Normatividad y buenas prácticas ,del servicio farmacéutico en Colombia Cenproef","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- A quién obligan y qué certifica el INVIMA
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$A quién obligan y qué certifica el INVIMA$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$A quién obligan y qué certifica el INVIMA$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'G0597qCFHN4') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=G0597qCFHN4","provider":"youtube","videoId":"G0597qCFHN4","title":"Al día con Invima - Capítulo 5","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Instalaciones, áreas y equipos
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Instalaciones, áreas y equipos$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Instalaciones, áreas y equipos$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '6qtIq5eqV5U') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=6qtIq5eqV5U","provider":"youtube","videoId":"6qtIq5eqV5U","title":"Gestión de las BPM - 8 - Instalaciones","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Documentación: lo que no está escrito no ocurrió
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Documentación: lo que no está escrito no ocurrió$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Documentación: lo que no está escrito no ocurrió$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'v1qiK65r9j4') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=v1qiK65r9j4","provider":"youtube","videoId":"v1qiK65r9j4","title":"Buenas Practicas Documentación","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Desviaciones, cambios y CAPA
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Desviaciones, cambios y CAPA$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Desviaciones, cambios y CAPA$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'lxB9J8-NVzQ') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=lxB9J8-NVzQ","provider":"youtube","videoId":"lxB9J8-NVzQ","title":"Guía de inspección BPM - Desviaciones - Digemid - Perú","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;
  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos curados para clases sin video (174).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Videos de %: % clases.', $t$Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica$t$, v_n;
END $curso$;

DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales$t$;
    RETURN;
  END IF;

  -- El marco normativo colombiano
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$El marco normativo colombiano$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$El marco normativo colombiano$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'BTjUjZiBkwU') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=BTjUjZiBkwU","provider":"youtube","videoId":"BTjUjZiBkwU","title":"Normatividad y buenas prácticas ,del servicio farmacéutico en Colombia Cenproef","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Qué no se puede preparar
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Qué no se puede preparar$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Qué no se puede preparar$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'iq-1XOICI6s') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=iq-1XOICI6s","provider":"youtube","videoId":"iq-1XOICI6s","title":"¿Qué son las preparaciones magistrales?","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- La guía de elaboración y el etiquetado
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$La guía de elaboración y el etiquetado$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$La guía de elaboración y el etiquetado$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'itf2TBE7XrQ') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=itf2TBE7XrQ","provider":"youtube","videoId":"itf2TBE7XrQ","title":"Entrevista Alvin López  - Buenas prácticas de elaboración de medicamentos","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;
  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos curados para clases sin video (174).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Videos de %: % clases.', $t$Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales$t$, v_n;
END $curso$;

DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad$t$;
    RETURN;
  END IF;

  -- Normativa aplicable
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Normativa aplicable$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Normativa aplicable$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'qwEhvdkNlyA') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=qwEhvdkNlyA","provider":"youtube","videoId":"qwEhvdkNlyA","title":"📜 Normatividad aplicable a la industria farmacéutica 🏭💊 #Regulada #NormasFarmacéuticas","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Niveles de riesgo de una preparación
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Niveles de riesgo de una preparación$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Niveles de riesgo de una preparación$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'qfMHiBpiDbs') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=qfMHiBpiDbs","provider":"youtube","videoId":"qfMHiBpiDbs","title":"ELABORACIÓN DE PREPARADOS FARMACÉUTICOS - PARTE 1","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Cabinas de seguridad y flujo laminar
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Cabinas de seguridad y flujo laminar$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Cabinas de seguridad y flujo laminar$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ypWotK2hYOI') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=ypWotK2hYOI","provider":"youtube","videoId":"ypWotK2hYOI","title":"GMP en la Industria Farmacéutica 🏭 | Agua Purificada, Vapor y Flujo Laminar con Filtros HEPA","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Técnica aséptica y su validación
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Técnica aséptica y su validación$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Técnica aséptica y su validación$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'PIY_lVJ99v0') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=PIY_lVJ99v0","provider":"youtube","videoId":"PIY_lVJ99v0","title":"WEBINAR - Validación de Desinfectantes: Requisitos reales y prácticas habituales de la industria","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Estabilidad, trazabilidad y documentación
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Estabilidad, trazabilidad y documentación$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Estabilidad, trazabilidad y documentación$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'SbVIdMRM_vw') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=SbVIdMRM_vw","provider":"youtube","videoId":"SbVIdMRM_vw","title":"Curso-Taller  #02 ¿Cómo aplicar las buenas practicas de documentación en la farmacia?","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Mezclas oncológicas y seguridad de quien prepara
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Mezclas oncológicas y seguridad de quien prepara$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Mezclas oncológicas y seguridad de quien prepara$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ffUV0-UJ0t0') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=ffUV0-UJ0t0","provider":"youtube","videoId":"ffUV0-UJ0t0","title":"Farmacia oncológica: Preparación del campo de trabajo","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;
  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos curados para clases sin video (174).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Videos de %: % clases.', $t$Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad$t$, v_n;
END $curso$;

DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Asuntos Regulatorios Sanitarios ante INVIMA$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Asuntos Regulatorios Sanitarios ante INVIMA$t$;
    RETURN;
  END IF;

  -- Qué es el INVIMA y qué vigila
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Qué es el INVIMA y qué vigila$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Qué es el INVIMA y qué vigila$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'LGXqG2NyF28') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=LGXqG2NyF28","provider":"youtube","videoId":"LGXqG2NyF28","title":"El Invima prorroga plan de contingencia para trámites de registro sanitario de medicamentos","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Evaluación farmacológica y farmacéutica
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Evaluación farmacológica y farmacéutica$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Evaluación farmacológica y farmacéutica$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'HFCtUib-hSI') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACION FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Requerimientos y cómo responderlos
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Requerimientos y cómo responderlos$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Requerimientos y cómo responderlos$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'q-SAATlgzdQ') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=q-SAATlgzdQ","provider":"youtube","videoId":"q-SAATlgzdQ","title":"Subsanar y responder requerimientos.","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Modificaciones y renovaciones
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Modificaciones y renovaciones$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Modificaciones y renovaciones$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '0ea3MUoaeuc') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=0ea3MUoaeuc","provider":"youtube","videoId":"0ea3MUoaeuc","title":"Webinar: Módulo de modificaciones","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Farmacovigilancia y poscomercialización
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Farmacovigilancia y poscomercialización$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Farmacovigilancia y poscomercialización$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '9dEGNB5MlsA') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=9dEGNB5MlsA","provider":"youtube","videoId":"9dEGNB5MlsA","title":"Capacitación Farmacovigilancia","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Publicidad, visitas y sanciones
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Publicidad, visitas y sanciones$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Publicidad, visitas y sanciones$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '_xzXiFf-urk') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=_xzXiFf-urk","provider":"youtube","videoId":"_xzXiFf-urk","title":"#Entérate de todo lo que debes saber sobre la publicidad de 💊 medicamentos de venta libre☝️","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;
  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos curados para clases sin video (174).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Videos de %: % clases.', $t$Asuntos Regulatorios Sanitarios ante INVIMA$t$, v_n;
END $curso$;

DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Validaciones y Calificaciones en la Industria Farmacéutica$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Validaciones y Calificaciones en la Industria Farmacéutica$t$;
    RETURN;
  END IF;

  -- El enfoque de ciclo de vida y el Plan Maestro
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$El enfoque de ciclo de vida y el Plan Maestro$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$El enfoque de ciclo de vida y el Plan Maestro$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'DVBN_Gft3uI') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=DVBN_Gft3uI","provider":"youtube","videoId":"DVBN_Gft3uI","title":"Plan Maestro de Validación","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Validación de métodos analíticos
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Validación de métodos analíticos$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Validación de métodos analíticos$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'HwLpG1YL7UY') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HwLpG1YL7UY","provider":"youtube","videoId":"HwLpG1YL7UY","title":"Validación de Métodos Analíticos","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;
  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos curados para clases sin video (174).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Videos de %: % clases.', $t$Validaciones y Calificaciones en la Industria Farmacéutica$t$, v_n;
END $curso$;

DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Curso de Gestión de Calidad Farmacéutica$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Curso de Gestión de Calidad Farmacéutica$t$;
    RETURN;
  END IF;

  -- Métricas de calidad farmacéutica: lotes rechazados, quejas, desviaciones y CAPA
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Métricas de calidad farmacéutica: lotes rechazados, quejas, desviaciones y CAPA$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Métricas de calidad farmacéutica: lotes rechazados, quejas, desviaciones y CAPA$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ssFIvywjmZs') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=ssFIvywjmZs","provider":"youtube","videoId":"ssFIvywjmZs","title":"Manejo de Desviaciones","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;
  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos curados para clases sin video (174).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Videos de %: % clases.', $t$Curso de Gestión de Calidad Farmacéutica$t$, v_n;
END $curso$;

DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Curso de Aseguramiento de la Calidad Farmacéutica$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Curso de Aseguramiento de la Calidad Farmacéutica$t$;
    RETURN;
  END IF;

  -- QA dentro del Sistema de Calidad Farmacéutico (ICH Q10)
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$QA dentro del Sistema de Calidad Farmacéutico (ICH Q10)$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$QA dentro del Sistema de Calidad Farmacéutico (ICH Q10)$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'fz1Ljvf8aoY') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=fz1Ljvf8aoY","provider":"youtube","videoId":"fz1Ljvf8aoY","title":"ICH Q10 Pharmaceutical Quality System PQS","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;
  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos curados para clases sin video (174).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Videos de %: % clases.', $t$Curso de Aseguramiento de la Calidad Farmacéutica$t$, v_n;
END $curso$;

DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Curso de Control de Calidad de Medicamentos$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Curso de Control de Calidad de Medicamentos$t$;
    RETURN;
  END IF;

  -- Resolución 3619 de 2013: BPL para laboratorios de control de calidad
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Resolución 3619 de 2013: BPL para laboratorios de control de calidad$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Resolución 3619 de 2013: BPL para laboratorios de control de calidad$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '6E6Yz_GOPc8') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=6E6Yz_GOPc8","provider":"youtube","videoId":"6E6Yz_GOPc8","title":"Laboratorio de Control de Calidad, Buenas Prácticas de Fabricación de Dispositivos Médicos","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Establecimiento de especificaciones (ICH Q6A)
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Establecimiento de especificaciones (ICH Q6A)$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Establecimiento de especificaciones (ICH Q6A)$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'Ov9SHN1jGzc') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=Ov9SHN1jGzc","provider":"youtube","videoId":"Ov9SHN1jGzc","title":"ICH Q6 Explained: Specifications, Q6A vs. Q6B, and the Q6(R1) Update","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Zona climática IVb, normativa colombiana y vida útil
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Zona climática IVb, normativa colombiana y vida útil$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Zona climática IVb, normativa colombiana y vida útil$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'HFCtUib-hSI') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACION FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;
  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos curados para clases sin video (174).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Videos de %: % clases.', $t$Curso de Control de Calidad de Medicamentos$t$, v_n;
END $curso$;

DO $curso$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data  JSONB;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Curso de Buenas Prácticas de Manufactura — BPM$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Curso de Buenas Prácticas de Manufactura — BPM$t$;
    RETURN;
  END IF;

  -- Resolución 1160 de 2016: manuales y guías de inspección
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Resolución 1160 de 2016: manuales y guías de inspección$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Resolución 1160 de 2016: manuales y guías de inspección$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'UXasLRL4dNo') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=UXasLRL4dNo","provider":"youtube","videoId":"UXasLRL4dNo","title":"Guía inspección BPM - Digemid - Perú","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Diseño de instalaciones: flujos, esclusas y acabados sanitarios
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Diseño de instalaciones: flujos, esclusas y acabados sanitarios$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Diseño de instalaciones: flujos, esclusas y acabados sanitarios$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '6qtIq5eqV5U') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=6qtIq5eqV5U","provider":"youtube","videoId":"6qtIq5eqV5U","title":"Gestión de las BPM - 8 - Instalaciones","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Sistemas HVAC: presiones diferenciales, filtración y renovaciones de aire
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Sistemas HVAC: presiones diferenciales, filtración y renovaciones de aire$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Sistemas HVAC: presiones diferenciales, filtración y renovaciones de aire$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'PeCSt7uSu5E') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=PeCSt7uSu5E","provider":"youtube","videoId":"PeCSt7uSu5E","title":"𝐂𝐡𝐚𝐫𝐥𝐚: Balance de Caudales y presiones diferenciales en Laboratorios | 𝐈𝐧𝐠. 𝐌𝐚𝐧𝐮𝐞𝐥 𝐀𝐳𝐚𝐡𝐮𝐚𝐧𝐜𝐡𝐞 𝐀𝐬𝐦𝐚𝐭","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Clasificación de áreas limpias: ISO 14644 y grados OMS/GMP
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Clasificación de áreas limpias: ISO 14644 y grados OMS/GMP$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Clasificación de áreas limpias: ISO 14644 y grados OMS/GMP$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'DhR5I6iwnV4') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=DhR5I6iwnV4","provider":"youtube","videoId":"DhR5I6iwnV4","title":"Cleanrooms: Classification, GMP Standards, Grades A B C D, ISO 14644 in Pharma Industry ","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;

  -- Grados A-D, monitoreo ambiental y estrategia de control de la contaminación (CCS)
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Grados A-D, monitoreo ambiental y estrategia de control de la contaminación (CCS)$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Grados A-D, monitoreo ambiental y estrategia de control de la contaminación (CCS)$t$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'z-f-UCThi0o') THEN
    v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=z-f-UCThi0o","provider":"youtube","videoId":"z-f-UCThi0o","title":"WEBINAR - Monitoreo Ambiental en Áreas Limpias: Guía de Cumplimiento Normativo","transcriptHtml":""}$j$::jsonb;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
    v_n := v_n + 1;
  END IF;
  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos curados para clases sin video (174).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
  RAISE NOTICE 'Videos de %: % clases.', $t$Curso de Buenas Prácticas de Manufactura — BPM$t$, v_n;
END $curso$;

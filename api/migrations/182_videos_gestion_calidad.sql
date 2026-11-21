-- ============================================================
--  182_videos_gestion_calidad.sql — Videos de las clases: Curso de Gestión de Calidad Farmacéutica
--
--  Generado por scripts/generar-migracion-videos.mjs desde
--  contenido/videos/gestion-calidad.mjs. No editar a mano.
--
--  Videos verificados con el oEmbed oficial de YouTube (canal y
--  disponibilidad). Idempotente: no duplica videos, nunca deja una clase
--  sin video y, si hubo cambios, aprueba una versión nueva del curso.
-- ============================================================

DO $videos$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_n     INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Curso de Gestión de Calidad Farmacéutica$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Curso de Gestión de Calidad Farmacéutica$t$;
    RETURN;
  END IF;

  -- Evolución histórica de la calidad: de la inspección a la gestión total
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Evolución histórica de la calidad: de la inspección a la gestión total$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Evolución histórica de la calidad: de la inspección a la gestión total$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'zglr9ngYYjs') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=zglr9ngYYjs","provider":"youtube","videoId":"zglr9ngYYjs","title":"Historia de la calidad: evolución y etapas (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ZpOraNGnh6E')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'ZpOraNGnh6E') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ZpOraNGnh6E';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Vocabulario esencial del SGC: requisito, conformidad, proceso, eficacia, eficiencia
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Vocabulario esencial del SGC: requisito, conformidad, proceso, eficacia, eficiencia$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Vocabulario esencial del SGC: requisito, conformidad, proceso, eficacia, eficiencia$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'c0UCt35OR64') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=c0UCt35OR64","provider":"youtube","videoId":"c0UCt35OR64","title":"ISO 9000 e ISO 9001 versión 2015: generalidades (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Cambios con impacto en la calidad y su trámite ante el INVIMA
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Cambios con impacto en la calidad y su trámite ante el INVIMA$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Cambios con impacto en la calidad y su trámite ante el INVIMA$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'kMhjktRya9w') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación del INVIMA: trámite de registro sanitario de medicamentos","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '7abeO2M6oAY') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=7abeO2M6oAY","provider":"youtube","videoId":"7abeO2M6oAY","title":"ISO 9001:2015: planificación de los cambios (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Introducción a la unidad: modelos de SGC aplicables al sector farmacéutico
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Introducción a la unidad: modelos de SGC aplicables al sector farmacéutico$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Introducción a la unidad: modelos de SGC aplicables al sector farmacéutico$t$;
  ELSE
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ypevMm8fT0Y')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'ypevMm8fT0Y') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ypevMm8fT0Y';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Modelo ICH Q10: objetivos, ciclo de vida y responsabilidad de la dirección
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Modelo ICH Q10: objetivos, ciclo de vida y responsabilidad de la dirección$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Modelo ICH Q10: objetivos, ciclo de vida y responsabilidad de la dirección$t$;
  ELSE
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'OE9r-pXS3tE')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'OE9r-pXS3tE') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'OE9r-pXS3tE';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb($t$ICH Q10: el sistema de calidad farmacéutico (en inglés, con subtítulos automáticos)$t$::text)), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ypevMm8fT0Y' AND data->>'title' IS DISTINCT FROM $t$ICH Q10: el sistema de calidad farmacéutico (en inglés, con subtítulos automáticos)$t$;
    IF FOUND THEN v_n := v_n + 1; END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Habilitadores del PQS: gestión del conocimiento y gestión de riesgos de calidad
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Habilitadores del PQS: gestión del conocimiento y gestión de riesgos de calidad$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Habilitadores del PQS: gestión del conocimiento y gestión de riesgos de calidad$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'C3zSq3I3Zl4') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=C3zSq3I3Zl4","provider":"youtube","videoId":"C3zSq3I3Zl4","title":"El proceso de gestión del riesgo según ISO 31000 (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'oaZS5p_tXfE')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'oaZS5p_tXfE') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'oaZS5p_tXfE';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Los cuatro elementos del PQS y su equivalente en las BPM europeas/PIC/S
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Los cuatro elementos del PQS y su equivalente en las BPM europeas/PIC/S$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Los cuatro elementos del PQS y su equivalente en las BPM europeas/PIC/S$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'YxPAoagpfh0') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=YxPAoagpfh0","provider":"youtube","videoId":"YxPAoagpfh0","title":"Webinar: gestión eficiente del control de cambios en la industria farmacéutica","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ypevMm8fT0Y') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=ypevMm8fT0Y","provider":"youtube","videoId":"ypevMm8fT0Y","title":"ICH Q10: el sistema de calidad farmacéutico (en inglés, con subtítulos automáticos)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Estructura de alto nivel de ISO 9001:2015, contexto y partes interesadas
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Estructura de alto nivel de ISO 9001:2015, contexto y partes interesadas$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Estructura de alto nivel de ISO 9001:2015, contexto y partes interesadas$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'gKveWCovbF8') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=gKveWCovbF8","provider":"youtube","videoId":"gKveWCovbF8","title":"Norma ISO 9001:2015, capítulo 4: contexto de la organización (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'YsTWXI5rnP8')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'YsTWXI5rnP8') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'YsTWXI5rnP8';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Pensamiento basado en riesgos: riesgos y oportunidades en el SGC
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Pensamiento basado en riesgos: riesgos y oportunidades en el SGC$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Pensamiento basado en riesgos: riesgos y oportunidades en el SGC$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '8iPGlicbaPA') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=8iPGlicbaPA","provider":"youtube","videoId":"8iPGlicbaPA","title":"Matriz de riesgo (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'i0b_gzANRD8')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'i0b_gzANRD8') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'i0b_gzANRD8';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- ICH Q10 vs. ISO 9001 vs. BPM: comparación e integración
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$ICH Q10 vs. ISO 9001 vs. BPM: comparación e integración$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$ICH Q10 vs. ISO 9001 vs. BPM: comparación e integración$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'c0UCt35OR64') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=c0UCt35OR64","provider":"youtube","videoId":"c0UCt35OR64","title":"ISO 9000 e ISO 9001 versión 2015: generalidades (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb($t$ICH Q10: el sistema de calidad farmacéutico (en inglés, con subtítulos automáticos)$t$::text)), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ypevMm8fT0Y' AND data->>'title' IS DISTINCT FROM $t$ICH Q10: el sistema de calidad farmacéutico (en inglés, con subtítulos automáticos)$t$;
    IF FOUND THEN v_n := v_n + 1; END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Enfoque basado en procesos: entradas, salidas, interacciones y dueños
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Enfoque basado en procesos: entradas, salidas, interacciones y dueños$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Enfoque basado en procesos: entradas, salidas, interacciones y dueños$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'fRJ5zxVvqeA') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=fRJ5zxVvqeA","provider":"youtube","videoId":"fRJ5zxVvqeA","title":"Planificación de recursos por proceso (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Mapa de procesos y caracterización de procesos de un laboratorio farmacéutico
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Mapa de procesos y caracterización de procesos de un laboratorio farmacéutico$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Mapa de procesos y caracterización de procesos de un laboratorio farmacéutico$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'NFXSk7eXLe4') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=NFXSk7eXLe4","provider":"youtube","videoId":"NFXSk7eXLe4","title":"Qué es un mapa de procesos (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'KGgVqjc8gb8')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'KGgVqjc8gb8') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'KGgVqjc8gb8';
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ntHaV4iy1WQ')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'ntHaV4iy1WQ') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ntHaV4iy1WQ';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Métricas de calidad farmacéutica: lotes rechazados, quejas, desviaciones y CAPA
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Métricas de calidad farmacéutica: lotes rechazados, quejas, desviaciones y CAPA$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Métricas de calidad farmacéutica: lotes rechazados, quejas, desviaciones y CAPA$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'H2Uineu1jSM') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=H2Uineu1jSM","provider":"youtube","videoId":"H2Uineu1jSM","title":"Los indicadores en procesos y funciones farmacéuticas (Universidad de Antioquia)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Revisión por la dirección: entradas, salidas y requisitos (ISO 9001 9.3 e ICH Q10)
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Revisión por la dirección: entradas, salidas y requisitos (ISO 9001 9.3 e ICH Q10)$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Revisión por la dirección: entradas, salidas y requisitos (ISO 9001 9.3 e ICH Q10)$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'JLPZQmXXJTo') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=JLPZQmXXJTo","provider":"youtube","videoId":"JLPZQmXXJTo","title":"Norma ISO 9001:2015, capítulo 9: evaluación del desempeño (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ENXs4hJ2VmY')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'ENXs4hJ2VmY') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'ENXs4hJ2VmY';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Ciclo PHVA aplicado a la planta y al servicio farmacéutico
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Ciclo PHVA aplicado a la planta y al servicio farmacéutico$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Ciclo PHVA aplicado a la planta y al servicio farmacéutico$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'nrGywf90osA') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=nrGywf90osA","provider":"youtube","videoId":"nrGywf90osA","title":"Ciclo PHVA: planear, hacer, verificar y actuar (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'iv91_2N6VDA')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'iv91_2N6VDA') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'iv91_2N6VDA';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Herramientas de mejora: Kaizen, Lean y mejora del desempeño del proceso (ICH Q10)
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Herramientas de mejora: Kaizen, Lean y mejora del desempeño del proceso (ICH Q10)$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Herramientas de mejora: Kaizen, Lean y mejora del desempeño del proceso (ICH Q10)$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'HkVRGdb0814') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HkVRGdb0814","provider":"youtube","videoId":"HkVRGdb0814","title":"Principios de la metodología Kaizen (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '-KrytCpPCfA') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=-KrytCpPCfA","provider":"youtube","videoId":"-KrytCpPCfA","title":"Qué es Lean Manufacturing (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 's4weEa6zbSw')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 's4weEa6zbSw') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 's4weEa6zbSw';
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '0kk0IinUQwU')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> '0kk0IinUQwU') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '0kk0IinUQwU';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Sistema de gestión del cambio según ICH Q10: evaluación, aprobación, implementación y verificación
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Sistema de gestión del cambio según ICH Q10: evaluación, aprobación, implementación y verificación$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Sistema de gestión del cambio según ICH Q10: evaluación, aprobación, implementación y verificación$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '7abeO2M6oAY') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=7abeO2M6oAY","provider":"youtube","videoId":"7abeO2M6oAY","title":"ISO 9001:2015: planificación de los cambios (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'Yk7JeLfEYoc')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'Yk7JeLfEYoc') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'Yk7JeLfEYoc';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Clasificación de cambios e impacto regulatorio: ICH Q12 y guía de modificaciones INVIMA
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Clasificación de cambios e impacto regulatorio: ICH Q12 y guía de modificaciones INVIMA$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Clasificación de cambios e impacto regulatorio: ICH Q12 y guía de modificaciones INVIMA$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'YxPAoagpfh0') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=YxPAoagpfh0","provider":"youtube","videoId":"YxPAoagpfh0","title":"Webinar: gestión eficiente del control de cambios en la industria farmacéutica","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb($t$Clasificación de cambios: menores, moderados y mayores (en inglés, con subtítulos automáticos)$t$::text)), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'GK-PMJ6auyI' AND data->>'title' IS DISTINCT FROM $t$Clasificación de cambios: menores, moderados y mayores (en inglés, con subtítulos automáticos)$t$;
    IF FOUND THEN v_n := v_n + 1; END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Cultura de calidad: liderazgo, comportamiento y medición
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Cultura de calidad: liderazgo, comportamiento y medición$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Cultura de calidad: liderazgo, comportamiento y medición$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'C2u55oziHZg') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=C2u55oziHZg","provider":"youtube","videoId":"C2u55oziHZg","title":"Calidad total y mejora continua en la gerencia (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'OIGsWwMdl0I')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'OIGsWwMdl0I') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'OIGsWwMdl0I';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Hoja de ruta para implementar o fortalecer un SGC farmacéutico
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Hoja de ruta para implementar o fortalecer un SGC farmacéutico$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Hoja de ruta para implementar o fortalecer un SGC farmacéutico$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '_e79cMwEFXw') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=_e79cMwEFXw","provider":"youtube","videoId":"_e79cMwEFXw","title":"Cómo diseñar un sistema de gestión de la calidad (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'BKZ1PhzGvO0')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'BKZ1PhzGvO0') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'BKZ1PhzGvO0';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos de las clases ajustados (182_videos_gestion_calidad.sql).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;

  RAISE NOTICE 'Videos de %: % cambios.', $t$Curso de Gestión de Calidad Farmacéutica$t$, v_n;
END $videos$;

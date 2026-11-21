-- ============================================================
--  186_videos_auditoria.sql — Videos de las clases: Curso de Auditoría de Calidad Farmacéutica
--
--  Generado por scripts/generar-migracion-videos.mjs desde
--  contenido/videos/auditoria.mjs. No editar a mano.
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
  SELECT id INTO v_curso FROM aula_courses WHERE kind = 'edvanta' AND title = $t$Curso de Auditoría de Calidad Farmacéutica$t$ AND deleted_at IS NULL ORDER BY id LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'Videos: no existe el curso %. Se salta.', $t$Curso de Auditoría de Calidad Farmacéutica$t$;
    RETURN;
  END IF;

  -- Introducción al curso: la auditoría como herramienta de calidad farmacéutica
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Introducción al curso: la auditoría como herramienta de calidad farmacéutica$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Introducción al curso: la auditoría como herramienta de calidad farmacéutica$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '0o6VA0wAGds') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=0o6VA0wAGds","provider":"youtube","videoId":"0o6VA0wAGds","title":"Origen y evolución de la auditoría (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '_YiQP5Pvczo')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> '_YiQP5Pvczo') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '_YiQP5Pvczo';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Definiciones clave y los siete principios de auditoría
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Definiciones clave y los siete principios de auditoría$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Definiciones clave y los siete principios de auditoría$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'iHEuIm1UO6E') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=iHEuIm1UO6E","provider":"youtube","videoId":"iHEuIm1UO6E","title":"Principios de auditoría según ISO 19011 (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'jWULQNeRsKA') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=jWULQNeRsKA","provider":"youtube","videoId":"jWULQNeRsKA","title":"Conceptos importantes de la auditoría (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'o9WP0VP0hTc')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'o9WP0VP0hTc') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'o9WP0VP0hTc';
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'w0Rx5tMgl3o')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'w0Rx5tMgl3o') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'w0Rx5tMgl3o';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Tipos de auditoría: primera, segunda y tercera parte, autoinspección e inspección regulatoria
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Tipos de auditoría: primera, segunda y tercera parte, autoinspección e inspección regulatoria$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Tipos de auditoría: primera, segunda y tercera parte, autoinspección e inspección regulatoria$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'qD_YyI6l3TM') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=qD_YyI6l3TM","provider":"youtube","videoId":"qD_YyI6l3TM","title":"Generalidades de la auditoría (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'izDKCtdOhgc')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'izDKCtdOhgc') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'izDKCtdOhgc';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Resoluciones 1160 de 2016 y 3619 de 2013 como criterios de auditoría
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Resoluciones 1160 de 2016 y 3619 de 2013 como criterios de auditoría$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Resoluciones 1160 de 2016 y 3619 de 2013 como criterios de auditoría$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'obKw0fE-15g') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=obKw0fE-15g","provider":"youtube","videoId":"obKw0fE-15g","title":"Introducción a las buenas prácticas de manufactura en la industria farmacéutica (Educación Continua Uniandes)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- La inspección INVIMA: certificaciones, actas y medidas sanitarias
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$La inspección INVIMA: certificaciones, actas y medidas sanitarias$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$La inspección INVIMA: certificaciones, actas y medidas sanitarias$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'MOjuGSvHDd8') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=MOjuGSvHDd8","provider":"youtube","videoId":"MOjuGSvHDd8","title":"Sistema Nacional de Inspección, Vigilancia y Control y alcance de las visitas (Ministerio de Salud)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Introducción a la unidad: del auditor individual al programa de auditoría
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Introducción a la unidad: del auditor individual al programa de auditoría$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Introducción a la unidad: del auditor individual al programa de auditoría$t$;
  ELSE
    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb($t$Gestión de un programa de auditoría según ISO 19011 (Edutin Academy)$t$::text)), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'fsNrrApdugw' AND data->>'title' IS DISTINCT FROM $t$Gestión de un programa de auditoría según ISO 19011 (Edutin Academy)$t$;
    IF FOUND THEN v_n := v_n + 1; END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Auditoría basada en riesgos: priorización de áreas, procesos y proveedores
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Auditoría basada en riesgos: priorización de áreas, procesos y proveedores$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Auditoría basada en riesgos: priorización de áreas, procesos y proveedores$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '8iPGlicbaPA') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=8iPGlicbaPA","provider":"youtube","videoId":"8iPGlicbaPA","title":"Matriz de riesgo (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Competencias, selección y evaluación de auditores (capítulo 7 ISO 19011)
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Competencias, selección y evaluación de auditores (capítulo 7 ISO 19011)$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Competencias, selección y evaluación de auditores (capítulo 7 ISO 19011)$t$;
  ELSE
    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb($t$Competencia y evaluación de los auditores según ISO 19011 (QMC Training)$t$::text)), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'Uymfz0ojbKw' AND data->>'title' IS DISTINCT FROM $t$Competencia y evaluación de los auditores según ISO 19011 (QMC Training)$t$;
    IF FOUND THEN v_n := v_n + 1; END IF;
    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb($t$Competencias del auditor líder y de los auditores internos (Universidad ISO)$t$::text)), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'SXbR3vSx4is' AND data->>'title' IS DISTINCT FROM $t$Competencias del auditor líder y de los auditores internos (Universidad ISO)$t$;
    IF FOUND THEN v_n := v_n + 1; END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Ética, comunicación y comportamiento del auditor en campo
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Ética, comunicación y comportamiento del auditor en campo$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Ética, comunicación y comportamiento del auditor en campo$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'iHEuIm1UO6E') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=iHEuIm1UO6E","provider":"youtube","videoId":"iHEuIm1UO6E","title":"Principios de auditoría: integridad, confidencialidad e independencia (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '75CcxVxIG-c')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> '75CcxVxIG-c') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '75CcxVxIG-c';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Introducción a la unidad: el ciclo de una auditoría individual
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Introducción a la unidad: el ciclo de una auditoría individual$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Introducción a la unidad: el ciclo de una auditoría individual$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'CSa1FCiEHjE') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=CSa1FCiEHjE","provider":"youtube","videoId":"CSa1FCiEHjE","title":"Pasos iniciales para realizar una auditoría (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '85hSWGF-v0I')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> '85hSWGF-v0I') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '85hSWGF-v0I';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Listas de verificación basadas en las guías de inspección INVIMA
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Listas de verificación basadas en las guías de inspección INVIMA$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Listas de verificación basadas en las guías de inspección INVIMA$t$;
  ELSE
    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb($t$Guía para hacer una lista de verificación de auditoría (ISO Tv Intercontinental)$t$::text)), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'aYO77Zm7AxA' AND data->>'title' IS DISTINCT FROM $t$Guía para hacer una lista de verificación de auditoría (ISO Tv Intercontinental)$t$;
    IF FOUND THEN v_n := v_n + 1; END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- La reunión de apertura
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$La reunión de apertura$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$La reunión de apertura$t$;
  ELSE
    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb($t$Cómo hacer la reunión de apertura de una auditoría (ISO Tv Intercontinental)$t$::text)), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '4f9XFzj6Vy0' AND data->>'title' IS DISTINCT FROM $t$Cómo hacer la reunión de apertura de una auditoría (ISO Tv Intercontinental)$t$;
    IF FOUND THEN v_n := v_n + 1; END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Técnicas de entrevista y recolección de evidencia objetiva
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Técnicas de entrevista y recolección de evidencia objetiva$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Técnicas de entrevista y recolección de evidencia objetiva$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'HzsNkvCFbN4') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HzsNkvCFbN4","provider":"youtube","videoId":"HzsNkvCFbN4","title":"Métodos de auditoría (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'G41qM6d0iCk')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'G41qM6d0iCk') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'G41qM6d0iCk';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Recorrido de planta y técnicas de muestreo
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Recorrido de planta y técnicas de muestreo$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Recorrido de planta y técnicas de muestreo$t$;
  ELSE
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '8ZXpr0tEoOk')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> '8ZXpr0tEoOk') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '8ZXpr0tEoOk';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Auditoría a proveedores y fabricantes por contrato
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Auditoría a proveedores y fabricantes por contrato$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Auditoría a proveedores y fabricantes por contrato$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'myE3Hy2Ti2U') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=myE3Hy2Ti2U","provider":"youtube","videoId":"myE3Hy2Ti2U","title":"Homologación de proveedores y auditorías de segunda parte (SGS Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'sBZgU1RlQX8') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=sBZgU1RlQX8","provider":"youtube","videoId":"sBZgU1RlQX8","title":"Evaluación de proveedores (SENA)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'Xkg4bmOdsVk')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'Xkg4bmOdsVk') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'Xkg4bmOdsVk';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Auditorías remotas e híbridas
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Auditorías remotas e híbridas$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Auditorías remotas e híbridas$t$;
  ELSE
    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb($t$Cómo hacer una auditoría remota o virtual (ISO Tv Intercontinental)$t$::text)), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '2mky8XkL6d8' AND data->>'title' IS DISTINCT FROM $t$Cómo hacer una auditoría remota o virtual (ISO Tv Intercontinental)$t$;
    IF FOUND THEN v_n := v_n + 1; END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Introducción a la unidad: de la evidencia a la mejora
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Introducción a la unidad: de la evidencia a la mejora$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Introducción a la unidad: de la evidencia a la mejora$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'jWULQNeRsKA') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=jWULQNeRsKA","provider":"youtube","videoId":"jWULQNeRsKA","title":"Conceptos de auditoría: criterios, evidencias, hallazgos y conclusiones (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Redacción de hallazgos: no conformidad, observación y oportunidad de mejora
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Redacción de hallazgos: no conformidad, observación y oportunidad de mejora$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Redacción de hallazgos: no conformidad, observación y oportunidad de mejora$t$;
  ELSE
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '6TqjN7rkHgo')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> '6TqjN7rkHgo') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '6TqjN7rkHgo';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks SET data = jsonb_set(data, '{title}', to_jsonb($t$Redacción de hallazgos en una auditoría interna (ISO Tv Intercontinental)$t$::text)), updated_at = NOW()
     WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '7IuLaADtscs' AND data->>'title' IS DISTINCT FROM $t$Redacción de hallazgos en una auditoría interna (ISO Tv Intercontinental)$t$;
    IF FOUND THEN v_n := v_n + 1; END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Clasificación de hallazgos: crítico, mayor y menor
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Clasificación de hallazgos: crítico, mayor y menor$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Clasificación de hallazgos: crítico, mayor y menor$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '8izGVRyD__Q') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=8izGVRyD__Q","provider":"youtube","videoId":"8izGVRyD__Q","title":"Qué es un hallazgo de auditoría y cómo se clasifica (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- La reunión de cierre
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$La reunión de cierre$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$La reunión de cierre$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'L0s4-569vmc') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=L0s4-569vmc","provider":"youtube","videoId":"L0s4-569vmc","title":"Proceso para realizar el cierre de una auditoría (Edutin Academy)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'Wop9Sk7zXnk')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'Wop9Sk7zXnk') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'Wop9Sk7zXnk';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Elaboración y distribución del informe de auditoría
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Elaboración y distribución del informe de auditoría$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Elaboración y distribución del informe de auditoría$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'FQ5vfn2i0K8') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=FQ5vfn2i0K8","provider":"youtube","videoId":"FQ5vfn2i0K8","title":"Redacción de informes de auditoría (Auditool)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Seguimiento y cierre de hallazgos: evaluación de planes de acción y verificación de eficacia
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Seguimiento y cierre de hallazgos: evaluación de planes de acción y verificación de eficacia$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Seguimiento y cierre de hallazgos: evaluación de planes de acción y verificación de eficacia$t$;
  ELSE
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'l3Na7s6y6Js')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'l3Na7s6y6Js') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'l3Na7s6y6Js';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Evaluación y mejora del programa de auditoría
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Evaluación y mejora del programa de auditoría$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Evaluación y mejora del programa de auditoría$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'JLPZQmXXJTo') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=JLPZQmXXJTo","provider":"youtube","videoId":"JLPZQmXXJTo","title":"ISO 9001, capítulo 9: evaluación del desempeño y auditoría interna (Edutin Academy, edición 2015)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Auditoría al servicio farmacéutico hospitalario y ambulatorio
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Auditoría al servicio farmacéutico hospitalario y ambulatorio$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Auditoría al servicio farmacéutico hospitalario y ambulatorio$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'cx5ShUygdwY') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=cx5ShUygdwY","provider":"youtube","videoId":"cx5ShUygdwY","title":"Para qué sirve el PAMEC en las instituciones de salud (Asesorías en Habilitación)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'tLsUIOW8xNw')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'tLsUIOW8xNw') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'tLsUIOW8xNw';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Auditoría e inspección a droguerías y establecimientos farmacéuticos minoristas
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Auditoría e inspección a droguerías y establecimientos farmacéuticos minoristas$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Auditoría e inspección a droguerías y establecimientos farmacéuticos minoristas$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'E4EVxBfn7BI') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=E4EVxBfn7BI","provider":"youtube","videoId":"E4EVxBfn7BI","title":"La auditoría interna obligatoria en farmacias y droguerías (Escuela Latinoamericana de Farmacia)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'VGp1zBEAX8U')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'VGp1zBEAX8U') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'VGp1zBEAX8U';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Preparación previa: autoinspección integral y alistamiento documental
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Preparación previa: autoinspección integral y alistamiento documental$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Preparación previa: autoinspección integral y alistamiento documental$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '5aJjfeYu57w') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=5aJjfeYu57w","provider":"youtube","videoId":"5aJjfeYu57w","title":"Estrategias para preparar y responder auditorías en un laboratorio farmacéutico (Iniciativas Empresariales)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '7baR8uBHg20')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> '7baR8uBHg20') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '7baR8uBHg20';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Durante y después de la visita: atención al inspector, acta y plan de mejoramiento
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Durante y después de la visita: atención al inspector, acta y plan de mejoramiento$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Durante y después de la visita: atención al inspector, acta y plan de mejoramiento$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'WXm8nvVkGJs') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=WXm8nvVkGJs","provider":"youtube","videoId":"WXm8nvVkGJs","title":"Cómo afrontar auditorías e inspecciones de BPM","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'z-ODA5Ocy-0') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=z-ODA5Ocy-0","provider":"youtube","videoId":"z-ODA5Ocy-0","title":"Prepárate para la visita de la secretaría de salud (Club del Droguista)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'vzuTP6NltUg')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'vzuTP6NltUg') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'vzuTP6NltUg';
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '3qhZgh30M2Y')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> '3qhZgh30M2Y') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '3qhZgh30M2Y';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  -- Caso integrador: simulacro de inspección BPM
  SELECT id INTO v_clase FROM aula_lessons WHERE course_id = v_curso AND deleted_at IS NULL AND title = $t$Caso integrador: simulacro de inspección BPM$t$ ORDER BY id LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Videos: no está la clase %. Se salta.', $t$Caso integrador: simulacro de inspección BPM$t$;
  ELSE
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'UXasLRL4dNo') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=UXasLRL4dNo","provider":"youtube","videoId":"UXasLRL4dNo","title":"Recorrido por una guía de inspección de BPM (Digemid, Perú)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = '8VJRnMtloNE') THEN
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, $j${"source":"enlace","url":"https://www.youtube.com/watch?v=8VJRnMtloNE","provider":"youtube","videoId":"8VJRnMtloNE","title":"Simulacro de visita de inspección sanitaria (Club del Droguista)","transcriptHtml":""}$j$::jsonb);
      v_n := v_n + 1;
    END IF;
    IF EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'Mu_S9AcLpvs')
       AND (SELECT count(*) FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' <> 'Mu_S9AcLpvs') > 0 THEN
      UPDATE aula_lesson_blocks SET deleted_at = NOW(), updated_at = NOW() WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL AND data->>'videoId' = 'Mu_S9AcLpvs';
      v_n := v_n + 1;
    END IF;
    UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
      FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
              FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
     WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
  END IF;

  IF v_n > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', 'Videos de las clases ajustados (186_videos_auditoria.sql).'
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;

  RAISE NOTICE 'Videos de %: % cambios.', $t$Curso de Auditoría de Calidad Farmacéutica$t$, v_n;
END $videos$;

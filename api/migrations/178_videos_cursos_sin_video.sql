-- ============================================================
--  178_videos_cursos_sin_video.sql
--
--  Ocho cursos no tenían ningún video. Para cada unidad se eligió un
--  video verificado con oEmbed, de un canal educativo o institucional, y
--  se insertó en las clases de la unidad que siguen sin video. Es un
--  video de unidad: la clase completa está en el texto.
--
--  Generado por scripts/videos-cursos-sin-video.mjs.
-- ============================================================

DO $video$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_data JSONB;
  v_n INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses WHERE title = $t$Curso de Asuntos Regulatorios Farmacéuticos en Colombia$t$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NOT NULL THEN

  -- Curso de Asuntos Regulatorios Farmacéuticos en Colombia :: Unidad 1. Fundamentos de los asuntos regulatorios y rol del Químico Farmacéutico
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 69 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=isHsjEdza8s","provider":"youtube","videoId":"isHsjEdza8s","title":"Introducción en Asuntos Regulatorios","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Asuntos Regulatorios Farmacéuticos en Colombia :: Unidad 2. Sistema sanitario y autoridades regulatorias
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 70 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Asuntos Regulatorios Farmacéuticos en Colombia :: Unidad 3. Marco normativo y categorías de productos
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 71 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Asuntos Regulatorios Farmacéuticos en Colombia :: Unidad 4. Ciclo de vida regulatorio, publicidad, precios y farmacovigilancia
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 72 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HqufYX6eyWg","provider":"youtube","videoId":"HqufYX6eyWg","title":"Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Asuntos Regulatorios Farmacéuticos en Colombia :: Unidad 5. Armonización internacional, estrategia e inteligencia regulatoria
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 73 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=-O-N_1Fo74M","provider":"youtube","videoId":"-O-N_1Fo74M","title":"Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;
  END IF;
  SELECT id INTO v_curso FROM aula_courses WHERE title = $t$Curso de Bioequivalencia y Requisitos Regulatorios en Colombia$t$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NOT NULL THEN

  -- Curso de Bioequivalencia y Requisitos Regulatorios en Colombia :: Unidad 1. Fundamentos de biodisponibilidad, bioequivalencia e intercambiabilidad
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 109 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=1_FzqoNZRvQ","provider":"youtube","videoId":"1_FzqoNZRvQ","title":"Webinar: Bioequivalencia e intercambiabilidad de medicamentos","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Bioequivalencia y Requisitos Regulatorios en Colombia :: Unidad 2. Marco regulatorio colombiano de BD/BE
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 110 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=vSXTyNrdwUg","provider":"youtube","videoId":"vSXTyNrdwUg","title":"Medicamentos genéricos, bioequivalencia e intercambiabilidad","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Bioequivalencia y Requisitos Regulatorios en Colombia :: Unidad 3. Referentes internacionales y diseño de estudios de BE
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 111 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=vSOfRJLf8ow","provider":"youtube","videoId":"vSOfRJLf8ow","title":"Análisis del estudio de bioequivalencia","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Bioequivalencia y Requisitos Regulatorios en Colombia :: Unidad 4. Bioexenciones y perfiles de disolución
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 112 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=QnCw5CkkKbc","provider":"youtube","videoId":"QnCw5CkkKbc","title":"Medicamentos de calidad y la bioequivalencia","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Bioequivalencia y Requisitos Regulatorios en Colombia :: Unidad 5. Presentación de estudios al INVIMA y requerimientos
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 113 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=1_FzqoNZRvQ","provider":"youtube","videoId":"1_FzqoNZRvQ","title":"Webinar: Bioequivalencia e intercambiabilidad de medicamentos","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;
  END IF;
  SELECT id INTO v_curso FROM aula_courses WHERE title = $t$Curso de Registro Sanitario de Productos Fitoterapéuticos$t$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NOT NULL THEN

  -- Curso de Registro Sanitario de Productos Fitoterapéuticos :: Unidad 1. Marco normativo, definiciones y clasificación de los productos fitoterapéuticos
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 134 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Registro Sanitario de Productos Fitoterapéuticos :: Unidad 2. Plantas medicinales aceptadas y evaluación farmacológica
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 135 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Registro Sanitario de Productos Fitoterapéuticos :: Unidad 3. Evaluación farmacéutica y control de calidad del material vegetal
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 136 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Registro Sanitario de Productos Fitoterapéuticos :: Unidad 4. Trámites ante el INVIMA: registro, renovación y modificaciones
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 137 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HqufYX6eyWg","provider":"youtube","videoId":"HqufYX6eyWg","title":"Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Registro Sanitario de Productos Fitoterapéuticos :: Unidad 5. BPM, etiquetado, publicidad y fitovigilancia
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 138 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=-O-N_1Fo74M","provider":"youtube","videoId":"-O-N_1Fo74M","title":"Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;
  END IF;
  SELECT id INTO v_curso FROM aula_courses WHERE title = $t$Curso de Regulación de Medicamentos Homeopáticos$t$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NOT NULL THEN

  -- Curso de Regulación de Medicamentos Homeopáticos :: Unidad 1. Fundamentos y marco normativo de los medicamentos homeopáticos en Colombia
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 139 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Regulación de Medicamentos Homeopáticos :: Unidad 2. Calidad: farmacopeas, cepas y Buenas Prácticas de Manufactura homeopáticas
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 140 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Regulación de Medicamentos Homeopáticos :: Unidad 3. Registro sanitario de medicamentos homeopáticos
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 141 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Regulación de Medicamentos Homeopáticos :: Unidad 4. Etiquetado, publicidad, farmacias homeopáticas y farmacovigilancia
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 142 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HqufYX6eyWg","provider":"youtube","videoId":"HqufYX6eyWg","title":"Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Regulación de Medicamentos Homeopáticos :: Unidad 5. Contexto internacional, debate científico y comunicación responsable
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 143 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=-O-N_1Fo74M","provider":"youtube","videoId":"-O-N_1Fo74M","title":"Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;
  END IF;
  SELECT id INTO v_curso FROM aula_courses WHERE title = $t$Curso de Regulación Sanitaria de Gases Medicinales$t$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NOT NULL THEN

  -- Curso de Regulación Sanitaria de Gases Medicinales :: Unidad 1. Los gases medicinales como medicamentos
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 159 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=tsft_SiHl1M","provider":"youtube","videoId":"tsft_SiHl1M","title":"Importancia de los gases medicinales","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Regulación Sanitaria de Gases Medicinales :: Unidad 2. Buenas Prácticas de Manufactura y certificación de plantas
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 160 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=Z14rK3m6GOs","provider":"youtube","videoId":"Z14rK3m6GOs","title":"Requerimientos de pruebas y criterios de desempeño de los sistemas de gases medicinales","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Regulación Sanitaria de Gases Medicinales :: Unidad 3. Registro sanitario, estabilidad, envases y trazabilidad
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 161 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Regulación Sanitaria de Gases Medicinales :: Unidad 4. Gases en las IPS, almacenamiento, distribución y transporte
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 162 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=gys6ylzLp0w","provider":"youtube","videoId":"gys6ylzLp0w","title":"Capacitación: manual para el manejo de gases medicinales","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Regulación Sanitaria de Gases Medicinales :: Unidad 5. Pandemia, vigilancia y casos integradores
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 163 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=tsft_SiHl1M","provider":"youtube","videoId":"tsft_SiHl1M","title":"Importancia de los gases medicinales","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;
  END IF;
  SELECT id INTO v_curso FROM aula_courses WHERE title = $t$Curso de Importación de Medicamentos Vitales No Disponibles$t$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NOT NULL THEN

  -- Curso de Importación de Medicamentos Vitales No Disponibles :: Unidad 1. Fundamentos del régimen de Medicamentos Vitales No Disponibles
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 164 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=kMhjktRya9w","provider":"youtube","videoId":"kMhjktRya9w","title":"Capacitación - Trámite de Registro Sanitario de Medicamentos en Invima a un clic","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Importación de Medicamentos Vitales No Disponibles :: Unidad 2. Listado de MVND y papel de la Sala Especializada del INVIMA
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 165 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HFCtUib-hSI","provider":"youtube","videoId":"HFCtUib-hSI","title":"SESIÓN 1. LEGISLACIÓN FARMACÉUTICA COLOMBIA","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Importación de Medicamentos Vitales No Disponibles :: Unidad 3. Modalidades de autorización y trámite de importación
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 166 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=-O-N_1Fo74M","provider":"youtube","videoId":"-O-N_1Fo74M","title":"Entrar al Mercado de Medicamentos en Colombia: guía regulatoria con el INVIMA","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Importación de Medicamentos Vitales No Disponibles :: Unidad 4. Desabastecimiento, enfermedades huérfanas y medicamentos de control especial
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 167 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=HqufYX6eyWg","provider":"youtube","videoId":"HqufYX6eyWg","title":"Modificaciones automáticas de los registros sanitarios de medicamentos de síntesis química","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Importación de Medicamentos Vitales No Disponibles :: Unidad 5. Responsabilidades del importador, farmacovigilancia y caso integrador
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 168 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=isHsjEdza8s","provider":"youtube","videoId":"isHsjEdza8s","title":"Introducción en Asuntos Regulatorios","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;
  END IF;
  SELECT id INTO v_curso FROM aula_courses WHERE title = $t$Curso de Psicofarmacología$t$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NOT NULL THEN

  -- Curso de Psicofarmacología :: Unidad 1. Fundamentos neurobiológicos y marco normativo de la psicofarmacología en Colombia
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 204 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=LuK1BRNzVD4","provider":"youtube","videoId":"LuK1BRNzVD4","title":"Psicofármacos: antidepresivos y ansiolíticos","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Psicofarmacología :: Unidad 2. Antidepresivos
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 205 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=M11EZn1Y9Ng","provider":"youtube","videoId":"M11EZn1Y9Ng","title":"Farmacología del citalopram, la fluoxetina yotros antidepresivos","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Psicofarmacología :: Unidad 3. Ansiolíticos e hipnóticos
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 206 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=LuK1BRNzVD4","provider":"youtube","videoId":"LuK1BRNzVD4","title":"Psicofármacos: antidepresivos y ansiolíticos","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Psicofarmacología :: Unidad 4. Antipsicóticos y estabilizadores del ánimo
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 207 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=M11EZn1Y9Ng","provider":"youtube","videoId":"M11EZn1Y9Ng","title":"Farmacología del citalopram, la fluoxetina y otros antidepresivos","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Psicofarmacología :: Unidad 5. TDAH, adicciones, poblaciones especiales y casos integradores
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 208 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=LuK1BRNzVD4","provider":"youtube","videoId":"LuK1BRNzVD4","title":"Psicofármacos: antidepresivos y ansiolíticos","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;
  END IF;
  SELECT id INTO v_curso FROM aula_courses WHERE title = $t$Curso de Manipulación de Alimentos$t$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NOT NULL THEN

  -- Curso de Manipulación de Alimentos :: Unidad 1. Inocuidad y lo que exige la norma
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 293 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=VMtAqeL9kKE","provider":"youtube","videoId":"VMtAqeL9kKE","title":"Principios de higiene en la manipulación de alimentos","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Manipulación de Alimentos :: Unidad 2. Higiene personal y prácticas higiénicas
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 294 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=aeqWCTYT-qk","provider":"youtube","videoId":"aeqWCTYT-qk","title":"Higiene y manipulación de alimentos, capítulo 4","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Manipulación de Alimentos :: Unidad 3. Las cinco claves y el control de temperaturas
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 295 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=VMtAqeL9kKE","provider":"youtube","videoId":"VMtAqeL9kKE","title":"Principios de higiene en la manipulación de alimentos","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Manipulación de Alimentos :: Unidad 4. Plan de saneamiento
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 296 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=aeqWCTYT-qk","provider":"youtube","videoId":"aeqWCTYT-qk","title":"Higiene y manipulación de alimentos, capítulo 4","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;

  -- Curso de Manipulación de Alimentos :: Unidad 5. Recepción, almacenamiento y registros
  FOR v_clase IN SELECT l.id FROM aula_lessons l WHERE l.course_id = v_curso AND l.module_id = 297 AND l.deleted_at IS NULL ORDER BY l.sort_order, l.id
  LOOP
    IF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND deleted_at IS NULL) THEN
      v_data := $j${"source":"enlace","url":"https://www.youtube.com/watch?v=VMtAqeL9kKE","provider":"youtube","videoId":"VMtAqeL9kKE","title":"Principios de higiene en la manipulación de alimentos","transcriptHtml":""}$j$::jsonb;
      INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data) VALUES (v_clase, 'video', 0, v_data);
      UPDATE aula_lesson_blocks b SET sort_order = o.pos, updated_at = NOW()
        FROM (SELECT id, (row_number() OVER (ORDER BY CASE type WHEN 'video' THEN 0 WHEN 'experiencia' THEN 1 ELSE 2 END, sort_order, id) - 1)::int AS pos
                FROM aula_lesson_blocks WHERE lesson_id = v_clase AND deleted_at IS NULL) o
       WHERE b.id = o.id AND b.sort_order IS DISTINCT FROM o.pos;
      v_n := v_n + 1;
    END IF;
  END LOOP;
  END IF;
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT id, 'Dirección académica de Edvanta', 'Video de unidad para cursos sin video (178).'
    FROM aula_courses WHERE deleted_at IS NULL AND current_version_id IS NOT NULL
     AND title = ANY(ARRAY[$t$Curso de Asuntos Regulatorios Farmacéuticos en Colombia$t$,$t$Curso de Bioequivalencia y Requisitos Regulatorios en Colombia$t$,$t$Curso de Registro Sanitario de Productos Fitoterapéuticos$t$,$t$Curso de Regulación de Medicamentos Homeopáticos$t$,$t$Curso de Regulación Sanitaria de Gases Medicinales$t$,$t$Curso de Importación de Medicamentos Vitales No Disponibles$t$,$t$Curso de Psicofarmacología$t$,$t$Curso de Manipulación de Alimentos$t$]);
  RAISE NOTICE 'Videos de unidad insertados: % clases.', v_n;
END $video$;

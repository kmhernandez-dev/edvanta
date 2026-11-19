-- ============================================================
--  166_videos_manipulacion_de_alimentos.sql — Un video de YouTube por clase
--
--  Curso de Manipulación de Alimentos: 15 videos.
--  Generado por scripts/generar-videos-clases.mjs desde scripts/datos/videos-clases/.
--  Verificados con el oEmbed oficial de YouTube el 2026-11-19.
--  Criterio: Por pedido de la dirección, primero Edutin Academy: su único video del tema (el curso completo, 24 min) va en la clase 1.1. Edutin no tiene clases por tema, así que las demás llevan videos en español de fuentes institucionales: Secretaría de Salud de Zipaquirá (serie Claves de la Inocuidad), Municipalidad de Salta, Universidad Nacional del Litoral y asociaciones del sector. Cada video respondió 200 en el oEmbed de YouTube (disponible e insertable).
--
--  Cada video entra después de «En esta clase», como en el curso de
--  Farmacoterapia de la Diabetes. Si la clase ya tiene un video, no se
--  toca. Si el curso ya estaba publicado, se aprueba una versión nueva
--  (aula_republicaciones_aprobadas): el servidor la publica al arrancar.
-- ============================================================

DO $vc166$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_pos   INTEGER;
  v_nuevos INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = $vc166t$Curso de Manipulación de Alimentos$vc166t$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso: se salta.';
    RETURN;
  END IF;

  -- Qué es la inocuidad y por qué un alimento enferma · Edutin Academy
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Qué es la inocuidad y por qué un alimento enferma$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Qué es la inocuidad y por qué un alimento enferma$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=Zw2MvnDy6rA","provider":"youtube","videoId":"Zw2MvnDy6rA","title":"Curso de Manipulación de alimentos [Gratis y certificado] - Edutin Academy","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- La Resolución 2674 de 2013: obligaciones del manipulador y de la empresa · Escuela de alimentos Mercedes Pinilla
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$La Resolución 2674 de 2013: obligaciones del manipulador y de la empresa$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$La Resolución 2674 de 2013: obligaciones del manipulador y de la empresa$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=chSIjthSZ48","provider":"youtube","videoId":"chSIjthSZ48","title":"Modulo1. Normatividad Sanitaria","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Estado de salud del manipulador · Asonaman - Certificado Manipulador Alimentos
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Estado de salud del manipulador$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Estado de salud del manipulador$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=by1Qq-ujdao","provider":"youtube","videoId":"by1Qq-ujdao","title":"Tema 5. Reglas higiénicas del manipulador de alimentos.","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Lavado de manos: cuándo y cómo · Nuttralia, Dietistas-Nutricionistas Valencia
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Lavado de manos: cuándo y cómo$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Lavado de manos: cuándo y cómo$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=rBslsGtnNcg","provider":"youtube","videoId":"rBslsGtnNcg","title":"Manipulador de alimentos - El lavado de manos","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Dotación y presentación personal · FEHGRA
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Dotación y presentación personal$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Dotación y presentación personal$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=Dbhi2xy-324","provider":"youtube","videoId":"Dbhi2xy-324","title":"4.1 – Higiene personal de los Manipuladores.","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Guantes, tapabocas y comportamientos prohibidos · Alicorp Oficial
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Guantes, tapabocas y comportamientos prohibidos$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Guantes, tapabocas y comportamientos prohibidos$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=E40w_vOmk7w","provider":"youtube","videoId":"E40w_vOmk7w","title":"Hábitos y buenas prácticas de higiene - Crecemos Juntos","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Separe crudos y cocinados: la contaminación cruzada · Secretaría de Salud Zipaquirá
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Separe crudos y cocinados: la contaminación cruzada$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Separe crudos y cocinados: la contaminación cruzada$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=07XQSjlsGU0","provider":"youtube","videoId":"07XQSjlsGU0","title":"Claves de la Inocuidad - #2 Separe Alimentos Crudos de los Cocinados","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Cocine completamente: 70 °C y el recalentado · Secretaría de Salud Zipaquirá
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Cocine completamente: 70 °C y el recalentado$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Cocine completamente: 70 °C y el recalentado$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=pdetLw5nnZ8","provider":"youtube","videoId":"pdetLw5nnZ8","title":"Claves de la Inocuidad - #3 Cocine Completamente","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Temperaturas seguras: la zona de peligro · Secretaría de Salud Zipaquirá
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Temperaturas seguras: la zona de peligro$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Temperaturas seguras: la zona de peligro$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=53eBk8Aw600","provider":"youtube","videoId":"53eBk8Aw600","title":"Claves de la Inocuidad - #4 Mantenga Los Alimentos a Temperaturas Seguras","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Limpieza y desinfección · Municipalidad de Salta
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Limpieza y desinfección$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Limpieza y desinfección$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=T6r1q8Z6K3s","provider":"youtube","videoId":"T6r1q8Z6K3s","title":"Video 03. Manipulación segura de alimentos: limpieza y desinfección","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Residuos sólidos y control integrado de plagas · UNL Virtual
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Residuos sólidos y control integrado de plagas$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Residuos sólidos y control integrado de plagas$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=wbSTjoj03YM","provider":"youtube","videoId":"wbSTjoj03YM","title":"Saneamiento: Control integral de plagas en el sector alimentario","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Agua potable y materias primas seguras · Secretaría de Salud Zipaquirá
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Agua potable y materias primas seguras$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Agua potable y materias primas seguras$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=k5bv1pPzmYw","provider":"youtube","videoId":"k5bv1pPzmYw","title":"Claves de la Inocuidad - #5 Use Agua y Materias Primas Seguras","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Recepción de materias primas · A&J Seguridad Alimentaria
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Recepción de materias primas$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Recepción de materias primas$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=WryCT_Df7Ic","provider":"youtube","videoId":"WryCT_Df7Ic","title":"Curso de manipulación de alimentos: aprende cómo comprar y almacenar los alimentos","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Almacenamiento seco, refrigerado y congelado · auditor en salud
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Almacenamiento seco, refrigerado y congelado$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Almacenamiento seco, refrigerado y congelado$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=rMpPP5UDzZk","provider":"youtube","videoId":"rMpPP5UDzZk","title":"Manipulación de alimentos: condiciones de almacenamiento y temperaturas","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Registros, autocontrol y caso integrador · El ing
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc166c$Registros, autocontrol y caso integrador$vc166c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc166c$Registros, autocontrol y caso integrador$vc166c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc166j${"source":"enlace","url":"https://www.youtube.com/watch?v=Sv0Z1SLGZ0c","provider":"youtube","videoId":"Sv0Z1SLGZ0c","title":"Visitantes, registros y trazabilidad: la evidencia de las BPM","transcriptHtml":""}$vc166j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  IF v_nuevos > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', $vc166n$Videos de YouTube en cada clase (2026-11-19).$vc166n$
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
END
$vc166$;

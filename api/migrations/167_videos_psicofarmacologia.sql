-- ============================================================
--  167_videos_psicofarmacologia.sql — Un video de YouTube por clase
--
--  Curso de Psicofarmacología: 28 videos.
--  Generado por scripts/generar-videos-clases.mjs desde scripts/datos/videos-clases/.
--  Verificados con el oEmbed oficial de YouTube el 2026-11-19.
--  Criterio: Por pedido de la dirección, primero los videos del canal de Edutin Academy (Curso de farmacología clínica: 9 clases). Donde Edutin no tiene el tema, videos en español de universidades (Valladolid, Miguel Hernández), hospitales (Sant Joan de Déu), servicios de salud (Salud Navarra, OMS/OPS) y docentes de medicina. Las 5 clases de caso no llevan video, como en el curso de Farmacoterapia de la Diabetes. Cada video respondió 200 en el oEmbed de YouTube.
--
--  Cada video entra después de «En esta clase», como en el curso de
--  Farmacoterapia de la Diabetes. Si la clase ya tiene un video, no se
--  toca. Si el curso ya estaba publicado, se aprueba una versión nueva
--  (aula_republicaciones_aprobadas): el servidor la publica al arrancar.
-- ============================================================

DO $vc167$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
  v_pos   INTEGER;
  v_nuevos INTEGER := 0;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = $vc167t$Curso de Psicofarmacología$vc167t$ AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe el curso: se salta.';
    RETURN;
  END IF;

  -- Introducción al curso: el QF en la atención de la salud mental · Edutin Academy
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Introducción al curso: el QF en la atención de la salud mental$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Introducción al curso: el QF en la atención de la salud mental$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=6l3sd199sLM","provider":"youtube","videoId":"6l3sd199sLM","title":"Introducción a la psicofarmacología - Curso de farmacología clínica","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Monoaminas: serotonina, noradrenalina y dopamina · Edutin Academy
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Monoaminas: serotonina, noradrenalina y dopamina$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Monoaminas: serotonina, noradrenalina y dopamina$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=86LcsZlDdRw","provider":"youtube","videoId":"86LcsZlDdRw","title":"Principios de psicofarmacología - Curso de farmacología clínica","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Glutamato y GABA: el equilibrio excitación-inhibición · Grupo SM Chile
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Glutamato y GABA: el equilibrio excitación-inhibición$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Glutamato y GABA: el equilibrio excitación-inhibición$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=xT7p8ugKJnA","provider":"youtube","videoId":"xT7p8ugKJnA","title":"Mecanismo de acción del GABA","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Ley 1616 de 2013 de salud mental y sus modificaciones · Motiva tu Bienestar
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Ley 1616 de 2013 de salud mental y sus modificaciones$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Ley 1616 de 2013 de salud mental y sus modificaciones$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=B8qRmYtMJ-E","provider":"youtube","videoId":"B8qRmYtMJ-E","title":"Ley 1616 de 2013","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Medicamentos de control especial y monopolio del Estado · Coopiradio
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Medicamentos de control especial y monopolio del Estado$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Medicamentos de control especial y monopolio del Estado$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=9d9Va_xQoxw","provider":"youtube","videoId":"9d9Va_xQoxw","title":"Webinar: Registro y reporte de medicamentos de control especial","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Introducción a la unidad: depresión y abordaje farmacológico · World Health Organization (WHO)
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Introducción a la unidad: depresión y abordaje farmacológico$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Introducción a la unidad: depresión y abordaje farmacológico$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=HZW6m2jAHuw","provider":"youtube","videoId":"HZW6m2jAHuw","title":"OMS: Depresión – Hablemos","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- ISRS e IRSN · Edutin Academy
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$ISRS e IRSN$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$ISRS e IRSN$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=xpYuR3UI_Ig","provider":"youtube","videoId":"xpYuR3UI_Ig","title":"Clasificación de los antidepresivos - Curso de farmacología clínica","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Tricíclicos e IMAO · El Profe Andrés
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Tricíclicos e IMAO$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Tricíclicos e IMAO$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=CPJdk22iou4","provider":"youtube","videoId":"CPJdk22iou4","title":"Antidepresivos tricíclicos: ¿por qué aún se usan? Mecanismo, usos y riesgos","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Bupropión, mirtazapina, vortioxetina y esketamina · Academia Cares by Sinapsis EMP
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Bupropión, mirtazapina, vortioxetina y esketamina$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Bupropión, mirtazapina, vortioxetina y esketamina$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=juENEo3fmLs","provider":"youtube","videoId":"juENEo3fmLs","title":"Farmacología de antidepresivos","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Síndrome serotoninérgico · Universidad Miguel Hernández de Elche
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Síndrome serotoninérgico$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Síndrome serotoninérgico$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=ITi81UC-W7U","provider":"youtube","videoId":"ITi81UC-W7U","title":"Caso 4. Síndrome serotoninérgico","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Síndrome de discontinuación y advertencia de riesgo suicida en jóvenes · Instituto de Psicofarmacología
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Síndrome de discontinuación y advertencia de riesgo suicida en jóvenes$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Síndrome de discontinuación y advertencia de riesgo suicida en jóvenes$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=xDgUp7gh53A","provider":"youtube","videoId":"xDgUp7gh53A","title":"Diagnóstico del retiro de antidepresivos: cómo distinguirlo de la recaída","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- GPC de depresión de MinSalud: selección del antidepresivo · Edutin Academy
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$GPC de depresión de MinSalud: selección del antidepresivo$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$GPC de depresión de MinSalud: selección del antidepresivo$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=Hcih_mFONdE","provider":"youtube","videoId":"Hcih_mFONdE","title":"Cómo seleccionar antidepresivos - Curso de farmacología clínica","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Introducción a la unidad: ansiedad, insomnio y uso racional · Edutin Academy
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Introducción a la unidad: ansiedad, insomnio y uso racional$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Introducción a la unidad: ansiedad, insomnio y uso racional$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=DfWgNsBlpjs","provider":"youtube","videoId":"DfWgNsBlpjs","title":"Cómo usar ansiolíticos - Curso de farmacología clínica","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Benzodiacepinas: mecanismo y farmacocinética · Edutin Academy
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Benzodiacepinas: mecanismo y farmacocinética$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Benzodiacepinas: mecanismo y farmacocinética$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=0CkWM4ITMI4","provider":"youtube","videoId":"0CkWM4ITMI4","title":"Mecanismo de acción de los ansiolíticos - Curso de farmacología clínica","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Dependencia, abstinencia y desprescripción de benzodiacepinas · Centro de Salud Profesor Jesús Marín
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Dependencia, abstinencia y desprescripción de benzodiacepinas$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Dependencia, abstinencia y desprescripción de benzodiacepinas$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=GBRcf2B6BC4","provider":"youtube","videoId":"GBRcf2B6BC4","title":"Estrategias para reducir el consumo de benzodiacepinas","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Fármacos Z y buspirona · SalusPlay
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Fármacos Z y buspirona$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Fármacos Z y buspirona$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=t4OPU_2wFZ0","provider":"youtube","videoId":"t4OPU_2wFZ0","title":"Tema 19. Fármacos hipnóticos y sedantes","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Introducción a la unidad: esquizofrenia, trastorno bipolar y la GPC colombiana · Ayuda de Familiares de personas con Esquizofrenia
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Introducción a la unidad: esquizofrenia, trastorno bipolar y la GPC colombiana$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Introducción a la unidad: esquizofrenia, trastorno bipolar y la GPC colombiana$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=rOnyXng1aR8","provider":"youtube","videoId":"rOnyXng1aR8","title":"Fármacos para el tratamiento de personas con esquizofrenia. Segunda parte","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Antipsicóticos típicos y atípicos · Edutin Academy
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Antipsicóticos típicos y atípicos$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Antipsicóticos típicos y atípicos$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=jZjEcMglSGk","provider":"youtube","videoId":"jZjEcMglSGk","title":"Tipos de antipsicóticos - Curso de farmacología clínica","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Síntomas extrapiramidales y síndrome neuroléptico maligno · MIR Asturias
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Síntomas extrapiramidales y síndrome neuroléptico maligno$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Síntomas extrapiramidales y síndrome neuroléptico maligno$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=ZdEQzJf9RTA","provider":"youtube","videoId":"ZdEQzJf9RTA","title":"Diagnóstico diferencial: síndrome neuroléptico maligno vs. síndrome serotoninérgico","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Síndrome metabólico, QT y clozapina con monitorización de neutrófilos · Edutin Academy
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Síndrome metabólico, QT y clozapina con monitorización de neutrófilos$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Síndrome metabólico, QT y clozapina con monitorización de neutrófilos$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=njL-tcvFL5M","provider":"youtube","videoId":"njL-tcvFL5M","title":"Cómo seleccionar antipsicóticos para receta médica - Curso de farmacología clínica","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Tratamiento de mantenimiento, antipsicóticos de depósito e interacciones · Salud Navarra
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Tratamiento de mantenimiento, antipsicóticos de depósito e interacciones$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Tratamiento de mantenimiento, antipsicóticos de depósito e interacciones$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=ima6Zc_XQK0","provider":"youtube","videoId":"ima6Zc_XQK0","title":"Prescripción y administración de inyectables antipsicóticos de acción prolongada","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Litio: farmacología y niveles séricos · Sinapsis EMP
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Litio: farmacología y niveles séricos$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Litio: farmacología y niveles séricos$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=qmcQ-seoanI","provider":"youtube","videoId":"qmcQ-seoanI","title":"Farmacología y usos del litio","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Valproato y lamotrigina · UVa_Online
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Valproato y lamotrigina$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Valproato y lamotrigina$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=AmZ5pMbAu0g","provider":"youtube","videoId":"AmZ5pMbAu0g","title":"Fármacos antipsicóticos, antidepresivos y antimaníacos","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Introducción a la unidad: grupos de riesgo y prioridades en salud mental · PAHO TV
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Introducción a la unidad: grupos de riesgo y prioridades en salud mental$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Introducción a la unidad: grupos de riesgo y prioridades en salud mental$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=T1ysvMHuV-Y","provider":"youtube","videoId":"T1ysvMHuV-Y","title":"Hablemos de Salud Ep 14 - Adolescentes y salud mental","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- TDAH: metilfenidato y atomoxetina · Hospital Sant Joan de Déu Barcelona
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$TDAH: metilfenidato y atomoxetina$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$TDAH: metilfenidato y atomoxetina$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=4aLBd25eyrA","provider":"youtube","videoId":"4aLBd25eyrA","title":"Mitos y realidades del tratamiento farmacológico del TDAH","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Farmacoterapia de las adicciones: visión general · USMLE DREAMERS
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Farmacoterapia de las adicciones: visión general$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Farmacoterapia de las adicciones: visión general$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=x-HDuBr9f_4","provider":"youtube","videoId":"x-HDuBr9f_4","title":"Trastorno por consumo de alcohol: bloqueo del refuerzo con naltrexona","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Embarazo y lactancia · Víctor Navarro, Psiquiatra
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Embarazo y lactancia$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Embarazo y lactancia$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=WvFvRULifUI","provider":"youtube","videoId":"WvFvRULifUI","title":"Embarazo, lactancia y fármacos psiquiátricos (antidepresivos, ansiolíticos, etc.)","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Adulto mayor: criterios de Beers y STOPP/START · Kabilia
  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = $vc167c$Adulto mayor: criterios de Beers y STOPP/START$vc167c$ AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NULL THEN
    RAISE NOTICE 'Clase no encontrada: %', $vc167c$Adulto mayor: criterios de Beers y STOPP/START$vc167c$;
  ELSIF NOT EXISTS (SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video') THEN
    SELECT COALESCE(MIN(sort_order) + 1, 0) INTO v_pos FROM aula_lesson_blocks
     WHERE lesson_id = v_clase AND type = 'destacado' AND data->>'title' = 'En esta clase';
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= v_pos;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', v_pos, $vc167j${"source":"enlace","url":"https://www.youtube.com/watch?v=UMPFtRk5qVE","provider":"youtube","videoId":"UMPFtRk5qVE","title":"Criterios STOPP-START","transcriptHtml":""}$vc167j$::jsonb);
    v_nuevos := v_nuevos + 1;
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  IF v_nuevos > 0 THEN
    INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
    SELECT v_curso, 'Dirección académica de Edvanta', $vc167n$Videos de YouTube en cada clase (2026-11-19).$vc167n$
     WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
  END IF;
END
$vc167$;

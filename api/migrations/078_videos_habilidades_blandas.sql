-- ============================================================
--  078_videos_habilidades_blandas.sql — un video de YouTube por clase
--
--  Generado por scripts/generar-habilidades-blandas.mjs a partir de
--  scripts/datos/videos-habilidades-blandas.json: 80 videos en español
--  (2 a 25 minutos), elegidos con la búsqueda sugerida de cada clase en el
--  .xlsx y verificados con oEmbed el 10-nov-2026.
--
--  Cada video entra como segundo bloque de su clase, después de «En esta
--  clase». Si la clase ya lo tiene, no se repite. Como los cursos ya
--  estaban publicados, se aprueba una versión nueva de cada uno
--  (aula_republicaciones_aprobadas, 077): el servidor la publica al
--  arrancar y quien estudia ve los videos.
-- ============================================================

-- ─── Curso de Oratoria: cómo hablar en público con seguridad ───
DO $vdhb01$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Oratoria: cómo hablar en público con seguridad' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Oratoria: cómo hablar en público con seguridad: se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Qué es la oratoria y por qué cualquier persona puede aprender a hablar en público' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'VGp-o6TB3qY'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb01j${"source":"enlace","url":"https://www.youtube.com/watch?v=VGp-o6TB3qY","provider":"youtube","videoId":"VGp-o6TB3qY","title":"Conceptos de pathos, logos y ethos","transcriptHtml":""}$vdhb01j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Diagnóstico del orador: cómo medir tu punto de partida al hablar en público' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '_0YdCOp6ogY'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb01j${"source":"enlace","url":"https://www.youtube.com/watch?v=_0YdCOp6ogY","provider":"youtube","videoId":"_0YdCOp6ogY","title":"Todos necesitamos aprender a hablar en público. Manuel Campo Vidal, periodista","transcriptHtml":""}$vdhb01j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo estructurar un discurso: apertura, cuerpo y cierre que el público recuerda' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'zRVmrCPatOk'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb01j${"source":"enlace","url":"https://www.youtube.com/watch?v=zRVmrCPatOk","provider":"youtube","videoId":"zRVmrCPatOk","title":"Como Hacer un Discurso: 15 Técnicas Efectivas Para Iniciar Tu Presentación | Tecnicas de Oratoria","transcriptHtml":""}$vdhb01j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'El mensaje central: cómo resumir cualquier presentación en una sola frase' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'rhxZ-M9lnWI'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb01j${"source":"enlace","url":"https://www.youtube.com/watch?v=rhxZ-M9lnWI","provider":"youtube","videoId":"rhxZ-M9lnWI","title":"Cómo encontrar la IDEA PRINCIPAL de una presentación","transcriptHtml":""}$vdhb01j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Técnicas de voz para hablar en público: respiración, volumen, ritmo, pausas y muletillas' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'THLlHleYIRA'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb01j${"source":"enlace","url":"https://www.youtube.com/watch?v=THLlHleYIRA","provider":"youtube","videoId":"THLlHleYIRA","title":"➤ Ejercicios de RESPIRACIÓN para Hablar en Público","transcriptHtml":""}$vdhb01j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Lenguaje corporal al hablar en público: postura, gestos, mirada y uso del escenario' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '_xzq753rSBk'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb01j${"source":"enlace","url":"https://www.youtube.com/watch?v=_xzq753rSBk","provider":"youtube","videoId":"_xzq753rSBk","title":"✅ Posturas de ORATORIA para HABLAR EN PÚBLICO - Los secretos del lenguaje corporal 💪","transcriptHtml":""}$vdhb01j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo ensayar un discurso: práctica deliberada, retroalimentación y memoria de apoyo' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'kSCtTMbLrGg'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb01j${"source":"enlace","url":"https://www.youtube.com/watch?v=kSCtTMbLrGg","provider":"youtube","videoId":"kSCtTMbLrGg","title":"Cómo ensayar para hablar en público con naturalidad. Mis 5 pasos para  presentaciones exitosas.","transcriptHtml":""}$vdhb01j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo improvisar y responder preguntas del público sin quedarte en blanco' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'GuWjkB6PILs'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb01j${"source":"enlace","url":"https://www.youtube.com/watch?v=GuWjkB6PILs","provider":"youtube","videoId":"GuWjkB6PILs","title":"EJERCICIO PARA IMPROVISAR AL HABLAR EN PÚBLICO","transcriptHtml":""}$vdhb01j$::jsonb);
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Videos complementarios de YouTube en cada clase (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
END
$vdhb01$;

-- ─── Curso para perder el miedo a hablar en público ───
DO $vdhb02$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso para perder el miedo a hablar en público' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso para perder el miedo a hablar en público: se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Miedo a hablar en público (glosofobia): qué es, por qué ocurre y qué le pasa a tu cuerpo' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'Ql2eza3wDWM'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb02j${"source":"enlace","url":"https://www.youtube.com/watch?v=Ql2eza3wDWM","provider":"youtube","videoId":"Ql2eza3wDWM","title":"Miedo a hablar en público Glosofobia","transcriptHtml":""}$vdhb02j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Los pensamientos que alimentan los nervios: efecto foco, ilusión de transparencia y perfeccionismo' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'GaQNuBCdPKQ'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb02j${"source":"enlace","url":"https://www.youtube.com/watch?v=GaQNuBCdPKQ","provider":"youtube","videoId":"GaQNuBCdPKQ","title":"Cómo Controlar los Nervios al Hablar en Público | Ejercicios del Pilar Emocional","transcriptHtml":""}$vdhb02j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Técnicas de respiración para controlar los nervios antes de una exposición' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'U8eUJo7x0So'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb02j${"source":"enlace","url":"https://www.youtube.com/watch?v=U8eUJo7x0So","provider":"youtube","videoId":"U8eUJo7x0So","title":"RESPIRACIóN #1 para calmar la ANSIEDAD con Dr. Huberman - Suspiro Fisiológico","transcriptHtml":""}$vdhb02j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Reinterpretar los nervios: cómo convertir la ansiedad en energía para presentar' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'O8loFBbqHEc'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb02j${"source":"enlace","url":"https://www.youtube.com/watch?v=O8loFBbqHEc","provider":"youtube","videoId":"O8loFBbqHEc","title":"✅ Cómo controlar los NERVIOS al HABLAR EN PÚBLICO? Técnicas de ORATORIA 🔥","transcriptHtml":""}$vdhb02j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'La escalera de exposición: cómo perder el miedo a hablar en público paso a paso' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '3FvHSBU2h0U'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb02j${"source":"enlace","url":"https://www.youtube.com/watch?v=3FvHSBU2h0U","provider":"youtube","videoId":"3FvHSBU2h0U","title":"HABLAR en público SIN MIEDO y con éxito","transcriptHtml":""}$vdhb02j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Preparación que reduce la ansiedad: la rutina previa y los primeros 60 segundos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'dhQHPjmk0-k'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb02j${"source":"enlace","url":"https://www.youtube.com/watch?v=dhQHPjmk0-k","provider":"youtube","videoId":"dhQHPjmk0-k","title":"10 CONSEJOS para MEJORAR tu oratoria al HABLAR EN PÚBLICO","transcriptHtml":""}$vdhb02j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Qué hacer si te quedas en blanco al hablar en público: 7 técnicas de rescate' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'c_-ZShsGKLA'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb02j${"source":"enlace","url":"https://www.youtube.com/watch?v=c_-ZShsGKLA","provider":"youtube","videoId":"c_-ZShsGKLA","title":"¿Qué puedo hacer si me quedo en blanco en una presentación?","transcriptHtml":""}$vdhb02j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Plan de 30 días para vencer el miedo escénico y cuándo buscar ayuda profesional' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'OOUVOhHw7Ew'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb02j${"source":"enlace","url":"https://www.youtube.com/watch?v=OOUVOhHw7Ew","provider":"youtube","videoId":"OOUVOhHw7Ew","title":"Del miedo escénico al gozo escénico | Gonzalo Álvarez | TEDxGranVía","transcriptHtml":""}$vdhb02j$::jsonb);
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Videos complementarios de YouTube en cada clase (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
END
$vdhb02$;

-- ─── Curso de Presentaciones Efectivas y Storytelling ───
DO $vdhb03$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Presentaciones Efectivas y Storytelling' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Presentaciones Efectivas y Storytelling: se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Qué hace efectiva una presentación: audiencia, objetivo y mensaje' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'jYMaiibIsa8'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb03j${"source":"enlace","url":"https://www.youtube.com/watch?v=jYMaiibIsa8","provider":"youtube","videoId":"jYMaiibIsa8","title":"Cómo hacer presentaciones efectivas y profesionales 😎 | #powerpoint","transcriptHtml":""}$vdhb03j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Análisis de audiencia: cómo adaptar tu presentación a médicos, directivos, pacientes o equipos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'NeOek0330wg'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb03j${"source":"enlace","url":"https://www.youtube.com/watch?v=NeOek0330wg","provider":"youtube","videoId":"NeOek0330wg","title":"Cómo adaptar el discurso a la audiencia y enfocar el mensaje | Curso de ORATORIA #2","transcriptHtml":""}$vdhb03j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Qué es el storytelling y cómo estructurar una historia que convence' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '77TAn3GuKSg'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb03j${"source":"enlace","url":"https://www.youtube.com/watch?v=77TAn3GuKSg","provider":"youtube","videoId":"77TAn3GuKSg","title":"Qué es el Storytelling y Cómo Aplicarlo en tu Estrategia de Marketing (Ejemplos)","transcriptHtml":""}$vdhb03j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Storytelling con datos: cómo contar resultados y cifras para que se entiendan' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'JvWjgIJE77M'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb03j${"source":"enlace","url":"https://www.youtube.com/watch?v=JvWjgIJE77M","provider":"youtube","videoId":"JvWjgIJE77M","title":"Data Storytelling: Aprende a contar historias con datos","transcriptHtml":""}$vdhb03j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo hacer una buena presentación en PowerPoint: diseño de diapositivas basado en evidencia' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'ehKdjAXeIe4'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb03j${"source":"enlace","url":"https://www.youtube.com/watch?v=ehKdjAXeIe4","provider":"youtube","videoId":"ehKdjAXeIe4","title":"PUCP - ¿Cómo hacer una buena presentación en PowerPoint?","transcriptHtml":""}$vdhb03j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo presentar datos clínicos y técnicos en diapositivas sin perder al público' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'xM3Gwa98N-0'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb03j${"source":"enlace","url":"https://www.youtube.com/watch?v=xM3Gwa98N-0","provider":"youtube","videoId":"xM3Gwa98N-0","title":"Crea buenas diapositivas para la » PRESENTACIÓN ORAL DE TU INVESTIGACIÓN 👨‍🏫 « 📊📈","transcriptHtml":""}$vdhb03j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Presentaciones virtuales efectivas: cómo presentar en Teams, Zoom o Meet' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'Qk-U9oMK884'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb03j${"source":"enlace","url":"https://www.youtube.com/watch?v=Qk-U9oMK884","provider":"youtube","videoId":"Qk-U9oMK884","title":"Nuevo truco! 🤩 Presentación virtual en Zoom, Teams, Meet… fondo en Prezi ¡más allá de Powerpoint!","transcriptHtml":""}$vdhb03j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Elevator pitch: cómo presentar una idea, un proyecto o un producto en 3 minutos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'w0IX4mGw6Kk'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb03j${"source":"enlace","url":"https://www.youtube.com/watch?v=w0IX4mGw6Kk","provider":"youtube","videoId":"w0IX4mGw6Kk","title":"Qué es un Elevator Pitch y Cómo Hacer Uno (con Ejemplos)","transcriptHtml":""}$vdhb03j$::jsonb);
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Videos complementarios de YouTube en cada clase (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
END
$vdhb03$;

-- ─── Curso de Comunicación Asertiva en el Trabajo ───
DO $vdhb04$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Comunicación Asertiva en el Trabajo' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Comunicación Asertiva en el Trabajo: se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Qué es la comunicación asertiva: estilos pasivo, agresivo, pasivo-agresivo y asertivo con ejemplos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'z9_LoHYc0CA'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb04j${"source":"enlace","url":"https://www.youtube.com/watch?v=z9_LoHYc0CA","provider":"youtube","videoId":"z9_LoHYc0CA","title":"EJEMPLOS DE COMUNICACIÓN ASERTIVA, AGRESIVA Y PASIVA I #psicoedukme","transcriptHtml":""}$vdhb04j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Derechos asertivos y autodiagnóstico: ¿qué tan asertivo eres?' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'Nr46-iGPT2w'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb04j${"source":"enlace","url":"https://www.youtube.com/watch?v=Nr46-iGPT2w","provider":"youtube","videoId":"Nr46-iGPT2w","title":"🤔 ¿Qué es la ASERTIVIDAD y para qué sirve? ✅ LOS DERECHOS ASERTIVOS","transcriptHtml":""}$vdhb04j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Mensajes yo y técnica DESC: cómo expresar un desacuerdo sin atacar' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'gMaYX0zc0E4'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb04j${"source":"enlace","url":"https://www.youtube.com/watch?v=gMaYX0zc0E4","provider":"youtube","videoId":"gMaYX0zc0E4","title":"Mensajes YO. Una poderosa técnica de Asertividad","transcriptHtml":""}$vdhb04j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo decir no en el trabajo sin sentirte culpable: técnicas asertivas' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '6nEZ8nA7I4I'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb04j${"source":"enlace","url":"https://www.youtube.com/watch?v=6nEZ8nA7I4I","provider":"youtube","videoId":"6nEZ8nA7I4I","title":"Aprende a Decir NO. Técnica Disco Rayado","transcriptHtml":""}$vdhb04j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Escucha activa: qué es, técnicas y ejemplos para escuchar de verdad' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'IUpO9kTLfb0'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb04j${"source":"enlace","url":"https://www.youtube.com/watch?v=IUpO9kTLfb0","provider":"youtube","videoId":"IUpO9kTLfb0","title":"Lección 2.2: Técnicas de la escucha activa","transcriptHtml":""}$vdhb04j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Comunicación no violenta (CNV): los 4 pasos de Marshall Rosenberg con ejemplos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'Gqod-kdSOJk'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb04j${"source":"enlace","url":"https://www.youtube.com/watch?v=Gqod-kdSOJk","provider":"youtube","videoId":"Gqod-kdSOJk","title":"Mapa mental: La Comunicación No Violenta de Marshall Rosenberg","transcriptHtml":""}$vdhb04j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo dar retroalimentación efectiva con el modelo SBI y recibir críticas sin ponerte a la defensiva' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'W8bmG44VAZs'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb04j${"source":"enlace","url":"https://www.youtube.com/watch?v=W8bmG44VAZs","provider":"youtube","videoId":"W8bmG44VAZs","title":"Modelo SBI (Situación, Comportamiento, Impacto)","transcriptHtml":""}$vdhb04j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Manejo de conflictos en el trabajo: 5 estilos y un método para resolver desacuerdos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'Cxobn7ML4sM'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb04j${"source":"enlace","url":"https://www.youtube.com/watch?v=Cxobn7ML4sM","provider":"youtube","videoId":"Cxobn7ML4sM","title":"Estilos de manejo de conflictos de Thomas-Kilmann","transcriptHtml":""}$vdhb04j$::jsonb);
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Videos complementarios de YouTube en cada clase (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
END
$vdhb04$;

-- ─── Curso de Lenguaje Corporal y Comunicación No Verbal ───
DO $vdhb05$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Lenguaje Corporal y Comunicación No Verbal' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Lenguaje Corporal y Comunicación No Verbal: se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Qué es la comunicación no verbal: canales, funciones y ejemplos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'SlJp9tP7ZyY'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb05j${"source":"enlace","url":"https://www.youtube.com/watch?v=SlJp9tP7ZyY","provider":"youtube","videoId":"SlJp9tP7ZyY","title":"📌¿QUE ES COMUNICACIÓN NO VERBAL? | TIPOS O CANALES, CARACTERÍSTICAS Y EJEMPLOS ♫ PODCAST","transcriptHtml":""}$vdhb05j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Mitos del lenguaje corporal: la regla 7-38-55, los brazos cruzados y la detección de mentiras' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'yjyUsT_P2DQ'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb05j${"source":"enlace","url":"https://www.youtube.com/watch?v=yjyUsT_P2DQ","provider":"youtube","videoId":"yjyUsT_P2DQ","title":"🗣️ El Poder de la COMUNICACIÓN No Verbal: La Regla de Albert Mehrabian","transcriptHtml":""}$vdhb05j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Postura, gestos y manos: cómo proyectar seguridad y apertura' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '_UdglO37H98'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb05j${"source":"enlace","url":"https://www.youtube.com/watch?v=_UdglO37H98","provider":"youtube","videoId":"_UdglO37H98","title":"21 Gestos Del Lenguaje Corporal De Las Manos Que Te Harán Parecer Más Inteligente","transcriptHtml":""}$vdhb05j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Mirada y expresión facial: cómo conectar con la mirada y leer emociones con prudencia' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '_ERLlkx9iEQ'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb05j${"source":"enlace","url":"https://www.youtube.com/watch?v=_ERLlkx9iEQ","provider":"youtube","videoId":"_ERLlkx9iEQ","title":"3 Claves Lenguaje Corporal Poderoso: CONTACTO VISUAL y Cómo MIRAR A LOS OJOS [Parte 1 de 3]","transcriptHtml":""}$vdhb05j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Paralenguaje: qué comunica tu voz además de las palabras' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'jCoekiwDOi0'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb05j${"source":"enlace","url":"https://www.youtube.com/watch?v=jCoekiwDOi0","provider":"youtube","videoId":"jCoekiwDOi0","title":"ROL DEL TONO DE VOZ EN LA EXPRESIÓN: PARALENGUAJE","transcriptHtml":""}$vdhb05j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Proxémica: cómo usar el espacio en el mostrador, la consulta y las reuniones' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'aF1Xt87QJvw'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb05j${"source":"enlace","url":"https://www.youtube.com/watch?v=aF1Xt87QJvw","provider":"youtube","videoId":"aF1Xt87QJvw","title":"🔥 Qué es la PROXÉMICA y cómo puedes UTILIZARLA EN TU BENEFICIO ➜ Psicología Corporal","transcriptHtml":""}$vdhb05j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo leer el lenguaje corporal de otros: línea base, conjuntos de señales y contexto' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'ZQewSTbIr9U'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb05j${"source":"enlace","url":"https://www.youtube.com/watch?v=ZQewSTbIr9U","provider":"youtube","videoId":"ZQewSTbIr9U","title":"Cómo LEER el LENGUAJE CORPORAL de las personas - ¡Fíjate en ESTO!","transcriptHtml":""}$vdhb05j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Lenguaje corporal en videollamadas y entrevistas: encuadre, mirada a cámara y presencia' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '4UVE6xZ9vVQ'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb05j${"source":"enlace","url":"https://www.youtube.com/watch?v=4UVE6xZ9vVQ","provider":"youtube","videoId":"4UVE6xZ9vVQ","title":"Comunicación estratégica y lenguaje corporal para entrevistas de trabajo virtual.","transcriptHtml":""}$vdhb05j$::jsonb);
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Videos complementarios de YouTube en cada clase (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
END
$vdhb05$;

-- ─── Curso de Negociación y Persuasión ───
DO $vdhb06$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Negociación y Persuasión' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Negociación y Persuasión: se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Qué es negociar: negociación distributiva vs. integrativa y los errores más comunes' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'zuPcNmmi7Ic'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb06j${"source":"enlace","url":"https://www.youtube.com/watch?v=zuPcNmmi7Ic","provider":"youtube","videoId":"zuPcNmmi7Ic","title":"Diferencias entre la negociación distributiva e integrativa","transcriptHtml":""}$vdhb06j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo preparar una negociación: MAAN (BATNA), precio de reserva, ZOPA y objetivos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'eD-okgayMwU'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb06j${"source":"enlace","url":"https://www.youtube.com/watch?v=eD-okgayMwU","provider":"youtube","videoId":"eD-okgayMwU","title":"NEGOCIACIÓN HARVARD: BATNA/MAAN Y ZOPA","transcriptHtml":""}$vdhb06j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'El método Harvard de negociación: los 4 principios para llegar a acuerdos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '2hCp4EaLQCQ'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb06j${"source":"enlace","url":"https://www.youtube.com/watch?v=2hCp4EaLQCQ","provider":"youtube","videoId":"2hCp4EaLQCQ","title":"El método Harvard de negociación","transcriptHtml":""}$vdhb06j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Preguntas calibradas y escucha táctica: técnicas de Chris Voss para negociar' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'o7A5KNSOwqU'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb06j${"source":"enlace","url":"https://www.youtube.com/watch?v=o7A5KNSOwqU","provider":"youtube","videoId":"o7A5KNSOwqU","title":"PREGUNTAS CALIBRADAS: La técnica para que otros trabajen para ti (Chris Voss Parte 8)","transcriptHtml":""}$vdhb06j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Los 7 principios de persuasión de Cialdini explicados con ejemplos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'xZkSBm6ax0g'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb06j${"source":"enlace","url":"https://www.youtube.com/watch?v=xZkSBm6ax0g","provider":"youtube","videoId":"xZkSBm6ax0g","title":"7 Principios de Persuasión de Robert Cialdini | Resumen Animado","transcriptHtml":""}$vdhb06j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Persuasión ética en el sector salud: cómo comunicar beneficios sin exagerar ni manipular' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'lBB88F0vWPU'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb06j${"source":"enlace","url":"https://www.youtube.com/watch?v=lBB88F0vWPU","provider":"youtube","videoId":"lBB88F0vWPU","title":"Promoción y venta de un medicamento bajo receta de manera ética.","transcriptHtml":""}$vdhb06j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Manejo de objeciones: cómo responder a "es muy caro", "ya uso otro" y "no tengo tiempo"' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '_VKZYS8FW6c'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb06j${"source":"enlace","url":"https://www.youtube.com/watch?v=_VKZYS8FW6c","provider":"youtube","videoId":"_VKZYS8FW6c","title":"Manejo de Objeciones en Ventas [Técnicas Poderosas + Ejemplos]","transcriptHtml":""}$vdhb06j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo cerrar acuerdos: técnicas de cierre, concesiones y seguimiento' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'WKsNEs9GtKI'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb06j${"source":"enlace","url":"https://www.youtube.com/watch?v=WKsNEs9GtKI","provider":"youtube","videoId":"WKsNEs9GtKI","title":"10 Técnicas de cierre de ventas: ejemplos y frases - Parte 1 [Solo Ventas TV]","transcriptHtml":""}$vdhb06j$::jsonb);
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Videos complementarios de YouTube en cada clase (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
END
$vdhb06$;

-- ─── Curso de Inteligencia Emocional en el Trabajo ───
DO $vdhb07$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Inteligencia Emocional en el Trabajo' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Inteligencia Emocional en el Trabajo: se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Qué es la inteligencia emocional: definición, modelos y por qué importa en el trabajo' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'wowJ0kEwFn4'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb07j${"source":"enlace","url":"https://www.youtube.com/watch?v=wowJ0kEwFn4","provider":"youtube","videoId":"wowJ0kEwFn4","title":"Inteligencia emocional, según Daniel Goleman","transcriptHtml":""}$vdhb07j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Autoconocimiento emocional: cómo identificar y nombrar lo que sientes' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'se62UwCxUrI'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb07j${"source":"enlace","url":"https://www.youtube.com/watch?v=se62UwCxUrI","provider":"youtube","videoId":"se62UwCxUrI","title":"Inteligencia Emocional • Cómo Controlar las Emociones","transcriptHtml":""}$vdhb07j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Autorregulación emocional: técnicas para no reaccionar en caliente' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'icB39nq_NRg'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb07j${"source":"enlace","url":"https://www.youtube.com/watch?v=icB39nq_NRg","provider":"youtube","videoId":"icB39nq_NRg","title":"LA TÉCNICA SEMÁFORO (Técnicas de Autorregulación Emocional)","transcriptHtml":""}$vdhb07j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Estrés laboral y síndrome de burnout en profesionales de la salud: señales y prevención' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'CU72iaVezIg'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb07j${"source":"enlace","url":"https://www.youtube.com/watch?v=CU72iaVezIg","provider":"youtube","videoId":"CU72iaVezIg","title":"¿Tienes estos síntomas? Descubre si tienes BURNOUT (Enfermedad reconocida por la OMS)","transcriptHtml":""}$vdhb07j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Qué es la empatía: tipos, cómo se desarrolla y sus límites' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'eLWyIa7Fy_E'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb07j${"source":"enlace","url":"https://www.youtube.com/watch?v=eLWyIa7Fy_E","provider":"youtube","videoId":"eLWyIa7Fy_E","title":"Tipos de empatía | Empatía emocional y cognitiva","transcriptHtml":""}$vdhb07j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Empatía con el paciente: cómo responder a las emociones con el protocolo NURSE' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'NurO-wcHrW4'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb07j${"source":"enlace","url":"https://www.youtube.com/watch?v=NurO-wcHrW4","provider":"youtube","videoId":"NurO-wcHrW4","title":"Comunicación no empática VS comunicación empática","transcriptHtml":""}$vdhb07j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Habilidades sociales en el trabajo: influir, colaborar y construir confianza' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'LoHw4BkmROY'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb07j${"source":"enlace","url":"https://www.youtube.com/watch?v=LoHw4BkmROY","provider":"youtube","videoId":"LoHw4BkmROY","title":"La inteligencia emocional en el trabajo  | Gabriel Rodríguez González | TEDxBUAP","transcriptHtml":""}$vdhb07j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Resiliencia: cómo recuperarte de los golpes y diseñar tu plan de desarrollo emocional' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'ufX5sJBdf5Y'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb07j${"source":"enlace","url":"https://www.youtube.com/watch?v=ufX5sJBdf5Y","provider":"youtube","videoId":"ufX5sJBdf5Y","title":"👉 RESILIENCIA: como desarrollarla - Psicología | Manuel A. Escudero video 2/2","transcriptHtml":""}$vdhb07j$::jsonb);
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Videos complementarios de YouTube en cada clase (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
END
$vdhb07$;

-- ─── Curso de Liderazgo y Trabajo en Equipo ───
DO $vdhb08$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Liderazgo y Trabajo en Equipo' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Liderazgo y Trabajo en Equipo: se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Tipos de liderazgo: situacional, transformacional y de servicio, y cuándo usar cada uno' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'jYbGdjEl9l8'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb08j${"source":"enlace","url":"https://www.youtube.com/watch?v=jYbGdjEl9l8","provider":"youtube","videoId":"jYbGdjEl9l8","title":"El modelo de liderazgo situacional de Blanchard","transcriptHtml":""}$vdhb08j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'De técnico a líder: cómo asumir tu primer cargo de coordinación' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'MeQ0Qh7Iscw'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb08j${"source":"enlace","url":"https://www.youtube.com/watch?v=MeQ0Qh7Iscw","provider":"youtube","videoId":"MeQ0Qh7Iscw","title":"Ahora Yo Soy El Jefe - Consejos Para Ser Un Buen Líder | Rafael Ayala","transcriptHtml":""}$vdhb08j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Seguridad psicológica: la base de los equipos que aprenden y no esconden errores' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'Ms4FbDYXYoM'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb08j${"source":"enlace","url":"https://www.youtube.com/watch?v=Ms4FbDYXYoM","provider":"youtube","videoId":"Ms4FbDYXYoM","title":"Amy Edmondson en TEDxHGSE - Construyendo un lugar de trabajo Psicológicamente Seguro","transcriptHtml":""}$vdhb08j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Las 5 disfunciones de un equipo según Lencioni y cómo superarlas' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'cJrufv9A_P0'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb08j${"source":"enlace","url":"https://www.youtube.com/watch?v=cJrufv9A_P0","provider":"youtube","videoId":"cJrufv9A_P0","title":"Las 5 disfunciones de un equipo - Patrick Lencioni - Liderazgo","transcriptHtml":""}$vdhb08j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo delegar tareas de forma efectiva: qué, a quién y cómo' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'ETYyiq9ZX7g'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb08j${"source":"enlace","url":"https://www.youtube.com/watch?v=ETYyiq9ZX7g","provider":"youtube","videoId":"ETYyiq9ZX7g","title":"📋 Cómo DELEGAR tareas y proyectos en 6 pasos. Se un Líder ⭐","transcriptHtml":""}$vdhb08j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Reuniones efectivas y conversaciones 1:1: cómo hacer que el tiempo del equipo valga la pena' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '3zTwcSi_V7s'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb08j${"source":"enlace","url":"https://www.youtube.com/watch?v=3zTwcSi_V7s","provider":"youtube","videoId":"3zTwcSi_V7s","title":"Como hacer reuniones de trabajo efectivas | ⌚ Motivación en 2 Minutos | Daniel Colombo","transcriptHtml":""}$vdhb08j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo motivar a un equipo: autonomía, competencia, relación y reconocimiento' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'EyLbzN-xM-w'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb08j${"source":"enlace","url":"https://www.youtube.com/watch?v=EyLbzN-xM-w","provider":"youtube","videoId":"EyLbzN-xM-w","title":"¿COMO MOTIVAR A MI EQUIPO DE TRABAJO?  (4 tips!!)","transcriptHtml":""}$vdhb08j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Gestión del cambio: cómo liderar un cambio en tu equipo con los 8 pasos de Kotter' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'gLh-g0h6o4E'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb08j${"source":"enlace","url":"https://www.youtube.com/watch?v=gLh-g0h6o4E","provider":"youtube","videoId":"gLh-g0h6o4E","title":"Cómo facilitar el cambio organizacional - Modelo de 8 pasos de John Kotter","transcriptHtml":""}$vdhb08j$::jsonb);
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Videos complementarios de YouTube en cada clase (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
END
$vdhb08$;

-- ─── Curso de Servicio al Cliente y Comunicación con el Paciente ───
DO $vdhb09$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso de Servicio al Cliente y Comunicación con el Paciente' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso de Servicio al Cliente y Comunicación con el Paciente: se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Qué es el servicio al cliente en farmacia: de la venta a la experiencia del paciente' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'GSZWDcMjg6E'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb09j${"source":"enlace","url":"https://www.youtube.com/watch?v=GSZWDcMjg6E","provider":"youtube","videoId":"GSZWDcMjg6E","title":"ATENCIÓN Y SERVICIO AL CLIENTE EN FARMACIA","transcriptHtml":""}$vdhb09j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Protocolo de atención al cliente en droguería: momentos de verdad paso a paso' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'M0WqQBa3sRI'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb09j${"source":"enlace","url":"https://www.youtube.com/watch?v=M0WqQBa3sRI","provider":"youtube","videoId":"M0WqQBa3sRI","title":"Protocolo de atención al cliente","transcriptHtml":""}$vdhb09j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Comunicación con el paciente: lenguaje sencillo y la técnica de enseñar de vuelta (teach-back)' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'WszqqHEuZg8'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb09j${"source":"enlace","url":"https://www.youtube.com/watch?v=WszqqHEuZg8","provider":"youtube","videoId":"WszqqHEuZg8","title":"Estrategia 4: Teach – Back  - Educación Paciente y Familia","transcriptHtml":""}$vdhb09j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Información de medicamentos en el mostrador: qué decir, qué no decir y cuándo remitir' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '3Y4vKUC3ejQ'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb09j${"source":"enlace","url":"https://www.youtube.com/watch?v=3Y4vKUC3ejQ","provider":"youtube","videoId":"3Y4vKUC3ejQ","title":"04 Hospital Gregorio Marañón - CEIMI - Dispensación de medicamentos","transcriptHtml":""}$vdhb09j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Manejo de clientes difíciles y quejas: el método LAST paso a paso' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '_gwKLHUouXo'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb09j${"source":"enlace","url":"https://www.youtube.com/watch?v=_gwKLHUouXo","provider":"youtube","videoId":"_gwKLHUouXo","title":"Cómo lidiar con CLIENTES DIFÍCILES - Manejo de QUEJAS y RECLAMACIONES","transcriptHtml":""}$vdhb09j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo calmar a un cliente agresivo: técnicas de desescalamiento y seguridad' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'LO2fl6oNbPk'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb09j${"source":"enlace","url":"https://www.youtube.com/watch?v=LO2fl6oNbPk","provider":"youtube","videoId":"LO2fl6oNbPk","title":"“Cómo responder al agresivo verbal: 3 técnicas eficaces” - Bernardo Stamateas","transcriptHtml":""}$vdhb09j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Atención al cliente por WhatsApp y teléfono: protocolo, tiempos y protección de datos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'bHpo2JsNHnI'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb09j${"source":"enlace","url":"https://www.youtube.com/watch?v=bHpo2JsNHnI","provider":"youtube","videoId":"bHpo2JsNHnI","title":"🔥 ¿Cómo Crear En Protocolo De Atención Al Cliente Por WhatsApp? ¡Tutorial Práctico! ▶︎ [111]","transcriptHtml":""}$vdhb09j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo medir la satisfacción del cliente: NPS, CSAT, PQRS y mejora continua' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 's_2FavJOX5E'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb09j${"source":"enlace","url":"https://www.youtube.com/watch?v=s_2FavJOX5E","provider":"youtube","videoId":"s_2FavJOX5E","title":"Qué es CSAT (Customer Satisfaction Score) | Cómo medir la satisfacción de tus clientes","transcriptHtml":""}$vdhb09j$::jsonb);
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Videos complementarios de YouTube en cada clase (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
END
$vdhb09$;

-- ─── Curso para Hablar Frente a la Cámara: Oratoria Digital para Videos y Videollamadas ───
DO $vdhb10$
DECLARE
  v_curso BIGINT;
  v_clase BIGINT;
BEGIN
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Curso para Hablar Frente a la Cámara: Oratoria Digital para Videos y Videollamadas' AND deleted_at IS NULL LIMIT 1;
  IF v_curso IS NULL THEN
    RAISE NOTICE 'No existe Curso para Hablar Frente a la Cámara: Oratoria Digital para Videos y Videollamadas: se salta.';
    RETURN;
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Hablar en cámara vs. hablar en público: qué cambia y cómo perder el miedo a la cámara' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'TcYu0EGcyxs'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb10j${"source":"enlace","url":"https://www.youtube.com/watch?v=TcYu0EGcyxs","provider":"youtube","videoId":"TcYu0EGcyxs","title":"Cómo PERDER el MIEDO A GRABAR VÍDEOS 😱🎥  5 tips para hablar a cámara con naturalidad","transcriptHtml":""}$vdhb10j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo grabar videos con el celular: luz, encuadre y audio profesionales sin gastar mucho' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '_904BbqfjgA'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb10j${"source":"enlace","url":"https://www.youtube.com/watch?v=_904BbqfjgA","provider":"youtube","videoId":"_904BbqfjgA","title":"Clase 7 – Cómo grabar UGC con celular (luz, encuadre, audio) | Creator Deluxe","transcriptHtml":""}$vdhb10j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo hacer un guion para video: gancho, desarrollo y llamado a la acción en 60 segundos' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '_h2dEdos2Zw'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb10j${"source":"enlace","url":"https://www.youtube.com/watch?v=_h2dEdos2Zw","provider":"youtube","videoId":"_h2dEdos2Zw","title":"Cómo hacer GUIONES VIRALES para VIDEOS en REDES SOCIALES","transcriptHtml":""}$vdhb10j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Cómo hablar natural frente a la cámara: teleprompter, puntos clave y grabación por bloques' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'gQzp0ifFPlU'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb10j${"source":"enlace","url":"https://www.youtube.com/watch?v=gQzp0ifFPlU","provider":"youtube","videoId":"gQzp0ifFPlU","title":"Cómo hablar natural frente a la cámara (sin parecer un robot)","transcriptHtml":""}$vdhb10j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Voz y mirada en video: cómo conectar a través del lente' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'YlI-e4QJWG0'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb10j${"source":"enlace","url":"https://www.youtube.com/watch?v=YlI-e4QJWG0","provider":"youtube","videoId":"YlI-e4QJWG0","title":"Persuade con tu voz. Estrategias para sonar creíble. | Emma Rodero | TEDxMalagueta","transcriptHtml":""}$vdhb10j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Videollamadas y webinars profesionales: cómo dar un webinar que la gente vea hasta el final' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'lf6WptOmLM4'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb10j${"source":"enlace","url":"https://www.youtube.com/watch?v=lf6WptOmLM4","provider":"youtube","videoId":"lf6WptOmLM4","title":"Cómo Hacer Un Webinar -  Estructura De Tu Presentación","transcriptHtml":""}$vdhb10j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Contenido educativo de salud en redes sociales: ética, normativa y credibilidad' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = 'sdFsajH7vZE'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb10j${"source":"enlace","url":"https://www.youtube.com/watch?v=sdFsajH7vZE","provider":"youtube","videoId":"sdFsajH7vZE","title":"Divulgación científica desde un Servicio de Pediatría; rigor, ética y conciencia","transcriptHtml":""}$vdhb10j$::jsonb);
  END IF;

  SELECT id INTO v_clase FROM aula_lessons
   WHERE course_id = v_curso AND title = 'Plan de contenido de 30 días: temas, calendario, métricas y mejora continua' AND deleted_at IS NULL LIMIT 1;
  IF v_clase IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM aula_lesson_blocks WHERE lesson_id = v_clase AND type = 'video' AND data->>'videoId' = '4WvgfAt2-wI'
  ) THEN
    UPDATE aula_lesson_blocks SET sort_order = sort_order + 1 WHERE lesson_id = v_clase AND sort_order >= 1;
    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 1, $vdhb10j${"source":"enlace","url":"https://www.youtube.com/watch?v=4WvgfAt2-wI","provider":"youtube","videoId":"4WvgfAt2-wI","title":"Cómo crear un CALENDARIO DE CONTENIDO efectivo para redes sociales (+ PLANTILLA GRATUITA)","transcriptHtml":""}$vdhb10j$::jsonb);
  END IF;

  -- Ya publicado: se aprueba la versión nueva con los videos. Si todavía
  -- no tiene su primera versión, esa primera publicación ya los incluye.
  INSERT INTO aula_republicaciones_aprobadas (course_id, aprobado_por, nota)
  SELECT v_curso, 'Dirección académica de Edvanta', 'Videos complementarios de YouTube en cada clase (10-nov-2026).'
   WHERE EXISTS (SELECT 1 FROM aula_courses WHERE id = v_curso AND current_version_id IS NOT NULL);
END
$vdhb10$;

-- ============================================================
--  033_aula_curso_tiroides.sql — El curso de tiroides, en el Aula
--
--  El «Curso de autocuidado de la tiroides» ya existía en la
--  Academia FST (migración 007) con sus 8 clases en YouTube. Esta
--  migración lo cura dentro del Aula de Edvanta para verlo con el
--  formato de los cursos propios: unidad → clase → video arriba y
--  texto de apoyo debajo.
--
--  No toca nada de la Academia FST: solo lee de ella la estructura
--  que ya estaba escrita y la vuelve a armar del lado de Edvanta.
--
--  Queda en BORRADOR a propósito. Publicar un curso en el Aula crea
--  una versión congelada y asigna participantes; para mirarlo basta
--  la vista previa del administrador.
-- ============================================================

DO $$
DECLARE
  v_curso   BIGINT;
  v_unidad  BIGINT;
  v_clase   BIGINT;
  r         RECORD;
  v_unidad_actual TEXT := '';
BEGIN
  -- Idempotente: si ya se curó, no se duplica.
  SELECT id INTO v_curso FROM aula_courses
   WHERE kind = 'edvanta' AND title = 'Autocuidado de la tiroides' AND deleted_at IS NULL
   LIMIT 1;
  IF v_curso IS NOT NULL THEN
    RAISE NOTICE 'El curso de tiroides ya estaba curado (id %). No se hace nada.', v_curso;
    RETURN;
  END IF;

  INSERT INTO aula_courses (
    kind, title, short_description, cover_url, category, level, objective, audience,
    author_name, status, modality, duration_minutes, tags, learning_outcomes
  ) VALUES (
    'edvanta',
    'Autocuidado de la tiroides',
    'Comprende la función tiroidea, distingue hipotiroidismo de hipertiroidismo, organiza tus exámenes y usa los medicamentos tiroideos con mayor seguridad.',
    'https://i.ytimg.com/vi/RAUzM80hCO8/hqdefault.jpg',
    'Tiroides y autocuidado',
    'basico',
    'Que cada persona llegue a su consulta con mejores preguntas y entienda su tratamiento, sin reemplazar al equipo de salud.',
    'Personas con diagnóstico tiroideo y quienes acompañan a alguien con uno.',
    'Karla Hernández | Química farmacéutica',
    'borrador',
    'asincronica',
    120,
    ARRAY['tiroides', 'levotiroxina', 'autocuidado'],
    ARRAY[
      'Explicar para qué sirve la tiroides y qué miden TSH, T4 y T3',
      'Distinguir hipotiroidismo de hipertiroidismo sin autodiagnosticarse',
      'Tomar la levotiroxina siguiendo una rutina segura',
      'Reconocer las interacciones que alteran su absorción'
    ]
  ) RETURNING id INTO v_curso;

  -- Las tres unidades, en orden.
  FOR r IN
    SELECT * FROM (VALUES
      ('Empieza aquí', 0, 'Cómo recorrer el curso y hasta dónde llega.'),
      ('Comprende tu tiroides', 1, 'Qué hace la glándula, qué miden los exámenes y qué diferencia a cada diagnóstico.'),
      ('Medicamentos y autocuidado seguro', 2, 'Cómo se toman los medicamentos tiroideos y qué los interfiere.')
    ) AS t(titulo, orden, descripcion)
  LOOP
    INSERT INTO aula_modules (course_id, title, description, sort_order)
    VALUES (v_curso, r.titulo, r.descripcion, r.orden);
  END LOOP;

  -- Las ocho clases: video de YouTube arriba, texto de apoyo debajo.
  FOR r IN
    SELECT * FROM (VALUES
      ('Empieza aquí', 'Bienvenida: cómo usar este curso', 'RAUzM80hCO8', 0,
       'Conoce la ruta de aprendizaje, los límites educativos del curso y cómo aprovechar cada clase para preparar mejores preguntas para tu equipo de salud.'),
      ('Comprende tu tiroides', '¿Qué es la tiroides y para qué sirve?', 'wXWsqg5C9Bo', 0,
       'Revisa las funciones principales de la glándula tiroides y cómo sus hormonas se relacionan con diferentes sistemas del cuerpo.'),
      ('Comprende tu tiroides', 'Hipotiroidismo e hipertiroidismo: reconoce las diferencias', 'xGT7xSUJsKo', 1,
       'Aprende a distinguir conceptos y síntomas frecuentes sin usar esta información para autodiagnosticarte.'),
      ('Comprende tu tiroides', 'Exámenes tiroideos: TSH, T4, T3 y anticuerpos', 'AtqzSmGyCSI', 2,
       'Comprende qué información aportan las pruebas tiroideas y organiza tus resultados para conversarlos con el profesional tratante.'),
      ('Medicamentos y autocuidado seguro', 'Levotiroxina: cinco pasos para tomarla correctamente', 'BMzKMCmNcT0', 0,
       'Repasa una rutina práctica de administración y los puntos que conviene confirmar con tu médico o químico farmacéutico.'),
      ('Medicamentos y autocuidado seguro', 'Levotiroxina e interacciones: horarios, alimentos y suplementos', 'qt0EwrSIe-c', 1,
       'Identifica situaciones que pueden alterar la absorción y prepara preguntas sobre horarios, alimentos, calcio, hierro y otros productos.'),
      ('Medicamentos y autocuidado seguro', 'Antitiroideos: uso seguro, controles y riesgos', 'a1rAY7Fuo-I', 2,
       'Conoce aspectos generales del uso seguro de antitiroideos y la importancia de los controles y signos de alarma indicados por el equipo tratante.'),
      ('Medicamentos y autocuidado seguro', 'Autocuidado tiroideo: clase práctica', 'OZlLNr5semI', 3,
       'Integra los aprendizajes del curso en una clase práctica de autocuidado y organización del seguimiento.')
    ) AS t(unidad, titulo, video_id, orden, apoyo)
  LOOP
    SELECT id INTO v_unidad FROM aula_modules
     WHERE course_id = v_curso AND title = r.unidad AND deleted_at IS NULL
     LIMIT 1;

    INSERT INTO aula_lessons (course_id, module_id, title, sort_order, completion_rule)
    VALUES (v_curso, v_unidad, r.titulo, r.orden, 'video')
    RETURNING id INTO v_clase;

    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'video', 0, jsonb_build_object(
      'source', 'enlace',
      'url', 'https://youtu.be/' || r.video_id,
      'provider', 'youtube',
      'videoId', r.video_id,
      'title', r.titulo,
      'transcriptHtml', ''
    ));

    INSERT INTO aula_lesson_blocks (lesson_id, type, sort_order, data)
    VALUES (v_clase, 'texto', 1, jsonb_build_object(
      'html', '<p>' || replace(r.apoyo, '&', '&amp;') || '</p>'
    ));
  END LOOP;

  RAISE NOTICE 'Curso de tiroides curado en el Aula con id %.', v_curso;
END $$;

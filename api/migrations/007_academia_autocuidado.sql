-- Sala interactiva: Curso de autocuidado de la tiroides.
-- La migración es idempotente para que un redeploy no duplique contenido.

ALTER TABLE academia_courses ADD COLUMN IF NOT EXISTS instructor TEXT;
ALTER TABLE academia_courses ADD COLUMN IF NOT EXISTS channel_url TEXT;
ALTER TABLE academia_users ADD COLUMN IF NOT EXISTS privacy_accepted_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS academia_lesson_likes (
  lesson_id  BIGINT NOT NULL REFERENCES academia_lessons(id) ON DELETE CASCADE,
  user_id    BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (lesson_id, user_id)
);

CREATE TABLE IF NOT EXISTS academia_comment_likes (
  comment_id BIGINT NOT NULL REFERENCES academia_comments(id) ON DELETE CASCADE,
  user_id    BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (comment_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_academia_lesson_likes_lesson ON academia_lesson_likes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_academia_comment_likes_comment ON academia_comment_likes(comment_id);

INSERT INTO academia_courses (
  slug, title, description, category, cover_image, duration, class_count,
  is_published, instructor, channel_url
)
VALUES (
  'autocuidado-de-la-tiroides',
  'Curso de autocuidado de la tiroides',
  'Una ruta educativa para comprender la función tiroidea, reconocer diferencias entre hipotiroidismo e hipertiroidismo, organizar tus exámenes y usar los medicamentos tiroideos con mayor seguridad. El curso no reemplaza la consulta ni permite modificar tratamientos por cuenta propia.',
  'Tiroides y autocuidado',
  'https://i.ytimg.com/vi/RAUzM80hCO8/hqdefault.jpg',
  '8 clases · A tu ritmo',
  8,
  true,
  'Karla Hernández | Química farmacéutica',
  'https://www.youtube.com/@felizsintiroides'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  cover_image = EXCLUDED.cover_image,
  duration = EXCLUDED.duration,
  class_count = EXCLUDED.class_count,
  is_published = EXCLUDED.is_published,
  instructor = EXCLUDED.instructor,
  channel_url = EXCLUDED.channel_url,
  updated_at = NOW();

WITH course AS (
  SELECT id FROM academia_courses WHERE slug = 'autocuidado-de-la-tiroides'
)
INSERT INTO academia_modules (course_id, title, sort_order)
SELECT course.id, module.title, module.sort_order
FROM course
CROSS JOIN (VALUES
  ('Empieza aquí', 1),
  ('Comprende tu tiroides', 2),
  ('Medicamentos y autocuidado seguro', 3)
) AS module(title, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM academia_modules existing
  WHERE existing.course_id = course.id AND existing.title = module.title
);

WITH module AS (
  SELECT m.id FROM academia_modules m
  JOIN academia_courses c ON c.id = m.course_id
  WHERE c.slug = 'autocuidado-de-la-tiroides' AND m.title = 'Empieza aquí'
  ORDER BY m.id LIMIT 1
)
INSERT INTO academia_lessons (module_id, title, description, video_url, duration_min, sort_order, is_published)
SELECT module.id, lesson.title, lesson.description, lesson.video_url, 0, lesson.sort_order, true
FROM module
CROSS JOIN (VALUES
  ('Bienvenida: cómo usar este curso', 'Conoce la ruta de aprendizaje, los límites educativos del curso y cómo aprovechar cada clase para preparar mejores preguntas para tu equipo de salud.', 'https://youtu.be/RAUzM80hCO8', 1)
) AS lesson(title, description, video_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM academia_lessons existing WHERE existing.video_url = lesson.video_url);

WITH module AS (
  SELECT m.id FROM academia_modules m
  JOIN academia_courses c ON c.id = m.course_id
  WHERE c.slug = 'autocuidado-de-la-tiroides' AND m.title = 'Comprende tu tiroides'
  ORDER BY m.id LIMIT 1
)
INSERT INTO academia_lessons (module_id, title, description, video_url, duration_min, sort_order, is_published)
SELECT module.id, lesson.title, lesson.description, lesson.video_url, 0, lesson.sort_order, true
FROM module
CROSS JOIN (VALUES
  ('¿Qué es la tiroides y para qué sirve?', 'Revisa las funciones principales de la glándula tiroides y cómo sus hormonas se relacionan con diferentes sistemas del cuerpo.', 'https://youtu.be/wXWsqg5C9Bo', 1),
  ('Hipotiroidismo e hipertiroidismo: reconoce las diferencias', 'Aprende a distinguir conceptos y síntomas frecuentes sin usar esta información para autodiagnosticarte.', 'https://youtu.be/xGT7xSUJsKo', 2),
  ('Exámenes tiroideos: TSH, T4, T3 y anticuerpos', 'Comprende qué información aportan las pruebas tiroideas y organiza tus resultados para conversarlos con el profesional tratante.', 'https://youtu.be/AtqzSmGyCSI', 3)
) AS lesson(title, description, video_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM academia_lessons existing WHERE existing.video_url = lesson.video_url);

WITH module AS (
  SELECT m.id FROM academia_modules m
  JOIN academia_courses c ON c.id = m.course_id
  WHERE c.slug = 'autocuidado-de-la-tiroides' AND m.title = 'Medicamentos y autocuidado seguro'
  ORDER BY m.id LIMIT 1
)
INSERT INTO academia_lessons (module_id, title, description, video_url, duration_min, sort_order, is_published)
SELECT module.id, lesson.title, lesson.description, lesson.video_url, 0, lesson.sort_order, true
FROM module
CROSS JOIN (VALUES
  ('Levotiroxina: cinco pasos para tomarla correctamente', 'Repasa una rutina práctica de administración y los puntos que conviene confirmar con tu médico o químico farmacéutico.', 'https://youtu.be/BMzKMCmNcT0', 1),
  ('Levotiroxina e interacciones: horarios, alimentos y suplementos', 'Identifica situaciones que pueden alterar la absorción y prepara preguntas sobre horarios, alimentos, calcio, hierro y otros productos.', 'https://youtu.be/qt0EwrSIe-c', 2),
  ('Antitiroideos: uso seguro, controles y riesgos', 'Conoce aspectos generales del uso seguro de antitiroideos y la importancia de los controles y signos de alarma indicados por el equipo tratante.', 'https://youtu.be/a1rAY7Fuo-I', 3),
  ('Autocuidado tiroideo: clase práctica 5.1', 'Integra los aprendizajes del curso en una clase práctica de autocuidado y organización del seguimiento.', 'https://youtu.be/OZlLNr5semI', 4)
) AS lesson(title, description, video_url, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM academia_lessons existing WHERE existing.video_url = lesson.video_url);

UPDATE academia_courses course
SET class_count = (
  SELECT COUNT(*) FROM academia_lessons lesson
  JOIN academia_modules module ON module.id = lesson.module_id
  WHERE module.course_id = course.id AND lesson.is_published = true
), updated_at = NOW()
WHERE course.slug = 'autocuidado-de-la-tiroides';

-- ============================================================
-- 022_retos_fst_activa_quema.sql — Reto "Activa & Quema"
-- Reto evergreen de 7 días (movimiento y composición corporal).
-- Videos: recursos externos de YouTube (URL + video_id).
-- Idempotente: ON CONFLICT actualiza sin duplicar.
-- ============================================================

-- ─── Reto ────────────────────────────────────────────────────
INSERT INTO fst_challenges
  (title, slug, tagline, description, cover_image, primary_goal, category, instructor, level, equipment, average_duration, status, evergreen, featured, sort_order)
VALUES
  ('Activa & Quema', 'activa-quema',
   '7 días para volver a moverte.',
   'Este reto no se trata de hacer entrenamientos extremos durante una semana.

Durante 7 días vas a explorar diferentes formas de moverte: entrenamiento de cuerpo completo, caminata, Pilates, cardio de bajo impacto, fuerza, baile y recuperación.

Cada día tiene una misión diferente.

Tu objetivo no es hacerlo perfecto.

Tu objetivo es sumar movimiento, registrar cómo te sientes y completar tus 7 días.

A medida que avances podrás ver crecer tu progreso y acercarte a tu recompensa final.

Antes de empezar: adapta cada ejercicio a tu capacidad y condición actual. Puedes disminuir el ritmo, realizar modificaciones o detenerte cuando sea necesario. Si tienes una condición médica, estás en recuperación de una cirugía o tienes alguna restricción para realizar ejercicio, consulta con tu profesional tratante antes de iniciar.',
   '/img/retos/activa-quema.svg',
   'reduce_body_fat', 'Ejercicios para bajar de peso', 'MadFit / growwithjo / Move With Nicole / Heather Robertson', 'beginner', 'Sin equipo', '20–30 min', 'published', true, false, 13)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  tagline = EXCLUDED.tagline,
  description = EXCLUDED.description,
  cover_image = EXCLUDED.cover_image,
  primary_goal = EXCLUDED.primary_goal,
  category = EXCLUDED.category,
  instructor = EXCLUDED.instructor,
  level = EXCLUDED.level,
  equipment = EXCLUDED.equipment,
  average_duration = EXCLUDED.average_duration,
  status = EXCLUDED.status,
  evergreen = EXCLUDED.evergreen,
  featured = EXCLUDED.featured,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

-- ─── Días (7 días curados, cada uno con video propio) ────────
INSERT INTO fst_challenge_days
  (challenge_id, day_number, title, description, youtube_url, youtube_video_id, instructor, duration_minutes, difficulty, equipment, body_area, training_type, low_impact, beginner_friendly, nutrition_challenge, educational_note, sort_order, status)
SELECT c.id, d.day_number, d.title, d.description, d.youtube_url, d.youtube_video_id, d.instructor, d.duration_minutes::integer, d.difficulty, d.equipment, d.body_area, d.training_type, d.low_impact, d.beginner_friendly, d.nutrition_challenge, d.educational_note, d.day_number, 'published'
FROM fst_challenges c
JOIN (VALUES
  -- Día 1 · Activa (MadFit)
  ('activa-quema', 1, 'Día 1 — Activa tu cuerpo',
   'Hoy solo necesitamos empezar.

Tu primera clase está pensada para comenzar a mover todo el cuerpo sin equipamiento.

No necesitas seguir el mismo ritmo de la instructora todo el tiempo.

Haz las modificaciones que necesites y concéntrate en terminar sintiéndote bien.

Misión del día: completa tu primera sesión de movimiento.',
   'https://www.youtube.com/watch?v=rxLSAIbaHWQ', 'rxLSAIbaHWQ', 'MadFit', 20, 'beginner', 'Sin equipo', 'Full body', 'Cardio', false, true, NULL,
   'No necesitas hacer todos los movimientos exactamente como aparecen en el video. Adaptar también cuenta. Descansar cuando lo necesitas también forma parte de cuidar tu cuerpo.'),

  -- Día 2 · Walk & Glow (growwithjo)
  ('activa-quema', 2, 'Día 2 — Walk & Glow',
   'Hoy caminamos.

No todos los entrenamientos tienen que sentirse como una rutina tradicional.

Hoy vas a sumar pasos mientras mantienes tu cuerpo en movimiento.

Pon el video, busca un espacio cómodo y deja que la música haga el resto.

Misión del día: completa la caminata siguiendo tu propio ritmo.

Bonus del día: ¿puedes sumar otros 5–10 minutos de caminata durante tu día? No es obligatorio para completar el día.',
   'https://www.youtube.com/watch?v=htNphBVfl4w', 'htNphBVfl4w', 'growwithjo', 32, 'beginner', 'Sin equipo', 'Full body', 'Caminata', true, true, NULL,
   'No necesitas hacer todos los movimientos exactamente como aparecen en el video. Adaptar también cuenta. Descansar cuando lo necesitas también forma parte de cuidar tu cuerpo.'),

  -- Día 3 · Pilates Girl (Move With Nicole)
  ('activa-quema', 3, 'Día 3 — Pilates Girl',
   'Hoy cambiamos el ritmo.

Menos velocidad. Más control.

Pilates nos permitirá trabajar estabilidad, coordinación y diferentes grupos musculares sin convertir todos los días del reto en sesiones cardiovasculares.

Concéntrate más en controlar el movimiento que en hacerlo rápido.

Misión del día: completa tu sesión de Pilates prestando atención a tu respiración y control corporal.',
   'https://www.youtube.com/watch?v=y2RcYo36boM', 'y2RcYo36boM', 'Move With Nicole', 20, 'beginner', 'Mat', 'Full body', 'Pilates', true, true, NULL,
   'No necesitas hacer todos los movimientos exactamente como aparecen en el video. Adaptar también cuenta. Descansar cuando lo necesitas también forma parte de cuidar tu cuerpo.'),

  -- Día 4 · Low Impact (Heather Robertson)
  ('activa-quema', 4, 'Día 4 — Low Impact Cardio',
   'Llegamos a la mitad.

Hoy volvemos al cardio, pero sin necesidad de saltos.

Low impact no significa que tengas que seguir cada movimiento exactamente igual.

Controla tu intensidad y adapta el ritmo cuando lo necesites.

Misión del día: mantente en movimiento durante la sesión y encuentra un ritmo que puedas sostener.',
   'https://www.youtube.com/watch?v=cA11MYXhBfI', 'cA11MYXhBfI', 'Heather Robertson', 20, 'beginner', 'Sin equipo', 'Full body', 'Low impact', true, true, NULL,
   'No necesitas hacer todos los movimientos exactamente como aparecen en el video. Adaptar también cuenta. Descansar cuando lo necesitas también forma parte de cuidar tu cuerpo.'),

  -- Día 5 · Strong Girl (MadFit)
  ('activa-quema', 5, 'Día 5 — Strong Girl',
   'Hoy no venimos solamente a sudar.

También queremos trabajar fuerza.

Esta sesión utiliza ejercicios de cuerpo completo con resistencia.

Elige un peso que puedas controlar manteniendo una técnica cómoda.

¿No tienes mancuernas? Puedes utilizar un peso ligero que puedas controlar con seguridad o realizar los movimientos inicialmente sin carga externa.

Misión del día: completa tu entrenamiento de fuerza sin sacrificar control por velocidad.',
   'https://www.youtube.com/watch?v=P_ouE8obuoU', 'P_ouE8obuoU', 'MadFit', 20, 'intermediate', 'Mancuernas', 'Full body', 'Fuerza', false, false, NULL,
   'No necesitas hacer todos los movimientos exactamente como aparecen en el video. Adaptar también cuenta. Descansar cuando lo necesitas también forma parte de cuidar tu cuerpo.'),

  -- Día 6 · Dance & Glow (growwithjo)
  ('activa-quema', 6, 'Día 6 — Dance & Glow',
   'Hoy entrenar se parece más a bailar.

Llegaste al Día 6.

Por eso hoy quiero que la misión sea sencilla: pon el video y muévete.

No te preocupes por hacer todos los pasos exactamente iguales.

Misión del día: baila, muévete y disfruta estos 20 minutos.',
   'https://www.youtube.com/watch?v=ZMMvR57l_zc', 'ZMMvR57l_zc', 'growwithjo', 20, 'beginner', 'Sin equipo', 'Full body', 'Cardio', true, true, NULL,
   'No necesitas hacer todos los movimientos exactamente como aparecen en el video. Adaptar también cuenta. Descansar cuando lo necesitas también forma parte de cuidar tu cuerpo.'),

  -- Día 7 · Soft Girl Reset (Move With Nicole)
  ('activa-quema', 7, 'Día 7 — Soft Girl Reset',
   'Llegaste al Día 7.

Y para terminar no necesitamos hacer el entrenamiento más duro de la semana.

Hoy bajamos el ritmo.

Después de seis días explorando diferentes formas de movimiento, terminamos con una sesión suave dedicada a movilidad, respiración y recuperación.

Misión final: regálate estos últimos 20 minutos.',
   'https://www.youtube.com/watch?v=8cltCOUpYTQ', '8cltCOUpYTQ', 'Move With Nicole', 20, 'beginner', 'Mat', 'Movilidad', 'Yoga', true, true, NULL,
   'No necesitas hacer todos los movimientos exactamente como aparecen en el video. Adaptar también cuenta. Descansar cuando lo necesitas también forma parte de cuidar tu cuerpo.')
) AS d(slug, day_number, title, description, youtube_url, youtube_video_id, instructor, duration_minutes, difficulty, equipment, body_area, training_type, low_impact, beginner_friendly, nutrition_challenge, educational_note)
ON c.slug = d.slug
ON CONFLICT (challenge_id, day_number) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  youtube_url = EXCLUDED.youtube_url,
  youtube_video_id = EXCLUDED.youtube_video_id,
  instructor = EXCLUDED.instructor,
  duration_minutes = EXCLUDED.duration_minutes,
  difficulty = EXCLUDED.difficulty,
  equipment = EXCLUDED.equipment,
  body_area = EXCLUDED.body_area,
  training_type = EXCLUDED.training_type,
  low_impact = EXCLUDED.low_impact,
  beginner_friendly = EXCLUDED.beginner_friendly,
  nutrition_challenge = EXCLUDED.nutrition_challenge,
  educational_note = EXCLUDED.educational_note,
  sort_order = EXCLUDED.sort_order,
  status = EXCLUDED.status,
  updated_at = NOW();

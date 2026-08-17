-- ============================================================
-- 020_retos_fst_seed.sql — Seed inicial de Retos FST
-- 12 retos evergreen con 7 días cada uno.
-- Videos: recursos externos de YouTube (solo URL + video_id).
-- Metadatos no verificados quedan NULL para revisión en admin.
-- Idempotente: ON CONFLICT actualiza sin duplicar.
-- ============================================================

-- ─── Retos ──────────────────────────────────────────────────
INSERT INTO fst_challenges
  (title, slug, tagline, description, cover_image, primary_goal, category, instructor, level, equipment, average_duration, status, evergreen, featured, sort_order)
VALUES
  ('Pilates Princess', 'pilates-princess',
   '7 días para moverte bonito.',
   'Una semana de Pilates, core, movilidad y movimiento full body para conectar con tu cuerpo y construir una rutina suave pero constante.',
   '/img/retos/pilates-princess.svg',
   'maintain_wellbeing', 'Pilates', 'Move With Nicole', 'beginner', 'Mat', '20–30 min', 'published', true, true, 1),
  ('Booty Bloom', 'booty-bloom',
   'Construye fuerza desde abajo.',
   'Siete días de activación, resistencia y trabajo de tren inferior para fortalecer glúteos y piernas con progresión amable.',
   '/img/retos/booty-bloom.svg',
   'muscle_gain', 'Glúteos', 'Pamela Reif', 'intermediate', 'Mat', '20–30 min', 'published', true, false, 2),
  ('Core Girl', 'core-girl',
   'Conecta con tu centro.',
   'Abdominales, deep core, estabilidad y control corporal en una semana pensada para fortalecer tu centro.',
   '/img/retos/core-girl.svg',
   'maintain_wellbeing', 'Core', 'Lilly Sabri', 'intermediate', 'Mat', '20–30 min', 'published', true, false, 3),
  ('Abs & Booty', 'abs-booty',
   'Core + glúteos en una misma semana.',
   'Una semana que combina trabajo de abdomen y glúteos para entrenar tu centro y tu tren inferior en la misma rutina.',
   '/img/retos/abs-booty.svg',
   'muscle_gain', 'Core y glúteos', 'Move With Nicole / Pamela Reif', 'intermediate', 'Mat', '20–30 min', 'published', true, false, 4),
  ('Walk & Glow', 'walk-glow',
   'Camina, muévete y suma minutos activos.',
   'Indoor walking, pasos y cardio low impact para sumar minutos de movimiento sin impacto agresivo.',
   '/img/retos/walk-glow.svg',
   'reduce_body_fat', 'Caminata', 'growwithjo', 'beginner', 'Sin equipo', '20–30 min', 'published', true, false, 5),
  ('Strong Girl', 'strong-girl',
   'Ser fuerte también es cuidarte.',
   'Resistencia, fuerza y progresión full body para construir una versión más fuerte de ti, una semana a la vez.',
   '/img/retos/strong-girl.svg',
   'muscle_gain', 'Fuerza', 'MadFit', 'intermediate', 'Mancuernas', '20–30 min', 'published', true, false, 6),
  ('Legs & Booty', 'legs-booty',
   'Piernas fuertes. Glúteos fuertes. Tú fuerte.',
   'Siete días de tren inferior: piernas y glúteos con fuerza y control para sentirte estable y capaz.',
   '/img/retos/legs-booty.svg',
   'muscle_gain', 'Piernas y glúteos', 'Pamela Reif / MadFit', 'intermediate', 'Mat', '20–30 min', 'published', true, false, 7),
  ('Low Impact Girl', 'low-impact-girl',
   'Muévete sin necesidad de saltar.',
   'Cardio y movimiento de bajo impacto para mantenerte activa cuidando tus articulaciones.',
   '/img/retos/low-impact-girl.svg',
   'maintain_wellbeing', 'Low impact', NULL, 'beginner', 'Sin equipo', '20–30 min', 'published', true, false, 8),
  ('10-Minute Girl', '10-minute-girl',
   'Diez minutos también cuentan.',
   'Sesiones cortas y efectivas para los días en los que el tiempo no sobra. Diez minutos también construyen hábito.',
   '/img/retos/10-minute-girl.svg',
   'maintain_wellbeing', 'Sesiones cortas', NULL, 'beginner', 'Sin equipo', '5–10 min', 'published', true, false, 9),
  ('Full Body Girl', 'full-body-girl',
   'Una semana para mover todo tu cuerpo.',
   'Entrenamientos full body para activar todos los grupos musculares y sentir tu cuerpo completo en movimiento.',
   '/img/retos/full-body-girl.svg',
   'reduce_body_fat', 'Full body', NULL, 'intermediate', 'Sin equipo', '20–30 min', 'published', true, false, 10),
  ('Dumbbell Girl', 'dumbbell-girl',
   'Tu semana de fuerza en casa.',
   'Fuerza con mancuernas para entrenar en casa con progresión, incluyendo brazos y upper body.',
   '/img/retos/dumbbell-girl.svg',
   'muscle_gain', 'Fuerza en casa', NULL, 'intermediate', 'Mancuernas', '20–30 min', 'published', true, false, 11),
  ('Soft Girl Reset', 'soft-girl-reset',
   'Baja el ritmo. Sigue moviéndote.',
   'Stretching, yoga, movilidad, recuperación y Pilates suave para resetear tu cuerpo sin dejar de moverte.',
   '/img/retos/soft-girl-reset.svg',
   'maintain_wellbeing', 'Recuperación', 'Move With Nicole', 'beginner', 'Mat', '20–30 min', 'published', true, false, 12)
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

-- ─── Días (7 por reto; días 5–7 repiten sesiones 1–3) ───────
-- nutrition_challenge rota los 7 microretos educativos.
INSERT INTO fst_challenge_days
  (challenge_id, day_number, title, description, youtube_url, youtube_video_id, instructor, duration_minutes, difficulty, equipment, body_area, training_type, low_impact, beginner_friendly, nutrition_challenge, sort_order, status)
SELECT c.id, d.day_number, d.title, d.description, d.youtube_url, d.youtube_video_id, d.instructor, d.duration_minutes, d.difficulty, d.equipment, d.body_area, d.training_type, d.low_impact, d.beginner_friendly, d.nutrition_challenge, d.day_number, 'published'
FROM fst_challenges c
JOIN (VALUES
  -- Pilates Princess (Move With Nicole)
  ('pilates-princess', 1, 'Sesión 1 · Pilates', NULL, 'https://www.youtube.com/watch?v=C2HX2pNbUCM', 'C2HX2pNbUCM', 'Move With Nicole', NULL, NULL, 'Mat', 'Full body', 'Pilates', true, true, 'incluye una fuente de proteína en una comida principal'),
  ('pilates-princess', 2, 'Sesión 2 · Pilates', NULL, 'https://www.youtube.com/watch?v=2mkR5LPhOC4', '2mkR5LPhOC4', 'Move With Nicole', NULL, NULL, 'Mat', 'Full body', 'Pilates', true, true, 'suma una porción de vegetales'),
  ('pilates-princess', 3, 'Sesión 3 · Pilates', NULL, 'https://www.youtube.com/watch?v=y2RcYo36boM', 'y2RcYo36boM', 'Move With Nicole', NULL, NULL, 'Mat', 'Full body', 'Pilates', true, true, 'organiza tu hidratación'),
  ('pilates-princess', 4, 'Sesión 4 · Pilates', NULL, 'https://www.youtube.com/watch?v=ljtJM15YxXs', 'ljtJM15YxXs', 'Move With Nicole', NULL, NULL, 'Mat', 'Full body', 'Pilates', true, true, 'planifica tu desayuno'),
  ('pilates-princess', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=C2HX2pNbUCM', 'C2HX2pNbUCM', 'Move With Nicole', NULL, NULL, 'Mat', 'Full body', 'Pilates', true, true, 'prepara tu comida antes de tener hambre'),
  ('pilates-princess', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=2mkR5LPhOC4', '2mkR5LPhOC4', 'Move With Nicole', NULL, NULL, 'Mat', 'Full body', 'Pilates', true, true, 'identifica una fuente de fibra'),
  ('pilates-princess', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=y2RcYo36boM', 'y2RcYo36boM', 'Move With Nicole', NULL, NULL, 'Mat', 'Full body', 'Pilates', true, true, 'planifica tus compras'),

  -- Booty Bloom (Pamela Reif)
  ('booty-bloom', 1, 'Sesión 1 · Glúteos', NULL, 'https://www.youtube.com/watch?v=ZsthLQrpY6g', 'ZsthLQrpY6g', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'incluye una fuente de proteína en una comida principal'),
  ('booty-bloom', 2, 'Sesión 2 · Glúteos', NULL, 'https://www.youtube.com/watch?v=7GV8zZd23KU', '7GV8zZd23KU', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'suma una porción de vegetales'),
  ('booty-bloom', 3, 'Sesión 3 · Glúteos', NULL, 'https://www.youtube.com/watch?v=hhycA0zZXZM', 'hhycA0zZXZM', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'organiza tu hidratación'),
  ('booty-bloom', 4, 'Sesión 4 · Glúteos', NULL, 'https://www.youtube.com/watch?v=irrXLzbTm2A', 'irrXLzbTm2A', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'planifica tu desayuno'),
  ('booty-bloom', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=ZsthLQrpY6g', 'ZsthLQrpY6g', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'prepara tu comida antes de tener hambre'),
  ('booty-bloom', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=7GV8zZd23KU', '7GV8zZd23KU', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'identifica una fuente de fibra'),
  ('booty-bloom', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=hhycA0zZXZM', 'hhycA0zZXZM', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'planifica tus compras'),

  -- Core Girl (Lilly Sabri)
  ('core-girl', 1, 'Sesión 1 · Core', NULL, 'https://www.youtube.com/watch?v=h7K7ASmcQZk', 'h7K7ASmcQZk', 'Lilly Sabri', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'incluye una fuente de proteína en una comida principal'),
  ('core-girl', 2, 'Sesión 2 · Core', NULL, 'https://www.youtube.com/watch?v=XM05zeeQenw', 'XM05zeeQenw', 'Lilly Sabri', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'suma una porción de vegetales'),
  ('core-girl', 3, 'Sesión 3 · Core', NULL, 'https://www.youtube.com/watch?v=BIOOvjz5H1k', 'BIOOvjz5H1k', 'Lilly Sabri', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'organiza tu hidratación'),
  ('core-girl', 4, 'Sesión 4 · Core', NULL, 'https://www.youtube.com/watch?v=UBnfm4s7CRA', 'UBnfm4s7CRA', 'Lilly Sabri', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'planifica tu desayuno'),
  ('core-girl', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=h7K7ASmcQZk', 'h7K7ASmcQZk', 'Lilly Sabri', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'prepara tu comida antes de tener hambre'),
  ('core-girl', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=XM05zeeQenw', 'XM05zeeQenw', 'Lilly Sabri', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'identifica una fuente de fibra'),
  ('core-girl', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=BIOOvjz5H1k', 'BIOOvjz5H1k', 'Lilly Sabri', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'planifica tus compras'),

  -- Abs & Booty (Move With Nicole / Pamela Reif)
  ('abs-booty', 1, 'Sesión 1 · Core y glúteos', NULL, 'https://www.youtube.com/watch?v=TTkUAx357-s', 'TTkUAx357-s', 'Move With Nicole', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'incluye una fuente de proteína en una comida principal'),
  ('abs-booty', 2, 'Sesión 2 · Core y glúteos', NULL, 'https://www.youtube.com/watch?v=2f4H4nIsVVA', '2f4H4nIsVVA', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'suma una porción de vegetales'),
  ('abs-booty', 3, 'Sesión 3 · Core y glúteos', NULL, 'https://www.youtube.com/watch?v=KQ6b-_dC1Mo', 'KQ6b-_dC1Mo', 'Pamela Reif', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'organiza tu hidratación'),
  ('abs-booty', 4, 'Sesión 4 · Core y glúteos', NULL, 'https://www.youtube.com/watch?v=fQJXQI5iEqE', 'fQJXQI5iEqE', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'planifica tu desayuno'),
  ('abs-booty', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=TTkUAx357-s', 'TTkUAx357-s', 'Move With Nicole', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'prepara tu comida antes de tener hambre'),
  ('abs-booty', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=2f4H4nIsVVA', '2f4H4nIsVVA', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'identifica una fuente de fibra'),
  ('abs-booty', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=KQ6b-_dC1Mo', 'KQ6b-_dC1Mo', 'Pamela Reif', NULL, NULL, 'Mat', 'Abdomen / Core', 'Core', false, false, 'planifica tus compras'),

  -- Walk & Glow (growwithjo)
  ('walk-glow', 1, 'Sesión 1 · Caminata', NULL, 'https://www.youtube.com/watch?v=yV4jyj8Hr1g', 'yV4jyj8Hr1g', 'growwithjo', NULL, NULL, 'Sin equipo', 'Full body', 'Caminata', true, true, 'incluye una fuente de proteína en una comida principal'),
  ('walk-glow', 2, 'Sesión 2 · Caminata', NULL, 'https://www.youtube.com/watch?v=YNU76Cpi1_M', 'YNU76Cpi1_M', 'growwithjo', NULL, NULL, 'Sin equipo', 'Full body', 'Caminata', true, true, 'suma una porción de vegetales'),
  ('walk-glow', 3, 'Sesión 3 · Caminata', NULL, 'https://www.youtube.com/watch?v=nmNCH-Ueq8E', 'nmNCH-Ueq8E', 'growwithjo', NULL, NULL, 'Sin equipo', 'Full body', 'Caminata', true, true, 'organiza tu hidratación'),
  ('walk-glow', 4, 'Sesión 4 · Caminata', NULL, 'https://www.youtube.com/watch?v=vJS9a1mpYGw', 'vJS9a1mpYGw', 'growwithjo', NULL, NULL, 'Sin equipo', 'Full body', 'Caminata', true, true, 'planifica tu desayuno'),
  ('walk-glow', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=yV4jyj8Hr1g', 'yV4jyj8Hr1g', 'growwithjo', NULL, NULL, 'Sin equipo', 'Full body', 'Caminata', true, true, 'prepara tu comida antes de tener hambre'),
  ('walk-glow', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=YNU76Cpi1_M', 'YNU76Cpi1_M', 'growwithjo', NULL, NULL, 'Sin equipo', 'Full body', 'Caminata', true, true, 'identifica una fuente de fibra'),
  ('walk-glow', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=nmNCH-Ueq8E', 'nmNCH-Ueq8E', 'growwithjo', NULL, NULL, 'Sin equipo', 'Full body', 'Caminata', true, true, 'planifica tus compras'),

  -- Strong Girl (MadFit)
  ('strong-girl', 1, 'Sesión 1 · Fuerza', NULL, 'https://www.youtube.com/watch?v=7WzCds5u8GI', '7WzCds5u8GI', 'MadFit', NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'incluye una fuente de proteína en una comida principal'),
  ('strong-girl', 2, 'Sesión 2 · Fuerza', NULL, 'https://www.youtube.com/watch?v=Fihj6SW1V3Q', 'Fihj6SW1V3Q', 'MadFit', NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'suma una porción de vegetales'),
  ('strong-girl', 3, 'Sesión 3 · Fuerza', NULL, 'https://www.youtube.com/watch?v=wZOcrp3nsnk', 'wZOcrp3nsnk', 'MadFit', NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'organiza tu hidratación'),
  ('strong-girl', 4, 'Sesión 4 · Fuerza', NULL, 'https://www.youtube.com/watch?v=GFvJ9HrUeEE', 'GFvJ9HrUeEE', 'MadFit', NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'planifica tu desayuno'),
  ('strong-girl', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=7WzCds5u8GI', '7WzCds5u8GI', 'MadFit', NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'prepara tu comida antes de tener hambre'),
  ('strong-girl', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=Fihj6SW1V3Q', 'Fihj6SW1V3Q', 'MadFit', NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'identifica una fuente de fibra'),
  ('strong-girl', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=wZOcrp3nsnk', 'wZOcrp3nsnk', 'MadFit', NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'planifica tus compras'),

  -- Legs & Booty (Pamela Reif / MadFit)
  ('legs-booty', 1, 'Sesión 1 · Piernas y glúteos', NULL, 'https://www.youtube.com/watch?v=R1EKAgFRe2E', 'R1EKAgFRe2E', 'Pamela Reif', NULL, NULL, 'Mat', 'Piernas', 'Fuerza', false, false, 'incluye una fuente de proteína en una comida principal'),
  ('legs-booty', 2, 'Sesión 2 · Piernas y glúteos', NULL, 'https://www.youtube.com/watch?v=Fu_oExrPX68', 'Fu_oExrPX68', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'suma una porción de vegetales'),
  ('legs-booty', 3, 'Sesión 3 · Piernas y glúteos', NULL, 'https://www.youtube.com/watch?v=iCG4zlvuUok', 'iCG4zlvuUok', 'MadFit', NULL, NULL, 'Mat', 'Piernas', 'Fuerza', false, false, 'organiza tu hidratación'),
  ('legs-booty', 4, 'Sesión 4 · Piernas y glúteos', NULL, 'https://www.youtube.com/watch?v=BFRYY12wQtc', 'BFRYY12wQtc', 'MadFit', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'planifica tu desayuno'),
  ('legs-booty', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=R1EKAgFRe2E', 'R1EKAgFRe2E', 'Pamela Reif', NULL, NULL, 'Mat', 'Piernas', 'Fuerza', false, false, 'prepara tu comida antes de tener hambre'),
  ('legs-booty', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=Fu_oExrPX68', 'Fu_oExrPX68', 'Pamela Reif', NULL, NULL, 'Mat', 'Glúteos', 'Glúteos', false, false, 'identifica una fuente de fibra'),
  ('legs-booty', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=iCG4zlvuUok', 'iCG4zlvuUok', 'MadFit', NULL, NULL, 'Mat', 'Piernas', 'Fuerza', false, false, 'planifica tus compras'),

  -- Low Impact Girl
  ('low-impact-girl', 1, 'Sesión 1 · Low impact', NULL, 'https://www.youtube.com/watch?v=m1DBJhxKmiU', 'm1DBJhxKmiU', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'incluye una fuente de proteína en una comida principal'),
  ('low-impact-girl', 2, 'Sesión 2 · Low impact', NULL, 'https://www.youtube.com/watch?v=0lDZwCj7l6w', '0lDZwCj7l6w', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'suma una porción de vegetales'),
  ('low-impact-girl', 3, 'Sesión 3 · Low impact', NULL, 'https://www.youtube.com/watch?v=DkLISiTHRjU', 'DkLISiTHRjU', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'organiza tu hidratación'),
  ('low-impact-girl', 4, 'Sesión 4 · Low impact', NULL, 'https://www.youtube.com/watch?v=KQ6b-_dC1Mo', 'KQ6b-_dC1Mo', NULL, NULL, NULL, 'Sin equipo', 'Abdomen / Core', 'Low impact', true, true, 'planifica tu desayuno'),
  ('low-impact-girl', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=m1DBJhxKmiU', 'm1DBJhxKmiU', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'prepara tu comida antes de tener hambre'),
  ('low-impact-girl', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=0lDZwCj7l6w', '0lDZwCj7l6w', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'identifica una fuente de fibra'),
  ('low-impact-girl', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=DkLISiTHRjU', 'DkLISiTHRjU', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'planifica tus compras'),

  -- 10-Minute Girl
  ('10-minute-girl', 1, 'Sesión 1 · 10 minutos', NULL, 'https://www.youtube.com/watch?v=136ZLuy40TE', '136ZLuy40TE', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'incluye una fuente de proteína en una comida principal'),
  ('10-minute-girl', 2, 'Sesión 2 · 10 minutos', NULL, 'https://www.youtube.com/watch?v=vjEAmyKgve0', 'vjEAmyKgve0', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'suma una porción de vegetales'),
  ('10-minute-girl', 3, 'Sesión 3 · 10 minutos', NULL, 'https://www.youtube.com/watch?v=FGFfqCjtmS8', 'FGFfqCjtmS8', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'organiza tu hidratación'),
  ('10-minute-girl', 4, 'Sesión 4 · 10 minutos', NULL, 'https://www.youtube.com/watch?v=f2HbWMSV9Go', 'f2HbWMSV9Go', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'planifica tu desayuno'),
  ('10-minute-girl', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=136ZLuy40TE', '136ZLuy40TE', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'prepara tu comida antes de tener hambre'),
  ('10-minute-girl', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=vjEAmyKgve0', 'vjEAmyKgve0', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'identifica una fuente de fibra'),
  ('10-minute-girl', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=FGFfqCjtmS8', 'FGFfqCjtmS8', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Low impact', true, true, 'planifica tus compras'),

  -- Full Body Girl
  ('full-body-girl', 1, 'Sesión 1 · Full body', NULL, 'https://www.youtube.com/watch?v=UBMk30rjy0o', 'UBMk30rjy0o', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Fuerza', false, false, 'incluye una fuente de proteína en una comida principal'),
  ('full-body-girl', 2, 'Sesión 2 · Full body', NULL, 'https://www.youtube.com/watch?v=Y2eOW7XYWxc', 'Y2eOW7XYWxc', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Fuerza', false, false, 'suma una porción de vegetales'),
  ('full-body-girl', 3, 'Sesión 3 · Full body', NULL, 'https://www.youtube.com/watch?v=UItWltVZZmE', 'UItWltVZZmE', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Fuerza', false, false, 'organiza tu hidratación'),
  ('full-body-girl', 4, 'Sesión 4 · Full body', NULL, 'https://www.youtube.com/watch?v=H38ach0TmWM', 'H38ach0TmWM', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Fuerza', false, false, 'planifica tu desayuno'),
  ('full-body-girl', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=UBMk30rjy0o', 'UBMk30rjy0o', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Fuerza', false, false, 'prepara tu comida antes de tener hambre'),
  ('full-body-girl', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=Y2eOW7XYWxc', 'Y2eOW7XYWxc', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Fuerza', false, false, 'identifica una fuente de fibra'),
  ('full-body-girl', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=UItWltVZZmE', 'UItWltVZZmE', NULL, NULL, NULL, 'Sin equipo', 'Full body', 'Fuerza', false, false, 'planifica tus compras'),

  -- Dumbbell Girl
  ('dumbbell-girl', 1, 'Sesión 1 · Mancuernas', NULL, 'https://www.youtube.com/watch?v=upQrEnkb53I', 'upQrEnkb53I', NULL, NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'incluye una fuente de proteína en una comida principal'),
  ('dumbbell-girl', 2, 'Sesión 2 · Mancuernas', NULL, 'https://www.youtube.com/watch?v=QzQwKiIVAZM', 'QzQwKiIVAZM', NULL, NULL, NULL, 'Mancuernas', 'Brazos / Upper body', 'Fuerza', false, false, 'suma una porción de vegetales'),
  ('dumbbell-girl', 3, 'Sesión 3 · Mancuernas', NULL, 'https://www.youtube.com/watch?v=GJiEUi92-xE', 'GJiEUi92-xE', NULL, NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'organiza tu hidratación'),
  ('dumbbell-girl', 4, 'Sesión 4 · Mancuernas', NULL, 'https://www.youtube.com/watch?v=-CWPIgK4G-k', '-CWPIgK4G-k', NULL, NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'planifica tu desayuno'),
  ('dumbbell-girl', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=upQrEnkb53I', 'upQrEnkb53I', NULL, NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'prepara tu comida antes de tener hambre'),
  ('dumbbell-girl', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=QzQwKiIVAZM', 'QzQwKiIVAZM', NULL, NULL, NULL, 'Mancuernas', 'Brazos / Upper body', 'Fuerza', false, false, 'identifica una fuente de fibra'),
  ('dumbbell-girl', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=GJiEUi92-xE', 'GJiEUi92-xE', NULL, NULL, NULL, 'Mancuernas', 'Full body', 'Fuerza', false, false, 'planifica tus compras'),

  -- Soft Girl Reset (Move With Nicole)
  ('soft-girl-reset', 1, 'Sesión 1 · Movilidad suave', NULL, 'https://www.youtube.com/watch?v=YKtDkKUHtPU', 'YKtDkKUHtPU', 'Move With Nicole', NULL, NULL, 'Mat', 'Movilidad', 'Movilidad', true, true, 'incluye una fuente de proteína en una comida principal'),
  ('soft-girl-reset', 2, 'Sesión 2 · Movilidad suave', NULL, 'https://www.youtube.com/watch?v=RvCntPg7oPE', 'RvCntPg7oPE', 'Move With Nicole', NULL, NULL, 'Mat', 'Movilidad', 'Movilidad', true, true, 'suma una porción de vegetales'),
  ('soft-girl-reset', 3, 'Sesión 3 · Movilidad suave', NULL, 'https://www.youtube.com/watch?v=D0LvavdptdM', 'D0LvavdptdM', 'Move With Nicole', NULL, NULL, 'Mat', 'Movilidad', 'Movilidad', true, true, 'organiza tu hidratación'),
  ('soft-girl-reset', 4, 'Sesión 4 · Movilidad suave', NULL, 'https://www.youtube.com/watch?v=8cltCOUpYTQ', '8cltCOUpYTQ', 'Move With Nicole', NULL, NULL, 'Mat', 'Movilidad', 'Movilidad', true, true, 'planifica tu desayuno'),
  ('soft-girl-reset', 5, 'Sesión 5 · Repite la sesión 1', NULL, 'https://www.youtube.com/watch?v=YKtDkKUHtPU', 'YKtDkKUHtPU', 'Move With Nicole', NULL, NULL, 'Mat', 'Movilidad', 'Movilidad', true, true, 'prepara tu comida antes de tener hambre'),
  ('soft-girl-reset', 6, 'Sesión 6 · Repite la sesión 2', NULL, 'https://www.youtube.com/watch?v=RvCntPg7oPE', 'RvCntPg7oPE', 'Move With Nicole', NULL, NULL, 'Mat', 'Movilidad', 'Movilidad', true, true, 'identifica una fuente de fibra'),
  ('soft-girl-reset', 7, 'Sesión 7 · Repite la sesión 3', NULL, 'https://www.youtube.com/watch?v=D0LvavdptdM', 'D0LvavdptdM', 'Move With Nicole', NULL, NULL, 'Mat', 'Movilidad', 'Movilidad', true, true, 'planifica tus compras')
) AS d(slug, day_number, title, description, youtube_url, youtube_video_id, instructor, duration_minutes, difficulty, equipment, body_area, training_type, low_impact, beginner_friendly, nutrition_challenge)
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
  sort_order = EXCLUDED.sort_order,
  status = EXCLUDED.status,
  updated_at = NOW();

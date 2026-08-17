-- ============================================================
-- 021_retos_fst_metadata.sql — Metadatos verificados de videos
-- Títulos, canales y duraciones obtenidos de las páginas
-- públicas de YouTube (oEmbed + watch page) el 2026-08-17.
-- Dificultad, equipamiento, zona y tipo derivados de los
-- títulos reales. Idempotente: se puede re-ejecutar.
-- ============================================================

UPDATE fst_challenges SET
  instructor = 'Lilly Sabri / Chloe Ting',
  equipment = 'Mat',
  average_duration = '10–20 min',
  level = 'beginner',
  updated_at = NOW()
WHERE slug = 'core-girl';

UPDATE fst_challenges SET
  instructor = 'Move With Nicole / MadFit',
  equipment = 'Mat',
  average_duration = '20–30 min',
  level = 'intermediate',
  updated_at = NOW()
WHERE slug = 'abs-booty';

UPDATE fst_challenges SET
  instructor = 'growwithjo',
  equipment = 'Sin equipo',
  average_duration = '30–45 min',
  level = 'beginner',
  updated_at = NOW()
WHERE slug = 'walk-glow';

UPDATE fst_challenges SET
  instructor = 'MadFit',
  equipment = 'Mancuernas',
  average_duration = '30–45 min',
  level = 'intermediate',
  updated_at = NOW()
WHERE slug = 'strong-girl';

UPDATE fst_challenges SET
  instructor = 'Pamela Reif / MadFit',
  equipment = 'Mat',
  average_duration = '10–20 min',
  level = 'beginner',
  updated_at = NOW()
WHERE slug = 'legs-booty';

UPDATE fst_challenges SET
  instructor = 'Varias creadoras',
  equipment = 'Sin equipo',
  average_duration = '10–20 min',
  level = 'beginner',
  updated_at = NOW()
WHERE slug = 'low-impact-girl';

UPDATE fst_challenges SET
  instructor = 'Varias creadoras',
  equipment = 'Sin equipo',
  average_duration = '10–20 min',
  level = 'beginner',
  updated_at = NOW()
WHERE slug = '10-minute-girl';

UPDATE fst_challenges SET
  instructor = 'Pamela Reif / MadFit',
  equipment = 'Sin equipo',
  average_duration = '20–30 min',
  level = 'intermediate',
  updated_at = NOW()
WHERE slug = 'full-body-girl';

UPDATE fst_challenges SET
  instructor = 'Varias creadoras',
  equipment = 'Mancuernas',
  average_duration = '20–30 min',
  level = 'intermediate',
  updated_at = NOW()
WHERE slug = 'dumbbell-girl';

UPDATE fst_challenges SET
  instructor = 'Pamela Reif',
  equipment = 'Bandas',
  average_duration = '20–30 min',
  level = 'intermediate',
  updated_at = NOW()
WHERE slug = 'booty-bloom';

UPDATE fst_challenge_days SET
  title = '30 MIN FULL BODY WORKOUT || At-Home Pilates (No Equipment)',
  instructor = 'Move With Nicole',
  duration_minutes = 33,
  difficulty = 'intermediate',
  equipment = 'Mat',
  body_area = 'Full body',
  training_type = 'Pilates',
  low_impact = true,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'C2HX2pNbUCM' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'pilates-princess');

UPDATE fst_challenge_days SET
  title = '30 MIN FULL BODY WORKOUT || At-Home Beginner Pilates (No Equipment)',
  instructor = 'Move With Nicole',
  duration_minutes = 31,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Full body',
  training_type = 'Pilates',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = '2mkR5LPhOC4' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'pilates-princess');

UPDATE fst_challenge_days SET
  title = '20 MIN EXPRESS PILATES WORKOUT || Beginner to Moderate Pilates (No Equipment)',
  instructor = 'Move With Nicole',
  duration_minutes = 24,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Full body',
  training_type = 'Pilates',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'y2RcYo36boM' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'pilates-princess');

UPDATE fst_challenge_days SET
  title = '30 MIN PILATES YOGA WORKOUT || Full Body Stretch & Strengthen',
  instructor = 'Move With Nicole',
  duration_minutes = 33,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Full body',
  training_type = 'Pilates',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'ljtJM15YxXs' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'pilates-princess');

UPDATE fst_challenge_days SET
  title = '15 MIN BOOTY + EQUIPMENT / Weight, Booty Band - build a round butt I Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 16,
  difficulty = 'intermediate',
  equipment = 'Bandas',
  body_area = 'Glúteos',
  training_type = 'Glúteos',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'ZsthLQrpY6g' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'booty-bloom');

UPDATE fst_challenge_days SET
  title = '20 MIN BOOTY WORKOUT - Weights & Booty Band / double the torture for a round booty I Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 24,
  difficulty = 'intermediate',
  equipment = 'Bandas',
  body_area = 'Glúteos',
  training_type = 'Glúteos',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = '7GV8zZd23KU' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'booty-bloom');

UPDATE fst_challenge_days SET
  title = '20 MIN BOOTY BUILDER - Gym Style, Slow Circuit Training with breaks / Equipment: Weight',
  instructor = 'Pamela Reif',
  duration_minutes = 22,
  difficulty = 'intermediate',
  equipment = 'Mancuernas',
  body_area = 'Glúteos',
  training_type = 'Glúteos',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'hhycA0zZXZM' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'booty-bloom');

UPDATE fst_challenge_days SET
  title = '30 MIN BOOTY WORKOUT / Knee Friendly Edition - Let''s Train Together I Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 30,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Glúteos',
  training_type = 'Glúteos',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'irrXLzbTm2A' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'booty-bloom');

UPDATE fst_challenge_days SET
  title = '10 Minute Pilates Abs Workout (With Dumbbells!) | Strengthen & Sculpt with Lilly Sabri',
  instructor = 'Lilly Sabri',
  duration_minutes = 12,
  difficulty = 'intermediate',
  equipment = 'Mancuernas',
  body_area = 'Abdomen / Core',
  training_type = 'Core',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'h7K7ASmcQZk' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'core-girl');

UPDATE fst_challenge_days SET
  title = '10 Min Pilates Waist & Core Routine with Dumbbells | Daily At-Home Abs Workout',
  instructor = 'Lilly Sabri',
  duration_minutes = 12,
  difficulty = 'intermediate',
  equipment = 'Mancuernas',
  body_area = 'Abdomen / Core',
  training_type = 'Core',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'XM05zeeQenw' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'core-girl');

UPDATE fst_challenge_days SET
  title = 'Pilates Abs Challenge | 10 Min a Day for 7 Days | Workout at Home with Lilly Sabri',
  instructor = 'Lilly Sabri',
  duration_minutes = 11,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Abdomen / Core',
  training_type = 'Core',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'BIOOvjz5H1k' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'core-girl');

UPDATE fst_challenge_days SET
  title = '10 Mins ABS WORKOUT To Get FLAT BELLY IN 30 DAYS | FREE WORKOUT PROGRAM',
  instructor = 'Chloe Ting',
  duration_minutes = 11,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Abdomen / Core',
  training_type = 'Core',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'UBnfm4s7CRA' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'core-girl');

UPDATE fst_challenge_days SET
  title = '20 MIN ABS & BOOTY WORKOUT | At-Home Pilates (No Equipment)',
  instructor = 'Move With Nicole',
  duration_minutes = 25,
  difficulty = 'intermediate',
  equipment = 'Mat',
  body_area = 'Abdomen / Core',
  training_type = 'Core',
  low_impact = true,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'TTkUAx357-s' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'abs-booty');

UPDATE fst_challenge_days SET
  title = '20 MIN ABS & BOOTY WORKOUT || At-Home Pilates (No Equipment)',
  instructor = 'Move With Nicole',
  duration_minutes = 22,
  difficulty = 'intermediate',
  equipment = 'Mat',
  body_area = 'Abdomen / Core',
  training_type = 'Core',
  low_impact = true,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = '2f4H4nIsVVA' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'abs-booty');

UPDATE fst_challenge_days SET
  title = '35 MIN ABS & BOOTY WORKOUT || Mat Pilates (No Squats & No Equipment)',
  instructor = 'Move With Nicole',
  duration_minutes = 36,
  difficulty = 'intermediate',
  equipment = 'Mat',
  body_area = 'Abdomen / Core',
  training_type = 'Core',
  low_impact = true,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'KQ6b-_dC1Mo' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'abs-booty');

UPDATE fst_challenge_days SET
  title = '15 MIN ABS & BOOTY - on the floor, no squats/lunges (No Equipment)',
  instructor = 'MadFit',
  duration_minutes = 17,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Abdomen / Core',
  training_type = 'Core',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'fQJXQI5iEqE' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'abs-booty');

UPDATE fst_challenge_days SET
  title = 'Low Impact 30 Min Walking Workout',
  instructor = 'growwithjo',
  duration_minutes = 32,
  difficulty = 'beginner',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Caminata',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'yV4jyj8Hr1g' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'walk-glow');

UPDATE fst_challenge_days SET
  title = '5000 STEPS Walking Workout to Burn Fat & Boost Your Mood | No Repeats',
  instructor = 'growwithjo',
  duration_minutes = 45,
  difficulty = 'intermediate',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Caminata',
  low_impact = true,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'YNU76Cpi1_M' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'walk-glow');

UPDATE fst_challenge_days SET
  title = 'Indoor Fat Burning Walking Workout (Low Impact)',
  instructor = 'growwithjo',
  duration_minutes = 22,
  difficulty = 'beginner',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Caminata',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'nmNCH-Ueq8E' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'walk-glow');

UPDATE fst_challenge_days SET
  title = '3 MILE FAST Walking to Lose Belly Fat (burn calories!)',
  instructor = 'growwithjo',
  duration_minutes = 48,
  difficulty = 'intermediate',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Caminata',
  low_impact = true,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'vJS9a1mpYGw' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'walk-glow');

UPDATE fst_challenge_days SET
  title = '30 MIN ALL STANDING FULL BODY WORKOUT - With Dumbbells (Strength, No Jumping)',
  instructor = 'MadFit',
  duration_minutes = 33,
  difficulty = 'intermediate',
  equipment = 'Mancuernas',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = true,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = '7WzCds5u8GI' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'strong-girl');

UPDATE fst_challenge_days SET
  title = 'FULL BODY STRENGTH WITH DUMBBELLS | 30 Minute Workout',
  instructor = 'MadFit',
  duration_minutes = 35,
  difficulty = 'intermediate',
  equipment = 'Mancuernas',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'Fihj6SW1V3Q' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'strong-girl');

UPDATE fst_challenge_days SET
  title = '45 MIN FULL BODY STRENGTH WORKOUT  (MadFit App Sculpt and Strength Program)',
  instructor = 'MadFit',
  duration_minutes = 48,
  difficulty = 'advanced',
  equipment = 'Mancuernas',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'wZOcrp3nsnk' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'strong-girl');

UPDATE fst_challenge_days SET
  title = '20 MIN FULL BODY STRENGTH - Apartment & Small Space Friendly',
  instructor = 'MadFit',
  duration_minutes = 23,
  difficulty = 'beginner',
  equipment = 'Mancuernas',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'GFvJ9HrUeEE' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'strong-girl');

UPDATE fst_challenge_days SET
  title = '10 MIN LEGS + FAT BURN - tone your thighs, booty & burn calories - No Equipment I Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 11,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Piernas',
  training_type = 'Fuerza',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'R1EKAgFRe2E' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'legs-booty');

UPDATE fst_challenge_days SET
  title = '12 MIN LEG WORKOUT - Butt, Thighs & Calves // No Equipment I Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 13,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Piernas',
  training_type = 'Fuerza',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'Fu_oExrPX68' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'legs-booty');

UPDATE fst_challenge_days SET
  title = '20 MIN LEGS + BOOTY - Let''s train together / No Equipment I Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 26,
  difficulty = 'intermediate',
  equipment = 'Mat',
  body_area = 'Piernas',
  training_type = 'Fuerza',
  low_impact = true,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'iCG4zlvuUok' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'legs-booty');

UPDATE fst_challenge_days SET
  title = '15 MIN LEGS/BUTT/THIGH WORKOUT AT HOME (With Dumbbells)',
  instructor = 'MadFit',
  duration_minutes = 18,
  difficulty = 'intermediate',
  equipment = 'Mancuernas',
  body_area = 'Piernas',
  training_type = 'Fuerza',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'BFRYY12wQtc' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'legs-booty');

UPDATE fst_challenge_days SET
  title = 'Do This Every Morning 20 min (low impact) full-body workout',
  instructor = 'growwithjo',
  duration_minutes = 22,
  difficulty = 'beginner',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Low impact',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'm1DBJhxKmiU' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'low-impact-girl');

UPDATE fst_challenge_days SET
  title = '10 MIN NO JUMPING CARDIO - easy to follow, suitable for all levels',
  instructor = 'Pamela Reif',
  duration_minutes = 11,
  difficulty = 'beginner',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Low impact',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = '0lDZwCj7l6w' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'low-impact-girl');

UPDATE fst_challenge_days SET
  title = '10 MIN FULL BODY - SLOW & HARD / Floor only, Low Impact I Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 11,
  difficulty = 'beginner',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Low impact',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'DkLISiTHRjU' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'low-impact-girl');

UPDATE fst_challenge_days SET
  title = '10 MIN EXPRESS PILATES WORKOUT || At-Home Mat Pilates (Moderate)',
  instructor = 'Move With Nicole',
  duration_minutes = 13,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Full body',
  training_type = 'Pilates',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = '136ZLuy40TE' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = '10-minute-girl');

UPDATE fst_challenge_days SET
  title = '10 MIN PILATES HIIT WORKOUT | Full Body Sculpt (Warm Up & Cool Down Included)',
  instructor = 'Move With Nicole',
  duration_minutes = 15,
  difficulty = 'intermediate',
  equipment = 'Mat',
  body_area = 'Full body',
  training_type = 'Pilates',
  low_impact = true,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'vjEAmyKgve0' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = '10-minute-girl');

UPDATE fst_challenge_days SET
  title = '10 MIN FULL BODY WORKOUT - Beginner Friendly, with breaks // No Equipment I Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 11,
  difficulty = 'beginner',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'FGFfqCjtmS8' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = '10-minute-girl');

UPDATE fst_challenge_days SET
  title = '10 MIN TOTAL CORE/AB WORKOUT (No Equipment, No Repeats)',
  instructor = 'MadFit',
  duration_minutes = 12,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Abdomen / Core',
  training_type = 'Core',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'f2HbWMSV9Go' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = '10-minute-girl');

UPDATE fst_challenge_days SET
  title = '20 MIN FULL BODY WORKOUT // No Equipment | Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 20,
  difficulty = 'intermediate',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'UBMk30rjy0o' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'full-body-girl');

UPDATE fst_challenge_days SET
  title = '20 MIN FULL BODY WORKOUT - Intense Version / No Equipment I Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 22,
  difficulty = 'advanced',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'Y2eOW7XYWxc' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'full-body-girl');

UPDATE fst_challenge_days SET
  title = '20 MIN FULL BODY WORKOUT - Beginner Version // No Equipment I Pamela Reif',
  instructor = 'Pamela Reif',
  duration_minutes = 22,
  difficulty = 'beginner',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'UItWltVZZmE' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'full-body-girl');

UPDATE fst_challenge_days SET
  title = '20 Min Full Body Workout (No Equipment)',
  instructor = 'MadFit',
  duration_minutes = 19,
  difficulty = 'beginner',
  equipment = 'Sin equipo',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'H38ach0TmWM' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'full-body-girl');

UPDATE fst_challenge_days SET
  title = '25 min FULL BODY BURN Workout At Home (ONE DUMBBELL)',
  instructor = 'MadFit',
  duration_minutes = 28,
  difficulty = 'intermediate',
  equipment = 'Mancuernas',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'upQrEnkb53I' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'dumbbell-girl');

UPDATE fst_challenge_days SET
  title = '20 min FULL BODY DUMBBELL WORKOUT | No Squats No Lunges | Knee Friendly | Beg / Int Level',
  instructor = 'fitbymik',
  duration_minutes = 24,
  difficulty = 'beginner',
  equipment = 'Mancuernas',
  body_area = 'Full body',
  training_type = 'Fuerza',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'QzQwKiIVAZM' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'dumbbell-girl');

UPDATE fst_challenge_days SET
  title = '10 MIN UPPER BODY + WEIGHTS - Alternative: Big Bottles / for back, chest, arms & shoulders',
  instructor = 'Pamela Reif',
  duration_minutes = 11,
  difficulty = 'beginner',
  equipment = 'Mancuernas',
  body_area = 'Brazos / Upper body',
  training_type = 'Fuerza',
  low_impact = false,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'GJiEUi92-xE' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'dumbbell-girl');

UPDATE fst_challenge_days SET
  title = '20 MIN BOOTY + THIGHS - with weights I build your booty & tone your thighs // TALKING MODE',
  instructor = 'Pamela Reif',
  duration_minutes = 24,
  difficulty = 'intermediate',
  equipment = 'Mancuernas',
  body_area = 'Glúteos',
  training_type = 'Fuerza',
  low_impact = false,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = '-CWPIgK4G-k' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'dumbbell-girl');

UPDATE fst_challenge_days SET
  title = '20 MIN DAILY YOGA STRETCH || Full Body Yoga Flow for Relaxation & Flexibility',
  instructor = 'Move With Nicole',
  duration_minutes = 19,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Movilidad',
  training_type = 'Yoga',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'YKtDkKUHtPU' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'soft-girl-reset');

UPDATE fst_challenge_days SET
  title = '30 MIN YOGA FLOW || Feel Good Yoga For Flexibility',
  instructor = 'Move With Nicole',
  duration_minutes = 31,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Movilidad',
  training_type = 'Yoga',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'RvCntPg7oPE' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'soft-girl-reset');

UPDATE fst_challenge_days SET
  title = '10 MIN STRETCH & COOL DOWN ROUTINE || Feel Good Flow',
  instructor = 'Move With Nicole',
  duration_minutes = 14,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Movilidad',
  training_type = 'Movilidad',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = 'D0LvavdptdM' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'soft-girl-reset');

UPDATE fst_challenge_days SET
  title = '20 MIN GENTLE YOGA FLOW || Relaxing Flow to Stretch & Feel Good',
  instructor = 'Move With Nicole',
  duration_minutes = 20,
  difficulty = 'beginner',
  equipment = 'Mat',
  body_area = 'Movilidad',
  training_type = 'Yoga',
  low_impact = true,
  beginner_friendly = true,
  updated_at = NOW()
WHERE youtube_video_id = '8cltCOUpYTQ' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'soft-girl-reset');

UPDATE fst_challenge_days SET
  title = '35 MIN ABS & BOOTY WORKOUT || Mat Pilates (No Squats & No Equipment)',
  instructor = 'Move With Nicole',
  duration_minutes = 36,
  difficulty = 'intermediate',
  equipment = 'Mat',
  body_area = 'Abdomen / Core',
  training_type = 'Core',
  low_impact = true,
  beginner_friendly = false,
  updated_at = NOW()
WHERE youtube_video_id = 'KQ6b-_dC1Mo' AND challenge_id = (SELECT id FROM fst_challenges WHERE slug = 'low-impact-girl');

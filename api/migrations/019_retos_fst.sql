-- ============================================================
-- 019_retos_fst.sql — Retos FST (retos semanales de movimiento)
-- Tablas para retos de 7 días, días, inscripciones y check-ins.
-- Idempotente. No modifica tablas existentes.
-- ============================================================

-- Retos (colecciones de 7 días)
CREATE TABLE IF NOT EXISTS fst_challenges (
  id               BIGSERIAL PRIMARY KEY,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  tagline          TEXT,
  description      TEXT,
  cover_image      TEXT,
  primary_goal     TEXT NOT NULL DEFAULT 'maintain_wellbeing',
  category         TEXT,
  instructor       TEXT,
  level            TEXT NOT NULL DEFAULT 'beginner',
  equipment        TEXT,
  average_duration TEXT,
  status           TEXT NOT NULL DEFAULT 'draft',
  start_date       DATE,
  end_date         DATE,
  evergreen        BOOLEAN NOT NULL DEFAULT true,
  featured         BOOLEAN NOT NULL DEFAULT false,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Días de cada reto (1..7)
CREATE TABLE IF NOT EXISTS fst_challenge_days (
  id                 BIGSERIAL PRIMARY KEY,
  challenge_id       BIGINT NOT NULL REFERENCES fst_challenges(id) ON DELETE CASCADE,
  day_number         INTEGER NOT NULL,
  title              TEXT NOT NULL,
  description        TEXT,
  youtube_url        TEXT,
  youtube_video_id   TEXT,
  instructor         TEXT,
  duration_minutes   INTEGER,
  difficulty         TEXT,
  equipment          TEXT,
  body_area          TEXT,
  training_type      TEXT,
  low_impact         BOOLEAN NOT NULL DEFAULT false,
  beginner_friendly  BOOLEAN NOT NULL DEFAULT false,
  nutrition_challenge TEXT,
  educational_note   TEXT,
  sort_order         INTEGER NOT NULL DEFAULT 0,
  status             TEXT NOT NULL DEFAULT 'draft',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (challenge_id, day_number)
);

-- Inscripción de una usuaria a un reto
CREATE TABLE IF NOT EXISTS fst_user_challenges (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  challenge_id  BIGINT NOT NULL REFERENCES fst_challenges(id) ON DELETE CASCADE,
  selected_goal TEXT,
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'active',
  UNIQUE (user_id, challenge_id)
);

-- Check-ins diarios (progreso por día)
CREATE TABLE IF NOT EXISTS fst_challenge_checkins (
  id                   BIGSERIAL PRIMARY KEY,
  user_id              BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  challenge_id         BIGINT NOT NULL REFERENCES fst_challenges(id) ON DELETE CASCADE,
  challenge_day_id     BIGINT NOT NULL REFERENCES fst_challenge_days(id) ON DELETE CASCADE,
  exercise_completed   BOOLEAN NOT NULL DEFAULT false,
  nutrition_completed  BOOLEAN NOT NULL DEFAULT false,
  perceived_difficulty TEXT,
  energy_score         INTEGER,
  completed_at         TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, challenge_day_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_fst_challenges_status ON fst_challenges(status);
CREATE INDEX IF NOT EXISTS idx_fst_challenges_featured ON fst_challenges(featured);
CREATE INDEX IF NOT EXISTS idx_fst_challenge_days_challenge ON fst_challenge_days(challenge_id, day_number);
CREATE INDEX IF NOT EXISTS idx_fst_user_challenges_user ON fst_user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_fst_user_challenges_challenge ON fst_user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_fst_checkins_user ON fst_challenge_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_fst_checkins_challenge ON fst_challenge_checkins(challenge_id);

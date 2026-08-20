-- ============================================================
-- 027_cv_profiles.sql
-- Hoja de vida profesional de la plataforma: guardada por
-- usuario de Academia (JWT) para recuperarla y editarla luego.
-- ============================================================

CREATE TABLE IF NOT EXISTS cv_profiles (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  nombre       TEXT NOT NULL DEFAULT '',
  titulo       TEXT NOT NULL DEFAULT '',
  email        TEXT NOT NULL DEFAULT '',
  telefono     TEXT NOT NULL DEFAULT '',
  ciudad       TEXT NOT NULL DEFAULT '',
  linkedin     TEXT NOT NULL DEFAULT '',
  resumen      TEXT NOT NULL DEFAULT '',
  experiencia  JSONB NOT NULL DEFAULT '[]'::jsonb,
  educacion    JSONB NOT NULL DEFAULT '[]'::jsonb,
  habilidades  JSONB NOT NULL DEFAULT '[]'::jsonb,
  certificaciones JSONB NOT NULL DEFAULT '[]'::jsonb,
  idiomas      JSONB NOT NULL DEFAULT '[]'::jsonb,
  referencias  JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cv_profiles_user ON cv_profiles (user_id);

DROP TRIGGER IF EXISTS trg_cv_profiles_updated_at ON cv_profiles;
CREATE TRIGGER trg_cv_profiles_updated_at BEFORE UPDATE ON cv_profiles
  FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();

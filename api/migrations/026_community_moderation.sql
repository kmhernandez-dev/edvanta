-- ============================================================
-- 026_community_moderation.sql
-- Moderación y seguridad del banco comunitario:
--   - moderation_logs: auditoría de cada acción de moderación
--   - community_limits: control anti-spam por IP (rate limit)
--   - columna notes para notas de moderación en los items
-- ============================================================

CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  moderator TEXT NOT NULL DEFAULT 'admin',
  resource_type TEXT NOT NULL CHECK (resource_type IN ('community_job', 'talent_profile')),
  resource_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'archive', 'restore', 'edit', 'hard_delete')),
  note TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_logs_resource ON moderation_logs (resource_type, resource_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_created ON moderation_logs (created_at DESC);

CREATE TABLE IF NOT EXISTS community_limits (
  ip TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'post',
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  count INTEGER NOT NULL DEFAULT 1,
  blocked_until TIMESTAMPTZ,
  PRIMARY KEY (ip, scope)
);

-- Notas de moderación en cada entidad
ALTER TABLE community_jobs ADD COLUMN IF NOT EXISTS moderation_note TEXT;
ALTER TABLE talent_profiles ADD COLUMN IF NOT EXISTS moderation_note TEXT;

-- ─── Índices de rendimiento ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_community_jobs_status_created ON community_jobs (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_talent_profiles_status_created ON talent_profiles (status, created_at DESC);

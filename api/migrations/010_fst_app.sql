-- ============================================================
--  010_fst_app.sql — App Feliz Sin Tiroides (NutriFST IA)
--  Estado del paciente para la aplicación de acompañamiento.
-- ============================================================

CREATE TABLE IF NOT EXISTS fst_app_states (
  patient_id    INTEGER PRIMARY KEY REFERENCES academia_users(id) ON DELETE CASCADE,
  schema_version INTEGER NOT NULL DEFAULT 1,
  state         JSONB NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_fst_app_states_updated
  ON fst_app_states (updated_at DESC);

-- ============================================================
-- 014_lead_events.sql — CRM básico de Feliz Sin Tiroides
--
--  - Agrega columnas de procedencia (source, utm_term, landing_path)
--    a la tabla leads existente.
--  - Crea lead_events: una fila por acción comercial/educativa
--    (descarga de recurso, clic en Hotmart, clic en comunidad, etc.)
--    sin almacenar información clínica.
-- ============================================================

ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(80);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_term VARCHAR(160);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS landing_path VARCHAR(255);

CREATE TABLE IF NOT EXISTS lead_events (
  id            BIGSERIAL PRIMARY KEY,
  email         VARCHAR(255) NOT NULL,
  event_type    VARCHAR(80) NOT NULL,
  resource_slug VARCHAR(120),
  resource_name VARCHAR(160),
  product_id    VARCHAR(120),
  metadata      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_events_email_idx ON lead_events (email);
CREATE INDEX IF NOT EXISTS lead_events_type_idx ON lead_events (event_type);
CREATE INDEX IF NOT EXISTS lead_events_created_idx ON lead_events (created_at DESC);

COMMENT ON TABLE lead_events IS
  'Eventos comerciales/educativos de Feliz Sin Tiroides. No almacena datos clínicos.';

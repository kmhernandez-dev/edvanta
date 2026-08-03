CREATE TABLE IF NOT EXISTS leads (
  id                    BIGSERIAL PRIMARY KEY,
  email                 VARCHAR(255) NOT NULL UNIQUE,
  name                  VARCHAR(100) NOT NULL,
  country               VARCHAR(100) NOT NULL,
  interest              VARCHAR(80) NOT NULL,
  whatsapp              VARCHAR(40),
  consent               BOOLEAN NOT NULL DEFAULT FALSE,
  consent_at            TIMESTAMPTZ,
  resource              VARCHAR(120),
  recommendation        VARCHAR(80),
  utm_source            VARCHAR(160),
  utm_medium            VARCHAR(160),
  utm_campaign          VARCHAR(160),
  utm_content           VARCHAR(160),
  source_page           TEXT,
  email_delivered       BOOLEAN NOT NULL DEFAULT FALSE,
  external_sync_status  VARCHAR(40) NOT NULL DEFAULT 'not_configured',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_interest_idx ON leads (interest);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_utm_campaign_idx ON leads (utm_campaign);

COMMENT ON TABLE leads IS
  'Contactos que autorizan recibir recursos y comunicaciones educativas de Feliz Sin Tiroides.';

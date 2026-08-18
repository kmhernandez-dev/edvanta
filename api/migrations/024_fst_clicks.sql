-- ============================================================
-- 024_fst_clicks.sql — Clics de Feliz Sin Tiroides
-- Registra cada clic en la landing FST y demás páginas de la
-- marca: sección, elemento, destino, origen y UTM.
-- No almacena datos personales. Idempotente.
-- ============================================================

CREATE TABLE IF NOT EXISTS fst_clicks (
  id            BIGSERIAL PRIMARY KEY,
  section       VARCHAR(80),          -- sección de la página (hero, guias, recursos, hotmart, comunidad...)
  element       VARCHAR(120),         -- elemento concreto (cta_empezar, guia_levotiroxina, boton_comunidad...)
  label         VARCHAR(200),         -- texto visible del elemento
  destination   VARCHAR(500),         -- URL de destino (puede ser interna)
  source_page   VARCHAR(500),         -- página donde ocurrió el clic
  referrer      VARCHAR(500),
  utm_source    VARCHAR(160),
  utm_medium    VARCHAR(160),
  utm_campaign  VARCHAR(160),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS fst_clicks_created_idx ON fst_clicks (created_at DESC);
CREATE INDEX IF NOT EXISTS fst_clicks_section_idx ON fst_clicks (section);
CREATE INDEX IF NOT EXISTS fst_clicks_element_idx ON fst_clicks (element);

COMMENT ON TABLE fst_clicks IS
  'Clics registrados en las páginas de Feliz Sin Tiroides. No almacena datos personales.';

-- ============================================================
--  115_aula_crm_embudo.sql — El CRM de las solicitudes
--
--  Cada registro de la web (páginas /unete, encuestas, cierres y
--  páginas de venta) se clasifica solo al llegar:
--
--   · publico      profesional, institucion o paciente
--   · interes      curso, guia, asesoria, propuesta o general
--   · puntaje      0 a 100: qué tan cerca está de comprar
--   · temperatura  frio, tibio o caliente (según el puntaje)
--   · segmento     «Profesional · Calidad · Cursos», para filtrar
--   · siguiente_accion  qué hacer con esta persona hoy
--
--  También guarda la profesión y de dónde vino (utm_*), para saber
--  qué publicación de LinkedIn trajo a cada persona.
--
--  embudo_correos registra cada correo automático del embudo (registro,
--  inscripción, certificado…) para no mandar dos veces el mismo.
-- ============================================================

ALTER TABLE solicitudes
  ADD COLUMN IF NOT EXISTS profesion        TEXT,
  ADD COLUMN IF NOT EXISTS publico          TEXT,
  ADD COLUMN IF NOT EXISTS interes          TEXT,
  ADD COLUMN IF NOT EXISTS puntaje          SMALLINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS temperatura      TEXT,
  ADD COLUMN IF NOT EXISTS segmento         TEXT,
  ADD COLUMN IF NOT EXISTS siguiente_accion TEXT,
  ADD COLUMN IF NOT EXISTS utm_source       TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium       TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign     TEXT,
  ADD COLUMN IF NOT EXISTS utm_content      TEXT;

CREATE INDEX IF NOT EXISTS solicitudes_crm_idx ON solicitudes (publico, temperatura, created_at DESC);
CREATE INDEX IF NOT EXISTS solicitudes_correo_idx ON solicitudes (lower(correo));

CREATE TABLE IF NOT EXISTS embudo_correos (
  id          BIGSERIAL PRIMARY KEY,
  correo      TEXT NOT NULL,
  plantilla   TEXT NOT NULL,
  -- Distingue envíos legítimamente repetidos: un curso, un certificado.
  clave       TEXT NOT NULL DEFAULT '',
  enviado     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (correo, plantilla, clave)
);

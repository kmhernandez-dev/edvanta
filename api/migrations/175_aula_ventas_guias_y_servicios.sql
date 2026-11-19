-- ============================================================
-- 175_aula_ventas_guias_y_servicios.sql — Medir las tres ventas
--
-- Meta de Karla (19-nov-2026): 100 certificados, 100 guías y las ventas
-- de servicios, cada día. Los certificados ya se registran
-- (aula_certificate_payments). Faltaba:
--
--  · ventas_guias      lo que avisa Hotmart (webhook 2.0): compras,
--                      reembolsos y carritos abandonados, con el «src»
--                      del enlace (qué página y qué botón vendió).
--  · ventas_servicios  lo que se cierra por WhatsApp (asesorías,
--                      paquetes institucionales…): se registra en Assist.
--  · ventas_metas      la meta diaria de cada tipo, editable en Assist.
--
-- Aditiva e idempotente.
-- ============================================================

CREATE TABLE IF NOT EXISTS ventas_guias (
  id                BIGSERIAL PRIMARY KEY,
  -- Transacción de Hotmart; en un carrito abandonado, «carrito:<id del evento>».
  transaccion       TEXT NOT NULL UNIQUE,
  evento            TEXT NOT NULL,
  estado            TEXT NOT NULL CHECK (estado IN (
                      'aprobada', 'pendiente', 'cancelada', 'reembolsada', 'contracargo', 'carrito_abandonado'
                    )),
  producto_id       TEXT,
  producto          TEXT,
  oferta            TEXT,
  comprador_correo  TEXT,
  comprador_nombre  TEXT,
  telefono          TEXT,
  pais              TEXT,
  valor             NUMERIC(12,2),
  moneda            TEXT,
  origen_src        TEXT,
  origen_sck        TEXT,
  comprada_el       TIMESTAMPTZ,
  aprobada_el       TIMESTAMPTZ,
  payload           JSONB,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ventas_guias_correo_idx ON ventas_guias (lower(comprador_correo));
CREATE INDEX IF NOT EXISTS ventas_guias_aprobadas_idx ON ventas_guias (aprobada_el) WHERE estado = 'aprobada';
CREATE INDEX IF NOT EXISTS ventas_guias_carritos_idx ON ventas_guias (created_at) WHERE estado = 'carrito_abandonado';

CREATE TABLE IF NOT EXISTS ventas_servicios (
  id              BIGSERIAL PRIMARY KEY,
  correo          TEXT NOT NULL CHECK (correo = lower(btrim(correo)) AND position('@' IN correo) > 1),
  nombre          TEXT,
  servicio        TEXT NOT NULL CHECK (length(btrim(servicio)) BETWEEN 2 AND 160),
  valor           NUMERIC(12,2) NOT NULL CHECK (valor >= 0),
  moneda          TEXT NOT NULL DEFAULT 'COP',
  nota            TEXT CHECK (nota IS NULL OR length(nota) <= 1000),
  vendida_el      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  registrada_por  BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  anulada_el      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS ventas_servicios_fecha_idx ON ventas_servicios (vendida_el) WHERE anulada_el IS NULL;
CREATE INDEX IF NOT EXISTS ventas_servicios_correo_idx ON ventas_servicios (correo);

CREATE TABLE IF NOT EXISTS ventas_metas (
  clave        TEXT PRIMARY KEY CHECK (clave IN ('certificados', 'guias', 'servicios')),
  meta_diaria  INTEGER NOT NULL CHECK (meta_diaria BETWEEN 0 AND 100000),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by   BIGINT REFERENCES aula_users(id) ON DELETE SET NULL
);
INSERT INTO ventas_metas (clave, meta_diaria) VALUES
  ('certificados', 100), ('guias', 100), ('servicios', 100)
ON CONFLICT (clave) DO NOTHING;

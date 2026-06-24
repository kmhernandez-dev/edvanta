-- ============================================================
-- 001_orders.sql — Schema inicial para el log de órdenes
-- ============================================================
-- Crea la tabla principal y los índices. Idempotente: se puede
-- correr varias veces sin romper nada.
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  payment_id          BIGINT       PRIMARY KEY,
  status              VARCHAR(40)  NOT NULL,
  status_detail       VARCHAR(80),
  email               VARCHAR(255),
  payer_id            BIGINT,
  items               JSONB        NOT NULL DEFAULT '[]'::jsonb,
  transaction_amount  NUMERIC(12,2),
  currency_id         VARCHAR(10)  NOT NULL DEFAULT 'COP',
  payment_method      VARCHAR(40),
  payment_type        VARCHAR(40),
  date_approved       TIMESTAMPTZ,
  date_created        TIMESTAMPTZ,
  logged_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  email_sent_at       TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_email_idx        ON orders (LOWER(email));
CREATE INDEX IF NOT EXISTS orders_status_idx       ON orders (status);
CREATE INDEX IF NOT EXISTS orders_date_approved_idx ON orders (date_approved DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS orders_logged_at_idx    ON orders (logged_at DESC);

-- Trigger para mantener updated_at al día en cada UPDATE.
CREATE OR REPLACE FUNCTION orders_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_set_updated_at_trigger ON orders;
CREATE TRIGGER orders_set_updated_at_trigger
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION orders_set_updated_at();

COMMENT ON TABLE orders IS
  'Log de órdenes pagadas via Mercado Pago. Una fila por payment_id aprobado.';

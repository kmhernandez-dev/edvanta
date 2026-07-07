-- ============================================================
-- 002_checkout_attempts.sql - permite registrar checkouts antes
-- de que exista un payment_id aprobado de Mercado Pago.
-- ============================================================

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_pkey;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS id BIGSERIAL,
  ADD COLUMN IF NOT EXISTS preference_id VARCHAR(120),
  ADD COLUMN IF NOT EXISTS external_reference VARCHAR(120);

ALTER TABLE orders
  ALTER COLUMN payment_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'orders_pkey'
      AND conrelid = 'orders'::regclass
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS orders_payment_id_unique_idx
  ON orders (payment_id)
  WHERE payment_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_preference_id_unique_idx
  ON orders (preference_id)
  WHERE preference_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_external_reference_unique_idx
  ON orders (external_reference)
  WHERE external_reference IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'orders_payment_id_unique'
      AND conrelid = 'orders'::regclass
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_payment_id_unique UNIQUE (payment_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'orders_preference_id_unique'
      AND conrelid = 'orders'::regclass
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_preference_id_unique UNIQUE (preference_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'orders_external_reference_unique'
      AND conrelid = 'orders'::regclass
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_external_reference_unique UNIQUE (external_reference);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS orders_preference_id_idx ON orders (preference_id);
CREATE INDEX IF NOT EXISTS orders_external_reference_idx ON orders (external_reference);

COMMENT ON TABLE orders IS
  'Log de intentos de checkout y pagos via Mercado Pago. Una fila puede iniciar como pending_checkout y luego actualizarse con payment_id aprobado.';

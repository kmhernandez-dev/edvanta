-- ============================================================
--  068_aula_certificados_pagados.sql
--
--  El certificado de los cursos propios para profesionales cuesta
--  COP 60.000 (decisión de la propietaria, 2026-11-06).
--
--   · aula_courses.certificate_price: precio en pesos colombianos.
--     NULL o 0 = certificado sin costo (cursos de empresa y el curso
--     para pacientes conservan ese comportamiento).
--   · aula_certificate_payments: un pago o una exención por persona y
--     curso. Lo aprueba el webhook de Mercado Pago o la administración.
--
--  Los certificados ya emitidos no cambian. Es aditiva e idempotente.
-- ============================================================

ALTER TABLE aula_courses
  ADD COLUMN IF NOT EXISTS certificate_price INTEGER
  CHECK (certificate_price IS NULL OR certificate_price >= 0);

COMMENT ON COLUMN aula_courses.certificate_price IS
  'Precio del certificado en COP. NULL o 0: sin costo.';

CREATE TABLE IF NOT EXISTS aula_certificate_payments (
  id                  BIGSERIAL PRIMARY KEY,
  user_id             BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  course_id           BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  status              TEXT NOT NULL DEFAULT 'pendiente'
                      CHECK (status IN ('pendiente', 'aprobado', 'rechazado', 'anulado')),
  source              TEXT NOT NULL DEFAULT 'mercadopago'
                      CHECK (source IN ('mercadopago', 'admin')),
  amount              NUMERIC(12,2),
  currency_id         TEXT NOT NULL DEFAULT 'COP',
  external_reference  TEXT,
  payment_id          BIGINT,
  note                TEXT,
  granted_by          BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at         TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Un solo pago aprobado por persona y curso.
CREATE UNIQUE INDEX IF NOT EXISTS aula_certificate_payments_aprobado_idx
  ON aula_certificate_payments (user_id, course_id) WHERE status = 'aprobado';
CREATE INDEX IF NOT EXISTS aula_certificate_payments_ref_idx
  ON aula_certificate_payments (external_reference);
CREATE INDEX IF NOT EXISTS aula_certificate_payments_curso_idx
  ON aula_certificate_payments (course_id, status);

-- Precio de lanzamiento en los cursos propios para profesionales que aún
-- no tienen uno.
UPDATE aula_courses
   SET certificate_price = 60000
 WHERE kind = 'edvanta'
   AND publico = 'profesionales'
   AND certificate_price IS NULL
   AND deleted_at IS NULL;

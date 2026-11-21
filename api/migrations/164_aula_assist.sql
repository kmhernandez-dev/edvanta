-- ============================================================
-- 164_aula_assist.sql — Edvanta Assist (atención de personas)
--
-- 1. Notas de atención por persona. Van por CORREO, no por cuenta:
--    también se anotan los interesados que aún no tienen cuenta (una
--    solicitud de la web) y la nota sigue ahí cuando se registran.
-- 2. Índices para que la búsqueda y la bandeja respondan rápido con
--    cientos de miles de personas (100.000 visitas al día).
--
-- Aditiva e idempotente: no borra ni cambia datos.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS aula_assist_notas (
  id          BIGSERIAL PRIMARY KEY,
  correo      TEXT NOT NULL CHECK (correo = lower(btrim(correo)) AND position('@' IN correo) > 1),
  nota        TEXT NOT NULL CHECK (length(btrim(nota)) BETWEEN 1 AND 2000),
  autor_id    BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  autor_email TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS aula_assist_notas_correo_idx ON aula_assist_notas (correo, created_at DESC);

-- Búsqueda por fragmento de correo o nombre (ILIKE '%…%') sin recorrer la tabla.
CREATE INDEX IF NOT EXISTS aula_users_busqueda_trgm
  ON aula_users USING gin ((lower(email || ' ' || first_name || ' ' || last_name)) gin_trgm_ops);
CREATE INDEX IF NOT EXISTS solicitudes_busqueda_trgm
  ON solicitudes USING gin ((lower(correo || ' ' || nombre)) gin_trgm_ops);

-- Pagos de una persona y pagos abandonados (pendientes por fecha).
CREATE INDEX IF NOT EXISTS aula_certificate_payments_usuario_idx
  ON aula_certificate_payments (user_id, course_id, status);
CREATE INDEX IF NOT EXISTS aula_certificate_payments_pendientes_idx
  ON aula_certificate_payments (created_at) WHERE status = 'pendiente';

-- Bandeja: quien se quedó a mitad de curso y quien terminó.
CREATE INDEX IF NOT EXISTS aula_enrollments_actividad_idx
  ON aula_enrollments (progress_status, last_access_at) WHERE withdrawn_at IS NULL;
CREATE INDEX IF NOT EXISTS aula_enrollments_completados_idx
  ON aula_enrollments (completed_at) WHERE completed_at IS NOT NULL AND withdrawn_at IS NULL;

-- Ventas por fecha (embudo de los últimos días).
CREATE INDEX IF NOT EXISTS aula_users_alta_idx ON aula_users (created_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS aula_enrollments_alta_idx ON aula_enrollments (assigned_at);
CREATE INDEX IF NOT EXISTS aula_certificate_payments_aprobados_fecha_idx
  ON aula_certificate_payments (approved_at) WHERE status = 'aprobado';

-- Correos del embudo de una persona (la ficha de Assist los muestra).
CREATE INDEX IF NOT EXISTS embudo_correos_correo_fecha_idx ON embudo_correos (correo, created_at DESC);

-- ============================================================
--  061 · Certificados de aprobación
--
--  aula_certificates (029) quedó preparada sin uso. Desde aquí se emite:
--  al completar un curso, la persona pide su certificado y se guarda una
--  foto de lo que dice (nombre, documento si lo dio, curso, horas,
--  ciudad y fecha). Lo emitido no cambia aunque después cambie el título
--  del curso o el nombre de la cuenta.
--
--  code: EDV-XXXX-XXXX al azar (no consecutivo: no se puede recorrer la
--  lista de certificados ajenos). Es lo que lleva el QR y lo que verifica
--  /certificados/<código>.
--
--  Revocar no borra: deja la fecha, el motivo y quién lo hizo, y la
--  verificación pública lo muestra como revocado.
-- ============================================================

ALTER TABLE aula_certificates
  ADD COLUMN IF NOT EXISTS course_id       BIGINT REFERENCES aula_courses(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS holder_name     TEXT,
  ADD COLUMN IF NOT EXISTS holder_document TEXT CHECK (holder_document IS NULL OR length(holder_document) <= 20),
  ADD COLUMN IF NOT EXISTS course_title    TEXT,
  ADD COLUMN IF NOT EXISTS hours           NUMERIC(6,1) CHECK (hours IS NULL OR hours > 0),
  ADD COLUMN IF NOT EXISTS modality        TEXT,
  ADD COLUMN IF NOT EXISTS city            TEXT,
  ADD COLUMN IF NOT EXISTS revoked_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS revoked_reason  TEXT,
  ADD COLUMN IF NOT EXISTS revoked_by      BIGINT;

CREATE INDEX IF NOT EXISTS aula_certificates_course ON aula_certificates (course_id);

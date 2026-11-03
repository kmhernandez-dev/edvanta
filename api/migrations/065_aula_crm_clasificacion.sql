-- ============================================================
--  065_aula_crm_clasificacion.sql
--
--  Identidad comercial y segmentación del aula:
--
--   · crm_code estable para exportar y cruzar con el CRM;
--   · segmento de mercado;
--   · etiquetas libres para campañas y filtros;
--   · origen y notas internas.
--
--  No cambia roles ni permisos. Los campos son editables solo por
--  administración; el participante no los ve.
-- ============================================================

ALTER TABLE aula_users
  ADD COLUMN IF NOT EXISTS crm_code TEXT,
  ADD COLUMN IF NOT EXISTS segmento TEXT NOT NULL DEFAULT 'sin_clasificar',
  ADD COLUMN IF NOT EXISTS crm_tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS crm_source TEXT,
  ADD COLUMN IF NOT EXISTS crm_notes TEXT,
  ADD COLUMN IF NOT EXISTS crm_updated_at TIMESTAMPTZ;

-- Código estable para todo el historial existente.
UPDATE aula_users
   SET crm_code = 'EDV-U-' || lpad(id::text, 6, '0')
 WHERE crm_code IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS aula_users_crm_code_uq
  ON aula_users (crm_code) WHERE crm_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS aula_users_segmento_idx
  ON aula_users (segmento) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS aula_users_crm_tags_idx
  ON aula_users USING gin (crm_tags);

-- Los usuarios nuevos reciben su código sin depender de la aplicación.
CREATE OR REPLACE FUNCTION aula_set_crm_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.crm_code IS NULL THEN
    NEW.crm_code := 'EDV-U-' || lpad(NEW.id::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS aula_users_crm_code ON aula_users;
CREATE TRIGGER aula_users_crm_code
  BEFORE INSERT ON aula_users
  FOR EACH ROW EXECUTE FUNCTION aula_set_crm_code();

COMMENT ON COLUMN aula_users.crm_code IS
  'Identificador estable del aula para CRM. No cambia aunque cambie el correo.';
COMMENT ON COLUMN aula_users.segmento IS
  'Segmento de mercado editable por administración. Valor inicial: sin_clasificar.';

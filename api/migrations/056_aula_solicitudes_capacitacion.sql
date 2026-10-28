-- ============================================================
--  056_aula_solicitudes_capacitacion.sql
--
--  Una propuesta institucional puede cubrir varias áreas y varios
--  perfiles. Estas columnas guardan esa selección junto con los datos
--  que permiten preparar una propuesta: tamaño del grupo, modalidad,
--  necesidad, ubicación y fecha tentativa.
--
--  Son columnas opcionales para no romper las solicitudes que ya
--  existen ni los formularios de interés y contacto.
-- ============================================================

ALTER TABLE solicitudes
  ADD COLUMN IF NOT EXISTS areas             TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS perfiles          TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS participantes     INTEGER,
  ADD COLUMN IF NOT EXISTS modalidad         TEXT,
  ADD COLUMN IF NOT EXISTS resultado_esperado TEXT,
  ADD COLUMN IF NOT EXISTS pais              TEXT,
  ADD COLUMN IF NOT EXISTS ciudad            TEXT,
  ADD COLUMN IF NOT EXISTS fecha_tentativa   DATE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'solicitudes_participantes_check'
  ) THEN
    ALTER TABLE solicitudes
      ADD CONSTRAINT solicitudes_participantes_check
      CHECK (participantes IS NULL OR (participantes >= 1 AND participantes <= 100000));
  END IF;
END $$;

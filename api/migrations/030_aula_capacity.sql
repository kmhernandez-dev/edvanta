-- ═══════════════════════════════════════════════════════════════════
--  030_aula_capacity.sql — Amplía la capacidad del aula
--
--  Antes las entregas de actividades limitaban el archivo a 200 MB
--  máximo. El aula ahora soporta archivos grandes en todo el flujo
--  (videos de clase de hasta 8 GB, entregas de hasta 512 MB), con el
--  tope por actividad en 1024 MB. La restricción CHECK creada por la
--  migración 029 se reemplaza aquí.
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE aula_activities
  DROP CONSTRAINT IF EXISTS aula_activities_max_file_mb_check,
  ADD CONSTRAINT aula_activities_max_file_mb_check CHECK (max_file_mb BETWEEN 1 AND 1024) NOT VALID;
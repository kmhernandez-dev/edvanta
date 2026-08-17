-- ============================================================
-- 023_retos_fst_checkin_answers.sql — Respuestas de check-in
-- Columna JSONB para guardar las respuestas personalizadas de
-- los check-ins de Activa & Quema (preguntas por día).
-- Idempotente. No modifica tablas existentes.
-- ============================================================

ALTER TABLE fst_challenge_checkins
  ADD COLUMN IF NOT EXISTS checkin_answers JSONB;

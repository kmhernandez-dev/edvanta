-- ============================================================
--  066_aula_autoria_evaluacion.sql
--
--  Amplía el modelo pedagógico para que quizzes, actividades y
--  foros se gestionen desde el panel sin tocar SQL:
--
--   · estado y orden de los foros (antes solo existían los publicados);
--   · propósito, pregunta central, reglas, fechas y alternativa
--     pedagógica de un foro;
--   · caso, puntos, producto, materiales y guía docente privada de
--     una actividad;
--   · cambios de nota de foros dentro del historial existente.
--
--  Es aditiva e idempotente. No modifica migraciones históricas ni
--  borra datos. Los foros que ya existían quedan publicados y con su
--  método de calificación inferido, para conservar el comportamiento
--  actual de BPM y de cualquier curso anterior.
-- ============================================================

-- ── Foros ────────────────────────────────────────────────────
ALTER TABLE aula_forums
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'publicado',
  ADD COLUMN IF NOT EXISTS purpose TEXT,
  ADD COLUMN IF NOT EXISTS central_question TEXT,
  ADD COLUMN IF NOT EXISTS guiding_questions TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS participation_html TEXT,
  ADD COLUMN IF NOT EXISTS rules_html TEXT,
  ADD COLUMN IF NOT EXISTS opens_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS closes_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS grading_method TEXT NOT NULL DEFAULT 'formativa',
  ADD COLUMN IF NOT EXISTS no_participants_alternative TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aula_forums_status_check') THEN
    ALTER TABLE aula_forums
      ADD CONSTRAINT aula_forums_status_check
      CHECK (status IN ('borrador', 'publicado', 'archivado'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aula_forums_grading_method_check') THEN
    ALTER TABLE aula_forums
      ADD CONSTRAINT aula_forums_grading_method_check
      CHECK (grading_method IN ('formativa', 'directa', 'rubrica'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aula_forums_dates_check') THEN
    ALTER TABLE aula_forums
      ADD CONSTRAINT aula_forums_dates_check
      CHECK (closes_at IS NULL OR opens_at IS NULL OR closes_at > opens_at);
  END IF;
END $$;

-- Los foros anteriores siguen visibles y conservan su forma de nota.
UPDATE aula_forums
   SET grading_method = CASE
         WHEN rubric IS NOT NULL AND weight IS NOT NULL THEN 'rubrica'
         WHEN weight IS NOT NULL THEN 'directa'
         ELSE 'formativa'
       END
 WHERE grading_method = 'formativa'
   AND (rubric IS NOT NULL OR weight IS NOT NULL);

CREATE INDEX IF NOT EXISTS aula_forums_status_idx
  ON aula_forums (course_id, status, sort_order) WHERE deleted_at IS NULL;

-- ── Actividades ───────────────────────────────────────────────
ALTER TABLE aula_activities
  ADD COLUMN IF NOT EXISTS case_html TEXT,
  ADD COLUMN IF NOT EXISTS points_to_solve JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS expected_product TEXT,
  ADD COLUMN IF NOT EXISTS extension_hint TEXT,
  ADD COLUMN IF NOT EXISTS support_html TEXT,
  ADD COLUMN IF NOT EXISTS teacher_guide_html TEXT,
  ADD COLUMN IF NOT EXISTS grading_method TEXT NOT NULL DEFAULT 'directa',
  ADD COLUMN IF NOT EXISTS materials JSONB NOT NULL DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aula_activities_grading_method_check') THEN
    ALTER TABLE aula_activities
      ADD CONSTRAINT aula_activities_grading_method_check
      CHECK (grading_method IN ('directa', 'rubrica'));
  END IF;
END $$;

UPDATE aula_activities
   SET grading_method = 'rubrica'
 WHERE rubric IS NOT NULL
   AND grading_method = 'directa';

-- ── Cambios de nota ───────────────────────────────────────────
-- El historial ya existía para entregas e intentos; los foros también
-- pueden rectificarse con motivo y deben quedar trazados.
DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT conname
      FROM pg_constraint
     WHERE conrelid = 'aula_grade_changes'::regclass
       AND contype = 'c'
       AND pg_get_constraintdef(oid) ILIKE '%target_type%'
  LOOP
    EXECUTE format('ALTER TABLE aula_grade_changes DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE aula_grade_changes
  ADD CONSTRAINT aula_grade_changes_target_type_check
  CHECK (target_type IN ('respuesta', 'intento', 'entrega', 'foro'));

ALTER TABLE aula_grade_changes
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- ============================================================
--  064_pedagogia_funcional.sql
--
--  Completa el modelo para el recorrido real de evaluación:
--
--   · rol docente y asignación docente-curso;
--   · peso explícito por quiz, actividad y foro;
--   · política de nota del curso (60/30/10 en BPM);
--   · contadores de evaluación en la matrícula;
--   · borrador de entrega, revisión por rúbrica y publicación;
--   · nota de foro por matrícula.
--
--  No reescribe 063 ni borra datos. Los ADD COLUMN son idempotentes y
--  los pesos de BPM solo se actualizan si el curso y sus elementos
--  existen.
-- ============================================================

-- ── Rol docente ─────────────────────────────────────────────────────────
DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT conname
      FROM pg_constraint
     WHERE conrelid = 'aula_users'::regclass
       AND contype = 'c'
       AND pg_get_constraintdef(oid) ILIKE '%role%'
  LOOP
    EXECUTE format('ALTER TABLE aula_users DROP CONSTRAINT %I', c.conname);
  END LOOP;
END $$;

ALTER TABLE aula_users
  ADD CONSTRAINT aula_users_role_check
  CHECK (role IN ('admin', 'participant', 'docente'));

CREATE TABLE IF NOT EXISTS aula_course_teachers (
  course_id   BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'docente' CHECK (role IN ('docente', 'tutor')),
  created_by  BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (course_id, user_id)
);
CREATE INDEX IF NOT EXISTS aula_course_teachers_user_idx
  ON aula_course_teachers (user_id, course_id);

-- ── Pesos y política de nota ────────────────────────────────────────────
ALTER TABLE aula_assessments
  ADD COLUMN IF NOT EXISTS weight NUMERIC(5,2)
  CHECK (weight IS NULL OR weight BETWEEN 0 AND 100);
ALTER TABLE aula_activities
  ADD COLUMN IF NOT EXISTS weight NUMERIC(5,2)
  CHECK (weight IS NULL OR weight BETWEEN 0 AND 100);
ALTER TABLE aula_forums
  ADD COLUMN IF NOT EXISTS weight NUMERIC(5,2)
  CHECK (weight IS NULL OR weight BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS rubric JSONB;
ALTER TABLE aula_courses
  ADD COLUMN IF NOT EXISTS grade_policy JSONB;

COMMENT ON COLUMN aula_courses.grade_policy IS
  'Política de nota: {"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}. NULL = curso sin evaluación nueva.';

-- ── Contadores de evaluación en la matrícula ───────────────────────────
ALTER TABLE aula_enrollments
  ADD COLUMN IF NOT EXISTS assessments_submitted INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS activities_submitted INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS forums_required INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS forums_participated INTEGER NOT NULL DEFAULT 0;

-- La vista agrega las columnas nuevas al final para no romper a quien ya
-- la consulta por nombre.
CREATE OR REPLACE VIEW aula_enrollments_v AS
SELECT
  e.id,
  e.course_id,
  e.user_id,
  e.assignment_id,
  e.course_version_id,
  e.progress_status,
  e.lessons_done,
  e.lessons_required,
  e.assessments_passed,
  e.assessments_required,
  e.activities_approved,
  e.activities_required,
  e.progress_pct,
  e.final_score,
  e.starts_at,
  e.due_at,
  e.assigned_at,
  e.first_access_at,
  e.last_access_at,
  e.completed_at,
  e.active_seconds,
  e.withdrawn_at,
  e.created_at,
  e.updated_at,
  CASE
    WHEN e.withdrawn_at IS NOT NULL THEN 'retirado'
    WHEN u.status = 'invited' THEN 'invitado'
    WHEN e.progress_status IN ('completado', 'no_aprobado', 'pendiente_revision') THEN e.progress_status
    WHEN e.due_at IS NOT NULL AND e.due_at < NOW() THEN 'vencido'
    ELSE e.progress_status
  END AS effective_status,
  e.assessments_submitted,
  e.activities_submitted,
  e.forums_required,
  e.forums_participated
FROM aula_enrollments e
JOIN aula_users u ON u.id = e.user_id;

-- ── Borrador y revisión de entregas ────────────────────────────────────
ALTER TABLE aula_submissions
  ADD COLUMN IF NOT EXISTS draft_text TEXT,
  ADD COLUMN IF NOT EXISTS draft_link TEXT,
  ADD COLUMN IF NOT EXISTS draft_file_id BIGINT REFERENCES aula_files(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS draft_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rubric_review JSONB,
  ADD COLUMN IF NOT EXISTS review_draft JSONB,
  ADD COLUMN IF NOT EXISTS review_draft_by BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS review_draft_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS graded_revision_id BIGINT REFERENCES aula_submission_revisions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS feedback_published_at TIMESTAMPTZ;

-- ── Nota de foro por matrícula ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS aula_forum_grades (
  id             BIGSERIAL PRIMARY KEY,
  forum_id       BIGINT NOT NULL REFERENCES aula_forums(id) ON DELETE CASCADE,
  enrollment_id  BIGINT NOT NULL REFERENCES aula_enrollments(id) ON DELETE CASCADE,
  score          NUMERIC(6,2) CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
  rubric_review  JSONB,
  feedback       TEXT,
  graded_by      BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  graded_at      TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (forum_id, enrollment_id)
);
CREATE INDEX IF NOT EXISTS aula_forum_grades_enrollment_idx
  ON aula_forum_grades (enrollment_id);

-- ── Política efectiva de BPM ───────────────────────────────────────────
DO $$
DECLARE
  v_curso BIGINT;
BEGIN
  SELECT id INTO v_curso
    FROM aula_courses
   WHERE kind = 'edvanta'
     AND title = 'Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica'
     AND deleted_at IS NULL
   LIMIT 1;

  IF v_curso IS NULL THEN
    RAISE NOTICE 'BPM no existe: se omite la política de nota.';
    RETURN;
  END IF;

  UPDATE aula_courses
     SET grade_policy = '{"version":1,"components":{"activities":60,"quizzes":30,"forums":10},"rounding":"half_up"}'::jsonb,
         passing_score = 70,
         max_attempts = 2,
         updated_at = NOW()
   WHERE id = v_curso;

  UPDATE aula_assessments
     SET weight = 10,
         status = 'publicado'
   WHERE course_id = v_curso
     AND title LIKE 'Evaluación de la Unidad %'
     AND deleted_at IS NULL;

  UPDATE aula_activities
     SET weight = 20,
         status = 'publicado'
   WHERE course_id = v_curso
     AND title LIKE 'Actividad %'
     AND deleted_at IS NULL;

  UPDATE aula_forums
     SET weight = CASE WHEN title LIKE 'Foro 1%' THEN 3.34 ELSE 3.33 END,
         rubric = $bpmrubric$
         {
           "version": 1,
           "total": 100,
           "criteria": [
             {
               "id": "pertinencia", "name": "Pertinencia", "weight": 30,
               "levels": [
                 { "level": 4, "label": "Destacado", "description": "Responde la pregunta central y usa el caso de forma explícita." },
                 { "level": 3, "label": "Logrado", "description": "Responde la pregunta y menciona el caso." },
                 { "level": 2, "label": "En desarrollo", "description": "Responde de forma general, con poca relación con el caso." },
                 { "level": 1, "label": "Inicial", "description": "Se aleja de la pregunta." },
                 { "level": 0, "label": "Sin evidencia", "description": "No responde." }
               ]
             },
             {
               "id": "razonamiento", "name": "Razonamiento con evidencia", "weight": 40,
               "levels": [
                 { "level": 4, "label": "Destacado", "description": "Distingue conceptos, norma y riesgo con evidencia verificable." },
                 { "level": 3, "label": "Logrado", "description": "Argumenta con una razón técnica correcta." },
                 { "level": 2, "label": "En desarrollo", "description": "Usa opiniones generales." },
                 { "level": 1, "label": "Inicial", "description": "Afirma sin justificar." },
                 { "level": 0, "label": "Sin evidencia", "description": "No hay argumento." }
               ]
             },
             {
               "id": "interaccion", "name": "Interacción sustantiva", "weight": 30,
               "levels": [
                 { "level": 4, "label": "Destacado", "description": "Aporta comparación, pregunta o evidencia en dos respuestas." },
                 { "level": 3, "label": "Logrado", "description": "Responde a dos compañeros con aportes pertinentes." },
                 { "level": 2, "label": "En desarrollo", "description": "Responde a uno o de forma superficial." },
                 { "level": 1, "label": "Inicial", "description": "Solo dice «de acuerdo»." },
                 { "level": 0, "label": "Sin evidencia", "description": "No responde." }
               ]
             }
           ]
         }
         $bpmrubric$::jsonb
   WHERE course_id = v_curso
     AND title LIKE 'Foro %'
     AND deleted_at IS NULL;

  RAISE NOTICE 'BPM: política 60/30/10 y pesos por elemento aplicados.';
END $$;

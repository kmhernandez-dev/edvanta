-- ============================================================
-- 029_aula_schema.sql — Aula virtual empresarial de Edvanta
--
-- Modelo completo del LMS: cuentas y sesiones, empresas y grupos,
-- archivos, cursos con versiones, contenido por bloques, recursos
-- de trabajo, asignaciones e inscripciones, progreso, evaluaciones,
-- actividades, foros, anuncios, notificaciones y auditoría.
--
-- Aditiva e idempotente. No toca ninguna tabla existente: la
-- academia de Feliz Sin Tiroides (academia_*) y el directorio
-- público (companies, professional_groups) siguen intactos.
-- Compatible con PostgreSQL 12+ (producción: 16).
-- ============================================================

-- ── Funciones de apoyo ──────────────────────────────────────

CREATE OR REPLACE FUNCTION aula_touch_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Registros que no se pueden reescribir: versiones publicadas,
-- bitácora, cambios de nota, revisiones de entregas.
CREATE OR REPLACE FUNCTION aula_forbid_update() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'La tabla % no admite modificaciones', TG_TABLE_NAME
    USING ERRCODE = 'check_violation';
END;
$$ LANGUAGE plpgsql;

-- ── 1. Cuentas y sesiones ───────────────────────────────────

CREATE TABLE IF NOT EXISTS aula_users (
  id                   BIGSERIAL PRIMARY KEY,
  email                TEXT NOT NULL,
  first_name           TEXT NOT NULL,
  last_name            TEXT NOT NULL DEFAULT '',
  role                 TEXT NOT NULL DEFAULT 'participant'
                       CHECK (role IN ('admin', 'participant')),
  status               TEXT NOT NULL DEFAULT 'invited'
                       CHECK (status IN ('invited', 'active', 'suspended')),
  password_hash        TEXT,
  company_id           BIGINT,
  job_title            TEXT,
  is_demo              BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at        TIMESTAMPTZ,
  password_changed_at  TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ,
  CONSTRAINT aula_users_email_normalized
    CHECK (email = lower(btrim(email)) AND position('@' IN email) > 1),
  CONSTRAINT aula_users_first_name_present CHECK (length(btrim(first_name)) > 0)
);
CREATE UNIQUE INDEX IF NOT EXISTS aula_users_email_uq
  ON aula_users (email) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS aula_users_company_idx
  ON aula_users (company_id) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS aula_sessions (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  token_hash    TEXT NOT NULL UNIQUE,
  ip            TEXT,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL,
  revoked_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_sessions_user_idx
  ON aula_sessions (user_id) WHERE revoked_at IS NULL;

-- Enlaces de invitación y de recuperación de contraseña (un solo uso).
CREATE TABLE IF NOT EXISTS aula_auth_tokens (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  purpose     TEXT NOT NULL CHECK (purpose IN ('invite', 'reset')),
  token_hash  TEXT NOT NULL UNIQUE,
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_by  BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS aula_auth_tokens_user_idx ON aula_auth_tokens (user_id, purpose);

-- ── 2. Archivos ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS aula_files (
  id              BIGSERIAL PRIMARY KEY,
  storage_key     TEXT NOT NULL UNIQUE,
  original_name   TEXT NOT NULL,
  mime_type       TEXT NOT NULL,
  extension       TEXT NOT NULL,
  size_bytes      BIGINT NOT NULL CHECK (size_bytes > 0),
  received_bytes  BIGINT NOT NULL DEFAULT 0 CHECK (received_bytes >= 0),
  sha256          TEXT,
  purpose         TEXT NOT NULL
                  CHECK (purpose IN ('contenido', 'recurso', 'entrega', 'foro', 'logo', 'portada')),
  status          TEXT NOT NULL DEFAULT 'subiendo'
                  CHECK (status IN ('subiendo', 'listo', 'fallido', 'eliminado')),
  error_message   TEXT,
  uploaded_by     BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  is_demo         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_files_uploader_idx ON aula_files (uploaded_by, created_at DESC);

-- ── 3. Empresas y grupos ────────────────────────────────────
-- Clientes privados del aula. No se mezclan con el directorio
-- público `companies`.

CREATE TABLE IF NOT EXISTS aula_companies (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL CHECK (length(btrim(name)) > 0),
  logo_file_id    BIGINT REFERENCES aula_files(id) ON DELETE SET NULL,
  contact_name    TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  status          TEXT NOT NULL DEFAULT 'activa' CHECK (status IN ('activa', 'inactiva')),
  internal_notes  TEXT,
  is_demo         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS aula_companies_name_uq
  ON aula_companies (lower(btrim(name))) WHERE deleted_at IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aula_users_company_fk') THEN
    ALTER TABLE aula_users
      ADD CONSTRAINT aula_users_company_fk
      FOREIGN KEY (company_id) REFERENCES aula_companies(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS aula_groups (
  id           BIGSERIAL PRIMARY KEY,
  company_id   BIGINT REFERENCES aula_companies(id) ON DELETE RESTRICT,
  name         TEXT NOT NULL CHECK (length(btrim(name)) > 0),
  description  TEXT,
  status       TEXT NOT NULL DEFAULT 'activo' CHECK (status IN ('activo', 'cerrado')),
  starts_on    DATE,
  ends_on      DATE,
  is_demo      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ,
  CONSTRAINT aula_groups_dates CHECK (ends_on IS NULL OR starts_on IS NULL OR ends_on >= starts_on)
);
CREATE UNIQUE INDEX IF NOT EXISTS aula_groups_name_uq
  ON aula_groups (COALESCE(company_id, 0), lower(btrim(name))) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS aula_group_members (
  group_id    BIGINT NOT NULL REFERENCES aula_groups(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  added_by    BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  removed_at  TIMESTAMPTZ,
  PRIMARY KEY (group_id, user_id)
);
CREATE INDEX IF NOT EXISTS aula_group_members_user_idx
  ON aula_group_members (user_id) WHERE removed_at IS NULL;

-- ── 4. Cursos y versiones ───────────────────────────────────
-- Las tablas de módulos/clases/bloques son la copia de trabajo.
-- Al publicar se congela un snapshot en aula_course_versions, y
-- cada participante cursa el snapshot de su inscripción.

CREATE TABLE IF NOT EXISTS aula_courses (
  id                    BIGSERIAL PRIMARY KEY,
  kind                  TEXT NOT NULL CHECK (kind IN ('edvanta', 'empresa')),
  company_id            BIGINT REFERENCES aula_companies(id) ON DELETE RESTRICT,
  title                 TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  short_description     TEXT,
  description_html      TEXT,
  cover_file_id         BIGINT REFERENCES aula_files(id) ON DELETE SET NULL,
  category              TEXT,
  level                 TEXT CHECK (level IS NULL OR level IN ('basico', 'intermedio', 'avanzado')),
  tags                  TEXT[] NOT NULL DEFAULT '{}',
  objective             TEXT,
  learning_outcomes     TEXT[] NOT NULL DEFAULT '{}',
  audience              TEXT,
  prerequisites         TEXT,
  duration_minutes      INTEGER CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
  author_name           TEXT,
  modality              TEXT NOT NULL DEFAULT 'asincronica' CHECK (modality IN ('asincronica', 'mixta')),
  status                TEXT NOT NULL DEFAULT 'borrador'
                        CHECK (status IN ('borrador', 'en_revision', 'publicado', 'archivado')),
  passing_score         NUMERIC(5,2) NOT NULL DEFAULT 70 CHECK (passing_score BETWEEN 0 AND 100),
  max_attempts          INTEGER NOT NULL DEFAULT 3 CHECK (max_attempts BETWEEN 1 AND 20),
  available_from        TIMESTAMPTZ,
  available_until       TIMESTAMPTZ,
  sequential            BOOLEAN NOT NULL DEFAULT FALSE,
  video_completion_pct  INTEGER NOT NULL DEFAULT 90 CHECK (video_completion_pct BETWEEN 50 AND 100),
  resources_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  current_version_id    BIGINT,
  published_at          TIMESTAMPTZ,
  created_by            BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  updated_by            BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  is_demo               BOOLEAN NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at            TIMESTAMPTZ,
  CONSTRAINT aula_courses_company_kind CHECK (
    (kind = 'empresa' AND company_id IS NOT NULL) OR (kind = 'edvanta' AND company_id IS NULL)
  ),
  CONSTRAINT aula_courses_dates CHECK (
    available_until IS NULL OR available_from IS NULL OR available_until > available_from
  )
);
CREATE INDEX IF NOT EXISTS aula_courses_company_idx ON aula_courses (company_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS aula_courses_status_idx ON aula_courses (status) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS aula_course_versions (
  id                   BIGSERIAL PRIMARY KEY,
  course_id            BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  version_number       INTEGER NOT NULL CHECK (version_number > 0),
  change_summary       TEXT NOT NULL DEFAULT '',
  snapshot             JSONB NOT NULL,
  is_mandatory_update  BOOLEAN NOT NULL DEFAULT FALSE,
  published_by         BIGINT,
  published_by_email   TEXT,
  published_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, version_number)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aula_courses_current_version_fk') THEN
    ALTER TABLE aula_courses
      ADD CONSTRAINT aula_courses_current_version_fk
      FOREIGN KEY (current_version_id) REFERENCES aula_course_versions(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS aula_modules (
  id           BIGSERIAL PRIMARY KEY,
  course_id    BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  title        TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  description  TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_modules_course_idx
  ON aula_modules (course_id, sort_order) WHERE deleted_at IS NULL;

-- completion_rule:
--   manual → lectura: el participante marca la clase como completada
--            (y debe haber cumplido min_seconds de tiempo activo si se configura)
--   video  → se completa al cubrir el % de reproducción del curso
CREATE TABLE IF NOT EXISTS aula_lessons (
  id                BIGSERIAL PRIMARY KEY,
  course_id         BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  module_id         BIGINT NOT NULL REFERENCES aula_modules(id) ON DELETE CASCADE,
  title             TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  subtitle          TEXT,
  is_required       BOOLEAN NOT NULL DEFAULT TRUE,
  completion_rule   TEXT NOT NULL DEFAULT 'manual' CHECK (completion_rule IN ('manual', 'video')),
  min_seconds       INTEGER NOT NULL DEFAULT 0 CHECK (min_seconds >= 0),
  duration_minutes  INTEGER CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_lessons_module_idx
  ON aula_lessons (module_id, sort_order) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS aula_lessons_course_idx ON aula_lessons (course_id);

CREATE TABLE IF NOT EXISTS aula_lesson_blocks (
  id              BIGSERIAL PRIMARY KEY,
  lesson_id       BIGINT NOT NULL REFERENCES aula_lessons(id) ON DELETE CASCADE,
  type            TEXT NOT NULL CHECK (type IN (
                    'encabezado', 'texto', 'imagen', 'galeria', 'video', 'audio', 'pdf',
                    'presentacion', 'archivos', 'infografia', 'enlace', 'destacado',
                    'actividad', 'quiz', 'foro'
                  )),
  sort_order      INTEGER NOT NULL DEFAULT 0,
  data            JSONB NOT NULL DEFAULT '{}'::jsonb,
  allow_download  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_lesson_blocks_lesson_idx
  ON aula_lesson_blocks (lesson_id, sort_order) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS aula_block_files (
  block_id    BIGINT NOT NULL REFERENCES aula_lesson_blocks(id) ON DELETE CASCADE,
  file_id     BIGINT NOT NULL REFERENCES aula_files(id) ON DELETE RESTRICT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (block_id, file_id)
);

-- Archivos que forman parte de cada versión publicada. Es la tabla
-- que decide si un participante puede ver o descargar un archivo.
CREATE TABLE IF NOT EXISTS aula_version_files (
  course_version_id  BIGINT NOT NULL REFERENCES aula_course_versions(id) ON DELETE CASCADE,
  file_id            BIGINT NOT NULL REFERENCES aula_files(id) ON DELETE RESTRICT,
  downloadable       BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (course_version_id, file_id)
);
CREATE INDEX IF NOT EXISTS aula_version_files_file_idx ON aula_version_files (file_id);

-- ── 5. Recursos de trabajo ──────────────────────────────────

CREATE TABLE IF NOT EXISTS aula_resource_categories (
  id          BIGSERIAL PRIMARY KEY,
  course_id   BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  name        TEXT NOT NULL CHECK (length(btrim(name)) > 0),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);
CREATE UNIQUE INDEX IF NOT EXISTS aula_resource_categories_uq
  ON aula_resource_categories (course_id, lower(btrim(name))) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS aula_resources (
  id                  BIGSERIAL PRIMARY KEY,
  course_id           BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  category_id         BIGINT REFERENCES aula_resource_categories(id) ON DELETE SET NULL,
  title               TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  description         TEXT,
  status              TEXT NOT NULL DEFAULT 'borrador'
                      CHECK (status IN ('borrador', 'publicado', 'archivado')),
  allow_download      BOOLEAN NOT NULL DEFAULT TRUE,
  current_version_id  BIGINT,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  created_by          BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_resources_course_idx
  ON aula_resources (course_id, sort_order) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS aula_resource_versions (
  id              BIGSERIAL PRIMARY KEY,
  resource_id     BIGINT NOT NULL REFERENCES aula_resources(id) ON DELETE CASCADE,
  version_number  INTEGER NOT NULL CHECK (version_number > 0),
  file_id         BIGINT REFERENCES aula_files(id) ON DELETE RESTRICT,
  external_url    TEXT,
  notes           TEXT,
  created_by      BIGINT,
  created_by_email TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (resource_id, version_number),
  CONSTRAINT aula_resource_versions_source CHECK (file_id IS NOT NULL OR external_url IS NOT NULL)
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'aula_resources_current_version_fk') THEN
    ALTER TABLE aula_resources
      ADD CONSTRAINT aula_resources_current_version_fk
      FOREIGN KEY (current_version_id) REFERENCES aula_resource_versions(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ── 6. Asignaciones, inscripciones y progreso ───────────────

CREATE TABLE IF NOT EXISTS aula_assignments (
  id           BIGSERIAL PRIMARY KEY,
  course_id    BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  target_type  TEXT NOT NULL CHECK (target_type IN ('usuario', 'grupo', 'empresa')),
  user_id      BIGINT REFERENCES aula_users(id) ON DELETE CASCADE,
  group_id     BIGINT REFERENCES aula_groups(id) ON DELETE CASCADE,
  company_id   BIGINT REFERENCES aula_companies(id) ON DELETE CASCADE,
  starts_at    TIMESTAMPTZ,
  due_at       TIMESTAMPTZ,
  created_by   BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at   TIMESTAMPTZ,
  revoked_by   BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  CONSTRAINT aula_assignments_target CHECK (
       (target_type = 'usuario' AND user_id IS NOT NULL AND group_id IS NULL AND company_id IS NULL)
    OR (target_type = 'grupo'   AND group_id IS NOT NULL AND user_id IS NULL AND company_id IS NULL)
    OR (target_type = 'empresa' AND company_id IS NOT NULL AND user_id IS NULL AND group_id IS NULL)
  ),
  CONSTRAINT aula_assignments_dates CHECK (due_at IS NULL OR starts_at IS NULL OR due_at > starts_at)
);
CREATE INDEX IF NOT EXISTS aula_assignments_course_idx ON aula_assignments (course_id) WHERE revoked_at IS NULL;

-- progress_status lo recalcula el servidor con cada evento de
-- aprendizaje. El estado visible (con invitado, vencido y retirado)
-- sale de la vista aula_enrollments_v.
CREATE TABLE IF NOT EXISTS aula_enrollments (
  id                 BIGSERIAL PRIMARY KEY,
  course_id          BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  user_id            BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  assignment_id      BIGINT REFERENCES aula_assignments(id) ON DELETE SET NULL,
  course_version_id  BIGINT REFERENCES aula_course_versions(id) ON DELETE SET NULL,
  progress_status    TEXT NOT NULL DEFAULT 'no_iniciado' CHECK (progress_status IN (
                       'no_iniciado', 'en_progreso', 'pendiente_revision', 'completado', 'no_aprobado'
                     )),
  lessons_done       INTEGER NOT NULL DEFAULT 0,
  lessons_required   INTEGER NOT NULL DEFAULT 0,
  assessments_passed INTEGER NOT NULL DEFAULT 0,
  assessments_required INTEGER NOT NULL DEFAULT 0,
  activities_approved INTEGER NOT NULL DEFAULT 0,
  activities_required INTEGER NOT NULL DEFAULT 0,
  progress_pct       NUMERIC(5,2) NOT NULL DEFAULT 0,
  final_score        NUMERIC(6,2),
  starts_at          TIMESTAMPTZ,
  due_at             TIMESTAMPTZ,
  assigned_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  first_access_at    TIMESTAMPTZ,
  last_access_at     TIMESTAMPTZ,
  completed_at       TIMESTAMPTZ,
  active_seconds     INTEGER NOT NULL DEFAULT 0,
  withdrawn_at       TIMESTAMPTZ,
  withdrawn_by       BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (course_id, user_id)
);
CREATE INDEX IF NOT EXISTS aula_enrollments_user_idx ON aula_enrollments (user_id);
CREATE INDEX IF NOT EXISTS aula_enrollments_course_idx ON aula_enrollments (course_id);

CREATE TABLE IF NOT EXISTS aula_lesson_progress (
  id                      BIGSERIAL PRIMARY KEY,
  enrollment_id           BIGINT NOT NULL REFERENCES aula_enrollments(id) ON DELETE CASCADE,
  lesson_id               BIGINT NOT NULL REFERENCES aula_lessons(id) ON DELETE CASCADE,
  course_version_id       BIGINT REFERENCES aula_course_versions(id) ON DELETE SET NULL,
  status                  TEXT NOT NULL DEFAULT 'iniciado' CHECK (status IN ('iniciado', 'completado')),
  active_seconds          INTEGER NOT NULL DEFAULT 0 CHECK (active_seconds >= 0),
  video_position_seconds  NUMERIC(10,2) NOT NULL DEFAULT 0,
  video_duration_seconds  NUMERIC(10,2),
  video_segments          JSONB NOT NULL DEFAULT '[]'::jsonb,
  video_watched_pct       NUMERIC(5,2) NOT NULL DEFAULT 0,
  first_opened_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at            TIMESTAMPTZ,
  UNIQUE (enrollment_id, lesson_id)
);

-- ── 7. Evaluaciones ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS aula_question_banks (
  id           BIGSERIAL PRIMARY KEY,
  course_id    BIGINT REFERENCES aula_courses(id) ON DELETE CASCADE,
  name         TEXT NOT NULL CHECK (length(btrim(name)) > 0),
  description  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS aula_questions (
  id                BIGSERIAL PRIMARY KEY,
  bank_id           BIGINT NOT NULL REFERENCES aula_question_banks(id) ON DELETE CASCADE,
  type              TEXT NOT NULL CHECK (type IN (
                      'unica', 'multiple', 'verdadero_falso', 'relacionar', 'ordenar',
                      'completar', 'respuesta_corta', 'caso_practico'
                    )),
  prompt_html       TEXT NOT NULL,
  points            NUMERIC(6,2) NOT NULL DEFAULT 1 CHECK (points > 0),
  general_feedback  TEXT,
  explanation       TEXT,
  config            JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by        BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_questions_bank_idx ON aula_questions (bank_id) WHERE deleted_at IS NULL;

-- Para 'relacionar', text es el término y match_text su pareja.
-- Para 'ordenar', sort_order es el orden correcto.
CREATE TABLE IF NOT EXISTS aula_question_options (
  id           BIGSERIAL PRIMARY KEY,
  question_id  BIGINT NOT NULL REFERENCES aula_questions(id) ON DELETE CASCADE,
  text         TEXT NOT NULL,
  is_correct   BOOLEAN NOT NULL DEFAULT FALSE,
  feedback     TEXT,
  match_text   TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_question_options_q_idx
  ON aula_question_options (question_id, sort_order) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS aula_assessments (
  id                         BIGSERIAL PRIMARY KEY,
  course_id                  BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  module_id                  BIGINT REFERENCES aula_modules(id) ON DELETE SET NULL,
  lesson_id                  BIGINT REFERENCES aula_lessons(id) ON DELETE SET NULL,
  title                      TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  instructions_html          TEXT,
  is_required                BOOLEAN NOT NULL DEFAULT TRUE,
  passing_score              NUMERIC(5,2) CHECK (passing_score IS NULL OR passing_score BETWEEN 0 AND 100),
  max_attempts               INTEGER CHECK (max_attempts IS NULL OR max_attempts BETWEEN 1 AND 20),
  time_limit_minutes         INTEGER CHECK (time_limit_minutes IS NULL OR time_limit_minutes > 0),
  shuffle_questions          BOOLEAN NOT NULL DEFAULT FALSE,
  shuffle_options            BOOLEAN NOT NULL DEFAULT FALSE,
  show_answers_after_submit  BOOLEAN NOT NULL DEFAULT FALSE,
  status                     TEXT NOT NULL DEFAULT 'borrador'
                             CHECK (status IN ('borrador', 'publicado', 'archivado')),
  sort_order                 INTEGER NOT NULL DEFAULT 0,
  created_by                 BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at                 TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_assessments_course_idx ON aula_assessments (course_id) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS aula_assessment_questions (
  assessment_id    BIGINT NOT NULL REFERENCES aula_assessments(id) ON DELETE CASCADE,
  question_id      BIGINT NOT NULL REFERENCES aula_questions(id) ON DELETE RESTRICT,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  points_override  NUMERIC(6,2) CHECK (points_override IS NULL OR points_override > 0),
  PRIMARY KEY (assessment_id, question_id)
);

-- `served` congela lo que vio el participante (preguntas, orden y
-- puntaje) para que editar la evaluación no altere intentos pasados.
CREATE TABLE IF NOT EXISTS aula_attempts (
  id                 BIGSERIAL PRIMARY KEY,
  assessment_id      BIGINT NOT NULL REFERENCES aula_assessments(id) ON DELETE CASCADE,
  enrollment_id      BIGINT NOT NULL REFERENCES aula_enrollments(id) ON DELETE CASCADE,
  course_version_id  BIGINT REFERENCES aula_course_versions(id) ON DELETE SET NULL,
  attempt_number     INTEGER NOT NULL CHECK (attempt_number > 0),
  status             TEXT NOT NULL DEFAULT 'en_curso'
                     CHECK (status IN ('en_curso', 'pendiente_revision', 'calificado', 'expirado')),
  served             JSONB NOT NULL,
  started_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at         TIMESTAMPTZ,
  submitted_at       TIMESTAMPTZ,
  duration_seconds   INTEGER,
  score              NUMERIC(8,2),
  max_score          NUMERIC(8,2),
  score_pct          NUMERIC(5,2),
  passing_score      NUMERIC(5,2) NOT NULL,
  passed             BOOLEAN,
  graded_at          TIMESTAMPTZ,
  graded_by          BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (assessment_id, enrollment_id, attempt_number)
);
CREATE UNIQUE INDEX IF NOT EXISTS aula_attempts_one_open
  ON aula_attempts (assessment_id, enrollment_id) WHERE status = 'en_curso';
CREATE INDEX IF NOT EXISTS aula_attempts_enrollment_idx ON aula_attempts (enrollment_id);

CREATE TABLE IF NOT EXISTS aula_attempt_answers (
  id                 BIGSERIAL PRIMARY KEY,
  attempt_id         BIGINT NOT NULL REFERENCES aula_attempts(id) ON DELETE CASCADE,
  question_id        BIGINT NOT NULL REFERENCES aula_questions(id) ON DELETE RESTRICT,
  response           JSONB NOT NULL DEFAULT 'null'::jsonb,
  is_correct         BOOLEAN,
  points_awarded     NUMERIC(6,2),
  max_points         NUMERIC(6,2) NOT NULL,
  needs_review       BOOLEAN NOT NULL DEFAULT FALSE,
  reviewer_feedback  TEXT,
  reviewed_by        BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  reviewed_at        TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (attempt_id, question_id)
);

-- ── 8. Actividades y entregas ───────────────────────────────

CREATE TABLE IF NOT EXISTS aula_activities (
  id                   BIGSERIAL PRIMARY KEY,
  course_id            BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  module_id            BIGINT REFERENCES aula_modules(id) ON DELETE SET NULL,
  lesson_id            BIGINT REFERENCES aula_lessons(id) ON DELETE SET NULL,
  title                TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  instructions_html    TEXT,
  rubric               JSONB,
  due_at               TIMESTAMPTZ,
  allow_text           BOOLEAN NOT NULL DEFAULT TRUE,
  allow_link           BOOLEAN NOT NULL DEFAULT FALSE,
  allow_file           BOOLEAN NOT NULL DEFAULT TRUE,
  accepted_extensions  TEXT[] NOT NULL DEFAULT '{pdf,docx,xlsx,pptx,png,jpg,jpeg}',
  max_file_mb          INTEGER NOT NULL DEFAULT 20 CHECK (max_file_mb BETWEEN 1 AND 1024),
  max_points           NUMERIC(6,2) NOT NULL DEFAULT 100 CHECK (max_points > 0),
  is_required          BOOLEAN NOT NULL DEFAULT TRUE,
  status               TEXT NOT NULL DEFAULT 'borrador'
                       CHECK (status IN ('borrador', 'publicado', 'archivado')),
  sort_order           INTEGER NOT NULL DEFAULT 0,
  created_by           BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ,
  CONSTRAINT aula_activities_channels CHECK (allow_text OR allow_link OR allow_file)
);
CREATE INDEX IF NOT EXISTS aula_activities_course_idx ON aula_activities (course_id) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS aula_submissions (
  id                  BIGSERIAL PRIMARY KEY,
  activity_id         BIGINT NOT NULL REFERENCES aula_activities(id) ON DELETE CASCADE,
  enrollment_id       BIGINT NOT NULL REFERENCES aula_enrollments(id) ON DELETE CASCADE,
  status              TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN (
                        'pendiente', 'enviada', 'entregada_tarde', 'en_revision',
                        'requiere_ajustes', 'aprobada', 'no_aprobada'
                      )),
  score               NUMERIC(6,2),
  current_revision    INTEGER NOT NULL DEFAULT 0,
  first_submitted_at  TIMESTAMPTZ,
  last_submitted_at   TIMESTAMPTZ,
  reviewed_at         TIMESTAMPTZ,
  reviewed_by         BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (activity_id, enrollment_id)
);
CREATE INDEX IF NOT EXISTS aula_submissions_enrollment_idx ON aula_submissions (enrollment_id);
CREATE INDEX IF NOT EXISTS aula_submissions_status_idx ON aula_submissions (status);

CREATE TABLE IF NOT EXISTS aula_submission_revisions (
  id               BIGSERIAL PRIMARY KEY,
  submission_id    BIGINT NOT NULL REFERENCES aula_submissions(id) ON DELETE CASCADE,
  revision_number  INTEGER NOT NULL CHECK (revision_number > 0),
  text_body        TEXT,
  link_url         TEXT,
  file_id          BIGINT REFERENCES aula_files(id) ON DELETE RESTRICT,
  is_late          BOOLEAN NOT NULL DEFAULT FALSE,
  submitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (submission_id, revision_number),
  CONSTRAINT aula_submission_revisions_content
    CHECK (text_body IS NOT NULL OR link_url IS NOT NULL OR file_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS aula_submission_feedback (
  id             BIGSERIAL PRIMARY KEY,
  submission_id  BIGINT NOT NULL REFERENCES aula_submissions(id) ON DELETE CASCADE,
  revision_id    BIGINT REFERENCES aula_submission_revisions(id) ON DELETE CASCADE,
  author_id      BIGINT,
  author_email   TEXT,
  decision       TEXT NOT NULL CHECK (decision IN (
                   'comentario', 'en_revision', 'requiere_ajustes', 'aprobada', 'no_aprobada'
                 )),
  body           TEXT,
  score          NUMERIC(6,2),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 9. Foros, anuncios y notificaciones ─────────────────────

CREATE TABLE IF NOT EXISTS aula_forums (
  id                 BIGSERIAL PRIMARY KEY,
  course_id          BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  module_id          BIGINT REFERENCES aula_modules(id) ON DELETE SET NULL,
  lesson_id          BIGINT REFERENCES aula_lessons(id) ON DELETE SET NULL,
  scope              TEXT NOT NULL CHECK (scope IN ('curso', 'modulo', 'clase')),
  title              TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  description        TEXT,
  is_closed          BOOLEAN NOT NULL DEFAULT FALSE,
  allow_attachments  BOOLEAN NOT NULL DEFAULT FALSE,
  created_by         BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at         TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_forums_course_idx ON aula_forums (course_id) WHERE deleted_at IS NULL;

-- thread_id NULL = hilo raíz; si no, es respuesta de ese hilo.
CREATE TABLE IF NOT EXISTS aula_forum_posts (
  id                BIGSERIAL PRIMARY KEY,
  forum_id          BIGINT NOT NULL REFERENCES aula_forums(id) ON DELETE CASCADE,
  thread_id         BIGINT REFERENCES aula_forum_posts(id) ON DELETE CASCADE,
  author_id         BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  title             TEXT,
  body_html         TEXT NOT NULL,
  file_id           BIGINT REFERENCES aula_files(id) ON DELETE SET NULL,
  is_pinned         BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked         BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden         BOOLEAN NOT NULL DEFAULT FALSE,
  hidden_by         BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  hidden_reason     TEXT,
  hidden_at         TIMESTAMPTZ,
  reply_count       INTEGER NOT NULL DEFAULT 0,
  last_activity_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ,
  CONSTRAINT aula_forum_posts_thread_title CHECK (thread_id IS NOT NULL OR title IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS aula_forum_posts_forum_idx
  ON aula_forum_posts (forum_id, is_pinned DESC, last_activity_at DESC) WHERE thread_id IS NULL;
CREATE INDEX IF NOT EXISTS aula_forum_posts_thread_idx ON aula_forum_posts (thread_id, created_at);

-- Participantes silenciados en los foros de un curso.
CREATE TABLE IF NOT EXISTS aula_forum_mutes (
  course_id   BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  user_id     BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  reason      TEXT,
  muted_by    BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (course_id, user_id)
);

CREATE TABLE IF NOT EXISTS aula_announcements (
  id            BIGSERIAL PRIMARY KEY,
  course_id     BIGINT REFERENCES aula_courses(id) ON DELETE CASCADE,
  title         TEXT NOT NULL CHECK (length(btrim(title)) > 0),
  body_html     TEXT NOT NULL,
  is_pinned     BOOLEAN NOT NULL DEFAULT FALSE,
  author_id     BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  published_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS aula_announcements_course_idx
  ON aula_announcements (course_id, published_at DESC) WHERE deleted_at IS NULL;

-- email_status deja lista la entrega por correo cuando se active.
CREATE TABLE IF NOT EXISTS aula_notifications (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL,
  title         TEXT NOT NULL,
  body          TEXT,
  link          TEXT,
  dedupe_key    TEXT,
  read_at       TIMESTAMPTZ,
  email_status  TEXT NOT NULL DEFAULT 'no_aplica'
                CHECK (email_status IN ('no_aplica', 'pendiente', 'enviado', 'fallido')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS aula_notifications_user_idx
  ON aula_notifications (user_id, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS aula_notifications_dedupe_uq
  ON aula_notifications (user_id, dedupe_key) WHERE dedupe_key IS NOT NULL;

-- ── 10. Trazabilidad ────────────────────────────────────────
-- Sin llaves foráneas a propósito: la bitácora debe sobrevivir
-- aunque se borren los datos demostrativos a los que apunta.

CREATE TABLE IF NOT EXISTS aula_audit_log (
  id           BIGSERIAL PRIMARY KEY,
  actor_id     BIGINT,
  actor_email  TEXT,
  action       TEXT NOT NULL,
  entity_type  TEXT NOT NULL,
  entity_id    BIGINT,
  course_id    BIGINT,
  company_id   BIGINT,
  summary      TEXT NOT NULL,
  before_data  JSONB,
  after_data   JSONB,
  reason       TEXT,
  ip           TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS aula_audit_log_created_idx ON aula_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS aula_audit_log_entity_idx ON aula_audit_log (entity_type, entity_id);

CREATE TABLE IF NOT EXISTS aula_grade_changes (
  id                BIGSERIAL PRIMARY KEY,
  target_type       TEXT NOT NULL CHECK (target_type IN ('respuesta', 'intento', 'entrega')),
  target_id         BIGINT NOT NULL,
  enrollment_id     BIGINT,
  old_value         NUMERIC(8,2),
  new_value         NUMERIC(8,2),
  reason            TEXT NOT NULL CHECK (length(btrim(reason)) >= 5),
  changed_by        BIGINT,
  changed_by_email  TEXT,
  changed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS aula_grade_changes_target_idx ON aula_grade_changes (target_type, target_id);

-- Estructura preparada para una fase posterior. Esta versión no
-- emite ni promete certificados.
CREATE TABLE IF NOT EXISTS aula_certificates (
  id             BIGSERIAL PRIMARY KEY,
  enrollment_id  BIGINT NOT NULL UNIQUE REFERENCES aula_enrollments(id) ON DELETE CASCADE,
  code           TEXT UNIQUE,
  status         TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'emitido', 'revocado')),
  issued_at      TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Vista de estado efectivo ────────────────────────────────
-- Única fuente para dashboard, reportes y expedientes.

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
  END AS effective_status
FROM aula_enrollments e
JOIN aula_users u ON u.id = e.user_id;

-- ── Disparadores ────────────────────────────────────────────

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'aula_users', 'aula_files', 'aula_companies', 'aula_groups', 'aula_courses',
    'aula_modules', 'aula_lessons', 'aula_lesson_blocks', 'aula_resource_categories',
    'aula_resources', 'aula_enrollments', 'aula_question_banks', 'aula_questions',
    'aula_question_options', 'aula_assessments', 'aula_attempts', 'aula_attempt_answers',
    'aula_activities', 'aula_submissions', 'aula_forums', 'aula_forum_posts',
    'aula_announcements'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', t || '_touch', t);
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION aula_touch_updated_at()',
      t || '_touch', t
    );
  END LOOP;

  FOREACH t IN ARRAY ARRAY[
    'aula_course_versions', 'aula_resource_versions', 'aula_audit_log',
    'aula_grade_changes', 'aula_submission_revisions', 'aula_submission_feedback'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', t || '_immutable', t);
    EXECUTE format(
      'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION aula_forbid_update()',
      t || '_immutable', t
    );
  END LOOP;
END $$;

-- La bitácora y el historial de notas tampoco se borran.
DROP TRIGGER IF EXISTS aula_audit_log_nodelete ON aula_audit_log;
CREATE TRIGGER aula_audit_log_nodelete
  BEFORE DELETE ON aula_audit_log
  FOR EACH ROW EXECUTE FUNCTION aula_forbid_update();

DROP TRIGGER IF EXISTS aula_grade_changes_nodelete ON aula_grade_changes;
CREATE TRIGGER aula_grade_changes_nodelete
  BEFORE DELETE ON aula_grade_changes
  FOR EACH ROW EXECUTE FUNCTION aula_forbid_update();

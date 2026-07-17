-- ============================================================
-- 003_academia.sql — Academia Feliz Sin Tiroides
-- Tablas para el aula virtual: usuarios, cursos, módulos,
-- lecciones, inscripciones, progreso y comentarios.
-- ============================================================

-- Usuarios de la academia
CREATE TABLE IF NOT EXISTS academia_users (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cursos
CREATE TABLE IF NOT EXISTS academia_courses (
  id            BIGSERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  category      TEXT NOT NULL,
  cover_image   TEXT,
  duration      TEXT,          -- ej: '4 semanas', '6 horas'
  class_count   INTEGER DEFAULT 0,
  is_published  BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Módulos (agrupan lecciones)
CREATE TABLE IF NOT EXISTS academia_modules (
  id          BIGSERIAL PRIMARY KEY,
  course_id   BIGINT NOT NULL REFERENCES academia_courses(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lecciones (clases individuales)
CREATE TABLE IF NOT EXISTS academia_lessons (
  id              BIGSERIAL PRIMARY KEY,
  module_id       BIGINT NOT NULL REFERENCES academia_modules(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  video_url       TEXT,          -- URL de YouTube
  duration_min    INTEGER DEFAULT 0,
  has_resources   BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_published    BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inscripciones (usuario se inscribe a un curso)
CREATE TABLE IF NOT EXISTS academia_enrollments (
  user_id     BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  course_id   BIGINT NOT NULL REFERENCES academia_courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, course_id)
);

-- Progreso (lección completada por usuario)
CREATE TABLE IF NOT EXISTS academia_progress (
  user_id       BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  lesson_id     BIGINT NOT NULL REFERENCES academia_lessons(id) ON DELETE CASCADE,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);

-- Comentarios en lecciones
CREATE TABLE IF NOT EXISTS academia_comments (
  id            BIGSERIAL PRIMARY KEY,
  lesson_id     BIGINT NOT NULL REFERENCES academia_lessons(id) ON DELETE CASCADE,
  user_id       BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  parent_id     BIGINT REFERENCES academia_comments(id) ON DELETE CASCADE,
  body          TEXT NOT NULL,
  is_moderated  BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_academia_modules_course ON academia_modules(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_academia_lessons_module ON academia_lessons(module_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_academia_enrollments_user ON academia_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_academia_progress_user ON academia_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_academia_comments_lesson ON academia_comments(lesson_id, created_at);
CREATE INDEX IF NOT EXISTS idx_academia_comments_parent ON academia_comments(parent_id);

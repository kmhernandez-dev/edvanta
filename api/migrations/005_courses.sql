-- ============================================================
--  005_courses.sql — Catálogo multi-plataforma de cursos
--
--  Soporta cursos de Edutin, Coursera, Udemy y otras plataformas.
--  Cada curso tiene un slug único, metadatos completos y
--  enlaces originales y de afiliado.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS courses (
  id                    BIGSERIAL PRIMARY KEY,
  title                 TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  short_description     TEXT,
  full_description      TEXT,
  provider              TEXT NOT NULL DEFAULT 'edutin',
  provider_course_id    TEXT,
  original_url          TEXT,
  affiliate_url         TEXT,
  category              TEXT,
  subcategory           TEXT,
  professional_area     TEXT,
  language              TEXT,
  level                 TEXT,
  modality              TEXT,
  price_type            TEXT,
  current_price         NUMERIC(12,2),
  original_price        NUMERIC(12,2),
  currency              TEXT DEFAULT 'USD',
  discount_percentage   INTEGER,
  certificate_available BOOLEAN DEFAULT false,
  certificate_included  BOOLEAN DEFAULT false,
  duration              TEXT,
  rating                NUMERIC(3,2),
  review_count          INTEGER,
  student_count         INTEGER,
  image_url             TEXT,
  instructor            TEXT,
  institution           TEXT,
  skills                TEXT[],
  learning_outcomes     TEXT[],
  requirements          TEXT[],
  featured              BOOLEAN DEFAULT false,
  trending              BOOLEAN DEFAULT false,
  active                BOOLEAN DEFAULT true,
  published_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsquedas y filtros frecuentes
CREATE INDEX IF NOT EXISTS idx_courses_provider       ON courses (provider);
CREATE INDEX IF NOT EXISTS idx_courses_category       ON courses (category);
CREATE INDEX IF NOT EXISTS idx_courses_professional_area ON courses (professional_area);
CREATE INDEX IF NOT EXISTS idx_courses_language       ON courses (language);
CREATE INDEX IF NOT EXISTS idx_courses_level          ON courses (level);
CREATE INDEX IF NOT EXISTS idx_courses_price_type     ON courses (price_type);
CREATE INDEX IF NOT EXISTS idx_courses_active         ON courses (active);
CREATE INDEX IF NOT EXISTS idx_courses_featured       ON courses (featured);
CREATE INDEX IF NOT EXISTS idx_courses_trending       ON courses (trending);
CREATE INDEX IF NOT EXISTS idx_courses_provider_course ON courses (provider, provider_course_id);
CREATE INDEX IF NOT EXISTS idx_courses_title_trgm     ON courses USING gin (title gin_trgm_ops);

-- Índice de búsqueda full-text
CREATE INDEX IF NOT EXISTS idx_courses_search ON courses
  USING gin (to_tsvector('spanish', coalesce(title, '') || ' ' || coalesce(short_description, '') || ' ' || coalesce(category, '')));

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_courses_updated_at ON courses;
CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_courses_updated_at();

-- ============================================================
--  Tabla de clics para analítica de afiliados
-- ============================================================
CREATE TABLE IF NOT EXISTS course_clicks (
  id              BIGSERIAL PRIMARY KEY,
  course_id       BIGINT REFERENCES courses(id) ON DELETE SET NULL,
  provider        TEXT,
  destination_url TEXT NOT NULL,
  page_path       TEXT,
  clicked_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  referrer        TEXT,
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT
);

CREATE INDEX IF NOT EXISTS idx_course_clicks_course_id ON course_clicks (course_id);
CREATE INDEX IF NOT EXISTS idx_course_clicks_clicked_at ON course_clicks (clicked_at);
CREATE INDEX IF NOT EXISTS idx_course_clicks_provider   ON course_clicks (provider);

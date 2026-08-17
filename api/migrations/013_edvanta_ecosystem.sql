-- ============================================================
-- 013_edvanta_ecosystem.sql
-- Extensible model for resources, opportunities and community.
-- No companies, jobs, reviews or activity are fabricated here.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  iso_code CHAR(2) NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  region TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS industry_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  provider_name TEXT,
  summary TEXT,
  official_url TEXT,
  level TEXT,
  language TEXT,
  country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  editorial_note TEXT,
  seo_title TEXT,
  seo_description TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS certification_careers (
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  relevance SMALLINT NOT NULL DEFAULT 50 CHECK (relevance BETWEEN 0 AND 100),
  PRIMARY KEY (certification_id, career_id)
);

CREATE TABLE IF NOT EXISTS certification_skills (
  certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (certification_id, skill_id)
);

CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  industry_sector_id UUID REFERENCES industry_sectors(id) ON DELETE SET NULL,
  country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
  size_range TEXT,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS professional_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('article', 'guide', 'template', 'news', 'regulation', 'case', 'tutorial', 'glossary', 'research')),
  excerpt TEXT,
  content TEXT,
  source_url TEXT,
  author_name TEXT,
  country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_careers (
  resource_id UUID NOT NULL REFERENCES professional_resources(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, career_id)
);

CREATE TABLE IF NOT EXISTS resource_skills (
  resource_id UUID NOT NULL REFERENCES professional_resources(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, skill_id)
);

CREATE TABLE IF NOT EXISTS resource_courses (
  resource_id UUID NOT NULL REFERENCES professional_resources(id) ON DELETE CASCADE,
  course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, course_id)
);

CREATE TABLE IF NOT EXISTS resource_learning_paths (
  resource_id UUID NOT NULL REFERENCES professional_resources(id) ON DELETE CASCADE,
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, learning_path_id)
);

CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  opportunity_type TEXT NOT NULL CHECK (opportunity_type IN ('job', 'internship', 'trainee', 'scholarship', 'research', 'project', 'event', 'volunteer', 'freelance', 'challenge')),
  title TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  organization_name TEXT,
  description TEXT NOT NULL,
  country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
  city TEXT,
  remote_type TEXT NOT NULL DEFAULT 'onsite' CHECK (remote_type IN ('onsite', 'hybrid', 'remote', 'unspecified')),
  experience_level TEXT,
  application_url TEXT NOT NULL,
  deadline TIMESTAMPTZ,
  source_name TEXT,
  source_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (company_id IS NOT NULL OR organization_name IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS opportunity_careers (
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  PRIMARY KEY (opportunity_id, career_id)
);

CREATE TABLE IF NOT EXISTS opportunity_skills (
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (opportunity_id, skill_id)
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('practice', 'research', 'startup', 'industry', 'challenge', 'innovation')),
  creator_external_id UUID,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  difficulty TEXT CHECK (difficulty IN ('foundation', 'intermediate', 'advanced')),
  participants_limit INTEGER CHECK (participants_limit IS NULL OR participants_limit > 0),
  country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
  remote BOOLEAN NOT NULL DEFAULT TRUE,
  educational_disclosure BOOLEAN NOT NULL DEFAULT TRUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'active', 'completed', 'archived')),
  application_url TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_careers (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  career_id UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, career_id)
);

CREATE TABLE IF NOT EXISTS project_skills (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

CREATE TABLE IF NOT EXISTS professional_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  group_type TEXT NOT NULL CHECK (group_type IN ('study', 'career', 'research', 'entrepreneurship', 'mentoring', 'product_testing', 'project')),
  career_id UUID REFERENCES careers(id) ON DELETE SET NULL,
  country_id UUID REFERENCES countries(id) ON DELETE SET NULL,
  remote BOOLEAN NOT NULL DEFAULT TRUE,
  join_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_type_id UUID NOT NULL REFERENCES post_types(id) ON DELETE RESTRICT,
  creator_external_id UUID,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  destination_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected', 'archived')),
  moderation_note TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_opportunities (
  resource_id UUID NOT NULL REFERENCES professional_resources(id) ON DELETE CASCADE,
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, opportunity_id)
);

CREATE TABLE IF NOT EXISTS resource_projects (
  resource_id UUID NOT NULL REFERENCES professional_resources(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, project_id)
);

CREATE INDEX IF NOT EXISTS idx_opportunities_public ON opportunities (status, verified_at, deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_country_type ON opportunities (country_id, opportunity_type);
CREATE INDEX IF NOT EXISTS idx_companies_public ON companies (status, verified, country_id);
CREATE INDEX IF NOT EXISTS idx_resources_public ON professional_resources (status, resource_type, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_public ON projects (status, project_type, verified_at);
CREATE INDEX IF NOT EXISTS idx_groups_public ON professional_groups (status, group_type, verified_at);

DROP TRIGGER IF EXISTS trg_industry_sectors_updated_at ON industry_sectors;
CREATE TRIGGER trg_industry_sectors_updated_at BEFORE UPDATE ON industry_sectors FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_product_categories_updated_at ON product_categories;
CREATE TRIGGER trg_product_categories_updated_at BEFORE UPDATE ON product_categories FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_certifications_updated_at ON certifications;
CREATE TRIGGER trg_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_companies_updated_at ON companies;
CREATE TRIGGER trg_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_resources_updated_at ON professional_resources;
CREATE TRIGGER trg_resources_updated_at BEFORE UPDATE ON professional_resources FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_opportunities_updated_at ON opportunities;
CREATE TRIGGER trg_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_groups_updated_at ON professional_groups;
CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON professional_groups FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_community_posts_updated_at ON community_posts;
CREATE TRIGGER trg_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();

INSERT INTO countries (iso_code, name, region) VALUES
  ('AR', 'Argentina', 'Latinoamérica'), ('BO', 'Bolivia', 'Latinoamérica'),
  ('BR', 'Brasil', 'Latinoamérica'), ('CL', 'Chile', 'Latinoamérica'),
  ('CO', 'Colombia', 'Latinoamérica'), ('CR', 'Costa Rica', 'Latinoamérica'),
  ('DO', 'República Dominicana', 'Latinoamérica'), ('EC', 'Ecuador', 'Latinoamérica'),
  ('GT', 'Guatemala', 'Latinoamérica'), ('HN', 'Honduras', 'Latinoamérica'),
  ('MX', 'México', 'Latinoamérica'), ('NI', 'Nicaragua', 'Latinoamérica'),
  ('PA', 'Panamá', 'Latinoamérica'), ('PE', 'Perú', 'Latinoamérica'),
  ('PR', 'Puerto Rico', 'Latinoamérica'), ('PY', 'Paraguay', 'Latinoamérica'),
  ('SV', 'El Salvador', 'Latinoamérica'), ('UY', 'Uruguay', 'Latinoamérica'),
  ('VE', 'Venezuela', 'Latinoamérica')
ON CONFLICT (iso_code) DO UPDATE SET name = EXCLUDED.name, region = EXCLUDED.region;

INSERT INTO industry_sectors (slug, name) VALUES
  ('industria-farmaceutica', 'Industria farmacéutica'),
  ('biotecnologia', 'Biotecnología'),
  ('dispositivos-medicos', 'Dispositivos médicos'),
  ('cosmeticos', 'Cosméticos'),
  ('suplementos', 'Suplementos'),
  ('salud-clinica', 'Salud clínica y asistencial'),
  ('investigacion', 'Investigación y academia')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO product_categories (slug, name) VALUES
  ('medicamentos', 'Medicamentos'), ('biologicos', 'Biológicos'),
  ('dispositivos-medicos', 'Dispositivos médicos'), ('diagnostico-in-vitro', 'Diagnóstico in vitro'),
  ('cosmeticos', 'Cosméticos'), ('suplementos', 'Suplementos'),
  ('productos-veterinarios', 'Productos veterinarios')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO post_types (slug, name) VALUES
  ('oportunidad', 'Oportunidad'), ('empleo', 'Empleo'), ('proyecto', 'Proyecto'),
  ('investigacion', 'Investigación'), ('emprendimiento', 'Emprendimiento'),
  ('producto', 'Producto'), ('ia', 'Inteligencia artificial'), ('grupo', 'Grupo'),
  ('evento', 'Evento'), ('pregunta', 'Pregunta'), ('recurso', 'Recurso'), ('noticia', 'Noticia')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;


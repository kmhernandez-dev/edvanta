-- ============================================================
-- 025_community_jobs_talent.sql
-- Banco comunitario de empleo y directorio de talento.
-- Las publicaciones de usuarios se marcan como 'pending' y se
-- moderan manualmente; el seed editorial queda 'published'.
-- ============================================================

CREATE TABLE IF NOT EXISTS community_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  cargo TEXT NOT NULL,
  empresa TEXT,
  ciudad TEXT,
  modalidad TEXT NOT NULL DEFAULT 'onsite' CHECK (modalidad IN ('onsite', 'hybrid', 'remote')),
  requisitos TEXT,
  contacto TEXT NOT NULL,
  fuente TEXT NOT NULL DEFAULT 'Comunidad Edvanta',
  ip_address TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_jobs_public ON community_jobs (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_jobs_cargo ON community_jobs (cargo);

CREATE TABLE IF NOT EXISTS talent_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  area TEXT NOT NULL,
  title TEXT NOT NULL,
  habilidades JSONB NOT NULL DEFAULT '[]'::jsonb,
  proyectos JSONB NOT NULL DEFAULT '[]'::jsonb,
  articulos JSONB NOT NULL DEFAULT '[]'::jsonb,
  linkedin TEXT,
  contacto TEXT,
  disponibilidad TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_talent_profiles_public ON talent_profiles (status, area, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_talent_profiles_area ON talent_profiles (area);

DROP TRIGGER IF EXISTS trg_community_jobs_updated_at ON community_jobs;
CREATE TRIGGER trg_community_jobs_updated_at BEFORE UPDATE ON community_jobs
  FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_talent_profiles_updated_at ON talent_profiles;
CREATE TRIGGER trg_talent_profiles_updated_at BEFORE UPDATE ON talent_profiles
  FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();

-- Seed editorial (verificado manualmente, a modo de ejemplo inicial)
INSERT INTO community_jobs (slug, cargo, empresa, ciudad, modalidad, requisitos, contacto, fuente, status, published_at) VALUES
  ('demo-analista-control-calidad', 'Analista de control de calidad', 'Laboratorio farmacéutico (Bogotá)', 'Bogotá', 'onsite',
   'Química Farmacéutica o afines. Experiencia en métodos analíticos y BPM.', 'talentohumano@ejemplo.com', 'Plantilla comunitaria', 'published', NOW() - INTERVAL '5 days'),
  ('demo-regente-farmacia', 'Regente de farmacia', 'Cadena de farmacias (Medellín)', 'Medellín', 'onsite',
   'Tarjeta profesional de regencia vigente. Disponibilidad para horarios rotativos.', 'seleccion@ejemplo.com', 'Plantilla comunitaria', 'published', NOW() - INTERVAL '4 days'),
  ('demo-farmacovigilancia', 'Profesional de farmacovigilancia', 'Titular de registro sanitario (Bogotá)', 'Bogotá', 'hybrid',
   'Experiencia en gestión de casos y reportes a autoridad sanitaria.', 'cv@ejemplo.com', 'Plantilla comunitaria', 'published', NOW() - INTERVAL '3 days')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO talent_profiles (slug, display_name, area, title, habilidades, proyectos, articulos, linkedin, disponibilidad, status, published_at) VALUES
  ('talent-camila-rodriguez', 'Camila Rodríguez', 'calidad', 'Química farmacéutica — Analista de control de calidad',
   '["Química analítica", "Microbiología", "BPM", "Integridad de datos"]',
   '["Validación de método de disolución", "Implementación de checklist de muestreo"]',
   '["Estabilidad de formas sólidas en clima tropical"]',
   'https://www.linkedin.com/', 'Disponible para iniciar', 'published', NOW() - INTERVAL '6 days'),
  ('talent-andres-paez', 'Andrés Páez', 'regulatorio', 'Profesional de asuntos regulatorios',
   '["Registros sanitarios", "Etiquetado", "Dossiers", "Farmacovigilancia"]',
   '["Renovación de 12 registros sanitarios", "Sistema de seguimiento regulatorio"]',
   '["Actualización normativa para cosméticos en Colombia"]',
   'https://www.linkedin.com/', 'Abierto a proyectos y consultoría', 'published', NOW() - INTERVAL '5 days'),
  ('talent-julian-castro', 'Julián Castro', 'farmacovigilancia', 'Analista de farmacovigilancia',
   '["Gestión de casos", "Evaluación de causalidad", "ICSR", "Señales"]',
   '["Soporte a titular de registro en reportes de seguridad"]',
   '["Reporte de eventos adversos en biotecnológicos"]',
   'https://www.linkedin.com/', 'Disponible para iniciar', 'published', NOW() - INTERVAL '4 days'),
  ('talent-laura-martinez', 'Laura Martínez', 'clinico', 'Química farmacéutica — Farmacia hospitalaria',
   '["Seguimiento farmacoterapéutico", "Conciliación", "Unidosis"]',
   '["Programa de conciliación medicamentosa en hospital"]',
   '["Intervenciones farmacéuticas documentadas"]',
   'https://www.linkedin.com/', 'Disponible para iniciar', 'published', NOW() - INTERVAL '3 days')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 017_edvanta_opportunities_seed.sql
-- Siembra de OPORTUNIDADES reales y PERENNES (no empleos puntuales).
-- Programas recurrentes con fuente y enlace de aplicacion verificados.
-- deadline = NULL (perennes/anuales). Aditiva e idempotente.
-- ============================================================

INSERT INTO opportunities
  (slug, opportunity_type, title, organization_name, description, country_id, remote_type,
   application_url, source_name, source_url, deadline, status, verified_at, published_at)
VALUES
  ('colfuturo-credito-beca',
   'scholarship',
   'COLFUTURO — Crédito-Beca para posgrados en el exterior',
   'COLFUTURO',
   'Financiación de hasta USD 50.000 para maestrías y doctorados en el exterior, con condonación parcial. Convocatoria anual para profesionales colombianos.',
   (SELECT id FROM countries WHERE iso_code = 'CO'), 'unspecified',
   'https://www.colfuturo.org', 'COLFUTURO', 'https://www.colfuturo.org',
   NULL, 'published', NOW(), NOW()),

  ('icetex-becas-creditos',
   'scholarship',
   'ICETEX — Becas y créditos educativos',
   'ICETEX',
   'Entidad del Estado colombiano que ofrece créditos educativos y programas de becas nacionales e internacionales para estudios de pregrado y posgrado.',
   (SELECT id FROM countries WHERE iso_code = 'CO'), 'unspecified',
   'https://www.icetex.gov.co', 'ICETEX', 'https://www.icetex.gov.co',
   NULL, 'published', NOW(), NOW()),

  ('congreso-nacional-quimicos-farmaceuticos',
   'event',
   'Congreso Nacional de Químicos Farmacéuticos (CNQF)',
   'Colegio Nacional de Químicos Farmacéuticos de Colombia',
   'Evento gremial anual con conferencias, actualización profesional y networking del sector químico-farmacéutico en Colombia.',
   (SELECT id FROM countries WHERE iso_code = 'CO'), 'onsite',
   'https://www.cnqfcolombia.org/congreso/', 'CNQF Colombia', 'https://www.cnqfcolombia.org/congreso/',
   NULL, 'published', NOW(), NOW())

ON CONFLICT (slug) DO UPDATE SET
  opportunity_type = EXCLUDED.opportunity_type, title = EXCLUDED.title,
  organization_name = EXCLUDED.organization_name, description = EXCLUDED.description,
  country_id = EXCLUDED.country_id, remote_type = EXCLUDED.remote_type,
  application_url = EXCLUDED.application_url, source_name = EXCLUDED.source_name,
  source_url = EXCLUDED.source_url, deadline = EXCLUDED.deadline,
  status = EXCLUDED.status, verified_at = EXCLUDED.verified_at, published_at = EXCLUDED.published_at;

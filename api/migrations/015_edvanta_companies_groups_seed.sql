-- ============================================================
-- 015_edvanta_companies_groups_seed.sql
-- Siembra de EMPRESAS y GRUPOS (Conecta) reales y verificados en vivo.
-- Empresas: laboratorios reales (datos publicos). URLs verificadas o NULL.
-- Grupos: asociaciones/colegios profesionales reales. join_url verificado.
-- Aditiva e idempotente. Corre sola al desplegar la API.
-- ============================================================

-- ---------- EMPRESAS ----------
INSERT INTO companies
  (slug, name, website_url, description, country_id, size_range, verified, status, verified_at)
VALUES
  ('tecnoquimicas', 'Tecnoquímicas',
   'https://www.tqconfiable.com',
   'Compañía farmacéutica colombiana fundada en 1934, con sede en Cali. Fabrica medicamentos, productos de cuidado personal y del hogar, con operaciones en varios países de América Latina.',
   (SELECT id FROM countries WHERE iso_code = 'CO'), 'large', TRUE, 'published', NOW()),

  ('genfar', 'Genfar',
   'https://www.genfar.com',
   'Laboratorio de medicamentos genéricos fundado en 1967 en Bogotá, hoy con presencia regional en América Latina.',
   (SELECT id FROM countries WHERE iso_code = 'CO'), 'large', TRUE, 'published', NOW()),

  ('procaps', 'Procaps',
   'https://procapslaboratorios.com',
   'Compañía farmacéutica fundada en 1977 en Barranquilla, especializada en cápsulas blandas, nutracéuticos y medicamentos, con presencia en más de 50 países.',
   (SELECT id FROM countries WHERE iso_code = 'CO'), 'large', TRUE, 'published', NOW()),

  ('la-sante', 'Laboratorios La Santé',
   NULL,
   'Laboratorio farmacéutico colombiano del grupo Carval, dedicado a la fabricación y comercialización de medicamentos.',
   (SELECT id FROM countries WHERE iso_code = 'CO'), 'medium', TRUE, 'published', NOW()),

  ('bayer', 'Bayer',
   'https://www.bayer.com',
   'Compañía multinacional de ciencias de la vida (farma y salud) con operaciones en Colombia y América Latina.',
   NULL, 'enterprise', TRUE, 'published', NOW()),

  ('sanofi', 'Sanofi',
   'https://www.sanofi.com',
   'Compañía farmacéutica global con presencia en Colombia y la región, activa en medicamentos, vacunas y salud del consumidor.',
   NULL, 'enterprise', TRUE, 'published', NOW())

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, website_url = EXCLUDED.website_url, description = EXCLUDED.description,
  country_id = EXCLUDED.country_id, size_range = EXCLUDED.size_range, verified = EXCLUDED.verified,
  status = EXCLUDED.status, verified_at = EXCLUDED.verified_at;

-- ---------- GRUPOS (Conecta) ----------
INSERT INTO professional_groups
  (slug, name, description, group_type, career_id, country_id, remote, join_url, status, verified_at)
VALUES
  ('cnqf-colombia', 'Colegio Nacional de Químicos Farmacéuticos de Colombia',
   'Gremio profesional de los químicos farmacéuticos de Colombia, creado en 1937 y asesor del Gobierno en temas de farmacia (Ley 212 de 1995).',
   'career', NULL, (SELECT id FROM countries WHERE iso_code = 'CO'), TRUE,
   'https://www.cnqfcolombia.org', 'published', NOW()),

  ('aceqf', 'ACEQF — Asociación Colombiana de Estudiantes de Química Farmacéutica',
   'Organización sin fines de lucro de estudiantes de química farmacéutica en Colombia; espacio de formación, eventos y networking estudiantil.',
   'study', NULL, (SELECT id FROM countries WHERE iso_code = 'CO'), TRUE,
   'https://co.linkedin.com/company/aceqf', 'published', NOW()),

  ('ispe', 'ISPE — International Society for Pharmaceutical Engineering',
   'Asociación global sin fines de lucro (más de 25.000 miembros en 120+ países) enfocada en el avance científico, técnico y regulatorio del ciclo de vida farmacéutico.',
   'career', (SELECT id FROM careers WHERE slug = 'produccion-farmaceutica'), NULL, TRUE,
   'https://ispe.org', 'published', NOW()),

  ('raps', 'RAPS — Regulatory Affairs Professionals Society',
   'Comunidad internacional de profesionales de asuntos regulatorios y calidad; ofrece formación, la certificación RAC y eventos del sector.',
   'career', (SELECT id FROM careers WHERE slug = 'asuntos-regulatorios'), NULL, TRUE,
   'https://www.raps.org', 'published', NOW()),

  ('pda', 'PDA — Parenteral Drug Association',
   'Asociación internacional dedicada a la ciencia y regulación de productos parenterales y estériles; formación técnica y estándares.',
   'career', (SELECT id FROM careers WHERE slug = 'produccion-farmaceutica'), NULL, TRUE,
   'https://www.pda.org', 'published', NOW())

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, group_type = EXCLUDED.group_type,
  career_id = EXCLUDED.career_id, country_id = EXCLUDED.country_id, remote = EXCLUDED.remote,
  join_url = EXCLUDED.join_url, status = EXCLUDED.status, verified_at = EXCLUDED.verified_at;

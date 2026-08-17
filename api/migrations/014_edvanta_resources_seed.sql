-- ============================================================
-- 014_edvanta_resources_seed.sql
-- Siembra de RECURSOS PROFESIONALES reales y verificados en vivo.
-- Fuentes oficiales (ICH, EMA, FDA, WHO, INVIMA, UMC). URLs verificadas.
-- No se fabrica contenido: cada recurso apunta a su fuente oficial.
-- Aditiva e idempotente (ON CONFLICT (slug) DO UPDATE).
-- ============================================================

INSERT INTO professional_resources
  (slug, title, resource_type, excerpt, source_url, author_name, country_id, status, published_at, verified_at)
VALUES
  ('ich-guias-calidad',
   'ICH — Guías de calidad (serie Q)',
   'regulation',
   'Serie Q del ICH (Q7–Q14): BPM de ingredientes activos, gestión de riesgos de calidad (Q9), sistema de calidad farmacéutico (Q10) y validación de métodos (Q2/Q14). Referencia base de la industria.',
   'https://www.ich.org/page/quality-guidelines',
   'ICH — International Council for Harmonisation',
   NULL, 'published', NOW(), NOW()),

  ('ema-guias-cientificas',
   'EMA — Guías científicas para medicamentos humanos',
   'regulation',
   'Compilación oficial de la Agencia Europea de Medicamentos: guías de calidad, eficacia clínica, seguridad, no clínicas y multidisciplinarias para el desarrollo y registro de medicamentos.',
   'https://www.ema.europa.eu/en/human-regulatory-overview/research-development/scientific-guidelines',
   'European Medicines Agency (EMA)',
   NULL, 'published', NOW(), NOW()),

  ('fda-guidances-drugs',
   'FDA — Guías para medicamentos (CDER)',
   'regulation',
   'Documentos de orientación del Centro de Evaluación e Investigación de Medicamentos (CDER) de la FDA sobre calidad, desarrollo, fabricación y regulación de medicamentos.',
   'https://www.fda.gov/drugs/guidance-compliance-regulatory-information/guidances-drugs',
   'U.S. Food and Drug Administration (FDA)',
   NULL, 'published', NOW(), NOW()),

  ('fda-buscador-guidance',
   'FDA — Buscador de documentos de orientación',
   'regulation',
   'Base de datos oficial para buscar y filtrar guías de la FDA por producto, tema, unidad organizativa y estado (borrador o final).',
   'https://www.fda.gov/regulatory-information/search-fda-guidance-documents',
   'U.S. Food and Drug Administration (FDA)',
   NULL, 'published', NOW(), NOW()),

  ('who-buenas-practicas-manufactura',
   'WHO — Buenas Prácticas de Manufactura (GMP)',
   'guide',
   'Explicación oficial de la OMS sobre las Buenas Prácticas de Manufactura: sistema para producir y controlar productos de forma consistente según estándares de calidad.',
   'https://www.who.int/news-room/questions-and-answers/item/medicines-good-manufacturing-processes',
   'World Health Organization (WHO)',
   NULL, 'published', NOW(), NOW()),

  ('who-gmp-compendio',
   'WHO — Compendio de BPM y guías relacionadas (10.ª ed.)',
   'regulation',
   'Compendio de la OMS con las guías de aseguramiento de calidad, buenas prácticas de manufactura e inspección de productos farmacéuticos, vacunas y biológicos.',
   'https://www.who.int/publications/i/item/9789240086081',
   'World Health Organization (WHO)',
   NULL, 'published', NOW(), NOW()),

  ('invima-normatividad-medicamentos',
   'INVIMA — Normatividad de medicamentos (Colombia)',
   'regulation',
   'Marco normativo colombiano para medicamentos y productos biológicos: decretos y resoluciones de BPM, registro sanitario y vigilancia (INVIMA).',
   'https://www.invima.gov.co/productos-vigilados/medicamentos-y-productos-biologicos/normatividad-medicamentos',
   'INVIMA',
   (SELECT id FROM countries WHERE iso_code = 'CO'),
   'published', NOW(), NOW()),

  ('invima-guia-bpm-medicamentos',
   'INVIMA — Guía de Buenas Prácticas de Manufactura de Medicamentos',
   'guide',
   'Guía técnica oficial del INVIMA con los lineamientos de BPM para la certificación de laboratorios y establecimientos de producción de medicamentos en Colombia.',
   'https://www.invima.gov.co/sites/default/files/medicamentos-y-productos-biologicos/tecnico-medicamentos/listas-y-guias/BPX/Gu%C3%ADa%20BPM%20Medicamentos.pdf',
   'INVIMA',
   (SELECT id FROM countries WHERE iso_code = 'CO'),
   'published', NOW(), NOW()),

  ('uppsala-monitoring-centre',
   'Uppsala Monitoring Centre — Farmacovigilancia (WHO PIDM)',
   'research',
   'Centro que opera el Programa OMS de Monitoreo Internacional de Medicamentos y VigiBase, la base global de reportes de eventos adversos. Referencia mundial en farmacovigilancia.',
   'https://who-umc.org',
   'Uppsala Monitoring Centre (UMC)',
   NULL, 'published', NOW(), NOW())

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  resource_type = EXCLUDED.resource_type,
  excerpt = EXCLUDED.excerpt,
  source_url = EXCLUDED.source_url,
  author_name = EXCLUDED.author_name,
  country_id = EXCLUDED.country_id,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at,
  verified_at = EXCLUDED.verified_at;

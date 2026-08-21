-- ============================================================
-- 028_empleo_vacantes_seed.sql
-- Vacantes de químico farmacéutico verificadas (ago 2026),
-- publicadas directamente en el banco comunitario de empleo.
-- Fuentes: Elempleo, Jooble, Magneto365, Trovit/Mipleo.
-- ============================================================

INSERT INTO community_jobs (slug, cargo, empresa, ciudad, modalidad, requisitos, contacto, fuente, status, published_at) VALUES
  ('ibupli-quimico-farmaceutico-regulatorio', 'Químico farmacéutico - asuntos regulatorios y producción', 'IBUPLI PHARMA S.A.S.', 'Barranquilla', 'onsite',
   'Asuntos regulatorios, trámites INVIMA, registros sanitarios, renovaciones, CVL y CPP, BPM y documentación técnica. Sin años de experiencia exigidos explícitamente. Salario: $2.500.000 a $3.000.000.',
   'https://www.elempleo.com/co/ofertas-trabajo/quimico-farmaceutico-asuntos-regulatorios-y-produccion-1886754499', 'Elempleo (confirmado también en Jooble)', 'published', TIMESTAMPTZ '2026-08-20 12:00:00-05:00'),
  ('estrategica-mm-farmacovigilancia', 'Químico farmacéutico hospitalario - farmacovigilancia y atención farmacéutica', 'ESTRATEGICA MM', 'Colombia (ciudad por confirmar)', 'onsite',
   'Farmacovigilancia, tecnovigilancia, atención farmacéutica, PROA, reporte de eventos adversos, manejo de kit de urgencias y visitas de IVC. Salario: $2.730.000. Nivel y experiencia: por verificar en la publicación.',
   'https://co.jooble.org/desc/-2307805742444191422', 'Jooble', 'published', TIMESTAMPTZ '2026-08-18 12:00:00-05:00'),
  ('confidencial-asistencial-1-ano', 'Químico farmacéutico - área asistencial', 'Empresa confidencial', 'Barranquilla', 'onsite',
   'Área asistencial. Experiencia mínima de 1 año. Salario bruto anual publicado: $35 millones.',
   'https://empleo.trovit.com.co/empleo-qu%C3%ADmico-farmaceutico-en-barranquilla,-atl%C3%A1ntico', 'Trovit / Mipleo', 'published', TIMESTAMPTZ '2026-08-18 12:00:00-05:00'),
  ('gestion-ambiental-coordinador-calidad-laboratorio', 'Coordinador de calidad y laboratorio fisicoquímico', 'GESTION Y SERVICIOS AMBIENTALES S.A.S.', 'Medellín, Barranquilla, Bogotá, Cartagena, Bucaramanga y área metropolitana', 'onsite',
   'NTC-ISO/IEC 17025, ISO 9001, ISO 14001, sistemas integrados de gestión, auditorías internas, matriz legal y gestión documental. Experiencia mínima de 2 años. Salario a convenir.',
   'https://www.magneto365.com/co/empleos/quimico-puro-quimico-farmaceutico-1024305', 'Magneto365', 'published', TIMESTAMPTZ '2026-08-14 12:00:00-05:00'),
  ('confidencial-asistencial-6-meses', 'Químico farmacéutico - área asistencial hospitalaria', 'Empresa confidencial', 'Barranquilla', 'onsite',
   'Abierta a recién egresados: experiencia mínima de 6 meses en el cargo, documentación al día. Salario bruto anual publicado: $36 millones.',
   'https://empleo.trovit.com.co/empleo-qu%C3%ADmico-farmaceutico-en-barranquilla,-atl%C3%A1ntico', 'Trovit / Mipleo', 'published', TIMESTAMPTZ '2026-08-15 12:00:00-05:00'),
  ('confidencial-control-calidad-quimico', 'Químico farmacéutico - control de calidad (industria química)', 'Empresa confidencial', 'Barranquilla', 'onsite',
   'Control de calidad en sector químico. Experiencia mínima de 2 años. Salario bruto anual publicado: $32 millones.',
   'https://empleo.trovit.com.co/empleo-qu%C3%ADmico-farmaceutico-en-barranquilla,-atl%C3%A1ntico', 'Trovit / Mipleo', 'published', TIMESTAMPTZ '2026-08-15 12:00:00-05:00')
ON CONFLICT (slug) DO NOTHING;

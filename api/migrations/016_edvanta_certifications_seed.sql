-- ============================================================
-- 016_edvanta_certifications_seed.sql
-- Siembra de CERTIFICACIONES gratuitas reales y verificadas en vivo.
-- Todas de proveedores oficiales; official_url verificada. Sin fabricar.
-- Aditiva e idempotente. Corre sola al desplegar la API.
-- ============================================================

INSERT INTO certifications
  (slug, name, provider_name, summary, official_url, level, language, country_id,
   editorial_note, status, verified_at)
VALUES
  ('openwho-cursos-gratuitos',
   'OpenWHO — Cursos gratuitos de la OMS',
   'World Health Organization (WHO)',
   'Plataforma de aprendizaje en línea de la OMS con cursos gratuitos sobre salud pública, seguridad del paciente, emergencias y epidemias, con certificado de participación.',
   'https://openwho.org', 'foundation', 'Multiidioma', NULL,
   'Gratuito', 'published', NOW()),

  ('google-data-analytics',
   'Certificado profesional de Google Data Analytics',
   'Google (Coursera)',
   'Programa de 8 cursos que cubre limpieza, análisis y visualización de datos con hojas de cálculo, SQL, R y Tableau. Útil para perfiles de datos en la industria farmacéutica.',
   'https://www.coursera.org/professional-certificates/google-data-analytics', 'foundation',
   'Inglés / Español (subtítulos)', NULL,
   'Inscripción gratuita (auditoría); certificado con suscripción', 'published', NOW()),

  ('google-advanced-data-analytics',
   'Certificado Google Advanced Data Analytics',
   'Google (Coursera)',
   'Certificado avanzado en análisis de datos: estadística, Python, modelos de regresión y aprendizaje automático. Complementa perfiles de datos e IA aplicada a farma.',
   'https://www.coursera.org/professional-certificates/google-advanced-data-analytics', 'intermediate',
   'Inglés / Español (subtítulos)', NULL,
   'Inscripción gratuita (auditoría); certificado con suscripción', 'published', NOW()),

  ('nih-gcp-buenas-practicas-clinicas',
   'NIH — Capacitación en Buenas Prácticas Clínicas (GCP)',
   'National Institutes of Health (NIH)',
   'Formación gratuita en Buenas Prácticas Clínicas: principios éticos y cumplimiento regulatorio para la investigación en ensayos clínicos.',
   'https://grants.nih.gov/policy-and-compliance/policy-topics/clinical-trials/good-clinical-training',
   'foundation', 'Inglés', NULL,
   'Gratuito', 'published', NOW()),

  ('umc-farmacovigilancia',
   'Uppsala Monitoring Centre — Cursos de farmacovigilancia',
   'Uppsala Monitoring Centre (UMC)',
   'Cursos gratuitos en línea de farmacovigilancia: conceptos básicos, detección de señales, evaluación de causalidad y razonamiento estadístico.',
   'https://who-umc.org', 'foundation', 'Inglés', NULL,
   'Gratuito', 'published', NOW())

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name, provider_name = EXCLUDED.provider_name, summary = EXCLUDED.summary,
  official_url = EXCLUDED.official_url, level = EXCLUDED.level, language = EXCLUDED.language,
  country_id = EXCLUDED.country_id, editorial_note = EXCLUDED.editorial_note,
  status = EXCLUDED.status, verified_at = EXCLUDED.verified_at;

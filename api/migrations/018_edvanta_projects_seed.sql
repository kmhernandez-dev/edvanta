-- ============================================================
-- 018_edvanta_projects_seed.sql
-- Siembra de PROYECTOS EDUCATIVOS (ejercicios de practica).
-- NO son proyectos reales de empresas: son retos de aprendizaje para
-- construir portafolio, marcados con educational_disclosure = TRUE.
-- Aditiva e idempotente. Corre sola al desplegar la API.
-- ============================================================

INSERT INTO projects
  (slug, title, description, project_type, difficulty, remote, educational_disclosure,
   participants_limit, application_url, status, verified_at)
VALUES
  ('practica-protocolo-validacion-limpieza',
   'Diseña un protocolo de validación de limpieza',
   'Ejercicio educativo: redacta un protocolo de validación de limpieza para un equipo de manufactura (criterios de aceptación, muestreo, límites y análisis de riesgo). Construye evidencia para tu portafolio de aseguramiento de calidad y validaciones.',
   'practice', 'intermediate', TRUE, TRUE, NULL, NULL, 'active', NOW()),

  ('practica-tablero-indicadores-calidad-powerbi',
   'Construye un tablero de indicadores de calidad en Power BI',
   'Ejercicio educativo: con datos ficticios de desviaciones, CAPA y reclamos, diseña un tablero de indicadores (KPIs) de calidad en Power BI o similar. Ideal para perfiles de datos aplicados a la industria farmacéutica.',
   'practice', 'foundation', TRUE, TRUE, NULL, NULL, 'active', NOW()),

  ('practica-investigacion-desviacion-capa',
   'Investiga una desviación y propone su CAPA',
   'Ejercicio educativo: a partir de un caso simulado, aplica análisis de causa raíz (p. ej. 5 porqués, Ishikawa) y documenta la investigación de la desviación con sus acciones correctivas y preventivas (CAPA).',
   'practice', 'foundation', TRUE, TRUE, NULL, NULL, 'active', NOW()),

  ('practica-senal-farmacovigilancia-datos-abiertos',
   'Analiza una señal de farmacovigilancia con datos abiertos',
   'Ejercicio educativo: usa bases públicas de eventos adversos para explorar una posible señal de seguridad, evalúa causalidad de forma estructurada y comunica hallazgos y limitaciones de manera responsable.',
   'practice', 'intermediate', TRUE, TRUE, NULL, NULL, 'active', NOW()),

  ('practica-mapa-regulatorio-invima-fda',
   'Mapa regulatorio: compara requisitos INVIMA vs FDA',
   'Ejercicio educativo: elige un tipo de producto y compara los requisitos de registro/aprobación entre INVIMA (Colombia) y la FDA (EE. UU.), documentando diferencias clave en un cuadro comparativo.',
   'practice', 'intermediate', TRUE, TRUE, NULL, NULL, 'active', NOW())

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, project_type = EXCLUDED.project_type,
  difficulty = EXCLUDED.difficulty, remote = EXCLUDED.remote,
  educational_disclosure = EXCLUDED.educational_disclosure, participants_limit = EXCLUDED.participants_limit,
  application_url = EXCLUDED.application_url, status = EXCLUDED.status, verified_at = EXCLUDED.verified_at;

-- ============================================================
-- 012_edvanta_learning_graph.sql
-- Catalogo, afiliacion y rutas profesionales reutilizables.
-- La migracion es aditiva y no reemplaza enlaces ya guardados.
-- ============================================================

CREATE TABLE IF NOT EXISTS affiliate_links (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id          BIGINT NOT NULL UNIQUE REFERENCES courses(id) ON DELETE CASCADE,
  provider           TEXT NOT NULL,
  original_url       TEXT,
  affiliate_url      TEXT NOT NULL,
  campaign           TEXT,
  sub_id             TEXT,
  source_path        TEXT,
  source_type        TEXT NOT NULL DEFAULT 'catalog' CHECK (source_type IN ('catalog', 'editorial', 'import', 'admin')),
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'broken', 'archived')),
  first_seen_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_verified_at   TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_course_recommendations (
  career_id      UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  course_id      BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  priority       SMALLINT NOT NULL DEFAULT 50 CHECK (priority BETWEEN 0 AND 100),
  reason         TEXT,
  status         TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (career_id, course_id)
);

ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS outcomes TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS estimated_duration TEXT;
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS level TEXT NOT NULL DEFAULT 'foundation';
ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS featured BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE learning_path_steps ADD COLUMN IF NOT EXISTS skill_id UUID REFERENCES skills(id) ON DELETE SET NULL;
ALTER TABLE learning_path_steps ADD COLUMN IF NOT EXISTS course_ids BIGINT[] NOT NULL DEFAULT '{}';
ALTER TABLE learning_path_steps ADD COLUMN IF NOT EXISTS resource_ids UUID[] NOT NULL DEFAULT '{}';
ALTER TABLE learning_path_steps ADD COLUMN IF NOT EXISTS project_id UUID;
ALTER TABLE learning_path_steps ADD COLUMN IF NOT EXISTS step_type TEXT NOT NULL DEFAULT 'learning'
  CHECK (step_type IN ('orientation', 'learning', 'practice', 'portfolio', 'career', 'opportunity'));

CREATE INDEX IF NOT EXISTS idx_affiliate_links_provider_status ON affiliate_links (provider, status);
CREATE INDEX IF NOT EXISTS idx_career_course_priority ON career_course_recommendations (career_id, priority DESC);
CREATE INDEX IF NOT EXISTS idx_learning_path_steps_skill ON learning_path_steps (skill_id);

DROP TRIGGER IF EXISTS trg_affiliate_links_updated_at ON affiliate_links;
CREATE TRIGGER trg_affiliate_links_updated_at BEFORE UPDATE ON affiliate_links
  FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_career_course_updated_at ON career_course_recommendations;
CREATE TRIGGER trg_career_course_updated_at BEFORE UPDATE ON career_course_recommendations
  FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();

INSERT INTO skills (slug, name, skill_type, description)
VALUES
  ('industria-farmaceutica', 'Industria farmaceutica', 'business', 'Contexto del ciclo de vida, actores y operaciones de la industria farmaceutica.'),
  ('sistemas-gestion-calidad', 'Sistemas de gestion de calidad', 'technical', 'Diseno, mantenimiento y mejora de un sistema de gestion de calidad.'),
  ('change-control', 'Control de cambios', 'technical', 'Evaluacion, aprobacion, implementacion y cierre trazable de cambios.'),
  ('oos-oot', 'OOS y OOT', 'technical', 'Gestion e investigacion de resultados fuera de especificacion o tendencia.'),
  ('supplier-quality', 'Calidad de proveedores', 'technical', 'Calificacion, seguimiento y gestion de riesgos de proveedores.'),
  ('mejora-continua', 'Mejora continua', 'business', 'Identificacion y sostenimiento de mejoras medibles en procesos.'),
  ('lean', 'Lean', 'business', 'Reduccion de desperdicios y mejora del flujo de valor.'),
  ('six-sigma', 'Six Sigma', 'business', 'Reduccion de variabilidad y resolucion de problemas basada en datos.'),
  ('power-bi', 'Power BI', 'digital', 'Modelado, visualizacion y comunicacion de datos con Power BI.'),
  ('excel', 'Excel', 'digital', 'Analisis, organizacion y presentacion de datos con hojas de calculo.'),
  ('farmacovigilancia', 'Farmacovigilancia', 'technical', 'Vigilancia y gestion del balance beneficio-riesgo de medicamentos.'),
  ('produccion-farmaceutica', 'Produccion farmaceutica', 'technical', 'Ejecucion controlada de operaciones de fabricacion farmaceutica.'),
  ('investigacion-desarrollo', 'Investigacion y desarrollo', 'technical', 'Desarrollo experimental de conocimiento, formulaciones y productos.'),
  ('medical-affairs', 'Medical Affairs', 'business', 'Intercambio cientifico y estrategia medica basada en evidencia.'),
  ('asuntos-regulatorios', 'Asuntos regulatorios', 'technical', 'Gestion del cumplimiento regulatorio durante el ciclo de vida del producto.'),
  ('seguridad-salud-trabajo', 'Seguridad y salud en el trabajo', 'technical', 'Identificacion y control de riesgos para entornos de trabajo seguros.'),
  ('gestion-ambiental', 'Gestion ambiental', 'technical', 'Gestion de impactos, recursos, residuos y cumplimiento ambiental.'),
  ('cv-profesional', 'CV profesional', 'human', 'Comunicacion clara y verificable de experiencia, habilidades y logros.'),
  ('entrevista-profesional', 'Entrevista profesional', 'human', 'Preparacion y comunicacion de evidencia durante procesos de seleccion.'),
  ('busqueda-empleo', 'Busqueda de oportunidades', 'business', 'Identificacion y evaluacion responsable de oportunidades profesionales.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO career_skills (career_id, skill_id, importance, required_level, is_core, sort_order)
SELECT c.id, s.id, v.importance, v.required_level, v.is_core, v.sort_order
FROM (VALUES
  ('aseguramiento-calidad','sistemas-gestion-calidad',5,'working',true,15),
  ('aseguramiento-calidad','change-control',5,'working',true,35),
  ('aseguramiento-calidad','integridad-datos',4,'working',true,45),
  ('aseguramiento-calidad','power-bi',2,'foundation',false,80),
  ('control-calidad','oos-oot',5,'working',true,25),
  ('control-calidad','power-bi',2,'foundation',false,80),
  ('validaciones','sistemas-gestion-calidad',4,'foundation',true,15),
  ('validaciones','change-control',4,'working',true,35),
  ('asuntos-regulatorios','asuntos-regulatorios',5,'working',true,5),
  ('farmacovigilancia','farmacovigilancia',5,'working',true,5),
  ('produccion-farmaceutica','produccion-farmaceutica',5,'working',true,5),
  ('produccion-farmaceutica','lean',4,'working',true,25),
  ('produccion-farmaceutica','mejora-continua',4,'working',true,35),
  ('investigacion-desarrollo','investigacion-desarrollo',5,'working',true,5),
  ('medical-affairs','medical-affairs',5,'working',true,5),
  ('datos-farma','power-bi',5,'working',true,15),
  ('datos-farma','excel',4,'working',true,25),
  ('inteligencia-artificial-farma','power-bi',2,'foundation',false,70)
) AS v(career_slug, skill_slug, importance, required_level, is_core, sort_order)
JOIN careers c ON c.slug = v.career_slug
JOIN skills s ON s.slug = v.skill_slug
ON CONFLICT (career_id, skill_id) DO UPDATE SET
  importance = EXCLUDED.importance,
  required_level = EXCLUDED.required_level,
  is_core = EXCLUDED.is_core,
  sort_order = EXCLUDED.sort_order;

INSERT INTO learning_paths (
  career_id, slug, name, summary, audience, status, icon, outcomes,
  estimated_duration, level, featured, seo_title, seo_description
)
SELECT c.id, v.slug, v.name, v.summary, v.audience, 'published', v.icon,
       v.outcomes, v.duration, v.level, v.featured, v.seo_title, v.seo_description
FROM (VALUES
  ('aseguramiento-calidad','quality-assurance-desde-cero','Quality Assurance desde cero','Comprende la industria, domina los fundamentos de calidad y prepara evidencia profesional para iniciar en QA.','Estudiantes, recien egresados y profesionales que quieren entrar o trasladarse a aseguramiento de calidad.','shield',ARRAY['Comprender el sistema de calidad','Investigar desviaciones y CAPA','Evaluar riesgos y cambios','Preparar una postulacion a QA'],'12 a 16 semanas','foundation',true,'Ruta de Quality Assurance desde cero | Edvanta','Ruta profesional para desarrollar competencias iniciales en Quality Assurance farmaceutico.'),
  ('control-calidad','control-de-calidad','Control de Calidad','Construye bases analiticas, documentales y de integridad de datos para trabajar en laboratorios de control.','Personas interesadas en analisis, laboratorio y decisiones basadas en especificaciones.','flask',ARRAY['Aplicar buenas practicas de laboratorio','Interpretar resultados','Gestionar OOS y OOT','Documentar con integridad de datos'],'10 a 14 semanas','foundation',true,'Ruta de Control de Calidad farmaceutico | Edvanta','Ruta para desarrollar competencias de laboratorio y control de calidad farmaceutico.'),
  ('validaciones','validaciones-farmaceuticas','Validaciones farmaceuticas','Aprende a planear, ejecutar y documentar evidencia de que procesos, metodos y sistemas cumplen su proposito.','Profesionales de calidad, laboratorio, ingenieria o produccion que quieren avanzar hacia validaciones.','checkCircle',ARRAY['Preparar protocolos','Definir criterios de aceptacion','Gestionar desviaciones','Mantener el estado validado'],'12 a 16 semanas','working',true,'Ruta de Validaciones farmaceuticas | Edvanta','Ruta profesional de validacion de procesos, metodos y sistemas farmaceuticos.'),
  ('asuntos-regulatorios','regulatory-affairs','Regulatory Affairs','Conecta requisitos, evidencia y documentacion para gestionar productos durante su ciclo de vida regulatorio.','Profesionales cientificos que buscan una entrada estructurada a asuntos regulatorios.','fileText',ARRAY['Interpretar requisitos','Organizar expedientes','Evaluar cambios','Comunicar evidencia tecnica'],'10 a 14 semanas','foundation',true,'Ruta de Regulatory Affairs | Edvanta','Ruta para iniciar una carrera en asuntos regulatorios farmaceuticos.'),
  ('farmacovigilancia','farmacovigilancia','Farmacovigilancia','Desarrolla criterio para gestionar casos, evaluar causalidad y comunicar informacion de seguridad.','Quimicos farmaceuticos y profesionales de salud interesados en Drug Safety.','activity',ARRAY['Gestionar casos de seguridad','Evaluar causalidad','Reconocer senales','Proteger datos sensibles'],'10 a 14 semanas','foundation',true,'Ruta de Farmacovigilancia | Edvanta','Ruta profesional para desarrollar fundamentos de farmacovigilancia y seguridad de medicamentos.'),
  ('produccion-farmaceutica','produccion-farmaceutica','Produccion farmaceutica','Integra BPM, tecnologia farmaceutica, liderazgo operativo y mejora continua para entornos de fabricacion.','Personas interesadas en plantas, operaciones y liderazgo de equipos regulados.','factory',ARRAY['Operar con BPM','Controlar procesos','Gestionar desviaciones','Mejorar flujo y productividad'],'10 a 14 semanas','foundation',true,'Ruta de Produccion farmaceutica | Edvanta','Ruta para desarrollar competencias iniciales de produccion y operaciones farmaceuticas.'),
  ('investigacion-desarrollo','investigacion-y-desarrollo','Investigacion y Desarrollo','Convierte preguntas cientificas en experimentos, formulaciones y conocimiento transferible.','Profesionales curiosos que buscan trabajar en formulacion, desarrollo o innovacion.','lightbulb',ARRAY['Disenar experimentos','Desarrollar formulaciones','Evaluar estabilidad','Documentar resultados'],'12 a 18 semanas','working',false,'Ruta de Investigacion y Desarrollo farmaceutico | Edvanta','Ruta profesional para fortalecer formulacion, experimentacion y desarrollo farmaceutico.'),
  ('industria-cosmetica','formulacion-cosmetica','Formulacion cosmetica','Combina formulacion, estabilidad, microbiologia, calidad y regulacion para desarrollar productos cosmeticos.','Profesionales interesados en ciencia cosmetica y desarrollo de producto.','sparkles',ARRAY['Formular productos','Evaluar estabilidad','Gestionar calidad','Comprender requisitos cosmeticos'],'12 a 18 semanas','working',false,'Ruta de Formulacion cosmetica | Edvanta','Ruta para construir competencias en formulacion y desarrollo de productos cosmeticos.'),
  ('medical-affairs','medical-affairs','Medical Affairs','Fortalece lectura critica, comunicacion cientifica y gestion de proyectos para intercambio medico responsable.','Profesionales con base cientifica interesados en asuntos medicos y evidencia.','bookOpen',ARRAY['Evaluar evidencia','Comunicar ciencia','Responder consultas','Gestionar proyectos medicos'],'10 a 14 semanas','working',false,'Ruta de Medical Affairs | Edvanta','Ruta profesional para desarrollar habilidades iniciales de Medical Affairs.'),
  ('datos-farma','data-y-pharma','Data & Pharma','Aplica Excel, Power BI, SQL y pensamiento critico a problemas del sector farmaceutico.','Profesionales cientificos o de procesos que quieren fortalecer su perfil digital.','chart',ARRAY['Preparar datos','Crear indicadores','Visualizar tendencias','Comunicar decisiones'],'10 a 16 semanas','foundation',true,'Ruta de Data & Pharma | Edvanta','Ruta para combinar analitica de datos y conocimiento de la industria farmaceutica.'),
  ('inteligencia-artificial-farma','ia-para-profesionales-farmaceuticos','IA para profesionales farmaceuticos','Aprende a identificar, evaluar y usar inteligencia artificial con datos confiables y supervision humana.','Profesionales farmaceuticos que quieren incorporar IA de manera responsable.','brain',ARRAY['Evaluar casos de uso','Preparar datos confiables','Usar IA con supervision','Documentar riesgos y limites'],'10 a 14 semanas','foundation',true,'Ruta de IA para profesionales farmaceuticos | Edvanta','Ruta responsable para aplicar inteligencia artificial en contextos farmaceuticos.')
) AS v(career_slug, slug, name, summary, audience, icon, outcomes, duration, level, featured, seo_title, seo_description)
JOIN careers c ON c.slug = v.career_slug
ON CONFLICT (slug) DO UPDATE SET
  career_id = EXCLUDED.career_id,
  name = EXCLUDED.name,
  summary = EXCLUDED.summary,
  audience = EXCLUDED.audience,
  status = EXCLUDED.status,
  icon = EXCLUDED.icon,
  outcomes = EXCLUDED.outcomes,
  estimated_duration = EXCLUDED.estimated_duration,
  level = EXCLUDED.level,
  featured = EXCLUDED.featured,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;

-- La ruta QA demuestra que el modelo soporta aprendizaje, practica,
-- empleabilidad y oportunidades sin fingir modulos aun no disponibles.
INSERT INTO learning_path_steps (
  learning_path_id, skill_id, title, description, step_order, step_type, is_optional
)
SELECT lp.id, s.id, v.title, v.description, v.step_order, v.step_type, v.is_optional
FROM (VALUES
  (1,'Industria farmaceutica','Comprende el ciclo de vida del medicamento, los actores y las areas que colaboran con QA.','industria-farmaceutica','orientation',false),
  (2,'Buenas Practicas de Manufactura','Estudia los principios que sostienen operaciones controladas, consistentes y documentadas.','bpm-gmp','learning',false),
  (3,'Quality Management Systems','Relaciona procesos, responsabilidades, indicadores y revision del sistema de calidad.','sistemas-gestion-calidad','learning',false),
  (4,'Documentacion','Practica la escritura, revision y control trazable de procedimientos y registros.','gestion-documental','learning',false),
  (5,'Desviaciones','Aprende a describir eventos, reunir evidencia y delimitar el problema antes de investigar.','capa-desviaciones','learning',false),
  (6,'CAPA','Conecta causa raiz, acciones, responsables, plazos y verificacion de efectividad.','capa-desviaciones','practice',false),
  (7,'Control de cambios','Evalua impacto y riesgo antes de aprobar, implementar y cerrar un cambio.','change-control','learning',false),
  (8,'Quality Risk Management','Prioriza decisiones y controles mediante una evaluacion estructurada de riesgos.','gestion-riesgos-calidad','practice',false),
  (9,'Auditorias','Prepara evidencias, entrevistas, hallazgos y seguimiento de acciones.','auditorias','practice',false),
  (10,'Validaciones','Comprende protocolos, criterios de aceptacion, ejecucion y mantenimiento del estado validado.','validacion-procesos','learning',false),
  (11,'Data Integrity','Aplica principios de integridad a datos, registros y sistemas durante todo su ciclo de vida.','integridad-datos','learning',false),
  (12,'Excel y Power BI','Construye indicadores sencillos para comunicar tendencias y apoyar decisiones de calidad.','power-bi','practice',true),
  (13,'CV orientado a QA','Convierte proyectos, practicas y resultados verificables en evidencia profesional relevante.','cv-profesional','portfolio',false),
  (14,'Entrevista QA','Prepara ejemplos concretos sobre documentacion, riesgo, desviaciones y trabajo en equipo.','entrevista-profesional','career',false),
  (15,'Vacantes','Identifica requisitos repetidos y prioriza oportunidades coherentes con tu nivel actual.','busqueda-empleo','opportunity',false)
) AS v(step_order, title, description, skill_slug, step_type, is_optional)
JOIN learning_paths lp ON lp.slug = 'quality-assurance-desde-cero'
LEFT JOIN skills s ON s.slug = v.skill_slug
ON CONFLICT (learning_path_id, step_order) DO UPDATE SET
  skill_id = EXCLUDED.skill_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  step_type = EXCLUDED.step_type,
  is_optional = EXCLUDED.is_optional;

-- Los demas caminos reciben una secuencia inicial reutilizable. El contenido
-- se puede enriquecer desde administracion sin modificar el frontend.
INSERT INTO learning_path_steps (
  learning_path_id, skill_id, title, description, step_order, step_type, is_optional
)
SELECT lp.id, s.id, v.title, v.description, v.step_order, v.step_type, false
FROM (VALUES
  ('control-de-calidad',1,'Fundamentos de control de calidad','Comprende especificaciones, muestreo, ensayos y decisiones de liberacion.','quimica-analitica','orientation'),
  ('control-de-calidad',2,'Buenas practicas e integridad de datos','Documenta resultados completos, atribuibles y trazables.','integridad-datos','learning'),
  ('control-de-calidad',3,'OOS y OOT','Investiga resultados atipicos sin invalidar evidencia prematuramente.','oos-oot','practice'),
  ('control-de-calidad',4,'Proyecto de indicadores de laboratorio','Construye un tablero simple de tiempos, resultados y tendencias.','power-bi','portfolio'),
  ('validaciones-farmaceuticas',1,'Ciclo de vida de validacion','Relaciona riesgo, requisitos, pruebas y mantenimiento del estado validado.','validacion-procesos','orientation'),
  ('validaciones-farmaceuticas',2,'Protocolos y criterios de aceptacion','Define evidencia, responsabilidades y resultados esperados.','gestion-documental','learning'),
  ('validaciones-farmaceuticas',3,'Ejecucion y desviaciones','Registra pruebas y gestiona eventos con trazabilidad.','capa-desviaciones','practice'),
  ('validaciones-farmaceuticas',4,'Proyecto de protocolo','Crea una muestra de protocolo para tu portafolio profesional.','validacion-procesos','portfolio'),
  ('regulatory-affairs',1,'Entorno regulatorio','Reconoce autoridades, tipos de producto y ciclo de vida del registro.','regulacion-sanitaria','orientation'),
  ('regulatory-affairs',2,'Expediente tecnico','Organiza evidencia cientifica, de calidad y administrativa.','dossiers-regulatorios','learning'),
  ('regulatory-affairs',3,'Cambios y mantenimiento','Evalua el impacto regulatorio de cambios y variaciones.','change-control','practice'),
  ('regulatory-affairs',4,'Proyecto de matriz regulatoria','Construye una matriz de requisitos verificable.','asuntos-regulatorios','portfolio'),
  ('farmacovigilancia',1,'Sistema de farmacovigilancia','Comprende responsabilidades, flujos y proteccion de datos.','farmacovigilancia','orientation'),
  ('farmacovigilancia',2,'Gestion de casos','Practica recepcion, validacion y seguimiento de informacion.','gestion-casos-seguridad','learning'),
  ('farmacovigilancia',3,'Causalidad y senales','Diferencia evaluacion individual de casos y analisis agregado.','evaluacion-causalidad','practice'),
  ('farmacovigilancia',4,'Proyecto de caso anonimizado','Documenta un caso simulado sin usar datos personales.','gestion-casos-seguridad','portfolio'),
  ('produccion-farmaceutica',1,'BPM en produccion','Relaciona personas, materiales, equipos, ambiente y registros.','bpm-gmp','orientation'),
  ('produccion-farmaceutica',2,'Tecnologia y controles de proceso','Comprende operaciones unitarias y puntos de control.','tecnologia-farmaceutica','learning'),
  ('produccion-farmaceutica',3,'Desviaciones y mejora','Analiza problemas operativos con riesgo y evidencia.','mejora-continua','practice'),
  ('produccion-farmaceutica',4,'Mapa de flujo de valor','Documenta un proceso simulado y sus oportunidades de mejora.','lean','portfolio'),
  ('investigacion-y-desarrollo',1,'Pregunta y evidencia','Delimita una necesidad y revisa antecedentes relevantes.','evidencia-cientifica','orientation'),
  ('investigacion-y-desarrollo',2,'Diseno experimental','Define variables, controles, criterios y analisis.','diseno-experimentos','learning'),
  ('investigacion-y-desarrollo',3,'Formulacion y estabilidad','Relaciona composicion, proceso, empaque y desempeno.','formulacion','practice'),
  ('investigacion-y-desarrollo',4,'Proyecto de desarrollo','Presenta una propuesta experimental con riesgos y decisiones.','investigacion-desarrollo','portfolio'),
  ('formulacion-cosmetica',1,'Ciencia cosmetica','Comprende producto, usuario, funcion y seguridad.','formulacion-cosmetica','orientation'),
  ('formulacion-cosmetica',2,'Formulacion y materias primas','Relaciona componentes, proceso y atributos del producto.','formulacion-cosmetica','learning'),
  ('formulacion-cosmetica',3,'Estabilidad y microbiologia','Define pruebas y criterios para proteger calidad y seguridad.','estabilidad','practice'),
  ('formulacion-cosmetica',4,'Proyecto de ficha de producto','Documenta un concepto cosmetico con especificaciones iniciales.','formulacion-cosmetica','portfolio'),
  ('medical-affairs',1,'Ecosistema de Medical Affairs','Comprende intercambio cientifico, evidencia y limites promocionales.','medical-affairs','orientation'),
  ('medical-affairs',2,'Lectura critica','Evalua diseno, resultados, relevancia y limitaciones de estudios.','evidencia-cientifica','learning'),
  ('medical-affairs',3,'Comunicacion cientifica','Adapta evidencia a preguntas y audiencias sin exagerar conclusiones.','comunicacion-cientifica','practice'),
  ('medical-affairs',4,'Proyecto de respuesta medica','Crea una respuesta simulada con fuentes y trazabilidad.','medical-affairs','portfolio'),
  ('data-y-pharma',1,'Datos en el sector farmaceutico','Reconoce problemas de calidad, operaciones, seguridad y negocio.','analisis-datos','orientation'),
  ('data-y-pharma',2,'Excel y preparacion de datos','Limpia, estructura y valida datos antes de analizarlos.','excel','learning'),
  ('data-y-pharma',3,'Power BI e indicadores','Modela y visualiza medidas con contexto profesional.','power-bi','practice'),
  ('data-y-pharma',4,'Proyecto de dashboard','Publica un caso simulado con fuente, reglas y limitaciones.','visualizacion-datos','portfolio'),
  ('ia-para-profesionales-farmaceuticos',1,'IA y casos de uso','Diferencia automatizacion, prediccion y apoyo a decisiones.','ia-aplicada','orientation'),
  ('ia-para-profesionales-farmaceuticos',2,'Datos y gobernanza','Evalua calidad, privacidad, sesgos y responsabilidades.','gobernanza-datos','learning'),
  ('ia-para-profesionales-farmaceuticos',3,'Uso supervisado','Disena verificaciones humanas y criterios de aceptacion.','pensamiento-critico','practice'),
  ('ia-para-profesionales-farmaceuticos',4,'Proyecto de caso de uso','Documenta valor, riesgos, evidencia y limites de una solucion.','ia-aplicada','portfolio')
) AS v(path_slug, step_order, title, description, skill_slug, step_type)
JOIN learning_paths lp ON lp.slug = v.path_slug
LEFT JOIN skills s ON s.slug = v.skill_slug
ON CONFLICT (learning_path_id, step_order) DO UPDATE SET
  skill_id = EXCLUDED.skill_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  step_type = EXCLUDED.step_type;

-- ============================================================
-- 011_edvanta_professional_core.sql
-- Nucleo normalizado para carreras, habilidades y rutas Edvanta.
-- No modifica el catalogo ni los enlaces de afiliado existentes.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS career_families (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  sort_order      INTEGER NOT NULL DEFAULT 0,
  seo_title       TEXT,
  seo_description TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS careers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id           UUID REFERENCES career_families(id) ON DELETE SET NULL,
  slug                TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  headline            TEXT,
  summary             TEXT NOT NULL,
  what_it_is          TEXT,
  recommended_profile TEXT,
  entry_guidance      TEXT,
  responsibilities    TEXT[] NOT NULL DEFAULT '{}',
  workplaces          TEXT[] NOT NULL DEFAULT '{}',
  status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured            BOOLEAN NOT NULL DEFAULT FALSE,
  coming_soon         BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order          INTEGER NOT NULL DEFAULT 0,
  seo_title           TEXT,
  seo_description     TEXT,
  published_at        TIMESTAMPTZ,
  verified_at         TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  skill_type      TEXT NOT NULL DEFAULT 'technical' CHECK (skill_type IN ('technical', 'digital', 'business', 'human')),
  description     TEXT,
  status          TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS career_skills (
  career_id       UUID NOT NULL REFERENCES careers(id) ON DELETE CASCADE,
  skill_id        UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  importance      SMALLINT NOT NULL DEFAULT 3 CHECK (importance BETWEEN 1 AND 5),
  required_level  TEXT NOT NULL DEFAULT 'foundation' CHECK (required_level IN ('foundation', 'working', 'advanced')),
  is_core         BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  editorial_note TEXT,
  PRIMARY KEY (career_id, skill_id)
);

CREATE TABLE IF NOT EXISTS course_skills (
  course_id      BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  skill_id       UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  coverage       SMALLINT NOT NULL DEFAULT 3 CHECK (coverage BETWEEN 1 AND 5),
  relevance      SMALLINT NOT NULL DEFAULT 50 CHECK (relevance BETWEEN 0 AND 100),
  primary_skill  BOOLEAN NOT NULL DEFAULT FALSE,
  review_status  TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'verified', 'rejected')),
  source         TEXT,
  PRIMARY KEY (course_id, skill_id)
);

CREATE TABLE IF NOT EXISTS learning_paths (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id       UUID REFERENCES careers(id) ON DELETE SET NULL,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  summary         TEXT,
  audience        TEXT,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title       TEXT,
  seo_description TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_path_steps (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
  course_id        BIGINT REFERENCES courses(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,
  description      TEXT,
  step_order       INTEGER NOT NULL,
  is_optional      BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (learning_path_id, step_order)
);

CREATE INDEX IF NOT EXISTS idx_careers_family_status ON careers (family_id, status);
CREATE INDEX IF NOT EXISTS idx_careers_featured ON careers (featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_career_skills_career ON career_skills (career_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_course_skills_skill ON course_skills (skill_id, relevance DESC);
CREATE INDEX IF NOT EXISTS idx_learning_paths_career ON learning_paths (career_id, status);

CREATE OR REPLACE FUNCTION set_professional_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_career_families_updated_at ON career_families;
CREATE TRIGGER trg_career_families_updated_at BEFORE UPDATE ON career_families
  FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_careers_updated_at ON careers;
CREATE TRIGGER trg_careers_updated_at BEFORE UPDATE ON careers
  FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_skills_updated_at ON skills;
CREATE TRIGGER trg_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();
DROP TRIGGER IF EXISTS trg_learning_paths_updated_at ON learning_paths;
CREATE TRIGGER trg_learning_paths_updated_at BEFORE UPDATE ON learning_paths
  FOR EACH ROW EXECUTE FUNCTION set_professional_updated_at();

INSERT INTO career_families (slug, name, description, status, sort_order, seo_title, seo_description)
VALUES
  ('calidad-operaciones', 'Calidad y operaciones', 'Carreras enfocadas en asegurar procesos, productos y operaciones farmacéuticas confiables.', 'published', 10, 'Carreras de calidad farmacéutica | Edvanta', 'Explora oportunidades profesionales en calidad, control, validaciones y producción farmacéutica.'),
  ('regulacion-seguridad', 'Regulación y seguridad', 'Perfiles que conectan el cumplimiento sanitario con la seguridad de pacientes y productos.', 'published', 20, 'Carreras de regulación y seguridad | Edvanta', 'Conoce carreras en asuntos regulatorios, farmacovigilancia y cumplimiento sanitario.'),
  ('innovacion-negocio', 'Innovación y negocio', 'Roles científicos y estratégicos que convierten conocimiento en productos y decisiones.', 'published', 30, 'Carreras de innovación farmacéutica | Edvanta', 'Explora carreras de investigación, cosmética y asuntos médicos.'),
  ('tecnologia-datos', 'Tecnología y datos', 'Carreras que aplican analítica, automatización e inteligencia artificial al sector farmacéutico.', 'published', 40, 'Carreras de datos e IA farmacéutica | Edvanta', 'Descubre cómo desarrollar una carrera de datos, tecnología e IA aplicada a farma.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO careers (
  family_id, slug, name, headline, summary, what_it_is, recommended_profile,
  entry_guidance, responsibilities, workplaces, status, featured, sort_order,
  seo_title, seo_description, published_at
)
SELECT f.id, v.slug, v.name, v.headline, v.summary, v.what_it_is, v.recommended_profile,
       v.entry_guidance, v.responsibilities, v.workplaces, 'published', v.featured,
       v.sort_order, v.seo_title, v.seo_description, NOW()
FROM career_families f
JOIN (VALUES
  ('calidad-operaciones', 'aseguramiento-calidad', 'Aseguramiento de calidad', 'Convierte los requisitos de calidad en procesos que funcionan.', 'Participa en la construcción y mejora del sistema de calidad que sostiene una operación farmacéutica.', 'Aseguramiento de calidad coordina procedimientos, riesgos, cambios, desviaciones y acciones de mejora para que la organización trabaje de forma controlada y documentada.', 'Personas rigurosas, organizadas y capaces de conectar la norma con la operación diaria.', 'Comienza por BPM, documentación, gestión de riesgos y análisis de desviaciones; después profundiza en auditorías, CAPA y control de cambios.', ARRAY['Administrar procedimientos y registros','Investigar desviaciones y dar seguimiento a CAPA','Apoyar auditorías y revisiones de calidad','Evaluar riesgos y controles de cambio'], ARRAY['Laboratorios farmacéuticos','Fabricantes de dispositivos o cosméticos','Distribuidores y operadores logísticos','Consultoría de calidad'], true, 10, 'Carrera en aseguramiento de calidad farmacéutica | Edvanta', 'Conoce qué hace un profesional de aseguramiento de calidad, sus habilidades clave y cómo prepararte para este campo.'),
  ('calidad-operaciones', 'control-calidad', 'Control de calidad', 'Evalúa con evidencia la identidad, pureza y desempeño del producto.', 'Combina trabajo analítico, criterios de aceptación y documentación para respaldar decisiones de calidad.', 'Control de calidad realiza o coordina ensayos físico-químicos y microbiológicos bajo procedimientos aprobados y con trazabilidad de resultados.', 'Perfiles analíticos que disfrutan el trabajo de laboratorio, la precisión y la interpretación de datos.', 'Refuerza química analítica, buenas prácticas de laboratorio, integridad de datos y manejo de resultados fuera de especificación.', ARRAY['Ejecutar o revisar ensayos de laboratorio','Documentar resultados con integridad de datos','Investigar resultados atípicos o fuera de especificación','Verificar equipos, métodos y materiales'], ARRAY['Laboratorios de control de calidad','Plantas farmacéuticas','Laboratorios cosméticos','Servicios analíticos especializados'], true, 20, 'Carrera en control de calidad farmacéutico | Edvanta', 'Explora funciones, habilidades y preparación para trabajar en control de calidad farmacéutico.'),
  ('calidad-operaciones', 'validaciones', 'Validaciones', 'Demuestra con evidencia que procesos, métodos y sistemas son confiables.', 'Diseña y ejecuta estudios documentados para comprobar que un proceso cumple de manera consistente su propósito.', 'Validaciones integra ciencia, estadística, gestión de riesgos y documentación para calificar equipos, procesos, limpieza, métodos y sistemas computarizados.', 'Profesionales metódicos que disfrutan planear pruebas, analizar evidencia y resolver problemas técnicos.', 'Construye bases en BPM, estadística, protocolos, análisis de riesgos y ciclo de vida de validación.', ARRAY['Preparar protocolos e informes','Coordinar ejecución de pruebas','Analizar desviaciones y criterios de aceptación','Mantener el estado validado durante el ciclo de vida'], ARRAY['Plantas farmacéuticas','Ingeniería y proyectos','Laboratorios analíticos','Consultoría de validaciones'], true, 30, 'Carrera en validaciones farmacéuticas | Edvanta', 'Descubre qué hace un profesional de validaciones y qué habilidades desarrollar para entrar al área.'),
  ('regulacion-seguridad', 'asuntos-regulatorios', 'Asuntos regulatorios', 'Traduce evidencia científica y requisitos en autorizaciones sostenibles.', 'Gestiona expedientes, cambios y comunicaciones con autoridades para mantener productos dentro del marco sanitario.', 'Asuntos regulatorios conecta desarrollo, calidad, negocio y regulación durante todo el ciclo de vida de un producto.', 'Personas con escritura técnica sólida, criterio documental y facilidad para coordinar múltiples áreas.', 'Estudia regulación sanitaria, estructura de dossiers, ciclo de vida del registro y lectura crítica de requisitos.', ARRAY['Preparar y mantener expedientes regulatorios','Evaluar impacto regulatorio de cambios','Coordinar respuestas a autoridades','Monitorear actualizaciones normativas'], ARRAY['Industria farmacéutica','Industria cosmética y de dispositivos','Consultoría regulatoria','Organizaciones de investigación'], true, 40, 'Carrera en asuntos regulatorios farmacéuticos | Edvanta', 'Conoce las funciones y habilidades necesarias para una carrera en asuntos regulatorios.'),
  ('regulacion-seguridad', 'farmacovigilancia', 'Farmacovigilancia', 'Transforma reportes de seguridad en decisiones responsables.', 'Recopila, evalúa y comunica información sobre eventos adversos y el balance beneficio-riesgo.', 'Farmacovigilancia vigila la seguridad de medicamentos durante su uso y sostiene procesos de detección, evaluación y comunicación de riesgos.', 'Perfiles cuidadosos, con criterio clínico, capacidad de análisis y compromiso con la confidencialidad.', 'Fortalece farmacología, evaluación de causalidad, gestión de casos, terminología médica y comunicación de riesgos.', ARRAY['Gestionar reportes de eventos adversos','Evaluar calidad y consistencia de casos','Apoyar análisis de señales y riesgos','Cumplir calendarios de reporte y seguimiento'], ARRAY['Titulares de registros sanitarios','Proveedores de farmacovigilancia','Investigación clínica','Instituciones de salud'], true, 50, 'Carrera en farmacovigilancia | Edvanta', 'Explora el trabajo en farmacovigilancia, sus competencias clave y una ruta inicial de aprendizaje.'),
  ('calidad-operaciones', 'produccion-farmaceutica', 'Producción farmacéutica', 'Lleva la fórmula a una operación segura, consistente y eficiente.', 'Coordina personas, materiales, equipos y registros para fabricar productos bajo condiciones controladas.', 'Producción farmacéutica convierte instrucciones maestras en operaciones trazables, cumpliendo requisitos de calidad, seguridad y productividad.', 'Profesionales prácticos, orientados a procesos y con capacidad para liderar equipos en entornos regulados.', 'Empieza por BPM, tecnología farmacéutica, controles en proceso, documentación y solución estructurada de problemas.', ARRAY['Coordinar operaciones de fabricación','Verificar registros y controles en proceso','Gestionar recursos y cumplimiento del plan','Escalar desviaciones y oportunidades de mejora'], ARRAY['Plantas de medicamentos','Fabricación cosmética','Suplementos y productos de cuidado','Operaciones de empaque'], false, 60, 'Carrera en producción farmacéutica | Edvanta', 'Aprende qué hace un profesional de producción farmacéutica y cómo desarrollar sus competencias principales.'),
  ('innovacion-negocio', 'investigacion-desarrollo', 'Investigación y desarrollo', 'Convierte preguntas científicas en formulaciones y productos viables.', 'Explora, formula, experimenta y documenta soluciones que deben ser eficaces, estables y fabricables.', 'Investigación y desarrollo integra diseño experimental, formulación, caracterización y transferencia de conocimiento hacia etapas posteriores.', 'Personas curiosas, con base científica y tolerancia a la iteración y al aprendizaje experimental.', 'Refuerza formulación, diseño de experimentos, estabilidad, búsqueda bibliográfica y gestión de proyectos.', ARRAY['Diseñar y ejecutar experimentos','Desarrollar y optimizar formulaciones','Analizar estabilidad y desempeño','Documentar y transferir conocimiento técnico'], ARRAY['Centros de investigación','Industria farmacéutica','Empresas cosméticas','Laboratorios de innovación'], false, 70, 'Carrera en investigación y desarrollo farmacéutico | Edvanta', 'Conoce habilidades y funciones de investigación y desarrollo en la industria farmacéutica.'),
  ('innovacion-negocio', 'industria-cosmetica', 'Industria cosmética', 'Integra formulación, seguridad, calidad y experiencia de producto.', 'Participa en el desarrollo y control de productos cosméticos con criterios técnicos, regulatorios y de consumidor.', 'La carrera cosmética puede involucrar formulación, calidad, asuntos regulatorios, producción o evaluación de estabilidad y compatibilidad.', 'Perfiles que combinan sensibilidad por el producto con disciplina científica y documental.', 'Construye fundamentos en formulación cosmética, estabilidad, microbiología, regulación y buenas prácticas de fabricación.', ARRAY['Apoyar formulación y escalado','Evaluar estabilidad y compatibilidad','Gestionar especificaciones y documentación','Coordinar requisitos de calidad y regulación'], ARRAY['Fabricantes de cosméticos','Laboratorios de desarrollo','Marcas de cuidado personal','Consultoría técnica y regulatoria'], false, 80, 'Carrera en industria cosmética | Edvanta', 'Explora las áreas profesionales, habilidades y rutas de entrada a la industria cosmética.'),
  ('innovacion-negocio', 'medical-affairs', 'Medical Affairs', 'Conecta evidencia científica, necesidades clínicas y estrategia médica.', 'Facilita intercambio científico responsable y convierte evidencia en conocimiento útil para distintos actores.', 'Medical Affairs trabaja con evidencia, educación médica, consultas científicas y generación de información durante el ciclo de vida del producto.', 'Profesionales con lectura crítica, comunicación clara y capacidad para relacionarse con equipos científicos y clínicos.', 'Profundiza en medicina basada en evidencia, comunicación científica, ética, investigación clínica y gestión de proyectos.', ARRAY['Analizar y comunicar evidencia científica','Responder consultas médicas con trazabilidad','Apoyar educación y estrategia médica','Identificar necesidades de evidencia'], ARRAY['Compañías farmacéuticas','Biotecnología','Organizaciones de investigación','Agencias de comunicación científica'], false, 90, 'Carrera en Medical Affairs | Edvanta', 'Descubre las responsabilidades y habilidades necesarias para desarrollarte en Medical Affairs.'),
  ('tecnologia-datos', 'datos-farma', 'Datos y Pharma', 'Convierte datos operativos y científicos en decisiones trazables.', 'Aplica analítica y visualización para entender procesos, calidad, seguridad o desempeño del negocio farmacéutico.', 'Datos y Pharma combina conocimiento del sector con preparación, análisis y comunicación responsable de información.', 'Personas analíticas que quieren sumar herramientas digitales a una base científica o de procesos.', 'Aprende hojas de cálculo avanzadas, SQL, visualización, estadística y fundamentos de calidad de datos.', ARRAY['Preparar y depurar datos','Construir indicadores y visualizaciones','Analizar tendencias con contexto del negocio','Documentar fuentes, reglas y limitaciones'], ARRAY['Calidad y operaciones','Farmacovigilancia','Comercial y acceso','Investigación y desarrollo'], true, 100, 'Carrera en datos para la industria farmacéutica | Edvanta', 'Conoce cómo combinar analítica de datos y conocimiento farmacéutico para construir un perfil profesional relevante.'),
  ('tecnologia-datos', 'inteligencia-artificial-farma', 'Inteligencia artificial y Pharma', 'Aplica IA con criterio, datos confiables y supervisión humana.', 'Participa en casos de uso de automatización y apoyo a decisiones dentro de entornos científicos y regulados.', 'IA y Pharma requiere comprender el problema, la calidad de los datos, los riesgos, la validación y la responsabilidad sobre los resultados.', 'Perfiles híbridos que combinan conocimiento farmacéutico, pensamiento crítico y curiosidad tecnológica.', 'Empieza por alfabetización en IA, análisis de datos, diseño de casos de uso, privacidad, validación y gobernanza.', ARRAY['Identificar casos de uso con valor real','Preparar datos y evaluar resultados','Documentar límites, riesgos y controles','Trabajar con equipos técnicos y expertos de dominio'], ARRAY['Transformación digital','Calidad y automatización','Análisis de datos','Investigación e innovación'], true, 110, 'Carrera en inteligencia artificial aplicada a Pharma | Edvanta', 'Explora habilidades, responsabilidades y una ruta responsable hacia la IA aplicada a la industria farmacéutica.')
) AS v(family_slug, slug, name, headline, summary, what_it_is, recommended_profile, entry_guidance, responsibilities, workplaces, featured, sort_order, seo_title, seo_description)
  ON f.slug = v.family_slug
ON CONFLICT (slug) DO NOTHING;

INSERT INTO skills (slug, name, skill_type, description)
VALUES
  ('bpm-gmp', 'Buenas Prácticas de Manufactura (BPM/GMP)', 'technical', 'Principios para operar de forma controlada, documentada y consistente.'),
  ('gestion-documental', 'Gestión documental', 'technical', 'Creación, control y uso trazable de documentos y registros.'),
  ('gestion-riesgos-calidad', 'Gestión de riesgos de calidad', 'technical', 'Identificación, valoración, control y revisión de riesgos.'),
  ('capa-desviaciones', 'Desviaciones y CAPA', 'technical', 'Investigación de causas y seguimiento de acciones correctivas y preventivas.'),
  ('auditorias', 'Auditorías', 'technical', 'Preparación, ejecución y seguimiento de evaluaciones de cumplimiento.'),
  ('quimica-analitica', 'Química analítica', 'technical', 'Fundamentos de medición, ensayo e interpretación de resultados.'),
  ('microbiologia', 'Microbiología', 'technical', 'Control y análisis microbiológico aplicado a productos y procesos.'),
  ('integridad-datos', 'Integridad de datos', 'technical', 'Principios para mantener datos completos, consistentes y atribuibles.'),
  ('validacion-procesos', 'Validación de procesos', 'technical', 'Evidencia documentada de desempeño consistente de un proceso.'),
  ('validacion-metodos', 'Validación de métodos analíticos', 'technical', 'Evaluación del desempeño previsto de un método de análisis.'),
  ('regulacion-sanitaria', 'Regulación sanitaria', 'technical', 'Interpretación y aplicación de requisitos regulatorios.'),
  ('dossiers-regulatorios', 'Dossiers regulatorios', 'technical', 'Estructuración y mantenimiento de expedientes técnicos.'),
  ('gestion-casos-seguridad', 'Gestión de casos de seguridad', 'technical', 'Recepción, evaluación y seguimiento de reportes de seguridad.'),
  ('evaluacion-causalidad', 'Evaluación de causalidad', 'technical', 'Análisis estructurado de la relación entre exposición y evento.'),
  ('tecnologia-farmaceutica', 'Tecnología farmacéutica', 'technical', 'Operaciones y principios para transformar materiales en productos.'),
  ('formulacion', 'Formulación', 'technical', 'Diseño y optimización de composiciones y formas de producto.'),
  ('estabilidad', 'Estudios de estabilidad', 'technical', 'Evaluación del comportamiento del producto a través del tiempo.'),
  ('diseno-experimentos', 'Diseño de experimentos', 'technical', 'Planificación eficiente de experimentos e interpretación de factores.'),
  ('evidencia-cientifica', 'Lectura crítica de evidencia', 'technical', 'Evaluación de calidad, relevancia y límites de la evidencia.'),
  ('comunicacion-cientifica', 'Comunicación científica', 'human', 'Traducción de evidencia compleja a mensajes claros y responsables.'),
  ('gestion-proyectos', 'Gestión de proyectos', 'business', 'Planificación, coordinación y seguimiento de objetivos y entregables.'),
  ('analisis-datos', 'Análisis de datos', 'digital', 'Preparación, exploración e interpretación de datos.'),
  ('sql', 'SQL', 'digital', 'Consulta y transformación reproducible de datos estructurados.'),
  ('visualizacion-datos', 'Visualización de datos', 'digital', 'Comunicación visual de indicadores, tendencias y hallazgos.'),
  ('python-datos', 'Python para datos', 'digital', 'Automatización y análisis reproducible con Python.'),
  ('ia-aplicada', 'Inteligencia artificial aplicada', 'digital', 'Diseño y evaluación responsable de casos de uso de IA.'),
  ('gobernanza-datos', 'Gobernanza de datos', 'business', 'Roles, reglas y controles para gestionar datos confiables y responsables.'),
  ('formulacion-cosmetica', 'Formulación cosmética', 'technical', 'Diseño y evaluación de productos cosméticos.'),
  ('liderazgo-operativo', 'Liderazgo operativo', 'human', 'Coordinación de personas y decisiones en entornos de operación.'),
  ('pensamiento-critico', 'Pensamiento crítico', 'human', 'Evaluación de supuestos, evidencia y alternativas antes de decidir.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO career_skills (career_id, skill_id, importance, required_level, is_core, sort_order)
SELECT c.id, s.id, v.importance, v.required_level, true, v.sort_order
FROM (VALUES
  ('aseguramiento-calidad','bpm-gmp',5,'working',10), ('aseguramiento-calidad','gestion-documental',5,'working',20), ('aseguramiento-calidad','capa-desviaciones',5,'working',30), ('aseguramiento-calidad','gestion-riesgos-calidad',4,'working',40), ('aseguramiento-calidad','auditorias',4,'foundation',50),
  ('control-calidad','quimica-analitica',5,'working',10), ('control-calidad','integridad-datos',5,'working',20), ('control-calidad','validacion-metodos',4,'foundation',30), ('control-calidad','microbiologia',3,'foundation',40), ('control-calidad','bpm-gmp',4,'working',50),
  ('validaciones','validacion-procesos',5,'working',10), ('validaciones','gestion-riesgos-calidad',5,'working',20), ('validaciones','gestion-documental',4,'working',30), ('validaciones','diseno-experimentos',4,'foundation',40), ('validaciones','integridad-datos',4,'foundation',50),
  ('asuntos-regulatorios','regulacion-sanitaria',5,'working',10), ('asuntos-regulatorios','dossiers-regulatorios',5,'working',20), ('asuntos-regulatorios','gestion-documental',4,'working',30), ('asuntos-regulatorios','comunicacion-cientifica',4,'working',40), ('asuntos-regulatorios','gestion-proyectos',3,'foundation',50),
  ('farmacovigilancia','gestion-casos-seguridad',5,'working',10), ('farmacovigilancia','evaluacion-causalidad',5,'working',20), ('farmacovigilancia','evidencia-cientifica',4,'working',30), ('farmacovigilancia','comunicacion-cientifica',4,'working',40), ('farmacovigilancia','integridad-datos',4,'foundation',50),
  ('produccion-farmaceutica','bpm-gmp',5,'working',10), ('produccion-farmaceutica','tecnologia-farmaceutica',5,'working',20), ('produccion-farmaceutica','liderazgo-operativo',4,'working',30), ('produccion-farmaceutica','capa-desviaciones',4,'foundation',40), ('produccion-farmaceutica','gestion-riesgos-calidad',3,'foundation',50),
  ('investigacion-desarrollo','formulacion',5,'working',10), ('investigacion-desarrollo','diseno-experimentos',5,'working',20), ('investigacion-desarrollo','estabilidad',4,'working',30), ('investigacion-desarrollo','evidencia-cientifica',4,'working',40), ('investigacion-desarrollo','gestion-proyectos',3,'foundation',50),
  ('industria-cosmetica','formulacion-cosmetica',5,'working',10), ('industria-cosmetica','estabilidad',4,'working',20), ('industria-cosmetica','microbiologia',3,'foundation',30), ('industria-cosmetica','regulacion-sanitaria',4,'foundation',40), ('industria-cosmetica','bpm-gmp',4,'foundation',50),
  ('medical-affairs','evidencia-cientifica',5,'advanced',10), ('medical-affairs','comunicacion-cientifica',5,'advanced',20), ('medical-affairs','pensamiento-critico',5,'working',30), ('medical-affairs','gestion-proyectos',4,'working',40), ('medical-affairs','integridad-datos',3,'foundation',50),
  ('datos-farma','analisis-datos',5,'working',10), ('datos-farma','sql',4,'working',20), ('datos-farma','visualizacion-datos',5,'working',30), ('datos-farma','gobernanza-datos',4,'foundation',40), ('datos-farma','pensamiento-critico',4,'working',50),
  ('inteligencia-artificial-farma','ia-aplicada',5,'working',10), ('inteligencia-artificial-farma','analisis-datos',5,'working',20), ('inteligencia-artificial-farma','gobernanza-datos',5,'working',30), ('inteligencia-artificial-farma','python-datos',4,'foundation',40), ('inteligencia-artificial-farma','pensamiento-critico',5,'working',50)
) AS v(career_slug, skill_slug, importance, required_level, sort_order)
JOIN careers c ON c.slug = v.career_slug
JOIN skills s ON s.slug = v.skill_slug
ON CONFLICT (career_id, skill_id) DO NOTHING;

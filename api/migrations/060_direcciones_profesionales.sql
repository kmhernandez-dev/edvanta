-- ============================================================
--  060 · Direcciones de carreras, rutas y competencias en español
--
--  /carreras/aseguramiento-calidad      → /carreras/aseguramiento-de-calidad
--  /rutas/quality-assurance-desde-cero  → /rutas/aseguramiento-de-calidad-desde-cero
--  /competencias/bpm-gmp                → /competencias/buenas-practicas-de-manufactura
--
--  La dirección sale del nombre real, completo y en español. Donde el
--  sitio ya usaba el término en español para lo mismo (la carrera
--  «Asuntos regulatorios» y la ruta «Regulatory Affairs»), se unifica.
--  Se conservan los nombres de uso internacional (Power BI, SQL, Lean,
--  Six Sigma, Medical Affairs).
--
--  slugs_anteriores guarda cada nombre viejo apuntando al id, así que la
--  redirección es de un salto aunque el slug vuelva a cambiar: la API
--  responde el 301 (/api/paginas/…) y sirve los datos si alguien pide el
--  nombre viejo. Las filas no se borran: los enlaces viejos siguen
--  circulando.
--
--  Idempotente: cada cambio solo se aplica si el slug viejo existe y el
--  nuevo está libre.
-- ============================================================

CREATE TABLE IF NOT EXISTS slugs_anteriores (
  tipo        TEXT NOT NULL CHECK (tipo IN ('carrera', 'ruta', 'competencia')),
  anterior    TEXT NOT NULL CHECK (anterior ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  entidad_id  UUID NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tipo, anterior)
);
CREATE INDEX IF NOT EXISTS slugs_anteriores_entidad ON slugs_anteriores (tipo, entidad_id);

-- Las dos competencias que ya se renombraron en la 058 (sus 301 viven
-- también en nginx.conf).
INSERT INTO slugs_anteriores (tipo, anterior, entidad_id)
SELECT 'competencia', v.anterior, s.id
  FROM (VALUES ('change-control', 'control-de-cambios'), ('supplier-quality', 'calidad-de-proveedores')) AS v(anterior, actual)
  JOIN skills s ON s.slug = v.actual
ON CONFLICT (tipo, anterior) DO NOTHING;

-- ── Carreras ─────────────────────────────────────────────────
CREATE TEMP TABLE _cambios_carreras (anterior TEXT, actual TEXT, nombre TEXT, seo_title TEXT) ON COMMIT DROP;
INSERT INTO _cambios_carreras VALUES
  ('aseguramiento-calidad', 'aseguramiento-de-calidad', NULL, NULL),
  ('control-calidad', 'control-de-calidad', NULL, NULL),
  ('datos-farma', 'datos-para-la-industria-farmaceutica', 'Datos para la industria farmacéutica', NULL),
  ('inteligencia-artificial-farma', 'inteligencia-artificial-en-la-industria-farmaceutica',
   'Inteligencia artificial en la industria farmacéutica',
   'Carrera en inteligencia artificial aplicada a la industria farmacéutica | Edvanta'),
  ('investigacion-desarrollo', 'investigacion-y-desarrollo', NULL, NULL);

INSERT INTO slugs_anteriores (tipo, anterior, entidad_id)
SELECT 'carrera', c.slug, c.id FROM careers c JOIN _cambios_carreras x ON x.anterior = c.slug
ON CONFLICT (tipo, anterior) DO NOTHING;

UPDATE careers c
   SET slug = x.actual,
       name = COALESCE(x.nombre, c.name),
       seo_title = COALESCE(x.seo_title, c.seo_title),
       updated_at = NOW()
  FROM _cambios_carreras x
 WHERE c.slug = x.anterior
   AND NOT EXISTS (SELECT 1 FROM careers o WHERE o.slug = x.actual);

-- ── Rutas ────────────────────────────────────────────────────
CREATE TEMP TABLE _cambios_rutas (anterior TEXT, actual TEXT) ON COMMIT DROP;
INSERT INTO _cambios_rutas VALUES
  ('quality-assurance-desde-cero', 'aseguramiento-de-calidad-desde-cero'),
  ('regulatory-affairs', 'asuntos-regulatorios'),
  ('data-y-pharma', 'datos-para-la-industria-farmaceutica');

INSERT INTO slugs_anteriores (tipo, anterior, entidad_id)
SELECT 'ruta', p.slug, p.id FROM learning_paths p JOIN _cambios_rutas x ON x.anterior = p.slug
ON CONFLICT (tipo, anterior) DO NOTHING;

UPDATE learning_paths p
   SET slug = x.actual, updated_at = NOW()
  FROM _cambios_rutas x
 WHERE p.slug = x.anterior
   AND NOT EXISTS (SELECT 1 FROM learning_paths o WHERE o.slug = x.actual);

-- Nombres y textos de las rutas: en español y con tildes (lo que muestran
-- la página y los buscadores). Solo ortografía y el nombre en español; la
-- redacción es la misma.
CREATE TEMP TABLE _textos_rutas (slug TEXT, nombre TEXT, seo_title TEXT, seo_description TEXT, resumen TEXT) ON COMMIT DROP;
INSERT INTO _textos_rutas VALUES
  ('aseguramiento-de-calidad-desde-cero', 'Aseguramiento de calidad desde cero',
   'Ruta de aseguramiento de calidad desde cero | Edvanta',
   'Ruta profesional para desarrollar competencias iniciales en aseguramiento de calidad farmacéutico.',
   'Comprende la industria, domina los fundamentos de calidad y prepara evidencia profesional para iniciar en aseguramiento de calidad (QA).'),
  ('asuntos-regulatorios', 'Asuntos regulatorios',
   'Ruta de asuntos regulatorios | Edvanta',
   'Ruta para iniciar una carrera en asuntos regulatorios farmacéuticos.',
   'Conecta requisitos, evidencia y documentación para gestionar productos durante su ciclo de vida regulatorio.'),
  ('datos-para-la-industria-farmaceutica', 'Datos para la industria farmacéutica',
   'Ruta de datos para la industria farmacéutica | Edvanta',
   'Ruta para combinar analítica de datos y conocimiento de la industria farmacéutica.',
   'Aplica Excel, Power BI, SQL y pensamiento crítico a problemas del sector farmacéutico.'),
  ('ia-para-profesionales-farmaceuticos', 'IA para profesionales farmacéuticos',
   'Ruta de IA para profesionales farmacéuticos | Edvanta',
   'Ruta responsable para aplicar inteligencia artificial en contextos farmacéuticos.',
   'Aprende a identificar, evaluar y usar inteligencia artificial con datos confiables y supervisión humana.'),
  ('validaciones-farmaceuticas', 'Validaciones farmacéuticas',
   'Ruta de validaciones farmacéuticas | Edvanta',
   'Ruta profesional de validación de procesos, métodos y sistemas farmacéuticos.',
   'Aprende a planear, ejecutar y documentar evidencia de que procesos, métodos y sistemas cumplen su propósito.'),
  ('produccion-farmaceutica', 'Producción farmacéutica',
   'Ruta de producción farmacéutica | Edvanta',
   'Ruta para desarrollar competencias iniciales de producción y operaciones farmacéuticas.',
   'Integra BPM, tecnología farmacéutica, liderazgo operativo y mejora continua para entornos de fabricación.'),
  ('investigacion-y-desarrollo', 'Investigación y desarrollo',
   'Ruta de investigación y desarrollo farmacéutico | Edvanta',
   'Ruta profesional para fortalecer formulación, experimentación y desarrollo farmacéutico.',
   'Convierte preguntas científicas en experimentos, formulaciones y conocimiento transferible.'),
  ('formulacion-cosmetica', 'Formulación cosmética',
   'Ruta de formulación cosmética | Edvanta',
   'Ruta para construir competencias en formulación y desarrollo de productos cosméticos.',
   'Combina formulación, estabilidad, microbiología, calidad y regulación para desarrollar productos cosméticos.'),
  ('control-de-calidad', 'Control de calidad',
   'Ruta de control de calidad farmacéutico | Edvanta',
   'Ruta para desarrollar competencias de laboratorio y control de calidad farmacéutico.',
   'Construye bases analíticas, documentales y de integridad de datos para trabajar en laboratorios de control.');

UPDATE learning_paths p
   SET name = t.nombre, seo_title = t.seo_title, seo_description = t.seo_description, summary = t.resumen, updated_at = NOW()
  FROM _textos_rutas t
 WHERE p.slug = t.slug;

-- ── Competencias ─────────────────────────────────────────────
CREATE TEMP TABLE _cambios_competencias (anterior TEXT, actual TEXT, nombre TEXT) ON COMMIT DROP;
INSERT INTO _cambios_competencias VALUES
  ('integridad-datos', 'integridad-de-datos', NULL),
  ('bpm-gmp', 'buenas-practicas-de-manufactura', NULL),
  ('gestion-riesgos-calidad', 'gestion-de-riesgos-de-calidad', NULL),
  ('gestion-proyectos', 'gestion-de-proyectos', NULL),
  ('evidencia-cientifica', 'lectura-critica-de-evidencia', NULL),
  ('sistemas-gestion-calidad', 'sistemas-de-gestion-de-calidad', 'Sistemas de gestión de calidad'),
  ('analisis-datos', 'analisis-de-datos', NULL),
  ('capa-desviaciones', 'desviaciones-y-capa', NULL),
  ('diseno-experimentos', 'diseno-de-experimentos', NULL),
  ('estabilidad', 'estudios-de-estabilidad', NULL),
  ('gobernanza-datos', 'gobernanza-de-datos', NULL),
  ('visualizacion-datos', 'visualizacion-de-datos', NULL),
  ('ia-aplicada', 'inteligencia-artificial-aplicada', NULL),
  ('evaluacion-causalidad', 'evaluacion-de-causalidad', NULL),
  ('gestion-casos-seguridad', 'gestion-de-casos-de-seguridad', NULL),
  ('investigacion-desarrollo', 'investigacion-y-desarrollo', 'Investigación y desarrollo'),
  ('oos-oot', 'resultados-fuera-de-especificacion-oos-y-oot', 'Resultados fuera de especificación (OOS y OOT)'),
  ('python-datos', 'python-para-datos', NULL),
  ('validacion-metodos', 'validacion-de-metodos-analiticos', NULL),
  ('validacion-procesos', 'validacion-de-procesos', NULL),
  ('seguridad-salud-trabajo', 'seguridad-y-salud-en-el-trabajo', NULL),
  ('busqueda-empleo', 'busqueda-de-empleo', 'Búsqueda de empleo'),
  ('cv-profesional', 'hoja-de-vida-profesional', 'Hoja de vida profesional');

INSERT INTO slugs_anteriores (tipo, anterior, entidad_id)
SELECT 'competencia', s.slug, s.id FROM skills s JOIN _cambios_competencias x ON x.anterior = s.slug
ON CONFLICT (tipo, anterior) DO NOTHING;

UPDATE skills s
   SET slug = x.actual, name = COALESCE(x.nombre, s.name), updated_at = NOW()
  FROM _cambios_competencias x
 WHERE s.slug = x.anterior
   AND NOT EXISTS (SELECT 1 FROM skills o WHERE o.slug = x.actual);

-- Tildes en los nombres que no cambian de dirección.
UPDATE skills SET name = 'Producción farmacéutica', updated_at = NOW() WHERE slug = 'produccion-farmaceutica' AND name = 'Produccion farmaceutica';
UPDATE skills SET name = 'Gestión ambiental', updated_at = NOW() WHERE slug = 'gestion-ambiental' AND name = 'Gestion ambiental';
UPDATE skills SET name = 'Industria farmacéutica', updated_at = NOW() WHERE slug = 'industria-farmaceutica' AND name = 'Industria farmaceutica';

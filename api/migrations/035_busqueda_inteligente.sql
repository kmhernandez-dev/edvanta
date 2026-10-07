-- ============================================================
--  035_busqueda_inteligente.sql — Que el buscador encuentre
--
--  Tres fallos que arregla:
--
--  1. Las tildes. «farmacologia» devolvía cero y «farmacología»
--     devolvía ocho. En Colombia mucha gente escribe sin tildes,
--     así que media búsqueda se perdía.
--  2. Las páginas del sitio no estaban en ninguna parte. Buscar
--     «hoja de vida» no encontraba la herramienta, aunque la propia
--     página de búsqueda la propusiera como ejemplo.
--  3. No había orden por relevancia: los resultados salían en el
--     orden de las tablas.
--
--  No se usa la extensión `unaccent` a propósito: hay que instalarla
--  en el servidor y aquí no está garantizada. `translate()` hace lo
--  mismo para el español y funciona en cualquier Postgres.
-- ============================================================

-- ── Quitar tildes ──────────────────────────────────────────
--
-- IMMUTABLE para poder indexarla: sin eso, cada búsqueda tendría que
-- recorrer la tabla entera normalizando fila por fila.

CREATE OR REPLACE FUNCTION ed_normaliza(txt TEXT) RETURNS TEXT AS $$
  SELECT lower(translate(
    COALESCE($1, ''),
    'áàäâãéèëêíìïîóòöôõúùüûýñçÁÀÄÂÃÉÈËÊÍÌÏÎÓÒÖÔÕÚÙÜÛÝÑÇ',
    'aaaaaeeeeiiiiooooouuuuyncAAAAAEEEEIIIIOOOOOUUUUYNC'
  ));
$$ LANGUAGE SQL IMMUTABLE STRICT PARALLEL SAFE;

COMMENT ON FUNCTION ed_normaliza IS
  'Minúsculas y sin tildes, para comparar como escribe la gente.';

-- ── Las páginas del sitio, buscables ───────────────────────
--
-- Las herramientas y secciones de Edvanta no viven en ninguna tabla:
-- son rutas del front. Esta tabla las hace encontrables junto al resto.

CREATE TABLE IF NOT EXISTS site_pages (
  slug         TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  destination  TEXT NOT NULL,
  keywords     TEXT,
  weight       INTEGER NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON COLUMN site_pages.keywords IS
  'Cómo la busca la gente, no cómo la llamamos nosotros.';
COMMENT ON COLUMN site_pages.weight IS
  'Empuja hacia arriba lo que más se busca. Mayor = antes.';

INSERT INTO site_pages (slug, title, excerpt, destination, keywords, weight) VALUES
  ('hoja-de-vida', 'Crear mi hoja de vida',
   'Ármala en cinco minutos, elige entre nueve diseños y descárgala en PDF. También analiza la que ya tienes.',
   '/hoja-de-vida', 'hoja de vida cv curriculum curriculo resume ats puntaje plantilla formato', 100),
  ('empleo', 'Centro de empleo',
   'Cada paso del proceso con su herramienta: hoja de vida, correo, vacantes y vitrina.',
   '/empleo', 'empleo trabajo buscar trabajo vacantes bolsa de empleo', 90),
  ('ofertas-qf', 'Ofertas para químicos farmacéuticos',
   'Vacantes verificadas en Bogotá, Medellín, Cali y Barranquilla.',
   '/empleo/ofertas-qf', 'ofertas vacantes empleo qf quimico farmaceutico trabajo bogota medellin cali barranquilla', 95),
  ('correos-rrhh', 'Plantillas de correo para recursos humanos',
   'Cinco correos listos: postulación, espontánea, seguimiento, agradecimiento y referido.',
   '/empleo/correos', 'correo email plantilla recursos humanos rrhh postulacion seguimiento', 70),
  ('aula', 'Aula virtual',
   'Los cursos de Edvanta con video, material y seguimiento de tu avance.',
   '/aula', 'aula virtual clases curso campus plataforma estudiar', 85),
  ('talento', 'Vitrina de talento',
   'Publica tus logros y espera a que una empresa te contacte.',
   '/talento', 'talento vitrina perfil portafolio contratenme cazatalentos headhunter', 70),
  ('cursos', 'Cursos profesionales',
   'Catálogo de cursos para químicos farmacéuticos.',
   '/cursos', 'cursos formacion capacitacion estudiar aprender certificado', 85),
  ('cursos-gratis', 'Cursos gratuitos',
   'Más de cien cursos sin costo, revisados uno a uno.',
   '/cursos-gratis', 'cursos gratis gratuitos sin costo libres', 80),
  ('carreras', 'Carreras farmacéuticas',
   'Qué hace cada rol del sector, qué pide y cómo se llega.',
   '/carreras', 'carreras roles cargos perfiles especialidades areas', 75),
  ('competencias', 'Competencias',
   'Qué necesitas aprender y dónde lo vas a usar.',
   '/competencias', 'competencias habilidades skills conocimientos', 70),
  ('rutas', 'Rutas de aprendizaje',
   'Un orden para construir una carrera, no solo acumular cursos.',
   '/rutas', 'rutas ruta aprendizaje plan camino itinerario', 70),
  ('herramientas', 'Herramientas',
   'Calculadoras, plantillas y utilidades para el día a día profesional.',
   '/herramientas', 'herramientas calculadoras plantillas utilidades', 65),
  ('practicas', 'Prácticas profesionales',
   'Cómo prepararte y dónde buscarlas.',
   '/practicas', 'practicas pasantia internado estudiante ultimo semestre', 65),
  ('linkedin', 'Mejorar mi LinkedIn',
   'Guía y textos listos para dejar tu perfil presentable.',
   '/linkedin', 'linkedin perfil red profesional contactos', 60),
  ('noticias', 'Noticias del sector',
   'Lo que pasa en la industria farmacéutica en Colombia.',
   '/noticias', 'noticias actualidad novedades sector industria', 55),
  ('emprendimientos', 'Emprendimiento farmacéutico',
   'Convierte tu conocimiento en un proyecto propio.',
   '/emprendimientos', 'emprendimiento negocio proyecto empresa propia idea', 55),
  ('vocacion', 'Orientación vocacional',
   'Descubre en qué área del sector encajas mejor.',
   '/vocacion', 'vocacion orientacion test que area me conviene no se que hacer', 60),
  ('empresas', 'Edvanta para empresas',
   'Formación para tu equipo y acceso al talento del sector.',
   '/empresas', 'empresas corporativo equipo capacitacion empresarial b2b', 60),
  ('empresas-capacitacion', 'Capacitación para empresas',
   'Forma a tu equipo con evidencia de que lo formaste.',
   '/empresas/capacitacion', 'capacitacion empresa equipo formacion personal induccion', 55),
  ('empresas-talento', 'Reclutar talento',
   'Encuentra químicos farmacéuticos para tu empresa.',
   '/empresas/talento', 'reclutar contratar talento candidatos seleccion buscar personal', 55),
  ('comunidad', 'Comunidad',
   'El grupo de químicos farmacéuticos de Edvanta.',
   '/comunidad', 'comunidad grupo whatsapp red colegas', 50),
  ('articulos', 'Artículos y recursos',
   'Lecturas para aprender y decidir mejor.',
   '/articulos', 'articulos blog lecturas recursos guias', 50)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  destination = EXCLUDED.destination,
  keywords = EXCLUDED.keywords,
  weight = EXCLUDED.weight,
  active = TRUE;

-- ── Índices para que no duela ──────────────────────────────
--
-- Trigramas sobre el texto ya normalizado: sirven igual para el
-- «contiene» que para el parecido, que es lo que perdona las erratas.
--
-- Se crean solo si pg_trgm está instalada. La migración 005 ya la
-- instala, pero una migración que falla deja la API reportando
-- unhealthy, y perder los índices es mucho menos grave que eso.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
    RAISE NOTICE 'pg_trgm no está instalada: se omiten los índices de búsqueda.';
    RETURN;
  END IF;

  CREATE INDEX IF NOT EXISTS idx_courses_busqueda
    ON courses USING gin (ed_normaliza(title) gin_trgm_ops);
  CREATE INDEX IF NOT EXISTS idx_careers_busqueda
    ON careers USING gin (ed_normaliza(name) gin_trgm_ops);
  CREATE INDEX IF NOT EXISTS idx_skills_busqueda
    ON skills USING gin (ed_normaliza(name) gin_trgm_ops);
  CREATE INDEX IF NOT EXISTS idx_site_pages_busqueda
    ON site_pages USING gin (ed_normaliza(title || ' ' || COALESCE(keywords, '')) gin_trgm_ops);
END $$;

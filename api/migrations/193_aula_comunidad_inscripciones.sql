-- ============================================================
--  193_aula_comunidad_inscripciones.sql — Inscripción y encuesta de
--  los grupos de apoyo (/comunidades/:slug#inscripcion)
--
--  Quien entra a un grupo de apoyo deja su nombre, su correo y, si
--  quiere, su WhatsApp, y responde una encuesta corta: quién es, qué le
--  cuesta más y qué quiere aprender. Con eso se preparan los temas del
--  grupo, los artículos, las guías y los cursos.
--
--  Va aparte de `solicitudes` a propósito: allí no hay ningún dato de
--  salud, y aquí sí. El tiempo con el diagnóstico, las dificultades y la
--  pregunta libre son datos sensibles (Ley 1581 de 2012, art. 5 y 6):
--  son opcionales y solo se guardan con la autorización expresa para
--  datos sensibles. La restricción `sin_datos_sensibles_sin_permiso` lo
--  hace cumplir aquí mismo, aunque el servidor ya los descarte.
--
--  Una fila por persona y grupo: si vuelve a inscribirse en el mismo
--  grupo, se actualizan sus respuestas y se suma a `veces`.
-- ============================================================

CREATE TABLE IF NOT EXISTS comunidad_inscripciones (
  id                      BIGSERIAL PRIMARY KEY,
  comunidad               TEXT NOT NULL CHECK (comunidad ~ '^[a-z0-9-]{2,60}$'),
  nombre                  TEXT NOT NULL CHECK (length(btrim(nombre)) > 0),
  -- Siempre en minúsculas: es la llave para no duplicar a la persona.
  correo                  TEXT NOT NULL CHECK (correo = lower(correo)),
  whatsapp                TEXT,
  pais                    TEXT,
  ciudad                  TEXT,
  rol                     TEXT NOT NULL,
  tiempo                  TEXT,
  dificultades            TEXT[] NOT NULL DEFAULT '{}',
  intereses               TEXT[] NOT NULL DEFAULT '{}',
  formato                 TEXT,
  pregunta                TEXT CHECK (pregunta IS NULL OR length(pregunta) <= 500),
  acepta_tratamiento      BOOLEAN NOT NULL CHECK (acepta_tratamiento),
  acepta_datos_sensibles  BOOLEAN NOT NULL DEFAULT FALSE,
  acepta_novedades        BOOLEAN NOT NULL DEFAULT FALSE,
  origen                  TEXT,
  utm_source              TEXT,
  utm_medium              TEXT,
  utm_campaign            TEXT,
  utm_content             TEXT,
  estado                  TEXT NOT NULL DEFAULT 'nueva' CHECK (estado IN ('nueva', 'en_grupo', 'baja')),
  nota_interna            TEXT CHECK (nota_interna IS NULL OR length(nota_interna) <= 2000),
  veces                   INTEGER NOT NULL DEFAULT 1,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT sin_datos_sensibles_sin_permiso CHECK (
    acepta_datos_sensibles
    OR (tiempo IS NULL AND cardinality(dificultades) = 0 AND pregunta IS NULL)
  ),
  CONSTRAINT una_inscripcion_por_grupo UNIQUE (comunidad, correo)
);

CREATE INDEX IF NOT EXISTS comunidad_inscripciones_por_grupo
  ON comunidad_inscripciones (comunidad, created_at DESC);
CREATE INDEX IF NOT EXISTS comunidad_inscripciones_por_estado
  ON comunidad_inscripciones (estado, created_at DESC);

-- ============================================================
--  049_aula_opiniones_y_comentarios.sql — Las cuatro formas de participar
--
--  Son cuatro cosas distintas y se guardan en cuatro sitios distintos,
--  a propósito. Meterlas en una sola tabla con un campo «tipo» obliga a
--  recordar en cada consulta cuál es cuál, y el día que alguien lo
--  olvida, la nota de una clase acaba contando en la media del curso.
--
--   1. opiniones_curso    — estrellas y reseña del curso entero.
--   2. comentarios_curso  — preguntas públicas en la ficha del curso.
--   3. opiniones_clase    — estrellas de UNA clase. No entran en la
--                           media del curso: son tablas separadas y no
--                           hay ninguna consulta que las sume.
--   4. comentarios_clase  — preguntas dentro de una clase del Aula.
--
--  Un curso puede ser propio (aula_courses) o curado (courses). En vez
--  de guardar un texto tipo «edvanta-14», que no garantiza nada, cada
--  fila apunta a una tabla o a la otra con clave foránea de verdad, y
--  una restricción obliga a que sea exactamente una. Así un curso
--  borrado se lleva sus opiniones y no quedan huérfanas.
-- ============================================================

-- Para poder exigir por esquema que una clase pertenezca al curso que
-- dice. Sin esto, un comentario podría apuntar a la clase de otro curso
-- y solo lo evitaría el cuidado de quien escriba la consulta.
CREATE UNIQUE INDEX IF NOT EXISTS aula_lessons_id_curso_uk
  ON aula_lessons (id, course_id);


-- ─── 1. Opiniones del curso ─────────────────────────────────
CREATE TABLE IF NOT EXISTS opiniones_curso (
  id              BIGSERIAL PRIMARY KEY,
  aula_course_id  BIGINT REFERENCES aula_courses(id) ON DELETE CASCADE,
  curso_id        BIGINT REFERENCES courses(id) ON DELETE CASCADE,
  user_id         BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  puntuacion      SMALLINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  texto           TEXT,
  -- Cómo se relaciona quien opina con el curso. «matriculado» solo lo
  -- pone el servidor cuando hay matrícula de verdad; «declarado» es lo
  -- que dice la persona de un curso externo. Nunca se enseña como
  -- verificado lo que solo está declarado.
  vinculo         TEXT NOT NULL CHECK (vinculo IN ('matriculado', 'declarado')),
  estado          TEXT NOT NULL DEFAULT 'publicada'
                  CHECK (estado IN ('publicada', 'oculta', 'reportada')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT opiniones_curso_un_solo_curso CHECK (
    (aula_course_id IS NOT NULL AND curso_id IS NULL)
    OR (aula_course_id IS NULL AND curso_id IS NOT NULL)
  )
);

-- Una opinión por persona y curso. Da igual si la deja desde la ficha o
-- desde el aula: es la misma fila, así que no se cuenta dos veces.
CREATE UNIQUE INDEX IF NOT EXISTS opiniones_curso_propio_uk
  ON opiniones_curso (user_id, aula_course_id) WHERE aula_course_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS opiniones_curso_curado_uk
  ON opiniones_curso (user_id, curso_id) WHERE curso_id IS NOT NULL;

-- Para la media y el listado de una ficha, sin recorrer toda la tabla.
CREATE INDEX IF NOT EXISTS opiniones_curso_propio_idx
  ON opiniones_curso (aula_course_id, estado, created_at DESC) WHERE aula_course_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS opiniones_curso_curado_idx
  ON opiniones_curso (curso_id, estado, created_at DESC) WHERE curso_id IS NOT NULL;


-- ─── 2. Comentarios públicos de la ficha ────────────────────
CREATE TABLE IF NOT EXISTS comentarios_curso (
  id              BIGSERIAL PRIMARY KEY,
  aula_course_id  BIGINT REFERENCES aula_courses(id) ON DELETE CASCADE,
  curso_id        BIGINT REFERENCES courses(id) ON DELETE CASCADE,
  user_id         BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  cuerpo          TEXT NOT NULL CHECK (length(btrim(cuerpo)) > 0),
  padre_id        BIGINT REFERENCES comentarios_curso(id) ON DELETE CASCADE,
  estado          TEXT NOT NULL DEFAULT 'publicado'
                  CHECK (estado IN ('publicado', 'oculto', 'reportado', 'eliminado')),
  editado_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT comentarios_curso_un_solo_curso CHECK (
    (aula_course_id IS NOT NULL AND curso_id IS NULL)
    OR (aula_course_id IS NULL AND curso_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS comentarios_curso_propio_idx
  ON comentarios_curso (aula_course_id, estado, created_at DESC) WHERE aula_course_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS comentarios_curso_curado_idx
  ON comentarios_curso (curso_id, estado, created_at DESC) WHERE curso_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS comentarios_curso_padre_idx
  ON comentarios_curso (padre_id) WHERE padre_id IS NOT NULL;


-- ─── 3. Opiniones de una clase ──────────────────────────────
--
--  Tabla aparte de las del curso, y sin ninguna consulta que las sume
--  con aquellas: la nota de una clase no toca la media del curso.
CREATE TABLE IF NOT EXISTS opiniones_clase (
  id          BIGSERIAL PRIMARY KEY,
  course_id   BIGINT NOT NULL,
  lesson_id   BIGINT NOT NULL,
  user_id     BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  puntuacion  SMALLINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- La clase TIENE que ser de ese curso. Por esquema, no por confianza.
  CONSTRAINT opiniones_clase_de_su_curso
    FOREIGN KEY (lesson_id, course_id) REFERENCES aula_lessons (id, course_id) ON DELETE CASCADE,
  CONSTRAINT opiniones_clase_una_por_persona UNIQUE (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS opiniones_clase_idx ON opiniones_clase (course_id, lesson_id);


-- ─── 4. Comentarios de una clase ────────────────────────────
CREATE TABLE IF NOT EXISTS comentarios_clase (
  id          BIGSERIAL PRIMARY KEY,
  course_id   BIGINT NOT NULL,
  lesson_id   BIGINT NOT NULL,
  user_id     BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  cuerpo      TEXT NOT NULL CHECK (length(btrim(cuerpo)) > 0),
  padre_id    BIGINT REFERENCES comentarios_clase(id) ON DELETE CASCADE,
  estado      TEXT NOT NULL DEFAULT 'publicado'
              CHECK (estado IN ('publicado', 'oculto', 'reportado', 'eliminado')),
  editado_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT comentarios_clase_de_su_curso
    FOREIGN KEY (lesson_id, course_id) REFERENCES aula_lessons (id, course_id) ON DELETE CASCADE
);

-- Las preguntas de una clase se leen SIEMPRE por curso y clase a la vez.
CREATE INDEX IF NOT EXISTS comentarios_clase_idx
  ON comentarios_clase (course_id, lesson_id, estado, created_at DESC);
CREATE INDEX IF NOT EXISTS comentarios_clase_padre_idx
  ON comentarios_clase (padre_id) WHERE padre_id IS NOT NULL;


-- ─── Reportes ───────────────────────────────────────────────
--
--  Quien modera necesita saber qué se reportó y por qué. Se guarda
--  aparte para no perder el aviso cuando el comentario se edita.
CREATE TABLE IF NOT EXISTS reportes_de_contenido (
  id          BIGSERIAL PRIMARY KEY,
  tipo        TEXT NOT NULL CHECK (tipo IN ('comentario_curso', 'comentario_clase', 'opinion_curso')),
  objeto_id   BIGINT NOT NULL,
  user_id     BIGINT NOT NULL REFERENCES aula_users(id) ON DELETE CASCADE,
  motivo      TEXT,
  resuelto_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Una persona reporta una vez cada cosa; insistir no sube la prioridad.
  CONSTRAINT reportes_uno_por_persona UNIQUE (tipo, objeto_id, user_id)
);

CREATE INDEX IF NOT EXISTS reportes_pendientes_idx
  ON reportes_de_contenido (tipo, created_at DESC) WHERE resuelto_at IS NULL;


COMMENT ON TABLE opiniones_curso IS
  'Estrellas y reseña del curso. Una por persona y curso, se edite desde la ficha o desde el aula.';
COMMENT ON TABLE opiniones_clase IS
  'Estrellas de una clase. NO entran en la media del curso: ninguna consulta las suma con opiniones_curso.';
COMMENT ON COLUMN opiniones_curso.vinculo IS
  'matriculado: hay matrícula real, la pone el servidor. declarado: lo dice la persona en un curso externo.';

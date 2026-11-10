-- ============================================================
--  077_aula_republicaciones_aprobadas.sql — Nuevas versiones aprobadas
--
--  aula_publicaciones_aprobadas (054) sirve para la PRIMERA publicación
--  de un curso sembrado. Cuando una migración cambia las clases de un
--  curso que ya está publicado (por ejemplo, le agrega videos), quien
--  estudia no lo ve hasta que se publique una versión nueva: el aula
--  muestra siempre la foto de la versión publicada.
--
--  Si la dirección académica ya aprobó el cambio, la migración deja aquí
--  una fila. Al arrancar, el servidor publica la versión nueva con el
--  mismo publishCourse del botón (snapshot, validación, versión y
--  bitácora). Si no pasa la validación, no se fuerza: queda el error y
--  la versión anterior sigue publicada.
--
--  Un curso puede tener varias filas a lo largo del tiempo: cada una es
--  UNA nueva versión aprobada.
-- ============================================================

CREATE TABLE IF NOT EXISTS aula_republicaciones_aprobadas (
  id             BIGSERIAL PRIMARY KEY,
  course_id      BIGINT NOT NULL REFERENCES aula_courses(id) ON DELETE CASCADE,
  aprobado_por   TEXT NOT NULL CHECK (length(btrim(aprobado_por)) > 0),
  nota           TEXT NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  publicado_at   TIMESTAMPTZ,
  version_id     BIGINT REFERENCES aula_course_versions(id) ON DELETE SET NULL,
  error          TEXT
);

CREATE INDEX IF NOT EXISTS aula_republicaciones_aprobadas_pendientes_idx
  ON aula_republicaciones_aprobadas (id) WHERE publicado_at IS NULL;

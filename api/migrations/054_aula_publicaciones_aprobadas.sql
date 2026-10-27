-- ============================================================
--  054_aula_publicaciones_aprobadas.sql — Publicar lo ya aprobado
--
--  Los cursos que llegan por migración entran en borrador: publicar es
--  una decisión, y el botón «Publicar» arma el snapshot, lo valida y
--  deja la versión y la bitácora. Eso no se puede hacer desde SQL.
--
--  Cuando la dirección académica ya aprobó un curso antes de subirlo,
--  la migración que lo crea deja aquí una fila. Al arrancar, el servidor
--  publica cada fila pendiente con el mismo publishCourse del botón y
--  apunta el resultado. Si el curso no pasa la validación, no se publica:
--  queda el error escrito y el curso sigue en borrador.
--
--  Una fila es una aprobación de UNA primera publicación. No sirve para
--  republicar cambios: eso sigue siendo cosa del panel.
-- ============================================================

CREATE TABLE IF NOT EXISTS aula_publicaciones_aprobadas (
  id             BIGSERIAL PRIMARY KEY,
  course_id      BIGINT NOT NULL UNIQUE REFERENCES aula_courses(id) ON DELETE CASCADE,
  aprobado_por   TEXT NOT NULL CHECK (length(btrim(aprobado_por)) > 0),
  nota           TEXT NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  publicado_at   TIMESTAMPTZ,
  version_id     BIGINT REFERENCES aula_course_versions(id) ON DELETE SET NULL,
  error          TEXT
);

CREATE INDEX IF NOT EXISTS aula_publicaciones_aprobadas_pendientes_idx
  ON aula_publicaciones_aprobadas (id) WHERE publicado_at IS NULL;

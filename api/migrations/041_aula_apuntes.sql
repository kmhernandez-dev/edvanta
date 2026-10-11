-- ============================================================
--  041_aula_apuntes.sql — Apuntes personales de cada clase
--
--  Un apunte pertenece a la matrícula, no al usuario suelto: así se
--  borra con ella y nadie conserva notas de un curso del que ya salió.
--
--  Son privados y no existe forma de compartirlos. Si algún día se
--  quiere, será una decisión explícita y no un descuido del diseño.
-- ============================================================

CREATE TABLE IF NOT EXISTS aula_notes (
  id             BIGSERIAL PRIMARY KEY,
  enrollment_id  BIGINT NOT NULL REFERENCES aula_enrollments(id) ON DELETE CASCADE,
  lesson_id      BIGINT NOT NULL REFERENCES aula_lessons(id) ON DELETE CASCADE,
  body           TEXT NOT NULL DEFAULT '',
  -- Segundo del video al que corresponde el apunte, cuando se tomó
  -- mientras se veía. Nulo si se escribió sin video delante.
  video_second   INTEGER CHECK (video_second IS NULL OR video_second >= 0),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- Un solo apunte por clase: la persona escribe y reescribe el suyo,
  -- no acumula notas sueltas que luego no sabe ordenar.
  CONSTRAINT aula_notes_una_por_clase UNIQUE (enrollment_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_aula_notes_matricula
  ON aula_notes (enrollment_id, updated_at DESC);

COMMENT ON TABLE aula_notes IS
  'Apuntes privados de cada clase. Se borran con la matrícula.';

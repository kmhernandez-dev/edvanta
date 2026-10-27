-- ============================================================
--  051_aula_solicitudes.sql — Lo que la gente pide por la web
--
--  Tres cosas llegan por los formularios públicos:
--
--   · interes    — «avísenme cuando abra»: un curso o una ruta que aún
--                  no tiene fecha ni precio aprobados.
--   · propuesta  — una institución que quiere conversar sobre formación,
--                  talleres, guías o materiales.
--   · contacto   — una pregunta general.
--
--  Se guardan aquí y se atienden desde el panel del aula. Antes, el
--  único destino era abrir WhatsApp con el mensaje armado: si la persona
--  no lo enviaba, nadie se enteraba, y lo que sí llegaba no quedaba
--  registrado en ninguna parte.
--
--  Datos mínimos a propósito. No hay campos de salud: un formulario de
--  interés no necesita un diagnóstico, y lo que no se guarda no se
--  puede filtrar. La autorización para responder (obligatoria) y la de
--  recibir novedades (opcional) van separadas, como pide la Ley 1581 de protección de datos.
-- ============================================================

CREATE TABLE IF NOT EXISTS solicitudes (
  id                  BIGSERIAL PRIMARY KEY,
  tipo                TEXT NOT NULL CHECK (tipo IN ('interes', 'propuesta', 'contacto')),
  -- Qué pidió: el producto, la ruta o el paquete, por su identificador
  -- en los datos del sitio (src/data/edvanta).
  referencia          TEXT,
  nombre              TEXT NOT NULL CHECK (length(btrim(nombre)) > 0),
  correo              TEXT NOT NULL,
  whatsapp            TEXT,
  rol                 TEXT,
  institucion         TEXT,
  tipo_institucion    TEXT,
  cargo               TEXT,
  mensaje             TEXT CHECK (mensaje IS NULL OR length(mensaje) <= 1500),
  acepta_tratamiento  BOOLEAN NOT NULL CHECK (acepta_tratamiento),
  acepta_novedades    BOOLEAN NOT NULL DEFAULT FALSE,
  origen              TEXT,
  estado              TEXT NOT NULL DEFAULT 'nueva'
                      CHECK (estado IN ('nueva', 'en_conversacion', 'cerrada')),
  nota_interna        TEXT,
  atendida_por        BIGINT REFERENCES aula_users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS solicitudes_estado_idx ON solicitudes (estado, created_at DESC);
CREATE INDEX IF NOT EXISTS solicitudes_referencia_idx ON solicitudes (referencia);

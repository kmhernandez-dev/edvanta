-- ============================================================
--  156 · Programa Contigo Alto Costo
--
--  Registro voluntario de pacientes y cuidadores que viven con una
--  enfermedad de alto costo. Diseñado con la Ley 1581 de 2012 y el
--  Decreto 1377 de 2013:
--
--  * Los datos de salud (condición y medicamento) son sensibles: solo se
--    guardan con autorización expresa, y la base lo impide por
--    restricción si esa autorización falta.
--  * Ninguna actividad se condiciona a entregar datos sensibles: el
--    registro funciona sin condición ni medicamento.
--  * Cada finalidad tiene su propia autorización, revocable.
--  * La bitácora guarda la prueba de cada autorización y revocación.
--  * El token de gestión permite al titular revisar, revocar y pedir la
--    supresión sin crear una cuenta.
-- ============================================================

CREATE TABLE IF NOT EXISTS contigo_alto_costo (
  id                               BIGSERIAL PRIMARY KEY,
  token_gestion                    UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  nombre                           VARCHAR(100) NOT NULL,
  email                            VARCHAR(255) NOT NULL UNIQUE,
  celular                          VARCHAR(40),
  departamento                     VARCHAR(80),
  rol                              VARCHAR(20) NOT NULL CHECK (rol IN ('paciente', 'cuidador')),
  necesidades                      TEXT[] NOT NULL DEFAULT '{}',

  -- Datos sensibles: solo con autorización expresa.
  condicion                        VARCHAR(60),
  medicamento                      VARCHAR(120),
  eps                              VARCHAR(80),

  -- Autorizaciones independientes.
  autoriza_datos_personales        BOOLEAN NOT NULL,
  autoriza_datos_sensibles         BOOLEAN NOT NULL DEFAULT FALSE,
  autoriza_comunicaciones          BOOLEAN NOT NULL DEFAULT FALSE,
  autoriza_contacto_qf             BOOLEAN NOT NULL DEFAULT FALSE,
  autoriza_estudios_anonimizados   BOOLEAN NOT NULL DEFAULT FALSE,
  autoriza_info_terceros           BOOLEAN NOT NULL DEFAULT FALSE,
  version_consentimiento           VARCHAR(20) NOT NULL,

  fuente                           VARCHAR(500),
  utm_source                       VARCHAR(160),
  utm_medium                       VARCHAR(160),
  utm_campaign                     VARCHAR(160),

  creado_en                        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  suprimido_en                     TIMESTAMPTZ,

  CONSTRAINT contigo_ac_requiere_autorizacion CHECK (autoriza_datos_personales OR suprimido_en IS NOT NULL),
  CONSTRAINT contigo_ac_sensibles_con_autorizacion CHECK (
    autoriza_datos_sensibles OR (condicion IS NULL AND medicamento IS NULL AND eps IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS contigo_ac_condicion_idx ON contigo_alto_costo (condicion) WHERE suprimido_en IS NULL;
CREATE INDEX IF NOT EXISTS contigo_ac_creado_idx ON contigo_alto_costo (creado_en DESC);

CREATE TABLE IF NOT EXISTS contigo_alto_costo_autorizaciones (
  id           BIGSERIAL PRIMARY KEY,
  registro_id  BIGINT NOT NULL REFERENCES contigo_alto_costo (id) ON DELETE CASCADE,
  accion       VARCHAR(10) NOT NULL CHECK (accion IN ('otorga', 'revoca')),
  finalidad    VARCHAR(40) NOT NULL,
  version      VARCHAR(20) NOT NULL,
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contigo_ac_aut_registro_idx ON contigo_alto_costo_autorizaciones (registro_id);

COMMENT ON TABLE contigo_alto_costo IS
  'Programa Contigo Alto Costo: registro voluntario con autorizaciones granulares (Ley 1581 de 2012, Decreto 1377 de 2013).';
COMMENT ON TABLE contigo_alto_costo_autorizaciones IS
  'Bitácora de autorizaciones y revocaciones del programa Contigo Alto Costo: prueba de cada consentimiento.';

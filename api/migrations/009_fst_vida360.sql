-- FST Vida 360 - patient portal foundation
-- Clinical use requires legal, clinical, regulatory and security validation.

CREATE TABLE IF NOT EXISTS fst_patient_profiles (
  patient_id BIGINT PRIMARY KEY REFERENCES academia_users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  birth_date DATE,
  sex TEXT,
  gender_identity TEXT,
  country TEXT,
  city TEXT,
  phone TEXT,
  occupation TEXT,
  insurer TEXT,
  emergency_contact JSONB NOT NULL DEFAULT '{}'::jsonb,
  support_person JSONB NOT NULL DEFAULT '{}'::jsonb,
  communication_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  timezone TEXT NOT NULL DEFAULT 'America/Bogota',
  language TEXT NOT NULL DEFAULT 'es',
  onboarding_completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active',
  version INTEGER NOT NULL DEFAULT 1,
  data_provenance TEXT NOT NULL DEFAULT 'patient_reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_consent_versions (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL,
  version TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retired_at TIMESTAMPTZ,
  UNIQUE(code, version)
);

CREATE TABLE IF NOT EXISTS fst_consents (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  consent_version_id BIGINT REFERENCES fst_consent_versions(id),
  code TEXT NOT NULL,
  version TEXT NOT NULL,
  accepted BOOLEAN NOT NULL,
  verification_method TEXT NOT NULL DEFAULT 'authenticated_action',
  source TEXT NOT NULL DEFAULT 'patient_portal',
  accepted_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst_diagnoses (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  diagnosis_date DATE,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'patient_reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_procedures (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  procedure_type TEXT NOT NULL,
  performed_at DATE,
  institution TEXT,
  reason TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  source TEXT NOT NULL DEFAULT 'patient_reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_patient_conditions (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  condition_name TEXT NOT NULL,
  onset_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'patient_reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_healthcare_providers (
  id BIGSERIAL PRIMARY KEY,
  display_name TEXT NOT NULL,
  specialty TEXT,
  institution TEXT,
  contact JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst_patient_providers (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  provider_id BIGINT NOT NULL REFERENCES fst_healthcare_providers(id),
  relationship_type TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_medications (
  id BIGSERIAL PRIMARY KEY,
  generic_name TEXT NOT NULL,
  item_type TEXT NOT NULL DEFAULT 'medication',
  form TEXT,
  manufacturer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst_patient_medications (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  medication_id BIGINT REFERENCES fst_medications(id),
  display_name TEXT NOT NULL,
  active_ingredient TEXT,
  item_type TEXT NOT NULL DEFAULT 'medication',
  concentration TEXT,
  dose TEXT,
  route TEXT,
  frequency TEXT,
  indication TEXT,
  brand TEXT,
  prescriber TEXT,
  started_at DATE,
  ended_at DATE,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'patient_reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_medication_schedules (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  patient_medication_id BIGINT REFERENCES fst_patient_medications(id) ON DELETE CASCADE,
  days_of_week INTEGER[] NOT NULL DEFAULT '{}',
  planned_time TIME,
  dose TEXT,
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  valid_from DATE,
  valid_to DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst_levothyroxine_dose_history (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  patient_medication_id BIGINT REFERENCES fst_patient_medications(id),
  dose_schedule JSONB NOT NULL,
  brand TEXT,
  manufacturer TEXT,
  reason_reported TEXT,
  effective_from DATE NOT NULL,
  effective_to DATE,
  source TEXT NOT NULL DEFAULT 'patient_reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst_adherence_entries (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  patient_medication_id BIGINT REFERENCES fst_patient_medications(id),
  scheduled_at TIMESTAMPTZ,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL,
  reason TEXT,
  actual_time TIMESTAMPTZ,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'patient_reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_symptoms (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS fst_symptom_entries (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  symptom_id BIGINT REFERENCES fst_symptoms(id),
  symptom_name TEXT NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  intensity INTEGER CHECK (intensity BETWEEN 0 AND 10),
  duration_text TEXT,
  impact TEXT,
  perceived_triggers JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'patient_reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_laboratory_definitions (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  default_unit TEXT,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS fst_laboratory_results (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  laboratory_definition_id BIGINT REFERENCES fst_laboratory_definitions(id),
  analyte_name TEXT NOT NULL,
  result_value TEXT NOT NULL,
  unit TEXT,
  reference_low TEXT,
  reference_high TEXT,
  observed_at DATE NOT NULL,
  laboratory_name TEXT,
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'patient_reported',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  supersedes_id BIGINT REFERENCES fst_laboratory_results(id),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_assessment_questions (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  domain TEXT NOT NULL,
  prompt TEXT NOT NULL,
  answer_type TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS fst_biopsychosocial_assessments (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT '1.0',
  status TEXT NOT NULL DEFAULT 'draft',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst_assessment_answers (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  assessment_id BIGINT NOT NULL REFERENCES fst_biopsychosocial_assessments(id) ON DELETE CASCADE,
  question_id BIGINT REFERENCES fst_assessment_questions(id),
  question_code TEXT NOT NULL,
  answer JSONB NOT NULL,
  context TEXT,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst360_domains (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS fst360_domain_results (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  domain_id BIGINT REFERENCES fst360_domains(id),
  domain_code TEXT NOT NULL,
  status TEXT NOT NULL,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  missing_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  next_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  rules_version TEXT NOT NULL DEFAULT '1.0',
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst_patient_goals (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  personal_reason TEXT,
  start_date DATE,
  target_date DATE,
  indicator TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_patient_tasks (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  goal_id BIGINT REFERENCES fst_patient_goals(id),
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  due_at TIMESTAMPTZ,
  recurrence JSONB NOT NULL DEFAULT '{}'::jsonb,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending',
  notification_enabled BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_appointments (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  professional_type TEXT,
  reason TEXT,
  scheduled_at TIMESTAMPTZ,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_consultation_preparations (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  appointment_id BIGINT REFERENCES fst_appointments(id),
  summary JSONB NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst_thyroid_passports (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  selected_sections JSONB NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS fst_uploaded_files (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  file_type TEXT NOT NULL,
  safe_name TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  scan_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS fst_access_grants (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  grantee_type TEXT NOT NULL,
  grantee_reference TEXT NOT NULL,
  scope JSONB NOT NULL,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst_notifications (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT NOT NULL REFERENCES academia_users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fst_audit_logs (
  id BIGSERIAL PRIMARY KEY,
  patient_id BIGINT REFERENCES academia_users(id) ON DELETE SET NULL,
  actor_user_id BIGINT REFERENCES academia_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Versioned read model used for MVP autosave. It is not the long-term source
-- for interoperable clinical records; domain tables above remain the target.
CREATE TABLE IF NOT EXISTS fst_portal_states (
  patient_id BIGINT PRIMARY KEY REFERENCES academia_users(id) ON DELETE CASCADE,
  schema_version INTEGER NOT NULL DEFAULT 1,
  state JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_fst_consents_patient ON fst_consents(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fst_medications_patient ON fst_patient_medications(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_fst_adherence_patient ON fst_adherence_entries(patient_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_fst_symptoms_patient ON fst_symptom_entries(patient_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_fst_labs_patient ON fst_laboratory_results(patient_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_fst_tasks_patient ON fst_patient_tasks(patient_id, status, due_at);
CREATE INDEX IF NOT EXISTS idx_fst_audit_patient ON fst_audit_logs(patient_id, created_at DESC);

INSERT INTO fst_consent_versions (code, version, title, summary, required)
VALUES
  ('service', 'demo-1.0', 'Servicio digital', 'Permite prestar las funciones esenciales del portal.', true),
  ('personal_data', 'demo-1.0', 'Datos personales', 'Permite organizar tu cuenta y preferencias.', true),
  ('health_data', 'demo-1.0', 'Datos sensibles de salud', 'Permite guardar la informacion de salud que decides registrar.', true),
  ('communications', 'demo-1.0', 'Comunicaciones y recordatorios', 'Permite recordatorios y mensajes operativos.', false),
  ('professional_sharing', 'demo-1.0', 'Compartir con profesionales', 'Permite compartir solo la informacion que autorices.', false),
  ('quality_research', 'demo-1.0', 'Calidad e investigacion anonimizada', 'Uso opcional de informacion anonimizada.', false),
  ('commercial', 'demo-1.0', 'Informacion comercial', 'Permite recibir informacion de productos y servicios.', false)
ON CONFLICT (code, version) DO NOTHING;

INSERT INTO fst360_domains (code, display_name, description)
VALUES
  ('pharmacotherapy', 'Farmacoterapia', 'Organizacion de medicamentos, horarios y continuidad.'),
  ('symptoms_function', 'Sintomas y funcionamiento', 'Registro de sintomas e impacto cotidiano.'),
  ('emotional', 'Experiencia emocional', 'Carga emocional y confianza para gestionar el proceso.'),
  ('social_access', 'Acceso y entorno social', 'Acceso a medicamentos, controles y red de apoyo.'),
  ('self_management', 'Autogestion', 'Comprension, metas, tareas y preparacion de consultas.')
ON CONFLICT (code) DO NOTHING;


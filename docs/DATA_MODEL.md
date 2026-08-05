# Modelo de datos de FST Vida 360

## Principios

- `academia_users.id` es la identidad actual y `patient_id` delimita la propiedad.
- Las tablas clinicas conservan historial, procedencia, version y eliminacion logica.
- Resultados de laboratorio, dosis y consentimientos no se sobrescriben.
- `fst_portal_states` es un read-model versionado del MVP para autosave; las entidades normalizadas son el destino autoritativo por dominio.

## Entidades

| Grupo | Entidades principales |
| --- | --- |
| Identidad | `fst_patient_profiles`, `fst_patient_preferences` |
| Consentimiento | `fst_consent_versions`, `fst_consents`, `fst_consent_revocations` |
| Historia | `fst_diagnoses`, `fst_procedures`, `fst_patient_conditions`, `fst_healthcare_providers`, `fst_patient_providers` |
| Farmacoterapia | `fst_medications`, `fst_patient_medications`, `fst_medication_schedules`, `fst_levothyroxine_dose_history`, `fst_adherence_entries` |
| Seguimiento | `fst_symptoms`, `fst_symptom_entries`, `fst_laboratory_definitions`, `fst_laboratory_results` |
| Biopsicosocial | `fst_assessment_questions`, `fst_biopsychosocial_assessments`, `fst_assessment_answers`, `fst360_domains`, `fst360_domain_results` |
| Accion | `fst_patient_goals`, `fst_patient_tasks`, `fst_appointments`, `fst_consultation_preparations` |
| Documentos | `fst_thyroid_passports`, `fst_uploaded_files`, `fst_access_grants`, `fst_notifications` |
| Trazabilidad | `fst_audit_logs`, `fst_portal_states` |

## Historial

Las tablas de dosis, adherencia, sintomas, laboratorios, evaluaciones y resultados 360 son append-only desde el punto de vista clinico. Las correcciones generan una nueva version o registran `supersedes_id`. Los borrados clinicos son logicos y auditables.

## Aislamiento

Todas las consultas de paciente filtran por el `patient_id` obtenido del token. Los endpoints no aceptan identificadores de otro paciente. La futura adopcion de Supabase requerira RLS equivalente a `patient_id = auth.uid()`.


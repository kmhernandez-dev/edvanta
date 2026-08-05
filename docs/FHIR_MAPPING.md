# Mapeo FHIR futuro

No se implementa un servidor FHIR en el MVP.

| Entidad interna | Recurso futuro | Campos equivalentes | Pendientes |
| --- | --- | --- | --- |
| `fst_patient_profiles` | Patient | name, birthDate, gender, telecom, address | identificadores y extensiones locales |
| `fst_consents` | Consent | status, scope, provision, dateTime | politicas y actor autorizado |
| `fst_patient_conditions` | Condition | code, onset, clinicalStatus | terminologia SNOMED/ICD |
| `fst_procedures` | Procedure | code, performedDateTime, reason | codificacion de cirugia/yodoterapia |
| `fst_patient_medications` | MedicationStatement | medication, dosage, effectivePeriod | adherencia y marca local |
| `fst_laboratory_results` | Observation | code, value, unit, referenceRange, effective | LOINC y unidades UCUM |
| evaluaciones | Questionnaire/Response | item, answer, authored | versiones y terminologias |
| `fst_patient_goals` | Goal | description, target, lifecycleStatus | indicadores locales |
| `fst_appointments` | Appointment | start, participant, reason | profesionales externos |
| archivos/pasaportes | DocumentReference | type, date, content | repositorio y firmas |
| tareas/Mapa 360 | CarePlan | activity, goal, status | revision profesional |


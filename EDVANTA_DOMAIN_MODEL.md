# Edvanta 2.0 - Modelo de dominio

Estado: diseño, no implementado  
Fecha: 2026-08-15

## 1. Objetivo del dominio

Edvanta 2.0 debe responder cual es el siguiente mejor paso profesional de un
quimico farmaceutico. El nucleo no es el curso: es la relacion entre una meta de
carrera, las competencias necesarias, las acciones para desarrollarlas y las
oportunidades donde aplicarlas.

Cadena principal:

```text
Career -> Skill -> Learning -> Practice -> Portfolio
       -> Connection -> Opportunity -> Employment -> Growth
```

## 2. Principios

1. Una sola marca: Edvanta.
2. Carrera y skill son entidades, no etiquetas libres.
3. Un curso se crea una vez y puede servir a varias carreras y rutas.
4. Todo enlace comercial conserva procedencia y atribucion.
5. Las recomendaciones automaticas nunca sustituyen las editoriales.
6. Los datos de salud permanecen separados del perfil profesional.
7. No se publica contenido, empresa, vacante o persona ficticia como real.
8. Toda entidad publica tiene estado editorial y trazabilidad.
9. Las funciones futuras usan `coming_soon`; no simulan actividad inexistente.

## 3. Contextos delimitados

| Contexto | Responsabilidad | Entidades principales |
|---|---|---|
| Identity | Cuenta, sesion y autorizacion | User, IdentityLink, Role |
| Professional Profile | Trayectoria, objetivos y privacidad | UserProfile, UserInterest, UserSkill, UserTool |
| Career Graph | Taxonomia profesional y requisitos | CareerFamily, Career, Skill, CareerSkill |
| Learning | Cursos, rutas y progreso | Course, Provider, LearningPath, Enrollment |
| Content | Articulos, guias y linking | Resource, ResourceRelation, Author |
| Practice | Experiencia guiada y evidencia | Project, ProjectParticipation, PortfolioItem |
| Opportunities | Vacantes y oportunidades verificadas | Opportunity, OpportunityCareer, OpportunitySkill |
| Community | Grupos y conexiones orientadas a objetivos | Group, Membership, Post, Comment |
| Companies | Empresas y participacion B2B | Company, CompanyMember |
| Commerce | Afiliados, productos y atribucion | AffiliateLink, AffiliateClick, Product |
| Recommendations | Siguiente mejor paso | Recommendation, RecommendationReason |
| Administration | Curacion, estados y auditoria | EditorialAssignment, AuditEvent |

Los contextos de salud FST/Vida 360/AtenFarma no forman parte del perfil
profesional publico y mantienen sus propios limites, consentimientos y reglas.

## 4. Identidad y perfil

### User

Representa la identidad autenticada, no el perfil visible.

Campos conceptuales:

- `id`
- `auth_subject`
- `email`
- `status`
- `created_at`
- `last_seen_at`

### IdentityLink

Permite vincular de manera verificable cuentas heredadas sin mover contrasenas.

- `user_id`
- `provider`: `supabase`, `legacy_academia`, futuro
- `provider_subject`
- `verified_at`
- `metadata`

### UserProfile

- `user_id`
- `display_name`
- `headline`
- `country_id`
- `city`
- `education_status`
- `graduation_year`
- `experience_level`
- `current_role`
- `bio`
- `linkedin_url`
- `portfolio_url`
- `job_search_status`
- `profile_visibility`: `private`, `members`, `recruiters`, `public`
- `open_to_work`
- `open_to_projects`
- `open_to_research`
- `open_to_mentoring`
- `open_to_product_testing`
- `onboarding_status`
- `completion_percent`

`email`, datos clinicos, respuestas privadas y consentimientos no se muestran en
el perfil publico.

### Preferencias profesionales

- `UserCareerInterest`
- `UserSkill`
- `UserTool`
- `UserLanguage`
- `UserGoal`
- `SavedCourse`
- `SavedResource`

Cada relacion conserva nivel, fuente y fecha. Una autoevaluacion y una evidencia
verificada no tienen el mismo peso.

## 5. Grafo profesional

### CareerFamily

Agrupa carreras navegables. Ejemplos MVP:

- Quality & Compliance
- Manufacturing
- Research & Development
- Regulatory Affairs
- Pharmacovigilance & Safety
- Clinical Research
- Medical Affairs
- Cosmetic Science
- Clinical & Hospital Pharmacy
- Supply Chain
- Data & AI for Pharma

Campos:

- `id`, `slug`, `name`, `description`
- `status`: `draft`, `published`, `archived`
- `sort_order`, `seo_title`, `seo_description`

### Career

Una carrera es un rol o direccion profesional explorable. No es una categoria de
curso.

- `id`, `family_id`, `slug`, `name`
- `summary`, `what_it_is`, `what_you_do`, `where_you_work`
- `recommended_profile`, `experience_notes`
- `status`, `featured`, `coming_soon`
- `seo_title`, `seo_description`
- `published_at`, `verified_at`

Primeras carreras MVP:

1. Quality Assurance
2. Quality Control
3. Validaciones farmaceuticas
4. Regulatory Affairs
5. Farmacovigilancia
6. Produccion farmaceutica
7. Investigacion y Desarrollo
8. Formulacion cosmetica
9. Medical Affairs
10. Data & Pharma
11. AI & Pharma

### Skill

Competencia reusable y administrable.

- `id`, `slug`, `name`
- `skill_type`: `knowledge`, `technical`, `tool`, `regulation`, `soft_skill`
- `description`
- `parent_skill_id` opcional
- `status`, `verified_at`

Ejemplos: GMP, CAPA, desviaciones, auditorias, QRM, data integrity, Excel,
Power BI, validacion analitica, MedDRA y medical writing.

### CareerSkill

Relacion many-to-many:

- `career_id`
- `skill_id`
- `importance`: 1-5
- `level_required`: `awareness`, `foundation`, `working`, `advanced`, `expert`
- `is_core`
- `priority`
- `description`
- `source`

## 6. Aprendizaje

### Provider

- `id`, `slug`, `name`, `website`
- `provider_type`
- `status`
- `affiliate_program_status`
- `last_verified_at`

### Course

Reutiliza y amplia el modelo existente:

- `id`, `slug`, `title`
- `provider_id`, `provider_course_id`
- `short_description`, `full_description`
- `language`, `level`, `duration`, `format`
- `certificate_available`, `certificate_included`
- `price_type`, precio informativo y moneda
- `image_url`, `status`, `featured`
- `source`, `last_verified_at`

Rating, reviews, estudiantes y precio solo se muestran si existe fuente y fecha
de verificacion. No se inventan.

### CourseSkill

- `course_id`
- `skill_id`
- `coverage_level`: 1-5
- `relevance`: 1-100
- `primary_skill`
- `source`: `editorial`, `imported`, `inferred`
- `review_status`

### CareerCourseEditorial

Override editorial opcional:

- `career_id`, `course_id`
- `priority`
- `reason`
- `status`

La recomendacion base se infiere por skills, pero un editor puede promover,
ocultar o explicar un curso en una carrera.

### LearningPath

- `id`, `slug`, `title`, `description`
- `career_id` opcional
- `audience`, `level`, `estimated_duration`
- `status`, `featured`, `version`

### LearningPathStep

- `learning_path_id`, `position`
- `title`, `description`
- `skill_id` opcional
- `project_id` opcional
- `is_optional`
- `completion_rule`

Un paso relaciona varios cursos y recursos mediante tablas puente. No se guardan
arrays de IDs en una columna como modelo definitivo.

### Seed de ruta: Quality Assurance desde cero

El modelo debe soportar, sin exigir que todos los modulos esten activos desde el
primer release:

1. Industria farmaceutica.
2. GMP.
3. Quality Management Systems.
4. Documentacion.
5. Desviaciones.
6. CAPA.
7. Change Control.
8. Quality Risk Management.
9. Auditorias.
10. Validaciones.
11. Data Integrity.
12. Excel / Power BI.
13. CV orientado a QA.
14. Entrevista QA.
15. Vacantes verificadas.

Los pasos 13-15 pueden enlazar herramientas y oportunidades en vez de cursos.
Los modulos aun no construidos usan status `coming_soon` y no simulan progreso.

### Progreso

- `UserLearningPath`
- `UserLearningPathStep`
- `UserCourseState`

El progreso propio de proveedores externos no se afirma como completado si
Edvanta no recibe evidencia. Los estados validos incluyen `saved`, `started`,
`self_reported_completed` y `verified_completed`.

## 7. Recursos e internal linking

### Resource

- `id`, `slug`, `type`, `title`, `excerpt`, `content`
- `author_id`, `status`, `published_at`, `updated_at`
- `seo_title`, `seo_description`, `canonical_url`
- `source_url`, `last_verified_at`

Tipos: article, guide, template, news, regulation, case, tutorial, glossary y
research.

Relaciones:

- `ResourceCareer`
- `ResourceSkill`
- `ResourceCourse`
- `ResourceLearningPath`
- `ResourceOpportunity`
- `ResourceProject`

Esto permite que un articulo como "Como entrar en Quality Assurance" muestre
acciones contextuales reales sin enlaces hardcodeados en el componente.

## 8. Practica y portafolio

### Project

- `id`, `creator_user_id`, `company_id`
- `title`, `description`, `type`
- `difficulty`, `participants_limit`, `remote_type`
- `country_id`, `status`, `verification_status`

Tipos: `practice`, `research`, `startup`, `industry`, `challenge`, `innovation`.

### PortfolioItem

- `user_id`, `project_id`
- `title`, `description`, `evidence_url`
- `item_type`: `educational`, `professional`
- `status`, `completed_at`, `visibility`

La interfaz debe etiquetar explicitamente los proyectos simulados como practica
educativa y nunca como experiencia laboral.

## 9. Oportunidades

### Opportunity

- `id`, `type`, `title`, `company_id`
- `description`, `country_id`, `city`, `remote_type`
- `experience_level`, `application_url`, `deadline`
- `source`, `source_url`, `status`
- `verified_at`, `expires_at`

Tipos: job, internship, trainee, scholarship, research, project, event,
volunteer, freelance y challenge.

Relaciones:

- `OpportunityCareer`
- `OpportunitySkill`

Una oportunidad vencida o no verificada no se recomienda. El clic de aplicacion
no se presenta como aplicacion completada salvo confirmacion del usuario.

## 10. Comunidad orientada a objetivos

### Group

- `id`, `slug`, `name`, `description`
- `group_type`, `career_id`, `country_id`
- `visibility`, `join_policy`, `status`
- `moderator_user_id`

Tipos: estudio, carrera, proyecto, investigacion, emprendimiento, mentoring,
evento y product testing.

### Post

- `id`, `author_user_id`, `group_id`
- `post_type`, `title`, `body`, `status`
- `created_at`, `moderated_at`

Tipos: oportunidad, empleo, proyecto, investigacion, emprendimiento, producto,
IA, grupo, evento, pregunta, recurso y noticia.

El feed no es el producto principal. Las vistas priorizan grupos, proyectos y
acciones vinculadas al objetivo del usuario.

## 11. Empresas

### Company

- `id`, `slug`, `name`, `logo_url`, `website`
- `description`, `industry_sector_id`, `country_id`, `size`
- `verification_status`, `verified_at`

### CompanyMember

Relaciona una cuenta con una empresa y un rol operativo. La verificacion de
dominio o evidencia es obligatoria antes de permitir publicar empleo o buscar
talento.

## 12. Afiliados y productos

### AffiliateLink

- `id`, `provider_id`, `course_id`
- `original_url`, `affiliate_url`
- `campaign`, `utm_source`, `utm_medium`, `utm_campaign`
- `sub_id`, `coupon`
- `status`, `first_seen_at`, `last_verified_at`, `source_page`

### AffiliateClick

- `affiliate_link_id`, `user_id` opcional
- `anonymous_session_id` opcional
- `source_page`, `career_id`, `learning_path_id`, `skill_id`
- `consent_state`, `clicked_at`

No se modifica el destino del enlace durante la importacion. Primero se captura,
normaliza y compara.

## 13. Recomendaciones

### Recommendation

- `user_id`
- `recommendation_type`: career, skill, path, course, project, opportunity
- `target_id`
- `score`
- `reason_summary`
- `source`: editorial, rules, ai
- `model_version` o `ruleset_version`
- `status`, `created_at`, `expires_at`

Orden de prioridad:

1. Curacion editorial.
2. Coincidencia por skills.
3. Progreso y objetivo del usuario.
4. Calidad/verificacion del activo.
5. Popularidad agregada y no manipulable.
6. Personalizacion futura.

La monetizacion no puede ser el unico motivo. Una recomendacion patrocinada se
etiqueta y conserva el contexto profesional.

## 14. Career AI futuro

Entrada:

```json
{
  "profile": {},
  "career_interests": [],
  "skills": [],
  "experience_level": "",
  "preferences": {},
  "career_goal": ""
}
```

Salida persistible:

```json
{
  "recommended_careers": [],
  "reason_summary": "",
  "skill_gaps": [],
  "recommended_paths": [],
  "recommended_courses": [],
  "recommended_projects": []
}
```

No se almacena chain-of-thought. Se guardan reglas, version, señales utilizadas
y una explicacion breve auditable.

## 15. Eventos de dominio

- `UserRegistered`
- `OnboardingCompleted`
- `CareerSelected`
- `SkillSelfAssessed`
- `LearningPathStarted`
- `CourseSaved`
- `AffiliateLinkClicked`
- `ResourceSaved`
- `ProjectJoined`
- `PortfolioItemPublished`
- `OpportunityViewed`
- `GroupJoined`
- `ProfileVisibilityChanged`

Estos eventos no implican que exista una arquitectura event-driven desde el
primer dia. Definen contratos para analitica e integraciones futuras.

## 16. Estados editoriales comunes

- `draft`: visible solo en administracion.
- `review`: pendiente de revision.
- `published`: visible e indexable si corresponde.
- `coming_soon`: visible, no promete funcionalidad activa.
- `archived`: no recomendado, conserva trazabilidad.
- `deprecated`: reemplazado, puede requerir redirect.

## 17. Reutilizacion de activos actuales

| Activo actual | Destino de dominio |
|---|---|
| `courses` PostgreSQL | `Course` existente, ampliado sin recrear IDs |
| `course_clicks` | Base de `AffiliateClick` |
| `featuredCourses` | Seeds editoriales Course-Skill y Career-Course |
| `learningRoutes` | Seeds de `LearningPath` |
| Articulos Markdown | `Resource` con relaciones |
| Academia | Motor de aprendizaje propio y progreso |
| `products`/Hotmart | `Product` + `AffiliateLink` |
| Academia users | Identidad heredada enlazable |
| Supabase Auth | Candidato a identidad canonica |

## 18. Fuera del MVP inicial

- Feed social general.
- Talent search para recruiters.
- Matching automatico de empleo.
- Marketplace abierto a terceros.
- Mentor marketplace.
- Career AI en produccion.
- Product testing con usuarios reales.
- Cientos de paginas SEO generadas automaticamente.

El modelo las soporta, pero no se implementan hasta que existan seguridad,
moderacion, datos y operacion.

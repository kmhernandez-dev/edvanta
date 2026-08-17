# Edvanta 2.0 - Modelo de datos y migracion

Estado: propuesta, sin migraciones ejecutadas  
Fecha: 2026-08-15

## 1. Alcance

Este documento define el modelo relacional para el primer MVP profesional y su
crecimiento. No reemplaza las migraciones existentes ni autoriza mover datos de
salud, usuarios, ordenes o afiliados sin respaldo y rollback.

## 2. Realidad actual

Edvanta usa dos almacenes y dos sistemas de identidad.

### PostgreSQL de la API

- Comercio: `orders`, `courses`, `course_clicks`, `leads`.
- Academia: usuarios, cursos, modulos, clases, progreso, actividades,
  comentarios y likes.
- Salud: tablas Vida 360 y estados FST con prefijo propio.

### Supabase

- Supabase Auth.
- `profiles`, consentimiento, preferencias y tablas personales de FST App.
- RLS basado en `auth.uid()`.

### Decision requerida

Antes de implementar se debe elegir una base autoritativa para el dominio
profesional. Recomendacion:

- Supabase Auth como proveedor canonico de identidad.
- API Express validando JWT Supabase.
- PostgreSQL de la API como base autoritativa del catalogo, comercio y dominio
  profesional en la primera etapa.
- Datos clinicos en su limite actual; nunca se copian al perfil profesional.
- `identity_links` para vincular cuentas de academia tras verificar email/sesion.

Esta opcion evita migrar checkout y catalogo, y permite retirar gradualmente el
JWT heredado. Si se elige Supabase Database para el dominio profesional, las
mismas entidades aplican, pero se deben reescribir acceso, migraciones y RLS.

## 3. Convenciones

- IDs nuevos: UUID cuando se expongan entre servicios; se conservan IDs actuales
  de `courses` y comercio.
- Slugs unicos, inmutables despues de publicar salvo redirect registrado.
- Timestamps en UTC con `TIMESTAMPTZ`.
- Estados mediante `CHECK` o tablas de referencia, no strings arbitrarios.
- `created_by`, `updated_by`, `created_at`, `updated_at` para entidades
  administrables.
- Soft delete solo donde exista una necesidad de auditoria.
- URLs se almacenan completas y validadas.
- Importaciones conservan `source`, `source_id`, `first_seen_at` y
  `last_verified_at`.

## 4. Identidad profesional

### `edvanta_users`

| Campo | Tipo | Regla |
|---|---|---|
| `id` | UUID PK | Identificador interno |
| `auth_subject` | UUID UNIQUE | `sub` del proveedor canonico |
| `email_normalized` | CITEXT UNIQUE | Solo uso privado/operativo |
| `status` | TEXT | active, suspended, deletion_requested, deleted |
| `created_at` | TIMESTAMPTZ | Obligatorio |
| `last_seen_at` | TIMESTAMPTZ | Opcional |

No se guarda password.

### `identity_links`

| Campo | Tipo |
|---|---|
| `id` | UUID PK |
| `user_id` | UUID FK `edvanta_users` |
| `provider` | TEXT |
| `provider_subject` | TEXT |
| `verified_at` | TIMESTAMPTZ |
| `metadata` | JSONB limitado |

Restriccion unica: `(provider, provider_subject)`.

### `professional_profiles`

Tabla separada de `profiles` de salud.

Campos:

- `user_id` UUID PK/FK
- `display_name`, `headline`, `bio`
- `country_id`, `city`
- `education_status`, `graduation_year`, `experience_level`
- `current_role`, `job_search_status`
- `linkedin_url`, `portfolio_url`
- `profile_visibility`
- flags `open_to_*`
- `onboarding_status`, `onboarding_completed_at`
- `completion_percent`
- timestamps

Indices: visibilidad, pais, experiencia y estado de busqueda. El email no se
indexa para busqueda publica.

### Relaciones de perfil

- `user_career_interests(user_id, career_id, priority, source)`
- `user_skills(user_id, skill_id, level, evidence_type, verified_at)`
- `user_tools(user_id, skill_id, level)`
- `user_languages(user_id, language_code, level)`
- `user_goals(id, user_id, goal_type, status, priority, target_date)`

## 5. Taxonomia

### `career_families`

- UUID PK, slug UNIQUE, name, description
- status, sort_order
- SEO y timestamps

### `careers`

- UUID PK, `family_id` FK
- slug UNIQUE, name, summary
- secciones editoriales: `what_it_is`, `what_you_do`, `where_you_work`,
  `recommended_profile`, `experience_notes`
- status, featured, coming_soon
- SEO, publicado/verificado y timestamps

### `skills`

- UUID PK, slug UNIQUE, name
- `skill_type`, description, `parent_skill_id`
- status y timestamps

### `career_skills`

PK compuesta `(career_id, skill_id)`.

- importance SMALLINT 1-5
- level_required
- is_core BOOLEAN
- priority INTEGER
- description
- source y review_status

### Referencias adicionales

- `industry_sectors`
- `product_categories`
- `countries`
- `certifications`
- tablas puente `career_industry_sectors`, `career_product_categories` y
  `career_certifications`

La taxonomia se gestiona desde admin; no se codifica de forma permanente en
React.

## 6. Cursos y proveedores

### Reutilizar `courses`

No crear una segunda tabla de cursos. Agregar de forma compatible:

- `provider_id` FK, manteniendo temporalmente `provider`.
- `source`, `source_id`, `last_verified_at`.
- `editorial_status`.
- `canonical_course_id` para resolver duplicados sin borrarlos.
- `seo_title`, `seo_description`, `canonical_path`.

Antes de establecer `NOT NULL`, se hace backfill y verificacion.

### `providers`

- UUID PK, slug UNIQUE, name, website
- provider_type, affiliate_program_status, status
- last_verified_at

Seeds iniciales: Edutin, Coursera y Udemy. Hotmart es proveedor comercial de
productos; puede existir tambien en `providers` si distribuye cursos.

### `course_skills`

PK `(course_id, skill_id)`.

- coverage_level 1-5
- relevance 1-100
- primary_skill
- source, review_status

### `career_course_editorial`

PK `(career_id, course_id)`.

- priority
- reason
- status

Permite curacion sin duplicar curso y sin sustituir la inferencia por skills.

### `course_aliases`

- `course_id`
- `alias_type`: legacy_slug, provider_code, legacy_path
- `alias_value` UNIQUE

Facilita resolver `/cursos-gratis/:courseId`, codigos SH y slugs sin romper URLs.

## 7. Afiliados

### `affiliate_links`

| Campo | Tipo |
|---|---|
| `id` | UUID PK |
| `provider_id` | UUID FK |
| `course_id` | BIGINT FK nullable |
| `product_id` | TEXT nullable |
| `original_url` | TEXT nullable |
| `affiliate_url` | TEXT NOT NULL |
| `campaign` | TEXT nullable |
| `utm_source` | TEXT nullable |
| `utm_medium` | TEXT nullable |
| `utm_campaign` | TEXT nullable |
| `sub_id` | TEXT nullable |
| `coupon` | TEXT nullable |
| `status` | TEXT |
| `first_seen_at` | TIMESTAMPTZ |
| `last_verified_at` | TIMESTAMPTZ nullable |
| `source_page` | TEXT |
| `url_hash` | TEXT UNIQUE |

`url_hash` se calcula con la URL exacta preservada. No se eliminan parametros
antes de saber si participan en la atribucion.

### Evolucion de `course_clicks`

Agregar de forma nullable:

- `affiliate_link_id`
- `user_id`
- `anonymous_session_id`
- `career_id`, `learning_path_id`, `skill_id`
- `consent_state`

La URL de destino actual se conserva para auditoria.

## 8. Rutas de aprendizaje

### `learning_paths`

- UUID PK, slug UNIQUE, title, description
- `career_id` nullable
- audience, level, estimated_duration
- status, featured, version
- SEO y timestamps

### `learning_path_steps`

- UUID PK, `learning_path_id` FK
- position, title, description
- `skill_id` nullable, `project_id` nullable
- is_optional, completion_rule

Unico `(learning_path_id, position)`.

### Tablas puente

- `learning_path_step_courses(step_id, course_id, priority, is_required)`
- `learning_path_step_resources(step_id, resource_id, priority, is_required)`

### Progreso

- `user_learning_paths(user_id, learning_path_id, status, started_at, completed_at)`
- `user_learning_path_steps(user_id, step_id, status, completed_at, evidence)`
- `saved_courses(user_id, course_id, source_page, saved_at)`
- `user_course_states(user_id, course_id, state, evidence_type, updated_at)`

## 9. Recursos

### `resources`

- UUID PK, slug UNIQUE, type, title, excerpt, content
- author_id, status, published_at, updated_at
- SEO, canonical_url, source_url, last_verified_at
- `legacy_md_path` durante migracion

### Relaciones

- `resource_careers`
- `resource_skills`
- `resource_courses`
- `resource_learning_paths`
- `resource_opportunities`
- `resource_projects`

Cada tabla puente usa PK compuesta y puede guardar `relation_type`, prioridad y
explicacion editorial.

No se elimina Markdown en la primera fase. Se indexa su metadata y se mantiene
como fuente de contenido hasta elegir CMS.

## 10. Proyectos y portafolio

### `projects`

- UUID PK, creator_user_id, company_id
- title, description, type, difficulty
- participants_limit, status, country_id, remote_type
- verification_status y timestamps

### Relaciones

- `project_careers`
- `project_skills`
- `project_participants(project_id, user_id, role, status)`

### `portfolio_items`

- UUID PK, user_id, project_id nullable
- title, description, evidence_url
- item_type educational/professional
- status, visibility, completed_at

## 11. Oportunidades

### `companies`

- UUID PK, slug UNIQUE, name, logo_url, website
- description, industry_sector_id, country_id, size
- verification_status, verified_at

### `company_members`

- company_id, user_id, role, verification_status

### `opportunities`

- UUID PK, type, title, company_id nullable
- description, country_id, city, remote_type
- experience_level, application_url, deadline
- source, source_url, status, verified_at, expires_at

### Relaciones

- `opportunity_careers`
- `opportunity_skills`
- `saved_opportunities`
- `opportunity_events` para view, outbound_click y self_reported_applied

No se crea una tabla de aplicaciones completas mientras Edvanta solo redirija a
sitios externos.

## 12. Comunidad

- `groups`
- `group_careers`
- `group_skills`
- `group_memberships`
- `posts`
- `post_relations`
- `comments`
- `reactions`
- `moderation_actions`
- `reports`

Todos los objetos publicables incluyen status y moderacion. Los grupos de salud
no se mezclan con busqueda profesional sin consentimiento especifico.

## 13. Recomendaciones y analitica

### `recommendations`

- UUID PK, user_id
- recommendation_type, target_type, target_id
- score, reason_summary, source
- ruleset_version/model_version
- status, created_at, expires_at

### `product_events`

- UUID PK, event_name, occurred_at
- user_id nullable, anonymous_session_id nullable
- entity_type, entity_id
- source_page, properties JSONB
- consent_state

No se guardan respuestas clinicas, texto de CV, mensajes privados ni chain of
thought en `properties`.

Indices iniciales:

- `(event_name, occurred_at)`
- `(user_id, occurred_at)`
- `(entity_type, entity_id, occurred_at)`

Definir retencion y agregacion antes de crecer el volumen.

## 14. Administracion y auditoria

- `admin_roles`
- `admin_role_permissions`
- `admin_user_roles`
- `editorial_assignments`
- `audit_events`
- `redirects`

`audit_events` es append-only. Las funciones `SECURITY DEFINER` deben verificar
rol internamente y tener `EXECUTE` revocado a `PUBLIC`.

## 15. Seguridad y privacidad

### Autorizacion

- El frontend nunca es autoridad de rol.
- El API deriva `user_id` del token, no del body.
- Roles y flags administrativos no pueden actualizarse mediante el endpoint de
  perfil.
- Acceso de empresa y recruiter requiere scopes separados.

### Perfil publico

Una vista o endpoint publico expone solo campos permitidos por
`profile_visibility`. Email, ciudad exacta, historial de cuenta y preferencias
privadas quedan fuera.

### Salud

- Prohibido relacionar automaticamente datos FST con perfil, oportunidades o IA
  profesional.
- Consentimiento de salud no equivale a consentimiento de reclutamiento.
- Exportacion y eliminacion respetan cada dominio y su retencion legal.

### Archivos

Cuando se añadan CV/evidencias: bucket privado, URLs firmadas, limites MIME y
tamaño, antivirus, expiracion y autorizacion por propietario.

## 16. Indices de busqueda

Primera fase con PostgreSQL:

- Trigramas y full-text para career, skill, course y resource.
- Indices por status para excluir drafts.
- Busqueda unificada mediante una vista materializada o tabla `search_documents`.

`search_documents`:

- entity_type, entity_id, title, excerpt, slug/path
- searchable_text, status, rank_boost, updated_at

Personas solo entran al indice si su visibilidad lo permite.

## 17. Estrategia de migracion expand/contract

### Fase A: expandir

1. Backup y prueba de restore.
2. Crear tablas nuevas sin cambiar lecturas actuales.
3. Agregar columnas nullable a `courses` y `course_clicks`.
4. Crear permisos y admin en estado interno.

Rollback: eliminar solo objetos nuevos sin dependencias de produccion.

### Fase B: inventariar y reconciliar

1. Importar proveedores.
2. Crear `affiliate_links` desde todas las fuentes, preservando URL exacta.
3. Crear aliases para cursos Edutin y destacados.
4. Marcar posibles duplicados; no fusionar automaticamente.

Rollback: desactivar registros importados por batch_id.

### Fase C: grafo profesional

1. Cargar familias, primeras carreras y skills en draft.
2. Relacionar los ocho cursos destacados editorialmente.
3. Relacionar los 75 cursos externos y 100 Edutin por lotes revisables.
4. Crear rutas MVP.

Rollback: ocultar por status; no afecta catalogo anterior.

### Fase D: doble lectura

1. Las fichas actuales consultan relaciones nuevas cuando existan.
2. Si no existen, usan los datos JS/JSON actuales.
3. Comparar logs y resultados.

Rollback: feature flag a fuente anterior.

### Fase E: identidad y perfil

1. Crear perfil profesional separado.
2. Implementar onboarding.
3. Vincular academia solo con verificacion explicita.
4. Migrar guardados/progreso mediante job idempotente.

Rollback: conservar JWT y tablas de academia durante el periodo acordado.

### Fase F: contract

Solo despues de varios despliegues estables:

- retirar lecturas duplicadas;
- archivar fuentes JS que ya no sean autoritativas;
- mantener redirects y aliases;
- nunca borrar historico comercial requerido.

## 18. Verificaciones de cada migracion

- Conteo antes/despues.
- IDs y slugs duplicados.
- URLs de afiliado byte a byte.
- FK huerfanas.
- Cursos activos sin proveedor.
- Carreras publicadas sin skills core.
- Rutas publicadas sin pasos.
- Enlaces activos sin fecha de verificacion.
- Pruebas de acceso horizontal y roles.
- Build, tests, health, smoke y rollback.

## 19. Decisiones abiertas

1. Base autoritativa final del dominio profesional.
2. Duracion del periodo de convivencia del JWT de academia.
3. CMS o estrategia para Markdown.
4. Taxonomia bilingue y traducciones.
5. Politica de verificacion de oportunidades y empresas.
6. Proveedor de product analytics y retencion.
7. Alcance legal por pais para perfiles de talento.

Estas decisiones deben resolverse antes de una migracion de usuarios o de
publicar perfiles.

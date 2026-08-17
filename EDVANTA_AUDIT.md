# Edvanta 2.0 - Auditoria de producto y arquitectura

Fecha de corte: 2026-08-15  
Repositorio: `kmhernandez-dev/edvanta`  
Rama revisada: `main`  
Commit revisado: `508a45c`  
Estado: Fase 0, solo diagnostico. Este documento no autoriza migraciones destructivas.

## 1. Resumen ejecutivo

Edvanta ya es una plataforma funcional con catalogo educativo, contenido SEO,
rutas, academia, venta de productos digitales, checkout, administracion y dos
espacios de salud. No debe reconstruirse desde cero.

La brecha principal no es falta de contenido. Es falta de un modelo profesional
unificado que conecte carrera, competencias, aprendizaje, practica, portafolio y
oportunidades. Hoy los cursos, rutas, articulos, productos y perfiles viven en
modelos separados y varias relaciones estan codificadas directamente en el
frontend.

La migracion recomendada es incremental:

1. Conservar URLs, catalogos, checkout, contenido y enlaces comerciales.
2. Crear un grafo de dominio `Career -> Skill -> Course/Resource/Project`.
3. Unificar progresivamente identidad y perfil profesional sin mezclar datos de
   salud con datos de empleabilidad.
4. Construir primero exploracion de carreras, perfil, onboarding, ruta y un
   dashboard basico.
5. Incorporar oportunidades y comunidad solo cuando existan fuentes, moderacion
   y operaciones reales.

## 2. Estado del arbol de trabajo

Durante la auditoria se encontraron cambios locales previos que no pertenecen a
Edvanta 2.0 y no se modificaron:

- `src/App.jsx`
- `src/data/articulos.js`
- `public/articulos/articulos_edvanta/calidad-farmaceutica/`
- `src/pages/RecetasFinder.jsx`
- `src/__tests__/`
- `vitest.config.js`

La documentacion de Edvanta 2.0 debe convivir con estos cambios y no asumir que
el ultimo commit representa todo el trabajo local.

## 3. Arquitectura confirmada

| Capa | Implementacion actual | Observacion |
|---|---|---|
| Frontend | React 18.3, JavaScript/JSX | SPA, sin SSR ni prerender confirmado |
| Router | React Router DOM 7.18 | Rutas centralizadas en `src/App.jsx` |
| Build | Vite 8.1 | Build de produccion funcional |
| Estilos | Tailwind CSS 3.4 y CSS global | Varias identidades visuales en el mismo bundle |
| Formularios | React Hook Form + Zod | No se usa de forma uniforme en todos los formularios |
| API | Node 20 + Express 4 | API REST bajo `/api/*` |
| Base principal | PostgreSQL mediante `pg` | Migraciones SQL propias, sin ORM |
| Auth principal nueva | Supabase Auth | Email, Google, perfil y RLS para FST App |
| Auth heredada | JWT propio de academia | Token de siete dias guardado en `localStorage` |
| Pagos | Mercado Pago | Preferencia, webhook y ordenes en backend |
| Email | Resend | Leads, confirmaciones y notificaciones transaccionales |
| Deploy | Docker Compose en Coolify | `web` nginx + `api` Express en red interna |
| Proxy | nginx + Traefik | nginx sirve SPA y reenvia `/api` |
| Analitica | Eventos propios de clic de curso | No hay plataforma completa de product analytics confirmada |
| Contenido | JS, JSON y Markdown | Fuentes duplicadas y parcialmente normalizadas |

## 4. Inventario de paginas y rutas

Se confirmaron 29 componentes de pagina, 71 componentes React y estas rutas de
primer nivel.

| Ruta | Area | Acceso | Tratamiento Edvanta 2.0 |
|---|---|---:|---|
| `/` | Home Edvanta | Publico | Mejorar progresivamente |
| `/cursos` | Catalogo externo | Publico | Conservar y contextualizar por carrera/skill |
| `/cursos/:slug` | Ficha de curso | Publico | Conservar URL y enriquecer relaciones |
| `/cursos/coursera` | Filtro proveedor | Publico | Conservar |
| `/cursos/udemy` | Filtro proveedor | Publico | Conservar |
| `/cursos/edutin` | Filtro proveedor | Publico | Conservar |
| `/cursos-gratis` | Catalogo Edutin estatico | Publico | Conservar durante consolidacion |
| `/cursos-gratis/:courseId` | Ficha Edutin | Publico | Conservar y evitar duplicacion canonica |
| `/rutas/:slug` | Ruta existente | Publico | Reutilizar como precursor de LearningPath |
| `/articulos` | Hub editorial | Publico | Conservar |
| `/articulos/:slug` | Articulo | Publico | Conservar slugs y enriquecer linking interno |
| `/academia` | Academia FST | Publico/miembro | Mantener como producto existente |
| `/academia/curso/:slug` | Curso de academia | Publico/miembro | Mantener |
| `/academia/curso/:slug/clase/:lessonId` | Clase | Miembro | Mantener |
| `/academia/mis-cursos` | Progreso academia | Miembro | Migrar identidad con compatibilidad |
| `/academia/perfil` | Perfil academia | Miembro | No confundir con perfil profesional futuro |
| `/feliz-sin-tiroides` | Vertical educativa de salud | Publico | Mantener aislada del perfil profesional |
| `/enfermedades/:slug` | Contenido de salud | Publico | Mantener |
| `/levotiroxina` | Hub de salud | Publico | Mantener |
| `/nutricion-tiroidea` | Hub de salud | Publico | Mantener |
| `/recurso/levotiroxina` | Lead magnet | Publico | Mantener |
| `/recetas` | Herramienta nutricional | Publico | Mantener |
| `/fst-app/*`, `/mi-espacio/*` | App personal de salud | Miembro | Mantener con aislamiento estricto |
| `/vida-360/*` | Portal de salud | Demo/miembro | Mantener con feature flags |
| `/vida-360-pro*` | Workspace profesional de salud | Publico/interno | Evaluar como producto separado dentro de Edvanta |
| `/atenfarmaclinic*` | Herramientas clinicas | Publico/workspace | Reutilizar contenido, revisar posicionamiento de marca |
| `/admin/*` | Admin Supabase | Admin | Fortalecer autorizacion antes de ampliar |
| `/admin/orders` | Ordenes | Admin por token | Consolidar en admin unico |
| `/admin/academia` | Gestion academia | Admin por token | Consolidar en admin unico |
| Rutas legales | Privacidad, terminos, datos, reembolsos, medico, afiliados | Publico | Conservar y actualizar al nuevo tratamiento de datos |

## 5. Inventario de componentes

### Navegacion y estructura

- `Header`, `Footer`, `Container`, `BrandSwitch`, `BrandGatewaySection`.
- El header actual organiza Inicio, Cursos, Rutas, Articulos, Recursos y
  Ecosistema. Todavia responde a una arquitectura de contenido, no a objetivos
  profesionales.
- Existen navegaciones propias para AtenFarma, FST App y Vida 360.

### Cursos, rutas y conversion

- `CourseCard`, `ExternalCourseCard`, `FeaturedCoursesSection`,
  `AffiliateCourseButton`, `RelatedCourses`, `SearchFilters`.
- `RouteCard`, `LearningRoutesSection`, `LearningPathForm`.
- `CTASection`, `GoalsSection`, `SelectionMethod`, `Transparency`.
- El tracking de clic de curso ya existe y debe reutilizarse.

### Comercio

- `ProductCard`, `ProductModal`, `CartDrawer`, `CartToast`, `PaymentStatus`.
- Los precios del checkout se validan en servidor, una decision correcta que se
  debe conservar.

### Academia y comunidad

- Login, clase en video/texto, actividades, progreso, comentarios y likes.
- Es una base reutilizable para aprendizaje, pero no debe convertirse sin
  moderacion en una red social generica.

### Salud

- Componentes dedicados a FST, FST App, Vida 360 y AtenFarmaClinic.
- Estos dominios manejan o podrian manejar datos sensibles. No deben compartir
  por defecto visibilidad, busqueda, perfil publico o analitica con el dominio de
  carrera.

## 6. Inventario de contenido y activos

| Activo | Cantidad confirmada | Fuente actual |
|---|---:|---|
| Cursos Edutin | 100 | `src/data/courses.js` |
| Cursos Coursera | 42 | `api/data/coursera-udemy-courses.json` |
| Cursos Udemy | 33 | `api/data/coursera-udemy-courses.json` |
| Cursos destacados | 8 | `src/data/featuredCourses.js` |
| Rutas destacadas | 4 | `src/data/featuredCourses.js` |
| Rutas historicas | 4 | `src/data/routes.js` |
| Articulos registrados en frontend | 126 | `src/data/articulos.js` |
| Archivos Markdown | 129 | `public/articulos/articulos_edvanta/` |
| Productos de herramientas | 6 | `src/data/products.js` |
| Ebooks FST | 24 | `src/data/fst.js` |
| Productos AtenFarma | 10 | `src/data/atenfarma.js` |
| Cursos FST enlazados | 8 | `src/data/fst.js` |
| Categorias de herramientas | 6 | `src/data/categories.js` |

Hallazgos de modelado:

- Un mismo curso puede aparecer en el catalogo estatico, destacados, productos,
  articulos y base de datos.
- `skills` existe en la tabla `courses`, pero como `TEXT[]`; no es una entidad
  relacionable ni administrable.
- Categorias, areas profesionales y perfiles se guardan mayormente como strings.
- Los ocho cursos destacados ya contienen contexto, skills, aplicaciones,
  articulos y cursos relacionados. Son el mejor punto de partida para la
  migracion al grafo profesional.

## 7. Afiliados y monetizacion

El escaneo encontro 482 apariciones y 233 URLs comerciales/educativas unicas en
los dominios relevantes. El detalle se conserva en
`EDVANTA_AFFILIATE_INVENTORY.md`.

Fuentes confirmadas:

- Enlaces directos Edutin y un widget con identificador de negocio.
- 42 enlaces Coursera bajo `imp.i384100.net`.
- 33 enlaces Udemy bajo `trk.udemy.com`.
- Enlaces Hotmart `go.hotmart.com` y checkout `pay.hotmart.com`.
- Busquedas de productos Amazon; no se confirmo un tag de afiliado en esas URLs.
- Enlaces comerciales insertados tambien dentro de articulos Markdown.

Riesgo principal: la misma URL puede estar repetida en datos, componentes y
contenido. Ninguna limpieza masiva debe ejecutarse antes de crear
`affiliate_links` y comparar destino, proveedor y pagina de origen.

## 8. SEO actual

| Elemento | Estado confirmado |
|---|---|
| Sitemap | 72 URLs |
| Articulos en sitemap | 39 |
| Articulos registrados | 126 |
| Cursos en sitemap | 8 |
| Rutas en sitemap | 4 |
| Robots | Archivo estatico existente |
| Metadatos base | Definidos en `index.html` |
| Metadatos por pagina | Actualizados en cliente mediante `updatePageSeo` |
| Render server-side | No existe |
| Canonical | Depende de JavaScript para paginas internas |

Brechas:

- 87 articulos registrados no estan representados en el sitemap actual.
- Todas las rutas reciben inicialmente el HTML de la home; crawlers que no
  ejecutan JavaScript pueden ver title, description y canonical incorrectos.
- La ruta 404 del SPA puede responder HTTP 200 desde nginx.
- El catalogo dinamico tiene mas cursos que las ocho fichas del sitemap.
- Faltan decisiones canonicas entre `/cursos/:slug` y
  `/cursos-gratis/:courseId` cuando representan el mismo curso.
- Las nuevas paginas de carrera no deben publicarse masivamente sin contenido
  editorial y validacion de utilidad.

El mapa detallado esta en `EDVANTA_SEO_MIGRATION.md`.

## 9. Datos e identidad

### Sistemas actuales

1. PostgreSQL de la API: ordenes, cursos, clics, leads, academia, comentarios y
   estados de Vida 360/FST.
2. Supabase Auth y PostgreSQL Supabase: perfiles, consentimiento, salud,
   actividad y administracion de FST App.
3. JWT heredado de academia: identidad paralela guardada en `localStorage`.

### Riesgos confirmados antes de ampliar perfiles

- `profiles_update_own` permite actualizar la fila propia completa; el campo
  `role` debe quedar fuera del permiso del usuario.
- `admin_metrics()` es `SECURITY DEFINER` y no verifica explicitamente rol.
- `log_admin_audit()` no verifica explicitamente rol y podria permitir registros
  de auditoria falsos si conserva permiso de ejecucion publico.
- `AdminShell` termina la comprobacion mientras `profile` aun puede ser `null`.
- FST App carga tablas en claves `snake_case`, mientras parte de la UI espera
  claves `camelCase`; se requiere contrato de adaptacion probado.
- El registro Supabase intenta guardar consentimientos inmediatamente aunque la
  confirmacion de email puede no haber creado una sesion valida.
- El perfil profesional futuro no debe reutilizar tablas clinicas ni exponerlas
  en busqueda de talento.

### Decision recomendada

- Adoptar un identificador de usuario canonico basado en Supabase Auth UUID para
  Edvanta 2.0.
- Mantener la academia heredada mientras se crea `identity_links` y un proceso de
  vinculacion verificable.
- Mantener datos profesionales en tablas separadas de salud.
- Hacer que la API valide el JWT canonico; no mover credenciales ni contrasenas.

La decision final de ubicacion de datos debe tomarse antes de la primera
migracion. El modelo propuesto se encuentra en `EDVANTA_DATA_MODEL.md`.

## 10. Backend y operaciones

Capacidades confirmadas:

- Health checks, catalogo y filtros de cursos.
- Importador transaccional con deteccion de duplicados.
- Tracking de clics.
- Checkout Mercado Pago, webhook, ordenes y Resend.
- Autenticacion, progreso, actividades, comentarios y likes de academia.
- Endpoints de estado para Vida 360 y FST App.

Riesgos que deben cerrarse antes de crecer:

- No hay rate limiter global confirmado.
- La creacion de preferencias debe limitar cantidades y frecuencia.
- El webhook debe validar firma de Mercado Pago ademas de consultar el pago.
- Los comentarios publicos necesitan moderacion, limites y proteccion anti-spam.
- El token administrativo no debe aceptarse en query string ni registrarse.
- Los health checks publicos no deben exponer version o detalles internos.
- No hay backup programado confirmado en Coolify para la base principal.
- No hay limites de CPU/memoria configurados para PostgreSQL.
- HTTP y `www` deben redirigir a un unico origen HTTPS canonico.

## 11. Analitica actual y objetivo

La tabla `course_clicks` ya registra curso, proveedor, URL, pagina, referrer y
UTM. Es una base valida, pero no cubre el ciclo profesional.

Eventos MVP recomendados:

- `signup_completed`
- `onboarding_completed`
- `career_viewed`
- `career_selected`
- `skill_viewed`
- `learning_path_started`
- `course_viewed`
- `affiliate_click`
- `resource_saved`
- `profile_completed`

No se debe enviar contenido de salud, respuestas sensibles ni texto libre a una
plataforma analitica. Los identificadores deben ser seudonimos y el tracking no
esencial debe respetar consentimiento.

## 12. Calidad tecnica de la linea base

Resultados del 2026-08-15:

| Verificacion | Resultado |
|---|---|
| `npm run build` | Pasa |
| Bundle principal | 1.627 MB minificado, 404 KB gzip |
| `npm test` | 1 pasa, 1 falla por timeout en `/fst-app` |
| Audit dependencias frontend de produccion | 0 vulnerabilidades |
| Audit dependencias API de produccion | 0 vulnerabilidades |
| Lint | No existe script configurado |
| Typecheck | No aplica: proyecto JavaScript, no TypeScript |

El bundle principal supera ampliamente el umbral de 500 KB. Antes de agregar
Carreras, Oportunidades o Comunidad se debe aplicar lazy loading por dominio y
evitar importar datasets grandes en la home.

## 13. Matriz de brechas para Edvanta 2.0

| Prioridad | Brecha | Impacto | Respuesta |
|---|---|---|---|
| P0 | Permiso de `role` en perfil Supabase | Escalada administrativa | Corregir antes de ampliar usuarios |
| P0 | Dos identidades sin vinculo canonico | Cuentas duplicadas y datos fragmentados | Diseñar `identity_links` y migracion gradual |
| P0 | Sin backup programado confirmado | Riesgo de perdida operativa | Configurar y probar restore |
| P1 | Cursos/skills/carreras no normalizados | Recomendaciones fragiles | Crear grafo de dominio |
| P1 | Enlaces comerciales dispersos | Perdida de atribucion/ingresos | Centralizar sin reescribir destinos |
| P1 | SEO solo cliente y sitemap incompleto | Indexacion inconsistente | Prerender/SSR selectivo y mapa SEO |
| P1 | Test critico de FST App falla | Menor confianza de despliegue | Corregir espera/mocks y contrato de datos |
| P1 | Bundle principal grande | Rendimiento y conversion | Dividir por rutas y dominios |
| P2 | Navegacion centrada en contenido | No comunica carrera profesional | Evolucionar IA progresivamente |
| P2 | Admin fragmentado | Operacion dependiente de codigo | Admin de taxonomias y relaciones |
| P2 | Analitica parcial | No mide progreso profesional | Eventos de producto con consentimiento |
| P3 | Oportunidades/comunidad aun no existen | Vision incompleta | Implementar despues del nucleo Career-Skill |

## 14. Activos que se conservan

- Todas las URLs actuales por defecto.
- Todos los enlaces de afiliado y checkout.
- Catalogo `courses` e importador existente.
- Ocho cursos destacados y cuatro rutas como seed editorial.
- Articulos y Markdown existentes.
- Checkout, ordenes, emails y productos.
- Academia y progreso.
- Herramientas FST, Vida 360 y AtenFarma con limites de dominio.

## 15. Orden de implementacion recomendado

1. Cerrar riesgos P0 de seguridad, backup e identidad.
2. Crear tablas de carreras, skills, afiliados y relaciones sin sustituir las
   lecturas actuales.
3. Importar y reconciliar cursos; no duplicar.
4. Crear `/carreras`, las primeras 11 carreras y rutas MVP en estado borrador.
5. Crear perfil profesional y onboarding, separados de salud.
6. Activar dashboard con un unico siguiente mejor paso.
7. Añadir guardados, progreso de rutas y recomendaciones editoriales.
8. Publicar oportunidades verificadas.
9. Incorporar grupos/proyectos con moderacion y operaciones reales.

## 16. Criterio de salida de Fase 0

La Fase 0 queda documentalmente completa cuando existan y sean revisados:

- `EDVANTA_AUDIT.md`
- `EDVANTA_DOMAIN_MODEL.md`
- `EDVANTA_DATA_MODEL.md`
- `EDVANTA_SEO_MIGRATION.md`
- `EDVANTA_AFFILIATE_INVENTORY.md`
- `EDVANTA_INFORMATION_ARCHITECTURE.md`

Ningun cambio de esquema o interfaz de Edvanta 2.0 debe desplegarse hasta que se
apruebe el alcance del primer MVP y la estrategia de identidad.

# Edvanta 2.0 - Mapa de migracion SEO

Fecha de corte: 2026-08-15
Estado: diseño de migracion; por defecto todas las URLs existentes se conservan.

## 1. Principio rector

La accion por defecto es KEEP. Una URL publicada solo cambia si existe una razon
de producto y SEO documentada. Todo cambio aprobado requiere redirect 301,
canonical actualizado, enlaces internos, sitemap, analitica y monitoreo.

## 2. Inventario confirmado

| Elemento | Cantidad |
|---|---:|
| URLs en sitemap | 72 |
| URLs de articulo en sitemap | 39 |
| Articulos registrados en frontend | 126 |
| Markdown encontrado | 129 |
| Cursos en sitemap | 8 |
| Rutas en sitemap | 4 |
| Articulos registrados ausentes del sitemap | 87 |

La diferencia entre Markdown y articulos registrados se debe revisar como
contenido auxiliar, autores, compendios o archivos no publicados; no se indexa
automaticamente.

## 3. Riesgos actuales

### Metadatos solo en cliente

index.html contiene metadata de la home. Las paginas internas la actualizan con
JavaScript mediante updatePageSeo. Un crawler o preview social que no ejecute la
aplicacion puede recibir title, description, canonical y Open Graph de la home.

Respuesta recomendada: prerender estatico para paginas publicas editoriales o
adoptar SSR de manera gradual. No migrar todo el frontend de una vez.

### Soft 404

nginx entrega index.html a rutas desconocidas y React muestra NotFound. El codigo
HTTP puede seguir siendo 200. Se necesita una estrategia de 404 real en edge o
servidor y noindex en la vista 404.

### Canonicalizacion de origen

HTTP, HTTPS, root y www deben converger en https://edvanta.co mediante 301.
El router HTTP actual sirve contenido y no fuerza la redireccion.

### Sitemap incompleto

Los 87 articulos ausentes solo se agregan despues de validar contenido,
canonical, status editorial, imagen y enlaces internos. No se publican por lote
sin QA.

### Cursos duplicables

Un curso Edutin puede existir en /cursos/:slug y /cursos-gratis/:courseId.
Debe elegirse una canonical por curso y conservar la otra como URL de
compatibilidad o redirect cuando exista equivalencia confirmada.

## 4. Mapa de patrones actuales

| Current pattern | Target | Action | Indexabilidad |
|---|---|---|---|
| / | / | IMPROVE | index |
| /cursos | /cursos | KEEP | index |
| /cursos/:slug | igual | KEEP | index si curso activo y enriquecido |
| /cursos/coursera | igual | KEEP | evaluar canonical a filtro o hub util |
| /cursos/udemy | igual | KEEP | evaluar canonical a filtro o hub util |
| /cursos/edutin | igual | KEEP | evaluar canonical a filtro o hub util |
| /cursos-gratis | igual | KEEP | index |
| /cursos-gratis/:courseId | igual | KEEP | canonical por equivalencia |
| /rutas/:slug | igual | KEEP | index |
| /articulos | igual | KEEP | index |
| /articulos/:slug | igual | KEEP | index segun status |
| /academia | igual | KEEP | index |
| /academia/curso/:slug | igual | KEEP | index si publico |
| /academia/.../clase/:lessonId | igual | KEEP | noindex o index segun profundidad |
| /academia/mis-cursos | igual | KEEP | noindex |
| /academia/perfil | igual | KEEP | noindex |
| /feliz-sin-tiroides | igual | KEEP | index |
| /enfermedades/:slug | igual | KEEP | index con revision medica |
| /levotiroxina | igual | KEEP | index |
| /nutricion-tiroidea | igual | KEEP | index |
| /recurso/levotiroxina | igual | KEEP | index si aporta contenido |
| /recetas | igual | KEEP | index con contenido util |
| /fst-app/* | igual | KEEP | noindex |
| /mi-espacio/* | igual | KEEP | noindex |
| /vida-360/* | igual | KEEP | noindex para vistas privadas/demo |
| /vida-360-pro/workspace | igual | KEEP | noindex |
| /atenfarmaclinic | igual | KEEP | index |
| /atenfarmaclinic/workspace | igual | KEEP | noindex |
| /admin/* | igual | KEEP | noindex y robots deny |
| legales | igual | KEEP | index segun documento |
| * | 404 real | IMPROVE | noindex |

## 5. Nuevas URLs Edvanta 2.0

Estas URLs se añaden, no reemplazan las actuales.

| Target URL | Action | Estado inicial | Requisito |
|---|---|---|---|
| /carreras | ADD | draft | Minimo seis carreras publicables |
| /carreras/quality-assurance | ADD | draft | Contenido people-first completo |
| /carreras/quality-control | ADD | draft | Contenido people-first completo |
| /carreras/validaciones-farmaceuticas | ADD | draft | Contenido people-first completo |
| /carreras/regulatory-affairs | ADD | draft | Contenido people-first completo |
| /carreras/farmacovigilancia | ADD | draft | Contenido people-first completo |
| /carreras/produccion-farmaceutica | ADD | draft | Contenido people-first completo |
| /carreras/investigacion-desarrollo | ADD | draft | Contenido people-first completo |
| /carreras/formulacion-cosmetica | ADD | draft | Contenido people-first completo |
| /carreras/medical-affairs | ADD | draft | Contenido people-first completo |
| /carreras/data-pharma | ADD | draft | Contenido people-first completo |
| /carreras/ai-pharma | ADD | draft | Contenido people-first completo |
| /aprende | ADD | draft | Hub de cursos, rutas y skills |
| /competencias | ADD | draft | Taxonomia administrada |
| /competencias/:slug | ADD | draft | Utilidad real y relaciones |
| /rutas | ADD | draft | Hub de rutas existentes/nuevas |
| /recursos | ADD o KEEP equivalente | draft | Evaluar contenido actual |
| /oportunidades | ADD | noindex/coming soon | Solo con datos verificados |
| /conecta | ADD | noindex/coming soon | Solo con moderacion y grupos reales |
| /empresas | ADD | noindex/coming soon | Solo con perfiles verificados |

## 6. Clusters editoriales propuestos

No son nuevas marcas y no se crean automaticamente.

| Hub propuesto | Accion | Posibles relaciones |
|---|---|---|
| /quimica-farmaceutica | ADD tras auditoria | Carreras y recursos |
| /industria-farmaceutica | ADD tras auditoria | Careers, sectors |
| /calidad-farmaceutica | ADD tras auditoria | QA, QC, QMS, validaciones |
| /validaciones-farmaceuticas | ADD tras auditoria | Career y skills |
| /regulatory-affairs | ADD tras auditoria | Career y recursos |
| /farmacovigilancia | ADD tras auditoria | Career y recursos |
| /produccion-farmaceutica | ADD tras auditoria | Career y skills |
| /investigacion-desarrollo | ADD tras auditoria | Career y proyectos |
| /cosmeticos | ADD tras auditoria | Cosmetic Science |
| /medical-affairs | ADD tras auditoria | Career y recursos |
| /data-pharma | ADD tras auditoria | Skills y cursos |
| /ia-industria-farmaceutica | ADD tras auditoria | AI & Pharma |

Antes de crear un hub se busca una URL equivalente. Si existe, se enriquece y no
se duplica.

## 7. Metadata por plantilla

### Career

- title: Carrera + contexto farmaceutico + Edvanta.
- description: que hace, para quien y siguiente paso.
- canonical: URL propia.
- OG con imagen profesional especifica.
- BreadcrumbList.
- WebPage y, cuando corresponda, Occupation con datos verificables.

### Course

- Course schema solo con datos reales.
- Provider y tipo de acceso visibles.
- No publicar rating, reviews o estudiantes sin fuente.
- Disclosure de afiliado cercano a la CTA.
- Enlaces a careers, skills, path y resources.

### Learning Path

- ItemList para pasos publicos.
- No declarar certificado propio si lo emite un tercero.
- Explicar criterio editorial.

### Resource

- Article o LearningResource.
- Autor real, fechas reales, fuentes y revision.
- Contenido de salud requiere controles editoriales adicionales.

## 8. Reglas de canonical

1. Self-canonical HTTPS sin www.
2. Query de filtros canonicaliza al hub salvo pagina editorial unica.
3. Curso duplicado tiene una sola canonical tras mapping de Course ID.
4. Paginas privadas y admin: noindex, no canonical indexable.
5. 404: noindex y codigo 404.
6. Paginacion conserva URL estable; no infinite scroll como unica navegacion.
7. Slugs no cambian por ajustes menores de titulo.

## 9. Redirect registry

Crear tabla o archivo administrado con:

- source_path
- target_path
- status_code
- reason
- created_at
- verified_at
- owner

Redirects iniciales de infraestructura:

| Source | Target | Codigo |
|---|---|---:|
| http://edvanta.co/* | https://edvanta.co/* | 301 |
| http://www.edvanta.co/* | https://edvanta.co/* | 301 |
| https://www.edvanta.co/* | https://edvanta.co/* | 301 |
| /index-es.html | / | 301 existente |

No se proponen otros redirects de contenido en esta fase.

## 10. Internal linking

Cada recurso puede enlazar Career, Skill, Course, LearningPath, Opportunity y
Project. La interfaz usa modulos contextuales:

- Explorar carrera.
- Ver skill.
- Comenzar ruta.
- Curso recomendado y razon.
- Practicar con proyecto.
- Ver oportunidad verificada.

Evitar bloques automaticos de enlaces por keyword sin revision.

## 11. Sitemap objetivo

Separar cuando el volumen lo requiera:

- sitemap-pages.xml
- sitemap-careers.xml
- sitemap-courses.xml
- sitemap-resources.xml
- sitemap-learning-paths.xml

Excluir admin, cuenta, workspace, filtros y estados coming soon sin contenido.
lastmod se deriva del cambio editorial real, no de cada deploy.

## 12. Plan de entrega SEO

### Paso 1

- Corregir canonical de origen.
- 404 real y noindex.
- Metadata noindex para areas privadas.
- Reconciliar registro de articulos y sitemap.

### Paso 2

- Prerender de home, cursos, rutas, articulos y carreras publicadas.
- Validar HTML sin JavaScript.
- Agregar schema por plantilla.

### Paso 3

- Publicar carreras de una en una.
- Enlazar articulos/cursos existentes.
- Enviar sitemap y monitorear cobertura.

### Paso 4

- Crear hubs solo si hay contenido y demanda.
- Medir CTR, indexacion y conversion a siguiente paso.

## 13. QA por URL

- HTTP 200/301/404 correcto.
- Title unico.
- Description util.
- Canonical correcto.
- Robots correcto.
- Un h1.
- Breadcrumbs.
- OG/Twitter.
- Schema valido.
- Enlaces internos no rotos.
- Imagen existente y alt.
- Mobile y Core Web Vitals.
- Disclosure comercial.
- Fuente y fecha cuando aplique.

## 14. URLs actuales del sitemap

| Current URL | Target URL | Action | Lastmod | Nota |
|---|---|---|---|---|
| https://edvanta.co/ | https://edvanta.co/ | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/feliz-sin-tiroides | https://edvanta.co/feliz-sin-tiroides | KEEP | 2026-08-03 | Conservar slug y revisar metadata |
| https://edvanta.co/atenfarmaclinic | https://edvanta.co/atenfarmaclinic | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/academia | https://edvanta.co/academia | KEEP | 2026-08-03 | Conservar slug y revisar metadata |
| https://edvanta.co/academia/curso/autocuidado-de-la-tiroides | https://edvanta.co/academia/curso/autocuidado-de-la-tiroides | KEEP | 2026-08-03 | Conservar slug y revisar metadata |
| https://edvanta.co/enfermedades/hipotiroidismo | https://edvanta.co/enfermedades/hipotiroidismo | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/enfermedades/hipertiroidismo | https://edvanta.co/enfermedades/hipertiroidismo | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/enfermedades/hashimoto | https://edvanta.co/enfermedades/hashimoto | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/enfermedades/nodulos-tiroideos | https://edvanta.co/enfermedades/nodulos-tiroideos | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/enfermedades/cancer-de-tiroides | https://edvanta.co/enfermedades/cancer-de-tiroides | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/enfermedades/vivir-sin-tiroides | https://edvanta.co/enfermedades/vivir-sin-tiroides | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/enfermedades/salud-metabolica | https://edvanta.co/enfermedades/salud-metabolica | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/levotiroxina | https://edvanta.co/levotiroxina | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/nutricion-tiroidea | https://edvanta.co/nutricion-tiroidea | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos | https://edvanta.co/articulos | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/que-es-un-sistema-de-gestion-de-calidad | https://edvanta.co/articulos/que-es-un-sistema-de-gestion-de-calidad | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-empezar-en-gestion-de-calidad | https://edvanta.co/articulos/como-empezar-en-gestion-de-calidad | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/que-es-power-bi-y-para-que-sirve | https://edvanta.co/articulos/que-es-power-bi-y-para-que-sirve | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/ruta-para-aprender-power-bi-desde-cero | https://edvanta.co/articulos/ruta-para-aprender-power-bi-desde-cero | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/que-es-una-auditoria-y-como-se-realiza | https://edvanta.co/articulos/que-es-una-auditoria-y-como-se-realiza | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/competencias-para-trabajar-como-auditor | https://edvanta.co/articulos/competencias-para-trabajar-como-auditor | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/que-es-la-gestion-ambiental | https://edvanta.co/articulos/que-es-la-gestion-ambiental | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/salidas-laborales-gestion-ambiental | https://edvanta.co/articulos/salidas-laborales-gestion-ambiental | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/que-es-seguridad-y-salud-en-el-trabajo | https://edvanta.co/articulos/que-es-seguridad-y-salud-en-el-trabajo | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/competencias-profesionales-en-sst | https://edvanta.co/articulos/competencias-profesionales-en-sst | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/que-es-la-gestion-de-proyectos | https://edvanta.co/articulos/que-es-la-gestion-de-proyectos | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-iniciar-en-gestion-de-proyectos | https://edvanta.co/articulos/como-iniciar-en-gestion-de-proyectos | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/que-es-lean | https://edvanta.co/articulos/que-es-lean | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/desperdicios-lean | https://edvanta.co/articulos/desperdicios-lean | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/que-es-lean-six-sigma | https://edvanta.co/articulos/que-es-lean-six-sigma | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/metodologia-dmaic | https://edvanta.co/articulos/metodologia-dmaic | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/iso-9001-2015-vs-2026 | https://edvanta.co/articulos/iso-9001-2015-vs-2026 | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-preparar-auditoria-certificacion | https://edvanta.co/articulos/como-preparar-auditoria-certificacion | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/indicadores-kpi-calidad | https://edvanta.co/articulos/indicadores-kpi-calidad | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/gestion-de-riesgos-en-calidad | https://edvanta.co/articulos/gestion-de-riesgos-en-calidad | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/documentacion-sgc-que-si-y-que-no | https://edvanta.co/articulos/documentacion-sgc-que-si-y-que-no | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/ciclo-phva-mejora-continua | https://edvanta.co/articulos/ciclo-phva-mejora-continua | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-estudiar-100-farmacos-en-7-dias | https://edvanta.co/articulos/como-estudiar-100-farmacos-en-7-dias | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-aprender-formulas-quimicas-con-tecnicas-de-estudio | https://edvanta.co/articulos/como-aprender-formulas-quimicas-con-tecnicas-de-estudio | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/metodo-cornell-toma-de-apuntes | https://edvanta.co/articulos/metodo-cornell-toma-de-apuntes | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/repeticion-espaciada-memoria-largo-plazo | https://edvanta.co/articulos/repeticion-espaciada-memoria-largo-plazo | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/mapas-mentales-y-conceptuales-para-estudiar | https://edvanta.co/articulos/mapas-mentales-y-conceptuales-para-estudiar | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/tecnica-feynman-explicar-para-aprender | https://edvanta.co/articulos/tecnica-feynman-explicar-para-aprender | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-estudiar-para-examenes-tipo-test | https://edvanta.co/articulos/como-estudiar-para-examenes-tipo-test | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/tecnicas-de-estudio-basadas-en-neurociencia | https://edvanta.co/articulos/tecnicas-de-estudio-basadas-en-neurociencia | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-ser-auditor-interno-iso-9001 | https://edvanta.co/articulos/como-ser-auditor-interno-iso-9001 | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-ser-analista-de-datos-con-power-bi | https://edvanta.co/articulos/como-ser-analista-de-datos-con-power-bi | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-ser-coordinador-hseq | https://edvanta.co/articulos/como-ser-coordinador-hseq | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-ser-gestor-de-proyectos-sin-experiencia | https://edvanta.co/articulos/como-ser-gestor-de-proyectos-sin-experiencia | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/profesiones-digitales-mas-demandadas-2026 | https://edvanta.co/articulos/profesiones-digitales-mas-demandadas-2026 | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-mejorar-tu-perfil-profesional-con-cursos-gratuitos | https://edvanta.co/articulos/como-mejorar-tu-perfil-profesional-con-cursos-gratuitos | KEEP | 2026-07-17 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/como-tomar-levotiroxina-correctamente | https://edvanta.co/articulos/como-tomar-levotiroxina-correctamente | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/vivir-sin-tiroides | https://edvanta.co/articulos/vivir-sin-tiroides | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/articulos/alimentos-suplementos-levotiroxina | https://edvanta.co/articulos/alimentos-suplementos-levotiroxina | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/cursos/gestion-de-calidad | https://edvanta.co/cursos/gestion-de-calidad | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/cursos/power-bi | https://edvanta.co/cursos/power-bi | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/cursos/auditoria | https://edvanta.co/cursos/auditoria | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/cursos/gestion-ambiental | https://edvanta.co/cursos/gestion-ambiental | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/cursos/seguridad-y-salud-en-el-trabajo | https://edvanta.co/cursos/seguridad-y-salud-en-el-trabajo | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/cursos/gestion-de-proyectos | https://edvanta.co/cursos/gestion-de-proyectos | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/cursos/lean | https://edvanta.co/cursos/lean | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/cursos/lean-six-sigma | https://edvanta.co/cursos/lean-six-sigma | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/rutas/calidad-y-auditoria | https://edvanta.co/rutas/calidad-y-auditoria | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/rutas/datos-y-power-bi | https://edvanta.co/rutas/datos-y-power-bi | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/rutas/seguridad-ambiente-y-sostenibilidad | https://edvanta.co/rutas/seguridad-ambiente-y-sostenibilidad | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/rutas/proyectos-y-mejora-de-procesos | https://edvanta.co/rutas/proyectos-y-mejora-de-procesos | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/privacidad | https://edvanta.co/privacidad | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/tratamiento-de-datos | https://edvanta.co/tratamiento-de-datos | KEEP | 2026-08-03 | Conservar slug y revisar metadata |
| https://edvanta.co/terminos | https://edvanta.co/terminos | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/reembolsos | https://edvanta.co/reembolsos | KEEP | 2026-08-03 | Conservar slug y revisar metadata |
| https://edvanta.co/descargo-medico | https://edvanta.co/descargo-medico | KEEP | 2026-07-15 | Conservar slug y revisar metadata |
| https://edvanta.co/afiliados | https://edvanta.co/afiliados | KEEP | 2026-07-15 | Conservar slug y revisar metadata |

## 15. Articulos registrados ausentes del sitemap

Estas URLs ya existen en el registro del frontend. La accion es conservarlas y
agregarlas al sitemap solo despues de QA editorial/tecnico.

missing=87 unique_articles=126
| Current URL | Action | Fuente | Nota |
|---|---|---|---|
| https://edvanta.co/articulos/infusion-jengibre-curcuma-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/te-verde-tiroides-beneficios-precauciones | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/batido-antiinflamatorio-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/caldo-de-huesos-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/semillas-de-lino-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/aloe-vera-tiroides-digestion | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/magnesio-relajacion-muscular-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/adaptogenos-tiroides-ashwagandha | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/aceites-esenciales-tiroides-mitos | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/vinagre-de-manzana-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/desayunos-compatibles-levotiroxina | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/almuerzos-antiinflamatorios-hipotiroidismo | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/cenas-ligeras-hipotiroidismo | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/snacks-saludables-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/menu-semanal-hipotiroidismo | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/sopas-y-cremas-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/ensaladas-completas-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/proteinas-saludables-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/postres-saludables-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/batch-cooking-tiroides | KEEP + ADD_TO_SITEMAP | fst | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/que-es-atencion-farmaceutica | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/diferencia-prm-rnm | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/conciliacion-medicamentosa | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/atencion-farmaceutica-modelo-minnesota | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/metodo-dader-seguimiento-farmacoterapeutico | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/clasificacion-prm-rnm-ejemplos-clinicos | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/conciliacion-medicamentosa-guia-practica | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/farmacovigilancia-reporte-ram-paso-a-paso | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/entrevista-farmaceutica-tecnicas-comunicacion | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/indicadores-servicio-farmaceutico | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/medicamentos-alto-riesgo-estrategias-seguridad | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/adherencia-terapeutica-intervenciones-efectivas | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/farmacocinetica-clinica-ajuste-de-dosis | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/interacciones-medicamentosas-deteccion-manejo | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/paciente-polidrogado-manejo-integral | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/insuficiencia-renal-ajuste-farmacos | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/insuficiencia-hepatica-ajuste-farmacos | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/farmacos-embarazo-lactancia-seguridad | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/farmacos-pediatricos-dosificacion-segura | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/farmacos-geriatricos-criterios-beers | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/antibioticos-uso-racional-resistencia | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/anticoagulacion-manejo-farmaceutico | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/diabetes-mellitus-seguimiento-farmaceutico | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/hipertension-arterial-intervencion-farmaceutica | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/dislipidemias-manejo-farmacologico | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/dolor-cronico-manejo-farmacologico-seguro | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/salud-mental-psicofarmacos-rol-farmaceutico | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/errores-medicacion-prevencion-sistemas | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/tecnologia-farmacia-clinica-herramientas-digitales | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/atencion-farmaceutica-pacientes-cronico | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/farmacia-comunitaria-servicios-profesionales | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/evidencia-cientifica-farmacia-practica-basada | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/etica-farmaceutica-toma-decisiones-clinicas | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/rol-farmaceutico-fibrosis-quistica | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/estrategias-farmaceuticas-hipertension-arterial | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/entrevista-farmaceutica-claves-comunicacion-clinica | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/gestion-integral-farmacoterapia-fundamentos | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/pharmacotherapy-workup-cipolle-strand-morley | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/plan-cuidados-farmacoterapeutico-diseno-seguimiento | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/problemas-farmacoterapeuticos-identificacion-clasificacion | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/seguridad-medicamento-prevencion-errores-gestion-riesgos | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/stewardship-farmaceutico-proa-optimizacion-antimicrobianos | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/terapia-reemplazo-enzimatico-guia-farmaceutica-lisosomal | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/5-razones-especializarte-atencion-farmaceutica-fibrosis-quistica | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/curso-atencion-farmaceutica-hipertension-arterial | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/curso-entrevista-farmaceutica-avanzada-comunicacion-clinica | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/curso-gestion-integral-farmacoterapia | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/curso-pharmacotherapy-workup-cipolle-strand-morley | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/curso-plan-cuidados-farmacoterapeutico | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/curso-problemas-farmacoterapeuticos | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/curso-seguridad-medicamento-problemas-farmacoterapeuticos | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/curso-stewardship-farmaceutico-proa | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/curso-terapia-reemplazo-enzimatico-enfermedades-lisosomales | KEEP + ADD_TO_SITEMAP | atenfarma | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/iso-9001-explicada | KEEP + ADD_TO_SITEMAP | biblioteca | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/gestionar-no-conformidad | KEEP + ADD_TO_SITEMAP | biblioteca | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/principios-alcoa-integridad-datos | KEEP + ADD_TO_SITEMAP | biblioteca | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/formacion-gratuita-calidad-farmaceutica-fda-oms-ich-ema | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/fda-pharmaceutical-quality-training-modules | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/fda-generic-drugs-forum-2026 | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/who-good-reliance-practices | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/oms-pharmacovigilance-inspection-training | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/who-academy-buenas-practicas-ensayos-clinicos | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/ops-bpm-servicios-de-sangre | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/ops-calidad-buenas-practicas-manufactura | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/ich-q8-q9-q10-training-programme | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/ich-q2r2-q14-training-validacion-analitica | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |
| https://edvanta.co/articulos/ema-regulatory-training-atmp | KEEP + ADD_TO_SITEMAP | edvanta | Validar contenido, canonical e indexabilidad |


## 16. Criterio de salida

- No hay cambio de slug sin redirect aprobado.
- Las 72 URLs actuales conservan respuesta y canonical.
- Los 126 articulos tienen status editorial conocido.
- Se resuelve la diferencia de 87 URLs.
- Paginas privadas tienen noindex.
- 404 responde 404.
- El HTML inicial expone metadata correcta.
- Las nuevas carreras se publican gradualmente.


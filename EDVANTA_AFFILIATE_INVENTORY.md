# Edvanta 2.0 - Inventario de afiliados y enlaces comerciales

Fecha de corte: 2026-08-15
Estado: inventario de solo lectura; ninguna URL fue modificada.

## 1. Objetivo

Preservar atribucion e ingresos durante la migracion. Las URLs se copiaron de
las fuentes actuales y deben compararse byte a byte antes de centralizarlas.

## 2. Resumen confirmado

| Fuente | Registros |
|---|---:|
| Cursos Edutin en catalogo estatico | 100 |
| Cursos Coursera con enlace de afiliado | 42 |
| Cursos Udemy con enlace de afiliado | 33 |
| Cursos destacados Edutin | 8 |
| Ebooks/cursos FST | 24 |
| Productos AtenFarma | 10 |
| Herramientas Edvanta con checkout propio | 6 |
| Apariciones escaneadas en dominios relevantes | 482 |
| URLs unicas escaneadas en esos dominios | 233 |

Dominios observados: edutin.com, affiliate.edutin.com, imp.i384100.net,
trk.udemy.com, go.hotmart.com, pay.hotmart.com, amazon.com y YouTube.

## 3. Fuentes de verdad actuales

| Tipo | Fuente |
|---|---|
| Catalogo Edutin | src/data/courses.js |
| Destacados y rutas | src/data/featuredCourses.js |
| Coursera/Udemy | api/data/coursera-udemy-courses.json y tabla courses |
| FST | src/data/fst.js |
| AtenFarma | src/data/atenfarma.js |
| Herramientas | src/data/products.js + api/lib/catalog.js |
| Enlaces en contenido | Markdown bajo public/articulos/articulos_edvanta |
| Tracking | course_clicks y /api/course-clicks |

## 4. Reglas de migracion

1. No eliminar parametros, codigos o dominios de tracking.
2. No convertir go.hotmart.com en checkout directo ni viceversa.
3. No asumir que todo enlace Edutin directo es afiliado; registrar evidencia.
4. No añadir un tag de Amazon que no exista.
5. Capturar source_page por cada aparicion.
6. Resolver duplicados por proveedor, codigo, URL y titulo sin fusion automatica.
7. Las CTAs futuras leen de AffiliateLink y hacen fallback a la fuente actual.
8. Un enlace desactivado conserva historico y deja de recomendarse.
9. Verificar destino y condiciones sin ejecutar compras.
10. Mostrar disclosure de afiliacion.

## 5. Modelo objetivo

AffiliateLink conserva provider, course/product, URL original, URL afiliada,
campaña, UTMs, sub_id, coupon, status, first_seen_at, last_verified_at,
source_page y url_hash.

AffiliateClick conserva enlace, usuario o sesion anonima, pagina, carrera, ruta,
skill, consentimiento y timestamp.

## 6. Riesgos encontrados

- URLs repetidas en datos, productos y articulos.
- Los destacados reutilizan cursos Edutin; deben compartir Course ID.
- Algunos ebooks tienen Hotmart o checkout sin su par.
- Algunos ebooks no tienen URL comercial configurada.
- El catalogo Edutin estatico aun vive fuera de la tabla courses.
- Los articulos incluyen URLs directas que deben preservarse.
- El widget Edutin contiene un identificador de negocio.

## A. Cursos destacados

| Slug | Curso | Codigo | Categoria | URL exacta |
|---|---|---|---|---|
| gestion-de-calidad | Gestión de calidad | SH-9060 | Calidad y mejora | https://edutin.com/sh-9060 |
| power-bi | Power BI | SH-9086 | Datos y analítica | https://edutin.com/sh-9086 |
| auditoria | Auditoría | SH-9215 | Calidad y cumplimiento | https://edutin.com/sh-9215 |
| gestion-ambiental | Gestión ambiental | SH-13818 | Sostenibilidad | https://edutin.com/sh-13818 |
| seguridad-y-salud-en-el-trabajo | Seguridad y salud en el trabajo | SH-13571 | SST y prevención | https://edutin.com/sh-13571 |
| gestion-de-proyectos | Gestión de proyectos | SH-10262 | Proyectos y ejecución | https://edutin.com/sh-10262 |
| lean | Lean | SH-13568 | Mejora de procesos | https://edutin.com/sh-13568 |
| lean-six-sigma | Lean Six Sigma | SH-10218 | Mejora y datos | https://edutin.com/sh-10218 |

## B. Ebooks y cursos Feliz Sin Tiroides

| ID | Producto | Categoria | URL Hotmart | Checkout |
|---|---|---|---|---|
| fst-recien-diagnosticados-hipotiroidismo | Guía completa para recién diagnosticados con hipotiroidismo | Guía de inicio · Feliz Sin Tiroides | https://go.hotmart.com/C107034583V?dp=1 | https://go.hotmart.com/C107034583V?dp=1 |
| fst-levotiroxina-sin-sorpresas | Levotiroxina sin sorpresas | Tratamiento · Feliz Sin Tiroides | https://go.hotmart.com/X107038343S?dp=1 | https://go.hotmart.com/X107038343S?dp=1 |
| fst-guia-definitiva-hipotiroidismo | Guía definitiva del hipotiroidismo | Guía integral · Feliz Sin Tiroides | https://go.hotmart.com/R107037813O?dp=1 | https://go.hotmart.com/R107037813O?dp=1 |
| fst-insomnio-tiroides | Cómo superar el insomnio en enfermedades tiroideas | Sueño y bienestar · Feliz Sin Tiroides | https://go.hotmart.com/A107036606X?dp=1 | https://go.hotmart.com/A107036606X?dp=1 |
| fst-protocolo-digestivo-21-dias | Desinflama tu estómago en 21 días | Protocolo digestivo · Feliz Sin Tiroides | https://go.hotmart.com/W107039749E?dp=1 | https://go.hotmart.com/W107039749E?dp=1 |
| fst-nutrir-hashimoto | Nutrir tu tiroides: Tiroiditis de Hashimoto | Nutrición tiroidea · Feliz Sin Tiroides | https://go.hotmart.com/M107038625A?dp=1 | https://go.hotmart.com/M107038625A?dp=1 |
| fst-sana-tu-metabolismo | Sana tu metabolismo | Salud metabólica · Feliz Sin Tiroides | https://go.hotmart.com/U107039126K?dp=1 | https://go.hotmart.com/U107039126K?dp=1 |
| fst-caida-cabello-tiroides | Protocolo para la caída del cabello y tiroides | Síntomas y autocuidado · Feliz Sin Tiroides | https://go.hotmart.com/E107034444T?dp=1 | https://go.hotmart.com/E107034444T?dp=1 |
| fst-probioticos | Probióticos | Salud digestiva · Feliz Sin Tiroides | https://go.hotmart.com/C107039605P?dp=1 | https://go.hotmart.com/C107039605P?dp=1 |
| fst-guia-definitiva-hipertiroidismo | Guía definitiva del hipertiroidismo | Guía integral · Feliz Sin Tiroides | https://go.hotmart.com/E107037884A?dp=1 | https://go.hotmart.com/E107037884A?dp=1 |
| fst-coleccion-sana | Colección Bienestar Tiroideo desde 0 | Colección · Feliz Sin Tiroides | https://go.hotmart.com/C99303085S?dp=1 | https://pay.hotmart.com/C99303085S |
| fst-comer-hipotiroidismo | Aprende a Comer con Hipotiroidismo | Guía de alimentación · Feliz Sin Tiroides | https://go.hotmart.com/N100606654K?dp=1 | https://pay.hotmart.com/N100606654K |
| fst-dieta-antiinflamatoria | Aprende a Comer con un Enfoque Antiinflamatorio | Guía de alimentación · Feliz Sin Tiroides | https://go.hotmart.com/O103583638M?dp=1 | https://pay.hotmart.com/O103583638M |
| fst-comer-hipertiroidismo | Aprende a Comer con Hipertiroidismo y Enfermedad de Graves | Guía de alimentación · Feliz Sin Tiroides | https://go.hotmart.com/V100880105F?dp=1 | https://pay.hotmart.com/V100880105F |
| fst-guia-ayunos | Guía completa de Ayunos | Guía · Feliz Sin Tiroides | https://go.hotmart.com/I103583345S?dp=1 | https://pay.hotmart.com/I103583345S |
| fst-yodoterapia | Guía práctica para la Yodoterapia I-131 | Guía · Feliz Sin Tiroides | https://go.hotmart.com/P100879796W?dp=1 | https://pay.hotmart.com/P100879796W |
| fst-diario-hipotiroidismo | Diario de las Emociones para el Hipotiroidismo | Diario · Feliz Sin Tiroides | https://go.hotmart.com/B103582518G?dp=1 | https://pay.hotmart.com/B103582518G |
| fst-diario-hipertiroidismo | Diario de Manejo de Emociones en Hipertiroidismo | Diario · Feliz Sin Tiroides | https://go.hotmart.com/E103583752B?dp=1 | No configurado |
| fst-controlando-niveles | Controlando tus Niveles: Pruebas de Laboratorio y Seguimiento Médico | Guía · Feliz Sin Tiroides | No configurada | No configurado |
| fst-manejo-sintomas | Guía de Manejo de Síntomas | Guía · Feliz Sin Tiroides | No configurada | No configurado |
| fst-vivir-sintiroides | Guía para Vivir Sin Tiroides | Guía · Feliz Sin Tiroides | No configurada | No configurado |
| fst-postoperatorio | Guía Post-operatorio de Tiroides | Guía · Feliz Sin Tiroides | No configurada | No configurado |
| fst-jugos-funcionales | Jugos Digestivos Funcionales | Recetario · Feliz Sin Tiroides | No configurada | No configurado |
| fst-autocuidado | Curso de Autocuidado de la Tiroides | Curso · Feliz Sin Tiroides | https://go.hotmart.com/E104236731U?dp=1 | https://pay.hotmart.com/E104236731U |

## C. Productos AtenFarma

| ID | Producto | Categoria | URL Hotmart |
|---|---|---|---|
| afc-01 | Atención Farmacéutica en Fibrosis Quística | Formación profesional · AtenFarmaClinic | https://go.hotmart.com/A107041181P |
| afc-02 | Atención Farmacéutica en Hipertensión Arterial | Formación profesional · AtenFarmaClinic | https://go.hotmart.com/C107041198W?dp=1 |
| afc-03 | Entrevista Farmacéutica Avanzada | Formación profesional · AtenFarmaClinic | https://go.hotmart.com/N107033004S?dp=1 |
| afc-04 | Fundamentos de la Gestión Integral de la Farmacoterapia | Formación profesional · AtenFarmaClinic | https://go.hotmart.com/E107033125O?dp=1 |
| afc-05 | Pharmacotherapy Workup de Cipolle, Strand y Morley | Formación profesional · AtenFarmaClinic | https://go.hotmart.com/V107032692K?dp=1 |
| afc-06 | Plan de Cuidados Farmacoterapéutico | Formación profesional · AtenFarmaClinic | https://go.hotmart.com/S107033035L?dp=1 |
| afc-07 | Problemas Farmacoterapéuticos | Formación profesional · AtenFarmaClinic | https://go.hotmart.com/O107033642F?dp=1 |
| afc-08 | Seguridad del Medicamento y Problemas Farmacoterapéuticos | Formación profesional · AtenFarmaClinic | https://go.hotmart.com/P107032755V?dp=1 |
| afc-09 | Stewardship Farmacéutico: PROA | Formación profesional · AtenFarmaClinic | https://go.hotmart.com/K107032633H?dp=1 |
| afc-10 | Terapia de Reemplazo Enzimático (TRE): Guía Farmacéutica para Enfermedades de Depósito Lisosomal | Formación profesional · AtenFarmaClinic | https://go.hotmart.com/J107041157J?dp=1 |

## D. Herramientas Edvanta de checkout propio

| ID | Producto | Categoria | Hotmart directo |
|---|---|---|---|
| atencion-farmaceutica | Kit de Atención Farmacéutica Pro | Atención Farmacéutica con enfoque clínico | No; usa checkout propio |
| calidad-farmaceutica | Sistema de Calidad Farmacéutica 360 | Gestión documental, BPM, BPA y auditorías | No; usa checkout propio |
| calidad-auditoria | Pack Calidad, Auditoría y Mejora Continua Pro | ISO 9001, Auditoría, Indicadores y Mejora Continua | No; usa checkout propio |
| calidad-clinica | Pack Calidad Clínica y Seguridad del Paciente | Calidad Clínica, Seguridad del Paciente y Riesgo Clínico | No; usa checkout propio |
| indicadores-dashboards | Suite de Indicadores y Dashboards Pro | KPIs, dashboards y análisis de datos | No; usa checkout propio |
| empleabilidad-farmasalud | Kit de Empleabilidad FarmaSalud | CV, LinkedIn y portafolio profesional | No; usa checkout propio |


## E. Catalogo Edutin completo

| ID | Curso | Categoria | URL exacta |
|---|---|---|---|
| sh-7429 | Farmacología clínica | Salud y Medicina | https://edutin.com/sh-7429 |
| sh-17411 | Soporte vital avanzado ACLS | Salud y Medicina | https://edutin.com/sh-17411 |
| sh-20798 | Prácticas clínicas | Salud y Medicina | https://edutin.com/sh-20798 |
| sh-18231 | Electrocardiograma | Salud y Medicina | https://edutin.com/sh-18231 |
| sh-20799 | Farmacología cardiovascular | Salud y Medicina | https://edutin.com/sh-20799 |
| sh-22858 | Primeros auxilios pediátricos | Salud y Medicina | https://edutin.com/sh-22858 |
| sh-22592 | Enfermería | Salud y Medicina | https://edutin.com/sh-22592 |
| sh-9356 | Nutrición | Salud y Medicina | https://edutin.com/sh-9356 |
| sh-20399 | Endocrinología | Salud y Medicina | https://edutin.com/sh-20399 |
| sh-20634 | Radiología | Salud y Medicina | https://edutin.com/sh-20634 |
| sh-9767 | Nutrición avanzada | Salud y Medicina | https://edutin.com/sh-9767 |
| sh-20398 | Soporte vital avanzado ACLS II | Salud y Medicina | https://edutin.com/sh-20398 |
| sh-22883 | Pediatría | Salud y Medicina | https://edutin.com/sh-22883 |
| sh-22225 | Fisioterapia ortopedia | Salud y Medicina | https://edutin.com/sh-22225 |
| sh-22554 | Escuela de salud | Salud y Medicina | https://edutin.com/sh-22554 |
| sh-22313 | Telesalud y telemedicina | Salud y Medicina | https://edutin.com/sh-22313 |
| sh-20358 | Diabetes | Salud y Medicina | https://edutin.com/sh-20358 |
| sh-23066 | Urgencias obstétricas | Salud y Medicina | https://edutin.com/sh-23066 |
| sh-23069 | Urgencias ginecológicas | Salud y Medicina | https://edutin.com/sh-23069 |
| sh-20359 | Microbiota | Salud y Medicina | https://edutin.com/sh-20359 |
| sh-9768 | Nutrición infantil | Salud y Medicina | https://edutin.com/sh-9768 |
| sh-9086 | Power BI | IA y Datos | https://edutin.com/sh-9086 |
| sh-16658 | Python | IA y Datos | https://edutin.com/sh-16658 |
| sh-16657 | SQL Server | IA y Datos | https://edutin.com/sh-16657 |
| sh-20360 | Análisis de datos | IA y Datos | https://edutin.com/sh-20360 |
| sh-15647 | IA para abastecimiento y compras | IA y Datos | https://edutin.com/sh-15647 |
| sh-15498 | IA para creación de contenido | IA y Datos | https://edutin.com/sh-15498 |
| sh-10117 | Power BI avanzado | IA y Datos | https://edutin.com/sh-10117 |
| sh-22149 | Administrador de bases de datos MySQL | IA y Datos | https://edutin.com/sh-22149 |
| sh-22972 | IA para impuestos y cumplimiento fiscal | IA y Datos | https://edutin.com/sh-22972 |
| sh-15648 | IA para control de inventarios y almacén | IA y Datos | https://edutin.com/sh-15648 |
| sh-14528 | IA para análisis de datos | IA y Datos | https://edutin.com/sh-14528 |
| sh-17245 | IA para gestión documental | IA y Datos | https://edutin.com/sh-17245 |
| sh-22406 | IA para análisis de datos II | IA y Datos | https://edutin.com/sh-22406 |
| sh-22150 | Analista de datos con Power BI | IA y Datos | https://edutin.com/sh-22150 |
| sh-22145 | Desarrollador front end junior | Tecnología | https://edutin.com/sh-22145 |
| sh-22148 | Desarrollador front end con Angular | Tecnología | https://edutin.com/sh-22148 |
| sh-22146 | Desarrollador front end junior II | Tecnología | https://edutin.com/sh-22146 |
| sh-9060 | Gestión de calidad | Gestión Empresarial y Calidad | https://edutin.com/sh-9060 |
| sh-9215 | Auditoría | Gestión Empresarial y Calidad | https://edutin.com/sh-9215 |
| sh-15970 | Gestión del riesgo | Gestión Empresarial y Calidad | https://edutin.com/sh-15970 |
| sh-9948 | Gestión de calidad II | Gestión Empresarial y Calidad | https://edutin.com/sh-9948 |
| sh-10262 | Gestión de proyectos | Gestión Empresarial y Calidad | https://edutin.com/sh-10262 |
| sh-10218 | Lean Six Sigma | Gestión Empresarial y Calidad | https://edutin.com/sh-10218 |
| sh-9949 | Gestión de calidad III | Gestión Empresarial y Calidad | https://edutin.com/sh-9949 |
| sh-22588 | Contabilidad financiera | Gestión Empresarial y Calidad | https://edutin.com/sh-22588 |
| sh-13821 | Auditoría II | Gestión Empresarial y Calidad | https://edutin.com/sh-13821 |
| sh-21034 | Asistente administrativo | Gestión Empresarial y Calidad | https://edutin.com/sh-21034 |
| sh-9984 | Planeación estratégica | Gestión Empresarial y Calidad | https://edutin.com/sh-9984 |
| sh-10220 | Gestión de operaciones | Gestión Empresarial y Calidad | https://edutin.com/sh-10220 |
| sh-9216 | Planeación estratégica II | Gestión Empresarial y Calidad | https://edutin.com/sh-9216 |
| sh-16665 | Comunicación interna en organizaciones | Gestión Empresarial y Calidad | https://edutin.com/sh-16665 |
| sh-9983 | Auditoría III | Gestión Empresarial y Calidad | https://edutin.com/sh-9983 |
| sh-22969 | Gestión del talento humano | Gestión Empresarial y Calidad | https://edutin.com/sh-22969 |
| sh-22970 | Gestión del cambio organizacional | Gestión Empresarial y Calidad | https://edutin.com/sh-22970 |
| sh-15597 | Gestión de calidad IV | Gestión Empresarial y Calidad | https://edutin.com/sh-15597 |
| sh-11166 | CRM | Gestión Empresarial y Calidad | https://edutin.com/sh-11166 |
| sh-23107 | Técnicas de reclutamiento | Gestión Empresarial y Calidad | https://edutin.com/sh-23107 |
| sh-16672 | Storytelling | Marketing | https://edutin.com/sh-16672 |
| sh-22605 | Ventas B2B | Marketing | https://edutin.com/sh-22605 |
| sh-14836 | Marketing digital | Marketing | https://edutin.com/sh-14836 |
| sh-15821 | Buffer | Marketing | https://edutin.com/sh-15821 |
| sh-16674 | Publicidad | Marketing | https://edutin.com/sh-16674 |
| sh-15351 | Marketing digital II | Marketing | https://edutin.com/sh-15351 |
| sh-16669 | Facebook Ads | Marketing | https://edutin.com/sh-16669 |
| sh-15817 | Canva | Marketing | https://edutin.com/sh-15817 |
| sh-16675 | Facebook Ads II | Marketing | https://edutin.com/sh-16675 |
| sh-16671 | Publicidad en redes sociales | Marketing | https://edutin.com/sh-16671 |
| sh-15497 | IA para marketing | Marketing | https://edutin.com/sh-15497 |
| sh-13818 | Gestión ambiental | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-13818 |
| sh-10005 | Logística de transporte | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-10005 |
| sh-13571 | Seguridad y salud en el trabajo | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-13571 |
| sh-7431 | Manejo de sustancias químicas peligrosas | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-7431 |
| sh-11814 | Manejo de materiales peligrosos | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-11814 |
| sh-22143 | Manipulación de alimentos | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-22143 |
| sh-13572 | Prevención de riesgos laborales (PRL) | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-13572 |
| sh-18433 | Derecho ambiental | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-18433 |
| sh-13570 | Manejo de materiales peligrosos II | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-13570 |
| sh-18430 | Responsabilidad social | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-18430 |
| sh-11723 | Logística | Seguridad, Medio Ambiente y Operaciones | https://edutin.com/sh-11723 |
| sh-22459 | Pedagogía infantil y desarrollo psicosocial | Psicología, Educación y Oficios | https://edutin.com/sh-22459 |
| sh-22464 | Estimulación temprana | Psicología, Educación y Oficios | https://edutin.com/sh-22464 |
| sh-22462 | Primera infancia | Psicología, Educación y Oficios | https://edutin.com/sh-22462 |
| sh-22466 | TCC para la ansiedad | Psicología, Educación y Oficios | https://edutin.com/sh-22466 |
| sh-22593 | Maquillaje profesional | Psicología, Educación y Oficios | https://edutin.com/sh-22593 |
| sh-22595 | Estilista | Psicología, Educación y Oficios | https://edutin.com/sh-22595 |
| sh-22467 | TCC para la depresión | Psicología, Educación y Oficios | https://edutin.com/sh-22467 |
| sh-22765 | Asesor jurídico | Legal, Ofimática e Ingeniería | https://edutin.com/sh-22765 |
| sh-10219 | Excel | Legal, Ofimática e Ingeniería | https://edutin.com/sh-10219 |
| sh-22471 | Mecánica de fluidos | Legal, Ofimática e Ingeniería | https://edutin.com/sh-22471 |
| sh-22470 | Revit | Legal, Ofimática e Ingeniería | https://edutin.com/sh-22470 |
| sh-22469 | AutoCAD | Legal, Ofimática e Ingeniería | https://edutin.com/sh-22469 |
| sh-18432 | ArcGIS | Legal, Ofimática e Ingeniería | https://edutin.com/sh-18432 |
| sh-23935 | Inglés básico A1 | Idiomas | https://edutin.com/sh-23935 |
| sh-23936 | Inglés intermedio B1 | Idiomas | https://edutin.com/sh-23936 |
| sh-23937 | Inglés avanzado B2 | Idiomas | https://edutin.com/sh-23937 |
| sh-23938 | Francés básico A1 | Idiomas | https://edutin.com/sh-23938 |
| sh-23939 | Portugués básico A1 | Idiomas | https://edutin.com/sh-23939 |
| sh-11783 | Gestión de calidad V | Gestión Empresarial y Calidad | https://edutin.com/sh-11783 |
| sh-18252 | Gestión de calidad VI | Gestión Empresarial y Calidad | https://edutin.com/sh-18252 |


## F. Catalogo Coursera y Udemy completo

| # | Proveedor | Curso | Area | Nivel | URL de afiliado exacta |
|---:|---|---|---|---|---|
| 1 | coursera | Pharmacokinetics | Farmacología y atención farmacéutica | intermediate | https://imp.i384100.net/PzkdQN |
| 2 | coursera | Clinical Pharmacokinetics: Dosing and Monitoring | Farmacología y atención farmacéutica | intermediate | https://imp.i384100.net/vDb6Ye |
| 3 | coursera | Pharmacotherapy: Understanding Biotechnology Products | Farmacología y atención farmacéutica | intermediate | https://imp.i384100.net/L0rd9Z |
| 4 | coursera | Drug Discovery | Industria farmacéutica | intermediate | https://imp.i384100.net/OY5d7N |
| 5 | coursera | Drug Development | Industria farmacéutica | intermediate | https://imp.i384100.net/R0ad7g |
| 6 | coursera | Drug Discovery and Development | Industria farmacéutica | intermediate | https://imp.i384100.net/NGPyjK |
| 7 | coursera | Drug Development and Regulation | Industria farmacéutica | intermediate | https://imp.i384100.net/MKjdrK |
| 8 | coursera | Drug Safety and Pharmacovigilance | Industria farmacéutica | intermediate | https://imp.i384100.net/KB9dQx |
| 9 | coursera | Drug Utilization: Trends, Determinants and Consequences | Industria farmacéutica | intermediate | https://imp.i384100.net/7Xx0Yy |
| 10 | coursera | Comparative Effectiveness and Real-World Evidence | Industria farmacéutica | intermediate | https://imp.i384100.net/m4byQX |
| 11 | coursera | Pharmacy, Medication and Safety | Farmacología y atención farmacéutica | beginner | https://imp.i384100.net/QYedkA |
| 12 | coursera | Pharmacy: Dosages and Prescriptions Essentials | Farmacología y atención farmacéutica | beginner | https://imp.i384100.net/rEbN5R |
| 13 | coursera | Pharmacy: Syringes, Compounding Medications and Communication | Farmacología y atención farmacéutica | beginner | https://imp.i384100.net/jR26q5 |
| 14 | coursera | Medication Prescribing | Farmacología y atención farmacéutica | intermediate | https://imp.i384100.net/Pzkd5Y |
| 15 | coursera | Antibiotic Stewardship | Medicina y salud | intermediate | https://imp.i384100.net/gRNX0r |
| 16 | coursera | Antibióticos: uso prudente | Medicina y salud | beginner | https://imp.i384100.net/k4b2xN |
| 17 | coursera | The Social Dimensions of Antimicrobial Resistance | Medicina y salud | beginner | https://imp.i384100.net/enBZmj |
| 18 | coursera | Antimicrobial Resistance | Medicina y salud | intermediate | https://imp.i384100.net/aN6GEZ |
| 19 | coursera | Certificado Profesional de Google Data Analytics | Ciencia de datos | beginner | https://imp.i384100.net/VOVDrO |
| 20 | coursera | Certificado Profesional de Análisis Avanzado de Datos de Google | Ciencia de datos | advanced | https://imp.i384100.net/WOKQjA |
| 21 | coursera | Certificado Profesional de Google Business Intelligence | Ciencia de datos | intermediate | https://imp.i384100.net/E0Vdn2 |
| 22 | coursera | Certificado Profesional de Microsoft Power BI Data Analyst | Power BI | intermediate | https://imp.i384100.net/zzqmQr |
| 23 | coursera | Certificado Profesional de Microsoft Business Analyst | Ciencia de datos | intermediate | https://imp.i384100.net/bky1Zv |
| 24 | coursera | Certificado Profesional de IBM Data Analyst | Ciencia de datos | beginner | https://imp.i384100.net/NGPydV |
| 25 | coursera | Especialización en Excel | Excel | beginner | https://imp.i384100.net/B5AdWy |
| 26 | coursera | Especialización en Excel Data Analytics and Visualization | Excel | intermediate | https://imp.i384100.net/4aKnkn |
| 27 | coursera | Certificado Profesional de Gestión de Proyectos de Google | Gestión de proyectos | beginner | https://imp.i384100.net/ZV4jkX |
| 28 | coursera | Certificado Profesional de Microsoft Project Management | Gestión de proyectos | intermediate | https://imp.i384100.net/vDb6Lv |
| 29 | coursera | Especialización Six Sigma Green Belt | ISO y auditoría | intermediate | https://imp.i384100.net/6kqMaq |
| 30 | coursera | Especialización Supply Chain Management | Logística y supply chain | beginner | https://imp.i384100.net/R0adxN |
| 31 | coursera | Certificado Profesional de Google IT Support | Programación | beginner | https://imp.i384100.net/gRNXzA |
| 32 | coursera | Certificado Profesional de Google Digital Marketing & E-commerce | Marketing y ventas | beginner | https://imp.i384100.net/X4Z9PX |
| 33 | coursera | Especialización Patient Safety | Medicina y salud | intermediate | https://imp.i384100.net/yZL6D3 |
| 34 | coursera | Especialización Quality Improvement in Healthcare | Gestión de calidad | intermediate | https://imp.i384100.net/YVom5P |
| 35 | coursera | Especialización Regulatory Compliance | ISO y auditoría | intermediate | https://imp.i384100.net/KB9dRN |
| 36 | coursera | Especialización Healthcare IT | Medicina y salud | intermediate | https://imp.i384100.net/k4b2nL |
| 37 | coursera | Introduction to the Pharmaceutical Industry | Industria farmacéutica | beginner | https://imp.i384100.net/7Xx0Ag |
| 38 | coursera | Especialización Drug Development Product Management | Industria farmacéutica | intermediate | https://imp.i384100.net/m4by6M |
| 39 | coursera | Especialización Drug Development and Pharmacoepidemiology | Industria farmacéutica | intermediate | https://imp.i384100.net/L0rdvM |
| 40 | coursera | Especialización Clinical Trials Operations | Industria farmacéutica | intermediate | https://imp.i384100.net/xJb6x1 |
| 41 | coursera | Especialización Clinical Trials: Good Clinical Practice | Industria farmacéutica | intermediate | https://imp.i384100.net/rEbNvv |
| 42 | coursera | Especialización Clinical Project Management | Gestión de proyectos | intermediate | https://imp.i384100.net/PzkdLe |
| 43 | udemy | ISO 9001:2015 — Interpretación, implementación y auditoría | ISO y auditoría | intermediate | https://trk.udemy.com/9VQa3Y |
| 44 | udemy | ISO 9001:2015 — Implementación de un sistema de gestión de calidad | ISO y auditoría | intermediate | https://trk.udemy.com/rEboxd |
| 45 | udemy | Lean Six Sigma — 4 certificaciones | ISO y auditoría | intermediate | https://trk.udemy.com/jR2Agb |
| 46 | udemy | Foundations of Pharmaceutical Quality Assurance and GMP | Industria farmacéutica | beginner | https://trk.udemy.com/5kLP3o |
| 47 | udemy | Curso de Inteligencia Artificial y ChatGPT | Inteligencia artificial | beginner | https://trk.udemy.com/enBPG6 |
| 48 | udemy | Normas de Correcta Fabricación — GMP | Industria farmacéutica | intermediate | https://trk.udemy.com/aN6Qkq |
| 49 | udemy | Pharmaceutical Quality Control | Industria farmacéutica | intermediate | https://trk.udemy.com/Gbq356 |
| 50 | udemy | Document Control and Good Documentation Practices in GMP | Industria farmacéutica | intermediate | https://trk.udemy.com/1GOQ36 |
| 51 | udemy | Global Drug Regulatory Affairs: A Comprehensive Crash Course | Industria farmacéutica | intermediate | https://trk.udemy.com/JkQyae |
| 52 | udemy | Basic Course in Drug Regulatory Affairs | Industria farmacéutica | beginner | https://trk.udemy.com/ZV43D0 |
| 53 | udemy | US FDA Regulations and New Drug Development | Industria farmacéutica | intermediate | https://trk.udemy.com/gRNkVv |
| 54 | udemy | Certificate Course in Pharmacovigilance | Industria farmacéutica | beginner | https://trk.udemy.com/X4Z3Ay |
| 55 | udemy | Advanced Certification in Pharmacovigilance and Drug Safety | Industria farmacéutica | advanced | https://trk.udemy.com/oNbZ3e |
| 56 | udemy | Certificate Course in Pharmacovigilance: Practical ICSR | Industria farmacéutica | intermediate | https://trk.udemy.com/zzq93x |
| 57 | udemy | Good Clinical Practice: ICH-GCP E6(R2) | Industria farmacéutica | intermediate | https://trk.udemy.com/WOK3aO |
| 58 | udemy | Comprehensive Clinical Research and Pharmacovigilance | Industria farmacéutica | intermediate | https://trk.udemy.com/0GOD7Y |
| 59 | udemy | Introduction to Pharmaceutics and Biopharmaceutics | Farmacología y atención farmacéutica | beginner | https://trk.udemy.com/n4bJ3R |
| 60 | udemy | Statistics, Biostatistics and Data Analysis from Scratch | Ciencia de datos | beginner | https://trk.udemy.com/bky9zm |
| 61 | udemy | Master Claude Code: Agentes de IA | Inteligencia artificial | intermediate | https://trk.udemy.com/2RY9qM |
| 62 | udemy | Claude AI en español | Inteligencia artificial | beginner | https://trk.udemy.com/3kOrxy |
| 63 | udemy | Claude Anthropic | Inteligencia artificial | beginner | https://trk.udemy.com/4aKjDL |
| 64 | udemy | Claude de cero a experto: guía práctica intensiva | Inteligencia artificial | beginner | https://trk.udemy.com/dyZj03 |
| 65 | udemy | Curso de Claude: estrategia, escritura y creatividad con IA | Inteligencia artificial | beginner | https://trk.udemy.com/NGP3DP |
| 66 | udemy | Master Claude Code | Inteligencia artificial | intermediate | https://trk.udemy.com/yZLQ3B |
| 67 | udemy | AI Coding Mastery 2026: Claude Code and Multi-Model Stack | Inteligencia artificial | advanced | https://trk.udemy.com/YVo3GK |
| 68 | udemy | Claude Code for Agentic AI: Build AI Agents 10x Faster | Inteligencia artificial | intermediate | https://trk.udemy.com/KB93Lv |
| 69 | udemy | Claude Code: Generative AI-Assisted Development | Inteligencia artificial | intermediate | https://trk.udemy.com/m4bV3y |
| 70 | udemy | Claude Code Masterclass | Inteligencia artificial | intermediate | https://trk.udemy.com/L0r3q3 |
| 71 | udemy | Mastering Claude Code | Inteligencia artificial | intermediate | https://trk.udemy.com/qWNX3q |
| 72 | udemy | Claude Code Bootcamp | Inteligencia artificial | beginner | https://trk.udemy.com/xJbD33 |
| 73 | udemy | Claude API | Inteligencia artificial | intermediate | https://trk.udemy.com/QYe3r9 |
| 74 | udemy | Google Gemini Pro Vision API with Python | Inteligencia artificial | intermediate | https://trk.udemy.com/9VQaPY |
| 75 | udemy | Generative AI Engineering with OpenAI and Anthropic | Inteligencia artificial | advanced | https://trk.udemy.com/rEbo3d |

## G. Enlaces adicionales en contenido

El escaneo de Markdown encontro enlaces Edutin y Hotmart que no siempre aparecen
en los catalogos centrales. En la importacion se debe crear una fila por URL
exacta y una relacion por source_page. No se recomienda reescribir Markdown
hasta comparar el inventario contra los 233 destinos unicos.

Grupos confirmados:

- Cursos Edutin de empleabilidad y tecnicas de estudio.
- Cursos y guias Hotmart de atencion farmaceutica.
- Recursos FST relacionados con levotiroxina.
- Busquedas Amazon sin tag de afiliado confirmado.

+### Inventario por pagina Markdown

Se confirmaron 168 combinaciones URL/pagina. Una URL repetida en varias paginas
requiere una sola AffiliateLink y varias relaciones de origen.

| URL exacta | Source page |
|---|---|
| https://edutin.com/sh-10219 | public/articulos/articulos_edvanta/atencion-farmaceutica/indicadores-servicio-farmaceutico.md |
| https://edutin.com/sh-10219 | public/articulos/articulos_edvanta/atencion-farmaceutica/tecnologia-farmacia-clinica-herramientas-digitales.md |
| https://edutin.com/sh-10219 | public/articulos/articulos_edvanta/edvanta/como-mejorar-tu-perfil-profesional-con-cursos-gratuitos.md |
| https://edutin.com/sh-10219 | public/articulos/articulos_edvanta/edvanta/como-ser-analista-de-datos-con-power-bi.md |
| https://edutin.com/sh-14836 | public/articulos/articulos_edvanta/edvanta/como-mejorar-tu-perfil-profesional-con-cursos-gratuitos.md |
| https://edutin.com/sh-14836 | public/articulos/articulos_edvanta/edvanta/profesiones-digitales-mas-demandadas-2026.md |
| https://edutin.com/sh-15968 | public/articulos/articulos_edvanta/edvanta/como-aprender-formulas-quimicas-con-tecnicas-de-estudio.md |
| https://edutin.com/sh-15968 | public/articulos/articulos_edvanta/edvanta/como-estudiar-100-farmacos-en-7-dias.md |
| https://edutin.com/sh-15968 | public/articulos/articulos_edvanta/edvanta/como-estudiar-para-examenes-tipo-test.md |
| https://edutin.com/sh-15968 | public/articulos/articulos_edvanta/edvanta/mapas-mentales-y-conceptuales-para-estudiar.md |
| https://edutin.com/sh-15968 | public/articulos/articulos_edvanta/edvanta/metodo-cornell-toma-de-apuntes.md |
| https://edutin.com/sh-15968 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-15968 | public/articulos/articulos_edvanta/edvanta/tecnica-feynman-explicar-para-aprender.md |
| https://edutin.com/sh-15968 | public/articulos/articulos_edvanta/edvanta/tecnicas-de-estudio-basadas-en-neurociencia.md |
| https://edutin.com/sh-15969 | public/articulos/articulos_edvanta/edvanta/como-aprender-formulas-quimicas-con-tecnicas-de-estudio.md |
| https://edutin.com/sh-15969 | public/articulos/articulos_edvanta/edvanta/como-estudiar-para-examenes-tipo-test.md |
| https://edutin.com/sh-15969 | public/articulos/articulos_edvanta/edvanta/mapas-mentales-y-conceptuales-para-estudiar.md |
| https://edutin.com/sh-15969 | public/articulos/articulos_edvanta/edvanta/metodo-cornell-toma-de-apuntes.md |
| https://edutin.com/sh-15969 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-15969 | public/articulos/articulos_edvanta/edvanta/tecnica-feynman-explicar-para-aprender.md |
| https://edutin.com/sh-15970 | public/articulos/articulos_edvanta/atencion-farmaceutica/clasificacion-prm-rnm-ejemplos-clinicos.md |
| https://edutin.com/sh-15970 | public/articulos/articulos_edvanta/atencion-farmaceutica/conciliacion-medicamentosa-guia-practica.md |
| https://edutin.com/sh-15970 | public/articulos/articulos_edvanta/atencion-farmaceutica/errores-medicacion-prevencion-sistemas.md |
| https://edutin.com/sh-15970 | public/articulos/articulos_edvanta/atencion-farmaceutica/etica-farmaceutica-toma-decisiones-clinicas.md |
| https://edutin.com/sh-15970 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacovigilancia-reporte-ram-paso-a-paso.md |
| https://edutin.com/sh-15970 | public/articulos/articulos_edvanta/atencion-farmaceutica/medicamentos-alto-riesgo-estrategias-seguridad.md |
| https://edutin.com/sh-15970 | public/articulos/articulos_edvanta/edvanta/como-estudiar-para-examenes-tipo-test.md |
| https://edutin.com/sh-15970 | public/articulos/articulos_edvanta/edvanta/metodo-cornell-toma-de-apuntes.md |
| https://edutin.com/sh-15970 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-15971 | public/articulos/articulos_edvanta/edvanta/como-aprender-formulas-quimicas-con-tecnicas-de-estudio.md |
| https://edutin.com/sh-15971 | public/articulos/articulos_edvanta/edvanta/como-estudiar-para-examenes-tipo-test.md |
| https://edutin.com/sh-15971 | public/articulos/articulos_edvanta/edvanta/metodo-cornell-toma-de-apuntes.md |
| https://edutin.com/sh-15971 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-15971 | public/articulos/articulos_edvanta/edvanta/tecnicas-de-estudio-basadas-en-neurociencia.md |
| https://edutin.com/sh-15972 | public/articulos/articulos_edvanta/edvanta/como-estudiar-100-farmacos-en-7-dias.md |
| https://edutin.com/sh-15972 | public/articulos/articulos_edvanta/edvanta/como-estudiar-para-examenes-tipo-test.md |
| https://edutin.com/sh-15972 | public/articulos/articulos_edvanta/edvanta/mapas-mentales-y-conceptuales-para-estudiar.md |
| https://edutin.com/sh-15972 | public/articulos/articulos_edvanta/edvanta/metodo-cornell-toma-de-apuntes.md |
| https://edutin.com/sh-15972 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-15972 | public/articulos/articulos_edvanta/edvanta/tecnica-feynman-explicar-para-aprender.md |
| https://edutin.com/sh-15973 | public/articulos/articulos_edvanta/edvanta/como-aprender-formulas-quimicas-con-tecnicas-de-estudio.md |
| https://edutin.com/sh-15973 | public/articulos/articulos_edvanta/edvanta/como-estudiar-100-farmacos-en-7-dias.md |
| https://edutin.com/sh-15973 | public/articulos/articulos_edvanta/edvanta/como-estudiar-para-examenes-tipo-test.md |
| https://edutin.com/sh-15973 | public/articulos/articulos_edvanta/edvanta/mapas-mentales-y-conceptuales-para-estudiar.md |
| https://edutin.com/sh-15973 | public/articulos/articulos_edvanta/edvanta/metodo-cornell-toma-de-apuntes.md |
| https://edutin.com/sh-15973 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-15973 | public/articulos/articulos_edvanta/edvanta/tecnica-feynman-explicar-para-aprender.md |
| https://edutin.com/sh-15973 | public/articulos/articulos_edvanta/edvanta/tecnicas-de-estudio-basadas-en-neurociencia.md |
| https://edutin.com/sh-15974 | public/articulos/articulos_edvanta/edvanta/como-estudiar-para-examenes-tipo-test.md |
| https://edutin.com/sh-15974 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-15975 | public/articulos/articulos_edvanta/edvanta/como-estudiar-100-farmacos-en-7-dias.md |
| https://edutin.com/sh-15975 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-16658 | public/articulos/articulos_edvanta/edvanta/profesiones-digitales-mas-demandadas-2026.md |
| https://edutin.com/sh-20358 | public/articulos/articulos_edvanta/atencion-farmaceutica/adherencia-terapeutica-intervenciones-efectivas.md |
| https://edutin.com/sh-20358 | public/articulos/articulos_edvanta/atencion-farmaceutica/diabetes-mellitus-seguimiento-farmaceutico.md |
| https://edutin.com/sh-20358 | public/articulos/articulos_edvanta/atencion-farmaceutica/metodo-dader-seguimiento-farmacoterapeutico.md |
| https://edutin.com/sh-20359 | public/articulos/articulos_edvanta/atencion-farmaceutica/antibioticos-uso-racional-resistencia.md |
| https://edutin.com/sh-20360 | public/articulos/articulos_edvanta/atencion-farmaceutica/evidencia-cientifica-farmacia-practica-basada.md |
| https://edutin.com/sh-20360 | public/articulos/articulos_edvanta/atencion-farmaceutica/indicadores-servicio-farmaceutico.md |
| https://edutin.com/sh-20360 | public/articulos/articulos_edvanta/atencion-farmaceutica/tecnologia-farmacia-clinica-herramientas-digitales.md |
| https://edutin.com/sh-20360 | public/articulos/articulos_edvanta/edvanta/como-mejorar-tu-perfil-profesional-con-cursos-gratuitos.md |
| https://edutin.com/sh-20360 | public/articulos/articulos_edvanta/edvanta/como-ser-analista-de-datos-con-power-bi.md |
| https://edutin.com/sh-20360 | public/articulos/articulos_edvanta/edvanta/profesiones-digitales-mas-demandadas-2026.md |
| https://edutin.com/sh-20399 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacos-embarazo-lactancia-seguridad.md |
| https://edutin.com/sh-20399 | public/articulos/articulos_edvanta/edvanta/como-aprender-formulas-quimicas-con-tecnicas-de-estudio.md |
| https://edutin.com/sh-20399 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/adherencia-terapeutica-intervenciones-efectivas.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/atencion-farmaceutica-modelo-minnesota.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/atencion-farmaceutica-pacientes-cronico.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/clasificacion-prm-rnm-ejemplos-clinicos.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/conciliacion-medicamentosa-guia-practica.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/dolor-cronico-manejo-farmacologico-seguro.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/entrevista-farmaceutica-tecnicas-comunicacion.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacia-comunitaria-servicios-profesionales.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacos-geriatricos-criterios-beers.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacos-pediatricos-dosificacion-segura.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/metodo-dader-seguimiento-farmacoterapeutico.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/paciente-polidrogado-manejo-integral.md |
| https://edutin.com/sh-20798 | public/articulos/articulos_edvanta/atencion-farmaceutica/salud-mental-psicofarmacos-rol-farmaceutico.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/atencion-farmaceutica/anticoagulacion-manejo-farmaceutico.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/atencion-farmaceutica/diabetes-mellitus-seguimiento-farmaceutico.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/atencion-farmaceutica/dislipidemias-manejo-farmacologico.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacocinetica-clinica-ajuste-de-dosis.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/atencion-farmaceutica/hipertension-arterial-intervencion-farmaceutica.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/atencion-farmaceutica/insuficiencia-renal-ajuste-farmacos.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/atencion-farmaceutica/interacciones-medicamentosas-deteccion-manejo.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/atencion-farmaceutica/metodo-dader-seguimiento-farmacoterapeutico.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/atencion-farmaceutica/paciente-polidrogado-manejo-integral.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/edvanta/como-aprender-formulas-quimicas-con-tecnicas-de-estudio.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/edvanta/como-estudiar-100-farmacos-en-7-dias.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/edvanta/metodo-cornell-toma-de-apuntes.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-20799 | public/articulos/articulos_edvanta/edvanta/tecnica-feynman-explicar-para-aprender.md |
| https://edutin.com/sh-21034 | public/articulos/articulos_edvanta/edvanta/como-mejorar-tu-perfil-profesional-con-cursos-gratuitos.md |
| https://edutin.com/sh-22313 | public/articulos/articulos_edvanta/atencion-farmaceutica/tecnologia-farmacia-clinica-herramientas-digitales.md |
| https://edutin.com/sh-22969 | public/articulos/articulos_edvanta/edvanta/como-mejorar-tu-perfil-profesional-con-cursos-gratuitos.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/adherencia-terapeutica-intervenciones-efectivas.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/antibioticos-uso-racional-resistencia.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/anticoagulacion-manejo-farmaceutico.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/atencion-farmaceutica-modelo-minnesota.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/clasificacion-prm-rnm-ejemplos-clinicos.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/conciliacion-medicamentosa-guia-practica.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/dolor-cronico-manejo-farmacologico-seguro.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/entrevista-farmaceutica-tecnicas-comunicacion.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/evidencia-cientifica-farmacia-practica-basada.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacia-comunitaria-servicios-profesionales.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacocinetica-clinica-ajuste-de-dosis.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacos-embarazo-lactancia-seguridad.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacos-geriatricos-criterios-beers.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacos-pediatricos-dosificacion-segura.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/farmacovigilancia-reporte-ram-paso-a-paso.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/insuficiencia-hepatica-ajuste-farmacos.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/insuficiencia-renal-ajuste-farmacos.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/interacciones-medicamentosas-deteccion-manejo.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/medicamentos-alto-riesgo-estrategias-seguridad.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/metodo-dader-seguimiento-farmacoterapeutico.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/paciente-polidrogado-manejo-integral.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/atencion-farmaceutica/salud-mental-psicofarmacos-rol-farmaceutico.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/edvanta/como-aprender-formulas-quimicas-con-tecnicas-de-estudio.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/edvanta/como-estudiar-100-farmacos-en-7-dias.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/edvanta/mapas-mentales-y-conceptuales-para-estudiar.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-7429 | public/articulos/articulos_edvanta/edvanta/tecnica-feynman-explicar-para-aprender.md |
| https://edutin.com/sh-9060 | public/articulos/articulos_edvanta/atencion-farmaceutica/atencion-farmaceutica-modelo-minnesota.md |
| https://edutin.com/sh-9060 | public/articulos/articulos_edvanta/atencion-farmaceutica/atencion-farmaceutica-pacientes-cronico.md |
| https://edutin.com/sh-9060 | public/articulos/articulos_edvanta/atencion-farmaceutica/clasificacion-prm-rnm-ejemplos-clinicos.md |
| https://edutin.com/sh-9060 | public/articulos/articulos_edvanta/atencion-farmaceutica/conciliacion-medicamentosa-guia-practica.md |
| https://edutin.com/sh-9060 | public/articulos/articulos_edvanta/atencion-farmaceutica/errores-medicacion-prevencion-sistemas.md |
| https://edutin.com/sh-9060 | public/articulos/articulos_edvanta/atencion-farmaceutica/indicadores-servicio-farmaceutico.md |
| https://edutin.com/sh-9060 | public/articulos/articulos_edvanta/edvanta/como-estudiar-para-examenes-tipo-test.md |
| https://edutin.com/sh-9060 | public/articulos/articulos_edvanta/edvanta/mapas-mentales-y-conceptuales-para-estudiar.md |
| https://edutin.com/sh-9086 | public/articulos/articulos_edvanta/edvanta/como-estudiar-para-examenes-tipo-test.md |
| https://edutin.com/sh-9215 | public/articulos/articulos_edvanta/atencion-farmaceutica/clasificacion-prm-rnm-ejemplos-clinicos.md |
| https://edutin.com/sh-9215 | public/articulos/articulos_edvanta/atencion-farmaceutica/conciliacion-medicamentosa-guia-practica.md |
| https://edutin.com/sh-9215 | public/articulos/articulos_edvanta/atencion-farmaceutica/indicadores-servicio-farmaceutico.md |
| https://edutin.com/sh-9355 | public/articulos/articulos_edvanta/edvanta/como-aprender-formulas-quimicas-con-tecnicas-de-estudio.md |
| https://edutin.com/sh-9355 | public/articulos/articulos_edvanta/edvanta/repeticion-espaciada-memoria-largo-plazo.md |
| https://edutin.com/sh-9355 | public/articulos/articulos_edvanta/edvanta/tecnica-feynman-explicar-para-aprender.md |
| https://edutin.com/sh-9356 | public/articulos/articulos_edvanta/atencion-farmaceutica/diabetes-mellitus-seguimiento-farmaceutico.md |
| https://edutin.com/sh-9356 | public/articulos/articulos_edvanta/atencion-farmaceutica/dislipidemias-manejo-farmacologico.md |
| https://edutin.com/sh-9356 | public/articulos/articulos_edvanta/atencion-farmaceutica/hipertension-arterial-intervencion-farmaceutica.md |
| https://edutin.com/sh-9356 | public/articulos/articulos_edvanta/atencion-farmaceutica/insuficiencia-hepatica-ajuste-farmacos.md |
| https://edutin.com/sh-9356 | public/articulos/articulos_edvanta/edvanta/como-aprender-formulas-quimicas-con-tecnicas-de-estudio.md |
| https://edutin.com/sh-9356 | public/articulos/articulos_edvanta/edvanta/tecnicas-de-estudio-basadas-en-neurociencia.md |
| https://go.hotmart.com/A107041181P | public/articulos/articulos_edvanta/atencion-farmaceutica/5-razones-especializarte-atencion-farmaceutica-fibrosis-quistica.md |
| https://go.hotmart.com/A107041181P | public/articulos/articulos_edvanta/atencion-farmaceutica/rol-farmaceutico-fibrosis-quistica.md |
| https://go.hotmart.com/C107041198W?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/curso-atencion-farmaceutica-hipertension-arterial.md |
| https://go.hotmart.com/C107041198W?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/estrategias-farmaceuticas-hipertension-arterial.md |
| https://go.hotmart.com/C99303085S?dp=1 | public/articulos/articulos_edvanta/COMPENDIO_ARTICULOS.md |
| https://go.hotmart.com/C99303085S?dp=1 | public/articulos/articulos_edvanta/feliz-sin-tiroides/alimentos-suplementos-levotiroxina.md |
| https://go.hotmart.com/C99303085S?dp=1 | public/articulos/articulos_edvanta/feliz-sin-tiroides/como-tomar-levotiroxina-correctamente.md |
| https://go.hotmart.com/C99303085S?dp=1 | public/articulos/articulos_edvanta/feliz-sin-tiroides/vivir-sin-tiroides.md |
| https://go.hotmart.com/E107033125O?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/curso-gestion-integral-farmacoterapia.md |
| https://go.hotmart.com/E107033125O?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/gestion-integral-farmacoterapia-fundamentos.md |
| https://go.hotmart.com/J107041157J?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/curso-terapia-reemplazo-enzimatico-enfermedades-lisosomales.md |
| https://go.hotmart.com/J107041157J?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/terapia-reemplazo-enzimatico-guia-farmaceutica-lisosomal.md |
| https://go.hotmart.com/K107032633H?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/curso-stewardship-farmaceutico-proa.md |
| https://go.hotmart.com/K107032633H?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/stewardship-farmaceutico-proa-optimizacion-antimicrobianos.md |
| https://go.hotmart.com/N107033004S?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/curso-entrevista-farmaceutica-avanzada-comunicacion-clinica.md |
| https://go.hotmart.com/N107033004S?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/entrevista-farmaceutica-claves-comunicacion-clinica.md |
| https://go.hotmart.com/O107033642F?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/curso-problemas-farmacoterapeuticos.md |
| https://go.hotmart.com/O107033642F?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/problemas-farmacoterapeuticos-identificacion-clasificacion.md |
| https://go.hotmart.com/P107032755V?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/curso-seguridad-medicamento-problemas-farmacoterapeuticos.md |
| https://go.hotmart.com/P107032755V?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/seguridad-medicamento-prevencion-errores-gestion-riesgos.md |
| https://go.hotmart.com/S107033035L?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/curso-plan-cuidados-farmacoterapeutico.md |
| https://go.hotmart.com/S107033035L?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/plan-cuidados-farmacoterapeutico-diseno-seguimiento.md |
| https://go.hotmart.com/V107032692K?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/curso-pharmacotherapy-workup-cipolle-strand-morley.md |
| https://go.hotmart.com/V107032692K?dp=1 | public/articulos/articulos_edvanta/atencion-farmaceutica/pharmacotherapy-workup-cipolle-strand-morley.md |


## 7. Verificacion operativa

1. HEAD/GET controlado y codigo final.
2. Proveedor y producto esperados.
3. Conservacion de parametros.
4. Pais/idioma y disponibilidad.
5. Fecha de ultima verificacion.
6. Fuente editorial.
7. Disclosure visible.
8. Evento affiliate_click sin datos sensibles.
9. Comparacion de conteos antes/despues.
10. Rollback mediante feature flag.

## 8. Criterio de salida

- Los 100 cursos Edutin y 75 externos estan reconciliados.
- Los 8 destacados apuntan a los mismos Course IDs.
- Los 24 ebooks y 10 productos AtenFarma tienen estado comercial.
- Los enlaces de articulos tienen source_page.
- Existe backup, dry-run y reporte de diferencias.

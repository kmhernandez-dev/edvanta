# Direcciones públicas de Edvanta

Cada página pública indexable tiene una dirección que dice qué hay en ella:
`https://edvanta.co/curso-de-farmacoterapia-de-la-diabetes` en vez de
`/curso/53`. Las direcciones viejas siguen funcionando: responden **301 en
un solo salto** a la nueva y conservan la consulta (`?utm_source=…`).

En producción desde el 2026-10-28 (commit `03aa834`): cursos, herramientas y
categorías. Desde el 2026-10-29: el aula, las escuelas, las carreras, las
rutas, las competencias y las páginas que tenían un nombre recortado.

## 1. Reglas

| Qué | Dirección | Ejemplo |
| --- | --- | --- |
| Curso (propio, de otra plataforma o en vivo) | `/curso-de-<nombre-del-curso>` | `/curso-de-gestion-de-desviaciones-y-capa` |
| Herramienta | `/herramientas/<lo-que-hace>` | `/herramientas/creador-de-hoja-de-vida` |
| Categoría de artículos | `/articulos/categoria/<categoría>` | `/articulos/categoria/gestion-de-calidad` |
| Artículo | `/articulos/<tema>` (sin cambios: ya eran descriptivas) | `/articulos/iso-9001-explicada` |
| Escuela | `/escuelas/<nombre-completo>` | `/escuelas/salud-y-farmacia-clinica` |
| Carrera, ruta y competencia | `/carreras/<nombre>`, `/rutas/<nombre>`, `/competencias/<nombre>` | `/competencias/buenas-practicas-de-manufactura` |
| Aula: curso y clase | `/aula/<dirección del curso>/clase/<clase>` | `/aula/curso-de-farmacoterapia-de-la-diabetes/clase/metformina` |

- Palabras del nombre real, en minúsculas, con guiones y sin tildes
  (`ñ` → `n`, `&` → `y`, `+` → `mas`). Nunca un número como único nombre.
- El slug de un curso usa el título completo; solo se quita «Curso de / en /
  del / sobre» del inicio. Si pasa de 70 caracteres se acorta, en este orden:
  paréntesis cortos, lo que va después de dos puntos, la frase que sigue a un
  guion y, al final, en el límite de una palabra que no sea «de», «y», «and»…
- Si dos cursos quedarían con la misma dirección, el propio de Edvanta
  conserva el nombre y el de otra plataforma recibe lo que de verdad lo
  diferencia: la plataforma (`-en-edutin`, `-en-coursera`, `-en-udemy`),
  luego el nivel y, solo como último recurso, `-2`, `-3`… Hoy hay un solo
  caso: `/curso-de-farmacologia-cardiovascular-en-edutin`.
- Los cursos en inglés conservan su nombre real
  (`/curso-de-pharmacokinetics`): traducirlo dejaría una dirección que no
  coincide con el título ni con el H1 de la página.
- Título, H1 y dirección dicen lo mismo: título «Curso de Gestión de Calidad |
  Edvanta», H1 «Curso de Gestión de Calidad». Si el nombre ya dice lo que es
  (Certificado, Especialización, Diplomado, Programa, Taller…), no se le
  antepone «Curso de».
- Las excepciones elegidas a mano están en `SLUGS_ELEGIDOS`
  (`api/lib/slugs-publicos.js`).
- Carreras, rutas y competencias: el nombre completo, con sus conectores
  (`aseguramiento-de-calidad`, no `aseguramiento-calidad`). Donde el sitio
  ya usaba el término en español para lo mismo, se unifica: la ruta
  «Regulatory Affairs» se llama «Asuntos regulatorios», como la carrera. Se
  conservan los nombres de uso internacional (Power BI, Excel, SQL, Lean, Six
  Sigma, Medical Affairs) y se explican las siglas opacas
  (`resultados-fuera-de-especificacion-oos-y-oot`).

## 2. Cómo funciona

- **Tabla `public_slugs`** (migración 057): `slug` (único), `entity`
  (`aula` = curso propio, `curado` = de otra plataforma), `entity_id` e
  `is_current`. El id interno no cambia: inscripciones, pagos, progreso y
  certificados siguen usándolo. Las filas con `is_current = false` son el
  historial y redirigen a la vigente.
- **Cuándo nace el slug**: al publicar un curso propio (`publishCourse`).
  Los de otras plataformas que lleguen por importación lo reciben al arrancar
  la API (`asegurarSlugsDeCursos`), al pedirse el sitemap o la tabla, o la
  primera vez que alguien abre su ficha. Un slug asignado **no cambia**
  aunque cambie el título.
- **Cambiar un slug a propósito**: `cambiarSlug(db, { entidad, id, nuevo })`.
  El anterior queda en el historial y redirige en un salto. Nunca se borran
  filas de `public_slugs`.
- **nginx** (`nginx.conf`):
  - `/curso-…` sirve el `.html` prerenderizado si existe (el curso en
    vivo); si no, pasa a la API (`/api/paginas/slug/…`), que escribe la
    página con su título, descripción, canonical, etiquetas para redes y datos
    estructurados (`Course`, `BreadcrumbList`), o redirige si el slug es del
    historial, tiene mayúsculas o barra final.
  - `/curso/<id>`, `/cursos/<slug>` y `/cursos-gratis/<código>` pasan a la
    API, que responde el 301 a la dirección vigente.
  - Las páginas fijas que cambiaron de dirección tienen su
    `location = … { return 301 …; }`. Están listadas en
    `src/data/edvanta/direcciones.js`, y la prueba
    `src/__tests__/direcciones.test.jsx` falla si falta alguna.
  - `/articulos?categoria=…` pasa a la API, que normaliza el nombre y
    responde el 301 a `/articulos/categoria/<slug>`.
  - Los proxys reenvían `$request_uri`, nunca `$uri` (viene decodificado:
    un `%0D%0A` llegaría a la API como salto de línea). La prueba lo revisa.
  - Si la API no responde, se sirve la aplicación y la página se arma en el
    navegador.
- **Al compilar** (`scripts/prerenderizar-paginas.mjs`): herramientas,
  categorías y cursos en vivo salen como `.html` con su título escrito, y
  `sitemap.xml` se limpia de direcciones viejas.
- **Carreras, rutas y competencias** (migración 060): salen de la base. La
  tabla `slugs_anteriores` guarda cada nombre viejo apuntando al id del
  registro, así que la redirección es de un salto aunque el nombre vuelva a
  cambiar. nginx pasa `/carreras/…`, `/rutas/…` y `/competencias/…` a la
  API (`/api/paginas/…`), que escribe la página con su título, descripción,
  canonical y migas (los mismos que pone la aplicación), responde el 301 si
  el nombre es anterior y 404 si no existe. Las cuatro rutas fijas de
  `src/data/featuredCourses.js` (`learningRoutes`) también tienen página.
  `/api/careers/:slug`, `/api/learning-paths/:slug` y `/api/skills/:slug`
  aceptan el nombre viejo y devuelven el vigente.
- **El grafo de recomendaciones** (`api/lib/edvanta-catalog.js`) une cursos,
  competencias, carreras y rutas por su slug. `slugsDelGrafo()` los lista y
  la prueba de migraciones falla si alguno no existe en la base: un nombre
  viejo no dejaría de recomendar en silencio.
- **Perfiles guardados**: las carreras y rutas que eligió cada persona viven
  en Supabase con el nombre de entonces. `slugVigente()`
  (`src/data/professionalProfileOptions.js`) los lee con el nombre nuevo y
  se guardan así la próxima vez.
- **El aula** (migración 059):
  - el curso se abre por la misma dirección pública:
    `/aula/curso-de-farmacoterapia-de-la-diabetes`;
  - cada clase tiene su nombre en `aula_lessons.slug`: se asigna al publicar
    el curso (y a las que ya existían, al arrancar la API), es único dentro
    del curso contando las borradas, nunca es solo un número y no cambia
    aunque cambie el título;
  - un curso de empresa recibe su dirección con el nombre de la institución
    (`…-para-pharmarket`), para no quitarle el nombre corto al catálogo, y
    nunca sale del aula: la página pública da 404 y no aparece en el sitemap
    ni en `/api/direcciones`;
  - las direcciones viejas por id (`/aula/curso/53/clase/812`), que siguen en
    avisos y correos ya enviados, llevan a la nueva con la misma clase. La API
    sigue trabajando con ids: el avance, los apuntes y los comentarios no
    dependen de la dirección;
  - la administración (`/aula/admin/…`) sigue con ids a propósito: los
    borradores todavía no tienen nombre público y los nombres de personas y
    empresas no deben quedar en una dirección.
- **Sitemaps**: `/sitemap.xml` (páginas fijas), `/sitemap-cursos.xml` (cada
  curso público) y `/sitemap-profesional.xml` (carreras, rutas y
  competencias). Los dos últimos los arma la API desde la base, siempre al
  día. `robots.txt` declara los tres.
- **Enlaces internos**: las listas de la API traen `url` y la búsqueda trae
  `destination`; en el sitio, `rutaDeCurso(curso)` (`src/lib/slug.js`) y, en
  el aula, `rutaEnAula(curso)` (`src/aula/rutas.js`).
- **Tabla en vivo**: `GET https://edvanta.co/api/direcciones` devuelve
  antigua → nueva de todos los cursos (y del historial) y de las carreras,
  rutas y competencias renombradas, siempre al día.

## 3. Al publicar o renombrar

| Caso | Qué hacer |
| --- | --- |
| Curso propio nuevo | Nada: el slug nace al publicarlo (se ve en `/api/direcciones`). |
| Cursos de otras plataformas importados | Nada: reciben su slug solos. |
| Cambia el título de un curso | Nada: la dirección se conserva. |
| Un curso necesita otra dirección | `cambiarSlug`; la vieja redirige sola. |
| Herramienta nueva | Slug descriptivo en español en `src/data/edvanta/herramientas.js`. |
| Página fija renombrada | Fila en `direcciones.js` + su 301 en `nginx.conf` (la prueba lo exige). Si vuelve a cambiar, la fila vieja apunta directo al destino final. |
| Curso en vivo nuevo | `to: '/curso-de-…'` en `src/data/edvanta/productos.js`. |
| Clase nueva o renombrada en el aula | Nada: recibe su nombre al publicar el curso y lo conserva. |
| Carrera, ruta o competencia nueva | Slug con su nombre completo en español. |
| Carrera, ruta o competencia renombrada | En una migración: la fila en `slugs_anteriores` (tipo, nombre viejo, id) y el `UPDATE` del slug. Cambiar también los slugs que usa `api/lib/edvanta-catalog.js` (la prueba de migraciones lo exige). |
| Escuela nueva | Slug con su nombre completo en `src/data/edvanta/escuelas.js`. |

**Las redirecciones se mantienen indefinidamente** (como mínimo un año): no
se borran los bloques de `nginx.conf`, las rutas `/api/paginas/*`, el
historial de `public_slugs` ni las filas de `slugs_anteriores`. Si algún día
se cambia de servidor, las redirecciones se van con el sitio.

Para comprobar que todo sigue en pie:

```bash
node scripts/verificar-direcciones.mjs
```

## 4. Tabla completa

Tomada de producción el 2026-10-28 (`/api/direcciones`).
También en `docs/urls-publicas.csv`, con direcciones completas.

### Cursos propios de Edvanta (52)

| Antes | Ahora | Curso |
| --- | --- | --- |
| `/curso/2` | `/curso-de-autocuidado-de-la-tiroides` | Autocuidado de la tiroides |
| `/curso/3` | `/curso-de-bpm-en-la-industria-farmaceutica` | Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica |
| `/curso/4` | `/curso-de-bpe-y-preparaciones-magistrales` | Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales |
| `/curso/5` | `/curso-de-central-de-mezclas` | Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad |
| `/curso/6` | `/curso-de-asuntos-regulatorios-sanitarios-ante-invima` | Asuntos Regulatorios Sanitarios ante INVIMA |
| `/curso/7` | `/curso-de-validaciones-y-calificaciones` | Validaciones y Calificaciones en la Industria Farmacéutica |
| `/curso/8` | `/curso-de-gestion-de-calidad-farmaceutica` | Curso de Gestión de Calidad Farmacéutica |
| `/curso/9` | `/curso-de-aseguramiento-de-la-calidad-farmaceutica` | Curso de Aseguramiento de la Calidad Farmacéutica |
| `/curso/10` | `/curso-de-control-de-calidad-de-medicamentos` | Curso de Control de Calidad de Medicamentos |
| `/curso/11` | `/curso-de-buenas-practicas-de-manufactura-bpm` | Curso de Buenas Prácticas de Manufactura — BPM |
| `/curso/12` | `/curso-de-buenas-practicas-de-laboratorio-bpl` | Curso de Buenas Prácticas de Laboratorio — BPL |
| `/curso/13` | `/curso-de-buenas-practicas-de-documentacion-farmaceutica` | Curso de Buenas Prácticas de Documentación Farmacéutica |
| `/curso/14` | `/curso-de-auditoria-de-calidad-farmaceutica` | Curso de Auditoría de Calidad Farmacéutica |
| `/curso/15` | `/curso-de-gestion-de-riesgos-en-la-calidad-farmaceutica` | Curso de Gestión de Riesgos en la Calidad Farmacéutica |
| `/curso/16` | `/curso-de-gestion-de-desviaciones-y-capa` | Curso de Gestión de Desviaciones y Acciones Correctivas y Preventivas — CAPA |
| `/curso/17` | `/curso-de-validacion-de-metodos-analiticos` | Curso de Validación de Métodos Analíticos |
| `/curso/18` | `/curso-de-asuntos-regulatorios-farmaceuticos-en-colombia` | Curso de Asuntos Regulatorios Farmacéuticos en Colombia |
| `/curso/19` | `/curso-de-registro-sanitario-de-medicamentos-ante-el-invima` | Curso de Registro Sanitario de Medicamentos ante el INVIMA |
| `/curso/20` | `/curso-de-renovacion-de-registros-sanitarios-de-medicamentos` | Curso de Renovación de Registros Sanitarios de Medicamentos |
| `/curso/21` | `/curso-de-modificaciones-al-registro-sanitario-de-medicamentos` | Curso de Modificaciones al Registro Sanitario de Medicamentos |
| `/curso/22` | `/curso-de-elaboracion-de-dossiers-farmaceuticos` | Curso de Elaboración de Dossiers Farmacéuticos |
| `/curso/23` | `/curso-de-respuesta-a-requerimientos-del-invima` | Curso de Respuesta a Requerimientos del INVIMA |
| `/curso/24` | `/curso-de-etiquetado-e-insertos-de-medicamentos` | Curso de Etiquetado e Insertos de Medicamentos |
| `/curso/25` | `/curso-de-estudios-de-estabilidad-de-medicamentos` | Curso de Estudios de Estabilidad para el Registro de Medicamentos |
| `/curso/26` | `/curso-de-bioequivalencia-y-requisitos-regulatorios-en-colombia` | Curso de Bioequivalencia y Requisitos Regulatorios en Colombia |
| `/curso/27` | `/curso-de-gestion-documental-de-tramites-ante-el-invima` | Curso de Gestión Documental de Trámites ante el INVIMA |
| `/curso/28` | `/curso-de-registro-sanitario-de-medicamentos-biologicos` | Curso de Registro Sanitario de Medicamentos Biológicos |
| `/curso/29` | `/curso-de-regulacion-de-medicamentos-biosimilares` | Curso de Regulación de Medicamentos Biosimilares |
| `/curso/30` | `/curso-de-registro-sanitario-de-vacunas` | Curso de Registro Sanitario de Vacunas |
| `/curso/31` | `/curso-de-registro-sanitario-de-productos-fitoterapeuticos` | Curso de Registro Sanitario de Productos Fitoterapéuticos |
| `/curso/32` | `/curso-de-regulacion-de-medicamentos-homeopaticos` | Curso de Regulación de Medicamentos Homeopáticos |
| `/curso/33` | `/curso-de-registro-sanitario-de-suplementos-dietarios` | Curso de Registro Sanitario de Suplementos Dietarios |
| `/curso/34` | `/curso-de-regulacion-del-cannabis-medicinal` | Curso de Regulación Sanitaria del Cannabis Medicinal en Colombia |
| `/curso/35` | `/curso-de-asuntos-regulatorios-de-radiofarmacos` | Curso de Asuntos Regulatorios de Radiofármacos |
| `/curso/37` | `/curso-de-regulacion-sanitaria-de-gases-medicinales` | Curso de Regulación Sanitaria de Gases Medicinales |
| `/curso/39` | `/curso-de-medicamentos-vitales-no-disponibles` | Curso de Importación de Medicamentos Vitales No Disponibles |
| `/curso/41` | `/curso-de-farmacologia-oncologica` | Curso de Farmacología Oncológica |
| `/curso/42` | `/curso-de-quimioterapia-antineoplasica` | Curso de Quimioterapia Antineoplásica |
| `/curso/43` | `/curso-de-inmunoterapia-oncologica` | Curso de Inmunoterapia Oncológica |
| `/curso/44` | `/curso-de-terapias-dirigidas-en-oncologia` | Curso de Terapias Dirigidas en Oncología |
| `/curso/45` | `/curso-de-farmacologia-cardiovascular` | Curso de Farmacología Cardiovascular |
| `/curso/46` | `/curso-de-farmacologia-endocrina` | Curso de Farmacología Endocrina |
| `/curso/47` | `/curso-de-farmacologia-del-sistema-nervioso-central` | Curso de Farmacología del Sistema Nervioso Central |
| `/curso/48` | `/curso-de-psicofarmacologia` | Curso de Psicofarmacología |
| `/curso/49` | `/curso-de-farmacologia-respiratoria` | Curso de Farmacología Respiratoria |
| `/curso/50` | `/curso-de-farmacologia-gastrointestinal` | Curso de Farmacología Gastrointestinal |
| `/curso/51` | `/curso-de-farmacologia-renal` | Curso de Farmacología Renal |
| `/curso/52` | `/curso-de-anticoagulantes-y-antiagregantes` | Curso de Farmacología de Anticoagulantes y Antiagregantes |
| `/curso/53` | `/curso-de-farmacoterapia-de-la-diabetes` | Curso de Farmacoterapia de la Diabetes |
| `/curso/54` | `/curso-de-farmacoterapia-de-la-hipertension-arterial` | Curso de Farmacoterapia de la Hipertensión Arterial |
| `/curso/55` | `/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca` | Curso de Farmacoterapia de la Insuficiencia Cardíaca |
| `/curso/56` | `/curso-de-farmacoterapia-del-asma-y-la-epoc` | Curso de Farmacoterapia del Asma y la EPOC |

### Cursos de otras plataformas (176)

Las direcciones de los antiguos afiches de Edutin, `/cursos-gratis/<código>`
(por ejemplo `/cursos-gratis/sh-7429`), también responden 301 en un salto a
la ficha (`/curso-de-farmacologia-clinica`); si el código ya no existe, a
`/cursos`.

| Antes | Ahora | Curso |
| --- | --- | --- |
| `/cursos/coursera-pharmacokinetics` | `/curso-de-pharmacokinetics` | Pharmacokinetics |
| `/cursos/coursera-clinical-pharmacokinetics-dosing-and-monitoring` | `/curso-de-clinical-pharmacokinetics-dosing-and-monitoring` | Clinical Pharmacokinetics: Dosing and Monitoring |
| `/cursos/coursera-pharmacotherapy-understanding-biotechnology-products` | `/curso-de-pharmacotherapy-understanding-biotechnology-products` | Pharmacotherapy: Understanding Biotechnology Products |
| `/cursos/coursera-drug-discovery` | `/curso-de-drug-discovery` | Drug Discovery |
| `/cursos/coursera-drug-development` | `/curso-de-drug-development` | Drug Development |
| `/cursos/coursera-drug-discovery-and-development` | `/curso-de-drug-discovery-and-development` | Drug Discovery and Development |
| `/cursos/coursera-drug-development-and-regulation` | `/curso-de-drug-development-and-regulation` | Drug Development and Regulation |
| `/cursos/coursera-drug-safety-and-pharmacovigilance` | `/curso-de-drug-safety-and-pharmacovigilance` | Drug Safety and Pharmacovigilance |
| `/cursos/coursera-drug-utilization-trends-determinants-and-consequences` | `/curso-de-drug-utilization-trends-determinants-and-consequences` | Drug Utilization: Trends, Determinants and Consequences |
| `/cursos/coursera-comparative-effectiveness-and-real-world-evidence` | `/curso-de-comparative-effectiveness-and-real-world-evidence` | Comparative Effectiveness and Real-World Evidence |
| `/cursos/coursera-pharmacy-medication-and-safety` | `/curso-de-pharmacy-medication-and-safety` | Pharmacy, Medication and Safety |
| `/cursos/coursera-pharmacy-dosages-and-prescriptions-essentials` | `/curso-de-pharmacy-dosages-and-prescriptions-essentials` | Pharmacy: Dosages and Prescriptions Essentials |
| `/cursos/coursera-pharmacy-syringes-compounding-medications-and-communication` | `/curso-de-pharmacy-syringes-compounding-medications-and-communication` | Pharmacy: Syringes, Compounding Medications and Communication |
| `/cursos/coursera-medication-prescribing` | `/curso-de-medication-prescribing` | Medication Prescribing |
| `/cursos/coursera-antibiotic-stewardship` | `/curso-de-antibiotic-stewardship` | Antibiotic Stewardship |
| `/cursos/coursera-antibioticos-uso-prudente` | `/curso-de-antibioticos-uso-prudente` | Antibióticos: uso prudente |
| `/cursos/coursera-the-social-dimensions-of-antimicrobial-resistance` | `/curso-de-the-social-dimensions-of-antimicrobial-resistance` | The Social Dimensions of Antimicrobial Resistance |
| `/cursos/coursera-antimicrobial-resistance` | `/curso-de-antimicrobial-resistance` | Antimicrobial Resistance |
| `/cursos/coursera-certificado-profesional-de-google-data-analytics` | `/curso-de-certificado-profesional-de-google-data-analytics` | Certificado Profesional de Google Data Analytics |
| `/cursos/coursera-certificado-profesional-de-analisis-avanzado-de-datos-de-google` | `/curso-de-certificado-profesional-de-analisis-avanzado-de-datos` | Certificado Profesional de Análisis Avanzado de Datos de Google |
| `/cursos/coursera-certificado-profesional-de-google-business-intelligence` | `/curso-de-certificado-profesional-de-google-business-intelligence` | Certificado Profesional de Google Business Intelligence |
| `/cursos/coursera-certificado-profesional-de-microsoft-power-bi-data-analyst` | `/curso-de-certificado-profesional-de-microsoft-power-bi-data-analyst` | Certificado Profesional de Microsoft Power BI Data Analyst |
| `/cursos/coursera-certificado-profesional-de-microsoft-business-analyst` | `/curso-de-certificado-profesional-de-microsoft-business-analyst` | Certificado Profesional de Microsoft Business Analyst |
| `/cursos/coursera-certificado-profesional-de-ibm-data-analyst` | `/curso-de-certificado-profesional-de-ibm-data-analyst` | Certificado Profesional de IBM Data Analyst |
| `/cursos/coursera-especializacion-en-excel` | `/curso-de-especializacion-en-excel` | Especialización en Excel |
| `/cursos/coursera-especializacion-en-excel-data-analytics-and-visualization` | `/curso-de-especializacion-en-excel-data-analytics-and-visualization` | Especialización en Excel Data Analytics and Visualization |
| `/cursos/coursera-certificado-profesional-de-gestion-de-proyectos-de-google` | `/curso-de-certificado-profesional-de-gestion-de-proyectos-de-google` | Certificado Profesional de Gestión de Proyectos de Google |
| `/cursos/coursera-certificado-profesional-de-microsoft-project-management` | `/curso-de-certificado-profesional-de-microsoft-project-management` | Certificado Profesional de Microsoft Project Management |
| `/cursos/coursera-especializacion-six-sigma-green-belt` | `/curso-de-especializacion-six-sigma-green-belt` | Especialización Six Sigma Green Belt |
| `/cursos/coursera-especializacion-supply-chain-management` | `/curso-de-especializacion-supply-chain-management` | Especialización Supply Chain Management |
| `/cursos/coursera-certificado-profesional-de-google-it-support` | `/curso-de-certificado-profesional-de-google-it-support` | Certificado Profesional de Google IT Support |
| `/cursos/coursera-certificado-profesional-de-google-digital-marketing-e-commerce` | `/curso-de-certificado-profesional-de-google-digital-marketing` | Certificado Profesional de Google Digital Marketing & E-commerce |
| `/cursos/coursera-especializacion-patient-safety` | `/curso-de-especializacion-patient-safety` | Especialización Patient Safety |
| `/cursos/coursera-especializacion-quality-improvement-in-healthcare` | `/curso-de-especializacion-quality-improvement-in-healthcare` | Especialización Quality Improvement in Healthcare |
| `/cursos/coursera-especializacion-regulatory-compliance` | `/curso-de-especializacion-regulatory-compliance` | Especialización Regulatory Compliance |
| `/cursos/coursera-especializacion-healthcare-it` | `/curso-de-especializacion-healthcare-it` | Especialización Healthcare IT |
| `/cursos/coursera-introduction-to-the-pharmaceutical-industry` | `/curso-de-introduction-to-the-pharmaceutical-industry` | Introduction to the Pharmaceutical Industry |
| `/cursos/coursera-especializacion-drug-development-product-management` | `/curso-de-especializacion-drug-development-product-management` | Especialización Drug Development Product Management |
| `/cursos/coursera-especializacion-drug-development-and-pharmacoepidemiology` | `/curso-de-especializacion-drug-development-and-pharmacoepidemiology` | Especialización Drug Development and Pharmacoepidemiology |
| `/cursos/coursera-especializacion-clinical-trials-operations` | `/curso-de-especializacion-clinical-trials-operations` | Especialización Clinical Trials Operations |
| `/cursos/coursera-especializacion-clinical-trials-good-clinical-practice` | `/curso-de-especializacion-clinical-trials-good-clinical-practice` | Especialización Clinical Trials: Good Clinical Practice |
| `/cursos/coursera-especializacion-clinical-project-management` | `/curso-de-especializacion-clinical-project-management` | Especialización Clinical Project Management |
| `/cursos/udemy-iso-9001-2015-interpretacion-implementacion-y-auditoria` | `/curso-de-iso-9001-2015-interpretacion-implementacion-y-auditoria` | ISO 9001:2015 — Interpretación, implementación y auditoría |
| `/cursos/udemy-iso-9001-2015-implementacion-de-un-sistema-de-gestion-de-calidad` | `/curso-de-iso-9001-2015` | ISO 9001:2015 — Implementación de un sistema de gestión de calidad |
| `/cursos/udemy-lean-six-sigma-4-certificaciones` | `/curso-de-lean-six-sigma-4-certificaciones` | Lean Six Sigma — 4 certificaciones |
| `/cursos/udemy-foundations-of-pharmaceutical-quality-assurance-and-gmp` | `/curso-de-foundations-of-pharmaceutical-quality-assurance-and-gmp` | Foundations of Pharmaceutical Quality Assurance and GMP |
| `/cursos/udemy-curso-de-inteligencia-artificial-y-chatgpt` | `/curso-de-inteligencia-artificial-y-chatgpt` | Curso de Inteligencia Artificial y ChatGPT |
| `/cursos/udemy-normas-de-correcta-fabricacion-gmp` | `/curso-de-normas-de-correcta-fabricacion-gmp` | Normas de Correcta Fabricación — GMP |
| `/cursos/udemy-pharmaceutical-quality-control` | `/curso-de-pharmaceutical-quality-control` | Pharmaceutical Quality Control |
| `/cursos/udemy-document-control-and-good-documentation-practices-in-gmp` | `/curso-de-document-control-and-good-documentation-practices-in-gmp` | Document Control and Good Documentation Practices in GMP |
| `/cursos/udemy-global-drug-regulatory-affairs-a-comprehensive-crash-course` | `/curso-de-global-drug-regulatory-affairs-a-comprehensive-crash-course` | Global Drug Regulatory Affairs: A Comprehensive Crash Course |
| `/cursos/udemy-basic-course-in-drug-regulatory-affairs` | `/curso-de-basic-course-in-drug-regulatory-affairs` | Basic Course in Drug Regulatory Affairs |
| `/cursos/udemy-us-fda-regulations-and-new-drug-development` | `/curso-de-us-fda-regulations-and-new-drug-development` | US FDA Regulations and New Drug Development |
| `/cursos/udemy-certificate-course-in-pharmacovigilance` | `/curso-de-certificate-course-in-pharmacovigilance` | Certificate Course in Pharmacovigilance |
| `/cursos/udemy-advanced-certification-in-pharmacovigilance-and-drug-safety` | `/curso-de-advanced-certification-in-pharmacovigilance-and-drug-safety` | Advanced Certification in Pharmacovigilance and Drug Safety |
| `/cursos/udemy-certificate-course-in-pharmacovigilance-practical-icsr` | `/curso-de-certificate-course-in-pharmacovigilance-practical-icsr` | Certificate Course in Pharmacovigilance: Practical ICSR |
| `/cursos/udemy-good-clinical-practice-ich-gcp-e6-r2` | `/curso-de-good-clinical-practice-ich-gcp-e6-r2` | Good Clinical Practice: ICH-GCP E6(R2) |
| `/cursos/udemy-comprehensive-clinical-research-and-pharmacovigilance` | `/curso-de-comprehensive-clinical-research-and-pharmacovigilance` | Comprehensive Clinical Research and Pharmacovigilance |
| `/cursos/udemy-introduction-to-pharmaceutics-and-biopharmaceutics` | `/curso-de-introduction-to-pharmaceutics-and-biopharmaceutics` | Introduction to Pharmaceutics and Biopharmaceutics |
| `/cursos/udemy-statistics-biostatistics-and-data-analysis-from-scratch` | `/curso-de-statistics-biostatistics-and-data-analysis-from-scratch` | Statistics, Biostatistics and Data Analysis from Scratch |
| `/cursos/udemy-master-claude-code-agentes-de-ia` | `/curso-de-master-claude-code-agentes-de-ia` | Master Claude Code: Agentes de IA |
| `/cursos/udemy-claude-ai-en-espanol` | `/curso-de-claude-ai-en-espanol` | Claude AI en español |
| `/cursos/udemy-claude-anthropic` | `/curso-de-claude-anthropic` | Claude Anthropic |
| `/cursos/udemy-claude-de-cero-a-experto-guia-practica-intensiva` | `/curso-de-claude-de-cero-a-experto-guia-practica-intensiva` | Claude de cero a experto: guía práctica intensiva |
| `/cursos/udemy-curso-de-claude-estrategia-escritura-y-creatividad-con-ia` | `/curso-de-claude-estrategia-escritura-y-creatividad-con-ia` | Curso de Claude: estrategia, escritura y creatividad con IA |
| `/cursos/udemy-master-claude-code` | `/curso-de-master-claude-code` | Master Claude Code |
| `/cursos/udemy-ai-coding-mastery-2026-claude-code-and-multi-model-stack` | `/curso-de-ai-coding-mastery-2026-claude-code-and-multi-model-stack` | AI Coding Mastery 2026: Claude Code and Multi-Model Stack |
| `/cursos/udemy-claude-code-for-agentic-ai-build-ai-agents-10x-faster` | `/curso-de-claude-code-for-agentic-ai-build-ai-agents-10x-faster` | Claude Code for Agentic AI: Build AI Agents 10x Faster |
| `/cursos/udemy-claude-code-generative-ai-assisted-development` | `/curso-de-claude-code-generative-ai-assisted-development` | Claude Code: Generative AI-Assisted Development |
| `/cursos/udemy-claude-code-masterclass` | `/curso-de-claude-code-masterclass` | Claude Code Masterclass |
| `/cursos/udemy-mastering-claude-code` | `/curso-de-mastering-claude-code` | Mastering Claude Code |
| `/cursos/udemy-claude-code-bootcamp` | `/curso-de-claude-code-bootcamp` | Claude Code Bootcamp |
| `/cursos/udemy-claude-api` | `/curso-de-claude-api` | Claude API |
| `/cursos/udemy-google-gemini-pro-vision-api-with-python` | `/curso-de-google-gemini-pro-vision-api-with-python` | Google Gemini Pro Vision API with Python |
| `/cursos/udemy-generative-ai-engineering-with-openai-and-anthropic` | `/curso-de-generative-ai-engineering-with-openai-and-anthropic` | Generative AI Engineering with OpenAI and Anthropic |
| `/cursos/farmacologia-clinica-7429` | `/curso-de-farmacologia-clinica` | Farmacología clínica |
| `/cursos/soporte-vital-avanzado-acls-17411` | `/curso-de-soporte-vital-avanzado-acls` | Soporte vital avanzado ACLS |
| `/cursos/practicas-clinicas-20798` | `/curso-de-practicas-clinicas` | Prácticas clínicas |
| `/cursos/electrocardiograma-18231` | `/curso-de-electrocardiograma` | Electrocardiograma |
| `/cursos/farmacologia-cardiovascular-20799` | `/curso-de-farmacologia-cardiovascular-en-edutin` | Farmacología cardiovascular |
| `/cursos/primeros-auxilios-pediatricos-22858` | `/curso-de-primeros-auxilios-pediatricos` | Primeros auxilios pediátricos |
| `/cursos/enfermeria-22592` | `/curso-de-enfermeria` | Enfermería |
| `/cursos/nutricion-9356` | `/curso-de-nutricion` | Nutrición |
| `/cursos/endocrinologia-20399` | `/curso-de-endocrinologia` | Endocrinología |
| `/cursos/radiologia-20634` | `/curso-de-radiologia` | Radiología |
| `/cursos/nutricion-avanzada-9767` | `/curso-de-nutricion-avanzada` | Nutrición avanzada |
| `/cursos/soporte-vital-avanzado-acls-ii-20398` | `/curso-de-soporte-vital-avanzado-acls-ii` | Soporte vital avanzado ACLS II |
| `/cursos/pediatria-22883` | `/curso-de-pediatria` | Pediatría |
| `/cursos/fisioterapia-ortopedia-22225` | `/curso-de-fisioterapia-ortopedia` | Fisioterapia ortopedia |
| `/cursos/escuela-de-salud-22554` | `/curso-de-escuela-de-salud` | Escuela de salud |
| `/cursos/telesalud-y-telemedicina-22313` | `/curso-de-telesalud-y-telemedicina` | Telesalud y telemedicina |
| `/cursos/diabetes-20358` | `/curso-de-diabetes` | Diabetes |
| `/cursos/urgencias-obstetricas-23066` | `/curso-de-urgencias-obstetricas` | Urgencias obstétricas |
| `/cursos/urgencias-ginecologicas-23069` | `/curso-de-urgencias-ginecologicas` | Urgencias ginecológicas |
| `/cursos/microbiota-20359` | `/curso-de-microbiota` | Microbiota |
| `/cursos/nutricion-infantil-9768` | `/curso-de-nutricion-infantil` | Nutrición infantil |
| `/cursos/power-bi` | `/curso-de-power-bi` | Power BI |
| `/cursos/python-16658` | `/curso-de-python` | Python |
| `/cursos/sql-server-16657` | `/curso-de-sql-server` | SQL Server |
| `/cursos/analisis-de-datos-20360` | `/curso-de-analisis-de-datos` | Análisis de datos |
| `/cursos/ia-para-abastecimiento-y-compras-15647` | `/curso-de-ia-para-abastecimiento-y-compras` | IA para abastecimiento y compras |
| `/cursos/ia-para-creacion-de-contenido-15498` | `/curso-de-ia-para-creacion-de-contenido` | IA para creación de contenido |
| `/cursos/power-bi-avanzado-10117` | `/curso-de-power-bi-avanzado` | Power BI avanzado |
| `/cursos/administrador-de-bases-de-datos-mysql-22149` | `/curso-de-administrador-de-bases-de-datos-mysql` | Administrador de bases de datos MySQL |
| `/cursos/ia-para-impuestos-y-cumplimiento-fiscal-22972` | `/curso-de-ia-para-impuestos-y-cumplimiento-fiscal` | IA para impuestos y cumplimiento fiscal |
| `/cursos/ia-para-control-de-inventarios-y-almacen-15648` | `/curso-de-ia-para-control-de-inventarios-y-almacen` | IA para control de inventarios y almacén |
| `/cursos/ia-para-analisis-de-datos-14528` | `/curso-de-ia-para-analisis-de-datos` | IA para análisis de datos |
| `/cursos/ia-para-gestion-documental-17245` | `/curso-de-ia-para-gestion-documental` | IA para gestión documental |
| `/cursos/ia-para-analisis-de-datos-ii-22406` | `/curso-de-ia-para-analisis-de-datos-ii` | IA para análisis de datos II |
| `/cursos/analista-de-datos-con-power-bi-22150` | `/curso-de-analista-de-datos-con-power-bi` | Analista de datos con Power BI |
| `/cursos/desarrollador-front-end-junior-22145` | `/curso-de-desarrollador-front-end-junior` | Desarrollador front end junior |
| `/cursos/desarrollador-front-end-con-angular-22148` | `/curso-de-desarrollador-front-end-con-angular` | Desarrollador front end con Angular |
| `/cursos/desarrollador-front-end-junior-ii-22146` | `/curso-de-desarrollador-front-end-junior-ii` | Desarrollador front end junior II |
| `/cursos/gestion-de-calidad` | `/curso-de-gestion-de-calidad` | Gestión de calidad |
| `/cursos/auditoria` | `/curso-de-auditoria` | Auditoría |
| `/cursos/gestion-del-riesgo-15970` | `/curso-de-gestion-del-riesgo` | Gestión del riesgo |
| `/cursos/gestion-de-calidad-ii-9948` | `/curso-de-gestion-de-calidad-ii` | Gestión de calidad II |
| `/cursos/gestion-de-proyectos` | `/curso-de-gestion-de-proyectos` | Gestión de proyectos |
| `/cursos/lean-six-sigma` | `/curso-de-lean-six-sigma` | Lean Six Sigma |
| `/cursos/gestion-de-calidad-iii-9949` | `/curso-de-gestion-de-calidad-iii` | Gestión de calidad III |
| `/cursos/contabilidad-financiera-22588` | `/curso-de-contabilidad-financiera` | Contabilidad financiera |
| `/cursos/auditoria-ii-13821` | `/curso-de-auditoria-ii` | Auditoría II |
| `/cursos/asistente-administrativo-21034` | `/curso-de-asistente-administrativo` | Asistente administrativo |
| `/cursos/planeacion-estrategica-9984` | `/curso-de-planeacion-estrategica` | Planeación estratégica |
| `/cursos/gestion-de-operaciones-10220` | `/curso-de-gestion-de-operaciones` | Gestión de operaciones |
| `/cursos/planeacion-estrategica-ii-9216` | `/curso-de-planeacion-estrategica-ii` | Planeación estratégica II |
| `/cursos/comunicacion-interna-en-organizaciones-16665` | `/curso-de-comunicacion-interna-en-organizaciones` | Comunicación interna en organizaciones |
| `/cursos/auditoria-iii-9983` | `/curso-de-auditoria-iii` | Auditoría III |
| `/cursos/gestion-del-talento-humano-22969` | `/curso-de-gestion-del-talento-humano` | Gestión del talento humano |
| `/cursos/gestion-del-cambio-organizacional-22970` | `/curso-de-gestion-del-cambio-organizacional` | Gestión del cambio organizacional |
| `/cursos/gestion-de-calidad-iv-15597` | `/curso-de-gestion-de-calidad-iv` | Gestión de calidad IV |
| `/cursos/crm-11166` | `/curso-de-crm` | CRM |
| `/cursos/tecnicas-de-reclutamiento-23107` | `/curso-de-tecnicas-de-reclutamiento` | Técnicas de reclutamiento |
| `/cursos/storytelling-16672` | `/curso-de-storytelling` | Storytelling |
| `/cursos/ventas-b2b-22605` | `/curso-de-ventas-b2b` | Ventas B2B |
| `/cursos/marketing-digital-14836` | `/curso-de-marketing-digital` | Marketing digital |
| `/cursos/buffer-15821` | `/curso-de-buffer` | Buffer |
| `/cursos/publicidad-16674` | `/curso-de-publicidad` | Publicidad |
| `/cursos/marketing-digital-ii-15351` | `/curso-de-marketing-digital-ii` | Marketing digital II |
| `/cursos/facebook-ads-16669` | `/curso-de-facebook-ads` | Facebook Ads |
| `/cursos/canva-15817` | `/curso-de-canva` | Canva |
| `/cursos/facebook-ads-ii-16675` | `/curso-de-facebook-ads-ii` | Facebook Ads II |
| `/cursos/publicidad-en-redes-sociales-16671` | `/curso-de-publicidad-en-redes-sociales` | Publicidad en redes sociales |
| `/cursos/ia-para-marketing-15497` | `/curso-de-ia-para-marketing` | IA para marketing |
| `/cursos/gestion-ambiental` | `/curso-de-gestion-ambiental` | Gestión ambiental |
| `/cursos/logistica-de-transporte-10005` | `/curso-de-logistica-de-transporte` | Logística de transporte |
| `/cursos/seguridad-y-salud-en-el-trabajo` | `/curso-de-seguridad-y-salud-en-el-trabajo` | Seguridad y salud en el trabajo |
| `/cursos/manejo-de-sustancias-quimicas-peligrosas-7431` | `/curso-de-manejo-de-sustancias-quimicas-peligrosas` | Manejo de sustancias químicas peligrosas |
| `/cursos/manejo-de-materiales-peligrosos-11814` | `/curso-de-manejo-de-materiales-peligrosos` | Manejo de materiales peligrosos |
| `/cursos/manipulacion-de-alimentos-22143` | `/curso-de-manipulacion-de-alimentos` | Manipulación de alimentos |
| `/cursos/prevencion-de-riesgos-laborales-prl-13572` | `/curso-de-prevencion-de-riesgos-laborales-prl` | Prevención de riesgos laborales (PRL) |
| `/cursos/derecho-ambiental-18433` | `/curso-de-derecho-ambiental` | Derecho ambiental |
| `/cursos/manejo-de-materiales-peligrosos-ii-13570` | `/curso-de-manejo-de-materiales-peligrosos-ii` | Manejo de materiales peligrosos II |
| `/cursos/responsabilidad-social-18430` | `/curso-de-responsabilidad-social` | Responsabilidad social |
| `/cursos/logistica-11723` | `/curso-de-logistica` | Logística |
| `/cursos/pedagogia-infantil-y-desarrollo-psicosocial-22459` | `/curso-de-pedagogia-infantil-y-desarrollo-psicosocial` | Pedagogía infantil y desarrollo psicosocial |
| `/cursos/estimulacion-temprana-22464` | `/curso-de-estimulacion-temprana` | Estimulación temprana |
| `/cursos/primera-infancia-22462` | `/curso-de-primera-infancia` | Primera infancia |
| `/cursos/tcc-para-la-ansiedad-22466` | `/curso-de-tcc-para-la-ansiedad` | TCC para la ansiedad |
| `/cursos/maquillaje-profesional-22593` | `/curso-de-maquillaje-profesional` | Maquillaje profesional |
| `/cursos/estilista-22595` | `/curso-de-estilista` | Estilista |
| `/cursos/tcc-para-la-depresion-22467` | `/curso-de-tcc-para-la-depresion` | TCC para la depresión |
| `/cursos/asesor-juridico-22765` | `/curso-de-asesor-juridico` | Asesor jurídico |
| `/cursos/excel-10219` | `/curso-de-excel` | Excel |
| `/cursos/mecanica-de-fluidos-22471` | `/curso-de-mecanica-de-fluidos` | Mecánica de fluidos |
| `/cursos/revit-22470` | `/curso-de-revit` | Revit |
| `/cursos/autocad-22469` | `/curso-de-autocad` | AutoCAD |
| `/cursos/arcgis-18432` | `/curso-de-arcgis` | ArcGIS |
| `/cursos/ingles-basico-a1-23935` | `/curso-de-ingles-basico-a1` | Inglés básico A1 |
| `/cursos/ingles-intermedio-b1-23936` | `/curso-de-ingles-intermedio-b1` | Inglés intermedio B1 |
| `/cursos/ingles-avanzado-b2-23937` | `/curso-de-ingles-avanzado-b2` | Inglés avanzado B2 |
| `/cursos/frances-basico-a1-23938` | `/curso-de-frances-basico-a1` | Francés básico A1 |
| `/cursos/portugues-basico-a1-23939` | `/curso-de-portugues-basico-a1` | Portugués básico A1 |
| `/cursos/gestion-de-calidad-v-11783` | `/curso-de-gestion-de-calidad-v` | Gestión de calidad V |
| `/cursos/gestion-de-calidad-vi-18252` | `/curso-de-gestion-de-calidad-vi` | Gestión de calidad VI |
| `/cursos/lean` | `/curso-de-lean` | Lean |

### Herramientas, dos competencias y curso en vivo (12)

| Antes | Ahora | Tipo |
| --- | --- | --- |
| `/herramientas/cv-builder` | `/herramientas/creador-de-hoja-de-vida` | herramienta |
| `/herramientas/analizador-ats` | `/herramientas/analizador-ats-de-hoja-de-vida` | herramienta |
| `/herramientas/correos-rrhh` | `/herramientas/plantillas-de-correo-para-recursos-humanos` | herramienta |
| `/herramientas/banco-vacantes` | `/herramientas/banco-de-vacantes-farmaceuticas` | herramienta |
| `/herramientas/linkedin` | `/herramientas/guia-para-mejorar-linkedin` | herramienta |
| `/herramientas/practicas` | `/herramientas/practicas-farmaceuticas` | herramienta |
| `/herramientas/emprende` | `/herramientas/emprendimiento-farmaceutico` | herramienta |
| `/herramientas/perfil-empresas` | `/herramientas/perfil-profesional-para-empresas` | herramienta |
| `/competencias/change-control` | `/competencias/control-de-cambios` | competencia |
| `/competencias/supplier-quality` | `/competencias/calidad-de-proveedores` | competencia |
| `/cursos/en-vivo/operacion-segura-servicio-farmaceutico` | `/curso-de-operacion-segura-del-servicio-farmaceutico` | curso en vivo |
| `/cursos-gratis` | `/cursos` | catálogo |

### Categorías de artículos (25 filtros → 24 páginas)

Antes eran un filtro del índice con el nombre en la dirección; ahora cada
categoría tiene su página. «Gestión de Calidad» y «Gestión de calidad» eran
dos filtros con el mismo contenido y quedaron en una sola.

| Antes | Ahora | Categoría |
| --- | --- | --- |
| `/articulos?categoria=Bajar%20de%20peso` | `/articulos/categoria/bajar-de-peso` | Bajar de peso |
| `/articulos?categoria=Nutrici%C3%B3n%20y%20recetas` | `/articulos/categoria/nutricion-y-recetas` | Nutrición y recetas |
| `/articulos?categoria=Enfermedades%20y%20s%C3%ADntomas` | `/articulos/categoria/enfermedades-y-sintomas` | Enfermedades y síntomas |
| `/articulos?categoria=Medicamentos` | `/articulos/categoria/medicamentos` | Medicamentos |
| `/articulos?categoria=Plantas%20medicinales` | `/articulos/categoria/plantas-medicinales` | Plantas medicinales |
| `/articulos?categoria=Homeopat%C3%ADa` | `/articulos/categoria/homeopatia` | Homeopatía |
| `/articulos?categoria=Asuntos%20regulatorios` | `/articulos/categoria/asuntos-regulatorios` | Asuntos regulatorios |
| `/articulos?categoria=Noticias%20farmac%C3%A9uticas` | `/articulos/categoria/noticias-farmaceuticas` | Noticias farmacéuticas |
| `/articulos?categoria=Farmacia%20y%20profesi%C3%B3n` | `/articulos/categoria/farmacia-y-profesion` | Farmacia y profesión |
| `/articulos?categoria=Farmacoterapia` | `/articulos/categoria/farmacoterapia` | Farmacoterapia |
| `/articulos?categoria=Feliz%20Sin%20Tiroides` | `/articulos/categoria/feliz-sin-tiroides` | Feliz Sin Tiroides |
| `/articulos?categoria=Atenci%C3%B3n%20Farmac%C3%A9utica` | `/articulos/categoria/atencion-farmaceutica` | Atención Farmacéutica |
| `/articulos?categoria=Gesti%C3%B3n%20de%20Calidad` | `/articulos/categoria/gestion-de-calidad` | Gestión de Calidad |
| `/articulos?categoria=Gesti%C3%B3n%20de%20calidad` | `/articulos/categoria/gestion-de-calidad` | Gestión de calidad |
| `/articulos?categoria=Emprendimiento` | `/articulos/categoria/emprendimiento` | Emprendimiento |
| `/articulos?categoria=Power%20BI` | `/articulos/categoria/power-bi` | Power BI |
| `/articulos?categoria=Auditor%C3%ADa` | `/articulos/categoria/auditoria` | Auditoría |
| `/articulos?categoria=Gesti%C3%B3n%20ambiental` | `/articulos/categoria/gestion-ambiental` | Gestión ambiental |
| `/articulos?categoria=Seguridad%20y%20salud%20en%20el%20trabajo` | `/articulos/categoria/seguridad-y-salud-en-el-trabajo` | Seguridad y salud en el trabajo |
| `/articulos?categoria=Gesti%C3%B3n%20de%20proyectos` | `/articulos/categoria/gestion-de-proyectos` | Gestión de proyectos |
| `/articulos?categoria=Lean` | `/articulos/categoria/lean` | Lean |
| `/articulos?categoria=Lean%20Six%20Sigma` | `/articulos/categoria/lean-six-sigma` | Lean Six Sigma |
| `/articulos?categoria=T%C3%A9cnicas%20de%20estudio` | `/articulos/categoria/tecnicas-de-estudio` | Técnicas de estudio |
| `/articulos?categoria=Profesiones` | `/articulos/categoria/profesiones` | Profesiones |
| `/articulos?categoria=Calidad%20farmac%C3%A9utica` | `/articulos/categoria/calidad-farmaceutica` | Calidad farmacéutica |

### Escuelas (4)

| Antes | Ahora | Escuela |
| --- | --- | --- |
| `/escuelas/salud` | `/escuelas/salud-y-farmacia-clinica` | Escuela de Salud y Farmacia Clínica |
| `/escuelas/calidad` | `/escuelas/calidad-y-produccion-farmaceutica` | Escuela de Calidad y Producción Farmacéutica |
| `/escuelas/regulatorios` | `/escuelas/asuntos-regulatorios` | Escuela de Asuntos Regulatorios |
| `/escuelas/marketing` | `/escuelas/marketing-y-comunicacion-farmaceutica` | Escuela de Marketing y Comunicación Farmacéutica |

### Páginas con un nombre abreviado o genérico (8)

| Antes | Ahora | Título de la página |
| --- | --- | --- |
| `/empleo/ofertas-qf` | `/empleo/ofertas-para-quimicos-farmaceuticos` | Ofertas para Químicos Farmacéuticos |
| `/empleo/correos` | `/empleo/plantillas-de-correo-para-recursos-humanos` | Plantillas de correo para recursos humanos |
| `/vocacion` | `/orientacion-vocacional` | Orientación vocacional para químicos farmacéuticos |
| `/linkedin` | `/linkedin-farmaceutico` | Mejora tu LinkedIn farmacéutico |
| `/practicas` | `/practicas-profesionales-farmaceuticas` | Prácticas profesionales farmacéuticas |
| `/emprendimientos` | `/emprendimiento-farmaceutico` | Emprendimiento farmacéutico: Lean Canvas |
| `/talento` | `/vitrina-de-talento-farmaceutico` | Vitrina de talento farmacéutico |
| `/empresas/talento` | `/empresas/recluta-talento-farmaceutico` | Recluta talento farmacéutico |

### Carreras (5)

| Antes | Ahora | Nombre |
| --- | --- | --- |
| `/carreras/aseguramiento-calidad` | `/carreras/aseguramiento-de-calidad` | Aseguramiento de calidad |
| `/carreras/control-calidad` | `/carreras/control-de-calidad` | Control de calidad |
| `/carreras/datos-farma` | `/carreras/datos-para-la-industria-farmaceutica` | Datos para la industria farmacéutica (antes «Datos y Pharma») |
| `/carreras/inteligencia-artificial-farma` | `/carreras/inteligencia-artificial-en-la-industria-farmaceutica` | Inteligencia artificial en la industria farmacéutica (antes «Inteligencia artificial y Pharma») |
| `/carreras/investigacion-desarrollo` | `/carreras/investigacion-y-desarrollo` | Investigación y desarrollo |

### Rutas (3)

| Antes | Ahora | Nombre |
| --- | --- | --- |
| `/rutas/quality-assurance-desde-cero` | `/rutas/aseguramiento-de-calidad-desde-cero` | Aseguramiento de calidad desde cero (antes «Quality Assurance desde cero») |
| `/rutas/regulatory-affairs` | `/rutas/asuntos-regulatorios` | Asuntos regulatorios (antes «Regulatory Affairs») |
| `/rutas/data-y-pharma` | `/rutas/datos-para-la-industria-farmaceutica` | Datos para la industria farmacéutica (antes «Data & Pharma») |

Además, las once rutas de la base tienen ahora su nombre, título,
descripción y resumen con tildes («Producción farmacéutica», «Formulación
cosmética»…): es lo que muestran la página y los buscadores. Solo se corrigió
la ortografía; la redacción es la misma.

### Competencias (23, más las 2 de la primera parte)

| Antes | Ahora | Nombre |
| --- | --- | --- |
| `/competencias/integridad-datos` | `/competencias/integridad-de-datos` | Integridad de datos |
| `/competencias/bpm-gmp` | `/competencias/buenas-practicas-de-manufactura` | Buenas Prácticas de Manufactura (BPM/GMP) |
| `/competencias/gestion-riesgos-calidad` | `/competencias/gestion-de-riesgos-de-calidad` | Gestión de riesgos de calidad |
| `/competencias/gestion-proyectos` | `/competencias/gestion-de-proyectos` | Gestión de proyectos |
| `/competencias/evidencia-cientifica` | `/competencias/lectura-critica-de-evidencia` | Lectura crítica de evidencia |
| `/competencias/sistemas-gestion-calidad` | `/competencias/sistemas-de-gestion-de-calidad` | Sistemas de gestión de calidad |
| `/competencias/analisis-datos` | `/competencias/analisis-de-datos` | Análisis de datos |
| `/competencias/capa-desviaciones` | `/competencias/desviaciones-y-capa` | Desviaciones y CAPA |
| `/competencias/diseno-experimentos` | `/competencias/diseno-de-experimentos` | Diseño de experimentos |
| `/competencias/estabilidad` | `/competencias/estudios-de-estabilidad` | Estudios de estabilidad |
| `/competencias/gobernanza-datos` | `/competencias/gobernanza-de-datos` | Gobernanza de datos |
| `/competencias/visualizacion-datos` | `/competencias/visualizacion-de-datos` | Visualización de datos |
| `/competencias/ia-aplicada` | `/competencias/inteligencia-artificial-aplicada` | Inteligencia artificial aplicada |
| `/competencias/evaluacion-causalidad` | `/competencias/evaluacion-de-causalidad` | Evaluación de causalidad |
| `/competencias/gestion-casos-seguridad` | `/competencias/gestion-de-casos-de-seguridad` | Gestión de casos de seguridad |
| `/competencias/investigacion-desarrollo` | `/competencias/investigacion-y-desarrollo` | Investigación y desarrollo |
| `/competencias/oos-oot` | `/competencias/resultados-fuera-de-especificacion-oos-y-oot` | Resultados fuera de especificación (OOS y OOT) |
| `/competencias/python-datos` | `/competencias/python-para-datos` | Python para datos |
| `/competencias/validacion-metodos` | `/competencias/validacion-de-metodos-analiticos` | Validación de métodos analíticos |
| `/competencias/validacion-procesos` | `/competencias/validacion-de-procesos` | Validación de procesos |
| `/competencias/seguridad-salud-trabajo` | `/competencias/seguridad-y-salud-en-el-trabajo` | Seguridad y salud en el trabajo |
| `/competencias/busqueda-empleo` | `/competencias/busqueda-de-empleo` | Búsqueda de empleo (antes «Busqueda de oportunidades») |
| `/competencias/cv-profesional` | `/competencias/hoja-de-vida-profesional` | Hoja de vida profesional (antes «CV profesional») |
| `/competencias/change-control` | `/competencias/control-de-cambios` | Control de cambios (primera parte) |
| `/competencias/supplier-quality` | `/competencias/calidad-de-proveedores` | Calidad de proveedores (primera parte) |

### Aula

| Antes | Ahora |
| --- | --- |
| `/aula/curso/53` | `/aula/curso-de-farmacoterapia-de-la-diabetes` |
| `/aula/curso/53/clase/812` | `/aula/curso-de-farmacoterapia-de-la-diabetes/clase/<nombre de la clase>` |
| `/aula/curso/53/recursos` | `/aula/curso-de-farmacoterapia-de-la-diabetes/recursos` |

Cada curso de Edvanta usa en el aula la misma dirección de su página
pública (tablas de arriba). Las clases toman el nombre de su título al
publicar; el aula es privada, así que esas direcciones no se indexan.

### Sin cambios (ya eran descriptivas)

- Los 193 artículos (`/articulos/<tema>`), los paquetes para instituciones,
  las áreas de capacitación para empresas (`/empresas/<área>`) y las
  carreras, rutas y competencias cuyo nombre ya estaba completo
  (`/carreras/farmacovigilancia`, `/competencias/power-bi`…).
- `/herramientas/orientacion-vocacional`, los catálogos `/cursos/coursera`,
  `/cursos/udemy` y `/cursos/edutin`, y las páginas con nombre claro de una
  palabra: `/noticias`, `/guias`, `/recursos`, `/oportunidades`,
  `/proyectos`, `/certificaciones`, `/comunidad` y `/conecta` (el nombre de
  ese espacio).
- Feliz Sin Tiroides, su Academia (`/academia/…`) y AtenFarmaClinic (no se
  tocaron).
- `/cursos?category=…` es un filtro del catálogo (su canonical es
  `/cursos`), no una página indexable aparte: no se creó una página nueva.

## 5. Verificación en producción (2026-10-28)

| Revisión | Resultado |
| --- | --- |
| `/curso/<id>` → 301 a la dirección nueva | 52/52 ✓ |
| `/cursos/<slug>` → 301 a la dirección nueva | 176/176 ✓ |
| Cada página de curso nueva: 200 directo, título, canonical, og:url, og:title, H1 y JSON-LD `Course` | 228/228 ✓ |
| Herramientas, competencias, curso en vivo y `/cursos-gratis` → 301 | 12/12 ✓ |
| Páginas de herramienta: 200, título, canonical, H1 y JSON-LD | 9/9 ✓ |
| Curso en vivo en su dirección nueva | 1/1 ✓ |
| Páginas de categoría: 200, título, canonical, H1 y JSON-LD | 24/24 ✓ |
| `/articulos?categoria=…` → 301 a su página | 25/25 ✓ |
| `/cursos-gratis/<código>` → 301 a la ficha del curso (`sh-7429`, `sh-20799`, `sh-22592`, también en mayúsculas) | 4/4 ✓ |
| La consulta (`?utm_source=…`, `?publico=…`) se conserva | 4/4 ✓ |
| Barra final y mayúsculas → 301 a la forma limpia | 5/5 ✓ |
| Lo que no existe → 404 con `noindex` | 3/3 ✓ |
| Catálogos y competencias renombradas responden 200 | 10/10 ✓ |
| Rutas de los cursos destacados = slug real de la base | 8/8 ✓ |
| Un solo salto: ningún destino vuelve a redirigir | 240 destinos revisados: ninguno es una dirección vieja ✓ |
| `/sitemap-cursos.xml` = cursos vigentes | 200 application/xml; charset=utf-8 · 228 cursos ✓ |
| `/sitemap.xml` sin direcciones viejas, y cada una responde 200 directo | 345 direcciones ✓ |
| `robots.txt` declara los dos sitemaps | ✓ |

En el navegador:

- `/curso/53` termina en `/curso-de-farmacoterapia-de-la-diabetes` con
  título, H1 y canonical correctos, y sigue igual al recargar.
- Las tarjetas de `/cursos` enlazan a direcciones nuevas (53 de 53, ninguna
  vieja); al hacer clic, la ficha abre en su dirección nueva.
- La búsqueda y las carreras devuelven direcciones nuevas.
- La categoría «Gestión de calidad» muestra sus 11 artículos; el artículo
  enlaza a su categoría y a los cursos por su dirección nueva.
- `/herramientas/cv-builder` y `/competencias/change-control` abren la
  página nueva con su contenido.

Antes de publicar, sobre exactamente lo que se confirmó: pruebas de la API
174/174, pruebas del sitio 121 de 124, y la compilación con sus 193
artículos y 34 páginas prerenderizadas. Las 3 pruebas que fallan son de
rachas (`src/__tests__/retos.test.jsx`) y no tienen que ver con las
direcciones: la versión confirmada toma el día en UTC y falla después de las
7 p. m. en Colombia.

## 6. Pendientes fuera del código

| Dónde | Qué |
| --- | --- |
| Google Search Console | Enviar `https://edvanta.co/sitemap-cursos.xml` y `https://edvanta.co/sitemap-profesional.xml`, y volver a enviar `https://edvanta.co/sitemap.xml` (`robots.txt` ya los declara; enviarlos acelera el rastreo). En las semanas siguientes, las viejas deben pasar a «Página con redirección» y las nuevas a indexadas. |
| Contenido (opcional) | Las descripciones de varias competencias siguen sin tildes (la de control de cambios dice «Evaluacion, aprobacion…»): salen en la descripción de los buscadores. Corregirlas es una revisión de texto, una por una. |
| Bing Webmaster Tools (si se usa) | Lo mismo. |
| Cloudflare | Nada: las direcciones viejas se servían con `no-store` y no quedaron en caché. Verificado que el 301, `robots.txt` y los sitemaps salen nuevos a través de Cloudflare. |
| Coolify | Nada obligatorio. `SPA_SHELL_URL` (opcional, en la API) solo hace falta si la API dejara de poder leer `https://edvanta.co/index.html`; hoy funciona y, si fallara, la ficha se arma en el navegador sin los metadatos en el HTML. |
| Redes sociales | Las vistas previas de enlaces viejos siguen el 301 solas. Para forzar las más compartidas: Sharing Debugger de Facebook o Post Inspector de LinkedIn. |

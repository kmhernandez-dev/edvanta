# Plan hacia 10.000 palabras clave

Meta de Karla: pasar de las 347 keywords orgánicas de la línea base (Semrush, 16-nov-2026) a **10.000 consultas con posicionamiento**. No se compra ni se simula: se construye con páginas fuertes, enlazadas, indexadas y con un embudo que convierte.

## La cuenta, sin humo

Una página fuerte, indexada y con meses de antigüedad suele aparecer en 20 a 50 consultas de cola larga. Para 10.000 hacen falta entre **250 y 400 páginas fuertes indexadas**. El sitio tiene unas 580 indexadas y 570 sin indexar (17-nov-2026). El cuello de botella no es escribir: es **indexar y enlazar**.

Por eso cada lote cumple cuatro condiciones:

1. **Una página responde una intención concreta.** No hay páginas de relleno ni artículos de 300 palabras.
2. **Cada página pertenece a un clúster**: un tema central, sus artículos satélite, su comunidad y su curso o guía.
3. **Cada artículo enlaza a 3 o más páginas del mismo clúster** y recibe enlaces desde la comunidad y desde el vademécum cuando existe la monografía.
4. **Cada artículo tiene una acción**: herramienta interactiva, comunidad por WhatsApp o curso/guía. Sin acción, no se publica.

## Los cuatro frentes

### 1. Indexar lo que ya existe
- Sitemap reenviado y solicitudes diarias en Search Console.
- IndexNow para Bing después de cada despliegue.
- Enlazado interno desde las comunidades nuevas a los artículos que ya posicionan.

### 2. Clústeres de enfermedad
Cada clúster tiene: **página de comunidad** (`/comunidades/:slug`), **artículos satélite** y **una herramienta interactiva**. La comunidad es la puerta comercial: WhatsApp, guía y curso.

### 3. Vademécum
Cada monografía captura «[medicamento] dosis», «[medicamento] efectos secundarios», «[medicamento] interacciones» y enlaza a su curso gratis y a su guía profesional. Es el contenido con más autoridad del sitio.

### 4. Formación y guías
Los cursos son gratuitos y con certificado; las guías se venden en Hotmart. El artículo nunca vende directo: educa, resuelve y ofrece el siguiente paso.

## Arquitectura del embudo

```text
Google / redes
   -> artículo de enfermedad o medicamento
      -> herramienta interactiva (marca síntomas, prepara la consulta, resuelve mitos)
         -> comunidad de WhatsApp de esa enfermedad (número +57 3006332244)
            -> guía de paciente (Hotmart) o app FST
   -> ficha de curso gratis (profesionales)
      -> clase abierta
         -> curso completo y certificado
```

Reglas del embudo:

- La herramienta no diagnostica ni prescribe. Ordena información y prepara la consulta.
- La comunidad no reemplaza al equipo tratante. Tiene reglas y moderación.
- La guía se muestra solo cuando existe y se dice para quién es.
- El curso se ofrece como formación gratuita, no como consulta médica.

## Clústeres y estado

| # | Clúster | Comunidad | Artículos | Curso principal | Estado |
|---|---|---|---|---|---|
| 1 | Tiroides | `/comunidades/tiroides` | 70 | Autocuidado de la tiroides | En producción |
| 2 | Hipertensión | `/comunidades/hipertension-arterial` | 11 | Farmacoterapia de la HTA | En producción |
| 3 | Diabetes tipo 2 | `/comunidades/diabetes-tipo-2` | 6 | Farmacoterapia de la Diabetes | En producción |
| 4 | Colesterol y triglicéridos | `/comunidades/colesterol-alto` | 8 | Farmacología Cardiovascular | **Lote 17-nov** |
| 5 | Insuficiencia cardíaca | `/comunidades/insuficiencia-cardiaca` | 5 | Farmacoterapia de la IC | En producción |
| 6 | Asma | `/comunidades/asma` | 3 | Asma y EPOC | En producción |
| 7 | EPOC | `/comunidades/epoc` | 2 | Asma y EPOC | En producción |
| 8 | Obesidad | `/comunidades/obesidad` | 7 | Farmacología Endocrina | En producción |
| 9 | Hígado graso | `/comunidades/higado-graso` | 2 | Farmacología Gastrointestinal | En producción |
| 10 | Gastritis y reflujo | `/comunidades/gastritis-y-reflujo` | 5 | Farmacología Gastrointestinal | **Lote 17-nov** |
| 11 | Colon irritable | `/comunidades/colon-irritable` | 2 | Farmacología Gastrointestinal | **Lote 17-nov** |
| 12 | Estreñimiento | `/comunidades/estrenimiento` | 3 | Farmacología Gastrointestinal | **Lote 17-nov** |
| 13 | Infección urinaria | `/comunidades/infeccion-urinaria` | 3 | Farmacología Renal | En producción |
| 14 | Artrosis y dolor crónico | `/comunidades/artrosis-y-dolor-cronico` | 8 | Farmacología del SNC | **Lote 17-nov** |
| 15 | Migraña | `/comunidades/migrana` | 3 | Farmacología del SNC | En producción |
| 16 | Ansiedad e insomnio | `/comunidades/ansiedad-e-insomnio` | 4 | Psicofarmacología | En producción |
| 17 | Gota y ácido úrico | `/comunidades/gota-y-acido-urico` | 4 | Farmacología Renal | **Lote 17-nov** |
| 18 | Enfermedad renal crónica | `/comunidades/enfermedad-renal-cronica` | 4 | Farmacología Renal | **Lote 17-nov, ampliado** |
| 19 | Fibrilación auricular y anticoagulación | `/comunidades/fibrilacion-auricular` | 5 | Farmacología Cardiovascular | **Lote 17-nov, ampliado** |
| 20 | Salud mental | `/comunidades/salud-mental` | 6 | Psicofarmacología | **Lote 17-nov, ampliado** |
| 21 | Piel y dermatología | `/comunidades/piel-y-dermatologia` | 3 | Cursos de farmacia | **Lote 17-nov, ampliado** |
| 22 | Osteoporosis y menopausia | `/comunidades/osteoporosis-y-menopausia` | 3 | Farmacología Endocrina | **Lote 17-nov, ampliado** |
| 23 | Cálculos renales | `/comunidades/calculos-renales` | 3 | Farmacología Renal | **Lote 17-nov, ampliado** |

Los clústeres 24 a 36 (alergia, pediatría, embarazo, dolor neuropático, antibióticos, tiroides avanzada, salud metabólica, adultos mayores, medicina de familia, salud sexual y apnea del sueño) se escriben en los siguientes lotes, con el mismo patrón.

## Cómo se mide cada clúster

| Indicador | Dónde | Meta |
|---|---|---|
| Consultas con impresiones por URL | Search Console | 20 a 50 por página fuerte |
| Clics al botón de comunidad | evento `community_join_clicked` | 3 % a 8 % de lectores |
| Herramienta completada | evento `article_tool_completed` | 25 % de quienes la abren |
| Clic a curso o guía | `course_clicked` / `guide_clicked` | 2 % a 5 % |
| Ingresos a la comunidad | WhatsApp (Karla) | 10 a 30 por semana al inicio |
| Matrículas al curso | Aula Edvanta | atribución por `utm_source=articulo` |

## Lote del 17 de noviembre de 2026

- **Comunidades:** 23 páginas de enfermedad con reglas, qué se encuentra, artículos, curso, guía y WhatsApp. Hub en `/comunidades`.
- **Herramientas interactivas:** checklist de signos de alarma, preparación de la consulta y mitos, integradas en los artículos del clúster.
- **Artículos nuevos:** colesterol, triglicéridos y estatinas; reflujo, colon irritable y estreñimiento; artrosis, rodilla y fibromialgia; gota y alopurinol; enfermedad renal, creatinina y dieta renal; fibrilación auricular, anticoagulantes y warfarina; depresión, insomnio y pánico; acné, dermatitis y hongos; osteoporosis, menopausia, calcio y vitamina D; cálculos renales y su dieta.
- **Vademécum:** dapagliflozina y gliclazida en diabetes tipo 2; finerenona y nuevo grupo de enfermedad renal crónica, con dosis, potasio, evidencia FIDELIO, FIGARO y FINEARTS.

Todos los artículos de salud entran en `noindex,follow` hasta que Karla anote su revisión en `src/data/revisionClinica.js`. Las comunidades se indexan porque no dan consejo clínico individual.

### 18-nov-2026: aprobado e indexable

Karla respondió por escrito: «He revisado y apruebo, indexa y enlaza». Se registraron los **28 artículos** de los clústeres nuevos y las **4 páginas del vademécum** (grupo renal, finerenona, dapagliflozina y gliclazida) en `revisionClinica.js`.

El mismo 18-nov-2026 aprobó el lote completo: **200 artículos de la biblioteca de salud**, **10 fichas «para qué sirve»**, **16 casos clínicos nuevos**, **3 exámenes clínicos** y **12 exámenes avanzados**. El build quedó con **1.229 URLs** en los sitemaps: **535 artículos** y **684 páginas**. Todo sale `index,follow`, con revisor y fecha.

Falta el paso de producción: desplegar, verificar las URLs con `curl`, enviar el sitemap a Search Console y avisar a Bing con `node scripts/indexnow.mjs --desde=2026-11-17`. No se envía IndexNow antes de desplegar para no avisar de URLs que aún no existen en `edvanta.co`.

## Biblioteca de salud: 200 artículos «para qué sirve» (18-nov-2026)

- **Hub `/salud`** indexable y **200 artículos**: 70 plantas medicinales, 20 vitaminas y minerales, 46 suplementos, 44 medicamentos y 20 productos de cuidado.
- Cada artículo responde «para qué sirve», precauciones, evidencia disponible, cuándo consultar y fuentes para ampliar. Sin dosis ni promesas de cura.
- **Estado:** los 200 artículos fueron aprobados por Karla el 18-nov-2026, salen `index,follow` y están en el sitemap (`REVISION_BIBLIOTECA` en `src/data/salud/biblioteca.js`).
- **Keywords objetivo:** «[planta] para qué sirve», «[vitamina] para qué sirve», «[medicamento] para qué sirve», «[suplemento] para qué sirve» y «[producto] para qué sirve».

## Fichas rápidas de medicamentos (18-nov-2026)

- **Hub `/medicamentos`** indexable y **100 fichas** de medicamentos: AINE, antibióticos, antifúngicos, antivirales, cardiovascular, diabetes, respiratorio, digestivo, salud mental y otros.
- Cada ficha trae para qué sirve, cuidados, efectos frecuentes, cuándo consultar y enlaces a CIMA, DailyMed y MedlinePlus. Sin dosis personalizadas.
- **Estado:** las 100 fichas fueron aprobadas por Karla el 18-nov-2026, salen `index,follow` y están en el sitemap. El hub también es indexable.
- **Keywords objetivo:** «[medicamento] para qué sirve», «[medicamento] efectos secundarios», «[medicamento] cuidados», «ficha de [medicamento]».

## Fichas «para qué sirve» (18-nov-2026)

El patrón que mejor rinde es la ficha «[medicamento] para qué sirve»: la de diclofenaco concentraba el 97 % de las visitas orgánicas y la de amoxicilina posicionaba 15 keywords. Se replicó con **10 medicamentos de alta búsqueda** que aún no tenían ficha para pacientes:

- semaglutida, tirzepatida, empagliflozina y dapagliflozina;
- rosuvastatina, apixabán y prednisona;
- salbutamol, fluconazol y levotiroxina.

Cada ficha sigue el mismo molde: qué es, para qué sirve, cómo se usa, efectos adversos, interacciones, embarazo, cuándo consultar, preguntas frecuentes y fuentes. Enlazan al vademécum, al curso, a la guía, al examen y a la comunidad del tema. **Estado:** aprobadas por Karla el 18-nov-2026; salen `index,follow` y están en el sitemap.

## Capa de exámenes interactivos (18-nov-2026)

- **Hub `/examenes`** indexable y **11 exámenes** de 10 preguntas cada uno: farmacología general, hipertensión, diabetes tipo 2, antibióticos, atención farmacéutica, farmacovigilancia, insuficiencia cardíaca, asma/EPOC, farmacología cardiovascular, calidad farmacéutica y asuntos regulatorios.
- Cada examen tiene corrección en el navegador, puntaje, explicación por pregunta, clave de respuestas visible para estudiar y enlaces al curso, la guía, los artículos y el vademécum.
- **110 preguntas** con fuente y `Quiz` en datos estructurados. Los artículos enlazan al examen de su tema y los exámenes enlazan de vuelta.
- Keywords objetivo: «examen de farmacología», «preguntas de hipertensión con respuestas», «test de diabetes», «examen de antibióticos», «examen de insuficiencia cardíaca», «examen de asma y EPOC», «examen de calidad farmacéutica», «examen de asuntos regulatorios».
- Estado: los once exámenes están aprobados e indexados. Calidad farmacéutica y asuntos regulatorios son no clínicos y se publican con revisión editorial; el resto lleva revisión clínica de Karla. La hoja está en `seo/revision-clinica/examenes-18-nov-2026.md`.

## Exámenes avanzados del parcial final de farmacología (18-nov-2026)

Doce exámenes de **120 preguntas** construidos a partir de los bloques del material de clase:

- `examen-avanzado-de-farmacologia-cardiovascular`: insuficiencia cardíaca, digoxina, diuréticos, nitratos, SRAA, betabloqueantes y anticoagulación.
- `examen-avanzado-de-farmacologia-oncologica`: antimetabolitos, tubulina, topoisomerasas, alquilantes, platinos, terapia dirigida e inmunoterapia.
- `examen-avanzado-de-antibacterianos`: betalactámicos, síntesis proteica, quinolonas, antifolatos, polimixinas y resistencia.
- `examen-avanzado-de-diabetes`: insulinas, sulfonilureas, metformina, glitazonas, incretinas, iSGLT2 y cetoacidosis.
- `examen-avanzado-de-asma`: beta-2 agonistas, corticoides, teofilina, antileucotrienos, omalizumab y exacerbación grave.
- `examen-avanzado-de-hemostasia`: antiagregantes, warfarina, heparinas, fondaparinux, trombolíticos y reversión.
- `examen-avanzado-de-cardiologia-aguda`: síndrome coronario agudo, edema pulmonar, arritmias, crisis hipertensiva e inotrópicos.
- `examen-avanzado-de-oncologia-de-soporte`: neutropenia febril, lisis tumoral, antieméticos, extravasación e inmunoterapia.
- `examen-avanzado-de-infecciones-bacterianas`: sepsis, meningitis, endocarditis, neumonía hospitalaria, PK/PD y resistencia.
- `examen-avanzado-de-diabetes-y-comorbilidades`: enfermedad renal, insuficiencia cardíaca, embarazo, glucocorticoides y cetoacidosis.
- `examen-avanzado-de-asma-y-epoc`: MART, biológicos, EPOC estable y exacerbado, técnica inhalatoria y corticoides.
- `examen-avanzado-de-trombosis-y-anticoagulacion`: TVP, cáncer, embarazo, prótesis valvular, perioperatorio y reversión.

**Estado:** los 12 exámenes están registrados en `REVISION_EXAMENES`, salen `index,follow`, entran al sitemap y se enlazan entre sí. El hub `/examenes` muestra los 23 exámenes y el `Quiz` JSON-LD de cada página incluye las 10 preguntas.

## Riesgos y reglas que no se rompen

- No se inventan URLs de grupos de WhatsApp que no existen. Donde no hay grupo, el botón abre el WhatsApp de Karla con un mensaje de bienvenida y ella incorpora a la persona.
- No se prometen curas, resultados ni número de pacientes en la comunidad.
- No se publican dosis personalizadas; solo rangos de ficha técnica y con cita.
- No se indexa contenido clínico sin revisión.
- Si una página no aporta una respuesta propia, no se escribe: se mejora la que existe.

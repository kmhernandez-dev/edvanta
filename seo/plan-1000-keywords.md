# Plan hacia 3.000 palabras clave

Meta de Karla: pasar de unas 54 a 1.000 consultas con impresiones en Search Console (12-nov-2026), y luego a **3.000** (nueva meta, 12-nov-2026 por la noche).

## Hacia 3.000: la cuenta nueva

Con 10 a 40 consultas por página fuerte indexada, 3.000 consultas piden entre 100 y 300 páginas indexadas y con algunos meses de antigüedad. El sitio ya tiene unas 650 direcciones en el sitemap del frontend y 238 cursos en el de la API, pero Google tenía 309 indexadas el 8-nov. Por eso la meta se apoya en tres frentes:

1. **Indexar lo que ya existe (lo más rápido).**
   - Desde el 12-nov ya no queda ningún artículo en noindex por revisión: Karla aprobó el grupo de presión alta y el vademécum («ya los leí y apruebo todos»).
   - Avisos a buscadores después de cada despliegue:
     - sitemap reenviado en Search Console;
     - unas 10 solicitudes diarias de indexación, por prioridad;
     - IndexNow para Bing con todas las direcciones: `node scripts/indexnow.mjs`, o con `--desde=AAAA-MM-DD` para enviar solo las nuevas.
2. **Escribir lo que más rinde.**
   - El vademécum de antimicrobianos: 2.000 keywords en 93 páginas (ver el punto 7 de los siguientes lotes).
   - Nuevos grupos del vademécum, siempre con revisión clínica.
   - Las competencias y rutas que siguen delgadas.
3. **Ganar autoridad.**
   - El kit de enlaces para universidades, pendiente de enviar.
   - Perfiles de marca con `sameAs`.

**Orden de las solicitudes en Search Console (unas 10 por día):**

1. `/vademecum`, los 6 grupos y las monografías de más búsqueda: semaglutida, tirzepatida, metformina, losartán y atorvastatina.
2. Los 8 artículos de presión alta y las monografías restantes.
3. `/cursos` y sus tres páginas por plataforma.
4. Las 6 últimas noticias reescritas y los artículos de «Mejores cursos» sin pedir.
5. Lo que el informe de Páginas siga mostrando como «Descubierta».

**Registro de avisos a buscadores:**

- **12-nov (noche), IndexNow:** 1.038 direcciones enviadas a Bing (HTTP 200). El primer envío dio 403 porque la clave aún no estaba verificada.
- **12-nov (noche), Search Console:** `sitemap.xml` reenviado. Justo después de enviar figuró «No se ha podido obtener», que es el estado mientras Google lo procesa; el archivo responde 200 como XML.
- **12-nov (noche), indexación solicitada para 11 URL** antes de la cuota:
  - `/vademecum` y los grupos de obesidad e hipertensión;
  - las monografías de semaglutida, tirzepatida, metformina, losartán y atorvastatina;
  - los artículos de presión arterial por edad y de medicamentos para la presión alta;
  - `/cursos`, que **ya figura como «La URL está en Google»**.
- **13-nov, 9:30:** la cuota seguía agotada. Google cuenta 24 horas desde las solicitudes de la noche anterior, no desde la medianoche. La lista pasa a la noche del 13-nov o a la mañana del 14-nov.
- **Lista pendiente:**
  - artículos: crisis hipertensiva, cómo tomar la presión en casa, alimentos para bajar la presión alta, amlodipino, hidroclorotiazida y presión alta en el embarazo;
  - grupos: diabetes, dislipidemia, anticoagulantes y oncología;
  - lote 1 de antimicrobianos: 15 páginas nuevas (7 fichas y 8 del vademécum), revisadas el 13-nov;
  - `/cursos/coursera`, `/cursos/edutin` y `/cursos/udemy`.
- **13-nov, datos estructurados:** Search Console marcaba como no válida la ProfilePage de la autora: `mainEntity` era solo un `@id`. Se corrigió (commit ae9c74e), junto con el FAQPage de recursos para estudiantes, que no tenía `@context`. Falta validar la corrección en Search Console.
- **13-nov, lote 1 de antimicrobianos revisado y aprobado por Karla:** 7 fichas `/articulos/[dci]-para-que-sirve` y 8 páginas del vademécum (grupo «Antibióticos de uso ambulatorio» y 7 monografías), ya indexables y en el sitemap. Se avisaron 17 URLs a Bing por IndexNow (HTTP 200), incluidas amoxicilina y azitromicina por los CTA nuevos. Quedan pendientes de Search Console cuando se restablezca la cuota.
- **13-nov, lote 2 de antimicrobianos y clases:** 8 fichas nuevas (secnidazol, dicloxacilina, claritromicina, ceftriaxona, penicilina benzatínica, levofloxacino, doxiciclina y fosfomicina) y 7 clases de antibióticos (cefalosporinas, penicilinas, macrólidos, quinolonas, tetraciclinas, nitroimidazoles y betalactámicos). Son 15 páginas nuevas, **en noindex hasta la revisión clínica de Karla**. Las clases cubren las 188 keywords de «Clases de antibióticos» del CSV.

## Dónde estamos (28 días al 10-nov-2026)

- **Consultas con impresiones:** 58. **Clics:** 27. **Impresiones:** 982. **Posición media:** 9,3.
- **Lo que mejor rinde:**
  - noticias de medicamentos nuevos: pritelivir, Foundayo y Mynzepli, en posiciones 2 a 9;
  - levotiroxina, en posición 3;
  - las guías nuevas de cursos: «curso gmp gratis» (6 a 8), «cursos de hplc gratis» (13) y «curso de validaciones» (13).
- **Búsquedas grandes donde estábamos lejos:**
  - seguridad y salud en el trabajo: posición 56 a 70;
  - carrera de farmacia: 91 a 100;
  - Power BI: 97;
  - diabetes: 68;
  - telemedicina: 58.

  El blog «Mejores cursos» se escribió para estas búsquedas.
- **Search Console (12-nov):** marca «té verde y tiroides» con un aumento fuerte de impresiones.

## La cuenta

Una página sólida, ya indexada y con unos meses, suele aparecer en 10 a 40 consultas de cola larga. Para llegar a 1.000 consultas hacen falta entre 50 y 100 páginas fuertes **indexadas**, además de las que ya rinden. El cuello de botella no es escribir, sino que Google indexe: hay 309 páginas indexadas y más de 600 sin indexar. Por eso cada lote va acompañado de:

- **Solicitudes de indexación:** unas 10 al día.
- **Enlaces externos:** el kit de enlaces para universidades.
- **Enlaces internos:** cada artículo nuevo enlaza fichas de curso, guías y otros artículos.

## Hecho

| Fecha | Lote | Páginas |
|---|---|---|
| 11-nov | Guías por área y de calidad (lotes 1 y 2) | 16 |
| 11-nov | Guías de control de calidad y validaciones (lote 3) | 11 |
| 11-nov | Enfermedades, autora y categorías con contenido en el servidor | 31 |
| 11-nov | Recursos para estudiantes de Química Farmacéutica | 1 |
| 12-nov | Blog «Mejores cursos» | 8 |
| 12-nov | Guías editoriales de cursos curados, lote 2 (Coursera y Edutin de salud) | 12 fichas, de unas 165 a unas 500 palabras |
| 12-nov | Enlaces de afiliado con `rel="sponsored nofollow"` en los artículos (Udemy, Coursera e Edutin) | Todo el blog |
| 12-nov | Noticias reescritas, lote 3: pritelivir, Ort-Flx, Anktiva, Mynzepli y 4 alertas de productos con ingredientes ocultos | 8 (noindex: 88 → 80) |
| 12-nov | Mejores cursos, lote 2, con enlaces de afiliado directos | 6 |
| 12-nov | Noticias reescritas, lote 4: deuruxolitinib, Casgevy desde 5 años, Evrysdi Go, icotrokinra, plozasiran y daraxonrasib | 6 (noindex: 80 → 74) |
| 12-nov | Mejores cursos, lote 3: nutrición, primeros auxilios y pediatría, Excel, marketing farmacéutico, gestión de proyectos y logística | 6 |
| 12-nov | Noticias reescritas, lote 5: sugemalimab, telisotuzumab, Elfabrio, axatilimab, Brytly, triheptanoína, catumaxomab y lercanidipino | 8 (noindex: 74 → 66) |
| 12-nov | Mejores cursos, lote 4: urgencias y ACLS, talento humano, Facebook Ads y Canva, TCC, Claude Code y primera infancia | 6 |
| 12-nov | Guías de tema, lote 4a: farmacovigilancia (seguridad, eventos adversos, señales, PGR y ensayos clínicos) | 5 (noindex: 66 → 61) |
| 12-nov | Guías de tema, lote 4b: FDA, EMA, CTD, dispositivos médicos y etiquetado y publicidad | 5 (noindex: 61 → 56) |
| 12-nov | Guías de tema, lote 4c: estériles, sólidas, empaque y serialización, transferencia y desarrollo de medicamentos | 5 (noindex: 56 → 51) |
| 12-nov | Guías de tema, lote 5: descubrimiento, formulación, preclínicos, desarrollo analítico, Power BI, Python, IA y evidencia del mundo real. **Las 50 guías tienen texto propio.** | 8 (noindex: 51 → 43) |
| 12-nov | Texto editorial de las 11 carreras (día a día, normas, cómo prepararse y FAQPage) | 11 páginas, de unas 150 a unas 430 palabras |
| 12-nov | Grupo temático de presión alta: valores por edad, tomarla en casa, alimentos, amlodipino, hidroclorotiazida, crisis hipertensiva, embarazo y medicamentos, enlazados desde la guía principal | 8, **en noindex hasta la revisión clínica de Karla** |
| 12-nov | Mejores cursos: cursos de hipertensión para profesionales de la salud | 1 (indexable) |
| 12-nov | **Vademécum de Edvanta:** grupo de obesidad y 6 monografías (semaglutida, tirzepatida, liraglutida, orlistat, naltrexona/bupropión y setmelanotida), con farmacoquímica, farmacocinética, evidencia, regulación colombiana, atención farmacéutica de Minnesota y referencias Vancouver. Enlazado desde 6 artículos y el footer. | 7 páginas, **en noindex hasta la revisión clínica de Karla** |
| 12-nov | **Vademécum, grupo de hipertensión:** 4 monografías (losartán, enalapril, amlodipino e hidroclorotiazida), con LIFE, RENAAL, SOLVD y ALLHAT, combinaciones, monitorización y atención farmacéutica. Enlazado desde 6 artículos de presión alta. | 5 páginas, **en noindex hasta la revisión clínica de Karla** |
| 12-nov | **Vademécum, grupo de diabetes tipo 2:** 3 monografías (metformina, empagliflozina y sitagliptina), con UKPDS 34, EMPA-REG, EMPA-KIDNEY, EMPEROR y TECOS, ajuste renal y atención farmacéutica. Enlazado desde 4 artículos de diabetes. | 4 páginas, **en noindex hasta la revisión clínica de Karla** |
| 12-nov | **Vademécum, grupo de oncología de alto costo:** 3 monografías (trastuzumab, imatinib y pembrolizumab), con evidencia de Slamon 2001, HERA, ToGA, IRIS, GIST, KEYNOTE-006, KEYNOTE-024 y KEYNOTE-189, trazabilidad y toxicidad. Enlazado desde 7 artículos de oncología. | 4 páginas, **en noindex hasta la revisión clínica de Karla** |
| 12-nov | **Vademécum, grupo de dislipidemia:** 3 monografías (atorvastatina, rosuvastatina y ezetimiba), con ASCOT-LLA, TNT, JUPITER, IMPROVE-IT, SHARP y el metaanálisis CTT, metas de LDL y seguridad muscular. Enlazado desde 3 artículos de colesterol. | 4 páginas, **en noindex hasta la revisión clínica de Karla** |
| 12-nov | **Vademécum, grupo de anticoagulación:** warfarina, apixabán y rivaroxabán, con el metaanálisis de Hart, ARISTOTLE, AVERROES, ROCKET AF, EINSTEIN-PE, la guía ACC/AHA 2023, control del INR, ajuste renal e interacciones. Enlazado desde 2 artículos de anticoagulación. | 4 páginas, **en noindex hasta la revisión clínica de Karla** |
| 12-nov | Noticias reescritas: las últimas 6 (CHMP de Kyinsu, vacuna H5N1, Talvey, Tryngolza y Tukysa; informe ARC de la FDA) | 100 de 100; noindex por plantilla: 6 → 0 |
| 12-nov | Mejores cursos, lote 5: microbiota y salud digestiva, contabilidad y administración de droguerías, gestión de calidad por niveles y radiología | 4 (31 en total) |
| 13-nov | **Antimicrobianos, lote 1:** 7 fichas para pacientes y el grupo «Antibióticos de uso ambulatorio» con 7 monografías; CTA profesionales añadidos a amoxicilina y azitromicina. Revisado por Karla el 13-nov. | 15 páginas nuevas, indexables; 17 URLs avisadas por IndexNow |
| 13-nov | **Antimicrobianos, lote 2 y clases:** 8 fichas (secnidazol, dicloxacilina, claritromicina, ceftriaxona, penicilina benzatínica, levofloxacino, doxiciclina y fosfomicina) y 7 clases de antibióticos con enlazado cruzado. | 15 páginas nuevas, en noindex hasta la revisión clínica de Karla |

**Riesgo resuelto (12-nov):** las noticias de pritelivir, Ort-Flx, Anktiva y Mynzepli ya posicionaban (posiciones 2 a 9) y seguían en noindex. Al rastrearlas de nuevo, Google las habría sacado del índice. Ya tienen contenido propio y `index,follow`. La de pritelivir se pidió a Search Console; la cuota del día se agotó.

**Hito (12-nov):** las 100 noticias del paquete ya tienen contenido propio. No queda ninguna noticia en plantilla y noindex.

**Solicitudes pendientes de indexación (unas 10 por día):**

1. Las 6 noticias recién reescritas: Kyinsu, H5N1, Talvey, Tryngolza, Tukysa y el informe ARC de la FDA.
2. Los 4 artículos del lote 5 de «Mejores cursos». Empezar por microbiota, contabilidad de droguerías y radiología.
3. Los artículos de «Mejores cursos» de los lotes 1 a 4 que aún no se hayan pedido.
4. Las 50 guías de tema y las 176 fichas de cursos curados, si no se pidieron en su momento.
5. El vademécum (29 páginas con la portada) y el grupo de presión alta (8): revisados por Karla el 12-nov, ya indexables. Van primero en el orden de arriba.

## Siguientes lotes, en orden de rendimiento esperado

1. **Hecho (12-nov): revisión clínica.** Karla aprobó el vademécum (28 páginas: seis grupos —obesidad, hipertensión, diabetes, oncología, dislipidemia y anticoagulación— y 22 monografías) y el grupo de presión alta (8). Quedó anotado en `REVISION_VADEMECUM` y `REVISION_CLINICA`; falta pedirlas en Search Console. Es el lote con más potencial: contenido profundo y búsquedas de medicamentos.
2. **Competencias y rutas.** 50 competencias y 11 rutas con texto propio en `api/lib/textos-perfiles/` (las carreras ya lo tienen). Son páginas ya existentes y delgadas; darles texto mejora su indexación sin crear URLs nuevas.
3. **Vademécum, nuevos grupos.** Presión baja y más monografías oncológicas, con el mismo estándar. Obesidad, hipertensión, diabetes, oncología, dislipidemia y anticoagulación ya están hechos. Cada grupo requiere revisión clínica antes de indexarse.
4. **Mejores cursos, lote 6.** Completar los 2 temas que faltan del lote 5 y sumar los que no canibalicen: farmacia clínica para regentes, servicio al cliente en farmacia y cursos de hematología, entre otros.
5. **Levotiroxina y tiroides.** Las preguntas concretas ya aparecen en posición 3. Cada artículo nuevo requiere la revisión clínica de Karla.
6. **Guías editoriales de cursos curados:** completadas (176 de 176). No queda pendiente.
7. **Vademécum de antimicrobianos (J01).** Lote 1 indexado el 13-nov (15 páginas). Lote 2 escrito el 13-nov: 8 fichas y 7 clases de antibióticos, en noindex hasta la revisión de Karla. Cuando apruebe, se anotan en `revisionClinica.js` y se piden a Search Console. Sigue el lote 3 (venta profesional y BOFU) en `seo/vademecum-antimicrobianos.md`. Reparto con Open Code en `seo/vademecum-asignaciones.md`.

## Cómo se mide

- **Cada lunes,** en Rendimiento (28 días): consultas, clics, impresiones y posición. Se anota en `seo/medicion.md`.
- **Indicadores:**
  - principal: número de consultas con impresiones;
  - de apoyo: páginas indexadas, en el informe de Páginas.

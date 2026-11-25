# Meta de 3.000 keywords: registro de bloques

Pedido de Karla (21-nov-2026): «La meta es construir 3000 keywords… posicionar los cursos para generar ventas, escribiendo SEO en las clases, escribiendo SEO en los blogs, rellenando los artículos que tengan poquito texto… SEO para que se unan los pacientes a las comunidades… y GEO».

## Línea base

| Fuente | Fecha | Dato |
|---|---|---|
| Search Console | 10-nov-2026 | 58 consultas con impresiones (28 días) |
| Semrush (proyecto) | 16-nov-2026 | 347 keywords orgánicas, 816 visitas, 267 backlinks |

El indicador es el número de consultas con impresiones en Search Console (Rendimiento, 28 días) y las keywords orgánicas de Semrush. Se mide cada lunes y se anota abajo.

## Bloques

| Fecha | Bloque | Estado |
|---|---|---|
| 21-nov | Cursos propios sin «gratis» en clases (367 títulos y descripciones), casos clínicos, vademécum, artículos y comunidades (b2ad337) | En vivo y verificado |
| 21-nov | Ampliación de 8 pilares para pacientes (dengue, gastritis, infección urinaria, migraña, anemia, hígado graso, gripa y resistencia a la insulina): de unas 560 a unas 770 palabras, con preguntas de cola larga, enlace a su comunidad y a su caso clínico | En vivo (3e887ed), aprobado por Karla el 21-nov; verificado en producción (indexables, en sitemap, FAQPage) e IndexNow 8 URLs |
| 21-nov | GEO: `llms.txt` con 66 casos clínicos, 23 exámenes, 23 comunidades y 8 pilares (generador `scripts/llms-salud.mjs`; volver a correrlo al agregar o revisar contenido) y precios del curso de pago (`scripts/llms-cursos.mjs` regenerado) | En vivo (c686204); 123 enlaces nuevos responden 200 |
| 21/22-nov | Comunidades como «grupo de apoyo de [enfermedad]»: título, descripción, preguntas frecuentes (FAQPage) y 12 artículos más enlazados (f8fc2e5); la otra sesión lo afinó con el autocompletado de Google y 58 artículos FST (131d9aa) | En vivo; IndexNow enviado por la otra sesión |
| 22-nov | Clases abiertas: sección «Lo que sigue en el curso» por clase (clases de la misma unidad, unidades que siguen) y 4 preguntas del curso con certificado en el HTML y en el mismo FAQPage de la clase; sin precios fijos (221eb47) | En vivo; verificado en navegador; IndexNow 1.583 URLs de clases |
| 22-nov | Fichas: preguntas con la búsqueda del curso («¿El curso de X es online?», «¿Cuánto dura…?», «¿Qué aprendo…?», validez del certificado), FAQPage y fuera «Acceso gratis al contenido» en cursos de pago (5c5d2ac) | En vivo |
| 24-nov | Mapa de keywords de cursos: 23.084 búsquedas reales del autocompletado de Google (es-CO) para los 63 cursos propios, en `seo/keywords-cursos.csv`; las de compra alimentan la ficha (pregunta «¿Hay un curso de X gratis?» y `keywords` del Course) y las de cada clase su LearningResource | Ver «Keywords de cursos» abajo |

## Artículos delgados que quedan (menos de 600 palabras, 21-nov)

- 90 noticias farmacéuticas (de 365 a 600 palabras). Son de actualidad: rinden poco con más texto.
- 16 artículos de Feliz Sin Tiroides y 9 de «Conoce Edvanta».
- Para pacientes: plantas medicinales (cúrcuma, moringa y valeriana), asuntos regulatorios (registro INVIMA, genéricos y reporte de efectos adversos) y dietas (gastritis y ácido úrico).

## Keywords de cursos (meta 10.000, 24-nov)

Fuente: autocompletado de Google (`suggestqueries`, hl=es, gl=co), sin volúmenes inventados. Recolecta `scripts/keywords-cursos-recolectar.mjs` (unas 10.500 consultas, una cada 150–170 ms): el tema de cada curso solo y con «curso de», a–z, formas de curso, preguntas, variantes para los cursos de nombre muy específico y los títulos de sus clases abiertas como subtemas. Limpia y asigna `scripts/keywords-cursos-mapa.mjs`, que escribe el CSV y los módulos `api/lib/keywords-cursos.js` (compra) y `api/lib/keywords-clases.js` (clases).

| | Keywords |
|---|---|
| Total en el mapa (sin duplicados ni portugués) | 23.084 |
| Asignadas a una página real (ficha 5.282, clase 3.330, artículo 245, guía/vademécum/caso 30)* | 7.626 |
| Navegacionales (otra institución, país o ciudad) → ficha | 1.261 |
| Huecos: informativas sin página propia | 13.815 |
| Descartadas (otro sector, tiendas, marcas) | 382 |

* Incluye las 1.261 navegacionales en el conteo por tipo de página.

Intención: informativa 18.854, compra 2.587, navegacional 1.261.

Qué quedó en las páginas: la ficha de cada curso lleva hasta 15 búsquedas de compra en `keywords` del Course y, si la gente busca «curso de X gratis», la pregunta «¿Hay un curso de X gratis?» con la respuesta cierta (primera unidad gratis; el curso completo con certificado es de pago). Cada clase lleva hasta 8 búsquedas propias en `keywords` de su LearningResource. La asignación es automática por términos: en una muestra, cerca de 9 de cada 10 caen en la clase correcta.

Huecos más grandes (contenido por crear: artículos o clases abiertas): farmacología del SNC 959, autocuidado de la tiroides 822, farmacología gastrointestinal 710, farmacología endocrina 621, farmacoterapia en diabetes 610, gestión de riesgos 523, desviaciones y CAPA 498, asma y EPOC 457, trámites ante el INVIMA 439.

Cursos con pocas búsquedas propias: requerimientos del INVIMA (1), hablar frente a la cámara (11), renovación de registro sanitario (20), validaciones farmacéuticas (43), fitoterapéuticos (44), dossier (48). Son temas que casi no se buscan con ese nombre; sus búsquedas aparecen bajo cursos vecinos (INVIMA, registro sanitario).

## Siguientes bloques

1. Fichas de los cursos: palabras clave, preguntas frecuentes y GEO (`llms.txt` de cursos) orientados a la compra del curso con certificado.
2. Artículos cortos: Feliz Sin Tiroides, plantas medicinales, regulatorios y dietas (lo clínico para pacientes, con aprobación de Karla).

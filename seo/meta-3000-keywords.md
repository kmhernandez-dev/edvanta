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

## Artículos delgados que quedan (menos de 600 palabras, 21-nov)

- 90 noticias farmacéuticas (de 365 a 600 palabras). Son de actualidad: rinden poco con más texto.
- 16 artículos de Feliz Sin Tiroides y 9 de «Conoce Edvanta».
- Para pacientes: plantas medicinales (cúrcuma, moringa y valeriana), asuntos regulatorios (registro INVIMA, genéricos y reporte de efectos adversos) y dietas (gastritis y ácido úrico).

## Siguientes bloques

1. Fichas de los cursos: palabras clave, preguntas frecuentes y GEO (`llms.txt` de cursos) orientados a la compra del curso con certificado.
2. Artículos cortos: Feliz Sin Tiroides, plantas medicinales, regulatorios y dietas (lo clínico para pacientes, con aprobación de Karla).

# Medición de Search Console

Propiedad: `https://edvanta.co/` (prefijo de URL, no de dominio).

## Línea base (11-nov-2026)

### Rendimiento en la Búsqueda

| Periodo | Clics | Impresiones | CTR | Posición media | Consultas |
|---|---|---|---|---|---|
| 3 meses (10-ago a 9-nov) | 26 | ~1.000 | 2,6 % | 16,7 | 87 |
| 28 días (13-oct a 9-nov) | 20 | 755 | 2,6 % | 9,5 | 36 |

Consultas con clics en 3 meses: «pritelivir colombia», «edvanta», «nogapendekin alfa inbakicept». Las de más impresiones son «plantillas de email para recursos humanos» (16), «ort flx para qué sirve» (7) y «curso de seguridad y salud en el trabajo» (7).

### Indexación de páginas

| Fecha del informe | Indexadas | Sin indexar |
|---|---|---|
| 5-nov-2026 | 235 | 662 |
| 8-nov-2026 | **309** | 659 |

Detalle del 8-nov:

| Motivo | Páginas | Validación |
|---|---|---|
| Descubierta: actualmente sin indexar | 341 | Iniciada (9-nov) |
| Rastreada: actualmente sin indexar | 144 | Error (iniciada el 9-nov) |
| Excluida por noindex | 68 | Iniciada (11-nov) |
| Página alternativa con canónica adecuada | 46 | No aplica |
| Página con redirección | 34 | No aplica |
| Duplicada: Google eligió otra canónica | 20 | Iniciada (11-nov) |
| No se ha encontrado (404) | 3 | Iniciada (11-nov) |
| Bloqueada por robots.txt | 2 | No aplica (`/cuenta?next=…`, bien bloqueada) |
| Soft 404 | 1 | Iniciada (9-nov) |

## Auditoría de las 662 (lista del 5-nov contra producción, 11-nov)

| Grupo | Páginas | Estado real en producción |
|---|---|---|
| Descubierta | 487 | 452 indexables y en el sitemap: Google aún no las rastrea. 35 son noticias de plantilla con noindex a propósito. |
| Rastreada | 65 | 60 indexables en el sitemap. Google las vio y decidió esperar: es una señal de autoridad o de calidad. |
| Alternativa con canónica | 43 | Direcciones con parámetros (`?v=`, `?career=`, `?tab=`) que apuntan a su canónica. Es lo correcto. |
| Redirección | 30 | 301 correctas. 3 daban 404: corregidas. |
| Duplicada | 20 | Las 20 ya redirigen con 301. |
| noindex | 15 | Rutas viejas de FST (301) y 5 guías que daban 404: corregidas. |
| 404 | 1 | `/rutas/calidad-auditoria-mejora`: corregida con 301. |
| Soft 404 | 1 | Hoy tiene 1.227 palabras. |

**Páginas delgadas sin JavaScript** (el motivo de fondo de muchas «Descubierta»):

| Tipo | Páginas | Palabras (mediana) | Estado |
|---|---|---|---|
| Categorías de artículos | 21 | 46 | Corregido el 11-nov |
| Enfermedades y levotiroxina | 9 | 45 | Corregido el 11-nov |
| Autora | 1 | 51 | Corregido el 11-nov |
| Competencias | 35 | 39 | Pendiente: la base solo tiene una línea por competencia |
| Cursos curados | 147 | 165 | Pendiente: guías por lotes (`seo/guias-de-cursos.md`) |
| Otras páginas fijas | ~20 | 40 a 76 | Pendiente: ver la lista de abajo |

Lista de las otras páginas fijas delgadas:

- `/certificaciones`, `/hoja-de-vida`, `/vitrina-de-talento-farmaceutico` y `/levotiroxina` (esta ya está corregida).
- `/contigo/tiroides` y `/contigo/tiroides/guias`.
- `/empleo/ofertas-para-quimicos-farmaceuticos` y `/empleo/plantillas-de-correo-para-recursos-humanos`.
- `/empresas/marketing` y `/empresas/recluta-talento-farmaceutico`.
- `/escuelas/marketing-y-comunicacion-farmaceutica`.
- `/competencias` y `/cursos/{coursera,edutin,udemy}`.
- `/academia/curso/autocuidado-de-la-tiroides`.

## Acciones del 11-nov-2026

**Commit 45fc42a**

- 301 para las 9 direcciones que daban 404:
  - las 5 guías de `/guias/…` van a `/guia/…`;
  - 3 van a su categoría de artículos;
  - la ruta pasa por la migración 116.
- `/index.html` redirige a `/`.
- Contenido en el HTML del servidor:
  - enfermedades: de 39 a 916 palabras;
  - levotiroxina: de 47 a 1.103;
  - autora: de 51 a 2.055, con enlaces a los 184 artículos que revisó;
  - categorías: hasta 1.551.
- Las 10 categorías con menos de 3 artículos indexables quedan en `noindex,follow` y fuera del sitemap.

**Search Console**

- Validación iniciada en: No encontrado (404), Excluida por noindex y Duplicada.
- `sitemap.xml` reenviado; Google lo leyó correctamente con 824 URL.

**Solicitudes de indexación (9 de unas 10 diarias)**

- Guías por área:
  - aseguramiento de calidad;
  - control de calidad;
  - asuntos regulatorios (dos veces, por error);
  - farmacovigilancia;
  - I+D;
  - datos e IA.
- La autora.
- Hipertiroidismo.

Las guías de validaciones y de producción **ya estaban indexadas**: no se pidieron.

## Qué no depende del sitio

«Descubierta» y «Rastreada» se resuelven cuando Google decide dedicar más rastreo al sitio. Las palancas son tres:

- **Enlaces externos:** Google reconoce solo 3. El kit de enlaces está listo y espera la aprobación de Karla para enviarse.
- **Contenido sustancial en cada página indexable.**
- **Solicitudes diarias:** se pide lo más valioso primero.

En temas de salud, Google exige más autoridad. Por eso los artículos «para qué sirve…» siguen en «Rastreada» aunque estén revisados.

## Próximas solicitudes (unas 10 por día)

1. Las 19 guías de tema de los lotes 2 y 3 (`/articulos/cursos-gratis-…`).
2. Las otras 8 enfermedades (`/enfermedades/…`).
3. Las categorías grandes: atención farmacéutica, Feliz Sin Tiroides, medicamentos y enfermedades y síntomas.

## Cómo medir

Cada lunes:

- **Rendimiento:** clics, impresiones y consultas de los últimos 28 días.
- **Páginas:** cuántas están indexadas y cuántas no.

Se anota una fila nueva en las tablas de arriba. El indicador principal es **páginas indexadas**; el secundario, **consultas con impresiones**.

## Lotes del 12-nov-2026

- **Noticias:** las 100 del paquete tienen contenido propio. Las 6 últimas (Kyinsu, H5N1, Talvey, Tryngolza, Tukysa y el informe ARC de la FDA) se reescribieron con fuente oficial. No queda ninguna noticia en plantilla.
- **Mejores cursos:** 4 artículos nuevos (microbiota, contabilidad y administración de droguerías, gestión de calidad por niveles y radiología). El blog llega a 31 artículos.
- **Vademécum:** 28 páginas nuevas (grupos de obesidad, hipertensión, diabetes, oncología, dislipidemia y anticoagulación y 22 monografías), revisadas por Karla el 12-nov e indexables. Se enlazan desde 28 artículos y el footer.
- **Siguiente medición:** lunes 16-nov, con el informe de 28 días y el número de páginas indexadas. Se comparan las consultas con impresiones frente a la línea base.

## Lote del 13-nov-2026

- **Antimicrobianos, lote 1:** 7 fichas nuevas (`/articulos/[dci]-para-que-sirve`) y 8 páginas del vademécum (grupo «Antibióticos de uso ambulatorio» y 7 monografías). Karla las revisó y aprobó el 13-nov; pasaron a `index,follow`.
- **Sitemap:** 664 URLs (186 páginas, 468 artículos, 10 herramientas), con las 15 páginas nuevas ya incluidas.
- **IndexNow:** 17 URLs enviadas a Bing (HTTP 200): las 15 nuevas más amoxicilina y azitromicina por los CTA profesionales añadidos.
- **Pendiente en Search Console:** las 15 páginas nuevas y las correcciones de datos estructurados. La cuota de solicitudes seguía agotada el 13-nov por la mañana; se reintenta en la ventana de 24 horas.

# SEO y GEO de las guías de Hotmart

**Alcance:** las 38 páginas `/guia/…` (5 de Edvanta, 12 de AtenFarmaClinic, 21 de Feliz Sin Tiroides) y el blog como fuente de tráfico hacia ellas. No toca cursos, vademécum ni fichas.

**Estado:** 25-nov-2026. Datos de búsqueda: `seo/trends/guias-2026-11-25.md` (Google Trends, Colombia).

## El modelo

```
Búsqueda informativa      →  artículo del blog   →  guía recomendada  →  Hotmart
«cómo tomar levotiroxina»    /articulos/…           /guia/…              pay.hotmart.com
```

Google Trends confirma que casi todo lo que se busca sobre estos temas es informativo («qué es», «síntomas», «para qué sirve», «cómo…»). Una página de venta no gana esas búsquedas; un artículo sí. Por eso:

1. **El artículo trae el tráfico** y recomienda una sola guía: la que resuelve lo que la persona vino a leer.
2. **La guía hace la venta** y enlaza de vuelta los artículos del tema. Guía y artículos forman un grupo temático.
3. **Los asistentes de IA (GEO)** encuentran en cada guía una respuesta corta y citable, y en `llms.txt` el catálogo completo.

## Qué quedó hecho (25-nov-2026)

| Cambio | Dónde | Resultado |
|---|---|---|
| Cada artículo recomienda su guía | `src/data/guiaParaArticulo.js`, `src/pages/ArticuloPage.jsx`, `scripts/prerenderizar-articulos.mjs` | 210 de 630 artículos muestran una tarjeta de guía con botón de compra, y el enlace a `/guia/…` va en el HTML sin JavaScript. Antes, la página del artículo no recomendaba ninguna. |
| La guía enlaza sus artículos | `src/data/articulosDeGuia.js`, `src/pages/GuiaVenta.jsx`, `scripts/prerenderizar-paginas.mjs` | «Empieza gratis: artículos sobre este tema», hasta 6 por guía, solo indexables. |
| Título y descripción de búsqueda | `src/data/seoGuias.js`, `metaDeGuia` | Título de 60 caracteres con la frase que se busca; descripción de 155 escrita a mano. Antes: el nombre del producto y la bajada cortada en el carácter 158. |
| Respuesta corta citable | `seoGuias.js` → `respuesta` | «La guía, en pocas palabras» en la página, primera pregunta del FAQPage y `description` del JSON-LD. |
| FAQPage igual a la página | `preguntasDeGuia`, `faqDeGuia` | Qué es, para quién, cómo se recibe, medios de pago, garantía y las propias. Antes el JSON-LD omitía las de compra. |
| Tipo correcto en el JSON-LD | `esCurso` | Los 10 cursos de AtenFarmaClinic se declaran `Course` (antes `Book`). |
| Vitrina con contexto | `/ofertas` prerenderizada | Las 38 guías por marca, cada una con su respuesta corta. Antes, una lista de títulos. |
| Catálogo para IA | `scripts/llms-guias.mjs` → `public/llms.txt` | Bloque «Guías y cursos de pago (Hotmart)» con qué es, para quién, formato y artículos del tema. |
| Mapa | `seo/guias-hotmart-mapa.csv` | Búsqueda principal, variantes y artículos que alimentan cada guía. |
| Pruebas | `src/__tests__/seo-guias-hotmart.test.js` | Límites de título y descripción, «PDF» solo en PDF, y que nunca se cruce público paciente y profesional. |

Palabras sin JavaScript de una página de guía: entre 299 y 678 (media 408).

## Reglas del puente artículo → guía

- De la más específica a la más general. Sin guía de verdad relacionada, no se muestra ninguna.
- A un paciente no se le ofrece una guía profesional, ni al revés (lo comprueba la prueba).
- Noticias y «Conoce Edvanta» no venden guías.
- A un artículo de salud general (no tiroideo) solo se le ofrecen probióticos, alimentación antiinflamatoria y ayunos.
- Las guías de Feliz Sin Tiroides no muestran precio en la tarjeta: así lo pide su marca.

## Qué falta: artículos que alimenten cada guía

Tres guías no tienen ningún artículo que las recomiende y once tienen uno o dos. Cada artículo nuevo de salud se publica en `noindex` hasta que Karla confirme la revisión clínica (`src/data/revisionClinica.js`).

### Prioridad 1 · Guías sin artículos

| Guía | Artículos por escribir (búsqueda de Google Trends) |
|---|---|
| Probióticos | «Para qué sirven los probióticos»; «Probióticos y prebióticos: diferencias»; «Cómo tomar probióticos» |
| Aprende a comer con hipertiroidismo y Graves | «Qué comer con hipertiroidismo»; «Enfermedad de Graves: alimentación durante el tratamiento» |
| Diario de emociones en hipertiroidismo | «Hipertiroidismo y ansiedad: qué contar en consulta»; «Cambios de ánimo en el hipertiroidismo» |

### Prioridad 2 · Temas en alza sin artículo

| Búsqueda (Trends) | Artículo | Guía que recomienda |
|---|---|---|
| cómo bajar de peso con hipotiroidismo (+100 % a +130 %) | «Cómo bajar de peso con hipotiroidismo: qué depende de la tiroides y qué no» | Sana tu metabolismo |
| cómo saber si tengo metabolismo lento (irrupción) | «Metabolismo lento: cómo saberlo y qué exámenes pedir» | Sana tu metabolismo |
| síntomas de la tiroides alta en mujeres (+160 %) | «Tiroides alta en mujeres: síntomas y cuándo consultar» | Guía definitiva del hipertiroidismo |
| yodoterapia cuidados | «Yodoterapia: cuidados en casa antes y después»; «Qué es la yodoterapia» | Guía de yodoterapia I-131 |
| cómo desinflamar el estómago | «Cómo desinflamar el estómago si tienes hipotiroidismo» | Desinflama tu estómago en 21 días |
| cómo hacer ayuno intermitente / 16 8 | «Ayuno intermitente con hipotiroidismo y levotiroxina» | Guía completa de ayunos |
| dieta antiinflamatoria pdf | «Dieta antiinflamatoria: lista de alimentos y menú de ejemplo» | Aprende a comer con un enfoque antiinflamatorio |
| el hipotiroidismo tiene cura / cómo se trata | «¿El hipotiroidismo tiene cura? Cómo se trata» | Guía definitiva del hipotiroidismo |
| prompts para claude (+400 %) | «Prompts para Claude en farmacia: 5 ejemplos» | 20 prompts de Claude para QF asistenciales |
| curso farmacovigilancia / manual de farmacovigilancia | «Manual de farmacovigilancia: qué debe tener» | Seguridad del medicamento |

### Prioridad 3 · Guías con uno o dos artículos

Fibrosis quística, gestión integral de la farmacoterapia, plan de cuidados, problemas farmacoterapéuticos, terapia de reemplazo enzimático, recién diagnosticados, caída del cabello, autocuidado, Método LinkedIn. Dos artículos más por guía, siguiendo sus `consultas` en `seoGuias.js`.

## Medición (cada mes)

1. **Search Console**, filtro de página `/guia/`: impresiones, clics, CTR y posición de cada guía, y las consultas reales. Si una consulta real no coincide con `consulta` en `seoGuias.js`, se cambia el título.
2. **Analítica**, eventos:
   - `guia_ver_click` y `guia_compra_click` con `origen: articulo`: qué artículos venden;
   - `guia_articulo_click`: qué artículos se leen desde la guía;
   - `guia_vista` por guía.
3. **Hotmart**: ventas por `src` (lo agrega `conOrigen`): `articulo` contra ficha de curso, aula y página de guía.
4. Anotar en `seo/medicion.md` y decidir: los 10 artículos con más impresiones y sin clics a la guía cambian de guía o de texto.

## Pendiente de Karla

- Pedir la indexación en Search Console de `/ofertas` y de las guías principales (cuota de unas 10 al día): colección, levotiroxina, recién diagnosticados, comer con hipotiroidismo, Hashimoto, yodoterapia, farmacocinética, problemas farmacoterapéuticos IESA, y las dos de Claude para calidad.
- Revisar los 38 títulos y respuestas de `src/data/seoGuias.js`: describen cada guía con lo que ya decía su ficha, pero son de ella.
- Las guías de AtenFarmaClinic 01 a 10 no tienen enlace de pago directo ni portada; solo la página de Hotmart.

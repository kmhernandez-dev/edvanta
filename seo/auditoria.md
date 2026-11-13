?# Auditoría SEO y de contenido — edvanta.co

**Fecha:** 7 de noviembre de 2026  
**Alcance:** repositorio `biblioteca-profesional-kh`, build `dist/` y comprobaciones HTTP contra producción (`https://edvanta.co`).  
**Rol:** auditoría técnica, de arquitectura de información, contenido YMYL y autoridad.  
**Estado:** Fase 0. No se modifica código, contenido ni producción.

> **Actualización local (7-nov-2026):** las correcciones técnicas de la Fase 0 ya están aplicadas en local/staging: las 86 URLs del sitemap tienen HTML propio y canonical autorreferente; el 404 es real; HTTP y `www` redirigen; hay índice de sitemaps; las páginas YMYL sin revisión están en `noindex` y fuera de los sitemaps. **Producción no se ha tocado.** El diagnóstico de este documento describe el estado previo y sirve como línea base.

---

## 0. Resumen ejecutivo

| # | Hallazgo | Evidencia | Riesgo | Prioridad |
|---|---|---|---|---|
| 1 | **Páginas de salud indexables sin revisión humana** | 354 artículos, **0 con `revisor`**, **0 `reviewedBy`** en 896 bloques JSON-LD; 127 son de salud/pacientes (incluidos 19 de medicamentos); todas las fichas de artículo llevan `robots: index, follow` | YMYL, E-E-A-T y regla no negociable #2 | P0 |
| 2 | **Contenido a escala con near-duplicados** | 103 noticias; **100 declaran asistencia de IA**; 100 pares con similitud ≥0,40; 97 ≥0,60; 84 ≥0,70; 12 ≥0,80; 161 artículos nuevos en ~10 días | Política de spam de Google (“scaled content abuse”) y pérdida de confianza | P0 |
| 3 | **86 de 490 URLs del sitemap no tienen HTML propio** | En producción devuelven el shell del SPA con `<title>` y `canonical` de la home. Incluye `/feliz-sin-tiroides`, `/sobre-edvanta`, `/cursos`, `/privacidad`, `/enfermedades/*` y `/academia/retos/*` | Canibalización con la home, páginas que no rankean, mala visibilidad en IA | P0 |
| 4 | **Soft 404 y hosts duplicados** | `/no-existe-xyz-123` responde **200** con `index, follow` y canonical a la home; `http://edvanta.co` y `https://www.edvanta.co` responden **200** sin 301 | Index bloat, señales duplicadas, desperdicio de rastreo | P0 |
| 5 | **Autoridad insuficiente para la meta** | Authority Score 2, 170 dominios de referencia, 243 backlinks, 0 tráfico orgánico y solo 30 keywords | El cuello de botella no son las páginas: son los enlaces y la confianza | P0 |
| 6 | **Rendimiento móvil variable y con margen de mejora** | Dos corridas de Lighthouse móvil (7-nov-2026, 17:17 UTC): Performance 45 y 67; LCP 6,0 s y 2,1 s; TBT 1.250 ms y 1.972 ms; CLS ~0; SEO, accesibilidad y buenas prácticas 100. El LCP oscila entre el H1 del hero y el aviso de cookies. Falta dato de campo CrUX | Core Web Vitals, conversión y eficiencia de rastreo | P1 |

**Lectura de negocio:** el sitio ya tiene 354 artículos, pero solo 30 keywords y 0 tráfico orgánico. Eso indica que **el problema no es falta de contenido**, sino de indexabilidad, calidad demostrable, revisión clínica, arquitectura y autoridad. Escalar a 8.000–25.000 páginas antes de corregir esto multiplicaría el problema. La secuencia correcta es: **limpiar, revisar, fragmentar el sitemap, medir y después escalar por lotes**.

### 0.1 Estado de implementación (7 de noviembre de 2026)

Este informe es el diagnóstico de Fase 0. En el primer lote de Fase 1 ya se aplicaron estos cambios:

- **184 artículos de salud/medicamentos** quedaron con `noindex,follow` hasta que existan `revisor` y fecha de revisión. No entran al sitemap.
- Las **86 URLs SPA detectadas en el diagnóstico** ya tienen HTML propio (junto con otras rutas fijas), con título, canonical, H1 y JSON-LD.
- El sitemap se dividió en `sitemap-index.xml`, `sitemap-paginas.xml`, `sitemap-articulos.xml` y `sitemap-herramientas.xml`; `robots.txt` apunta al índice.
- El sitemap actual no contiene URLs sin HTML estático ni artículos `noindex`.
- Se añadieron `404.html`, `error_page 404`, redirects HTTP→HTTPS y `www`→apex, y ubicaciones explícitas para las rutas SPA que no tienen HTML prerenderizado.
- Las páginas privadas llevan `X-Robots-Tag: noindex, nofollow`.
- **E-E-A-T publicado:** `/autores/karla-hernandez`, política editorial, política de revisión clínica, equipo editorial, fuentes y metodología, enlazadas desde el footer y las fichas.
- **Lote de 50 artículos de industria y cursos:** publicados e indexables por decisión del propietario, sin revisión clínica. Son páginas de industria/cursos, no de medicamentos; enlazan cursos reales del catálogo. Keywords objetivo en `seo/50-articulos-500-keywords.csv`. Medir indexación y podar si no rinden.
- **Pendiente:** revisión clínica real de los 184 artículos, poda de las noticias casi duplicadas, Astro + PostgreSQL y auditoría de backlinks.

---

## 1. Stack, arquitectura y renderizado

### 1.1 Stack actual

| Componente | Implementación actual |
|---|---|
| Frontend | React 18.3.1 + Vite 8.1.1 + React Router 7.18.2 |
| Estilos | Tailwind CSS 3.4.15 |
| Renderizado | SPA CSR; `createRoot` (sin hidratación) |
| Generación estática | `scripts/prerenderizar-articulos.mjs` y `scripts/prerenderizar-paginas.mjs` en `postbuild` |
| Backend | Node 20 + Express 4 |
| Base de datos | PostgreSQL (`pg`) |
| Contenido | Metadatos en archivos JS (`src/data/*.js`) + Markdown en `public/articulos/**/*.md` |
| CMS | No hay CMS editorial. Hay paneles administrativos, pero el blog no tiene flujo de revisión clínica |
| Hosting | Docker Compose + Coolify + nginx; Cloudflare delante |
| Sitemaps | `public/sitemap.xml` estático, reescrito por los dos scripts de `postbuild`; `sitemap-cursos.xml` y `sitemap-profesional.xml` generados por la API |
| Robots | `public/robots.txt` + reglas inyectadas por Cloudflare en producción |

### 1.2 Tipos de renderizado reales

| Tipo | Rutas | Qué recibe un crawler sin JavaScript |
|---|---|---|
| HTML estático completo | Artículos (`/articulos/*`), herramientas, categorías, cursos en vivo, marketing, algunas páginas de Contigo | Título, descripción, canonical, JSON-LD y cuerpo |
| HTML generado por API | `/cursos/*`, `/curso-de-*`, `/carreras/*`, `/rutas/*`, `/competencias/*` | HTML con metadatos si la base responde; 503 si falla el sitemap |
| Rutas fijas prerenderizadas | **86 rutas**, entre ellas `/feliz-sin-tiroides`, `/sobre-edvanta`, `/cursos`, `/academia/retos/*`, `/enfermedades/*`, `/privacidad`, `/contacto`, `/instituciones` | Título, descripción, canonical, H1 y JSON-LD propios; React toma el control después |

El diagnóstico inicial mostró que el tercer grupo no tenía HTML propio y que la señal canónica inicial apuntaba a la home. En el lote P0 se prerenderizaron las 86 rutas fijas y el sitemap ya no incluye URLs sin HTML. La comprobación histórica fue:

```text
GET https://edvanta.co/enfermedades/hipotiroidismo
200
<title>Edvanta | Educación farmacéutica para profesionales, pacientes e instituciones</title>
<link rel="canonical" href="https://edvanta.co/">
```

Lo mismo ocurre en `/feliz-sin-tiroides`, `/sobre-edvanta`, `/cursos`, `/academia/retos/pilates-princess`, `/privacidad` y `/autores/karla-hernandez`.

### 1.3 Consecuencia de `createRoot` sobre HTML prerenderizado

El HTML estático se escribe en `dist/`, pero `src/main.jsx` usa `createRoot(...).render(...)`, no `hydrateRoot`. Al montar React se destruye y se vuelve a crear el árbol. Esto no impide la indexación, pero puede producir parpadeo, pérdida del primer render y CLS en móviles lentos. Para las páginas que ya se prerenderizan, la solución correcta es hidratar; para las que no, prerenderizar o SSR.

---

## 2. Inventario actual

### 2.1 Volumen

| Métrica | Valor |
|---|---:|
| Artículos en `src/data/articulos.js` | 354 |
| Archivos Markdown en `public/articulos/articulos_edvanta` | 358 |
| Archivos Markdown con frontmatter | 176 |
| Artículos con `revisor` | **0** |
| Artículos con `updated` | 318 |
| URLs en `dist/sitemap.xml` | 490 |
| URLs con HTML estático propio | 404 |
| URLs servidas por API en el sitemap principal | 0 |
| URLs SPA sin HTML propio dentro del sitemap | **86** |
| Páginas HTML en `dist/` | 433 |
| Páginas con JSON-LD | 431 |
| Bloques JSON-LD | 896 |
| Errores de parseo JSON-LD | 0 |
| Páginas con `reviewedBy` | **0** |

### 2.2 Artículos por marca y audiencia

| Marca | Artículos |
|---|---:|
| Edvanta | 173 |
| Feliz Sin Tiroides | 70 |
| Contigo | 55 |
| AtenFarmaClinic | 53 |
| Biblioteca | 3 |

| Audiencia declarada | Artículos |
|---|---:|
| Público general / pacientes | 107 |
| Profesionales | 107 |
| Sin campo `publico` | 140 |

**Salud/pacientes sin revisor:** 127 artículos (marca `fst`/`contigo` o `publico: pacientes`), que incluyen los 19 de la categoría “Medicamentos”. El 100% de las 354 fichas carece de `revisor`.

### 2.3 Categorías principales

| Categoría | Artículos |
|---|---:|
| Noticias farmacéuticas | 103 |
| Feliz Sin Tiroides | 70 |
| Atención Farmacéutica | 53 |
| Medicamentos | 19 |
| Enfermedades y síntomas | 16 |
| Conoce Edvanta | 14 |
| Calidad farmacéutica | 13 |
| Gestión de calidad | 8 |
| Técnicas de estudio | 8 |
| Bajar de peso | 6 |

### 2.4 Calidad medible del corpus

| Indicador | Valor | Lectura |
|---|---:|---|
| Palabras promedio | 1.026 | Aceptable, pero muy disperso |
| Mediana de palabras | 648 | La mitad son piezas cortas |
| Percentil 10 | 505 | Riesgo de thin content |
| Percentil 90 | 2.054 | Hay piezas profundas |
| Artículos con menos de 600 palabras | 151 | 43% del corpus |
| Artículos con sección de fuentes/referencias | 325 | 92%; hay que verificar calidad, no solo presencia |
| Artículos con FAQ | 226 | 64% |
| Artículos con “Cuándo consultar” | 24 | 7%; insuficiente en salud |
| Enlaces internos promedio por artículo | 3,7 | Por debajo del mínimo de 5 |
| Artículos con 5 o más enlaces internos | 150 | 42% |
| Artículos con 0 enlaces internos | 33 | 9% |
| Títulos duplicados | 0 | Bien |
| Descripciones duplicadas | 0 | Bien |

### 2.5 Duplicación semántica

Se compararon los 354 Markdown con shingles de 5 palabras y Jaccard:

| Umbral | Pares similares | Artículos implicados | Categoría |
|---:|---:|---:|---|
| ≥ 0,40 | 4.950 | 100 | Noticias farmacéuticas |
| ≥ 0,50 | 2.006 | 100 | Noticias farmacéuticas |
| ≥ 0,60 | 380 | 97 | Noticias farmacéuticas |
| ≥ 0,70 | 251 | 84 | Noticias farmacéuticas |
| ≥ 0,80 | 28 | 12 | Noticias farmacéuticas |

Además, **100 de las 103 noticias declaran “preparado con asistencia de inteligencia artificial”** y comparten estructura, párrafos de contexto y cierre. El patrón no es “varias noticias parecidas”: es una **plantilla repetida a escala**. Esto es exactamente lo que Google describe como contenido a escala sin valor añadido.

---

## 3. Keywords actuales y URLs que rankean

**No se recibió el export de Semrush.** El mensaje dejó el campo como `[PEGAR AQUÍ]`. No puedo listar las 30 keywords ni las URLs que rankean sin inventar datos. Cualquier lista sería una hipótesis y violaría la regla de no inventar.

Para completar esta sección necesito, como mínimo:

```csv
keyword,volumen_mensual,posicion_actual,url_que_rankea,intencion,pais,dispositivo,fecha
```

Mientras tanto, el repositorio contiene **hipótesis de intención** en `docs/ARTICULOS_SEO_INTENCIONES.json` y un inventario editorial de 193 artículos (desactualizado; hoy hay 354). Eso no sustituye el ranking real.

**Procedimiento al recibir el CSV:**

1. Cruzar cada keyword con la URL que rankea.
2. Clasificar intención: informacional, comercial, transaccional, navegacional.
3. Asignar clúster A–G.
4. Detectar canibalización (varias URLs para la misma keyword).
5. Detectar keywords sin página o con página débil.
6. Priorizar por volumen × intención × posibilidad real de ranking.
7. Entregar la matriz de 30 filas y las 30 URLs en menos de 24 horas.

---

## 4. Problemas técnicos bloqueantes, ordenados por impacto

### P0 — Corregir antes de publicar una sola página nueva

#### P0-1. Páginas de salud y medicamentos indexables sin aprobación humana (mitigado con noindex; revisión pendiente)

- **Evidencia:** 354 artículos, 0 con `revisor`; 0 `reviewedBy` en 896 bloques JSON-LD; 127 de salud/pacientes (incluidos 19 de medicamentos); todas las fichas de artículo llevan `index, follow`.
- **Ejemplo live:** `/articulos/acetaminofen-para-que-sirve` responde 200, `index, follow`, sin revisor, sin `reviewedBy`.
- **Impacto:** incumple la regla no negociable #2; debilita E-E-A-T en YMYL; aumenta el riesgo de supresión por políticas de contenido.
- **Corrección:** añadir `reviewed_by`, `reviewed_at`, `sources[]`, `status`, `indexable` al modelo; el generador debe emitir `noindex` hasta que existan los dos primeros; crear cola de revisión ordenada por potencial de búsqueda; firmar y fechar cada página aprobada.
- **Esfuerzo:** 2–4 días de desarrollo + backlog de revisión clínica.
- **Responsable:** desarrollo + Karla Hernández.
- **Estado:** mitigado con noindex; la revisión clínica sigue pendiente.

#### P0-2. Contenido a escala con near-duplicados (pendiente de poda)

- **Evidencia:** 103 noticias; 100 con asistencia de IA declarada; 100 pares ≥0,40; 97 ≥0,60; 84 ≥0,70; 12 ≥0,80; 161 artículos nuevos en ~10 días.
- **Impacto:** patrón de “scaled content abuse”; puede afectar a todo el dominio, no solo a las noticias.
- **Corrección:** congelar el generador de noticias; noindex o retirar las 100 piezas casi duplicadas; conservar solo las que aporten análisis propio; reescribir con fuente primaria, contexto colombiano, implicación para el QF y revisión humana; fusionar el resto en un resumen regulatorio mensual.
- **Esfuerzo:** 1–2 semanas.
- **Responsable:** editor + Karla Hernández.

#### P0-3. 86 URLs del sitemap sin HTML propio y con canonical a la home (corregido en el lote P0)

- **Evidencia:** 86/490 URLs del sitemap no tienen archivo HTML; producción devuelve el shell de la home. Afecta a `/feliz-sin-tiroides`, `/sobre-edvanta`, `/cursos`, `/instituciones`, `/contacto`, `/privacidad`, `/descargo-medico`, `/enfermedades/*`, `/levotiroxina`, `/nutricion-tiroidea`, `/academia/retos/*`, `/carreras`, `/rutas`, etc.
- **Impacto:** Google puede tratar esas URLs como duplicados de la home; las páginas comerciales y de salud más importantes no compiten; la visibilidad en IA se pierde porque el HTML inicial no contiene la respuesta.
- **Corrección:** prerenderizar o SSR todas las rutas indexables; mientras se corrige, retirarlas del sitemap; verificar con `curl` que el HTML inicial tenga título y canonical propios.
- **Esfuerzo:** 1–3 semanas según el stack elegido.
- **Responsable:** desarrollo.
- **Estado:** corregido; las 86 rutas tienen HTML propio y el sitemap no incluye URLs sin HTML.

#### P0-4. Soft 404, hosts duplicados y falta de redirects (corregido en el lote P0)

- **Evidencia live:**
  - `/no-existe-xyz-123` → 200, `index, follow`, canonical a `/`.
  - `http://edvanta.co/` → 200 (sin 301 a HTTPS).
  - `https://www.edvanta.co/` → 200 (sin 301 al dominio canónico).
  - `/cursos/` → 200 con canonical a `/`.
- **Impacto:** index bloat, duplicación de hosts, desperdicio de rastreo, señales contradictorias.
- **Corrección:** 404 real con `noindex`; 301 de HTTP a HTTPS y de `www` a apex; política única de barra final; canonical autorreferente en el HTML inicial; reglas en Cloudflare/nginx.
- **Esfuerzo:** 1–2 días.
- **Responsable:** desarrollo/ops.
- **Estado:** corregido; verificar en producción tras el despliegue.

#### P0-5. Sitemap sin índice, sin segmentación y sin control de calidad (corregido en el lote P0)

- **Evidencia:** `public/sitemap.xml` se muta con expresiones regulares en dos scripts; `robots.txt` declara tres sitemaps sin índice; no hay validación de estado HTTP, canonical, `noindex` ni calidad; los sitemaps de la API devuelven 503 si falla la base; 86 URLs SPA están incluidas.
- **Impacto:** descubrimiento poco fiable, URLs incorrectas, indexación lenta y difícil de medir.
- **Corrección:** un manifiesto único de páginas; `sitemap-index.xml`; sitemaps segmentados por tipo (páginas, artículos, medicamentos, ATC, laboratorios, glosario, cursos, profesional, herramientas); máximo 10.000 URLs por sitemap; solo URLs 200, indexables, autorreferentes y aprobadas; validación en CI; envío a Search Console.
- **Esfuerzo:** 3–5 días.
- **Responsable:** desarrollo + SEO.
- **Estado:** corregido; sitemap index y segmentos generados.

### P1 — Corregir en las primeras 4 semanas

#### P1-1. E-E-A-T incompleto (corregido en el lote E-E-A-T)

- **Evidencia:** no existe `/autores/karla-hernandez` real; el Markdown existe en `public/articulos/articulos_edvanta/autores/karla-hernandez.md`, pero no está en `src/data/articulos.js`, no tiene ruta y en producción devuelve 200 con canonical a la home. No existen páginas de política editorial, política de revisión clínica, equipo editorial, fuentes ni metodología. `Organization` no tiene `sameAs`. El `Person` del JSON-LD solo lleva `name`.
- **Impacto:** Google y los sistemas de IA no pueden verificar quién es la autora, qué credenciales tiene, cómo se revisa el contenido y con qué fuentes.
- **Corrección:** crear `/autores/karla-hernandez` con `ProfilePage` + `Person` (credenciales, `sameAs` a LinkedIn, áreas, publicaciones, conflicto de interés); crear `/politica-editorial`, `/politica-de-revision-clinica`, `/equipo-editorial`, `/fuentes`, `/metodologia`; enlazarlas desde el footer y desde cada artículo; añadir `reviewedBy` y `lastReviewed` reales.
- **Esfuerzo:** 1 semana de contenido + 2 días de desarrollo.
- **Responsable:** editor + desarrollo.
- **Estado:** corregido; autora y cinco páginas de transparencia publicadas, enlazadas y con schema `ProfilePage`/`Person`/`reviewedBy`.

#### P1-2. Datos estructurados incompletos

- **Evidencia:** 431 páginas con `Organization`/`WebSite`; 414 `BreadcrumbList`; 226 `FAQPage`; 178 `MedicalWebPage`; 176 `Article`; 1 `Course`; **0 `Drug`**, **0 `DefinedTerm`**, **0 `reviewedBy`**. No hay `citation`, `lastReviewed`, `activeIngredient`, `atcCode`, `dosageForm` ni `legalStatus`.
- **Impacto:** se pierden oportunidades de rich results y de comprensión de entidades; el clúster de medicamentos no puede usar `Drug` correctamente.
- **Corrección:** plantillas de schema por tipo: `Article`, `MedicalWebPage`, `Drug`, `DefinedTerm`, `Course`, `FAQPage`, `BreadcrumbList`, `Person`, `Organization`; validar con Rich Results Test y Schema Markup Validator; no emitir `reviewedBy` si no hay revisión real.
- **Esfuerzo:** 1 semana.
- **Responsable:** desarrollo + SEO.

#### P1-3. Enlazado interno insuficiente

- **Evidencia:** promedio 3,7 enlaces internos por artículo; 33 artículos con 0; 150/354 con ≥5; las noticias promedian 1,1; no hay hubs por ATC/DCI porque el clúster aún no existe.
- **Impacto:** profundidad de rastreo, relevancia temática y transferencia de autoridad limitadas.
- **Corrección:** grafo automático por ATC, principio activo, clase terapéutica y tema; breadcrumbs; “relacionados” reales; hub → hijo y hijo → hub; mínimo 5 enlaces contextuales por página; informe de huérfanas.
- **Esfuerzo:** 1–2 semanas.
- **Responsable:** desarrollo + editor.

#### P1-4. Rendimiento y Core Web Vitals sin medición de campo

- **Evidencia:** dos corridas de Lighthouse móvil del 7-nov-2026: Performance 45 y 67; LCP 6,0 s y 2,1 s; TBT 1.250 ms y 1.972 ms; CLS ~0; SEO, accesibilidad y buenas prácticas 100. El LCP oscila entre el H1 del hero y el aviso de cookies. Además: 328 assets; 7,4 MB totales; 5,9 MB de JS; 223 KB de CSS; 18,6 MB de imágenes; 4 familias tipográficas con múltiples pesos; el hero sí está bien resuelto (158 KB WebP, `width`, `height`, `loading="eager"`, `fetchpriority="high"`). No hay datos de campo CrUX.
- **Impacto:** el TBT incumple en ambas corridas y el LCP es inestable; el peso de JS, el aviso de cookies y las fuentes son el riesgo móvil principal.
- **Corrección:** renderizar el aviso de cookies sin bloquear el LCP; `hydrateRoot`; presupuesto de JS y fuentes; subset de fuentes y `preload`; cargar Supabase solo donde se use; imágenes con dimensiones y `srcset`/AVIF; repetir Lighthouse y validar con CrUX/GSC.
- **Esfuerzo:** 1 semana.
- **Responsable:** desarrollo.

#### P1-5. Autoridad y backlinks

- **Evidencia:** AS 2; 170 dominios de referencia; 243 backlinks; 0 tráfico orgánico. No se recibió export de backlinks.
- **Impacto:** sin autoridad, 8.000–25.000 páginas no rankean. Es el cuello de botella real de la meta de 500.000 keywords.
- **Corrección:** auditar los 243 backlinks (relevancia, toxicidad, anchor, URL destino); recuperar menciones sin enlace; crear datos propios citables (informe anual de registros sanitarios, observatorio de desabastecimiento, precios y disponibilidad); alianzas con facultades de farmacia y gremios; notas de prensa; perfiles profesionales; guest posts en medios de salud.
- **Esfuerzo:** continuo; primeros resultados a 3–6 meses.
- **Responsable:** SEO/PR + dirección.

#### P1-6. Política de rastreadores de IA contradictoria

- **Evidencia:** el `robots.txt` del repo permite todo salvo `/admin/`; producción inyecta reglas de Cloudflare que bloquean `GPTBot`, `Google-Extended`, `ClaudeBot`, `CCBot`, `meta-externalagent`, `Bytespider`, entre otros, y declaran `Content-Signal: search=yes, ai-train=no, use=reference`. `llms.txt` existe.
- **Impacto:** se puede perder visibilidad en Gemini/AI Overviews y en asistentes que dependen de esos rastreadores; a la vez, se protege el contenido del entrenamiento. Es una decisión de negocio, no solo técnica.
- **Corrección:** decidir qué se permite (entrenamiento, grounding, búsqueda con citas); documentarlo; probar `OAI-SearchBot`, `PerplexityBot`, `Googlebot`, `Google-Extended`; no cambiar sin aprobación.
- **Esfuerzo:** 1 día de decisión + configuración.
- **Responsable:** dirección + SEO.

### P2 — Deuda técnica y de contenido

| ID | Problema | Evidencia | Corrección |
|---|---|---|---|
| P2-1 | No hay CMS ni flujo editorial con estados | El contenido vive en JS + Markdown; no existen `status`, `reviewed_by`, `reviewed_at`, `sources[]` | Modelo en PostgreSQL + cola de revisión + auditoría de cambios |
| P2-2 | URLs y barras finales inconsistentes | `/cursos/` devuelve 200 con canonical a `/`; el sitemap mezcla patrones | Política única sin barra final + 301 + canonical autorreferente |
| P2-3 | hreflang y expansión LatAm | No hay hreflang; `lang="es-CO"` | Añadir hreflang solo cuando el contenido cambie de verdad por país (regulación, precio, disponibilidad); nunca por ciudad |
| P2-4 | Falta de datos de keywords y Search Console | No se recibió export ni acceso | Entregar CSV de Semrush y acceso a GSC; baseline en 48 h |
| P2-5 | Cabeceras de seguridad/confianza | HTTP y www responden 200; no se observan HSTS/CSP/X-Content-Type-Options en la respuesta de la home | 301 a HTTPS/apex + HSTS + cabeceras de seguridad |
| P2-6 | Contenido corto y sin “Cuándo consultar” | 151 artículos <600 palabras; 24 con “Cuándo consultar” | Revisar caso por caso; no rellenar por rellenar; fusionar o noindexar lo que no aporte |
| P2-7 | author page huérfana | `karla-hernandez.md` existe pero no está en datos ni en rutas | Publicar la página real y enlazarla desde todas las fichas |
| P2-8 | `keywords` meta genérica repetida | Los artículos heredan la meta keywords de la home | Eliminarla o hacerla específica; Google no la usa, pero es señal de descuido |

---

## 5. Indexabilidad: diagnóstico inicial (86 URLs SPA)

| Grupo | Ejemplos | URLs | Qué recibe el crawler |
|---|---|---:|---|
| Marca y empresa | `/feliz-sin-tiroides`, `/atenfarmaclinic`, `/sobre-edvanta`, `/contacto` | 4 | Home |
| Escuelas e instituciones | `/escuelas`, `/escuelas/salud-y-farmacia-clinica`, `/instituciones`, `/empresas/*` | 28 | Home |
| Academia y retos | `/academia`, `/academia/curso/autocuidado-de-la-tiroides`, `/academia/retos/*` | 15 | Home |
| Enfermedades y salud | `/enfermedades/*` (7), `/levotiroxina`, `/nutricion-tiroidea` | 9 | Home |
| Carrera y empleo | `/guias`, `/cursos`, `/cursos/coursera`, `/cursos/udemy`, `/cursos/edutin`, `/hoja-de-vida`, `/empleo`, `/empleo/*`, `/orientacion-vocacional`, `/herramientas`, `/linkedin-farmaceutico`, `/practicas-profesionales-farmaceuticas`, `/emprendimiento-farmaceutico`, `/noticias`, `/vitrina-de-talento-farmaceutico`, `/carreras`, `/rutas` | 18 | Home |
| Ecosistema y legal | `/competencias`, `/recursos`, `/certificaciones`, `/oportunidades`, `/conecta`, `/proyectos`, `/privacidad`, `/tratamiento-de-datos`, `/terminos`, `/reembolsos`, `/descargo-medico`, `/afiliados` | 12 | Home |

**Total:** 86 URLs. Todas están en el sitemap y el shell del SPA responde 200 con canonical a la home en el HTML inicial; se comprobaron las principales en producción. Los conteos por grupo suman 86; la lista exacta se obtiene comparando `dist/sitemap.xml` con los archivos HTML de `dist/`.

**Estado actual:** las 86 rutas se prerenderizaron con `scripts/seo-rutas-fijas.mjs`; el sitemap actual no contiene URLs sin HTML. Ver 0.1.

### 5.1 Otras comprobaciones de indexabilidad

- **Noindex real en build:** solo 9 páginas (planes, profesionales, red profesional, mi cuidado, plan, suscripción, agenda, pacientes, operación). Correcto para esas páginas.
- **Rutas privadas:** `/fst-app/*`, `/mi-espacio/*`, `/aula/*`, `/vida-360/*`, `/cuenta`, `/app`, `/certificados/*` no están en `Disallow` y dependen de `noindex` en cliente. Deben llevar `X-Robots-Tag: noindex` desde nginx o `Disallow` si no aportan valor público.
- **Soft 404:** confirmado. Un 404 real debe ser 404, no 200.
- **Canonical:** correcto en artículos y páginas prerenderizadas; incorrecto en las 86 SPA.
- **hreflang:** no hay; correcto para un solo mercado, pero no habrá señal para LatAm hasta que exista contenido diferenciado.
- **Robots:** el repo y producción no coinciden; producción añade reglas de Cloudflare.
- **Sitemap:** 490 URLs; 404 con HTML, 0 por API, 86 SPA; sin índice; sin validación de estado/canonical.

---

## 6. Datos estructurados

| Tipo | Bloques | Observación |
|---|---:|---|
| Organization | 431 | Sin `sameAs`; se repite en todas las páginas |
| WebSite | 431 | Sin `SearchAction`; aceptable |
| BreadcrumbList | 414 | Correcto en artículos y páginas fijas |
| FAQPage | 226 | Útil para IA; Google limita rich results |
| MedicalWebPage | 178 | Sin `reviewedBy` ni `lastReviewed` |
| Article | 176 | Sin `citation` ni autor con URL |
| CollectionPage | 35 | Correcto |
| SoftwareApplication | 9 | Correcto para herramientas |
| Service | 6 | Correcto para servicios |
| Course | 1 | Insuficiente: los cursos deberían llevar `Course` |
| Drug | **0** | Bloquea el clúster A |
| DefinedTerm | **0** | Bloquea el clúster E |
| Person | **0 como entidad principal** | La autora no existe como entidad |
| `reviewedBy` | **0** | Incumple la regla #2 |

**Conclusión:** el JSON-LD está bien construido y no tiene errores de parseo, pero es **autorreferencial y plano**: describe páginas, no entidades. Para YMYL y para IA hay que añadir autoría, revisión, fuentes, especialidad y relaciones.

---

## 7. E-E-A-T: qué falta

| Elemento | Estado | Acción |
|---|---|---|
| Página de autora real | No existe (soft 404) | Crear `/autores/karla-hernandez` con `ProfilePage` + `Person` |
| Credenciales | Solo “Química Farmacéutica Clínica” en datos internos | Añadir Universidad del Atlántico, especialidad, años, áreas, tarjeta profesional si se autoriza |
| `sameAs` | LinkedIn disponible en `src/config/links.js`; no se usa en schema | Añadir LinkedIn, ORCID si existe, y perfiles verificados |
| Revisión clínica | 0 páginas con `reviewed_by` | Campo obligatorio + fecha + firma visible |
| Política editorial | No existe | Crear página y enlazarla |
| Política de revisión clínica | No existe | Crear página con quién revisa, cómo y cada cuánto |
| Equipo editorial | No existe | Crear página con roles y responsabilidades |
| Fuentes y metodología | No existe | Crear página + bloque de fuentes por artículo |
| Contacto | Existe, pero SPA sin HTML | Prerenderizar |
| Aviso médico | Existe, pero SPA sin HTML | Prerenderizar |
| Política de afiliados | Existe, pero SPA sin HTML | Prerenderizar y enlazar desde contenido comercial |
| Conflicto de interés | No visible | Añadir declaración en autoría y en páginas comerciales |
| Historial de cambios | No visible | Añadir `dateModified` visible y changelog en páginas YMYL |

---

## 8. Contenido: el riesgo de “scaled content abuse”

### 8.1 Lo que muestran los datos

- 103 noticias farmacéuticas.
- 100 declaran asistencia de IA.
- 100 pares con similitud ≥0,40; 97 ≥0,60; 84 ≥0,70; 12 ≥0,80.
- Estructura repetida: entrada, “Tres puntos clave”, “Qué ocurrió”, “Cómo debe interpretarse”, “Qué significa para el químico farmacéutico”, “Límites”, “Fuentes primarias”, “Contenido relacionado”.
- 161 artículos nuevos en ~10 días (de 193 documentados el 28 de octubre a 354 el 7 de noviembre).

### 8.2 Por qué es peligroso

Google no penaliza el uso de IA por sí mismo. Penaliza producir contenido **a escala** cuyo objetivo principal es posicionar, sin valor añadido, sin revisión y sin diferenciación. Una plantilla repetida 100 veces con cambios de sustantivos es el caso de manual. El riesgo no es solo que esas 100 URLs no rankeen: es que arrastren la evaluación de todo el dominio, especialmente en YMYL.

### 8.3 Qué hacer

1. **Congelar** la generación de noticias.
2. **Noindexar o retirar** las 100 piezas casi duplicadas.
3. **Conservar** solo las que tengan análisis propio, fuente primaria y revisión.
4. **Reescribir** con: qué cambió, a quién afecta en Colombia, qué debe hacer un QF, qué no se sabe, qué fuente lo respalda, fecha de consulta.
5. **Fusionar** el resto en un resumen regulatorio mensual o en una página de “Novedades regulatorias” con historial.
6. **No publicar** contenido asistido por IA sin revisión humana y sin valor añadido demostrable.

---

## 9. Rendimiento y Core Web Vitals

### 9.1 Medición de laboratorio (Lighthouse móvil, dos corridas)

Ejecutado el 7-nov-2026 a las 17:17 UTC y 17:17:57 UTC contra `https://edvanta.co/` con Lighthouse 13.6.0, Chrome headless, viewport móvil y throttling por defecto. Los resultados varían entre corridas; se reportan ambos para no presentar un dato único como estable.

| Métrica | Corrida 1 | Corrida 2 | Umbral | Lectura |
|---|---:|---:|---:|---|
| Performance | **45 / 100** | **67 / 100** | ≥ 90 | Malo / variable |
| SEO | 100 / 100 | 100 / 100 | ≥ 90 | Bien |
| Accessibility | 100 / 100 | 100 / 100 | ≥ 90 | Bien |
| Best practices | 100 / 100 | 100 / 100 | ≥ 90 | Bien |
| FCP | 2,0 s | 2,1 s | < 1,8 s | Ligeramente alto |
| LCP | **6,0 s** | **2,1 s** | < 2,5 s | Variable; una corrida falla |
| CLS | 0,0005 | 0,0005 | < 0,1 | Bien |
| TBT | **1.250 ms** | **1.972 ms** | < 200 ms | Malo |
| Speed Index | 7,3 s | 4,3 s | < 3,4 s | Malo |
| TTI | 6,0 s | 5,5 s | < 3,8 s | Malo |
| Peso total | 2.388 KiB | 2.388 KiB | Presupuesto por definir | Alto |
| Requests | 90 | 90 | Presupuesto por definir | Alto |

**Hallazgo clave del LCP:** el elemento LCP no es estable. En la corrida 1 fue el H1 del hero (`span.hx-word`, 6,0 s); en la corrida 2 fue el aviso de cookies (`aside.fixed > p.text-xs`, 2,1 s). Ambos son candidatos reales y deben sacarse de la ruta crítica: el aviso de cookies debería renderizarse en el HTML inicial y el hero debería estabilizarse antes de competir por el LCP. La variabilidad exige 3–5 corridas y, sobre todo, dato de campo CrUX; no se debe concluir con una sola medición.

**Nota:** en esta versión de Lighthouse (13.6.0) el puntaje SEO fue 100/100 en ambas corridas; no se reprodujo el error de `robots.txt` por `Content-Signal` que aparece en algunas versiones o configuraciones.

### 9.2 Peso y composición

| Elemento | Dato | Lectura |
|---|---:|---|
| Assets en `dist/assets` | 328 | Muchos chunks |
| Peso total de assets | 7,4 MB | Alto |
| JS total | 5,9 MB | Alto para un sitio editorial |
| CSS | 223 KB | Mejorable |
| Imágenes en `public/img` | 18,6 MB / 199 archivos | Hay PNG de 1,7 MB y 1,4 MB |
| Familias tipográficas | 4 (Inter, Fraunces, Manrope, Patrick Hand) | Riesgo de bloqueo de render |
| Hero | 158 KB WebP, dimensiones y `fetchpriority` | Bien resuelto |
| Cache de assets | `immutable` 1 año en nginx | Correcto |
| HTML | `no-cache` | Correcto para despliegues |

**Oportunidades medidas por Lighthouse (corrida 2):**

- `unused-javascript`: 85 KiB (≈480 ms); `supabase` aporta 52,5 KiB y el bundle principal 32,7 KiB.
- `render-blocking-insight`: ≈950 ms; Google Fonts (1.009 ms) y el CSS principal (484 ms).
- Google Fonts: 74,7 KiB de transferencia; el CSS de fuentes bloquea el render.
- Imágenes: `image-delivery-insight` estima 1.241 KiB de ahorro; el logo (`logo-edvanta.png`, 133 KiB desperdiciados) y el hero (`edvanta-hero.webp`, 118 KiB) son los mayores.
- DOM: 2.594 elementos; revisar el footer y los menús.

### 9.3 Prioridad de corrección

1. Renderizar el aviso de cookies sin bloquear el LCP.
2. `hydrateRoot` en páginas prerenderizadas; hoy se usa `createRoot` y se reconstruye el árbol.
3. Cargar Supabase y `pdf.js` solo en las rutas que los usan.
4. Subset y `preload` de la fuente crítica; evaluar eliminar `Patrick Hand` del bundle global.
5. `srcset`/AVIF/WebP y compresión de las imágenes de home y landings.
6. Presupuesto de JS/CSS y revisión del chunk `SiteFooter`.

### 9.4 Datos de campo

No se obtuvo dato de campo CrUX en esta sesión. El dato anterior es de laboratorio, con dos corridas y alta variabilidad; hay que confirmarlo con CrUX/GSC y con 3–5 corridas adicionales en móvil real.

---

## 10. Autoridad y backlinks (avance de Fase 5)

- Authority Score: 2.
- Dominios de referencia: 170.
- Backlinks: 243.
- Tráfico orgánico: 0.
- Keywords: 30.

No se recibió el export de backlinks. Sin él no se puede auditar toxicidad, anchors, distribución por URL ni oportunidades de recuperación. Lo que sí se puede decir:

1. **243 backlinks no sostienen 8.000–25.000 páginas.** La meta de 500.000 keywords exige multiplicar la autoridad, no solo el contenido.
2. **El activo enlazable más fuerte es el dataset CUM/INVIMA.** Un informe anual con metodología, gráficos, CSV descargable y citas de universidades/gremios puede generar más enlaces que 100 notas de prensa.
3. **Las alianzas con facultades de farmacia y gremios** son el canal más creíble para un proyecto de educación farmacéutica.
4. **Los perfiles de la revisora** (LinkedIn, directorios profesionales, sociedades científicas) deben enlazar a la página de autora y a las fichas revisadas.
5. **No comprar enlaces ni usar PBN.** Con AS 2, el riesgo/beneficio es pésimo.

**Pendiente:** export de 243 backlinks (Semrush/Ahrefs) con anchor, URL destino, autoridad y fecha. Clasificar: tóxico, irrelevante, relevante, oportunidad de mención sin enlace. Disavow solo para spam claro o acción manual.

---

## 11. Visibilidad en búsqueda con IA

### 11.1 Lo que ya está bien

- `llms.txt` existe y está curado.
- Los artículos tienen respuesta directa al inicio en muchos casos.
- Hay FAQ y tablas en parte del contenido.
- Hay fechas de actualización visibles.
- El HTML de artículos es estático y legible sin JavaScript.

### 11.2 Lo que falta

- Respuesta directa de 40–60 palabras **en todas** las páginas, no solo en algunas.
- Bloque de “Datos clave” con fuente y fecha.
- `reviewedBy` y `lastReviewed` reales.
- Autoría verificable con `sameAs`.
- Tablas comparativas y listas extraíbles.
- Política explícita de rastreadores de IA.
- Medición de referidos de ChatGPT/Perplexity/Gemini.

### 11.3 Decisión pendiente sobre `robots.txt`

Producción bloquea, vía Cloudflare, a `GPTBot`, `Google-Extended`, `ClaudeBot`, `CCBot`, `meta-externalagent`, `Bytespider` y otros. A la vez, permite `search=yes` y `use=reference`. Eso puede ser correcto para proteger el contenido del entrenamiento, pero **`Google-Extended` también afecta a Gemini/Vertex grounding** y `GPTBot` no es lo mismo que `OAI-SearchBot`. Hay que decidir:

| Rastreador | Uso | ¿Permitir? |
|---|---|---|
| `Googlebot` | Búsqueda y AI Overviews | Sí, imprescindible |
| `OAI-SearchBot` | ChatGPT Search | Decisión de negocio |
| `PerplexityBot` | Perplexity | Decisión de negocio |
| `Google-Extended` | Gemini/Vertex grounding y entrenamiento | Decisión de negocio |
| `GPTBot` | Entrenamiento de OpenAI | Decisión de negocio |
| `ClaudeBot` | Entrenamiento de Anthropic | Decisión de negocio |
| `CCBot` | Common Crawl | Decisión de negocio |

No se cambiará nada sin aprobación explícita.

---

## 12. Stack recomendado para generar miles de páginas

### 12.1 Comparación

| Opción | Ventajas | Desventajas | Cuándo elegirla |
|---|---|---|---|
| **Astro 5 + Postgres, manteniendo React/Vite para la app** | HTML estático por defecto, cero JS innecesario, content collections, excelente para 10.000+ páginas, bajo riesgo de migración, se puede integrar en el mismo nginx | Dos frameworks en el repo; hay que compartir tokens/componentes; rutas nuevas conviven con el SPA | **Recomendada** para el plan de 24 meses |
| Next.js 15 App Router (SSG/ISR) | Un solo framework React; RSC; ISR; ecosistema | Migrar React Router, auth, aula, admin y app es un proyecto de 2–4 meses; riesgo alto; builds largos | Si dirección quiere unificar todo en React y acepta migración |
| Extender el prerender actual de Vite | Cero migración; reutiliza componentes; sirve para el piloto | Build lineal; plantillas manuales; difícil de mantener a 8.000–25.000 páginas; sin content collections | Solo para el piloto de 50–100 páginas si urge |

### 12.2 Recomendación

**Astro como capa de contenido estático + PostgreSQL como fuente de verdad + React/Vite actual para la app interactiva.**

Arquitectura propuesta:

```text
PostgreSQL / Supabase
  ├── cum_records (INVIMA)
  ├── drugs (DCI)
  ├── drug_products (marca, CUM, titular, forma, concentración)
  ├── atc_codes
  ├── holders
  ├── dosage_forms
  ├── sources
  ├── reviews (reviewed_by, reviewed_at, status)
  └── pages (ruta, plantilla, indexable, last_verified_at)
        │
        ▼
ETL Node (ingesta, normalización, deduplicación, mapeo ATC)
        │
        ▼
Content store (draft → machine QA → clinical review → approved)
        │
        ▼
Astro SSG por lotes (HTML + JSON-LD + sitemap segmentado)
        │
        ▼
dist/ → nginx/Coolify → Cloudflare
```

**Por qué no empezar con Next.js:** la app actual tiene auth, aula, checkout, paneles, PDFs, Supabase y decenas de rutas. Reescribir todo para ganar SSG es un riesgo innecesario. Astro permite construir el motor de contenido sin tocar la app.

**Decisión requerida antes de la Fase 1:** Astro vs Next vs prerender extendido. Sin esta decisión no se empieza a generar páginas.

### 12.3 Modelo de datos mínimo para el clúster A

| Tabla | Campos mínimos |
|---|---|
| `drugs` | `id`, `dci`, `slug`, `atc_code`, `indications`, `mechanism`, `warnings`, `pregnancy`, `lactation`, `renal`, `hepatic`, `sources[]`, `reviewed_by`, `reviewed_at`, `last_verified_at`, `status`, `indexable` |
| `drug_products` | `id`, `drug_id`, `brand`, `cum`, `holder`, `dosage_form`, `concentration`, `presentation`, `registry_status`, `resolution`, `expediente`, `source_url`, `last_verified_at` |
| `atc_codes` | `code`, `name`, `parent_code`, `level`, `slug` |
| `holders` | `id`, `name`, `slug`, `country`, `products_count` |
| `dosage_forms` | `id`, `name`, `slug` |
| `sources` | `id`, `type` (INVIMA/EMA/FDA/PubMed/guía), `title`, `url`, `published_at`, `accessed_at` |
| `reviews` | `page_id`, `reviewer_id`, `reviewed_at`, `status`, `notes`, `version` |
| `pages` | `path`, `template`, `cluster`, `status`, `indexable`, `last_built_at`, `last_indexed_at` |

### 12.4 Quality gate antes de indexar

Una página solo puede entrar al sitemap si cumple **todo**:

- `status = approved`.
- `reviewed_by` y `reviewed_at` presentes.
- Al menos 2 fuentes primarias verificables para salud/medicamentos; 1 fuente oficial para no salud.
- Campos obligatorios completos; los faltantes marcados `TODO` y, si son críticos, `noindex`.
- Similitud <30% con páginas hermanas (shingles de 5 palabras/Jaccard).
- Al menos 5 enlaces internos contextuales.
- Breadcrumb y canonical autorreferente.
- JSON-LD válido y sin `reviewedBy` falso.
- Respuesta directa de 40–60 palabras al inicio.
- Ningún dato inventado: dosis, indicaciones, interacciones y embarazo solo desde ficha técnica/guía.
- Enlaces externos con URL, fecha de publicación y fecha de consulta.

---

## 13. Plan de Fase 0 (10 días hábiles)

| Día | Entregable | Responsable |
|---|---|---|
| 1 | Auditoría técnica y de contenido (este documento) | SEO |
| 2 | Solicitud de inputs: CSV Semrush, acceso GSC, export de backlinks, muestra CUM, decisión de stack, política de IA | SEO/dirección |
| 3 | Baseline: URLs, indexación, tráfico, keywords, backlinks | SEO |
| 4 | Mapa de keywords → URLs y detección de canibalización | SEO |
| 5 | Revisión con dirección: prioridades, noindex, congelar noticias, stack | Dirección |
| 6–7 | Especificación técnica de Fase 1: sitemap index, canonical, 404, schema, autoría | SEO/desarrollo |
| 8–9 | Especificación del pipeline CUM y de la plantilla de medicamento | SEO/desarrollo/QF |
| 10 | Aprobación del plan de 90 días y arranque de Fase 1 | Dirección |

**Regla:** no se publica ni se indexa ninguna página nueva hasta que la Fase 1 esté aprobada y el quality gate esté implementado.

---

## 14. Qué no hacer

- No generar 1.000 páginas de medicamentos antes de tener datos CUM normalizados y revisión clínica.
- No indexar páginas de salud sin `reviewed_by` + `reviewed_at`.
- No crear variantes por ciudad/país si el contenido no cambia de verdad.
- No usar IA para producir lotes sin revisión humana y sin valor diferencial.
- No inventar dosis, indicaciones, referencias ni datos de registro.
- No cambiar URLs existentes sin 301, canonical, enlaces internos y sitemap.
- No comprar enlaces ni usar redes de blogs.
- No tocar `robots.txt` de IA sin decisión de negocio.

---

## 15. Inputs que faltan

| Input | Estado | Para qué |
|---|---|---|
| Export Semrush de las 30 keywords | **No recibido** | Mapear keywords y URLs; priorizar |
| Acceso a Search Console | **No confirmado** | Ver indexación, consultas, CTR, páginas sin impresiones |
| Export de 243 backlinks | **No recibido** | Auditoría de autoridad y toxicidad |
| Muestra del dataset CUM/INVIMA | **No recibido** | Estimar páginas reales y campos disponibles |
| Credenciales completas de Karla | Parcial | Schema Person y página de autora |
| Decisión de stack | Pendiente | Astro vs Next vs prerender |
| Política de rastreadores de IA | Pendiente | robots.txt y visibilidad en IA |
| Aprobación de noindex de salud | Pendiente | Regla #2 |

---

## Anexo A. Evidencia de comprobaciones live

```text
GET https://edvanta.co/robots.txt
200 · incluye reglas de Cloudflare + sitemaps

GET https://edvanta.co/sitemap.xml
200 · 490 URLs

GET https://edvanta.co/enfermedades/hipotiroidismo
200 · title y canonical de la home

GET https://edvanta.co/feliz-sin-tiroides
200 · title y canonical de la home

GET https://edvanta.co/cursos
200 · title y canonical de la home

GET https://edvanta.co/privacidad
200 · title y canonical de la home

GET https://edvanta.co/autores/karla-hernandez
200 · shell del SPA, canonical a la home

GET https://edvanta.co/no-existe-xyz-123
200 · index, follow, canonical a la home

GET http://edvanta.co/
200 · sin 301 a HTTPS

GET https://www.edvanta.co/
200 · sin 301 al dominio canónico

GET https://edvanta.co/ · Lighthouse móvil · 2026-11-07 17:17 UTC (2 corridas)
Performance 45 y 67 · LCP 6,0 s y 2,1 s · TBT 1.250 ms y 1.972 ms · CLS ~0
SEO, accesibilidad y buenas prácticas 100 en ambas corridas
LCP: H1 del hero en una corrida; aviso de cookies en la otra
```

## Anexo B. Plantilla para mapear las 30 keywords

```csv
n,keyword,volumen_mensual,posicion_actual,url_que_rankea,intencion,cluster,estado_contenido,accion
1,,,,,,,,
2,,,,,,,,
...
30,,,,,,,,
```

## Anexo C. Sitemaps propuestos

```text
/sitemap-index.xml
/sitemap-paginas.xml            (home, escuelas, instituciones, legal, contacto, sobre)
/sitemap-articulos.xml          (artículos aprobados)
/sitemap-medicamentos.xml       (DCI + marcas)
/sitemap-atc.xml
/sitemap-laboratorios.xml
/sitemap-formas-farmaceuticas.xml
/sitemap-glosario.xml
/sitemap-cursos.xml             (API actual, cacheado)
/sitemap-profesional.xml        (API actual, cacheado)
/sitemap-herramientas.xml
```

Cada sitemap: máximo 10.000 URLs, solo 200/indexable/autorreferente, `lastmod` real, sin `priority` engañoso.

---

## Anexo D. Estado de la corrección local (7-nov-2026)

Estas comprobaciones se hicieron en local/staging, sin desplegar:

| Corrección | Resultado |
|---|---|
| HTML propio y canonical en las 86 URLs del sitemap | 0 URLs base sin HTML/API |
| 404 real | `/enfermedades/no-existe` y `/no-existe` devuelven 404; `/404.html` también |
| Host y esquema | `www` → apex y HTTP → HTTPS con 301 |
| Sitemap index | `/sitemap.xml` y `/sitemap-index.xml`; segmentos de páginas, artículos y herramientas + sitemaps de API |
| Sitemaps sin `noindex` | 90 páginas + 196 artículos + 10 herramientas; 0 problemas |
| YMYL sin revisión | 184 artículos y 9 páginas de enfermedad en `noindex`, fuera de sitemap |
| Rutas privadas | `X-Robots-Tag: noindex` para aula, admin, FST App, mi espacio, cuenta, certificados y clases |
| Build | `npm.cmd run build` correcto |
| Nginx | `nginx -t` correcto y pruebas de 200/404/301 |
| Tests frontend | 143/143 correctos |
| Tests API | 261/264; 3 fallos por la migración `071_evaluacion_regulatorios.sql`, ajenos a SEO |

**Pendiente:** cambiar el `robots.txt` gestionado por Cloudflare (bloquea IA y contiene `Content-Signal` inválido), medir CWV de campo, revisar clínicamente las 184 páginas YMYL y ejecutar el plan de autoridad. No se ha desplegado nada.

**Fin de la auditoría. No se publicó ni se modificó producción.**


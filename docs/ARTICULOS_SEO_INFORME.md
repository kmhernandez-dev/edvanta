# Informe de mejora editorial y SEO de artículos

Fecha: 28 de octubre de 2026.

## Alcance

Se revisó el blog completo publicado en `/articulos`, no solo la primera página. La fuente de contenido son los archivos Markdown de `public/articulos/articulos_edvanta/**/*.md`; los metadatos de portada están en `src/data/articulos.js` y `src/data/articulosSalud.js`; la nueva capa SEO está en `src/data/articulosSEO.js`.

No hubo acceso a Search Console en esta pasada. Las intenciones de búsqueda se formularon como hipótesis editoriales a partir del título, la categoría, el público y el contenido; no se inventaron volúmenes de búsqueda, posiciones ni competencia.

## Totales

- Artículos encontrados: **193**.
- Artículos con título SEO, metadescripción, imagen válida y texto alternativo: **193**.
- Artículos con cuerpo actualizado (fuentes, recursos, FAQ, nota de diferenciación o corrección de JSON-LD): **96**.
- Artículos que contienen enlaces internos dentro del Markdown: **148**. Los 45 restantes tienen enlaces relacionados automáticos en la página y en el HTML prerenderizado.
- Artículos sin FAQ: **28**. Los artículos de medicamentos y condiciones que más lo necesitaban recibieron preguntas específicas; no se añadieron respuestas repetidas.
- Artículos sin fuente primaria: **15**. Son en su mayoría resúmenes de cursos, artículos de carrera o recursos comerciales.
- Artículos con menos de 600 palabras: **43**. Se revisaron; muchos son resúmenes de curso o explicaciones breves que no deben rellenarse.
- Errores técnicos de imagen, alt o longitud SEO detectados al cierre: **0**.

## Cambios principales

### Metadatos y metadatos sociales

- Títulos SEO específicos y únicos para los 193 artículos.
- Metadescripciones específicas y únicas, sin duplicados y con longitud controlada.
- Título visible, H1 y URL conservados.
- `og:title`, `og:description`, `og:image:alt`, `twitter:image:alt`, canonical y robots coherentes.
- Fechas originales conservadas; `dateModified` y sitemap actualizados solo en los 96 artículos con cambios de cuerpo.

### Imágenes y accesibilidad

- 189 artículos tenían imagen rota o inexistente; ahora todos usan una imagen existente y pertinente a su categoría.
- 114 artículos no tenían texto alternativo; ahora todos tienen alt descriptivo.
- Se añadieron dimensiones y carga adecuada a las imágenes de portada y tarjetas.

### Enlaces internos, fuentes y FAQ

- Se añadieron secciones de fuentes o recursos a 54 artículos que no tenían referencias.
- Se añadieron preguntas frecuentes específicas a 11 artículos de medicamentos, condiciones y alimentación tiroidea.
- En los artículos con enlaces comerciales se usó el rótulo «Recursos relacionados» para no presentarlos como evidencia científica.
- Se incorporaron fuentes oficiales de ISO, OIT, PMI, Microsoft Learn y ASQ en los temas que las admiten.
- Se añadieron notas de diferenciación y enlaces cruzados en tres pares que competían por la misma intención: PRM/RNM, conciliación medicamentosa e hipertensión arterial.
- Se conservaron los enlaces internos existentes y se verificó que todos los enlaces a `/articulos/<slug>` apunten a artículos publicados.

### Renderizado y datos estructurados

- El HTML prerenderizado usa el título SEO y la metadescripción nuevos.
- El JSON-LD de artículo incluye `articleSection`, imagen con caption y datos de fecha.
- Se retiraron 29 bloques de «JSON-LD sugerido» que se mostraban como código dentro del cuerpo del artículo; el JSON-LD real se genera en la página y en el HTML estático.
- Al montar React se elimina el JSON-LD prerenderizado para evitar `Article` y `FAQPage` duplicados.
- El sitemap generado incluye los 193 artículos y las fechas de actualización correspondientes.

## Comprobaciones

- `npm run build`: correcto, incluidas 193 páginas estáticas de artículos y 34 páginas fijas.
- `npm test`: 128 pruebas frontend y 174 de API aprobadas, tras corregir un desfase de fecha en la racha de retos detectado durante la verificación.
- `node scripts/auditar-enlaces.cjs`: 0 enlaces internos rotos, 0 anclas vacías y 0 enlaces vacíos.
- `node scripts/verificar-fuentes.mjs --sin-red`: sin problemas en los artículos de salud revisados.
- Las 193 páginas HTML estáticas tienen título, canonical, JSON-LD y metadatos de imagen alternativos.
- El sitemap generado contiene 193 URLs de artículos y 24 URLs de categorías, sin duplicados.
- Prueba de renderizado por URL directa de un artículo, con verificación de título, metadescripción, alt de imagen y ausencia de JSON-LD duplicado.

## Pendientes concretos

1. **28 artículos sin FAQ.** No se añadieron preguntas genéricas; conviene decidir cuáles necesitan FAQ propia y redactarlas con revisión editorial.
2. **15 artículos sin fuente primaria.** Son resúmenes de cursos, artículos de carrera o recursos comerciales. Si se amplían con afirmaciones científicas o regulatorias, deben incorporar fuentes primarias. Lista: `5-razones-especializarte-atencion-farmaceutica-fibrosis-quistica`, los nueve `curso-*` de atención farmacéutica, `emprendimientos-quimicos-farmaceuticos-colombia`, `como-estudiar-100-farmacos-en-7-dias`, `tecnicas-de-estudio-basadas-en-neurociencia`, `profesiones-digitales-mas-demandadas-2026` y `como-mejorar-tu-perfil-profesional-con-cursos-gratuitos`.
3. **43 artículos con menos de 600 palabras.** Se dejaron breves cuando el tema no pedía más extensión. La lista completa está en el inventario.
4. **Revisión profesional pendiente.** Los artículos clínicos, regulatorios y de farmacoterapia requieren validación por la profesional responsable antes de presentarlos como material revisado. No se atribuyó una revisión que no ocurrió.
5. **Enlaces ISO/ASQ.** Algunos sitios oficiales bloquean la comprobación automatizada con 403; los enlaces son oficiales, pero conviene una comprobación manual antes de una campaña.

## Estado

Los cambios están **guardados en el proyecto local** y el build fue verificado. No se publicaron ni desplegaron en producción en esta pasada.

## Archivos principales

- `src/data/articulosSEO.js`: capa de títulos SEO, descripciones, imágenes y alt.
- `src/pages/ArticuloPage.jsx`: metadatos, JSON-LD, imagen, CTA temático y relacionados.
- `src/pages/ArticulosIndex.jsx`: alt de tarjetas.
- `src/utils/seo.js`: metadatos sociales y eliminación de JSON-LD duplicado.
- `scripts/prerenderizar-articulos.mjs`: HTML estático y sitemap.
- `docs/ARTICULOS_SEO_INVENTARIO.md`: inventario completo de los 193 artículos.
- `docs/ARTICULOS_SEO_INVENTARIO.json`: inventario legible por máquina.
- `docs/ARTICULOS_SEO_INTENCIONES.md`: consulta principal, intención, audiencia, preguntas que ya responde cada artículo y vacíos detectados.
- `docs/ARTICULOS_SEO_INTENCIONES.json`: la misma matriz en formato de datos.
- `backups/articulos-before-seo-20261028-203833/`: respaldo recuperable previo a los cambios.

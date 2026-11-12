# Guías de cursos y cursos curados: contenido propio por lotes

## Diagnóstico (11-nov-2026)

| Medida | Antes | Después del lote 1 |
|---|---|---|
| Similitud media entre las 50 guías de `industria-cursos` (tejas de 5 palabras) | 0,45 (máxima 0,84) | 0,02 entre las 8 reescritas (máxima 0,05) |
| Palabras de una guía por área | ~700 | 1.160 a 1.810 |
| Guías indexables | 50 de plantilla | 8 con contenido propio; las otras 42, en `noindex,follow` hasta su reescritura |
| Palabras sin JavaScript de una ficha curada | ~160 a 190 | 325 a 385, en los 12 cursos del lote 1 |

Las guías de plantilla repetían el mismo texto y solo cambiaban el nombre del área. A escala, eso frena la indexación del sitio, como pasó con las noticias. Por eso se aplica la misma regla: lo que se reescribe con contenido propio vuelve al índice (`contenidoPropio: true`, `src/lib/seo/indexabilidad.js`).

## Lote 1 (hecho, 11-nov-2026)

**Las 8 guías por área**

- Aseguramiento de calidad
- Control de calidad
- Validaciones
- Asuntos regulatorios
- Farmacovigilancia
- Producción
- I+D
- Datos e IA

Cada una incluye:

- funciones reales del cargo;
- normas verificadas en el normograma del INVIMA:
  - Resolución 1160 de 2016;
  - Resolución 2190 de 2020;
  - Decreto 677 de 1995;
  - Decreto 334 de 2022;
  - Decreto 1782 de 2014;
  - Resolución 2378 de 2008;
- los cursos propios gratis de Edvanta;
- los cursos curados;
- una ruta de 90 días;
- cinco preguntas frecuentes, que se marcan como FAQPage;
- las fuentes.

Todos los enlaces internos se comprobaron contra el catálogo real y los externos responden.

**Guía editorial de 12 cursos curados** (`api/lib/guias-de-cursos-curados.js`)

- Cursos del lote:
  - gestión de calidad;
  - auditoría;
  - Lean y Lean Six Sigma;
  - Power BI y Power BI avanzado;
  - Python;
  - SQL Server;
  - análisis de datos;
  - gestión ambiental;
  - SST;
  - gestión de proyectos.
- Secciones de cada guía:
  - para qué sirve en el trabajo farmacéutico;
  - cómo se aplica;
  - para quién es;
  - con qué cursos gratis de Edvanta se complementa;
  - preguntas propias.
- Sale en la página y en el HTML del servidor.

**Controles:** `src/__tests__/seo-guias-cursos.test.jsx`.

- Similitud menor de 0,3 entre las guías reescritas.
- Las de plantilla, en `noindex`.
- Mínimo de 1.000 palabras.
- Título de 60 caracteres y descripción de 155.
- Preguntas frecuentes y fuentes.
- Guías curadas completas.

## Lote 2 (hecho, 11-nov-2026)

**Las 8 guías de tema de calidad:** ISO 9001, BPM y GMP, buenas prácticas de documentación, CAPA y desviaciones, gestión de riesgos, auditoría farmacéutica, integridad de datos y Lean Six Sigma.

- Entre 1.017 y 1.072 palabras cada una, con tiempo de lectura de 6 minutos.
- Cada una tiene una sección práctica propia del tema: el glosario de ISO 9001, qué estudiar después de BPM, los errores de documentación, los indicadores de CAPA, un FMEA de ejemplo, la auditoría a proveedores, el papel en la integridad de datos y un proyecto DMAIC.
- Referencias: ICH Q9(R1) de 2023, ICH Q10, ISO 19011, ALCOA+, 21 CFR Part 11, Anexo 11 y GAMP 5 (segunda edición, 2022). La Resolución 1160 de 2016 y la 2190 de 2020 ya estaban verificadas en el normograma.
- Las tablas de cursos solo traen los que corresponden al tema; ya no se repite la tabla genérica de 8 cursos.
- Los 31 enlaces internos existen en los sitemaps de producción.
- Similitud entre las 16 reescritas: media 0,01, máxima 0,05.
- Las guías en `noindex` bajaron de 107 a 99 páginas (las 42 de plantilla pasaron a 34).

## Lote 3 (hecho, 11-nov-2026)

**Las 11 guías de control de calidad y validaciones:** HPLC, validación de métodos analíticos, estudios de estabilidad, microbiología farmacéutica, investigaciones de laboratorio (OOS y OOT), análisis farmacéutico, validación de procesos, validación de limpieza, CSV y GAMP 5, calificación de HVAC y validación de equipos.

- Entre 1.013 y 1.203 palabras cada una.
- Normas colombianas verificadas en el normograma del INVIMA:
  - Resolución 3619 de 2013 (BPL, basada en el informe técnico 957 de la OMS; cubre el control fisicoquímico y microbiológico y exige una política para los resultados OOS);
  - Resolución 3157 de 2018 (estabilidad de medicamentos de síntesis química; zona IVb, 30 °C ± 2 °C y 75 % ± 5 % de humedad relativa);
  - Resolución 1839 de 2020, que modifica la 3157 en el plazo de vigencia;
  - Resolución 3690 de 2016 (estabilidad de biológicos);
  - Resolución 2190 de 2020.
- Referencias internacionales: ICH Q2(R2), Q14, la serie Q1 y Q5C; la guía de la FDA de validación de procesos (2011) y la de resultados OOS; el Anexo 1 (2022), el Anexo 11 y el Anexo 15 (2015) de la Unión Europea; la guía de la EMA sobre límites basados en la salud; GAMP 5 (segunda edición, 2022); ISO 14644-1; y la OMS (TRS 961, anexo 2, y TRS 1010, anexo 8).
- Cada tabla enlaza los cursos propios gratis del tema y solo los cursos de Udemy que corresponden.
- Las guías de validaciones enlazan también la capacitación institucional `/empresas/validaciones-y-calificaciones`.
- Similitud entre las 27 reescritas: máxima de 0,05.
- Páginas en `noindex` del build: de 99 a 88.

**Corrección del lote 2:** Validaciones y Calificaciones y BPM en la Industria Farmacéutica son cursos propios de Edvanta (gratis, con certificado de COP 60.000), no curados. Antes de etiquetar un curso, hay que revisar el texto «Lo imparte:» de su ficha.

## Siguientes lotes

1. **Lote 4:** regulatorios, farmacovigilancia y producción (15).
2. **Lote 5:** I+D y datos (8).
3. **Cursos curados:** 32 de industria farmacéutica y 21 de salud, en lotes de 12.

**Indexación:** cuando haya más guías listas, se pide a Karla aprobar la solicitud en Search Console (unas 10 al día) y se toma la línea base en `seo/medicion.md`.

**Regla:** solo se marca `contenidoPropio: true` cuando el texto es propio. Además:

- las normas citadas se verifican en el normograma del INVIMA;
- la similitud con las demás guías debe ser menor de 0,3;
- los enlaces internos deben existir.

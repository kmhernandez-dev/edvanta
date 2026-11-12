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

## Siguientes lotes

1. **Lote 2:** las 8 guías de tema de calidad, de `cursos-gratis-iso-9001` a `cursos-gratis-lean-six-sigma`.
2. **Lote 3:** control de calidad y validaciones (11).
3. **Lote 4:** regulatorios, farmacovigilancia y producción (15).
4. **Lote 5:** I+D y datos (8).
5. **Cursos curados:** 32 de industria farmacéutica y 21 de salud, en lotes de 12.

**Regla:** solo se marca `contenidoPropio: true` cuando el texto es propio. Además:

- las normas citadas se verifican en el normograma del INVIMA;
- la similitud con las demás guías debe ser menor de 0,3;
- los enlaces internos deben existir.

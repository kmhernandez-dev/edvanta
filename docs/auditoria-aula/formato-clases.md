# Formato de las clases del aula

Generado por `node scripts/auditar-formato-clases.mjs` sobre las migraciones del repositorio (incluye `194_formato_unico_de_clases.sql`). Lo editado a mano en el panel de producción no aparece aquí. Detalle por clase: `formato-clases.csv`.

## El formato de referencia (cursos de Farmacoterapia)

1. Video.
2. Experiencia interactiva: situación inicial, objetivos, conceptos, mapa conceptual, lectura, mapa de proceso, caso, errores frecuentes, repaso, resumen y referencias.
3. «En esta clase»: de qué trata y su objetivo.
4. «La clase en texto»: la lectura.
5. Ejemplo aplicado y puntos clave.
6. «Para profundizar»: documentos oficiales.
7. «Referencias».

## Estado

| Estado | Clases | % |
|---|---|---|
| A. Estructura moderna con contenido propio | 436 | 25 % |
| B. Estructura moderna con contenido de plantilla | 1147 | 67 % |
| C. Sin estructura moderna | 131 | 8 % |
| **Total** | **1714** | |

Bloques del formato, en las 1714 clases:

- «En esta clase»: 1678.
- «La clase en texto» con su lectura: 571.
- «Ejemplo aplicado»: 223. «Puntos clave»: 231.
- Video: 1119.

### Qué es «contenido de plantilla»

El generador automático (`scripts/generar-experiencias-catalogo.mjs`) armó la experiencia de estas clases con el resumen de la clase, el caso de la unidad y frases fijas. La estructura es la moderna, pero partes del contenido son iguales en cientos de clases:

| Marca | Clases |
|---|---|
| resumen genérico | 1141 |
| imagen genérica | 1141 |
| pasos sin nombre | 687 |
| mapa con «Paso 1» | 683 |
| evidencia sin definir | 682 |
| caso con pregunta genérica | 646 |

Estas son las clases que hay que escribir con contenido propio, como las de Farmacoterapia, para que queden completas.

## Qué hizo la migración 194

Las migraciones de experiencias (120 a 189) retiraron todos los bloques de texto de cada clase, no solo el resumen corto. En Farmacoterapia quedaron los encabezados «La clase en texto» y «Referencias» sin nada debajo. `194_formato_unico_de_clases.sql` devuelve ese texto a su lugar, sin escribir contenido nuevo:

- 2.041 textos restituidos en 1.696 clases de 61 cursos;
- el resumen de cada clase vuelve como «En esta clase»;
- la lectura que existía vuelve bajo «La clase en texto» en 458 clases con experiencia (entre ellas las 136 de Farmacoterapia, con sus referencias), y las 18 fichas de medicamento recuperan la ficha completa;
- los enlaces quedan bajo «Para profundizar»;
- el orden de los bloques es el mismo en todas las clases.

La página pública de la clase (`/curso-de-…/clase/…`) muestra ahora esa parte en texto debajo de la experiencia (`apoyoDeClase` en `api/lib/clase-publica.js`).

## Qué falta para que todas queden como Farmacoterapia

1. **Estado B:** escribir con contenido propio la experiencia de las clases de plantilla (pasos con nombre, evidencia concreta, resumen de la clase y no del formato). Es redacción clínica y regulatoria: se hace por curso y pasa por la revisión de Karla.
2. **Estado C:** crear la experiencia de las clases que no la tienen. Sin experiencia, la clase no tiene página pública.
3. **Ejemplo aplicado y puntos clave:** solo los traen las clases de Farmacoterapia, habilidades blandas y manipulación de alimentos.

El orden sugerido, por demanda de búsqueda, está en `seo/keywords-5000-clases.md`.

## Por curso

| Curso | Clases | A | B | C | Con «La clase en texto» | Con puntos clave | Palabras por clase |
|---|---|---|---|---|---|---|---|
| Autocuidado de la tiroides | 8 | 4 | 4 | 0 | 0 | 0 | 571 |
| Buenas Prácticas de Manufactura (BPM) en la Industria Farmacéutica | 9 | 0 | 0 | 9 | 0 | 0 | 1637 |
| Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales | 9 | 0 | 0 | 9 | 0 | 0 | 1805 |
| Central de Mezclas: Preparaciones Estériles, BPE y Gestión de la Calidad | 9 | 0 | 9 | 0 | 0 | 0 | 1022 |
| Asuntos Regulatorios Sanitarios ante INVIMA | 9 | 0 | 9 | 0 | 0 | 0 | 998 |
| Validaciones y Calificaciones en la Industria Farmacéutica | 9 | 9 | 0 | 0 | 0 | 0 | 558 |
| Curso de Gestión de Calidad Farmacéutica | 35 | 35 | 0 | 0 | 3 | 0 | 561 |
| Curso de Aseguramiento de la Calidad Farmacéutica | 35 | 0 | 35 | 0 | 5 | 0 | 1022 |
| Curso de Control de Calidad de Medicamentos | 35 | 35 | 0 | 0 | 2 | 0 | 401 |
| Curso de Buenas Prácticas de Manufactura — BPM | 35 | 35 | 0 | 0 | 6 | 0 | 467 |
| Curso de Buenas Prácticas de Laboratorio — BPL | 35 | 0 | 35 | 0 | 9 | 0 | 1017 |
| Curso de Buenas Prácticas de Documentación Farmacéutica | 30 | 0 | 30 | 0 | 13 | 0 | 1092 |
| Curso de Auditoría de Calidad Farmacéutica | 32 | 32 | 0 | 0 | 32 | 0 | 1006 |
| Curso de Gestión de Riesgos en la Calidad Farmacéutica | 33 | 0 | 0 | 33 | 33 | 0 | 476 |
| Curso de Gestión de Desviaciones y Acciones Correctivas y Preventivas — CAPA | 35 | 0 | 35 | 0 | 7 | 0 | 1022 |
| Curso de Validación de Métodos Analíticos | 33 | 0 | 33 | 0 | 9 | 0 | 1004 |
| Curso de Asuntos Regulatorios Farmacéuticos en Colombia | 33 | 0 | 33 | 0 | 5 | 0 | 985 |
| Curso de Registro Sanitario de Medicamentos ante el INVIMA | 35 | 0 | 35 | 0 | 5 | 0 | 981 |
| Curso de Renovación de Registros Sanitarios de Medicamentos | 32 | 0 | 32 | 0 | 5 | 0 | 972 |
| Curso de Modificaciones al Registro Sanitario de Medicamentos | 35 | 0 | 35 | 0 | 5 | 0 | 970 |
| Curso de Elaboración de Dossiers Farmacéuticos | 31 | 0 | 31 | 0 | 5 | 0 | 1033 |
| Curso de Respuesta a Requerimientos del INVIMA | 33 | 0 | 33 | 0 | 12 | 0 | 1077 |
| Curso de Etiquetado e Insertos de Medicamentos | 33 | 0 | 33 | 0 | 10 | 0 | 1023 |
| Curso de Estudios de Estabilidad para el Registro de Medicamentos | 33 | 0 | 33 | 0 | 7 | 0 | 979 |
| Curso de Bioequivalencia y Requisitos Regulatorios en Colombia | 34 | 0 | 34 | 0 | 7 | 0 | 985 |
| Curso de Gestión Documental de Trámites ante el INVIMA | 34 | 0 | 34 | 0 | 8 | 0 | 1012 |
| Curso de Registro Sanitario de Medicamentos Biológicos | 34 | 0 | 34 | 0 | 6 | 0 | 947 |
| Curso de Regulación de Medicamentos Biosimilares | 34 | 0 | 34 | 0 | 5 | 0 | 924 |
| Curso de Registro Sanitario de Vacunas | 35 | 0 | 35 | 0 | 5 | 0 | 942 |
| Curso de Registro Sanitario de Productos Fitoterapéuticos | 31 | 0 | 31 | 0 | 6 | 0 | 950 |
| Curso de Regulación de Medicamentos Homeopáticos | 35 | 0 | 35 | 0 | 6 | 0 | 955 |
| Curso de Registro Sanitario de Suplementos Dietarios | 32 | 0 | 32 | 0 | 7 | 0 | 955 |
| Curso de Regulación Sanitaria del Cannabis Medicinal en Colombia | 35 | 0 | 35 | 0 | 9 | 0 | 980 |
| Curso de Asuntos Regulatorios de Radiofármacos | 34 | 0 | 34 | 0 | 8 | 0 | 957 |
| Curso de Regulación Sanitaria de Gases Medicinales | 33 | 0 | 33 | 0 | 4 | 0 | 899 |
| Curso de Importación de Medicamentos Vitales No Disponibles | 33 | 0 | 33 | 0 | 9 | 0 | 1004 |
| Curso de Farmacología Oncológica | 31 | 0 | 31 | 0 | 8 | 0 | 991 |
| Curso de Quimioterapia Antineoplásica | 32 | 0 | 32 | 0 | 7 | 0 | 940 |
| Curso de Inmunoterapia Oncológica | 33 | 0 | 33 | 0 | 8 | 0 | 980 |
| Curso de Terapias Dirigidas en Oncología | 34 | 0 | 34 | 0 | 5 | 0 | 952 |
| Curso de Farmacología Cardiovascular | 33 | 33 | 0 | 0 | 6 | 0 | 386 |
| Curso de Farmacología Endocrina | 35 | 35 | 0 | 0 | 6 | 0 | 366 |
| Curso de Farmacología del Sistema Nervioso Central | 34 | 34 | 0 | 0 | 9 | 0 | 392 |
| Curso de Psicofarmacología | 33 | 0 | 33 | 0 | 13 | 0 | 1028 |
| Curso de Farmacología Respiratoria | 32 | 32 | 0 | 0 | 6 | 0 | 379 |
| Curso de Farmacología Gastrointestinal | 40 | 0 | 40 | 0 | 6 | 0 | 914 |
| Curso de Farmacología Renal | 35 | 0 | 35 | 0 | 4 | 0 | 951 |
| Curso de Farmacología de Anticoagulantes y Antiagregantes | 33 | 0 | 33 | 0 | 9 | 0 | 1003 |
| Curso de Farmacoterapia de la Diabetes | 40 | 40 | 0 | 0 | 35 | 35 | 638 |
| Curso de Farmacoterapia de la Hipertensión Arterial | 37 | 37 | 0 | 0 | 33 | 33 | 538 |
| Curso de Farmacoterapia de la Insuficiencia Cardíaca | 39 | 39 | 0 | 0 | 34 | 34 | 574 |
| Curso de Farmacoterapia del Asma y la EPOC | 38 | 36 | 2 | 0 | 34 | 34 | 560 |
| Curso de Oratoria: cómo hablar en público con seguridad | 8 | 0 | 0 | 8 | 8 | 8 | 437 |
| Curso para perder el miedo a hablar en público | 8 | 0 | 0 | 8 | 8 | 8 | 452 |
| Curso de Presentaciones Efectivas y Storytelling | 8 | 0 | 0 | 8 | 8 | 8 | 400 |
| Curso de Comunicación Asertiva en el Trabajo | 8 | 0 | 0 | 8 | 8 | 8 | 424 |
| Curso de Lenguaje Corporal y Comunicación No Verbal | 8 | 0 | 0 | 8 | 8 | 8 | 470 |
| Curso de Negociación y Persuasión | 8 | 0 | 0 | 8 | 8 | 8 | 474 |
| Curso de Inteligencia Emocional en el Trabajo | 8 | 0 | 0 | 8 | 8 | 8 | 466 |
| Curso de Liderazgo y Trabajo en Equipo | 8 | 0 | 0 | 8 | 8 | 8 | 464 |
| Curso de Servicio al Cliente y Comunicación con el Paciente | 8 | 0 | 0 | 8 | 8 | 8 | 514 |
| Curso para Hablar Frente a la Cámara: Oratoria Digital para Videos y Videollamadas | 8 | 0 | 0 | 8 | 8 | 8 | 499 |
| Curso de Manipulación de Alimentos | 15 | 0 | 15 | 0 | 15 | 15 | 1105 |

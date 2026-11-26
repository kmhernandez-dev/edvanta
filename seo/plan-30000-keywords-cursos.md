# Plan de 30.000 keywords para los cursos de Edvanta

Generado con `scripts/generar-30000-keywords-cursos.mjs` el 26-nov-2026.

## Qué se construyó

- **30.000 keywords únicas**, sin repetir las 70.775 consultas que ya viven en `seo/*.csv`.
- **500 artículos nuevos** que responden a las búsquedas de blog.
- **63 fichas de curso** con keywords transaccionales.
- **57 de 63 cursos** con keywords derivadas de sus clases reales.
- **563 URLs de destino**, todas existentes o creadas en esta campaña.

## Decisión importante: 30.000 keywords, no 30.000 páginas

Publicar una página por keyword sería contenido delgado y pondría en riesgo el dominio. El plan concentra las consultas en **500 artículos** (ocho ángulos por curso, aproximadamente), **63 fichas** y las páginas de curso que ya contienen las clases. Cada keyword declara la URL que la responde.

## Distribución por grupo

### Grupos

| Valor | Keywords |
|---|---:|
| Blogs de curso | 12.497 |
| Cursos | 10.000 |
| Clases | 5.503 |
| Preguntas GEO | 2.000 |

### Intención

| Valor | Keywords |
|---|---:|
| informacional | 16.950 |
| transaccional | 10.000 |
| comercial | 3.050 |

### Etapa del embudo

| Valor | Keywords |
|---|---:|
| atraccion | 14.950 |
| conversion | 10.000 |
| consideracion | 5.050 |

### Prioridad

| Valor | Keywords |
|---|---:|
| Baja | 14.950 |
| Alta | 10.000 |
| Media | 5.050 |

### Público

| Valor | Keywords |
|---|---:|
| profesionales | 29.608 |
| pacientes y cuidadores | 392 |


## Cómo se conecta el embudo

| Público | Entrada (atracción) | Consideración | Conversión |
|---|---|---|---|
| Profesionales | Clases, guías de estudio y errores frecuentes | Temario, aplicación y comparativas | Ficha del curso, primera unidad y certificado |
| Estudiantes | Cómo estudiar, apuntes y preguntas frecuentes | Plan de 30 días y utilidad laboral | Curso completo |
| Regentes y auxiliares | Aplicación en el trabajo y errores frecuentes | Preguntas frecuentes y temario | Curso y capacitación |
| Instituciones | Aplicación por rol y sector | Comparativa y programa | Ficha y propuesta institucional |

## Los ocho ángulos de cada curso

| Ángulo | Qué responde | Destino |
|---|---|---|
| Guía de estudio | Cómo estudiar, en qué orden y con qué método | Artículo + ficha |
| Para qué sirve | Utilidad, roles y límites | Artículo + ficha |
| Temario | Unidades, clases y evaluaciones | Artículo + ficha |
| Plan de 30 días | Ruta semanal y entregables | Artículo + ficha |
| Errores frecuentes | Qué evitar y cómo corregirlo | Artículo + ficha |
| Aplicación en el trabajo | Tareas, evidencia y proyecto | Artículo + ficha |
| Preguntas frecuentes | Nivel, tiempo, certificado, acceso | Artículo + ficha |
| Curso o autoaprendizaje | Comparación honesta y ruta propia | Artículo + ficha |

## Cómo aumentar las keywords en las clases

Las clases reales del Aula ya tienen texto y video. Para que esa inversión se refleje en búsqueda:

1. **Título de clase como H2 visible** en la página del curso y en el aula, con la misma redacción con la que se busca.
2. **Bloque “Qué vas a aprender”** al inicio de cada clase, con 3 a 5 frases que incluyan el nombre del tema y una pregunta frecuente.
3. **Preguntas frecuentes al final de la unidad**, no solo al final del curso.
4. **Enlaces internos** desde la clase al artículo del mismo tema y desde el artículo a la ficha del curso.
5. **Una sola URL canónica** por clase; si hay una versión abierta y una privada, la abierta es la que se indexa y la privada queda en `noindex`.
6. **Datos estructurados** de curso y FAQ en la ficha, sin inventar precios ni fechas.

## Enlazado interno

- Cada artículo enlaza a su ficha de curso en la introducción y en el cierre.
- Cada artículo enlaza a 2 o 3 artículos hermanos del mismo curso.
- Cada ficha debe enlazar a los artículos de su curso (guía, temario, FAQ y aplicación).
- Los artículos de un área enlazan a 2 cursos relacionados del mismo campo.
- No se enlaza a clases privadas ni a pagos desde el texto editorial.

## Reglas editoriales que no se negocian

- No se inventan precios, fechas, cupos, certificados ni grabaciones.
- La primera unidad gratis y el certificado se mencionan solo como los declara la ficha.
- Los temas clínicos son educativos: no indican dosis ni cambios de tratamiento.
- Los artículos generados son borradores editoriales: se revisan antes de una campaña pagada.
- No se publica una página nueva si la intención ya está cubierta; se agrega una sección o una pregunta.

## Cómo usar el CSV

1. Prioriza `prioridad = Alta` y `grupo = Cursos`: sostienen la conversión.
2. Trabaja los artículos con `grupo = Blogs de curso` por curso, no por keyword individual.
3. Usa `grupo = Clases` para mejorar los títulos y bloques “qué aprenderás” de las clases.
4. Usa `grupo = Preguntas GEO` para FAQ y respuestas de asistentes de IA.
5. Mide en Search Console por página y por consulta; no por keyword aislada.
6. Revisa cada trimestre: impresiones sin clics piden mejorar título y descripción; clics sin conversión piden mejorar la ficha.

## Muestra de keywords prioritarias

- **curso online de anticoagulantes** → `/curso-de-anticoagulantes-y-antiagregantes`
- **curso online de aseguramiento de la calidad** → `/curso-de-aseguramiento-de-la-calidad-farmaceutica`
- **curso de radiofármacos** → `/curso-de-asuntos-regulatorios-de-radiofarmacos`
- **curso de asuntos regulatorios certificado** → `/curso-de-asuntos-regulatorios-farmaceuticos-en-colombia`
- **curso de trámites ante el invima** → `/curso-de-asuntos-regulatorios-sanitarios-ante-invima`
- **curso de auditoría de calidad certificado** → `/curso-de-auditoria-de-calidad-farmaceutica`
- **curso de autocuidado de la tiroides** → `/curso-de-autocuidado-de-la-tiroides`
- **curso online de bioequivalencia** → `/curso-de-bioequivalencia-y-requisitos-regulatorios-en-colombia`
- **curso de preparaciones magistrales certificado** → `/curso-de-bpe-y-preparaciones-magistrales`
- **curso de bpm farmacéuticas** → `/curso-de-bpm-en-la-industria-farmaceutica`
- **curso online de buenas prácticas de documentación** → `/curso-de-buenas-practicas-de-documentacion-farmaceutica`
- **curso online de buenas prácticas de laboratorio** → `/curso-de-buenas-practicas-de-laboratorio-bpl`
- **curso de buenas prácticas de manufactura certificado** → `/curso-de-buenas-practicas-de-manufactura-bpm`
- **curso de central de mezclas certificado** → `/curso-de-central-de-mezclas`
- **curso online de comunicación asertiva** → `/curso-de-comunicacion-asertiva`
- **curso de control de calidad certificado** → `/curso-de-control-de-calidad-de-medicamentos`
- **curso de dossier farmacéutico** → `/curso-de-elaboracion-de-dossiers-farmaceuticos`
- **curso de estudios de estabilidad** → `/curso-de-estudios-de-estabilidad-de-medicamentos`
- **curso de etiquetado de medicamentos** → `/curso-de-etiquetado-e-insertos-de-medicamentos`
- **curso online de farmacología cardiovascular** → `/curso-de-farmacologia-cardiovascular`
- **curso de farmacología del snc** → `/curso-de-farmacologia-del-sistema-nervioso-central`
- **curso de farmacología endocrina** → `/curso-de-farmacologia-endocrina`
- **curso de farmacología gastrointestinal** → `/curso-de-farmacologia-gastrointestinal`
- **curso online de farmacología oncológica** → `/curso-de-farmacologia-oncologica`
- **curso de farmacología renal** → `/curso-de-farmacologia-renal`
- **curso de farmacología respiratoria** → `/curso-de-farmacologia-respiratoria`
- **curso de farmacoterapia en diabetes** → `/curso-de-farmacoterapia-de-la-diabetes`
- **curso online de hipertensión arterial** → `/curso-de-farmacoterapia-de-la-hipertension-arterial`
- **curso online de insuficiencia cardíaca** → `/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca`
- **curso de asma y epoc** → `/curso-de-farmacoterapia-del-asma-y-la-epoc`
- **curso de gestión de calidad farmacéutica** → `/curso-de-gestion-de-calidad-farmaceutica`
- **curso de desviaciones y capa** → `/curso-de-gestion-de-desviaciones-y-capa`
- **curso de gestión de riesgos de calidad** → `/curso-de-gestion-de-riesgos-en-la-calidad-farmaceutica`
- **curso de gestión documental invima** → `/curso-de-gestion-documental-de-tramites-ante-el-invima`
- **curso online de inmunoterapia** → `/curso-de-inmunoterapia-oncologica`
- **curso online de inteligencia emocional** → `/curso-de-inteligencia-emocional`
- **curso online de lenguaje corporal** → `/curso-de-lenguaje-corporal-y-comunicacion-no-verbal`
- **curso online de liderazgo** → `/curso-de-liderazgo-y-trabajo-en-equipo`
- **curso online de manipulación de alimentos** → `/curso-de-manipulacion-de-alimentos`
- **curso de medicamentos vitales no disponibles** → `/curso-de-medicamentos-vitales-no-disponibles`
- **curso de modificaciones al registro sanitario** → `/curso-de-modificaciones-al-registro-sanitario-de-medicamentos`
- **curso online de negociación** → `/curso-de-negociacion-y-persuasion`
- **curso online de oratoria** → `/curso-de-oratoria`
- **curso online de storytelling** → `/curso-de-presentaciones-efectivas-y-storytelling`
- **curso online de psicofarmacología** → `/curso-de-psicofarmacologia`
- **curso online de quimioterapia** → `/curso-de-quimioterapia-antineoplasica`
- **curso de registro sanitario invima** → `/curso-de-registro-sanitario-de-medicamentos-ante-el-invima`
- **curso de medicamentos biológicos** → `/curso-de-registro-sanitario-de-medicamentos-biologicos`
- **curso de productos fitoterapéuticos** → `/curso-de-registro-sanitario-de-productos-fitoterapeuticos`
- **curso online de suplementos dietarios** → `/curso-de-registro-sanitario-de-suplementos-dietarios`

## Archivos

- `seo/keywords-30000-cursos.csv`
- `seo/plan-30000-keywords-cursos.md`
- `src/data/blogCursos500.js`
- `public/articulos/articulos_edvanta/cursos-recomendados/*.md`
- `scripts/generar-blogs-cursos.mjs`
- `scripts/generar-30000-keywords-cursos.mjs`

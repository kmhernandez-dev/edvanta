# Auditoría pedagógica del catálogo Edvanta (noviembre de 2026)

**Auditor:** revisión pedagógica y editorial del catálogo del Aula.
**Alcance:** los 63 cursos propios (`kind = 'edvanta'`) del Aula Edvanta, sus 297 unidades y 1.714 clases.
**Fecha de corte:** 19 de noviembre de 2026.
**Fuente de verdad:** migraciones de `api/migrations`, contenido de `contenido/aula` y `contenido/experiencias`, y el material de evaluación de `contenido/aula/catalogo`.

---

## 1. Resumen ejecutivo

| Indicador | Resultado |
|---|---:|
| Cursos propios | 63 |
| Unidades | 297 |
| Clases | 1.714 |
| Clases con texto completo (experiencia o texto largo) | 1.714 (100 %) |
| Clases con experiencia interactiva | 1.551 |
| Clases con texto largo propio aprobado | 163 |
| Palabras de contenido | 2.692.847 |
| Evaluaciones | 293 |
| Preguntas de evaluación | 1.172 |
| Actividades | 301 |
| Foros | 344 |
| Clases con video de YouTube | 1.113 (64,9 %) |
| Clases sin video | 601 (35,1 %) |

**Conclusión:** el catálogo ya no tiene clases vacías. Las 1.714 clases tienen contenido escrito para estudiar sin depender del video. La brecha principal dejó de ser el texto y pasó a ser la **curaduría de video**, la **revisión académica final** y la **publicación comercial**.

No se inventaron normas, artículos, cifras ni referencias. Las afirmaciones normativas provienen del resumen de cada clase o de la explicación de la pregunta de evaluación; las referencias son los enlaces que la clase ya tenía verificados o fuentes oficiales estables (INVIMA, MinSalud, OMS/OPS, ICH, PIC/S, FDA, EMA, USP, farmacopeas y sociedades científicas).

---

## 2. Qué se hizo

1. **Auditoría reproducible.** `scripts/auditar-catalogo-aula.mjs` levanta un PostgreSQL en memoria, aplica las 178 migraciones y mide cursos, unidades, clases, texto, experiencias, videos, evaluaciones, actividades y foros. Genera `inventario-cursos.md`, `inventario-clases.csv` e `inventario.json`.
2. **Contenido completo para las clases cortas.** `scripts/generar-experiencias-catalogo.mjs` construyó 1.184 experiencias de clase a partir de: el resumen de la clase, el quiz y su explicación, la actividad de la unidad, el foro y los enlaces ya verificados. Cada experiencia incluye gancho, objetivos, conceptos, mapa, desarrollo, proceso, caso con retroalimentación, errores, comprobaciones, resumen y referencias.
3. **Contenido preservado.** No se sobrescribieron las 367 experiencias escritas a mano ni los 163 textos largos aprobados. Se conservaron videos, enlaces y destacados.
4. **Videos nuevos verificados.** `scripts/curar-videos-aula.mjs` busca videos por el tema de la clase, exige un canal educativo o institucional y verifica el oEmbed oficial de YouTube. La migración `174_videos_catalogo.sql` agregó 32 videos por clase y la `178_videos_cursos_sin_video.sql` agregó un video de unidad a los 8 cursos que no tenían ninguno. Los 866 videos únicos previos se auditaron en `api/lib/videos-youtube.json`: 859 disponibles y 7 marcados como no disponibles.
5. **Títulos únicos para SEO.** La migración `176_renombrar_clases_homonimas.sql` corrigió los títulos repetidos que impedían distinguir clases en la página pública.
6. **Pruebas.** La suite de API (507 pruebas) cubre la publicación, la validación de experiencias, las páginas públicas, las migraciones, el aula y el checkout. Las pruebas de experiencias y cursos sembrados pasan; se actualizó la prueba de BPE para reconocer los nuevos videos verificados.

---

## 3. Estado por línea de formación

### 3.1 Calidad y manufactura

| Curso | Clases | Experiencia | Video | Estado editorial |
|---|---:|---:|---:|---|
| Gestión de Calidad Farmacéutica | 35 | 35 | 33 | Contenido completo; revisar video en 2 clases |
| Aseguramiento de la Calidad Farmacéutica | 35 | 35 | 33 | Contenido completo; revisar video en 2 clases |
| Control de Calidad de Medicamentos | 35 | 35 | 34 | Contenido completo |
| Buenas Prácticas de Manufactura — BPM | 35 | 35 | 24 | Contenido completo; 11 clases sin video |
| Buenas Prácticas de Laboratorio — BPL | 35 | 35 | 27 | Contenido completo; 8 clases sin video |
| Buenas Prácticas de Documentación | 30 | 30 | 28 | Contenido completo |
| Auditoría de Calidad | 32 | 0 | 28 | Texto largo; sin página pública de clase |
| Gestión de Riesgos | 33 | 0 | 26 | Texto largo; sin página pública de clase |
| CAPA | 35 | 35 | 31 | Contenido completo |
| Validación de Métodos Analíticos | 33 | 33 | 32 | Contenido completo |
| BPM (curso de 3 unidades) | 9 | 0 | 7 | Texto largo aprobado; sin página pública de clase |
| BPE y preparaciones magistrales | 9 | 0 | 5 | Texto largo aprobado; sin página pública de clase |

### 3.2 Asuntos regulatorios

Los 10 cursos de la línea regulatoria (33 a 35 clases cada uno) tienen **todas sus clases con experiencia** y, por tanto, con página pública de clase. La cobertura de video es la brecha: cursos como Asuntos Regulatorios Farmacéuticos, Bioequivalencia, Fitoterapéuticos y Gases Medicinales no tienen video en ninguna clase. Los cursos de registro, renovación, modificaciones, dossiers, requerimientos, etiquetado y estabilidad tienen entre 4 y 13 videos.

### 3.3 Productos especiales

Biológicos, biosimilares, vacunas, fitoterapéuticos, homeopáticos, suplementos, cannabis, radiofármacos, gases y medicamentos vitales no disponibles: **todas las clases tienen experiencia**. La prioridad es video para fitoterapéuticos, homeopáticos, gases y vitales no disponibles.

### 3.4 Farmacología y farmacoterapia

- Farmacología cardiovascular, endocrina, del SNC y respiratoria: experiencias escritas a mano, 32 a 35 clases por curso.
- Farmacología oncológica, quimioterapia, inmunoterapia y terapias dirigidas: experiencias generadas con el material de evaluación; 31 a 34 clases por curso.
- Psicofarmacología, gastrointestinal, renal y anticoagulantes: experiencias generadas; contenido completo.
- Farmacoterapia de diabetes, hipertensión, insuficiencia cardíaca y asma/EPOC: experiencias escritas a mano, 37 a 40 clases por curso.
- Ningún curso de esta línea tiene clases sin texto.

### 3.5 Habilidades blandas

Diez cursos de 8 clases (80 clases) conservan su texto largo aprobado y sus videos. No tienen experiencia estructurada, así que **no generan página pública de clase**. Es una decisión editorial pendiente: mantener el texto aprobado o convertirlo a experiencia para indexar cada clase.

### 3.6 Autocuidado y alimentos

- Autocuidado de la tiroides: 8 clases con experiencia y video, lenguaje para pacientes, límites educativos explícitos.
- Manipulación de Alimentos: 15 clases con experiencia, quiz, actividad y foro, y video de unidad (SENA e INA Virtual). Es el curso con mayor oportunidad de reemplazar el video de unidad por videos específicos de cada clase.

---

## 4. Brecha de video

| Situación | Clases |
|---|---:|
| Con video | 1.113 |
| Sin video | 601 |
| Cursos que empezaron sin video | 8 cursos, 247 clases |
| Cursos con video de unidad pero sin video por clase | 8 |

Cursos que empezaron sin ningún video y ya tienen video de unidad: Asuntos Regulatorios Farmacéuticos en Colombia, Bioequivalencia, Fitoterapéuticos, Homeopáticos, Gases Medicinales, Vitales No Disponibles, Psicofarmacología y Manipulación de Alimentos. En estos cursos el video cubre la unidad; la clase completa sigue en el texto.

**Criterio aplicado:** no se insertó un video solo porque el título coincidiera. Se exigió coincidencia de tema, canal educativo o institucional y oEmbed disponible. Cuando no hubo certeza, se dejó la clase sin video y se registró en `videos-propuestos.json`. Un reproductor roto o un video de otra normativa resta más que un hueco.

**Siguiente paso recomendado:** revisar `docs/auditoria-aula/videos-propuestos.json` y reemplazar los videos de unidad de los 8 cursos por videos específicos de cada clase. Para los cursos regulatorios, los canales de INVIMA, Escuela Latinoamericana de Farmacia, CEFIIN, Farmaliz y Margarita García son los más pertinentes. Para los 601 clases que siguen sin video, priorizar las de mayor tráfico y las de los cursos que se quieran lanzar primero.

---

## 5. Hallazgos pedagógicos

### 5.1 Fortalezas

- Todas las clases tienen una explicación escrita; ninguna depende solo del video.
- 1.551 clases tienen experiencia con caso, errores y comprobaciones, lo que permite estudiar y autoevaluarse.
- Las evaluaciones ya existentes suman 1.172 preguntas con explicación y fuente, 301 actividades con rúbrica y 344 foros.
- La estructura de las experiencias es consistente: gancho, objetivos, conceptos, mapa, proceso, caso, errores, repaso, resumen y referencias.
- Las clases públicas tienen títulos y descripciones dentro de los límites de SEO y no hay títulos repetidos.

### 5.2 Riesgos y límites

1. **Las 1.184 experiencias generadas requieren revisión académica antes de publicar.** Se construyeron con el material existente del curso, pero la redacción sigue una plantilla pedagógica. La revisión debe confirmar precisión normativa, ejemplos y ausencia de afirmaciones no sustentadas.
2. **Las 163 clases con texto largo no tienen página pública.** Esto afecta la indexación de BPM, BPE, Auditoría, Riesgos y Habilidades Blandas. Se puede mantener el texto y crear una página pública de solo texto, o convertirlo a experiencia conservando el contenido.
3. **La cobertura de video es desigual.** Ocho cursos dependen de un video de unidad y 601 clases siguen sin video. La meta no es llenar por llenar: es que cada clase que se promocione tenga un video pertinente.
4. **Las evaluaciones no están estandarizadas.** Hay cursos con 3 evaluaciones y 12 preguntas y otros con 5 evaluaciones y 20 preguntas. Antes de vender, conviene decidir si todos los cursos deben tener la misma carga evaluativa.
5. **Los cursos siguen en borrador.** La publicación, el precio y la promoción son decisiones de dirección; el contenido está listo para revisión, no publicado automáticamente.
6. **Enlaces.** Los 7 videos no disponibles están marcados y filtrados en la página pública. Los PDF con 404 están documentados en `contenido/*/enlaces-por-reponer.md`; conviene revisarlos antes de una campaña.

---

## 6. Recomendaciones para lanzar y vender

### Antes de publicar

1. **Revisión académica por muestreo y por curso.** Empezar por los cursos de mayor venta: Calidad, Regulatorios, Farmacología y Farmacoterapia. Leer una clase de cada unidad y validar los casos, las fuentes y las afirmaciones normativas.
2. **Completar el video por clase en los 8 cursos que hoy tienen video de unidad.** Un curso sin ningún video se percibe inacabado; un curso con el mismo video en toda la unidad se percibe repetitivo. La meta es un video pertinente por clase, empezando por los cursos que se van a lanzar.
3. **Decidir qué hacer con las 163 clases de texto largo.** Mi recomendación: conservar el texto y crear la página pública de clase, sin reescribir lo aprobado.
4. **Estandarizar la evaluación.** Definir una política común (por ejemplo, 5 quizzes de 4 preguntas, 5 actividades y 5 foros por curso) y aplicarla solo donde no haya intentos registrados.
5. **Verificar precios, certificados y checkout.** El contenido no arregla un precio mal configurado ni un enlace de pago roto.

### Posicionamiento

- **Páginas públicas de clase.** Las 1.551 experiencias ya generan páginas con datos estructurados, video y referencias. Son la base del SEO de cola larga: cada clase responde a una búsqueda concreta.
- **Rutas de formación.** Agrupar los cursos por línea (Calidad, Regulatorios, Farmacología clínica, Farmacoterapia, Habilidades blandas, Autocuidado) y vender la ruta completa, no solo cursos sueltos.
- **Casos colombianos.** El material ya cita INVIMA, MinSalud, PBS/MIPRES, Cuenta de Alto Costo y normativa nacional. Ese contexto es el diferenciador frente a cursos internacionales genéricos.
- **Prueba social.** Las opiniones y los certificados ya existen en el Aula; activar su visualización en la ficha de curso cuando haya volumen real.
- **Contenido gratuito de entrada.** Usar las clases abiertas y los artículos de salud como puerta de entrada, con una invitación clara al curso completo.

### Mensaje de venta responsable

- No prometer curación, resultados clínicos ni empleo garantizado.
- Diferenciar formación educativa de asesoría clínica.
- En farmacología y autocuidado, mantener el descargo médico y el lenguaje de “consulta con tu equipo de salud”.
- En cursos regulatorios, indicar que la norma cambia y que se debe verificar en la fuente oficial.

---

## 7. Lista de verificación para el lanzamiento

- [ ] Revisión académica de una muestra de cada curso (mínimo una clase por unidad).
- [ ] Revisión completa de los cursos de mayor venta.
- [ ] Reemplazar los videos de unidad por videos específicos en los cursos prioritarios.
- [ ] Revisar los 7 videos no disponibles y los PDF con 404.
- [ ] Decidir el tratamiento de las 163 clases de texto largo.
- [ ] Estandarizar evaluaciones y cargas.
- [ ] Revisar precios, certificados y checkout en producción.
- [ ] Publicar primero 3 cursos piloto y medir inscripción, avance y certificación.
- [ ] Revisar sitemap, Search Console y páginas públicas de clase.
- [ ] Actualizar `llms.txt` y los enlaces internos de la escuela.

---

## 8. Archivos de esta auditoría

| Archivo | Qué contiene |
|---|---|
| `docs/auditoria-aula/inventario-cursos.md` | Totales y tabla por curso |
| `docs/auditoria-aula/inventario-clases.csv` | Una fila por clase con texto, experiencia y video |
| `docs/auditoria-aula/inventario.json` | Datos completos para revisión |
| `docs/auditoria-aula/videos-propuestos.json` | Videos buscados, aceptados y descartados, con la razón |
| `docs/auditoria-aula/plan-experiencias.json` | Cursos y clases cubiertas por la generación |
| `scripts/auditar-catalogo-aula.mjs` | Auditoría reproducible |
| `scripts/generar-experiencias-catalogo.mjs` | Generación de experiencias desde el material existente |
| `scripts/curar-videos-aula.mjs` | Búsqueda y verificación de videos |
| `api/migrations/164–173_*.sql` | Experiencias generadas por línea |
| `api/migrations/174_videos_catalogo.sql` | Videos nuevos verificados |
| `api/migrations/176_renombrar_clases_homonimas.sql` | Títulos únicos para SEO |
| `api/migrations/177_experiencias_alimentos_quiz.sql` | Quiz, actividad y foro en Manipulación de Alimentos |
| `api/migrations/178_videos_cursos_sin_video.sql` | Video de unidad para los 8 cursos que no tenían video |

---

## 9. Nota de transparencia

Este trabajo **no declara que las 1.184 experiencias generadas estén listas para publicar sin revisión humana**. Son un borrador editorial completo, construido con el material que el propio curso ya tenía. La dirección académica debe leerlas, corregir lo que haga falta y decidir qué se publica. La alternativa —dejar 1.184 clases con un párrafo de apoyo— no era un catálogo vendible; este es el punto de partida serio para la revisión final.

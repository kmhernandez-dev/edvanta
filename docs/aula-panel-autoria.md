# Panel de autoría y gestión académica del Aula

## Dónde entrar

- Administración: `/aula/admin/cursos` → abrir un curso.
- Docencia: `/aula/docente` → abrir un curso → **Gestionar curso** (`/aula/docente/curso/:courseId/gestion`).
- Estudiante: `/aula/<curso>` → **Evaluación** o los recursos publicados dentro de cada unidad del índice del curso.

El editor del curso conserva las pestañas existentes y agrega:

- **Contenido y evaluaciones**: clases, quizzes, actividades y foros por unidad.
- **Entregas y revisión**: bandeja paginada con filtros.
- **Calificaciones**: libro por estudiante y recurso.
- **Participación**: foros, mensajes, cierres y acceso a moderación.
- **Configuración académica**: reglas existentes + pesos 60/30/10 editables.

## Crear y publicar un quiz

1. Entrar al curso y ubicar la unidad.
2. Pulsar **Añadir quiz**.
3. Completar título, unidad, instrucciones, intentos, nota mínima, peso y obligatoriedad.
4. Editar las cuatro preguntas iniciales (cada una con cuatro opciones y una respuesta correcta).
5. **Guardar borrador** en cualquier momento. El formulario conserva lo escrito si falla la red.
6. **Publicar** valida enunciados, opciones vacías o duplicadas y la clave única. Si falta algo, responde con el campo exacto.
7. El quiz aparece en la unidad del aula del estudiante y en **Evaluación** sin republicar el curso.

La nota la calcula el servidor sobre 100. No se acepta una nota enviada por el navegador. Las claves no salen del servidor antes de enviar. Los intentos guardan una copia de lo evaluado (`aula_attempts.served`), por lo que editar el quiz no altera notas históricas.

## Crear una actividad y su rúbrica

1. **Añadir actividad** en la unidad.
2. Completar consigna, caso, puntos a resolver, producto esperado, extensión, recursos y materiales.
3. Elegir entrega por texto, enlace o archivo; definir formatos y tamaño.
4. Definir peso, obligatoriedad, fecha límite y forma de calificación.
5. Para rúbrica: agregar criterios, pesos que sumen 100 % y descriptores de niveles 0–4. También se admite escala 0–100.
6. Publicar. El curso admite como máximo **5 actividades obligatorias**; los quizzes y foros no cuentan para ese límite y las actividades formativas no necesitan peso.

Los materiales se guardan en el almacenamiento privado existente. Solo se sirven a estudiantes matriculados en un curso publicado o al docente asignado.

## Crear y moderar un foro

1. **Añadir foro** en la unidad.
2. Completar propósito, caso, pregunta central, preguntas de profundización, instrucciones y reglas.
3. Elegir formativo, nota directa o rúbrica; definir peso, apertura/cierre y adjuntos.
4. Publicar. El foro permite leer siempre; cerrar respuestas conserva la lectura.
5. En **Participación** se ven mensajes, ocultos, calificaciones y pendientes. **Moderar** abre el hilo para ocultar mensajes y calificar.

No se crean participantes ni publicaciones de ejemplo. La cantidad de mensajes no asigna nota por sí sola.

## Revisar una entrega y asignar 0–100

1. **Entregas y revisión** → filtrar por estado, unidad, actividad o estudiante.
2. **Revisar** abre la entrega, sus versiones y la rúbrica.
3. Escribir retroalimentación y elegir decisión.
4. **Guardar borrador** no publica la nota. **Publicar calificación** la hace visible al estudiante.
5. En actividades con nota directa se acepta cualquier valor entre 0 y 100, con decimales. Cero es una nota válida.
6. Si se cambia una nota ya publicada, el servidor exige un motivo (o una retroalimentación suficientemente explicativa) y registra el cambio en `aula_grade_changes`.

## Libro de calificaciones y configuración

- **Calificaciones** muestra matrícula, mejor nota de quiz, actividades, foros, pendientes, nota final, acumulado parcial y aprobación.
- «Sin calificar» es `null`; `0` es una nota real.
- La nota final solo se emite cuando no hay componentes pendientes y la configuración es válida.
- Los pesos de los recursos publicados deben coincidir con los componentes declarados. Los borradores no cuentan.
- La configuración se guarda aunque esté incompleta, pero se muestra qué falta y no se presenta una aprobación final cerrada.
- Los quizzes automáticos se pueden rectificar desde el libro con **Rectificar**; el flujo exige motivo y deja historial.

## Migración y despliegue

- Migración nueva: `api/migrations/066_aula_autoria_evaluacion.sql`.
- La aplica el corredor existente (`api/lib/migrate.js` en producción y `api/scripts/aula-dev.js` en local). No se modificaron migraciones históricas.
- En local se verificó que la migración se aplica sobre PGlite con el curso BPM existente y que `authoringData` devuelve 3 quizzes, 3 actividades, 3 foros y pesos 60/30/10.
- En producción **no se ejecutó** ninguna migración ni despliegue desde este entorno.

## Verificación realizada

- `npm.cmd run build` — correcto.
- `npm.cmd test` — 139 pruebas de frontend y 231 de API aprobadas, incluida `api/tests/aula-autoria.test.js`.
- La prueba de aceptación usa PGlite, un curso aislado, administrador, docente asignado, docente sin asignación, dos estudiantes y un usuario sin matrícula. Comprueba creación, borrador, recarga, publicación, visibilidad, intento de quiz, entrega, foro, revisión 80/100, rectificación 20/100 con historial, libro de calificaciones, 0 frente a «sin calificar», 83/100 de nota final, duplicado, archivo y permisos.
- La integración local con el curso BPM se comprobó contra el servidor de desarrollo del aula; no se alteraron datos de producción.


## Archivos principales

- Backend: `api/lib/aula/authoring.js`, `api/routes/aula/authoring.js`, `api/migrations/066_aula_autoria_evaluacion.sql`.
- Integración: `api/lib/aula/pedagogia.js`, `pedagogia-core.js`, `learning.js`, `progress.js`, `access.js`, `api/routes/aula/admin-courses.js`, `docente.js`, `files.js`.
- Interfaz: `src/aula/components/curso/*`, `src/aula/pages/admin/curso/{Contenido,CursoLayout,Reglas,Revision,Calificaciones,Participacion}.jsx`, `src/aula/pages/docente/{DocenteCurso,DocenteGestion,DocenteEntrega,DocenteForo}.jsx`, páginas del curso y reproductor.
- Pruebas: `api/tests/aula-autoria.test.js`.## Limitaciones pendientes

- No se ejecutó una prueba de navegador automatizada (clic a clic); la verificación de interfaz es compilación + revisión de rutas, y la de comportamiento es la suite de API.
- La nota del quiz se muestra al enviar. El panel permite controlar si se muestran soluciones y explicaciones (`showAnswersAfterSubmit`), pero no hay publicación diferencial de notas por fecha o aprobación manual.
- Solo se implementó el tipo de pregunta de selección única en el editor visual, aunque el modelo conserva otros tipos existentes.
- Las clases y lecciones siguen gestionándose desde la administración; docentes gestionan evaluaciones, revisión, calificaciones, participación y configuración de sus cursos asignados.
- La bandeja de revisión enlaza cada entrega; no incluye un botón «siguiente» que encadene automáticamente todas las entregas.
- Archivar un recurso con peso lo retira del cálculo final y avisa de que los pesos restantes no se reparten. El historial de intentos, entregas, mensajes y calificaciones se conserva.
- No se probó el almacenamiento externo de producción; las cargas se probaron con el almacenamiento privado temporal de PGlite.
- El libro de calificaciones calcula la pedagogía de cada estudiante en la solicitud; está paginado a 50 estudiantes, pero en cohortes muy grandes conviene medir y añadir caché o cálculo agregado en SQL.

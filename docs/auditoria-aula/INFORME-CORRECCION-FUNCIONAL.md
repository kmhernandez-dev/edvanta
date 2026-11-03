# Informe de corrección funcional · Aula Edvanta

Fecha: **2026-11-03**
Alcance: fase A, infraestructura pedagógica compartida probada con un curso aislado y con BPM.
Fuente de verdad del aula: PostgreSQL y migraciones `api/migrations/`.

## 1. Entornos y estado de las migraciones

| Entorno | Revisión de código | Base identificada | Migración esperada | Estado observado | Evidencia |
|---|---|---|---|---|---|
| Pruebas API con PGlite | Sí | Base en memoria, sin credenciales | 001–065 | **Aplicadas**. 063, 064 y 065 se aplicaron dos veces sin duplicar datos. | `npm.cmd run test:api`: 20 archivos, 215 pruebas aprobadas. |
| Aula local de desarrollo | Sí | PGlite persistente en `api/.data/aula-dev/db` | 005, 029–061, 063, 064 y 065 | **Aplicadas**. El servidor arrancó y quedó escuchando en `127.0.0.1:3000`. | Salida de `node api/scripts/aula-dev.js --reset`: «Aula lista». |
| Vista previa del frontend | Sí | Build estático en `dist/` | No aplica | **Rutas directas responden 200** (SPA fallback). | `vite preview` + peticiones a `/aula`, `/aula/docente`, `/aula/curso/1/evaluacion`, quiz, actividad y foro. |
| Producción / Coolify | No se accedió | No hay `DATABASE_URL` en el repositorio | 063, 064 y 065 pendientes | **No aplicadas**. No se reinició ni se desplegó producción. | Sin evidencia de producción; no se declara verificada. |

Nota: 064 y 065 están **versionadas**, **generadas** y **ejecutadas en pruebas**. 063 se ejecuta en local, pero **no se versiona** en el repositorio público porque contiene claves de quiz; debe aplicarse desde almacenamiento privado. El migrador real (`api/lib/migrate.js`) aplicará 064 y 065 en el siguiente arranque del servicio API en Coolify; eso no se comprobó en producción.

## 2. Rutas y pantallas accesibles en el entorno probado

### Estudiante

- `/aula/:curso/evaluacion`
- `/aula/:curso/evaluacion/quiz/:quizId`
- `/aula/:curso/evaluacion/actividad/:activityId`
- `/aula/:curso/evaluacion/foro/:forumId`

El botón **Evaluación** aparece en la barra del reproductor de clases. La página muestra nota provisional/final, pesos, pendientes, quizzes, actividades y foros con su estado.

### Docente

- `/aula/docente`
- `/aula/docente/curso/:courseId`
- `/aula/docente/entrega/:submissionId`
- `/aula/docente/foro/:forumId`

El rol `docente` solo ve los cursos asignados en `aula_course_teachers`. Un administrador conserva acceso global.

### Administración

- `/aula/admin/cursos/:id/docentes`: asignar y retirar docentes del curso.
- `/aula/admin/participantes`: crear personas con rol docente y filtrar por rol.
- `/aula/admin/seguimiento`: seguimiento CRM con cursos, avance, tareas pendientes, último acceso, segmento y etiquetas.
- `/aula/admin/participantes/:id`: ficha con `crm_code`, segmento, etiquetas, origen y notas internas.
- Exportación CSV en `/api/aula/admin/crm/export`.

## 3. Contratos API implementados

### Participante (`/api/aula/me`)

| Operación | Rol y alcance | Entrada | Respuesta | Errores relevantes | Persistencia |
|---|---|---|---|---|---|
| `GET /courses/:id/pedagogy` | Matrícula abierta | — | Quizzes, actividades, foros, nota, requisitos | 404 sin matrícula | Lectura de `aula_*` |
| `GET /courses/:id/assessments` | Matrícula abierta | — | Lista con intentos y mejor nota | 404 | `aula_attempts` |
| `GET /courses/:id/assessments/:aid` | Matrícula abierta | — | Instrucciones, política, intento abierto | 404 | — |
| `POST /courses/:id/assessments/:aid/attempts` | Matrícula abierta | — | Intento nuevo o reanudado, 4 preguntas × 4 opciones | 409 sin cupo; 404 | `aula_attempts` con `served` congelado |
| `GET /courses/:id/assessments/:aid/attempt` | Matrícula abierta | — | Intento abierto y respuestas guardadas | 404 | `aula_attempt_answers` |
| `PUT /courses/:id/assessments/:aid/attempt` | Matrícula abierta | `answers[]` | Respuestas guardadas | 400 opción/pregunta ajena; 409 sin intento abierto | `aula_attempt_answers` |
| `POST /courses/:id/assessments/:aid/attempt/submit` | Matrícula abierta | `answers[]` | Nota calculada, aprobado, feedback según política | 400 incompleto; 409 sin intento | `aula_attempts`, `aula_attempt_answers` |
| `GET /courses/:id/assessments/:aid/attempts/:attemptId` | Solo intento propio | — | Resultado y feedback | 404 intento ajeno | — |
| `GET /courses/:id/activities/:activityId` | Matrícula abierta | — | Consigna, rúbrica, borrador, revisiones, nota | 404 | `aula_submissions`, `aula_submission_revisions` |
| `PUT /courses/:id/activities/:activityId/draft` | Matrícula abierta | `text`, `link`, `fileId` | Borrador persistente | 409 entrega ya enviada | Columnas `draft_*` |
| `POST /courses/:id/activities/:activityId/submissions` | Matrícula abierta | `text`, `link`, `fileId` | Nueva versión enviada | 409 entrega cerrada; 400 sin contenido | `aula_submission_revisions` |
| `GET /courses/:id/forums/:forumId` | Matrícula abierta | — | Foro y publicaciones visibles | 404 | `aula_forum_posts` |
| `POST /courses/:id/forums/:forumId/posts` | Matrícula abierta | `title`, `bodyHtml`, `fileId` | Intervención publicada | 403 foro cerrado/silenciado; 400 | `aula_forum_posts` |
| `POST /courses/:id/forums/:forumId/posts/:postId/replies` | Matrícula abierta | `bodyHtml`, `fileId` | Respuesta publicada | 404; 403 | `aula_forum_posts` |

### Docente (`/api/aula/docente`)

| Operación | Rol y alcance | Entrada | Respuesta | Errores | Persistencia |
|---|---|---|---|---|---|
| `GET /courses` | Docente asignado o admin | — | Cursos con estudiantes, pendientes y foros | 403 sin rol | — |
| `GET /courses/:id` | Docente del curso o admin | — | Estudiantes, notas, entregas, intentos, foros | 403 sin asignación | Lectura |
| `GET /courses/:id/submissions?status=` | Docente del curso o admin | Estado opcional | Entregas enviadas | 403 | — |
| `GET /submissions/:id` | Docente del curso o admin | — | Entrega, versiones, feedback, rúbrica | 403; 404 | — |
| `POST /submissions/:id/review` | Docente del curso o admin | `criteria[]`, `feedback`, `decision`, `publish` | Borrador o calificación publicada | 400 rúbrica incompleta; 403 | `aula_submissions`, `aula_submission_feedback`, `aula_audit_log` |
| `GET /forums/:id` | Docente del curso o admin | — | Publicaciones y calificaciones | 403; 404 | — |
| `POST /forums/:id/grade` | Docente del curso o admin | `enrollmentId`, `criteria[]` o `score`, `feedback` | Nota del foro | 400; 403 | `aula_forum_grades`, `aula_audit_log` |
| `POST /forum-posts/:id/hide` | Docente del curso o admin | `reason` | Mensaje oculto | 403; 404 | `aula_forum_posts`, `aula_audit_log` |

### Administración

| Operación | Rol | Entrada | Respuesta | Persistencia |
|---|---|---|---|---|
| `GET /api/aula/admin/courses/:id/teachers` | Admin | — | Docentes del curso | — |
| `POST /api/aula/admin/courses/:id/teachers` | Admin | `userId`, `role` (`docente`/`tutor`) | Docentes actualizados | `aula_course_teachers`, `aula_audit_log` |
| `DELETE /api/aula/admin/courses/:id/teachers/:userId` | Admin | — | Docentes actualizados | `aula_course_teachers`, `aula_audit_log` |
| `GET /api/aula/admin/crm/users` | Admin | `q`, `segmento`, `tag`, `status`, `page` | Personas con cursos, avance, pendientes y último acceso | `aula_users`, `aula_enrollments_v`, `aula_attempts`, `aula_submissions`, `aula_forum_*` |
| `GET /api/aula/admin/crm/export` | Admin | — | CSV de segmentación | Mismas fuentes |

## 4. Políticas efectivas

- **Intentos de quiz:** dos por quiz. El cupo se consume al enviar; un intento abierto se reutiliza al recargar. Se conserva la mejor nota. El tercer intento se rechaza con 409.
- **Doble envío:** un envío repetido devuelve el resultado ya guardado, sin crear otro intento. La transacción y el índice de intento abierto impiden duplicados concurrentes.
- **Claves:** el servidor guarda la clave en `aula_question_options.is_correct` y en el `served` del intento. La respuesta al estudiante no incluye `correctOptionId` ni `isCorrect` antes del envío. Después del envío, el feedback se muestra solo si `show_answers_after_submit` está activo.
- **Actividades:** borrador persistente, envío con versión numerada, revisión docente por rúbrica, devolución con `requiere_ajustes`, nueva versión autorizada y consulta posterior. Una entrega calificada no se modifica sin una nueva versión.
- **Foros:** publicación raíz y respuestas; no se permite editar mensajes ajenos. El docente puede ocultar con motivo y el estudiante no ve mensajes ocultos.
- **Pesos BPM:** actividades 60 %, quizzes 30 %, foros 10 %. Cada actividad vale 20 %, cada quiz 10 % y los foros 3.34/3.33/3.33. Aprobación 70/100.
- **Fórmula de actividad:** `nota = Σ(peso_criterio × nivel / 4)`, con niveles 0–4 y pesos que suman 100. La nota se guarda en escala 0–100 del curso.
- **Fórmula del curso:** `nota_final = Σ(nota_elemento × peso_elemento_en_curso / 100)`. No se vuelve a aplicar 60/30/10 sobre el resultado.
- **Progreso de aprendizaje:** denominador = clases obligatorias + quizzes obligatorios enviados + actividades obligatorias enviadas + foros obligatorios participados. Una entrega enviada cuenta como avance aunque no esté calificada. Un video complementario no cuenta como requisito.
- **Aprobación:** requiere todos los requisitos cumplidos, ninguna revisión obligatoria pendiente y nota final ≥ 70. Un 100 % de clases no aprueba por sí solo.
- **Cursos sin evaluación nueva:** conservan el cálculo anterior por clases y `final_score` nulo. No se inventan requisitos.
- **Configuración parcial:** si los pesos no suman 100, `configOk` es falso y no se emite aprobación; la UI lo advierte.
- **CRM:** cada persona recibe un `crm_code` estable (`EDV-U-000123`) y se clasifica con `segmento`, `crm_tags`, `crm_source` y notas internas. El código no se regenera al editar. La exportación CSV no incluye contraseñas ni tokens.

## 5. Pruebas ejecutadas

| Prueba | Resultado |
|---|---|
| `npm.cmd run test:api` | **215/215** pruebas aprobadas en 20 archivos. Incluye migraciones, BPM y recorrido pedagógico. |
| `npx.cmd vitest run --config vitest.config.js` | **139/139** pruebas de frontend aprobadas. |
| `npm.cmd run build` | Compilación correcta; 1.577 módulos; postbuild de 193 artículos y 45 páginas. |
| `node --check` en archivos backend modificados | Sintaxis correcta. |
| `vite preview` con rutas directas | `/aula`, `/aula/docente` y las cuatro rutas de evaluación respondieron 200. |
| Aula local `aula-dev.js --reset` | Migraciones aplicadas hasta 065; servidor iniciado. |
| Caso de nota BPM | Tres actividades 80/90/70 + quizzes 100/75/50 + foros 80 → **78,5/100**. |
| CRM | Asignación de `crm_code`, segmento y etiquetas; filtros y exportación CSV cubiertos por prueba de API. |
| Adjuntos | Subida PDF autorizada, descarga del estudiante y del docente, rechazo de descarga ajena y rechazo de `.html`. |

## 6. Límites de la verificación

- No se ejecutó un navegador automatizado (Playwright u equivalente). Se comprobó compilación, rutas directas y comportamiento API; la interacción visual no se validó con un E2E de navegador.
- No se probó en un dispositivo móvil físico; el CSS conserva los breakpoints existentes y las tablas tienen desplazamiento horizontal.
- No se accedió a la base de producción ni se desplegó en Coolify. 064 y 065 no están aplicadas en el entorno objetivo; 063 es privada y no se versiona.
- BPM sigue en **borrador**. La revisión especializada está pendiente y no se atribuye a ninguna persona.
- La revisión de videos no se completó: los dos videos existentes son largos y se conservan como complementarios; no se afirma haberlos reproducido.
- La subida de archivos usa el almacenamiento privado existente y las reglas de extensión/tamaño del aula; no se probó con archivos grandes ni con todos los formatos.
- El repositorio es público. Las claves de los quizzes y las guías docentes están en `contenido/aula/bpm/` y en la migración 063, no en `public/`, `dist/` ni en importaciones del frontend. En esta sesión se añadieron a `.gitignore`; falta moverlos a almacenamiento privado y definir la aplicación de 063 sin publicarla. La visibilidad del repositorio no se puede resolver desde el código.

## 7. Tabla de cierre

| Bloqueo original | Corrección realizada | Evidencia | Entorno verificado | Pendiente real |
|---|---|---|---|---|
| Sin interfaz ni rutas de quiz | Rutas de listar, iniciar, guardar, recuperar, enviar y consultar intentos | `pedagogia.test.js` (10 pruebas), `QuizCurso.jsx` | PGlite / API y build | Prueba visual con navegador |
| Claves expuestas o notas del cliente | `served` congelado, claves solo en servidor, feedback según política | Pruebas de intento y respuesta sin claves | PGlite / API | — |
| Intentos duplicados o fuera de cupo | Cupo al enviar, intento abierto reutilizado, bloqueo transaccional, tercer intento 409 | `pedagogia.test.js` | PGlite / API | — |
| Sin actividades ni entregas persistentes | Borrador, envío versionado, revisión, devolución y consulta | `pedagogia.test.js`, `ActividadCurso.jsx` | PGlite / API y build | E2E de navegador |
| Sin foros interactivos | Publicación raíz, respuestas, autoría, persistencia y ocultamiento docente | `pedagogia.test.js`, `ForoCurso.jsx`, `DocenteForo.jsx` | PGlite / API y build | E2E de navegador |
| Sin vista docente | Cursos asignados, estudiantes, entregas, revisión por rúbrica, foros y notas | `pedagogia.test.js`, páginas `docente/*` | PGlite / API y build | Prueba visual con navegador |
| Progreso solo por clases | Contadores por tipo, progreso separado de nota y aprobación | `progress.js`, `pedagogia-core.js`, caso 78,5 | PGlite / API | — |
| Sin rol docente | Rol `docente`, tabla de asignación y rutas protegidas | Migración 064, pruebas de administración | PGlite / API | Asignación real en producción |
| Migración no aplicada en producción | 064 y 065 versionadas; 063 privada y probada | Pruebas de doble aplicación | PGlite y aula local | Aplicar 064/065 en Coolify; 063 desde almacenamiento privado |
| Sin identificación estable para CRM | `crm_code`, segmento, etiquetas, origen y notas; seguimiento y exportación | Migración 065, `pedagogia.test.js`, `Seguimiento.jsx` | PGlite / API y build | Clasificación real de la base existente |
| Revisión especializada pendiente | Paquete privado y checklist | `bpm-vista-previa.html`, `REVISION-ESPECIALIZADA-BPM.md` | Documento | Revisor competente y firma |

## 8. Estado de BPM y siguiente trabajo

BPM está **pedagógicamente completo en el paquete**, con la política 60/30/10 y los instrumentos cargados. Sigue en **borrador**, pendiente de revisión especializada y publicación. El recorrido funcional se probó con un curso aislado y con el paquete privado; 063 no se versiona en el repositorio público. El curso BPM no está publicado.

La fase B (BPE y resto del catálogo) no se inició en esta sesión. El siguiente punto exacto es crear `contenido/aula/bpe/` y revisar las 9 clases de la migración 034 y las fuentes de la 038. No se declara completo el catálogo.




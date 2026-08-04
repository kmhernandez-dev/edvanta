# Academia Feliz Sin Tiroides

## Objetivo

La academia es el espacio educativo de Feliz Sin Tiroides dentro de Edvanta. El catálogo y el temario son públicos; el video, la clase escrita, las actividades y la conversación requieren una cuenta. La cuenta conserva progreso, prácticas, inscripciones, comentarios, respuestas y reacciones.

El contenido es educativo. No diagnostica, no prescribe y no reemplaza la consulta con profesionales de salud. Los usuarios no deben publicar datos clínicos sensibles en los comentarios.

## Rutas públicas

- `/academia`: catálogo y acceso al canal.
- `/academia/curso/autocuidado-de-la-tiroides`: presentación y temario del curso.
- `/academia/curso/:slug/clase/:lessonId`: muestra una barrera de registro al visitante y el aula completa al usuario autenticado.

## Rutas privadas

- `/academia/perfil`: perfil, métricas y cursos del estudiante.
- `/academia/mis-cursos`: cursos inscritos.

Las rutas privadas y las acciones persistentes requieren autenticación. Los perfiles llevan `noindex, nofollow` y nunca deben agregarse al sitemap.

## Curso inicial

**Curso de autocuidado de la tiroides**

- Canal: `https://www.youtube.com/@felizsintiroides`
- Autora: Karla Hernández, química farmacéutica.
- Modalidad: gratuita, virtual y a ritmo propio.
- Contenido: ocho clases organizadas en tres módulos.
- Material por clase: video, explicación escrita, objetivos, diagrama, ideas clave, reflexión y lecturas verificables.
- Evaluación formativa: cuatro prácticas autocorregibles con casos ficticios, ubicadas en las clases 2, 4, 6 y 8.

### Clases

1. Bienvenida y cómo usar el curso — `RAUzM80hCO8`
2. Qué es la tiroides y para qué sirve — `wXWsqg5C9Bo`
3. Hipotiroidismo o hipertiroidismo — `xGT7xSUJsKo`
4. Cómo interpretar los exámenes tiroideos — `AtqzSmGyCSI`
5. Cómo tomar levotiroxina correctamente en cinco pasos — `BMzKMCmNcT0`
6. Levotiroxina e interacciones — `qt0EwrSIe-c`
7. Antitiroideos: uso seguro, controles y riesgos — `a1rAY7Fuo-I`
8. Curso de tiroides, clase práctica 5.1 — `OZlLNr5semI`

Los videos se reproducen con `youtube-nocookie.com`. No se descargan ni se redistribuyen; YouTube conserva la entrega del contenido.

## Base de datos

Las migraciones `007_academia_autocuidado.sql` y `008_academia_learning_path.sql` son idempotentes. En cada despliegue se ejecutan una sola vez mediante `_migrations`.

Agrega:

- `instructor` y `channel_url` a `academia_courses`.
- `privacy_accepted_at` a `academia_users`.
- `academia_lesson_likes` para reacciones a clases.
- `academia_comment_likes` para reacciones a comentarios y respuestas.
- El curso, sus tres módulos y ocho clases publicadas.

La migración 008 agrega:

- `content JSONB` en `academia_lessons` para las ocho clases escritas.
- `academia_activities` y `academia_activity_submissions` para cuatro prácticas y sus resultados.
- `google_sub`, `avatar_url` y `auth_provider` en usuarios.
- Contraseña opcional únicamente para cuentas verificadas por Google.

## API

### Lectura pública

- `GET /api/academia/courses`
- `GET /api/academia/courses/:slug`
- `GET /api/academia/auth/config`

Sin token, el detalle del curso devuelve títulos y orden, pero omite `video_url`, `description` y `content`. Con token válido devuelve el aula completa.

### Acciones autenticadas

- `POST /api/academia/enroll`
- `POST /api/academia/progress`
- `GET /api/academia/comments/:lessonId`
- `GET /api/academia/lessons/:lessonId/engagement`
- `GET /api/academia/lessons/:lessonId/activities`
- `POST /api/academia/activities/:activityId/submit`
- `POST /api/academia/comments`
- `POST /api/academia/comments/:commentId/like`
- `POST /api/academia/lessons/:lessonId/like`
- `GET /api/academia/profile`

El texto de comentarios se limita a 1.500 caracteres. Una respuesta solo puede depender de un comentario de la misma clase.

## Autenticación y privacidad

- La contraseña se almacena con `bcrypt`.
- Los tokens de Google se verifican en el backend con `google-auth-library`; nunca se confía en datos de perfil enviados directamente por el navegador.
- El identificador estable de Google es `sub`. El correo debe llegar verificado y el token debe pertenecer al `GOOGLE_CLIENT_ID` configurado.
- Los tokens usan un `JWT_SECRET` largo e independiente. Docker Compose lo exige para evitar iniciar la academia con un secreto público o incompleto.
- El registro exige aceptación explícita de la política de privacidad y guarda la fecha en `privacy_accepted_at`.
- Nunca colocar tokens, claves de correo, Mercado Pago o base de datos en el frontend.

Variables necesarias:

```env
JWT_SECRET=un_secreto_largo_y_aleatorio
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=000000000000-example.apps.googleusercontent.com
```

`GOOGLE_CLIENT_ID` es opcional: sin él continúan disponibles correo y contraseña. Para activarlo, crear en Google Cloud un cliente OAuth 2.0 de tipo **Aplicación web** y autorizar estos orígenes JavaScript:

- `https://edvanta.co`
- `https://www.edvanta.co`

No se necesita ni se debe exponer un `client_secret` para Google Identity Services en este flujo.

## Modelo pedagógico

Cada clase sigue la misma secuencia para reducir carga cognitiva y facilitar transferencia:

1. Activación mediante objetivos observables.
2. Explicación en bloques breves y lenguaje claro.
3. Diagrama de flujo, ciclo o comparación.
4. Ideas clave y una pregunta de reflexión.
5. Lecturas de fuentes sanitarias reconocidas.
6. Práctica formativa cuando corresponde.

Las actividades usan casos ficticios. No deben pedir ni almacenar síntomas, diagnósticos, dosis, resultados de laboratorio ni otros datos de salud del estudiante.

## Moderación recomendada

La primera versión permite conversar y reaccionar. El siguiente bloque operativo debe incluir reportes, ocultamiento de contenido, bloqueo de usuarios y una bandeja de moderación. No se deben prometer respuestas clínicas personalizadas en comentarios.

## Despliegue y verificación

1. Ejecutar `npm run build`.
2. Desplegar `web` y `api` con la misma revisión del repositorio.
3. Confirmar que las migraciones 007 y 008 terminaron sin errores.
4. Revisar que `/api/academia/courses` contenga el curso y ocho clases.
5. Abrir catálogo, curso y una clase en escritorio y móvil.
6. Confirmar que un visitante no recibe video ni clase escrita desde la interfaz o la API.
7. Verificar registro con consentimiento, reproducción, clase escrita, diagramas, cuatro actividades, progreso, comentario, respuesta y reacciones.
8. Si existe `GOOGLE_CLIENT_ID`, probar creación e inicio de sesión con el botón oficial de Google.
9. Confirmar que `/academia/perfil` no sea indexable.

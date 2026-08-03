# Academia Feliz Sin Tiroides

## Objetivo

La academia es el espacio educativo de Feliz Sin Tiroides dentro de Edvanta. Permite ver cursos y clases sin salir de la plataforma. La cuenta se usa para conservar progreso, inscripciones, comentarios, respuestas y reacciones.

El contenido es educativo. No diagnostica, no prescribe y no reemplaza la consulta con profesionales de salud. Los usuarios no deben publicar datos clínicos sensibles en los comentarios.

## Rutas públicas

- `/academia`: catálogo y acceso al canal.
- `/academia/curso/autocuidado-de-la-tiroides`: presentación y temario del curso.
- `/academia/curso/:slug/clase/:lessonId`: reproductor, navegación y conversación de la clase.

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

La migración `api/migrations/007_academia_autocuidado.sql` es idempotente. En cada despliegue puede ejecutarse sin duplicar el curso, módulos o clases.

Agrega:

- `instructor` y `channel_url` a `academia_courses`.
- `privacy_accepted_at` a `academia_users`.
- `academia_lesson_likes` para reacciones a clases.
- `academia_comment_likes` para reacciones a comentarios y respuestas.
- El curso, sus tres módulos y ocho clases publicadas.

## API

### Lectura pública

- `GET /api/academia/courses`
- `GET /api/academia/courses/:slug`
- `GET /api/academia/lessons/:lessonId/comments`
- `GET /api/academia/lessons/:lessonId/engagement`

Cuando llega un token válido, los endpoints públicos también informan si el usuario reaccionó.

### Acciones autenticadas

- `POST /api/academia/enroll`
- `POST /api/academia/progress`
- `POST /api/academia/comments`
- `POST /api/academia/comments/:commentId/like`
- `POST /api/academia/lessons/:lessonId/like`
- `GET /api/academia/profile`

El texto de comentarios se limita a 1.500 caracteres. Una respuesta solo puede depender de un comentario de la misma clase.

## Autenticación y privacidad

- La contraseña se almacena con `bcrypt`.
- Los tokens usan un `JWT_SECRET` largo e independiente. Docker Compose lo exige para evitar iniciar la academia con un secreto público o incompleto.
- El registro exige aceptación explícita de la política de privacidad y guarda la fecha en `privacy_accepted_at`.
- Nunca colocar tokens, claves de correo, Mercado Pago o base de datos en el frontend.

Variables necesarias:

```env
JWT_SECRET=un_secreto_largo_y_aleatorio
DATABASE_URL=postgresql://...
```

## Moderación recomendada

La primera versión permite conversar y reaccionar. El siguiente bloque operativo debe incluir reportes, ocultamiento de contenido, bloqueo de usuarios y una bandeja de moderación. No se deben prometer respuestas clínicas personalizadas en comentarios.

## Despliegue y verificación

1. Ejecutar `npm run build`.
2. Desplegar `web` y `api` con la misma revisión del repositorio.
3. Confirmar que la migración 007 terminó sin errores.
4. Revisar que `/api/academia/courses` contenga el curso y ocho clases.
5. Abrir catálogo, curso y una clase en escritorio y móvil.
6. Verificar reproducción, cambio de clase, registro con consentimiento, progreso, comentario, respuesta y reacciones.
7. Confirmar que `/academia/perfil` no sea indexable.

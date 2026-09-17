# Aula virtual empresarial (Aula Edvanta)

LMS integrado a Edvanta para cursos propios y capacitaciones privadas para
empresas. Vive en `/aula` (participantes) y `/aula/admin` (administración).

## Arquitectura

| Capa | Dónde | Notas |
|---|---|---|
| Interfaz | `src/aula/` | React, carga diferida desde `src/App.jsx` (`/aula/*`). |
| API | `api/routes/aula/` montado en `/api/aula` | Router construido con sus dependencias (`createAulaRouter`). |
| Reglas | `api/lib/aula/` | Acceso, cuentas, almacenamiento, auditoría. Sin Express. |
| Datos | `api/migrations/029_aula_schema.sql` | Tablas `aula_*` en el mismo PostgreSQL de la API. |
| Archivos | Volumen `aula-files` → `/data/aula` | Descargas siempre pasan por la API con verificación de permiso. |
| Correo | Resend (`api/lib/resend.js`) | Invitaciones y recuperación de contraseña. |

No toca la academia de Feliz Sin Tiroides (`academia_*`) ni el directorio
público (`companies`, `professional_groups`).

### Cuentas y sesiones

- Cuentas propias del aula (`aula_users`), roles `admin` y `participant`.
- La sesión es una cookie `httpOnly`, `SameSite=Lax`, limitada a `/api/aula`.
  El token solo existe en la cookie; la base guarda su SHA-256.
- Las sesiones están en la base (`aula_sessions`): suspender una cuenta o
  cambiar la contraseña corta el acceso de inmediato.
- Toda petición que cambia datos debe traer `X-Aula-Request: 1` (defensa CSRF).
- Invitación y recuperación usan enlaces de un solo uso
  (`/aula/acceso#token=…`). El token va en el fragmento `#`, que el navegador
  nunca envía al servidor, así que no queda en los registros de acceso.
- Límite de intentos: 8 inicios de sesión por cuenta cada 15 minutos.

### Permisos

Se aplican en el servidor (`api/lib/aula/access.js`):

- Un participante solo ve cursos con inscripción suya no retirada.
- Solo abre cursos publicados, vigentes y dentro de sus fechas.
- Solo ve archivos de la versión que cursa, de recursos publicados de sus
  cursos, de foros de sus cursos o de sus propias entregas.
- A quien no tiene acceso se le responde «no encontrado».
- Las rutas `/api/aula/admin/*` exigen rol administrador.

### Empresas, grupos y participantes

Secciones de administración: `/aula/admin/empresas`, `/aula/admin/grupos`,
`/aula/admin/participantes` y `/aula/admin/participantes/importar`.

- **Empresas**: nombre único (sin distinguir mayúsculas ni espacios). No se
  elimina una empresa con participantes, grupos o cursos privados: se marca
  como inactiva y deja de aparecer en los selectores.
- **Grupos o cohortes**: nombre único dentro de su empresa. Sus fechas son
  de calendario (`AAAA-MM-DD`, sin huso horario). La empresa de un grupo no
  cambia si ya tiene miembros o cursos, y un grupo con cursos asignados no
  se elimina (se cierra).
- **Personas**: correo único. Un administrador no pertenece a empresas ni a
  grupos. Siempre queda al menos un administrador activo, y nadie puede
  suspenderse ni eliminarse a sí mismo. Suspender cierra sus sesiones.
  Eliminar es lógico: retira sus inscripciones y conserva su historial.
  Al cambiar de empresa, la persona sale de los grupos de la anterior.
- **Asignaciones** (`POST /api/aula/admin/assignments`): a personas, grupos o
  empresas, con fechas. Las de grupo o empresa alcanzan también a quien
  entre después. Un curso privado solo se asigna dentro de su empresa.
  Revocar una asignación retira las inscripciones que creó; el historial
  académico se conserva.

#### Importación CSV

- Columnas: nombre, apellido, correo, empresa, grupo y cargo. La pantalla
  reconoce encabezados comunes («Correo electrónico», «Cohorte»…) y deja
  corregir cada columna. Plantilla: botón «Descargar plantilla».
- Separador coma o punto y coma; UTF-8 o Windows-1252 (CSV de Excel).
  Máximo 2.000 filas por archivo.
- Primero se simula (`dryRun`) y se muestra el resultado de cada fila:
  cuenta nueva, ya existe u omitida con su motivo (correo inválido o
  repetido en el archivo, empresa o grupo inexistente, persona de otra
  empresa…). Nada se guarda hasta confirmar.
- Opciones: crear empresas o grupos que no existan y enviar invitaciones.

Los formularios validan en el navegador y el servidor valida todo de nuevo.

### Versionado

Los módulos, clases y bloques son la copia de trabajo. Publicar congela un
snapshot en `aula_course_versions`; cada inscripción apunta a la versión que
cursa. Las versiones, la bitácora, el historial de notas y las revisiones de
entregas no se pueden modificar (disparadores en la base).

### Archivos

- Subida por partes de 8 MB (`POST /uploads`, `PUT /uploads/:id/chunk`,
  `POST /uploads/:id/complete`). Cloudflare corta las peticiones de más de
  100 MB; así se suben videos de hasta 2 GB.
- El primer trozo se compara con la firma real del formato.
- Límites: imágenes 15 MB, documentos 100 MB, audio 200 MB, video 2 GB;
  logos 5 MB, portadas 10 MB, adjuntos de foro 10 MB; las actividades
  pueden restringir formatos y tamaño.
- Las subidas abandonadas más de 24 h se marcan como fallidas y se borran.

## Variables de entorno (servicio `api`)

| Variable | Obligatoria | Uso |
|---|---|---|
| `DATABASE_URL` | sí | PostgreSQL (ya existente). |
| `RESEND_API_KEY`, `FROM_EMAIL` | sí | Correos del aula (ya existentes). |
| `SITE_URL` | sí | Base de los enlaces de invitación (`https://edvanta.co`). |
| `AULA_ADMIN_EMAILS` | no | Correos que siempre son administradores. Por defecto `contacto@edvanta.co` (en `docker-compose.yaml`). |
| `AULA_STORAGE_DIR` | no | Carpeta de archivos. En Coolify `/data/aula` (volumen `aula-files`). |
| `AULA_BCRYPT_COST` | no | Costo de bcrypt (12). |

### Primer acceso del administrador

1. Al arrancar, la API crea la cuenta de cada correo de `AULA_ADMIN_EMAILS`
   (sin contraseña) o la promueve a administrador.
2. Entra a `https://edvanta.co/aula/recuperar` con ese correo.
3. Abre el enlace del correo y crea la contraseña.

## Desarrollo local

No hace falta PostgreSQL: el servidor local usa PGlite.

```bash
node api/scripts/aula-dev.js --reset   # API del aula en 127.0.0.1:3000
npm run dev                            # Vite en localhost:5173 (proxy /api)
```

- Aula: http://localhost:5173/aula
- Administrador local: `admin@aula.local` / `Admin-aula-2026`
- Los correos se guardan en `api/.data/aula-dev/mails` y el enlace se
  imprime en la consola.

## Pruebas

```bash
npm run test:api   # backend del aula con PostgreSQL real (PGlite)
npm test           # frontend + backend
```

## Despliegue

Coolify construye `docker-compose.yaml`. La migración `029_aula_schema.sql`
se aplica sola al arrancar la API. El volumen `aula-files` persiste entre
despliegues; inclúyelo en las copias de seguridad del servidor.

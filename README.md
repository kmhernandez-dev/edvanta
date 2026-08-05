# Edvanta / Biblioteca Profesional KH

Plataforma web comercial y educativa para Karla Hernandez.

Produccion objetivo:

- Frontend: `https://edvanta.co`
- API: servida por el mismo dominio mediante proxy relativo `/api/*`
- Repositorio: `https://github.com/kmhernandez-dev/edvanta`

La app combina tres marcas:

- **Biblioteca Profesional KH**: cursos gratuitos, herramientas editables, kits profesionales y recursos para farmacia, salud, calidad, datos y empleabilidad.
- **Feliz Sin Tiroides**: educacion para pacientes, ebooks, recursos gratis, servicios y comunidad de salud tiroidea.
- **AtenFarmaClinic**: formacion y recursos para quimicos farmaceuticos clinicos.

## FST Vida 360

`/vida-360` integra un portal educativo para organizar la experiencia de salud
tiroidea. Incluye ocho perfiles ficticios, onboarding, medicamentos, adherencia,
sintomas, laboratorios, mapa 360, objetivos, preparacion de consultas, linea de
tiempo y exportacion PDF/JSON.

El despliegue inicia deliberadamente en **modo piloto**. El modo demostracion es
funcional y guarda cambios solo en el navegador. El ingreso con datos reales y
los endpoints `/api/vida360/*` permanecen bloqueados hasta que ambas variables
se configuren en `true` despues de las revisiones clinica, legal, de privacidad
y seguridad:

```env
VITE_VIDA360_REAL_DATA_ENABLED=false
VIDA360_REAL_DATA_ENABLED=false
```

La plataforma no diagnostica, no recomienda dosis y no sustituye la consulta
con profesionales de salud. Las decisiones y riesgos pendientes estan
documentados en `docs/`.

## Estado Tecnico

- Frontend React/Vite/Tailwind funcionando.
- Backend Node/Express con PostgreSQL.
- Checkout Mercado Pago via backend.
- Precios validados server-side en `api/lib/catalog.js`.
- Captura de leads y correos via Resend.
- Log de ordenes aprobadas en PostgreSQL.
- Deploy objetivo en Coolify con `docker-compose.yaml`.
- Nginx sirve la SPA y hace proxy `/api/*` hacia el backend interno.

## Stack

- React 18
- React Router 7
- Vite 8
- Tailwind CSS 3
- Node 20 + Express 4
- PostgreSQL (`pg`)
- Mercado Pago SDK
- Resend API via `fetch`
- Docker Compose
- Coolify + Traefik
- Nginx

## Estructura

```text
.
|-- src/                         # Frontend React
|   |-- App.jsx                  # Rutas publicas
|   |-- main.jsx
|   |-- index.css                # Tailwind + clases base
|   |-- config/
|   |   |-- api.js               # apiUrl(): /api relativo o VITE_API_URL
|   |   `-- links.js             # WhatsApp, correo, Hotmart, redes
|   |-- context/
|   |   `-- CartContext.jsx      # Carrito global/localStorage
|   |-- data/                    # Catalogos y contenido editable
|   |-- pages/                   # Paginas por marca
|   `-- components/              # UI reusable
|-- api/                         # Backend Express
|   |-- server.js
|   |-- db.js
|   |-- package.json
|   |-- lib/
|   |   |-- catalog.js           # Fuente de verdad de precios
|   |   |-- free-guides.js       # Links de guias gratis
|   |   |-- migrate.js
|   |   `-- resend.js
|   |-- migrations/
|   |   `-- 001_orders.sql
|   `-- routes/
|       |-- create-preference.js
|       |-- mp-webhook.js
|       |-- lead-capture.js
|       `-- list-orders.js
|-- public/img/                  # Imagenes estaticas
|-- Dockerfile                   # Frontend + nginx
|-- Dockerfile.api               # Backend Node/Express
|-- docker-compose.yaml          # Stack web + api para Coolify
|-- nginx.conf                   # SPA fallback + proxy /api
|-- .env.example                 # Plantilla de variables
|-- AGENTS.md
|-- CLAUDE.md
`-- PARA-HECTOR.md
```

## Rutas Frontend

| Ruta | Pagina |
|---|---|
| `/` | Biblioteca Profesional KH |
| `/feliz-sin-tiroides` | Feliz Sin Tiroides |
| `/atenfarmaclinic` | AtenFarmaClinic |
| `/privacidad` | Politica de privacidad |
| `/terminos` | Terminos y condiciones |
| `/descargo-medico` | Descargo medico |
| `/afiliados` | Aviso de afiliados |
| `/vida-360` | Acceso y demostracion de FST Vida 360 |
| `/vida-360/mi-salud` | Historia tiroidea y registros del portal |
| `/vida-360/registrar` | Registro rapido del portal |
| `/vida-360/consultas` | Preparacion de consultas y documentos |
| `/vida-360/perfil` | Perfil, consentimientos y privacidad |

## Endpoints Backend

| Metodo | Ruta | Uso |
|---|---|---|
| `GET` | `/health` | Liveness |
| `GET` | `/api/health` | Estado de servicio/configuracion |
| `GET` | `/api/health/db` | Readiness de PostgreSQL |
| `POST` | `/api/create-preference` | Crear preferencia Mercado Pago |
| `POST` | `/api/mp-webhook` | Webhook Mercado Pago |
| `POST` | `/api/lead-capture` | Captura de leads |
| `GET` | `/api/list-orders` | Admin: listar ordenes con `ADMIN_TOKEN` |
| `GET` | `/api/vida360/state` | Estado del paciente autenticado |
| `PUT` | `/api/vida360/state` | Autosave del paciente autenticado |
| `GET` | `/api/vida360/export` | Exportacion del paciente autenticado |
| `POST` | `/api/vida360/deactivate` | Solicitud de desactivacion |

## Desarrollo Local

Frontend:

```bash
npm install
npm run dev
```

Build frontend:

```bash
npm run build
```

En Windows PowerShell, si `npm run build` falla por politica de ejecucion:

```bash
npm.cmd run build
```

Backend local:

```bash
cd api
npm install
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/biblioteca_kh \
  MP_ACCESS_TOKEN=TEST \
  RESEND_API_KEY=TEST \
  FROM_EMAIL=test@example.com \
  ADMIN_TOKEN=local-dev \
  node server.js
```

## Variables De Entorno

Ver `.env.example`.

Frontend build-time:

| Variable | Requerida | Nota |
|---|---:|---|
| `VITE_API_URL` | No | Recomendado dejar vacia en Coolify para usar `/api` relativo via nginx |
| `VITE_VIDA360_REAL_DATA_ENABLED` | No | Default `false`; habilita la interfaz autenticada solo despues de las revisiones |

Backend runtime:

| Variable | Requerida | Uso |
|---|---:|---|
| `PORT` | No | Default `3000` |
| `CORS_ORIGINS` | No | Default `https://edvanta.co,https://www.edvanta.co` |
| `SITE_URL` | Recomendado | Back URLs de Mercado Pago |
| `API_URL` | Recomendado | `notification_url` de Mercado Pago. Con proxy puede ser `https://edvanta.co` |
| `DATABASE_URL` | Si | Conexion PostgreSQL |
| `MP_ACCESS_TOKEN` | Si | Mercado Pago |
| `RESEND_API_KEY` | Si | Resend |
| `FROM_EMAIL` | Si | Remitente verificado |
| `NOTIFY_EMAIL` | Recomendado | Lead notifications |
| `ADMIN_TOKEN` | Si | Protege `/api/list-orders` |
| `VIDA360_REAL_DATA_ENABLED` | No | Default `false`; la API rechaza datos reales si no es exactamente `true` |

Nunca subir secretos al repositorio.

## Deploy Recomendado En Coolify

Usar **un solo stack Docker Compose** desde la raiz:

```text
docker-compose.yaml
```

Servicios:

- `web`: usa `Dockerfile`, sirve React con nginx, expone puerto 80.
- `api`: usa `Dockerfile.api`, escucha en `3000`, queda interno.
- `web` hace proxy `/api/*` a `api:3000`.

Dominios:

- Asignar `edvanta.co` y `www.edvanta.co` al servicio `web`.
- No es necesario exponer `api.edvanta.co` si se usa proxy relativo.

Health checks esperados:

```bash
curl https://edvanta.co/health
curl https://edvanta.co/api/health
curl https://edvanta.co/api/health/db
```

Todos deben responder `200` cuando Coolify, Traefik, Postgres y variables esten correctos.

## Flujo De Pago

1. El usuario agrega productos al carrito.
2. `CartDrawer` llama `apiUrl('/api/create-preference')`.
3. El backend ignora precios enviados por el navegador.
4. El backend calcula precio desde `api/lib/catalog.js`.
5. Mercado Pago procesa el pago.
6. Mercado Pago llama `/api/mp-webhook`.
7. El webhook confirma el pago con Mercado Pago.
8. Si esta aprobado, registra la orden en PostgreSQL.
9. Si hay links reales configurados, envia descargas por Resend.

## Donde Editar Contenido

| Necesidad | Archivo |
|---|---|
| Productos visibles | `src/data/products.js` |
| Precios server-side | `api/lib/catalog.js` |
| Ebooks/Feliz Sin Tiroides | `src/data/fst.js` |
| Cursos AtenFarmaClinic | `src/data/atenfarma.js` |
| Cursos recomendados | `src/data/courses.js` |
| Links comerciales | `src/config/links.js` |
| Links de descarga pagada | `api/routes/create-preference.js` |
| Links de guias gratis | `api/lib/free-guides.js` |
| Textos legales | `src/data/legal.js` |

## Pendientes De Produccion

- Completar links reales en `DOWNLOADS` dentro de `api/routes/create-preference.js`.
- Completar URLs de `FREE_GUIDES` en `api/lib/free-guides.js`.
- Revisar placeholders de `HOTMART_URL`, `LEAD_FORM_URL` e `INSTAGRAM_URL` en `src/config/links.js`.
- Verificar dominio `edvanta.co` en Resend y configurar SPF/DKIM en DNS.
- Configurar `FROM_EMAIL=Biblioteca KH <hola@edvanta.co>`.
- Confirmar `MP_ACCESS_TOKEN` de produccion.
- Confirmar `DATABASE_URL` y migraciones.
- Probar compra real de bajo monto.
- Considerar validacion de firma del webhook de Mercado Pago.
- Planear upgrade de Vite/esbuild por audit del dev server.

## Diagnostico Rapido De 503

Si `edvanta.co` devuelve `503`:

1. Verificar que el stack de Coolify este corriendo.
2. Revisar logs de `web` y `api`.
3. Confirmar que el dominio esta asignado al servicio `web`, puerto 80.
4. Confirmar que Cloudflare apunta a la IP correcta del servidor Coolify.
5. Confirmar que Traefik ve el servicio.
6. Confirmar que `DATABASE_URL`, `MP_ACCESS_TOKEN`, `RESEND_API_KEY`, `FROM_EMAIL` y `ADMIN_TOKEN` existen.
7. Probar desde Coolify shell: `wget -q -O - http://api:3000/health`.

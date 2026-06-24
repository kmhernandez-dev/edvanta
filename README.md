# Biblioteca Profesional KH

Plataforma web comercial y educativa para Karla Hernandez. Reune cursos recomendados, herramientas digitales, ebooks, servicios, captacion de leads y pagos online para tres marcas relacionadas:

- **Biblioteca Profesional KH**: cursos gratuitos tipo academia, herramientas editables y kits profesionales para farmacia, salud, calidad, datos y empleabilidad.
- **Feliz Sin Tiroides**: educacion para pacientes, ebooks, recursos gratis, servicios y comunidad de salud tiroidea.
- **AtenFarmaClinic**: formacion y recursos para quimicos farmaceuticos clinicos.

La aplicacion esta construida como SPA con React, Vite y Tailwind CSS, con un backend Node/Express + PostgreSQL, todo desplegado en **Coolify**.

**Produccion:** [edvanta.co](https://edvanta.co) (frontend) + [api.edvanta.co](https://api.edvanta.co) (backend).

## Estado Del Proyecto

- Frontend funcional con rutas publicas y carrito global.
- Catalogos definidos en archivos locales dentro de `src/data`.
- Imagenes profesionales en `public/img`.
- Checkout con Mercado Pago via backend Express.
- Captura de leads y envio de correos con Resend.
- Log de ordenes en PostgreSQL.
- Paginas legales basicas incluidas.

## Stack

- React 18
- React Router 7
- Vite 5
- Tailwind CSS 3
- Node 20 + Express 4
- PostgreSQL (`pg`)
- Mercado Pago SDK
- Resend API via `fetch`
- Coolify para deploy (Traefik como proxy reverso)
- nginx para servir el frontend estatico

## Estructura

```text
.
|-- api/
|   |-- server.js               # Express app
|   |-- db.js                   # Pool Postgres
|   |-- Dockerfile              # Build del backend
|   |-- lib/
|   |   |-- catalog.js          # Precios server-side
|   |   |-- free-guides.js
|   |   |-- migrate.js          # Corre migrations al arrancar
|   |   `-- resend.js
|   |-- migrations/
|   |   `-- 001_orders.sql
|   `-- routes/
|       |-- create-preference.js
|       |-- mp-webhook.js
|       |-- lead-capture.js
|       `-- list-orders.js
|-- src/
|   |-- App.jsx                 # Rutas principales
|   |-- main.jsx
|   |-- index.css               # Tailwind + componentes base
|   |-- config/
|   |   |-- api.js              # apiUrl() — usa VITE_API_URL
|   |   `-- links.js            # WhatsApp, Hotmart, correo, redes
|   |-- context/
|   |   `-- CartContext.jsx
|   |-- data/                   # Catalogos
|   |-- pages/
|   |-- components/
|   `-- utils/
|-- public/
|   `-- img/                    # Imagenes estaticas
|-- Dockerfile.web              # Build del frontend (multi-stage)
|-- nginx.conf                  # SPA fallback
|-- package.json
|-- .env.example
`-- PARA-HECTOR.md              # Notas tecnicas
```

## Rutas Del Frontend

| Ruta | Descripcion |
|---|---|
| `/` | Biblioteca Profesional KH |
| `/feliz-sin-tiroides` | Marca para pacientes con salud tiroidea |
| `/atenfarmaclinic` | Marca para atencion farmaceutica clinica |
| `/privacidad` | Politica de privacidad |
| `/terminos` | Terminos y condiciones |
| `/descargo-medico` | Descargo medico |
| `/afiliados` | Aviso de afiliados |

## Endpoints Del Backend

| Método | Ruta | Descripción |
|---|---|---|
| `GET`  | `/health` | Healthcheck |
| `POST` | `/api/create-preference` | Crear preferencia de Mercado Pago |
| `POST` | `/api/mp-webhook` | Webhook de Mercado Pago (log + email) |
| `POST` | `/api/lead-capture` | Captura de leads (recursos gratis) |
| `GET`  | `/api/list-orders` | Admin: listar/buscar órdenes (requiere `ADMIN_TOKEN`) |

## Instalacion Local

Frontend:

```bash
npm install
npm run dev
```

Servidor local por defecto:

```text
http://localhost:5173
```

Backend (requiere Postgres local):

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

## Build

```bash
npm run build
```

En Windows PowerShell, si `npm run build` falla por politica de ejecucion:

```bash
npm.cmd run build
```

Para revisar el build:

```bash
npm run preview
```

## Variables De Entorno

Configurar en **Coolify → Environment variables** del servicio correspondiente.

| Variable | Scope | Requerida | Uso |
|---|---|---:|---|
| `VITE_API_URL` | build | Si | URL del backend (default `https://api.edvanta.co`) |
| `PORT` | api runtime | No | Puerto Express (default 3000) |
| `CORS_ORIGINS` | api runtime | No | Orígenes permitidos (CSV) |
| `SITE_URL` | api runtime | No | URL pública del frontend |
| `API_URL` | api runtime | No | URL pública del backend (para webhook MP) |
| `DATABASE_URL` | api runtime | Si | Inyectada por Coolify al enlazar Postgres |
| `MP_ACCESS_TOKEN` | api runtime | Si | Token de Mercado Pago (producción) |
| `RESEND_API_KEY` | api runtime | Si | API key de Resend |
| `FROM_EMAIL` | api runtime | Si | Remitente verificado en Resend |
| `NOTIFY_EMAIL` | api runtime | Recomendado | Correo donde llegan los leads |
| `ADMIN_TOKEN` | api runtime | Recomendado | Token para `/api/list-orders` |

No subir secretos al repositorio. Los archivos `.env*` ya están ignorados.

## Log De Órdenes (PostgreSQL)

Cada pago aprobado por Mercado Pago se registra automáticamente en la tabla `orders` con:

- `payment_id`, `status`, `status_detail`
- `email`, `payer_id`
- `items` (jsonb con id, name, has_download por producto)
- `transaction_amount`, `currency_id`
- `payment_method`, `payment_type`
- `date_approved`, `date_created`, `logged_at`, `email_sent_at`

Para consultarlo:

```bash
# Listar las últimas 50 órdenes
curl https://api.edvanta.co/api/list-orders \
  -H "x-admin-token: $ADMIN_TOKEN"

# Limitar resultados
curl "https://api.edvanta.co/api/list-orders?limit=20" \
  -H "x-admin-token: $ADMIN_TOKEN"

# Buscar una orden por id de pago
curl "https://api.edvanta.co/api/list-orders?payment_id=123456789" \
  -H "x-admin-token: $ADMIN_TOKEN"
```

También se puede pasar el token por query string (`?token=...`) si el cliente no soporta headers personalizados.

## Despliegue En Coolify

**Project:** `cursos` (uuid `pksk0s04cgssswgks0000sco`)
**Environment:** `production` (uuid `swkko00wsswswgckg4ckw0ws`)

### Servicios a crear

1. **Postgres** (tipo `standalone-postgresql`) — DB name `biblioteca_kh`.
2. **api** — Docker image, `Dockerfile` desde `api/`. Dominio: `api.edvanta.co`.
3. **web** — Docker image, `Dockerfile.web` desde raíz. Dominios: `edvanta.co` y `www.edvanta.co`.

### Configurar DNS en Cloudflare

Los registros DNS deben apuntar a Coolify (Traefik los recoge automáticamente):

| Tipo | Nombre | Destino |
|---|---|---|
| `A` | `@` | IP del servidor Coolify |
| `A` | `www` | IP del servidor Coolify |
| `A` | `api` | IP del servidor Coolify |

El proxy de Cloudflare (naranja) debe estar **activado** para que Traefik emita el certificado SSL automáticamente vía Let's Encrypt / ACME DNS-01.

### Verificar `edvanta.co` en Resend

Para enviar correos desde `hola@edvanta.co`:

1. En [resend.com/domains](https://resend.com/domains), agregar `edvanta.co`.
2. Copiar los registros SPF/DKIM que Resend muestra.
3. Pegarlos en Cloudflare DNS como registros `TXT`.
4. Esperar verificación (unos minutos).
5. Setear `FROM_EMAIL=Biblioteca KH <hola@edvanta.co>` en el servicio `api` de Coolify.

## Donde Editar Contenido

| Necesidad | Archivo |
|---|---|
| WhatsApp, correo, Hotmart, redes | `src/config/links.js` |
| URL del backend (build-time) | `src/config/api.js` |
| Productos y herramientas Biblioteca KH | `src/data/products.js` |
| Cursos recomendados | `src/data/courses.js` |
| Contenido Feliz Sin Tiroides | `src/data/fst.js` |
| Cursos/productos AtenFarmaClinic | `src/data/atenfarma.js` |
| Textos legales | `src/data/legal.js` |
| Categorías | `src/data/categories.js` |
| Rutas formativas | `src/data/routes.js` |
| Precios server-side | `api/lib/catalog.js` |
| Links de descarga de ebooks | `api/routes/create-preference.js` (DOWNLOADS) |
| Links de guías gratis | `api/lib/free-guides.js` |

## Imagenes

Las imagenes publicas viven en:

```text
public/img
```

Se referencian desde React usando rutas como:

```jsx
<img src="/img/herramienta-farmaceutica.jpg" alt="..." />
```

No mover ni renombrar imagenes sin actualizar las referencias en `src/data/*` o componentes.

## Carrito Y Pagos

El carrito vive en `src/context/CartContext.jsx` y se persiste en `localStorage` con la clave `bpkh_cart_v1`.

Flujo:

1. Usuario agrega un producto.
2. `CartDrawer` envia el carrito a `apiUrl('/api/create-preference')`.
3. Backend crea preferencia en Mercado Pago con precios del catálogo server-side.
4. Usuario paga en Mercado Pago.
5. Mercado Pago redirige al sitio y notifica al webhook.
6. `PaymentStatus` muestra estado visual.
7. Webhook guarda la orden en Postgres y envía links de descarga.

## Checklist Antes De Publicar

- [ ] Dominio `edvanta.co` apunta a Coolify vía Cloudflare.
- [ ] Servicio Postgres provisionado y enlazado al servicio `api`.
- [ ] `MP_ACCESS_TOKEN` de producción configurado.
- [ ] `edvanta.co` verificado en Resend + DNS records en Cloudflare.
- [ ] `FROM_EMAIL` usa el dominio verificado.
- [ ] `ADMIN_TOKEN` generado (string aleatorio largo).
- [ ] Completar links reales en `DOWNLOADS` (api/routes/create-preference.js).
- [ ] Completar links reales en `FREE_GUIDES` (api/lib/free-guides.js).
- [ ] Revisar `HOTMART_URL`, `LEAD_FORM_URL` e `INSTAGRAM_URL`.
- [ ] Probar compra real de bajo monto.
- [ ] Confirmar que los correos llegan a comprador y a Karla.
- [ ] Revisar textos legales y descargo medico.

## Notas Para Colaboradores

- No subir `node_modules`, `dist`, `.env*`, `set-env.ps1` ni `opencode.json`.
- No poner tokens, claves ni secretos en codigo.
- Mantener el estilo visual profesional, educativo y sobrio.
- Evitar emojis como elementos principales de UI; preferir imagenes, SVGs o iconos lineales.
- Preservar las marcas y rutas existentes.
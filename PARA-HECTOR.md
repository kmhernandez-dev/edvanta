# Notas técnicas — Plataforma de Karla Hernández

Documento para configurar deploy en Coolify, DNS en Cloudflare/Namecheap y verificación del dominio en Resend.

## Stack

- **Frontend**: React 18 + Vite 5 + Tailwind CSS 3 + React Router 7 (SPA).
- **Backend**: Node 20 + Express 4 + PostgreSQL (`pg`).
- **Despliegue**: Coolify (Traefik como proxy reverso automático).
- **DNS**: Cloudflare (con proxy naranja activado) + Namecheap como registrador.
- **Correos**: Resend (`fetch`, sin SDK).

## Correr en local

```bash
npm install
npm run dev        # http://localhost:5173

cd api
npm install
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/biblioteca_kh \
  MP_ACCESS_TOKEN=TEST RESEND_API_KEY=TEST FROM_EMAIL=test@example.com \
  ADMIN_TOKEN=local-dev node server.js
```

## Estructura del deploy (Coolify)

```
Project: cursos
  └─ Environment: production
       ├─ postgres   (standalone-postgresql, DB: biblioteca_kh)
       ├─ api        (Dockerfile.web desde /api, dominio api.edvanta.co)
       └─ web        (Dockerfile.web desde raíz, dominio edvanta.co + www)
```

Cada servicio es una app Docker independiente. Coolify + Traefik enrutan automáticamente por dominio.

## DNS en Cloudflare

Los registros deben apuntar a la IP del servidor Coolify **con el proxy naranja activado** (estado "Proxied" en Cloudflare). Esto le da a Traefik la capacidad de emitir certificados SSL via ACME DNS-01.

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| A   | @       | IP del servidor | Proxied |
| A   | www     | IP del servidor | Proxied |
| A   | api     | IP del servidor | Proxied |

Si el proxy naranja estuviera desactivado (DNS-only), Traefik puede tener problemas para emitir certificados wildcard.

## Variables de entorno

### Servicio `web` (frontend) — build-time

| Variable | Ejemplo |
|---|---|
| `VITE_API_URL` | `https://api.edvanta.co` |

### Servicio `api` (backend) — runtime

| Variable | Para qué |
|---|---|
| `PORT` | Puerto Express (default 3000, no tocar) |
| `CORS_ORIGINS` | `https://edvanta.co,https://www.edvanta.co` |
| `SITE_URL` | `https://edvanta.co` (usado en back_urls de MP) |
| `API_URL` | `https://api.edvanta.co` (usado en notification_url del webhook) |
| `DATABASE_URL` | Inyectada automáticamente por Coolify al enlazar Postgres |
| `MP_ACCESS_TOKEN` | Token de Mercado Pago (producción) |
| `RESEND_API_KEY` | API key de Resend |
| `FROM_EMAIL` | `Biblioteca KH <hola@edvanta.co>` (requiere dominio verificado) |
| `NOTIFY_EMAIL` | Correo de Karla para recibir leads |
| `ADMIN_TOKEN` | Token aleatorio largo para `/api/list-orders` |

## Verificar `edvanta.co` en Resend

1. Crear cuenta en [resend.com](https://resend.com) si no tienes.
2. Ir a [resend.com/domains](https://resend.com/domains) → Add domain → `edvanta.co`.
3. Resend muestra los registros DNS a agregar:
   - `TXT` SPF (suele ser 1 solo registro)
   - `CNAME` DKIM (suele ser 2-3 registros `resend._domainkey`, etc.)
4. Copiar cada registro y pegarlo en **Cloudflare DNS** como `TXT` o `CNAME` según corresponda.
   - Si usas Cloudflare con proxy, los registros TXT/CNAME para verificación NO deben estar proxied (deben ser "DNS only" — nube gris).
5. Esperar unos minutos. Resend verifica automáticamente.
6. Una vez verificado, setear `FROM_EMAIL=Biblioteca KH <hola@edvanta.co>` en el servicio `api` de Coolify.

## Crear los servicios en Coolify

Asumiendo que el proyecto `cursos` ya existe:

1. **Postgres**: New → Database → `standalone-postgresql`. Nombre: `biblioteca_kh`. Coolify genera credenciales y URL.
2. **api**: New → Application → Public/Private Repository → `kmhernandez-dev/edvanta` branch `main`. Build pack: `dockerfile`. Path: `api/Dockerfile`. Puerto: 3000. Dominio: `api.edvanta.co`. Setear todas las variables de la tabla de arriba.
3. **web**: New → Application → mismo repo, mismo branch. Build pack: `dockerfile`. Path: `Dockerfile.web` (en raíz). Puerto: 80. Dominios: `edvanta.co` y `www.edvanta.co`. Setear solo `VITE_API_URL=https://api.edvanta.co` (build-time).
4. **Enlazar**: en el servicio `api`, agregar como dependencia a `postgres` para que Coolify inyecte `DATABASE_URL`.

## Catálogo server-side

Los precios están en `api/lib/catalog.js`. Para cambiar un precio o agregar un producto nuevo, editar ese archivo y mantenerlo sincronizado con `src/data/products.js` (lo que ve el cliente). El `id` es la llave de unión.

## Log de órdenes

La tabla `orders` se crea automáticamente al arrancar el backend (migraciones idempotentes en `api/migrations/`). Para consultar:

```bash
curl https://api.edvanta.co/api/list-orders \
  -H "x-admin-token: $ADMIN_TOKEN"
```

## Modelo de venta

- Pago **único** por cada producto (no suscripciones).
- Entrega: el comprador recibe por correo el link de descarga (los archivos se alojan en Drive/Dropbox y se pegan en `DOWNLOADS` dentro de `api/routes/create-preference.js`).

Cualquier duda, los datos están comentados en cada archivo.
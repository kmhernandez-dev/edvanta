# Notas Tecnicas Para Despliegue - Edvanta

Objetivo: publicar la plataforma en `edvanta.co` usando Coolify, Cloudflare, PostgreSQL, Mercado Pago y Resend.

## Estado Actual Del Repo

- Repo: `kmhernandez-dev/edvanta`
- Branch: `main`
- Frontend: `Dockerfile`
- Backend: `Dockerfile.api`
- Stack recomendado: `docker-compose.yaml`
- Dominio publico recomendado: `edvanta.co`
- API recomendada: misma raiz publica con proxy `/api/*`

## Arquitectura

```text
Cloudflare -> Coolify/Traefik -> web:80 (nginx)
                                  |
                                  +-- /api/* -> api:3000
                                                   |
                                                   +-- PostgreSQL
```

## Servicios En Coolify

1. Postgres standalone
   - Database: `biblioteca_kh`
   - Debe generar o entregar `DATABASE_URL`.

2. Stack Docker Compose
   - Repo: `kmhernandez-dev/edvanta`
   - Branch: `main`
   - Compose file: `docker-compose.yaml`
   - Servicio publico: `web`
   - Puerto publico: `80`
   - Dominios: `edvanta.co`, `www.edvanta.co`

No crear servicios separados usando `Dockerfile.web` o `api/Dockerfile`: esos archivos ya no existen.

## DNS En Cloudflare

Registros A apuntando a la IP del servidor Coolify:

| Tipo | Nombre | Contenido | Proxy |
|---|---|---|---|
| A | @ | IP Coolify | Proxied |
| A | www | IP Coolify | Proxied |

`api.edvanta.co` es opcional. La app actual puede funcionar con `/api/*` en `edvanta.co`.

## Variables De Entorno

### Stack / servicio api

```env
NODE_ENV=production
PORT=3000
CORS_ORIGINS=https://edvanta.co,https://www.edvanta.co
SITE_URL=https://edvanta.co
API_URL=https://edvanta.co
DATABASE_URL=postgresql://...
MP_ACCESS_TOKEN=APP_USR_...
RESEND_API_KEY=re_...
FROM_EMAIL=Biblioteca KH <hola@edvanta.co>
NOTIFY_EMAIL=correo-de-karla
ADMIN_TOKEN=token-largo-aleatorio
```

### Frontend

`VITE_API_URL` puede quedar vacia. Asi el bundle usa `/api` relativo y nginx lo manda al backend interno.

## Health Checks

Despues de desplegar:

```bash
curl https://edvanta.co/health
curl https://edvanta.co/api/health
curl https://edvanta.co/api/health/db
```

Los tres deben devolver JSON con `ok: true`.

Si devuelven `503`:

1. Revisar que el stack compose este corriendo.
2. Revisar logs de `web`.
3. Revisar logs de `api`.
4. Confirmar dominio en Coolify para servicio `web`.
5. Confirmar IP en Cloudflare.
6. Probar dentro del contenedor web que `api:3000` resuelve.
7. Confirmar que `DATABASE_URL` existe y que Postgres acepta conexiones.

## Resend

Para enviar desde `hola@edvanta.co`:

1. Crear dominio `edvanta.co` en Resend.
2. Copiar registros SPF/DKIM.
3. Pegarlos en Cloudflare como DNS only.
4. Esperar verificacion.
5. Usar `FROM_EMAIL=Biblioteca KH <hola@edvanta.co>`.

## Mercado Pago

- `MP_ACCESS_TOKEN` debe ser de produccion para cobrar.
- El webhook se configura automaticamente desde la preferencia con `API_URL + /api/mp-webhook`.
- Con la config recomendada, `API_URL=https://edvanta.co`.

## Pendientes De Negocio

- Completar links reales en `api/routes/create-preference.js`.
- Completar links de recursos gratis en `api/lib/free-guides.js`.
- Probar compra real de bajo monto.
- Confirmar que la orden aparece en `/api/list-orders`.
- Confirmar que llega el correo de descarga.


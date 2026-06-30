# Agent Quick Context

Read `AGENTS.md` first. This file exists because some tools/users ask for `agent.md` specifically.

## What This Repo Is

Edvanta / Biblioteca Profesional KH is a React + Vite + Tailwind frontend with a Node/Express/PostgreSQL backend.

Brands:

- Biblioteca Profesional KH
- Feliz Sin Tiroides
- AtenFarmaClinic

It sells digital resources, recommends courses, captures leads, integrates with Mercado Pago, sends emails via Resend and logs approved orders in PostgreSQL.

## Run

```bash
npm install
npm.cmd run build

cd api
npm install
node --check server.js
```

## Deploy Shape

- Coolify Docker Compose stack.
- `Dockerfile`: frontend/nginx.
- `Dockerfile.api`: backend.
- `docker-compose.yaml`: web + api.
- `nginx.conf`: `/api/*` proxy to internal `api:3000`.
- Public domain target: `https://edvanta.co`.

## Edit Content Here

- Products: `src/data/products.js`
- Server-side prices: `api/lib/catalog.js`
- Paid download links: `api/routes/create-preference.js`
- Free guide URLs: `api/lib/free-guides.js`
- Feliz Sin Tiroides: `src/data/fst.js`
- AtenFarmaClinic: `src/data/atenfarma.js`
- Links: `src/config/links.js`
- Legal: `src/data/legal.js`
- Images: `public/img`

## Do Not Delete

Do not delete existing source files, data files, images, or config. Add changes safely and keep old assets unless the user explicitly asks to remove them.

## Production Warnings

- If `edvanta.co` returns 503, check Coolify/Traefik/Cloudflare/origin first.
- Replace `PEGA_AQUI_EL_LINK` in `api/routes/create-preference.js`.
- Complete free guide URLs in `api/lib/free-guides.js`.
- Keep product ids synced between frontend data and `api/lib/catalog.js`.
- Never commit `.env` or secrets.


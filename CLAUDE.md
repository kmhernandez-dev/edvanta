# Claude Project Context

Read `AGENTS.md` first. This file gives the short version for Claude.

## Project

Edvanta / Biblioteca Profesional KH is a React + Express + PostgreSQL platform for:

- Biblioteca Profesional KH
- Feliz Sin Tiroides
- AtenFarmaClinic

Production target: `https://edvanta.co`.

## Architecture

- Frontend: React 18, Vite, Tailwind, served by nginx.
- Backend: Node 20 + Express in `api/`.
- Database: PostgreSQL with `orders` table.
- Payments: Mercado Pago through `api/routes/create-preference.js`.
- Webhook: `api/routes/mp-webhook.js`.
- Emails: Resend via `api/lib/resend.js`.
- Deploy: Coolify Docker Compose using `docker-compose.yaml`.
- Frontend image: `Dockerfile`.
- Backend image: `Dockerfile.api`.
- Nginx proxy: `/api/*` -> internal `api:3000`.

## Commands

```bash
npm install
npm.cmd run build
cd api
npm install
node --check server.js
```

## Important Files

- `src/App.jsx`: routes.
- `src/config/api.js`: API URL helper.
- `src/context/CartContext.jsx`: cart.
- `src/data/*`: public content/catalog data.
- `api/lib/catalog.js`: server-side prices. Keep in sync with frontend products.
- `api/lib/free-guides.js`: free guide URLs.
- `api/routes/create-preference.js`: Mercado Pago preference + paid download map.
- `api/routes/mp-webhook.js`: payment confirmation, DB log, download email.
- `api/routes/list-orders.js`: admin order listing.
- `api/migrations/001_orders.sql`: orders schema.
- `docker-compose.yaml`: Coolify stack.
- `nginx.conf`: SPA fallback and API proxy.

## Rules

- Do not delete files/assets unless explicitly asked.
- Do not commit secrets.
- Keep product ids stable.
- If changing visible prices, update `api/lib/catalog.js`.
- Prefer editing `src/data/*` for content.
- Keep UI professional and not emoji-heavy.
- Run build after changes.

## Known Production Risks

- `edvanta.co` returning 503 is likely Coolify/Cloudflare/origin routing, not frontend build.
- Paid download links in `api/routes/create-preference.js` may still be placeholders.
- Free guide URLs in `api/lib/free-guides.js` may still be empty.
- Mercado Pago webhook signature validation is not implemented.
- Frontend audit reports Vite/esbuild dev-server advisory; plan an upgrade.


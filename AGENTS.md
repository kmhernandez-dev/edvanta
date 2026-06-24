# Agent Guide

This file is the main context document for coding agents working on this repository. Read it before editing.

## Project Identity

Commercial education platform for Karla Hernandez with three connected brands:

- **Biblioteca Profesional KH**: professional learning resources, free course discovery, editable templates, dashboards and career tools.
- **Feliz Sin Tiroides**: thyroid-health education for patients, ebooks, free lead magnets and services.
- **AtenFarmaClinic**: clinical pharmacy education and professional resources.

Business goal: sell digital resources and capture leads while presenting a professional academy-like experience.

Production domain: **https://edvanta.co** (frontend) and **https://api.edvanta.co** (backend).

## High-Level Architecture

Two containers, both deployed in **Coolify** (project `cursos`):

```
┌─────────────────────────────────────────────────────┐
│            Frontend (React SPA)                    │
│   - Vite build → static files                       │
│   - Served by nginx                                │
│   - https://edvanta.co                              │
│   - Dockerfile: Dockerfile.web (multi-stage)        │
└─────────────────────────────────────────────────────┘
                        │
                  fetch /api/*
                        ▼
┌─────────────────────────────────────────────────────┐
│            Backend (Node 20 + Express)             │
│   - Endpoints under /api/*                          │
│   - Connects to Postgres for order log              │
│   - Sends emails via Resend                         │
│   - https://api.edvanta.co                          │
│   - Dockerfile: api/Dockerfile                       │
└─────────────────────────────────────────────────────┘
                        │
                  pg connection
                        ▼
┌─────────────────────────────────────────────────────┐
│            Postgres (standalone)                    │
│   - Database: biblioteca_kh                         │
│   - Table: orders (log de pagos)                    │
└─────────────────────────────────────────────────────┘
```

### Repo layout

```
.
├── src/                  # React SPA (frontend)
│   ├── App.jsx
│   ├── components/
│   ├── context/          # CartContext (localStorage)
│   ├── data/             # Catalogos (products, fst, courses, etc.)
│   ├── config/
│   │   ├── api.js        # apiUrl() — usa VITE_API_URL
│   │   └── links.js      # WhatsApp, email, redes
│   └── pages/
├── api/                  # Backend Node/Express
│   ├── server.js         # Entry point
│   ├── db.js             # Pool de Postgres
│   ├── Dockerfile        # Imagen del backend
│   ├── lib/
│   │   ├── catalog.js    # Precios server-side (NO TOCAR precios sin sync)
│   │   ├── free-guides.js# Links de recursos gratis
│   │   ├── migrate.js    # Corre migrations/ al arrancar
│   │   └── resend.js     # Helper emails
│   ├── migrations/
│   │   └── 001_orders.sql# Schema de la tabla orders
│   └── routes/
│       ├── create-preference.js
│       ├── mp-webhook.js
│       ├── lead-capture.js
│       └── list-orders.js (admin, requiere ADMIN_TOKEN)
├── public/img/           # Imagenes estaticas
├── Dockerfile.web        # Build del frontend (multi-stage)
├── nginx.conf            # Config nginx con SPA fallback
├── .env.example          # Plantilla de variables
├── package.json          # Solo el frontend
└── .dockerignore         # Protege secretos del contexto Docker
```

## Tech Stack

- React 18 (Vite 5)
- React Router 7
- Tailwind CSS 3
- Node 20 + Express 4
- PostgreSQL (vía `pg`)
- Mercado Pago SDK (`mercadopago`)
- Resend API (vía `fetch`, sin SDK)
- Coolify para deploy
- GitHub Actions / Coolify git integration para CI/CD

## Commands

Install (frontend):

```bash
npm install
```

Dev local (frontend, hot-reload):

```bash
npm run dev
```

Build:

```bash
npm run build        # genera dist/
```

Si bloquea PowerShell:

```bash
npm.cmd run build
```

Backend local (requiere Postgres corriendo):

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

## Routing

- `/` → `BibliotecaHome`
- `/feliz-sin-tiroides` → `FelizSinTiroides`
- `/atenfarmaclinic` → `AtenFarmaClinic`
- `/privacidad` → `LegalPage`
- `/terminos` → `LegalPage`
- `/descargo-medico` → `LegalPage`
- `/afiliados` → `LegalPage`
- `*` → `BibliotecaHome`

## Data Model Notes

Product records usually include:

- `id`: stable product id, also used by cart and webhook metadata.
- `name`: display name.
- `category`: display category.
- `price`: COP integer (visible to client).
- `comparePrice`: previous price or `null`.
- `image`: optional public image path.
- `formats`: display text for file formats.
- `badge`: optional label.
- `description`, `forWhom`, `problem`: modal/product copy.
- `items`: list of included resources.
- `relatedCourses`: Edutin links.
- `hotmartUrl`: optional external checkout URL.

Do not change an `id` unless you also update:

- `api/lib/catalog.js` (server-side price lookup).
- `api/routes/create-preference.js` `DOWNLOADS` map.
- Any UI references.
- Any external delivery process.

## Payment Flow

1. `CartContext` stores selected items in `localStorage` (key `bpkh_cart_v1`).
2. `CartDrawer` posts items to `apiUrl('/api/create-preference')` (uses `VITE_API_URL`).
3. `api/routes/create-preference.js` looks up each product id in `api/lib/catalog.js`. Any price sent from the browser is **ignored**.
4. Mercado Pago redirects user back with status query params.
5. `PaymentStatus.jsx` reads query params and shows success/pending/failure.
6. Mercado Pago calls `api/routes/mp-webhook.js`.
7. The webhook confirms payment status with Mercado Pago API.
8. If approved, it logs the order to Postgres and sends download links with Resend.
9. Karla can list/inspect orders via `GET /api/list-orders` using the `ADMIN_TOKEN`.

## Environment Variables

Never commit secrets. Two scopes:

**Build-time (frontend, baked into the bundle):**

- `VITE_API_URL` — URL del backend (default `https://api.edvanta.co`).

**Runtime (backend container):**

- `PORT` (default 3000)
- `CORS_ORIGINS` (default `https://edvanta.co,https://www.edvanta.co`)
- `SITE_URL` (default `https://edvanta.co`)
- `API_URL` (default `https://api.edvanta.co`)
- `DATABASE_URL` — Coolify injects if you link Postgres service
- `MP_ACCESS_TOKEN` — Mercado Pago Access Token (prod)
- `RESEND_API_KEY` — Resend API key
- `FROM_EMAIL` — verified sender in Resend (must use edvanta.co after verification)
- `NOTIFY_EMAIL` — Karla's email for lead notifications
- `ADMIN_TOKEN` — long random string for `/api/list-orders`

## Content Editing Rules

- Prefer editing `src/data/*` for copy, prices and catalog changes.
- Prefer editing `src/config/links.js` for external links.
- Prefer editing `api/lib/catalog.js` for SERVER-SIDE prices (mirror of `src/data/*`).
- Keep product ids stable across `src/data/*` and `api/lib/catalog.js`.
- Keep prices as plain numbers in COP.
- Add new public assets under `public/img`.
- Reference public images as `/img/file-name.ext`.
- Do not use large emoji blocks as primary visuals; use images or SVG line icons.

## Visual Direction

The desired look is:

- Professional online academy / Edutin-like polish.
- Clean cards with real or generated professional imagery.
- Navy, teal, white, and subtle accent colors.
- Trustworthy healthcare/education tone.
- Minimal clutter, clear CTAs, high legibility.

Avoid:

- Emoji-heavy UI.
- Placeholder links in visible CTAs.
- Overly playful graphics for clinical/professional content.
- Breaking responsive card grids.

## Files And Folders To Avoid Committing

- `node_modules`
- `dist`
- `.env`, `.env.local`, `.env.*.local`
- `set-env.ps1` (script local con tokens)
- `opencode.json` (config del IDE local)
- `.coolify`, `.netlify` (legacy)

Already in `.gitignore`.

## Coolify Setup (target state)

Project: **cursos** (uuid `pksk0s04cgssswgks0000sco`)
Environment: **production** (uuid `swkko00wsswswgckg4ckw0ws`)

Services expected:

1. **Postgres** (standalone-postgresql) — `biblioteca_kh`
2. **api** (Dockerfile from `api/`) — domain `api.edvanta.co`
3. **web** (Dockerfile.web from root) — domain `edvanta.co` + `www.edvanta.co`

When linking Postgres → api in Coolify, the `DATABASE_URL` env var is auto-injected.

## Production Gaps To Watch

- `api/routes/create-preference.js` `DOWNLOADS` map still contains `'PEGA_AQUI_EL_LINK'` placeholders.
- `api/lib/free-guides.js` `FREE_GUIDES` has empty `url` fields.
- `src/config/links.js` may contain placeholder Hotmart/Form links.
- Mercado Pago webhook signature validation is not implemented.
- Resend sender domain `edvanta.co` must be verified in Resend + DNS SPF/DKIM records.

## Safe Editing Workflow

1. Inspect relevant files first.
2. Make focused changes only.
3. Do not delete original assets unless explicitly asked.
4. Run `npm.cmd run build` to verify the frontend builds.
5. Run `node --check <file.js>` on backend files you changed.
6. Report changed files and any production risks.

## User Preference

The owner explicitly asked not to delete existing project files because that could damage the app. Preserve existing content and add non-destructive changes whenever possible.

# Agent Guide

Read this before editing. The owner asked not to delete existing project files or assets unless explicitly requested.

## Project Identity

This repository powers **Edvanta / Biblioteca Profesional KH**, a commercial education platform for Karla Hernandez.

Public brand areas:

- **Biblioteca Profesional KH**: free course discovery, professional templates, dashboards, career and pharmacy/health resources.
- **Feliz Sin Tiroides**: thyroid-health education, ebooks, free resources and services.
- **Feliz Sin Tiroides App** (`/fst-app`): HealthTech companion app with NutriFST IA (local knowledge engine), levothyroxine tracking, meal scanner, menus, symptoms diary, shopping list, radioiodine prep mode and consultation PDF report.
- **AtenFarmaClinic**: clinical pharmacy education and resources.

Production target: `https://edvanta.co`.

## Current Architecture

The current architecture is a Docker Compose stack in Coolify:

```text
Cloudflare
  -> Coolify / Traefik
    -> web container (nginx, port 80)
      -> React static build
      -> /api/* proxy to api:3000
    -> api container (Node 20 + Express)
      -> PostgreSQL
      -> Mercado Pago
      -> Resend
```

Important: older docs mentioned `Dockerfile.web`, `api/Dockerfile`, Netlify functions and a separate public `api.edvanta.co`. The current repo uses:

- `Dockerfile` for frontend/nginx.
- `Dockerfile.api` for backend.
- `docker-compose.yaml` for Coolify.
- `nginx.conf` to proxy `/api/*` to internal `api:3000`.

## Tech Stack

- React 18
- Vite 8
- React Router 7
- Tailwind CSS 3
- Node 20
- Express 4
- PostgreSQL (`pg`)
- Mercado Pago SDK
- Resend API via `fetch`
- Nginx
- Docker Compose
- Coolify

## Commands

Frontend:

```bash
npm install
npm.cmd run build
```

Backend syntax check:

```bash
cd api
npm install
node --check server.js
```

Windows note: use `npm.cmd` if PowerShell blocks `npm.ps1`.

## Key Files

| File | Purpose |
|---|---|
| `src/App.jsx` | Public frontend routes |
| `src/config/api.js` | Builds API URLs; empty `VITE_API_URL` means relative `/api` |
| `src/config/links.js` | WhatsApp, Hotmart, email and social links |
| `src/context/CartContext.jsx` | Global cart and localStorage persistence |
| `src/data/products.js` | Visible Biblioteca KH products |
| `src/data/fst.js` | Feliz Sin Tiroides ebooks/content |
| `src/data/fstApp/*` | NutriFST knowledge base: `alimentos.js`, `nutrientes.js`, `recetas.js`, `evidence.js` |
| `src/lib/fstApp/nutrifst.js` | NutriFST engine: question analysis, interactions, menus, safety levels |
| `src/lib/fstApp/pdf.js` | Consultation PDF report generator (jspdf) |
| `src/context/FstAppContext.jsx` | FST App state, localStorage demo + API sync |
| `src/components/fstApp/*` | FST App shell, sections and tools |
| `src/pages/FstAppPortal.jsx` | FST App portal (routes under `/fst-app/*`) |
| `src/data/atenfarma.js` | AtenFarmaClinic content |
| `api/server.js` | Express app and health endpoints |
| `api/lib/catalog.js` | Server-side product prices; source of truth for checkout |
| `api/lib/free-guides.js` | Free guide URLs |
| `api/lib/resend.js` | Email helper |
| `api/routes/create-preference.js` | Mercado Pago preference creation and download map |
| `api/routes/mp-webhook.js` | Payment confirmation, order log, download email |
| `api/routes/lead-capture.js` | Lead capture endpoint |
| `api/routes/list-orders.js` | Admin order listing with `ADMIN_TOKEN` |
| `api/routes/fst-app.js` | FST App state sync (real mode, gated by `VIDA360_REAL_DATA_ENABLED`) |
| `api/routes/retos.js` | Retos FST public/auth API (list, weekly, detail, join, mine, checkin) |
| `api/routes/admin-retos.js` | Retos FST admin API (CRUD retos/días, YouTube validation, duplicate) |
| `api/migrations/001_orders.sql` | PostgreSQL schema |
| `api/migrations/019_retos_fst.sql` | Retos FST tables (`fst_challenges`, `fst_challenge_days`, `fst_user_challenges`, `fst_challenge_checkins`) |
| `api/migrations/020_retos_fst_seed.sql` | Retos FST seed: 12 retos × 7 días (48 YouTube videos, URLs only) |
| `api/migrations/021_retos_fst_metadata.sql` | Verified video metadata (titles, channels, durations from YouTube public pages) |
| `src/lib/retos.js` | Retos FST helpers: filters, progress, streak, YouTube, WhatsApp |
| `src/components/retos/*` | Retos FST components (Card, Filters, GoalSelector, Progress, Video, Checkin, Completion, NutriFitCTA) |
| `src/components/admin/RetosAdmin.jsx` | Retos FST admin UI (tab in `/admin/academia`) |
| `src/pages/RetosIndex.jsx` | `/academia/retos` catalog |
| `src/pages/RetoDetalle.jsx` | `/academia/retos/:slug` detail |
| `src/pages/RetoDia.jsx` | `/academia/retos/:slug/dia/:dayNumber` day page |
| `Dockerfile` | Frontend/nginx image |
| `Dockerfile.api` | Backend image |
| `docker-compose.yaml` | Coolify stack |
| `nginx.conf` | SPA fallback and API proxy |

## Routing

Frontend:

- `/`
- `/feliz-sin-tiroides`
- `/fst-app/*` (app HealthTech: dashboard, NutriFST, levotiroxina, alimentos, escáner, menús, cocina, lista, suplementos, síntomas, yodo, consulta, progreso, perfil)
- `/academia/retos` (Retos FST catalog)
- `/academia/retos/:slug` (challenge detail)
- `/academia/retos/:slug/dia/:dayNumber` (day page with video + check-in)
- `/atenfarmaclinic`
- `/privacidad`
- `/terminos`
- `/descargo-medico`
- `/afiliados`

Backend:

- `GET /health`
- `GET /api/health`
- `GET /api/health/db`
- `POST /api/create-preference`
- `POST /api/mp-webhook`
- `POST /api/lead-capture`
- `GET /api/list-orders`
- `GET /api/academia/retos`, `/weekly`, `/mine`, `/:slug`
- `POST /api/academia/retos/:slug/join`, `/:slug/checkin`
- `GET/POST/PUT/DELETE /api/admin/academia/retos...` (admin, `ADMIN_TOKEN`)

## Retos FST

- Weekly 7-day movement challenges inside Academia (brand: Feliz Sin Tiroides).
- 12 evergreen collections seeded (Pilates Princess, Booty Bloom, Core Girl, Abs & Booty, Walk & Glow, Strong Girl, Legs & Booty, Low Impact Girl, 10-Minute Girl, Full Body Girl, Dumbbell Girl, Soft Girl Reset).
- Videos are external YouTube resources (URL + `youtube_video_id` only). Never download or re-upload. Player uses `youtube-nocookie.com` embed; cards use `i.ytimg.com` thumbnails (no iframes in lists).
- Progress is per-user in PostgreSQL (`fst_user_challenges` + `fst_challenge_checkins`), keyed to `academia_users.id` (JWT auth, same as Academia). No Supabase tables for retos.
- Weekly challenge = non-evergreen with `start_date`/`end_date`; fallback is `featured` evergreen. Evergreen challenges can start any day.
- `selected_goal` persists in localStorage (`fst_retos_selected_goal`) and is saved server-side on join.
- NutriFit connection: CTA links to `/fst-app/nutrifst?goal=...`; NutriFstChat only shows a context note. NutriFit remains the only nutrition strategy source.
- Admin: `/admin/academia` → tab "Retos FST" (create/edit challenges and days, YouTube URL validation, duplicate, publish/unpublish).
- Analytics events: `challenge_viewed`, `challenge_joined`, `challenge_started`, `challenge_day_viewed`, `challenge_day_completed`, `nutrition_challenge_completed`, `challenge_completed`, `nutrifit_opened_from_challenge`, `challenge_shared`, `challenge_filter_used`.
- Tone rules: no guilt messages, no fat-loss/medical claims, no "cure your thyroid" language. Educational disclaimer links to `/descargo-medico`.

## FST App (NutriFST IA)

- Local knowledge engine (no external LLM): `src/lib/fstApp/nutrifst.js` + `src/data/fstApp/*`.
- Evidence is real and verifiable only (`evidence.js`); never invent references.
- Clinical safety levels: green (educational), yellow (professional review), red (blocked: dose changes, diagnosis, emergencies, lab treatment).
- Demo mode works offline via localStorage. Real mode requires `VITE_FST_APP_REAL_DATA_ENABLED=true` (frontend) and `VIDA360_REAL_DATA_ENABLED=true` (backend).

## Payment Flow

1. User adds products to cart.
2. `CartDrawer` posts to `apiUrl('/api/create-preference')`.
3. Backend validates each `id` against `api/lib/catalog.js`.
4. Browser-submitted prices are ignored.
5. Backend creates Mercado Pago preference.
6. Mercado Pago redirects buyer back to `SITE_URL`.
7. Mercado Pago calls `/api/mp-webhook`.
8. Webhook confirms payment with Mercado Pago API.
9. Approved payment is upserted into PostgreSQL `orders`.
10. If real download links exist, Resend emails them to the buyer.

## Product Id Rule

Product IDs are cross-system keys. Do not change a product `id` unless you also update:

- `src/data/products.js` or `src/data/fst.js`
- `api/lib/catalog.js`
- `api/routes/create-preference.js` download map
- Any external delivery/link process

## Environment Variables

Frontend build-time:

- `VITE_API_URL`: optional. Prefer empty in Coolify so frontend uses `/api` relative.
- `VITE_FST_APP_REAL_DATA_ENABLED`: `true` enables real-data mode for the FST App (default `false`).

Backend runtime:

- `NODE_ENV`
- `PORT`
- `CORS_ORIGINS`
- `SITE_URL`
- `API_URL`
- `DATABASE_URL`
- `MP_ACCESS_TOKEN`
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `NOTIFY_EMAIL`
- `ADMIN_TOKEN`

Never commit real values.

## Deployment Notes

Recommended Coolify setup:

- One Docker Compose application from repo root.
- Compose file: `docker-compose.yaml`.
- Public service: `web`, port `80`.
- Domains on `web`: `edvanta.co`, `www.edvanta.co`.
- `api` is internal only, exposed to `web` on Docker network as `api:3000`.
- Cloudflare A records should point to the Coolify server IP.

Health checks after deploy:

```bash
curl https://edvanta.co/health
curl https://edvanta.co/api/health
curl https://edvanta.co/api/health/db
```

If these return 503, inspect Coolify service status, Traefik labels/domains, web/api logs, database connectivity and Cloudflare origin IP.

## Known Production Gaps

- `api/routes/create-preference.js` still has `PEGA_AQUI_EL_LINK` placeholders unless the owner has replaced them.
- `api/lib/free-guides.js` may have empty URLs.
- `src/config/links.js` may contain placeholder Hotmart/form/social links.
- Mercado Pago webhook signature validation is not implemented.
- Frontend `npm audit` reports Vite/esbuild dev-server advisory; plan a Vite upgrade and test.

## Editing Rules

- Preserve existing files/assets.
- Prefer data edits over component rewrites.
- Keep UI professional, clean and academy-like.
- Avoid emoji-heavy UI.
- Run `npm.cmd run build` after frontend changes.
- Run `node --check` for backend files changed.
- Report remaining production risks clearly.

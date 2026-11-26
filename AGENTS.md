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

SEO de cursos (500 blogs + 30.000 keywords):

```bash
npm.cmd run seo:cursos
```

SEO de vademécum, cursos y comunidades (1.000 artículos):

```bash
npm.cmd run seo:vademecum1000
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
| `src/data/edvanta/contigo.js` | Edvanta Contigo content: six routes, needs, tools, plans, FAQ, professional network state |
| `src/data/edvanta/comunidadWebinars.js` | Community clusters, 26 practical guides and 12 webinars with honest "date to be confirmed" state |
| `src/pages/ComunidadPage.jsx` | `/comunidad` hub: WhatsApp community, topics, webinars and funnel CTAs |
| `src/pages/ComunidadTemas.jsx`, `ComunidadCluster.jsx`, `ComunidadTema.jsx` | `/comunidad/temas` index, area hubs and topic pages |
| `src/pages/WebinarsIndex.jsx`, `WebinarDetalle.jsx` | `/webinars` cycle and session pages with registration CTAs |
| `src/data/articulosComunidadWebinars.js` + `public/articulos/articulos_edvanta/comunidad-farmaceutica/*` | 10 campaign articles (community, webinars, careers, institutions) |
| `src/data/blogCursos500.js` | 500 course-recommendation articles (8 editorial angles per Aula course, 500 total) |
| `public/articulos/articulos_edvanta/cursos-recomendados/*` | 500 markdown articles (minimum 3,000 characters) linked to each course |
| `scripts/generar-blogs-cursos.mjs` | Builds the 500 articles from the real Aula syllabus and writes `blogCursos500.js` |
| `scripts/generar-30000-keywords-cursos.mjs` | Builds 30,000 course keywords, class queries and GEO questions mapped to real URLs |
| `seo/keywords-30000-cursos.csv` | 30,000 keywords for the 63 Aula courses and 500 blogs |
| `seo/plan-30000-keywords-cursos.md` | Campaign plan, funnel, editorial rules and measurement |
| `src/data/vademecumArticulos1000.js` | 1,000 articles: 500 vademécum, 378 course + vademécum, 115 patient communities, 7 hubs |
| `public/articulos/articulos_edvanta/vademecum/*` | 500 vademécum study articles based on the reviewed monographs |
| `public/articulos/articulos_edvanta/cursos-comunidades/*` | 500 course/community articles and hubs |
| `scripts/generar-1000-articulos-vademecum.mjs` | Builds the 1,000 articles from reviewed monographs, Aula courses and communities |
| `scripts/lib/vademecum-1000-datos.mjs` + `vademecum-1000-angulos.mjs` | Course/monograph/community data, angles and content builders |
| `src/__tests__/vademecum-1000-articulos.test.jsx` | 1,000 articles, coverage, links, no dose units, similarity |
| `scripts/generar-30000-keywords-comunidad-webinars.mjs` | Builds the 30,000-keyword CSV, deduped against `seo/*.csv` and mapped to real URLs |
| `seo/keywords-30000-comunidad-webinars.csv` | 30,000 keywords with audience, intent, funnel stage, CTA and destination URL |
| `seo/plan-30000-comunidad-webinars.md` | Campaign plan, funnel map and operating rules |
| `src/pages/contigo/*` | Contigo public pages, Mi cuidado, interest, plans, network and placeholders |
| `src/components/contigo/ContigoPieces.jsx` | Contigo cards, status chips and illustrative Mi cuidado visual |
| `src/styles/contigo.css` | Contigo visual tokens and route-card image crops |
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
| `api/migrations/164-173_*experiencias*.sql` | Generated class experiences for the Edvanta catalog (1,184 classes) |
| `api/migrations/174_videos_catalogo.sql` | Curated YouTube videos for classes without video (32 verified) |
| `api/migrations/176_renombrar_clases_homonimas.sql` | Unique class titles for public SEO pages |
| `api/migrations/177_experiencias_alimentos_quiz.sql` | Quiz, activity and forum in the food-handling course experiences |
| `api/migrations/178_videos_cursos_sin_video.sql` | Unit-level videos for the eight courses that had none |
| `api/migrations/179_ajustes_experiencias.sql` | Grammar and clinical/aseptic/food case-option fixes for generated experiences |
| `scripts/auditar-catalogo-aula.mjs` | Reproducible catalog audit (text, experiences, videos, assessments) |
| `scripts/generar-experiencias-catalogo.mjs` | Builds class experiences from summaries, quizzes, activities and verified links |
| `scripts/curar-videos-aula.mjs` | YouTube search + oEmbed verification for missing class videos |
| `scripts/lib/experiencias-automaticas.mjs` | Pedagogical builder used by the experience generator |
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
- `/contigo` (Edvanta Contigo home)
- `/contigo/rutas`, `/contigo/tiroides`, `/contigo/tiroides/guias`
- `/contigo/:ruta/interes` (interest list for the five future routes)
- `/contigo/planes`, `/contigo/profesionales`, `/contigo/profesionales/:slug`
- `/contigo/servicios/:slug/reservar` (placeholder; no active bookings)
- `/contigo/red-profesional`, `/contigo/red-profesional/postulacion`
- `/mi-cuidado`, `/mi-cuidado/plan`, `/mi-cuidado/suscripcion`
- `/mi-cuidado/medicamentos`, `/laboratorios`, `/consultas/preparar`, `/comunidad` redirect to the real FST tools
- `/profesional/agenda`, `/profesional/pacientes`, `/operacion/contigo` (placeholders)
- `/pacientes` and `/pacientes/tiroides` return 301 to `/contigo` and `/contigo/tiroides` in nginx
- `/academia/retos` (Retos FST catalog)
- `/academia/retos/:slug` (challenge detail)
- `/academia/retos/:slug/dia/:dayNumber` (day page with video + check-in)
- `/comunidad` (community hub for pharmaceutical chemists)
- `/comunidad/temas`, `/comunidad/temas/:cluster`, `/comunidad/temas/:cluster/:tema` (26 practical guides)
- `/webinars`, `/webinars/:slug` (12 sessions; dates to be confirmed, no invented prices)
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

## Edvanta Contigo

- Patient-facing brand that replaces the old `/pacientes` section. The public home is `/contigo`.
- Only the thyroid route (`/contigo/tiroides`) is open. Diabetes, renal, cardiovascular, respiratory and oncology are interest lists.
- Real private tools stay in Feliz Sin Tiroides (`/fst-app`). Mi cuidado links to them and does not duplicate clinical histories.
- Plans, the individual consultation and the professional network are proposals in preparation. Demo prices are labeled; this version does not charge or book.
- No professional profiles are invented. `CONTIGO_PROFESIONALES` stays empty until verified professionals exist.
- Public pages are prerendered in `scripts/prerenderizar-paginas.mjs`; plans, interest, profiles, Mi cuidado and professional/operation placeholders are `noindex`.
- Route-card photos are cropped with CSS so the text baked into the source images is not shown; titles remain real HTML text.

## Blogs de cursos y keywords

- 500 artículos en `public/articulos/articulos_edvanta/cursos-recomendados/`, registrados en `src/data/blogCursos500.js` y publicados en `/articulos/<slug>`.
- 8 ángulos por curso del Aula (59 cursos con 8; 4 con 7 para totalizar 500): guía de estudio, para qué sirve, temario, plan de 30 días, errores, aplicación, preguntas frecuentes y curso o autoaprendizaje.
- Todo el contenido se deriva del inventario real (`docs/auditoria-aula/inventario.json`): unidades, clases, nivel, público y conteos. No se inventan precios, fechas, cupos ni Referencias.
- Cada artículo enlaza su ficha `/curso-de-…` y artículos hermanos. La primera unidad gratis y el certificado se mencionan solo como los declara la ficha.
- `seo/keywords-30000-cursos.csv` contiene 30.000 keywords únicas mapeadas a 500 blogs y 63 fichas; `seo/plan-30000-keywords-cursos.md` explica el embudo y el uso.
- Control reproducible: `src/__tests__/seo-500-blogs-cursos.test.jsx` (500 artículos, mínimo 3.000 caracteres, enlaces reales, similitud, CSV y URLs).
- Los artículos son borradores editoriales generados: revisar antes de una campaña pagada. La similitud media es baja, pero la decisión final de indexar es editorial.

## Vademécum, cursos y comunidades (1.000 artículos)

- 1.000 artículos en `public/articulos/articulos_edvanta/vademecum/` y `cursos-comunidades/`, registrados en `src/data/vademecumArticulos1000.js`.
- Distribución: 500 de vademécum (3 ángulos por cada una de las 152 monografías revisadas + 44 artículos para comunidades), 378 de cursos integrados con vademécum y comunidad, 115 de comunidades de pacientes (5 por cada una de las 23) y 7 hubs.
- Los artículos de vademécum usan las secciones reales de las monografías revisadas. Las cifras de dosis se omiten a propósito y el texto enlaza a `/vademecum/<slug>`; no son una prescripción.
- Los artículos de cursos y comunidades usan las clases reales del Aula, las monografías, los artículos revisados y las reglas de cada comunidad. No se inventan miembros, testimonios, precios ni recomendaciones clínicas.
- Control reproducible: `src/__tests__/vademecum-1000-articulos.test.jsx` (1.000, cobertura, enlaces, mínimo 3.000 caracteres, sin unidades de dosis y similitud).
- Son borradores editoriales generados: revisar antes de una campaña pagada. La fuente clínica es la monografía revisada, no el artículo.

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
- Edvanta Contigo Plus, the individual consultation, bookings and the professional network are not active. They are UI proposals with demo prices and interest forms.
- Contigo does not have its own consent/audit/RLS schema yet; private tools reuse the existing FST/Supabase flow.
- Discord roles and n8n flows described in the product plan are not connected.

## Editing Rules

- Preserve existing files/assets.
- Prefer data edits over component rewrites.
- Keep UI professional, clean and academy-like.
- Avoid emoji-heavy UI.
- Run `npm.cmd run build` after frontend changes.
- Run `node --check` for backend files changed.
- Report remaining production risks clearly.

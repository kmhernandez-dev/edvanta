# Agent Guide

This file is the main context document for coding agents working on this repository. Read it before editing.

## Project Identity

This is a commercial education platform for Karla Hernandez with three connected brands:

- **Biblioteca Profesional KH**: professional learning resources, free course discovery, editable templates, dashboards and career tools.
- **Feliz Sin Tiroides**: thyroid-health education for patients, ebooks, free lead magnets and services.
- **AtenFarmaClinic**: clinical pharmacy education and professional resources.

The business goal is to sell digital resources and capture leads while presenting a professional academy-like experience.

## High-Level Architecture

- React SPA mounted in `src/main.jsx`.
- Routes are declared in `src/App.jsx`.
- Global cart state lives in `src/context/CartContext.jsx`.
- Public content is data-driven from `src/data/*`.
- Shared commercial links live in `src/config/links.js`.
- Server-side integrations live in `netlify/functions/*`.
- Static images live in `public/img`.
- Styling uses Tailwind CSS plus component classes in `src/index.css`.

## Tech Stack

- React 18
- Vite 5
- React Router 7
- Tailwind CSS 3
- Netlify Functions
- Mercado Pago SDK
- Resend API via HTTP

## Commands

Install:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

On Windows PowerShell, if script execution policy blocks npm:

```bash
npm.cmd run build
```

## Important Files

| File | Purpose |
|---|---|
| `src/App.jsx` | Public routes |
| `src/pages/BibliotecaHome.jsx` | Main Biblioteca KH landing/catalog page |
| `src/pages/FelizSinTiroides.jsx` | Patient-facing thyroid brand page |
| `src/pages/AtenFarmaClinic.jsx` | Clinical pharmacy brand page |
| `src/components/CartDrawer.jsx` | Checkout drawer and Mercado Pago start |
| `src/components/PaymentStatus.jsx` | Payment return-state modal |
| `src/context/CartContext.jsx` | Cart reducer, persistence and actions |
| `src/components/HerramientaCard.jsx` | Professional product card with image |
| `src/components/Icon.jsx` | In-house line SVG icon set |
| `src/data/products.js` | Main product catalog |
| `src/data/fst.js` | Feliz Sin Tiroides content |
| `src/data/atenfarma.js` | AtenFarmaClinic products |
| `src/config/links.js` | WhatsApp, Hotmart, email, social links |
| `netlify/functions/create-preference.mjs` | Mercado Pago preference creation |
| `netlify/functions/mp-webhook.mjs` | Payment webhook and download email |
| `netlify/functions/lead-capture.mjs` | Lead form email automation |

## Routing

- `/` -> `BibliotecaHome`
- `/feliz-sin-tiroides` -> `FelizSinTiroides`
- `/atenfarmaclinic` -> `AtenFarmaClinic`
- `/privacidad` -> `LegalPage`
- `/terminos` -> `LegalPage`
- `/descargo-medico` -> `LegalPage`
- `/afiliados` -> `LegalPage`
- `*` -> `BibliotecaHome`

## Data Model Notes

Product-like records usually include:

- `id`: stable product id, also used by cart and webhook metadata.
- `name`: display name.
- `category`: display category.
- `price`: COP integer.
- `comparePrice`: previous price or `null`.
- `image`: optional public image path.
- `formats`: display text for file formats.
- `badge`: optional label.
- `description`, `forWhom`, `problem`: modal/product copy.
- `items`: list of included resources.
- `relatedCourses`: Edutin links.
- `hotmartUrl`: optional external checkout URL.

Do not change an `id` unless you also update:

- Cart assumptions.
- Mercado Pago webhook `DOWNLOADS`.
- Any UI references.
- Any external delivery process.

## Payment Flow

1. `CartContext` stores selected items.
2. `CartDrawer` posts items to `/.netlify/functions/create-preference`.
3. `create-preference.mjs` creates Mercado Pago checkout preference.
4. Mercado Pago redirects user back with status query params.
5. `PaymentStatus.jsx` reads query params and shows success/pending/failure.
6. Mercado Pago calls `mp-webhook.mjs`.
7. `mp-webhook.mjs` confirms payment status with Mercado Pago API.
8. If approved, it sends download links with Resend.

Security note: at the time of writing, `create-preference.mjs` trusts prices sent from the browser. For production hardening, calculate prices server-side from trusted product definitions.

## Environment Variables

Never commit secrets.

Required in Netlify:

- `MP_ACCESS_TOKEN`
- `RESEND_API_KEY`
- `FROM_EMAIL`

Recommended:

- `NOTIFY_EMAIL`

Provided by Netlify:

- `URL`

## Content Editing Rules

- Prefer editing `src/data/*` for copy, prices and catalog changes.
- Prefer editing `src/config/links.js` for external links.
- Keep product ids stable.
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
- `.netlify`
- `.env`
- `.env.local`

These are already listed in `.gitignore`.

## Production Gaps To Watch

- `netlify/functions/mp-webhook.mjs` still contains `PEGA_AQUI_EL_LINK` placeholders unless the owner has replaced them.
- `netlify/functions/lead-capture.mjs` may contain empty free-guide URLs.
- `src/config/links.js` may contain placeholder Hotmart/Form links.
- Webhook idempotency is not implemented.
- Webhook signature validation is not implemented.
- Server-side price verification should be added before serious paid traffic.

## Safe Editing Workflow

1. Inspect relevant files first.
2. Make focused changes only.
3. Do not delete original assets unless explicitly asked.
4. Run `npm.cmd run build` on Windows if regular `npm run build` is blocked.
5. Report changed files and any production risks.

## User Preference

The owner explicitly asked not to delete existing project files because that could damage the app. Preserve existing content and add non-destructive changes whenever possible.


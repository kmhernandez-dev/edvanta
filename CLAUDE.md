# Claude Project Context

This repository powers a React/Vite/Tailwind platform for Karla Hernandez. It has three public brand areas:

- Biblioteca Profesional KH
- Feliz Sin Tiroides
- AtenFarmaClinic

For full instructions, read `AGENTS.md`. This file provides Claude-specific operating context and guardrails.

## Main Goal

Maintain and improve a professional education/commercial website that:

- Recommends free online courses.
- Sells digital kits, ebooks and professional resources.
- Captures leads for free resources.
- Uses Mercado Pago checkout.
- Sends email notifications and download links through Resend.

## Important Commands

```bash
npm install
npm run dev
npm.cmd run build
```

Use `npm.cmd run build` on Windows when PowerShell blocks `npm.ps1`.

## Key Architecture

- `src/App.jsx`: routes.
- `src/pages/*`: page-level brand experiences.
- `src/components/*`: reusable UI.
- `src/context/CartContext.jsx`: global cart.
- `src/data/*`: editable business/content data.
- `src/config/links.js`: commercial links and contact data.
- `netlify/functions/*`: serverless payment/email integrations.
- `public/img`: public visual assets.

## Behavior Rules

- Do not delete existing files or assets without explicit user permission.
- Preserve product ids unless updating all dependent systems.
- Prefer data edits over component rewrites for catalog/content changes.
- Keep the design professional, clean and academy-like.
- Avoid emoji-heavy UI; prefer images and line icons.
- Never expose or commit API keys.
- Treat payment and health-related copy carefully.

## High-Risk Areas

- `netlify/functions/create-preference.mjs`: currently receives item prices from the client. Production hardening should recalculate price server-side.
- `netlify/functions/mp-webhook.mjs`: download links must be completed and idempotency/signature validation may be needed.
- `netlify/functions/lead-capture.mjs`: free-guide URLs may still be empty.
- `src/config/links.js`: may contain placeholder external links.

## Recommended Response Style For Changes

After editing, summarize:

- Files changed.
- What was added or improved.
- Build/test result.
- Any remaining production tasks.


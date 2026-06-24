# Agent Quick Context

Read `AGENTS.md` first. This file exists because some tools/users ask for `agent.md` specifically.

## What This Repo Is

React + Vite + Tailwind SPA for Karla Hernandez:

- Biblioteca Profesional KH
- Feliz Sin Tiroides
- AtenFarmaClinic

It sells digital resources, recommends courses, captures leads and integrates with Mercado Pago + Resend through Netlify Functions.

## Run

```bash
npm install
npm run dev
npm.cmd run build
```

Use `npm.cmd run build` on Windows if PowerShell blocks `npm.ps1`.

## Edit Content Here

- Products: `src/data/products.js`
- Feliz Sin Tiroides: `src/data/fst.js`
- AtenFarmaClinic: `src/data/atenfarma.js`
- Links: `src/config/links.js`
- Legal: `src/data/legal.js`
- Images: `public/img`

## Do Not Delete

Do not delete existing source files, data files, images, or config. Add changes safely and keep backups/old assets unless the user explicitly asks to remove them.

## Production Warnings

- Verify Mercado Pago prices server-side before serious sales.
- Replace `PEGA_AQUI_EL_LINK` in `mp-webhook.mjs`.
- Complete free guide URLs in `lead-capture.mjs`.
- Never commit `.env` or secrets.


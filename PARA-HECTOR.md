# Notas técnicas para el despliegue — Plataforma de Karla Hernández

Hola Héctor 👋. Aquí tienes todo lo necesario para conectar el dominio y dejar los pagos/correos funcionando.

## Stack
- **React 18 + Vite 5 + Tailwind CSS 3 + React Router 7** (SPA).
- **Netlify Functions** (serverless) para Mercado Pago y correos (carpeta `netlify/functions`).
- No hay base de datos. Datos en `src/data/*`.

## Correr en local
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera /dist
```

## Despliegue
- Hoy está en **Netlify**: https://biblioteca-profesional-kh.netlify.app
- `netlify.toml` ya configura el build (`npm run build`, publish `dist`) y las funciones.
- Para el **dominio**: agrégalo en Netlify (Domain settings → Add custom domain) y apunta los DNS. No requiere tocar código.

## ⚠️ Variables de entorno (IMPRESCINDIBLES para pagos y correos)
Configúralas en Netlify → Site configuration → Environment variables.
Karla tiene los valores (ya están puestas en el Netlify actual):

| Variable | Para qué |
|---|---|
| `MP_ACCESS_TOKEN` | Mercado Pago Checkout Pro (Access Token). Hoy está el de **PRUEBA**; cambiar por el de **producción** para cobrar de verdad. |
| `RESEND_API_KEY` | Envío de correos (Resend). |
| `FROM_EMAIL` | Remitente de los correos. Cambiar a `algo@DOMINIO` cuando el dominio esté verificado en resend.com/domains. |
| `NOTIFY_EMAIL` | Correo donde a Karla le llegan los registros/leads. |

> Para enviar correos a clientes (descargas y guías gratis), el **dominio debe verificarse en Resend** (resend.com/domains) y `FROM_EMAIL` usar ese dominio. Sin eso, Resend solo envía al correo del dueño de la cuenta.

## Funciones (backend)
- `netlify/functions/create-preference.mjs` — crea la preferencia de pago de Mercado Pago.
- `netlify/functions/mp-webhook.mjs` — al aprobarse un pago, envía el correo con los **links de descarga**. Edita el objeto `DOWNLOADS` con los links reales de cada archivo.
- `netlify/functions/lead-capture.mjs` — formulario de recursos gratis. Edita `FREE_GUIDES` con los links de las guías.

## Dónde editar contenido (sin tocar lógica)
- Enlaces (WhatsApp, etc.): `src/config/links.js`
- Productos/packs: `src/data/products.js`
- Ebooks Feliz Sin Tiroides: `src/data/fst.js`
- Cursos AtenFarmaClinic: `src/data/atenfarma.js`

## Modelo de venta
- Pago **único** por cada producto (no suscripciones).
- Entrega: el comprador recibe por correo el link de descarga (los archivos se alojan en Drive/Dropbox y se pegan en `DOWNLOADS`).

Cualquier duda, los datos están comentados en cada archivo. ¡Gracias!

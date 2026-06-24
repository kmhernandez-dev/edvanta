# Biblioteca Profesional KH

Plataforma web comercial y educativa para Karla Hernandez. Reune cursos recomendados, herramientas digitales, ebooks, servicios, captacion de leads y pagos online para tres marcas relacionadas:

- **Biblioteca Profesional KH**: cursos gratuitos tipo academia, herramientas editables y kits profesionales para farmacia, salud, calidad, datos y empleabilidad.
- **Feliz Sin Tiroides**: educacion para pacientes, ebooks, recursos gratis, servicios y comunidad de salud tiroidea.
- **AtenFarmaClinic**: formacion y recursos para quimicos farmaceuticos clinicos.

La aplicacion esta construida como una SPA con React, Vite y Tailwind CSS, desplegada en Netlify con funciones serverless para Mercado Pago y Resend.

## Estado Del Proyecto

- Frontend funcional con rutas publicas y carrito global.
- Catalogos definidos en archivos locales dentro de `src/data`.
- Imagenes profesionales en `public/img`.
- Checkout con Mercado Pago mediante Netlify Functions.
- Captura de leads y envio de correos con Resend.
- Paginas legales basicas incluidas.
- Sin base de datos.

## Stack

- React 18
- React Router 7
- Vite 5
- Tailwind CSS 3
- Netlify Functions
- Mercado Pago SDK
- Resend API via `fetch`

## Estructura

```text
.
|-- index.html
|-- package.json
|-- netlify.toml
|-- public/
|   `-- img/                  # Imagenes, mockups, portadas y fotos publicas
|-- netlify/
|   `-- functions/
|       |-- create-preference.mjs
|       |-- mp-webhook.mjs
|       `-- lead-capture.mjs
|-- src/
|   |-- App.jsx               # Rutas principales
|   |-- main.jsx              # Entrada React
|   |-- index.css             # Tailwind + componentes base
|   |-- config/
|   |   `-- links.js          # WhatsApp, Hotmart, correo, redes
|   |-- context/
|   |   `-- CartContext.jsx   # Estado global del carrito
|   |-- data/                 # Catalogos y contenido editable
|   |-- pages/                # Paginas por marca
|   |-- components/           # UI reusable
|   `-- utils/
|       `-- format.js
`-- PARA-HECTOR.md            # Notas tecnicas anteriores para despliegue
```

## Rutas

| Ruta | Descripcion |
|---|---|
| `/` | Biblioteca Profesional KH |
| `/feliz-sin-tiroides` | Marca para pacientes con salud tiroidea |
| `/atenfarmaclinic` | Marca para atencion farmaceutica clinica |
| `/privacidad` | Politica de privacidad |
| `/terminos` | Terminos y condiciones |
| `/descargo-medico` | Descargo medico |
| `/afiliados` | Aviso de afiliados |

## Instalacion Local

```bash
npm install
npm run dev
```

Servidor local por defecto:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

En Windows PowerShell, si `npm run build` falla por politica de ejecucion de scripts, usar:

```bash
npm.cmd run build
```

Para revisar el build:

```bash
npm run preview
```

## Variables De Entorno

Configurar en Netlify: **Site configuration -> Environment variables**.

| Variable | Requerida | Uso |
|---|---:|---|
| `MP_ACCESS_TOKEN` | Si | Token de Mercado Pago para crear preferencias y consultar pagos |
| `RESEND_API_KEY` | Si | API key de Resend para correos |
| `FROM_EMAIL` | Si | Remitente verificado en Resend |
| `NOTIFY_EMAIL` | Recomendado | Correo que recibe nuevos leads |
| `URL` | Netlify | URL del sitio, Netlify la inyecta en produccion |

No subir secretos al repositorio. Los archivos `.env` y `.env.local` ya estan ignorados.

## Funciones Netlify

### `create-preference.mjs`

Crea la preferencia de Mercado Pago y devuelve `init_point` para redirigir al comprador.

Entrada esperada:

```json
{
  "items": [
    {
      "id": "atencion-farmaceutica",
      "name": "Kit de Atencion Farmaceutica Pro",
      "price": 44900,
      "qty": 1
    }
  ]
}
```

Importante: antes de produccion fuerte, conviene que esta funcion recalcule precios desde una fuente confiable del servidor y no desde el navegador.

### `mp-webhook.mjs`

Recibe notificaciones de Mercado Pago. Si el pago esta aprobado, busca los productos comprados en `metadata.product_ids` y envia links por correo.

Pendiente de produccion:

- Reemplazar todos los `PEGA_AQUI_EL_LINK` por links reales.
- Agregar idempotencia si se quiere evitar reenvio de correos ante reintentos.
- Validar firma del webhook si se habilita secret de Mercado Pago.

### `lead-capture.mjs`

Recibe nombre y correo desde el formulario de recursos gratis. Envia una notificacion interna y un correo al visitante.

Pendiente de produccion:

- Completar `FREE_GUIDES` con links reales.
- Usar dominio verificado en Resend para `FROM_EMAIL`.

## Donde Editar Contenido

| Necesidad | Archivo |
|---|---|
| WhatsApp, correo, Hotmart, redes | `src/config/links.js` |
| Productos y herramientas Biblioteca KH | `src/data/products.js` |
| Cursos recomendados | `src/data/courses.js` |
| Contenido Feliz Sin Tiroides | `src/data/fst.js` |
| Cursos/productos AtenFarmaClinic | `src/data/atenfarma.js` |
| Textos legales | `src/data/legal.js` |
| Categorias | `src/data/categories.js` |
| Rutas formativas | `src/data/routes.js` |

## Imagenes

Las imagenes publicas viven en:

```text
public/img
```

Se referencian desde React usando rutas como:

```jsx
<img src="/img/herramienta-farmaceutica.jpg" alt="..." />
```

No mover ni renombrar imagenes sin actualizar las referencias en `src/data/*` o componentes.

## Carrito Y Pagos

El carrito vive en `src/context/CartContext.jsx` y se persiste en `localStorage` con la clave `bpkh_cart_v1`.

Flujo:

1. Usuario agrega un producto.
2. `CartDrawer` envia el carrito a `/.netlify/functions/create-preference`.
3. Netlify Function crea preferencia en Mercado Pago.
4. Usuario paga en Mercado Pago.
5. Mercado Pago redirige al sitio y notifica a `mp-webhook`.
6. `PaymentStatus` muestra estado visual.
7. `mp-webhook` envia links si el pago esta aprobado y los links estan configurados.

## Despliegue En Netlify

`netlify.toml` ya contiene:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"
```

Tambien incluye redirect SPA:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Checklist Antes De Publicar

- [ ] Confirmar dominio personalizado en Netlify.
- [ ] Configurar `MP_ACCESS_TOKEN` de produccion.
- [ ] Verificar dominio en Resend.
- [ ] Configurar `FROM_EMAIL` con dominio verificado.
- [ ] Completar links reales en `DOWNLOADS`.
- [ ] Completar links reales en `FREE_GUIDES`.
- [ ] Revisar `HOTMART_URL`, `LEAD_FORM_URL` e `INSTAGRAM_URL`.
- [ ] Probar compra real de bajo monto.
- [ ] Probar webhook de pago aprobado.
- [ ] Confirmar que los correos llegan a comprador y a Karla.
- [ ] Revisar textos legales y descargo medico.

## Notas Para Colaboradores

- No subir `node_modules`, `dist`, `.netlify`, `.env` ni `.env.local`.
- No poner tokens, claves ni secretos en codigo.
- Mantener el estilo visual profesional, educativo y sobrio.
- Evitar emojis como elementos principales de UI; preferir imagenes, SVGs o iconos lineales.
- Preservar las marcas y rutas existentes.


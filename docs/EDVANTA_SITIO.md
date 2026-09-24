# Edvanta — diseño único y mapa de landing

Guía de cómo está armado edvanta.co después de unificar el diseño y
separar cada proceso en su propia página. **Feliz Sin Tiroides, Vida 360
y AtenFarmaClinic conservan su identidad y no se tocan.**

## 1. Una sola paleta

La identidad de Edvanta es la misma del Aula Edvanta. Vive en dos sitios:

| Dónde | Qué hay |
| --- | --- |
| `tailwind.config.js` → `colors.edvanta` | Los tonos con nombre: `edvanta-blue`, `edvanta-teal`, `edvanta-deep`, `edvanta-light`, `edvanta-border`… |
| `src/index.css` → `:root` y `.edvanta-theme` | Las escalas `navy` y `teal` de Tailwind, servidas por variables CSS |

Las escalas `navy` y `teal` se resuelven con variables (`--c-navy-900`,
`--c-teal-500`…). En `:root` valen lo de siempre, así que las páginas de
las otras marcas no cambian. Dentro de `.edvanta-theme` valen la paleta
Edvanta, y esa clase la aplica `EdvantaTheme` en `src/App.jsx` a todas
las rutas que **no** estén en `OTRAS_MARCAS`.

Consecuencia práctica: para cambiar el color de toda la plataforma se
editan esas variables, no las páginas.

### Colores que significan estado

El ámbar, el verde y el rojo se conservan donde comunican algo:
pendiente, correcto y error. No se reemplazan por color de marca.

## 2. Piezas compartidas

Todas las landing se arman con `src/components/edvanta/ui.jsx`:

- `LandingHero`, `Section`, `SectionHeading`, `Eyebrow`
- `Btn`, `ArrowLink`, `Card`, `NavCard`, `Stat`, `Steps`, `Faq`
- `Breadcrumb`, `CtaBanner`
- `ImageSlot` — el espacio reservado para las fotos

Y con dos piezas de estructura:

- `src/components/edvanta/SiteHeader.jsx` — encabezado único, con
  contexto **Personal** y **Empresas**, buscador, carrito y acceso al aula.
- `src/components/edvanta/SiteFooter.jsx` — pie organizado por proceso.

El mapa de navegación (menús, pie, hubs) está en
`src/config/navEdvanta.js`: una sola fuente para los tres.

### Espacios de imagen

`ImageSlot` muestra un recuadro punteado con la descripción de la foto
que va ahí y el tamaño recomendado. Cuando exista el archivo:

```jsx
<ImageSlot src="/img/empresas/equipo.jpg" alt="Equipo en capacitación" ratio="photo" />
```

Si el archivo no carga, la página no queda rota: se ve el espacio
marcado. Las fotos van en `public/img/`, en una carpeta por tema:
`empleo/`, `talento/`, `empresas/`, `carrera/` y `comunidad/`.

Dos cuidados al colocar una foto:

- La proporción del espacio tiene que ser la de la foto. Las capturas de
  pantalla son 16:9 (`ratio="wide"`); metidas en un `banner` (21:9) se
  les recorta arriba y abajo, y ahí se pierde justo lo que se quería
  mostrar.
- `alt` describe lo que se ve, no repite el título de la sección: es lo
  único que recibe quien usa un lector de pantalla.

Siguen punteados, a la espera de su foto: la comparación «antes y
después» de la hoja de vida, la captura del aula virtual y las fotos de
la portada de Empresas y de Herramientas.

## 3. Mapa de landing por proceso

Cada proceso tiene su página; ninguna mezcla varios.

### Personal

| Proceso | Ruta | Qué resuelve |
| --- | --- | --- |
| Formarme | `/cursos`, `/cursos-gratis`, `/rutas`, `/competencias`, `/aprende` | Catálogo, rutas por cargo y competencias |
| Conseguir empleo | `/empleo` | Mapa del proceso (no lleva herramientas dentro) |
| Hoja de vida | `/hoja-de-vida` | Creador ATS + IA (antes `/empleo#creador`) |
| Escribir a RR. HH. | `/empleo/correos` | Cinco plantillas que se completan con tus datos |
| Buscar vacantes | `/empleo/ofertas-qf` | Ofertas verificadas |
| Que me contacten | `/talento` | Vitrina: perfil básico gratis y destacado de pago |
| Herramientas | `/herramientas` y `/herramientas/:slug` | Una página por herramienta |
| Comunidad | `/comunidad` | Comunidad de químicos farmacéuticos |

### Empresas

| Proceso | Ruta | Qué resuelve |
| --- | --- | --- |
| Portada empresarial | `/empresas` | Propuesta completa y reparto a los procesos |
| Capacitar al equipo | `/empresas/capacitacion` | Aula propia + el mismo catálogo de la parte personal |
| Contratar | `/empresas/talento` | Directorio de talento y publicación de vacantes |
| Entrar al aula | `/aula` | Aula virtual empresarial |

El inicio (`/`) reparte hacia estos caminos con la sección
«¿Qué necesitas hoy?» (`ProcesosSection`).

## 4. Precios

`src/config/precios.js` guarda los precios que se muestran en las
landing. Hoy solo está la vitrina destacada:

```js
export const VITRINA_TALENTO = { usd: 19, meses: 3 };
```

> El valor es **provisional**: hay que confirmarlo antes de promocionarlo.
> Cambiándolo ahí cambia en toda la plataforma.

El cobro se coordina por WhatsApp (se envía el enlace de pago). No hay
pasarela nueva para este servicio.

## 5. Reglas al agregar una landing

1. Un proceso, una página. Si una página necesita dos títulos distintos
   para dos públicos, son dos páginas.
2. Se arma con las piezas de `ui.jsx`; sin colores fijos.
3. Se registra en `src/config/navEdvanta.js` para que aparezca en el
   encabezado y en el pie.
4. Lleva `updatePageSeo` con título, descripción y canónica propias.
5. Deja marcados sus espacios de imagen con `ImageSlot`.
6. Todo botón lleva a algo real. La auditoría rápida:

```bash
node scripts/auditar-enlaces.cjs
```

## 6. Herramientas que viven dentro de las landing

| Herramienta | Componente | Dónde se usa |
| --- | --- | --- |
| Creador de hoja de vida | `src/components/empleo/CvBuilder.jsx` | `/hoja-de-vida` |
| Plantillas de correo | `src/pages/empleo/CorreosRRHH.jsx` | `/empleo/correos` |
| Directorio de talento | `src/components/edvanta/talento.jsx` | `/empresas/talento` |
| Publicar perfil | `src/components/edvanta/talento.jsx` | `/talento` |
| Publicar vacante | `src/components/edvanta/vacantes.jsx` | `/empleo`, `/empresas/talento` |

El creador de hoja de vida guarda un borrador en el navegador
(`edvanta_cv_borrador`) aunque no haya cuenta, y con sesión iniciada
además se autoguarda en el servidor.

> Cuidado al editar `CvBuilder`: los componentes internos (`Panel`) deben
> quedar **fuera** del render. Si se definen dentro, React desmonta el
> formulario en cada pulsación y el campo pierde el foco después de cada
> letra. La prueba `src/__tests__/cv-builder.test.jsx` lo vigila.

## 7. Hoja de vida: cómo funciona por dentro

Todo ocurre en el navegador: el PDF nunca se envía a un servidor.

| Paso | Archivo | Qué hace |
| --- | --- | --- |
| Cargar pdf.js | `src/lib/pdfjs.js` | Una sola carga para el sitio y el visor del aula. Comprueba cómo llega el worker y, si el servidor no lo entrega como JavaScript, lo descarga y lo envuelve en un Blob con el tipo correcto |
| Leer el PDF | `src/lib/cv/pdfText.js` | Reordena el texto por posición (encabezado, cada columna, pie) y cuenta páginas, columnas, imágenes, enlaces y escaneos sin texto |
| Interpretar | `src/lib/cv/lector.js` | Nombre, contacto, secciones, cargos con fechas y logros, años de experiencia, estudios, habilidades e idiomas |
| Diagnosticar | `src/lib/cv/diagnostico.js` | Puntaje en seis categorías, prioridades con cómo corregirlas, palabras clave del cargo y reescritura de frases débiles |
| Generar el PDF | `src/lib/cv/pdf.js` | Diseño oficial Edvanta y formato ATS simple |
| Dibujar los otros 7 | `src/lib/cv/plantillas.js` | Cada diseño en milímetros con jsPDF; se carga solo al generar |
| Listar los diseños | `src/lib/cv/catalogo.js` | Nombre y descripción de cada uno. Aparte a propósito: la galería los lista sin cargar el dibujo |
| Ver cómo queda | `src/lib/cv/vistaPrevia.js` | Genera el PDF y lo dibuja con pdf.js: lo que se ve es el archivo que se descarga |
| Ayudar a escribir | `src/lib/cv/redaccion.js` | Años de experiencia, perfil redactado con los datos reales y sugerencias de logros y habilidades por cargo |

### Los cuatro pasos y la vista previa

La herramienta (`src/components/empleo/CvBuilder.jsx`) abre en **modo
rápido** (`CvExpres.jsx`): cuatro pasos de un minuto cada uno en vez de un
formulario largo. Quien prefiera el formulario completo lo tiene en la
pestaña «Editor completo»; los datos son el mismo objeto.

| Paso | Qué pide | Ayudas |
| --- | --- | --- |
| 1. Tus datos | Nombre, contacto y cargo objetivo | Cargos sugeridos del sector |
| 2. Experiencia | Cargo, empresa y fechas | Mes y año en listas, «Trabajo aquí», un logro por renglón con verbos y ejemplos del cargo |
| 3. Estudios y habilidades | Títulos y competencias | Habilidades del sector con un clic |
| 4. Diseño y descarga | El diseño final | «Escribir mi perfil» con los datos ya cargados y los 9 diseños con miniatura |

La vista previa **no es una versión web del CV**: genera el PDF de verdad y
lo dibuja en un canvas. Dos cosas que cuestan de encontrar si se rompe:

> `page.render()` se llama con `intent: 'print'`. En el modo de pantalla,
> pdf.js dibuja por partes con `requestAnimationFrame`, que el navegador
> detiene cuando la pestaña no está a la vista: la promesa no se resuelve
> nunca y la vista previa se queda en «Preparando…».
>
> Dibujar necesita las fuentes base y los módulos WebAssembly de pdf.js.
> `scripts/preparar-pdfjs.cjs` los copia a `public/pdfjs/` antes de compilar
> y `OPCIONES_DOCUMENTO` los declara en cada `getDocument`. Sin eso, el
> worker avisa «Ensure that the standardFontDataUrl API parameter is
> provided» y no dibuja.

### El worker de pdf.js y nginx

pdf.js procesa los documentos en `pdf.worker.min.mjs`. El navegador solo
acepta ese archivo si llega como JavaScript; la imagen de nginx no trae
el tipo de `.mjs` y lo entregaba como `application/octet-stream`, así que
ningún PDF se podía abrir. `nginx.conf` declara los `.mjs` de `/assets`
como JavaScript y `src/lib/pdfjs.js` cubre el caso en que eso vuelva a
fallar.

> pdf.js recuerda para siempre un worker que falló en la misma página:
> por eso la comprobación se hace **antes** de abrir el primer documento.
>
> El plan B (Blob) no se puede probar con `npm run dev`: Vite le inyecta
> `/@vite/client` a cada archivo JS y dentro de un Blob esa ruta no existe.
> Se prueba con `npm run build` y `npm run preview`.

### Reglas de la plantilla oficial

La plantilla promete que un filtro ATS la lee completa. Para cumplirlo:

- una sola columna de lectura y texto real (nada de texto dentro de imágenes);
- títulos de sección **sin** letras espaciadas (con espaciado, algunos
  lectores leen «E X P E R I E N C I A»);
- viñetas y separadores como caracteres (`•`, `·`), no como figuras dibujadas;
- los metadatos del PDF llevan nombre, cargo y habilidades.

Si se cambia el diseño, hay que volver a subir el PDF generado al
analizador: una hoja de vida bien llenada con la plantilla debe salir en
nivel «Lista para postular».

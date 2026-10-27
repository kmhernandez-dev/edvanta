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

## 3. Arquitectura: escuelas, públicos y empresa

Edvanta es **una sola empresa**. Las escuelas ordenan lo que enseña; los
públicos (profesionales, pacientes, instituciones) son puertas de entrada.
Nada de esto son marcas aparte.

### Dónde viven los datos

Todo sale de `src/data/edvanta/` y las páginas solo lo pintan:

| Archivo | Qué declara |
| --- | --- |
| `escuelas.js` | Las cuatro escuelas, sus áreas con estado real y qué cursos del aula les pertenecen |
| `programas.js` | AtenFarmaClinic, Feliz Sin Tiroides, Edvanta Contigo y sus rutas por condición |
| `productos.js` | Ficha única de cada producto propio (curso en vivo, guías) y los kits leídos de `data/products.js` |
| `servicios.js` | Ofertas y paquetes para instituciones, con necesidad, público, entregables, modalidad y alcance |
| `estados.js` | El vocabulario de estado: disponible, próxima apertura, bajo propuesta, en desarrollo |

Los cursos virtuales propios **no** se copian aquí: salen de la base de
datos (`/api/cursos-edvanta?publico=profesionales|pacientes&area=…`).
`aula_courses.publico` (migración 050) evita que el curso para pacientes
aparezca entre los profesionales.

### Mapa de rutas

| Ruta | Página | Para quién |
| --- | --- | --- |
| `/` | Inicio: qué es Edvanta, tres puertas, curso en vivo, escuelas, guías, instituciones, Karla, contacto | Todos |
| `/escuelas` y `/escuelas/:slug` (`salud`, `calidad`, `regulatorios`, `marketing`) | Una plantilla para las cuatro escuelas | Profesionales |
| `/cursos` | Cursos de Edvanta por escuela + recomendados de otras plataformas, separados | Profesionales |
| `/cursos/en-vivo/:slug` | Ficha del curso en vivo con registro de interés | Profesionales |
| `/curso/:id`, `/cursos/:slug` | Ficha de curso virtual propio o curado (sin cambios) | Profesionales |
| `/guias` | Kits, guías para pacientes, lecturas y herramientas de carrera | Todos, separados |
| `/pacientes` | Edvanta Contigo: rutas por condición y formatos | Pacientes y cuidadores |
| `/pacientes/tiroides` | Ruta de salud tiroidea, puerta a Feliz Sin Tiroides | Pacientes y cuidadores |
| `/instituciones` | Ofertas, cuatro paquetes y solicitud de propuesta | Instituciones |
| `/sobre-edvanta`, `/contacto` | La empresa y sus canales | Todos |
| `/aula` | Aula virtual (incluye `/aula/admin/solicitudes`) | Participantes y administración |

Siguen funcionando, fuera del menú principal (en «Guías y recursos» y en
el pie): `/hoja-de-vida`, `/empleo`, `/talento`, `/carreras`, `/rutas`,
`/competencias`, `/oportunidades`, `/proyectos`, `/certificaciones`,
`/conecta`, `/emprendimientos`, `/herramientas`, `/comunidad`,
`/empresas/talento`.

### Redirecciones

| Antes | Ahora | Dónde |
| --- | --- | --- |
| `/empresas` | `/instituciones` | 301 en `nginx.conf` + `Navigate` en `App.jsx` |
| `/empresas/capacitacion` | `/instituciones#equipo-que-cuida` | Igual |
| `/aprende` | `/escuelas` | Igual |
| `/cursos-gratis/:id` | Ficha del curso | `CursoGratisRedirige.jsx` (sin cambios) |

### Formularios

`src/components/formularios/FormularioSolicitud.jsx` sirve para registrar
interés, pedir una propuesta o escribir a Edvanta. Envía a
`POST /api/aula/solicitudes` (migración 051), que guarda la fila y, si
`NOTIFY_EMAIL` está configurado, avisa por correo. Solo dice «recibido»
cuando el servidor respondió 201; si falla, ofrece WhatsApp. Se atienden
en `/aula/admin/solicitudes`.

### Lo que falta y qué lo desbloquea

| Pendiente | Qué hace falta |
| --- | --- |
| Fecha, valor y cupos del curso en vivo | Decisión comercial → `fechaInicio`, `precio`, `cupos` en `productos.js` |
| Inscripción y pago del curso en vivo | Decidir el canal de cobro (Mercado Pago ya integrado o enlace externo) |
| Aviso por correo de cada solicitud | Variable `NOTIFY_EMAIL` en el servicio de la API (Coolify) |
| Entrega automática de los kits pagados | Enlaces reales en `DOWNLOADS` de `api/routes/create-preference.js` (hoy `PEGA_AQUI_EL_LINK`; la entrega es manual por WhatsApp) |
| Versión y fecha de revisión de la guía de levotiroxina | Los datos del PDF → `version` y `fechaRevision` en `productos.js` |
| Escuela de Marketing | Primer curso o recurso publicado |
| Rutas Contigo distintas de tiroides | Contenido de cada ruta; hoy solo registran interés |
| Subpáginas `/feliz-sin-tiroides/*` | No tienen ruta y dan 404 desde el pie de Feliz Sin Tiroides; decisión de esa marca (no se tocó) |

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

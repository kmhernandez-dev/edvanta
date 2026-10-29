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
| `/curso-de-operacion-segura-del-servicio-farmaceutico` | Ficha del curso en vivo con registro de interés | Profesionales |
| `/curso-de-<nombre-del-curso>` | Ficha de curso virtual propio o de otra plataforma (las direcciones viejas `/curso/:id` y `/cursos/:slug` redirigen) | Profesionales |
| `/articulos/categoria/:slug` | Los artículos de una categoría | Todos |
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
| `/empresas/capacitacion` | `/instituciones/paquetes/equipo-que-cuida` | Igual |
| `/aprende` | `/escuelas` | Igual |
| `/curso/:id`, `/cursos/:slug`, `/cursos-gratis/:código` | `/curso-de-…` (la ficha) | 301 de la API (tabla `public_slugs`) |
| Herramientas, competencias y curso en vivo renombrados, `/cursos-gratis` | Su dirección en español | 301 en `nginx.conf`, listados en `src/data/edvanta/direcciones.js` |
| `/articulos?categoria=…` | `/articulos/categoria/…` | 301 de la API |

La tabla completa, las reglas de los slugs y cómo se mantienen están en
[`URLS_PUBLICAS.md`](URLS_PUBLICAS.md). Las redirecciones no se borran.

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
6. Su dirección describe lo que hay, en español, en minúsculas y con
   guiones. Si una dirección publicada cambia, la vieja lleva su 301
   ([`URLS_PUBLICAS.md`](URLS_PUBLICAS.md), sección 3).
7. Todo botón lleva a algo real. La auditoría rápida:

```bash
node scripts/auditar-enlaces.cjs
```

## 6. Herramientas que viven dentro de las landing

| Herramienta | Componente | Dónde se usa |
| --- | --- | --- |
| Hoja de vida (la herramienta sola) | `src/components/empleo/EditorHojaDeVida.jsx` | `/hoja-de-vida/crear` (la landing es `/hoja-de-vida`) |
| Plantillas de correo | `src/pages/empleo/CorreosRRHH.jsx` | `/empleo/correos` |
| Directorio de talento | `src/components/edvanta/talento.jsx` | `/empresas/talento` |
| Publicar perfil | `src/components/edvanta/talento.jsx` | `/talento` |
| Publicar vacante | `src/components/edvanta/vacantes.jsx` | `/empleo`, `/empresas/talento` |

El creador de hoja de vida guarda un borrador en el navegador
(`edvanta_cv_borrador`) aunque no haya cuenta, y con sesión iniciada
además se autoguarda en el servidor.

> Cuidado al editar el editor: los componentes internos deben quedar
> **fuera** del render. Si se definen dentro, React desmonta el
> formulario en cada pulsación y el campo pierde el foco después de cada
> letra. La prueba `src/__tests__/cv-builder.test.jsx` lo vigila.

## 7. Hoja de vida: cómo funciona por dentro

La landing `/hoja-de-vida` solo explica y muestra los diseños; cada botón
lleva a `/hoja-de-vida/crear` (con `?diseno=<id>` si la persona tocó uno).
La herramienta tiene su propia barra y tres momentos: **inicio** (subir la
hoja anterior en PDF o Word, o empezar de cero), **lectura** y **editor**
(cinco pasos a la izquierda, el PDF real y el puntaje a la derecha).

El archivo se lee en el navegador. Si la IA está configurada, solo el
**texto** viaja al servidor para que Claude lo ordene y lo califique; no
se guarda.

| Paso | Archivo | Qué hace |
| --- | --- | --- |
| Cargar pdf.js | `src/lib/pdfjs.js` | Una sola carga para el sitio y el visor del aula. Comprueba cómo llega el worker y, si el servidor no lo entrega como JavaScript, lo descarga y lo envuelve en un Blob con el tipo correcto |
| Leer el PDF | `src/lib/cv/pdfText.js` | Reordena el texto por posición y cuenta páginas, columnas, imágenes, enlaces y escaneos sin texto (ver «Orden de lectura») |
| Leer el Word | `src/lib/cv/docx.js` | Abre el .docx con fflate y saca el texto de `word/document.xml` y los encabezados. El .doc antiguo se rechaza con un mensaje claro |
| Interpretar | `src/lib/cv/lector.js` | Nombre, contacto, secciones, cargos con fechas y logros, años de experiencia, estudios, habilidades e idiomas |
| Diagnosticar | `src/lib/cv/diagnostico.js` | Puntaje en seis categorías, prioridades con cómo corregirlas, palabras clave del cargo y reescritura de frases débiles |
| Unir todo | `src/lib/cv/revision.js` | `leerArchivoCv`, `textoPlano`, la revisión local del editor y el cliente de la revisión con IA |
| Revisar con IA | `api/lib/cv-ia.js`, `api/routes/cv-ia.js` | `POST /api/cv-ia/revisar`: Claude extrae los datos y califica con la misma rúbrica. El total lo suma el servidor |
| Generar el PDF | `src/lib/cv/pdf.js` | Datos normalizados, metadatos y hoja tamaño carta |
| Dibujar los 10 diseños | `src/lib/cv/plantillas.js` | Los diseños de «Hojas de vida · Edvanta» en jsPDF; se carga solo al generar |
| Listar los diseños | `src/lib/cv/catalogo.js` | Nombre, descripción y equivalencias de los diseños anteriores. Aparte a propósito: la galería los lista sin cargar el dibujo |
| Ver cómo queda | `src/lib/cv/vistaPrevia.js` | Genera el PDF y lo dibuja con pdf.js: lo que se ve es el archivo que se descarga |
| Ayudar a escribir | `src/lib/cv/redaccion.js` | Años de experiencia, perfil redactado con los datos reales y sugerencias de logros y habilidades por cargo |

### La revisión con IA

- La clave va **solo** en el servidor: `ANTHROPIC_API_KEY` en Coolify
  (servicio de la API). Sin clave, `GET /api/cv-ia/estado` responde
  `disponible: false` y la herramienta usa el analizador local sin avisar
  de errores.
- Modelo `claude-opus-5-5` con salida estructurada (JSON Schema). El
  modelo propone los puntos de cada categoría; el servidor los recorta al
  máximo de cada una y suma el total.
- No se inventan datos: las reescrituras dejan entre [corchetes] las cifras
  que la persona debe completar.
- Límites: 8 revisiones por hora por IP sin sesión, 30 con sesión y un tope
  diario total (`CV_IA_TOPE_DIARIO`, 400 por defecto).

### Los diez diseños

`corporativo` (predeterminado), `tradicional`, `columna-derecha` (foto),
`modular`, `funcional`, `clasico`, `barra-lateral` (foto), `moderno` (foto),
`linea-tiempo` y `ejecutivo`. Los nombres de los diseños anteriores
(`edvanta`, `ats`, `ejecutiva`…) se traducen al equivalente con
`normalizarEstilo`, así los borradores viejos siguen abriendo.

Las cifras del diseño modular salen de los datos (años desde el primer
cargo, número de cargos, certificaciones); sus etiquetas no pueden ser un
nombre de sección, porque el lector las tomaría como título.

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

### Orden de lectura

`ordenarPagina` (en `pdfText.js`) arma el texto como lo leería un filtro:

1. Lo que está por encima del primer título de sección (nombre, cargo,
   contacto) es el encabezado, esté a la izquierda o a la derecha.
2. Las franjas a todo lo ancho cortan la página en zonas; en cada zona va
   primero la columna con más texto (la principal) y después la lateral.
3. Dentro de una línea, un hueco grande separa dos textos (una etiqueta y
   su contenido, una columna de fechas): cada uno sale en su línea.

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

### Reglas de los diseños

Cada diseño promete que un filtro ATS lo lee completo. Para cumplirlo:

- texto real (nada de texto dentro de imágenes) y la columna principal
  escrita antes que la lateral;
- nada de bloques lado a lado que mezclen dos secciones (habilidades e
  idiomas van uno debajo del otro en los diseños de una columna);
- un rango de fechas nunca se parte en dos líneas: la columna de fechas se
  ensancha lo justo;
- sin foto, los diseños con foto dibujan una silueta, nunca iniciales
  (se leerían como texto);
- títulos de sección **sin** letras espaciadas (con espaciado, algunos
  lectores leen «E X P E R I E N C I A»);
- viñetas y separadores como caracteres (`•`, `·`), no como figuras dibujadas;
- los metadatos del PDF llevan nombre, cargo y habilidades.

Si se cambia un diseño, hay que volver a subir el PDF generado al
analizador: la hoja de ejemplo (`src/lib/cv/ejemplo.js`) debe leerse
completa (nombre, título, contacto, perfil, dos cargos con fechas y tres
logros, dos estudios, habilidades e idiomas) y salir en nivel «Lista para
postular». Con los diez diseños sale entre 87 y 91.

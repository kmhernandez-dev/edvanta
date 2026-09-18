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
marcado. Las fotos van en `public/img/`.

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

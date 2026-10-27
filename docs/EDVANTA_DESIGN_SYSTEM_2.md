# Edvanta Design System 2.0

Sistema visual único para edvanta.co y el Aula. Implementado el 27-oct-2026.

## Dónde vive

| Pieza | Archivo |
|---|---|
| Tokens, botones, superficies, tarjetas, estados, diagramas y movimiento | `src/styles/edvanta-ds.css` (se importa en `src/main.jsx`) |
| Componentes React (Btn y botones con nombre, Section, Card, Steps, NavCard, LandingHero…) | `src/components/edvanta/ui.jsx` |
| Biblioteca de héroes A–H | `src/components/edvanta/heroes.jsx` |
| Tarjetas de oferta (escuelas, áreas, productos, paquetes) | `src/components/edvanta/oferta.jsx` |
| Tokens del Aula (mismos valores) | `src/aula/aula.css` |
| Colores de Tailwind (`edvanta-*`) | `tailwind.config.js` |

Todo vive dentro de `.edvanta-theme` y `.aula-root`: **Feliz Sin Tiroides, AtenFarmaClinic, Vida 360 y Academia no cambian.**

## Tokens

| Token | Valor | Uso |
|---|---|---|
| `--ds-navy` | `#082E86` | Azul institucional: títulos, botón principal |
| `--ds-navy-hover` | `#0A3AA6` | Hover del botón principal |
| `--ds-navy-deep` | `#031D5C` | Azul del manual: bandas y fondos profundos |
| `--ds-teal` / `--ds-teal-strong` | `#25A7B0` / `#0F7480` | Turquesa de marca / turquesa para texto (AA) |
| `--ds-aqua` | `#DDF3F2` | Superficie aqua |
| `--ds-violet` / `--ds-lavender` | `#8981CE` / `#EEE8FC` | Lavanda |
| `--ds-text` / `--ds-text-2` / `--ds-text-3` | `#14233F` / `#4A5A73` / `#66738A` | Texto principal, secundario (7:1) y metadatos (4,7:1) |
| `--ds-line` / `--ds-line-strong` | `#E3E9F2` / `#C9D4E6` | Bordes |
| Radios | 8 · 10 · 14 · 20 · 28 px | `--ds-r-xs` … `--ds-r-xl` |
| Sombras | `--ds-sh-xs`, `-sm`, `-md`, `-lg`, `-btn` | Elevación progresiva |
| Movimiento | 140 / 220 / 420 ms, `cubic-bezier(.2,.7,.2,1)` | `--ds-dur-*`, `--ds-ease` |
| Tipografía | Manrope (títulos) + Inter (lectura) | `--ds-fs-display`, `--ds-fs-h2`, `--ds-fs-lead` |

Se mantuvieron Manrope e Inter (ya eran la identidad del canvas) en lugar de Montserrat, y los colores oficiales existentes en lugar de la paleta de referencia del brief. El gris de texto secundario se oscureció de `#65718A` a `#4A5A73`, porque el anterior quedaba claro sobre fondos tintados.

## Botones

Un solo botón (`.ed-btn`) con variantes. Altura 46 px (40 en `sm`, 54 en `lg`), radio 14 px, elevación de 1 px al pasar, compresión al hacer clic, anillo de foco turquesa, y estados `disabled` y `aria-busy`.

| Componente | Variante | Cuándo |
|---|---|---|
| `PrimaryButton` / `<Btn>` | `primary` | Acción principal |
| `ActionButton` | `gradient` | La acción destacada de la pantalla (una sola) |
| `SecondaryButton` | `secondary` | Alternativa a la principal |
| `OutlineButton` | `outline` | Acción secundaria sobre superficies tintadas |
| `GhostButton` | `ghost` | Acciones terciarias en barras |
| `LinkButton` | `link` | Navegación con forma de acción |
| `IconButton` | `iconOnly` | Solo ícono; `label` obligatorio |
| `LoadingButton` | `loading` | Envíos en curso |
| `<Btn variant="teal">` | `teal` | Acciones para pacientes |
| `<Btn variant="white">` / `outline-white` | — | Sobre azul profundo |

Las clases heredadas (`btn-edvanta`, `btn-primary`, `btn-secondary`, `btn-teal`, `btn-outline-teal`) toman color, forma y sombra del sistema dentro de `.edvanta-theme`, sin forzar su tamaño. Se reemplazaron 71 botones armados a mano por `ed-btn`, y 614 colores sueltos (`slate`, `teal-700`…) pasaron a los tokens de marca.

## Superficies

`white` · `ice` · `glow` (blanco con luz periférica) · `aqua` · `lavender` · `diagonal` · `navy`. Se pasan como `<Section tone="…">`. Se alternan según el contenido, y ningún degradado cubre la página entera.

## Tarjetas y piezas

- `.ds-card`: con agrupación o interacción. `.ds-card--interactive` se eleva al pasar. `.ds-card--glass` va sobre fotos.
- `.ds-photo`: foto con marco de marca.
- `.ds-icon-tile` (azul, `--teal`, `--violet`), `.ds-chip`.
- `.ds-skeleton` (carga), `.ds-progress` y `.ds-ring` (avance animado).
- `.ds-flow` / `<Steps>`: diagrama de proceso. Vertical en móvil y horizontal en escritorio; acepta `icon` por paso.

## Héroes (heroes.jsx)

| Héroe | Composición | Páginas |
|---|---|---|
| A · `HeroEditorial` | Texto + foto, accesos flotantes, franja de rasgos | `/escuelas/:slug` |
| B · `HeroInmersivo` | Foto amplia con zona de lectura protegida | `/pacientes/tiroides` |
| C · `HeroCientifico` | Foto con red molecular e insignias | `/escuelas`, `/sobre-edvanta` |
| D · `HeroRuta` | El recorrido dibujado | `/cursos`, `/rutas`, `/competencias`, `/carreras`, `/vocacion` |
| E · `HeroCorporativo` | Foto, pila de servicios y franja de sectores | `/instituciones` |
| F · `HeroPaciente` | Foto humana en forma suave, nota y temas | `/pacientes` |
| G · `HeroPlataforma` / `Portatil` | La herramienta real dentro de un portátil | `/guias`, `/herramientas` |
| H · `HeroCurso` | Curso con datos, foto y lo que incluye | `/cursos/en-vivo/:slug`; `/curso/:id` con la tarjeta de inscripción fija |
| Inicio (`components/Hero.jsx`) | Titular animado + foto + selector de público + rasgos | `/` |
| `LandingHero` 2.0 | Héroe de servicio con la misma tipografía y luz periférica | Empleo, Hoja de vida, Ofertas QF, Talento, Correos RR. HH., Empresas/Talento, Legal |

## Aula

- `CourseOverview`:
  - cabecera compacta con anillo de avance y la próxima clase;
  - temario en módulos que se abren y cierran, con el módulo actual abierto y la clase siguiente marcada;
  - la descripción larga queda plegada.
- `CoursePlayer`:
  - línea de avance de marca bajo la barra superior;
  - cabecera de la clase con chips;
  - «Clase anterior» y «Siguiente clase» como tarjetas;
  - clase actual marcada en el índice.
- `Button` del aula con la misma forma, sombra y foco del sitio. `PageHeader` lleva el filo de marca.
- **Sin cambios de lógica:** finalización, seguimiento de video, evaluaciones e inscripción quedan como estaban.

## Accesibilidad y movimiento

- Contraste:
  - textos secundarios con 7:1;
  - metadatos con 4,7:1;
  - turquesa de texto `#0F7480`.
- Foco visible con anillo turquesa. Los destinos de foco programático (`tabindex="-1"`) no pintan contorno.
- Imágenes de Contigo con texto incorporado: `alt=""` y el título en `sr-only`, para no leerlo dos veces.
- Movimiento: aparición `ds-rise`, flotación lenta en la red molecular y transiciones de 140–420 ms. Todo se desactiva con `prefers-reduced-motion`.

## Manifiesto de imágenes

| Ruta / ubicación | Estado | Nota |
|---|---|---|
| `/img/contigo/*` (9) | Adecuada | Rutas y formatos de Edvanta Contigo, entregadas el 27-oct-2026 |
| `/img/publicos/*`, `/img/escuelas/*`, `/img/servicios/*`, `/img/fotos/*` | Adecuada | Fotografía realista de marca |
| `/img/cursos/farmacoterapia-*` | Adecuada (ilustración) | Portadas con degradado. Se pueden cambiar por fotos si se entregan |
| Huecos de Herramientas, Hoja de vida y Vocación | Reemplazados | Portátil con herramientas reales, comparación de formato «antes / después» y diagrama del test |
| `/img/enfermedades/*.jpg` (9) | No existe | Son de Feliz Sin Tiroides (fuera de alcance); la página no queda rota, pero faltan las fotos |
| Fotos de las maquetas del brief | No se usaron | Traían cifras sin respaldo («+10.000 profesionales», «+200 instituciones») |

## Matriz de cobertura

**Leyenda:**
- **Completa:** héroe propio, componentes del sistema y verificación en 390, 768 y 1280 px sin desborde ni errores.
- **Sistema aplicado:** botones, colores y superficies unificados, héroe de marca genérico y verificación en 390 px.
- **Fuera de alcance:** otra marca, por instrucción.

| Ruta | Audiencia | Tipo | Héroe | Componentes | Responsive | Pruebas | Estado |
|---|---|---|---|---|---|---|---|
| `/` | Todas | A | Inicio | Paneles de público, curso destacado, escuelas, recorrido, paquetes | 390/768/1280 | Navegador + build | Completa |
| `/escuelas` | Profesionales | A | C | Tarjetas de escuela, mapa de áreas | 390/768/1280 | Navegador | Completa |
| `/escuelas/:slug` | Profesionales | A | A | Rasgos reales, áreas, productos | 390/768/1280 | Navegador | Completa |
| `/cursos` (+ proveedores) | Profesionales | A | D | Carruseles por escuela | 390/1280 | Navegador | Completa |
| `/curso/:id`, `/cursos/:slug` | Profesionales | A | H | Tarjeta fija, «Cómo funciona», temario, certificado | 390/768/1280 | Navegador | Completa |
| `/cursos/en-vivo/:slug` | Profesionales | A | H | Cronograma, docente, registro | 390/1280 | Navegador | Completa |
| `/rutas`, `/competencias`, `/carreras` | Profesionales | A | D | Diagrama de recorrido | 390 | Navegador | Completa |
| `/vocacion` | Profesionales | A | D | Test intacto | 390/768/1280 | Navegador | Completa |
| `/guias` | Todas | A | G | Kits reales en el portátil | 390/1280 | Navegador | Completa |
| `/herramientas`, `/hoja-de-vida` | Profesionales | A | LandingHero + G / diagrama | Portátil, «antes / después» | 390/768/1280 | Navegador | Completa |
| `/pacientes` | Pacientes | B | F | 9 imágenes de Contigo, «es / no es» | 390/768/1280 | Navegador | Completa |
| `/pacientes/tiroides` | Pacientes | B | B | Guías, temas | 390/1280 | Navegador | Completa |
| `/instituciones` | Instituciones | C | E | Necesidad → paquete, proceso, paquetes | 390/768/1280 | Navegador | Completa |
| `/sobre-edvanta` | Todas | C | C | Principios numerados | 390/1280 | Navegador | Completa |
| `/contacto` | Todas | C | Formulario en el primer pantallazo | Canales, atajos | 390/1280 | Navegador | Completa |
| `/articulos`, `/articulos/:slug` | Todas | A/B | Editorial existente | Botones y colores | 390 | Navegador + prerender | Sistema aplicado |
| `/empleo`, `/empleo/ofertas-qf`, `/empleo/correos`, `/talento`, `/empresas/talento`, `/practicas`, `/noticias`, `/linkedin`, `/emprendimientos`, `/comunidad` | Profesionales | A | LandingHero 2.0 | Botones y colores | 390 | Navegador | Sistema aplicado |
| `/conecta`, `/oportunidades`, `/proyectos`, `/certificaciones`, `/recursos`, `/buscar`, `/cuenta`, `/app/perfil`, `/diagnostico` | Profesionales | A | Degradado de marca | Botones y colores | 390 | Navegador | Sistema aplicado |
| `/rutas/:slug`, `/competencias/:slug`, `/carreras/:slug`, `/herramientas/:slug` | Profesionales | A | Degradado de marca | Botones y colores | Sin verificar con datos | Build | Sistema aplicado |
| `/tratamiento-de-datos`, `/descargo-medico`, 404 | Todas | — | LandingHero 2.0 | — | 390 | Navegador | Sistema aplicado |
| `/aula`, `/aula/curso/:id`, clase, vista previa | Estudiantes | LMS | Cabecera compacta | Anillo, módulos plegables, navegación por tarjetas | 390 | Servidor local + navegador | Completa (portada y clase) |
| `/aula/admin/*` | Administración | Interno | — | `Button` y tokens del aula | — | Pruebas API | Sistema aplicado |
| `/admin/*` (paneles) | Interno | — | — | Sin cambios de diseño | — | — | Pendiente |
| `/feliz-sin-tiroides`, `/nutrifst`, `/recetas`, `/recurso/levotiroxina`, `/enfermedades/*`, `/academia/*`, `/vida-360-pro*`, `/atenfarmaclinic*` | Otras marcas | — | — | — | — | — | Fuera de alcance |

## Pendiente

- Héroes propios para las páginas marcadas como «Sistema aplicado» (empleo, talento, conecta, artículos…). Hoy usan el héroe de marca genérico.
- Paneles internos `/admin/*`.
- Fotos de `/img/enfermedades/*` (Feliz Sin Tiroides).
- Verificación de `/rutas/:slug`, `/competencias/:slug` y `/carreras/:slug` con datos reales en producción.

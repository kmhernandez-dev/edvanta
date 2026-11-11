# Prompt maestro: Edvanta Design System 3.0

**Uso:** antes de usarlo, llena la sección «Decisiones de Karla». Luego copia todo desde «Rol» hasta el final y pégalo en una sesión nueva de Claude Code abierta en la carpeta `biblioteca-profesional-kh`. Pide una fase a la vez y revisa las capturas antes de pasar a la siguiente.

---

## Decisiones de Karla (llenar antes de pegar)

| # | Decisión | Opciones | Valor elegido |
|---|---|---|---|
| D1 | Letra de los titulares | **A)** Mantener Manrope y solo ordenar pesos y tamaños (menor riesgo). **B)** Titulares en una serif editorial (por ejemplo Newsreader o Source Serif 4) con Inter para leer: más autoridad y más distinta en educación en salud. **C)** Otra que yo indique. | ___ |
| D2 | Fotos de personas | **A)** Tengo o voy a tomar fotos reales (equipo, farmacias, laboratorios de Colombia). **B)** Mientras llegan, no usar fotos de personas: objetos, espacios y texturas reales. **C)** Mantener las actuales hasta tener las nuevas. | ___ |
| D3 | Acento por público | **A)** Profesionales azul, pacientes turquesa con un acento cálido nuevo, instituciones violeta. **B)** Un solo acento para todo. | ___ |
| D4 | Publicación | **A)** Desplegar cada fase cuando pase sus criterios. **B)** Mostrarme capturas y esperar mi aprobación antes de cada push. | ___ |

Si una casilla queda vacía, usa la primera opción de esa fila, salvo en D4: si está vacía, usa la opción B.

---

## Rol

Eres el director de diseño y el ingeniero de frontend de **edvanta.co**: educación farmacéutica para profesionales, pacientes e instituciones en Colombia. Tu objetivo es pasar del Edvanta Design System 2.0 (correcto pero genérico) a un sistema 3.0 con **voz propia**, sin romper ninguna funcionalidad.

Trabajas para **Karla Hernández**, química farmacéutica, dueña y autora. Las decisiones de marca son de ella; las que no estén en la tabla de arriba, pregúntalas antes de ejecutarlas.

## Contexto técnico

- React + Vite + Tailwind; API Express + PostgreSQL. Despliegue en Coolify al hacer push a `main`. El repositorio es **público**: nunca subas claves.
- Sistema actual:

| Archivo | Contenido |
|---|---|
| `src/styles/edvanta-ds.css` | Variables `--ds-*`, `.ed-btn`, superficies, tarjetas, progreso, diagramas |
| `src/components/edvanta/ui.jsx` | Botones, `Section`, `Card`, `Steps`, `LandingHero` |
| `src/components/edvanta/heroes.jsx` | Héroes A–H |
| `src/components/edvanta/catalogo.jsx` | Filas, tarjetas y portadas de los inicios |
| `src/aula/aula.css` | Valores del aula |
| `tailwind.config.js` | Colores `edvanta-*` y familias de letra |
| `index.html` y `public/404.html` | Carga de fuentes |
| `docs/EDVANTA_DESIGN_SYSTEM_2.md` | Documentación y matriz de cobertura |

- Otra sesión puede estar trabajando en el mismo repositorio: haz commit **solo de tus archivos**, nunca cambies de rama y no incluyas `seo/auditoria.md`, `seo/roadmap-90-dias.md` ni nada de `contenido/`.

## Diagnóstico de partida (medido en vivo el 11-nov-2026)

**Calificación:** 6,5/10. Técnica 8, accesibilidad 8, identidad 4,5, imágenes 4.

Medidas del inicio en escritorio (1366 px):

| Medida | Valor actual | Problema |
|---|---|---|
| Pesos de letra en textos | 304 en 700, 212 en 600, 132 en 800, **77 en 400** | Todo en negrilla: no hay jerarquía |
| Tamaño más usado | **12 px** (286), 10,88 px (102), 11 px (100) | Letra demasiado pequeña |
| Tamaños distintos | **15** (incluye 10,88, 13,5, 15,5 y 54,4 px) | No hay escala |
| Radios distintos | **10** (sobran 4, 12 y 24 px; hay 999 y 9999 px) | Valores fuera del sistema |
| Colores de texto | 18; tres azules casi negros: `#14233F`, `#17223B`, `#1F2937` | Valores sueltos |
| Fondo fuera del sistema | `#EEF5FA` en 90 elementos | Valor suelto |
| Familias en uso | Inter 2.718 elementos, Manrope 147 | El sitio se lee como «Inter en negrilla» |
| Fuentes descargadas | Inter, Manrope, Fraunces (solo la usan el diploma, `AcademiaLinkModal` y `NotFound`) y Patrick Hand (**sin uso**) | Peso de carga innecesario |
| Alto del inicio | 8.461 px de filas de catálogo iguales | Ritmo monótono |

Hallazgos visuales:

1. **Héroe de plantilla:** degradado lavanda→aqua, palabra en texto degradado, otra subrayada con trazo, foto redondeada y tarjetas de vidrio flotando. El inicio y `/instituciones` tienen la misma composición.
2. **La foto del inicio parece de banco o generada:** carnés ilegibles y nada que diga Colombia ni farmacia real.
3. **Las portadas mezclan tres estilos:**
   - íconos 3D brillantes (farmacoterapia);
   - fotos de banco muy parecidas entre sí;
   - bloques oscuros generados (Contigo).
4. **Las portadas de pacientes son oscuras y pesadas** para un público al que hay que dar calma.
5. **Profesionales, Pacientes e Instituciones aparece dos veces** en el inicio: en la franja superior y en las tres fichas bajo la foto.
6. **En celular, el párrafo del héroe va centrado** y ocupa seis líneas.
7. **El arco del logo no se usa en ningún lado**, y el logo (fino) no conversa con la interfaz (muy pesada).
8. **La pestaña de las fichas dice «… gratis»** aunque el certificado cuesta COP 60.000.

## Dirección del 3.0

**Idea central:** Edvanta es rigor farmacéutico con calidez humana. La marca se reconoce por **el arco del logo** convertido en recurso visual, **fotos reales** de la farmacia colombiana, **tipografía editorial con jerarquía** y **mucho aire**. Menos degradados, menos negrilla, menos tarjetas iguales.

Referentes (no copiar, aprender el principio):

| Referente | Principio que se toma |
|---|---|
| Duolingo | Un recurso propio que se repite en todo |
| Brilliant | La ilustración explica el tema |
| Headspace | Calma y aire para pacientes |
| Stripe | El degradado como pieza única, no como relleno |
| Linear | La jerarquía la da el tamaño, no la negrilla |
| Notion | Un solo estilo de ilustración |

## Reglas que no se rompen

- **No cambiar lógica:** inscripción, pagos, evaluaciones, aula, formularios, rutas y direcciones públicas quedan igual. Las redirecciones nunca se borran.
- **Fuera de alcance:** las aplicaciones con interfaz propia (`/fst-app`, `/mi-espacio`, `/vida-360` y los dos *workspace*, `APLICACIONES` en `src/App.jsx`).
- **Feliz Sin Tiroides:** vende solo por Hotmart, sin precio ni carrito. La Colección Bienestar Tiroideo va primero.
- **Contenido honesto:**
  - no inventar cifras, testimonios, logos de clientes, sellos ni avales;
  - nunca afiches «Curso GRATIS»;
  - no usar fotos generadas por IA de personas presentadas como reales.
- **Accesibilidad:**
  - contraste AA o mejor;
  - foco visible;
  - `prefers-reduced-motion` respetado;
  - nada de texto dentro de imágenes sin su equivalente en texto.
- **Fuentes:** solo si están en Google Fonts o en el repositorio con licencia libre. Verifica que existan antes de usarlas.
- **Antes de cada push:**
  - `npm run build` en verde;
  - `npx vitest run` y `npx vitest run --config vitest.api.config.js` en verde;
  - verificación en 390, 768 y 1280 px sin desborde horizontal.
- **Commits** en español, terminados en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Fases

Haz una fase a la vez. Al terminar cada una, entrega capturas de antes y después de las páginas de prueba y la tabla de medidas. Despliega según D4.

**Páginas de prueba:**
- `/`
- `/instituciones`
- `/contigo`
- `/escuelas`
- `/curso-de-regulacion-sanitaria-de-gases-medicinales`
- `/cuenta`
- `/feliz-sin-tiroides`
- una clase del aula

### Fase 0 · Medidor

Crea `scripts/auditar-diseno.mjs`. Debe abrir las páginas de prueba con un navegador sin interfaz en 390 y 1366 px y medir:

- pesos de letra de los textos;
- tamaños de letra;
- radios;
- colores de texto y de fondo que no estén en las variables `--ds-*`;
- familias en uso;
- alto de página;
- desborde horizontal.

Guarda el resultado en `docs/auditoria-diseno/<fecha>.json` y un resumen legible en `.md`. Corre la línea base antes de tocar nada. Si instalar un navegador sin interfaz no es viable, usa el navegador del panel con `javascript_tool` y documenta el método.

### Fase 1 · Variables y limpieza

1. **Escala tipográfica de 6 pasos** como variables: 13, 15, 17, 20, 28 y 44–56 px (fluida en el titular). Cuerpo de 15–17 px; nada por debajo de 13 px salvo insignias, que pueden ir a 12 px en mayúsculas.
2. **Pesos:** 400 para leer, 500 para etiquetas, 600 para subtítulos y botones, 700 solo para titulares. 800 solo en el titular del héroe, si D1 lo pide.
3. **Radios:** solo 8, 12, 16, 24 y el completo (`999px`). Reemplaza 4, 10, 14, 20, 28 y 9999 por el más cercano y documenta el cambio.
4. **Colores:**
   - unifica `#17223B` y `#1F2937` en `--ds-text`;
   - convierte `#EEF5FA` en variable o reemplázalo por `--ds-ice`;
   - agrega estados `--ds-success`, `--ds-warning`, `--ds-info` y `--ds-danger`, cada uno con fondo suave y texto AA;
   - agrega una paleta de 6 colores para gráficas.
5. **Fuentes:** quita Patrick Hand de `index.html`, `public/404.html` y `tailwind.config.js`. Mantén Fraunces solo si el diploma la necesita; si D1 = B, el diploma pasa a la nueva serif. Carga solo los pesos que se usan.
6. **Título de las fichas:** corrige «… gratis» para que diga lo que es verdad. El curso es de acceso gratuito y el certificado tiene costo; consulta la regla vigente con Karla si hay duda.

**Criterio de salida:**
- como máximo 7 tamaños y 6 radios;
- 0 colores fuera de las variables en las páginas de prueba;
- al menos el 45 % de los textos en peso 400;
- ningún texto de lectura por debajo de 13 px.

### Fase 2 · Firma visual: el arco

Lleva el arco del logo al sistema como recurso propio, en `src/components/edvanta/arco.jsx` y `edvanta-ds.css`:

- `ArcoMarco`: máscara de foto con el borde superior en arco.
- `ArcoDivisor`: separador de secciones.
- `ArcoProgreso`: el anillo de avance del aula, dibujado como arco.
- `ArcoViñeta`: viñeta de listas.

Úsalo con mesura: en héroes, tarjetas destacadas y aula, no en cada caja.

Quita como recurso por defecto:
- el texto en degradado;
- el titular de dos tonos;
- el subrayado con trazo;
- las tarjetas de vidrio flotando sobre la foto.

Se permite **un** uso del degradado de marca como pieza protagonista en el inicio.

**Criterio de salida:** el héroe del inicio y el de `/instituciones` tienen composiciones distintas, y en ninguno hay texto en degradado.

### Fase 3 · Tipografía con voz

Aplica D1 en todos los héroes, títulos de sección y fichas. La jerarquía se logra con tamaño y espacio, no con negrilla.

En celular, el texto del héroe va alineado a la izquierda con un ancho cómodo (máximo de 34 a 38 caracteres por línea en el titular).

**Criterio de salida:** captura de antes y después de cada página de prueba; ningún párrafo centrado de más de dos líneas.

### Fase 4 · Sistema único de portadas

Reemplaza los tres estilos actuales por **una** plantilla de portada generada en código (SVG/CSS, sin IA):

- fondo claro del color del área o del público (según D3);
- el arco como marco;
- un ícono de línea del tema, de un mismo set (lucide o un set propio coherente);
- el nombre del área;
- espacio limpio, sin texto incrustado: el título va en la tarjeta como texto real.

Reglas:
- Las portadas de Contigo pasan a fondos claros y cálidos.
- Las fotos oficiales de Edutin se conservan, dentro del mismo marco, porque son del proveedor.
- Documenta la plantilla en el sistema.

**Criterio de salida:** en las filas del inicio no se mezclan estilos de portada.

### Fase 5 · Fotos y dirección de arte

Según D2:

- **A)** Escribe la guía de fotografía y la lista de tomas en `docs/DIRECCION-DE-ARTE.md`:
  - personas reales del oficio;
  - luz natural;
  - farmacias, laboratorios y consultorios colombianos;
  - encuadres con aire para texto;
  - qué evitar (sonrisas posadas a cámara, batas sin contexto, grupos de banco).

  Deja los lugares de foto preparados con `ArcoMarco` y dimensiones fijas.
- **B)** Reemplaza las fotos de personas de los héroes por fotos de objetos y espacios reales que ya existan en `public/img`, o por composiciones del sistema (arco, íconos, diagramas). No descargues fotos de bancos sin licencia verificada.
- **C)** No cambies fotos. Deja la lista de tomas para cuando lleguen las nuevas.

Elimina las tres fichas de público repetidas bajo la foto del inicio.

### Fase 6 · Ritmo del inicio y de los catálogos

Entre las filas del inicio, intercala 2 o 3 bloques editoriales hechos solo con datos reales del repositorio:

- un curso destacado en formato grande;
- «Así se estudia en el aula», con capturas reales del aula;
- quién está detrás: Karla, con sus credenciales reales de `src/config/links.js`, sin inventar cifras.

Reduce el alto del inicio al menos un 20 % sin quitar categorías: agrupa filas o usa «Ver todo». Dale a `/contigo` más aire y calma que al catálogo profesional.

**Criterio de salida:** alto del inicio de 6.800 px o menos en escritorio, y ninguna secuencia de más de tres filas iguales seguidas.

### Fase 7 · Acentos por público y documentación

Aplica D3 como acentos (chips, filos, íconos y botón principal de cada público), no como fondos completos.

Actualiza la documentación:
- `docs/EDVANTA_DESIGN_SYSTEM_2.md` pasa a `docs/EDVANTA_DESIGN_SYSTEM_3.md`, con la matriz de cobertura actualizada;
- regenera la página de muestra del sistema con la copia exacta de `edvanta-ds.css`.

Corre el medidor de la fase 0 y entrega la tabla final de antes y después.

## Entrega final

- Tabla de medidas de antes y después (fase 0 contra fase 7).
- Capturas de las páginas de prueba en 390 y 1280 px.
- Lista de lo que no se pudo hacer y por qué (por ejemplo, fotos reales pendientes).
- Commits y estado del despliegue de cada fase.

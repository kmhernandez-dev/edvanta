# Blog «Conoce Edvanta»: 15 artículos y sus espacios para imágenes

Publicados el 2026-11-06 en la categoría **Conoce Edvanta** (`/articulos/categoria/conoce-edvanta`).

- Textos: `public/articulos/articulos_edvanta/conoce-edvanta/<slug>.md`.
- Datos y espacios de imagen: `src/data/blogEdvanta.js`.
- Cada artículo empieza con una respuesta directa en negrita y termina en «Preguntas frecuentes»: de ahí salen los datos estructurados FAQPage que leen Google y los buscadores con IA.
- `public/llms.txt` resume a Edvanta y enlaza los 15 artículos para asistentes de IA.
- `index.html` declara la organización con razón social, NIT, Medellín y temas.

## Cómo poner una imagen

1. Sube la foto a `public/img/blog/edvanta/` con el nombre de la columna «Archivo» (formato `.webp`, 1200 × 600 para portadas).
2. En `src/data/blogEdvanta.js`, busca el artículo y el espacio por su `id` y cambia `src: null` por la ruta del archivo.
3. Si es la portada, pon también la ruta en `image` y el texto en `imageAlt` del artículo.
4. Mientras `src` sea `null`, el espacio no se muestra: el artículo nunca enseña un recuadro vacío.

## Reglas para las imágenes

- Fotos reales del equipo y de la ciudad; si no hay foto real, ilustración. No usar fotos de banco presentadas como el equipo.
- Certificados, aula y carrito: capturas con **datos de ejemplo**, nunca de personas reales.
- Nada de pacientes identificables. En capacitaciones, solo con autorización de las personas.
- El logo de Edvanta se usa tal cual; no se modifica.

## Espacios por artículo

| Artículo | Espacio | Va después de | Archivo | Sugerencia |
|---|---|---|---|---|
| que-es-edvanta | portada | — | `/img/blog/edvanta/que-es-edvanta-portada.webp` | Foto real del equipo en Medellín, con algún elemento reconocible de la ciudad. |
| que-es-edvanta | 1 | Lo que hace Edvanta, en tres frentes | `/img/blog/edvanta/que-es-edvanta-1.webp` | Ilustración de las tres puertas: profesionales, pacientes e instituciones. |
| que-es-edvanta | 2 | Cómo se aprende en Edvanta | `/img/blog/edvanta/que-es-edvanta-2.webp` | Captura del aula en un celular con una clase (datos de ejemplo). |
| historia-de-edvanta | portada | — | `/img/blog/edvanta/historia-de-edvanta-portada.webp` | Los fundadores conversando con un tinto en un espacio de Medellín. |
| historia-de-edvanta | 1 | El problema que no nos dejaba dormir | `/img/blog/edvanta/historia-de-edvanta-1.webp` | Ilustración del caos normativo: PDF largo, chat de reenvíos. |
| historia-de-edvanta | 2 | De una idea a cuatro escuelas | `/img/blog/edvanta/historia-de-edvanta-2.webp` | Línea de tiempo gráfica sin fechas inventadas. |
| edvanta-e-inteligencia-artificial | portada | — | `/img/blog/edvanta/edvanta-e-inteligencia-artificial-portada.webp` | Químico farmacéutico del equipo con portátil, norma en pantalla y bata al lado. |
| edvanta-e-inteligencia-artificial | 1 | Lo que la IA no decide en Edvanta | `/img/blog/edvanta/edvanta-e-inteligencia-artificial-1.webp` | Infografía «Lo que hace la IA / Lo que decide el criterio profesional». |
| marketing-farmaceutico-con-criterio | portada | — | `/img/blog/edvanta/marketing-farmaceutico-con-criterio-portada.webp` | Equipo grabando contenido educativo. |
| marketing-farmaceutico-con-criterio | 1 | Nuestras reglas de comunicación | `/img/blog/edvanta/marketing-farmaceutico-con-criterio-1.webp` | Tarjeta con las cinco reglas de comunicación. |
| vigencia-certificados-edvanta | portada | — | `/img/blog/edvanta/vigencia-certificados-edvanta-portada.webp` | Certificado con datos de ejemplo y el QR visible. |
| vigencia-certificados-edvanta | 1 | Lo que muestra la verificación | `/img/blog/edvanta/vigencia-certificados-edvanta-1.webp` | Captura de la verificación pública de un certificado de ejemplo vigente. |
| como-verificar-certificado-edvanta | portada | — | `/img/blog/edvanta/como-verificar-certificado-edvanta-portada.webp` | Mano escaneando el QR de un certificado impreso de ejemplo. |
| como-verificar-certificado-edvanta | 1 | Paso a paso para quien revisa un certificado | `/img/blog/edvanta/como-verificar-certificado-edvanta-1.webp` | Tres capturas: código → verificación → estado vigente. |
| cuanto-cuesta-certificado-edvanta | portada | — | `/img/blog/edvanta/cuanto-cuesta-certificado-edvanta-portada.webp` | Ficha de un curso con el bloque «Precio del certificado». |
| cuanto-cuesta-certificado-edvanta | 1 | Cómo pagarlo, paso a paso | `/img/blog/edvanta/cuanto-cuesta-certificado-edvanta-1.webp` | Carrito con un certificado y el botón de Mercado Pago. |
| certificados-edvanta-educacion-informal | portada | — | `/img/blog/edvanta/certificados-edvanta-educacion-informal-portada.webp` | Ilustración de los tres tipos de educación en Colombia. |
| como-se-disena-un-curso-en-edvanta | portada | — | `/img/blog/edvanta/como-se-disena-un-curso-en-edvanta-portada.webp` | Equipo frente a un tablero con el mapa de un curso. |
| como-se-disena-un-curso-en-edvanta | 1 | 3. Las evaluaciones siguen la taxonomía de Bloom | `/img/blog/edvanta/como-se-disena-un-curso-en-edvanta-1.webp` | Escalera de Bloom con un ejemplo de quiz. |
| como-se-disena-un-curso-en-edvanta | 2 | 4. Las rúbricas se conocen desde el primer día | `/img/blog/edvanta/como-se-disena-un-curso-en-edvanta-2.webp` | Captura de una rúbrica del aula con niveles 4 a 0. |
| edvanta-profesionales-pacientes-instituciones | portada | — | `/img/blog/edvanta/edvanta-profesionales-pacientes-instituciones-portada.webp` | Collage: profesional, paciente con guía, equipo en capacitación. |
| edvanta-profesionales-pacientes-instituciones | 1 | Profesionales: cuatro escuelas para decidir mejor | `/img/blog/edvanta/edvanta-profesionales-pacientes-instituciones-1.webp` | Gráfico de las cuatro escuelas. |
| feliz-sin-tiroides-programa-edvanta | portada | — | `/img/blog/edvanta/feliz-sin-tiroides-programa-edvanta-portada.webp` | Imagen de marca de Feliz Sin Tiroides con una guía en pantalla. |
| feliz-sin-tiroides-programa-edvanta | 1 | Qué encuentras en Feliz Sin Tiroides | `/img/blog/edvanta/feliz-sin-tiroides-programa-edvanta-1.webp` | Captura de la guía de la levotiroxina. |
| edvanta-para-instituciones | portada | — | `/img/blog/edvanta/edvanta-para-instituciones-portada.webp` | Sesión de capacitación con autorización de las personas. |
| edvanta-para-instituciones | 1 | Cómo trabajamos con una institución | `/img/blog/edvanta/edvanta-para-instituciones-1.webp` | Diagrama de los seis pasos del programa. |
| aprender-con-casos-edvanta | portada | — | `/img/blog/edvanta/aprender-con-casos-edvanta-portada.webp` | Persona resolviendo un caso con la norma impresa. |
| aprender-con-casos-edvanta | 1 | Cómo es un caso en Edvanta | `/img/blog/edvanta/aprender-con-casos-edvanta-1.webp` | Tarjeta con los cuatro ingredientes de un caso. |
| certificado-edvanta-en-linkedin | portada | — | `/img/blog/edvanta/certificado-edvanta-en-linkedin-portada.webp` | Perfil de LinkedIn de ejemplo con el certificado. |
| preguntas-frecuentes-sobre-edvanta | portada | — | `/img/blog/edvanta/preguntas-frecuentes-sobre-edvanta-portada.webp` | Imagen de marca con «Preguntas frecuentes» y el logo oficial. |

## Afirmaciones para confirmar con la dirección

Los textos usan solo datos verificables o dados por la propietaria. Conviene confirmar:

- Que los creadores se presentan como «un grupo de químicos farmacéuticos de Medellín con experiencia en inteligencia artificial, marketing y educación» (sin nombres).
- Que en los cursos asignados por una institución el certificado va incluido (así quedó programado el cobro).
- La redacción «certificado de aprobación» frente a la norma de educación informal, que habla de «constancia de asistencia» (Decreto 1075 de 2015, artículo 2.6.6.8). Los textos lo explican sin ocultarlo; una revisión jurídica puede ajustar el nombre del documento.

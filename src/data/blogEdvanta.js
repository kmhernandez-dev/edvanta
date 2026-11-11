/**
 * ============================================================
 *  BLOG «CONOCE EDVANTA» — quiénes somos, certificados y método
 *
 *  15 artículos sobre la propia Edvanta, escritos para responder de
 *  forma directa lo que la gente (y los buscadores con IA) pregunta:
 *  qué es Edvanta, quién la creó, cuánto cuesta y cuánto dura un
 *  certificado, cómo se verifica y cómo se enseña.
 *
 *  El texto vive en /public/articulos/articulos_edvanta/conoce-edvanta.
 *  Cada .md termina en «## Preguntas frecuentes»: de ahí salen los datos
 *  estructurados FAQPage.
 *
 *  Imágenes: cada artículo trae sus espacios en `imagenes`, con una
 *  sugerencia y el texto alternativo. Mientras `src` sea null, el
 *  espacio no se muestra. Para activarlo, sube la foto a
 *  /public/img/blog/edvanta/ y pon su ruta en `src` (la portada va
 *  además en `image`). Guía completa: docs/BLOG_CONOCE_EDVANTA.md.
 * ============================================================
 */
const BASE = '/articulos/articulos_edvanta/conoce-edvanta';
const FECHA = '2026-11-06';
const CATEGORIA = 'Conoce Edvanta';

const espacio = (slug, id, despuesDe, sugerencia, alt) => ({
  id,
  despuesDe,
  sugerencia,
  alt,
  archivo: `/img/blog/edvanta/${slug}-${id}.webp`,
  src: null,
});

// `actualizado`: solo en los artículos que cambiaron después del 6-nov
// (p. ej., el 10-nov, al abrir la Escuela de Habilidades Blandas).
const post = ({ slug, title, description, readingTime, imagenes, actualizado }) => ({
  slug,
  marca: 'edvanta',
  category: CATEGORIA,
  title,
  description,
  readingTime,
  date: FECHA,
  updated: actualizado || FECHA,
  autor: 'Equipo Edvanta',
  mdPath: `${BASE}/${slug}.md`,
  imagenes: imagenes.map((i) => espacio(slug, ...i)),
});

export const BLOG_EDVANTA = [
  post({
    slug: 'que-es-edvanta',
    title: '¿Qué es Edvanta? La plataforma de educación farmacéutica nacida en Medellín',
    description: 'Edvanta es una empresa colombiana de educación farmacéutica con sede en Medellín: cinco escuelas para profesionales, Edvanta Contigo para pacientes y programas para instituciones.',
    readingTime: '5 min',
    actualizado: '2026-11-10',
    imagenes: [
      ['portada', null, 'Foto real del equipo de Edvanta en Medellín (no de banco de imágenes), con luz natural y algún elemento reconocible de la ciudad al fondo.', 'Equipo de químicos farmacéuticos de Edvanta en Medellín'],
      ['1', 'Lo que hace Edvanta, en tres frentes', 'Ilustración simple con las tres puertas del sitio: Profesionales, Pacientes e Instituciones, con los colores de la marca.', 'Las tres puertas de Edvanta: profesionales, pacientes e instituciones'],
      ['2', 'Cómo se aprende en Edvanta', 'Captura del aula en un celular mostrando una clase con su caso de partida (con datos de ejemplo).', 'Clase del aula de Edvanta abierta en un celular'],
    ],
  }),
  post({
    slug: 'historia-de-edvanta',
    title: 'La historia de Edvanta: químicos farmacéuticos de Medellín que decidieron enseñar distinto',
    description: 'Cómo un grupo de químicos farmacéuticos de Medellín, apasionados por la inteligencia artificial y el marketing, creó Edvanta para enseñar a decidir y no a repetir.',
    readingTime: '6 min',
    actualizado: '2026-11-10',
    imagenes: [
      ['portada', null, 'Foto real de los fundadores conversando alrededor de una mesa con café (un tinto), en un espacio de Medellín.', 'Fundadores de Edvanta conversando en Medellín'],
      ['1', 'El problema que no nos dejaba dormir', 'Composición que muestre el caos: un PDF largo de norma, un chat lleno de reenvíos y una persona confundida (ilustración, no foto de pacientes).', 'Ilustración de la sobrecarga de información normativa'],
      ['2', 'De una idea a cinco escuelas', 'Línea de tiempo gráfica: biblioteca de recursos → escuelas → Edvanta Contigo → instituciones (sin fechas inventadas).', 'Evolución de Edvanta de biblioteca de recursos a empresa de educación farmacéutica'],
    ],
  }),
  post({
    slug: 'edvanta-e-inteligencia-artificial',
    title: 'De la bata al algoritmo: cómo usa Edvanta la inteligencia artificial (y lo que nunca le deja decidir)',
    description: 'En Edvanta la IA ayuda a buscar, ordenar y redactar borradores; la verdad técnica la deciden químicos farmacéuticos con fuentes verificables.',
    readingTime: '6 min',
    imagenes: [
      ['portada', null, 'Foto de un químico farmacéutico del equipo trabajando en un portátil con una norma abierta en pantalla y la bata colgada al lado.', 'Químico farmacéutico de Edvanta trabajando con inteligencia artificial'],
      ['1', 'Lo que la IA no decide en Edvanta', 'Infografía de dos columnas: «Lo que hace la IA» y «Lo que decide el criterio profesional».', 'Qué hace la inteligencia artificial y qué decide el criterio profesional en Edvanta'],
    ],
  }),
  post({
    slug: 'marketing-farmaceutico-con-criterio',
    title: 'Marketing con criterio farmacéutico: así comunica Edvanta la salud sin prometer milagros',
    description: 'Las reglas de comunicación de Edvanta: nada de promesas de resultados, cifras inventadas ni testimonios falsos, y lo propio separado de lo ajeno.',
    readingTime: '5 min',
    imagenes: [
      ['portada', null, 'Foto del equipo grabando contenido educativo (celular en trípode, guion en mano) en Medellín.', 'Equipo de Edvanta creando contenido educativo'],
      ['1', 'Nuestras reglas de comunicación', 'Tarjeta gráfica con las cinco reglas de comunicación de Edvanta.', 'Las cinco reglas de comunicación de Edvanta'],
    ],
  }),
  post({
    slug: 'vigencia-certificados-edvanta',
    title: 'Vigencia de los certificados de Edvanta: todo lo que necesitas saber',
    description: 'Los certificados de Edvanta no se vencen: quedan vigentes salvo revocación y se verifican en línea. Qué significa la vigencia, qué deciden las empresas y cuándo actualizarte.',
    readingTime: '6 min',
    imagenes: [
      ['portada', null, 'Fotografía o render del certificado de Edvanta con datos de ejemplo (titular ficticio) y el QR visible.', 'Certificado de aprobación de Edvanta con código QR'],
      ['1', 'Lo que muestra la verificación', 'Captura de la página de verificación pública con un certificado de ejemplo en estado «vigente».', 'Verificación pública de un certificado de Edvanta vigente'],
    ],
  }),
  post({
    slug: 'como-verificar-certificado-edvanta',
    title: 'Cómo verificar un certificado de Edvanta en menos de un minuto',
    description: 'Escanea el QR o escribe el código EDV-XXXX-XXXX en edvanta.co/certificados: verás titular, curso, fecha y estado, sin exponer el documento completo.',
    readingTime: '4 min',
    imagenes: [
      ['portada', null, 'Mano escaneando con el celular el QR de un certificado impreso (datos de ejemplo).', 'Persona escaneando el código QR de un certificado de Edvanta'],
      ['1', 'Paso a paso para quien revisa un certificado', 'Secuencia de tres capturas: código en el certificado → página de verificación → estado vigente.', 'Pasos para verificar un certificado de Edvanta'],
    ],
  }),
  post({
    slug: 'cuanto-cuesta-certificado-edvanta',
    title: '¿Cuánto cuesta un certificado de Edvanta? Precio, qué incluye y cómo pagarlo',
    description: 'En los cursos propios de Edvanta el contenido es gratis y el certificado cuesta COP 60.000 por curso, en un pago único con Mercado Pago.',
    readingTime: '5 min',
    imagenes: [
      ['portada', null, 'Captura de la ficha de un curso con el bloque «Precio del certificado: $60.000 COP» y el botón de carrito.', 'Ficha de curso de Edvanta con el precio del certificado'],
      ['1', 'Cómo pagarlo, paso a paso', 'Captura del carrito con un certificado agregado y el botón «Pagar con Mercado Pago».', 'Carrito de Edvanta con un certificado listo para pagar'],
    ],
  }),
  post({
    slug: 'certificados-edvanta-educacion-informal',
    title: '¿Qué acredita un certificado de Edvanta? La educación informal en Colombia, explicada sin rodeos',
    description: 'Los cursos de Edvanta son educación informal según el Decreto 1075 de 2015: acreditan la aprobación de un curso de actualización, no un título ni una aptitud ocupacional.',
    readingTime: '5 min',
    imagenes: [
      ['portada', null, 'Ilustración de tres escalones: educación formal, educación para el trabajo y educación informal, destacando el tercero.', 'Tipos de educación en Colombia y dónde están los cursos de Edvanta'],
    ],
  }),
  post({
    slug: 'como-se-disena-un-curso-en-edvanta',
    title: 'Así se diseña un curso en Edvanta: casos reales, taxonomía de Bloom y rúbricas',
    description: 'Cada unidad tiene una actividad basada en un caso, un quiz ordenado según Bloom y un foro de interacción; cada curso, un proyecto integrador sobre un solo caso.',
    readingTime: '6 min',
    imagenes: [
      ['portada', null, 'Foto del equipo frente a un tablero con el mapa de un curso: decisión final, casos, quizzes y proyecto.', 'Equipo de Edvanta diseñando un curso'],
      ['1', '3. Las evaluaciones siguen la taxonomía de Bloom', 'Pirámide o escalera de Bloom (recordar, comprender, aplicar, analizar, evaluar, crear) con el ejemplo de un quiz de Edvanta.', 'Taxonomía de Bloom aplicada a las evaluaciones de Edvanta'],
      ['2', '4. Las rúbricas se conocen desde el primer día', 'Captura de una rúbrica de actividad del aula con sus niveles del 4 al 0.', 'Rúbrica analítica de una actividad del aula de Edvanta'],
    ],
  }),
  post({
    slug: 'edvanta-profesionales-pacientes-instituciones',
    title: 'Tres puertas, una misión: Edvanta para profesionales, pacientes e instituciones',
    description: 'Cinco escuelas para profesionales, Edvanta Contigo para pacientes y programas con evidencia para instituciones, bajo un mismo criterio farmacéutico.',
    readingTime: '5 min',
    actualizado: '2026-11-10',
    imagenes: [
      ['portada', null, 'Collage de tres fotos reales: un profesional estudiando, una paciente leyendo una guía y un equipo en capacitación.', 'Profesionales, pacientes e instituciones en Edvanta'],
      ['1', 'Profesionales: cinco escuelas para decidir mejor', 'Gráfico con las cinco escuelas y un ícono para cada una.', 'Las cinco escuelas de Edvanta'],
    ],
  }),
  post({
    slug: 'feliz-sin-tiroides-programa-edvanta',
    title: 'Feliz Sin Tiroides: el programa para pacientes que nació dentro de Edvanta',
    description: 'Feliz Sin Tiroides es el programa educativo de Edvanta para personas con condiciones de la tiroides y sus cuidadores: guías con fuentes, sin promesas de curación.',
    readingTime: '5 min',
    imagenes: [
      ['portada', null, 'Imagen de marca de Feliz Sin Tiroides con una guía educativa en pantalla (sin pacientes identificables).', 'Programa educativo Feliz Sin Tiroides de Edvanta'],
      ['1', 'Qué encuentras en Feliz Sin Tiroides', 'Captura de la guía «Cómo tomar la levotiroxina correctamente».', 'Guía de Feliz Sin Tiroides sobre la levotiroxina'],
    ],
  }),
  post({
    slug: 'edvanta-para-instituciones',
    title: 'Edvanta para instituciones: capacitar equipos de salud con evidencia y trazabilidad',
    description: 'Programas de capacitación para hospitales, IPS, EPS y empresas, con casos, rúbricas, seguimiento por persona y certificados verificables incluidos.',
    readingTime: '5 min',
    actualizado: '2026-11-10',
    imagenes: [
      ['portada', null, 'Foto de una sesión de capacitación con un equipo de salud (con autorización de las personas), proyector con una clase del aula.', 'Capacitación institucional con Edvanta'],
      ['1', 'Cómo trabajamos con una institución', 'Diagrama de los seis pasos del programa institucional.', 'Pasos de un programa de capacitación institucional de Edvanta'],
    ],
  }),
  post({
    slug: 'aprender-con-casos-edvanta',
    title: 'Aprender con casos: por qué en Edvanta no te pedimos memorizar normas',
    description: 'En el trabajo nadie pregunta una definición: aparece un caso y hay que decidir. Así usa Edvanta los casos en clases, actividades y proyectos.',
    readingTime: '5 min',
    imagenes: [
      ['portada', null, 'Foto de una persona resolviendo un caso con la norma impresa, resaltador y notas.', 'Profesional resolviendo un caso de estudio de Edvanta'],
      ['1', 'Cómo es un caso en Edvanta', 'Tarjeta gráfica con los cuatro ingredientes de un buen caso.', 'Los cuatro ingredientes de un caso de Edvanta'],
    ],
  }),
  post({
    slug: 'certificado-edvanta-en-linkedin',
    title: 'Del aula a LinkedIn: cómo sacarle provecho a tu certificado de Edvanta',
    description: 'Agrega tu certificado a LinkedIn desde el aula, enlaza su verificación en tu hoja de vida y cuenta el caso que resolviste para aprobarlo.',
    readingTime: '4 min',
    imagenes: [
      ['portada', null, 'Captura de un perfil de LinkedIn de ejemplo con el certificado de Edvanta en «Licencias y certificaciones».', 'Certificado de Edvanta agregado a LinkedIn'],
    ],
  }),
  post({
    slug: 'preguntas-frecuentes-sobre-edvanta',
    title: 'Preguntas frecuentes sobre Edvanta: todo lo que la gente nos pregunta',
    description: 'Qué es Edvanta, quién la fundó, cuánto cuesta y cuánto dura un certificado, cómo se verifica, qué acredita y cómo se enseña, en un solo lugar.',
    readingTime: '5 min',
    actualizado: '2026-11-10',
    imagenes: [
      ['portada', null, 'Imagen de marca de Edvanta con el texto «Preguntas frecuentes» y el logo oficial (sin modificarlo).', 'Preguntas frecuentes sobre Edvanta'],
    ],
  }),
];

/**
 * Capa SEO de los 15 artículos. La imagen es una portada provisional del
 * propio sitio; cuando subas la foto definitiva del espacio «portada»,
 * cambia aquí `image` e `imageAlt`.
 */
const SEO = {
  'que-es-edvanta': ['¿Qué es Edvanta? Educación farmacéutica desde Medellín', 'Edvanta es una empresa colombiana de educación farmacéutica con sede en Medellín: escuelas para profesionales, pacientes e instituciones.', '/img/og-edvanta.png', 'Portada de Edvanta, plataforma de educación farmacéutica'],
  'historia-de-edvanta': ['Historia de Edvanta: químicos farmacéuticos de Medellín', 'La historia de Edvanta: un grupo de químicos farmacéuticos de Medellín, expertos en IA y marketing, que decidió enseñar a decidir y no a repetir.', '/img/comunidad/encuentro-comunidad-farmaceutica.webp', 'Químicos farmacéuticos conversando alrededor de una mesa'],
  'edvanta-e-inteligencia-artificial': ['Cómo usa Edvanta la inteligencia artificial', 'En Edvanta la IA ayuda a buscar, ordenar y redactar borradores; la verdad técnica la deciden químicos farmacéuticos con fuentes verificables.', '/img/clinico-digital.jpg', 'Profesional de la salud trabajando con herramientas digitales'],
  'marketing-farmaceutico-con-criterio': ['Marketing farmacéutico con ética: el criterio de Edvanta', 'Las reglas de comunicación de Edvanta: sin promesas de resultados, sin cifras ni testimonios inventados y con lo propio separado de lo ajeno.', '/img/escuelas/marketing.webp', 'Escuela de Marketing y Comunicación Farmacéutica de Edvanta'],
  'vigencia-certificados-edvanta': ['Vigencia de los certificados de Edvanta', 'Los certificados de Edvanta no se vencen: quedan vigentes salvo revocación y se verifican en línea. Qué significa la vigencia y cuándo actualizarte.', '/img/certificado/sello-edvanta.png', 'Sello de certificación de Edvanta'],
  'como-verificar-certificado-edvanta': ['Cómo verificar un certificado de Edvanta', 'Escanea el QR o escribe el código EDV-XXXX-XXXX en edvanta.co/certificados: verás titular, curso, fecha y estado, sin exponer el documento.', '/img/empresas/panel-capacitacion-edvanta.webp', 'Panel de seguimiento de capacitación de Edvanta'],
  'cuanto-cuesta-certificado-edvanta': ['Cuánto cuesta un certificado de Edvanta: COP 60.000', 'En los cursos propios de Edvanta el contenido es gratis y el certificado cuesta COP 60.000 por curso, en un pago único con Mercado Pago.', '/img/fotos/equipo-carrera-farmaceutica-movil.webp', 'Profesional farmacéutico consultando su curso en el celular'],
  'certificados-edvanta-educacion-informal': ['Qué acredita un certificado de Edvanta: educación informal', 'Los cursos de Edvanta son educación informal según el Decreto 1075 de 2015: acreditan la aprobación de un curso de actualización, no un título.', '/img/escuelas/regulatorios.webp', 'Escuela de Asuntos Regulatorios de Edvanta'],
  'como-se-disena-un-curso-en-edvanta': ['Cómo se diseña un curso en Edvanta: casos y Bloom', 'Cada unidad tiene una actividad con un caso, un quiz ordenado según Bloom y un foro de interacción; cada curso, un proyecto integrador.', '/img/fotos/equipo-carrera-farmaceutica.webp', 'Equipo farmacéutico en formación'],
  'edvanta-profesionales-pacientes-instituciones': ['Edvanta para profesionales, pacientes e instituciones', 'Cinco escuelas para profesionales, Edvanta Contigo para pacientes y programas con evidencia para instituciones, con un mismo criterio farmacéutico.', '/img/contigo/aulas-contigo.webp', 'Espacios de aprendizaje de Edvanta'],
  'feliz-sin-tiroides-programa-edvanta': ['Feliz Sin Tiroides: el programa para pacientes de Edvanta', 'Feliz Sin Tiroides es el programa educativo de Edvanta para personas con condiciones de la tiroides y sus cuidadores, con fuentes y sin promesas.', '/img/feliz-sin-tiroides-hero-v2.webp', 'Programa educativo Feliz Sin Tiroides'],
  'edvanta-para-instituciones': ['Edvanta para instituciones: capacitación con evidencia', 'Programas para hospitales, IPS, EPS y empresas, con casos, rúbricas, seguimiento por persona y certificados verificables incluidos.', '/img/empresas/capacitacion-equipo-farmaceutico.webp', 'Capacitación de un equipo farmacéutico'],
  'aprender-con-casos-edvanta': ['Aprender con casos: el método de Edvanta', 'En el trabajo nadie pregunta una definición: aparece un caso y hay que decidir. Así usa Edvanta los casos en clases, actividades y proyectos.', '/img/escuelas/salud.webp', 'Escuela de Salud y Farmacia Clínica de Edvanta'],
  'certificado-edvanta-en-linkedin': ['Cómo agregar tu certificado de Edvanta a LinkedIn', 'Agrega tu certificado a LinkedIn desde el aula, enlaza su verificación en tu hoja de vida y cuenta el caso que resolviste para aprobarlo.', '/img/empresas/seleccion-revisando-perfiles.webp', 'Revisión de perfiles profesionales en un proceso de selección'],
  'preguntas-frecuentes-sobre-edvanta': ['Preguntas frecuentes sobre Edvanta', 'Qué es Edvanta, quién la fundó, cuánto cuesta y cuánto dura un certificado, cómo se verifica y qué acredita, en un solo lugar.', '/img/fotos/servicio-farmaceutico-recepcion.webp', 'Servicio farmacéutico atendiendo a sus usuarios'],
};

export const SEO_BLOG_EDVANTA = Object.fromEntries(
  Object.entries(SEO).map(([slug, [seoTitle, seoDescription, image, imageAlt]]) => [
    slug, { seoTitle, seoDescription, image, imageAlt, updated: FECHA },
  ]),
);

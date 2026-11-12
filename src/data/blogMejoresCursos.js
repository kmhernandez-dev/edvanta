/**
 * ============================================================
 *  BLOG «MEJORES CURSOS» — recomendaciones de cursos (12-nov-2026)
 *
 *  Guías de recomendación que posicionan los cursos de Edvanta, Edutin
 *  Academy y Coursera del catálogo, escritas a partir de lo que Search
 *  Console ya mostraba: «curso de seguridad y salud en el trabajo»
 *  (posición 56-70), «carrera de farmacia» (91-100), «power bi para qué
 *  sirve» (97), «curso diabetes» (68) y «diplomado en telemedicina» (58).
 *
 *  Reglas:
 *  - solo se recomiendan cursos que existen en el catálogo (sus fichas
 *    /curso-de-… están en el sitemap), con lo que dice la base: plataforma,
 *    nivel, idioma y modelo de acceso;
 *  - las normas citadas se verificaron en la fuente oficial el 12-nov-2026
 *    (Ley 212 de 1995, Resolución 4927 de 2016, Resolución 1644 de 2026);
 *  - cada .md termina en «## Preguntas frecuentes» (FAQPage) y fuentes.
 *
 *  El texto vive en /public/articulos/articulos_edvanta/mejores-cursos.
 * ============================================================
 */
const BASE = '/articulos/articulos_edvanta/mejores-cursos';
const FECHA = '2026-11-12';
export const CATEGORIA_MEJORES_CURSOS = 'Mejores cursos';

const post = ({ slug, title, seoTitle, description, readingTime, image, imageAlt, keywords }) => ({
  slug,
  marca: 'edvanta',
  category: CATEGORIA_MEJORES_CURSOS,
  title,
  seoTitle,
  description,
  seoDescription: description,
  readingTime,
  date: FECHA,
  updated: FECHA,
  autor: 'Equipo editorial de Edvanta',
  publico: 'profesionales',
  image,
  imageAlt,
  mdPath: `${BASE}/${slug}.md`,
  keywords,
});

export const BLOG_MEJORES_CURSOS = [
  post({
    slug: 'mejores-cursos-de-coursera-para-quimicos-farmaceuticos',
    title: 'Los mejores cursos de Coursera para químicos farmacéuticos (2026)',
    seoTitle: 'Mejores cursos de Coursera para químicos farmacéuticos',
    description: 'Farmacocinética, desarrollo de medicamentos, farmacovigilancia, ensayos clínicos y datos: los cursos de Coursera que más sirven a un químico farmacéutico.',
    readingTime: '7 min',
    image: '/img/escuelas/salud.webp',
    imageAlt: 'Químico farmacéutico estudiando un curso en línea',
    keywords: ['cursos de coursera para farmacia', 'coursera farmacia', 'mejores cursos de coursera para químicos farmacéuticos', 'coursera farmacología', 'coursera farmacovigilancia', 'cursos de coursera en salud', 'coursera ensayos clínicos', 'coursera power bi'],
  }),
  post({
    slug: 'cursos-de-edutin-academy-para-salud-y-farmacia',
    title: 'Cursos de Edutin Academy para salud y farmacia: cuáles valen la pena',
    seoTitle: 'Cursos de Edutin Academy para salud y farmacia',
    description: 'Qué cursos de Edutin Academy le sirven a quien trabaja en salud y farmacia: calidad, auditoría, SST, Power BI, inglés y farmacología, y cómo funciona.',
    readingTime: '6 min',
    image: '/img/publicos/profesionales.webp',
    imageAlt: 'Profesionales de la salud revisando un curso en una tableta',
    keywords: ['edutin academy', 'cursos de edutin', 'edutin cursos gratis', 'edutin certificado', 'cursos de edutin para salud', 'edutin farmacia', 'edutin gestión de calidad', 'edutin power bi'],
  }),
  post({
    slug: 'cursos-gratis-con-certificado-para-quimicos-farmaceuticos',
    title: 'Cursos gratis con certificado para químicos farmacéuticos en Colombia (2026)',
    seoTitle: 'Cursos gratis con certificado para químicos farmacéuticos',
    description: 'Edvanta, Edutin y Coursera: qué es gratis, qué se paga y qué cursos elegir según tu meta en la industria, el hospital o asuntos regulatorios.',
    readingTime: '7 min',
    image: '/img/escuelas/calidad.webp',
    imageAlt: 'Estudiantes de Química Farmacéutica en un laboratorio',
    keywords: ['cursos gratis con certificado para químicos farmacéuticos', 'cursos gratis con certificado farmacia', 'cursos virtuales gratis con certificado salud', 'cursos gratis para regentes de farmacia', 'cursos gratis BPM con certificado', 'cursos gratis farmacia Colombia'],
  }),
  post({
    slug: 'cursos-de-seguridad-y-salud-en-el-trabajo-sst-gratis',
    title: 'Cursos de seguridad y salud en el trabajo (SST) gratis: curso de 50 horas y complementos',
    seoTitle: 'Cursos de SST gratis: curso de 50 horas y complementos',
    description: 'Cómo funciona el curso virtual gratuito de 50 horas del SG-SST, su actualización de 20 horas y los cursos gratis que lo complementan.',
    readingTime: '7 min',
    image: '/img/escuelas/regulatorios.webp',
    imageAlt: 'Profesional revisando la matriz de peligros de un laboratorio',
    keywords: ['curso de seguridad y salud en el trabajo', 'curso sst gratis', 'curso de 50 horas sst', 'curso de 50 horas sg-sst gratis', 'actualización 20 horas sst', 'cursos de seguridad y salud en el trabajo gratis', 'curso prevención de riesgos laborales'],
  }),
  post({
    slug: 'carrera-de-quimica-farmaceutica-en-colombia',
    title: 'Carrera de Química Farmacéutica en Colombia: qué se estudia, dónde y en qué se trabaja',
    seoTitle: 'Carrera de Química Farmacéutica en Colombia',
    description: 'Qué hace un químico farmacéutico, qué se estudia, dónde estudiar, qué exige la Ley 212 de 1995 y en qué áreas se trabaja al graduarse.',
    readingTime: '8 min',
    image: '/img/escuelas/salud.webp',
    imageAlt: 'Estudiantes de Química Farmacéutica en clase',
    keywords: ['carrera de química farmacéutica', 'carrera de farmacia', 'química farmacéutica en Colombia', 'qué hace un químico farmacéutico', 'dónde estudiar química farmacéutica', 'diferencia entre químico farmacéutico y regente', 'ley 212 de 1995'],
  }),
  post({
    slug: 'power-bi-para-que-sirve-en-salud-y-farmacia',
    title: '¿Para qué sirve Power BI? Usos en salud y farmacia, y cursos para aprender desde cero',
    seoTitle: '¿Para qué sirve Power BI? Usos en salud y farmacia',
    description: 'Para qué sirve Power BI, ejemplos de tableros en calidad, servicio farmacéutico y logística, y cursos para aprenderlo desde cero.',
    readingTime: '7 min',
    image: '/img/clinico-digital.jpg',
    imageAlt: 'Tablero de indicadores en la pantalla de un portátil',
    keywords: ['para qué sirve power bi', 'power bi para qué sirve', 'power bi desde cero', 'curso de power bi gratis', 'power bi en salud', 'power bi farmacia', 'power bi es gratis'],
  }),
  post({
    slug: 'cursos-de-diabetes-para-profesionales-de-la-salud',
    title: 'Cursos de diabetes para profesionales de la salud: gratis, online y con certificado',
    seoTitle: 'Cursos de diabetes para profesionales de la salud',
    description: 'Cursos de diabetes gratis y con certificado: farmacoterapia con casos clínicos, endocrinología y nutrición, según tu rol en el equipo de salud.',
    readingTime: '7 min',
    image: '/img/escuelas/salud.webp',
    imageAlt: 'Profesional de la salud revisando el tratamiento de un paciente',
    keywords: ['curso diabetes', 'curso de diabetes gratis', 'curso de diabetes para profesionales de la salud', 'curso farmacoterapia diabetes', 'curso de diabetes con certificado', 'curso de diabetes online'],
  }),
  post({
    slug: 'cursos-de-telemedicina-y-telesalud',
    title: 'Cursos de telemedicina y telesalud en Colombia: qué cambió en 2026 y dónde formarte',
    seoTitle: 'Cursos de telemedicina y telesalud en Colombia (2026)',
    description: 'La Resolución 1644 de 2026, las cuatro categorías de telemedicina y los cursos para formarte en atención a distancia.',
    readingTime: '7 min',
    image: '/img/clinico-digital.jpg',
    imageAlt: 'Profesional de la salud en una teleconsulta',
    keywords: ['curso de telemedicina', 'diplomado en telemedicina', 'curso de telesalud', 'resolución 1644 de 2026', 'telemedicina en Colombia', 'categorías de telemedicina'],
  }),

  // ── Lote 2 (12-nov-2026): con enlaces de afiliado directos de Karla
  // (Udemy, Coursera por Impact y Edutin), que el artículo marca como
  // rel="sponsored" (src/lib/articulos/markdown.js).
  post({
    slug: 'cursos-de-inteligencia-artificial-para-profesionales-de-la-salud',
    title: 'Cursos de inteligencia artificial para profesionales de la salud y la farmacia (2026)',
    seoTitle: 'Cursos de IA para profesionales de la salud y farmacia',
    description: 'Cursos de IA para químicos farmacéuticos y profesionales de la salud: Claude y ChatGPT en español, IA para datos y documentos, y cómo usarla con seguridad.',
    readingTime: '7 min',
    image: '/img/clinico-digital.jpg',
    imageAlt: 'Profesional de la salud trabajando con un asistente de inteligencia artificial',
    keywords: ['curso de inteligencia artificial para profesionales de la salud', 'curso de ia para farmacia', 'curso de claude en español', 'curso de chatgpt para salud', 'inteligencia artificial en farmacia', 'curso de ia gratis'],
  }),
  post({
    slug: 'cursos-para-regentes-y-auxiliares-de-farmacia',
    title: 'Cursos para regentes y auxiliares de farmacia: gratis, en vivo y con certificado',
    seoTitle: 'Cursos para regentes y auxiliares de farmacia',
    description: 'Cursos para auxiliares y regentes de farmacia: el curso en vivo de operación segura, cursos gratis de servicio farmacéutico y farmacología, y complementos.',
    readingTime: '7 min',
    image: '/img/publicos/profesionales.webp',
    imageAlt: 'Auxiliar de farmacia orientando a un paciente en el mostrador',
    keywords: ['cursos para auxiliares de farmacia', 'cursos para regentes de farmacia', 'curso auxiliar de farmacia gratis', 'curso de regencia de farmacia', 'curso de dispensación de medicamentos', 'cursos de farmacia con certificado'],
  }),
  post({
    slug: 'cursos-de-antibioticos-y-resistencia-antimicrobiana',
    title: 'Cursos de antibióticos y resistencia antimicrobiana para profesionales de la salud',
    seoTitle: 'Cursos de antibióticos y resistencia antimicrobiana',
    description: 'Cursos para usar bien los antibióticos y trabajar en programas de optimización (PROA): uso prudente en español, stewardship y resistencia antimicrobiana.',
    readingTime: '6 min',
    image: '/img/escuelas/salud.webp',
    imageAlt: 'Químico farmacéutico revisando la prescripción de un antibiótico',
    keywords: ['curso de antibióticos', 'curso uso prudente de antibióticos', 'curso de resistencia antimicrobiana', 'curso antimicrobial stewardship', 'curso proa', 'antibióticos coursera'],
  }),
  post({
    slug: 'cursos-de-ensayos-clinicos-y-buenas-practicas-clinicas',
    title: 'Cursos de ensayos clínicos y buenas prácticas clínicas (BPC): guía 2026',
    seoTitle: 'Cursos de ensayos clínicos y buenas prácticas clínicas',
    description: 'Qué cambió con la ICH E6(R3), qué exige la Resolución 2378 de 2008 en Colombia y los cursos de GCP y operaciones de ensayos clínicos para formarte.',
    readingTime: '7 min',
    image: '/img/escuelas/regulatorios.webp',
    imageAlt: 'Equipo de investigación clínica revisando un protocolo',
    keywords: ['curso de buenas prácticas clínicas', 'curso de ensayos clínicos', 'curso gcp', 'ich e6 r3', 'curso de investigación clínica', 'resolución 2378 de 2008'],
  }),
  post({
    slug: 'cursos-de-ingles-para-profesionales-de-la-salud',
    title: 'Cursos de inglés para profesionales de la salud y químicos farmacéuticos',
    seoTitle: 'Cursos de inglés para profesionales de la salud',
    description: 'Qué nivel de inglés piden las vacantes, cursos de inglés A1 a B2 y cursos de farmacia en inglés para practicar el vocabulario técnico.',
    readingTime: '6 min',
    image: '/img/publicos/profesionales.webp',
    imageAlt: 'Profesional de la salud estudiando inglés técnico',
    keywords: ['curso de inglés para profesionales de la salud', 'inglés para químicos farmacéuticos', 'curso de inglés gratis con certificado', 'inglés técnico farmacéutico', 'curso de inglés b1', 'edutin inglés'],
  }),
  post({
    slug: 'cursos-de-farmacologia-gratis',
    title: 'Cursos de farmacología gratis y online para profesionales de la salud (2026)',
    seoTitle: 'Cursos de farmacología gratis y online',
    description: 'Doce cursos gratuitos de farmacología por sistemas, cuatro de farmacoterapia y cursos de farmacocinética en Coursera y Edutin, con certificado opcional.',
    readingTime: '7 min',
    image: '/img/escuelas/salud.webp',
    imageAlt: 'Estudiante de farmacia repasando farmacología',
    keywords: ['cursos de farmacología gratis', 'curso de farmacología online', 'curso de farmacología con certificado', 'curso de farmacocinética', 'farmacología clínica curso', 'curso de farmacología para enfermería'],
  }),

  // ── Lote 3 (12-nov-2026): nutrición, primeros auxilios y pediatría, Excel,
  // marketing, proyectos y logística, con enlaces de afiliado de Karla.
  // Normas verificadas en fuente oficial: Resolución 1896 de 2023,
  // Resolución 1403 de 2007, Ley 1581 de 2012 y las GABA del ICBF.
  post({
    slug: 'cursos-de-nutricion-online-con-certificado',
    title: 'Cursos de nutrición online con certificado: cuáles tomar según tu objetivo (2026)',
    seoTitle: 'Cursos de nutrición online con certificado (2026)',
    description: 'Cursos de nutrición online en español con certificado: Nutrición, Nutrición avanzada e infantil en Edutin, y la nutrición aplicada a los medicamentos.',
    readingTime: '7 min',
    image: '/img/nutricion.jpg',
    imageAlt: 'Alimentos frescos sobre una mesa junto a un cuaderno de estudio',
    keywords: ['curso de nutrición online', 'curso de nutrición gratis con certificado', 'curso de nutrición infantil', 'curso de nutrición avanzada', 'curso de manipulación de alimentos', 'guías alimentarias colombia', 'interacciones alimentos medicamentos'],
  }),
  post({
    slug: 'cursos-de-primeros-auxilios-y-pediatria',
    title: 'Cursos de primeros auxilios y pediatría online: qué aprender y qué practicar en persona',
    seoTitle: 'Cursos de primeros auxilios y pediatría online',
    description: 'Cursos online de primeros auxilios pediátricos, pediatría y enfermería en español, qué parte exige práctica presencial y cómo dosificar bien en niños.',
    readingTime: '7 min',
    image: '/img/escuelas/salud.webp',
    imageAlt: 'Persona practicando primeros auxilios con un maniquí infantil',
    keywords: ['curso de primeros auxilios pediátricos', 'curso de primeros auxilios online', 'curso de primeros auxilios gratis', 'curso de pediatría online', 'atragantamiento en bebés', 'dosis de medicamentos en niños', 'curso de enfermería online'],
  }),
  post({
    slug: 'cursos-de-excel-para-profesionales-de-la-salud',
    title: 'Cursos de Excel para profesionales de la salud y la farmacia: de lo básico a los tableros',
    seoTitle: 'Cursos de Excel para profesionales de la salud',
    description: 'Cursos de Excel en Edutin, Coursera y Udemy, las funciones más usadas en farmacia y calidad, y ejercicios con vencimientos, temperatura e indicadores.',
    readingTime: '8 min',
    image: '/img/herramienta-datos.jpg',
    imageAlt: 'Hoja de cálculo con un control de inventario y vencimientos',
    keywords: ['curso de excel gratis con certificado', 'curso de excel para farmacia', 'excel para profesionales de la salud', 'control de vencimientos en excel', 'curso de análisis de datos', 'buscarx', 'tablas dinámicas'],
  }),
  post({
    slug: 'cursos-de-marketing-farmaceutico-y-digital',
    title: 'Cursos de marketing farmacéutico y digital para el sector salud (2026)',
    seoTitle: 'Cursos de marketing farmacéutico y digital en salud',
    description: 'Cursos de marketing digital de Google y Edutin, ventas B2B y comunicación, y lo que exige la Resolución 1896 de 2023 sobre publicidad de medicamentos.',
    readingTime: '8 min',
    image: '/img/escuelas/marketing.webp',
    imageAlt: 'Equipo revisando piezas de comunicación de salud en una pantalla',
    keywords: ['curso de marketing farmacéutico', 'curso de marketing digital con certificado', 'certificado de google marketing digital', 'resolución 1896 de 2023', 'publicidad de medicamentos en colombia', 'curso de ventas b2b', 'visitador médico curso'],
  }),
  post({
    slug: 'cursos-de-gestion-de-proyectos-con-certificado',
    title: 'Cursos de gestión de proyectos con certificado: Google, Microsoft y opciones gratis (2026)',
    seoTitle: 'Cursos de gestión de proyectos con certificado (2026)',
    description: 'Los certificados de gestión de proyectos de Google y Microsoft, Clinical Project Management y un curso gratis en Edutin, aplicados al sector farmacéutico.',
    readingTime: '7 min',
    image: '/img/publicos/profesionales.webp',
    imageAlt: 'Profesional revisando el cronograma de un proyecto',
    keywords: ['curso de gestión de proyectos con certificado', 'certificado de gestión de proyectos de google', 'curso de gestión de proyectos gratis', 'clinical project management', 'certificación pmp', 'microsoft project management', 'proyectos en la industria farmacéutica'],
  }),
  post({
    slug: 'cursos-de-logistica-farmaceutica-y-cadena-de-suministro',
    title: 'Cursos de logística farmacéutica y cadena de suministro: inventarios, almacenamiento y distribución',
    seoTitle: 'Cursos de logística farmacéutica y cadena de suministro',
    description: 'Cursos de logística, inventarios y supply chain en Edutin y Coursera, y lo que pide la Resolución 1403 de 2007 para almacenar y distribuir medicamentos.',
    readingTime: '8 min',
    image: '/img/herramienta-farmaceutica.jpg',
    imageAlt: 'Estantería de una bodega de medicamentos organizada por lotes',
    keywords: ['curso de logística farmacéutica', 'curso de logística gratis', 'curso de supply chain', 'curso de inventarios', 'almacenamiento de medicamentos', 'resolución 1403 de 2007', 'cadena de suministro farmacéutica'],
  }),
];

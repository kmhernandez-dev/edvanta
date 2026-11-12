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
];

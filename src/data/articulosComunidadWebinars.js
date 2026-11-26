/**
 * Artículos propios de la campaña de comunidad y webinars (nov-2026).
 * El texto vive en /public/articulos/articulos_edvanta/comunidad-farmaceutica/.
 * No son contenido clínico: son guías de práctica profesional, carrera y
 * formación. Por eso van como marca 'edvanta' y público profesional.
 */
const BASE = '/articulos/articulos_edvanta/comunidad-farmaceutica';

const articulo = (datos) => ({
  marca: 'edvanta',
  publico: 'profesionales',
  autor: 'Equipo editorial de Edvanta',
  date: '2026-11-25',
  updated: '2026-11-25',
  image: '/img/og-edvanta.png',
  imageAlt: 'Portada de Edvanta para la guía de comunidad y formación farmacéutica',
  mdPath: `${BASE}/${datos.slug}.md`,
  ...datos,
});

export const ARTICULOS_COMUNIDAD_WEBINARS = [
  articulo({
    slug: 'comunidad-de-quimicos-farmaceuticos-como-elegir',
    category: 'Comunidad farmacéutica',
    title: 'Comunidad de químicos farmacéuticos: cómo elegir una que aporte a tu carrera',
    seoTitle: 'Comunidad de químicos farmacéuticos: cómo elegir',
    description: 'Qué mirar antes de entrar a una comunidad farmacéutica, cómo participar para recibir ayuda real y cómo proteger los datos de tus pacientes.',
    seoDescription: 'Criterios para elegir una comunidad de químicos farmacéuticos, participar con criterio y convertirla en una red útil para tu carrera.',
    readingTime: '8 min',
  }),
  articulo({
    slug: 'red-profesional-farmaceutica-networking',
    category: 'Comunidad farmacéutica',
    title: 'Red profesional farmacéutica: cómo construir contactos con criterio',
    seoTitle: 'Red profesional farmacéutica: networking',
    description: 'Cómo construir una red profesional farmacéutica antes de necesitarla, qué escribir y cómo mantener el contacto sin invadir.',
    seoDescription: 'Guía para construir una red profesional farmacéutica útil: mensajes, seguimiento y oportunidades sin pedir favores.',
    readingTime: '7 min',
  }),
  articulo({
    slug: 'comunidad-farmaceutica-para-estudiantes',
    category: 'Comunidad farmacéutica',
    title: 'Comunidad farmacéutica para estudiantes: qué buscar y cómo participar',
    seoTitle: 'Comunidad farmacéutica para estudiantes',
    description: 'Cómo elegir una comunidad mientras estudias, qué preguntar sin miedo y cómo transformar la participación en prácticas y empleo.',
    seoDescription: 'Qué buscar en una comunidad farmacéutica para estudiantes y cómo participar para aprender, conectar y encontrar oportunidades.',
    readingTime: '7 min',
  }),
  articulo({
    slug: 'mentoria-farmaceutica',
    category: 'Comunidad farmacéutica',
    title: 'Mentoría farmacéutica: cómo pedirla, aprovecharla y devolverla',
    seoTitle: 'Mentoría farmacéutica: guía práctica',
    description: 'Cómo encontrar un mentor, qué pedir en la primera conversación y cómo medir si la mentoría te está sirviendo.',
    seoDescription: 'Guía para pedir y aprovechar una mentoría farmacéutica con objetivos claros, respeto por el tiempo y seguimiento.',
    readingTime: '8 min',
  }),
  articulo({
    slug: 'webinars-para-quimicos-farmaceuticos',
    category: 'Webinars y formación',
    title: 'Webinars para químicos farmacéuticos: cómo elegir y aprovechar cada sesión',
    seoTitle: 'Webinars para químicos farmacéuticos',
    description: 'Cómo distinguir un webinar útil de una charla comercial, qué preparar antes y cómo convertir lo aprendido en una acción.',
    seoDescription: 'Criterios para elegir webinars farmacéuticos, preparar preguntas y evaluar si la sesión cambió algo en tu práctica.',
    readingTime: '8 min',
  }),
  articulo({
    slug: 'curso-webinar-o-diplomado',
    category: 'Webinars y formación',
    title: 'Curso, webinar o diplomado: qué elegir según tu objetivo profesional',
    seoTitle: 'Curso, webinar o diplomado: cómo elegir',
    description: 'Diferencias reales entre formatos de formación farmacéutica y cómo elegir según el problema que quieres resolver.',
    seoDescription: 'Compara curso, webinar y diplomado para elegir la formación farmacéutica que corresponde a tu objetivo y a tu tiempo.',
    readingTime: '9 min',
  }),
  articulo({
    slug: 'educacion-continua-farmaceutica',
    category: 'Webinars y formación',
    title: 'Educación continua farmacéutica: cómo sostenerla sin dejar tu trabajo',
    seoTitle: 'Educación continua farmacéutica',
    description: 'Un plan realista para actualizarte durante el año, elegir formación y demostrar lo aprendido en el trabajo.',
    seoDescription: 'Cómo planear la educación continua farmacéutica con objetivos, tiempo protegido y evidencia de aplicación.',
    readingTime: '8 min',
  }),
  articulo({
    slug: 'capacitacion-farmaceutica-para-instituciones',
    category: 'Instituciones',
    title: 'Capacitación farmacéutica para instituciones: cómo diseñar un plan que se aplique',
    seoTitle: 'Capacitación farmacéutica para instituciones',
    description: 'Cómo pasar de charlas sueltas a un plan de formación para equipos de farmacia con brechas, responsables y evaluación.',
    seoDescription: 'Método para diseñar un plan de capacitación farmacéutica para hospitales, IPS, droguerías y empresas, con seguimiento en el puesto.',
    readingTime: '10 min',
  }),
  articulo({
    slug: 'medir-impacto-capacitacion-servicio-farmaceutico',
    category: 'Instituciones',
    title: 'Cómo medir el impacto de una capacitación en el servicio farmacéutico',
    seoTitle: 'Medir el impacto de una capacitación',
    description: 'Indicadores de actividad, aprendizaje y aplicación para demostrar si una capacitación cambió el trabajo del equipo.',
    seoDescription: 'Cómo elegir indicadores y evidencia para medir el impacto de una capacitación en el servicio farmacéutico.',
    readingTime: '9 min',
  }),
  articulo({
    slug: 'webinar-corporativo-sector-salud',
    category: 'Instituciones',
    title: 'Webinar corporativo para el sector salud: cuándo conviene y cómo pedirlo',
    seoTitle: 'Webinar corporativo para el sector salud',
    description: 'Cuándo un webinar cerrado resuelve una necesidad de formación, qué información dar al proveedor y cómo evaluar el resultado.',
    seoDescription: 'Guía para decidir, solicitar y evaluar un webinar corporativo para equipos de farmacia y salud.',
    readingTime: '8 min',
  }),
];

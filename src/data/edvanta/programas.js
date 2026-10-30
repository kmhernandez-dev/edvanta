/**
 * ============================================================
 *  programas.js — Identidades que viven dentro de Edvanta
 *
 *  AtenFarmaClinic y Feliz Sin Tiroides conservan su nombre, su logo y
 *  sus páginas. Aquí solo se declara a qué escuela pertenecen y a quién
 *  sirven, para que el resto del sitio las presente como parte de
 *  Edvanta y no como empresas aparte.
 *
 *  «Felicitiroides» y «Feliz Sin Tiroides» son la misma iniciativa. El
 *  proyecto la publica como Feliz Sin Tiroides (logo, correos, rutas y
 *  marca registrada), así que ese es el único nombre público.
 *
 *  Edvanta Contigo es el paraguas para pacientes y cuidadores. Las rutas
 *  por condición no son marcas ni dominios: son secciones. Solo la de
 *  tiroides tiene contenido hoy; las demás se muestran como lo que son,
 *  rutas en desarrollo, y permiten dejar el correo para el aviso.
 * ============================================================
 */

export const PROGRAMAS = {
  atenfarmaclinic: {
    slug: 'atenfarmaclinic',
    nombre: 'AtenFarmaClinic',
    escuela: 'salud-y-farmacia-clinica',
    publico: 'profesionales',
    texto: 'Herramientas y artículos para la práctica de la farmacia clínica y la atención farmacéutica.',
    to: '/atenfarmaclinic',
    logo: '/img/port-logoatenfarmaclinic.jpg',
  },
  'feliz-sin-tiroides': {
    slug: 'feliz-sin-tiroides',
    nombre: 'Feliz Sin Tiroides',
    escuela: 'salud-y-farmacia-clinica',
    publico: 'pacientes',
    texto: 'Programa especializado en salud tiroidea, creado por una química farmacéutica que vive sin tiroides. Guías, recetas, comunidad y acompañamiento educativo.',
    to: '/feliz-sin-tiroides',
    logo: '/img/port-logofelizsintiroides.jpg',
  },
};

export const EDVANTA_CONTIGO = {
  nombre: 'Edvanta Contigo',
  lema: 'Comprende tu salud. Participa en tu cuidado.',
  texto:
    'Educación en salud para pacientes, familias y cuidadores, en lenguaje claro, preparada por una química farmacéutica. Te ayuda a entender tu condición y a preparar tus consultas. No reemplaza la atención de tu médico ni de tu equipo de salud.',
};

/** Rutas educativas por condición. Solo una tiene contenido publicado. */
export const RUTAS_CONTIGO = [
  {
    slug: 'tiroides',
    nombre: 'Salud tiroidea',
    programa: 'feliz-sin-tiroides',
    estado: 'disponible', imagen: '/img/contigo/tiroides.webp',
    texto: 'Hipotiroidismo, Hashimoto, vivir sin tiroides y cómo tomar la levotiroxina.',
    to: '/contigo/tiroides',
  },
  { slug: 'ruta-diabetes', nombre: 'Tu Ruta Diabetes', estado: 'en_desarrollo', imagen: '/img/contigo/ruta-diabetes.webp', texto: 'Para comprender la diabetes, sus medicamentos y el día a día.' },
  { slug: 'ruta-renal', nombre: 'Tu Ruta Renal', estado: 'en_desarrollo', imagen: '/img/contigo/ruta-renal.webp', texto: 'Para quienes viven con enfermedad renal y para sus cuidadores.' },
  { slug: 'ruta-cardiovascular', nombre: 'Tu Ruta Cardiovascular', estado: 'en_desarrollo', imagen: '/img/contigo/ruta-cardiovascular.webp', texto: 'Presión arterial, colesterol y medicamentos del corazón.' },
  { slug: 'ruta-respiratoria', nombre: 'Tu Ruta Respiratoria', estado: 'en_desarrollo', imagen: '/img/contigo/ruta-respiratoria.webp', texto: 'Asma, EPOC y el uso correcto de los inhaladores.' },
  { slug: 'ruta-oncologica', nombre: 'Tu Ruta Oncológica', estado: 'en_desarrollo', imagen: '/img/contigo/ruta-oncologica.webp', texto: 'Para pacientes en tratamiento oncológico y sus familias.' },
];

/** Los tres formatos de Edvanta Contigo y qué hay hoy de cada uno. */
export const FORMATOS_CONTIGO = [
  {
    id: 'aulas',
    nombre: 'Aulas Contigo',
    tipo: 'Talleres educativos en vivo',
    texto: 'Sesiones por videollamada sobre un tema concreto, con tiempo para preguntas.',
    estado: 'en_desarrollo', imagen: '/img/contigo/aulas-contigo.webp',
  },
  {
    id: 'guias',
    nombre: 'Guías Contigo',
    tipo: 'E-books, agendas de consulta y recursos prácticos',
    texto: 'Material para leer en casa, llevar a la consulta y compartir con la familia.',
    estado: 'disponible', imagen: '/img/contigo/guias-contigo.webp',
    nota: 'Hoy: la guía gratuita de levotiroxina y las guías de Feliz Sin Tiroides.',
  },
  {
    id: 'encuentros',
    nombre: 'Encuentros Contigo',
    tipo: 'Espacios de orientación y preguntas',
    texto: 'Encuentros grupales para resolver dudas generales sobre una condición. Son educativos: no son consultas individuales.',
    estado: 'en_desarrollo', imagen: '/img/contigo/encuentros-contigo.webp',
  },
];

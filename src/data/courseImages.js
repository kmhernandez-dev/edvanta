/**
 * Portadas editoriales propias para los cursos destacados de Edvanta.
 *
 * El título y los datos del curso permanecen en HTML. Las imágenes no llevan
 * texto incrustado para conservar legibilidad, accesibilidad y adaptación a
 * distintos tamaños de tarjeta.
 */
export const EDVANTA_COURSE_IMAGES = {
  'gestion-de-calidad': {
    edutinId: 12938,
    src: '/img/cursos/edvanta/gestion-de-calidad.webp',
    alt: 'Sistema de procesos conectados con elementos de revisión y mejora continua',
  },
  'power-bi': {
    edutinId: 12532,
    src: '/img/cursos/edvanta/power-bi.webp',
    alt: 'Visualizaciones de datos, indicadores y tendencias en un entorno digital',
  },
  auditoria: {
    edutinId: 13109,
    src: '/img/cursos/edvanta/auditoria.webp',
    alt: 'Lista de verificación, evidencias y lupa para una auditoría profesional',
  },
  'gestion-ambiental': {
    edutinId: 13469,
    src: '/img/cursos/edvanta/gestion-ambiental.webp',
    alt: 'Ciclo de recursos, agua, industria limpia y naturaleza para gestión ambiental',
  },
  'seguridad-y-salud-en-el-trabajo': {
    edutinId: 12987,
    src: '/img/cursos/edvanta/seguridad-y-salud-en-el-trabajo.webp',
    alt: 'Casco, botiquín y barreras de prevención para seguridad en el trabajo',
  },
  'gestion-de-proyectos': {
    edutinId: 12549,
    src: '/img/cursos/edvanta/gestion-de-proyectos.webp',
    alt: 'Ruta con hitos, tablero de tareas y equipo para gestionar un proyecto',
  },
  lean: {
    edutinId: 12578,
    src: '/img/cursos/edvanta/lean.webp',
    alt: 'Flujo ordenado que transforma un proceso disperso en una secuencia eficiente',
  },
  'lean-six-sigma': {
    edutinId: 12588,
    src: '/img/cursos/edvanta/lean-six-sigma.webp',
    alt: 'Ciclo de mejora, medición y reducción de variabilidad en un proceso',
  },
};

const BY_EDUTIN_ID = Object.fromEntries(
  Object.values(EDVANTA_COURSE_IMAGES).map((image) => [String(image.edutinId), image]),
);

function imageSet(image) {
  if (!image) return null;
  return {
    src: image.src,
    jpg: image.src,
    webp: image.src,
    alt: image.alt,
  };
}

export function edvantaCourseImageBySlug(slug) {
  return imageSet(EDVANTA_COURSE_IMAGES[slug]);
}

export function edvantaCourseImageByEdutinId(edutinId) {
  return imageSet(BY_EDUTIN_ID[String(edutinId)]);
}

/**
 * Videos del Curso de Gestión de Calidad Farmacéutica (19-nov-2026).
 *
 * Pedido de Karla: clases con videos curados del canal de Edutin Academy y
 * de otros canales, en español. Todos los videos se verificaron con el
 * oEmbed oficial de YouTube (canal y disponibilidad).
 *
 *  · Edutin Academy donde el tema coincide con la clase.
 *  · Los videos en inglés se reemplazan por uno en español cuando existe.
 *    Para ICH Q10 e ICH Q12 no hay un video en español de calidad: se
 *    conserva el mejor en inglés y su título lo dice, para que nadie se
 *    sorprenda (la clase en texto explica todo en español).
 *  · Ninguna clase queda con más de dos videos.
 *
 * Ver scripts/generar-migracion-videos.mjs.
 */
export const CURSO = 'Curso de Gestión de Calidad Farmacéutica';
export const MIGRACION = '182_videos_gestion_calidad.sql';

const EN_INGLES = ' (en inglés, con subtítulos automáticos)';

export const CAMBIOS = [
  {
    clase: 'Evolución histórica de la calidad: de la inspección a la gestión total',
    agregar: [{ videoId: 'zglr9ngYYjs', titulo: 'Historia de la calidad: evolución y etapas (Edutin Academy)' }],
    retirar: ['ZpOraNGnh6E'],
  },
  {
    clase: 'Vocabulario esencial del SGC: requisito, conformidad, proceso, eficacia, eficiencia',
    agregar: [{ videoId: 'c0UCt35OR64', titulo: 'ISO 9000 e ISO 9001 versión 2015: generalidades (Edutin Academy)' }],
  },
  {
    clase: 'Cambios con impacto en la calidad y su trámite ante el INVIMA',
    agregar: [
      { videoId: 'kMhjktRya9w', titulo: 'Capacitación del INVIMA: trámite de registro sanitario de medicamentos' },
      { videoId: '7abeO2M6oAY', titulo: 'ISO 9001:2015: planificación de los cambios (Edutin Academy)' },
    ],
  },
  {
    clase: 'Introducción a la unidad: modelos de SGC aplicables al sector farmacéutico',
    retirar: ['ypevMm8fT0Y'],
  },
  {
    clase: 'Modelo ICH Q10: objetivos, ciclo de vida y responsabilidad de la dirección',
    retirar: ['OE9r-pXS3tE'],
    renombrar: { ypevMm8fT0Y: `ICH Q10: el sistema de calidad farmacéutico${EN_INGLES}` },
  },
  {
    clase: 'Habilitadores del PQS: gestión del conocimiento y gestión de riesgos de calidad',
    agregar: [{ videoId: 'C3zSq3I3Zl4', titulo: 'El proceso de gestión del riesgo según ISO 31000 (Edutin Academy)' }],
    retirar: ['oaZS5p_tXfE'],
  },
  {
    clase: 'Los cuatro elementos del PQS y su equivalente en las BPM europeas/PIC/S',
    agregar: [
      { videoId: 'YxPAoagpfh0', titulo: 'Webinar: gestión eficiente del control de cambios en la industria farmacéutica' },
      { videoId: 'ypevMm8fT0Y', titulo: `ICH Q10: el sistema de calidad farmacéutico${EN_INGLES}` },
    ],
  },
  {
    clase: 'Estructura de alto nivel de ISO 9001:2015, contexto y partes interesadas',
    agregar: [{ videoId: 'gKveWCovbF8', titulo: 'Norma ISO 9001:2015, capítulo 4: contexto de la organización (Edutin Academy)' }],
    retirar: ['YsTWXI5rnP8'],
  },
  {
    clase: 'Pensamiento basado en riesgos: riesgos y oportunidades en el SGC',
    agregar: [{ videoId: '8iPGlicbaPA', titulo: 'Matriz de riesgo (Edutin Academy)' }],
    retirar: ['i0b_gzANRD8'],
  },
  {
    clase: 'ICH Q10 vs. ISO 9001 vs. BPM: comparación e integración',
    agregar: [{ videoId: 'c0UCt35OR64', titulo: 'ISO 9000 e ISO 9001 versión 2015: generalidades (Edutin Academy)' }],
    renombrar: { ypevMm8fT0Y: `ICH Q10: el sistema de calidad farmacéutico${EN_INGLES}` },
  },
  {
    clase: 'Enfoque basado en procesos: entradas, salidas, interacciones y dueños',
    agregar: [{ videoId: 'fRJ5zxVvqeA', titulo: 'Planificación de recursos por proceso (Edutin Academy)' }],
  },
  {
    clase: 'Mapa de procesos y caracterización de procesos de un laboratorio farmacéutico',
    agregar: [{ videoId: 'NFXSk7eXLe4', titulo: 'Qué es un mapa de procesos (Edutin Academy)' }],
    retirar: ['KGgVqjc8gb8', 'ntHaV4iy1WQ'],
  },
  {
    clase: 'Métricas de calidad farmacéutica: lotes rechazados, quejas, desviaciones y CAPA',
    agregar: [{ videoId: 'H2Uineu1jSM', titulo: 'Los indicadores en procesos y funciones farmacéuticas (Universidad de Antioquia)' }],
  },
  {
    clase: 'Revisión por la dirección: entradas, salidas y requisitos (ISO 9001 9.3 e ICH Q10)',
    agregar: [{ videoId: 'JLPZQmXXJTo', titulo: 'Norma ISO 9001:2015, capítulo 9: evaluación del desempeño (Edutin Academy)' }],
    retirar: ['ENXs4hJ2VmY'],
  },
  {
    clase: 'Ciclo PHVA aplicado a la planta y al servicio farmacéutico',
    agregar: [{ videoId: 'nrGywf90osA', titulo: 'Ciclo PHVA: planear, hacer, verificar y actuar (Edutin Academy)' }],
    retirar: ['iv91_2N6VDA'],
  },
  {
    clase: 'Herramientas de mejora: Kaizen, Lean y mejora del desempeño del proceso (ICH Q10)',
    agregar: [
      { videoId: 'HkVRGdb0814', titulo: 'Principios de la metodología Kaizen (Edutin Academy)' },
      { videoId: '-KrytCpPCfA', titulo: 'Qué es Lean Manufacturing (Edutin Academy)' },
    ],
    retirar: ['s4weEa6zbSw', '0kk0IinUQwU'],
  },
  {
    clase: 'Sistema de gestión del cambio según ICH Q10: evaluación, aprobación, implementación y verificación',
    agregar: [{ videoId: '7abeO2M6oAY', titulo: 'ISO 9001:2015: planificación de los cambios (Edutin Academy)' }],
    retirar: ['Yk7JeLfEYoc'],
  },
  {
    clase: 'Clasificación de cambios e impacto regulatorio: ICH Q12 y guía de modificaciones INVIMA',
    agregar: [{ videoId: 'YxPAoagpfh0', titulo: 'Webinar: gestión eficiente del control de cambios en la industria farmacéutica' }],
    renombrar: { 'GK-PMJ6auyI': `Clasificación de cambios: menores, moderados y mayores${EN_INGLES}` },
  },
  {
    clase: 'Cultura de calidad: liderazgo, comportamiento y medición',
    agregar: [{ videoId: 'C2u55oziHZg', titulo: 'Calidad total y mejora continua en la gerencia (Edutin Academy)' }],
    retirar: ['OIGsWwMdl0I'],
  },
  {
    clase: 'Hoja de ruta para implementar o fortalecer un SGC farmacéutico',
    agregar: [{ videoId: '_e79cMwEFXw', titulo: 'Cómo diseñar un sistema de gestión de la calidad (Edutin Academy)' }],
    retirar: ['BKZ1PhzGvO0'],
  },
];

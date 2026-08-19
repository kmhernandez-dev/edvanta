/**
 * ============================================================
 *  lib/orientacion.js — Orientación profesional gratuita (QF)
 *
 *  Mini diagnóstico inicial de Edvanta: situación, objetivo,
 *  áreas de interés y nivel de experiencia. Produce un área
 *  recomendada con competencias y primeros pasos.
 *
 *  Fase actual:
 *  - El resultado es una recomendación inicial (reglas locales,
 *    sin motor de IA). Se guarda en localStorage y, si el
 *    usuario tiene sesión, en professional_profiles.
 *
 *  Preparado para la siguiente fase:
 *  - Cada competencia tiene `courseProviders` con las
 *    plataformas (Edutin, Udemy, Coursera, edX) y `catalogKey`
 *    para conectar el catálogo de cursos sin cambiar el modal.
 *  - El payload guardado alimentará Mi Edvanta, cursos
 *    recomendados, recursos, herramientas y vacantes.
 * ============================================================
 */

// ─── Pregunta 1: situación actual ────────────────────────────
export const SITUACIONES = [
  'Soy estudiante de Química Farmacéutica.',
  'Soy Químico Farmacéutico recién graduado.',
  'Ya trabajo como Químico Farmacéutico.',
  'Trabajo en otra área y quiero entrar al sector farmacéutico.',
];

// ─── Pregunta 2: objetivo actual ─────────────────────────────
export const OBJETIVOS = [
  'Conseguir mi primer empleo.',
  'Entrar a la industria farmacéutica.',
  'Cambiar de área profesional.',
  'Fortalecer mi perfil actual.',
  'Prepararme para una entrevista.',
  'Actualizar mis conocimientos.',
  'Todavía no sé qué área elegir.',
];

// ─── Pregunta 3: áreas de interés (selección múltiple) ───────
export const AREAS_INTERES = [
  'Garantía de Calidad',
  'Control de Calidad',
  'Validaciones',
  'Producción',
  'Asuntos Regulatorios',
  'Farmacovigilancia',
  'Farmacia Asistencial',
  'Logística Farmacéutica',
  'Investigación y Desarrollo',
  'No estoy seguro',
];

// ─── Pregunta 4: nivel de experiencia ────────────────────────
export const NIVELES_EXPERIENCIA = [
  'Ninguna',
  'Básica',
  'Intermedia',
  'Avanzada',
];

// ─── Catálogo de áreas QF ────────────────────────────────────
// `skills`: competencias recomendadas. Cada una deja preparada
// la conexión con cursos externos (Edutin, Udemy, Coursera, edX)
// vía `catalogKey` + `courseProviders`. `catalogReady: false`
// indica que el catálogo completo aún no está conectado.
export const AREAS_QF = [
  {
    slug: 'garantia-calidad',
    name: 'Garantía de Calidad',
    professionalCareerSlug: 'aseguramiento-calidad',
    affinity: ['Garantía de Calidad', 'Validaciones', 'Producción'],
    firstStep: 'Gestión de Calidad',
    nextSteps: ['Gestión del Riesgo', 'Auditoría Interna', 'BPM'],
    catalogReady: false,
    skills: [
      { name: 'BPM / GMP', catalogKey: 'bpm-gmp', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Gestión de calidad', catalogKey: 'gestion-calidad', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Gestión del riesgo', catalogKey: 'gestion-riesgo', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'CAPA', catalogKey: 'capa', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Auditorías', catalogKey: 'auditorias', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Control de cambios', catalogKey: 'control-cambios', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Data Integrity', catalogKey: 'data-integrity', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
    ],
  },
  {
    slug: 'control-calidad',
    name: 'Control de Calidad',
    professionalCareerSlug: 'control-calidad',
    affinity: ['Control de Calidad', 'Investigación y Desarrollo'],
    firstStep: 'Análisis fisicoquímico y HPLC',
    nextSteps: ['OOS y desviaciones de laboratorio', 'Estabilidad de medicamentos', 'Muestreo y especificaciones'],
    catalogReady: false,
    skills: [
      { name: 'HPLC y cromatografía', catalogKey: 'hplc', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Manejo de OOS', catalogKey: 'oos', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Estabilidad', catalogKey: 'estabilidad', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Muestreo y especificaciones', catalogKey: 'muestreo', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Métodos analíticos', catalogKey: 'metodos-analiticos', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Data Integrity en laboratorio', catalogKey: 'data-integrity-lab', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
    ],
  },
  {
    slug: 'validaciones',
    name: 'Validaciones',
    professionalCareerSlug: 'validaciones',
    affinity: ['Validaciones', 'Garantía de Calidad', 'Producción'],
    firstStep: 'Validación de procesos',
    nextSteps: ['IQ · OQ · PQ', 'Validación de limpieza', 'Validación de sistemas computarizados'],
    catalogReady: false,
    skills: [
      { name: 'IQ · OQ · PQ', catalogKey: 'iq-oq-pq', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Validación de procesos', catalogKey: 'validacion-procesos', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Validación de limpieza', catalogKey: 'validacion-limpieza', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Sistemas computarizados (CSV)', catalogKey: 'csv', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Ciclo de vida de validación', catalogKey: 'ciclo-vida-validacion', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
    ],
  },
  {
    slug: 'produccion',
    name: 'Producción',
    professionalCareerSlug: 'produccion-farmaceutica',
    affinity: ['Producción', 'Logística Farmacéutica', 'Garantía de Calidad'],
    firstStep: 'BPM aplicadas a producción',
    nextSteps: ['Aseguramiento de calidad en planta', 'Optimización de procesos', 'Lean manufacturing'],
    catalogReady: false,
    skills: [
      { name: 'BPM / GMP', catalogKey: 'bpm-gmp', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Producción farmacéutica', catalogKey: 'produccion-farmaceutica', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Optimización de procesos', catalogKey: 'optimizacion-procesos', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Lean y mejora continua', catalogKey: 'lean', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Documentación de lote', catalogKey: 'documentacion-lote', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
    ],
  },
  {
    slug: 'asuntos-regulatorios',
    name: 'Asuntos Regulatorios',
    professionalCareerSlug: 'asuntos-regulatorios',
    affinity: ['Asuntos Regulatorios', 'Farmacovigilancia'],
    firstStep: 'Registros sanitarios',
    nextSteps: ['Normativa sanitaria', 'Dossier técnico (CTD)', 'Etiquetado y publicidad'],
    catalogReady: false,
    skills: [
      { name: 'Registros sanitarios', catalogKey: 'registros-sanitarios', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Normativa sanitaria', catalogKey: 'normativa-sanitaria', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Dossier CTD', catalogKey: 'ctd', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Cumplimiento regulatorio', catalogKey: 'cumplimiento-regulatorio', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Etiquetado y rotulado', catalogKey: 'etiquetado', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
    ],
  },
  {
    slug: 'farmacovigilancia',
    name: 'Farmacovigilancia',
    professionalCareerSlug: 'farmacovigilancia',
    affinity: ['Farmacovigilancia', 'Farmacia Asistencial', 'Asuntos Regulatorios'],
    firstStep: 'Gestión de ICSR',
    nextSteps: ['Señales de seguridad', 'PSUR e informes periódicos', 'Legislación de farmacovigilancia'],
    catalogReady: false,
    skills: [
      { name: 'ICSR', catalogKey: 'icsr', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Detección de señales', catalogKey: 'senales', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'PSUR', catalogKey: 'psur', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Reportes de seguridad', catalogKey: 'reportes-seguridad', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Gestión de riesgo de medicamentos', catalogKey: 'gestion-riesgo-fv', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
    ],
  },
  {
    slug: 'farmacia-asistencial',
    name: 'Farmacia Asistencial',
    professionalCareerSlug: null,
    affinity: ['Farmacia Asistencial', 'Farmacovigilancia'],
    firstStep: 'Atención farmacéutica',
    nextSteps: ['Seguimiento farmacoterapéutico', 'Dispensación y consejería', 'Farmacoepidemiología básica'],
    catalogReady: false,
    skills: [
      { name: 'Atención farmacéutica', catalogKey: 'atencion-farmaceutica', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Seguimiento farmacoterapéutico', catalogKey: 'seguimiento-farmaco', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Dispensación y consejería', catalogKey: 'dispensacion', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Educación al paciente', catalogKey: 'educacion-paciente', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
    ],
  },
  {
    slug: 'logistica',
    name: 'Logística Farmacéutica',
    professionalCareerSlug: null,
    affinity: ['Logística Farmacéutica', 'Producción'],
    firstStep: 'Buenas Prácticas de Distribución (GDP)',
    nextSteps: ['Cadena de frío', 'Almacenamiento y despacho', 'Gestión de inventarios'],
    catalogReady: false,
    skills: [
      { name: 'Buenas Prácticas de Distribución', catalogKey: 'gdp', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Cadena de frío', catalogKey: 'cadena-frio', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Almacenamiento farmacéutico', catalogKey: 'almacenamiento', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Gestión de inventarios', catalogKey: 'inventarios', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
    ],
  },
  {
    slug: 'investigacion-desarrollo',
    name: 'Investigación y Desarrollo',
    professionalCareerSlug: 'investigacion-desarrollo',
    affinity: ['Investigación y Desarrollo', 'Control de Calidad'],
    firstStep: 'Desarrollo farmacéutico',
    nextSteps: ['Preformulación', 'Diseño experimental (DoE)', 'Escalado y transferencia de tecnología'],
    catalogReady: false,
    skills: [
      { name: 'Desarrollo farmacéutico', catalogKey: 'desarrollo-farmaceutico', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Preformulación', catalogKey: 'preformulacion', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Diseño experimental (DoE)', catalogKey: 'doe', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Escalado de procesos', catalogKey: 'escalado', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
      { name: 'Documentación técnica de I+D', catalogKey: 'documentacion-id', courseProviders: ['Edutin', 'Udemy', 'Coursera', 'edX'] },
    ],
  },
];

// ─── Fallback por objetivo (cuando el usuario no elige áreas) ─
const FALLBACK_POR_OBJETIVO = {
  'Conseguir mi primer empleo.': 'control-calidad',
  'Entrar a la industria farmacéutica.': 'garantia-calidad',
  'Cambiar de área profesional.': 'asuntos-regulatorios',
  'Fortalecer mi perfil actual.': null,
  'Prepararme para una entrevista.': null,
  'Actualizar mis conocimientos.': null,
  'Todavía no sé qué área elegir.': 'garantia-calidad',
};

export function getAreaBySlug(slug) {
  return AREAS_QF.find(area => area.slug === slug) || null;
}

export function getAreasByAffinity(tag) {
  return AREAS_QF.filter(area => area.affinity.includes(tag));
}

/**
 * Recomienda el área con mayor afinidad según los intereses
 * (P3), con desempate por objetivo (P2) y situación (P1).
 * Devuelve el área QF recomendada o null.
 */
export function recomendarArea({ situacion, objetivo, areas = [], nivel }) {
  const scored = new Map();
  const interests = (areas || []).filter(area => area !== 'No estoy seguro');

  interests.forEach(interes => {
    getAreasByAffinity(interes).forEach(area => {
      scored.set(area.slug, (scored.get(area.slug) || 0) + 1);
    });
  });

  if (scored.size === 0) {
    const fallbackSlug = FALLBACK_POR_OBJETIVO[objetivo];
    if (fallbackSlug) return getAreaBySlug(fallbackSlug);
    return AREAS_QF[0];
  }

  const ranked = [...scored.entries()].sort((a, b) => b[1] - a[1]);
  const maxScore = ranked[0][1];
  const winners = ranked.filter(([, score]) => score === maxScore);

  if (winners.length === 1) return getAreaBySlug(winners[0][0]);

  const fallbackSlug = FALLBACK_POR_OBJETIVO[objetivo];
  if (fallbackSlug && winners.some(([slug]) => slug === fallbackSlug)) {
    return getAreaBySlug(fallbackSlug);
  }
  return getAreaBySlug(winners[0][0]);
}

export const ORIENTACION_STORAGE_KEY = 'edvanta_orientacion';

/**
 * Arma el payload completo de la orientación. Este objeto es el
 * contrato para la siguiente fase (Mi Edvanta, cursos
 * recomendados, recursos, vacantes, asistente Edvanta).
 */
export function buildOrientacionResult({ situacion, objetivo, areas, nivel }) {
  const area = recomendarArea({ situacion, objetivo, areas, nivel });
  if (!area) return null;

  return {
    version: 1,
    createdAt: new Date().toISOString(),
    situacion,
    objetivo,
    areas: areas || [],
    nivel,
    areaRecomendada: area.name,
    areaSlug: area.slug,
    professionalCareerSlug: area.professionalCareerSlug,
    competencias: area.skills.map(skill => skill.name),
    competenciasCatalogo: area.skills,
    primerPaso: area.firstStep,
    siguientesPasos: area.nextSteps,
    catalogReady: area.catalogReady,
  };
}

export function saveOrientacionLocal(result) {
  try {
    localStorage.setItem(ORIENTACION_STORAGE_KEY, JSON.stringify(result));
  } catch {
    /* sin almacenamiento disponible: no rompe el flujo */
  }
}

export function loadOrientacionLocal() {
  try {
    const raw = localStorage.getItem(ORIENTACION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

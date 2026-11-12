import { ACADEMY_SECTIONS } from './academyCourses.js';

const HOY = '2026-11-07';
const BASE = '/articulos/articulos_edvanta/industria-cursos';

const AREAS = {
  'quality-assurance': {
    nombre: 'Aseguramiento de Calidad',
    slug: 'aseguramiento-de-calidad',
    imagen: '/img/escuelas/calidad.webp',
    skills: ['Sistemas de gestión de calidad', 'ISO 9001', 'BPM/GMP', 'CAPA y no conformidades', 'Auditorías internas'],
    roles: ['Analista de calidad', 'Auditor interno', 'Coordinador de SGC', 'Especialista en BPM'],
    fuentes: [['ISO', 'https://www.iso.org'], ['FDA', 'https://www.fda.gov'], ['INVIMA', 'https://www.invima.gov.co']],
  },
  'quality-control': {
    nombre: 'Control de Calidad Farmacéutico',
    slug: 'control-de-calidad-farmaceutico',
    imagen: '/img/escuelas/calidad.webp',
    skills: ['Control de calidad', 'HPLC', 'Validación de métodos', 'Estudios de estabilidad', 'Microbiología'],
    roles: ['Analista de control de calidad', 'Analista de HPLC', 'Especialista en estabilidad', 'Microbiólogo farmacéutico'],
    fuentes: [['FDA', 'https://www.fda.gov'], ['EMA', 'https://www.ema.europa.eu'], ['INVIMA', 'https://www.invima.gov.co']],
  },
  validations: {
    nombre: 'Validaciones y Calificaciones',
    slug: 'validaciones-y-calificaciones',
    imagen: '/img/escuelas/calidad.webp',
    skills: ['Validación de procesos', 'Validación de limpieza', 'CSV y GAMP 5', 'Calificación de equipos', 'Gestión de cambios'],
    roles: ['Especialista en validaciones', 'Ingeniero de calidad', 'Analista CSV', 'Coordinador de calificación'],
    fuentes: [['FDA', 'https://www.fda.gov'], ['EMA', 'https://www.ema.europa.eu'], ['PIC/S', 'https://picscheme.org']],
  },
  'regulatory-affairs': {
    nombre: 'Asuntos Regulatorios',
    slug: 'asuntos-regulatorios',
    imagen: '/img/escuelas/regulatorios.webp',
    skills: ['Registro sanitario', 'Expediente CTD', 'Regulación FDA y EMA', 'Etiquetado', 'Variaciones'],
    roles: ['Asistente regulatorio', 'Especialista en asuntos regulatorios', 'Analista de etiquetado', 'Coordinador de registros'],
    fuentes: [['INVIMA', 'https://www.invima.gov.co'], ['FDA', 'https://www.fda.gov'], ['ICH', 'https://www.ich.org']],
  },
  pharmacovigilance: {
    nombre: 'Farmacovigilancia',
    slug: 'farmacovigilancia',
    imagen: '/img/escuelas/salud.webp',
    skills: ['Farmacovigilancia', 'Reporte de eventos adversos', 'Detección de señales', 'Gestión de riesgos', 'Seguridad en ensayos clínicos'],
    roles: ['Analista de farmacovigilancia', 'Especialista en seguridad de medicamentos', 'Coordinador de PV', 'Analista de señales'],
    fuentes: [['OMS', 'https://www.who.int'], ['EMA', 'https://www.ema.europa.eu'], ['INVIMA', 'https://www.invima.gov.co']],
  },
  production: {
    nombre: 'Producción Farmacéutica',
    slug: 'produccion-farmaceutica',
    imagen: '/img/escuelas/calidad.webp',
    skills: ['Manufactura estéril', 'Formas sólidas', 'Empaque', 'Serialización', 'Transferencia de tecnología'],
    roles: ['Supervisor de producción', 'Operador de manufactura', 'Especialista en empaque', 'Coordinador de transferencia'],
    fuentes: [['FDA', 'https://www.fda.gov'], ['EMA', 'https://www.ema.europa.eu'], ['PIC/S', 'https://picscheme.org']],
  },
  'rnd-innovation': {
    nombre: 'Investigación y Desarrollo Farmacéutico',
    slug: 'investigacion-y-desarrollo-farmaceutico',
    imagen: '/img/escuelas/salud.webp',
    skills: ['Descubrimiento de fármacos', 'Formulación', 'Estudios preclínicos', 'Desarrollo analítico', 'Ensayos clínicos'],
    roles: ['Investigador de formulación', 'Analista de desarrollo', 'Asistente de I+D', 'Especialista en estudios preclínicos'],
    fuentes: [['PubMed', 'https://pubmed.ncbi.nlm.nih.gov'], ['FDA', 'https://www.fda.gov'], ['ICH', 'https://www.ich.org']],
  },
  'data-ai': {
    nombre: 'Datos e Inteligencia Artificial en Farmacia',
    slug: 'datos-e-inteligencia-artificial',
    imagen: '/img/clinico-digital.jpg',
    skills: ['Power BI', 'Python', 'SQL', 'IA aplicada', 'Evidencia del mundo real'],
    roles: ['Analista de datos', 'Especialista en BI', 'Consultor de IA farmacéutica', 'Analista de evidencia del mundo real'],
    fuentes: [['Microsoft Learn', 'https://learn.microsoft.com'], ['Python', 'https://www.python.org'], ['FDA', 'https://www.fda.gov']],
  },
};

const TOPICOS = [
  ['quality-assurance', 'ISO 9001', 'iso-9001', ['iso 9001']],
  ['quality-assurance', 'BPM y GMP', 'bpm-gmp', ['gmp', 'bpm', 'manufactura']],
  ['quality-assurance', 'GDP y documentación', 'gdp-documentacion', ['document', 'gdp']],
  ['quality-assurance', 'CAPA y desviaciones', 'capa-desviaciones', ['investig', 'capa', 'desviaci']],
  ['quality-assurance', 'Gestión de riesgos', 'gestion-de-riesgos', ['riesgo', 'risk']],
  ['quality-assurance', 'Auditoría farmacéutica', 'auditoria-farmaceutica', ['audit']],
  ['quality-assurance', 'Integridad de datos', 'integridad-de-datos', ['data', 'integridad']],
  ['quality-assurance', 'Lean Six Sigma', 'lean-six-sigma', ['lean', 'six sigma']],
  ['quality-control', 'HPLC', 'hplc', ['hplc']],
  ['quality-control', 'Validación de métodos analíticos', 'validacion-metodos-analiticos', ['method', 'validaci']],
  ['quality-control', 'Estudios de estabilidad', 'estudios-de-estabilidad', ['estabilidad', 'stability']],
  ['quality-control', 'Microbiología farmacéutica', 'microbiologia-farmaceutica', ['microbio']],
  ['quality-control', 'Investigaciones de laboratorio', 'investigaciones-de-laboratorio', ['investig']],
  ['quality-control', 'Análisis farmacéutico', 'analisis-farmaceutico', ['analysis', 'analisis']],
  ['validations', 'Validación de procesos', 'validacion-de-procesos', ['process', 'proceso']],
  ['validations', 'Validación de limpieza', 'validacion-de-limpieza', ['cleaning', 'limpieza']],
  ['validations', 'CSV y GAMP 5', 'csv-gamp5', ['csv', 'gamp']],
  ['validations', 'Calificación de HVAC', 'calificacion-hvac', ['hvac', 'cleanroom']],
  ['validations', 'Validación de equipos', 'validacion-de-equipos', ['equipment', 'equipo']],
  ['regulatory-affairs', 'Desarrollo de medicamentos', 'desarrollo-de-medicamentos', ['drug development', 'desarrollo']],
  ['regulatory-affairs', 'Regulación FDA', 'regulacion-fda', ['fda']],
  ['regulatory-affairs', 'Regulación EMA', 'regulacion-ema', ['ema', 'europe']],
  ['regulatory-affairs', 'Expediente CTD', 'expediente-ctd', ['ctd', 'regulatory']],
  ['regulatory-affairs', 'Dispositivos médicos', 'dispositivos-medicos', ['medical device', 'dispositivo']],
  ['regulatory-affairs', 'Etiquetado y publicidad', 'etiquetado-y-publicidad', ['label', 'etiquet']],
  ['pharmacovigilance', 'Seguridad de medicamentos', 'seguridad-de-medicamentos', ['safety', 'seguridad']],
  ['pharmacovigilance', 'Reporte de eventos adversos', 'reporte-de-eventos-adversos', ['pharmacovigilance', 'drug safety']],
  ['pharmacovigilance', 'Detección de señales', 'deteccion-de-senales', ['signal', 'señal']],
  ['pharmacovigilance', 'Plan de gestión de riesgos', 'plan-de-gestion-de-riesgos', ['risk management', 'riesgo']],
  ['pharmacovigilance', 'Farmacovigilancia en ensayos clínicos', 'farmacovigilancia-en-ensayos-clinicos', ['clinical', 'ensayo']],
  ['production', 'Manufactura estéril', 'manufactura-esteril', ['sterile', 'estéril']],
  ['production', 'Formas sólidas', 'formas-solidas', ['solid', 'tablet']],
  ['production', 'Empaque y serialización', 'empaque-y-serializacion', ['packag', 'serial']],
  ['production', 'Transferencia de tecnología', 'transferencia-de-tecnologia', ['transfer', 'technology']],
  ['rnd-innovation', 'Descubrimiento de fármacos', 'descubrimiento-de-farmacos', ['drug discovery', 'discovery']],
  ['rnd-innovation', 'Formulación farmacéutica', 'formulacion-farmaceutica', ['formulation', 'formulaci']],
  ['rnd-innovation', 'Estudios preclínicos', 'estudios-preclinicos', ['preclinical', 'precl']],
  ['rnd-innovation', 'Desarrollo analítico', 'desarrollo-analitico', ['analytical', 'analit']],
  ['data-ai', 'Power BI para farmacia', 'power-bi-farmacia', ['power bi']],
  ['data-ai', 'Python para farmacia', 'python-para-farmacia', ['python']],
  ['data-ai', 'IA en la industria farmacéutica', 'ia-industria-farmaceutica', ['ia', 'inteligencia artificial', 'ai']],
  ['data-ai', 'Evidencia del mundo real', 'evidencia-del-mundo-real', ['real world', 'evidencia']],
];

const PROVEEDOR = { coursera: 'Coursera', udemy: 'Udemy', edutin: 'Edutin' };
const norm = (texto) => String(texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const seccionDe = (areaId) => ACADEMY_SECTIONS.find((s) => s.areaId === areaId);
const cursosDe = (areaId, filtros = []) => {
  const seccion = seccionDe(areaId);
  if (!seccion) return [];
  const encontrados = seccion.courses.filter((c) => filtros.some((f) => norm(c.title).includes(norm(f))));
  return (encontrados.length >= 3 ? encontrados : seccion.courses).slice(0, 8).map((c) => ({
    title: c.title,
    provider: PROVEEDOR[c.provider] || c.provider,
    url: c.affiliateUrl,
  }));
};

const palabras = (tema) => [
  `cursos gratis de ${tema}`,
  `curso de ${tema} online`,
  `certificado de ${tema}`,
  `aprender ${tema}`,
  `${tema} para químicos farmacéuticos`,
  `formación en ${tema}`,
  `curso ${tema} Colombia`,
  `capacitación en ${tema}`,
  `${tema} farmacéutica`,
  `curso gratis ${tema} con certificado`,
];

const preguntas = (tema) => [
  {
    q: `¿Los cursos de ${tema} son gratis?`,
    a: 'El acceso y el certificado dependen de cada plataforma. Algunas ofrecen contenido gratuito y certificado opcional de pago; otras cobran desde el inicio. Verifica el precio y las condiciones antes de inscribirte.',
  },
  {
    q: `¿Necesito experiencia previa en ${tema}?`,
    a: 'No siempre. Hay cursos introductorios para estudiantes y profesionales que quieren actualizarse. Revisa el nivel y los requisitos en la ficha del curso.',
  },
  {
    q: `¿Estos cursos sirven para trabajar en la industria farmacéutica?`,
    a: 'Pueden ayudarte a construir competencias, pero no reemplazan la formación de base ni la experiencia. Úsalos como parte de una ruta y verifica que el temario se ajuste al rol que buscas.',
  },
];

const articulo = ({ areaId, tema, slug, filtros = [], tipo = 'tema' }) => {
  const area = AREAS[areaId];
  const esArea = tipo === 'area';
  const title = esArea
    ? `Cursos de ${area.nombre} para químicos farmacéuticos`
    : `Cursos gratis de ${tema}: guía para químicos farmacéuticos`;
  const seoTitle = esArea
    ? `Cursos de ${area.nombre} para QF`
    : `Cursos gratis de ${tema} para QF`;
  const description = `Guía de cursos de ${esArea ? area.nombre : tema} para químicos farmacéuticos: qué aprender, cómo elegir y qué salidas laborales existen.`;
  return {
    slug,
    marca: 'edvanta',
    category: 'Cursos gratis',
    title,
    description,
    seoTitle,
    seoDescription: description,
    readingTime: '8 min',
    date: HOY,
    updated: HOY,
    autor: 'Equipo editorial de Edvanta',
    publico: 'profesionales',
    image: area.imagen,
    imageAlt: `Cursos de ${esArea ? area.nombre : tema} para químicos farmacéuticos`,
    mdPath: `${BASE}/${slug}.md`,
    keywords: palabras(esArea ? area.nombre.toLowerCase() : tema.toLowerCase()),
    areaId,
    areaNombre: area.nombre,
    tema: esArea ? area.nombre : tema,
    esArea,
    intro: `La industria farmacéutica necesita profesionales que entiendan ${esArea ? area.nombre : tema} y sepan aplicarlo en entornos regulados. Esta guía reúne cursos reales de ${area.nombre} para que compares opciones, revises el temario y elijas con criterio.`,
    why: `En Colombia y Latinoamérica, los laboratorios, las IPS, las empresas de dispositivos médicos y las autoridades sanitarias trabajan con estándares que cambian con frecuencia. Formarte en ${esArea ? area.nombre : tema} te ayuda a leer esos requisitos, documentar decisiones y aportar en equipos multidisciplinarios.`,
    skills: [...new Set([...(esArea ? area.skills : [tema, ...area.skills])])].slice(0, 6),
    roles: area.roles,
    fuentes: area.fuentes,
    cursos: cursosDe(areaId, filtros),
    faqs: preguntas(esArea ? area.nombre : tema),
  };
};

const areas = Object.entries(AREAS).map(([areaId, area]) => articulo({
  areaId,
  tema: area.nombre,
  slug: `cursos-de-${area.slug}`,
  tipo: 'area',
}));

const temas = TOPICOS.map(([areaId, tema, slug, filtros]) => articulo({
  areaId,
  tema,
  slug: `cursos-gratis-${slug}`,
  filtros,
}));

const todos = [...areas, ...temas];

for (const a of todos) {
  const mismos = todos.filter((x) => x.areaId === a.areaId && x.slug !== a.slug);
  a.related = mismos.slice(0, 3).map((x) => x.slug);
}

/**
 * Guías por área reescritas con contenido propio (11-nov-2026).
 *
 * Las 50 guías salieron de una sola plantilla y se parecían entre sí en
 * promedio 0,45 (máximo 0,84, con tejas de 5 palabras). Indexadas así
 * parecen contenido repetido a escala, como las noticias del paquete del
 * 31-oct. Cada guía reescrita trae funciones reales del cargo, normas
 * verificadas en el normograma del INVIMA, los cursos propios gratis de
 * Edvanta del área, una ruta de 90 días y preguntas propias, y lleva
 * `contenidoPropio: true`. Las demás quedan en noindex,follow
 * (src/lib/seo/indexabilidad.js) hasta que se reescriban.
 */
const REESCRITOS = {
  'cursos-de-aseguramiento-de-calidad': {
    title: 'Cursos de aseguramiento de calidad para químicos farmacéuticos: gratis, online y con certificado',
    seoTitle: 'Cursos de aseguramiento de calidad gratis y online',
    description: 'Qué hace QA, qué normas dominar (BPM, ICH Q9 y Q10) y cursos de aseguramiento de calidad gratis con certificado opcional, más una ruta de 90 días.',
  },
  'cursos-de-control-de-calidad-farmaceutico': {
    title: 'Cursos de control de calidad farmacéutico: gratis, online y con certificado',
    seoTitle: 'Cursos de control de calidad farmacéutico gratis',
    description: 'HPLC, disolución, validación de métodos y OOS: cursos de control de calidad farmacéutico gratis, los cálculos de entrevista y una ruta de 90 días.',
  },
  'cursos-de-validaciones-y-calificaciones': {
    title: 'Cursos de validaciones y calificaciones farmacéuticas: gratis, online y con certificado',
    seoTitle: 'Cursos de validaciones y calificaciones farmacéuticas',
    description: 'DQ, IQ, OQ y PQ, validación de procesos, de limpieza y CSV con GAMP 5: cursos de validaciones gratis, cómo elegir y una ruta de 90 días.',
  },
  'cursos-de-asuntos-regulatorios': {
    title: 'Cursos de asuntos regulatorios farmacéuticos: gratis, online y con certificado',
    seoTitle: 'Cursos de asuntos regulatorios farmacéuticos gratis',
    description: 'Registro sanitario, dossiers, requerimientos del INVIMA y etiquetado: más de diez cursos de asuntos regulatorios gratis y una ruta de 90 días.',
  },
  'cursos-de-farmacovigilancia': {
    title: 'Cursos de farmacovigilancia: gratis, online y con certificado',
    seoTitle: 'Cursos de farmacovigilancia gratis y online',
    description: 'Qué hace un profesional de farmacovigilancia, causalidad, ICSR y señales, cómo reportar en Colombia y los cursos para formarte, gratis y online.',
  },
  'cursos-de-produccion-farmaceutica': {
    title: 'Cursos de producción farmacéutica: gratis, online y con certificado',
    seoTitle: 'Cursos de producción farmacéutica y BPM gratis',
    description: 'BPM, manufactura de sólidos y estériles, controles en proceso y mejora continua: cursos de producción farmacéutica gratis y una ruta de 90 días.',
  },
  'cursos-de-investigacion-y-desarrollo-farmaceutico': {
    title: 'Cursos de investigación y desarrollo farmacéutico: gratis, online y con certificado',
    seoTitle: 'Cursos de investigación y desarrollo farmacéutico',
    description: 'Preformulación, QbD, estabilidad, bioequivalencia e investigación clínica: cursos de I+D farmacéutico gratis y una ruta de 90 días.',
  },
  'cursos-de-datos-e-inteligencia-artificial': {
    title: 'Cursos de datos e inteligencia artificial para químicos farmacéuticos',
    seoTitle: 'Cursos de datos e IA para químicos farmacéuticos',
    description: 'Excel, Power BI, SQL, Python e IA con control humano: qué aprender, guías de Claude y certificados de datos para químicos farmacéuticos.',
  },
  // Lote 2 (11-nov-2026): los ocho temas de calidad.
  'cursos-gratis-iso-9001': {
    title: 'Cursos gratis de ISO 9001: guía para químicos farmacéuticos',
    seoTitle: 'Cursos de ISO 9001 gratis, online y con certificado',
    description: 'Qué pide ISO 9001, cómo convive con las BPM, qué curso elegir (interpretación o auditor interno) y cursos de gestión de calidad gratis.',
    readingTime: '6 min',
  },
  'cursos-gratis-bpm-gmp': {
    title: 'Cursos gratis de BPM y GMP: guía para químicos farmacéuticos',
    seoTitle: 'Cursos de BPM y GMP gratis con certificado',
    description: 'Qué cubren las BPM, la Resolución 1160 de 2016, los errores que más se repiten en planta y cursos de BPM, BPL y BPE gratis con certificado.',
    readingTime: '6 min',
  },
  'cursos-gratis-gdp-documentacion': {
    title: 'Cursos gratis de buenas prácticas de documentación (GDP)',
    seoTitle: 'Curso de buenas prácticas de documentación gratis',
    description: 'ALCOA+, reglas para registrar y corregir, errores que ve un auditor y cómo escribir POE claros: cursos de documentación farmacéutica gratis.',
    readingTime: '6 min',
  },
  'cursos-gratis-capa-desviaciones': {
    title: 'Cursos gratis de CAPA y desviaciones: guía para químicos farmacéuticos',
    seoTitle: 'Cursos de CAPA y desviaciones gratis y online',
    description: 'Cómo investigar una desviación, herramientas de causa raíz, CAPA medibles e indicadores del sistema: cursos de CAPA y desviaciones gratis.',
    readingTime: '6 min',
  },
  'cursos-gratis-gestion-de-riesgos': {
    title: 'Cursos gratis de gestión de riesgos en calidad farmacéutica',
    seoTitle: 'Cursos de gestión de riesgos ICH Q9 gratis',
    description: 'ICH Q9(R1) explicada, FMEA con un ejemplo de planta, herramientas y errores comunes: cursos de gestión de riesgos en calidad farmacéutica.',
    readingTime: '6 min',
  },
  'cursos-gratis-auditoria-farmaceutica': {
    title: 'Cursos gratis de auditoría farmacéutica: cómo formarte como auditor',
    seoTitle: 'Cursos de auditoría farmacéutica gratis y online',
    description: 'Tipos de auditoría, ISO 19011, cómo redactar hallazgos y auditar proveedores: cursos de auditoría farmacéutica gratis con certificado.',
    readingTime: '6 min',
  },
  'cursos-gratis-integridad-de-datos': {
    title: 'Cursos gratis de integridad de datos farmacéutica: ALCOA+ y sistemas',
    seoTitle: 'Cursos de integridad de datos y ALCOA+ gratis',
    description: 'ALCOA+ con ejemplos, 21 CFR Part 11, Anexo 11 y GAMP 5, y una revisión rápida para tu laboratorio: cursos de integridad de datos.',
    readingTime: '6 min',
  },
  'cursos-gratis-lean-six-sigma': {
    title: 'Cursos de Lean Six Sigma para químicos farmacéuticos',
    seoTitle: 'Cursos de Lean Six Sigma para químicos farmacéuticos',
    description: 'DMAIC, desperdicios Lean en planta, niveles de cinturón y un proyecto de ejemplo: cursos de Lean Six Sigma para la industria farmacéutica.',
    readingTime: '6 min',
  },
  // Lote 3 (11-nov-2026): control de calidad y validaciones.
  'cursos-gratis-hplc': {
    title: 'Cursos gratis de HPLC para químicos farmacéuticos: de la teoría al laboratorio',
    seoTitle: 'Cursos de HPLC gratis para químicos farmacéuticos',
    description: 'Cómo funciona un HPLC, cálculos de valoración, aptitud del sistema y solución de problemas: cursos de HPLC gratis para control de calidad.',
    readingTime: '6 min',
  },
  'cursos-gratis-validacion-metodos-analiticos': {
    title: 'Cursos gratis de validación de métodos analíticos: ICH Q2(R2) y Q14',
    seoTitle: 'Curso de validación de métodos analíticos gratis',
    description: 'ICH Q2(R2) e ICH Q14 explicadas: parámetros, estadística, protocolo y métodos indicadores de estabilidad. Cursos de validación analítica gratis.',
    readingTime: '6 min',
  },
  'cursos-gratis-estudios-de-estabilidad': {
    title: 'Cursos gratis de estudios de estabilidad de medicamentos: guía para Colombia',
    seoTitle: 'Curso de estudios de estabilidad de medicamentos gratis',
    description: 'Zona IVb, Resolución 3157 de 2018, tipos de estudio, protocolo y vida útil: cursos de estudios de estabilidad de medicamentos gratis.',
    readingTime: '6 min',
  },
  'cursos-gratis-microbiologia-farmaceutica': {
    title: 'Cursos gratis de microbiología farmacéutica: control microbiológico y áreas limpias',
    seoTitle: 'Cursos de microbiología farmacéutica gratis',
    description: 'Pruebas microbiológicas farmacopeicas, endotoxinas, áreas limpias y monitoreo ambiental: cursos de microbiología farmacéutica gratis.',
    readingTime: '6 min',
  },
  'cursos-gratis-investigaciones-de-laboratorio': {
    title: 'Cursos gratis de investigaciones de laboratorio: resultados OOS y OOT',
    seoTitle: 'Cursos de investigaciones OOS y OOT de laboratorio',
    description: 'Cómo investigar resultados OOS y OOT: fase de laboratorio, fase completa, errores prohibidos e informe. Cursos de control de calidad gratis.',
    readingTime: '6 min',
  },
  'cursos-gratis-analisis-farmaceutico': {
    title: 'Cursos gratis de análisis farmacéutico: técnicas, farmacopeas y carrera',
    seoTitle: 'Cursos de análisis farmacéutico gratis y online',
    description: 'Identidad, contenido, pureza y disolución: técnicas analíticas, farmacopeas y salidas laborales. Cursos de análisis farmacéutico gratis.',
    readingTime: '6 min',
  },
  'cursos-gratis-validacion-de-procesos': {
    title: 'Cursos gratis de validación de procesos farmacéuticos: las tres etapas',
    seoTitle: 'Cursos de validación de procesos farmacéuticos gratis',
    description: 'Las tres etapas del ciclo de vida, lotes PPQ, protocolo y verificación continua: cursos de validación de procesos farmacéuticos gratis.',
    readingTime: '6 min',
  },
  'cursos-gratis-validacion-de-limpieza': {
    title: 'Cursos gratis de validación de limpieza: límites, muestreo y peor caso',
    seoTitle: 'Curso de validación de limpieza farmacéutica gratis',
    description: 'Límites basados en la salud (PDE), peor caso, hisopado y enjuague, y errores frecuentes: cursos de validación de limpieza gratis.',
    readingTime: '6 min',
  },
  'cursos-gratis-csv-gamp5': {
    title: 'Cursos gratis de CSV y GAMP 5: validación de sistemas computarizados',
    seoTitle: 'Cursos de CSV y GAMP 5: validación de sistemas',
    description: 'Categorías de software, ciclo de vida, Part 11 y Anexo 11, y pensamiento crítico de GAMP 5: cursos de validación de sistemas computarizados.',
    readingTime: '6 min',
  },
  'cursos-gratis-calificacion-hvac': {
    title: 'Cursos gratis de calificación de HVAC y áreas limpias',
    seoTitle: 'Cursos de calificación de HVAC y áreas limpias',
    description: 'Cómo funciona el HVAC farmacéutico, ISO 14644-1, grados A a D, pruebas de calificación y monitoreo: cursos de HVAC y áreas limpias.',
    readingTime: '6 min',
  },
  'cursos-gratis-validacion-de-equipos': {
    title: 'Cursos gratis de calificación y validación de equipos: DQ, IQ, OQ y PQ',
    seoTitle: 'Validación de equipos: cursos de DQ, IQ, OQ y PQ',
    description: 'DQ, IQ, OQ y PQ, FAT y SAT, calificación de instrumentos analíticos y un ejemplo práctico: cursos de calificación de equipos gratis.',
    readingTime: '6 min',
  },
  // Lote 4a (12-nov-2026): farmacovigilancia. Normas verificadas en el normograma
  // del INVIMA: Resolución 2024015321 de 2024 y Resolución 213 de 2022.
  'cursos-gratis-seguridad-de-medicamentos': {
    title: 'Cursos gratis de seguridad de medicamentos: errores de medicación, medicamentos de alto riesgo y uso seguro',
    seoTitle: 'Seguridad de medicamentos: cursos gratis y errores',
    description: 'Errores de medicación, medicamentos de alto riesgo y de nombre parecido, cómo analizar un error y cursos gratis de seguridad de medicamentos.',
    readingTime: '7 min',
  },
  'cursos-gratis-reporte-de-eventos-adversos': {
    title: 'Cursos gratis de reporte de eventos adversos: casos individuales (ICSR), gravedad, causalidad y plazos en Colombia',
    seoTitle: 'Reporte de eventos adversos: ICSR, plazos y cursos',
    description: 'Los cuatro datos mínimos de un caso, gravedad y causalidad, los plazos de 15 y 90 días de la Resolución 2024015321 y cursos de ICSR.',
    readingTime: '7 min',
  },
  'cursos-gratis-deteccion-de-senales': {
    title: 'Cursos gratis de detección de señales en farmacovigilancia: de los casos a la decisión regulatoria',
    seoTitle: 'Detección de señales en farmacovigilancia: cursos',
    description: 'Qué es una señal, las etapas de su gestión, PRR, ROR e IC, lo que exige la norma colombiana y cursos de detección de señales.',
    readingTime: '7 min',
  },
  'cursos-gratis-plan-de-gestion-de-riesgos': {
    title: 'Cursos gratis de planes de gestión de riesgo (PGR) de medicamentos: qué son y cómo se elaboran en Colombia',
    seoTitle: 'Plan de gestión de riesgo (PGR): guía y cursos',
    description: 'La Resolución 213 de 2022, las partes de un PGR, las medidas de minimización de riesgos y cursos para aprender a elaborarlo.',
    readingTime: '7 min',
  },
  'cursos-gratis-farmacovigilancia-en-ensayos-clinicos': {
    title: 'Cursos gratis de farmacovigilancia en ensayos clínicos: eventos adversos serios, SUSAR y DSUR',
    seoTitle: 'Farmacovigilancia en ensayos clínicos: SUSAR y DSUR',
    description: 'Eventos adversos serios, SUSAR y sus plazos según ICH E2A, el DSUR, quién hace qué en un ensayo y cursos de seguridad clínica.',
    readingTime: '7 min',
  },
  // Lote 4b (12-nov-2026): asuntos regulatorios. Normas verificadas: Decreto 4725
  // de 2005, Resolución 4816 de 2008, Resolución 1896 de 2023 y Decreto 677 de 1995.
  'cursos-gratis-regulacion-fda': {
    title: 'Cursos gratis de regulación FDA: IND, NDA, ANDA, BLA y buenas prácticas de manufactura de Estados Unidos',
    seoTitle: 'Regulación FDA: IND, NDA, ANDA y cursos gratis',
    description: 'Las vías de autorización de la FDA, sus programas acelerados, el 21 CFR 210 y 211, el formulario 483 y cursos de regulación FDA.',
    readingTime: '7 min',
  },
  'cursos-gratis-regulacion-ema': {
    title: 'Cursos gratis de regulación EMA: procedimiento centralizado, CHMP, EPAR y GMP europeas',
    seoTitle: 'Regulación EMA: procedimiento centralizado y cursos',
    description: 'Cómo autoriza medicamentos la Unión Europea, qué hacen el CHMP y el PRAC, el EPAR, las GMP de EudraLex y cursos de regulación EMA.',
    readingTime: '7 min',
  },
  'cursos-gratis-expediente-ctd': {
    title: 'Cursos gratis de expediente CTD y eCTD: los cinco módulos del dossier de un medicamento',
    seoTitle: 'Expediente CTD y eCTD: los 5 módulos y cursos',
    description: 'Los cinco módulos del CTD, el módulo 3 de calidad por dentro, el eCTD, cómo se aplica en Colombia y cursos para armar un dossier.',
    readingTime: '7 min',
  },
  'cursos-gratis-dispositivos-medicos': {
    title: 'Cursos gratis de dispositivos médicos: clasificación por riesgo, registro sanitario y tecnovigilancia en Colombia',
    seoTitle: 'Dispositivos médicos en Colombia: clases y cursos',
    description: 'El Decreto 4725 de 2005, las clases I, IIa, IIb y III, el registro sanitario, la tecnovigilancia y cursos de dispositivos médicos.',
    readingTime: '7 min',
  },
  'cursos-gratis-etiquetado-y-publicidad': {
    title: 'Cursos gratis de etiquetado y publicidad de medicamentos: etiquetas, insertos y la Resolución 1896 de 2023',
    seoTitle: 'Etiquetado y publicidad de medicamentos: cursos',
    description: 'Etiquetas, insertos y publicidad de medicamentos, lo que exige la Resolución 1896 de 2023, cómo revisar una pieza y cursos gratis.',
    readingTime: '7 min',
  },
};
for (const a of todos) {
  const r = REESCRITOS[a.slug];
  if (!r) continue;
  Object.assign(a, r, { seoDescription: r.description, readingTime: r.readingTime || '12 min', updated: '2026-11-11', contenidoPropio: true });
}

export const INDUSTRIA_CURSOS_50 = todos;

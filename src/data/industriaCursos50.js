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

export const INDUSTRIA_CURSOS_50 = todos;

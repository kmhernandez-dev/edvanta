export const PROFESSIONAL_CAREERS = [
  { slug: 'aseguramiento-calidad', name: 'Aseguramiento de Calidad', pathSlug: 'quality-assurance-desde-cero' },
  { slug: 'control-calidad', name: 'Control de Calidad', pathSlug: 'control-de-calidad' },
  { slug: 'validaciones', name: 'Validaciones farmacéuticas', pathSlug: 'validaciones-farmaceuticas' },
  { slug: 'asuntos-regulatorios', name: 'Regulatory Affairs', pathSlug: 'regulatory-affairs' },
  { slug: 'farmacovigilancia', name: 'Farmacovigilancia', pathSlug: 'farmacovigilancia' },
  { slug: 'produccion-farmaceutica', name: 'Producción farmacéutica', pathSlug: 'produccion-farmaceutica' },
  { slug: 'investigacion-desarrollo', name: 'Investigación y desarrollo', pathSlug: 'investigacion-y-desarrollo' },
  { slug: 'industria-cosmetica', name: 'Formulación cosmética', pathSlug: 'formulacion-cosmetica' },
  { slug: 'medical-affairs', name: 'Medical Affairs', pathSlug: 'medical-affairs' },
  { slug: 'datos-farma', name: 'Data & Pharma', pathSlug: 'data-y-pharma' },
  { slug: 'inteligencia-artificial-farma', name: 'Inteligencia artificial para farmacia', pathSlug: 'ia-para-profesionales-farmaceuticos' },
];

export const PROFESSIONAL_INTERESTS = [
  'Calidad y cumplimiento',
  'Laboratorio y análisis',
  'Producción y operaciones',
  'Asuntos regulatorios',
  'Farmacovigilancia',
  'Investigación y desarrollo',
  'Datos e inteligencia artificial',
  'Cosmética',
  'Empleabilidad',
];

export const EXPERIENCE_LEVELS = [
  { value: 'exploring', label: 'Estoy explorando el sector' },
  { value: 'student', label: 'Estudiante o recién egresado' },
  { value: 'junior', label: 'Perfil junior' },
  { value: 'mid', label: 'Experiencia intermedia' },
  { value: 'senior', label: 'Perfil senior' },
  { value: 'leader', label: 'Liderazgo o dirección' },
];

export const PROFESSIONAL_GOALS = [
  { value: 'job', label: 'Conseguir empleo' },
  { value: 'career_choice', label: 'Elegir un área' },
  { value: 'specialize', label: 'Especializarme' },
  { value: 'learn', label: 'Aprender nuevas habilidades' },
  { value: 'projects', label: 'Crear proyectos' },
  { value: 'research', label: 'Participar en investigación' },
  { value: 'entrepreneurship', label: 'Emprender' },
  { value: 'network', label: 'Conectar con profesionales' },
];

export const PROFESSIONAL_SKILLS = [
  'Buenas Prácticas de Manufactura',
  'Documentación técnica',
  'Auditorías',
  'CAPA y desviaciones',
  'Análisis fisicoquímico',
  'Microbiología',
  'Farmacovigilancia',
  'Asuntos regulatorios',
  'Formulación',
  'Análisis de datos',
  'Comunicación científica',
  'Gestión de proyectos',
];

export const PROFESSIONAL_TOOLS = [
  'Excel',
  'Power BI',
  'SQL',
  'Python',
  'SAP',
  'LIMS',
  'TrackWise',
  'Veeva Vault',
  'Minitab',
  'Herramientas de IA generativa',
];

export function getCareerOption(slug) {
  return PROFESSIONAL_CAREERS.find(career => career.slug === slug) || null;
}

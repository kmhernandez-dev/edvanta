export const PROFESSIONAL_CAREERS = [
  { slug: 'aseguramiento-de-calidad', name: 'Aseguramiento de Calidad', pathSlug: 'aseguramiento-de-calidad-desde-cero' },
  { slug: 'control-de-calidad', name: 'Control de Calidad', pathSlug: 'control-de-calidad' },
  { slug: 'validaciones', name: 'Validaciones farmacéuticas', pathSlug: 'validaciones-farmaceuticas' },
  { slug: 'asuntos-regulatorios', name: 'Asuntos regulatorios', pathSlug: 'asuntos-regulatorios' },
  { slug: 'farmacovigilancia', name: 'Farmacovigilancia', pathSlug: 'farmacovigilancia' },
  { slug: 'produccion-farmaceutica', name: 'Producción farmacéutica', pathSlug: 'produccion-farmaceutica' },
  { slug: 'investigacion-y-desarrollo', name: 'Investigación y desarrollo', pathSlug: 'investigacion-y-desarrollo' },
  { slug: 'industria-cosmetica', name: 'Formulación cosmética', pathSlug: 'formulacion-cosmetica' },
  { slug: 'medical-affairs', name: 'Medical Affairs', pathSlug: 'medical-affairs' },
  { slug: 'datos-para-la-industria-farmaceutica', name: 'Datos para la industria farmacéutica', pathSlug: 'datos-para-la-industria-farmaceutica' },
  { slug: 'inteligencia-artificial-en-la-industria-farmaceutica', name: 'Inteligencia artificial en la industria farmacéutica', pathSlug: 'ia-para-profesionales-farmaceuticos' },
];

/**
 * Nombres que tuvieron las carreras y rutas antes de la migración 060. Los
 * perfiles guardados en Supabase pueden traerlos: se leen como el actual
 * y se guardan con el nuevo la próxima vez.
 */
const SLUGS_ANTERIORES = {
  'aseguramiento-calidad': 'aseguramiento-de-calidad',
  'control-calidad': 'control-de-calidad',
  'investigacion-desarrollo': 'investigacion-y-desarrollo',
  'datos-farma': 'datos-para-la-industria-farmaceutica',
  'inteligencia-artificial-farma': 'inteligencia-artificial-en-la-industria-farmaceutica',
  'quality-assurance-desde-cero': 'aseguramiento-de-calidad-desde-cero',
  'regulatory-affairs': 'asuntos-regulatorios',
  'data-y-pharma': 'datos-para-la-industria-farmaceutica',
};

/** El slug vigente de una carrera o ruta guardada con su nombre anterior. */
export const slugVigente = (slug) => SLUGS_ANTERIORES[slug] || slug || '';

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
  const vigente = slugVigente(slug);
  return PROFESSIONAL_CAREERS.find(career => career.slug === vigente) || null;
}

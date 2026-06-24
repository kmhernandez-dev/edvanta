/**
 * ============================================================
 *  RUTAS DE APRENDIZAJE PROFESIONAL
 *  Cada ruta agrupa cursos + packs recomendados por perfil.
 * ============================================================
 */

export const routes = [
  {
    id: 'atencion-farmaceutica-clinica',
    number: '01',
    name: 'Atención farmacéutica clínica',
    description:
      'Ruta para químicos farmacéuticos y personal de farmacia que quiere fortalecer el seguimiento farmacoterapéutico, la farmacovigilancia y la atención al paciente.',
    color: 'teal',
    icon: '💊',
    duration: '3–6 meses',
    level: 'Básico a intermedio',
    courses: [
      'Farmacología clínica',
      'Farmacología cardiovascular',
      'Diabetes',
      'Endocrinología',
      'Nutrición',
      'Microbiota',
    ],
    recommendedPacks: [
      { id: 'atencion-farmaceutica', name: 'Pack Atención Farmacéutica Pro' },
      { id: 'calidad-clinica', name: 'Pack Calidad Clínica y Seguridad del Paciente' },
    ],
    profiles: ['farmacia', 'salud'],
  },
  {
    id: 'calidad-auditoria-mejora',
    number: '02',
    name: 'Calidad, auditoría y mejora continua',
    description:
      'Ruta para coordinadores de calidad y auditores que quieren dominar ISO 9001, auditorías internas, indicadores y mejora continua.',
    color: 'navy',
    icon: '🎯',
    duration: '4–8 meses',
    level: 'Intermedio',
    courses: [
      'Gestión de calidad',
      'Auditoría',
      'Gestión del riesgo',
      'Lean Six Sigma',
      'Gestión de proyectos',
      'Gestión de operaciones',
    ],
    recommendedPacks: [
      { id: 'calidad-auditoria', name: 'Pack Calidad, Auditoría y Mejora Continua Pro' },
      { id: 'calidad-farmaceutica', name: 'Pack Calidad Farmacéutica 360' },
    ],
    profiles: ['calidad'],
  },
  {
    id: 'datos-indicadores',
    number: '03',
    name: 'Datos, indicadores y dashboards',
    description:
      'Ruta para quienes quieren medir y presentar resultados con tableros profesionales en calidad, farmacia, salud y gestión.',
    color: 'gold',
    icon: '📊',
    duration: '3–5 meses',
    level: 'Básico a intermedio',
    courses: [
      'Power BI',
      'Excel',
      'Análisis de datos',
      'Python',
      'Analista de datos con Power BI',
      'IA para análisis de datos',
    ],
    recommendedPacks: [
      { id: 'indicadores-dashboards', name: 'Pack Indicadores, Dashboards y Gestión Pro' },
      { id: 'empleabilidad-farmasalud', name: 'Kit Empleabilidad FarmaSalud' },
    ],
    profiles: ['datos'],
  },
  {
    id: 'empleabilidad-farmasalud',
    number: '04',
    name: 'Empleabilidad en salud y farmacia',
    description:
      'Ruta para profesionales y técnicos de salud, farmacia y calidad que buscan empleo o quieren mejorar su perfil y su LinkedIn.',
    color: 'teal',
    icon: '🎓',
    duration: '1–3 meses',
    level: 'Básico',
    courses: [
      'Asistente administrativo',
      'Gestión del talento humano',
      'Técnicas de reclutamiento',
      'Excel',
      'Marketing digital',
    ],
    recommendedPacks: [
      { id: 'empleabilidad-farmasalud', name: 'Kit Empleabilidad FarmaSalud' },
      { id: 'atencion-farmaceutica', name: 'Pack Atención Farmacéutica Pro' },
    ],
    profiles: ['empleabilidad'],
  },
];

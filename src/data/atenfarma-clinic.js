/**
 * AtenFarmaClinic — Data layer for public page and clinical workspace.
 * All demo cases are clearly marked as fictitious and educational.
 */

// ─── Clinical Activities (Activity Selector) ──────────────────────────
export const clinicalActivities = [
  {
    id: 'historia-farmacoterapeutica',
    title: 'Recopilar la historia farmacoterapéutica',
    description: 'Registra información del paciente, problemas de salud, medicamentos, alergias y objetivos.',
    icon: 'clipboard',
    route: '/atenfarmaclinic/workspace?tab=historia',
    status: 'available',
  },
  {
    id: 'conciliacion',
    title: 'Conciliar medicamentos',
    description: 'Compara la medicación previa, la prescripción actual y el uso real reportado.',
    icon: 'list',
    route: '/atenfarmaclinic/workspace?tab=conciliacion',
    status: 'available',
  },
  {
    id: 'evaluacion',
    title: 'Evaluar un tratamiento',
    description: 'Analiza indicación, efectividad, seguridad y adherencia de cada medicamento.',
    icon: 'scale',
    route: '/atenfarmaclinic/workspace?tab=evaluacion',
    status: 'available',
  },
  {
    id: 'identificar-prm',
    title: 'Identificar problemas farmacoterapéuticos',
    description: 'Clasifica PRM/RNM según la metodología seleccionada (Minnesota, PCNE, Dáder).',
    icon: 'shield',
    route: '/atenfarmaclinic/workspace?tab=problemas',
    status: 'available',
  },
  {
    id: 'plan-cuidado',
    title: 'Construir un plan de cuidado',
    description: 'Define objetivos terapéuticos, intervenciones y parámetros de seguimiento.',
    icon: 'heart',
    route: '/atenfarmaclinic/workspace?tab=plan',
    status: 'available',
  },
  {
    id: 'intervencion',
    title: 'Redactar una intervención farmacéutica',
    description: 'Genera notas SOAP, cartas de intervención o recomendaciones al prescriptor.',
    icon: 'message',
    route: '/atenfarmaclinic/workspace?tab=intervenciones',
    status: 'available',
  },
  {
    id: 'seguimiento',
    title: 'Programar un seguimiento',
    description: 'Registra la evolución, aceptación de intervenciones y resultados clínicos.',
    icon: 'clock',
    route: '/atenfarmaclinic/workspace?tab=seguimiento',
    status: 'available',
  },
  {
    id: 'caso-clinico',
    title: 'Resolver un caso clínico',
    description: 'Aplica el proceso completo a un caso ficticio con diferentes niveles de complejidad.',
    icon: 'beaker',
    route: '/atenfarmaclinic/workspace?tab=casos',
    status: 'available',
  },
  {
    id: 'calculadora',
    title: 'Utilizar una calculadora clínica',
    description: 'Depuración de creatinina, superficie corporal, peso ideal y ajustado.',
    icon: 'chart',
    route: '/atenfarmaclinic/workspace?tab=calculadoras',
    status: 'available',
  },
];

// ─── Clinical Process Flow ────────────────────────────────────────────
export const clinicalProcess = [
  { step: 1, title: 'Recopilar', description: 'Historia farmacoterapéutica completa del paciente.', icon: 'clipboard' },
  { step: 2, title: 'Evaluar', description: 'Análisis de indicación, efectividad, seguridad y adherencia.', icon: 'scale' },
  { step: 3, title: 'Identificar', description: 'Detección y clasificación de problemas farmacoterapéuticos.', icon: 'shield' },
  { step: 4, title: 'Priorizar', description: 'Jerarquización de problemas según riesgo y necesidad clínica.', icon: 'trendUp' },
  { step: 5, title: 'Planificar', description: 'Construcción del plan de cuidado con objetivos e intervenciones.', icon: 'heart' },
  { step: 6, title: 'Intervenir', description: 'Ejecución de intervenciones farmacéuticas documentadas.', icon: 'message' },
  { step: 7, title: 'Monitorizar', description: 'Seguimiento de parámetros de efectividad y seguridad.', icon: 'activity' },
  { step: 8, title: 'Medir', description: 'Evaluación de resultados clínicos y documentación del impacto.', icon: 'chart' },
];

// ─── Clinical Tools ───────────────────────────────────────────────────
export const clinicalTools = [
  {
    id: 'historia-ft',
    name: 'Historia farmacoterapéutica',
    activity: 'Recopilación estructurada de información del paciente',
    result: 'Perfil farmacoterapéutico documentado',
    audience: 'Químicos farmacéuticos clínicos, asistenciales y hospitalarios',
    status: 'available',
    icon: 'clipboard',
    route: '/atenfarmaclinic/workspace?tab=historia',
  },
  {
    id: 'conciliacion-med',
    name: 'Conciliación de medicamentos',
    activity: 'Comparación entre medicación previa, prescripción y uso real',
    result: 'Informe de discrepancias y conciliación',
    audience: 'Farmacéuticos hospitalarios, clínicos y de transiciones asistenciales',
    status: 'available',
    icon: 'list',
    route: '/atenfarmaclinic/workspace?tab=conciliacion',
  },
  {
    id: 'evaluacion-ft',
    name: 'Evaluación farmacoterapéutica',
    activity: 'Análisis de indicación, efectividad, seguridad y adherencia por medicamento',
    result: 'Matriz de evaluación con hallazgos priorizados',
    audience: 'Químicos farmacéuticos clínicos y asistenciales',
    status: 'available',
    icon: 'scale',
    route: '/atenfarmaclinic/workspace?tab=evaluacion',
  },
  {
    id: 'clasificacion-prm',
    name: 'Clasificación de problemas farmacoterapéuticos',
    activity: 'Identificación y categorización de PRM/RNM según metodología',
    result: 'Listado clasificado de problemas con prioridad y causa',
    audience: 'Químicos farmacéuticos clínicos, docentes y estudiantes avanzados',
    status: 'available',
    icon: 'shield',
    route: '/atenfarmaclinic/workspace?tab=problemas',
  },
  {
    id: 'plan-cuidado',
    name: 'Constructor de planes de cuidado',
    activity: 'Definición de objetivos, intervenciones y parámetros de seguimiento',
    result: 'Plan de cuidado farmacéutico estructurado',
    audience: 'Químicos farmacéuticos clínicos y asistenciales',
    status: 'available',
    icon: 'heart',
    route: '/atenfarmaclinic/workspace?tab=plan',
  },
  {
    id: 'generador-intervenciones',
    name: 'Generador de intervenciones',
    activity: 'Redacción de notas SOAP, cartas y recomendaciones',
    result: 'Documento de intervención farmacéutica editable',
    audience: 'Químicos farmacéuticos clínicos, hospitalarios y comunitarios',
    status: 'available',
    icon: 'message',
    route: '/atenfarmaclinic/workspace?tab=intervenciones',
  },
  {
    id: 'seguimiento-clinico',
    name: 'Seguimiento clínico',
    activity: 'Registro de evolución, aceptación y resultados',
    result: 'Línea de tiempo de seguimiento farmacoterapéutico',
    audience: 'Químicos farmacéuticos clínicos y asistenciales',
    status: 'available',
    icon: 'clock',
    route: '/atenfarmaclinic/workspace?tab=seguimiento',
  },
  {
    id: 'calculadoras',
    name: 'Calculadoras clínicas',
    activity: 'Cálculo de parámetros farmacocinéticos y antropométricos',
    result: 'Resultado con fórmula, interpretación y advertencias',
    audience: 'Químicos farmacéuticos clínicos, hospitalarios y docentes',
    status: 'available',
    icon: 'chart',
    route: '/atenfarmaclinic/workspace?tab=calculadoras',
  },
  {
    id: 'biblioteca-protocolos',
    name: 'Biblioteca de protocolos',
    activity: 'Consulta de guías, protocolos y referencias clínicas',
    result: 'Acceso a recursos de apoyo para la práctica clínica',
    audience: 'Todos los perfiles',
    status: 'demo',
    icon: 'book',
    route: '/atenfarmaclinic#biblioteca',
  },
  {
    id: 'simulador-casos',
    name: 'Simulador de casos',
    activity: 'Resolución guiada de casos clínicos ficticios',
    result: 'Informe completo del caso con retroalimentación',
    audience: 'Estudiantes avanzados y profesionales en formación continua',
    status: 'demo',
    icon: 'beaker',
    route: '/atenfarmaclinic/workspace?tab=casos',
  },
];

// ─── Demo Clinical Cases ──────────────────────────────────────────────
export const demoCases = [
  {
    id: 'demo-01',
    title: 'Paciente polimedicado con posible PRM de seguridad',
    setting: 'Atención ambulatoria',
    level: 'Intermedio',
    duration: '45-60 min',
    competencies: ['Conciliación', 'Identificación de PRM', 'Plan de cuidado', 'Intervención'],
    summary: 'Paciente femenina de 72 años con HTA, DM2, dislipidemia e insuficiencia renal crónica. Recibe 8 medicamentos. Reporta mareos y caídas recientes.',
    disclaimer: 'Caso ficticio con fines exclusivamente educativos. No corresponde a ningún paciente real.',
  },
  {
    id: 'demo-02',
    title: 'Transición asistencial con discrepancias no intencionales',
    setting: 'Hospitalización',
    level: 'Avanzado',
    duration: '60-90 min',
    competencies: ['Conciliación', 'Evaluación farmacoterapéutica', 'Intervención', 'Seguimiento'],
    summary: 'Paciente masculino de 68 años dado de alta tras síndrome coronario agudo. Se identifican discrepancias entre la medicación previa, la prescripción al alta y la dispensación ambulatoria.',
    disclaimer: 'Caso ficticio con fines exclusivamente educativos. No corresponde a ningún paciente real.',
  },
  {
    id: 'demo-03',
    title: 'Paciente con falta de adherencia y barreras de acceso',
    setting: 'Farmacia comunitaria',
    level: 'Básico',
    duration: '30-45 min',
    competencies: ['Historia farmacoterapéutica', 'Evaluación de adherencia', 'Educación al paciente', 'Seguimiento'],
    summary: 'Paciente femenina de 55 años con asma no controlada. Refiere usar el inhalador solo cuando tiene síntomas. Manifiesta preocupación por el costo del tratamiento.',
    disclaimer: 'Caso ficticio con fines exclusivamente educativos. No corresponde a ningún paciente real.',
  },
];

// ─── Methodologies ────────────────────────────────────────────────────
export const methodologies = [
  {
    id: 'minnesota',
    name: 'Minnesota / Comprehensive Medication Management (CMM)',
    description: 'Modelo centrado en la evaluación integral de la farmacoterapia: indicación, efectividad, seguridad y adherencia.',
    version: 'Cipolle, Strand y Morley',
    source: 'TODO_ATENFARMA: Referencia bibliográfica completa',
    lastUpdated: 'TODO_ATENFARMA: Fecha de revisión',
    limitations: 'Requiere acceso a información clínica completa del paciente.',
  },
  {
    id: 'pcne',
    name: 'PCNE (Pharmaceutical Care Network Europe)',
    description: 'Sistema de clasificación europeo para problemas relacionados con medicamentos: causas, intervenciones y resultados.',
    version: 'TODO_ATENFARMA: Versión específica de PCNE',
    source: 'TODO_ATENFARMA: Referencia bibliográfica completa',
    lastUpdated: 'TODO_ATENFARMA: Fecha de revisión',
    limitations: 'La clasificación puede requerir adaptación al contexto local.',
  },
  {
    id: 'dader',
    name: 'Método Dáder / RNM',
    description: 'Metodología española de seguimiento farmacoterapéutico basada en la identificación de Resultados Negativos asociados a la Medicación (RNM).',
    version: 'TODO_ATENFARMA: Versión específica',
    source: 'TODO_ATENFARMA: Referencia bibliográfica completa',
    lastUpdated: 'TODO_ATENFARMA: Fecha de revisión',
    limitations: 'Enfocado en el contexto del sistema de salud español; adaptable a otros contextos.',
  },
  {
    id: 'institucional',
    name: 'Clasificación institucional personalizada',
    description: 'Permite al profesional o a la institución definir su propia clasificación de problemas farmacoterapéuticos.',
    version: 'Personalizada',
    source: 'Definida por el usuario o la institución',
    lastUpdated: 'N/A',
    limitations: 'Requiere validación interna y alineación con los protocolos institucionales.',
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────
export const faqItems = [
  {
    q: '¿AtenFarmaClinic reemplaza el juicio clínico del profesional?',
    a: 'No. AtenFarmaClinic es una plataforma educativa y de apoyo a la documentación profesional. Todas las decisiones clínicas deben ser tomadas por un profesional competente.',
  },
  {
    q: '¿Puedo registrar pacientes reales?',
    a: 'La versión actual es un entorno demostrativo y educativo. No está diseñada para almacenar información de pacientes reales. Los casos incluidos son ficticios.',
  },
  {
    q: '¿Las herramientas generan diagnósticos?',
    a: 'No. Las herramientas ayudan a organizar información, identificar posibles problemas farmacoterapéuticos y documentar intervenciones. No generan diagnósticos médicos ni recomendaciones autónomas.',
  },
  {
    q: '¿Puedo modificar una prescripción desde la plataforma?',
    a: 'No. La plataforma no modifica prescripciones. Las intervenciones farmacéuticas son recomendaciones que deben ser comunicadas al prescriptor y validadas por este.',
  },
  {
    q: '¿Qué metodologías utiliza?',
    a: 'La plataforma permite trabajar con Minnesota/CMM, PCNE, Dáder/RNM o una clasificación institucional personalizada. El usuario selecciona la metodología antes de clasificar.',
  },
  {
    q: '¿Los casos clínicos son reales?',
    a: 'No. Todos los casos clínicos incluidos en la plataforma son ficticios y tienen fines exclusivamente educativos.',
  },
  {
    q: '¿Puedo usarla como estudiante?',
    a: 'Sí. La plataforma incluye casos de diferentes niveles de complejidad y herramientas que facilitan el aprendizaje de metodologías de atención farmacéutica.',
  },
  {
    q: '¿Existe una versión para instituciones?',
    a: 'Estamos desarrollando funcionalidades para equipos, indicadores institucionales y gestión de casos. Puedes solicitar información en la sección "Para instituciones".',
  },
  {
    q: '¿Cómo se protege la información?',
    a: 'En el modo demostrativo actual, los datos se almacenan localmente en tu navegador. No se envían a servidores externos. La versión productiva futura implementará cifrado y controles de acceso.',
  },
  {
    q: '¿Cómo se actualizan las herramientas?',
    a: 'Las herramientas se revisan y actualizan periódicamente. Cada herramienta muestra su versión, fecha de actualización y fuente cuando está disponible.',
  },
];

// ─── Trust Bar ────────────────────────────────────────────────────────
export const trustMessages = [
  'Diseñado para químicos farmacéuticos',
  'Documentación clínica estructurada',
  'Casos educativos y herramientas prácticas',
  'Metodologías claramente identificadas',
  'Uso profesional con revisión humana',
];

// ─── Institutional Features ───────────────────────────────────────────
export const institutionalFeatures = [
  { title: 'Equipos y permisos', description: 'Roles diferenciados para profesionales, supervisores y administradores.' },
  { title: 'Indicadores', description: 'Métricas de actividad clínica, intervenciones y resultados del servicio.' },
  { title: 'Auditoría', description: 'Trazabilidad de modificaciones y revisión de casos documentados.' },
  { title: 'Protocolos institucionales', description: 'Carga y gestión de guías y protocolos propios de la institución.' },
  { title: 'Exportación de informes', description: 'Informes agregados y por profesional para gestión del servicio.' },
  { title: 'Gestión de casos', description: 'Asignación, seguimiento y cierre de casos entre profesionales.' },
  { title: 'Formación interna', description: 'Rutas de capacitación y evaluación de competencias del equipo.' },
];

// ─── Learning Routes ──────────────────────────────────────────────────
export const learningRoutes = [
  {
    id: 'fundamentos-af',
    title: 'Fundamentos de atención farmacéutica',
    description: 'Principios, modelos y evolución de la atención farmacéutica clínica.',
    icon: 'book',
  },
  {
    id: 'seguimiento-ft',
    title: 'Seguimiento farmacoterapéutico',
    description: 'Metodologías, herramientas y documentación del seguimiento.',
    icon: 'clipboard',
  },
  {
    id: 'farmacocinetica',
    title: 'Farmacocinética clínica',
    description: 'Interpretación de parámetros y ajuste de regímenes posológicos.',
    icon: 'activity',
  },
  {
    id: 'seguridad-paciente',
    title: 'Seguridad del paciente',
    description: 'Prevención de errores, farmacovigilancia y cultura de seguridad.',
    icon: 'shield',
  },
  {
    id: 'farmacia-hospitalaria',
    title: 'Farmacia hospitalaria',
    description: 'Práctica clínica en el entorno hospitalario y transiciones asistenciales.',
    icon: 'briefcase',
  },
  {
    id: 'farmacovigilancia',
    title: 'Farmacovigilancia',
    description: 'Detección, reporte y análisis de sospechas de reacciones adversas.',
    icon: 'bell',
  },
  {
    id: 'documentacion-clinica',
    title: 'Documentación clínica',
    description: 'Registro estructurado de actividades e intervenciones farmacéuticas.',
    icon: 'list',
  },
  {
    id: 'servicios-digitales',
    title: 'Servicios farmacéuticos digitales',
    description: 'Herramientas tecnológicas para la práctica farmacéutica contemporánea.',
    icon: 'globe',
  },
];

// ─── Clinical Calculators ────────────────────────────────────────────
export const calculators = [
  {
    id: 'cockcroft-gault',
    name: 'Depuración de creatinina (Cockcroft-Gault)',
    formula: 'ClCr = [(140 - edad) × peso] / (72 × Cr sérica) × 0.85 (si mujer)',
    fields: [
      { id: 'age', label: 'Edad (años)', unit: 'años', type: 'number', min: 18, max: 120 },
      { id: 'weight', label: 'Peso (kg)', unit: 'kg', type: 'number', min: 30, max: 200 },
      { id: 'creatinine', label: 'Creatinina sérica (mg/dL)', unit: 'mg/dL', type: 'number', min: 0.1, max: 20, step: 0.01 },
      { id: 'sex', label: 'Sexo', unit: '', type: 'select', options: ['Masculino', 'Femenino'] },
    ],
    population: 'Adultos con función renal estable. No usar en insuficiencia renal aguda, embarazo o pacientes con peso extremo.',
    warnings: [
      'No utilizar en insuficiencia renal aguda.',
      'Puede sobreestimar la función renal en pacientes con baja masa muscular.',
      'No validado en poblaciones pediátricas.',
    ],
    source: 'TODO_ATENFARMA: Referencia Cockcroft-Gault original',
    lastReviewed: 'TODO_ATENFARMA: Fecha de revisión',
  },
  {
    id: 'bsa',
    name: 'Superficie corporal (Mosteller)',
    formula: 'SC (m²) = √[(altura cm × peso kg) / 3600]',
    fields: [
      { id: 'height', label: 'Altura (cm)', unit: 'cm', type: 'number', min: 100, max: 250 },
      { id: 'weight', label: 'Peso (kg)', unit: 'kg', type: 'number', min: 30, max: 200 },
    ],
    population: 'Adultos y población pediátrica. Fórmula de Mosteller validada para uso general.',
    warnings: [
      'La fórmula de Mosteller es una aproximación. Existen otras fórmulas (DuBois, Haycock) para contextos específicos.',
      'No utilizar como único criterio para ajuste de dosis en quimioterapia.',
    ],
    source: 'TODO_ATENFARMA: Referencia Mosteller',
    lastReviewed: 'TODO_ATENFARMA: Fecha de revisión',
  },
  {
    id: 'ideal-weight',
    name: 'Peso ideal y peso ajustado',
    formula: 'PI (kg) = [altura cm - 100] - ([altura cm - 150] / k) donde k=4 (hombre) o k=2.5 (mujer). PA = PI + 0.4 × (peso real - PI)',
    fields: [
      { id: 'height', label: 'Altura (cm)', unit: 'cm', type: 'number', min: 100, max: 250 },
      { id: 'weight', label: 'Peso real (kg)', unit: 'kg', type: 'number', min: 30, max: 250 },
      { id: 'sex', label: 'Sexo', unit: '', type: 'select', options: ['Masculino', 'Femenino'] },
    ],
    population: 'Adultos. Útil cuando el peso real supera en más del 20% el peso ideal.',
    warnings: [
      'El peso ajustado es una aproximación. No existe consenso universal sobre su uso.',
      'No utilizar en pacientes con amputaciones o retención severa de líquidos.',
      'Evaluar el contexto clínico antes de aplicar el peso ajustado para dosificación.',
    ],
    source: 'TODO_ATENFARMA: Referencia peso ideal y ajustado',
    lastReviewed: 'TODO_ATENFARMA: Fecha de revisión',
  },
];

// ─── Workspace Navigation ─────────────────────────────────────────────
export const workspaceNav = [
  { id: 'panel', label: 'Panel', icon: 'chart' },
  { id: 'casos', label: 'Casos', icon: 'beaker' },
  { id: 'historia', label: 'Historia FT', icon: 'clipboard' },
  { id: 'medicamentos', label: 'Medicamentos', icon: 'pill' },
  { id: 'evaluacion', label: 'Evaluación', icon: 'scale' },
  { id: 'problemas', label: 'Problemas', icon: 'shield' },
  { id: 'plan', label: 'Plan de cuidado', icon: 'heart' },
  { id: 'intervenciones', label: 'Intervenciones', icon: 'message' },
  { id: 'seguimiento', label: 'Seguimiento', icon: 'clock' },
  { id: 'informes', label: 'Informes', icon: 'list' },
  { id: 'calculadoras', label: 'Calculadoras', icon: 'chart' },
  { id: 'biblioteca', label: 'Biblioteca', icon: 'book' },
];

// ─── Demo Patient Data ────────────────────────────────────────────────
export const demoPatient = {
  id: 'demo-01',
  caseName: 'Caso demo: Paciente polimedicado',
  status: 'En evaluación',
  methodology: 'minnesota',
  lastUpdated: new Date().toISOString(),
  demographics: {
    age: 72,
    sex: 'Femenino',
    weight: 68,
    height: 158,
    reason: 'Evaluación farmacoterapéutica por polimedicación y mareos',
  },
  healthConditions: [
    { id: 'hc-1', name: 'Hipertensión arterial', diagnosed: '2010', controlled: 'Parcialmente' },
    { id: 'hc-2', name: 'Diabetes mellitus tipo 2', diagnosed: '2012', controlled: 'Sí' },
    { id: 'hc-3', name: 'Dislipidemia', diagnosed: '2012', controlled: 'Sí' },
    { id: 'hc-4', name: 'Enfermedad renal crónica etapa 3', diagnosed: '2018', controlled: 'No' },
  ],
  medications: [
    { id: 'med-1', active: 'Enalapril', brand: '', indication: 'HTA', dose: 20, unit: 'mg', frequency: 'c/12h', route: 'VO', duration: 'Continua', prescriber: 'Médico general', status: 'Activo', notes: '' },
    { id: 'med-2', active: 'Hidroclorotiazida', brand: '', indication: 'HTA', dose: 25, unit: 'mg', frequency: 'c/24h', route: 'VO', duration: 'Continua', prescriber: 'Médico general', status: 'Activo', notes: '' },
    { id: 'med-3', active: 'Metformina', brand: '', indication: 'DM2', dose: 850, unit: 'mg', frequency: 'c/12h', route: 'VO', duration: 'Continua', prescriber: 'Médico general', status: 'Activo', notes: '' },
    { id: 'med-4', active: 'Atorvastatina', brand: '', indication: 'Dislipidemia', dose: 40, unit: 'mg', frequency: 'c/24h', route: 'VO', duration: 'Continua', prescriber: 'Médico general', status: 'Activo', notes: '' },
    { id: 'med-5', active: 'AAS', brand: '', indication: 'Prevención CV', dose: 100, unit: 'mg', frequency: 'c/24h', route: 'VO', duration: 'Continua', prescriber: 'Médico general', status: 'Activo', notes: '' },
    { id: 'med-6', active: 'Ibuprofeno', brand: '', indication: 'Dolor articular', dose: 400, unit: 'mg', frequency: 'c/8h', route: 'VO', duration: '2 meses', prescriber: 'Automedicación', status: 'Activo', notes: 'Paciente lo toma por dolor de rodillas desde hace 2 meses' },
    { id: 'med-7', active: 'Omeprazol', brand: '', indication: 'Protección gástrica', dose: 20, unit: 'mg', frequency: 'c/24h', route: 'VO', duration: 'Continua', prescriber: 'Médico general', status: 'Activo', notes: '' },
    { id: 'med-8', active: 'Amlodipino', brand: '', indication: 'HTA', dose: 5, unit: 'mg', frequency: 'c/24h', route: 'VO', duration: 'Continua', prescriber: 'Médico general', status: 'Activo', notes: 'Agregado hace 3 meses por PA no controlada' },
  ],
  allergies: ['No conocidas'],
  adverseReactions: ['Tos seca con enalapril (leve, tolerada)'],
  labResults: [
    { test: 'Creatinina sérica', value: '1.8', unit: 'mg/dL', date: '2026-07-15' },
    { test: 'TFG estimada', value: '32', unit: 'mL/min/1.73m²', date: '2026-07-15' },
    { test: 'HbA1c', value: '7.1', unit: '%', date: '2026-07-15' },
    { test: 'Potasio sérico', value: '5.1', unit: 'mEq/L', date: '2026-07-15' },
    { test: 'Presión arterial', value: '148/88', unit: 'mmHg', date: '2026-07-20' },
  ],
  adherence: 'Parcial. Olvida dosis de la noche. Toma ibuprofeno sin indicación médica.',
  barriers: ['Costo de medicamentos', 'Olvido de dosis nocturnas', 'Automedicación con AINE'],
  patientGoals: 'Sentirse menos mareada. Entender para qué sirve cada medicamento.',
};

// ─── Intervention Templates ──────────────────────────────────────────
export const interventionTemplates = [
  {
    id: 'soap',
    name: 'Nota SOAP',
    description: 'Nota subjetiva, objetiva, análisis y plan de intervención farmacéutica.',
    sections: ['Subjetivo', 'Objetivo', 'Análisis', 'Plan'],
  },
  {
    id: 'evolucion',
    name: 'Evolución farmacéutica',
    description: 'Registro de evolución del caso en la historia farmacoterapéutica.',
    sections: ['Fecha', 'Problema evaluado', 'Hallazgos', 'Conducta', 'Próximo seguimiento'],
  },
  {
    id: 'carta-intervencion',
    name: 'Carta de intervención',
    description: 'Comunicación formal al prescriptor con hallazgos y recomendaciones.',
    sections: ['Destinatario', 'Paciente', 'Hallazgos', 'Recomendación', 'Fundamento', 'Firma'],
  },
  {
    id: 'recomendacion',
    name: 'Recomendación al prescriptor',
    description: 'Nota breve con recomendación farmacoterapéutica puntual.',
    sections: ['Para', 'Paciente', 'Problema identificado', 'Recomendación', 'Evidencia', 'Contacto'],
  },
  {
    id: 'informe-conciliacion',
    name: 'Informe de conciliación',
    description: 'Documento que resume las discrepancias encontradas y las acciones sugeridas.',
    sections: ['Medicación previa', 'Prescripción actual', 'Discrepancias', 'Recomendaciones', 'Medicación conciliada'],
  },
  {
    id: 'educacion-paciente',
    name: 'Educación al paciente',
    description: 'Guía de educación personalizada para el paciente o cuidador.',
    sections: ['Medicamento', 'Indicación', 'Modo de uso', 'Precauciones', 'Signos de alarma'],
  },
  {
    id: 'informe-seguimiento',
    name: 'Informe de seguimiento',
    description: 'Resumen del seguimiento farmacoterapéutico con resultados.',
    sections: ['Periodo', 'Problemas', 'Intervenciones', 'Resultados', 'Plan'],
  },
];

// ─── Drug Therapy Problem Categories (Minnesota) ──────────────────────
export const dptCategories = {
  minnesota: [
    { id: 'indication-1', category: 'Indicación', code: 'I1', name: 'Medicamento innecesario', description: 'El paciente toma un medicamento sin indicación clínica válida.' },
    { id: 'indication-2', category: 'Indicación', code: 'I2', name: 'Necesidad de medicamento adicional', description: 'El paciente requiere un medicamento que no está recibiendo.' },
    { id: 'effectiveness-1', category: 'Efectividad', code: 'E1', name: 'Medicamento inapropiado', description: 'El medicamento no es el más adecuado para la condición.' },
    { id: 'effectiveness-2', category: 'Efectividad', code: 'E2', name: 'Dosis subterapéutica', description: 'La dosis es insuficiente para alcanzar el objetivo terapéutico.' },
    { id: 'safety-1', category: 'Seguridad', code: 'S1', name: 'Reacción adversa', description: 'El paciente experimenta una reacción adversa al medicamento.' },
    { id: 'safety-2', category: 'Seguridad', code: 'S2', name: 'Dosis excesiva', description: 'La dosis es demasiado alta para el paciente (por función renal, hepática, etc.).' },
    { id: 'adherence-1', category: 'Adherencia', code: 'A1', name: 'Falta de adherencia', description: 'El paciente no usa el medicamento según lo indicado.' },
    { id: 'adherence-2', category: 'Adherencia', code: 'A2', name: 'Barrera de acceso', description: 'El paciente no puede obtener o usar el medicamento por barreras económicas, físicas o cognitivas.' },
  ],
  pcne: [
    { id: 'pcne-p1', category: 'Efectividad', code: 'P1', name: 'Efecto no óptimo del tratamiento', description: 'El tratamiento no alcanza el objetivo terapéutico esperado.' },
    { id: 'pcne-p2', category: 'Efectividad', code: 'P2', name: 'Efecto de medicamento no administrado', description: 'El paciente no recibe un medicamento que necesita.' },
    { id: 'pcne-p3', category: 'Seguridad', code: 'P3', name: 'Reacción adversa (no alérgica)', description: 'El paciente experimenta un efecto no deseado del medicamento.' },
    { id: 'pcne-p4', category: 'Seguridad', code: 'P4', name: 'Reacción adversa (alérgica)', description: 'El paciente experimenta una reacción alérgica al medicamento.' },
    { id: 'pcne-p5', category: 'Seguridad', code: 'P5', name: 'Interacción medicamentosa', description: 'Existe una interacción clínicamente relevante entre medicamentos.' },
    { id: 'pcne-p6', category: 'Otros', code: 'P6', name: 'Problema de uso del medicamento', description: 'El paciente no usa el medicamento de forma adecuada.' },
  ],
  dader: [
    { id: 'rnm-1', category: 'Necesidad', code: 'RNM1', name: 'Problema de salud no tratado', description: 'El paciente tiene un problema de salud que requiere tratamiento farmacológico y no lo recibe.' },
    { id: 'rnm-2', category: 'Necesidad', code: 'RNM2', name: 'Medicamento innecesario', description: 'El paciente recibe un medicamento que no necesita.' },
    { id: 'rnm-3', category: 'Efectividad', code: 'RNM3', name: 'Inefectividad no cuantitativa', description: 'El medicamento no es efectivo para la indicación prescrita.' },
    { id: 'rnm-4', category: 'Efectividad', code: 'RNM4', name: 'Inefectividad cuantitativa', description: 'La dosis o pauta es insuficiente para alcanzar el efecto terapéutico.' },
    { id: 'rnm-5', category: 'Seguridad', code: 'RNM5', name: 'Inseguridad no cuantitativa', description: 'El medicamento produce un efecto adverso no dependiente de la dosis.' },
    { id: 'rnm-6', category: 'Seguridad', code: 'RNM6', name: 'Inseguridad cuantitativa', description: 'La dosis es excesiva y produce efectos adversos o toxicidad.' },
  ],
};

// ─── Follow-up Statuses ──────────────────────────────────────────────
export const followUpStatuses = [
  'No resuelto',
  'Parcialmente resuelto',
  'Resuelto',
  'Sin información',
  'Cerrado',
];

// ─── Professional Disclaimer ─────────────────────────────────────────
export const professionalDisclaimer = 'AtenFarmaClinic es una plataforma educativa y de apoyo a la documentación profesional. No sustituye el juicio clínico, los protocolos institucionales, la valoración médica ni la responsabilidad del profesional. Toda recomendación debe ser revisada y validada por un profesional competente antes de aplicarse.';

export const documentDisclaimer = 'Documento generado como apoyo. Debe ser revisado y validado por el químico farmacéutico responsable.';

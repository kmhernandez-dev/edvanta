/**
 * ============================================================
 *  CATÁLOGO MAESTRO EDVANTA — ARQUITECTURA DE FORMACIÓN
 *
 *  Separa tres conceptos:
 *    1. ÁREA PROFESIONAL   (30 áreas del mapa del Químico Farmacéutico)
 *    2. TEMA / COMPETENCIA (temas dentro de cada área, con estado de curaduría)
 *    3. CURSO CURADO       (cursos reales con proveedor, título y URL exacta)
 *
 *  Reglas de curaduría:
 *    - Un tema existe en la taxonomía aunque aún no tenga curso.
 *    - Un tema solo muestra tarjetas cuando existe contenido curado real.
 *    - Nunca se inventan cursos ni URLs para rellenar categorías.
 *    - Las URLs existentes del proyecto se reutilizan exactas, nunca se
 *      normalizan ni se reemplazan.
 *    - Las portadas usadas son las oficiales de Edutin (CDN) o las locales
 *      ya existentes en el proyecto; no se generan imágenes nuevas.
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
// 1. ÁREAS PROFESIONALES (30) — mapa profesional del QF
//    shortLabel: etiqueta corta usada en la UI de "Explora el contenido".
//    filterGroups: grupos de filtro a los que pertenece el área.
// ─────────────────────────────────────────────────────────────

export const PROFESSIONAL_AREAS = [
  {
    id: 'quality-assurance',
    slug: 'gestion-y-aseguramiento-de-la-calidad',
    title: 'Gestión y Aseguramiento de la Calidad',
    shortLabel: 'Calidad',
    filterGroups: ['calidad'],
    order: 1,
    topics: [
      { title: 'Sistemas de Gestión de Calidad' },
      { title: 'ISO 9001' },
      { title: 'Buenas Prácticas de Manufactura (BPM/GMP)' },
      { title: 'Buenas Prácticas de Laboratorio' },
      { title: 'Control de cambios' },
      { title: 'CAPA' },
      { title: 'Desviaciones y no conformidades' },
      { title: 'Gestión documental' },
      { title: 'Gestión de riesgos' },
      { title: 'Integridad de datos' },
    ],
  },
  {
    id: 'validations',
    slug: 'validaciones-y-calificaciones',
    title: 'Validaciones y Calificaciones',
    shortLabel: 'Validaciones',
    filterGroups: ['validaciones'],
    order: 2,
    topics: [
      { title: 'Validación de procesos' },
      { title: 'Validación de limpieza' },
      { title: 'Validación de métodos analíticos' },
      { title: 'Validación de sistemas computarizados' },
      { title: 'Calificación IQ/OQ/PQ' },
      { title: 'Holding Time' },
      { title: 'Media Fill' },
      { title: 'Validación de cadena de frío' },
      { title: 'Mapeo térmico' },
    ],
  },
  {
    id: 'quality-control',
    slug: 'control-de-calidad-farmaceutico',
    title: 'Control de Calidad Farmacéutico',
    shortLabel: 'Control de Calidad',
    filterGroups: ['control-calidad'],
    order: 3,
    topics: [
      { title: 'Análisis fisicoquímico' },
      { title: 'HPLC' },
      { title: 'Cromatografía de gases' },
      { title: 'Espectrofotometría' },
      { title: 'Microbiología farmacéutica' },
      { title: 'Estudios de estabilidad' },
      { title: 'Control de materias primas' },
      { title: 'Control de producto terminado' },
      { title: 'Investigación de resultados OOS/OOT' },
    ],
  },
  {
    id: 'production',
    slug: 'produccion-y-manufactura-farmaceutica',
    title: 'Producción y Manufactura Farmacéutica',
    shortLabel: 'Producción',
    filterGroups: ['produccion'],
    order: 4,
    topics: [
      { title: 'Producción de medicamentos' },
      { title: 'Tecnología farmacéutica' },
      { title: 'Formulación' },
      { title: 'Escalamiento industrial' },
      { title: 'Procesos sólidos, líquidos y semisólidos' },
      { title: 'Producción estéril' },
      { title: 'Sistemas HVAC y áreas limpias' },
      { title: 'Lean Manufacturing' },
      { title: 'Six Sigma' },
    ],
  },
  {
    id: 'clinical-pharmacy',
    slug: 'farmacia-clinica',
    title: 'Farmacia Clínica',
    shortLabel: 'Farmacia Clínica',
    filterGroups: ['farmacia-clinica'],
    order: 5,
    topics: [
      { title: 'Seguimiento farmacoterapéutico' },
      { title: 'Conciliación de medicamentos' },
      { title: 'Revisión de tratamientos' },
      { title: 'Interacciones medicamentosas' },
      { title: 'Ajuste de dosis' },
      { title: 'Farmacocinética clínica' },
      { title: 'Monitorización terapéutica' },
      { title: 'Atención farmacéutica' },
      { title: 'Seguridad del paciente' },
    ],
  },
  {
    id: 'hospital-pharmacy',
    slug: 'farmacia-hospitalaria',
    title: 'Farmacia Hospitalaria',
    shortLabel: 'Hospitalaria',
    filterGroups: ['hospitalaria'],
    order: 6,
    topics: [
      { title: 'Gestión del servicio farmacéutico' },
      { title: 'Distribución de medicamentos' },
      { title: 'Sistemas de dosis unitaria' },
      { title: 'Preparaciones magistrales' },
      { title: 'Mezclas intravenosas' },
      { title: 'Nutrición parenteral' },
      { title: 'Citostáticos' },
      { title: 'Gases medicinales' },
      { title: 'Dispositivos médicos' },
    ],
  },
  {
    id: 'pharmacovigilance',
    slug: 'farmacovigilancia-y-seguridad-de-medicamentos',
    title: 'Farmacovigilancia y Seguridad de Medicamentos',
    shortLabel: 'Farmacovigilancia',
    filterGroups: ['farmacovigilancia'],
    order: 7,
    topics: [
      { title: 'Reporte de reacciones adversas' },
      { title: 'Evaluación de causalidad' },
      { title: 'Señales de seguridad' },
      { title: 'Gestión de riesgos' },
      { title: 'Tecnovigilancia' },
      { title: 'Reactivovigilancia' },
      { title: 'Cosmetovigilancia' },
      { title: 'Materiovigilancia' },
      { title: 'Planes de gestión de riesgos' },
    ],
  },
  {
    id: 'regulatory-affairs',
    slug: 'asuntos-regulatorios',
    title: 'Asuntos Regulatorios',
    shortLabel: 'Regulatorio',
    filterGroups: ['regulatorio'],
    order: 8,
    topics: [
      { title: 'Registro sanitario' },
      { title: 'Renovaciones y modificaciones' },
      { title: 'Dossiers regulatorios' },
      { title: 'CTD/eCTD' },
      { title: 'INVIMA' },
      { title: 'ANVISA' },
      { title: 'ISP Chile' },
      { title: 'FDA' },
      { title: 'EMA' },
      { title: 'Regulatory Affairs LATAM' },
      { title: 'Etiquetado y claims' },
    ],
  },
  {
    id: 'clinical-research',
    slug: 'investigacion-clinica',
    title: 'Investigación Clínica',
    shortLabel: 'Investigación',
    filterGroups: ['investigacion'],
    order: 9,
    topics: [
      { title: 'Buenas Prácticas Clínicas' },
      { title: 'Ensayos clínicos' },
      { title: 'Protocolos de investigación' },
      { title: 'Consentimiento informado' },
      { title: 'Bioética' },
      { title: 'Gestión de centros de investigación' },
      { title: 'Clinical Research Associate' },
      { title: 'Clinical Trial Management' },
      { title: 'Farmacovigilancia en investigación' },
    ],
  },
  {
    id: 'rnd-innovation',
    slug: 'investigacion-desarrollo-e-innovacion-farmaceutica',
    title: 'Investigación, Desarrollo e Innovación Farmacéutica',
    shortLabel: 'I+D',
    filterGroups: ['investigacion'],
    order: 10,
    topics: [
      { title: 'Descubrimiento de fármacos' },
      { title: 'Desarrollo farmacéutico' },
      { title: 'Preformulación' },
      { title: 'Diseño de formulaciones' },
      { title: 'Nanotecnología farmacéutica' },
      { title: 'Biotecnología' },
      { title: 'Quality by Design' },
      { title: 'ICH Q8, Q9, Q10 y Q11' },
      { title: 'Transferencia tecnológica' },
    ],
  },
  {
    id: 'medical-affairs',
    slug: 'asuntos-medicos-y-medical-affairs',
    title: 'Asuntos Médicos y Medical Affairs',
    shortLabel: 'Medical Affairs',
    filterGroups: ['investigacion'],
    order: 11,
    topics: [
      { title: 'Medical Science Liaison' },
      { title: 'Información médica' },
      { title: 'Evidencia científica' },
      { title: 'Medical Writing' },
      { title: 'Educación médica' },
      { title: 'Real World Evidence' },
      { title: 'Comunicación científica' },
      { title: 'Gestión de líderes de opinión' },
    ],
  },
  {
    id: 'pharmacoeconomics',
    slug: 'farmacoeconomia-y-acceso-al-mercado',
    title: 'Farmacoeconomía y Acceso al Mercado',
    shortLabel: 'Farmacoeconomía',
    filterGroups: [],
    order: 12,
    topics: [
      { title: 'Evaluación de tecnologías sanitarias' },
      { title: 'Farmacoeconomía' },
      { title: 'Economía de la salud' },
      { title: 'Market Access' },
      { title: 'Análisis costo-efectividad' },
      { title: 'Modelos de impacto presupuestario' },
      { title: 'Negociación y acceso de medicamentos' },
    ],
  },
  {
    id: 'pharmacoepidemiology',
    slug: 'farmacoepidemiologia-y-salud-publica',
    title: 'Farmacoepidemiología y Salud Pública',
    shortLabel: 'Salud Pública',
    filterGroups: [],
    order: 13,
    topics: [
      { title: 'Uso racional de medicamentos' },
      { title: 'Estudios de utilización de medicamentos' },
      { title: 'Epidemiología' },
      { title: 'Salud pública' },
      { title: 'Programas de promoción y prevención' },
      { title: 'Vigilancia sanitaria' },
      { title: 'Políticas farmacéuticas' },
    ],
  },
  {
    id: 'supply-chain',
    slug: 'logistica-y-supply-chain-farmaceutica',
    title: 'Logística y Supply Chain Farmacéutica',
    shortLabel: 'Logística',
    filterGroups: ['logistica'],
    order: 14,
    topics: [
      { title: 'Gestión de inventarios' },
      { title: 'Abastecimiento' },
      { title: 'Compras' },
      { title: 'Almacenamiento' },
      { title: 'Distribución' },
      { title: 'Cadena de frío' },
      { title: 'Buenas Prácticas de Distribución' },
      { title: 'Trazabilidad' },
      { title: 'Planeación de demanda' },
      { title: 'Logística hospitalaria' },
    ],
  },
  {
    id: 'pharmaceutical-audit',
    slug: 'auditoria-farmaceutica',
    title: 'Auditoría Farmacéutica',
    shortLabel: 'Auditoría',
    filterGroups: ['calidad'],
    order: 15,
    topics: [
      { title: 'Auditorías internas' },
      { title: 'Auditorías a proveedores' },
      { title: 'Auditorías GMP' },
      { title: 'ISO 19011' },
      { title: 'Auditoría de sistemas de calidad' },
      { title: 'Inspecciones regulatorias' },
      { title: 'Preparación para visitas INVIMA/FDA' },
    ],
  },
  {
    id: 'microbiology',
    slug: 'microbiologia-farmaceutica-y-esterilidad',
    title: 'Microbiología Farmacéutica y Esterilidad',
    shortLabel: 'Microbiología',
    filterGroups: ['control-calidad'],
    order: 16,
    topics: [
      { title: 'Control microbiológico' },
      { title: 'Esterilidad' },
      { title: 'Endotoxinas' },
      { title: 'Monitoreo ambiental' },
      { title: 'Áreas limpias' },
      { title: 'Contaminación microbiológica' },
      { title: 'Validación microbiológica' },
      { title: 'Procesamiento aséptico' },
    ],
  },
  {
    id: 'toxicology',
    slug: 'toxicologia',
    title: 'Toxicología',
    shortLabel: 'Toxicología',
    filterGroups: [],
    order: 17,
    topics: [
      { title: 'Toxicología clínica' },
      { title: 'Toxicología ocupacional' },
      { title: 'Toxicología ambiental' },
      { title: 'Toxicología forense' },
      { title: 'Evaluación de riesgos' },
      { title: 'Intoxicaciones' },
      { title: 'Seguridad química' },
    ],
  },
  {
    id: 'cosmetics',
    slug: 'dermocosmetica-y-cosmetica',
    title: 'Dermocosmética y Cosmética',
    shortLabel: 'Dermocosmética',
    filterGroups: [],
    order: 18,
    topics: [
      { title: 'Formulación cosmética' },
      { title: 'Dermofarmacia' },
      { title: 'Cosmetología' },
      { title: 'Regulación cosmética' },
      { title: 'Control de calidad cosmético' },
      { title: 'Cosmetovigilancia' },
      { title: 'Desarrollo de productos' },
    ],
  },
  {
    id: 'natural-products',
    slug: 'productos-naturales-fitoterapia-y-nutraceuticos',
    title: 'Productos Naturales, Fitoterapia y Nutracéuticos',
    shortLabel: 'Fitoterapia',
    filterGroups: [],
    order: 19,
    topics: [
      { title: 'Fitoterapia' },
      { title: 'Productos naturales' },
      { title: 'Suplementos dietarios' },
      { title: 'Nutracéuticos' },
      { title: 'Control de calidad' },
      { title: 'Desarrollo y formulación' },
      { title: 'Regulación sanitaria' },
    ],
  },
  {
    id: 'biotech',
    slug: 'biotecnologia-y-medicamentos-biologicos',
    title: 'Biotecnología y Medicamentos Biológicos',
    shortLabel: 'Biotecnología',
    filterGroups: [],
    order: 20,
    topics: [
      { title: 'Medicamentos biológicos' },
      { title: 'Biosimilares' },
      { title: 'Vacunas' },
      { title: 'Proteínas recombinantes' },
      { title: 'Anticuerpos monoclonales' },
      { title: 'Producción biotecnológica' },
      { title: 'Control de calidad biológico' },
    ],
  },
  {
    id: 'radiopharmacy',
    slug: 'radiofarmacia',
    title: 'Radiofarmacia',
    shortLabel: 'Radiofarmacia',
    filterGroups: [],
    order: 21,
    topics: [
      { title: 'Radiofármacos' },
      { title: 'Medicina nuclear' },
      { title: 'Producción y control' },
      { title: 'Protección radiológica' },
      { title: 'Buenas prácticas de radiofarmacia' },
    ],
  },
  {
    id: 'oncology-pharmacy',
    slug: 'farmacia-oncologica',
    title: 'Farmacia Oncológica',
    shortLabel: 'Oncología',
    filterGroups: ['farmacia-clinica'],
    order: 22,
    topics: [
      { title: 'Farmacoterapia oncológica' },
      { title: 'Preparación de citostáticos' },
      { title: 'Seguridad en quimioterapia' },
      { title: 'Terapias dirigidas' },
      { title: 'Inmunoterapia' },
      { title: 'Seguimiento farmacoterapéutico oncológico' },
    ],
  },
  {
    id: 'antimicrobials',
    slug: 'antimicrobianos-e-infectologia',
    title: 'Antimicrobianos e Infectología',
    shortLabel: 'Infectología',
    filterGroups: ['farmacia-clinica'],
    order: 23,
    topics: [
      { title: 'Optimización de antimicrobianos' },
      { title: 'PROA / Stewardship' },
      { title: 'Resistencia antimicrobiana' },
      { title: 'Farmacocinética/farmacodinamia' },
      { title: 'Antibioticoterapia' },
    ],
  },
  {
    id: 'medical-devices',
    slug: 'dispositivos-medicos-y-tecnologias-sanitarias',
    title: 'Dispositivos Médicos y Tecnologías Sanitarias',
    shortLabel: 'Dispositivos',
    filterGroups: [],
    order: 24,
    topics: [
      { title: 'Tecnovigilancia' },
      { title: 'Regulación de dispositivos' },
      { title: 'Gestión de riesgo' },
      { title: 'Calidad' },
      { title: 'Validación' },
      { title: 'Registro sanitario' },
    ],
  },
  {
    id: 'healthcare-enablement',
    slug: 'sistemas-de-habilitacion-y-gestion-sanitaria',
    title: 'Sistemas de Habilitación y Gestión Sanitaria',
    shortLabel: 'Habilitación',
    filterGroups: [],
    order: 25,
    topics: [
      { title: 'Sistema Único de Habilitación' },
      { title: 'Auditoría para el Mejoramiento de la Calidad' },
      { title: 'Seguridad del paciente' },
      { title: 'Gestión del riesgo sanitario' },
      { title: 'Acreditación en salud' },
      { title: 'Indicadores de calidad' },
    ],
  },
  {
    id: 'occupational-health',
    slug: 'seguridad-y-salud-en-el-trabajo',
    title: 'Seguridad y Salud en el Trabajo',
    shortLabel: 'SST',
    filterGroups: [],
    order: 26,
    topics: [
      { title: 'Riesgo químico' },
      { title: 'Manejo de sustancias peligrosas' },
      { title: 'Toxicología ocupacional' },
      { title: 'Sistemas ISO 45001' },
      { title: 'Gestión de riesgos laborales' },
    ],
  },
  {
    id: 'environmental',
    slug: 'gestion-ambiental-farmaceutica',
    title: 'Gestión Ambiental Farmacéutica',
    shortLabel: 'Ambiental',
    filterGroups: [],
    order: 27,
    topics: [
      { title: 'ISO 14001' },
      { title: 'Gestión de residuos farmacéuticos' },
      { title: 'Residuos peligrosos' },
      { title: 'Vertimientos' },
      { title: 'Gestión ambiental industrial' },
      { title: 'Sostenibilidad farmacéutica' },
    ],
  },
  {
    id: 'data-ai',
    slug: 'data-tecnologia-e-inteligencia-artificial-aplicada-a-farmacia',
    title: 'Data, Tecnología e Inteligencia Artificial aplicada a Farmacia',
    shortLabel: 'Tecnología',
    filterGroups: ['tecnologia'],
    order: 28,
    topics: [
      { title: 'Power BI' },
      { title: 'Excel avanzado' },
      { title: 'SQL' },
      { title: 'Python' },
      { title: 'Inteligencia artificial' },
      { title: 'Automatización' },
      { title: 'Data Integrity' },
      { title: 'Analítica farmacéutica' },
      { title: 'Sistemas LIMS' },
      { title: 'Sistemas ERP' },
    ],
  },
  {
    id: 'project-operations',
    slug: 'gestion-de-proyectos-y-operaciones',
    title: 'Gestión de Proyectos y Operaciones',
    shortLabel: 'Proyectos',
    filterGroups: ['produccion'],
    order: 29,
    topics: [
      { title: 'Project Management' },
      { title: 'Scrum' },
      { title: 'Lean' },
      { title: 'Six Sigma' },
      { title: 'Mejora continua' },
      { title: 'Gestión por procesos' },
      { title: 'Indicadores KPI' },
      { title: 'Planeación estratégica' },
    ],
  },
  {
    id: 'management',
    slug: 'direccion-y-gerencia-farmaceutica',
    title: 'Dirección y Gerencia Farmacéutica',
    shortLabel: 'Gerencia',
    filterGroups: [],
    order: 30,
    topics: [
      { title: 'Gerencia farmacéutica' },
      { title: 'Dirección técnica' },
      { title: 'Liderazgo' },
      { title: 'Gestión financiera' },
      { title: 'Recursos humanos' },
      { title: 'Gestión comercial' },
      { title: 'Emprendimiento farmacéutico' },
      { title: 'Consultoría' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// 2. PORTADAS OFICIALES EDUTIN (CDN) + PÁGINAS OFICIALES
//    Suministradas por el propietario (28 cursos).
//    Las URLS de afiliado existentes del proyecto NO se tocan.
// ─────────────────────────────────────────────────────────────

const CDN_BASE = 'https://d3puay5pkxu9s4.cloudfront.net/courses';

const OFFICIAL = {
  '12938': { page: 'https://edutin.com/curso-de-gestion-de-calidad', cover: `${CDN_BASE}/12938/img/web/800_imagen.jpg` },
  '12678': { page: 'https://edutin.com/curso-de-farmacologia-clinica', cover: `${CDN_BASE}/12678/img/web/800_imagen.jpg` },
  '12984': { page: 'https://edutin.com/curso-de-soporte-vital-avanzado-acls', cover: `${CDN_BASE}/12984/img/web/800_imagen.jpg` },
  '12532': { page: 'https://edutin.com/curso-de-power-bi', cover: `${CDN_BASE}/12532/img/web/800_imagen.jpg` },
  '13109': { page: 'https://edutin.com/curso-de-auditoria', cover: `${CDN_BASE}/13109/img/web/800_imagen.jpg` },
  '13469': { page: 'https://edutin.com/curso-de-gestion-ambiental', cover: `${CDN_BASE}/13469/img/web/800_imagen.jpg` },
  '13477': { page: 'https://edutin.com/curso-de-auxiliar-de-recursos-humanos', cover: `${CDN_BASE}/13477/img/web/800_imagen.jpg` },
  '13226': { page: 'https://edutin.com/curso-de-gestion-del-riesgo', cover: `${CDN_BASE}/13226/img/web/800_imagen.jpg` },
  '12879': { page: 'https://edutin.com/curso-de-gerente-de-ventas', cover: `${CDN_BASE}/12879/img/web/800_imagen.jpg` },
  '12549': { page: 'https://edutin.com/curso-de-gestion-de-proyectos', cover: `${CDN_BASE}/12549/img/web/800_imagen.jpg` },
  '12987': { page: 'https://edutin.com/curso-de-seguridad-y-salud-en-el-trabajo', cover: `${CDN_BASE}/12987/img/web/800_imagen.jpg` },
  '12588': { page: 'https://edutin.com/curso-de-lean-six-sigma', cover: `${CDN_BASE}/12588/img/web/800_imagen.jpg` },
  '12578': { page: 'https://edutin.com/curso-de-lean', cover: `${CDN_BASE}/12578/img/web/800_imagen.jpg` },
  '3429': { page: 'https://edutin.com/curso-de-mecanica-de-fluidos-3429', cover: `${CDN_BASE}/3429/img/web/800_imagen.jpg` },
  '4591': { page: 'https://edutin.com/curso-de-asesor-juridico', cover: `${CDN_BASE}/4591/img/web/800_imagen.jpg` },
  '12962': { page: 'https://edutin.com/curso-de-prl', cover: `${CDN_BASE}/12962/img/web/800_imagen.jpg` },
  '12413': { page: 'https://edutin.com/curso-de-logistica-de-transporte', cover: `${CDN_BASE}/12413/img/web/800_imagen.jpg` },
  '12854': { page: 'https://edutin.com/curso-de-asistente-administrativo', cover: `${CDN_BASE}/12854/img/web/800_imagen.jpg` },
  '12727': { page: 'https://edutin.com/curso-de-manejo-de-sustancias-quimicas-peligrosas', cover: `${CDN_BASE}/12727/img/web/800_imagen.jpg` },
  '12719': { page: 'https://edutin.com/curso-de-comercio-internacional', cover: `${CDN_BASE}/12719/img/web/800_imagen.jpg` },
  '12848': { page: 'https://edutin.com/curso-de-contabilidad-financiera', cover: `${CDN_BASE}/12848/img/web/800_imagen.jpg` },
  '13242': { page: 'https://edutin.com/curso-de-investigacion-clinica', cover: `${CDN_BASE}/13242/img/web/800_imagen.jpg` },
  '12482': { page: 'https://edutin.com/curso-de-recursos-humanos', cover: `${CDN_BASE}/12482/img/web/800_imagen.jpg` },
  '12702': { page: 'https://edutin.com/curso-de-derecho-ambiental', cover: `${CDN_BASE}/12702/img/web/800_imagen.jpg` },
  '13097': { page: 'https://edutin.com/curso-de-ia-para-abastecimiento-y-compras', cover: `${CDN_BASE}/13097/img/web/800_imagen.jpg` },
  '13096': { page: 'https://edutin.com/curso-de-ia-para-impuestos-y-cumplimiento-fiscal', cover: `${CDN_BASE}/13096/img/web/800_imagen.jpg` },
  '13098': { page: 'https://edutin.com/curso-de-ia-para-control-de-inventarios-y-almacen', cover: `${CDN_BASE}/13098/img/web/800_imagen.jpg` },
  '13028': { page: 'https://edutin.com/curso-de-ia-para-logistica', cover: `${CDN_BASE}/13028/img/web/800_imagen.jpg` },
};

// Portadas locales ya existentes en el proyecto (reutilizadas, no se tocan).
const LOCAL_COVERS = {
  'sh-9060': { webp: '/img/cursos/gestion-de-calidad.webp', jpg: '/img/cursos/gestion-de-calidad.jpg', alt: 'Curso virtual de gestión de calidad con enfoque en procesos, indicadores y mejora continua' },
  'sh-9086': { webp: '/img/cursos/power-bi.webp', jpg: '/img/cursos/power-bi.jpg', alt: 'Curso virtual de Power BI para crear dashboards e indicadores profesionales' },
  'sh-9215': { webp: '/img/cursos/auditoria.webp', jpg: '/img/cursos/auditoria.jpg', alt: 'Curso virtual de auditoría para evaluar procesos, cumplimiento y mejora organizacional' },
  'sh-13818': { webp: '/img/cursos/gestion-ambiental.webp', jpg: '/img/cursos/gestion-ambiental.jpg', alt: 'Curso virtual de gestión ambiental con enfoque en sostenibilidad, residuos y cumplimiento' },
  'sh-13571': { webp: '/img/cursos/seguridad-y-salud-en-el-trabajo.webp', jpg: '/img/cursos/seguridad-y-salud-en-el-trabajo.jpg', alt: 'Curso virtual de seguridad y salud en el trabajo para prevención de riesgos laborales' },
  'sh-10262': { webp: '/img/cursos/gestion-de-proyectos.webp', jpg: '/img/cursos/gestion-de-proyectos.jpg', alt: 'Curso virtual de gestión de proyectos para planificación, recursos y seguimiento' },
  'sh-13568': { webp: '/img/cursos/lean.webp', jpg: '/img/cursos/lean.jpg', alt: 'Curso virtual de Lean para identificar desperdicios, mejorar flujo y aumentar valor' },
  'sh-10218': { webp: '/img/cursos/lean-six-sigma.webp', jpg: '/img/cursos/lean-six-sigma.jpg', alt: 'Curso virtual de Lean Six Sigma para DMAIC, análisis de variabilidad y mejora de procesos' },
};

// Portadas oficiales Edutin descargadas localmente (public/img/cursos/edutin/{edutinId}.jpg).
// Se usan SOLO cuando el curso no tiene una portada local previa en el proyecto.
const EDUTIN_COVER = (edutinId, title) => ({
  src: `/img/cursos/edutin/${edutinId}.jpg`,
  jpg: `/img/cursos/edutin/${edutinId}.jpg`,
  webp: `/img/cursos/edutin/${edutinId}.jpg`,
  alt: `Portada oficial del curso ${title}`,
});

/**
 * Curso curado.
 *  - id:      clave interna Edvanta (estable, no cambiar).
 *  - edutinId: ID numérico de Edutin (12938, ...) cuando existe.
 *  - code:    código de afiliado existente (SH-XXXXX) o null.
 *  - urls:
 *      officialUrl    → página oficial (solo referencia; NO se usa en CTA).
 *      affiliateUrl   → URL de afiliado existente en el proyecto (si existe).
 *      destinationUrl → affiliateUrl siempre; NUNCA la página oficial.
 *  - image:   portada local existente (si hay) o portada oficial CDN.
 */
function curatedCourse({ id, existingId, name, edutinId, existingUrl = null, source, description = '' }) {
  const official = OFFICIAL[String(edutinId)];
  const affiliateUrl = existingUrl || null;
  const local = LOCAL_COVERS[existingId] || null;
  const image = local || EDUTIN_COVER(edutinId, name);
  return {
    id,
    edutinId,
    provider: 'edutin',
    title: name,
    code: existingId ? existingId.toUpperCase() : null,
    officialUrl: official.page,
    affiliateUrl,
    destinationUrl: affiliateUrl,
    image,
    urlPreserved: Boolean(affiliateUrl),
    urlSource: affiliateUrl ? 'existing_affiliate' : 'pending',
    description,
  };
}

// Mapeo con las URLs EXISTENTES del proyecto (src/data/courses.js y featuredCourses.js).
// Estas URLs NO se modifican ni se normalizan.
export const CATALOG_COURSES = [
  curatedCourse({ id: 'edutin-gestion-calidad', existingId: 'sh-9060', name: 'Gestión de Calidad', edutinId: 12938, existingUrl: 'https://edutin.com/sh-9060', source: 'featuredCourses.js / courses.js', description: 'Sistemas de gestión de calidad, enfoque por procesos, indicadores, riesgos y mejora continua.' }),
  curatedCourse({ id: 'edutin-farmacologia-clinica', existingId: 'sh-7429', name: 'Farmacología Clínica', edutinId: 12678, existingUrl: 'https://edutin.com/sh-7429', source: 'courses.js', description: 'Fundamentos de farmacología aplicada al ejercicio clínico del farmacéutico.' }),
  curatedCourse({ id: 'edutin-acls', existingId: 'sh-17411', name: 'Soporte Vital Avanzado — ACLS', edutinId: 12984, existingUrl: 'https://edutin.com/sh-17411', source: 'courses.js', description: 'Protocolos y habilidades para el manejo del paro cardiorrespiratorio en adultos.' }),
  curatedCourse({ id: 'edutin-power-bi', existingId: 'sh-9086', name: 'Power BI', edutinId: 12532, existingUrl: 'https://edutin.com/sh-9086', source: 'featuredCourses.js', description: 'Transformación de datos, visualizaciones e indicadores para decisiones profesionales.' }),
  curatedCourse({ id: 'edutin-auditoria', existingId: 'sh-9215', name: 'Auditoría', edutinId: 13109, existingUrl: 'https://edutin.com/sh-9215', source: 'featuredCourses.js', description: 'Planificación de auditorías, recolección de evidencias, hallazgos y seguimiento.' }),
  curatedCourse({ id: 'edutin-gestion-ambiental', existingId: 'sh-13818', name: 'Gestión Ambiental', edutinId: 13469, existingUrl: 'https://edutin.com/sh-13818', source: 'courses.js', description: 'Identificación de impactos, gestión de residuos, cumplimiento y prácticas sostenibles.' }),
  curatedCourse({ id: 'edutin-auxiliar-rrhh', existingId: null, name: 'Auxiliar de Recursos Humanos', edutinId: 13477, source: 'pending_affiliate', description: 'Formación para apoyar procesos administrativos de gestión humana.' }),
  curatedCourse({ id: 'edutin-gestion-riesgo', existingId: 'sh-15970', name: 'Gestión del Riesgo', edutinId: 13226, existingUrl: 'https://edutin.com/sh-15970', source: 'courses.js', description: 'Identificación, análisis y tratamiento del riesgo en sistemas de gestión.' }),
  curatedCourse({ id: 'edutin-gerente-ventas', existingId: null, name: 'Gerente de Ventas', edutinId: 12879, source: 'pending_affiliate', description: 'Liderazgo comercial, gestión de equipos de ventas y resultados.' }),
  curatedCourse({ id: 'edutin-gestion-proyectos', existingId: 'sh-10262', name: 'Gestión de Proyectos', edutinId: 12549, existingUrl: 'https://edutin.com/sh-10262', source: 'featuredCourses.js', description: 'Definición de objetivos, planificación de tiempos, recursos, riesgos y entregables.' }),
  curatedCourse({ id: 'edutin-sst', existingId: 'sh-13571', name: 'Seguridad y Salud en el Trabajo', edutinId: 12987, existingUrl: 'https://edutin.com/sh-13571', source: 'featuredCourses.js', description: 'Identificación de peligros, evaluación de riesgos y cultura de prevención.' }),
  curatedCourse({ id: 'edutin-lean-six-sigma', existingId: 'sh-10218', name: 'Lean Six Sigma', edutinId: 12588, existingUrl: 'https://edutin.com/sh-10218', source: 'featuredCourses.js', description: 'DMAIC, análisis de variabilidad y mejora de procesos con evidencia.' }),
  curatedCourse({ id: 'edutin-lean', existingId: 'sh-13568', name: 'Lean', edutinId: 12578, existingUrl: 'https://edutin.com/sh-13568', source: 'featuredCourses.js', description: 'Principios Lean, desperdicios, flujo de valor y mejora continua.' }),
  curatedCourse({ id: 'edutin-mecanica-fluidos', existingId: 'sh-22471', name: 'Mecánica de Fluidos', edutinId: 3429, existingUrl: 'https://edutin.com/sh-22471', source: 'courses.js', description: 'Bases de mecánica de fluidos aplicables a procesos industriales y farmacéuticos.' }),
  curatedCourse({ id: 'edutin-asesor-juridico', existingId: 'sh-22765', name: 'Asesor Jurídico', edutinId: 4591, existingUrl: 'https://edutin.com/sh-22765', source: 'courses.js', description: 'Fundamentos jurídicos para el ejercicio profesional.' }),
  curatedCourse({ id: 'edutin-prl', existingId: 'sh-13572', name: 'PRL', edutinId: 12962, existingUrl: 'https://edutin.com/sh-13572', source: 'courses.js', description: 'Prevención de riesgos laborales, condiciones seguras y cultura preventiva.' }),
  curatedCourse({ id: 'edutin-logistica-transporte', existingId: 'sh-10005', name: 'Logística de Transporte', edutinId: 12413, existingUrl: 'https://edutin.com/sh-10005', source: 'courses.js', description: 'Operación y coordinación del transporte en la cadena logística.' }),
  curatedCourse({ id: 'edutin-asistente-administrativo', existingId: 'sh-21034', name: 'Asistente Administrativo', edutinId: 12854, existingUrl: 'https://edutin.com/sh-21034', source: 'courses.js', description: 'Apoyo administrativo y organización de la información profesional.' }),
  curatedCourse({ id: 'edutin-manejo-sustancias', existingId: 'sh-7431', name: 'Manejo de Sustancias Químicas Peligrosas', edutinId: 12727, existingUrl: 'https://edutin.com/sh-7431', source: 'courses.js', description: 'Identificación y manejo seguro de sustancias químicas peligrosas en el trabajo.' }),
  curatedCourse({ id: 'edutin-comercio-internacional', existingId: null, name: 'Comercio Internacional', edutinId: 12719, source: 'pending_affiliate', description: 'Fundamentos del comercio exterior y la operación internacional.' }),
  curatedCourse({ id: 'edutin-contabilidad-financiera', existingId: 'sh-22588', name: 'Contabilidad Financiera', edutinId: 12848, existingUrl: 'https://edutin.com/sh-22588', source: 'courses.js', description: 'Fundamentos contables y lectura de información financiera para gestión.' }),
  curatedCourse({ id: 'edutin-investigacion-clinica', existingId: null, name: 'Investigación Clínica', edutinId: 13242, source: 'pending_affiliate', description: 'Fundamentos de la investigación clínica en la industria farmacéutica.' }),
  curatedCourse({ id: 'edutin-rrhh', existingId: null, name: 'Recursos Humanos', edutinId: 12482, source: 'pending_affiliate', description: 'Gestión de recursos humanos y desarrollo del talento.' }),
  curatedCourse({ id: 'edutin-derecho-ambiental', existingId: 'sh-18433', name: 'Derecho Ambiental', edutinId: 12702, existingUrl: 'https://edutin.com/sh-18433', source: 'courses.js', description: 'Marco jurídico ambiental aplicado a organizaciones.' }),
  curatedCourse({ id: 'edutin-ia-abastecimiento', existingId: 'sh-15647', name: 'IA para Abastecimiento y Compras', edutinId: 13097, existingUrl: 'https://edutin.com/sh-15647', source: 'courses.js', description: 'Inteligencia artificial aplicada a abastecimiento, compras y cadena de suministro.' }),
  curatedCourse({ id: 'edutin-ia-impuestos', existingId: 'sh-22972', name: 'IA para Impuestos y Cumplimiento Fiscal', edutinId: 13096, existingUrl: 'https://edutin.com/sh-22972', source: 'courses.js', description: 'IA aplicada a procesos tributarios y cumplimiento fiscal.' }),
  curatedCourse({ id: 'edutin-ia-inventarios', existingId: 'sh-15648', name: 'IA para Control de Inventarios y Almacén', edutinId: 13098, existingUrl: 'https://edutin.com/sh-15648', source: 'courses.js', description: 'IA para control de inventarios, almacenamiento y operación de bodegas.' }),
  curatedCourse({ id: 'edutin-ia-logistica', existingId: null, name: 'IA para Logística', edutinId: 13028, source: 'pending_affiliate', description: 'Inteligencia artificial aplicada a la operación logística.' }),
];

// ─────────────────────────────────────────────────────────────
// 3. RELACIONES CURSO ↔ TEMA  (courseId ↔ topicKey, contexto por área)
// ─────────────────────────────────────────────────────────────

const TOPIC_MAP = {};
for (const area of PROFESSIONAL_AREAS) {
  area.topics.forEach((topic, index) => {
    const key = `${area.id}-t${index}`;
    topic.key = key;
    topic.areaId = area.id;
    TOPIC_MAP[key] = topic;
  });
}
export const TOPIC_INDEX = TOPIC_MAP;

const rel = (courseId, topicKey) => ({ courseId, topicKey });

export const COURSE_TOPIC_RELATIONS = [
  // Gestión de Calidad → calidad
  rel('edutin-gestion-calidad', 'quality-assurance-t0'), // Sistemas de Gestión de Calidad
  rel('edutin-gestion-calidad', 'quality-assurance-t1'), // ISO 9001

  // Auditoría → auditoría farmacéutica
  rel('edutin-auditoria', 'pharmaceutical-audit-t0'), // Auditorías internas
  rel('edutin-auditoria', 'pharmaceutical-audit-t3'), // ISO 19011

  // Gestión del Riesgo → varios contextos (sin duplicar el curso)
  rel('edutin-gestion-riesgo', 'quality-assurance-t8'), // Gestión de riesgos (calidad)
  rel('edutin-gestion-riesgo', 'medical-devices-t2'),   // Gestión de riesgo (dispositivos)
  rel('edutin-gestion-riesgo', 'healthcare-enablement-t3'), // Gestión del riesgo sanitario

  // Power BI → tecnología + KPI
  rel('edutin-power-bi', 'data-ai-t0'),          // Power BI
  rel('edutin-power-bi', 'project-operations-t6'), // Indicadores KPI

  // Gestión Ambiental
  rel('edutin-gestion-ambiental', 'environmental-t0'), // ISO 14001
  rel('edutin-gestion-ambiental', 'environmental-t4'), // Gestión ambiental industrial

  // SST
  rel('edutin-sst', 'occupational-health-t4'), // Gestión de riesgos laborales

  // Manejo de Sustancias Químicas Peligrosas
  rel('edutin-manejo-sustancias', 'occupational-health-t0'), // Riesgo químico
  rel('edutin-manejo-sustancias', 'occupational-health-t1'), // Manejo de sustancias peligrosas
  rel('edutin-manejo-sustancias', 'toxicology-t1'),          // Toxicología ocupacional
  rel('edutin-manejo-sustancias', 'toxicology-t6'),          // Seguridad química

  // Lean Six Sigma
  rel('edutin-lean-six-sigma', 'production-t7'),     // Lean Manufacturing
  rel('edutin-lean-six-sigma', 'production-t8'),     // Six Sigma
  rel('edutin-lean-six-sigma', 'project-operations-t4'), // Mejora continua

  // Lean
  rel('edutin-lean', 'production-t7'),               // Lean Manufacturing
  rel('edutin-lean', 'project-operations-t2'),       // Lean

  // Gestión de Proyectos
  rel('edutin-gestion-proyectos', 'project-operations-t0'), // Project Management

  // Logística de Transporte
  rel('edutin-logistica-transporte', 'supply-chain-t4'), // Distribución

  // IA Abastecimiento y Compras
  rel('edutin-ia-abastecimiento', 'supply-chain-t1'), // Abastecimiento
  rel('edutin-ia-abastecimiento', 'supply-chain-t2'), // Compras
  rel('edutin-ia-abastecimiento', 'data-ai-t4'),      // Inteligencia artificial

  // IA Inventarios y Almacén
  rel('edutin-ia-inventarios', 'supply-chain-t0'),    // Gestión de inventarios
  rel('edutin-ia-inventarios', 'supply-chain-t3'),    // Almacenamiento
  rel('edutin-ia-inventarios', 'data-ai-t4'),         // Inteligencia artificial

  // Contabilidad Financiera → gerencia financiera
  rel('edutin-contabilidad-financiera', 'management-t3'),

  // PRL → gestión de riesgos laborales
  rel('edutin-prl', 'occupational-health-t4'),

  // Recursos Humanos y Auxiliar de RRHH → recursos humanos (gerencia)
  rel('edutin-rrhh', 'management-t4'),
  rel('edutin-auxiliar-rrhh', 'management-t4'),
];

// Relaciones al área completa (curso transversal; no se asume tema específico).
export const COURSE_AREA_RELATIONS = [
  { courseId: 'edutin-gestion-riesgo', areaId: 'validations' },
  { courseId: 'edutin-auditoria', areaId: 'quality-assurance' },
  { courseId: 'edutin-farmacologia-clinica', areaId: 'clinical-pharmacy' },
  { courseId: 'edutin-investigacion-clinica', areaId: 'clinical-research' },
  { courseId: 'edutin-ia-logistica', areaId: 'supply-chain' },
  { courseId: 'edutin-ia-logistica', areaId: 'data-ai' },
];

// ─────────────────────────────────────────────────────────────
// 4. ÓRDENES EDITORIALES / COMERCIALES (manuales, no automáticos)
// ─────────────────────────────────────────────────────────────

export const POPULAR_COURSE_IDS = [
  'edutin-gestion-calidad',
  'edutin-farmacologia-clinica',
  'edutin-acls',
  'edutin-power-bi',
  'edutin-auditoria',
  'edutin-gestion-ambiental',
  'edutin-auxiliar-rrhh',
  'edutin-gestion-riesgo',
];

export const NEW_COURSE_IDS = [
  'edutin-gerente-ventas',
  'edutin-gestion-proyectos',
  'edutin-sst',
  'edutin-lean-six-sigma',
  'edutin-lean',
  'edutin-mecanica-fluidos',
  'edutin-prl',
  'edutin-logistica-transporte',
];

// ─────────────────────────────────────────────────────────────
// 5. HELPERS DERIVADOS
// ─────────────────────────────────────────────────────────────

const courseById = Object.fromEntries(CATALOG_COURSES.map((c) => [c.id, c]));

export function getCourse(id) {
  return courseById[id];
}

export function getCoursesByList(ids) {
  return ids.map(getCourse).filter(Boolean);
}

export function getCoursesForTopic(topicKey) {
  return COURSE_TOPIC_RELATIONS.filter((r) => r.topicKey === topicKey)
    .map((r) => getCourse(r.courseId))
    .filter(Boolean);
}

export function getCoursesForArea(areaId) {
  const byTopic = COURSE_TOPIC_RELATIONS.filter((r) => (TOPIC_MAP[r.topicKey] || {}).areaId === areaId).map((r) => getCourse(r.courseId));
  const byArea = COURSE_AREA_RELATIONS.filter((r) => r.areaId === areaId).map((r) => getCourse(r.courseId));
  return [...new Map([...byTopic, ...byArea].map((c) => [c.id, c])).values()];
}

export function getTopicResourceCount(topicKey) {
  return getCoursesForTopic(topicKey).length;
}

export function getAreaStats(areaId) {
  const area = PROFESSIONAL_AREAS.find((a) => a.id === areaId);
  return {
    totalTopics: area.topics.length,
    topicsWithCourses: area.topics.filter((t) => getTopicResourceCount(t.key) > 0).length,
    courseCount: getCoursesForArea(areaId).length,
  };
}

export function getFilterGroups() {
  return [
    { id: 'calidad', label: 'Calidad' },
    { id: 'validaciones', label: 'Validaciones' },
    { id: 'control-calidad', label: 'Control de Calidad' },
    { id: 'produccion', label: 'Producción' },
    { id: 'farmacia-clinica', label: 'Farmacia Clínica' },
    { id: 'hospitalaria', label: 'Hospitalaria' },
    { id: 'farmacovigilancia', label: 'Farmacovigilancia' },
    { id: 'regulatorio', label: 'Regulatorio' },
    { id: 'investigacion', label: 'Investigación' },
    { id: 'logistica', label: 'Logística' },
    { id: 'tecnologia', label: 'Tecnología' },
  ];
}

export function getAreasForFilter(groupId) {
  if (!groupId) return PROFESSIONAL_AREAS;
  return PROFESSIONAL_AREAS.filter((a) => (a.filterGroups || []).includes(groupId));
}

export function searchAreas(query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return PROFESSIONAL_AREAS;
  return PROFESSIONAL_AREAS.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.topics.some((t) => t.title.toLowerCase().includes(q)),
  );
}

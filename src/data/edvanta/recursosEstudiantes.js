/**
 * ============================================================
 *  data/edvanta/recursosEstudiantes.js
 *  /recursos-para-estudiantes-de-quimica-farmaceutica
 *
 *  La página que las facultades, los colegios profesionales y los
 *  semilleros pueden enlazar desde su sección de recursos o de
 *  egresados (kit de enlaces, 11-nov-2026). Reúne lo que Edvanta ya
 *  ofrece gratis, sin prometer nada que no exista:
 *
 *  - los 61 cursos para profesionales que imparte Edvanta (fichas con
 *    «Lo imparte: Edvanta» en producción el 11-nov-2026), por área;
 *  - las guías de carrera con contenido propio (industriaCursos50.js);
 *  - las alertas sanitarias, las herramientas para la carrera y cómo
 *    citar a Edvanta en un trabajo académico.
 *
 *  La aplicación (RecursosEstudiantes.jsx) y el HTML para buscadores
 *  (scripts/seo-rutas-fijas.mjs) leen este mismo archivo.
 * ============================================================
 */

export const RUTA_RECURSOS_ESTUDIANTES = '/recursos-para-estudiantes-de-quimica-farmaceutica';
export const URL_RECURSOS_ESTUDIANTES = `https://edvanta.co${RUTA_RECURSOS_ESTUDIANTES}`;

export const RECURSOS_ESTUDIANTES = {
  seoTitle: 'Recursos gratis para estudiantes de Química Farmacéutica',
  seoDescription: '61 cursos gratis de calidad, asuntos regulatorios, farmacología y farmacoterapia, guías de carrera, alertas del INVIMA y herramientas de empleo.',
  titulo: 'Recursos gratuitos para estudiantes de',
  resaltado: 'Química Farmacéutica y Farmacia',
  lead: 'Cursos gratuitos con casos de Colombia, guías para elegir tu área, alertas sanitarias con fuente oficial y herramientas para tu primer empleo. Para estudiantes y egresados de Química Farmacéutica, Farmacia y Regencia de Farmacia.',
  certificado: 'El contenido de los cursos es gratuito. Si necesitas el certificado verificable para tu hoja de vida, es opcional y cuesta COP 60.000 por curso.',
};

/** Los cursos que imparte Edvanta, por área (verificados en producción). */
export const CURSOS_POR_AREA = [
  {
    area: 'Calidad farmacéutica',
    para: 'Para prácticas y primeros empleos en laboratorios fabricantes y de control de calidad.',
    cursos: [
      ['/curso-de-buenas-practicas-de-manufactura-bpm', 'Buenas Prácticas de Manufactura — BPM'],
      ['/curso-de-bpm-en-la-industria-farmaceutica', 'BPM en la Industria Farmacéutica'],
      ['/curso-de-buenas-practicas-de-laboratorio-bpl', 'Buenas Prácticas de Laboratorio — BPL'],
      ['/curso-de-buenas-practicas-de-documentacion-farmaceutica', 'Buenas Prácticas de Documentación Farmacéutica'],
      ['/curso-de-control-de-calidad-de-medicamentos', 'Control de Calidad de Medicamentos'],
      ['/curso-de-validacion-de-metodos-analiticos', 'Validación de Métodos Analíticos'],
      ['/curso-de-validaciones-y-calificaciones', 'Validaciones y Calificaciones'],
      ['/curso-de-aseguramiento-de-la-calidad-farmaceutica', 'Aseguramiento de la Calidad Farmacéutica'],
      ['/curso-de-gestion-de-calidad-farmaceutica', 'Gestión de Calidad Farmacéutica'],
      ['/curso-de-gestion-de-desviaciones-y-capa', 'Gestión de Desviaciones y CAPA'],
      ['/curso-de-gestion-de-riesgos-en-la-calidad-farmaceutica', 'Gestión de Riesgos en la Calidad Farmacéutica'],
      ['/curso-de-auditoria-de-calidad-farmaceutica', 'Auditoría de Calidad Farmacéutica'],
    ],
  },
  {
    area: 'Asuntos regulatorios',
    para: 'Para entender el registro sanitario y los trámites ante el INVIMA, una de las áreas con más vacantes.',
    cursos: [
      ['/curso-de-asuntos-regulatorios-farmaceuticos-en-colombia', 'Asuntos Regulatorios Farmacéuticos en Colombia'],
      ['/curso-de-asuntos-regulatorios-sanitarios-ante-invima', 'Asuntos Regulatorios Sanitarios ante el INVIMA'],
      ['/curso-de-registro-sanitario-de-medicamentos-ante-el-invima', 'Registro Sanitario de Medicamentos ante el INVIMA'],
      ['/curso-de-elaboracion-de-dossiers-farmaceuticos', 'Elaboración de Dossiers Farmacéuticos'],
      ['/curso-de-estudios-de-estabilidad-de-medicamentos', 'Estudios de Estabilidad para el Registro de Medicamentos'],
      ['/curso-de-bioequivalencia-y-requisitos-regulatorios-en-colombia', 'Bioequivalencia y Requisitos Regulatorios en Colombia'],
      ['/curso-de-etiquetado-e-insertos-de-medicamentos', 'Etiquetado e Insertos de Medicamentos'],
      ['/curso-de-modificaciones-al-registro-sanitario-de-medicamentos', 'Modificaciones al Registro Sanitario de Medicamentos'],
      ['/curso-de-renovacion-de-registros-sanitarios-de-medicamentos', 'Renovación de Registros Sanitarios de Medicamentos'],
      ['/curso-de-respuesta-a-requerimientos-del-invima', 'Respuesta a Requerimientos del INVIMA'],
      ['/curso-de-gestion-documental-de-tramites-ante-el-invima', 'Gestión Documental de Trámites ante el INVIMA'],
    ],
  },
  {
    area: 'Asuntos regulatorios de productos especiales',
    para: 'Biológicos, vacunas, biosimilares, fitoterapéuticos y otros productos con reglas propias.',
    cursos: [
      ['/curso-de-registro-sanitario-de-medicamentos-biologicos', 'Registro Sanitario de Medicamentos Biológicos'],
      ['/curso-de-registro-sanitario-de-vacunas', 'Registro Sanitario de Vacunas'],
      ['/curso-de-regulacion-de-medicamentos-biosimilares', 'Regulación de Medicamentos Biosimilares'],
      ['/curso-de-registro-sanitario-de-productos-fitoterapeuticos', 'Registro Sanitario de Productos Fitoterapéuticos'],
      ['/curso-de-registro-sanitario-de-suplementos-dietarios', 'Registro Sanitario de Suplementos Dietarios'],
      ['/curso-de-regulacion-de-medicamentos-homeopaticos', 'Regulación de Medicamentos Homeopáticos'],
      ['/curso-de-regulacion-del-cannabis-medicinal', 'Regulación Sanitaria del Cannabis Medicinal en Colombia'],
      ['/curso-de-regulacion-sanitaria-de-gases-medicinales', 'Regulación Sanitaria de Gases Medicinales'],
      ['/curso-de-asuntos-regulatorios-de-radiofarmacos', 'Asuntos Regulatorios de Radiofármacos'],
      ['/curso-de-medicamentos-vitales-no-disponibles', 'Importación de Medicamentos Vitales No Disponibles'],
    ],
  },
  {
    area: 'Farmacología',
    para: 'Para repasar por sistemas antes de un parcial, del internado o de una entrevista clínica.',
    cursos: [
      ['/curso-de-farmacologia-cardiovascular', 'Farmacología Cardiovascular'],
      ['/curso-de-anticoagulantes-y-antiagregantes', 'Farmacología de Anticoagulantes y Antiagregantes'],
      ['/curso-de-farmacologia-del-sistema-nervioso-central', 'Farmacología del Sistema Nervioso Central'],
      ['/curso-de-psicofarmacologia', 'Psicofarmacología'],
      ['/curso-de-farmacologia-endocrina', 'Farmacología Endocrina'],
      ['/curso-de-farmacologia-gastrointestinal', 'Farmacología Gastrointestinal'],
      ['/curso-de-farmacologia-renal', 'Farmacología Renal'],
      ['/curso-de-farmacologia-respiratoria', 'Farmacología Respiratoria'],
      ['/curso-de-farmacologia-oncologica', 'Farmacología Oncológica'],
      ['/curso-de-quimioterapia-antineoplasica', 'Quimioterapia Antineoplásica'],
      ['/curso-de-terapias-dirigidas-en-oncologia', 'Terapias Dirigidas en Oncología'],
      ['/curso-de-inmunoterapia-oncologica', 'Inmunoterapia Oncológica'],
    ],
  },
  {
    area: 'Farmacoterapia',
    para: 'Casos clínicos de las enfermedades crónicas que más verás en la farmacia y en el hospital.',
    cursos: [
      ['/curso-de-farmacoterapia-de-la-hipertension-arterial', 'Farmacoterapia de la Hipertensión Arterial'],
      ['/curso-de-farmacoterapia-de-la-diabetes', 'Farmacoterapia de la Diabetes'],
      ['/curso-de-farmacoterapia-de-la-insuficiencia-cardiaca', 'Farmacoterapia de la Insuficiencia Cardíaca'],
      ['/curso-de-farmacoterapia-del-asma-y-la-epoc', 'Farmacoterapia del Asma y la EPOC'],
    ],
  },
  {
    area: 'Servicio farmacéutico',
    para: 'Para prácticas en farmacia magistral, centrales de mezclas y servicios hospitalarios.',
    cursos: [
      ['/curso-de-bpe-y-preparaciones-magistrales', 'Buenas Prácticas de Elaboración (BPE) y Preparaciones Magistrales'],
      ['/curso-de-central-de-mezclas', 'Central de Mezclas: Preparaciones Estériles'],
    ],
  },
  {
    area: 'Habilidades para el trabajo',
    para: 'Las que se evalúan en entrevistas, sustentaciones y en el trato con pacientes.',
    cursos: [
      ['/curso-de-comunicacion-asertiva', 'Comunicación Asertiva en el Trabajo'],
      ['/curso-de-servicio-al-cliente', 'Servicio al Cliente y Comunicación con el Paciente'],
      ['/curso-de-oratoria', 'Oratoria: cómo hablar en público con seguridad'],
      ['/curso-para-perder-el-miedo-a-hablar-en-publico', 'Perder el miedo a hablar en público'],
      ['/curso-de-presentaciones-efectivas-y-storytelling', 'Presentaciones Efectivas y Storytelling'],
      ['/curso-para-hablar-frente-a-la-camara', 'Hablar frente a la cámara'],
      ['/curso-de-lenguaje-corporal-y-comunicacion-no-verbal', 'Lenguaje Corporal y Comunicación No Verbal'],
      ['/curso-de-inteligencia-emocional', 'Inteligencia Emocional en el Trabajo'],
      ['/curso-de-liderazgo-y-trabajo-en-equipo', 'Liderazgo y Trabajo en Equipo'],
      ['/curso-de-negociacion-y-persuasion', 'Negociación y Persuasión'],
    ],
  },
];

export const TOTAL_CURSOS_GRATIS = CURSOS_POR_AREA.reduce((n, a) => n + a.cursos.length, 0);

/** Para cada momento de la carrera. */
export const HERRAMIENTAS_CARRERA = [
  { to: '/orientacion-vocacional', titulo: 'Orientación vocacional', desc: 'Para descubrir qué área del ejercicio farmacéutico va con tu perfil.' },
  { to: '/practicas-profesionales-farmaceuticas', titulo: 'Prácticas profesionales', desc: 'Cómo prepararte para las prácticas y qué esperan los sitios de práctica.' },
  { to: '/hoja-de-vida', titulo: 'Hoja de vida', desc: 'Crea tu hoja de vida con formato que pasan los filtros de selección, y descárgala en Word o PDF.' },
  { to: '/linkedin-farmaceutico', titulo: 'LinkedIn farmacéutico', desc: 'Cómo armar un perfil que encuentren los reclutadores del sector.' },
  { to: '/empleo/ofertas-para-quimicos-farmaceuticos', titulo: 'Ofertas para químicos farmacéuticos', desc: 'Dónde buscar vacantes y cómo leer los requisitos de cada cargo.' },
  { to: '/noticias', titulo: 'Alertas y noticias regulatorias', desc: 'Alertas del INVIMA y de agencias de referencia, explicadas para Colombia y con su fuente oficial.' },
];

/** El bloque que un docente o una oficina de egresados puede pegar en su sitio. */
export const TEXTO_PARA_ENLAZAR = 'Recursos gratuitos para estudiantes de Química Farmacéutica (Edvanta): cursos de BPM, asuntos regulatorios, farmacología y farmacoterapia, guías de carrera y alertas del INVIMA.';
export const HTML_PARA_ENLAZAR = `<a href="${URL_RECURSOS_ESTUDIANTES}">Recursos gratuitos para estudiantes de Química Farmacéutica (Edvanta)</a>: cursos de BPM, asuntos regulatorios, farmacología y farmacoterapia, guías de carrera y alertas del INVIMA.`;

export const PREGUNTAS_RECURSOS = [
  ['¿Los cursos son gratis de verdad?', 'Sí. Todo el contenido de los cursos de esta página es gratuito: clases, casos y evaluaciones. El certificado verificable es opcional y cuesta COP 60.000 por curso, solo si lo necesitas para tu hoja de vida.'],
  ['¿Quién prepara los cursos?', 'Los imparte Edvanta, una empresa colombiana de educación farmacéutica. La línea editorial y la revisión clínica están a cargo de Karla Hernández, química farmacéutica clínica de la Universidad del Atlántico.'],
  ['¿Sirven para Regencia de Farmacia?', 'Varios sí: los de buenas prácticas, servicio farmacéutico, farmacología y habilidades para el trabajo también son útiles en Regencia de Farmacia. En la ficha de cada curso dice a quién va dirigido.'],
  ['¿Puedo citar el material de Edvanta en un trabajo académico?', 'Sí. Cada artículo trae la cita lista en Vancouver y APA, y en la página de prensa está la forma de citar a Edvanta como organización.'],
  ['¿Cómo enlazo esta página desde la web de mi programa o de mi semillero?', 'Copia el bloque «Para docentes y oficinas de egresados» de esta página y pégalo en su sección de recursos, de egresados o en el aula virtual.'],
  ['¿Hacen charlas para semilleros o grupos de estudio?', 'Sí. Edvanta ofrece charlas y talleres virtuales para estudiantes, semilleros y asociados. Las condiciones están en la página de alianzas.'],
];

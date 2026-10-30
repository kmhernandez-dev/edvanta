/**
 * ============================================================
 *  contigo.js — Edvanta Contigo
 *
 *  Contenido de la capa pública y del portal de entrada. Las rutas
 *  de condición salen de programas.js para no duplicar el catálogo.
 *  Las herramientas reales viven en Feliz Sin Tiroides (/fst-app);
 *  aquí solo se enlazan.
 *
 *  Los planes y la consulta son propuestas con precios de prueba.
 *  No hay profesionales verificados ni agenda activa: la red se
 *  presenta como en preparación hasta que exista.
 * ============================================================
 */

import { RUTAS_CONTIGO as RUTAS_BASE } from './programas.js';

const NOMBRE = {
  tiroides: 'Salud tiroidea',
  'ruta-diabetes': 'Diabetes',
  'ruta-renal': 'Salud renal',
  'ruta-cardiovascular': 'Salud cardiovascular',
  'ruta-respiratoria': 'Salud respiratoria',
  'ruta-oncologica': 'Apoyo oncológico',
};

const SLUG = {
  tiroides: 'tiroides',
  'ruta-diabetes': 'diabetes',
  'ruta-renal': 'renal',
  'ruta-cardiovascular': 'cardiovascular',
  'ruta-respiratoria': 'respiratoria',
  'ruta-oncologica': 'oncologica',
};

const DESCRIPCION = {
  tiroides: 'Hipotiroidismo, Hashimoto, vivir sin tiroides y cómo tomar la levotiroxina.',
  'ruta-diabetes': 'Para comprender la diabetes, sus medicamentos y el día a día.',
  'ruta-renal': 'Para quienes viven con enfermedad renal y para sus cuidadores.',
  'ruta-cardiovascular': 'Presión arterial, colesterol y medicamentos del corazón.',
  'ruta-respiratoria': 'Asma, EPOC y el uso correcto de los inhaladores.',
  'ruta-oncologica': 'Para pacientes en tratamiento oncológico y sus familias.',
};

export const CONTIGO = {
  nombre: 'Edvanta Contigo',
  eyebrow: 'Edvanta Contigo',
  titulo: 'Tu salud merece un espacio que te acompañe',
  lead: 'Comprende tu tratamiento, organiza tu cuidado y encuentra profesionales que puedan ayudarte.',
  imagen: '/img/fotos/pacientes-taller.webp',
  imagenAlt: 'Química farmacéutica explicando una cartilla educativa a pacientes y cuidadores',
};

/** Las seis rutas, con la única abierta y las demás en lista de interés. */
export const CONTIGO_RUTAS = RUTAS_BASE.map((r) => {
  const slug = SLUG[r.slug] || r.slug;
  return {
    ...r,
    slug,
    nombre: NOMBRE[r.slug] || r.nombre,
    texto: DESCRIPCION[r.slug] || r.texto,
    imagen: r.imagen,
    estado: r.estado,
    to: r.estado === 'disponible' ? '/contigo/tiroides' : `/contigo/${slug}/interes`,
    interes: r.estado !== 'disponible',
  };
});

export const CONTIGO_RUTAS_DISPONIBLES = CONTIGO_RUTAS.filter((r) => r.estado === 'disponible');
export const CONTIGO_RUTAS_FUTURAS = CONTIGO_RUTAS.filter((r) => r.estado !== 'disponible');
export const rutaContigoPorSlug = (slug) => CONTIGO_RUTAS.find((r) => r.slug === slug) || null;

export const CONTIGO_NECESIDADES = [
  {
    id: 'aprender',
    titulo: 'Aprender y conectar',
    texto: 'Guías, encuentros y una comunidad para entender tu condición y dejar de sentir que empiezas de cero.',
    to: '/contigo/tiroides',
    cta: 'Explorar salud tiroidea',
    icono: 'BookOpen',
    tono: 'lavanda',
  },
  {
    id: 'organizar',
    titulo: 'Organizar mi cuidado',
    texto: 'Medicamentos, documentos y preguntas en un espacio privado que puedes abrir cuando lo necesites.',
    to: '/mi-cuidado',
    cta: 'Conocer Mi cuidado',
    icono: 'HeartPulse',
    tono: 'menta',
  },
  {
    id: 'atencion',
    titulo: 'Recibir acompañamiento',
    texto: 'La red profesional está en preparación. Puedes conocer cómo funcionará y dejar tu interés.',
    to: '/contigo/profesionales',
    cta: 'Ver la red profesional',
    icono: 'Stethoscope',
    tono: 'lavanda',
  },
];

/** Herramientas existentes y su destino real. */
export const CONTIGO_HERRAMIENTAS = [
  {
    id: 'medicamentos',
    titulo: 'Mis medicamentos',
    texto: 'Organiza una pauta ya confirmada por tu equipo de salud y registra tus tomas.',
    to: '/fst-app/levotiroxina',
    estado: 'disponible',
    icono: 'Pill',
  },
  {
    id: 'laboratorios',
    titulo: 'Mis laboratorios',
    texto: 'Guarda tus resultados y documentos para llevarlos a tu próxima consulta.',
    to: '/fst-app/laboratorios',
    estado: 'disponible',
    icono: 'FileText',
  },
  {
    id: 'consulta',
    titulo: 'Preparar mi consulta',
    texto: 'Escribe las preguntas que no quieres olvidar y llega con tus objetivos claros.',
    to: '/fst-app/consulta',
    estado: 'disponible',
    icono: 'Stethoscope',
  },
  {
    id: 'citas',
    titulo: 'Mis citas',
    texto: 'Ten a mano la próxima consulta y los temas que quieres revisar.',
    to: '/fst-app/citas',
    estado: 'disponible',
    icono: 'CalendarDays',
  },
  {
    id: 'comunidad',
    titulo: 'Comunidad',
    texto: 'Un espacio voluntario para compartir experiencias. No es un canal de consultas clínicas.',
    to: '/feliz-sin-tiroides#comunidad',
    estado: 'disponible',
    icono: 'Users',
  },
  {
    id: 'plan',
    titulo: 'Mi plan',
    texto: 'Los acuerdos del acompañamiento profesional aparecerán aquí cuando el servicio esté habilitado.',
    to: null,
    estado: 'en_preparacion',
    icono: 'ClipboardList',
  },
];

export const CONTIGO_PASOS = [
  { titulo: 'Elige tu ruta', desc: 'Empieza por la condición que te importa o consulta las que están en preparación.', icono: 'Compass' },
  { titulo: 'Crea tu cuenta', desc: 'Una sola cuenta para tus rutas, documentos y herramientas. Tú decides qué compartir.', icono: 'UserRound' },
  { titulo: 'Usa tu espacio', desc: 'Organiza medicamentos, documentos y preguntas. El acceso a la comunidad es opcional.', icono: 'HeartPulse' },
  { titulo: 'Busca acompañamiento', desc: 'Cuando la red esté habilitada, podrás conocer profesionales, alcance, precio y disponibilidad.', icono: 'Stethoscope' },
];

export const CONTIGO_PLANES = [
  {
    id: 'comunidad',
    nombre: 'Comunidad abierta',
    lema: 'Para empezar a comprender tu cuidado',
    precio: 'Gratis',
    nota: 'Abierta hoy para salud tiroidea.',
    estado: 'disponible',
    incluye: [
      'Bienvenida y guías iniciales',
      'Contenido breve y revisado',
      'Acceso a la comunidad de Feliz Sin Tiroides',
    ],
    cta: { label: 'Ir a la comunidad', to: '/feliz-sin-tiroides#comunidad' },
  },
  {
    id: 'plus',
    nombre: 'Contigo Plus',
    lema: 'Para organizar el cuidado de forma continua',
    precio: '$39.000 COP/mes',
    nota: 'Precio de prueba. No se cobra en esta versión.',
    estado: 'en_preparacion',
    incluye: [
      'Biblioteca ampliada por ruta',
      'Herramientas personales de cuidado',
      'Dos encuentros educativos grupales al mes, como hipótesis',
    ],
    cta: { label: 'Recibir novedades', to: '/contigo/planes#interes' },
  },
  {
    id: 'consulta',
    nombre: 'Acompañamiento farmacéutico individual',
    lema: 'Para revisar medicamentos y barreras de adherencia',
    precio: '$120.000 COP por encuentro',
    nota: 'Precio de ejemplo. La red y las reservas aún no están habilitadas.',
    estado: 'en_preparacion',
    incluye: [
      'Encuentro con un químico farmacéutico',
      'Objetivos y resumen de acuerdos',
      'Seguimiento solo si el servicio lo especifica',
    ],
    cta: { label: 'Conocer la propuesta', to: '/contigo/profesionales' },
  },
  {
    id: 'nutricion-psicologia',
    nombre: 'Nutrición o psicología',
    lema: 'Cuando la necesidad es de otra disciplina',
    precio: 'Precio por acordar',
    nota: 'El alcance y el precio los define el profesional responsable.',
    estado: 'en_preparacion',
    incluye: [
      'Servicio individual definido por el profesional',
      'Alcance y condiciones propias',
      'No se copia automáticamente la tarifa farmacéutica',
    ],
    cta: { label: 'Dejar mi interés', to: '/contigo/planes#interes' },
  },
  {
    id: 'instituciones',
    nombre: 'Convenio institucional',
    lema: 'Para organizaciones y asociaciones',
    precio: 'Según población y alcance',
    nota: 'Propuesta B2B con alcance definido.',
    estado: 'en_preparacion',
    incluye: [
      'Cohortes educativas',
      'Acompañamiento contratado',
      'Presupuesto según trabajo requerido',
    ],
    cta: { label: 'Ver Ruta Contigo', to: '/instituciones/paquetes/ruta-contigo' },
  },
];

/** Una propuesta de servicio; todavía sin profesional ni agenda. */
export const CONTIGO_SERVICIOS = [
  {
    slug: 'consulta-farmaceutica',
    nombre: 'Consulta farmacéutica individual',
    estado: 'en_preparacion',
    precio: '$120.000 COP (precio de ejemplo)',
    descripcion: 'Un encuentro para revisar el uso de tus medicamentos, las barreras de adherencia y las preguntas que quieres llevar a tu equipo de salud.',
    incluye: [
      'Revisión de la información que compartas.',
      'Objetivos y resumen de acuerdos.',
      'Derivación cuando la necesidad exceda el alcance.',
    ],
    noIncluye: [
      'Diagnóstico, cambio de dosis o suspensión de medicamentos.',
      'Atención de urgencias.',
      'Seguimiento ilimitado.',
    ],
  },
];

export const servicioContigoPorSlug = (slug) => CONTIGO_SERVICIOS.find((s) => s.slug === slug) || null;

/** No hay perfiles verificados: la red se muestra como en preparación. */
export const CONTIGO_PROFESIONALES = [];

export const RED_PROFESIONAL = {
  nombre: 'Red de profesionales de Edvanta Contigo',
  estado: 'en_preparacion',
  lead: 'Estamos preparando la vinculación de profesionales verificados. Todavía no hay agendas ni reservas activas.',
  requisitos: [
    'Título profesional y formación verificable.',
    'Experiencia pertinente al servicio que se quiere ofrecer.',
    'País de atención y alcance definidos.',
    'Aceptación de las condiciones de privacidad y del proceso de atención.',
  ],
  pasos: [
    'Solicitud de vinculación.',
    'Revisión documental.',
    'Verificación profesional aplicable.',
    'Delimitación de servicios y acuerdo de privacidad.',
    'Capacitación en el proceso y activación de agenda.',
  ],
};

export const CONTIGO_FAQ = [
  {
    q: '¿Qué puedo usar hoy en Edvanta Contigo?',
    a: 'La ruta de salud tiroidea de Feliz Sin Tiroides: guías, contenido educativo, comunidad y las herramientas privadas de /fst-app. Las demás rutas están en lista de interés.',
  },
  {
    q: '¿Edvanta Contigo es una consulta médica?',
    a: 'No. La educación y las herramientas no diagnostican ni cambian tratamientos. La consulta farmacéutica es una propuesta en preparación y no sustituye a tu equipo de salud.',
  },
  {
    q: '¿Necesito entrar a Discord?',
    a: 'No. La comunidad es opcional. Las herramientas y los servicios, cuando estén habilitados, se usan desde tu cuenta sin depender de Discord.',
  },
  {
    q: '¿La membresía y la consulta ya se pueden pagar?',
    a: 'No. Los precios que aparecen son de prueba y los servicios están en preparación. Esta versión no procesa cobros ni reservas.',
  },
  {
    q: '¿Qué pasa con mis datos?',
    a: 'Las herramientas privadas viven en tu espacio de Feliz Sin Tiroides. No publiques información clínica en la comunidad. La atención individual solo se abrirá cuando el responsable, el alcance y las condiciones estén definidos.',
  },
  {
    q: '¿Cómo puedo ser parte de la red profesional?',
    a: 'Puedes enviar tu solicitud desde /contigo/red-profesional. La solicitud no habilita atención automáticamente: pasa por revisión y verificación.',
  },
];

export const CONTIGO_RIESGO = [
  'No cambies ni suspendas medicamentos por información de esta página.',
  'No interpretamos automáticamente resultados de laboratorio.',
  'Si tienes una urgencia, acude a un servicio de salud o llama a la línea de emergencias de tu ciudad.',
];
